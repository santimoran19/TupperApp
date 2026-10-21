// Gasto y ejercicio (F-19, fases 1 y 2): prender el cálculo con consentimiento, ver cómo se arma el gasto, elegir el modo del
// objetivo, anotar, corregir y borrar entrenamientos, crear una actividad propia, apagar y borrar todo. Usa la sesión de las anteriores.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, pedir, rest, sinErrores } from './apoyo.js'

const numero = (t) => Number(String(t).replace(/\./g, '').replace(/[^\d]/g, ''))

test('gasto y ejercicio: activar, calcular, anotar entrenamientos y apagar', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  const perfil = async () => (await rest(pg, 'profiles'))[0]
  const seccion = (titulo) => pg.locator('section', { hasText: titulo })
  let mantenimiento = 0

  await test.step('partir de los pesos del alta: las pruebas anteriores cargaron otros y los números de acá dependen del peso', async () => {
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await pedir(pg, 'DELETE', 'measurements', '?date=gte.2000-01-01')
    await pedir(pg, 'POST', 'measurements', '?on_conflict=user_id,date', [{ date: '2026-10-03', weight_kg: 80 }], {
      Prefer: 'resolution=merge-duplicates',
    })
  })

  await test.step('sin activar: nada cambia y el perfil lo ofrece', async () => {
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await expect(pg.getByText('GASTO DEL DÍA')).toHaveCount(0)
    await pg.goto(APP + '/perfil')
    await expect(pg.getByRole('link', { name: /Gasto y ejercicio \(opcional\)/ })).toBeVisible()
    await expect(pg.getByRole('link', { name: 'Mi ejercicio' })).toHaveCount(0)
    await pg.goto(APP + '/ejercicio')
    await expect(pg.getByText('Primero activá el cálculo de gasto')).toBeVisible()
    expect((await perfil()).gasto_activo).toBe(false)
  })

  await test.step('activar pide consentimiento y no cambia nada si se dice que no', async () => {
    await pg.goto(APP + '/gasto')
    await pg.getByRole('button', { name: 'Activar el cálculo de gasto' }).click()
    await expect(pg.getByText('Antes de activar')).toBeVisible()
    await expect(pg.getByText('datos de salud')).toBeVisible()
    await captura(pg, 's92_gasto_consentimiento', false)
    await pg.getByRole('button', { name: 'Ahora no' }).click()
    await expect(pg.getByText('Antes de activar')).toHaveCount(0)
    expect((await perfil()).gasto_activo).toBe(false)
    await pg.getByRole('button', { name: 'Activar el cálculo de gasto' }).click()
    await pg.getByRole('button', { name: 'Acepto y activo el cálculo' }).click()
    await expect(pg.getByText('Tu gasto de un día sin entrenar')).toBeVisible()
    const p = await perfil()
    expect(p.gasto_activo).toBe(true)
    expect(p.gasto_consentimiento, 'tiene que quedar la fecha del consentimiento').toBeTruthy()
    expect(p.gasto_modo).toBe('fijo')
    await expect(pg.getByRole('link', { name: /Mi ejercicio/ })).toBeVisible()
  })

  await test.step('cómo se calcula: partes, rango y supuestos a la vista', async () => {
    const tarjeta = seccion('Tu gasto de un día sin entrenar').first()
    await expect(tarjeta.getByText('Metabolismo basal')).toBeVisible()
    await expect(tarjeta.getByText('Movimiento del día a día')).toBeVisible()
    await expect(tarjeta.getByText('Efecto térmico de la comida')).toBeVisible()
    await expect(tarjeta.getByText('Mifflin-St Jeor')).toBeVisible()
    await expect(tarjeta.getByText('Lo que estamos suponiendo')).toBeVisible()
    await expect(tarjeta.getByText(/Entre .* y /).first()).toBeVisible()
    mantenimiento = numero(await tarjeta.locator('p.text-3xl').innerText())
    // Santi: hombre, 22 años, 170 cm y 80 kg, sentado casi todo el día: unas 2.190 kcal
    expect(mantenimiento).toBeGreaterThan(2100)
    expect(mantenimiento).toBeLessThan(2300)
    await captura(pg, 's93_gasto_calculo', false)
  })

  await test.step('con el trabajo y los pasos, el gasto sube y queda guardado', async () => {
    const datos = seccion('Tus datos para el cálculo').first()
    await expect(datos.getByRole('button', { name: 'Guardar' })).toBeDisabled()
    await datos.getByRole('button', { name: /De pie o caminando/ }).click()
    await datos.getByPlaceholder(/Por ejemplo, 6000/).fill('8000')
    await datos.getByLabel('% de grasa corporal').fill('20')
    await expect(datos.getByText('Tiene que estar entre 3 y 60.')).toHaveCount(0)
    await datos.getByLabel('% de grasa corporal').fill('80')
    await expect(datos.getByText('Tiene que estar entre 3 y 60.')).toBeVisible()
    await expect(datos.getByRole('button', { name: 'Guardar' })).toBeDisabled()
    await datos.getByLabel('% de grasa corporal').fill('')
    await datos.getByRole('button', { name: 'Guardar' }).click()
    await expect.poll(async () => (await perfil()).steps_per_day).toBe(8000)
    const p = await perfil()
    expect(p.work_type).toBe('de_pie')
    expect(p.body_fat_pct).toBeNull()
    const nuevo = numero(await seccion('Tu gasto de un día sin entrenar').first().locator('p.text-3xl').innerText())
    expect(nuevo).toBeGreaterThan(mantenimiento + 300)
    mantenimiento = nuevo
  })

  await test.step('el objetivo: modo que se ajusta cada día', async () => {
    const objetivo = seccion('Tu objetivo de calorías').first()
    await objetivo.getByRole('button', { name: 'Se ajusta cada día' }).click()
    await expect(objetivo.getByText('Qué parte del ejercicio se suma al objetivo')).toBeVisible()
    await objetivo.getByLabel(/Qué parte del ejercicio/).fill('150')
    await expect(objetivo.getByText('Tiene que estar entre 0 y 100.')).toBeVisible()
    await objetivo.getByLabel(/Qué parte del ejercicio/).fill('50')
    await objetivo.getByRole('button', { name: 'Guardar' }).click()
    await expect.poll(async () => (await perfil()).gasto_modo).toBe('dinamico')
    expect((await perfil()).gasto_devuelve).toBe(50)
    await captura(pg, 's94_gasto_objetivo', false)
  })

  let kcalEntreno = 0
  await test.step('anotar un entrenamiento con distancia', async () => {
    await pg.goto(APP + '/ejercicio')
    await expect(pg.getByText('Todavía no anotaste entrenamientos')).toBeVisible()
    await pg.getByRole('button', { name: 'Anotar un entrenamiento' }).click()
    await expect(pg.getByText('Elegí la actividad')).toBeVisible()
    await pg.getByLabel('Buscar actividad').fill('trote')
    await pg.getByRole('button', { name: /Trote suave/ }).click()
    // Sin duración no se puede guardar
    await expect(pg.getByRole('button', { name: 'Guardar entrenamiento' })).toBeEnabled()
    await pg.getByLabel('Duración (minutos)').fill('40')
    await pg.getByLabel('Distancia (km)').fill('6')
    await expect(pg.getByText('Gastaste aproximadamente')).toBeVisible()
    await expect(pg.getByText(/método: distancia y ritmo/)).toBeVisible()
    await captura(pg, 's95_entrenamiento_form', false)
    await pg.getByRole('button', { name: 'Guardar entrenamiento' }).click()
    await expect(pg.getByText('Entrenamiento anotado')).toBeVisible()
    const filas = await rest(pg, 'workouts')
    expect(filas).toHaveLength(1)
    expect(filas[0]).toMatchObject({ name: 'Trote suave', duration_min: 40, metodo: 'distancia', fecha: '2026-10-03' })
    kcalEntreno = Number(filas[0].kcal)
    // 6 km en 40 minutos (150 m/min) con 80 kg: VO2 de 33,5 → 536 kcal, menos 49 de basal = 487 netas
    expect(kcalEntreno).toBe(487)
    expect(Number(filas[0].peso_kg)).toBe(80)
    await expect(pg.getByText(`~${kcalEntreno.toLocaleString('es-AR')} kcal`).first()).toBeVisible()
    await captura(pg, 's96_ejercicio_lista', false)
  })

  await test.step('el diario muestra el gasto del día y el objetivo que se ajusta', async () => {
    await pg.goto(APP + '/')
    await expect(pg.getByText('GASTO DEL DÍA')).toBeVisible()
    const tarjeta = pg.locator('section', { hasText: 'GASTO DEL DÍA' })
    await expect(tarjeta.getByText(`+${kcalEntreno.toLocaleString('es-AR')}`)).toBeVisible()
    await expect(tarjeta.getByText('Tu objetivo de hoy se ajusta con el ejercicio.')).toBeVisible()
    const objetivoHoy = numero(await pg.locator('text=/kcal de [\\d.]+/').first().innerText())
    // Lo mismo que dice el perfil
    await pg.goto(APP + '/perfil')
    await expect(pg.getByText(/El de calorías se ajusta con tu ejercicio \(hoy: [\d.]+ kcal\)/)).toBeVisible()
    const dePerfil = numero((await pg.getByText(/hoy: [\d.]+ kcal/).innerText()).match(/hoy: ([\d.]+) kcal/)[1])
    expect(dePerfil).toBe(objetivoHoy)
    await captura(pg, 's97_diario_con_gasto')
    // Sin el ejercicio de hoy, el objetivo sería menor: el ejercicio suma la mitad de lo gastado
    expect(objetivoHoy).toBeGreaterThan(Math.round(kcalEntreno * 0.5) + 1000)
  })

  await test.step('corregir el entrenamiento recalcula las calorías', async () => {
    await pg.goto(APP + '/ejercicio')
    await pg.getByRole('button', { name: 'Corregir Trote suave' }).click()
    await expect(pg.getByText('Corregir entrenamiento')).toBeVisible()
    await pg.getByLabel('Duración (minutos)').fill('60')
    await pg.getByRole('button', { name: 'Guardar cambios' }).click()
    await expect(pg.getByText('Entrenamiento corregido')).toBeVisible()
    const filas = await rest(pg, 'workouts')
    expect(filas).toHaveLength(1)
    expect(filas[0].duration_min).toBe(60)
    expect(Number(filas[0].kcal)).toBeGreaterThan(kcalEntreno)
  })

  await test.step('las calorías del reloj: activas valen tal cual; totales se descuenta el reposo', async () => {
    await pg.getByRole('button', { name: 'Corregir Trote suave' }).click()
    await pg.getByText('Tengo datos del reloj o de la banda').click()
    // Sin calorías del reloj no se pregunta cuáles son
    await expect(pg.getByText('Esas calorías son…')).toHaveCount(0)
    await pg.getByLabel('Calorías del reloj').fill('400')
    await expect(pg.getByText('Esas calorías son…')).toBeVisible()
    await expect(pg.getByRole('button', { name: 'Totales' })).toHaveAttribute('aria-pressed', 'true')
    await pg.getByRole('button', { name: 'Activas' }).click()
    await expect(pg.getByRole('button', { name: 'Activas' })).toHaveAttribute('aria-pressed', 'true')
    await pg.getByRole('button', { name: 'Guardar cambios' }).click()
    await expect(pg.getByText('Entrenamiento corregido')).toBeVisible()
    let w = (await rest(pg, 'workouts'))[0]
    expect(w).toMatchObject({ kcal_watch: 400, watch_activas: true, metodo: 'reloj' })
    expect(Number(w.kcal)).toBe(400)
    // Al volver a abrirlo se acuerda de que eran activas, y pasarlas a totales descuenta el reposo de esos 60 minutos
    await pg.getByRole('button', { name: 'Corregir Trote suave' }).click()
    await expect(pg.getByLabel('Calorías del reloj')).toHaveValue('400')
    await expect(pg.getByRole('button', { name: 'Activas' })).toHaveAttribute('aria-pressed', 'true')
    await pg.getByRole('button', { name: 'Totales' }).click()
    await pg.getByRole('button', { name: 'Guardar cambios' }).click()
    await expect(pg.getByText('Entrenamiento corregido')).toBeVisible()
    w = (await rest(pg, 'workouts'))[0]
    expect(w).toMatchObject({ kcal_watch: 400, watch_activas: false })
    expect(Number(w.kcal)).toBeGreaterThan(300)
    expect(Number(w.kcal)).toBeLessThan(350)
  })

  await test.step('actividad propia: se crea, se usa y al borrarla el historial se queda', async () => {
    await pg.getByRole('button', { name: 'Anotar', exact: true }).click()
    await pg.getByRole('button', { name: /Crear una actividad propia/ }).click()
    await expect(pg.getByRole('button', { name: 'Crear actividad' })).toBeDisabled()
    await pg.getByPlaceholder('Por ejemplo, Hockey').fill('Hockey')
    await pg.getByRole('button', { name: 'Crear actividad' }).click()
    await expect(pg.getByLabel('Anotar entrenamiento').getByText('Hockey', { exact: true })).toBeVisible()
    await pg.getByLabel('Duración (minutos)').fill('60')
    await pg.getByRole('button', { name: 'Fuerte' }).click()
    await pg.getByRole('button', { name: 'Guardar entrenamiento' }).click()
    await expect(pg.getByText('Entrenamiento anotado')).toBeVisible()
  })
  await test.step('la actividad propia está en la base y se puede borrar', async () => {
    const todas = await rest(pg, 'exercise_types', '&name=eq.Hockey')
    expect(todas).toHaveLength(1)
    expect(todas[0].owner).toBeTruthy()
    await expect(pg.getByText('Mis actividades')).toBeVisible()
    await pg.getByRole('button', { name: 'Borrar Hockey' }).last().click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
    await expect(pg.getByText('Actividad borrada')).toBeVisible()
    expect(await rest(pg, 'exercise_types', '&name=eq.Hockey')).toHaveLength(0)
    const hockey = (await rest(pg, 'workouts')).find((w) => w.name === 'Hockey')
    expect(hockey, 'el entrenamiento se queda con su nombre').toBeTruthy()
    expect(hockey.type_id).toBeNull()
  })

  await test.step('borrar un entrenamiento pide confirmación', async () => {
    await pg.getByRole('button', { name: 'Borrar Hockey' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Cancelar' }).click()
    expect((await rest(pg, 'workouts')).length).toBe(2)
    await pg.getByRole('button', { name: 'Borrar Hockey' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
    await expect(pg.getByText('Entrenamiento borrado')).toBeVisible()
    expect((await rest(pg, 'workouts')).length).toBe(1)
  })

  await test.step('apagar el cálculo: vuelve el objetivo fijo y lo anotado se guarda', async () => {
    await pg.goto(APP + '/gasto')
    await pg.getByRole('button', { name: 'Apagar el cálculo de gasto' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Apagar' }).click()
    await expect(pg.getByRole('button', { name: 'Activar el cálculo de gasto' })).toBeVisible()
    const p = await perfil()
    expect(p.gasto_activo).toBe(false)
    expect(p.gasto_modo).toBe('fijo')
    expect(await rest(pg, 'workouts')).toHaveLength(1)
    await pg.goto(APP + '/')
    await expect(pg.getByText('GASTO DEL DÍA')).toHaveCount(0)
    await expect(pg.locator(`text=kcal de ${p.kcal_target.toLocaleString('es-AR')}`)).toBeVisible()
  })

  await test.step('volver a prender y borrar todo lo de ejercicio', async () => {
    await pg.goto(APP + '/gasto')
    await pg.getByRole('button', { name: 'Activar el cálculo de gasto' }).click()
    await pg.getByRole('button', { name: 'Acepto y activo el cálculo' }).click()
    await expect(pg.getByText('Tu gasto de un día sin entrenar')).toBeVisible()
    // El entrenamiento de antes sigue ahí
    await pg.goto(APP + '/ejercicio')
    await expect(pg.getByText('Trote suave')).toBeVisible()
    await pg.goto(APP + '/gasto')
    await pg.getByRole('button', { name: 'Borrar todo lo de ejercicio' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar todo' }).click()
    await expect(pg.getByText('Se borró todo lo de ejercicio')).toBeVisible()
    expect(await rest(pg, 'workouts')).toHaveLength(0)
    expect((await perfil()).gasto_activo, 'borrar lo anotado no apaga el cálculo').toBe(true)
  })

  await ctx.close()
  sinErrores(errores)
})

// Gimnasio (F-19, fase 3): armar una rutina, hacer una sesión con series, la vez anterior, récords, el borrador que sobrevive al
// cierre, corregir una sesión ya guardada, ejercicios propios y el progreso. Usa la sesión de las anteriores (cálculo de gasto prendido).
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, rest, sinErrores } from './apoyo.js'

const numero = (t) => Number(String(t).replace(/\./g, '').replace(/[^\d]/g, ''))

test('gimnasio: rutina, sesión con series, récords, borrador, corregir y ejercicios propios', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  const sesion = (titulo) => pg.getByRole('dialog', { name: titulo, exact: true })
  const clave = () => pg.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('tupper:entreno-borrador:')))
  const marcarHechas = async (hoja, cantidad) => {
    for (let i = 0; i < cantidad; i++) await hoja.getByRole('button', { name: 'Marcar serie como hecha' }).first().click()
  }
  const cargar = async (hoja, pesos, repeticiones) => {
    for (let i = 0; i < pesos.length; i++) {
      await hoja.getByLabel('Peso en kilos').nth(i).fill(String(pesos[i]))
      await hoja.getByLabel('Repeticiones').nth(i).fill(String(repeticiones[i]))
    }
  }
  let rutinaId = null

  await test.step('el gimnasio arranca vacío', async () => {
    await pg.goto(APP + '/ejercicio?tab=gimnasio')
    await expect(pg.getByText('Una rutina es una lista de ejercicios')).toBeVisible()
    await expect(pg.getByText('Mi progreso')).toHaveCount(0)
    await expect(pg.getByText('Tenés una sesión sin terminar')).toHaveCount(0)
  })

  await test.step('armar una rutina: validaciones, ejercicios y orden', async () => {
    await pg.getByRole('button', { name: 'Nueva' }).click()
    const hoja = pg.getByRole('dialog', { name: 'Nueva rutina' })
    await hoja.getByRole('button', { name: 'Guardar rutina' }).click()
    await expect(hoja.getByText('Ponele un nombre a la rutina.')).toBeVisible()
    await expect(hoja.getByText('Agregá al menos un ejercicio.')).toBeVisible()
    await hoja.getByPlaceholder('Por ejemplo, Empuje').fill('Empuje')
    await hoja.getByRole('button', { name: 'Agregar ejercicio' }).click()
    const elegir = pg.getByRole('dialog', { name: 'Agregar ejercicio' })
    await elegir.getByLabel('Buscar ejercicio').fill('banca plano')
    await elegir.getByRole('button', { name: /Press de banca plano con barra/ }).click()
    await hoja.getByRole('button', { name: 'Agregar ejercicio' }).click()
    await pg.getByLabel('Buscar ejercicio').fill('militar')
    await pg.getByRole('button', { name: /Press militar con barra/ }).click()
    await expect(hoja.getByText('Press de banca plano con barra')).toBeVisible()
    await expect(hoja.getByText('Press militar con barra')).toBeVisible()
    // Las repeticiones mínimas no pueden pasar a las máximas
    await hoja.getByLabel('Reps desde').first().fill('15')
    await expect(hoja.getByText('Las repeticiones mínimas no pueden superar a las máximas.')).toBeVisible()
    await hoja.getByRole('button', { name: 'Guardar rutina' }).click()
    expect(await rest(pg, 'routines')).toHaveLength(0)
    await hoja.getByLabel('Reps desde').first().fill('5')
    await hoja.getByLabel('Reps hasta').first().fill('8')
    // Mover el segundo arriba y volver a bajarlo
    await hoja.getByRole('button', { name: 'Subir' }).nth(1).click()
    await expect(hoja.locator('p.truncate').first()).toHaveText('Press militar con barra')
    await hoja.getByRole('button', { name: 'Bajar' }).first().click()
    await expect(hoja.locator('p.truncate').first()).toHaveText('Press de banca plano con barra')
    await hoja.getByRole('button', { name: 'Guardar rutina' }).click()
    await expect(pg.getByText('Rutina creada')).toBeVisible()
    const rutinas = await rest(pg, 'routines')
    expect(rutinas).toHaveLength(1)
    rutinaId = rutinas[0].id
    const items = (await rest(pg, 'routine_exercises')).sort((a, b) => a.position - b.position)
    expect(items.map((i) => [i.position, i.sets_target, i.reps_min, i.reps_max])).toEqual([
      [0, 3, 5, 8],
      [1, 3, 8, 12],
    ])
    await expect(pg.getByText('2 ejercicios · Press de banca plano con barra, Press militar con barra')).toBeVisible()
    await captura(pg, 's98_gimnasio_rutinas', false)
  })

  await test.step('primera sesión (el 28/9): validar series, cargar, descanso y terminar', async () => {
    await pg.goto(APP + '/ejercicio?tab=gimnasio&fecha=2026-09-28')
    await pg.getByRole('button', { name: 'Empezar', exact: true }).click()
    const hoja = sesion('Empuje')
    await expect(hoja.getByText('Press de banca plano con barra')).toBeVisible()
    await expect(hoja.getByText('Es la primera vez que lo hacés')).toHaveCount(2)
    // Una serie sin repeticiones no se puede marcar como hecha
    await hoja.getByRole('button', { name: 'Marcar serie como hecha' }).first().click()
    await expect(pg.getByText('Las repeticiones van de 1 a 100.')).toBeVisible()
    await expect(hoja.getByRole('timer')).toHaveCount(0)
    await expect(hoja.getByRole('button', { name: 'Terminar sesión' })).toBeDisabled()
    await cargar(hoja, [60, 60, 60, 30, 30, 30], [8, 8, 7, 8, 8, 6])
    await marcarHechas(hoja, 1)
    await expect(hoja.getByRole('timer')).toContainText('Descanso')
    await marcarHechas(hoja, 5)
    await captura(pg, 's99_gimnasio_sesion', false)
    // La primera vez no hay récords que romper
    await expect(hoja.getByText('¡Récord!')).toHaveCount(0)
    await hoja.getByRole('button', { name: 'Terminar sesión' }).click()
    const cierre = sesion('Terminar sesión')
    await expect(cierre.getByText('Kilos movidos')).toBeVisible()
    expect(numero(await cierre.locator('p.text-lg').nth(2).innerText())).toBe(2040)
    await cierre.getByLabel('Cuánto duró (minutos)').fill('60')
    await cierre.getByRole('button', { name: 'Fuerte' }).click()
    await expect(cierre.getByText('Gastaste aproximadamente')).toBeVisible()
    await expect(cierre.getByText('Pecho')).toBeVisible()
    await expect(cierre.getByText('Hombros')).toBeVisible()
    await captura(pg, 's100_gimnasio_cierre', false)
    await cierre.getByRole('button', { name: 'Guardar sesión' }).click()
    await expect(pg.getByText('Sesión guardada')).toBeVisible()
    const w = await rest(pg, 'workouts')
    expect(w).toHaveLength(1)
    expect(w[0]).toMatchObject({ name: 'Empuje', fecha: '2026-09-28', duration_min: 60, metodo: 'mets', routine_id: rutinaId })
    expect(Number(w[0].kcal)).toBeGreaterThan(150)
    const series = await rest(pg, 'workout_sets')
    expect(series).toHaveLength(6)
    expect(series.every((s) => s.fecha === '2026-09-28' && s.warmup === false)).toBe(true)
    expect(await clave(), 'al guardar se borra el borrador').toEqual([])
  })

  await test.step('segunda sesión: la vez anterior, copiar series y un récord', async () => {
    await pg.goto(APP + '/ejercicio?tab=gimnasio')
    await pg.getByRole('button', { name: 'Empezar', exact: true }).click()
    const hoja = sesion('Empuje')
    await expect(hoja.getByText(/La última vez/).first()).toBeVisible()
    await expect(hoja.getByText(/60 kg × 8 · 60 kg × 8 · 60 kg × 7/)).toBeVisible()
    // Arranca con lo de la vez anterior ya cargado
    await expect(hoja.getByLabel('Peso en kilos').first()).toHaveValue('60')
    await expect(hoja.getByLabel('Repeticiones').nth(2)).toHaveValue('7')
    await hoja.getByLabel('Peso en kilos').first().fill('65')
    await marcarHechas(hoja, 1)
    await expect(hoja.getByText(/¡Récord! \(más peso, fuerza estimada\)/)).toBeVisible()
    await marcarHechas(hoja, 1)
    // Las series que igualan lo de antes no son récord
    await expect(hoja.getByText('¡Récord!')).toHaveCount(1)
  })

  await test.step('un ejercicio propio, y salir sin terminar deja un borrador', async () => {
    const hoja = sesion('Empuje')
    await hoja.getByRole('button', { name: 'Agregar ejercicio' }).click()
    const elegir = sesion('Agregar ejercicio')
    await elegir.getByRole('button', { name: /Crear un ejercicio propio/ }).click()
    await expect(elegir.getByRole('button', { name: 'Crear ejercicio' })).toBeDisabled()
    await elegir.getByPlaceholder('Por ejemplo, Press con agarre cerrado').fill('Remo en banco')
    await elegir.getByLabel('Músculo principal').selectOption('espalda')
    await elegir.getByRole('button', { name: 'Crear ejercicio' }).click()
    await expect(hoja.getByText('Remo en banco')).toBeVisible()
    await expect(hoja.getByText('Es la primera vez que lo hacés')).toHaveCount(1)
    const propios = await rest(pg, 'gym_exercises', '&name=eq.Remo%20en%20banco')
    expect(propios).toHaveLength(1)
    expect(propios[0]).toMatchObject({ grupo: 'espalda', equipo: 'otro', peso_corporal: false })
    // Es el tercer ejercicio: sus series son las últimas
    const peso = hoja.getByLabel('Peso en kilos')
    const total = await peso.count()
    await peso.nth(total - 3).fill('20')
    await hoja
      .getByLabel('Repeticiones')
      .nth(total - 3)
      .fill('12')
    // Las series pendientes son: la 3.ª de banca, las 3 de militar y las 3 del ejercicio propio (la primera de esas es la 4.ª desde el final)
    const pendientes = hoja.getByRole('button', { name: 'Marcar serie como hecha' })
    await pendientes.nth((await pendientes.count()) - 3).click()
    await hoja.getByRole('button', { name: 'Cerrar' }).click()
    await pg.waitForTimeout(700)
    expect(await clave(), 'al salir queda el borrador en el teléfono').toHaveLength(1)
    await expect(pg.getByText('Tenés una sesión sin terminar')).toBeVisible()
  })

  await test.step('retomar el borrador conserva todo', async () => {
    await pg.reload()
    await expect(pg.getByText('Tenés una sesión sin terminar')).toBeVisible()
    await expect(pg.getByText('3 ejercicios')).toBeVisible()
    await pg.getByRole('button', { name: 'Retomar' }).click()
    const hoja = sesion('Empuje')
    await expect(hoja.getByText('Remo en banco')).toBeVisible()
    await expect(hoja.getByLabel('Peso en kilos').first()).toHaveValue('65')
    await expect(hoja.getByText('¡Récord!')).toHaveCount(1)
  })

  await test.step('empezar otra sesión con un borrador pide confirmación', async () => {
    await pg.getByRole('dialog', { name: 'Empuje', exact: true }).getByRole('button', { name: 'Cerrar' }).click()
    await pg.getByRole('button', { name: 'Empezar una sesión libre' }).click()
    await expect(pg.getByText('Ya tenés una sesión sin terminar')).toBeVisible()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Cancelar' }).click()
    await expect(sesion('Sesión de gimnasio')).toHaveCount(0)
    expect(await clave()).toHaveLength(1)
  })

  await test.step('terminar la segunda sesión suma el récord', async () => {
    await pg.getByRole('button', { name: 'Retomar' }).click()
    const hoja = sesion('Empuje')
    // Quedan la 3.ª serie de banca y las de militar (ya cargadas con lo de la vez anterior); las vacías del ejercicio propio no se guardan
    await marcarHechas(hoja, 4)
    await hoja.getByRole('button', { name: 'Terminar sesión' }).click()
    const cierre = sesion('Terminar sesión')
    await cierre.getByLabel('Cuánto duró (minutos)').fill('50')
    await cierre.getByRole('button', { name: 'Guardar sesión' }).click()
    await expect(pg.getByText(/Sesión guardada · 1 récord/)).toBeVisible()
    expect(await clave()).toEqual([])
    const w = await rest(pg, 'workouts')
    expect(w).toHaveLength(2)
    const hoy = w.find((x) => x.fecha === '2026-10-03')
    expect(hoy).toMatchObject({ name: 'Empuje', routine_id: rutinaId, duration_min: 50 })
    expect((await rest(pg, 'workout_sets')).filter((s) => s.workout_id === hoy.id)).toHaveLength(7)
  })

  await test.step('el progreso y el volumen de la semana', async () => {
    await expect(pg.getByText('Esta semana por músculo')).toBeVisible()
    await expect(pg.getByText('Mi progreso')).toBeVisible()
    const progreso = pg.locator('section', { hasText: 'Mi progreso' })
    await progreso.getByLabel('Ejercicio').selectOption({ label: 'Press de banca plano con barra' })
    // Dos días distintos: aparece la curva, con la fuerza estimada de 76 a 82,5 kg
    await expect(progreso.getByRole('img', { name: /Fuerza estimada de 76 a 82[.,]5 kg/ })).toBeVisible()
    await expect(progreso.getByText('65 kg')).toBeVisible()
    await captura(pg, 's101_gimnasio_progreso')
  })

  await test.step('corregir una sesión ya guardada', async () => {
    await pg.getByRole('button', { name: 'Entrenamientos' }).click()
    // La más vieja (28/9) es la segunda de la lista
    await pg.getByRole('button', { name: 'Corregir Empuje' }).nth(1).click()
    const hoja = sesion('Empuje')
    await expect(hoja.getByRole('button', { name: 'Serie hecha (tocá para corregirla)' })).toHaveCount(6)
    await hoja.getByRole('button', { name: 'Serie hecha (tocá para corregirla)' }).first().click()
    await hoja.getByLabel('Repeticiones').first().fill('10')
    await hoja.getByRole('button', { name: 'Marcar serie como hecha' }).click()
    await hoja.getByRole('button', { name: 'Terminar sesión' }).click()
    const cierre = sesion('Terminar sesión')
    await expect(cierre.getByLabel('Cuánto duró (minutos)')).toHaveValue('60')
    await cierre.getByRole('button', { name: 'Guardar sesión' }).click()
    await expect(pg.getByText('Sesión corregida')).toBeVisible()
    const w = (await rest(pg, 'workouts')).find((x) => x.fecha === '2026-09-28')
    expect(w.routine_id).toBe(rutinaId)
    const series = (await rest(pg, 'workout_sets'))
      .filter((s) => s.workout_id === w.id)
      .sort((a, b) => a.orden - b.orden || a.set_no - b.set_no)
    expect(series).toHaveLength(6)
    expect(series[0].reps).toBe(10)
    expect(await clave(), 'corregir una sesión guardada no deja borrador').toEqual([])
  })

  await test.step('un ejercicio con series cargadas no se puede borrar', async () => {
    await pg.getByRole('button', { name: 'Gimnasio' }).click()
    await expect(pg.getByText('Mis ejercicios')).toBeVisible()
    await pg.getByRole('button', { name: 'Borrar Remo en banco' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
    await expect(pg.getByText('Ese ejercicio ya tiene series cargadas')).toBeVisible()
    expect(await rest(pg, 'gym_exercises', '&name=eq.Remo%20en%20banco')).toHaveLength(1)
  })

  await test.step('borrar la sesión se lleva sus series y libera al ejercicio', async () => {
    await pg.getByRole('button', { name: 'Entrenamientos' }).click()
    await pg.getByRole('button', { name: 'Borrar Empuje' }).first().click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
    await expect(pg.getByText('Entrenamiento borrado')).toBeVisible()
    expect(await rest(pg, 'workouts')).toHaveLength(1)
    expect(await rest(pg, 'workout_sets')).toHaveLength(6)
    await pg.getByRole('button', { name: 'Gimnasio' }).click()
    await pg.getByRole('button', { name: 'Borrar Remo en banco' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
    await expect(pg.getByText('Ejercicio borrado')).toBeVisible()
    expect(await rest(pg, 'gym_exercises', '&name=eq.Remo%20en%20banco')).toHaveLength(0)
  })

  await test.step('borrar la rutina deja las sesiones hechas', async () => {
    await pg.getByRole('button', { name: 'Borrar Empuje' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar' }).click()
    await expect(pg.getByText('Rutina borrada')).toBeVisible()
    expect(await rest(pg, 'routines')).toHaveLength(0)
    expect(await rest(pg, 'routine_exercises')).toHaveLength(0)
    const w = await rest(pg, 'workouts')
    expect(w).toHaveLength(1)
    expect(w[0].routine_id).toBeNull()
  })

  await test.step('limpiar: borrar todo lo de ejercicio', async () => {
    await pg.goto(APP + '/gasto')
    await pg.getByRole('button', { name: 'Borrar todo lo de ejercicio' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Borrar todo' }).click()
    await expect(pg.getByText('Se borró todo lo de ejercicio')).toBeVisible()
    for (const t of ['workouts', 'workout_sets', 'routines', 'routine_exercises']) expect(await rest(pg, t)).toHaveLength(0)
  })

  await ctx.close()
  sinErrores(errores)
})

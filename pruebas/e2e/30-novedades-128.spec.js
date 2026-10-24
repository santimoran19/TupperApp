// 1.28: carga rápida desde el Diario, combos, copiar un día, el asistente con IA, opiniones, la planilla, la altura en
// "Cómo te verías" y el consentimiento de los datos de salud. Las funciones de IA se reemplazan por unas de mentira (acá no
// corre Deno). Usa la sesión de las pruebas anteriores.
import fs from 'node:fs'
import { expect, test } from '@playwright/test'
import { API, APP, aviso, contexto, escuchar, hoyEnLaPagina, rest, sinErrores } from './apoyo.js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const sumarUnDia = (f) => {
  const d = new Date(f + 'T12:00:00')
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}
// Cambia el perfil en la base simulada con la sesión de la página
const cambiarPerfil = (pg, cambios) =>
  pg.evaluate(
    async ([api, cambios]) => {
      const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
      const ses = JSON.parse(localStorage.getItem(k))
      const r = await fetch(api + '/rest/v1/profiles?id=eq.' + ses.user.id, {
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + ses.access_token, apikey: 'test', 'Content-Type': 'application/json' },
        body: JSON.stringify(cambios),
      })
      if (!r.ok) throw new Error('perfil: ' + r.status)
    },
    [API, cambios],
  )

test('carga rápida, combos, copiar día, asistente, opiniones, planilla, altura y consentimiento', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true, acceptDownloads: true })
  const pedidosIA = []
  await ctx.route('**/functions/v1/registrar-ia', async (ruta) => {
    if (ruta.request().method() === 'OPTIONS') return ruta.fulfill({ status: 204, headers: CORS })
    pedidosIA.push(ruta.request().postDataJSON())
    await ruta.fulfill({
      status: 200,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: JSON.stringify({ items: [{ nombre: 'huevos', cantidad: 2, unidad: 'unidad', gramos: 100, confianza: 0.9 }], restantes: 5 }),
    })
  })
  const pedidosChat = []
  await ctx.route('**/functions/v1/asistente-ia', async (ruta) => {
    if (ruta.request().method() === 'OPTIONS') return ruta.fulfill({ status: 204, headers: CORS })
    pedidosChat.push(ruta.request().postDataJSON())
    await ruta.fulfill({
      status: 200,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: JSON.stringify({ respuesta: 'Con lo que te queda podés hacer:\n- Una tortilla de 2 huevos\n- Arroz con atún', restantes: 29 }),
    })
  })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  // Los platos de Registrar (el campo "Cantidad" exacto: en el Diario hay botones "Cambiar la cantidad de...")
  const platosDe = () => pg.locator('.tarjeta', { has: pg.getByLabel('Cantidad', { exact: true }) })

  await test.step('el Diario tiene la carga rápida arriba y los números no quedan debajo del tupper', async () => {
    await pg.goto(APP + '/')
    const rapida = pg.getByTestId('carga-rapida')
    await expect(rapida).toBeVisible()
    await expect(rapida.getByRole('link', { name: /Preguntale a la IA/ })).toBeVisible()
    // Si el aviso de la IA no se aceptó en esta sesión, se acepta acá
    if (await rapida.getByTestId('ia-aviso').isVisible()) await rapida.getByRole('button', { name: 'Entendido' }).click()
    const kcal = pg.getByTestId('diario-kcal')
    if (await kcal.count()) {
      const caja = await kcal.boundingBox()
      const lienzo = await pg.locator('canvas').first().boundingBox()
      if (lienzo) expect(caja.y + caja.height).toBeLessThanOrEqual(lienzo.y + 1)
    }
  })

  await test.step('escribir lo que comí desde el Diario lleva a Registrar con el plato armado', async () => {
    const rapida = pg.getByTestId('carga-rapida')
    await rapida.getByRole('button', { name: /Escribir/ }).click()
    await rapida.getByLabel('Qué comiste').fill('dos huevos')
    await rapida.getByRole('button', { name: 'Armar' }).click()
    await expect(pg).toHaveURL(/\/registrar\?fecha=/)
    await expect(pg.getByRole('heading', { name: 'Tu plato' })).toBeVisible({ timeout: 20000 })
    await expect(pg.getByText(/Armé 1 ítem: revisá las cantidades/)).toBeVisible()
    await expect(platosDe()).toHaveCount(1)
    await expect(platosDe().first().getByLabel('Cantidad', { exact: true })).toHaveValue('2')
    expect(pedidosIA).toEqual([{ tipo: 'texto', texto: 'dos huevos' }])
    // Al recargar no se vuelve a sumar
    await pg.reload()
    await expect(pg.getByRole('heading', { name: 'Tu plato' })).toBeVisible({ timeout: 20000 })
    await expect(platosDe()).toHaveCount(0)
  })

  await test.step('guardar un combo y usarlo desde Registrar y desde el Diario', async () => {
    const rapida = pg.getByTestId('registro-ia')
    await rapida.getByRole('button', { name: /Escribir/ }).click()
    await rapida.getByLabel('Qué comiste').fill('dos huevos')
    await rapida.getByRole('button', { name: 'Armar' }).click()
    await expect(platosDe()).toHaveCount(1)
    await pg.getByTestId('guardar-combo').click()
    await pg.getByLabel('Nombre').fill('Desayuno de prueba')
    await pg.getByRole('button', { name: 'Guardar combo' }).click()
    await expect.poll(() => aviso(pg)).toMatch(/Combo "Desayuno de prueba" guardado/)
    const combos = await rest(pg, 'combos')
    expect(combos).toHaveLength(1)
    expect(combos[0]).toMatchObject({ name: 'Desayuno de prueba', items: [{ qty: 2 }] })
    // Se saca del plato y se vuelve a poner con el combo
    await pg.getByRole('button', { name: 'Quitar' }).click()
    await pg.getByRole('button', { name: 'Agregar el combo Desayuno de prueba' }).click()
    await expect(platosDe()).toHaveCount(1)
    // Desde el Diario
    await pg.goto(APP + '/')
    await pg.getByRole('button', { name: 'Anotar el combo Desayuno de prueba' }).click()
    await expect(pg).toHaveURL(/\/registrar/)
    await expect(pg.getByRole('heading', { name: 'Tu plato' })).toBeVisible({ timeout: 20000 })
    await expect(platosDe()).toHaveCount(1)
  })

  await test.step('copiar el día de hoy a mañana', async () => {
    await pg.goto(APP + '/')
    const hoy = await hoyEnLaPagina(pg)
    const manana = sumarUnDia(hoy)
    const deHoy = (await rest(pg, 'log_entries', `&date=eq.${hoy}&skipped=eq.false`)).length
    expect(deHoy).toBeGreaterThan(0)
    const antes = (await rest(pg, 'log_entries', `&date=eq.${manana}`)).length
    await pg.getByTestId('copiar-dia').click()
    await expect(pg.getByLabel('Copiar al')).toHaveValue(manana)
    await pg.getByRole('button', { name: 'Copiar', exact: true }).click()
    await expect.poll(() => aviso(pg)).toMatch(/^Copiado: /)
    await expect.poll(async () => (await rest(pg, 'log_entries', `&date=eq.${manana}`)).length).toBeGreaterThan(antes)
    // La pantalla pasa al día copiado; se borra lo copiado para no tocar a las pruebas que siguen
    for (const r of await rest(pg, 'log_entries', `&date=eq.${manana}`)) {
      await pg.evaluate(
        async ([api, id]) => {
          const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
          const ses = JSON.parse(localStorage.getItem(k))
          await fetch(api + '/rest/v1/rpc/borrar_registro', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + ses.access_token, apikey: 'test', 'Content-Type': 'application/json' },
            body: JSON.stringify({ p_id: id }),
          })
        },
        [API, r.id],
      )
    }
  })

  await test.step('el asistente responde con los datos del día, sin mandar el nombre ni el email', async () => {
    await pg.goto(APP + '/asistente')
    await expect(pg.getByTestId('asistente-aviso')).toBeVisible()
    await pg.getByRole('button', { name: 'Entendido' }).click()
    await pg.getByRole('button', { name: '¿Qué ceno con lo que me queda en la despensa?' }).click()
    await expect(pg.getByText('Una tortilla de 2 huevos')).toBeVisible()
    await expect(pg.getByText('Te quedan 29 preguntas hoy.')).toBeVisible()
    expect(pedidosChat).toHaveLength(1)
    const [pedido] = pedidosChat
    expect(pedido.mensajes).toEqual([{ role: 'user', content: '¿Qué ceno con lo que me queda en la despensa?' }])
    expect(pedido.contexto.objetivo.kcal).toBeGreaterThan(0)
    expect(Array.isArray(pedido.contexto.despensa)).toBe(true)
    const todo = JSON.stringify(pedido)
    expect(todo).not.toContain('Santi')
    expect(todo).not.toContain('@')
    // Una segunda pregunta manda la conversación entera
    await pg.getByLabel('Tu pregunta').fill('¿Y algo dulce?')
    await pg.getByRole('button', { name: 'Mandar' }).click()
    await expect.poll(() => pedidosChat.length).toBe(2)
    expect(pedidosChat[1].mensajes.map((m) => m.role)).toEqual(['user', 'assistant', 'user'])
  })

  await test.step('opiniones y planilla desde el Perfil', async () => {
    await pg.goto(APP + '/perfil')
    const opinion = pg.getByTestId('opinion')
    await opinion.getByRole('radio', { name: 'Algo anda mal' }).click()
    await opinion.getByLabel('Tu mensaje').fill('El botón de compartir no anda en mi teléfono')
    await opinion.getByRole('button', { name: 'Mandar' }).click()
    await expect(opinion.getByText(/¡Gracias!/)).toBeVisible()
    const opiniones = await rest(pg, 'opiniones')
    expect(opiniones).toHaveLength(1)
    expect(opiniones[0]).toMatchObject({ tipo: 'problema', texto: 'El botón de compartir no anda en mi teléfono', pantalla: '/perfil' })

    await pg.getByTestId('exportar-planilla').click()
    await pg.getByRole('radio', { name: 'Todo' }).click()
    const [descarga] = await Promise.all([pg.waitForEvent('download'), pg.getByRole('button', { name: /Descargar planilla/ }).click()])
    expect(descarga.suggestedFilename()).toMatch(/^tupper-registro-\d{4}-\d{2}-\d{2}\.csv$/)
    const contenido = fs.readFileSync(await descarga.path(), 'utf8')
    expect(contenido.charCodeAt(0)).toBe(0xfeff)
    expect(contenido).toContain('Fecha;Comida;Alimento o receta;Cantidad;Calorías (kcal)')
    expect(contenido).toContain('TOTAL DEL DÍA')
  })

  await test.step('Cómo te verías: barra hasta pesos bajos, regla de altura y guardar la altura', async () => {
    await pg.goto(APP + '/perfil')
    const [perfil] = await rest(pg, 'profiles')
    const alturaAntes = Number(perfil.height_cm)
    await expect(pg.getByTestId('regla-altura')).toBeVisible()
    // La barra de peso baja hasta un IMC de 15 (antes no bajaba de la masa magra de hoy)
    const minimo = Number(await pg.locator('#sil-peso').getAttribute('min'))
    expect(minimo).toBeLessThanOrEqual(Math.floor(15 * (alturaAntes / 100) ** 2))
    await pg.getByRole('button', { name: 'Un centímetro más' }).click()
    await expect(pg.locator('#sil-altura')).toHaveValue(String(alturaAntes + 1))
    await pg.getByRole('button', { name: `Guardar ${alturaAntes + 1} cm como mi altura` }).click()
    await expect.poll(async () => Number((await rest(pg, 'profiles'))[0].height_cm)).toBe(alturaAntes + 1)
    await cambiarPerfil(pg, { height_cm: alturaAntes })
  })

  await test.step('quien ya tenía cuenta acepta una vez el uso de sus datos de salud', async () => {
    await cambiarPerfil(pg, { salud_consentida_at: null })
    await pg.goto(APP + '/')
    await expect(pg.getByTestId('consentimiento-salud')).toBeVisible()
    await pg.getByRole('button', { name: 'Continuar' }).click()
    await expect(pg.getByText('Para usar la app necesitamos que lo aceptes.')).toBeVisible()
    await pg.check('#pf-consentimiento')
    await pg.getByRole('button', { name: 'Continuar' }).click()
    await expect(pg.getByTestId('carga-rapida')).toBeVisible()
    expect((await rest(pg, 'profiles'))[0].salud_consentida_at).toBeTruthy()
  })

  sinErrores(errores)
})

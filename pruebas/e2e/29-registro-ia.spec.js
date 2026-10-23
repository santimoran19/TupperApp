// 1.27: cargar lo que comiste con foto, voz o texto. La función de IA no corre en las pruebas (hace falta Deno y claves): se la reemplaza
// por una de mentira que contesta lo mismo que la real. Lo que se prueba es lo de la app: el aviso, el cruce con tus alimentos y el plato.
import { expect, test } from '@playwright/test'
import { APP, contexto, escuchar, sinErrores } from './apoyo.js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

test('cargar con IA: aviso, texto, foto y errores', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  const pedidos = []
  let respuesta = {
    status: 200,
    body: {
      items: [
        { nombre: 'huevos', cantidad: 2, unidad: 'unidad', gramos: 100, confianza: 0.9 },
        { nombre: 'arroz largo fino', cantidad: 150, unidad: 'g', gramos: 150, confianza: 0.8 },
        { nombre: 'zzz inexistente', cantidad: 1, unidad: 'porcion', gramos: 100, confianza: 0.5 },
      ],
      restantes: 9,
    },
  }
  await ctx.route('**/functions/v1/registrar-ia', async (ruta) => {
    const req = ruta.request()
    if (req.method() === 'OPTIONS') return ruta.fulfill({ status: 204, headers: CORS })
    pedidos.push(req.postDataJSON())
    await ruta.fulfill({
      status: respuesta.status,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: JSON.stringify(respuesta.body),
    })
  })
  const pg = await ctx.newPage()
  escuchar(pg, errores)

  await test.step('la primera vez avisa qué se manda y que hay que revisar', async () => {
    await pg.goto(APP + '/registrar')
    const aviso = pg.getByTestId('ia-aviso')
    await expect(aviso).toBeVisible()
    await expect(aviso.getByText(/no se guardan/)).toBeVisible()
    await aviso.getByRole('button', { name: 'Entendido' }).click()
    await expect(pg.getByTestId('registro-ia')).toBeVisible()
    await pg.reload()
    await expect(pg.getByTestId('ia-aviso')).toHaveCount(0)
  })

  await test.step('escribir lo que comiste arma el plato y avisa lo que no encontró', async () => {
    const ia = pg.getByTestId('registro-ia')
    await ia.getByRole('button', { name: /Escribir/ }).click()
    await ia.getByLabel('Qué comiste').fill('dos huevos con arroz')
    await ia.getByRole('button', { name: 'Armar' }).click()
    await expect(pg.getByText('Armé 2 ítems: revisá las cantidades.', { exact: false })).toBeVisible()
    await expect(pg.getByText(/No encontré en tus alimentos: zzz inexistente/)).toBeVisible()
    expect(pedidos).toEqual([{ tipo: 'texto', texto: 'dos huevos con arroz' }])
    const platos = pg.locator('.tarjeta', { has: pg.getByLabel('Cantidad') })
    await expect(platos).toHaveCount(2)
    await expect(platos.nth(0).getByLabel('Cantidad')).toHaveValue('2')
    await expect(platos.nth(1).getByLabel('Cantidad')).toHaveValue('150')
  })

  await test.step('con una foto manda la imagen achicada y no repite lo que ya está', async () => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
    await pg.getByLabel('Foto del plato').setInputFiles({ name: 'plato.png', mimeType: 'image/png', buffer: png })
    await expect.poll(() => pedidos.length).toBe(2)
    expect(pedidos[1].tipo).toBe('foto')
    expect(pedidos[1].mime).toBe('image/jpeg')
    expect(pedidos[1].imagen.length).toBeGreaterThan(50)
    await expect(pg.locator('.tarjeta', { has: pg.getByLabel('Cantidad') })).toHaveCount(2)
  })

  await test.step('si se acaba el cupo, lo dice y no toca el plato', async () => {
    respuesta = { status: 429, body: { codigo: 'limite', mensaje: 'Llegaste al máximo de pedidos de hoy. Probá mañana.' } }
    const ia = pg.getByTestId('registro-ia')
    // Al armar el plato bien, el campo de texto se cierra: se vuelve a abrir
    await ia.getByRole('button', { name: /Escribir/ }).click()
    await ia.getByLabel('Qué comiste').fill('una manzana')
    await ia.getByRole('button', { name: 'Armar' }).click()
    await expect(pg.getByText('Llegaste al máximo de pedidos de hoy. Probá mañana.')).toBeVisible()
    await expect(pg.locator('.tarjeta', { has: pg.getByLabel('Cantidad') })).toHaveCount(2)
  })

  await test.step('si no hay comida en lo que mandó, lo dice', async () => {
    respuesta = { status: 200, body: { items: [], restantes: 8 } }
    const ia = pg.getByTestId('registro-ia')
    await ia.getByLabel('Qué comiste').fill('nada')
    await ia.getByRole('button', { name: 'Armar' }).click()
    await expect(pg.getByText(/No encontré comida ahí/)).toBeVisible()
  })

  sinErrores(errores)
})

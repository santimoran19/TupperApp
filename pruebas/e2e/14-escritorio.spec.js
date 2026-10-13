// Diseño de computadora (D-03): barra al costado, columnas, ventanas centradas y nada que se salga de la pantalla.
// Usa la sesión de las pruebas anteriores y no cambia ningún dato.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, sinErrores } from './apoyo.js'

const RUTAS = [
  '/',
  '/plan',
  '/despensa',
  '/recetas',
  '/compras',
  '/resumen',
  '/perfil',
  '/alimentos',
  '/registrar',
  '/recetas/nueva',
  '/no-existe',
]
const ANCHOS_COMPU = [1024, 1280, 1440, 1920, 2560]

// ¿Algo de la página se sale por los costados?
const seSale = (pg) => pg.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
const lateral = (pg) => pg.locator('aside nav[aria-label="Principal"]')
const barraDeAbajo = (pg) => pg.locator('nav.fixed.bottom-0')

test('escritorio: barra al costado, columnas, ventanas centradas y nada que se salga', async ({ browser }) => {
  const errores = []
  let ctx
  let pg

  await test.step('en el celular no cambia nada: barra de abajo y sin barra lateral', async () => {
    ctx = await contexto(browser, { sesion: true })
    pg = await ctx.newPage()
    escuchar(pg, errores)
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await expect(barraDeAbajo(pg)).toHaveCount(1)
    await expect(pg.locator('aside')).toHaveCount(0)
    // Una hoja en el celular sigue pegada abajo
    await pg.goto(APP + '/despensa')
    await pg
      .getByRole('button', { name: /Agregar/ })
      .first()
      .click()
    const hoja = pg.locator('div.fixed.inset-0.z-50 > div.relative')
    await expect(hoja).toBeVisible()
    const caja = await hoja.boundingBox()
    const alto = pg.viewportSize().height
    expect(Math.round(caja.y + caja.height)).toBe(alto)
    await ctx.close()
  })

  await test.step('en la compu: barra lateral con todas las pantallas', async () => {
    ctx = await contexto(browser, { sesion: true, viewport: { width: 1440, height: 900 } })
    pg = await ctx.newPage()
    escuchar(pg, errores)
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await expect(lateral(pg)).toBeVisible()
    await expect(barraDeAbajo(pg)).toHaveCount(0)
    await expect(lateral(pg).locator('a[aria-current="page"]')).toHaveText('Diario')
    await captura(pg, 'e10_escritorio_diario')
    for (const [texto, ruta, titulo] of [
      ['Plan semanal', '/plan', 'Plan semanal'],
      ['Despensa', '/despensa', 'Despensa'],
      ['Recetas', '/recetas', 'Recetas'],
      ['Lista de compras', '/compras', 'Lista de compras'],
      ['Resumen semanal', '/resumen', 'Resumen semanal'],
      ['Mis alimentos', '/alimentos', 'Mis alimentos'],
      ['Diario', '/', 'Diario'],
    ]) {
      await lateral(pg).getByRole('link', { name: texto }).click()
      await expect(pg).toHaveURL(APP + ruta)
      await expect(pg.locator('header h1')).toHaveText(titulo)
      await expect(lateral(pg).locator('a[aria-current="page"]')).toHaveText(texto)
    }
    // Perfil y Registrar están en la barra, fuera de la lista
    await pg.locator('aside').getByRole('link', { name: 'Perfil' }).click()
    await expect(pg).toHaveURL(APP + '/perfil')
    await pg.locator('aside').getByRole('link', { name: 'Registrar' }).click()
    await expect(pg).toHaveURL(APP + '/registrar')
    await expect(pg.getByRole('heading', { name: 'Tu plato' })).toBeVisible()
    // Aun en Registrar (que en el celular no tiene barra) la barra lateral sigue
    await expect(lateral(pg)).toBeVisible()
  })

  await test.step('columnas: el resumen del diario al costado y las recetas en varias columnas', async () => {
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    const resumen = await pg.locator('section', { hasText: 'Proteína' }).first().boundingBox()
    const comidas = await pg.getByRole('heading', { name: 'Comidas', exact: true }).boundingBox()
    expect(comidas.x).toBeGreaterThan(resumen.x + resumen.width) // las comidas quedan a la derecha, no abajo
    await pg.goto(APP + '/recetas')
    await pg.waitForSelector('text=para cocinar')
    const tarjetas = pg.locator('a.tarjeta[href^="/recetas/"]')
    const [a, b, c] = await Promise.all([0, 1, 2].map((i) => tarjetas.nth(i).boundingBox()))
    expect(Math.round(b.y)).toBe(Math.round(a.y))
    expect(Math.round(c.y)).toBe(Math.round(a.y))
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('text=Lista de compras')
    const stock = pg.locator('div.tarjeta:has(button[aria-label^="Restar "])')
    const [d1, d2] = await Promise.all([0, 1].map((i) => stock.nth(i).boundingBox()))
    expect(Math.round(d2.y)).toBe(Math.round(d1.y))
    expect(d2.x).toBeGreaterThan(d1.x + d1.width - 1)
  })

  await test.step('las ventanas son un recuadro en el medio, no una hoja pegada abajo', async () => {
    await pg
      .getByRole('button', { name: /Agregar/ })
      .first()
      .click()
    const hoja = pg.locator('div.fixed.inset-0.z-50 > div.relative')
    await expect(hoja).toBeVisible()
    const caja = await hoja.boundingBox()
    const { width, height } = pg.viewportSize()
    expect(caja.y).toBeGreaterThan(20)
    expect(caja.y + caja.height).toBeLessThan(height - 20)
    expect(caja.width).toBeLessThanOrEqual(560)
    expect(Math.abs(caja.x + caja.width / 2 - width / 2)).toBeLessThan(2)
    await captura(pg, 'e11_escritorio_ventana', false)
    await pg.getByRole('button', { name: 'Cerrar' }).click()
    await expect(hoja).toHaveCount(0)
  })

  await test.step('al achicar la ventana vuelve el diseño de celular, y al agrandarla, el de compu', async () => {
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await pg.setViewportSize({ width: 600, height: 900 })
    await expect(lateral(pg)).toHaveCount(0)
    await expect(barraDeAbajo(pg)).toHaveCount(1)
    await pg.setViewportSize({ width: 1280, height: 800 })
    await expect(lateral(pg)).toBeVisible()
    await expect(barraDeAbajo(pg)).toHaveCount(0)
    await ctx.close()
  })

  await test.step('en todos los anchos y pantallas nada se sale por los costados', async () => {
    for (const ancho of [360, 412, 820, ...ANCHOS_COMPU]) {
      ctx = await contexto(browser, { sesion: true, viewport: { width: ancho, height: 900 } })
      pg = await ctx.newPage()
      escuchar(pg, errores)
      for (const ruta of RUTAS) {
        await pg.goto(APP + ruta)
        await pg.waitForSelector('header h1')
        expect(await seSale(pg), `${ruta} a ${ancho} px se sale por los costados`).toBe(false)
        if (ancho >= 1024) await expect(lateral(pg)).toBeVisible()
      }
      await ctx.close()
    }
  })

  sinErrores(errores)
})

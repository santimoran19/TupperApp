// Escanear el código de barras (F-01) y catálogo compartido (F-02). No depende de las otras pruebas: crea sus propias cuentas.
// La cámara es de mentira: un lienzo que dibuja un código de barras EAN-13 de verdad, así el lector se prueba con imagen.
//   Ana  → lector de la librería (como en un iPhone)
//   Beto → lector propio del teléfono (BarcodeDetector, como en Android)
//   Caro → sin permiso para la cámara: escribe el código a mano
import { expect, test } from '@playwright/test'
import { API, APP, captura, escuchar, rest, sinErrores } from './apoyo.js'
import { abrirEscaner, cuenta as nuevaCuenta, guardarProducto, panelDe } from './escaner-apoyo.js'

const BARRITA = '4006381333931' // en Open Food Facts
const SIN_DATOS = '5449000000996' // en Open Food Facts, sin calorías
const DESCONOCIDO = '9780201379624' // en ningún lado

const PRODUCTOS = {
  [BARRITA]: {
    product_name: 'Barrita de cereal Mix',
    brands: 'Marcas',
    quantity: '120 g',
    nutriments: { 'energy-kcal_100g': 380, proteins_100g: 5, carbohydrates_100g: 70, fat_100g: 8 },
  },
  [SIN_DATOS]: { product_name: 'Producto sin datos', nutriments: {} },
}

// Open Food Facts de mentira. `apagado`: responde como si no tuviera nada
const estado = { apagado: false }

const cuenta = (browser, modo, email, nombre) => nuevaCuenta(browser, { modo }, email, nombre, PRODUCTOS, estado)

// Lo que hay en las tablas del catálogo, leído con la clave de servicio (la app no puede leerlas)
// (solo de los productos de esta prueba: las otras pruebas, que van antes, también dejan aportes)
const MIOS = new Set([BARRITA, SIN_DATOS, DESCONOCIDO])
const leer = async (tabla) =>
  (
    await (
      await fetch(`${API}/rest/v1/${tabla}?select=*`, { headers: { Authorization: 'Bearer service-role-de-prueba', apikey: 'test' } })
    ).json()
  ).filter((f) => MIOS.has(f.clave))

test('escáner de código de barras y catálogo compartido entre cuentas', async ({ browser }) => {
  const errores = []

  // ---------- Ana: lector de la librería ----------
  const ana = await cuenta(browser, 'libreria', 'ana.escaner@test.com', 'Ana')
  escuchar(ana.pg, errores)

  await test.step('Ana: aparece el botón, abre la cámara y lee el código dibujado con la librería', async () => {
    await abrirEscaner(ana.pg)
    await expect(ana.pg.getByText('Apuntá la cámara al código de barras')).toBeVisible({ timeout: 20000 })
    await captura(ana.pg, 'y01_escaner', false)
    await ana.pg.evaluate((c) => (window.__camara.codigo = c), BARRITA)
    await expect(panelDe(ana.pg, BARRITA).getByRole('button', { name: /Barrita de cereal Mix/ })).toBeVisible({ timeout: 20000 })
    await expect(panelDe(ana.pg, BARRITA)).toContainText('Open Food Facts')
    await captura(ana.pg, 'y02_producto_por_codigo', false)
  })

  await test.step('Ana: lo guarda; queda con su código y comparte sus datos (todavía sin publicar)', async () => {
    await guardarProducto(ana.pg, panelDe(ana.pg, BARRITA), 'Barrita de cereal Mix (Marcas)')
    const [alimento] = await rest(ana.pg, 'foods', '&codigo=eq.' + BARRITA)
    expect(alimento).toMatchObject({ name: 'Barrita de cereal Mix (Marcas)', unit: 'g', kcal: 380, protein: 5, carbs: 70, fat: 8 })
    const aportes = await leer('catalogo_aportes')
    expect(aportes).toHaveLength(1)
    expect(aportes[0]).toMatchObject({ clave: BARRITA, codigo: BARRITA, unit: 'g', kcal: 380 })
    expect(await leer('catalogo')).toEqual([])
  })

  await test.step('Ana: si vuelve a escanear el mismo producto, abre el que ya cargó sin volver a preguntar', async () => {
    await abrirEscaner(ana.pg)
    await expect(ana.pg.getByText('Apuntá la cámara al código de barras')).toBeVisible({ timeout: 20000 })
    await ana.pg.evaluate((c) => (window.__camara.codigo = c), BARRITA)
    await ana.pg.waitForSelector('text=¿Cuánto tenés?')
    expect(await ana.pg.locator('[role=status]', { hasText: 'CÓDIGO' }).count()).toBe(0)
    expect((await rest(ana.pg, 'foods', '&codigo=eq.' + BARRITA)).length).toBe(1)
    await ana.pg.keyboard.press('Escape')
  })

  await test.step('Ana: un código que no existe en ningún lado ofrece cargarlo a mano, con el código ya puesto', async () => {
    await abrirEscaner(ana.pg)
    await expect(ana.pg.getByText('Apuntá la cámara al código de barras')).toBeVisible({ timeout: 20000 })
    await ana.pg.evaluate((c) => (window.__camara.codigo = c), DESCONOCIDO)
    await expect(panelDe(ana.pg, DESCONOCIDO)).toContainText('No encontramos este código')
    await panelDe(ana.pg, DESCONOCIDO).getByRole('button', { name: 'Cargarlo a mano' }).click()
    await expect(ana.pg.getByText('Código de barras: ' + DESCONOCIDO)).toBeVisible()
    await ana.pg.fill('#na-nombre', 'Galletitas del kiosco')
    await ana.pg.fill('#na-kcal', '480')
    await ana.pg.fill('#na-prot', '6')
    await ana.pg.fill('#na-carb', '70')
    await ana.pg.fill('#na-grasa', '20')
    const compartir = ana.pg.getByLabel('Compartirlo con otras personas de Tupper')
    await expect(compartir).toBeChecked()
    await ana.pg.click('button:has-text("Guardar")')
    await ana.pg.waitForSelector('text=¿Cuánto tenés?')
    await ana.pg.keyboard.press('Escape')
    const [alimento] = await rest(ana.pg, 'foods', '&codigo=eq.' + DESCONOCIDO)
    expect(alimento).toMatchObject({ name: 'Galletitas del kiosco', kcal: 480 })
    expect((await leer('catalogo_aportes')).map((a) => a.clave).sort()).toEqual([BARRITA, DESCONOCIDO].sort())
  })

  await test.step('Ana: un producto de Open Food Facts sin calorías pide cargar los valores a mano', async () => {
    await abrirEscaner(ana.pg)
    await expect(ana.pg.getByText('Apuntá la cámara al código de barras')).toBeVisible({ timeout: 20000 })
    await ana.pg.evaluate((c) => (window.__camara.codigo = c), SIN_DATOS)
    await expect(panelDe(ana.pg, SIN_DATOS)).toContainText('no tiene sus calorías')
    await expect(panelDe(ana.pg, SIN_DATOS)).toContainText('Producto sin datos')
    await panelDe(ana.pg, SIN_DATOS).getByRole('button', { name: 'Cargarlo a mano' }).click()
    expect(await ana.pg.inputValue('#na-nombre')).toBe('Producto sin datos')
    // No lo comparte: se saca la marca y se guarda
    await ana.pg.getByLabel('Compartirlo con otras personas de Tupper').uncheck()
    await ana.pg.fill('#na-kcal', '100')
    await ana.pg.click('button:has-text("Guardar")')
    await ana.pg.waitForSelector('text=¿Cuánto tenés?')
    await ana.pg.keyboard.press('Escape')
    expect((await rest(ana.pg, 'foods', '&codigo=eq.' + SIN_DATOS)).length).toBe(1)
    expect((await leer('catalogo_aportes')).some((a) => a.clave === SIN_DATOS)).toBe(false)
  })
  await ana.ctx.close()

  // ---------- Beto: lector propio del teléfono. Con el mismo producto, el catálogo lo publica ----------
  const beto = await cuenta(browser, 'nativo', 'beto.escaner@test.com', 'Beto')
  escuchar(beto.pg, errores)

  await test.step('Beto: nadie le muestra el producto de Ana todavía, ni por nombre ni por código', async () => {
    await beto.pg.goto(APP + '/despensa')
    await beto.pg.waitForSelector('text=Lista de compras')
    await beto.pg.click('button:has-text("Agregar") >> nth=0')
    await beto.pg.fill('input[placeholder="Buscar alimento..."]', 'barrita de cereal')
    await beto.pg.waitForTimeout(800)
    expect(await beto.pg.getByText('CARGADOS POR OTRAS PERSONAS').count()).toBe(0)
  })

  await test.step('Beto: escanea con el lector del teléfono, guarda el mismo producto y queda publicado', async () => {
    await beto.pg.click('button[aria-label="Escanear código de barras"]')
    await expect(beto.pg.getByText('Apuntá la cámara al código de barras')).toBeVisible({ timeout: 20000 })
    await beto.pg.evaluate((c) => (window.__camara.codigo = c), BARRITA)
    await expect(panelDe(beto.pg, BARRITA).getByRole('button', { name: /Barrita de cereal Mix/ })).toBeVisible({ timeout: 20000 })
    await guardarProducto(beto.pg, panelDe(beto.pg, BARRITA), 'Barrita de cereal Mix (Marcas)', '1')
    const publicados = await leer('catalogo')
    expect(publicados).toHaveLength(1)
    expect(publicados[0]).toMatchObject({ clave: BARRITA, codigo: BARRITA, name: 'Barrita de cereal Mix (Marcas)', confirmaciones: 2 })
    // lo que no se publica: el producto de Ana que nadie más cargó
    expect((await leer('catalogo')).some((c) => c.clave === DESCONOCIDO)).toBe(false)
  })
  await beto.ctx.close()

  // ---------- Caro: sin cámara. Open Food Facts no tiene nada, pero el catálogo sí ----------
  estado.apagado = true
  const caro = await cuenta(browser, 'negada', 'caro.escaner@test.com', 'Caro')
  escuchar(caro.pg, errores)

  await test.step('Caro: buscando por nombre ve lo que cargaron Ana y Beto', async () => {
    await caro.pg.goto(APP + '/despensa')
    await caro.pg.waitForSelector('text=Lista de compras')
    await caro.pg.click('button:has-text("Agregar") >> nth=0')
    await caro.pg.fill('input[placeholder="Buscar alimento..."]', 'barrita de cereal')
    await expect(caro.pg.getByText('CARGADOS POR OTRAS PERSONAS')).toBeVisible()
    await expect(caro.pg.getByRole('button', { name: /Barrita de cereal Mix \(Marcas\)/ })).toBeVisible()
    await captura(caro.pg, 'y03_catalogo', false)
    await caro.pg.fill('input[placeholder="Buscar alimento..."]', '')
  })

  await test.step('Caro: sin permiso de cámara avisa y deja escribir el código; uno mal escrito se rechaza', async () => {
    await caro.pg.click('button[aria-label="Escanear código de barras"]')
    await expect(caro.pg.getByText('No pudimos usar la cámara')).toBeVisible()
    await captura(caro.pg, 'y04_sin_camara', false)
    await caro.pg.fill('#esc-codigo', '4006381333932')
    await caro.pg.click('button:has-text("Buscar")')
    await expect(caro.pg.getByText('Ese código no es válido')).toBeVisible()
    await caro.pg.fill('#esc-codigo', '4006 3813 33931')
    await caro.pg.click('button:has-text("Buscar")')
    await expect(panelDe(caro.pg, BARRITA)).toContainText('Catálogo de Tupper')
  })

  await test.step('Caro: lo guarda desde el catálogo y suma una confirmación', async () => {
    await guardarProducto(caro.pg, panelDe(caro.pg, BARRITA), 'Barrita de cereal Mix (Marcas)', '3')
    const [alimento] = await rest(caro.pg, 'foods', '&codigo=eq.' + BARRITA)
    expect(alimento).toMatchObject({ unit: 'g', kcal: 380 })
    expect((await leer('catalogo'))[0].confirmaciones).toBe(3)
  })

  await test.step('nadie puede leer las tablas del catálogo directo', async () => {
    expect((await rest(caro.pg, 'catalogo')).message).toMatch(/permission denied/)
    expect((await rest(caro.pg, 'catalogo_aportes')).message).toMatch(/permission denied/)
  })
  await caro.ctx.close()

  sinErrores(errores)
})

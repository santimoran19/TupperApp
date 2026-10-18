// Escanear el código de barras (F-01) y catálogo compartido (F-02). No depende de las otras pruebas: crea sus propias cuentas.
// La cámara es de mentira: un lienzo que dibuja un código de barras EAN-13 de verdad, así el lector se prueba con imagen.
//   Ana  → lector de la librería (como en un iPhone)
//   Beto → lector propio del teléfono (BarcodeDetector, como en Android)
//   Caro → sin permiso para la cámara: escribe el código a mano
import { expect, test } from '@playwright/test'
import { API, APP, captura, contexto, escuchar, rest, saltarRecorrido, sinErrores } from './apoyo.js'

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

// Se instala antes de que cargue la app. `modo`: 'libreria' | 'nativo' | 'negada'. El código que "ve" la cámara es window.__camara.codigo.
function instalarCamara({ modo }) {
  window.__camara = { codigo: null }
  if (modo === 'libreria') delete window.BarcodeDetector
  if (modo === 'nativo')
    window.BarcodeDetector = class {
      static async getSupportedFormats() {
        return ['ean_13', 'ean_8', 'upc_a']
      }
      async detect() {
        return window.__camara.codigo ? [{ rawValue: window.__camara.codigo, format: 'ean_13' }] : []
      }
    }
  const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011']
  const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111']
  const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100']
  const PARIDAD = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL']
  const barras = (c) => {
    const p = PARIDAD[Number(c[0])]
    let b = '101'
    for (let i = 0; i < 6; i++) b += (p[i] === 'L' ? L : G)[Number(c[i + 1])]
    b += '01010'
    for (let i = 7; i < 13; i++) b += R[Number(c[i])]
    return b + '101'
  }
  const pedir = async () => {
    if (modo === 'negada') throw new DOMException('Permission denied', 'NotAllowedError')
    const lienzo = document.createElement('canvas')
    lienzo.width = 640
    lienzo.height = 480
    const g = lienzo.getContext('2d')
    let tic = 0
    const dibujar = () => {
      g.fillStyle = '#fff'
      g.fillRect(0, 0, 640, 480)
      const c = window.__camara.codigo
      if (c) {
        g.fillStyle = '#000'
        const bits = barras(c)
        for (let i = 0; i < bits.length; i++) if (bits[i] === '1') g.fillRect(130 + i * 4, 130, 4, 220)
      }
      g.fillStyle = tic++ % 2 ? '#fefefe' : '#fff' // para que el video siga mandando cuadros
      g.fillRect(0, 0, 2, 2)
    }
    dibujar()
    setInterval(dibujar, 100)
    return lienzo.captureStream(10)
  }
  if (!navigator.mediaDevices) Object.defineProperty(navigator, 'mediaDevices', { value: {}, configurable: true })
  navigator.mediaDevices.getUserMedia = pedir
}

// Open Food Facts de mentira. `apagado`: responde como si no tuviera nada
const estado = { apagado: false }
async function openFoodFacts(ctx) {
  await ctx.route('https://search.openfoodfacts.org/**', (r) => r.abort())
  await ctx.route('https://world.openfoodfacts.org/cgi/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"products":[]}' }),
  )
  await ctx.route('https://world.openfoodfacts.org/api/v2/product/**', (r) => {
    const codigo = new URL(r.request().url()).pathname.split('/').pop().replace('.json', '')
    const p = PRODUCTOS[codigo]
    const cabeceras = { 'Access-Control-Allow-Origin': '*' }
    if (!p || estado.apagado)
      return r.fulfill({
        status: 404,
        contentType: 'application/json',
        headers: cabeceras,
        body: '{"status":0,"status_verbose":"product not found"}',
      })
    return r.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: cabeceras,
      body: JSON.stringify({ status: 1, code: codigo, product: { code: codigo, ...p } }),
    })
  })
}

// Lo que hay en las tablas del catálogo, leído con la clave de servicio (la app no puede leerlas)
// (solo de los productos de esta prueba: las otras pruebas, que van antes, también dejan aportes)
const MIOS = new Set([BARRITA, SIN_DATOS, DESCONOCIDO])
const leer = async (tabla) =>
  (
    await (
      await fetch(`${API}/rest/v1/${tabla}?select=*`, { headers: { Authorization: 'Bearer service-role-de-prueba', apikey: 'test' } })
    ).json()
  ).filter((f) => MIOS.has(f.clave))

async function cuenta(browser, modo, email, nombre) {
  const ctx = await contexto(browser)
  await ctx.addInitScript(instalarCamara, { modo })
  await openFoodFacts(ctx)
  const pg = await ctx.newPage()
  await pg.goto(APP + '/')
  await pg.click('button:has-text("Crear cuenta") >> nth=0')
  await pg.fill('#email', email)
  await pg.fill('#clave', 'Secreto3z')
  await pg.fill('#clave2', 'Secreto3z')
  await pg.click('form button[type=submit]')
  await pg.waitForSelector('text=Armemos tu perfil')
  await pg.fill('#pf-nombre', nombre)
  await pg.fill('#pf-usuario', nombre.toLowerCase() + '.esc')
  await pg.fill('#pf-nac', '1995-05-05')
  await pg.fill('#pf-altura', '170')
  await pg.fill('#pf-peso', '65')
  await pg.click('button:has-text("Empezar")')
  await pg.waitForSelector(`text=¡Hola, ${nombre}!`)
  await saltarRecorrido(pg)
  return { ctx, pg }
}

const abrirEscaner = async (pg) => {
  await pg.goto(APP + '/despensa')
  await pg.waitForSelector('text=Lista de compras')
  await pg.click('button:has-text("Agregar") >> nth=0')
  await pg.click('button[aria-label="Escanear código de barras"]')
}
const panelDe = (pg, codigo) => pg.locator('[role=status]', { hasText: 'CÓDIGO ' + codigo })
// Elige el producto que apareció, pone cuánto hay y guarda
async function guardarProducto(pg, panel, nombre, cantidad = '2') {
  await panel.getByRole('button', { name: nombre }).click()
  await pg.waitForSelector('text=¿Cuánto tenés?')
  await pg.locator('div.fixed input[inputmode]').first().fill(cantidad)
  await pg.click('div.fixed button:has-text("Guardar")')
  await pg.waitForSelector(`p.font-semibold:text-is("${nombre}")`)
}

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

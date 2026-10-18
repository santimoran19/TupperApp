// Escáner con códigos difíciles (chicos, de colores, blanco sobre oscuro), zoom y linterna, foto del código y productos sin datos.
// No depende de las otras pruebas: crea su propia cuenta. La cámara es de mentira (ver camara-falsa.js): un video de 1280x720
// donde el código ocupa solo una parte, como cuando se lo escanea de lejos.
import { expect, test } from '@playwright/test'
import { escuchar, rest, sinErrores } from './apoyo.js'
import { abrirEscaner, cuenta, panelDe } from './escaner-apoyo.js'

const NEGRO = '7791234567898'
const INVERTIDO = '7790001112224'
const CHICO = '7795556667779'
const COLORES = '7798889990002'
const DE_FOTO = '7793216549878'
const ATUN = '7790070000019' // en Open Food Facts, con nombre y sin calorías: se parte del atún de la base
const CALCULADO = '7790070000026' // en Open Food Facts, sin calorías pero con proteínas, carbohidratos y grasas
const POR_PORCION = '7790070000033' // en Open Food Facts, con los valores de una porción

const rico = (nombre, nutriments, extra = {}) => ({ product_name: nombre, brands: 'Marca', quantity: '200 g', nutriments, ...extra })
const PRODUCTOS = {
  [NEGRO]: rico('Galletitas negras', { 'energy-kcal_100g': 450, proteins_100g: 6, carbohydrates_100g: 70, fat_100g: 16 }),
  [INVERTIDO]: rico('Cacao invertido', { 'energy-kcal_100g': 380, proteins_100g: 20, carbohydrates_100g: 10, fat_100g: 22 }),
  [CHICO]: rico('Sachet chico', { 'energy-kcal_100g': 90, proteins_100g: 2, carbohydrates_100g: 15, fat_100g: 2 }),
  [COLORES]: rico(
    'Gaseosa de colores',
    { 'energy-kcal_100g': 42, proteins_100g: 0, carbohydrates_100g: 10.5, fat_100g: 0 },
    { quantity: '500 ml' },
  ),
  [DE_FOTO]: rico('Mermelada de foto', { 'energy-kcal_100g': 250, proteins_100g: 0.4, carbohydrates_100g: 62, fat_100g: 0.1 }),
  [ATUN]: { product_name: 'Atún desmenuzado', brands: 'La Campagnola', quantity: '170 g', nutriments: {} },
  [CALCULADO]: rico('Barra sin calorías', { proteins_100g: 10, carbohydrates_100g: 60, fat_100g: 5 }),
  [POR_PORCION]: rico(
    'Snack por porción',
    { 'energy-kcal_serving': 90, proteins_serving: 3, carbohydrates_serving: 15, fat_serving: 2 },
    { serving_quantity: '30' },
  ),
}

// El código que ve la cámara y cómo se lo dibuja
const mostrar = (pg, codigo, estilo) =>
  pg.evaluate(
    ([c, e]) => {
      window.__camara.estilo = { ...window.__camara.estilo, ...e }
      window.__camara.codigo = c
    },
    [codigo, estilo],
  )
const unoSolo = (pg, codigo, nombre) => expect(panelDe(pg, codigo).getByRole('button', { name: nombre })).toBeVisible({ timeout: 30000 })
const esperarCamara = (pg) => expect(pg.getByText('Apuntá la cámara al código de barras')).toBeVisible({ timeout: 20000 })

test('escáner: códigos chicos, de colores e invertidos, foto, zoom y productos sin calorías', async ({ browser }) => {
  const errores = []
  const { ctx, pg } = await cuenta(
    browser,
    { modo: 'libreria', controles: true, ancho: 1280, alto: 720 },
    'dani.dificil@test.com',
    'Dani',
    PRODUCTOS,
  )
  escuchar(pg, errores)

  // Cada código se muestra con la cámara abierta y el lector tiene que encontrarlo solo
  const casos = [
    ['negro sobre blanco, tamaño normal (línea de base)', NEGRO, 'Galletitas negras', { modulo: 3, alto: 200 }],
    ['blanco sobre negro (invertido)', INVERTIDO, 'Cacao invertido', { barras: '#fff', fondo: '#000', modulo: 3, alto: 200 }],
    [
      'muy chico: 125 píxeles de ancho en un video de 1280, un poco borroso',
      CHICO,
      'Sachet chico',
      { modulo: 1.3, alto: 80, desenfoque: 0.2 },
    ],
    [
      'de colores: azul oscuro sobre amarillo',
      COLORES,
      'Gaseosa de colores',
      { barras: '#1a237e', fondo: '#f6d55c', modulo: 2.6, alto: 140 },
    ],
  ]
  for (const [titulo, codigo, nombre, estilo] of casos) {
    await test.step(`lee un código ${titulo}`, async () => {
      await abrirEscaner(pg)
      await esperarCamara(pg)
      await mostrar(pg, codigo, estilo)
      await unoSolo(pg, codigo, new RegExp(nombre))
    })
  }

  await test.step('zoom y linterna: aparecen si la cámara los tiene y se aplican', async () => {
    await abrirEscaner(pg)
    await esperarCamara(pg)
    await expect(pg.getByLabel('Zoom')).toBeVisible()
    await pg.getByLabel('Zoom').fill('2.5')
    await pg.getByRole('button', { name: 'Linterna' }).click()
    await expect(pg.getByRole('button', { name: 'Linterna' })).toHaveAttribute('aria-pressed', 'true')
    const aplicadas = await pg.evaluate(() => window.__camara.aplicadas)
    expect(aplicadas).toContainEqual({ advanced: [{ focusMode: 'continuous' }] })
    expect(aplicadas).toContainEqual({ advanced: [{ zoom: 2.5 }] })
    expect(aplicadas).toContainEqual({ advanced: [{ torch: true }] })
  })

  await test.step('foto: un código chico en una foto grande, blanco sobre oscuro, se lee con el botón de foto', async () => {
    await abrirEscaner(pg)
    await esperarCamara(pg)
    await expect(pg.getByRole('button', { name: 'Sacarle una foto' })).toBeVisible()
    await pg.evaluate((c) => window.__camara.subirFoto(c, { barras: '#fff', fondo: '#111', modulo: 3.2, alto: 260 }, 3000, 2000), DE_FOTO)
    await unoSolo(pg, DE_FOTO, /Mermelada de foto/)
  })

  await test.step('foto sin ningún código: avisa y se puede seguir', async () => {
    await abrirEscaner(pg)
    await esperarCamara(pg)
    await pg.evaluate(() => window.__camara.subirFoto(null, {}, 1600, 1200))
    await expect(pg.getByText('No pudimos leer el código en esa foto')).toBeVisible({ timeout: 30000 })
    await expect(pg.getByRole('button', { name: 'Sacarle una foto' })).toBeEnabled()
  })

  await test.step('sin calorías en Open Food Facts pero con proteínas, carbohidratos y grasas: las calcula y lo avisa', async () => {
    await abrirEscaner(pg)
    await esperarCamara(pg)
    await pg.getByLabel('O escribí los números del código').fill(CALCULADO)
    await pg.click('button:has-text("Buscar")')
    const panel = panelDe(pg, CALCULADO)
    await expect(panel.getByRole('button', { name: /Barra sin calorías/ })).toContainText('325 kcal')
    await expect(panel).toContainText('las calculamos con sus proteínas, carbohidratos y grasas')
    // un valor calculado no se comparte con el catálogo
    await panel.getByRole('button', { name: /Barra sin calorías/ }).click()
    await pg.waitForSelector('text=¿Cuánto tenés?')
    await pg.keyboard.press('Escape')
    const [alimento] = await rest(pg, 'foods', '&codigo=eq.' + CALCULADO)
    expect(alimento).toMatchObject({ kcal: 325, protein: 10, carbs: 60, fat: 5 })
    const aportes = await (
      await fetch('http://localhost:54321/rest/v1/catalogo_aportes?select=clave', {
        headers: { Authorization: 'Bearer service-role-de-prueba', apikey: 'test' },
      })
    ).json()
    expect(aportes.some((a) => a.clave === CALCULADO)).toBe(false)
  })

  await test.step('valores por porción: se pasan a cada 100 g', async () => {
    await abrirEscaner(pg)
    await esperarCamara(pg)
    await pg.getByLabel('O escribí los números del código').fill(POR_PORCION)
    await pg.click('button:has-text("Buscar")')
    await expect(panelDe(pg, POR_PORCION).getByRole('button', { name: /Snack por porción/ })).toContainText('300 kcal')
  })

  await test.step('sin calorías ni macros: se parte de un alimento parecido de la base, con aviso, y no se comparte', async () => {
    await abrirEscaner(pg)
    await esperarCamara(pg)
    await pg.getByLabel('O escribí los números del código').fill(ATUN)
    await pg.click('button:has-text("Buscar")')
    const panel = panelDe(pg, ATUN)
    await expect(panel).toContainText('no tiene sus calorías')
    await expect(panel.getByRole('button', { name: /Atún al natural/ })).toBeVisible()
    await panel.getByRole('button', { name: /Atún al natural/ }).click()
    // el formulario sale con el nombre del producto y los valores del atún de la base, avisando que son aproximados
    await expect(pg.getByText('Estos valores son aproximados')).toBeVisible()
    expect(await pg.inputValue('#na-nombre')).toBe('Atún desmenuzado (La Campagnola)')
    expect(await pg.inputValue('#na-kcal')).toBe('110')
    expect(await pg.inputValue('#na-prot')).toBe('25')
    expect(await pg.inputValue('#na-unidad')).toBe('g')
    // mientras los valores sean los aproximados no se ofrece compartirlos
    await expect(pg.getByLabel('Compartirlo con otras personas de Tupper')).toHaveCount(0)
    // al corregirlos con la etiqueta sí
    await pg.fill('#na-kcal', '190')
    await expect(pg.getByLabel('Compartirlo con otras personas de Tupper')).toBeVisible()
    await pg.fill('#na-kcal', '110')
    await expect(pg.getByLabel('Compartirlo con otras personas de Tupper')).toHaveCount(0)
    await pg.click('button:has-text("Guardar")')
    await pg.waitForSelector('text=¿Cuánto tenés?')
    await pg.keyboard.press('Escape')
    const [alimento] = await rest(pg, 'foods', '&codigo=eq.' + ATUN)
    expect(alimento).toMatchObject({ name: 'Atún desmenuzado (La Campagnola)', kcal: 110, protein: 25, unit: 'g' })
    const aportes = await (
      await fetch('http://localhost:54321/rest/v1/catalogo_aportes?select=clave', {
        headers: { Authorization: 'Bearer service-role-de-prueba', apikey: 'test' },
      })
    ).json()
    expect(aportes.some((a) => a.clave === ATUN)).toBe(false)
  })

  await ctx.close()
  sinErrores(errores)
})

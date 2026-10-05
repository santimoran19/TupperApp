// Equivalencias: un producto propio (de Open Food Facts o cargado a mano) vale por un alimento de las recetas. Usa la sesión de las pruebas anteriores.
import fs from 'node:fs'
import { expect, test } from '@playwright/test'
import { API, APP, IPHONE, captura, contexto, escuchar, rest, sinErrores } from './apoyo.js'

const OFF = {
  'aceite natura': [{ code: '779001', product_name: 'Aceite de girasol', brands: 'Natura', quantity: '900 ml', nutriments: { 'energy-kcal_100g': 828, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 92 } }],
  'arroz gallo': [{ code: '779002', product_name: 'Arroz Gallo Oro', brands: 'Gallo', quantity: '1 kg', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 7, carbohydrates_100g: 78, fat_100g: 1 } }],
  alfajor: [{ code: '779003', product_name: 'Alfajor triple', brands: 'Jorgito', quantity: '70 g', nutriments: { 'energy-kcal_100g': 420, proteins_100g: 5, carbohydrates_100g: 65, fat_100g: 16 } }],
}

test('equivalencias: un producto propio vale por un alimento de las recetas', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true })
  await ctx.route('https://world.openfoodfacts.org/**', async (route) => {
    const url = new URL(route.request().url())
    const q = (url.searchParams.get('search_terms') || '').toLowerCase()
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ products: OFF[q] || [] }) })
  })
  await ctx.route('https://search.openfoodfacts.org/**', (route) => route.abort()) // ERR_FAILED: el buscador nuevo, que acá se simula caído
  const pg = await ctx.newPage()
  const errores = escuchar(pg)
  await pg.goto(APP + '/')
  await pg.waitForSelector('text=¡Hola, Santi!')

  // Escribe en la base simulada con la sesión de la página ('UID' es el id del usuario)
  const enviar = (metodo, ruta, cuerpo = null, prefer = null) => pg.evaluate(async ([api, metodo, ruta, cuerpo, prefer]) => {
    const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
    const ses = JSON.parse(localStorage.getItem(k))
    const h = { Authorization: 'Bearer ' + ses.access_token, apikey: 'test', 'Content-Type': 'application/json', Prefer: prefer || 'return=representation' }
    const r = await fetch(api + '/rest/v1/' + ruta.replace('UID', ses.user.id), { method: metodo, headers: h, body: cuerpo ? JSON.stringify(cuerpo).replaceAll('UID', ses.user.id) : undefined })
    const t = await r.text()
    return t ? JSON.parse(t) : null
  }, [API, metodo, ruta, cuerpo, prefer])

  const foods = await rest(pg, 'foods')
  const base = Object.fromEntries(foods.filter((a) => a.slug).map((a) => [a.slug, a]))
  const poner = async (slugOId, qty) => {
    const fid = Object.hasOwn(base, slugOId) ? base[slugOId].id : slugOId
    await enviar('POST', 'stock?on_conflict=user_id,food_id', { user_id: 'UID', food_id: fid, qty }, 'resolution=merge-duplicates,return=representation')
  }
  const stock = async (fid) => {
    const r = await rest(pg, 'stock', '&food_id=eq.' + fid)
    return r.length ? parseFloat(r[0].qty) : null
  }
  const filaIngrediente = (nombre) => pg.locator('section.tarjeta div.flex.items-center.gap-3', { has: pg.locator(`span.flex-1:text-is("${nombre}")`) }).first()
  const abrirReceta = async () => {
    await pg.goto(APP + '/recetas/' + receta.id)
    await pg.waitForSelector('text=Ingredientes')
  }
  const macros = async () => (await pg.locator('main p:has-text("Valores por porción")').locator('xpath=preceding-sibling::*[1]').innerText()).replaceAll('\n', ' ')

  let receta
  let natura
  let camp
  let fideos
  let campo

  await test.step('punto de partida: sin aceite ni atún', async () => {
    // Punto de partida: sin aceite ni atún, con el resto de la receta de prueba
    for (const [s, q] of [['aceite', 0], ['atun-natural', 0], ['pata-muslo', 12], ['papa', 2000], ['batata', 1000], ['arroz', 0]]) await poner(s, q)
    receta = (await rest(pg, 'recipes')).filter((r) => r.slug === 'pata-muslo-horno')[0]
    await abrirReceta()
    const f = filaIngrediente('Aceite')
    expect(await f.innerText()).toContain('tenés 0 ml')
    expect(await f.innerHTML()).toContain('text-naranja-oscuro')
    // kcal por porción, antes
    await macros()
    expect(await pg.locator('button:has-text("Anotar lo que falta")').count()).toBe(1)
  })

  await test.step('traer un producto de Open Food Facts: pregunta si cuenta como Aceite', async () => {
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('text=Lista de compras')
    await pg.click('button:has-text("Agregar") >> nth=0')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'aceite natura')
    await pg.click('button:has-text("en Open Food Facts")')
    await pg.waitForSelector('text=Aceite de girasol (Natura)')
    await pg.click('button:has-text("Aceite de girasol (Natura)")')
    await pg.waitForSelector('[role=alertdialog]')
    await captura(pg, 'e01_pregunta', false)
    expect(await pg.locator('[role=alertdialog]').innerText()).toContain('¿Cuenta como Aceite en las recetas?')
    await pg.click('[role=alertdialog] button:has-text("Sí")')
    await pg.waitForSelector('text=¿Cuánto tenés?')
    await pg.locator('div.fixed input[inputmode]').first().fill('900')
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForSelector('p:has-text("cuenta como Aceite")')
    await captura(pg, 'e02_despensa', false)
    natura = (await rest(pg, 'foods')).filter((a) => a.name === 'Aceite de girasol (Natura)')[0]
    expect(natura.same_as, JSON.stringify(natura)).toBe(base.aceite.id)
    expect(natura.unit, JSON.stringify(natura)).toBe('ml')
    const tarjeta = pg.locator('div.tarjeta', { has: pg.locator('p.font-semibold:text-is("Aceite de girasol (Natura)")') })
    // el texto chico de la tarjeta
    await tarjeta.locator('p.text-xs').innerText()
    expect(await tarjeta.locator('text=¿Cuenta como').count()).toBe(0)

    // La receta ahora tiene aceite, y dice con qué producto
    await abrirReceta()
    const f = filaIngrediente('Aceite')
    await captura(pg, 'e03_receta')
    expect(await f.innerText()).toContain('tenés 900 ml')
    expect(await f.innerText()).toContain('con Aceite de girasol')
    expect(await f.innerHTML()).toContain('text-verde-medio')
    expect(await pg.locator('button:has-text("Anotar lo que falta")').count(), 'ya no tiene que faltar nada').toBe(0)
    // kcal por porción, con el producto
    await macros()
    // En la lista de recetas figura como que se puede hacer
    await pg.goto(APP + '/recetas')
    await pg.waitForSelector('text=para cocinar')
    const t = await pg.locator('a.tarjeta', { hasText: 'Pata muslo al horno con papa y batata' }).innerText()
    expect(t).toContain('Tenés todo')

    // Cocinar descuenta del producto, no del genérico
    await abrirReceta()
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    await pg.click('button:has-text("Listo, cociné")')
    await pg.waitForSelector('text=porciones listas')
    expect(await stock(natura.id)).toBe(885)
    expect(await stock(base.aceite.id)).toBe(0)
  })

  await test.step('decir que no: queda como alimento aparte y no vuelve a preguntar', async () => {
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('text=Lista de compras')
    await pg.click('button:has-text("Agregar") >> nth=0')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'arroz gallo')
    await pg.click('button:has-text("en Open Food Facts")')
    await pg.click('button:has-text("Arroz Gallo Oro")')
    await pg.waitForSelector('[role=alertdialog]')
    // la pregunta
    await pg.locator('[role=alertdialog] h2').innerText()
    await pg.click('[role=alertdialog] button:has-text("No")')
    await pg.waitForSelector('text=¿Cuánto tenés?')
    await pg.locator('div.fixed input[inputmode]').first().fill('1000')
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForSelector('p.font-semibold:text-is("Arroz Gallo Oro")')
    await pg.waitForTimeout(300)
    const gallo = (await rest(pg, 'foods')).filter((a) => a.name === 'Arroz Gallo Oro')[0]
    expect(gallo.same_as).toBeNull()
    let tarjeta = pg.locator('div.tarjeta', { has: pg.locator('p.font-semibold:text-is("Arroz Gallo Oro")') })
    expect(await tarjeta.locator('text=¿Cuenta como').count()).toBe(0)
    expect(await tarjeta.locator('text=cuenta como').count()).toBe(0)
    await pg.reload()
    await pg.waitForSelector('p.font-semibold:text-is("Arroz Gallo Oro")')
    expect(await pg.locator('text=¿Cuenta como').count(), 'dijo que no: no se vuelve a preguntar').toBe(0)
    // Igual se puede vincular a mano desde la hoja del producto en la despensa
    tarjeta = pg.locator('div.tarjeta', { has: pg.locator('p.font-semibold:text-is("Arroz Gallo Oro")') })
    await tarjeta.locator('button.px-1').click()
    await pg.waitForSelector('#dp-vale')
    await captura(pg, 'e09_hoja_despensa', false)
    await pg.selectOption('#dp-vale', base.arroz.id)
    await pg.waitForSelector('p:has-text("cuenta como Arroz largo fino")')
    expect((await rest(pg, 'foods')).filter((a) => a.id === gallo.id)[0].same_as).toBe(base.arroz.id)
    await pg.selectOption('#dp-vale', '')
    await pg.waitForTimeout(400)
    expect(await pg.locator('p:has-text("cuenta como Arroz largo fino")').count()).toBe(0)
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForTimeout(300)
    // Algo que no se parece a nada no pregunta
    await pg.click('button:has-text("Agregar") >> nth=0')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'alfajor')
    await pg.click('button:has-text("en Open Food Facts")')
    await pg.click('button:has-text("Alfajor triple")')
    await pg.waitForSelector('text=¿Cuánto tenés?')
    expect(await pg.locator('[role=alertdialog]').count()).toBe(0)
    await pg.locator('div.fixed input[inputmode]').first().fill('70')
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForTimeout(400)
  })

  await test.step('un producto que ya estaba cargado (en gramos) contra un alimento en latas', async () => {
    camp = (await enviar('POST', 'foods', { owner: 'UID', name: 'Atún al natural La Campagnola', unit: 'g', unit_grams: null, unit_label: null, kcal: 105, protein: 24, carbs: 0, fat: 1, category: 'Otros', alcohol: false }))[0]
    await poner(camp.id, 240)
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('p.font-semibold:text-is("Atún al natural La Campagnola")')
    const tarjeta = pg.locator('div.tarjeta', { has: pg.locator('p.font-semibold:text-is("Atún al natural La Campagnola")') })
    // la sugerencia
    await tarjeta.locator('div.bg-teal-suave').innerText()
    await tarjeta.scrollIntoViewIfNeeded()
    await captura(pg, 'e04_sugerencia', false)
    expect(await tarjeta.innerText()).toContain('¿Cuenta como Atún al natural en las recetas?')
    await tarjeta.locator('button:text-is("Sí")').click()
    await pg.waitForSelector('text=Las recetas ya lo usan como atún al natural')
    await pg.waitForSelector('p:has-text("cuenta como Atún al natural")')
    expect(await tarjeta.locator('div.bg-teal-suave').count()).toBe(0)
    fideos = (await rest(pg, 'recipes')).filter((r) => r.slug === 'fideos-con-atun')[0]
    await pg.goto(APP + '/recetas/' + fideos.id)
    await pg.waitForSelector('text=Ingredientes')
    const f = filaIngrediente('Atún al natural')
    expect(await f.innerText()).toContain('tenés 2 latas')
    expect(await f.innerText()).toContain('con Atún al natural La Campagnola')
    // "La comí" con una receta descuenta del producto, en gramos
    await pg.click('button:has-text("La comí")')
    await pg.waitForSelector('text=Tu plato')
    await pg.click('button:has-text("Agregar a")')
    await pg.waitForSelector('text=¡Hola, Santi!')
    // 1 porción lleva 1 lata = 120 g
    expect(await stock(camp.id)).toBe(120)
  })

  await test.step('mis alimentos: se ve el vínculo y se puede cambiar', async () => {
    await pg.goto(APP + '/alimentos')
    await pg.waitForSelector('text=Mis alimentos')
    await captura(pg, 'e05_mis_alimentos')
    const fila = pg.locator('div.flex.items-center.gap-1', { has: pg.locator('p.font-medium:text-is("Atún al natural La Campagnola")') })
    expect(await fila.innerText()).toContain('cuenta como Atún al natural')
    await pg.click('button[aria-label="Editar Atún al natural La Campagnola"]')
    await pg.waitForSelector('#na-vale')
    await captura(pg, 'e06_editar')
    expect(await pg.inputValue('#na-vale')).toBe(base['atun-natural'].id)
    const opciones = await pg.locator('#na-vale option').allInnerTexts()
    expect(opciones).not.toContain('Arroz Gallo Oro')
    expect(opciones).not.toContain('Atún al natural La Campagnola')
    // en unidades sin peso no se puede pasar a latas: el selector deja de ofrecerlo
    await pg.selectOption('#na-vale', '')
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForSelector('text=Alimento guardado')
    await pg.waitForTimeout(300)
    expect(await fila.innerText()).not.toContain('cuenta como')
    expect((await rest(pg, 'foods')).filter((a) => a.id === camp.id)[0].same_as).toBeNull()
    await pg.goto(APP + '/recetas/' + fideos.id)
    await pg.waitForSelector('text=Ingredientes')
    const f = filaIngrediente('Atún al natural')
    expect(await f.innerText()).toContain('tenés 0 latas')
    expect(await f.innerText()).not.toContain('con ')
    // crear a mano con el vínculo elegido
    await pg.goto(APP + '/alimentos')
    await pg.click('button:has-text("Crear alimento")')
    await pg.fill('#na-nombre', 'Huevo de campo')
    await pg.selectOption('#na-unidad', 'u')
    await pg.fill('#na-gr', '60')
    await pg.fill('#na-kcal', '155')
    await pg.fill('#na-prot', '13')
    await pg.selectOption('#na-vale', base.huevo.id)
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForSelector('text=Alimento guardado')
    campo = (await rest(pg, 'foods')).filter((a) => a.name === 'Huevo de campo')[0]
    expect(campo.same_as).toBe(base.huevo.id)
  })

  await test.step('compras: al marcar "Aceite" como comprado se elige qué producto fue', async () => {
    await pg.goto(APP + '/compras')
    await pg.waitForSelector('text=Para comprar')
    if ((await pg.locator('div.flex.items-center.gap-2.py-3', { has: pg.locator('p.font-medium:text-is("Aceite")') }).count()) === 0) {
      await pg.click('button:has-text("Anotar")')
      await pg.fill('input[placeholder="Buscar alimento..."]', 'aceite')
      await pg.locator('div.divide-y > button', { has: pg.locator('p.font-medium:text-is("Aceite")') }).click()
    }
    const fila = pg.locator('div.flex.items-center.gap-2.py-3', { has: pg.locator('p.font-medium:text-is("Aceite")') })
    await fila.waitFor()
    await fila.locator('button:has-text("Comprado")').click()
    await pg.waitForSelector('text=¿Qué compraste?')
    await captura(pg, 'e07_compra', false)
    const chips = pg.locator('div.fixed button.rounded-full.h-9.px-4')
    expect(await chips.allInnerTexts()).toEqual(['Aceite', 'Aceite de oliva', 'Aceite de girasol'])
    expect(await pg.locator('div.fixed button.bg-verde.rounded-full.h-9').innerText()).toBe('Aceite de girasol')
    await pg.fill('#cp-cantidad', '900')
    await pg.click('button:has-text("Confirmar compra")')
    await pg.waitForSelector('text=Sumado a tu despensa')
    expect(await stock(natura.id)).toBe(1785)
    expect(await stock(base.aceite.id)).toBe(0)
    await pg.waitForTimeout(300)
    expect(await pg.locator('div.flex.items-center.gap-2.py-3', { has: pg.locator('p.font-medium:text-is("Aceite")') }).count(), 'tiene que salir de la lista').toBe(0)
    expect(await pg.locator('text=Compras del mes').locator('xpath=following-sibling::div[1]').innerText()).toContain('Aceite de girasol (Natura)')
  })

  await test.step('borrar el producto: las recetas vuelven a mirar el genérico', async () => {
    await pg.goto(APP + '/alimentos')
    await pg.click('button[aria-label="Borrar Aceite de girasol (Natura)"]')
    await pg.click('[role=alertdialog] button:has-text("Borrar")')
    await pg.waitForSelector('text=Alimento borrado')
    await abrirReceta()
    const f = filaIngrediente('Aceite')
    expect(await f.innerText()).toContain('tenés 0 ml')
    expect(await f.innerText()).not.toContain('con ')
    // exportar: el vínculo sale con nombre
    await pg.goto(APP + '/perfil')
    await pg.waitForSelector('text=Descargar mis datos')
    const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('text=Descargar mis datos')])
    const datos = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'))
    expect(datos.alimentos_propios.every((a) => !('same_as' in a))).toBe(true)
  })

  await test.step('vista en iPhone oscuro', async () => {
    const ctx2 = await contexto(browser, { sesion: true, ...IPHONE })
    const pg2 = await ctx2.newPage()
    const c2 = (await enviar('POST', 'foods', { owner: 'UID', name: 'Leche descremada La Serenísima', unit: 'ml', unit_grams: null, unit_label: null, kcal: 33, protein: 3, carbs: 4.7, fat: 0.1, category: 'Lácteos', alcohol: false }))[0]
    await poner(c2.id, 1000)
    await poner(campo.id, 6)
    await pg2.goto(APP + '/despensa')
    await pg2.waitForSelector('p.font-semibold:text-is("Leche descremada La Serenísima")')
    await pg2.locator('div.tarjeta', { has: pg2.locator('p.font-semibold:text-is("Leche descremada La Serenísima")') }).scrollIntoViewIfNeeded()
    await pg2.evaluate(() => window.scrollBy(0, -220))
    await captura(pg2, 'e08_oscuro_despensa', false)
    await ctx2.close()
  })

  await ctx.close()
  sinErrores(errores)
})

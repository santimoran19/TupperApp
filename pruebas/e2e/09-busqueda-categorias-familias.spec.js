// v1.6: Open Food Facts con dos buscadores y reintentos, categorías nuevas y editables, sinónimos, familias y recetas nuevas. Usa la sesión de las pruebas anteriores.
import { expect, test } from '@playwright/test'
import { API, APP, captura, contexto, escuchar, IPHONE, sinErrores } from './apoyo.js'

// Un pedido a la base simulada con la sesión de la página ('UID' se cambia por el id del usuario)
const PEDIDO = async ([api, metodo, ruta, cuerpo, prefer]) => {
  const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
  const ses = JSON.parse(localStorage.getItem(k))
  const h = {
    Authorization: 'Bearer ' + ses.access_token,
    apikey: 'test',
    'Content-Type': 'application/json',
    Prefer: prefer || 'return=representation',
  }
  const r = await fetch(api + '/rest/v1/' + ruta.replace('UID', ses.user.id), {
    method: metodo,
    headers: h,
    body: cuerpo ? JSON.stringify(cuerpo).replaceAll('UID', ses.user.id) : undefined,
  })
  const t = await r.text()
  return t ? JSON.parse(t) : null
}

// Respuestas del buscador nuevo (hits, nombre por idioma, marca como etiqueta)
const NUEVO = {
  'tirabuzon matarazzo': [
    {
      code: '7790001',
      product_name: { main: 'Tirabuzón N°28', es: 'Tirabuzón N°28' },
      brands: ['matarazzo'],
      quantity: '500 g',
      nutriments: { 'energy-kcal_100g': 352, proteins_100g: 12, carbohydrates_100g: 72, fat_100g: 1.5 },
      categories_tags: ['en:plant-based-foods-and-beverages', 'en:pastas'],
      countries_tags: ['en:argentina'],
    },
    {
      code: '7790002',
      product_name: 'Tirabuzón integral',
      brands: ['matarazzo'],
      quantity: '500 g',
      nutriments: { 'energy-kcal_100g': 340, proteins_100g: 13 },
      countries_tags: ['en:argentina'],
    },
    {
      code: '7790003',
      product_name: 'Fideos tirabuzón al huevo',
      brands: 'Don Vicente',
      quantity: '500 g',
      nutriments: { 'energy-kj_100g': 1500 },
      countries_tags: ['en:argentina'],
    },
  ],
  'yerba playadito': [
    {
      code: '7790010',
      product_name: 'Yerba mate suave',
      brands: ['playadito'],
      quantity: '1 kg',
      nutriments: { 'energy-kcal_100g': 0 },
      countries_tags: ['en:argentina'],
    },
    {
      code: '7790011',
      product_name: 'Yerba mate con palo',
      brands: ['playadito'],
      quantity: '500 g',
      nutriments: { 'energy-kcal_100g': 0 },
      countries_tags: ['en:argentina'],
    },
    {
      code: '7790012',
      product_name: 'Yerba mate despalada',
      brands: ['playadito'],
      quantity: '500 g',
      nutriments: { 'energy-kcal_100g': 0 },
      countries_tags: ['en:argentina'],
    },
  ],
}

test('buscador con sinónimos, Open Food Facts, categorías, familias y recetas nuevas', async ({ browser }) => {
  const pedidos = []
  const fallar = { n: 0 }
  const ctx = await contexto(browser, { sesion: true })
  await ctx.route('https://search.openfoodfacts.org/**', async (route) => {
    const url = new URL(route.request().url())
    const q = (url.searchParams.get('q') || '').toLowerCase().replaceAll(' countries_tags:"en:argentina"', '')
    pedidos.push(['nuevo', q])
    if (fallar.n > 0) {
      fallar.n -= 1
      return route.fulfill({ status: 503, contentType: 'text/html', body: '<html>Service Unavailable</html>' })
    }
    const hits = Object.hasOwn(NUEVO, q) ? NUEVO[q] : []
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ hits, count: hits.length, page: 1 }),
    })
  })
  await ctx.route('https://world.openfoodfacts.org/**', async (route) => {
    const url = new URL(route.request().url())
    pedidos.push(['viejo', url.searchParams.get('search_terms') || ''])
    await route.fulfill({ status: 503, contentType: 'text/html', body: '<html>Service Unavailable</html>' })
  })
  const pg = await ctx.newPage()
  const errores = escuchar(pg)
  await pg.goto(APP + '/')
  await pg.waitForSelector('text=¡Hola, Santi!')

  const api = (metodo, ruta, cuerpo = null, prefer = null) => pg.evaluate(PEDIDO, [API, metodo, ruta, cuerpo, prefer])
  const foods = await api('GET', 'foods?select=*')
  const base = Object.fromEntries(foods.filter((f) => f.slug).map((f) => [f.slug, f]))
  const poner = (fid, qty) =>
    api(
      'POST',
      'stock?on_conflict=user_id,food_id',
      { user_id: 'UID', food_id: fid, qty },
      'resolution=merge-duplicates,return=representation',
    )
  const propio = async (nombre, { unit = 'g', cat = 'Otros', qty = 500 } = {}) => {
    const a = (
      await api('POST', 'foods', {
        owner: 'UID',
        name: nombre,
        unit,
        unit_grams: null,
        unit_label: null,
        kcal: 350,
        protein: 10,
        carbs: 70,
        fat: 2,
        category: cat,
        alcohol: false,
      })
    )[0]
    await poner(a.id, qty)
    return a
  }
  const tarjeta = (nombre) => pg.locator('div.tarjeta', { has: pg.locator(`p.font-semibold:text-is("${nombre}")`) })
  const abrirDespensa = async () => {
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('text=Lista de compras')
  }
  const resultados = async () =>
    (await pg.locator('div.fixed div.divide-y.divide-linea > button').allInnerTexts()).map((t) => t.split('\n')[0])

  await test.step('el buscador propio encuentra por sinónimos y hay productos nuevos', async () => {
    await abrirDespensa()
    await pg.click('button:has-text("Agregar") >> nth=0')
    const hallado = {}
    for (const q of ['spaghetti', 'mozzarella', 'pomarola', 'jardinera', 'savora', 'paty', 'yerba']) {
      await pg.fill('input[placeholder="Buscar alimento..."]', q)
      await pg.waitForTimeout(150)
      hallado[q] = (await resultados()).slice(0, 3)
    }
    expect(hallado.spaghetti[0]).toBe('Fideos secos (crudos)')
    expect(hallado.mozzarella).toEqual(['Queso muzzarella'])
    expect(hallado.pomarola).toContain('Salsa de tomate lista (pomarola, filetto)')
    expect(hallado.jardinera).toEqual(['Jardinera en lata'])
    expect(hallado.savora).toEqual(['Mostaza'])
    expect(hallado.paty).toContain('Hamburguesa de carne (medallón crudo)')
    expect(hallado.yerba[0]).toBe('Yerba mate')
  })

  await test.step('Open Food Facts por el buscador nuevo', async () => {
    // categoría sola y pregunta por el vínculo
    await pg.fill('input[placeholder="Buscar alimento..."]', 'tirabuzon matarazzo')
    await pg.click('button:has-text("en Open Food Facts")')
    await pg.waitForSelector('text=Tirabuzón N°28 (Matarazzo)')
    expect(pedidos, 'con el buscador nuevo andando alcanza con un pedido').toEqual([['nuevo', 'tirabuzon matarazzo']])
    await pg.click('button:has-text("Tirabuzón N°28 (Matarazzo)")')
    await pg.waitForSelector('[role=alertdialog]')
    expect(await pg.locator('[role=alertdialog] h2').innerText()).toBe('¿Cuenta como Fideos secos en las recetas?')
    await pg.click('[role=alertdialog] button:has-text("Sí")')
    await pg.waitForSelector('text=¿Cuánto tenés?')
    await pg.locator('div.fixed input[inputmode]').first().fill('500')
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForSelector('p:has-text("cuenta como Fideos secos")')
    // la tarjeta nueva
    await tarjeta('Tirabuzón N°28 (Matarazzo)').locator('p.text-xs').innerText()
    const creado = (await api('GET', 'foods?select=*')).filter((f) => f.name === 'Tirabuzón N°28 (Matarazzo)')[0]
    expect(creado.category, JSON.stringify(creado)).toBe('Pastas y arroz')
    expect(creado.same_as, JSON.stringify(creado)).toBe(base.fideos.id)
  })

  await test.step('Open Food Facts flojo: la app sigue buscando sola', async () => {
    // fallan las dos primeras vueltas y la app sigue sola, sin apretar "Reintentar"
    pedidos.length = 0
    fallar.n = 2
    await pg.click('button:has-text("Agregar") >> nth=0')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'yerba playadito')
    await pg.click('button:has-text("en Open Food Facts")')
    await pg.waitForSelector('text=Sigue buscando', { timeout: 8000 })
    await captura(pg, 'f01_sigue_buscando', false)
    await pg.waitForSelector('text=Yerba mate suave (Playadito)', { timeout: 20000 })
    expect(await pg.locator('button:has-text("Reintentar")').count()).toBe(0)
    expect(pedidos.map((p) => p[0]).slice(0, 4)).toEqual(['nuevo', 'viejo', 'nuevo', 'viejo'])
    // la misma búsqueda otra vez no consulta de nuevo
    const n = pedidos.length
    await pg.fill('input[placeholder="Buscar alimento..."]', 'yerba playadit')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'yerba playadito')
    await pg.click('button:has-text("en Open Food Facts")')
    await pg.waitForSelector('text=Yerba mate suave (Playadito)')
    expect(pedidos.length).toBe(n)
    await pg.click('button[aria-label="Cerrar"]')
  })

  await test.step('un producto ya cargado en "Otros"', async () => {
    // la app lo reconoce, y la categoría se cambia desde la despensa
    await propio('Spaghetti', { qty: 2500 })
    const rara = await propio('Cosa rara', { qty: 100 })
    await abrirDespensa()
    expect(await tarjeta('Spaghetti').innerText()).toContain('¿Cuenta como Fideos secos en las recetas?')
    await captura(pg, 'f02_spaghetti', false)
    await tarjeta('Spaghetti').locator('button:text-is("Sí")').click()
    await pg.waitForSelector('text=Las recetas ya lo usan como fideos secos')
    await pg.waitForTimeout(300)
    expect(await tarjeta('Spaghetti').locator('p.text-xs').innerText()).toBe('Pastas y arroz · cuenta como Fideos secos')
    expect(await tarjeta('Cosa rara').locator('text=¿Cuenta como').count()).toBe(0)
    await tarjeta('Cosa rara').locator('button.px-1').click()
    await pg.waitForSelector('#dp-categoria')
    await captura(pg, 'f03_hoja', false)
    const opciones = await pg.locator('#dp-categoria option').allInnerTexts()
    expect(await pg.inputValue('#dp-categoria')).toBe('Otros')
    expect(opciones).toContain('Pastas y arroz')
    expect(opciones).not.toContain('Carbohidratos')
    await pg.selectOption('#dp-categoria', 'Snacks y dulces')
    await pg.waitForTimeout(400)
    await pg.click('div.fixed button:has-text("Guardar")')
    await pg.waitForTimeout(300)
    expect(await tarjeta('Cosa rara').locator('p.text-xs').innerText()).toBe('Snacks y dulces')
    expect((await api('GET', 'foods?select=*')).filter((f) => f.id === rara.id)[0].category).toBe('Snacks y dulces')
    const chips = await pg.locator('div.sin-scroll button').allInnerTexts()
    expect(chips).toContain('Snacks y dulces')
    expect(chips).toContain('Pastas y arroz')
  })

  await test.step('familias: con leche entera alcanza para una receta que pide leche', async () => {
    await poner(base.leche.id, 0)
    await poner(base['leche-entera'].id, 1000)
    await poner(base.avena.id, 500)
    await poner(base.banana.id, 3)
    await abrirDespensa()
    // leche entera
    await tarjeta('Leche entera').locator('p.text-xs').innerText()
    expect(await tarjeta('Leche entera').innerText()).toContain('cuenta como Leche parcialmente descremada')
    expect(await tarjeta('Leche entera').locator('#dp-vale').count()).toBe(0)
    const avena = (await api('GET', 'recipes?select=*')).filter((r) => r.slug === 'desayuno-avena')[0]
    await pg.goto(APP + '/recetas/' + avena.id)
    await pg.waitForSelector('text=Ingredientes')
    const fila = pg
      .locator('section.tarjeta div.flex.items-center.gap-3', { has: pg.locator('span.flex-1:text-is("Leche parcialmente descremada")') })
      .first()
    expect(await fila.innerText()).toContain('tenés 1 L')
    expect(await fila.innerText()).toContain('con Leche entera')
    expect(await fila.innerHTML()).toContain('text-verde-medio')
    // calorías con leche entera
    await pg.locator('main p:has-text("Valores por porción")').locator('xpath=preceding-sibling::*[1]').innerText()
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    await pg.click('button:has-text("Listo, cociné")')
    await pg.waitForSelector('text=lista')
    let st = Object.fromEntries((await api('GET', 'stock?select=*')).map((s) => [s.food_id, Number(s.qty)]))
    expect(st[base['leche-entera'].id]).toBe(750)
    expect(st[base.leche.id]).toBe(0)
    // si de la leche que pide la receta hay, se gasta esa primero
    await poner(base.leche.id, 2000)
    await pg.reload()
    await pg.waitForSelector('text=Ingredientes')
    expect(await pg.locator('main').innerText()).not.toContain('con Leche entera')
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    await pg.click('button:has-text("Listo, cociné")')
    await pg.waitForSelector('text=lista')
    st = Object.fromEntries((await api('GET', 'stock?select=*')).map((s) => [s.food_id, Number(s.qty)]))
    expect(st[base['leche-entera'].id], JSON.stringify(st)).toBe(750)
    expect(st[base.leche.id], JSON.stringify(st)).toBe(1750)
  })

  await test.step('recetas nuevas', async () => {
    await pg.goto(APP + '/recetas')
    await pg.waitForSelector('text=para cocinar')
    await pg.waitForTimeout(300)
    const total = await pg.locator('p.text-xs.text-gris.text-center').last().innerText()
    expect(Number(total.trim().split(/\s+/)[0])).toBeGreaterThanOrEqual(86)
    await pg.fill('input[placeholder="Buscar receta..."]', 'jardinera')
    await pg.waitForTimeout(300)
    const nJar = await pg.locator('a.tarjeta').count()
    expect(nJar).toBeGreaterThanOrEqual(5)
    await pg.fill('input[placeholder="Buscar receta..."]', 'arroz con leche')
    await pg.waitForTimeout(300)
    await pg.locator('a.tarjeta').first().click()
    await pg.waitForSelector('text=Ingredientes')
    await captura(pg, 'f04_receta')
    // calorías del arroz con leche
    await pg.locator('main p:has-text("Valores por porción")').locator('xpath=preceding-sibling::*[1]').innerText()
    // el plan sigue armándose con las recetas nuevas
    await pg.goto(APP + '/plan')
    await pg.waitForSelector('text=Esta semana')
  })

  await test.step('vista en iPhone oscuro', async () => {
    const ctx2 = await contexto(browser, { sesion: true, ...IPHONE })
    const pg2 = await ctx2.newPage()
    await pg2.goto(APP + '/despensa')
    await pg2.waitForSelector('text=Lista de compras')
    const t2 = pg2.locator('div.tarjeta', { has: pg2.locator('p.font-semibold:text-is("Cosa rara")') })
    await t2.scrollIntoViewIfNeeded()
    await t2.locator('button.px-1').click()
    await pg2.waitForSelector('#dp-categoria')
    await captura(pg2, 'f05_hoja_oscuro', false)
    await ctx2.close()
  })

  await ctx.close()
  sinErrores(errores, ['Failed to load resource', 'ERR_FAILED', '503'])
})

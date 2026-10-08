// Cargar la despensa, cocinar una receta, las comidas fuera de casa, armar el plan, las compras y registrar en el diario. Usa la sesión de la prueba anterior y la deja para las que siguen.
import { expect, test } from '@playwright/test'
import { API, APP, captura, contexto, escuchar, guardarSesion, sinErrores } from './apoyo.js'

const STOCK = {
  'pata-muslo': 8,
  papa: 2000,
  batata: 1000,
  aceite: 500,
  arroz: 1000,
  fideos: 1000,
  'atun-natural': 5,
  huevo: 24,
  'pure-tomate': 1040,
  'queso-rallado': 150,
  'milanesa-pollo': 6,
  lechuga: 300,
  tomate: 5,
  'pan-integral': 20,
  'queso-cremoso': 400,
  banana: 6,
  leche: 2000,
  'mani-cascara': 500,
  arvejas: 300,
  choclo: 300,
  avena: 500,
}

test('despensa, recetas, plan, compras y diario', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  const errores = escuchar(pg, [], { dialogos: true })
  await pg.goto(APP + '/')
  await pg.waitForSelector('text=¡Hola, Santi!')

  await test.step('despensa: uno por la interfaz', async () => {
    await pg.click('nav >> text=Despensa')
    await pg.waitForSelector('text=Tu despensa está vacía')
    await captura(pg, 's10_despensa_vacia')
    await pg.click('button:has-text("Agregar alimento")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'yogur')
    await pg.waitForTimeout(200)
    await captura(pg, 's11_selector', false)
    await pg.click('button:has-text("Yogur natural")')
    await pg.fill('input[placeholder="Ej.: 1000"]', '1000')
    await pg.click('button:has-text("Guardar")')
    await pg.waitForSelector('text=1 kg')
  })

  await test.step('despensa: el resto por REST', async () => {
    await pg.evaluate(
      async ([api, stock]) => {
        const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
        const ses = JSON.parse(localStorage.getItem(k))
        const h = { Authorization: 'Bearer ' + ses.access_token, 'Content-Type': 'application/json', apikey: 'test' }
        const foods = await (await fetch(api + '/rest/v1/foods?select=*', { headers: h })).json()
        const rows = Object.entries(stock).map(([slug, qty]) => ({
          user_id: ses.user.id,
          food_id: foods.find((f) => f.slug === slug).id,
          qty,
        }))
        const r = await fetch(api + '/rest/v1/stock', { method: 'POST', headers: h, body: JSON.stringify(rows) })
        return r.status
      },
      [API, STOCK],
    )
    await pg.reload()
    await pg.waitForSelector('input[placeholder="Buscar..."]')
    await captura(pg, 's12_despensa')
    // + / -
    await pg.click('button[aria-label="Sumar Huevo"]')
    await pg.waitForSelector('text=25 unidades')
  })

  await test.step('recetas', async () => {
    await pg.click('nav >> text=Recetas')
    await pg.waitForSelector('text=para cocinar')
    await captura(pg, 's20_recetas')
    await pg.click('text=Pata muslo al horno con papa y batata')
    await pg.waitForSelector('text=Ingredientes')
    await captura(pg, 's21_receta')
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    await captura(pg, 's22_cocinar', false)
    await pg.click('button:has-text("Listo, cociné")')
    await pg.waitForSelector('text=porciones cocinadas')
    await captura(pg, 's23_receta_cocinada')
  })

  await test.step('perfil: reglas fuera de casa (mié y jue cena)', async () => {
    await pg.click('a[aria-label="Perfil"]')
    await pg.waitForSelector('text=Comidas fuera de casa')
    await pg.click('button[aria-label="Cena Mi"]')
    await pg.click('button[aria-label="Cena Ju"]')
    await pg.click('button[aria-label="Almuerzo Do"]')
    await pg.click('button:has-text("Anotar")')
    await pg.fill('input[placeholder="79.4"]', '79.2')
    await pg.click('button:has-text("Guardar")')
    await pg.waitForTimeout(400)
    await captura(pg, 's30_perfil')
  })

  await test.step('plan', async () => {
    await pg.goto(APP + '/plan')
    await pg.waitForSelector('text=Esta semana')
    await captura(pg, 's40_plan_vacio')
    await pg.click('button:has-text("Armar con lo que tengo")')
    await pg.waitForSelector('text=Semana completa')
    await captura(pg, 's41_plan')
    await pg.click('button[aria-label="Semana siguiente"]')
    await pg.click('button:has-text("Armar con lo que tengo")')
    await pg.waitForSelector('text=Semana completa')
    await captura(pg, 's42_plan_sig')
    await pg.locator('button:has-text("ALMUERZO")').first().click()
    await pg.waitForTimeout(300)
    await captura(pg, 's43_elegir', false)
    await pg.click('button[aria-label="Cerrar"]')
  })

  await test.step('compras', async () => {
    await pg.goto(APP + '/compras')
    await pg.waitForSelector('text=Para comprar')
    await captura(pg, 's50_compras')
    if (await pg.locator('button:has-text("Comprado")').count()) {
      await pg.locator('button:has-text("Comprado")').first().click()
      await pg.fill('#cp-precio', '3200')
      await pg.click('button:has-text("Confirmar compra")')
      await pg.waitForSelector('text=Compras del mes')
      await pg.waitForSelector('text=$3.200')
      await captura(pg, 's51_compras2')
    }
    expect(await pg.locator('text=Gastaste').count()).toBe(1)
  })

  await test.step('diario', async () => {
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await captura(pg, 's60_diario_plan')
    await pg.locator('button:has-text("Comí esto")').first().click()
    await pg.waitForTimeout(500)
    // registrar otra cosa en el almuerzo
    await pg.locator('button:has-text("Otra cosa")').first().click()
    await pg.waitForSelector('text=Tu plato')
    if (await pg.locator('button:has-text("Lomito")').count()) await pg.click('button:has-text("Lomito")')
    await pg.click('button:has-text("Alimento")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'lomito')
    await pg.click('button:has-text("Lomito completo")')
    await pg.click('button:has-text("Alimento")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'gaseosa')
    await pg.click('button:has-text("Gaseosa común")')
    await captura(pg, 's61_registrar')
    await pg.locator('button:has-text("Agregar al")').click()
    await pg.waitForSelector('text=¡Hola, Santi!')
    await captura(pg, 's62_diario_arriba')
  })

  await guardarSesion(ctx)
  await ctx.close()
  sinErrores(errores)
})

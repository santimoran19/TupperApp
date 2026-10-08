// Operaciones en un solo paso (si se corta la conexión no queda nada a medias ni cuenta dos veces), dos teléfonos con la
// misma cuenta, pantalla de error en vez de pantalla en blanco y registro de errores. Usa la sesión de las pruebas anteriores.
import fs from 'node:fs'
import { expect, test } from '@playwright/test'
import { adelantarReloj, API, APP, captura, contexto, escuchar, franja, rest, sinErrores, volvioLaConexion } from './apoyo.js'

test('cortes de conexión, dos teléfonos, pantalla de error y registro de errores', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  const errores = escuchar(pg)
  // Todo lo que la app le manda a la base para cambiar algo (los pedidos que no son de lectura)
  const cambios = []
  pg.on('request', (r) => {
    if (r.url().includes('/rest/v1/') && r.method() !== 'GET')
      cambios.push(r.method() + ' ' + new URL(r.url()).pathname.replace('/rest/v1/', ''))
  })
  const sinConexion = (ruta) => pg.route(ruta, (r) => r.abort('internetdisconnected'))
  const eventos = (nombre) => rest(pg, 'eventos', '&nombre=eq.' + nombre)

  await pg.goto(APP + '/recetas')
  await pg.waitForSelector('text=para cocinar')
  const huevo = (await rest(pg, 'foods', '&slug=eq.huevo'))[0]
  const huevos = async (pagina = pg) => Number((await rest(pagina, 'stock', '&food_id=eq.' + huevo.id))[0].qty)

  await test.step('cocinar con la conexión cortada: queda guardado en el teléfono y después entra todo junto, una sola vez', async () => {
    // La primera receta que se puede cocinar con lo que hay
    await pg.locator('a.tarjeta:has-text("Tenés todo")').first().click()
    await pg.waitForSelector('text=Ingredientes')
    const stockAntes = await rest(pg, 'stock')
    const listaAntes = await rest(pg, 'prepared')
    const porciones = (lista) => lista.reduce((n, p) => n + Number(p.portions), 0)
    // Lo que se le manda a la base cada vez que se intenta cocinar
    const pedidos = []
    pg.on('request', (r) => {
      if (r.url().endsWith('/rest/v1/rpc/cocinar')) pedidos.push(r.postDataJSON())
    })

    await sinConexion('**/rest/v1/rpc/cocinar')
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    await pg.click('button:has-text("Listo, cociné")')
    // No se pierde ni se queda trabado: se guarda en el teléfono y lo dice
    await pg.waitForSelector('text=/porci(ón|ones) lista/')
    await expect(franja(pg)).toContainText('Sin conexión · 1 cambio por enviar')
    await captura(pg, 'g01_sin_conexion', false)
    // En la base todavía no entró nada (ni a medias)
    expect(await rest(pg, 'stock')).toEqual(stockAntes)
    expect(await rest(pg, 'prepared')).toEqual(listaAntes)
    // Vuelve la conexión: se manda solo, en un único pedido que lleva todo, y la franja se va
    await pg.unroute('**/rest/v1/rpc/cocinar')
    await volvioLaConexion(pg)
    expect(await rest(pg, 'stock')).not.toEqual(stockAntes)
    expect(porciones(await rest(pg, 'prepared'))).toBe(porciones(listaAntes) + 1)
    // Todos los intentos fueron el mismo pedido, con la misma clave: por más que se repita, la base lo aplica una vez
    expect(pedidos.length).toBeGreaterThanOrEqual(2)
    expect(new Set(pedidos.map((p) => p.p_clave)).size).toBe(1)
    expect(pedidos[0].p_clave).toMatch(/^[0-9a-f-]{36}$/)

    // Con la conexión lenta la gente toca dos veces: tiene que contar una sola (si no, descuenta el doble)
    const lento = (ruta) =>
      pg.route(ruta, async (r) => {
        await new Promise((listo) => setTimeout(listo, 700))
        await r.continue()
      })
    const listas = porciones(await rest(pg, 'prepared'))
    await pg.waitForTimeout(2700)
    await lento('**/rest/v1/rpc/cocinar')
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    pedidos.length = 0
    await pg.locator('button:has-text("Listo, cociné")').dblclick()
    await pg.waitForSelector('text=/porci(ón|ones) lista/')
    await pg.waitForTimeout(900)
    expect(pedidos.length).toBe(1)
    expect(porciones(await rest(pg, 'prepared'))).toBe(listas + 1)
    await pg.unroute('**/rest/v1/rpc/cocinar')

    // El peor corte: la base llegó a guardar, pero la respuesta nunca volvió. La app no sabe si entró: lo deja en la
    // cola y lo manda de nuevo con la misma clave. No puede descontar por segunda vez.
    await pg.waitForTimeout(2700)
    await pg.route('**/rest/v1/rpc/cocinar', async (r) => {
      await r.fetch()
      await r.abort('connectionreset')
    })
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    pedidos.length = 0
    await pg.click('button:has-text("Listo, cociné")')
    await pg.waitForSelector('text=/porci(ón|ones) lista/')
    await expect(franja(pg)).toContainText('1 cambio por enviar')
    expect(porciones(await rest(pg, 'prepared')), 'se guardó aunque la app no se enteró').toBe(listas + 2)
    const guardado = await rest(pg, 'stock')
    await pg.unroute('**/rest/v1/rpc/cocinar')
    await volvioLaConexion(pg)
    expect(pedidos.length).toBeGreaterThanOrEqual(2)
    expect(new Set(pedidos.map((p) => p.p_clave)).size).toBe(1)
    expect(porciones(await rest(pg, 'prepared'))).toBe(listas + 2)
    expect(await rest(pg, 'stock')).toEqual(guardado)
  })

  await test.step('registrar una comida con la conexión cortada: un solo pedido, que entra cuando vuelve', async () => {
    await pg.goto(APP + '/registrar?comida=cena')
    await pg.waitForSelector('text=Tu plato')
    await pg.click('button:has-text("Alimento")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'huevo')
    await pg.locator('div.divide-y button:has-text("Huevo")').first().click()
    const antes = await huevos()
    const registrosAntes = (await rest(pg, 'log_entries')).length
    await sinConexion('**/rest/v1/rpc/registrar_comida')
    cambios.length = 0
    await pg.click('button:has-text("Agregar a la cena")')
    // Queda anotado en el diario aunque no haya llegado a la base
    await pg.waitForSelector('text=¡Hola, Santi!')
    await expect(franja(pg)).toContainText('1 cambio por enviar')
    const enPantalla = await pg.locator('button[aria-label="Borrar Huevo"]').count()
    expect(enPantalla).toBeGreaterThan(0)
    expect(await huevos()).toBe(antes)
    expect((await rest(pg, 'log_entries')).length).toBe(registrosAntes)
    await pg.unroute('**/rest/v1/rpc/registrar_comida')
    await volvioLaConexion(pg)
    // Un solo pedido por intento: antes eran varios (registro y stock por separado) y el corte podía caer en el medio
    expect(new Set(cambios)).toEqual(new Set(['POST rpc/registrar_comida']))
    expect(await huevos()).toBeLessThan(antes)
    expect((await rest(pg, 'log_entries')).length).toBe(registrosAntes + 1)
    // En pantalla queda una sola vez (la que estaba anotada en el teléfono pasa a ser la de la base)
    await expect(pg.locator('button[aria-label="Borrar Huevo"]')).toHaveCount(enPantalla)
  })

  await test.step('una compra que la base rechaza: mensaje entendible y el error queda anotado', async () => {
    await pg.goto(APP + '/compras')
    await pg.waitForSelector('text=Para comprar')
    await pg.click('button:has-text("Anotar")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'lentejas')
    await pg.locator('div.divide-y > button').first().click()
    await pg.waitForTimeout(300)
    const comprasAntes = (await rest(pg, 'purchases')).length
    await pg.route('**/rest/v1/rpc/comprar', (r) =>
      r.fulfill({
        status: 400,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          code: '23514',
          message: 'new row for relation "purchases" violates check constraint "purchases_qty_chk"',
          details: null,
          hint: null,
        }),
      }),
    )
    await pg.locator('button:has-text("Comprado")').first().click()
    await pg.fill('#cp-precio', '1500')
    await pg.click('button:has-text("Confirmar compra")')
    await pg.waitForSelector('text=Hay un dato fuera de rango. Revisá las cantidades.')
    // Lo rechazó la base: no es un problema de conexión, así que no queda en la cola
    await expect(franja(pg)).toHaveCount(0)
    await expect.poll(async () => (await eventos('accion')).length).toBeGreaterThan(0)
    const [anotado] = await eventos('accion')
    expect(anotado).toMatchObject({ tipo: 'error', ruta: '/compras', detalle: { accion: 'comprar', codigo: '23514' } })
    expect(anotado.version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(anotado.dispositivo).toContain('Mozilla')
    expect((await rest(pg, 'purchases')).length).toBe(comprasAntes)
    // Con todo en orden, la compra entra: gasto, stock y lista en un solo pedido. Y con doble toque, una sola vez.
    await pg.unroute('**/rest/v1/rpc/comprar')
    cambios.length = 0
    await pg.waitForTimeout(2700)
    await pg.route('**/rest/v1/rpc/comprar', async (r) => {
      await new Promise((listo) => setTimeout(listo, 700))
      await r.continue()
    })
    await pg.locator('button:has-text("Confirmar compra")').dblclick()
    await pg.waitForSelector('text=$1.500')
    await pg.waitForTimeout(900)
    expect(cambios).toEqual(['POST rpc/comprar'])
    expect((await rest(pg, 'purchases')).length).toBe(comprasAntes + 1)
    await pg.unroute('**/rest/v1/rpc/comprar')
    // Los cortes de conexión de antes no se anotaron como errores: no son fallas de la app
    expect((await eventos('accion')).length).toBe(1)
  })

  await test.step('dos teléfonos con la misma cuenta: los cambios se suman y aparecen solos al volver', async () => {
    const ctx2 = await contexto(browser, { sesion: true })
    const otro = await ctx2.newPage()
    const tarjeta = (pagina) => pagina.locator('div.tarjeta', { has: pagina.locator('button[aria-label="Sumar Huevo"]') })
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('button[aria-label="Sumar Huevo"]')
    await otro.goto(APP + '/despensa')
    await otro.waitForSelector('button[aria-label="Sumar Huevo"]')
    const n = await huevos()
    await expect(tarjeta(pg)).toContainText(`${n} unidades`)
    // El otro teléfono suma uno. Este todavía muestra la cantidad vieja y también suma uno: tienen que quedar los dos.
    await otro.click('button[aria-label="Sumar Huevo"]')
    await expect(tarjeta(otro)).toContainText(`${n + 1} unidades`)
    await expect(tarjeta(pg)).toContainText(`${n} unidades`)
    await pg.click('button[aria-label="Sumar Huevo"]')
    await expect(tarjeta(pg)).toContainText(`${n + 2} unidades`)
    expect(await huevos()).toBe(n + 2)
    // Dos toques rápidos seguidos: cuentan los dos
    await pg.click('button[aria-label="Sumar Huevo"]')
    await pg.click('button[aria-label="Sumar Huevo"]')
    await expect(tarjeta(pg)).toContainText(`${n + 4} unidades`)
    expect(await huevos()).toBe(n + 4)
    // Lo mismo si la respuesta del primer toque llega después que la del segundo: la pantalla no puede quedar atrasada
    let toques = 0
    await pg.route('**/rest/v1/rpc/mover_stock', async (r) => {
      const primero = ++toques === 1
      const respuesta = await r.fetch()
      if (primero) await new Promise((listo) => setTimeout(listo, 800))
      await r.fulfill({ response: respuesta })
    })
    await pg.click('button[aria-label="Restar Huevo"]')
    await pg.click('button[aria-label="Restar Huevo"]')
    await pg.waitForTimeout(1500)
    expect(toques).toBe(2)
    expect(await huevos()).toBe(n + 2)
    await expect(tarjeta(pg)).toContainText(`${n + 2} unidades`)
    await pg.unroute('**/rest/v1/rpc/mover_stock')
    await pg.click('button[aria-label="Sumar Huevo"]')
    await pg.click('button[aria-label="Sumar Huevo"]')
    await expect(tarjeta(pg)).toContainText(`${n + 4} unidades`)
    // El otro saca tres. Acá, volver a la app enseguida no trae nada (no se pide todo cada vez)...
    for (let i = 0; i < 3; i++) await otro.click('button[aria-label="Restar Huevo"]')
    await expect(tarjeta(otro)).toContainText(`${n + 1} unidades`)
    await pg.evaluate(() => {
      window.dispatchEvent(new Event('focus'))
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await pg.waitForTimeout(700)
    await expect(tarjeta(pg)).toContainText(`${n + 4} unidades`)
    // ...pero al volver un rato después aparece lo del otro teléfono, sin recargar ni mostrar "Cargando"
    await adelantarReloj(ctx, 5)
    await pg.evaluate(() => {
      window.cargandoVisto = false
      new MutationObserver(() => {
        if (document.body.innerText.includes('Cargando...')) window.cargandoVisto = true
      }).observe(document.body, { childList: true, subtree: true })
    })
    await pg.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
    await expect(tarjeta(pg)).toContainText(`${n + 1} unidades`)
    expect(await pg.evaluate(() => window.cargandoVisto)).toBe(false)
    await captura(pg, 'g02_dos_telefonos', false)
    await adelantarReloj(ctx, 0)
    await ctx2.close()
  })

  await test.step('si una pantalla se rompe, hay mensaje y salida (no pantalla en blanco), y queda anotado', async () => {
    // Página aparte: acá los errores en la consola son a propósito
    const rota = await ctx.newPage()
    const antes = (await eventos('pantalla')).length
    // La base devuelve recetas sin nombre: la pantalla de recetas no sabe qué hacer con eso
    await rota.route('**/rest/v1/recipes*', async (r) => {
      const respuesta = await r.fetch()
      await r.fulfill({ response: respuesta, json: (await respuesta.json()).map((x) => ({ ...x, name: null })) })
    })
    await rota.goto(APP + '/recetas')
    await rota.waitForSelector('text=Algo salió mal')
    await rota.waitForSelector('text=Lo que ya habías guardado sigue estando.')
    await captura(rota, 'g03_algo_salio_mal', false)
    expect(await rota.locator('a:has-text("Ir al inicio")').getAttribute('href')).toBe('/')
    await expect.poll(async () => (await eventos('pantalla')).length).toBe(antes + 1)
    const anotado = (await eventos('pantalla')).at(-1)
    expect(anotado).toMatchObject({ tipo: 'error', ruta: '/recetas' })
    expect(anotado.detalle.mensaje).toBeTruthy()
    expect(anotado.detalle.componentes).toContain('Recetas')
    // Arreglado el problema, "Recargar" vuelve a la pantalla
    await rota.unroute('**/rest/v1/recipes*')
    await rota.click('button:has-text("Recargar")')
    await rota.waitForSelector('text=para cocinar')

    // Una pantalla que no se puede bajar (pasa al publicar una versión nueva con la app abierta):
    // la app recarga sola una vez y, si sigue sin poder, lo dice.
    let pedidos = 0
    await rota.route('**/src/pages/Plan.jsx*', (r) => {
      pedidos++
      return r.abort()
    })
    await rota.click('nav >> text=Plan')
    await rota.waitForSelector('text=No se pudo abrir esta pantalla')
    expect(pedidos).toBeGreaterThanOrEqual(2)
    await captura(rota, 'g04_pantalla_vieja', false)
    await rota.unroute('**/src/pages/Plan.jsx*')
    await rota.click('button:has-text("Recargar")')
    await rota.waitForSelector('text=Esta semana')
    await rota.close()
  })

  await test.step('el registro no guarda lo que se busca, se puede descargar y el perfil muestra la versión', async () => {
    // Las búsquedas en Open Food Facts de las pruebas anteriores quedaron anotadas: cómo salieron, no qué se buscó
    const busquedas = await eventos('off_busqueda')
    expect(busquedas.length).toBeGreaterThan(0)
    for (const b of busquedas) {
      expect(
        Object.keys(b.detalle)
          .sort()
          .filter((k) => k !== 'fuente' && k !== 'motivo'),
      ).toEqual(['ms', 'resultado', 'vueltas'])
      expect(['ok', 'vacio', 'error']).toContain(b.detalle.resultado)
    }
    const todo = JSON.stringify(await rest(pg, 'eventos')).toLowerCase()
    for (const palabra of ['tirabuz', 'yerba', 'lenteja', 'huevo', 'santi']) expect(todo).not.toContain(palabra)
    // Nadie puede modificar ni borrar el registro
    const estado = await pg.evaluate(async (api) => {
      const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
      const h = { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem(k)).access_token, apikey: 'test' }
      return (await fetch(api + '/rest/v1/eventos?id=gt.0', { method: 'DELETE', headers: h })).status
    }, API)
    expect(estado).toBe(403)

    await pg.goto(APP + '/perfil')
    await pg.waitForSelector('text=Comidas fuera de casa')
    await expect(pg.locator('text=/^Tupper \\d+\\.\\d+\\.\\d+$/')).toBeVisible()
    const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('text=Descargar mis datos')])
    const datos = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'))
    expect(datos.registro_tecnico.length).toBe((await rest(pg, 'eventos')).length)
    expect(datos.registro_tecnico[0]).toHaveProperty('que')
  })

  await ctx.close()
  sinErrores(errores)
})

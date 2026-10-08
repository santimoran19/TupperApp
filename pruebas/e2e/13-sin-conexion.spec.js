// Sin conexión: la app abre con lo último que tenía guardado en el teléfono, deja cargar lo de todos los días y lo manda
// solo cuando vuelve la conexión, una sola vez. Usa la sesión de las pruebas anteriores y es la última: termina cerrando sesión.
import { expect, test } from '@playwright/test'
import {
  adelantarReloj,
  APP,
  captura,
  contexto,
  cortarConexion,
  escuchar,
  franja,
  restPorFuera,
  sinErrores,
  volvioLaConexion,
} from './apoyo.js'

test('sin conexión: abre con los datos guardados, deja cargar y manda todo al volver', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  const errores = escuchar(pg)

  await pg.goto(APP + '/')
  await pg.waitForSelector('text=¡Hola, Santi!')
  // La copia del teléfono se guarda un momento después de cargar
  await pg.waitForTimeout(1500)

  // La base de verdad se lee por fuera del navegador (que va a estar sin conexión) y con el permiso de ahora (después se cierra la sesión)
  const leer = await restPorFuera(pg)
  const huevo = (await leer('foods', '&slug=eq.huevo'))[0]
  const agua = (await leer('foods', '&slug=eq.agua'))[0]
  const enLaBase = async () => {
    const [registros, stock, listas, compras, lista, reglas] = await Promise.all(
      ['log_entries', 'stock', 'prepared', 'purchases', 'shopping_items', 'away_rules'].map((t) => leer(t)),
    )
    return {
      registros: registros.length,
      agua: registros.filter((r) => r.food_id === agua.id).length,
      noComi: registros.filter((r) => r.skipped).length,
      huevos: Number(stock.find((s) => s.food_id === huevo.id)?.qty || 0),
      porciones: listas.reduce((n, p) => n + Number(p.portions), 0),
      compras: compras.length,
      lista: lista.length,
      reglas: reglas.length,
    }
  }
  const antes = await enLaBase()
  const tarjetaHuevo = pg.locator('div.tarjeta', { has: pg.locator('button[aria-label="Sumar Huevo"]') })
  let pendientes = 0
  let salteada = 0 // si se pudo marcar un "no comí" (depende de cómo dejaron el día las pruebas anteriores)
  let cocinadas = 0 // las porciones que se cocinaron sin conexión
  const porEnviar = () =>
    expect(franja(pg)).toContainText(`Sin conexión · ${pendientes === 1 ? '1 cambio' : pendientes + ' cambios'} por enviar`)

  let conectar = await cortarConexion(ctx)

  await test.step('abre sin conexión, con lo último que tenía', async () => {
    await pg.reload()
    await pg.waitForSelector('text=¡Hola, Santi!')
    await expect(franja(pg)).toContainText('Sin conexión · lo que cargues se envía cuando vuelva')
    await captura(pg, 'h01_sin_conexion', false)
    // Las demás pantallas también tienen sus datos
    await pg.click('nav >> text=Despensa')
    await expect(tarjetaHuevo).toContainText(`${antes.huevos} unidades`)
    await pg.click('nav >> text=Recetas')
    await pg.waitForSelector('text=para cocinar')
    await pg.click('nav >> text=Plan')
    await pg.waitForSelector('text=Esta semana')
  })

  await test.step('lo de todos los días se puede cargar igual y queda anotado como pendiente', async () => {
    // Dos vasos de agua (dos toques a propósito: son dos)
    await pg.click('nav >> text=Diario')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await pg.click('button:has-text("Vaso de agua")')
    await pg.waitForFunction(() => document.body.innerText.includes('Un vaso de agua anotado'))
    await pg.click('button:has-text("Vaso de agua")')
    pendientes += 2
    await porEnviar()
    // "No comí", si queda alguna comida de hoy sin resolver
    const noComi = pg.locator('button[aria-label^="No comí"]')
    if (await noComi.count()) {
      await noComi.first().click()
      pendientes += 1
      salteada = 1
      await pg.waitForSelector('button:has-text("Deshacer")')
      await porEnviar()
    }
    // La despensa: dos de más y uno de menos
    await pg.click('nav >> text=Despensa')
    await pg.click('button[aria-label="Sumar Huevo"]')
    await pg.click('button[aria-label="Sumar Huevo"]')
    await pg.click('button[aria-label="Restar Huevo"]')
    pendientes += 3
    await expect(tarjetaHuevo).toContainText(`${antes.huevos + 1} unidades`)
    await porEnviar()
  })

  await test.step('si la app se cierra y se abre de nuevo sin conexión, lo pendiente sigue ahí', async () => {
    // Un cambio más y se cierra enseguida, antes de que se llegue a guardar la copia con ese cambio: igual tiene que estar al abrir
    await pg.waitForTimeout(1200)
    await pg.click('button[aria-label="Sumar Huevo"]')
    pendientes += 1
    await pg.waitForTimeout(100)
    await pg.reload()
    await expect(tarjetaHuevo).toContainText(`${antes.huevos + 2} unidades`)
    await porEnviar()
    // Y con el permiso de la sesión vencido (dura una hora): sin conexión no se puede renovar, pero la app abre igual
    await pg.evaluate(() => {
      const clave = Object.keys(localStorage).find((x) => x.includes('auth-token'))
      const sesion = JSON.parse(localStorage.getItem(clave))
      localStorage.setItem(clave, JSON.stringify({ ...sesion, expires_at: Math.floor(Date.now() / 1000) - 600 }))
    })
    await pg.reload()
    await expect(tarjetaHuevo).toContainText(`${antes.huevos + 2} unidades`)
    await porEnviar()
  })

  await test.step('cocinar y comprar sin conexión', async () => {
    await pg.click('nav >> text=Recetas')
    await pg.waitForSelector('text=para cocinar')
    await pg.locator('a.tarjeta:has-text("Tenés todo")').first().click()
    await pg.waitForSelector('text=Ingredientes')
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    // La hoja propone las porciones que rinde la receta
    cocinadas = Number(await pg.locator('label:has-text("¿Cuántas porciones") + input').inputValue())
    expect(cocinadas).toBeGreaterThan(0)
    await pg.click('button:has-text("Listo, cociné")')
    await pg.waitForSelector('text=/porci(ón|ones) lista/')
    pendientes += 1
    await porEnviar()

    await pg.goto(APP + '/compras')
    await pg.waitForSelector('text=Para comprar')
    await pg.click('button:has-text("Anotar")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'garbanzos')
    await pg.locator('div.divide-y > button').first().click()
    pendientes += 1
    await porEnviar()
    const fila = pg.locator('div.flex.items-center.py-3', { has: pg.locator('button[aria-label^="Quitar Garbanzos"]') })
    await fila.locator('button:has-text("Comprado")').click()
    await pg.fill('#cp-precio', '2345')
    await pg.click('button:has-text("Confirmar compra")')
    await pg.waitForSelector('text=$2.345')
    pendientes += 1
    await porEnviar()
    // Lo comprado sale de la lista, como siempre
    await expect(pg.locator('button[aria-label^="Quitar Garbanzos"]')).toHaveCount(0)
    await captura(pg, 'h02_compras_sin_conexion', false)
  })

  await test.step('lo que es de configuración pide conexión, y lo dice', async () => {
    await pg.goto(APP + '/perfil')
    await pg.waitForSelector('text=Comidas fuera de casa')
    await pg.click('button[aria-label="Merienda Lu"]')
    await pg.waitForSelector('text=No hay conexión. Revisá internet y probá de nuevo.')
    await porEnviar()
  })

  await test.step('mientras tanto, en la base no entró nada', async () => {
    expect(await enLaBase()).toEqual(antes)
  })

  await test.step('vuelve la conexión: se manda todo solo, una sola vez, y la pantalla queda igual', async () => {
    await conectar()
    // El intento de renovar el permiso que falló recién no se repite enseguida: pasa un rato
    await adelantarReloj(ctx, 3)
    await volvioLaConexion(pg)
    const despues = await enLaBase()
    // La lista de compras queda igual: lo que se anotó se compró
    expect(despues).toEqual({
      registros: antes.registros + 2 + salteada,
      agua: antes.agua + 2,
      noComi: antes.noComi + salteada,
      huevos: antes.huevos + 2,
      porciones: antes.porciones + cocinadas,
      compras: antes.compras + 1,
      lista: antes.lista,
      reglas: antes.reglas,
    })
    // Al volver a la app más tarde no se manda nada de nuevo
    await adelantarReloj(ctx, 10)
    await pg.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
    await pg.waitForTimeout(1500)
    expect(await enLaBase()).toEqual(despues)
    await pg.goto(APP + '/despensa')
    await expect(tarjetaHuevo).toContainText(`${antes.huevos + 2} unidades`)
    await expect(franja(pg)).toHaveCount(0)
    await adelantarReloj(ctx, 0)
  })

  await test.step('si el servidor anda mal, el cambio no se tira: queda esperando y entra más tarde', async () => {
    const base = await enLaBase()
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await pg.route('**/rest/v1/rpc/registrar_comida', (r) =>
      r.fulfill({
        status: 503,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'no anda' }),
      }),
    )
    await pg.click('button:has-text("Vaso de agua")')
    await pg.waitForFunction(() => document.body.innerText.includes('Un vaso de agua anotado'))
    await expect(franja(pg)).toContainText('Todavía no se pudo enviar 1 cambio · se sigue probando')
    await captura(pg, 'h03_servidor_caido', false)
    // Mientras la base lo rechace, la app no trae nada nuevo (pisaría lo que falta mandar): al recargar no hay que esperarlo
    ctx.sinEsperarDatos = true
    expect(await enLaBase()).toEqual(base)
    // Si además no hay foto guardada en el teléfono (se borra cuando la sesión se vence), la app abre igual: trae lo de
    // la base y le pone encima lo que falta mandar. No se queda en "Cargando..." esperando a que el servidor se arregle.
    await pg.waitForTimeout(600)
    await pg.evaluate(
      () =>
        new Promise((listo) => {
          const pedido = indexedDB.open('tupper')
          pedido.onsuccess = () => {
            const t = pedido.result.transaction('copia', 'readwrite')
            const almacen = t.objectStore('copia')
            const claves = almacen.getAllKeys()
            claves.onsuccess = () => {
              for (const clave of claves.result) if (String(clave).startsWith('foto:')) almacen.delete(clave)
            }
            t.oncomplete = () => listo()
          }
        }),
    )
    await pg.reload()
    await pg.waitForSelector('text=¡Hola, Santi!')
    await expect(franja(pg)).toContainText('Todavía no se pudo enviar 1 cambio · se sigue probando')
    expect(await enLaBase()).toEqual(base)
    // Se cierra la app y se abre más tarde, con el servidor ya andando: entra solo, una vez
    await pg.unroute('**/rest/v1/rpc/registrar_comida')
    ctx.sinEsperarDatos = false
    await pg.reload()
    await pg.waitForSelector('text=¡Hola, Santi!')
    await expect(franja(pg)).toHaveCount(0, { timeout: 20000 })
    expect(await enLaBase()).toEqual({ ...base, registros: base.registros + 1, agua: base.agua + 1 })
  })

  await test.step('el + de la despensa con la respuesta perdida: no se manda de nuevo (contaría doble)', async () => {
    await pg.goto(APP + '/despensa')
    const n = (await enLaBase()).huevos
    await expect(tarjetaHuevo).toContainText(`${n} unidades`)
    // La base llega a guardar, pero la respuesta nunca vuelve
    await pg.route('**/rest/v1/rpc/mover_stock', async (r) => {
      await r.fetch()
      await r.abort('connectionreset')
    })
    await pg.click('button[aria-label="Sumar Huevo"]')
    await pg.waitForSelector('text=No hay conexión. Revisá internet y probá de nuevo.')
    expect((await enLaBase()).huevos).toBe(n + 1)
    await pg.unroute('**/rest/v1/rpc/mover_stock')
    // Al volver la conexión no se manda nada: se trae lo que quedó en la base y la pantalla lo muestra
    await volvioLaConexion(pg)
    await expect(tarjetaHuevo).toContainText(`${n + 1} unidades`)
    expect((await enLaBase()).huevos).toBe(n + 1)
  })

  await test.step('dos pestañas abiertas sin conexión: al volver, cada cambio entra una sola vez', async () => {
    const base = await enLaBase()
    conectar = await cortarConexion(ctx)
    const otra = await ctx.newPage()
    escuchar(otra, errores)
    for (const p of [pg, otra]) {
      await p.goto(APP + '/')
      await p.waitForSelector('text=¡Hola, Santi!')
    }
    await pg.click('button:has-text("Vaso de agua")')
    await expect(franja(pg)).toContainText('1 cambio por enviar')
    await otra.click('button:has-text("Vaso de agua")')
    await expect(franja(otra)).toContainText('1 cambio por enviar')
    await pg.click('button:has-text("Vaso de agua")')
    await expect(franja(pg)).toContainText('2 cambios por enviar')
    await conectar()
    await Promise.all([pg, otra].map((p) => p.evaluate(() => window.dispatchEvent(new Event('online')))))
    // Los manda una sola de las dos; la otra se da cuenta sola de que ya no queda nada
    for (const p of [pg, otra]) await expect(franja(p)).toHaveCount(0, { timeout: 40000 })
    expect(await enLaBase()).toEqual({ ...base, registros: base.registros + 3, agua: base.agua + 3 })
    await otra.close()
  })

  await test.step('cerrar sesión con cambios sin enviar: avisa antes, y no deja nada en el teléfono', async () => {
    const base = await enLaBase()
    conectar = await cortarConexion(ctx)
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await pg.click('button:has-text("Vaso de agua")')
    await expect(franja(pg)).toContainText('1 cambio por enviar')
    await pg.click('a[aria-label="Perfil"]')
    await pg.click('button:has-text("Cerrar sesión")')
    await pg.waitForSelector('text=Hay un cambio sin enviar')
    await captura(pg, 'h04_cerrar_sesion', false)
    await pg.click('button:has-text("Volver")')
    await pg.waitForSelector('text=Comidas fuera de casa')
    await pg.locator('button:has-text("Cerrar sesión")').first().click()
    await pg.waitForSelector('text=Hay un cambio sin enviar')
    await pg.locator('[role="alertdialog"] button:has-text("Cerrar sesión")').click()
    await pg.waitForSelector('text=Crear cuenta')
    const guardado = await pg.evaluate(
      () =>
        new Promise((listo) => {
          const pedido = indexedDB.open('tupper')
          pedido.onsuccess = () => {
            const claves = pedido.result.transaction('copia').objectStore('copia').getAllKeys()
            claves.onsuccess = () => listo(claves.result)
          }
        }),
    )
    expect(guardado, 'la copia y la cola se borran del teléfono').toEqual([])
    await conectar()
    // El vaso de agua que no se llegó a mandar se perdió, como decía el aviso; lo demás sigue en la base
    await pg.waitForTimeout(1000)
    expect(await enLaBase()).toEqual(base)
  })

  await ctx.close()
  sinErrores(errores)
})

// Aviso de versión nueva. No depende de las otras pruebas: compila la app dos veces (dos "versiones"), la sirve como en
// Vercel (mismos encabezados de seguridad) y cambia una por la otra con la app abierta, como cuando se publica.
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { chromium, expect, test } from '@playwright/test'
import { build } from 'vite'

const PUERTO = 5300
const SITIO = `http://localhost:${PUERTO}`
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

let carpeta // dónde quedan las dos compilaciones
let publicada // la que está "en el servidor" en este momento
let servidor

async function compilar(nombre, version) {
  const outDir = path.join(carpeta, nombre)
  await build({ logLevel: 'error', define: { __APP_VERSION__: JSON.stringify(version) }, build: { outDir, emptyOutDir: true } })
  return outDir
}

test.beforeAll(async () => {
  test.setTimeout(240000)
  // La app compilada habla con el Supabase simulado, igual que en las otras pruebas
  process.env.VITE_SUPABASE_URL = 'http://localhost:54321'
  process.env.VITE_SUPABASE_KEY = 'test'
  carpeta = fs.mkdtempSync(path.join(os.tmpdir(), 'tupper-versiones-'))
  const [a, b] = [await compilar('a', '9.9.1'), await compilar('b', '9.9.2')]
  publicada = a
  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
  servidor = http.createServer((req, res) => {
    const ruta = new URL(req.url, SITIO).pathname
    if (ruta === '/_publicar') {
      publicada = req.url.includes('v=a') ? a : b
      return res.end('ok')
    }
    // El contador de visitas de Vercel solo existe en Vercel
    if (ruta.startsWith('/_vercel/')) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' })
      return res.end('')
    }
    const encabezados = {}
    for (const regla of vercel.headers)
      if (new RegExp('^' + regla.source + '$').test(ruta)) for (const h of regla.headers) encabezados[h.key] = h.value
    encabezados['Content-Security-Policy'] = encabezados['Content-Security-Policy'].replace(
      "connect-src 'self'",
      "connect-src 'self' http://localhost:54321",
    )
    let archivo = path.join(publicada, ruta)
    if (!archivo.startsWith(publicada) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory())
      archivo = path.join(publicada, 'index.html') // la regla de "rewrites"
    res.writeHead(200, { ...encabezados, 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' })
    res.end(fs.readFileSync(archivo))
  })
  await new Promise((listo) => servidor.listen(PUERTO, listo))
})

test.afterAll(async () => {
  await new Promise((listo) => (servidor ? servidor.close(listo) : listo()))
  if (carpeta) fs.rmSync(carpeta, { recursive: true, force: true })
})

// Un navegador sin nada guardado, con los atajos para saber qué versión está cargada y para buscar una nueva
async function abrir(browser) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 900 }, locale: 'es-AR' })
  ctx.setDefaultTimeout(30000)
  // Por las dudas: nada de esto tiene que llegar nunca al proyecto real
  await ctx.route(/\.supabase\.co\//, (ruta) => ruta.abort())
  const pg = await ctx.newPage()
  const errores = []
  pg.on('console', (m) => {
    if (m.type() === 'error') errores.push(m.text())
  })
  pg.on('pageerror', (e) => errores.push(String(e)))
  return {
    ctx,
    pg,
    errores,
    // El archivo principal de la app cambia de nombre con cada versión: sirve para saber cuál está cargada
    versionCargada: () =>
      pg.evaluate(() => [...document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src')).find((s) => s.includes('index-'))),
    buscarVersion: () =>
      pg.evaluate(async () => {
        await (await navigator.serviceWorker.getRegistration()).update()
      }),
    aviso: pg.locator('text=Hay una versión nueva'),
  }
}

test('cuando se publica una versión nueva, la app avisa y no se actualiza sola', async ({ browser }) => {
  const { ctx, pg, errores, versionCargada, buscarVersion, aviso } = await abrir(browser)

  await pg.goto(SITIO + '/')
  await pg.waitForSelector('text=Crear cuenta')
  await pg.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await pg.waitForTimeout(1500)
  const primera = await versionCargada()
  expect(await aviso.count(), 'sin versión nueva no hay aviso').toBe(0)
  await pg.reload()
  await pg.waitForSelector('text=Crear cuenta')
  await pg.waitForTimeout(800)
  expect(await aviso.count()).toBe(0)

  // Se publica la versión nueva mientras la persona está escribiendo
  await pg.fill('#email', 'a-medio-escribir@test.com')
  await fetch(SITIO + '/_publicar')
  await buscarVersion()
  await aviso.waitFor()
  expect(await versionCargada(), 'no tiene que cambiar sola').toBe(primera)
  expect(await pg.inputValue('#email'), 'no tiene que recargar sola: se pierde lo que se estaba escribiendo').toBe(
    'a-medio-escribir@test.com',
  )

  // "Después": el aviso se va y todo sigue igual; al volver a abrir la app, avisa de nuevo
  await pg.click('button[aria-label="Después"]')
  await pg.waitForTimeout(300)
  expect(await aviso.count()).toBe(0)
  await pg.reload()
  await aviso.waitFor()
  expect(await versionCargada()).toBe(primera)

  // "Actualizar": recarga con la versión nueva y ya no hay nada que avisar
  await Promise.all([pg.waitForEvent('load'), pg.click('button:has-text("Actualizar")')])
  await pg.waitForSelector('text=Crear cuenta')
  await pg.waitForTimeout(800)
  expect(await versionCargada()).not.toBe(primera)
  expect(await aviso.count()).toBe(0)

  await ctx.close()
  expect(errores).toEqual([])
})

// La primera vez que se abre la app en una pestaña, la copia guardada todavía no la maneja. Si justo ahí se publica
// una versión, "Actualizar" no recibe el aviso de siempre para recargar: igual tiene que terminar en la versión nueva.
test('una pestaña recién abierta también llega a la versión nueva (el botón no queda esperando)', async ({ browser }) => {
  await fetch(SITIO + '/_publicar?v=a')
  const { ctx, pg, errores, versionCargada, buscarVersion, aviso } = await abrir(browser)
  await pg.goto(SITIO + '/')
  await pg.waitForSelector('text=Crear cuenta')
  await pg.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await pg.waitForTimeout(1500)
  expect(await pg.evaluate(() => !!navigator.serviceWorker.controller), 'en la primera visita la copia guardada no maneja la pestaña').toBe(
    false,
  )
  const primera = await versionCargada()

  await fetch(SITIO + '/_publicar')
  await buscarVersion()
  const avisa = await aviso.waitFor({ timeout: 5000 }).then(
    () => true,
    () => false,
  )
  if (avisa) {
    await pg.click('button:has-text("Actualizar")')
    await expect.poll(() => versionCargada().catch(() => primera), { timeout: 10000 }).not.toBe(primera)
  } else {
    // Sin aviso (la versión nueva se activó sola porque no había ninguna pestaña a cargo): al volver a abrir ya es la nueva
    await pg.reload()
    await pg.waitForSelector('text=Crear cuenta')
    expect(await versionCargada()).not.toBe(primera)
  }
  await pg.waitForSelector('text=Crear cuenta')
  await pg.waitForTimeout(800)
  expect(await aviso.count()).toBe(0)

  await ctx.close()
  expect(errores).toEqual([])
})

// Recordatorios con la app cerrada (1.29, F-06): el service worker muestra la notificación push solo si la app no está
// a la vista (si está, el aviso lo muestra ella adentro y no se repite). El push se entrega con el protocolo de Chrome.
// (Con el Chromium completo: el "headless shell" de Playwright no da permiso de notificaciones)
test('las notificaciones push se muestran con la app cerrada, no con la app a la vista', async () => {
  const navegador = await chromium.launch({ channel: 'chromium' })
  const { ctx, pg, errores } = await abrir(navegador)
  await ctx.grantPermissions(['notifications'], { origin: SITIO })
  await pg.goto(SITIO + '/')
  await pg.waitForSelector('text=Crear cuenta')
  await pg.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  const cdp = await ctx.newCDPSession(pg)
  const registros = []
  cdp.on('ServiceWorker.workerRegistrationUpdated', (e) => registros.push(...e.registrations))
  await cdp.send('ServiceWorker.enable')
  await expect.poll(() => registros.filter((r) => !r.isDeleted).length).toBeGreaterThan(0)
  const { registrationId } = registros.find((r) => !r.isDeleted)
  const mandar = () =>
    cdp.send('ServiceWorker.deliverPushMessage', {
      origin: SITIO,
      registrationId,
      data: JSON.stringify({ titulo: 'Es hora de almorzar', texto: 'Anotala cuando termines.', tag: 'comida-almuerzo', ruta: '/' }),
    })
  const notificaciones = () =>
    pg.evaluate(async () =>
      (await (await navigator.serviceWorker.getRegistration()).getNotifications()).map((n) => [n.title, n.body, n.tag]),
    )

  await mandar()
  await pg.waitForTimeout(800)
  expect(await notificaciones(), 'con la app a la vista no hay notificación del sistema').toEqual([])

  // "Cerrada": la pestaña se va a otro lado
  await pg.goto('about:blank')
  await mandar()
  await pg.waitForTimeout(800)
  await pg.goto(SITIO + '/')
  await pg.waitForSelector('text=Crear cuenta')
  expect(await notificaciones()).toEqual([['Es hora de almorzar', 'Anotala cuando termines.', 'comida-almuerzo']])

  await ctx.close()
  await navegador.close()
  expect(errores).toEqual([])
})

// T-07b (1.32): con la app cerrada del todo, al volver la conexión el service worker manda la cola él solo, con el permiso
// que dejó la app; se frena en el + y el - de la despensa (no se pueden repetir sin contar doble) y no hace nada con el
// permiso vencido. "Cerrada": no hay ninguna pestaña de la app (la única está en about:blank).
test('con la app cerrada, el service worker manda la cola al volver la conexión', async () => {
  const API = 'http://localhost:54321'
  const SERVICIO = { Authorization: 'Bearer service-role-de-prueba', apikey: 'test' }
  // Una cuenta en el simulador, con su permiso
  const email = `sw-${Date.now()}@test.com`
  const alta = await (
    await fetch(API + '/auth/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: 'test' },
      body: JSON.stringify({ email, password: 'Secreto9q', gotrue_meta_security: { captcha_token: `captcha-de-prueba-sw-${Date.now()}` } }),
    })
  ).json()
  const uid = alta.user.id
  const [arroz, yerba] = await (
    await fetch(API + '/rest/v1/foods?select=id,slug&owner=is.null&slug=in.(arroz,yerba)&order=slug', {
      headers: { Authorization: 'Bearer ' + alta.access_token, apikey: 'test' },
    })
  ).json()
  const lista = async () =>
    (await (await fetch(`${API}/rest/v1/shopping_items?select=food_id,qty&user_id=eq.${uid}`, { headers: SERVICIO })).json()).map((x) => [
      x.food_id,
      Number(x.qty),
    ])

  const navegador = await chromium.launch({ channel: 'chromium' })
  const { ctx, pg } = await abrir(navegador)
  await pg.goto(SITIO + '/')
  await pg.waitForSelector('text=Crear cuenta')
  await pg.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  const cdp = await ctx.newCDPSession(pg)
  const registros = []
  cdp.on('ServiceWorker.workerRegistrationUpdated', (e) => registros.push(...e.registrations))
  await cdp.send('ServiceWorker.enable')
  await expect.poll(() => registros.filter((r) => !r.isDeleted).length).toBeGreaterThan(0)
  const { registrationId } = registros.find((r) => !r.isDeleted)

  // Lo que deja la app cuando anota sin conexión (store/sincro/sesionSW.js y la cola de sincronizacion.js)
  const dejar = (cosas) =>
    pg.evaluate(
      (cosas) =>
        new Promise((listo, fallo) => {
          const pedido = indexedDB.open('tupper', 1)
          pedido.onupgradeneeded = () => pedido.result.createObjectStore('copia')
          pedido.onsuccess = () => {
            const t = pedido.result.transaction('copia', 'readwrite')
            for (const [clave, valor] of cosas) t.objectStore('copia').put(valor, clave)
            t.oncomplete = () => {
              pedido.result.close()
              listo()
            }
            t.onerror = () => fallo(t.error)
          }
        }),
      cosas,
    )
  const leer = (clave) =>
    pg.evaluate(
      (clave) =>
        new Promise((listo) => {
          const pedido = indexedDB.open('tupper', 1)
          pedido.onsuccess = () => {
            const g = pedido.result.transaction('copia').objectStore('copia').get(clave)
            g.onsuccess = () => {
              pedido.result.close()
              listo(g.result ?? null)
            }
          }
        }),
      clave,
    )
  const volvioLaConexion = async () => {
    await pg.goto('about:blank')
    await cdp.send('ServiceWorker.dispatchSyncEvent', { origin: SITIO, registrationId, tag: 'tupper-cola', lastChance: false })
    await pg.waitForTimeout(1500)
    await pg.goto(SITIO + '/')
    await pg.waitForSelector('text=Crear cuenta')
  }

  const vence = (alta.expires_at || Math.floor(Date.now() / 1000) + 3600) * 1000
  const cola = [
    { id: 'c1', tipo: 'agregarALista', datos: { food_id: arroz.id, qty: 2 }, n: 1 },
    { id: 'c2', tipo: 'ajustarStock', datos: { food_id: arroz.id, delta: 1 }, n: 2 },
    { id: 'c3', tipo: 'agregarALista', datos: { food_id: yerba.id, qty: 1 }, n: 3 },
  ]
  // Con el permiso vencido no manda nada
  await dejar([
    [`cola:${uid}`, cola],
    ['sw:sesion', { uid, token: alta.access_token, vence: Date.now() - 1000 }],
  ])
  await volvioLaConexion()
  expect(await lista()).toEqual([])
  expect((await leer(`cola:${uid}`)).map((c) => c.id)).toEqual(['c1', 'c2', 'c3'])

  // Con el permiso vigente manda en orden hasta el + de la despensa, que queda para la app (y el permiso, también)
  await dejar([['sw:sesion', { uid, token: alta.access_token, vence }]])
  await volvioLaConexion()
  expect(await lista()).toEqual([[arroz.id, 2]])
  expect((await leer(`cola:${uid}`)).map((c) => c.id)).toEqual(['c2', 'c3'])
  expect(await leer('sw:sesion')).toMatchObject({ uid })

  // Sin lo que la frenaba, termina y borra el permiso
  await dejar([[`cola:${uid}`, [cola[2]]]])
  await volvioLaConexion()
  expect((await lista()).sort()).toEqual(
    [
      [arroz.id, 2],
      [yerba.id, 1],
    ].sort(),
  )
  expect((await leer(`cola:${uid}`)) ?? []).toEqual([])
  expect(await leer('sw:sesion')).toBeNull()

  await ctx.close()
  await navegador.close()
})

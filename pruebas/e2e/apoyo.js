// Lo que comparten las pruebas de navegador: cómo abrir la app, la sesión guardada y los atajos para mirar la base simulada.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect } from '@playwright/test'

export const APP = 'http://localhost:5199'
export const API = 'http://localhost:54321'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
// La sesión que deja una prueba la usa la siguiente (los archivos corren en orden, uno atrás del otro)
export const SESION = path.join(AQUI, '.estado', 'sesion.json')
const CAPTURAS = path.join(AQUI, 'capturas')

// Las pruebas dependen del día de la semana (reglas de "como afuera", "mañana", etc.).
// Para que den lo mismo cualquier día, el navegador siempre cree que es el sábado 3/10/2026 a las 21:30.
const AHORA = '2026-10-03T21:30:00-03:00'

export const CELULAR = { viewport: { width: 412, height: 900 }, deviceScaleFactor: 1 }
export const IPHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: 'dark' }

// Abre un navegador "nuevo" (sin nada guardado) o con la sesión de la prueba anterior.
export async function contexto(browser, { sesion = false, ...opciones } = {}) {
  const ctx = await browser.newContext({
    ...CELULAR,
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Cordoba',
    ...(sesion ? { storageState: SESION } : {}),
    ...opciones,
  })
  ctx.setDefaultTimeout(30000)
  await ctx.clock.setFixedTime(new Date(AHORA))
  // Por las dudas: nada de esto tiene que llegar nunca al proyecto real
  await ctx.route(/\.supabase\.co\//, (ruta) => ruta.abort())
  // Al abrir, la app muestra un instante lo que tenía guardado en el teléfono y enseguida lo que trae la base. Para que
  // ninguna prueba lea lo viejo, abrir o recargar una página espera a que estén los datos de la base.
  const nueva = ctx.newPage.bind(ctx)
  ctx.newPage = async () => {
    const pg = await nueva()
    for (const nombre of ['goto', 'reload']) {
      const original = pg[nombre].bind(pg)
      pg[nombre] = async (...argumentos) => {
        const respuesta = await original(...argumentos)
        if (!ctx.sinEsperarDatos) await datosDeLaBase(pg)
        return respuesta
      }
    }
    return pg
  }
  return ctx
}

// Espera a que lo que muestra la app sea lo de la base (si hay sesión; en la pantalla de acceso no hay nada que esperar).
// Cuando la prueba sabe que eso no va a pasar (sin conexión, o con la base rechazando), pone `ctx.sinEsperarDatos = true`.
export const datosDeLaBase = (pg) =>
  pg.waitForFunction(() => {
    try {
      const haySesion = Object.keys(localStorage).some((clave) => clave.includes('auth-token'))
      return !haySesion || document.documentElement.dataset.datos === 'base'
    } catch {
      return true // una página que no es la app
    }
  })

// Adelanta el reloj del navegador (por ejemplo, para simular que se volvió a la app un rato después)
export async function adelantarReloj(ctx, minutos) {
  await ctx.clock.setFixedTime(new Date(Date.parse(AHORA) + minutos * 60 * 1000))
}

export async function guardarSesion(ctx) {
  fs.mkdirSync(path.dirname(SESION), { recursive: true })
  await ctx.storageState({ path: SESION })
}

// Junta los errores de la consola y de la página. Con `dialogos`, acepta los confirm() del navegador.
export function escuchar(pg, errores = [], { dialogos = false } = {}) {
  pg.on('console', (m) => {
    if (m.type() === 'error') errores.push(['console', m.text()])
  })
  pg.on('pageerror', (e) => errores.push(['pageerror', String(e)]))
  if (dialogos) pg.on('dialog', (d) => d.accept())
  return errores
}

// Al final de cada prueba: no tiene que haber quedado ningún error en la consola.
// Los pedidos que la prueba corta a propósito (Open Food Facts caído, etc.) dejan avisos de red que no cuentan.
export function sinErrores(errores, ignorar = ['Failed to load resource', 'ERR_FAILED']) {
  expect(errores.filter(([, texto]) => !ignorar.some((i) => texto.includes(i)))).toEqual([])
}

// Espera un momento a que termine la animación. Con CAPTURAS=1 además guarda la pantalla en pruebas/e2e/capturas.
export async function captura(pg, nombre, completa = true) {
  await pg.waitForTimeout(350)
  if (!process.env.CAPTURAS) return
  fs.mkdirSync(CAPTURAS, { recursive: true })
  await pg.screenshot({ path: path.join(CAPTURAS, nombre + '.png'), fullPage: completa })
}

// Lee una tabla de la base simulada con la sesión de la página. filtro: '&date=eq.2026-10-03&meal=eq.cena'
export function rest(pg, tabla, filtro = '') {
  return pg.evaluate(
    async ([api, tabla, filtro]) => {
      const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
      const ses = JSON.parse(localStorage.getItem(k))
      const h = { Authorization: 'Bearer ' + ses.access_token, apikey: 'test' }
      return await (await fetch(api + '/rest/v1/' + tabla + '?select=*' + filtro, { headers: h })).json()
    },
    [API, tabla, filtro],
  )
}

// Habla con el simulador por fuera del navegador (por ejemplo, para cambiar cómo responde la IA).
// Con `datos` es un POST; sin datos, un GET.
export async function simulador(ruta, datos) {
  const r = await fetch(
    API + ruta,
    datos === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) },
  )
  const texto = await r.text()
  return texto ? JSON.parse(texto) : null
}

// La fecha de "hoy" como la ve la app (AAAA-MM-DD)
export function hoyEnLaPagina(pg) {
  return pg.evaluate(() => {
    const d = new Date()
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  })
}

// El texto del último aviso flotante (el "toast" de abajo)
export const aviso = (pg) => pg.locator('div.fixed .rounded-full.shadow-flotante').last().innerText()

// ---------- Sin conexión ----------
// Corta todo lo que va a Supabase (la app sigue cargando, como cuando está instalada) hasta que se llame a lo que devuelve
export async function cortarConexion(ctx) {
  const corte = (ruta) => ruta.abort('internetdisconnected')
  await ctx.route(API + '/**', corte)
  ctx.sinEsperarDatos = true
  return async () => {
    await ctx.unroute(API + '/**', corte)
    ctx.sinEsperarDatos = false
  }
}

// La franja de arriba que avisa que no hay conexión o que quedan cambios por mandar
export const franja = (pg) => pg.locator('header [role="status"]')

// El teléfono se entera de que volvió la conexión, y se espera a que termine de mandar lo que tenía guardado
export async function volvioLaConexion(pg) {
  await pg.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(franja(pg)).toHaveCount(0, { timeout: 20000 })
}

// Para leer la base simulada por fuera del navegador (sirve con la conexión de la app cortada o con la sesión cerrada).
// Devuelve la función que lee: leer('stock', '&food_id=eq...')
export async function restPorFuera(pg) {
  const token = await pg.evaluate(
    () => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((x) => x.includes('auth-token')))).access_token,
  )
  return async (tabla, filtro = '') =>
    (
      await fetch(API + '/rest/v1/' + tabla + '?select=*' + filtro, { headers: { Authorization: 'Bearer ' + token, apikey: 'test' } })
    ).json()
}

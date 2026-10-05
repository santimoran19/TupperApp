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
    ...CELULAR, locale: 'es-AR', timezoneId: 'America/Argentina/Cordoba',
    ...(sesion ? { storageState: SESION } : {}), ...opciones,
  })
  ctx.setDefaultTimeout(30000)
  await ctx.clock.setFixedTime(new Date(AHORA))
  // Por las dudas: nada de esto tiene que llegar nunca al proyecto real
  await ctx.route(/\.supabase\.co\//, (ruta) => ruta.abort())
  return ctx
}

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
  pg.on('console', (m) => { if (m.type() === 'error') errores.push(['console', m.text()]) })
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
  return pg.evaluate(async ([api, tabla, filtro]) => {
    const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
    const ses = JSON.parse(localStorage.getItem(k))
    const h = { Authorization: 'Bearer ' + ses.access_token, apikey: 'test' }
    return await (await fetch(api + '/rest/v1/' + tabla + '?select=*' + filtro, { headers: h })).json()
  }, [API, tabla, filtro])
}

// Habla con el simulador por fuera del navegador (por ejemplo, para cambiar cómo responde la IA).
// Con `datos` es un POST; sin datos, un GET.
export async function simulador(ruta, datos) {
  const r = await fetch(API + ruta, datos === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })
  const texto = await r.text()
  return texto ? JSON.parse(texto) : null
}

// La fecha de "hoy" como la ve la app (AAAA-MM-DD)
export function hoyEnLaPagina(pg) {
  return pg.evaluate(() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') })
}

// El texto del último aviso flotante (el "toast" de abajo)
export const aviso = (pg) => pg.locator('div.fixed .rounded-full.shadow-flotante').last().innerText()

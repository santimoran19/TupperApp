// CORS de las funciones de Supabase (S-02), con las funciones de verdad corriendo en Deno: contestan a la página de la app y a
// ninguna otra. Se les pega directo (no por el simulador, que no les pasa el origen). Sin Deno se saltea.
import { expect, test } from '@playwright/test'
import { simulador } from './apoyo.js'

const FUNCIONES = { 'analizar-semana': 8000, entrar: 8001 }
const APP_PERMITIDA = 'http://localhost:5199'
const OTRA_PAGINA = 'https://otra-pagina.example'

for (const [nombre, puerto] of Object.entries(FUNCIONES)) {
  test(`${nombre}: solo contesta a la página de la app`, async ({ request }) => {
    const estado = await simulador('/_pruebas/estado')
    test.skip(!estado.funcion || !estado.entrar, 'sin Deno no corren las funciones')
    const url = `http://127.0.0.1:${puerto}/functions/v1/${nombre}`
    const pedido = { 'content-type': 'application/json' }

    // Consulta previa del navegador (OPTIONS): desde la app, con permiso a su nombre
    const previaApp = await request.fetch(url, {
      method: 'OPTIONS',
      headers: { Origin: APP_PERMITIDA, 'Access-Control-Request-Method': 'POST' },
    })
    expect(previaApp.status()).toBe(200)
    expect(previaApp.headers()['access-control-allow-origin']).toBe(APP_PERMITIDA)
    expect(previaApp.headers()['access-control-allow-methods']).toContain('POST')
    expect(previaApp.headers().vary).toContain('Origin')

    // Desde otra página: rechazada, sin permiso
    const previaOtra = await request.fetch(url, {
      method: 'OPTIONS',
      headers: { Origin: OTRA_PAGINA, 'Access-Control-Request-Method': 'POST' },
    })
    expect(previaOtra.status()).toBe(403)
    expect(previaOtra.headers()['access-control-allow-origin']).toBeUndefined()

    // El pedido de verdad: desde otra página no se procesa; desde la app sí (y lleva el permiso en la respuesta)
    const otra = await request.post(url, {
      headers: { ...pedido, Origin: OTRA_PAGINA },
      data: { usuario: 'ana', clave: 'x', semana: '2026-10-05' },
    })
    expect(otra.status()).toBe(403)
    expect(otra.headers()['access-control-allow-origin']).toBeUndefined()
    expect(((await otra.json()) || {}).codigo).toBe('origen')

    const app = await request.post(url, {
      headers: { ...pedido, Origin: APP_PERMITIDA },
      data: { usuario: 'ana', clave: 'x', semana: '2026-10-05' },
    })
    expect(app.status()).not.toBe(403)
    expect(app.headers()['access-control-allow-origin']).toBe(APP_PERMITIDA)

    // Sin Origin (curl, otro servidor): sigue como siempre
    const sinOrigen = await request.post(url, { headers: pedido, data: { usuario: 'ana', clave: 'x', semana: '2026-10-05' } })
    expect(sinOrigen.status()).not.toBe(403)
    expect(sinOrigen.headers()['access-control-allow-origin']).toBeUndefined()
  })
}

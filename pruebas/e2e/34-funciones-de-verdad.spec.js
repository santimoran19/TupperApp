// Una función nueva corriendo de verdad en Deno (T-10): `recordatorios-push` (manda a un "servicio de push" de mentira; la
// prueba descifra lo que llegó con la clave del "teléfono"). Sin Deno se saltea. Cuenta nueva. (Hasta la 1.31.1 también
// probaba `strava`, que se sacó en la 1.31.2.)
import crypto from 'node:crypto'
import ece from 'http_ece'
import { expect, test } from '@playwright/test'
import { API, contexto, crearCuenta, simulador } from './apoyo.js'

const SERVICIO = { Authorization: 'Bearer service-role-de-prueba', apikey: 'test', 'Content-Type': 'application/json' }
const porServicio = async (metodo, ruta, cuerpo) => {
  const r = await fetch(API + '/rest/v1/' + ruta, {
    method: metodo,
    headers: { ...SERVICIO, Prefer: 'return=representation' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  const t = await r.text()
  return t ? JSON.parse(t) : null
}
const uidDe = (pg) =>
  pg.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.includes('auth-token')))).user.id)

test('recordatorios-push: manda el aviso cifrado, no lo repite y borra los teléfonos que ya no están', async ({ browser }) => {
  const estado = await simulador('/_pruebas/estado')
  test.skip(!estado.push, 'sin Deno no corre la función `recordatorios-push`')
  // La función mira la hora de verdad (no la de mentira del navegador): la comida se pone 10 minutos antes de ahora
  const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Cordoba' }))
  test.skip(ahora.getHours() === 0 && ahora.getMinutes() < 15, 'cerca de medianoche')
  const antes = new Date(ahora.getTime() - 10 * 60000)
  const hora = `${String(antes.getHours()).padStart(2, '0')}:${String(antes.getMinutes()).padStart(2, '0')}`

  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  await crearCuenta(pg, { email: 'push-real@test.com', nombre: 'Pía', usuario: 'pia.push' })
  const uid = await uidDe(pg)
  await ctx.close()

  // Un "teléfono": su par de claves y el secreto, como los da el navegador al suscribirse
  const ecdh = crypto.createECDH('prime256v1')
  ecdh.generateKeys()
  const secreto = crypto.randomBytes(16)
  const llaves = { p256dh: ecdh.getPublicKey().toString('base64url'), auth: secreto.toString('base64url') }
  await porServicio('POST', 'push_suscripciones', [
    { user_id: uid, endpoint: `${API}/push/telefono-1`, ...llaves },
    { user_id: uid, endpoint: `${API}/push/vencida-1`, ...llaves },
  ])
  await porServicio('POST', 'recordatorios', [
    {
      user_id: uid,
      activo: true,
      zona: 'America/Argentina/Cordoba',
      config: { activo: true, comidas: { almuerzo: hora }, comidasOn: { almuerzo: true }, agua: false, ayuno: false },
    },
  ])
  const correr = (clave = estado.cron) =>
    fetch(API + '/functions/v1/recordatorios-push', {
      method: 'POST',
      headers: { 'x-cron-clave': clave, 'Content-Type': 'application/json' },
      body: '{}',
    })

  expect((await correr('otra-clave')).status).toBe(401)
  const r1 = await correr()
  expect(r1.status).toBe(200)
  expect(await r1.json()).toMatchObject({ usuarios: 1, enviados: 1 })
  const recibidos = (await simulador('/push/_recibidos')).filter((p) => p.endpoint.endsWith('telefono-1'))
  expect(recibidos).toHaveLength(1)
  const [p] = recibidos
  expect(p.cabeceras['content-encoding']).toBe('aes128gcm')
  expect(p.cabeceras.authorization).toMatch(new RegExp(`^vapid t=[\\w-]+\\.[\\w-]+\\.[\\w-]+, k=${estado.vapid}$`))
  const plano = ece.decrypt(Buffer.from(p.cuerpo, 'base64'), { version: 'aes128gcm', privateKey: ecdh, authSecret: secreto })
  expect(JSON.parse(plano.toString('utf8'))).toMatchObject({
    titulo: 'Es hora de almorzar',
    ruta: '/registrar?comida=almuerzo',
    tag: 'comida-almuerzo',
  })
  // El teléfono que ya no existe (410) se borró; el otro sigue
  expect((await porServicio('GET', `push_suscripciones?user_id=eq.${uid}&select=endpoint`)).map((x) => x.endpoint)).toEqual([
    `${API}/push/telefono-1`,
  ])
  // Otra corrida del reloj: el mismo aviso no se manda dos veces
  expect(await (await correr()).json()).toMatchObject({ usuarios: 1, enviados: 0 })
  expect((await simulador('/push/_recibidos')).filter((x) => x.endpoint.endsWith('telefono-1'))).toHaveLength(1)
})

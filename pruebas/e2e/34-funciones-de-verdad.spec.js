// Las funciones nuevas corriendo de verdad en Deno (T-10): `strava` (con un Strava de mentira dentro del simulador, que
// devuelve un permiso que vence enseguida para probar la renovación) y `recordatorios-push` (manda a un "servicio de push"
// de mentira; la prueba descifra lo que llegó con la clave del "teléfono"). Sin Deno se saltean. Cuentas nuevas.
import crypto from 'node:crypto'
import ece from 'http_ece'
import { expect, test } from '@playwright/test'
import { API, APP, contexto, crearCuenta, escuchar, rest, simulador, sinErrores } from './apoyo.js'

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

test('strava: conectar, renovar el permiso, traer, anotar y desconectar', async ({ browser }) => {
  const estado = await simulador('/_pruebas/estado')
  test.skip(!estado.strava, 'sin Deno no corre la función `strava`')
  const errores = []
  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  await crearCuenta(pg, { email: 'strava-real@test.com', nombre: 'Nico', usuario: 'nico.strava' })
  const uid = await uidDe(pg)
  await porServicio('PATCH', `profiles?id=eq.${uid}`, { gasto_activo: true, gasto_consentimiento: new Date().toISOString() })
  await simulador('/strava/_pruebas', {
    actividades: [
      {
        id: 7777,
        name: 'Fondo del sábado',
        sport_type: 'Run',
        start_date: new Date(Date.now() - 2 * 86400000).toISOString(),
        moving_time: 3000,
        elapsed_time: 3200,
        distance: 9800,
        total_elevation_gain: 64,
        average_heartrate: 148.4,
        map: { summary_polyline: 'no-tiene-que-llegar' },
        start_latlng: [-31.4, -64.18],
      },
    ],
  })

  await pg.goto(APP + '/ejercicio')
  await pg.getByTestId('abrir-importar').click()
  const conectar = pg.getByRole('link', { name: 'Conectar con Strava' })
  const estadoStrava = new URL(await conectar.getAttribute('href')).searchParams.get('state')
  await ctx.route('https://www.strava.com/**', (r) =>
    r.fulfill({
      status: 302,
      headers: { location: `${APP}/ejercicio?code=codigostravaok12345&scope=read,activity:read_all&state=${estadoStrava}` },
    }),
  )
  await conectar.click()
  await expect(pg.getByText('Conectado como Nico.')).toBeVisible()
  // El permiso quedó en el servidor: la app no lo puede leer
  const desdeLaApp = await pg.evaluate(
    async ([api]) => {
      const ses = JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.includes('auth-token'))))
      return (
        await fetch(api + '/rest/v1/strava_conexiones?select=*', {
          headers: { Authorization: 'Bearer ' + ses.access_token, apikey: 'test' },
        })
      ).status
    },
    [API],
  )
  expect(desdeLaApp).toBe(403)
  expect((await porServicio('GET', `strava_conexiones?user_id=eq.${uid}&select=*`))[0]).toMatchObject({
    atleta: 'Nico',
    refresh_token: 'renovar-strava',
  })

  // Traer: el permiso vence en 30 segundos, así que la función lo renueva antes de pedir
  await pg.getByRole('button', { name: 'Traer los últimos 30 días' }).click()
  const lista = pg.getByTestId('importar-lista')
  await expect(lista.getByText('Fondo del sábado')).toBeVisible()
  const pedidos = await simulador('/strava/_pruebas')
  expect(pedidos.map((p) => p.ruta + (p.grant_type ? ':' + p.grant_type : ''))).toEqual([
    'token:authorization_code',
    'token:refresh_token',
    'actividades',
  ])
  expect(pedidos.at(-1).auth).toBe('Bearer acceso-2')
  await lista.getByRole('button', { name: 'Anotar 1' }).click()
  await expect.poll(async () => (await rest(pg, 'workouts')).length).toBe(1)
  const [w] = await rest(pg, 'workouts')
  expect(w).toMatchObject({ name: 'Correr', duration_min: 50, avg_hr: 148 })
  expect(Number(w.distance_km)).toBe(9.8)
  expect(JSON.stringify(w)).not.toContain('no-tiene-que-llegar')

  // Desconectar: se avisa a Strava y se borra el permiso
  await pg.getByTestId('abrir-importar').click()
  await pg.getByRole('button', { name: 'Desconectar Strava' }).click()
  await pg.click('[role=alertdialog] button:has-text("Desconectar")')
  await expect(pg.getByRole('link', { name: 'Conectar con Strava' })).toBeVisible()
  expect((await simulador('/strava/_pruebas')).some((p) => p.ruta === 'deauthorize')).toBe(true)
  expect(await porServicio('GET', `strava_conexiones?user_id=eq.${uid}&select=*`)).toEqual([])
  await ctx.close()
  sinErrores(errores)
})

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

// Recordatorios con la app cerrada (1.29, F-06): el cifrado de las notificaciones push, la firma VAPID y qué avisos
// corresponden en cada momento. El cifrado se comprueba descifrando con http_ece (la librería que usa web-push).
import crypto from 'node:crypto'
import ece from 'http_ece'
import webpush from 'web-push'
import { describe, expect, it, vi } from 'vitest'
import { aB64url, cifrar, deB64url, firmaVapid, mandarPush } from '../../supabase/functions/recordatorios-push/webpush.ts'
import { avisosPara, claveCorrecta, horaLocal, limpiarConfig, zonaValida } from '../../supabase/functions/recordatorios-push/logica.ts'
import { RECORDATORIOS_INICIAL, recordatoriosAhora } from '../../src/lib/ayuno.js'

// Un "navegador": su par de claves y el secreto de la suscripción
function navegador() {
  const ecdh = crypto.createECDH('prime256v1')
  ecdh.generateKeys()
  const auth = crypto.randomBytes(16)
  return { ecdh, auth, sus: { endpoint: 'https://push.ejemplo.test/abc', p256dh: aB64url(ecdh.getPublicKey()), auth: aB64url(auth) } }
}

describe('cifrado (RFC 8291)', () => {
  it('lo que se cifra lo puede leer el navegador, y nadie más', async () => {
    const n = navegador()
    const mensaje = JSON.stringify({ titulo: 'Es hora de almorzar', texto: 'Anotala cuando termines. ñ ✓' })
    const cuerpo = await cifrar(n.sus, mensaje)
    const plano = ece.decrypt(Buffer.from(cuerpo), { version: 'aes128gcm', privateKey: n.ecdh, authSecret: n.auth })
    expect(plano.toString('utf8')).toBe(mensaje)
    // Otro navegador no puede
    const otro = navegador()
    expect(() => ece.decrypt(Buffer.from(cuerpo), { version: 'aes128gcm', privateKey: otro.ecdh, authSecret: n.auth })).toThrow()
  })

  it('cada envío lleva sal y clave nuevas', async () => {
    const n = navegador()
    const a = await cifrar(n.sus, 'hola')
    const b = await cifrar(n.sus, 'hola')
    expect(aB64url(a)).not.toBe(aB64url(b))
    expect(a.length).toBe(16 + 4 + 1 + 65 + 'hola'.length + 1 + 16)
  })

  it('rechaza una suscripción mal formada', async () => {
    await expect(cifrar({ p256dh: 'abc', auth: 'def' }, 'x')).rejects.toThrow()
  })

  it('base64url ida y vuelta', () => {
    const b = crypto.randomBytes(65)
    expect(Buffer.from(deB64url(aB64url(b))).equals(b)).toBe(true)
  })
})

describe('firma VAPID (RFC 8292)', () => {
  const claves = webpush.generateVAPIDKeys()
  const vapid = { publica: claves.publicKey, privada: claves.privateKey, sujeto: 'mailto:hola@tupper.app' }

  it('es un JWT ES256 válido para el servicio de push', async () => {
    const ahora = Date.UTC(2026, 9, 24, 12)
    const jwt = await firmaVapid('https://fcm.googleapis.com/fcm/send/xyz', vapid, ahora)
    const [h, p, f] = jwt.split('.')
    expect(JSON.parse(Buffer.from(h, 'base64url'))).toEqual({ typ: 'JWT', alg: 'ES256' })
    expect(JSON.parse(Buffer.from(p, 'base64url'))).toEqual({
      aud: 'https://fcm.googleapis.com',
      exp: ahora / 1000 + 12 * 3600,
      sub: 'mailto:hola@tupper.app',
    })
    const pub = deB64url(vapid.publica)
    const clave = crypto.createPublicKey({
      key: { kty: 'EC', crv: 'P-256', x: aB64url(pub.slice(1, 33)), y: aB64url(pub.slice(33)) },
      format: 'jwk',
    })
    const valida = crypto.verify('sha256', Buffer.from(`${h}.${p}`), { key: clave, dsaEncoding: 'ieee-p1363' }, Buffer.from(f, 'base64url'))
    expect(valida).toBe(true)
  })

  it('mandarPush arma el pedido como lo piden los servicios de push', async () => {
    const n = navegador()
    const fetch = vi.fn(async () => new Response(null, { status: 201 }))
    vi.stubGlobal('fetch', fetch)
    try {
      const r = await mandarPush(n.sus, { titulo: 'Hola' }, vapid, { ttl: 600, tema: 'comida-almuerzo' })
      expect(r).toEqual({ ok: true, estado: 201, vencida: false })
      const [url, pedido] = fetch.mock.calls[0]
      expect(url).toBe(n.sus.endpoint)
      expect(pedido.headers).toMatchObject({ 'Content-Encoding': 'aes128gcm', TTL: '600', Topic: 'comida-almuerzo' })
      expect(pedido.headers.Authorization).toMatch(new RegExp(`^vapid t=[\\w-]+\\.[\\w-]+\\.[\\w-]+, k=${vapid.publica}$`))
      const plano = ece.decrypt(Buffer.from(pedido.body), { version: 'aes128gcm', privateKey: n.ecdh, authSecret: n.auth })
      expect(JSON.parse(plano)).toEqual({ titulo: 'Hola' })
      // Un teléfono que ya no está (410) se marca para borrar
      fetch.mockResolvedValueOnce(new Response(null, { status: 410 }))
      expect(await mandarPush(n.sus, {}, vapid)).toEqual({ ok: false, estado: 410, vencida: true })
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

describe('qué avisos corresponden', () => {
  it('da lo mismo que la app abierta (comidas y agua)', () => {
    const ahora = new Date(2026, 9, 24, 0, 0)
    for (let i = 0; i < 400; i++) {
      const min = (i * 37) % 1440
      const config = {
        ...RECORDATORIOS_INICIAL,
        activo: true,
        agua: i % 2 === 0,
        aguaCada: 1 + (i % 3),
        comidasOn: { desayuno: i % 3 !== 0, almuerzo: true, merienda: i % 5 !== 0, cena: true },
      }
      const registradas = new Set(i % 4 === 0 ? ['almuerzo'] : [])
      const yaAvisados = new Set(i % 7 === 0 ? ['2026-10-24|comida-cena', '2026-10-24|agua-2'] : [])
      const fecha = '2026-10-24'
      const app = recordatoriosAhora({
        config,
        ahora: new Date(ahora.getTime() + min * 60000),
        fecha,
        registradas,
        yaAvisados,
        nombres: { desayuno: 'desayunar', almuerzo: 'almorzar', merienda: 'merendar', cena: 'cenar' },
      })
      const servidor = avisosPara({ config: limpiarConfig(config), min, fecha, registradas, yaAvisados })
      expect(servidor).toEqual(app)
    }
  })

  it('avisa del ayuno cumplido una sola vez y no si quedó olvidado', () => {
    const inicio = Date.UTC(2026, 9, 23, 22)
    const base = { config: { activo: true, ayuno: true }, min: 600, fecha: '2026-10-24' }
    const ayuno = { inicio, horas: 16 }
    expect(avisosPara({ ...base, ayuno, ahora: inicio + 15 * 3600000 })).toEqual([])
    const [a] = avisosPara({ ...base, ayuno, ahora: inicio + 16 * 3600000 + 60000 })
    expect(a).toMatchObject({ id: `ayuno-${inicio}`, titulo: '¡Cumpliste tu ayuno!' })
    expect(avisosPara({ ...base, ayuno, ahora: inicio + 16.5 * 3600000, yaAvisados: new Set([a.id]) })).toEqual([])
    expect(avisosPara({ ...base, ayuno, ahora: inicio + 23 * 3600000 })).toEqual([])
    expect(avisosPara({ ...base, config: { activo: true, ayuno: false }, ayuno, ahora: inicio + 16.1 * 3600000 })).toEqual([])
    expect(avisosPara({ ...base, config: { activo: false }, ayuno, ahora: inicio + 16.1 * 3600000 })).toEqual([])
  })

  it('la hora local respeta la zona de la persona', () => {
    expect(horaLocal(new Date('2026-10-24T03:30:00Z'), 'America/Argentina/Buenos_Aires')).toEqual({ fecha: '2026-10-24', min: 30 })
    expect(horaLocal(new Date('2026-10-24T02:30:00Z'), 'America/Argentina/Buenos_Aires')).toEqual({
      fecha: '2026-10-23',
      min: 23 * 60 + 30,
    })
    expect(horaLocal(new Date('2026-10-24T12:00:00Z'), 'Europe/Madrid')).toEqual({ fecha: '2026-10-24', min: 14 * 60 })
    expect(zonaValida('Marte/Olympus')).toBe('America/Argentina/Buenos_Aires')
    expect(zonaValida('')).toBe('America/Argentina/Buenos_Aires')
  })

  it('la configuración se limpia antes de usarla', () => {
    const c = limpiarConfig({ activo: 1, comidas: { almuerzo: '25:00', cena: '21:30', postre: '22:00' }, aguaCada: 9, raro: 'x' })
    expect(c.comidas).toEqual({ cena: '21:30' })
    expect(c.aguaCada).toBe(3)
    expect(c).not.toHaveProperty('raro')
    expect(limpiarConfig(null).activo).toBe(false)
  })

  it('la clave del reloj se compara entera', () => {
    expect(claveCorrecta('abc123', 'abc123')).toBe(true)
    expect(claveCorrecta('abc124', 'abc123')).toBe(false)
    expect(claveCorrecta('abc', 'abc123')).toBe(false)
    expect(claveCorrecta(null, 'abc')).toBe(false)
    expect(claveCorrecta('x', undefined)).toBe(false)
  })
})

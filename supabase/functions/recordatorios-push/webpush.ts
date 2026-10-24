// Notificaciones push (1.29, F-06) sin librerías: solo con WebCrypto, que tienen igual Deno, Node y los navegadores.
//   - El contenido va cifrado para ese teléfono (RFC 8291, "aes128gcm"): el servicio de push (Google, Apple, Mozilla)
//     lo lleva pero no lo puede leer.
//   - El pedido va firmado con la clave VAPID del sitio (RFC 8292): el servicio de push sabe que viene de Tupper.
// Las claves VAPID se generan una vez (ver LEEME.md) y se cargan como secretos de la función.

export type Suscripcion = { endpoint: string; p256dh: string; auth: string }
export type Vapid = { publica: string; privada: string; sujeto: string }

const texto = new TextEncoder()

export function aB64url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
export function deB64url(t: string): Uint8Array {
  const limpio = String(t || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const s = atob(limpio + '='.repeat((4 - (limpio.length % 4)) % 4))
  return Uint8Array.from(s, (c) => c.charCodeAt(0))
}
const unir = (...partes: Uint8Array[]) => {
  const salida = new Uint8Array(partes.reduce((t, p) => t + p.length, 0))
  let i = 0
  for (const p of partes) {
    salida.set(p, i)
    i += p.length
  }
  return salida
}

// HKDF (extraer + expandir) con SHA-256
async function hkdf(sal: Uint8Array, ikm: Uint8Array, info: Uint8Array, largo: number): Promise<Uint8Array> {
  const clave = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits'])
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: sal, info }, clave, largo * 8))
}

// Cifra `mensaje` para la suscripción (RFC 8291). Devuelve el cuerpo listo para mandar. `fijo` es solo para las pruebas.
export async function cifrar(
  sus: Pick<Suscripcion, 'p256dh' | 'auth'>,
  mensaje: string,
  fijo?: { sal: Uint8Array; par: CryptoKeyPair },
): Promise<Uint8Array> {
  const delTelefono = deB64url(sus.p256dh) // clave pública del navegador (65 bytes)
  const secreto = deB64url(sus.auth) // 16 bytes
  if (delTelefono.length !== 65 || secreto.length < 16) throw new Error('suscripción inválida')
  const par =
    fijo?.par || ((await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])) as CryptoKeyPair)
  const nuestra = new Uint8Array(await crypto.subtle.exportKey('raw', par.publicKey))
  const suya = await crypto.subtle.importKey('raw', delTelefono, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
  const compartido = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: suya }, par.privateKey, 256))
  const ikm = await hkdf(secreto, compartido, unir(texto.encode('WebPush: info\0'), delTelefono, nuestra), 32)
  const sal = fijo?.sal || crypto.getRandomValues(new Uint8Array(16))
  const cek = await hkdf(sal, ikm, texto.encode('Content-Encoding: aes128gcm\0'), 16)
  const nonce = await hkdf(sal, ikm, texto.encode('Content-Encoding: nonce\0'), 12)
  // Un solo registro: el mensaje y el byte 2 que marca "último registro"
  const plano = unir(texto.encode(mensaje), new Uint8Array([2]))
  const clave = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt'])
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, clave, plano))
  // Encabezado: sal (16) | tamaño de registro (4) | largo de la clave (1) | clave pública nuestra (65)
  const rs = new Uint8Array([0, 0, 0x10, 0]) // 4096
  return unir(sal, rs, new Uint8Array([nuestra.length]), nuestra, cifrado)
}

// La firma VAPID (un JWT ES256) para el servicio de push de `endpoint`
export async function firmaVapid(endpoint: string, vapid: Vapid, ahora = Date.now()): Promise<string> {
  const pub = deB64url(vapid.publica)
  if (pub.length !== 65) throw new Error('clave VAPID pública inválida')
  const jwk = { kty: 'EC', crv: 'P-256', d: vapid.privada, x: aB64url(pub.slice(1, 33)), y: aB64url(pub.slice(33, 65)), ext: true }
  const clave = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'])
  const json = (o: unknown) => aB64url(texto.encode(JSON.stringify(o)))
  const cuerpo = `${json({ typ: 'JWT', alg: 'ES256' })}.${json({
    aud: new URL(endpoint).origin,
    exp: Math.floor(ahora / 1000) + 12 * 3600,
    sub: vapid.sujeto,
  })}`
  // WebCrypto ya da la firma como r|s (64 bytes), que es lo que pide JWT
  const firma = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, clave, texto.encode(cuerpo)))
  return `${cuerpo}.${aB64url(firma)}`
}

// Manda una notificación. Devuelve { ok, estado, vencida } (vencida: el teléfono ya no la acepta y hay que borrarla).
export async function mandarPush(
  sus: Suscripcion,
  datos: unknown,
  vapid: Vapid,
  { ttl = 3600, urgencia = 'normal', tema = '' }: { ttl?: number; urgencia?: string; tema?: string } = {},
) {
  const cuerpo = await cifrar(sus, JSON.stringify(datos))
  const encabezados: Record<string, string> = {
    'Content-Encoding': 'aes128gcm',
    'Content-Type': 'application/octet-stream',
    TTL: String(ttl),
    Urgency: urgencia,
    Authorization: `vapid t=${await firmaVapid(sus.endpoint, vapid)}, k=${vapid.publica}`,
  }
  // Con el mismo "tema", una notificación que todavía no llegó se reemplaza por la nueva (hasta 32 letras b64url)
  if (tema) encabezados.Topic = tema.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32)
  const r = await fetch(sus.endpoint, { method: 'POST', headers: encabezados, body: cuerpo })
  await r.body?.cancel()
  return { ok: r.ok, estado: r.status, vencida: r.status === 404 || r.status === 410 }
}

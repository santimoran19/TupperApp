// Códigos de la verificación en dos pasos (TOTP, RFC 6238: 6 números cada 30 segundos, con SHA-1). Lo usan el Supabase
// simulado y las pruebas (para "leer" la app autenticadora).
import { createHmac } from 'node:crypto'

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
export const aBase32 = (bytes) => {
  let bits = ''
  for (const b of bytes) bits += b.toString(2).padStart(8, '0')
  return bits
    .match(/.{1,5}/g)
    .map((c) => BASE32[parseInt(c.padEnd(5, '0'), 2)])
    .join('')
}
export function codigoTotp(secreto, cuando = Date.now()) {
  let bits = ''
  for (const c of secreto) bits += BASE32.indexOf(c).toString(2).padStart(5, '0')
  const clave = Buffer.from(bits.match(/.{8}/g).map((b) => parseInt(b, 2)))
  const contador = Buffer.alloc(8)
  contador.writeBigUInt64BE(BigInt(Math.floor(cuando / 30000)))
  const h = createHmac('sha1', clave).update(contador).digest()
  const o = h[h.length - 1] & 15
  return String((h.readUInt32BE(o) & 0x7fffffff) % 1000000).padStart(6, '0')
}

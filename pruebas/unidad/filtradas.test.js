// Contraseñas filtradas: la huella que se calcula, cómo se lee la respuesta del servicio y qué pasa si no contesta.
import { afterEach, expect, test, vi } from 'vitest'
import { claveFiltrada, estaEnLista, huella } from '../../src/lib/filtradas.js'

afterEach(() => vi.unstubAllGlobals())

// La huella de "password", que es pública y conocida
const HUELLA = '5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8'
const RESPUESTA = `003D68EB55068C33ACE09247EE4C639306B:3\r\n${HUELLA.slice(5)}:52256179\r\n012C192B2F16F82EA0EB9EF18D9D539B0DD:2`

test('la huella es el SHA-1 del texto, en mayúsculas', async () => {
  expect(await huella('password')).toBe(HUELLA)
  expect(await huella('contraseña')).toMatch(/^[0-9A-F]{40}$/)
})

test('la respuesta del servicio se lee línea por línea', () => {
  expect(estaEnLista(HUELLA.slice(5), RESPUESTA)).toBe(true)
  expect(estaEnLista('F'.repeat(35), RESPUESTA)).toBe(false)
  expect(estaEnLista(HUELLA.slice(5), '')).toBe(false)
  // El servicio puede mandar líneas de relleno, con cero apariciones: no cuentan
  expect(estaEnLista(HUELLA.slice(5), `${HUELLA.slice(5)}:0`)).toBe(false)
})

test('al servicio le llega solo el comienzo de la huella, nunca la contraseña', async () => {
  const pedidos = []
  vi.stubGlobal('fetch', async (url) => {
    pedidos.push(String(url))
    return { ok: true, text: async () => RESPUESTA }
  })
  expect(await claveFiltrada('password')).toBe(true)
  expect(await claveFiltrada('Una-que-no-esta-9x')).toBe(false)
  expect(pedidos[0]).toBe('https://api.pwnedpasswords.com/range/5BAA6')
  for (const p of pedidos) expect(p).toMatch(/\/range\/[0-9A-F]{5}$/)
})

test('si el servicio no contesta o contesta mal, no se le traba el registro a nadie', async () => {
  vi.stubGlobal('fetch', async () => {
    throw new TypeError('Failed to fetch')
  })
  expect(await claveFiltrada('password')).toBe(false)
  vi.stubGlobal('fetch', async () => ({ ok: false, text: async () => RESPUESTA }))
  expect(await claveFiltrada('password')).toBe(false)
})

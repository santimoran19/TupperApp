// Búsqueda en Open Food Facts: dos buscadores, memoria por búsqueda y reintentos solos. La red y el reloj están simulados.
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { buscarProductos, _olvidar } from '../../src/lib/openfoodfacts.js'

const prod = (n) => ({ code: n, product_name: n, brands: 'Marca', quantity: '100 g', nutriments: { 'energy-kcal_100g': 100 }, countries_tags: ['en:argentina'] })
const esNuevo = (u) => u.includes('search.openfoodfacts')

// reglas(url, númeroDePedido) dice qué responde cada pedido: 'caido' (sin red), un número (error HTTP) o el JSON
let pedidos = []
function red(reglas) {
  pedidos = []
  vi.stubGlobal('fetch', async (url) => {
    const u = String(url)
    pedidos.push(esNuevo(u) ? 'nuevo' : 'viejo')
    const r = reglas(u, pedidos.length)
    if (r === 'caido') throw new TypeError('Failed to fetch')
    if (typeof r === 'number') return { ok: false, status: r, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => r }
  })
}

// Deja pasar el tiempo (simulado) hasta que la búsqueda termina, bien o mal. Devuelve cuántos segundos "pasaron".
async function esperar(promesa) {
  const inicio = Date.now()
  let fin = false
  let resultado, error
  promesa.then((r) => { resultado = r }, (e) => { error = e }).finally(() => { fin = true })
  while (!fin) await vi.advanceTimersByTimeAsync(100)
  return { resultado, error, segundos: (Date.now() - inicio) / 1000 }
}

beforeEach(() => { vi.useFakeTimers(); _olvidar() })
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

test('con el buscador nuevo andando, un solo pedido; la misma búsqueda no vuelve a consultar', async () => {
  red((u) => (esNuevo(u) ? { hits: [prod('A'), prod('B'), prod('C')] } : 'caido'))
  const { resultado } = await esperar(buscarProductos('mostaza'))
  expect(resultado.map((p) => p.name)).toEqual(['A (Marca)', 'B (Marca)', 'C (Marca)'])
  expect(pedidos).toEqual(['nuevo'])
  const otra = await esperar(buscarProductos(' Mostaza '))
  expect(otra.resultado.length).toBe(3)
  expect(pedidos.length).toBe(1)
})

test('si el nuevo falla, responde el viejo', async () => {
  red((u) => (esNuevo(u) ? 503 : { products: [prod('V1'), prod('V2'), prod('V3')] }))
  const { resultado } = await esperar(buscarProductos('fideos'))
  expect(resultado.length).toBe(3)
  expect(pedidos).toEqual(['nuevo', 'viejo'])
})

test('respuesta rara del nuevo: se usa el viejo (Argentina y después el resto)', async () => {
  red((u) => (esNuevo(u) ? { errors: [{ title: 'x' }] } : { products: [prod('V1')] }))
  const { resultado } = await esperar(buscarProductos('arroz'))
  expect(resultado.length).toBe(1)
  expect(pedidos).toEqual(['nuevo', 'viejo', 'viejo'])
})

test('si fallan los dos, reintenta sola hasta que responde', async () => {
  red((u, n) => (n <= 4 ? (n % 2 ? 'caido' : 503) : { hits: [prod('Z1'), prod('Z2'), prod('Z3')] }))
  let avisos = 0
  const { resultado } = await esperar(buscarProductos('yerba', { alReintentar: () => avisos++ }))
  expect(resultado.length).toBe(3)
  expect(pedidos).toEqual(['nuevo', 'viejo', 'nuevo', 'viejo', 'nuevo'])
  expect(avisos).toBe(2)
})

test('si no responde nadie, avisa recién después de insistir', async () => {
  red(() => 'caido')
  let avisos = 0
  const { error, segundos } = await esperar(buscarProductos('nada', { alReintentar: () => avisos++ }))
  expect(error).toBeTruthy()
  expect(avisos).toBeGreaterThanOrEqual(3)
  expect(segundos).toBeGreaterThan(6)
  expect(segundos).toBeLessThan(26)
  expect(pedidos.length).toBeGreaterThanOrEqual(8)
})

test('sin resultados no es un error', async () => {
  red(() => ({ hits: [], products: [] }))
  const { resultado } = await esperar(buscarProductos('zzzz'))
  expect(resultado).toEqual([])
  expect(pedidos).toEqual(['nuevo', 'nuevo'])
})

test('avisa cómo salió cada búsqueda (sin lo que se buscó), y un aviso que falla no rompe la búsqueda', async () => {
  red((u, n) => (n <= 2 ? 503 : { hits: [prod('A'), prod('B'), prod('C')] }))
  const avisos = []
  await esperar(buscarProductos('mostaza', { alTerminar: (como) => avisos.push(como) }))
  expect(avisos).toEqual([{ resultado: 'ok', fuente: 'nuevo', vueltas: 2, ms: expect.any(Number) }])

  _olvidar()
  red(() => 'caido')
  await esperar(buscarProductos('yerba', { alTerminar: (como) => avisos.push(como) }))
  expect(avisos[1]).toMatchObject({ resultado: 'error', motivo: 'Failed to fetch' })
  expect(JSON.stringify(avisos)).not.toMatch(/mostaza|yerba/)

  _olvidar()
  red(() => ({ hits: [prod('A'), prod('B'), prod('C')] }))
  const { resultado, error } = await esperar(buscarProductos('arroz', { alTerminar: () => { throw new Error('se rompió el aviso') } }))
  expect(error).toBeUndefined()
  expect(resultado.length).toBe(3)
  expect(pedidos).toEqual(['nuevo'])
})

// Nombre de un producto por su código en Precios Claros (datos del Estado). La red está simulada.
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { _olvidar, medida, nombrePorCodigo, recortar } from '../../src/lib/preciosclaros.js'

const BASE = 'https://d3e6htiiul5ek9.cloudfront.net/prod'
let pedidos = []
// `zonas`: para cada zona (0 Córdoba, 1 Buenos Aires, 2 Rosario) qué producto conoce, o null
function red({ conocen = {}, sucursalesCaidas = false, productoCaido = false } = {}) {
  pedidos = []
  vi.stubGlobal('fetch', async (url) => {
    const u = String(url)
    pedidos.push(u.replace(BASE, ''))
    if (u.includes('/sucursales')) {
      if (sucursalesCaidas) throw new TypeError('Failed to fetch')
      const zona = u.includes('lat=-31') ? 'cba' : u.includes('lat=-34') ? 'baires' : 'rosario'
      return { ok: true, status: 200, json: async () => ({ sucursales: [{ id: `${zona}-1` }, { id: `${zona}-2` }] }) }
    }
    if (productoCaido) return { ok: false, status: 503, json: async () => ({}) }
    const codigo = /id_producto=(\d+)/.exec(u)[1]
    const zona = /array_sucursales=([a-z]+)-/.exec(u)[1]
    const p = conocen[zona]?.[codigo]
    return {
      ok: true,
      status: 200,
      json: async () => ({ status: 200, producto: p ?? { msg: 'Producto inexistente.', id: codigo } }),
    }
  })
}
beforeEach(() => _olvidar())
afterEach(() => vi.unstubAllGlobals())

const ATUN = { nombre: ' Atun al Natural  La Campagnola 170 Gr ', marca: 'LA CAMPAGNOLA', presentacion: '170.0 gr' }

test('devuelve el nombre limpio, la marca y la presentación', async () => {
  red({ conocen: { cba: { 7790580131364: ATUN } } })
  expect(await nombrePorCodigo('7790580131364')).toEqual({
    nombre: 'Atun al Natural La Campagnola 170 Gr',
    marca: 'LA CAMPAGNOLA',
    detalle: '170 g',
    liquido: false,
  })
  expect(pedidos).toHaveLength(2) // las sucursales y el producto
  expect(pedidos[1]).toContain('id_producto=7790580131364')
  expect(pedidos[1]).toContain('array_sucursales=cba-1,cba-2')
})

test('un producto que no se vende en Córdoba se busca en las otras zonas; si no está en ninguna, null', async () => {
  red({
    conocen: { rosario: { 7790060023684: { nombre: 'Aceite de Girasol Cocinero 1.5 Lt', marca: 'COCINERO', presentacion: '1.5 lt' } } },
  })
  expect(await nombrePorCodigo('7790060023684')).toMatchObject({
    nombre: 'Aceite de Girasol Cocinero 1.5 Lt',
    detalle: '1.5 l',
    liquido: true,
  })
  expect(await nombrePorCodigo('7790000000000')).toBeNull()
})

test('las sucursales de cada zona se piden una sola vez por sesión', async () => {
  red({ conocen: { cba: { 7790580131364: ATUN } } })
  await nombrePorCodigo('7790580131364')
  await nombrePorCodigo('7790580131364')
  expect(pedidos.filter((p) => p.startsWith('/sucursales'))).toHaveLength(1)
})

test('si no responde no rompe nada: null, y no insiste con las otras zonas', async () => {
  red({ productoCaido: true })
  expect(await nombrePorCodigo('7790580131364')).toBeNull()
  expect(pedidos.filter((p) => p.startsWith('/producto'))).toHaveLength(1)
  red({ sucursalesCaidas: true })
  _olvidar()
  expect(await nombrePorCodigo('7790580131364')).toBeNull()
})

test('un código que no es de barras ni se consulta', async () => {
  red()
  expect(await nombrePorCodigo('abc')).toBeNull()
  expect(await nombrePorCodigo('123')).toBeNull()
  expect(pedidos).toHaveLength(0)
})

test('la presentación se pasa a algo legible y dice si es líquido', () => {
  expect(medida('500.0 gr')).toEqual({ detalle: '500 g', liquido: false })
  expect(medida('1 kg')).toEqual({ detalle: '1 kg', liquido: false })
  expect(medida('900.0 ml')).toEqual({ detalle: '900 ml', liquido: true })
  expect(medida('1.5 lt')).toEqual({ detalle: '1.5 l', liquido: true })
  expect(medida('50.0 un')).toEqual({ detalle: '50 un', liquido: false })
  expect(medida('')).toEqual({ detalle: '', liquido: false })
  expect(medida('raro')).toEqual({ detalle: '', liquido: false })
})

test('un nombre más largo que el máximo se corta en una palabra entera, no a la mitad', () => {
  expect(recortar('Atun al Natural Libre de Gluten sin TACC La Campagnola 170 Gr', 60)).toBe(
    'Atun al Natural Libre de Gluten sin TACC La Campagnola 170',
  )
  expect(recortar('Corto', 60)).toBe('Corto')
  expect(recortar('Palabrainterminablesinespaciosdeningunaclase', 20)).toBe('Palabrainterminables')
})

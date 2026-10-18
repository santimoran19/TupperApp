// Búsqueda en Open Food Facts: dos buscadores, memoria por búsqueda y reintentos solos. La red y el reloj están simulados.
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { buscarPorCodigo, buscarProductos, _olvidar } from '../../src/lib/openfoodfacts.js'

const prod = (n) => ({
  code: n,
  product_name: n,
  brands: 'Marca',
  quantity: '100 g',
  nutriments: { 'energy-kcal_100g': 100 },
  countries_tags: ['en:argentina'],
})
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
  promesa
    .then(
      (r) => {
        resultado = r
      },
      (e) => {
        error = e
      },
    )
    .finally(() => {
      fin = true
    })
  while (!fin) await vi.advanceTimersByTimeAsync(100)
  return { resultado, error, segundos: (Date.now() - inicio) / 1000 }
}

beforeEach(() => {
  vi.useFakeTimers()
  _olvidar()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

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
  const { resultado, error } = await esperar(
    buscarProductos('arroz', {
      alTerminar: () => {
        throw new Error('se rompió el aviso')
      },
    }),
  )
  expect(error).toBeUndefined()
  expect(resultado.length).toBe(3)
  expect(pedidos).toEqual(['nuevo'])
})

// ---------- Por código de barras (F-01) ----------
const CODIGO = '7790070411570'
const unProducto = {
  code: CODIGO,
  product_name: 'Fideos Tirabuzón',
  brands: 'Marca',
  quantity: '500 g',
  nutriments: { 'energy-kcal_100g': 360 },
}

test('por código: devuelve el producto en el formato de la app, con su código', async () => {
  red(() => ({ status: 1, product: unProducto }))
  const { resultado } = await esperar(buscarPorCodigo(CODIGO))
  expect(resultado.estado).toBe('ok')
  expect(resultado.producto).toMatchObject({
    codigo: CODIGO,
    name: 'Fideos Tirabuzón (Marca)',
    kcal: 360,
    unit: 'g',
    category: 'Pastas y arroz',
  })
  expect(pedidos).toEqual(['viejo']) // el pedido va a world.openfoodfacts.org (api/v2/product/<código>)
})

test('por código: si no existe (404 o status 0) dice que no, sin reintentar', async () => {
  red(() => 404)
  expect((await esperar(buscarPorCodigo(CODIGO))).resultado).toEqual({ estado: 'no' })
  expect(pedidos).toHaveLength(1)
  red(() => ({ status: 0, status_verbose: 'product not found' }))
  expect((await esperar(buscarPorCodigo(CODIGO))).resultado).toEqual({ estado: 'no' })
})

test('por código: un producto sin calorías pide cargar los valores a mano, con su nombre', async () => {
  red(() => ({ status: 1, product: { code: CODIGO, product_name: 'Producto sin datos', nutriments: {} } }))
  expect((await esperar(buscarPorCodigo(CODIGO))).resultado).toEqual({
    estado: 'incompleto',
    nombre: 'Producto sin datos',
    detalle: '',
    unit: 'g',
    category: 'Otros',
  })
})

// Producto de Open Food Facts con estos campos; devuelve lo que sale de buscarlo por código
const conCampos = async (campos) => {
  red(() => ({ status: 1, product: { code: CODIGO, product_name: 'Atún al natural', ...campos } }))
  return (await esperar(buscarPorCodigo(CODIGO))).resultado
}

test('por código: si los valores vienen por porción, los pasa a cada 100 g con el tamaño de la porción', async () => {
  const r = await conCampos({
    serving_quantity: '30',
    nutriments: { 'energy-kcal_serving': 90, proteins_serving: 3, carbohydrates_serving: 15, fat_serving: 2 },
  })
  expect(r.estado).toBe('ok')
  expect(r.producto).toMatchObject({ kcal: 300, protein: 10, carbs: 50, fat: 6.7, calculado: false })
})

test('por código: usa los valores sueltos solo si dice a qué se refieren (cada 100 g o por porción)', async () => {
  const sueltos = { 'energy-kcal': 250, proteins: 4, carbohydrates: 50, fat: 3 }
  expect((await conCampos({ nutrition_data_per: '100g', nutriments: sueltos })).producto).toMatchObject({ kcal: 250, protein: 4 })
  expect((await conCampos({ nutrition_data_per: 'serving', serving_quantity: 50, nutriments: sueltos })).producto).toMatchObject({
    kcal: 500,
    protein: 8,
  })
  // sin saber a qué se refieren (y sin macros completos) no se inventa nada
  expect((await conCampos({ nutriments: { 'energy-kcal': 250 } })).estado).toBe('incompleto')
  // por porción pero sin el tamaño de la porción: tampoco
  expect((await conCampos({ nutrition_data_per: 'serving', nutriments: { 'energy-kcal': 250 } })).estado).toBe('incompleto')
})

test('por código: si solo hay kilojoules los pasa a kcal', async () => {
  expect((await conCampos({ nutriments: { 'energy-kj_100g': 1000 } })).producto.kcal).toBe(239)
  expect((await conCampos({ nutriments: { energy_100g: 1000 } })).producto.kcal).toBe(239)
})

test('por código: sin calorías pero con proteínas, carbohidratos y grasas, las calcula y lo avisa', async () => {
  const r = await conCampos({ nutriments: { proteins_100g: 10, carbohydrates_100g: 60, fat_100g: 5 } })
  expect(r.estado).toBe('ok')
  expect(r.producto).toMatchObject({ kcal: 325, protein: 10, carbs: 60, fat: 5, calculado: true })
  // si falta alguno de los tres, o no cierran (más de 100 g en 100 g), no se calcula
  expect((await conCampos({ nutriments: { proteins_100g: 10, fat_100g: 5 } })).estado).toBe('incompleto')
  expect((await conCampos({ nutriments: { proteins_100g: 50, carbohydrates_100g: 50, fat_100g: 50 } })).estado).toBe('incompleto')
  // las calorías que trae el producto mandan sobre el cálculo
  expect(
    (await conCampos({ nutriments: { 'energy-kcal_100g': 200, proteins_100g: 10, carbohydrates_100g: 60, fat_100g: 5 } })).producto,
  ).toMatchObject({
    kcal: 200,
    calculado: false,
  })
})

test('por código: sin nombre en español usa el genérico; un producto vacío (sin nombre ni datos) es como si no existiera', async () => {
  red(() => ({ status: 1, product: { code: CODIGO, generic_name: 'Atún en aceite', nutriments: { 'energy-kcal_100g': 190 } } }))
  expect((await esperar(buscarPorCodigo(CODIGO))).resultado.producto.name).toBe('Atún en aceite')
  red(() => ({ status: 1, product: { code: CODIGO, nutriments: {} } }))
  expect((await esperar(buscarPorCodigo(CODIGO))).resultado).toEqual({ estado: 'no' })
})

test('por código: si Open Food Facts no responde reintenta y recién ahí tira el error (no lo confunde con "no existe")', async () => {
  red((u, n) => (n < 3 ? 'caido' : { status: 1, product: unProducto }))
  expect((await esperar(buscarPorCodigo(CODIGO))).resultado.estado).toBe('ok')
  expect(pedidos).toHaveLength(3)
  red(() => 503)
  const { error } = await esperar(buscarPorCodigo(CODIGO))
  expect(error.message).toMatch(/503/)
  expect(pedidos).toHaveLength(3)
})

// El catálogo compartido de productos (F-02) y el código de barras de los alimentos propios (F-01), en una base de
// verdad (supabase/actualizacion-14.sql): un producto solo llega a los demás cuando dos personas distintas cargaron
// valores que coinciden; nadie toca las tablas directamente; los topes y las validaciones cortan lo raro.
import { beforeAll, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo } from './postgres.js'

let db, como, filas, una, rpc

beforeAll(async () => {
  ;({ db, como, filas, una, rpc } = await abrirBase())
  await db.query('insert into auth.users (id, email) values ($1, $2)', [CARLA, 'carla@test.com'])
}, 60000)

const CARLA = '00000000-0000-0000-0000-00000000000c'
const COD = '7790001234567'
// codigo, nombre, detalle, unidad, kcal, prot, carbs, grasa, categoría, alcohol
const aporte = (usuario, datos = {}) => {
  const d = {
    codigo: COD,
    name: 'Galletitas de avena (Marca)',
    detalle: '200 g',
    unit: 'g',
    kcal: 450,
    protein: 7,
    carbs: 68,
    fat: 16,
    category: 'Snacks y dulces',
    alcohol: false,
    ...datos,
  }
  return como(usuario, () =>
    rpc('catalogo_aportar', [d.codigo, d.name, d.detalle, d.unit, d.kcal, d.protein, d.carbs, d.fat, d.category, d.alcohol]),
  )
}
const numeros = (f) => ({ ...f, kcal: Number(f.kcal), protein: Number(f.protein), carbs: Number(f.carbs), fat: Number(f.fat) })
const porCodigo = async (usuario, codigo = COD) =>
  (await como(usuario, () => filas('select * from public.catalogo_por_codigo($1)', [codigo]))).map(numeros)
const buscar = (usuario, texto) => como(usuario, () => filas('select * from public.catalogo_buscar($1)', [texto]))
const publicados = () => filas('select * from public.catalogo order by clave')

test('los alimentos que ya existen quedan sin código y el catálogo arranca vacío', async () => {
  expect((await una('select count(*)::int as n from public.foods where codigo is not null')).n).toBe(0)
  expect((await una('select count(*)::int as n from public.catalogo')).n).toBe(0)
  expect((await una('select count(*)::int as n from public.catalogo_aportes')).n).toBe(0)
})

test('un alimento propio puede llevar código de barras, pero solo uno válido', async () => {
  const nuevo = (codigo) =>
    como(ANA, () =>
      filas(
        `insert into public.foods (owner, name, unit, kcal, protein, carbs, fat, category, codigo)
         values ($1, 'Mi producto', 'g', 100, 1, 1, 1, 'Otros', $2) returning id`,
        [ANA, codigo],
      ),
    )
  expect(await nuevo(COD)).toHaveLength(1)
  expect(await nuevo(null)).toHaveLength(1)
  for (const malo of ['abc', '1234567', '123456789012345', '77900012345a7', ''])
    expect(await fallo(nuevo(malo)), malo).toMatch(/foods_codigo_chk/)
  // Lo busca por código la misma persona; otra no ve el alimento
  const suyo = await como(ANA, () => filas('select name from public.foods where codigo = $1', [COD]))
  expect(suyo).toHaveLength(1)
  expect(await como(BETO, () => filas('select name from public.foods where codigo = $1', [COD]))).toEqual([])
})

test('nadie toca las tablas del catálogo directamente', async () => {
  for (const usuario of [ANA, null]) {
    for (const sql of [
      'select * from public.catalogo',
      'select * from public.catalogo_aportes',
      "insert into public.catalogo (clave, name, unit, kcal, category) values ('x:abc', 'Falso', 'g', 1, 'Otros')",
      'delete from public.catalogo',
    ])
      expect(await fallo(como(usuario, () => filas(sql))), `${usuario ? 'con' : 'sin'} sesión: ${sql}`).toMatch(/permission denied/)
  }
})

test('sin sesión no se aporta ni se consulta', async () => {
  expect(await fallo(aporte(null))).toMatch(/permission denied/)
  expect(await fallo(como(null, () => filas('select * from public.catalogo_por_codigo($1)', [COD])))).toMatch(/permission denied/)
  expect(await fallo(como(null, () => filas('select * from public.catalogo_buscar($1)', ['galletitas'])))).toMatch(/permission denied/)
})

test('lo que aporta una sola persona no lo ve nadie más', async () => {
  expect(await aporte(ANA)).toBe(false)
  expect(await publicados()).toEqual([])
  expect(await porCodigo(BETO)).toEqual([])
  expect(await porCodigo(ANA)).toEqual([])
  expect(await buscar(BETO, 'galletitas')).toEqual([])
  // La misma persona aportando de nuevo (aunque cambie los valores) tampoco lo publica
  expect(await aporte(ANA, { kcal: 452 })).toBe(false)
  expect(await aporte(ANA)).toBe(false)
  expect((await una('select count(*)::int as n from public.catalogo_aportes')).n).toBe(1)
  expect(Number((await una('select kcal from public.catalogo_aportes')).kcal)).toBe(450)
})

test('valores que no coinciden no publican nada', async () => {
  const dif = [
    { kcal: 300 }, // más de 10 % y más de 15 kcal
    { protein: 12 }, // 5 g más
    { carbs: 75 },
    { fat: 22 },
    { unit: 'ml' },
  ]
  for (const d of dif) expect(await aporte(BETO, d), JSON.stringify(d)).toBe(false)
  expect(await publicados()).toEqual([])
  expect(await porCodigo(CARLA)).toEqual([])
})

test('dos personas con valores parecidos publican el producto para todos', async () => {
  // Beto ya tenía un aporte distinto (de la prueba anterior): lo corrige y ahora sí coincide con el de Ana (margen de 10 %)
  expect(await aporte(BETO, { kcal: 480, protein: 8, carbs: 66, fat: 17, name: 'Galletitas avena marca' })).toBe(true)
  const [p] = await publicados()
  expect(p).toMatchObject({ clave: COD, codigo: COD, unit: 'g', category: 'Snacks y dulces', confirmaciones: 2 })
  // Los demás lo encuentran por código y por nombre; los datos publicados son los del que cerró la coincidencia
  for (const usuario of [ANA, BETO, CARLA]) {
    const [x] = await porCodigo(usuario)
    expect(x).toMatchObject({ codigo: COD, name: 'Galletitas avena marca', unit: 'g', kcal: 480, alcohol: false, confirmaciones: 2 })
    expect(await buscar(usuario, 'AVENA')).toHaveLength(1)
  }
  // Nunca se ve de quién es cada aporte
  const columnas = Object.keys((await porCodigo(CARLA))[0])
  expect(columnas).not.toContain('user_id')
})

test('ya publicado: otra persona que coincide suma una confirmación (una sola vez) y la que no coincide, nada', async () => {
  expect(await aporte(CARLA, { kcal: 900, protein: 1, carbs: 1, fat: 1 })).toBe(true) // ya está publicado
  expect((await porCodigo(ANA))[0].confirmaciones).toBe(2)
  expect(await aporte(CARLA)).toBe(true)
  expect(await aporte(CARLA)).toBe(true)
  const [x] = await porCodigo(ANA)
  expect(x.confirmaciones).toBe(3)
  // El dato publicado no cambia por lo que cargue después
  expect(x).toMatchObject({ name: 'Galletitas avena marca', kcal: 480 })
})

test('un producto sin código se identifica por su nombre, sin tildes ni mayúsculas', async () => {
  const sin = { codigo: null, name: 'Alfajor de Maicena Único', kcal: 400, protein: 4, carbs: 62, fat: 15, category: 'Snacks y dulces' }
  expect(await aporte(ANA, sin)).toBe(false)
  expect(await aporte(BETO, { ...sin, name: '  alfajor  de maicena unico ', kcal: 410 })).toBe(true)
  const [p] = await filas("select * from public.catalogo where clave like 'n:%'")
  expect(p).toMatchObject({ clave: 'n:alfajor de maicena unico', codigo: null })
  expect(await porCodigo(CARLA, 'n:alfajor de maicena unico')).toEqual([]) // por código solo los que tienen código
  expect(await buscar(CARLA, 'maicena')).toHaveLength(1)
  expect(await buscar(CARLA, 'MAICÉNA')).toHaveLength(1)
})

test('la búsqueda pide 3 letras, no deja usar comodines y ordena por confirmaciones', async () => {
  expect(await buscar(ANA, 'al')).toEqual([])
  expect(await buscar(ANA, '')).toEqual([])
  expect(await buscar(ANA, '%%%')).toEqual([])
  expect(await buscar(ANA, '___')).toEqual([])
  expect(await buscar(ANA, 'a\\')).toEqual([])
  expect((await buscar(ANA, 'galletitas')).map((x) => x.name)).toEqual(['Galletitas avena marca'])
  expect(await buscar(ANA, 'xyzxyz')).toEqual([])
  // La de más confirmaciones va primera
  const uno = { name: 'Barrita de cereal A', kcal: 380, protein: 5, carbs: 70, fat: 8 }
  for (const [codigo, nombre] of [
    ['7790000000011', 'Barrita de cereal A'],
    ['7790000000028', 'Barrita de cereal B'],
  ]) {
    await aporte(ANA, { ...uno, codigo, name: nombre })
    await aporte(BETO, { ...uno, codigo, name: nombre })
  }
  await aporte(CARLA, { ...uno, codigo: '7790000000028', name: 'Barrita de cereal B' })
  expect((await buscar(ANA, 'barrita')).map((x) => x.name)).toEqual(['Barrita de cereal B', 'Barrita de cereal A'])
})

test('los datos raros se rechazan antes de guardarse', async () => {
  const malo = (d) => fallo(aporte(ANA, { codigo: '7790009999990', ...d }))
  expect(await malo({ codigo: '123' })).toMatch(/código de barras no es válido/)
  expect(await malo({ codigo: '12345678901234567' })).toMatch(/código de barras no es válido/)
  expect(await malo({ name: '   ' })).toMatch(/nombre no es válido/)
  expect(await malo({ name: 'x'.repeat(61) })).toMatch(/nombre no es válido/)
  expect(await malo({ unit: 'u' })).toMatch(/gramos o mililitros/)
  expect(await malo({ unit: null })).toMatch(/gramos o mililitros/)
  expect(await malo({ kcal: 901 })).toMatch(/valores del producto/)
  expect(await malo({ kcal: -1 })).toMatch(/valores del producto/)
  expect(await malo({ kcal: null })).toMatch(/valores del producto/)
  expect(await malo({ protein: 101, kcal: 900 })).toMatch(/valores del producto/)
  expect(await malo({ protein: 60, carbs: 60, fat: 0, kcal: 900 })).toMatch(/valores del producto/)
  expect(await malo({ category: '' })).toMatch(/categoría no es válida/)
  expect(await malo({ category: 'x'.repeat(41) })).toMatch(/categoría no es válida/)
  expect(await malo({ codigo: null, name: 'y'.repeat(60) + '' })).toBeNull() // 60 caracteres entra
  expect((await una("select count(*)::int as n from public.catalogo_aportes where clave = '7790009999990'")).n).toBe(0)
})

test('el detalle se recorta y los números se redondean', async () => {
  await aporte(CARLA, { codigo: '7790008888880', name: 'Prueba de redondeo', detalle: 'z'.repeat(80), kcal: 123.456789, protein: 1.234567 })
  const a = await una("select detalle, kcal, protein from public.catalogo_aportes where clave = '7790008888880'")
  expect(a.detalle).toHaveLength(40)
  expect(Number(a.kcal)).toBe(123.46)
  expect(Number(a.protein)).toBe(1.23)
})

test('cada persona puede compartir 100 productos nuevos por día', async () => {
  const antes = (await una('select count(*)::int as n from public.catalogo_aportes where user_id = $1', [BETO])).n
  for (let i = antes; i < 100; i++) await aporte(BETO, { codigo: String(8000000000000 + i), name: 'Producto ' + i })
  expect(await fallo(aporte(BETO, { codigo: '8000000009999', name: 'Uno más' }))).toMatch(/ya compartiste muchos productos/)
  // Lo que ya aportó se puede seguir corrigiendo
  const primero = String(8000000000000 + antes)
  expect(await fallo(aporte(BETO, { codigo: primero, name: 'Producto ' + antes, kcal: 100 }))).toBeNull()
  // Y mañana puede de nuevo
  await db.query("update public.catalogo_aportes set created_at = now() - interval '2 days' where user_id = $1", [BETO])
  expect(await fallo(aporte(BETO, { codigo: '8000000009999', name: 'Uno más' }))).toBeNull()
})

test('al borrar la cuenta se van sus aportes y el producto ya publicado se queda', async () => {
  const antes = (await publicados()).length
  expect((await una('select count(*)::int as n from public.catalogo_aportes where user_id = $1', [CARLA])).n).toBeGreaterThan(0)
  await como(CARLA, () => filas('select public.borrar_mi_cuenta()'))
  expect((await una('select count(*)::int as n from public.catalogo_aportes where user_id = $1', [CARLA])).n).toBe(0)
  expect(await publicados()).toHaveLength(antes)
  expect(await porCodigo(ANA)).toHaveLength(1)
})

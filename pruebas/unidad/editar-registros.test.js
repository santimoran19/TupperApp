// Editar y borrar lo que se anotó, con la despensa al día (supabase/actualizacion-9.sql), contra un Postgres de verdad.
import { beforeAll, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo, j } from './postgres.js'

let id, receta, como, filas, una, rpc, stockDe

beforeAll(async () => {
  ;({ id, receta, como, filas, una, rpc, stockDe } = await abrirBase())
}, 60000)

const poner = (usuario, cambios) => como(usuario, () => filas('select * from public.mover_stock($1)', [j(cambios)]))
const fila = (alimento, qty, extra = {}) => ({
  name: alimento,
  food_id: id[alimento],
  qty,
  kcal: qty * 2,
  protein: qty / 10,
  carbs: qty / 5,
  fat: qty / 20,
  ...extra,
})
const registrar = (usuario, filasDeComida, fecha = '2026-10-01', comida = 'almuerzo') =>
  como(usuario, () => rpc('registrar_comida', [fecha, comida, j(filasDeComida), '[]', '[]', null]))

test('registrar anota cuánto descontó de verdad: si falta stock, descuenta lo que hay', async () => {
  await poner(ANA, [
    { food_id: id.huevo, delta: 10 },
    { food_id: id.arroz, delta: 100 },
  ])
  const r = await registrar(ANA, [
    fila('huevo', 4, { s: [{ f: id.huevo, q: 4 }], p: 0 }),
    fila('arroz', 300, { s: [{ f: id.arroz, q: 300 }], p: 0 }), // hay 100: descuenta 100
    fila('banana', 1, { s: [{ f: id.banana, q: 1 }], p: 0 }), // no está en la despensa
  ])
  expect(r.registros.map((x) => x.descontado)).toEqual([
    { s: [{ f: id.huevo, q: 4, n: 4 }], p: 0, pn: 0 },
    { s: [{ f: id.arroz, q: 100, n: 300 }], p: 0, pn: 0 }, // hacían falta 300 y había 100
    { s: [], p: 0, pn: 0 },
  ])
  expect(await stockDe(ANA)).toMatchObject({ huevo: 6, arroz: 0 })
  expect(r.stock.length).toBe(2)
})

test('un mismo alimento en dos filas: la segunda descuenta solo lo que quedó', async () => {
  await poner(ANA, [{ food_id: id.leche, delta: 300 }])
  const r = await registrar(
    ANA,
    [fila('leche', 200, { s: [{ f: id.leche, q: 200 }] }), fila('leche', 200, { s: [{ f: id.leche, q: 200 }] })],
    '2026-10-02',
  )
  expect(r.registros.map((x) => x.descontado.s[0].q)).toEqual([200, 100])
  expect((await stockDe(ANA)).leche).toBe(0)
})

test('las versiones anteriores de la app siguen andando: descuentan con p_stock y el registro queda sin dato', async () => {
  await poner(ANA, [{ food_id: id['queso-cremoso'], delta: 500 }])
  const r = await como(ANA, () =>
    rpc('registrar_comida', [
      '2026-10-03',
      'cena',
      j([fila('queso-cremoso', 100)]),
      j([{ food_id: id['queso-cremoso'], delta: -100 }]),
      '[]',
      null,
    ]),
  )
  expect(r.registros[0].descontado).toBeNull()
  expect((await stockDe(ANA))['queso-cremoso']).toBe(400)
})

test('editar: bajar la cantidad devuelve la diferencia a la despensa y recalcula calorías y macros', async () => {
  await poner(ANA, [{ food_id: id['pechuga-cruda'], delta: 1000 }])
  const [{ id: reg }] = (
    await registrar(ANA, [fila('pechuga-cruda', 200, { s: [{ f: id['pechuga-cruda'], q: 200 }], p: 0 })], '2026-10-04')
  ).registros
  expect((await stockDe(ANA))['pechuga-cruda']).toBe(800)
  const r = await como(ANA, () => rpc('editar_registro', [reg, 150]))
  expect(Number(r.registro.qty)).toBe(150)
  expect(Number(r.registro.kcal)).toBeCloseTo(300, 3)
  expect(Number(r.registro.protein)).toBeCloseTo(15, 3)
  expect(r.registro.descontado).toEqual({ s: [{ f: id['pechuga-cruda'], q: 150, n: 150 }], p: 0, pn: 0 })
  expect((await stockDe(ANA))['pechuga-cruda']).toBe(850)
  expect(r.avisos).toMatchObject({ sin_datos: false, faltan: [], ausentes: [] })
  // Pedir lo mismo otra vez (el pedido llegó dos veces) no cambia nada
  await como(ANA, () => rpc('editar_registro', [reg, 150]))
  expect((await stockDe(ANA))['pechuga-cruda']).toBe(850)
})

test('editar: subir la cantidad descuenta más y, si no alcanza, deja la despensa en cero y avisa', async () => {
  const [{ id: reg }] = (
    await registrar(ANA, [fila('pechuga-cruda', 100, { s: [{ f: id['pechuga-cruda'], q: 100 }], p: 0 })], '2026-10-05')
  ).registros
  expect((await stockDe(ANA))['pechuga-cruda']).toBe(750)
  let r = await como(ANA, () => rpc('editar_registro', [reg, 300]))
  expect((await stockDe(ANA))['pechuga-cruda']).toBe(550)
  expect(r.registro.descontado.s[0].q).toBe(300)
  // Ahora pide mucho más de lo que hay
  r = await como(ANA, () => rpc('editar_registro', [reg, 1000]))
  expect((await stockDe(ANA))['pechuga-cruda']).toBe(0)
  expect(Number(r.registro.qty)).toBe(1000)
  expect(r.registro.descontado.s[0].q).toBe(850) // lo que de verdad salió de la despensa
  expect(r.avisos.faltan).toEqual([{ f: id['pechuga-cruda'], falta: 150 }])
  // Borrarlo devuelve solo lo que había salido
  await como(ANA, () => rpc('borrar_registro', [reg]))
  expect((await stockDe(ANA))['pechuga-cruda']).toBe(850)
})

test('editar: si el producto ya no está en la despensa, se corrige solo el diario y se avisa', async () => {
  await poner(ANA, [{ food_id: id['atun-natural'], delta: 200 }])
  const [{ id: reg }] = (await registrar(ANA, [fila('atun-natural', 100, { s: [{ f: id['atun-natural'], q: 100 }], p: 0 })], '2026-10-06'))
    .registros
  await como(ANA, () => filas('delete from public.stock where food_id = $1', [id['atun-natural']]))
  const r = await como(ANA, () => rpc('editar_registro', [reg, 50]))
  expect(Number(r.registro.qty)).toBe(50)
  expect(r.avisos.ausentes).toEqual([id['atun-natural']])
  expect(r.stock).toEqual([])
  expect((await stockDe(ANA))['atun-natural']).toBeUndefined() // no se vuelve a crear
})

test('editar un registro anterior a esta versión (sin dato): solo el diario, con aviso', async () => {
  await poner(ANA, [{ food_id: id['pan-frances'], delta: 500 }])
  const { id: reg } = await como(ANA, () =>
    una(
      `insert into public.log_entries (user_id, date, meal, name, food_id, qty, kcal) values ($1, '2026-09-01', 'cena', 'pan', $2, 100, 250) returning id`,
      [ANA, id['pan-frances']],
    ),
  )
  const r = await como(ANA, () => rpc('editar_registro', [reg, 40]))
  expect(Number(r.registro.kcal)).toBeCloseTo(100, 3)
  expect(r.avisos.sin_datos).toBe(true)
  expect((await stockDe(ANA))['pan-frances']).toBe(500)
  // Borrarlo tampoco toca la despensa
  await como(ANA, () => rpc('borrar_registro', [reg]))
  expect((await stockDe(ANA))['pan-frances']).toBe(500)
})

test('recetas: las porciones de comida lista y los ingredientes se ajustan juntos', async () => {
  const rec = Object.keys(receta)[0]
  await como(ANA, () => filas('insert into public.prepared (user_id, recipe_id, portions) values ($1, $2, 3)', [ANA, receta[rec]]))
  await poner(ANA, [{ food_id: id.harina, delta: 1000 }])
  const [{ id: reg }] = (
    await registrar(
      ANA,
      [{ name: rec, recipe_id: receta[rec], qty: 4, kcal: 800, protein: 40, carbs: 80, fat: 20, s: [{ f: id.harina, q: 100 }], p: 3 }],
      '2026-10-07',
    )
  ).registros
  expect((await una('select portions from public.prepared where user_id = $1', [ANA])).portions).toBe('0')
  const r = await como(ANA, () => rpc('editar_registro', [reg, 2]))
  expect(Number(r.registro.kcal)).toBeCloseTo(400, 3)
  expect(r.registro.descontado).toEqual({ s: [{ f: id.harina, q: 50, n: 50 }], p: 1.5, pn: 1.5 })
  expect(Number((await una('select portions from public.prepared where user_id = $1', [ANA])).portions)).toBe(1.5)
  expect((await stockDe(ANA)).harina).toBe(950)
  await como(ANA, () => rpc('borrar_registro', [reg]))
  expect(Number((await una('select portions from public.prepared where user_id = $1', [ANA])).portions)).toBe(3)
  expect((await stockDe(ANA)).harina).toBe(1000)
})

test('borrar: devuelve lo descontado y no falla si el registro ya no existe', async () => {
  await poner(ANA, [{ food_id: id.fideos, delta: 500 }])
  const [{ id: reg }] = (await registrar(ANA, [fila('fideos', 120, { s: [{ f: id.fideos, q: 120 }], p: 0 })], '2026-10-08')).registros
  expect((await stockDe(ANA)).fideos).toBe(380)
  const r = await como(ANA, () => rpc('borrar_registro', [reg]))
  expect(r.stock.length).toBe(1)
  expect((await stockDe(ANA)).fideos).toBe(500)
  const otra = await como(ANA, () => rpc('borrar_registro', [reg]))
  expect(otra.stock).toEqual([])
  expect((await stockDe(ANA)).fideos).toBe(500)
})

test('cada cuenta toca solo lo suyo y los valores raros se rechazan', async () => {
  await poner(ANA, [{ food_id: id.arroz, delta: 100 }])
  const [{ id: reg }] = (await registrar(ANA, [fila('arroz', 50, { s: [{ f: id.arroz, q: 50 }], p: 0 })], '2026-10-09')).registros
  expect(await fallo(como(BETO, () => rpc('editar_registro', [reg, 10])))).toMatch(/ya no existe/)
  const borrada = await como(BETO, () => rpc('borrar_registro', [reg]))
  expect(borrada.stock).toEqual([])
  expect(Number((await una('select qty from public.log_entries where id = $1', [reg])).qty)).toBe(50)
  expect(await fallo(como(ANA, () => rpc('editar_registro', [reg, 0])))).toMatch(/no es válida/)
  expect(await fallo(como(ANA, () => rpc('editar_registro', [reg, -3])))).toMatch(/no es válida/)
  expect(await fallo(como(ANA, () => rpc('editar_registro', [reg, 5000000])))).toMatch(/no es válida/)
  expect(await fallo(como(ANA, () => rpc('editar_registro', [reg, 99000])))).toMatch(/demasiadas calorías/)
  expect(await fallo(como(null, () => rpc('editar_registro', [reg, 10])))).toBeTruthy()
  expect(await fallo(como(null, () => rpc('borrar_registro', [reg])))).toBeTruthy()
})

test('la anotación de lo descontado tiene tope: no más de 40 productos ni de 2.600 caracteres', async () => {
  const [{ id: reg }] = (await registrar(ANA, [fila('arroz', 10, { s: [], p: 0 })], '2026-10-10')).registros
  const muchos = Array.from({ length: 41 }, () => ({ f: id.arroz, q: 1 }))
  expect(
    await fallo(como(ANA, () => filas('update public.log_entries set descontado = $1 where id = $2', [j({ s: muchos, p: 0 }), reg]))),
  ).toMatch(/log_entries_descontado_chk/)
  expect(await fallo(como(ANA, () => filas('update public.log_entries set descontado = $1 where id = $2', [j({ p: 0 }), reg])))).toMatch(
    /log_entries_descontado_chk/,
  )
  expect(
    await fallo(
      como(ANA, () => filas('update public.log_entries set descontado = $1 where id = $2', [j({ s: [{ f: id.arroz, q: 1 }], p: 0 }), reg])),
    ),
  ).toBeNull()
})

test('anotar de más y corregir: lo que hacía falta se descuenta completo (20 huevos con 8 en la despensa, y se vuelve a 4)', async () => {
  await poner(ANA, [{ food_id: id['queso-cremoso'], delta: 8 }])
  const antes = (await stockDe(ANA))['queso-cremoso']
  const [{ id: reg }] = (await registrar(ANA, [fila('queso-cremoso', 4, { s: [{ f: id['queso-cremoso'], q: 4 }], p: 0 })], '2026-10-11'))
    .registros
  expect((await stockDe(ANA))['queso-cremoso']).toBe(antes - 4)
  let r = await como(ANA, () => rpc('editar_registro', [reg, antes + 12]))
  expect((await stockDe(ANA))['queso-cremoso']).toBe(0)
  expect(r.avisos.faltan.length).toBe(1)
  expect(r.registro.descontado.s[0]).toMatchObject({ q: antes, n: antes + 12 })
  // Se corrige a la cantidad de antes: vuelve lo que sobra y quedan descontados los 4 completos
  r = await como(ANA, () => rpc('editar_registro', [reg, 4]))
  expect((await stockDe(ANA))['queso-cremoso']).toBe(antes - 4)
  expect(r.registro.descontado.s[0]).toMatchObject({ q: 4, n: 4 })
  expect(r.avisos.faltan).toEqual([])
})

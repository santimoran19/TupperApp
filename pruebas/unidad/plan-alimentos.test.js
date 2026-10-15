// Alimentos sueltos en el plan (supabase/actualizacion-11.sql): cada comida es una receta o un alimento con su cantidad.
import { beforeAll, expect, test } from 'vitest'
import { abrirBase, ANA, fallo } from './postgres.js'

let id, receta, como, filas, una

beforeAll(async () => {
  ;({ id, receta, como, filas, una } = await abrirBase())
}, 60000)

const fila = (extra = {}) => ({ user_id: ANA, date: '2026-10-20', meal: 'merienda', ...extra })
const insertar = (f) => {
  const columnas = Object.keys(f)
  return filas(
    `insert into public.plan (${columnas.join(', ')}) values (${columnas.map((_, i) => '$' + (i + 1)).join(', ')}) returning *`,
    Object.values(f),
  )
}
const borrar = () => filas('delete from public.plan where user_id = $1', [ANA])

test('una comida puede ser un alimento con su cantidad, o una receta, o estar vacía', async () => {
  await como(ANA, async () => {
    const primera = Object.values(id)[0]
    expect(await fallo(insertar(fila({ food_id: primera, qty: 250 })))).toBeNull()
    expect(await fallo(insertar(fila({ date: '2026-10-21', recipe_id: Object.values(receta)[0] })))).toBeNull()
    expect(await fallo(insertar(fila({ date: '2026-10-22' })))).toBeNull()
    expect(Number((await una('select qty from public.plan where date = $1', ['2026-10-20'])).qty)).toBe(250)
    await borrar()
  })
})

test('no se aceptan alimentos sin cantidad, cantidades sin alimento, ni receta y alimento a la vez', async () => {
  await como(ANA, async () => {
    const a = Object.values(id)[0]
    expect(await fallo(insertar(fila({ food_id: a })))).toMatch(/plan_alimento_chk/)
    expect(await fallo(insertar(fila({ qty: 100 })))).toMatch(/plan_alimento_chk/)
    expect(await fallo(insertar(fila({ food_id: a, qty: 100, recipe_id: Object.values(receta)[0] })))).toMatch(/plan_una_cosa_chk/)
  })
})

test('la cantidad tiene que ser mayor a cero y no pasar el tope', async () => {
  await como(ANA, async () => {
    const a = Object.values(id)[0]
    expect(await fallo(insertar(fila({ food_id: a, qty: 0 })))).toMatch(/plan_qty_chk/)
    expect(await fallo(insertar(fila({ food_id: a, qty: -5 })))).toMatch(/plan_qty_chk/)
    expect(await fallo(insertar(fila({ food_id: a, qty: 5001 })))).toMatch(/plan_qty_chk/)
    expect(await fallo(insertar(fila({ food_id: a, qty: 5000 })))).toBeNull()
    await borrar()
  })
})

test('cambiar una comida de receta a alimento (y al revés) con un upsert, como hace la app', async () => {
  await como(ANA, async () => {
    const a = Object.values(id)[0]
    const upsert = (f) =>
      filas(
        `insert into public.plan (user_id, date, meal, recipe_id, food_id, qty, away) values ($1, $2, $3, $4, $5, $6, false)
         on conflict (user_id, date, meal) do update set recipe_id = excluded.recipe_id, food_id = excluded.food_id, qty = excluded.qty returning *`,
        [ANA, '2026-10-23', 'cena', f.recipe_id ?? null, f.food_id ?? null, f.qty ?? null],
      )
    expect(await fallo(upsert({ recipe_id: Object.values(receta)[0] }))).toBeNull()
    expect(await fallo(upsert({ food_id: a, qty: 30 }))).toBeNull()
    expect((await una('select food_id, recipe_id from public.plan where date = $1', ['2026-10-23'])).recipe_id).toBeNull()
    expect(await fallo(upsert({ recipe_id: Object.values(receta)[0] }))).toBeNull()
    expect((await una('select food_id from public.plan where date = $1', ['2026-10-23'])).food_id).toBeNull()
    await borrar()
  })
})

test('si se borra el alimento propio, se va del plan; lo demás queda', async () => {
  const propio = (
    await una(`insert into public.foods (owner, name, unit, kcal) values ($1, 'Galleta de arroz', 'g', 380) returning id`, [ANA])
  ).id
  await como(ANA, async () => {
    await insertar(fila({ food_id: propio, qty: 40 }))
    await insertar(fila({ date: '2026-10-21', recipe_id: Object.values(receta)[0] }))
    await filas('delete from public.foods where id = $1', [propio])
    const quedan = await filas('select date::text as d from public.plan where user_id = $1', [ANA])
    expect(quedan.map((r) => r.d)).toEqual(['2026-10-21'])
    await borrar()
  })
})

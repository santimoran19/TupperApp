// Los topes de la base (supabase/actualizacion-8.sql): textos con largo máximo, filas que no pesan de más y un máximo de
// filas por usuario. Se prueban entrando como un usuario común, que es quien podría hablarle a la base sin pasar por la app.
import { beforeAll, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo, j } from './postgres.js'

let id, receta, como, filas, una, rpc

beforeAll(async () => {
  ;({ id, receta, como, filas, una, rpc } = await abrirBase())
}, 60000)

const largo = (n) => 'a'.repeat(n)
const registro = (extra = {}) => ({ user_id: ANA, date: '2026-10-03', meal: 'cena', name: 'Arroz', qty: 1, kcal: 100, ...extra })
const insertar = (tabla, fila) => {
  const columnas = Object.keys(fila)
  return filas(
    `insert into public.${tabla} (${columnas.join(', ')}) values (${columnas.map((_, i) => '$' + (i + 1)).join(', ')}) returning *`,
    Object.values(fila),
  )
}

test('los datos base del repo entran con los topes puestos', async () => {
  const n = await una('select (select count(*) from public.foods)::int as alimentos, (select count(*) from public.recipes)::int as recetas')
  expect(n).toEqual({ alimentos: 274, recetas: 88 })
})

test('textos: el nombre de un registro o de una compra tiene tope en la base', async () => {
  await como(ANA, async () => {
    expect(await fallo(insertar('log_entries', registro({ name: largo(120) })))).toBeNull()
    expect(await fallo(insertar('log_entries', registro({ name: largo(121) })))).toMatch(/log_entries_nombre_chk/)
    // También al modificar
    expect(await fallo(filas('update public.log_entries set name = $1 where user_id = $2', [largo(5000), ANA]))).toMatch(/log_entries/)
    const compra = { user_id: ANA, name: largo(120), qty: 1, price: 10 }
    expect(await fallo(insertar('purchases', compra))).toBeNull()
    expect(await fallo(insertar('purchases', { ...compra, name: largo(121) }))).toMatch(/purchases_nombre_chk/)
  })
})

test('alimentos y recetas propios: sin slug, con medida y categoría cortas y comidas que existen', async () => {
  const alimento = { owner: ANA, name: 'Galletitas', unit: 'g', kcal: 400 }
  await como(ANA, async () => {
    expect(await fallo(insertar('foods', alimento))).toBeNull()
    expect(await fallo(insertar('foods', { ...alimento, slug: 'galletitas' }))).toMatch(/foods_slug_chk/)
    expect(await fallo(insertar('foods', { ...alimento, unit_label: largo(31) }))).toMatch(/foods_medida_chk/)
    expect(await fallo(insertar('foods', { ...alimento, category: largo(41) }))).toMatch(/foods_categoria_chk/)
    expect(await fallo(insertar('foods', { ...alimento, category: '' }))).toMatch(/foods_categoria_chk/)
    const propia = { owner: ANA, name: 'Tarta' }
    expect(await fallo(insertar('recipes', { ...propia, meal_types: '{almuerzo,cena}' }))).toBeNull()
    expect(await fallo(insertar('recipes', { ...propia, slug: 'tarta' }))).toMatch(/recipes_slug_chk/)
    expect(await fallo(insertar('recipes', { ...propia, meal_types: '{brunch}' }))).toMatch(/recipes_comidas_chk/)
    expect(await fallo(insertar('recipes', { ...propia, meal_types: '{cena,cena,cena,cena,cena}' }))).toMatch(/recipes_comidas_chk/)
  })
})

test('ninguna fila pesa de más: un número con miles de decimales no entra aunque esté dentro del rango', async () => {
  const enorme = '0.' + '1234'.repeat(1000)
  await como(ANA, async () => {
    expect(await fallo(insertar('log_entries', registro({ protein: enorme })))).toMatch(/log_entries_(peso_fila|decimales)_chk/)
    expect(await fallo(insertar('stock', { user_id: ANA, food_id: id.huevo, qty: enorme }))).toMatch(/stock_(peso_fila|decimales)_chk/)
    expect(await fallo(insertar('shopping_items', { user_id: ANA, food_id: id.huevo, qty: '1' + enorme.slice(1) }))).toMatch(/shopping/)
    // Con 39 decimales (dentro del tope de decimales) en cada número, igual pesa de más
    const largo39 = '0.' + '123456789'.repeat(4) + '123'
    expect(
      await fallo(
        insertar(
          'log_entries',
          registro({ name: 'ñ'.repeat(120), qty: largo39, kcal: largo39, protein: largo39, carbs: largo39, fat: largo39 }),
        ),
      ),
    ).toBeNull()
    expect(
      await fallo(
        insertar(
          'log_entries',
          registro({ name: '🍎'.repeat(120), qty: largo39, kcal: largo39, protein: largo39, carbs: largo39, fat: largo39 }),
        ),
      ),
    ).toMatch(/log_entries_peso_fila_chk/)
    expect(await fallo(insertar('measurements', { user_id: ANA, date: '2026-10-03', weight_kg: '70' + enorme.slice(1) }))).toMatch(
      /measurements_(peso_fila|decimales)_chk/,
    )
    // Lo normal entra, con decimales y todo
    expect(await fallo(insertar('stock', { user_id: ANA, food_id: id.huevo, qty: 12.25 }))).toBeNull()
    expect(await fallo(insertar('log_entries', registro({ name: 'ñ'.repeat(120), protein: 12.345, carbs: 45.5, fat: 9.99 })))).toBeNull()
  })
  // Una receta con los pasos al máximo (5000 caracteres, también con letras que ocupan más) sigue entrando
  await como(ANA, async () => {
    expect(await fallo(insertar('recipes', { owner: ANA, name: 'ñ'.repeat(80), steps: 'ñ'.repeat(5000) }))).toBeNull()
  })
})

test('tope de filas: ingredientes por receta', async () => {
  const [propia] = await como(ANA, () => insertar('recipes', { owner: ANA, name: 'Guiso de todo' }))
  const alimentos = (await filas('select id from public.foods where owner is null order by id limit 61')).map((f) => f.id)
  await como(ANA, async () => {
    const alta = (ids) =>
      filas('insert into public.recipe_items (recipe_id, food_id, qty) select $1, x::uuid, 10 from unnest($2::text[]) x', [propia.id, ids])
    expect(await fallo(alta(alimentos.slice(0, 60)))).toBeNull()
    expect(await fallo(alta(alimentos.slice(60)))).toBe('Llegaste al máximo de ingredientes por receta que se pueden guardar (60).')
    // De una sola vez tampoco
    await filas('delete from public.recipe_items where recipe_id = $1', [propia.id])
    expect(await fallo(alta(alimentos))).toMatch(/máximo de ingredientes/)
    expect((await filas('select 1 from public.recipe_items where recipe_id = $1', [propia.id])).length).toBe(0)
    // Ni cargándolos en otra receta y pasándolos después a esta
    expect(await fallo(alta(alimentos.slice(0, 60)))).toBeNull()
    const [otra] = await insertar('recipes', { owner: ANA, name: 'Receta de paso' })
    await filas('insert into public.recipe_items (recipe_id, food_id, qty) values ($1, $2, 10)', [otra.id, alimentos[60]])
    expect(await fallo(filas('update public.recipe_items set recipe_id = $1 where recipe_id = $2', [propia.id, otra.id]))).toMatch(
      /máximo de ingredientes/,
    )
    // Cambiar una cantidad, en cambio, sigue andando con la receta llena
    expect(await fallo(filas('update public.recipe_items set qty = 25 where recipe_id = $1', [propia.id]))).toBeNull()
    // Y guardar la receta desde la app (que reemplaza los ingredientes) también
    const items = alimentos.slice(0, 60).map((food_id) => ({ food_id, qty: 5 }))
    expect(await fallo(rpc('guardar_receta', [propia.id, j({ name: 'Guiso de todo', minutes: 30, servings: 4 }), j(items)]))).toBeNull()
    expect((await filas('select 1 from public.recipe_items where recipe_id = $1', [propia.id])).length).toBe(60)
  })
})

test('números: ni enormes ni con infinitos decimales, aunque guardados ocupen poco', async () => {
  await como(ANA, async () => {
    // Un 1 seguido de cien mil ceros ocupa unos pocos bytes en la base, pero son cien mil letras cada vez que se lee
    const gigante = '1e100000'
    expect(await fallo(insertar('log_entries', registro({ qty: gigante })))).toMatch(/log_entries_maximos_chk/)
    expect(await fallo(insertar('log_entries', registro({ protein: gigante })))).toMatch(/log_entries_maximos_chk/)
    expect(await fallo(insertar('foods', { owner: ANA, name: 'Raro', unit: 'g', kcal: 100, unit_grams: gigante }))).toMatch(
      /foods_gramos_chk/,
    )
    // Lo mismo para el otro lado: cero coma, miles de ceros y un uno
    const infimo = '0.' + '0'.repeat(5000) + '1'
    expect(await fallo(insertar('log_entries', registro({ fat: infimo })))).toMatch(/log_entries_decimales_chk/)
    expect(await fallo(insertar('stock', { user_id: ANA, food_id: id.arroz, qty: infimo }))).toMatch(/stock_decimales_chk/)
    expect(await fallo(insertar('purchases', { user_id: ANA, name: 'Pan', qty: 1, price: '10' + infimo.slice(1) }))).toMatch(
      /purchases_decimales_chk/,
    )
    // Los números que salen de las cuentas del teléfono (con sus decimales de más) entran
    expect(
      await fallo(insertar('log_entries', registro({ qty: 0.1 + 0.2, kcal: '12.345600000000001', protein: '1.2345678901234567e-7' }))),
    ).toBeNull()
  })
})

test('análisis con IA: la fecha la pone la base y hay un máximo por día y en total', async () => {
  const analisis = (extra = {}) => ({ user_id: ANA, week_start: '2026-09-28', content: j({ resumen: 'ok' }), model: 'modelo', ...extra })
  await como(ANA, async () => {
    // Con fecha vieja (para que la función que los pide no los cuente como de hoy): se guarda con la fecha de ahora
    const [guardado] = await insertar('ai_analyses', analisis({ created_at: '2020-01-06T00:00:00Z' }))
    expect(Date.now() - new Date(guardado.created_at).getTime()).toBeLessThan(60000)
    for (let i = 0; i < 9; i++) await insertar('ai_analyses', analisis())
    expect(await fallo(insertar('ai_analyses', analisis()))).toBe('Ya se guardaron muchos análisis hoy. Probá de nuevo mañana.')
  })
  // El contenido tampoco puede esconder números enormes: guardados ocupan poco, pero al leerlos serían millones de letras
  expect(
    await como(BETO, () =>
      fallo(
        filas(`insert into public.ai_analyses (user_id, week_start, content) values ($1, '2026-09-28', $2::jsonb)`, [BETO, '[1e100000]']),
      ),
    ),
  ).toMatch(/ai_analyses_texto_chk/)
  // El máximo en total (los de días anteriores se cargan acá como administrador, que es quien puede poner la fecha)
  await filas(
    `insert into public.ai_analyses (user_id, week_start, content, created_at)
     select $1, '2026-01-05', '{}', now() - interval '30 days' from generate_series(1, 500)`,
    [BETO],
  )
  expect((await una(`select count(*)::int as n from public.ai_analyses where created_at < now() - interval '29 days'`)).n).toBe(500)
  expect(await como(BETO, () => fallo(insertar('ai_analyses', analisis({ user_id: BETO }))))).toMatch(/máximo de análisis/)
})

test('tope de filas: registros, alimentos propios y claves de pedidos, por usuario', async () => {
  await como(BETO, async () => {
    // Los registros de Beto: hasta el tope entran, uno más no. El aviso sale con el código de los mensajes escritos a mano.
    await filas(
      `insert into public.log_entries (user_id, date, meal, name, qty, kcal)
       select $1, '2026-01-01'::date + (n % 300), 'extra', 'Agua', 1, 0 from generate_series(1, 30000) n`,
      [BETO],
    )
    const error = await filas(`insert into public.log_entries (user_id, date, meal, name) values ($1, '2026-10-03', 'cena', 'Uno más')`, [
      BETO,
    ]).then(
      () => null,
      (e) => e,
    )
    expect(error.message).toBe('Llegaste al máximo de registros que se pueden guardar (30000).')
    expect(error.code).toBe('P0001')
    // Registrar una comida desde la app da el mismo aviso y no deja nada a medias
    const stockAntes = await filas('select * from public.stock where user_id = $1', [BETO])
    expect(
      await fallo(
        rpc('registrar_comida', [
          '2026-10-03',
          'cena',
          j([{ name: 'Huevo', food_id: id.huevo, qty: 1, kcal: 70, protein: 6, carbs: 0, fat: 5 }]),
          j([{ food_id: id.huevo, delta: -1 }]),
          null,
          null,
        ]),
      ),
    ).toMatch(/máximo de registros/)
    expect(await filas('select * from public.stock where user_id = $1', [BETO])).toEqual(stockAntes)
    // Borrando alguno, vuelve a entrar
    await filas(`delete from public.log_entries where id in (select id from public.log_entries where user_id = $1 limit 5)`, [BETO])
    expect(await fallo(insertar('log_entries', registro({ user_id: BETO })))).toBeNull()

    await filas(
      `insert into public.foods (owner, name, unit, kcal) select $1, 'Producto ' || n, 'g', 100 from generate_series(1, 1000) n`,
      [BETO],
    )
    expect(await fallo(insertar('foods', { owner: BETO, name: 'Uno más', unit: 'g', kcal: 100 }))).toMatch(/máximo de alimentos propios/)

    await filas('insert into public.operaciones (user_id, clave) select $1, gen_random_uuid() from generate_series(1, 2000)', [BETO])
    expect(await fallo(insertar('operaciones', { user_id: BETO, clave: '00000000-0000-0000-0000-0000000000c1' }))).toMatch(
      /máximo de pedidos seguidos/,
    )
  })
  // El tope de uno no le cuenta al otro
  await como(ANA, async () => {
    expect(await fallo(insertar('log_entries', registro()))).toBeNull()
    expect(await fallo(insertar('foods', { owner: ANA, name: 'Otro producto', unit: 'g', kcal: 100 }))).toBeNull()
  })
}, 120000)

test('lo que carga el administrador (alimentos y recetas base) no tiene tope de filas', async () => {
  // Sin sesión de usuario: es el rol con el que se corren los archivos .sql
  expect(
    await fallo(
      filas(
        `insert into public.foods (slug, name, unit, kcal) select 'base-' || n, 'Base ' || n, 'g', 100 from generate_series(1, 2500) n`,
      ),
    ),
  ).toBeNull()
  expect(receta).toBeTruthy()
})

// La base de datos de verdad: arma un Postgres en memoria, le aplica los mismos archivos .sql que tiene Supabase
// (schema, actualizaciones y datos base) y prueba las funciones y los permisos entrando como un usuario común.
import { beforeAll, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo, j } from './postgres.js'

let db
let id // slug -> id de los alimentos base
let receta // slug -> id de las recetas base
let como, filas, una, rpc, stockDe

beforeAll(async () => {
  ;({ db, id, receta, como, filas, una, rpc, stockDe } = await abrirBase())
}, 60000)

test('la base se arma desde cero con los archivos del repo', async () => {
  const n = await una(
    'select (select count(*) from public.foods)::int as alimentos, (select count(*) from public.recipes)::int as recetas, (select count(*) from public.recipe_items)::int as items',
  )
  expect(n).toEqual({ alimentos: 274, recetas: 88, items: 368 })
})

test('stock por diferencias: suma, resta, nunca baja de cero y junta los repetidos', async () => {
  await como(ANA, async () => {
    await filas('select * from public.mover_stock($1)', [
      j([
        { food_id: id.huevo, delta: 12 },
        { food_id: id.arroz, delta: 1000 },
      ]),
    ])
    await filas('select * from public.mover_stock($1)', [
      j([
        { food_id: id.huevo, delta: -2 },
        { food_id: id.huevo, delta: -1 },
      ]),
    ])
    const devueltas = await filas('select * from public.mover_stock($1)', [j([{ food_id: id.arroz, delta: -5000 }])])
    expect(devueltas.map((s) => Number(s.qty))).toEqual([0])
  })
  expect(await stockDe(ANA)).toEqual({ huevo: 9, arroz: 0 })
})

test('stock: "solo si existe" no agrega a la despensa lo que no estaba', async () => {
  await como(ANA, async () => {
    const tocadas = await filas('select * from public.mover_stock($1, true)', [
      j([
        { food_id: id.banana, delta: -1 },
        { food_id: id.huevo, delta: -1 },
      ]),
    ])
    expect(tocadas.length).toBe(1)
  })
  expect(await stockDe(ANA)).toEqual({ huevo: 8, arroz: 0 })
})

test('dos teléfonos a la vez: los dos descuentos cuentan (antes el segundo pisaba al primero)', async () => {
  await como(ANA, () => filas('select * from public.mover_stock($1)', [j([{ food_id: id.leche, delta: 1000 }])]))
  // Los dos tienen en pantalla "1000 ml". Uno gasta 200 y el otro 300.
  await como(ANA, () => filas('select * from public.mover_stock($1)', [j([{ food_id: id.leche, delta: -200 }])]))
  await como(ANA, () => filas('select * from public.mover_stock($1)', [j([{ food_id: id.leche, delta: -300 }])]))
  expect((await stockDe(ANA)).leche).toBe(500)
})

test('cocinar: descuenta los ingredientes y suma comida lista, todo junto', async () => {
  const r = await como(ANA, () =>
    rpc('cocinar', [
      receta['desayuno-avena'],
      2,
      j([
        { food_id: id.leche, delta: -400 },
        { food_id: id.avena, delta: -80 },
      ]),
    ]),
  )
  expect(Number(r.preparado.portions)).toBe(2)
  expect(r.stock.map((s) => Number(s.qty)).sort((a, b) => a - b)).toEqual([0, 100])
  await como(ANA, () => rpc('cocinar', [receta['desayuno-avena'], 1.5, j([])]))
  expect(await una('select portions::float from public.prepared where user_id = $1', [ANA])).toEqual({ portions: 3.5 })
  expect((await stockDe(ANA)).leche).toBe(100)
})

test('cocinar: si algo falla no queda a medias', async () => {
  const antes = await stockDe(ANA)
  const inexistente = '11111111-1111-1111-1111-111111111111'
  // Un ingrediente que no existe: no se descuenta el otro ni se suman las porciones
  expect(
    await como(ANA, () =>
      fallo(
        rpc('cocinar', [
          receta['desayuno-avena'],
          1,
          j([
            { food_id: id.huevo, delta: -3 },
            { food_id: inexistente, delta: -1 },
          ]),
        ]),
      ),
    ),
  ).toBeTruthy()
  expect(await como(ANA, () => fallo(rpc('cocinar', [receta['desayuno-avena'], 0, j([{ food_id: id.huevo, delta: -3 }])])))).toContain(
    'porciones',
  )
  // Una receta que no existe: el stock que ya se había descontado vuelve atrás
  expect(await como(ANA, () => fallo(rpc('cocinar', [inexistente, 1, j([{ food_id: id.huevo, delta: -3 }])])))).toBeTruthy()
  expect(await stockDe(ANA)).toEqual(antes)
  expect(await una('select portions::float from public.prepared where user_id = $1', [ANA])).toEqual({ portions: 3.5 })
})

test('registrar: saca el "no comí", guarda, descuenta el stock que hay y la comida lista', async () => {
  await db.query(
    `insert into public.log_entries (user_id, date, meal, name, qty, skipped) values ($1, '2026-10-03', 'almuerzo', 'No comí', 0, true), ($1, '2026-10-03', 'cena', 'No comí', 0, true)`,
    [ANA],
  )
  const filasNuevas = [
    { name: 'Avena con leche y banana', recipe_id: receta['desayuno-avena'], qty: 1, kcal: 350, protein: 14, carbs: 55, fat: 8 },
    { name: 'Huevo', food_id: id.huevo, qty: 2, kcal: 150, protein: 12, carbs: 1, fat: 10 },
    { name: 'Banana', food_id: id.banana, qty: 1, kcal: 90 },
  ]
  const r = await como(ANA, () =>
    rpc('registrar_comida', [
      '2026-10-03',
      'almuerzo',
      j(filasNuevas),
      j([
        { food_id: id.huevo, delta: -2 },
        { food_id: id.banana, delta: -1 },
      ]),
      j([{ recipe_id: receta['desayuno-avena'], delta: -1 }]),
    ]),
  )
  expect(r.registros.map((x) => x.name)).toEqual(filasNuevas.map((x) => x.name))
  expect(r.registros.every((x) => x.user_id === ANA && x.meal === 'almuerzo' && x.skipped === false)).toBe(true)
  expect(r.registros[2]).toMatchObject({ protein: 0, carbs: 0, fat: 0 })
  expect(r.stock.length).toBe(1) // la banana no estaba en la despensa: no se agrega en cero
  expect(Number(r.preparado[0].portions)).toBe(2.5)
  const dia = await filas(
    `select meal, name, skipped from public.log_entries where user_id = $1 and date = '2026-10-03' order by meal, name`,
    [ANA],
  )
  expect(dia.filter((x) => x.meal === 'almuerzo').map((x) => x.skipped)).toEqual([false, false, false])
  expect(dia.filter((x) => x.meal === 'cena')).toEqual([{ meal: 'cena', name: 'No comí', skipped: true }]) // la otra comida no se toca
  expect((await stockDe(ANA)).huevo).toBe(6)
})

test('registrar: si algo falla no queda a medias (ni se pierde el "no comí")', async () => {
  const cuenta = () =>
    una(`select count(*)::int as n, count(*) filter (where skipped)::int as salteadas from public.log_entries where user_id = $1`, [ANA])
  const antes = await cuenta()
  const stock = await stockDe(ANA)
  // Calorías imposibles en la segunda fila: no entra ninguna, y la marca de "no comí" de la cena sigue
  const malas = [
    { name: 'Huevo', food_id: id.huevo, qty: 1, kcal: 75 },
    { name: 'Cosa rara', qty: 1, kcal: 999999 },
  ]
  expect(
    await como(ANA, () => fallo(rpc('registrar_comida', ['2026-10-03', 'cena', j(malas), j([{ food_id: id.huevo, delta: -1 }]), j([])]))),
  ).toBeTruthy()
  expect(await como(ANA, () => fallo(rpc('registrar_comida', ['2026-10-03', 'cena', j([]), j([]), j([])])))).toContain(
    'nada para registrar',
  )
  expect(await como(ANA, () => fallo(rpc('registrar_comida', ['2026-10-03', 'brunch', j([malas[0]]), j([]), j([])])))).toBeTruthy()
  expect(await cuenta()).toEqual(antes)
  expect(await stockDe(ANA)).toEqual(stock)
})

test('comprar: guarda el gasto, suma al stock y saca de la lista lo que estaba anotado', async () => {
  await db.query('insert into public.shopping_items (user_id, food_id, qty) values ($1, $2, 1), ($1, $3, 2)', [ANA, id.aceite, id.arroz])
  const girasol = (
    await una(
      `insert into public.foods (owner, name, unit, kcal, same_as) values ($1, 'Aceite girasol Natura', 'ml', 800, $2) returning id`,
      [ANA, id.aceite],
    )
  ).id
  // Se compró el producto de marca, pero en la lista figuraba "Aceite"
  const r = await como(ANA, () => rpc('comprar', [girasol, 900, 3200, '2026-10-03', id.aceite]))
  expect(r.compra).toMatchObject({ name: 'Aceite girasol Natura', qty: 900, price: 3200, date: '2026-10-03', user_id: ANA })
  expect(Number(r.stock[0].qty)).toBe(900)
  expect(r.lista).toBeTruthy()
  expect(
    (await filas('select f.slug from public.shopping_items l join public.foods f on f.id = l.food_id where l.user_id = $1', [ANA])).map(
      (x) => x.slug,
    ),
  ).toEqual(['arroz'])
  // Sin "anotado" saca el mismo alimento; si no estaba en la lista, no pasa nada
  const r2 = await como(ANA, () => rpc('comprar', [id.arroz, 1000, null, '2026-10-03', null]))
  expect(Number(r2.compra.price)).toBe(0)
  const r3 = await como(ANA, () => rpc('comprar', [id.arroz, 500, 100, '2026-10-03', null]))
  expect(r3.lista).toBeNull()
  expect((await stockDe(ANA)).arroz).toBe(1500)
})

test('comprar: si algo falla no queda a medias', async () => {
  const cuenta = () =>
    una(
      'select (select count(*) from public.purchases where user_id = $1)::int as compras, (select count(*) from public.shopping_items where user_id = $1)::int as lista',
      [ANA],
    )
  await db.query('insert into public.shopping_items (user_id, food_id, qty) values ($1, $2, 1)', [ANA, id.huevo])
  const antes = await cuenta()
  const stock = await stockDe(ANA)
  expect(await como(ANA, () => fallo(rpc('comprar', [id.huevo, 0, 100, '2026-10-03', null])))).toBeTruthy() // cantidad cero
  expect(await como(ANA, () => fallo(rpc('comprar', ['11111111-1111-1111-1111-111111111111', 1, 100, '2026-10-03', null])))).toContain(
    'ya no existe',
  )
  expect(await cuenta()).toEqual(antes)
  expect(await stockDe(ANA)).toEqual(stock)
})

test('guardar receta: crea y edita con sus ingredientes; si falla, la receta queda como estaba', async () => {
  const datos = { name: 'Arroz con huevo', minutes: 20, servings: 2, meal_types: ['almuerzo', 'cena'], portable: true, steps: 'Hervir.' }
  const creada = await como(ANA, () =>
    rpc('guardar_receta', [
      null,
      j(datos),
      j([
        { food_id: id.arroz, qty: 160 },
        { food_id: id.huevo, qty: 2 },
      ]),
    ]),
  )
  expect(creada.receta).toMatchObject({ ...datos, owner: ANA, slug: null })
  expect(creada.items.length).toBe(2)
  const rid = creada.receta.id
  const editada = await como(ANA, () =>
    rpc('guardar_receta', [
      rid,
      j({ ...datos, name: 'Arroz con huevo y atún', servings: 3 }),
      j([
        { food_id: id.arroz, qty: 200 },
        { food_id: id['atun-natural'], qty: 1 },
      ]),
    ]),
  )
  expect(editada.receta).toMatchObject({ id: rid, name: 'Arroz con huevo y atún', servings: 3 })
  const items = () =>
    filas(
      'select f.slug, i.qty::float from public.recipe_items i join public.foods f on f.id = i.food_id where i.recipe_id = $1 order by f.slug',
      [rid],
    )
  expect(await items()).toEqual([
    { slug: 'arroz', qty: 200 },
    { slug: 'atun-natural', qty: 1 },
  ])
  // Un ingrediente con cantidad cero: antes se borraban los ingredientes y la receta quedaba vacía
  expect(
    await como(ANA, () =>
      fallo(
        rpc('guardar_receta', [
          rid,
          j({ ...datos, name: 'Rota' }),
          j([
            { food_id: id.arroz, qty: 100 },
            { food_id: id.huevo, qty: 0 },
          ]),
        ]),
      ),
    ),
  ).toBeTruthy()
  expect(await como(ANA, () => fallo(rpc('guardar_receta', [rid, j(datos), j([])])))).toContain('al menos un ingrediente')
  expect(await items()).toEqual([
    { slug: 'arroz', qty: 200 },
    { slug: 'atun-natural', qty: 1 },
  ])
  expect((await una('select name from public.recipes where id = $1', [rid])).name).toBe('Arroz con huevo y atún')
  // Nadie más puede editarla, y las recetas base no se tocan
  expect(await como(BETO, () => fallo(rpc('guardar_receta', [rid, j(datos), j([{ food_id: id.arroz, qty: 1 }])])))).toContain(
    'no se puede editar',
  )
  expect(
    await como(ANA, () => fallo(rpc('guardar_receta', [receta['desayuno-avena'], j(datos), j([{ food_id: id.arroz, qty: 1 }])]))),
  ).toContain('no se puede editar')
  expect(
    (await una('select count(*)::int as n from public.recipe_items where recipe_id = $1', [receta['desayuno-avena']])).n,
  ).toBeGreaterThan(0)
})

test('el mismo pedido dos veces se aplica una sola (cuando se corta la conexión y la persona toca de nuevo)', async () => {
  const [C1, C2, C3, C4] = [1, 2, 3, 4].map((n) => `00000000-0000-4000-8000-00000000000${n}`)
  const estado = async () => ({
    stock: await stockDe(ANA),
    ...(await una(
      `select (select coalesce(sum(portions), 0) from public.prepared where user_id = $1)::float as listas,
      (select count(*) from public.log_entries where user_id = $1)::int as registros,
      (select count(*) from public.purchases where user_id = $1)::int as compras`,
      [ANA],
    )),
  })
  await como(ANA, () => filas('select * from public.mover_stock($1)', [j([{ food_id: id.huevo, delta: 12 }])]))

  // Cocinar: el segundo pedido con la misma clave no descuenta ni suma nada, y avisa que ya estaba hecho
  const antes = await estado()
  const r1 = await como(ANA, () => rpc('cocinar', [receta['desayuno-avena'], 1, j([{ food_id: id.huevo, delta: -2 }]), C1]))
  expect(r1.repetida).toBeUndefined()
  const hecho = await estado()
  expect(hecho.stock.huevo).toBe(antes.stock.huevo - 2)
  expect(hecho.listas).toBe(antes.listas + 1)
  expect(await como(ANA, () => rpc('cocinar', [receta['desayuno-avena'], 1, j([{ food_id: id.huevo, delta: -2 }]), C1]))).toEqual({
    repetida: true,
  })
  expect(await estado()).toEqual(hecho)
  // Con otra clave (cocinó de nuevo de verdad) o sin clave, sí cuenta
  await como(ANA, () => rpc('cocinar', [receta['desayuno-avena'], 1, j([{ food_id: id.huevo, delta: -2 }]), C2]))
  await como(ANA, () => rpc('cocinar', [receta['desayuno-avena'], 1, j([{ food_id: id.huevo, delta: -2 }])]))
  expect((await estado()).stock.huevo).toBe(antes.stock.huevo - 6)

  // Si el primer intento falló, no se aplicó nada y la clave no quedó gastada: el reintento entra
  const base = await estado()
  expect(await como(ANA, () => fallo(rpc('comprar', [id.huevo, 0, 100, '2026-10-03', null, C3])))).toBeTruthy()
  expect(await estado()).toEqual(base)
  expect((await como(ANA, () => rpc('comprar', [id.huevo, 6, 100, '2026-10-03', null, C3]))).compra).toBeTruthy()
  expect(await como(ANA, () => rpc('comprar', [id.huevo, 6, 100, '2026-10-03', null, C3]))).toEqual({ repetida: true })
  expect(await estado()).toMatchObject({ compras: base.compras + 1, stock: { huevo: base.stock.huevo + 6 } })

  // Registrar una comida, igual
  const fila = [{ name: 'Huevo', food_id: id.huevo, qty: 1, kcal: 78, protein: 6, carbs: 1, fat: 5 }]
  const args = ['2026-10-02', 'cena', j(fila), j([{ food_id: id.huevo, delta: -1 }]), j([]), C4]
  expect((await como(ANA, () => rpc('registrar_comida', args))).registros.length).toBe(1)
  const registrado = await estado()
  expect(await como(ANA, () => rpc('registrar_comida', args))).toEqual({ repetida: true })
  expect(await estado()).toEqual(registrado)

  // Las claves son de cada uno: la misma clave en otra cuenta es otro pedido, y nadie ve las ajenas
  expect((await como(BETO, () => rpc('cocinar', [receta['desayuno-avena'], 1, j([]), C1]))).repetida).toBeUndefined()
  expect((await como(BETO, () => filas('select clave from public.operaciones'))).map((o) => o.clave)).toEqual([C1])
  expect(await como(null, () => fallo(filas('select * from public.operaciones')))).toContain('permission denied')
  // Las de más de una semana se limpian solas
  await db.query(`update public.operaciones set created_at = now() - interval '8 days' where user_id = $1 and clave = $2`, [ANA, C1])
  await como(ANA, () => rpc('cocinar', [receta['desayuno-avena'], 1, j([]), '00000000-0000-4000-8000-000000000009']))
  expect((await una('select count(*)::int as n from public.operaciones where user_id = $1 and clave = $2', [ANA, C1])).n).toBe(0)
})

test('cantidades que no son números de verdad no pasan, y los avisos salen con su propio código', async () => {
  const stock = await stockDe(ANA)
  const listas = () => una('select coalesce(sum(portions), 0)::float as n from public.prepared where user_id = $1', [ANA])
  const antes = await listas()
  for (const delta of ['NaN', 'Infinity', '-Infinity', 2000000]) {
    expect(
      await como(ANA, () => fallo(filas('select * from public.mover_stock($1)', [j([{ food_id: id.huevo, delta }])]))),
      String(delta),
    ).toContain('no es válida')
  }
  expect(await stockDe(ANA)).toEqual(stock)
  // Una diferencia vacía o rara en la comida lista no la deja en cero
  const fila = [{ name: 'Huevo', food_id: id.huevo, qty: 1, kcal: 78 }]
  for (const delta of [null, 'NaN', undefined]) {
    await como(ANA, () =>
      rpc('registrar_comida', ['2026-10-01', 'cena', j(fila), j([]), j([{ recipe_id: receta['desayuno-avena'], delta }])]),
    )
  }
  expect(await listas()).toEqual(antes)
  expect(await como(ANA, () => fallo(rpc('cocinar', [receta['desayuno-avena'], 0.04, j([])])))).toContain('porciones')
  // El código P0001 es el de los mensajes escritos a mano: la app lo usa para saber que es un aviso y no una falla
  const codigo = await como(ANA, () =>
    rpc('cocinar', [receta['desayuno-avena'], 0, j([])]).then(
      () => null,
      (e) => e.code,
    ),
  )
  expect(codigo).toBe('P0001')
})

test('cada usuario ve y mueve solo lo suyo; sin sesión no se puede nada', async () => {
  expect(await como(BETO, () => filas('select * from public.stock'))).toEqual([])
  expect(await como(BETO, () => filas('select * from public.log_entries'))).toEqual([])
  const deAna = await stockDe(ANA)
  await como(BETO, () => filas('select * from public.mover_stock($1)', [j([{ food_id: id.huevo, delta: 3 }])]))
  expect(await stockDe(BETO)).toEqual({ huevo: 3 })
  expect(await stockDe(ANA)).toEqual(deAna)
  // El producto propio de Ana no existe para Beto
  const girasol = (await una(`select id from public.foods where owner = $1`, [ANA])).id
  expect(await como(BETO, () => fallo(rpc('comprar', [girasol, 1, 1, '2026-10-03', null])))).toContain('ya no existe')
  for (const llamada of [
    `public.mover_stock('[]')`,
    `public.cocinar(null, 1, '[]')`,
    `public.registrar_comida(current_date, 'cena', '[]')`,
    `public.comprar(null, 1, 1, current_date)`,
    `public.guardar_receta(null, '{}', '[]')`,
    `public.pedido_repetido(gen_random_uuid())`,
  ]) {
    expect(await como(null, () => fallo(filas('select ' + llamada))), llamada).toContain('permission denied')
  }
})

test('eventos: cada uno agrega y lee lo suyo; nadie modifica ni borra', async () => {
  await como(ANA, () =>
    db.query(
      `insert into public.eventos (tipo, nombre, detalle, version, ruta) values ('error', 'pantalla', '{"mensaje": "x is not a function"}', '1.7.0', '/despensa')`,
    ),
  )
  await como(BETO, () => db.query(`insert into public.eventos (tipo, nombre) values ('evento', 'off_busqueda')`))
  expect(await como(ANA, () => filas('select user_id, nombre from public.eventos'))).toEqual([{ user_id: ANA, nombre: 'pantalla' }])
  // A nombre de otro, con un tipo inventado o con un detalle enorme: no entra
  expect(
    await como(BETO, () => fallo(db.query(`insert into public.eventos (user_id, tipo, nombre) values ($1, 'error', 'x')`, [ANA]))),
  ).toContain('row-level security')
  expect(await como(ANA, () => fallo(db.query(`insert into public.eventos (tipo, nombre) values ('otro', 'x')`)))).toBeTruthy()
  expect(
    await como(ANA, () =>
      fallo(db.query(`insert into public.eventos (tipo, nombre, detalle) values ('error', 'x', $1)`, [j({ t: 'a'.repeat(5000) })])),
    ),
  ).toBeTruthy()
  expect(await como(ANA, () => fallo(db.query(`update public.eventos set nombre = 'otro'`)))).toContain('permission denied')
  expect(await como(ANA, () => fallo(db.query(`delete from public.eventos`)))).toContain('permission denied')
  expect(await como(null, () => fallo(db.query(`insert into public.eventos (tipo, nombre) values ('error', 'x')`)))).toContain(
    'permission denied',
  )
  expect((await una('select count(*)::int as n from public.eventos')).n).toBe(2)
})

test('eventos: tope de 100 por usuario por día (70 para los comunes) y limpieza a los 90 días', async () => {
  // Uno viejo de Ana, puesto a mano con fecha de hace 100 días (el disparador pisa la fecha, así que se corrige después)
  await db.exec(`alter table public.eventos disable trigger eventos_antes`)
  await db.query(
    `insert into public.eventos (user_id, tipo, nombre, created_at) values ($1, 'evento', 'viejo', now() - interval '100 days')`,
    [ANA],
  )
  await db.exec(`alter table public.eventos enable trigger eventos_antes`)
  expect((await una(`select count(*)::int as n from public.eventos where nombre = 'viejo'`)).n).toBe(1)
  // Los eventos comunes cortan en 70: aunque haya muchas búsquedas, queda lugar para los errores
  await como(BETO, () => db.query(`insert into public.eventos (tipo, nombre) select 'evento', 'ruido' from generate_series(1, 350)`))
  expect((await una(`select count(*)::int as n from public.eventos where user_id = $1`, [BETO])).n).toBe(70)
  expect((await una(`select count(*)::int as n from public.eventos where nombre = 'viejo'`)).n).toBe(0)
  await como(BETO, () => db.query(`insert into public.eventos (tipo, nombre) select 'error', 'pantalla' from generate_series(1, 150)`))
  expect(
    await una(
      `select count(*)::int as n, (count(*) filter (where tipo = 'error'))::int as errores from public.eventos where user_id = $1`,
      [BETO],
    ),
  ).toEqual({ n: 100, errores: 30 })
  // El tope de uno no le saca lugar al otro
  await como(ANA, () => db.query(`insert into public.eventos (tipo, nombre) values ('evento', 'sigue andando')`))
  expect((await una('select count(*)::int as n from public.eventos where user_id = $1', [ANA])).n).toBe(2)
})

test('al borrar la cuenta se va todo lo del usuario, y nada de los demás', async () => {
  expect((await una('select count(*)::int as n from public.operaciones where user_id = $1', [BETO])).n).toBeGreaterThan(0)
  await como(BETO, () => filas('select public.borrar_mi_cuenta()'))
  expect(
    await una(
      'select (select count(*) from public.stock where user_id = $1)::int as stock, (select count(*) from public.eventos where user_id = $1)::int as eventos, (select count(*) from public.operaciones where user_id = $1)::int as operaciones',
      [BETO],
    ),
  ).toEqual({ stock: 0, eventos: 0, operaciones: 0 })
  expect((await una('select count(*)::int as n from public.stock where user_id = $1', [ANA])).n).toBeGreaterThan(0)
  expect((await una('select count(*)::int as n from public.foods where owner is null')).n).toBe(274)
})

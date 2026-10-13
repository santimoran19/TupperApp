// Sin conexión, la app hace en el teléfono la cuenta que después hace la base cuando el cambio llega (store/cambios.js).
// Acá se comprueba que las dos den lo mismo: se arranca del mismo estado, se aplica el cambio de las dos formas
// (LOCAL en la copia, la función de verdad en un Postgres) y se compara cómo quedó cada una.
import { beforeAll, expect, test } from 'vitest'
import { GUARDADO, LOCAL } from '../../src/store/cambios.js'
import { abrirBase, ANA, j } from './postgres.js'

let db, id, receta, como, filas, rpc

beforeAll(async () => {
  ;({ db, id, receta, como, filas, rpc } = await abrirBase())
}, 60000)

// El estado de Ana como lo tiene la app: las tablas tal cual
async function estado() {
  // Las fechas van como texto (AAAA-MM-DD), que es como le llegan a la app
  const de = async (tabla, orden) =>
    (await filas(`select * from public.${tabla} where user_id = $1 order by ${orden}`, [ANA])).map((x) =>
      x.date instanceof Date ? { ...x, date: x.date.toISOString().slice(0, 10) } : x,
    )
  return {
    stock: await de('stock', 'food_id'),
    preparado: await de('prepared', 'recipe_id'),
    registros: await de('log_entries', 'created_at, id'),
    lista: await de('shopping_items', 'food_id'),
    compras: await de('purchases', 'id'),
  }
}

// Lo que importa comparar, sin lo que pone la base por su cuenta (identificadores, horas) y con los números como números
const n = (v) => Number(v)
// Lo que descontó un registro, en un texto igual para la copia y para la base
const descontado = (r) =>
  r.descontado
    ? JSON.stringify({ s: [...r.descontado.s].map((x) => [x.f, n(x.q), n(x.n)]).sort(), p: n(r.descontado.p), pn: n(r.descontado.pn) })
    : 'sin dato'
function comparable(s) {
  const porClave = (lista, clave, valor) => Object.fromEntries(lista.map((x) => [x[clave], n(x[valor])]).sort())
  return {
    stock: porClave(s.stock, 'food_id', 'qty'),
    preparado: porClave(s.preparado, 'recipe_id', 'portions'),
    registros: s.registros
      .map((r) =>
        [
          r.date,
          r.meal,
          r.name,
          r.food_id,
          r.recipe_id,
          n(r.qty),
          n(r.kcal),
          n(r.protein),
          n(r.carbs),
          n(r.fat),
          r.skipped,
          descontado(r),
        ].join('|'),
      )
      .sort(),
    lista: porClave(s.lista, 'food_id', 'qty'),
    compras: s.compras.map((c) => [c.food_id, c.name, n(c.qty), n(c.price), c.date].join('|')).sort(),
  }
}

// Las fechas que devuelve este Postgres vienen como objetos; a la app le llegan como texto
const comoTexto = (v) =>
  v instanceof Date
    ? v.toISOString().slice(0, 10)
    : Array.isArray(v)
      ? v.map(comoTexto)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'date' ? comoTexto(x) : x]))
        : v

// Aplica el cambio en la copia (LOCAL) y en la base (con `enLaBase`), y devuelve cómo quedó cada una
async function lasDos(tipo, datos, enLaBase) {
  const antes = await estado()
  const copia = LOCAL[tipo](antes, datos, ANA)
  const respuesta = comoTexto(await como(ANA, enLaBase))
  const base = await estado()
  // De paso: aplicar lo que contestó la base (el camino con conexión) también tiene que dejar lo mismo
  if (respuesta !== undefined)
    expect(comparable(GUARDADO[tipo](antes, respuesta, datos)), `${tipo}: con la respuesta de la base`).toEqual(comparable(base))
  expect(comparable(copia), `${tipo}: en el teléfono`).toEqual(comparable(base))
  return base
}

const mover = (food_id, delta) =>
  lasDos('ajustarStock', { food_id, delta }, () => filas('select * from public.mover_stock($1)', [j([{ food_id, delta }])]))

test('el + y el - de la despensa: suma, resta, no baja de cero y agrega lo que no estaba', async () => {
  await mover(id.huevo, 12)
  await mover(id.huevo, -5)
  await mover(id.leche, 1000)
  await mover(id.leche, -1500) // no baja de cero
  await mover(id.arroz, 500)
  await mover(id.avena, -50) // no estaba: queda en cero
  const s = comparable(await mover(id.arroz, 0.5))
  expect(s.stock[id.huevo]).toBe(7)
  expect(s.stock[id.leche]).toBe(0)
  expect(s.stock[id.avena]).toBe(0)
  expect(s.stock[id.arroz]).toBe(500.5)
})

test('cocinar: descuenta los ingredientes (aunque no alcancen) y suma a la comida lista', async () => {
  await mover(id.leche, 600)
  await mover(id.avena, 200)
  const cocinar = (porciones, stock) =>
    lasDos('cocinar', { receta: receta['desayuno-avena'], porciones, stock }, () =>
      rpc('cocinar', [receta['desayuno-avena'], porciones, j(stock)]),
    )
  // La primera vez no había comida lista de esa receta; uno de los ingredientes no estaba en la despensa
  await cocinar(2, [
    { food_id: id.leche, delta: -400 },
    { food_id: id.avena, delta: -80 },
    { food_id: id.banana, delta: -2 },
  ])
  // La segunda suma a lo que había, y la leche no alcanza
  const s = comparable(
    await cocinar(1.5, [
      { food_id: id.leche, delta: -300 },
      { food_id: id.avena, delta: -60 },
    ]),
  )
  expect(s.preparado[receta['desayuno-avena']]).toBe(3.5)
  expect(s.stock[id.leche]).toBe(0)
  expect(s.stock[id.avena]).toBe(60)
  expect(s.stock[id.banana]).toBe(0)
})

test('registrar una comida: saca el "no comí", guarda, descuenta solo de lo que hay y usa la comida lista', async () => {
  await db.query(
    `insert into public.log_entries (user_id, date, meal, name, qty, skipped) values ($1, '2026-10-03', 'almuerzo', 'No comí', 0, true), ($1, '2026-10-03', 'cena', 'No comí', 0, true)`,
    [ANA],
  )
  const datos = {
    fecha: '2026-10-03',
    comida: 'almuerzo',
    filas: [
      { name: 'Huevo', food_id: id.huevo, qty: 2, kcal: 156, protein: 12.6, carbs: 1.1, fat: 10.6 },
      { name: 'Avena con leche y banana', recipe_id: receta['desayuno-avena'], qty: 1, kcal: 380.5, protein: 14, carbs: 60, fat: 8 },
      { name: 'Agua', food_id: id.agua, qty: 250 }, // sin calorías
    ],
    // El pan no está en la despensa (no se agrega) y de huevo se pide más de lo que hay
    stock: [
      { food_id: id.huevo, delta: -20 },
      { food_id: id['pan-integral'], delta: -2 },
      { food_id: id.arroz, delta: -100.25 },
    ],
    // Dos renglones de la misma receta se juntan; una receta que no tiene comida lista no se toca
    preparado: [
      { recipe_id: receta['desayuno-avena'], delta: -1 },
      { recipe_id: receta['desayuno-avena'], delta: -0.5 },
      { recipe_id: receta['omelette-queso'], delta: -1 },
    ],
    ids: ['a', 'b', 'c'],
    cuando: '2026-10-03T12:00:00Z',
  }
  expect(id['pan-integral'] && id.agua && receta['omelette-queso'], 'alimentos y recetas de la prueba').toBeTruthy()
  const s = comparable(
    await lasDos('registrar', datos, () =>
      rpc('registrar_comida', ['2026-10-03', 'almuerzo', j(datos.filas), j(datos.stock), j(datos.preparado)]),
    ),
  )
  expect(s.registros.filter((r) => r.includes('|almuerzo|')).length).toBe(3)
  expect(s.registros.filter((r) => r.includes('No comí')).length, 'la marca de la cena sigue; la del almuerzo no').toBe(1)
  expect(s.stock[id.huevo]).toBe(0)
  expect(s.stock[id['pan-integral']]).toBeUndefined()
  expect(s.stock[id.arroz]).toBe(400.25)
  expect(s.preparado[receta['desayuno-avena']]).toBe(2)
  // Se anota más comida lista de la que hay (el otro teléfono ya la había gastado): queda en cero, no en negativo
  const demas = {
    fecha: '2026-10-03',
    comida: 'merienda',
    filas: [{ name: 'Avena con leche y banana', recipe_id: receta['desayuno-avena'], qty: 5, kcal: 1900 }],
    stock: [],
    preparado: [{ recipe_id: receta['desayuno-avena'], delta: -5 }],
    ids: ['e'],
    cuando: '2026-10-03T17:00:00Z',
  }
  const t = comparable(
    await lasDos('registrar', demas, () => rpc('registrar_comida', ['2026-10-03', 'merienda', j(demas.filas), j([]), j(demas.preparado)])),
  )
  expect(t.preparado[receta['desayuno-avena']]).toBe(0)
  // Sin descontar (un vaso de agua, o "no descontar de la despensa"): solo se guarda el registro
  const agua = {
    fecha: '2026-10-03',
    comida: 'extra',
    filas: [{ name: 'Agua', food_id: id.agua, qty: 250, kcal: 0, protein: 0, carbs: 0, fat: 0 }],
    stock: [],
    preparado: [],
    ids: ['d'],
    cuando: '2026-10-03T13:00:00Z',
  }
  await lasDos('registrar', agua, () => rpc('registrar_comida', ['2026-10-03', 'extra', j(agua.filas), j([]), j([])]))
})

test('comprar: guarda el gasto, suma al stock y saca de la lista lo que estaba anotado', async () => {
  const girasol = (
    await filas(
      `insert into public.foods (owner, name, unit, kcal, same_as) values ($1, 'Aceite girasol Natura', 'ml', 800, $2) returning id`,
      [ANA, id.aceite],
    )
  )[0].id
  const anotar = (food_id, qty) =>
    lasDos('agregarALista', { food_id, qty, id: 'x' }, async () =>
      filas(
        `insert into public.shopping_items (user_id, food_id, qty) values ($1, $2, $3) on conflict (user_id, food_id) do update set qty = excluded.qty returning *`,
        [ANA, food_id, qty],
      ),
    )
  await anotar(id.aceite, 1)
  await anotar(id.arroz, 2)
  await anotar(id.arroz, 3) // ya estaba: cambia la cantidad
  const comprar = (d) => lasDos('comprar', { id: 'c', ...d }, () => rpc('comprar', [d.alimento, d.cantidad, d.precio, d.fecha, d.anotado]))
  // Se compró el producto de marca, pero en la lista figuraba "Aceite"
  let s = comparable(
    await comprar({
      alimento: girasol,
      nombre: 'Aceite girasol Natura',
      cantidad: 900,
      precio: 3200,
      fecha: '2026-10-03',
      anotado: id.aceite,
    }),
  )
  expect(Object.keys(s.lista)).toEqual([id.arroz])
  expect(s.stock[girasol]).toBe(900)
  // Lo que se compró es lo mismo que estaba anotado
  s = comparable(
    await comprar({
      alimento: id.arroz,
      nombre: 'Arroz largo fino (crudo)',
      cantidad: 1000,
      precio: 0,
      fecha: '2026-10-03',
      anotado: id.arroz,
    }),
  )
  expect(s.lista).toEqual({})
  // Y algo que no estaba en la lista
  s = comparable(
    await comprar({ alimento: id.huevo, nombre: 'Huevo', cantidad: 6, precio: 1500.5, fecha: '2026-10-04', anotado: id.huevo }),
  )
  expect(s.compras.length).toBe(3)
  expect(s.stock[id.huevo]).toBe(6)
  await lasDos('quitarDeLista', { food_id: id.arroz }, async () => {
    await filas('delete from public.shopping_items where user_id = $1 and food_id = $2', [ANA, id.arroz])
  })
})

test('"no comí", borrar un registro, poner la cantidad exacta y sacar de la despensa', async () => {
  const fila = {
    id: '00000000-0000-4000-8000-0000000000aa',
    user_id: ANA,
    date: '2026-10-04',
    meal: 'cena',
    name: 'No comí',
    qty: 0,
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    skipped: true,
  }
  await lasDos('saltear', { fila, cuando: '2026-10-04T21:00:00Z' }, () =>
    filas(
      'insert into public.log_entries (id, user_id, date, meal, name, qty, kcal, protein, carbs, fat, skipped) values ($1, $2, $3, $4, $5, 0, 0, 0, 0, 0, true) returning *',
      [fila.id, ANA, fila.date, fila.meal, fila.name],
    ),
  )
  // La fila queda con el identificador que le puso el teléfono: si el pedido llega dos veces, la base lo rechaza por repetido
  await expect(
    como(ANA, () =>
      db.query('insert into public.log_entries (id, user_id, date, meal, name) values ($1, $2, $3, $4, $5)', [
        fila.id,
        ANA,
        fila.date,
        fila.meal,
        fila.name,
      ]),
    ),
  ).rejects.toMatchObject({ code: '23505' })
  await lasDos('borrarRegistro', { id: fila.id }, () => rpc('borrar_registro', [fila.id]))

  const exacta = { user_id: ANA, food_id: id.huevo, qty: 30, updated_at: '2026-10-04T21:00:00Z' }
  await lasDos('fijarStock', { fila: exacta }, () =>
    filas(
      'insert into public.stock (user_id, food_id, qty) values ($1, $2, $3) on conflict (user_id, food_id) do update set qty = excluded.qty returning *',
      [ANA, id.huevo, 30],
    ),
  )
  await lasDos('quitarDeDespensa', { food_id: id.huevo }, async () => {
    await filas('delete from public.stock where user_id = $1 and food_id = $2', [ANA, id.huevo])
  })
  const lista = { user_id: ANA, recipe_id: receta['desayuno-avena'], portions: 4 }
  await lasDos('fijarPreparado', { fila: lista }, () =>
    filas(
      'insert into public.prepared (user_id, recipe_id, portions) values ($1, $2, $3) on conflict (user_id, recipe_id) do update set portions = excluded.portions returning *',
      [ANA, lista.recipe_id, 4],
    ),
  )
})

test('registrar con el descuento en cada fila: la copia y la base anotan lo mismo', async () => {
  await mover(id['pechuga-cruda'], 300)
  await mover(id['queso-cremoso'], 100)
  await db.query(`insert into public.prepared (user_id, recipe_id, portions) values ($1, $2, 2) on conflict do nothing`, [
    ANA,
    receta['omelette-queso'],
  ])
  const datos = {
    fecha: '2026-10-05',
    comida: 'cena',
    filas: [
      // de pechuga hay 300 y se piden 250 + 100: la segunda fila se queda con lo que sobra
      {
        name: 'Pechuga',
        food_id: id['pechuga-cruda'],
        qty: 250,
        kcal: 400,
        protein: 60,
        carbs: 0,
        fat: 8,
        s: [{ f: id['pechuga-cruda'], q: 250 }],
        p: 0,
      },
      {
        name: 'Pechuga',
        food_id: id['pechuga-cruda'],
        qty: 100,
        kcal: 160,
        protein: 24,
        carbs: 0,
        fat: 3,
        s: [{ f: id['pechuga-cruda'], q: 100 }],
        p: 0,
      },
      // la receta usa 3 porciones cocinadas (hay 2) y queso; el pan no está en la despensa
      {
        name: 'Omelette',
        recipe_id: receta['omelette-queso'],
        qty: 3,
        kcal: 600,
        protein: 40,
        carbs: 5,
        fat: 45,
        s: [
          { f: id['queso-cremoso'], q: 40 },
          { f: id['pan-integral'], q: 2 },
        ],
        p: 3,
      },
      // sin descontar: no toca nada
      { name: 'Fideos', food_id: id.fideos, qty: 100, kcal: 350, protein: 12, carbs: 70, fat: 1.5, s: [], p: 0 },
    ],
    stock: [],
    preparado: [],
    ids: ['a', 'b', 'c', 'd'],
    cuando: '2026-10-05T21:00:00Z',
  }
  const s = comparable(await lasDos('registrar', datos, () => rpc('registrar_comida', ['2026-10-05', 'cena', j(datos.filas), '[]', '[]'])))
  expect(s.stock[id['pechuga-cruda']]).toBe(0)
  expect(s.stock[id['queso-cremoso']]).toBe(60)
  expect(s.preparado[receta['omelette-queso']]).toBe(0)
  const anotados = s.registros.filter((r) => r.includes('|2026-10-05|') || r.startsWith('2026-10-05')).map((r) => r.split('|').pop())
  expect(anotados.length).toBe(4)
  expect(anotados.filter((x) => x.includes(',50,100]')).length, 'la segunda fila descontó solo lo que quedaba').toBe(1)
})

test('cambiar la cantidad de un registro: la copia y la base ajustan igual la despensa', async () => {
  const ultimo = async (nombre) =>
    (
      await filas(`select * from public.log_entries where user_id = $1 and name = $2 order by created_at desc, id limit 1`, [ANA, nombre])
    )[0]
  const editar = (r, qty) => lasDos('editarRegistro', { id: r.id, qty }, () => rpc('editar_registro', [r.id, qty]))
  await mover(id['pechuga-cruda'], 500)
  await mover(id['queso-cremoso'], 100)
  const pedido = {
    fecha: '2026-10-06',
    comida: 'almuerzo',
    filas: [
      {
        name: 'Pollo editable',
        food_id: id['pechuga-cruda'],
        qty: 200,
        kcal: 320,
        protein: 48,
        carbs: 0,
        fat: 6,
        s: [{ f: id['pechuga-cruda'], q: 200 }],
        p: 0,
      },
      {
        name: 'Omelette editable',
        recipe_id: receta['omelette-queso'],
        qty: 2,
        kcal: 400,
        protein: 27,
        carbs: 3,
        fat: 30,
        s: [{ f: id['queso-cremoso'], q: 60 }],
        p: 1,
      },
    ],
    stock: [],
    preparado: [],
    ids: ['p', 'o'],
    cuando: '2026-10-06T13:00:00Z',
  }
  await db.query(
    `insert into public.prepared (user_id, recipe_id, portions) values ($1, $2, 3) on conflict (user_id, recipe_id) do update set portions = 3`,
    [ANA, receta['omelette-queso']],
  )
  await lasDos('registrar', pedido, () => rpc('registrar_comida', ['2026-10-06', 'almuerzo', j(pedido.filas), '[]', '[]']))
  const pollo = await ultimo('Pollo editable')
  const omelette = await ultimo('Omelette editable')
  // Bajar devuelve; subir descuenta; subir de más deja en cero lo que se acaba
  let s = comparable(await editar(pollo, 150))
  expect(s.stock[id['pechuga-cruda']]).toBe(350)
  s = comparable(await editar(pollo, 400))
  expect(s.stock[id['pechuga-cruda']]).toBe(100)
  s = comparable(await editar(pollo, 2000))
  expect(s.stock[id['pechuga-cruda']]).toBe(0)
  // Recetas: ingredientes y porciones cocinadas juntos
  s = comparable(await editar(omelette, 1))
  expect(s.stock[id['queso-cremoso']]).toBe(130)
  expect(s.preparado[receta['omelette-queso']]).toBe(2.5)
  s = comparable(await editar(omelette, 6))
  expect(s.preparado[receta['omelette-queso']]).toBe(0)
  // Un producto que ya no está en la despensa no se vuelve a crear
  await lasDos('quitarDeDespensa', { food_id: id['queso-cremoso'] }, async () => {
    await filas('delete from public.stock where user_id = $1 and food_id = $2', [ANA, id['queso-cremoso']])
  })
  s = comparable(await editar(omelette, 2))
  expect(s.stock[id['queso-cremoso']]).toBeUndefined()
  // Un registro de antes (sin dato) solo cambia el diario
  const viejo = (
    await filas(
      `insert into public.log_entries (user_id, date, meal, name, food_id, qty, kcal, protein) values ($1, '2026-09-01', 'cena', 'Viejo', $2, 100, 160, 24) returning *`,
      [ANA, id['pechuga-cruda']],
    )
  )[0]
  await mover(id['pechuga-cruda'], 50)
  s = comparable(await editar(viejo, 50))
  expect(s.stock[id['pechuga-cruda']]).toBe(50)
})

test('borrar un registro devuelve lo que había descontado (y no agrega lo que ya no está)', async () => {
  await mover(id['pechuga-cruda'], 400)
  await mover(id.fideos, 500)
  const pedido = {
    fecha: '2026-10-07',
    comida: 'cena',
    filas: [
      {
        name: 'Para borrar',
        food_id: id['pechuga-cruda'],
        qty: 300,
        kcal: 480,
        protein: 72,
        carbs: 0,
        fat: 9,
        s: [{ f: id['pechuga-cruda'], q: 300 }],
        p: 0,
      },
      {
        name: 'Fideos para borrar',
        food_id: id.fideos,
        qty: 200,
        kcal: 700,
        protein: 24,
        carbs: 140,
        fat: 3,
        s: [{ f: id.fideos, q: 200 }],
        p: 0,
      },
    ],
    stock: [],
    preparado: [],
    ids: ['x', 'y'],
    cuando: '2026-10-07T21:00:00Z',
  }
  await lasDos('registrar', pedido, () => rpc('registrar_comida', ['2026-10-07', 'cena', j(pedido.filas), '[]', '[]']))
  const ids = (
    await filas(
      `select id, name from public.log_entries where user_id = $1 and name like '%para borrar' or name = 'Para borrar' order by name`,
      [ANA],
    )
  ).map((x) => x.id)
  expect(ids.length).toBe(2)
  const antes = comparable(await estado())
  // Uno de los dos productos ya no está en la despensa
  await lasDos('quitarDeDespensa', { food_id: id.fideos }, async () => {
    await filas('delete from public.stock where user_id = $1 and food_id = $2', [ANA, id.fideos])
  })
  for (const idRegistro of ids) await lasDos('borrarRegistro', { id: idRegistro }, () => rpc('borrar_registro', [idRegistro]))
  const despues = comparable(await estado())
  expect(despues.stock[id['pechuga-cruda']]).toBe(antes.stock[id['pechuga-cruda']] + 300)
  expect(despues.stock[id.fideos]).toBeUndefined()
})

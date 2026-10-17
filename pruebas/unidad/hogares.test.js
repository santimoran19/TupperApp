// Hogares con la despensa compartida (supabase/actualizacion-13.sql), contra un Postgres de verdad.
// Los tests van en orden y comparten la base: cada uno sigue donde dejó el anterior.
import { beforeAll, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo, j } from './postgres.js'

// Las compras que se copian al hogar son las de los últimos 90 días: las fechas de la prueba van relativas a hoy
const HOY = new Date().toISOString().slice(0, 10)

let id, receta, db, como, filas, una, rpc

// Más personas, con su perfil (los de abrirBase son solo Ana y Beto)
const CARLA = '00000000-0000-0000-0000-00000000000c'
const DANI = '00000000-0000-0000-0000-00000000000d'
const EMA = '00000000-0000-0000-0000-00000000000e'
const FEDE = '00000000-0000-0000-0000-00000000000f'
const GABI = '00000000-0000-0000-0000-000000000010'
const HUGO = '00000000-0000-0000-0000-000000000011'
const IVAN = '00000000-0000-0000-0000-000000000012'
const JULI = '00000000-0000-0000-0000-000000000013'
const NOMBRES = {
  [ANA]: 'Ana',
  [BETO]: 'Beto',
  [CARLA]: 'Carla',
  [DANI]: 'Dani',
  [EMA]: 'Ema',
  [FEDE]: 'Fede',
  [GABI]: 'Gabi',
  [HUGO]: 'Hugo',
  [IVAN]: 'Ivan',
  [JULI]: 'Juli',
}

beforeAll(async () => {
  ;({ db, id, receta, como, filas, una, rpc } = await abrirBase())
  for (const u of [CARLA, DANI, EMA, FEDE, GABI, HUGO, IVAN, JULI])
    await db.query('insert into auth.users (id, email) values ($1, $2)', [u, NOMBRES[u].toLowerCase() + '@test.com'])
  for (const [u, nombre] of Object.entries(NOMBRES))
    await db.query('insert into public.profiles (id, name, username) values ($1, $2, $3)', [u, nombre, nombre.toLowerCase() + '.u'])
}, 60000)

const poner = (usuario, cambios) => como(usuario, () => filas('select * from public.mover_stock($1)', [j(cambios)]))
// Lo que hay en la tabla a nombre de `dueno` (una persona o un hogar), visto como administrador
const stockDe = async (dueno) =>
  Object.fromEntries(
    (
      await filas(
        'select coalesce(f.slug, f.name) as slug, s.qty from public.stock s join public.foods f on f.id = s.food_id where s.user_id = $1',
        [dueno],
      )
    ).map((s) => [s.slug, Number(s.qty)]),
  )
// Lo que ve una persona, con sus permisos (la despensa que le toca)
const veStock = (usuario) =>
  como(usuario, async () =>
    Object.fromEntries(
      (await filas('select coalesce(f.slug, f.name) as slug, s.qty from public.stock s join public.foods f on f.id = s.food_id')).map(
        (s) => [s.slug, Number(s.qty)],
      ),
    ),
  )
const veLista = (usuario) =>
  como(usuario, async () =>
    Object.fromEntries(
      (await filas('select f.slug, l.qty from public.shopping_items l join public.foods f on f.id = l.food_id')).map((l) => [
        l.slug,
        Number(l.qty),
      ]),
    ),
  )
const veTuppers = (usuario) =>
  como(usuario, async () =>
    Object.fromEntries(
      (await filas('select r.slug, p.portions from public.prepared p join public.recipes r on r.id = p.recipe_id')).map((p) => [
        p.slug,
        Number(p.portions),
      ]),
    ),
  )
const mi = (usuario) => como(usuario, () => rpc('mi_hogar', []))
const comida = (alimento, qty, extra = {}) => ({
  name: alimento,
  food_id: id[alimento],
  qty,
  kcal: qty,
  protein: 0,
  carbs: 0,
  fat: 0,
  ...extra,
})
const RECETA_A = () => receta['arroz-con-pollo']
const RECETA_B = () => receta['fideos-con-atun']
let hogar // id del hogar de Ana y Beto
let codigo

test('sin hogar todo es como antes: cada uno tiene su despensa y no ve la de otro', async () => {
  expect(await como(ANA, () => rpc('despensa_de', []))).toBe(ANA)
  expect(await como(BETO, () => rpc('despensa_de', []))).toBe(BETO)
  expect(await mi(ANA)).toBeNull()
  await poner(ANA, [
    { food_id: id.huevo, delta: 6 },
    { food_id: id.arroz, delta: 500 },
  ])
  await poner(BETO, [
    { food_id: id.huevo, delta: 3 },
    { food_id: id.leche, delta: 200 },
  ])
  expect(await veStock(ANA)).toEqual({ huevo: 6, arroz: 500 })
  expect(await veStock(BETO)).toEqual({ huevo: 3, leche: 200 })
  // Lista, tuppers y compras de cada una
  await como(ANA, () =>
    db.query(`insert into public.shopping_items (user_id, food_id, qty) values ($1, $2, 2), ($1, $3, 1)`, [
      ANA,
      id['pan-frances'],
      id.tomate,
    ]),
  )
  await como(BETO, () =>
    db.query(`insert into public.shopping_items (user_id, food_id, qty) values ($1, $2, 5), ($1, $3, 1)`, [
      BETO,
      id['pan-frances'],
      id.cebolla,
    ]),
  )
  await como(ANA, () => rpc('cocinar', [RECETA_A(), 4, '[]', null]))
  await como(ANA, () => rpc('comprar', [id.huevo, 12, 3000, HOY, null, null]))
  await como(BETO, () => rpc('comprar', [id.leche, 2, 1500, HOY, null, null]))
})

test('armar un hogar: la despensa de quien lo arma pasa a ser la del hogar y lo suyo queda guardado', async () => {
  const antes = {
    stock: await stockDe(ANA),
    lista: (await filas('select count(*)::int as n from public.shopping_items where user_id = $1', [ANA]))[0].n,
    compras: (await filas('select count(*)::int as n from public.purchases where user_id = $1', [ANA]))[0].n,
    tuppers: (await filas('select count(*)::int as n from public.prepared where user_id = $1', [ANA]))[0].n,
  }
  const h = await como(ANA, () => rpc('crear_hogar', ['  Casa de Ana  ']))
  hogar = h.id
  codigo = h.codigo
  expect(h).toMatchObject({ nombre: 'Casa de Ana', soy_creador: true, maximo: 6 })
  expect(h.codigo).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
  expect(h.miembros).toEqual([expect.objectContaining({ id: ANA, nombre: 'Ana', usuario: 'ana.u', creador: true })])
  expect(await como(ANA, () => rpc('despensa_de', []))).toBe(hogar)
  // Lo del hogar es lo de Ana; lo de Ana sigue intacto en su sitio
  expect(await stockDe(hogar)).toEqual({ huevo: 18, arroz: 500 }) // huevo: 6 de la despensa + 12 comprados
  expect(await veStock(ANA)).toEqual({ huevo: 18, arroz: 500 })
  expect(await stockDe(ANA)).toEqual(antes.stock)
  expect((await filas('select count(*)::int as n from public.shopping_items where user_id = $1', [ANA]))[0].n).toBe(antes.lista)
  expect((await filas('select count(*)::int as n from public.purchases where user_id = $1', [ANA]))[0].n).toBe(antes.compras)
  expect((await filas('select count(*)::int as n from public.prepared where user_id = $1', [ANA]))[0].n).toBe(antes.tuppers)
  // La lista y los tuppers también
  expect(await veLista(ANA)).toEqual({ 'pan-frances': 2, tomate: 1 })
  expect(Object.values(await veTuppers(ANA))).toEqual([4])
  // Beto sigue sin ver nada de eso
  expect(await veStock(BETO)).toEqual({ huevo: 3, leche: 202 })
})

test('no se puede armar un hogar estando en otro, ni con un nombre vacío o larguísimo', async () => {
  expect(await fallo(como(ANA, () => rpc('crear_hogar', ['Otra casa'])))).toMatch(/Ya estás en un hogar/)
  expect(await fallo(como(BETO, () => rpc('crear_hogar', ['   '])))).toMatch(/entre 1 y 40/)
  expect(await fallo(como(BETO, () => rpc('crear_hogar', ['x'.repeat(41)])))).toMatch(/entre 1 y 40/)
  expect(await fallo(db.query(`select public.crear_hogar('Anónimo')`).then(() => null))).toMatch(/Iniciá sesión/)
})

test('unirse con el código: se suma a lo del hogar, lo suyo queda intacto y los dos ven lo mismo', async () => {
  const r = await como(BETO, () => rpc('unirse_al_hogar', [' ' + codigo.toLowerCase() + ' ']))
  expect(r).toEqual({ ok: true })
  expect(await como(BETO, () => rpc('despensa_de', []))).toBe(hogar)
  expect(await stockDe(hogar)).toEqual({ huevo: 21, arroz: 500, leche: 202 })
  expect(await veStock(BETO)).toEqual({ huevo: 21, arroz: 500, leche: 202 })
  expect(await veStock(ANA)).toEqual({ huevo: 21, arroz: 500, leche: 202 })
  expect(await stockDe(BETO)).toEqual({ huevo: 3, leche: 202 }) // lo suyo, sin tocar
  // La lista: el pan estaba en las dos (queda la cantidad mayor); lo demás se suma
  expect(await veLista(BETO)).toEqual({ 'pan-frances': 5, tomate: 1, cebolla: 1 })
  // Las compras de los dos
  const compras = await como(BETO, () => filas('select name, qty, comprado_por from public.purchases order by qty desc'))
  expect(compras.map((c) => c.qty).map(Number)).toEqual([12, 2])
  const h = await mi(BETO)
  expect(h.soy_creador).toBe(false)
  expect(h.codigo).toBeNull() // el código lo ve solo quien creó el hogar
  expect(h.miembros.map((m) => m.nombre)).toEqual(['Ana', 'Beto'])
  expect(h.miembros.map((m) => m.creador)).toEqual([true, false])
  expect(Object.keys(h.miembros[0]).sort()).toEqual(['creador', 'desde', 'id', 'nombre', 'usuario']) // no se cuela ningún email ni dato de más
  expect((await mi(ANA)).codigo).toBe(codigo)
})

test('el diario sigue siendo de cada uno aunque la despensa sea compartida', async () => {
  await como(BETO, () =>
    rpc('registrar_comida', ['2026-10-12', 'almuerzo', j([comida('huevo', 3, { s: [{ f: id.huevo, q: 3 }] })]), '[]', '[]', null]),
  )
  expect((await veStock(ANA)).huevo).toBe(18) // Ana ve el descuento
  expect((await stockDe(hogar)).huevo).toBe(18)
  expect((await stockDe(BETO)).huevo).toBe(3) // lo guardado de Beto, sin tocar
  const diarioBeto = await como(BETO, () => filas('select id, name from public.log_entries'))
  const diarioAna = await como(ANA, () => filas('select id from public.log_entries'))
  expect(diarioBeto.length).toBe(1)
  expect(diarioAna.length).toBe(0)
  // Editar y borrar devuelven a la despensa del hogar
  await como(BETO, () => rpc('editar_registro', [diarioBeto[0].id, 1]))
  expect((await veStock(ANA)).huevo).toBe(20)
  const b = await como(BETO, () => rpc('borrar_registro', [diarioBeto[0].id]))
  expect(b.stock.length).toBe(1)
  expect((await veStock(ANA)).huevo).toBe(21)
  // Ana no puede tocar el registro de Beto
  await como(BETO, () =>
    rpc('registrar_comida', ['2026-10-12', 'cena', j([comida('huevo', 1, { s: [{ f: id.huevo, q: 1 }] })]), '[]', '[]', null]),
  )
  const ajeno = await como(BETO, () => filas('select id from public.log_entries'))
  expect(await fallo(como(ANA, () => rpc('editar_registro', [ajeno[0].id, 5])))).toMatch(/ya no existe/)
  await como(ANA, () => rpc('borrar_registro', [ajeno[0].id])) // no hace nada
  expect((await como(BETO, () => filas('select id from public.log_entries'))).length).toBe(1)
  await como(BETO, () => rpc('borrar_registro', [ajeno[0].id]))
  expect((await veStock(ANA)).huevo).toBe(21)
})

test('cocinar y comprar trabajan sobre lo compartido, y se anota quién compró', async () => {
  const r = await como(BETO, () => rpc('cocinar', [RECETA_B(), 2, j([{ food_id: id.huevo, delta: -4 }]), null]))
  expect(r.preparado.user_id).toBe(hogar)
  expect((await veStock(ANA)).huevo).toBe(17)
  expect(Object.keys(await veTuppers(ANA)).length).toBe(2)
  const c = await como(BETO, () => rpc('comprar', [id['pan-frances'], 1, 900, HOY, null, null]))
  expect(c.compra).toMatchObject({ user_id: hogar, comprado_por: BETO })
  expect((await veLista(ANA))['pan-frances']).toBeUndefined() // se sacó de la lista de todos
  const c2 = await como(ANA, () => rpc('comprar', [id.arroz, 1, 1000, HOY, null, null]))
  expect(c2.compra.comprado_por).toBe(ANA)
  expect((await veStock(BETO)).arroz).toBe(501)
  // Ana ve lo que compró Beto y al revés
  expect((await como(ANA, () => filas('select 1 from public.purchases where comprado_por = $1', [BETO]))).length).toBe(1)
})

test('quien no es del hogar no puede ver ni tocar su despensa, ni siquiera sabiendo su id', async () => {
  expect(await veStock(CARLA)).toEqual({})
  expect(
    await fallo(como(CARLA, () => db.query(`insert into public.stock (user_id, food_id, qty) values ($1, $2, 1)`, [hogar, id.sal]))),
  ).toMatch(/row-level security/)
  const borrada = await como(CARLA, () => filas('delete from public.stock where user_id = $1 returning 1', [hogar]))
  expect(borrada).toEqual([])
  const cambiada = await como(CARLA, () => filas('update public.stock set qty = 0 where user_id = $1 returning 1', [hogar]))
  expect(cambiada).toEqual([])
  expect((await stockDe(hogar)).arroz).toBe(501)
  // Y un miembro no puede escribir en la despensa de otra persona (solo en la suya o la del hogar)
  expect(
    await fallo(como(BETO, () => db.query(`insert into public.stock (user_id, food_id, qty) values ($1, $2, 1)`, [CARLA, id.sal]))),
  ).toMatch(/row-level security/)
  expect(
    await fallo(como(BETO, () => db.query(`insert into public.stock (user_id, food_id, qty) values ($1, $2, 1)`, [BETO, id.sal]))),
  ).toMatch(/row-level security/)
})

test('las tablas del hogar no se tocan directamente, y sin sesión no se puede nada', async () => {
  for (const t of ['hogares', 'hogar_miembros', 'hogar_intentos', 'hogar_respaldos']) {
    expect(await fallo(como(ANA, () => filas(`select * from public.${t}`)))).toMatch(/permission denied/)
    expect(await fallo(como(ANA, () => filas(`delete from public.${t}`)))).toMatch(/permission denied/)
    expect(await fallo(como(null, () => filas(`select * from public.${t}`)))).toMatch(/permission denied/)
  }
  for (const f of ['mi_hogar()', "crear_hogar('x')", "unirse_al_hogar('AAAAAA')", 'salir_del_hogar()', 'despensa_de()', 'companeros()'])
    expect(await fallo(como(null, () => filas(`select public.${f}`)))).toMatch(/permission denied/)
  for (const f of ['hogar_sumar($1, $1)', 'hogar_llevarse($1, $1)', 'hogar_codigo_nuevo()'])
    expect(await fallo(como(ANA, () => filas(`select public.${f.replaceAll('$1', "'" + ANA + "'")}`)))).toMatch(/permission denied/)
})

test('los alimentos y recetas propios se ven entre las personas del hogar (solo para verlos), y nadie más los ve', async () => {
  await como(ANA, () =>
    db.query(`insert into public.foods (owner, name, unit, kcal, category) values ($1, 'Dulce de Ana', 'g', 300, 'Otros')`, [ANA]),
  )
  const [propio] = await filas(`select id from public.foods where name = 'Dulce de Ana'`)
  expect((await como(BETO, () => filas('select 1 from public.foods where id = $1', [propio.id]))).length).toBe(1)
  expect((await como(CARLA, () => filas('select 1 from public.foods where id = $1', [propio.id]))).length).toBe(0)
  // Beto lo ve pero no lo puede cambiar ni borrar
  expect(await como(BETO, () => filas(`update public.foods set kcal = 1 where id = $1 returning 1`, [propio.id]))).toEqual([])
  expect(await como(BETO, () => filas(`delete from public.foods where id = $1 returning 1`, [propio.id]))).toEqual([])
  // Y Beto lo puede poner en la despensa de todos
  await poner(BETO, [{ food_id: propio.id, delta: 400 }])
  expect((await veStock(ANA))['Dulce de Ana']).toBe(400)
  // Recetas propias, con sus ingredientes
  const g = await como(ANA, () =>
    rpc('guardar_receta', [
      null,
      j({ name: 'Tarta de Ana', minutes: 30, servings: 4, meal_types: ['cena'], portable: false, steps: 'x' }),
      j([{ food_id: id.huevo, qty: 3 }]),
    ]),
  )
  expect((await como(BETO, () => filas('select 1 from public.recipes where id = $1', [g.receta.id]))).length).toBe(1)
  expect((await como(BETO, () => filas('select 1 from public.recipe_items where recipe_id = $1', [g.receta.id]))).length).toBe(1)
  expect((await como(CARLA, () => filas('select 1 from public.recipes where id = $1', [g.receta.id]))).length).toBe(0)
  expect((await como(CARLA, () => filas('select 1 from public.recipe_items where recipe_id = $1', [g.receta.id]))).length).toBe(0)
  expect(
    await fallo(
      como(BETO, () =>
        rpc('guardar_receta', [
          g.receta.id,
          j({ name: 'Mía ahora', minutes: 1, servings: 1, meal_types: [] }),
          j([{ food_id: id.huevo, qty: 1 }]),
        ]),
      ),
    ),
  ).toMatch(/no se puede editar/)
})

test('el código: se renueva (el anterior deja de servir), se apaga, y solo lo maneja quien armó el hogar', async () => {
  expect(await fallo(como(BETO, () => rpc('renovar_codigo', [false])))).toMatch(/Solo quien armó/)
  expect(await fallo(como(BETO, () => rpc('renombrar_hogar', ['Mío'])))).toMatch(/Solo quien armó/)
  const nuevo = await como(ANA, () => rpc('renovar_codigo', [false]))
  expect(nuevo).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
  expect(nuevo).not.toBe(codigo)
  const viejo = codigo
  codigo = nuevo
  expect((await como(HUGO, () => rpc('unirse_al_hogar', [viejo]))).ok).toBe(false)
  expect(await como(ANA, () => rpc('renovar_codigo', [true]))).toBeNull()
  expect((await mi(ANA)).codigo).toBeNull()
  expect((await como(HUGO, () => rpc('unirse_al_hogar', [codigo]))).ok).toBe(false)
  codigo = await como(ANA, () => rpc('renovar_codigo', [false]))
  await como(ANA, () => rpc('renombrar_hogar', ['  Casa grande  ']))
  expect((await mi(BETO)).nombre).toBe('Casa grande')
  expect(await fallo(como(ANA, () => rpc('renombrar_hogar', ['  '])))).toMatch(/entre 1 y 40/)
})

test('un código equivocado devuelve el aviso sin entrar, y después de 5 intentos hay que esperar', async () => {
  const mal = await como(CARLA, () => rpc('unirse_al_hogar', ['ZZZZZZ']))
  expect(mal).toMatchObject({ ok: false })
  expect(mal.error).toMatch(/No encontramos ese código/)
  const corto = await como(CARLA, () => rpc('unirse_al_hogar', ['ABC']))
  expect(corto.error).toMatch(/6 letras o números/)
  expect((await como(CARLA, () => rpc('unirse_al_hogar', ["' or 1=1 --"]))).ok).toBe(false)
  expect((await como(CARLA, () => rpc('unirse_al_hogar', ['']))).ok).toBe(false)
  expect((await como(CARLA, () => rpc('unirse_al_hogar', [null]))).ok).toBe(false)
  expect(await fallo(como(CARLA, () => rpc('unirse_al_hogar', ['ZZZZZZ'])))).toMatch(/demasiados códigos/)
  // Ni con el código bueno mientras dure el bloqueo
  expect(await fallo(como(CARLA, () => rpc('unirse_al_hogar', [codigo])))).toMatch(/demasiados códigos/)
  expect(await mi(CARLA)).toBeNull()
  // Pasada la hora se puede de nuevo
  await db.query(`update public.hogar_intentos set creado = now() - interval '2 hours' where user_id = $1`, [CARLA])
  expect((await como(CARLA, () => rpc('unirse_al_hogar', ['ZZZZZZ']))).ok).toBe(false)
  await db.query('delete from public.hogar_intentos where user_id = $1', [CARLA])
})

test('el hogar tiene un máximo de personas: la última que entra es la sexta', async () => {
  for (const u of [CARLA, DANI, EMA, FEDE]) expect(await como(u, () => rpc('unirse_al_hogar', [codigo]))).toEqual({ ok: true })
  expect((await mi(ANA)).miembros.length).toBe(6)
  expect(await fallo(como(GABI, () => rpc('unirse_al_hogar', [codigo])))).toMatch(/ya está completo \(hasta 6 personas\)/)
  expect(await mi(GABI)).toBeNull()
  // Lo de los que se sumaron entró a lo compartido
  expect(await como(GABI, () => rpc('despensa_de', []))).toBe(GABI)
})

test('no se puede estar en dos hogares', async () => {
  expect(await fallo(como(DANI, () => rpc('unirse_al_hogar', ['ZZZZZZ'])))).toMatch(/Ya estás en un hogar/)
  const otro = await como(GABI, () => rpc('crear_hogar', ['Otra casa']))
  expect(await fallo(como(DANI, () => rpc('unirse_al_hogar', [otro.codigo])))).toMatch(/Ya estás en un hogar/)
  await como(GABI, () => rpc('salir_del_hogar', []))
  expect(await fallo(como(GABI, () => rpc('salir_del_hogar', [])))).toMatch(/No estás en ningún hogar/)
  expect(await stockDe(otro.id)).toEqual({})
  expect((await filas('select count(*)::int as n from public.hogares where id = $1', [otro.id]))[0].n).toBe(0) // era la única: el hogar se fue
})

test('sacar a alguien: solo lo hace quien armó el hogar y se lleva una copia', async () => {
  expect(await fallo(como(BETO, () => rpc('sacar_del_hogar', [DANI])))).toMatch(/Solo quien armó/)
  expect(await fallo(como(ANA, () => rpc('sacar_del_hogar', [ANA])))).toMatch(/Salir del hogar/)
  expect(await fallo(como(ANA, () => rpc('sacar_del_hogar', [HUGO])))).toMatch(/ya no está en tu hogar/)
  const antes = await stockDe(hogar)
  await como(ANA, () => rpc('sacar_del_hogar', [DANI]))
  expect(await mi(DANI)).toBeNull()
  expect((await mi(ANA)).miembros.length).toBe(5)
  expect(await stockDe(hogar)).toEqual(antes) // el hogar no pierde nada
  // Dani no tenía nada propio: se lleva la copia de la despensa del hogar (sin lo que cargó Ana, que ya no podría ver)
  const copia = { ...antes }
  delete copia['Dulce de Ana']
  expect(await stockDe(DANI)).toEqual(copia)
  expect((await filas('select count(*)::int as n from public.hogar_respaldos where user_id = $1', [DANI]))[0].n).toBe(0) // no había nada que respaldar
})

test('salir: se lleva una copia de lo del hogar, lo anterior queda en un respaldo y los demás siguen igual', async () => {
  const hogarAntes = await stockDe(hogar)
  const personalAntes = await stockDe(BETO)
  expect(personalAntes).toEqual({ huevo: 3, leche: 202 })
  // Estando en el hogar compró el pan; la leche la compró antes y quedó guardada con lo suyo
  expect((await filas('select name from public.purchases where comprado_por = $1', [BETO])).length).toBe(1)
  await como(BETO, () => rpc('salir_del_hogar', []))
  expect(await mi(BETO)).toBeNull()
  expect(await como(BETO, () => rpc('despensa_de', []))).toBe(BETO)
  // Se lleva la copia de lo del hogar (menos lo que cargó Ana: él no lo podría ver)
  const copia = { ...hogarAntes }
  delete copia['Dulce de Ana']
  expect(await stockDe(BETO)).toEqual(copia)
  expect(await veStock(BETO)).toEqual(copia)
  // Lo que tenía antes quedó guardado
  const [r] = await filas('select stock, lista, preparado, motivo from public.hogar_respaldos where user_id = $1', [BETO])
  expect(r.motivo).toBe('salida')
  expect(r.stock.map((s) => Number(s.qty)).sort((a, b) => a - b)).toEqual([3, 202])
  expect(r.stock[0].user_id).toBeUndefined()
  expect(r.lista.length).toBe(2)
  // El hogar sigue con todo lo suyo, y Beto ya no lo ve
  expect(await stockDe(hogar)).toEqual(hogarAntes)
  expect(await veStock(ANA)).toEqual(hogarAntes)
  // Sus compras de cuando estaba en el hogar se las lleva, sin repetir las que ya tenía antes: la leche y el pan
  expect((await como(BETO, () => filas('select name from public.purchases order by name'))).map((c) => c.name)).toEqual([
    'Leche parcialmente descremada',
    'Pan francés',
  ])
  // Al salir ya no ve los alimentos propios de Ana
  const propio = (await filas(`select id from public.foods where name = 'Dulce de Ana'`))[0].id
  expect((await como(BETO, () => filas('select 1 from public.foods where id = $1', [propio]))).length).toBe(0)
})

// ---------- Lo difícil: se va quien armó el hogar, se borran cuentas, no queda nada suelto ----------
const cuantos = async (sql, params) => (await una(`select count(*)::int as n ${sql}`, params)).n
const hogaresVivos = () => cuantos('from public.hogares')
// Filas de las cuatro tablas a nombre de alguien que no existe (ni como persona ni como hogar)
const huerfanas = async () => {
  let total = 0
  for (const t of ['stock', 'prepared', 'shopping_items', 'purchases'])
    total += await cuantos(
      `from public.${t} where user_id not in (select id from auth.users) and user_id not in (select id from public.hogares)`,
    )
  return total
}

test('si se va quien armó el hogar, pasa a ser creadora la persona que lleva más tiempo, y se lleva lo suyo', async () => {
  const antes = await stockDe(hogar)
  expect(antes['Dulce de Ana']).toBe(400)
  const lista = await como(ANA, () => rpc('mi_hogar', []))
  expect(lista.miembros.map((m) => m.nombre)).toEqual(['Ana', 'Carla', 'Ema', 'Fede'])
  await como(ANA, () => rpc('salir_del_hogar', []))
  const h = await mi(CARLA)
  expect(h.soy_creador).toBe(true)
  expect(h.codigo).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
  expect(h.miembros.map((m) => [m.nombre, m.creador])).toEqual([
    ['Carla', true],
    ['Ema', false],
    ['Fede', false],
  ])
  expect((await mi(EMA)).codigo).toBeNull()
  // Lo que cargó Ana se va con ella: el hogar ya no lo tiene y los demás ya no lo ven
  const despues = await stockDe(hogar)
  expect(despues['Dulce de Ana']).toBeUndefined()
  expect({ ...despues, 'Dulce de Ana': 400 }).toEqual(antes)
  expect((await veStock(EMA))['Dulce de Ana']).toBeUndefined()
  expect((await stockDe(ANA))['Dulce de Ana']).toBe(400)
  expect((await veStock(ANA))['Dulce de Ana']).toBe(400)
  // Y su respaldo guarda lo que tenía antes de armar el hogar
  const [r] = await filas('select stock from public.hogar_respaldos where user_id = $1', [ANA])
  expect(r.stock.map((s) => Number(s.qty)).sort((a, b) => a - b)).toEqual([18, 500]) // lo que tenía: 18 huevos (6 y los 12 que compró) y 500 de arroz
})

test('quien se une y se va varias veces no llena la base: el respaldo guarda los 5 últimos y las compras no se repiten', async () => {
  await poner(HUGO, [{ food_id: id.huevo, delta: 2 }])
  await como(HUGO, () => rpc('comprar', [id.sal, 1, 500, HOY, null, null]))
  const comprasDelHogar = () => cuantos('from public.purchases where user_id = $1 and food_id = $2', [hogar, id.sal])
  const codigoNuevo = await como(CARLA, () => rpc('renovar_codigo', [false]))
  for (let i = 0; i < 7; i++) {
    expect(await como(HUGO, () => rpc('unirse_al_hogar', [codigoNuevo]))).toEqual({ ok: true })
    await como(HUGO, () => rpc('salir_del_hogar', []))
  }
  expect(await cuantos('from public.hogar_respaldos where user_id = $1', [HUGO])).toBe(5)
  expect(await mi(HUGO)).toBeNull()
  expect(await comprasDelHogar()).toBe(1)
  expect((await mi(CARLA)).miembros.length).toBe(3)
})

test('borrar la cuenta: se va lo suyo y su lugar en el hogar, y el hogar sigue para los demás', async () => {
  await db.query(
    `insert into public.stock (user_id, food_id, qty) values ($1, $2, 7) on conflict (user_id, food_id) do update set qty = 7`,
    [HUGO, id.sal],
  )
  const hogarAntes = await stockDe(hogar)
  // Quien no está en ningún hogar (Hugo): se va todo lo suyo, incluidos los respaldos
  await como(HUGO, () => filas('select public.borrar_mi_cuenta()'))
  expect(await cuantos('from public.stock where user_id = $1', [HUGO])).toBe(0)
  expect(await cuantos('from public.purchases where user_id = $1', [HUGO])).toBe(0)
  expect(await cuantos('from public.hogar_respaldos where user_id = $1', [HUGO])).toBe(0)
  expect(await cuantos('from public.hogar_intentos where user_id = $1', [HUGO])).toBe(0)
  // La compra que Hugo hizo antes de unirse y que quedó en el hogar sigue ahí (es parte del historial de todos)
  expect(await cuantos('from public.purchases where user_id = $1 and food_id = $2', [hogar, id.sal])).toBe(1)
  expect(await stockDe(hogar)).toEqual(hogarAntes)

  // Quien armó el hogar (Carla): pasa a ser creadora Ema, que lleva más tiempo que Fede
  await como(CARLA, () => filas('select public.borrar_mi_cuenta()'))
  expect(await cuantos('from auth.users where id = $1', [CARLA])).toBe(0)
  expect(await cuantos('from public.hogar_miembros where user_id = $1', [CARLA])).toBe(0)
  const h = await mi(EMA)
  expect(h.soy_creador).toBe(true)
  expect(h.miembros.map((m) => m.nombre)).toEqual(['Ema', 'Fede'])
  expect(await stockDe(hogar)).toEqual(hogarAntes)
  expect(await huerfanas()).toBe(0)
})

test('el hogar se borra con su despensa cuando se va la última persona', async () => {
  await como(EMA, () => rpc('salir_del_hogar', []))
  expect((await mi(FEDE)).soy_creador).toBe(true)
  const hogarAntes = await stockDe(hogar)
  expect(Object.keys(hogarAntes).length).toBeGreaterThan(0)
  await como(FEDE, () => rpc('salir_del_hogar', []))
  expect(await hogaresVivos()).toBe(0)
  for (const t of ['stock', 'prepared', 'shopping_items', 'purchases'])
    expect(await cuantos(`from public.${t} where user_id = $1`, [hogar])).toBe(0)
  expect(await huerfanas()).toBe(0)
  // Los dos se llevaron su copia
  expect(await stockDe(FEDE)).toEqual(hogarAntes)
  expect(await stockDe(EMA)).toEqual(hogarAntes)
  expect(await como(FEDE, () => rpc('despensa_de', []))).toBe(FEDE)
  expect(await veStock(FEDE)).toEqual(hogarAntes)
})

test('borrar la cuenta de la última persona de un hogar lo borra, y borrar un usuario desde el panel no deja nada suelto', async () => {
  const nuevo = await como(GABI, () => rpc('crear_hogar', ['Casa de Gabi']))
  await poner(GABI, [{ food_id: id.sal, delta: 3 }])
  const deDani = await stockDe(DANI) // Dani trae lo suyo de antes: se suma a lo de Gabi
  expect(await como(DANI, () => rpc('unirse_al_hogar', [nuevo.codigo]))).toEqual({ ok: true })
  expect(await stockDe(nuevo.id)).toEqual({ ...deDani, sal: (deDani.sal ?? 0) + 3 })
  await como(GABI, () => filas('select public.borrar_mi_cuenta()'))
  expect((await mi(DANI)).soy_creador).toBe(true)
  expect(await hogaresVivos()).toBe(1)
  // Dani lo borra el administrador desde el panel de Supabase (no pasa por borrar_mi_cuenta): igual no queda nada
  await db.query('delete from auth.users where id = $1', [DANI])
  expect(await hogaresVivos()).toBe(0)
  for (const t of ['stock', 'prepared', 'shopping_items', 'purchases']) {
    expect(await cuantos(`from public.${t} where user_id = $1`, [nuevo.id])).toBe(0)
    expect(await cuantos(`from public.${t} where user_id = $1`, [DANI])).toBe(0)
  }
  expect(await huerfanas()).toBe(0)
  expect(await cuantos('from public.hogar_miembros')).toBe(0)
})

test('quienes salieron de un hogar vuelven a tener su despensa de siempre, y el hogar borrado no deja nada', async () => {
  // Ana se fue hace rato: su despensa es la suya y se mueve sola
  expect(await como(ANA, () => rpc('despensa_de', []))).toBe(ANA)
  const antes = (await veStock(ANA)).huevo
  await poner(ANA, [{ food_id: id.huevo, delta: -1 }])
  expect((await veStock(ANA)).huevo).toBe(antes - 1)
  expect((await stockDe(ANA)).huevo).toBe(antes - 1)
  expect(await hogaresVivos()).toBe(0)
  expect(await huerfanas()).toBe(0)
})

test('al unirse se suma cada cosa como corresponde: despensa y tuppers se suman, la lista queda con lo mayor, las compras son las de 90 días', async () => {
  const hace = (dias) => new Date(Date.now() - dias * 86400000).toISOString().slice(0, 10)
  // Ivan: despensa, lista, tuppers y una compra reciente
  await poner(IVAN, [
    { food_id: id.huevo, delta: 10 },
    { food_id: id.sal, delta: 5 },
  ])
  await como(IVAN, () => db.query('insert into public.shopping_items (user_id, food_id, qty) values ($1, $2, 3)', [IVAN, id.tomate]))
  await como(IVAN, () => rpc('cocinar', [RECETA_A(), 2, '[]', null]))
  await como(IVAN, () => rpc('comprar', [id.arroz, 1, 100, hace(10), null, null]))
  const casa = await como(IVAN, () => rpc('crear_hogar', ['Casa de Ivan']))
  // Juli: algo agotado (en cero, también entra para que siga figurando), la misma receta cocinada, otro pedido del mismo tomate y compras vieja y nueva
  await poner(JULI, [{ food_id: id.huevo, delta: 4 }])
  await db.query('insert into public.stock (user_id, food_id, qty) values ($1, $2, 0)', [JULI, id.leche])
  await como(JULI, () => db.query('insert into public.shopping_items (user_id, food_id, qty) values ($1, $2, 8)', [JULI, id.tomate]))
  await como(JULI, () => rpc('cocinar', [RECETA_A(), 1.5, '[]', null]))
  await como(JULI, () => rpc('comprar', [id.arroz, 1, 100, hace(10), null, null])) // igual a la de Ivan
  await como(JULI, () => rpc('comprar', [id.sal, 1, 50, hace(10), null, null]))
  await como(JULI, () => rpc('comprar', [id.huevo, 1, 70, hace(120), null, null])) // de hace 4 meses
  expect(await como(JULI, () => rpc('unirse_al_hogar', [casa.codigo]))).toEqual({ ok: true })
  // Despensa: huevo 10 + (4 + 1 de su compra vieja) · sal 5 + 1 que compró Juli · arroz 1 + 1 (cada uno compró uno) · leche agotada
  expect(await veStock(IVAN)).toEqual({ huevo: 15, sal: 6, arroz: 2, leche: 0 })
  expect(await veLista(JULI)).toEqual({ tomate: 8 })
  expect(await veTuppers(JULI)).toEqual({ 'arroz-con-pollo': 3.5 })
  // Compras: la de arroz que tenían las dos se copia una sola vez, la de sal entra y la de hace 120 días no
  const compras = await como(IVAN, () => filas('select food_id from public.purchases order by food_id'))
  expect(compras.map((c) => c.food_id).sort()).toEqual([id.arroz, id.sal].sort())
})

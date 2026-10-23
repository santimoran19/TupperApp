// La base de la 1.24 (supabase/actualizacion-19.sql): vencimientos de la despensa, fotos de alimentos y recetas y músculos
// de cada entrenamiento. Contra un Postgres de verdad, entrando como cada usuario.
import { beforeAll, describe, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo, j } from './postgres.js'

let como, filas, una, rpc, db, id, receta

beforeAll(async () => {
  ;({ db, como, filas, una, rpc, id, receta } = await abrirBase())
  await db.query(
    `insert into public.profiles (id, name, sex, height_cm, weight_kg) values ($1, 'Ana', 'f', 165, 60), ($2, 'Beto', 'm', 180, 80)`,
    [ANA, BETO],
  )
}, 60000)

const stock = (usuario, food, qty, vence = null) =>
  filas(
    `insert into public.stock (user_id, food_id, qty, expires_on) values ($1, $2, $3, $4)
     on conflict (user_id, food_id) do update set qty = excluded.qty, expires_on = excluded.expires_on returning *`,
    [usuario, food, qty, vence],
  )
const fecha = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null)

describe('vencimientos', () => {
  test('lo que ya estaba cargado queda sin fecha; cada persona pone y cambia la suya', async () => {
    await stock(ANA, id.huevo, 12)
    expect((await una('select expires_on from public.stock where user_id = $1 and food_id = $2', [ANA, id.huevo])).expires_on).toBeNull()
    const [f] = await como(ANA, () =>
      filas(`update public.stock set expires_on = '2026-10-30' where user_id = $1 and food_id = $2 returning expires_on`, [ANA, id.huevo]),
    )
    expect(fecha(f.expires_on)).toBe('2026-10-30')
    // La de otra persona no la ve ni la toca
    const ajena = await como(BETO, () =>
      filas(`update public.stock set expires_on = '2026-11-01' where user_id = $1 and food_id = $2 returning 1`, [ANA, id.huevo]),
    )
    expect(ajena).toEqual([])
  })

  test('fechas imposibles no entran', async () => {
    expect(
      await fallo(
        como(ANA, () => filas(`update public.stock set expires_on = '1999-12-31' where user_id = $1 and food_id = $2`, [ANA, id.huevo])),
      ),
    ).toMatch(/stock_vence_chk/)
    expect(
      await fallo(
        como(ANA, () => filas(`update public.stock set expires_on = '2101-01-01' where user_id = $1 and food_id = $2`, [ANA, id.huevo])),
      ),
    ).toMatch(/stock_vence_chk/)
  })

  test('al agotarse, la fecha se borra sola (también al cocinar o registrar con mover_stock)', async () => {
    await stock(ANA, id.leche, 1000, '2026-10-10')
    const [r] = await como(ANA, () => rpc('mover_stock', [j([{ food_id: id.leche, delta: -1000 }]), false]).then((x) => [x]))
    expect(r).toBeTruthy()
    const fila = await una('select qty, expires_on from public.stock where user_id = $1 and food_id = $2', [ANA, id.leche])
    expect(Number(fila.qty)).toBe(0)
    expect(fila.expires_on).toBeNull()
    // Y no se puede poner fecha a algo agotado
    await como(ANA, () => filas(`update public.stock set expires_on = '2026-10-20' where user_id = $1 and food_id = $2`, [ANA, id.leche]))
    expect((await una('select expires_on from public.stock where user_id = $1 and food_id = $2', [ANA, id.leche])).expires_on).toBeNull()
    // Si sigue habiendo, la fecha queda
    await stock(ANA, id.arroz, 1000, '2027-01-01')
    await como(ANA, () => rpc('mover_stock', [j([{ food_id: id.arroz, delta: -200 }]), false]))
    expect(fecha((await una('select expires_on from public.stock where user_id = $1 and food_id = $2', [ANA, id.arroz])).expires_on)).toBe(
      '2027-01-01',
    )
  })

  test('el hogar suma las despensas con la fecha que vence antes, y al irse cada uno se lleva la suya', async () => {
    await stock(ANA, id.huevo, 12, '2026-10-30')
    await stock(BETO, id.huevo, 6, '2026-10-20')
    await stock(BETO, id.tomate, 3, '2026-10-15')
    const h = await como(ANA, () => rpc('crear_hogar', ['Casa']))
    await como(BETO, () => rpc('unirse_al_hogar', [h.codigo]))
    const delHogar = async (food) => una('select qty, expires_on from public.stock where user_id = $1 and food_id = $2', [h.id, food])
    const huevos = await delHogar(id.huevo)
    expect(Number(huevos.qty)).toBe(18)
    expect(fecha(huevos.expires_on)).toBe('2026-10-20')
    expect(fecha((await delHogar(id.tomate)).expires_on)).toBe('2026-10-15')
    // Beto se va: se lleva una copia de la despensa del hogar, con las fechas
    await como(BETO, () => rpc('salir_del_hogar', []))
    const suya = await una('select expires_on from public.stock where user_id = $1 and food_id = $2', [BETO, id.huevo])
    expect(fecha(suya.expires_on)).toBe('2026-10-20')
  })
})

describe('fotos', () => {
  test('cada persona le pone foto a lo suyo; una ruta rara no entra', async () => {
    const ruta = `u/${ANA}/abc123.webp`
    const [a] = await como(ANA, () =>
      filas(`insert into public.foods (owner, name, unit, kcal, image_path) values ($1, 'Mi pan', 'g', 250, $2) returning *`, [ANA, ruta]),
    )
    expect(a.image_path).toBe(ruta)
    expect(
      await fallo(como(ANA, () => filas(`update public.foods set image_path = 'http://otro.sitio/x.png' where id = $1`, [a.id]))),
    ).toMatch(/foods_foto_chk/)
    expect(await fallo(como(ANA, () => filas(`update public.foods set image_path = '../../x.webp' where id = $1`, [a.id])))).toMatch(
      /foods_foto_chk/,
    )
    // .jpg también vale (los teléfonos que no saben hacer WebP)
    await como(ANA, () => filas(`update public.foods set image_path = $2 where id = $1`, [a.id, `u/${ANA}/abc124.jpg`]))
    // Las de la base no las cambia nadie desde la app (solo el script con la clave de servicio)
    expect(
      await como(ANA, () => filas(`update public.foods set image_path = 'base/huevo.webp' where id = $1 returning 1`, [id.huevo])),
    ).toEqual([])
    expect(
      await como(ANA, () =>
        filas(`update public.recipes set image_path = 'base/x.webp' where id = $1 returning 1`, [receta['arroz-con-pollo']]),
      ),
    ).toEqual([])
    // Como administrador (el script) sí, con la ruta de la base
    await filas(`update public.recipes set image_path = 'base/arroz-con-pollo.webp' where id = $1`, [receta['arroz-con-pollo']])
    expect((await una('select image_path from public.recipes where id = $1', [receta['arroz-con-pollo']])).image_path).toBe(
      'base/arroz-con-pollo.webp',
    )
  })
})

describe('músculos de cada entrenamiento', () => {
  const W = '10000000-0000-0000-0000-00000000000f'
  const datos = (extra = {}) => ({ fecha: '2026-10-19', name: 'Funcional', duration_min: 40, kcal: 250, metodo: 'mets', ...extra })

  test('se guardan, se corrigen y una versión vieja de la app no los borra', async () => {
    await filas(`update public.profiles set gasto_activo = true, gasto_consentimiento = now() where id = $1`, [ANA])
    let r = await como(ANA, () => rpc('guardar_entrenamiento', [W, j(datos({ muscles: ['abdomen', 'hombros', 'abdomen'] })), '[]']))
    expect([...r.entrenamiento.muscles].sort()).toEqual(['abdomen', 'hombros'])
    r = await como(ANA, () => rpc('guardar_entrenamiento', [W, j(datos({ muscles: ['pecho'] })), '[]']))
    expect(r.entrenamiento.muscles).toEqual(['pecho'])
    // Sin `muscles` en el pedido (app 1.23): quedan los que había
    r = await como(ANA, () => rpc('guardar_entrenamiento', [W, j(datos({ duration_min: 50 })), '[]']))
    expect(r.entrenamiento.muscles).toEqual(['pecho'])
    expect(r.entrenamiento.duration_min).toBe(50)
    // Lista vacía: se borran
    r = await como(ANA, () => rpc('guardar_entrenamiento', [W, j(datos({ muscles: [] })), '[]']))
    expect(r.entrenamiento.muscles).toEqual([])
  })

  test('solo grupos conocidos y en forma de lista', async () => {
    expect(await fallo(como(ANA, () => rpc('guardar_entrenamiento', [W, j(datos({ muscles: ['pecho', 'nariz'] })), '[]'])))).toMatch(
      /workouts_musculos_chk/,
    )
    expect(await fallo(como(ANA, () => rpc('guardar_entrenamiento', [W, j(datos({ muscles: 'pecho' })), '[]'])))).toMatch(
      /músculos no son válidos/,
    )
  })
})

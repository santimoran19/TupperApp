// La base de F-19 (supabase/actualizacion-15.sql, -16.sql, -17.sql y seed-6/seed-7): el perfil del gasto, las actividades,
// los entrenamientos, el gimnasio y que todo sea personal. Se prueba contra un Postgres de verdad, entrando como cada usuario.
import { beforeAll, describe, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo, j } from './postgres.js'

let como, filas, una, rpc, db

beforeAll(async () => {
  ;({ db, como, filas, una, rpc } = await abrirBase())
  // Dos perfiles como los de cualquier cuenta que ya existía
  await db.query(
    `insert into public.profiles (id, name, sex, height_cm, weight_kg) values ($1, 'Ana', 'f', 165, 60), ($2, 'Beto', 'm', 180, 80)`,
    [ANA, BETO],
  )
}, 60000)

const W1 = '10000000-0000-0000-0000-000000000001'
const W2 = '10000000-0000-0000-0000-000000000002'
const W3 = '10000000-0000-0000-0000-000000000003'
const R1 = '20000000-0000-0000-0000-000000000001'
const R2 = '20000000-0000-0000-0000-000000000002'
const entreno = (extra = {}) => ({
  fecha: '2026-10-19',
  type_id: null,
  name: 'Correr',
  duration_min: 45,
  distance_km: 8,
  ascent_m: 40,
  avg_hr: 150,
  rpe: 6,
  kcal_watch: null,
  kcal: 520.4,
  metodo: 'pulso',
  peso_kg: 60,
  notes: 'Con lluvia',
  ...extra,
})
const serie = (orden, ejercicioId, n, extra = {}) => ({
  orden,
  exercise_id: ejercicioId,
  set_no: n,
  reps: 8,
  weight_kg: 60,
  rpe: 8,
  warmup: false,
  ...extra,
})
const activar = (usuario) => filas(`update public.profiles set gasto_activo = true, gasto_consentimiento = now() where id = $1`, [usuario])
const tipo = async (slug) => (await una('select id from public.exercise_types where slug = $1', [slug])).id
const ejercicio = async (slug) => (await una('select id from public.gym_exercises where slug = $1', [slug])).id

describe('fase 1: el perfil', () => {
  test('las cuentas que ya existen quedan como estaban: el cálculo nuevo apagado y sin datos nuevos', async () => {
    const p = await una('select * from public.profiles where id = $1', [ANA])
    expect(p).toMatchObject({
      gasto_activo: false,
      gasto_consentimiento: null,
      gasto_modo: 'fijo',
      gasto_devuelve: 50,
      body_fat_pct: null,
      work_type: null,
      steps_per_day: null,
      resting_hr: null,
      gasto_ajuste_pct: null,
      gasto_factor: null,
      gasto_factor_fecha: null,
    })
    // y el objetivo de siempre no se tocó
    expect(p.kcal_target).toBe(2000)
    expect(Number(p.activity)).toBe(1.375)
  })

  test('no se puede prender sin dejar constancia del consentimiento', async () => {
    await como(ANA, async () => {
      expect(await fallo(filas('update public.profiles set gasto_activo = true where id = $1', [ANA]))).toMatch(/profiles_gasto_chk/)
      expect(await fallo(activar(ANA))).toBeNull()
      // apagarlo y prenderlo de nuevo con la constancia que ya hay
      expect(await fallo(filas('update public.profiles set gasto_activo = false where id = $1', [ANA]))).toBeNull()
      expect(await fallo(filas('update public.profiles set gasto_activo = true where id = $1', [ANA]))).toBeNull()
    })
    // el consentimiento no se puede borrar mientras está prendido
    await como(ANA, async () => {
      expect(await fallo(filas('update public.profiles set gasto_consentimiento = null where id = $1', [ANA]))).toMatch(
        /profiles_gasto_chk/,
      )
    })
  })

  test.each([
    ['body_fat_pct', 2.9, 3, 60, 60.1],
    ['steps_per_day', -1, 0, 60000, 60001],
    ['resting_hr', 29, 30, 120, 121],
    ['gasto_devuelve', -1, 0, 100, 101],
    ['gasto_ajuste_pct', -40.1, -40, 30, 30.1],
    ['gasto_factor', 0.69, 0.7, 1.3, 1.31],
  ])('%s: fuera de rango no entra', async (columna, bajo, min, max, alto) => {
    await como(ANA, async () => {
      const poner = (v) => filas(`update public.profiles set ${columna} = $1 where id = $2`, [v, ANA])
      expect(await fallo(poner(bajo))).toMatch(/profiles_gasto_chk/)
      expect(await fallo(poner(alto))).toMatch(/profiles_gasto_chk/)
      expect(await fallo(poner(min))).toBeNull()
      expect(await fallo(poner(max))).toBeNull()
    })
  })

  test('tipo de trabajo, modo y decimales', async () => {
    await como(ANA, async () => {
      for (const t of ['escritorio', 'de_pie', 'fisico', null])
        expect(await fallo(filas('update public.profiles set work_type = $1 where id = $2', [t, ANA]))).toBeNull()
      expect(await fallo(filas(`update public.profiles set work_type = 'volando' where id = $1`, [ANA]))).toMatch(/profiles_gasto_chk/)
      expect(await fallo(filas(`update public.profiles set gasto_modo = 'dinamico' where id = $1`, [ANA]))).toBeNull()
      expect(await fallo(filas(`update public.profiles set gasto_modo = 'otro' where id = $1`, [ANA]))).toMatch(/profiles_gasto_chk/)
      const enorme = '1.' + '2345'.repeat(500)
      expect(await fallo(filas('update public.profiles set gasto_factor = $1 where id = $2', [enorme, ANA]))).toMatch(/profiles_gasto/)
    })
  })

  test('una fila de perfil con todo lleno sigue pesando menos del tope', async () => {
    await como(ANA, async () => {
      const r = await fallo(
        filas(
          `update public.profiles set name = $1, username = 'ana.prueba', body_fat_pct = 22.5, work_type = 'de_pie', steps_per_day = 9000,
             resting_hr = 58, gasto_ajuste_pct = -18.5, gasto_factor = 1.0432, gasto_factor_fecha = '2026-10-19' where id = $2`,
          ['x'.repeat(60), ANA],
        ),
      )
      expect(r).toBeNull()
    })
    const { peso } = await una('select pg_column_size(p.*) as peso from public.profiles p where id = $1', [ANA])
    expect(peso).toBeLessThan(1200)
  })

  test('cada persona ve y cambia solo su perfil', async () => {
    await como(BETO, async () => {
      expect(await filas('select id from public.profiles')).toEqual([{ id: BETO }])
      await filas(`update public.profiles set body_fat_pct = 10 where id = $1`, [ANA])
    })
    expect((await una('select body_fat_pct from public.profiles where id = $1', [ANA])).body_fat_pct).toBe('22.5')
  })
})

describe('fase 2: actividades', () => {
  test('el catálogo base entra con sus METs ordenados', async () => {
    const r = await una(`select count(*)::int as n, count(distinct slug)::int as slugs,
      bool_and(mets_suave <= mets_medio and mets_medio <= mets_fuerte) as ordenados from public.exercise_types where owner is null`)
    expect(r.n).toBeGreaterThanOrEqual(90)
    expect(r.slugs).toBe(r.n)
    expect(r.ordenados).toBe(true)
    const correr = await una(
      `select mets_suave, mets_medio, mets_fuerte, metrica, usa_distancia from public.exercise_types where slug = 'correr'`,
    )
    expect(correr).toMatchObject({ mets_suave: '7.5', mets_medio: '9.3', mets_fuerte: '12', metrica: 'correr', usa_distancia: true })
  })

  test('todas las personas ven las actividades base y no pueden cambiarlas', async () => {
    await como(ANA, async () => {
      expect((await filas('select 1 from public.exercise_types')).length).toBeGreaterThanOrEqual(90)
      expect(await filas(`update public.exercise_types set mets_medio = 1 where slug = 'correr' returning 1`)).toEqual([])
      expect(await filas(`delete from public.exercise_types where slug = 'correr' returning 1`)).toEqual([])
      expect(
        await fallo(
          filas(`insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte) values (null, 'Mía', 2, 3, 4)`),
        ),
      ).toMatch(/row-level security/)
    })
  })

  test('una actividad propia: se ve solo y tiene sus controles', async () => {
    const nueva = (extra = '') =>
      filas(
        `insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte ${extra ? ', ' + extra.split('=')[0] : ''})
             values ($1, 'Mi deporte', 2, 3, 4 ${extra ? ', ' + extra.split('=')[1] : ''}) returning id`,
        [ANA],
      )
    await como(ANA, async () => {
      expect(await fallo(nueva())).toBeNull()
      expect(await fallo(nueva(`slug='mio'`))).toMatch(/exercise_types_slug_chk/)
      expect(await fallo(nueva(`category='inventada'`))).toMatch(/exercise_types_categoria_chk/)
      expect(await fallo(nueva(`metrica='nadar'`))).toMatch(/exercise_types_metrica_chk/)
      expect(
        await fallo(
          filas(`insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte) values ($1, 'x', 5, 3, 4)`, [ANA]),
        ),
      ).toMatch(/exercise_types_mets_chk/)
      expect(
        await fallo(
          filas(`insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte) values ($1, 'x', 0.5, 3, 4)`, [ANA]),
        ),
      ).toMatch(/exercise_types_mets_chk/)
      expect(
        await fallo(
          filas(`insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte) values ($1, 'x', 3, 4, 21)`, [ANA]),
        ),
      ).toMatch(/exercise_types_mets_chk/)
      expect(
        await fallo(
          filas(`insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte) values ($1, '   ', 3, 4, 5)`, [ANA]),
        ),
      ).toMatch(/exercise_types_nombre_chk/)
      // no puede crearla a nombre de otra persona
      expect(
        await fallo(
          filas(`insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte) values ($1, 'x', 3, 4, 5)`, [BETO]),
        ),
      ).toMatch(/row-level security/)
    })
    await como(BETO, async () => {
      expect(await filas(`select 1 from public.exercise_types where name = 'Mi deporte'`)).toEqual([])
    })
  })
})

describe('fase 2: entrenamientos', () => {
  test('sin el cálculo prendido no se anota ejercicio', async () => {
    await como(BETO, async () => {
      expect(await fallo(rpc('guardar_entrenamiento', [W1, j(entreno())]))).toMatch(/activá el cálculo de gasto/)
    })
    expect((await una(`select count(*)::int as n from public.workouts`)).n).toBe(0)
  })

  test('se guarda y devuelve la fila; mandarlo dos veces no lo duplica', async () => {
    await como(ANA, async () => {
      const r = await rpc('guardar_entrenamiento', [W1, j(entreno({ type_id: await tipo('correr') }))])
      expect(r.entrenamiento).toMatchObject({
        id: W1,
        user_id: ANA,
        fecha: '2026-10-19',
        name: 'Correr',
        duration_min: 45,
        metodo: 'pulso',
      })
      expect(Number(r.entrenamiento.kcal)).toBeCloseTo(520.4)
      await rpc('guardar_entrenamiento', [W1, j(entreno({ type_id: await tipo('correr') }))])
      expect((await filas('select 1 from public.workouts')).length).toBe(1)
    })
  })

  test('guarda si las calorías del reloj eran activas o totales (por defecto, totales: así estaban antes)', async () => {
    const ID = '30000000-0000-0000-0000-0000000000a1'
    await como(ANA, async () => {
      const a = await rpc('guardar_entrenamiento', [ID, j(entreno({ kcal_watch: 400, metodo: 'reloj', kcal: 400, watch_activas: true }))])
      expect(a.entrenamiento).toMatchObject({ kcal_watch: 400, watch_activas: true })
      const b = await rpc('guardar_entrenamiento', [ID, j(entreno({ kcal_watch: 400, metodo: 'reloj', kcal: 350, watch_activas: false }))])
      expect(b.entrenamiento.watch_activas).toBe(false)
      // Un pedido de la versión anterior de la app, que no manda el dato, queda como totales
      const c = await rpc('guardar_entrenamiento', [ID, j(entreno({ kcal_watch: 400, metodo: 'reloj', kcal: 350 }))])
      expect(c.entrenamiento.watch_activas).toBe(false)
      await filas('delete from public.workouts where id = $1', [ID])
    })
  })

  test('volver a guardar lo pisa', async () => {
    await como(ANA, async () => {
      const r = await rpc('guardar_entrenamiento', [
        W1,
        j(entreno({ duration_min: 60, kcal: 700, notes: null, avg_hr: null, metodo: 'distancia' })),
      ])
      expect(r.entrenamiento).toMatchObject({ duration_min: 60, notes: null, avg_hr: null, metodo: 'distancia' })
      expect((await filas('select 1 from public.workouts')).length).toBe(1)
    })
  })

  test('el de otra persona no se puede pisar ni ver', async () => {
    await db.query(`update public.profiles set gasto_activo = true, gasto_consentimiento = now() where id = $1`, [BETO])
    await como(BETO, async () => {
      expect(await filas('select 1 from public.workouts')).toEqual([])
      const e = await fallo(rpc('guardar_entrenamiento', [W1, j(entreno({ name: 'Robado' }))]))
      expect(e).not.toBeNull()
    })
    expect((await una('select name from public.workouts where id = $1', [W1])).name).toBe('Correr')
    // y no puede cargar uno a nombre de Ana por SQL directo
    await como(BETO, async () => {
      expect(
        await fallo(
          filas(`insert into public.workouts (id, user_id, fecha, name, duration_min, kcal) values ($1, $2, '2026-10-19', 'x', 10, 10)`, [
            W3,
            ANA,
          ]),
        ),
      ).toMatch(/row-level security/)
    })
  })

  test('una actividad que ya no existe no pierde el entrenamiento: queda sin vínculo y con su nombre', async () => {
    await como(ANA, async () => {
      const r = await rpc('guardar_entrenamiento', [W2, j(entreno({ type_id: '99999999-9999-9999-9999-999999999999', name: 'Pádel' }))])
      expect(r.entrenamiento).toMatchObject({ type_id: null, name: 'Pádel' })
    })
  })

  test('cada dato fuera de rango se rechaza', async () => {
    const intentar = (extra) => fallo(rpc('guardar_entrenamiento', ['30000000-0000-0000-0000-000000000009', j(entreno(extra))]))
    await como(ANA, async () => {
      expect(await intentar({ duration_min: 0 })).toMatch(/workouts_duracion_chk/)
      expect(await intentar({ duration_min: 1441 })).toMatch(/workouts_duracion_chk/)
      expect(await intentar({ distance_km: 1001 })).toMatch(/workouts_distancia_chk/)
      expect(await intentar({ ascent_m: -1 })).toMatch(/workouts_desnivel_chk/)
      expect(await intentar({ avg_hr: 20 })).toMatch(/workouts_pulso_chk/)
      expect(await intentar({ avg_hr: 231 })).toMatch(/workouts_pulso_chk/)
      expect(await intentar({ rpe: 11 })).toMatch(/workouts_esfuerzo_chk/)
      expect(await intentar({ kcal_watch: 10001 })).toMatch(/workouts_reloj_chk/)
      expect(await intentar({ kcal: -5 })).toMatch(/workouts_kcal_chk/)
      expect(await intentar({ kcal: 20001 })).toMatch(/workouts_kcal_chk/)
      expect(await intentar({ metodo: 'adivinando' })).toMatch(/workouts_metodo_chk/)
      expect(await intentar({ peso_kg: 10 })).toMatch(/workouts_peso_chk/)
      expect(await intentar({ notes: 'a'.repeat(301) })).toMatch(/workouts_notas_chk/)
      expect(await intentar({ name: '   ' })).toMatch(/workouts_nombre_chk/)
      expect(await intentar({ fecha: '1999-01-01' })).toMatch(/workouts_fecha_chk/)
      expect(await intentar({ kcal: '1.' + '2345'.repeat(500) })).toMatch(/workouts_(decimales|peso_fila)_chk/)
      expect(await intentar({ fecha: 'mañana' })).not.toBeNull()
      expect(await intentar({})).toBeNull()
    })
  })

  test('datos que no son un objeto o sin identificador', async () => {
    await como(ANA, async () => {
      expect(await fallo(rpc('guardar_entrenamiento', [W3, j([1, 2])]))).toMatch(/no son válidos/)
      expect(await fallo(rpc('guardar_entrenamiento', [null, j(entreno())]))).toMatch(/no son válidos/)
    })
    await como(null, async () => {
      expect(await fallo(rpc('guardar_entrenamiento', [W3, j(entreno())]))).toMatch(/permission denied/)
    })
  })

  test('se borra con el borrado común y nadie más puede borrarlo', async () => {
    await como(BETO, async () => {
      expect(await filas('delete from public.workouts where id = $1 returning 1', [W2])).toEqual([])
    })
    await como(ANA, async () => {
      expect((await filas('delete from public.workouts where id = $1 returning 1', [W2])).length).toBe(1)
    })
  })
})

describe('fase 3: gimnasio', () => {
  test('el catálogo base entra', async () => {
    const r = await una(`select count(*)::int as n, count(distinct slug)::int as slugs from public.gym_exercises where owner is null`)
    expect(r).toEqual({ n: 150, slugs: 150 })
    expect(await una(`select grupo, equipo, peso_corporal from public.gym_exercises where slug = 'dominadas'`)).toEqual({
      grupo: 'espalda',
      equipo: 'peso_corporal',
      peso_corporal: true,
    })
  })

  test('ejercicios propios: controles y privacidad', async () => {
    const nuevo = (extra = {}) => {
      const f = { owner: ANA, name: 'Mi ejercicio', grupo: 'pecho', equipo: 'barra', ...extra }
      return filas(
        `insert into public.gym_exercises (${Object.keys(f).join(',')}) values (${Object.keys(f).map((_, i) => '$' + (i + 1))}) returning id`,
        Object.values(f),
      )
    }
    await como(ANA, async () => {
      expect(await fallo(nuevo())).toBeNull()
      expect(await fallo(nuevo({ grupo: 'cuello' }))).toMatch(/gym_exercises_grupo_chk/)
      expect(await fallo(nuevo({ equipo: 'magia' }))).toMatch(/gym_exercises_equipo_chk/)
      expect(await fallo(nuevo({ slug: 'mio' }))).toMatch(/gym_exercises_slug_chk/)
      expect(await fallo(nuevo({ owner: null }))).toMatch(/row-level security/)
    })
    await como(BETO, async () => {
      expect(await filas(`select 1 from public.gym_exercises where name = 'Mi ejercicio'`)).toEqual([])
    })
  })

  test('guardar una rutina: crea, reemplaza y respeta el orden', async () => {
    const sentadilla = await ejercicio('sentadilla')
    const banca = await ejercicio('press-banca')
    const remo = await ejercicio('remo-barra')
    await como(ANA, async () => {
      const r = await rpc('guardar_rutina', [
        R1,
        'Día A',
        j([{ exercise_id: sentadilla, sets_target: 4, reps_min: 5, reps_max: 8, rest_seconds: 120 }, { exercise_id: banca }]),
        'Lunes',
      ])
      expect(r.rutina).toMatchObject({ id: R1, user_id: ANA, name: 'Día A', notes: 'Lunes' })
      expect(r.ejercicios.map((e) => [e.position, e.exercise_id])).toEqual([
        [0, sentadilla],
        [1, banca],
      ])
      expect(r.ejercicios[1]).toMatchObject({ sets_target: 3, reps_min: 8, reps_max: 12, rest_seconds: null })
      // se reemplaza entero
      const r2 = await rpc('guardar_rutina', [
        R1,
        'Día A+',
        j([{ exercise_id: remo }, { exercise_id: sentadilla }, { exercise_id: banca }]),
        null,
      ])
      expect(r2.rutina).toMatchObject({ name: 'Día A+', notes: null })
      expect(r2.ejercicios.map((e) => e.exercise_id)).toEqual([remo, sentadilla, banca])
      expect((await filas('select 1 from public.routines')).length).toBe(1)
      expect((await filas('select 1 from public.routine_exercises')).length).toBe(3)
    })
  })

  test('una rutina: validaciones y privacidad', async () => {
    const sentadilla = await ejercicio('sentadilla')
    await como(ANA, async () => {
      expect(await fallo(rpc('guardar_rutina', [R2, '', j([]), null]))).toMatch(/entre 1 y 40/)
      expect(await fallo(rpc('guardar_rutina', [R2, 'a'.repeat(41), j([]), null]))).toMatch(/entre 1 y 40/)
      expect(await fallo(rpc('guardar_rutina', [R2, 'Mala', j([{ exercise_id: '99999999-9999-9999-9999-999999999999' }]), null]))).toMatch(
        /ya no existe/,
      )
      expect(
        await fallo(rpc('guardar_rutina', [R2, 'Larga', j(Array.from({ length: 41 }, () => ({ exercise_id: sentadilla }))), null])),
      ).toMatch(/hasta 40/)
      expect(await fallo(rpc('guardar_rutina', [R2, 'Series', j([{ exercise_id: sentadilla, sets_target: 21 }]), null]))).toMatch(
        /routine_exercises_series_chk/,
      )
      expect(await fallo(rpc('guardar_rutina', [R2, 'Reps', j([{ exercise_id: sentadilla, reps_min: 10, reps_max: 5 }]), null]))).toMatch(
        /routine_exercises_reps_chk/,
      )
      expect(await fallo(rpc('guardar_rutina', [R2, 'Vacía', j([]), null]))).toBeNull()
    })
    // si algo falla no queda nada a medias
    expect(await filas(`select 1 from public.routines where name in ('Mala', 'Larga', 'Series', 'Reps')`)).toEqual([])
    await como(BETO, async () => {
      expect(await filas('select 1 from public.routines')).toEqual([])
      expect(await filas('select 1 from public.routine_exercises')).toEqual([])
      expect(await fallo(rpc('guardar_rutina', [R1, 'Robada', j([]), null]))).not.toBeNull()
    })
    expect((await una('select name from public.routines where id = $1', [R1])).name).toBe('Día A+')
  })

  test('una sesión con series se guarda entera, con la fecha del entrenamiento', async () => {
    const sentadilla = await ejercicio('sentadilla')
    const dominadas = await ejercicio('dominadas')
    await como(ANA, async () => {
      const r = await rpc('guardar_entrenamiento', [
        W3,
        j(
          entreno({
            name: 'Pesas',
            type_id: await tipo('pesas'),
            routine_id: R1,
            duration_min: 70,
            metodo: 'mets',
            distance_km: null,
            ascent_m: null,
          }),
        ),
        j([
          serie(0, sentadilla, 1, { warmup: true, weight_kg: 40, rpe: null }),
          serie(0, sentadilla, 2),
          serie(0, sentadilla, 3, { weight_kg: 62.5, rpe: 8.5 }),
          serie(1, dominadas, 1, { weight_kg: 0, reps: 10 }),
        ]),
      ])
      expect(r.entrenamiento).toMatchObject({ id: W3, routine_id: R1 })
      expect(r.series).toHaveLength(4)
      expect(r.series.map((s) => s.fecha)).toEqual(Array(4).fill('2026-10-19'))
      expect(r.series.map((s) => [s.orden, s.set_no])).toEqual([
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 1],
      ])
      expect(r.series[0]).toMatchObject({ warmup: true, rpe: null })
      expect(Number(r.series[2].weight_kg)).toBe(62.5)
    })
  })

  test('volver a mandarla reemplaza las series (no las duplica)', async () => {
    const sentadilla = await ejercicio('sentadilla')
    await como(ANA, async () => {
      const datos = j(entreno({ name: 'Pesas', duration_min: 75, routine_id: R1 }))
      await rpc('guardar_entrenamiento', [W3, datos, j([serie(0, sentadilla, 1), serie(0, sentadilla, 2)])])
      const r = await rpc('guardar_entrenamiento', [W3, datos, j([serie(0, sentadilla, 1), serie(0, sentadilla, 2)])])
      expect(r.series).toHaveLength(2)
      expect((await filas('select 1 from public.workout_sets')).length).toBeGreaterThanOrEqual(2)
      // sin el tercer argumento (una versión anterior de la app) borra las series: es el reemplazo completo
      const sola = await rpc('guardar_entrenamiento', [W3, datos])
      expect(sola.series).toEqual([])
      await rpc('guardar_entrenamiento', [W3, datos, j([serie(0, sentadilla, 1)])])
    })
  })

  test('todo o nada: una serie mala deshace también el entrenamiento nuevo', async () => {
    const sentadilla = await ejercicio('sentadilla')
    const antes = (await una('select count(*)::int as n from public.workouts')).n
    const NUEVO = '40000000-0000-0000-0000-000000000001'
    await como(ANA, async () => {
      const mal = (series) => fallo(rpc('guardar_entrenamiento', [NUEVO, j(entreno()), j(series)]))
      expect(await mal([serie(0, sentadilla, 1), serie(0, sentadilla, 1)])).toMatch(/workout_sets_unica_chk/)
      expect(await mal([serie(0, sentadilla, 1, { reps: 1001 })])).toMatch(/workout_sets_reps_chk/)
      expect(await mal([serie(0, sentadilla, 1, { weight_kg: 1001 })])).toMatch(/workout_sets_peso_chk/)
      expect(await mal([serie(0, sentadilla, 1, { weight_kg: 60.1234 })])).toMatch(/workout_sets_peso_chk/)
      expect(await mal([serie(0, sentadilla, 1, { rpe: 10.25 })])).toMatch(/workout_sets_esfuerzo_chk/)
      expect(await mal([serie(0, sentadilla, 1, { rpe: 0 })])).toMatch(/workout_sets_esfuerzo_chk/)
      expect(await mal([serie(100, sentadilla, 1)])).toMatch(/workout_sets_orden_chk/)
      expect(await mal([serie(0, '99999999-9999-9999-9999-999999999999', 1)])).toMatch(/ya no existe/)
      expect(await mal(Array.from({ length: 501 }, (_, i) => serie(0, sentadilla, 1 + (i % 99), { orden: Math.floor(i / 99) })))).toMatch(
        /hasta 500/,
      )
      expect(await mal('no es una lista')).toMatch(/no son válidas/)
    })
    expect((await una('select count(*)::int as n from public.workouts')).n).toBe(antes)
    expect((await filas('select 1 from public.workouts where id = $1', ['40000000-0000-0000-0000-000000000001'])).length).toBe(0)
  })

  test('las series de otra persona no se ven, y un ejercicio propio de otra no se puede usar', async () => {
    const banca = await ejercicio('press-banca')
    const ajeno = (
      await filas(`insert into public.gym_exercises (owner, name, grupo) values ($1, 'Secreto', 'pecho') returning id`, [ANA])
    )[0].id
    await como(BETO, async () => {
      expect(await filas('select 1 from public.workout_sets')).toEqual([])
      expect(
        await fallo(rpc('guardar_entrenamiento', ['50000000-0000-0000-0000-000000000001', j(entreno()), j([serie(0, ajeno, 1)])])),
      ).toMatch(/ya no existe/)
      expect(
        await fallo(rpc('guardar_rutina', ['50000000-0000-0000-0000-000000000002', 'Mía', j([{ exercise_id: ajeno }]), null])),
      ).toMatch(/ya no existe/)
      expect(
        await fallo(rpc('guardar_entrenamiento', ['50000000-0000-0000-0000-000000000003', j(entreno()), j([serie(0, banca, 1)])])),
      ).toBeNull()
    })
  })

  test('un ejercicio propio con series no se puede borrar; sin series, sí', async () => {
    const mio = (
      await filas(`insert into public.gym_exercises (owner, name, grupo) values ($1, 'Con historial', 'pecho') returning id`, [ANA])
    )[0].id
    await como(ANA, async () => {
      await rpc('guardar_entrenamiento', ['60000000-0000-0000-0000-000000000001', j(entreno({ name: 'Raro' })), j([serie(0, mio, 1)])])
      expect(await fallo(filas('delete from public.gym_exercises where id = $1', [mio]))).toMatch(/foreign key|workout_sets/)
      const libre = (
        await filas(`insert into public.gym_exercises (owner, name, grupo) values ($1, 'Sin historial', 'pecho') returning id`, [ANA])
      )[0].id
      expect(await fallo(filas('delete from public.gym_exercises where id = $1', [libre]))).toBeNull()
    })
  })

  test('borrar un entrenamiento se lleva sus series; borrar una rutina deja la sesión', async () => {
    await como(ANA, async () => {
      const antes = (await filas('select 1 from public.workout_sets where workout_id = $1', [W3])).length
      expect(antes).toBeGreaterThan(0)
      expect((await una('select routine_id from public.workouts where id = $1', [W3])).routine_id).toBe(R1)
      await filas('delete from public.routines where id = $1', [R1])
      expect((await una('select routine_id from public.workouts where id = $1', [W3])).routine_id).toBeNull()
      expect((await filas('select 1 from public.routine_exercises where routine_id = $1', [R1])).length).toBe(0)
      await filas('delete from public.workouts where id = $1', [W3])
      expect((await filas('select 1 from public.workout_sets where workout_id = $1', [W3])).length).toBe(0)
    })
  })
})

describe('borrar la cuenta', () => {
  test('se lleva todo lo de F-19, incluidos los ejercicios propios con series', async () => {
    const banca = await ejercicio('press-banca')
    await como(BETO, async () => {
      const mio = (
        await filas(`insert into public.gym_exercises (owner, name, grupo) values ($1, 'Propio de Beto', 'pecho') returning id`, [BETO])
      )[0].id
      await filas(
        `insert into public.exercise_types (owner, name, mets_suave, mets_medio, mets_fuerte) values ($1, 'Propia de Beto', 2, 3, 4)`,
        [BETO],
      )
      await rpc('guardar_rutina', [
        '70000000-0000-0000-0000-000000000001',
        'De Beto',
        j([{ exercise_id: mio }, { exercise_id: banca }]),
        null,
      ])
      await rpc('guardar_entrenamiento', ['70000000-0000-0000-0000-000000000002', j(entreno()), j([serie(0, mio, 1), serie(1, banca, 1)])])
      expect((await filas('select 1 from public.workout_sets')).length).toBeGreaterThanOrEqual(2)
    })
    await como(BETO, () => filas('select public.borrar_mi_cuenta()'))
    for (const t of ['workouts', 'workout_sets', 'routines', 'exercise_types', 'gym_exercises'])
      expect(
        (
          await una(
            `select count(*)::int as n from public.${t} where ${t === 'exercise_types' || t === 'gym_exercises' ? 'owner' : 'user_id'} = $1`,
            [BETO],
          )
        ).n,
      ).toBe(0)
    expect(
      (await filas('select 1 from public.routine_exercises re join public.routines r on r.id = re.routine_id where r.user_id = $1', [BETO]))
        .length,
    ).toBe(0)
    // lo de Ana sigue ahí
    expect((await una('select count(*)::int as n from public.workouts where user_id = $1', [ANA])).n).toBeGreaterThan(0)
    // y el catálogo base también
    expect((await una('select count(*)::int as n from public.gym_exercises where owner is null')).n).toBe(150)
  })
})

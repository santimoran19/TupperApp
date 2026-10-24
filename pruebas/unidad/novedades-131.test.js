// 1.31: lo que se saca de la lista de compras va a la base y se comparte en el hogar (F-25, actualizacion-24.sql).
import { beforeAll, describe, expect, it } from 'vitest'
import { abrirBase, ANA, BETO, fallo } from './postgres.js'
import { GUARDADO, LOCAL } from '../../src/store/cambios.js'

describe('compras_quitadas en la base', () => {
  let b
  let arroz
  beforeAll(async () => {
    b = await abrirBase()
    for (const [u, n] of [
      [ANA, 'Ana'],
      [BETO, 'Beto'],
    ])
      await b.db.query('insert into public.profiles (id, name, username) values ($1, $2, $3) on conflict do nothing', [
        u,
        n,
        n.toLowerCase() + '.q',
      ])
    arroz = b.id.arroz
  }, 60000)

  const quitar = (usuario, dueno, qty = 500) =>
    b.como(usuario, () =>
      b.db.query('insert into public.compras_quitadas (user_id, food_id, qty) values ($1, $2, $3)', [dueno, arroz, qty]),
    )
  const ve = (usuario) => b.como(usuario, () => b.filas('select user_id, food_id, qty from public.compras_quitadas'))

  it('cada uno en su despensa, y nadie en la de otro', async () => {
    await quitar(ANA, ANA)
    expect(await ve(ANA)).toHaveLength(1)
    expect(await ve(BETO)).toEqual([])
    expect(await fallo(quitar(BETO, ANA))).toMatch(/row-level security/)
    expect(await fallo(quitar(ANA, ANA, 0))).toMatch(/check/)
  })

  it('en un hogar, lo que saca una persona lo ve la otra', async () => {
    const h = await b.como(ANA, () => b.rpc('crear_hogar', ['Casa']))
    await b.como(BETO, () => b.rpc('unirse_al_hogar', [h.codigo]))
    await quitar(BETO, h.id, 300)
    expect((await ve(ANA)).map((q) => [q.user_id, Number(q.qty)])).toEqual([[h.id, 300]])
    // Al borrarse el hogar (se van las dos), se borra lo suyo
    await b.como(BETO, () => b.rpc('salir_del_hogar', []))
    await b.como(ANA, () => b.rpc('salir_del_hogar', []))
    expect(await b.filas('select * from public.compras_quitadas where user_id = $1', [h.id])).toEqual([])
  })

  it('al borrar la cuenta (el perfil) no queda nada suelto', async () => {
    expect(await b.filas('select * from public.compras_quitadas where user_id = $1', [ANA])).toHaveLength(1)
    await b.db.query('delete from public.profiles where id = $1', [ANA])
    expect(await b.filas('select * from public.compras_quitadas where user_id = $1', [ANA])).toEqual([])
  })
})

describe('sin conexión: se aplica en el teléfono y se manda después', () => {
  it('sacar y devolver', () => {
    const s0 = { hogar: null, comprasQuitadas: [] }
    const s1 = LOCAL.quitarDelPlan(s0, { food_id: 'f1', qty: 200, cuando: '2026-10-24T10:00:00Z' }, 'yo')
    expect(s1.comprasQuitadas).toEqual([{ user_id: 'yo', food_id: 'f1', qty: 200, created_at: '2026-10-24T10:00:00Z', pendiente: true }])
    // Lo que contesta la base reemplaza a lo del teléfono
    const s2 = GUARDADO.quitarDelPlan(s1, [{ user_id: 'yo', food_id: 'f1', qty: 200, created_at: 'x' }])
    expect(s2.comprasQuitadas).toEqual([{ user_id: 'yo', food_id: 'f1', qty: 200, created_at: 'x' }])
    expect(LOCAL.devolverAlPlan(s2, { food_id: 'f1' }).comprasQuitadas).toEqual([])
    // Con una foto vieja (sin la lista de quitadas) no se rompe
    expect(LOCAL.quitarDelPlan({}, { food_id: 'f2', qty: 1 }, 'yo').comprasQuitadas).toHaveLength(1)
  })
})

describe('F-24: de estación y una receta para lo que vence', async () => {
  const { consejoDeTemporada, estaDeEstacion, deEstacion, recetaParaLoQueVence } = await import('../../src/lib/temporada.js')
  it('cada mes tiene frutas y verduras de estación', () => {
    for (let m = 1; m <= 12; m++) {
      expect(deEstacion(m).frutas.length, `mes ${m}`).toBeGreaterThan(2)
      expect(deEstacion(m).verduras.length, `mes ${m}`).toBeGreaterThan(3)
    }
  })
  it('reconoce lo de estación por nombre, con plural y sin tildes', () => {
    expect(estaDeEstacion({ name: 'Frutillas' }, 10)).toBe(true)
    expect(estaDeEstacion({ name: 'Mandarina' }, 6)).toBe(true)
    expect(estaDeEstacion({ name: 'Mandarina' }, 12)).toBe(false)
    expect(estaDeEstacion({ name: 'Brócoli congelado' }, 7)).toBe(true)
    // "pera" no es "pepino" ni "esperanza"
    expect(estaDeEstacion({ name: 'Galletitas Esperanza' }, 2)).toBe(false)
  })
  it('el consejo nombra lo que ya tenés de estación, o si no lo que conviene comprar', () => {
    const fila = (name, qty = 1) => ({ a: { name }, qty })
    expect(consejoDeTemporada('2026-10-24', [fila('Frutillas'), fila('Arroz')]).texto).toMatch(/^Frutillas está de estación en octubre/)
    expect(consejoDeTemporada('2026-10-24', [fila('Frutillas', 0)]).texto).toMatch(/^En octubre están de estación frutilla/)
    expect(consejoDeTemporada('basura')).toBeNull()
  })
  it('la receta que usa más cosas de las que vencen (al menos dos)', () => {
    const recetas = [
      { id: 'r1', name: 'Tarta' },
      { id: 'r2', name: 'Ensalada' },
    ]
    const items = {
      r1: [{ food_id: 'tomate' }, { food_id: 'queso' }, { food_id: 'huevo' }],
      r2: [{ food_id: 'tomate' }, { food_id: 'lechuga' }],
    }
    const itemsDe = (id) => items[id]
    expect(recetaParaLoQueVence(recetas, itemsDe, ['tomate', 'queso']).receta.id).toBe('r1')
    expect(recetaParaLoQueVence(recetas, itemsDe, ['tomate', 'lechuga']).receta.id).toBe('r2')
    expect(recetaParaLoQueVence(recetas, itemsDe, ['tomate'])).toBeNull()
    expect(recetaParaLoQueVence(recetas, itemsDe, ['tomate', 'arroz'])).toBeNull()
  })
})

describe('C-07: panel de administración', () => {
  let b
  beforeAll(async () => {
    b = await abrirBase()
    for (const [u, n] of [
      [ANA, 'Ana'],
      [BETO, 'Beto'],
    ])
      await b.db.query('insert into public.profiles (id, name, username) values ($1, $2, $3) on conflict do nothing', [
        u,
        n,
        n.toLowerCase() + '.adm',
      ])
  }, 60000)

  it('nadie es administrador hasta que se lo carga a mano en la base', async () => {
    expect(await b.como(ANA, () => b.rpc('es_admin', []))).toBe(false)
    expect(await fallo(b.como(ANA, () => b.rpc('admin_resumen', [])))).toMatch(/Solo para administradores/)
    // Desde la app no se puede uno sumar solo
    expect(await fallo(b.como(ANA, () => b.db.query('insert into public.administradores (user_id) values ($1)', [ANA])))).toMatch(
      /permission denied/,
    )
  })

  it('el administrador ve números y opiniones, sin datos de salud de nadie', async () => {
    await b.db.query('insert into public.administradores (user_id) values ($1)', [ANA])
    await b.como(BETO, () =>
      b.db.query("insert into public.opiniones (tipo, texto, version) values ('idea', 'Que tenga modo oscuro', '1.31.0')"),
    )
    await b.como(BETO, () => b.db.query("insert into public.ai_usos (kind) values ('foto'), ('foto'), ('voz')"))
    await b.como(BETO, () => b.db.query("insert into public.eventos (tipo, nombre, version) values ('error', 'sincronizar', '1.31.0')"))
    expect(await b.como(ANA, () => b.rpc('es_admin', []))).toBe(true)
    expect(await b.como(BETO, () => b.rpc('es_admin', []))).toBe(false)
    const r = await b.como(ANA, () => b.rpc('admin_resumen', []))
    expect(r.cuentas).toBe(2)
    expect(r.opiniones.map((o) => o.texto)).toEqual(['Que tenga modo oscuro'])
    expect(r.ia_por_dia.map((d) => [d.tipo, d.pedidos])).toEqual([
      ['foto', 2],
      ['voz', 1],
    ])
    expect(r.errores_7).toEqual([{ nombre: 'sincronizar', veces: 1, version: '1.31.0' }])
    // Ni pesos, ni comidas, ni nombres de usuario
    expect(JSON.stringify(r)).not.toMatch(/Beto|beto\.adm|weight|kcal/)
    expect(await fallo(b.como(BETO, () => b.rpc('admin_resumen', [])))).toMatch(/Solo para administradores/)
  })
})

describe('C-07: pedidos a la IA por día en el panel', async () => {
  const { iaPorDia } = await import('../../src/lib/admin.js')
  it('suma los tipos de cada día y ordena del más nuevo al más viejo', () => {
    expect(
      iaPorDia([
        { dia: '2026-10-22', tipo: 'foto', pedidos: 3 },
        { dia: '2026-10-23', tipo: 'voz', pedidos: 1 },
        { dia: '2026-10-22', tipo: 'texto', pedidos: 2 },
      ]),
    ).toEqual([
      { dia: '2026-10-23', total: 1, voz: 1 },
      { dia: '2026-10-22', total: 5, foto: 3, texto: 2 },
    ])
    expect(iaPorDia()).toEqual([])
  })
})

// El borrador de la sesión de gimnasio: se guarda en el teléfono y se tolera cualquier cosa rara que haya quedado guardada.
import { describe, expect, test } from 'vitest'
import { borrarBorrador, claveBorrador, guardarBorrador, leerBorrador } from '../../src/lib/borradorEntreno.js'

const almacen = () => {
  const m = new Map()
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m }
}
const AHORA = 1_800_000_000_000
const borrador = (extra = {}) => ({
  fecha: '2026-10-20',
  inicio: AHORA - 600_000,
  rutina: null,
  nombre: 'Empuje',
  editando: null,
  notas: '',
  sesion: [
    {
      clave: 'k1',
      exercise_id: 'e1',
      descanso: 90,
      series: [
        { clave: 's1', reps: '8', weight_kg: '80', rpe: '', warmup: false, hecha: true },
        { clave: 's2', reps: '8', weight_kg: '80', rpe: '', warmup: false, hecha: false },
      ],
    },
  ],
  ...extra,
})

describe('borrador de entreno', () => {
  test('lo que se guarda se lee igual', () => {
    const a = almacen()
    expect(guardarBorrador('u1', borrador(), { almacen: a, ahora: AHORA })).toBe(true)
    const r = leerBorrador('u1', { almacen: a, ahora: AHORA + 1000 })
    expect(r.sesion[0].series).toHaveLength(2)
    expect(r.sesion[0].series[0]).toMatchObject({ reps: '8', weight_kg: '80', hecha: true })
    expect(r.nombre).toBe('Empuje')
    expect(r.guardado).toBe(AHORA)
  })

  test('cada persona tiene su borrador', () => {
    const a = almacen()
    guardarBorrador('u1', borrador({ nombre: 'Uno' }), { almacen: a, ahora: AHORA })
    guardarBorrador('u2', borrador({ nombre: 'Dos' }), { almacen: a, ahora: AHORA })
    expect(leerBorrador('u1', { almacen: a, ahora: AHORA }).nombre).toBe('Uno')
    expect(leerBorrador('u2', { almacen: a, ahora: AHORA }).nombre).toBe('Dos')
    expect(claveBorrador('u1')).toBe('tupper:entreno-borrador:u1')
  })

  test('una sesión sin ejercicios no se guarda y borra el borrador anterior', () => {
    const a = almacen()
    guardarBorrador('u1', borrador(), { almacen: a, ahora: AHORA })
    expect(guardarBorrador('u1', borrador({ sesion: [] }), { almacen: a, ahora: AHORA })).toBe(false)
    expect(leerBorrador('u1', { almacen: a, ahora: AHORA })).toBeNull()
  })

  test('borrar', () => {
    const a = almacen()
    guardarBorrador('u1', borrador(), { almacen: a, ahora: AHORA })
    borrarBorrador('u1', { almacen: a })
    expect(leerBorrador('u1', { almacen: a, ahora: AHORA })).toBeNull()
  })

  test('un borrador viejo (más de dos días) ya no se ofrece', () => {
    const a = almacen()
    guardarBorrador('u1', borrador(), { almacen: a, ahora: AHORA })
    expect(leerBorrador('u1', { almacen: a, ahora: AHORA + 3 * 24 * 3600 * 1000 })).toBeNull()
  })

  test('contenido roto, de otra versión o con otra forma se descarta sin romper', () => {
    const a = almacen()
    const k = claveBorrador('u1')
    for (const malo of [
      'no es json',
      '{"version":99}',
      '[]',
      'null',
      JSON.stringify({ version: 1, guardado: AHORA, fecha: '2026-10-20', sesion: [{ exercise_id: 3 }] }),
    ]) {
      a.setItem(k, malo)
      expect(leerBorrador('u1', { almacen: a, ahora: AHORA })).toBeNull()
    }
  })

  test('sin almacenamiento (o que tira error) no rompe nada', () => {
    const roto = {
      getItem: () => {
        throw new Error('bloqueado')
      },
      setItem: () => {
        throw new Error('bloqueado')
      },
      removeItem: () => {
        throw new Error('bloqueado')
      },
    }
    expect(guardarBorrador('u1', borrador(), { almacen: roto, ahora: AHORA })).toBe(false)
    expect(leerBorrador('u1', { almacen: roto, ahora: AHORA })).toBeNull()
    expect(() => borrarBorrador('u1', { almacen: roto })).not.toThrow()
    expect(guardarBorrador('u1', borrador(), { almacen: null, ahora: AHORA })).toBe(false)
  })

  test('los valores de las series se normalizan a texto', () => {
    const a = almacen()
    a.setItem(
      claveBorrador('u1'),
      JSON.stringify({
        version: 1,
        guardado: AHORA,
        fecha: '2026-10-20',
        sesion: [{ clave: 'k', exercise_id: 'e', series: [{ reps: 8, weight_kg: 80, hecha: 1 }] }],
      }),
    )
    const r = leerBorrador('u1', { almacen: a, ahora: AHORA })
    expect(r.sesion[0].series[0]).toMatchObject({ reps: '8', weight_kg: '80', rpe: '', warmup: false, hecha: true })
  })
})

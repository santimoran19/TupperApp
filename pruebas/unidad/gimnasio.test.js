// Las cuentas del gimnasio (F-19, fase 3): 1RM, récords, la vez anterior, volumen por músculo, progreso y armado de series.
import { describe, expect, test } from 'vitest'
import { EQUIPOS as EQUIPOS_DATOS, GRUPOS as GRUPOS_DATOS } from '../../scripts/gym-data.mjs'
import {
  EQUIPOS,
  GRUPOS,
  aMedioKilo,
  cuenta,
  ejerciciosHechos,
  epley,
  errorDeSerie,
  esfuerzoSugerido,
  mejoresMarcas,
  nombreDeGrupo,
  progresoDeEjercicio,
  recordsDeSerie,
  resumenDeSesion,
  seriesParaGuardar,
  textoDeSerie,
  ultimaVez,
  volumenDeSerie,
  volumenPorGrupo,
} from '../../src/lib/gimnasio.js'

const s = (exercise_id, fecha, reps, weight_kg, extra = {}) => ({
  workout_id: `w-${fecha}`,
  fecha,
  orden: 0,
  exercise_id,
  set_no: 1,
  reps,
  weight_kg,
  rpe: null,
  warmup: false,
  ...extra,
})

test('los grupos y equipos del cliente son los mismos que los del catálogo que se carga a la base', () => {
  expect(GRUPOS).toEqual(GRUPOS_DATOS)
  expect(EQUIPOS).toEqual(EQUIPOS_DATOS)
  expect(nombreDeGrupo('pecho')).toBe('Pecho')
  expect(nombreDeGrupo('inexistente')).toBe('Otros')
})

describe('fuerza máxima estimada (Epley)', () => {
  test('peso × (1 + repeticiones / 30)', () => {
    expect(epley(100, 5)).toBeCloseTo(116.667, 3)
    expect(epley(80, 10)).toBeCloseTo(106.667, 3)
  })
  test('con una repetición es el propio peso', () => {
    expect(epley(120, 1)).toBe(120)
  })
  test('sin peso, sin repeticiones o con demasiadas no se estima', () => {
    expect(epley(0, 5)).toBeNull()
    expect(epley(100, 0)).toBeNull()
    expect(epley(100, 13)).toBeNull()
    expect(epley('', 5)).toBeNull()
    expect(epley(100, 12)).toBeCloseTo(140, 5)
  })
  test('acepta números en texto (así vienen de los campos)', () => {
    expect(epley('100', '5')).toBeCloseTo(116.667, 3)
  })
  test('se redondea a medio kilo para mostrar', () => {
    expect(aMedioKilo(116.667)).toBe(116.5)
    expect(aMedioKilo(116.8)).toBe(117)
  })
})

describe('volumen y series que cuentan', () => {
  test('la entrada en calor y las series sin repeticiones no cuentan', () => {
    expect(cuenta(s('a', '2026-10-01', 5, 100))).toBe(true)
    expect(cuenta(s('a', '2026-10-01', 5, 100, { warmup: true }))).toBe(false)
    expect(cuenta(s('a', '2026-10-01', 0, 100))).toBe(false)
  })
  test('volumen = peso × repeticiones; sin carga vale 0', () => {
    expect(volumenDeSerie(s('a', '2026-10-01', 8, 50))).toBe(400)
    expect(volumenDeSerie(s('a', '2026-10-01', 10, 0))).toBe(0)
    expect(volumenDeSerie(s('a', '2026-10-01', 8, 50, { warmup: true }))).toBe(0)
  })
  test('texto de una serie', () => {
    expect(textoDeSerie(s('a', '2026-10-01', 8, 52.5))).toBe('52,5 kg × 8')
    expect(textoDeSerie(s('a', '2026-10-01', 12, 0))).toBe('12 reps')
  })
})

describe('récords', () => {
  const antes = [s('a', '2026-09-01', 5, 100), s('a', '2026-09-01', 8, 80), s('a', '2026-09-01', 10, 50, { warmup: true })]
  test('mejores marcas ignoran la entrada en calor', () => {
    const m = mejoresMarcas(antes)
    expect(m.peso).toBe(100)
    expect(m.reps).toBe(8)
    expect(m.volumen).toBe(640)
    expect(m.unRm).toBeCloseTo(116.667, 3)
  })
  test('más peso es récord de peso y de fuerza estimada', () => {
    expect(recordsDeSerie(s('a', '2026-10-01', 5, 105), antes)).toEqual(['peso', 'unRm'])
  })
  test('más repeticiones con el mismo peso rompe la fuerza estimada pero no el peso', () => {
    expect(recordsDeSerie(s('a', '2026-10-01', 7, 100), antes)).toEqual(['unRm'])
  })
  test('igualar no es récord', () => {
    expect(recordsDeSerie(s('a', '2026-10-01', 5, 100), antes)).toEqual([])
  })
  test('la primera vez no se marca nada', () => {
    expect(recordsDeSerie(s('a', '2026-10-01', 5, 100), [])).toEqual([])
    expect(recordsDeSerie(s('a', '2026-10-01', 5, 100), [s('a', '2026-09-01', 5, 100, { warmup: true })])).toEqual([])
  })
  test('la entrada en calor nunca es récord', () => {
    expect(recordsDeSerie(s('a', '2026-10-01', 5, 200, { warmup: true }), antes)).toEqual([])
  })
  test('sin carga, el récord es de repeticiones', () => {
    const previas = [s('d', '2026-09-01', 8, 0), s('d', '2026-09-01', 6, 0)]
    expect(recordsDeSerie(s('d', '2026-10-01', 9, 0), previas)).toEqual(['reps'])
    expect(recordsDeSerie(s('d', '2026-10-01', 8, 0), previas)).toEqual([])
  })
})

describe('la vez anterior', () => {
  const workouts = [
    { id: 'w-2026-09-01', fecha: '2026-09-01', created_at: '2026-09-01T10:00:00Z' },
    { id: 'w-2026-09-15', fecha: '2026-09-15', created_at: '2026-09-15T10:00:00Z' },
    { id: 'w-2026-10-01', fecha: '2026-10-01', created_at: '2026-10-01T10:00:00Z' },
  ]
  const series = [
    s('a', '2026-09-01', 5, 90),
    s('a', '2026-09-15', 5, 95, { set_no: 2 }),
    s('a', '2026-09-15', 5, 92.5, { set_no: 1 }),
    s('b', '2026-10-01', 10, 20),
  ]
  test('devuelve las series de la sesión más reciente, en orden', () => {
    const r = ultimaVez(series, workouts, 'a')
    expect(r.workout.id).toBe('w-2026-09-15')
    expect(r.series.map((x) => x.weight_kg)).toEqual([92.5, 95])
  })
  test('antes de una fecha', () => {
    expect(ultimaVez(series, workouts, 'a', { antesDe: '2026-09-15' }).workout.id).toBe('w-2026-09-01')
  })
  test('puede excluir la sesión en curso', () => {
    expect(ultimaVez(series, workouts, 'a', { excluir: 'w-2026-09-15' }).workout.id).toBe('w-2026-09-01')
  })
  test('si nunca lo hizo, null', () => {
    expect(ultimaVez(series, workouts, 'zzz')).toBeNull()
    expect(ultimaVez(series, workouts, 'a', { antesDe: '2026-09-01' })).toBeNull()
  })
  test('acepta un Map de entrenamientos', () => {
    expect(ultimaVez(series, new Map(workouts.map((w) => [w.id, w])), 'b').workout.id).toBe('w-2026-10-01')
  })
  test('ignora series de entrenamientos que ya no están', () => {
    expect(ultimaVez([s('a', '2026-08-01', 5, 80)], workouts, 'a')).toBeNull()
  })
})

describe('volumen por grupo muscular', () => {
  const ej = new Map([
    ['a', { id: 'a', grupo: 'pecho' }],
    ['b', { id: 'b', grupo: 'espalda' }],
  ])
  test('cuenta series de trabajo y kilos por grupo, de más a menos series', () => {
    const r = volumenPorGrupo(
      [
        s('a', '2026-10-01', 5, 100),
        s('a', '2026-10-01', 5, 100),
        s('b', '2026-10-01', 10, 40),
        s('b', '2026-10-01', 10, 40, { warmup: true }),
      ],
      ej,
    )
    expect(r).toEqual([
      { grupo: 'pecho', series: 2, volumen: 1000 },
      { grupo: 'espalda', series: 1, volumen: 400 },
    ])
  })
  test('ejercicios que ya no existen se ignoran', () => {
    expect(volumenPorGrupo([s('x', '2026-10-01', 5, 100)], ej)).toEqual([])
  })
})

describe('progreso de un ejercicio', () => {
  test('un punto por día con el mejor 1RM, el mayor peso y el volumen', () => {
    const r = progresoDeEjercicio(
      [
        s('a', '2026-10-08', 5, 105),
        s('a', '2026-10-01', 5, 100),
        s('a', '2026-10-01', 8, 80),
        s('a', '2026-10-01', 12, 40, { warmup: true }),
        s('b', '2026-10-01', 5, 999),
      ],
      'a',
    )
    expect(r.map((p) => p.fecha)).toEqual(['2026-10-01', '2026-10-08'])
    expect(r[0]).toMatchObject({ peso: 100, series: 2, volumen: 1140 })
    expect(r[0].unRm).toBeCloseTo(116.667, 3)
    expect(r[1].peso).toBe(105)
  })
  test('sin series, vacío', () => {
    expect(progresoDeEjercicio([], 'a')).toEqual([])
  })
  test('ejercicios hechos, del más reciente al más viejo', () => {
    const r = ejerciciosHechos([
      s('a', '2026-10-01', 5, 1),
      s('a', '2026-10-08', 5, 1),
      s('b', '2026-10-09', 5, 1),
      s('c', '2026-10-10', 5, 1, { warmup: true }),
    ])
    expect(r).toEqual([
      { ejercicioId: 'b', ultima: '2026-10-09', sesiones: 1 },
      { ejercicioId: 'a', ultima: '2026-10-08', sesiones: 2 },
    ])
  })
})

describe('resumen de la sesión', () => {
  test('series, ejercicios y kilos', () => {
    expect(resumenDeSesion([s('a', 'x', 5, 100), s('a', 'x', 5, 100), s('b', 'x', 10, 20), s('b', 'x', 10, 20, { warmup: true })])).toEqual(
      {
        series: 3,
        ejercicios: 2,
        volumen: 1200,
      },
    )
  })
})

describe('armar las series para guardar', () => {
  const sesion = [
    {
      exercise_id: 'a',
      series: [
        { reps: '5', weight_kg: '100', rpe: '8', warmup: false, hecha: true },
        { reps: '5', weight_kg: '60', rpe: '', warmup: true, hecha: true },
        { reps: '5', weight_kg: '100', rpe: '', warmup: false, hecha: false },
      ],
    },
    { exercise_id: 'vacio', series: [{ reps: '', weight_kg: '', hecha: true }] },
    { exercise_id: 'b', series: [{ reps: '12', weight_kg: '', rpe: '', hecha: true }] },
  ]
  test('solo las hechas, con repeticiones; numera ejercicios y series sin huecos', () => {
    expect(seriesParaGuardar(sesion)).toEqual([
      { orden: 0, exercise_id: 'a', set_no: 1, reps: 5, weight_kg: 100, rpe: 8, warmup: false },
      { orden: 0, exercise_id: 'a', set_no: 2, reps: 5, weight_kg: 60, rpe: null, warmup: true },
      { orden: 1, exercise_id: 'b', set_no: 1, reps: 12, weight_kg: 0, rpe: null, warmup: false },
    ])
  })
  test('una sesión sin series hechas da una lista vacía', () => {
    expect(seriesParaGuardar([{ exercise_id: 'a', series: [{ reps: '5', hecha: false }] }])).toEqual([])
  })
})

describe('validar una serie', () => {
  test('repeticiones enteras de 1 a 100', () => {
    expect(errorDeSerie({ reps: '8', weight_kg: '50' })).toBeNull()
    expect(errorDeSerie({ reps: '', weight_kg: '50' })).toMatch(/repeticiones/)
    expect(errorDeSerie({ reps: '0', weight_kg: '50' })).toMatch(/repeticiones/)
    expect(errorDeSerie({ reps: '8.5', weight_kg: '50' })).toMatch(/repeticiones/)
    expect(errorDeSerie({ reps: '101', weight_kg: '50' })).toMatch(/repeticiones/)
  })
  test('el peso es opcional y va de 0 a 1.000', () => {
    expect(errorDeSerie({ reps: '8', weight_kg: '' })).toBeNull()
    expect(errorDeSerie({ reps: '8', weight_kg: '1001' })).toMatch(/peso/)
    expect(errorDeSerie({ reps: '8', weight_kg: 'abc' })).toMatch(/peso/)
  })
  test('el esfuerzo es opcional y va de 1 a 10', () => {
    expect(errorDeSerie({ reps: '8', weight_kg: '10', rpe: '' })).toBeNull()
    expect(errorDeSerie({ reps: '8', weight_kg: '10', rpe: '11' })).toMatch(/esfuerzo/)
  })
})

describe('esfuerzo sugerido', () => {
  test('promedio del RPE de las series de trabajo', () => {
    expect(
      esfuerzoSugerido([s('a', 'x', 5, 100, { rpe: 7 }), s('a', 'x', 5, 100, { rpe: 9 }), s('a', 'x', 5, 50, { rpe: 3, warmup: true })]),
    ).toBe(8)
  })
  test('sin RPE cargado, null', () => {
    expect(esfuerzoSugerido([s('a', 'x', 5, 100)])).toBeNull()
  })
})

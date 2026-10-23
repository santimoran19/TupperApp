// Gasto, ejercicio y objetivo de un día, y lo que se le cuenta al análisis semanal (F-19).
import { describe, expect, test } from 'vitest'
import { gastoDeFecha, objetivosDeLaSemana } from '../../src/lib/gastodia.js'

const perfil = {
  sex: 'm',
  birth_date: '1996-06-01',
  height_cm: 175,
  weight_kg: 70,
  goal_weight_kg: null,
  kcal_target: 2300,
  gasto_activo: true,
  gasto_modo: 'dinamico',
  gasto_devuelve: 50,
  gasto_trabajo: 'escritorio',
}
const entreno = (fecha, kcal, minutos = 40) => ({ fecha, kcal, duration_min: minutos, metodo: 'mets' })
const LUNES = '2026-10-19'

describe('gastoDeFecha', () => {
  test('sin perfil no hay nada', () => {
    expect(gastoDeFecha(null, [], [], LUNES).objetivo.kcal).toBe(0)
  })
  test('con el cálculo apagado el objetivo es el fijo y no hay gasto', () => {
    const g = gastoDeFecha({ ...perfil, gasto_activo: false }, [], [entreno(LUNES, 400)], LUNES)
    expect(g).toMatchObject({ activo: false, base: null, ejercicio: null, gasto: null })
    expect(g.objetivo).toMatchObject({ kcal: 2300, dinamico: false, extra: 0 })
  })
  test('en modo dinámico el entrenamiento suma la parte que se devuelve', () => {
    const sin = gastoDeFecha(perfil, [], [], LUNES)
    const con = gastoDeFecha(perfil, [], [entreno(LUNES, 400)], LUNES)
    expect(sin.objetivo.dinamico).toBe(true)
    expect(con.ejercicio.kcal).toBe(400)
    expect(con.objetivo.kcal - sin.objetivo.kcal).toBeCloseTo(200, -1)
    expect(con.gasto.total).toBeCloseTo(sin.gasto.total + 400, 5)
  })
  test('en modo fijo (aunque el cálculo esté prendido) el objetivo no se mueve con el ejercicio', () => {
    const g = gastoDeFecha({ ...perfil, gasto_modo: 'fijo' }, [], [entreno(LUNES, 400)], LUNES)
    expect(g.objetivo).toMatchObject({ kcal: 2300, dinamico: false })
    expect(g.ejercicio.kcal).toBe(400)
  })
})

describe('objetivosDeLaSemana', () => {
  test('uno por día, hasta hoy, con el objetivo de cada uno', () => {
    const r = objetivosDeLaSemana(perfil, [], [entreno('2026-10-20', 300, 45)], LUNES, '2026-10-21')
    expect(r.map((d) => d.fecha)).toEqual(['2026-10-19', '2026-10-20', '2026-10-21'])
    expect(r.every((d) => d.dinamico)).toBe(true)
    // el día que se entrenó el objetivo es más alto (la mitad de 300 kcal, redondeado de a 10)
    expect(r[1].objetivo_kcal - r[0].objetivo_kcal).toBeGreaterThanOrEqual(140)
    expect(r[1].objetivo_kcal - r[0].objetivo_kcal).toBeLessThanOrEqual(160)
    expect(r[2].objetivo_kcal).toBe(r[0].objetivo_kcal)
  })
  test('no manda nada de ejercicio ni de gasto: solo fecha, objetivo y si es dinámico', () => {
    const r = objetivosDeLaSemana(perfil, [], [entreno('2026-10-19', 500, 60)], LUNES, LUNES)
    expect(Object.keys(r[0]).sort()).toEqual(['dinamico', 'fecha', 'objetivo_kcal'])
  })
  test('una semana completa tiene siete días y nunca pasa de hoy', () => {
    expect(objetivosDeLaSemana(perfil, [], [], LUNES, '2026-12-31')).toHaveLength(7)
    expect(objetivosDeLaSemana(perfil, [], [], LUNES, '2026-10-18')).toHaveLength(0)
  })
  test('con el cálculo apagado manda el objetivo fijo', () => {
    const [d] = objetivosDeLaSemana({ ...perfil, gasto_activo: false }, [], [entreno(LUNES, 400)], LUNES, LUNES)
    expect(d).toEqual({ fecha: LUNES, objetivo_kcal: 2300, dinamico: false })
  })
  test('sin perfil no manda nada', () => {
    expect(objetivosDeLaSemana(null, [], [], LUNES, LUNES)).toEqual([])
  })
})

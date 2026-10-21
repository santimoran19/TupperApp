// El gasto real calculado con los propios datos (F-19, fase 4).
import { describe, expect, test } from 'vitest'
import { sumarDias } from '../../src/lib/fechas.js'
import { gastoBase } from '../../src/lib/gasto.js'
import { calcularGastoReal, ingestaPorDia, loQueFalta, regresionLineal, tCritico } from '../../src/lib/gastoreal.js'

const HOY = '2026-10-20'
const INICIO = '2026-09-22' // 28 días terminando ayer (19/10)
const perfil = {
  sex: 'm',
  birth_date: '1996-10-20',
  height_cm: 175,
  weight_kg: 70,
  goal_weight_kg: null,
  kcal_target: 2300,
  work_type: 'escritorio',
}
const dia = (i) => sumarDias(INICIO, i)
// Todos los días con la misma cantidad de calorías
const comidas = (kcal, dias = 28, desde = 0) =>
  Array.from({ length: dias }, (_, i) => ({ date: dia(desde + i), kcal, skipped: false, meal: 'almuerzo' }))
const pesos = (f, cada = 3) =>
  Array.from({ length: 10 }, (_, i) => ({ date: dia(i * cada), weight_kg: f(i * cada) })).filter((p) => p.date <= HOY)

describe('regresión lineal', () => {
  test('una recta exacta', () => {
    const r = regresionLineal([0, 1, 2, 3].map((x) => ({ x, y: 5 - 0.5 * x })))
    expect(r.pendiente).toBeCloseTo(-0.5, 10)
    expect(r.intercepto).toBeCloseTo(5, 10)
    expect(r.errorPendiente).toBeCloseTo(0, 10)
  })
  test('con ruido hay error estándar; con dos puntos no se puede estimar', () => {
    const r = regresionLineal([
      { x: 0, y: 70 },
      { x: 1, y: 71 },
      { x: 2, y: 70 },
      { x: 3, y: 71 },
    ])
    expect(r.errorPendiente).toBeGreaterThan(0)
    expect(
      regresionLineal([
        { x: 0, y: 1 },
        { x: 1, y: 2 },
      ]).errorPendiente,
    ).toBeNull()
    expect(regresionLineal([{ x: 1, y: 1 }])).toBeNull()
    expect(
      regresionLineal([
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ]),
    ).toBeNull()
  })
  test('la t de Student', () => {
    expect(tCritico(1)).toBeCloseTo(12.71)
    expect(tCritico(10)).toBeCloseTo(2.23)
    expect(tCritico(500)).toBeLessThan(2)
    expect(tCritico(0)).toBe(Infinity)
  })
})

describe('lo comido', () => {
  test('suma por día, deja afuera los días con poco y los "no comí"', () => {
    const regs = [
      { date: dia(0), kcal: 500 },
      { date: dia(0), kcal: 600 },
      { date: dia(1), kcal: 700 }, // 700: casi seguro faltó cargar
      { date: dia(2), kcal: 2000, skipped: true },
      { date: dia(40), kcal: 2000 }, // fuera de la ventana
    ]
    expect([...ingestaPorDia(regs, INICIO, '2026-10-19')]).toEqual([[dia(0), 1100]])
  })
})

describe('qué falta', () => {
  test('sin datos', () => {
    const r = calcularGastoReal({ perfil, registros: [], medidas: [], hoy: HOY })
    expect(r.listo).toBe(false)
    expect(r.faltan).toHaveLength(2)
    expect(r.progreso).toMatchObject({ diasRegistrados: 0, pesajes: 0, inicio: INICIO, fin: '2026-10-19' })
  })
  test('días registrados y pesajes se piden por separado', () => {
    expect(loQueFalta({ diasRegistrados: 10, pesajes: 5, diasEntrePesajes: 20 })).toEqual([
      'Faltan 11 días con la comida cargada (llevás 10 de 21).',
    ])
    expect(loQueFalta({ diasRegistrados: 25, pesajes: 3, diasEntrePesajes: 20 })[0]).toMatch(/Faltan 1 pesajes \(llevás 3 de 4\)/)
    expect(loQueFalta({ diasRegistrados: 25, pesajes: 4, diasEntrePesajes: 6 })[0]).toMatch(/abarcan 6 días; hacen falta 14/)
    expect(loQueFalta({ diasRegistrados: 21, pesajes: 4, diasEntrePesajes: 14 })).toEqual([])
  })
  test('cuatro pesajes en cuatro días seguidos no alcanzan', () => {
    const medidas = [0, 1, 2, 3].map((i) => ({ date: dia(20 + i), weight_kg: 70 }))
    const r = calcularGastoReal({ perfil, registros: comidas(2000), medidas, hoy: HOY })
    expect(r.listo).toBe(false)
    expect(r.faltan[0]).toMatch(/abarcan 3 días/)
  })
  test('tres pesajes bien separados tampoco: se piden cuatro', () => {
    const medidas = [0, 12, 25].map((i) => ({ date: dia(i), weight_kg: 70 }))
    const r = calcularGastoReal({ perfil, registros: comidas(2000), medidas, hoy: HOY })
    expect(r.listo).toBe(false)
    expect(r.faltan[0]).toMatch(/Faltan 1 pesajes \(llevás 3 de 4\)/)
  })
  test('con 20 días de comida falta uno; con 21 alcanza', () => {
    const con20 = calcularGastoReal({ perfil, registros: comidas(2000, 20), medidas: pesos(() => 70), hoy: HOY })
    expect(con20.listo).toBe(false)
    expect(con20.faltan[0]).toMatch(/Faltan 1 días/)
    expect(calcularGastoReal({ perfil, registros: comidas(2000, 21), medidas: pesos(() => 70), hoy: HOY }).listo).toBe(true)
  })
})

describe('el cálculo', () => {
  test('peso estable comiendo 2.000: gasta unas 2.000', () => {
    const r = calcularGastoReal({ perfil, registros: comidas(2000), medidas: pesos(() => 70), hoy: HOY })
    expect(r.listo).toBe(true)
    expect(r.gastoReal).toBe(2000)
    expect(r.ingestaPromedio).toBe(2000)
    expect(r.cambioPesoPorSemana).toBeCloseTo(0, 6)
    expect(r.confianza).toBe('alta')
    // 2.000 × 0,9 / (basal 1.648,75 + movimiento 197,85) = 0,975
    expect(r.factor).toBeCloseTo(0.975, 3)
    expect(r.factorAplicable).toBe(true)
    expect(r.mantenimientoReal).toBe(2000)
    expect(r.diferenciaConFormula).toBeLessThan(0)
    expect(r.objetivoSugerido.kcal).toBe(2000)
  })
  test('bajando 2 kg en 27 días con 1.800 por día: gasta unas 2.370', () => {
    const r = calcularGastoReal({ perfil, registros: comidas(1800), medidas: pesos((d) => 75 - (2 / 27) * d, 3), hoy: HOY })
    expect(r.listo).toBe(true)
    expect(r.cambioPesoPorSemana).toBeCloseTo(-0.5185, 3)
    expect(r.gastoReal).toBeGreaterThan(2350)
    expect(r.gastoReal).toBeLessThan(2390)
    expect(r.pesoTendencia).toBeCloseTo(73, 1)
  })
  test('el signo: subiendo de peso el gasto es MENOR que lo comido, bajando es MAYOR', () => {
    // Sube 1 kg en 27 días (0,037 kg por día = 285 kcal por día guardadas en el cuerpo)
    const sube = calcularGastoReal({ perfil, registros: comidas(2500), medidas: pesos((d) => 70 + (1 / 27) * d), hoy: HOY })
    expect(sube.cambioPesoPorSemana).toBeGreaterThan(0)
    expect(sube.cambioPesoPorSemana).toBeCloseTo(7 / 27, 3)
    expect(sube.gastoReal).toBe(Math.round(2500 - (1 / 27) * 7700))
    expect(sube.gastoReal).toBeLessThan(sube.ingestaPromedio)
    // El mismo ritmo bajando da la misma distancia del otro lado
    const baja = calcularGastoReal({ perfil, registros: comidas(2500), medidas: pesos((d) => 70 - (1 / 27) * d), hoy: HOY })
    expect(baja.cambioPesoPorSemana).toBeCloseTo(-7 / 27, 3)
    expect(baja.gastoReal).toBe(Math.round(2500 + (1 / 27) * 7700))
    expect(baja.gastoReal).toBeGreaterThan(baja.ingestaPromedio)
    expect(baja.gastoReal - 2500).toBe(2500 - sube.gastoReal)
  })
  test('el error de lo comido es del 10 %: con pesos perfectos la confianza queda en el borde de alta', () => {
    const r = calcularGastoReal({ perfil, registros: comidas(2000), medidas: pesos(() => 70), hoy: HOY })
    expect(r.error).toBe(200)
    expect(r.rango).toEqual([1800, 2200])
    // Con 2.600 por día el solo error de anotar ya pasa los 250: nunca sería "alta"
    const mucho = calcularGastoReal({ perfil, registros: comidas(2600), medidas: pesos(() => 70), hoy: HOY })
    expect(mucho.error).toBe(260)
    expect(mucho.confianza).toBe('media')
  })
  test('el ejercicio ya contado se descuenta para sacar el factor del resto', () => {
    const entrenos = Array.from({ length: 28 }, (_, i) => ({ fecha: dia(i), kcal: 300 }))
    const sin = calcularGastoReal({ perfil, registros: comidas(2000), medidas: pesos(() => 70), hoy: HOY })
    const con = calcularGastoReal({ perfil, registros: comidas(2000), medidas: pesos(() => 70), entrenamientos: entrenos, hoy: HOY })
    expect(con.gastoReal).toBe(sin.gastoReal)
    expect(con.ejercicioPorDia).toBe(300)
    expect(con.mantenimientoReal).toBe(sin.mantenimientoReal - 300)
    expect(con.factor).toBeLessThan(sin.factor)
  })
  test('pesos muy ruidosos: la confianza es baja y no se aplica solo', () => {
    const r = calcularGastoReal({
      perfil,
      registros: comidas(2000),
      medidas: Array.from({ length: 10 }, (_, i) => ({ date: dia(i * 2), weight_kg: 70 + (i % 2 === 0 ? 1.6 : -1.6) })),
      hoy: HOY,
    })
    expect(r.listo).toBe(true)
    expect(r.confianza).toBe('baja')
    expect(r.factorAplicable).toBe(false)
    expect(r.motivo).toMatch(/margen de error/)
  })
  test('un resultado muy lejos de la fórmula no se aplica solo (seguro faltaron comidas)', () => {
    const r = calcularGastoReal({ perfil, registros: comidas(1000), medidas: pesos(() => 70), hoy: HOY })
    expect(r.factor).toBeLessThan(0.75)
    expect(r.factorAplicable).toBe(false)
    expect(r.motivo).toMatch(/falten comidas/)
    expect(r.objetivoSugerido).toBeUndefined()
  })
  test('el gasto base se calcula con el factor que ya tuviera, para no encimarlo', () => {
    const conFactor = { ...perfil, gasto_factor: 1.2 }
    const a = calcularGastoReal({ perfil, registros: comidas(2000), medidas: pesos(() => 70), hoy: HOY })
    const b = calcularGastoReal({ perfil: conFactor, registros: comidas(2000), medidas: pesos(() => 70), hoy: HOY })
    expect(b.factor).toBe(a.factor)
    expect(gastoBase({ ...conFactor, gasto_factor: b.factor }, 70, HOY).mantenimiento).toBeCloseTo(b.mantenimientoReal, -1)
  })
  test('sin datos en el perfil igual calcula el gasto, pero no el factor', () => {
    const r = calcularGastoReal({ perfil: { ...perfil, height_cm: null }, registros: comidas(2000), medidas: pesos(() => 70), hoy: HOY })
    expect(r.listo).toBe(true)
    expect(r.gastoReal).toBe(2000)
    expect(r.factor).toBeNull()
    expect(r.factorAplicable).toBe(false)
    expect(r.motivo).toMatch(/perfil/)
  })
  test('los pesajes de hoy cuentan, la comida de hoy no', () => {
    const regs = [...comidas(2000), { date: HOY, kcal: 9000 }]
    const r = calcularGastoReal({ perfil, registros: regs, medidas: [...pesos(() => 70), { date: HOY, weight_kg: 70 }], hoy: HOY })
    expect(r.ingestaPromedio).toBe(2000)
    expect(r.progreso.pesajes).toBeGreaterThan(8)
  })
})

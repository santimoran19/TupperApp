// El motor de gasto (F-19, fase 1): las cuentas con valores que se pueden hacer a mano.
import { describe, expect, test } from 'vitest'
import {
  ajusteDe,
  datosQueFaltan,
  gastoBase,
  gastoDelDia,
  metabolismoBasal,
  movimientoDiario,
  objetivoDelDia,
  objetivoDesdeGasto,
  partesDelGasto,
  pesoDelDia,
} from '../../src/lib/gasto.js'

const HOY = '2026-10-20'
// 30 años, 175 cm, 70 kg, hombre: Mifflin = 700 + 1093,75 - 150 + 5 = 1648,75
const hombre = { sex: 'm', birth_date: '1996-10-20', height_cm: 175, weight_kg: 70, goal_weight_kg: null, kcal_target: 2300 }
const mujer = { sex: 'f', birth_date: '1996-10-20', height_cm: 165, weight_kg: 60, goal_weight_kg: null, kcal_target: 1800 }

describe('metabolismo basal', () => {
  test('Mifflin-St Jeor', () => {
    expect(metabolismoBasal({ sexo: 'm', edad: 30, altura: 175, peso: 70 }).kcal).toBeCloseTo(1648.75, 2)
    expect(metabolismoBasal({ sexo: 'f', edad: 30, altura: 165, peso: 60 }).kcal).toBeCloseTo(1320.25, 2)
  })
  test('con % de grasa se usa Katch-McArdle: 370 + 21,6 × masa magra', () => {
    const r = metabolismoBasal({ sexo: 'm', edad: 30, altura: 175, peso: 80, grasa: 20 })
    expect(r.metodo).toBe('katch')
    expect(r.kcal).toBeCloseTo(370 + 21.6 * 64, 5)
  })
  test('un % de grasa fuera de rango se ignora', () => {
    expect(metabolismoBasal({ sexo: 'm', edad: 30, altura: 175, peso: 70, grasa: 2 }).metodo).toBe('mifflin')
    expect(metabolismoBasal({ sexo: 'm', edad: 30, altura: 175, peso: 70, grasa: '' }).metodo).toBe('mifflin')
  })
})

describe('movimiento del día a día', () => {
  test('sin pasos: un porcentaje del basal según el trabajo', () => {
    expect(movimientoDiario({ tmb: 1000, trabajo: 'escritorio', pasos: null, peso: 70 }).kcal).toBeCloseTo(120)
    expect(movimientoDiario({ tmb: 1000, trabajo: 'de_pie', pasos: null, peso: 70 }).kcal).toBeCloseTo(280)
    expect(movimientoDiario({ tmb: 1000, trabajo: 'fisico', pasos: null, peso: 70 }).kcal).toBeCloseTo(500)
  })
  test('con pasos: menos porcentaje del trabajo y los pasos aparte', () => {
    const r = movimientoDiario({ tmb: 1000, trabajo: 'escritorio', pasos: 8000, peso: 70 })
    expect(r.deTrabajo).toBeCloseTo(80)
    expect(r.dePasos).toBeCloseTo(8000 * 70 * 0.00038)
    expect(r.conPasos).toBe(true)
  })
  test('cero pasos también cuenta como dato; sin trabajo se supone escritorio', () => {
    expect(movimientoDiario({ tmb: 1000, trabajo: null, pasos: 0, peso: 70 })).toMatchObject({
      conPasos: true,
      tipo: 'escritorio',
      dePasos: 0,
    })
  })
})

describe('gasto base', () => {
  test('los factores de actividad que salen son razonables (1,25 a 1,7)', () => {
    const pal = (extra) => gastoBase({ ...hombre, ...extra }, 70, HOY).pal
    expect(pal({ work_type: 'escritorio' })).toBeCloseTo(1.245, 2)
    expect(pal({ work_type: 'escritorio', steps_per_day: 8000 })).toBeCloseTo(1.343, 2)
    expect(pal({ work_type: 'de_pie' })).toBeCloseTo(1.42, 2)
    expect(pal({ work_type: 'fisico' })).toBeCloseTo(1.667, 2)
  })
  test('las partes suman el mantenimiento', () => {
    const b = gastoBase({ ...hombre, work_type: 'de_pie', steps_per_day: 6000 }, 70, HOY)
    expect(b.tmb + b.neat + b.tef).toBeCloseTo(b.mantenimiento, 6)
    expect(b.tef / b.mantenimiento).toBeCloseTo(0.1, 6)
    expect(partesDelGasto(b).map((p) => p.clave)).toEqual(['tmb', 'neat', 'tef'])
  })
  test('el rango es ±12 % con la fórmula general y ±10 % con un factor propio', () => {
    const b = gastoBase(hombre, 70, HOY)
    expect(b.rango[0]).toBeCloseTo(b.mantenimiento * 0.88, 6)
    expect(b.rango[1]).toBeCloseTo(b.mantenimiento * 1.12, 6)
    const p = gastoBase({ ...hombre, gasto_factor: 1.1 }, 70, HOY)
    expect(p.personalizado).toBe(true)
    expect(p.mantenimiento).toBeCloseTo(b.mantenimiento * 1.1, 6)
    expect(p.rango[1] / p.mantenimiento).toBeCloseTo(1.1, 6)
  })
  test('faltan datos o están fuera de rango: no se calcula', () => {
    expect(gastoBase({ ...hombre, sex: null }, 70, HOY)).toBeNull()
    expect(gastoBase({ ...hombre, height_cm: null }, 70, HOY)).toBeNull()
    expect(gastoBase(hombre, null, HOY)).toBeNull()
    expect(gastoBase({ ...hombre, height_cm: 90 }, 70, HOY)).toBeNull()
    expect(gastoBase(hombre, 400, HOY)).toBeNull()
    expect(gastoBase(null, 70, HOY)).toBeNull()
    expect(datosQueFaltan({ sex: 'm' }, null)).toEqual(['la fecha de nacimiento', 'la altura', 'el peso'])
  })
  test('anota qué se supuso', () => {
    expect(gastoBase(hombre, 70, HOY).supuestos).toHaveLength(3)
    const completo = gastoBase({ ...hombre, work_type: 'de_pie', steps_per_day: 5000, body_fat_pct: 18 }, 70, HOY)
    expect(completo.supuestos).toHaveLength(0)
    expect(completo.metodoTmb).toBe('katch')
  })
  test('avisa que es menos preciso fuera de las edades en que se estudiaron las fórmulas (19 a 78)', () => {
    const aviso = (nacimiento) =>
      gastoBase({ ...hombre, birth_date: nacimiento }, 70, HOY).supuestos.filter((t) => /se estudiaron en adultos de 19 a 78/.test(t))
    expect(aviso('1996-10-20')).toHaveLength(0) // 30 años
    expect(aviso('2008-10-20')).toHaveLength(1) // 18 años
    expect(aviso('1948-10-20')).toHaveLength(0) // 78 años
    expect(aviso('1947-10-20')).toHaveLength(1) // 79 años
  })
})

describe('peso del día', () => {
  const medidas = [
    { date: '2026-10-01', weight_kg: 72 },
    { date: '2026-10-10', weight_kg: 71 },
    { date: '2026-10-18', weight_kg: null, waist_cm: 80 },
  ]
  test('la última medida hasta esa fecha; si no hay, la del perfil', () => {
    expect(pesoDelDia(hombre, medidas, '2026-10-12')).toBe(71)
    expect(pesoDelDia(hombre, medidas, '2026-10-05')).toBe(72)
    expect(pesoDelDia(hombre, medidas, '2026-09-01')).toBe(70)
    expect(pesoDelDia({}, [], '2026-09-01')).toBeNull()
  })
})

describe('objetivo', () => {
  test('el recorte automático depende del peso meta y es gradual; el elegido manda', () => {
    const base = gastoBase(hombre, 70, HOY)
    // Lejos de la meta (8 % del peso o más): el recorte (o superávit) completo
    expect(ajusteDe({ ...hombre, goal_weight_kg: 60 }, base)).toBe(-0.22)
    expect(ajusteDe({ ...hombre, goal_weight_kg: 50 }, base)).toBe(-0.22)
    expect(ajusteDe({ ...hombre, goal_weight_kg: 80 }, base)).toBe(0.1)
    // A 5 kg (7,1 %) casi completo, y más cerca va bajando de a poco
    expect(ajusteDe({ ...hombre, goal_weight_kg: 65 }, base)).toBe(-0.19)
    expect(ajusteDe({ ...hombre, goal_weight_kg: 75 }, base)).toBe(0.09)
    expect(ajusteDe({ ...hombre, goal_weight_kg: 66.5 }, base)).toBe(-0.12)
    expect(ajusteDe({ ...hombre, goal_weight_kg: 68.5 }, base)).toBe(-0.02)
    // A menos de 1,5 % del peso (poco más de 1 kg): ninguno. Sin meta, tampoco
    expect(ajusteDe({ ...hombre, goal_weight_kg: 69.2 }, base)).toBe(0)
    expect(ajusteDe({ ...hombre, goal_weight_kg: 70.5 }, base)).toBe(0)
    expect(ajusteDe(hombre, base)).toBe(0)
    // El elegido manda sobre el automático
    expect(ajusteDe({ ...hombre, goal_weight_kg: 65, gasto_ajuste_pct: -10 }, base)).toBeCloseTo(-0.1)
    expect(ajusteDe({ ...hombre, goal_weight_kg: 65, gasto_ajuste_pct: 0 }, base)).toBe(0)
  })
  test('sin saltos: cada kilo de más lejos de la meta nunca baja el recorte, y el paso entre uno y otro es chico', () => {
    const base = gastoBase(hombre, 70, HOY)
    let anterior = 0
    for (let meta = 70; meta >= 55; meta -= 0.5) {
      const a = ajusteDe({ ...hombre, goal_weight_kg: meta }, base)
      expect(a).toBeLessThanOrEqual(anterior)
      expect(anterior - a).toBeLessThanOrEqual(0.04)
      anterior = a
    }
  })
  test('a menores de 18 no se les calcula recorte', () => {
    const joven = { ...hombre, birth_date: '2010-01-01', goal_weight_kg: 60 }
    const base = gastoBase(joven, 70, HOY)
    expect(base.edad).toBe(16)
    expect(ajusteDe(joven, base)).toBe(0)
  })
  test('objetivo desde el gasto: redondea a 50 y respeta el piso', () => {
    const base = gastoBase({ ...hombre, work_type: 'de_pie' }, 70, HOY)
    const o = objetivoDesdeGasto({ ...hombre, goal_weight_kg: 60 }, base)
    expect(o.kcal % 50).toBe(0)
    expect(o.kcal).toBe(Math.round((base.mantenimiento * 0.78) / 50) * 50)
    expect(o.protein).toBe(Math.round((1.7 * 60) / 5) * 5)
    expect(o).toMatchObject({ ajuste: -0.22, porPiso: false, sinDeficit: false })
    const chica = gastoBase({ ...mujer, goal_weight_kg: 40, height_cm: 150 }, 45, HOY)
    expect(objetivoDesdeGasto({ ...mujer, goal_weight_kg: 40 }, chica).kcal).toBeGreaterThanOrEqual(1300)
    expect(objetivoDesdeGasto(hombre, null)).toBeNull()
  })
  test('modo fijo (o cálculo apagado): es el objetivo guardado, haya ejercicio o no', () => {
    const base = gastoBase(hombre, 70, HOY)
    expect(objetivoDelDia(hombre, base, 500)).toEqual({
      kcal: 2300,
      dinamico: false,
      base: 2300,
      extra: 0,
      porPiso: false,
      sinDeficit: false,
    })
    expect(objetivoDelDia({ ...hombre, gasto_activo: true, gasto_modo: 'fijo' }, base, 500).kcal).toBe(2300)
    expect(objetivoDelDia({ ...hombre, gasto_activo: false, gasto_modo: 'dinamico' }, base, 500).kcal).toBe(2300)
    expect(objetivoDelDia({ ...hombre, gasto_activo: true, gasto_modo: 'dinamico' }, null, 500).kcal).toBe(2300)
  })
  test('modo dinámico: el día sin entrenar más la parte que se devuelve', () => {
    const p = { ...hombre, gasto_activo: true, gasto_modo: 'dinamico', gasto_devuelve: 50, goal_weight_kg: 60 }
    const base = gastoBase(p, 70, HOY)
    const sin = objetivoDelDia(p, base, 0)
    const con = objetivoDelDia(p, base, 600)
    expect(sin.dinamico).toBe(true)
    expect(sin.kcal).toBe(Math.round((base.mantenimiento * 0.78) / 10) * 10)
    expect(sin.extra).toBe(0)
    expect(con.kcal - sin.kcal).toBeGreaterThanOrEqual(290)
    expect(con.kcal - sin.kcal).toBeLessThanOrEqual(310)
    expect(con.extra).toBe(con.kcal - con.base)
    expect(objetivoDelDia({ ...p, gasto_devuelve: 0 }, base, 600).kcal).toBe(sin.kcal)
    expect(objetivoDelDia({ ...p, gasto_devuelve: 100 }, base, 600).kcal - sin.kcal).toBeGreaterThanOrEqual(590)
  })
  test('el piso frena el recorte, pero nunca deja el objetivo por encima de lo que la persona gasta', () => {
    // Mantenimiento de unas 1.540 kcal: el −22 % daría 1.200, así que se frena en el piso de 1.300 (recorte menor al pedido)
    const frena = { ...mujer, goal_weight_kg: 45, height_cm: 160, weight_kg: 55 }
    const base = gastoBase(frena, 55, HOY)
    expect(base.mantenimiento).toBeGreaterThan(1450)
    expect(base.mantenimiento).toBeLessThan(1650)
    const o = objetivoDesdeGasto(frena, base)
    expect(o).toMatchObject({ kcal: 1300, porPiso: true, sinDeficit: false })
    expect(o.kcal).toBeLessThan(base.mantenimiento)
    // Mantenimiento de unas 1.075 kcal: ya está por debajo del piso. No se propone déficit: el objetivo es el mantenimiento
    const baja = { ...mujer, birth_date: '1966-10-20', height_cm: 148, weight_kg: 40, goal_weight_kg: 35 }
    const bBase = gastoBase(baja, 40, HOY)
    expect(bBase.mantenimiento).toBeLessThan(1300)
    const sinDef = objetivoDesdeGasto(baja, bBase)
    expect(sinDef).toMatchObject({ porPiso: false, sinDeficit: true })
    expect(sinDef.kcal).toBeLessThanOrEqual(bBase.mantenimiento)
    expect(sinDef.kcal).toBeGreaterThan(bBase.mantenimiento - 50)
    // Lo mismo día a día en el modo dinámico: sin entrenar es el mantenimiento y entrenar suma la parte que se devuelve
    const din = { ...baja, gasto_activo: true, gasto_modo: 'dinamico', gasto_devuelve: 50 }
    const d0 = objetivoDelDia(din, bBase, 0)
    expect(d0.sinDeficit).toBe(true)
    expect(d0.kcal).toBeLessThanOrEqual(bBase.mantenimiento + 5)
    expect(objetivoDelDia(din, bBase, 400).kcal - d0.kcal).toBeGreaterThanOrEqual(190)
    // Un superávit o ningún recorte no se toca con el piso
    expect(objetivoDesdeGasto({ ...baja, goal_weight_kg: 50 }, bBase).sinDeficit).toBe(false)
  })
  test('un recorte nunca da un objetivo por encima del mantenimiento, ni redondeando', () => {
    for (const kg of [45, 50, 55, 60, 70, 85, 100]) {
      const p = { ...mujer, height_cm: 160, weight_kg: kg, goal_weight_kg: kg - 12 }
      const base = gastoBase(p, kg, HOY)
      const o = objetivoDesdeGasto(p, base)
      expect(o.kcal, `${kg} kg`).toBeLessThanOrEqual(base.mantenimiento)
    }
  })
  test('el piso de calorías se mantiene y el ejercicio negativo no resta', () => {
    const p = { ...mujer, gasto_activo: true, gasto_modo: 'dinamico', gasto_devuelve: 50, gasto_ajuste_pct: -40, height_cm: 150 }
    const base = gastoBase(p, 45, HOY)
    expect(objetivoDelDia(p, base, 0).kcal).toBeGreaterThanOrEqual(1300)
    expect(objetivoDelDia(p, base, -400).kcal).toBe(objetivoDelDia(p, base, 0).kcal)
  })
})

describe('gasto del día', () => {
  test('mantenimiento más ejercicio, con rango', () => {
    const base = gastoBase(hombre, 70, HOY)
    const d = gastoDelDia(base, 400, [300, 500])
    expect(d.total).toBeCloseTo(base.mantenimiento + 400, 6)
    expect(d.rango[0]).toBeCloseTo(base.rango[0] + 300, 6)
    expect(d.rango[1]).toBeCloseTo(base.rango[1] + 500, 6)
    expect(gastoDelDia(base, 0).total).toBeCloseTo(base.mantenimiento, 6)
    expect(gastoDelDia(null, 100)).toBeNull()
  })
})

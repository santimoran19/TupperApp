// "Armar con lo que tengo" con cabeza (1.27): prioriza lo que vence y se acerca al objetivo de cada día (lib/planificador.js).
import { describe, expect, test } from 'vitest'
import { aprovechado, armarPlan } from '../../src/lib/planificador.js'

const receta = (id, meal, extra = {}) => ({ id, name: id, servings: 1, meal_types: [meal], portable: true, minutes: 20, ...extra })
const base = (recetas, itemsPorReceta, extra = {}) => ({
  recetas: new Map(recetas.map((r) => [r.id, r])),
  itemsDe: (id) => itemsPorReceta[id] || [],
  stock: new Map([
    ['yogur', 2],
    ['pollo', 5],
    ['arroz', 5],
  ]),
  preparado: new Map(),
  reglas: new Set(),
  existentes: new Map(),
  ...extra,
})

describe('lo que vence', () => {
  const rs = [receta('con-pollo', 'almuerzo'), receta('con-yogur', 'almuerzo')]
  const items = { 'con-pollo': [{ food_id: 'pollo', qty: 1 }], 'con-yogur': [{ food_id: 'yogur', qty: 1 }] }

  test('entre dos recetas que se pueden hacer, elige la que gasta lo que vence pronto', () => {
    const nuevas = armarPlan({ ...base(rs, items), fechas: ['2026-10-26'], vence: new Map([['yogur', '2026-10-28']]), hoy: '2026-10-25' })
    expect(nuevas.find((n) => n.meal === 'almuerzo').recipe_id).toBe('con-yogur')
  })
  test('si cuando llegue ese día ya está vencido, no cuenta', () => {
    const nuevas = armarPlan({ ...base(rs, items), fechas: ['2026-10-30'], vence: new Map([['yogur', '2026-10-28']]), hoy: '2026-10-25' })
    expect(nuevas.find((n) => n.meal === 'almuerzo').recipe_id).toBe('con-pollo')
  })
  test('lo que vence más lejos pesa menos que lo que vence ya', () => {
    const lejos = armarPlan({ ...base(rs, items), fechas: ['2026-10-26'], vence: new Map([['yogur', '2026-12-20']]), hoy: '2026-10-25' })
    expect(lejos.find((n) => n.meal === 'almuerzo').recipe_id).toBe('con-pollo')
  })
  test('"aprovechado" cuenta lo que se gasta antes de que venza, de lo más urgente a lo menos', () => {
    const nuevas = [{ date: '2026-10-26', meal: 'almuerzo', recipe_id: 'con-yogur' }]
    const a = aprovechado(nuevas, {
      ...base(rs, items),
      vence: new Map([
        ['yogur', '2026-10-28'],
        ['pollo', '2026-10-27'],
      ]),
      hoy: '2026-10-25',
    })
    expect(a).toHaveLength(1)
    expect(a[0]).toMatchObject({ food_id: 'yogur', dias: 3, recetas: ['con-yogur'] })
  })
})

describe('el objetivo del día', () => {
  const rs = [receta('liviana', 'almuerzo'), receta('justa', 'almuerzo'), receta('pesada', 'almuerzo')]
  const macros = new Map([
    ['liviana', { kcal: 200, protein: 10 }],
    ['justa', { kcal: 700, protein: 40 }],
    ['pesada', { kcal: 1500, protein: 40 }],
  ])
  const items = { liviana: [{ food_id: 'arroz', qty: 1 }], justa: [{ food_id: 'arroz', qty: 1 }], pesada: [{ food_id: 'arroz', qty: 1 }] }

  test('con un objetivo de 2000, el almuerzo es el que más se acerca a su parte', () => {
    const nuevas = armarPlan({
      ...base(rs, items),
      fechas: ['2026-10-26'],
      objetivoDe: () => ({ kcal: 2000, protein: 120 }),
      macrosPorReceta: macros,
    })
    expect(nuevas.find((n) => n.meal === 'almuerzo').recipe_id).toBe('justa')
  })
  test('lo que el día ya tiene se descuenta: con el día casi lleno elige lo liviano', () => {
    const existentes = new Map([['2026-10-26|desayuno', { recipe_id: 'pesada', date: '2026-10-26', meal: 'desayuno' }]])
    const nuevas = armarPlan({
      ...base([...rs, receta('d', 'desayuno')], { ...items, d: [{ food_id: 'arroz', qty: 1 }] }),
      fechas: ['2026-10-26'],
      existentes,
      objetivoDe: () => ({ kcal: 2000, protein: 0 }),
      macrosPorReceta: macros,
    })
    expect(nuevas.find((n) => n.meal === 'almuerzo').recipe_id).toBe('liviana')
  })
  test('sin objetivo todo anda como antes', () => {
    const nuevas = armarPlan({ ...base(rs, items), fechas: ['2026-10-26'] })
    expect(nuevas.length).toBeGreaterThan(0)
  })
})

// Alimentos sueltos en el plan: calorías, faltantes y "Armar con lo que tengo" (lib/planificador.js).
import { expect, test } from 'vitest'
import { armarPlan, estadoDelPlan, macrosDeFila } from '../../src/lib/planificador.js'

const mate = { id: 'mate', name: 'Mate cebado', unit: 'ml', kcal: 1, protein: 0, carbs: 0, fat: 0 }
const galletitas = { id: 'galle', name: 'Galletitas', unit: 'g', kcal: 450, protein: 8, carbs: 70, fat: 15 }
const alimentosPorId = new Map([mate, galletitas].map((a) => [a.id, a]))
const tostada = { id: 'r1', name: 'Tostadas con queso', servings: 1, meal_types: ['merienda'], portable: true, minutes: 5 }
const macrosPorReceta = new Map([['r1', { kcal: 300, protein: 12, carbs: 30, fat: 10 }]])
// Lo que gasta un alimento suelto, ya en el alimento base (acá cada uno vale por sí mismo)
const alimentoDe = (fila) => [{ food_id: fila.food_id, qty: Number(fila.qty) }]
const suelto = (extra) => ({ id: 'p1', date: '2026-10-20', meal: 'merienda', recipe_id: null, food_id: 'galle', qty: '100', ...extra })

test('las calorías de una comida del plan salen de la receta o del alimento con su cantidad', () => {
  const ctx = { macrosPorReceta, alimentosPorId }
  expect(macrosDeFila({ recipe_id: 'r1' }, ctx).kcal).toBe(300)
  expect(macrosDeFila(suelto({ qty: '200' }), ctx).kcal).toBe(900)
  expect(macrosDeFila(suelto({ food_id: 'borrado' }), ctx)).toBeNull()
  expect(macrosDeFila({ recipe_id: null, food_id: null }, ctx)).toBeNull()
})

test('un alimento suelto que está en la despensa y alcanza queda "listo"; si no alcanza, falta y va a la lista', () => {
  const alcanza = estadoDelPlan([suelto()], {
    recetas: new Map(),
    itemsDe: () => [],
    stock: new Map([['galle', 150]]),
    preparado: new Map(),
    alimentoDe,
  })
  expect(alcanza.estados.get('p1')).toEqual({ estado: 'listo', faltan: [] })
  expect(alcanza.faltantes.size).toBe(0)
  const noAlcanza = estadoDelPlan([suelto()], {
    recetas: new Map(),
    itemsDe: () => [],
    stock: new Map([['galle', 40]]),
    preparado: new Map(),
    alimentoDe,
  })
  expect(noAlcanza.estados.get('p1').estado).toBe('falta')
  expect(noAlcanza.faltantes.get('galle')).toBeCloseTo(60)
})

test('lo que la persona no lleva en la despensa (el mate, el agua) no aparece como falta comprar', () => {
  const r = estadoDelPlan([suelto({ food_id: 'mate', qty: '500' })], {
    recetas: new Map(),
    itemsDe: () => [],
    stock: new Map([['galle', 150]]),
    preparado: new Map(),
    alimentoDe,
  })
  expect(r.estados.size).toBe(0)
  expect(r.faltantes.size).toBe(0)
})

test('los alimentos sueltos se van gastando de la despensa en orden, junto con las recetas', () => {
  const filas = [suelto({ id: 'a', date: '2026-10-20', qty: '100' }), suelto({ id: 'b', date: '2026-10-21', qty: '100' })]
  const r = estadoDelPlan(filas, {
    recetas: new Map(),
    itemsDe: () => [],
    stock: new Map([['galle', 150]]),
    preparado: new Map(),
    alimentoDe,
  })
  expect(r.estados.get('a').estado).toBe('listo')
  expect(r.estados.get('b').estado).toBe('falta')
  expect(r.faltantes.get('galle')).toBeCloseTo(50)
})

test('"Armar con lo que tengo" respeta un alimento suelto y no lo pisa con una receta', () => {
  const existentes = new Map([['2026-10-20|merienda', suelto()]])
  const nuevas = armarPlan({
    fechas: ['2026-10-20'],
    recetas: new Map([['r1', tostada]]),
    itemsDe: () => [{ food_id: 'galle', qty: 50 }],
    stock: new Map([['galle', 500]]),
    preparado: new Map(),
    reglas: new Set(),
    existentes,
    alimentoDe,
  })
  expect(nuevas.some((n) => n.meal === 'merienda')).toBe(false)
})

// Los textos y la cuenta de lib/ajuste.js (la misma que hace la base, ver sin-conexion.test.js)
import { expect, test } from 'vitest'
import { ajustarRegistro, cantidadDeRegistro, describirAjuste, devolverRegistro, pasaDeCalorias } from '../../src/lib/ajuste.js'

const pollo = { id: 'pollo', name: 'Pollo', unit: 'g', kcal: 160, protein: 24, carbs: 0, fat: 3 }
const alimentos = new Map([['pollo', pollo]])
const saber = { alimento: (id) => alimentos.get(id), receta: () => ({ name: 'Omelette' }) }
const registro = (extra = {}) => ({
  id: 'r1',
  food_id: 'pollo',
  qty: 200,
  kcal: 320,
  protein: 48,
  carbs: 0,
  fat: 6,
  descontado: { s: [{ f: 'pollo', q: 200, n: 200 }], p: 0, pn: 0 },
  ...extra,
})

test('bajar la cantidad: calorías en proporción y la diferencia vuelve a la despensa', () => {
  const r = ajustarRegistro(registro(), 150, [{ food_id: 'pollo', qty: 800 }], [])
  expect(r.registro).toMatchObject({ qty: 150, kcal: 240, protein: 36, descontado: { s: [{ f: 'pollo', q: 150, n: 150 }], p: 0, pn: 0 } })
  expect(r.stock).toEqual([{ food_id: 'pollo', delta: 50 }])
  expect(describirAjuste(r, saber)).toEqual({ efectos: ['Vuelve a la despensa: 50 g de Pollo.'], avisos: [] })
})

test('subir de más: se descuenta lo que hay y se avisa lo que faltó', () => {
  const r = ajustarRegistro(registro(), 400, [{ food_id: 'pollo', qty: 120 }], [])
  expect(r.stock).toEqual([{ food_id: 'pollo', delta: -120 }])
  expect(r.registro.descontado.s).toEqual([{ f: 'pollo', q: 320, n: 400 }])
  expect(describirAjuste(r, saber)).toEqual({
    efectos: ['Se descuenta de la despensa: 120 g de Pollo.'],
    avisos: ['De Pollo no alcanza (faltan 80 g): la despensa queda en cero.'],
  })
})

test('anotado de más y corregido: se descuenta lo que hacía falta, no lo que alcanzó', () => {
  // 20 huevos pedidos con 8 en la despensa: salieron 8. Al volver a 4 hacen falta 4 y sobran 4.
  const huevos = registro({ qty: 20, kcal: 1600, protein: 120, descontado: { s: [{ f: 'pollo', q: 8, n: 20 }], p: 0, pn: 0 } })
  const r = ajustarRegistro(huevos, 4, [{ food_id: 'pollo', qty: 0 }], [])
  expect(r.stock).toEqual([{ food_id: 'pollo', delta: 4 }])
  expect(r.registro.descontado.s).toEqual([{ f: 'pollo', q: 4, n: 4 }])
  expect(r.avisos.faltan).toEqual([])
})

test('producto que ya no está en la despensa, y registro sin dato: solo se corrige el diario', () => {
  const ausente = ajustarRegistro(registro(), 100, [], [])
  expect(ausente.stock).toEqual([])
  expect(describirAjuste(ausente, saber).avisos[0]).toMatch(/Pollo ya no está en la despensa/)
  const viejo = ajustarRegistro(registro({ descontado: null }), 100, [{ food_id: 'pollo', qty: 5 }], [])
  expect(viejo.stock).toEqual([])
  expect(viejo.registro.descontado).toBeNull()
  expect(describirAjuste(viejo, saber).avisos[0]).toMatch(/despensa no cambia/)
})

test('borrar devuelve todo lo descontado, incluso las porciones cocinadas de una receta', () => {
  const omelette = registro({ food_id: null, recipe_id: 'omelette', qty: 2, descontado: { s: [{ f: 'pollo', q: 80 }], p: 1.5 } })
  const r = devolverRegistro(omelette, [{ food_id: 'pollo', qty: 0 }], [{ recipe_id: 'omelette', portions: 0 }])
  expect(r.stock).toEqual([{ food_id: 'pollo', delta: 80 }])
  expect(r.preparado).toEqual([{ recipe_id: 'omelette', delta: 1.5 }])
  expect(describirAjuste(r, saber).efectos).toEqual(['Vuelve a la despensa: 80 g de Pollo, 1.5 porciones ya cocinadas de Omelette.'])
})

test('textos de cantidad y tope de calorías', () => {
  expect(cantidadDeRegistro(registro(), pollo)).toBe('200 g')
  expect(cantidadDeRegistro({ recipe_id: 'omelette', qty: 1 })).toBe('1 porción')
  expect(cantidadDeRegistro({ recipe_id: 'omelette', qty: 2.5 })).toBe('2.5 porciones')
  expect(pasaDeCalorias(registro(), 13000)).toBe(true)
  expect(pasaDeCalorias(registro(), 12000)).toBe(false)
})

// Ver una receta para otra cantidad de porciones (F-07): los pasos del selector y cómo se escriben las cantidades.
import { expect, test } from 'vitest'
import { cantidadEscalada, porcionesMas, porcionesMenos } from '../../src/lib/nutricion.js'
import { disponibilidad } from '../../src/lib/planificador.js'

const huevo = { unit: 'u', unit_label: 'huevo' }
const harina = { unit: 'g' }

test('más y menos: de a 1 hacia arriba, y por debajo de 1 se parte a la mitad', () => {
  expect(porcionesMas(1)).toBe(2)
  expect(porcionesMas(4)).toBe(5)
  expect(porcionesMas(0.25)).toBe(0.5)
  expect(porcionesMas(0.5)).toBe(1)
  expect(porcionesMenos(4)).toBe(3)
  expect(porcionesMenos(2)).toBe(1)
  expect(porcionesMenos(1)).toBe(0.5)
  expect(porcionesMenos(0.5)).toBe(0.25)
})

test('más y menos respetan los topes de la receta (0,25 a 50)', () => {
  expect(porcionesMas(50)).toBe(50)
  expect(porcionesMenos(0.25)).toBe(0.25)
  expect(porcionesMas(49.5)).toBe(50)
  expect(porcionesMenos(2.5)).toBe(2)
})

test('subir y bajar vuelve al mismo lugar', () => {
  for (const n of [0.5, 1, 2, 3, 10]) expect(porcionesMenos(porcionesMas(n))).toBe(n)
})

test('las unidades no se redondean al entero: medio huevo es medio huevo', () => {
  expect(cantidadEscalada(huevo, 1)).toBe('1 huevo')
  expect(cantidadEscalada(huevo, 3)).toBe('3 huevos')
  expect(cantidadEscalada(huevo, 0.5)).toBe('0.5 huevos')
  expect(cantidadEscalada(huevo, 0.25)).toBe('0.25 huevos')
  expect(cantidadEscalada(huevo, 1 / 3)).toBe('0.33 huevos')
})

test('los gramos se escriben como siempre (redondeados, con kg desde 1000)', () => {
  expect(cantidadEscalada(harina, 7.5)).toBe('8 g')
  expect(cantidadEscalada(harina, 250)).toBe('250 g')
  expect(cantidadEscalada(harina, 1500)).toBe('1.5 kg')
})

test('lo que falta se mide para las porciones que se miran', () => {
  const receta = { servings: 4 }
  const items = [
    { food_id: 'harina', qty: 400 },
    { food_id: 'huevo', qty: 4 },
  ]
  const stock = new Map([
    ['harina', 150],
    ['huevo', 1],
  ])
  // Para 1 porción: 100 g y 1 huevo. Alcanza.
  expect(disponibilidad(receta, items, stock, 1).ok).toBe(true)
  // Para 2: 200 g y 2 huevos. Faltan 50 g y 1 huevo.
  const dos = disponibilidad(receta, items, stock, 2)
  expect(dos.ok).toBe(false)
  expect(dos.faltan).toEqual([
    { food_id: 'harina', falta: 50 },
    { food_id: 'huevo', falta: 1 },
  ])
  // Para las 4 de la receta: 250 g y 3 huevos
  expect(disponibilidad(receta, items, stock, 4).faltan.map((f) => f.falta)).toEqual([250, 3])
})

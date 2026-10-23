// Cruce de lo que entendió la IA con los alimentos y recetas de la app (lib/registroIA.js).
import { describe, expect, test } from 'vitest'
import { foodsTodos, recipesTodas } from '../../scripts/seed-sexta.mjs'
import { cantidadPara, emparejar, nivelDe, palabras, parecido, platosDe, porcionesPara } from '../../src/lib/registroIA.js'

// Los alimentos y recetas de la base, con la forma que tienen en la app
const alimentos = foodsTodos.map((f, i) => ({ id: `f${i}`, slug: f[0], name: f[1], unit: f[2], kcal: f[5], unit_grams: f[3] }))
const recetas = recipesTodas.map((r, i) => ({ id: `r${i}`, name: r.name, slug: r.slug }))
const item = (nombre, extra = {}) => ({ nombre, cantidad: 1, unidad: 'porcion', gramos: 150, confianza: 0.8, ...extra })

describe('palabras y parecido', () => {
  test('sin tildes, plural ni relleno', () => {
    expect(palabras('Milanesas de Pollo')).toEqual(['milanesa', 'pollo'])
    expect(palabras('ñoquis con salsa')).toEqual(['noqui', 'salsa'])
    expect(palabras('Huevos')).toEqual(['huevo'])
  })
  test('lo igual vale 1 y lo que no tiene nada que ver, 0', () => {
    expect(parecido('arroz blanco', 'Arroz blanco')).toBe(1)
    expect(parecido('arroz', 'Pollo')).toBe(0)
    expect(parecido('arroz blanco hervido', 'Arroz blanco')).toBeGreaterThan(0.6)
  })
})

describe('con la base de verdad', () => {
  test('la base se cargó', () => {
    expect(alimentos.length).toBeGreaterThan(500)
    expect(recetas.length).toBeGreaterThan(1000)
  })
  test.each([
    ['huevo', /huevo/i],
    ['arroz blanco', /arroz/i],
    ['pan', /pan/i],
    ['banana', /banana/i],
    ['leche', /leche/i],
  ])('"%s" cae en un alimento que se llama parecido', (dicho, esperado) => {
    const c = emparejar(item(dicho, { unidad: 'g', cantidad: 100 }), { alimentos, recetas })
    expect(c.length).toBeGreaterThan(0)
    expect(c[0].objeto.name).toMatch(esperado)
    expect(nivelDe(c)).not.toBe('ninguno')
  })
  test('un plato conocido cae en el alimento o la receta que se llama igual', () => {
    const c = emparejar(item('milanesa de pollo al horno'), { alimentos, recetas })
    expect(['alimento', 'receta']).toContain(c[0].tipo)
    expect(c[0].objeto.name.toLowerCase()).toContain('milanesa')
  })
  test('algo que no existe no se cruza solo', () => {
    const c = emparejar(item('xyzzy plugh'), { alimentos, recetas })
    expect(nivelDe(c)).toBe('ninguno')
  })
})

describe('cantidades', () => {
  const huevo = { id: 'h', unit: 'u', unit_grams: 50 }
  const arroz = { id: 'a', unit: 'g' }
  const leche = { id: 'l', unit: 'ml' }
  test('en unidades: "dos huevos" son 2; con gramos se divide por lo que pesa uno', () => {
    expect(cantidadPara(huevo, item('huevo', { cantidad: 2, unidad: 'unidad', gramos: 100 }))).toBe(2)
    expect(cantidadPara(huevo, item('huevo', { cantidad: 1, unidad: 'porcion', gramos: 120 }))).toBe(2.5)
  })
  test('en gramos y ml: lo dicho, o la estimación, de a 5', () => {
    expect(cantidadPara(arroz, item('arroz', { cantidad: 153, unidad: 'g', gramos: 153 }))).toBe(155)
    expect(cantidadPara(arroz, item('arroz', { cantidad: 1, unidad: 'porcion', gramos: 180 }))).toBe(180)
    expect(cantidadPara(leche, item('leche', { cantidad: 250, unidad: 'ml', gramos: 250 }))).toBe(250)
    expect(cantidadPara(arroz, item('arroz', { cantidad: 1, unidad: 'g', gramos: 1 }))).toBe(5)
  })
  test('porciones de receta', () => {
    expect(porcionesPara(item('x', { cantidad: 2, unidad: 'unidad' }))).toBe(2)
    expect(porcionesPara(item('x', { cantidad: 300, unidad: 'g' }))).toBe(1)
  })
})

describe('platosDe', () => {
  test('separa lo que cruzó de lo que no', () => {
    const { platos, sinCruzar } = platosDe([item('arroz blanco', { unidad: 'g', cantidad: 150 }), item('zzzz qqqq')], {
      alimentos,
      recetas,
    })
    expect(platos).toHaveLength(1)
    expect(platos[0].food_id).toBeTruthy()
    expect(sinCruzar).toHaveLength(1)
  })
})

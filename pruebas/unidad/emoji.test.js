// Íconos de alimentos y recetas (1.26): cada nombre tiene que dibujar lo que es.
import { describe, expect, it } from 'vitest'
import { emojiDe, reconocido } from '../../src/lib/emoji'
import { foodsTodos, recipesTodas } from '../../scripts/seed-sexta.mjs'

describe('emojiDe', () => {
  it.each([
    ['Milanesa de pollo al horno', '🍗'],
    ['Milanesa de ternera', '🥩'],
    ['Queso rallado', '🧀'],
    ['Arroz con leche', '🍮'],
    ['Dulce de leche', '🍯'],
    ['Tomate', '🍅'],
    ['Salsa de tomate', '🥫'],
    ['Pan rallado', '🍞'],
    ['Papas fritas', '🍟'],
    ['Tostado con café con leche', '🥪'],
    ['Leche de avena', '🥛'],
  ])('%s → %s', (nombre, esperado) => {
    expect(emojiDe(nombre, 'Despensa')).toBe(esperado)
  })

  it('sin pistas en el nombre usa la categoría', () => {
    expect(emojiDe('Zzz', 'Carnes y huevos')).toBe('🥩')
    expect(emojiDe('Zzz', 'receta')).toBe('🍽️')
  })

  it('no se confunde por mayúsculas ni tildes', () => {
    expect(emojiDe('MILANESA DE POLLO', 'x')).toBe(emojiDe('milanesa de pollo', 'x'))
    expect(emojiDe('Café', 'x')).toBe(emojiDe('cafe', 'x'))
  })

  it('reconoce casi toda la base', () => {
    const r = recipesTodas.filter((x) => !reconocido(x.name))
    expect(r.length).toBe(0)
    const f = foodsTodos.filter((x) => !reconocido(x[1]))
    expect(f.length / foodsTodos.length).toBeLessThan(0.06)
  })
})

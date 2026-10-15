// Qué bebidas cuentan para el líquido del día: agua, mate, infusiones, soda, bebidas sin azúcar y leche.
// Las azucaradas (4 g o más de hidratos cada 100 ml) y el alcohol suman calorías, pero no líquido.
import { expect, test } from 'vitest'
import { cuentaComoLiquido, esAzucarada } from '../../src/lib/nutricion.js'

const bebida = (carbs, extra = {}) => ({ unit: 'ml', category: 'Bebidas', carbs, alcohol: false, ...extra })

test('cuentan: agua, mate, soda, gaseosa zero, café con leche, leche', () => {
  expect(cuentaComoLiquido(bebida(0))).toBe(true)
  expect(cuentaComoLiquido(bebida(0.2))).toBe(true)
  expect(cuentaComoLiquido(bebida(2.4))).toBe(true)
  expect(cuentaComoLiquido({ unit: 'ml', category: 'Lácteos', carbs: 4.8, alcohol: false })).toBe(true)
})

test('no cuentan: gaseosa común, jugo, energizante, chocolatada, alcohol, sólidos', () => {
  expect(cuentaComoLiquido(bebida(10.5))).toBe(false)
  expect(cuentaComoLiquido(bebida(11))).toBe(false)
  expect(cuentaComoLiquido(bebida(12))).toBe(false)
  expect(cuentaComoLiquido(bebida(4))).toBe(false)
  expect(cuentaComoLiquido(bebida(0, { alcohol: true }))).toBe(false)
  expect(cuentaComoLiquido({ unit: 'g', category: 'Bebidas', carbs: 0 })).toBe(false)
  expect(esAzucarada(bebida(3.9))).toBe(false)
  expect(esAzucarada({ unit: 'ml', category: 'Lácteos', carbs: 4.8 })).toBe(false)
})

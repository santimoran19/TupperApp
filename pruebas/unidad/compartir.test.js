// La lista de compras hecha texto para WhatsApp (F-05): agrupada por categoría, con negrita de WhatsApp y las cantidades de la app.
import { expect, test } from 'vitest'
import { enlaceWhatsApp, textoDeLista } from '../../src/lib/compartir.js'

const arroz = { name: 'Arroz', unit: 'g', category: 'Cereales' }
const huevo = { name: 'Huevo', unit: 'u', unit_label: 'huevo', category: 'Lácteos y huevos' }
const leche = { name: 'Leche', unit: 'ml', category: 'Lácteos y huevos' }
const sinCategoria = { name: 'Cosa', unit: 'g' }

test('sin nada para comprar no hay texto', () => {
  expect(textoDeLista([])).toBe('')
})

test('va agrupada por categoría, ordenada, con las cantidades de la app', () => {
  const t = textoDeLista([
    { a: leche, qty: 1500 },
    { a: arroz, qty: 500 },
    { a: huevo, qty: 12 },
  ])
  expect(t).toBe(
    ['*Lista de compras*', '', '*Cereales*', '• Arroz: 500 g', '', '*Lácteos y huevos*', '• Huevo: 12 huevos', '• Leche: 1.5 L'].join('\n'),
  )
})

test('un solo huevo va en singular y lo que no tiene categoría va en Otros', () => {
  const t = textoDeLista([
    { a: huevo, qty: 1 },
    { a: sinCategoria, qty: 100 },
  ])
  expect(t).toContain('• Huevo: 1 huevo')
  expect(t).toContain('*Otros*\n• Cosa: 100 g')
})

test('en un hogar el título lleva el nombre', () => {
  expect(textoDeLista([{ a: arroz, qty: 500 }], { hogar: 'Casa de Ana' }).split('\n')[0]).toBe('*Lista de compras · Casa de Ana*')
})

test('el enlace de WhatsApp lleva el texto escapado, con saltos de línea y tildes', () => {
  const url = enlaceWhatsApp('*Lista*\n• Leche: 1 L')
  expect(url.startsWith('https://wa.me/?text=')).toBe(true)
  expect(decodeURIComponent(url.split('text=')[1])).toBe('*Lista*\n• Leche: 1 L')
  expect(url).not.toContain('\n')
})

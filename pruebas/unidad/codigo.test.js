// Códigos de barras: limpieza y dígito verificador.
import { expect, test } from 'vitest'
import { codigoValido, errCodigo, esCodigoDeBarras, limpiarCodigo } from '../../src/lib/codigo.js'
import { deCatalogo } from '../../src/lib/producto.js'

test('los códigos de verdad pasan: EAN-13, EAN-8, UPC-A e ITF-14', () => {
  for (const c of ['4006381333931', '9780201379624', '5449000000996', '73513537', '036000291452', '10012345678902'])
    expect(codigoValido(c), c).toBe(true)
})

test('un número cambiado, de menos o de más, no pasa', () => {
  for (const c of ['4006381333932', '4006381333913', '400638133393', '40063813339311', '1234567', '12345678901', '0000000000001'])
    expect(codigoValido(c), c).toBe(false)
  expect(codigoValido('abc')).toBe(false)
  expect(codigoValido('')).toBe(false)
  expect(codigoValido(null)).toBe(false)
})

test('se limpian los espacios y guiones que se pegan o se escriben', () => {
  expect(limpiarCodigo(' 400638 1333931 ')).toBe('4006381333931')
  expect(limpiarCodigo('4006-3813-33931')).toBe('4006381333931')
  expect(codigoValido('400 638 133 3931')).toBe(true)
})

test('los mensajes dicen qué está mal', () => {
  expect(errCodigo('')).toMatch(/Escribí los números/)
  expect(errCodigo('12ab')).toMatch(/solo números/)
  expect(errCodigo('12345')).toMatch(/8, 12, 13 o 14/)
  expect(errCodigo('4006381333932')).toMatch(/no es válido/)
  expect(errCodigo('4006381333931')).toBeNull()
})

test('lo que acepta la base: 8 a 14 números', () => {
  for (const c of ['12345678', '12345678901234']) expect(esCodigoDeBarras(c)).toBe(true)
  for (const c of ['1234567', '123456789012345', '1234567a', 'n:galletitas', '', null]) expect(esCodigoDeBarras(c)).toBe(false)
})

test('una fila del catálogo se ve igual que un producto de Open Food Facts', () => {
  const p = deCatalogo({
    clave: '4006381333931',
    codigo: '4006381333931',
    name: 'Resaltador',
    detalle: null,
    unit: 'ml',
    kcal: '123.4',
    protein: '1.26',
    carbs: '10',
    fat: '0',
    category: 'Bebidas',
    alcohol: false,
  })
  expect(p).toEqual({
    codigo: '4006381333931',
    name: 'Resaltador',
    detalle: '',
    unit: 'ml',
    category: 'Bebidas',
    kcal: 123,
    protein: 1.3,
    carbs: 10,
    fat: 0,
    alcohol: false,
    argentino: false,
    deCatalogo: true,
  })
  // Sin código usa la clave (no es un código de barras, así que no se guarda como tal)
  expect(
    deCatalogo({ clave: 'n:alfajor', codigo: null, name: 'A', unit: 'g', kcal: 1, protein: 0, carbs: 0, fat: 0, category: 'x' }).codigo,
  ).toBe('n:alfajor')
})

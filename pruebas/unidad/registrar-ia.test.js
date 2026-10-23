// La función `registrar-ia` (carga de comida por foto, voz o texto): la parte que se puede probar sin red.
import { describe, expect, test } from 'vitest'
import {
  bytesDeBase64,
  encabezadosCors,
  esBase64,
  interpretarItems,
  origenAjeno,
  origenesPermitidos,
  tipoBase,
} from '../../supabase/functions/registrar-ia/logica.ts'

describe('interpretarItems', () => {
  test('lee el JSON aunque venga con ``` y texto alrededor', () => {
    const r = interpretarItems(
      'Acá va:\n```json\n{"items":[{"nombre":"Milanesa de pollo","cantidad":2,"unidad":"unidad","gramos":240,"confianza":0.8}]}\n```',
    )
    expect(r).toEqual([{ nombre: 'Milanesa de pollo', cantidad: 2, unidad: 'unidad', gramos: 240, confianza: 0.8 }])
  })
  test('números como texto con coma, unidades raras y valores fuera de rango', () => {
    const r = interpretarItems(
      JSON.stringify({
        items: [
          { nombre: 'arroz', cantidad: '1,5', unidad: 'Porción', gramos: '200' },
          { nombre: 'agua', cantidad: 99999, unidad: 'ml', gramos: 99999, confianza: 7 },
        ],
      }),
    )
    expect(r[0]).toMatchObject({ cantidad: 1.5, unidad: 'porcion', gramos: 200, confianza: 0.5 })
    expect(r[1]).toMatchObject({ cantidad: 3000, gramos: 3000, confianza: 1 })
  })
  test('descarta lo que no sirve y nunca tira', () => {
    expect(interpretarItems('')).toEqual([])
    expect(interpretarItems('no sé')).toEqual([])
    expect(interpretarItems('{"items": "hola"}')).toEqual([])
    expect(
      interpretarItems('{"items":[{"nombre":"x"},{"nombre":"pan","cantidad":0,"gramos":0},{"nombre":"pan","gramos":40}]}'),
    ).toHaveLength(1)
  })
  test('hasta 12 ítems y el nombre se acorta', () => {
    const muchos = Array.from({ length: 30 }, (_, i) => ({
      nombre: `comida ${i}`.padEnd(200, 'x'),
      cantidad: 1,
      unidad: 'unidad',
      gramos: 50,
    }))
    const r = interpretarItems(JSON.stringify({ items: muchos }))
    expect(r).toHaveLength(12)
    expect(r[0].nombre.length).toBe(80)
  })
  test('sin gramos usa la cantidad si es peso, o una porción típica', () => {
    const r = interpretarItems(
      '{"items":[{"nombre":"harina","cantidad":80,"unidad":"g"},{"nombre":"tarta","cantidad":1,"unidad":"porcion"}]}',
    )
    expect(r[0].gramos).toBe(80)
    expect(r[1].gramos).toBe(100)
  })
})

describe('entradas', () => {
  test('tamaño de un base64 y tipos', () => {
    expect(bytesDeBase64('AAAA')).toBe(3)
    expect(bytesDeBase64('AAA=')).toBe(2)
    expect(bytesDeBase64('AA==')).toBe(1)
    expect(esBase64('QUJD')).toBe(true)
    expect(esBase64('hola mundo!')).toBe(false)
    expect(esBase64('')).toBe(false)
    expect(tipoBase('audio/webm;codecs=opus')).toBe('audio/webm')
  })
  test('CORS: solo la app, o las páginas que se sumen', () => {
    expect(origenesPermitidos(undefined)).toEqual(['https://tupperapp.vercel.app'])
    expect(origenAjeno('https://malo.com', origenesPermitidos(undefined))).toBe(true)
    expect(origenAjeno(null, origenesPermitidos(undefined))).toBe(false)
    expect(encabezadosCors('https://tupperapp.vercel.app', origenesPermitidos(undefined), 'x')['Access-Control-Allow-Origin']).toBe(
      'https://tupperapp.vercel.app',
    )
    expect(encabezadosCors('https://malo.com', origenesPermitidos(undefined), 'x')['Access-Control-Allow-Origin']).toBeUndefined()
  })
})

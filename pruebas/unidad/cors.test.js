// Desde qué páginas se puede llamar a las funciones de Supabase (S-02): solo la app, y otras si se suman a mano.
// La misma lógica está en las dos funciones (`entrar` y `analizar-semana`): se prueban las dos copias con los mismos casos.
import { describe, expect, test } from 'vitest'
import * as entrar from '../../supabase/functions/entrar/logica.ts'
import * as analizar from '../../supabase/functions/analizar-semana/logica.ts'

const CABECERAS = 'authorization, apikey, content-type'

describe.each([
  ['entrar', entrar],
  ['analizar-semana', analizar],
])('%s', (_nombre, f) => {
  test('sin configurar, solo se permite la app', () => {
    expect(f.origenesPermitidos(undefined)).toEqual(['https://tupperapp.vercel.app'])
    expect(f.origenesPermitidos(null)).toEqual(['https://tupperapp.vercel.app'])
    expect(f.origenesPermitidos('')).toEqual(['https://tupperapp.vercel.app'])
    expect(f.origenesPermitidos(' , ,')).toEqual(['https://tupperapp.vercel.app'])
  })

  test('el secreto puede sumar más páginas, separadas por coma, sin espacios ni barra final', () => {
    expect(f.origenesPermitidos('https://tupperapp.vercel.app, https://otro.com/ ,http://localhost:5173')).toEqual([
      'https://tupperapp.vercel.app',
      'https://otro.com',
      'http://localhost:5173',
    ])
  })

  test('a un origen permitido se le abre la puerta con su nombre, nunca con asterisco', () => {
    const permitidos = f.origenesPermitidos(undefined)
    const h = f.encabezadosCors('https://tupperapp.vercel.app', permitidos, CABECERAS)
    expect(h['Access-Control-Allow-Origin']).toBe('https://tupperapp.vercel.app')
    expect(h['Access-Control-Allow-Headers']).toBe(CABECERAS)
    expect(h['Access-Control-Allow-Methods']).toBe('POST, OPTIONS')
    expect(h.Vary).toBe('Origin')
  })

  test('a otro origen, o a nadie, no se le da el permiso', () => {
    const permitidos = f.origenesPermitidos(undefined)
    for (const origen of [
      'https://otra-pagina.com',
      'http://tupperapp.vercel.app',
      'https://tupperapp.vercel.app.malo.com',
      'null',
      null,
    ]) {
      const h = f.encabezadosCors(origen, permitidos, CABECERAS)
      expect(h['Access-Control-Allow-Origin'], String(origen)).toBeUndefined()
      expect(h.Vary).toBe('Origin')
    }
  })

  test('un pedido de otra página se rechaza; sin Origin (curl, otro servidor) pasa como siempre', () => {
    const permitidos = f.origenesPermitidos(undefined)
    expect(f.origenAjeno('https://otra-pagina.com', permitidos)).toBe(true)
    expect(f.origenAjeno('null', permitidos)).toBe(true)
    expect(f.origenAjeno('https://tupperapp.vercel.app', permitidos)).toBe(false)
    expect(f.origenAjeno(null, permitidos)).toBe(false)
    expect(f.origenAjeno('', permitidos)).toBe(false)
  })
})

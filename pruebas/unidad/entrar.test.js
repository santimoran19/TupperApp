// La función `entrar` (iniciar sesión con el usuario): lo que no depende de Supabase. El resto se prueba en el navegador
// (pruebas/e2e/16-nombre-de-usuario.spec.js), con la función corriendo de verdad.
import { expect, test } from 'vitest'
import { codigoDeError, EMAIL_DE_MENTIRA, FORMATO_USUARIO, leerPedido } from '../../supabase/functions/entrar/logica.ts'
import { errUsuario } from '../../src/lib/validar.js'

test('lee el pedido: usuario en minúsculas y sin espacios, la contraseña tal cual', () => {
  expect(leerPedido({ usuario: '  Santi.M ', clave: ' Ab 1 ', captchaToken: 'tok' })).toEqual({
    usuario: 'santi.m',
    clave: ' Ab 1 ',
    captcha: 'tok',
  })
  expect(leerPedido({ usuario: 'ana', clave: 'x' })?.captcha).toBeUndefined()
})

test('un pedido mal armado se rechaza', () => {
  for (const malo of [null, undefined, 'texto', 5, {}, { usuario: 'ana' }, { usuario: 'ana', clave: '' }, { usuario: 7, clave: 'x' }])
    expect(leerPedido(malo)).toBeNull()
  expect(leerPedido({ usuario: 'ana', clave: 'x'.repeat(73) })).toBeNull()
  expect(leerPedido({ usuario: 'a'.repeat(61), clave: 'x' })).toBeNull()
})

test('el formato que acepta la función es el mismo que acepta la app', () => {
  const casos = [
    'ana',
    'ab',
    'a'.repeat(20),
    'a'.repeat(21),
    'ana.gomez',
    'ana..g',
    '.ana',
    'ana-',
    '123',
    'ñandu',
    'ana gomez',
    'ana@x.com',
    'a_b-c.d',
  ]
  for (const u of casos) {
    // Si la app lo deja pasar por formato, la función también (la app puede rechazar más por palabras reservadas)
    const appLoAcepta = !errUsuario(u)
    if (appLoAcepta) expect(FORMATO_USUARIO.test(u), u).toBe(true)
  }
  expect(FORMATO_USUARIO.test('ana"; drop')).toBe(false)
})

test('los errores de Supabase se traducen a tres códigos y nunca dicen si el usuario existe', () => {
  expect(codigoDeError('captcha protection: request disallowed')).toBe('captcha')
  expect(codigoDeError('email rate limit exceeded')).toBe('espera')
  expect(codigoDeError('Invalid login credentials')).toBe('credenciales')
  expect(codigoDeError('Email not confirmed')).toBe('credenciales')
  expect(codigoDeError('lo que sea')).toBe('credenciales')
  expect(EMAIL_DE_MENTIRA).toMatch(/\.invalid$/)
})

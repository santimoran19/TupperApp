// Verificación en dos pasos (1.29, S-06): la base exige el código a quien la activó (actualizacion-22.sql), y la app
// sabe cuándo pedirlo (src/lib/dosPasos.js). También las tablas de los recordatorios con la app cerrada (F-06).
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { abrirBase, ANA, BETO, fallo } from './postgres.js'

vi.mock('../../src/lib/supabase', () => ({ supabase: {} }))
const { codigoValido, factoresActivos, faltaCodigo, nivelDe } = await import('../../src/lib/dosPasos.js')

const jwt = (datos) => `x.${Buffer.from(JSON.stringify(datos)).toString('base64url')}.y`

describe('cuándo pedir el código', () => {
  const conFactor = { factors: [{ id: 'f1', status: 'verified', factor_type: 'totp' }] }
  it('lee el nivel de la sesión', () => {
    expect(nivelDe(jwt({ aal: 'aal2' }))).toBe('aal2')
    expect(nivelDe(jwt({ sub: 'x' }))).toBe('aal1')
    expect(nivelDe('basura')).toBe('aal1')
    expect(nivelDe(undefined)).toBe('aal1')
  })
  it('solo cuentan los factores verificados', () => {
    expect(factoresActivos({ factors: [{ status: 'unverified', factor_type: 'totp' }] })).toEqual([])
    expect(factoresActivos(conFactor)).toHaveLength(1)
    expect(factoresActivos(null)).toEqual([])
  })
  it('falta el código si lo activó y entró solo con la contraseña', () => {
    expect(faltaCodigo({ user: conFactor, access_token: jwt({ aal: 'aal1' }) })).toBe(true)
    expect(faltaCodigo({ user: conFactor, access_token: jwt({ aal: 'aal2' }) })).toBe(false)
    expect(faltaCodigo({ user: { factors: [] }, access_token: jwt({ aal: 'aal1' }) })).toBe(false)
  })
  it('un código son 6 números', () => {
    expect(codigoValido('123456')).toBe(true)
    expect(codigoValido(' 123456 ')).toBe(true)
    expect(codigoValido('12345')).toBe(false)
    expect(codigoValido('12a456')).toBe(false)
  })
})

describe('la base exige el código (actualizacion-22.sql)', () => {
  let b
  beforeAll(async () => {
    b = await abrirBase()
    await b.db.query("insert into auth.mfa_factors (user_id, status) values ($1, 'verified')", [ANA])
  }, 60000)

  // Como `como`, pero con el nivel de la sesión en el permiso
  async function con(usuario, aal, fn) {
    await b.db.query(`select set_config('request.jwt.claims', $1, false)`, [JSON.stringify({ sub: usuario, aal })])
    try {
      return await b.como(usuario, fn)
    } finally {
      await b.db.query(`select set_config('request.jwt.claims', '', false)`)
    }
  }
  const anotar = () =>
    b.db.query("insert into public.measurements (user_id, date, weight_kg) values (auth.uid(), '2026-10-01', 70) returning user_id")

  it('con la verificación activada y solo la contraseña, no ve ni cambia nada', async () => {
    await con(ANA, 'aal2', anotar)
    expect(await con(ANA, 'aal1', () => b.filas('select * from public.measurements'))).toEqual([])
    expect(await con(ANA, 'aal1', () => fallo(anotar()))).toMatch(/row-level security/)
    expect(await con(ANA, 'aal1', () => b.filas('select * from public.profiles'))).toEqual([])
  })

  it('todas las tablas con seguridad por filas tienen la regla (las que se agreguen después también la necesitan)', async () => {
    const sin = await b.filas(`
      select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
        and not exists (select 1 from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname and p.policyname = 'dos_pasos')`)
    expect(sin.map((t) => t.relname)).toEqual([])
  })

  it('con el código, todo normal', async () => {
    expect((await con(ANA, 'aal2', () => b.filas('select * from public.measurements'))).length).toBe(1)
  })

  it('quien no la activó no nota nada', async () => {
    await con(BETO, 'aal1', anotar)
    expect((await con(BETO, 'aal1', () => b.filas('select * from public.measurements'))).length).toBe(1)
  })

  it('las suscripciones push: cada navegador es de una sola cuenta', async () => {
    const endpoint = 'https://fcm.googleapis.com/fcm/send/abc'
    const p256dh = 'B'.repeat(87)
    const auth = 'a'.repeat(22)
    await con(BETO, 'aal1', () => b.rpc('guardar_suscripcion', [endpoint, p256dh, auth]))
    expect(await con(BETO, 'aal1', () => b.filas('select endpoint from public.push_suscripciones'))).toHaveLength(1)
    // Entra Ana en el mismo navegador: pasa a ser de ella
    expect(await con(ANA, 'aal1', () => fallo(b.rpc('guardar_suscripcion', [endpoint, p256dh, auth])))).toMatch(/código/)
    await con(ANA, 'aal2', () => b.rpc('guardar_suscripcion', [endpoint, p256dh, auth]))
    expect(await con(BETO, 'aal1', () => b.filas('select endpoint from public.push_suscripciones'))).toEqual([])
    expect(await con(ANA, 'aal2', () => b.filas('select endpoint from public.push_suscripciones'))).toHaveLength(1)
    // Directo en la tabla no se puede escribir, ni mandar a otro lado que no sea https
    expect(
      await con(BETO, 'aal1', () =>
        fallo(
          b.db.query('insert into public.push_suscripciones (endpoint, p256dh, auth) values ($1, $2, $3)', ['https://x', p256dh, auth]),
        ),
      ),
    ).toMatch(/permission denied/)
    expect(await con(BETO, 'aal1', () => fallo(b.rpc('guardar_suscripcion', ['http://x', p256dh, auth])))).toMatch(/check/)
  })

  it('recordatorios: la fila propia sí; los enviados, ni verlos', async () => {
    await con(BETO, 'aal1', () =>
      b.db.query("insert into public.recordatorios (activo, config, zona) values (true, '{\"activo\":true}', 'Europe/Madrid')"),
    )
    expect(await con(ANA, 'aal2', () => b.filas('select * from public.recordatorios'))).toEqual([])
    expect(await con(BETO, 'aal1', () => fallo(b.filas('select * from public.recordatorios_enviados')))).toMatch(/permission denied/)
  })
})

describe('códigos TOTP del Supabase simulado', () => {
  it('dan lo que pide el RFC 6238', async () => {
    const { aBase32, codigoTotp } = await import('../e2e/servidor/totp.mjs')
    const secreto = aBase32(Buffer.from('12345678901234567890'))
    expect(secreto).toBe('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ')
    expect(codigoTotp(secreto, 59000)).toBe('287082')
    expect(codigoTotp(secreto, 1111111109000)).toBe('081804')
  })
})

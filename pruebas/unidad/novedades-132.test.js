// 1.32: códigos de recuperación (S-08), botones en las notificaciones (F-06b), el reloj y la vuelta semanal en el panel
// (T-13, C-06) y la actualización 25 en un Postgres de verdad.
import { beforeAll, describe, expect, it } from 'vitest'
import { abrirBase, ANA, BETO, fallo } from './postgres.js'
import { codigoValido, generarCodigos, huella, normalizar, nivelDe, esAccion } from '../../supabase/functions/dos-pasos/logica.ts'
import { avisoPorId, botonesDe, firmar, leerBoton, VIGENCIA_FIRMA_MS } from '../../supabase/functions/recordatorios-push/logica.ts'
import { estadoReloj } from '../../src/lib/admin.js'

describe('S-08: códigos de recuperación (la lógica de la función)', () => {
  let n = 0
  // "Azar" que va dando bytes distintos (para que la prueba no dependa de la suerte)
  const azar = (k) => Uint8Array.from({ length: k }, () => (n = (n * 73 + 41) % 256))
  it('genera 10 códigos distintos, de 8 letras y números que no se confunden, con guion', () => {
    const codigos = generarCodigos(azar)
    expect(codigos).toHaveLength(10)
    expect(new Set(codigos).size).toBe(10)
    for (const c of codigos) {
      expect(c).toMatch(/^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/)
      expect(codigoValido(c)).toBe(true)
    }
    // Con bytes de verdad también
    const reales = generarCodigos((k) => crypto.getRandomValues(new Uint8Array(k)))
    expect(reales.every(codigoValido)).toBe(true)
  })
  it('acepta el código como lo escriba la persona, y nada raro', () => {
    expect(normalizar(' abcd-efgh ')).toBe('ABCDEFGH')
    expect(codigoValido('abcd efgh')).toBe(true)
    expect(codigoValido('ABCD-EFG')).toBe(false)
    expect(codigoValido('ABCD-EFG0')).toBe(false) // el 0 no está (se confunde con la O)
    expect(codigoValido("x' or 1=1")).toBe(false)
    expect(esAccion('usar')).toBe(true)
    expect(esAccion('borrar')).toBe(false)
  })
  it('la huella depende de la cuenta y del código, no de cómo se escribió', async () => {
    const a = await huella(ANA, 'ABCD-EFGH')
    expect(a).toMatch(/^[0-9a-f]{64}$/)
    expect(await huella(ANA, 'abcd efgh')).toBe(a)
    expect(await huella(BETO, 'ABCD-EFGH')).not.toBe(a)
    expect(await huella(ANA, 'ABCD-EFGJ')).not.toBe(a)
  })
  it('lee el nivel de la sesión del permiso', () => {
    const jwt = (o) => `x.${Buffer.from(JSON.stringify(o)).toString('base64url')}.y`
    expect(nivelDe(jwt({ aal: 'aal2' }))).toBe('aal2')
    expect(nivelDe(jwt({}))).toBe('aal1')
    expect(nivelDe('basura')).toBe('aal1')
  })
})

describe('F-06b: botones en las notificaciones (la lógica de la función)', () => {
  const CLAVE = 'clave-del-reloj'
  it('el del agua trae "Tomé un vaso" y "Más tarde"; las comidas, "Más tarde"; el resto, nada', () => {
    expect(botonesDe('agua-3')).toEqual(['vaso', 'posponer'])
    expect(botonesDe('comida-cena')).toEqual(['posponer'])
    expect(botonesDe('peso')).toEqual([])
    expect(botonesDe('ayuno-123')).toEqual([])
    expect(avisoPorId('comida-almuerzo')).toMatchObject({ titulo: 'Es hora de almorzar', ruta: '/registrar?comida=almuerzo' })
    expect(avisoPorId('agua-0')).toMatchObject({ titulo: 'Tomá un vaso de agua' })
    expect(avisoPorId('comida-<script>')).toBeNull()
  })
  it('la firma vale solo para esa cuenta, ese aviso, ese botón y por 6 horas', async () => {
    const ahora = Date.parse('2026-10-24T15:00:00Z')
    const f = await firmar(CLAVE, ANA, '2026-10-24', 'agua-2', ahora)
    expect(await leerBoton({ accion: 'vaso', ...f }, CLAVE, ahora)).toMatchObject({ u: ANA, a: 'agua-2', accion: 'vaso' })
    expect(await leerBoton({ accion: 'posponer', ...f }, CLAVE, ahora)).not.toBeNull()
    // Tocada
    expect(await leerBoton({ accion: 'vaso', ...f, u: BETO }, CLAVE, ahora)).toBeNull()
    expect(await leerBoton({ accion: 'vaso', ...f, f: '2026-10-25' }, CLAVE, ahora)).toBeNull()
    expect(await leerBoton({ accion: 'vaso', ...f, a: 'agua-3' }, CLAVE, ahora)).toBeNull()
    expect(await leerBoton({ accion: 'vaso', ...f, e: f.e + 1000 }, CLAVE, ahora)).toBeNull()
    expect(await leerBoton({ accion: 'vaso', ...f }, 'otra-clave', ahora)).toBeNull()
    expect(await leerBoton({ accion: 'vaso', ...f }, undefined, ahora)).toBeNull()
    // Vencida
    expect(await leerBoton({ accion: 'vaso', ...f }, CLAVE, ahora + VIGENCIA_FIRMA_MS + 1)).toBeNull()
    // Un botón que ese aviso no tiene
    const comida = await firmar(CLAVE, ANA, '2026-10-24', 'comida-cena', ahora)
    expect(await leerBoton({ accion: 'vaso', ...comida }, CLAVE, ahora)).toBeNull()
    expect(await leerBoton(null, CLAVE, ahora)).toBeNull()
  })
})

describe('T-13: el reloj en el panel', () => {
  const ahora = Date.parse('2026-10-24T15:00:00Z')
  it('dice si anda bien, si está parado o si la función contesta con error', () => {
    expect(estadoReloj(null).nivel).toBe('sin')
    expect(estadoReloj({ armado: false }).nivel).toBe('mal')
    const bien = { armado: true, ultima: '2026-10-24T14:45:00Z', corridas: 96, fallidas: 0, con_error: 0 }
    expect(estadoReloj(bien, ahora)).toEqual({ nivel: 'bien', texto: 'Anda bien: 96 corridas en 24 horas, la última hace 15 min.' })
    expect(estadoReloj({ ...bien, ultima: '2026-10-24T13:00:00Z' }, ahora).texto).toMatch(/no corre desde hace 120 minutos/)
    expect(estadoReloj({ ...bien, fallidas: 2, con_error: 1, ultimo_error: '503 sin_configurar' }, ahora).texto).toBe(
      'En las últimas 24 horas: 2 corridas fallaron y la función contestó con error 1 vez (503 sin_configurar).',
    )
  })
})

describe('actualización 25 en la base', () => {
  let b
  beforeAll(async () => {
    b = await abrirBase()
    for (const [u, n] of [
      [ANA, 'Ana'],
      [BETO, 'Beto'],
    ])
      await b.db.query('insert into public.profiles (id, name, username) values ($1, $2, $3) on conflict do nothing', [
        u,
        n,
        n.toLowerCase() + '.v25',
      ])
  }, 60000)

  it('los códigos y los botones no se pueden leer ni escribir desde la app', async () => {
    for (const t of ['codigos_recuperacion', 'recuperacion_intentos', 'recordatorios_pospuestos', 'recordatorios_acciones'])
      expect(await fallo(b.como(ANA, () => b.filas(`select * from public.${t}`))), t).toMatch(/permission denied/)
    // Lo que carga la función (con la clave de servicio, acá como administrador)
    await b.db.query("insert into public.codigos_recuperacion (user_id, huella) values ($1, repeat('a', 64)), ($1, repeat('b', 64))", [ANA])
    await b.db.query("update public.codigos_recuperacion set usado_en = now() where huella = repeat('b', 64)")
    expect(await b.como(ANA, () => b.rpc('codigos_que_quedan', []))).toBe(1)
    expect(await b.como(BETO, () => b.rpc('codigos_que_quedan', []))).toBe(0)
    expect(await fallo(b.db.query("insert into public.codigos_recuperacion (user_id, huella) values ($1, 'corta')", [ANA]))).toMatch(
      /check/,
    )
  })

  it('el vaso de la notificación lo anota solo la función', async () => {
    expect(await fallo(b.como(ANA, () => b.rpc('anotar_vaso', [ANA, '2026-10-24'])))).toMatch(/permission denied/)
    await b.db.exec('set role service_role')
    try {
      await b.rpc('anotar_vaso', [ANA, '2026-10-24'])
    } finally {
      await b.db.exec('reset role')
    }
    const [vaso] = await b.filas('select meal, qty, kcal, date::text as fecha from public.log_entries where user_id = $1', [ANA])
    expect({ ...vaso, qty: Number(vaso.qty), kcal: Number(vaso.kcal) }).toEqual({ meal: 'extra', qty: 250, kcal: 0, fecha: '2026-10-24' })
    // Cada botón de cada aviso, una sola vez
    const accion = () =>
      b.db.query("insert into public.recordatorios_acciones (user_id, fecha, aviso, accion) values ($1, '2026-10-24', 'agua-1', 'vaso')", [
        ANA,
      ])
    await accion()
    expect(await fallo(accion())).toMatch(/duplicate key/)
  })

  it('el panel suma la vuelta semanal (8 semanas) y el reloj (sin pg_cron, null)', async () => {
    await b.db.query('insert into public.administradores (user_id) values ($1) on conflict do nothing', [ANA])
    const r = await b.como(ANA, () => b.rpc('admin_resumen', []))
    expect(r.semanas).toHaveLength(8)
    expect(r.semanas[0]).toMatchObject({ activas: 1, volvieron: 0, nuevas: 2 })
    expect(r.reloj).toBeNull()
    expect(await fallo(b.como(BETO, () => b.rpc('admin_resumen', [])))).toMatch(/Solo para administradores/)
    // Las funciones de adentro no se llaman sueltas
    expect(await fallo(b.como(ANA, () => b.rpc('vuelta_semanal', [])))).toMatch(/permission denied/)
    expect(await fallo(b.como(ANA, () => b.rpc('estado_del_reloj', [])))).toMatch(/permission denied/)
  })

  it('hogar_intentos tiene identificador, y al borrar la cuenta no queda nada', async () => {
    expect(
      await b.filas("select 1 from information_schema.columns where table_name = 'hogar_intentos' and column_name = 'id'"),
    ).toHaveLength(1)
    await b.db.query("insert into public.recordatorios_pospuestos (user_id, aviso, titulo, cuando) values ($1, 'agua-1', 'Agua', now())", [
      ANA,
    ])
    await b.db.query('delete from auth.users where id = $1', [ANA])
    for (const t of ['codigos_recuperacion', 'recordatorios_pospuestos', 'recordatorios_acciones'])
      expect(await b.filas(`select * from public.${t} where user_id = $1`, [ANA]), t).toEqual([])
  })
})

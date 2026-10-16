// Nombre de usuario (supabase/actualizacion-12.sql y src/lib/validar.js): las reglas de la app y las de la base tienen
// que ser las mismas, y la base tiene que frenar lo que se le mande directo sin pasar por la app.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, expect, test } from 'vitest'
import { USUARIOS_PROHIBIDOS_EN_MEDIO, USUARIOS_RESERVADOS, errUsuario, normalizarUsuario } from '../../src/lib/validar.js'
import { abrirBase, ANA, BETO, fallo } from './postgres.js'

let como, filas, una

beforeAll(async () => {
  ;({ como, filas, una } = await abrirBase())
}, 60000)

// ---------- La app ----------
test('app: usuarios válidos', () => {
  for (const u of ['santi', 'ana.gomez', 'beto_22', 'mi-usuario', 'Santi', '  ana  ', 'abc', 'a'.repeat(20)])
    expect(errUsuario(u), u).toBeNull()
})

test('app: usuarios que no se aceptan', () => {
  const malos = {
    '': /Elegí/,
    ab: /al menos 3/,
    [`${'a'.repeat(21)}`]: /Como mucho 20/,
    'ana gomez': /espacios/,
    'ana@gmail.com': /Solo letras/,
    ñandú: /Solo letras/,
    josé: /Solo letras/,
    '<script>': /Solo letras/,
    "a'; drop table x": /espacios/,
    'ana"x': /Solo letras/,
    '.ana': /empezar y terminar/,
    'ana-': /empezar y terminar/,
    'ana..gomez': /dos símbolos/,
    'ana_-gomez': /dos símbolos/,
    12345: /una letra/,
    'mi-sitio.com': /dirección de internet/,
    '../etc': /Solo letras/,
  }
  for (const [u, texto] of Object.entries(malos)) expect(errUsuario(u), JSON.stringify(u)).toMatch(texto)
})

test('app: palabras reservadas y nombres que se hacen pasar por la app', () => {
  for (const u of ['admin', 'ADMIN', 'Root', 'tupper', 'soporte', 'null', 'undefined', 'postgres', 'service_role', 'anon', 'authenticated'])
    expect(errUsuario(u), u).toMatch(/no está disponible/)
  for (const u of ['tupper.oficial', 'soporte_tupper', 'mi-admin', 'admin123', 'el_staff', 'moderador2', 'supabase-ok'])
    expect(errUsuario(u), u).toMatch(/no está disponible/)
  expect(errUsuario('administrativo')).toMatch(/no está disponible/) // lleva "admin" adentro: se prefiere frenar de más
})

test('app: se guarda en minúsculas y sin espacios en los bordes', () => {
  expect(normalizarUsuario('  Santi.M ')).toBe('santi.m')
  expect(normalizarUsuario(null)).toBe('')
})

// ---------- Las listas de la app y de la base tienen que ser iguales ----------
test('las palabras reservadas son las mismas en la app y en la base', () => {
  const sql = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../supabase/actualizacion-12.sql'), 'utf8')
  const lista = (nombre) =>
    [...sql.match(new RegExp(`${nombre} constant text\\[\\] := array\\[([^\\]]*)\\]`))[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
  expect(lista('reservados').sort()).toEqual([...USUARIOS_RESERVADOS].sort())
  expect(lista('prohibidos').sort()).toEqual([...USUARIOS_PROHIBIDOS_EN_MEDIO].sort())
})

// ---------- La base ----------
const poner = (id, usuario) =>
  filas(
    'insert into public.profiles (id, name, username) values ($1, $2, $3) on conflict (id) do update set username = excluded.username returning username',
    [id, 'x', usuario],
  )

test('base: guarda el usuario en minúsculas y no deja repetirlo, sin importar las mayúsculas', async () => {
  await como(ANA, async () => {
    expect(await fallo(poner(ANA, '  Ana.Gomez '))).toBeNull()
    expect((await una('select username from public.profiles where id = $1', [ANA])).username).toBe('ana.gomez')
  })
  await como(BETO, async () => {
    expect(await fallo(poner(BETO, 'ANA.GOMEZ'))).toMatch(/duplicate key|profiles_username_key/)
    expect(await fallo(poner(BETO, 'beto'))).toBeNull()
  })
})

test('base: frena lo que se le mande directo sin pasar por la app', async () => {
  await como(ANA, async () => {
    const quedaIgual = async () =>
      expect((await una('select username from public.profiles where id = $1', [ANA])).username).toBe('ana.gomez')
    const cambiar = (u) => filas('update public.profiles set username = $1 where id = $2', [u, ANA])
    expect(await fallo(cambiar('ab'))).toMatch(/al menos 3/)
    expect(await fallo(cambiar('a'.repeat(21)))).toMatch(/como mucho 20/)
    expect(await fallo(cambiar('ana gomez'))).toMatch(/solo puede llevar/)
    expect(await fallo(cambiar('ana@mail.com'))).toMatch(/solo puede llevar/)
    expect(await fallo(cambiar("x'; drop table p;--"))).toMatch(/solo puede llevar/)
    expect(await fallo(cambiar('ñandú'))).toMatch(/solo puede llevar/)
    expect(await fallo(cambiar('ana__gomez'))).toMatch(/solo puede llevar/)
    expect(await fallo(cambiar('123456'))).toMatch(/solo puede llevar/)
    expect(await fallo(cambiar('nombre.com'))).toMatch(/dirección de internet/)
    for (const u of ['admin', 'ROOT', 'tupper', 'postgres', 'service_role', 'mi.tupper', 'soporte.ayuda'])
      expect(await fallo(cambiar(u)), u).toMatch(/no está disponible/)
    await quedaIgual()
  })
})

test('base: se puede dejar sin usuario y volver a ponerlo; el vacío cuenta como sin usuario', async () => {
  await como(ANA, async () => {
    expect(await fallo(filas('update public.profiles set username = null where id = $1', [ANA]))).toBeNull()
    expect(await fallo(filas("update public.profiles set username = '   ' where id = $1", [ANA]))).toBeNull()
    expect((await una('select username from public.profiles where id = $1', [ANA])).username).toBeNull()
    expect(await fallo(filas("update public.profiles set username = 'ana.gomez' where id = $1", [ANA]))).toBeNull()
  })
})

test('base: el nombre viejo queda libre al cambiarlo', async () => {
  await como(ANA, async () => {
    expect(await fallo(filas("update public.profiles set username = 'ana.nueva' where id = $1", [ANA]))).toBeNull()
  })
  await como(BETO, async () => {
    expect(await fallo(filas("update public.profiles set username = 'ana.gomez' where id = $1", [BETO]))).toBeNull()
  })
})

test('base: usuario_disponible dice sí o no, cuenta como libre el propio y no está para quien no inició sesión', async () => {
  const libre = async (u) => (await una('select public.usuario_disponible($1) as r', [u])).r
  await como(ANA, async () => {
    expect(await libre('ana.gomez')).toBe(false) // lo tiene Beto
    expect(await libre('ANA.GOMEZ ')).toBe(false)
    expect(await libre('ana.nueva')).toBe(true) // el propio
    expect(await libre('nadie.lo.usa')).toBe(true)
  })
  await como(null, async () => {
    expect(await fallo(libre('nadie.lo.usa'))).toMatch(/permission denied/)
  })
})

test('base: una cuenta que ya tenía un nombre que hoy no se acepta no queda trabada', async () => {
  await una('alter table public.profiles disable trigger profiles_usuario_valido')
  await una("update public.profiles set username = 'soporte.vip' where id = $1", [BETO])
  await una('alter table public.profiles enable trigger profiles_usuario_valido')
  await como(BETO, async () => {
    expect(await fallo(poner(BETO, 'soporte.vip'))).toBeNull() // el upsert de la app con el mismo usuario
    expect(await fallo(filas('update public.profiles set height_cm = 170 where id = $1', [BETO]))).toBeNull()
    expect(await fallo(filas("update public.profiles set username = 'soporte.otro' where id = $1", [BETO]))).toMatch(/no está disponible/)
  })
})

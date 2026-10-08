// Un Postgres de verdad en memoria, con los mismos archivos .sql que tiene Supabase (schema, actualizaciones y datos
// base) y dos usuarios de prueba. Lo usan las pruebas que necesitan la base: base-de-datos y sin-conexion.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'

const SQL = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../supabase')
// Si agregás una actualización de la base (supabase/actualizacion-9.sql), sumala acá
const ARCHIVOS = [
  'schema.sql',
  'actualizacion-2.sql',
  'actualizacion-3.sql',
  'actualizacion-4.sql',
  'actualizacion-5.sql',
  'actualizacion-6.sql',
  'actualizacion-7.sql',
  'actualizacion-8.sql',
  'seed.sql',
]

// Lo mínimo de Supabase que usan esos archivos: los roles, los usuarios y auth.uid()
const SUPABASE = `
  create role anon nologin; create role authenticated nologin; create role service_role nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated;
  grant usage on schema public to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`

export const ANA = '00000000-0000-0000-0000-00000000000a'
export const BETO = '00000000-0000-0000-0000-00000000000b'
export const j = (x) => JSON.stringify(x)
// Para las cosas que tienen que fallar: devuelve el mensaje del error, o null si no falló
export const fallo = (promesa) =>
  promesa.then(
    () => null,
    (e) => e.message,
  )

export async function abrirBase() {
  const db = new PGlite()
  await db.exec(SUPABASE)
  for (const archivo of ARCHIVOS) await db.exec(fs.readFileSync(path.join(SQL, archivo), 'utf8'))
  await db.query('insert into auth.users (id, email) values ($1, $2), ($3, $4)', [ANA, 'ana@test.com', BETO, 'beto@test.com'])

  const filas = async (sql, params) => (await db.query(sql, params)).rows
  const una = async (sql, params) => (await filas(sql, params))[0]
  // Corre algo con la sesión de un usuario (o sin sesión, como "anon") y vuelve al rol de administrador
  async function como(usuario, fn) {
    await db.exec(`set role ${usuario ? 'authenticated' : 'anon'}`)
    await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [usuario || ''])
    try {
      return await fn()
    } finally {
      await db.exec('reset role')
      // El administrador no es ningún usuario: auth.uid() vuelve a dar null, como en el SQL Editor de Supabase
      await db.query(`select set_config('request.jwt.claim.sub', '', false)`)
    }
  }
  const rpc = async (nombre, args) => (await una(`select public.${nombre}(${args.map((_, i) => '$' + (i + 1)).join(', ')}) as r`, args)).r
  const stockDe = async (usuario) =>
    Object.fromEntries(
      (await filas('select f.slug, s.qty from public.stock s join public.foods f on f.id = s.food_id where s.user_id = $1', [usuario])).map(
        (s) => [s.slug, Number(s.qty)],
      ),
    )
  // slug -> id de los alimentos y de las recetas base
  const id = Object.fromEntries((await filas('select slug, id from public.foods where owner is null')).map((f) => [f.slug, f.id]))
  const receta = Object.fromEntries((await filas('select slug, id from public.recipes where owner is null')).map((r) => [r.slug, r.id]))
  return { db, id, receta, como, filas, una, rpc, stockDe }
}

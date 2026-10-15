// La app es solo para mayores de 18 (supabase/actualizacion-10.sql): se prueba entrando como un usuario común,
// que es quien podría hablarle a la base sin pasar por la app.
import { beforeAll, expect, test } from 'vitest'
import { abrirBase, ANA, BETO, fallo } from './postgres.js'

let como, filas, una

beforeAll(async () => {
  ;({ como, filas, una } = await abrirBase())
}, 60000)

// Una fecha que da justo `anios` años cumplidos hoy, y otra que le falta un día para cumplirlos
const haceAnios = (anios, dias = 0) => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - anios)
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}
const guardar = (id, nacimiento) =>
  filas(
    'insert into public.profiles (id, name, birth_date) values ($1, $2, $3) on conflict (id) do update set name = excluded.name, birth_date = excluded.birth_date returning *',
    [id, 'x', nacimiento],
  )

test('no entra un perfil con menos de 18 años, ni al crearlo ni al cambiarle la fecha', async () => {
  await como(ANA, async () => {
    expect(await fallo(guardar(ANA, haceAnios(17)))).toMatch(/mayores de 18/)
    expect(await fallo(guardar(ANA, haceAnios(18, 1)))).toMatch(/mayores de 18/) // le falta un día para cumplirlos
    expect(await fallo(guardar(ANA, haceAnios(18)))).toBeNull() // hoy los cumple
    expect(await fallo(filas('update public.profiles set birth_date = $1 where id = $2', [haceAnios(12), ANA]))).toMatch(/mayores de 18/)
    expect((await una('select birth_date::text as d from public.profiles where id = $1', [ANA])).d).toBe(haceAnios(18))
  })
})

test('sin fecha el perfil entra (se completa después) y una fecha adulta se puede cambiar', async () => {
  await como(BETO, async () => {
    expect(await fallo(guardar(BETO, null))).toBeNull()
    expect(await fallo(guardar(BETO, haceAnios(30)))).toBeNull()
    expect(await fallo(guardar(BETO, haceAnios(45)))).toBeNull()
  })
})

test('una cuenta que ya tenía menos de 18 no pierde nada ni queda trabada para editar el resto', async () => {
  // Como si existiera de antes de la regla: se carga con el trigger apagado
  await una('alter table public.profiles disable trigger profiles_mayor_de_edad')
  await una('delete from public.profiles where id = $1', [BETO])
  await guardar(BETO, haceAnios(16))
  await una('alter table public.profiles enable trigger profiles_mayor_de_edad')
  await como(BETO, async () => {
    // Guardar el perfil con la misma fecha (el upsert de la app) y cambiar otros datos anda
    expect(await fallo(guardar(BETO, haceAnios(16)))).toBeNull()
    expect(await fallo(filas('update public.profiles set height_cm = 170 where id = $1', [BETO]))).toBeNull()
    // Pero no puede poner otra fecha de menos de 18
    expect(await fallo(guardar(BETO, haceAnios(15)))).toMatch(/mayores de 18/)
    expect((await una('select birth_date::text as d from public.profiles where id = $1', [BETO])).d).toBe(haceAnios(16))
  })
})

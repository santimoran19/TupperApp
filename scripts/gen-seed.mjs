// Genera supabase/seed.sql (toda la base) y supabase/seed-5.sql (solo la quinta tanda) a partir de seed-data.mjs, y
// supabase/seed-6.sql (actividades físicas, de ejercicio-data.mjs) y supabase/seed-7.sql (ejercicios de gimnasio, de gym-data.mjs):
//   node scripts/gen-seed.mjs
// seed.sql sirve para armar la base desde cero; seed-5.sql, para sumar la última tanda a una base que ya tiene
// las anteriores. Todos se pueden ejecutar de nuevo: agregan solo lo que falta (seed-6 y seed-7 además ponen al día los
// valores de lo que ya estaba, por si se corrige algún MET).
import { foods, recipes, conAlcohol, alimentosQuinta, recetasQuinta } from './seed-data.mjs'
import { actividades } from './ejercicio-data.mjs'
import { ejercicios, GRUPOS, EQUIPOS } from './gym-data.mjs'
import { alimentosSexta, recetasSexta, foodsTodos } from './seed-sexta.mjs'
import { writeFileSync } from 'node:fs'
const q = (v) => (v === null || v === undefined ? 'null' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`)
function generar(alimentos, recetas, titulo) {
  let sql = `-- ${titulo}. Generado con scripts/gen-seed.mjs\n\n`
  if (alimentos.length) {
    sql += 'insert into public.foods (slug, name, unit, unit_grams, unit_label, kcal, protein, carbs, fat, category, alcohol) values\n'
    sql +=
      alimentos.map((f) => `  (${f.map(q).join(', ')}, ${conAlcohol.includes(f[0])})`).join(',\n') + '\non conflict (slug) do nothing;\n\n'
  }
  sql += 'insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values\n'
  sql += recetas
    .map((r) => `  (${q(r.slug)}, ${q(r.name)}, ${r.minutes}, ${r.servings}, '{${r.meal_types.join(',')}}', ${r.portable}, ${q(r.steps)})`)
    .join(',\n')
  sql += '\non conflict (slug) do nothing;\n\n'
  sql += 'insert into public.recipe_items (recipe_id, food_id, qty)\nselect r.id, f.id, v.qty from (values\n'
  sql += recetas.flatMap((r) => r.items.map(([slug, qty]) => `  (${q(r.slug)}, ${q(slug)}, ${qty})`)).join(',\n')
  sql +=
    '\n) as v(recipe_slug, food_slug, qty)\njoin public.recipes r on r.slug = v.recipe_slug\njoin public.foods f on f.slug = v.food_slug\non conflict do nothing;\n'
  return sql
}
// chequeo: todos los ingredientes existen
const slugs = new Set(foods.map((f) => f[0]))
if (slugs.size !== foods.length) throw new Error('hay alimentos repetidos')
if (new Set(recipes.map((r) => r.slug)).size !== recipes.length) throw new Error('hay recetas repetidas')
for (const r of recipes) for (const [s] of r.items) if (!slugs.has(s)) throw new Error('falta alimento ' + s)
for (const s of conAlcohol) if (!slugs.has(s)) throw new Error('falta la bebida ' + s)

writeFileSync(
  new URL('../supabase/seed.sql', import.meta.url),
  generar(foods, recipes, 'Datos base de Tupper (alimentos y recetas comunes)'),
)
writeFileSync(
  new URL('../supabase/seed-5.sql', import.meta.url),
  generar(
    alimentosQuinta,
    recetasQuinta,
    'Quinta tanda de la base (F-12): solo lo nuevo, para una base que ya tiene la anterior. Ejecutarlo de nuevo no duplica nada',
  ),
)
// ---------- Actividades físicas (supabase/actualizacion-16.sql) ----------
if (new Set(actividades.map((a) => a[0])).size !== actividades.length) throw new Error('hay actividades repetidas')
for (const [slug, , , metrica, suave, medio, fuerte] of actividades)
  if (!(suave >= 1 && suave <= medio && medio <= fuerte && fuerte <= 20) || !['correr', 'caminar', 'bici', 'general'].includes(metrica))
    throw new Error('actividad con valores raros: ' + slug)
let ejercicio =
  '-- Catálogo de actividades físicas (F-19, fase 2). Va después de supabase/actualizacion-16.sql. Generado con scripts/gen-seed.mjs\n'
ejercicio +=
  '-- Los METs son del Compendio de Actividades Físicas 2024 (Herrmann et al.). Se puede correr de nuevo: pone al día lo que ya estaba.\n\n'
ejercicio +=
  'insert into public.exercise_types (slug, name, category, metrica, mets_suave, mets_medio, mets_fuerte, usa_distancia, usa_desnivel) values\n'
ejercicio += actividades.map((a) => `  (${a.map((v) => (typeof v === 'boolean' ? String(v) : q(v))).join(', ')})`).join(',\n')
ejercicio +=
  '\non conflict (slug) do update set name = excluded.name, category = excluded.category, metrica = excluded.metrica,\n  mets_suave = excluded.mets_suave, mets_medio = excluded.mets_medio, mets_fuerte = excluded.mets_fuerte,\n  usa_distancia = excluded.usa_distancia, usa_desnivel = excluded.usa_desnivel;\n'
writeFileSync(new URL('../supabase/seed-6.sql', import.meta.url), ejercicio)
console.log('ok', actividades.length, 'actividades físicas')

// ---------- Ejercicios de gimnasio (supabase/actualizacion-17.sql) ----------
if (new Set(ejercicios.map((e) => e[0])).size !== ejercicios.length) throw new Error('hay ejercicios repetidos')
const grupos = new Set(GRUPOS.map((g) => g[0]))
const equipos = new Set(EQUIPOS.map((g) => g[0]))
for (const [slug, , grupo, equipo] of ejercicios)
  if (!grupos.has(grupo) || !equipos.has(equipo)) throw new Error('ejercicio con grupo o equipo raro: ' + slug)
let gym =
  '-- Catálogo de ejercicios de gimnasio (F-19, fase 3). Va después de supabase/actualizacion-17.sql. Generado con scripts/gen-seed.mjs\n'
gym += '-- Se puede correr de nuevo: pone al día lo que ya estaba.\n\n'
gym += 'insert into public.gym_exercises (slug, name, grupo, equipo, peso_corporal) values\n'
gym += ejercicios.map((e) => `  (${e.map((v) => (typeof v === 'boolean' ? String(v) : q(v))).join(', ')})`).join(',\n')
gym +=
  '\non conflict (slug) do update set name = excluded.name, grupo = excluded.grupo, equipo = excluded.equipo, peso_corporal = excluded.peso_corporal;\n'
writeFileSync(new URL('../supabase/seed-7.sql', import.meta.url), gym)
console.log('ok', ejercicios.length, 'ejercicios de gimnasio')

// ---------- Sexta tanda (1.25): alimentos y recetas, en archivos chicos para pegarlos en el SQL Editor ----------
// supabase/seed-8-alimentos.sql primero; después supabase/seed-8-recetas-1.sql, -2.sql, etc. (cada uno se puede correr más de
// una vez: agrega solo lo que falta). La base de arranque (seed.sql) no los incluye.
const TANDA = 200
const todos = new Set(foodsTodos.map((f) => f[0]))
if (todos.size !== foodsTodos.length) throw new Error('hay alimentos repetidos en la sexta tanda')
const recetasPrevias = new Set(recipes.map((r) => r.slug))
for (const r of recetasSexta) {
  if (recetasPrevias.has(r.slug)) throw new Error('receta repetida: ' + r.slug)
  recetasPrevias.add(r.slug)
  for (const [slug] of r.items) if (!todos.has(slug)) throw new Error('falta alimento ' + slug)
}
let sexta =
  '-- Sexta tanda de la base (1.25): alimentos nuevos. Va primero. Generado con scripts/gen-seed.mjs. Se puede correr de nuevo: agrega solo lo que falta.\n\n'
sexta += 'insert into public.foods (slug, name, unit, unit_grams, unit_label, kcal, protein, carbs, fat, category, alcohol) values\n'
sexta +=
  alimentosSexta.map((f) => `  (${f.map(q).join(', ')}, ${conAlcohol.includes(f[0])})`).join(',\n') + '\non conflict (slug) do nothing;\n'
writeFileSync(new URL('../supabase/seed-8-alimentos.sql', import.meta.url), sexta)
const tandas = Math.ceil(recetasSexta.length / TANDA)
for (let i = 0; i < tandas; i++) {
  const parte = recetasSexta.slice(i * TANDA, (i + 1) * TANDA)
  writeFileSync(
    new URL(`../supabase/seed-8-recetas-${i + 1}.sql`, import.meta.url),
    generar(
      [],
      parte,
      `Sexta tanda de la base (1.25): recetas, parte ${i + 1} de ${tandas}. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta`,
    ),
  )
}
console.log('ok sexta tanda:', alimentosSexta.length, 'alimentos y', recetasSexta.length, 'recetas en', tandas, 'archivos')

// los ingredientes de la última tanda tienen que estar en la base completa (pueden ser de tandas anteriores)
console.log(
  'ok',
  foods.length,
  'alimentos,',
  recipes.length,
  'recetas;',
  alimentosQuinta.length,
  'alimentos y',
  recetasQuinta.length,
  'recetas nuevas',
)

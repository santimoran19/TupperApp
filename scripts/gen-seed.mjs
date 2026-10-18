// Genera supabase/seed.sql (toda la base) y supabase/seed-5.sql (solo la quinta tanda) a partir de seed-data.mjs:
//   node scripts/gen-seed.mjs
// seed.sql sirve para armar la base desde cero; seed-5.sql, para sumar la última tanda a una base que ya tiene
// las anteriores. Los dos se pueden ejecutar de nuevo: agregan solo lo que falta.
import { foods, recipes, conAlcohol, alimentosQuinta, recetasQuinta } from './seed-data.mjs'
import { writeFileSync } from 'node:fs'
const q = (v) => (v === null || v === undefined ? 'null' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`)
function generar(alimentos, recetas, titulo) {
  let sql = `-- ${titulo}. Generado con scripts/gen-seed.mjs\n\n`
  sql += 'insert into public.foods (slug, name, unit, unit_grams, unit_label, kcal, protein, carbs, fat, category, alcohol) values\n'
  sql +=
    alimentos.map((f) => `  (${f.map(q).join(', ')}, ${conAlcohol.includes(f[0])})`).join(',\n') + '\non conflict (slug) do nothing;\n\n'
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

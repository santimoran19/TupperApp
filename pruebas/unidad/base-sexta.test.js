// La sexta tanda de la base (1.25): más de mil recetas y 227 alimentos nuevos, armados por scripts/seed-sexta.mjs.
// Se chequea que los datos sean coherentes (ingredientes que existen, calorías y proteína razonables, nombres y slugs únicos,
// largos que la base acepta) y que los archivos supabase/seed-8-*.sql se puedan correr dos veces sin duplicar nada.
import { describe, expect, test } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { conAlcohol, foods, recipes } from '../../scripts/seed-data.mjs'
import { alimentosSexta, foodsTodos, recetasSexta, recipesTodas } from '../../scripts/seed-sexta.mjs'
import { conFamilia, sugerirBase } from '../../src/lib/equivalencias.js'
import { CATEGORIAS, COMIDAS, macrosDe } from '../../src/lib/nutricion.js'
import { LIM } from '../../src/lib/validar.js'

const normal = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const aAlimento = (f) => ({
  id: 'id-' + f[0],
  slug: f[0],
  name: f[1],
  unit: f[2],
  unit_grams: f[3],
  unit_label: f[4],
  kcal: f[5],
  protein: f[6],
  carbs: f[7],
  fat: f[8],
  category: f[9],
  alcohol: conAlcohol.includes(f[0]),
  owner: null,
  same_as: null,
})
const porSlug = new Map(foodsTodos.map((f) => [f[0], f]))
const RANGO = { desayuno: [120, 800], merienda: [60, 700], almuerzo: [140, 1000], cena: [140, 1000] }

describe('alimentos de la sexta tanda', () => {
  test('hay 227 nuevos y no se repiten slugs ni nombres con los anteriores', () => {
    expect(alimentosSexta).toHaveLength(227)
    expect(new Set(foodsTodos.map((f) => f[0])).size).toBe(foodsTodos.length)
    expect(new Set(foodsTodos.map((f) => normal(f[1]))).size).toBe(foodsTodos.length)
    expect(foodsTodos).toHaveLength(foods.length + 227)
  })

  test('cada alimento tiene los campos completos, categoría válida y valores posibles', () => {
    for (const f of alimentosSexta) {
      const [slug, name, unit, gu, etiqueta, kcal, p, c, g, cat] = f
      expect(slug, slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(name.length, slug).toBeGreaterThan(0)
      expect(name.length, slug).toBeLessThanOrEqual(80)
      expect(['g', 'ml', 'u'], slug).toContain(unit)
      if (unit === 'u') {
        expect(gu, slug).toBeGreaterThan(0)
        expect(etiqueta?.length, slug).toBeGreaterThan(0)
      }
      expect(CATEGORIAS, slug).toContain(cat)
      for (const v of [kcal, p, c, g]) expect(v, slug).toBeGreaterThanOrEqual(0)
      expect(kcal, slug).toBeLessThanOrEqual(900)
      // Los macros no pueden pesar más que 100 g, y las calorías tienen que ser parecidas a 4/4/9 (las tablas redondean)
      expect(p + c + g, slug).toBeLessThanOrEqual(101)
      // el salvado, el polvo de hornear y la levadura no cierran con 4/4/9 (fibra, sales)
      if (cat !== 'Bebidas' && !/^(salvado-|polvo-hornear|levadura)/.test(slug))
        expect(Math.abs(kcal - (4 * p + 4 * c + 9 * g)), `${slug}: ${kcal} vs ${4 * p + 4 * c + 9 * g}`).toBeLessThanOrEqual(
          Math.max(40, kcal * 0.4),
        )
    }
  })
})

describe('recetas de la sexta tanda', () => {
  test('son más de mil, y no pisan las de antes', () => {
    expect(recetasSexta.length).toBeGreaterThanOrEqual(1000)
    expect(recipesTodas).toHaveLength(recipes.length + recetasSexta.length)
    expect(new Set(recipesTodas.map((r) => r.slug)).size).toBe(recipesTodas.length)
    expect(new Set(recipesTodas.map((r) => normal(r.name))).size).toBe(recipesTodas.length)
  })

  test('cada una está completa, con largos que la base acepta y ingredientes que existen', () => {
    for (const r of recetasSexta) {
      expect(r.name.length, r.slug).toBeLessThanOrEqual(80)
      expect(r.slug.length, r.slug).toBeLessThanOrEqual(60)
      expect(r.slug, r.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(r.minutes, r.slug).toBeGreaterThanOrEqual(LIM.minutos[0])
      expect(r.minutes, r.slug).toBeLessThanOrEqual(LIM.minutos[1])
      expect(r.servings, r.slug).toBeGreaterThanOrEqual(LIM.rinde[0])
      expect(r.servings, r.slug).toBeLessThanOrEqual(LIM.rinde[1])
      expect(typeof r.portable, r.slug).toBe('boolean')
      expect(r.meal_types.length, r.slug).toBeGreaterThan(0)
      for (const t of r.meal_types) expect(COMIDAS, r.slug).toContain(t)
      expect(r.steps.length, r.slug).toBeLessThanOrEqual(5000)
      expect(r.steps.split('\n').length, r.slug).toBeGreaterThanOrEqual(2)
      expect(r.items.length, r.slug).toBeGreaterThanOrEqual(1)
      const usados = r.items.map((i) => i[0])
      expect(new Set(usados).size, `${r.slug}: ingrediente repetido`).toBe(usados.length)
      for (const [slug, qty] of r.items) {
        const f = porSlug.get(slug)
        expect(f, `${r.slug} usa ${slug}`).toBeTruthy()
        expect(qty, `${r.slug}/${slug}`).toBeGreaterThan(0)
        if (f[2] === 'u') expect(qty * 2, `${r.slug}/${slug}`).toBe(Math.round(qty * 2))
      }
    }
  })

  test('nada de textos rotos en los nombres ni en los pasos', () => {
    for (const r of recetasSexta) {
      const t = r.name + '\n' + r.steps
      expect(t, r.slug).not.toMatch(/undefined|null|NaN|\[object|\{|\}/)
      expect(t, r.slug).not.toMatch(/ {2,}| ,|,,|\.\./)
      expect(r.name, r.slug).toMatch(/^[A-ZÁÉÍÓÚÑ]/)
    }
  })

  test('las calorías por porción son razonables para cada comida', () => {
    const fuera = []
    for (const r of recetasSexta) {
      let kcal = 0
      for (const [slug, qty] of r.items) {
        const m = macrosDe(aAlimento(porSlug.get(slug)), qty)
        kcal += m.kcal
      }
      const porcion = kcal / r.servings
      for (const t of r.meal_types) {
        const [min, max] = RANGO[t]
        if (porcion < min || porcion > max) fuera.push(`${r.slug} (${t}): ${Math.round(porcion)} kcal por porción`)
      }
    }
    expect(fuera).toEqual([])
  })

  test('hay para cada momento del día y de cada tipo', () => {
    for (const t of COMIDAS) expect(recetasSexta.filter((r) => r.meal_types.includes(t)).length, t).toBeGreaterThanOrEqual(150)
    for (const palabra of [
      'Ensalada',
      'Fideos',
      'Sopa',
      'Crema',
      'Guiso',
      'Tarta',
      'Bowl',
      'Hamburguesa',
      'Milanesa',
      'Licuado',
      'Empanadas',
      'Tostadas',
      'Avena',
      'Wok',
      'Sándwich',
      'Tortilla',
    ]) {
      expect(recetasSexta.filter((r) => r.name.includes(palabra)).length, palabra).toBeGreaterThanOrEqual(5)
    }
  })

  test('el voseo es correcto y no quedan tuteos', () => {
    for (const r of recetasSexta)
      expect(r.steps, r.slug).not.toMatch(/(?<![a-záéíóúñ])(Añade|Mezcla|Corta|Pon|Cocina|Hornea|Sirve|Agrega)(?![a-záéíóúñ])/)
  })
})

describe('productos de góndola contra la base grande', () => {
  // Con más variedades de arroz, fideos y leche entre los ingredientes, el producto de góndola tiene que seguir proponiendo el genérico
  const todos = conFamilia(foodsTodos.map(aAlimento))
  const usados = new Set(recipesTodas.flatMap((r) => r.items.map((i) => i[0])))
  const candidatos = todos.filter((a) => usados.has(a.slug))
  const producto = (name, base) => ({
    ...todos.find((a) => a.slug === base),
    id: 'producto-' + name,
    slug: null,
    name,
    owner: 'yo',
    same_as: null,
  })
  test.each([
    ['Arroz Gallo Oro', 'arroz'],
    ['Fideos Matarazzo Tirabuzón', 'fideos'],
    ['Leche La Serenísima Entera', 'leche'],
    ['Aceite Cocinero', 'aceite'],
  ])('%s vale por %s', (nombre, esperado) => {
    expect(sugerirBase(producto(nombre, esperado), candidatos, todos)?.slug).toBe(esperado)
  })
})

describe('seed-8-*.sql', () => {
  const SQL = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../supabase')
  test('suma lo nuevo a una base con la tanda anterior, sin duplicar si se corre de nuevo', async () => {
    const db = new PGlite()
    await db.exec(`create role anon nologin; create role authenticated nologin; create role service_role nologin;
      create schema auth; create table auth.users (id uuid primary key default gen_random_uuid(), email text);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to anon, authenticated; grant usage on schema public to anon, authenticated;
      alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
      alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
      alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;`)
    for (const archivo of ['schema.sql', ...Array.from({ length: 12 }, (_, i) => `actualizacion-${i + 2}.sql`)])
      await db.exec(fs.readFileSync(path.join(SQL, archivo), 'utf8'))
    await db.exec(fs.readFileSync(path.join(SQL, 'seed.sql'), 'utf8'))
    const cuenta = async () =>
      (
        await db.query(
          `select (select count(*) from public.foods)::int as alimentos, (select count(*) from public.recipes)::int as recetas, (select count(*) from public.recipe_items)::int as items`,
        )
      ).rows[0]
    const antes = await cuenta()
    expect(antes).toMatchObject({ alimentos: foods.length, recetas: recipes.length })
    const archivos = fs.readdirSync(SQL).filter((f) => /^seed-8-/.test(f))
    const orden = [
      'seed-8-alimentos.sql',
      ...archivos
        .filter((f) => f !== 'seed-8-alimentos.sql')
        .sort((a, b) => parseInt(a.match(/(\d+)\.sql/)[1]) - parseInt(b.match(/(\d+)\.sql/)[1])),
    ]
    expect(orden[0]).toBe('seed-8-alimentos.sql')
    for (const f of orden) await db.exec(fs.readFileSync(path.join(SQL, f), 'utf8'))
    const itemsNuevos = recetasSexta.reduce((t, r) => t + r.items.length, 0)
    const despues = await cuenta()
    expect(despues.alimentos).toBe(foods.length + alimentosSexta.length)
    expect(despues.recetas).toBe(recipes.length + recetasSexta.length)
    expect(despues.items).toBe(antes.items + itemsNuevos)
    // Correrlos otra vez no cambia nada
    for (const f of orden) await db.exec(fs.readFileSync(path.join(SQL, f), 'utf8'))
    expect(await cuenta()).toEqual(despues)
    await db.close()
  }, 240000)
})

// La base de alimentos y recetas después de la quinta tanda (F-12): que los datos sean coherentes
// y que sumar alimentos nuevos no cambie lo que la app ya hacía con los anteriores.
import { describe, expect, test } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'
import { alimentosQuinta, conAlcohol, foods, recetasQuinta, recipes } from '../../scripts/seed-data.mjs'
import { foodsTodos } from '../../scripts/seed-sexta.mjs'
import { ALIAS, FAMILIA } from '../../src/lib/alias.js'
import { buscarAlimentos } from '../../src/lib/buscar.js'
import { conFamilia, itemsEnBase, sugerirBase } from '../../src/lib/equivalencias.js'
import { CATEGORIAS, COMIDAS, grupoDe, macrosDe, medidasDe } from '../../src/lib/nutricion.js'
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
const COMIDAS_VALIDAS = [...COMIDAS]
const nuevosSlugs = new Set(alimentosQuinta.map((f) => f[0]))
const anteriores = foods.filter((f) => !nuevosSlugs.has(f[0]))
const recetasAnteriores = recipes.slice(0, recipes.length - recetasQuinta.length)

describe('alimentos de la base', () => {
  test('la quinta tanda suma 116 alimentos y 44 recetas a los 274 y 88 que ya había', () => {
    expect(anteriores).toHaveLength(274)
    expect(recetasAnteriores).toHaveLength(88)
    expect(alimentosQuinta).toHaveLength(116)
    expect(recetasQuinta).toHaveLength(44)
  })

  test('slugs y nombres no se repiten, y los slugs tienen formato de slug', () => {
    expect(new Set(foods.map((f) => f[0])).size).toBe(foods.length)
    expect(new Set(foods.map((f) => normal(f[1]))).size).toBe(foods.length)
    for (const f of foods) expect(f[0]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  test('cada alimento cumple lo mismo que pide el formulario y la base', () => {
    for (const [slug, name, unit, gramos, etiqueta, kcal, prot, carb, grasa, categoria] of foods) {
      const donde = `${slug}`
      expect(name.length, donde).toBeGreaterThan(0)
      expect(name.length, donde).toBeLessThanOrEqual(LIM.nombre)
      expect(['g', 'ml', 'u'], donde).toContain(unit)
      if (unit === 'u') {
        expect(gramos, donde).toBeGreaterThanOrEqual(LIM.gramosUnidad[0])
        expect(gramos, donde).toBeLessThanOrEqual(LIM.gramosUnidad[1])
        expect(etiqueta?.length, donde).toBeGreaterThan(0)
        expect(etiqueta.length, donde).toBeLessThanOrEqual(20)
      } else {
        expect(gramos, donde).toBeNull()
        expect(etiqueta, donde).toBeNull()
      }
      expect(CATEGORIAS, donde).toContain(categoria)
      expect(kcal, donde).toBeGreaterThanOrEqual(LIM.kcal100[0])
      expect(kcal, donde).toBeLessThanOrEqual(LIM.kcal100[1])
      for (const m of [prot, carb, grasa]) {
        expect(m, donde).toBeGreaterThanOrEqual(0)
        expect(m, donde).toBeLessThanOrEqual(100)
      }
      // 100 g no pueden tener más de 100 g entre proteína, carbohidratos y grasa
      expect(prot + carb + grasa, donde).toBeLessThanOrEqual(100.5)
      // Y la proteína no puede aportar más calorías que las que tiene el alimento (es lo que controla el formulario)
      expect(prot * 4, donde).toBeLessThanOrEqual(kcal + 10)
    }
  })

  // Las calorías tienen que cerrar con los macros (4 por gramo de proteína y de carbohidratos, 9 por gramo de grasa).
  // La fibra baja un poco el número, así que se deja margen; el alcohol (7 por gramo) no entra en la cuenta.
  const HEREDADOS = ['limon', 'aceto'] // valores de antes de esta tanda, que no se tocan
  const CON_MUCHA_FIBRA = ['cacao-amargo'] // el cacao amargo tiene un tercio de fibra: 228 kcal es el dato de la tabla
  test('las calorías de cada alimento cierran con sus macros', () => {
    const mal = []
    for (const [slug, , , , , kcal, prot, carb, grasa] of foods) {
      if (conAlcohol.includes(slug) || HEREDADOS.includes(slug) || CON_MUCHA_FIBRA.includes(slug)) continue
      const cuenta = prot * 4 + carb * 4 + grasa * 9
      const bien = cuenta < 40 ? Math.abs(kcal - cuenta) <= 15 : kcal >= 0.75 * cuenta && kcal <= 1.15 * cuenta
      if (!bien) mal.push(`${slug}: ${kcal} kcal contra ${Math.round(cuenta)} de la cuenta`)
    }
    expect(mal).toEqual([])
  })

  test('las bebidas se miden en ml y lo líquido no se mide en gramos por error', () => {
    for (const f of foods.filter((x) => x[9] === 'Bebidas')) expect(f[2], f[0]).toBe('ml')
    // Los lácteos y salsas líquidos de esta tanda también
    for (const slug of ['kefir', 'salsa-teriyaki', 'leche-coco', 'edulcorante'])
      expect(foods.find((f) => f[0] === slug)[2], slug).toBe('ml')
  })

  test('hay ejemplos de cada cosa que se sumó: cocidos, semillas, quesos y bebidas nuevas', () => {
    const por = (cat) => alimentosQuinta.filter((f) => f[9] === cat).length
    expect(por('Carnes y huevos')).toBeGreaterThanOrEqual(10)
    expect(por('Pescados')).toBeGreaterThanOrEqual(5)
    expect(por('Lácteos')).toBeGreaterThanOrEqual(7)
    expect(por('Comidas hechas')).toBeGreaterThanOrEqual(10)
    expect(por('Bebidas')).toBeGreaterThanOrEqual(5)
  })

  test('los valores más conocidos coinciden con la tabla de referencia', () => {
    const v = (slug) => foods.find((f) => f[0] === slug)
    // [kcal, prot, carbs, grasa] cada 100 g
    expect(v('arroz-hervido').slice(5, 9)).toEqual([130, 2.7, 28, 0.3])
    expect(v('fideos-hervidos').slice(5, 9)).toEqual([158, 5.8, 31, 0.9])
    expect(v('clara-huevo').slice(2, 9)).toEqual(['u', 33, 'clara', 52, 11, 0.7, 0.2])
    expect(v('salmon').slice(5, 9)).toEqual([205, 20, 0, 13.5])
  })
})

describe('recetas de la base', () => {
  const porSlug = new Map(foods.map((f) => [f[0], f]))
  const RANGO = { desayuno: [150, 750], merienda: [100, 650], almuerzo: [250, 1100], cena: [250, 1100] }

  test('los slugs de recetas no se repiten', () => {
    expect(new Set(recipes.map((r) => r.slug)).size).toBe(recipes.length)
  })

  test('cada receta nueva está completa y sus ingredientes existen', () => {
    for (const r of recetasQuinta) {
      expect(r.name.length, r.slug).toBeGreaterThan(0)
      expect(r.name.length, r.slug).toBeLessThanOrEqual(80)
      expect(r.minutes, r.slug).toBeGreaterThanOrEqual(LIM.minutos[0])
      expect(r.minutes, r.slug).toBeLessThanOrEqual(LIM.minutos[1])
      expect(r.servings, r.slug).toBeGreaterThanOrEqual(LIM.rinde[0])
      expect(r.servings, r.slug).toBeLessThanOrEqual(LIM.rinde[1])
      expect(typeof r.portable, r.slug).toBe('boolean')
      expect(r.meal_types.length, r.slug).toBeGreaterThan(0)
      for (const t of r.meal_types) expect(COMIDAS_VALIDAS, r.slug).toContain(t)
      expect(r.steps.trim().split('\n').length, r.slug).toBeGreaterThanOrEqual(1)
      expect(r.items.length, r.slug).toBeGreaterThanOrEqual(2)
      const usados = r.items.map((i) => i[0])
      expect(new Set(usados).size, `${r.slug}: ingrediente repetido`).toBe(usados.length)
      for (const [slug, qty] of r.items) {
        const f = porSlug.get(slug)
        expect(f, `${r.slug} usa ${slug}`).toBeTruthy()
        expect(qty, `${r.slug}/${slug}`).toBeGreaterThan(0)
        // Las unidades se cuentan de a medias como mucho y no pasan de 20 (12 empanadas es lo más alto)
        if (f[2] === 'u') {
          expect(qty * 2, `${r.slug}/${slug}`).toBe(Math.round(qty * 2))
          expect(qty, `${r.slug}/${slug}`).toBeLessThanOrEqual(20)
        }
      }
    }
  })

  test('las calorías por porción son razonables para el tipo de comida', () => {
    const fuera = []
    for (const r of recetasQuinta) {
      let kcal = 0
      for (const [slug, qty] of r.items) kcal += macrosDe(aAlimento(porSlug.get(slug)), qty).kcal
      const porcion = kcal / r.servings
      for (const t of r.meal_types) {
        const [min, max] = RANGO[t]
        if (porcion < min || porcion > max) fuera.push(`${r.slug} (${t}): ${Math.round(porcion)} kcal por porción`)
      }
    }
    expect(fuera).toEqual([])
  })

  test('cada comida tiene recetas para elegir', () => {
    for (const t of COMIDAS) expect(recipes.filter((r) => r.meal_types.includes(t)).length, t).toBeGreaterThanOrEqual(15)
    // De las nuevas, hay para cada momento del día
    for (const t of COMIDAS) expect(recetasQuinta.filter((r) => r.meal_types.includes(t)).length, t).toBeGreaterThanOrEqual(3)
  })
})

describe('búsqueda, familias y medidas', () => {
  const base = conFamilia(foods.map(aAlimento))
  // La base completa, con la sexta tanda (1.25): hay familias de arroz que apuntan a alimentos nuevos
  const slugs = new Set(foodsTodos.map((f) => f[0]))

  test('los alias, las familias y las medidas rápidas apuntan a alimentos que existen', () => {
    for (const s of Object.keys(ALIAS)) expect(slugs.has(s), 'alias de ' + s).toBe(true)
    for (const [de, a] of Object.entries(FAMILIA)) {
      expect(slugs.has(de), 'familia ' + de).toBe(true)
      expect(slugs.has(a), 'familia ' + a).toBe(true)
      // Una familia no se encadena: el destino no puede valer por otro
      expect(FAMILIA[a], `${de} -> ${a} -> ${FAMILIA[a]}`).toBeUndefined()
    }
    for (const f of foods) {
      const g = grupoDe({ slug: f[0] })
      if (g) expect(medidasDe({ slug: f[0], unit: f[2] }).length, f[0]).toBeGreaterThan(0)
    }
  })

  test('los alias nuevos van en minúscula, sin tildes y sin repetir los de otro alimento', () => {
    const dueno = new Map()
    for (const [slug, lista] of Object.entries(ALIAS)) for (const a of lista) if (!nuevosSlugs.has(slug)) dueno.set(a, slug)
    for (const slug of Object.keys(ALIAS).filter((s) => nuevosSlugs.has(s))) {
      for (const a of ALIAS[slug]) {
        expect(a, slug).toBe(normal(a).trim())
        // Un alias que ya tiene otro alimento haría que una búsqueda devuelva el equivocado
        expect(dueno.get(a) ?? slug, `${a}: ${dueno.get(a)} y ${slug}`).toBe(slug)
        dueno.set(a, slug)
      }
    }
  })

  test('el buscador encuentra los alimentos nuevos por el nombre con que la gente los pide', () => {
    const q = (texto) => buscarAlimentos(base, texto).map((a) => a.slug)
    expect(q('bacon')).toContain('panceta')
    expect(q('rabas')).toContain('calamar')
    expect(q('porotos cocidos')).toContain('porotos-hervidos')
    expect(q('arroz cocido')).toContain('arroz-hervido')
    expect(q('fideos cocidos')).toContain('fideos-hervidos')
    expect(q('cuadril')).toContain('peceto')
    expect(q('camarones')).toContain('langostinos')
    expect(q('stevia')).toContain('edulcorante')
    expect(q('pepitas')).toContain('semillas-zapallo')
    expect(q('provoleta')).toContain('provoleta')
    expect(q('lasagna')).toContain('lasana')
    expect(q('humus')).toContain('hummus')
    expect(q('panqueque')).toContain('panqueque-dl')
    expect(q('claras')).toContain('clara-huevo')
  })

  test('lo que vale por otro en las recetas se arma bien: la ricota light cubre una receta que pide ricota', () => {
    const porId = new Map(base.map((a) => [a.id, a]))
    const items = itemsEnBase([{ food_id: 'id-ricota-light', qty: 100 }], porId)
    expect(items).toEqual([{ food_id: 'id-ricota', qty: 100 }])
    const peceto = itemsEnBase([{ food_id: 'id-peceto', qty: 180 }], porId)
    expect(peceto[0].food_id).toBe('id-bife-nalga')
  })

  // Sumar alimentos y recetas cambia qué ingredientes hay para proponer "cuenta como...". Lo que se proponía antes
  // para un producto tiene que seguir igual: solo puede aparecer algo donde antes no había nada.
  test('las sugerencias de "cuenta como" no cambian para los productos de siempre', () => {
    const ingredientesDe = (alimentos, recetas) => {
      const lista = conFamilia(alimentos.map(aAlimento))
      const porId = new Map(lista.map((a) => [a.id, a]))
      const ids = new Set(
        recetas.flatMap((r) =>
          itemsEnBase(
            r.items.map(([slug, qty]) => ({ food_id: 'id-' + slug, qty })),
            porId,
          ).map((i) => i.food_id),
        ),
      )
      return { lista, ingredientes: [...ids].map((id) => porId.get(id)).filter((a) => !a.same_as) }
    }
    const antes = ingredientesDe(anteriores, recetasAnteriores)
    const ahora = ingredientesDe(foods, recipes)
    const productos = [
      ['Aceite de girasol (Natura)', 'ml'],
      ['Caldo (Maggi)', 'g'],
      ['Jardinera', 'g'],
      ['Lentejas (Inalpa)', 'g'],
      ['Lentejas Marolio', 'g'],
      ['Presto Pronta (Arcor)', 'g'],
      ['Salsa Lista Pomarola (Arcor)', 'g'],
      ['Spaghetti', 'g'],
      ['Tirabuzón №28 (Matarazzo)', 'g'],
      ['Traviata x3 (Bagley)', 'g'],
      ['Leche descremada La Serenísima', 'ml'],
      ['Leche Ilolay', 'ml'],
      ['Leche entera Sancor', 'ml'],
      ['Yogur La Serenísima firme', 'g'],
      ['Yogur Ilolay natural', 'g'],
      ['Arroz Gallo Oro', 'g'],
      ['Arroz Dos Hermanos', 'g'],
      ['Pechuga Granja del Sol', 'g'],
      ['Carne picada Swift', 'g'],
      ['Bife de nalga Paty', 'g'],
      ['Jugo Cepita multifruta', 'ml'],
      ['Dulce de leche Havanna', 'g'],
      ['Chocolate Aguila', 'g'],
      ['Chocolate Cofler', 'g'],
      ['Proteína de soja', 'g'],
      ['Harina de maíz Pureza', 'g'],
      ['Queso cremoso La Paulina', 'g'],
      ['Tomate perita Arcor', 'g'],
      ['Papas Pay', 'g'],
      ['Galletitas Oreo', 'g'],
      ['Coca-Cola Sabor Original', 'ml'],
      ['Mayonesa Hellmanns', 'g'],
      ['Atún en aceite La Campagnola', 'g'],
      ['Pan lactal Bimbo', 'g'],
      ['Ricota La Paulina', 'g'],
      ['Crema de leche Milkaut', 'g'],
      ['Queso rallado Sancor', 'g'],
      ['Frutillas congeladas', 'g'],
      ['Manteca La Serenísima', 'g'],
    ]
    const sug = (conjunto, nombre, unit) =>
      sugerirBase({ name: nombre, unit, unit_grams: null }, conjunto.ingredientes, conjunto.lista)?.name ?? null
    const cambios = []
    for (const [nombre, unit] of productos) {
      const a = sug(antes, nombre, unit)
      const b = sug(ahora, nombre, unit)
      if (a !== b) cambios.push(`${nombre}: antes ${a}, ahora ${b}`)
    }
    // Solo puede aparecer algo donde antes no había nada (ahora la crema y las frutillas son ingredientes de recetas);
    // lo que antes se proponía sigue igual y nada cambia por otra cosa.
    for (const c of cambios) expect(c, c).toMatch(/antes null, ahora/)
    expect(cambios.length).toBeLessThanOrEqual(3)
  })
})

// seed-5.sql es lo que se ejecuta en una base que ya tiene la anterior: tiene que dejarla igual que seed.sql
describe('seed-5.sql', () => {
  const SQL = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../supabase')
  test('suma lo nuevo a una base anterior, sin duplicar si se ejecuta de nuevo y sin tocar lo que ya había', async () => {
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
    const cuenta = async () =>
      (
        await db.query(
          `select (select count(*) from public.foods)::int as alimentos, (select count(*) from public.recipes)::int as recetas, (select count(*) from public.recipe_items)::int as items`,
        )
      ).rows[0]
    // Una base que quedó en la tanda anterior: se arma con seed.sql y se le sacan los datos nuevos
    await db.exec(fs.readFileSync(path.join(SQL, 'seed.sql'), 'utf8'))
    const completa = await cuenta()
    expect(completa).toMatchObject({ alimentos: 390, recetas: 132 })
    const slugsNuevos = alimentosQuinta.map((f) => f[0])
    const recetasNuevas = recetasQuinta.map((r) => r.slug)
    await db.query('delete from public.recipes where slug = any($1)', [recetasNuevas])
    await db.query('delete from public.foods where slug = any($1)', [slugsNuevos])
    expect(await cuenta()).toMatchObject({ alimentos: 274, recetas: 88, items: 368 })

    await db.exec(fs.readFileSync(path.join(SQL, 'seed-5.sql'), 'utf8'))
    expect(await cuenta()).toEqual(completa)
    // Ejecutarlo otra vez no cambia nada
    await db.exec(fs.readFileSync(path.join(SQL, 'seed-5.sql'), 'utf8'))
    expect(await cuenta()).toEqual(completa)
    // Todos los ingredientes de cada receta nueva quedaron cargados
    for (const r of recetasQuinta) {
      const n = (
        await db.query(
          'select count(*)::int as n from public.recipe_items i join public.recipes x on x.id = i.recipe_id where x.slug = $1',
          [r.slug],
        )
      ).rows[0].n
      expect(n, r.slug).toBe(r.items.length)
    }
    await db.close()
  }, 120000)
})

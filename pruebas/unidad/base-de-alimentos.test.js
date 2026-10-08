// La base de alimentos y recetas tal como la ve la app: categorías, familias, sugerencias de "cuenta como"
// y lectura de los productos de Open Food Facts.
import { foods, recipes } from '../../scripts/seed-data.mjs'
import { baseDe, conFamilia, itemsEnBase, stockParaRecetas, sugerirBase } from '../../src/lib/equivalencias.js'
import { aAlimento, adivinarCategoria } from '../../src/lib/openfoodfacts.js'
import { CATEGORIAS } from '../../src/lib/nutricion.js'
import { disponibilidad } from '../../src/lib/planificador.js'
import { eq } from './apoyo.js'

// ---- La base, como la ve la app
const base = conFamilia(
  foods.map((f) => ({
    id: 'id-' + f[0],
    slug: f[0],
    name: f[1],
    unit: f[2],
    unit_grams: f[3],
    kcal: f[5],
    protein: f[6],
    carbs: f[7],
    fat: f[8],
    category: f[9],
    owner: null,
    same_as: null,
  })),
)
const A = new Map(base.map((a) => [a.id, a]))
const S = new Map(base.map((a) => [a.slug, a]))
eq(
  foods.every((f) => CATEGORIAS.includes(f[9])),
  true,
  'todas las categorías de la base están en la lista',
)
eq(
  [...new Set(foods.map((f) => f[9]))].filter((c) => !CATEGORIAS.includes(c)),
  [],
  'ninguna categoría vieja',
)
eq(baseDe(S.get('leche-entera'), A).slug, 'leche', 'la leche entera vale por la leche de las recetas')
eq(baseDe(S.get('leche'), A).slug, 'leche', 'la leche de las recetas es su propia base')
const ingredientes = [
  ...new Set(
    recipes.flatMap((r) =>
      itemsEnBase(
        r.items.map(([s, q]) => ({ food_id: 'id-' + s, qty: q })),
        A,
      ).map((i) => i.food_id),
    ),
  ),
]
  .map((id) => A.get(id))
  .filter((a) => !a.same_as)

// Con solo leche entera y aceite de oliva, la avena con leche se puede hacer
const stock = stockParaRecetas(
  new Map([
    ['id-leche-entera', 1000],
    ['id-avena', 500],
    ['id-banana', 3],
  ]),
  A,
)
const avena = recipes.find((r) => r.slug === 'desayuno-avena')
eq(
  disponibilidad(
    avena,
    itemsEnBase(
      avena.items.map(([s, q]) => ({ food_id: 'id-' + s, qty: q })),
      A,
    ),
    stock,
  ).ok,
  true,
  'con leche entera alcanza para una receta que pide leche',
)

// ---- Sugerencias con los productos reales de la despensa
const s = (name, unit = 'g') => sugerirBase({ name, unit, unit_grams: null }, ingredientes, base)?.name || null
const esperado = {
  'Aceite de girasol (Natura)': 'Aceite',
  'Alfajor negro rasta': null,
  'Caldo (Maggi)': 'Caldo en cubo',
  'Chips (Mini Pamela)': null,
  'Esencia de vainilla': null,
  Jardinera: 'Jardinera en lata',
  'Lentejas (Inalpa)': 'Lentejas secas',
  'Presto Pronta (Arcor)': 'Polenta (harina de maíz)',
  'Salsa golf (Natura)': null,
  'Salsa Lista Pomarola (Arcor)': 'Salsa de tomate lista (pomarola, filetto)',
  Spaghetti: 'Fideos secos (crudos)',
  'Tirabuzón №28 (Matarazzo)': 'Fideos secos (crudos)',
  'Topline seven Ultra Green Mint (Arcor)': null,
  'Traviata x3 (Bagley)': 'Galletita de agua',
  'Leche descremada La Serenísima': 'Leche parcialmente descremada',
  'Galletitas Oreo': null,
  'Pasta de maní Entrenuts': 'Pasta de maní',
  'Galletitas de arroz Molinos': 'Galleta de arroz',
  'Galletitas Pepitos': null,
  'Aceite de oliva extra virgen (Cocinero)': 'Aceite',
  'Queso crema Casancrem': 'Queso untable light',
  'Atún en aceite La Campagnola': 'Atún al natural (lata 170 g)',
  'Fideos integrales Lucchetti': 'Fideos secos (crudos)',
  'Mayonesa Hellmanns': 'Mayonesa light',
  'Arroz Gallo Oro': 'Arroz largo fino (crudo)',
  'Coca-Cola Sabor Original': null,
}
for (const [nombre, base_] of Object.entries(esperado))
  eq(s(nombre, /Aceite|Leche|Coca/.test(nombre) ? 'ml' : 'g'), base_, 'sugerencia: ' + nombre)

// ---- Categoría
const cat = (n, tags = [], liq = false) => adivinarCategoria(n, tags, liq)
eq(
  [
    cat('Spaghetti'),
    cat('Tirabuzón №28'),
    cat('Vinagre de Alcohol', [], true),
    cat('Aceite de girasol', [], true),
    cat('Atún en aceite'),
    cat('Caldo de pollo'),
    cat('Galletitas de arroz'),
  ],
  ['Pastas y arroz', 'Pastas y arroz', 'Salsas y aderezos', 'Despensa', 'Pescados', 'Despensa', 'Panadería'],
  'categoría por nombre',
)
eq(
  [
    cat('Bebida rara', [], true),
    cat('Cosa rara'),
    cat('Leche Entera', ['en:dairies', 'en:milks', 'en:beverages'], true),
    cat('X', ['en:plant-based-foods-and-beverages', 'en:pastas']),
    cat('X', ['en:plant-based-foods-and-beverages']),
  ],
  ['Bebidas', 'Otros', 'Lácteos', 'Pastas y arroz', 'Otros'],
  'categoría por etiquetas y por descarte',
)
eq(CATEGORIAS.includes(cat('Dulce de leche')) && cat('Dulce de leche'), 'Despensa', 'dulce de leche')

// ---- Los dos formatos de respuesta
const viejo = {
  code: '779',
  product_name: 'Mostaza',
  product_name_es: 'Mostaza original',
  brands: 'Savora,Unilever',
  quantity: '250 g',
  nutriments: { 'energy-kcal_100g': 66, proteins_100g: 4, carbohydrates_100g: 6, fat_100g: 3 },
  categories_tags: ['en:condiments', 'en:mustards'],
  countries_tags: ['en:argentina'],
}
eq(
  aAlimento(viejo),
  {
    codigo: '779',
    name: 'Mostaza original (Savora)',
    detalle: '250 g',
    unit: 'g',
    category: 'Salsas y aderezos',
    kcal: 66,
    protein: 4,
    carbs: 6,
    fat: 3,
    alcohol: false,
    argentino: true,
  },
  'formato del buscador viejo',
)
const nuevo = {
  code: '780',
  product_name: { main: 'Whole milk', es: 'Leche entera' },
  brands: ['la-serenisima'],
  quantity: '1 L',
  nutriments: { 'energy-kj_100g': 251, proteins_100g: 3, carbohydrates_100g: 4.7, fat_100g: 3 },
  categories_tags: ['en:dairies', 'en:milks'],
  countries_tags: ['en:argentina'],
}
eq(
  aAlimento(nuevo),
  {
    codigo: '780',
    name: 'Leche entera (La Serenisima)',
    detalle: '1 L',
    unit: 'ml',
    category: 'Lácteos',
    kcal: 60,
    protein: 3,
    carbs: 4.7,
    fat: 3,
    alcohol: false,
    argentino: true,
  },
  'formato del buscador nuevo (nombre por idioma, marca como etiqueta, energía en kJ)',
)
eq(
  aAlimento({
    code: '1',
    product_name: 'Cerveza rubia',
    brands: 'Quilmes',
    quantity: '473 ml',
    nutriments: { 'energy-kcal_100g': 43, alcohol_100g: 4.9 },
    categories_tags: ['en:beverages', 'en:beers'],
  }).alcohol,
  true,
  'detecta el alcohol',
)
eq(
  [
    aAlimento({ product_name: 'Sin datos', nutriments: {} }),
    aAlimento({ nutriments: { 'energy-kcal_100g': 10 } }),
    aAlimento({ product_name: 'Raro', nutriments: { 'energy-kcal_100g': 5000 } }),
  ],
  [null, null, null],
  'descarta lo que no sirve',
)

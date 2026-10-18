// Búsqueda de productos de marca en Open Food Facts: base abierta y gratuita, no pide clave.
// Los datos los carga la gente, así que cada resultado se revisa antes de ofrecerlo.
//
// Open Food Facts tiene dos buscadores: el nuevo (search.openfoodfacts.org), rápido, y el viejo
// (world.openfoodfacts.org/cgi/search.pl), que se cae seguido y admite pocos pedidos por minuto.
// Se prueba primero el nuevo y, si falla, el viejo; y si fallan los dos se vuelve a intentar solo,
// para que la persona no tenga que apretar "Reintentar".
import { LIM } from './validar'

const NUEVO = 'https://search.openfoodfacts.org/search'
const VIEJO = 'https://world.openfoodfacts.org/cgi/search.pl'
const CAMPOS = 'code,product_name,brands,quantity,nutriments,categories_tags,countries_tags'
const TIEMPO_PEDIDO = 7000 // cada pedido
const TIEMPO_TOTAL = 24000 // todos los intentos de una búsqueda
const ESPERAS = [700, 1500, 2500, 3500] // pausa antes de cada nueva vuelta
const VUELTAS = 6 // como mucho, tantas vueltas por búsqueda

const normal = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

// Un pedido con su propio límite de tiempo
async function traer(url, ms) {
  const control = new AbortController()
  const corte = setTimeout(() => control.abort(), ms)
  try {
    const r = await fetch(url, { signal: control.signal, headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`Open Food Facts respondió ${r.status}`)
    return await r.json()
  } finally {
    clearTimeout(corte)
  }
}

// Buscador nuevo. El texto va sin los signos que usa su sintaxis de consultas.
async function pedirNuevo(texto, soloArgentina, ms) {
  const limpio = texto
    .replace(/["'()[\]{}:^~*?\\/+\-!&|<>=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const p = new URLSearchParams({
    q: soloArgentina ? `${limpio} countries_tags:"en:argentina"` : limpio,
    langs: 'es,en',
    page_size: '24',
    fields: CAMPOS,
  })
  const datos = await traer(`${NUEVO}?${p}`, ms)
  if (!Array.isArray(datos?.hits)) throw new Error('respuesta inesperada del buscador nuevo')
  return datos.hits
}

// Buscador viejo
async function pedirViejo(texto, soloArgentina, ms) {
  const p = new URLSearchParams({
    search_terms: texto,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '20',
    sort_by: 'unique_scans_n',
    lc: 'es',
    fields: `${CAMPOS},product_name_es`,
  })
  if (soloArgentina) {
    p.set('tagtype_0', 'countries')
    p.set('tag_contains_0', 'contains')
    p.set('tag_0', 'argentina')
  }
  const datos = await traer(`${VIEJO}?${p}`, ms)
  if (!Array.isArray(datos?.products)) throw new Error('respuesta inesperada del buscador viejo')
  return datos.products
}

const numero = (v) => (v === '' || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v))
const uno = (n) => Math.round(n * 10) / 10
// Los dos buscadores no devuelven los textos igual: puede venir un texto, una lista o un objeto por idioma
const texto = (v) =>
  typeof v === 'string'
    ? v
    : Array.isArray(v)
      ? texto(v[0])
      : v && typeof v === 'object'
        ? texto(v.es || v.main || v.en || Object.values(v)[0])
        : ''
// "la-serenisima" o "en:arcor" -> "La Serenisima", "Arcor"
const marcaLinda = (m) =>
  /^[a-z0-9:-]+$/.test(m)
    ? m
        .replace(/^[a-z]{2}:/, '')
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ')
    : m

// ---------- Categoría: por las etiquetas de Open Food Facts o, si no hay, por el nombre ----------
const POR_ETIQUETA = [
  [/^en:(pastas|dry-pastas|noodles|rices|rice|spaghetti|gnocchi|cereal-pastas)$/, 'Pastas y arroz'],
  [/^en:(canned-legumes|canned-vegetables|canned-plant-based-foods|canned-foods|canned-fruits|pickles|olives)$/, 'Enlatados'],
  [/^en:(legumes|pulses|lentils|chickpeas|beans|dried-legumes|legumes-and-their-products)$/, 'Legumbres'],
  [/^en:(fishes|canned-fishes|tunas|sardines|seafood|fish-and-meat-and-eggs)$/, 'Pescados'],
  [/^en:(meats|poultries|sausages|hams|prepared-meats|eggs|cold-cuts|meats-and-their-products)$/, 'Carnes y huevos'],
  [/^en:(frozen-foods|ice-creams|ice-creams-and-sorbets)$/, 'Congelados'],
  [/^en:(dairies|milks|cheeses|yogurts|butters|creams|fermented-milk-products)$/, 'Lácteos'],
  [/^en:(breakfast-cereals|cereal-flakes|mueslis|oat-flakes|seeds)$/, 'Cereales'],
  [/^en:(breads|crackers|toasts|viennoiseries|pizza-doughs|flatbreads|rusks)$/, 'Panadería'],
  [
    /^en:(sauces|condiments|mayonnaises|mustards|ketchup|tomato-sauces|vinegars|salad-dressings|tomato-purees|groceries)$/,
    'Salsas y aderezos',
  ],
  [
    /^en:(snacks|sweet-snacks|salty-snacks|chocolates|candies|confectioneries|biscuits|biscuits-and-cakes|cakes|desserts|nuts|dried-fruits|chewing-gum|chips-and-fries)$/,
    'Snacks y dulces',
  ],
  [/^en:(meals|pizzas|sandwiches|soups|prepared-dishes)$/, 'Comidas hechas'],
  [
    /^en:(fats|vegetable-oils|vegetable-fats|sugars|honeys|sweeteners|flours|broths|bouillons|spices|salts|spreads|sweet-spreads|jams|cocoa-and-its-products|coffees|teas|yerba-mate|baking-decorations|cooking-helpers)$/,
    'Despensa',
  ],
  [/^en:(beverages|waters|sodas|juices|fruit-juices|beers|wines|alcoholic-beverages|plant-based-beverages|energy-drinks)$/, 'Bebidas'],
  [/^en:(fruits|fresh-fruits|fruits-based-foods)$/, 'Frutas'],
  [/^en:(vegetables|fresh-vegetables|vegetables-based-foods)$/, 'Verduras'],
]
const POR_NOMBRE = [
  [/\b(galletit|galleta|tostada|criollo|bizcocho|grisin|pan |pan$|prepizza|tapa de)/, 'Panadería'],
  [
    /\b(alfajor|chocolate|caramelo|chicle|gomita|turron|golosina|bombon|papas fritas|chips|mani|barrita|budin|chizito|palito|pochoclo|mint)/,
    'Snacks y dulces',
  ],
  [/\b(atun|caballa|sardina|merluza|salmon|pescado)/, 'Pescados'],
  [
    /\b(dulce de leche|mermelada|miel|aceite|azucar|harina|caldo|cafe|yerba|cacao|edulcorante|esencia|maicena|fecula|condimento|oregano|pimienta|pimenton|levadura|sal fina|sal gruesa)/,
    'Despensa',
  ],
  [
    /\b(fideo|spaghetti|espagueti|tallarin|tirabuzon|mostachol|mono|codito|penne|fusilli|arroz|raviol|noqui|polenta|presto pronta|capelet|sorrentino)/,
    'Pastas y arroz',
  ],
  [/\b(salsa|mayonesa|mostaza|ketchup|vinagre|aceto|aderezo|pure de tomate|tomate triturado|chimichurri|pomarola)/, 'Salsas y aderezos'],
  [/\b(en lata|arveja|choclo|jardinera|palmito|aceituna|almibar|pate|picadillo)/, 'Enlatados'],
  [/\b(lenteja|poroto|garbanzo|soja texturizada)/, 'Legumbres'],
  [/\b(congelad|nugget|medallon|helado)/, 'Congelados'],
  [/\b(leche|yogur|queso|manteca|crema|ricota|postre|flan)/, 'Lácteos'],
  [/\b(pollo|carne|jamon|salchicha|hamburguesa|chorizo|salame|mortadela|huevo|milanesa|paleta|fiambre)/, 'Carnes y huevos'],
  [/\b(avena|granola|cereal|copos|quinoa|chia)/, 'Cereales'],
  [/\b(pizza|empanada|tarta|sandwich)/, 'Comidas hechas'],
  [/\b(gaseosa|agua|jugo|cerveza|vino|bebida|soda|te |te$|mate cocido)/, 'Bebidas'],
]
// `liquido` solo decide cuando no hay ninguna otra pista: un aceite o un vinagre no son una bebida.
export function adivinarCategoria(nombre, etiquetas = [], liquido = false) {
  for (const [regla, categoria] of POR_ETIQUETA) if (etiquetas.some((e) => regla.test(e))) return categoria
  const n = normal(nombre).replace(/\(.*?\)/g, ' ')
  for (const [regla, categoria] of POR_NOMBRE) if (regla.test(n)) return categoria
  return liquido ? 'Bebidas' : 'Otros'
}

// Valor de un nutriente cada 100 g o ml. Open Food Facts lo trae de varias maneras según cómo lo cargó cada persona:
// ya por 100 (`_100g`), por porción (`_serving`, se pasa a 100 con el tamaño de la porción) o suelto (`clave`, que vale
// para lo que diga `nutrition_data_per`, si se sabe). null si no está de ninguna forma.
function por100(n, clave, porcion, base) {
  const directo = numero(n[`${clave}_100g`])
  if (directo !== null) return directo
  const enPorcion = numero(n[`${clave}_serving`])
  if (enPorcion !== null && porcion > 0) return (enPorcion * 100) / porcion
  const suelto = numero(n[clave])
  if (suelto !== null) {
    if (base === '100g') return suelto
    if (base === 'serving' && porcion > 0) return (suelto * 100) / porcion
  }
  return null
}

// Calorías cada 100: las que trae el producto, las de los kilojoules o, si no hay ninguna, las que salen de
// proteínas, carbohidratos y grasas (4, 4 y 9 kcal por gramo). Devuelve { kcal, calculado } o null.
function calorias(n, porcion, base) {
  let kcal = por100(n, 'energy-kcal', porcion, base)
  if (kcal === null) {
    const kj = por100(n, 'energy-kj', porcion, base) ?? por100(n, 'energy', porcion, base)
    if (kj !== null) kcal = kj / 4.184
  }
  if (kcal !== null) return { kcal, calculado: false }
  const p = por100(n, 'proteins', porcion, base)
  const c = por100(n, 'carbohydrates', porcion, base)
  const g = por100(n, 'fat', porcion, base)
  if (p === null || c === null || g === null || [p, c, g].some((x) => x < 0) || p + c + g > 100.5) return null
  return { kcal: p * 4 + c * 4 + g * 9, calculado: true }
}

// Lo que se sabe de un producto sin mirar sus nutrientes: nombre (con la marca), medida, categoría. null si no tiene nombre.
function ficha(prod) {
  const nombre = (
    texto(prod.product_name_es) ||
    texto(prod.product_name) ||
    texto(prod.generic_name_es) ||
    texto(prod.generic_name) ||
    texto(prod.product_name_en)
  )
    .trim()
    .replace(/\s+/g, ' ')
  if (!nombre) return null
  const n = prod.nutriments || {}
  const marca = marcaLinda((Array.isArray(prod.brands) ? texto(prod.brands) : String(prod.brands || '').split(',')[0]).trim())
  const cantidad = texto(prod.quantity).trim()
  const etiquetas = Array.isArray(prod.categories_tags) ? prod.categories_tags : []
  const liquido = /\d\s?(ml|cl|cc|l|lt|litros?)\b/i.test(cantidad) || etiquetas.includes('en:beverages')
  const completo = marca && !normal(nombre).includes(normal(marca)) ? `${nombre} (${marca})` : nombre
  return {
    nombre,
    nutrientes: n,
    completo: completo.slice(0, LIM.nombre),
    detalle: cantidad,
    unit: liquido ? 'ml' : 'g',
    category: adivinarCategoria(nombre, etiquetas, liquido),
    liquido,
    argentino: (Array.isArray(prod.countries_tags) ? prod.countries_tags : []).includes('en:argentina'),
  }
}

// Pasa un producto de Open Food Facts al formato de la app. Devuelve null si no sirve.
export function aAlimento(prod) {
  const f = ficha(prod)
  if (!f) return null
  const n = f.nutrientes
  const porcion = numero(prod.serving_quantity) ?? 0
  // Sin saber a qué se refieren los valores sueltos (las búsquedas no lo dicen), no se usan
  const base = prod.nutrition_data_per === 'serving' || prod.nutrition_data_per === '100g' ? prod.nutrition_data_per : null
  const energia = calorias(n, porcion, base)
  if (!energia) return null
  const protein = por100(n, 'proteins', porcion, base) ?? 0
  const carbs = por100(n, 'carbohydrates', porcion, base) ?? 0
  const fat = por100(n, 'fat', porcion, base) ?? 0
  // Valores imposibles: producto mal cargado
  if (energia.kcal < 0 || energia.kcal > LIM.kcal100[1] || [protein, carbs, fat].some((x) => x < 0 || x > 100)) return null
  return {
    codigo: String(prod.code || f.completo),
    name: f.completo,
    detalle: f.detalle,
    unit: f.unit,
    category: f.category,
    kcal: Math.round(energia.kcal),
    protein: uno(protein),
    carbs: uno(carbs),
    fat: uno(fat),
    alcohol: f.liquido && (por100(n, 'alcohol', porcion, base) ?? 0) > 0.5,
    argentino: f.argentino,
    // las calorías no venían: salieron de las proteínas, carbohidratos y grasas
    calculado: energia.calculado,
  }
}

function unir(listas) {
  const vistos = new Set()
  return listas.flat().filter((a) => {
    const clave = normal(a.name)
    if (vistos.has(clave)) return false
    vistos.add(clave)
    return true
  })
}

// Una vuelta: prueba el buscador nuevo y, si falla, el viejo. Primero lo que se vende en Argentina y, si hay poco, el resto.
async function unaVuelta(texto, hasta) {
  let ultimo = null
  for (const [fuente, pedir] of [
    ['nuevo', pedirNuevo],
    ['viejo', pedirViejo],
  ]) {
    const queda = () => Math.max(1000, Math.min(TIEMPO_PEDIDO, hasta - Date.now()))
    try {
      const deAca = (await pedir(texto, true, queda())).map(aAlimento).filter(Boolean)
      if (deAca.length >= 3) return { fuente, lista: unir([deAca]) }
      try {
        return { fuente, lista: unir([deAca, (await pedir(texto, false, queda())).map(aAlimento).filter(Boolean)]) }
      } catch (e) {
        if (deAca.length > 0) return { fuente, lista: unir([deAca]) }
        throw e
      }
    } catch (e) {
      ultimo = e
    }
  }
  throw ultimo
}

// ---------- Un producto por su código de barras ----------
const PRODUCTO = 'https://world.openfoodfacts.org/api/v2/product'
// Para un solo producto se piden más campos que en la búsqueda: nombre genérico, porción y a qué se refieren los valores
const CAMPOS_CODIGO = `${CAMPOS},product_name_es,product_name_en,generic_name,generic_name_es,serving_quantity,nutrition_data_per`

// Busca el producto exacto de un código de barras. Devuelve:
//   { estado: 'ok', producto }   el producto, en el formato de la app
//   { estado: 'incompleto', nombre, detalle, unit, category }   está en Open Food Facts pero sin calorías: hay que cargar los valores
//   { estado: 'no' }   no lo tienen (o lo tienen vacío, sin nombre)
// Si Open Food Facts no responde (después de 3 intentos) tira el error, para no confundirlo con "no existe".
export async function buscarPorCodigo(codigo) {
  let ultimo = null
  for (let intento = 0; intento < 3; intento++) {
    const control = new AbortController()
    const corte = setTimeout(() => control.abort(), TIEMPO_PEDIDO)
    try {
      const r = await fetch(`${PRODUCTO}/${encodeURIComponent(codigo)}.json?fields=${CAMPOS_CODIGO}`, {
        signal: control.signal,
        headers: { Accept: 'application/json' },
      })
      if (r.status === 404) return { estado: 'no' }
      if (!r.ok) throw new Error(`Open Food Facts respondió ${r.status}`)
      const datos = await r.json()
      if (datos?.status !== 1 || !datos.product) return { estado: 'no' }
      const producto = aAlimento({ ...datos.product, code: codigo })
      if (producto) return { estado: 'ok', producto }
      const f = ficha(datos.product)
      return f ? { estado: 'incompleto', nombre: f.completo, detalle: f.detalle, unit: f.unit, category: f.category } : { estado: 'no' }
    } catch (e) {
      ultimo = e
      if (intento < 2) await dormir(ESPERAS[intento])
    } finally {
      clearTimeout(corte)
    }
  }
  throw ultimo
}

const guardadas = new Map() // búsquedas ya hechas en esta sesión: no se vuelve a consultar

// Busca productos. Reintenta sola hasta TIEMPO_TOTAL o VUELTAS (lo que pase primero); si igual no hay respuesta, tira el error.
// `alReintentar` avisa cuando arranca una vuelta nueva (para mostrar que sigue buscando).
// `alTerminar` recibe cómo salió ({ resultado, fuente, vueltas, ms }), para poder medir si el servicio anda bien.
export async function buscarProductos(texto, { alReintentar, alTerminar } = {}) {
  const avisar = (como) => {
    try {
      alTerminar?.(como)
    } catch {
      /* medir no puede romper la búsqueda */
    }
  }
  const clave = normal(texto.trim())
  if (guardadas.has(clave)) return guardadas.get(clave)
  const inicio = Date.now()
  const hasta = inicio + TIEMPO_TOTAL
  for (let vuelta = 0; ; vuelta++) {
    try {
      const { fuente, lista: todos } = await unaVuelta(texto.trim(), hasta)
      const lista = todos.slice(0, 20)
      if (guardadas.size >= 60) guardadas.delete(guardadas.keys().next().value)
      guardadas.set(clave, lista)
      avisar({ resultado: lista.length > 0 ? 'ok' : 'vacio', fuente, vueltas: vuelta + 1, ms: Date.now() - inicio })
      return lista
    } catch (e) {
      const pausa = ESPERAS[Math.min(vuelta, ESPERAS.length - 1)]
      if (vuelta + 1 >= VUELTAS || Date.now() + pausa + 1000 >= hasta) {
        avisar({ resultado: 'error', vueltas: vuelta + 1, ms: Date.now() - inicio, motivo: String(e?.message || e).slice(0, 80) })
        throw e
      }
      alReintentar?.(vuelta + 1)
      await dormir(pausa)
    }
  }
}

// Para las pruebas
export const _olvidar = () => guardadas.clear()

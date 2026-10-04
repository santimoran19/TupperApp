// Búsqueda de productos de marca en Open Food Facts: base abierta y gratuita, no pide clave.
// Los datos los carga la gente, así que cada resultado se revisa antes de ofrecerlo.
import { LIM } from './validar'

const DIRECCION = 'https://world.openfoodfacts.org/cgi/search.pl'
const CAMPOS = 'code,product_name,product_name_es,brands,quantity,nutriments,categories_tags'

async function pedir(texto, soloArgentina, signal) {
  const p = new URLSearchParams({
    search_terms: texto, search_simple: '1', action: 'process', json: '1',
    page_size: '20', sort_by: 'unique_scans_n', lc: 'es', fields: CAMPOS,
  })
  if (soloArgentina) {
    p.set('tagtype_0', 'countries')
    p.set('tag_contains_0', 'contains')
    p.set('tag_0', 'argentina')
  }
  const r = await fetch(`${DIRECCION}?${p}`, { signal })
  if (!r.ok) throw new Error(`Open Food Facts respondió ${r.status}`)
  const datos = await r.json()
  return Array.isArray(datos.products) ? datos.products : []
}

const numero = (v) => (v === '' || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v))
const uno = (n) => Math.round(n * 10) / 10

// Pasa un producto de Open Food Facts al formato de la app. Devuelve null si no sirve.
export function aAlimento(prod) {
  const nombre = (prod.product_name_es || prod.product_name || '').trim().replace(/\s+/g, ' ')
  const n = prod.nutriments || {}
  let kcal = numero(n['energy-kcal_100g'])
  if (kcal === null && numero(n.energy_100g) !== null) kcal = Number(n.energy_100g) / 4.184 // viene en kJ
  if (!nombre || kcal === null) return null
  const protein = numero(n.proteins_100g) ?? 0
  const carbs = numero(n.carbohydrates_100g) ?? 0
  const fat = numero(n.fat_100g) ?? 0
  // Valores imposibles: producto mal cargado
  if (kcal < 0 || kcal > LIM.kcal100[1] || [protein, carbs, fat].some((x) => x < 0 || x > 100)) return null
  const marca = (prod.brands || '').split(',')[0].trim()
  const cantidad = (prod.quantity || '').trim()
  const liquido = /\d\s?(ml|cl|cc|l|lt|litros?)\b/i.test(cantidad) || (prod.categories_tags || []).includes('en:beverages')
  const completo = marca && !nombre.toLowerCase().includes(marca.toLowerCase()) ? `${nombre} (${marca})` : nombre
  return {
    codigo: String(prod.code || completo),
    name: completo.slice(0, LIM.nombre),
    detalle: cantidad,
    unit: liquido ? 'ml' : 'g',
    category: liquido ? 'Bebidas' : 'Otros',
    kcal: Math.round(kcal), protein: uno(protein), carbs: uno(carbs), fat: uno(fat),
  }
}

// Busca primero entre los productos que se venden en Argentina y, si hay pocos, en el resto.
export async function buscarProductos(texto) {
  const control = new AbortController()
  const corte = setTimeout(() => control.abort(), 12000)
  try {
    let productos = await pedir(texto, true, control.signal)
    let lista = productos.map(aAlimento).filter(Boolean)
    if (lista.length < 3) {
      productos = await pedir(texto, false, control.signal)
      lista = lista.concat(productos.map(aAlimento).filter(Boolean))
    }
    const vistos = new Set()
    return lista.filter((a) => {
      const clave = a.name.toLowerCase()
      if (vistos.has(clave)) return false
      vistos.add(clave)
      return true
    }).slice(0, 20)
  } finally {
    clearTimeout(corte)
  }
}

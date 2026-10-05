// Equivalencias: un alimento propio (por ejemplo, un producto de marca) puede valer por un alimento
// de las recetas. Las recetas siguen pidiendo "Aceite" y lo cubre cualquier producto que cuente como aceite.
import { gramos } from './nutricion'

const EPS = 0.001

// Para pasar de unidades a gramos (o al revés) hay que saber cuánto pesa cada unidad
const pesaAlgo = (a) => a.unit !== 'u' || Number(a.unit_grams) > 0
export const sonCompatibles = (x, y) => (x.unit === 'u' && y.unit === 'u') || (pesaAlgo(x) && pesaAlgo(y))

// Pasa una cantidad de un alimento a la medida de otro. Unidad con unidad va 1 a 1; lo demás, por peso
// (gramos y mililitros se toman como iguales: en cocina la diferencia no mueve la aguja).
export function convertir(de, a, qty) {
  if (de.id === a.id || (de.unit === 'u' && a.unit === 'u')) return qty
  const g = gramos(de, qty)
  return a.unit === 'u' ? g / Number(a.unit_grams) : g
}

// El alimento por el que vale `a`. Si no está vinculado, o el vínculo no sirve, es él mismo.
export function baseDe(a, alimentos) {
  const b = a?.same_as ? alimentos.get(a.same_as) : null
  return b && b.id !== a.id && !b.same_as && sonCompatibles(a, b) ? b : a
}

// Map base -> productos que valen por ese alimento
export function equivalentesPorBase(lista, alimentos) {
  const m = new Map()
  for (const a of lista) {
    const b = baseDe(a, alimentos)
    if (b === a) continue
    if (!m.has(b.id)) m.set(b.id, [])
    m.get(b.id).push(a)
  }
  return m
}

// Stock visto desde las recetas: lo de cada producto vinculado se suma al alimento por el que vale
export function stockParaRecetas(stock, alimentos) {
  const m = new Map()
  for (const [id, qty] of stock) {
    const a = alimentos.get(id)
    if (!a) continue
    const b = baseDe(a, alimentos)
    m.set(b.id, (m.get(b.id) || 0) + convertir(a, b, qty))
  }
  return m
}

// Ingredientes de una receta llevados al alimento por el que vale cada uno
export function itemsEnBase(items, alimentos) {
  const m = new Map()
  for (const it of items) {
    const a = alimentos.get(it.food_id)
    const b = a ? baseDe(a, alimentos) : null
    const id = b ? b.id : it.food_id
    const qty = b ? convertir(a, b, it.qty) : it.qty
    m.set(id, { ...it, food_id: id, qty: (m.get(id)?.qty || 0) + qty })
  }
  return [...m.values()]
}

// De los productos que valen por cada alimento, el que más hay en la despensa (si hay alguno)
export function productoEnUso(equivalentes, alimentos, stock) {
  const m = new Map()
  for (const [baseId, productos] of equivalentes) {
    const b = alimentos.get(baseId)
    let mejor = null
    for (const p of productos) {
      const hay = convertir(p, b, stock.get(p.id) || 0)
      if (hay > EPS && (!mejor || hay > mejor.hay)) mejor = { p, hay }
    }
    if (mejor) m.set(baseId, mejor.p)
  }
  return m
}

// Anota en `cambios` (Map alimento -> diferencia de stock) lo que se gasta de un ingrediente:
// primero sale de los productos vinculados que haya y lo que falte, del alimento de la receta.
export function gastar(cambios, base, cantidad, productos, stock) {
  let resto = cantidad
  const conStock = productos
    .map((p) => ({ p, hay: convertir(p, base, (stock.get(p.id) || 0) + (cambios.get(p.id) || 0)) }))
    .filter((x) => x.hay > EPS)
    .sort((x, y) => y.hay - x.hay)
  for (const { p, hay } of conStock) {
    const usa = Math.min(hay, resto)
    cambios.set(p.id, (cambios.get(p.id) || 0) - convertir(base, p, usa))
    resto -= usa
    if (resto <= EPS) return
  }
  cambios.set(base.id, (cambios.get(base.id) || 0) - resto)
}

// ---------- Sugerencia: ¿por qué alimento de las recetas vale este producto? ----------
const VACIAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'en', 'con', 'sin', 'y', 'a', 'al', 'para', 'por', 'tipo'])
function palabras(nombre) {
  return nombre
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((p) => p && !VACIAS.has(p))
    .map((p) => (p.length > 3 && p.endsWith('s') ? p.slice(0, -1) : p))
}

// Devuelve el candidato que mejor coincide con el nombre del producto, o null.
// Tiene que empezar igual ("Aceite girasol" -> "Aceite") para no proponer cosas como "Galletitas de arroz" -> "Arroz".
export function sugerirBase(producto, candidatos) {
  const mias = palabras(producto.name)
  if (mias.length === 0) return null
  const tengo = new Set(mias)
  const posibles = candidatos
    .filter((c) => c.id !== producto.id && sonCompatibles(producto, c))
    .map((c) => ({ c, p: palabras(c.name) }))
    .filter((x) => x.p.length > 0 && x.p[0] === mias[0])
  if (posibles.length === 0) return null
  // El que tiene todas sus palabras en el nombre del producto; entre varios, el más específico
  const completos = posibles.filter((x) => x.p.every((w) => tengo.has(w))).sort((x, y) => y.p.length - x.p.length)
  if (completos.length > 0) return completos[0].c
  // Si no, solo cuando hay un único alimento que empieza así
  return posibles.length === 1 ? posibles[0].c : null
}

// "No" a una sugerencia: se recuerda en el dispositivo para no volver a preguntar
const CLAVE = 'tupper:equivalencias-no'
export function descartadas() {
  try { return new Set(JSON.parse(localStorage.getItem(CLAVE) || '[]')) } catch { return new Set() }
}
export function descartar(id) {
  const s = descartadas()
  s.add(id)
  try { localStorage.setItem(CLAVE, JSON.stringify([...s].slice(-300))) } catch { /* sin almacenamiento, se vuelve a preguntar */ }
  return s
}

// Nombre corto para mostrar: sin la aclaración entre paréntesis
export const nombreCorto = (a) => a.name.split(' (')[0]

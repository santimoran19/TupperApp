// Categorías editables (1.30, F-13). Además de las de siempre (por góndola, las mismas para todos), cada persona puede
// crear las suyas ("Para el mate", "Cosas del bebé"), renombrarlas o borrarlas, y mover cualquier alimento a otra
// categoría: los propios cambian de verdad; los de la base se "ven" en la elegida solo para esa persona
// (tabla categoria_alimento). Funciones puras.
import { CATEGORIAS } from './nutricion'

export const MAX_CATEGORIAS = 30
export const LARGO_CATEGORIA = 30
const OTROS = 'Otros'

const normal = (t) =>
  String(t || '')
    .trim()
    .replace(/\s+/g, ' ')
const clave = (t) => normal(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export const esDeLaBase = (nombre) => CATEGORIAS.some((c) => clave(c) === clave(nombre))

// Todas las categorías en el orden en que se muestran: las de siempre, las propias (en el orden en que se crearon) y
// "Otros" al final. `propias`: [{ nombre, created_at }]
export function listaCategorias(propias = []) {
  const suyas = [...propias]
    .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
    .map((c) => c.nombre)
    .filter((n) => !esDeLaBase(n))
  return [...CATEGORIAS.filter((c) => c !== OTROS), ...suyas, OTROS]
}

// Posición de una categoría para ordenar (las que no están en la lista, al final)
export function ordenDe(lista) {
  const pos = new Map(lista.map((c, i) => [c, i]))
  return (c) => (pos.has(c) ? pos.get(c) : lista.length)
}

// ¿Se puede usar ese nombre para una categoría nueva (o para renombrar `actual`)? Devuelve el error o null.
export function errorNombre(nombre, propias = [], actual = null) {
  const n = normal(nombre)
  if (!n) return 'Escribí un nombre.'
  if (n.length > LARGO_CATEGORIA) return `Hasta ${LARGO_CATEGORIA} letras.`
  if (esDeLaBase(n)) return 'Ya existe una categoría con ese nombre.'
  if (propias.some((c) => clave(c.nombre) === clave(n) && clave(c.nombre) !== clave(actual)))
    return 'Ya tenés una categoría con ese nombre.'
  if (!actual && propias.length >= MAX_CATEGORIAS) return `Podés tener hasta ${MAX_CATEGORIAS} categorías propias.`
  return null
}
export const nombreLimpio = normal

// Los alimentos con la categoría que eligió la persona (`elegidas`: Map food_id -> categoría). El original queda en
// `categoria_base`, por si quiere volver.
export function conCategorias(alimentos, elegidas) {
  if (!elegidas?.size) return alimentos
  return alimentos.map((a) =>
    elegidas.has(a.id) && elegidas.get(a.id) !== a.category ? { ...a, category: elegidas.get(a.id), categoria_base: a.category } : a,
  )
}

// Cuántos alimentos hay en cada categoría (para mostrar al lado y para avisar antes de borrar)
export function cuantosPorCategoria(alimentos) {
  const m = new Map()
  for (const a of alimentos) m.set(a.category, (m.get(a.category) || 0) + 1)
  return m
}

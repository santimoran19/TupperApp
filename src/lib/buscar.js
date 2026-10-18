// Búsqueda de alimentos por nombre y por los otros nombres con que se los conoce.
import { ALIAS } from './alias'

export const normal = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Busca por nombre y también por los otros nombres de cada alimento (marcas, sinónimos): "spaghetti" encuentra "Fideos secos".
// Primero van los que coinciden por nombre, y entre ellos los que empiezan con lo escrito ("huevo" trae "Huevo" antes que "Clara de huevo").
export function buscarAlimentos(alimentos, texto) {
  const q = normal(texto.trim())
  const alfabetico = (a, b) => a.name.localeCompare(b.name, 'es')
  if (!q) return [...alimentos].sort(alfabetico)
  const porNombre = alimentos.filter((a) => normal(a.name).includes(q))
  const vistos = new Set(porNombre.map((a) => a.id))
  const porAlias =
    q.length < 3 ? [] : alimentos.filter((a) => !vistos.has(a.id) && (ALIAS[a.slug] || []).some((s) => s.includes(q) || q.includes(s)))
  const empieza = (a) => normal(a.name).startsWith(q)
  const porEmpiezaYLetra = (a, b) => Number(empieza(b)) - Number(empieza(a)) || alfabetico(a, b)
  return [...porNombre.sort(porEmpiezaYLetra), ...porAlias.sort(alfabetico)]
}

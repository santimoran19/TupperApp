// Cargar comida con foto, voz o texto (1.27): cruza lo que la IA entendió ("2 milanesas de pollo, 150 g de arroz") con los
// alimentos y recetas de la app, y calcula las cantidades en la unidad de cada uno. La persona siempre revisa antes de anotar.
import { ALIAS } from './alias'
import { normal } from './buscar'

const PARA_NADA = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'con', 'al', 'a', 'y', 'en', 'un', 'una', 'unos', 'unas', 'para', 'sin'])

// "Milanesas de Pollo" -> ['milanesa', 'pollo']: sin tildes, sin palabras de relleno y con el plural sacado
export function palabras(texto) {
  return normal(String(texto || ''))
    .split(/[^a-z0-9ñ]+/)
    .filter((t) => t && !PARA_NADA.has(t))
    .map((t) =>
      t.length > 4 && t.endsWith('es') && !t.endsWith('ies') ? t.slice(0, -2) : t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t,
    )
}

// Qué tan parecido es el nombre `candidato` a lo que dijo la IA (`pedido`): de 0 a 1
export function parecido(pedido, candidato, extras = []) {
  const a = new Set(palabras(pedido))
  if (a.size === 0) return 0
  const nombres = [candidato, ...extras.map((e) => ({ alias: e }))]
  let mejor = 0
  for (const entrada of nombres) {
    const alias = typeof entrada === 'object'
    const n = alias ? entrada.alias : entrada
    const b = new Set(palabras(n))
    if (b.size === 0) continue
    const comunes = [...a].filter((t) => b.has(t)).length
    if (comunes === 0) continue
    const union = new Set([...a, ...b]).size
    let p = comunes / union
    // Si todo el nombre del alimento está dicho ("arroz blanco hervido" para "Arroz blanco") sube; y al revés, un poco menos
    if (comunes === b.size) p += 0.15
    else if (comunes === a.size) p += 0.08
    // Cada palabra de más en el nombre del alimento lo aleja un poco: "pan" va antes a "Pan francés" que a "Pan de queso con orégano"
    p -= 0.03 * (b.size - comunes)
    if (comunes === a.size && comunes === b.size) p = 1
    // Un sinónimo vale un poco menos que el nombre mismo (salvo que sea idéntico)
    mejor = Math.max(mejor, Math.min(1, alias && p < 1 ? p * 0.95 : p))
  }
  return mejor
}

// Los mejores candidatos (alimentos y recetas) para un ítem de la IA: [{ tipo, objeto, puntaje }] de mayor a menor, hasta `max`
export function emparejar(item, { alimentos, recetas = [], max = 4 }) {
  const lista = []
  for (const a of alimentos) {
    const p = parecido(
      item.nombre,
      a.name,
      (ALIAS[a.slug] || []).map((s) => s),
    )
    if (p > 0.2) lista.push({ tipo: 'alimento', objeto: a, puntaje: p })
  }
  for (const r of recetas) {
    // Una receta solo cuenta si se dijo algo parecido a un plato (no por una palabra suelta como "pollo")
    const p = parecido(item.nombre, r.name)
    if (p > 0.34) lista.push({ tipo: 'receta', objeto: r, puntaje: p * 0.97 })
  }
  // Con empate gana el alimento suelto, que es lo más simple de anotar; entre recetas, la de nombre más corto
  return lista
    .sort(
      (x, y) =>
        y.puntaje - x.puntaje ||
        Number(y.tipo === 'alimento') - Number(x.tipo === 'alimento') ||
        x.objeto.name.length - y.objeto.name.length,
    )
    .slice(0, max)
}

// Cómo de seguro es el cruce: 'seguro' se deja elegido, 'dudoso' se deja elegido pero se marca, 'ninguno' pide elegir a mano
export const NIVEL_SEGURO = 0.6
export const NIVEL_DUDOSO = 0.35
export const nivelDe = (candidatos) => {
  const p = candidatos[0]?.puntaje || 0
  return p >= NIVEL_SEGURO ? 'seguro' : p >= NIVEL_DUDOSO ? 'dudoso' : 'ninguno'
}

const redondearA = (n, paso) => Math.round(n / paso) * paso

// La cantidad en la unidad del alimento (gramos, ml o unidades) para lo que dijo la IA
export function cantidadPara(alimento, item) {
  const esPeso = item.unidad === 'g' || item.unidad === 'ml'
  if (alimento.unit === 'u') {
    if (item.unidad === 'unidad') return Math.max(0.5, redondearA(item.cantidad, 0.5))
    const g = Number(alimento.unit_grams) || 0
    return g > 0 ? Math.max(0.5, redondearA(item.gramos / g, 0.5)) : 1
  }
  const base = esPeso ? item.cantidad : item.gramos
  return Math.max(5, redondearA(base, 5))
}

// Porciones de una receta: si dijo "dos milanesas" o "una porción", eso; si dijo gramos, una porción
export const porcionesPara = (item) =>
  item.unidad === 'unidad' || item.unidad === 'porcion' ? Math.max(0.5, redondearA(item.cantidad, 0.5)) : 1

// Los ingredientes de una receta pegada (1.29, IA-04): solo alimentos (una receta no lleva otra receta), con la cantidad
// en la unidad de cada uno. Lo que no se encuentra queda en `sinCruzar` para buscarlo a mano.
export function ingredientesDe(items, { alimentos }) {
  const ingredientes = []
  const sinCruzar = []
  for (const item of items) {
    const [mejor] = emparejar(item, { alimentos, recetas: [] })
    if (!mejor || mejor.puntaje < NIVEL_DUDOSO) {
      sinCruzar.push(item)
      continue
    }
    const qty = cantidadPara(mejor.objeto, item)
    const ya = ingredientes.find((i) => i.food_id === mejor.objeto.id)
    if (ya) ya.qty = String(Number(ya.qty) + qty)
    else ingredientes.push({ food_id: mejor.objeto.id, qty: String(qty) })
  }
  return { ingredientes, sinCruzar }
}

// Pasa los ítems de la IA a platos del formulario de Registrar ({ food_id, qty } o { recipe_id, porciones }) y deja lo que no se pudo
export function platosDe(items, { alimentos, recetas }) {
  const platos = []
  const sinCruzar = []
  for (const item of items) {
    const candidatos = emparejar(item, { alimentos, recetas })
    if (nivelDe(candidatos) === 'ninguno') {
      sinCruzar.push(item)
      continue
    }
    const { tipo, objeto } = candidatos[0]
    platos.push(
      tipo === 'alimento'
        ? { food_id: objeto.id, qty: cantidadPara(objeto, item) }
        : { recipe_id: objeto.id, porciones: porcionesPara(item) },
    )
  }
  return { platos, sinCruzar }
}

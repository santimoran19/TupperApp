// La despensa vista de cerca (F-04 y el rediseño de la 1.24): vencimientos, cuánto queda de cada cosa, consejos para que dure
// más y de qué está hecha. Son funciones puras: reciben las filas y la fecha de hoy, no tocan la base.
import { aFecha } from './fechas'
import { consejosDe } from './consejos'

// ---------- Vencimientos ----------
// Cada alimento de la despensa puede tener la fecha de lo que vence primero (`stock.expires_on`). Si está agotado no cuenta:
// la base la borra sola al llegar a cero, y acá se ignora por si el teléfono todavía no se enteró.
export const vencimientoDe = (fila) => (fila && Number(fila.qty) > 0 && fila.expires_on ? fila.expires_on : null)

// Días que faltan de hoy a esa fecha (negativo si ya pasó). Se cuentan días de calendario, sin horas.
export function diasParaVencer(fecha, hoy) {
  if (!fecha || !hoy) return null
  return Math.round((aFecha(fecha) - aFecha(hoy)) / 86400000)
}

// Hasta cuántos días se avisa "vence pronto" (urgente) y "consumir pronto"
export const DIAS_URGENTE = 3
export const DIAS_PRONTO = 7

// Cómo está una fecha: { dias, nivel, texto } o null si no hay fecha.
//   nivel: 'vencido' | 'urgente' (hoy a 3 días) | 'pronto' (4 a 7 días) | 'bien'
export function estadoVencimiento(fecha, hoy) {
  const dias = diasParaVencer(fecha, hoy)
  if (dias === null) return null
  if (dias < 0) return { dias, nivel: 'vencido', texto: dias === -1 ? 'Venció ayer' : `Venció hace ${-dias} días` }
  if (dias === 0) return { dias, nivel: 'urgente', texto: 'Vence hoy' }
  if (dias === 1) return { dias, nivel: 'urgente', texto: 'Vence mañana' }
  if (dias <= DIAS_URGENTE) return { dias, nivel: 'urgente', texto: `Vence en ${dias} días` }
  if (dias <= DIAS_PRONTO) return { dias, nivel: 'pronto', texto: `Consumir pronto · ${dias} días` }
  if (dias < 60) return { dias, nivel: 'bien', texto: `Bien · ${dias} días` }
  const meses = Math.floor(dias / 30)
  return { dias, nivel: 'bien', texto: meses >= 24 ? `Bien · ${Math.floor(meses / 12)} años` : `Bien · ${meses} meses` }
}

// Para ordenar: primero lo vencido y lo que vence antes; lo que no tiene fecha, al final
export function compararVencimiento(a, b) {
  if (a === b) return 0
  if (!a) return 1
  if (!b) return -1
  return a < b ? -1 : 1
}

// La fecha que se guarda al comprar: si ya había y vence antes, queda la de antes (lo viejo se usa primero)
export function fechaAlSumar(actual, nueva) {
  if (!nueva) return actual || null
  if (!actual) return nueva
  return actual < nueva ? actual : nueva
}

// Lo que vence antes de cada alimento base: un producto que vale por otro (cualquier leche por "leche") avisa en las recetas
// que usan el base. `baseDe(alimento)` es el de derivados.js.
export function vencimientosPorBase(stock, alimentosPorId, baseDe) {
  const m = new Map()
  for (const fila of stock || []) {
    const fecha = vencimientoDe(fila)
    const a = alimentosPorId.get(fila.food_id)
    if (!fecha || !a) continue
    for (const id of new Set([a.id, baseDe(a).id])) {
      const antes = m.get(id)
      if (!antes || fecha < antes) m.set(id, fecha)
    }
  }
  return m
}

// La fecha más cercana entre los ingredientes de una receta (o null)
export function vencimientoDeReceta(items, porBase) {
  let fecha = null
  for (const it of items || []) {
    const f = porBase.get(it.food_id)
    if (f && (!fecha || f < fecha)) fecha = f
  }
  return fecha
}

// ---------- Cuánto queda ----------
// La referencia de "lleno" es lo que se suele comprar de ese alimento: la compra más grande de las últimas (hasta 5).
// Sin compras anotadas no hay referencia y no se muestra barra.
export function referenciasDeCompra(compras) {
  const porAlimento = new Map()
  const ordenadas = [...(compras || [])].filter((c) => c.food_id && Number(c.qty) > 0).sort((a, b) => (a.date < b.date ? 1 : -1))
  for (const c of ordenadas) {
    const lista = porAlimento.get(c.food_id) || []
    if (lista.length < 5) lista.push(Number(c.qty))
    porAlimento.set(c.food_id, lista)
  }
  return new Map([...porAlimento].map(([id, qs]) => [id, Math.max(...qs)]))
}

export const NIVEL_BAJO = 0.25
// { pct (0 a 100), bajo } o null si no hay referencia
export function nivelDeStock(qty, referencia) {
  if (!(referencia > 0)) return null
  const pct = Math.max(0, Math.min(100, Math.round((Number(qty) / referencia) * 100)))
  return { pct, bajo: pct <= NIVEL_BAJO * 100 }
}

// ---------- Para que dure más ----------
// El primer consejo de conservación de un alimento (el carrusel usa todos: ver lib/consejos.js)
export function consejoDe(alimento) {
  return consejosDe(alimento).guardar[0] || null
}

// ---------- De qué está hecha ----------
// Cuántos alimentos con stock hay de cada categoría, de más a menos. Lo que queda chico se junta en "Otros".
export function distribucion(filas, { maximo = 5 } = {}) {
  const cuenta = new Map()
  let total = 0
  for (const { a, qty } of filas || []) {
    if (!(Number(qty) > 0)) continue
    cuenta.set(a.category, (cuenta.get(a.category) || 0) + 1)
    total++
  }
  const orden = [...cuenta].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0], 'es'))
  const grandes = orden.slice(0, maximo)
  const resto = orden.slice(maximo).reduce((s, [, n]) => s + n, 0)
  const lista = resto > 0 ? [...grandes, ['Otros', resto]] : grandes
  // Si "Otros" ya estaba entre los grandes, se suman
  const juntas = new Map()
  for (const [c, n] of lista) juntas.set(c, (juntas.get(c) || 0) + n)
  return {
    total,
    partes: [...juntas].map(([categoria, cantidad]) => ({ categoria, cantidad, pct: total ? Math.round((cantidad / total) * 100) : 0 })),
  }
}

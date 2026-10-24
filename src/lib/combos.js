// Combos (F-09) y copiar un día (F-08), 1.28: las cuentas puras (sin base ni pantalla).

export const MAX_COMBOS = 30
export const MAX_ITEMS_COMBO = 15

// Deja solo lo que se puede anotar: alimentos y recetas que existen, con cantidad válida
export function limpiarItems(items, { alimentosPorId, recetasPorId }) {
  const salida = []
  for (const p of items || []) {
    if (p.food_id) {
      const qty = Number(p.qty)
      if (alimentosPorId.has(p.food_id) && qty > 0 && qty <= 100000 && !salida.some((x) => x.food_id === p.food_id))
        salida.push({ food_id: p.food_id, qty })
    } else if (p.recipe_id) {
      const porciones = Number(p.porciones)
      if (recetasPorId.has(p.recipe_id) && porciones > 0 && porciones <= 50 && !salida.some((x) => x.recipe_id === p.recipe_id))
        salida.push({ recipe_id: p.recipe_id, porciones })
    }
  }
  return salida.slice(0, MAX_ITEMS_COMBO)
}

// Lo anotado en un día, agrupado por comida, listo para registrar en otra fecha (sin los "no comí" ni lo que ya no existe)
export function platosDelDia(registros, fecha, { alimentosPorId, recetasPorId }) {
  const porComida = new Map()
  for (const r of registros) {
    if (r.date !== fecha || r.skipped || !(Number(r.qty) > 0)) continue
    let plato = null
    if (r.food_id && alimentosPorId.has(r.food_id)) plato = { food_id: r.food_id, qty: Number(r.qty) }
    else if (r.recipe_id && recetasPorId.has(r.recipe_id)) plato = { recipe_id: r.recipe_id, porciones: Number(r.qty) }
    if (!plato) continue
    const lista = porComida.get(r.meal) || []
    // Si el mismo alimento está dos veces en la misma comida, se suma
    const igual = lista.find((x) => (plato.food_id ? x.food_id === plato.food_id : x.recipe_id === plato.recipe_id))
    if (igual) {
      if (plato.food_id) igual.qty += plato.qty
      else igual.porciones += plato.porciones
    } else lista.push(plato)
    porComida.set(r.meal, lista)
  }
  return porComida
}

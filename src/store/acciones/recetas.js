// Recetas propias y preferencias (favoritas y "no me gusta").
import { hoy } from '../../lib/fechas'
import { ok, supabase } from '../base'
import { reemplazar } from '../listas'
import { guardarFilasPlan } from './plan'

async function guardarPref(k, recipe_id, cambios) {
  const actual = k.ver().e.prefs.find((p) => p.recipe_id === recipe_id)
  const fila = { user_id: k.uid, recipe_id, hidden: actual?.hidden || false, favorite: actual?.favorite || false, ...cambios }
  const [g] = ok(await supabase.from('recipe_prefs').upsert(fila, { onConflict: 'user_id,recipe_id' }).select())
  k.setE((s) => ({ ...s, prefs: reemplazar(s.prefs, g, (x) => x.recipe_id === recipe_id) }))
}

const soloLoQueVa = (ingredientes) => ingredientes.map((i) => ({ food_id: i.food_id, qty: i.qty }))

export const accionesDeRecetas = (k) => ({
  // La receta y sus ingredientes se guardan juntos: si algo falla, no queda una receta sin ingredientes.
  crearReceta: k.accion(
    'crearReceta',
    async (datos, ingredientes) => {
      const r = ok(await supabase.rpc('guardar_receta', { p_id: null, p_datos: datos, p_items: soloLoQueVa(ingredientes) }))
      k.setE((s) => ({ ...s, recetas: [...s.recetas, r.receta], items: [...s.items, ...r.items] }))
      return r.receta
    },
    { unica: true },
  ),

  // Editar una receta propia: se pisan los datos y se reemplazan los ingredientes (si falla, queda como estaba).
  actualizarReceta: k.accion(
    'actualizarReceta',
    async (id, datos, ingredientes) => {
      const r = ok(await supabase.rpc('guardar_receta', { p_id: id, p_datos: datos, p_items: soloLoQueVa(ingredientes) }))
      k.setE((s) => ({
        ...s,
        recetas: s.recetas.map((x) => (x.id === id ? r.receta : x)),
        items: [...s.items.filter((i) => i.recipe_id !== id), ...r.items],
      }))
      return r.receta
    },
    { unica: true },
  ),

  alternarFavorita: k.accion('alternarFavorita', (id) => guardarPref(k, id, { favorite: !k.ver().favoritas.has(id) })),

  // "No me gusta": la receta deja de aparecer y se saca de lo que estaba planificado de hoy en adelante.
  ocultarReceta: k.accion('ocultarReceta', async (id) => {
    await guardarPref(k, id, { hidden: true, favorite: false })
    const h = hoy()
    const filas = k
      .ver()
      .e.plan.filter((p) => p.recipe_id === id && p.date >= h)
      .map((p) => ({ ...p, recipe_id: null }))
    await guardarFilasPlan(k, filas)
    return { vaciadas: filas.length }
  }),

  mostrarReceta: k.accion('mostrarReceta', (id) => guardarPref(k, id, { hidden: false })),

  borrarReceta: k.accion('borrarReceta', async (id) => {
    ok(await supabase.from('recipes').delete().eq('id', id))
    k.setE((s) => ({
      ...s,
      recetas: s.recetas.filter((r) => r.id !== id),
      items: s.items.filter((i) => i.recipe_id !== id),
      preparado: s.preparado.filter((p) => p.recipe_id !== id),
      plan: s.plan.map((p) => (p.recipe_id === id ? { ...p, recipe_id: null } : p)),
    }))
  }),
})

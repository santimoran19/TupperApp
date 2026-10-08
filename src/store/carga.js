// La carga: todo lo del usuario, traído de Supabase de una vez.
import { hoy, sumarDias } from '../lib/fechas'
import { ok, supabase, traerTodo } from './base'

// El estado antes de saber nada. Las listas son las tablas tal cual vienen de la base.
export const VACIO = {
  cargando: true,
  errorCarga: null,
  perfil: null,
  alimentos: [],
  stock: [],
  recetas: [],
  items: [],
  preparado: [],
  plan: [],
  reglas: [],
  registros: [],
  medidas: [],
  lista: [],
  prefs: [],
  compras: [],
  analisis: [],
}

// Trae todo lo del usuario. Devuelve el estado nuevo; no toca la pantalla.
export async function traer(uid) {
  const desde = sumarDias(hoy(), -90)
  const [perfiles, alimentos, stock, recetas, items, preparado, plan, reglas, registros, medidas, lista, prefs, compras, analisis] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).then(ok),
      traerTodo(() => supabase.from('foods').select('*').order('id')),
      supabase.from('stock').select('*').eq('user_id', uid).then(ok),
      traerTodo(() => supabase.from('recipes').select('*').order('id')),
      traerTodo(() => supabase.from('recipe_items').select('*').order('recipe_id').order('food_id')),
      supabase.from('prepared').select('*').eq('user_id', uid).then(ok),
      traerTodo(() => supabase.from('plan').select('*').eq('user_id', uid).gte('date', desde).order('id')),
      supabase.from('away_rules').select('*').eq('user_id', uid).then(ok),
      traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).gte('date', desde).order('created_at').order('id')),
      traerTodo(() => supabase.from('measurements').select('*').eq('user_id', uid).order('date')),
      supabase.from('shopping_items').select('*').eq('user_id', uid).then(ok),
      supabase.from('recipe_prefs').select('*').eq('user_id', uid).then(ok),
      traerTodo(() => supabase.from('purchases').select('*').eq('user_id', uid).gte('date', desde).order('id')),
      supabase.from('ai_analyses').select('*').eq('user_id', uid).gte('week_start', sumarDias(desde, -7)).then(ok),
    ])
  return {
    cargando: false,
    errorCarga: null,
    perfil: perfiles[0] || null,
    alimentos,
    stock,
    recetas,
    items,
    preparado,
    plan,
    reglas,
    registros,
    medidas,
    lista,
    prefs,
    compras,
    analisis,
  }
}

// La carga: todo lo del usuario, traído de Supabase de una vez.
import { hoy, sumarDias } from '../lib/fechas'
import { ok, supabase, traerTodo } from './base'

// El estado antes de saber nada. Las listas son las tablas tal cual vienen de la base.
export const VACIO = {
  cargando: true,
  errorCarga: null,
  perfil: null,
  hogar: null, // la casa compartida (supabase/actualizacion-13.sql): { id, nombre, codigo, soy_creador, maximo, miembros } o null
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

// El hogar de la persona, o null si no está en ninguno. Con una base a la que todavía no se le aplicó
// actualizacion-13.sql la función no existe: ahí todos están sin hogar, como antes.
async function traerHogar() {
  try {
    return ok(await supabase.rpc('mi_hogar')) ?? null
  } catch (err) {
    if (err.codigo === 'PGRST202') return null
    throw err
  }
}

// Trae todo lo del usuario. Devuelve el estado nuevo; no toca la pantalla.
// La despensa, la lista de compras, las comidas preparadas y las compras son de la persona o, si está en un hogar, del
// hogar: en esas cuatro tablas `user_id` guarda el id de uno u otro (el `ámbito`). Lo demás es siempre de la persona.
export async function traer(uid) {
  const desde = sumarDias(hoy(), -90)
  const [hogar, perfiles, alimentos, recetas, items, plan, reglas, registros, medidas, prefs, analisis] = await Promise.all([
    traerHogar(),
    supabase.from('profiles').select('*').eq('id', uid).then(ok),
    traerTodo(() => supabase.from('foods').select('*').order('id')),
    traerTodo(() => supabase.from('recipes').select('*').order('id')),
    traerTodo(() => supabase.from('recipe_items').select('*').order('recipe_id').order('food_id')),
    traerTodo(() => supabase.from('plan').select('*').eq('user_id', uid).gte('date', desde).order('id')),
    supabase.from('away_rules').select('*').eq('user_id', uid).then(ok),
    traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).gte('date', desde).order('created_at').order('id')),
    traerTodo(() => supabase.from('measurements').select('*').eq('user_id', uid).order('date')),
    supabase.from('recipe_prefs').select('*').eq('user_id', uid).then(ok),
    supabase.from('ai_analyses').select('*').eq('user_id', uid).gte('week_start', sumarDias(desde, -7)).then(ok),
  ])
  const ambito = hogar?.id ?? uid
  const [stock, preparado, lista, compras] = await Promise.all([
    supabase.from('stock').select('*').eq('user_id', ambito).then(ok),
    supabase.from('prepared').select('*').eq('user_id', ambito).then(ok),
    supabase.from('shopping_items').select('*').eq('user_id', ambito).then(ok),
    traerTodo(() => supabase.from('purchases').select('*').eq('user_id', ambito).gte('date', desde).order('id')),
  ])
  return {
    cargando: false,
    errorCarga: null,
    perfil: perfiles[0] || null,
    hogar,
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

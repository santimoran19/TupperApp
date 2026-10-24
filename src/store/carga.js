// La carga: todo lo del usuario, traído de Supabase de una vez.
import { hoy, sumarDias } from '../lib/fechas'
import { ok, supabase, traerTodo } from './base'

// Ejercicio y gimnasio (F-19, supabase/actualizacion-16.sql y -17.sql): solo se traen si la persona prendió el cálculo de gasto
const EJERCICIO_VACIO = {
  actividades: [], // catálogo de actividades (exercise_types): las base y las propias
  entrenamientos: [], // los últimos 365 días (workouts)
  ejerciciosGym: [], // catálogo de ejercicios de gimnasio (gym_exercises)
  rutinas: [],
  rutinaItems: [], // los ejercicios de cada rutina (routine_exercises)
  series: [], // las series de los últimos 365 días (workout_sets)
}

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
  combos: [], // "mi desayuno de siempre" (F-09, supabase/actualizacion-21.sql)
  categoriasPropias: [], // las categorías propias (F-13, supabase/actualizacion-23.sql)
  categoriaAlimento: [], // la categoría que eligió la persona para un alimento de la base (o de otro del hogar)
  ...EJERCICIO_VACIO,
}

// Los días de ejercicio que se traen hacia atrás (el gráfico de progreso y el récord personal salen de ahí)
export const DIAS_DE_EJERCICIO = 365

// Lo de ejercicio y gimnasio vive en tablas que se crean con las actualizaciones 16 y 17. Con una base a la que todavía no se
// le aplicaron, esas tablas no existen: se sigue sin ellas (como si la persona no hubiera cargado nada) en vez de trabar todo.
const FALTA_LA_TABLA = new Set(['PGRST205', '42P01', 'PGRST200'])
async function opcional(consulta) {
  try {
    return await consulta()
  } catch (err) {
    if (FALTA_LA_TABLA.has(err.codigo)) return []
    throw err
  }
}

// Lo de ejercicio y gimnasio de la persona. `dias`: cuántos días hacia atrás traer (null = todo el historial, para descargar los datos).
export async function traerEjercicio(uid, { dias = DIAS_DE_EJERCICIO } = {}) {
  const desde = dias == null ? null : sumarDias(hoy(), -dias)
  const desdeFecha = (consulta) => (desde ? consulta.gte('fecha', desde) : consulta)
  const [actividades, entrenamientos, ejerciciosGym, rutinas, series] = await Promise.all([
    opcional(() => traerTodo(() => supabase.from('exercise_types').select('*').order('id'))),
    opcional(() => traerTodo(() => desdeFecha(supabase.from('workouts').select('*').eq('user_id', uid)).order('fecha').order('id'))),
    opcional(() => traerTodo(() => supabase.from('gym_exercises').select('*').order('id'))),
    opcional(() => traerTodo(() => supabase.from('routines').select('*').eq('user_id', uid).order('created_at').order('id'))),
    opcional(() => traerTodo(() => desdeFecha(supabase.from('workout_sets').select('*').eq('user_id', uid)).order('fecha').order('id'))),
  ])
  const rutinaItems =
    rutinas.length === 0
      ? []
      : await opcional(() =>
          traerTodo(() =>
            supabase
              .from('routine_exercises')
              .select('*')
              .in(
                'routine_id',
                rutinas.map((r) => r.id),
              )
              .order('routine_id')
              .order('position'),
          ),
        )
  return { actividades, entrenamientos, ejerciciosGym, rutinas, rutinaItems, series }
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
  const [
    hogar,
    perfiles,
    alimentos,
    recetas,
    items,
    plan,
    reglas,
    registros,
    medidas,
    prefs,
    analisis,
    combos,
    categoriasPropias,
    categoriaAlimento,
  ] = await Promise.all([
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
    // Con una base sin la actualización 21 la tabla no existe: sin combos, como antes
    opcional(() => supabase.from('combos').select('*').eq('user_id', uid).order('created_at').then(ok)),
    // Con una base sin la actualización 23, sin categorías propias
    opcional(() => supabase.from('categorias').select('*').eq('user_id', uid).order('created_at').then(ok)),
    opcional(() => traerTodo(() => supabase.from('categoria_alimento').select('*').eq('user_id', uid).order('food_id'))),
  ])
  const ambito = hogar?.id ?? uid
  const [stock, preparado, lista, compras] = await Promise.all([
    supabase.from('stock').select('*').eq('user_id', ambito).then(ok),
    supabase.from('prepared').select('*').eq('user_id', ambito).then(ok),
    supabase.from('shopping_items').select('*').eq('user_id', ambito).then(ok),
    traerTodo(() => supabase.from('purchases').select('*').eq('user_id', ambito).gte('date', desde).order('id')),
  ])
  // Ejercicio y gimnasio, solo para quien prendió el cálculo de gasto (el resto no paga ese viaje)
  const perfil = perfiles[0] || null
  const ejercicio = perfil?.gasto_activo ? await traerEjercicio(uid) : EJERCICIO_VACIO
  return {
    ...ejercicio,
    cargando: false,
    errorCarga: null,
    perfil,
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
    combos,
    categoriasPropias,
    categoriaAlimento,
  }
}

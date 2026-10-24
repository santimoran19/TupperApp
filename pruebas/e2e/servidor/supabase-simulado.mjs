// Supabase simulado para las pruebas: acceso (auth), tablas (REST), funciones de la base (RPC) y un "modelo" de IA falso.
// Guarda todo en memoria y arranca con los alimentos y recetas de la base. No toca internet ni el proyecto real.
// Si Deno está instalado, además levanta las funciones `analizar-semana` y `entrar` de verdad para probarlas enteras.
import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { conAlcohol } from '../../../scripts/seed-data.mjs'
import { foodsTodos as foods, recipesTodas as recipes } from '../../../scripts/seed-sexta.mjs'
import { actividades } from '../../../scripts/ejercicio-data.mjs'
import { ejercicios as ejerciciosGym } from '../../../scripts/gym-data.mjs'

const PUERTO = 54321
// Las funciones de verdad, corriendo en Deno: cada una en su puerto
const FUNCIONES_REALES = { 'analizar-semana': 8000, entrar: 8001 }
const CLAVE_SERVICIO = 'service-role-de-prueba' // la que usa la función `entrar` para mirar usuarios, saltándose los permisos por fila
// Las funciones solo contestan a páginas permitidas (S-02): en las pruebas, la de la app. La prueba 21 llama a las funciones directo.
const ORIGEN_DE_LA_APP = 'http://localhost:5199'

const db = {
  profiles: [],
  foods: [],
  stock: [],
  recipes: [],
  recipe_items: [],
  prepared: [],
  plan: [],
  away_rules: [],
  log_entries: [],
  measurements: [],
  shopping_items: [],
  purchases: [],
  recipe_prefs: [],
  ai_analyses: [],
  eventos: [],
  // Los hogares (supabase/actualizacion-13.sql): no se leen ni se escriben directo, solo con las funciones
  hogares: [],
  hogar_miembros: [],
  // El catálogo compartido (supabase/actualizacion-14.sql): tampoco se lee ni se escribe directo
  catalogo: [],
  catalogo_aportes: [],
  // Gasto, ejercicio y gimnasio (supabase/actualizacion-15.sql a 17)
  exercise_types: [],
  workouts: [],
  gym_exercises: [],
  routines: [],
  routine_exercises: [],
  workout_sets: [],
  // Combos y opiniones (supabase/actualizacion-21.sql)
  combos: [],
  opiniones: [],
}
let numeroDeEvento = 0
// IA simulada: lo que recibió el "modelo" y cómo tiene que responder (ok | texto | error | saturado)
const ia = { pedidos: [], modo: 'ok' }
const RESPUESTA_IA = {
  resumen:
    'Registraste pocos días, así que el promedio dice poco. Los días cargados quedaste por debajo del objetivo de calorías y de proteína.',
  bien: ['Tomaste más de un litro de líquido el sábado.', 'Mantuviste el desayuno.'],
  ajustar: ['La proteína quedó en 66 g contra un objetivo de 120 g.', 'El almuerzo del sábado concentró más de la mitad de las calorías.'],
  acciones: [
    'Sumá una lata de atún o dos huevos al almuerzo.',
    'Dejá cocinado el pollo del plan para no pedir delivery.',
    'Anotá el peso una vez esta semana.',
  ],
}
const SIN_ID = new Set(['stock', 'recipe_items', 'prepared', 'away_rules', 'measurements', 'profiles', 'recipe_prefs', 'routine_exercises'])
const bySlug = new Map()
for (const f of foods) {
  const row = {
    id: randomUUID(),
    owner: null,
    slug: f[0],
    name: f[1],
    unit: f[2],
    unit_grams: f[3],
    unit_label: f[4],
    kcal: f[5],
    protein: f[6],
    carbs: f[7],
    fat: f[8],
    category: f[9],
    alcohol: conAlcohol.includes(f[0]),
  }
  db.foods.push(row)
  bySlug.set(f[0], row.id)
}
for (const r of recipes) {
  const id = randomUUID()
  db.recipes.push({
    id,
    owner: null,
    slug: r.slug,
    name: r.name,
    minutes: r.minutes,
    servings: r.servings,
    meal_types: r.meal_types,
    portable: r.portable,
    steps: r.steps,
  })
  for (const [s, q] of r.items) db.recipe_items.push({ recipe_id: id, food_id: bySlug.get(s), qty: q })
}

// Los catálogos de actividades físicas y de ejercicios de gimnasio (supabase/seed-6.sql y seed-7.sql)
for (const a of actividades)
  db.exercise_types.push({
    id: randomUUID(),
    owner: null,
    slug: a[0],
    name: a[1],
    category: a[2],
    metrica: a[3],
    mets_suave: a[4],
    mets_medio: a[5],
    mets_fuerte: a[6],
    usa_distancia: a[7],
    usa_desnivel: a[8],
  })
for (const e of ejerciciosGym)
  db.gym_exercises.push({ id: randomUUID(), owner: null, slug: e[0], name: e[1], grupo: e[2], equipo: e[3], peso_corporal: e[4] })

// ---------- Funciones de la base (las de supabase/actualizacion-7.sql, hechas a mano) ----------
// Las de verdad se prueban contra un Postgres real en pruebas/unidad/base-de-datos.test.js; acá alcanza con que
// se comporten igual para la app: todo junto o nada (si algo falla, la base vuelve a como estaba).
const errorPg = (code, message) => Object.assign(new Error(message), { pg: code })
const redondo = (n, decimales) => Math.round(n * 10 ** decimales) / 10 ** decimales
const entre = (n, max, decimales) => Math.min(max, Math.max(0, redondo(n, decimales)))
const ahora = () => new Date().toISOString()

// ---------- Hogares (supabase/actualizacion-13.sql). Las de verdad se prueban en pruebas/unidad/hogares.test.js ----------
const HOGAR_MAXIMO = 6
const miembroDe = (uid) => db.hogar_miembros.find((m) => m.user_id === uid)
// De quién son la despensa, la lista de compras, las comidas preparadas y las compras: del hogar si la persona está en uno
const ambito = (uid) => miembroDe(uid)?.hogar_id ?? uid
// Las personas cuyos alimentos y recetas propios se ven: ella y las de su hogar
const companeros = (uid) => {
  const m = miembroDe(uid)
  return m ? db.hogar_miembros.filter((x) => x.hogar_id === m.hogar_id).map((x) => x.user_id) : [uid]
}
const puedeVer = (dueno, uid) => dueno === null || companeros(uid).includes(dueno)
const DEL_AMBITO = ['stock', 'prepared', 'shopping_items', 'purchases']

function codigoNuevo() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let c
  do c = Array.from({ length: 6 }, () => alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('')
  while (db.hogares.some((h) => h.codigo === c))
  return c
}

function miHogar(uid) {
  const m = miembroDe(uid)
  if (!m) return null
  const h = db.hogares.find((x) => x.id === m.hogar_id)
  return {
    id: h.id,
    nombre: h.nombre,
    codigo: m.rol === 'creador' ? h.codigo : null,
    soy_creador: m.rol === 'creador',
    maximo: HOGAR_MAXIMO,
    miembros: db.hogar_miembros
      .filter((x) => x.hogar_id === h.id)
      .map((x) => {
        const p = db.profiles.find((q) => q.id === x.user_id)
        return { id: x.user_id, nombre: p?.name ?? '', usuario: p?.username ?? null, creador: x.rol === 'creador', desde: x.desde }
      }),
  }
}

// Suma lo de una persona a la despensa del hogar (lo suyo no se toca)
function hogarSumar(uid, hogar) {
  for (const s of db.stock.filter((x) => x.user_id === uid)) {
    const h = db.stock.find((x) => x.user_id === hogar && x.food_id === s.food_id)
    if (h) {
      h.qty = entre(Number(h.qty) + Number(s.qty), 1000000, 2)
      // Queda la fecha que vence antes (actualizacion-19.sql)
      if (s.expires_on && (!h.expires_on || s.expires_on < h.expires_on)) h.expires_on = s.expires_on
      sinFechaSiAgotado(h)
    } else
      db.stock.push(
        sinFechaSiAgotado({ user_id: hogar, food_id: s.food_id, qty: s.qty, expires_on: s.expires_on ?? null, updated_at: ahora() }),
      )
  }
  for (const l of db.shopping_items.filter((x) => x.user_id === uid)) {
    const h = db.shopping_items.find((x) => x.user_id === hogar && x.food_id === l.food_id)
    if (h) h.qty = Math.max(Number(h.qty), Number(l.qty))
    else db.shopping_items.push({ id: randomUUID(), user_id: hogar, food_id: l.food_id, qty: l.qty, created_at: ahora() })
  }
  for (const p of db.prepared.filter((x) => x.user_id === uid && Number(x.portions) > 0)) {
    const h = db.prepared.find((x) => x.user_id === hogar && x.recipe_id === p.recipe_id)
    if (h) h.portions = entre(Number(h.portions) + Number(p.portions), 1000, 1)
    else db.prepared.push({ user_id: hogar, recipe_id: p.recipe_id, portions: p.portions })
  }
  const desde = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10)
  for (const c of db.purchases.filter((x) => x.user_id === uid && x.date >= desde)) {
    const repetida = db.purchases.some(
      (h) =>
        h.user_id === hogar && h.food_id === c.food_id && h.name === c.name && h.qty === c.qty && h.price === c.price && h.date === c.date,
    )
    if (!repetida) db.purchases.push({ ...c, id: randomUUID(), user_id: hogar, comprado_por: null })
  }
}

// Lo que se lleva quien se va: una copia de lo del hogar (sin lo que apunta a alimentos o recetas de otras personas)
function hogarLlevarse(uid, hogar) {
  const alimentoPropio = (id) => {
    const f = db.foods.find((x) => x.id === id)
    return !!f && (f.owner === null || f.owner === uid)
  }
  const recetaPropia = (id) => {
    const r = db.recipes.find((x) => x.id === id)
    return !!r && (r.owner === null || r.owner === uid)
  }
  const delHogar = (tabla) => db[tabla].filter((x) => x.user_id === hogar)
  for (const t of ['stock', 'shopping_items', 'prepared']) db[t] = db[t].filter((x) => x.user_id !== uid)
  for (const x of delHogar('stock')) if (alimentoPropio(x.food_id)) db.stock.push({ ...x, user_id: uid, updated_at: ahora() })
  for (const x of delHogar('shopping_items'))
    if (alimentoPropio(x.food_id)) db.shopping_items.push({ ...x, id: randomUUID(), user_id: uid })
  for (const x of delHogar('prepared')) if (recetaPropia(x.recipe_id)) db.prepared.push({ ...x, user_id: uid })
  for (const c of delHogar('purchases').filter((x) => x.comprado_por === uid))
    db.purchases.push({ ...c, id: randomUUID(), user_id: uid, comprado_por: null, food_id: alimentoPropio(c.food_id) ? c.food_id : null })
  // Lo que es de ella sale del hogar
  const suyos = new Set(db.foods.filter((f) => f.owner === uid).map((f) => f.id))
  const suyas = new Set(db.recipes.filter((r) => r.owner === uid).map((r) => r.id))
  db.stock = db.stock.filter((x) => !(x.user_id === hogar && suyos.has(x.food_id)))
  db.shopping_items = db.shopping_items.filter((x) => !(x.user_id === hogar && suyos.has(x.food_id)))
  db.prepared = db.prepared.filter((x) => !(x.user_id === hogar && suyas.has(x.recipe_id)))
  for (const c of db.purchases) if (c.user_id === hogar && suyos.has(c.food_id)) c.food_id = null
}

// Saca a una persona del hogar. Si era la última, el hogar se borra con su despensa; si era quien lo armó, pasa a la que lleva más tiempo.
function dejarElHogar(uid) {
  const m = miembroDe(uid)
  if (!m) return
  db.hogar_miembros = db.hogar_miembros.filter((x) => x !== m)
  const quedan = db.hogar_miembros.filter((x) => x.hogar_id === m.hogar_id)
  if (quedan.length === 0) {
    db.hogares = db.hogares.filter((h) => h.id !== m.hogar_id)
    for (const t of DEL_AMBITO) db[t] = db[t].filter((x) => x.user_id !== m.hogar_id)
  } else if (m.rol === 'creador') quedan[0].rol = 'creador'
}

// Como el disparador de actualizacion-19.sql: lo agotado no tiene fecha de vencimiento
function sinFechaSiAgotado(fila) {
  if (fila.expires_on === undefined || Number(fila.qty) <= 0) fila.expires_on = null
  return fila
}

function moverStock(uid, cambios, soloSiExiste = false) {
  const juntos = new Map()
  for (const c of Array.isArray(cambios) ? cambios : []) juntos.set(c.food_id, (juntos.get(c.food_id) || 0) + Number(c.delta))
  const tocadas = []
  const dueno = ambito(uid)
  for (const [food_id, delta] of juntos) {
    let fila = db.stock.find((s) => s.user_id === dueno && s.food_id === food_id)
    if (fila) fila.qty = entre(Number(fila.qty) + delta, 1000000, 2)
    else if (soloSiExiste) continue
    else {
      if (!db.foods.some((f) => f.id === food_id))
        throw errorPg('23503', 'insert or update on table "stock" violates foreign key constraint "stock_food_id_fkey"')
      fila = { user_id: dueno, food_id, qty: entre(delta, 1000000, 2) }
      db.stock.push(fila)
    }
    fila.updated_at = ahora()
    sinFechaSiAgotado(fila)
    tocadas.push(fila)
  }
  return tocadas
}

// Claves de los pedidos ya atendidos: el mismo pedido dos veces se aplica una sola
const atendidos = new Set()
function repetido(uid, clave) {
  if (!clave) return false
  const k = uid + '|' + clave
  if (atendidos.has(k)) return true
  atendidos.add(k)
  return false
}

// El nombre de usuario como lo cuida la base (supabase/actualizacion-12.sql), con una lista corta de reservados
const RESERVADOS_DE_PRUEBA = ['admin', 'root', 'tupper', 'soporte', 'null', 'postgres']
function validarUsuario(u) {
  if (u.length < 3) return 'El usuario tiene que tener al menos 3 caracteres.'
  if (u.length > 20) return 'El usuario puede tener como mucho 20 caracteres.'
  if (!/^[a-z0-9][a-z0-9._-]*[a-z0-9]$/.test(u) || /[._-]{2}/.test(u) || !/[a-z]/.test(u))
    return 'El usuario solo puede llevar letras sin tilde, números, punto, guion y guion bajo, y tiene que empezar y terminar con una letra o un número.'
  if (RESERVADOS_DE_PRUEBA.some((r) => u === r || u.includes('tupper') || u.includes('admin')))
    return 'Ese usuario no está disponible. Probá con otro.'
  return null
}
// Lo que hace la base al guardar un perfil con usuario: pasarlo a minúsculas, validarlo (solo si cambió) y no repetirlo
function cuidarUsuario(fila, anterior, uid) {
  if (!('username' in fila)) return
  fila.username =
    String(fila.username ?? '')
      .trim()
      .toLowerCase() || null
  if (fila.username === null || fila.username === anterior?.username) return
  const mensaje = validarUsuario(fila.username)
  if (mensaje) throw errorPg('P0001', mensaje)
  if (db.profiles.some((p) => p.username === fila.username && p.id !== (anterior?.id ?? uid)))
    throw errorPg('23505', 'duplicate key value violates unique constraint "profiles_username_key"')
}

// El catálogo compartido: lo mismo que hacen las funciones de actualizacion-14.sql
const CATALOGO_MINIMO = 2
const sinTildes = (t) =>
  String(t ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
const coinciden = (a, b) =>
  a.unit === b.unit &&
  Math.abs(a.kcal - b.kcal) <= Math.max(15, 0.1 * Math.max(a.kcal, b.kcal)) &&
  Math.abs(a.protein - b.protein) <= 2 &&
  Math.abs(a.carbs - b.carbs) <= 3 &&
  Math.abs(a.fat - b.fat) <= 2
const sinCamposInternos = (c) => ({
  clave: c.clave,
  codigo: c.codigo,
  name: c.name,
  detalle: c.detalle,
  unit: c.unit,
  kcal: c.kcal,
  protein: c.protein,
  carbs: c.carbs,
  fat: c.fat,
  category: c.category,
  alcohol: c.alcohol,
  confirmaciones: c.confirmaciones,
})

// ---------- Ejercicio y gimnasio (supabase/actualizacion-16.sql y 17). Las de verdad se prueban en pruebas/unidad/gasto-base.test.js ----------
const aNumero = (v) => (v === '' || v === null || v === undefined ? null : Number(v))
const checkPg = (nombre) => errorPg('23514', `new row violates check constraint "${nombre}"`)

const guardarEntrenamiento = (uid, a) => {
  const d = a.p_datos
  const series = a.p_series ?? []
  if (!a.p_id || !d || typeof d !== 'object' || Array.isArray(d)) throw errorPg('P0001', 'Los datos del entrenamiento no son válidos.')
  if (!Array.isArray(series) || series.length > 500) throw errorPg('P0001', 'Las series no son válidas (hasta 500 por sesión).')
  if (!db.profiles.some((p) => p.id === uid && p.gasto_activo))
    throw errorPg('P0001', 'Para anotar ejercicio primero activá el cálculo de gasto en tu perfil.')
  const tipo = db.exercise_types.some((t) => t.id === d.type_id && (t.owner === null || t.owner === uid)) ? d.type_id : null
  const rutina = db.routines.some((r) => r.id === d.routine_id && r.user_id === uid) ? d.routine_id : null
  if (!(Number(d.duration_min) >= 1 && Number(d.duration_min) <= 1440)) throw checkPg('workouts_duracion_chk')
  if (!(Number(d.kcal) >= 0 && Number(d.kcal) <= 20000)) throw checkPg('workouts_kcal_chk')
  if (!String(d.name ?? '').trim()) throw checkPg('workouts_nombre_chk')
  const campos = {
    fecha: d.fecha,
    type_id: tipo,
    name: String(d.name).trim(),
    duration_min: Math.round(Number(d.duration_min)),
    distance_km: aNumero(d.distance_km),
    ascent_m: aNumero(d.ascent_m),
    avg_hr: aNumero(d.avg_hr),
    rpe: aNumero(d.rpe),
    kcal_watch: aNumero(d.kcal_watch),
    watch_activas: d.watch_activas === true || d.watch_activas === 'true',
    kcal: Number(d.kcal),
    metodo: d.metodo || 'mets',
    peso_kg: aNumero(d.peso_kg),
    notes: String(d.notes ?? '').trim() || null,
    routine_id: rutina,
  }
  // Los músculos marcados (actualizacion-19.sql): solo grupos conocidos; si el pedido no los trae, quedan los que había
  const GRUPOS = [
    'pecho',
    'espalda',
    'hombros',
    'biceps',
    'triceps',
    'antebrazos',
    'abdomen',
    'cuadriceps',
    'isquios',
    'gluteos',
    'pantorrillas',
    'cuerpo_completo',
  ]
  if ('muscles' in d) {
    if (!Array.isArray(d.muscles) || d.muscles.length > 12 || d.muscles.some((x) => !GRUPOS.includes(x)))
      throw checkPg('workouts_musculos_chk')
    campos.muscles = [...new Set(d.muscles)]
  }
  let fila = db.workouts.find((w) => w.id === a.p_id)
  if (fila && fila.user_id !== uid) throw errorPg('P0001', 'Ese entrenamiento no se puede editar.')
  if (fila) Object.assign(fila, campos)
  else {
    fila = { id: a.p_id, user_id: uid, muscles: [], ...campos, created_at: ahora() }
    db.workouts.push(fila)
  }
  // Las series se reemplazan por las que llegan
  db.workout_sets = db.workout_sets.filter((s) => !(s.workout_id === a.p_id && s.user_id === uid))
  const vistas = new Set()
  for (const x of series) {
    if (!db.gym_exercises.some((e) => e.id === x.exercise_id && (e.owner === null || e.owner === uid)))
      throw errorPg('P0001', 'Hay un ejercicio que ya no existe.')
    const clave = `${x.orden}|${x.set_no}`
    if (vistas.has(clave)) throw errorPg('23505', 'duplicate key value violates unique constraint "workout_sets_unica_chk"')
    vistas.add(clave)
    db.workout_sets.push({
      id: randomUUID(),
      user_id: uid,
      workout_id: a.p_id,
      fecha: fila.fecha,
      orden: x.orden,
      exercise_id: x.exercise_id,
      set_no: x.set_no,
      reps: x.reps,
      weight_kg: Number(x.weight_kg) || 0,
      rpe: aNumero(x.rpe),
      warmup: !!x.warmup,
    })
  }
  return {
    entrenamiento: fila,
    series: db.workout_sets.filter((s) => s.workout_id === a.p_id).sort((p, q) => p.orden - q.orden || p.set_no - q.set_no),
  }
}

const guardarRutina = (uid, a) => {
  const lista = a.p_ejercicios
  if (!a.p_id || !Array.isArray(lista) || lista.length > 40) throw errorPg('P0001', 'La rutina no es válida (hasta 40 ejercicios).')
  const nombre = String(a.p_nombre ?? '').trim()
  if (nombre.length < 1 || nombre.length > 40) throw errorPg('P0001', 'El nombre de la rutina tiene que tener entre 1 y 40 letras.')
  if (lista.some((x) => !db.gym_exercises.some((e) => e.id === x.exercise_id && (e.owner === null || e.owner === uid))))
    throw errorPg('P0001', 'Hay un ejercicio que ya no existe.')
  let fila = db.routines.find((r) => r.id === a.p_id)
  if (fila && fila.user_id !== uid) throw errorPg('P0001', 'Esa rutina no se puede editar.')
  const notas = String(a.p_notas ?? '').trim() || null
  if (fila) Object.assign(fila, { name: nombre, notes: notas })
  else {
    fila = { id: a.p_id, user_id: uid, name: nombre, notes: notas, created_at: ahora() }
    db.routines.push(fila)
  }
  db.routine_exercises = db.routine_exercises.filter((i) => i.routine_id !== a.p_id)
  lista.forEach((x, i) => {
    const reps_min = x.reps_min ?? 8
    const reps_max = x.reps_max ?? 12
    if (reps_min > reps_max) throw checkPg('routine_exercises_reps_chk')
    db.routine_exercises.push({
      routine_id: a.p_id,
      position: i,
      exercise_id: x.exercise_id,
      sets_target: x.sets_target ?? 3,
      reps_min,
      reps_max,
      rest_seconds: aNumero(x.rest_seconds),
    })
  })
  return { rutina: fila, ejercicios: db.routine_exercises.filter((i) => i.routine_id === a.p_id).sort((p, q) => p.position - q.position) }
}

const FUNCIONES = {
  guardar_entrenamiento: guardarEntrenamiento,
  guardar_rutina: guardarRutina,
  catalogo_aportar: (uid, a) => {
    const codigo = String(a.p_codigo ?? '').trim() || null
    const name = String(a.p_name ?? '').trim()
    if (codigo && !/^\d{8,14}$/.test(codigo)) throw errorPg('P0001', 'El código de barras no es válido.')
    if (name.length < 1 || name.length > 60) throw errorPg('P0001', 'El nombre no es válido.')
    if (a.p_unit !== 'g' && a.p_unit !== 'ml') throw errorPg('P0001', 'Solo se comparten productos medidos en gramos o mililitros.')
    const n = { kcal: Number(a.p_kcal), protein: Number(a.p_protein) || 0, carbs: Number(a.p_carbs) || 0, fat: Number(a.p_fat) || 0 }
    if (!(n.kcal >= 0 && n.kcal <= 900) || [n.protein, n.carbs, n.fat].some((x) => x < 0 || x > 100) || n.protein + n.carbs + n.fat > 100.5)
      throw errorPg('P0001', 'Los valores del producto no son válidos.')
    const clave = codigo || 'n:' + sinTildes(name)
    const mio = db.catalogo_aportes.find((x) => x.clave === clave && x.user_id === uid)
    const nuevo = {
      clave,
      user_id: uid,
      codigo,
      name,
      detalle: String(a.p_detalle ?? '').slice(0, 40) || null,
      unit: a.p_unit,
      ...n,
      category: String(a.p_category),
      alcohol: !!a.p_alcohol,
    }
    const publicado = db.catalogo.find((x) => x.clave === clave)
    if (publicado) {
      if (!mio && coinciden(publicado, nuevo)) {
        db.catalogo_aportes.push({ ...nuevo, name: publicado.name })
        publicado.confirmaciones++
      }
      return true
    }
    if (mio) Object.assign(mio, nuevo)
    else db.catalogo_aportes.push(nuevo)
    const propio = db.catalogo_aportes.find((x) => x.clave === clave && x.user_id === uid)
    const iguales = 1 + db.catalogo_aportes.filter((x) => x.clave === clave && x.user_id !== uid && coinciden(x, propio)).length
    if (iguales < CATALOGO_MINIMO) return false
    db.catalogo.push({ ...sinCamposInternos(propio), confirmaciones: iguales })
    return true
  },
  catalogo_por_codigo: (uid, a) =>
    db.catalogo.filter((c) => c.codigo && c.clave === String(a.p_codigo ?? '').trim()).map(sinCamposInternos),
  catalogo_buscar: (uid, a) => {
    const q = sinTildes(a.p_texto)
    if (q.length < 3) return []
    return db.catalogo
      .filter((c) => sinTildes(c.name).includes(q))
      .sort((x, y) => y.confirmaciones - x.confirmaciones || x.name.localeCompare(y.name, 'es'))
      .slice(0, 20)
      .map(sinCamposInternos)
  },
  usuario_disponible: (uid, a) => {
    const u = String(a.p_usuario ?? '')
      .trim()
      .toLowerCase()
    return !db.profiles.some((p) => p.username === u && p.id !== uid)
  },

  mover_stock: (uid, a) => moverStock(uid, a.p_cambios, a.p_solo_si_existe),

  cocinar(uid, a) {
    if (!(a.p_porciones > 0 && a.p_porciones <= 1000)) throw errorPg('P0001', 'La cantidad de porciones no es válida.')
    if (repetido(uid, a.p_clave)) return { repetida: true }
    const dueno = ambito(uid)
    const stock = moverStock(uid, a.p_stock)
    if (!db.recipes.some((r) => r.id === a.p_receta))
      throw errorPg('23503', 'insert or update on table "prepared" violates foreign key constraint')
    let fila = db.prepared.find((p) => p.user_id === dueno && p.recipe_id === a.p_receta)
    if (fila) fila.portions = Math.min(1000, entre(Number(fila.portions) + a.p_porciones, 1000, 1))
    else {
      fila = { user_id: dueno, recipe_id: a.p_receta, portions: entre(a.p_porciones, 1000, 1) }
      db.prepared.push(fila)
    }
    return { stock, preparado: fila }
  },

  registrar_comida(uid, a) {
    if (!Array.isArray(a.p_filas) || a.p_filas.length === 0) throw errorPg('P0001', 'No hay nada para registrar.')
    if (!['desayuno', 'almuerzo', 'merienda', 'cena', 'extra'].includes(a.p_comida))
      throw errorPg('23514', 'new row for relation "log_entries" violates check constraint "log_entries_meal_check"')
    if (repetido(uid, a.p_clave)) return { repetida: true }
    const dueno = ambito(uid)
    db.log_entries = db.log_entries.filter((l) => !(l.user_id === uid && l.date === a.p_fecha && l.meal === a.p_comida && l.skipped))
    const tocadas = new Set()
    const listas = new Set()
    const registros = a.p_filas.map((f) => {
      if (!(f.qty >= 0) || !(Number(f.kcal || 0) <= 20000))
        throw errorPg('23514', 'new row for relation "log_entries" violates check constraint "log_entries_valores_chk"')
      // Desde la 1.10 cada fila trae lo que quiere descontar (`s` y `p`): se descuenta de lo que hay y se anota lo que salió
      let descontado = null
      if (f.s !== undefined || f.p !== undefined) {
        descontado = { s: [], p: 0, pn: 0 }
        for (const x of f.s || []) {
          const fila = db.stock.find((s) => s.user_id === dueno && s.food_id === x.f)
          if (!fila) continue
          const toma = redondo(Math.min(Number(x.q), Number(fila.qty)), 2)
          if (toma > 0) {
            fila.qty = entre(Number(fila.qty) - toma, 1000000, 2)
            fila.updated_at = ahora()
            tocadas.add(fila)
          }
          descontado.s.push({ f: x.f, q: toma, n: redondo(Number(x.q), 2) })
        }
        const lista = f.recipe_id && Number(f.p) > 0 ? db.prepared.find((q) => q.user_id === dueno && q.recipe_id === f.recipe_id) : null
        if (lista) {
          descontado.p = redondo(Math.min(Number(f.p), Number(lista.portions)), 1)
          descontado.pn = redondo(Number(f.p), 1)
          lista.portions = entre(Number(lista.portions) - descontado.p, 1000, 1)
          if (descontado.p > 0) listas.add(lista)
        }
      }
      return {
        id: randomUUID(),
        user_id: uid,
        date: a.p_fecha,
        meal: a.p_comida,
        name: f.name,
        food_id: f.food_id ?? null,
        recipe_id: f.recipe_id ?? null,
        qty: f.qty,
        kcal: f.kcal ?? 0,
        protein: f.protein ?? 0,
        carbs: f.carbs ?? 0,
        fat: f.fat ?? 0,
        skipped: false,
        descontado,
        created_at: ahora(),
      }
    })
    db.log_entries.push(...registros)
    const stock = [...tocadas, ...moverStock(uid, a.p_stock, true)]
    const preparado = [...listas]
    for (const c of Array.isArray(a.p_preparado) ? a.p_preparado : []) {
      const fila = db.prepared.find((p) => p.user_id === dueno && p.recipe_id === c.recipe_id)
      if (!fila) continue
      fila.portions = entre(Number(fila.portions) + Number(c.delta), 1000, 1)
      preparado.push(fila)
    }
    return { registros, stock, preparado }
  },

  // Cambiar la cantidad de un registro (supabase/actualizacion-9.sql). Las de verdad se prueban en editar-registros.test.js.
  editar_registro(uid, a) {
    const r = db.log_entries.find((l) => l.id === a.p_id && l.user_id === uid)
    const dueno = ambito(uid)
    if (!r) throw errorPg('P0001', 'Ese registro ya no existe.')
    const qty = redondo(Number(a.p_qty), 2)
    if (!(qty > 0 && qty <= 1000000)) throw errorPg('P0001', 'La cantidad no es válida.')
    if (r.skipped || Number(r.qty) <= 0) throw errorPg('P0001', 'Ese registro no se puede editar.')
    if (Number(r.qty) === qty) return { registro: r, stock: [], preparado: [], avisos: { sin_datos: false } }
    const razon = qty / Number(r.qty)
    if (Number(r.kcal) * razon > 20000) throw errorPg('P0001', 'Esa cantidad tiene demasiadas calorías.')
    const stock = []
    const preparado = []
    let descontado = null
    if (r.descontado) {
      descontado = { s: [], p: 0, pn: 0 }
      for (const x of r.descontado.s) {
        const objetivo = redondo(Number(x.n ?? x.q) * razon, 2)
        let hecho = Number(x.q)
        const fila = db.stock.find((s) => s.user_id === dueno && s.food_id === x.f)
        if (objetivo > hecho) {
          if (fila) {
            const toma = redondo(Math.min(objetivo - hecho, Number(fila.qty)), 2)
            fila.qty = entre(Number(fila.qty) - toma, 1000000, 2)
            stock.push(fila)
            hecho = redondo(hecho + toma, 2)
          }
        } else if (objetivo < hecho) {
          if (fila) {
            fila.qty = entre(Number(fila.qty) + (hecho - objetivo), 1000000, 2)
            stock.push(fila)
          }
          hecho = objetivo
        }
        descontado.s.push({ f: x.f, q: hecho, n: objetivo })
      }
      let p = Number(r.descontado.p) || 0
      const pn = Number(r.descontado.pn ?? p) || 0
      if (pn > 0 && r.recipe_id) {
        const objetivo = redondo(pn * razon, 1)
        const lista = db.prepared.find((q) => q.user_id === dueno && q.recipe_id === r.recipe_id)
        if (objetivo > p && lista) {
          const toma = redondo(Math.min(objetivo - p, Number(lista.portions)), 1)
          lista.portions = entre(Number(lista.portions) - toma, 1000, 1)
          p = redondo(p + toma, 1)
          preparado.push(lista)
        } else if (objetivo < p) {
          if (lista) {
            lista.portions = entre(Number(lista.portions) + (p - objetivo), 1000, 1)
            preparado.push(lista)
          }
          p = objetivo
        }
        descontado.pn = objetivo
      }
      descontado.p = p
    }
    Object.assign(r, {
      qty,
      kcal: redondo(Number(r.kcal) * razon, 4),
      protein: redondo(Number(r.protein) * razon, 4),
      carbs: redondo(Number(r.carbs) * razon, 4),
      fat: redondo(Number(r.fat) * razon, 4),
      descontado,
    })
    return { registro: r, stock, preparado, avisos: { sin_datos: !descontado } }
  },

  borrar_registro(uid, a) {
    const r = db.log_entries.find((l) => l.id === a.p_id && l.user_id === uid)
    const dueno = ambito(uid)
    const stock = []
    const preparado = []
    if (r?.descontado) {
      for (const x of r.descontado.s) {
        const fila = db.stock.find((s) => s.user_id === dueno && s.food_id === x.f)
        if (!fila) continue
        fila.qty = entre(Number(fila.qty) + Number(x.q), 1000000, 2)
        stock.push(fila)
      }
      const lista =
        Number(r.descontado.p) > 0 && r.recipe_id ? db.prepared.find((p) => p.user_id === dueno && p.recipe_id === r.recipe_id) : null
      if (lista) {
        lista.portions = entre(Number(lista.portions) + Number(r.descontado.p), 1000, 1)
        preparado.push(lista)
      }
    }
    db.log_entries = db.log_entries.filter((l) => l !== r)
    return { id: a.p_id, stock, preparado, avisos: {} }
  },

  comprar(uid, a) {
    const alimento = db.foods.find((f) => f.id === a.p_alimento && puedeVer(f.owner, uid))
    if (!alimento) throw errorPg('P0001', 'Ese alimento ya no existe.')
    if (!(a.p_cantidad > 0 && a.p_cantidad <= 1000000))
      throw errorPg('23514', 'new row for relation "purchases" violates check constraint "purchases_qty_chk"')
    if (repetido(uid, a.p_clave)) return { repetida: true }
    const dueno = ambito(uid)
    const compra = {
      id: randomUUID(),
      user_id: dueno,
      comprado_por: dueno !== uid ? uid : null,
      food_id: alimento.id,
      name: alimento.name,
      qty: a.p_cantidad,
      price: a.p_precio ?? 0,
      date: a.p_fecha || ahora().slice(0, 10),
    }
    db.purchases.push(compra)
    const stock = moverStock(uid, [{ food_id: alimento.id, delta: a.p_cantidad }])
    const mias = db.shopping_items.filter((l) => l.user_id === dueno)
    const anotada = mias.find((l) => l.food_id === a.p_anotado) || mias.find((l) => l.food_id === a.p_alimento)
    if (anotada) db.shopping_items = db.shopping_items.filter((l) => l !== anotada)
    return { compra, stock, lista: anotada ? anotada.id : null }
  },

  guardar_receta(uid, a) {
    if (!Array.isArray(a.p_items) || a.p_items.length === 0) throw errorPg('P0001', 'Agregá al menos un ingrediente.')
    const d = a.p_datos || {}
    const datos = {
      name: d.name,
      minutes: d.minutes,
      servings: d.servings,
      meal_types: d.meal_types || [],
      portable: d.portable ?? true,
      steps: d.steps || '',
    }
    let receta
    if (a.p_id) {
      receta = db.recipes.find((r) => r.id === a.p_id && r.owner === uid)
      if (!receta) throw errorPg('P0001', 'Esa receta no se puede editar.')
      Object.assign(receta, datos)
      db.recipe_items = db.recipe_items.filter((i) => i.recipe_id !== receta.id)
    } else {
      receta = { id: randomUUID(), owner: uid, slug: null, ...datos }
      db.recipes.push(receta)
    }
    const items = a.p_items.map((i) => {
      if (!(i.qty > 0)) throw errorPg('23514', 'new row for relation "recipe_items" violates check constraint "recipe_items_qty_check"')
      if (!db.foods.some((f) => f.id === i.food_id))
        throw errorPg('23503', 'insert or update on table "recipe_items" violates foreign key constraint')
      return { recipe_id: receta.id, food_id: i.food_id, qty: i.qty }
    })
    db.recipe_items.push(...items)
    return { receta, items }
  },

  despensa_de: (uid) => ambito(uid),
  mi_hogar: (uid) => miHogar(uid),

  crear_hogar(uid, a) {
    const nombre = String(a.p_nombre ?? '').trim()
    if (nombre.length < 1 || nombre.length > 40) throw errorPg('P0001', 'El nombre del hogar tiene que tener entre 1 y 40 letras.')
    if (miembroDe(uid)) throw errorPg('P0001', 'Ya estás en un hogar. Salí de ese antes de armar otro.')
    const hogar = { id: randomUUID(), nombre, codigo: codigoNuevo(), created_at: ahora() }
    db.hogares.push(hogar)
    db.hogar_miembros.push({ user_id: uid, hogar_id: hogar.id, rol: 'creador', desde: ahora() })
    hogarSumar(uid, hogar.id)
    return miHogar(uid)
  },

  unirse_al_hogar(uid, a) {
    const codigo = String(a.p_codigo ?? '')
      .trim()
      .toUpperCase()
    if (miembroDe(uid)) throw errorPg('P0001', 'Ya estás en un hogar. Salí de ese antes de unirte a otro.')
    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(codigo)) return { ok: false, error: 'Ese código no es válido: tiene 6 letras o números.' }
    const hogar = db.hogares.find((h) => h.codigo === codigo)
    if (!hogar) return { ok: false, error: 'No encontramos ese código. Revisalo con quien te invitó: puede que lo hayan cambiado.' }
    if (db.hogar_miembros.filter((m) => m.hogar_id === hogar.id).length >= HOGAR_MAXIMO)
      throw errorPg('P0001', `Ese hogar ya está completo (hasta ${HOGAR_MAXIMO} personas).`)
    db.hogar_miembros.push({ user_id: uid, hogar_id: hogar.id, rol: 'miembro', desde: ahora() })
    hogarSumar(uid, hogar.id)
    return { ok: true }
  },

  salir_del_hogar(uid) {
    const m = miembroDe(uid)
    if (!m) throw errorPg('P0001', 'No estás en ningún hogar.')
    hogarLlevarse(uid, m.hogar_id)
    dejarElHogar(uid)
    return null
  },

  sacar_del_hogar(uid, a) {
    const yo = miembroDe(uid)
    if (yo?.rol !== 'creador') throw errorPg('P0001', 'Solo quien armó el hogar puede sacar a otras personas.')
    if (a.p_usuario === uid) throw errorPg('P0001', 'Para irte del hogar usá "Salir del hogar".')
    const otra = db.hogar_miembros.find((m) => m.user_id === a.p_usuario && m.hogar_id === yo.hogar_id)
    if (!otra) throw errorPg('P0001', 'Esa persona ya no está en tu hogar.')
    hogarLlevarse(otra.user_id, otra.hogar_id)
    dejarElHogar(otra.user_id)
    return null
  },

  renovar_codigo(uid, a) {
    const yo = miembroDe(uid)
    if (yo?.rol !== 'creador') throw errorPg('P0001', 'Solo quien armó el hogar puede cambiar el código.')
    const hogar = db.hogares.find((h) => h.id === yo.hogar_id)
    hogar.codigo = a.p_apagar ? null : codigoNuevo()
    return hogar.codigo
  },

  renombrar_hogar(uid, a) {
    const yo = miembroDe(uid)
    if (yo?.rol !== 'creador') throw errorPg('P0001', 'Solo quien armó el hogar puede cambiarle el nombre.')
    const nombre = String(a.p_nombre ?? '').trim()
    if (nombre.length < 1 || nombre.length > 40) throw errorPg('P0001', 'El nombre del hogar tiene que tener entre 1 y 40 letras.')
    db.hogares.find((h) => h.id === yo.hogar_id).nombre = nombre
    return null
  },
}

const users = new Map() // email -> {id, email, password, confirmado}
const mails = [] // mails "enviados"
const verificaciones = []
const captchasUsados = new Set() // cada comprobación de "no soy un robot" sirve una sola vez
const ultimoMail = new Map() // email -> cuándo se le mandó el último mail de recuperación o de confirmación
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
function sesion(u) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const token = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: u.id, email: u.email, role: 'authenticated', exp })}.ZmlybWE`
  const user = {
    id: u.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: u.email,
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
  }
  return { access_token: token, token_type: 'bearer', expires_in: 3600, expires_at: exp, refresh_token: 'r-' + u.id, user }
}
function uidDe(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '')
  try {
    return JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString()).sub
  } catch {
    return null
  }
}

const esServicio = (req) => (req.headers.authorization || '') === 'Bearer ' + CLAVE_SERVICIO

function filtros(url) {
  const fs = []
  for (const [k, v] of url.searchParams) {
    if (['select', 'on_conflict', 'order', 'limit', 'offset', 'columns'].includes(k)) continue
    const [op, ...resto] = v.split('.')
    fs.push({ k, op, val: resto.join('.') })
  }
  return (row) =>
    fs.every(({ k, op, val }) => {
      const x = row[k] === null || row[k] === undefined ? null : String(row[k])
      if (op === 'eq') return x === val
      if (op === 'gte') return x >= val
      if (op === 'lte') return x <= val
      if (op === 'is') return val === 'null' ? x === null : x !== null
      if (op === 'in')
        return val
          .replace(/^\(|\)$/g, '')
          .split(',')
          .map((t) => t.replace(/^"|"$/g, ''))
          .includes(x)
      throw new Error('op no soportado ' + op)
    })
}

// ---------- Storage: el lugar "fotos" (actualizacion-19.sql) ----------
// Público para ver; cada persona sube y borra solo en u/<su id>/. Hasta 300 KB, solo WebP o JPEG.
const FOTO_VALIDA = /^(base\/[a-z0-9-]{1,80}|u\/[0-9a-f-]{36}\/[a-z0-9-]{1,80})\.(webp|jpg)$/
const fotos = new Map() // ruta -> { tipo, bytes }
function storage(req, url, cuerpo, send, res, cors) {
  let bytes = cuerpo
  const partes = url.pathname.replace('/storage/v1/', '').split('/')
  // Ver una foto: GET /storage/v1/object/public/fotos/<ruta>
  if (req.method === 'GET' && partes[0] === 'object' && partes[1] === 'public' && partes[2] === 'fotos') {
    const f = fotos.get(decodeURIComponent(partes.slice(3).join('/')))
    if (!f) return send(400, { statusCode: '404', error: 'not_found', message: 'Object not found' })
    res.writeHead(200, { ...cors, 'Content-Type': f.tipo, 'Cache-Control': 'max-age=3600' })
    return res.end(f.bytes)
  }
  const uid = uidDe(req)
  if (!uid) return send(400, { statusCode: '403', error: 'Unauthorized', message: 'Invalid JWT' })
  const propia = (ruta) => ruta.startsWith(`u/${uid}/`)
  // Listar una carpeta: POST /storage/v1/object/list/fotos { prefix }
  if (req.method === 'POST' && partes[0] === 'object' && partes[1] === 'list' && partes[2] === 'fotos') {
    const pedido = JSON.parse(bytes.toString('utf8') || '{}')
    const prefijo = String(pedido.prefix || '').replace(/\/?$/, '/')
    if (!propia(prefijo)) return send(200, [])
    const nombres = [...fotos.keys()].filter((r) => r.startsWith(prefijo)).map((r) => ({ name: r.slice(prefijo.length), id: r }))
    return send(200, nombres)
  }
  // Subir: POST /storage/v1/object/fotos/<ruta>
  if (req.method === 'POST' && partes[0] === 'object' && partes[1] === 'fotos') {
    const ruta = decodeURIComponent(partes.slice(2).join('/'))
    if (!propia(ruta)) return send(400, { statusCode: '403', error: 'Unauthorized', message: 'new row violates row-level security policy' })
    let tipo = String(req.headers['content-type'] || '').split(';')[0]
    // supabase-js manda un Blob como multipart/form-data: el archivo es la parte que trae su propio Content-Type
    if (tipo === 'multipart/form-data') {
      const limite = Buffer.from('--' + /boundary=([^;]+)/.exec(req.headers['content-type'])[1])
      let desde = bytes.indexOf(limite)
      while (desde !== -1) {
        const hasta = bytes.indexOf(limite, desde + limite.length)
        if (hasta === -1) break
        const parte = bytes.subarray(desde + limite.length + 2, hasta - 2)
        const fin = parte.indexOf('\r\n\r\n')
        const cabecera = parte.subarray(0, fin).toString('utf8')
        const t = /content-type:\s*([^\r\n;]+)/i.exec(cabecera)
        if (t) {
          tipo = t[1].trim()
          bytes = parte.subarray(fin + 4)
          break
        }
        desde = hasta
      }
    }
    if (!['image/webp', 'image/jpeg'].includes(tipo))
      return send(400, { statusCode: '415', error: 'invalid_mime_type', message: `mime type ${tipo} is not supported` })
    if (bytes.length > 300000)
      return send(400, { statusCode: '413', error: 'Payload too large', message: 'The object exceeded the maximum allowed size' })
    if (fotos.has(ruta)) return send(400, { statusCode: '409', error: 'Duplicate', message: 'The resource already exists' })
    fotos.set(ruta, { tipo, bytes })
    return send(200, { Key: `fotos/${ruta}`, Id: randomUUID() })
  }
  // Borrar: DELETE /storage/v1/object/fotos { prefixes: [...] }
  if (req.method === 'DELETE' && partes[0] === 'object' && partes[1] === 'fotos') {
    const pedido = JSON.parse(bytes.toString('utf8') || '{}')
    const borradas = []
    for (const r of pedido.prefixes || []) if (propia(r) && fotos.delete(r)) borradas.push({ name: r })
    return send(200, borradas)
  }
  return send(404, { message: 'storage: no simulado' })
}

let listo = false
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Expose-Headers': '*',
  }
  const send = (code, body) => {
    res.writeHead(code, { ...cors, 'Content-Type': 'application/json' })
    res.end(body === undefined ? '' : JSON.stringify(body))
  }
  if (req.method === 'OPTIONS') return send(204)
  const pedazos = []
  for await (const c of req) pedazos.push(c)
  const bytes = Buffer.concat(pedazos)
  // Las fotos (Storage) llegan como bytes; todo lo demás, como JSON
  if (url.pathname.startsWith('/storage/v1/')) return storage(req, url, bytes, send, res, cors)
  const raw = bytes.toString('utf8')
  const body = raw ? JSON.parse(raw) : null
  try {
    // Para que las pruebas (y Playwright) sepan cuándo está todo listo y si hay función de IA
    if (url.pathname === '/_pruebas/estado')
      return listo ? send(200, { funcion: funcion.activa, entrar: funcion.entrar }) : send(503, { message: 'arrancando' })
    // Captcha, como en Supabase con la protección prendida: crear cuenta, entrar con contraseña y pedir mails exigen
    // una comprobación, y cada una sirve una sola vez. (Renovar la sesión no la pide.)
    const pideCaptcha =
      ['/auth/v1/signup', '/auth/v1/resend', '/auth/v1/recover'].includes(url.pathname) ||
      (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'password')
    // Para probar la app a mano (sin el Turnstile): CAPTCHA_LIBRE=1 node pruebas/e2e/servidor/supabase-simulado.mjs
    if (pideCaptcha && !process.env.CAPTCHA_LIBRE) {
      const captcha = String(body?.gotrue_meta_security?.captcha_token || '')
      if (!captcha.startsWith('captcha-de-prueba-') || captchasUsados.has(captcha))
        return send(400, { code: 400, error_code: 'captcha_failed', msg: 'captcha protection: request disallowed (timeout-or-duplicate)' })
      captchasUsados.add(captcha)
    }
    if (url.pathname === '/auth/v1/signup') {
      // Los mails @codigo.test simulan el proyecto con "Confirm email" activado: sin sesión hasta poner el código 123456
      const conCodigo = body.email.endsWith('@codigo.test')
      if (users.has(body.email)) {
        if (conCodigo) return send(200, { id: randomUUID(), aud: 'authenticated', role: '', email: body.email, identities: [] })
        return send(422, { code: 422, error_code: 'user_already_exists', msg: 'User already registered' })
      }
      const u = { id: randomUUID(), email: body.email, password: body.password, confirmado: !conCodigo }
      users.set(u.email, u)
      mails.push({ tipo: 'signup', email: u.email })
      if (conCodigo)
        return send(200, {
          ...sesion(u).user,
          identities: [{ id: u.id, provider: 'email' }],
          confirmation_sent_at: new Date().toISOString(),
        })
      return send(200, sesion(u))
    }
    if (url.pathname === '/auth/v1/verify') {
      const u = users.get(body.email)
      if (!u || body.token !== '123456') return send(403, { code: 403, error_code: 'otp_expired', msg: 'Token has expired or is invalid' })
      if (body.type === 'email' || body.type === 'signup') u.confirmado = true
      verificaciones.push({ tipo: body.type, email: body.email })
      return send(200, sesion(u))
    }
    if (url.pathname === '/auth/v1/resend' || url.pathname === '/auth/v1/recover') {
      // Como Supabase: a un email sin cuenta no se le manda nada (y contesta bien igual), y a uno con cuenta no se le
      // mandan dos mails en menos de un minuto: el segundo pedido sale con error
      if (users.has(body.email)) {
        if (Date.now() - (ultimoMail.get(body.email) || 0) < 60000)
          return send(429, {
            code: 429,
            error_code: 'over_email_send_rate_limit',
            msg: 'For security purposes, you can only request this after 60 seconds.',
          })
        ultimoMail.set(body.email, Date.now())
        mails.push({ tipo: url.pathname.split('/').pop(), email: body.email })
      }
      return send(200, {})
    }
    // Para las pruebas: deja a una cuenta sin nombre de usuario, como las que ya existían antes de que hubiera usuarios
    if (url.pathname === '/_pruebas/sin-usuario') {
      const perfil = db.profiles.find((p) => p.id === users.get(body.email)?.id)
      if (perfil) perfil.username = null
      return send(200, { ok: !!perfil })
    }
    if (url.pathname === '/auth/v1/_mock')
      return send(200, {
        mails,
        verificaciones,
        usuarios: [...users.values()].map((u) => ({ email: u.email, password: u.password, confirmado: u.confirmado })),
      })
    if (url.pathname === '/auth/v1/token') {
      if (url.searchParams.get('grant_type') === 'password') {
        const u = users.get(body.email)
        if (!u || u.password !== body.password)
          return send(400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' })
        if (!u.confirmado) return send(400, { code: 400, error_code: 'email_not_confirmed', msg: 'Email not confirmed' })
        return send(200, sesion(u))
      }
      const u = [...users.values()].find((x) => 'r-' + x.id === body.refresh_token)
      return u ? send(200, sesion(u)) : send(400, { msg: 'bad refresh' })
    }
    if (url.pathname === '/auth/v1/user') {
      const u = [...users.values()].find((x) => x.id === uidDe(req))
      if (!u) return send(401, { msg: 'no' })
      if (req.method === 'PUT' && body?.password) {
        if (body.password === u.password)
          return send(422, { code: 422, error_code: 'same_password', msg: 'New password should be different from the old password.' })
        u.password = body.password
      }
      return send(200, sesion(u).user)
    }
    if (url.pathname === '/auth/v1/logout') return send(204)
    // Administración de usuarios (solo con la clave de servicio, como en Supabase): la usa la función `entrar`
    const admin = url.pathname.match(/^\/auth\/v1\/admin\/users\/([\w-]+)$/)
    if (admin) {
      if (!esServicio(req)) return send(403, { msg: 'not_admin' })
      const u = [...users.values()].find((x) => x.id === admin[1])
      return u ? send(200, sesion(u).user) : send(404, { msg: 'User not found' })
    }

    // ---- "Modelo" simulado: devuelve una devolución fija con la forma de la API de Anthropic
    if (url.pathname === '/anthropic/_modo') {
      ia.modo = body.modo
      return send(200, { modo: ia.modo })
    }
    if (url.pathname === '/anthropic/_pedidos') return send(200, ia.pedidos)
    if (url.pathname === '/anthropic/v1/messages') {
      ia.pedidos.push({ clave: req.headers['x-api-key'], version: req.headers['anthropic-version'], ...body })
      if (ia.modo === 'error') return send(401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } })
      if (ia.modo === 'saturado') return send(529, { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } })
      const texto =
        ia.modo === 'texto' ? 'Esta semana viniste bien, pero te faltó proteína.' : '```json\n' + JSON.stringify(RESPUESTA_IA) + '\n```'
      return send(200, {
        id: 'msg_1',
        type: 'message',
        role: 'assistant',
        model: body.model,
        content: [{ type: 'text', text: texto }],
        stop_reason: 'end_turn',
        usage: { input_tokens: 900, output_tokens: 250 },
      })
    }
    // ---- Lo mismo con la forma de la API de Groq (formato OpenAI). Se anota el pedido con los mismos nombres que el de Anthropic.
    if (url.pathname === '/groq/openai/v1/chat/completions') {
      ia.pedidos.push({
        proveedor: 'groq',
        clave: (req.headers.authorization || '').replace('Bearer ', ''),
        version: null,
        model: body.model,
        max_tokens: body.max_completion_tokens,
        system: body.messages.find((m) => m.role === 'system')?.content || '',
        messages: body.messages.filter((m) => m.role === 'user'),
        extra: { reasoning_effort: body.reasoning_effort, include_reasoning: body.include_reasoning, temperature: body.temperature },
      })
      if (ia.modo === 'error')
        return send(401, { error: { message: 'Invalid API Key', type: 'invalid_request_error', code: 'invalid_api_key' } })
      if (ia.modo === 'saturado')
        return send(429, {
          error: {
            message: 'Rate limit reached for model in organization on tokens per minute (TPM)',
            type: 'tokens',
            code: 'rate_limit_exceeded',
          },
        })
      if (ia.modo === 'cortado')
        return send(200, {
          id: 'c1',
          object: 'chat.completion',
          model: body.model,
          choices: [{ index: 0, message: { role: 'assistant', content: '{"resumen": "Esta semana viniste' }, finish_reason: 'length' }],
          usage: { prompt_tokens: 900, completion_tokens: 1800, total_tokens: 2700 },
        })
      const texto = ia.modo === 'texto' ? 'Esta semana viniste bien, pero te faltó proteína.' : JSON.stringify(RESPUESTA_IA)
      return send(200, {
        id: 'c1',
        object: 'chat.completion',
        model: body.model,
        choices: [{ index: 0, message: { role: 'assistant', content: texto }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 900, completion_tokens: 250, total_tokens: 1150 },
      })
    }
    // ---- Funciones: se le pasa el pedido a la función real, corriendo en Deno en el puerto 8000
    if (url.pathname.startsWith('/functions/v1/')) {
      try {
        const puerto = FUNCIONES_REALES[url.pathname.split('/')[3]]
        if (!puerto) throw new Error('no existe')
        const r = await fetch(`http://localhost:${puerto}` + url.pathname, {
          method: req.method,
          body: raw || undefined,
          headers: { 'content-type': 'application/json', authorization: req.headers.authorization || '', apikey: req.headers.apikey || '' },
        })
        res.writeHead(r.status, { ...cors, 'Content-Type': 'application/json' })
        return res.end(await r.text())
      } catch {
        return send(404, { code: 'NOT_FOUND', message: 'Requested function was not found' })
      }
    }
    if (url.pathname === '/rest/v1/rpc/borrar_mi_cuenta') {
      const uid = uidDe(req)
      for (const [email, u] of users) if (u.id === uid) users.delete(email)
      dejarElHogar(uid)
      for (const c of db.purchases) if (c.comprado_por === uid) c.comprado_por = null
      const rutinasDeLaCuenta = db.routines.filter((r) => r.user_id === uid).map((r) => r.id)
      db.routine_exercises = db.routine_exercises.filter((i) => !rutinasDeLaCuenta.includes(i.routine_id))
      for (const t of Object.keys(db))
        db[t] = db[t].filter((r) => r.user_id !== uid && r.owner !== uid && !(t === 'profiles' && r.id === uid))
      return send(204)
    }
    const funcionPedida = url.pathname.match(/^\/rest\/v1\/rpc\/(\w+)$/)
    if (funcionPedida) {
      const hacer = FUNCIONES[funcionPedida[1]]
      if (!hacer) return send(404, { code: 'PGRST202', message: 'Could not find the function public.' + funcionPedida[1] })
      const uid = uidDe(req)
      if (!uid) return send(401, { message: 'sin sesión' })
      const copia = structuredClone(db)
      const claves = new Set(atendidos)
      try {
        return send(200, hacer(uid, body || {}))
      } catch (e) {
        Object.assign(db, copia) // como en la base: si falla, no queda nada a medias (ni la clave del pedido)
        atendidos.clear()
        for (const k of claves) atendidos.add(k)
        if (e.pg) return send(400, { code: e.pg, message: e.message, details: null, hint: null })
        throw e
      }
    }
    const m = url.pathname.match(/^\/rest\/v1\/(\w+)$/)
    if (!m || !db[m[1]]) return send(404, { message: 'no existe ' + url.pathname })
    const tabla = m[1]
    const servicio = esServicio(req)
    const uid = uidDe(req)
    if (!uid && !servicio) return send(401, { message: 'sin sesión' })
    if (!servicio && ['hogares', 'hogar_miembros', 'catalogo', 'catalogo_aportes'].includes(tabla))
      return send(403, { message: 'permission denied for table ' + tabla })
    const dueno = uid ? ambito(uid) : null
    const visible = (row) => {
      if (servicio) return true
      if (tabla === 'foods' || tabla === 'recipes') return puedeVer(row.owner, uid)
      if (tabla === 'recipe_items') return true
      // Los catálogos de ejercicio: los de todos (sin dueño) y los propios. Las rutinas se ven por su dueño.
      if (tabla === 'exercise_types' || tabla === 'gym_exercises') return row.owner === null || row.owner === uid
      if (tabla === 'routine_exercises') return db.routines.some((r) => r.id === row.routine_id && r.user_id === uid)
      if (tabla === 'profiles') return row.id === uid
      if (DEL_AMBITO.includes(tabla)) return row.user_id === dueno
      return row.user_id === uid
    }
    const pasa = filtros(url)
    // .single() de supabase-js pide un objeto en vez de una lista
    const unico = (req.headers.accept || '').includes('vnd.pgrst.object')
    const lista = (codigo, filas) => {
      if (!unico) return send(codigo, filas)
      return filas.length === 1
        ? send(codigo, filas[0])
        : send(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' })
    }
    if ((tabla === 'ai_analyses' || tabla === 'eventos') && (req.method === 'PATCH' || req.method === 'DELETE'))
      return send(403, { message: 'permission denied for table ' + tabla })
    if (req.method === 'GET') {
      const filas = db[tabla].filter((r) => visible(r) && pasa(r))
      const desde = Number(url.searchParams.get('offset') || 0)
      const limite = url.searchParams.get('limit')
      return lista(200, limite ? filas.slice(desde, desde + Number(limite)) : filas.slice(desde))
    }
    if (req.method === 'POST') {
      const filas = Array.isArray(body) ? body : [body]
      const conflicto = url.searchParams.get('on_conflict')
      const upsert = (req.headers.prefer || '').includes('merge-duplicates')
      const out = []
      for (const f of filas) {
        if ((tabla === 'foods' || tabla === 'recipes' || tabla === 'exercise_types' || tabla === 'gym_exercises') && f.owner !== uid)
          return send(403, { message: 'new row violates row-level security policy' })
        if (f.user_id && f.user_id !== (DEL_AMBITO.includes(tabla) ? dueno : uid))
          return send(403, { message: 'new row violates row-level security policy' })
        let existente = null
        if (upsert && conflicto) {
          const cols = conflicto.split(',')
          existente = db[tabla].find((r) => cols.every((c) => String(r[c]) === String(f[c])))
        }
        const rechazo = (e) => {
          if (!e.pg) throw e
          return send(e.pg === '23505' ? 409 : 400, { code: e.pg, message: e.message, details: null, hint: null })
        }
        if (tabla === 'profiles')
          try {
            cuidarUsuario(f, existente, uid)
          } catch (e) {
            return rechazo(e)
          }
        if (existente) {
          Object.assign(existente, f)
          if (tabla === 'stock') sinFechaSiAgotado(existente)
          out.push(existente)
        } else {
          const fila = { ...(SIN_ID.has(tabla) ? {} : { id: randomUUID() }), ...f }
          if (['log_entries', 'shopping_items', 'profiles', 'ai_analyses', 'combos', 'opiniones'].includes(tabla))
            fila.created_at = new Date().toISOString()
          if (tabla === 'log_entries' && fila.skipped === undefined) fila.skipped = false
          if (tabla === 'profiles')
            Object.assign(fila, {
              thermos_ml: 1000,
              water_target_ml: null,
              username: null,
              body_fat_pct: null,
              work_type: null,
              steps_per_day: null,
              resting_hr: null,
              gasto_activo: false,
              gasto_consentimiento: null,
              gasto_modo: 'fijo',
              gasto_devuelve: 50,
              gasto_ajuste_pct: null,
              gasto_factor: null,
              gasto_factor_fecha: null,
              salud_consentida_at: null,
              ...f,
            })
          if (tabla === 'foods' && fila.alcohol === undefined) fila.alcohol = false
          if ((tabla === 'foods' || tabla === 'recipes') && fila.image_path === undefined) fila.image_path = null
          if (tabla === 'stock') sinFechaSiAgotado(fila)
          if (tabla === 'purchases' && !fila.date) fila.date = new Date().toISOString().slice(0, 10)
          if (tabla === 'eventos')
            Object.assign(fila, {
              id: ++numeroDeEvento,
              user_id: uid,
              created_at: ahora(),
              detalle: fila.detalle || {},
              version: fila.version || '',
              ruta: fila.ruta || '',
              dispositivo: fila.dispositivo || '',
            })
          db[tabla].push(fila)
          out.push(fila)
        }
      }
      return lista(201, out)
    }
    // Las actividades y ejercicios sin dueño son de todos: nadie los modifica ni los borra
    const modificable = (r) => visible(r) && pasa(r) && !((tabla === 'exercise_types' || tabla === 'gym_exercises') && r.owner !== uid)
    if (req.method === 'PATCH') {
      const out = db[tabla].filter(modificable)
      // La base no deja prender el cálculo de gasto sin dejar constancia del consentimiento (actualizacion-15.sql)
      if (tabla === 'profiles' && body.gasto_activo === true && out.some((r) => !(body.gasto_consentimiento || r.gasto_consentimiento)))
        return send(400, {
          code: '23514',
          message: 'new row for relation "profiles" violates check constraint "profiles_gasto_chk"',
          details: null,
          hint: null,
        })
      if (tabla === 'profiles')
        try {
          out.forEach((r) => cuidarUsuario(body, r, uid))
        } catch (e) {
          if (!e.pg) throw e
          return send(e.pg === '23505' ? 409 : 400, { code: e.pg, message: e.message, details: null, hint: null })
        }
      // Las mismas reglas que la base para la fecha de vencimiento y la foto (actualizacion-19.sql)
      if (tabla === 'stock' && body.expires_on && !(body.expires_on >= '2000-01-01' && body.expires_on <= '2100-12-31'))
        return send(400, {
          code: '23514',
          message: 'new row for relation "stock" violates check constraint "stock_vence_chk"',
          details: null,
          hint: null,
        })
      if ((tabla === 'foods' || tabla === 'recipes') && body.image_path && !FOTO_VALIDA.test(body.image_path))
        return send(400, {
          code: '23514',
          message: `new row for relation "${tabla}" violates check constraint "${tabla}_foto_chk"`,
          details: null,
          hint: null,
        })
      out.forEach((r) => Object.assign(r, body))
      if (tabla === 'stock') out.forEach(sinFechaSiAgotado)
      return send(200, out)
    }
    if (req.method === 'DELETE') {
      const borrar = db[tabla].filter(modificable)
      // Un ejercicio con series cargadas no se puede borrar (se perdería el historial)
      if (tabla === 'gym_exercises' && borrar.some((e) => db.workout_sets.some((s) => s.exercise_id === e.id)))
        return send(409, {
          code: '23503',
          message: 'update or delete on table "gym_exercises" violates foreign key constraint "workout_sets_exercise_id_fkey"',
          details: null,
          hint: null,
        })
      db[tabla] = db[tabla].filter((r) => !borrar.includes(r))
      if (tabla === 'recipes') db.recipe_items = db.recipe_items.filter((i) => !borrar.some((r) => r.id === i.recipe_id))
      if (tabla === 'workouts') db.workout_sets = db.workout_sets.filter((s) => !borrar.some((w) => w.id === s.workout_id))
      if (tabla === 'routines') {
        db.routine_exercises = db.routine_exercises.filter((i) => !borrar.some((r) => r.id === i.routine_id))
        for (const w of db.workouts) if (borrar.some((r) => r.id === w.routine_id)) w.routine_id = null
      }
      if (tabla === 'gym_exercises') db.routine_exercises = db.routine_exercises.filter((i) => !borrar.some((e) => e.id === i.exercise_id))
      if (tabla === 'exercise_types') for (const w of db.workouts) if (borrar.some((t) => t.id === w.type_id)) w.type_id = null
      return send(200, borrar)
    }
    send(405, { message: 'método' })
  } catch (e) {
    console.error('ERROR DEL SIMULADOR', req.method, req.url, e)
    send(500, { message: String(e) })
  }
})

// ---------- Las funciones de verdad, corriendo en Deno (si está instalado) ----------
const funcion = { activa: false, entrar: false }
async function levantarFunciones() {
  const base = `http://localhost:${PUERTO}`
  const hijos = []
  const matar = () => hijos.forEach((h) => h.kill())
  process.on('exit', matar)
  for (const s of ['SIGINT', 'SIGTERM'])
    process.on(s, () => {
      matar()
      process.exit(0)
    })
  const arrancar = async (nombre, puerto, env) => {
    const carpeta = fileURLToPath(new URL(`../../../supabase/functions/${nombre}/`, import.meta.url))
    const hijo = spawn(process.env.DENO || 'deno', ['run', '--no-lock', '--allow-net', '--allow-env', 'index.ts'], {
      cwd: carpeta,
      stdio: 'ignore',
      env: { ...process.env, SUPABASE_URL: base, DENO_SERVE_ADDRESS: `tcp:127.0.0.1:${puerto}`, ...env },
    })
    let sinDeno = false
    hijo.on('error', () => (sinDeno = true))
    hijo.on('exit', () => (sinDeno = true))
    hijos.push(hijo)
    // Se espera hasta 20 segundos a que conteste; si Deno no está, se sigue sin la función
    for (let i = 0; i < 80 && !sinDeno; i++) {
      try {
        await fetch(`http://localhost:${puerto}/`, { method: 'OPTIONS' })
        return true
      } catch {
        await new Promise((r) => setTimeout(r, 250))
      }
    }
    return false
  }
  ;[funcion.activa, funcion.entrar] = await Promise.all([
    arrancar('analizar-semana', FUNCIONES_REALES['analizar-semana'], {
      ORIGENES_PERMITIDOS: ORIGEN_DE_LA_APP,
      IA_PROVEEDOR: '',
      GROQ_API_KEY: 'clave-de-prueba',
      GROQ_URL: base + '/groq/openai/v1/chat/completions',
      ANTHROPIC_API_KEY: 'clave-de-prueba',
      ANTHROPIC_URL: base + '/anthropic/v1/messages',
    }),
    arrancar('entrar', FUNCIONES_REALES.entrar, {
      ORIGENES_PERMITIDOS: ORIGEN_DE_LA_APP,
      SUPABASE_ANON_KEY: 'anon-de-prueba',
      SUPABASE_SERVICE_ROLE_KEY: CLAVE_SERVICIO,
    }),
  ])
}

server.listen(PUERTO, async () => {
  await levantarFunciones()
  console.log(
    `Supabase simulado en ${PUERTO}` +
      (funcion.activa ? ' (con las funciones de verdad)' : ' (sin Deno: las pruebas de la IA y del usuario se saltean)'),
  )
  listo = true
})

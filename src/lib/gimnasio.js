// Cuentas del gimnasio (F-19, fase 3): fuerza estimada, récords, volumen por músculo y progreso de cada ejercicio.
// Son funciones puras. Las series tienen la forma de la tabla workout_sets:
//   { workout_id, fecha, orden, exercise_id, set_no, reps, weight_kg, rpe, warmup }
// Las series de entrada en calor no cuentan para nada de esto (ni para récords ni para volumen).

export const GRUPOS = [
  ['pecho', 'Pecho'],
  ['espalda', 'Espalda'],
  ['hombros', 'Hombros'],
  ['biceps', 'Bíceps'],
  ['triceps', 'Tríceps'],
  ['antebrazos', 'Antebrazos'],
  ['abdomen', 'Abdomen y core'],
  ['cuadriceps', 'Cuádriceps'],
  ['isquios', 'Isquiotibiales'],
  ['gluteos', 'Glúteos'],
  ['pantorrillas', 'Pantorrillas'],
  ['cuerpo_completo', 'Cuerpo completo'],
]
export const EQUIPOS = [
  ['barra', 'Barra'],
  ['mancuernas', 'Mancuernas'],
  ['maquina', 'Máquina'],
  ['polea', 'Polea'],
  ['peso_corporal', 'Peso del cuerpo'],
  ['kettlebell', 'Kettlebell'],
  ['banda', 'Banda elástica'],
  ['otro', 'Otro'],
]
export const nombreDeGrupo = (g) => GRUPOS.find(([k]) => k === g)?.[1] || 'Otros'
export const nombreDeEquipo = (e) => EQUIPOS.find(([k]) => k === e)?.[1] || 'Otro'

// Límites para validar lo que se carga
export const LIM_GIMNASIO = {
  reps: [1, 100],
  peso: [0, 1000],
  esfuerzo: [1, 10],
  series: 500,
  descanso: [0, 1200],
}

// Más de este número de repeticiones, la fórmula de Epley deja de ser confiable
export const MAX_REPS_PARA_1RM = 12

const num = (v) => (v === '' || v === null || v === undefined ? NaN : Number(v))

// Una serie "cuenta" si no es de entrada en calor y tiene repeticiones
export const cuenta = (s) => !s.warmup && num(s.reps) > 0

// Fuerza máxima estimada (1RM) con la fórmula de Epley: peso × (1 + repeticiones / 30).
// Con una sola repetición es el propio peso. Sin peso o con muchas repeticiones no se estima (null).
export function epley(peso, reps) {
  const p = num(peso)
  const r = num(reps)
  if (!(p > 0) || !(r >= 1) || r > MAX_REPS_PARA_1RM) return null
  return r === 1 ? p : p * (1 + r / 30)
}

// Kilos movidos en una serie (peso × repeticiones). Las de peso del cuerpo sin carga extra valen 0.
export const volumenDeSerie = (s) => (cuenta(s) ? (num(s.weight_kg) || 0) * num(s.reps) : 0)

// Redondea a medio kilo, que es lo que se ve en los discos (para mostrar el 1RM)
export const aMedioKilo = (n) => Math.round(n * 2) / 2

// ---------- Récords ----------
// Los mejores valores de un ejercicio hasta ahora: mayor peso, mayor 1RM estimado, mayor volumen en una serie y más repeticiones.
// `series`: las de ese ejercicio.
export function mejoresMarcas(series) {
  const marcas = { peso: 0, unRm: 0, volumen: 0, reps: 0 }
  for (const s of series) {
    if (!cuenta(s)) continue
    const p = num(s.weight_kg) || 0
    const r = num(s.reps)
    if (p > marcas.peso) marcas.peso = p
    const e = epley(p, r)
    if (e && e > marcas.unRm) marcas.unRm = e
    if (p * r > marcas.volumen) marcas.volumen = p * r
    if (r > marcas.reps) marcas.reps = r
  }
  return marcas
}

// ¿Esta serie es un récord comparada con las anteriores del mismo ejercicio? Devuelve la lista de récords que rompe
// (['peso', 'unRm', 'reps']); vacía si no rompe ninguno. La primera vez que se hace un ejercicio no se marca nada: no hay con qué comparar.
export function recordsDeSerie(serie, anteriores) {
  if (!cuenta(serie)) return []
  const previas = anteriores.filter(cuenta)
  if (previas.length === 0) return []
  const antes = mejoresMarcas(previas)
  const p = num(serie.weight_kg) || 0
  const r = num(serie.reps)
  const rotos = []
  if (p > antes.peso) rotos.push('peso')
  const e = epley(p, r)
  if (e && e > antes.unRm + 0.001) rotos.push('unRm')
  // Sin carga (peso del cuerpo) el récord es de repeticiones, contra las series anteriores también sin carga
  if (p === 0) {
    const repsSinCarga = Math.max(0, ...previas.filter((x) => !(num(x.weight_kg) > 0)).map((x) => num(x.reps)))
    if (r > repsSinCarga) rotos.push('reps')
  }
  return rotos
}

// ---------- La vez anterior ----------
// Las series de la última sesión (anterior a `antesDe`, o cualquiera si no se pasa) en que se hizo el ejercicio.
//   workouts: Map o lista de entrenamientos (para el orden por fecha); se ordena por fecha y, a igual fecha, por creación.
export function ultimaVez(series, workouts, ejercicioId, { antesDe = null, excluir = null } = {}) {
  const porId = new Map((Array.isArray(workouts) ? workouts : [...workouts.values()]).map((w) => [w.id, w]))
  const candidatas = series.filter((s) => s.exercise_id === ejercicioId && s.workout_id !== excluir && porId.has(s.workout_id))
  let mejorId = null
  let mejor = null
  for (const s of candidatas) {
    const w = porId.get(s.workout_id)
    if (antesDe && w.fecha >= antesDe) continue
    const clave = `${w.fecha}|${w.created_at || ''}`
    if (mejor === null || clave > mejor) {
      mejor = clave
      mejorId = w.id
    }
  }
  if (!mejorId) return null
  return {
    workout: porId.get(mejorId),
    series: candidatas.filter((s) => s.workout_id === mejorId).sort((a, b) => a.set_no - b.set_no),
  }
}

// ---------- Volumen por grupo muscular ----------
// Series de trabajo y kilos movidos por grupo. `ejerciciosPorId`: Map id -> ejercicio (con `grupo`).
//   Devuelve una lista ordenada de más a menos series: [{ grupo, series, volumen }]
export function volumenPorGrupo(series, ejerciciosPorId) {
  const acumulado = new Map()
  for (const s of series) {
    if (!cuenta(s)) continue
    const grupo = ejerciciosPorId.get(s.exercise_id)?.grupo
    if (!grupo) continue
    const a = acumulado.get(grupo) || { grupo, series: 0, volumen: 0 }
    a.series += 1
    a.volumen += volumenDeSerie(s)
    acumulado.set(grupo, a)
  }
  return [...acumulado.values()].sort((a, b) => b.series - a.series || b.volumen - a.volumen)
}

// ---------- Progreso de un ejercicio ----------
// Un punto por sesión: el mejor 1RM estimado, el mayor peso y el volumen total de ese ejercicio ese día.
//   Devuelve [{ fecha, unRm, peso, volumen, series }] de la más vieja a la más nueva.
export function progresoDeEjercicio(series, ejercicioId) {
  const porDia = new Map()
  for (const s of series) {
    if (s.exercise_id !== ejercicioId || !cuenta(s)) continue
    const a = porDia.get(s.fecha) || { fecha: s.fecha, unRm: 0, peso: 0, volumen: 0, series: 0 }
    const p = num(s.weight_kg) || 0
    a.peso = Math.max(a.peso, p)
    a.unRm = Math.max(a.unRm, epley(p, s.reps) || 0)
    a.volumen += volumenDeSerie(s)
    a.series += 1
    porDia.set(s.fecha, a)
  }
  return [...porDia.values()].sort((a, b) => (a.fecha < b.fecha ? -1 : 1))
}

// Los ejercicios que la persona ya hizo, del más reciente al más viejo: [{ ejercicioId, ultima, sesiones }]
export function ejerciciosHechos(series) {
  const m = new Map()
  for (const s of series) {
    if (!cuenta(s)) continue
    const a = m.get(s.exercise_id) || { ejercicioId: s.exercise_id, ultima: s.fecha, dias: new Set() }
    if (s.fecha > a.ultima) a.ultima = s.fecha
    a.dias.add(s.fecha)
    m.set(s.exercise_id, a)
  }
  return [...m.values()]
    .map((a) => ({ ejercicioId: a.ejercicioId, ultima: a.ultima, sesiones: a.dias.size }))
    .sort((a, b) => (a.ultima < b.ultima ? 1 : a.ultima > b.ultima ? -1 : 0))
}

// ---------- Resumen de una sesión ----------
export function resumenDeSesion(series) {
  const validas = series.filter(cuenta)
  return {
    series: validas.length,
    ejercicios: new Set(validas.map((s) => s.exercise_id)).size,
    volumen: validas.reduce((t, s) => t + volumenDeSerie(s), 0),
  }
}

// Texto corto de una serie: "80 kg × 8" o "10 reps" si no hay carga
export function textoDeSerie(s) {
  const p = num(s.weight_kg) || 0
  const peso = p > 0 ? `${p.toLocaleString('es-AR', { maximumFractionDigits: 3 })} kg × ` : ''
  return `${peso}${s.reps}${p > 0 ? '' : ' reps'}`
}

// ---------- Armar las series para guardar ----------
// De la sesión en pantalla (una lista de ejercicios, cada uno con sus series) a la lista plana que recibe la base.
//   sesion: [{ exercise_id, series: [{ reps, weight_kg, rpe, warmup, hecha }] }]
// Solo se guardan las series marcadas como hechas, con repeticiones. `orden` es la posición del ejercicio en la sesión.
export function seriesParaGuardar(sesion) {
  const salida = []
  let orden = 0
  for (const ej of sesion) {
    const hechas = ej.series.filter((s) => s.hecha && num(s.reps) >= 1)
    if (hechas.length === 0) continue
    hechas.forEach((s, i) => {
      salida.push({
        orden,
        exercise_id: ej.exercise_id,
        set_no: i + 1,
        reps: Math.round(num(s.reps)),
        weight_kg: num(s.weight_kg) > 0 ? num(s.weight_kg) : 0,
        rpe: num(s.rpe) >= 1 ? num(s.rpe) : null,
        warmup: !!s.warmup,
      })
    })
    orden += 1
  }
  return salida
}

// Errores de una serie en pantalla (null si está bien). Se usa para marcarla como hecha.
export function errorDeSerie(s) {
  const reps = num(s.reps)
  if (!Number.isInteger(reps) || reps < LIM_GIMNASIO.reps[0] || reps > LIM_GIMNASIO.reps[1]) return 'Las repeticiones van de 1 a 100.'
  if (s.weight_kg !== '' && s.weight_kg != null) {
    const p = num(s.weight_kg)
    if (!(p >= LIM_GIMNASIO.peso[0] && p <= LIM_GIMNASIO.peso[1])) return 'El peso va de 0 a 1.000 kg.'
  }
  if (s.rpe !== '' && s.rpe != null) {
    const e = num(s.rpe)
    if (!(e >= 1 && e <= 10)) return 'El esfuerzo va de 1 a 10.'
  }
  return null
}

// ---------- Calorías de una sesión de pesas ----------
// Las pesas se estiman por duración y esfuerzo (ver ejercicio.js): este es solo el texto de ayuda para elegir el esfuerzo
// según el RPE promedio de las series, si la persona lo cargó.
export function esfuerzoSugerido(series) {
  const conRpe = series.filter((s) => cuenta(s) && num(s.rpe) >= 1)
  if (conRpe.length === 0) return null
  const prom = conRpe.reduce((t, s) => t + num(s.rpe), 0) / conRpe.length
  return Math.round(Math.min(10, Math.max(1, prom)))
}

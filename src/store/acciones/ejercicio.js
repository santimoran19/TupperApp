// Gasto, ejercicio y gimnasio (F-19): prender el cálculo, anotar entrenamientos, actividades, ejercicios y rutinas.
// Anotar y borrar entrenamientos se puede hacer sin conexión (cola de cambios: ver cambios.js y envios.js). Prender el cálculo y
// crear actividades, ejercicios o rutinas necesita la base: se hace una vez, en casa.
import { anotarEvento } from '../../lib/eventos'
import { hoy } from '../../lib/fechas'
import { calcularEntrenamiento } from '../../lib/ejercicio'
import { gastoBase, pesoDelDia } from '../../lib/gasto'
import { ok, supabase } from '../base'
import { traerEjercicio } from '../carga'
import { invalido, nuevaClave } from '../listas'

// Texto → número o null (los campos vacíos de los formularios)
const numero = (v) => (v === '' || v === null || v === undefined ? null : Number(v))

// Los datos del perfil que alimentan el cálculo, tal como se guardan (solo los que vienen: los vacíos pasan a null)
export function datosDelCalculo(datos) {
  const cambios = {}
  if ('body_fat_pct' in datos) cambios.body_fat_pct = numero(datos.body_fat_pct)
  if ('work_type' in datos) cambios.work_type = datos.work_type || null
  if ('steps_per_day' in datos) cambios.steps_per_day = numero(datos.steps_per_day)
  if ('resting_hr' in datos) cambios.resting_hr = numero(datos.resting_hr)
  return cambios
}

export const accionesDeEjercicio = (k) => ({
  // Prende el cálculo de gasto. Deja constancia de la fecha del consentimiento (la base no deja prenderlo sin ella) y trae
  // lo de ejercicio. `datos` son los campos opcionales del perfil (% de grasa, trabajo, pasos, pulso en reposo).
  activarGasto: k.accion(
    'activarGasto',
    async (datos = {}) => {
      const cambios = { gasto_activo: true, gasto_consentimiento: new Date().toISOString(), ...datosDelCalculo(datos) }
      const [p] = ok(await supabase.from('profiles').update(cambios).eq('id', k.uid).select())
      const ejercicio = await traerEjercicio(k.uid)
      k.setE((s) => ({ ...s, ...ejercicio, perfil: p }))
      anotarEvento('gasto_activado')
    },
    { unica: true },
  ),

  // Guarda los datos que alimentan el cálculo (% de grasa, trabajo, pasos por día)
  guardarDatosGasto: k.accion('guardarDatosGasto', async (datos) => {
    const [p] = ok(await supabase.from('profiles').update(datosDelCalculo(datos)).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
  }),

  // Cómo se arma el objetivo: modo ('fijo' | 'dinamico'), qué parte del ejercicio se devuelve (0 a 100 %) y el recorte o
  // superávit en % (null = automático según el peso meta)
  guardarModoGasto: k.accion('guardarModoGasto', async ({ modo, devuelve, ajuste }) => {
    const cambios = {
      gasto_modo: modo === 'dinamico' ? 'dinamico' : 'fijo',
      gasto_devuelve: Math.round(Number(devuelve)),
      gasto_ajuste_pct: numero(ajuste),
    }
    const [p] = ok(await supabase.from('profiles').update(cambios).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
  }),

  // Apaga el cálculo: todo vuelve a funcionar con el objetivo fijo de siempre. Lo cargado queda guardado.
  desactivarGasto: k.accion('desactivarGasto', async () => {
    const [p] = ok(await supabase.from('profiles').update({ gasto_activo: false, gasto_modo: 'fijo' }).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
    anotarEvento('gasto_desactivado')
  }),

  // Borra TODO lo de ejercicio y gimnasio de la persona (entrenamientos, series, rutinas, y sus actividades y ejercicios propios).
  // No toca la comida, el peso ni el perfil.
  borrarMiEjercicio: k.accion(
    'borrarMiEjercicio',
    async () => {
      // Primero los entrenamientos (se llevan sus series), después lo que las series usaban
      ok(await supabase.from('workouts').delete().eq('user_id', k.uid))
      ok(await supabase.from('routines').delete().eq('user_id', k.uid))
      ok(await supabase.from('gym_exercises').delete().eq('owner', k.uid))
      ok(await supabase.from('exercise_types').delete().eq('owner', k.uid))
      k.setE((s) => ({
        ...s,
        entrenamientos: [],
        series: [],
        rutinas: [],
        rutinaItems: [],
        actividades: s.actividades.filter((a) => !a.owner),
        ejerciciosGym: s.ejerciciosGym.filter((a) => !a.owner),
      }))
    },
    { unica: true },
  ),

  // ---------- Entrenamientos ----------
  // Anota (o corrige, si trae `id`) un entrenamiento. Calcula las calorías con el mejor dato que haya (ver lib/ejercicio.js) y
  // guarda el resultado con el peso de ese día. `series` es solo para el gimnasio: [{ orden, exercise_id, set_no, reps, weight_kg, rpe, warmup }].
  //   datos: { id?, fecha, tipo (fila del catálogo o null), nombre?, minutos, distancia, desnivel, pulso, esfuerzo, reloj, notas, rutina, series }
  guardarEntrenamiento: k.accion(
    'guardarEntrenamiento',
    (datos) => {
      const v = k.ver()
      const perfil = v.e.perfil
      if (!perfil?.gasto_activo) throw invalido('Primero activá el cálculo de gasto en tu perfil.')
      const peso = pesoDelDia(perfil, v.e.medidas, datos.fecha)
      const base = gastoBase(perfil, peso, datos.fecha)
      if (!base) throw invalido('Completá tu perfil (sexo, fecha de nacimiento, altura y peso) para calcular las calorías.')
      const nombre = (datos.nombre || datos.tipo?.name || '').trim()
      if (!nombre) throw invalido('Elegí una actividad.')
      const r = calcularEntrenamiento(
        datos.tipo,
        {
          minutos: datos.minutos,
          distancia: datos.distancia,
          desnivel: datos.desnivel,
          pulso: datos.pulso,
          esfuerzo: datos.esfuerzo,
          reloj: datos.reloj,
        },
        { peso, edad: base.edad, sexo: base.sexo, tmb: base.tmb },
      )
      if (r.error) throw invalido(r.error)
      const id = datos.id || nuevaClave()
      // Al corregir una sesión de gimnasio sin tocar las series, se mandan las que ya tiene: la base reemplaza las series por
      // las que llegan, y sin esto se borrarían
      const existentes = v.e.series.filter((x) => x.workout_id === id)
      const series =
        datos.series ??
        (existentes.length > 0
          ? existentes.map(({ orden, exercise_id, set_no, reps, weight_kg, rpe, warmup }) => ({
              orden,
              exercise_id,
              set_no,
              reps,
              weight_kg,
              rpe,
              warmup,
            }))
          : null)
      return k.operar('guardarEntreno', {
        id,
        datos: {
          fecha: datos.fecha,
          type_id: datos.tipo?.id ?? null,
          name: nombre.slice(0, 60),
          duration_min: Math.round(Number(datos.minutos)),
          distance_km: numero(datos.distancia),
          ascent_m: numero(datos.desnivel),
          avg_hr: numero(datos.pulso),
          rpe: numero(datos.esfuerzo) != null ? Math.round(Number(datos.esfuerzo)) : null,
          kcal_watch: numero(datos.reloj) != null ? Math.round(Number(datos.reloj)) : null,
          kcal: r.kcal,
          metodo: r.metodo,
          peso_kg: peso,
          notes: (datos.notas || '').trim().slice(0, 300) || null,
          routine_id: datos.rutina ?? null,
        },
        series,
        cuando: new Date().toISOString(),
      })
    },
    { enCola: true },
  ),

  borrarEntrenamiento: k.accion('borrarEntrenamiento', (id) => k.operar('borrarEntreno', { id }), { enCola: true }),

  // ---------- Actividades propias ----------
  crearActividad: k.accion(
    'crearActividad',
    async (datos) => {
      const nombre = (datos.name || '').trim()
      if (!nombre) throw invalido('Escribí el nombre de la actividad.')
      const [a] = ok(
        await supabase
          .from('exercise_types')
          .insert({
            owner: k.uid,
            name: nombre.slice(0, 60),
            category: datos.category || 'otro',
            metrica: 'general',
            mets_suave: Number(datos.mets_suave),
            mets_medio: Number(datos.mets_medio),
            mets_fuerte: Number(datos.mets_fuerte),
            usa_distancia: false,
            usa_desnivel: false,
          })
          .select(),
      )
      k.setE((s) => ({ ...s, actividades: [...s.actividades, a] }))
      return a
    },
    { unica: true },
  ),

  borrarActividad: k.accion('borrarActividad', async (id) => {
    ok(await supabase.from('exercise_types').delete().eq('id', id))
    k.setE((s) => ({
      ...s,
      actividades: s.actividades.filter((a) => a.id !== id),
      // Los entrenamientos ya cargados se quedan con su nombre
      entrenamientos: s.entrenamientos.map((w) => (w.type_id === id ? { ...w, type_id: null } : w)),
    }))
  }),

  // ---------- Gimnasio: ejercicios propios ----------
  crearEjercicioGym: k.accion(
    'crearEjercicioGym',
    async (datos) => {
      const nombre = (datos.name || '').trim()
      if (!nombre) throw invalido('Escribí el nombre del ejercicio.')
      const [e] = ok(
        await supabase
          .from('gym_exercises')
          .insert({
            owner: k.uid,
            name: nombre.slice(0, 60),
            grupo: datos.grupo,
            equipo: datos.equipo || 'otro',
            peso_corporal: !!datos.peso_corporal,
          })
          .select(),
      )
      k.setE((s) => ({ ...s, ejerciciosGym: [...s.ejerciciosGym, e] }))
      return e
    },
    { unica: true },
  ),

  borrarEjercicioGym: k.accion('borrarEjercicioGym', async (id) => {
    const respuesta = await supabase.from('gym_exercises').delete().eq('id', id)
    // La base no deja borrar un ejercicio con series cargadas: se perdería el historial
    if (respuesta.error?.code === '23503')
      throw invalido('Ese ejercicio ya tiene series cargadas. Para no perder tu historial, no se puede borrar.')
    ok(respuesta)
    k.setE((s) => ({
      ...s,
      ejerciciosGym: s.ejerciciosGym.filter((e) => e.id !== id),
      rutinaItems: s.rutinaItems.filter((i) => i.exercise_id !== id),
    }))
  }),

  // ---------- Gimnasio: rutinas ----------
  // `ejercicios`: [{ exercise_id, sets_target, reps_min, reps_max, rest_seconds }] en el orden en que se hacen
  guardarRutina: k.accion(
    'guardarRutina',
    async ({ id, nombre, notas = null, ejercicios }) => {
      const rutinaId = id || nuevaClave()
      const r = ok(
        await supabase.rpc('guardar_rutina', {
          p_id: rutinaId,
          p_nombre: nombre,
          p_ejercicios: ejercicios,
          p_notas: notas,
        }),
      )
      k.setE((s) => ({
        ...s,
        rutinas: s.rutinas.some((x) => x.id === rutinaId)
          ? s.rutinas.map((x) => (x.id === rutinaId ? r.rutina : x))
          : [...s.rutinas, r.rutina],
        rutinaItems: [...s.rutinaItems.filter((i) => i.routine_id !== rutinaId), ...r.ejercicios],
      }))
      return r.rutina
    },
    { unica: true },
  ),

  borrarRutina: k.accion('borrarRutina', async (id) => {
    ok(await supabase.from('routines').delete().eq('id', id))
    k.setE((s) => ({
      ...s,
      rutinas: s.rutinas.filter((r) => r.id !== id),
      rutinaItems: s.rutinaItems.filter((i) => i.routine_id !== id),
      entrenamientos: s.entrenamientos.map((w) => (w.routine_id === id ? { ...w, routine_id: null } : w)),
    }))
  }),

  // ---------- Lo que sale del cálculo ----------
  // Pasa el cálculo nuevo a ser el objetivo fijo (calorías y proteína). Solo lo hace la persona, apretando el botón.
  usarComoObjetivo: k.accion('usarComoObjetivo', async ({ kcal, protein }) => {
    const [p] = ok(await supabase.from('profiles').update({ kcal_target: kcal, protein_target: protein }).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
  }),

  // Guarda el factor propio calculado con los datos de la persona (fase 4), o lo saca con `null`
  fijarFactorPropio: k.accion('fijarFactorPropio', async (factor) => {
    const cambios = factor == null ? { gasto_factor: null, gasto_factor_fecha: null } : { gasto_factor: factor, gasto_factor_fecha: hoy() }
    const [p] = ok(await supabase.from('profiles').update(cambios).eq('id', k.uid).select())
    k.setE((s) => ({ ...s, perfil: p }))
  }),
})

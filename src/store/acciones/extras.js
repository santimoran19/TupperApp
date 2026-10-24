// Lo de la 1.28: combos (F-09), copiar un día (F-08), opiniones (C-05) y el chat con IA (IA-01).
import { anotarEvento, VERSION } from '../../lib/eventos'
import { ok, supabase, traerTodo } from '../base'
import { invalido } from '../listas'
import { limpiarItems, MAX_COMBOS } from '../../lib/combos'

export const accionesExtras = (k) => ({
  guardarCombo: k.accion('guardarCombo', async (nombre, items) => {
    const v = k.ver()
    const name = String(nombre || '')
      .trim()
      .slice(0, 40)
    if (!name) throw invalido('Ponele un nombre al combo.')
    const limpios = limpiarItems(items, v)
    if (limpios.length === 0) throw invalido('El combo tiene que tener al menos un alimento o una receta.')
    if (v.e.combos.length >= MAX_COMBOS) throw invalido(`Llegaste al máximo de ${MAX_COMBOS} combos. Borrá alguno para sumar otro.`)
    const [fila] = ok(await supabase.from('combos').insert({ user_id: k.uid, name, items: limpios }).select())
    k.setE((s) => ({ ...s, combos: [...s.combos, fila] }))
    anotarEvento('combo', { accion: 'guardar', items: limpios.length })
  }),

  borrarCombo: k.accion('borrarCombo', async (id) => {
    ok(await supabase.from('combos').delete().eq('id', id))
    k.setE((s) => ({ ...s, combos: s.combos.filter((c) => c.id !== id) }))
  }),

  // Lo anotado entre dos fechas (o todo si `desde` es null), para la planilla (F-11). Se trae de la base: la app tiene solo los
  // últimos 90 días.
  traerRegistro: k.accion('traerRegistro', async ({ desde = null, hasta }) => {
    const consulta = () => {
      let q = supabase.from('log_entries').select('*').eq('user_id', k.uid).lte('date', hasta)
      if (desde) q = q.gte('date', desde)
      return q.order('date').order('id')
    }
    return await traerTodo(consulta)
  }),

  // Opinión desde la app ("Contanos qué te falta"). Devuelve true si llegó.
  enviarOpinion: k.accion('enviarOpinion', async ({ tipo, texto, pantalla }) => {
    const t = String(texto || '').trim()
    if (t.length < 3) throw invalido('Escribí un poco más.')
    ok(
      await supabase.from('opiniones').insert({
        user_id: k.uid,
        tipo: ['idea', 'problema', 'otra'].includes(tipo) ? tipo : 'otra',
        texto: t.slice(0, 2000),
        version: VERSION ? String(VERSION).slice(0, 20) : null,
        pantalla: pantalla ? String(pantalla).slice(0, 60) : null,
      }),
    )
  }),

  // Receta desde un texto (1.29, IA-04): { receta: { nombre, porciones, minutos, pasos, items } } o { error }
  leerRecetaIA: async (texto) => {
    try {
      const { data, error } = await supabase.functions.invoke('registrar-ia', { body: { tipo: 'receta', texto } })
      if (error) {
        const detalle = await error.context?.json?.().catch(() => null)
        anotarEvento('ia_receta', { resultado: 'error', codigo: detalle?.codigo || String(error.context?.status || 'red') })
        if (detalle?.mensaje) return { error: detalle.mensaje }
        return { error: 'No se pudo. Revisá la conexión y probá de nuevo.' }
      }
      if (!data?.receta?.items?.length) return { error: 'No encontré una receta en ese texto.' }
      anotarEvento('ia_receta', { resultado: 'ok', items: data.receta.items.length })
      return { receta: data.receta }
    } catch {
      return { error: 'No se pudo. Revisá la conexión y probá de nuevo.' }
    }
  },

  // Strava (1.30, F-22): { accion: 'estado' | 'conectar' | 'actividades' | 'desconectar', ... } → la respuesta de la función
  // o { error, codigo }. Los permisos de Strava quedan en el servidor: acá solo llega el resumen de cada actividad.
  strava: async (pedido) => {
    try {
      const { data, error } = await supabase.functions.invoke('strava', { body: pedido })
      if (error) {
        const detalle = await error.context?.json?.().catch(() => null)
        anotarEvento('strava', {
          accion: pedido.accion,
          resultado: 'error',
          codigo: detalle?.codigo || String(error.context?.status || 'red'),
        })
        return { error: detalle?.mensaje || 'No se pudo. Revisá la conexión y probá de nuevo.', codigo: detalle?.codigo || 'red' }
      }
      if (pedido.accion !== 'estado') anotarEvento('strava', { accion: pedido.accion, resultado: 'ok' })
      return data || {}
    } catch {
      return { error: 'No se pudo. Revisá la conexión y probá de nuevo.', codigo: 'red' }
    }
  },

  // Chat con IA (1.28): manda la conversación y un resumen del día a la función `asistente-ia`. No guarda nada en la base
  // (solo cuenta el mensaje para el tope diario). Devuelve { respuesta, restantes } o { error, codigo }.
  preguntarIA: async ({ mensajes, contexto }) => {
    try {
      const { data, error } = await supabase.functions.invoke('asistente-ia', { body: { mensajes, contexto } })
      if (error) {
        const detalle = await error.context?.json?.().catch(() => null)
        anotarEvento('ia_chat', { resultado: 'error', codigo: detalle?.codigo || String(error.context?.status || 'red') })
        if (detalle?.mensaje) return { error: detalle.mensaje, codigo: detalle.codigo }
        return {
          error:
            error.context?.status === 404 ? 'El asistente todavía no está disponible.' : 'No se pudo. Revisá la conexión y probá de nuevo.',
        }
      }
      if (typeof data?.respuesta !== 'string' || !data.respuesta.trim()) return { error: 'No se pudo responder. Probá de nuevo.' }
      anotarEvento('ia_chat', { resultado: 'ok', proveedor: data.proveedor || '' })
      return { respuesta: data.respuesta, anotar: data.anotar || null, restantes: data.restantes }
    } catch {
      return { error: 'No se pudo. Revisá la conexión y probá de nuevo.' }
    }
  },
})

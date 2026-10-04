// Devolución semanal con IA. La llama la app con la sesión del usuario:
//   POST /functions/v1/analizar-semana   { "semana": "AAAA-MM-DD", "hoy": "AAAA-MM-DD" }
// Lee la semana desde la base (con los permisos del usuario), se la pasa al modelo y guarda la devolución.
// Necesita el secreto ANTHROPIC_API_KEY. Opcionales: ANTHROPIC_MODEL e IA_LIMITE_DIARIO.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { armarDatos, esFecha, INSTRUCCIONES, interpretar, lunesDe, sumarDias } from './logica.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const MODELO = Deno.env.get('ANTHROPIC_MODEL') || 'claude-haiku-4-5-20251001'
const URL_IA = Deno.env.get('ANTHROPIC_URL') || 'https://api.anthropic.com/v1/messages'
const LIMITE_DIARIO = Number(Deno.env.get('IA_LIMITE_DIARIO')) || 3
const MINIMO_DIAS = 2

const responder = (estado: number, cuerpo: unknown) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { ...CORS, 'Content-Type': 'application/json' } })
const fallo = (estado: number, codigo: string, mensaje: string) => responder(estado, { codigo, mensaje })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return fallo(405, 'metodo', 'Método no permitido.')
  try {
    // ---- Quién llama
    const autorizacion = req.headers.get('Authorization') || ''
    if (!autorizacion.startsWith('Bearer ')) return fallo(401, 'sin_sesion', 'Iniciá sesión para pedir el análisis.')
    const apikey = req.headers.get('apikey') || Deno.env.get('SUPABASE_ANON_KEY') || ''
    const db = createClient(Deno.env.get('SUPABASE_URL')!, apikey, {
      global: { headers: { Authorization: autorizacion } },
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: sesion } = await db.auth.getUser(autorizacion.slice(7))
    const usuario = sesion?.user
    if (!usuario) return fallo(401, 'sin_sesion', 'Iniciá sesión para pedir el análisis.')

    // ---- Qué semana
    const cuerpo = await req.json().catch(() => ({}))
    const hoyServidor = new Date().toISOString().slice(0, 10)
    // "Hoy" lo dice el teléfono (por la zona horaria), pero no puede alejarse más de un día del reloj del servidor
    const hoy = esFecha(cuerpo.hoy) && cuerpo.hoy >= sumarDias(hoyServidor, -1) && cuerpo.hoy <= sumarDias(hoyServidor, 1) ? cuerpo.hoy : hoyServidor
    if (!esFecha(cuerpo.semana)) return fallo(400, 'semana', 'Falta la semana a analizar.')
    const lunes = lunesDe(cuerpo.semana)
    if (lunes > hoy || lunes < sumarDias(hoy, -100)) return fallo(400, 'semana', 'Esa semana no se puede analizar.')
    const domingo = sumarDias(lunes, 6)

    // ---- ¿Está configurada la IA? ¿Le queda cupo?
    const clave = Deno.env.get('ANTHROPIC_API_KEY')
    if (!clave) return fallo(503, 'sin_configurar', 'El análisis con IA todavía no está activado.')
    const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const usos = await db.from('ai_analyses').select('id').eq('user_id', usuario.id).gte('created_at', haceUnDia)
    if (usos.error) throw new Error('usos: ' + usos.error.message)
    if (usos.data.length >= LIMITE_DIARIO) {
      return fallo(429, 'limite', `Ya pediste ${LIMITE_DIARIO} análisis en las últimas 24 horas. Probá de nuevo mañana.`)
    }

    // ---- Datos de la semana (los permisos de la base dejan leer solo lo propio)
    const [perfil, registros, medidas] = await Promise.all([
      db.from('profiles').select('*').eq('id', usuario.id).maybeSingle(),
      db.from('log_entries').select('date,meal,name,food_id,qty,kcal,protein,carbs,fat,skipped').eq('user_id', usuario.id).gte('date', lunes).lte('date', domingo).limit(1000),
      db.from('measurements').select('date,weight_kg').eq('user_id', usuario.id).gte('date', sumarDias(lunes, -56)).lte('date', domingo).order('date'),
    ])
    for (const r of [perfil, registros, medidas]) if (r.error) throw new Error('datos: ' + r.error.message)
    if (!perfil.data) return fallo(422, 'sin_perfil', 'Completá tu perfil antes de pedir el análisis.')
    const ids = [...new Set((registros.data || []).map((r) => r.food_id).filter(Boolean))]
    const alimentos = ids.length ? await db.from('foods').select('id,unit,category,alcohol').in('id', ids) : { data: [], error: null }
    if (alimentos.error) throw new Error('alimentos: ' + alimentos.error.message)

    const { datos, diasConRegistro } = armarDatos({ perfil: perfil.data, registros: registros.data || [], alimentos: alimentos.data || [], medidas: medidas.data || [], lunes, hoy })
    if (diasConRegistro < MINIMO_DIAS) return fallo(422, 'pocos_datos', `Hace falta registrar al menos ${MINIMO_DIAS} días de la semana para poder analizarla.`)

    // ---- Consulta al modelo
    const ia = await fetch(URL_IA, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': clave, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 900,
        system: INSTRUCCIONES,
        messages: [{ role: 'user', content: 'Datos de la semana:\n' + JSON.stringify(datos) }],
      }),
      signal: AbortSignal.timeout(45000),
    })
    if (!ia.ok) {
      const detalle = await ia.json().catch(() => null)
      console.error('IA respondió', ia.status, detalle?.error?.type, detalle?.error?.message)
      if (ia.status === 401 || ia.status === 403) return fallo(503, 'sin_configurar', 'El análisis con IA no está bien configurado.')
      if (ia.status === 429 || ia.status === 529) return fallo(503, 'ocupado', 'La IA está con mucha demanda. Probá de nuevo en unos minutos.')
      return fallo(502, 'error_ia', 'No se pudo generar el análisis. Probá de nuevo en un rato.')
    }
    const salida = await ia.json()
    if (salida.stop_reason === 'refusal') return fallo(502, 'error_ia', 'No se pudo generar el análisis para esta semana.')
    const escrito = (salida.content || []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('\n')
    const contenido = interpretar(escrito)

    // ---- Se guarda y se devuelve
    const guardado = await db.from('ai_analyses').insert({ user_id: usuario.id, week_start: lunes, content: contenido, model: MODELO }).select().single()
    if (guardado.error) throw new Error('guardar: ' + guardado.error.message)
    return responder(200, { analisis: guardado.data, restantes: Math.max(0, LIMITE_DIARIO - usos.data.length - 1) })
  } catch (err) {
    console.error('analizar-semana', err)
    const cortado = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')
    return fallo(cortado ? 504 : 500, cortado ? 'demora' : 'error', cortado ? 'La IA tardó demasiado en responder. Probá de nuevo.' : 'Algo salió mal al generar el análisis.')
  }
})

// Chat con IA (1.28, IA-01). La llama la app con la sesión del usuario:
//   POST /functions/v1/asistente-ia   { "mensajes": [{ "role": "user", "content": "¿Qué ceno?" }], "contexto": { ...resumen del día } }
// Devuelve { respuesta, restantes, proveedor }. No guarda la conversación: solo cuenta el mensaje en ai_usos (tipo 'chat')
// para el tope diario. Necesita la actualización 21 de la base y al menos un proveedor cargado como secreto (proveedores.ts).
import { createClient } from 'npm:@supabase/supabase-js@2'
import { armarMensajes, contextoTexto, encabezadosCors, limpiarMensajes, limpiarRespuesta, origenAjeno, origenesPermitidos } from './logica.ts'
import { conversar, hayProveedores } from './proveedores.ts'

const CABECERAS = 'authorization, x-client-info, apikey, content-type'
const PERMITIDOS = origenesPermitidos(Deno.env.get('ORIGENES_PERMITIDOS'))
// Mensajes por cuenta cada 24 horas. El cupo gratis de la IA lo comparten todos los usuarios.
const LIMITE_DIARIO = Math.min(Number(Deno.env.get('ASISTENTE_LIMITE_DIARIO')) || 30, 200)

const responder = (estado: number, cuerpo: unknown) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'Content-Type': 'application/json' } })
const fallo = (estado: number, codigo: string, mensaje: string) => responder(estado, { codigo, mensaje })

Deno.serve(async (req) => {
  const origen = req.headers.get('Origin')
  if (origenAjeno(origen, PERMITIDOS)) return fallo(403, 'origen', 'Pedido no permitido desde esta página.')
  const respuesta = await manejar(req)
  for (const [k, v] of Object.entries(encabezadosCors(origen, PERMITIDOS, CABECERAS))) respuesta.headers.set(k, v)
  return respuesta
})

async function manejar(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok')
  if (req.method !== 'POST') return fallo(405, 'metodo', 'Método no permitido.')
  try {
    const autorizacion = req.headers.get('Authorization') || ''
    if (!autorizacion.startsWith('Bearer ')) return fallo(401, 'sin_sesion', 'Iniciá sesión para usar esto.')
    const apikey = req.headers.get('apikey') || Deno.env.get('SUPABASE_ANON_KEY') || ''
    const db = createClient(Deno.env.get('SUPABASE_URL')!, apikey, {
      global: { headers: { Authorization: autorizacion } },
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: sesion } = await db.auth.getUser(autorizacion.slice(7))
    const usuario = sesion?.user
    if (!usuario) return fallo(401, 'sin_sesion', 'Iniciá sesión para usar esto.')

    const cuerpo = await req.json().catch(() => ({}))
    const mensajes = limpiarMensajes(cuerpo.mensajes)
    if (!mensajes) return fallo(400, 'mensajes', 'Escribí tu pregunta.')

    if (!hayProveedores()) return fallo(503, 'sin_configurar', 'El asistente todavía no está activado.')
    const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const usos = await db
      .from('ai_usos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', usuario.id)
      .eq('kind', 'chat')
      .gte('created_at', haceUnDia)
    if (usos.error) throw new Error('usos: ' + usos.error.message)
    if ((usos.count ?? 0) >= LIMITE_DIARIO)
      return fallo(429, 'limite', `Llegaste al máximo de ${LIMITE_DIARIO} preguntas por día. Probá mañana.`)
    const anotado = await db.from('ai_usos').insert({ user_id: usuario.id, kind: 'chat' })
    if (anotado.error) throw new Error('anotar: ' + anotado.error.message)
    await db.from('ai_usos').delete().eq('user_id', usuario.id).lt('created_at', new Date(Date.now() - 2 * 86400000).toISOString())
    const restantes = Math.max(0, LIMITE_DIARIO - (usos.count ?? 0) - 1)

    const salida = await conversar(armarMensajes(mensajes, contextoTexto(cuerpo.contexto)), AbortSignal.timeout(40000))
    if (!salida.ok) {
      console.error('asistente-ia proveedor', salida.estado, salida.detalle)
      if (salida.estado === 401 || salida.estado === 403) return fallo(503, 'sin_configurar', 'El asistente no está bien configurado.')
      if ([429, 498, 503, 529].includes(salida.estado))
        return fallo(503, 'ocupado', 'La IA está con mucha demanda. Probá de nuevo en unos minutos.')
      return fallo(502, 'error_ia', 'No se pudo responder. Probá de nuevo.')
    }
    return responder(200, { respuesta: limpiarRespuesta(salida.texto), restantes, proveedor: salida.proveedor })
  } catch (err) {
    console.error('asistente-ia', err)
    const cortado = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')
    return fallo(
      cortado ? 504 : 500,
      cortado ? 'demora' : 'error',
      cortado ? 'La IA tardó demasiado en responder. Probá de nuevo.' : 'Algo salió mal. Probá de nuevo.',
    )
  }
}

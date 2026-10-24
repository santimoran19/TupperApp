// Cargar una comida con foto, voz o texto (1.27). La llama la app con la sesión del usuario:
//   POST /functions/v1/registrar-ia   { "tipo": "foto", "imagen": "<base64>", "mime": "image/jpeg" }
//                                     { "tipo": "voz",  "audio": "<base64>",  "mime": "audio/webm" }
//                                     { "tipo": "texto", "texto": "dos milanesas con ensalada" }
//                                     { "tipo": "receta", "texto": "<receta pegada>" }  (1.29: devuelve { receta, restantes })
// Devuelve { items: [{ nombre, cantidad, unidad, gramos, confianza }], texto?, restantes }. La app los cruza con sus alimentos y la
// persona confirma o corrige antes de anotar nada. No se guarda la foto, el audio ni lo dicho: solo se cuenta el pedido (ai_usos).
// Necesita al menos un proveedor cargado como secreto (ver proveedores.ts) y la actualización 20 de la base.
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  bytesDeBase64,
  encabezadosCors,
  esBase64,
  INSTRUCCIONES_COMIDA,
  INSTRUCCIONES_RECETA,
  interpretarItems,
  interpretarReceta,
  MAX_AUDIO,
  MAX_IMAGEN,
  MAX_TEXTO,
  MAX_TEXTO_RECETA,
  origenAjeno,
  origenesPermitidos,
  PISTA_VOZ,
  TIPOS_AUDIO,
  TIPOS_IMAGEN,
  tipoBase,
} from './logica.ts'
import { hayProveedores, leerFoto, leerTexto, transcribir } from './proveedores.ts'

const CABECERAS = 'authorization, x-client-info, apikey, content-type'
const PERMITIDOS = origenesPermitidos(Deno.env.get('ORIGENES_PERMITIDOS'))
// Cuántos pedidos por cuenta cada 24 horas (entre foto, voz y texto). El cupo gratis de la IA lo comparten todos los usuarios.
const LIMITE_DIARIO = Math.min(Number(Deno.env.get('REGISTRO_IA_LIMITE_DIARIO')) || 30, 200)

const responder = (estado: number, cuerpo: unknown) => new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'Content-Type': 'application/json' } })
const fallo = (estado: number, codigo: string, mensaje: string) => responder(estado, { codigo, mensaje })

Deno.serve(async (req) => {
  const origen = req.headers.get('Origin')
  if (origenAjeno(origen, PERMITIDOS)) return fallo(403, 'origen', 'Pedido no permitido desde esta página.')
  const respuesta = await manejar(req)
  for (const [k, v] of Object.entries(encabezadosCors(origen, PERMITIDOS, CABECERAS))) respuesta.headers.set(k, v)
  return respuesta
})

const desdeBase64 = (b64: string) => Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0))

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

    // ---- Qué se pide, y que venga bien armado
    const cuerpo = await req.json().catch(() => ({}))
    const tipo = cuerpo.tipo
    if (!['foto', 'voz', 'texto', 'receta'].includes(tipo)) return fallo(400, 'tipo', 'Pedido incorrecto.')
    let bytes: Uint8Array | null = null
    let mime = ''
    let texto = ''
    if (tipo === 'foto') {
      mime = tipoBase(cuerpo.mime)
      if (!TIPOS_IMAGEN.includes(mime) || !esBase64(cuerpo.imagen)) return fallo(400, 'imagen', 'La foto no es válida.')
      if (bytesDeBase64(cuerpo.imagen) > MAX_IMAGEN) return fallo(413, 'grande', 'La foto es demasiado grande.')
    } else if (tipo === 'voz') {
      mime = tipoBase(cuerpo.mime)
      if (!TIPOS_AUDIO.includes(mime) || !esBase64(cuerpo.audio)) return fallo(400, 'audio', 'El audio no es válido.')
      if (bytesDeBase64(cuerpo.audio) > MAX_AUDIO) return fallo(413, 'grande', 'El audio es demasiado largo.')
      bytes = desdeBase64(cuerpo.audio)
    } else if (tipo === 'receta') {
      texto = String(cuerpo.texto || '').trim().slice(0, MAX_TEXTO_RECETA)
      if (texto.length < 20) return fallo(400, 'texto', 'Pegá la receta entera, con los ingredientes.')
    } else {
      texto = String(cuerpo.texto || '').trim().slice(0, MAX_TEXTO)
      if (texto.length < 2) return fallo(400, 'texto', 'Escribí qué comiste.')
    }

    // ---- ¿Está configurada? ¿Le queda cupo?
    if (!hayProveedores()) return fallo(503, 'sin_configurar', 'Esta función todavía no está activada.')
    const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const usos = await db.from('ai_usos').select('id', { count: 'exact', head: true }).eq('user_id', usuario.id).gte('created_at', haceUnDia)
    if (usos.error) throw new Error('usos: ' + usos.error.message)
    if ((usos.count ?? 0) >= LIMITE_DIARIO) return fallo(429, 'limite', `Llegaste al máximo de ${LIMITE_DIARIO} pedidos por día. Probá mañana o cargá la comida a mano.`)
    // Se cuenta antes de consultar (si fallara el proveedor igual consumió cupo de la red: evita que se repita sin parar)
    // La receta cuenta como un pedido de texto (la tabla acepta foto, voz, texto y chat)
    const anotado = await db.from('ai_usos').insert({ user_id: usuario.id, kind: tipo === 'receta' ? 'texto' : tipo })
    if (anotado.error) throw new Error('anotar: ' + anotado.error.message)
    // Limpieza: las filas de más de 2 días no hacen falta
    await db.from('ai_usos').delete().eq('user_id', usuario.id).lt('created_at', new Date(Date.now() - 2 * 86400000).toISOString())
    const restantes = Math.max(0, LIMITE_DIARIO - (usos.count ?? 0) - 1)

    // ---- Consulta
    const signal = AbortSignal.timeout(40000)
    let dicho: string | undefined
    let salida
    if (tipo === 'receta') {
      const r = await leerTexto(INSTRUCCIONES_RECETA, texto, signal, 2500)
      if (!r.ok) return errorDeProveedor(r.estado, r.detalle)
      const receta = interpretarReceta(r.valor)
      if (!receta) return fallo(422, 'no_es_receta', 'No encontré una receta con ingredientes en ese texto.')
      return responder(200, { receta, restantes, proveedor: r.proveedor })
    }
    if (tipo === 'foto') {
      salida = await leerFoto(INSTRUCCIONES_COMIDA, `data:${mime};base64,${String(cuerpo.imagen).replace(/\s/g, '')}`, signal)
    } else {
      if (tipo === 'voz') {
        const t = await transcribir(bytes!, mime, PISTA_VOZ, signal)
        if (!t.ok) return errorDeProveedor(t.estado, t.detalle)
        dicho = t.valor
        if (dicho.length < 2) return fallo(422, 'no_se_entendio', 'No se entendió el audio. Probá de nuevo, más cerca del micrófono.')
        texto = dicho.slice(0, MAX_TEXTO)
      }
      salida = await leerTexto(INSTRUCCIONES_COMIDA, texto, signal)
    }
    if (!salida.ok) return errorDeProveedor(salida.estado, salida.detalle)
    const items = interpretarItems(salida.valor)
    return responder(200, { items, ...(dicho !== undefined ? { texto: dicho } : {}), restantes, proveedor: salida.proveedor })
  } catch (err) {
    console.error('registrar-ia', err)
    const cortado = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')
    return fallo(cortado ? 504 : 500, cortado ? 'demora' : 'error', cortado ? 'La IA tardó demasiado en responder. Probá de nuevo.' : 'Algo salió mal. Probá de nuevo.')
  }
}

function errorDeProveedor(estado: number, detalle: string): Response {
  console.error('registrar-ia proveedor', estado, detalle)
  if (estado === 401 || estado === 403) return fallo(503, 'sin_configurar', 'Esta función no está bien configurada.')
  if ([429, 498, 503, 529].includes(estado)) return fallo(503, 'ocupado', 'La IA está con mucha demanda. Probá de nuevo en unos minutos.')
  return fallo(502, 'error_ia', 'No se pudo leer. Probá de nuevo o cargala a mano.')
}

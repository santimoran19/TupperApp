// Strava (1.30, F-22): conectar la cuenta y traer las actividades para anotarlas como entrenamientos.
// La llama la app con la sesión del usuario:
//   POST /functions/v1/strava { "accion": "estado" }                         → { conectado, atleta? }
//   POST /functions/v1/strava { "accion": "conectar", "code", "scope" }      → { conectado: true, atleta }
//   POST /functions/v1/strava { "accion": "actividades", "desde": "AAAA-MM-DD", "pagina": 1 } → { actividades: [...] }
//   POST /functions/v1/strava { "accion": "desconectar" }                    → { conectado: false }
// Los permisos de Strava (tokens) se guardan en strava_conexiones, que la app no puede leer: solo esta función, con la
// clave de servicio. La app recibe un resumen de cada actividad (sin mapa ni ubicación) y decide qué anotar.
// Necesita la actualización 23 y los secretos STRAVA_CLIENT_ID y STRAVA_CLIENT_SECRET (ver LEEME.md).
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  alcanceAlcanza,
  codigoValido,
  desdeSegundos,
  encabezadosCors,
  esAccion,
  hayQueRenovar,
  origenAjeno,
  origenesPermitidos,
  resumirActividades,
} from './logica.ts'

const CABECERAS = 'authorization, x-client-info, apikey, content-type'
const PERMITIDOS = origenesPermitidos(Deno.env.get('ORIGENES_PERMITIDOS'))
const CLIENTE = Deno.env.get('STRAVA_CLIENT_ID') || ''
const SECRETO = Deno.env.get('STRAVA_CLIENT_SECRET') || ''
// Solo para las pruebas (el Supabase simulado hace de Strava); en Supabase no se carga
const STRAVA = (Deno.env.get('STRAVA_URL') || 'https://www.strava.com').replace(/\/+$/, '')

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

// deno-lint-ignore no-explicit-any
type Db = any

async function pedirToken(datos: Record<string, string>) {
  const r = await fetch(`${STRAVA}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENTE, client_secret: SECRETO, ...datos }),
    signal: AbortSignal.timeout(10000),
  })
  if (!r.ok) throw Object.assign(new Error('strava token ' + r.status), { estado: r.status })
  return await r.json()
}

// El permiso vigente de la persona (renovado si hace falta), o null si no conectó Strava
async function permiso(db: Db, uid: string): Promise<string | null> {
  const { data: fila } = await db.from('strava_conexiones').select('*').eq('user_id', uid).maybeSingle()
  if (!fila) return null
  if (!hayQueRenovar(fila.expira_en)) return fila.access_token
  const t = await pedirToken({ grant_type: 'refresh_token', refresh_token: fila.refresh_token })
  await db
    .from('strava_conexiones')
    .update({ access_token: t.access_token, refresh_token: t.refresh_token, expira_en: new Date(t.expires_at * 1000).toISOString() })
    .eq('user_id', uid)
  return t.access_token
}

async function manejar(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok')
  if (req.method !== 'POST') return fallo(405, 'metodo', 'Método no permitido.')
  if (!CLIENTE || !SECRETO) return fallo(503, 'sin_configurar', 'La conexión con Strava todavía no está activada.')
  try {
    const autorizacion = req.headers.get('Authorization') || ''
    if (!autorizacion.startsWith('Bearer ')) return fallo(401, 'sin_sesion', 'Iniciá sesión para usar esto.')
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: sesion } = await db.auth.getUser(autorizacion.slice(7))
    const usuario = sesion?.user
    if (!usuario) return fallo(401, 'sin_sesion', 'Iniciá sesión para usar esto.')
    // Con la verificación en dos pasos activada, también hace falta haber entrado con el código
    const nivel = JSON.parse(atob(autorizacion.slice(7).split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).aal
    const conFactor = (usuario.factors || []).some((f: { status: string }) => f.status === 'verified')
    if (conFactor && nivel !== 'aal2') return fallo(403, 'dos_pasos', 'Falta el código de verificación.')

    const cuerpo = await req.json().catch(() => ({}))
    if (!esAccion(cuerpo.accion)) return fallo(400, 'accion', 'Pedido no válido.')

    if (cuerpo.accion === 'estado') {
      const { data: fila } = await db.from('strava_conexiones').select('atleta').eq('user_id', usuario.id).maybeSingle()
      return responder(200, { conectado: !!fila, atleta: fila?.atleta || null })
    }

    if (cuerpo.accion === 'conectar') {
      if (!codigoValido(cuerpo.code)) return fallo(400, 'codigo', 'Strava no devolvió un código válido. Probá de nuevo.')
      if (!alcanceAlcanza(cuerpo.scope))
        return fallo(400, 'permiso', 'Para traer tus entrenamientos hace falta dejar marcado "ver tus actividades" en Strava.')
      const t = await pedirToken({ grant_type: 'authorization_code', code: cuerpo.code }).catch(() => null)
      if (!t?.access_token) return fallo(400, 'codigo', 'No se pudo conectar con Strava. Probá de nuevo.')
      const atleta = String(t.athlete?.firstname || '').slice(0, 40) || null
      const { error } = await db.from('strava_conexiones').upsert(
        {
        user_id: usuario.id,
        atleta_id: t.athlete?.id ?? null,
        atleta,
        access_token: t.access_token,
        refresh_token: t.refresh_token,
        expira_en: new Date(t.expires_at * 1000).toISOString(),
        alcance: String(cuerpo.scope).slice(0, 200),
        },
        { onConflict: 'user_id' },
      )
      if (error) throw error
      return responder(200, { conectado: true, atleta })
    }

    if (cuerpo.accion === 'desconectar') {
      const token = await permiso(db, usuario.id).catch(() => null)
      if (token)
        await fetch(`${STRAVA}/oauth/deauthorize`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10000),
        }).catch(() => null)
      await db.from('strava_conexiones').delete().eq('user_id', usuario.id)
      return responder(200, { conectado: false })
    }

    // actividades
    const token = await permiso(db, usuario.id)
    if (!token) return fallo(409, 'sin_conectar', 'Primero conectá tu cuenta de Strava.')
    const pagina = Math.min(10, Math.max(1, Math.round(Number(cuerpo.pagina) || 1)))
    const url = `${STRAVA}/api/v3/athlete/activities?after=${desdeSegundos(cuerpo.desde)}&per_page=50&page=${pagina}`
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000) })
    if (r.status === 401) {
      // Le sacaron el permiso desde Strava: se olvida la conexión
      await db.from('strava_conexiones').delete().eq('user_id', usuario.id)
      return fallo(409, 'sin_conectar', 'Strava ya no da permiso. Conectá tu cuenta de nuevo.')
    }
    if (r.status === 429) return fallo(429, 'limite', 'Strava está recibiendo muchos pedidos. Probá en unos minutos.')
    if (!r.ok) return fallo(502, 'strava', 'Strava no respondió. Probá en un rato.')
    return responder(200, { actividades: resumirActividades(await r.json()) })
  } catch (e) {
    console.error('strava', e)
    return fallo(500, 'error', 'No se pudo. Probá de nuevo en un rato.')
  }
}

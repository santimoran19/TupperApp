// Códigos de recuperación de la verificación en dos pasos (1.32, S-08). La llama la app con la sesión de la persona:
//   POST /functions/v1/dos-pasos { "accion": "estado" }               → { quedan }
//   POST /functions/v1/dos-pasos { "accion": "generar" }              → { codigos: ["ABCD-EFGH", ...] } (se ven una sola vez)
//   POST /functions/v1/dos-pasos { "accion": "usar", "codigo": "..." } → { ok: true }
// "generar" pide haber entrado con el código de la app autenticadora. "usar" es para quien perdió el teléfono: con la
// contraseña ya puesta y un código de recuperación, se le saca la verificación en dos pasos (puede volver a activarla).
// En la base solo queda la huella de cada código (codigos_recuperacion, que la app no puede leer). Se corta a quien
// prueba más de 5 códigos por hora. Necesita la actualización 25.
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  codigoValido,
  encabezadosCors,
  esAccion,
  generarCodigos,
  huella,
  MAX_INTENTOS_POR_HORA,
  nivelDe,
  origenAjeno,
  origenesPermitidos,
} from './logica.ts'

const CABECERAS = 'authorization, x-client-info, apikey, content-type'
const PERMITIDOS = origenesPermitidos(Deno.env.get('ORIGENES_PERMITIDOS'))

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
    const token = autorizacion.slice(7)
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: sesion } = await db.auth.getUser(token)
    const usuario = sesion?.user
    if (!usuario) return fallo(401, 'sin_sesion', 'Iniciá sesión para usar esto.')
    const conFactor = (usuario.factors || []).some((f: { status: string }) => f.status === 'verified')

    const cuerpo = await req.json().catch(() => ({}))
    if (!esAccion(cuerpo.accion)) return fallo(400, 'accion', 'Pedido no válido.')

    if (cuerpo.accion === 'estado') {
      if (conFactor && nivelDe(token) !== 'aal2') return fallo(403, 'dos_pasos', 'Falta el código de verificación.')
      const { count } = await db
        .from('codigos_recuperacion')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', usuario.id)
        .is('usado_en', null)
      return responder(200, { quedan: count ?? 0 })
    }

    if (cuerpo.accion === 'generar') {
      if (!conFactor) return fallo(400, 'sin_dos_pasos', 'Primero activá la verificación en dos pasos.')
      if (nivelDe(token) !== 'aal2') return fallo(403, 'dos_pasos', 'Falta el código de verificación.')
      const codigos = generarCodigos((n) => crypto.getRandomValues(new Uint8Array(n)))
      const filas = await Promise.all(codigos.map(async (c) => ({ user_id: usuario.id, huella: await huella(usuario.id, c) })))
      // Los nuevos reemplazan a los anteriores (usados o no)
      const borrar = await db.from('codigos_recuperacion').delete().eq('user_id', usuario.id)
      if (borrar.error) throw borrar.error
      const { error } = await db.from('codigos_recuperacion').insert(filas)
      if (error) throw error
      return responder(200, { codigos })
    }

    // usar
    if (!conFactor) return fallo(400, 'sin_dos_pasos', 'Tu cuenta no tiene la verificación en dos pasos activada.')
    const haceUnaHora = new Date(Date.now() - 3600000).toISOString()
    const { count: intentos } = await db
      .from('recuperacion_intentos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', usuario.id)
      .gte('created_at', haceUnaHora)
    if ((intentos ?? 0) >= MAX_INTENTOS_POR_HORA)
      return fallo(429, 'limite', 'Probaste demasiados códigos. Esperá una hora y probá de nuevo.')
    await db.from('recuperacion_intentos').insert({ user_id: usuario.id })
    await db.from('recuperacion_intentos').delete().eq('user_id', usuario.id).lt('created_at', new Date(Date.now() - 86400000).toISOString())
    if (!codigoValido(cuerpo.codigo)) return fallo(400, 'codigo', 'Ese código no es válido. Revisalo y probá de nuevo.')
    const h = await huella(usuario.id, cuerpo.codigo)
    const { data: fila } = await db
      .from('codigos_recuperacion')
      .select('id')
      .eq('user_id', usuario.id)
      .eq('huella', h)
      .is('usado_en', null)
      .maybeSingle()
    if (!fila) return fallo(400, 'codigo', 'Ese código no es válido o ya se usó. Revisalo y probá de nuevo.')
    await db.from('codigos_recuperacion').update({ usado_en: new Date().toISOString() }).eq('id', fila.id)
    // Se le sacan todos los factores: entra con la contraseña y puede volver a activar la verificación con otro teléfono
    const { data: lista, error: e1 } = await db.auth.admin.mfa.listFactors({ userId: usuario.id })
    if (e1) throw e1
    for (const f of lista?.factors || []) {
      const { error } = await db.auth.admin.mfa.deleteFactor({ id: f.id, userId: usuario.id })
      if (error) throw error
    }
    // Los que quedaban ya no sirven (eran de la verificación que se apagó)
    await db.from('codigos_recuperacion').delete().eq('user_id', usuario.id)
    return responder(200, { ok: true })
  } catch (e) {
    console.error('dos-pasos', e)
    return fallo(500, 'error', 'No se pudo. Probá de nuevo en un rato.')
  }
}

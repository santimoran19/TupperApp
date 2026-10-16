// Iniciar sesión con el nombre de usuario en vez del email. La llama la app (sin sesión):
//   POST /functions/v1/entrar   { "usuario": "santi", "clave": "...", "captchaToken": "..." }
// Busca el email de esa cuenta, inicia la sesión en Supabase con él y le devuelve a la app solo la sesión. El email
// nunca sale de acá, y si el usuario no existe se contesta igual que con una contraseña equivocada.
// Necesita los datos que Supabase le da solo a las funciones: SUPABASE_URL y las claves del proyecto. Usa las claves de
// siempre (SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY) y, cuando Supabase las apague (a fin de 2026), las nuevas
// (SUPABASE_PUBLISHABLE_KEYS y SUPABASE_SECRET_KEYS, la llamada "default").
// Se publica SIN verificación de JWT: quien inicia sesión todavía no tiene ninguno. No hace falta: la función no hace
// nada privilegiado si no llega la contraseña correcta, y el pedido lleva el captcha igual que el del email.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { codigoDeError, EMAIL_DE_MENTIRA, FORMATO_USUARIO, leerPedido } from './logica.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-api-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const responder = (estado: number, cuerpo: unknown) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { ...CORS, 'Content-Type': 'application/json' } })

// Las claves del proyecto: las de siempre si están y, si no, las nuevas (vienen en un JSON con el nombre de cada una)
const nuevas = (nombre: string): string => {
  try {
    return JSON.parse(Deno.env.get(nombre) ?? '{}').default ?? ''
  } catch {
    return ''
  }
}
const clavePublica = () => Deno.env.get('SUPABASE_ANON_KEY') || nuevas('SUPABASE_PUBLISHABLE_KEYS')
const claveSecreta = () => Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || nuevas('SUPABASE_SECRET_KEYS')

const sinSesion = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return responder(405, { codigo: 'metodo' })
  try {
    const pedido = leerPedido(await req.json().catch(() => null))
    if (!pedido) return responder(400, { codigo: 'pedido' })

    const url = Deno.env.get('SUPABASE_URL')!
    const admin = createClient(url, claveSecreta(), sinSesion)

    // ---- Quién es: el email de esa cuenta (solo si el formato es de un usuario posible)
    let email = ''
    if (FORMATO_USUARIO.test(pedido.usuario)) {
      const perfil = await admin.from('profiles').select('id').eq('username', pedido.usuario).maybeSingle()
      if (perfil.error) throw new Error('perfil: ' + perfil.error.message)
      if (perfil.data) {
        const cuenta = await admin.auth.admin.getUserById(perfil.data.id)
        email = cuenta.data?.user?.email || ''
      }
    }

    // ---- Se inicia la sesión. Si no hay cuenta, se hace igual con una casilla falsa: tarda parecido y da el mismo error.
    const anonimo = createClient(url, clavePublica(), sinSesion)
    const { data, error } = await anonimo.auth.signInWithPassword({
      email: email || EMAIL_DE_MENTIRA,
      password: pedido.clave,
      options: { captchaToken: pedido.captcha },
    })
    if (error || !data.session || !email) return responder(200, { codigo: error ? codigoDeError(error.message) : 'credenciales' })
    return responder(200, { sesion: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } })
  } catch (err) {
    console.error('entrar', err instanceof Error ? err.message : err)
    return responder(500, { codigo: 'error' })
  }
})

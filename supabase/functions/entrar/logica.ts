// Lo que no depende de Supabase en la función `entrar`, para poder probarlo aparte (pruebas/unidad/entrar.test.ts).

// Mismo formato que valida la app y la base (src/lib/validar.js, supabase/actualizacion-12.sql). Acá alcanza con el
// formato: si el usuario no existe, el resultado es el mismo que con una contraseña equivocada.
export const FORMATO_USUARIO = /^[a-z0-9][a-z0-9._-]{1,18}[a-z0-9]$/
// La contraseña más larga que acepta la app (src/lib/validar.js, LIM.clave)
export const LARGO_MAXIMO_CLAVE = 72
// Casilla que no existe ni puede existir (el dominio .invalid está reservado): con ella se hace el mismo pedido de
// inicio de sesión cuando el usuario no existe, para que tarde parecido y no delate si existe o no.
export const EMAIL_DE_MENTIRA = 'nadie@tupper.invalid'

export const normalizar = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : '')

export type Pedido = { usuario: string; clave: string; captcha?: string }

// Lee el cuerpo del pedido. Devuelve null si viene mal armado.
export function leerPedido(cuerpo: unknown): Pedido | null {
  if (!cuerpo || typeof cuerpo !== 'object') return null
  const { usuario, clave, captchaToken } = cuerpo as Record<string, unknown>
  if (typeof clave !== 'string' || clave.length === 0 || clave.length > LARGO_MAXIMO_CLAVE) return null
  if (typeof usuario !== 'string' || usuario.length > 60) return null
  return { usuario: normalizar(usuario), clave, captcha: typeof captchaToken === 'string' && captchaToken ? captchaToken : undefined }
}

// Qué le contesta la función a la app cuando Supabase rechaza el inicio de sesión. Nunca dice si el usuario existe.
export function codigoDeError(mensaje: string): 'captcha' | 'espera' | 'credenciales' {
  if (/captcha/i.test(mensaje)) return 'captcha'
  if (/rate limit|too many|only request this after/i.test(mensaje)) return 'espera'
  return 'credenciales'
}

// ---- Desde qué páginas se puede llamar a la función (CORS)
// Solo la app. Otras páginas (o un servidor de pruebas) se agregan con el secreto ORIGENES_PERMITIDOS, separadas por coma
// (por ejemplo: https://tupperapp.vercel.app,https://mi-dominio.com): se cambia en el panel de Supabase, sin publicar la función.
export const ORIGEN_DE_LA_APP = 'https://tupperapp.vercel.app'

export function origenesPermitidos(valor: string | null | undefined): string[] {
  const lista = (valor ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean)
  return lista.length ? lista : [ORIGEN_DE_LA_APP]
}

// Un navegador siempre manda "Origin" cuando una página llama a otra. Si no viene (curl, otro servidor) no hay página de por
// medio y la función sigue como siempre: lo que protege es el JWT, la contraseña y el captcha, no el CORS.
export const origenAjeno = (origen: string | null, permitidos: string[]) => !!origen && !permitidos.includes(origen)

// Los encabezados de CORS para quien llama. Solo se le abre la puerta a un origen permitido (nunca "*").
export function encabezadosCors(origen: string | null, permitidos: string[], cabeceras: string): Record<string, string> {
  const base: Record<string, string> = { 'Access-Control-Allow-Headers': cabeceras, 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' }
  return origen && permitidos.includes(origen) ? { ...base, 'Access-Control-Allow-Origin': origen } : base
}

// Verificación en dos pasos (1.29, S-06) con una app autenticadora (Google Authenticator, Authy, 1Password...): códigos de 6
// números que cambian cada 30 segundos (TOTP). La da Supabase Auth; la base además exige el segundo paso a quien lo activó
// (supabase/actualizacion-22.sql), así que no alcanza con saber la contraseña.
import { supabase } from './supabase'

// El nivel de la sesión que está en el permiso (JWT): 'aal1' (solo contraseña) o 'aal2' (con el código)
export function nivelDe(token) {
  try {
    const parte = String(token || '').split('.')[1]
    const json = JSON.parse(atob(parte.replace(/-/g, '+').replace(/_/g, '/')))
    return json.aal || 'aal1'
  } catch {
    return 'aal1'
  }
}

// Los factores de la persona que ya están activos (verificados)
export const factoresActivos = (usuario) => (usuario?.factors || []).filter((f) => f.status === 'verified' && f.factor_type === 'totp')

// ¿Falta el código para entrar? Tiene la verificación activada y la sesión todavía es solo con contraseña.
export const faltaCodigo = (sesion) => factoresActivos(sesion?.user).length > 0 && nivelDe(sesion?.access_token) !== 'aal2'

// Un código válido: 6 números
export const codigoValido = (c) => /^\d{6}$/.test(String(c || '').trim())

const MENSAJES = {
  invalid: 'El código no es correcto o ya venció. Probá con el que muestra ahora la app.',
  mfa_verification_failed: 'El código no es correcto o ya venció. Probá con el que muestra ahora la app.',
  mfa_challenge_expired: 'Pasó demasiado tiempo. Probá de nuevo.',
  too_many_enrolled_mfa_factors: 'Ya tenés el máximo de dispositivos. Quitá uno antes de sumar otro.',
  insufficient_aal: 'Para esto tenés que haber entrado con el código.',
}
const mensaje = (error) =>
  MENSAJES[error?.code] || (/invalid/i.test(error?.message || '') ? MENSAJES.invalid : 'No se pudo. Revisá la conexión y probá de nuevo.')

// Empieza a activarla: devuelve { id, qr, secreto } o { error }. Si había quedado uno a medias, se borra antes.
export async function empezarActivacion() {
  try {
    const { data: lista } = await supabase.auth.mfa.listFactors()
    for (const f of lista?.all || []) if (f.status !== 'verified') await supabase.auth.mfa.unenroll({ factorId: f.id })
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Tupper ${Date.now() % 100000}` })
    if (error) return { error: mensaje(error) }
    return { id: data.id, qr: data.totp.qr_code, secreto: data.totp.secret }
  } catch {
    return { error: mensaje() }
  }
}

// Confirma con el primer código (al activar) o pide el código al entrar. Devuelve { ok } o { error }.
export async function verificarCodigo(factorId, codigo) {
  try {
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: String(codigo).trim() })
    if (error) return { error: mensaje(error) }
    return { ok: true }
  } catch {
    return { error: mensaje() }
  }
}

// La desactiva (hace falta haber entrado con el código)
export async function desactivar(factorId) {
  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId })
    if (error) return { error: mensaje(error) }
    // Que el permiso nuevo ya no diga que hay un factor activo
    await supabase.auth.refreshSession()
    return { ok: true }
  } catch {
    return { error: mensaje() }
  }
}

// ---------- Códigos de recuperación y más de un dispositivo (1.32, S-08) ----------
// La función `dos-pasos` los genera y los canjea; en la base solo queda su huella (actualizacion-25.sql).
async function pedirFuncion(cuerpo) {
  try {
    const { data, error } = await supabase.functions.invoke('dos-pasos', { body: cuerpo })
    if (error) {
      const detalle = await error.context?.json?.().catch(() => null)
      return { error: detalle?.mensaje || 'No se pudo. Revisá la conexión y probá de nuevo.', codigo: detalle?.codigo || 'red' }
    }
    return data || {}
  } catch {
    return { error: 'No se pudo. Revisá la conexión y probá de nuevo.', codigo: 'red' }
  }
}

// Genera códigos nuevos (reemplazan a los anteriores). Devuelve { codigos } o { error }.
export const generarCodigosRecuperacion = () => pedirFuncion({ accion: 'generar' })

// Cuántos le quedan sin usar, o null si no se sabe (sin conexión o sin la actualización 25)
export async function codigosQueQuedan() {
  try {
    const { data, error } = await supabase.rpc('codigos_que_quedan')
    return error ? null : Number(data)
  } catch {
    return null
  }
}

// Entrar con un código de recuperación: la función saca la verificación en dos pasos y la sesión se renueva sin ella
export async function usarCodigoRecuperacion(codigo) {
  const r = await pedirFuncion({ accion: 'usar', codigo })
  if (r.error) return r
  try {
    sessionStorage.setItem('tupper:recuperada', '1')
  } catch {
    // sin almacenamiento no se muestra el aviso, nada más
  }
  await supabase.auth.refreshSession()
  return { ok: true }
}

// Un código de recuperación bien escrito: 8 letras y números, con o sin guion
export const codigoRecuperacionValido = (c) => /^[A-HJKMNP-Z2-9]{8}$/i.test(String(c || '').replace(/[\s-]/g, ''))

// Con más de un dispositivo, el código puede ser de cualquiera: se prueba con cada uno
export async function verificarConCualquiera(factores, codigo) {
  let ultimo = { error: mensaje() }
  for (const f of factores) {
    ultimo = await verificarCodigo(f.id, codigo)
    if (ultimo.ok) return ultimo
  }
  return ultimo
}

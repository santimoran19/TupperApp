// Recordatorios con la app cerrada (1.29, F-06). El teléfono se suscribe a las notificaciones push y la configuración
// de los recordatorios se copia a la base; la función recordatorios-push (la llama un reloj cada 15 minutos) decide
// cuándo avisar. Solo existe si el sitio tiene la clave pública VAPID (VITE_VAPID_PUBLIC, ver supabase/functions/LEEME.md).
import { supabase } from './supabase'
import { claveAyuno, claveRecordatorios, leer, RECORDATORIOS_INICIAL } from './ayuno'

const CLAVE_VAPID = import.meta.env.VITE_VAPID_PUBLIC || ''
const clavePush = (uid) => `tupper:push:${uid}`
const claveCopia = (uid) => `tupper:push-copia:${uid}`

export const pushDisponible = () =>
  !!CLAVE_VAPID &&
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  typeof Notification !== 'undefined'

// ¿Este teléfono tiene prendidos los avisos con la app cerrada? (lo que eligió la persona; la suscripción real la
// puede haber borrado el navegador, por eso se revisa al abrir la app)
export function pushPrendido(uid) {
  try {
    return localStorage.getItem(clavePush(uid)) === '1'
  } catch {
    return false
  }
}
function marcar(uid, si) {
  try {
    if (si) localStorage.setItem(clavePush(uid), '1')
    else {
      localStorage.removeItem(clavePush(uid))
      localStorage.removeItem(claveCopia(uid))
    }
  } catch {
    // sin almacenamiento, se pregunta de nuevo la próxima vez
  }
}

export function claveDeBytes(b64url) {
  const b64 = (b64url + '='.repeat((4 - (b64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

// Lo que se copia a la base: la configuración, la zona horaria y el ayuno en curso
export function copiaDe(uid) {
  const config = leer(claveRecordatorios(uid), RECORDATORIOS_INICIAL)
  const ay = leer(claveAyuno(uid), { actual: null }).actual
  let zona = 'America/Argentina/Buenos_Aires'
  try {
    zona = Intl.DateTimeFormat().resolvedOptions().timeZone || zona
  } catch {
    // se queda la de Argentina
  }
  return {
    user_id: uid,
    activo: !!config.activo,
    config,
    zona,
    ayuno_inicio: ay?.inicio ? Math.round(ay.inicio) : null,
    ayuno_horas: ay?.horas ? Math.round(ay.horas) : null,
  }
}

// Copia la configuración a la base si cambió desde la última vez (la llama el aviso de recordatorios cada tanto)
export async function copiarRecordatorios(uid, { forzar = false } = {}) {
  if (!pushPrendido(uid)) return
  const fila = copiaDe(uid)
  const huella = JSON.stringify(fila)
  try {
    if (!forzar && localStorage.getItem(claveCopia(uid)) === huella) return
  } catch {
    // sin almacenamiento se manda siempre
  }
  const { error } = await supabase
    .from('recordatorios')
    .upsert({ ...fila, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  if (error) return
  try {
    localStorage.setItem(claveCopia(uid), huella)
  } catch {
    // ídem
  }
}

const sw = async () => (await navigator.serviceWorker.getRegistration()) || null

// Prende los avisos con la app cerrada: pide el permiso, suscribe el navegador y lo anota en la base.
// Devuelve { ok } o { error } (con un texto para mostrar).
export async function prenderPush(uid) {
  if (!pushDisponible()) return { error: 'Este navegador no permite avisos con la app cerrada.' }
  try {
    const permiso = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission
    if (permiso !== 'granted') return { error: 'Para esto hace falta permitir las notificaciones en el navegador.' }
    const reg = await sw()
    if (!reg) return { error: 'Instalá la app (o recargá la página) y probá de nuevo.' }
    const sus =
      (await reg.pushManager.getSubscription()) ||
      (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: claveDeBytes(CLAVE_VAPID) }))
    const { keys } = sus.toJSON()
    const { error } = await supabase.rpc('guardar_suscripcion', { p_endpoint: sus.endpoint, p_p256dh: keys.p256dh, p_auth: keys.auth })
    if (error) return { error: 'No se pudo activar. Revisá la conexión y probá de nuevo.' }
    marcar(uid, true)
    await copiarRecordatorios(uid, { forzar: true })
    return { ok: true }
  } catch {
    return { error: 'No se pudo activar en este navegador. Probá con Chrome, o con la app agregada a la pantalla de inicio.' }
  }
}

// Apaga los avisos con la app cerrada en este teléfono (también al cerrar sesión: que no le lleguen a quien entre después)
export async function apagarPush(uid) {
  marcar(uid, false)
  try {
    const reg = await sw()
    const sus = await reg?.pushManager?.getSubscription()
    if (!sus) return { ok: true }
    await supabase.from('push_suscripciones').delete().eq('endpoint', sus.endpoint)
    await sus.unsubscribe()
    return { ok: true }
  } catch {
    return { ok: true }
  }
}

// Al abrir la app: si los avisos estaban prendidos pero el navegador perdió la suscripción (pasa al borrar datos o al
// cambiar las claves), se suscribe de nuevo; si sacaron el permiso, se apagan.
export async function revisarPush(uid) {
  if (!pushPrendido(uid) || !pushDisponible()) return
  try {
    if (Notification.permission === 'denied') return apagarPush(uid)
    if (Notification.permission !== 'granted') return
    const reg = await sw()
    if (reg && !(await reg.pushManager.getSubscription())) await prenderPush(uid)
  } catch {
    // se revisa la próxima vez
  }
}

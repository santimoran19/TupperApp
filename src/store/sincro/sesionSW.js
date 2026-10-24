// El permiso para que el service worker mande la cola con la app cerrada del todo (1.32, T-07b; solo Android/Chrome,
// que tiene "Background Sync"). Mientras quedan cambios sin mandar, la app deja en la copia del teléfono (IndexedDB, que
// el service worker sí ve) el permiso de la sesión que tiene ahora: { uid, token, vence }. Solo el permiso, que dura una
// hora: el de renovarlo no, así el service worker nunca renueva la sesión ni le cambia nada a la app. Si al volver la
// conexión el permiso ya venció, no se manda nada y queda para cuando se abra la app, como siempre.
// En cuanto la cola queda vacía (o se cierra sesión) se borra.
import { supabase } from '../base'
import { CLAVE_SESION_SW, cambiarLocal, guardarLocal } from '../local'

export async function anotarSesionParaElSW(uid) {
  try {
    const { data } = await supabase.auth.getSession()
    const ses = data?.session
    if (ses?.user?.id !== uid || !ses.access_token) return
    await guardarLocal(CLAVE_SESION_SW, { uid, token: ses.access_token, vence: (ses.expires_at || 0) * 1000 })
  } catch {
    // sin esto, la cola se manda al abrir la app
  }
}

export function olvidarSesionDelSW(uid) {
  return cambiarLocal(CLAVE_SESION_SW, (v) => (v?.uid === uid ? undefined : v)).catch(() => {})
}

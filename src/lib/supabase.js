import { createClient } from '@supabase/supabase-js'

// Ningún pedido queda esperando para siempre: si no hubo respuesta en un tiempo razonable se corta, y la app lo trata
// como "sin conexión" (pasa, por ejemplo, cuando el teléfono suspende la app en medio de un pedido).
// El análisis con IA puede tardar bastante más que el resto, así que tiene su propio límite.
const LIMITE_MS = 45000
const LIMITE_IA_MS = 75000

function pedir(url, opciones = {}) {
  const corte = new AbortController()
  const reloj = setTimeout(() => corte.abort(), String(url).includes('/functions/v1/') ? LIMITE_IA_MS : LIMITE_MS)
  if (opciones.signal) {
    if (opciones.signal.aborted) corte.abort()
    else opciones.signal.addEventListener('abort', () => corte.abort(), { once: true })
  }
  // El reloj sigue corriendo aunque ya haya empezado a llegar la respuesta: si se queda a mitad de camino, también se corta.
  // Cuando el pedido ya terminó, cortarlo no hace nada.
  return fetch(url, { ...opciones, signal: corte.signal }).catch((error) => {
    clearTimeout(reloj)
    throw error
  })
}

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY, { global: { fetch: pedir } })

// La sesión como quedó guardada en el teléfono, sin preguntarle a nadie. Hace falta para abrir la app sin conexión:
// si el permiso venció (dura una hora) Supabase tiene que renovarlo y, sin red, no puede; entonces contesta que no hay
// sesión aunque la tenga guardada. Cuando la sesión se cierra de verdad (o deja de valer), Supabase borra lo guardado.
export function sesionGuardada() {
  try {
    const guardada = JSON.parse(localStorage.getItem(supabase.auth.storageKey) || 'null')
    return guardada?.refresh_token && guardada.user?.id ? { user: guardada.user } : null
  } catch {
    return null
  }
}

// Saca la sesión guardada del teléfono sin pasar por Supabase (para cuando no pudo cerrarla por falta de conexión)
export function olvidarSesion() {
  try {
    localStorage.removeItem(supabase.auth.storageKey)
  } catch {
    // sin almacenamiento no hay nada que sacar
  }
}

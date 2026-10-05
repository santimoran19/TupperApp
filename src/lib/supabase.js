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
  return fetch(url, { ...opciones, signal: corte.signal }).catch((error) => { clearTimeout(reloj); throw error })
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
  { global: { fetch: pedir } },
)

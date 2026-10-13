// ¿La ventana es lo bastante ancha para el diseño de computadora? Desde 1024 px: barra de navegación al costado y varias columnas.
// Por debajo de eso se queda el diseño de celular, que no cambia. Tiene que coincidir con el `lg` de tailwind.config.js (1024 px).
import { useSyncExternalStore } from 'react'

const CONSULTA = '(min-width: 1024px)'

const hay = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

function suscribir(avisar) {
  if (!hay()) return () => {}
  const m = window.matchMedia(CONSULTA)
  m.addEventListener('change', avisar)
  return () => m.removeEventListener('change', avisar)
}

export const useEscritorio = () =>
  useSyncExternalStore(
    suscribir,
    () => hay() && window.matchMedia(CONSULTA).matches,
    () => false,
  )

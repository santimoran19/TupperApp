// Tema de la app: 'auto' sigue al teléfono; 'claro' y 'oscuro' lo fuerzan.
// La elección se guarda en el dispositivo y la aplica public/tema.js al abrir (antes de que cargue React).
const CLAVE = 'tupper:tema'
const COLOR_BARRA = { claro: '#206140', oscuro: '#0f1512' } // color de la barra del navegador

export const TEMAS = [
  ['auto', 'Automático'],
  ['claro', 'Claro'],
  ['oscuro', 'Oscuro'],
]

export function temaGuardado() {
  try {
    const t = localStorage.getItem(CLAVE)
    return t === 'claro' || t === 'oscuro' ? t : 'auto'
  } catch {
    return 'auto'
  }
}

export function elegirTema(tema) {
  try {
    if (tema === 'auto') localStorage.removeItem(CLAVE)
    else localStorage.setItem(CLAVE, tema)
  } catch {
    /* sin almacenamiento: vale solo hasta cerrar la app */
  }
  const raiz = document.documentElement
  if (tema === 'auto') raiz.removeAttribute('data-tema')
  else raiz.setAttribute('data-tema', tema)
  // La barra del navegador acompaña: en automático cada etiqueta vuelve a su color según el modo del teléfono
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    const propio = m.media.includes('dark') ? COLOR_BARRA.oscuro : COLOR_BARRA.claro
    m.setAttribute('content', tema === 'auto' ? propio : COLOR_BARRA[tema])
  })
}

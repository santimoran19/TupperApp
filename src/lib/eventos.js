// Registro de errores y eventos: cuando algo falla en el teléfono de alguien, queda anotado en la tabla `eventos`
// de Supabase (con la pantalla, la versión y el navegador) para poder enterarse y arreglarlo.
// No se anotan nombres de alimentos, lo que se busca ni nada de lo que la persona carga.
// Anotar nunca puede romper la app: todo lo de acá falla en silencio.
import { supabase } from './supabase'

/* global __APP_VERSION__ */
export const VERSION = typeof __APP_VERSION__ === 'undefined' ? '' : __APP_VERSION__

// Cupo por sesión, separado: muchas búsquedas no le sacan lugar a los errores (la base además corta en 300 por día)
const TOPE_POR_SESION = { error: 40, evento: 40 }
const anotados = { error: 0, evento: 0 }
const yaVistos = new Set() // el mismo error no se anota dos veces seguidas

const recortar = (v, max) => String(v ?? '').slice(0, max)
// Las direcciones llevan identificadores (/recetas/8c1f...): se guarda la forma, no el identificador
const pantalla = () => location.pathname.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi, ':id').slice(0, 120)

async function anotar(tipo, nombre, detalle) {
  try {
    if (anotados[tipo] >= TOPE_POR_SESION[tipo]) return
    anotados[tipo]++
    const { data } = await supabase.auth.getSession()
    if (!data?.session) return // sin sesión no hay a nombre de quién guardarlo
    await supabase.from('eventos').insert({
      tipo,
      nombre: recortar(nombre, 60),
      detalle,
      version: recortar(VERSION, 20),
      ruta: pantalla(),
      dispositivo: recortar(navigator.userAgent, 200),
    })
  } catch {
    /* sin conexión o sin la tabla: no pasa nada */
  }
}

// Algo que conviene medir (una búsqueda que no respondió, un análisis pedido). `detalle` son pocos datos y cortos.
export function anotarEvento(nombre, detalle = {}) {
  anotar('evento', nombre, detalle)
}

// Un error. `donde` dice de dónde vino: 'pantalla', 'accion', 'carga', 'js' o 'promesa'.
export function anotarError(donde, error, extra = {}) {
  const mensaje = recortar(error?.message || error, 300)
  const clave = donde + '|' + mensaje + '|' + (extra.accion || '')
  if (yaVistos.has(clave)) return
  if (yaVistos.size >= 200) yaVistos.clear()
  yaVistos.add(clave)
  anotar('error', donde, { mensaje, pila: recortar(error?.stack, 1500), ...extra })
}

// Errores que nadie atrapó: los del código y las promesas que fallaron sin que nadie las mirara
export function escucharErrores() {
  window.addEventListener('error', (ev) => {
    if (!ev.message) return // una imagen o un archivo que no cargó: no es un error del código
    anotarError('js', ev.error || ev.message, {
      origen: recortar(`${ev.filename || ''}:${ev.lineno || 0}:${ev.colno || 0}`.replace(location.origin, ''), 160),
    })
  })
  window.addEventListener('unhandledrejection', (ev) => anotarError('promesa', ev.reason))
}

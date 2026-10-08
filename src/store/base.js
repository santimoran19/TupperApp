// Cómo se leen las respuestas de Supabase: un solo lugar para los errores y para las tablas que vienen por páginas.
import { supabase } from '../lib/supabase'

export { supabase }

// Supabase devuelve { data, error }: si hay error lo tiramos para manejarlo en un solo lugar.
// El error que sale lleva, además del mensaje ya traducido:
//   sinConexion: el pedido no salió o no se sabe si llegó (se cortó internet o tardó demasiado). El navegador avisa
//     con status 0; por las dudas también se mira el texto, que viene en inglés y cambia según cuál sea.
//   pasajero: la base contestó, pero con algo que no tiene que ver con el dato y se puede arreglar solo: el servidor
//     caído (5xx), el permiso de la sesión que no le sirvió (401) o demasiados pedidos juntos (429).
//   esperado: un aviso escrito para la persona por las funciones de la base, no una falla.
//   codigo y estado: el código de Postgres y el de HTTP, para quien necesite mirar más fino.
export function ok({ data, error, status }) {
  if (!error) return data
  const sinConexion = status === 0 || esDeRed(error)
  const caido = status >= 500
  throw Object.assign(new Error(mensajeDe(error, sinConexion, caido)), {
    codigo: error.code || '',
    estado: status || 0,
    sinConexion,
    pasajero: !sinConexion && (caido || status === 401 || status === 429),
    esperado: error.code === AVISO_DE_LA_BASE,
  })
}

const esDeRed = (error) =>
  /failed to fetch|networkerror|load failed|network request failed|network connection was lost|connection appears to be offline|timed out|aborterror/i.test(
    error?.message || '',
  )

// Las funciones de la base avisan cosas a la persona ("La cantidad de porciones no es válida.") con este código:
// el texto ya viene escrito para mostrarse y no es una falla de la app, así que no se anota como error.
const AVISO_DE_LA_BASE = 'P0001'

export const SIN_CONEXION = 'No hay conexión. Revisá internet y probá de nuevo.'

// Los errores más comunes de la base, dichos de forma que se entiendan
function mensajeDe(error, sinConexion, caido) {
  if (sinConexion) return SIN_CONEXION
  if (caido) return 'El servidor no está respondiendo. Probá de nuevo en un rato.'
  if (error.code === '23503') return 'Ese alimento o esa receta ya no existe. Cerrá la app, volvé a abrirla y probá de nuevo.'
  if (error.code === '23514') return 'Hay un dato fuera de rango. Revisá las cantidades.'
  if (error.code === 'PGRST301' || /jwt expired/i.test(error.message || ''))
    return 'Se venció la sesión. Cerrá la app, volvé a abrirla y probá de nuevo.'
  // La app nueva contra una base a la que todavía no se le aplicó la última actualización (supabase/actualizacion-N.sql)
  if (error.code === 'PGRST202') return 'Falta terminar una actualización del servidor. Probá de nuevo en un rato.'
  return error.message || 'Algo salió mal'
}

// Supabase devuelve como mucho 1000 filas por pedido: las tablas que pueden crecer se traen por páginas.
export async function traerTodo(armarConsulta) {
  const filas = []
  for (let desde = 0; ; desde += 1000) {
    const pagina = ok(await armarConsulta().range(desde, desde + 999))
    filas.push(...pagina)
    if (pagina.length < 1000) return filas
  }
}

// Cómo se leen las respuestas de Supabase: un solo lugar para los errores y para las tablas que vienen por páginas.
import { supabase } from '../lib/supabase'
import { ok, SIN_CONEXION } from './respuestas'

export { ok, SIN_CONEXION, supabase }

// Supabase devuelve como mucho 1000 filas por pedido: las tablas que pueden crecer se traen por páginas.
export async function traerTodo(armarConsulta) {
  const filas = []
  for (let desde = 0; ; desde += 1000) {
    const pagina = ok(await armarConsulta().range(desde, desde + 999))
    filas.push(...pagina)
    if (pagina.length < 1000) return filas
  }
}

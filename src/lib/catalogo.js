// Catálogo compartido de productos (F-02): lo que ya cargaron y confirmaron otras personas, para no depender
// siempre de Open Food Facts. Solo llega acá un producto que dos personas distintas cargaron con valores que
// coinciden (ver supabase/actualizacion-14.sql). Si el catálogo no responde, la app sigue como si no existiera.
import { supabase } from './supabase'
import { esCodigoDeBarras } from './codigo'
import { deCatalogo } from './producto'
import { LIM } from './validar'

// Productos del catálogo cuyo nombre contiene el texto. Si falla, no hay resultados (no es un error para la persona).
export async function buscarEnCatalogo(texto) {
  try {
    const { data, error } = await supabase.rpc('catalogo_buscar', { p_texto: String(texto).slice(0, LIM.nombre) })
    if (error || !Array.isArray(data)) return []
    return data.map(deCatalogo)
  } catch {
    return []
  }
}

// El producto del catálogo con ese código de barras, o null
export async function buscarCodigoEnCatalogo(codigo) {
  try {
    const { data, error } = await supabase.rpc('catalogo_por_codigo', { p_codigo: codigo })
    if (error || !Array.isArray(data) || data.length === 0) return null
    return deCatalogo(data[0])
  } catch {
    return null
  }
}

// Comparte un alimento recién guardado (solo sus datos nutricionales: nada de la persona). No espera ni avisa si falla.
// Solo se comparten los que se miden en gramos o mililitros.
export function aportarAlCatalogo(a, codigo = null) {
  if (!a || (a.unit !== 'g' && a.unit !== 'ml')) return
  const c = codigo ?? a.codigo
  supabase
    .rpc('catalogo_aportar', {
      p_codigo: esCodigoDeBarras(c) ? c : null,
      p_name: a.name,
      p_detalle: a.detalle || null,
      p_unit: a.unit,
      p_kcal: Number(a.kcal),
      p_protein: Number(a.protein) || 0,
      p_carbs: Number(a.carbs) || 0,
      p_fat: Number(a.fat) || 0,
      p_category: a.category,
      p_alcohol: !!a.alcohol,
    })
    .then(
      () => {},
      () => {},
    )
}

// Categorías propias y la categoría de cada alimento (1.30, F-13; supabase/actualizacion-23.sql). Necesitan conexión,
// como el resto de lo que es de configuración.
import { ok, supabase } from '../base'
import { invalido } from '../listas'
import { errorNombre, esDeLaBase, nombreLimpio } from '../../lib/categorias'

export const accionesDeCategorias = (k) => ({
  crearCategoria: k.accion('crearCategoria', async (nombre) => {
    const propias = k.ver().e.categoriasPropias
    const error = errorNombre(nombre, propias)
    if (error) throw invalido(error)
    const [fila] = ok(
      await supabase
        .from('categorias')
        .insert({ user_id: k.uid, nombre: nombreLimpio(nombre) })
        .select(),
    )
    k.setE((s) => ({ ...s, categoriasPropias: [...s.categoriasPropias, fila] }))
    return fila.nombre
  }),

  // Cambia el nombre y se lleva con ella los alimentos propios y los de la base que estaban ahí
  renombrarCategoria: k.accion('renombrarCategoria', async (viejo, nuevo) => {
    const propias = k.ver().e.categoriasPropias
    const error = errorNombre(nuevo, propias, viejo)
    if (error) throw invalido(error)
    const n = nombreLimpio(nuevo)
    ok(await supabase.rpc('renombrar_categoria', { p_viejo: viejo, p_nuevo: n }))
    k.setE((s) => ({
      ...s,
      categoriasPropias: s.categoriasPropias.map((c) => (c.nombre === viejo ? { ...c, nombre: n } : c)),
      alimentos: s.alimentos.map((a) => (a.owner === k.uid && a.category === viejo ? { ...a, category: n } : a)),
      categoriaAlimento: s.categoriaAlimento.map((c) => (c.categoria === viejo ? { ...c, categoria: n } : c)),
    }))
  }),

  // La borra; lo que tenía pasa a `destino` (por defecto "Otros"). Los de la base vuelven a su categoría de siempre.
  borrarCategoria: k.accion('borrarCategoria', async (nombre, destino = 'Otros') => {
    ok(await supabase.rpc('borrar_categoria', { p_nombre: nombre, p_destino: destino }))
    k.setE((s) => ({
      ...s,
      categoriasPropias: s.categoriasPropias.filter((c) => c.nombre !== nombre),
      alimentos: s.alimentos.map((a) => (a.owner === k.uid && a.category === nombre ? { ...a, category: destino } : a)),
      categoriaAlimento: s.categoriaAlimento.filter((c) => c.categoria !== nombre),
    }))
  }),

  // Mueve un alimento a otra categoría. Los propios cambian de verdad; los de la base (o de otra persona del hogar), solo
  // para esta persona. Volver a la categoría original borra la elección.
  elegirCategoria: k.accion('elegirCategoria', async (alimento, categoria) => {
    const c = nombreLimpio(categoria)
    if (!c) throw invalido('Elegí una categoría.')
    const v = k.ver()
    if (!esDeLaBase(c) && !v.e.categoriasPropias.some((x) => x.nombre === c) && c !== alimento.category)
      throw invalido('Esa categoría no existe.')
    const original = v.e.alimentos.find((a) => a.id === alimento.id)
    if (!original) throw invalido('Ese alimento ya no está.')
    if (original.owner === k.uid) {
      const [a] = ok(await supabase.from('foods').update({ category: c }).eq('id', original.id).select())
      k.setE((s) => ({ ...s, alimentos: s.alimentos.map((x) => (x.id === a.id ? a : x)) }))
      return
    }
    if (c === original.category) {
      ok(await supabase.from('categoria_alimento').delete().eq('user_id', k.uid).eq('food_id', original.id))
      k.setE((s) => ({ ...s, categoriaAlimento: s.categoriaAlimento.filter((x) => x.food_id !== original.id) }))
      return
    }
    const [fila] = ok(
      await supabase
        .from('categoria_alimento')
        .upsert({ user_id: k.uid, food_id: original.id, categoria: c }, { onConflict: 'user_id,food_id' })
        .select(),
    )
    k.setE((s) => ({ ...s, categoriaAlimento: [...s.categoriaAlimento.filter((x) => x.food_id !== original.id), fila] }))
  }),
})

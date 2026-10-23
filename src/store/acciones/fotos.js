// Fotos de alimentos y recetas (1.24): se suben a Supabase Storage y la fila guarda la ruta. Necesitan conexión (una foto
// no entra en la cola de cambios sin conexión). La foto anterior propia se borra después de guardar la nueva.
import { achicarFoto, borrarFotos, subirFoto } from '../../lib/fotos'
import { ok, supabase } from '../base'

const TABLAS = { alimento: ['foods', 'alimentos'], receta: ['recipes', 'recetas'] }

export const accionesDeFotos = (k) => {
  const guardarRuta = async (tipo, id, ruta) => {
    const [tabla, lista] = TABLAS[tipo]
    const [fila] = ok(await supabase.from(tabla).update({ image_path: ruta }).eq('id', id).select())
    if (!fila) throw new Error('No se pudo guardar la foto: no tenés permiso para cambiar eso.')
    k.setE((s) => ({ ...s, [lista]: s[lista].map((x) => (x.id === id ? fila : x)) }))
    return fila
  }
  const actual = (tipo, id) => k.ver().e[TABLAS[tipo][1]].find((x) => x.id === id)

  return {
    // `tipo`: 'alimento' o 'receta'. `archivo`: el File que eligió la persona.
    ponerFoto: k.accion('ponerFoto', async (tipo, id, archivo) => {
      const antes = actual(tipo, id)
      if (!antes) throw new Error('Eso ya no existe.')
      const lista = await achicarFoto(archivo)
      const ruta = await subirFoto(k.uid, lista)
      try {
        await guardarRuta(tipo, id, ruta)
      } catch (err) {
        borrarFotos([ruta], k.uid).catch(() => {})
        throw err
      }
      if (antes.image_path) borrarFotos([antes.image_path], k.uid).catch(() => {})
      return ruta
    }),

    quitarFoto: k.accion('quitarFoto', async (tipo, id) => {
      const antes = actual(tipo, id)
      if (!antes?.image_path) return true
      await guardarRuta(tipo, id, null)
      borrarFotos([antes.image_path], k.uid).catch(() => {})
      return true
    }),
  }
}

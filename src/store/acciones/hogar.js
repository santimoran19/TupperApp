// Hogar: compartir la despensa, la lista de compras, las comidas preparadas y las compras con otras personas (supabase/actualizacion-13.sql).
// Armar un hogar, unirse y salir cambian de quién es la despensa, así que se hacen con conexión y sin cambios pendientes
// (si no, un cambio hecho antes se aplicaría a la despensa equivocada). Después se trae todo de nuevo.
import { ok, supabase } from '../base'
import { traer } from '../carga'
import { invalido } from '../listas'

export const accionesDeHogar = (k) => {
  // Los cambios hechos sin conexión se tienen que haber mandado antes de cambiar de despensa
  async function sinPendientes() {
    if ((await k.pendientes()) > 0)
      throw invalido('Tenés cambios sin enviar. Esperá a que se manden (tiene que haber conexión) y probá de nuevo.')
  }

  // Después de entrar o salir de un hogar cambia casi todo lo que se ve: se trae todo de nuevo
  async function recargar() {
    k.setE(await traer(k.uid))
  }

  // Solo cambia lo del hogar (quiénes son, el código, el nombre)
  async function refrescar() {
    const hogar = ok(await supabase.rpc('mi_hogar')) ?? null
    k.setE((s) => ({ ...s, hogar }))
    return hogar
  }

  return {
    crearHogar: k.accion(
      'crearHogar',
      async (nombre) => {
        await sinPendientes()
        ok(await supabase.rpc('crear_hogar', { p_nombre: nombre }))
        await recargar()
      },
      { unica: true },
    ),

    unirseAlHogar: k.accion(
      'unirseAlHogar',
      async (codigo) => {
        await sinPendientes()
        const r = ok(await supabase.rpc('unirse_al_hogar', { p_codigo: codigo }))
        if (!r?.ok) throw invalido(r?.error || 'No se pudo entrar al hogar.')
        await recargar()
      },
      { unica: true },
    ),

    // Se va del hogar y se lleva una copia de la despensa (la base guarda antes un respaldo de la que tenía)
    salirDelHogar: k.accion(
      'salirDelHogar',
      async () => {
        await sinPendientes()
        k.hogarPropio()
        try {
          ok(await supabase.rpc('salir_del_hogar'))
        } catch (err) {
          k.hogarPropio(false)
          throw err
        }
        await recargar()
      },
      { unica: true },
    ),

    sacarDelHogar: k.accion('sacarDelHogar', async (usuario) => {
      ok(await supabase.rpc('sacar_del_hogar', { p_usuario: usuario }))
      return refrescar()
    }),

    // Código nuevo (el anterior deja de servir) o, con `apagar`, sin código: nadie puede entrar
    renovarCodigo: k.accion('renovarCodigo', async (apagar = false) => {
      ok(await supabase.rpc('renovar_codigo', { p_apagar: apagar }))
      return refrescar()
    }),

    renombrarHogar: k.accion('renombrarHogar', async (nombre) => {
      ok(await supabase.rpc('renombrar_hogar', { p_nombre: nombre }))
      return refrescar()
    }),

    // Para ver cómo está el hogar (quién entró, si cambió el código) cuando se abre la pantalla
    actualizarHogar: async () => {
      try {
        return await refrescar()
      } catch {
        return null
      }
    },
  }
}

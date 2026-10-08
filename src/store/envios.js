// Los cambios que se pueden hacer sin conexión, vistos del lado de la base: cómo se manda cada uno.
// ENVIOS[tipo](datos, uid) hace el pedido y devuelve lo que contestó la base (o tira el error).
// Todos se pueden mandar dos veces sin que cuenten doble, porque si la conexión se corta a mitad de camino no se sabe si
// el primero llegó: cocinar, registrar y comprar viajan con una clave que la base recuerda; el resto pisa o borra, que
// repetido da lo mismo. La excepción es el + y el - de la despensa (`ajustarStock`), que suma y no lleva clave. Por eso,
// con conexión, si ese pedido salió y no se sabe si llegó, no se manda de nuevo (ver `operar` en sincronizacion.js).
// Queda un caso sin cubrir: un toque hecho sin conexión que al mandarse llega a la base justo antes de un corte.
import { ok, supabase } from './base'

export const ENVIOS = {
  registrar: async (d) =>
    ok(
      await supabase.rpc('registrar_comida', {
        p_fecha: d.fecha,
        p_comida: d.comida,
        p_filas: d.filas,
        p_stock: d.stock,
        p_preparado: d.preparado,
        p_clave: d.clave,
      }),
    ),

  // "No comí". La fila va con su identificador puesto desde el teléfono: si ya había llegado, la base avisa que está repetida y listo.
  saltear: async (d) => {
    const respuesta = await supabase.from('log_entries').insert(d.fila).select()
    if (respuesta.error?.code === '23505') return [d.fila]
    return ok(respuesta)
  },

  borrarRegistro: async (d) => ok(await supabase.from('log_entries').delete().eq('id', d.id)),

  cocinar: async (d) =>
    ok(await supabase.rpc('cocinar', { p_receta: d.receta, p_porciones: d.porciones, p_stock: d.stock, p_clave: d.clave })),

  fijarPreparado: async (d) => ok(await supabase.from('prepared').upsert(d.fila, { onConflict: 'user_id,recipe_id' }).select()),

  // La cuenta la hace la base ("restá 2"), no la app con lo que tiene en pantalla: así dos teléfonos no se pisan.
  ajustarStock: async (d) => ok(await supabase.rpc('mover_stock', { p_cambios: [{ food_id: d.food_id, delta: d.delta }] })),

  fijarStock: async (d) => ok(await supabase.from('stock').upsert(d.fila, { onConflict: 'user_id,food_id' }).select()),

  quitarDeDespensa: async (d, uid) => ok(await supabase.from('stock').delete().eq('user_id', uid).eq('food_id', d.food_id)),

  agregarALista: async (d, uid) =>
    ok(
      await supabase
        .from('shopping_items')
        .upsert({ user_id: uid, food_id: d.food_id, qty: d.qty }, { onConflict: 'user_id,food_id' })
        .select(),
    ),

  quitarDeLista: async (d, uid) => ok(await supabase.from('shopping_items').delete().eq('user_id', uid).eq('food_id', d.food_id)),

  comprar: async (d) =>
    ok(
      await supabase.rpc('comprar', {
        p_alimento: d.alimento,
        p_cantidad: d.cantidad,
        p_precio: d.precio,
        p_fecha: d.fecha,
        p_anotado: d.anotado,
        p_clave: d.clave,
      }),
    ),
}

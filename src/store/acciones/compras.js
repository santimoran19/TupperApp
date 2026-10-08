// Compras: la lista de lo que falta y lo que se compró.
import { hoy } from '../../lib/fechas'
import { ok, supabase } from '../base'
import { invalido, nuevaClave } from '../listas'

export const accionesDeCompras = (k) => ({
  agregarALista: k.accion('agregarALista', (food_id, qty) => k.operar('agregarALista', { food_id, qty, id: nuevaClave() }), {
    enCola: true,
  }),

  // `id` es el de la fila de la lista. A la base se le pide por alimento (hay uno solo por persona), que también sirve
  // para lo que se anotó sin conexión y todavía no tiene fila en la base.
  quitarDeLista: k.accion(
    'quitarDeLista',
    (id) => {
      const fila = k.ver().e.lista.find((x) => x.id === id)
      if (fila) return k.operar('quitarDeLista', { food_id: fila.food_id })
    },
    { enCola: true },
  ),

  // Comprar: guarda el gasto, suma al stock y saca el producto de la lista, todo en un solo pedido.
  // `anotado` es el alimento que figuraba en la lista, cuando se compró un producto que vale por ese
  comprar: k.accion(
    'comprar',
    ({ food_id, qty, price, anotado = food_id }) =>
      k.operar('comprar', {
        alimento: food_id,
        cantidad: qty,
        precio: price || 0,
        fecha: hoy(),
        anotado,
        clave: nuevaClave(),
        // Para mostrarlo sin conexión
        id: nuevaClave(),
        nombre: k.ver().alimentosPorId.get(food_id)?.name || '',
      }),
    { unica: true, enCola: true },
  ),

  borrarCompra: k.accion('borrarCompra', async (id) => {
    if (k.ver().e.compras.find((x) => x.id === id)?.pendiente)
      throw invalido('Todavía no se terminó de guardar. Probá de nuevo cuando vuelva la conexión.')
    ok(await supabase.from('purchases').delete().eq('id', id))
    k.setE((s) => ({ ...s, compras: s.compras.filter((x) => x.id !== id) }))
  }),
})

// Despensa: alimentos propios, stock y cocinar.
// `k` es lo que comparten todas las acciones (ver Datos.jsx): `ver()` da los datos como están ahora.
import { gastar } from '../../lib/equivalencias'
import { redondear } from '../../lib/nutricion'
import { ok, supabase } from '../base'
import { comoCambios, entre, nuevaClave } from '../listas'

// Lo que gasta una receta: cada ingrediente sale primero del producto vinculado que haya y después del alimento base.
// Anota en `cambios` (Map alimento -> diferencia de stock).
export function gastoDeReceta(v, cambios, receta, porciones) {
  for (const it of v.itemsPlan(receta.id)) {
    const b = v.alimentosPorId.get(it.food_id)
    if (b) gastar(cambios, b, (it.qty / receta.servings) * porciones, v.equivalentes.get(b.id) || [], v.stockMap)
  }
}

export const accionesDeDespensa = (k) => ({
  crearAlimento: k.accion(
    'crearAlimento',
    async (datos) => {
      const [a] = ok(
        await supabase
          .from('foods')
          .insert({ ...datos, owner: k.uid })
          .select(),
      )
      k.setE((s) => ({ ...s, alimentos: [...s.alimentos, a] }))
      return a
    },
    { unica: true },
  ),

  actualizarAlimento: k.accion('actualizarAlimento', async (id, datos) => {
    const [a] = ok(await supabase.from('foods').update(datos).eq('id', id).select())
    k.setE((s) => ({ ...s, alimentos: s.alimentos.map((x) => (x.id === id ? a : x)) }))
    return a
  }),

  borrarAlimento: k.accion('borrarAlimento', async (id) => {
    ok(await supabase.from('foods').delete().eq('id', id))
    k.setE((s) => ({
      ...s,
      alimentos: s.alimentos.filter((a) => a.id !== id),
      stock: s.stock.filter((x) => x.food_id !== id),
      lista: s.lista.filter((x) => x.food_id !== id),
    }))
  }),

  // Pone la cantidad exacta que hay (lo que la persona escribe en "¿Cuánto tenés?")
  fijarStock: k.accion(
    'fijarStock',
    (food_id, qty) =>
      k.enFila(`stock|${food_id}`, () =>
        k.operar('fijarStock', {
          fila: { user_id: k.uid, food_id, qty: entre(redondear(qty, 2), 0, 1000000), updated_at: new Date().toISOString() },
        }),
      ),
    { enCola: true },
  ),

  // Suma o resta al stock (los botones + y -)
  ajustarStock: k.accion(
    'ajustarStock',
    (food_id, delta) => k.enFila(`stock|${food_id}`, () => k.operar('ajustarStock', { food_id, delta })),
    { enCola: true },
  ),

  quitarDeDespensa: k.accion(
    'quitarDeDespensa',
    (food_id) => k.enFila(`stock|${food_id}`, () => k.operar('quitarDeDespensa', { food_id })),
    { enCola: true },
  ),

  // Cocinar descuenta los ingredientes y deja las porciones como "comida lista". Va todo en un solo pedido: o entra todo o nada.
  cocinar: k.accion(
    'cocinar',
    (recipe_id, porciones) => {
      const v = k.ver()
      const cambios = new Map()
      gastoDeReceta(v, cambios, v.recetasPorId.get(recipe_id), porciones)
      return k.operar('cocinar', { receta: recipe_id, porciones, stock: comoCambios(cambios), clave: nuevaClave() })
    },
    { unica: true, enCola: true },
  ),

  // Corrige a mano las porciones de comida lista
  fijarPreparado: k.accion(
    'fijarPreparado',
    (recipe_id, portions) =>
      k.operar('fijarPreparado', {
        fila: { user_id: k.uid, recipe_id, portions: entre(redondear(portions, 1), 0, 1000) },
      }),
    { enCola: true },
  ),
})

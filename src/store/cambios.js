// Los cambios que se pueden hacer sin conexión, vistos del lado del teléfono.
// Cada uno tiene dos formas de entrar al estado:
//   GUARDADO[tipo](estado, respuesta, datos): con lo que contestó la base (el camino de siempre).
//   LOCAL[tipo](estado, datos, uid): sin respuesta. Hace en la copia del teléfono la misma cuenta que haría la base,
//     para que la pantalla quede como va a quedar cuando el cambio se mande.
// `datos` es lo que viaja a la base (ver envios.js) y se guarda en la cola tal cual: tiene que alcanzar para las dos cosas.
// Son funciones puras: no tocan la red ni el reloj (por eso los identificadores y la hora vienen adentro de `datos`).
// Las filas que se crean acá llevan `pendiente: true` hasta que la base las devuelva.
import { ajustarRegistro, descontarFilas, devolverRegistro } from '../lib/ajuste'
import { redondear } from '../lib/nutricion'
import { conFilas, entre, reemplazar } from './listas'

// Los mismos redondeos y topes que las funciones de la base
const cantidad = (n) => entre(redondear(n, 2), 0, 1000000)
const porciones = (n) => entre(redondear(n, 1), 0, 1000)

// De quién son las filas de la despensa, la lista, las comidas preparadas y las compras: del hogar si la persona está
// en uno y, si no, suyas (ver supabase/actualizacion-13.sql). Se saca del estado, así los cambios que esperan en la cola
// se aplican bien sobre lo que se está viendo.
const ambito = (s, uid) => s.hogar?.id ?? uid

// Lo que hace `mover_stock`: suma o resta, nunca baja de cero y junta los repetidos.
// Con `soloSiExiste` no agrega a la despensa lo que no estaba.
function moverStock(stock, cambios, uid, soloSiExiste = false) {
  const juntos = new Map()
  for (const c of cambios || []) juntos.set(c.food_id, (juntos.get(c.food_id) || 0) + Number(c.delta))
  let lista = stock
  for (const [food_id, delta] of juntos) {
    if (lista.some((s) => s.food_id === food_id))
      lista = lista.map((s) => (s.food_id === food_id ? { ...s, qty: cantidad(Number(s.qty) + delta) } : s))
    else if (!soloSiExiste) lista = [...lista, { user_id: uid, food_id, qty: cantidad(delta) }]
  }
  return lista
}

// Al registrar una comida se va la marca de "no comí" que tuviera
const sinMarca = (registros, d) => registros.filter((x) => !(x.skipped && x.date === d.fecha && x.meal === d.comida))
const sinFila = (lista, campo, valor) => lista.filter((x) => x[campo] !== valor)

// Un entrenamiento y sus series (F-19). `d`: { id, datos (lo que viaja como p_datos), series (p_series, o null si no es de gimnasio), cuando }.
// Las filas de acá llevan `pendiente: true` hasta que la base las devuelva; las series, un identificador armado con el del entrenamiento.
const ENTRENO_LOCAL = (s, d, uid) => ({
  ...s,
  entrenamientos: reemplazar(
    s.entrenamientos,
    { ...d.datos, id: d.id, user_id: uid, created_at: d.cuando, pendiente: true },
    (x) => x.id === d.id,
  ),
  // Sin `series` (una sesión que no es de gimnasio) las que hubiera se dejan como están
  series: d.series
    ? [
        ...s.series.filter((x) => x.workout_id !== d.id),
        ...d.series.map((x) => ({
          ...x,
          id: `${d.id}-${x.orden}-${x.set_no}`,
          user_id: uid,
          workout_id: d.id,
          fecha: d.datos.fecha,
          pendiente: true,
        })),
      ]
    : s.series,
})
const sinEntreno = (s, id) => ({
  ...s,
  entrenamientos: sinFila(s.entrenamientos, 'id', id),
  series: sinFila(s.series, 'workout_id', id),
})

export const GUARDADO = {
  // La base devuelve { entrenamiento, series }: las series del entrenamiento se reemplazan por las que guardó
  guardarEntreno: (s, r) => ({
    ...s,
    entrenamientos: reemplazar(s.entrenamientos, r.entrenamiento, (x) => x.id === r.entrenamiento.id),
    series: r.series ? [...s.series.filter((x) => x.workout_id !== r.entrenamiento.id), ...r.series] : s.series,
  }),
  borrarEntreno: (s, _r, d) => sinEntreno(s, d.id),
  registrar: (s, r, d) => ({
    ...s,
    registros: [...sinMarca(s.registros, d), ...r.registros],
    stock: conFilas(s.stock, r.stock, 'food_id'),
    preparado: conFilas(s.preparado, r.preparado, 'recipe_id'),
  }),
  saltear: (s, [fila]) => ({ ...s, registros: [...sinFila(s.registros, 'id', fila.id), fila] }),
  // La base devuelve lo que volvió a la despensa (los pedidos de una versión anterior no traen nada)
  borrarRegistro: (s, r, d) => ({
    ...s,
    registros: sinFila(s.registros, 'id', d.id),
    stock: conFilas(s.stock, r?.stock, 'food_id'),
    preparado: conFilas(s.preparado, r?.preparado, 'recipe_id'),
  }),
  editarRegistro: (s, r) => ({
    ...s,
    registros: r.registro ? reemplazar(s.registros, r.registro, (x) => x.id === r.registro.id) : s.registros,
    stock: conFilas(s.stock, r.stock, 'food_id'),
    preparado: conFilas(s.preparado, r.preparado, 'recipe_id'),
  }),
  cocinar: (s, r) => ({ ...s, stock: conFilas(s.stock, r.stock, 'food_id'), preparado: conFilas(s.preparado, [r.preparado], 'recipe_id') }),
  fijarPreparado: (s, [fila]) => ({ ...s, preparado: reemplazar(s.preparado, fila, (x) => x.recipe_id === fila.recipe_id) }),
  ajustarStock: (s, filas) => ({ ...s, stock: conFilas(s.stock, filas, 'food_id') }),
  fijarStock: (s, filas) => ({ ...s, stock: conFilas(s.stock, filas, 'food_id') }),
  quitarDeDespensa: (s, _r, d) => ({ ...s, stock: sinFila(s.stock, 'food_id', d.food_id) }),
  fijarVencimiento: (s, filas) => ({ ...s, stock: conFilas(s.stock, filas, 'food_id') }),
  agregarALista: (s, [fila]) => ({ ...s, lista: reemplazar(s.lista, fila, (x) => x.food_id === fila.food_id) }),
  quitarDeLista: (s, _r, d) => ({ ...s, lista: sinFila(s.lista, 'food_id', d.food_id) }),
  quitarDelPlan: (s, [fila]) => ({ ...s, comprasQuitadas: reemplazar(s.comprasQuitadas || [], fila, (x) => x.food_id === fila.food_id) }),
  devolverAlPlan: (s, _r, d) => ({ ...s, comprasQuitadas: sinFila(s.comprasQuitadas || [], 'food_id', d.food_id) }),
  comprar: (s, r) => ({
    ...s,
    compras: [...s.compras, r.compra],
    stock: conFilas(s.stock, r.stock, 'food_id'),
    lista: r.lista ? sinFila(s.lista, 'id', r.lista) : s.lista,
  }),
}

export const LOCAL = {
  guardarEntreno: ENTRENO_LOCAL,
  borrarEntreno: (s, d) => sinEntreno(s, d.id),
  registrar: (s, d, uid) => {
    const usadas = new Map()
    for (const c of d.preparado || []) usadas.set(c.recipe_id, (usadas.get(c.recipe_id) || 0) + Number(c.delta))
    // Cada fila lleva lo que quiere descontar (`s` y `p`); los pedidos de antes de la versión 1.10 traen el total en `stock`
    const { descontados, stock, preparado } = descontarFilas(d.filas, s.stock, s.preparado)
    for (const c of preparado) usadas.set(c.recipe_id, (usadas.get(c.recipe_id) || 0) + Number(c.delta))
    return {
      ...s,
      registros: [
        ...sinMarca(s.registros, d),
        ...d.filas.map((f, i) => ({
          id: d.ids[i],
          user_id: uid,
          date: d.fecha,
          meal: d.comida,
          name: f.name,
          food_id: f.food_id ?? null,
          recipe_id: f.recipe_id ?? null,
          qty: f.qty,
          kcal: f.kcal ?? 0,
          protein: f.protein ?? 0,
          carbs: f.carbs ?? 0,
          fat: f.fat ?? 0,
          skipped: false,
          descontado: descontados[i],
          created_at: d.cuando,
          pendiente: true,
        })),
      ],
      stock: moverStock(s.stock, [...(d.stock || []), ...stock], ambito(s, uid), true),
      preparado: s.preparado.map((p) =>
        usadas.has(p.recipe_id) ? { ...p, portions: porciones(Number(p.portions) + usadas.get(p.recipe_id)) } : p,
      ),
    }
  },
  saltear: (s, d) => ({
    ...s,
    registros: [...sinFila(s.registros, 'id', d.fila.id), { ...d.fila, created_at: d.cuando, pendiente: true }],
  }),
  // Borrar devuelve a la despensa lo que el registro había descontado (lo que ya no está, no se vuelve a agregar)
  borrarRegistro: (s, d, uid) => {
    const fila = s.registros.find((x) => x.id === d.id)
    const vuelve = fila ? devolverRegistro(fila, s.stock, s.preparado) : { stock: [], preparado: [] }
    return {
      ...s,
      registros: sinFila(s.registros, 'id', d.id),
      stock: moverStock(s.stock, vuelve.stock, ambito(s, uid), true),
      preparado: s.preparado.map((p) => {
        const c = vuelve.preparado.find((x) => x.recipe_id === p.recipe_id)
        return c ? { ...p, portions: porciones(Number(p.portions) + c.delta) } : p
      }),
    }
  },
  editarRegistro: (s, d, uid) => {
    const fila = s.registros.find((x) => x.id === d.id)
    if (!fila) return s
    const r = ajustarRegistro(fila, d.qty, s.stock, s.preparado)
    return {
      ...s,
      registros: s.registros.map((x) => (x.id === d.id ? r.registro : x)),
      stock: moverStock(s.stock, r.stock, ambito(s, uid), true),
      preparado: s.preparado.map((p) => {
        const c = r.preparado.find((x) => x.recipe_id === p.recipe_id)
        return c ? { ...p, portions: porciones(Number(p.portions) + c.delta) } : p
      }),
    }
  },
  cocinar: (s, d, uid) => {
    const lista = s.preparado.find((p) => p.recipe_id === d.receta)
    const fila = lista
      ? { ...lista, portions: porciones(Number(lista.portions) + d.porciones) }
      : { user_id: ambito(s, uid), recipe_id: d.receta, portions: porciones(d.porciones) }
    return {
      ...s,
      stock: moverStock(s.stock, d.stock, ambito(s, uid)),
      preparado: reemplazar(s.preparado, fila, (x) => x.recipe_id === d.receta),
    }
  },
  fijarPreparado: (s, d) => GUARDADO.fijarPreparado(s, [d.fila]),
  ajustarStock: (s, d, uid) => ({ ...s, stock: moverStock(s.stock, [d], ambito(s, uid)) }),
  fijarStock: (s, d) => ({ ...s, stock: reemplazar(s.stock, d.fila, (x) => x.food_id === d.fila.food_id) }),
  quitarDeDespensa: (s, d) => GUARDADO.quitarDeDespensa(s, null, d),
  // Como la base: sin stock no queda fecha
  fijarVencimiento: (s, d) => ({
    ...s,
    stock: s.stock.map((x) => (x.food_id === d.food_id ? { ...x, expires_on: Number(x.qty) > 0 ? d.fecha : null } : x)),
  }),
  agregarALista: (s, d, uid) => {
    const estaba = s.lista.find((x) => x.food_id === d.food_id)
    const fila = estaba ? { ...estaba, qty: d.qty } : { id: d.id, user_id: ambito(s, uid), food_id: d.food_id, qty: d.qty, pendiente: true }
    return { ...s, lista: reemplazar(s.lista, fila, (x) => x.food_id === d.food_id) }
  },
  quitarDeLista: (s, d) => GUARDADO.quitarDeLista(s, null, d),
  quitarDelPlan: (s, d, uid) => {
    const fila = { user_id: ambito(s, uid), food_id: d.food_id, qty: d.qty, created_at: d.cuando, pendiente: true }
    return { ...s, comprasQuitadas: reemplazar(s.comprasQuitadas || [], fila, (x) => x.food_id === d.food_id) }
  },
  devolverAlPlan: (s, d) => GUARDADO.devolverAlPlan(s, null, d),
  comprar: (s, d, uid) => {
    // De la lista se saca lo que estaba anotado: primero el alimento que figuraba y, si no, el producto que se compró
    const anotada = s.lista.find((x) => x.food_id === d.anotado) || s.lista.find((x) => x.food_id === d.alimento)
    return {
      ...s,
      compras: [
        ...s.compras,
        {
          id: d.id,
          user_id: ambito(s, uid),
          comprado_por: s.hogar ? uid : null,
          food_id: d.alimento,
          name: d.nombre,
          qty: d.cantidad,
          price: d.precio,
          date: d.fecha,
          pendiente: true,
        },
      ],
      stock: moverStock(s.stock, [{ food_id: d.alimento, delta: d.cantidad }], ambito(s, uid)),
      lista: anotada ? s.lista.filter((x) => x !== anotada) : s.lista,
    }
  },
}

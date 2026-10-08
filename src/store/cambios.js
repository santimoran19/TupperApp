// Los cambios que se pueden hacer sin conexión, vistos del lado del teléfono.
// Cada uno tiene dos formas de entrar al estado:
//   GUARDADO[tipo](estado, respuesta, datos): con lo que contestó la base (el camino de siempre).
//   LOCAL[tipo](estado, datos, uid): sin respuesta. Hace en la copia del teléfono la misma cuenta que haría la base,
//     para que la pantalla quede como va a quedar cuando el cambio se mande.
// `datos` es lo que viaja a la base (ver envios.js) y se guarda en la cola tal cual: tiene que alcanzar para las dos cosas.
// Son funciones puras: no tocan la red ni el reloj (por eso los identificadores y la hora vienen adentro de `datos`).
// Las filas que se crean acá llevan `pendiente: true` hasta que la base las devuelva.
import { redondear } from '../lib/nutricion'
import { conFilas, entre, reemplazar } from './listas'

// Los mismos redondeos y topes que las funciones de la base
const cantidad = (n) => entre(redondear(n, 2), 0, 1000000)
const porciones = (n) => entre(redondear(n, 1), 0, 1000)

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

export const GUARDADO = {
  registrar: (s, r, d) => ({
    ...s,
    registros: [...sinMarca(s.registros, d), ...r.registros],
    stock: conFilas(s.stock, r.stock, 'food_id'),
    preparado: conFilas(s.preparado, r.preparado, 'recipe_id'),
  }),
  saltear: (s, [fila]) => ({ ...s, registros: [...sinFila(s.registros, 'id', fila.id), fila] }),
  borrarRegistro: (s, _r, d) => ({ ...s, registros: sinFila(s.registros, 'id', d.id) }),
  cocinar: (s, r) => ({ ...s, stock: conFilas(s.stock, r.stock, 'food_id'), preparado: conFilas(s.preparado, [r.preparado], 'recipe_id') }),
  fijarPreparado: (s, [fila]) => ({ ...s, preparado: reemplazar(s.preparado, fila, (x) => x.recipe_id === fila.recipe_id) }),
  ajustarStock: (s, filas) => ({ ...s, stock: conFilas(s.stock, filas, 'food_id') }),
  fijarStock: (s, filas) => ({ ...s, stock: conFilas(s.stock, filas, 'food_id') }),
  quitarDeDespensa: (s, _r, d) => ({ ...s, stock: sinFila(s.stock, 'food_id', d.food_id) }),
  agregarALista: (s, [fila]) => ({ ...s, lista: reemplazar(s.lista, fila, (x) => x.food_id === fila.food_id) }),
  quitarDeLista: (s, _r, d) => ({ ...s, lista: sinFila(s.lista, 'food_id', d.food_id) }),
  comprar: (s, r) => ({
    ...s,
    compras: [...s.compras, r.compra],
    stock: conFilas(s.stock, r.stock, 'food_id'),
    lista: r.lista ? sinFila(s.lista, 'id', r.lista) : s.lista,
  }),
}

export const LOCAL = {
  registrar: (s, d, uid) => {
    const usadas = new Map()
    for (const c of d.preparado || []) usadas.set(c.recipe_id, (usadas.get(c.recipe_id) || 0) + Number(c.delta))
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
          created_at: d.cuando,
          pendiente: true,
        })),
      ],
      stock: moverStock(s.stock, d.stock, uid, true),
      preparado: s.preparado.map((p) =>
        usadas.has(p.recipe_id) ? { ...p, portions: porciones(Number(p.portions) + usadas.get(p.recipe_id)) } : p,
      ),
    }
  },
  saltear: (s, d) => ({
    ...s,
    registros: [...sinFila(s.registros, 'id', d.fila.id), { ...d.fila, created_at: d.cuando, pendiente: true }],
  }),
  borrarRegistro: (s, d) => GUARDADO.borrarRegistro(s, null, d),
  cocinar: (s, d, uid) => {
    const lista = s.preparado.find((p) => p.recipe_id === d.receta)
    const fila = lista
      ? { ...lista, portions: porciones(Number(lista.portions) + d.porciones) }
      : { user_id: uid, recipe_id: d.receta, portions: porciones(d.porciones) }
    return { ...s, stock: moverStock(s.stock, d.stock, uid), preparado: reemplazar(s.preparado, fila, (x) => x.recipe_id === d.receta) }
  },
  fijarPreparado: (s, d) => GUARDADO.fijarPreparado(s, [d.fila]),
  ajustarStock: (s, d, uid) => ({ ...s, stock: moverStock(s.stock, [d], uid) }),
  fijarStock: (s, d) => ({ ...s, stock: reemplazar(s.stock, d.fila, (x) => x.food_id === d.fila.food_id) }),
  quitarDeDespensa: (s, d) => GUARDADO.quitarDeDespensa(s, null, d),
  agregarALista: (s, d, uid) => {
    const estaba = s.lista.find((x) => x.food_id === d.food_id)
    const fila = estaba ? { ...estaba, qty: d.qty } : { id: d.id, user_id: uid, food_id: d.food_id, qty: d.qty, pendiente: true }
    return { ...s, lista: reemplazar(s.lista, fila, (x) => x.food_id === d.food_id) }
  },
  quitarDeLista: (s, d) => GUARDADO.quitarDeLista(s, null, d),
  comprar: (s, d, uid) => {
    // De la lista se saca lo que estaba anotado: primero el alimento que figuraba y, si no, el producto que se compró
    const anotada = s.lista.find((x) => x.food_id === d.anotado) || s.lista.find((x) => x.food_id === d.alimento)
    return {
      ...s,
      compras: [
        ...s.compras,
        { id: d.id, user_id: uid, food_id: d.alimento, name: d.nombre, qty: d.cantidad, price: d.precio, date: d.fecha, pendiente: true },
      ],
      stock: moverStock(s.stock, [{ food_id: d.alimento, delta: d.cantidad }], uid),
      lista: anotada ? s.lista.filter((x) => x !== anotada) : s.lista,
    }
  },
}

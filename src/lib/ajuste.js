// Lo que se descuenta de la despensa al registrar una comida y cómo se ajusta cuando se cambia o se borra un registro.
// Es la misma cuenta que hacen `registrar_comida`, `editar_registro` y `borrar_registro` en la base
// (supabase/actualizacion-9.sql): se usa para mostrar el efecto antes de confirmar y para dejar la pantalla al día sin
// conexión. Son funciones puras: no tocan la red ni el reloj.
//
// Cada registro guarda en `descontado` lo que sacó de la despensa:
//   { s: [{ f: <alimento>, q: <lo que salió de verdad>, n: <lo que hacía falta> }], p: <porciones que salieron>, pn: <las que hacían falta> }
// o null si no se sabe (registros viejos). Si faltó stock, q es menor que n. Saber lo que hacía falta permite corregir
// un error: si se anotan 20 huevos con 8 en la despensa y después se vuelve a 4, los 4 se descuentan completos.
import { cantidadTexto, redondear } from './nutricion'

const EPS = 1e-9
const juntar = (lista) => {
  const m = new Map()
  for (const x of lista || []) m.set(x.f, (m.get(x.f) || 0) + Number(x.q))
  return m
}
const comoLista = (m, clave) => [...m].filter(([, delta]) => Math.abs(delta) > EPS).map(([id, delta]) => ({ [clave]: id, delta }))

// Descuenta fila por fila, solo de lo que hay, y devuelve lo que se descontó de verdad en cada una.
//   filas: [{ recipe_id, s: [{ f, q }], p }]   (sin `s` ni `p`: una fila de antes de esta versión, no se sabe)
//   stock / preparado: las filas de la despensa y de la comida lista, como están en el estado
export function descontarFilas(filas, stock, preparado) {
  const hay = new Map(stock.map((s) => [s.food_id, Number(s.qty)]))
  const listas = new Map(preparado.map((p) => [p.recipe_id, Number(p.portions)]))
  const cambiosStock = new Map()
  const cambiosListas = new Map()
  const descontados = filas.map((f) => {
    if (f.s === undefined && f.p === undefined) return null
    const s = []
    for (const [food, q] of juntar(f.s)) {
      const h = hay.get(food)
      if (h === undefined || !(q >= 0.005 && q <= 1000000)) continue // no está en la despensa: no hay de dónde descontar
      const toma = redondear(Math.min(q, h), 2)
      if (toma > 0) {
        hay.set(food, Math.max(0, redondear(h - toma, 2)))
        cambiosStock.set(food, (cambiosStock.get(food) || 0) - toma)
      }
      s.push({ f: food, q: toma, n: redondear(q, 2) })
    }
    let p = 0
    let pn = 0
    if (f.recipe_id && Number(f.p) >= 0.05 && Number(f.p) <= 1000 && listas.has(f.recipe_id)) {
      p = redondear(Math.min(Number(f.p), listas.get(f.recipe_id)), 1)
      pn = redondear(Number(f.p), 1)
      if (p > 0) {
        listas.set(f.recipe_id, Math.max(0, redondear(listas.get(f.recipe_id) - p, 1)))
        cambiosListas.set(f.recipe_id, (cambiosListas.get(f.recipe_id) || 0) - p)
      }
    }
    return { s, p, pn }
  })
  return { descontados, stock: comoLista(cambiosStock, 'food_id'), preparado: comoLista(cambiosListas, 'recipe_id') }
}

// Cambia la cantidad de un registro. Devuelve el registro como queda, las diferencias para la despensa y la comida
// lista (ya limitadas a lo que hay) y los avisos:
//   sinDatos: el registro es de antes de esta versión, solo se corrige el diario
//   faltan: [{ f, falta }]  no alcanzó la despensa, quedó en cero
//   ausentes: [alimento]    el producto ya no está en la despensa
//   porcionesFaltan, porcionesAusentes: lo mismo para las porciones de comida lista
export function ajustarRegistro(registro, qtyNueva, stock, preparado) {
  const qty = redondear(qtyNueva, 2)
  const razon = qty / Number(registro.qty)
  const macro = (n) => redondear(Number(n) * razon, 4)
  const nuevo = {
    ...registro,
    qty,
    kcal: macro(registro.kcal),
    protein: macro(registro.protein),
    carbs: macro(registro.carbs),
    fat: macro(registro.fat),
  }
  const avisos = { sinDatos: false, faltan: [], ausentes: [], porcionesFaltan: 0, porcionesAusentes: false }
  if (!registro.descontado) {
    avisos.sinDatos = true
    return { registro: nuevo, stock: [], preparado: [], avisos }
  }
  const hay = new Map(stock.map((s) => [s.food_id, Number(s.qty)]))
  const cambios = new Map()
  const s = []
  for (const { f, q, n } of registro.descontado.s || []) {
    const hecho0 = Number(q)
    const objetivo = redondear(Number(n ?? q) * razon, 2) // lo que hace falta descontar con la cantidad nueva
    let hecho = hecho0 // lo que va a quedar descontado de verdad
    if (objetivo > hecho0 + EPS) {
      const dif = redondear(objetivo - hecho0, 2)
      if (!hay.has(f)) avisos.ausentes.push(f)
      else {
        const toma = redondear(Math.min(dif, hay.get(f)), 2)
        if (toma > 0) cambios.set(f, -toma)
        if (toma < dif) avisos.faltan.push({ f, falta: redondear(dif - toma, 2) })
        hecho = redondear(hecho0 + toma, 2)
      }
    } else if (objetivo < hecho0 - EPS) {
      if (hay.has(f)) cambios.set(f, redondear(hecho0 - objetivo, 2))
      else avisos.ausentes.push(f)
      hecho = objetivo
    }
    s.push({ f, q: hecho, n: objetivo })
  }
  let p = Number(registro.descontado.p) || 0
  let pn = Number(registro.descontado.pn ?? p) || 0
  const cambiosListas = new Map()
  if (pn > 0 && registro.recipe_id) {
    const lista = preparado.find((x) => x.recipe_id === registro.recipe_id)
    const objetivo = redondear(pn * razon, 1)
    pn = objetivo
    if (objetivo > p + EPS) {
      const dif = redondear(objetivo - p, 1)
      if (!lista) avisos.porcionesAusentes = true
      else {
        const toma = redondear(Math.min(dif, Number(lista.portions)), 1)
        if (toma > 0) cambiosListas.set(registro.recipe_id, -toma)
        if (toma < dif) avisos.porcionesFaltan = redondear(dif - toma, 1)
        p = redondear(p + toma, 1)
      }
    } else if (objetivo < p - EPS) {
      if (lista) cambiosListas.set(registro.recipe_id, redondear(p - objetivo, 1))
      else avisos.porcionesAusentes = true
      p = objetivo
    }
  }
  nuevo.descontado = { s, p, pn }
  return { registro: nuevo, stock: comoLista(cambios, 'food_id'), preparado: comoLista(cambiosListas, 'recipe_id'), avisos }
}

// Lo que vuelve a la despensa al borrar un registro. Lo que ya no está en la despensa no se vuelve a agregar.
export function devolverRegistro(registro, stock, preparado) {
  const avisos = { ausentes: [], porcionesAusentes: false }
  if (!registro.descontado) return { stock: [], preparado: [], avisos }
  const hay = new Set(stock.map((s) => s.food_id))
  const cambios = []
  for (const { f, q } of registro.descontado.s || []) {
    if (!(Number(q) > 0)) continue
    if (hay.has(f)) cambios.push({ food_id: f, delta: Number(q) })
    else avisos.ausentes.push(f)
  }
  const cambiosListas = []
  const p = Number(registro.descontado.p) || 0
  if (p > 0 && registro.recipe_id) {
    if (preparado.some((x) => x.recipe_id === registro.recipe_id)) cambiosListas.push({ recipe_id: registro.recipe_id, delta: p })
    else avisos.porcionesAusentes = true
  }
  return { stock: cambios, preparado: cambiosListas, avisos }
}

// ¿Este cambio toca la despensa? (para decidir si hace falta preguntar antes)
export const tocaLaDespensa = (r) => r.stock.length > 0 || r.preparado.length > 0

// La base no deja un registro de más de 20.000 kcal
export const pasaDeCalorias = (registro, qty) => (Number(registro.kcal) * qty) / Number(registro.qty) > 20000

// ---------- Textos ----------
const porcionesTexto = (n) => `${redondear(n, 1)} ${redondear(n, 1) === 1 ? 'porción' : 'porciones'}`

// La cantidad de un registro como se lee: "200 g", "2 unidades", "1 porción"
export function cantidadDeRegistro(registro, alimento) {
  if (registro.food_id && alimento) return cantidadTexto(alimento, Number(registro.qty))
  if (registro.recipe_id) return porcionesTexto(registro.qty)
  return String(redondear(registro.qty, 2))
}

// Cuenta en palabras qué pasa con la despensa. `res` es lo que devuelve ajustarRegistro o devolverRegistro.
//   saber: { alimento(id), receta(id) }  para poner los nombres
// Devuelve { efectos, avisos }: líneas de texto. Los efectos son lo que se mueve; los avisos, lo que no se pudo.
export function describirAjuste(res, { alimento, receta }) {
  const a = res.avisos
  const nombre = (id) => alimento(id)?.name || 'un producto'
  const cant = (id, n) => (alimento(id) ? cantidadTexto(alimento(id), n) : String(redondear(n, 2)))
  const vuelven = []
  const salen = []
  for (const c of res.stock) (c.delta > 0 ? vuelven : salen).push(`${cant(c.food_id, Math.abs(c.delta))} de ${nombre(c.food_id)}`)
  for (const c of res.preparado)
    (c.delta > 0 ? vuelven : salen).push(`${porcionesTexto(Math.abs(c.delta))} ya cocinadas de ${receta(c.recipe_id)?.name || 'la receta'}`)
  const efectos = []
  if (vuelven.length) efectos.push(`Vuelve a la despensa: ${vuelven.join(', ')}.`)
  if (salen.length) efectos.push(`Se descuenta de la despensa: ${salen.join(', ')}.`)

  const avisos = []
  if (a.sinDatos)
    avisos.push('Este registro es de antes de que la app llevara la cuenta de la despensa: se corrige el diario y la despensa no cambia.')
  for (const f of a.faltan || []) avisos.push(`De ${nombre(f.f)} no alcanza (faltan ${cant(f.f, f.falta)}): la despensa queda en cero.`)
  if (a.porcionesFaltan)
    avisos.push(`No alcanzan las porciones ya cocinadas (faltan ${porcionesTexto(a.porcionesFaltan)}): quedan en cero.`)
  if (a.ausentes?.length) {
    const nombres = [...new Set(a.ausentes.map(nombre))]
    avisos.push(`${nombres.join(', ')} ya no ${nombres.length > 1 ? 'están' : 'está'} en la despensa: no se toca.`)
  }
  if (a.porcionesAusentes) avisos.push('Esa receta ya no figura entre las comidas cocinadas: no se toca.')
  return { efectos, avisos }
}

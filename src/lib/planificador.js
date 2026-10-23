// Cruza recetas con el stock: qué se puede cocinar, qué falta y cómo armar la semana.
import { COMIDAS, macrosDe } from './nutricion'
import { diaSemana, sumarDias } from './fechas'
import { diasParaVencer } from './despensa'

const EPS = 0.001

// ¿Alcanza el stock para `porciones` de la receta?
export function disponibilidad(receta, items, stock, porciones = 1) {
  const faltan = []
  for (const it of items) {
    const necesita = (it.qty / (receta.servings || 1)) * porciones
    const hay = stock.get(it.food_id) || 0
    if (hay + EPS < necesita) faltan.push({ food_id: it.food_id, falta: necesita - hay })
  }
  return { ok: faltan.length === 0, faltan }
}

// Cuántas porciones enteras se pueden cocinar con el stock actual
export function porcionesPosibles(receta, items, stock) {
  if (items.length === 0) return 0
  let max = Infinity
  for (const it of items) {
    const porPorcion = it.qty / (receta.servings || 1)
    max = Math.min(max, Math.floor(((stock.get(it.food_id) || 0) + EPS) / porPorcion))
  }
  return max === Infinity ? 0 : max
}

// Lo que aporta una comida del plan: las calorías y macros de la receta, o las del alimento suelto con su cantidad.
export function macrosDeFila(fila, { macrosPorReceta, alimentosPorId }) {
  if (fila?.recipe_id) return macrosPorReceta.get(fila.recipe_id) || null
  const a = fila?.food_id && alimentosPorId.get(fila.food_id)
  return a ? macrosDe(a, Number(fila.qty)) : null
}

// Recorre el plan en orden y dice, comida por comida, si hay con qué hacerla.
// Devuelve el estado de cada fila y el total de ingredientes que faltan comprar.
// `alimentoDe(fila)`: lo que gasta un alimento suelto, llevado al alimento base ([{ food_id, qty }]). Un alimento suelto solo
// cuenta si la persona lo lleva en la despensa (tiene una fila ahí, aunque esté agotado): el agua, el mate o una fruta que
// nunca anotó no tienen que aparecer como "falta comprar".
export function estadoDelPlan(filas, { recetas, itemsDe, stock, preparado, alimentoDe = () => [] }) {
  const sim = new Map(stock)
  const prep = new Map(preparado)
  const estados = new Map()
  const faltantes = new Map()
  const orden = [...filas].sort((a, b) => (a.date + COMIDAS.indexOf(a.meal)).localeCompare(b.date + COMIDAS.indexOf(b.meal)))
  for (const fila of orden) {
    if (fila.food_id) {
      const items = alimentoDe(fila).filter((it) => stock.has(it.food_id))
      if (items.length === 0) continue
      const faltan = []
      for (const it of items) {
        const hay = Math.max(sim.get(it.food_id) || 0, 0)
        if (hay + EPS < it.qty) {
          faltan.push({ food_id: it.food_id, falta: it.qty - hay })
          faltantes.set(it.food_id, (faltantes.get(it.food_id) || 0) + it.qty - hay)
        }
        sim.set(it.food_id, (sim.get(it.food_id) || 0) - it.qty)
      }
      estados.set(fila.id, { estado: faltan.length ? 'falta' : 'listo', faltan })
      continue
    }
    const receta = fila.recipe_id && recetas.get(fila.recipe_id)
    if (!receta) continue
    if ((prep.get(receta.id) || 0) >= 1) {
      prep.set(receta.id, prep.get(receta.id) - 1)
      estados.set(fila.id, { estado: 'preparado', faltan: [] })
      continue
    }
    const faltan = []
    for (const it of itemsDe(receta.id)) {
      const necesita = it.qty / (receta.servings || 1)
      const hay = Math.max(sim.get(it.food_id) || 0, 0)
      if (hay + EPS < necesita) {
        faltan.push({ food_id: it.food_id, falta: necesita - hay })
        faltantes.set(it.food_id, (faltantes.get(it.food_id) || 0) + necesita - hay)
      }
      sim.set(it.food_id, (sim.get(it.food_id) || 0) - necesita)
    }
    estados.set(fila.id, { estado: faltan.length ? 'falta' : 'listo', faltan })
  }
  return { estados, faltantes }
}

// Completa los huecos del plan para las fechas dadas, priorizando lo ya cocinado y lo que hay en stock.
// `existentes`: Map 'fecha|comida' -> fila ya guardada. `reglas`: Set 'diaSemana|comida' de comidas fuera de casa.
// `soloClaves`: si viene, solo se eligen recetas para esas 'fecha|comida' (sirve para cambiar una comida puntual).
// `ocultas`: recetas que el usuario no quiere ver; `favoritas`: tienen prioridad.
// `alimentoDe(fila)`: lo que gasta un alimento suelto del plan (ver estadoDelPlan).
// Para armar "con cabeza" (1.27), opcionales:
//   `vence` (Map alimento base -> fecha) y `hoy`: las recetas que gastan lo que vence pronto suben de puesto, y solo si todavía
//     está bueno ese día (un yogur que vence el martes no se planifica para el jueves);
//   `objetivoDe(fecha)` ({ kcal, protein } o null) y `macrosPorReceta`: cada comida se acerca a lo que le toca del objetivo del día
//     (descontando lo que ya tiene el plan), así los días no quedan muy por debajo ni por encima.
export const PESO_COMIDA = { desayuno: 0.22, almuerzo: 0.34, merienda: 0.14, cena: 0.3 }
export function armarPlan({
  fechas,
  recetas,
  itemsDe,
  stock,
  preparado,
  reglas,
  existentes,
  soloClaves = null,
  ocultas = new Set(),
  favoritas = new Set(),
  alimentoDe = () => [],
  vence = null,
  hoy = null,
  objetivoDe = null,
  macrosPorReceta = null,
  macrosDeExistente = null,
}) {
  const sim = new Map(stock)
  const prep = new Map(preparado)
  const usos = new Map()
  const nuevas = []
  const elegidas = new Map() // 'fecha|comida' -> recipe_id
  for (const [clave, fila] of existentes) if (fila.recipe_id) elegidas.set(clave, fila.recipe_id)

  // Lo que ya tiene cada día (kcal y proteína) para repartir lo que falta del objetivo
  const dia = new Map()
  const sumaDia = (fecha, m) => {
    if (!m) return
    const d = dia.get(fecha) || { kcal: 0, protein: 0 }
    d.kcal += Number(m.kcal) || 0
    d.protein += Number(m.protein) || 0
    dia.set(fecha, d)
  }
  if (objetivoDe && macrosPorReceta) {
    for (const [clave, fila] of existentes) {
      const fecha = clave.split('|')[0]
      sumaDia(fecha, fila.recipe_id ? macrosPorReceta.get(fila.recipe_id) : macrosDeExistente?.(fila))
    }
  }
  // Puntos por gastar lo que vence: más cuanto más pronto vence, y solo si ese día todavía está bueno
  const puntosPorVencer = (r, fecha) => {
    if (!vence || !hoy) return 0
    let p = 0
    for (const it of itemsDe(r.id)) {
      const f = vence.get(it.food_id)
      if (!f || f < fecha || (sim.get(it.food_id) || 0) <= 0) continue
      const dias = diasParaVencer(f, hoy)
      p += dias <= 3 ? 16 : dias <= 7 ? 9 : dias <= 14 ? 3 : 0
    }
    return Math.min(p, 30)
  }

  const consumir = (receta) => {
    usos.set(receta.id, (usos.get(receta.id) || 0) + 1)
    if ((prep.get(receta.id) || 0) >= 1) return prep.set(receta.id, prep.get(receta.id) - 1)
    for (const it of itemsDe(receta.id)) {
      sim.set(it.food_id, (sim.get(it.food_id) || 0) - it.qty / (receta.servings || 1))
    }
  }

  for (const fecha of fechas) {
    for (const comida of COMIDAS) {
      const clave = `${fecha}|${comida}`
      const ya = existentes.get(clave)
      const afuera = ya ? ya.away : reglas.has(`${diaSemana(fecha)}|${comida}`)
      if (ya?.recipe_id && recetas.get(ya.recipe_id)) {
        consumir(recetas.get(ya.recipe_id))
        continue
      }
      // Un alimento suelto puesto a mano se respeta: no se pisa ni se completa esa comida
      if (ya?.food_id) {
        for (const it of alimentoDe(ya)) if (stock.has(it.food_id)) sim.set(it.food_id, (sim.get(it.food_id) || 0) - it.qty)
        continue
      }
      if (soloClaves && !soloClaves.has(clave)) continue
      let candidatas = [...recetas.values()].filter((r) => !ocultas.has(r.id) && r.meal_types.includes(comida) && itemsDe(r.id).length > 0)
      if (afuera && candidatas.some((r) => r.portable)) candidatas = candidatas.filter((r) => r.portable)
      if (candidatas.length === 0) continue

      const ayer = elegidas.get(`${sumarDias(fecha, -1)}|${comida}`)
      const manana = elegidas.get(`${sumarDias(fecha, 1)}|${comida}`)
      const otraPrincipal =
        comida === 'cena' ? elegidas.get(`${fecha}|almuerzo`) : comida === 'almuerzo' ? elegidas.get(`${fecha}|cena`) : null
      // Lo que le toca a esta comida del objetivo del día: lo que falta, repartido entre las comidas que quedan por llenar
      let cuota = null
      const meta = objetivoDe && macrosPorReceta ? objetivoDe(fecha) : null
      if (meta?.kcal > 0) {
        const llevado = dia.get(fecha) || { kcal: 0, protein: 0 }
        const vacias = COMIDAS.filter(
          (c) =>
            c === comida ||
            !(existentes.get(`${fecha}|${c}`)?.recipe_id || existentes.get(`${fecha}|${c}`)?.food_id || elegidas.has(`${fecha}|${c}`)),
        )
        const parte = PESO_COMIDA[comida] / vacias.reduce((t, c) => t + PESO_COMIDA[c], 0)
        cuota = {
          kcal: Math.max(80, (meta.kcal - llevado.kcal) * parte),
          protein: meta.protein > 0 ? Math.max(0, (meta.protein - llevado.protein) * parte) : 0,
        }
      }
      let mejor = null
      for (const r of candidatas) {
        let puntos
        if ((prep.get(r.id) || 0) >= 1) puntos = 100
        else {
          const d = disponibilidad(r, itemsDe(r.id), sim)
          puntos = d.ok ? 50 : 10 - d.faltan.length * 3
        }
        if (favoritas.has(r.id)) puntos += 12
        puntos -= (usos.get(r.id) || 0) * 8
        if (r.id === otraPrincipal) puntos -= 60
        if (r.id === ayer || r.id === manana) puntos -= 6
        puntos -= r.minutes / 100
        puntos += puntosPorVencer(r, fecha)
        if (cuota) {
          const m = macrosPorReceta.get(r.id)
          if (m) {
            // Hasta -22 puntos si se aleja mucho de lo que le toca; un poco de premio por la proteína
            puntos -= Math.min(22, (Math.abs(m.kcal - cuota.kcal) / cuota.kcal) * 28)
            if (cuota.protein > 0) puntos += Math.min(1, m.protein / cuota.protein) * 6
          }
        }
        if (!mejor || puntos > mejor.puntos) mejor = { r, puntos }
      }
      consumir(mejor.r)
      if (cuota) sumaDia(fecha, macrosPorReceta.get(mejor.r.id))
      elegidas.set(clave, mejor.r.id)
      nuevas.push({ date: fecha, meal: comida, recipe_id: mejor.r.id, away: afuera })
    }
  }
  return nuevas
}

// Qué cosas que vencen pronto se aprovechan con lo que se armó: [{ food_id, fecha, dias, recetas: [nombre] }], de lo más urgente a lo menos.
// `nuevas`: lo que devolvió armarPlan. Sirve para decirle a la persona "con este plan gastás el yogur que vence el jueves".
export function aprovechado(nuevas, { recetas, itemsDe, vence, hoy, limite = 7 }) {
  const m = new Map()
  for (const n of nuevas) {
    const r = recetas.get(n.recipe_id)
    if (!r) continue
    for (const it of itemsDe(r.id)) {
      const f = vence.get(it.food_id)
      if (!f || f < n.date) continue
      const dias = diasParaVencer(f, hoy)
      if (dias > limite) continue
      const x = m.get(it.food_id) || { food_id: it.food_id, fecha: f, dias, recetas: [] }
      if (!x.recetas.includes(r.name)) x.recetas.push(r.name)
      m.set(it.food_id, x)
    }
  }
  return [...m.values()].sort((a, b) => a.dias - b.dias)
}

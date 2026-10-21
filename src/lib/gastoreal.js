// Gasto real calculado con los datos de la propia persona (F-19, fase 4).
//
// Las fórmulas generales son promedios de población y se equivocan entre 10 y 15 %. Con lo que la persona ya cargó se
// puede despejar cuánto gasta de verdad: si comió en promedio 2.000 kcal por día y su peso no se movió, gasta unas 2.000;
// si bajó medio kilo por semana, gasta unas 550 más. La cuenta: gasto = ingesta − cambio de peso × 7.700 kcal por kilo.
//
// Hace falta tiempo y datos: 4 semanas de ventana, al menos 21 días con la comida cargada (tres de cada cuatro: si faltan muchos,
// el promedio de lo comido no representa el período) y 4 pesajes que abarquen 14 días.
// El cambio de peso sale de una recta ajustada a todos los pesajes (la tendencia), no de la diferencia entre dos días, que
// se mueve por el agua, la comida y la hora. Con eso se calcula también cuánto se puede confiar en el resultado.
// Son funciones puras: la fecha de hoy se pasa de afuera.
import { aFecha, sumarDias } from './fechas'
import { gastoBase, objetivoDesdeGasto, TEF } from './gasto'

export const KCAL_POR_KILO = 7700
export const VENTANA_DIAS = 28
export const MIN_DIAS_REGISTRADOS = 21
export const MIN_PESAJES = 4
export const MIN_DIAS_ENTRE_PESAJES = 14
// Un día cuenta como "registrado" desde esta cantidad de calorías: con menos, casi seguro faltó cargar comidas
export const MIN_KCAL_DIA_REGISTRADO = 800
// Error que se supone en lo comido, en proporción. Anotar la comida casi siempre se queda corto (los estudios de ingesta
// autodeclarada lo muestran seguido), así que se supone un 10 % y no menos.
const ERROR_DE_REGISTRO = 0.1
// El factor propio solo se aplica si queda entre estos valores; fuera de eso es más probable que falten datos que un metabolismo así
export const FACTOR_MIN = 0.75
export const FACTOR_MAX = 1.3

// Valores críticos de la t de Student (95 %) según los grados de libertad
const T95 = [0, 12.71, 4.3, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23, 2.2, 2.18, 2.16, 2.14, 2.13]
export function tCritico(gl) {
  if (gl < 1) return Infinity
  if (gl < T95.length) return T95[gl]
  if (gl <= 20) return 2.09
  if (gl <= 30) return 2.04
  return 1.98
}

const dias = (a, b) => Math.round((aFecha(b) - aFecha(a)) / 86400000)

// Recta por mínimos cuadrados. `puntos`: [{ x, y }]. Devuelve la pendiente (y por unidad de x) y su error estándar.
export function regresionLineal(puntos) {
  const n = puntos.length
  if (n < 2) return null
  const mx = puntos.reduce((s, p) => s + p.x, 0) / n
  const my = puntos.reduce((s, p) => s + p.y, 0) / n
  const sxx = puntos.reduce((s, p) => s + (p.x - mx) ** 2, 0)
  if (sxx === 0) return null
  const sxy = puntos.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0)
  const pendiente = sxy / sxx
  const intercepto = my - pendiente * mx
  const sse = puntos.reduce((s, p) => s + (p.y - (intercepto + pendiente * p.x)) ** 2, 0)
  const errorPendiente = n > 2 ? Math.sqrt(sse / (n - 2) / sxx) : null
  return { pendiente, intercepto, n, errorPendiente, media: my }
}

// Lo comido por día (solo los días que cuentan como registrados): Map fecha -> kcal
export function ingestaPorDia(registros, desde, hasta) {
  const total = new Map()
  for (const r of registros || []) {
    if (r.skipped || r.date < desde || r.date > hasta) continue
    total.set(r.date, (total.get(r.date) || 0) + (Number(r.kcal) || 0))
  }
  for (const [fecha, kcal] of total) if (kcal < MIN_KCAL_DIA_REGISTRADO) total.delete(fecha)
  return total
}

// Cuánto falta para poder calcularlo, o null si ya hay lo necesario
export function loQueFalta({ diasRegistrados, pesajes, diasEntrePesajes }) {
  const falta = []
  if (diasRegistrados < MIN_DIAS_REGISTRADOS)
    falta.push(
      `Faltan ${MIN_DIAS_REGISTRADOS - diasRegistrados} días con la comida cargada (llevás ${diasRegistrados} de ${MIN_DIAS_REGISTRADOS}).`,
    )
  if (pesajes < MIN_PESAJES) falta.push(`Faltan ${MIN_PESAJES - pesajes} pesajes (llevás ${pesajes} de ${MIN_PESAJES}).`)
  else if (diasEntrePesajes < MIN_DIAS_ENTRE_PESAJES)
    falta.push(`Tus pesajes abarcan ${diasEntrePesajes} días; hacen falta ${MIN_DIAS_ENTRE_PESAJES}. Pesate de nuevo dentro de unos días.`)
  return falta
}

// Calcula el gasto real de las últimas 4 semanas.
//   perfil, registros (log_entries), medidas (measurements), entrenamientos (workouts), hoy ('AAAA-MM-DD').
// Los días de la ventana terminan AYER (hoy todavía no está completo). Devuelve siempre un objeto con `listo`:
//   listo: false -> { faltan: [texto], progreso } ; listo: true -> { gastoReal, rango, confianza, factor, ... }
export function calcularGastoReal({ perfil, registros, medidas, entrenamientos = [], hoy }) {
  const fin = sumarDias(hoy, -1)
  const inicio = sumarDias(fin, -(VENTANA_DIAS - 1))
  const ingesta = ingestaPorDia(registros, inicio, fin)
  const pesajes = (medidas || [])
    .filter((m) => Number(m.weight_kg) > 0 && m.date >= inicio && m.date <= hoy)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
  const diasEntrePesajes = pesajes.length > 0 ? dias(pesajes[0].date, pesajes[pesajes.length - 1].date) : 0
  const progreso = {
    inicio,
    fin,
    ventana: VENTANA_DIAS,
    diasRegistrados: ingesta.size,
    diasNecesarios: MIN_DIAS_REGISTRADOS,
    pesajes: pesajes.length,
    pesajesNecesarios: MIN_PESAJES,
    diasEntrePesajes,
  }
  const faltan = loQueFalta(progreso)
  if (faltan.length > 0) return { listo: false, faltan, progreso }

  const recta = regresionLineal(pesajes.map((p) => ({ x: dias(inicio, p.date), y: Number(p.weight_kg) })))
  if (!recta || recta.errorPendiente == null)
    return { listo: false, faltan: ['No alcanzan los pesajes para ver hacia dónde va tu peso.'], progreso }

  const promedio = [...ingesta.values()].reduce((s, k) => s + k, 0) / ingesta.size
  // El cambio de peso se mide en kg por día y se pasa a kcal por día
  const cambioKcal = recta.pendiente * KCAL_POR_KILO
  const gastoReal = promedio - cambioKcal
  // Error: el de la recta de peso (con la t de Student, porque son pocos puntos) y el de anotar la comida
  const errorPeso = tCritico(recta.n - 2) * recta.errorPendiente * KCAL_POR_KILO
  const errorComida = promedio * ERROR_DE_REGISTRO
  const error = Math.sqrt(errorPeso ** 2 + errorComida ** 2)
  const confianza = error < 250 ? 'alta' : error < 500 ? 'media' : 'baja'

  // Ejercicio promedio de la ventana: ya está contado aparte, así que se descuenta para sacar el factor del resto
  const ejercicio = entrenamientos.filter((w) => w.fecha >= inicio && w.fecha <= fin).reduce((s, w) => s + (Number(w.kcal) || 0), 0)
  const ejercicioPorDia = ejercicio / VENTANA_DIAS

  // Peso actual: el último pesaje (la recta lo suaviza, pero el último valor de la recta es una mejor referencia)
  const ultimoX = dias(inicio, pesajes[pesajes.length - 1].date)
  const pesoActual = recta.intercepto + recta.pendiente * ultimoX
  const sinFactor = gastoBase({ ...perfil, gasto_factor: null }, pesoActual, hoy)
  const resultado = {
    listo: true,
    progreso,
    ingestaPromedio: Math.round(promedio),
    cambioPesoPorSemana: recta.pendiente * 7,
    gastoReal: Math.round(gastoReal),
    rango: [Math.round(gastoReal - error), Math.round(gastoReal + error)],
    error: Math.round(error),
    confianza,
    ejercicioPorDia: Math.round(ejercicioPorDia),
    pesoTendencia: pesoActual,
    factor: null,
    factorAplicable: false,
    motivo: null,
  }
  if (!sinFactor) return { ...resultado, motivo: 'Faltan datos en tu perfil para comparar con la fórmula.' }

  const mantenimientoReal = gastoReal - ejercicioPorDia
  const factor = (mantenimientoReal * (1 - TEF)) / (sinFactor.tmb + sinFactor.neat)
  resultado.factor = Math.round(factor * 1000) / 1000
  resultado.mantenimientoReal = Math.round(mantenimientoReal)
  resultado.mantenimientoFormula = Math.round(sinFactor.mantenimiento)
  resultado.diferenciaConFormula = (mantenimientoReal - sinFactor.mantenimiento) / sinFactor.mantenimiento
  if (factor < FACTOR_MIN || factor > FACTOR_MAX) {
    resultado.motivo =
      'Tu gasto real da muy distinto al de la fórmula. Es más probable que falten comidas por cargar, o que haya pocos pesajes, a que tu metabolismo sea así: por eso no se aplica solo.'
  } else if (confianza === 'baja') {
    resultado.motivo =
      'Con los datos de hoy el margen de error es muy grande. Seguí cargando comidas y pesándote y volvé a mirar en unas semanas.'
  } else {
    resultado.factorAplicable = true
    const conFactor = gastoBase({ ...perfil, gasto_factor: resultado.factor }, pesoActual, hoy)
    resultado.objetivoSugerido = objetivoDesdeGasto(perfil, conFactor)
  }
  return resultado
}

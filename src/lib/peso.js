// El peso en el tiempo (1.29, F-10): la tendencia de las últimas semanas y, si va hacia la meta, cuándo se llegaría a ese
// ritmo. Es una estimación: el peso sube y baja de un día a otro (agua, sal, horario), así que se usa una recta ajustada a
// varias medidas y no la diferencia entre dos.
import { sumarDias } from './fechas'

const DIA = 86400000
const dias = (a, b) => Math.round((Date.parse(b + 'T12:00:00') - Date.parse(a + 'T12:00:00')) / DIA)

// Lo mínimo para estimar: 3 medidas que abarquen al menos 14 días
export const MINIMO_MEDIDAS = 3
export const MINIMO_DIAS = 14
// Más rápido que esto (por semana, en % del peso) no es lo recomendable: se avisa
export const RITMO_ALTO_PCT = 1

// `puntos`: [{ f: 'AAAA-MM-DD', v: kg }] ordenados por fecha. Usa los de las últimas `ventana` días hasta `hoy`.
// Devuelve null si no alcanza, o { kgPorSemana, desde, hasta, n, recta: (fecha) => kg }.
export function tendencia(puntos, hoy, ventana = 56) {
  const desde = sumarDias(hoy, -ventana)
  const usados = puntos.filter((p) => p.f >= desde && p.f <= hoy && p.v > 0)
  if (usados.length < MINIMO_MEDIDAS) return null
  const primero = usados[0].f
  if (dias(primero, usados[usados.length - 1].f) < MINIMO_DIAS) return null
  // Mínimos cuadrados: kg = a + b · días
  const xs = usados.map((p) => dias(primero, p.f))
  const ys = usados.map((p) => p.v)
  const n = xs.length
  const mx = xs.reduce((s, x) => s + x, 0) / n
  const my = ys.reduce((s, y) => s + y, 0) / n
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }
  if (den === 0) return null
  const b = num / den
  const a = my - b * mx
  return {
    kgPorSemana: b * 7,
    desde: primero,
    hasta: usados[usados.length - 1].f,
    n,
    recta: (fecha) => a + b * dias(primero, fecha),
  }
}

// Si la tendencia va hacia la meta, la fecha en que se llegaría a ese ritmo (y si el ritmo es muy rápido).
// { estado: 'llegaste' | 'sin_datos' | 'quieto' | 'alejandose' | 'en_camino', fecha?, semanas?, rapido? }
export function estimarMeta({ actual, meta, inicio, tend, hoy }) {
  if (!(meta > 0) || !(actual > 0)) return { estado: 'sin_meta' }
  const bajar = meta < (inicio || actual)
  if (bajar ? actual <= meta : actual >= meta) return { estado: 'llegaste' }
  if (!tend) return { estado: 'sin_datos' }
  const ritmo = tend.kgPorSemana
  // Menos de 100 g por semana es estar estable
  if (Math.abs(ritmo) < 0.1) return { estado: 'quieto' }
  if (bajar ? ritmo > 0 : ritmo < 0) return { estado: 'alejandose' }
  const semanas = Math.abs(actual - meta) / Math.abs(ritmo)
  // Más de dos años no es una estimación útil
  if (semanas > 104) return { estado: 'quieto' }
  return {
    estado: 'en_camino',
    semanas,
    fecha: sumarDias(hoy, Math.round(semanas * 7)),
    rapido: (Math.abs(ritmo) / actual) * 100 > RITMO_ALTO_PCT,
  }
}

// Lo que se muestra en "Falta", sirve para bajar y para subir de peso (antes, con una meta más alta que el peso de hoy,
// decía "¡Llegaste!")
export function faltaParaMeta({ actual, meta, inicio }) {
  if (!(meta > 0) || !(actual > 0)) return null
  const bajar = meta < (inicio || actual)
  const llegaste = bajar ? actual <= meta : actual >= meta
  return { llegaste, kg: Math.round(Math.abs(actual - meta) * 10) / 10, bajar }
}

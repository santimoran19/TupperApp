// Gasto, ejercicio y objetivo de calorías de un día (F-19), a partir de las tablas de la persona.
// Lo usan las pantallas (derivados.js) y el pedido del análisis semanal con IA, así los dos hablan del mismo número.
// Son funciones puras.
import { sumarDias } from './fechas'
import { ejercicioDelDia } from './ejercicio'
import { gastoBase, gastoDelDia, objetivoDelDia, pesoDelDia } from './gasto'

// { activo, base (el gasto sin entrenar), ejercicio (lo entrenado ese día), gasto (todo junto), objetivo ({ kcal, dinamico, base, extra, porPiso, sinDeficit }) }
// Con el cálculo apagado no hay gasto ni ejercicio: el objetivo es el fijo de siempre.
export function gastoDeFecha(perfil, medidas, entrenamientos, fecha) {
  if (!perfil) return { activo: false, base: null, ejercicio: null, gasto: null, objetivo: { kcal: 0, dinamico: false, base: 0, extra: 0 } }
  if (!perfil.gasto_activo) {
    const kcal = Number(perfil.kcal_target) || 0
    return { activo: false, base: null, ejercicio: null, gasto: null, objetivo: { kcal, dinamico: false, base: kcal, extra: 0 } }
  }
  const base = gastoBase(perfil, pesoDelDia(perfil, medidas, fecha), fecha)
  const ejercicio = ejercicioDelDia(entrenamientos, fecha)
  return {
    activo: true,
    base,
    ejercicio,
    gasto: gastoDelDia(base, ejercicio.kcal, ejercicio.rango),
    objetivo: objetivoDelDia(perfil, base, ejercicio.kcal),
  }
}

// Lo que se le cuenta al análisis semanal de cada día de la semana (hasta hoy): solo el objetivo de calorías de ese día.
// Con el modo dinámico el objetivo cambia de un día a otro (más los días que se entrena), así que el análisis no puede
// compararlo con un número fijo. A propósito NO se manda lo entrenado ni el gasto estimado: los términos de la app prometen
// que los datos de ejercicio y gasto no van a la IA. Devuelve [] si no hay perfil.
//   { fecha, objetivo_kcal, dinamico }
export function objetivosDeLaSemana(perfil, medidas, entrenamientos, lunes, hoy) {
  if (!perfil) return []
  const dias = []
  for (let i = 0; i < 7; i++) {
    const fecha = sumarDias(lunes, i)
    if (fecha > hoy) break
    const { objetivo } = gastoDeFecha(perfil, medidas, entrenamientos, fecha)
    dias.push({ fecha, objetivo_kcal: Math.round(objetivo.kcal), dinamico: !!objetivo.dinamico })
  }
  return dias
}

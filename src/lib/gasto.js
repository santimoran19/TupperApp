// Cuánto gasta una persona por día (F-19, fase 1) y cómo se arma el objetivo de calorías a partir de eso.
//
// El gasto de un día se separa en cuatro partes, para no contar nada dos veces:
//   TMB   metabolismo basal: lo que gasta el cuerpo en reposo. Mifflin-St Jeor o, si la persona sabe su % de grasa, Katch-McArdle.
//   NEAT  movimiento del día a día, sin entrenar: el trabajo y los pasos.
//   TEF   efecto térmico de la comida: lo que cuesta digerirla (en promedio, un 10 % de lo que se gasta).
//   EAT   ejercicio (ver ejercicio.js). Se cuenta NETO, sin el basal de esos minutos (que ya está en el TMB).
// El "factor de actividad" de siempre (1,2 a 1,725) mezclaba NEAT y ejercicio; acá van separados.
//
// Todo son estimaciones de población con un error de entre 10 y 15 %: por eso se muestra siempre un rango.
// Son funciones puras: no tocan la red, la pantalla ni el reloj (la fecha, si hace falta, se pasa de afuera).
import { edad as edadDe } from './fechas'
import { redondear } from './nutricion'

export const TIPOS_DE_TRABAJO = [
  { valor: 'escritorio', texto: 'Sentado casi todo el día', ejemplo: 'Oficina, estudio, home office' },
  { valor: 'de_pie', texto: 'De pie o caminando un rato', ejemplo: 'Comercio, docencia, atención al público' },
  { valor: 'fisico', texto: 'Trabajo físico', ejemplo: 'Construcción, depósito, reparto, limpieza' },
]
export const TRABAJO_POR_DEFECTO = 'escritorio'

// Qué parte del metabolismo basal se gasta además en el día a día, según el trabajo. Si se sabe cuántos pasos da la
// persona, esos pasos se cuentan aparte y la parte del trabajo es menor (el resto del movimiento: estar de pie, ordenar...).
const NEAT_SIN_PASOS = { escritorio: 0.12, de_pie: 0.28, fisico: 0.5 }
const NEAT_CON_PASOS = { escritorio: 0.08, de_pie: 0.14, fisico: 0.3 }
// Un paso gasta, en promedio, 0,00038 kcal por kilo de peso (caminar a paso normal, descontando el basal)
const KCAL_PASO_KG = 0.00038

// Qué parte de lo que se gasta es el efecto térmico de la comida
export const TEF = 0.1
// Margen de error que se muestra: ±12 % con la fórmula general, ±8 % cuando ya está ajustada con los datos de la persona
export const MARGEN_FORMULA = 0.12
export const MARGEN_PERSONAL = 0.08
// Piso de calorías por día (el mismo de siempre) y tope
export const PISO_KCAL = { f: 1300, m: 1500 }
export const TOPE_KCAL = 6000
// Recorte o superávit automático según el peso meta (los mismos de siempre: 22 % menos para bajar, 10 % más para subir)
export const RECORTE = -0.22
export const SUPERAVIT = 0.1

export const pisoKcal = (sexo) => (sexo === 'f' ? PISO_KCAL.f : PISO_KCAL.m)
const entre = (n, min, max) => Math.min(max, Math.max(min, n))

// Los datos mínimos para calcular el gasto. Devuelve la lista de lo que falta (vacía si alcanza).
export function datosQueFaltan(perfil, peso) {
  const falta = []
  if (!perfil?.sex) falta.push('el sexo')
  if (!perfil?.birth_date) falta.push('la fecha de nacimiento')
  if (!(Number(perfil?.height_cm) > 0)) falta.push('la altura')
  if (!(Number(peso) > 0)) falta.push('el peso')
  return falta
}

// El peso con el que se calcula un día: la última medida hasta esa fecha o, si no hay, el del perfil.
export function pesoDelDia(perfil, medidas, fecha) {
  let mejor = null
  for (const m of medidas || []) {
    if (!(Number(m.weight_kg) > 0) || (fecha && m.date > fecha)) continue
    if (!mejor || m.date > mejor.date) mejor = m
  }
  const peso = mejor ? Number(mejor.weight_kg) : Number(perfil?.weight_kg)
  return peso > 0 ? peso : null
}

// Metabolismo basal (kcal por día). Con % de grasa, Katch-McArdle (usa la masa magra); si no, Mifflin-St Jeor.
export function metabolismoBasal({ sexo, edad, altura, peso, grasa }) {
  if (grasa != null && grasa !== '' && Number(grasa) >= 3 && Number(grasa) <= 60) {
    const magra = peso * (1 - Number(grasa) / 100)
    return { kcal: 370 + 21.6 * magra, metodo: 'katch' }
  }
  return { kcal: 10 * peso + 6.25 * altura - 5 * edad + (sexo === 'f' ? -161 : 5), metodo: 'mifflin' }
}

// Movimiento del día a día sin entrenar
export function movimientoDiario({ tmb, trabajo, pasos, peso }) {
  const tipo = NEAT_SIN_PASOS[trabajo] != null ? trabajo : TRABAJO_POR_DEFECTO
  const conPasos = pasos != null && pasos !== '' && Number(pasos) >= 0
  const deTrabajo = tmb * (conPasos ? NEAT_CON_PASOS : NEAT_SIN_PASOS)[tipo]
  const dePasos = conPasos ? Number(pasos) * peso * KCAL_PASO_KG : 0
  return { kcal: deTrabajo + dePasos, deTrabajo, dePasos, conPasos, tipo }
}

// Todo lo que se sabe del gasto de una persona SIN contar el ejercicio, o null si faltan datos o están fuera de rango.
//   `peso`: el que se usa para la cuenta (ver pesoDelDia). `hoy`: 'AAAA-MM-DD', para sacar la edad.
export function gastoBase(perfil, peso, hoy) {
  if (!perfil || datosQueFaltan(perfil, peso).length > 0) return null
  const edad = edadDe(perfil.birth_date, hoy)
  const altura = Number(perfil.height_cm)
  // Con datos fuera de rango no se calcula nada (igual que objetivoSugerido)
  if (!edad || edad < 13 || edad > 100 || altura < 100 || altura > 250 || peso < 30 || peso > 300) return null
  const sexo = perfil.sex === 'f' ? 'f' : 'm'
  const basal = metabolismoBasal({ sexo, edad, altura, peso, grasa: perfil.body_fat_pct })
  const neat = movimientoDiario({ tmb: basal.kcal, trabajo: perfil.work_type, pasos: perfil.steps_per_day, peso })
  const factor = perfil.gasto_factor != null ? Number(perfil.gasto_factor) : 1
  const sinTef = (basal.kcal + neat.kcal) * factor
  const mantenimiento = sinTef / (1 - TEF)
  const margen = perfil.gasto_factor != null ? MARGEN_PERSONAL : MARGEN_FORMULA
  const supuestos = []
  if (!perfil.work_type) supuestos.push('Como no cargaste tu trabajo, se supone que pasás casi todo el día sentado.')
  if (perfil.steps_per_day == null) supuestos.push('Sin los pasos por día, el movimiento se estima solo con tu trabajo.')
  if (basal.metodo === 'mifflin') supuestos.push('Con tu % de grasa corporal el cálculo del basal sería más preciso.')
  return {
    sexo,
    edad,
    altura,
    peso,
    tmb: basal.kcal * factor,
    metodoTmb: basal.metodo,
    neat: neat.kcal * factor,
    neatDetalle: neat,
    tef: mantenimiento - sinTef,
    factor,
    personalizado: perfil.gasto_factor != null,
    mantenimiento,
    pal: mantenimiento / basal.kcal,
    rango: [mantenimiento * (1 - margen), mantenimiento * (1 + margen)],
    margen,
    supuestos,
  }
}

// Recorte o superávit sobre el mantenimiento, como fracción: -0,22 es un 22 % menos.
// Si la persona eligió uno, ese; si no, el automático según su peso meta. A menores de 18 no se les calcula recorte.
export function ajusteDe(perfil, base) {
  if (!base) return 0
  if (perfil?.gasto_ajuste_pct != null) return Number(perfil.gasto_ajuste_pct) / 100
  if (base.edad < 18) return 0
  const meta = Number(perfil?.goal_weight_kg)
  if (!meta) return 0
  if (meta < base.peso - 1) return RECORTE
  if (meta > base.peso + 1) return SUPERAVIT
  return 0
}

// El objetivo de calorías que sale del gasto, para usarlo como objetivo fijo (sin sumar ejercicio).
export function objetivoDesdeGasto(perfil, base) {
  if (!base) return null
  const ajuste = ajusteDe(perfil, base)
  const kcal = Math.round(entre(base.mantenimiento * (1 + ajuste), pisoKcal(base.sexo), 4500) / 50) * 50
  const protein = Math.round((1.7 * (Number(perfil?.goal_weight_kg) || base.peso)) / 5) * 5
  return { kcal, protein, ajuste, mantenimiento: Math.round(base.mantenimiento) }
}

// El objetivo de un día. Con el modo fijo (el de siempre) es el que la persona tiene guardado. Con el modo dinámico es el
// del día sin entrenar más una parte (`gasto_devuelve`, en %) de lo que se gastó entrenando: las estimaciones de ejercicio
// suelen pasarse, por eso no se devuelve todo. `ejercicio` son las calorías netas de ese día.
// Devuelve { kcal, dinamico, base, extra }: `base` es lo que corresponde sin entrenar y `extra`, lo que suma el ejercicio.
export function objetivoDelDia(perfil, base, ejercicio = 0) {
  const fijo = { kcal: Number(perfil?.kcal_target) || 0, dinamico: false, base: Number(perfil?.kcal_target) || 0, extra: 0 }
  if (!perfil?.gasto_activo || perfil.gasto_modo !== 'dinamico' || !base) return fijo
  const sinEntrenar = Math.max(pisoKcal(base.sexo), base.mantenimiento * (1 + ajusteDe(perfil, base)))
  const extra = (entre(Number(perfil.gasto_devuelve), 0, 100) / 100) * Math.max(0, Number(ejercicio) || 0)
  const kcal = Math.round(entre(sinEntrenar + extra, pisoKcal(base.sexo), TOPE_KCAL) / 10) * 10
  return { kcal, dinamico: true, base: Math.round(sinEntrenar / 10) * 10, extra: kcal - Math.round(sinEntrenar / 10) * 10 }
}

// Lo que se gastó en un día: el mantenimiento más el ejercicio de ese día, repartido en sus partes
//   `rangoEjercicio` [mínimo, máximo]: el rango de lo gastado entrenando (ver ejercicio.js). Sin él, se supone ±30 %.
export function gastoDelDia(base, ejercicio = 0, rangoEjercicio = null) {
  if (!base) return null
  const eat = Math.max(0, Number(ejercicio) || 0)
  const [eMin, eMax] = rangoEjercicio || [eat * 0.7, eat * 1.3]
  return {
    total: base.mantenimiento + eat,
    tmb: base.tmb,
    neat: base.neat,
    tef: base.tef,
    ejercicio: eat,
    rango: [base.rango[0] + eMin, base.rango[1] + eMax],
  }
}

// Calorías que cuesta digerir lo comido: 25 % de las de la proteína, 7,5 % de las de los hidratos y 1,5 % de las de la
// grasa. Se muestra como dato del día; para el objetivo se usa el 10 % de siempre (así lo comido no mueve el objetivo).
export function tefDeMacros({ protein = 0, carbs = 0, fat = 0 }) {
  return Number(protein) * 4 * 0.25 + Number(carbs) * 4 * 0.075 + Number(fat) * 9 * 0.015
}

// Las partes del gasto de un día sin entrenar, listas para mostrar
export function partesDelGasto(base) {
  if (!base) return []
  const r = (n) => redondear(n, 0)
  return [
    {
      clave: 'tmb',
      titulo: 'Metabolismo basal',
      kcal: r(base.tmb),
      formula:
        base.metodoTmb === 'katch'
          ? 'Katch-McArdle: 370 + 21,6 × masa magra (tu peso sin la grasa)'
          : 'Mifflin-St Jeor: 10 × peso + 6,25 × altura − 5 × edad ± 5 o 161',
      detalle: 'Lo que gasta tu cuerpo en reposo, solo por estar vivo.',
    },
    {
      clave: 'neat',
      titulo: 'Movimiento del día a día',
      kcal: r(base.neat),
      formula: base.neatDetalle.conPasos
        ? `Un porcentaje del basal según tu trabajo + pasos × peso × 0,00038 (unas ${r(base.neatDetalle.dePasos * base.factor)} kcal de pasos)`
        : 'Un porcentaje del basal según tu trabajo',
      detalle: 'Trabajar, caminar, subir escaleras, ordenar: todo lo que no es entrenar.',
    },
    {
      clave: 'tef',
      titulo: 'Efecto térmico de la comida',
      kcal: r(base.tef),
      formula: 'Un 10 % de lo que gastás en total',
      detalle: 'Digerir y absorber lo que comés gasta energía; la proteína gasta mucho más que la grasa.',
    },
  ]
}

// Cómo se llama la confianza que se le tiene al gasto, para mostrar
export function confianzaDelGasto(base) {
  if (!base) return null
  if (base.personalizado) return { nivel: 'personal', texto: 'Ajustado con tus propios datos' }
  return base.metodoTmb === 'katch' && base.neatDetalle.conPasos
    ? { nivel: 'media', texto: 'Estimación con más datos tuyos' }
    : { nivel: 'general', texto: 'Estimación general' }
}

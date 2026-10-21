// Calorías de un entrenamiento (F-19, fase 2).
//
// Se usa el dato más preciso que haya, en este orden:
//   1. reloj      lo que marcó el reloj (la persona lo carga a mano). Los relojes también se equivocan entre 20 y 40 %.
//   2. pulso      pulso promedio, con la fórmula de Keytel (2005). Sirve de unos 90 latidos para arriba.
//   3. distancia  distancia y desnivel, con las ecuaciones del ACSM para caminar y correr y, en bici, los METs según la velocidad.
//   4. mets       METs del Compendio de Actividades Físicas según duración y esfuerzo (de 1 a 10).
// Lo que se guarda y se suma al día son calorías NETAS: las del entrenamiento menos el metabolismo basal de esos minutos,
// que ya está contado en el TMB (si no, se contaría dos veces). Es una estimación con rango, nunca una medición.
// Son funciones puras.
import { redondear } from './nutricion'

export const METODOS = {
  reloj: { texto: 'Reloj', margen: 0.3 },
  pulso: { texto: 'Pulso promedio', margen: 0.2 },
  distancia: { texto: 'Distancia y ritmo', margen: 0.2 },
  mets: { texto: 'Esfuerzo y duración', margen: 0.3 },
}
export const ORDEN_DE_METODOS = ['reloj', 'pulso', 'distancia', 'mets']

// Margen de error para mostrar un rango. Las pesas se estiman peor que el resto.
export const margenDe = (metodo, categoria = null) => (categoria === 'fuerza' ? 0.4 : (METODOS[metodo]?.margen ?? 0.3))

// Topes de lo que se acepta (una cuenta que da más que esto es un error de carga)
export const MAX_KCAL_POR_MINUTO = 25
export const MAX_KCAL_ENTRENAMIENTO = 10000
export const PULSO_MINIMO_PARA_CALCULAR = 90
const KCAL_POR_LITRO_DE_OXIGENO = 5

export const ESFUERZOS = [
  { valor: 2, texto: 'Suave', ayuda: 'Podés charlar sin esfuerzo' },
  { valor: 5, texto: 'Medio', ayuda: 'Respirás fuerte pero charlás de a frases' },
  { valor: 8, texto: 'Fuerte', ayuda: 'Cuesta hablar' },
]
export const ESFUERZO_POR_DEFECTO = 5

// METs de la actividad según el esfuerzo: 2 o menos es suave, 5 es medio y 8 o más es fuerte; en el medio se interpola
export function metsDeEsfuerzo(tipo, esfuerzo) {
  const e = Math.min(10, Math.max(1, Number(esfuerzo) || ESFUERZO_POR_DEFECTO))
  const s = Number(tipo.mets_suave)
  const m = Number(tipo.mets_medio)
  const f = Number(tipo.mets_fuerte)
  if (e <= 2) return s
  if (e <= 5) return s + ((m - s) * (e - 2)) / 3
  if (e <= 8) return m + ((f - m) * (e - 5)) / 3
  return f
}

// kcal por minuto de reposo (el basal de la persona repartido en el día)
const basalPorMinuto = (tmb) => Math.max(0, Number(tmb) || 0) / 1440

// Fórmula de Keytel et al. (2005): kcal por minuto con el pulso promedio. Sin VO2 máximo, error de alrededor de 20 %.
export function kcalPorMinutoConPulso({ sexo, edad, peso, pulso }) {
  const kj =
    sexo === 'f' ? -20.4022 + 0.4472 * pulso - 0.1263 * peso + 0.074 * edad : -55.0969 + 0.6309 * pulso + 0.1988 * peso + 0.2017 * edad
  return Math.max(0, kj / 4.184)
}

// Ecuaciones del ACSM: consumo de oxígeno (ml por kilo por minuto) a una velocidad (metros por minuto) y una pendiente (fracción)
export const vo2Caminando = (v, pendiente) => 0.1 * v + 1.8 * v * pendiente + 3.5
export const vo2Corriendo = (v, pendiente) => 0.2 * v + 0.9 * v * pendiente + 3.5

// Caminar y correr tienen ecuaciones distintas: aunque la actividad diga una, la velocidad manda
// (caminar a más de 7,2 km/h o "correr" a menos de 4,8 km/h cuentan con la otra ecuación)
const CAMINA_HASTA = 120 // m/min
const CORRE_DESDE = 80 // m/min

// METs de andar en bici según la velocidad (km/h), del Compendio: el paseo, el ritmo medio, el fuerte...
const BICI = [
  [8, 3.5],
  [14, 4],
  [17.6, 6.8],
  [20.8, 8],
  [24.1, 10],
  [28.2, 12],
  [32.2, 15.8],
]
export function metsDeBici(kmh) {
  if (kmh <= BICI[0][0]) return BICI[0][1]
  for (let i = 1; i < BICI.length; i++) {
    if (kmh <= BICI[i][0]) {
      const [x0, y0] = BICI[i - 1]
      const [x1, y1] = BICI[i]
      return y0 + ((y1 - y0) * (kmh - x0)) / (x1 - x0)
    }
  }
  return BICI[BICI.length - 1][1]
}
// En bici, subir cuesta aparte: la energía de levantar a la persona y la bici (rendimiento del cuerpo: 24 %)
const PESO_DE_LA_BICI = 8
export const kcalDeSubirEnBici = (peso, desnivel) => ((peso + PESO_DE_LA_BICI) * 9.81 * desnivel) / 0.24 / 4184

const numero = (v) => (v === '' || v === null || v === undefined ? null : Number(v))

// Calcula las calorías de un entrenamiento. Devuelve { kcal, bruto, metodo, rango, basal, aviso } o { error } si no se puede.
//   tipo:    la actividad del catálogo { metrica, mets_suave, mets_medio, mets_fuerte, category }
//   datos:   { minutos, distancia (km), desnivel (m de subida), pulso, esfuerzo (1 a 10), reloj (kcal) }
//   persona: { peso, edad, sexo, tmb } (tmb en kcal por día)
export function calcularEntrenamiento(tipo, datos, persona) {
  const minutos = numero(datos.minutos)
  if (!(minutos >= 1 && minutos <= 1440)) return { error: 'La duración tiene que estar entre 1 y 1.440 minutos.' }
  const { peso, edad, sexo, tmb } = persona || {}
  if (!(peso > 0) || !(edad > 0)) return { error: 'Faltan datos de tu perfil para calcular las calorías.' }
  const basal = basalPorMinuto(tmb) * minutos
  const tope = Math.min(MAX_KCAL_ENTRENAMIENTO, MAX_KCAL_POR_MINUTO * minutos)
  const reloj = numero(datos.reloj)
  const pulso = numero(datos.pulso)
  const distancia = numero(datos.distancia)
  const desnivel = numero(datos.desnivel) || 0
  const categoria = tipo?.category || null
  let bruto = null
  let metodo = null
  let aviso = null

  if (reloj != null && reloj > 0) {
    if (reloj > tope) return { error: 'Las calorías del reloj parecen demasiado altas para esa duración. Revisalas.' }
    bruto = reloj
    metodo = 'reloj'
  } else if (pulso != null && pulso >= PULSO_MINIMO_PARA_CALCULAR) {
    bruto = kcalPorMinutoConPulso({ sexo, edad, peso, pulso }) * minutos
    metodo = 'pulso'
  } else if (
    distancia != null &&
    distancia > 0 &&
    (tipo?.metrica === 'correr' || tipo?.metrica === 'caminar' || tipo?.metrica === 'bici')
  ) {
    const metros = distancia * 1000
    const v = metros / minutos // m/min
    const pendiente = Math.max(0, desnivel) / metros
    if (pendiente > 0.35) return { error: 'El desnivel es demasiado para esa distancia. Revisalo.' }
    if (tipo.metrica === 'bici') {
      const kmh = (v * 60) / 1000
      if (kmh < 3 || kmh > 70) return { error: 'La velocidad que sale de la distancia y la duración no es posible. Revisalas.' }
      bruto = metsDeBici(kmh) * peso * (minutos / 60) + (pendiente > 0.01 ? kcalDeSubirEnBici(peso, desnivel) : 0)
    } else {
      if (v < 20 || v > 400) return { error: 'El ritmo que sale de la distancia y la duración no es posible. Revisalas.' }
      const corriendo = tipo.metrica === 'correr' ? v >= CORRE_DESDE : v > CAMINA_HASTA
      const vo2 = (corriendo ? vo2Corriendo : vo2Caminando)(v, pendiente)
      bruto = ((vo2 * peso * minutos) / 1000) * KCAL_POR_LITRO_DE_OXIGENO
      if (corriendo !== (tipo.metrica === 'correr'))
        aviso = corriendo ? 'Por el ritmo se calculó como si fuera una carrera.' : 'Por el ritmo se calculó como si fuera una caminata.'
    }
    metodo = 'distancia'
  } else if (tipo) {
    bruto = metsDeEsfuerzo(tipo, datos.esfuerzo) * peso * (minutos / 60)
    metodo = 'mets'
  } else {
    return { error: 'Elegí una actividad.' }
  }

  if (!(bruto >= 0) || !Number.isFinite(bruto)) return { error: 'No se pudo calcular. Revisá los datos.' }
  if (bruto > tope) bruto = tope
  const neto = Math.max(0, bruto - basal)
  const margen = margenDe(metodo, categoria)
  return {
    kcal: redondear(neto, 0),
    bruto: redondear(bruto, 0),
    basal: redondear(basal, 0),
    metodo,
    margen,
    rango: [redondear(neto * (1 - margen), 0), redondear(neto * (1 + margen), 0)],
    aviso,
  }
}

// ---------- Lo del día ----------
// Suma los entrenamientos de un día. El rango suma el margen de cada uno según el método con que se calculó.
export function ejercicioDelDia(entrenamientos, fecha) {
  const delDia = (entrenamientos || []).filter((w) => w.fecha === fecha)
  let kcal = 0
  let minimo = 0
  let maximo = 0
  let minutos = 0
  for (const w of delDia) {
    const k = Number(w.kcal) || 0
    const m = margenDe(w.metodo)
    kcal += k
    minimo += k * (1 - m)
    maximo += k * (1 + m)
    minutos += Number(w.duration_min) || 0
  }
  return {
    kcal: Math.round(kcal),
    minutos,
    cantidad: delDia.length,
    rango: [Math.round(minimo), Math.round(maximo)],
    entrenamientos: delDia,
  }
}

// Un resumen de varios días (por ejemplo, la semana)
export function resumenDeEjercicio(entrenamientos, desde, hasta) {
  const lista = (entrenamientos || []).filter((w) => w.fecha >= desde && w.fecha <= hasta)
  return {
    cantidad: lista.length,
    minutos: lista.reduce((s, w) => s + (Number(w.duration_min) || 0), 0),
    kcal: Math.round(lista.reduce((s, w) => s + (Number(w.kcal) || 0), 0)),
    dias: new Set(lista.map((w) => w.fecha)).size,
  }
}

// ---------- Catálogo ----------
export const CATEGORIAS_EJERCICIO = [
  ['cardio', 'Caminar y correr'],
  ['bici', 'Bicicleta'],
  ['agua', 'Agua'],
  ['pelota', 'Deportes de pelota'],
  ['raqueta', 'Raqueta y paleta'],
  ['baile', 'Baile y clases'],
  ['mente_cuerpo', 'Yoga, pilates y elongación'],
  ['fuerza', 'Fuerza y entrenamiento funcional'],
  ['combate', 'Combate'],
  ['aire_libre', 'Aire libre'],
  ['otro', 'Otras'],
]
export const nombreDeCategoria = (c) => CATEGORIAS_EJERCICIO.find(([k]) => k === c)?.[1] || 'Otras'

// Las actividades agrupadas por categoría, en el orden de la lista, con las propias de la persona primero
export function agruparActividades(tipos) {
  const grupos = []
  for (const [clave, nombre] of CATEGORIAS_EJERCICIO) {
    const lista = tipos
      .filter((t) => t.category === clave)
      .sort((a, b) => (a.owner ? 0 : 1) - (b.owner ? 0 : 1) || a.name.localeCompare(b.name, 'es'))
    if (lista.length > 0) grupos.push({ clave, nombre, lista })
  }
  return grupos
}

// Texto para buscar: sin tildes ni mayúsculas ("Pádel" se encuentra escribiendo "padel")
export const paraBuscar = (t) =>
  String(t || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

// Las actividades (o ejercicios) cuyo nombre tiene todas las palabras buscadas
export function filtrarPorNombre(lista, texto) {
  const palabras = paraBuscar(texto).split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return lista
  return lista.filter((x) => {
    const nombre = paraBuscar(x.name)
    return palabras.every((p) => nombre.includes(p))
  })
}

// Límites para validar el formulario
export const LIM_EJERCICIO = {
  minutos: [1, 1440],
  distancia: [0.1, 1000],
  desnivel: [0, 20000],
  pulso: [30, 230],
  esfuerzo: [1, 10],
  reloj: [1, MAX_KCAL_ENTRENAMIENTO],
  mets: [1, 20],
  notas: 300,
}

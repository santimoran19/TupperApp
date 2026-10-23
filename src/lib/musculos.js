// El mapa de músculos (1.24): las zonas de cada grupo muscular dibujadas sobre la silueta, de frente y de espalda, y la
// cuenta de cuánto se entrenó cada uno. Los grupos son los del catálogo de gimnasio (scripts/gym-data.mjs).
// Funciones puras.
import { CENTRO, curva, ejes, enEje, medidas } from './silueta'

export const GRUPOS_MUSCULARES = [
  ['pecho', 'Pecho'],
  ['espalda', 'Espalda'],
  ['hombros', 'Hombros'],
  ['biceps', 'Bíceps'],
  ['triceps', 'Tríceps'],
  ['antebrazos', 'Antebrazos'],
  ['abdomen', 'Abdomen y core'],
  ['cuadriceps', 'Cuádriceps'],
  ['isquios', 'Isquiotibiales'],
  ['gluteos', 'Glúteos'],
  ['pantorrillas', 'Pantorrillas'],
]
export const CLAVES_MUSCULARES = GRUPOS_MUSCULARES.map(([k]) => k)
// "Cuerpo completo" no es una zona: cuenta para todas
export const CUERPO_COMPLETO = 'cuerpo_completo'

// Una zona sobre una extremidad: entre t0 y t1 del eje, con el ancho hacia afuera (wo) y hacia adentro (wi) en cada punta
function zona(punto, t0, t1, [wo0, wi0], [wo1, wi1], abombado = 1.08) {
  const tm = (t0 + t1) / 2
  return curva([
    punto(t0, (wo0 - wi0) / 2),
    punto(t0 + (t1 - t0) * 0.15, wo0),
    punto(tm, ((wo0 + wo1) / 2) * abombado),
    punto(t1 - (t1 - t0) * 0.15, wo1),
    punto(t1, (wo1 - wi1) / 2),
    punto(t1 - (t1 - t0) * 0.15, -wi1),
    punto(tm, (-(wi0 + wi1) / 2) * abombado),
    punto(t0 + (t1 - t0) * 0.15, -wi0),
  ])
}

const espejo = (pts) => pts.map(([x, y]) => [2 * CENTRO - x, y])
const par = (izq) => [curva(izq), curva(espejo(izq))]

// Las zonas de una vista ('frente' o 'espalda') para un cuerpo de `sexo` y `grasa` (se dibujan sobre esa silueta).
//   { [grupo]: [trazos SVG] }
export function zonas(vista, sexo = 'm', grasa = null) {
  const m = medidas(grasa ?? (sexo === 'f' ? 22 : 14), sexo)
  const cx = CENTRO
  const eje = ejes(m)
  const brazo = (lado) => enEje(...eje.brazo(lado), lado)
  const pierna = (lado) => enEje(...eje.pierna(lado), lado)
  const ambos = (f) => [f(-1), f(1)]
  const cintura = m.cintura + m.panza * 0.35
  const hombro = (lado) =>
    curva([
      [cx + lado * (m.hombros * 0.66), 77],
      [cx + lado * (m.hombros - 1), 82],
      [cx + lado * (m.hombros + 4), 96],
      [cx + lado * (m.hombros + 1), 112],
      [cx + lado * (m.hombros - 8), 104],
      [cx + lado * (m.hombros - 11), 88],
    ])

  if (vista === 'frente') {
    return {
      hombros: ambos(hombro),
      pecho: par([
        [cx - 2, 90],
        [cx - m.pecho * 0.55, 86],
        [cx - m.pecho + 4, 92],
        [cx - m.pecho + 3, 112],
        [cx - m.pecho * 0.5, 124 + m.pechos * 0.6],
        [cx - 3, 122],
      ]),
      abdomen: [
        curva([
          [cx - 11, 128],
          [cx + 11, 128],
          [cx + 13, 160],
          [cx + 12, 196],
          [cx, 206],
          [cx - 12, 196],
          [cx - 13, 160],
        ]),
        ...par([
          [cx - 16, 132],
          [cx - cintura + 4, 140],
          [cx - cintura + 3, 172],
          [cx - 18, 194],
          [cx - 16, 165],
        ]),
      ],
      biceps: ambos((l) => zona(brazo(l), 0.15, 0.45, [m.brazo * 0.75, m.brazo * 0.6], [m.antebrazo * 0.6, m.antebrazo * 0.45])),
      antebrazos: ambos((l) => zona(brazo(l), 0.52, 0.9, [m.antebrazo * 0.85, m.antebrazo * 0.55], [m.muneca * 0.7, m.muneca * 0.5], 1.04)),
      cuadriceps: ambos((l) => zona(pierna(l), 0.1, 0.47, [m.muslo * 0.85, m.muslo * 0.55], [m.rodilla * 0.8, m.rodilla * 0.6])),
      pantorrillas: ambos((l) =>
        zona(pierna(l), 0.56, 0.8, [m.pantorrilla * 0.95, m.pantorrilla * 0.25], [m.tobillo * 0.85, m.tobillo * 0.15], 1.06),
      ),
    }
  }
  return {
    hombros: ambos(hombro),
    espalda: [
      // Trapecio
      curva([
        [cx, 64],
        [cx + m.cuello + 4, 72],
        [cx + m.hombros * 0.7, 82],
        [cx + 9, 112],
        [cx, 124],
        [cx - 9, 112],
        [cx - m.hombros * 0.7, 82],
        [cx - m.cuello - 4, 72],
      ]),
      // Dorsales
      ...par([
        [cx - 11, 112],
        [cx - m.pecho + 2, 102],
        [cx - m.pecho + 3, 124],
        [cx - cintura + 2, 156],
        [cx - 7, 172],
        [cx - 5, 132],
      ]),
      // Lumbares
      curva([
        [cx - 5, 176],
        [cx + 5, 176],
        [cx + 13, 190],
        [cx, 198],
        [cx - 13, 190],
      ]),
    ],
    triceps: ambos((l) => zona(brazo(l), 0.13, 0.46, [m.brazo * 0.8, m.brazo * 0.55], [m.antebrazo * 0.65, m.antebrazo * 0.4])),
    antebrazos: ambos((l) => zona(brazo(l), 0.52, 0.9, [m.antebrazo * 0.85, m.antebrazo * 0.55], [m.muneca * 0.7, m.muneca * 0.5], 1.04)),
    gluteos: par([
      [cx - 2, 196],
      [cx - m.cadera * 0.6, 192],
      [cx - m.cadera + 2, 206],
      [cx - m.cadera + 4, 222],
      [cx - m.cadera * 0.45, 232],
      [cx - 2, 226],
    ]),
    isquios: ambos((l) => zona(pierna(l), 0.2, 0.5, [m.muslo * 0.75, m.muslo * 0.6], [m.rodilla * 0.6, m.rodilla * 0.55])),
    pantorrillas: ambos((l) =>
      zona(pierna(l), 0.54, 0.82, [m.pantorrilla * 0.95, m.pantorrilla * 0.7], [m.tobillo * 0.8, m.tobillo * 0.6], 1.08),
    ),
  }
}

// ---------- Cuánto se entrenó cada uno ----------
// Junta las series de gimnasio (sin la entrada en calor) y los entrenamientos en los que la persona marcó músculos.
// "Cuerpo completo" suma a todos. Devuelve Map grupo -> { series, sesiones }.
export function trabajoPorMusculo({ series = [], entrenamientos = [], ejerciciosPorId = new Map() }) {
  const m = new Map(CLAVES_MUSCULARES.map((k) => [k, { series: 0, sesiones: 0 }]))
  const sumar = (grupo, campo, n) => {
    const claves = grupo === CUERPO_COMPLETO ? CLAVES_MUSCULARES : m.has(grupo) ? [grupo] : []
    for (const k of claves) m.get(k)[campo] += n
  }
  for (const s of series) {
    if (s.warmup) continue
    const g = ejerciciosPorId.get(s.exercise_id)?.grupo
    if (g) sumar(g, 'series', 1)
  }
  for (const w of entrenamientos) for (const g of new Set(w.muscles || [])) sumar(g, 'sesiones', 1)
  return m
}

// De 0 a 1, para el color: una sesión marcada cuenta como 3 series. 10 series por semana o más es el máximo del color
// (10 a 20 series semanales por músculo es lo que se suele recomendar para ganar músculo).
export const SERIES_LLENO = 10
export function intensidad({ series = 0, sesiones = 0 } = {}) {
  return Math.min(1, (series + sesiones * 3) / SERIES_LLENO)
}

export function textoDeTrabajo({ series = 0, sesiones = 0 } = {}) {
  const partes = []
  if (series) partes.push(`${series} ${series === 1 ? 'serie' : 'series'}`)
  if (sesiones) partes.push(`${sesiones} ${sesiones === 1 ? 'entrenamiento' : 'entrenamientos'}`)
  return partes.length ? partes.join(' · ') : 'Sin entrenar'
}

// Lo que se guarda en un entrenamiento: solo grupos conocidos, sin repetir, en el orden de la lista
export function musculosValidos(lista) {
  const elegidos = new Set(Array.isArray(lista) ? lista : [])
  return [...CLAVES_MUSCULARES, CUERPO_COMPLETO].filter((k) => elegidos.has(k))
}

// Los músculos que más trabaja una actividad, para proponerlos con un toque. Por la métrica o la categoría del catálogo.
const PIERNAS = ['cuadriceps', 'isquios', 'gluteos', 'pantorrillas']
const TIPICOS = {
  correr: PIERNAS,
  caminar: PIERNAS,
  bici: ['cuadriceps', 'gluteos', 'pantorrillas'],
  agua: ['espalda', 'hombros', 'triceps', 'pecho'],
  pelota: [...PIERNAS, 'abdomen'],
  raqueta: ['hombros', 'antebrazos', 'cuadriceps', 'pantorrillas'],
  baile: [...PIERNAS, 'abdomen'],
  mente_cuerpo: ['abdomen', 'espalda', 'gluteos'],
  combate: ['hombros', 'espalda', 'abdomen', 'cuadriceps'],
  fuerza: [CUERPO_COMPLETO],
}
export function musculosTipicos(tipo) {
  if (!tipo) return []
  return TIPICOS[tipo.metrica] || TIPICOS[tipo.category] || []
}

// La silueta del cuerpo (1.24): una ilustración que cambia con el % de grasa y con el peso, para ver cómo se vería la
// persona con otro peso. Es orientativa: no es una medición ni una foto. Funciones puras (sin React ni DOM).

// ---------- El % de grasa ----------
// Si la persona no cargó su % de grasa, se estima con el IMC, la edad y el sexo (Deurenberg et al., 1991):
//   % grasa = 1,2 × IMC + 0,23 × edad − 10,8 × sexo − 5,4   (sexo: 1 hombre, 0 mujer)
// Tiene un error de unos ±4 puntos y se pasa en personas muy musculosas. Por eso la pantalla dice "estimado".
export function grasaEstimada({ peso, altura, edad, sexo }) {
  if (!(peso > 0) || !(altura > 0) || !(edad > 0)) return null
  const imc = peso / (altura / 100) ** 2
  const g = 1.2 * imc + 0.23 * edad - 10.8 * (sexo === 'f' ? 0 : 1) - 5.4
  return Math.round(entre(g, GRASA_MINIMA[sexo === 'f' ? 'f' : 'm'], 60) * 10) / 10
}

// Grasa esencial: por debajo de esto no se baja (la ilustración tampoco)
export const GRASA_MINIMA = { m: 5, f: 12 }
const entre = (n, a, b) => Math.min(b, Math.max(a, n))

// Cuánto del peso que se baja (o se sube) es grasa: al bajar, en promedio unos 3/4 (el resto es agua y músculo); al
// subir, algo más de la mitad. Son aproximaciones para la ilustración, no para el cálculo de calorías.
export const PARTE_GRASA_AL_BAJAR = 0.75
export const PARTE_GRASA_AL_SUBIR = 0.6

// El % de grasa que tendría la persona con otro peso, partiendo del de hoy
export function grasaConPeso({ peso, grasa, sexo }, nuevo) {
  if (!(peso > 0) || !(nuevo > 0) || grasa == null) return null
  const kgGrasa = (peso * grasa) / 100
  const delta = nuevo - peso
  const kg = kgGrasa + delta * (delta < 0 ? PARTE_GRASA_AL_BAJAR : PARTE_GRASA_AL_SUBIR)
  const minimo = GRASA_MINIMA[sexo === 'f' ? 'f' : 'm']
  return Math.round(entre((kg / nuevo) * 100, minimo, 65) * 10) / 10
}

// El peso más bajo que tiene sentido mostrar: con la grasa esencial y la masa magra de hoy (redondeado hacia arriba)
export function pesoMinimo({ peso, grasa, sexo }) {
  const magra = peso * (1 - grasa / 100)
  const minimo = GRASA_MINIMA[sexo === 'f' ? 'f' : 'm'] / 100
  // Con lo que se pierde de magra al bajar (1/4 del total), resolviendo: (grasa' = mínimo)
  const kgGrasa = (peso * grasa) / 100
  // grasa' = kgGrasa + d·0,75 ; peso' = peso + d ; grasa'/peso' = minimo  =>  d = (minimo·peso − kgGrasa) / (0,75 − minimo)
  const d = (minimo * peso - kgGrasa) / (PARTE_GRASA_AL_BAJAR - minimo)
  return Math.max(Math.ceil(peso + d), Math.ceil(magra))
}

// Cómo se llama ese % (rangos habituales de la ACE, aproximados)
export function nombreDeGrasa(grasa, sexo) {
  const f = sexo === 'f'
  if (grasa < (f ? 14 : 6)) return 'Muy baja'
  if (grasa < (f ? 21 : 14)) return 'Atlética'
  if (grasa < (f ? 25 : 18)) return 'En forma'
  if (grasa < (f ? 32 : 25)) return 'Promedio'
  return 'Alta'
}

// ---------- La forma ----------
// Medias anchuras (en unidades del dibujo, que mide 200 × 440) de cada parte del cuerpo, para un cuerpo con poca grasa
// (FLACO) y uno con mucha (GRUESO). En el medio se interpola según el % de grasa. Hombre y mujer tienen proporciones
// distintas (hombros, cintura, cadera, pecho).
const FORMAS = {
  m: {
    grasa: [8, 45],
    cabeza: [17, 20],
    cuello: [9, 13],
    hombros: [41, 47],
    pecho: [35, 43],
    cintura: [26, 45],
    panza: [0, 9],
    cadera: [31, 42],
    muslo: [18, 28],
    rodilla: [10.5, 14.5],
    pantorrilla: [11.5, 15],
    tobillo: [6, 7.5],
    brazo: [10, 15.5],
    antebrazo: [8, 11],
    muneca: [5, 6.2],
    pechos: [0, 4],
  },
  f: {
    grasa: [16, 50],
    cabeza: [16, 18.5],
    cuello: [7.5, 11],
    hombros: [35, 41],
    pecho: [31, 40],
    cintura: [22.5, 41],
    panza: [0, 8],
    cadera: [34, 48],
    muslo: [18, 29],
    rodilla: [10, 14.5],
    pantorrilla: [11, 15.5],
    tobillo: [5.5, 7.5],
    brazo: [8.5, 14.5],
    antebrazo: [7, 10.5],
    muneca: [4.5, 6],
    pechos: [5, 11],
  },
}

// Las medidas para un % de grasa. `escala` agranda o achica el ancho (más masa magra: más ancho).
export function medidas(grasa, sexo = 'm', escala = 1) {
  const f = FORMAS[sexo === 'f' ? 'f' : 'm']
  const [g0, g1] = f.grasa
  // La grasa se acumula más rápido en la cintura que en el resto: curva suave en vez de recta
  const t = entre((grasa - g0) / (g1 - g0), 0, 1.5)
  const m = {}
  for (const [k, [a, b]] of Object.entries(f)) {
    if (k === 'grasa') continue
    const tt = k === 'cintura' || k === 'panza' ? Math.pow(t, 0.85) : t
    m[k] = (a + (b - a) * tt) * (k === 'cabeza' ? 1 : escala)
  }
  return m
}

// Más o menos ancho según la masa magra para su altura (índice de masa libre de grasa; 18 hombre, 15 mujer es lo típico)
export function escalaDe({ peso, grasa, altura, sexo }) {
  if (!(peso > 0) || !(altura > 0) || grasa == null) return 1
  const magra = peso * (1 - grasa / 100)
  const ffmi = magra / (altura / 100) ** 2
  return entre(Math.sqrt(ffmi / (sexo === 'f' ? 15 : 18)), 0.88, 1.18)
}

// ---------- El dibujo ----------
// Curva suave que pasa por los puntos (Catmull-Rom pasada a Bézier). `cerrada` une el último con el primero.
export function curva(puntos, cerrada = true) {
  const n = puntos.length
  if (n < 2) return ''
  const p = (i) => puntos[cerrada ? (i + n) % n : Math.max(0, Math.min(n - 1, i))]
  const r = (v) => Math.round(v * 10) / 10
  let d = `M${r(puntos[0][0])},${r(puntos[0][1])}`
  const tramos = cerrada ? n : n - 1
  for (let i = 0; i < tramos; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${r(c1[0])},${r(c1[1])} ${r(c2[0])},${r(c2[1])} ${r(p2[0])},${r(p2[1])}`
  }
  return cerrada ? d + 'Z' : d
}

const espejo = (pts, cx) => pts.map(([x, y]) => [2 * cx - x, y])

// Una extremidad a lo largo de un eje (del punto a al b). `perfil`: [t (0 a 1 sobre el eje), ancho hacia afuera, ancho
// hacia adentro]. `lado` -1 es la izquierda del dibujo. Devuelve los puntos del contorno: baja por afuera, da la vuelta
// en la punta (`punta`: cuánto se estira más allá de b) y sube por adentro.
function extremidad([ax, ay], [bx, by], perfil, lado, punta) {
  const lx = bx - ax
  const ly = by - ay
  const largo = Math.hypot(lx, ly)
  const [ux, uy] = [lx / largo, ly / largo] // a lo largo
  const [nx, ny] = [-uy * -lado, ux * -lado] // hacia afuera del cuerpo
  const en = (t, w) => [ax + ux * largo * t + nx * w, ay + uy * largo * t + ny * w]
  const afuera = perfil.map(([t, wo]) => en(t, wo))
  const adentro = perfil.map(([t, , wi]) => en(t, -wi)).reverse()
  const [, wo1, wi1] = perfil[perfil.length - 1]
  const centro = (wo1 - wi1) / 2
  const fin = [en(1 + punta * 0.55, centro + (wo1 + wi1) * 0.42), en(1 + punta, centro), en(1 + punta * 0.6, centro - (wo1 + wi1) * 0.4)]
  return [...afuera, ...fin, ...adentro]
}

// Los ejes de las extremidades (de dónde a dónde va cada una). Los usa también el mapa de músculos.
export const CENTRO = 100
export function ejes(m) {
  const cx = CENTRO
  const desde = Math.max(m.muslo * 0.95, m.cadera - m.muslo * 0.95)
  const abierto = 22 + m.brazo * 0.9 + m.panza * 0.6
  return {
    pierna: (lado) => [
      [cx + lado * desde, 192],
      [cx + lado * 15, 416],
    ],
    brazo: (lado) => [
      [cx + lado * (m.hombros - m.brazo * 0.55), 90],
      [cx + lado * (m.hombros + abierto), 240],
    ],
  }
}

// Un punto sobre el eje de una extremidad: a lo largo (t, de 0 a 1) y hacia afuera del cuerpo (w; negativo, hacia adentro)
export function enEje([ax, ay], [bx, by], lado) {
  const largo = Math.hypot(bx - ax, by - ay)
  const [ux, uy] = [(bx - ax) / largo, (by - ay) / largo]
  const [nx, ny] = [uy * lado, -ux * lado]
  return (t, w) => [ax + ux * largo * t + nx * w, ay + uy * largo * t + ny * w]
}

// Las partes del cuerpo como trazos SVG (de frente, con los brazos un poco separados). Centro en x = 100.
//   { cabeza: {cx, cy, rx, ry}, cuello, torso, piernas: [izq, der], brazos: [izq, der] }
export function partes(m) {
  const cx = 100
  // Torso: del cuello a la entrepierna, lado izquierdo de arriba hacia abajo y después el derecho de abajo hacia arriba
  const cintura = m.cintura + m.panza * 0.35
  const izq = [
    [cx - m.cuello, 60],
    [cx - m.cuello - 3, 69],
    [cx - m.hombros * 0.72, 75],
    [cx - m.hombros, 86],
    [cx - m.pecho - 1, 108],
    [cx - (m.pecho + cintura) / 2 - m.pechos * 0.3, 130],
    [cx - cintura, 156],
    [cx - (cintura + m.cadera) / 2 - 1, 178],
    [cx - m.cadera, 198],
    [cx - m.cadera + 3, 214],
    [cx - m.cadera * 0.45, 226],
    [cx - 3, 230],
  ]
  const torso = curva([...izq, ...espejo(izq, cx).reverse()])

  // Piernas: la cadera define dónde arrancan; el muslo se apoya contra la otra pierna cuando hay más grasa
  const eje = ejes(m)
  const desde = Math.max(m.muslo * 0.95, m.cadera - m.muslo * 0.95)
  const pierna = (lado) =>
    curva(
      extremidad(
        ...eje.pierna(lado),
        [
          [0, Math.min(m.muslo, m.cadera - desde) * 0.92, m.muslo * 0.6],
          [0.09, Math.min(m.muslo * 1.02, m.cadera - desde + 1), m.muslo],
          [0.25, m.muslo * 0.93, m.muslo * 0.86],
          [0.52, m.rodilla, m.rodilla * 0.95],
          [0.67, m.pantorrilla * 1.05, m.pantorrilla * 0.82],
          [0.95, m.tobillo, m.tobillo],
        ],
        lado,
        0.035,
      ),
    )

  // Brazos: del hombro a la muñeca, abiertos unos grados (más abiertos con más grasa, como pasa de verdad)
  const brazo = (lado) => {
    return curva(
      extremidad(
        ...eje.brazo(lado),
        [
          [-0.04, m.brazo * 0.85, m.brazo * 0.9],
          [0.18, m.brazo, m.brazo * 0.95],
          [0.45, m.antebrazo * 1.02, m.antebrazo * 0.95],
          [0.6, m.antebrazo, m.antebrazo * 0.9],
          [0.96, m.muneca, m.muneca],
        ],
        lado,
        0.13,
      ),
    )
  }

  return {
    cabeza: { cx, cy: 34, rx: m.cabeza, ry: m.cabeza * 1.24 },
    cuello: curva([
      [cx - m.cuello, 46],
      [cx + m.cuello, 46],
      [cx + m.cuello, 70],
      [cx - m.cuello, 70],
    ]),
    torso,
    piernas: [pierna(-1), pierna(1)],
    brazos: [brazo(-1), brazo(1)],
  }
}

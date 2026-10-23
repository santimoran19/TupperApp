// El cuerpo en 3D (1.25): una malla humana de verdad (la base de MakeHuman, licencia CC0, ver scripts/modelos/) que
// cambia con el % de grasa, el músculo y el sexo mezclando las deformaciones del modelo. Con `modo: 'musculos'` cada
// zona se pinta según cuánto se entrenó en la semana (con degradé entre zonas) y tocarla dice cuál es.
//   props: { sexo, grasa, escala, altura, modo: 'silueta' | 'musculos', trabajo (Map grupo -> { series, sesiones }), seleccion, activo, onTocar }
import { CLAVES_MUSCULARES, intensidad } from '../../lib/musculos'
import { acercar, colorDe } from './comun'
import { estudio } from './estudio'

const ARCHIVO = '/modelos/cuerpo.bin'
const SIN_ZONA = 255

// ---------- Cuenta pura (se prueba sin WebGL) ----------

// Interpola una tabla de puntos [x, y] (x creciente)
const tabla = (pts, x) => {
  if (x <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++)
    if (x <= pts[i][0]) return pts[i - 1][1] + ((x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])) * (pts[i][1] - pts[i - 1][1])
  return pts[pts.length - 1][1]
}
// Por encima de 1 se sigue la misma deformación un poco más allá del "peso máximo" del modelo (hasta 1,2)
const PESO_HOMBRE = [
  [5, 0],
  [16, 0.5],
  [28, 1],
  [45, 1.2],
]
const PESO_MUJER = [
  [12, 0],
  [27, 0.5],
  [40, 1],
  [55, 1.2],
]

// Kilos de grasa por metro cuadrado (el "índice de masa grasa") -> cuánta gordura se ve. 1 es lo máximo que alcanza a
// deformar el modelo base; por encima la malla se infla (ver `inflar`). A igual %, quien pesa más tiene más grasa en kilos
const GORDURA_HOMBRE = [
  [1.5, 0],
  [4, 0.5],
  [7, 1],
  [11, 1.65],
  [16, 2.3],
  [22, 2.6],
]
const GORDURA_MUJER = [
  [3, 0],
  [6, 0.5],
  [9, 1],
  [13, 1.65],
  [18, 2.3],
  [24, 2.6],
]

// Del % de grasa, el sexo y la masa magra a los controles del modelo:
//   sexo (0 mujer, 1 hombre), peso (0 delgado, 0,5 promedio, 1 grande; la deformación del modelo base), músculo (0 promedio,
//   1 muy musculoso) y gordura (0 a ~2,6: kilos de grasa por m², para inflar panza, caderas y muslos cuando se pasa del modelo)
export function parametrosCuerpo({ sexo, grasa, escala = 1 }) {
  const mujer = sexo === 'f'
  const g = Number.isFinite(grasa) ? grasa : mujer ? 25 : 16
  const peso = tabla(mujer ? PESO_MUJER : PESO_HOMBRE, g)
  // `escala` viene de la masa magra (lib/silueta.js, escalaDe): 1 es lo típico. Quien pesa más tiene más masa magra
  // en kilos, pero eso no lo hace "musculoso": recién se nota por encima de un índice alto
  const ffmi = (mujer ? 15 : 18) * (escala || 1) ** 2
  let musculo = Math.max(0, Math.min(1, (ffmi - (mujer ? 16.5 : 19.5)) / 6)) * 0.85
  const gordura = tabla(mujer ? GORDURA_MUJER : GORDURA_HOMBRE, (ffmi * Math.min(g, 70)) / (100 - Math.min(g, 70)))
  // Con mucha grasa el modelo "musculoso y pesado" se ve como un fisicoculturista, no como alguien que subió de peso
  musculo *= 1 - 0.9 * Math.max(0, Math.min(1, (Math.min(gordura, 1) - 0.55) / 0.45))
  return { sexo: mujer ? 0 : 1, peso, musculo, gordura }
}

// Cuánto vale cada una de las 12 deformaciones (sexo x músculo x peso) para esos tres controles; suman 1
export function pesosDeMezcla({ sexo, peso, musculo }) {
  const s = [1 - sexo, sexo]
  const m = [1 - musculo, musculo]
  const mn = Math.max(0, 1 - 2 * peso)
  const mx = Math.max(0, 2 * peso - 1)
  const p = [mn, 1 - mn - mx, mx]
  const k = []
  for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 3; c++) k.push(s[a] * m[b] * p[c])
  return k
}

// El archivo cuerpo.bin: { n, tri, regiones, pos (Float32 n*3), indices (Uint16 tri*3), zona (Uint8 n), deltas (Int8 n*3 cada una), escalas }
export function leerCuerpo(buffer) {
  const lectura = new DataView(buffer)
  const largo = lectura.getUint32(0, true)
  const cab = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 4, largo)))
  let o = 4 + largo
  const { n, tri } = cab
  const pos = new Float32Array(buffer.slice(o, o + n * 12))
  o += n * 12
  const indices = new Uint16Array(buffer.slice(o, o + tri * 6))
  o += tri * 6
  o += (4 - ((tri * 6) % 4)) % 4
  const zona = new Uint8Array(buffer.slice(o, o + n))
  o += n + ((4 - (n % 4)) % 4)
  const deltas = cab.claves.map((_, i) => new Int8Array(buffer.slice(o + i * n * 3, o + (i + 1) * n * 3)))
  return { n, tri, regiones: cab.regiones, escalas: cab.escalas, pos, indices, zona, deltas }
}

// Mezcla las deformaciones en `salida` (Float32 n*3) y devuelve el alto del cuerpo (en metros del modelo)
export function mezclar(modelo, k, salida) {
  const { pos, deltas, escalas } = modelo
  const activos = []
  for (let j = 0; j < k.length; j++) if (k[j] > 1e-4) activos.push([deltas[j], k[j] * escalas[j]])
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < pos.length; i += 3) {
    let x = pos[i]
    let y = pos[i + 1]
    let z = pos[i + 2]
    for (const [d, f] of activos) {
      x += d[i] * f
      y += d[i + 1] * f
      z += d[i + 2] * f
    }
    salida[i] = x
    salida[i + 1] = y
    salida[i + 2] = z
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { minY, maxY }
}

// Normales por punto (promedio de las caras, ponderado por el área), sin WebGL
export function normales(pos, indices, salida = new Float32Array(pos.length)) {
  salida.fill(0)
  for (let t = 0; t < indices.length; t += 3) {
    const a = indices[t] * 3
    const b = indices[t + 1] * 3
    const c = indices[t + 2] * 3
    const ux = pos[b] - pos[a]
    const uy = pos[b + 1] - pos[a + 1]
    const uz = pos[b + 2] - pos[a + 2]
    const vx = pos[c] - pos[a]
    const vy = pos[c + 1] - pos[a + 1]
    const vz = pos[c + 2] - pos[a + 2]
    const nx = uy * vz - uz * vy
    const ny = uz * vx - ux * vz
    const nz = ux * vy - uy * vx
    for (const i of [a, b, c]) {
      salida[i] += nx
      salida[i + 1] += ny
      salida[i + 2] += nz
    }
  }
  for (let i = 0; i < salida.length; i += 3) {
    const l = Math.hypot(salida[i], salida[i + 1], salida[i + 2]) || 1
    salida[i] /= l
    salida[i + 1] /= l
    salida[i + 2] /= l
  }
  return salida
}

const suave = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const campana = (x, c, w) => Math.exp(-(((x - c) / w) ** 2))

// Cuánto se infla cada zona (en metros, con gordura 1,0 extra) según el sexo. Los números salen de mirar el modelo:
// la panza va entre el 50 y el 65 % de la altura; el hombre acumula en la panza y los costados, la mujer en caderas y muslos.
const INFLADO = {
  m: { panza: 0.085, pecho: 0.02, cadera: 0.018, muslo: 0.026, brazo: 0.02, cuello: 0.014, pantorrilla: 0.008, cara: 0.006 },
  f: { panza: 0.06, pecho: 0.022, cadera: 0.034, muslo: 0.03, brazo: 0.022, cuello: 0.012, pantorrilla: 0.012, cara: 0.006 },
}

// Infla la malla ya mezclada (`pos`) según la gordura: cada punto se corre hacia afuera por su normal, más en las zonas donde
// el cuerpo acumula. `extra` = cuánto más allá del modelo base (0 = nada). Devuelve true si cambió algo.
export function inflar(modelo, pos, { sexo, gordura }, minY, maxY, buf = {}) {
  const extra = Math.min(1.35, Math.max(0, (gordura - 0.5) / 1.5))
  if (extra < 0.005) return false
  const k = INFLADO[sexo > 0.5 ? 'm' : 'f']
  const alto = maxY - minY
  const nr = (buf.normales = normales(pos, modelo.indices, buf.normales))
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i]
    const y = pos[i + 1]
    const fy = (y - minY) / alto
    const ax = Math.abs(x)
    const brazo = fy > 0.5 ? suave(0.2, 0.3, ax) : 0
    const tronco = 1 - brazo
    let a = 0
    // Panza: más abajo que arriba (cuelga), y más al frente que atrás
    const nz = nr[i + 2]
    const frente = 0.35 + 0.65 * Math.max(0, nz)
    a += k.panza * tronco * (fy < 0.565 ? campana(fy, 0.565, 0.06) : campana(fy, 0.565, 0.08)) * frente
    a += k.pecho * tronco * campana(fy, 0.69, 0.05)
    a += k.cadera * tronco * campana(fy, 0.47, 0.08)
    // Piernas: solo por debajo de la entrepierna; los muslos no se inflan hacia adentro (se atravesarían)
    const pierna = 1 - suave(0.44, 0.54, fy)
    const afuera = 0.35 + 0.65 * suave(-0.2, 0.5, x > 0 ? nr[i] : -nr[i])
    a += k.muslo * pierna * campana(fy, 0.35, 0.11) * afuera
    a += k.pantorrilla * pierna * campana(fy, 0.16, 0.07) * afuera
    a += k.brazo * brazo * campana(fy, 0.66, 0.1)
    a += k.cuello * campana(fy, 0.855, 0.025) * tronco
    a += k.cara * campana(fy, 0.93, 0.04)
    a *= extra
    pos[i] += nr[i] * a
    pos[i + 1] += nr[i + 1] * a * 0.5
    pos[i + 2] += nr[i + 2] * a
  }
  return true
}

// Vecinos de cada punto (formato comprimido por filas) para suavizar el color entre zonas
export function vecinos(modelo) {
  const { n, indices } = modelo
  const cuenta = new Uint32Array(n + 1)
  for (let i = 0; i < indices.length; i += 3) {
    cuenta[indices[i] + 1] += 2
    cuenta[indices[i + 1] + 1] += 2
    cuenta[indices[i + 2] + 1] += 2
  }
  for (let i = 0; i < n; i++) cuenta[i + 1] += cuenta[i]
  const lista = new Uint32Array(cuenta[n])
  const lleno = new Uint32Array(n)
  const poner = (a, b) => {
    lista[cuenta[a] + lleno[a]++] = b
  }
  for (let i = 0; i < indices.length; i += 3) {
    const [a, b, c] = [indices[i], indices[i + 1], indices[i + 2]]
    poner(a, b)
    poner(a, c)
    poner(b, a)
    poner(b, c)
    poner(c, a)
    poner(c, b)
  }
  return { cuenta, lista }
}

// Promedia cada valor con el de sus vecinos varias veces: los bordes entre zonas quedan como un degradé
export function suavizar(valores, ady, pasadas = 6) {
  const { cuenta, lista } = ady
  let a = Float32Array.from(valores)
  let b = new Float32Array(a.length)
  for (let p = 0; p < pasadas; p++) {
    for (let i = 0; i < a.length; i++) {
      let s = 0
      const d = cuenta[i]
      const h = cuenta[i + 1]
      for (let j = d; j < h; j++) s += a[lista[j]]
      b[i] = h > d ? a[i] * 0.4 + (s / (h - d)) * 0.6 : a[i]
    }
    ;[a, b] = [b, a]
  }
  return a
}

// ---------- La escena ----------

export function crear(THREE, { ancho, alto, props, renderer, onFalla }) {
  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(26, ancho / alto, 0.1, 50)
  camara.position.set(0, 1.02, 4.5)
  camara.lookAt(0, 0.9, 0)

  const pivote = new THREE.Group()
  escena.add(pivote)
  const luz = estudio(THREE, escena, renderer, { alcance: 2.4, alDespertar: () => e.despertar?.() })

  const colores = {
    base: new THREE.Color('#e2cdb9'),
    lleno: colorDe(THREE, '--c-verde', '#206140'),
    marcado: colorDe(THREE, '--c-coral', '#e76f51'),
  }
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.62,
    metalness: 0,
    sheen: 0.7,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color('#fff1e6'),
    clearcoat: 0.12,
    clearcoatRoughness: 0.5,
    transparent: true,
    opacity: 0,
  })

  let modelo = null
  let adyacentes = null
  let malla = null
  let posiciones = null
  let actual = { ...props }
  let vista = parametrosCuerpo(props) // lo que se está dibujando (se acerca de a poco a lo que se pide)
  let aparece = 0
  let alturaModelo = 1.75
  let sucio = true
  const bufferInflar = {}

  const pintar = () => {
    if (!malla) return
    const { n, zona, regiones } = modelo
    const calor = new Float32Array(n)
    const marca = new Float32Array(n)
    const musculos = actual.modo === 'musculos'
    const idx = regiones.map((g) => CLAVES_MUSCULARES.indexOf(g))
    if (musculos) {
      const k = regiones.map((g) => (actual.seleccion?.has?.(g) ? 1 : intensidad(actual.trabajo?.get?.(g))))
      for (let i = 0; i < n; i++) {
        const z = zona[i]
        if (z === SIN_ZONA || idx[z] < 0) continue
        calor[i] = k[z] > 0 ? 0.28 + 0.72 * k[z] : 0.06
        if (actual.seleccion?.has?.(regiones[z])) marca[i] = 1
        if (actual.activo === regiones[z]) marca[i] = Math.max(marca[i], 0.75)
      }
    }
    const c = suavizar(calor, adyacentes, 3)
    const m = suavizar(marca, adyacentes, 4)
    const col = malla.geometry.attributes.color.array
    const t = new THREE.Color()
    for (let i = 0; i < n; i++) {
      t.copy(colores.base).lerp(colores.lleno, Math.min(1, Math.pow(c[i], 0.85)))
      if (m[i] > 0.02) t.lerp(colores.marcado, Math.min(1, m[i]))
      col[i * 3] = t.r
      col[i * 3 + 1] = t.g
      col[i * 3 + 2] = t.b
    }
    malla.geometry.attributes.color.needsUpdate = true
  }

  const deformar = () => {
    const { minY, maxY } = mezclar(modelo, pesosDeMezcla(vista), posiciones)
    inflar(modelo, posiciones, vista, minY, maxY, bufferInflar)
    const geo = malla.geometry
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    alturaModelo = maxY - minY
    const altura = (Number(actual.altura) || (vista.sexo > 0.5 ? 176 : 164)) / 100
    const s = altura / alturaModelo
    malla.scale.setScalar(s)
    malla.position.y = -minY * s
    sucio = false
  }

  const armar = (datos) => {
    modelo = datos
    adyacentes = vecinos(modelo)
    posiciones = new Float32Array(modelo.pos.length)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posiciones, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(modelo.n * 3), 3))
    geo.setIndex(new THREE.BufferAttribute(modelo.indices, 1))
    malla = new THREE.Mesh(geo, material)
    malla.castShadow = true
    malla.receiveShadow = true
    malla.frustumCulled = false
    pivote.add(malla)
    deformar()
    pintar()
    e.despertar?.()
  }

  fetch(ARCHIVO)
    .then((r) => {
      if (!r.ok) throw new Error('No se pudo bajar el modelo del cuerpo')
      return r.arrayBuffer()
    })
    .then((b) => armar(leerCuerpo(b)))
    .catch((err) => onFalla?.(err))

  const cambiar = (p) => {
    const antes = actual
    actual = { ...p }
    if (!malla) return
    if (antes.altura !== p.altura) sucio = true
    // Repintar cuesta (suaviza el color de 13 mil puntos): solo si cambió algo de lo que se ve pintado
    if (antes.modo !== p.modo || antes.trabajo !== p.trabajo || antes.seleccion !== p.seleccion || antes.activo !== p.activo) pintar()
  }

  let acumulado = 0
  const actualizar = (dt) => {
    if (!malla) return true
    let sigue = false
    if (aparece < 1) {
      aparece = Math.min(1, aparece + dt * 2.2)
      material.opacity = aparece
      if (aparece >= 1) material.transparent = false
      sigue = true
    }
    const meta = parametrosCuerpo(actual)
    const dif =
      Math.abs(meta.peso - vista.peso) +
      Math.abs(meta.musculo - vista.musculo) +
      Math.abs(meta.sexo - vista.sexo) +
      Math.abs(meta.gordura - vista.gordura)
    if (dif > 0.002 || sucio) {
      acumulado += dt
      vista = {
        sexo: acercar(vista.sexo, meta.sexo, dt, 9),
        peso: acercar(vista.peso, meta.peso, dt, 7),
        musculo: acercar(vista.musculo, meta.musculo, dt, 7),
        gordura: acercar(vista.gordura, meta.gordura, dt, 7),
      }
      if (dif < 0.002) vista = meta
      if (acumulado > 1 / 30 || dif < 0.002 || sucio) {
        acumulado = 0
        deformar()
      }
      sigue = true
    }
    return sigue
  }

  const tocar = (rayo) => {
    if (actual.modo !== 'musculos' || !actual.onTocar || !malla) return
    const [hit] = rayo.intersectObject(malla, false)
    if (!hit) return
    const { zona, regiones } = modelo
    for (const v of [hit.face.a, hit.face.b, hit.face.c]) {
      if (zona[v] !== SIN_ZONA) {
        const g = regiones[zona[v]]
        if (CLAVES_MUSCULARES.includes(g)) {
          actual.onTocar(g)
          return
        }
      }
    }
  }

  const e = {
    escena,
    camara,
    pivote,
    actualizar,
    cambiar,
    tocar,
    bajarCalidad: () => luz.bajar(),
    liberar: () => luz.liberar(),
  }
  return e
}

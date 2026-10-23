// El plato de una receta en 3D (1.25): la comida servida en lo que corresponde, como en una foto de estudio. Un vaso con su
// pajita y hielo para un licuado, una taza con platito y vapor para un café, un bowl con caldo y trocitos para una sopa,
// un sándwich cortado en dos mostrando sus capas, tostadas con lo que lleva arriba, una pizza o tarta sobre su tabla, un
// frasco con capas para un postre o un plato playo con cada ingrediente en su lugar.
//   props: { nombre, tipo: 'vaso'|'taza'|'sopa'|'bowl'|'sandwich'|'tostadas'|'disco'|'postre'|'plato',
//            trozos: [{ nombre, gramos, forma, color }] (ver lib/plato.js) }
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { colorDe } from './comun'
import { azar, crearApilador, semillaDe } from './comida'
import { estudio } from './estudio'
import { colorLiquido } from '../../lib/plato'
import { crearEmplatado } from './emplatado'

const sin = (t) =>
  String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// ---------- Cuántas piezas y dónde (puras, para probarlas) ----------
// Cuánto "ocupa" cada pieza de cada forma: una forma que ya es un puñado (arroz, migas) necesita menos piezas
const FACTOR = {
  mancha: 0.1,
  grano: 0.45,
  migaja: 0.5,
  lenteja: 0.5,
  esfera: 0.8,
  baya: 0.8,
  poroto: 0.6,
  nuez: 0.8,
  pasta: 0.7,
  cuna: 0.15,
  salchicha: 0.4,
  filete: 0.45,
  medallon: 0.5,
  hoja: 0.8,
  gota: 0,
}

// Reparte `cupo` piezas entre los ingredientes sólidos según sus gramos. Sin los líquidos; hasta 9 ingredientes.
export function repartir(trozos, cupo) {
  const lista = (trozos || []).filter((t) => t.forma !== 'gota' && t.gramos > 0).slice(0, 9)
  const total = lista.reduce((s, t) => s + t.gramos, 0) || 1
  return lista.map((t) => {
    const f = FACTOR[t.forma] ?? 1
    const parte = t.gramos / total
    const tope = Math.max(2, Math.round(cupo * 0.7 * Math.max(f, 0.5)))
    const n = Math.round(cupo * Math.pow(parte, 0.85) * f)
    return { ...t, cantidad: Math.max(f < 0.3 ? 1 : 2, Math.min(n, tope)) }
  })
}

// Un gajo de círculo para cada grupo (ángulos de inicio y fin), proporcional a sus gramos pero nunca menos de 0,5 rad
export function sectores(grupos, desde = -2.2) {
  const total = grupos.reduce((s, g) => s + Math.max(1, g.gramos || 1), 0) || 1
  const piso = 0.5
  const pesos = grupos.map((g) => Math.max(piso, (Math.max(1, g.gramos || 1) / total) * Math.PI * 2))
  const suma = pesos.reduce((s, p) => s + p, 0) || 1
  let a = desde
  return pesos.map((p) => {
    const largo = (p / suma) * Math.PI * 2
    const r = { desde: a, hasta: a + largo }
    a += largo
    return r
  })
}

// Altura de un perfil [[radio, y], ...] (radios crecientes) a cierta distancia del centro
function alturaPerfil(pts, r) {
  if (r <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    if (r <= pts[i][0]) {
      const [r0, y0] = pts[i - 1]
      const [r1, y1] = pts[i]
      return y0 + ((y1 - y0) * (r - r0)) / Math.max(1e-6, r1 - r0)
    }
  }
  return pts[pts.length - 1][1]
}

// ---------- Materiales y piezas sueltas ----------
const vivo = (THREE, hex) => {
  const c = new THREE.Color(hex)
  const h = {}
  c.getHSL(h)
  return c.setHSL(h.h, Math.min(1, h.s * 1.3), Math.min(0.92, h.l * 1.04)).getStyle()
}
const mezclar = (THREE, a, b, k) => new THREE.Color(a).lerp(new THREE.Color(b), k)

function materiales(THREE, D) {
  return {
    porcelana: (color = 0xfbfaf6) =>
      D(
        new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.2,
          metalness: 0,
          clearcoat: 0.8,
          clearcoatRoughness: 0.12,
          sheen: 0.3,
          sheenColor: new THREE.Color(0xffffff),
        }),
      ),
    vidrio: () =>
      D(
        new THREE.MeshPhysicalMaterial({
          color: 0xf2fbff,
          roughness: 0.05,
          metalness: 0,
          transparent: true,
          opacity: 0.22,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
          side: THREE.DoubleSide,
          depthWrite: false,
          envMapIntensity: 1.8,
        }),
      ),
    liquido: (color, opacidad = 0.94) =>
      D(
        new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.32,
          roughness: 0.1,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          transparent: opacidad < 1,
          opacity: opacidad,
          envMapIntensity: 1.2,
        }),
      ),
    mate: (color, rugosidad = 0.7) => D(new THREE.MeshStandardMaterial({ color, roughness: rugosidad, metalness: 0 })),
  }
}

const lat = (THREE, D, pts, seg = 72) =>
  D(
    new THREE.LatheGeometry(
      pts.map(([x, y]) => new THREE.Vector2(x, y)),
      seg,
    ),
  )

// Una tabla de madera redonda (textura de vetas dibujada a mano)
function tabla(THREE, D, radio, y = 0) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#c4935f'
  g.fillRect(0, 0, 256, 256)
  const az = azar(5)
  for (let i = 0; i < 70; i++) {
    const x = az() * 256
    g.strokeStyle = `rgba(${90 + az() * 40},${55 + az() * 30},${25 + az() * 20},${0.1 + az() * 0.2})`
    g.lineWidth = 1 + az() * 3
    g.beginPath()
    g.moveTo(x, 0)
    g.bezierCurveTo(x + (az() - 0.5) * 40, 80, x + (az() - 0.5) * 40, 170, x + (az() - 0.5) * 20, 256)
    g.stroke()
  }
  const t = D(new THREE.CanvasTexture(c))
  t.colorSpace = THREE.SRGBColorSpace
  const m = new THREE.Mesh(
    D(new THREE.CylinderGeometry(radio, radio - 0.03, 0.12, 80)),
    D(new THREE.MeshStandardMaterial({ map: t, roughness: 0.62, metalness: 0 })),
  )
  m.position.y = y + 0.06
  m.receiveShadow = true
  m.castShadow = true
  return m
}

// Triángulo (mitad de un sándwich): lado largo hacia la cámara, esquinas redondeadas. `frill` lo hace ondulado como una hoja.
function triangulo(THREE, a, radio, frill = 0, fase = 0) {
  const V = [
    [-a, -a / 2],
    [a, -a / 2],
    [0, a / 2],
  ]
  const hacia = (A, B, d) => {
    const dx = B[0] - A[0]
    const dy = B[1] - A[1]
    const l = Math.hypot(dx, dy)
    return [A[0] + (dx / l) * d, A[1] + (dy / l) * d]
  }
  const s = new THREE.Shape()
  V.forEach((P, i) => {
    const ini = hacia(P, V[(i + 2) % 3], radio)
    const fin = hacia(P, V[(i + 1) % 3], radio)
    if (i === 0) s.moveTo(...ini)
    else s.lineTo(...ini)
    s.quadraticCurveTo(P[0], P[1], fin[0], fin[1])
  })
  s.closePath()
  if (!frill) return s
  const cy = -a / 6
  const pts = s.getSpacedPoints(200).map((p) => {
    const k = 1 + frill * Math.sin(Math.atan2(p.y - cy, p.x) * 17 + fase) + frill * 0.6 * Math.sin(p.x * 31 + fase)
    return new THREE.Vector2(p.x * k, cy + (p.y - cy) * k)
  })
  return new THREE.Shape(pts)
}

// Una rebanada de pan de molde vista de arriba (con el "hongo" de arriba)
function formaPan(THREE, w = 0.8) {
  const h = w / 2
  const s = new THREE.Shape()
  s.moveTo(-h + 0.08, -h)
  s.lineTo(h - 0.08, -h)
  s.quadraticCurveTo(h, -h, h, -h + 0.08)
  s.lineTo(h, 0.08)
  s.bezierCurveTo(h + 0.13, 0.2, h + 0.09, h + 0.08, 0, h + 0.08)
  s.bezierCurveTo(-h - 0.09, h + 0.08, -h - 0.13, 0.2, -h, 0.08)
  s.lineTo(-h, -h + 0.08)
  s.quadraticCurveTo(-h, -h, -h + 0.08, -h)
  return s
}

// Extruye una forma hacia arriba (y) con borde suave. `colorMiga`/`colorCorteza`: color por punto según hacia dónde mira la cara.
function losa(THREE, D, forma, alto, { miga, corteza, bisel = 0.014, frente = true } = {}) {
  const g = new THREE.ExtrudeGeometry(forma, {
    depth: alto,
    bevelEnabled: true,
    bevelSize: bisel,
    bevelThickness: bisel,
    bevelSegments: 2,
    curveSegments: 10,
  })
  g.rotateX(-Math.PI / 2)
  g.deleteAttribute('uv')
  g.computeVertexNormals()
  if (miga && corteza) {
    const n = g.attributes.normal
    const col = new Float32Array(n.count * 3)
    const cm = new THREE.Color(miga)
    const cc = new THREE.Color(corteza)
    for (let i = 0; i < n.count; i++) {
      const c = Math.abs(n.getY(i)) > 0.7 ? cm : frente && n.getZ(i) > 0.6 ? cm : cc
      col.set([c.r, c.g, c.b], i * 3)
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  }
  return D(g)
}

// Vapor: puntos claros que suben y se desvanecen
function vapor(THREE, D, escena, { x = 0, z = 0, y = 0.6, ancho = 0.8, cuantos = 9, quieto }) {
  if (quieto) return []
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const r = g.createRadialGradient(32, 32, 2, 32, 32, 30)
  r.addColorStop(0, 'rgba(255,255,255,0.7)')
  r.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = r
  g.fillRect(0, 0, 64, 64)
  const textura = D(new THREE.CanvasTexture(c))
  const out = []
  for (let i = 0; i < cuantos; i++) {
    const s = new THREE.Sprite(D(new THREE.SpriteMaterial({ map: textura, transparent: true, depthWrite: false, opacity: 0 })))
    s.userData = { fase: i / cuantos, dx: x + (Math.random() - 0.5) * ancho, dz: z + (Math.random() - 0.5) * ancho, y }
    escena.add(s)
    out.push(s)
  }
  return out
}

// ---------- Las escenas por tipo de plato ----------
// Cada una arma el recipiente y devuelve:
//   { fov, dir, mira, W, H (mitades del cuadro a mostrar), sombra (radio), caliente: {x,z,y} | null,
//     apilar: { medio, piso(x,z), dentro(x,z,y,r), escala } | null, llenar(ap) }
function platoPlayo(THREE, c, emplatado = false) {
  const { D, M, raiz, grupos } = c
  const interior = [
    [0, 0.07],
    [0.9, 0.07],
    [1.02, 0.085],
    [1.2, 0.15],
    [1.48, 0.255],
  ]
  const perfil = [
    [0, 0],
    [0.7, 0],
    [0.75, 0.03],
    [1.25, 0.1],
    [1.5, 0.21],
    [1.56, 0.25],
    [1.55, 0.272],
    [1.5, 0.272],
    [1.48, 0.255],
    ...interior.slice(0, -1).reverse(),
  ]
  const plato = new THREE.Mesh(lat(THREE, D, perfil), M.porcelana())
  plato.castShadow = plato.receiveShadow = true
  raiz.add(plato)
  const aro = new THREE.Mesh(D(new THREE.TorusGeometry(1.36, 0.012, 8, 120)), M.mate(colorDe(THREE, '--c-verde', '#206140'), 0.4))
  aro.rotation.x = Math.PI / 2
  aro.position.y = 0.217
  raiz.add(aro)
  const base = {
    fov: 30,
    dir: [0, 0.78, 1],
    mira: [0, 0.1, 0],
    W: 1.8,
    H: 1.1,
    sombra: 3.2,
    caliente: { x: 0, z: 0, y: 0.5 },
  }
  // El plato de una receta (1.26): cada ingrediente es una pieza reconocible (ver emplatado/). Los demás (tostadas, sándwich,
  // pizza...) parten de este mismo plato y le apilan lo suyo.
  if (emplatado) return { ...base, W: 1.66, H: 1.02, emplatar: { altura: (x, z) => alturaPerfil(interior, Math.hypot(x, z)), escala: 1 } }
  return {
    ...base,
    apilar: {
      medio: 1.6,
      piso: (x, z) => alturaPerfil(interior, Math.hypot(x, z)),
      dentro: (x, z, y, r) => limitar(x, z, 1.12 - r * 0.6),
      escala: 1.1,
    },
    cupo: 110,
    llenar: (ap) => ap.agregar(porSectores(grupos, 1.0), c.opcionesCaida),
  }
}

function bowl(THREE, c, { sopa }) {
  const { D, M, raiz, grupos, trozos, nombre } = c
  const Ri = 1.22
  const Ro = 1.31
  const dentroPts = []
  const fueraPts = []
  const pasos = 14
  for (let i = 0; i <= pasos; i++) {
    const a = 0.12 + (i / pasos) * (Math.PI / 2 - 0.12)
    dentroPts.push([Ri * Math.sin(a), 0.12 + 0.78 * (1 - Math.cos(a))])
    fueraPts.push([Ro * Math.sin(a), 0.045 + 0.86 * (1 - Math.cos(a))])
  }
  const perfil = [
    [0, 0],
    [0.4, 0],
    [0.46, 0.035],
    ...fueraPts,
    [Ro - 0.01, 0.93],
    [Ro - 0.05, 0.945],
    [Ri + 0.02, 0.935],
    ...dentroPts.slice().reverse(),
  ]
  const cuenco = new THREE.Mesh(lat(THREE, D, perfil), M.porcelana())
  cuenco.castShadow = cuenco.receiveShadow = true
  raiz.add(cuenco)
  const banda = new THREE.Mesh(D(new THREE.TorusGeometry(Ro - 0.02, 0.012, 8, 120)), M.mate(colorDe(THREE, '--c-verde', '#206140'), 0.4))
  banda.rotation.x = Math.PI / 2
  banda.position.y = 0.9
  raiz.add(banda)
  const interior = dentroPts
  const base = {
    fov: 30,
    dir: [0, 0.7, 1],
    mira: [0, 0.4, 0],
    W: 1.55,
    H: 1.25,
    sombra: 3,
    caliente: sopa ? { x: 0, z: 0, y: 0.7 } : null,
    cupo: sopa ? 50 : 150,
  }
  if (!sopa) return { ...base, emplatar: { altura: (x, z) => alturaPerfil(interior, Math.hypot(x, z)), escala: 1, cama: true } }
  // Sopa: el caldo, con gotitas de grasa y hierbitas, y los trozos flotando
  const nivel = 0.64
  const rl = alturaPerfilInv(interior, nivel)
  const color = colorLiquido(trozos, 'sopa')
  const caldo = new THREE.Mesh(D(new THREE.CircleGeometry(rl, 64)), M.liquido(color, 1))
  caldo.rotation.x = -Math.PI / 2
  caldo.position.y = nivel
  caldo.receiveShadow = true
  raiz.add(caldo)
  const az = azar(semillaDe(nombre))
  const gotas = new THREE.InstancedMesh(
    D(new THREE.CircleGeometry(0.05, 10)),
    D(
      new THREE.MeshPhysicalMaterial({
        color: mezclar(THREE, color, '#fff3c4', 0.6),
        roughness: 0.1,
        clearcoat: 1,
        transparent: true,
        opacity: 0.55,
      }),
    ),
    36,
  )
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
  for (let i = 0; i < 36; i++) {
    const a = az() * 6.283
    const r = Math.sqrt(az()) * (rl - 0.08)
    const s = 0.5 + az() * 1.3
    gotas.setMatrixAt(i, m4.compose(new THREE.Vector3(Math.cos(a) * r, nivel + 0.003, Math.sin(a) * r), q, new THREE.Vector3(s, s, s)))
  }
  raiz.add(gotas)
  const hierbas = new THREE.InstancedMesh(D(new THREE.CircleGeometry(0.03, 5)), M.mate(0x5f9a3a, 0.6), 22)
  for (let i = 0; i < 22; i++) {
    const a = az() * 6.283
    const r = Math.sqrt(az()) * (rl - 0.08)
    const qq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, az() * 6.28))
    hierbas.setMatrixAt(i, m4.compose(new THREE.Vector3(Math.cos(a) * r, nivel + 0.005, Math.sin(a) * r), qq, new THREE.Vector3(1, 1, 1)))
  }
  raiz.add(hierbas)
  return {
    ...base,
    apilar: {
      medio: 1.4,
      piso: (x, z) => (Math.hypot(x, z) < rl ? nivel - 0.07 : alturaPerfil(interior, Math.hypot(x, z))),
      dentro: (x, z, y, r) => limitar(x, z, rl - 0.1 - r * 0.5),
      escala: 1.0,
    },
    llenar: (ap) =>
      ap.agregar(
        grupos.map((g) => ({ forma: g.forma, color: g.color, cantidad: g.cantidad, zona: (a) => disco(a, rl * 0.85) })),
        c.opcionesCaida,
      ),
  }
}

// Radio de un perfil a cierta altura (para saber cuánto mide el caldo)
function alturaPerfilInv(pts, y) {
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][1] >= y) {
      const [r0, y0] = pts[i - 1]
      const [r1, y1] = pts[i]
      return r0 + ((r1 - r0) * (y - y0)) / Math.max(1e-6, y1 - y0)
    }
  }
  return pts[pts.length - 1][0]
}

const limitar = (x, z, rMax) => {
  const d = Math.hypot(x, z)
  return d > rMax && d > 0 ? [(x / d) * rMax, (z / d) * rMax] : [x, z]
}
const disco = (az, R) => {
  const a = az() * 6.283
  const r = Math.sqrt(az()) * R
  return [Math.cos(a) * r, Math.sin(a) * r]
}
function porSectores(grupos, R) {
  const sec = sectores(grupos)
  return grupos.map((g, i) => ({
    forma: g.forma,
    color: g.color,
    cantidad: g.cantidad,
    zona: (az) => {
      const a = sec[i].desde + az() * (sec[i].hasta - sec[i].desde)
      const r = R * (0.12 + 0.88 * Math.sqrt(az()))
      return [Math.cos(a) * r, Math.sin(a) * r]
    },
  }))
}

// Vaso de vidrio con su bebida. `espuma`, `hielo`, `pajita` según qué sea; una rodaja de cítrico en el borde si lleva.
function vaso(THREE, c) {
  const { D, M, raiz, trozos, nombre } = c
  const n = sin(nombre)
  const alto = 1.5
  const nivel = 1.22
  const ri = (y) => 0.455 + (y - 0.2) * 0.1
  const perfil = [
    [0, 0],
    [0.44, 0],
    [0.48, 0.03],
    [0.62, alto],
    [0.585, alto],
    [ri(0.2), 0.2],
    [0, 0.17],
  ]
  const color = vivo(THREE, colorLiquido(trozos, 'vaso'))
  const bebida = new THREE.Mesh(
    lat(THREE, D, [
      [0, 0.19],
      [ri(0.19) - 0.012, 0.19],
      [ri(nivel) - 0.012, nivel],
      [0, nivel],
    ]),
    M.liquido(color, 0.95),
  )
  bebida.renderOrder = 1
  raiz.add(bebida)
  const espuma = /licuado|batido|smoothie|cerveza|milk|chocolatada|leche|capuchino/.test(n)
  if (espuma) {
    const r = ri(nivel) - 0.012
    const e = new THREE.Mesh(
      lat(THREE, D, [
        [0, nivel - 0.1],
        [r, nivel - 0.1],
        [r, nivel + 0.008],
        [r * 0.85, nivel + 0.04],
        [r * 0.4, nivel + 0.065],
        [0, nivel + 0.07],
      ]),
      M.mate(mezclar(THREE, color, '#ffffff', 0.55), 0.8),
    )
    e.renderOrder = 1
    raiz.add(e)
  }
  if (!espuma || /agua|gaseosa|jugo|limonada|soda/.test(n) || /cerveza/.test(n)) {
    const hielo = new THREE.Mesh(
      D(new RoundedBoxGeometry(0.3, 0.3, 0.3, 3, 0.07)),
      D(
        new THREE.MeshPhysicalMaterial({
          color: 0xe9f6ff,
          roughness: 0.05,
          clearcoat: 1,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        }),
      ),
    )
    const az = azar(semillaDe(nombre) + 3)
    if (!/cerveza/.test(n))
      for (let i = 0; i < 4; i++) {
        const h = hielo.clone()
        const a = az() * 6.283
        const r = az() * 0.22
        h.position.set(Math.cos(a) * r, nivel - 0.42 + az() * 0.5, Math.sin(a) * r)
        h.rotation.set(az() * 3, az() * 3, az() * 3)
        h.renderOrder = 2
        raiz.add(h)
      }
  }
  const copa = new THREE.Mesh(lat(THREE, D, perfil), M.vidrio())
  copa.renderOrder = 3
  raiz.add(copa)
  // Pajita
  const pajita = new THREE.Mesh(D(new THREE.CylinderGeometry(0.038, 0.038, 1.8, 12)), M.mate(colorDe(THREE, '--c-verde', '#206140'), 0.35))
  pajita.position.set(0.17, 1.12, -0.04)
  pajita.rotation.z = -0.13
  pajita.castShadow = true
  raiz.add(pajita)
  // Cítrico en el borde
  const citrico = trozos.find((t) => /naranja|limon|lima|pomelo|mandarina/.test(sin(t.nombre)))
  if (citrico) {
    const g = new THREE.Group()
    const corteza = new THREE.Mesh(
      D(new THREE.TorusGeometry(0.27, 0.025, 8, 28)),
      M.mate(mezclar(THREE, citrico.color, '#ffffff', 0.05), 0.5),
    )
    const pulpa = new THREE.Mesh(D(new THREE.CircleGeometry(0.265, 28)), M.mate(mezclar(THREE, citrico.color, '#ffffff', 0.3), 0.4))
    pulpa.position.z = 0.002
    g.add(corteza, pulpa)
    for (let i = 0; i < 8; i++) {
      const r = new THREE.Mesh(D(new THREE.PlaneGeometry(0.012, 0.25)), M.mate(0xfff1c8, 0.6))
      r.position.z = 0.004
      r.rotation.z = (i / 8) * Math.PI
      g.add(r)
    }
    g.position.set(0.55, alto - 0.18, 0.1)
    g.rotation.y = -0.5
    g.rotation.z = 0.2
    raiz.add(g)
  }
  return {
    fov: 27,
    dir: [0, 0.2, 1],
    mira: [0, 0.82, 0],
    W: 1.5,
    H: 1.32,
    sombra: 3.6,
    caliente: null,
    apilar: null,
    adornos: { radioMin: 0.8, medio: 2.0 },
    llenar: () => {},
  }
}

// Taza con platito y vapor
function taza(THREE, c) {
  const { D, M, raiz, trozos } = c
  const alto = 0.64
  const perfil = [
    [0, 0],
    [0.28, 0],
    [0.32, 0.04],
    [0.5, 0.2],
    [0.6, 0.45],
    [0.64, alto],
    [0.6, alto + 0.01],
    [0.575, alto - 0.01],
    [0.5, 0.4],
    [0.3, 0.13],
    [0, 0.11],
  ]
  const tz = new THREE.Mesh(lat(THREE, D, perfil), M.porcelana())
  tz.position.y = 0.045
  tz.castShadow = tz.receiveShadow = true
  raiz.add(tz)
  const asa = new THREE.Mesh(D(new THREE.TorusGeometry(0.19, 0.045, 10, 28, Math.PI * 1.35)), M.porcelana())
  asa.position.set(0.63, 0.41, 0)
  asa.rotation.z = -Math.PI * 0.68
  asa.castShadow = true
  raiz.add(asa)
  const plato = new THREE.Mesh(
    lat(THREE, D, [
      [0, 0],
      [0.8, 0],
      [0.95, 0.05],
      [1.02, 0.11],
      [0.98, 0.115],
      [0.9, 0.07],
      [0.4, 0.04],
      [0, 0.04],
    ]),
    M.porcelana(),
  )
  plato.castShadow = plato.receiveShadow = true
  raiz.add(plato)
  const color = colorLiquido(trozos, 'taza')
  const nivel = 0.52
  const cafe = new THREE.Mesh(D(new THREE.CircleGeometry(0.535, 48)), M.liquido(color, 1))
  cafe.rotation.x = -Math.PI / 2
  cafe.position.y = nivel + 0.045
  raiz.add(cafe)
  return {
    fov: 27,
    dir: [0, 0.62, 1],
    mira: [0, 0.22, 0],
    W: 1.55,
    H: 1.0,
    sombra: 3.2,
    caliente: { x: 0, z: 0, y: 0.7 },
    apilar: null,
    adornos: { radioMin: 1.15, medio: 2.4 },
    llenar: () => {},
  }
}

// Sándwich cortado en dos: cada capa con su altura, de abajo para arriba
const ORDEN = {
  mancha: 0,
  migaja: 1,
  filete: 1,
  medallon: 1,
  trozo: 1,
  salchicha: 1,
  tira: 1,
  cubito: 2,
  cubo: 2,
  rodaja: 3,
  aro: 3,
  hoja: 4,
}
function sandwich(THREE, c) {
  const { D, M, raiz, grupos } = c
  raiz.add(tabla(THREE, D, 1.6))
  const pan = grupos.find((g) => g.forma === 'pan')
  const miga = mezclar(THREE, pan?.color || '#d9a35f', '#fff4d8', 0.55).getStyle()
  const corteza = mezclar(THREE, pan?.color || '#d9a35f', '#5a3315', 0.25).getStyle()
  const rellenos = grupos
    .filter((g) => g.forma !== 'pan')
    .sort((a, b) => (ORDEN[a.forma] ?? 2) - (ORDEN[b.forma] ?? 2))
    .slice(0, 6)
  const a = 0.66
  const capas = []
  capas.push({
    geo: losa(THREE, D, triangulo(THREE, a, 0.07), 0.15, { miga, corteza }),
    mat: M.mate(0xffffff, 0.85),
    alto: 0.15,
    pan: true,
  })
  rellenos.forEach((g, i) => {
    const grueso =
      { mancha: 0.05, hoja: 0.07, rodaja: 0.08, aro: 0.07, cubito: 0.07, cubo: 0.09, migaja: 0.13, tira: 0.08 }[g.forma] ?? 0.15
    const frill = g.forma === 'hoja' ? 0.03 : g.forma === 'mancha' ? 0.012 : 0.008
    const esc = g.forma === 'hoja' ? 1.07 : g.forma === 'mancha' ? 1.02 : 1.0
    const forma = triangulo(THREE, a * esc, 0.07, frill, i * 1.7)
    capas.push({
      geo: losa(THREE, D, forma, grueso, { bisel: 0.01 }),
      mat: M.mate(g.color, g.forma === 'mancha' ? 0.35 : 0.55),
      alto: grueso,
    })
  })
  const tapaGeo = losa(THREE, D, triangulo(THREE, a, 0.07), 0.15, { bisel: 0.014 })
  capas.push({ geo: tapaGeo, mat: M.mate(mezclar(THREE, pan?.color || '#d9a35f', '#8a5a2a', 0.2), 0.8), alto: 0.15 })
  const mitad = (x, giro) => {
    const g = new THREE.Group()
    let y = 0.12
    capas.forEach((l, i) => {
      const m = new THREE.Mesh(l.geo, i === 0 ? D(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 })) : l.mat)
      m.position.y = y
      m.castShadow = m.receiveShadow = true
      g.add(m)
      y += l.alto * 0.94
    })
    g.position.x = x
    g.rotation.y = giro
    return g
  }
  raiz.add(mitad(-0.72, 0.1), mitad(0.72, -0.12))
  return {
    fov: 28,
    dir: [0, 0.5, 1],
    mira: [0, 0.3, 0.1],
    W: 1.95,
    H: 1.3,
    sombra: 3.2,
    caliente: null,
    apilar: null,
    llenar: () => {},
  }
}

// Tostadas con la untada y lo que lleva encima
function tostadas(THREE, c) {
  const { D, M, raiz, grupos } = c
  const base = platoPlayo(THREE, { ...c, grupos: [] })
  const pan = grupos.find((g) => g.forma === 'pan')
  const n = Math.max(1, Math.min(3, Math.round((pan?.gramos || 60) / 30)))
  const tost = mezclar(THREE, pan?.color || '#d9a35f', '#a8601c', 0.35)
  const centros = [
    [[0, 0]],
    [
      [-0.5, 0.05],
      [0.5, -0.05],
    ],
    [
      [-0.5, 0.35],
      [0.5, 0.3],
      [0, -0.5],
    ],
  ][n - 1]
  const giros = [0.1, -0.15, 0.3]
  const w = 0.8
  const forma = formaPan(THREE, w)
  const geo = losa(THREE, D, forma, 0.09, {
    miga: tost.clone().lerp(new THREE.Color('#fff0cc'), 0.2).getStyle(),
    corteza: tost.clone().multiplyScalar(0.7).getStyle(),
    frente: false,
  })
  const mat = D(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }))
  const untada = grupos.find((g) => g.forma === 'mancha')
  const geoUntada = untada ? losa(THREE, D, formaPan(THREE, w * 0.88), 0.02, { bisel: 0.01 }) : null
  const yBase = 0.07
  const rebanadas = centros.map(([x, z], i) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, yBase, z)
    m.rotation.y = giros[i]
    m.castShadow = m.receiveShadow = true
    raiz.add(m)
    if (geoUntada) {
      const u = new THREE.Mesh(geoUntada, M.mate(untada.color, 0.35))
      u.position.set(x, yBase + 0.1, z)
      u.rotation.y = giros[i]
      u.castShadow = true
      raiz.add(u)
    }
    return { x, z, giro: giros[i] }
  })
  const tope = yBase + 0.1 + (untada ? 0.02 : 0)
  const dentroDe = (x, z) => {
    for (const r of rebanadas) {
      const dx = x - r.x
      const dz = z - r.z
      const cs = Math.cos(r.giro)
      const sn = Math.sin(r.giro)
      const u = dx * cs - dz * sn
      const v = dx * sn + dz * cs
      // la forma está de espaldas: el "hongo" queda hacia -z
      if (Math.abs(u) < w / 2 - 0.02 && v > -w / 2 - 0.1 && v < w / 2 - 0.02) return true
    }
    return false
  }
  const encima = grupos.filter((g) => g.forma !== 'pan' && g !== untada)
  return {
    ...base,
    cupo: 16 * n,
    apilar: {
      medio: 1.6,
      piso: (x, z) => (dentroDe(x, z) ? tope : base.apilar.piso(x, z)),
      dentro: (x, z, y, r) => {
        let mejor = [x, z]
        let d2 = Infinity
        for (const s of rebanadas) {
          const px = Math.max(s.x - w / 2 + r * 0.6, Math.min(s.x + w / 2 - r * 0.6, x))
          const pz = Math.max(s.z - w / 2 + r * 0.6, Math.min(s.z + w / 2 - r * 0.6, z))
          const d = (px - x) ** 2 + (pz - z) ** 2
          if (d < d2) {
            d2 = d
            mejor = [px, pz]
          }
        }
        return mejor
      },
      escala: 0.8,
    },
    llenar: (ap) =>
      ap.agregar(
        encima.map((g) => ({
          forma: g.forma,
          color: g.color,
          cantidad: Math.max(2, Math.round(g.cantidad * 0.5)),
          zona: (az) => {
            const r = rebanadas[Math.floor(az() * rebanadas.length)]
            return [r.x + (az() - 0.5) * w * 0.7, r.z + (az() - 0.5) * w * 0.7]
          },
        })),
        c.opcionesCaida,
      ),
  }
}

// Pizza, tarta, tortilla, torta: una base redonda sobre una tabla, con la superficie pintada con lo que lleva y trozos encima
function plataDisco(THREE, c) {
  const { D, M, raiz, grupos, nombre } = c
  const n = sin(nombre)
  const pizza = /pizza|fugazza|fugazzeta|pizzeta/.test(n)
  const huevo = /tortilla|omelette|panqueque/.test(n)
  raiz.add(tabla(THREE, D, 1.6))
  const R = 1.25
  const dominante = grupos[0]?.color || '#e0a84a'
  const masa = pizza ? '#d9a35f' : huevo ? '#e6b64a' : '#d8a45a'
  const alturaMasa = 0.12
  const perfil = [
    [0, 0.12],
    [R * 0.55, 0.12],
    [R * 0.8, 0.12],
    [R * 0.97, 0.16],
    [R * 1.04, 0.2],
    [R * 1.06, 0.26],
    [R * 1.02, 0.31],
    [R * 0.94, 0.3],
    [R * 0.9, 0.23],
    [R * 0.88, alturaMasa + 0.02],
    [0, alturaMasa + 0.02],
  ]
  // Dibujado a mano: la superficie (salsa o relleno) con manchas de los otros ingredientes
  const lienzo = document.createElement('canvas')
  lienzo.width = lienzo.height = 512
  const g = lienzo.getContext('2d')
  const base = pizza ? '#c4452e' : huevo ? '#efcb5f' : dominante
  g.fillStyle = base
  g.fillRect(0, 0, 512, 512)
  const az = azar(semillaDe(nombre))
  const queso = grupos.find((x) => /queso|muzz|mozz|cubito|migaja/.test(x.forma + sin(x.nombre)) && x.forma !== 'pan') || null
  const manchas = (color, cuantas, tam, alfa) => {
    g.fillStyle = color
    g.globalAlpha = alfa
    for (let i = 0; i < cuantas; i++) {
      const a = az() * 6.283
      const r = Math.sqrt(az()) * 235
      g.beginPath()
      g.ellipse(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, tam * (0.6 + az() * 0.8), tam * (0.5 + az() * 0.6), az() * 3, 0, 6.283)
      g.fill()
    }
    g.globalAlpha = 1
  }
  if (pizza) manchas(mezclar(THREE, queso?.color || '#f7e3a0', '#f2d27a', 0.45).getStyle(), 190, 30, 0.92)
  for (const x of grupos.slice(0, 4)) if (x !== queso) manchas(x.color, 18, 12, 0.55)
  manchas('#ffffff', 40, 6, 0.08)
  manchas('#6a3b12', huevo ? 60 : 24, 7, 0.14)
  const textura = D(new THREE.CanvasTexture(lienzo))
  textura.colorSpace = THREE.SRGBColorSpace
  const cuerpo = new THREE.Mesh(lat(THREE, D, perfil, 80), M.mate(masa, 0.85))
  cuerpo.position.y = 0.12
  cuerpo.castShadow = cuerpo.receiveShadow = true
  raiz.add(cuerpo)
  const cara = new THREE.Mesh(
    D(new THREE.CircleGeometry(R * 0.9, 72)),
    D(new THREE.MeshStandardMaterial({ map: textura, roughness: 0.55, metalness: 0 })),
  )
  cara.rotation.x = -Math.PI / 2
  cara.rotation.z = 0.4
  cara.position.y = 0.12 + alturaMasa + 0.025
  cara.receiveShadow = true
  raiz.add(cara)
  const tope = 0.12 + alturaMasa + 0.03
  const encima = grupos.filter((x) => x !== queso && x.forma !== 'mancha' && x.forma !== 'pan')
  return {
    fov: 28,
    dir: [0, 0.8, 1],
    mira: [0, 0.1, 0.1],
    W: 1.9,
    H: 1.35,
    sombra: 3.2,
    caliente: null,
    apilar: {
      medio: 1.6,
      piso: (x, z) => (Math.hypot(x, z) < R * 0.86 ? tope : 0.3),
      dentro: (x, z, y, r) => limitar(x, z, R * 0.82 - r * 0.5),
      escala: 0.85,
    },
    cupo: 70,
    llenar: (ap) =>
      ap.agregar(
        porSectores(encima, R * 0.75).map((e, i) => ({ ...e, cantidad: Math.max(2, Math.round(encima[i].cantidad * 0.6)) })),
        c.opcionesCaida,
      ),
  }
}

// Postre en frasco: capas (yogur, avena, dulce) y arriba lo que lleva
function postre(THREE, c) {
  const { D, M, raiz, grupos } = c
  const alto = 1.25
  const rb = 0.62
  const ri = (y) => rb - 0.03 + y * 0.02
  const perfil = [
    [0, 0],
    [rb - 0.04, 0],
    [rb, 0.04],
    [rb + 0.04, alto],
    [rb + 0.01, alto + 0.005],
    [ri(0.12), 0.14],
    [0, 0.12],
  ]
  const esCapa = (g) => ['mancha', 'cubito', 'migaja', 'lenteja', 'grano'].includes(g.forma)
  let capas = grupos.filter(esCapa).slice(0, 3)
  if (!capas.length && grupos.length) capas = [grupos[0]]
  const total = capas.reduce((s, x) => s + x.gramos, 0) || 1
  const zonaAlta = 0.8
  let y = 0.13
  capas.forEach((l, i) => {
    const grueso = Math.max(0.16, (l.gramos / total) * zonaAlta)
    const r = ri(y + grueso / 2) - 0.012
    const geo = D(new THREE.CylinderGeometry(r, ri(y) - 0.012, grueso, 40))
    const m = new THREE.Mesh(geo, M.liquido(l.forma === 'migaja' ? l.color : l.color, 1))
    m.material.roughness = l.forma === 'migaja' ? 0.85 : 0.25
    m.material.clearcoat = l.forma === 'migaja' ? 0 : 0.6
    m.position.y = y + grueso / 2
    m.renderOrder = 1
    raiz.add(m)
    y += grueso
    void i
  })
  const nivel = y
  const copa = new THREE.Mesh(lat(THREE, D, perfil), M.vidrio())
  copa.renderOrder = 3
  raiz.add(copa)
  const encima = grupos.filter((x) => !capas.includes(x))
  return {
    fov: 27,
    dir: [0, 0.35, 1],
    mira: [0, 0.62, 0],
    W: 1.3,
    H: 1.0,
    sombra: 3,
    caliente: null,
    apilar: {
      medio: 0.9,
      piso: (x, z) => (Math.hypot(x, z) < rb - 0.04 ? nivel : 0),
      dentro: (x, z, yy, r) => limitar(x, z, rb - 0.1 - r * 0.6),
      escala: 0.7,
    },
    cupo: 24,
    llenar: (ap) =>
      ap.agregar(
        encima.map((g) => ({
          forma: g.forma,
          color: g.color,
          cantidad: Math.max(3, Math.round(g.cantidad * 0.6)),
          zona: (a) => disco(a, rb - 0.15),
        })),
        c.opcionesCaida,
      ),
  }
}

const ESCENAS = {
  plato: (T, c) => platoPlayo(T, c, true),
  bowl: (T, c) => bowl(T, c, { sopa: false }),
  sopa: (T, c) => bowl(T, c, { sopa: true }),
  vaso,
  taza,
  sandwich,
  tostadas,
  disco: plataDisco,
  postre,
}

// ---------- La escena ----------
export function crear(THREE, { ancho, alto, props, renderer, quieto }) {
  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(30, ancho / alto, 0.1, 60)
  const pivote = new THREE.Group()
  escena.add(pivote)
  const luz = estudio(THREE, escena, renderer, {
    sol: [-1.9, 5.8, 3.0],
    alcance: 2.6,
    piso: 3.4,
    objetivo: [0, 0.3, 0],
    opacidadPiso: 0.2,
    alDespertar: () => e.despertar?.(),
  })
  let raiz = null
  let desechos = []
  let apiladores = []
  let emplatados = []
  let vapores = []
  let cfg = null
  let aparecer = 1
  let primera = true
  let tamano = { ancho, alto }
  const D = (x) => {
    desechos.push(x)
    return x
  }

  const encuadrar = (w, h) => {
    tamano = { ancho: w, alto: h }
    if (!cfg) return
    const t = Math.tan((cfg.fov * Math.PI) / 360)
    const d = Math.max(cfg.H / t, cfg.W / ((w / h) * t)) * 1.08
    const [dx, dy, dz] = cfg.dir
    const l = Math.hypot(dx, dy, dz)
    camara.fov = cfg.fov
    camara.position.set(cfg.mira[0] + (dx / l) * d, cfg.mira[1] + (dy / l) * d, cfg.mira[2] + (dz / l) * d)
    camara.lookAt(...cfg.mira)
    camara.aspect = w / h
    camara.updateProjectionMatrix()
  }

  const limpiar = () => {
    for (const a of apiladores) a.liberar()
    apiladores = []
    emplatados = []
    for (const s of vapores) escena.remove(s)
    vapores = []
    if (raiz) pivote.remove(raiz)
    for (const x of desechos) x.dispose?.()
    desechos = []
    raiz = null
  }

  const armar = (p) => {
    limpiar()
    const tipo = ESCENAS[p?.tipo] ? p.tipo : 'plato'
    const trozos = p?.trozos || []
    const grupos = repartir(trozos, { plato: 110, bowl: 150, sopa: 50, tostadas: 48, disco: 100, postre: 40 }[tipo] || 100)
    raiz = new THREE.Group()
    pivote.add(raiz)
    const M = materiales(THREE, D)
    const c = { D, M, raiz, grupos, trozos, nombre: p?.nombre || '', opcionesCaida: null }
    c.opcionesCaida = { caer: !quieto, duracion: primera ? 2.2 : 1.4 }
    cfg = ESCENAS[tipo](THREE, c)
    raiz.traverse((o) => {
      if (o.isMesh) o.receiveShadow = o.receiveShadow || o.material?.transparent !== true
    })
    if (cfg.apilar) {
      const ap = crearApilador(THREE, { capacidad: 300, semilla: semillaDe(c.nombre) % 997, ...cfg.apilar })
      raiz.add(ap.grupo)
      apiladores.push(ap)
      cfg.llenar(ap)
    }
    if (cfg.emplatar) {
      const em = crearEmplatado(THREE, {
        trozos,
        semilla: semillaDe(c.nombre) % 9973,
        altura: cfg.emplatar.altura,
        escala: cfg.emplatar.escala || 1,
        cama: !!cfg.emplatar.cama,
        D,
        quieto: quieto || !c.opcionesCaida.caer,
      })
      raiz.add(em.grupo)
      emplatados.push(em)
    }
    // Adornos: lo que lleva la bebida, puesto al lado como en una foto
    if (cfg.adornos) {
      const sol = repartir(trozos, 12)
        .filter((g) => !['mancha', 'migaja', 'grano', 'lenteja'].includes(g.forma))
        .slice(0, 3)
      if (sol.length) {
        const { radioMin, medio } = cfg.adornos
        const ap = crearApilador(THREE, {
          capacidad: 40,
          medio,
          semilla: 5,
          piso: () => 0.0,
          dentro: (x, z, y, r) => {
            const d = Math.hypot(x, z)
            const lim = radioMin + r
            return d < lim ? (d > 0 ? [(x / d) * lim, (z / d) * lim] : [lim, 0]) : [x, z]
          },
          escala: 0.9,
        })
        raiz.add(ap.grupo)
        apiladores.push(ap)
        ap.agregar(
          sol.map((g, i) => ({
            forma: g.forma,
            color: g.color,
            cantidad: g.forma === 'gota' ? 0 : Math.min(4, Math.max(2, Math.round(g.cantidad * 0.4))),
            zona: (az) => {
              const lado = i % 2 === 0 ? 1 : -1
              const a = (lado > 0 ? -0.3 : Math.PI - 0.3) + (az() - 0.5) * 1.3 + (i > 1 ? 0.7 : 0)
              const r = radioMin + 0.1 + az() * 0.4
              return [Math.cos(a) * r, Math.sin(a) * r]
            },
          })),
          c.opcionesCaida,
        )
      }
    }
    if (cfg.caliente) vapores = vapor(THREE, D, escena, { ...cfg.caliente, ancho: tipo === 'taza' ? 0.5 : 0.9, quieto })
    if (luz.piso) {
      luz.piso.scale.setScalar(cfg.sombra / 3.4)
    }
    encuadrar(tamano.ancho, tamano.alto)
    aparecer = quieto || !primera ? 1 : 0
    primera = false
  }
  armar(props)

  const e = {
    escena,
    camara,
    pivote,
    ajustar: encuadrar,
    actualizar: (dt, t) => {
      let sigue = false
      for (const a of apiladores) sigue = a.actualizar(dt) || sigue
      for (const em of emplatados) sigue = em.actualizar(dt) || sigue
      for (const s of vapores) {
        const k = (t * 0.16 + s.userData.fase) % 1
        s.position.set(s.userData.dx + Math.sin(t + s.userData.fase * 6) * 0.07, s.userData.y + k * 1.2, s.userData.dz)
        s.material.opacity = Math.sin(k * Math.PI) * 0.3
        s.scale.setScalar(0.3 + k * 0.55)
      }
      return sigue || vapores.length > 0 || aparecer < 1
    },
    cambiar: (p) => armar(p),
    bajarCalidad: () => luz.bajar(),
    liberar: () => {
      luz.liberar()
      limpiar()
    },
  }
  return e
}

// El tupper del día en 3D (1.26): un tupper de vidrio que se llena con una sola masa continua, como arena de colores o agua
// espesa. Sube según las calorías, tiene las capas mezcladas de los colores de lo que comiste (cada alimento ocupa tanto
// como calorías aportó) y la superficie se mueve despacito como una ola. Nunca pasa del borde: si te pasás del objetivo,
// llega casi al tope y la tapa se cierra solo cuando estás cerca de la meta.
//   props: { trozos: [{ id, nombre, kcal, forma, color }] (lib/plato.js, trozosDelDia), objetivo (kcal) }
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { acercar, colorDe } from './comun'
import { estudio } from './estudio'

const HX = 1.2 // mitad del ancho interior
const HZ = 0.8 // mitad del fondo interior
const ALTO = 0.9
const FONDO = 0.05
const RADIO = 0.16 // redondeo de las esquinas por dentro
const MAX_CAPAS = 12
const LLENO = 0.9 // fracción de la altura cuando se llegó al objetivo
const TOPE = 0.955 // lo más que sube, aunque te pases

// Qué tan alto está la masa (0 a 1 de la altura del tupper) con `kcal` sobre un `objetivo`. Pura, para probarla.
// Hasta la meta sube parejo; pasada la meta sigue un poquito más y se frena antes del borde.
export function nivelDelDia(kcal, objetivo) {
  const f = Math.max(0, Number(kcal) || 0) / Math.max(1, Number(objetivo) || 2000)
  if (f <= 1) return LLENO * f
  return LLENO + (TOPE - LLENO) * (1 - Math.exp(-(f - 1) * 5))
}

// Las capas de colores: [{ color, hasta }] donde `hasta` (0 a 1) es dónde termina cada una en la altura de la masa, en
// proporción a sus calorías. Si hay más de `max`, las más chicas se funden con la vecina. Pura.
export function capasDelDia(trozos, max = MAX_CAPAS) {
  const capas = (trozos || []).filter((t) => Number(t.kcal) > 0).map((t) => ({ color: t.color, kcal: Number(t.kcal) }))
  while (capas.length > max) {
    let i = 0
    capas.forEach((c, k) => {
      if (c.kcal < capas[i].kcal) i = k
    })
    const j = i === 0 ? 1 : i === capas.length - 1 ? i - 1 : capas[i - 1].kcal >= capas[i + 1].kcal ? i - 1 : i + 1
    capas[j].kcal += capas[i].kcal
    capas.splice(i, 1)
  }
  const total = capas.reduce((s, c) => s + c.kcal, 0)
  let acum = 0
  return capas.map((c) => ({ color: c.color, hasta: total ? (acum += c.kcal) / total : 1 }))
}

function contorno(THREE, hx, hz, radio) {
  const s = new THREE.Shape()
  s.moveTo(-hx + radio, -hz)
  s.lineTo(hx - radio, -hz)
  s.quadraticCurveTo(hx, -hz, hx, -hz + radio)
  s.lineTo(hx, hz - radio)
  s.quadraticCurveTo(hx, hz, hx - radio, hz)
  s.lineTo(-hx + radio, hz)
  s.quadraticCurveTo(-hx, hz, -hx, hz - radio)
  s.lineTo(-hx, -hz + radio)
  s.quadraticCurveTo(-hx, -hz, -hx + radio, -hz)
  return s
}

// ---------- La masa: una grilla (la superficie) con una pollera que baja hasta el fondo por todo el borde ----------
const NX = 72
const NZ = 44
const FILAS = 20 // en la pollera

// Mete un punto de la grilla rectangular dentro del contorno redondeado del tupper
function adentro(x, z, hx, hz, r) {
  const cx = hx - r
  const cz = hz - r
  const ax = Math.abs(x)
  const az = Math.abs(z)
  if (ax > cx && az > cz) {
    const dx = ax - cx
    const dz = az - cz
    const d = Math.hypot(dx, dz)
    if (d > r) return [Math.sign(x) * (cx + (dx * r) / d), Math.sign(z) * (cz + (dz * r) / d)]
  }
  return [x, z]
}

export function geometriaMasa(THREE) {
  const hx = HX - 0.006
  const hz = HZ - 0.006
  const pos = []
  const nivel = []
  const tapa = []
  const norm = []
  const idx = []
  const orden = (i, j) => j * (NX + 1) + i
  for (let j = 0; j <= NZ; j++)
    for (let i = 0; i <= NX; i++) {
      const [x, z] = adentro((i / NX) * 2 * hx - hx, (j / NZ) * 2 * hz - hz, hx, hz, RADIO)
      pos.push(x, 0, z)
      nivel.push(1)
      tapa.push(1)
      norm.push(0, 1, 0)
    }
  for (let j = 0; j < NZ; j++)
    for (let i = 0; i < NX; i++) {
      const a = orden(i, j)
      const b = orden(i + 1, j)
      const c = orden(i, j + 1)
      const d = orden(i + 1, j + 1)
      idx.push(a, c, b, b, c, d)
    }
  // El borde de la grilla, en orden alrededor
  const borde = []
  for (let i = 0; i <= NX; i++) borde.push(orden(i, 0))
  for (let j = 1; j <= NZ; j++) borde.push(orden(NX, j))
  for (let i = NX - 1; i >= 0; i--) borde.push(orden(i, NZ))
  for (let j = NZ - 1; j >= 1; j--) borde.push(orden(0, j))
  const n = borde.length
  const base = pos.length / 3
  for (let k = 0; k < n; k++) {
    const p = borde[k] * 3
    const prev = borde[(k + n - 1) % n] * 3
    const sig = borde[(k + 1) % n] * 3
    let tx = pos[sig] - pos[prev]
    let tz = pos[sig + 2] - pos[prev + 2]
    const l = Math.hypot(tx, tz) || 1
    tx /= l
    tz /= l
    let nx = tz
    let nz = -tx
    if (nx * pos[p] + nz * pos[p + 2] < 0) {
      nx = -nx
      nz = -nz
    }
    for (let f = 0; f <= FILAS; f++) {
      pos.push(pos[p], 0, pos[p + 2])
      nivel.push(f / FILAS)
      tapa.push(0)
      norm.push(nx, 0, nz)
    }
  }
  for (let k = 0; k < n; k++) {
    const k2 = (k + 1) % n
    for (let f = 0; f < FILAS; f++) {
      const a = base + k * (FILAS + 1) + f
      const b = base + k2 * (FILAS + 1) + f
      idx.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  // Las caras tienen que mirar para donde dice la normal (en la superficie, hacia arriba; en la pollera, hacia afuera)
  for (let t = 0; t < idx.length; t += 3) {
    const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]]
    const v = (q) => [pos[q * 3], nivel[q], pos[q * 3 + 2]]
    const A = v(a)
    const B = v(b)
    const C = v(c)
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]
    const w = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]
    const cruz = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
    const m = [
      (norm[a * 3] + norm[b * 3] + norm[c * 3]) / 3,
      (norm[a * 3 + 1] + norm[b * 3 + 1] + norm[c * 3 + 1]) / 3,
      (norm[a * 3 + 2] + norm[b * 3 + 2] + norm[c * 3 + 2]) / 3,
    ]
    if (cruz[0] * m[0] + cruz[1] * m[1] + cruz[2] * m[2] < 0) {
      idx[t + 1] = c
      idx[t + 2] = b
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3))
  g.setAttribute('aNivel', new THREE.Float32BufferAttribute(nivel, 1))
  g.setAttribute('aTapa', new THREE.Float32BufferAttribute(tapa, 1))
  g.setIndex(idx)
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, ALTO / 2, 0), 3)
  g.boundingBox = new THREE.Box3(new THREE.Vector3(-HX, -0.1, -HZ), new THREE.Vector3(HX, ALTO + 0.2, HZ))
  return g
}

const OLAS = /* glsl */ `
float olas(vec2 p, float t) {
  return 0.5 * sin(p.x * 2.3 + t * 1.1) + 0.35 * sin(p.y * 3.1 - t * 1.5 + p.x * 0.7) + 0.2 * sin((p.x + p.y) * 5.2 + t * 2.3);
}
vec2 dolas(vec2 p, float t) {
  float c1 = cos(p.x * 2.3 + t * 1.1);
  float c2 = cos(p.y * 3.1 - t * 1.5 + p.x * 0.7);
  float c3 = cos((p.x + p.y) * 5.2 + t * 2.3);
  return vec2(c1 * 1.15 + c2 * 0.245 + c3 * 1.04, c2 * 1.085 + c3 * 1.04);
}`

// Ruido en 3D armado con una textura de valores al azar (el teléfono lee la textura en vez de calcular): rápido incluso en GL lento
const RUIDO = /* glsl */ `
uniform sampler2D uRuido;
float ruido(vec3 p) {
  float iz = floor(p.z);
  float fz = fract(p.z);
  fz = fz * fz * (3.0 - 2.0 * fz);
  float a = texture2D(uRuido, (p.xy + vec2(37.0, 17.0) * iz) / 64.0).r;
  float b = texture2D(uRuido, (p.xy + vec2(37.0, 17.0) * (iz + 1.0)) / 64.0).r;
  return mix(a, b, fz);
}
float fbm(vec3 p) { return 0.65 * ruido(p) + 0.35 * ruido(p * 2.3 + 5.1); }
float azar(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }`

function texturaRuido(THREE) {
  const N = 64
  const datos = new Uint8Array(N * N * 4)
  let s = 12345
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  for (let i = 0; i < N * N * 4; i++) datos[i] = Math.floor(rnd() * 256)
  const tx = new THREE.DataTexture(datos, N, N, THREE.RGBAFormat)
  tx.wrapS = tx.wrapT = THREE.RepeatWrapping
  tx.magFilter = tx.minFilter = THREE.LinearFilter
  tx.needsUpdate = true
  return tx
}

function materialMasa(THREE) {
  const uniformes = {
    uPiso: { value: FONDO * 1.6 },
    uNivel: { value: FONDO * 1.6 },
    uAmp: { value: 0.03 },
    uT: { value: 0 },
    uN: { value: 0 },
    uRuido: { value: texturaRuido(THREE) },
    uCorte: { value: new Float32Array(MAX_CAPAS) },
    uColor: { value: Array.from({ length: MAX_CAPAS }, () => new THREE.Color(0xffffff)) },
  }
  const m = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0 })
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniformes)
    sh.vertexShader = sh.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
attribute float aNivel;
attribute float aTapa;
uniform float uPiso; uniform float uNivel; uniform float uAmp; uniform float uT;
varying vec3 vPos;
${OLAS}`,
      )
      .replace(
        '#include <beginnormal_vertex>',
        `vec2 dd = dolas(position.xz, uT) * uAmp;
vec3 objectNormal = aTapa > 0.5 ? normalize(vec3(-dd.x, 1.0, -dd.y)) : normalize(normal);
#ifdef USE_TANGENT
vec3 objectTangent = vec3(tangent.xyz);
#endif`,
      )
      .replace(
        '#include <begin_vertex>',
        `float yTop = uNivel + olas(position.xz, uT) * uAmp;
vec3 transformed = vec3(position.x, mix(uPiso, yTop, aNivel), position.z);
vPos = transformed;`,
      )
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform float uPiso; uniform float uNivel; uniform float uT; uniform int uN;
uniform float uCorte[${MAX_CAPAS}]; uniform vec3 uColor[${MAX_CAPAS}];
varying vec3 vPos;
${RUIDO}`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
{
  float yf = (vPos.y - uPiso) / max(uNivel - uPiso, 0.02);
  // Las capas se mezclan unas con otras como arena revuelta: la altura se corre con un ruido suave que se mueve despacio
  vec3 q = vec3(vPos.x * 1.5, vPos.y * 2.6, vPos.z * 1.5) + vec3(0.0, uT * 0.04, uT * 0.025);
  float r = fbm(q);
  float t = yf + (r - 0.5) * 0.7;
  vec3 col = uColor[0];
  for (int i = 0; i < ${MAX_CAPAS - 1}; i++) {
    float vale = i < uN - 1 ? 1.0 : 0.0;
    col = mix(col, uColor[i + 1], vale * smoothstep(uCorte[i] - 0.035, uCorte[i] + 0.035, t));
  }
  // Granitos finos
  float g = azar(floor(vPos.xz * 150.0) + floor(vPos.y * 150.0));
  col *= 0.94 + 0.12 * g;
  // Más oscuro contra el fondo, así se siente el volumen
  col *= 0.78 + 0.22 * smoothstep(0.0, 0.25, vPos.y - uPiso);
  col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, 1.35) * 0.92;
  diffuseColor.rgb = col;
}`,
      )
  }
  m.customProgramCacheKey = () => 'masa-tupper-1'
  return { material: m, uniformes }
}

export function crear(THREE, { ancho, alto, props, renderer, quieto }) {
  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(27, ancho / alto, 0.1, 50)
  camara.position.set(0, 2.3, 4.7)
  camara.lookAt(0, 0.38, 0)
  const pivote = new THREE.Group()
  escena.add(pivote)
  const luz = estudio(THREE, escena, renderer, {
    sol: [-1.8, 5.5, 2.6],
    alcance: 2.2,
    piso: 3,
    objetivo: [0, 0.4, 0],
    opacidadPiso: 0.2,
    alDespertar: () => e.despertar?.(),
  })

  // El tupper: paredes de vidrio (un anillo extruido), fondo y un borde de color
  const verde = colorDe(THREE, '--c-verde', '#206140')
  const vidrio = new THREE.MeshPhysicalMaterial({
    color: 0xf2fbff,
    roughness: 0.06,
    metalness: 0,
    transparent: true,
    opacity: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 1.8,
  })
  const grosor = 0.06
  const forma = contorno(THREE, HX + grosor, HZ + grosor, 0.22)
  forma.holes.push(contorno(THREE, HX, HZ, RADIO))
  const paredes = new THREE.Mesh(new THREE.ExtrudeGeometry(forma, { depth: ALTO, bevelEnabled: false, curveSegments: 10 }), vidrio)
  paredes.rotation.x = -Math.PI / 2
  paredes.position.y = FONDO
  paredes.renderOrder = 3
  pivote.add(paredes)
  const fondo = new THREE.Mesh(new RoundedBoxGeometry(2 * (HX + grosor), FONDO * 1.6, 2 * (HZ + grosor), 3, 0.05), vidrio)
  fondo.position.y = FONDO * 0.8
  fondo.renderOrder = 3
  pivote.add(fondo)
  const borde = new THREE.Mesh(
    new THREE.ExtrudeGeometry(
      (() => {
        const s = contorno(THREE, HX + grosor + 0.045, HZ + grosor + 0.045, 0.25)
        s.holes.push(contorno(THREE, HX - 0.01, HZ - 0.01, 0.15))
        return s
      })(),
      { depth: 0.07, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 10 },
    ),
    new THREE.MeshPhysicalMaterial({ color: verde, roughness: 0.35, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
  )
  borde.rotation.x = -Math.PI / 2
  borde.position.y = FONDO + ALTO - 0.02
  borde.castShadow = true
  pivote.add(borde)

  // La tapa: se cierra cuando se llega al objetivo del día (y se abre de nuevo si baja o si te pasás bastante)
  const bisagra = new THREE.Group()
  bisagra.position.set(0, FONDO + ALTO + 0.045, -HZ - grosor - 0.05)
  const tapa = new THREE.Mesh(
    new RoundedBoxGeometry(2 * (HX + grosor + 0.06), 0.07, 2 * (HZ + grosor + 0.06), 3, 0.05),
    new THREE.MeshPhysicalMaterial({ color: verde, roughness: 0.3, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
  )
  tapa.position.set(0, 0, HZ + grosor + 0.06)
  tapa.castShadow = true
  bisagra.add(tapa)
  bisagra.visible = false
  bisagra.rotation.x = -1.4
  pivote.add(bisagra)
  let tapaMeta = -1.4

  // La masa de comida
  const { material, uniformes } = materialMasa(THREE)
  const masa = new THREE.Mesh(geometriaMasa(THREE), material)
  masa.frustumCulled = false
  masa.visible = false
  pivote.add(masa)
  const piso = FONDO * 1.6
  const altura = ALTO - 0.02 // hasta dónde llega la masa si estuviera llena del todo
  let nivelActual = 0
  let nivelMeta = 0
  let corteActual = new Float32Array(MAX_CAPAS)
  let corteMeta = new Float32Array(MAX_CAPAS)
  let reloj = 0

  const llenar = (p) => {
    const trozos = p?.trozos || []
    const objetivo = p?.objetivo || 2000
    const kcal = trozos.reduce((t, x) => t + x.kcal, 0)
    nivelMeta = nivelDelDia(kcal, objetivo)
    const capas = capasDelDia(trozos)
    uniformes.uN.value = Math.max(1, capas.length)
    corteMeta = new Float32Array(MAX_CAPAS).fill(2)
    capas.forEach((c, i) => {
      corteMeta[i] = c.hasta
      uniformes.uColor.value[i].set(c.color)
    })
    if (!capas.length) uniformes.uColor.value[0].set(0xffffff)
    tapaMeta = kcal >= objetivo * 0.98 && kcal <= objetivo * 1.12 ? 0 : -1.4
    if (quieto || nivelActual === 0) {
      // La primera vez (o con movimiento reducido) no hace falta animar la subida desde cero: igual sube rápido la primera vez
      corteActual = corteMeta.slice()
      if (quieto) {
        nivelActual = nivelMeta
        bisagra.rotation.x = tapaMeta
      }
    }
    aplicar()
  }

  const aplicar = () => {
    const y = piso + nivelActual * altura
    uniformes.uNivel.value = y
    // Las olas son más bajitas cuanto más cerca del borde, así la masa nunca asoma por arriba
    uniformes.uAmp.value = Math.max(0.004, Math.min(0.045, (FONDO + ALTO - 0.012 - y) * 0.6))
    for (let i = 0; i < MAX_CAPAS; i++) uniformes.uCorte.value[i] = corteActual[i]
    masa.visible = nivelActual > 0.004
  }
  llenar(props)

  const e = {
    escena,
    camara,
    pivote,
    actualizar: (dt, t) => {
      reloj = quieto ? 0 : (t ?? reloj + dt)
      uniformes.uT.value = reloj
      let sigue = !quieto && masa.visible
      const dn = nivelMeta - nivelActual
      if (Math.abs(dn) > 0.0005) {
        nivelActual = acercar(nivelActual, nivelMeta, dt, 2.2)
        sigue = true
      } else nivelActual = nivelMeta
      for (let i = 0; i < MAX_CAPAS; i++) {
        const dc = corteMeta[i] - corteActual[i]
        if (Math.abs(dc) > 0.0005) {
          corteActual[i] = acercar(corteActual[i], corteMeta[i], dt, 3)
          sigue = true
        } else corteActual[i] = corteMeta[i]
      }
      aplicar()
      const dif = tapaMeta - bisagra.rotation.x
      if (Math.abs(dif) > 0.002) {
        bisagra.rotation.x += dif * Math.min(1, dt * 4)
        bisagra.visible = bisagra.rotation.x > -1.39 || tapaMeta === 0
        return true
      }
      bisagra.visible = tapaMeta === 0
      return sigue
    },
    cambiar: (p) => llenar(p),
    bajarCalidad: () => luz.bajar(),
    liberar: () => luz.liberar(),
  }
  return e
}

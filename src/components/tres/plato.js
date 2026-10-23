// El plato de una receta en 3D (1.24): un plato con la comida repartida en porciones según de qué está hecha (verduras,
// carnes, hidratos...), cada una con el alto que le toca por su peso. Sale humito mientras se mira.
//   props: { partes: [{ nombre, gramos, color: '#rrggbb' }] } (ver lib/plato.js)
import { acercar, colorDe, luces, sombra } from './comun'

const R_PLATO = 1.55
const R_COMIDA = 1.15

// Cada parte como una porción del plato: ángulo de inicio y de fin (proporcional a los gramos). Pura, para probarla.
export function porciones(partes) {
  const total = (partes || []).reduce((s, p) => s + Math.max(0, p.gramos || 0), 0)
  if (!(total > 0)) return []
  let desde = 0
  return partes
    .filter((p) => p.gramos > 0)
    .map((p) => {
      const largo = (p.gramos / total) * Math.PI * 2
      const r = { ...p, desde, hasta: desde + largo, parte: p.gramos / total }
      desde += largo
      return r
    })
}

// Una porción: una cuña con forma de montañita (más alta al medio), un poco despareja para que parezca comida
function cuna(THREE, desde, hasta, alto, semilla) {
  const anillos = 10
  const pasos = Math.max(6, Math.round(((hasta - desde) / (Math.PI * 2)) * 64))
  const pos = []
  const idx = []
  const punto = (r, a) => {
    const k = r / R_COMIDA
    const bulto = Math.cos(k * Math.PI * 0.5) * alto // más alto al centro
    const borde = Math.sin(((a - desde) / (hasta - desde)) * Math.PI) // baja hacia los bordes de la cuña
    const ruido = 0.025 * Math.sin(a * 9 + semilla) * Math.cos(r * 13 + semilla)
    const y = 0.08 + bulto * (0.35 + 0.65 * Math.pow(borde, 0.35)) + ruido
    return [Math.cos(a) * r, y, Math.sin(a) * r]
  }
  for (let i = 0; i <= anillos; i++) {
    const r = 0.05 + (i / anillos) * (R_COMIDA - 0.05)
    for (let j = 0; j <= pasos; j++) pos.push(...punto(r, desde + ((hasta - desde) * j) / pasos))
  }
  const fila = pasos + 1
  for (let i = 0; i < anillos; i++)
    for (let j = 0; j < pasos; j++) {
      const a = i * fila + j
      const b = a + 1
      const c = a + fila
      const d = c + 1
      idx.push(a, b, c, b, d, c)
    }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

export function crear(THREE, { ancho, alto, props, quieto }) {
  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(34, ancho / alto, 0.1, 50)
  camara.position.set(0, 3.5, 4.7)
  camara.lookAt(0, 0.1, 0)
  luces(THREE, escena)
  const piso = sombra(THREE, 4.2, 4.2, 0.2)
  piso.position.y = -0.01
  escena.add(piso)
  const pivote = new THREE.Group()
  escena.add(pivote)

  // El plato: un perfil girado (base, ala y borde)
  const perfil = [
    [0, 0.02],
    [1.05, 0.02],
    [1.12, 0.06],
    [1.2, 0.1],
    [R_PLATO - 0.05, 0.22],
    [R_PLATO, 0.26],
    [R_PLATO - 0.04, 0.29],
    [1.18, 0.16],
    [0, 0.12],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const plato = new THREE.Mesh(
    new THREE.LatheGeometry(perfil, 64),
    new THREE.MeshStandardMaterial({ color: 0xfbfbf8, roughness: 0.25, metalness: 0 }),
  )
  pivote.add(plato)
  const filete = new THREE.Mesh(
    new THREE.TorusGeometry(R_PLATO - 0.12, 0.012, 6, 96),
    new THREE.MeshStandardMaterial({ color: colorDe(THREE, '--c-verde', '#206140'), roughness: 0.4 }),
  )
  filete.rotation.x = Math.PI / 2
  filete.position.y = 0.255
  pivote.add(filete)

  // La comida
  const comida = new THREE.Group()
  pivote.add(comida)
  const armar = (p) => {
    for (const h of [...comida.children]) {
      comida.remove(h)
      h.geometry.dispose()
      h.material.dispose()
    }
    porciones(p?.partes).forEach((x, i) => {
      const alto = 0.18 + Math.min(0.45, x.parte * 0.9)
      const m = new THREE.Mesh(
        cuna(THREE, x.desde + 0.03, x.hasta - 0.03, alto, i * 2.3),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(x.color || '#bdb5a1'), roughness: 0.85, side: THREE.DoubleSide }),
      )
      comida.add(m)
    })
  }
  armar(props)

  // Humito: unos puntos claros que suben y se desvanecen
  const humo = []
  const textura = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const r = g.createRadialGradient(32, 32, 2, 32, 32, 30)
    r.addColorStop(0, 'rgba(255,255,255,0.75)')
    r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()
  if (!quieto)
    for (let i = 0; i < 9; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: textura, transparent: true, depthWrite: false, opacity: 0 }))
      s.userData = { fase: i / 9, x: (Math.random() - 0.5) * 0.9, z: (Math.random() - 0.5) * 0.9 }
      s.scale.setScalar(0.5)
      escena.add(s)
      humo.push(s)
    }

  let aparecer = quieto ? 1 : 0
  const actualizar = (dt, t) => {
    aparecer = acercar(aparecer, 1, dt, 3)
    comida.scale.set(1, Math.max(0.01, aparecer), 1)
    for (const s of humo) {
      const k = (t * 0.18 + s.userData.fase) % 1
      s.position.set(s.userData.x + Math.sin(t + s.userData.fase * 6) * 0.08, 0.6 + k * 1.6, s.userData.z)
      s.material.opacity = Math.sin(k * Math.PI) * 0.35
      s.scale.setScalar(0.35 + k * 0.6)
    }
    return humo.length > 0 || aparecer < 0.995
  }
  return { escena, camara, pivote, actualizar, cambiar: armar }
}

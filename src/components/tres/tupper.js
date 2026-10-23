// El tupper del día en 3D (1.24): se va llenando con lo que se come. Cada capa es un macronutriente (hidratos abajo,
// proteína en el medio, grasas arriba), con alto según las calorías que aportó; el total llega al borde con el objetivo
// del día. Si se pasa, la tapa queda torcida arriba; si se llega justo, se cierra.
//   props: { proteina, hidratos, grasas (kcal de cada uno), objetivo (kcal) }
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { acercar, colorDe, luces, sombra } from './comun'

const ANCHO = 2.4
const ALTO = 1.35
const FONDO = 1.65
const PARED = 0.07
const ALTO_UTIL = ALTO - 0.16
const MAX_LLENO = 1.12 // hasta dónde se dibuja si se pasó del objetivo

// Cuánto ocupa cada capa (fracción del alto útil). Pura, para poder probarla.
export function capas({ proteina = 0, hidratos = 0, grasas = 0, objetivo = 0 } = {}) {
  const total = Math.max(0, proteina) + Math.max(0, hidratos) + Math.max(0, grasas)
  const lleno = objetivo > 0 ? Math.min(MAX_LLENO, total / objetivo) : 0
  const parte = (x) => (total > 0 ? (Math.max(0, x) / total) * lleno : 0)
  return { hidratos: parte(hidratos), proteina: parte(proteina), grasas: parte(grasas), lleno }
}

// La superficie de arriba de una capa, un poco despareja (parece comida y no un bloque)
function despareja(geo, alto, semilla) {
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y > alto / 2 - 0.02) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      pos.setY(i, y + 0.035 * Math.sin(x * 5.1 + semilla) * Math.cos(z * 4.3 - semilla) + 0.02 * Math.sin(x * 11 + z * 7))
    }
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

export function crear(THREE, { ancho, alto, props, quieto }) {
  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(32, ancho / alto, 0.1, 50)
  camara.position.set(0, 3.1, 7.4)
  camara.lookAt(0, 0.95, 0)
  luces(THREE, escena)

  const pivote = new THREE.Group()
  pivote.rotation.x = 0.06
  escena.add(pivote)
  const piso = sombra(THREE, 4, 3)
  piso.position.y = -0.02
  escena.add(piso)

  // Las paredes: plástico transparente. Primero las de atrás, después la comida, después las de adelante.
  const caja = new RoundedBoxGeometry(ANCHO, ALTO, FONDO, 6, 0.24)
  caja.translate(0, ALTO / 2, 0)
  const plastico = (lado, opacidad) =>
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0,
      transparent: true,
      opacity: opacidad,
      side: lado,
      depthWrite: false,
    })
  const atras = new THREE.Mesh(caja, plastico(THREE.BackSide, 0.32))
  atras.renderOrder = 0
  const adelante = new THREE.Mesh(caja, plastico(THREE.FrontSide, 0.2))
  adelante.renderOrder = 3
  pivote.add(atras, adelante)
  // Un borde un poco más marcado arriba, como el de un tupper de verdad
  const borde = new THREE.Mesh(
    new RoundedBoxGeometry(ANCHO + 0.06, 0.08, FONDO + 0.06, 3, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, transparent: true, opacity: 0.55, depthWrite: false }),
  )
  borde.position.y = ALTO - 0.04
  borde.renderOrder = 4
  pivote.add(borde)

  // La comida: una capa por macronutriente
  const colores = {
    hidratos: colorDe(THREE, '--c-naranja', '#e67e22'),
    proteina: colorDe(THREE, '--c-coral', '#e76f51'),
    grasas: colorDe(THREE, '--c-teal', '#408a9b'),
  }
  const orden = ['hidratos', 'proteina', 'grasas']
  const capa = {}
  orden.forEach((k, i) => {
    const geo = despareja(new RoundedBoxGeometry(ANCHO - PARED * 2 - 0.08, 1, FONDO - PARED * 2 - 0.08, 4, 0.12), 1, i * 1.7)
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colores[k], roughness: 0.78, metalness: 0 }))
    m.renderOrder = 1
    m.scale.y = 0.0001
    m.visible = false
    pivote.add(m)
    capa[k] = { malla: m, alto: 0, meta: 0 }
  })

  // La tapa (verde, como el logo), flotando arriba
  const verde = colorDe(THREE, '--c-verde', '#206140')
  const tapa = new THREE.Group()
  const placa = new THREE.Mesh(
    new RoundedBoxGeometry(ANCHO + 0.14, 0.16, FONDO + 0.14, 5, 0.07),
    new THREE.MeshStandardMaterial({ color: verde, roughness: 0.42 }),
  )
  const traba = new THREE.MeshStandardMaterial({ color: verde.clone().multiplyScalar(0.8), roughness: 0.45 })
  for (const x of [-1, 1]) {
    const t = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.1, 0.16, 3, 0.04), traba)
    t.position.set(x * 0.5, -0.06, (FONDO + 0.14) / 2)
    tapa.add(t)
    const t2 = t.clone()
    t2.position.z *= -1
    tapa.add(t2)
  }
  tapa.add(placa)
  pivote.add(tapa)

  let lleno = 0
  let llenoMeta = 0
  let alturaTapa = ALTO + 0.9
  const cambiar = (p) => {
    const c = capas(p)
    llenoMeta = c.lleno
    for (const k of orden) capa[k].meta = c[k]
  }
  cambiar(props)
  if (quieto) {
    for (const k of orden) capa[k].alto = capa[k].meta
    lleno = llenoMeta
  }

  const actualizar = (dt, t) => {
    let moviendo = false
    // Las capas suben de a poco, una arriba de la otra
    let base = PARED + 0.02
    for (const k of orden) {
      const c = capa[k]
      const antes = c.alto
      c.alto = quieto ? c.meta : acercar(c.alto, c.meta, dt, 5)
      if (Math.abs(c.alto - antes) > 0.0003) moviendo = true
      const h = c.alto * ALTO_UTIL
      c.malla.visible = h > 0.004
      c.malla.scale.y = Math.max(0.0001, h)
      c.malla.position.y = base + h / 2
      base += h
    }
    lleno = quieto ? llenoMeta : acercar(lleno, llenoMeta, dt, 5)
    // La tapa: arriba y flotando mientras falta; se cierra al llegar; torcida si se pasó
    const pasado = lleno > 1.02
    const justo = lleno >= 0.97 && !pasado
    const metaTapa = justo ? ALTO + 0.08 : pasado ? ALTO + 0.12 + (lleno - 1) * ALTO_UTIL + 0.25 : ALTO + 0.9
    alturaTapa = quieto ? metaTapa : acercar(alturaTapa, metaTapa, dt, 4)
    const flota = justo || quieto ? 0 : Math.sin(t * 1.6) * 0.05
    tapa.position.y = alturaTapa + flota
    tapa.rotation.z = pasado ? -0.22 : acercar(tapa.rotation.z, 0, dt, 4)
    tapa.rotation.x = justo ? 0 : Math.sin(t * 1.1) * (quieto ? 0 : 0.03)
    return moviendo || !justo
  }

  return { escena, camara, pivote, actualizar, cambiar }
}

// El tupper del día en 3D (1.25): un tupper de vidrio que se va llenando con trocitos de lo que comiste (arroz en granitos,
// rodajas de tomate, trozos de carne, hojas...), tantos como calorías, hasta llegar al objetivo. Si te pasás, asoman por
// arriba. La tapa queda abierta atrás.
//   props: { trozos: [{ id, nombre, kcal, forma, color }] (lib/plato.js, trozosDelDia), objetivo (kcal) }
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { colorDe } from './comun'
import { crearApilador } from './comida'
import { estudio } from './estudio'

const HX = 1.2 // mitad del ancho interior
const HZ = 0.8 // mitad del fondo interior
const ALTO = 0.9
const FONDO = 0.05
const PIEZAS_LLENO = 300 // piezas cuando se llegó al objetivo

// Cuántas piezas le tocan a cada alimento: una cada tanta kcal (al menos una si aporta algo). Pura, para probarla.
export function piezasPorAlimento(trozos, objetivo) {
  const porPieza = Math.max(1, objetivo || 2000) / PIEZAS_LLENO
  const r = new Map()
  for (const t of trozos || []) {
    const n = Math.round(t.kcal / porPieza)
    r.set(t.id, n > 0 ? n : t.kcal >= porPieza * 0.3 ? 1 : 0)
  }
  return r
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
  forma.holes.push(contorno(THREE, HX, HZ, 0.16))
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

  // La comida
  const apilador = crearApilador(THREE, {
    medio: 1.6,
    piso: () => FONDO * 1.6,
    dentro: (x, z, y, r) => {
      const mx = HX - r * 0.85
      const mz = HZ - r * 0.85
      return [Math.max(-mx, Math.min(mx, x)), Math.max(-mz, Math.min(mz, z))]
    },
    capacidad: 800,
    semilla: 11,
    escala: 1.15,
  })
  pivote.add(apilador.grupo)
  const zona = (az) => [(az() * 2 - 1) * HX * 0.95, (az() * 2 - 1) * HZ * 0.95]

  let actual = { trozos: [], objetivo: 2000 }
  let hay = new Map() // id -> piezas ya puestas
  let objetivoBase = null
  let primera = true

  const llenar = (p) => {
    const nuevo = { trozos: p?.trozos || [], objetivo: p?.objetivo || 2000 }
    if (objetivoBase == null || Math.abs(nuevo.objetivo - objetivoBase) / objetivoBase > 0.1) objetivoBase = nuevo.objetivo
    const quiere = piezasPorAlimento(nuevo.trozos, objetivoBase)
    let achico = objetivoBase !== (actual.objetivoBase ?? objetivoBase)
    for (const [id, n] of hay) if ((quiere.get(id) || 0) < n) achico = true
    let caer = true
    if (achico) {
      apilador.borrar()
      hay = new Map()
      caer = false
    }
    const suma = []
    for (const t of nuevo.trozos) {
      const ya = hay.get(t.id) || 0
      const n = (quiere.get(t.id) || 0) - ya
      if (n > 0) suma.push({ forma: t.forma, color: t.color, cantidad: n, zona })
      hay.set(t.id, (quiere.get(t.id) || 0) > 0 ? quiere.get(t.id) : ya)
    }
    if (suma.length) apilador.agregar(suma, { caer: caer && !quieto, duracion: primera ? 2.2 : 0.9 })
    primera = false
    actual = { ...nuevo, objetivoBase }
    const kcal = nuevo.trozos.reduce((t, x) => t + x.kcal, 0)
    tapaMeta = kcal >= objetivoBase * 0.98 && kcal <= objetivoBase * 1.12 ? 0 : -1.4
    if (quieto) bisagra.rotation.x = tapaMeta
  }
  llenar(props)

  const e = {
    escena,
    camara,
    pivote,
    actualizar: (dt) => {
      const cae = apilador.actualizar(dt)
      const dif = tapaMeta - bisagra.rotation.x
      if (Math.abs(dif) > 0.002) {
        bisagra.rotation.x += dif * Math.min(1, dt * 4)
        bisagra.visible = bisagra.rotation.x > -1.39 || tapaMeta === 0
        return true
      }
      bisagra.visible = tapaMeta === 0
      return cae
    },
    cambiar: (p) => llenar(p),
    bajarCalidad: () => luz.bajar(),
    liberar: () => {
      luz.liberar()
      apilador.liberar()
    },
  }
  return e
}

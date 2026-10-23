// El cuerpo en 3D (1.24): la misma silueta de lib/silueta.js, pero con volumen y para girar con el dedo. Con `musculos`
// cada zona se pinta según cuánto se entrenó en la semana, y tocarla dice cuál es.
//   props: { sexo, grasa, escala, modo: 'silueta' | 'musculos', trabajo (Map grupo -> { series, sesiones }), activo, onTocar }
import { CENTRO, ejes, medidas } from '../../lib/silueta'
import { CLAVES_MUSCULARES, intensidad } from '../../lib/musculos'
import { acercar, colorDe, luces, sombra } from './comun'

const S = 1 / 100 // una unidad del dibujo 2D (que mide 200 × 440) en metros de la escena
const X = (x) => (x - CENTRO) * S
const Y = (y) => (440 - y) * S
const VUELTA = 28 // puntos alrededor de cada anillo

// Un tubo hecho de anillos ovalados: { centro: [x, y, z], eje: dirección, rx, rz (radios), cz (corrimiento adelante) }.
// Devuelve la geometría y, por cada punto, de qué anillo y en qué ángulo está (para pintar los músculos).
function tubo(THREE, anillos, tapar = true) {
  const pos = []
  const datos = [] // [índice del anillo, ángulo]
  const indices = []
  const ref = new THREE.Vector3(0, 0, 1)
  anillos.forEach((a, i) => {
    const eje = new THREE.Vector3(...a.eje).normalize()
    // Dos direcciones perpendiculares al eje: "afuera" (x) y "adelante" (z)
    const adelante = ref
      .clone()
      .sub(eje.clone().multiplyScalar(ref.dot(eje)))
      .normalize()
    const costado = new THREE.Vector3().crossVectors(eje, adelante).normalize()
    for (let j = 0; j < VUELTA; j++) {
      const ang = (j / VUELTA) * Math.PI * 2
      const c = Math.cos(ang)
      const s = Math.sin(ang)
      const p = new THREE.Vector3(...a.centro)
        .addScaledVector(costado, s * a.rx)
        .addScaledVector(adelante, c * a.rz + (a.cz || 0) * Math.max(0, c))
      pos.push(p.x, p.y, p.z)
      datos.push([i, ang])
    }
  })
  for (let i = 0; i < anillos.length - 1; i++)
    for (let j = 0; j < VUELTA; j++) {
      const a = i * VUELTA + j
      const b = i * VUELTA + ((j + 1) % VUELTA)
      const c = (i + 1) * VUELTA + j
      const d = (i + 1) * VUELTA + ((j + 1) % VUELTA)
      indices.push(a, b, c, b, d, c)
    }
  if (tapar) {
    // Punta arriba y abajo: un punto al centro de cada extremo
    for (const [i, signo] of [
      [0, 1],
      [anillos.length - 1, -1],
    ]) {
      const centro = pos.length / 3
      const [cx, cy, cz] = anillos[i].centro
      pos.push(cx, cy, cz)
      datos.push([i, 0])
      for (let j = 0; j < VUELTA; j++) {
        const a = i * VUELTA + j
        const b = i * VUELTA + ((j + 1) % VUELTA)
        if (signo > 0) indices.push(centro, b, a)
        else indices.push(centro, a, b)
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return { geo, datos }
}

// Interpola el ancho de una lista [[y, mitad del ancho], ...] (de arriba hacia abajo) a una altura y
const enAltura = (lista, y) => {
  if (y <= lista[0][0]) return lista[0][1]
  for (let i = 1; i < lista.length; i++)
    if (y <= lista[i][0]) {
      const [y0, w0] = lista[i - 1]
      const [y1, w1] = lista[i]
      return w0 + ((w1 - w0) * (y - y0)) / (y1 - y0)
    }
  return lista[lista.length - 1][1]
}

// Arma todas las partes. Cada parte trae una función que, para un punto, dice a qué músculo pertenece (o null).
function armar(THREE, m, sexo) {
  const partes = []
  const cintura = m.cintura + m.panza * 0.35
  // ---------- Torso ----------
  const ancho = [
    [58, m.cuello],
    [66, m.cuello + 1.5],
    [72, m.cuello + 7],
    [78, m.hombros * 0.7],
    [86, m.hombros * 0.84],
    [96, m.hombros * 0.86],
    [108, m.pecho + 1],
    [130, (m.pecho + cintura) / 2 + m.pechos * 0.3],
    [156, cintura],
    [178, (cintura + m.cadera) / 2 + 1],
    [198, m.cadera],
    [214, m.cadera - 3],
    [228, m.cadera * 0.55],
  ]
  // Profundidad: más chata que ancha; la panza y el pecho se adelantan
  const hondo = (y) => {
    const w = enAltura(ancho, y)
    const panza = y > 135 && y < 195 ? m.panza * 0.9 * Math.sin(((y - 135) / 60) * Math.PI) : 0
    const pecho = sexo === 'f' && y > 104 && y < 134 ? m.pechos * 0.9 * Math.sin(((y - 104) / 30) * Math.PI) : 0
    return { rz: w * 0.62, cz: panza + pecho }
  }
  const anillosTorso = []
  for (let y = 58; y <= 230; y += 4) {
    const { rz, cz } = hondo(y)
    anillosTorso.push({ centro: [0, Y(y), 0], eje: [0, -1, 0], rx: enAltura(ancho, y) * S, rz: rz * S, cz: cz * S, y })
  }
  const torso = tubo(THREE, anillosTorso)
  partes.push({
    ...torso,
    grupo: (i, ang) => {
      const y = anillosTorso[i].y
      const c = Math.cos(ang)
      const s = Math.abs(Math.sin(ang))
      if (y < 92 && s > 0.8 && y > 72) return 'hombros'
      if (c > 0.15) {
        if (y >= 84 && y <= 124) return 'pecho'
        if (y > 124 && y <= 204) return 'abdomen'
        return null
      }
      if (c < -0.15) {
        if (y >= 62 && y <= 198) return 'espalda'
        if (y > 198) return 'gluteos'
        return null
      }
      if (y > 130 && y < 196) return 'abdomen'
      return null
    },
  })

  // ---------- Cabeza y cuello ----------
  const cabeza = new THREE.SphereGeometry(1, 28, 20)
  cabeza.scale(m.cabeza * S, m.cabeza * 1.24 * S, m.cabeza * 1.05 * S)
  cabeza.translate(0, Y(34), 0.01)
  partes.push({ geo: cabeza, datos: null, grupo: () => null })

  // ---------- Brazos y piernas: tubos sobre los mismos ejes que el dibujo 2D ----------
  const eje = ejes(m)
  const extremidad = (desde, hasta, perfil, lado, nombre, grupoDe) => {
    const a = new THREE.Vector3(X(desde[0]), Y(desde[1]), 0)
    const b = new THREE.Vector3(X(hasta[0]), Y(hasta[1]), 0)
    const dir = b.clone().sub(a)
    const anillos = []
    for (let k = 0; k <= 24; k++) {
      const t = -0.04 + (k / 24) * 1.02
      const w =
        enAltura(
          perfil.map(([tt, ww]) => [tt, ww]),
          t,
        ) * S
      const atras = perfil.atras ? perfil.atras(t) * S : 0
      anillos.push({ centro: a.clone().addScaledVector(dir, t).toArray(), eje: dir.toArray(), rx: w, rz: w * 0.92, cz: -atras, t })
    }
    const parte = tubo(THREE, anillos)
    partes.push({ ...parte, grupo: (i, ang) => grupoDe(anillos[i].t, Math.cos(ang)), nombre, lado })
  }
  for (const lado of [-1, 1]) {
    const [p0, p1] = eje.pierna(lado)
    const perfilPierna = [
      [-0.05, m.muslo * 0.62],
      [0.02, m.muslo * 0.9],
      [0.09, m.muslo],
      [0.25, m.muslo * 0.9],
      [0.52, m.rodilla],
      [0.67, m.pantorrilla * 0.95],
      [0.95, m.tobillo],
      [1, m.tobillo * 0.95],
    ]
    // La pantorrilla abulta para atrás
    perfilPierna.atras = (t) => (t > 0.55 && t < 0.85 ? Math.sin(((t - 0.55) / 0.3) * Math.PI) * m.pantorrilla * 0.25 : 0)
    extremidad(p0, p1, perfilPierna, lado, 'pierna', (t, c) => {
      if (t < 0.1) return c < -0.2 ? 'gluteos' : c > 0.2 ? 'cuadriceps' : null
      if (t <= 0.5) return c >= 0 ? 'cuadriceps' : 'isquios'
      if (t > 0.56 && t < 0.88) return 'pantorrillas'
      return null
    })
    // El pie, apuntando adelante
    const pie = new THREE.SphereGeometry(1, 16, 12)
    pie.scale(m.tobillo * 1.1 * S, m.tobillo * 0.75 * S, m.tobillo * 2.6 * S)
    pie.translate(X(p1[0]), Y(p1[1]) - 0.1, m.tobillo * 1.4 * S)
    partes.push({ geo: pie, datos: null, grupo: () => null })

    const [b0, b1] = eje.brazo(lado)
    const perfilBrazo = [
      [-0.06, m.brazo * 0.95],
      [0.18, m.brazo],
      [0.45, m.antebrazo * 0.98],
      [0.6, m.antebrazo],
      [0.96, m.muneca],
      [1.02, m.muneca * 0.9],
    ]
    extremidad(b0, b1, perfilBrazo, lado, 'brazo', (t, c) => {
      if (t < 0.12) return 'hombros'
      if (t <= 0.47) return c >= 0 ? 'biceps' : 'triceps'
      if (t <= 0.95) return 'antebrazos'
      return null
    })
    // El hombro: una media esfera que redondea la unión del brazo con el torso
    const delt = new THREE.SphereGeometry(1, 20, 14)
    delt.scale(m.brazo * 1.06 * S, m.brazo * 1.12 * S, m.brazo * 1.02 * S)
    delt.translate(X(b0[0]) - lado * m.brazo * 0.1 * S, Y(b0[1]) + m.brazo * 0.25 * S, 0)
    partes.push({ geo: delt, datos: null, grupo: () => 'hombros', fijo: 'hombros' })

    const mano = new THREE.SphereGeometry(1, 14, 10)
    mano.scale(m.muneca * 1.15 * S, m.muneca * 2.2 * S, m.muneca * 0.6 * S)
    const fin = new THREE.Vector3(X(b1[0]), Y(b1[1]), 0)
    const d = fin
      .clone()
      .sub(new THREE.Vector3(X(b0[0]), Y(b0[1]), 0))
      .normalize()
    mano.rotateZ(Math.atan2(d.x, -d.y))
    mano.translate(fin.x + d.x * m.muneca * 2 * S, fin.y + d.y * m.muneca * 2 * S, 0)
    partes.push({ geo: mano, datos: null, grupo: () => null })
  }
  return partes
}

export function crear(THREE, { ancho, alto, props }) {
  const escena = new THREE.Scene()
  const camara = new THREE.PerspectiveCamera(30, ancho / alto, 0.1, 50)
  camara.position.set(0, 2.35, 8.6)
  camara.lookAt(0, 2.2, 0)
  luces(THREE, escena)
  const piso = sombra(THREE, 2.2, 1.2, 0.25)
  escena.add(piso)
  const pivote = new THREE.Group()
  escena.add(pivote)

  const colores = {
    base: colorDe(THREE, '--c-verde-medio', '#3b8a5f'),
    vacio: colorDe(THREE, '--c-pista', '#e3ece5'),
    lleno: colorDe(THREE, '--c-verde', '#206140'),
    marcado: colorDe(THREE, '--c-coral', '#e76f51'),
  }
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.5,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
  })
  let mallas = []
  let actual = { ...props }
  let grasaVista = props.grasa ?? 20

  const pintar = () => {
    const tmp = new THREE.Color()
    for (const malla of mallas) {
      const { datos, grupo } = malla.userData
      const pos = malla.geometry.attributes.position
      const col = new Float32Array(pos.count * 3)
      const grupos = new Array(pos.count).fill(null)
      for (let i = 0; i < pos.count; i++) {
        let c = colores.base
        if (actual.modo === 'musculos') {
          const g = malla.userData.fijo || (datos ? grupo(...datos[i]) : null)
          grupos[i] = g
          if (!g) c = colores.vacio
          else if (actual.seleccion?.has?.(g)) c = colores.marcado
          else {
            const k = intensidad(actual.trabajo?.get?.(g))
            c = tmp.copy(colores.vacio).lerp(colores.lleno, k === 0 ? 0.06 : 0.22 + k * 0.78)
          }
          if (g && actual.activo === g) c = tmp.copy(c).lerp(colores.marcado, 0.55)
        }
        col[i * 3] = c.r
        col[i * 3 + 1] = c.g
        col[i * 3 + 2] = c.b
      }
      malla.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))
      malla.userData.grupos = grupos
    }
  }

  const rearmar = (grasa) => {
    for (const ms of mallas) {
      pivote.remove(ms)
      ms.geometry.dispose()
    }
    const m = medidas(grasa, actual.sexo, actual.escala || 1)
    mallas = armar(THREE, m, actual.sexo === 'f' ? 'f' : 'm').map((p) => {
      const malla = new THREE.Mesh(p.geo, material)
      malla.userData = { datos: p.datos, grupo: p.grupo, fijo: p.fijo }
      pivote.add(malla)
      return malla
    })
    pintar()
  }
  rearmar(grasaVista)

  const cambiar = (p) => {
    const antes = actual
    actual = { ...p }
    if (antes.sexo !== p.sexo || antes.escala !== p.escala) rearmar(grasaVista)
    else pintar()
  }

  // Al cambiar el % de grasa el cuerpo se rehace de a poco (pocas veces por segundo alcanza para que se vea suave)
  let acumulado = 0
  const actualizar = (dt) => {
    const meta = actual.grasa ?? 20
    if (Math.abs(meta - grasaVista) < 0.05) return false
    acumulado += dt
    grasaVista = acercar(grasaVista, meta, dt, 7)
    if (acumulado > 1 / 30) {
      acumulado = 0
      rearmar(grasaVista)
    }
    return true
  }

  const tocar = (rayo) => {
    if (actual.modo !== 'musculos' || !actual.onTocar) return
    const [hit] = rayo.intersectObjects(mallas, false)
    if (!hit) return
    const g = hit.object.userData.grupos?.[hit.face.a] ?? hit.object.userData.grupos?.[hit.face.b]
    if (g && CLAVES_MUSCULARES.includes(g)) actual.onTocar(g)
  }

  return { escena, camara, pivote, actualizar, cambiar, tocar }
}

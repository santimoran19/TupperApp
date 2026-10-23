// Comida en 3D (1.25): las formas de cada tipo de alimento (granitos de arroz, rodajas, trozos, hojas...) y el apilador, que
// las deja caer una por una y las acomoda como si se amontonaran de verdad (cada pieza apoya sobre lo que ya hay y, si
// puede, rueda hacia el lugar más bajo). Lo usan el tupper del día y el plato de cada receta.
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Un generador de números al azar con semilla (así el mismo plato siempre se arma igual)
export function azar(semilla) {
  let a = semilla >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const semillaDe = (texto) => {
  let h = 2166136261
  for (const c of String(texto)) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}

// ---------- Formas ----------
// Cada una: { geo, r (radio con el que ocupa lugar), h (mitad de su alto), plano (apoya acostada, solo gira en Y),
//             rugosidad, brillo (clearcoat), doble (se ve de los dos lados) }

// Mueve cada punto sobre su normal con una ondulación suave (la misma en puntos repetidos, así no se abre la malla)
function ondular(THREE, geo, amp, frec = 7, fase = 0) {
  if (geo.attributes.uv) geo.deleteAttribute('uv')
  if (geo.attributes.normal) geo.deleteAttribute('normal')
  const g = mergeVertices(geo, 1e-4)
  g.computeVertexNormals()
  const p = g.attributes.position
  const n = g.attributes.normal
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const z = p.getZ(i)
    const d = amp * (Math.sin(x * frec + fase) * Math.cos(z * frec * 1.3 + fase * 0.7) + Math.sin(y * frec * 1.7 + fase) * 0.6)
    p.setXYZ(i, x + n.getX(i) * d, y + n.getY(i) * d, z + n.getZ(i) * d)
  }
  g.computeVertexNormals()
  return g
}
const sinUV = (g) => {
  if (g.attributes.uv) g.deleteAttribute('uv')
  return g
}

// Varias copias de una geometría desparramadas en un puñado (para granos, migas, arvejas: una sola pieza que se ve como muchas)
function punado(THREE, base, cantidad, radio, azarf, alto = 0.5, plano = false) {
  const gs = []
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  for (let i = 0; i < cantidad; i++) {
    const a = azarf() * Math.PI * 2
    const d = Math.sqrt(azarf()) * radio
    const g = sinUV(base.clone())
    e.set(plano ? 0 : azarf() * 6.28, azarf() * 6.28, plano ? 0 : azarf() * 6.28)
    q.setFromEuler(e)
    const s = 0.8 + azarf() * 0.5
    m.compose(new THREE.Vector3(Math.cos(a) * d, (azarf() - 0.5) * radio * alto, Math.sin(a) * d), q, new THREE.Vector3(s, s, s))
    g.applyMatrix4(m)
    gs.push(g)
  }
  return mergeGeometries(gs)
}

export function formaDe3D(THREE, forma, semilla = 1) {
  const az = azar(semilla + semillaDe(forma))
  const F = (o) => ({ r: 0.1, h: 0.05, plano: false, rugosidad: 0.55, brillo: 0, doble: false, ...o })
  switch (forma) {
    case 'grano': {
      const grano = new THREE.CapsuleGeometry(0.016, 0.05, 2, 5)
      return F({ geo: punado(THREE, grano, 15, 0.1, az, 0.9), r: 0.12, h: 0.05, rugosidad: 0.5, brillo: 0.15 })
    }
    case 'pasta': {
      const tubos = []
      for (let i = 0; i < 3; i++) {
        const curva = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.1, 0, 0),
          new THREE.Vector3(-0.03, 0.03, 0.05),
          new THREE.Vector3(0.05, 0.0, 0.02),
          new THREE.Vector3(0.11, 0.03, 0.06),
        ])
        const t = sinUV(new THREE.TubeGeometry(curva, 8, 0.03, 6, false))
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3((az() - 0.5) * 0.14, i * 0.035, (az() - 0.5) * 0.14),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(az() * 0.5, az() * 6.28, az() * 0.5)),
          new THREE.Vector3(1, 1, 1),
        )
        t.applyMatrix4(m)
        tubos.push(t)
      }
      return F({ geo: mergeGeometries(tubos), r: 0.17, h: 0.09, rugosidad: 0.4, brillo: 0.2 })
    }
    case 'cubo': {
      const g = ondular(THREE, new RoundedBoxGeometry(0.15, 0.12, 0.15, 2, 0.035), 0.006, 13, 1)
      return F({ geo: g, r: 0.09, h: 0.06, rugosidad: 0.5, brillo: 0.1 })
    }
    case 'cubito': {
      const g = ondular(THREE, new RoundedBoxGeometry(0.1, 0.09, 0.1, 2, 0.025), 0.004, 17, 2)
      return F({ geo: g, r: 0.065, h: 0.045, rugosidad: 0.45, brillo: 0.15 })
    }
    case 'rodaja': {
      const g = ondular(THREE, new THREE.CylinderGeometry(0.115, 0.115, 0.035, 16, 1), 0.004, 11, 3)
      return F({ geo: g, r: 0.115, h: 0.02, plano: true, rugosidad: 0.4, brillo: 0.3 })
    }
    case 'hoja': {
      const g = new THREE.PlaneGeometry(0.34, 0.26, 8, 6)
      const p = g.attributes.position
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i)
        const y = p.getY(i)
        const borde = Math.abs(x) / 0.17
        p.setZ(i, Math.sin(x * 14) * 0.012 + borde * borde * 0.05 + Math.cos(y * 9 + x * 5) * 0.012)
        const k = 1 - 0.18 * Math.abs(Math.sin(x * 23 + y * 17))
        p.setXY(i, x * k, y * k * (1 - 0.35 * borde * borde))
      }
      g.rotateX(-Math.PI / 2)
      g.deleteAttribute('uv')
      g.computeVertexNormals()
      return F({ geo: g, r: 0.16, h: 0.03, plano: true, rugosidad: 0.45, brillo: 0.25, doble: true })
    }
    case 'floret': {
      const gs = []
      const tallo = sinUV(new THREE.CylinderGeometry(0.022, 0.03, 0.1, 8))
      tallo.translate(0, 0.05, 0)
      gs.push(tallo)
      for (let i = 0; i < 6; i++) {
        const b = ondular(THREE, new THREE.IcosahedronGeometry(0.05 + az() * 0.025, 1), 0.012, 31, i)
        const a = az() * 6.28
        const d = i === 0 ? 0 : 0.045 + az() * 0.03
        b.translate(Math.cos(a) * d, 0.13 + (i === 0 ? 0.03 : az() * 0.03), Math.sin(a) * d)
        gs.push(sinUV(b))
      }
      return F({ geo: mergeGeometries(gs), r: 0.12, h: 0.1, rugosidad: 0.6, plano: true })
    }
    case 'trozo': {
      const g = ondular(THREE, new RoundedBoxGeometry(0.24, 0.13, 0.18, 3, 0.05), 0.012, 9, 4)
      return F({ geo: g, r: 0.13, h: 0.07, plano: true, rugosidad: 0.5, brillo: 0.35 })
    }
    case 'filete': {
      const g = ondular(THREE, new RoundedBoxGeometry(0.36, 0.06, 0.22, 3, 0.025), 0.01, 8, 5)
      return F({ geo: g, r: 0.17, h: 0.035, plano: true, rugosidad: 0.55, brillo: 0.2 })
    }
    case 'tira': {
      const g = ondular(THREE, new RoundedBoxGeometry(0.36, 0.04, 0.075, 2, 0.018), 0.006, 12, 6)
      return F({ geo: g, r: 0.14, h: 0.025, plano: true, rugosidad: 0.35, brillo: 0.4 })
    }
    case 'aro': {
      const g = sinUV(new THREE.TorusGeometry(0.085, 0.024, 6, 16))
      g.rotateX(Math.PI / 2)
      return F({ geo: g, r: 0.11, h: 0.025, plano: true, rugosidad: 0.4, brillo: 0.3 })
    }
    case 'esfera': {
      const s = sinUV(new THREE.SphereGeometry(0.036, 7, 5))
      return F({ geo: punado(THREE, s, 5, 0.06, az, 0.8), r: 0.09, h: 0.05, rugosidad: 0.3, brillo: 0.4 })
    }
    case 'baya': {
      const s = ondular(THREE, new THREE.SphereGeometry(0.052, 9, 7), 0.004, 25, 7)
      s.scale(1, 0.9, 1)
      return F({ geo: punado(THREE, s, 3, 0.07, az, 0.4), r: 0.11, h: 0.05, rugosidad: 0.28, brillo: 0.55 })
    }
    case 'lenteja': {
      const s = sinUV(new THREE.SphereGeometry(0.03, 6, 4))
      s.scale(1, 0.45, 1)
      return F({ geo: punado(THREE, s, 10, 0.1, az, 0.4), r: 0.11, h: 0.03, rugosidad: 0.5, plano: true })
    }
    case 'poroto': {
      const s = sinUV(new THREE.SphereGeometry(0.035, 7, 5))
      s.scale(1.5, 0.9, 0.9)
      return F({ geo: punado(THREE, s, 5, 0.07, az, 0.6), r: 0.1, h: 0.05, rugosidad: 0.35, brillo: 0.3 })
    }
    case 'migaja': {
      const s = ondular(THREE, new THREE.IcosahedronGeometry(0.026, 0), 0.008, 40, 8)
      return F({ geo: punado(THREE, s, 14, 0.1, az, 0.9), r: 0.12, h: 0.05, rugosidad: 0.75 })
    }
    case 'pan': {
      const g = ondular(THREE, new RoundedBoxGeometry(0.16, 0.13, 0.16, 2, 0.03), 0.009, 15, 9)
      // La corteza (arriba) más oscura que la miga: color por punto
      const p = g.attributes.position
      const col = new Float32Array(p.count * 3)
      for (let i = 0; i < p.count; i++) {
        const k = p.getY(i) > 0.045 ? 0.82 : p.getY(i) < -0.045 ? 0.88 : 1.12
        col.set([k, k, k], i * 3)
      }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3))
      return F({ geo: g, r: 0.1, h: 0.065, rugosidad: 0.85, plano: true })
    }
    case 'nuez': {
      const s = ondular(THREE, new THREE.SphereGeometry(0.04, 8, 6), 0.006, 30, 10)
      s.scale(1.25, 0.9, 0.95)
      return F({ geo: punado(THREE, s, 3, 0.06, az, 0.5), r: 0.1, h: 0.045, rugosidad: 0.6 })
    }
    case 'mancha': {
      const g = ondular(THREE, new THREE.SphereGeometry(0.26, 18, 10), 0.012, 6, 11)
      g.scale(1, 0.34, 1)
      return F({ geo: g, r: 0.25, h: 0.07, plano: true, rugosidad: 0.3, brillo: 0.5 })
    }
    case 'medallon': {
      const perfil = [
        [0, -0.04],
        [0.15, -0.04],
        [0.18, -0.02],
        [0.19, 0.0],
        [0.18, 0.025],
        [0.14, 0.04],
        [0, 0.045],
      ].map(([x, y]) => new THREE.Vector2(x, y))
      const g = ondular(THREE, new THREE.LatheGeometry(perfil, 16), 0.007, 14, 12)
      return F({ geo: g, r: 0.18, h: 0.045, plano: true, rugosidad: 0.55, brillo: 0.15 })
    }
    case 'salchicha': {
      const g = sinUV(new THREE.CapsuleGeometry(0.05, 0.3, 3, 8))
      g.rotateZ(Math.PI / 2)
      return F({ geo: g, r: 0.17, h: 0.05, plano: true, rugosidad: 0.35, brillo: 0.5 })
    }
    case 'cuna': {
      const g = ondular(THREE, new THREE.CylinderGeometry(0.46, 0.46, 0.06, 16, 1, false, 0, 0.95), 0.004, 10, 13)
      g.translate(-0.2, 0, 0)
      return F({ geo: g, r: 0.26, h: 0.035, plano: true, rugosidad: 0.55, brillo: 0.2 })
    }
    case 'chip': {
      const g = new THREE.CircleGeometry(0.1, 14)
      const p = g.attributes.position
      for (let i = 0; i < p.count; i++) p.setZ(i, Math.pow(p.getX(i) / 0.1, 2) * 0.04 + Math.sin(p.getY(i) * 30) * 0.004)
      g.rotateX(-Math.PI / 2)
      g.deleteAttribute('uv')
      g.computeVertexNormals()
      return F({ geo: g, r: 0.1, h: 0.03, plano: true, rugosidad: 0.5, doble: true })
    }
    case 'gota':
    default: {
      const s = sinUV(new THREE.SphereGeometry(0.045, 7, 5))
      return F({ geo: punado(THREE, s, 4, 0.07, az, 0.7), r: 0.1, h: 0.05, rugosidad: 0.1, brillo: 0.8 })
    }
  }
}

// ---------- El apilador ----------
// `opciones`: { medio (mitad del lado del cuadro donde se apila), piso(x, z) → altura del fondo, dentro(x, z, y, r) → [x, z]
//   (empuja un punto hacia adentro del recipiente), capacidad (piezas por forma), semilla }
export function crearApilador(
  THREE,
  { medio = 1.6, piso = () => 0, dentro = (x, z) => [x, z], capacidad = 900, semilla = 7, escala: escalaGlobal = 1 } = {},
) {
  const N = 72
  const celda = (2 * medio) / N
  const hf = new Float32Array(N * N)
  const grupo = new THREE.Group()
  const formas = new Map() // forma -> { malla, cuenta, def }
  const piezas = []
  const activas = new Set()
  let t = 0
  const az = azar(semilla)

  const reiniciar = () => {
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) hf[j * N + i] = piso(-medio + (i + 0.5) * celda, -medio + (j + 0.5) * celda)
    for (const f of formas.values()) f.cuenta = 0
    for (const f of formas.values()) f.malla.count = 0
    piezas.length = 0
    activas.clear()
  }
  reiniciar()

  const altura = (x, z, r) => {
    const i0 = Math.max(0, Math.floor((x - r + medio) / celda))
    const i1 = Math.min(N - 1, Math.floor((x + r + medio) / celda))
    const j0 = Math.max(0, Math.floor((z - r + medio) / celda))
    const j1 = Math.min(N - 1, Math.floor((z + r + medio) / celda))
    let m = 0
    for (let j = j0; j <= j1; j++) {
      const cz = -medio + (j + 0.5) * celda - z
      for (let i = i0; i <= i1; i++) {
        const cx = -medio + (i + 0.5) * celda - x
        if (cx * cx + cz * cz <= r * r) {
          const v = hf[j * N + i]
          if (v > m) m = v
        }
      }
    }
    return m
  }
  const subir = (x, z, r, y, h) => {
    const i0 = Math.max(0, Math.floor((x - r + medio) / celda))
    const i1 = Math.min(N - 1, Math.floor((x + r + medio) / celda))
    const j0 = Math.max(0, Math.floor((z - r + medio) / celda))
    const j1 = Math.min(N - 1, Math.floor((z + r + medio) / celda))
    for (let j = j0; j <= j1; j++) {
      const cz = -medio + (j + 0.5) * celda - z
      for (let i = i0; i <= i1; i++) {
        const cx = -medio + (i + 0.5) * celda - x
        const d2 = (cx * cx + cz * cz) / (r * r)
        if (d2 <= 1) {
          const v = y + h * Math.sqrt(1 - d2)
          if (v > hf[j * N + i]) hf[j * N + i] = v
        }
      }
    }
  }

  const tomarForma = (forma, color) => {
    let f = formas.get(forma)
    if (!f) {
      const def = formaDe3D(THREE, forma, semilla)
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: def.rugosidad,
        metalness: 0,
        clearcoat: def.brillo,
        clearcoatRoughness: 0.35,
        side: def.doble ? THREE.DoubleSide : THREE.FrontSide,
        vertexColors: !!def.geo.attributes.color,
        transparent: forma === 'gota',
        opacity: forma === 'gota' ? 0.82 : 1,
      })
      const malla = new THREE.InstancedMesh(def.geo, material, capacidad)
      malla.count = 0
      malla.castShadow = true
      malla.receiveShadow = true
      malla.frustumCulled = false
      grupo.add(malla)
      f = { malla, cuenta: 0, def }
      formas.set(forma, f)
    }
    void color
    return f
  }

  const m4 = new THREE.Matrix4()
  const pos = new THREE.Vector3()
  const quat = new THREE.Quaternion()
  const esc = new THREE.Vector3()
  const euler = new THREE.Euler()
  const col = new THREE.Color()
  const poner = (p, y) => {
    pos.set(p.x, y, p.z)
    quat.setFromEuler(euler.set(p.rx, p.ry, p.rz))
    esc.setScalar(p.s)
    p.f.malla.setMatrixAt(p.i, m4.compose(pos, quat, esc))
  }

  // Suma piezas: [{ forma, color, cantidad, zona(): [x, z], escala }]. `caer`: las deja caer de a una (si no, ya apiladas).
  const agregar = (lista, { caer = true, desde = 2.4, duracion = 1.8 } = {}) => {
    const total = lista.reduce((s, g) => s + g.cantidad, 0) || 1
    let n = 0
    // Intercaladas: una de cada grupo por vuelta (así no caen por tandas de un solo alimento)
    const colas = lista.map((g) => ({ ...g, resta: g.cantidad }))
    while (colas.some((c) => c.resta > 0)) {
      for (const g of colas) {
        if (g.resta <= 0) continue
        g.resta--
        const f = tomarForma(g.forma, g.color)
        if (f.cuenta >= capacidad) continue
        const s = escalaGlobal * (g.escala || 1) * (0.88 + az() * 0.3)
        const r = f.def.r * s
        const h = f.def.h * s
        let [x, z] = g.zona(az)
        ;[x, z] = dentro(x, z, 0, r)
        let y = altura(x, z, r)
        // Rueda hacia el lugar más bajo de alrededor
        for (let k = 0; k < 3; k++) {
          let mejor = null
          for (let a = 0; a < 6; a++) {
            const ang = az() * 6.283
            let cx = x + Math.cos(ang) * r * 0.9
            let cz = z + Math.sin(ang) * r * 0.9
            ;[cx, cz] = dentro(cx, cz, y, r)
            const cy = altura(cx, cz, r)
            if (cy < y - 0.012 && (!mejor || cy < mejor[2])) mejor = [cx, cz, cy]
          }
          if (!mejor) break
          ;[x, z, y] = mejor
        }
        const yF = y + h
        subir(x, z, r, y, h * 2)
        const p = {
          f,
          i: f.cuenta++,
          x,
          z,
          yF,
          s,
          rx: f.def.plano ? (az() - 0.5) * 0.18 : az() * 6.283,
          ry: az() * 6.283,
          rz: f.def.plano ? (az() - 0.5) * 0.18 : az() * 6.283,
          t0: caer ? t + (n / total) * duracion : -9,
          alto: desde + az() * 0.5,
        }
        f.malla.count = f.cuenta
        col.set(g.color)
        const hsl = {}
        col.getHSL(hsl)
        col.setHSL(hsl.h + (az() - 0.5) * 0.02, Math.min(1, hsl.s * (0.9 + az() * 0.2)), Math.min(0.95, hsl.l * (0.88 + az() * 0.24)))
        f.malla.setColorAt(p.i, col)
        poner(p, caer ? yF + p.alto : yF)
        if (caer) {
          pos.set(p.x, p.yF + p.alto, p.z)
          f.malla.setMatrixAt(p.i, m4.compose(pos, quat.identity(), esc.setScalar(0.0001)))
          p.oculta = true
          activas.add(p)
        }
        piezas.push(p)
        n++
      }
    }
    for (const f of formas.values()) {
      f.malla.instanceMatrix.needsUpdate = true
      if (f.malla.instanceColor) f.malla.instanceColor.needsUpdate = true
    }
  }

  // Avanza las piezas que están cayendo. Devuelve true mientras quede alguna.
  const actualizar = (dt) => {
    if (!activas.size) return false
    t += dt
    const tocadas = new Set()
    for (const p of activas) {
      const k = (t - p.t0) / 0.5
      if (k < 0) continue // todavía no salió (invisible)
      p.oculta = false
      const kk = Math.min(1, k)
      const y = p.yF + p.alto * (1 - kk * kk)
      poner(p, y)
      tocadas.add(p.f)
      if (k >= 1) {
        poner(p, p.yF)
        activas.delete(p)
      }
    }
    for (const f of tocadas) f.malla.instanceMatrix.needsUpdate = true
    return activas.size > 0
  }

  const caeAun = () => activas.size > 0
  const borrar = () => {
    reiniciar()
    t = 0
  }
  const liberar = () => {
    for (const f of formas.values()) {
      f.malla.geometry.dispose()
      f.malla.material.dispose()
      f.malla.dispose()
    }
  }
  return { grupo, agregar, actualizar, borrar, liberar, caeAun, cuenta: () => piezas.length }
}

// Las piezas del plato en 3D (1.26): cada ingrediente es UN objeto que se reconoce (una milanesa empanada con su limón, un
// montículo de arroz, un nido de fideos, una cama de hojas, rodajas de tomate...), hecho con geometría continua y texturas
// dibujadas. Nada de pedacitos sueltos. Todas apoyan en y = 0 y miran a +z; `userData.alturaEn(x, z)` dice qué altura tienen
// en un punto (para poner una salsa o queso rallado encima).
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import * as X from './texturas.js'

const TAU = Math.PI * 2

// ---------- Utilidades ----------
// Los colores de una pieza: el de cada ingrediente que se dibuja igual (arvejas y choclo) y tonos parecidos de cada uno
const variantes = (p, k) => (p.colores?.length ? p.colores : [p.color]).flatMap((col) => [col, X.tono(col, k), X.tono(col, -k * 0.8)])

const mate = (c, o = {}, fisico = false) => {
  const { THREE, D } = c
  const M = fisico ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial
  return D(new M({ roughness: 0.7, metalness: 0, ...o }))
}

// Que la textura use el rectángulo que ocupa la pieza (x e y de la forma): el borde del dibujo es el borde de la pieza
function uvCaja(THREE, geo) {
  geo.computeBoundingBox()
  const b = geo.boundingBox
  const p = geo.attributes.position
  const w = b.max.x - b.min.x || 1
  const h = b.max.y - b.min.y || 1
  const uv = new Float32Array(p.count * 2)
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = (p.getX(i) - b.min.x) / w
    uv[i * 2 + 1] = (p.getY(i) - b.min.y) / h
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geo
}
// Que la textura se proyecte desde arriba (x, z)
function uvPlano(THREE, geo, lado) {
  const p = geo.attributes.position
  const uv = new Float32Array(p.count * 2)
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = p.getX(i) / lado + 0.5
    uv[i * 2 + 1] = p.getZ(i) / lado + 0.5
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geo
}

// Contorno de un óvalo algo irregular. `afinar`: de 0 a 1, cuánto se angosta un extremo (un filete).
function ovalo(c, rx, rz, { ruido = 0.05, afinar = 0, n = 56 } = {}) {
  const { THREE, az } = c
  const f1 = az() * 6
  const f2 = az() * 6
  const s = new THREE.Shape()
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU
    const f = 1 + ruido * Math.sin(3 * a + f1) + ruido * 0.6 * Math.sin(5 * a + f2)
    const ang = 1 - afinar * (0.5 + 0.5 * Math.cos(a))
    const x = rx * Math.cos(a) * f
    const z = rz * Math.sin(a) * f * ang
    if (i === 0) s.moveTo(x, z)
    else s.lineTo(x, z)
  }
  s.closePath()
  return s
}

// Una losa con los bordes redondeados (milanesa, bife, filete, pan...)
function losa(c, forma, grosor, bisel, material) {
  const { THREE } = c
  const geo = new THREE.ExtrudeGeometry(forma, {
    depth: grosor,
    bevelEnabled: true,
    bevelThickness: bisel,
    bevelSize: bisel,
    bevelSegments: 4,
    curveSegments: 2,
    steps: 1,
  })
  uvCaja(THREE, geo)
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, bisel, 0)
  const m = new THREE.Mesh(geo, material)
  c.D(geo)
  return m
}

// Un montículo de granos, migas o puré: curva suave (cúpula) con un poco de ondulación para que no sea perfecto
function monticulo(c, { r, h: h0, material, ruido = 0.06, achatar = 1 }) {
  const { THREE, az } = c
  const h = h0 * achatar
  const pts = []
  const N = 22
  for (let i = 0; i <= N; i++) {
    const f = (i / N) * (Math.PI / 2)
    pts.push(new THREE.Vector2(r * Math.cos(f) + (i === 0 ? 0 : 0), h * Math.sin(f)))
  }
  let geo = new THREE.LatheGeometry(pts, 64)
  geo.deleteAttribute('uv')
  geo.deleteAttribute('normal')
  geo = mergeVertices(geo, 1e-4)
  const p = geo.attributes.position
  const f1 = az() * 6
  const f2 = az() * 6
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const z = p.getZ(i)
    const y = p.getY(i)
    const a = Math.atan2(z, x)
    const k = 1 + ruido * (Math.sin(3 * a + f1) + 0.6 * Math.sin(5 * a + f2))
    const t = Math.min(1, y / h)
    p.setXYZ(i, x * k, y + h * 0.04 * Math.sin(x * 11 + f1) * Math.cos(z * 9 + f2) * t, z * k)
  }
  uvPlano(THREE, geo, r * 2)
  geo.computeVertexNormals()
  c.D(geo)
  const m = new THREE.Mesh(geo, material)
  const g = new THREE.Group()
  g.add(m)
  g.userData.alturaEn = (x, z) => {
    const d = Math.hypot(x, z) / r
    return d >= 1 ? 0 : h * Math.sqrt(1 - d * d)
  }
  return g
}

// Un montón de piezas iguales que cae y se apila de verdad (cada una apoya sobre las que ya hay). Una sola malla instanciada.
function pila(c, { geo, n, rad, area, colores, mat, escala = [0.88, 1.12], alta = false, inclinar = 0.4, yaw = true }) {
  const { THREE, az, D } = c
  const puestos = []
  for (let i = 0; i < n; i++) {
    const s = escala[0] + az() * (escala[1] - escala[0])
    const rr = rad * s
    // Cada pieza prueba varios lugares y se queda con el más bajo: así el montón se desparrama en vez de crecer como una torre
    let mejor = null
    for (let k = 0; k < 10; k++) {
      const a = az() * TAU
      const d = Math.sqrt(az()) * area
      const x = Math.cos(a) * d
      const z = Math.sin(a) * d
      let y = rr
      for (const q of puestos) {
        const dd = Math.hypot(x - q.x, z - q.z)
        const min = rr + q.rr
        if (dd < min) y = Math.max(y, q.y + Math.sqrt(min * min - dd * dd) * (alta ? 1 : 0.9))
      }
      // Un poco de preferencia por el centro, para que quede un montoncito y no una capa pareja
      const costo = y + d * 0.35
      if (!mejor || costo < mejor.costo) mejor = { x, y, z, s, rr, costo }
    }
    puestos.push(mejor)
  }
  const im = new THREE.InstancedMesh(geo, mat, n)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const col = new THREE.Color()
  puestos.forEach((p, i) => {
    e.set((az() - 0.5) * inclinar * 2, yaw ? az() * TAU : 0, (az() - 0.5) * inclinar * 2)
    q.setFromEuler(e)
    m.compose(new THREE.Vector3(p.x, p.y, p.z), q, new THREE.Vector3(p.s, p.s, p.s))
    im.setMatrixAt(i, m)
    col.set(colores[Math.floor(az() * colores.length)])
    im.setColorAt(i, col)
  })
  im.instanceMatrix.needsUpdate = true
  if (im.instanceColor) im.instanceColor.needsUpdate = true
  D(geo)
  const g = new THREE.Group()
  g.add(im)
  g.userData.alturaEn = (x, z) => {
    let h = 0
    for (const p of puestos) if (Math.hypot(x - p.x, z - p.z) < p.rr) h = Math.max(h, p.y + p.rr * 0.6)
    return h
  }
  return g
}

// Una mancha irregular (para salsas, huevo, charquitos): contorno ondulado
function mancha(c, r, ruido = 0.14, n = 44) {
  const { THREE, az } = c
  const f1 = az() * 6
  const f2 = az() * 6
  const f3 = az() * 6
  const s = new THREE.Shape()
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU
    const k = 1 + ruido * (Math.sin(2 * a + f1) * 0.35 + Math.sin(3 * a + f2) * 0.7 + Math.sin(5 * a + f3) * 0.55)
    const x = Math.cos(a) * r * k
    const z = Math.sin(a) * r * k * 0.92
    if (i === 0) s.moveTo(x, z)
    else s.lineTo(x, z)
  }
  s.closePath()
  return s
}

// ---------- Rodajas (tomate, pepino, zanahoria, limón...) ----------
function especRodaja(nombre, color) {
  const n = String(nombre || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
  if (/tomate/.test(n)) return { cascara: '#c8321f', pulpa: '#e8584a', centro: '#f39a85', gajos: 4, semillas: true }
  if (/pepino|zucchini|zapallito/.test(n)) return { cascara: '#3f7a2a', pulpa: '#d3e8ae', centro: '#eaf4d2' }
  if (/zanahoria/.test(n)) return { cascara: '#e8731a', pulpa: '#f59a3a', centro: '#f8b865' }
  if (/banana/.test(n)) return { cascara: '#e6c34a', pulpa: '#f8ebaa', centro: '#d8c27c' }
  if (/limon|lima/.test(n)) return { cascara: '#e8d02a', pulpa: '#f7edb6', centro: '#f4e27a', gajos: 8 }
  if (/naranja|mandarina|pomelo/.test(n)) return { cascara: '#e88a1a', pulpa: '#f8c26e', centro: '#f3a740', gajos: 9 }
  if (/kiwi/.test(n)) return { cascara: '#7a5a2a', pulpa: '#8cbf3a', centro: '#eaf2bd' }
  if (/champi/.test(n)) return { cascara: '#9a7a58', pulpa: '#eddec4', centro: '#dac5a2' }
  if (/cebolla/.test(n)) return { cascara: '#d8c8d8', pulpa: '#f4eef2', centro: '#ffffff', gajos: 0 }
  if (/palta|aguacate/.test(n)) return { cascara: '#3a4a1e', pulpa: '#c8dc6a', centro: '#8a7a3a' }
  return { cascara: X.tono(color, -0.35), pulpa: color, centro: X.tono(color, 0.3) }
}

function discoRodaja(c, esp, rad, grosor = 0.034) {
  const { THREE } = c
  const t = X.rodaja(THREE, c.D, c.semilla + 3, esp)
  const lado = mate(c, { color: esp.cascara, roughness: 0.55 })
  const cara = mate(c, { map: t.map, roughness: 0.4 })
  const geo = new THREE.CylinderGeometry(rad, rad, grosor, 36, 1)
  c.D(geo)
  const m = new THREE.Mesh(geo, [lado, cara, cara])
  return m
}

function rodajas(c, p) {
  const { THREE, az } = c
  const esp = especRodaja(p.nombre, p.color)
  const rad = p.radio * 0.52
  const n = Math.max(3, Math.min(6, Math.round(2.4 + p.gramos / 45)))
  const g = new THREE.Group()
  // Un abanico: cada rodaja apoya apenas sobre la anterior
  for (let i = 0; i < n; i++) {
    const m = discoRodaja(c, esp, rad)
    const k = i - (n - 1) / 2
    m.position.set(k * rad * 0.72, 0.03 + i * 0.016, Math.sin(k * 0.6) * rad * 0.3)
    m.rotation.set(0.0, az() * 6, -0.16 + (az() - 0.5) * 0.1)
    m.rotation.order = 'YXZ'
    m.rotation.y = 0
    m.rotation.z = -0.2
    m.rotation.x = (az() - 0.5) * 0.1
    g.add(m)
  }
  g.rotation.y = 0.3 + az() * 0.3
  g.userData.alturaEn = () => 0.08
  return g
}

// Una rodaja de limón para acompañar (apoyada de canto contra la pieza, de a mitades)
function limon(c, rad = 0.17) {
  const { THREE } = c
  const esp = especRodaja('limon', '#f0e04a')
  const g = new THREE.Group()
  const t = X.rodaja(THREE, c.D, c.semilla + 9, esp)
  const lado = mate(c, { color: esp.cascara, roughness: 0.5 })
  const cara = mate(c, { map: t.map, roughness: 0.35 }, false)
  const geo = new THREE.CylinderGeometry(rad, rad, 0.04, 32, 1, false, 0, Math.PI)
  c.D(geo)
  const m = new THREE.Mesh(geo, [lado, cara, cara])
  // Media rodaja: la mitad recta mira hacia abajo y la rodaja se apoya apenas inclinada
  const caraPlana = new THREE.Mesh(
    c.D(new THREE.PlaneGeometry(rad * 2, 0.04)),
    mate(c, { color: esp.pulpa, roughness: 0.5, side: THREE.DoubleSide }),
  )
  caraPlana.rotation.y = 0
  g.add(m)
  m.rotation.set(Math.PI / 2 - 0.35, 0, 0)
  m.position.y = rad * 0.55
  void caraPlana
  return g
}

// ---------- Proteínas ----------
function milanesa(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.empanado(THREE, D, c.semilla, '#d19a47')
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 2.2, roughness: 0.82 })
  const g = new THREE.Group()
  const n = p.gramos > 260 ? 2 : 1
  for (let i = 0; i < n; i++) {
    const forma = ovalo(c, r * 1.12, r * 0.78, { ruido: 0.05, afinar: 0.08 })
    const m = losa(c, forma, 0.03, 0.03, material)
    m.position.set(n === 2 ? (i ? 0.1 : -0.12) : 0, i * 0.075, n === 2 ? (i ? 0.08 : -0.1) : 0)
    m.rotation.y = (i ? 0.25 : -0.12) + (az() - 0.5) * 0.12
    g.add(m)
  }
  const l = limon(c, r * 0.36)
  l.position.set(r * 0.78, 0, r * 0.62)
  l.rotation.y = -0.6
  g.add(l)
  g.userData.alturaEn = () => 0.09 + (n - 1) * 0.075
  return g
}

function muslo(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.piel(THREE, D, c.semilla, '#c7782e')
  const piel = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.5, roughness: 0.55 }, true)
  piel.clearcoat = 0.25
  piel.clearcoatRoughness = 0.5
  const hueso = mate(c, { color: '#f3ead2', roughness: 0.5 })
  const g = new THREE.Group()
  const n = p.gramos > 230 ? 2 : 1
  for (let i = 0; i < n; i++) {
    const R = r * 0.34
    const L = r * 1.15
    const pts = []
    for (let k = 0; k <= 20; k++) {
      const u = k / 20
      const rad = Math.max(0.0001, R * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.85) * (1 - 0.1 * u))
      pts.push(new THREE.Vector2(rad, u * L))
    }
    const geo = new THREE.LatheGeometry(pts, 28)
    D(geo)
    const meat = new THREE.Mesh(geo, piel)
    const pata = new THREE.Group()
    pata.add(meat)
    const bone = new THREE.Mesh(D(new THREE.CylinderGeometry(R * 0.2, R * 0.24, L * 0.34, 12)), hueso)
    bone.position.y = L + L * 0.1
    const k1 = new THREE.Mesh(D(new THREE.SphereGeometry(R * 0.3, 14, 10)), hueso)
    k1.position.set(R * 0.14, L + L * 0.27, 0)
    const k2 = k1.clone()
    k2.position.x = -R * 0.14
    pata.add(bone, k1, k2)
    pata.rotation.z = -Math.PI / 2 + 0.05
    pata.position.set(-L * 0.45 + (i ? 0.1 : 0), R * 0.92, i * r * 0.5 - (n - 1) * r * 0.22)
    pata.rotation.y = (az() - 0.5) * 0.4 + (i ? 0.2 : 0)
    g.add(pata)
  }
  g.userData.alturaEn = () => r * 0.5
  return g
}

function pechuga(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.pechuga(THREE, D, c.semilla, '#eccb92')
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.2, roughness: 0.65 })
  const g = new THREE.Group()
  const n = p.gramos > 200 ? 4 : 3
  for (let i = 0; i < n; i++) {
    const forma = ovalo(c, r * 0.78, r * 0.52, { ruido: 0.04, afinar: 0.18 })
    const m = losa(c, forma, 0.035, 0.03, material)
    m.position.set((i - (n - 1) / 2) * r * 0.42, i * 0.026, (az() - 0.5) * 0.05)
    m.rotation.set(0, 0.5 + (az() - 0.5) * 0.15, -0.14)
    g.add(m)
  }
  g.rotation.y = -0.3
  g.userData.alturaEn = () => 0.12
  return g
}

function bife(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.parrilla(THREE, D, c.semilla, '#7a3f20')
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.8, roughness: 0.6 })
  const forma = ovalo(c, r * 1.1, r * 0.8, { ruido: 0.07, afinar: 0.1 })
  const m = losa(c, forma, 0.05, 0.04, material)
  m.rotation.y = -0.25 + (az() - 0.5) * 0.2
  const g = new THREE.Group()
  g.add(m)
  g.userData.alturaEn = () => 0.13
  return g
}

function hamburguesa(c, p) {
  const { THREE, D } = c
  const r = p.radio * 0.92
  const t = X.parrilla(THREE, D, c.semilla, '#6b3a1e')
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.8, roughness: 0.62 })
  const pts = [
    [0, 0],
    [r * 0.94, 0],
    [r, 0.03],
    [r * 1.01, 0.08],
    [r * 0.95, 0.125],
    [r * 0.6, 0.135],
    [0, 0.14],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  let geo = new THREE.LatheGeometry(pts, 48)
  uvPlano(THREE, geo, r * 2.1)
  D(geo)
  const g = new THREE.Group()
  const n = p.gramos > 200 ? 2 : 1
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(geo, material)
    m.position.set(i * 0.1, i * 0.14, i * 0.04)
    g.add(m)
  }
  g.userData.alturaEn = () => 0.14 * n
  return g
}

function escamas(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.pescado(THREE, D, c.semilla, p.color)
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 2.4, roughness: 0.55 })
  const g = monticulo(c, { r, h: r * 0.34, material, ruido: 0.2 })
  // Unos trozos más grandes arriba, como la lata abierta
  for (let i = 0; i < 4; i++) {
    let geo = new THREE.IcosahedronGeometry(r * 0.2, 3)
    const q = geo.attributes.position
    const f = az() * 6
    for (let k = 0; k < q.count; k++) {
      const x = q.getX(k)
      const y = q.getY(k)
      const z = q.getZ(k)
      const d = 1 + 0.2 * Math.sin(x * 14 + f) * Math.cos(z * 12 + f) + 0.12 * Math.sin(y * 17 + f)
      q.setXYZ(k, x * d * 1.2, y * d * 0.7, z * d)
    }
    geo.deleteAttribute('uv')
    geo = mergeVertices(geo, 1e-4)
    geo.computeVertexNormals()
    uvPlano(THREE, geo, r * 0.5)
    D(geo)
    const m = new THREE.Mesh(geo, material)
    const a = (i / 4) * TAU + az()
    const d = r * (0.1 + 0.38 * az())
    m.position.set(Math.cos(a) * d, g.userData.alturaEn(Math.cos(a) * d, Math.sin(a) * d) * 0.9 + r * 0.06, Math.sin(a) * d)
    m.rotation.y = az() * 6
    g.add(m)
  }
  return g
}

function pescado(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.pescado(THREE, D, c.semilla, p.color)
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.6, roughness: 0.5 })
  const forma = ovalo(c, r * 1.15, r * 0.6, { ruido: 0.05, afinar: 0.55 })
  const m = losa(c, forma, 0.045, 0.04, material)
  m.rotation.y = -0.3 + (az() - 0.5) * 0.2
  const g = new THREE.Group()
  g.add(m)
  const l = limon(c, r * 0.34)
  l.position.set(r * 0.78, 0, r * 0.58)
  l.rotation.y = -0.5
  g.add(l)
  g.userData.alturaEn = () => 0.11
  return g
}

function salchicha(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.embutido(THREE, D, c.semilla, p.color)
  const material = mate(c, { map: t.map, roughness: 0.45 }, true)
  material.clearcoat = 0.35
  const g = new THREE.Group()
  const n = p.gramos > 160 ? 3 : 2
  for (let i = 0; i < n; i++) {
    const geo = new THREE.CapsuleGeometry(r * 0.17, r * 1.5, 8, 20)
    D(geo)
    const m = new THREE.Mesh(geo, material)
    m.rotation.z = Math.PI / 2
    m.rotation.y = (az() - 0.5) * 0.25
    m.position.set(0, r * 0.17, (i - (n - 1) / 2) * r * 0.42)
    g.add(m)
  }
  g.rotation.y = -0.25
  g.userData.alturaEn = () => r * 0.34
  return g
}

function huevo(c, p) {
  const { THREE } = c
  const r = p.radio * 0.9
  const g = new THREE.Group()
  const clara = new THREE.Mesh(
    c.D(
      new THREE.ExtrudeGeometry(mancha(c, r, 0.16), {
        depth: 0.006,
        bevelEnabled: true,
        bevelThickness: 0.014,
        bevelSize: 0.016,
        bevelSegments: 4,
        curveSegments: 2,
      }),
    ),
    mate(c, { color: '#fffdf4', roughness: 0.18 }, true),
  )
  clara.geometry.rotateX(-Math.PI / 2)
  clara.geometry.translate(0, 0.014, 0)
  const yema = new THREE.Mesh(
    c.D(new THREE.SphereGeometry(r * 0.36, 28, 14, 0, TAU, 0, Math.PI / 2)),
    mate(c, { color: '#f3a91a', roughness: 0.15 }, true),
  )
  yema.scale.y = 0.65
  yema.position.set(r * 0.05, 0.026, 0)
  g.add(clara, yema)
  g.userData.alturaEn = () => r * 0.25
  return g
}

function fiambre(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const g = new THREE.Group()
  const material = mate(c, { color: p.color, roughness: 0.48, side: THREE.DoubleSide }, true)
  material.clearcoat = 0.2
  const n = 3
  for (let i = 0; i < n; i++) {
    const geo = new THREE.PlaneGeometry(r * 1.1, r * 1.1, 16, 16)
    const q = geo.attributes.position
    const f = az() * 6
    for (let k = 0; k < q.count; k++) {
      const x = q.getX(k)
      const y = q.getY(k)
      q.setZ(k, 0.035 * Math.sin(x * 13 + f) * Math.cos(y * 9 + f) + 0.04 * Math.sin(x * 5 + f))
    }
    geo.rotateX(-Math.PI / 2)
    geo.computeVertexNormals()
    D(geo)
    const m = new THREE.Mesh(geo, material)
    m.position.set((i - 1) * r * 0.3, 0.05 + i * 0.03, (az() - 0.5) * 0.1)
    m.rotation.y = (az() - 0.5) * 1.0
    g.add(m)
  }
  g.userData.alturaEn = () => 0.14
  return g
}

function porcion(c, p) {
  const { THREE, az, D } = c
  const r = p.radio * 1.45
  const t = X.gratinado(THREE, D, c.semilla, p.color)
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.5, roughness: 0.6 })
  const a = 0.95
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.absarc(0, 0, r, -a / 2, a / 2, false)
  s.lineTo(0, 0)
  const m = losa(c, s, 0.075, 0.02, material)
  m.rotation.y = 0.35 + (az() - 0.5) * 0.2
  m.position.x = -r * 0.45
  const g = new THREE.Group()
  g.add(m)
  g.userData.alturaEn = () => 0.12
  return g
}

function empanada(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.empanado(THREE, D, c.semilla, '#d9a050')
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.0, roughness: 0.65 })
  const g = new THREE.Group()
  const n = p.gramos > 150 ? 2 : 1
  for (let i = 0; i < n; i++) {
    const s = new THREE.Shape()
    s.absarc(0, 0, r * 0.95, 0, Math.PI, false)
    s.lineTo(r * 0.95, 0)
    const m = losa(c, s, 0.06, 0.05, material)
    const e = new THREE.Group()
    e.add(m)
    // El repulgue: bolitas alargadas siguiendo el borde curvo
    const bola = new THREE.SphereGeometry(r * 0.07, 10, 8)
    D(bola)
    for (let k = 0; k <= 16; k++) {
      const a = (k / 16) * Math.PI
      const b = new THREE.Mesh(bola, material)
      b.position.set(Math.cos(a) * r * 1.0, 0.1, -Math.sin(a) * r * 1.0)
      b.scale.set(1, 0.7, 1.4)
      b.rotation.y = a
      e.add(b)
    }
    e.position.set(i * r * 0.5 - (n - 1) * r * 0.25, 0, i * r * 0.3)
    e.rotation.y = (az() - 0.5) * 0.7 + i * 0.5
    g.add(e)
  }
  g.userData.alturaEn = () => 0.16
  return g
}

function galleta(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.empanado(THREE, D, c.semilla, p.color)
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.0, roughness: 0.8 })
  const geo = new THREE.CylinderGeometry(r * 0.5, r * 0.5, 0.045, 36)
  D(geo)
  const g = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(geo, material)
    m.position.set((i - 1) * r * 0.5, 0.03 + i * 0.02, (az() - 0.5) * 0.1)
    m.rotation.z = (az() - 0.5) * 0.15
    g.add(m)
  }
  g.userData.alturaEn = () => 0.1
  return g
}

// ---------- Acompañamientos ----------
function granosMonticulo(c, p, { largo, color, tamano, repetir, h, rug = 0.7 }) {
  const { THREE, D } = c
  const t = X.granos(THREE, D, c.semilla, { color, largo, tamano, repetir })
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 2.4, roughness: rug })
  return monticulo(c, { r: p.radio, h: p.radio * h, material, achatar: p.altoK ?? 1 })
}
const arroz = (c, p) => granosMonticulo(c, p, { largo: true, color: '#f6f0de', tamano: 2.1, repetir: 3.0, h: 0.58 })
function granos(c, p) {
  return granosMonticulo(c, p, { largo: false, color: p.color, tamano: 1.2, repetir: 2.6, h: 0.52 })
}
function legumbre(c, p) {
  return granosMonticulo(c, p, { largo: false, color: p.color, tamano: 1.9, repetir: 2.2, h: 0.5 })
}
function molido(c, p) {
  const { THREE, D } = c
  const t = X.molido(THREE, D, c.semilla, p.color)
  return monticulo(c, {
    r: p.radio,
    h: p.radio * 0.5,
    material: mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 3, roughness: 0.75 }),
    ruido: 0.1,
  })
}
function pure(c, p) {
  const { THREE, D } = c
  const t = X.pure(THREE, D, c.semilla, p.color)
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1.2, roughness: 0.5 }, true)
  material.sheen = 0.4
  return monticulo(c, { r: p.radio, h: p.radio * 0.62, material, ruido: 0.05, achatar: p.altoK ?? 1 })
}

function fideos(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const h = r * 0.55
  const g = new THREE.Group()
  const colores = [p.color, X.tono(p.color, 0.12), X.tono(p.color, -0.1)]
  const mats = colores.map((col) => mate(c, { color: col, roughness: 0.42 }, true))
  mats.forEach((m) => {
    m.clearcoat = 0.3
    m.clearcoatRoughness = 0.4
  })
  const grosor = Math.max(0.016, r * 0.045)
  const porMat = [[], [], []]
  const K = 26
  for (let k = 0; k < K; k++) {
    const capa = k % 3
    const R = r * (0.82 - capa * 0.2) * (0.9 + az() * 0.2)
    const cx = (az() - 0.5) * r * 0.25
    const cz = (az() - 0.5) * r * 0.25
    const a0 = az() * TAU
    const vueltas = 1.1 + az() * 1.1
    const sentido = az() > 0.5 ? 1 : -1
    const pts = []
    const pasos = 44
    for (let i = 0; i <= pasos; i++) {
      const u = i / pasos
      const a = a0 + sentido * u * vueltas * TAU
      const rad = R * (0.8 + 0.2 * Math.sin(u * 7 + k)) * (1 - 0.1 * Math.sin(u * 3))
      const x = cx + Math.cos(a) * rad
      const z = cz + Math.sin(a) * rad
      const d = Math.min(1, Math.hypot(x, z) / r)
      const y = grosor + h * (1 - d * d) * (0.55 + capa * 0.2) + grosor * 1.6 * capa + 0.012 * Math.sin(u * 20 + k)
      pts.push(new THREE.Vector3(x, y, z))
    }
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, grosor, 6, false)
    geo.deleteAttribute('uv')
    porMat[k % 3].push(geo)
  }
  porMat.forEach((lista, i) => {
    const geo = mergeGeometries(lista)
    D(geo)
    const m = new THREE.Mesh(geo, mats[i])
    g.add(m)
  })
  g.userData.alturaEn = (x, z) => {
    const d = Math.min(1, Math.hypot(x, z) / r)
    return grosor * 2 + h * (1 - d * d) * 0.95 + 0.04
  }
  return g
}

function almohadones(c, p) {
  const { THREE, D } = c
  const t = X.masa(THREE, D, c.semilla, p.color)
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 2, roughness: 0.55 })
  const geo = new RoundedBoxGeometry(0.24, 0.075, 0.24, 4, 0.035)
  return pila(c, { geo, n: 7, rad: 0.085, area: p.radio * 0.6, colores: ['#ffffff'], mat: material, inclinar: 0.12 })
}

function noquis(c, p) {
  const { THREE } = c
  const geo = new THREE.SphereGeometry(0.09, 16, 12)
  geo.scale(1.45, 0.64, 0.9)
  const material = mate(c, { color: '#ffffff', roughness: 0.6 })
  return pila(c, {
    geo,
    n: 30,
    rad: 0.085,
    area: p.radio * 0.5,
    colores: variantes(p, 0.1),
    mat: material,
    inclinar: 0.25,
    escala: [0.85, 1.12],
  })
}

function cubos(c, p) {
  const lado = Math.max(0.1, p.radio * 0.28)
  const geo = new RoundedBoxGeometry(lado, lado, lado, 4, lado * 0.2)
  const material = mate(c, { color: '#ffffff', roughness: 0.55 })
  const n = Math.max(6, Math.min(12, Math.round(p.gramos / 20)))
  return pila(c, {
    geo,
    n,
    rad: lado * 0.62,
    area: p.radio * 0.85,
    colores: variantes(p, 0.1),
    mat: material,
    inclinar: 0.15,
  })
}

function dados(c, p) {
  const lado = 0.075
  const geo = new RoundedBoxGeometry(lado, lado, lado, 3, 0.014)
  const material = mate(c, { color: '#ffffff', roughness: 0.5 })
  return pila(c, {
    geo,
    n: 24,
    rad: lado * 0.62,
    area: p.radio * 0.58,
    colores: variantes(p, 0.12),
    mat: material,
    inclinar: 0.4,
  })
}

function arvejas(c, p) {
  const { THREE } = c
  const r = 0.052
  const geo = new THREE.SphereGeometry(r, 16, 12)
  const material = mate(c, { color: '#ffffff', roughness: 0.32 }, true)
  material.clearcoat = 0.4
  return pila(c, {
    geo,
    n: 36,
    rad: r,
    area: p.radio * 0.7,
    colores: variantes(p, 0.12),
    mat: material,
    escala: [0.9, 1.1],
    yaw: false,
    alta: true,
  })
}
function bolitas(c, p) {
  const { THREE } = c
  const r = 0.07
  const geo = new THREE.SphereGeometry(r, 16, 12)
  const material = mate(c, { color: '#ffffff', roughness: 0.5 })
  return pila(c, {
    geo,
    n: 26,
    rad: r,
    area: p.radio * 0.7,
    colores: variantes(p, 0.1),
    mat: material,
    escala: [0.88, 1.12],
    yaw: false,
    alta: true,
  })
}
function bayas(c, p) {
  const { THREE } = c
  const r = 0.06
  const geo = new THREE.SphereGeometry(r, 16, 12)
  geo.scale(1, 1.1, 1)
  const material = mate(c, { color: '#ffffff', roughness: 0.3 }, true)
  material.clearcoat = 0.5
  return pila(c, {
    geo,
    n: 24,
    rad: r,
    area: p.radio * 0.6,
    colores: variantes(p, 0.1),
    mat: material,
    escala: [0.9, 1.2],
    yaw: false,
    alta: true,
  })
}
function nueces(c, p) {
  const { THREE } = c
  const geo = new THREE.SphereGeometry(0.05, 12, 10)
  geo.scale(1.25, 0.85, 0.85)
  const material = mate(c, { color: '#ffffff', roughness: 0.6 })
  return pila(c, {
    geo,
    n: 26,
    rad: 0.05,
    area: p.radio * 0.6,
    colores: variantes(p, 0.15),
    mat: material,
    inclinar: 0.5,
  })
}
function papitas(c, p) {
  const geo = new RoundedBoxGeometry(0.05, 0.05, 0.34, 2, 0.012)
  const material = mate(c, { color: '#ffffff', roughness: 0.6 })
  return pila(c, {
    geo,
    n: 28,
    rad: 0.06,
    area: p.radio * 0.55,
    colores: [p.color, '#f0c660', '#d89a30'],
    mat: material,
    inclinar: 0.25,
    escala: [0.8, 1.15],
  })
}

function pan(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.pan(THREE, D, c.semilla)
  const material = mate(c, { map: t.map, bumpMap: t.bump, bumpScale: 1, roughness: 0.8 })
  const w = r * 0.78
  const s = new THREE.Shape()
  s.moveTo(-w, -w)
  s.lineTo(w, -w)
  s.lineTo(w, w * 0.35)
  s.quadraticCurveTo(w * 1.18, w * 0.95, w * 0.5, w * 1.02)
  s.quadraticCurveTo(0, w * 1.12, -w * 0.5, w * 1.02)
  s.quadraticCurveTo(-w * 1.18, w * 0.95, -w, w * 0.35)
  s.closePath()
  const g = new THREE.Group()
  for (let i = 0; i < 2; i++) {
    const m = losa(c, s, 0.025, 0.02, material)
    m.position.set(i * r * 0.5, i * 0.05, i * -r * 0.35)
    m.rotation.y = (i ? 0.55 : -0.25) + (az() - 0.5) * 0.1
    g.add(m)
  }
  g.userData.alturaEn = () => 0.13
  return g
}

// ---------- Verduras ----------
function hojas(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const t = X.hoja(THREE, D, c.semilla)
  const g = new THREE.Group()
  const n = Math.max(8, Math.min(14, Math.round(8 + p.gramos / 12)))
  const mats = [p.color, X.tono(p.color, 0.18), X.tono(p.color, -0.14)].map((col) =>
    mate(c, { color: col, map: t.map, roughness: 0.5, side: THREE.DoubleSide }),
  )
  for (let i = 0; i < n; i++) {
    const L = r * (1.15 - 0.45 * (i / n)) * (0.85 + az() * 0.25)
    const W = L * 0.62
    const geo = new THREE.PlaneGeometry(W, L, 12, 16)
    const q = geo.attributes.position
    const ph = az() * 6
    for (let k = 0; k < q.count; k++) {
      const x = q.getX(k)
      const yy = q.getY(k) + L / 2
      const u = Math.min(1, Math.max(0, yy / L))
      const perfil = Math.max(0.04, Math.pow(Math.sin(Math.PI * Math.pow(u, 0.7)), 0.7))
      const ancho = x * perfil * 1.15
      const onda =
        0.022 * Math.sin(u * 26 + ph) * (Math.abs(ancho) / (W * 0.5)) + 0.035 * Math.sin(u * 5 + ph) * (Math.abs(ancho) / (W * 0.5))
      q.setXYZ(k, ancho, yy, onda + u * u * -L * 0.1 + Math.abs(ancho) * 0.35)
    }
    geo.computeVertexNormals()
    D(geo)
    const m = new THREE.Mesh(geo, mats[i % 3])
    const pivote = new THREE.Group()
    pivote.add(m)
    const capa = i / n
    const kk = p.altoK ?? 1
    m.rotation.x = -Math.PI / 2 + (0.25 + capa * 0.95) * kk
    pivote.rotation.y = (i / n) * TAU * 2.4 + az() * 0.4
    pivote.position.y = 0.025 + capa * 0.1 * kk
    pivote.position.x = Math.cos(pivote.rotation.y) * 0
    g.add(pivote)
  }
  g.userData.alturaEn = () => r * 0.5
  return g
}

function floretes(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const g = new THREE.Group()
  const verde = p.color
  const tallo = mate(c, { color: X.tono(verde, 0.5), roughness: 0.6 })
  const n = 3
  for (let i = 0; i < n; i++) {
    const R = r * (0.4 - i * 0.04)
    let geo = new THREE.IcosahedronGeometry(R, 4)
    const q = geo.attributes.position
    const f = az() * 6
    for (let k = 0; k < q.count; k++) {
      const x = q.getX(k)
      const y = q.getY(k)
      const z = q.getZ(k)
      const d = 1 + 0.2 * Math.sin(x * 38 + f) * Math.sin(y * 34 + f * 2) * Math.sin(z * 41 + f * 3) + 0.06 * Math.sin(x * 9 + y * 7 + f)
      q.setXYZ(k, x * d, y * d * 0.78, z * d)
    }
    geo.deleteAttribute('uv')
    geo = mergeVertices(geo, 1e-4)
    geo.computeVertexNormals()
    D(geo)
    const crown = new THREE.Mesh(geo, mate(c, { color: i % 2 ? X.tono(verde, 0.08) : verde, roughness: 0.78 }))
    const st = new THREE.Mesh(D(new THREE.CylinderGeometry(R * 0.28, R * 0.38, R * 1.1, 12)), tallo)
    const f1 = new THREE.Group()
    st.position.y = R * 0.45
    crown.position.y = R * 1.0
    f1.add(st, crown)
    const a = (i / n) * TAU + 0.5
    f1.position.set(Math.cos(a) * r * 0.32, 0, Math.sin(a) * r * 0.32)
    f1.rotation.y = az() * 6
    g.add(f1)
  }
  g.userData.alturaEn = () => r * 0.9
  return g
}

function tiras(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const g = new THREE.Group()
  const n = Math.max(4, Math.min(8, Math.round(3 + p.gramos / 16)))
  const largo = /chaucha|esparrago|puerro|verdeo|apio/.test(
    String(p.nombre || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, ''),
  )
  for (let i = 0; i < n; i++) {
    const L = r * (largo ? 1.5 : 1.0) * (0.85 + az() * 0.3)
    const curva = largo ? 0.05 : 0.25
    const a = (az() - 0.5) * 1.2
    const pts = [-1, -0.33, 0.33, 1].map((u, k) => new THREE.Vector3(u * L * 0.5, 0, Math.sin(k * 1.2 + i) * L * curva))
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, largo ? 0.022 : 0.035, 6, false)
    D(geo)
    const m = new THREE.Mesh(geo, mate(c, { color: i % 2 ? p.color : X.tono(p.color, 0.1), roughness: 0.4 }, true))
    if (!largo) m.scale.y = 0.45
    m.rotation.y = a + (i % 2 ? 0.5 : -0.4)
    m.position.set((az() - 0.5) * r * 0.3, 0.03 + (i % 3) * 0.04, (az() - 0.5) * r * 0.3)
    g.add(m)
  }
  g.userData.alturaEn = () => 0.12
  return g
}

function aros(c, p) {
  const { THREE, az, D } = c
  const r = p.radio
  const g = new THREE.Group()
  const n = 6
  const rad = r * 0.4
  const geo = new THREE.TorusGeometry(rad, rad * 0.26, 10, 32)
  D(geo)
  const mat = mate(c, { color: p.color, roughness: 0.45 }, true)
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(geo, mat)
    m.rotation.x = Math.PI / 2 + (az() - 0.5) * 0.3
    m.rotation.z = (az() - 0.5) * 0.3
    const a = az() * TAU
    m.position.set(Math.cos(a) * r * 0.35, rad * 0.26 + (i % 3) * rad * 0.4, Math.sin(a) * r * 0.35)
    g.add(m)
  }
  g.userData.alturaEn = () => rad
  return g
}

// ---------- Salsas, huevo y espolvoreo ----------
// `base`: la pieza sobre la que va (para saber a qué altura), si hay
export function salsa(c, p, base) {
  const { THREE } = c
  const encima = !!base && !base.debajo
  const r = base ? (encima ? Math.min(base.radio * 0.7, 0.4) : base.radio * 0.82) : p.radio * 0.8
  const material = mate(c, { color: p.color, roughness: 0.22 }, true)
  material.clearcoat = 0.8
  material.clearcoatRoughness = 0.15
  const g = new THREE.Group()
  const geo = new THREE.ExtrudeGeometry(mancha(c, r * (encima ? 0.78 : 1), 0.2), {
    depth: encima ? 0.02 : 0.008,
    bevelEnabled: true,
    bevelThickness: encima ? 0.022 : 0.012,
    bevelSize: encima ? 0.06 : 0.014,
    bevelSegments: 6,
    curveSegments: 3,
  })
  c.D(geo)
  geo.rotateX(-Math.PI / 2)
  const m = new THREE.Mesh(geo, material)
  m.position.y = encima ? (base.alturaEn?.(0, 0) ?? 0) - 0.005 : 0.012
  g.add(m)
  return g
}

export function espolvoreo(c, p, base) {
  const { THREE, az, D } = c
  const n = 150
  const geo = new THREE.IcosahedronGeometry(0.016, 0)
  D(geo)
  const im = new THREE.InstancedMesh(geo, mate(c, { color: '#ffffff', roughness: 0.7 }), n)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const col = new THREE.Color()
  const R = (base?.radio ?? p.radio) * 0.78
  for (let i = 0; i < n; i++) {
    const a = az() * TAU
    const d = Math.sqrt(az()) * R
    const x = Math.cos(a) * d
    const z = Math.sin(a) * d
    const y = (base?.alturaEn?.(x, z) ?? 0) + 0.012
    e.set(az() * 6, az() * 6, az() * 6)
    q.setFromEuler(e)
    const s = 0.7 + az() * 0.9
    m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s, s * 0.6, s))
    im.setMatrixAt(i, m)
    col.set(az() > 0.3 ? p.color : X.tono(p.color, -0.12))
    im.setColorAt(i, col)
  }
  const g = new THREE.Group()
  g.add(im)
  return g
}

export const PIEZAS = {
  milanesa,
  muslo,
  pechuga,
  bife,
  hamburguesa,
  escamas,
  pescado,
  salchicha,
  huevo,
  fiambre,
  porcion,
  empanada,
  galleta,
  arroz,
  granos,
  legumbre,
  molido,
  pure,
  fideos,
  almohadones,
  noquis,
  cubos,
  dados,
  arvejas,
  bolitas,
  bayas,
  nueces,
  papitas,
  pan,
  hojas,
  floretes,
  tiras,
  aros,
  rodajas,
}

// Qué se dibuja en un plato y dónde (1.26). Funciones puras (sin three.js), para probarlas.
//
// Cada ingrediente se vuelve UNA pieza reconocible (una milanesa, un montículo de arroz, un nido de fideos, una cama de hojas...)
// y las piezas se acomodan en el plato como las pondría un cocinero: lo principal, el acompañamiento y la verdura. Las salsas
// van sobre los fideos o el arroz y lo que se espolvorea (queso rallado), por arriba.
import { azar, semillaDe } from '../comida.js'

const sin = (t) =>
  String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// Qué pieza dibuja cada ingrediente: depende de la forma (lib/plato.js) y, para afinar, del nombre
export function claveDe(t) {
  const n = sin(t.nombre)
  switch (t.forma) {
    case 'filete':
      return /milanesa|rebozad|empanizad|nugget|supremas?/.test(n) ? 'milanesa' : 'pescado'
    case 'trozo':
      if (/pata|muslo|alita|contramuslo/.test(n)) return 'muslo'
      if (/pollo|pechuga|pavo/.test(n)) return 'pechuga'
      if (/atun|caballa|sardina|salmon|merluza|pescado/.test(n)) return 'escamas'
      return 'bife'
    case 'medallon':
      if (/empanada/.test(n)) return 'empanada'
      if (/nugget/.test(n)) return 'milanesa'
      if (/galletit|alfajor|oreo|barrita|sushi/.test(n)) return 'galleta'
      return 'hamburguesa'
    case 'salchicha':
      return 'salchicha'
    case 'cuna':
      return 'porcion'
    case 'rodaja':
      if (/huevo|clara/.test(n)) return 'huevo'
      if (/jamon|paleta|fiambre|salame|mortadela|pavo/.test(n)) return 'fiambre'
      return 'rodajas'
    case 'grano':
      return /quinoa|cuscus/.test(n) ? 'granos' : 'arroz'
    case 'lenteja':
    case 'poroto':
      return 'legumbre'
    case 'esfera':
      return /garbanzo|aceituna|uva|granada|ciruela|higo|ajo/.test(n) ? 'bolitas' : 'arvejas'
    case 'baya':
      return 'bayas'
    case 'pasta':
      return 'fideos'
    case 'cubo':
      if (/pure/.test(n)) return 'pure'
      if (/noqui/.test(n)) return 'noquis'
      if (/ravio/.test(n)) return 'almohadones'
      return 'cubos'
    case 'cubito':
      return 'dados'
    case 'hoja':
      return 'hojas'
    case 'floret':
      return 'floretes'
    case 'tira':
      return 'tiras'
    case 'aro':
      return 'aros'
    case 'pan':
      return 'pan'
    case 'migaja':
      return /rallad|sardo|reggianito|chia|lino|girasol|sesamo|granola|avena|copos|cereal/.test(n) ? 'espolvoreo' : 'molido'
    case 'nuez':
      return 'nueces'
    case 'mancha':
      return 'salsa'
    case 'chip':
      return 'papitas'
    default:
      return 'cubos'
  }
}

const ROL = {
  proteina: new Set([
    'milanesa',
    'muslo',
    'pechuga',
    'bife',
    'pescado',
    'escamas',
    'hamburguesa',
    'empanada',
    'salchicha',
    'porcion',
    'huevo',
    'fiambre',
  ]),
  base: new Set(['arroz', 'granos', 'legumbre', 'pure', 'fideos', 'almohadones', 'noquis', 'molido', 'papitas', 'pan']),
  salsa: new Set(['salsa']),
  encima: new Set(['espolvoreo']),
}
export const rolDe = (clave) =>
  ROL.proteina.has(clave)
    ? 'proteina'
    : ROL.base.has(clave)
      ? 'base'
      : ROL.salsa.has(clave)
        ? 'salsa'
        : ROL.encima.has(clave)
          ? 'encima'
          : 'verdura'

// Radio (de lo que ocupa en el plato) según la pieza y los gramos: crece despacio, entre un mínimo y un máximo
const TAM = {
  milanesa: [0.5, 0.62, 160],
  muslo: [0.4, 0.55, 150],
  pechuga: [0.42, 0.58, 150],
  bife: [0.42, 0.58, 160],
  pescado: [0.45, 0.6, 150],
  escamas: [0.3, 0.42, 100],
  hamburguesa: [0.36, 0.46, 110],
  empanada: [0.3, 0.42, 100],
  salchicha: [0.4, 0.5, 120],
  porcion: [0.5, 0.62, 150],
  huevo: [0.28, 0.4, 60],
  fiambre: [0.28, 0.4, 50],
  arroz: [0.4, 0.58, 120],
  granos: [0.36, 0.52, 100],
  legumbre: [0.34, 0.5, 110],
  pure: [0.4, 0.55, 150],
  fideos: [0.46, 0.6, 120],
  almohadones: [0.38, 0.52, 120],
  noquis: [0.4, 0.54, 120],
  molido: [0.3, 0.44, 100],
  papitas: [0.34, 0.46, 100],
  pan: [0.3, 0.42, 60],
  hojas: [0.4, 0.56, 80],
  floretes: [0.3, 0.44, 80],
  rodajas: [0.3, 0.44, 80],
  arvejas: [0.26, 0.38, 60],
  bolitas: [0.26, 0.38, 60],
  bayas: [0.26, 0.38, 60],
  tiras: [0.28, 0.4, 60],
  aros: [0.26, 0.36, 50],
  dados: [0.24, 0.34, 40],
  cubos: [0.3, 0.46, 100],
  nueces: [0.22, 0.32, 30],
  salsa: [0.3, 0.46, 80],
  espolvoreo: [0.2, 0.3, 20],
}
export function radioDe(clave, gramos) {
  const [min, max, ref] = TAM[clave] || [0.3, 0.45, 80]
  const k = Math.pow(Math.max(0.2, (gramos || ref) / ref), 0.35)
  return Math.max(min, Math.min(max, min + (max - min) * (k - 0.6) * 1.2))
}

// Dónde va cada pieza principal, según cuántas son (x: derecha, z: hacia quien mira). Proteína atrás a la izquierda, base a la derecha,
// verduras adelante.
const PUESTOS = {
  1: [[0, 0.05]],
  2: [
    [-0.46, -0.05],
    [0.5, 0.08],
  ],
  3: [
    [-0.5, -0.22],
    [0.52, -0.12],
    [0.0, 0.5],
  ],
  4: [
    [-0.55, -0.28],
    [0.52, -0.3],
    [-0.28, 0.52],
    [0.5, 0.42],
  ],
  5: [
    [-0.58, -0.3],
    [0.5, -0.38],
    [-0.45, 0.45],
    [0.08, 0.62],
    [0.6, 0.35],
  ],
}

// `trozos`: [{ nombre, gramos, forma, color }] (lib/plato.js trozosDeReceta). Devuelve las piezas ya ubicadas:
// [{ clave, rol, nombre, color, gramos, radio, x, z, giro, sobre: índice de la pieza sobre la que va (salsa, espolvoreo) | -1 }]
export function componer(trozos, semilla = 1, { cama = false } = {}) {
  const az = azar(semilla)
  const todos = (trozos || [])
    .filter((t) => t.forma !== 'gota' && t.gramos > 0)
    .map((t) => ({ ...t, clave: claveDe(t) }))
    .map((t) => ({ ...t, rol: rolDe(t.clave) }))
  const de = (rol) => todos.filter((t) => t.rol === rol)
  const cuerpo = []
  // Un mismo tipo de pieza no se repite (dos verduras en rodajas se juntan en una): gana la de más gramos
  const vistos = new Set()
  for (const t of [...de('proteina'), ...de('base'), ...de('verdura')]) {
    if (vistos.has(t.clave)) {
      // Dos ingredientes que se dibujan igual (arvejas y choclo) van mezclados en la misma pieza
      const ya = cuerpo.find((x) => x.clave === t.clave)
      ya.gramos += t.gramos
      ya.colores = [...(ya.colores || [ya.color]), t.color]
      continue
    }
    vistos.add(t.clave)
    cuerpo.push({ ...t })
  }
  // Máximo cinco piezas en el plato: se quedan las de más gramos, pero siempre una proteína y una base si hay
  let piezas = cuerpo
  if (piezas.length > 5) {
    const mas = [...cuerpo].sort((a, b) => b.gramos - a.gramos)
    const quedan = new Set(mas.slice(0, 5))
    for (const rol of ['proteina', 'base']) {
      const una = cuerpo.find((t) => t.rol === rol)
      if (una && !quedan.has(una)) {
        quedan.delete([...quedan].pop())
        quedan.add(una)
      }
    }
    piezas = cuerpo.filter((t) => quedan.has(t))
  }
  const orden = { proteina: 0, base: 1, verdura: 2 }
  piezas.sort((a, b) => orden[a.rol] - orden[b.rol] || b.gramos - a.gramos)
  const puestos = PUESTOS[Math.max(1, Math.min(5, piezas.length))] || PUESTOS[1]
  // Con pocas piezas, cada una se ve más grande (el plato no queda vacío)
  const agrandar = { 1: 1.55, 2: 1.3, 3: 1.12, 4: 1, 5: 0.94 }[Math.max(1, Math.min(5, piezas.length))] || 1
  const lista = piezas.map((t, i) => ({
    clave: t.clave,
    rol: t.rol,
    nombre: t.nombre,
    color: t.color,
    colores: t.colores || [t.color],
    gramos: t.gramos,
    radio: Math.min(0.88, radioDe(t.clave, t.gramos) * agrandar),
    x: puestos[i]?.[0] ?? 0,
    z: puestos[i]?.[1] ?? 0,
    giro: (az() - 0.5) * 0.5,
    sobre: -1,
  }))
  // En un bowl hay una cama (arroz, quinoa, hojas...) que llena el fondo y lo demás va encima, en rueda
  if (cama && lista.length >= 2) {
    let i = lista.findIndex((p) => p.rol === 'base' && !['pan', 'papitas'].includes(p.clave))
    if (i < 0) i = lista.findIndex((p) => p.clave === 'hojas')
    if (i >= 0) {
      lista[i].radio = 0.92
      lista[i].x = lista[i].z = 0
      lista[i].cama = true
      lista[i].altoK = 0.55
      const otras = lista.filter((_, k) => k !== i)
      otras.forEach((p, k) => {
        const a = -2.3 + (k / otras.length) * Math.PI * 2
        p.x = Math.cos(a) * 0.5
        p.z = Math.sin(a) * 0.5
        p.radio = Math.min(p.radio, 0.34) * 0.9
        p.enCama = true
      })
    }
  }
  // Salsas y espolvoreos: encima de los fideos o el arroz (o de lo que haya), si no, un charquito al lado
  const sitioPara = (preferidas) => {
    for (const k of preferidas) {
      const i = lista.findIndex((p) => p.clave === k)
      if (i >= 0) return i
    }
    return -1
  }
  const extras = [...de('salsa'), ...de('encima')].slice(0, 3)
  for (const t of extras) {
    const sobre = sitioPara(
      t.rol === 'salsa'
        ? ['fideos', 'almohadones', 'noquis', 'arroz', 'granos', 'legumbre', 'pure', 'milanesa']
        : ['fideos', 'arroz', 'almohadones', 'noquis', 'pure', 'granos', 'legumbre', 'hojas', 'molido'],
    )
    const base = {
      clave: t.clave,
      rol: t.rol,
      nombre: t.nombre,
      color: t.color,
      gramos: t.gramos,
      radio: radioDe(t.clave, t.gramos),
      giro: az() * 6.28,
    }
    if (sobre >= 0 && !lista.some((p) => p.sobre === sobre && p.clave === t.clave))
      lista.push({
        ...base,
        x: lista[sobre].x,
        z: lista[sobre].z,
        sobre,
        debajo: ['noquis', 'almohadones'].includes(lista[sobre].clave) && t.rol === 'salsa',
      })
    else lista.push({ ...base, x: lista.length ? 0.05 : 0, z: lista.length ? 0.88 : 0, sobre: -1 })
  }
  if (!lista.some((p) => p.cama)) separar(lista)
  else for (const p of lista) if (p.sobre >= 0) ((p.x = lista[p.sobre].x), (p.z = lista[p.sobre].z))
  return lista
}

// Aleja las piezas que se pisan y las mantiene dentro del plato (las que van sobre otra no se mueven solas)
export function separar(lista, rPlato = 1.02) {
  const libres = lista.filter((p) => p.sobre < 0)
  for (let vuelta = 0; vuelta < 60; vuelta++) {
    for (let i = 0; i < libres.length; i++)
      for (let j = i + 1; j < libres.length; j++) {
        const a = libres[i]
        const b = libres[j]
        const dx = b.x - a.x
        const dz = b.z - a.z
        const d = Math.hypot(dx, dz) || 0.001
        const min = (a.radio + b.radio) * 0.86
        if (d < min) {
          const f = (min - d) / 2
          a.x -= (dx / d) * f
          a.z -= (dz / d) * f
          b.x += (dx / d) * f
          b.z += (dz / d) * f
        }
      }
    for (const p of libres) {
      const d = Math.hypot(p.x, p.z)
      const tope = Math.max(0.05, rPlato - p.radio * 0.55)
      if (d > tope) {
        p.x *= tope / d
        p.z *= tope / d
      }
    }
  }
  // Lo que va encima sigue a su pieza
  for (const p of lista)
    if (p.sobre >= 0) {
      p.x = lista[p.sobre].x
      p.z = lista[p.sobre].z
    }
  return lista
}

export { semillaDe }

// Lector de archivos FIT (1.31, F-22b): el formato binario de Garmin, Coros, Wahoo, Suunto y Polar. De todo lo que trae
// un .fit (cada segundo del recorrido) solo se leen los resúmenes de cada sesión ("session"): cuándo empezó, el deporte,
// la duración, la distancia, el desnivel, el pulso promedio y las calorías. Sin librerías; sigue el SDK público de FIT.
// Devuelve las mismas "actividades" que lib/importarEntrenos.js.

const EPOCA_FIT = 631065600 // segundos entre 1970-01-01 y 1989-12-31, desde donde cuenta FIT

// Tipos base: tamaño, cómo se lee y cuál es el valor "no hay dato"
const TIPOS = {
  0x00: [1, 'u8', 0xff],
  0x01: [1, 's8', 0x7f],
  0x02: [1, 'u8', 0xff],
  0x83: [2, 's16', 0x7fff],
  0x84: [2, 'u16', 0xffff],
  0x85: [4, 's32', 0x7fffffff],
  0x86: [4, 'u32', 0xffffffff],
  0x07: [1, 'str', null],
  0x88: [4, 'f32', null],
  0x89: [8, 'f64', null],
  0x0a: [1, 'u8', 0],
  0x8b: [2, 'u16', 0],
  0x8c: [4, 'u32', 0],
  0x0d: [1, 'byte', null],
}

// Nombres de deporte y subdeporte de FIT (los que sirven para reconocer la actividad, ver slugDeDeporte)
const DEPORTES = {
  1: 'running',
  2: 'cycling',
  4: 'elliptical',
  5: 'swimming',
  6: 'basketball',
  7: 'soccer',
  8: 'tennis',
  10: 'training',
  11: 'walking',
  13: 'alpine ski',
  14: 'snowboard',
  15: 'rowing',
  16: 'hike',
  17: 'hike',
  19: 'paddle',
  20: 'flying',
  21: 'e-bike',
  25: 'golf',
  31: 'rock climbing',
  37: 'stand up paddle',
  38: 'surf',
  41: 'kayak',
  43: 'skate',
  62: 'hiit',
}
const SUBDEPORTES = {
  1: 'treadmill',
  3: 'trail run',
  6: 'indoor cycling',
  8: 'mountain bike',
  15: 'elliptical',
  16: 'stair climbing',
  20: 'strength training',
  26: 'indoor rowing',
}

function leerCampo(vista, pos, tamano, base, chico) {
  const tipo = TIPOS[base] || TIPOS[base & 0x1f] || [1, 'byte', null]
  const [t, como, invalido] = tipo
  // Campos que son listas (tamaño mayor al del tipo): se lee el primero
  if (tamano < t) return null
  let v
  switch (como) {
    case 'u8':
      v = vista.getUint8(pos)
      break
    case 's8':
      v = vista.getInt8(pos)
      break
    case 'u16':
      v = vista.getUint16(pos, chico)
      break
    case 's16':
      v = vista.getInt16(pos, chico)
      break
    case 'u32':
      v = vista.getUint32(pos, chico)
      break
    case 's32':
      v = vista.getInt32(pos, chico)
      break
    case 'f32':
      v = vista.getFloat32(pos, chico)
      break
    case 'f64':
      v = vista.getFloat64(pos, chico)
      break
    case 'str': {
      let s = ''
      for (let i = 0; i < tamano; i++) {
        const c = vista.getUint8(pos + i)
        if (c === 0) break
        s += String.fromCharCode(c)
      }
      try {
        return decodeURIComponent(escape(s))
      } catch {
        return s
      }
    }
    default:
      return null
  }
  return invalido !== null && v === invalido ? null : v
}

// Recorre el archivo y devuelve los mensajes "session" (18) como objetos { numeroDeCampo: valor }
export function sesionesFit(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  const vista = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (bytes.length < 14) return []
  const largoEncabezado = bytes[0]
  if (largoEncabezado < 12 || String.fromCharCode(...bytes.slice(8, 12)) !== '.FIT') return []
  const largoDatos = vista.getUint32(4, true)
  const fin = Math.min(bytes.length, largoEncabezado + largoDatos)
  const definiciones = new Map()
  const sesiones = []
  let pos = largoEncabezado
  while (pos < fin) {
    const cab = bytes[pos++]
    let local
    let esDefinicion = false
    let conDesarrollador = false
    if (cab & 0x80) {
      // Encabezado con la hora comprimida: siempre es un mensaje de datos
      local = (cab >> 5) & 0x03
    } else {
      esDefinicion = !!(cab & 0x40)
      conDesarrollador = !!(cab & 0x20)
      local = cab & 0x0f
    }
    if (esDefinicion) {
      if (pos + 5 > fin) break
      const chico = bytes[pos + 1] === 0
      const global = vista.getUint16(pos + 2, chico)
      const n = bytes[pos + 4]
      pos += 5
      const campos = []
      for (let i = 0; i < n; i++) {
        campos.push({ num: bytes[pos], tamano: bytes[pos + 1], base: bytes[pos + 2] })
        pos += 3
      }
      let extra = 0
      if (conDesarrollador) {
        const nd = bytes[pos++]
        for (let i = 0; i < nd; i++) {
          extra += bytes[pos + 1]
          pos += 3
        }
      }
      definiciones.set(local, { global, chico, campos, extra })
      continue
    }
    const def = definiciones.get(local)
    if (!def) break // archivo roto: un dato sin su definición
    const valores = {}
    for (const c of def.campos) {
      if (pos + c.tamano > fin) return sesiones
      if (def.global === 18) valores[c.num] = leerCampo(vista, pos, c.tamano, c.base, def.chico)
      pos += c.tamano
    }
    pos += def.extra
    if (def.global === 18) sesiones.push(valores)
  }
  return sesiones
}

// Las actividades de un archivo FIT (una por sesión; un triatlón trae varias)
export function leerFit(buffer, archivo = '') {
  return sesionesFit(buffer)
    .map((s) => {
      const inicio = s[2] != null ? new Date((s[2] + EPOCA_FIT) * 1000) : null
      const segundos = (s[8] ?? s[7] ?? 0) / 1000
      if (!inicio || !(segundos > 0)) return null
      const deporte = [DEPORTES[s[5]], SUBDEPORTES[s[6]]].filter(Boolean).join(' ')
      return {
        origen: 'archivo',
        ref: `fit-${inicio.getTime()}`,
        nombre: archivo.replace(/\.[^.]+$/, ''),
        deporte: SUBDEPORTES[s[6]] || DEPORTES[s[5]] || deporte,
        inicio: inicio.toISOString(),
        minutos: Math.round(segundos / 60),
        distanciaKm: s[9] > 0 ? Math.round(s[9] / 1000) / 100 : null,
        desnivelM: s[22] > 0 ? s[22] : null,
        pulso: s[16] >= 30 && s[16] <= 230 ? s[16] : null,
        kcal: s[11] > 0 ? s[11] : null,
      }
    })
    .filter(Boolean)
}

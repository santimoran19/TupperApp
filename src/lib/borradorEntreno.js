// Borrador de la sesión de gimnasio en curso. Se guarda en el teléfono a medida que se carga, así un cierre de la app, una
// llamada o una recarga no hacen perder la sesión. Es solo de ese dispositivo y se borra al guardar o descartar.
// Todo está en try/catch: el navegador puede no dejar usar el almacenamiento (modo privado, datos bloqueados).

const VERSION = 1
const MAX_CARACTERES = 200_000
// Un borrador de más de este tiempo ya no se ofrece retomar (una sesión no dura más de un día)
const MAX_EDAD_MS = 2 * 24 * 60 * 60 * 1000

export const claveBorrador = (uid) => `tupper:entreno-borrador:${uid}`

const almacenPorDefecto = () => {
  try {
    return globalThis.localStorage || null
  } catch {
    return null
  }
}

const esObjeto = (x) => x !== null && typeof x === 'object' && !Array.isArray(x)

// Revisa la forma de lo leído: un borrador roto o de otra versión se descarta en vez de romper la pantalla
function validar(b, ahora) {
  if (!esObjeto(b) || b.version !== VERSION || !Array.isArray(b.sesion) || typeof b.fecha !== 'string') return null
  if (typeof b.guardado !== 'number' || ahora - b.guardado > MAX_EDAD_MS) return null
  const sesion = []
  for (const ej of b.sesion) {
    if (!esObjeto(ej) || typeof ej.exercise_id !== 'string' || typeof ej.clave !== 'string' || !Array.isArray(ej.series)) return null
    const series = ej.series.filter(esObjeto).map((s) => ({
      clave: String(s.clave ?? ''),
      reps: String(s.reps ?? ''),
      weight_kg: String(s.weight_kg ?? ''),
      rpe: String(s.rpe ?? ''),
      warmup: !!s.warmup,
      hecha: !!s.hecha,
    }))
    sesion.push({ clave: ej.clave, exercise_id: ej.exercise_id, descanso: Number(ej.descanso) > 0 ? Number(ej.descanso) : null, series })
  }
  return {
    version: VERSION,
    guardado: b.guardado,
    fecha: b.fecha,
    inicio: typeof b.inicio === 'number' ? b.inicio : b.guardado,
    rutina: typeof b.rutina === 'string' ? b.rutina : null,
    nombre: typeof b.nombre === 'string' ? b.nombre : '',
    editando: typeof b.editando === 'string' ? b.editando : null,
    notas: typeof b.notas === 'string' ? b.notas : '',
    sesion,
  }
}

// El borrador guardado, o null si no hay (o no sirve)
export function leerBorrador(uid, { almacen = almacenPorDefecto(), ahora = Date.now() } = {}) {
  try {
    const texto = almacen?.getItem(claveBorrador(uid))
    if (!texto) return null
    return validar(JSON.parse(texto), ahora)
  } catch {
    return null
  }
}

// Guarda el borrador. Una sesión sin ningún ejercicio no se guarda (y borra el que hubiera). Devuelve true si quedó guardado.
export function guardarBorrador(uid, datos, { almacen = almacenPorDefecto(), ahora = Date.now() } = {}) {
  try {
    if (!almacen) return false
    if (!datos.sesion || datos.sesion.length === 0) {
      almacen.removeItem(claveBorrador(uid))
      return false
    }
    const texto = JSON.stringify({ ...datos, version: VERSION, guardado: ahora })
    if (texto.length > MAX_CARACTERES) return false
    almacen.setItem(claveBorrador(uid), texto)
    return true
  } catch {
    return false
  }
}

export function borrarBorrador(uid, { almacen = almacenPorDefecto() } = {}) {
  try {
    almacen?.removeItem(claveBorrador(uid))
  } catch {
    // sin almacenamiento no hay nada que borrar
  }
}

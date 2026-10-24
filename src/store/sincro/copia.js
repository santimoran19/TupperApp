// La copia en el teléfono (IndexedDB, ver ../local.js) vista desde la sincronización: la foto de los datos y las escrituras
// en orden. La foto se guarda un momento después del último cambio (no en cada uno) y al salir de la app. Junto con los
// datos va hasta qué cambio de la cola tienen aplicado: si la app se cierra antes de guardarla, al abrir se aplican los
// que falten. `s` es el estado compartido de la sincronización (cerrado, numero). Ver ../sincronizacion.js.
import { cambiarLocal, guardarLocal } from '../local'

const ESPERA_FOTO_MS = 300 // así varios toques seguidos se guardan juntos
export const FORMA = 1 // forma de la foto: si cambia lo que lleva adentro, se sube el número y las viejas no se usan

export function crearCopia(uid, s, anotaciones) {
  const claves = { foto: `foto:${uid}`, cola: `cola:${uid}`, descartados: `descartados:${uid}` }
  let escrituras = Promise.resolve() // lo que se le pide a la cola del teléfono va de a uno y en orden
  let relojFoto = null
  let fotoPendiente = null

  function guardarFoto(e) {
    if (s.cerrado || e.cargando || e.errorCarga) return
    fotoPendiente = { e, hasta: s.numero }
    if (!relojFoto) relojFoto = setTimeout(escribirFoto, ESPERA_FOTO_MS)
  }
  function escribirFoto() {
    clearTimeout(relojFoto)
    relojFoto = null
    if (!fotoPendiente || s.cerrado) return
    const {
      e: { cargando: _c, errorCarga: _e, ...datos },
      hasta,
    } = fotoPendiente
    fotoPendiente = null
    guardarLocal(claves.foto, { forma: FORMA, datos, hasta, cuando: Math.max(Date.now(), anotaciones.borradoHasta() + 1) }).catch(() => {})
  }
  // Al cerrar sesión: la foto que estaba por guardarse ya no se guarda
  function olvidarFoto() {
    clearTimeout(relojFoto)
    relojFoto = null
    fotoPendiente = null
  }

  // Lo que se le pide a la cola del teléfono va en fila, para que quede en el mismo orden en que se pidió
  function enOrden(fn) {
    const esta = escrituras.then(fn)
    escrituras = esta.catch(() => {})
    return esta
  }
  // Un cambio sobre algo guardado en el teléfono. Después de cerrar sesión ya no se escribe nada (quedaría ahí).
  const cambiarGuardado = (clave, cambio) => enOrden(() => (s.cerrado ? undefined : cambiarLocal(clave, cambio)))

  return { claves, guardarFoto, escribirFoto, olvidarFoto, enOrden, cambiarGuardado }
}

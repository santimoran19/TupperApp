// Solo una pestaña manda la cola por vez (Web Locks: `navigator.locks`, que también tiene el service worker). Si otra la
// está mandando, devuelve 'ocupada'. A `fn` le pasa un permiso: si otra pestaña le saca el turno, `permiso.vale` pasa a
// false y tiene que parar. El turno se le saca a otra solo si quedó congelada: lo tiene hace rato y hace rato que no da
// un paso (cada pedido tarda, como mucho, 45 segundos). Ver ../sincronizacion.js.
export const nombreDelCandado = (uid) => `tupper-cola:${uid}`

export function crearCandado(uid, anotaciones) {
  let ocupadaDesde = 0 // desde cuándo otra pestaña tiene el turno para mandar la cola
  return async function conCandado(fn) {
    const permiso = { vale: true }
    if (!navigator.locks?.request) return fn(permiso)
    let corrio = false
    const robar = ocupadaDesde > 0 && Date.now() - ocupadaDesde > anotaciones.ROBAR_MS && anotaciones.sinLatido()
    try {
      const fin = await navigator.locks.request(nombreDelCandado(uid), robar ? { steal: true } : { ifAvailable: true }, (candado) => {
        corrio = true
        if (!candado) return 'ocupada'
        ocupadaDesde = 0
        return fn(permiso)
      })
      if (fin === 'ocupada') ocupadaDesde = ocupadaDesde || Date.now()
      return fin
    } catch (err) {
      // Otra pestaña le sacó el turno a esta
      if (err?.name === 'AbortError') {
        permiso.vale = false
        return 'ocupada'
      }
      // El navegador no deja usar candados (pasa con el almacenamiento bloqueado): se manda sin candado
      if (!corrio) return fn(permiso)
      throw err
    }
  }
}

// Copia en el teléfono: la última foto de los datos y los cambios hechos sin conexión que todavía no se mandaron.
// Va en IndexedDB, la base que trae el navegador, y la comparten todas las pestañas abiertas de la app.
// Todas las funciones pueden fallar (modo privado, sin lugar, el navegador cerró la base): tiran el error y quien las
// llama decide qué hacer. Ninguna se queda esperando para siempre.
const BASE = 'tupper'
const ALMACEN = 'copia'
// Hay navegadores donde IndexedDB a veces no contesta nunca: pasado este tiempo se da por fallado
const LIMITE_MS = 2500
let abierta = null

function abrir() {
  if (abierta) return abierta
  const intento = new Promise((listo, fallo) => {
    const pedido = indexedDB.open(BASE, 1)
    pedido.onupgradeneeded = () => pedido.result.createObjectStore(ALMACEN)
    pedido.onsuccess = () => {
      const bd = pedido.result
      // Si el navegador la cierra (pasa con la app en segundo plano), la próxima vez se abre de nuevo
      const soltar = () => {
        if (abierta === intento) abierta = null
      }
      bd.onclose = soltar
      bd.onversionchange = () => {
        bd.close()
        soltar()
      }
      listo(bd)
    }
    pedido.onerror = () => fallo(pedido.error)
    pedido.onblocked = () => fallo(new Error('IndexedDB bloqueada'))
  })
  abierta = intento
  intento.catch(() => {
    if (abierta === intento) abierta = null
  })
  return intento
}

// Corre `hacer(almacen, salida)` en una transacción y devuelve lo que haya dejado en `salida.valor`.
// Lo que pasa adentro de una transacción entra todo junto o no entra, también entre pestañas.
// `pedido` es de quien llama: si ya se cansó de esperar (`vencido`), no se hace nada. Si no, lo que se pidió hace rato
// podría terminar haciéndose más tarde, encima de cosas más nuevas.
async function transaccion(modo, hacer, pedido) {
  const bd = await abrir()
  if (pedido.vencido) throw new Error('IndexedDB tardó demasiado')
  return new Promise((listo, fallo) => {
    let t
    try {
      t = bd.transaction(ALMACEN, modo)
    } catch (error) {
      abierta = null // la conexión con la base estaba muerta: la próxima se abre de nuevo
      fallo(error)
      return
    }
    pedido.transaccion = t
    const salida = {}
    t.oncomplete = () => listo(salida.valor)
    t.onerror = () => fallo(t.error)
    t.onabort = () => fallo(t.error || new Error('transacción abortada'))
    hacer(t.objectStore(ALMACEN), salida)
  })
}

// Cierra la transacción ya, sin esperar a que el navegador avise que terminó cada paso: así lo que se guarda justo
// cuando la app se está cerrando tiene más chances de quedar. (En navegadores viejos no existe y se cierra sola.)
const cerrar = (almacen) => almacen.transaction.commit?.()

const conLimite = (promesa, pedido) =>
  new Promise((listo, fallo) => {
    const reloj = setTimeout(() => {
      abierta = null // la conexión con la base quedó colgada: la próxima vez se abre otra
      // Lo que se había pedido ya no se hace: ni si todavía no empezó, ni si quedó a mitad de camino
      pedido.vencido = true
      try {
        pedido.transaccion?.abort()
      } catch {
        // ya había terminado
      }
      fallo(new Error('IndexedDB no contesta'))
    }, LIMITE_MS)
    promesa.then(
      (valor) => {
        clearTimeout(reloj)
        listo(valor)
      },
      (error) => {
        clearTimeout(reloj)
        fallo(error)
      },
    )
  })
// Si falla, un segundo intento (cubre el caso de la conexión caída, que se reabre sola)
const con = (modo, hacer) => {
  const pedido = { vencido: false, transaccion: null }
  return conLimite(
    transaccion(modo, hacer, pedido).catch(() => transaccion(modo, hacer, pedido)),
    pedido,
  )
}

export const leerLocal = (clave) =>
  con('readonly', (almacen, salida) => {
    const pedido = almacen.get(clave)
    pedido.onsuccess = () => {
      salida.valor = pedido.result
    }
  })

export const guardarLocal = (clave, valor) =>
  con('readwrite', (almacen) => {
    almacen.put(valor, clave)
    cerrar(almacen)
  })

// Borra una clave o varias (todas juntas: o se borran todas o ninguna)
export const borrarLocal = (claves) =>
  con('readwrite', (almacen) => {
    for (const clave of [].concat(claves)) almacen.delete(clave)
    cerrar(almacen)
  })

// Lee, cambia y guarda en un solo paso: `cambio(actual)` devuelve el valor nuevo (undefined para borrarlo; el mismo que
// recibió para dejarlo como está). Como va todo en la misma transacción, dos pestañas que agregan a la misma lista al
// mismo tiempo no se pisan. Devuelve el valor que quedó.
export const cambiarLocal = (clave, cambio) =>
  con('readwrite', (almacen, salida) => {
    const pedido = almacen.get(clave)
    pedido.onsuccess = () => {
      salida.valor = cambio(pedido.result)
      if (salida.valor === undefined) almacen.delete(clave)
      else if (salida.valor !== pedido.result) almacen.put(salida.valor, clave)
      cerrar(almacen)
    }
  })

// Borra las fotos de los datos de todas las cuentas (no las colas de cambios sin mandar).
// Lo usa la pantalla de error: si lo que rompió la app fue una foto vieja, al recargar ya no está.
export const borrarFotos = () =>
  con('readwrite', (almacen) => {
    const pedido = almacen.getAllKeys()
    pedido.onsuccess = () => {
      for (const clave of pedido.result) if (String(clave).startsWith('foto:')) almacen.delete(clave)
      cerrar(almacen)
    }
  })

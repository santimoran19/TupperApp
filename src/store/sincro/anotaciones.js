// Tres anotaciones chicas que van aparte de la copia del teléfono (localStorage), por si justo lo que falla es la copia
// (IndexedDB). Son de la sincronización (ver ../sincronizacion.js):
//   - los cambios que ya se mandaron y todavía no se pudieron sacar de la cola (para no mandarlos de nuevo),
//   - la hora en que se cerró sesión sin poder borrar la copia (lo guardado antes de esa hora no vale),
//   - el latido de la pestaña que está mandando la cola (para que las otras sepan que sigue viva).
// Si el navegador no deja usar localStorage, los mandados quedan en memoria y el resto no se anota.
const ROBAR_MS = 3 * 60 * 1000 // pasado esto sin latido, la pestaña que manda la cola se da por congelada

export function crearAnotaciones(uid) {
  const CLAVE_MANDADOS = `tupper:mandados:${uid}`
  const CLAVE_BORRADO = `tupper:borrado:${uid}`
  const CLAVE_LATIDO = `tupper:latido:${uid}`
  const sinQuitar = new Set() // lo mismo que CLAVE_MANDADOS, en memoria

  const leerLista = (clave) => {
    try {
      const lista = JSON.parse(localStorage.getItem(clave) || '[]')
      return Array.isArray(lista) ? lista : []
    } catch {
      return []
    }
  }
  const guardarLista = (clave, lista) => {
    try {
      if (lista.length > 0) localStorage.setItem(clave, JSON.stringify(lista.slice(-300)))
      else localStorage.removeItem(clave)
    } catch {
      // sin localStorage queda solo en memoria
    }
  }

  return {
    ROBAR_MS,
    // Un cambio que ya llegó a la base: si después no se lo puede sacar de la cola del teléfono, no se manda de nuevo
    anotarMandado(id) {
      sinQuitar.add(id)
      guardarLista(CLAVE_MANDADOS, [...leerLista(CLAVE_MANDADOS), id])
    },
    olvidarMandados(ids) {
      for (const id of ids) sinQuitar.delete(id)
      guardarLista(
        CLAVE_MANDADOS,
        leerLista(CLAVE_MANDADOS).filter((id) => !ids.includes(id)),
      )
    },
    mandados: () => new Set([...sinQuitar, ...leerLista(CLAVE_MANDADOS)]),

    borradoHasta() {
      try {
        return Number(localStorage.getItem(CLAVE_BORRADO)) || 0
      } catch {
        return 0
      }
    },
    // Antes de borrar la copia al cerrar sesión: lo guardado hasta `hora` no se usa ni se manda nunca más
    marcarBorrado(hora) {
      try {
        localStorage.setItem(CLAVE_BORRADO, String(hora))
      } catch {
        // sin localStorage no se puede dejar anotado
      }
    },
    // Ya se pudo limpiar lo de antes de `hora`
    olvidarBorrado(hora) {
      try {
        if (Number(localStorage.getItem(CLAVE_BORRADO)) === hora) localStorage.removeItem(CLAVE_BORRADO)
      } catch {
        // queda la anotación
      }
    },

    latir() {
      try {
        localStorage.setItem(CLAVE_LATIDO, String(Date.now()))
      } catch {
        // sin localStorage no hay latido
      }
    },
    // Sin localStorage no se puede saber: se la da por viva
    sinLatido() {
      try {
        return Date.now() - (Number(localStorage.getItem(CLAVE_LATIDO)) || 0) > ROBAR_MS
      } catch {
        return false
      }
    },

    // Al cerrar sesión, si se pudo borrar la copia
    olvidarTodo() {
      sinQuitar.clear()
      try {
        for (const clave of [CLAVE_BORRADO, CLAVE_MANDADOS, CLAVE_LATIDO]) localStorage.removeItem(clave)
      } catch {
        // queda la anotación
      }
    },
  }
}

// Atajos para armar las listas del estado. No tocan la red: se usan tanto con lo que contesta la base como con la copia local.

// Pone en una lista las filas que devolvió la base, reemplazando las que ya estaban (se comparan por `clave`)
export function conFilas(lista, filas, clave) {
  if (!filas || filas.length === 0) return lista
  const nuevas = new Map(filas.map((f) => [f[clave], f]))
  const resto = lista.map((x) => {
    const n = nuevas.get(x[clave])
    if (n) nuevas.delete(x[clave])
    return n || x
  })
  return [...resto, ...nuevas.values()]
}

// Reemplaza la fila que cumple `igual` o, si no hay ninguna, la agrega al final
export const reemplazar = (lista, fila, igual) => {
  const i = lista.findIndex(igual)
  return i === -1 ? [...lista, fila] : lista.map((x, j) => (j === i ? fila : x))
}

// Map alimento -> diferencia, como lo esperan las funciones de la base
export const comoCambios = (cambios) => [...cambios].filter(([, delta]) => delta).map(([food_id, delta]) => ({ food_id, delta }))

export const entre = (n, min, max) => Math.min(max, Math.max(min, n))

// Identificador nuevo: para la clave de un pedido que no se puede repetir y para las filas que se crean sin conexión.
// En teléfonos viejos no está crypto.randomUUID.
export const nuevaClave = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16),
      )

// Errores que son un aviso para la persona y no una falla de la app (no hace falta anotarlos)
export const invalido = (texto) => Object.assign(new Error(texto), { esperado: true })

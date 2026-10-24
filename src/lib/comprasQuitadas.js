// Lo que falta para el plan que la persona sacó de la lista de compras a mano (1.30): "ya tengo", "no lo voy a comprar".
// Antes solo se podía sacar comprándolo. Se guarda con la cantidad que faltaba al sacarlo: si después el plan necesita
// más (se suma una receta que lo usa), vuelve a aparecer. Desde la 1.31 va en la base (compras_quitadas, F-25); lo de
// leer y guardar en el teléfono queda para pasar a la base lo que se había sacado con la 1.30.

export const claveQuitadas = (ambito) => `tupper:compras-quitadas:${ambito}`

export function leerQuitadas(ambito) {
  try {
    const x = JSON.parse(globalThis.localStorage?.getItem(claveQuitadas(ambito)) || '{}')
    return x && typeof x === 'object' && !Array.isArray(x) ? x : {}
  } catch {
    return {}
  }
}

export function guardarQuitadas(ambito, quitadas) {
  try {
    if (Object.keys(quitadas).length) globalThis.localStorage?.setItem(claveQuitadas(ambito), JSON.stringify(quitadas))
    else globalThis.localStorage?.removeItem(claveQuitadas(ambito))
  } catch {
    // sin almacenamiento, dura mientras la pantalla está abierta
  }
}

// Separa lo que falta para el plan en lo que se muestra y lo que se sacó. `delPlan`: [{ a, qty }]; `quitadas`:
// { food_id: cantidad que faltaba al sacarlo }. Devuelve { visibles, quitados, vigentes } (vigentes: las quitadas que
// siguen faltando, para guardar de nuevo sin las viejas).
export function aplicarQuitadas(delPlan, quitadas) {
  const visibles = []
  const quitados = []
  const vigentes = {}
  for (const x of delPlan) {
    const antes = Number(quitadas?.[x.a.id])
    if (antes > 0 && x.qty <= antes + 1e-9) {
      quitados.push(x)
      vigentes[x.a.id] = antes
    } else visibles.push(x)
  }
  return { visibles, quitados, vigentes }
}

// ¿La contraseña apareció en alguna filtración conocida? Se le pregunta a "Have I Been Pwned", un servicio público que
// junta las contraseñas robadas de otros sitios. La contraseña no sale del teléfono: se manda solo el comienzo de su
// huella (5 de 40 letras), el servicio contesta con todas las huellas que empiezan así y se compara acá.
// Supabase puede hacer esto mismo del lado del servidor, pero solo en los planes pagos.
const SERVICIO = 'https://api.pwnedpasswords.com/range/'
const LIMITE_MS = 4000

export const AVISO_FILTRADA = 'Esa contraseña apareció en filtraciones de otros sitios. Elegí otra que no uses en ningún lado.'

// La huella (SHA-1) de un texto, en mayúsculas
export async function huella(texto) {
  const bytes = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(texto))
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

// La respuesta trae una línea por huella: "RESTO-DE-LA-HUELLA:veces que apareció"
export function estaEnLista(resto, respuesta) {
  return String(respuesta)
    .split('\n')
    .some((linea) => {
      const [h, veces] = linea.trim().split(':')
      return h === resto && Number(veces) > 0
    })
}

// Si no se puede preguntar (sin conexión, el servicio caído, un navegador viejo) devuelve false: no se le traba
// el registro a nadie por eso.
export async function claveFiltrada(clave) {
  try {
    const h = await huella(clave)
    const corte = new AbortController()
    const reloj = setTimeout(() => corte.abort(), LIMITE_MS)
    try {
      const respuesta = await fetch(SERVICIO + h.slice(0, 5), { signal: corte.signal })
      if (!respuesta.ok) return false
      return estaEnLista(h.slice(5), await respuesta.text())
    } finally {
      clearTimeout(reloj)
    }
  } catch {
    return false
  }
}

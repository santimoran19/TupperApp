// Nombre de un producto por su código de barras, con Precios Claros: el sistema de precios del Estado argentino, que conoce
// casi todo lo que se vende en supermercados (nombre, marca y presentación). NO trae calorías: sirve para saber qué producto
// es cuando Open Food Facts no lo tiene, y partir del alimento parecido de la base (ver SelectorAlimento).
// No es una API oficial para terceros, así que todo acá falla en silencio: si no responde, es como si no supiera el nombre.
import { LIM } from './validar'

const BASE = 'https://d3e6htiiul5ek9.cloudfront.net/prod'
const TIEMPO = 6000
// Los precios se piden "en las sucursales" que se indican: se usan 30 de cada zona (Córdoba, Buenos Aires, Rosario)
// y se prueba de a una, así un producto que solo se vende en otra zona igual aparece.
const ZONAS = [
  [-31.4201, -64.1888],
  [-34.6037, -58.3816],
  [-32.9442, -60.6505],
]
const sucursales = new Map() // zona -> Promise con los ids (una vez por sesión)

async function traer(url) {
  const control = new AbortController()
  const corte = setTimeout(() => control.abort(), TIEMPO)
  try {
    const r = await fetch(url, { signal: control.signal, headers: { Accept: 'application/json' } })
    if (!r.ok) throw new Error(`Precios Claros respondió ${r.status}`)
    return await r.json()
  } finally {
    clearTimeout(corte)
  }
}

function idsDeZona(i) {
  if (!sucursales.has(i)) {
    const [lat, lng] = ZONAS[i]
    const p = traer(`${BASE}/sucursales?lat=${lat}&lng=${lng}&limit=30`).then((d) =>
      (Array.isArray(d?.sucursales) ? d.sucursales : []).map((s) => String(s.id)).filter((id) => /^[\w-]+$/.test(id)),
    )
    sucursales.set(i, p)
    p.catch(() => sucursales.delete(i)) // si falló, la próxima vez se vuelve a pedir
  }
  return sucursales.get(i)
}

// Si el nombre no entra en el máximo, se corta en la última palabra entera que entre
export function recortar(texto, max) {
  if (texto.length <= max) return texto
  const corte = texto.slice(0, max)
  const i = corte.lastIndexOf(' ')
  return (i > max * 0.6 ? corte.slice(0, i) : corte).trim()
}

// "170.0 gr" -> { detalle: '170 g', liquido: false };  "1.5 lt" -> { detalle: '1.5 l', liquido: true }
export function medida(presentacion) {
  const m = /^\s*([\d.,]+)\s*(kg|gr?|ml|cc|lts?|l|un\w*)\b/i.exec(String(presentacion ?? ''))
  if (!m) return { detalle: '', liquido: false }
  const numero = String(Number(m[1].replace(',', '.')))
  const u = m[2].toLowerCase()
  const liquido = ['ml', 'cc', 'l', 'lt', 'lts'].includes(u)
  const unidad = u === 'gr' ? 'g' : u === 'lt' || u === 'lts' ? 'l' : u.startsWith('un') ? 'un' : u
  return { detalle: numero === 'NaN' ? '' : `${numero} ${unidad}`, liquido }
}

// { nombre, marca, detalle, liquido } o null (no lo conocen, o no respondió)
export async function nombrePorCodigo(codigo) {
  if (!/^\d{8,14}$/.test(String(codigo))) return null
  for (let zona = 0; zona < ZONAS.length; zona++) {
    try {
      const ids = await idsDeZona(zona)
      if (ids.length === 0) continue
      const d = await traer(`${BASE}/producto?limit=1&id_producto=${codigo}&array_sucursales=${ids.join(',')}`)
      const p = d?.producto
      const nombre = typeof p?.nombre === 'string' ? p.nombre.trim().replace(/\s+/g, ' ') : ''
      if (nombre) {
        const { detalle, liquido } = medida(p.presentacion)
        return { nombre: recortar(nombre, LIM.nombre), marca: String(p.marca ?? '').trim(), detalle, liquido }
      }
      // "Producto inexistente" en esta zona: se prueba con la siguiente
    } catch {
      return null // sin respuesta: no se insiste
    }
  }
  return null
}

// Para las pruebas
export const _olvidar = () => sucursales.clear()

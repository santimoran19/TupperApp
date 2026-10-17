// La lista de compras hecha texto, para mandarla por WhatsApp o donde sea. Va agrupada por categoría (como se camina el
// súper) y con el formato de WhatsApp: *negrita* en el título y en cada categoría.
import { cantidadTexto } from './nutricion'

// filas: [{ a: alimento, qty }]. Devuelve '' si no hay nada para comprar.
export function textoDeLista(filas, { hogar = null } = {}) {
  if (!filas.length) return ''
  const porCategoria = new Map()
  for (const { a, qty } of filas) {
    const c = a.category || 'Otros'
    if (!porCategoria.has(c)) porCategoria.set(c, [])
    porCategoria.get(c).push({ a, qty })
  }
  const lineas = [hogar ? `*Lista de compras · ${hogar}*` : '*Lista de compras*']
  for (const c of [...porCategoria.keys()].sort((x, y) => x.localeCompare(y, 'es'))) {
    lineas.push('', `*${c}*`)
    for (const { a, qty } of porCategoria.get(c).sort((x, y) => x.a.name.localeCompare(y.a.name, 'es'))) {
      lineas.push(`• ${a.name}: ${cantidadTexto(a, qty)}`)
    }
  }
  return lineas.join('\n')
}

// Dónde se abre WhatsApp con el texto ya escrito (sirve en el teléfono y en la compu)
export const enlaceWhatsApp = (texto) => `https://wa.me/?text=${encodeURIComponent(texto)}`

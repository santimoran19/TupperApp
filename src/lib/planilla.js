// Exportar el registro a una planilla (1.28, F-11): un CSV que Excel y Google Sheets abren directo, para llevarle al
// nutricionista. Separado con punto y coma y con coma decimal, como lo espera Excel en español (Argentina).
import { cantidadTexto, NOMBRE_COMIDA, EXTRA, COMIDAS } from './nutricion'

const ORDEN = [...COMIDAS, EXTRA]
export const BOM = String.fromCharCode(0xfeff)
const numero = (n, decimales = 1) => {
  const v = Number(n)
  if (!Number.isFinite(v)) return ''
  return (Math.round(v * 10 ** decimales) / 10 ** decimales).toString().replace('.', ',')
}
// Un valor de la planilla: entre comillas si hace falta (punto y coma, comillas o saltos de línea)
export const celda = (v) => {
  const t = v == null ? '' : String(v)
  // Lo que empieza con =, +, - o @ Excel lo toma como fórmula: se le pone un apóstrofo para que quede como texto
  const seguro = /^[=+\-@]/.test(t) ? `'${t}` : t
  return /[;"\n\r]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro
}
const fila = (valores) => valores.map(celda).join(';')

// Una fila por cosa anotada, más una fila de total por día. `registros`: los del período, `alimentosPorId` para la unidad.
export function registroACsv(registros, { alimentosPorId }) {
  const lineas = [
    fila(['Fecha', 'Comida', 'Alimento o receta', 'Cantidad', 'Calorías (kcal)', 'Proteína (g)', 'Carbohidratos (g)', 'Grasas (g)']),
  ]
  const porDia = new Map()
  for (const r of registros) {
    if (!porDia.has(r.date)) porDia.set(r.date, [])
    porDia.get(r.date).push(r)
  }
  for (const fecha of [...porDia.keys()].sort()) {
    const del = porDia
      .get(fecha)
      .sort((a, b) => ORDEN.indexOf(a.meal) - ORDEN.indexOf(b.meal) || String(a.created_at).localeCompare(String(b.created_at)))
    const total = { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    for (const r of del) {
      const comida = r.meal === EXTRA ? 'Entre comidas' : NOMBRE_COMIDA[r.meal] || r.meal
      if (r.skipped) {
        lineas.push(fila([fecha, comida, 'No comí', '', '', '', '', '']))
        continue
      }
      const a = r.food_id && alimentosPorId.get(r.food_id)
      const cantidad = a ? cantidadTexto(a, Number(r.qty)) : `${numero(r.qty, 2)} ${Number(r.qty) === 1 ? 'porción' : 'porciones'}`
      for (const k of Object.keys(total)) total[k] += Number(r[k]) || 0
      lineas.push(fila([fecha, comida, r.name, cantidad, numero(r.kcal, 0), numero(r.protein), numero(r.carbs), numero(r.fat)]))
    }
    lineas.push(
      fila([fecha, 'TOTAL DEL DÍA', '', '', numero(total.kcal, 0), numero(total.protein), numero(total.carbs), numero(total.fat)]),
    )
  }
  // Con BOM, para que Excel lea bien los acentos
  return BOM + lineas.join('\r\n') + '\r\n'
}

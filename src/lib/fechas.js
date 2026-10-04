// Fechas como texto 'AAAA-MM-DD' en hora local, que es como se guardan en la base.

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const DIAS_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function aTexto(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dia}`
}

export function aFecha(texto) {
  const [a, m, d] = texto.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export const hoy = () => aTexto(new Date())

export function sumarDias(texto, n) {
  const d = aFecha(texto)
  d.setDate(d.getDate() + n)
  return aTexto(d)
}

// 0 = lunes ... 6 = domingo
export const diaSemana = (texto) => (aFecha(texto).getDay() + 6) % 7

export const lunesDe = (texto) => sumarDias(texto, -diaSemana(texto))

export const semanaDe = (texto) => {
  const lunes = lunesDe(texto)
  return [0, 1, 2, 3, 4, 5, 6].map((i) => sumarDias(lunes, i))
}

export const nombreDia = (texto) => DIAS[diaSemana(texto)]
export const diaCorto = (texto) => DIAS_CORTOS[diaSemana(texto)]
export const numeroDia = (texto) => aFecha(texto).getDate()
export const nombresDias = DIAS
export const diasCortos = DIAS_CORTOS

export function fechaLarga(texto) {
  const d = aFecha(texto)
  return `${nombreDia(texto)} ${d.getDate()} de ${MESES[d.getMonth()]}`
}

export function fechaCorta(texto) {
  const d = aFecha(texto)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export const mesDe = (texto) => texto.slice(0, 7)
export const nombreMes = (texto) => MESES[aFecha(texto).getMonth()]

export function edad(nacimiento) {
  if (!nacimiento) return null
  const n = aFecha(nacimiento)
  const h = new Date()
  let e = h.getFullYear() - n.getFullYear()
  if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) e--
  return e
}

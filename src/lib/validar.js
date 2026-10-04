// Límites y validaciones compartidas por todos los formularios.
// La base de datos tiene los mismos topes (ver supabase/actualizacion-2.sql), así que un dato fuera de rango no entra por ningún lado.
import { aFecha, aTexto, fechaCorta, hoy, sumarDias } from './fechas'

export const LIM = {
  nombre: 60,
  edad: [10, 100],
  altura: [100, 250],
  peso: [30, 300],
  cintura: [40, 250],
  kcalObjetivo: [1000, 6000],
  protObjetivo: [20, 400],
  kcal100: [0, 900],
  macro100: [0, 100],
  gramosUnidad: [1, 5000],
  porciones: [0.25, 50],
  minutos: [1, 600],
  rinde: [1, 50],
  precio: [0, 100000000],
  pasos: 3000,
}

const vacio = (v) => v === '' || v === null || v === undefined

// Devuelve el mensaje de error o null si está bien
export function errNumero(v, [min, max], { opcional = false, entero = false } = {}) {
  if (vacio(v)) return opcional ? null : 'Completá este dato.'
  const n = Number(v)
  if (!Number.isFinite(n)) return 'Tiene que ser un número.'
  if (entero && !Number.isInteger(n)) return 'Tiene que ser un número entero.'
  if (n < min || n > max) return `Tiene que estar entre ${min.toLocaleString('es-AR')} y ${max.toLocaleString('es-AR')}.`
  return null
}

export function errTexto(v, { min = 1, max = 60 } = {}) {
  const t = (v || '').trim()
  if (t.length < min) return min <= 1 ? 'Completá este dato.' : `Escribí al menos ${min} letras.`
  if (t.length > max) return `Como mucho ${max} caracteres.`
  return null
}

export function errFecha(v, { min, max, opcional = false }) {
  if (vacio(v)) return opcional ? null : 'Completá la fecha.'
  // El navegador deja tipear años de 5 o 6 cifras: solo se acepta AAAA-MM-DD real
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || aTexto(aFecha(v)) !== v) return 'La fecha no es válida.'
  if (v < min) return `No puede ser anterior al ${fechaCorta(min)}/${min.slice(0, 4)}.`
  if (v > max) return `No puede ser posterior al ${fechaCorta(max)}/${max.slice(0, 4)}.`
  return null
}

export const errEmail = (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim()) ? null : 'El email no es válido.')

// Rango aceptado para la fecha de nacimiento (entre 10 y 100 años)
export function rangoNacimiento() {
  const h = aFecha(hoy())
  const min = new Date(h.getFullYear() - LIM.edad[1], h.getMonth(), h.getDate())
  const max = new Date(h.getFullYear() - LIM.edad[0], h.getMonth(), h.getDate())
  return { min: aTexto(min), max: aTexto(max) }
}

// Días en los que se puede registrar: lo que la app carga hacia atrás y un par de semanas hacia adelante
export const rangoDiario = () => ({ min: sumarDias(hoy(), -90), max: sumarDias(hoy(), 14) })

// Topes de cantidad según cómo se mide el alimento
export const maxPorComida = (a) => (a.unit === 'u' ? 50 : 5000)
export const maxEnStock = (a) => (a.unit === 'u' ? 2000 : 200000)
export const maxEnReceta = (a) => (a.unit === 'u' ? 200 : 20000)

export function errCantidad(alimento, v, max, { permitirCero = false } = {}) {
  if (vacio(v)) return 'Poné una cantidad.'
  const n = Number(v)
  if (!Number.isFinite(n)) return 'Tiene que ser un número.'
  if (n < 0 || (n === 0 && !permitirCero)) return 'Tiene que ser mayor a cero.'
  if (n > max) return `Como mucho ${max.toLocaleString('es-AR')} ${alimento.unit === 'u' ? '' : alimento.unit}.`.replace(' .', '.')
  return null
}

export const hayErrores = (errores) => Object.values(errores).some(Boolean)

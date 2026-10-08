// Límites y validaciones compartidas por todos los formularios.
// La base de datos tiene los mismos topes (ver supabase/actualizacion-2.sql), así que un dato fuera de rango no entra por ningún lado.
import { aFecha, aTexto, fechaCorta, hoy, sumarDias } from './fechas'

export const LIM = {
  nombre: 60,
  edad: [13, 100],
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
  liquido: [500, 6000],
  termo: [250, 3000],
  clave: [8, 72],
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

// ---------- Email y contraseña ----------
// Casillas descartables más comunes: sirven para crear cuentas truchas, así que no se aceptan.
const DESCARTABLES = new Set([
  'mailinator.com',
  'yopmail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'sharklasers.com',
  '10minutemail.com',
  '10minutemail.net',
  'tempmail.com',
  'temp-mail.org',
  'tempmail.net',
  'tempail.com',
  'throwawaymail.com',
  'trashmail.com',
  'getnada.com',
  'nada.email',
  'maildrop.cc',
  'dispostable.com',
  'fakeinbox.com',
  'mintemail.com',
  'mohmal.com',
  'emailondeck.com',
  'moakt.com',
  'tmpmail.org',
  'tmpmail.net',
  'mailnesia.com',
  'spamgourmet.com',
  'mytemp.email',
  'burnermail.io',
  'inboxkitten.com',
  'tempr.email',
  'discard.email',
  'mailcatch.com',
  'harakirimail.com',
  'luxusmail.org',
  'minutemail.com',
  'tempinbox.com',
])
// Proveedores conocidos: si el dominio se parece mucho a uno de estos, se sugiere la corrección
const CONOCIDOS = [
  'gmail.com',
  'hotmail.com',
  'hotmail.com.ar',
  'hotmail.es',
  'outlook.com',
  'outlook.com.ar',
  'outlook.es',
  'live.com',
  'live.com.ar',
  'yahoo.com',
  'yahoo.com.ar',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'fibertel.com.ar',
  'arnet.com.ar',
  'ymail.com',
  'gmx.com',
  'mail.com',
  'me.com',
  'msn.com',
  'aol.com',
]

function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      // dos letras cambiadas de lugar cuentan como un solo error (gmial)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}

export function errEmail(v) {
  const t = (v || '').trim().toLowerCase()
  if (!t) return 'Escribí tu email.'
  if (!/^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(t) || t.includes('..') || t.length > 120)
    return 'El email no es válido.'
  if (DESCARTABLES.has(t.split('@')[1])) return 'Usá un email tuyo de verdad: los temporales no sirven para recuperar la cuenta.'
  return null
}

// Si el dominio parece mal tipeado devuelve el email corregido; si no, null
export function sugerirEmail(v) {
  const t = (v || '').trim().toLowerCase()
  const [usuario, dominio] = t.split('@')
  if (!usuario || !dominio || !dominio.includes('.') || CONOCIDOS.includes(dominio)) return null
  let mejor = null
  for (const c of CONOCIDOS) {
    const n = distancia(dominio, c)
    // con dominios cortos, dos letras de diferencia ya es otro dominio
    if (n <= (c.length >= 9 ? 2 : 1) && (!mejor || n < mejor.n)) mejor = { c, n }
  }
  if (mejor) return `${usuario}@${mejor.c}`
  const fin = dominio.match(/\.(con|cmo|ocm|comm|vom|xom)(\.ar)?$/)
  return fin ? `${usuario}@${dominio.replace(/\.(con|cmo|ocm|comm|vom|xom)(\.ar)?$/, '.com$2')}` : null
}

// Contraseñas que se adivinan en segundos: las más usadas y las obvias para esta app
const CLAVES_COMUNES = new Set([
  'password',
  'password1',
  'password123',
  'contraseña',
  'contrasena',
  'contrasenia',
  'qwerty',
  'qwertyui',
  'qwerty123',
  'asdfghjk',
  'asdf1234',
  '12345678',
  '123456789',
  '1234567890',
  '87654321',
  '11111111',
  '00000000',
  'abcd1234',
  'abc12345',
  '1q2w3e4r',
  '1qaz2wsx',
  'iloveyou',
  'teamo123',
  'tequiero',
  'argentina',
  'argentina1',
  'boca1234',
  'river1234',
  'bocajuniors',
  'riverplate',
  'tupper123',
  'tupper1234',
  'hola1234',
  'holahola',
  'admin123',
  'usuario1',
  'welcome1',
  'letmein1',
])
// Palabras típicas que la gente usa con un año o un número atrás (Boca2024, Cordoba2026)
const PALABRAS_COMUNES = new Set([
  'boca',
  'river',
  'messi',
  'maradona',
  'talleres',
  'belgrano',
  'instituto',
  'racing',
  'independiente',
  'cordoba',
  'buenosaires',
  'rosario',
  'argentina',
  'tupper',
  'hola',
  'teamo',
  'tequiero',
  'amor',
  'familia',
  'futbol',
  'password',
  'contraseña',
  'contrasena',
  'clave',
  'secreto',
  'qwerty',
  'admin',
  'usuario',
])
const TIRAS = ['0123456789', '9876543210', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjklñ', 'zxcvbnm']

// ¿Es fácil de adivinar? Común, casi todo igual, una tira del teclado o armada con el propio email
function claveFacil(clave, email = '') {
  const c = clave.toLowerCase()
  const letras = c.replace(/[^a-zñ]/g, '')
  if (CLAVES_COMUNES.has(c) || CLAVES_COMUNES.has(letras) || PALABRAS_COMUNES.has(letras)) return true
  if (new Set(c).size <= 3) return true // aaaa1111, abababab
  // más de la mitad de la contraseña es una tira seguida (12345, qwerty, abcde)
  for (const tira of TIRAS) {
    for (let largo = Math.min(c.length, tira.length); largo >= 5; largo--) {
      for (let i = 0; i + largo <= tira.length; i++) {
        if (c.includes(tira.slice(i, i + largo)) && largo >= c.length / 2) return true
      }
    }
  }
  const usuario = email
    .trim()
    .toLowerCase()
    .split('@')[0]
    .replace(/[^a-z0-9ñ]/g, '')
  return usuario.length >= 4 && c.replace(/[^a-z0-9ñ]/g, '').includes(usuario)
}

// Requisitos de una contraseña nueva: cada uno con si ya se cumple
export function requisitosClave(v, email = '') {
  const c = v || ''
  return [
    { texto: `Al menos ${LIM.clave[0]} caracteres`, ok: c.length >= LIM.clave[0] },
    { texto: 'Una mayúscula y una minúscula', ok: /[a-záéíóúñ]/.test(c) && /[A-ZÁÉÍÓÚÑ]/.test(c) },
    { texto: 'Un número', ok: /\d/.test(c) },
    { texto: 'Que no sea fácil de adivinar (ni tu email, ni 12345, ni qwerty)', ok: c.length >= LIM.clave[0] && !claveFacil(c, email) },
  ]
}
export function errClave(v, email = '') {
  if ((v || '').length > LIM.clave[1]) return `La contraseña es demasiado larga (máximo ${LIM.clave[1]} caracteres).`
  return requisitosClave(v, email).every((r) => r.ok) ? null : 'La contraseña todavía no cumple los requisitos.'
}

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

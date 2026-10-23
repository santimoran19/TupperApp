// Ayuno y recordatorios (1.27). Todo esto se guarda en el teléfono (no en la base): es de cada aparato y no lleva datos
// de salud. Funciones puras (sin React ni DOM) salvo `leer` y `guardar`, que cuidan que el almacenamiento falle.

// ---------- Ayuno ----------
// Protocolos habituales: horas en ayunas / horas para comer
export const PROTOCOLOS = [
  { id: '12', ayuno: 12, nombre: '12 : 12', texto: 'Para empezar' },
  { id: '14', ayuno: 14, nombre: '14 : 10', texto: 'Suave' },
  { id: '16', ayuno: 16, nombre: '16 : 8', texto: 'El más usado' },
  { id: '18', ayuno: 18, nombre: '18 : 6', texto: 'Más exigente' },
  { id: '20', ayuno: 20, nombre: '20 : 4', texto: 'Solo con experiencia' },
]
export const protocoloDe = (id) => PROTOCOLOS.find((p) => p.id === id) || PROTOCOLOS[2]

const HORA = 3600000

// Cómo va un ayuno que empezó en `inicio` (ms) y dura `horas`, mirado en `ahora` (ms)
export function estadoAyuno({ inicio, horas, ahora }) {
  const meta = horas * HORA
  const pasado = Math.max(0, ahora - inicio)
  return {
    pasado,
    meta,
    restante: Math.max(0, meta - pasado),
    pct: Math.min(1, pasado / meta),
    cumplido: pasado >= meta,
    // Cuánto se pasó de la meta (el ayuno sigue hasta que la persona lo corte)
    extra: Math.max(0, pasado - meta),
    fin: inicio + meta,
  }
}

// 'H h MM min' para una duración en ms ("14 h 05 min"; menos de una hora: "42 min")
export function duracionTexto(ms) {
  const min = Math.max(0, Math.floor(ms / 60000))
  const h = Math.floor(min / 60)
  const m = min % 60
  return h === 0 ? `${m} min` : `${h} h ${String(m).padStart(2, '0')} min`
}

// Un ayuno largo sin cortar probablemente se olvidó: pasadas 30 horas se pregunta antes de seguir contando
export const AYUNO_LARGO_H = 30
export const ayunoOlvidado = (inicio, ahora) => ahora - inicio > AYUNO_LARGO_H * HORA

// Los ayunos terminados (historial corto): los de los últimos `dias` días y cuántos llegaron a su meta
export function resumenAyunos(historial, ahora, dias = 7) {
  const desde = ahora - dias * 24 * HORA
  const recientes = (historial || []).filter((a) => a.fin >= desde)
  return {
    total: recientes.length,
    cumplidos: recientes.filter((a) => a.fin - a.inicio >= a.horas * HORA - 60000).length,
    // Promedio de horas de los terminados
    promedioH: recientes.length ? recientes.reduce((t, a) => t + (a.fin - a.inicio) / HORA, 0) / recientes.length : 0,
  }
}

// ---------- Recordatorios ----------
export const RECORDATORIOS_INICIAL = {
  activo: false,
  comidas: { desayuno: '08:30', almuerzo: '13:00', merienda: '17:30', cena: '21:00' },
  comidasOn: { desayuno: true, almuerzo: true, merienda: true, cena: true },
  agua: false,
  aguaCada: 2, // horas
  aguaDesde: '09:00',
  aguaHasta: '21:00',
  ayuno: true, // avisar cuando se cumple la meta del ayuno
}

const aMin = (hhmm) => {
  const [h, m] = String(hhmm || '')
    .split(':')
    .map(Number)
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null
}
export const horaValida = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ''))

// Qué recordatorios corresponde mostrar ahora. `ahora`: Date. `yaAvisados`: Set de claves 'fecha|id' ya mostradas.
// `registradas`: Set de comidas que ya se anotaron hoy. Una comida se avisa desde su hora hasta 90 minutos después, y solo si
// todavía no está anotada; el agua, una vez por franja. Devuelve [{ id, titulo, texto, ruta }].
export function recordatoriosAhora({ config, ahora, fecha, registradas = new Set(), yaAvisados = new Set(), nombres = {} }) {
  if (!config?.activo) return []
  const min = ahora.getHours() * 60 + ahora.getMinutes()
  const salida = []
  for (const comida of Object.keys(config.comidas || {})) {
    if (!config.comidasOn?.[comida]) continue
    const t = aMin(config.comidas[comida])
    const id = `comida-${comida}`
    if (t === null || min < t || min > t + 90 || registradas.has(comida) || yaAvisados.has(`${fecha}|${id}`)) continue
    salida.push({ id, titulo: `Es hora de ${nombres[comida] || comida}`, texto: 'Anotala cuando termines.', ruta: '/' })
  }
  if (config.agua) {
    const d = aMin(config.aguaDesde)
    const h = aMin(config.aguaHasta)
    const cada = Math.max(1, Number(config.aguaCada) || 2) * 60
    if (d !== null && h !== null && min >= d && min <= h) {
      const franja = Math.floor((min - d) / cada)
      const id = `agua-${franja}`
      if (!yaAvisados.has(`${fecha}|${id}`))
        salida.push({ id, titulo: 'Tomá un vaso de agua', texto: 'Un trago ahora te suma.', ruta: '/' })
    }
  }
  return salida
}

// ---------- Guardado en el teléfono ----------
export const claveAyuno = (uid) => `tupper:ayuno:${uid}`
export const claveRecordatorios = (uid) => `tupper:recordatorios:${uid}`

export function leer(clave, porDefecto) {
  try {
    const t = globalThis.localStorage?.getItem(clave)
    return t ? { ...porDefecto, ...JSON.parse(t) } : porDefecto
  } catch {
    return porDefecto
  }
}
export function guardar(clave, valor) {
  try {
    globalThis.localStorage?.setItem(clave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

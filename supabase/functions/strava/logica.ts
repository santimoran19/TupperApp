// Lógica pura de `strava` (sin red ni Deno: se prueba con vitest). Ver index.ts.

// ---------- Desde qué páginas se puede llamar (igual que en las otras funciones) ----------
const ORIGEN_DE_LA_APP = 'https://tupperapp.vercel.app'
export function origenesPermitidos(valor: string | null | undefined): string[] {
  const lista = (valor ?? '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean)
  return lista.length ? lista : [ORIGEN_DE_LA_APP]
}
export const origenAjeno = (origen: string | null, permitidos: string[]) => !!origen && !permitidos.includes(origen)
export function encabezadosCors(origen: string | null, permitidos: string[], cabeceras: string): Record<string, string> {
  const base: Record<string, string> = { 'Access-Control-Allow-Headers': cabeceras, 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' }
  return origen && permitidos.includes(origen) ? { ...base, 'Access-Control-Allow-Origin': origen } : base
}

export const ACCIONES = ['estado', 'conectar', 'actividades', 'desconectar'] as const
export type Accion = (typeof ACCIONES)[number]
export const esAccion = (a: unknown): a is Accion => typeof a === 'string' && (ACCIONES as readonly string[]).includes(a)

// El código que devuelve Strava al volver a la app: letras y números
export const codigoValido = (c: unknown) => typeof c === 'string' && /^[A-Za-z0-9]{10,100}$/.test(c)
// Hace falta poder leer las actividades (también las privadas, que son la mayoría de los entrenamientos)
export const alcanceAlcanza = (scope: unknown) => typeof scope === 'string' && /(^|,)activity:read(_all)?(,|$)/.test(scope)

// ¿Hay que renovar el permiso? (Strava lo da por 6 horas; se renueva si le falta menos de un minuto)
export const hayQueRenovar = (expiraEn: string | number | null, ahora = Date.now()) =>
  !expiraEn || new Date(typeof expiraEn === 'number' ? expiraEn * 1000 : expiraEn).getTime() - ahora < 60_000

// Desde cuándo traer (fecha AAAA-MM-DD → segundos). Hasta 180 días hacia atrás; por defecto, 30.
export function desdeSegundos(desde: unknown, ahora = Date.now()): number {
  const minimo = ahora - 180 * 86400000
  const pedido = typeof desde === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(desde) ? Date.parse(desde + 'T00:00:00Z') : NaN
  const ms = Number.isFinite(pedido) ? Math.max(minimo, pedido) : ahora - 30 * 86400000
  return Math.floor(ms / 1000)
}

type ActividadStrava = {
  id?: number | string
  name?: string
  sport_type?: string
  type?: string
  start_date?: string
  moving_time?: number
  elapsed_time?: number
  distance?: number
  total_elevation_gain?: number
  average_heartrate?: number
  calories?: number
  manual?: boolean
}

// Lo que se le devuelve a la app: solo lo necesario para anotar el entrenamiento (sin mapa, ubicación ni fotos)
export function resumirActividad(a: ActividadStrava) {
  const segundos = Number(a.moving_time) > 0 ? Number(a.moving_time) : Number(a.elapsed_time) || 0
  const metros = Number(a.distance) || 0
  const pulso = Number(a.average_heartrate)
  return {
    id: String(a.id ?? ''),
    nombre: String(a.name ?? '').slice(0, 80),
    deporte: String(a.sport_type || a.type || '').slice(0, 40),
    inicio: a.start_date && Number.isFinite(Date.parse(a.start_date)) ? new Date(a.start_date).toISOString() : null,
    minutos: Math.round(segundos / 60),
    distanciaKm: metros > 0 ? Math.round(metros / 10) / 100 : null,
    desnivelM: Number(a.total_elevation_gain) > 0 ? Math.round(Number(a.total_elevation_gain)) : null,
    pulso: pulso >= 30 && pulso <= 230 ? Math.round(pulso) : null,
    kcal: Number(a.calories) > 0 ? Math.round(Number(a.calories)) : null,
  }
}
export const resumirActividades = (lista: unknown) =>
  (Array.isArray(lista) ? lista : []).map((a) => resumirActividad(a as ActividadStrava)).filter((a) => a.id && a.inicio && a.minutos >= 1)

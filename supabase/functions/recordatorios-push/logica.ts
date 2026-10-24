// Lógica de los recordatorios con la app cerrada (1.29, F-06), sin Deno ni base: se prueba en pruebas/unidad/push.test.js.
// Las reglas son las mismas que usa la app abierta (src/lib/ayuno.js, recordatoriosAhora): las pruebas comparan las dos.

export type Config = {
  activo?: boolean
  comidas?: Record<string, string>
  comidasOn?: Record<string, boolean>
  agua?: boolean
  aguaCada?: number
  aguaDesde?: string
  aguaHasta?: string
  ayuno?: boolean
}
export type Aviso = { id: string; titulo: string; texto: string; ruta: string }

export const ZONA_POR_DEFECTO = 'America/Argentina/Buenos_Aires'
const COMIDAS = ['desayuno', 'almuerzo', 'merienda', 'cena']
const NOMBRES: Record<string, string> = { desayuno: 'desayunar', almuerzo: 'almorzar', merienda: 'merendar', cena: 'cenar' }
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/

const aMin = (hhmm: unknown) => {
  if (!HORA.test(String(hhmm || ''))) return null
  const [h, m] = String(hhmm).split(':').map(Number)
  return h * 60 + m
}

// La zona horaria que mandó el teléfono, si es una que existe
export function zonaValida(zona: unknown): string {
  const z = String(zona || '').slice(0, 64)
  if (!z) return ZONA_POR_DEFECTO
  try {
    new Intl.DateTimeFormat('es', { timeZone: z })
    return z
  } catch {
    return ZONA_POR_DEFECTO
  }
}

// Fecha ('AAAA-MM-DD') y minuto del día en esa zona
export function horaLocal(ahora: Date, zona: string): { fecha: string; min: number } {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: zonaValida(zona),
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(ahora)
      .map((p) => [p.type, p.value]),
  )
  return { fecha: `${partes.year}-${partes.month}-${partes.day}`, min: (Number(partes.hour) % 24) * 60 + Number(partes.minute) }
}

// Lo que se guarda en la base: solo lo que la app sabe usar, con valores sanos
export function limpiarConfig(c: unknown): Config {
  const x = (c && typeof c === 'object' ? c : {}) as Config
  const comidas: Record<string, string> = {}
  const comidasOn: Record<string, boolean> = {}
  for (const k of COMIDAS) {
    if (HORA.test(String(x.comidas?.[k] || ''))) comidas[k] = String(x.comidas![k])
    comidasOn[k] = !!x.comidasOn?.[k]
  }
  return {
    activo: !!x.activo,
    comidas,
    comidasOn,
    agua: !!x.agua,
    aguaCada: Math.min(3, Math.max(1, Math.round(Number(x.aguaCada) || 2))),
    aguaDesde: HORA.test(String(x.aguaDesde || '')) ? x.aguaDesde : '09:00',
    aguaHasta: HORA.test(String(x.aguaHasta || '')) ? x.aguaHasta : '21:00',
    ayuno: x.ayuno !== false,
  }
}

// Los avisos que corresponden en el minuto `min` del día `fecha` (hora local de la persona).
// `registradas`: comidas ya anotadas ese día. `yaAvisados`: ids ya mandados (de ese día; el del ayuno, de cualquiera).
// `ayuno`: el que está en curso { inicio (ms), horas } o null. `ahora`: ms.
export function avisosPara({
  config,
  min,
  fecha,
  registradas = new Set<string>(),
  yaAvisados = new Set<string>(),
  ayuno = null,
  ahora = Date.now(),
}: {
  config: Config
  min: number
  fecha: string
  registradas?: Set<string>
  yaAvisados?: Set<string>
  ayuno?: { inicio: number; horas: number } | null
  ahora?: number
}): Aviso[] {
  if (!config?.activo) return []
  const salida: Aviso[] = []
  for (const comida of Object.keys(config.comidas || {})) {
    if (!config.comidasOn?.[comida]) continue
    const t = aMin(config.comidas![comida])
    const id = `comida-${comida}`
    if (t === null || min < t || min > t + 90 || registradas.has(comida) || yaAvisados.has(`${fecha}|${id}`)) continue
    salida.push({ id, titulo: `Es hora de ${NOMBRES[comida] || comida}`, texto: 'Anotala cuando termines.', ruta: '/' })
  }
  if (config.agua) {
    const d = aMin(config.aguaDesde)
    const h = aMin(config.aguaHasta)
    const cada = Math.max(1, Number(config.aguaCada) || 2) * 60
    if (d !== null && h !== null && min >= d && min <= h) {
      const id = `agua-${Math.floor((min - d) / cada)}`
      if (!yaAvisados.has(`${fecha}|${id}`)) salida.push({ id, titulo: 'Tomá un vaso de agua', texto: 'Un trago ahora te suma.', ruta: '/' })
    }
  }
  if (config.ayuno !== false && ayuno && Number.isFinite(ayuno.inicio) && ayuno.horas > 0) {
    const id = `ayuno-${ayuno.inicio}`
    const fin = ayuno.inicio + ayuno.horas * 3600000
    // Solo si se cumplió hace menos de 6 horas (si no, el ayuno seguramente quedó olvidado)
    if (ahora >= fin && ahora - fin < 6 * 3600000 && !yaAvisados.has(id))
      salida.push({ id, titulo: '¡Cumpliste tu ayuno!', texto: `Pasaron las ${ayuno.horas} horas.`, ruta: '/' })
  }
  return salida
}

// La comprobación del pedido del reloj de la base (pg_cron): compara sin cortar en la primera letra distinta
export function claveCorrecta(recibida: string | null, esperada: string | undefined): boolean {
  if (!esperada || !recibida || recibida.length !== esperada.length) return false
  let dif = 0
  for (let i = 0; i < esperada.length; i++) dif |= recibida.charCodeAt(i) ^ esperada.charCodeAt(i)
  return dif === 0
}

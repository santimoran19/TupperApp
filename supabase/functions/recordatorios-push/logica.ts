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
  peso?: boolean
  pesoDia?: number
  pesoHora?: string
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
    peso: !!x.peso,
    pesoDia: Number.isInteger(Number(x.pesoDia)) && Number(x.pesoDia) >= 0 && Number(x.pesoDia) <= 6 ? Number(x.pesoDia) : 1,
    pesoHora: HORA.test(String(x.pesoHora || '')) ? x.pesoHora : '08:00',
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
  pesadoHoy = false,
}: {
  config: Config
  min: number
  fecha: string
  registradas?: Set<string>
  yaAvisados?: Set<string>
  ayuno?: { inicio: number; horas: number } | null
  ahora?: number
  pesadoHoy?: boolean
}): Aviso[] {
  if (!config?.activo) return []
  const salida: Aviso[] = []
  for (const comida of Object.keys(config.comidas || {})) {
    if (!config.comidasOn?.[comida]) continue
    const t = aMin(config.comidas![comida])
    const id = `comida-${comida}`
    if (t === null || min < t || min > t + 90 || registradas.has(comida) || yaAvisados.has(`${fecha}|${id}`)) continue
    salida.push({ id, titulo: `Es hora de ${NOMBRES[comida] || comida}`, texto: 'Anotala cuando termines.', ruta: `/registrar?comida=${comida}` })
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
  // Pesarse (1.30, F-23): una vez por semana, el día y la hora elegidos (hasta 2 horas después), si todavía no se pesó
  if (config.peso && !pesadoHoy) {
    const t = aMin(config.pesoHora || '08:00')
    const dia = new Date(fecha + 'T12:00:00Z').getUTCDay()
    if (t !== null && dia === (config.pesoDia ?? 1) && min >= t && min <= t + 120 && !yaAvisados.has(`${fecha}|peso`))
      salida.push({ id: 'peso', titulo: '¿Te pesás?', texto: 'Mejor en ayunas y a la misma hora. Anotalo en tu Perfil.', ruta: '/perfil' })
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

// ---------- Botones en la notificación (1.32, F-06b) ----------
// "Más tarde" vuelve a mandar el aviso en el próximo turno del reloj después de 15 minutos; "Tomé un vaso" anota 250 ml de
// agua sin abrir la app. El service worker manda el botón tocado con una firma (HMAC con CRON_CLAVE) que la función
// puso en el aviso: así no hace falta la sesión de la persona, y nadie puede anotar en una cuenta ajena.
export const POSPONER_MIN = 15
export const VIGENCIA_FIRMA_MS = 6 * 3600000 // los botones sirven hasta 6 horas después del aviso

export type Boton = 'posponer' | 'vaso'
export function botonesDe(aviso: string): Boton[] {
  if (/^agua-\d+$/.test(aviso)) return ['vaso', 'posponer']
  if (/^comida-(desayuno|almuerzo|merienda|cena)$/.test(aviso)) return ['posponer']
  return []
}

// El aviso de nuevo a partir de su id (para "Más tarde": el texto no viaja en el pedido, se arma acá)
export function avisoPorId(id: string): Aviso | null {
  const comida = /^comida-(desayuno|almuerzo|merienda|cena)$/.exec(id)?.[1]
  if (comida) return { id, titulo: `Es hora de ${NOMBRES[comida]}`, texto: 'Anotala cuando termines.', ruta: `/registrar?comida=${comida}` }
  if (/^agua-\d+$/.test(id)) return { id, titulo: 'Tomá un vaso de agua', texto: 'Un trago ahora te suma.', ruta: '/' }
  return null
}

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
async function hmac(clave: string, texto: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(clave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return hex(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(texto)))
}

export type Firma = { u: string; f: string; a: string; e: number; t: string }
// Lo que va en el aviso para los botones
export async function firmar(clave: string, usuario: string, fecha: string, aviso: string, ahora = Date.now()): Promise<Firma> {
  const e = ahora + VIGENCIA_FIRMA_MS
  return { u: usuario, f: fecha, a: aviso, e, t: await hmac(clave, `${usuario}|${fecha}|${aviso}|${e}`) }
}

// El pedido de un botón: { accion, u, f, a, e, t }. Devuelve la firma si vale y no venció, o null.
export async function leerBoton(cuerpo: unknown, clave: string | undefined, ahora = Date.now()): Promise<(Firma & { accion: Boton }) | null> {
  if (!clave || !cuerpo || typeof cuerpo !== 'object') return null
  const { accion, u, f, a, e, t } = cuerpo as Record<string, unknown>
  if (accion !== 'posponer' && accion !== 'vaso') return null
  if (typeof u !== 'string' || !/^[0-9a-f-]{36}$/.test(u)) return null
  if (typeof f !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(f)) return null
  if (typeof a !== 'string' || !botonesDe(a).includes(accion)) return null
  if (typeof e !== 'number' || !(e > ahora) || e > ahora + VIGENCIA_FIRMA_MS + 60000) return null
  if (typeof t !== 'string' || !claveCorrecta(t, await hmac(clave, `${u}|${f}|${a}|${e}`))) return null
  return { accion, u, f, a, e, t }
}

// Lógica pura de `asistente-ia` (sin red ni Deno: se prueba con vitest). Ver index.ts.

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

// ---------- Topes ----------
export const MAX_MENSAJES = 12 // los últimos de la conversación
export const MAX_LARGO_MENSAJE = 1000
export const MAX_CONTEXTO = 9000 // caracteres del resumen del día ya pasado a texto

export type Mensaje = { role: 'user' | 'assistant'; content: string }

// Deja la conversación limpia: solo pregunta/respuesta, recortada, y que termine con una pregunta. null si no sirve.
export function limpiarMensajes(crudos: unknown): Mensaje[] | null {
  if (!Array.isArray(crudos)) return null
  const lista: Mensaje[] = []
  for (const m of crudos.slice(-MAX_MENSAJES)) {
    const role = (m as { role?: unknown })?.role
    const content = String((m as { content?: unknown })?.content ?? '').trim().slice(0, MAX_LARGO_MENSAJE)
    if ((role !== 'user' && role !== 'assistant') || !content) continue
    lista.push({ role, content })
  }
  // La primera tiene que ser de la persona, y la última también
  while (lista.length && lista[0].role !== 'user') lista.shift()
  if (!lista.length || lista[lista.length - 1].role !== 'user') return null
  return lista
}

// El resumen del día que manda la app, pasado a texto y recortado. Se aceptan solo estas claves (lo demás se descarta).
const CLAVES = ['fecha', 'hora', 'perfil', 'objetivo', 'comido', 'falta', 'comidas', 'despensa', 'plan', 'ayuno'] as const
export function contextoTexto(crudo: unknown): string {
  if (!crudo || typeof crudo !== 'object') return '(sin datos del día)'
  const limpio: Record<string, unknown> = {}
  for (const k of CLAVES) if (k in (crudo as Record<string, unknown>)) limpio[k] = (crudo as Record<string, unknown>)[k]
  let texto = JSON.stringify(limpio)
  if (texto.length > MAX_CONTEXTO) texto = texto.slice(0, MAX_CONTEXTO) + '…'
  return texto
}

export const INSTRUCCIONES = `Sos el asistente de Tupper, una app argentina para organizar la comida: despensa, recetas, plan semanal y registro de calorías.
Hablás en español rioplatense (voseo), con calidez y sin vueltas. Respondé corto: en general 2 a 6 oraciones o una lista breve (máximo unas 150 palabras).
Usá los datos del día que te pasa la app (JSON en "DATOS DEL DÍA"): el objetivo, lo que ya comió, lo que le falta, su despensa (con lo que vence pronto) y su plan.
- Si pregunta qué comer "con lo que tiene", proponé solo cosas que se puedan hacer con lo de su despensa (podés sumar básicos como sal, aceite o especias). Priorizá lo que vence antes.
- Si pregunta si puede comer algo, mirá cuánto le queda del día y respondé con números redondos (calorías y proteína), sin culpa ni sermones.
- Las cantidades y calorías que des son aproximadas: decilo cuando importe.
- No sos médico ni nutricionista. Si menciona una enfermedad, embarazo, medicación, un trastorno de la conducta alimentaria o algo de salud que no sea comer en general, respondé con cuidado lo básico y recomendá consultar con un profesional.
- Nunca propongas dietas extremas, ayunos largos, purgas ni comer muy por debajo de su objetivo. Si notás señales de una relación difícil con la comida, priorizá su bienestar y sugerí hablar con un profesional.
- Si te preguntan algo que no tiene que ver con comida, nutrición, la app o la salud cotidiana, decí amablemente que solo ayudás con eso.
- No inventes datos de la persona que no estén en el JSON. No repitas el JSON.
- Texto plano: sin títulos ni tablas. Podés usar guiones para listas cortas.
- Si la persona te pide anotar o registrar algo que comió o va a comer ("anotame una manzana", "registrá que almorcé dos milanesas"), confirmalo en una oración y, en la última línea, agregá exactamente ANOTAR: seguido de un JSON con lo que hay que anotar, así: ANOTAR: {"comida":"almuerzo","items":[{"nombre":"milanesa de carne","cantidad":2,"unidad":"unidad","gramos":300}]}. "comida" es desayuno, almuerzo, merienda, cena o extra (si no lo dice, la que corresponde por la hora). Unidad: "g", "ml", "unidad" o "porcion". La app le muestra un botón para revisar y anotar: vos no anotás nada. Si no pidió anotar, no agregues esa línea.`

// Arma los mensajes para el modelo: instrucciones + datos del día + la conversación
export function armarMensajes(mensajes: Mensaje[], contexto: string) {
  return [
    { role: 'system' as const, content: `${INSTRUCCIONES}\n\nDATOS DEL DÍA: ${contexto}` },
    ...mensajes,
  ]
}

// ---------- Anotar desde el chat (1.29, IA-06) ----------
export type ItemAnotar = { nombre: string; cantidad: number; unidad: 'g' | 'ml' | 'unidad' | 'porcion'; gramos: number }
export type Anotar = { comida: string | null; items: ItemAnotar[] }
const COMIDAS = ['desayuno', 'almuerzo', 'merienda', 'cena', 'extra']
const UNIDADES = ['g', 'ml', 'unidad', 'porcion']

// Separa el pedido de anotar (la línea "ANOTAR: {...}") del texto que se muestra. Nunca tira.
export function separarAnotar(texto: string): { texto: string; anotar: Anotar | null } {
  const t = String(texto || '')
  const i = t.lastIndexOf('ANOTAR:')
  if (i < 0) return { texto: t, anotar: null }
  const resto = t.slice(i + 'ANOTAR:'.length)
  const a = resto.indexOf('{')
  const b = resto.lastIndexOf('}')
  const sinLinea = t.slice(0, i).trim()
  if (a < 0 || b <= a) return { texto: sinLinea, anotar: null }
  let crudo: { comida?: unknown; items?: unknown }
  try {
    crudo = JSON.parse(resto.slice(a, b + 1))
  } catch {
    return { texto: sinLinea, anotar: null }
  }
  const items: ItemAnotar[] = []
  for (const x of Array.isArray(crudo?.items) ? crudo.items.slice(0, 12) : []) {
    const nombre = String((x as { nombre?: unknown })?.nombre ?? '').replace(/\s+/g, ' ').trim().slice(0, 80)
    if (nombre.length < 2) continue
    const unidad0 = String((x as { unidad?: unknown }).unidad ?? '').toLowerCase().replace('porción', 'porcion').replace('unidades', 'unidad')
    const unidad = (UNIDADES.includes(unidad0) ? unidad0 : 'porcion') as ItemAnotar['unidad']
    const cantidad = Number((x as { cantidad?: unknown }).cantidad)
    const gramos = Number((x as { gramos?: unknown }).gramos)
    const c = Number.isFinite(cantidad) && cantidad > 0 ? Math.min(unidad === 'g' || unidad === 'ml' ? 3000 : 50, cantidad) : 1
    const g = Number.isFinite(gramos) && gramos > 0 ? Math.min(3000, Math.round(gramos)) : unidad === 'g' || unidad === 'ml' ? c : 100
    items.push({ nombre, cantidad: c, unidad, gramos: g })
  }
  const comida = COMIDAS.includes(String(crudo?.comida)) ? String(crudo.comida) : null
  return { texto: sinLinea, anotar: items.length ? { comida, items } : null }
}

// La respuesta del modelo, limpia: sin bloques de código raros ni espacios de más, y con tope
export function limpiarRespuesta(texto: string): string {
  return String(texto || '')
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/\s*```$/, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 3000)
}

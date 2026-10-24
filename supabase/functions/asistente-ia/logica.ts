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
- Texto plano: sin títulos ni tablas. Podés usar guiones para listas cortas.`

// Arma los mensajes para el modelo: instrucciones + datos del día + la conversación
export function armarMensajes(mensajes: Mensaje[], contexto: string) {
  return [
    { role: 'system' as const, content: `${INSTRUCCIONES}\n\nDATOS DEL DÍA: ${contexto}` },
    ...mensajes,
  ]
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

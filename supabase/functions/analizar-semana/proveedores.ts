// Proveedores de IA. La función puede hablar con Groq o con Anthropic: se elige con el secreto
// IA_PROVEEDOR ("groq" o "anthropic") y, si no está, se usa el que tenga su clave cargada (primero Groq).
// Para sumar otro proveedor alcanza con agregarlo acá: el resto de la función no cambia.

export type Respuesta =
  | { ok: true; texto: string; cortado: boolean }
  | { ok: false; estado: number; tipo: string; mensaje: string }

export type Proveedor = {
  nombre: 'groq' | 'anthropic'
  modelo: string
  pedir: (instrucciones: string, mensaje: string, signal: AbortSignal) => Promise<Respuesta>
}

const env = (k: string) => Deno.env.get(k) || ''

// deno-lint-ignore no-explicit-any
const fallo = (estado: number, detalle: any): Respuesta => ({ ok: false, estado, tipo: String(detalle?.error?.type || detalle?.error?.code || ''), mensaje: String(detalle?.error?.message || '') })

// Groq: API con el formato de OpenAI. El plan gratis tiene tope de pedidos y de tokens por minuto y por día.
function groq(clave: string): Proveedor {
  const modelo = env('GROQ_MODEL') || 'openai/gpt-oss-120b'
  const url = env('GROQ_URL') || 'https://api.groq.com/openai/v1/chat/completions'
  // Los modelos gpt-oss "piensan" antes de responder: se les pide poco razonamiento y que no lo devuelvan
  const razona = modelo.startsWith('openai/gpt-oss')
  return {
    nombre: 'groq', modelo,
    async pedir(instrucciones, mensaje, signal) {
      const r = await fetch(url, {
        method: 'POST', signal,
        headers: { 'content-type': 'application/json', authorization: `Bearer ${clave}` },
        body: JSON.stringify({
          model: modelo,
          max_completion_tokens: 1800,
          temperature: 0.4,
          ...(razona ? { reasoning_effort: 'low', include_reasoning: false } : {}),
          messages: [{ role: 'system', content: instrucciones }, { role: 'user', content: mensaje }],
        }),
      })
      const cuerpo = await r.json().catch(() => null)
      if (!r.ok) return fallo(r.status, cuerpo)
      const eleccion = cuerpo?.choices?.[0]
      return { ok: true, texto: String(eleccion?.message?.content || ''), cortado: eleccion?.finish_reason === 'length' }
    },
  }
}

// Anthropic (Claude): se paga por uso.
function anthropic(clave: string): Proveedor {
  const modelo = env('ANTHROPIC_MODEL') || 'claude-haiku-4-5-20251001'
  const url = env('ANTHROPIC_URL') || 'https://api.anthropic.com/v1/messages'
  return {
    nombre: 'anthropic', modelo,
    async pedir(instrucciones, mensaje, signal) {
      const r = await fetch(url, {
        method: 'POST', signal,
        headers: { 'content-type': 'application/json', 'x-api-key': clave, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: modelo, max_tokens: 900, system: instrucciones, messages: [{ role: 'user', content: mensaje }] }),
      })
      const cuerpo = await r.json().catch(() => null)
      if (!r.ok) return fallo(r.status, cuerpo)
      if (cuerpo?.stop_reason === 'refusal') return { ok: false, estado: 200, tipo: 'rechazo', mensaje: 'el modelo no quiso responder' }
      // deno-lint-ignore no-explicit-any
      const texto = (cuerpo?.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n')
      return { ok: true, texto, cortado: cuerpo?.stop_reason === 'max_tokens' }
    },
  }
}

// Devuelve el proveedor configurado, o null si no hay ninguna clave cargada.
export function proveedor(): Proveedor | null {
  const claves = { groq: env('GROQ_API_KEY'), anthropic: env('ANTHROPIC_API_KEY') }
  const pedido = env('IA_PROVEEDOR').toLowerCase()
  const cual = pedido === 'groq' || pedido === 'anthropic' ? pedido : claves.groq ? 'groq' : 'anthropic'
  if (!claves[cual]) return null
  return cual === 'groq' ? groq(claves.groq) : anthropic(claves.anthropic)
}

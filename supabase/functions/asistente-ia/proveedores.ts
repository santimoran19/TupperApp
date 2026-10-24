// Proveedores del chat (`asistente-ia`, 1.28). Prueba en orden hasta que uno responde: primero Gemini (cupo gratis grande),
// después Groq como respaldo (IA-02). Los dos hablan el formato de OpenAI (chat/completions).
// Secretos (alcanza con uno):
//   GEMINI_API_KEY   Google Gemini. OJO: en el plan gratis Google puede usar lo que se manda para mejorar sus productos.
//   GROQ_API_KEY     Groq (la misma que usa el análisis semanal)
// Opcionales: CHAT_ORDEN ("gemini,groq"), GEMINI_MODEL, GROQ_MODEL.
const env = (k: string) => Deno.env.get(k) || ''

export type Resultado = { ok: true; texto: string; proveedor: string } | { ok: false; estado: number; detalle: string }
type Mensaje = { role: 'system' | 'user' | 'assistant'; content: string }
type Config = { nombre: string; url: string; clave: string; modelo: string; extra: Record<string, unknown> }

function configuraciones(): Config[] {
  const lista: Config[] = []
  if (env('GEMINI_API_KEY'))
    lista.push({
      nombre: 'gemini',
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      clave: env('GEMINI_API_KEY'),
      modelo: env('GEMINI_MODEL') || 'gemini-3.1-flash-lite',
      extra: {},
    })
  if (env('GROQ_API_KEY')) {
    const modelo = env('GROQ_MODEL') || 'openai/gpt-oss-120b'
    lista.push({
      nombre: 'groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      clave: env('GROQ_API_KEY'),
      modelo,
      extra: modelo.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low', include_reasoning: false } : {},
    })
  }
  const orden = (env('CHAT_ORDEN') || 'gemini,groq').split(',').map((s) => s.trim())
  return lista.sort((a, b) => orden.indexOf(a.nombre) - orden.indexOf(b.nombre))
}

export const hayProveedores = () => configuraciones().length > 0

export async function conversar(mensajes: Mensaje[], signal: AbortSignal): Promise<Resultado> {
  let ultimo: Resultado = { ok: false, estado: 503, detalle: 'sin_configurar' }
  for (const c of configuraciones()) {
    try {
      const r = await fetch(c.url, {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/json', authorization: `Bearer ${c.clave}` },
        body: JSON.stringify({ model: c.modelo, messages: mensajes, temperature: 0.5, max_tokens: 700, ...c.extra }),
      })
      const cuerpo = await r.json().catch(() => null)
      if (!r.ok) {
        // Gemini a veces responde con una lista de errores
        const error = Array.isArray(cuerpo) ? cuerpo[0]?.error : cuerpo?.error
        ultimo = { ok: false, estado: r.status, detalle: `${c.nombre}: ${String(error?.message || r.statusText).slice(0, 200)}` }
        console.error('asistente-ia', c.nombre, c.modelo, ultimo.estado, ultimo.detalle)
        continue
      }
      const contenido = cuerpo?.choices?.[0]?.message?.content
      const texto = Array.isArray(contenido) ? contenido.map((p: { text?: string }) => p.text || '').join('') : String(contenido || '')
      if (texto.trim()) return { ok: true, texto, proveedor: c.nombre }
      ultimo = { ok: false, estado: 502, detalle: `${c.nombre}: respuesta vacía` }
    } catch (err) {
      // Si se acabó el tiempo no tiene sentido probar el siguiente
      if (err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')) throw err
      ultimo = { ok: false, estado: 502, detalle: `${c.nombre}: ${String(err).slice(0, 200)}` }
      console.error('asistente-ia', c.nombre, ultimo.detalle)
    }
  }
  return ultimo
}

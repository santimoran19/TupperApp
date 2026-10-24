// Proveedores de IA de `registrar-ia`, todos con plan gratis. Hay tres tareas y cada una prueba varios en orden hasta que uno responde:
//   - voz -> texto:  Groq (Whisper large v3 turbo) y, si falla o no está, Cloudflare Workers AI (Whisper)
//   - foto -> comida: Cloudflare Workers AI (no usa tus datos para entrenar), Groq (si hay un modelo con visión) y Gemini
//   - texto -> comida: Groq (gpt-oss) o, si no está, el mismo de visión de Cloudflare / Gemini sin imagen
// Los secretos que se cargan en Supabase (alcanza con uno de cada tarea):
//   GROQ_API_KEY                          voz y texto (la misma que usa el análisis semanal)
//   CF_ACCOUNT_ID y CF_API_TOKEN          foto, voz y texto en Cloudflare
//   GEMINI_API_KEY                        foto y texto en Gemini (OJO: en su plan gratis Google puede usar lo que se manda para mejorar sus productos)
// Opcionales: VISION_ORDEN ("cloudflare,groq,gemini"), GROQ_VISION_MODEL, CF_VISION_MODEL, GEMINI_MODEL, GROQ_MODEL.
const env = (k: string) => Deno.env.get(k) || ''

export type Resultado<T> = { ok: true; valor: T; proveedor: string } | { ok: false; estado: number; detalle: string }

type Mensaje = { role: 'system' | 'user'; content: string | Array<Record<string, unknown>> }

// Todos hablan el formato de OpenAI (chat/completions), así se escribe una sola vez
async function chat(url: string, clave: string, modelo: string, mensajes: Mensaje[], signal: AbortSignal, extra: Record<string, unknown> = {}) {
  const r = await fetch(url, {
    method: 'POST',
    signal,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${clave}` },
    body: JSON.stringify({ model: modelo, messages: mensajes, temperature: 0.2, max_tokens: 900, ...extra }),
  })
  const cuerpo = await r.json().catch(() => null)
  if (!r.ok) return { ok: false as const, estado: r.status, detalle: String(cuerpo?.error?.message || cuerpo?.errors?.[0]?.message || r.statusText).slice(0, 200) }
  const texto = cuerpo?.choices?.[0]?.message?.content
  const contenido = Array.isArray(texto) ? texto.map((p: { text?: string }) => p.text || '').join('') : String(texto || '')
  return { ok: true as const, texto: contenido }
}

type Config = { nombre: string; url: string; clave: string; modelo: string; vision: boolean }

function configuraciones(): Config[] {
  const lista: Config[] = []
  if (env('CF_ACCOUNT_ID') && env('CF_API_TOKEN'))
    lista.push({
      nombre: 'cloudflare',
      url: `https://api.cloudflare.com/client/v4/accounts/${env('CF_ACCOUNT_ID')}/ai/v1/chat/completions`,
      clave: env('CF_API_TOKEN'),
      modelo: env('CF_VISION_MODEL') || '@cf/meta/llama-4-scout-17b-16e-instruct',
      vision: true,
    })
  // Groq solo para fotos si se le indica un modelo con visión (los de visión de Groq cambian seguido)
  if (env('GROQ_API_KEY') && env('GROQ_VISION_MODEL'))
    lista.push({ nombre: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', clave: env('GROQ_API_KEY'), modelo: env('GROQ_VISION_MODEL'), vision: true })
  if (env('GEMINI_API_KEY'))
    lista.push({
      nombre: 'gemini',
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      clave: env('GEMINI_API_KEY'),
      modelo: env('GEMINI_MODEL') || 'gemini-3.1-flash-lite',
      vision: true,
    })
  const orden = (env('VISION_ORDEN') || 'cloudflare,groq,gemini').split(',').map((s) => s.trim())
  return lista.sort((a, b) => orden.indexOf(a.nombre) - orden.indexOf(b.nombre))
}

// Foto -> texto con los ítems (JSON en texto; lo interpreta logica.ts)
export async function leerFoto(instrucciones: string, dataUrl: string, signal: AbortSignal): Promise<Resultado<string>> {
  let ultimo = { estado: 503, detalle: 'sin_configurar' }
  for (const c of configuraciones().filter((c) => c.vision)) {
    const r = await chat(
      c.url,
      c.clave,
      c.modelo,
      [
        { role: 'system', content: instrucciones },
        { role: 'user', content: [{ type: 'text', text: 'Esta es la foto de lo que voy a comer. Listá qué hay en el plato.' }, { type: 'image_url', image_url: { url: dataUrl } }] },
      ],
      signal,
    )
    if (r.ok && r.texto) return { ok: true, valor: r.texto, proveedor: c.nombre }
    ultimo = r.ok ? { estado: 502, detalle: 'respuesta_vacia' } : { estado: r.estado, detalle: `${c.nombre}: ${r.detalle}` }
    console.error('registrar-ia foto', c.nombre, c.modelo, ultimo.estado, ultimo.detalle)
  }
  return { ok: false, ...ultimo }
}

// Texto -> ítems. Primero Groq (rápido y con cupo grande); si no, los de Cloudflare / Gemini sin imagen.
// `maxTokens`: la receta (1.29) necesita más lugar que una comida
export async function leerTexto(instrucciones: string, texto: string, signal: AbortSignal, maxTokens = 900): Promise<Resultado<string>> {
  let ultimo = { estado: 503, detalle: 'sin_configurar' }
  const intentos: Config[] = []
  if (env('GROQ_API_KEY'))
    intentos.push({ nombre: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', clave: env('GROQ_API_KEY'), modelo: env('GROQ_MODEL') || 'openai/gpt-oss-120b', vision: false })
  intentos.push(...configuraciones())
  for (const c of intentos) {
    const razona = c.modelo.startsWith('openai/gpt-oss')
    const r = await chat(c.url, c.clave, c.modelo, [{ role: 'system', content: instrucciones }, { role: 'user', content: texto }], signal, { max_tokens: maxTokens, ...(razona ? { reasoning_effort: 'low', include_reasoning: false } : {}) })
    if (r.ok && r.texto) return { ok: true, valor: r.texto, proveedor: c.nombre }
    ultimo = r.ok ? { estado: 502, detalle: 'respuesta_vacia' } : { estado: r.estado, detalle: `${c.nombre}: ${r.detalle}` }
    console.error('registrar-ia texto', c.nombre, c.modelo, ultimo.estado, ultimo.detalle)
  }
  return { ok: false, ...ultimo }
}

// Voz -> texto
export async function transcribir(bytes: Uint8Array, tipo: string, pista: string, signal: AbortSignal): Promise<Resultado<string>> {
  let ultimo = { estado: 503, detalle: 'sin_configurar' }
  if (env('GROQ_API_KEY')) {
    const extension = tipo.includes('mp4') || tipo.includes('m4a') || tipo.includes('aac') ? 'm4a' : tipo.includes('ogg') ? 'ogg' : tipo.includes('wav') ? 'wav' : tipo.includes('mpeg') ? 'mp3' : 'webm'
    const form = new FormData()
    form.append('file', new Blob([bytes], { type: tipo }), `voz.${extension}`)
    form.append('model', env('GROQ_WHISPER_MODEL') || 'whisper-large-v3-turbo')
    form.append('language', 'es')
    form.append('temperature', '0')
    form.append('prompt', pista)
    form.append('response_format', 'json')
    const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', { method: 'POST', signal, headers: { authorization: `Bearer ${env('GROQ_API_KEY')}` }, body: form })
    const cuerpo = await r.json().catch(() => null)
    if (r.ok && typeof cuerpo?.text === 'string') return { ok: true, valor: cuerpo.text.trim(), proveedor: 'groq' }
    ultimo = { estado: r.status, detalle: `groq: ${String(cuerpo?.error?.message || r.statusText).slice(0, 200)}` }
    console.error('registrar-ia voz groq', ultimo.estado, ultimo.detalle)
  }
  if (env('CF_ACCOUNT_ID') && env('CF_API_TOKEN')) {
    let binario = ''
    for (let i = 0; i < bytes.length; i += 0x8000) binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
    const modelo = env('CF_WHISPER_MODEL') || '@cf/openai/whisper-large-v3-turbo'
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env('CF_ACCOUNT_ID')}/ai/run/${modelo}`, {
      method: 'POST',
      signal,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${env('CF_API_TOKEN')}` },
      body: JSON.stringify({ audio: btoa(binario), language: 'es' }),
    })
    const cuerpo = await r.json().catch(() => null)
    const texto = cuerpo?.result?.text
    if (r.ok && typeof texto === 'string') return { ok: true, valor: texto.trim(), proveedor: 'cloudflare' }
    ultimo = { estado: r.status, detalle: `cloudflare: ${String(cuerpo?.errors?.[0]?.message || r.statusText).slice(0, 200)}` }
    console.error('registrar-ia voz cloudflare', ultimo.estado, ultimo.detalle)
  }
  return { ok: false, ...ultimo }
}

export const hayProveedores = () => !!(env('GROQ_API_KEY') || (env('CF_ACCOUNT_ID') && env('CF_API_TOKEN')) || env('GEMINI_API_KEY'))

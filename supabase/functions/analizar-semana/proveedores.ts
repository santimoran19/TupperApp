// Proveedores de IA. La función puede hablar con Groq, Gemini o Anthropic: el primero se elige con el secreto IA_PROVEEDOR
// ("groq", "gemini" o "anthropic") y, si no está, se usa el que tenga su clave cargada (primero Groq).
// Respaldo (1.28, IA-02): si el primero falla (saturado, sin cupo, caído), se prueba con los otros que tengan clave.
// Para sumar otro proveedor alcanza con agregarlo acá: el resto de la función no cambia.

export type Respuesta =
  | { ok: true; texto: string; cortado: boolean }
  | { ok: false; estado: number; tipo: string; mensaje: string }

export type Proveedor = {
  nombre: 'groq' | 'gemini' | 'anthropic'
  modelo: string
  pedir: (instrucciones: string, mensaje: string, signal: AbortSignal) => Promise<Respuesta>
}

const env = (k: string) => Deno.env.get(k) || ''

// deno-lint-ignore no-explicit-any
const fallo = (estado: number, detalle: any): Respuesta => {
  const error = Array.isArray(detalle) ? detalle[0]?.error : detalle?.error
  return { ok: false, estado, tipo: String(error?.type || error?.code || error?.status || ''), mensaje: String(error?.message || '') }
}

// Los que hablan el formato de OpenAI (Groq y Gemini)
function compatible(nombre: 'groq' | 'gemini', clave: string, url: string, modelo: string): Proveedor {
  // Los modelos gpt-oss "piensan" antes de responder: se les pide poco razonamiento y que no lo devuelvan
  const razona = modelo.startsWith('openai/gpt-oss')
  return {
    nombre,
    modelo,
    async pedir(instrucciones, mensaje, signal) {
      const r = await fetch(url, {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/json', authorization: `Bearer ${clave}` },
        body: JSON.stringify({
          model: modelo,
          ...(nombre === 'groq' ? { max_completion_tokens: 1800 } : { max_tokens: 1800 }),
          temperature: 0.4,
          ...(razona ? { reasoning_effort: 'low', include_reasoning: false } : {}),
          messages: [
            { role: 'system', content: instrucciones },
            { role: 'user', content: mensaje },
          ],
        }),
      })
      const cuerpo = await r.json().catch(() => null)
      if (!r.ok) return fallo(r.status, cuerpo)
      const eleccion = cuerpo?.choices?.[0]
      return { ok: true, texto: String(eleccion?.message?.content || ''), cortado: eleccion?.finish_reason === 'length' }
    },
  }
}

// Groq: API con el formato de OpenAI. El plan gratis tiene tope de pedidos y de tokens por minuto y por día.
const groq = (clave: string) =>
  compatible('groq', clave, env('GROQ_URL') || 'https://api.groq.com/openai/v1/chat/completions', env('GROQ_MODEL') || 'openai/gpt-oss-120b')

// Gemini (Google), por su API compatible con OpenAI. Cupo gratis amplio; en el plan gratis Google puede usar lo enviado
// para mejorar sus productos (lo dice la Política de privacidad).
const gemini = (clave: string) =>
  compatible(
    'gemini',
    clave,
    env('GEMINI_URL') || 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    env('GEMINI_MODEL') || 'gemini-3.1-flash-lite',
  )

// Anthropic (Claude): se paga por uso.
function anthropic(clave: string): Proveedor {
  const modelo = env('ANTHROPIC_MODEL') || 'claude-haiku-4-5-20251001'
  const url = env('ANTHROPIC_URL') || 'https://api.anthropic.com/v1/messages'
  return {
    nombre: 'anthropic',
    modelo,
    async pedir(instrucciones, mensaje, signal) {
      const r = await fetch(url, {
        method: 'POST',
        signal,
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

const FABRICAS = { groq, gemini, anthropic } as const
type Nombre = keyof typeof FABRICAS
const CLAVES: Record<Nombre, string> = { groq: 'GROQ_API_KEY', gemini: 'GEMINI_API_KEY', anthropic: 'ANTHROPIC_API_KEY' }

// El principal (el pedido en IA_PROVEEDOR o, si no hay, el primero con clave) y después los de respaldo, que son solo los
// gratis (Groq y Gemini): Anthropic se paga, así que nunca entra de respaldo. Si se pidió uno sin clave, ninguno.
export function proveedores(): Proveedor[] {
  const pedido = env('IA_PROVEEDOR').toLowerCase() as Nombre
  const orden: Nombre[] = ['groq', 'gemini', 'anthropic']
  const principal = orden.includes(pedido) ? pedido : orden.find((n) => env(CLAVES[n]))
  if (!principal || !env(CLAVES[principal])) return []
  const respaldo = (['groq', 'gemini'] as Nombre[]).filter((n) => n !== principal && env(CLAVES[n]))
  return [principal, ...respaldo].map((n) => FABRICAS[n](env(CLAVES[n])))
}

// Devuelve el proveedor configurado (o una cadena que prueba uno atrás del otro), o null si no hay ninguna clave cargada.
// `nombre` y `modelo` quedan con los del que respondió.
export function proveedor(): Proveedor | null {
  const lista = proveedores()
  if (lista.length <= 1) return lista[0] || null
  const cadena: Proveedor = {
    nombre: lista[0].nombre,
    modelo: lista[0].modelo,
    async pedir(instrucciones, mensaje, signal) {
      let ultima: Respuesta = { ok: false, estado: 503, tipo: '', mensaje: 'sin proveedores' }
      for (const p of lista) {
        let r: Respuesta
        try {
          r = await p.pedir(instrucciones, mensaje, signal)
        } catch (err) {
          // Si se acabó el tiempo no tiene sentido seguir probando
          if (err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')) throw err
          r = { ok: false, estado: 502, tipo: 'red', mensaje: String(err) }
        }
        if (r.ok) {
          cadena.nombre = p.nombre
          cadena.modelo = p.modelo
          return r
        }
        console.error('IA: falló', p.nombre, p.modelo, r.estado, r.tipo, r.mensaje)
        ultima = r
        // Si el modelo se negó a responder, otro no va a cambiar eso
        if (r.tipo === 'rechazo') return r
      }
      return ultima
    },
  }
  return cadena
}

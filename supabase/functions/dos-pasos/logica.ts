// Lo que no depende de Supabase en la función `dos-pasos` (1.32, S-08), para probarlo aparte (pruebas/unidad/novedades-132.test.js).

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

// ---------- Los códigos ----------
// 8 letras y números, sin los que se confunden (0 y O, 1 e I y L): unos 40 bits cada uno. Se muestran como ABCD-EFGH.
export const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const CUANTOS = 10
export const MAX_INTENTOS_POR_HORA = 5

export const ACCIONES = ['estado', 'generar', 'usar'] as const
export const esAccion = (a: unknown): a is (typeof ACCIONES)[number] => ACCIONES.includes(a as never)

// Un código como lo escriba la persona (con o sin guion, en minúscula, con espacios) pasa a la forma guardada
export const normalizar = (c: unknown) =>
  String(c ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
export const codigoValido = (c: unknown) => new RegExp(`^[${ALFABETO}]{8}$`).test(normalizar(c))

// `azar(n)` devuelve n bytes al azar (crypto.getRandomValues); se pasa aparte para poder probarlo
export function generarCodigos(azar: (n: number) => Uint8Array, cuantos = CUANTOS): string[] {
  const salida = new Set<string>()
  while (salida.size < cuantos) {
    let c = ''
    // Se descartan los bytes que darían más peso a unas letras que a otras
    while (c.length < 8) {
      for (const b of azar(16)) {
        if (b >= 256 - (256 % ALFABETO.length)) continue
        c += ALFABETO[b % ALFABETO.length]
        if (c.length === 8) break
      }
    }
    salida.add(`${c.slice(0, 4)}-${c.slice(4)}`)
  }
  return [...salida]
}

// La huella que se guarda: sha-256 de la cuenta y el código (sin el código no se puede saber cuál era)
export async function huella(usuario: string, codigo: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${usuario}:${normalizar(codigo)}`)))
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// El nivel de la sesión que viene en el permiso (JWT)
export function nivelDe(token: string): string {
  try {
    const json = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return json.aal || 'aal1'
  } catch {
    return 'aal1'
  }
}

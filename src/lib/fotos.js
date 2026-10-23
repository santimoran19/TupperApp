// Fotos de alimentos y recetas (1.24). Viven en Supabase Storage, en el lugar "fotos" (supabase/actualizacion-19.sql):
//   base/<slug>.webp        las de la base, generadas con IA (scripts/fotos-ia.mjs)
//   u/<id>/<código>.webp    las que sube cada persona; solo ella las puede subir o borrar
// Antes de subir, la foto se achica en el teléfono a un cuadrado de 640 px (pesa unos 40 a 90 KB): sube rápido y no gasta
// datos. Si el navegador no sabe hacer WebP (Safari viejo), va en JPEG.
import { supabase } from './supabase'

export const LADO = 640
export const PESO_MAXIMO = 280 * 1024 // la base acepta hasta 300 KB
export const TIPOS_ACEPTADOS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif', 'image/avif']

// La dirección pública de una foto (o null)
export function urlDeFoto(ruta) {
  if (!ruta) return null
  return supabase.storage.from('fotos').getPublicUrl(ruta).data.publicUrl
}

// El recorte cuadrado del centro de una imagen de ancho × alto: { sx, sy, lado }
export function recorteCuadrado(ancho, alto) {
  const lado = Math.min(ancho, alto)
  return { sx: Math.round((ancho - lado) / 2), sy: Math.round((alto - lado) / 2), lado }
}

// Una ruta nueva para la foto de una persona: u/<id>/<código al azar>.<extensión>
export function rutaNueva(uid, tipo) {
  const codigo = crypto.randomUUID().replaceAll('-', '').slice(0, 24)
  return `u/${uid}/${codigo}.${tipo === 'image/jpeg' ? 'jpg' : 'webp'}`
}

const comoBlob = (lienzo, tipo, calidad) => new Promise((ok) => lienzo.toBlob(ok, tipo, calidad))

// Achica y recorta la foto en el teléfono. Devuelve { blob, tipo }. Si no es una imagen que el navegador sepa abrir, tira
// un error con un texto para la persona.
export async function achicarFoto(archivo) {
  if (!archivo || (archivo.type && !archivo.type.startsWith('image/'))) throw new Error('Eso no es una foto. Elegí una imagen.')
  if (archivo.size > 25 * 1024 * 1024) throw new Error('La foto es demasiado grande (más de 25 MB).')
  let imagen
  try {
    imagen = await createImageBitmap(archivo)
  } catch {
    throw new Error('No se pudo abrir esa foto. Probá con otra o sacala de nuevo.')
  }
  const { sx, sy, lado } = recorteCuadrado(imagen.width, imagen.height)
  const salida = Math.min(LADO, lado)
  const lienzo = document.createElement('canvas')
  lienzo.width = salida
  lienzo.height = salida
  const ctx = lienzo.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(imagen, sx, sy, lado, lado, 0, 0, salida, salida)
  imagen.close?.()
  // Primero WebP; si el navegador devuelve otra cosa (no lo sabe hacer), JPEG. Se baja la calidad hasta que entre.
  for (const tipo of ['image/webp', 'image/jpeg']) {
    for (const calidad of [0.82, 0.7, 0.55, 0.4]) {
      const blob = await comoBlob(lienzo, tipo, calidad)
      if (!blob || blob.type !== tipo) break
      if (blob.size <= PESO_MAXIMO) return { blob, tipo }
    }
  }
  throw new Error('No se pudo preparar la foto. Probá con otra.')
}

// Sube una foto ya achicada y devuelve su ruta
export async function subirFoto(uid, { blob, tipo }) {
  const ruta = rutaNueva(uid, tipo)
  const { error } = await supabase.storage.from('fotos').upload(ruta, blob, { contentType: tipo, upsert: false, cacheControl: '31536000' })
  if (error) throw Object.assign(new Error(textoDeError(error)), { sinConexion: esDeRed(error) })
  return ruta
}

// Borra fotos propias (las de la base no se tocan). No falla si ya no estaban.
export async function borrarFotos(rutas, uid) {
  const propias = (rutas || []).filter((r) => r && r.startsWith(`u/${uid}/`))
  if (propias.length === 0) return
  const { error } = await supabase.storage.from('fotos').remove(propias)
  if (error) throw new Error(textoDeError(error))
}

// Todas las fotos de una persona (para borrar la cuenta). Vienen de a 1000.
export async function rutasDe(uid) {
  const rutas = []
  for (let desde = 0; ; desde += 1000) {
    const { data, error } = await supabase.storage.from('fotos').list(`u/${uid}`, { limit: 1000, offset: desde })
    // Sin el lugar de fotos creado (falta actualizacion-19.sql) no hay nada que borrar
    if (error && /bucket not found/i.test(error.message || '')) return rutas
    if (error) throw new Error(textoDeError(error))
    rutas.push(...(data || []).map((x) => `u/${uid}/${x.name}`))
    if (!data || data.length < 1000) return rutas
  }
}

const esDeRed = (e) => /failed to fetch|networkerror|load failed|network/i.test(e?.message || '')
function textoDeError(e) {
  if (esDeRed(e)) return 'Para subir o borrar fotos necesitás conexión.'
  const m = String(e?.message || '')
  if (/exceeded the maximum|too large/i.test(m)) return 'La foto pesa demasiado.'
  if (/mime type/i.test(m)) return 'Ese tipo de imagen no se puede guardar.'
  return 'No se pudo guardar la foto. Probá de nuevo.'
}

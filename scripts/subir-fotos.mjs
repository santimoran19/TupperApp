// Sube a Supabase las fotos que hiciste vos con otra IA (1.26) y las asocia al alimento o la receta.
//
// Cómo se usa:
//   1. Juntá las imágenes en una carpeta (por ejemplo fotos/). Cada archivo se llama como el "slug" de la receta o del alimento:
//        milanesa-de-pollo-al-horno.jpg   (también vale .png o .webp). La lista de slugs con el texto sugerido para pedirle a la
//        IA sale de:  node scripts/pedidos-fotos.mjs
//   2. Una sola vez:  npm i --no-save sharp
//   3. Corré (la clave service_role está en Supabase > Project Settings > API; es secreta, no la pegues en el código):
//        SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... node scripts/subir-fotos.mjs fotos/
//   Opciones:
//        --prueba   no sube nada: revisa los nombres, achica y te dice qué haría
//   Las que ya estaban se reemplazan. Las que ya se subieron se mueven a fotos/subidas/ así no se repiten.
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { foodsTodos as foods, recipesTodas as recipes } from './seed-sexta.mjs'

const args = process.argv.slice(2)
const PRUEBA = args.includes('--prueba')
const carpeta = args.find((a) => !a.startsWith('--'))
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: CLAVE } = process.env

if (!carpeta || !existsSync(carpeta)) {
  console.error('Pasame la carpeta con las fotos:  node scripts/subir-fotos.mjs fotos/   (agregá --prueba para ensayar)')
  process.exit(1)
}
if (!PRUEBA && (!SUPABASE_URL || !CLAVE)) {
  console.error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY. Mirá las instrucciones al principio de scripts/subir-fotos.mjs')
  process.exit(1)
}
let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('Falta sharp. Corré primero:  npm i --no-save sharp')
  process.exit(1)
}

const deReceta = new Set(recipes.map((r) => r.slug))
const deAlimento = new Set(foods.map((f) => f[0]))
// Si un mismo slug existe como receta y como alimento, se pide el prefijo: receta--<slug> o alimento--<slug>
const quien = (nombre) => {
  const m = nombre.match(/^(receta|alimento)--(.+)$/)
  if (m) return { tipo: m[1], slug: m[2] }
  if (deReceta.has(nombre) && deAlimento.has(nombre)) return { ambiguo: true }
  if (deReceta.has(nombre)) return { tipo: 'receta', slug: nombre }
  if (deAlimento.has(nombre)) return { tipo: 'alimento', slug: nombre }
  return null
}

const achicar = (bytes) => sharp(bytes).rotate().resize(640, 640, { fit: 'cover' }).webp({ quality: 82 }).toBuffer()

async function subir(ruta, bytes) {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/fotos/${ruta}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLAVE}`,
      apikey: CLAVE,
      'Content-Type': 'image/webp',
      'x-upsert': 'true',
      'cache-control': '31536000',
    },
    body: bytes,
  })
  if (!r.ok) throw new Error(`Storage respondió ${r.status}: ${(await r.text()).slice(0, 200)}`)
}

async function vincular(tipo, slug, ruta) {
  const tabla = tipo === 'receta' ? 'recipes' : 'foods'
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${tabla}?slug=eq.${encodeURIComponent(slug)}&owner=is.null`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${CLAVE}`, apikey: CLAVE, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ image_path: ruta }),
  })
  if (!r.ok) throw new Error(`Supabase respondió ${r.status}: ${(await r.text()).slice(0, 200)}`)
  if ((await r.json()).length === 0) throw new Error('no está en la base (¿corriste el seed de esa tanda?)')
}

const archivos = readdirSync(carpeta).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
if (!archivos.length) {
  console.log('No hay imágenes .jpg, .png ni .webp en esa carpeta.')
  process.exit(0)
}
if (!PRUEBA) mkdirSync(join(carpeta, 'subidas'), { recursive: true })
let ok = 0
const mal = []
for (const f of archivos) {
  const nombre = basename(f, extname(f)).toLowerCase()
  const q = quien(nombre)
  if (!q || q.ambiguo) {
    mal.push(
      `${f}: ${q ? 'el slug está como receta y como alimento; llamalo receta--' + nombre + ' o alimento--' + nombre : 'no hay ninguna receta ni alimento con ese nombre'}`,
    )
    continue
  }
  try {
    const webp = await achicar(readFileSync(join(carpeta, f)))
    if (webp.length > 300 * 1024) throw new Error(`pesa ${Math.round(webp.length / 1024)} KB (el máximo es 300)`)
    if (!PRUEBA) {
      const ruta = `base/${q.slug}.webp`
      await subir(ruta, webp)
      await vincular(q.tipo, q.slug, ruta)
      renameSync(join(carpeta, f), join(carpeta, 'subidas', f))
    }
    ok++
    console.log(`${PRUEBA ? 'ok (prueba)' : 'subida'} · ${q.tipo} · ${q.slug} · ${Math.round(webp.length / 1024)} KB`)
  } catch (e) {
    mal.push(`${f}: ${e.message}`)
  }
}
console.log(
  `\n${ok} ${PRUEBA ? 'quedarían subidas' : 'subidas'}${mal.length ? `, ${mal.length} con problemas:\n- ${mal.join('\n- ')}` : '.'}`,
)

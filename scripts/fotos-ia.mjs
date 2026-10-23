// Genera con IA las fotos de los alimentos y recetas de la base y las sube a Supabase (1.24).
// Usa Cloudflare Workers AI (modelo FLUX.1 schnell), que tiene un plan gratis por día: si se termina el cupo, el script
// para solo y la próxima vez sigue donde quedó (anota lo hecho en .fotos-ia.json, que no se sube al repositorio).
//
// Lo corrés vos, en tu compu, una vez (o de a tandas). Antes:
//   1. Instalá el achicador de imágenes, sin guardarlo en el proyecto:   npm i --no-save sharp
//   2. En Cloudflare: el "Account ID" (aparece en el panel) y un token de API con permiso "Workers AI: Read" y "Edit".
//   3. En Supabase: Project Settings > API > la clave "service_role" (es secreta: no la pegues en el código ni la subas).
//   4. Corré actualizacion-19.sql (crea el lugar "fotos").
// Después, en la carpeta del proyecto:
//   CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... node scripts/fotos-ia.mjs
// Opciones:
//   --prueba        no sube nada: guarda las fotos en la carpeta fotos-ia/ para mirarlas antes
//   --solo recetas  o  --solo alimentos
//   --limite 20     cuántas hacer en esta tanda
//   --slug huevo    rehace una sola (aunque ya estuviera hecha); se puede repetir
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { foodsTodos as foods, recipesTodas as recipes } from './seed-sexta.mjs'

const args = process.argv.slice(2)
const opcion = (n) => {
  const i = args.indexOf(n)
  return i === -1 ? null : args[i + 1]
}
const PRUEBA = args.includes('--prueba')
const SOLO = opcion('--solo')
const LIMITE = Number(opcion('--limite')) || Infinity
const SLUGS = args.flatMap((a, i) => (a === '--slug' ? [args[i + 1]] : []))

const { CLOUDFLARE_ACCOUNT_ID: CUENTA, CLOUDFLARE_API_TOKEN: TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: CLAVE } = process.env
const falta = [
  !CUENTA && 'CLOUDFLARE_ACCOUNT_ID',
  !TOKEN && 'CLOUDFLARE_API_TOKEN',
  !PRUEBA && !SUPABASE_URL && 'SUPABASE_URL',
  !PRUEBA && !CLAVE && 'SUPABASE_SERVICE_ROLE_KEY',
].filter(Boolean)
if (falta.length) {
  console.error('Faltan estas variables: ' + falta.join(', ') + '. Mirá las instrucciones al principio de scripts/fotos-ia.mjs')
  process.exit(1)
}
let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('Falta sharp. Corré primero:  npm i --no-save sharp')
  process.exit(1)
}

// ---------- Qué se le pide a la IA ----------
// Todas con la misma luz y el mismo fondo verde muy claro (el de la app), así la despensa se ve pareja.
const ESTILO =
  'professional food photography, soft natural daylight, plain very light sage green background, centered, ' +
  'shallow depth of field, appetizing, realistic, high detail, no text, no labels, no logos, no hands, no people'
const CATEGORIA_EN = {
  'Carnes y huevos': 'raw meat or eggs as sold at an Argentine butcher shop, on a wooden board',
  Pescados: 'fish or seafood',
  Lácteos: 'dairy product in a simple unbranded container or glass',
  Verduras: 'fresh vegetable',
  Frutas: 'fresh fruit',
  'Pastas y arroz': 'dry pasta or rice in a small bowl',
  Legumbres: 'legumes in a small bowl',
  Panadería: 'bread or bakery item from an Argentine bakery',
  Cereales: 'breakfast cereal or oats in a small bowl',
  Enlatados: 'canned food served in a small bowl next to an unbranded can',
  'Salsas y aderezos': 'sauce or dressing in a small bowl',
  Despensa: 'pantry staple',
  'Snacks y dulces': 'snack or sweet',
  Congelados: 'frozen food',
  'Comidas hechas': 'ready meal on a plate',
  Bebidas: 'drink in a clear unbranded glass',
}
const nombreDe = new Map(foods.map((f) => [f[0], f[1]]))
const sinParentesis = (t) => t.replace(/\s*\(.*?\)\s*/g, ' ').trim()

function pedido(item) {
  if (item.tipo === 'receta') {
    const ingredientes = (item.items || [])
      .map(([slug]) => nombreDe.get(slug))
      .filter(Boolean)
      .slice(0, 5)
      .map(sinParentesis)
    return (
      `A home-cooked Argentine dish called "${item.nombre}"` +
      (ingredientes.length ? ` (made with ${ingredientes.join(', ')})` : '') +
      `, one portion served on a simple white plate, seen from a 45 degree angle, ${ESTILO}`
    )
  }
  // Lo que ya viene cocido se muestra servido; lo crudo, como se compra
  const cocido = /cocid|al horno|asad|frit|hervid|milanesa|plancha|guiso|relleno|tostad|pure|pur[eé]/i.test(item.nombre)
  const como = cocido ? 'cooked and served simply on a small white plate' : CATEGORIA_EN[item.categoria] || 'food'
  return `"${sinParentesis(item.nombre)}", ${como}, a single typical portion, ${ESTILO}`
}

// ---------- La lista ----------
const lista = [
  ...(SOLO === 'alimentos' ? [] : recipes.map((r) => ({ tipo: 'receta', slug: r.slug, nombre: r.name, items: r.items }))),
  ...(SOLO === 'recetas' ? [] : foods.map((f) => ({ tipo: 'alimento', slug: f[0], nombre: f[1], categoria: f[9] }))),
].filter((x) => SLUGS.length === 0 || SLUGS.includes(x.slug))

const REGISTRO = new URL('../.fotos-ia.json', import.meta.url)
const hechas = existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, 'utf8')) : {}
const anotar = (clave) => {
  hechas[clave] = new Date().toISOString()
  writeFileSync(REGISTRO, JSON.stringify(hechas, null, 1))
}

// ---------- Generar, achicar, subir ----------
async function generar(texto, semilla) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CUENTA}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: texto, steps: 6, seed: semilla }),
  })
  const cuerpo = await r.json().catch(() => ({}))
  if (!r.ok) {
    const msj = JSON.stringify(cuerpo.errors || cuerpo).slice(0, 300)
    throw Object.assign(new Error(`Cloudflare respondió ${r.status}: ${msj}`), {
      cupo: r.status === 429 || /limit|neuron|quota/i.test(msj),
    })
  }
  const base64 = cuerpo.result?.image || cuerpo.image
  if (!base64) throw new Error('Cloudflare no devolvió una imagen')
  return Buffer.from(base64, 'base64')
}

const achicar = (bytes) => sharp(bytes).resize(640, 640, { fit: 'cover' }).webp({ quality: 80 }).toBuffer()

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
  if (!r.ok) throw new Error(`Supabase Storage respondió ${r.status}: ${(await r.text()).slice(0, 200)}`)
}

async function vincular(item, ruta) {
  const tabla = item.tipo === 'receta' ? 'recipes' : 'foods'
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${tabla}?slug=eq.${encodeURIComponent(item.slug)}&owner=is.null`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${CLAVE}`, apikey: CLAVE, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ image_path: ruta }),
  })
  if (!r.ok) throw new Error(`Supabase respondió ${r.status}: ${(await r.text()).slice(0, 200)}`)
}

if (PRUEBA) mkdirSync(new URL('../fotos-ia/', import.meta.url), { recursive: true })
let hechasAhora = 0
let fallas = 0
for (const item of lista) {
  const clave = `${item.tipo}:${item.slug}`
  if (!SLUGS.length && hechas[clave] && !PRUEBA) continue
  if (hechasAhora >= LIMITE) break
  const ruta = `base/${item.slug}.webp`
  try {
    // La semilla sale del slug: si se rehace, da una foto parecida (y con --slug se puede cambiar el texto y probar)
    const semilla = [...item.slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 100000
    const webp = await achicar(await generar(pedido(item), semilla))
    if (PRUEBA) writeFileSync(new URL(`../fotos-ia/${item.slug}.webp`, import.meta.url), webp)
    else {
      await subir(ruta, webp)
      await vincular(item, ruta)
      anotar(clave)
    }
    hechasAhora++
    console.log(`ok ${hechasAhora} · ${item.tipo} · ${item.nombre}`)
  } catch (err) {
    if (err.cupo) {
      console.log(
        `\nSe terminó el cupo gratis de Cloudflare por hoy. Hechas en esta tanda: ${hechasAhora}. Corrélo de nuevo mañana: sigue donde quedó.`,
      )
      process.exit(0)
    }
    fallas++
    console.log(`FALLÓ · ${item.nombre}: ${err.message}`)
    if (fallas >= 5 && hechasAhora === 0) {
      console.log('Fallaron las primeras 5: revisá las claves y que hayas corrido actualizacion-19.sql.')
      process.exit(1)
    }
  }
}
const quedan = lista.filter((x) => !hechas[`${x.tipo}:${x.slug}`]).length
console.log(
  `\nListo: ${hechasAhora} fotos en esta tanda${fallas ? `, ${fallas} fallaron (se reintentan la próxima vez)` : ''}.${PRUEBA ? ' Quedaron en fotos-ia/.' : ` Faltan ${quedan}.`}`,
)

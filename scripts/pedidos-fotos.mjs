// Arma la lista de lo que falta fotografiar, con el texto sugerido para pedirle la imagen a una IA (1.26).
//   node scripts/pedidos-fotos.mjs                  → escribe fotos-pedidos.csv (slug, tipo, nombre, pedido) con TODO
//   node scripts/pedidos-fotos.mjs --solo recetas   → solo recetas  (o  --solo alimentos)
//   node scripts/pedidos-fotos.mjs --limite 50      → solo las primeras 50
// Cada imagen que generes la guardás como <slug>.jpg (o .png / .webp) y las subís con scripts/subir-fotos.mjs.
import { writeFileSync } from 'node:fs'
import { foodsTodos as foods, recipesTodas as recipes } from './seed-sexta.mjs'

const args = process.argv.slice(2)
const opcion = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null)
const SOLO = opcion('--solo')
const LIMITE = Number(opcion('--limite')) || Infinity

const ESTILO =
  'professional food photography, soft natural daylight, plain very light sage green background, square 1:1 framing, ' +
  'seen from a 45 degree angle, appetizing, realistic, high detail, no text, no logos, no hands, no people'
const nombreDe = new Map(foods.map((f) => [f[0], f[1]]))
const limpio = (t) => t.replace(/\s*\(.*?\)\s*/g, ' ').trim()
const cocido = /cocid|al horno|asad|frit|hervid|milanesa|plancha|guiso|relleno|tostad|pure|pur[eé]/i

const filas = [
  ...(SOLO === 'alimentos'
    ? []
    : recipes.map((r) => {
        const ing = (r.items || [])
          .map(([s]) => nombreDe.get(s))
          .filter(Boolean)
          .slice(0, 5)
          .map(limpio)
        return [
          r.slug,
          'receta',
          r.name,
          `A home-cooked Argentine dish: "${r.name}"${ing.length ? ` (ingredients: ${ing.join(', ')})` : ''}, one portion on a simple white plate, ${ESTILO}`,
        ]
      })),
  ...(SOLO === 'recetas'
    ? []
    : foods.map((f) => [
        f[0],
        'alimento',
        f[1],
        `"${limpio(f[1])}", ${cocido.test(f[1]) ? 'cooked and served simply on a small white plate' : 'as sold at an Argentine shop, unbranded'}, a single typical portion, ${ESTILO}`,
      ])),
].slice(0, LIMITE)

const csv = (c) => `"${String(c).replaceAll('"', '""')}"`
writeFileSync('fotos-pedidos.csv', 'slug,tipo,nombre,pedido\n' + filas.map((f) => f.map(csv).join(',')).join('\n') + '\n')
console.log(`fotos-pedidos.csv: ${filas.length} filas`)

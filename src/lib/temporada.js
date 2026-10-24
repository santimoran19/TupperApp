// Frutas y verduras de estación en Argentina (1.31, F-24), mes a mes, según los calendarios de los mercados centrales
// (zona centro del país: Buenos Aires, Córdoba, Santa Fe). En estación suelen estar más ricas y más baratas. Es orientativo:
// cambia un poco con la región y el año.
const MESES = [
  // enero
  {
    frutas: ['durazno', 'ciruela', 'damasco', 'sandía', 'melón', 'cereza'],
    verduras: ['tomate', 'zapallito', 'berenjena', 'morrón', 'choclo', 'pepino', 'chaucha'],
  },
  // febrero
  {
    frutas: ['uva', 'durazno', 'ciruela', 'pera', 'sandía', 'melón'],
    verduras: ['tomate', 'berenjena', 'morrón', 'choclo', 'zapallito', 'pepino'],
  },
  // marzo
  { frutas: ['manzana', 'pera', 'uva', 'membrillo'], verduras: ['tomate', 'berenjena', 'choclo', 'zapallo', 'batata', 'morrón'] },
  // abril
  {
    frutas: ['manzana', 'pera', 'mandarina', 'kiwi', 'membrillo'],
    verduras: ['zapallo', 'batata', 'acelga', 'espinaca', 'brócoli', 'coliflor'],
  },
  // mayo
  {
    frutas: ['mandarina', 'naranja', 'pomelo', 'kiwi', 'manzana', 'pera'],
    verduras: ['zapallo', 'batata', 'brócoli', 'coliflor', 'repollo', 'acelga', 'espinaca'],
  },
  // junio
  {
    frutas: ['naranja', 'mandarina', 'pomelo', 'limón', 'kiwi', 'palta'],
    verduras: ['zapallo', 'brócoli', 'coliflor', 'repollo', 'puerro', 'acelga', 'espinaca', 'zanahoria', 'remolacha'],
  },
  // julio
  {
    frutas: ['naranja', 'mandarina', 'pomelo', 'limón', 'kiwi', 'palta'],
    verduras: ['brócoli', 'coliflor', 'repollo', 'puerro', 'hinojo', 'espinaca', 'acelga', 'zanahoria'],
  },
  // agosto
  {
    frutas: ['naranja', 'pomelo', 'limón', 'kiwi', 'frutilla'],
    verduras: ['brócoli', 'coliflor', 'espinaca', 'acelga', 'lechuga', 'puerro', 'arveja'],
  },
  // septiembre
  { frutas: ['frutilla', 'naranja', 'pomelo', 'limón'], verduras: ['espárrago', 'arveja', 'haba', 'lechuga', 'espinaca', 'rabanito'] },
  // octubre
  { frutas: ['frutilla', 'níspero', 'cereza'], verduras: ['espárrago', 'arveja', 'haba', 'lechuga', 'alcaucil', 'zapallito'] },
  // noviembre
  {
    frutas: ['frutilla', 'cereza', 'damasco', 'durazno', 'arándano'],
    verduras: ['tomate', 'zapallito', 'chaucha', 'pepino', 'lechuga', 'choclo'],
  },
  // diciembre
  {
    frutas: ['cereza', 'durazno', 'damasco', 'ciruela', 'frambuesa', 'arándano', 'sandía', 'melón'],
    verduras: ['tomate', 'choclo', 'zapallito', 'berenjena', 'morrón', 'chaucha', 'pepino'],
  },
]
const NOMBRE_MES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const sinTildes = (t) =>
  String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// Lo de estación de un mes (1 a 12)
export const deEstacion = (mes) => MESES[(Number(mes) - 1 + 12) % 12]

// ¿Este alimento está de estación? Compara por palabra (con plural): "Frutillas" → frutilla
export function estaDeEstacion(alimento, mes) {
  const nombre = ` ${sinTildes(alimento?.name)} `
  const { frutas, verduras } = deEstacion(mes)
  return [...frutas, ...verduras].some((x) => new RegExp(`(?<![a-z])${sinTildes(x)}(s|es)?(?![a-z])`).test(nombre))
}

const lista = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}` : xs[0] || '')

// El consejo de temporada del mes de `hoy` (AAAA-MM-DD). Si en la despensa hay algo de estación, lo nombra.
export function consejoDeTemporada(hoy, filas = []) {
  const mes = Number(String(hoy).slice(5, 7))
  if (!(mes >= 1 && mes <= 12)) return null
  const { frutas, verduras } = deEstacion(mes)
  const tengo = (filas || []).filter((f) => Number(f.qty) > 0 && estaDeEstacion(f.a, mes)).map((f) => f.a.name)
  const texto = tengo.length
    ? `${lista(tengo.slice(0, 3))} ${tengo.length === 1 ? 'está' : 'están'} de estación en ${NOMBRE_MES[mes - 1]}: aprovechá ahora, que es cuando mejor están.`
    : `En ${NOMBRE_MES[mes - 1]} están de estación ${lista(frutas.slice(0, 3))}, y de verdura ${lista(verduras.slice(0, 4))}: más ricas y más baratas.`
  return { id: `temporada-${mes}`, alimento: null, texto, tipo: 'temporada' }
}

// Una receta para usar juntas varias cosas que vencen pronto: la que use más de ellas (al menos 2). `recetas`: las
// visibles; `itemsDe(id)`: sus ingredientes [{ food_id }]; `urgentes`: ids de alimentos que vencen pronto.
export function recetaParaLoQueVence(recetas, itemsDe, urgentes) {
  const vence = new Set(urgentes)
  if (vence.size < 2) return null
  let mejor = null
  for (const r of recetas || []) {
    const usa = new Set(
      itemsDe(r.id)
        .map((i) => i.food_id)
        .filter((id) => vence.has(id)),
    )
    if (usa.size >= 2 && (!mejor || usa.size > mejor.usa.size)) mejor = { receta: r, usa }
  }
  return mejor
}

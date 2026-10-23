// Herramientas para armar las recetas de la sexta tanda: azar con semilla (así siempre salen las mismas), textos en
// castellano rioplatense, cuentas de nutrición por porción y chequeos (todo ingrediente existe, calorías razonables).

export function azar(semilla) {
  let a = semilla >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const semillaDe = (texto) => {
  let h = 2166136261
  for (const c of String(texto)) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}
export const elegir = (az, lista) => lista[Math.floor(az() * lista.length)]
export function mezclar(az, lista) {
  const l = [...lista]
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(az() * (i + 1))
    ;[l[i], l[j]] = [l[j], l[i]]
  }
  return l
}
// "a, b y c"
export const lista = (xs) => (xs.length <= 1 ? xs[0] || '' : `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}`)
export const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1)
export const sinTildes = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
export const slugDe = (t) => {
  const s = sinTildes(t)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (s.length <= 56) return s
  const corte = s.slice(0, 56)
  return corte.slice(0, corte.lastIndexOf('-') > 30 ? corte.lastIndexOf('-') : 56)
}

// Redondea una cantidad: gramos de a 5 (de a 1 si es poco), unidades de a medio
export function redondear(q, unidad) {
  if (unidad === 'u') return Math.max(0.5, Math.round(q * 2) / 2)
  if (q < 12) return Math.max(1, Math.round(q))
  if (q < 60) return Math.round(q / 5) * 5
  return Math.round(q / 5) * 5
}

export function crearChequeo(alimentos) {
  const por = new Map(alimentos.map((f) => [f[0], { slug: f[0], unit: f[2], gu: f[3], kcal: f[5], p: f[6], c: f[7], g: f[8], cat: f[9] }]))
  const gramos = (f, q) => (f.unit === 'u' ? (f.gu || 100) * q : q)
  return {
    existe: (slug) => por.has(slug),
    alimento: (slug) => por.get(slug),
    // Por porción: [kcal, proteína, hidratos, grasa]
    porcion(items, porciones) {
      const t = { kcal: 0, p: 0, c: 0, g: 0 }
      for (const [slug, q] of items) {
        const f = por.get(slug)
        if (!f) throw new Error('falta el alimento ' + slug)
        const g = gramos(f, q)
        t.kcal += (f.kcal * g) / 100
        t.p += (f.p * g) / 100
        t.c += (f.c * g) / 100
        t.g += (f.g * g) / 100
      }
      for (const k of Object.keys(t)) t[k] /= porciones
      return t
    },
  }
}

// Une las filas de ingredientes repetidos y las ordena de lo que más pesa a lo que menos
export function juntar(items) {
  const m = new Map()
  for (const [s, q] of items) m.set(s, (m.get(s) || 0) + q)
  return [...m]
}

// El armador: recibe cada receta con los gramos de UNA porción, la pasa a las unidades de cada alimento, la multiplica por las
// porciones, calcula las calorías y la descarta si se sale de lo razonable o si el nombre ya existe.
//   ingredientes: [[slug, gramos o ml de una porción]]
export function crearArmador(chequeo, nombresExistentes = [], slugsExistentes = []) {
  const recetas = []
  const nombres = new Set(nombresExistentes.map(sinTildes))
  const slugs = new Set(slugsExistentes)
  const rechazadas = { nombre: 0, kcal: 0, prot: 0 }
  return {
    recetas,
    rechazadas,
    agregar({
      nombre,
      minutos,
      porciones = 1,
      comidas = ['almuerzo', 'cena'],
      portable = true,
      pasos,
      ingredientes,
      kcal = [150, 900],
      prot = 0,
    }) {
      const clave = sinTildes(nombre)
      if (nombres.has(clave) || nombre.length > 74) {
        rechazadas.nombre++
        return false
      }
      const items = juntar(ingredientes).map(([slug, g]) => {
        const f = chequeo.alimento(slug)
        if (!f) throw new Error(`falta el alimento ${slug} (receta "${nombre}")`)
        const total =
          f.unit === 'u' ? Math.max(0.5, Math.round(((g * porciones) / (f.gu || 100)) * 2) / 2) : redondear(g * porciones, f.unit)
        return [slug, total]
      })
      const n = chequeo.porcion(items, porciones)
      if (n.kcal < kcal[0] || n.kcal > kcal[1]) {
        rechazadas.kcal++
        return false
      }
      if (n.p < prot) {
        rechazadas.prot++
        return false
      }
      let slug = slugDe(nombre)
      for (let i = 2; slugs.has(slug); i++) slug = slugDe(nombre).slice(0, 54) + '-' + i
      slugs.add(slug)
      nombres.add(clave)
      recetas.push({
        slug,
        name: nombre,
        minutes: Math.max(2, Math.round(minutos)),
        servings: porciones,
        meal_types: comidas,
        portable,
        steps: pasos.filter(Boolean).join('\n'),
        items,
      })
      return true
    },
  }
}

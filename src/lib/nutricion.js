// Cuentas de calorías y macros. Los alimentos guardan valores cada 100 g (o 100 ml).

export const COMIDAS = ['desayuno', 'almuerzo', 'merienda', 'cena']
// 'extra' es para lo que se toma o se pica fuera de las cuatro comidas. Suma calorías pero no cuenta como comida.
export const EXTRA = 'extra'
export const NOMBRE_COMIDA = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', merienda: 'Merienda', cena: 'Cena', extra: 'Entre comidas' }
export const ICONO_COMIDA = { desayuno: 'wb_twilight', almuerzo: 'restaurant', merienda: 'local_cafe', cena: 'bedtime', extra: 'local_bar' }
// Reparto por defecto de las calorías del día cuando no hay nada planificado
export const REPARTO = { desayuno: 0.22, almuerzo: 0.32, merienda: 0.16, cena: 0.3 }
export const CATEGORIAS = ['Proteínas', 'Carbohidratos', 'Verduras', 'Frutas', 'Lácteos', 'Despensa', 'Snacks', 'Comidas hechas', 'Bebidas', 'Otros']

export const CON_ARTICULO = { desayuno: 'el desayuno', almuerzo: 'el almuerzo', merienda: 'la merienda', cena: 'la cena' }

export const esBebida = (alimento) => alimento?.category === 'Bebidas'
export const tieneAlcohol = (alimento) => !!alimento?.alcohol

// ---------- Medidas rápidas: cada cosa se carga como se toma o se sirve ----------
// Los alimentos base se agrupan por su slug; lo que crea el usuario usa las medidas generales.
const GRUPOS = {
  mate: ['mate', 'terere', 'terere-jugo'],
  infusion: ['cafe', 'cortado', 'capuchino', 'cafe-con-leche', 'te', 'te-leche', 'mate-cocido', 'mate-cocido-leche', 'chocolatada'],
  cerveza: ['cerveza', 'cerveza-negra', 'cerveza-ipa', 'cerveza-sin-alcohol', 'sidra'],
  vino: ['vino', 'vino-blanco', 'espumante'],
  medida: ['fernet', 'bebida-blanca', 'campari', 'vermut', 'licor'],
  trago: ['fernet-coca', 'gin-tonic', 'ron-cola', 'aperol-spritz', 'trago-dulce'],
  cuchara: ['azucar', 'miel', 'mermelada', 'mermelada-light', 'cacao', 'aceite', 'queso-untable', 'crema', 'ketchup', 'salsa-soja'],
  punado: ['mani-cascara', 'mani', 'nueces', 'almendras', 'aceitunas'],
}
const GRUPO_DE = new Map(Object.entries(GRUPOS).flatMap(([g, slugs]) => slugs.map((s) => [s, g])))
export const grupoDe = (alimento) => GRUPO_DE.get(alimento?.slug) || null

// Lista de [nombre, cantidad] para el alimento. `termo` es el tamaño del termo del usuario, en ml.
export function medidasDe(alimento, termo = 1000) {
  switch (grupoDe(alimento)) {
    case 'mate': return [['Un mate', 40], ['Medio termo', Math.round(termo / 2)], ['Un termo', termo]]
    case 'infusion': return [['Pocillo', 80], ['Taza', 200], ['Jarro', 300]]
    case 'cerveza': return [['Vaso', 250], ['Porrón', 330], ['Lata', 473], ['Botella', 1000]]
    case 'vino': return [['Copa', 150], ['Vaso', 200], ['Botella', 750]]
    case 'medida': return [['Medida', 50], ['Doble', 100]]
    case 'trago': return [['Vaso', 250], ['Vaso grande', 400]]
    case 'cuchara': return [['Cucharadita', 5], ['Cucharada', 15]]
    case 'punado': return [['Un puñado', 30], ['Dos puñados', 60]]
    default: return alimento?.unit === 'ml' ? [['Vaso', 250], ['Lata', 354], ['Botella', 500], ['1 litro', 1000]] : []
  }
}
export const textoMedida = (alimento, cantidad) => (cantidad >= 1000 ? `${String(cantidad / 1000).replace('.', ',')} ${alimento.unit === 'ml' ? 'L' : 'kg'}` : `${cantidad} ${alimento.unit}`)

// Infusiones: se les puede sumar azúcar o edulcorante al registrarlas
export const seEndulza = (alimento) => ['mate', 'infusion'].includes(grupoDe(alimento))
export const GRAMOS_CUCHARADITA = 5

// ---------- Líquido ----------
// Cuenta para el objetivo todo lo que se mide en ml y no tiene alcohol: agua, mate, infusiones, gaseosas, leche.
export const cuentaComoLiquido = (alimento) => alimento?.unit === 'ml' && ['Bebidas', 'Lácteos'].includes(alimento.category) && !alimento.alcohol
// Referencia habitual: unos 35 ml por kilo de peso, entre 1,5 y 4 litros
export function liquidoSugerido(peso) {
  const p = Number(peso)
  if (!p || p < 30 || p > 300) return 2000
  return Math.min(4000, Math.max(1500, Math.round((p * 35) / 100) * 100))
}
export const objetivoLiquido = (perfil) => perfil?.water_target_ml || liquidoSugerido(perfil?.weight_kg)
export const litros = (ml) => (Number(ml) / 1000).toLocaleString('es-AR', { maximumFractionDigits: 2 })

export const CERO = { kcal: 0, protein: 0, carbs: 0, fat: 0 }

export const miles = (n) => Math.round(Number(n) || 0).toLocaleString('es-AR')

// "Almuerzo y cena", "Desayuno"
export const listaComidas = (tipos) => {
  const t = tipos.map((c) => NOMBRE_COMIDA[c].toLowerCase()).join(' y ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export const redondear = (n, dec = 0) => {
  const f = 10 ** dec
  return Math.round((Number(n) || 0) * f) / f
}

// Cantidad en gramos (o ml) de `qty` de un alimento
export function gramos(alimento, qty) {
  return alimento.unit === 'u' ? qty * (Number(alimento.unit_grams) || 0) : qty
}

export function macrosDe(alimento, qty) {
  const f = gramos(alimento, Number(qty) || 0) / 100
  return {
    kcal: alimento.kcal * f,
    protein: alimento.protein * f,
    carbs: alimento.carbs * f,
    fat: alimento.fat * f,
  }
}

export function sumar(lista) {
  return lista.reduce(
    (t, m) => ({
      kcal: t.kcal + Number(m.kcal || 0),
      protein: t.protein + Number(m.protein || 0),
      carbs: t.carbs + Number(m.carbs || 0),
      fat: t.fat + Number(m.fat || 0),
    }),
    { ...CERO },
  )
}

// Macros de UNA porción de la receta.
// `alimentos` es el Map de alimentos o una función que, para cada ingrediente, dice con qué alimento
// y qué cantidad se cubre ({ a, qty }): así se usa el producto que realmente hay en la despensa.
export function macrosReceta(receta, items, alimentos) {
  const resolver = typeof alimentos === 'function' ? alimentos : (it) => { const a = alimentos.get(it.food_id); return a ? { a, qty: it.qty } : null }
  const total = sumar(
    items.map((it) => {
      const r = resolver(it)
      return r ? macrosDe(r.a, r.qty) : CERO
    }),
  )
  const s = receta.servings || 1
  return { kcal: total.kcal / s, protein: total.protein / s, carbs: total.carbs / s, fat: total.fat / s }
}

export function unidadDe(alimento, qty = 2) {
  if (alimento.unit !== 'u') return alimento.unit
  const e = alimento.unit_label || 'unidad'
  if (qty === 1) return e
  // plural: vocal + s (lata, latas); consonante + es (unidad, unidades; porción, porciones)
  return /[aeiou]$/.test(e) ? e + 's' : e.replace(/ón$/, 'on') + 'es'
}

export function cantidadTexto(alimento, qty) {
  const q = redondear(qty, alimento.unit === 'u' ? 1 : 0)
  if (alimento.unit === 'u') return `${q} ${unidadDe(alimento, q)}`
  if (q >= 1000) return `${redondear(q / 1000, 2)} ${alimento.unit === 'g' ? 'kg' : 'L'}`
  return `${q} ${alimento.unit}`
}

// Paso cómodo para sumar o restar del stock
export const pasoDe = (alimento) => (alimento.unit === 'u' ? 1 : 50)
// Cantidad que se propone al agregar un alimento a un plato
export function porcionSugerida(alimento, termo = 1000) {
  if (alimento.unit === 'u') return 1
  const g = grupoDe(alimento)
  if (g === 'mate') return Math.round(termo / 2)
  if (g === 'infusion') return 200
  if (g === 'cerveza') return 473
  if (g === 'vino') return 150
  if (g === 'medida') return 50
  if (g === 'cuchara') return 15
  if (g === 'punado') return 30
  return alimento.unit === 'ml' ? 250 : 100
}

export const ACTIVIDADES = [
  { valor: 1.2, texto: 'Sedentario (casi sin ejercicio)' },
  { valor: 1.375, texto: 'Ligero (1–2 días por semana)' },
  { valor: 1.55, texto: 'Moderado (3–4 días por semana)' },
  { valor: 1.725, texto: 'Alto (5–6 días por semana)' },
]

// Objetivo sugerido: gasto estimado (Mifflin-St Jeor) con un recorte según lo que se quiera hacer.
export function objetivoSugerido({ sexo, edad, altura, peso, pesoMeta, actividad }) {
  if (!edad || !altura || !peso) return null
  // Con datos fuera de rango no se calcula nada (una edad o altura absurda daba objetivos de decenas de miles de kcal)
  if (edad < 13 || edad > 100 || altura < 100 || altura > 250 || peso < 30 || peso > 300) return null
  const basal = 10 * peso + 6.25 * altura - 5 * edad + (sexo === 'f' ? -161 : 5)
  const gasto = basal * (actividad || 1.375)
  let kcal = gasto
  // A menores de 18 no se les calcula un recorte: bajar de peso a esa edad es tema de un profesional
  const menor = edad < 18
  if (menor) kcal = gasto
  else if (pesoMeta && pesoMeta < peso - 1) kcal = gasto * 0.78
  else if (pesoMeta && pesoMeta > peso + 1) kcal = gasto * 1.1
  const minimo = sexo === 'f' ? 1300 : 1500
  kcal = Math.min(4500, Math.max(minimo, Math.round(kcal / 50) * 50))
  const protein = Math.round((1.7 * (pesoMeta || peso)) / 5) * 5
  return { kcal, protein, gasto: Math.round(gasto), menor }
}

// Arma el consejo del día comparando lo comido con el objetivo.
// planHoy: Map comida -> { kcal } de lo planificado para ese día (puede faltar alguna).
// registradas: las comidas ya resueltas (comidas o marcadas como "no comí"). Lo de "entre comidas" suma al total pero no cuenta acá.
export function consejoDelDia({ objetivoKcal, objetivoProt, total, registradas, planHoy }) {
  const pendientes = COMIDAS.filter((c) => !registradas.has(c))
  const previsto = (c) => (planHoy.get(c)?.kcal ? planHoy.get(c).kcal : REPARTO[c] * objetivoKcal)
  const restante = Math.round(objetivoKcal - total.kcal)
  const protFalta = Math.round(objetivoProt - total.protein)

  if (registradas.size === 0) {
    // Todavía no hay comidas, pero puede haber bebidas o algo picado entre horas
    const presupuesto = Math.max(150, Math.min(Math.round(previsto(pendientes[0])), restante))
    if (total.kcal >= 1) {
      const texto = restante > 0
        ? `Llevás ${miles(total.kcal)} kcal entre bebidas y extras. Te quedan ${miles(restante)} kcal para las comidas de hoy.`
        : `Entre bebidas y extras ya llegaste al objetivo del día. En las comidas, algo liviano con proteína.`
      return { tono: restante > 0 ? 'info' : 'arriba', texto, siguiente: pendientes[0], presupuesto }
    }
    return { tono: 'info', texto: `Tenés ${miles(objetivoKcal)} kcal y ${objetivoProt} g de proteína para hoy.`, siguiente: pendientes[0], presupuesto }
  }
  if (pendientes.length === 0) {
    if (restante < -150) return { tono: 'arriba', texto: `Te pasaste ${miles(-restante)} kcal. Mañana seguí normal, sin saltear comidas.` }
    if (restante > 200) {
      const extra = protFalta > 20 ? ' Algo con proteína, como huevo, atún o leche, te viene bien.' : ''
      return { tono: 'abajo', texto: `Te quedaron ${miles(restante)} kcal sin usar. Si tenés hambre, podés sumar algo.${extra}` }
    }
    return { tono: 'bien', texto: 'Día cerrado en objetivo.' }
  }

  const esperado = [...registradas].reduce((s, c) => s + previsto(c), 0)
  const desvio = Math.round(total.kcal - esperado)
  const siguiente = pendientes[0]
  const otras = pendientes.slice(1).reduce((s, c) => s + previsto(c), 0)
  const presupuesto = Math.max(150, Math.round((restante - otras) / 10) * 10)
  const nombre = CON_ARTICULO[siguiente]
  let tono = 'bien'
  let texto = `Venís en objetivo. Te quedan ${miles(Math.max(restante, 0))} kcal para lo que falta del día.`

  if (restante <= 0) {
    tono = 'arriba'
    texto = `Ya llegaste al objetivo del día y te pasaste ${miles(-restante)} kcal. En lo que queda, algo liviano con proteína: ensalada con huevo o atún.`
  } else if (desvio > 150) {
    tono = 'arriba'
    texto = `Venís ${miles(desvio)} kcal arriba de lo previsto. Para cerrar el día en objetivo, en ${nombre} andá por unas ${miles(presupuesto)} kcal.`
    if (presupuesto < 350) texto += ' Algo liviano con proteína: ensalada con huevo o atún.'
  } else if (desvio < -150) {
    tono = 'abajo'
    texto = `Venís ${miles(-desvio)} kcal abajo de lo previsto. En ${nombre} podés comer hasta ${miles(presupuesto)} kcal.`
  }
  if (protFalta > 0 && protFalta / pendientes.length > 40) {
    texto += ` Te faltan ${protFalta} g de proteína: priorizá pollo, atún o huevo.`
  }
  return { tono, texto, siguiente, presupuesto }
}

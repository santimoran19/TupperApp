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

// Medidas rápidas para cargar bebidas
export const MEDIDAS_BEBIDA = [['Vaso', 250], ['Lata', 354], ['Botella', 500], ['Copa', 150], ['Medida', 50], ['1 litro', 1000]]
export const esBebida = (alimento) => alimento?.category === 'Bebidas'
// Bebidas de la base que tienen alcohol (para filtrarlas en el buscador)
const CON_ALCOHOL = new Set(['cerveza', 'cerveza-negra', 'cerveza-ipa', 'vino', 'vino-blanco', 'espumante', 'sidra', 'fernet', 'fernet-coca',
  'bebida-blanca', 'gin-tonic', 'ron-cola', 'campari', 'aperol-spritz', 'vermut', 'trago-dulce', 'licor'])
export const tieneAlcohol = (alimento) => CON_ALCOHOL.has(alimento?.slug)

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

// Macros de UNA porción de la receta
export function macrosReceta(receta, items, alimentos) {
  const total = sumar(
    items.map((it) => {
      const a = alimentos.get(it.food_id)
      return a ? macrosDe(a, it.qty) : CERO
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
export const porcionSugerida = (alimento) => (alimento.unit === 'u' ? 1 : alimento.unit === 'ml' ? 250 : 100)

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
  if (edad < 10 || edad > 100 || altura < 100 || altura > 250 || peso < 30 || peso > 300) return null
  const basal = 10 * peso + 6.25 * altura - 5 * edad + (sexo === 'f' ? -161 : 5)
  const gasto = basal * (actividad || 1.375)
  let kcal = gasto
  if (pesoMeta && pesoMeta < peso - 1) kcal = gasto * 0.78
  else if (pesoMeta && pesoMeta > peso + 1) kcal = gasto * 1.1
  const minimo = sexo === 'f' ? 1300 : 1500
  kcal = Math.min(4500, Math.max(minimo, Math.round(kcal / 50) * 50))
  const protein = Math.round((1.7 * (pesoMeta || peso)) / 5) * 5
  return { kcal, protein, gasto: Math.round(gasto) }
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

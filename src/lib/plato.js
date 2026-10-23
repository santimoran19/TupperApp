// De qué está hecha una receta (o lo que se comió en el día), para los dibujos 3D (1.24 y 1.25): qué forma y qué color
// tiene cada ingrediente (arroz = granitos, tomate = rodajas, carne = trozos...), en qué recipiente se sirve (vaso,
// taza, bowl, plato...) y de qué color es el líquido de una bebida o una sopa. Funciones puras.

// Colores de categoría (para la leyenda): no son los de la marca, tienen que parecer comida
export const COLOR_COMIDA = {
  Verduras: '#6f9f4f',
  Frutas: '#e7a33e',
  'Carnes y huevos': '#b7653a',
  Pescados: '#e9a98a',
  Lácteos: '#f1e6cc',
  'Pastas y arroz': '#efd28c',
  Legumbres: '#a8723f',
  Panadería: '#d49a5f',
  Cereales: '#dfbd76',
  Enlatados: '#c8573f',
  'Salsas y aderezos': '#c0392b',
  Despensa: '#d6c49a',
  'Snacks y dulces': '#8a5a33',
  Congelados: '#9fc6d9',
  'Comidas hechas': '#c48a4e',
  Otros: '#bdb5a1',
}

const sinTildes = (t) =>
  String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// Formas que sabe dibujar la escena 3D (src/components/tres/comida.js)
export const FORMAS = [
  'grano', // granitos de arroz, cuscús, quinoa
  'pasta', // fideos cortos
  'cubo', // verdura o fruta en cubos
  'cubito', // dados chicos (queso, jamón, chocolate)
  'rodaja', // rodajas (tomate, zanahoria, banana)
  'hoja', // hojas verdes
  'floret', // brócoli, coliflor
  'trozo', // trozos de carne o pollo
  'filete', // milanesas, pescado
  'tira', // morrón, panceta, chauchas
  'aro', // cebolla, calamar
  'esfera', // arvejas, garbanzos, uvas
  'baya', // frutillas, arándanos
  'lenteja', // lentejas
  'poroto', // porotos
  'migaja', // carne picada, granola, queso rallado
  'pan', // trocitos de pan
  'nuez', // maní, nueces, almendras
  'mancha', // salsas, cremas, yogur, dulce de leche
  'medallon', // hamburguesas, nuggets, galletitas
  'salchicha', // salchichas, chorizo
  'cuna', // porciones de pizza, tarta, torta
  'chip', // papas fritas, nachos
  'gota', // bebida
]

// [expresión sobre el nombre sin tildes, forma, color]. Gana la primera que coincide.
const REGLAS = [
  // Bebidas y líquidos (van como gotas / mancha)
  [/(?<!dulce de )(?<!arroz con )\bleche\b|yogur bebible|kefir|bebida de (almendra|soja|avena)/, 'gota', '#f7f1e6'],
  [/cafe|capuchino|cortado/, 'gota', '#5a3724'],
  [/\bte\b|\bmate\b|terere|infusion/, 'gota', '#b9772e'],
  [/jugo de naranja|jugo en polvo|jugo de caja/, 'gota', '#f39a2b'],
  [/gaseosa|\bcola\b|\bcoca\b|fernet|\bron con/, 'gota', '#4a2c1e'],
  [/agua|soda|tonica/, 'gota', '#cfe8f2'],
  [/cerveza|\bvino\b|espumante|sidra|trago|licor|\bgin\b|vodka|whisky|vermut|campari|aperol/, 'gota', '#e2b24a'],
  [/licuado|batido|smoothie|kombucha|isotonic|energizante|limonada/, 'gota', '#f0dd9b'],
  // Carnes y huevos
  [/huevo|clara/, 'rodaja', '#f7eed0'],
  [/hamburguesa|medallon|nugget/, 'medallon', '#8a4f2c'],
  [/picad|picadillo|pate/, 'migaja', '#7a4a2b'],
  [/milanesa|rebozad|empanizad/, 'filete', '#cc9348'],
  [/salchicha|chorizo|morcilla|vienesa|pancho|choripan|surimi|palitos de mar/, 'salchicha', '#a85a3a'],
  [/panceta|bacon/, 'tira', '#c0573e'],
  [/salame|mortadela/, 'rodaja', '#a8433a'],
  [/jamon|paleta|fiambre|pechuga de pavo/, 'rodaja', '#eaa9a4'],
  [/pollo|pechuga|pata|alita/, 'trozo', '#d8a566'],
  [/asado|bife|vacio|peceto|lomo|bondiola|carre|costeleta|carne|higado|vacuno|cerdo/, 'trozo', '#9a5535'],
  // Pescados
  [/salmon|trucha/, 'filete', '#f0886a'],
  [/merluza|filet/, 'filete', '#f0e0c4'],
  [/atun|caballa|sardina/, 'trozo', '#d8a58a'],
  [/calamar|rabas|langostino|camaron/, 'aro', '#f0a070'],
  // Legumbres
  [/lenteja/, 'lenteja', '#8a5a2e'],
  [/garbanzo/, 'esfera', '#dcb878'],
  [/poroto/, 'poroto', '#a2503a'],
  [/salsa de soja|salsa soja/, 'mancha', '#3a2418'],
  [/soja|tofu/, 'cubito', '#eadcb8'],
  // Pastas y arroz
  [/arroz|cuscus|quinoa/, 'grano', '#f3ead2'],
  [/ravio|noqui/, 'cubo', '#f1d98f'],
  [/fideo|tallarin|ramen|pasta/, 'pasta', '#f0d48a'],
  [/polenta/, 'cubo', '#f1c84b'],
  // Cereales, semillas
  [/chia|lino|girasol|zapallo \(pepitas\)|sesamo/, 'migaja', '#8a7a55'],
  [/avena|copos|granola|cereal/, 'migaja', '#d9b878'],
  // Panadería
  [
    /pan |^pan$|tostada|galleta|criollo|medialuna|factura|grisin|tapa de|prepizza|chipa|bizcoch|rapidita|tortilla de (trigo|maiz)|pan de/,
    'pan',
    '#d9a35f',
  ],
  // Verduras
  [/cherry/, 'esfera', '#d8402f'],
  [/salsa de tomate|pomarola|bolonesa|boloñesa|triturado|ketchup|pure de tomate|extracto de tomate|passata/, 'mancha', '#c43d2a'],
  [/tomate/, 'rodaja', '#d8402f'],
  [/cebolla de verdeo|puerro|apio|hinojo|esparrago|chaucha/, 'tira', '#8fb04a'],
  [/cebolla/, 'aro', '#efe3c0'],
  [/morron/, 'tira', '#d63c2e'],
  [/calabaza|zapallo(?! \()/, 'cubo', '#e8903a'],
  [/zapallito/, 'cubo', '#8fb04a'],
  [/batata/, 'cubo', '#e19a4a'],
  [/zanahoria/, 'rodaja', '#f08a24'],
  [/papaya/, 'cubo', '#f4a44a'],
  [/\bpapas?\b|puré|pure/, 'cubo', '#efd58a'],
  [/rucula/, 'hoja', '#4f8f3a'],
  [/repollo/, 'hoja', '#b7d38a'],
  [/lechuga|acelga|espinaca|hojas verdes/, 'hoja', '#6fa84a'],
  [/coliflor/, 'floret', '#efe8cf'],
  [/brocoli/, 'floret', '#3f7f3a'],
  [/pepino/, 'rodaja', '#a8d08a'],
  [/palta|guacamole/, 'rodaja', '#b4cc5c'],
  [/berenjena/, 'cubo', '#6b4a7a'],
  [/champi/, 'rodaja', '#d8c3a5'],
  [/remolacha/, 'cubo', '#8a2a4a'],
  [/choclo/, 'esfera', '#f2c53a'],
  [/arveja/, 'esfera', '#7fb04a'],
  [/jardinera/, 'cubito', '#e8a23a'],
  [/aceituna/, 'esfera', '#556b2f'],
  [/palmito/, 'rodaja', '#f0e4c0'],
  [/ajo/, 'esfera', '#f0e8d4'],
  // Frutas
  [/frutilla|frambuesa/, 'baya', '#d32f3d'],
  [/arandano/, 'baya', '#3b4a8a'],
  [/cereza/, 'baya', '#8a1530'],
  [/uva/, 'esfera', '#7a3b8a'],
  [/naranja|mandarina|pomelo/, 'rodaja', '#f39a2b'],
  [/limon|lima/, 'rodaja', '#f0e04a'],
  [/banana/, 'rodaja', '#f2d36a'],
  [/kiwi/, 'rodaja', '#8fbf4a'],
  [/sandia/, 'cubo', '#e8484f'],
  [/anana/, 'cubo', '#f2c94c'],
  [/melon/, 'cubo', '#bde28a'],
  [/mango|durazno|damasco/, 'cubo', '#f4a44a'],
  [/manzana|pera/, 'cubo', '#e6dc8a'],
  [/higo|ciruela|granada|maracuya|dátil|datil|pasas|orejones/, 'esfera', '#6b2f3a'],
  [/ensalada de frutas/, 'cubo', '#f4a44a'],
  // Lácteos
  [/queso rallado|sardo|reggianito/, 'migaja', '#f3d980'],
  [/muzzarella|mozzarella/, 'cubito', '#fbf4dd'],
  [/queso|provolone|cheddar|azul|cabra|tybo|port salut/, 'cubito', '#f6d96b'],
  [/manteca/, 'cubito', '#fbe9a0'],
  [/yogur|ricota|crema de leche|postre|flan|untable/, 'mancha', '#fbf6ea'],
  // Despensa, salsas
  [/dulce de leche/, 'mancha', '#a8662b'],
  [/miel|maple/, 'mancha', '#e0a02a'],
  [/mermelada|dulce de membrillo/, 'mancha', '#b5333f'],
  [/mani|nuez|nueces|almendra|castana|frutos secos|pistacho/, 'nuez', '#b98a55'],
  [/pasta de mani|tahini/, 'mancha', '#b98a55'],
  [/cacao|chocolate|brownie|bombon|turron|mantecol/, 'cubito', '#4a2c1e'],
  [/hummus/, 'mancha', '#d8c08a'],
  [/pesto|chimichurri/, 'mancha', '#6a8f3a'],
  [/tomate|boloñesa|bolonesa|salsa de tomate|ketchup|barbacoa|golf|criolla/, 'mancha', '#c43d2a'],
  [/mayonesa|salsa blanca|aderezo|cesar/, 'mancha', '#f6efd0'],
  [/mostaza/, 'mancha', '#e6b422'],
  [/soja|teriyaki/, 'mancha', '#3a2418'],
  [/helado/, 'esfera', '#f5e6c8'],
  [/gomita|caramelo/, 'esfera', '#e5546e'],
  [/papas fritas|nacho|chizito|palitos salados|chips/, 'chip', '#e6b84a'],
  [/alfajor|galletita|oreo|barrita/, 'medallon', '#c99256'],
  [/pizza|fugazza|fugazzeta|tarta|torta|fainá|faina|prepizza|lasana|canelon|tortilla de papa/, 'cuna', '#e0a84a'],
  [/empanada|sushi/, 'medallon', '#d9954b'],
]

// Forma y color de último recurso, por categoría
const POR_CATEGORIA = {
  Verduras: ['cubo', '#6f9f4f'],
  Frutas: ['cubo', '#e7a33e'],
  'Carnes y huevos': ['trozo', '#b7653a'],
  Pescados: ['filete', '#e9a98a'],
  Lácteos: ['mancha', '#f1e6cc'],
  'Pastas y arroz': ['pasta', '#efd28c'],
  Legumbres: ['esfera', '#a8723f'],
  Panadería: ['pan', '#d49a5f'],
  Cereales: ['migaja', '#dfbd76'],
  Enlatados: ['cubito', '#c8573f'],
  'Salsas y aderezos': ['mancha', '#c0392b'],
  Despensa: ['mancha', '#d6c49a'],
  'Snacks y dulces': ['medallon', '#8a5a33'],
  Congelados: ['medallon', '#d4963f'],
  'Comidas hechas': ['cubo', '#c48a4e'],
  Bebidas: ['gota', '#f0dd9b'],
}

// Forma y color de un alimento según su nombre (y su categoría si el nombre no dice nada)
export function formaDe(nombre, categoria) {
  const n = sinTildes(nombre)
  for (const [re, forma, color] of REGLAS) if (re.test(n)) return { forma, color }
  const [forma, color] = POR_CATEGORIA[categoria] || ['cubo', COLOR_COMIDA.Otros]
  return { forma, color }
}

// Gramos de un ingrediente: los que se miden en unidades usan su peso por unidad (o 100 g si no se sabe)
const gramosDe = (a, qty) => (a.unit === 'u' ? (Number(a.unit_grams) || 100) * qty : qty)

const SIN_VER =
  /aceite|^sal\b|\bsal fina|vinagre|caldo en cubo|edulcorante|yerba|agua$|^agua\b|levadura|polvo de hornear|esencia|pimienta|oregano/

// [{ nombre, categoria, gramos, forma, color }] de los ingredientes que se ven en el plato, de más a menos gramos.
// `items`: [{ food_id, qty }]. Sin aceites, sal, agua ni condimentos.
export function trozosDeReceta(items, alimentosPorId) {
  const por = new Map()
  for (const it of items || []) {
    const a = alimentosPorId.get(it.food_id)
    if (!a) continue
    const n = sinTildes(a.name)
    if (SIN_VER.test(n)) continue
    const g = gramosDe(a, Number(it.qty) || 0)
    if (!(g > 0)) continue
    const previo = por.get(a.id)
    if (previo) previo.gramos += g
    else por.set(a.id, { nombre: a.name.split(' (')[0], categoria: a.category, gramos: g, ...formaDe(a.name, a.category) })
  }
  return [...por.values()].sort((x, y) => y.gramos - x.gramos).map((t) => ({ ...t, gramos: Math.round(t.gramos) }))
}

// [{ nombre, gramos, color }] por categoría, de más a menos; lo que pesa menos del 6 % se junta en "Otros". Sin bebidas
// ni aceite. Es la leyenda del plato.
export function partesDeReceta(items, alimentosPorId) {
  const por = new Map()
  for (const it of items || []) {
    const a = alimentosPorId.get(it.food_id)
    if (!a || a.category === 'Bebidas' || /aceite/i.test(a.name)) continue
    const g = gramosDe(a, Number(it.qty) || 0)
    if (!(g > 0)) continue
    por.set(a.category, (por.get(a.category) || 0) + g)
  }
  const total = [...por.values()].reduce((s, g) => s + g, 0)
  if (!(total > 0)) return []
  const lista = []
  let otros = 0
  for (const [c, g] of [...por].sort((x, y) => y[1] - x[1])) {
    if (g / total < 0.06 || !COLOR_COMIDA[c]) otros += g
    else lista.push({ nombre: c, gramos: Math.round(g), color: COLOR_COMIDA[c] })
  }
  if (otros > 0) lista.push({ nombre: 'Otros', gramos: Math.round(otros), color: COLOR_COMIDA.Otros })
  return lista
}

// ---------- En qué se sirve ----------
const CALIENTE = /^(cafe|te|mate|capuchino|cortado|submarino|chocolate caliente|cocido|infusion|mate cocido)\b/
const BEBIDA =
  /licuado|batido|smoothie|jugo|zumo|limonada|chocolatada|milkshake|frapp|agua saborizada|tereré|terere|kombucha|isotonic|bebible|leche con|leche chocolatada|^leche$/
const SOPA = /sopa|caldo|crema de|puchero|guiso|locro|cazuela|estofado|carbonada|minestrone|pozole|chupin|lentejas con|lentejas$|sancocho/
const ENSALADA = /ensalada|bowl|poke|wok/
const SANDWICH = /sandwich|sanguche|tostado|hamburguesa casera|lomito|wrap|pancho|choripan|rapidita|pan de/
const TOSTADAS = /tostadas|galletitas|galletas|criollos|pan con/
const DISCO = /pizza|pizzeta|tarta|tortilla de papa|tortilla de|torta|panqueque|omelette|fugazza|fugazzeta|empanada|budin|bizcochuelo/
const POSTRE = /arroz con leche|flan|postre|helado|mousse|gelatina|yogur con|yogur natural|yogur y|avena con|copos de maiz/

// 'vaso' | 'taza' | 'sopa' | 'bowl' | 'sandwich' | 'tostadas' | 'disco' | 'postre' | 'plato'
export function tipoDePlato(nombre, trozos = []) {
  const n = sinTildes(nombre)
  const total = trozos.reduce((s, t) => s + t.gramos, 0) || 1
  const liquido = trozos.filter((t) => t.forma === 'gota').reduce((s, t) => s + t.gramos, 0) / total
  if (/^yogur (con|natural|griego|y)\b/.test(n) && !/bebible|licuado|batido/.test(n)) return 'postre'
  if (CALIENTE.test(n) && !/con (tostadas|galletitas|galletas|medialunas)|y (tostadas|galletitas|galletas)/.test(n)) return 'taza'
  if ((BEBIDA.test(n) || liquido > 0.8) && !/con (tostadas|galletitas)/.test(n)) return 'vaso'
  if (SOPA.test(n)) return 'sopa'
  if (/avena con|arroz con leche|yogur|copos de maiz con/.test(n)) return 'postre'
  if (TOSTADAS.test(n) && !/ensalada/.test(n)) return 'tostadas'
  if (SANDWICH.test(n)) return 'sandwich'
  if (DISCO.test(n)) return 'disco'
  if (ENSALADA.test(n)) return 'bowl'
  if (POSTRE.test(n)) return 'postre'
  return 'plato'
}

// ---------- Color del líquido ----------
// Mezcla los colores de los ingredientes líquidos o de sabor de una bebida o sopa, según los gramos de cada uno
const LIQUIDOS = [
  [/(?<!dulce de )leche|yogur|crema|kefir|bebida de/, '#f6efe0'],
  [/cacao|chocolate/, '#5a3522'],
  [/cafe|capuchino|cortado/, '#4a2c1e'],
  [/\bte\b|\bmate\b|terere|infusion/, '#b9772e'],
  [/banana/, '#f2dc8a'],
  [/frutilla|frambuesa|cereza/, '#e98aa5'],
  [/arandano|uva/, '#8a5a9a'],
  [/naranja|mandarina|mango|durazno|damasco|zanahoria/, '#f49a2e'],
  [/limon|pomelo|lima/, '#f3ecb0'],
  [/manzana|pera|anana|melon/, '#e3d27a'],
  [/espinaca|acelga|kiwi|lechuga|rucula|pepino|brocoli|verdeo|apio/, '#8bbf5a'],
  [/tomate/, '#c9462f'],
  [/zapallo|calabaza|batata/, '#e8903a'],
  [/papa|puerro|cebolla/, '#e8d9a8'],
  [/lenteja|poroto|garbanzo/, '#b9833f'],
  [/carne|pollo|puchero|huesos|vacuno/, '#c98f4f'],
  [/miel|dulce de leche/, '#d9a23a'],
  [/agua|soda/, '#d6ecf4'],
]

export function colorLiquido(trozos, tipo) {
  const pesos = []
  for (const t of trozos || []) {
    const n = sinTildes(t.nombre)
    const hit = LIQUIDOS.find(([re]) => re.test(n))
    if (hit) pesos.push([hit[1], Math.max(10, t.gramos) * (/leche|yogur|agua|soda/.test(n) ? 0.8 : 1.3)])
  }
  if (!pesos.length) return tipo === 'sopa' ? '#e0b86a' : '#efe0b8'
  let r = 0
  let g = 0
  let b = 0
  let w = 0
  for (const [hex, p] of pesos) {
    const c = parseInt(hex.slice(1), 16)
    r += ((c >> 16) & 255) * p
    g += ((c >> 8) & 255) * p
    b += (c & 255) * p
    w += p
  }
  const h = (x) =>
    Math.round(x / w)
      .toString(16)
      .padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

// ---------- Lo que se comió en el día (el tupper) ----------
// `registros`: [{ food_id, qty }]. Devuelve [{ nombre, categoria, kcal, forma, color }] por alimento, de más a menos kcal.
export function trozosDelDia(registros, alimentosPorId) {
  const por = new Map()
  for (const r of registros || []) {
    const a = alimentosPorId.get(r.food_id)
    if (!a) continue
    const g = gramosDe(a, Number(r.qty) || 0)
    const kcal = (Number(a.kcal) / 100) * g
    if (!(kcal > 0)) continue
    const previo = por.get(a.id)
    if (previo) previo.kcal += kcal
    else por.set(a.id, { id: a.id, nombre: a.name.split(' (')[0], categoria: a.category, kcal, ...formaDe(a.name, a.category) })
  }
  return [...por.values()].sort((x, y) => y.kcal - x.kcal).map((t) => ({ ...t, kcal: Math.round(t.kcal) }))
}

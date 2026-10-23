// El dibujo de cada alimento y receta cuando todavía no tiene foto (1.26): un emoji que sea lo que dice el nombre (una
// milanesa de pollo no puede ser un huevo). Se busca por palabras del nombre; gana la que aparece primero ("Café con leche" es
// un café, "Fideos con salsa de tomate" son fideos). Si no se reconoce nada, se usa el de la categoría.
//   emojiDe('Milanesa de pollo al horno', 'Carnes y huevos') → '🍗'
const sinTildes = (t) =>
  String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// Frases que mandan sobre todo lo demás (valen aunque no sean lo primero que se nombra)
const FRASES = [
  [/\barroz con leche\b/, '🍮'],
  [/\bdulce de leche\b/, '🍯'],
  [/\bdulce de (batata|membrillo)\b/, '🍯'],
  [/\bleche condensada\b/, '🥛'],
  [/\bpasta de (mani|miso)\b|\bmantequilla de mani\b/, '🥜'],
  [/\bpan rallado\b/, '🍞'],
  [/\bpapas? fritas?\b|\bpapas? congeladas?\b/, '🍟'],
  [/\bcaldo\b.*\b(cubo|liquido)\b|\bcaldo en\b/, '🥫'],
  [/\bsalsa de tomate\b|\bsalsa fileto\b|\bsalsa bolonesa\b|\bpure de tomate\b|\btomate triturado\b/, '🥫'],
  [/\bcrema de leche\b|\bcrema light\b|\bcrema de coco\b/, '🥛'],
  [/\bhelado\b/, '🍨'],
  [/\bleche de (avena|almendra|soja|coco)\b|\bbebida de (avena|almendra|soja)\b/, '🥛'],
]

// [palabras del nombre, emoji]. Si dos coinciden, vale la que está antes en el nombre; si empatan, la de más arriba.
const REGLAS = [
  // platos y preparaciones
  [/\b(licuado|batido|smoothie|jugo|limonada)\b/, '🥤'],
  [/\b(cafe|capuchino|cortado|latte|espresso)\b/, '☕'],
  [/\b(te|mate cocido|saquitos?)\b/, '🍵'],
  [/\b(mate|yerba|terere)\b/, '🧉'],
  [/\bcerveza\b|\bipa\b/, '🍺'],
  [/\b(vino|espumante|sidra|vermut|aperol|champagne)\b/, '🍷'],
  [/\b(fernet|gin|ron|campari|licor|trago|whisky|vodka)\b/, '🥃'],
  [/\b(gaseosa|cola|soda|tonica|isotonica|energizante|kombucha)\b/, '🥤'],
  [/\bagua\b/, '💧'],
  [/\bpizza\b|\bprepizza\b|\bfugazz?a\b|\bfugazzeta\b|\bfaina\b/, '🍕'],
  [/\bhamburguesa/, '🍔'],
  [/\b(pancho|choripan|salchicha)s?\b/, '🌭'],
  [/\b(wrap|burrito|taco)s?\b/, '🌯'],
  [/\b(sandwich|sanguche|lomito|tostado|bagel|ciabatta|miga)s?\b|\bpan (arabe|integral|de centeno|con semillas)\b/, '🥪'],
  [/\bempanadas?\b/, '🥟'],
  [/\b(tarta|quiche|pastel|tartas)\b/, '🥧'],
  [/\b(tortilla|omelette|revuelto|frittata|huevos? (revuelto|frito|poche|duro|cocido)s?)\b|\bhuevos?\b.*\bal plato\b/, '🍳'],
  [/\b(sushi|maki)\b/, '🍣'],
  [/\bmilanesas?\b.*\b(pollo|pavo)\b|\bmilanesas? de (pollo|pavo)/, '🍗'],
  [/\bmilanesas?\b.*\b(berenjena|coliflor|calabaza)\b/, '🍆'],
  [/\bmilanesas?\b|\bschnitzel\b/, '🥩'],
  [/\b(nuggets?|medallon(es)? de pollo)\b/, '🍗'],
  [
    /\b(fideos?|espagueti|espaguetis|tallarin(es)?|noquis|ñoquis|ravioles|sorrentinos|agnolotis?|canelones|lasana|macarrones|tirabuzon|pasta|penne|spaghetti|moños|mostacholes|cabello de angel)\b/,
    '🍝',
  ],
  [/\b(risotto|arroz|paella)\b/, '🍚'],
  [/\b(sopa|crema de|caldo|guiso|estofado|locro|cazuela|minestrone|chili|carbonada|ragu|pucherito|puchero|lentejas? estofadas?)\b/, '🍲'],
  [/\b(ensalada|bowl|poke)\b/, '🥗'],
  [/\b(wok|salteado|salteados?|chop suey)\b/, '🥘'],
  [/\b(avena|granola|muesli|cereal|copos)\b/, '🥣'],
  [/\b(tostadas?|pan|panes|criollos?|rapiditas?|grisines|galletas? de agua|tostadas de mesa|pan lactal)\b/, '🍞'],
  [/\b(medialunas?|facturas?|croissant|bizcochos?)\b/, '🥐'],
  [/\b(panqueques?|tortitas?|crepes?)\b/, '🥞'],
  [/\b(budin|torta|bizcochuelo|magdalena|muffin|cheesecake|tiramisu|brownie|cake)s?\b/, '🍰'],
  [/\b(galletitas?|galletas?|alfajor(es)?|oreo|cookies?)\b/, '🍪'],
  [/\b(flan|postre|mousse|gelatina|pudin|natilla)\b/, '🍮'],
  [/\bchocolate|bombon(es)?|cacao|turron|nibs\b/, '🍫'],
  [/\b(miel|mermelada|membrillo|melaza|jarabe)\b/, '🍯'],
  [/\b(pochoclo|pop corn|palomitas)\b/, '🍿'],
  [/\b(gomitas|caramelos?)\b/, '🍬'],
  // carnes y pescados
  [/\b(pollo|pata muslo|muslo|pechuga|alitas?|pavo|pavita|pata)\b/, '🍗'],
  [
    /\b(carne|bife|nalga|lomo|cuadril|peceto|vacio|asado|costillas?|costeleta|matambre|entrana|osobuco|bondiola|cerdo|cordero|conejo|falda|paleta|bola de lomo|solomillo|carre|higado|tira de asado)\b/,
    '🥩',
  ],
  [/\b(panceta|bacon)\b/, '🥓'],
  [/\b(jamon|salame|mortadela|fiambre|chorizo|morcilla|lomito ahumado)\b/, '🍖'],
  [/\b(langostinos?|camarones?|gambas?)\b/, '🦐'],
  [/\b(calamares?|pulpo|rabas)\b/, '🦑'],
  [/\bmejillones?\b/, '🦪'],
  [
    /\b(pescado|merluza|salmon|atun|trucha|sardinas?|caballa|pejerrey|bacalao|lenguado|surubi|brotola|abadejo|anchoas?|filet|palitos de mar)\b/,
    '🐟',
  ],
  [/\b(huevos?|clara)\b/, '🥚'],
  // lácteos
  [/\b(manteca)\b/, '🧈'],
  [
    /\b(queso|quesos|muzzarella|mozzarella|ricota|cottage|provolone|provoleta|parmesano|sardo|port salut|cheddar|feta|brie|gruyere|mascarpone|tybo|cremoso|pategras|azul|untable)\b/,
    '🧀',
  ],
  [/\b(leche|yogur|yogurt|kefir|crema|chantilly)\b/, '🥛'],
  // verduras
  [/\b(papas?|papines|pure)\b/, '🥔'],
  [/\b(batatas?|boniato|camote)\b/, '🍠'],
  [/\b(zanahorias?)\b/, '🥕'],
  [/\b(tomates?|perita|cherry)\b/, '🍅'],
  [/\b(cebollas?|cebolla morada|chalote|verdeo|puerro)\b/, '🧅'],
  [/\b(ajo)\b/, '🧄'],
  [/\b(morron(es)?|aji|pimiento|pimenton)\b/, '🫑'],
  [/\b(brocoli|coliflor|coles de bruselas)\b/, '🥦'],
  [/\b(lechuga|rucula|espinaca|acelga|kale|hojas verdes|radicheta|escarola|berro|repollo|rucula)\b/, '🥬'],
  [/\b(pepino|zapallitos?|calabacin(es)?|pepinillos?)\b/, '🥒'],
  [/\b(berenjenas?)\b/, '🍆'],
  [/\b(choclo|maiz|humita)\b/, '🌽'],
  [/\b(palta|guacamole|aguacate)\b/, '🥑'],
  [/\b(hongos?|champinon(es)?|girgolas?|shiitake|portobello)\b/, '🍄'],
  [/\b(zapallo|calabaza|anco)\b/, '🎃'],
  [/\b(mandioca|nabo|remolacha|rabanitos?|apio|hinojo|esparragos?|alcauciles?|chauchas?|jengibre)\b/, '🥬'],
  [/\b(perejil|cilantro|albahaca|menta|oregano|hierbas|romero|tomillo)\b/, '🌿'],
  // frutas
  [/\b(manzanas?)\b/, '🍎'],
  [/\b(peras?)\b/, '🍐'],
  [/\b(bananas?)\b/, '🍌'],
  [/\b(naranjas?|mandarinas?|pomelo)\b/, '🍊'],
  [/\b(limon(es)?|lima)\b/, '🍋'],
  [/\b(frutillas?)\b/, '🍓'],
  [/\b(uvas?|pasas)\b/, '🍇'],
  [/\b(sandia)\b/, '🍉'],
  [/\b(melon)\b/, '🍈'],
  [/\b(duraznos?|damascos?|nectarinas?|ciruelas?)\b/, '🍑'],
  [/\b(cerezas?)\b/, '🍒'],
  [/\b(kiwi)\b/, '🥝'],
  [/\b(anana|pina)\b/, '🍍'],
  [/\b(mango|papaya|maracuya)\b/, '🥭'],
  [/\b(coco)\b/, '🥥'],
  [/\b(arandanos?|moras?|frambuesas?|frutos rojos)\b/, '🫐'],
  [/\b(frutas?|ensalada de frutas)\b/, '🍎'],
  // secos, legumbres y despensa
  [/\b(mani|nueces|nuez|almendras?|castanas?|pistachos?|avellanas?|frutos secos|mix de frutos)\b/, '🥜'],
  [/\b(lentejas?|porotos?|garbanzos?|arvejas?|soja|habas|edamame|alubias|hummus|tofu|tempeh)\b/, '🫘'],
  [/\b(aceitunas?|aceite de oliva)\b/, '🫒'],
  [/\b(aceite)\b/, '🫗'],
  [/\b(harina|polenta|maicena|semola|quinoa|cuscus|burgol|mijo|cebada|trigo|amaranto|chia|lino|sesamo|semillas?)\b/, '🌾'],
  [/\b(sal|azucar|pimienta|edulcorante|especias?|polvo de hornear)\b/, '🧂'],
  [/\b(salsa|ketchup|mayonesa|mostaza|aderezo|chimichurri|pesto|vinagre|aceto|golf|barbacoa|teriyaki)\b/, '🥫'],
  [/\b(enlatado|lata|jardinera|picadillo)\b/, '🥫'],
]

// Si no se reconoce nada, el de la categoría
const POR_CATEGORIA = {
  'Carnes y huevos': '🥩',
  Pescados: '🐟',
  Lácteos: '🥛',
  Verduras: '🥬',
  Frutas: '🍎',
  'Pastas y arroz': '🍝',
  Legumbres: '🫘',
  Panadería: '🍞',
  Cereales: '🥣',
  Enlatados: '🥫',
  'Salsas y aderezos': '🥫',
  Despensa: '🧂',
  'Snacks y dulces': '🍪',
  Congelados: '🧊',
  'Comidas hechas': '🍽️',
  Bebidas: '🥤',
  receta: '🍽️',
}

export function emojiDe(nombre, categoria) {
  const t = sinTildes(nombre)
  if (t) {
    for (const [re, e] of FRASES) if (re.test(t)) return e
    let mejor = null
    for (const [re, e] of REGLAS) {
      const m = re.exec(t)
      if (m && (mejor === null || m.index < mejor.pos)) mejor = { pos: m.index, e }
    }
    if (mejor) return mejor.e
  }
  return POR_CATEGORIA[categoria] || '🍽️'
}

// ¿Se reconoció por el nombre? (para las pruebas y para ver qué falta)
export const reconocido = (nombre) => {
  const t = sinTildes(nombre)
  return FRASES.some(([re]) => re.test(t)) || REGLAS.some(([re]) => re.test(t))
}

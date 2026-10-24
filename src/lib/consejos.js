// Consejos de la despensa (1.30): cómo guardar cada cosa para que dure más, cómo aprovecharla y qué hacer cuando está
// por vencer. Se arma un carrusel con los de lo que la persona tiene, primero lo que vence antes.
// Son consejos generales de conservación (no reemplazan lo que diga el envase). Funciones puras, sin React.

// Cada entrada: [patrón sobre el nombre sin tildes, { guardar: [...], aprovechar: [...] }]
// `guardar`: para que dure más. `aprovechar`: ideas para usarlo (sobre todo si está por vencer).
export const CONSEJOS = [
  [
    /ravioles|sorrentinos|capelettis|noquis|ñoquis|tallarines|fideos frescos|pasta fresca|canelones frescos/,
    {
      guardar: ['La pasta fresca dura 2 o 3 días en la heladera. Si no, freezala cruda y separada: se cocina directo, sin descongelar.'],
      aprovechar: ['Si sobró cocida, gratinala al otro día con salsa y queso: queda como recién hecha.'],
    },
  ],
  [
    /lechuga|espinaca|rucula|acelga|kale|radicheta|escarola|mezcla de hojas|hojas verdes/,
    {
      guardar: [
        'Guardala en un tupper con una hoja de papel absorbente: toma la humedad y las hojas duran hasta 4 días más.',
        'Lavala recién cuando la vayas a usar: guardada mojada se pudre antes.',
      ],
      aprovechar: ['Si se está poniendo mustia, salteala con ajo o sumala a una tortilla, un guiso o una sopa.'],
    },
  ],
  [
    /perejil|cilantro|albahaca|ciboulette|eneldo|menta|hierbabuena|romero|tomillo|salvia/,
    {
      guardar: [
        'Poné los tallos en un vaso con un dedo de agua, como un ramo, y tapalo con una bolsa: dura una semana o más.',
        'Picalas y freezalas en una cubetera con un poco de aceite: tenés cubitos listos para la sartén.',
      ],
      aprovechar: ['Las que se están por pasar, procesalas con aceite, ajo y sal: chimichurri o pesto para varios días.'],
    },
  ],
  [
    /verdeo|puerro|cebolla de verdeo/,
    {
      guardar: ['Envuelto en papel húmedo dentro de una bolsa, en el cajón de la heladera: dura casi dos semanas.'],
      aprovechar: ['Picado se puede freezar crudo y usar directo en salteados y tortillas.'],
    },
  ],
  [
    /banana/,
    {
      guardar: [
        'Separala del resto de la fruta: suelta un gas (etileno) que hace madurar más rápido a lo que tiene cerca.',
        'Envolver el cabo del racimo con film la hace durar un par de días más.',
      ],
      aprovechar: ['Si se pone muy madura, pelala, cortala en rodajas y freezala: sirve para licuados o "helado" de banana.'],
    },
  ],
  [
    /palta|aguacate/,
    {
      guardar: [
        'Si todavía está dura dejala afuera; cuando ceda un poco al apretarla, a la heladera.',
        'Si usás la mitad, guardá la otra con el carozo, unas gotas de limón y film pegado a la pulpa.',
      ],
      aprovechar: ['Madura de más es ideal para untar, para guacamole o para sumar a un licuado.'],
    },
  ],
  [
    /tomate/,
    {
      guardar: ['Fuera de la heladera conserva el sabor; a la heladera solo cuando ya está muy maduro.'],
      aprovechar: ['Los muy maduros son los mejores para salsa: rallados o cocinados con ajo y aceite, y se freeza en porciones.'],
    },
  ],
  [
    /papa(?!ya)|batata/,
    {
      guardar: [
        'En un lugar fresco, seco y oscuro, fuera de la heladera (el frío vuelve dulce la papa).',
        'Lejos de la cebolla: juntas se echan a perder antes.',
      ],
      aprovechar: ['Si empieza a brotar, sacale los brotes y las partes verdes y usala pronto: puré, al horno o en guiso.'],
    },
  ],
  [
    /cebolla|ajo|echalote/,
    {
      guardar: ['En un lugar fresco, seco y ventilado, fuera de la heladera y lejos de las papas.'],
      aprovechar: [
        'La cebolla cortada que sobra va en un frasco cerrado a la heladera y dura 3 o 4 días.',
        'Rehogá varias cebollas juntas y freezá en porciones: base lista para salsas y guisos.',
      ],
    },
  ],
  [
    /zanahoria|remolacha|rabanito|nabo/,
    {
      guardar: ['Cortales las hojas (le roban humedad) y guardalas en una bolsa en el cajón de la heladera.'],
      aprovechar: ['Si están blandas, un rato en agua fría las vuelve a poner firmes. Si no, ralladas en tortillas, tartas o budines.'],
    },
  ],
  [
    /zapallo|calabaza|anco|cabutia/,
    {
      guardar: ['Entero dura semanas en un lugar fresco. Cortado, con film y en la heladera, unos 5 días.'],
      aprovechar: ['Hervido o al horno se puede hacer puré y freezar, o sumar a sopas, tartas y hasta budines.'],
    },
  ],
  [
    /zapallito|zucchini|berenjena|morron|pimiento|aji|pepino|chaucha/,
    {
      guardar: ['En el cajón de la heladera, sin lavar y en una bolsa abierta para que no junte humedad.'],
      aprovechar: ['Asados o grillados duran 4 días en la heladera y suman a tartas, pastas y sándwiches.'],
    },
  ],
  [
    /brocoli|coliflor|repollo|col /,
    {
      guardar: ['En una bolsa abierta en el cajón de la heladera; el brócoli, mejor en los primeros 3 o 4 días.'],
      aprovechar: ['Blanqueado (1 minuto en agua hirviendo y después agua fría) se freeza bien varios meses.'],
    },
  ],
  [
    /choclo(?! en lata| cremogenado)|granos de maiz/,
    {
      guardar: ['El choclo fresco pierde dulzor rápido: usalo en 1 o 2 días, o desgranalo y freezalo.'],
      aprovechar: ['Desgranado y salteado suma a ensaladas, tartas y humitas.'],
    },
  ],
  [
    /champi|hongo|portobello/,
    {
      guardar: ['En una bolsa de papel en la heladera, no en plástico: así no se ponen babosos.'],
      aprovechar: ['Salteados con ajo se pueden freezar y usar en salsas y risottos.'],
    },
  ],
  [
    /manzana|pera/,
    {
      guardar: ['En la heladera duran semanas más que en la frutera. Separadas de otras frutas: sueltan etileno.'],
      aprovechar: ['Las que se ablandaron, al horno con canela, en compota o rallada en un budín.'],
    },
  ],
  [
    /naranja|mandarina|limon|lima|pomelo/,
    {
      guardar: ['Afuera duran una semana; en la heladera, hasta un mes.'],
      aprovechar: ['Antes de que se sequen, exprimilas y freezá el jugo en cubeteras. La ralladura también se freeza.'],
    },
  ],
  [
    /frutilla|arandano|frambuesa|mora|cereza|uva/,
    {
      guardar: ['Sin lavar, en un recipiente con papel absorbente en la heladera. Se lavan recién antes de comerlas.'],
      aprovechar: ['Las que se están ablandando, al freezer: sirven para licuados, yogur o una salsa rápida.'],
    },
  ],
  [
    /durazno|ciruela|damasco|kiwi|mango|anana|pina|melon|sandia|papaya/,
    {
      guardar: ['Dejala madurar afuera y, cuando está a punto, a la heladera para frenarla.'],
      aprovechar: ['Cortada en cubos y freezada sirve para licuados y postres.'],
    },
  ],
  [
    /huevo/,
    {
      guardar: [
        'En su maple y en un estante de la heladera, no en la puerta: los cambios de temperatura los gastan antes.',
        'No los laves antes de guardarlos: se les va la capa que los protege.',
      ],
      aprovechar: [
        '¿No sabés si sigue bueno? En un vaso con agua: si se hunde está bien; si flota, mejor no usarlo.',
        'Si sobran, hacé huevos duros: duran una semana en la heladera, con cáscara.',
      ],
    },
  ],
  [
    /pan(?!ceta|queque)|tostada|rodaja|lactal|baguette|figaza|criollo|bizcocho/,
    {
      guardar: [
        'Si no lo terminás en 2 o 3 días, freezalo en rodajas y tostalo directo del freezer.',
        'En la heladera el pan se pone duro más rápido: mejor freezer o panera.',
      ],
      aprovechar: ['El pan duro sirve para pan rallado, budín de pan, croutons o una torrija.'],
    },
  ],
  [
    /arroz|fideo|pasta|harina|avena|lenteja|garbanzo|poroto|polenta|quinoa|semola|cuscus/,
    {
      guardar: [
        'Una vez abierto, pasalo a un frasco o tupper bien cerrado: no agarra humedad ni bichos.',
        'Una hoja de laurel en el frasco ayuda a alejar los gorgojos.',
      ],
      aprovechar: ['Cocido dura 3 o 4 días en la heladera: cociná de más y tenés base para varias comidas.'],
    },
  ],
  [
    /queso|ricota|muzzarella|mozzarella|reggianito|cremoso|port salut|sardo|tybo/,
    {
      guardar: [
        'Envolvelo en papel manteca y después en una bolsa: respira y no se seca. El rallado, siempre bien cerrado.',
        'La muzzarella y el queso para rallar se pueden freezar (rallados o en cubos) para cocinar.',
      ],
      aprovechar: ['Los pedacitos que quedan van a una tarta, una salsa blanca o una pizza.'],
    },
  ],
  [
    /leche|yogur|crema|manteca|dulce de leche/,
    {
      guardar: [
        'En un estante del medio de la heladera, no en la puerta. Una vez abierto, fijate cuántos días dura en el envase.',
        'Cerrá bien y no lo dejes afuera mientras comés: cada rato a temperatura ambiente le resta vida.',
      ],
      aprovechar: ['La leche que está por vencer va a un flan, un arroz con leche o una salsa blanca (se puede freezar).'],
    },
  ],
  [
    /pollo|pechuga|muslo|pata|suprema/,
    {
      guardar: [
        'Crudo dura 1 o 2 días en la heladera, en la parte de abajo. Si no, al freezer en porciones con la fecha.',
        'Se descongela en la heladera (de un día para el otro), nunca afuera.',
      ],
      aprovechar: ['Cocido dura 3 o 4 días: desmenuzado sirve para tartas, ensaladas, wraps y sándwiches.'],
    },
  ],
  [
    /carne|bife|picada|milanesa|nalga|cuadril|asado|vacio|matambre|peceto|bola de lomo|roast|osobuco|lomo|cerdo|bondiola|chorizo|salchicha/,
    {
      guardar: [
        'Si no la vas a usar en 1 o 2 días (la picada, en el día), freezala en porciones con la fecha escrita.',
        'En el estante de abajo de la heladera, en un recipiente: así no gotea sobre lo demás.',
      ],
      aprovechar: ['La carne cocida que sobra se convierte en relleno de empanadas, tartas o un salteado.'],
    },
  ],
  [
    /fiambre|jamon|salame|mortadela|paleta|bondiola cocida|lomito/,
    {
      guardar: ['Abierto dura 3 a 5 días en la heladera, bien envuelto en film o en un tupper.'],
      aprovechar: ['Lo que queda, en tortillas, tartas o una pizza casera.'],
    },
  ],
  [
    /pescado|merluza|salmon|atun fresco|abadejo|pejerrey|langostino|camaron|mariscos/,
    {
      guardar: ['El pescado fresco se come en 1 o 2 días; si no, al freezer bien envuelto.'],
      aprovechar: ['Cocido dura 2 días: sirve para croquetas, buñuelos o una ensalada.'],
    },
  ],
  [
    /atun|caballa|sardina|anchoa|lata|conserva|pure de tomate|extracto de tomate|tomate triturado/,
    {
      guardar: ['Una vez abierta, pasá lo que sobra a un tupper de vidrio: en la lata se oxida. Dura 2 o 3 días en la heladera.'],
      aprovechar: ['El puré de tomate que sobra se freeza en cubeteras: porciones justas para la próxima salsa.'],
    },
  ],
  [
    /aceite/,
    {
      guardar: ['Lejos de la hornalla y de la luz, bien tapado: el calor y la luz lo ponen rancio.'],
      aprovechar: ['Si huele a pintura o a nuez rancia, ya no sirve: mejor tirarlo.'],
    },
  ],
  [
    /yerba|cafe|te |hebras/,
    {
      guardar: ['En un recipiente hermético, lejos del calor y la humedad (no al lado de la pava ni de la hornalla).'],
      aprovechar: ['La borra de café sirve de abono para las plantas.'],
    },
  ],
  [
    /galletit|tostadas de arroz|cereal|granola|snack|papas fritas|mani|almendra|nuez|castana|frutos secos/,
    {
      guardar: [
        'Bien cerrados (con un broche o en un frasco) para que no se humedezcan.',
        'Los frutos secos duran más en la heladera o el freezer: tienen grasas que se ponen rancias.',
      ],
      aprovechar: ['Las galletitas o cereales que se ablandaron recuperan lo crocante con unos minutos de horno.'],
    },
  ],
  [
    /mayonesa|ketchup|mostaza|salsa|aderezo|chimichurri|pesto/,
    {
      guardar: ['Abiertos, a la heladera; mirá en el envase cuántos días duran.'],
      aprovechar: ['Usá siempre una cuchara limpia: las migas o restos de comida hacen que se eche a perder antes.'],
    },
  ],
  [
    /tapa|masa|empanada|tarta|pascualina|pizza/,
    {
      guardar: ['Las tapas de empanada o tarta se pueden freezar en su envase y descongelar en la heladera.'],
      aprovechar: ['¿Te sobran tapas? Rellenalas con lo que haya en la heladera: verduras salteadas, queso, carne o pollo.'],
    },
  ],
  [
    /comida|guiso|estofado|sopa|salsa casera|milanesas caseras|tortilla/,
    {
      guardar: ['La comida hecha dura 3 o 4 días en la heladera; si no, porcionada al freezer con la fecha.'],
      aprovechar: ['Enfriala rápido (repartida en recipientes chicos) antes de guardarla: así se conserva mejor.'],
    },
  ],
]

// Por categoría, cuando el nombre no coincide con nada
export const CONSEJOS_POR_CATEGORIA = {
  'Carnes y huevos': { guardar: ['Lo que no uses en 1 o 2 días, al freezer en porciones con la fecha escrita.'] },
  Pescados: { guardar: ['El pescado fresco se come en 1 o 2 días; si no, al freezer bien envuelto.'] },
  Lácteos: { guardar: ['En el estante del medio de la heladera, no en la puerta, donde la temperatura cambia más.'] },
  Verduras: { guardar: ['Las de hoja, con papel absorbente en un tupper; las demás, en el cajón de la heladera.'] },
  Frutas: { guardar: ['Separá las que maduran rápido (banana, palta) del resto para que no aceleren a las demás.'] },
  'Pastas y arroz': { guardar: ['Una vez abierto, a un frasco bien cerrado.'] },
  Legumbres: { guardar: ['Secas, en frasco cerrado; cocidas, hasta 4 días en la heladera o meses en el freezer.'] },
  Panadería: { guardar: ['Lo que no termines en 2 o 3 días, al freezer en rodajas.'] },
  Cereales: { guardar: ['Bien cerrados, para que no pierdan lo crocante.'] },
  Enlatados: { guardar: ['Una vez abierta la lata, lo que sobra va a un tupper en la heladera.'] },
  'Salsas y aderezos': { guardar: ['Abiertos, a la heladera; mirá en el envase cuántos días duran.'] },
  Despensa: { guardar: ['En un lugar fresco, seco y lejos de la luz.'] },
  'Snacks y dulces': {
    guardar: ['Bien cerrados para que no se humedezcan.'],
    aprovechar: ['El chocolate que se puso blanquecino sigue bueno: es la manteca de cacao que salió a la superficie.'],
  },
  Congelados: {
    guardar: ['No vuelvas a congelar lo que ya descongelaste.', 'Anotá la fecha al freezar: la mayoría está bien hasta 3 meses.'],
    aprovechar: ['Las verduras congeladas van directo a la sartén o a la olla, sin descongelar.'],
  },
  'Comidas hechas': {
    guardar: [
      'En la heladera dura hasta 3 o 4 días; si no, porcionado al freezer.',
      'Dejala enfriar repartida en recipientes chicos antes de taparla y guardarla.',
    ],
    aprovechar: ['Lo que sobra de una comida puede ser el almuerzo de mañana: anotalo en el plan y te ahorrás cocinar.'],
  },
  Bebidas: {
    guardar: ['Una vez abierta, a la heladera y bien tapada.'],
    aprovechar: ['Los jugos y la leche que están por vencer se pueden freezar en cubeteras para licuados.'],
  },
}

// Consejos generales, para cuando la despensa tiene poco
export const GENERALES = [
  'Lo nuevo atrás y lo viejo adelante: así usás primero lo que vence antes.',
  'La heladera tiene que estar a 4 °C o menos. Si está muy llena, el frío no circula y las cosas duran menos.',
  'Anotá la fecha en todo lo que freezás: lo vas a usar a tiempo.',
  'Antes de ir a comprar, mirá la despensa y la lista: es la forma más fácil de no tirar comida.',
]

// En estas categorías el nombre engaña (una "empanada de carne" no se guarda como la carne, ni un "jugo de naranja" como
// la naranja): se usa el consejo de la categoría, salvo los patrones que sí corresponden a ese tipo de producto.
const SOLO_CATEGORIA = {
  'Comidas hechas': /comida|guiso|estofado|sopa|tortilla|masa|tapa/,
  Bebidas: /leche|yogur/,
  Congelados: null,
  'Snacks y dulces': /galletit|cereal|granola|snack|papas fritas|mani|almendra|nuez|castana|frutos secos/,
  Enlatados: /atun|caballa|sardina|anchoa|lata|conserva/,
  'Salsas y aderezos': /mayonesa|ketchup|mostaza|salsa|aderezo|chimichurri|pesto|pure de tomate|extracto de tomate|tomate triturado|lata/,
}

export const sinTildes = (t) =>
  String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// Los patrones, para que cada palabra se reconozca desde su comienzo (que "chocolate" no sea "té" ni "alfajor" sea "ajo")
const PATRONES = CONSEJOS.map(([patron, c]) => [new RegExp(`(?<![a-z])(?:${patron.source})`), c])

// Todos los consejos de un alimento: { guardar: [...], aprovechar: [...] } (puede venir vacío)
export function consejosDe(alimento) {
  if (!alimento) return { guardar: [], aprovechar: [] }
  const nombre = ` ${sinTildes(alimento.name)} `
  const categoria = alimento.categoria_base || alimento.category
  const permitido = Object.hasOwn(SOLO_CATEGORIA, categoria) ? SOLO_CATEGORIA[categoria] : true
  if (permitido) {
    for (const [patron, c] of PATRONES) {
      const m = nombre.match(patron)
      if (m && (permitido === true || permitido.test(m[0]))) return { guardar: c.guardar || [], aprovechar: c.aprovechar || [] }
    }
  }
  const cat = CONSEJOS_POR_CATEGORIA[categoria]
  return { guardar: cat?.guardar || [], aprovechar: cat?.aprovechar || [] }
}

// Un número que cambia cada día (para que los consejos roten sin ser al azar en cada render)
const semilla = (hoy) => [...String(hoy || '')].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7)

// Los consejos del carrusel para las filas de la despensa ({ a, qty, estado }). Primero lo que vence antes (con una idea
// para aprovecharlo), después uno por alimento, rotando cada día. Sin repetir el mismo texto. Hasta `maximo`.
// Devuelve [{ id, alimento, texto, tipo: 'vence' | 'guardar' | 'aprovechar' | 'general', estado }]
export function consejosPara(filas, { hoy = '', maximo = 10 } = {}) {
  const s = semilla(hoy)
  const usados = new Set()
  const salida = []
  const sumar = (c) => {
    if (!c.texto || usados.has(c.texto) || salida.length >= maximo) return
    usados.add(c.texto)
    salida.push(c)
  }
  const conStock = (filas || []).filter((f) => Number(f.qty) > 0 && f.a)
  // 1. Lo que vence pronto (vencido no: eso ya no se aprovecha)
  const urgentes = conStock
    .filter((f) => f.estado && (f.estado.nivel === 'urgente' || f.estado.nivel === 'pronto'))
    .sort((x, y) => (x.estado.dias ?? 99) - (y.estado.dias ?? 99))
  for (const f of urgentes) {
    const c = consejosDe(f.a)
    const lista = c.aprovechar.length ? c.aprovechar : c.guardar
    if (lista.length) sumar({ id: `vence-${f.a.id}`, alimento: f.a, texto: lista[s % lista.length], tipo: 'vence', estado: f.estado })
  }
  // 2. Uno por alimento, empezando por uno distinto cada día
  const resto = conStock.filter((f) => !urgentes.includes(f))
  const inicio = resto.length ? s % resto.length : 0
  const rotados = [...resto.slice(inicio), ...resto.slice(0, inicio)]
  for (const [i, f] of rotados.entries()) {
    const c = consejosDe(f.a)
    const todos = [...c.guardar.map((t) => ['guardar', t]), ...c.aprovechar.map((t) => ['aprovechar', t])]
    if (!todos.length) continue
    const [tipo, texto] = todos[(s + i) % todos.length]
    sumar({ id: `${tipo}-${f.a.id}`, alimento: f.a, texto, tipo })
  }
  // 3. Si quedó poco, generales
  for (const [i, texto] of GENERALES.entries())
    if (salida.length < Math.min(3, maximo)) sumar({ id: `general-${i}`, alimento: null, texto, tipo: 'general' })
  return salida
}

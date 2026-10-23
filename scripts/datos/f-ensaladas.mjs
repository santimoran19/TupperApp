// Ensaladas: una base de hojas, una proteína, dos acompañamientos y un aderezo.
import { cap, elegir, lista, mezclar } from './motor.mjs'

const BASES = [
  { s: 'lechuga', n: 'lechuga', g: 80, prep: 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.' },
  { s: 'rucula', n: 'rúcula', g: 60, prep: 'Lavás y secás la rúcula; la ponés en un bowl grande.' },
  { s: 'espinaca', n: 'espinaca', g: 60, prep: 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.' },
  {
    s: 'repollo',
    n: 'repollo',
    g: 90,
    prep: 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.',
  },
  {
    s: 'kale',
    n: 'kale',
    g: 55,
    prep: 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.',
  },
  { s: 'radicheta', n: 'radicheta', g: 55, prep: 'Lavás y secás la radicheta y la cortás en trozos.' },
  { s: 'escarola', n: 'escarola', g: 65, prep: 'Lavás y secás la escarola y la cortás en trozos.' },
  { s: 'berro', n: 'berro', g: 55, prep: 'Lavás el berro, sacás los tallos más duros y lo secás bien.' },
  { s: 'hojas-verdes', n: 'hojas verdes', g: 75, prep: 'Lavás y secás las hojas verdes y las ponés en un bowl grande.' },
  {
    s: 'lechuga-morada',
    n: 'lechuga morada',
    g: 70,
    prep: 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.',
  },
  {
    s: 'repollo-colorado',
    n: 'repollo colorado',
    g: 90,
    prep: 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.',
  },
]

// min: minutos de preparación; fruta: si va bien con frutas; sal: algo de aceite que se usa para cocinarla
const PROTEINAS = [
  {
    s: 'huevo',
    n: 'huevo duro',
    g: 100,
    min: 12,
    fruta: false,
    prep: 'Hervís los huevos 10 minutos, los pasás por agua fría, los pelás y los cortás en cuartos.',
  },
  { s: 'atun-natural', n: 'atún', g: 120, min: 3, fruta: false, prep: 'Escurrís bien el atún y lo desmenuzás con un tenedor.' },
  {
    s: 'pechuga-cruda',
    n: 'pollo grillado',
    g: 150,
    min: 15,
    fruta: true,
    aceite: 4,
    prep: 'Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.',
  },
  {
    s: 'pechuga-pavo',
    n: 'pavo grillado',
    g: 150,
    min: 15,
    fruta: true,
    aceite: 4,
    prep: 'Salpimentás la pechuga de pavo y la cocinás en plancha caliente 5 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.',
  },
  {
    s: 'bife-nalga',
    n: 'bife de nalga',
    g: 150,
    min: 12,
    fruta: true,
    aceite: 4,
    prep: 'Sellás el bife en una plancha bien caliente 3 minutos por lado, con sal y pimienta. Lo dejás reposar 3 minutos y lo cortás en tiras.',
  },
  { s: 'jamon-cocido', n: 'jamón cocido', g: 70, min: 2, fruta: false, prep: 'Cortás el jamón en tiritas.' },
  { s: 'jamon-crudo', n: 'jamón crudo', g: 45, min: 2, fruta: true, prep: 'Rompés el jamón crudo en tiras con la mano.' },
  { s: 'queso-cremoso', n: 'queso cremoso', g: 80, min: 2, fruta: true, prep: 'Cortás el queso en cubos.' },
  { s: 'muzzarella', n: 'muzzarella', g: 80, min: 2, fruta: false, prep: 'Cortás la muzzarella en cubos o la rompés a mano.' },
  { s: 'queso-cabra', n: 'queso de cabra', g: 60, min: 2, fruta: true, prep: 'Desmenuzás el queso de cabra por encima.' },
  { s: 'feta', n: 'queso feta', g: 60, min: 2, fruta: true, prep: 'Cortás el feta en cubos.' },
  { s: 'cottage', n: 'queso cottage', g: 100, min: 1, fruta: true, prep: 'Reservás el queso cottage para servir arriba.' },
  { s: 'garbanzos-hervidos', n: 'garbanzos', g: 130, min: 3, fruta: false, prep: 'Enjuagás los garbanzos y los escurrís bien.' },
  { s: 'lentejas-hervidas', n: 'lentejas', g: 130, min: 3, fruta: false, prep: 'Enjuagás las lentejas y las escurrís bien.' },
  { s: 'porotos-hervidos', n: 'porotos', g: 130, min: 3, fruta: false, prep: 'Enjuagás los porotos y los escurrís bien.' },
  {
    s: 'porotos-negros-hervidos',
    n: 'porotos negros',
    g: 130,
    min: 3,
    fruta: false,
    prep: 'Enjuagás los porotos negros y los escurrís bien.',
  },
  { s: 'alubias', n: 'alubias', g: 130, min: 3, fruta: false, prep: 'Enjuagás las alubias y las escurrís bien.' },
  { s: 'edamame', n: 'edamame', g: 100, min: 3, fruta: false, prep: 'Descongelás el edamame con agua caliente y lo escurrís.' },
  {
    s: 'tofu',
    n: 'tofu dorado',
    g: 120,
    min: 10,
    fruta: false,
    aceite: 5,
    prep: 'Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.',
  },
  { s: 'salmon-ahumado', n: 'salmón ahumado', g: 60, min: 2, fruta: true, prep: 'Cortás el salmón ahumado en tiras.' },
  {
    s: 'langostinos',
    n: 'langostinos',
    g: 120,
    min: 8,
    fruta: true,
    aceite: 5,
    prep: 'Salteás los langostinos pelados 2 minutos por lado con una pizca de ajo y sal.',
  },
  { s: 'mejillones', n: 'mejillones', g: 100, min: 2, fruta: false, prep: 'Escurrís los mejillones y los sumás enteros.' },
]

const EXTRAS = [
  { s: 'tomate-cherry', n: 'tomates cherry', g: 80, corte: 'los tomates cherry por la mitad' },
  { s: 'tomate', n: 'tomate', g: 110, corte: 'el tomate en gajos' },
  { s: 'zanahoria', n: 'zanahoria', g: 60, corte: 'la zanahoria rallada' },
  { s: 'palta', n: 'palta', g: 55, corte: 'la palta en cubos' },
  { s: 'choclo', n: 'choclo', g: 50, corte: 'el choclo escurrido' },
  { s: 'remolacha-cocida', n: 'remolacha', g: 70, corte: 'la remolacha cocida en cubos' },
  { s: 'pepino', n: 'pepino', g: 70, corte: 'el pepino en rodajas' },
  { s: 'cebolla-morada', n: 'cebolla morada', g: 25, corte: 'la cebolla morada en plumas finitas' },
  { s: 'morron', n: 'morrón', g: 60, corte: 'el morrón en tiras' },
  { s: 'rabanito', n: 'rabanitos', g: 30, corte: 'los rabanitos en rodajas finas' },
  { s: 'apio', n: 'apio', g: 35, corte: 'el apio en rodajitas' },
  { s: 'hinojo', n: 'hinojo', g: 45, corte: 'el hinojo en láminas finas' },
  { s: 'palmitos', n: 'palmitos', g: 45, corte: 'los palmitos en rodajas' },
  { s: 'aceitunas', n: 'aceitunas', g: 18, corte: 'las aceitunas' },
  { s: 'brotes-soja', n: 'brotes de soja', g: 30, corte: 'los brotes de soja' },
  { s: 'arvejas-frescas', n: 'arvejas', g: 45, corte: 'las arvejas hervidas 3 minutos' },
  { s: 'zanahoria-rallada', n: 'zanahoria rallada', g: 60, corte: 'la zanahoria rallada' },
  { s: 'nueces', n: 'nueces', g: 15, dulce: true, corte: 'las nueces picadas' },
  { s: 'almendras', n: 'almendras', g: 15, dulce: true, corte: 'las almendras fileteadas' },
  { s: 'semillas-girasol', n: 'semillas de girasol', g: 12, dulce: true, corte: 'las semillas de girasol' },
  { s: 'manzana', n: 'manzana', g: 70, fruta: true, corte: 'la manzana en cubitos (con unas gotas de limón para que no se oscurezca)' },
  { s: 'naranja', n: 'naranja', g: 90, fruta: true, corte: 'la naranja pelada a vivo y en gajos' },
  { s: 'mango', n: 'mango', g: 80, fruta: true, corte: 'el mango en cubos' },
  { s: 'pera', n: 'pera', g: 80, fruta: true, corte: 'la pera en láminas' },
  { s: 'frutilla', n: 'frutillas', g: 70, fruta: true, corte: 'las frutillas en cuartos' },
  { s: 'uva', n: 'uvas', g: 60, fruta: true, corte: 'las uvas cortadas al medio' },
  { s: 'pasas', n: 'pasas de uva', g: 15, fruta: true, corte: 'las pasas de uva' },
  { s: 'parmesano', n: 'parmesano', g: 15, corte: 'el parmesano en lascas con el pelapapas' },
  { s: 'croutons', n: 'croutons', g: 20, corte: 'los croutons' },
]

const ADEREZOS = [
  {
    n: 'limón y oliva',
    fruta: true,
    items: [
      ['aceite-oliva', 8],
      ['limon-exprimido', 15],
    ],
    paso: 'Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta.',
  },
  {
    n: 'yogur y limón',
    fruta: true,
    items: [
      ['yogur-natural', 45],
      ['limon-exprimido', 10],
    ],
    paso: 'Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir.',
  },
  {
    n: 'mostaza y miel',
    fruta: true,
    items: [
      ['mostaza', 8],
      ['miel', 8],
      ['aceite-oliva', 8],
      ['vinagre-manzana', 5],
    ],
    paso: 'Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir.',
  },
  {
    n: 'salsa césar',
    fruta: false,
    items: [['aderezo-cesar', 20]],
    paso: 'Aderezás con una cucharada sopera de salsa césar y mezclás bien.',
  },
  {
    n: 'tahini y limón',
    fruta: false,
    items: [
      ['tahini', 15],
      ['limon-exprimido', 15],
    ],
    paso: 'Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima.',
  },
  {
    n: 'aceto balsámico',
    fruta: true,
    items: [
      ['aceto', 10],
      ['aceite-oliva', 8],
    ],
    paso: 'Aderezás con el aceto, el aceite de oliva, sal y pimienta.',
  },
  { n: 'pesto', fruta: false, items: [['pesto', 20]], paso: 'Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás.' },
  {
    n: 'yogur y mostaza antigua',
    fruta: false,
    items: [
      ['yogur-natural', 45],
      ['mostaza-antigua', 6],
    ],
    paso: 'Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir.',
  },
]

export function generarEnsaladas({ az, armador, cuantas }) {
  const combos = []
  for (const b of BASES)
    for (const p of PROTEINAS) {
      combos.push([b, p])
    }
  let hechas = 0
  for (const [b, p] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const permitidos = EXTRAS.filter((e) => (e.fruta || e.dulce ? p.fruta : true))
    const e1 = elegir(az, permitidos.filter((e) => !e.dulce && !e.fruta).concat(permitidos))
    let e2 = elegir(az, permitidos)
    let intentos = 0
    while ((e2 === e1 || e2.s === e1.s || (e1.fruta && e2.fruta)) && intentos++ < 20) e2 = elegir(az, permitidos)
    if (e2 === e1) continue
    const extras = [e1, e2]
    const fruta = extras.some((e) => e.fruta)
    const aderezo = elegir(
      az,
      ADEREZOS.filter((a) => (fruta ? a.fruta : true)),
    )
    const nombre = `Ensalada de ${b.n} con ${p.n}, ${e1.n} y ${e2.n}`
    const ingredientes = [[b.s, b.g], [p.s, p.g], ...extras.map((e) => [e.s, e.g]), ...aderezo.items]
    if (p.aceite) ingredientes.push(['aceite', p.aceite])
    const ok = armador.agregar({
      nombre,
      minutos: 8 + p.min,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [190, 650],
      prot: 9,
      ingredientes,
      pasos: [
        b.prep,
        `Preparás ${lista(extras.map((e) => e.corte))}.`,
        p.prep,
        `Sumás todo al bowl. ${aderezo.paso} ${cap(elegir(az, ['Servís enseguida.', 'Mezclás suave y servís.', 'Se puede llevar con el aderezo aparte.']))}`,
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

// Hamburguesas caseras, milanesas al horno y albóndigas, con su acompañamiento.
import { mezclar } from './motor.mjs'

const BURGERS = [
  {
    n: 'carne',
    it: [
      ['carne-picada-magra', 130],
      ['cebolla', 25],
      ['perejil', 3],
    ],
    paso: 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.',
    min: 10,
    prot: 20,
  },
  {
    n: 'pollo',
    it: [
      ['picada-pollo', 140],
      ['cebolla', 25],
      ['ajo', 3],
      ['perejil', 3],
    ],
    paso: 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.',
    min: 10,
    prot: 20,
  },
  {
    n: 'pavo',
    it: [
      ['picada-pavo', 140],
      ['cebolla', 25],
      ['perejil', 3],
    ],
    paso: 'Mezclás el pavo picado con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.',
    min: 10,
    prot: 20,
  },
  {
    n: 'lentejas',
    it: [
      ['lentejas-hervidas', 150],
      ['avena', 20],
      ['zanahoria', 30],
      ['cebolla', 20],
      ['huevo', 25],
    ],
    paso: 'Aplastás las lentejas hervidas con un tenedor, las mezclás con la zanahoria rallada, la cebolla picada, la avena, el huevo, comino y sal; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.',
    min: 25,
    prot: 12,
  },
  {
    n: 'garbanzos',
    it: [
      ['garbanzos-hervidos', 150],
      ['avena', 20],
      ['cebolla', 20],
      ['ajo', 3],
      ['perejil', 4],
    ],
    paso: 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.',
    min: 25,
    prot: 10,
  },
  {
    n: 'atún',
    it: [
      ['atun-natural', 120],
      ['papa-hervida', 70],
      ['huevo', 25],
      ['perejil', 3],
      ['pan-rallado', 10],
    ],
    paso: 'Desmenuzás el atún escurrido y lo mezclás con la papa hervida pisada, el huevo, el perejil, el pan rallado, sal y pimienta; formás la hamburguesa.',
    min: 15,
    prot: 20,
  },
  {
    n: 'calabaza y queso',
    it: [
      ['calabaza', 120],
      ['avena', 30],
      ['queso-cremoso', 30],
      ['cebolla', 20],
    ],
    paso: 'Hervís la calabaza hasta que esté tierna, la pisás y la mezclás con la avena, el queso en cubitos, la cebolla rallada, sal y nuez moscada; formás la hamburguesa.',
    min: 30,
    prot: 8,
  },
  {
    n: 'merluza',
    it: [
      ['merluza-cruda', 150],
      ['papa-hervida', 50],
      ['perejil', 4],
      ['pan-rallado', 15],
      ['huevo', 25],
    ],
    paso: 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.',
    min: 20,
    prot: 18,
  },
  {
    n: 'espinaca y ricota',
    it: [
      ['espinaca', 80],
      ['ricota', 80],
      ['avena', 25],
      ['huevo', 25],
      ['queso-rallado', 10],
    ],
    paso: 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.',
    min: 20,
    prot: 12,
  },
  {
    n: 'cerdo',
    it: [
      ['picada-cerdo', 120],
      ['cebolla', 25],
      ['mostaza', 5],
    ],
    paso: 'Mezclás la carne picada de cerdo con la cebolla rallada, la mostaza, sal y pimienta; formás una hamburguesa de 2 cm.',
    min: 10,
    prot: 17,
  },
]
const SERVIDAS = [
  {
    n: 'con ensalada de lechuga y tomate',
    it: [
      ['lechuga', 70],
      ['tomate', 110],
      ['aceite-oliva', 8],
    ],
    paso: 'Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.',
  },
  {
    n: 'con puré de papa',
    it: [
      ['papa', 200],
      ['leche', 40],
      ['manteca', 5],
    ],
    paso: 'Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.',
  },
  {
    n: 'con papas al horno',
    it: [
      ['papa', 200],
      ['aceite', 8],
    ],
    paso: 'Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.',
  },
  {
    n: 'con arroz y zanahoria',
    it: [
      ['arroz', 60],
      ['zanahoria', 60],
    ],
    paso: 'Servís con arroz hervido y zanahoria rallada cruda.',
  },
  {
    n: 'en pan con tomate y lechuga',
    it: [
      ['pan-hamburguesa', 60],
      ['tomate', 60],
      ['lechuga', 25],
      ['mostaza', 5],
    ],
    paso: 'Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.',
  },
  {
    n: 'con vegetales grillados',
    it: [
      ['zapallito', 100],
      ['berenjena', 80],
      ['morron', 60],
      ['aceite', 8],
    ],
    paso: 'Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.',
  },
  {
    n: 'con batatas al horno',
    it: [
      ['batata', 200],
      ['aceite', 6],
    ],
    paso: 'Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.',
  },
  {
    n: 'con ensalada de repollo',
    it: [
      ['repollo', 90],
      ['zanahoria', 50],
      ['aceite-oliva', 8],
      ['limon-exprimido', 10],
    ],
    paso: 'Servís con ensalada de repollo y zanahoria rallados, con aceite de oliva y limón.',
  },
]

export function generarHamburguesas({ az, armador, cuantas }) {
  const combos = []
  for (const b of BURGERS) for (const s of SERVIDAS) combos.push([b, s])
  let hechas = 0
  for (const [b, s] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Hamburguesa de ${b.n} ${s.n}`,
      minutos: b.min + 18,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [330, 850],
      prot: 15,
      ingredientes: [...b.it, ...s.it, ['aceite', 4]],
      pasos: [
        b.paso,
        'Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).',
        s.paso,
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

const MILANESAS = [
  { n: 'pollo', it: [['pechuga-cruda', 150]], aplanar: 'Aplastás la pechuga en filetes finos con un palo de amasar.', min: 30 },
  { n: 'nalga', it: [['bife-nalga', 150]], aplanar: 'Pedís la nalga en bifes finos o los aplastás con un palo de amasar.', min: 30 },
  { n: 'merluza', it: [['merluza-cruda', 160]], aplanar: 'Secás bien los filetes de merluza con papel.', min: 25 },
  {
    n: 'berenjena',
    it: [['berenjena', 170]],
    aplanar: 'Cortás la berenjena en rodajas de 1 cm y las salás 10 minutos para que larguen el agua; las secás con papel.',
    min: 35,
    prot: 8,
  },
  {
    n: 'coliflor',
    it: [['coliflor', 200]],
    aplanar: 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.',
    min: 35,
    prot: 9,
  },
  { n: 'pavo', it: [['pechuga-pavo', 150]], aplanar: 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.', min: 30 },
  {
    n: 'cerdo',
    it: [['lomo-cerdo', 150]],
    aplanar: 'Cortás el solomillo en medallones y los aplastás finos con un palo de amasar.',
    min: 30,
  },
  {
    n: 'calabaza',
    it: [['calabaza', 200]],
    aplanar: 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.',
    min: 35,
    prot: 6,
  },
]
const ACOMP = [
  {
    n: 'ensalada mixta',
    it: [
      ['lechuga', 70],
      ['tomate', 110],
      ['cebolla-morada', 20],
      ['aceite-oliva', 8],
    ],
    paso: 'Servís con ensalada de lechuga, tomate y cebolla morada.',
  },
  {
    n: 'puré de papa',
    it: [
      ['papa', 200],
      ['leche', 40],
      ['manteca', 5],
    ],
    paso: 'Servís con puré de papa.',
  },
  {
    n: 'papas al horno',
    it: [
      ['papa', 200],
      ['aceite', 8],
    ],
    paso: 'Servís con papas al horno en gajos.',
  },
  { n: 'arroz', it: [['arroz', 60]], paso: 'Servís con arroz blanco.' },
  {
    n: 'ensalada de rúcula y tomates cherry',
    it: [
      ['rucula', 50],
      ['tomate-cherry', 100],
      ['aceite-oliva', 8],
      ['parmesano', 10],
    ],
    paso: 'Servís con ensalada de rúcula, cherry y lascas de parmesano.',
  },
  {
    n: 'zapallitos grillados',
    it: [
      ['zapallito', 150],
      ['aceite', 6],
    ],
    paso: 'Servís con zapallitos grillados.',
  },
  {
    n: 'puré de calabaza',
    it: [
      ['calabaza', 220],
      ['manteca', 5],
    ],
    paso: 'Servís con puré de calabaza.',
  },
  {
    n: 'ensalada de repollo y zanahoria',
    it: [
      ['repollo', 90],
      ['zanahoria', 60],
      ['aceite-oliva', 8],
      ['limon-exprimido', 10],
    ],
    paso: 'Servís con ensalada de repollo y zanahoria.',
  },
  {
    n: 'batatas al horno',
    it: [
      ['batata', 200],
      ['aceite', 6],
    ],
    paso: 'Servís con batatas al horno.',
  },
]

export function generarMilanesas({ az, armador, cuantas }) {
  const combos = []
  for (const m of MILANESAS) for (const a of ACOMP) combos.push([m, a])
  let hechas = 0
  for (const [m, a] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Milanesa de ${m.n} al horno con ${a.n}`,
      minutos: m.min + 15,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [330, 850],
      prot: m.prot || 17,
      ingredientes: [...m.it, ['huevo', 50], ['pan-rallado', 30], ['aceite', 6], ...a.it],
      pasos: [
        m.aplanar,
        'Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.',
        'Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.',
        a.paso,
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

const BOLITAS = [
  {
    n: 'albóndigas de carne en salsa de tomate con arroz',
    it: [
      ['carne-picada-magra', 110],
      ['tomate-triturado', 120],
      ['arroz', 60],
      ['cebolla', 40],
      ['ajo', 4],
      ['huevo', 25],
      ['pan-rallado', 12],
      ['aceite', 6],
    ],
    p: [
      'Mezclás la carne con la cebolla rallada, el ajo, el huevo, el pan rallado, perejil, sal y pimienta; armás bolitas.',
      'Las dorás con el aceite 5 minutos, sumás el tomate triturado y cocinás tapadas 20 minutos.',
      'Hervís el arroz y servís las albóndigas encima.',
    ],
    min: 45,
  },
  {
    n: 'albóndigas de pollo con puré de calabaza',
    it: [
      ['picada-pollo', 120],
      ['calabaza', 200],
      ['cebolla', 30],
      ['huevo', 25],
      ['pan-rallado', 12],
      ['manteca', 5],
      ['aceite', 6],
    ],
    p: [
      'Mezclás el pollo picado con la cebolla rallada, el huevo, el pan rallado, sal, perejil y pimienta; armás bolitas.',
      'Las horneás en placa aceitada a 200 °C, 18 minutos.',
      'Hervís la calabaza y la hacés puré con la manteca y sal; servís las albóndigas encima.',
    ],
    min: 45,
  },
  {
    n: 'albóndigas de pavo con fideos',
    it: [
      ['picada-pavo', 120],
      ['fideos', 70],
      ['tomate-triturado', 100],
      ['cebolla', 30],
      ['huevo', 25],
      ['pan-rallado', 12],
      ['aceite', 6],
    ],
    p: [
      'Mezclás el pavo con la cebolla rallada, el huevo, el pan rallado, sal y pimienta; armás bolitas.',
      'Las dorás con el aceite 4 minutos y las terminás 12 minutos en el tomate triturado.',
      'Hervís los fideos y los servís con las albóndigas.',
    ],
    min: 40,
  },
  {
    n: 'albóndigas de atún y papa con ensalada',
    it: [
      ['atun-natural', 120],
      ['papa-hervida', 80],
      ['huevo', 25],
      ['pan-rallado', 15],
      ['lechuga', 60],
      ['tomate', 100],
      ['aceite', 8],
    ],
    p: [
      'Mezclás el atún escurrido con la papa hervida pisada, el huevo, el pan rallado, perejil, sal y limón; armás bolitas.',
      'Las horneás en placa aceitada 15 minutos a 200 °C.',
      'Servís con ensalada de lechuga y tomate.',
    ],
    min: 35,
  },
  {
    n: 'albóndigas de lentejas con arroz',
    it: [
      ['lentejas-hervidas', 140],
      ['avena', 25],
      ['arroz', 60],
      ['tomate-triturado', 100],
      ['cebolla', 30],
      ['huevo', 25],
      ['aceite', 6],
    ],
    p: [
      'Pisás las lentejas con la cebolla rallada, el huevo, la avena, comino y sal; armás bolitas.',
      'Las dorás con el aceite 5 minutos y las terminás 8 minutos en el tomate triturado.',
      'Hervís el arroz y servís las albóndigas encima.',
    ],
    min: 40,
  },
  {
    n: 'medallones de pollo y espinaca con ensalada',
    it: [
      ['picada-pollo', 130],
      ['espinaca', 70],
      ['huevo', 25],
      ['pan-rallado', 15],
      ['lechuga', 60],
      ['tomate', 100],
      ['aceite', 8],
    ],
    p: [
      'Salteás la espinaca picada hasta que se achique y la mezclás con el pollo picado, el huevo, el pan rallado, sal y nuez moscada.',
      'Formás medallones y los cocinás en sartén antiadherente 4 minutos por lado.',
      'Servís con ensalada de lechuga y tomate.',
    ],
    min: 30,
  },
  {
    n: 'bocaditos de brócoli y queso con ensalada',
    it: [
      ['brocoli', 150],
      ['queso-cremoso', 40],
      ['huevo', 50],
      ['avena', 25],
      ['lechuga', 60],
      ['tomate', 100],
      ['aceite', 8],
    ],
    p: [
      'Hervís el brócoli 4 minutos y lo picás fino. Lo mezclás con el queso en cubitos, el huevo, la avena, sal y nuez moscada.',
      'Armás bocaditos y los horneás en placa aceitada 20 minutos a 200 °C, dándolos vuelta a la mitad.',
      'Servís con ensalada de lechuga y tomate.',
    ],
    min: 40,
  },
  {
    n: 'croquetas de papa y atún con ensalada',
    it: [
      ['papa-hervida', 150],
      ['atun-natural', 100],
      ['huevo', 25],
      ['pan-rallado', 20],
      ['lechuga', 60],
      ['tomate', 100],
      ['aceite', 8],
    ],
    p: [
      'Pisás la papa hervida y la mezclás con el atún escurrido, el huevo, perejil, sal y pimienta.',
      'Armás croquetas, las pasás por pan rallado y las horneás en placa aceitada 20 minutos a 200 °C.',
      'Servís con ensalada de lechuga y tomate.',
    ],
    min: 40,
  },
  {
    n: 'kebabs de carne picada con tzatziki y ensalada',
    it: [
      ['carne-picada-magra', 120],
      ['cebolla', 30],
      ['tzatziki', 50],
      ['pepino', 80],
      ['tomate', 100],
      ['perejil', 4],
      ['aceite', 5],
    ],
    p: [
      'Mezclás la carne con la cebolla rallada, el perejil, comino, pimentón, sal y pimienta; formás cilindros alargados.',
      'Los cocinás en plancha o parrilla 4 minutos por lado.',
      'Servís con tzatziki y una ensalada de pepino y tomate.',
    ],
    min: 30,
  },
  {
    n: 'hamburguesa vegetal con ensalada y papas',
    it: [
      ['hamburguesa-vegetal', 90],
      ['papa', 180],
      ['lechuga', 60],
      ['tomate', 100],
      ['aceite', 10],
    ],
    p: [
      'Cortás las papas en gajos, las mezclás con una parte del aceite y sal y las horneás 35 minutos a 220 °C.',
      'Cocinás la hamburguesa vegetal en plancha con una gota de aceite, 4 minutos por lado.',
      'Servís con ensalada de lechuga y tomate aderezada con el resto del aceite.',
    ],
    min: 40,
  },
]

export function generarBolitas({ armador }) {
  let hechas = 0
  for (const b of BOLITAS) {
    const ok = armador.agregar({
      nombre: b.n.charAt(0).toUpperCase() + b.n.slice(1),
      minutos: b.min,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [320, 850],
      prot: 15,
      ingredientes: b.it,
      pasos: b.p,
    })
    if (ok) hechas++
  }
  return hechas
}

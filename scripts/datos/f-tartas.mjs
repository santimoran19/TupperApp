// Tortillas, omelettes, revueltos, frittatas y tartas: huevo (o masa) más un relleno.
import { mezclar } from './motor.mjs'

// it: gramos por porción del relleno. prep: cómo se cocina el relleno antes. sinPapa: no lleva papa
const RELLENOS = [
  {
    n: 'papa y cebolla',
    it: [
      ['papa', 160],
      ['cebolla', 50],
      ['aceite', 10],
    ],
    prep: 'Pelás las papas y las cortás en rodajas finas; picás la cebolla. Las cocinás en una sartén con el aceite y sal, tapadas y a fuego bajo, 15 minutos, hasta que estén tiernas.',
    min: 20,
  },
  {
    n: 'espinaca y queso',
    it: [
      ['espinaca', 90],
      ['queso-cremoso', 40],
      ['aceite', 4],
    ],
    prep: 'Salteás la espinaca lavada con el aceite hasta que se achique (2 minutos), la escurrís y la picás. Cortás el queso en cubitos.',
    min: 6,
  },
  {
    n: 'acelga y queso',
    it: [
      ['acelga', 100],
      ['queso-cremoso', 40],
      ['aceite', 4],
    ],
    prep: 'Hervís la acelga 3 minutos, la escurrís bien, la exprimís y la picás. Cortás el queso en cubitos.',
    min: 8,
  },
  {
    n: 'zapallitos y cebolla',
    it: [
      ['zapallito', 150],
      ['cebolla', 40],
      ['aceite', 6],
    ],
    prep: 'Cortás el zapallito en rodajas finas y la cebolla en plumas, y los cocinás en la sartén con el aceite, 8 minutos, hasta que estén tiernos.',
    min: 12,
  },
  {
    n: 'calabaza y cebolla',
    it: [
      ['calabaza', 150],
      ['cebolla', 40],
      ['aceite', 6],
    ],
    prep: 'Cortás la calabaza en cubitos chicos y la cebolla en plumas; los cocinás en la sartén con el aceite, tapados, 12 minutos, hasta que se ablanden.',
    min: 16,
  },
  {
    n: 'champiñones y cebolla',
    it: [
      ['champinones', 120],
      ['cebolla', 40],
      ['aceite', 6],
    ],
    prep: 'Salteás la cebolla en plumas con el aceite, sumás los champiñones laminados y cocinás 7 minutos hasta que se doren.',
    min: 10,
  },
  {
    n: 'jamón y queso',
    it: [
      ['jamon-cocido', 50],
      ['queso-cremoso', 40],
    ],
    prep: 'Cortás el jamón y el queso en cubitos.',
    min: 3,
  },
  {
    n: 'atún y tomate',
    it: [
      ['atun-natural', 120],
      ['tomate', 80],
    ],
    prep: 'Escurrís el atún y lo desmenuzás; cortás el tomate en cubitos sin semillas.',
    min: 4,
  },
  {
    n: 'morrón y cebolla',
    it: [
      ['morron', 100],
      ['cebolla', 50],
      ['aceite', 6],
    ],
    prep: 'Cortás el morrón y la cebolla en tiras finas y los cocinás con el aceite, 8 minutos, hasta que estén tiernos.',
    min: 12,
  },
  {
    n: 'brócoli y queso',
    it: [
      ['brocoli', 120],
      ['queso-cremoso', 40],
    ],
    prep: 'Hervís el brócoli en arbolitos 4 minutos, lo escurrís y lo picás. Cortás el queso en cubitos.',
    min: 8,
  },
  {
    n: 'choclo y cebolla de verdeo',
    it: [
      ['choclo', 80],
      ['cebolla-verdeo', 25],
      ['queso-cremoso', 30],
    ],
    prep: 'Escurrís el choclo, picás la cebolla de verdeo y cortás el queso en cubitos.',
    min: 4,
  },
  {
    n: 'berenjena y tomate',
    it: [
      ['berenjena', 130],
      ['tomate', 90],
      ['aceite', 8],
    ],
    prep: 'Cortás la berenjena en cubos y la dorás con el aceite 8 minutos; sumás el tomate en cubitos y cocinás 3 minutos más.',
    min: 14,
  },
  {
    n: 'puerro y queso',
    it: [
      ['puerro', 100],
      ['queso-cremoso', 40],
      ['aceite', 5],
    ],
    prep: 'Cortás el puerro en rodajas finas y lo cocinás con el aceite, tapado, 8 minutos hasta que se ablande. Cortás el queso en cubitos.',
    min: 12,
  },
  {
    n: 'zanahoria y arvejas',
    it: [
      ['zanahoria', 80],
      ['arvejas-frescas', 60],
      ['aceite', 5],
    ],
    prep: 'Rallás la zanahoria gruesa y la salteás con las arvejas y el aceite, 5 minutos.',
    min: 8,
  },
  {
    n: 'tomate y albahaca',
    it: [
      ['tomate', 150],
      ['albahaca', 5],
      ['muzzarella', 40],
    ],
    prep: 'Cortás el tomate en cubitos sin semillas, la muzzarella en cubitos y picás la albahaca.',
    min: 4,
  },
  {
    n: 'chauchas y queso',
    it: [
      ['chauchas', 120],
      ['queso-cremoso', 40],
    ],
    prep: 'Hervís las chauchas en trozos 6 minutos, las escurrís; cortás el queso en cubitos.',
    min: 10,
  },
  {
    n: 'ricota y espinaca',
    it: [
      ['espinaca', 80],
      ['ricota', 60],
      ['aceite', 4],
    ],
    prep: 'Salteás la espinaca con el aceite hasta que se achique, la picás y la mezclás con la ricota, sal y nuez moscada.',
    min: 6,
  },
  {
    n: 'jamón crudo y rúcula',
    it: [
      ['jamon-crudo', 40],
      ['rucula', 30],
      ['queso-cremoso', 30],
    ],
    prep: 'Cortás el jamón crudo en tiras, picás la rúcula y cortás el queso en cubitos (la rúcula se suma recién al final).',
    min: 3,
  },
  {
    n: 'hongos y queso de cabra',
    it: [
      ['champinones', 100],
      ['queso-cabra', 40],
      ['cebolla', 30],
      ['aceite', 5],
    ],
    prep: 'Dorás la cebolla y los champiñones laminados con el aceite, 7 minutos. Desmenuzás el queso de cabra.',
    min: 11,
  },
  {
    n: 'verduras asadas',
    it: [
      ['berenjena', 70],
      ['morron', 60],
      ['zapallito', 70],
      ['cebolla', 30],
      ['aceite', 8],
    ],
    prep: 'Cortás las verduras en cubos, las mezclás con el aceite y sal, y las asás en horno a 220 °C, 20 minutos.',
    min: 25,
  },
  {
    n: 'calabaza y feta',
    it: [
      ['calabaza', 140],
      ['feta', 40],
      ['aceite', 5],
    ],
    prep: 'Asás o hervís la calabaza en cubitos hasta que esté tierna y la dejás entibiar; desmenuzás el feta.',
    min: 20,
  },
  {
    n: 'salmón ahumado y cebolla de verdeo',
    it: [
      ['salmon-ahumado', 60],
      ['cebolla-verdeo', 25],
      ['queso-untable', 30],
    ],
    prep: 'Cortás el salmón ahumado en tiras y la cebolla de verdeo en rodajitas.',
    min: 4,
  },
  {
    n: 'panceta y queso',
    it: [
      ['panceta', 30],
      ['queso-cremoso', 40],
      ['cebolla', 30],
    ],
    prep: 'Cortás la panceta en tiritas y la dorás en la sartén sin aceite, 4 minutos; sumás la cebolla picada 3 minutos. Cortás el queso en cubitos.',
    min: 9,
  },
  {
    n: 'palmitos y queso',
    it: [
      ['palmitos', 100],
      ['queso-cremoso', 40],
      ['cebolla-verdeo', 15],
    ],
    prep: 'Escurrís los palmitos y los cortás en rodajas; picás la cebolla de verdeo y cortás el queso en cubitos.',
    min: 4,
  },
  {
    n: 'coliflor y queso',
    it: [
      ['coliflor', 130],
      ['queso-cremoso', 40],
    ],
    prep: 'Hervís la coliflor en arbolitos 6 minutos, la escurrís y la picás. Cortás el queso en cubitos.',
    min: 10,
  },
  {
    n: 'cebolla y queso azul',
    it: [
      ['cebolla', 100],
      ['queso-azul', 25],
      ['aceite', 6],
    ],
    prep: 'Cocinás la cebolla en plumas con el aceite a fuego bajo, 15 minutos, hasta que esté dorada y dulce. Desmenuzás el queso azul.',
    min: 18,
  },
  {
    n: 'remolacha y queso',
    it: [
      ['remolacha-cocida', 100],
      ['queso-cabra', 40],
      ['cebolla-verdeo', 15],
    ],
    prep: 'Rallás la remolacha cocida y escurrís el exceso de jugo; desmenuzás el queso de cabra y picás la cebolla de verdeo.',
    min: 6,
  },
  {
    n: 'pollo y puerro',
    it: [
      ['pollo-desmenuzado', 90],
      ['puerro', 80],
      ['aceite', 5],
    ],
    prep: 'Cocinás el puerro en rodajas con el aceite, tapado, 8 minutos; lo mezclás con el pollo desmenuzado.',
    min: 12,
  },
]

const FORMAS = {
  tortilla: {
    n: (r) => `Tortilla de ${r}`,
    huevos: 150,
    porciones: 1,
    min: 8,
    ap: (r) => !r.huevo,
    pasos: (r) => [
      r.prep,
      'Batís los huevos con sal y pimienta, sumás el relleno y mezclás.',
      'Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.',
      'Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.',
    ],
  },
  omelette: {
    n: (r) => `Omelette de ${r}`,
    huevos: 150,
    porciones: 1,
    min: 6,
    ap: (r) => r.it.length <= 3,
    pasos: (r) => [
      r.prep,
      'Batís los huevos con sal y pimienta.',
      'En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.',
      'Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.',
    ],
  },
  revuelto: {
    n: (r) => `Revuelto de ${r}`,
    huevos: 150,
    porciones: 1,
    min: 5,
    ap: () => true,
    pasos: (r) => [
      r.prep,
      'En una sartén antiadherente calentás el relleno 1 minuto.',
      'Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.',
      'Servís enseguida, con una tostada si querés.',
    ],
  },
  frittata: {
    n: (r) => `Frittata de ${r} al horno`,
    huevos: 150,
    porciones: 2,
    min: 10,
    ap: () => true,
    pasos: (r) => [
      'Precalentás el horno a 190 °C.',
      r.prep,
      'Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.',
      'Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.',
    ],
    extra: [['queso-rallado', 10]],
  },
  tarta: {
    n: (r) => `Tarta de ${r}`,
    huevos: 40,
    porciones: 4,
    min: 35,
    ap: (r) => !r.huevo,
    pasos: (r) => [
      'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.',
      r.prep,
      'Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.',
      'Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.',
    ],
    extra: [
      ['tapa-tarta', 50],
      ['leche', 40],
      ['queso-rallado', 8],
    ],
  },
}

export function generarTartas({ az, armador, cuantas }) {
  const combos = []
  for (const r of RELLENOS) for (const [k, f] of Object.entries(FORMAS)) if (f.ap(r)) combos.push([r, k, f])
  let hechas = 0
  for (const [r, k, f] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    // La papa solo en tortilla y frittata; la tarta lleva menos relleno por porción (se reparte entre 4)
    if (k === 'tarta' && r.it.some(([s]) => s === 'papa')) continue
    const por = k === 'tarta' ? 1.0 : 1
    const rellenoItems = r.it.map(([s, g]) => [s, g * por])
    const ok = armador.agregar({
      nombre: f.n(r.n),
      minutos: f.min + r.min,
      porciones: f.porciones,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [230, 650],
      prot: 12,
      ingredientes: [['huevo', f.huevos], ...rellenoItems, ...(f.extra || []), ...(k === 'tarta' ? [] : [['aceite', 3]])],
      pasos: f.pasos(r),
    })
    if (ok) hechas++
  }
  return hechas
}

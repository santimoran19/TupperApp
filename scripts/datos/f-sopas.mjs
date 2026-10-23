// Sopas y cremas: se hacen para 4 porciones.
import { mezclar } from './motor.mjs'

// Cremas: verdura principal + cebolla + papa para espesar, procesadas
const CREMAS = [
  {
    n: 'calabaza',
    it: [
      ['calabaza', 220],
      ['papa', 60],
    ],
    paso: 'Pelás la calabaza y la papa y las cortás en cubos.',
  },
  {
    n: 'zanahoria',
    it: [
      ['zanahoria', 220],
      ['papa', 60],
    ],
    paso: 'Pelás las zanahorias y la papa y las cortás en rodajas.',
  },
  {
    n: 'zapallito',
    it: [
      ['zapallito', 250],
      ['papa', 70],
    ],
    paso: 'Cortás los zapallitos en rodajas, sin pelar, y la papa en cubos.',
  },
  {
    n: 'brócoli',
    it: [
      ['brocoli', 220],
      ['papa', 70],
    ],
    paso: 'Cortás el brócoli en arbolitos (los tallos también, pelados y en rodajas) y la papa en cubos.',
  },
  {
    n: 'espinaca',
    it: [
      ['espinaca', 200],
      ['papa', 80],
    ],
    paso: 'Lavás la espinaca y cortás la papa en cubos.',
  },
  {
    n: 'coliflor',
    it: [
      ['coliflor', 240],
      ['papa', 60],
    ],
    paso: 'Cortás la coliflor en arbolitos y la papa en cubos.',
  },
  {
    n: 'puerro y papa',
    it: [
      ['puerro', 150],
      ['papa', 140],
    ],
    paso: 'Cortás los puerros en rodajas finas (la parte blanca y un poco de la verde) y la papa en cubos.',
  },
  {
    n: 'tomate',
    it: [
      ['tomate', 280],
      ['zanahoria', 50],
    ],
    paso: 'Cortás los tomates en cuartos y la zanahoria en rodajas.',
  },
  {
    n: 'choclo',
    it: [
      ['choclo', 200],
      ['papa', 70],
    ],
    paso: 'Escurrís el choclo y cortás la papa en cubos.',
  },
  {
    n: 'champiñones',
    it: [
      ['champinones', 220],
      ['papa', 70],
    ],
    paso: 'Laminás los champiñones y cortás la papa en cubos.',
  },
  {
    n: 'arvejas',
    it: [
      ['arvejas-frescas', 200],
      ['papa', 60],
    ],
    paso: 'Cortás la papa en cubos; las arvejas van enteras.',
  },
  {
    n: 'remolacha',
    it: [
      ['remolacha-cocida', 220],
      ['papa', 70],
    ],
    paso: 'Cortás la remolacha cocida y la papa en cubos.',
  },
  {
    n: 'batata',
    it: [
      ['batata', 220],
      ['zanahoria', 50],
    ],
    paso: 'Pelás la batata y la zanahoria y las cortás en cubos.',
  },
  {
    n: 'mandioca',
    it: [
      ['mandioca', 160],
      ['zanahoria', 60],
    ],
    paso: 'Pelás la mandioca (sacando el centro fibroso) y la zanahoria, y las cortás en cubos.',
  },
  {
    n: 'zapallo y jengibre',
    it: [
      ['zapallo-anco', 230],
      ['jengibre', 8],
      ['papa', 50],
    ],
    paso: 'Pelás el zapallo y la papa y los cortás en cubos; rallás el jengibre.',
  },
  {
    n: 'hinojo y papa',
    it: [
      ['hinojo', 200],
      ['papa', 100],
    ],
    paso: 'Cortás el hinojo en láminas y la papa en cubos.',
  },
  {
    n: 'espárragos',
    it: [
      ['esparragos', 200],
      ['papa', 80],
    ],
    paso: 'Cortás los espárragos en trozos (sin la parte dura) y la papa en cubos.',
  },
]
const TOPPINGS = [
  { n: 'queso rallado', it: [['queso-rallado', 10]], paso: 'Servís con queso rallado por encima.', k: 0 },
  {
    n: 'semillas de zapallo',
    it: [['semillas-zapallo', 8]],
    paso: 'Servís con semillas de zapallo tostadas y un hilo de aceite de oliva.',
    k: 0,
  },
  { n: 'yogur', it: [['yogur-griego', 25]], paso: 'Servís con una cucharada de yogur griego y pimienta.', k: 0 },
  {
    n: 'pollo desmenuzado',
    it: [['pollo-desmenuzado', 60]],
    paso: 'Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.',
    k: 0,
    prot: true,
  },
  { n: 'croutons', it: [['croutons', 12]], paso: 'Servís con croutons por encima.', k: 0 },
  { n: 'huevo duro', it: [['huevo', 50]], paso: 'Servís con medio huevo duro picado en cada plato.', k: 0, prot: true },
  {
    n: 'jamón crudo crocante',
    it: [['jamon-crudo', 15]],
    paso: 'Dorás el jamón crudo en tiritas en una sartén seca hasta que quede crocante y lo desmenuzás arriba.',
    k: 0,
  },
  { n: 'queso de cabra', it: [['queso-cabra', 20]], paso: 'Servís con queso de cabra desmenuzado.', k: 0 },
]

export function generarCremas({ az, armador, cuantas }) {
  const combos = []
  for (const c of CREMAS) for (const t of TOPPINGS) combos.push([c, t])
  let hechas = 0
  for (const [c, t] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Crema de ${c.n} con ${t.n}`,
      minutos: 35,
      porciones: 4,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [170, 520],
      prot: 3,
      ingredientes: [...c.it, ['cebolla', 40], ['aceite', 6], ['caldo-liquido', 220], ...t.it],
      pasos: [
        c.paso,
        'Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.',
        'Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.',
        t.paso,
        'Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

const SOPAS = [
  {
    n: 'Sopa de verduras con fideos',
    min: 35,
    it: [
      ['zanahoria', 50],
      ['zapallito', 80],
      ['apio', 30],
      ['cebolla', 40],
      ['papa', 70],
      ['fideos', 20],
      ['aceite', 5],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Cortás todas las verduras en cubitos chicos.',
      'Sofreís la cebolla con el aceite, sumás el resto de las verduras y el caldo con sal y pimienta, y hervís 15 minutos.',
      'Agregás los fideos y cocinás 6 minutos más. Perejil por encima.',
    ],
  },
  {
    n: 'Sopa de pollo con verduras y arroz',
    min: 45,
    prot: 8,
    it: [
      ['pata-muslo', 150],
      ['zanahoria', 50],
      ['apio', 30],
      ['cebolla', 40],
      ['arroz', 15],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Hervís el pollo en el caldo con la cebolla y el apio 25 minutos. Lo sacás, lo desmenuzás y descartás la piel y los huesos.',
      'Sumás la zanahoria en rodajas y el arroz al caldo y cocinás 12 minutos.',
      'Devolvés el pollo, corregís la sal y servís con perejil.',
    ],
  },
  {
    n: 'Minestrone',
    min: 45,
    it: [
      ['zanahoria', 40],
      ['zapallito', 60],
      ['apio', 25],
      ['cebolla', 40],
      ['papa', 60],
      ['porotos-hervidos', 50],
      ['tomate-triturado', 50],
      ['fideos', 15],
      ['aceite', 6],
      ['caldo-liquido', 250],
      ['parmesano', 8],
    ],
    pasos: [
      'Cortás las verduras en cubitos.',
      'Sofreís la cebolla y el apio con el aceite; sumás el resto de las verduras, el tomate y el caldo, y hervís 20 minutos.',
      'Agregás los porotos y los fideos y cocinás 8 minutos más. Servís con parmesano rallado y albahaca.',
    ],
  },
  {
    n: 'Sopa de lentejas',
    min: 40,
    prot: 7,
    it: [
      ['lentejas-hervidas', 120],
      ['zanahoria', 50],
      ['cebolla', 40],
      ['ajo', 4],
      ['tomate-triturado', 40],
      ['aceite', 6],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Picás la cebolla, el ajo y la zanahoria.',
      'Sofreís todo con el aceite y una pizca de comino y pimentón, 5 minutos. Sumás el tomate, el caldo y las lentejas.',
      'Hervís 20 minutos. Procesás un cuarto de la sopa y la volvés a mezclar para que espese. Servís con unas gotas de limón.',
    ],
  },
  {
    n: 'Sopa de cebolla gratinada',
    min: 55,
    it: [
      ['cebolla', 220],
      ['manteca', 8],
      ['caldo-liquido', 320],
      ['pan-frances', 30],
      ['gruyere', 30],
    ],
    pasos: [
      'Cortás las cebollas en plumas y las cocinás con la manteca a fuego bajo 30 minutos, hasta que estén bien doradas y dulces.',
      'Sumás el caldo, sal y pimienta y hervís 10 minutos.',
      'Servís en cuencos aptos para horno con una rebanada de pan y el queso rallado arriba, y gratinás 5 minutos.',
    ],
  },
  {
    n: 'Sopa de zapallo y lentejas rojas',
    min: 35,
    it: [
      ['zapallo-anco', 200],
      ['lentejas-rojas', 40],
      ['cebolla', 40],
      ['jengibre', 6],
      ['aceite', 6],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Cortás el zapallo en cubos; picás la cebolla y rallás el jengibre.',
      'Sofreís la cebolla y el jengibre con el aceite, sumás el zapallo, las lentejas rojas lavadas y el caldo.',
      'Hervís 20 minutos, hasta que todo esté tierno, y procesás. Sal, pimienta y comino.',
    ],
  },
  {
    n: 'Caldo de pollo con fideos cabello de ángel',
    min: 35,
    prot: 6,
    it: [
      ['pata-muslo', 120],
      ['zanahoria', 40],
      ['apio', 25],
      ['cebolla', 30],
      ['fideos', 20],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Hervís el pollo con la cebolla, el apio y la zanahoria en el caldo 25 minutos. Sacás el pollo, lo desmenuzás y colás el caldo.',
      'Volvés a hervir el caldo, sumás los fideos finos y cocinás 3 minutos.',
      'Devolvés el pollo desmenuzado y servís con perejil.',
    ],
  },
  {
    n: 'Sopa de calabaza y coco',
    min: 35,
    it: [
      ['calabaza', 220],
      ['cebolla', 40],
      ['leche-coco', 50],
      ['jengibre', 5],
      ['aceite', 5],
      ['caldo-liquido', 250],
    ],
    pasos: [
      'Cortás la calabaza en cubos, la cebolla en plumas y rallás el jengibre.',
      'Sofreís la cebolla y el jengibre con el aceite; sumás la calabaza y el caldo y hervís 20 minutos.',
      'Procesás, sumás la leche de coco y calentás 2 minutos sin hervir. Cilantro o perejil por encima.',
    ],
  },
  {
    n: 'Sopa de arroz y verduras',
    min: 35,
    it: [
      ['arroz', 25],
      ['zanahoria', 50],
      ['zapallito', 70],
      ['cebolla', 40],
      ['arvejas-frescas', 30],
      ['aceite', 5],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Cortás las verduras en cubitos.',
      'Sofreís la cebolla con el aceite, sumás las verduras y el caldo y hervís 10 minutos.',
      'Agregás el arroz y las arvejas y cocinás 12 minutos más. Perejil por encima.',
    ],
  },
  {
    n: 'Sopa de pescado y verduras',
    min: 35,
    prot: 8,
    it: [
      ['merluza-cruda', 130],
      ['papa', 70],
      ['zanahoria', 40],
      ['cebolla', 40],
      ['tomate-triturado', 50],
      ['aceite-oliva', 6],
      ['caldo-liquido', 250],
    ],
    pasos: [
      'Cortás las verduras en cubitos y la merluza en trozos.',
      'Sofreís la cebolla con el aceite, sumás la papa, la zanahoria, el tomate y el caldo y hervís 15 minutos.',
      'Sumás la merluza y cocinás 5 minutos más, sin revolver mucho. Perejil y limón.',
    ],
  },
  {
    n: 'Sopa de arvejas partidas',
    min: 55,
    prot: 7,
    it: [
      ['arvejas-hervidas', 130],
      ['zanahoria', 40],
      ['cebolla', 40],
      ['aceite', 5],
      ['jamon-cocido', 25],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Picás la cebolla y la zanahoria.',
      'Sofreís con el aceite, sumás las arvejas partidas ya hervidas, el caldo y el jamón en cubitos, y cocinás 20 minutos.',
      'Procesás la mitad para que espese. Sal y pimienta.',
    ],
  },
  {
    n: 'Sopa miso con tofu',
    min: 15,
    it: [
      ['pasta-miso', 25],
      ['tofu', 80],
      ['cebolla-verdeo', 20],
      ['fideos-arroz', 20],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Cortás el tofu en cubitos y la cebolla de verdeo en rodajitas finas.',
      'Calentás el caldo (sin que hierva) y disolvés la pasta de miso en un poco del caldo tibio; la volvés a la olla.',
      'Sumás el tofu y los fideos de arroz, 3 minutos, y servís con la cebolla de verdeo.',
    ],
  },
  {
    n: 'Sopa de tomate asado',
    min: 45,
    it: [
      ['tomate', 300],
      ['cebolla', 40],
      ['ajo', 5],
      ['aceite-oliva', 8],
      ['albahaca', 4],
      ['caldo-liquido', 200],
    ],
    pasos: [
      'Asás los tomates cortados al medio, la cebolla y el ajo con el aceite de oliva, sal y orégano, a 200 °C, 30 minutos.',
      'Los pasás a una olla con el caldo, hervís 5 minutos y procesás con la albahaca.',
      'Servís con unas gotas de aceite de oliva y pimienta.',
    ],
  },
  {
    n: 'Sopa de porotos negros',
    min: 30,
    prot: 8,
    it: [
      ['porotos-negros-hervidos', 130],
      ['cebolla', 40],
      ['morron', 40],
      ['ajo', 4],
      ['aceite', 6],
      ['caldo-liquido', 250],
    ],
    pasos: [
      'Picás la cebolla, el morrón y el ajo.',
      'Sofreís con el aceite y una cucharadita de comino y pimentón ahumado 5 minutos. Sumás los porotos y el caldo y hervís 15 minutos.',
      'Procesás un tercio de la sopa y la mezclás de nuevo. Servís con cilantro y unas gotas de limón.',
    ],
  },
  {
    n: 'Sopa de choclo',
    min: 30,
    it: [
      ['choclo', 180],
      ['papa', 60],
      ['cebolla', 40],
      ['leche', 100],
      ['aceite', 5],
      ['caldo-liquido', 200],
    ],
    pasos: [
      'Cortás la papa en cubos y picás la cebolla.',
      'Sofreís la cebolla con el aceite, sumás el choclo, la papa y el caldo y hervís 15 minutos.',
      'Procesás todo con la leche hasta que quede cremosa. Sal, pimienta y pimentón.',
    ],
  },
  {
    n: 'Sopa de repollo y zanahoria',
    min: 30,
    it: [
      ['repollo', 150],
      ['zanahoria', 60],
      ['cebolla', 40],
      ['apio', 25],
      ['aceite', 5],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Cortás el repollo en tiras finas, la zanahoria en rodajas y picás la cebolla y el apio.',
      'Sofreís la cebolla y el apio con el aceite, sumás todo y el caldo con laurel y hervís 20 minutos.',
      'Sal, pimienta y un chorrito de vinagre al servir.',
    ],
  },
  {
    n: 'Sopa de fideos con huevo',
    min: 20,
    prot: 7,
    it: [
      ['fideos', 30],
      ['huevo', 50],
      ['cebolla-verdeo', 15],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Calentás el caldo hasta hervir y sumás los fideos finos 4 minutos.',
      'Batís el huevo con una pizca de sal y lo volcás en hilo, revolviendo suave: forma hebras.',
      'Servís con cebolla de verdeo picada.',
    ],
  },
  {
    n: 'Sopa de verduras asadas',
    min: 50,
    it: [
      ['zanahoria', 60],
      ['calabaza', 100],
      ['morron', 60],
      ['cebolla', 50],
      ['tomate', 100],
      ['aceite', 8],
      ['caldo-liquido', 220],
    ],
    pasos: [
      'Cortás las verduras en trozos grandes, las mezclás con el aceite y sal y las asás a 210 °C, 30 minutos.',
      'Las pasás a una olla con el caldo, hervís 5 minutos y procesás.',
      'Servís con pimienta y un hilo de aceite.',
    ],
  },
  {
    n: 'Sopa de garbanzos y espinaca',
    min: 30,
    prot: 7,
    it: [
      ['garbanzos-hervidos', 130],
      ['espinaca', 80],
      ['cebolla', 40],
      ['ajo', 4],
      ['tomate-triturado', 40],
      ['aceite', 6],
      ['caldo-liquido', 250],
    ],
    pasos: [
      'Picás la cebolla y el ajo.',
      'Sofreís con el aceite y el comino, sumás el tomate, los garbanzos escurridos y el caldo y hervís 15 minutos.',
      'Agregás la espinaca los últimos 3 minutos. Servís con limón.',
    ],
  },
  {
    n: 'Sopa de pollo y choclo',
    min: 40,
    prot: 8,
    it: [
      ['pechuga-cruda', 100],
      ['choclo', 60],
      ['zanahoria', 40],
      ['cebolla', 40],
      ['caldo-liquido', 300],
    ],
    pasos: [
      'Hervís la pechuga en el caldo con la cebolla 15 minutos; la sacás y la desmenuzás.',
      'Sumás la zanahoria en cubitos y el choclo al caldo y cocinás 10 minutos.',
      'Devolvés el pollo desmenuzado, sal, pimienta y perejil.',
    ],
  },
]

export function generarSopas({ az, armador, cuantas }) {
  let hechas = 0
  for (const s of mezclar(az, SOPAS)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: s.n,
      minutos: s.min,
      porciones: 4,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [140, 450],
      prot: s.prot || 2,
      ingredientes: s.it,
      pasos: [...s.pasos, 'Rinde 4 platos. Se conserva 4 días en la heladera.'],
    })
    if (ok) hechas++
  }
  return hechas
}

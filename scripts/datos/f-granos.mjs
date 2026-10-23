// Granos y cereales (arroz, quinoa, cuscús, burgol, mijo, polenta...) con algo encima, y risottos.
import { mezclar } from './motor.mjs'

const GRANOS = [
  { s: 'arroz', n: 'Arroz', g: 65, min: 15, paso: 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.' },
  {
    s: 'arroz-integral',
    n: 'Arroz integral',
    g: 65,
    min: 35,
    paso: 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.',
  },
  {
    s: 'arroz-yamani',
    n: 'Arroz yamaní',
    g: 65,
    min: 30,
    paso: 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.',
  },
  {
    s: 'arroz-basmati',
    n: 'Arroz basmati',
    g: 65,
    min: 14,
    paso: 'Lavás el arroz hasta que el agua salga clara y lo hervís 10 minutos con sal; escurrís.',
  },
  {
    s: 'quinoa',
    n: 'Quinoa',
    g: 60,
    min: 18,
    paso: 'Enjuagás bien la quinoa. La hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos fuera del fuego; la desgranás con un tenedor.',
  },
  {
    s: 'cuscus',
    n: 'Cuscús',
    g: 65,
    min: 8,
    paso: 'Cubrís el cuscús con la misma cantidad de agua hirviendo con sal y una gota de aceite, tapás 5 minutos y lo desgranás con un tenedor.',
  },
  {
    s: 'burgol',
    n: 'Burgol',
    g: 60,
    min: 18,
    paso: 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.',
  },
  {
    s: 'mijo',
    n: 'Mijo',
    g: 60,
    min: 22,
    paso: 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.',
  },
  {
    s: 'trigo-sarraceno',
    n: 'Trigo sarraceno',
    g: 60,
    min: 17,
    paso: 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.',
  },
  { s: 'cebada', n: 'Cebada', g: 60, min: 35, paso: 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.' },
  {
    s: 'polenta-instantanea',
    n: 'Polenta cremosa',
    g: 60,
    min: 8,
    paso: 'Hervís 3 tazas de agua con sal, volcás la polenta en lluvia revolviendo y cocinás 3–5 minutos hasta que espese; sumás un puñado de queso rallado.',
    extra: [['queso-rallado', 12]],
  },
]

const TOPPINGS = [
  {
    n: 'pollo y verduras salteadas',
    min: 20,
    prot: true,
    it: [
      ['pechuga-cruda', 130],
      ['zanahoria', 50],
      ['zapallito', 70],
      ['morron', 50],
      ['aceite', 8],
    ],
    paso: 'Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras y salteás 5 minutos más, con sal, pimienta y pimentón.',
  },
  {
    n: 'verduras asadas y queso feta',
    min: 30,
    it: [
      ['berenjena', 70],
      ['morron', 60],
      ['zapallito', 70],
      ['cebolla', 40],
      ['aceite', 8],
      ['feta', 40],
    ],
    paso: 'Cortás las verduras en cubos, las mezclás con el aceite, sal y orégano y las asás a 220 °C, 25 minutos. Servís con el feta desmenuzado.',
  },
  {
    n: 'atún, tomate y aceitunas',
    min: 8,
    prot: true,
    it: [
      ['atun-natural', 120],
      ['tomate', 110],
      ['aceitunas', 15],
      ['cebolla-morada', 25],
      ['aceite-oliva', 8],
      ['perejil', 3],
    ],
    paso: 'Escurrís el atún, cortás el tomate en cubos y la cebolla morada en plumas finitas. Mezclás todo con las aceitunas, el aceite de oliva, perejil y jugo de limón.',
  },
  {
    n: 'espinaca, garbanzos y limón',
    min: 12,
    it: [
      ['garbanzos-hervidos', 120],
      ['espinaca', 80],
      ['ajo', 4],
      ['aceite', 8],
      ['limon-exprimido', 12],
    ],
    paso: 'Salteás el ajo con el aceite y una pizca de comino, sumás los garbanzos escurridos 4 minutos, y al final la espinaca hasta que se achique. Terminás con jugo de limón.',
  },
  {
    n: 'carne, morrón y cebolla',
    min: 20,
    prot: true,
    it: [
      ['bife-nalga', 130],
      ['morron', 70],
      ['cebolla', 60],
      ['aceite', 8],
    ],
    paso: 'Cortás la carne, el morrón y la cebolla en tiras. Sellás la carne con el aceite 2–3 minutos, la retirás y salteás las verduras 6 minutos; devolvés la carne y sazonás con sal, pimienta y pimentón.',
  },
  {
    n: 'calabaza asada y queso de cabra',
    min: 30,
    it: [
      ['calabaza', 170],
      ['queso-cabra', 40],
      ['aceite', 8],
      ['nueces', 10],
    ],
    paso: 'Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.',
  },
  {
    n: 'langostinos y zapallitos',
    min: 15,
    prot: true,
    it: [
      ['langostinos', 120],
      ['zapallito', 120],
      ['ajo', 5],
      ['aceite-oliva', 10],
      ['limon-exprimido', 8],
    ],
    paso: 'Salteás los zapallitos en medias lunas con el aceite 5 minutos. Sumás el ajo y los langostinos pelados 2 minutos por lado, y terminás con jugo de limón.',
  },
  {
    n: 'salmón y brócoli',
    min: 18,
    prot: true,
    it: [
      ['salmon', 130],
      ['brocoli', 120],
      ['aceite', 6],
      ['limon-exprimido', 10],
    ],
    paso: 'Cocinás el salmón en plancha con una gota de aceite, 3 minutos por lado. Hervís el brócoli 4 minutos y lo salteás con el resto del aceite. Servís con limón.',
  },
  {
    n: 'huevo, espinaca y tomates cherry',
    min: 12,
    prot: true,
    it: [
      ['huevo', 100],
      ['espinaca', 70],
      ['tomate-cherry', 90],
      ['aceite', 6],
    ],
    paso: 'Salteás los cherry y la espinaca con la mitad del aceite 3 minutos. En otra sartén hacés los huevos fritos con el resto del aceite, con la yema líquida.',
  },
  {
    n: 'champiñones y arvejas',
    min: 15,
    it: [
      ['champinones', 120],
      ['arvejas-frescas', 60],
      ['cebolla', 40],
      ['ajo', 4],
      ['aceite', 8],
    ],
    paso: 'Dorás la cebolla y el ajo con el aceite, sumás los champiñones laminados 6 minutos y las arvejas 3 minutos; sazonás con sal, pimienta y perejil.',
  },
  {
    n: 'lentejas y cebolla caramelizada',
    min: 15,
    it: [
      ['lentejas-hervidas', 130],
      ['cebolla-caramelizada', 50],
      ['zanahoria', 40],
      ['aceite', 6],
    ],
    paso: 'Calentás las lentejas con la zanahoria rallada y el aceite 5 minutos. Servís con la cebolla caramelizada arriba, y una pizca de comino.',
  },
  {
    n: 'cerdo y manzana',
    min: 20,
    prot: true,
    it: [
      ['lomo-cerdo', 130],
      ['manzana-verde', 80],
      ['cebolla', 40],
      ['aceite', 8],
      ['mostaza', 8],
    ],
    paso: 'Cortás el solomillo en medallones y lo dorás con el aceite 4 minutos por lado. Retirás, y en la misma sartén salteás la cebolla y la manzana en gajos 5 minutos con la mostaza; servís sobre los medallones.',
  },
  {
    n: 'pollo, choclo y morrón',
    min: 20,
    prot: true,
    it: [
      ['pechuga-cruda', 130],
      ['choclo', 70],
      ['morron', 60],
      ['cebolla-verdeo', 20],
      ['aceite', 8],
    ],
    paso: 'Cortás la pechuga en cubos y la dorás con el aceite 5 minutos. Sumás el morrón en cubitos, el choclo y la cebolla de verdeo 5 minutos más. Sal, pimienta y pimentón.',
  },
  {
    n: 'berenjenas, tomate y muzzarella',
    min: 25,
    it: [
      ['berenjena', 130],
      ['tomate-triturado', 80],
      ['muzzarella', 50],
      ['aceite', 8],
      ['albahaca', 3],
    ],
    paso: 'Dorás la berenjena en cubos con el aceite 8 minutos, sumás el tomate triturado y cocinás 8 minutos. Gratinás con la muzzarella 2 minutos tapado. Terminás con albahaca.',
  },
  {
    n: 'tofu y vegetales al curry',
    min: 22,
    it: [
      ['tofu', 130],
      ['zanahoria', 50],
      ['coliflor', 80],
      ['cebolla', 40],
      ['leche-coco', 50],
      ['aceite', 8],
    ],
    paso: 'Dorás el tofu en cubos con el aceite 4 minutos; retirás. Salteás la cebolla, la zanahoria y la coliflor 6 minutos con una cucharadita de curry en polvo, sumás la leche de coco y el tofu y cocinás 5 minutos.',
  },
  {
    n: 'merluza y tomate',
    min: 18,
    prot: true,
    it: [
      ['merluza-cruda', 150],
      ['tomate', 120],
      ['cebolla', 40],
      ['aceite-oliva', 8],
      ['perejil', 3],
    ],
    paso: 'Dorás la cebolla con el aceite, sumás el tomate en cubos 5 minutos, apoyás los filetes de merluza, tapás y cocinás 6 minutos. Perejil por encima.',
  },
  {
    n: 'pavo y calabaza',
    min: 22,
    prot: true,
    it: [
      ['pechuga-pavo', 130],
      ['calabaza', 120],
      ['cebolla', 40],
      ['aceite', 8],
    ],
    paso: 'Cortás el pavo y la calabaza en cubos; dorás el pavo con el aceite 5 minutos, retirás, y cocinás la calabaza con la cebolla 10 minutos, tapada. Mezclás todo con sal, pimienta y salvia.',
  },
  {
    n: 'hummus y vegetales crudos',
    min: 8,
    it: [
      ['hummus', 70],
      ['zanahoria', 60],
      ['pepino', 80],
      ['tomate-cherry', 70],
      ['aceite-oliva', 6],
    ],
    paso: 'Cortás la zanahoria y el pepino en bastones y los cherry al medio. Servís el grano con el hummus y las verduras, con un hilo de aceite de oliva.',
  },
  {
    n: 'huevo poché y espinaca',
    min: 14,
    prot: true,
    it: [
      ['huevo', 100],
      ['espinaca', 80],
      ['ajo', 3],
      ['aceite', 6],
      ['parmesano', 10],
    ],
    paso: 'Salteás la espinaca con el aceite y el ajo 2 minutos. Poché: hervís agua con un chorrito de vinagre, creás un remolino y cocinás los huevos 3 minutos. Servís sobre la espinaca con parmesano.',
  },
  {
    n: 'ricota, tomate seco y rúcula',
    min: 8,
    it: [
      ['ricota', 70],
      ['tomate-seco', 15],
      ['rucula', 40],
      ['aceite-oliva', 8],
      ['nueces', 10],
    ],
    paso: 'Mezclás el grano tibio con la ricota en cucharadas, los tomates secos picados, la rúcula, las nueces y el aceite de oliva.',
  },
]

export function generarGranos({ az, armador, cuantas }) {
  const combos = []
  for (const g of GRANOS) for (const t of TOPPINGS) combos.push([g, t])
  let hechas = 0
  for (const [g, t] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `${g.n} con ${t.n}`,
      minutos: Math.max(g.min, t.min) + 5,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [330, 850],
      prot: 13,
      ingredientes: [[g.s, g.g], ...(g.extra || []), ...t.it],
      pasos: [g.paso, t.paso, 'Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'],
    })
    if (ok) hechas++
  }
  return hechas
}

// Risottos: arroz tipo arborio cocinado de a poco con caldo, con un ingrediente principal
const RISOTTOS = [
  {
    n: 'hongos',
    it: [
      ['champinones', 130],
      ['perejil', 3],
    ],
    paso: 'Salteás los champiñones laminados en otra sartén con una gota de aceite hasta que se doren (6 minutos) y los sumás al arroz al final.',
    min: 8,
  },
  {
    n: 'calabaza',
    it: [['calabaza', 150]],
    paso: 'Cortás la calabaza en cubitos chicos y la sumás al arroz con el primer cucharón de caldo; se deshace y le da cremosidad.',
    min: 0,
  },
  {
    n: 'espinaca',
    it: [['espinaca', 100]],
    paso: 'Picás la espinaca y la sumás al arroz en los últimos 3 minutos para que se achique.',
    min: 0,
  },
  {
    n: 'arvejas y jamón',
    it: [
      ['arvejas-frescas', 70],
      ['jamon-cocido', 50],
    ],
    paso: 'Cortás el jamón en cubitos y lo sumás junto con las arvejas en los últimos 5 minutos.',
    min: 0,
  },
  {
    n: 'zapallitos',
    it: [['zapallito', 140]],
    paso: 'Cortás los zapallitos en cubitos y los salteás aparte 4 minutos; los sumás al arroz al final.',
    min: 6,
  },
  {
    n: 'brócoli',
    it: [['brocoli', 130]],
    paso: 'Hervís el brócoli en arbolitos chicos 3 minutos, los escurrís y los sumás al arroz al final, aplastando algunos para que suelten sabor.',
    min: 5,
  },
  {
    n: 'pollo y limón',
    prot: true,
    it: [
      ['pechuga-cruda', 100],
      ['limon-exprimido', 15],
    ],
    paso: 'Cortás la pechuga en cubitos, la salteás con una gota de aceite 4 minutos y la sumás al arroz con el jugo de limón en los últimos 5 minutos.',
    min: 8,
  },
  {
    n: 'langostinos',
    prot: true,
    it: [
      ['langostinos', 110],
      ['ajo', 4],
    ],
    paso: 'Salteás los langostinos pelados con el ajo y una gota de aceite, 2 minutos por lado, y los sumás al arroz al final.',
    min: 6,
  },
  {
    n: 'remolacha',
    it: [['remolacha-cocida', 120]],
    paso: 'Procesás la mitad de la remolacha cocida con un poco de caldo y la sumás al arroz a mitad de cocción; la otra mitad, en cubitos, va al final. Queda de un color rosa intenso.',
    min: 3,
  },
  {
    n: 'puerro y queso azul',
    it: [
      ['puerro', 100],
      ['queso-azul', 25],
    ],
    paso: 'Cocinás el puerro en rodajas finas con el arroz desde el principio. Al final sumás el queso azul desmenuzado.',
    min: 0,
  },
  {
    n: 'tomates cherry y albahaca',
    it: [
      ['tomate-cherry', 150],
      ['albahaca', 4],
    ],
    paso: 'Cortás los cherry al medio y los sumás al arroz a mitad de cocción; al final, albahaca picada.',
    min: 0,
  },
  {
    n: 'salmón',
    prot: true,
    it: [
      ['salmon', 110],
      ['cebolla-verdeo', 15],
    ],
    paso: 'Cortás el salmón en cubos, lo sumás en los últimos 4 minutos de cocción del arroz y servís con cebolla de verdeo por arriba.',
    min: 0,
  },
  {
    n: 'espárragos',
    it: [
      ['esparragos', 120],
      ['limon-exprimido', 8],
    ],
    paso: 'Cortás los espárragos en trozos de 3 cm y los sumás al arroz en los últimos 8 minutos; ralladura y jugo de limón al final.',
    min: 0,
  },
  {
    n: 'cuatro hongos y tomillo',
    it: [
      ['champinones', 90],
      ['girgolas', 50],
      ['shiitake', 30],
    ],
    paso: 'Salteás los hongos cortados en láminas, a fuego fuerte y sin amontonar, con tomillo y una gota de aceite; los sumás al arroz al final.',
    min: 8,
  },
]

export function generarRisottos({ az, armador, cuantas }) {
  let hechas = 0
  for (const r of mezclar(az, RISOTTOS)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Risotto de ${r.n}`,
      minutos: 35 + r.min,
      comidas: ['almuerzo', 'cena'],
      portable: false,
      kcal: [380, 800],
      prot: 9,
      ingredientes: [
        ['arroz-risotto', 70],
        ['caldo-liquido', 280],
        ['cebolla', 40],
        ['parmesano', 20],
        ['manteca', 8],
        ['aceite', 4],
        ...r.it,
      ],
      pasos: [
        'Calentás el caldo y lo mantenés a fuego mínimo al lado.',
        'Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.',
        'Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.',
        r.paso,
        'Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

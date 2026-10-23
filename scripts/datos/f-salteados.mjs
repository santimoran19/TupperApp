// Salteados al wok: proteína, verduras, una salsa y, si se quiere, algo para acompañar.
import { elegir, mezclar } from './motor.mjs'

const PROTEINAS = [
  {
    s: 'pechuga-cruda',
    n: 'pollo',
    vuelve: 'el pollo',
    g: 150,
    min: 8,
    tec: 'Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.',
  },
  {
    s: 'pechuga-pavo',
    n: 'pavo',
    vuelve: 'el pavo',
    g: 150,
    min: 8,
    tec: 'Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.',
  },
  {
    s: 'bife-nalga',
    n: 'carne',
    vuelve: 'la carne',
    g: 150,
    min: 8,
    tec: 'Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.',
  },
  {
    s: 'cuadril',
    n: 'cuadril',
    vuelve: 'el cuadril',
    g: 150,
    min: 8,
    tec: 'Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.',
  },
  {
    s: 'lomo-cerdo',
    n: 'cerdo',
    vuelve: 'el cerdo',
    g: 150,
    min: 8,
    tec: 'Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.',
  },
  {
    s: 'langostinos',
    n: 'langostinos',
    vuelve: 'los langostinos',
    g: 130,
    min: 6,
    tec: 'Pelás los langostinos, los secás bien y los salteás en el wok bien caliente con la mitad del aceite, 1–2 minutos por lado. Los retirás.',
  },
  {
    s: 'calamar',
    n: 'calamar',
    vuelve: 'el calamar',
    g: 150,
    min: 6,
    tec: 'Cortás el calamar en anillos, los secás bien y los salteás en el wok humeante con la mitad del aceite, 1–2 minutos (más tiempo los endurece). Los retirás.',
  },
  {
    s: 'salmon',
    n: 'salmón',
    vuelve: 'el salmón',
    g: 140,
    min: 8,
    tec: 'Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.',
  },
  {
    s: 'tofu',
    n: 'tofu',
    vuelve: 'el tofu',
    g: 130,
    min: 10,
    tec: 'Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.',
  },
  {
    s: 'tempeh',
    n: 'tempeh',
    vuelve: 'el tempeh',
    g: 110,
    min: 8,
    tec: 'Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.',
  },
  {
    s: 'huevo',
    n: 'huevo',
    vuelve: 'el huevo',
    g: 100,
    min: 5,
    tec: 'Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.',
  },
]

const VERDURAS = [
  {
    n: 'zanahoria, cebolla y morrón',
    it: [
      ['zanahoria', 60],
      ['cebolla', 50],
      ['morron', 60],
    ],
    corte: 'la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras',
  },
  {
    n: 'brócoli, zanahoria y cebolla de verdeo',
    it: [
      ['brocoli', 90],
      ['zanahoria', 50],
      ['cebolla-verdeo', 20],
    ],
    corte: 'el brócoli en arbolitos, la zanahoria en rodajas finas y la cebolla de verdeo en trozos',
  },
  {
    n: 'zapallito, morrón y cebolla',
    it: [
      ['zapallito', 100],
      ['morron', 60],
      ['cebolla', 50],
    ],
    corte: 'el zapallito en medias lunas, el morrón en tiras y la cebolla en plumas',
  },
  {
    n: 'chauchas, zanahoria y repollo',
    it: [
      ['chauchas', 80],
      ['zanahoria', 50],
      ['repollo', 70],
    ],
    corte: 'las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas',
  },
  {
    n: 'repollo, zanahoria y brotes de soja',
    it: [
      ['repollo', 80],
      ['zanahoria', 50],
      ['brotes-soja', 40],
    ],
    corte: 'el repollo en tiras finas y la zanahoria en bastones; los brotes de soja van enteros',
  },
  {
    n: 'champiñones, espinaca y cebolla',
    it: [
      ['champinones', 90],
      ['espinaca', 50],
      ['cebolla', 50],
    ],
    corte: 'los champiñones en láminas, la cebolla en plumas y la espinaca lavada',
  },
  {
    n: 'berenjena, morrón y cebolla morada',
    it: [
      ['berenjena', 100],
      ['morron', 60],
      ['cebolla-morada', 40],
    ],
    corte: 'la berenjena en cubos, el morrón en tiras y la cebolla morada en plumas',
  },
  {
    n: 'mix de verduras',
    it: [['verduras-wok', 220]],
    corte: 'nada: el mix de verduras para wok ya viene cortado (lo usás sin descongelar)',
  },
  {
    n: 'brócoli y morrón',
    it: [
      ['brocoli', 110],
      ['morron', 80],
    ],
    corte: 'el brócoli en arbolitos chicos y el morrón en tiras',
  },
  {
    n: 'zanahoria, arvejas y choclo',
    it: [
      ['zanahoria', 60],
      ['arvejas-frescas', 50],
      ['choclo', 50],
    ],
    corte: 'la zanahoria en cubitos; las arvejas y el choclo van enteros',
  },
  {
    n: 'repollo colorado, zanahoria y apio',
    it: [
      ['repollo-colorado', 80],
      ['zanahoria', 50],
      ['apio', 40],
    ],
    corte: 'el repollo colorado en tiras finas, la zanahoria en bastones y el apio en rodajitas',
  },
  {
    n: 'kale y champiñones',
    it: [
      ['kale', 60],
      ['champinones', 90],
      ['cebolla', 40],
    ],
    corte: 'el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas',
  },
  {
    n: 'espárragos y zanahoria',
    it: [
      ['esparragos', 100],
      ['zanahoria', 60],
      ['cebolla-verdeo', 15],
    ],
    corte: 'los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas',
  },
  {
    n: 'coliflor y zanahoria',
    it: [
      ['coliflor', 100],
      ['zanahoria', 60],
      ['cebolla', 40],
    ],
    corte: 'la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas',
  },
]

const CARBS = [
  { n: '', it: [], paso: '', kcal: 0 },
  { n: 'arroz', it: [['arroz', 65]], paso: 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.', min: 14 },
  {
    n: 'arroz integral',
    it: [['arroz-integral', 65]],
    paso: 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.',
    min: 30,
  },
  {
    n: 'arroz basmati',
    it: [['arroz-basmati', 65]],
    paso: 'Lavás el arroz basmati hasta que el agua salga clara, lo hervís 10 minutos y lo escurrís.',
    min: 12,
  },
  {
    n: 'fideos de arroz',
    it: [['fideos-arroz', 60]],
    paso: 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.',
    min: 8,
  },
  {
    n: 'fideos',
    it: [['fideos', 70]],
    paso: 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.',
    min: 12,
  },
  {
    n: 'quinoa',
    it: [['quinoa', 55]],
    paso: 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.',
    min: 18,
  },
  {
    n: 'cuscús',
    it: [['cuscus', 60]],
    paso: 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.',
    min: 7,
  },
]

const SALSAS = [
  {
    adj: 'a la soja y jengibre',
    it: [
      ['salsa-soja', 15],
      ['jengibre', 6],
    ],
    paso: 'Mezclás la salsa de soja con el jengibre rallado y 2 cucharadas de agua.',
  },
  {
    adj: 'con miel y soja',
    it: [
      ['salsa-soja', 15],
      ['miel', 8],
    ],
    paso: 'Mezclás la salsa de soja con la miel y 2 cucharadas de agua.',
  },
  { adj: 'al teriyaki', it: [['salsa-teriyaki', 30]], paso: 'Diluís el teriyaki con 2 cucharadas de agua.' },
  {
    adj: 'agridulce',
    it: [
      ['ketchup', 15],
      ['salsa-soja', 10],
      ['vinagre-manzana', 8],
      ['azucar', 5],
    ],
    paso: 'Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua.',
  },
  {
    adj: 'con salsa de maní',
    it: [
      ['mani-pasta', 18],
      ['salsa-soja', 10],
      ['limon-exprimido', 10],
    ],
    paso: 'Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa.',
  },
  {
    adj: 'al limón',
    it: [
      ['salsa-soja', 12],
      ['limon-exprimido', 20],
      ['miel', 5],
    ],
    paso: 'Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua.',
  },
  {
    adj: 'con miso',
    it: [
      ['pasta-miso', 12],
      ['vinagre-manzana', 5],
    ],
    paso: 'Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre.',
  },
  {
    adj: 'picante',
    it: [
      ['salsa-soja', 12],
      ['salsa-picante', 10],
      ['miel', 5],
    ],
    paso: 'Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua.',
  },
]

export function generarSalteados({ az, armador, cuantas }) {
  const combos = []
  for (const p of PROTEINAS) for (const v of VERDURAS) for (const c of CARBS) combos.push([p, v, c])
  let hechas = 0
  for (const [p, v, c] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const salsa = elegir(az, SALSAS)
    const tipo = elegir(az, ['Wok', 'Wok', 'Salteado'])
    const nombre = `${tipo} de ${p.n} ${salsa.adj} con ${v.n}${c.n ? ` sobre ${c.n}` : ''}`
    const ingredientes = [[p.s, p.g], ...v.it, ...c.it, ...salsa.it, ['aceite', 10], ['ajo', 5], ['sesamo', 4]]
    const ok = armador.agregar({
      nombre,
      minutos: 14 + p.min + (c.min ? Math.min(c.min, 10) : 0),
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [330, 800],
      prot: 15,
      ingredientes,
      pasos: [
        c.paso,
        `Preparás las verduras: ${v.corte.startsWith('nada') ? 'el mix ya viene listo' : v.corte}. Picás el ajo.`,
        p.tec,
        `En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.`,
        `${salsa.paso} La volcás sobre las verduras, devolvés ${p.vuelve} al wok y mezclás 1 minuto.`,
        `${c.n ? `Servís sobre ${c.n} ` : 'Servís '}con semillas de sésamo por arriba.`,
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

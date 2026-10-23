// Bowls de base + proteína + verduras + salsa, y ensaladas tibias de legumbres.
import { mezclar } from './motor.mjs'

const BASES = [
  {
    n: 'arroz integral',
    it: [['arroz-integral-hervido', 150]],
    paso: 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.',
  },
  {
    n: 'quinoa',
    it: [['quinoa-hervida', 150]],
    paso: 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.',
  },
  {
    n: 'cuscús',
    it: [['cuscus-hervido', 150]],
    paso: 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.',
  },
  {
    n: 'fideos de arroz',
    it: [['fideos-arroz-hervidos', 150]],
    paso: 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.',
  },
  {
    n: 'burgol',
    it: [['burgol-hervido', 150]],
    paso: 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.',
  },
  {
    n: 'batata asada',
    it: [
      ['batata', 180],
      ['aceite', 5],
    ],
    paso: 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.',
  },
]
const PROTES = [
  {
    n: 'pollo',
    it: [['pechuga-pollo', 110]],
    paso: 'Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.',
    min: 12,
  },
  { n: 'huevo', it: [['huevo', 100]], paso: 'Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.', min: 10 },
  {
    n: 'tofu',
    it: [
      ['tofu', 120],
      ['salsa-soja', 8],
      ['aceite-sesamo', 4],
    ],
    paso: 'Cortás el tofu en cubos, lo marinás con la soja 10 minutos y lo dorás en sartén con el aceite de sésamo.',
    min: 15,
  },
  {
    n: 'salmón',
    it: [['salmon', 110]],
    paso: 'Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.',
    min: 10,
  },
  {
    n: 'garbanzos',
    it: [
      ['garbanzos-hervidos', 120],
      ['aceite', 4],
    ],
    paso: 'Dorás los garbanzos escurridos en sartén con el aceite, comino y pimentón, 5 minutos, hasta que estén crocantes por fuera.',
    min: 8,
  },
  { n: 'carne', it: [['peceto', 100]], paso: 'Cocinás el peceto en tiras en plancha caliente con sal y pimienta, 3 minutos.', min: 10 },
  { n: 'atún', it: [['atun-natural', 110]], paso: 'Escurrís el atún y lo desmenuzás.', min: 3 },
  { n: 'lentejas', it: [['lentejas-hervidas', 130]], paso: 'Enjuagás las lentejas hervidas y las escurrís.', min: 3 },
  {
    n: 'langostinos',
    it: [
      ['langostinos', 110],
      ['ajo', 3],
      ['aceite', 4],
    ],
    paso: 'Salteás los langostinos pelados con el ajo y el aceite 2 minutos por lado.',
    min: 8,
  },
  {
    n: 'tempeh',
    it: [
      ['tempeh', 100],
      ['salsa-soja', 8],
    ],
    paso: 'Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.',
    min: 12,
  },
]
const VERDES = [
  {
    n: 'palta, pepino y zanahoria',
    it: [
      ['palta', 45],
      ['pepino', 60],
      ['zanahoria-rallada', 50],
    ],
    paso: 'Cortás la palta y el pepino en láminas; rallás la zanahoria.',
  },
  {
    n: 'brócoli, choclo y tomate cherry',
    it: [
      ['brocoli', 80],
      ['choclo', 50],
      ['tomate-cherry', 60],
    ],
    paso: 'Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.',
  },
  {
    n: 'espinaca, remolacha y semillas',
    it: [
      ['espinaca', 40],
      ['remolacha-cocida', 60],
      ['semillas-girasol', 8],
    ],
    paso: 'Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.',
  },
  {
    n: 'repollo colorado, edamame y zanahoria',
    it: [
      ['repollo-colorado', 50],
      ['edamame', 50],
      ['zanahoria-rallada', 40],
    ],
    paso: 'Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.',
  },
  {
    n: 'kale, mango y cebolla morada',
    it: [
      ['kale', 40],
      ['mango', 50],
      ['cebolla-morada', 15],
    ],
    paso: 'Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.',
  },
  {
    n: 'hojas verdes, manzana y apio',
    it: [
      ['hojas-verdes', 40],
      ['manzana-verde', 60],
      ['apio', 30],
    ],
    paso: 'Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.',
  },
]
const SALSAS = [
  {
    n: 'salsa de tahini y limón',
    it: [
      ['tahini', 12],
      ['limon-exprimido', 10],
    ],
    paso: 'Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.',
  },
  {
    n: 'yogur y menta',
    it: [
      ['yogur-natural', 50],
      ['menta', 2],
      ['limon-exprimido', 5],
    ],
    paso: 'Mezclás el yogur con la menta picada, el limón y sal.',
  },
  {
    n: 'salsa de soja y jengibre',
    it: [
      ['salsa-soja', 10],
      ['jengibre', 2],
      ['aceite-sesamo', 4],
    ],
    paso: 'Mezclás la soja con el jengibre rallado y el aceite de sésamo.',
  },
  { n: 'guacamole', it: [['guacamole', 40]], paso: 'Servís con una cucharada de guacamole.' },
  { n: 'pesto', it: [['pesto', 15]], paso: 'Aderezás con el pesto, aflojado con una cucharada de agua tibia.' },
]

export function generarBowls({ az, armador, cuantas }) {
  const combos = []
  for (const b of BASES)
    for (const p of PROTES) for (const v of VERDES) combos.push([b, p, v, SALSAS[(combos.length * 7 + 3) % SALSAS.length]])
  let hechas = 0
  for (const [b, p, v, s] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Bowl de ${b.n}, ${p.n} y ${v.n}`,
      minutos: p.min + 12,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [380, 880],
      prot: 18,
      ingredientes: [...b.it, ...p.it, ...v.it, ...s.it],
      pasos: [
        b.paso,
        p.paso,
        v.paso,
        s.paso,
        'Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

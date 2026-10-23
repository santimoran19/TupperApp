// Sándwiches, wraps, tostadas y bagels: un pan y un relleno, con su verdura al costado.
import { mezclar } from './motor.mjs'

// g: gramos de pan por porción (el armador los pasa a unidades)
const PANES = [
  { n: 'pan integral', s: 'pan-integral', g: 75, v: 'sándwich', tost: true },
  { n: 'pan de centeno', s: 'pan-centeno', g: 60, v: 'sándwich', tost: true },
  { n: 'pan con semillas', s: 'pan-semillas', g: 70, v: 'sándwich', tost: true },
  { n: 'pan árabe', s: 'pan-arabe', g: 60, v: 'pan árabe', tost: false },
  { n: 'wrap integral', s: 'wrap-integral', g: 90, v: 'wrap', tost: false },
  { n: 'bagel', s: 'bagel', g: 90, v: 'bagel', tost: true },
  { n: 'ciabatta', s: 'ciabatta', g: 60, v: 'ciabatta', tost: true },
]
// it: gramos por porción
const RELLENOS = [
  {
    n: 'pollo, palta y tomate',
    it: [
      ['pollo-desmenuzado', 80],
      ['palta', 40],
      ['tomate', 50],
      ['lechuga', 15],
    ],
    paso: 'Desmenuzás el pollo, pisás la palta con sal y limón y cortás el tomate en rodajas.',
    min: 8,
  },
  {
    n: 'atún, tomate y lechuga',
    it: [
      ['atun-natural', 90],
      ['tomate', 50],
      ['lechuga', 20],
      ['mayonesa-light', 10],
    ],
    paso: 'Escurrís el atún y lo mezclás con la mayonesa light; cortás el tomate en rodajas.',
    min: 6,
  },
  {
    n: 'jamón, queso y tomate',
    it: [
      ['jamon-cocido', 35],
      ['queso-port-salut', 35],
      ['tomate', 50],
      ['lechuga', 15],
    ],
    paso: 'Cortás el tomate en rodajas y armás en capas con el jamón y el queso.',
    min: 5,
  },
  {
    n: 'huevo, palta y rúcula',
    it: [
      ['huevo', 60],
      ['palta', 50],
      ['rucula', 15],
    ],
    paso: 'Hacés los huevos duros (9 minutos), los pelás y los aplastás; pisás la palta con sal y limón.',
    min: 14,
  },
  {
    n: 'ricota, tomate y albahaca',
    it: [
      ['ricota', 70],
      ['tomate', 60],
      ['albahaca', 3],
    ],
    paso: 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.',
    min: 5,
  },
  {
    n: 'hummus, zanahoria y pepino',
    it: [
      ['hummus', 50],
      ['zanahoria', 50],
      ['pepino', 50],
      ['lechuga', 15],
    ],
    paso: 'Rallás la zanahoria y cortás el pepino en bastones.',
    min: 6,
  },
  {
    n: 'queso crema, salmón ahumado y pepino',
    it: [
      ['queso-untable', 30],
      ['salmon-ahumado', 40],
      ['pepino', 40],
      ['cebolla-morada', 10],
    ],
    paso: 'Cortás el pepino en rodajas finas y la cebolla morada en aros.',
    min: 6,
  },
  {
    n: 'lomito de cerdo, rúcula y mostaza',
    it: [
      ['lomo-cerdo', 90],
      ['rucula', 15],
      ['mostaza', 8],
      ['cebolla-caramelizada', 25],
    ],
    paso: 'Cocinás el lomo en rodajas finas en plancha caliente 2 minutos por lado, con sal y pimienta.',
    min: 14,
  },
  {
    n: 'milanesa de soja, lechuga y tomate',
    it: [
      ['milanesa-soja', 85],
      ['lechuga', 20],
      ['tomate', 50],
      ['mayonesa-light', 8],
    ],
    paso: 'Calentás la milanesa en horno a 200 °C, 12 minutos, y cortás el tomate en rodajas.',
    min: 16,
  },
  {
    n: 'pavita, queso untable y rúcula',
    it: [
      ['pavita-fiambre', 50],
      ['queso-untable-clasico', 30],
      ['rucula', 15],
      ['tomate', 40],
    ],
    paso: 'Untás el pan con el queso y armás con la pavita, la rúcula y el tomate.',
    min: 5,
  },
  {
    n: 'berenjena asada, muzzarella y albahaca',
    it: [
      ['berenjena', 110],
      ['muzzarella', 40],
      ['albahaca', 3],
      ['aceite', 5],
    ],
    paso: 'Cortás la berenjena en rodajas, las pincelás con aceite y las dorás en plancha 3 minutos por lado; sumás la muzzarella para que se derrita.',
    min: 15,
  },
  {
    n: 'carne, cebolla caramelizada y queso',
    it: [
      ['peceto', 80],
      ['cebolla-caramelizada', 30],
      ['queso-port-salut', 30],
      ['rucula', 10],
    ],
    paso: 'Cortás el peceto cocido en fetas finas y lo calentás 1 minuto en la plancha con la cebolla.',
    min: 10,
  },
  {
    n: 'tofu, zanahoria y brotes',
    it: [
      ['tofu', 90],
      ['zanahoria', 40],
      ['brotes-soja', 20],
      ['salsa-soja', 8],
    ],
    paso: 'Marinás el tofu en tiras con la salsa de soja 5 minutos y lo dorás en sartén 3 minutos por lado; rallás la zanahoria.',
    min: 15,
  },
  {
    n: 'caprese: tomate, muzzarella y pesto',
    it: [
      ['tomate', 80],
      ['muzzarella', 45],
      ['pesto', 10],
      ['rucula', 10],
    ],
    paso: 'Cortás el tomate y la muzzarella en rodajas y las alternás con el pesto.',
    min: 5,
  },
  {
    n: 'pechuga grillada, palta y cherry',
    it: [
      ['pechuga-pollo', 90],
      ['palta', 40],
      ['tomate-cherry', 40],
      ['lechuga', 15],
    ],
    paso: 'Grillás la pechuga en fetas finas con sal y pimienta (3 minutos por lado) y cortás los cherry al medio.',
    min: 14,
  },
  {
    n: 'sardinas, tomate y cebolla morada',
    it: [
      ['sardinas', 70],
      ['tomate', 50],
      ['cebolla-morada', 15],
      ['limon-exprimido', 5],
    ],
    paso: 'Escurrís las sardinas y las aplastás apenas con limón; cortás el tomate y la cebolla finos.',
    min: 6,
  },
  {
    n: 'queso de cabra, remolacha y rúcula',
    it: [
      ['queso-cabra', 40],
      ['remolacha-cocida', 50],
      ['rucula', 15],
      ['nueces', 8],
    ],
    paso: 'Rallás la remolacha cocida, desmenuzás el queso de cabra y picás las nueces.',
    min: 6,
  },
  {
    n: 'pavo, mostaza y pepinillos',
    it: [
      ['pechuga-pavo', 80],
      ['mostaza', 8],
      ['pepinillos', 20],
      ['lechuga', 15],
    ],
    paso: 'Cortás el pavo cocido en fetas finas y los pepinillos en rodajas.',
    min: 5,
  },
  {
    n: 'huevo revuelto, tomate y queso',
    it: [
      ['huevo', 100],
      ['tomate', 50],
      ['queso-cremoso', 25],
      ['aceite', 3],
    ],
    paso: 'Revolvés los huevos con sal en una sartén con el aceite, 2 minutos, y sumás el queso en cubitos al final.',
    min: 8,
  },
  {
    n: 'garbanzos aplastados y palta',
    it: [
      ['garbanzos-hervidos', 80],
      ['palta', 40],
      ['tomate', 40],
      ['jengibre', 1],
    ],
    paso: 'Aplastás los garbanzos con la palta, sal, limón y comino; cortás el tomate en rodajas.',
    min: 6,
  },
]

export function generarSandwiches({ az, armador, cuantas }) {
  const combos = []
  for (const p of PANES) for (const r of RELLENOS) combos.push([p, r])
  let hechas = 0
  for (const [p, r] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const tipo = p.v
    const nombre = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} de ${r.n}${tipo === 'sándwich' ? ` en ${p.n}` : ''}`
    const ok = armador.agregar({
      nombre,
      minutos: r.min + 3,
      comidas: ['almuerzo', 'cena', 'merienda'],
      portable: true,
      kcal: [250, 750],
      prot: 12,
      ingredientes: [[p.s, p.g], ...r.it],
      pasos: [
        r.paso,
        p.tost
          ? 'Tostás el pan 2 minutos para que quede firme y no se humedezca.'
          : tipo === 'wrap'
            ? 'Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.'
            : 'Abrís el pan árabe a la mitad y lo calentás 30 segundos.',
        tipo === 'wrap'
          ? 'Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'
          : 'Armás con todos los ingredientes, apretás suave y cortás al medio.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

const TOSTADAS = [
  {
    n: 'palta y huevo poché',
    it: [
      ['palta', 60],
      ['huevo', 60],
    ],
    paso: 'Pisás la palta con sal, limón y pimienta. Hacés el huevo poché 3 minutos en agua con un chorrito de vinagre, apenas hirviendo.',
    min: 10,
    comidas: ['desayuno', 'almuerzo'],
  },
  {
    n: 'ricota, miel y nueces',
    it: [
      ['ricota', 70],
      ['miel', 8],
      ['nueces', 10],
    ],
    paso: 'Untás la ricota y terminás con un hilo de miel y las nueces picadas.',
    min: 4,
    comidas: ['desayuno', 'merienda'],
  },
  {
    n: 'queso untable y tomate',
    it: [
      ['queso-untable', 35],
      ['tomate', 80],
      ['albahaca', 2],
    ],
    paso: 'Untás el queso y cubrís con rodajas de tomate, sal, aceite de oliva y albahaca.',
    min: 4,
    comidas: ['desayuno', 'merienda'],
  },
  {
    n: 'mantequilla de maní y banana',
    it: [
      ['mani-pasta', 20],
      ['banana', 80],
    ],
    paso: 'Untás la pasta de maní y sumás la banana en rodajas.',
    min: 3,
    comidas: ['desayuno', 'merienda'],
  },
  {
    n: 'hummus, tomate y semillas',
    it: [
      ['hummus', 50],
      ['tomate', 60],
      ['semillas-girasol', 6],
    ],
    paso: 'Untás el hummus, sumás el tomate en rodajas y las semillas.',
    min: 4,
    comidas: ['desayuno', 'merienda'],
  },
  {
    n: 'salmón ahumado y queso crema',
    it: [
      ['salmon-ahumado', 40],
      ['queso-untable', 30],
      ['pepino', 30],
      ['cebolla-verdeo', 5],
    ],
    paso: 'Untás el queso crema, sumás el salmón y el pepino en rodajas finas y la cebolla de verdeo picada.',
    min: 5,
    comidas: ['desayuno', 'almuerzo'],
  },
  {
    n: 'ricota y mermelada de frutilla',
    it: [
      ['ricota', 60],
      ['mermelada-light', 15],
      ['frutilla', 40],
    ],
    paso: 'Untás la ricota, sumás las frutillas en láminas y la mermelada.',
    min: 4,
    comidas: ['desayuno', 'merienda'],
  },
  {
    n: 'banana, avena y canela',
    it: [
      ['banana', 90],
      ['yogur-natural', 40],
      ['avena', 10],
    ],
    paso: 'Aplastás la banana, la untás y cubrís con yogur, avena y canela.',
    min: 4,
    comidas: ['desayuno', 'merienda'],
  },
  {
    n: 'champiñones y queso',
    it: [
      ['champinones', 90],
      ['queso-cremoso', 30],
      ['aceite', 4],
    ],
    paso: 'Salteás los champiñones laminados con el aceite 6 minutos y los apoyás sobre la tostada con el queso en lonjas; gratinás 2 minutos.',
    min: 12,
    comidas: ['desayuno', 'almuerzo'],
  },
  {
    n: 'tomate asado, ricota y albahaca',
    it: [
      ['tomate', 100],
      ['ricota', 50],
      ['albahaca', 2],
      ['aceite-oliva', 4],
    ],
    paso: 'Asás el tomate en rodajas 8 minutos a 200 °C y lo apoyás sobre la ricota con la albahaca y el aceite de oliva.',
    min: 12,
    comidas: ['almuerzo', 'cena'],
  },
  {
    n: 'atún y palta',
    it: [
      ['atun-natural', 70],
      ['palta', 40],
      ['limon-exprimido', 5],
    ],
    paso: 'Escurrís el atún y lo mezclás con la palta pisada, limón, sal y pimienta.',
    min: 5,
    comidas: ['almuerzo', 'cena'],
  },
  {
    n: 'huevo revuelto y espinaca',
    it: [
      ['huevo', 100],
      ['espinaca', 30],
      ['aceite', 3],
    ],
    paso: 'Salteás la espinaca con el aceite 1 minuto, sumás los huevos batidos y revolvés 2 minutos.',
    min: 7,
    comidas: ['desayuno', 'almuerzo'],
  },
]
const BASES_T = [
  { n: 'pan integral', s: 'pan-integral', g: 50 },
  { n: 'pan de centeno', s: 'pan-centeno', g: 60 },
  { n: 'pan con semillas', s: 'pan-semillas', g: 70 },
  { n: 'tostadas integrales', s: 'tostadas-integrales', g: 32 },
]

export function generarTostadas({ az, armador, cuantas }) {
  const combos = []
  for (const b of BASES_T) for (const t of TOSTADAS) combos.push([b, t])
  let hechas = 0
  for (const [b, t] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Tostadas de ${b.n} con ${t.n}`,
      minutos: t.min,
      comidas: t.comidas,
      portable: false,
      kcal: [180, 650],
      prot: 6,
      ingredientes: [[b.s, b.g], ...t.it],
      pasos: [t.paso, `Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.`],
    })
    if (ok) hechas++
  }
  return hechas
}

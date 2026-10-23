// Verduras rellenas y canelones/lasañas livianas.
import { mezclar } from './motor.mjs'

const ENVASES = [
  {
    n: 'zapallitos',
    it: [['zapallito', 300]],
    p: 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.',
    min: 15,
  },
  { n: 'morrones', it: [['morron', 200]], p: 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.', min: 12 },
  {
    n: 'berenjenas',
    it: [['berenjena', 300]],
    p: 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.',
    min: 20,
  },
  {
    n: 'tomates',
    it: [['tomate', 300]],
    p: 'Cortás la tapita de los tomates, los ahuecás con una cuchara y reservás la pulpa picada para el relleno.',
    min: 10,
  },
  {
    n: 'calabacines',
    it: [['zapallito', 300]],
    p: 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.',
    min: 12,
  },
  { n: 'papas', it: [['papa', 250]], p: 'Hervís las papas con cáscara 20 minutos, las cortás al medio y las ahuecás un poco.', min: 25 },
  { n: 'cebollas', it: [['cebolla', 250]], p: 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.', min: 20 },
  { n: 'hongos portobello', it: [['champinones', 250]], p: 'Sacás el tallo a los hongos grandes y los picás para el relleno.', min: 8 },
]
const RELLENOS = [
  {
    n: 'carne',
    it: [
      ['carne-picada-magra', 120],
      ['cebolla', 40],
      ['queso-rallado', 10],
    ],
    p: 'Salteás la carne con la cebolla picada hasta que se dore (6 minutos) y sazonás con sal, pimienta y pimentón.',
  },
  {
    n: 'pollo y queso',
    it: [
      ['picada-pollo', 120],
      ['queso-cremoso', 30],
      ['cebolla', 30],
    ],
    p: 'Salteás el pollo picado con la cebolla 6 minutos y mezclás con el queso en cubitos.',
  },
  {
    n: 'arroz y atún',
    it: [
      ['arroz-hervido', 80],
      ['atun-natural', 90],
      ['tomate', 40],
    ],
    p: 'Mezclás el arroz con el atún escurrido y el tomate en cubitos, sal y orégano.',
  },
  {
    n: 'quinoa y verduras',
    it: [
      ['quinoa-hervida', 90],
      ['zanahoria', 40],
      ['choclo', 30],
      ['queso-cremoso', 25],
    ],
    p: 'Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.',
  },
  {
    n: 'ricota y espinaca',
    it: [
      ['ricota', 90],
      ['espinaca', 60],
      ['queso-rallado', 12],
    ],
    p: 'Salteás la espinaca picada 2 minutos, la mezclás con la ricota, el queso rallado, sal y nuez moscada.',
  },
  {
    n: 'lentejas',
    it: [
      ['lentejas-hervidas', 120],
      ['cebolla', 30],
      ['tomate-triturado', 40],
      ['queso-rallado', 10],
    ],
    p: 'Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.',
  },
  {
    n: 'jamón y queso',
    it: [
      ['jamon-cocido', 50],
      ['queso-cremoso', 50],
      ['salsa-blanca', 40],
    ],
    p: 'Mezclás el jamón picado y el queso en cubitos con la salsa blanca.',
  },
  {
    n: 'garbanzos y verduras',
    it: [
      ['garbanzos-hervidos', 100],
      ['zanahoria', 30],
      ['cebolla', 30],
      ['tomate-triturado', 40],
    ],
    p: 'Mezclás los garbanzos con la cebolla y la zanahoria salteadas y el tomate triturado, con comino y sal.',
  },
  {
    n: 'pavo y verduras',
    it: [
      ['picada-pavo', 120],
      ['zanahoria', 30],
      ['cebolla', 30],
      ['queso-rallado', 10],
    ],
    p: 'Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.',
  },
  {
    n: 'champiñones y queso',
    it: [
      ['champinones', 100],
      ['queso-cremoso', 40],
      ['cebolla', 30],
      ['aceite', 5],
    ],
    p: 'Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.',
  },
]

export function generarRellenos({ az, armador, cuantas }) {
  const combos = []
  for (const e of ENVASES) for (const r of RELLENOS) combos.push([e, r])
  let hechas = 0
  for (const [e, r] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `${e.n.charAt(0).toUpperCase() + e.n.slice(1)} rellenos de ${r.n}`,
      minutos: e.min + 35,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [250, 850],
      prot: 12,
      ingredientes: [...e.it, ...r.it, ['queso-rallado', 10], ['aceite', 4]],
      pasos: [
        e.p,
        r.p,
        'Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.',
        'Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

const ROLLOS = [
  {
    n: 'canelones de ricota y espinaca',
    it: [
      ['tapas-canelones', 60],
      ['ricota', 100],
      ['espinaca', 60],
      ['salsa-tomate', 100],
      ['queso-rallado', 15],
    ],
    p: [
      'Salteás la espinaca picada 2 minutos y la mezclás con la ricota, sal y nuez moscada.',
      'Hidratás las tapas, las rellenás y las enrollás.',
      'Las acomodás en una fuente con la salsa de tomate y el queso rallado, y horneás 25 minutos a 200 °C.',
    ],
  },
  {
    n: 'canelones de pollo y verduras',
    it: [
      ['tapas-canelones', 60],
      ['picada-pollo', 100],
      ['zanahoria', 40],
      ['cebolla', 30],
      ['salsa-tomate', 100],
      ['queso-rallado', 15],
    ],
    p: [
      'Salteás el pollo con la cebolla y la zanahoria rallada 7 minutos, con sal y pimienta.',
      'Hidratás las tapas, las rellenás y las enrollás.',
      'Las acomodás con la salsa de tomate y el queso rallado, y horneás 25 minutos a 200 °C.',
    ],
  },
  {
    n: 'lasaña de verduras',
    it: [
      ['tapas-lasana', 30],
      ['calabaza', 100],
      ['zapallito', 80],
      ['salsa-tomate', 100],
      ['muzzarella', 40],
      ['ricota-light', 50],
    ],
    p: [
      'Cortás la calabaza y el zapallito en rodajas finas y las salteás 5 minutos.',
      'Armás capas alternando tapas, verduras, ricota, salsa de tomate y muzzarella; terminás con muzzarella.',
      'Horneás tapada 25 minutos a 190 °C y 10 minutos destapada para gratinar.',
    ],
  },
  {
    n: 'lasaña de carne',
    it: [
      ['tapas-lasana', 30],
      ['carne-picada-magra', 100],
      ['salsa-tomate', 120],
      ['muzzarella', 40],
      ['salsa-blanca', 50],
    ],
    p: [
      'Cocinás la carne picada con un poco de salsa de tomate, cebolla, sal y orégano, 8 minutos.',
      'Armás capas: tapas, carne, salsa blanca y muzzarella; terminás con salsa y queso.',
      'Horneás 30 minutos a 190 °C hasta que burbujee y se dore.',
    ],
  },
  {
    n: 'panqueques de verdura y ricota gratinados',
    it: [
      ['panqueque-simple', 120],
      ['ricota', 80],
      ['espinaca', 50],
      ['salsa-tomate', 80],
      ['queso-rallado', 15],
    ],
    p: [
      'Salteás la espinaca picada 2 minutos y la mezclás con la ricota, sal y nuez moscada.',
      'Rellenás los panqueques y los enrollás.',
      'Los acomodás con la salsa de tomate y el queso rallado y gratinás 15 minutos a 200 °C.',
    ],
  },
]

export function generarRollos({ armador }) {
  let hechas = 0
  for (const r of ROLLOS) {
    const ok = armador.agregar({
      nombre: r.n.charAt(0).toUpperCase() + r.n.slice(1),
      minutos: 60,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [300, 850],
      prot: 14,
      ingredientes: r.it,
      pasos: r.p,
    })
    if (ok) hechas++
  }
  return hechas
}

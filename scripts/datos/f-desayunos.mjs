// Desayunos y meriendas: avena, yogur con frutas, licuados, panqueques y budines livianos.
import { mezclar } from './motor.mjs'

const FRUTAS = [
  { n: 'banana', it: [['banana', 100]], paso: 'Cortás la banana en rodajas.' },
  { n: 'frutilla', it: [['frutilla', 100]], paso: 'Lavás las frutillas y las cortás en láminas.' },
  { n: 'manzana', it: [['manzana', 120]], paso: 'Cortás la manzana en cubitos (con cáscara).' },
  { n: 'arándanos', it: [['arandanos', 80]], paso: 'Lavás los arándanos.' },
  { n: 'durazno', it: [['durazno', 120]], paso: 'Cortás el durazno en gajos.' },
  { n: 'pera', it: [['pera', 120]], paso: 'Cortás la pera en cubitos.' },
  { n: 'kiwi', it: [['kiwi', 100]], paso: 'Pelás el kiwi y lo cortás en rodajas.' },
  { n: 'mango', it: [['mango', 100]], paso: 'Cortás el mango en cubos.' },
  { n: 'frambuesas', it: [['frambuesa', 80]], paso: 'Lavás las frambuesas con cuidado.' },
  { n: 'anana', it: [['anana', 100]], paso: 'Cortás el ananá en trozos chicos.' },
]
const TOPS = [
  { n: 'nueces', it: [['nueces', 12]], paso: 'Picás las nueces y las espolvoreás por encima.' },
  { n: 'almendras', it: [['almendras', 12]], paso: 'Picás las almendras y las espolvoreás por encima.' },
  { n: 'semillas de chía', it: [['chia', 8]], paso: 'Espolvoreás la chía por encima.' },
  { n: 'coco rallado', it: [['coco-rallado', 8]], paso: 'Espolvoreás el coco rallado.' },
  { n: 'miel', it: [['miel', 10]], paso: 'Terminás con un hilo de miel.' },
  { n: 'cacao', it: [['cacao-amargo', 5]], paso: 'Espolvoreás el cacao amargo.' },
  { n: 'semillas de girasol', it: [['semillas-girasol', 10]], paso: 'Esparcís las semillas de girasol.' },
  { n: 'pasas de uva', it: [['pasas', 15]], paso: 'Sumás las pasas de uva.' },
]

export function generarAvenas({ az, armador, cuantas }) {
  const base = [
    {
      n: 'Avena cocida',
      min: 10,
      it: [
        ['avena', 40],
        ['leche', 180],
      ],
      pasos: ['Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.'],
    },
    {
      n: 'Avena en frío (overnight)',
      min: 5,
      it: [
        ['avena', 40],
        ['yogur-natural', 80],
        ['leche', 80],
        ['chia', 5],
      ],
      pasos: [
        'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).',
      ],
    },
    {
      n: 'Avena con cacao',
      min: 10,
      it: [
        ['avena', 40],
        ['leche', 180],
        ['cacao-amargo', 6],
      ],
      pasos: ['Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.'],
    },
    {
      n: 'Avena con yogur griego',
      min: 4,
      it: [
        ['avena', 35],
        ['yogur-griego', 120],
        ['leche', 40],
      ],
      pasos: ['Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.'],
    },
  ]
  const combos = []
  for (const b of base) for (const f of FRUTAS) for (const t of TOPS) combos.push([b, f, t])
  let hechas = 0
  for (const [b, f, t] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `${b.n} con ${f.n} y ${t.n}`,
      minutos: b.min + 3,
      comidas: ['desayuno', 'merienda'],
      portable: b.n.includes('frío'),
      kcal: [200, 650],
      prot: 7,
      ingredientes: [...b.it, ...f.it, ...t.it],
      pasos: [...b.pasos, f.paso, 'Servís la avena en un bowl y sumás la fruta.', t.paso],
    })
    if (ok) hechas++
  }
  return hechas
}

export function generarYogures({ az, armador, cuantas }) {
  const base = [
    { n: 'Yogur natural', it: [['yogur-natural', 170]] },
    { n: 'Yogur griego', it: [['yogur-griego', 150]] },
    { n: 'Yogur proteico', it: [['yogur-proteico', 160]] },
    { n: 'Cottage', it: [['cottage', 150]] },
  ]
  const granos = [
    { n: 'granola', it: [['granola', 30]], paso: 'Sumás la granola recién al servir, para que quede crocante.' },
    { n: 'avena', it: [['avena', 25]], paso: 'Sumás la avena cruda y mezclás.' },
    { n: 'muesli', it: [['muesli', 30]], paso: 'Sumás el muesli por encima.' },
  ]
  const combos = []
  for (const b of base) for (const g of granos) for (const f of FRUTAS) combos.push([b, g, f])
  let hechas = 0
  for (const [b, g, f] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `${b.n} con ${f.n} y ${g.n}`,
      minutos: 4,
      comidas: ['desayuno', 'merienda'],
      portable: true,
      kcal: [150, 600],
      prot: 8,
      ingredientes: [...b.it, ...g.it, ...f.it],
      pasos: [f.paso, `Servís el ${b.n.toLowerCase()} en un bowl o frasco y sumás la fruta.`, g.paso],
    })
    if (ok) hechas++
  }
  return hechas
}

export function generarLicuados({ az, armador, cuantas }) {
  const liquidos = [
    { n: 'leche', it: [['leche', 200]] },
    { n: 'bebida de almendras', it: [['bebida-almendras', 200]] },
    { n: 'bebida de avena', it: [['bebida-avena', 200]] },
    {
      n: 'yogur',
      it: [
        ['yogur-natural', 120],
        ['leche', 80],
      ],
    },
  ]
  const extras = [
    { n: 'avena', it: [['avena', 20]], paso: 'sumás la avena' },
    { n: 'mantequilla de maní', it: [['mani-pasta', 15]], paso: 'sumás la pasta de maní' },
    { n: 'espinaca', it: [['espinaca', 30]], paso: 'sumás la espinaca' },
    {
      n: 'cacao',
      it: [
        ['cacao-amargo', 6],
        ['miel', 8],
      ],
      paso: 'sumás el cacao y la miel',
    },
    { n: 'proteína', it: [['proteina-polvo', 25]], paso: 'sumás la proteína en polvo' },
    {
      n: 'jengibre',
      it: [
        ['jengibre', 3],
        ['miel', 8],
      ],
      paso: 'sumás el jengibre rallado y la miel',
    },
  ]
  const frutas = FRUTAS.filter((f) => f.n !== 'kiwi')
  const combos = []
  for (const l of liquidos) for (const e of extras) for (const f of frutas) combos.push([l, e, f])
  let hechas = 0
  for (const [l, e, f] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Licuado de ${f.n} con ${e.n} (${l.n})`,
      minutos: 5,
      comidas: ['desayuno', 'merienda'],
      portable: true,
      kcal: [120, 520],
      prot: 5,
      ingredientes: [...l.it, ...e.it, ...f.it],
      pasos: [
        f.paso,
        `Ponés en la licuadora ${l.n}, la fruta y ${e.paso}, con unos cubos de hielo si querés.`,
        'Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

export function generarPanqueques({ az, armador, cuantas }) {
  const masas = [
    {
      n: 'Panqueques de avena',
      it: [
        ['avena', 35],
        ['huevo', 50],
        ['leche', 80],
      ],
      paso: 'Licuás la avena con el huevo y la leche hasta obtener una mezcla lisa; la dejás reposar 5 minutos.',
    },
    {
      n: 'Panqueques de banana',
      it: [
        ['banana', 100],
        ['huevo', 50],
        ['avena', 25],
      ],
      paso: 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.',
    },
    {
      n: 'Tortitas de yogur',
      it: [
        ['harina-integral', 40],
        ['yogur-natural', 60],
        ['huevo', 50],
        ['polvo-hornear', 2],
      ],
      paso: 'Mezclás la harina con el polvo de hornear; sumás el yogur y el huevo y revolvés hasta integrar.',
    },
    {
      n: 'Panqueques de ricota',
      it: [
        ['ricota', 80],
        ['huevo', 50],
        ['harina', 25],
      ],
      paso: 'Mezclás la ricota con el huevo y la harina hasta obtener una masa espesa.',
    },
  ]
  const salsas = [
    {
      n: 'frutillas y miel',
      it: [
        ['frutilla', 80],
        ['miel', 10],
      ],
    },
    {
      n: 'banana y dulce de leche light',
      it: [
        ['banana', 80],
        ['dulce-leche-light', 15],
      ],
    },
    {
      n: 'arándanos y yogur',
      it: [
        ['arandanos', 60],
        ['yogur-natural', 50],
      ],
    },
    {
      n: 'manzana y canela',
      it: [
        ['manzana', 100],
        ['azucar-mascabo', 5],
      ],
    },
    {
      n: 'durazno y ricota',
      it: [
        ['durazno', 100],
        ['ricota', 40],
      ],
    },
    {
      n: 'mango y coco',
      it: [
        ['mango', 80],
        ['coco-rallado', 6],
      ],
    },
    {
      n: 'mantequilla de maní y banana',
      it: [
        ['mani-pasta', 15],
        ['banana', 70],
      ],
    },
    {
      n: 'cacao y frutillas',
      it: [
        ['cacao-amargo', 5],
        ['frutilla', 80],
        ['miel', 8],
      ],
    },
  ]
  const combos = []
  for (const m of masas) for (const s of salsas) combos.push([m, s])
  let hechas = 0
  for (const [m, s] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `${m.n} con ${s.n}`,
      minutos: 20,
      comidas: ['desayuno', 'merienda'],
      portable: false,
      kcal: [250, 650],
      prot: 9,
      ingredientes: [...m.it, ...s.it, ['aceite', 3]],
      pasos: [
        m.paso,
        'Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.',
        `Servís los panqueques con ${s.n.replace(' y ', ' y ')} por encima.`,
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

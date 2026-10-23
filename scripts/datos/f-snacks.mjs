// Snacks, budines y postres livianos, y empanadas caseras al horno.
import { mezclar } from './motor.mjs'

const SNACKS = [
  {
    n: 'Bastones de zanahoria con hummus',
    it: [
      ['zanahoria', 120],
      ['hummus', 50],
    ],
    p: ['Pelás la zanahoria y la cortás en bastones.', 'Servís con el hummus para mojar.'],
    min: 5,
  },
  {
    n: 'Bastones de pepino con tzatziki',
    it: [
      ['pepino', 150],
      ['tzatziki', 60],
    ],
    p: ['Cortás el pepino en bastones.', 'Servís con el tzatziki para mojar.'],
    min: 5,
  },
  {
    n: 'Manzana con mantequilla de maní',
    it: [
      ['manzana', 150],
      ['mani-pasta', 15],
    ],
    p: ['Cortás la manzana en gajos.', 'Servís con la pasta de maní para untar.'],
    min: 3,
  },
  {
    n: 'Palta rellena con atún',
    it: [
      ['palta', 100],
      ['atun-natural', 80],
      ['limon-exprimido', 5],
    ],
    p: ['Cortás la palta al medio y sacás el carozo.', 'Mezclás el atún escurrido con limón, sal y pimienta y rellenás las paltas.'],
    min: 6,
  },
  {
    n: 'Huevos duros con tomate cherry',
    it: [
      ['huevo', 100],
      ['tomate-cherry', 100],
    ],
    p: ['Hervís los huevos 9 minutos, los enfriás y los pelás.', 'Servís con los cherry, sal y orégano.'],
    min: 12,
  },
  {
    n: 'Yogur con frutos secos y miel',
    it: [
      ['yogur-natural', 150],
      ['nueces', 12],
      ['miel', 8],
    ],
    p: ['Servís el yogur en un bowl.', 'Sumás las nueces picadas y un hilo de miel.'],
    min: 3,
  },
  {
    n: 'Tostada de arroz con ricota y tomate',
    it: [
      ['galleta-arroz', 27],
      ['ricota', 60],
      ['tomate', 60],
    ],
    p: ['Untás las galletas de arroz con la ricota.', 'Sumás rodajas de tomate, sal y orégano.'],
    min: 4,
  },
  {
    n: 'Garbanzos asados crocantes',
    it: [
      ['garbanzos-hervidos', 120],
      ['aceite', 5],
    ],
    p: [
      'Secás bien los garbanzos y los mezclás con el aceite, pimentón, comino y sal.',
      'Los asás en horno a 220 °C, 25 minutos, moviendo la placa a la mitad, hasta que estén crocantes.',
    ],
    min: 30,
  },
  {
    n: 'Chips de batata al horno',
    it: [
      ['batata', 150],
      ['aceite', 5],
    ],
    p: [
      'Cortás la batata en rodajas finísimas con mandolina y las mezclás con el aceite y sal.',
      'Las asás en placa, sin superponerlas, 20 minutos a 180 °C, dándolas vuelta a la mitad.',
    ],
    min: 30,
  },
  {
    n: 'Chips de kale al horno',
    it: [
      ['kale', 60],
      ['aceite', 4],
    ],
    p: [
      'Lavás y secás muy bien el kale; lo cortás en trozos y lo mezclás con el aceite y sal.',
      'Lo horneás 12 minutos a 160 °C, hasta que esté crocante.',
    ],
    min: 18,
  },
  {
    n: 'Bolitas de dátiles y avena',
    it: [
      ['datiles', 40],
      ['avena', 25],
      ['cacao-amargo', 5],
      ['mani-pasta', 10],
    ],
    p: [
      'Procesás los dátiles con la avena, el cacao y la pasta de maní hasta lograr una masa.',
      'Formás bolitas y las dejás 30 minutos en la heladera.',
    ],
    min: 40,
  },
  {
    n: 'Queso con membrillo y nueces',
    it: [
      ['queso-port-salut', 40],
      ['dulce-membrillo', 30],
      ['nueces', 10],
    ],
    p: ['Cortás el queso y el membrillo en láminas.', 'Armás las porciones y sumás las nueces.'],
    min: 4,
  },
  {
    n: 'Rollitos de jamón y queso',
    it: [
      ['jamon-cocido', 50],
      ['queso-untable', 40],
      ['pepino', 40],
    ],
    p: ['Untás las fetas de jamón con el queso.', 'Sumás un bastón de pepino y enrollás.'],
    min: 6,
  },
  {
    n: 'Ensalada de frutas con yogur',
    it: [
      ['ensalada-frutas', 150],
      ['yogur-natural', 80],
      ['miel', 5],
    ],
    p: ['Cortás la fruta en cubitos.', 'Servís con el yogur y un hilo de miel.'],
    min: 6,
  },
  {
    n: 'Bruschettas de tomate y albahaca',
    it: [
      ['pan-frances', 60],
      ['tomate', 120],
      ['albahaca', 3],
      ['aceite-oliva', 6],
    ],
    p: [
      'Cortás el pan en rodajas y lo tostás.',
      'Mezclás el tomate en cubitos con la albahaca, el aceite de oliva y sal; lo apoyás sobre el pan.',
    ],
    min: 12,
  },
]

export function generarSnacks({ armador }) {
  let hechas = 0
  for (const s of SNACKS) {
    const ok = armador.agregar({
      nombre: s.n,
      minutos: s.min,
      comidas: ['merienda'],
      portable: true,
      kcal: [80, 450],
      prot: 0,
      ingredientes: s.it,
      pasos: s.p,
    })
    if (ok) hechas++
  }
  return hechas
}

const BUDINES = [
  {
    n: 'banana',
    it: [
      ['banana', 200],
      ['avena', 60],
      ['huevo', 50],
      ['polvo-hornear', 3],
    ],
    p: 'Aplastás las bananas y las mezclás con los huevos, la avena y el polvo de hornear; sumás canela.',
  },
  {
    n: 'zanahoria',
    it: [
      ['zanahoria', 150],
      ['harina-integral', 60],
      ['huevo', 100],
      ['azucar-mascabo', 25],
      ['aceite', 20],
      ['polvo-hornear', 4],
    ],
    p: 'Rallás la zanahoria fina y la mezclás con los huevos, el azúcar y el aceite; sumás la harina con el polvo de hornear.',
  },
  {
    n: 'manzana y canela',
    it: [
      ['manzana', 200],
      ['avena', 60],
      ['huevo', 100],
      ['azucar-mascabo', 20],
      ['polvo-hornear', 4],
    ],
    p: 'Rallás la manzana y la mezclás con los huevos, el azúcar, la avena, canela y el polvo de hornear.',
  },
  {
    n: 'limón y yogur',
    it: [
      ['yogur-natural', 150],
      ['harina', 100],
      ['huevo', 100],
      ['azucar-mascabo', 40],
      ['aceite', 30],
      ['polvo-hornear', 5],
      ['limon-exprimido', 20],
    ],
    p: 'Mezclás el yogur con los huevos, el azúcar, el aceite y el jugo de limón; sumás la harina con el polvo de hornear.',
  },
  {
    n: 'cacao y avena',
    it: [
      ['avena', 80],
      ['cacao-amargo', 15],
      ['huevo', 100],
      ['banana', 100],
      ['leche', 100],
      ['polvo-hornear', 4],
    ],
    p: 'Procesás la avena con la banana, los huevos, la leche, el cacao y el polvo de hornear hasta que quede lisa.',
  },
  {
    n: 'calabaza',
    it: [
      ['pure-calabaza', 200],
      ['harina-integral', 80],
      ['huevo', 100],
      ['azucar-mascabo', 30],
      ['aceite', 20],
      ['polvo-hornear', 4],
    ],
    p: 'Mezclás el puré de calabaza con los huevos, el azúcar y el aceite; sumás la harina con el polvo de hornear y canela.',
  },
]
export function generarBudines({ armador }) {
  let hechas = 0
  for (const b of BUDINES) {
    const ok = armador.agregar({
      nombre: `Budín de ${b.n}`,
      minutos: 55,
      porciones: 8,
      comidas: ['merienda', 'desayuno'],
      portable: true,
      kcal: [90, 380],
      prot: 0,
      ingredientes: b.it.map(([s, g]) => [s, (g * 2.5) / 8]),
      pasos: [
        b.p,
        'Volcás la mezcla en un molde de budín aceitado y enharinado.',
        'Horneás a 180 °C, 40 minutos, hasta que un palillo salga limpio. Dejás enfriar antes de desmoldar y cortás en 8 porciones.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

const POSTRES = [
  {
    n: 'Manzanas asadas con canela y nueces',
    it: [
      ['manzana', 180],
      ['nueces', 10],
      ['miel', 8],
    ],
    p: [
      'Sacás el centro de las manzanas y las rellenás con las nueces picadas, canela y miel.',
      'Las horneás 30 minutos a 180 °C, hasta que estén tiernas.',
    ],
    min: 35,
  },
  {
    n: 'Peras al horno con yogur',
    it: [
      ['pera', 180],
      ['yogur-natural', 100],
      ['miel', 8],
    ],
    p: ['Cortás las peras al medio, sacás el centro y las horneás con canela y miel 25 minutos a 180 °C.', 'Servís tibias con el yogur.'],
    min: 30,
  },
  {
    n: 'Helado casero de banana',
    it: [['banana-congelada', 180]],
    p: [
      'Procesás la banana congelada en trozos hasta lograr una crema suave (3–4 minutos).',
      'Servís enseguida o freezás 30 minutos para que tome cuerpo.',
    ],
    min: 8,
  },
  {
    n: 'Helado casero de frutilla',
    it: [
      ['frutilla-congelada', 150],
      ['yogur-natural', 60],
    ],
    p: ['Procesás la frutilla congelada con el yogur hasta que quede cremosa.', 'Servís enseguida.'],
    min: 6,
  },
  {
    n: 'Mousse de chocolate y palta',
    it: [
      ['palta', 100],
      ['cacao-amargo', 15],
      ['miel', 20],
      ['leche', 40],
    ],
    p: ['Procesás la palta con el cacao, la miel y la leche hasta que quede muy lisa.', 'Dejás enfriar 1 hora y servís en vasitos.'],
    min: 70,
  },
  {
    n: 'Pudín de chía y frutilla',
    it: [
      ['chia', 25],
      ['leche', 180],
      ['frutilla', 80],
      ['miel', 8],
    ],
    p: ['Mezclás la chía con la leche y la miel y la dejás en la heladera mínimo 4 horas.', 'Servís con las frutillas en láminas.'],
    min: 250,
  },
  {
    n: 'Pudín de chía y mango',
    it: [
      ['chia', 25],
      ['leche', 180],
      ['mango', 80],
      ['miel', 8],
    ],
    p: ['Mezclás la chía con la leche y la miel y la dejás en la heladera mínimo 4 horas.', 'Servís con el mango en cubos.'],
    min: 250,
  },
  {
    n: 'Ensalada de frutas con menta',
    it: [
      ['ensalada-frutas', 200],
      ['menta', 2],
      ['limon-exprimido', 8],
    ],
    p: ['Cortás la fruta en cubitos.', 'Mezclás con el jugo de limón y la menta picada. Servís bien fría.'],
    min: 8,
  },
  {
    n: 'Flan casero liviano',
    it: [
      ['huevo', 100],
      ['leche', 200],
      ['azucar', 20],
      ['dulce-leche-light', 15],
    ],
    p: [
      'Batís los huevos con el azúcar y la leche, y colás la mezcla.',
      'Volcás en flaneras y cocinás a baño María en horno a 170 °C, 40 minutos.',
      'Enfriás y servís con dulce de leche light.',
    ],
    min: 55,
  },
  {
    n: 'Ricota con miel y canela',
    it: [
      ['ricota', 100],
      ['miel', 12],
      ['nueces', 8],
    ],
    p: ['Servís la ricota en un bowl.', 'Sumás un hilo de miel, canela y las nueces picadas.'],
    min: 3,
  },
  {
    n: 'Arroz con leche liviano',
    it: [
      ['arroz', 40],
      ['leche', 250],
      ['azucar', 15],
    ],
    p: [
      'Hervís el arroz con la leche, el azúcar, una tira de cáscara de limón y canela, a fuego bajo, 25 minutos, revolviendo seguido.',
      'Servís tibio o frío.',
    ],
    min: 30,
  },
  {
    n: 'Gelatina de frutas casera',
    it: [
      ['gelatina-sin-sabor', 6],
      ['jugo-naranja', 180],
      ['frutilla', 60],
    ],
    p: ['Hidratás la gelatina sin sabor y la disolvés en el jugo tibio.', 'Sumás la fruta picada y llevás a la heladera 4 horas.'],
    min: 250,
  },
]
export function generarPostres({ armador }) {
  let hechas = 0
  for (const s of POSTRES) {
    const ok = armador.agregar({
      nombre: s.n,
      minutos: s.min,
      comidas: ['merienda'],
      portable: false,
      kcal: [60, 520],
      prot: 0,
      ingredientes: s.it,
      pasos: s.p,
    })
    if (ok) hechas++
  }
  return hechas
}

const EMP = [
  {
    n: 'carne',
    it: [
      ['carne-picada-magra', 90],
      ['cebolla', 50],
      ['huevo', 25],
      ['aceitunas', 8],
    ],
    p: 'Cocinás la carne con la cebolla picada, comino, pimentón y sal; la dejás enfriar y sumás el huevo duro picado y las aceitunas.',
  },
  {
    n: 'pollo y verdeo',
    it: [
      ['pollo-desmenuzado', 90],
      ['cebolla-verdeo', 30],
      ['queso-cremoso', 25],
    ],
    p: 'Mezclás el pollo desmenuzado con la cebolla de verdeo salteada y el queso en cubitos; sazonás.',
  },
  {
    n: 'humita',
    it: [
      ['choclo-cremoso', 100],
      ['cebolla', 40],
      ['queso-cremoso', 25],
    ],
    p: 'Salteás la cebolla y sumás el choclo cremoso, sal y pimentón; cocinás 5 minutos y mezclás con el queso.',
  },
  {
    n: 'jamón y queso',
    it: [
      ['jamon-cocido', 50],
      ['queso-cremoso', 50],
    ],
    p: 'Cortás el jamón y el queso en cubitos y los mezclás.',
  },
  {
    n: 'espinaca y ricota',
    it: [
      ['espinaca', 70],
      ['ricota', 60],
      ['queso-rallado', 10],
    ],
    p: 'Salteás la espinaca picada 2 minutos y la mezclás con la ricota, el queso rallado y nuez moscada.',
  },
  {
    n: 'verdura y queso',
    it: [
      ['acelga', 70],
      ['cebolla', 30],
      ['queso-cremoso', 40],
    ],
    p: 'Hervís la acelga, la escurrís y la picás; la mezclás con la cebolla salteada y el queso.',
  },
  {
    n: 'caprese',
    it: [
      ['tomate', 80],
      ['muzzarella', 50],
      ['albahaca', 2],
    ],
    p: 'Cortás el tomate sin semillas y la muzzarella en cubitos y los mezclás con la albahaca picada y sal.',
  },
  {
    n: 'atún y cebolla',
    it: [
      ['atun-natural', 90],
      ['cebolla', 40],
      ['tomate', 40],
    ],
    p: 'Escurrís el atún y lo mezclás con la cebolla salteada y el tomate en cubitos.',
  },
  {
    n: 'cebolla y queso',
    it: [
      ['cebolla', 120],
      ['queso-cremoso', 50],
    ],
    p: 'Cocinás la cebolla en plumas a fuego bajo hasta que esté bien tierna (15 minutos) y la mezclás con el queso en cubitos.',
  },
  {
    n: 'calabaza y queso',
    it: [
      ['calabaza', 120],
      ['queso-cremoso', 40],
      ['cebolla', 30],
    ],
    p: 'Hervís la calabaza y la pisás; la mezclás con la cebolla salteada y el queso.',
  },
  {
    n: 'lentejas y verduras',
    it: [
      ['lentejas-hervidas', 100],
      ['zanahoria', 40],
      ['cebolla', 40],
    ],
    p: 'Mezclás las lentejas con la zanahoria rallada y la cebolla salteada; condimentás con comino y pimentón.',
  },
  {
    n: 'pollo y morrón',
    it: [
      ['pollo-desmenuzado', 80],
      ['morron', 40],
      ['cebolla', 30],
    ],
    p: 'Salteás el morrón y la cebolla en tiras y los mezclás con el pollo; sazonás con pimentón.',
  },
]
export function generarEmpanadas({ az, armador, cuantas }) {
  let hechas = 0
  for (const e of mezclar(az, EMP)) {
    if (hechas >= cuantas) break
    const ok = armador.agregar({
      nombre: `Empanadas de ${e.n} al horno`,
      minutos: 50,
      porciones: 1,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [250, 800],
      prot: 10,
      ingredientes: [['tapa-empanada', 3 * 28], ...e.it, ['aceite', 3]],
      pasos: [
        e.p,
        'Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.',
        'Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.',
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

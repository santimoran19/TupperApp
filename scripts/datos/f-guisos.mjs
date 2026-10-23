// Guisos, estofados y platos de olla: se hacen para 4 porciones.
import { mezclar } from './motor.mjs'

// Legumbres o base del guiso. it: por porción
const BASES = [
  {
    n: 'lentejas',
    it: [['lentejas-hervidas', 130]],
    paso: 'Si usás lentejas secas, las remojás 1 hora y las hervís 25 minutos antes de empezar; con lentejas ya hervidas, las sumás al final.',
    fin: 'las lentejas hervidas',
  },
  {
    n: 'porotos',
    it: [['porotos-hervidos', 130]],
    paso: 'Si usás porotos secos, los remojás toda la noche y los hervís 50 minutos; con porotos ya hervidos, los sumás al final.',
    fin: 'los porotos hervidos',
  },
  {
    n: 'garbanzos',
    it: [['garbanzos-hervidos', 130]],
    paso: 'Si usás garbanzos secos, los remojás toda la noche y los hervís 1 hora; con garbanzos ya hervidos, los sumás al final.',
    fin: 'los garbanzos hervidos',
  },
  {
    n: 'porotos negros',
    it: [['porotos-negros-hervidos', 130]],
    paso: 'Si usás porotos negros secos, los remojás toda la noche y los hervís 1 hora; con porotos ya hervidos, los sumás al final.',
    fin: 'los porotos negros hervidos',
  },
  {
    n: 'alubias',
    it: [['alubias', 130]],
    paso: 'Si usás alubias secas, las remojás toda la noche y las hervís 50 minutos; con alubias ya hervidas, las sumás al final.',
    fin: 'las alubias hervidas',
  },
]
const CARNES = [
  {
    n: 'carne',
    it: [['carne-guiso', 120]],
    paso: 'Cortás la carne en cubos y la sellás en la olla con el aceite hasta que dore, 5 minutos.',
    tiempo: 60,
  },
  {
    n: 'pollo',
    it: [['pata-muslo', 150]],
    paso: 'Sellás la pata muslo en la olla con el aceite 4 minutos por lado, hasta que dore. Después la sacás y la desmenuzás o la dejás entera.',
    tiempo: 40,
  },
  { n: 'chorizo', it: [['chorizo', 50]], paso: 'Cortás el chorizo en rodajas y lo dorás en la olla con el aceite 4 minutos.', tiempo: 30 },
  {
    n: 'cerdo',
    it: [['bondiola-cerdo', 120]],
    paso: 'Cortás la bondiola en cubos y la sellás en la olla con el aceite hasta que dore, 5 minutos.',
    tiempo: 55,
  },
  {
    n: 'panceta y jamón',
    it: [
      ['panceta', 30],
      ['jamon-cocido', 40],
    ],
    paso: 'Cortás la panceta en tiras y el jamón en cubitos y los dorás en la olla con el aceite 4 minutos.',
    tiempo: 30,
  },
  {
    n: 'carne picada',
    it: [['carne-picada-magra', 100]],
    paso: 'Desgranás la carne picada en la olla caliente con el aceite hasta que cambie de color, 5 minutos.',
    tiempo: 30,
  },
  {
    n: 'verduras',
    it: [
      ['calabaza', 100],
      ['batata', 80],
    ],
    paso: 'Cortás la calabaza y la batata en cubos grandes (sin carne: van a ser las que le den cuerpo).',
    tiempo: 30,
  },
]
const VERDURAS = [
  {
    n: 'zanahoria y papa',
    it: [
      ['zanahoria', 50],
      ['papa', 100],
      ['cebolla', 50],
    ],
    paso: 'Sumás la cebolla picada, la zanahoria en rodajas y la papa en cubos.',
  },
  {
    n: 'morrón y zapallo',
    it: [
      ['morron', 60],
      ['zapallo-anco', 100],
      ['cebolla', 50],
    ],
    paso: 'Sumás la cebolla picada, el morrón en tiras y el zapallo en cubos.',
  },
  {
    n: 'espinaca y tomate',
    it: [
      ['espinaca', 60],
      ['tomate-triturado', 70],
      ['cebolla', 50],
    ],
    paso: 'Sumás la cebolla picada y el tomate triturado; la espinaca va al final.',
  },
  {
    n: 'calabaza y choclo',
    it: [
      ['calabaza', 100],
      ['choclo', 60],
      ['cebolla', 50],
    ],
    paso: 'Sumás la cebolla picada, la calabaza en cubos y el choclo.',
  },
  {
    n: 'batata y puerro',
    it: [
      ['batata', 100],
      ['puerro', 60],
      ['cebolla', 30],
    ],
    paso: 'Sumás el puerro en rodajas, la cebolla picada y la batata en cubos.',
  },
  {
    n: 'zapallitos y morrón',
    it: [
      ['zapallito', 100],
      ['morron', 60],
      ['cebolla', 50],
    ],
    paso: 'Sumás la cebolla picada, el morrón en tiras y los zapallitos en cubos (al final, para que no se deshagan).',
  },
  {
    n: 'hinojo y zanahoria',
    it: [
      ['hinojo', 80],
      ['zanahoria', 60],
      ['cebolla', 50],
    ],
    paso: 'Sumás la cebolla picada, el hinojo en láminas y la zanahoria en rodajas.',
  },
]

export function generarGuisos({ az, armador, cuantas }) {
  const combos = []
  for (const b of BASES) for (const c of CARNES) for (const v of VERDURAS) combos.push([b, c, v])
  let hechas = 0
  for (const [b, c, v] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const conCarne = c.n !== 'verduras'
    const nombre = conCarne ? `Guiso de ${b.n} con ${c.n}, ${v.n}` : `Guiso de ${b.n} con ${v.n}, calabaza y batata`
    const ok = armador.agregar({
      nombre,
      minutos: 25 + c.tiempo / 2,
      porciones: 4,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [330, 780],
      prot: 17,
      ingredientes: [...b.it, ...c.it, ...v.it, ['aceite', 8], ['ajo', 5], ['caldo-liquido', 250], ['tomate-triturado', 40]],
      pasos: [
        c.paso,
        v.paso + ' Sumás el ajo picado, el tomate triturado, sal, pimienta, pimentón y comino y mezclás 2 minutos.',
        `Cubrís con el caldo, tapás y cocinás a fuego bajo ${c.tiempo} minutos (hasta que ${conCarne ? 'la carne esté tierna' : 'todo esté tierno'}). ${b.paso}`,
        `Sumás ${b.fin} y cocinás 10 minutos más, hasta que el guiso espese. Corregís la sal y servís caliente. Rinde 4 porciones y mejora de un día para el otro.`,
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

// Platos de olla con nombre propio
const ESPECIALES = [
  {
    n: 'Chili con carne y porotos negros',
    min: 50,
    it: [
      ['carne-picada-magra', 110],
      ['porotos-negros-hervidos', 100],
      ['tomate-triturado', 100],
      ['cebolla', 50],
      ['morron', 40],
      ['ajo', 5],
      ['aceite', 7],
    ],
    p: [
      'Dorás la cebolla, el morrón y el ajo con el aceite. Sumás la carne y la desgranás 6 minutos.',
      'Agregás el tomate, los porotos, sal, comino, pimentón ahumado y ají molido, y cocinás tapado 30 minutos a fuego bajo.',
      'Servís con arroz blanco o con tortillas y una cucharada de yogur.',
    ],
  },
  {
    n: 'Estofado de carne con papas y zanahoria',
    min: 90,
    it: [
      ['carne-guiso', 140],
      ['papa', 120],
      ['zanahoria', 60],
      ['cebolla', 50],
      ['tomate-triturado', 60],
      ['aceite', 7],
      ['caldo-liquido', 200],
    ],
    p: [
      'Sellás la carne en cubos con el aceite hasta que dore y la retirás.',
      'Sofreís la cebolla, sumás el tomate, la carne y el caldo, y cocinás tapado 45 minutos.',
      'Agregás las papas y las zanahorias en trozos y cocinás 25 minutos más. Servís con perejil.',
    ],
  },
  {
    n: 'Cazuela de pollo con calabaza y choclo',
    min: 60,
    it: [
      ['pata-muslo', 150],
      ['calabaza', 120],
      ['choclo', 60],
      ['cebolla', 50],
      ['morron', 40],
      ['aceite', 7],
      ['caldo-liquido', 200],
    ],
    p: [
      'Sellás las patas muslo con el aceite hasta que doren y las retirás.',
      'Sofreís la cebolla y el morrón, sumás la calabaza en cubos, el choclo y el caldo, y devolvés el pollo.',
      'Tapás y cocinás 35 minutos a fuego bajo. Sal, pimienta y orégano.',
    ],
  },
  {
    n: 'Carbonada criolla',
    min: 75,
    it: [
      ['carne-guiso', 100],
      ['calabaza', 100],
      ['papa', 80],
      ['choclo', 50],
      ['cebolla', 50],
      ['tomate-triturado', 60],
      ['durazno', 30],
      ['aceite', 7],
      ['caldo-liquido', 150],
    ],
    p: [
      'Sellás la carne en cubos con el aceite y la retirás. Sofreís la cebolla y sumás el tomate.',
      'Devolvés la carne, sumás el caldo y cocinás 35 minutos. Agregás la calabaza, la papa y el choclo y cocinás 20 minutos más.',
      'Al final sumás el durazno en cubitos, 5 minutos. Se sirve a veces dentro de un zapallo asado.',
    ],
  },
  {
    n: 'Pollo al curry con arroz',
    min: 40,
    it: [
      ['pechuga-cruda', 130],
      ['cebolla', 50],
      ['leche-coco', 60],
      ['tomate-triturado', 50],
      ['jengibre', 5],
      ['ajo', 4],
      ['aceite', 7],
      ['arroz', 60],
    ],
    p: [
      'Hervís el arroz.',
      'Dorás la cebolla, el ajo y el jengibre rallado con el aceite; sumás una cucharada de curry en polvo y mezclás 30 segundos.',
      'Agregás el pollo en cubos, el tomate y la leche de coco y cocinás tapado 15 minutos. Servís sobre el arroz con cilantro.',
    ],
  },
  {
    n: 'Garbanzos con espinaca y huevo',
    min: 30,
    it: [
      ['garbanzos-hervidos', 130],
      ['espinaca', 100],
      ['huevo', 50],
      ['cebolla', 40],
      ['ajo', 4],
      ['tomate-triturado', 60],
      ['aceite', 6],
    ],
    p: [
      'Sofreís la cebolla y el ajo con el aceite, el comino y el pimentón.',
      'Sumás el tomate y los garbanzos 8 minutos; agregás la espinaca y cocinás 3 minutos más.',
      'Hacés huecos y rompés los huevos adentro; tapás 4 minutos, hasta que la clara esté firme.',
    ],
  },
  {
    n: 'Ragú de lentejas y verduras',
    min: 40,
    it: [
      ['lentejas-hervidas', 140],
      ['zanahoria', 50],
      ['apio', 30],
      ['cebolla', 50],
      ['tomate-triturado', 100],
      ['aceite', 6],
      ['ajo', 4],
    ],
    p: [
      'Cortás la cebolla, el apio y la zanahoria en cubitos y los sofreís con el aceite y el ajo 8 minutos.',
      'Sumás el tomate, las lentejas, laurel, sal y pimienta y cocinás 20 minutos.',
      'Servís sobre arroz, polenta o con un huevo.',
    ],
  },
  {
    n: 'Pastel de papa con carne',
    min: 70,
    it: [
      ['carne-picada-magra', 100],
      ['papa', 220],
      ['cebolla', 50],
      ['aceitunas', 15],
      ['huevo', 25],
      ['leche', 40],
      ['aceite', 6],
      ['queso-rallado', 10],
    ],
    p: [
      'Hervís las papas, las hacés puré con la leche, sal y nuez moscada.',
      'Dorás la cebolla con el aceite, sumás la carne con comino y pimentón, 10 minutos. Agregás aceitunas y huevo duro picado.',
      'Armás una capa de puré, el relleno y otra de puré; queso rallado arriba. Gratinás 20 minutos a 200 °C.',
    ],
  },
  {
    n: 'Osobuco braseado con puré de calabaza',
    min: 120,
    it: [
      ['osobuco', 200],
      ['cebolla', 50],
      ['zanahoria', 50],
      ['tomate-triturado', 80],
      ['pure-calabaza', 150],
      ['aceite', 7],
      ['caldo-liquido', 150],
    ],
    p: [
      'Sellás el osobuco enharinado con el aceite hasta que dore y lo retirás.',
      'Sofreís la cebolla y la zanahoria, sumás el tomate y el caldo, devolvés la carne y cocinás tapado a fuego bajo 90 minutos, hasta que se despegue del hueso.',
      'Servís con el puré de calabaza tibio.',
    ],
  },
  {
    n: 'Albóndigas de lentejas en salsa',
    min: 45,
    it: [
      ['lentejas-hervidas', 130],
      ['avena', 25],
      ['cebolla', 40],
      ['ajo', 4],
      ['tomate-triturado', 120],
      ['huevo', 25],
      ['aceite', 6],
    ],
    p: [
      'Procesás las lentejas con la cebolla rallada, el ajo, la avena, el huevo, sal y comino; armás bolitas.',
      'Las dorás con la mitad del aceite 6 minutos.',
      'Hacés la salsa con el resto del aceite y el tomate triturado 10 minutos, sumás las albóndigas y cocinás 8 minutos tapado.',
    ],
  },
]

export function generarEspeciales({ armador }) {
  let hechas = 0
  for (const e of ESPECIALES) {
    const ok = armador.agregar({
      nombre: e.n,
      minutos: e.min,
      porciones: 4,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [250, 800],
      prot: 12,
      ingredientes: e.it,
      pasos: [...e.p, 'Rinde 4 porciones.'],
    })
    if (ok) hechas++
  }
  return hechas
}

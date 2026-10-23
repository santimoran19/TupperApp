// Carnes, pollo y pescados al horno con una guarnición y un aderezo o marinada.
import { mezclar } from './motor.mjs'

// grupo: 'ave' | 'carne' | 'cerdo' | 'pescado'. coc: cómo se hornea. g: gramos crudos por porción
const PROTEINAS = [
  {
    s: 'pata-muslo',
    n: 'Pata muslo',
    g: 180,
    grupo: 'ave',
    coc: 'Horno a 200 °C, 45–50 minutos, dando vuelta las piezas a la mitad, hasta que la piel esté dorada y los jugos salgan claros.',
    min: 55,
  },
  {
    s: 'pechuga-cruda',
    n: 'Pechuga de pollo',
    g: 170,
    grupo: 'ave',
    coc: 'Horno a 200 °C, 22–25 minutos, hasta que no quede nada rosado por dentro (74 °C). La dejás reposar 5 minutos antes de cortar.',
    min: 30,
  },
  {
    s: 'pechuga-pavo',
    n: 'Pechuga de pavo',
    g: 170,
    grupo: 'ave',
    coc: 'Horno a 190 °C, 25–30 minutos, tapada con papel aluminio los primeros 15. La dejás reposar 5 minutos antes de cortar.',
    min: 35,
  },
  {
    s: 'bondiola-cerdo',
    n: 'Bondiola',
    g: 170,
    grupo: 'cerdo',
    coc: 'Horno a 160 °C, 1 hora 30 minutos, tapada con papel aluminio y destapada los últimos 20 minutos, hasta que esté tierna.',
    min: 100,
  },
  {
    s: 'carre-cerdo',
    n: 'Carré de cerdo',
    g: 170,
    grupo: 'cerdo',
    coc: 'Horno a 180 °C, 35–40 minutos, hasta que esté dorado por fuera y apenas rosado por dentro. Reposo de 5 minutos.',
    min: 45,
  },
  {
    s: 'lomo-cerdo',
    n: 'Solomillo de cerdo',
    g: 160,
    grupo: 'cerdo',
    coc: 'Sellás 2 minutos por lado y lo llevás a horno a 200 °C, 15–18 minutos. Reposo de 5 minutos antes de cortar en medallones.',
    min: 30,
  },
  {
    s: 'peceto',
    n: 'Peceto',
    g: 170,
    grupo: 'carne',
    coc: 'Sellás por todos lados en una sartén caliente y horneás a 180 °C, 40–45 minutos (hasta 65 °C por dentro). Reposo de 10 minutos antes de cortar en láminas finas.',
    min: 60,
  },
  {
    s: 'cuadril',
    n: 'Cuadril',
    g: 180,
    grupo: 'carne',
    coc: 'Sellás por todos lados y horneás a 190 °C, 30–35 minutos para que quede jugoso. Reposo de 10 minutos antes de cortar.',
    min: 50,
  },
  {
    s: 'vacio',
    n: 'Vacío',
    g: 200,
    grupo: 'carne',
    coc: 'Horno a 170 °C, 1 hora 30 minutos, tapado con papel aluminio, y 15 minutos más sin tapar para dorar. Reposo de 10 minutos.',
    min: 110,
  },
  {
    s: 'matambre-cerdo',
    n: 'Matambre de cerdo',
    g: 190,
    grupo: 'cerdo',
    coc: 'Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.',
    min: 75,
  },
  {
    s: 'cordero',
    n: 'Pierna de cordero',
    g: 190,
    grupo: 'carne',
    coc: 'Horno a 170 °C, 1 hora 15 minutos, tapada la primera hora. Reposo de 10 minutos antes de cortar.',
    min: 90,
  },
  {
    s: 'conejo',
    n: 'Conejo',
    g: 200,
    grupo: 'carne',
    coc: 'Horno a 180 °C, 50–60 minutos, dándolo vuelta una vez, hasta que esté tierno y dorado.',
    min: 70,
  },
  {
    s: 'merluza-cruda',
    n: 'Merluza',
    g: 170,
    grupo: 'pescado',
    coc: 'Horno a 200 °C, 12–15 minutos, hasta que la carne se desarme en lascas.',
    min: 25,
  },
  {
    s: 'salmon',
    n: 'Salmón',
    g: 160,
    grupo: 'pescado',
    coc: 'Horno a 200 °C, 12–14 minutos, hasta que esté apenas rosado en el centro.',
    min: 25,
  },
  {
    s: 'trucha',
    n: 'Trucha',
    g: 170,
    grupo: 'pescado',
    coc: 'Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.',
    min: 28,
  },
  { s: 'abadejo', n: 'Abadejo', g: 170, grupo: 'pescado', coc: 'Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.', min: 25 },
  {
    s: 'lenguado',
    n: 'Lenguado',
    g: 170,
    grupo: 'pescado',
    coc: 'Horno a 200 °C, 10–12 minutos, hasta que se desarme en lascas.',
    min: 22,
  },
  {
    s: 'bacalao',
    n: 'Bacalao fresco',
    g: 170,
    grupo: 'pescado',
    coc: 'Horno a 200 °C, 14–16 minutos, hasta que se desarme en lascas.',
    min: 26,
  },
  {
    s: 'surubi',
    n: 'Surubí',
    g: 170,
    grupo: 'pescado',
    coc: 'Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.',
    min: 28,
  },
  { s: 'brotola', n: 'Brótola', g: 170, grupo: 'pescado', coc: 'Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.', min: 25 },
  {
    s: 'pejerrey',
    n: 'Pejerrey',
    g: 160,
    grupo: 'pescado',
    coc: 'Horno a 200 °C, 10–12 minutos, hasta que estén dorados y se separen de la espina.',
    min: 22,
  },
  {
    s: 'atun-fresco',
    n: 'Atún fresco',
    g: 150,
    grupo: 'pescado',
    coc: 'Horno a 220 °C, 6–8 minutos, para que quede rosado en el centro.',
    min: 20,
  },
]

const GUARNICIONES = [
  {
    n: 'papas y cebolla',
    it: [
      ['papa', 200],
      ['cebolla', 50],
      ['aceite', 8],
    ],
    paso: 'Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en la placa alrededor.',
    pesado: true,
  },
  {
    n: 'batatas',
    it: [
      ['batata', 200],
      ['aceite', 8],
    ],
    paso: 'Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa alrededor.',
    pesado: true,
  },
  {
    n: 'calabaza',
    it: [
      ['calabaza', 220],
      ['aceite', 8],
    ],
    paso: 'Cortás la calabaza en cubos grandes, con cáscara, las mezclás con el aceite, sal y romero y las ponés en la placa alrededor.',
    pesado: true,
  },
  {
    n: 'verduras asadas',
    it: [
      ['zanahoria', 60],
      ['morron', 60],
      ['cebolla', 50],
      ['zapallito', 80],
      ['aceite', 8],
    ],
    paso: 'Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en la placa alrededor.',
  },
  {
    n: 'papines y ajo',
    it: [
      ['papines', 220],
      ['ajo', 8],
      ['aceite', 8],
    ],
    paso: 'Cortás los papines al medio, los mezclás con el aceite, el ajo con piel, sal y romero y los ponés en la placa alrededor.',
    pesado: true,
  },
  {
    n: 'coliflor gratinada',
    it: [
      ['coliflor', 180],
      ['queso-rallado', 15],
      ['aceite', 6],
    ],
    paso: 'Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.',
  },
  {
    n: 'brócoli y ajo',
    it: [
      ['brocoli', 170],
      ['ajo', 6],
      ['aceite', 8],
    ],
    paso: 'Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.',
  },
  {
    n: 'puré de papa',
    it: [
      ['papa', 220],
      ['leche', 40],
      ['manteca', 5],
    ],
    paso: 'Hervís las papas peladas 20 minutos, las hacés puré con la leche, la manteca, sal y nuez moscada.',
    pesado: true,
  },
  {
    n: 'ensalada mixta',
    it: [
      ['lechuga', 70],
      ['tomate', 110],
      ['cebolla-morada', 20],
      ['aceite-oliva', 8],
      ['limon-exprimido', 10],
    ],
    paso: 'Lavás la lechuga, cortás el tomate en gajos y la cebolla en plumas finas; aderezás al servir con el aceite de oliva, el limón y sal.',
  },
  { n: 'arroz blanco', it: [['arroz', 60]], paso: 'Hervís el arroz en abundante agua con sal 12 minutos y lo escurrís.', pesado: true },
  {
    n: 'berenjenas y tomate',
    it: [
      ['berenjena', 120],
      ['tomate', 110],
      ['aceite', 8],
    ],
    paso: 'Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en la placa alrededor.',
  },
  {
    n: 'zapallitos grillados',
    it: [
      ['zapallito', 160],
      ['aceite', 6],
    ],
    paso: 'Cortás los zapallitos a lo largo en tiras, los pincelás con el aceite, salás y los grillás en sartén o en la placa los últimos 12 minutos.',
  },
  {
    n: 'ensalada de rúcula y tomates cherry',
    it: [
      ['rucula', 50],
      ['tomate-cherry', 100],
      ['parmesano', 10],
      ['aceite-oliva', 8],
    ],
    paso: 'Mezclás la rúcula con los cherry cortados al medio, lascas de parmesano, el aceite de oliva y sal.',
  },
  {
    n: 'espárragos',
    it: [
      ['esparragos', 150],
      ['aceite', 6],
      ['limon-exprimido', 8],
    ],
    paso: 'Cortás la base dura de los espárragos, los mezclás con el aceite y sal y los asás en la placa los últimos 10 minutos; terminás con limón.',
  },
  {
    n: 'ensalada de repollo y zanahoria',
    it: [
      ['repollo', 90],
      ['zanahoria', 60],
      ['aceite-oliva', 8],
      ['limon-exprimido', 10],
    ],
    paso: 'Cortás el repollo muy fino, rallás la zanahoria y aderezás con el aceite de oliva, el limón y sal.',
  },
  {
    n: 'puré de calabaza',
    it: [
      ['calabaza', 220],
      ['manteca', 5],
    ],
    paso: 'Hervís la calabaza pelada en cubos 15 minutos y la hacés puré con la manteca, sal y nuez moscada.',
    pesado: true,
  },
]

const MARINADAS = [
  {
    n: 'limón y romero',
    it: [
      ['limon-exprimido', 20],
      ['aceite-oliva', 8],
      ['ajo', 4],
    ],
    paso: 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).',
  },
  {
    n: 'mostaza y miel',
    it: [
      ['mostaza', 12],
      ['miel', 8],
      ['aceite', 6],
    ],
    paso: 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.',
  },
  {
    n: 'ajo y perejil',
    it: [
      ['ajo', 8],
      ['perejil', 6],
      ['aceite-oliva', 10],
    ],
    paso: 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.',
  },
  {
    n: 'pimentón ahumado',
    it: [
      ['aceite', 8],
      ['ajo', 4],
    ],
    paso: 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.',
  },
  {
    n: 'soja y jengibre',
    it: [
      ['salsa-soja', 15],
      ['jengibre', 5],
      ['miel', 5],
    ],
    paso: 'Mezclás la soja con el jengibre rallado y la miel, y marinás la pieza 30 minutos.',
  },
  {
    n: 'tomate y orégano',
    it: [
      ['tomate-triturado', 50],
      ['ajo', 4],
      ['aceite', 6],
    ],
    paso: 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.',
  },
  {
    n: 'queso gratinado',
    it: [
      ['queso-cremoso', 30],
      ['aceite', 6],
    ],
    paso: 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.',
  },
  {
    n: 'yogur y especias',
    it: [
      ['yogur-natural', 50],
      ['ajo', 4],
      ['limon-exprimido', 8],
    ],
    paso: 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.',
  },
]

export function generarHorno({ az, armador, cuantas }) {
  const combos = []
  for (const p of PROTEINAS)
    for (const g of GUARNICIONES)
      for (const m of MARINADAS) {
        // La carne grande de cocción larga con una guarnición que se hace sola no se mezcla con pescado (tiempos distintos)
        if (p.grupo === 'pescado' && g.n.includes('puré')) continue
        combos.push([p, g, m])
      }
  let hechas = 0
  for (const [p, g, m] of mezclar(az, combos)) {
    if (hechas >= cuantas) break
    const nombre = `${p.n} al horno con ${g.n} (${m.n})`
    const larga = p.min > 60
    const ok = armador.agregar({
      nombre,
      minutos: p.min + 10,
      comidas: ['almuerzo', 'cena'],
      portable: true,
      kcal: [330, 850],
      prot: 18,
      ingredientes: [[p.s, p.g], ...g.it, ...m.it],
      pasos: [
        m.paso,
        g.paso.replace(
          'en la placa alrededor',
          larga
            ? 'en una placa aparte, que van al horno los últimos 40 minutos'
            : p.grupo === 'pescado'
              ? 'en la placa, que entra 15 minutos antes que el pescado'
              : 'en la placa alrededor',
        ),
        p.coc,
        `Servís la ${p.grupo === 'pescado' ? 'porción de pescado' : 'porción'} con ${g.n} y los jugos de la placa por encima.`,
      ],
    })
    if (ok) hechas++
  }
  return hechas
}

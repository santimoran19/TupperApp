// Lo nuevo de la 1.24 que se puede probar sin pantalla: vencimientos y niveles de la despensa, la silueta, el mapa de
// músculos, el plato y el tupper 3D, y las fotos.
import { describe, expect, test, vi } from 'vitest'
import {
  compararVencimiento,
  consejoDe,
  diasParaVencer,
  distribucion,
  estadoVencimiento,
  fechaAlSumar,
  nivelDeStock,
  referenciasDeCompra,
  vencimientoDe,
  vencimientoDeReceta,
  vencimientosPorBase,
} from '../../src/lib/despensa.js'
import { curva, escalaDe, grasaConPeso, grasaEstimada, medidas, nombreDeGrasa, partes, pesoMinimo } from '../../src/lib/silueta.js'
import {
  CLAVES_MUSCULARES,
  intensidad,
  musculosTipicos,
  musculosValidos,
  textoDeTrabajo,
  trabajoPorMusculo,
  zonas,
} from '../../src/lib/musculos.js'
import { COLOR_COMIDA, colorLiquido, formaDe, partesDeReceta, tipoDePlato, trozosDeReceta, trozosDelDia } from '../../src/lib/plato.js'
import { piezasPorAlimento } from '../../src/components/tres/tupper.js'
import { repartir, sectores } from '../../src/components/tres/plato.js'

vi.mock('../../src/lib/supabase', () => ({ supabase: {} }))
const { recorteCuadrado, rutaNueva } = await import('../../src/lib/fotos.js')

const HOY = '2026-10-21'

describe('vencimientos', () => {
  test('días que faltan, contando días de calendario', () => {
    expect(diasParaVencer('2026-10-21', HOY)).toBe(0)
    expect(diasParaVencer('2026-10-22', HOY)).toBe(1)
    expect(diasParaVencer('2026-10-20', HOY)).toBe(-1)
    // Cruza el cambio de mes y de año
    expect(diasParaVencer('2027-01-01', '2026-12-31')).toBe(1)
    expect(diasParaVencer(null, HOY)).toBeNull()
  })

  test('cómo se ve cada fecha', () => {
    const e = (f) => estadoVencimiento(f, HOY)
    expect(e('2026-10-19')).toEqual({ dias: -2, nivel: 'vencido', texto: 'Venció hace 2 días' })
    expect(e('2026-10-20').texto).toBe('Venció ayer')
    expect(e('2026-10-21')).toMatchObject({ nivel: 'urgente', texto: 'Vence hoy' })
    expect(e('2026-10-22')).toMatchObject({ nivel: 'urgente', texto: 'Vence mañana' })
    expect(e('2026-10-24')).toMatchObject({ nivel: 'urgente', texto: 'Vence en 3 días' })
    expect(e('2026-10-25')).toMatchObject({ nivel: 'pronto', texto: 'Consumir pronto · 4 días' })
    expect(e('2026-10-28')).toMatchObject({ nivel: 'pronto' })
    expect(e('2026-10-29')).toMatchObject({ nivel: 'bien', texto: 'Bien · 8 días' })
    expect(e('2027-02-21').texto).toBe('Bien · 4 meses')
    expect(e('2029-01-01').texto).toBe('Bien · 2 años')
    expect(e(null)).toBeNull()
  })

  test('lo agotado no tiene fecha (aunque el teléfono todavía no se haya enterado)', () => {
    expect(vencimientoDe({ qty: 3, expires_on: '2026-10-30' })).toBe('2026-10-30')
    expect(vencimientoDe({ qty: 0, expires_on: '2026-10-30' })).toBeNull()
    expect(vencimientoDe({ qty: 3 })).toBeNull()
  })

  test('ordenar: lo que vence antes primero y sin fecha al final', () => {
    expect(['2026-11-01', null, '2026-10-22', null].sort(compararVencimiento)).toEqual(['2026-10-22', '2026-11-01', null, null])
  })

  test('al comprar más queda la fecha que vence antes', () => {
    expect(fechaAlSumar('2026-10-25', '2026-11-10')).toBe('2026-10-25')
    expect(fechaAlSumar('2026-11-10', '2026-10-25')).toBe('2026-10-25')
    expect(fechaAlSumar(null, '2026-10-25')).toBe('2026-10-25')
    expect(fechaAlSumar('2026-10-25', null)).toBe('2026-10-25')
    expect(fechaAlSumar(null, null)).toBeNull()
  })

  test('un producto que vale por otro avisa en las recetas del alimento base', () => {
    const leche = { id: 'leche', name: 'Leche' }
    const laSerenisima = { id: 'ls', name: 'Leche La Serenísima', same_as: 'leche' }
    const porId = new Map([leche, laSerenisima].map((a) => [a.id, a]))
    const base = (a) => (a.same_as ? porId.get(a.same_as) : a)
    const stock = [
      { food_id: 'ls', qty: 1000, expires_on: '2026-10-24' },
      { food_id: 'leche', qty: 500, expires_on: '2026-10-28' },
    ]
    const m = vencimientosPorBase(stock, porId, base)
    expect(m.get('leche')).toBe('2026-10-24')
    expect(vencimientoDeReceta([{ food_id: 'arroz' }, { food_id: 'leche' }], m)).toBe('2026-10-24')
    expect(vencimientoDeReceta([{ food_id: 'arroz' }], m)).toBeNull()
  })
})

describe('cuánto queda', () => {
  test('la referencia es la compra más grande de las últimas cinco de ese alimento', () => {
    const c = (food_id, qty, date) => ({ food_id, qty, date })
    const r = referenciasDeCompra([
      c('a', 500, '2026-10-01'),
      c('a', 1000, '2026-09-01'),
      c('a', 200, '2026-10-02'),
      c('a', 200, '2026-10-03'),
      c('a', 200, '2026-10-04'),
      c('a', 200, '2026-10-05'),
      c('b', 6, '2026-10-01'),
      c(null, 3, '2026-10-01'),
    ])
    // La de 1000 es la sexta más reciente: ya no cuenta
    expect(r.get('a')).toBe(500)
    expect(r.get('b')).toBe(6)
    expect(r.has(null)).toBe(false)
  })
  test('el nivel, con "bajo" a partir de un cuarto', () => {
    expect(nivelDeStock(250, 1000)).toEqual({ pct: 25, bajo: true })
    expect(nivelDeStock(300, 1000)).toEqual({ pct: 30, bajo: false })
    expect(nivelDeStock(1500, 1000)).toEqual({ pct: 100, bajo: false })
    expect(nivelDeStock(100, null)).toBeNull()
  })
})

describe('consejos y distribución', () => {
  test('primero por el nombre y si no por la categoría', () => {
    expect(consejoDe({ name: 'Espinacas baby', category: 'Verduras' })).toMatch(/papel absorbente/)
    expect(consejoDe({ name: 'Pechuga de pollo', category: 'Carnes y huevos' })).toMatch(/freezala/)
    expect(consejoDe({ name: 'Brócoli', category: 'Verduras' })).toMatch(/cajón/)
    expect(consejoDe({ name: 'Algo', category: 'Inventada' })).toBeNull()
  })
  test('cuántos alimentos con stock hay de cada categoría; lo chico va a "Otros"', () => {
    const f = (category, qty = 1) => ({ a: { category }, qty })
    const d = distribucion([f('A'), f('A'), f('B'), f('C'), f('D'), f('E'), f('F'), f('G', 0)], { maximo: 3 })
    expect(d.total).toBe(7)
    expect(d.partes.map((p) => p.categoria)).toEqual(['A', 'B', 'C', 'Otros'])
    expect(d.partes.find((p) => p.categoria === 'Otros').cantidad).toBe(3)
    expect(d.partes[0].pct).toBe(29)
  })
})

describe('silueta', () => {
  test('% de grasa estimado con Deurenberg', () => {
    // Hombre de 30 años, 80 kg y 180 cm: IMC 24,7 → 1,2 × 24,7 + 0,23 × 30 − 10,8 − 5,4 = 20,3
    expect(grasaEstimada({ peso: 80, altura: 180, edad: 30, sexo: 'm' })).toBeCloseTo(20.3, 1)
    // Mujer de 30 años, 60 kg y 165 cm: IMC 22,0 → 26,4 + 6,9 − 5,4 = 27,9
    expect(grasaEstimada({ peso: 60, altura: 165, edad: 30, sexo: 'f' })).toBeCloseTo(27.9, 1)
    expect(grasaEstimada({ peso: 80, altura: null, edad: 30 })).toBeNull()
    // Nunca por debajo de la grasa esencial
    expect(grasaEstimada({ peso: 45, altura: 190, edad: 19, sexo: 'm' })).toBe(5)
  })
  test('con otro peso: al bajar, 3/4 de lo bajado es grasa', () => {
    // 80 kg con 25 %: 20 kg de grasa. A 72 kg: 20 − 6 = 14 kg → 19,4 %
    expect(grasaConPeso({ peso: 80, grasa: 25, sexo: 'm' }, 72)).toBeCloseTo(19.4, 1)
    // Al subir, 60 %: a 90 kg → 26 kg → 28,9 %
    expect(grasaConPeso({ peso: 80, grasa: 25, sexo: 'm' }, 90)).toBeCloseTo(28.9, 1)
    expect(grasaConPeso({ peso: 80, grasa: 25, sexo: 'm' }, 80)).toBe(25)
  })
  test('el peso más bajo que se ofrece deja la grasa esencial', () => {
    const datos = { peso: 80, grasa: 25, sexo: 'm' }
    const min = pesoMinimo(datos)
    expect(grasaConPeso(datos, min)).toBeGreaterThanOrEqual(5)
    expect(grasaConPeso(datos, min - 3)).toBe(5)
  })
  test('nombres de los rangos', () => {
    expect(nombreDeGrasa(12, 'm')).toBe('Atlética')
    expect(nombreDeGrasa(22, 'm')).toBe('Promedio')
    expect(nombreDeGrasa(22, 'f')).toBe('En forma')
    expect(nombreDeGrasa(35, 'f')).toBe('Alta')
  })
  test('más grasa, más ancha la cintura; la escala sigue la masa magra', () => {
    expect(medidas(35, 'm').cintura).toBeGreaterThan(medidas(15, 'm').cintura + 8)
    expect(medidas(25, 'f').cadera).toBeGreaterThan(medidas(25, 'm').cadera)
    expect(escalaDe({ peso: 90, grasa: 12, altura: 175, sexo: 'm' })).toBeGreaterThan(1)
    expect(escalaDe({ peso: 55, grasa: 20, altura: 180, sexo: 'm' })).toBeLessThan(1)
    expect(escalaDe({ peso: 80, grasa: null, altura: 175 })).toBe(1)
  })
  test('las partes son trazos SVG válidos y simétricos', () => {
    const p = partes(medidas(20, 'm'))
    for (const d of [p.torso, p.cuello, ...p.brazos, ...p.piernas]) expect(d).toMatch(/^M[\d.-]+,[\d.-]+(C[\d., -]+)+Z$/)
    const xs = (d) => [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => Number(m[1]))
    // El brazo derecho es el espejo del izquierdo (x → 200 − x)
    const izq = xs(p.brazos[0])
    const der = xs(p.brazos[1])
    expect(izq.length).toBe(der.length)
    izq.forEach((x, i) => expect(x + der[i]).toBeCloseTo(200, 0))
    expect(curva([[0, 0]])).toBe('')
  })
})

describe('mapa de músculos', () => {
  const ejercicios = new Map([
    ['e1', { grupo: 'pecho' }],
    ['e2', { grupo: 'cuerpo_completo' }],
  ])
  test('series de gimnasio (sin calentamiento) y entrenamientos marcados', () => {
    const m = trabajoPorMusculo({
      series: [
        { exercise_id: 'e1' },
        { exercise_id: 'e1' },
        { exercise_id: 'e1', warmup: true },
        { exercise_id: 'e2' },
        { exercise_id: 'x' },
      ],
      entrenamientos: [{ muscles: ['pecho', 'abdomen', 'abdomen'] }, { muscles: null }, { muscles: ['cuerpo_completo'] }],
      ejerciciosPorId: ejercicios,
    })
    expect(m.get('pecho')).toEqual({ series: 3, sesiones: 2 })
    expect(m.get('abdomen')).toEqual({ series: 1, sesiones: 2 })
    expect(m.get('gluteos')).toEqual({ series: 1, sesiones: 1 })
    expect([...m.keys()]).toEqual(CLAVES_MUSCULARES)
  })
  test('intensidad y texto', () => {
    expect(intensidad({ series: 0, sesiones: 0 })).toBe(0)
    expect(intensidad({ series: 4, sesiones: 1 })).toBeCloseTo(0.7)
    expect(intensidad({ series: 30 })).toBe(1)
    expect(intensidad(undefined)).toBe(0)
    expect(textoDeTrabajo({ series: 1, sesiones: 2 })).toBe('1 serie · 2 entrenamientos')
    expect(textoDeTrabajo({})).toBe('Sin entrenar')
  })
  test('lo que se guarda: solo grupos conocidos, sin repetir', () => {
    expect(musculosValidos(['abdomen', 'pecho', 'nariz', 'pecho', 'cuerpo_completo'])).toEqual(['pecho', 'abdomen', 'cuerpo_completo'])
    expect(musculosValidos('pecho')).toEqual([])
  })
  test('los típicos de una actividad', () => {
    expect(musculosTipicos({ metrica: 'correr', category: 'cardio' })).toContain('cuadriceps')
    expect(musculosTipicos({ metrica: 'general', category: 'agua' })).toContain('espalda')
    expect(musculosTipicos({ metrica: 'general', category: 'otro' })).toEqual([])
    expect(musculosTipicos(null)).toEqual([])
  })
  test('cada grupo tiene su zona en alguna de las dos vistas', () => {
    for (const sexo of ['m', 'f']) {
      const frente = zonas('frente', sexo)
      const espalda = zonas('espalda', sexo)
      for (const g of CLAVES_MUSCULARES) expect((frente[g] || []).length + (espalda[g] || []).length, `${sexo} ${g}`).toBeGreaterThan(0)
      for (const trazos of [...Object.values(frente), ...Object.values(espalda)]) for (const d of trazos) expect(d).toMatch(/^M.*Z$/)
    }
  })
})

describe('plato y tupper 3D', () => {
  const porId = new Map(
    [
      { id: 'arroz', name: 'Arroz', unit: 'g', category: 'Pastas y arroz' },
      { id: 'pollo', name: 'Pata muslo', unit: 'u', unit_grams: 150, category: 'Carnes y huevos' },
      { id: 'tomate', name: 'Tomate', unit: 'u', category: 'Verduras' },
      { id: 'aceite', name: 'Aceite', unit: 'ml', category: 'Despensa' },
      { id: 'sal', name: 'Sal', unit: 'g', category: 'Despensa' },
      { id: 'agua', name: 'Agua', unit: 'ml', category: 'Bebidas' },
    ].map((a) => [a.id, a]),
  )
  test('de qué está hecha una receta, en gramos, sin aceite ni bebidas; lo chico va a "Otros"', () => {
    const p = partesDeReceta(
      [
        { food_id: 'arroz', qty: 70 },
        { food_id: 'pollo', qty: 1 },
        { food_id: 'tomate', qty: 1 },
        { food_id: 'aceite', qty: 15 },
        { food_id: 'sal', qty: 5 },
        { food_id: 'agua', qty: 500 },
      ],
      porId,
    )
    expect(p.map((x) => [x.nombre, x.gramos])).toEqual([
      ['Carnes y huevos', 150],
      ['Verduras', 100],
      ['Pastas y arroz', 70],
      ['Otros', 5],
    ])
    expect(p[0].color).toBe(COLOR_COMIDA['Carnes y huevos'])
    expect(partesDeReceta([], porId)).toEqual([])
  })
  test('cada ingrediente tiene la forma y el color que le tocan por su nombre (y por su categoría si no dice nada)', () => {
    expect(formaDe('Arroz blanco', 'Pastas y arroz').forma).toBe('grano')
    expect(formaDe('Tomate', 'Verduras').forma).toBe('rodaja')
    expect(formaDe('Brócoli', 'Verduras').forma).toBe('floret')
    expect(formaDe('Leche descremada', 'Lácteos').forma).toBe('gota')
    expect(formaDe('Algo raro', 'Carnes y huevos').forma).toBe('trozo')
    expect(formaDe('Algo raro', 'No existe').forma).toBe('cubo')
    // Palabras que contienen a otras: ni el tomate es mate, ni el chocolate cola, ni el dulce de leche leche
    expect(formaDe('Tomate perita', 'Verduras').forma).toBe('rodaja')
    expect(formaDe('Salsa de tomate', 'Salsas y aderezos').forma).toBe('mancha')
    expect(formaDe('Dulce de leche', 'Despensa').forma).toBe('mancha')
    expect(formaDe('Chocolate amargo', 'Snacks y dulces').forma).toBe('cubito')
    expect(formaDe('Paté de hígado', 'Enlatados').forma).toBe('migaja')
    expect(formaDe('Papaya', 'Frutas').forma).toBe('cubo')
    expect(formaDe('Té verde', 'Bebidas').forma).toBe('gota')
    expect(formaDe('Mate cebado', 'Bebidas').forma).toBe('gota')
  })
  test('los ingredientes visibles de una receta, en gramos, sin aceite ni sal ni agua', () => {
    const t = trozosDeReceta(
      [
        { food_id: 'arroz', qty: 70 },
        { food_id: 'pollo', qty: 1 },
        { food_id: 'aceite', qty: 15 },
        { food_id: 'sal', qty: 5 },
        { food_id: 'agua', qty: 500 },
      ],
      porId,
    )
    expect(t.map((x) => [x.nombre, x.gramos, x.forma])).toEqual([
      ['Pata muslo', 150, 'trozo'],
      ['Arroz', 70, 'grano'],
    ])
  })
  test('en qué se sirve cada cosa: vaso, taza, sopa, sándwich, tostadas, pizza, postre, bowl o plato', () => {
    const t = (nombre) => tipoDePlato(nombre, [])
    expect(t('Licuado de banana y frutilla')).toBe('vaso')
    expect(t('Café con leche')).toBe('taza')
    expect(t('Té con limón')).toBe('taza')
    expect(t('Sopa de zapallo')).toBe('sopa')
    expect(t('Lentejas con arroz')).toBe('sopa')
    expect(t('Tostado de jamón y queso con café con leche')).toBe('sandwich')
    expect(t('Tostadas con palta y huevo')).toBe('tostadas')
    expect(t('Café con tostadas')).toBe('tostadas')
    expect(t('Pizza de muzzarella')).toBe('disco')
    expect(t('Tarta de verduras')).toBe('disco')
    expect(t('Yogur con granola y fruta')).toBe('postre')
    expect(t('Arroz con leche')).toBe('postre')
    expect(t('Ensalada de rúcula')).toBe('bowl')
    expect(t('Milanesa con puré')).toBe('plato')
    // Si casi todo es líquido, es un vaso aunque el nombre no lo diga
    expect(
      tipoDePlato('Algo', [
        { forma: 'gota', gramos: 90 },
        { forma: 'cubo', gramos: 10 },
      ]),
    ).toBe('vaso')
  })
  test('el color de una bebida mezcla el de sus ingredientes según los gramos', () => {
    expect(colorLiquido([{ nombre: 'Leche', gramos: 200 }], 'vaso')).toBe('#f6efe0')
    const mezcla = colorLiquido(
      [
        { nombre: 'Leche', gramos: 200 },
        { nombre: 'Frutilla', gramos: 100 },
      ],
      'vaso',
    )
    expect(mezcla).not.toBe('#f6efe0')
    expect(colorLiquido([], 'sopa')).toBe('#e0b86a')
  })
  test('la comida del día: kcal por alimento, de más a menos, sumando los repetidos', () => {
    const por = new Map([
      ['pan', { id: 'pan', name: 'Pan francés', unit: 'g', category: 'Panadería', kcal: 270 }],
      ['hue', { id: 'hue', name: 'Huevo', unit: 'u', unit_grams: 50, category: 'Carnes y huevos', kcal: 150 }],
    ])
    const t = trozosDelDia(
      [
        { food_id: 'pan', qty: 100 },
        { food_id: 'pan', qty: 100 },
        { food_id: 'hue', qty: 2 },
        { food_id: 'nada', qty: 5 },
      ],
      por,
    )
    expect(t.map((x) => [x.id, x.kcal])).toEqual([
      ['pan', 540],
      ['hue', 150],
    ])
  })
  test('las piezas del tupper: una cada tantas kcal, todas juntas llenan al llegar al objetivo', () => {
    const q = piezasPorAlimento(
      [
        { id: 'a', kcal: 1000 },
        { id: 'b', kcal: 1000 },
        { id: 'c', kcal: 1 },
        { id: 'd', kcal: 8 },
      ],
      2000,
    )
    expect(q.get('a')).toBe(q.get('b'))
    expect(q.get('a') + q.get('b')).toBeGreaterThan(250)
    expect(q.get('a') + q.get('b')).toBeLessThan(350)
    expect(q.get('c')).toBe(0) // no aporta casi nada
    expect(q.get('d')).toBe(1) // aporta poco pero se ve
  })
  test('el plato reparte las piezas según los gramos (con tope y sin líquidos) y da un gajo a cada ingrediente', () => {
    const g = repartir(
      [
        { nombre: 'Pollo', forma: 'trozo', gramos: 300, color: '#d8a566' },
        { nombre: 'Arroz', forma: 'grano', gramos: 150, color: '#f3ead2' },
        { nombre: 'Salsa', forma: 'mancha', gramos: 5, color: '#c43d2a' },
        { nombre: 'Leche', forma: 'gota', gramos: 200, color: '#f7f1e6' },
      ],
      100,
    )
    expect(g.map((x) => x.nombre)).toEqual(['Pollo', 'Arroz', 'Salsa'])
    expect(g[0].cantidad).toBeGreaterThan(g[1].cantidad)
    expect(g[2].cantidad).toBe(1)
    const s = sectores(g)
    expect(s).toHaveLength(3)
    expect(s[0].hasta).toBeCloseTo(s[1].desde)
    expect(s[2].hasta - s[0].desde).toBeCloseTo(Math.PI * 2)
    expect(s.every((x) => x.hasta - x.desde >= 0.4)).toBe(true)
    expect(repartir([], 50)).toEqual([])
  })
})

describe('fotos', () => {
  test('recorte cuadrado del centro', () => {
    expect(recorteCuadrado(4000, 3000)).toEqual({ sx: 500, sy: 0, lado: 3000 })
    expect(recorteCuadrado(1080, 1920)).toEqual({ sx: 0, sy: 420, lado: 1080 })
  })
  test('rutas nuevas: en la carpeta de la persona, con código al azar y la extensión del formato', () => {
    const uid = '00000000-0000-0000-0000-00000000000a'
    const a = rutaNueva(uid, 'image/webp')
    const b = rutaNueva(uid, 'image/jpeg')
    expect(a).toMatch(new RegExp(`^u/${uid}/[0-9a-f]{24}\\.webp$`))
    expect(b).toMatch(/\.jpg$/)
    expect(a).not.toBe(rutaNueva(uid, 'image/webp'))
    // Las dos pasan la regla de la base (actualizacion-19.sql)
    const regla = /^(base\/[a-z0-9-]{1,80}|u\/[0-9a-f-]{36}\/[a-z0-9-]{1,80})\.(webp|jpg)$/
    expect(a).toMatch(regla)
    expect(b).toMatch(regla)
  })
})

// Las calorías de un entrenamiento (F-19, fase 2): cada método con cuentas que se pueden hacer a mano.
import { describe, expect, test } from 'vitest'
import {
  agruparActividades,
  calcularEntrenamiento,
  ejercicioDelDia,
  filtrarPorNombre,
  kcalDeSubirEnBici,
  kcalPorMinutoConPulso,
  margenDe,
  metsDeBici,
  metsDeEsfuerzo,
  paraBuscar,
  resumenDeEjercicio,
  vo2Caminando,
  vo2Corriendo,
} from '../../src/lib/ejercicio.js'

const persona = { peso: 70, edad: 30, sexo: 'm', tmb: 1650 } // el basal reparte 1,146 kcal por minuto
const correr = { metrica: 'correr', category: 'cardio', mets_suave: 7, mets_medio: 9.8, mets_fuerte: 12.3 }
const caminar = { metrica: 'caminar', category: 'cardio', mets_suave: 2.8, mets_medio: 4.3, mets_fuerte: 5 }
const bici = { metrica: 'bici', category: 'bici', mets_suave: 4, mets_medio: 6.8, mets_fuerte: 10 }
const yoga = { metrica: 'general', category: 'mente_cuerpo', mets_suave: 2, mets_medio: 2.5, mets_fuerte: 4 }
const pesas = { metrica: 'general', category: 'fuerza', mets_suave: 3, mets_medio: 3.5, mets_fuerte: 6 }

describe('METs según el esfuerzo', () => {
  test('suave hasta 2, medio en 5, fuerte desde 8, y se interpola entre medio', () => {
    expect(metsDeEsfuerzo(correr, 1)).toBe(7)
    expect(metsDeEsfuerzo(correr, 2)).toBe(7)
    expect(metsDeEsfuerzo(correr, 5)).toBe(9.8)
    expect(metsDeEsfuerzo(correr, 8)).toBe(12.3)
    expect(metsDeEsfuerzo(correr, 10)).toBe(12.3)
    expect(metsDeEsfuerzo(correr, 3.5)).toBeCloseTo(8.4, 6)
    expect(metsDeEsfuerzo(correr, 6.5)).toBeCloseTo(11.05, 6)
  })
  test('sin esfuerzo se toma el medio; el valor raro no rompe', () => {
    expect(metsDeEsfuerzo(correr, undefined)).toBe(9.8)
    expect(metsDeEsfuerzo(correr, '')).toBe(9.8)
    expect(metsDeEsfuerzo(correr, 99)).toBe(12.3)
    expect(metsDeEsfuerzo(correr, -4)).toBe(7)
  })
})

describe('método 4: METs, duración y esfuerzo', () => {
  test('yoga 1 hora con esfuerzo medio: 2,5 × 70 kg × 1 h menos el basal de la hora', () => {
    const r = calcularEntrenamiento(yoga, { minutos: 60, esfuerzo: 5 }, persona)
    expect(r.metodo).toBe('mets')
    expect(r.bruto).toBe(175)
    expect(r.basal).toBe(69)
    expect(r.kcal).toBe(106)
  })
  test('más esfuerzo, más calorías; más minutos, más calorías', () => {
    const suave = calcularEntrenamiento(correr, { minutos: 30, esfuerzo: 2 }, persona).kcal
    const fuerte = calcularEntrenamiento(correr, { minutos: 30, esfuerzo: 8 }, persona).kcal
    const largo = calcularEntrenamiento(correr, { minutos: 60, esfuerzo: 2 }, persona).kcal
    expect(fuerte).toBeGreaterThan(suave)
    expect(largo).toBeGreaterThan(suave)
  })
  test('las pesas tienen un rango más amplio (±40 %) que el resto (±30 %)', () => {
    const a = calcularEntrenamiento(pesas, { minutos: 60 }, persona)
    const b = calcularEntrenamiento(yoga, { minutos: 60 }, persona)
    expect(a.margen).toBe(0.4)
    expect(b.margen).toBe(0.3)
    // (el rango sale del valor sin redondear: puede diferir en 1 del redondeado)
    expect(Math.abs(a.rango[0] - a.kcal * 0.6)).toBeLessThanOrEqual(1)
    expect(Math.abs(a.rango[1] - a.kcal * 1.4)).toBeLessThanOrEqual(1)
  })
  test('nunca da negativo (una actividad muy suave y corta)', () => {
    const r = calcularEntrenamiento({ ...yoga, mets_suave: 1, mets_medio: 1, mets_fuerte: 1 }, { minutos: 10 }, persona)
    expect(r.kcal).toBe(0)
  })
})

describe('método 3: distancia y ritmo (ACSM)', () => {
  test('ecuaciones: correr a 10 km/h y caminar a 5 km/h', () => {
    expect(vo2Corriendo(166.67, 0)).toBeCloseTo(36.83, 2)
    expect(vo2Caminando(83.33, 0)).toBeCloseTo(11.83, 2)
    // la pendiente suma: correr con 5 % de subida
    expect(vo2Corriendo(166.67, 0.05)).toBeCloseTo(36.83 + 0.9 * 166.67 * 0.05, 2)
  })
  test('correr 10 km en una hora: unas 705 kcal netas', () => {
    const r = calcularEntrenamiento(correr, { minutos: 60, distancia: 10, esfuerzo: 2 }, persona)
    expect(r.metodo).toBe('distancia')
    expect(r.bruto).toBe(774)
    expect(r.kcal).toBe(705)
  })
  test('caminar 5 km en una hora: unas 180 kcal netas', () => {
    const r = calcularEntrenamiento(caminar, { minutos: 60, distancia: 5 }, persona)
    expect(r.metodo).toBe('distancia')
    expect(r.kcal).toBe(180)
  })
  test('subir cuesta: el desnivel suma', () => {
    const plano = calcularEntrenamiento(caminar, { minutos: 60, distancia: 5 }, persona).kcal
    const cuesta = calcularEntrenamiento(caminar, { minutos: 60, distancia: 5, desnivel: 300 }, persona).kcal
    expect(cuesta).toBeGreaterThan(plano + 100)
  })
  test('la velocidad manda: "correr" a paso de caminata y "caminar" a paso de carrera', () => {
    const lento = calcularEntrenamiento(correr, { minutos: 60, distancia: 4 }, persona)
    expect(lento.aviso).toMatch(/caminata/)
    expect(lento.bruto).toBe(Math.round(((0.1 * (4000 / 60) + 3.5) * 70 * 60 * 5) / 1000))
    const rapido = calcularEntrenamiento(caminar, { minutos: 30, distancia: 5 }, persona)
    expect(rapido.aviso).toMatch(/carrera/)
  })
  test('un ritmo imposible o un desnivel absurdo se rechazan', () => {
    expect(calcularEntrenamiento(correr, { minutos: 10, distancia: 20 }, persona).error).toMatch(/ritmo/)
    expect(calcularEntrenamiento(correr, { minutos: 600, distancia: 1 }, persona).error).toMatch(/ritmo/)
    expect(calcularEntrenamiento(caminar, { minutos: 60, distancia: 2, desnivel: 900 }, persona).error).toMatch(/desnivel/)
  })
  test('una actividad que no usa distancia ignora ese dato y va por METs', () => {
    expect(calcularEntrenamiento(yoga, { minutos: 60, distancia: 10 }, persona).metodo).toBe('mets')
  })
})

describe('bicicleta', () => {
  test('METs según la velocidad, interpolados', () => {
    expect(metsDeBici(5)).toBe(3.5)
    expect(metsDeBici(14)).toBe(4)
    expect(metsDeBici(17.6)).toBe(6.8)
    expect(metsDeBici(20.8)).toBe(8)
    expect(metsDeBici(11)).toBeCloseTo(3.75, 6)
    expect(metsDeBici(40)).toBe(15.8)
  })
  test('30 km en una hora: 30 km/h', () => {
    const r = calcularEntrenamiento(bici, { minutos: 60, distancia: 30 }, persona)
    expect(r.metodo).toBe('distancia')
    expect(r.bruto).toBe(Math.round(metsDeBici(30) * 70))
  })
  test('la subida en bici suma la energía de levantar a la persona y la bici', () => {
    expect(kcalDeSubirEnBici(70, 1000)).toBeGreaterThan(700)
    expect(kcalDeSubirEnBici(70, 1000)).toBeLessThan(800)
    const plano = calcularEntrenamiento(bici, { minutos: 120, distancia: 40 }, persona).kcal
    const cuesta = calcularEntrenamiento(bici, { minutos: 120, distancia: 40, desnivel: 800 }, persona).kcal
    expect(cuesta - plano).toBeGreaterThan(550)
  })
  test('una velocidad imposible se rechaza', () => {
    expect(calcularEntrenamiento(bici, { minutos: 10, distancia: 50 }, persona).error).toMatch(/velocidad/)
  })
})

describe('método 2: pulso (Keytel)', () => {
  test('kcal por minuto con el pulso, hombre y mujer', () => {
    expect(kcalPorMinutoConPulso({ sexo: 'm', edad: 30, peso: 70, pulso: 140 })).toBeCloseTo(12.714, 2)
    expect(kcalPorMinutoConPulso({ sexo: 'f', edad: 30, peso: 60, pulso: 140 })).toBeCloseTo(8.808, 2)
    expect(kcalPorMinutoConPulso({ sexo: 'f', edad: 30, peso: 60, pulso: 40 })).toBe(0)
  })
  test('una hora con 140 pulsaciones promedio: unas 694 kcal netas', () => {
    const r = calcularEntrenamiento(yoga, { minutos: 60, pulso: 140, esfuerzo: 2 }, persona)
    expect(r.metodo).toBe('pulso')
    expect(r.kcal).toBe(694)
    expect(r.margen).toBe(0.2)
  })
  test('con menos de 90 pulsaciones la fórmula no sirve: se pasa al esfuerzo', () => {
    expect(calcularEntrenamiento(yoga, { minutos: 60, pulso: 80 }, persona).metodo).toBe('mets')
  })
  test('el pulso gana a la distancia', () => {
    expect(calcularEntrenamiento(correr, { minutos: 60, distancia: 10, pulso: 150 }, persona).metodo).toBe('pulso')
  })
})

describe('método 1: reloj', () => {
  test('gana a todo lo demás y se le resta el basal de esos minutos', () => {
    const r = calcularEntrenamiento(correr, { minutos: 60, reloj: 800, pulso: 150, distancia: 10 }, persona)
    expect(r.metodo).toBe('reloj')
    expect(r.bruto).toBe(800)
    expect(r.kcal).toBe(731)
    expect(r.margen).toBe(0.3)
  })
  test('las calorías activas del reloj ya no incluyen el reposo: valen tal cual como netas', () => {
    const totales = calcularEntrenamiento(correr, { minutos: 60, reloj: 800 }, persona)
    const activas = calcularEntrenamiento(correr, { minutos: 60, reloj: 800, relojActivas: true }, persona)
    expect(totales.kcal).toBe(731) // 800 − 69 de reposo
    expect(activas.kcal).toBe(800)
    expect(activas.metodo).toBe('reloj')
    expect(activas.bruto).toBe(869) // lo activo más el reposo de esa hora
    expect(activas.rango).toEqual([560, 1040])
  })
  test('las calorías activas se rechazan con el mismo tope por minuto que las totales', () => {
    expect(calcularEntrenamiento(correr, { minutos: 10, reloj: 900, relojActivas: true }, persona).error).toMatch(/reloj/)
  })
  test('"activas" sin calorías del reloj no cambia nada', () => {
    const sin = calcularEntrenamiento(yoga, { minutos: 60 }, persona)
    const con = calcularEntrenamiento(yoga, { minutos: 60, relojActivas: true }, persona)
    expect(con).toEqual(sin)
  })
  test('calorías imposibles para esa duración se rechazan', () => {
    expect(calcularEntrenamiento(correr, { minutos: 10, reloj: 900 }, persona).error).toMatch(/reloj/)
    expect(calcularEntrenamiento(correr, { minutos: 600, reloj: 12000 }, persona).error).toMatch(/reloj/)
  })
  test('un reloj en cero o vacío se ignora', () => {
    expect(calcularEntrenamiento(yoga, { minutos: 60, reloj: 0 }, persona).metodo).toBe('mets')
    expect(calcularEntrenamiento(yoga, { minutos: 60, reloj: '' }, persona).metodo).toBe('mets')
  })
  test('sin la actividad (se borró) igual se puede guardar con el reloj', () => {
    expect(calcularEntrenamiento(null, { minutos: 60, reloj: 500 }, persona).metodo).toBe('reloj')
    expect(calcularEntrenamiento(null, { minutos: 60 }, persona).error).toMatch(/actividad/)
  })
})

describe('datos que faltan', () => {
  test('duración inválida', () => {
    for (const minutos of [0, -5, 'abc', null, 2000]) expect(calcularEntrenamiento(yoga, { minutos }, persona).error).toMatch(/duración/)
  })
  test('sin datos del perfil', () => {
    expect(calcularEntrenamiento(yoga, { minutos: 30 }, { peso: 0, edad: 30, tmb: 1600 }).error).toMatch(/perfil/)
    expect(calcularEntrenamiento(yoga, { minutos: 30 }, null).error).toMatch(/perfil/)
  })
  test('sin basal (tmb 0) igual calcula, sin descontar nada', () => {
    const r = calcularEntrenamiento(yoga, { minutos: 60, esfuerzo: 5 }, { ...persona, tmb: 0 })
    expect(r.kcal).toBe(175)
  })
})

describe('lo del día', () => {
  const lista = [
    { fecha: '2026-10-19', kcal: 300, metodo: 'pulso', duration_min: 40 },
    { fecha: '2026-10-19', kcal: 200, metodo: 'mets', duration_min: 30 },
    { fecha: '2026-10-18', kcal: 500, metodo: 'reloj', duration_min: 60 },
    { fecha: '2026-10-20', kcal: 100, metodo: 'mets', duration_min: 20 },
  ]
  test('suma los del día con su rango', () => {
    const d = ejercicioDelDia(lista, '2026-10-19')
    expect(d).toMatchObject({ kcal: 500, minutos: 70, cantidad: 2 })
    expect(d.rango).toEqual([Math.round(300 * 0.8 + 200 * 0.7), Math.round(300 * 1.2 + 200 * 1.3)])
    expect(ejercicioDelDia(lista, '2026-10-01')).toMatchObject({ kcal: 0, minutos: 0, cantidad: 0, rango: [0, 0] })
    expect(ejercicioDelDia(undefined, '2026-10-01').kcal).toBe(0)
  })
  test('resumen de varios días', () => {
    expect(resumenDeEjercicio(lista, '2026-10-18', '2026-10-20')).toEqual({ cantidad: 4, minutos: 150, kcal: 1100, dias: 3 })
    expect(resumenDeEjercicio(lista, '2026-10-19', '2026-10-19')).toEqual({ cantidad: 2, minutos: 70, kcal: 500, dias: 1 })
  })
  test('márgenes', () => {
    expect(margenDe('pulso')).toBe(0.2)
    expect(margenDe('inventado')).toBe(0.3)
    expect(margenDe('pulso', 'fuerza')).toBe(0.4)
  })
})

test('las actividades se agrupan por categoría: las propias primero', () => {
  const tipos = [
    { id: 1, name: 'Zumba', category: 'baile', owner: null },
    { id: 2, name: 'Aquagym', category: 'agua', owner: null },
    { id: 3, name: 'Baile loco', category: 'baile', owner: 'yo' },
    { id: 4, name: 'Salsa', category: 'baile', owner: null },
  ]
  const g = agruparActividades(tipos)
  expect(g.map((x) => x.clave)).toEqual(['agua', 'baile'])
  expect(g[1].lista.map((t) => t.name)).toEqual(['Baile loco', 'Salsa', 'Zumba'])
})

describe('buscar por nombre', () => {
  const lista = [{ name: 'Pádel' }, { name: 'Correr (trote suave)' }, { name: 'Natación' }]
  test('sin tildes ni mayúsculas', () => {
    expect(filtrarPorNombre(lista, 'padel')).toEqual([{ name: 'Pádel' }])
    expect(filtrarPorNombre(lista, 'NATACION')).toEqual([{ name: 'Natación' }])
  })
  test('todas las palabras tienen que estar, en cualquier orden', () => {
    expect(filtrarPorNombre(lista, 'suave correr')).toEqual([{ name: 'Correr (trote suave)' }])
    expect(filtrarPorNombre(lista, 'correr natacion')).toEqual([])
  })
  test('sin texto devuelve todo', () => {
    expect(filtrarPorNombre(lista, '  ')).toBe(lista)
    expect(paraBuscar(null)).toBe('')
  })
})

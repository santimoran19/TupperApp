// Anotar y corregir entrenamientos (src/store/acciones/ejercicio.js): lo que se manda a la cola de cambios.
// Lo importante: al corregir una sesión de gimnasio sin tocar las series se mandan las que ya tiene, porque la base reemplaza
// las series por las que llegan y sin eso se borrarían.
import { describe, expect, test, vi } from 'vitest'

vi.mock('../../src/lib/supabase', () => ({ supabase: {} }))

const { accionesDeEjercicio } = await import('../../src/store/acciones/ejercicio.js')

const PERFIL = {
  gasto_activo: true,
  sex: 'm',
  birth_date: '1990-05-10',
  height_cm: 180,
  weight_kg: 80,
}
const ID = '10000000-0000-0000-0000-000000000001'
const SERIES = [
  { workout_id: ID, orden: 1, exercise_id: 'e1', set_no: 1, reps: 8, weight_kg: 60, rpe: 8, warmup: false, user_id: 'u', id: 's1' },
  { workout_id: ID, orden: 1, exercise_id: 'e1', set_no: 2, reps: 8, weight_kg: 62.5, rpe: null, warmup: false, user_id: 'u', id: 's2' },
  { workout_id: 'otro', orden: 1, exercise_id: 'e2', set_no: 1, reps: 10, weight_kg: 20, rpe: null, warmup: true, user_id: 'u', id: 's3' },
]
const TIPO = { id: 't1', name: 'Correr', metrica: 'correr', mets_suave: 7, mets_medio: 9.8, mets_fuerte: 12.3 }

// Un "k" mínimo: la acción es la función misma y operar anota lo que se mandaría a la cola
function armar(perfil = PERFIL) {
  const operaciones = []
  const k = {
    uid: 'u',
    accion: (_nombre, fn) => fn,
    operar: (tipo, datos) => {
      operaciones.push({ tipo, datos })
      return datos
    },
    ver: () => ({ e: { perfil, medidas: [], series: SERIES } }),
    setE: () => {},
  }
  return { acciones: accionesDeEjercicio(k), operaciones }
}

const base = (extra = {}) => ({ fecha: '2026-10-19', tipo: TIPO, minutos: 40, distancia: 6, ...extra })

describe('guardarEntrenamiento', () => {
  test('un entrenamiento nuevo sale con sus calorías, el método y el peso de ese día', () => {
    const { acciones, operaciones } = armar()
    acciones.guardarEntrenamiento(base())
    expect(operaciones).toHaveLength(1)
    const { tipo, datos, id, series } = { ...operaciones[0].datos, tipo: operaciones[0].tipo }
    expect(tipo).toBe('guardarEntreno')
    expect(id).toBeTruthy()
    expect(datos).toMatchObject({ fecha: '2026-10-19', type_id: 't1', name: 'Correr', duration_min: 40, distance_km: 6, peso_kg: 80 })
    expect(datos.kcal).toBeGreaterThan(300)
    expect(datos.metodo).toBeTruthy()
    expect(series).toBeNull()
  })

  test('corregir una sesión sin mandar series vuelve a mandar las que ya tiene (solo las suyas)', () => {
    const { acciones, operaciones } = armar()
    acciones.guardarEntrenamiento(base({ id: ID, minutos: 55 }))
    const { series, id, datos } = operaciones[0].datos
    expect(id).toBe(ID)
    expect(datos.duration_min).toBe(55)
    expect(series).toEqual([
      { orden: 1, exercise_id: 'e1', set_no: 1, reps: 8, weight_kg: 60, rpe: 8, warmup: false },
      { orden: 1, exercise_id: 'e1', set_no: 2, reps: 8, weight_kg: 62.5, rpe: null, warmup: false },
    ])
  })

  test('si vienen series nuevas se mandan esas, no las viejas', () => {
    const { acciones, operaciones } = armar()
    const nuevas = [{ orden: 1, exercise_id: 'e1', set_no: 1, reps: 5, weight_kg: 100, rpe: null, warmup: false }]
    acciones.guardarEntrenamiento(base({ id: ID, series: nuevas }))
    expect(operaciones[0].datos.series).toEqual(nuevas)
  })

  test('guarda si las calorías del reloj eran activas, y solo si hay calorías del reloj', () => {
    const { acciones, operaciones } = armar()
    acciones.guardarEntrenamiento(base({ reloj: '420', relojActivas: true }))
    acciones.guardarEntrenamiento(base({ reloj: '420' }))
    acciones.guardarEntrenamiento(base({ relojActivas: true }))
    const [activas, totales, sinReloj] = operaciones.map((o) => o.datos.datos)
    expect(activas).toMatchObject({ kcal_watch: 420, watch_activas: true, kcal: 420, metodo: 'reloj' })
    expect(totales).toMatchObject({ kcal_watch: 420, watch_activas: false, metodo: 'reloj' })
    expect(totales.kcal).toBeLessThan(420)
    expect(sinReloj).toMatchObject({ kcal_watch: null, watch_activas: false })
  })

  test('un entrenamiento que no es de gimnasio no manda series', () => {
    const { acciones, operaciones } = armar()
    acciones.guardarEntrenamiento(base({ id: '10000000-0000-0000-0000-000000000099' }))
    expect(operaciones[0].datos.series).toBeNull()
  })

  test('el nombre que puso la persona gana sobre el de la actividad', () => {
    const { acciones, operaciones } = armar()
    acciones.guardarEntrenamiento(base({ nombre: '  Trote con Lola ' }))
    expect(operaciones[0].datos.datos.name).toBe('Trote con Lola')
  })

  test('sin el cálculo prendido, sin actividad o sin los datos del perfil no guarda nada', () => {
    expect(() => armar({ ...PERFIL, gasto_activo: false }).acciones.guardarEntrenamiento(base())).toThrow(/activá/i)
    expect(() => armar().acciones.guardarEntrenamiento(base({ tipo: null }))).toThrow(/actividad/i)
    expect(() => armar({ ...PERFIL, height_cm: null }).acciones.guardarEntrenamiento(base())).toThrow(/perfil/i)
  })

  test('una duración imposible se rechaza antes de mandar nada', () => {
    const { acciones, operaciones } = armar()
    expect(() => acciones.guardarEntrenamiento(base({ minutos: 0 }))).toThrow()
    expect(operaciones).toHaveLength(0)
  })
})

describe('borrarEntrenamiento', () => {
  test('manda el borrado con el id', () => {
    const { acciones, operaciones } = armar()
    acciones.borrarEntrenamiento(ID)
    expect(operaciones).toEqual([{ tipo: 'borrarEntreno', datos: { id: ID } }])
  })
})

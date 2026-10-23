// Ayuno y recordatorios (lib/ayuno.js).
import { describe, expect, test } from 'vitest'
import {
  ayunoOlvidado,
  duracionTexto,
  estadoAyuno,
  horaValida,
  leer,
  protocoloDe,
  recordatoriosAhora,
  RECORDATORIOS_INICIAL,
  resumenAyunos,
} from '../../src/lib/ayuno.js'

const H = 3600000

describe('ayuno', () => {
  test('cuenta lo que pasó y lo que falta, y marca cuando se cumple', () => {
    const e = estadoAyuno({ inicio: 0, horas: 16, ahora: 10 * H })
    expect(e.pct).toBeCloseTo(0.625)
    expect(e.restante).toBe(6 * H)
    expect(e.cumplido).toBe(false)
    const f = estadoAyuno({ inicio: 0, horas: 16, ahora: 17.5 * H })
    expect(f).toMatchObject({ cumplido: true, pct: 1, restante: 0, extra: 1.5 * H })
  })
  test('nunca da negativo si el reloj se atrasó', () => {
    expect(estadoAyuno({ inicio: 5 * H, horas: 12, ahora: 4 * H }).pasado).toBe(0)
  })
  test('texto de duración y protocolo por defecto', () => {
    expect(duracionTexto(14 * H + 5 * 60000)).toBe('14 h 05 min')
    expect(duracionTexto(42 * 60000)).toBe('42 min')
    expect(protocoloDe('no-existe').ayuno).toBe(16)
  })
  test('un ayuno de más de 30 horas se considera olvidado', () => {
    expect(ayunoOlvidado(0, 29 * H)).toBe(false)
    expect(ayunoOlvidado(0, 31 * H)).toBe(true)
  })
  test('resumen de la semana: cuántos terminó y cuántos llegaron a la meta', () => {
    const hist = [
      { inicio: 100 * H, fin: 116 * H, horas: 16 },
      { inicio: 130 * H, fin: 140 * H, horas: 16 },
      { inicio: 0, fin: 8 * H, horas: 16 },
    ]
    const r = resumenAyunos(hist, 250 * H, 7)
    expect(r.total).toBe(2)
    expect(r.cumplidos).toBe(1)
    expect(r.promedioH).toBe(13)
  })
})

describe('recordatorios', () => {
  const config = { ...RECORDATORIOS_INICIAL, activo: true }
  const a = (h, m = 0) => new Date(2026, 9, 26, h, m)
  const nombres = { desayuno: 'desayunar', almuerzo: 'almorzar' }

  test('avisa la comida desde su hora hasta 90 minutos después', () => {
    expect(recordatoriosAhora({ config, ahora: a(12, 59), fecha: 'x', nombres })).toEqual([])
    const r = recordatoriosAhora({ config, ahora: a(13, 5), fecha: 'x', nombres })
    expect(r.map((x) => x.id)).toEqual(['comida-almuerzo'])
    expect(r[0].titulo).toBe('Es hora de almorzar')
    expect(recordatoriosAhora({ config, ahora: a(14, 31), fecha: 'x' })).toEqual([])
  })
  test('no avisa si ya la anotó ni si ya avisó', () => {
    expect(recordatoriosAhora({ config, ahora: a(13, 5), fecha: 'x', registradas: new Set(['almuerzo']) })).toEqual([])
    expect(recordatoriosAhora({ config, ahora: a(13, 5), fecha: 'x', yaAvisados: new Set(['x|comida-almuerzo']) })).toEqual([])
  })
  test('apagado no avisa nada, y una comida apagada tampoco', () => {
    expect(recordatoriosAhora({ config: { ...config, activo: false }, ahora: a(13, 5), fecha: 'x' })).toEqual([])
    const sin = { ...config, comidasOn: { ...config.comidasOn, almuerzo: false } }
    expect(recordatoriosAhora({ config: sin, ahora: a(13, 5), fecha: 'x' })).toEqual([])
  })
  test('agua: una vez por franja y solo dentro del horario', () => {
    const c = { ...config, agua: true, aguaCada: 2, aguaDesde: '09:00', aguaHasta: '21:00', comidasOn: {} }
    expect(recordatoriosAhora({ config: c, ahora: a(8, 0), fecha: 'x' })).toEqual([])
    expect(recordatoriosAhora({ config: c, ahora: a(11, 30), fecha: 'x' }).map((x) => x.id)).toEqual(['agua-1'])
    expect(recordatoriosAhora({ config: c, ahora: a(11, 30), fecha: 'x', yaAvisados: new Set(['x|agua-1']) })).toEqual([])
    expect(recordatoriosAhora({ config: c, ahora: a(22, 0), fecha: 'x' })).toEqual([])
  })
  test('hora válida y lectura segura del teléfono', () => {
    expect(horaValida('08:30')).toBe(true)
    expect(horaValida('24:00')).toBe(false)
    expect(horaValida('8:30')).toBe(false)
    expect(leer('clave-que-no-existe', { a: 1 })).toEqual({ a: 1 })
  })
})

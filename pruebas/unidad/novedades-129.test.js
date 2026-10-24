// 1.29: la tendencia del peso y la estimación de la meta (F-10), lo que el asistente propone anotar (IA-06), la receta
// pegada (IA-04) y cómo se cruza con los alimentos de la app.
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { foodsTodos } from '../../scripts/seed-sexta.mjs'
import { estimarMeta, faltaParaMeta, tendencia } from '../../src/lib/peso.js'
import { ingredientesDe } from '../../src/lib/registroIA.js'
import { separarAnotar } from '../../supabase/functions/asistente-ia/logica.ts'
import { interpretarReceta } from '../../supabase/functions/registrar-ia/logica.ts'

const alimentos = foodsTodos.map((f, i) => ({ id: `f${i}`, slug: f[0], name: f[1], unit: f[2], kcal: f[5], unit_grams: f[3] }))
const semanas = (n, desde, paso) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(2026, 8, 1) + i * 7 * 86400000)
    return { f: d.toISOString().slice(0, 10), v: desde + i * paso }
  })

describe('peso: tendencia y meta', () => {
  it('la tendencia es la recta de las medidas, no la diferencia entre dos', () => {
    const puntos = semanas(6, 80, -0.5)
    puntos[2].v += 1.2 // un día con retención de líquido
    const t = tendencia(puntos, puntos[5].f)
    expect(t.n).toBe(6)
    expect(t.kgPorSemana).toBeGreaterThan(-0.6)
    expect(t.kgPorSemana).toBeLessThan(-0.3)
  })
  it('sin suficientes medidas o días, no estima', () => {
    expect(tendencia(semanas(2, 80, -0.5), '2026-09-30')).toBeNull()
    const juntas = [
      { f: '2026-09-01', v: 80 },
      { f: '2026-09-03', v: 79.8 },
      { f: '2026-09-05', v: 79.6 },
    ]
    expect(tendencia(juntas, '2026-09-05')).toBeNull()
  })
  it('estima la fecha si va hacia la meta, para bajar y para subir', () => {
    const tend = { kgPorSemana: -0.5 }
    const e = estimarMeta({ actual: 78, meta: 75, inicio: 80, tend, hoy: '2026-10-01' })
    expect(e).toMatchObject({ estado: 'en_camino', semanas: 6, fecha: '2026-11-12', rapido: false })
    expect(estimarMeta({ actual: 60, meta: 65, inicio: 58, tend: { kgPorSemana: 0.25 }, hoy: '2026-10-01' }).estado).toBe('en_camino')
    expect(estimarMeta({ actual: 78, meta: 75, inicio: 80, tend: { kgPorSemana: 0.3 }, hoy: '2026-10-01' }).estado).toBe('alejandose')
    expect(estimarMeta({ actual: 78, meta: 75, inicio: 80, tend: { kgPorSemana: -0.05 }, hoy: '2026-10-01' }).estado).toBe('quieto')
    expect(estimarMeta({ actual: 78, meta: 75, inicio: 80, tend: null, hoy: '2026-10-01' }).estado).toBe('sin_datos')
    expect(estimarMeta({ actual: 74.8, meta: 75, inicio: 80, tend, hoy: '2026-10-01' }).estado).toBe('llegaste')
    expect(estimarMeta({ actual: 78, meta: null, tend, hoy: '2026-10-01' }).estado).toBe('sin_meta')
    // Más de 1 % del peso por semana: se avisa
    expect(estimarMeta({ actual: 78, meta: 70, inicio: 80, tend: { kgPorSemana: -1.2 }, hoy: '2026-10-01' }).rapido).toBe(true)
  })
  it('"Falta" sirve para subir de peso (antes decía "¡Llegaste!")', () => {
    expect(faltaParaMeta({ actual: 58, meta: 63, inicio: 56 })).toEqual({ llegaste: false, kg: 5, bajar: false })
    expect(faltaParaMeta({ actual: 80.25, meta: 75, inicio: 82 })).toEqual({ llegaste: false, kg: 5.3, bajar: true })
    expect(faltaParaMeta({ actual: 75, meta: 75, inicio: 82 }).llegaste).toBe(true)
    expect(faltaParaMeta({ actual: 75, meta: 0 })).toBeNull()
  })
})

describe('asistente: lo que propone anotar', () => {
  it('saca la línea ANOTAR y deja el texto limpio', () => {
    const r = separarAnotar(
      'Buenísimo, te lo dejo listo.\nANOTAR: {"comida":"cena","items":[{"nombre":"milanesa de pollo","cantidad":1,"unidad":"unidad","gramos":150},{"nombre":"puré","cantidad":200,"unidad":"g"}]}',
    )
    expect(r.texto).toBe('Buenísimo, te lo dejo listo.')
    expect(r.anotar).toEqual({
      comida: 'cena',
      items: [
        { nombre: 'milanesa de pollo', cantidad: 1, unidad: 'unidad', gramos: 150 },
        { nombre: 'puré', cantidad: 200, unidad: 'g', gramos: 200 },
      ],
    })
  })
  it('sin línea, o con una rota, no propone nada (y no muestra el JSON)', () => {
    expect(separarAnotar('Hola')).toEqual({ texto: 'Hola', anotar: null })
    expect(separarAnotar('Listo\nANOTAR: {roto')).toEqual({ texto: 'Listo', anotar: null })
    expect(separarAnotar('Listo ANOTAR: {"items":[]}').anotar).toBeNull()
  })
  it('pone topes y descarta lo raro', () => {
    const r = separarAnotar(
      'x ANOTAR: {"comida":"brunch","items":[{"nombre":"a"},{"nombre":"arroz","cantidad":99999,"unidad":"g"},{"nombre":"pan","cantidad":-1,"unidad":"kilo"}]}',
    )
    expect(r.anotar.comida).toBeNull()
    expect(r.anotar.items).toEqual([
      { nombre: 'arroz', cantidad: 3000, unidad: 'g', gramos: 3000 },
      { nombre: 'pan', cantidad: 1, unidad: 'porcion', gramos: 100 },
    ])
  })
})

describe('receta pegada', () => {
  it('interpreta la receta y le pone topes', () => {
    const r = interpretarReceta(
      '```json\n' +
        JSON.stringify({
          nombre: '  Tarta   de zapallitos ',
          porciones: 4,
          minutos: 9999,
          pasos: ['Rehogar la cebolla.', '', 'Hornear 30 minutos.'],
          items: [
            { nombre: 'zapallito', cantidad: 3, unidad: 'unidad', gramos: 450, confianza: 0.9 },
            { nombre: 'huevo', cantidad: 3, unidad: 'unidad', gramos: 150, confianza: 0.9 },
          ],
        }) +
        '\n```',
    )
    expect(r).toMatchObject({
      nombre: 'Tarta de zapallitos',
      porciones: 4,
      minutos: 600,
      pasos: ['Rehogar la cebolla.', 'Hornear 30 minutos.'],
    })
    expect(r.items).toHaveLength(2)
  })
  it('sin ingredientes no es una receta', () => {
    expect(interpretarReceta('{"nombre":"Nada","items":[]}')).toBeNull()
    expect(interpretarReceta('No entendí')).toBeNull()
  })
  it('los ingredientes se cruzan con los alimentos de la app y lo repetido se suma', () => {
    const item = (nombre, gramos) => ({ nombre, cantidad: gramos, unidad: 'g', gramos, confianza: 0.9 })
    const { ingredientes, sinCruzar } = ingredientesDe([item('arroz', 200), item('arroz', 100), item('xyzzy plugh', 50)], { alimentos })
    expect(sinCruzar.map((i) => i.nombre)).toEqual(['xyzzy plugh'])
    expect(ingredientes).toHaveLength(1)
    expect(Number(ingredientes[0].qty)).toBeGreaterThan(0)
    expect(typeof ingredientes[0].qty).toBe('string')
  })
})

describe('auditoría 1.29', () => {
  it('el micrófono está permitido en el sitio (lo usa "Contale a la IA" con la voz)', () => {
    const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
    const politica = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Permissions-Policy').value
    expect(politica).toContain('microphone=(self)')
    expect(politica).toContain('camera=(self)')
  })
})

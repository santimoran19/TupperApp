// El cuerpo 3D (1.26): la gordura crece con los kilos de grasa (no solo con el %) y la malla se infla más allá del modelo base.
import fs from 'node:fs'
import { describe, expect, test } from 'vitest'
import { inflar, leerCuerpo, mezclar, normales, parametrosCuerpo, pesosDeMezcla } from '../../src/components/tres/cuerpo.js'
import { escalaDe, grasaConPeso } from '../../src/lib/silueta.js'

const modelo = (() => {
  const b = fs.readFileSync(new URL('../../public/modelos/cuerpo.bin', import.meta.url))
  return leerCuerpo(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
})()

// Lo que arma la pantalla para una persona de `altura` que pasa de `peso` a `nuevo` kilos
const conPeso = (sexo, altura, peso, grasa, nuevo) => {
  const datos = { peso, grasa, sexo, altura }
  const g = grasaConPeso(datos, nuevo)
  return parametrosCuerpo({ sexo, grasa: g, escala: escalaDe({ ...datos, peso: nuevo, grasa: g }) })
}

// Cuánto sale la panza hacia adelante (la z máxima entre el 50 y el 62 % de la altura) con esos parámetros
const panza = (p) => {
  const out = new Float32Array(modelo.pos.length)
  const { minY, maxY } = mezclar(modelo, pesosDeMezcla(p), out)
  inflar(modelo, out, p, minY, maxY)
  let z = -Infinity
  for (let i = 0; i < out.length; i += 3) {
    const f = (out[i + 1] - minY) / (maxY - minY)
    if (f > 0.5 && f < 0.62 && Math.abs(out[i]) < 0.2) z = Math.max(z, out[i + 2])
  }
  return z
}

describe('gordura del cuerpo 3D', () => {
  test('72 kilos y 109 kilos ya no dan casi lo mismo, y 150 sigue creciendo', () => {
    const a = conPeso('m', 176, 72, 20, 72)
    const b = conPeso('m', 176, 72, 20, 109)
    const c = conPeso('m', 176, 72, 20, 150)
    expect(b.gordura - a.gordura).toBeGreaterThan(0.8)
    expect(c.gordura).toBeGreaterThan(b.gordura + 0.4)
    expect(panza(b) - panza(a)).toBeGreaterThan(0.04)
    expect(panza(c)).toBeGreaterThan(panza(b) + 0.02)
  })
  test('una persona flaca no se infla, y la mujer acumula distinto que el hombre', () => {
    expect(parametrosCuerpo({ sexo: 'm', grasa: 12, escala: 1 }).gordura).toBeLessThan(0.5)
    const pos = Float32Array.from(modelo.pos)
    expect(inflar(modelo, pos, { sexo: 1, gordura: 0.3 }, -0.8, 0.9)).toBe(false)
    expect(Array.from(pos)).toEqual(Array.from(modelo.pos))
    const h = parametrosCuerpo({ sexo: 'm', grasa: 40, escala: 1.15 })
    const m = parametrosCuerpo({ sexo: 'f', grasa: 40, escala: 1.15 })
    expect(h.gordura).toBeGreaterThan(0)
    expect(m.gordura).toBeGreaterThan(0)
  })
  test('lo que se pide al modelo base sigue dentro de lo que sabe hacer y todo es finito', () => {
    for (const sexo of ['m', 'f'])
      for (const grasa of [5, 20, 35, 50, 65]) {
        const p = parametrosCuerpo({ sexo, grasa, escala: 1.18 })
        expect(p.peso).toBeLessThanOrEqual(1.2)
        const out = new Float32Array(modelo.pos.length)
        const { minY, maxY } = mezclar(modelo, pesosDeMezcla(p), out)
        inflar(modelo, out, p, minY, maxY)
        expect(out.every(Number.isFinite)).toBe(true)
      }
  })
  test('las normales salen unitarias', () => {
    const n = normales(modelo.pos, modelo.indices)
    for (let i = 0; i < 300; i += 3) expect(Math.hypot(n[i], n[i + 1], n[i + 2])).toBeCloseTo(1, 3)
  })
})

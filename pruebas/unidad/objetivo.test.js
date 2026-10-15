// El objetivo sugerido para una cuenta de menos de 18 años (las nuevas ya no entran, pero una anterior puede seguir
// existiendo): sin recorte de calorías, aunque la meta sea bajar de peso.
import { expect, test } from 'vitest'
import { objetivoSugerido } from '../../src/lib/nutricion.js'

const datos = { sexo: 'f', altura: 160, peso: 60, pesoMeta: 50, actividad: 1.375 }

test('menor de 18: el objetivo es lo que gasta; adulta con la misma meta: se recorta', () => {
  const menor = objetivoSugerido({ ...datos, edad: 16 })
  const adulta = objetivoSugerido({ ...datos, edad: 30 })
  expect(menor.menor).toBe(true)
  expect(Math.abs(menor.kcal - menor.gasto)).toBeLessThanOrEqual(25)
  expect(adulta.menor).toBe(false)
  expect(adulta.kcal).toBeLessThan(adulta.gasto)
})

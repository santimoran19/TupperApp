// Atajo para las pruebas de lógica: `eq(resultado, esperado, 'qué se prueba')`
import { expect, test } from 'vitest'

export const eq = (resultado, esperado, nombre) => test(nombre, () => expect(resultado).toEqual(esperado))

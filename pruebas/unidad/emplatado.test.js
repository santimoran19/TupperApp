// El plato en 3D (1.26): qué pieza dibuja cada ingrediente y dónde va. La parte de three.js no se prueba acá (se ve en el navegador).
import { describe, expect, it } from 'vitest'
import { claveDe, componer, radioDe, rolDe } from '../../src/components/tres/emplatado/componer.js'

const t = (nombre, forma, gramos = 100, color = '#cccccc') => ({ nombre, forma, gramos, color })

describe('claveDe: cada ingrediente es una pieza que se reconoce', () => {
  it.each([
    [t('Milanesa de pollo al horno', 'filete'), 'milanesa'],
    [t('Merluza cocida', 'filete'), 'pescado'],
    [t('Pata muslo', 'trozo'), 'muslo'],
    [t('Pechuga de pollo cocida', 'trozo'), 'pechuga'],
    [t('Carne vacuna magra cocida', 'trozo'), 'bife'],
    [t('Atún al natural', 'trozo'), 'escamas'],
    [t('Arroz largo fino', 'grano'), 'arroz'],
    [t('Quinoa', 'grano'), 'granos'],
    [t('Fideos secos', 'pasta'), 'fideos'],
    [t('Puré de papa', 'cubo'), 'pure'],
    [t('Papa', 'cubo'), 'cubos'],
    [t('Ravioles', 'cubo'), 'almohadones'],
    [t('Lechuga', 'hoja'), 'hojas'],
    [t('Tomate', 'rodaja'), 'rodajas'],
    [t('Huevo', 'rodaja'), 'huevo'],
    [t('Jamón cocido', 'rodaja'), 'fiambre'],
    [t('Arvejas en lata', 'esfera'), 'arvejas'],
    [t('Garbanzos', 'esfera'), 'bolitas'],
    [t('Queso rallado', 'migaja'), 'espolvoreo'],
    [t('Carne picada', 'migaja'), 'molido'],
    [t('Puré de tomate', 'mancha'), 'salsa'],
    [t('Hamburguesa', 'medallon'), 'hamburguesa'],
  ])('%j → %s', (x, esperado) => expect(claveDe(x)).toBe(esperado))
})

describe('componer', () => {
  const milanesa = [
    t('Milanesa de pollo al horno', 'filete', 220, '#cc9348'),
    t('Tomate', 'rodaja', 120, '#d8402f'),
    t('Lechuga', 'hoja', 80, '#6fa84a'),
  ]
  it('arma una pieza por ingrediente con la proteína primero', () => {
    const c = componer(milanesa, 5)
    expect(c.map((p) => p.clave)).toEqual(
      ['milanesa', 'hojas', 'rodajas'].sort((a, b) => c.findIndex((p) => p.clave === a) - c.findIndex((p) => p.clave === b)),
    )
    expect(c[0].clave).toBe('milanesa')
    expect(c[0].rol).toBe('proteina')
  })
  it('no se pisan y quedan dentro del plato', () => {
    for (const lista of [
      milanesa,
      [
        t('Arroz', 'grano', 150),
        t('Pollo', 'trozo', 150),
        t('Arvejas', 'esfera', 80),
        t('Choclo', 'esfera', 80),
        t('Zanahoria', 'rodaja', 60),
        t('Brócoli', 'floret', 60),
      ],
    ]) {
      const c = componer(lista, 9).filter((p) => p.sobre < 0)
      expect(c.length).toBeLessThanOrEqual(5)
      for (const p of c) expect(Math.hypot(p.x, p.z) + p.radio * 0.4).toBeLessThan(1.08)
      for (let i = 0; i < c.length; i++)
        for (let j = i + 1; j < c.length; j++)
          expect(Math.hypot(c[i].x - c[j].x, c[i].z - c[j].z)).toBeGreaterThan((c[i].radio + c[j].radio) * 0.6)
    }
  })
  it('la salsa y el queso rallado van sobre los fideos', () => {
    const c = componer([t('Fideos secos', 'pasta', 90), t('Puré de tomate', 'mancha', 100), t('Queso rallado', 'migaja', 15)], 3)
    const fideos = c.findIndex((p) => p.clave === 'fideos')
    expect(
      c
        .filter((p) => p.sobre === fideos)
        .map((p) => p.clave)
        .sort(),
    ).toEqual(['espolvoreo', 'salsa'])
  })
  it('sin lugar donde ponerla, la salsa es un charquito al lado', () => {
    const c = componer([t('Pata muslo', 'trozo', 150), t('Salsa', 'mancha', 50)], 3)
    expect(c.find((p) => p.clave === 'salsa').sobre).toBe(-1)
  })
  it('los líquidos no se dibujan en el plato y un plato vacío da una lista vacía', () => {
    expect(componer([t('Leche', 'gota', 200)], 1)).toEqual([])
    expect(componer([], 1)).toEqual([])
    expect(componer(undefined, 1)).toEqual([])
  })
  it('es siempre igual para la misma semilla', () => {
    expect(componer(milanesa, 7)).toEqual(componer(milanesa, 7))
  })
  it('más gramos, pieza más grande (con tope)', () => {
    expect(radioDe('arroz', 300)).toBeGreaterThan(radioDe('arroz', 60))
    expect(radioDe('arroz', 99999)).toBeLessThanOrEqual(0.58)
    expect(rolDe('milanesa')).toBe('proteina')
    expect(rolDe('arroz')).toBe('base')
    expect(rolDe('hojas')).toBe('verdura')
  })
})

describe('tipoDePlato: la ensalada de acompañamiento no vuelve bowl al plato', async () => {
  const { tipoDePlato } = await import('../../src/lib/plato.js')
  it.each([
    ['Milanesas de pollo con ensalada', 'plato'],
    ['Pollo y ensalada mixta', 'plato'],
    ['Ensalada de atún', 'bowl'],
    ['Ensalada completa', 'bowl'],
    ['Bowl de quinoa con ensalada de tomate', 'bowl'],
    ['Wok de verduras', 'bowl'],
  ])('%s → %s', (n, esperado) => expect(tipoDePlato(n, [])).toBe(esperado))
})

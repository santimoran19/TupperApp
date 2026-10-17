// Ver una receta para otra cantidad de porciones (F-07): las cantidades se recalculan, las tildes dicen si alcanza para ese
// número, "Cocinar" arranca con lo que se está mirando y no se toca nada de la receta guardada. Usa la sesión de las anteriores.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, rest, sinErrores } from './apoyo.js'

const RECETA = 'Pata muslo al horno con papa y batata'
const numero = (t) => Number(String(t).replace(/[^\d.]/g, ''))

test('porciones de una receta: recalcular, volver a lo que rinde y cocinar con ese número', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  const vista = () => pg.getByTestId('porciones-vista')
  // El primer ingrediente en gramos (su cantidad es la de arriba, en negrita)
  const primero = () => pg.locator('section.tarjeta .divide-y > div').first().locator('b').first()
  let rinde = 0
  let base = 0
  let guardada = null

  await test.step('arranca en lo que rinde la receta', async () => {
    await pg.goto(APP + '/recetas')
    await pg.click(`text=${RECETA}`)
    await pg.waitForSelector('text=Ingredientes')
    await expect(vista()).toBeVisible()
    rinde = numero(await vista().innerText())
    expect(rinde).toBeGreaterThan(0)
    await expect(pg.getByText(`La receta rinde ${rinde}.`)).toBeVisible()
    await expect(pg.getByRole('button', { name: /^Volver a/ })).toHaveCount(0)
    base = numero(await primero().innerText())
    guardada = await rest(pg, 'recipes', `&select=servings&name=eq.${encodeURIComponent(RECETA)}`)
    expect(guardada).toHaveLength(1)
    await captura(pg, 's90_porciones_base', false)
  })

  await test.step('más porciones: las cantidades suben en proporción', async () => {
    await pg.getByRole('button', { name: 'Más porciones' }).click()
    await expect(vista()).toContainText(String(rinde + 1))
    const ahora = numero(await primero().innerText())
    // Mismo ingrediente, más porciones: proporcional (con la tolerancia del redondeo del texto)
    expect(Math.abs(ahora - (base / rinde) * (rinde + 1))).toBeLessThanOrEqual(Math.max(1, base * 0.01))
    await expect(pg.getByText(`Cantidades para ${rinde + 1}`)).toBeVisible()
    await captura(pg, 's91_porciones_mas', false)
  })

  await test.step('una sola porción y por debajo: se parte a la mitad', async () => {
    for (let i = 0; i < rinde; i++) await pg.getByRole('button', { name: 'Menos porciones' }).click()
    await expect(vista()).toHaveText(/^1 porción$/)
    await pg.getByRole('button', { name: 'Menos porciones' }).click()
    await expect(vista()).toContainText('0.5')
    await pg.getByRole('button', { name: 'Menos porciones' }).click()
    await expect(vista()).toContainText('0.25')
    // No baja de 0,25
    await expect(pg.getByRole('button', { name: 'Menos porciones' })).toBeDisabled()
    expect(numero(await primero().innerText())).toBeLessThan(base)
  })

  await test.step('cocinar arranca con las porciones que se miran', async () => {
    await pg.getByRole('button', { name: 'Más porciones' }).click() // 0,5
    await pg.getByRole('button', { name: 'Más porciones' }).click() // 1
    await pg.getByRole('button', { name: 'Más porciones' }).click() // 2
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    await expect(pg.locator('input[inputmode="decimal"]').first()).toHaveValue('2')
    await pg.click('button[aria-label="Cerrar"]')
  })

  await test.step('volver a lo que rinde deja todo como al entrar', async () => {
    await pg.getByRole('button', { name: `Volver a ${rinde}` }).click()
    await expect(vista()).toContainText(String(rinde))
    expect(numero(await primero().innerText())).toBe(base)
  })

  await test.step('al abrir otra receta vuelve a lo que rinde, y la receta guardada no cambió', async () => {
    await pg.getByRole('button', { name: 'Más porciones' }).click()
    await pg.goBack()
    await pg.waitForSelector('text=para cocinar')
    await pg.click(`text=${RECETA}`)
    await pg.waitForSelector('text=Ingredientes')
    await expect(pg.getByText(`La receta rinde ${rinde}.`)).toBeVisible()
    expect(await rest(pg, 'recipes', `&select=servings&name=eq.${encodeURIComponent(RECETA)}`)).toEqual(guardada)
  })

  sinErrores(errores)
  await ctx.close()
})

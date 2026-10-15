// Alimentos sueltos en el plan (F-15): se eligen en la ventana de la comida, con su cantidad, y cuentan en las calorías del
// día, en el diario ("Comí esto") y en "Armar con lo que tengo". Usa la sesión de las pruebas anteriores.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, rest, sinErrores } from './apoyo.js'

// Las kcal que marca la primera tarjeta de día de la semana (el número de "1.454 kcal")
const kcalDelDia = async (pg) => {
  const texto = await pg.locator('section.tarjeta').first().locator('span.text-xs').first().innerText()
  return Number(texto.replace(/\D/g, ''))
}
const ventana = (pg) => pg.locator('div.fixed.inset-0.z-50 > div.relative')

test('alimento suelto en el plan: elegirlo, cambiar la cantidad, verlo en el diario y respetarlo al armar', async ({ browser }) => {
  const errores = []
  let kcalAntes = 0
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)

  await test.step('en la ventana de una comida se puede elegir un alimento suelto con su cantidad', async () => {
    await pg.goto(APP + '/plan')
    await pg.waitForSelector('text=Esta semana')
    await pg.click('button[aria-label="Semana siguiente"]')
    // Se vacía la merienda para medir lo que suma el alimento en las calorías del día
    await pg.locator('button:has-text("MERIENDA")').first().click()
    await expect(ventana(pg)).toBeVisible()
    if (await ventana(pg).getByRole('button', { name: 'Dejar vacío' }).count())
      await ventana(pg).getByRole('button', { name: 'Dejar vacío' }).click()
    else await pg.click('button[aria-label="Cerrar"]')
    await expect(ventana(pg)).toHaveCount(0)
    kcalAntes = await kcalDelDia(pg)
    await pg.locator('button:has-text("MERIENDA")').first().click()
    await expect(ventana(pg).getByRole('button', { name: 'Recetas' })).toBeVisible()
    await ventana(pg).getByRole('button', { name: 'Alimento suelto' }).click()
    await pg.fill('input[placeholder="Buscar alimento..."]', 'manzana')
    await ventana(pg)
      .getByRole('button', { name: /^Manzana/ })
      .first()
      .click()
    // Una unidad por defecto, con sus calorías; se cambia la cantidad
    expect(await pg.inputValue('[aria-label="Cantidad"]')).toBe('1')
    await pg.fill('[aria-label="Cantidad"]', '2')
    await expect(ventana(pg).getByText('156 kcal')).toBeVisible()
    await captura(pg, 'f15_cantidad', false)
    // Una cantidad imposible no se deja guardar
    await pg.fill('[aria-label="Cantidad"]', '0')
    await expect(ventana(pg).getByRole('button', { name: 'Poner en el plan' })).toBeDisabled()
    await pg.fill('[aria-label="Cantidad"]', '2')
    await ventana(pg).getByRole('button', { name: 'Poner en el plan' }).click()
    await expect(ventana(pg)).toHaveCount(0)
  })

  await test.step('queda en el plan con su cantidad y suma a las calorías del día; se guarda en la base', async () => {
    const fila = pg.locator('button:has-text("MERIENDA")').first()
    await expect(fila).toContainText('Manzana')
    await expect(fila).toContainText('2 unidades')
    expect(await kcalDelDia(pg)).toBe(kcalAntes + 156)
    const guardada = (await rest(pg, 'plan')).filter((p) => p.food_id)
    expect(guardada.length).toBe(1)
    expect(Number(guardada[0].qty)).toBe(2)
    expect(guardada[0].recipe_id).toBeNull()
    await captura(pg, 'f15_plan')
  })

  await test.step('al abrirla de nuevo aparece la cantidad para cambiarla, y se puede pasar a una receta', async () => {
    await pg.locator('button:has-text("MERIENDA")').first().click()
    expect(await pg.inputValue('[aria-label="Cantidad"]')).toBe('2')
    await pg.fill('[aria-label="Cantidad"]', '3')
    await ventana(pg).getByRole('button', { name: 'Poner en el plan' }).click()
    await expect(pg.locator('button:has-text("MERIENDA")').first()).toContainText('3 unidades')
    // Marcarla "afuera" no borra el alimento
    await pg.locator('button[aria-label="Marcar fuera de casa"]').nth(2).click()
    await pg.waitForTimeout(400)
    const fila = (await rest(pg, 'plan')).find((p) => p.food_id)
    expect(fila && Number(fila.qty)).toBe(3)
  })

  await test.step('"Armar con lo que tengo" no pisa el alimento suelto', async () => {
    await pg.reload()
    await pg.waitForSelector('text=Esta semana')
    await pg.click('button[aria-label="Semana siguiente"]')
    await expect(pg.locator('button:has-text("MERIENDA")').first()).toContainText('Manzana')
    // Se vacía otra comida para que haya algo que armar y se arma
    await pg.locator('button:has-text("ALMUERZO")').first().click()
    await ventana(pg).getByRole('button', { name: 'Dejar vacío' }).click()
    await pg.click('button:has-text("Armar con lo que tengo")')
    await pg.waitForSelector('text=Semana completa')
    await expect(pg.locator('button:has-text("MERIENDA")').first()).toContainText('Manzana')
    expect((await rest(pg, 'plan')).filter((p) => p.food_id).length).toBe(1)
  })

  await test.step('en el diario: "Comí esto" con el alimento suelto lo registra (se usa mañana: es un día sin nada registrado)', async () => {
    await pg.click('button[aria-label="Semana anterior"]')
    await pg.locator('section:has-text("Domingo") button:has-text("CENA")').first().click()
    await pg.getByRole('button', { name: 'Alimento suelto' }).click()
    await pg.fill('input[placeholder="Buscar alimento..."]', 'manzana')
    await ventana(pg)
      .getByRole('button', { name: /^Manzana/ })
      .first()
      .click()
    await ventana(pg).getByRole('button', { name: 'Poner en el plan' }).click()
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await pg.getByRole('button', { name: /^Do 4/ }).click()
    await expect(pg.getByText('Plan: Manzana · 1 unidad')).toBeVisible()
    await captura(pg, 'f15_diario')
    const antes = (await rest(pg, 'log_entries')).length
    await pg.locator('section:has-text("Plan: Manzana") button:has-text("Comí esto")').click()
    await pg.waitForTimeout(600)
    const despues = await rest(pg, 'log_entries')
    expect(despues.length).toBe(antes + 1)
    const nueva = despues.find((r) => r.name === 'Manzana' && r.meal === 'cena' && r.date === '2026-10-04')
    expect(nueva && Number(nueva.qty)).toBe(1)
    expect(Math.round(Number(nueva.kcal))).toBe(78)
  })

  await ctx.close()
  sinErrores(errores)
})

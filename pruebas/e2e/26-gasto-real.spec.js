// Gasto real con los propios datos (F-19, fase 4): cuánto falta para poder calcularlo, el cálculo con comidas y pesajes cargados,
// el ajuste que la persona decide aplicar (o sacar) y usar el cálculo como objetivo. Usa la sesión de las anteriores.
import { expect, test } from '@playwright/test'
import { APP, contexto, escuchar, pedir, rest, sinErrores } from './apoyo.js'

const numero = (t) => Number(String(t).replace(/\./g, '').replace(/[^\d]/g, ''))

test('gasto real: faltan datos, se calcula, se ajusta y se usa como objetivo', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  const perfil = async () => (await rest(pg, 'profiles'))[0]
  const tarjeta = (titulo) => pg.locator('section').filter({ has: pg.getByRole('heading', { name: titulo }) })
  const real = () => tarjeta('Tu gasto real')
  const calculo = () => tarjeta('Tu gasto de un día sin entrenar')
  const mantenimiento = async () => numero(await calculo().locator('p.text-3xl').innerText())

  await test.step('limpiar la ventana de 4 semanas (5/9 al 2/10) para partir de cero', async () => {
    await pg.goto(APP + '/gasto')
    await expect(calculo()).toBeVisible()
    await pedir(pg, 'DELETE', 'log_entries', '?date=gte.2026-09-05&date=lte.2026-10-02')
    await pedir(pg, 'DELETE', 'measurements', '?date=gte.2026-09-05&date=lte.2026-10-02')
    await pg.reload()
    await expect(real()).toBeVisible()
  })

  await test.step('sin datos suficientes dice cuánto falta', async () => {
    await expect(real().getByText('Días con la comida cargada', { exact: true })).toBeVisible()
    await expect(real().getByText(/Faltan 21 días con la comida cargada \(llevás 0 de 21\)/)).toBeVisible()
    await expect(real().getByText(/Faltan 3 pesajes \(llevás 1 de 4\)/)).toBeVisible()
    await expect(real().getByRole('button', { name: /Ajustar mi gasto/ })).toHaveCount(0)
  })

  await test.step('cargar 24 días de comida y 4 pesajes que bajan 0,05 kg por día', async () => {
    const dias = Array.from({ length: 24 }, (_, i) => `2026-09-${String(8 + i).padStart(2, '0')}`)
    const filas = dias.flatMap((date) =>
      [
        ['desayuno', 500],
        ['almuerzo', 800],
        ['merienda', 400],
        ['cena', 600],
      ].map(([meal, kcal]) => ({ date, meal, name: 'Comida de prueba', qty: 1, kcal, protein: 20, carbs: 30, fat: 10 })),
    )
    await pedir(pg, 'POST', 'log_entries', '', filas)
    // El 3/10 ya tenía un peso (80): se pisa con el último punto de la recta
    const pesos = [
      ['2026-09-08', 81.5],
      ['2026-09-18', 81],
      ['2026-09-28', 80.5],
      ['2026-10-03', 80.25],
    ].map(([date, weight_kg]) => ({ date, weight_kg }))
    await pedir(pg, 'POST', 'measurements', '?on_conflict=user_id,date', pesos, { Prefer: 'resolution=merge-duplicates' })
    await pg.reload()
    await expect(real().getByText('Tu peso cambió')).toBeVisible()
  })

  await test.step('el gasto real: comió 2.300 y bajó 0,35 kg por semana → gasta unas 2.685', async () => {
    // 2.300 + 0,05 kg/día × 7.700 kcal/kg = 2.685
    await expect(real().getByText('~2.685')).toBeVisible()
    await expect(real().getByText('Comiste en promedio').locator('..')).toContainText('2.300 kcal')
    await expect(real().getByText('Tu peso cambió').locator('..')).toContainText('−0,35 kg por semana')
    await expect(real().getByText('Entre 2.455 y 2.915')).toBeVisible()
    await expect(real().getByText('Confianza alta')).toBeVisible()
    // Sin entrenar da lo mismo (no hubo ejercicio) y la fórmula decía unas 2.500
    await expect(real().getByText(/Sin entrenar, tu gasto real da 2\.685 kcal; la fórmula decía 2\.50\d/)).toBeVisible()
    await expect(real().getByRole('button', { name: 'Ajustar mi gasto con estos datos' })).toBeVisible()
    // No se cambió nada solo
    expect((await perfil()).gasto_factor).toBeNull()
  })

  await test.step('aplicar el ajuste pide confirmación y deja constancia', async () => {
    const antes = await mantenimiento()
    expect(antes).toBeGreaterThan(2490)
    expect(antes).toBeLessThan(2510)
    await real().getByRole('button', { name: 'Ajustar mi gasto con estos datos' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Cancelar' }).click()
    expect((await perfil()).gasto_factor).toBeNull()
    await real().getByRole('button', { name: 'Ajustar mi gasto con estos datos' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Ajustar', exact: true }).click()
    await expect(pg.getByText('Gasto ajustado con tus datos')).toBeVisible()
    const p = await perfil()
    expect(Number(p.gasto_factor)).toBeGreaterThan(1.06)
    expect(Number(p.gasto_factor)).toBeLessThan(1.09)
    expect(p.gasto_factor_fecha).toBe('2026-10-03')
    await expect(real().getByText(/ajustado con tus datos/)).toBeVisible()
    await expect(calculo().getByText('Ajustado con tus propios datos')).toBeVisible()
    // Ahora el gasto de un día sin entrenar es el real
    expect(Math.abs((await mantenimiento()) - 2685)).toBeLessThanOrEqual(15)
  })

  await test.step('sacar el ajuste vuelve a la fórmula general', async () => {
    await real().getByRole('button', { name: 'Volver a la fórmula general' }).click()
    await expect(real().getByRole('button', { name: 'Volver a la fórmula general' })).toHaveCount(0)
    const p = await perfil()
    expect(p.gasto_factor).toBeNull()
    expect(p.gasto_factor_fecha).toBeNull()
    expect(Math.abs((await mantenimiento()) - 2500)).toBeLessThanOrEqual(15)
  })

  await test.step('usar el cálculo como objetivo: gasto − 22 % por el peso meta', async () => {
    const objetivo = tarjeta('Tu objetivo de calorías')
    await expect(objetivo.getByText(/Gasto de 2\.50\d kcal − 22 % = 1\.950 kcal y 120 g de proteína/)).toBeVisible()
    await objetivo.getByRole('button', { name: 'Usar este cálculo como mi objetivo' }).click()
    await pg.getByRole('alertdialog').getByRole('button', { name: 'Cambiar objetivo' }).click()
    await expect(pg.getByText('Objetivo actualizado')).toBeVisible()
    const p = await perfil()
    expect(p.kcal_target).toBe(1950)
    expect(p.protein_target).toBe(120)
    await expect(objetivo.getByRole('button', { name: 'Usar este cálculo como mi objetivo' })).toBeDisabled()
  })

  await test.step('el resumen de la semana usa el objetivo de cada día', async () => {
    await pg.goto(APP + '/resumen?fecha=2026-09-14')
    await expect(pg.getByText('Resumen semanal')).toBeVisible()
    // Modo dinámico sin ejercicio esa semana: el objetivo de cada día es el gasto de ese día − 22 % (con el peso de esa semana, un poco
    // más alto que el de hoy), así que el promedio queda entre 1.950 y 2.000
    await expect(pg.getByText(/objetivo 1\.9[5-9]\d/).first()).toBeVisible()
  })

  await ctx.close()
  sinErrores(errores)
})

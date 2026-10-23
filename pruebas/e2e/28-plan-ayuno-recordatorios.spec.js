// 1.27: el plan armado con lo que vence, el ayuno del Diario y los recordatorios del Perfil. Usa la sesión de las anteriores.
import { expect, test } from '@playwright/test'
import { APP, aviso, contexto, escuchar, hoyEnLaPagina, pedir, sinErrores } from './apoyo.js'

test('plan con lo que vence, ayuno y recordatorios', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)

  await test.step('el Plan arma la semana y avisa', async () => {
    await pg.goto(APP + '/plan')
    const armar = pg.getByRole('button', { name: /Armar con lo que tengo|Semana completa/ })
    await expect(armar).toBeVisible()
    if (await armar.isEnabled()) {
      await armar.click()
      await expect.poll(() => aviso(pg)).toMatch(/Plan armado/)
    }
  })

  await test.step('el ayuno: elegir, empezar, ver cuánto pasó y terminar', async () => {
    await pg.goto(APP + '/')
    const ayuno = pg.getByTestId('ayuno')
    await expect(ayuno).toBeVisible()
    await ayuno.getByRole('radio', { name: '14 : 10' }).click()
    await expect(ayuno.getByText(/14 horas sin comer y 10 para comer/)).toBeVisible()
    await ayuno.getByLabel('Empecé a las').fill('07:00')
    await ayuno.getByRole('button', { name: /Empezar ayuno/ }).click()
    // La hora fija de la prueba es 21:30: 14 horas y media desde las 07:00
    await expect(ayuno.getByText(/14 h 30 min/)).toBeVisible()
    await expect(ayuno.getByText(/Cumpliste las 14 horas/)).toBeVisible()
    // Queda guardado al recargar
    await pg.reload()
    await expect(pg.getByTestId('ayuno').getByText(/14 h 30 min/)).toBeVisible()
    await pg
      .getByTestId('ayuno')
      .getByRole('button', { name: /Terminé el ayuno/ })
      .click()
    await expect.poll(() => aviso(pg)).toMatch(/Ayuno cumplido/)
    await expect(pg.getByTestId('ayuno').getByRole('button', { name: /Empezar ayuno/ })).toBeVisible()
    await expect(pg.getByTestId('ayuno').getByText(/Esta semana: 1 de 1 cumplidos/)).toBeVisible()
  })

  await test.step('recordatorios: se prenden, se cambia la hora y avisa la cena', async () => {
    // Otras pruebas anotan la cena de hoy: se borra para que el aviso tenga sentido
    await pedir(pg, 'DELETE', 'log_entries', `?date=eq.${await hoyEnLaPagina(pg)}&meal=eq.cena`)
    await pg.goto(APP + '/perfil')
    const rec = pg.getByTestId('recordatorios')
    await expect(rec).toBeVisible()
    await rec.getByRole('switch', { name: 'Activar recordatorios' }).click()
    await expect(rec.getByLabel('Hora de cena')).toHaveValue('21:00')
    await rec.getByLabel('Hora de cena').fill('21:15')
    // Son las 21:30 en la prueba y la cena no está anotada: aparece el aviso dentro de la app
    await expect.poll(() => aviso(pg)).toMatch(/Es hora de cenar/)
    await pg.reload()
    await expect(pg.getByTestId('recordatorios').getByLabel('Hora de cena')).toHaveValue('21:15')
  })

  sinErrores(errores)
})

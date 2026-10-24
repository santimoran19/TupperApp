// 1.31: lo que se saca de la lista de compras queda en la base (F-25), consejo de estación en el carrusel (F-24) y el
// panel de administración (C-07), que solo ve quien está cargado como administrador. Cuenta nueva.
import { expect, test } from '@playwright/test'
import { APP, contexto, crearCuenta, escuchar, hoyEnLaPagina, pedir, rest, simulador, sinErrores } from './apoyo.js'

const sumarDias = (f, n) => {
  const d = new Date(f + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

test('compras sacadas en la base, consejo de estación y panel de administración', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  const email = 'novedades131@test.com'
  await crearCuenta(pg, { email, nombre: 'Juli', usuario: 'juli.131' })
  const hoy = await hoyEnLaPagina(pg)
  const [banana] = await rest(pg, 'foods', '&owner=is.null&slug=eq.banana')
  const [arroz] = await rest(pg, 'foods', '&owner=is.null&slug=eq.arroz')

  await test.step('el carrusel de la despensa trae un consejo de estación', async () => {
    await pedir(pg, 'POST', 'stock', '', [{ food_id: arroz.id, qty: 1000 }])
    await pg.goto(APP + '/despensa')
    const carrusel = pg.locator('[data-testid=consejos]:visible')
    await expect(carrusel.getByTestId('consejo').filter({ hasText: 'DE ESTACIÓN' })).toHaveCount(1)
    // Y uno por día en el Diario, que lleva a la Despensa
    await pg.goto(APP + '/')
    const delDia = pg.getByTestId('consejo-despensa')
    await expect(delDia).toContainText(arroz.name)
    await delDia.click()
    await expect(pg).toHaveURL(/\/despensa$/)
  })

  await test.step('lo sacado de la lista de compras se guarda en la base', async () => {
    // Solo cuenta como faltante lo que se lleva en la despensa: hay 4 bananas y el plan pide 8
    await pedir(pg, 'POST', 'stock', '', [{ food_id: banana.id, qty: 4 }])
    await pedir(pg, 'POST', 'plan', '', [{ date: sumarDias(hoy, 1), meal: 'almuerzo', food_id: banana.id, qty: 8 }])
    await pg.goto(APP + '/compras')
    const fila = pg.getByRole('button', { name: `Quitar ${banana.name}`, exact: true })
    await fila.click()
    await expect(fila).toHaveCount(0)
    await expect.poll(async () => (await rest(pg, 'compras_quitadas')).map((q) => q.food_id)).toEqual([banana.id])
    // En otro teléfono (sin la copia de la despensa, que va en IndexedDB) también aparece sacado
    const otro = await contexto(browser, { storageState: await ctx.storageState() })
    const p2 = await otro.newPage()
    await p2.goto(APP + '/compras')
    await expect(p2.getByTestId('compras-quitados')).toContainText('Sacaste 1 cosa')
    await otro.close()
    // Volver a ponerlo lo borra de la base
    await pg
      .getByTestId('compras-quitados')
      .getByRole('button', { name: /Sacaste 1 cosa/ })
      .click()
    await pg.getByRole('button', { name: 'Volver a la lista' }).click()
    await expect(fila).toBeVisible()
    await expect.poll(async () => (await rest(pg, 'compras_quitadas')).length).toBe(0)
  })

  await test.step('panel de administración: cerrado para todos menos para quien se carga en la base', async () => {
    await pg.goto(APP + '/perfil')
    await expect(pg.getByText(/^Tupper \d/)).toBeVisible()
    await expect(pg.getByRole('link', { name: 'Administración' })).toHaveCount(0)
    await pg.goto(APP + '/admin')
    await expect(pg.getByText('Solo para administradores')).toBeVisible()

    await pedir(pg, 'POST', 'opiniones', '', [{ tipo: 'idea', texto: 'Que se pueda ordenar la despensa por pasillo', version: '1.31.0' }])
    expect((await simulador('/_pruebas/admin', { email })).ok).toBe(true)
    await pg.goto(APP + '/perfil')
    await pg.getByRole('link', { name: 'Administración' }).click()
    await expect(pg).toHaveURL(/\/admin$/)
    await expect(pg.getByRole('region', { name: 'Cuentas' })).toContainText('en total')
    // Ve las opiniones de todas las cuentas (en la corrida completa hay de otras pruebas)
    await expect(pg.getByTestId('opinion').filter({ hasText: 'Que se pueda ordenar la despensa por pasillo' })).toHaveCount(1)
    await expect(pg.getByRole('region', { name: 'Pedidos a la IA' })).toContainText('Sin pedidos')
  })

  sinErrores(errores)
  await ctx.close()
})

// Editar y borrar lo que se anotó, con la despensa al día: se ve la cantidad en cada fila, se cambia, se pregunta solo si
// el cambio toca la despensa y también anda sin conexión. Usa la sesión de las pruebas anteriores y deja todo como estaba.
import { expect, test } from '@playwright/test'
import { API, APP, captura, contexto, cortarConexion, escuchar, franja, rest, restPorFuera, sinErrores, volvioLaConexion } from './apoyo.js'

// Deja la despensa con una cantidad exacta de un alimento (por fuera de la app)
async function ponerStock(pg, slug, qty) {
  await pg.evaluate(
    async ([api, slug, qty]) => {
      const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
      const ses = JSON.parse(localStorage.getItem(k))
      const h = { Authorization: 'Bearer ' + ses.access_token, apikey: 'test', 'Content-Type': 'application/json' }
      const [alimento] = await (await fetch(api + '/rest/v1/foods?select=*&slug=eq.' + slug, { headers: h })).json()
      await fetch(api + '/rest/v1/stock?on_conflict=user_id,food_id', {
        method: 'POST',
        headers: { ...h, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ user_id: ses.user.id, food_id: alimento.id, qty }),
      })
    },
    [API, slug, qty],
  )
}

const dialogo = (pg) => pg.getByRole('alertdialog')

test('ver y cambiar la cantidad de lo anotado, con la despensa al día', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  const errores = escuchar(pg)

  await pg.goto(APP + '/')
  await pg.waitForSelector('text=¡Hola, Santi!')
  await ponerStock(pg, 'huevo', 10)
  await pg.reload()
  await pg.waitForSelector('text=¡Hola, Santi!')
  const stockHuevo = async () => {
    const [alimento] = await rest(pg, 'foods', '&slug=eq.huevo')
    const filas = await rest(pg, 'stock', '&food_id=eq.' + alimento.id)
    return Number(filas[0]?.qty ?? NaN)
  }
  // Los huevos de esta prueba son los últimos de la cena (puede haber otros anotados por las pruebas anteriores)
  const filaHuevo = () =>
    pg
      .locator('section', { hasText: 'CENA' })
      .getByRole('button', { name: /^Cambiar la cantidad de Huevo ·/ })
      .last()
  const borrarHuevo = () => pg.locator('section', { hasText: 'CENA' }).locator('button[aria-label="Borrar Huevo"]').last()
  const registroDe = async (nombre) => (await rest(pg, 'log_entries', '&name=eq.' + encodeURIComponent(nombre))).at(-1)

  await test.step('se anotan 4 huevos y cada fila muestra su cantidad', async () => {
    await pg.goto(APP + '/registrar?comida=cena')
    await pg.waitForSelector('text=Tu plato')
    await pg.click('button:has-text("Alimento")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'huevo')
    await pg.locator('div.divide-y button').first().click()
    await pg.fill('input[aria-label="Cantidad"]', '4')
    await pg.locator('button:has-text("Agregar a la cena")').click()
    await pg.waitForSelector('text=¡Hola, Santi!')
    expect(await stockHuevo()).toBe(6)
    const r = await registroDe('Huevo')
    expect(r.descontado.s.reduce((n, x) => n + Number(x.q), 0)).toBe(4)
    await expect(filaHuevo()).toContainText('4')
    await captura(pg, 'f14_01_cantidad_en_la_fila')
  })

  await test.step('la hoja se cierra con Escape, el foco no se escapa y vuelve al botón que la abrió', async () => {
    await filaHuevo().click()
    const hoja = pg.getByRole('dialog', { name: 'Cambiar cantidad' })
    await expect(hoja).toBeVisible()
    const dentro = () => pg.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))
    expect(await dentro()).toBe(true)
    // Tab y Mayús+Tab muchas veces: el foco da la vuelta adentro de la hoja
    for (let i = 0; i < 12; i++) await pg.keyboard.press('Tab')
    expect(await dentro()).toBe(true)
    for (let i = 0; i < 12; i++) await pg.keyboard.press('Shift+Tab')
    expect(await dentro()).toBe(true)
    // La cruz mide 44 px de área de toque aunque se vea de 36
    const cruz = await hoja.getByRole('button', { name: 'Cerrar' }).evaluate((el) => {
      const r = getComputedStyle(el, '::after')
      return [parseFloat(r.width), parseFloat(r.height)]
    })
    expect(Math.min(...cruz)).toBeGreaterThanOrEqual(44)
    await pg.keyboard.press('Escape')
    await expect(hoja).toHaveCount(0)
    await expect(filaHuevo()).toBeFocused()
  })

  await test.step('bajar la cantidad pregunta, cuenta qué pasa con la despensa y la devuelve', async () => {
    await filaHuevo().click()
    await pg.waitForSelector('text=Cambiar cantidad')
    await pg.fill('input[aria-label="Cantidad"]', '2')
    await captura(pg, 'f14_02_editar', false)
    await pg.click('button:has-text("Guardar")')
    await expect(dialogo(pg)).toContainText('Vas a cambiar Huevo de 4')
    await expect(dialogo(pg)).toContainText('Vuelve a la despensa')
    await captura(pg, 'f14_03_confirmar', false)
    // Cancelar no cambia nada
    await dialogo(pg).getByRole('button', { name: 'Cancelar' }).click()
    expect(Number((await registroDe('Huevo')).qty)).toBe(4)
    expect(await stockHuevo()).toBe(6)
    await pg.click('button:has-text("Guardar")')
    await dialogo(pg).getByRole('button', { name: 'Cambiar' }).click()
    await pg.waitForSelector('text=Cantidad cambiada')
    const r = await registroDe('Huevo')
    expect(Number(r.qty)).toBe(2)
    expect(await stockHuevo()).toBe(8)
    await expect(filaHuevo()).toContainText('2')
  })

  await test.step('subir de más: la despensa queda en cero y se avisa lo que faltó', async () => {
    await filaHuevo().click()
    await pg.fill('input[aria-label="Cantidad"]', '20')
    await pg.click('button:has-text("Guardar")')
    await expect(dialogo(pg)).toContainText('no alcanza')
    await dialogo(pg).getByRole('button', { name: 'Cambiar' }).click()
    await pg.waitForSelector('text=la despensa queda en cero')
    expect(await stockHuevo()).toBe(0)
    expect(Number((await registroDe('Huevo')).qty)).toBe(20)
    // Se vuelve a 4 y lo descontado vuelve (solo lo que había salido de verdad)
    await filaHuevo().click()
    await pg.fill('input[aria-label="Cantidad"]', '4')
    await pg.click('button:has-text("Guardar")')
    await dialogo(pg).getByRole('button', { name: 'Cambiar' }).click()
    await pg.waitForSelector('text=Cantidad cambiada')
    expect(await stockHuevo()).toBe(6)
  })

  await test.step('si el cambio no toca la despensa, se guarda directo', async () => {
    await pg.click('button:has-text("Vaso de agua")')
    await pg.waitForSelector('text=Un vaso de agua anotado')
    await pg
      .getByRole('button', { name: /^Cambiar la cantidad de Agua ·/ })
      .last()
      .click()
    await pg.fill('input[aria-label="Cantidad"]', '500')
    await pg.click('button:has-text("Guardar")')
    await pg.waitForSelector('text=Cantidad cambiada')
    expect(await dialogo(pg).count()).toBe(0)
    expect(Number((await registroDe('Agua')).qty)).toBe(500)
    // Una cantidad inválida no se puede guardar
    await pg
      .getByRole('button', { name: /^Cambiar la cantidad de Agua ·/ })
      .last()
      .click()
    await pg.fill('input[aria-label="Cantidad"]', '0')
    await expect(pg.locator('button:has-text("Guardar")')).toBeDisabled()
    await pg.keyboard.press('Escape')
    await expect(pg.getByRole('dialog')).toHaveCount(0)
  })

  await test.step('sin conexión: se cambia en el teléfono y se manda al volver', async () => {
    const conectar = await cortarConexion(ctx)
    await filaHuevo().click()
    await pg.fill('input[aria-label="Cantidad"]', '3')
    await pg.click('button:has-text("Guardar")')
    await expect(dialogo(pg)).toContainText('Vuelve a la despensa')
    await dialogo(pg).getByRole('button', { name: 'Cambiar' }).click()
    await expect(franja(pg)).toContainText('1 cambio por enviar')
    await expect(filaHuevo()).toContainText('3')
    await conectar()
    await volvioLaConexion(pg)
    const leer = await restPorFuera(pg)
    const [alimento] = await leer('foods', '&slug=eq.huevo')
    expect(Number((await leer('stock', '&food_id=eq.' + alimento.id))[0].qty)).toBe(7)
    expect(Number((await registroDe('Huevo')).qty)).toBe(3)
  })

  await test.step('borrar devuelve a la despensa lo que se había descontado', async () => {
    const huevosAntes = await pg.locator('section', { hasText: 'CENA' }).locator('button[aria-label="Borrar Huevo"]').count()
    await borrarHuevo().click()
    await expect(dialogo(pg)).toContainText('Vuelve a la despensa')
    await dialogo(pg).getByRole('button', { name: 'Borrar' }).click()
    await expect(pg.locator('section', { hasText: 'CENA' }).locator('button[aria-label="Borrar Huevo"]')).toHaveCount(huevosAntes - 1)
    await expect.poll(stockHuevo).toBe(10)
    // Y el vaso de agua también se va
    const aguas = pg.getByRole('button', { name: /^Cambiar la cantidad de Agua ·/ })
    const aguasAntes = await aguas.count()
    await pg.click('button[aria-label="Borrar Agua"] >> nth=-1')
    await dialogo(pg).getByRole('button', { name: 'Borrar' }).click()
    await expect(aguas).toHaveCount(aguasAntes - 1)
  })

  sinErrores(errores)
})

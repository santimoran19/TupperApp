// Hogar (F-03): dos personas arman un hogar con un código y comparten la despensa, la lista de compras y las compras.
// Santi usa la sesión de las pruebas anteriores; Lucía entra con la cuenta que creó la prueba 16.
import { expect, test } from '@playwright/test'
import { APP, aviso, captura, contexto, escuchar, rest, sinErrores } from './apoyo.js'

// { food_id: cantidad } de lo que devuelve la tabla stock
const mapa = (filas) => Object.fromEntries(filas.map((f) => [f.food_id, Number(f.qty)]))

// Escribe filas en una tabla con la sesión de la página (para dejarle algo en la despensa a una cuenta sin pasar por la pantalla)
const escribir = (pg, tabla, conflicto, filas) =>
  pg.evaluate(
    async ([api, tabla, conflicto, filas]) => {
      const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
      const sesion = JSON.parse(localStorage.getItem(k))
      const r = await fetch(`${api}/rest/v1/${tabla}?on_conflict=${conflicto}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + sesion.access_token,
          apikey: 'test',
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(filas.map((f) => ({ ...f, user_id: sesion.user.id }))),
      })
      return r.status
    },
    ['http://localhost:54321', tabla, conflicto, filas],
  )

const confirmar = async (pg, boton) => {
  await pg.waitForSelector('[role=alertdialog]')
  await pg.click(`[role=alertdialog] button:has-text("${boton}")`)
}

test('hogar: armarlo, unirse con el código, compartir despensa, lista y compras, salir y que te saquen', async ({ browser }) => {
  const errores = []

  const ctxS = await contexto(browser, { sesion: true })
  const santi = await ctxS.newPage()
  escuchar(santi, errores)

  // Lucía entra con su cuenta
  const ctxL = await contexto(browser)
  const lucia = await ctxL.newPage()
  escuchar(lucia, errores)
  await lucia.goto(APP + '/')
  await lucia.fill('#email', 'lucia@test.com')
  await lucia.fill('#clave', 'Secreto3z')
  await lucia.click('form button[type=submit]')
  await lucia.waitForSelector('text=¡Hola, Lucía!')

  let propioDeSanti
  let propioDeLucia
  let codigo

  await test.step('sin hogar: la tarjeta ofrece armar uno o unirse, y todo sigue siendo de cada uno', async () => {
    await santi.goto(APP + '/perfil')
    await santi.waitForSelector('text=Armar un hogar')
    await santi.waitForSelector('text=Tengo un código')
    propioDeSanti = mapa(await rest(santi, 'stock'))
    expect(Object.keys(propioDeSanti).length).toBeGreaterThan(0)
    // A Lucía se le deja algo en la despensa: sal (que Santi quizá tenga) y mostaza
    const [sal] = await rest(lucia, 'foods', '&slug=eq.sal')
    const [mostaza] = await rest(lucia, 'foods', '&slug=eq.mostaza')
    expect(
      await escribir(lucia, 'stock', 'user_id,food_id', [
        { food_id: sal.id, qty: 400 },
        { food_id: mostaza.id, qty: 250 },
      ]),
    ).toBe(201)
    propioDeLucia = mapa(await rest(lucia, 'stock'))
    expect(Object.keys(propioDeLucia).length).toBe(2)
    await captura(santi, 'h01_perfil_sin_hogar', false)
  })

  await test.step('Santi arma el hogar: su despensa pasa a ser la del hogar y hay un código de 6 caracteres', async () => {
    await santi.click('button:has-text("Armar un hogar")')
    await santi.fill('#hg-nombre', 'Casa de prueba')
    await captura(santi, 'h02_armar_hogar', false)
    await santi.getByRole('button', { name: 'Armar hogar', exact: true }).click()
    await santi.waitForSelector('text=Hogar armado')
    await santi.waitForSelector('h2:has-text("Casa de prueba")')
    await santi.waitForSelector('text=1 de 6 personas')
    codigo = await santi.getByTestId('codigo-hogar').innerText()
    expect(codigo).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
    expect(mapa(await rest(santi, 'stock'))).toEqual(propioDeSanti) // la suya sumada a un hogar vacío: igual
    await santi.goto(APP + '/despensa')
    await santi.waitForSelector('text=Despensa compartida · Casa de prueba')
    await captura(santi, 'h03_despensa_compartida')
  })

  await test.step('Lucía: un código que no existe avisa y no entra; con el bueno, se suma lo suyo a lo del hogar', async () => {
    await lucia.goto(APP + '/perfil')
    await lucia.click('button:has-text("Tengo un código")')
    await lucia.fill('#hg-codigo', 'zzz zzz')
    expect(await lucia.inputValue('#hg-codigo')).toBe('ZZZZZZ')
    await lucia.getByRole('button', { name: 'Unirme', exact: true }).click()
    await lucia.waitForSelector('text=No encontramos ese código')
    expect(await aviso(lucia)).toContain('No encontramos ese código')
    await lucia.fill('#hg-codigo', codigo.slice(0, 5))
    expect(await lucia.getByRole('button', { name: 'Unirme', exact: true }).isDisabled()).toBe(true)
    await lucia.fill('#hg-codigo', codigo.toLowerCase())
    await captura(lucia, 'h04_unirse', false)
    await lucia.getByRole('button', { name: 'Unirme', exact: true }).click()
    await lucia.waitForSelector('text=Ya estás en el hogar')
    await lucia.waitForSelector('h2:has-text("Casa de prueba")')
    await lucia.waitForSelector('text=2 de 6 personas')
    const personas = lucia.getByTestId('miembro-hogar')
    expect(await personas.count()).toBe(2)
    expect(await personas.first().innerText()).toContain('Armó el hogar')
    expect(await personas.last().innerText()).toContain('(vos)')
    // el código solo lo ve quien armó el hogar
    expect(await lucia.getByTestId('codigo-hogar').count()).toBe(0)
    await lucia.waitForSelector('text=pedile el código a quien armó el hogar')
    await captura(lucia, 'h05_hogar_de_a_dos')
    // lo de los dos sumado
    const juntos = { ...propioDeSanti }
    for (const [id, qty] of Object.entries(propioDeLucia)) juntos[id] = Math.round(((juntos[id] || 0) + qty) * 100) / 100
    expect(mapa(await rest(lucia, 'stock'))).toEqual(juntos)
    // Santi ve lo mismo
    expect(mapa(await rest(santi, 'stock'))).toEqual(juntos)
  })

  await test.step('lo que hace uno lo ve el otro: sumar a la despensa, anotar en la lista y comprar', async () => {
    // Lucía suma una mostaza desde la despensa
    await lucia.goto(APP + '/despensa')
    await lucia.waitForSelector('text=Despensa compartida · Casa de prueba')
    const [mostaza] = await rest(lucia, 'foods', '&slug=eq.mostaza')
    const antes = mapa(await rest(lucia, 'stock'))[mostaza.id]
    await lucia.click('button[aria-label="Sumar Mostaza"]')
    await expect.poll(async () => mapa(await rest(santi, 'stock'))[mostaza.id]).toBeGreaterThan(antes)
    // Lucía anota en la lista; Santi lo ve, lo compra y a Lucía le dice quién lo compró
    await lucia.goto(APP + '/compras')
    await lucia.waitForSelector('text=Para comprar')
    await lucia.click('button:has-text("Anotar")')
    await lucia.fill('input[placeholder="Buscar alimento..."]', 'miel')
    await lucia.locator('div.divide-y > button').first().click()
    await lucia.waitForSelector('text=anotado en el hogar')
    await santi.goto(APP + '/compras')
    const fila = santi.locator('div.py-3', { hasText: 'anotado en el hogar' }).filter({ hasText: /Miel/ })
    await fila.first().waitFor()
    await fila
      .first()
      .getByRole('button', { name: /Comprado/ })
      .click()
    await santi.fill('#cp-precio', '1500')
    await santi.click('button:has-text("Confirmar compra")')
    await santi.waitForSelector('text=Sumado a la despensa del hogar')
    await santi.waitForSelector('text=Compras del mes')
    await lucia.reload()
    await lucia.waitForSelector('text=Compras del mes')
    const compra = lucia.locator('div.py-3', { hasText: 'Miel' }).filter({ hasText: 'compró Santi' })
    expect(await compra.count()).toBe(1)
    // en la lista de Lucía ya no está la miel
    expect(await lucia.locator('div.py-3', { hasText: 'anotado en el hogar' }).filter({ hasText: /Miel/ }).count()).toBe(0)
    await captura(lucia, 'h06_compra_de_santi')
    // el diario sigue siendo de cada uno
    expect(await rest(lucia, 'log_entries')).not.toEqual(await rest(santi, 'log_entries'))
  })

  await test.step('el código: se cambia (el anterior deja de servir) y se apaga', async () => {
    await santi.goto(APP + '/perfil')
    await santi.waitForSelector('text=Código para sumar gente')
    await santi.click('button:has-text("Cambiar")')
    await confirmar(santi, 'Cambiar código')
    await santi.waitForSelector('text=Código nuevo listo')
    await expect.poll(() => santi.getByTestId('codigo-hogar').innerText()).not.toBe(codigo)
    codigo = await santi.getByTestId('codigo-hogar').innerText()
    expect(codigo).toMatch(/^[A-HJ-NP-Z2-9]{6}$/)
    await santi.click('button:has-text("Apagar")')
    await confirmar(santi, 'Apagar código')
    await santi.waitForSelector('text=El código está apagado')
    await santi.click('button:has-text("Armar un código")')
    await expect.poll(() => santi.getByTestId('codigo-hogar').count()).toBe(1)
    codigo = await santi.getByTestId('codigo-hogar').innerText()
    await captura(santi, 'h07_codigo', false)
  })

  await test.step('Lucía sale: se lleva una copia de lo del hogar y Santi sigue con el hogar', async () => {
    const delHogar = mapa(await rest(santi, 'stock'))
    // Lo que apunta a alimentos que cargó Santi no se lo lleva: ya no los podría ver
    const deSanti = new Set((await rest(santi, 'foods')).filter((f) => f.owner).map((f) => f.id))
    expect(deSanti.size, 'Santi tiene alimentos propios en la despensa').toBeGreaterThan(0)
    expect(Object.keys(delHogar).some((id) => deSanti.has(id))).toBe(true)
    // (el simulador no borra en cascada: un alimento borrado en una prueba anterior puede haber dejado su fila de stock, que en la base de verdad no existiría)
    const existentes = new Set(
      (
        await (
          await fetch('http://localhost:54321/rest/v1/foods?select=id', {
            headers: { Authorization: 'Bearer service-role-de-prueba', apikey: 'test' },
          })
        ).json()
      ).map((f) => f.id),
    )
    const paraLucia = Object.fromEntries(Object.entries(delHogar).filter(([id]) => existentes.has(id) && !deSanti.has(id)))
    await lucia.goto(APP + '/perfil')
    await lucia.click('button:has-text("Salir del hogar")')
    await captura(lucia, 'h08_salir', false)
    await confirmar(lucia, 'Salir del hogar')
    await lucia.waitForSelector('text=Saliste del hogar')
    await lucia.waitForSelector('text=Armar un hogar')
    expect(await lucia.locator('text=Ya no estás en el hogar').count()).toBe(0) // lo pidió ella: no hace falta avisarlo
    expect(mapa(await rest(lucia, 'stock'))).toEqual(paraLucia)
    await santi.reload()
    await santi.waitForSelector('text=1 de 6 personas')
    expect(mapa(await rest(santi, 'stock'))).toEqual(delHogar)
  })

  await test.step('Santi saca a Lucía: ella se entera al volver a abrir la app', async () => {
    await santi.getByTestId('codigo-hogar').waitFor()
    codigo = await santi.getByTestId('codigo-hogar').innerText()
    await lucia.goto(APP + '/perfil')
    await lucia.click('button:has-text("Tengo un código")')
    await lucia.fill('#hg-codigo', codigo)
    await lucia.getByRole('button', { name: 'Unirme', exact: true }).click()
    await lucia.waitForSelector('text=2 de 6 personas')
    await santi.reload()
    await santi.waitForSelector('text=2 de 6 personas')
    await santi.click('button[aria-label="Sacar a Lucía del hogar"]')
    await captura(santi, 'h09_sacar', false)
    await confirmar(santi, 'Sacar')
    await santi.waitForSelector('text=Lucía ya no está en el hogar')
    await santi.waitForSelector('text=1 de 6 personas')
    await lucia.reload()
    await lucia.waitForSelector('text=Armar un hogar')
    expect(await aviso(lucia)).toContain('Ya no estás en el hogar')
    // y su despensa vuelve a ser suya
    const [lista] = await rest(lucia, 'stock')
    expect(lista).toBeTruthy()
    await captura(lucia, 'h10_fuera_del_hogar', false)
  })

  await ctxS.close()
  await ctxL.close()
  sinErrores(errores)
})

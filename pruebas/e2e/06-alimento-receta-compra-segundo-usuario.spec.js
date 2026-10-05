// Crear un alimento desde Registrar, una receta propia, una compra con precio, salir y volver a entrar, y un segundo usuario que no ve nada del primero. Usa la sesión de las pruebas anteriores.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, sinErrores } from './apoyo.js'

test('alimento nuevo, receta propia, compra con precio y segundo usuario', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  const errores = escuchar(pg, [], { dialogos: true })

  await test.step('alimento nuevo desde Registrar', async () => {
    await pg.goto(APP + '/registrar?comida=merienda')
    await pg.waitForSelector('text=Tu plato')
    await pg.click('button:has-text("Alimento")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'Barrita de cereal')
    await pg.click('button:has-text("Crear alimento nuevo")')
    await pg.selectOption('select >> nth=0', 'u')
    await pg.fill('input[placeholder="Ej.: 30"]', '23')
    await pg.fill('input[placeholder="kcal"]', '390')
    await pg.locator('input[placeholder="g"]').first().fill('6')
    await captura(pg, 's70_nuevo_alimento', false)
    await pg.click('button:has-text("Guardar")')
    await pg.waitForSelector('text=Barrita de cereal')
    await pg.fill('input[aria-label="Cantidad"]', '2')
    await captura(pg, 's71_registrar_barrita')
    await pg.locator('button:has-text("Agregar a la merienda")').click()
    await pg.waitForSelector('text=¡Hola, Santi!')
    expect(await pg.locator('text=Barrita de cereal').count()).toBe(1)
  })

  await test.step('receta nueva', async () => {
    await pg.goto(APP + '/recetas/nueva')
    await pg.waitForSelector('text=Ingredientes')
    await pg.fill('input[placeholder="Ej.: Pollo con arroz"]', 'Arroz con atún')
    for (const [nombre] of [['arroz', '80'], ['atún', '1']]) {
      await pg.click('button:has-text("Agregar")')
      await pg.fill('input[placeholder="Buscar alimento..."]', nombre)
      await pg.locator('div.divide-y button').first().click()
    }
    await pg.locator('input[aria-label^="Cantidad de Arroz"]').fill('80')
    await pg.fill('textarea', 'Hervir el arroz.\nMezclar con el atún.')
    await captura(pg, 's72_receta_nueva')
    await pg.click('button:has-text("Guardar receta")')
    await pg.waitForSelector('button:has-text("Editar")')
    await captura(pg, 's73_receta_propia')
  })

  await test.step('plan después de los cambios', async () => {
    await pg.goto(APP + '/plan')
    await pg.waitForSelector('text=Esta semana')
    await captura(pg, 's74_plan')
  })

  await test.step('compras: comprar algo con precio', async () => {
    await pg.goto(APP + '/compras')
    await pg.waitForSelector('text=Para comprar')
    await pg.locator('button:has-text("Comprado")').first().click()
    await pg.fill('#cp-precio', '1850.50')
    await pg.click('button:has-text("Confirmar compra")')
    await pg.waitForSelector('text=Sumado a tu despensa')
    await pg.waitForSelector('text=Compras del mes')
    await captura(pg, 's75_compras')
    const gasto = (await pg.locator('section:has-text("Gastaste")').innerText()).replaceAll('\n', ' | ')
    expect(gasto.includes('$5.051') || gasto.includes('$5.050'), gasto).toBe(true)
    await pg.locator('button[aria-label="Borrar compra"]').first().click()
    await pg.waitForSelector('[role=alertdialog]')
    await pg.click('[role=alertdialog] button:has-text("Borrar")')
    await pg.waitForTimeout(400)
    await pg.locator('section:has-text("Gastaste")').innerText()
  })

  await test.step('despensa con comida lista', async () => {
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('text=COMIDA LISTA')
    await captura(pg, 's76_despensa', false)
  })

  await test.step('salir y volver a entrar', async () => {
    await pg.goto(APP + '/perfil')
    await pg.click('button:has-text("Cerrar sesión")')
    await pg.waitForSelector('text=Iniciar sesión')
    await pg.fill('#email', 'santi@test.com')
    await pg.fill('#clave', 'malaclave')
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=El email o la contraseña no coinciden')
    await captura(pg, 's77_login_error', false)
    await pg.fill('#clave', 'Secreto1x')
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await captura(pg, 's78_diario_final')
  })

  await test.step('segundo usuario: no ve nada del primero', async () => {
    await pg.goto(APP + '/perfil')
    await pg.click('button:has-text("Cerrar sesión")')
    await pg.waitForSelector('text=Iniciar sesión')
    await pg.click('button:has-text("Crear cuenta")')
    await pg.fill('#email', 'otra@test.com')
    await pg.fill('#clave', 'Secreto2y')
    await pg.fill('#clave2', 'Secreto2y')
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=Armemos tu perfil')
  })

  await ctx.close()
  sinErrores(errores)
})

// Crear la cuenta y armar el perfil, con las validaciones de los dos formularios. Deja la sesión para las pruebas que siguen.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, guardarSesion, sinErrores } from './apoyo.js'

test('crear cuenta y armar el perfil', async ({ browser }) => {
  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  const errores = escuchar(pg)
  await pg.goto(APP + '/')
  await pg.waitForSelector('text=Crear cuenta')
  await captura(pg, 's01_acceso')

  await test.step('el selector de Entrar / Crear cuenta se desliza', async () => {
    const pastilla = pg.locator('span[aria-hidden=true]').first()
    const x0 = (await pastilla.boundingBox()).x
    await pg.click('button:has-text("Crear cuenta") >> nth=0')
    await pg.waitForTimeout(120)
    const x1 = (await pastilla.boundingBox()).x
    await pg.waitForTimeout(400)
    const x2 = (await pastilla.boundingBox()).x
    expect(x0 < x1 && x1 < x2, 'la pastilla no se anima').toBe(true)
    await captura(pg, 'v01_acceso_crear')
  })

  await test.step('validaciones del acceso', async () => {
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=Escribí tu email')
    await pg.fill('#email', 'santi@test.com')
    await pg.fill('#clave', '123')
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=todavía no cumple los requisitos')
    await pg.fill('#clave', 'Secreto1x')
    await pg.fill('#clave2', 'Secreto1x')
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=Armemos tu perfil')
  })

  await test.step('validaciones del perfil', async () => {
    await pg.click('button:has-text("Empezar")')
    await pg.waitForSelector('text=Completá este dato.')
    expect(await pg.locator('text=¡Hola').count()).toBe(0)
    await pg.fill('#pf-nombre', 'Santi')
    await pg.click('#pf-nac')
    await pg.keyboard.type('14092004')
    await pg.keyboard.type('4')
    // Una fecha imposible puesta "a la fuerza" no tiene que romper nada
    await pg.evaluate(() => {
      const el = document.querySelector('#pf-nac')
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
      set.call(el, '20044-09-14')
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await pg.fill('#pf-nac', '2030-01-01')
    await pg.waitForSelector('text=No puede ser posterior')
    await pg.fill('#pf-nac', '2004-09-14')
    await pg.click('#pf-altura')
    await pg.keyboard.type('170000')
    expect(await pg.inputValue('#pf-altura')).toBe('170')
    await pg.fill('#pf-altura', '300')
    await pg.waitForSelector('text=Tiene que estar entre 100 y 250.')
    await pg.fill('#pf-peso', '8')
    await pg.waitForSelector('text=Tiene que estar entre 30 y 300.')
    await captura(pg, 'v02_perfil_errores')
    expect(await pg.locator('#pf-kcal').count(), 'no tiene que calcular objetivo con datos inválidos').toBe(0)
    await pg.click('button:has-text("Empezar")')
    await pg.waitForTimeout(300)
    expect(await pg.locator('text=¡Hola').count(), 'guardó un perfil inválido').toBe(0)
  })

  await test.step('perfil válido: calcula el objetivo y entra al diario', async () => {
    await pg.fill('#pf-altura', '170')
    await pg.fill('#pf-peso', '80')
    await pg.fill('#pf-meta', '70')
    await pg.selectOption('#pf-act', '1.55')
    await pg.waitForTimeout(300)
    await pg.fill('#pf-liquido', '9')
    await pg.waitForSelector('text=Tiene que estar entre 0,5 y 6 litros.')
    await pg.fill('#pf-liquido', '')
    // objetivo manual fuera de rango
    await pg.click('button:has-text("Poner el mío")')
    await pg.fill('#pf-kcal', '9860')
    await pg.waitForSelector('text=Tiene que estar entre 1.000 y 6.000.')
    await pg.click('button:has-text("Usar el calculado")')
    await captura(pg, 's02_bienvenida')
    await pg.click('button:has-text("Empezar")')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await pg.waitForTimeout(300)
    await captura(pg, 's03_diario_vacio')
  })

  await guardarSesion(ctx)
  await ctx.close()
  sinErrores(errores)
})

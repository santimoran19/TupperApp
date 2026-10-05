// Modo oscuro: capturas de todas las pantallas y prueba del selector de tema. Usa la sesión de las pruebas anteriores.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, sinErrores } from './apoyo.js'

const fondo = () => getComputedStyle(document.body).backgroundColor

test('modo oscuro: todas las pantallas y el selector de tema', async ({ browser }) => {
  const errores = []
  let ctx
  let pg

  await test.step('sin sesión, con el sistema en oscuro', async () => {
    ctx = await contexto(browser, { colorScheme: 'dark' })
    pg = await ctx.newPage()
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=Iniciar sesión')
    await captura(pg, 'd01_acceso', false)
    await pg.click('button:has-text("Crear cuenta") >> nth=0')
    await pg.fill('#email', 'ana@gmial.com')
    await pg.fill('#clave', 'Cordoba2026')
    await pg.click('form button[type=submit]')
    await captura(pg, 'd02_crear', false)
    await pg.goto(APP + '/privacidad')
    await pg.waitForSelector('text=Política de privacidad')
    await captura(pg, 'd03_legal', false)
    await ctx.close()
  })

  await test.step('con sesión', async () => {
    ctx = await contexto(browser, { sesion: true, colorScheme: 'dark' })
    pg = await ctx.newPage()
    escuchar(pg, errores)
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await captura(pg, 'd10_diario')
    await pg.locator('button[aria-label^="Borrar "]').first().click()
    await pg.waitForSelector('[role=alertdialog]')
    await captura(pg, 'd11_confirmar', false)
    await pg.click('[role=alertdialog] button:has-text("Cancelar")')
    await pg.goto(APP + '/registrar?comida=merienda')
    await pg.waitForSelector('text=Tu plato')
    await pg.click('button:has-text("Bebida")')
    await pg.waitForSelector('input[placeholder="Buscar bebida..."]')
    await captura(pg, 'd12_bebidas', false)
    await pg.fill('input[placeholder="Buscar bebida..."]', 'mate')
    await pg.locator('div.divide-y > button').first().click()
    await pg.waitForSelector('text=Endulzado con')
    await pg.click('button:has-text("Azúcar")')
    await pg.click('button:has-text("Alimento")')
    await pg.fill('input[placeholder="Buscar alimento..."]', 'banana')
    await pg.locator('div.divide-y > button').first().click()
    await pg.fill('input[aria-label="Cantidad"] >> nth=1', '999')
    await captura(pg, 'd13_registrar')
    const pantallas = [
      ['/plan', 'Esta semana', 'd20_plan', true],
      ['/recetas', 'para cocinar', 'd21_recetas', false],
      ['/despensa', 'Lista de compras', 'd22_despensa', true],
      ['/compras', 'Para comprar', 'd23_compras', true],
      ['/resumen', 'ANÁLISIS CON IA', 'd24_resumen', true],
      ['/perfil', 'Apariencia', 'd25_perfil', true],
      ['/alimentos', 'Mis alimentos', 'd26_alimentos', false],
      ['/no-existe', 'Esa página no existe', 'd27_404', false],
    ]
    for (const [ruta, espera, nombre, completa] of pantallas) {
      await pg.goto(APP + ruta)
      await pg.waitForSelector('text=' + espera)
      await captura(pg, nombre, completa)
    }
    await pg.goto(APP + '/recetas')
    await pg.locator('a.tarjeta').first().click()
    await pg.waitForSelector('text=Ingredientes')
    await captura(pg, 'd28_receta')
    await pg.click('button:has-text("Cocinar")')
    await pg.waitForSelector('text=¿Cuántas porciones')
    await captura(pg, 'd29_cocinar', false)
    await pg.click('button[aria-label="Cerrar"]')
    await pg.goto(APP + '/recetas/nueva')
    await pg.waitForSelector('text=Ingredientes')
    await pg.click('button:has-text("Guardar receta")')
    await captura(pg, 'd30_receta_nueva')
    await pg.goto(APP + '/perfil')
    await pg.waitForSelector('text=Apariencia')
    await pg.click('button:has-text("Editar")')
    await pg.waitForSelector('#pf-altura')
    await pg.fill('#pf-altura', '300')
    await captura(pg, 'd31_editar_perfil', false)
    await pg.click('button[aria-label="Cerrar"]')
  })

  await test.step('selector de tema', async () => {
    expect(await pg.evaluate(fondo)).toBe('rgb(15, 21, 18)')
    await pg.click('button[role=radio]:has-text("Claro")')
    await pg.waitForTimeout(200)
    expect(await pg.evaluate(fondo)).toBe('rgb(249, 251, 248)')
    await pg.reload()
    await pg.waitForSelector('text=Apariencia')
    await pg.locator('button[role=radio][aria-checked=true]').innerText()
    expect(await pg.evaluate(fondo)).toBe('rgb(249, 251, 248)')
    await pg.click('button[role=radio]:has-text("Oscuro")')
    await pg.waitForTimeout(200)
    await pg.emulateMedia({ colorScheme: 'light' })
    await pg.waitForTimeout(200)
    expect(await pg.evaluate(fondo), 'oscuro forzado no depende del sistema').toBe('rgb(15, 21, 18)')
    await pg.click('button[role=radio]:has-text("Automático")')
    await pg.waitForTimeout(200)
    expect(await pg.evaluate(fondo)).toBe('rgb(249, 251, 248)')
    await pg.emulateMedia({ colorScheme: 'dark' })
    await pg.waitForTimeout(200)
    expect(await pg.evaluate(fondo), 'en automático sigue al sistema en vivo').toBe('rgb(15, 21, 18)')
  })

  await ctx.close()
  sinErrores(errores)
})

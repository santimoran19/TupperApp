// 1.32: códigos de recuperación y más de un dispositivo en la verificación en dos pasos (S-08), con la función `dos-pasos`
// corriendo de verdad en Deno (sin Deno se saltea), y la vuelta semanal y el reloj en el panel de administración (C-06,
// T-13). Cuenta nueva.
import { expect, test } from '@playwright/test'
import { APP, aviso, contexto, crearCuenta, escuchar, rest, simulador, sinErrores } from './apoyo.js'
import { codigoTotp } from './servidor/totp.mjs'

const EMAIL = 'recupero@test.com'
const CLAVE = 'Secreto9q'

test('códigos de recuperación, otro dispositivo y el panel con la vuelta semanal', async ({ browser }) => {
  const estado = await simulador('/_pruebas/estado')
  test.skip(!estado.dosPasos, 'sin Deno no corre la función `dos-pasos`')
  const errores = []
  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  await crearCuenta(pg, { email: EMAIL, clave: CLAVE, nombre: 'Rita', usuario: 'rita.rec' })
  const entrar = async () => {
    await pg.fill('#email', EMAIL)
    await pg.fill('#clave', CLAVE)
    await pg.click('form button[type=submit]')
    await expect(pg.getByTestId('codigo-dos-pasos')).toBeVisible()
  }
  const salir = async () => {
    await pg.goto(APP + '/perfil')
    await pg.click('button:has-text("Cerrar sesión")')
    await pg.waitForSelector('text=Iniciar sesión')
  }

  let primero
  let codigos
  await test.step('al activarla se muestran 10 códigos de recuperación, una sola vez', async () => {
    await pg.goto(APP + '/perfil')
    const dp = pg.getByTestId('dos-pasos')
    await dp.getByRole('button', { name: 'Activar' }).click()
    primero = (await dp.getByTestId('dos-pasos-secreto').innerText()).trim()
    await dp.getByLabel('Código de 6 números').fill(codigoTotp(primero))
    await dp.getByRole('button', { name: 'Activar' }).click()
    const lista = dp.getByTestId('codigos-recuperacion')
    await expect(lista).toBeVisible()
    codigos = await lista.locator('li').allInnerTexts()
    expect(codigos).toHaveLength(10)
    for (const c of codigos) expect(c).toMatch(/^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/)
    expect(new Set(codigos).size).toBe(10)
    await lista.getByRole('button', { name: 'Ya los guardé' }).click()
    await expect(dp.getByTestId('codigos-quedan')).toHaveText('Te quedan 10 códigos de recuperación.')
    // En la base no quedan los códigos, y la app no puede leer la tabla
    expect(await rest(pg, 'codigos_recuperacion')).toMatchObject({ message: expect.stringContaining('permission denied') })
  })

  let segundo
  await test.step('sumar otro dispositivo: después vale el código de cualquiera de los dos', async () => {
    const dp = pg.getByTestId('dos-pasos')
    await dp.getByRole('button', { name: 'Otro dispositivo' }).click()
    segundo = (await dp.getByTestId('dos-pasos-secreto').innerText()).trim()
    expect(segundo).not.toBe(primero)
    await dp.getByLabel('Código de 6 números').fill(codigoTotp(segundo))
    await dp.getByRole('button', { name: 'Sumar' }).click()
    await expect(dp.getByText('en 2 dispositivos')).toBeVisible()
    expect(await aviso(pg)).toContain('Dispositivo sumado')
    await salir()
    ctx.sinEsperarDatos = true
    await entrar()
    await pg.fill('#dp-codigo', codigoTotp(segundo))
    await pg.click('button:has-text("Entrar")')
    await pg.waitForSelector('text=¡Hola, Rita!')
    ctx.sinEsperarDatos = false
  })

  await test.step('perdí el teléfono: entrar con un código de recuperación saca la verificación', async () => {
    await salir()
    ctx.sinEsperarDatos = true
    await entrar()
    await pg.getByRole('button', { name: /Perdí el teléfono/ }).click()
    const rec = pg.getByTestId('recuperar-dos-pasos')
    await rec.getByLabel('Código de recuperación').fill('ABCD-EFGH')
    await rec.getByRole('button', { name: 'Entrar' }).click()
    await expect(rec.getByText('no es válido')).toBeVisible()
    await rec.getByLabel('Código de recuperación').fill(codigos[3].toLowerCase())
    await rec.getByRole('button', { name: 'Entrar' }).click()
    await pg.waitForSelector('text=¡Hola, Rita!')
    ctx.sinEsperarDatos = false
    expect(await aviso(pg)).toContain('Entraste con un código de recuperación')
    await pg.goto(APP + '/perfil')
    await expect(pg.getByTestId('dos-pasos').getByText('Opcional.')).toBeVisible()
    // Sin la verificación, entra con la contraseña sola
    await salir()
    await pg.fill('#email', EMAIL)
    await pg.fill('#clave', CLAVE)
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=¡Hola, Rita!')
  })

  await test.step('el panel de administración muestra la vuelta semanal', async () => {
    expect((await simulador('/_pruebas/admin', { email: EMAIL })).ok).toBe(true)
    await pg.goto(APP + '/admin')
    const semanas = pg.getByRole('region', { name: 'Vuelta semanal' })
    await expect(semanas).toBeVisible()
    expect(await semanas.getByRole('row').count()).toBeGreaterThan(1)
  })

  sinErrores(errores)
  await ctx.close()
})

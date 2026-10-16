// Nombre de usuario (F-17): se elige al crear la cuenta, se cambia en el perfil, se les pide a las cuentas que ya existían
// y sirve para iniciar sesión igual que el email (con la función `entrar` corriendo de verdad en Deno).
// Usa la sesión de las pruebas anteriores (la cuenta de Santi, que eligió "santi.m" en la primera).
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, simulador, sinErrores } from './apoyo.js'

const iniciar = async (pg, dato, clave) => {
  await pg.fill('#email', dato)
  await pg.fill('#clave', clave)
  await pg.click('form button[type=submit]')
}

test('nombre de usuario: elegirlo, cambiarlo, pedirlo y entrar con él', async ({ browser }) => {
  const { entrar } = await simulador('/_pruebas/estado')
  const errores = []

  await test.step('otra cuenta ya tiene su usuario ("lucia.v")', async () => {
    const ctx = await contexto(browser)
    const pg = await ctx.newPage()
    escuchar(pg, errores)
    await pg.goto(APP + '/')
    await pg.click('button:has-text("Crear cuenta") >> nth=0')
    await pg.fill('#email', 'lucia@test.com')
    await pg.fill('#clave', 'Secreto3z')
    await pg.fill('#clave2', 'Secreto3z')
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=Armemos tu perfil')
    await pg.fill('#pf-nombre', 'Lucía')
    await pg.fill('#pf-usuario', 'Lucia.V')
    await pg.fill('#pf-nac', '1995-05-05')
    await pg.fill('#pf-altura', '165')
    await pg.fill('#pf-peso', '60')
    await pg.click('button:has-text("Empezar")')
    await pg.waitForSelector('text=¡Hola, Lucía!')
    await ctx.close()
  })

  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)

  await test.step('el perfil muestra el usuario y se puede cambiar, con las mismas reglas', async () => {
    await pg.goto(APP + '/perfil')
    await pg.waitForSelector('text=@santi.m')
    await pg.click('button:has-text("Editar")')
    expect(await pg.inputValue('#pf-usuario')).toBe('santi.m')
    // el propio no se pregunta ni se marca como ocupado
    await pg.waitForTimeout(600)
    expect(await pg.locator('text=ya lo tiene otra persona').count()).toBe(0)
    await pg.fill('#pf-usuario', 'LUCIA.V')
    await pg.waitForSelector('text=Ese usuario ya lo tiene otra persona')
    await pg.fill('#pf-usuario', 'administrador')
    await pg.waitForSelector('text=Ese nombre no está disponible')
    await pg.fill('#pf-usuario', '')
    await pg.waitForSelector('text=Elegí un nombre de usuario.')
    await pg.fill('#pf-usuario', 'santi.nuevo')
    await pg.waitForSelector('text=Está libre')
    await captura(pg, 'x30_perfil_usuario', false)
    await pg.click('button:has-text("Guardar")')
    await pg.waitForSelector('text=Perfil guardado')
    await pg.waitForSelector('text=@santi.nuevo')
  })

  await test.step('una cuenta que ya existía y no tiene usuario: se le pide, y puede dejarlo para después', async () => {
    await simulador('/_pruebas/sin-usuario', { email: 'santi@test.com' })
    const otra = await ctx.newPage()
    escuchar(otra, errores)
    await otra.goto(APP + '/')
    await otra.waitForSelector('text=Elegí tu usuario')
    await captura(otra, 'x31_pedir_usuario', false)
    await otra.click('button:has-text("Ahora no")')
    await otra.waitForSelector('text=¡Hola, Santi!')
    // en esta misma sesión de la app no se vuelve a pedir...
    await otra.reload()
    await otra.waitForSelector('text=¡Hola, Santi!')
    expect(await otra.locator('text=Elegí tu usuario').count()).toBe(0)
    // ...pero al abrirla de nuevo, sí
    await otra.close()
    const nueva = await ctx.newPage()
    escuchar(nueva, errores)
    await nueva.goto(APP + '/')
    await nueva.waitForSelector('text=Elegí tu usuario')
    await nueva.fill('#pf-usuario', 'lucia.v')
    await nueva.waitForSelector('text=Ese usuario ya lo tiene otra persona')
    await nueva.fill('#pf-usuario', 'root')
    await nueva.waitForSelector('text=Ese nombre no está disponible')
    await nueva.fill('#pf-usuario', 'santi.m')
    await nueva.waitForSelector('text=Está libre')
    await nueva.click('button:has-text("Guardar")')
    await nueva.waitForSelector('text=¡Hola, Santi!')
    await nueva.goto(APP + '/perfil')
    await nueva.waitForSelector('text=@santi.m')
    await nueva.close()
  })

  await ctx.close()

  await test.step('iniciar sesión con el usuario o con el email, a elección', async () => {
    test.skip(!entrar, 'sin Deno no corre la función `entrar`')
    const c = await contexto(browser)
    const p = await c.newPage()
    escuchar(p, errores)
    await p.goto(APP + '/')
    await p.waitForSelector('text=Email o usuario')

    // equivocarse con un usuario que existe o con uno que no da exactamente el mismo mensaje
    await iniciar(p, 'santi.m', 'malaclave')
    await p.waitForSelector('text=El usuario o la contraseña no coinciden.')
    await p.fill('#email', 'nadie.existe')
    await p.click('form button[type=submit]')
    await p.waitForSelector('text=El usuario o la contraseña no coinciden.')
    await p.fill('#email', 'santi.m')
    await p.fill('#clave', '')
    await p.click('form button[type=submit]')
    await p.waitForSelector('text=Escribí tu contraseña.')

    // con el usuario (mayúsculas y espacios no importan); el email de la cuenta no viaja en la respuesta
    const respuesta = p.waitForResponse((r) => r.url().includes('/functions/v1/entrar'))
    await iniciar(p, ' SANTI.M ', 'Secreto1x')
    expect(await (await respuesta).text(), 'la función no tiene que devolver el email').not.toMatch(/@|santi@test/)
    await p.waitForSelector('text=¡Hola, Santi!')

    // el email sigue sirviendo
    await p.goto(APP + '/perfil')
    await p.click('button:has-text("Cerrar sesión")')
    await p.waitForSelector('text=Iniciar sesión')
    await iniciar(p, 'santi@test.com', 'Secreto1x')
    await p.waitForSelector('text=¡Hola, Santi!')

    // otra cuenta, con su usuario
    await p.goto(APP + '/perfil')
    await p.click('button:has-text("Cerrar sesión")')
    await p.waitForSelector('text=Iniciar sesión')
    await iniciar(p, 'lucia.v', 'Secreto3z')
    await p.waitForSelector('text=¡Hola, Lucía!')
    await c.close()
  })

  sinErrores(errores)
})

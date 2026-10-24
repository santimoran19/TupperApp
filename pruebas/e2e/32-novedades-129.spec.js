// 1.29: verificación en dos pasos (con códigos TOTP de verdad), "Deshacer" al borrar, el gráfico de peso con la
// estimación, anotar lo que dice el asistente y pegar una receta. Las funciones de IA se reemplazan por unas de mentira.
// Usa una cuenta nueva, así no depende de lo que dejaron las pruebas anteriores.
import { expect, test } from '@playwright/test'
import { APP, aviso, contexto, escuchar, hoyEnLaPagina, pedir, rest, saltarRecorrido, sinErrores } from './apoyo.js'
import { codigoTotp } from './servidor/totp.mjs'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const EMAIL = 'dospasos@test.com'
const CLAVE = 'Secreto9q'
const restarDias = (f, n) => {
  const d = new Date(f + 'T12:00:00')
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

test('dos pasos, deshacer, gráfico de peso, anotar desde el asistente y pegar una receta', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  const entrar = async () => {
    await pg.fill('#email', EMAIL)
    await pg.fill('#clave', CLAVE)
    await pg.click('form button[type=submit]')
  }
  const salir = async () => {
    await pg.goto(APP + '/perfil')
    await pg.click('button:has-text("Cerrar sesión")')
    await pg.waitForSelector('text=Iniciar sesión')
  }

  await test.step('cuenta nueva', async () => {
    await pg.goto(APP + '/')
    await pg.click('button:has-text("Crear cuenta") >> nth=0')
    await pg.fill('#email', EMAIL)
    await pg.fill('#clave', CLAVE)
    await pg.fill('#clave2', CLAVE)
    await pg.click('form button[type=submit]')
    await pg.waitForSelector('text=Armemos tu perfil')
    await pg.fill('#pf-nombre', 'Dora')
    await pg.fill('#pf-usuario', 'dora.dp')
    await pg.fill('#pf-nac', '1990-03-03')
    await pg.fill('#pf-altura', '168')
    await pg.fill('#pf-peso', '80')
    await pg.fill('#pf-meta', '72')
    await pg.check('#pf-consentimiento')
    await pg.click('button:has-text("Empezar")')
    await pg.waitForSelector('text=¡Hola, Dora!')
    await saltarRecorrido(pg)
  })

  let secreto
  await test.step('activar la verificación en dos pasos con la app autenticadora', async () => {
    await pg.goto(APP + '/perfil')
    const dp = pg.getByTestId('dos-pasos')
    await dp.getByRole('button', { name: 'Activar' }).click()
    secreto = (await dp.getByTestId('dos-pasos-secreto').innerText()).trim()
    expect(secreto).toMatch(/^[A-Z2-7]{32}$/)
    await expect(dp.getByRole('img', { name: 'Código QR para la app autenticadora' })).toBeVisible()
    // Un código equivocado no la activa
    await dp.getByLabel('Código de 6 números').fill('000000')
    await dp.getByRole('button', { name: 'Activar' }).click()
    await expect(dp.getByText('El código no es correcto')).toBeVisible()
    await dp.getByLabel('Código de 6 números').fill(codigoTotp(secreto))
    await dp.getByRole('button', { name: 'Activar' }).click()
    await expect(dp.getByText('Activada.')).toBeVisible()
    expect(await aviso(pg)).toContain('Verificación en dos pasos activada')
  })

  await test.step('al entrar pide el código, y sin él la base no da nada', async () => {
    await salir()
    ctx.sinEsperarDatos = true
    await entrar()
    await expect(pg.getByTestId('codigo-dos-pasos')).toBeVisible()
    expect(await rest(pg, 'profiles'), 'con solo la contraseña la base no muestra nada').toEqual([])
    await pg.fill('#dp-codigo', '123456')
    await pg.click('button:has-text("Entrar")')
    await expect(pg.getByText('El código no es correcto')).toBeVisible()
    await pg.fill('#dp-codigo', codigoTotp(secreto))
    await pg.click('button:has-text("Entrar")')
    await pg.waitForSelector('text=¡Hola, Dora!')
    ctx.sinEsperarDatos = false
    expect(await rest(pg, 'profiles')).toHaveLength(1)
    // Recargar no lo vuelve a pedir: la sesión ya es con el código
    await pg.reload()
    await pg.waitForSelector('text=¡Hola, Dora!')
  })

  await test.step('desactivarla', async () => {
    await pg.goto(APP + '/perfil')
    const dp = pg.getByTestId('dos-pasos')
    await dp.getByRole('button', { name: 'Desactivar' }).click()
    await pg.click('[role=alertdialog] button:has-text("Desactivar")')
    await expect(dp.getByText('Opcional.')).toBeVisible()
    await salir()
    await entrar()
    await pg.waitForSelector('text=¡Hola, Dora!')
  })

  // Un alimento de la base que se mide en gramos
  const [alimento] = await rest(pg, 'foods', '&owner=is.null&unit=eq.g&category=eq.Cereales')
  const hoy = await hoyEnLaPagina(pg)

  await test.step('Deshacer: en la despensa vuelve con la misma cantidad', async () => {
    await pedir(pg, 'POST', 'stock', '', [{ food_id: alimento.id, qty: 400 }])
    await pg.goto(APP + '/despensa')
    await pg.getByRole('button', { name: `Quitar ${alimento.name} de la despensa` }).click()
    await pg.click('[role=alertdialog] button:has-text("Quitar")')
    await expect(pg.getByTestId('aviso-accion')).toBeVisible()
    await expect.poll(async () => (await rest(pg, 'stock', `&food_id=eq.${alimento.id}`))[0]?.qty ?? 0).toBe(0)
    await pg.getByTestId('aviso-accion').click()
    await expect.poll(async () => Number((await rest(pg, 'stock', `&food_id=eq.${alimento.id}`))[0]?.qty)).toBe(400)
    expect(await aviso(pg)).toContain('volvió a la despensa')
  })

  await test.step('Deshacer: en la lista de compras', async () => {
    await pedir(pg, 'POST', 'shopping_items', '', [{ food_id: alimento.id, qty: 2 }])
    await pg.goto(APP + '/compras')
    await pg.getByRole('button', { name: `Quitar ${alimento.name}`, exact: true }).click()
    await expect.poll(async () => (await rest(pg, 'shopping_items')).length).toBe(0)
    await pg.getByTestId('aviso-accion').click()
    await expect.poll(async () => (await rest(pg, 'shopping_items')).map((s) => Number(s.qty))).toEqual([2])
  })

  await test.step('Deshacer: en el diario se vuelve a anotar igual', async () => {
    await pedir(pg, 'POST', 'log_entries', '', [
      { date: hoy, meal: 'almuerzo', name: alimento.name, food_id: alimento.id, qty: 150, kcal: 190 },
    ])
    await pg.goto(APP + '/')
    await pg
      .getByRole('button', { name: `Borrar ${alimento.name}` })
      .first()
      .click()
    await pg.click('[role=alertdialog] button:has-text("Borrar")')
    await expect.poll(async () => (await rest(pg, 'log_entries', `&date=eq.${hoy}`)).length).toBe(0)
    await pg.getByTestId('aviso-accion').click()
    await expect
      .poll(async () => (await rest(pg, 'log_entries', `&date=eq.${hoy}`)).map((r) => [r.meal, r.food_id, Number(r.qty)]))
      .toEqual([['almuerzo', alimento.id, 150]])
  })

  await test.step('gráfico de peso con la estimación de cuándo se llega a la meta', async () => {
    // Bajando medio kilo por semana desde hace 6 semanas
    await pedir(
      pg,
      'POST',
      'measurements',
      '?on_conflict=user_id,date',
      [0, 1, 2, 3, 4, 5, 6].map((s) => ({ date: restarDias(hoy, 42 - s * 7), weight_kg: 80 - s * 0.5 })),
      { Prefer: 'resolution=merge-duplicates' },
    )
    await pg.goto(APP + '/perfil')
    await expect(pg.getByTestId('grafico-peso')).toBeVisible()
    const est = pg.getByTestId('estimacion-peso')
    await expect(est).toContainText('0,5 kg')
    await expect(est).toContainText(/meta/i)
    const mes = pg.getByRole('radiogroup', { name: 'Período del gráfico' }).getByRole('radio', { name: '1 mes' })
    await mes.click()
    await expect(mes).toHaveAttribute('aria-checked', 'true')
    await expect(pg.getByTestId('grafico-peso')).toBeVisible()
  })

  await test.step('anotar lo que le contás al asistente', async () => {
    await ctx.route('**/functions/v1/asistente-ia', async (ruta) => {
      if (ruta.request().method() === 'OPTIONS') return ruta.fulfill({ status: 204, headers: CORS })
      await ruta.fulfill({
        status: 200,
        headers: { ...CORS, 'content-type': 'application/json' },
        body: JSON.stringify({
          respuesta: 'Te lo dejo listo para anotar.',
          anotar: { comida: 'cena', items: [{ nombre: alimento.name, cantidad: 200, unidad: 'g', gramos: 200 }] },
          restantes: 20,
        }),
      })
    })
    await pg.goto(APP + '/asistente')
    const entendido = pg.getByRole('button', { name: 'Entendido' })
    if (await entendido.isVisible()) await entendido.click()
    await pg.getByLabel('Tu pregunta').fill(`Cené 200 g de ${alimento.name}`)
    await pg.getByRole('button', { name: 'Mandar' }).click()
    await pg.getByTestId('asistente-anotar').click()
    await expect(pg).toHaveURL(/\/registrar\?fecha=/)
    await expect(pg.getByRole('heading', { name: 'Tu plato' })).toBeVisible({ timeout: 20000 })
    await expect(pg.getByText(alimento.name).first()).toBeVisible()
  })

  await test.step('pegar una receta y que la IA la arme', async () => {
    const pedidos = []
    await ctx.route('**/functions/v1/registrar-ia', async (ruta) => {
      if (ruta.request().method() === 'OPTIONS') return ruta.fulfill({ status: 204, headers: CORS })
      pedidos.push(ruta.request().postDataJSON())
      await ruta.fulfill({
        status: 200,
        headers: { ...CORS, 'content-type': 'application/json' },
        body: JSON.stringify({
          receta: {
            nombre: 'Arroz de la abuela',
            porciones: 3,
            minutos: 25,
            pasos: ['Hervir el arroz.', 'Servir.'],
            items: [{ nombre: alimento.name, cantidad: 300, unidad: 'g', gramos: 300, confianza: 0.9 }],
          },
          restantes: 4,
        }),
      })
    })
    await pg.goto(APP + '/recetas/nueva')
    await pg.getByTestId('pegar-receta').click()
    await pg.fill('#pr-texto', 'Arroz de la abuela, para 3. 300 g de arroz. Hervir el arroz y servir.')
    await pg.click('button:has-text("Armar receta")')
    await expect(pg.getByTestId('aviso-receta-ia')).toBeVisible()
    await expect(pg.locator('#rn-nombre')).toHaveValue('Arroz de la abuela')
    await expect(pg.locator('#rn-rinde')).toHaveValue('3')
    expect(pedidos[0]).toMatchObject({ tipo: 'receta' })
  })

  await ctx.close()
  sinErrores(errores)
})

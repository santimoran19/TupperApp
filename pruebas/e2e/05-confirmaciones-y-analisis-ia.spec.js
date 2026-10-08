// La confirmación antes de borrar, la página que no existe y el análisis con IA (función real en Deno contra el servidor simulado). Usa la sesión de la prueba anterior y la deja para las que siguen.
import { expect, test } from '@playwright/test'
import { API, APP, captura, contexto, escuchar, guardarSesion, rest, simulador, sinErrores } from './apoyo.js'

test('confirmación antes de borrar, página que no existe y análisis con IA', async ({ browser }) => {
  const { funcion } = await simulador('/_pruebas/estado')
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  const errores = escuchar(pg)
  await pg.goto(APP + '/')
  await pg.waitForSelector('text=¡Hola, Santi!')

  await test.step('confirmación antes de borrar', async () => {
    const antes = await pg.locator('header .pill').innerText()
    await pg.locator('button[aria-label^="Borrar "]').first().click()
    await pg.waitForSelector('[role=alertdialog]')
    await captura(pg, 'x01_confirmar', false)
    await pg.click('[role=alertdialog] button:has-text("Cancelar")')
    await pg.waitForTimeout(300)
    expect(
      (await pg.locator('[role=alertdialog]').count()) === 0 && (await pg.locator('header .pill').innerText()) === antes,
      'cancelar no tiene que borrar',
    ).toBe(true)
    await pg.locator('button[aria-label^="Borrar "]').first().click()
    await pg.keyboard.press('Escape')
    await pg.waitForTimeout(300)
    expect(
      (await pg.locator('[role=alertdialog]').count()) === 0 && (await pg.locator('header .pill').innerText()) === antes,
      'Escape tiene que cancelar',
    ).toBe(true)
    await pg.locator('button[aria-label^="Borrar "]').first().click()
    await pg.click('[role=alertdialog] button:has-text("Borrar")')
    await pg.waitForTimeout(500)
    expect(await pg.locator('header .pill').innerText()).not.toBe(antes)
  })

  await test.step('página que no existe', async () => {
    await pg.goto(APP + '/esto-no-existe')
    await pg.waitForSelector('text=Esa página no existe')
    await captura(pg, 'x02_404', false)
    await pg.click('a:has-text("Ir al diario")')
    await pg.waitForSelector('text=¡Hola, Santi!')
  })

  if (funcion) {
    await test.step('análisis con IA', async () => {
      await pg.goto(APP + '/resumen')
      await pg.waitForSelector('text=ANÁLISIS CON IA')
      await pg.locator('div.grid.grid-cols-2 > div').nth(2).innerText()
      expect(await pg.locator('text=sin tu nombre ni tu email').count()).toBe(1)
      await pg.click('button:has-text("Analizar mi semana")')
      await pg.waitForSelector('text=Lo que viene bien', { timeout: 20000 })
      await captura(pg, 'x03_ia')
      const pedido = (await simulador('/anthropic/_pedidos')).at(-1)
      const guardadoModelo = async () => (await rest(pg, 'ai_analyses', ''))[0].model
      const datos = JSON.parse(pedido.messages[0].content.split('\n').slice(1).join('\n'))
      const crudo = JSON.stringify(datos)
      expect(!crudo.includes('Santi') && !crudo.includes('santi@test.com'), 'no se manda nombre ni mail').toBe(true)
      if (pedido.proveedor === 'groq') {
        expect(pedido.model).toBe('openai/gpt-oss-120b')
        expect(pedido.clave).toBe('clave-de-prueba')
        expect(pedido.extra).toEqual({ reasoning_effort: 'low', include_reasoning: false, temperature: 0.4 })
        expect(await guardadoModelo()).toBe('openai/gpt-oss-120b')
      } else {
        expect(pedido.model).toBe('claude-haiku-4-5-20251001')
        expect(pedido.version).toBe('2023-06-01')
      }
      await rest(pg, 'ai_analyses', '')
      // queda guardado: al volver a entrar sigue ahí sin pedirlo de nuevo
      await pg.reload()
      await pg.waitForSelector('text=Para la semana que viene')
      expect((await simulador('/anthropic/_pedidos')).length).toBe(1)
      // respuesta que no es JSON: se muestra igual como texto
      await simulador('/anthropic/_modo', { modo: 'texto' })
      await pg.click('button:has-text("Actualizar el análisis")')
      await pg.waitForSelector('text=te faltó proteína', { timeout: 20000 })
      if (pedido.proveedor === 'groq') {
        await simulador('/anthropic/_modo', { modo: 'cortado' })
        const n = (await rest(pg, 'ai_analyses', '')).length
        await pg.click('button:has-text("Actualizar el análisis")')
        await pg.waitForSelector('text=No se pudo generar el análisis', { timeout: 20000 })
        expect((await rest(pg, 'ai_analyses', '')).length, 'una respuesta cortada no se guarda').toBe(n)
      }
      // la IA saturada: avisa y no gasta cupo
      await simulador('/anthropic/_modo', { modo: 'saturado' })
      await pg.click('button:has-text("Actualizar el análisis")')
      await pg.waitForSelector('text=mucha demanda', { timeout: 20000 })
      // clave mal puesta
      await simulador('/anthropic/_modo', { modo: 'error' })
      await pg.click('button:has-text("Actualizar el análisis")')
      await pg.waitForSelector('text=no está bien configurado', { timeout: 20000 })
      await simulador('/anthropic/_modo', { modo: 'ok' })
      await pg.click('button:has-text("Actualizar el análisis")')
      await pg.waitForSelector('text=Lo que viene bien', { timeout: 20000 })
      // tope diario: el cuarto pedido no pasa
      const nAntes = (await simulador('/anthropic/_pedidos')).length
      await pg.click('button:has-text("Actualizar el análisis")')
      await pg.waitForSelector('text=Ya pediste 3 análisis', { timeout: 20000 })
      await captura(pg, 'x04_ia_limite')
      expect((await simulador('/anthropic/_pedidos')).length, 'con el tope alcanzado no se consulta al modelo').toBe(nAntes)
      expect((await rest(pg, 'ai_analyses', '')).length).toBe(3)
      // no se pueden borrar para saltear el tope
      await pg.evaluate(async (api) => {
        const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
        const ses = JSON.parse(localStorage.getItem(k))
        return (
          await fetch(api + '/rest/v1/ai_analyses?user_id=eq.' + ses.user.id, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + ses.access_token, apikey: 'test' },
          })
        ).status
      }, API)
      // semana sin datos: el botón queda apagado
      await pg.click('button[aria-label="Semana anterior"]')
      await pg.waitForSelector('text=Semana pasada')
      expect(await pg.locator('button:has-text("Analizar mi semana")').isDisabled()).toBe(true)
      expect(await pg.locator('text=Registrá al menos 2 días').count()).toBe(1)
      // función sin sesión válida
      const estado = await pg.evaluate(
        async (api) =>
          (
            await fetch(api + '/functions/v1/analizar-semana', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ semana: '2026-09-28' }),
            })
          ).status,
        API,
      )
      expect(estado).toBe(401)
    })
  } else {
    test.info().annotations.push({ type: 'aviso', description: 'Deno no está instalado: no se probó el análisis con IA' })
  }

  await guardarSesion(ctx)
  await ctx.close()
  sinErrores(errores)
})

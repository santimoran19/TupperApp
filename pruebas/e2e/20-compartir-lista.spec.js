// Compartir la lista de compras (F-05): en el teléfono abre el menú de compartir con el texto de la lista; sin ese menú (la compu)
// abre WhatsApp con el texto escrito; y se puede copiar. Usa la sesión de las pruebas anteriores.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, sinErrores } from './apoyo.js'

const ventana = (pg) => pg.locator('div.fixed.inset-0.z-50 > div.relative')

test('compartir la lista de compras: menú del teléfono, WhatsApp directo y copiar', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP })
  // WhatsApp de mentira: las pruebas no salen a internet
  const abiertos = []
  await ctx.route('https://wa.me/**', (ruta) => {
    abiertos.push(ruta.request().url())
    return ruta.fulfill({ status: 200, contentType: 'text/html', body: '<title>WhatsApp</title>' })
  })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  let filas = []

  await test.step('con algo anotado aparecen los botones de compartir y copiar', async () => {
    await pg.goto(APP + '/compras')
    await pg.waitForSelector('text=Para comprar')
    await pg.click('button:has-text("Anotar")')
    await expect(ventana(pg)).toBeVisible()
    await pg.fill('input[placeholder="Buscar alimento..."]', 'arroz integral')
    await ventana(pg)
      .getByRole('button', { name: /^Arroz/ })
      .first()
      .click()
    await expect(ventana(pg)).toHaveCount(0)
    await expect(pg.getByRole('button', { name: 'Compartir' })).toBeVisible()
    await expect(pg.getByRole('button', { name: 'Copiar la lista' })).toBeVisible()
    // Lo que se ve en la lista: nombre y cantidad de cada fila
    filas = await pg
      .locator('div.tarjeta.divide-y')
      .first()
      .locator('> div')
      .evaluateAll((els) =>
        els.map((e) => ({
          nombre: e.querySelector('p.font-medium').innerText,
          cantidad: e.querySelector('p.text-xs').innerText.split(' · ')[0],
        })),
      )
    expect(filas.length).toBeGreaterThan(0)
    await captura(pg, 's95_compras_compartir', false)
  })

  await test.step('en un teléfono angosto los botones entran y no se corre la pantalla', async () => {
    for (const ancho of [320, 360]) {
      await pg.setViewportSize({ width: ancho, height: 700 })
      const medidas = await pg.evaluate(() => ({
        ancho: document.documentElement.scrollWidth,
        vista: window.innerWidth,
        botones: ['Compartir', 'Copiar la lista', 'Anotar'].map((n) => {
          const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || x.innerText).trim().startsWith(n))
          const r = b.getBoundingClientRect()
          return { n, izq: r.left, der: r.right }
        }),
      }))
      expect(medidas.ancho, `${ancho}px: sin scroll de costado`).toBeLessThanOrEqual(medidas.vista)
      for (const b of medidas.botones) {
        expect(b.izq, `${ancho}px: ${b.n}`).toBeGreaterThanOrEqual(0)
        expect(b.der, `${ancho}px: ${b.n}`).toBeLessThanOrEqual(medidas.vista)
      }
    }
    await pg.setViewportSize({ width: 412, height: 900 })
  })

  await test.step('en el teléfono se abre el menú de compartir con el texto de la lista', async () => {
    await pg.evaluate(() => {
      window.__compartido = null
      navigator.share = async (datos) => {
        window.__compartido = datos
      }
    })
    await pg.getByRole('button', { name: 'Compartir' }).click()
    await expect.poll(() => pg.evaluate(() => window.__compartido)).not.toBeNull()
    const datos = await pg.evaluate(() => window.__compartido)
    expect(datos.text.split('\n')[0]).toMatch(/^\*Lista de compras/)
    for (const f of filas) expect(datos.text, f.nombre).toContain(`• ${f.nombre}: ${f.cantidad}`)
    expect(abiertos).toHaveLength(0)
  })

  await test.step('si la persona cierra el menú sin mandar, no pasa nada más', async () => {
    await pg.evaluate(() => {
      navigator.share = async () => {
        throw new DOMException('cancelado', 'AbortError')
      }
    })
    await pg.getByRole('button', { name: 'Compartir' }).click()
    await pg.waitForTimeout(300)
    expect(abiertos).toHaveLength(0)
  })

  await test.step('sin menú de compartir (la compu) se abre WhatsApp con el texto ya escrito', async () => {
    await pg.evaluate(() => {
      navigator.share = undefined
    })
    const [popup] = await Promise.all([ctx.waitForEvent('page'), pg.getByRole('button', { name: 'Compartir' }).click()])
    await popup.waitForLoadState()
    expect(popup.url().startsWith('https://wa.me/?text=')).toBe(true)
    const texto = decodeURIComponent(popup.url().split('text=')[1])
    expect(texto.split('\n')[0]).toMatch(/^\*Lista de compras/)
    for (const f of filas) expect(texto, f.nombre).toContain(`• ${f.nombre}: ${f.cantidad}`)
    await popup.close()
  })

  await test.step('copiar deja el texto en el portapapeles y avisa', async () => {
    await pg.getByRole('button', { name: 'Copiar la lista' }).click()
    await expect(pg.getByText('Lista copiada')).toBeVisible()
    const copiado = await pg.evaluate(() => navigator.clipboard.readText())
    expect(copiado.split('\n')[0]).toMatch(/^\*Lista de compras/)
    for (const f of filas) expect(copiado, f.nombre).toContain(`• ${f.nombre}: ${f.cantidad}`)
  })

  await test.step('sin nada para comprar no hay botones de compartir', async () => {
    // Se quita lo que se anotó acá; lo que falta para el plan aparece solo, así que se mira solo si quedó vacía
    const quitar = pg.locator('button[aria-label="Quitar Arroz integral (crudo)"]')
    await quitar.click()
    await expect(quitar).toHaveCount(0)
    if ((await pg.getByText('No falta nada').count()) > 0) {
      await expect(pg.getByRole('button', { name: 'Compartir' })).toHaveCount(0)
      await expect(pg.getByRole('button', { name: 'Copiar la lista' })).toHaveCount(0)
    }
  })

  sinErrores(errores)
  await ctx.close()
})

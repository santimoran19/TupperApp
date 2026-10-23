// Lo nuevo de la 1.24: vencimientos en la despensa, fotos propias, la silueta para elegir la meta, el mapa de músculos y
// los dibujos 3D (o su versión 2D si el navegador no tiene WebGL). Usa la sesión de las anteriores.
import { expect, test } from '@playwright/test'
import { API, APP, captura, contexto, escuchar, rest, sinErrores } from './apoyo.js'

// Pide algo a la base simulada con la sesión de la página y devuelve la respuesta
const llamar = (pg, metodo, ruta, cuerpo, cabeceras = {}) =>
  pg.evaluate(
    async ([api, metodo, ruta, cuerpo, cabeceras]) => {
      const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
      const ses = JSON.parse(localStorage.getItem(k))
      const h = { Authorization: 'Bearer ' + ses.access_token, apikey: 'test', 'Content-Type': 'application/json', ...cabeceras }
      const r = await fetch(api + ruta, { method: metodo, headers: h, body: cuerpo ? JSON.stringify(cuerpo) : undefined })
      const texto = await r.text()
      if (!r.ok) throw new Error(`${metodo} ${ruta}: ${r.status} ${texto}`)
      return { uid: ses.user.id, datos: texto ? JSON.parse(texto) : null }
    },
    [API, metodo, ruta, cuerpo, cabeceras],
  )

test('despensa con vencimientos, fotos, silueta, músculos y 3D', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  const tarjeta = (nombre) => pg.locator('div.tarjeta', { has: pg.locator(`p.font-semibold:text-is("${nombre}")`) })
  let huevo

  await test.step('vencimientos: poner la fecha, verla en la tarjeta y arriba en "Usá esto primero"', async () => {
    await pg.goto(APP + '/despensa')
    ;[huevo] = await rest(pg, 'foods', '&slug=eq.huevo')
    // Las pruebas anteriores dejaron huevos en la despensa
    await expect(tarjeta('Huevo')).toBeVisible()
    await tarjeta('Huevo').locator('button.px-1').click()
    await pg.fill('#dp-vence', '2026-10-04') // la app cree que hoy es el 3/10
    await pg.click('div.fixed button:has-text("Guardar")')
    await expect(tarjeta('Huevo').getByText('Vence mañana')).toBeVisible()
    const primero = pg.locator('section[aria-labelledby="des-primero"]')
    await expect(primero.getByText('Huevo')).toBeVisible()
    const [fila] = await rest(pg, 'stock', `&food_id=eq.${huevo.id}`)
    expect(String(fila.expires_on).slice(0, 10)).toBe('2026-10-04')
    await captura(pg, 'z01_despensa_vence')
  })

  await test.step('las recetas con huevo aparecen primero y dicen que usan algo que vence', async () => {
    await pg
      .locator('section[aria-labelledby="des-primero"] div.w-40', { has: pg.locator('p:text-is("Huevo")') })
      .getByRole('link', { name: 'Ver recetas' })
      .click()
    await expect(pg).toHaveURL(new RegExp(`/recetas\\?con=${huevo.id}`))
    await expect(pg.getByText('Recetas con')).toBeVisible()
    const tarjetas = pg.locator('a.tarjeta')
    await expect(tarjetas.first()).toBeVisible()
    // Todas usan huevo
    const n = await tarjetas.count()
    expect(n).toBeGreaterThan(0)
    await expect(pg.getByText(/Usa algo que vence mañana/).first()).toBeVisible()
    await pg.click('button[aria-label="Ver todas las recetas"]')
    await expect(pg.getByText('Recetas con')).toHaveCount(0)
    expect(await pg.locator('a.tarjeta').count()).toBeGreaterThan(n)
  })

  await test.step('al agotarse, la fecha se borra sola', async () => {
    await pg.goto(APP + '/despensa')
    await tarjeta('Huevo').locator('button.px-1').click()
    await pg.locator('div.fixed input[inputmode]').first().fill('0')
    await pg.click('div.fixed button:has-text("Guardar")')
    await expect(tarjeta('Huevo').getByText('Agotado')).toBeVisible()
    await expect(tarjeta('Huevo').getByText('Vence mañana')).toHaveCount(0)
    const [fila] = await rest(pg, 'stock', `&food_id=eq.${huevo.id}`)
    expect(fila.expires_on).toBeNull()
    // Vuelve a tener
    await tarjeta('Huevo').locator('button.px-1').click()
    await pg.locator('div.fixed input[inputmode]').first().fill('6')
    await pg.click('div.fixed button:has-text("Guardar")')
    await expect(tarjeta('Huevo').getByText('Agotado')).toHaveCount(0)
  })

  await test.step('fotos: ponerle una foto a un alimento propio, verla y quitarla', async () => {
    const { uid } = await llamar(pg, 'GET', '/rest/v1/profiles?select=id')
    await llamar(pg, 'POST', '/rest/v1/foods', {
      owner: uid,
      name: 'Pan de campo casero',
      unit: 'g',
      kcal: 260,
      protein: 9,
      carbs: 50,
      fat: 2,
      category: 'Panadería',
    })
    await pg.goto(APP + '/alimentos')
    await pg.click('button[aria-label="Editar Pan de campo casero"]')
    // Una imagen de verdad: la arma el mismo navegador
    const bytes = await pg.evaluate(async () => {
      const c = document.createElement('canvas')
      c.width = 800
      c.height = 600
      const g = c.getContext('2d')
      g.fillStyle = '#c98a4e'
      g.fillRect(0, 0, 800, 600)
      g.fillStyle = '#7a4a1e'
      g.fillRect(200, 150, 400, 300)
      const b = await new Promise((ok) => c.toBlob(ok, 'image/png'))
      return [...new Uint8Array(await b.arrayBuffer())]
    })
    await pg.setInputFiles('input[type=file][aria-label="Elegir una foto"]', {
      name: 'pan.png',
      mimeType: 'image/png',
      buffer: Buffer.from(bytes),
    })
    await expect(pg.getByText('Foto guardada')).toBeVisible()
    const [pan] = await rest(pg, 'foods', '&name=eq.Pan de campo casero')
    expect(pan.image_path).toMatch(new RegExp(`^u/${uid}/[0-9a-f]{24}\\.(webp|jpg)$`))
    // La foto se sube achicada y en un cuadrado
    const foto = await fetch(`${API}/storage/v1/object/public/fotos/${pan.image_path}`)
    expect(foto.status).toBe(200)
    expect(foto.headers.get('content-type')).toMatch(/image\/(webp|jpeg)/)
    expect((await foto.arrayBuffer()).byteLength).toBeLessThan(280 * 1024)
    await expect(pg.locator('div.fixed img').first()).toBeVisible()
    await captura(pg, 'z02_foto', false)
    // Quitarla la borra también del almacenamiento
    await pg.locator('div.fixed button:has-text("Quitar")').first().click()
    await pg.click('[role=alertdialog] button:has-text("Quitar")')
    await expect(pg.getByText('Foto quitada')).toBeVisible()
    expect((await rest(pg, 'foods', '&name=eq.Pan de campo casero'))[0].image_path).toBeNull()
    await expect.poll(async () => (await fetch(`${API}/storage/v1/object/public/fotos/${pan.image_path}`)).status).toBe(400)
    await pg.click('button[aria-label="Cerrar"]')
  })

  await test.step('silueta: elegir otro peso y usarlo como meta', async () => {
    await pg.goto(APP + '/perfil')
    const sil = pg.locator('section[aria-labelledby="pf-silueta"]')
    await expect(sil).toBeVisible()
    await sil.locator('#sil-peso').fill('72')
    await expect(sil.getByText('Con 72 kg')).toBeVisible()
    await sil.getByRole('button', { name: 'Usar 72 kg como mi meta' }).click()
    await expect.poll(async () => Number((await rest(pg, 'profiles'))[0].goal_weight_kg)).toBe(72)
    await captura(pg, 'z03_silueta', false)
  })

  await test.step('músculos: un entrenamiento con músculos marcados aparece en el mapa y se corrige', async () => {
    const { uid } = await llamar(pg, 'GET', '/rest/v1/profiles?select=id')
    await llamar(pg, 'PATCH', `/rest/v1/profiles?id=eq.${uid}`, { gasto_activo: true, gasto_consentimiento: new Date().toISOString() })
    const [tipo] = await rest(pg, 'exercise_types', '&slug=eq.funcional')
    const W = '27000000-0000-0000-0000-000000000001'
    await llamar(pg, 'POST', '/rest/v1/rpc/guardar_entrenamiento', {
      p_id: W,
      p_datos: {
        fecha: '2026-10-03',
        type_id: tipo.id,
        name: tipo.name,
        duration_min: 30,
        rpe: 6,
        kcal: 200,
        metodo: 'mets',
        muscles: ['abdomen'],
      },
      p_series: [],
    })
    await pg.goto(APP + '/ejercicio')
    const mapa = pg.locator('section[aria-labelledby="ej-musculos"]')
    await expect(mapa).toBeVisible()
    await mapa.locator('[role=button][aria-label^="Abdomen y core"]').first().click()
    await expect(mapa.locator('[aria-live=polite]')).toContainText('Abdomen y core')
    await expect(mapa.locator('[aria-live=polite]')).toContainText('entrenamiento')
    // Corregirlo: sumar pecho desde el formulario
    await pg.getByText('Entrenamiento funcional').first().click()
    await expect(pg.getByText('¿Qué músculos trabajaste?')).toBeVisible()
    await pg.locator('div.fixed button[aria-pressed]:has-text("Pecho")').click()
    await pg.click('div.fixed button:has-text("Guardar cambios")')
    await expect.poll(async () => [...((await rest(pg, 'workouts', `&id=eq.${W}`))[0]?.muscles || [])].sort()).toEqual(['abdomen', 'pecho'])
    await captura(pg, 'z04_musculos', false)
  })

  await test.step('3D: el tupper del día (o el anillo si no hay WebGL) y el interruptor para apagarlo', async () => {
    await pg.goto(APP + '/')
    const resumen = pg.locator('[data-tour="diario-resumen"]')
    await expect(resumen.getByText(/kcal de [\d.]+/)).toBeVisible()
    const hayWebGL = await pg.evaluate(() => !!document.createElement('canvas').getContext('webgl'))
    if (hayWebGL) await expect(resumen.locator('canvas')).toHaveCount(1)
    await pg.goto(APP + '/perfil')
    const llave = pg.getByRole('switch', { name: /Dibujos en 3D/ })
    if (hayWebGL) {
      await llave.uncheck()
      await pg.goto(APP + '/')
      await expect(resumen.getByText(/kcal de [\d.]+/)).toBeVisible()
      await expect(resumen.locator('canvas')).toHaveCount(0)
      await pg.goto(APP + '/perfil')
      await pg.getByRole('switch', { name: /Dibujos en 3D/ }).check()
    }
  })

  sinErrores(errores)
  await ctx.close()
})

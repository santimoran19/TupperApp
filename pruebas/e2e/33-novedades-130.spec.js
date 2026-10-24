// 1.30: consejos de la despensa en carrusel, sacar de la lista de compras lo que falta para el plan, categorías propias,
// esqueletos de carga y traer entrenamientos de archivos GPX/TCX y de Strava (la función, de mentira). Cuenta nueva.
import { expect, test } from '@playwright/test'
import { API, APP, aviso, contexto, crearCuenta, escuchar, hoyEnLaPagina, pedir, rest, sinErrores } from './apoyo.js'

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }
const sumarDias = (f, n) => {
  const d = new Date(f + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
const GPX = (fecha) => `<?xml version="1.0"?>
<gpx version="1.1" creator="Coros"><trk><name>Fondo suave</name><type>running</type><trkseg>
${Array.from({ length: 31 }, (_, i) => `<trkpt lat="${(-31.4 + i * 0.0006).toFixed(5)}" lon="-64.18"><ele>${400 + (i % 5)}</ele><time>${fecha}T12:${String(i).padStart(2, '0')}:00Z</time></trkpt>`).join('')}
</trkseg></trk></gpx>`

test('consejos, lista de compras, categorías, esqueletos y entrenamientos importados', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  await crearCuenta(pg, { email: 'novedades130@test.com', nombre: 'Nico', usuario: 'nico.130' })
  const hoy = await hoyEnLaPagina(pg)
  const [arroz] = await rest(pg, 'foods', '&owner=is.null&slug=eq.arroz')
  const [leche] = await rest(pg, 'foods', '&owner=is.null&slug=eq.leche-entera')
  const [banana] = await rest(pg, 'foods', '&owner=is.null&slug=eq.banana')
  const [yerba] = await rest(pg, 'foods', '&owner=is.null&slug=eq.yerba')

  await test.step('consejos de la despensa: primero lo que vence, en un carrusel', async () => {
    await pedir(pg, 'POST', 'stock', '', [
      { food_id: arroz.id, qty: 1000 },
      { food_id: leche.id, qty: 1000, expires_on: sumarDias(hoy, 1) },
      { food_id: banana.id, qty: 4 },
      { food_id: yerba.id, qty: 500 },
    ])
    await pg.goto(APP + '/despensa')
    const carrusel = pg.locator('[data-testid=consejos]:visible')
    await expect(carrusel).toBeVisible()
    const consejos = carrusel.getByTestId('consejo')
    expect(await consejos.count()).toBeGreaterThanOrEqual(4)
    await expect(consejos.first()).toContainText('ANTES DE QUE VENZA')
    await expect(consejos.first()).toContainText(leche.name)
    await carrusel.getByRole('button', { name: 'Consejo siguiente' }).click()
    await expect(carrusel.getByText(/^Consejo 2 de \d+$/)).toBeAttached()
  })

  await test.step('lista de compras: se puede sacar lo que falta para el plan (y volver a ponerlo)', async () => {
    await pedir(pg, 'POST', 'plan', '', [{ date: sumarDias(hoy, 1), meal: 'almuerzo', food_id: banana.id, qty: 8 }])
    await pg.goto(APP + '/compras')
    const fila = pg.getByRole('button', { name: `Quitar ${banana.name}`, exact: true })
    await expect(fila).toBeVisible()
    await fila.click()
    await expect(fila).toHaveCount(0)
    expect(await aviso(pg)).toContain(`Sacaste ${banana.name}`)
    // Deshacer
    await pg.getByTestId('aviso-accion').click()
    await expect(fila).toBeVisible()
    await fila.click()
    // Sigue sacado al volver a la pantalla, y se puede devolver
    await pg.goto(APP + '/compras')
    await expect(fila).toHaveCount(0)
    await pg
      .getByTestId('compras-quitados')
      .getByRole('button', { name: /Sacaste 1 cosa/ })
      .click()
    await pg.getByRole('button', { name: 'Volver a la lista' }).click()
    await expect(fila).toBeVisible()
  })

  await test.step('categorías propias: crear, mover un alimento de la base, renombrar y borrar', async () => {
    await pg.goto(APP + '/alimentos')
    const cat = pg.getByTestId('categorias')
    await cat.getByRole('button', { name: 'Nueva categoría' }).click()
    await pg.fill('#cat-nombre', 'Lácteos')
    await pg.getByRole('button', { name: 'Crear', exact: true }).click()
    await expect(pg.getByText('Ya existe una categoría con ese nombre.')).toBeVisible()
    await pg.fill('#cat-nombre', 'Para el mate')
    await pg.getByRole('button', { name: 'Crear', exact: true }).click()
    await expect(cat.getByText('Para el mate', { exact: true })).toBeVisible()
    expect((await rest(pg, 'categorias')).map((c) => c.nombre)).toEqual(['Para el mate'])

    // Mover la yerba (de la base) a "Para el mate": cambia solo para esta cuenta
    await pg.goto(APP + '/despensa')
    await pg
      .locator('.tarjeta', { has: pg.locator('p.font-semibold', { hasText: yerba.name }) })
      .locator('button.px-1')
      .click()
    await pg.selectOption('#dp-categoria', 'Para el mate')
    await expect(pg.getByText('lo moviste solo para vos')).toBeVisible()
    await expect.poll(async () => (await rest(pg, 'categoria_alimento')).map((c) => c.categoria)).toEqual(['Para el mate'])
    await pg.keyboard.press('Escape')
    await expect(pg.getByRole('button', { name: /^Para el mate/ })).toBeVisible()

    // Renombrar se lleva el alimento
    await pg.goto(APP + '/alimentos')
    await cat.getByRole('button', { name: 'Renombrar Para el mate' }).click()
    await pg.fill('#cat-nombre', 'Matecito')
    await pg.getByRole('button', { name: 'Guardar', exact: true }).click()
    await expect(cat.getByText('Matecito', { exact: true })).toBeVisible()
    await expect(cat.getByText('1 alimento')).toBeVisible()
    expect((await rest(pg, 'categoria_alimento')).map((c) => c.categoria)).toEqual(['Matecito'])
    // Borrar: la yerba vuelve a su categoría de siempre
    await cat.getByRole('button', { name: 'Borrar la categoría Matecito' }).click()
    await pg.click('[role=alertdialog] button:has-text("Borrar")')
    await expect(cat.getByText('Matecito', { exact: true })).toHaveCount(0)
    expect(await rest(pg, 'categoria_alimento')).toEqual([])
  })

  await test.step('esqueleto de carga la primera vez (sin copia en el teléfono)', async () => {
    const estado = await ctx.storageState()
    const otro = await browser.newContext({ viewport: { width: 412, height: 900 }, locale: 'es-AR', storageState: estado })
    await otro.route(/\.supabase\.co\//, (r) => r.abort())
    // La base contesta lento
    await otro.route(API + '/rest/v1/**', async (r) => {
      await new Promise((listo) => setTimeout(listo, 1500))
      await r.continue()
    })
    const p = await otro.newPage()
    await p.goto(APP + '/')
    await expect(p.getByTestId('esqueleto')).toBeVisible()
    await expect(p.getByRole('status', { name: 'Cargando' })).toBeVisible()
    await expect(p.getByText('¡Hola, Nico!')).toBeVisible({ timeout: 30000 })
    await expect(p.getByTestId('esqueleto')).toHaveCount(0)
    await otro.close()
  })

  await test.step('traer entrenamientos de un archivo GPX', async () => {
    await pg.evaluate(
      async ([api]) => {
        const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
        const ses = JSON.parse(localStorage.getItem(k))
        await fetch(api + '/rest/v1/profiles?id=eq.' + ses.user.id, {
          method: 'PATCH',
          headers: { Authorization: 'Bearer ' + ses.access_token, apikey: 'test', 'Content-Type': 'application/json' },
          body: JSON.stringify({ gasto_activo: true, gasto_consentimiento: new Date().toISOString() }),
        })
      },
      [API],
    )
    await pg.goto(APP + '/ejercicio')
    await pg.getByTestId('abrir-importar').click()
    await expect(pg.getByTestId('importar-entrenos')).toBeVisible()
    const fecha = sumarDias(hoy, -2)
    await pg
      .getByTestId('importar-archivo')
      .setInputFiles({ name: 'fondo.gpx', mimeType: 'application/gpx+xml', buffer: Buffer.from(GPX(fecha)) })
    const lista = pg.getByTestId('importar-lista')
    await expect(lista.getByText('Fondo suave')).toBeVisible()
    await expect(lista.getByLabel('Actividad de Fondo suave')).toHaveValue(/.+/)
    await lista.getByRole('button', { name: 'Anotar 1' }).click()
    await expect.poll(async () => (await rest(pg, 'workouts')).length).toBe(1)
    const [w] = await rest(pg, 'workouts')
    expect(w).toMatchObject({ fecha, name: 'Correr', duration_min: 30 })
    expect(w.notes).toContain('Importado de archivo')
    // El mismo archivo otra vez: viene marcado como ya anotado y sin tildar
    await pg.getByTestId('abrir-importar').click()
    await pg
      .getByTestId('importar-archivo')
      .setInputFiles({ name: 'fondo.gpx', mimeType: 'application/gpx+xml', buffer: Buffer.from(GPX(fecha)) })
    await expect(lista.getByText('ya estaba anotado')).toBeVisible()
    await expect(lista.getByRole('checkbox')).not.toBeChecked()
    await pg.keyboard.press('Escape')
  })

  await test.step('Strava: conectar (volviendo con el permiso) y traer actividades', async () => {
    const pedidos = []
    let conectado = false
    await ctx.route('**/functions/v1/strava', async (ruta) => {
      if (ruta.request().method() === 'OPTIONS') return ruta.fulfill({ status: 204, headers: CORS })
      const cuerpo = ruta.request().postDataJSON()
      pedidos.push(cuerpo)
      const responder = (x) =>
        ruta.fulfill({ status: 200, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify(x) })
      if (cuerpo.accion === 'estado') return responder({ conectado, atleta: conectado ? 'Nico' : null })
      if (cuerpo.accion === 'conectar') {
        conectado = true
        return responder({ conectado: true, atleta: 'Nico' })
      }
      if (cuerpo.accion === 'actividades')
        return responder({
          actividades: [
            {
              id: '991',
              nombre: 'Pedaleada',
              deporte: 'Ride',
              inicio: `${sumarDias(hoy, -1)}T13:00:00Z`,
              minutos: 45,
              distanciaKm: 18.2,
              desnivelM: 120,
              pulso: 135,
              kcal: null,
            },
          ],
        })
      return responder({ conectado: false })
    })
    await pg.goto(APP + '/ejercicio')
    await pg.getByTestId('abrir-importar').click()
    const conectar = pg.getByRole('link', { name: 'Conectar con Strava' })
    await expect(conectar).toBeVisible()
    const url = new URL(await conectar.getAttribute('href'))
    expect(url.origin).toBe('https://www.strava.com')
    expect(url.searchParams.get('redirect_uri')).toBe(APP + '/ejercicio')
    expect(url.searchParams.get('scope')).toBe('activity:read_all')
    // Strava pide el permiso y vuelve a la app con el código (no se sale a internet: Strava se reemplaza por una vuelta directa)
    const estado = url.searchParams.get('state')
    await ctx.route('https://www.strava.com/**', (r) =>
      r.fulfill({ status: 302, headers: { location: `${APP}/ejercicio?code=abcdef123456&scope=read,activity:read_all&state=${estado}` } }),
    )
    await conectar.click()
    await expect(pg.getByText('Conectado como Nico.')).toBeVisible()
    expect(pedidos.find((p) => p.accion === 'conectar')).toMatchObject({ code: 'abcdef123456', scope: 'read,activity:read_all' })
    expect(pg.url()).not.toContain('code=')
    await pg.getByRole('button', { name: 'Traer los últimos 30 días' }).click()
    await expect(pg.getByTestId('importar-lista').getByText('Pedaleada')).toBeVisible()
    await pg.getByRole('button', { name: 'Anotar 1' }).click()
    await expect.poll(async () => (await rest(pg, 'workouts')).length).toBe(2)
    const w = (await rest(pg, 'workouts')).find((x) => x.notes?.includes('strava-991'))
    expect(w).toMatchObject({ name: 'Bicicleta en la calle', duration_min: 45 })
  })

  await test.step('aviso de cambios en la Política (una vez) y recordatorio de pesarse', async () => {
    // La cuenta nueva ya aceptó los textos de hoy: no ve el aviso
    await pg.goto(APP + '/')
    await expect(pg.getByTestId('aviso-legal')).toHaveCount(0)
    expect((await rest(pg, 'profiles'))[0].legales_vistos).toBeTruthy()
    // Una cuenta de antes (sin la versión vista) lo ve una vez
    await pg.evaluate(
      async ([api]) => {
        const k = Object.keys(localStorage).find((x) => x.includes('auth-token'))
        const ses = JSON.parse(localStorage.getItem(k))
        await fetch(api + '/rest/v1/profiles?id=eq.' + ses.user.id, {
          method: 'PATCH',
          headers: { Authorization: 'Bearer ' + ses.access_token, apikey: 'test', 'Content-Type': 'application/json' },
          body: JSON.stringify({ legales_vistos: null }),
        })
      },
      [API],
    )
    await pg.reload()
    const legal = pg.getByTestId('aviso-legal')
    await expect(legal).toContainText('Actualizamos la Política de privacidad')
    await expect(legal.getByRole('link', { name: 'Leerla' })).toHaveAttribute('href', '/privacidad')
    await legal.getByRole('button', { name: 'Entendido' }).click()
    await expect(legal).toHaveCount(0)
    await pg.reload()
    await expect(pg.getByTestId('aviso-legal')).toHaveCount(0)

    // Pesarse una vez por semana, desde Recordatorios
    await pg.goto(APP + '/perfil')
    const rec = pg.getByTestId('recordatorios')
    await rec.getByRole('switch', { name: 'Activar recordatorios' }).click()
    await rec.getByRole('switch', { name: 'Recordarme pesarme una vez por semana' }).click()
    await rec.getByLabel('Qué día').selectOption('3')
    await rec.getByLabel('Hora de pesarme').fill('07:30')
    const config = await pg.evaluate(() =>
      JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.startsWith('tupper:recordatorios:')))),
    )
    expect(config).toMatchObject({ activo: true, peso: true, pesoDia: 3, pesoHora: '07:30' })
  })

  await ctx.close()
  sinErrores(errores)
})

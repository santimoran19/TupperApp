// Lo que comparten las pruebas del escáner (22 y 23): una cuenta nueva con cámara de mentira, Open Food Facts de mentira y atajos.
import { APP, contexto, saltarRecorrido } from './apoyo.js'
import { instalarCamara } from './camara-falsa.js'

// Open Food Facts de mentira: responde con los `productos` {código: producto}. `estado.apagado`: responde como si no tuviera nada
export async function openFoodFacts(ctx, productos, estado) {
  await ctx.route('https://search.openfoodfacts.org/**', (r) => r.abort())
  await ctx.route('https://world.openfoodfacts.org/cgi/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"products":[]}' }),
  )
  await ctx.route('https://world.openfoodfacts.org/api/v2/product/**', (r) => {
    const codigo = new URL(r.request().url()).pathname.split('/').pop().replace('.json', '')
    const p = productos[codigo]
    const cabeceras = { 'Access-Control-Allow-Origin': '*' }
    if (!p || estado.apagado)
      return r.fulfill({
        status: 404,
        contentType: 'application/json',
        headers: cabeceras,
        body: '{"status":0,"status_verbose":"product not found"}',
      })
    return r.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: cabeceras,
      body: JSON.stringify({ status: 1, code: codigo, product: { code: codigo, ...p } }),
    })
  })
}

// Precios Claros de mentira: `estado.precios` es {código: {nombre, marca, presentacion}}; lo que no esté, "Producto inexistente"
async function preciosClaros(ctx, estado) {
  await ctx.route('https://d3e6htiiul5ek9.cloudfront.net/**', (r) => {
    const u = new URL(r.request().url())
    const cabeceras = { 'Access-Control-Allow-Origin': '*' }
    const responder = (cuerpo) =>
      r.fulfill({ status: 200, contentType: 'application/json', headers: cabeceras, body: JSON.stringify(cuerpo) })
    if (u.pathname.endsWith('/sucursales')) return responder({ status: 200, sucursales: [{ id: '15-1-2003' }, { id: '15-1-2004' }] })
    const codigo = u.searchParams.get('id_producto')
    const p = (estado.precios ?? {})[codigo]
    return responder({ status: 200, producto: p ?? { msg: 'Producto inexistente.', id: codigo }, total: p ? 1 : 0 })
  })
}

// `camara` son las opciones de instalarCamara (modo, controles, ancho, alto)
export async function cuenta(browser, camara, email, nombre, productos, estado = { apagado: false }) {
  const ctx = await contexto(browser)
  await ctx.addInitScript(instalarCamara, camara)
  await openFoodFacts(ctx, productos, estado)
  await preciosClaros(ctx, estado)
  const pg = await ctx.newPage()
  await pg.goto(APP + '/')
  await pg.click('button:has-text("Crear cuenta") >> nth=0')
  await pg.fill('#email', email)
  await pg.fill('#clave', 'Secreto3z')
  await pg.fill('#clave2', 'Secreto3z')
  await pg.click('form button[type=submit]')
  await pg.waitForSelector('text=Armemos tu perfil')
  await pg.fill('#pf-nombre', nombre)
  await pg.fill('#pf-usuario', nombre.toLowerCase() + '.esc')
  await pg.fill('#pf-nac', '1995-05-05')
  await pg.fill('#pf-altura', '170')
  await pg.fill('#pf-peso', '65')
  await pg.click('button:has-text("Empezar")')
  await pg.waitForSelector(`text=¡Hola, ${nombre}!`)
  await saltarRecorrido(pg)
  return { ctx, pg }
}

export const abrirEscaner = async (pg) => {
  await pg.goto(APP + '/despensa')
  await pg.waitForSelector('text=Lista de compras')
  await pg.click('button:has-text("Agregar") >> nth=0')
  await pg.click('button[aria-label="Escanear código de barras"]')
}
export const panelDe = (pg, codigo) => pg.locator('[role=status]', { hasText: 'CÓDIGO ' + codigo })
// Elige el producto que apareció, pone cuánto hay y guarda
export async function guardarProducto(pg, panel, nombre, cantidad = '2') {
  await panel.getByRole('button', { name: nombre }).click()
  await pg.waitForSelector('text=¿Cuánto tenés?')
  await pg.locator('div.fixed input[inputmode]').first().fill(cantidad)
  await pg.click('div.fixed button:has-text("Guardar")')
  await pg.waitForSelector(`p.font-semibold:text-is("${nombre}")`)
}

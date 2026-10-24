// Recorrido inicial (D-05): lo ven las cuentas nuevas, cada paso oscurece todo menos lo que explica y lo hace brillar, se
// puede seguir tocando lo resaltado o con el botón, no crea nada, y al terminarlo o saltarlo no vuelve a aparecer.
// Las cuentas que ya existían no lo ven.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, escuchar, rest, sinErrores } from './apoyo.js'
import { PASOS } from '../../src/lib/recorrido.js'

const CAPA = '[data-recorrido-capa]'
const nombreDelPaso = (p, nombre) => p.titulo.replace(', {nombre}', `, ${nombre}`)
const indice = (id) => PASOS.findIndex((p) => p.id === id)

async function crearCuenta(pg, { email, nombre, usuario }) {
  await pg.goto(APP + '/')
  await pg.click('button:has-text("Crear cuenta") >> nth=0')
  await pg.fill('#email', email)
  await pg.fill('#clave', 'Secreto4w')
  await pg.fill('#clave2', 'Secreto4w')
  await pg.click('form button[type=submit]')
  await pg.waitForSelector('text=Armemos tu perfil')
  await pg.fill('#pf-nombre', nombre)
  await pg.fill('#pf-usuario', usuario)
  await pg.fill('#pf-nac', '1992-03-04')
  await pg.fill('#pf-altura', '168')
  await pg.fill('#pf-peso', '65')
  await pg.check('#pf-consentimiento')
  await pg.click('button:has-text("Empezar")')
  await pg.waitForSelector(CAPA)
}

// Espera a que el cartel sea el del paso n y a que el resaltado haya llegado a su lugar
async function esperarPaso(pg, n, nombre) {
  await pg.waitForFunction((t) => document.querySelector('#rec-titulo')?.textContent === t, nombreDelPaso(PASOS[n], nombre))
  await pg.waitForTimeout(250)
}

// Mide lo que se ve y comprueba que el paso muestre lo que dice mostrar
async function revisar(pg, n, { desktop = false } = {}) {
  const p = PASOS[n]
  const m = await pg.evaluate((ancla) => {
    const caja = (e) => {
      if (!e) return null
      const r = e.getBoundingClientRect()
      return { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height }
    }
    let el = null
    if (ancla)
      for (const e of document.querySelectorAll(`[data-tour="${ancla}"]`)) {
        const r = e.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          el = e
          break
        }
      }
    const centro = (c) => (c ? [c.left + c.width / 2, c.top + c.height / 2] : null)
    const sobre = (pt) => {
      if (!pt) return null
      const x = document.elementFromPoint(pt[0], pt[1])
      return {
        enLaCapa: !!x?.closest('[data-recorrido-capa]'),
        enElCartel: !!x?.closest('[data-recorrido]'),
        enElElemento: !!(el && x && el.contains(x)),
      }
    }
    const c = caja(el)
    return {
      vw: innerWidth,
      vh: innerHeight,
      cartel: caja(document.querySelector('[data-recorrido]')),
      aro: caja(document.querySelector('.recorrido-aro')),
      el: c,
      alTocarElCentro: sobre(centro(c)),
      alTocarLaEsquina: sobre([3, 3]),
      ventanas: document.querySelectorAll('[role="dialog"]:not([data-recorrido])').length,
      foco: document.activeElement?.textContent?.trim() || '',
      ruta: location.pathname,
    }
  }, p.ancla)

  expect(m.ruta, `${p.id}: pantalla`).toBe(p.ruta)
  // El cartel entra entero en la pantalla
  expect(m.cartel.left, p.id).toBeGreaterThanOrEqual(0)
  expect(m.cartel.top, p.id).toBeGreaterThanOrEqual(0)
  expect(m.cartel.right, p.id).toBeLessThanOrEqual(m.vw)
  expect(m.cartel.bottom, p.id).toBeLessThanOrEqual(m.vh)
  // El foco queda en el botón de seguir (no en un campo que abra el teclado)
  expect(m.foco, `${p.id}: foco`).toMatch(/Siguiente|Empezar/)
  // Las ventanas que subieron desde abajo están abiertas solo en los pasos que las explican
  expect(m.ventanas, `${p.id}: ventanas abiertas`).toBe(p.enHoja ? 1 : 0)
  // Tocar cualquier parte de lo oscurecido no llega a la app
  expect(m.alTocarLaEsquina.enLaCapa, `${p.id}: esquina`).toBe(true)

  if (!p.ancla) {
    expect(m.aro, `${p.id}: sin resaltado`).toBeNull()
    return m
  }
  expect(m.aro, `${p.id}: hay resaltado`).not.toBeNull()
  expect(m.el, `${p.id}: el elemento está`).not.toBeNull()
  // El aro rodea al elemento con un poco de aire, sin pasarse de la pantalla
  const esperado = {
    top: Math.max(0, m.el.top - 6),
    left: Math.max(0, m.el.left - 6),
    bottom: Math.min(m.vh, m.el.bottom + 6),
    right: Math.min(m.vw, m.el.right + 6),
  }
  for (const k of ['top', 'left', 'bottom', 'right']) expect(Math.abs(m.aro[k] - esperado[k]), `${p.id}: aro ${k}`).toBeLessThanOrEqual(2)
  // Se ve entero, salvo que sea más alto que la pantalla
  if (m.el.height < m.vh - 170) {
    expect(m.el.top, `${p.id}: arriba`).toBeGreaterThanOrEqual(-1)
    expect(m.el.bottom, `${p.id}: abajo`).toBeLessThanOrEqual(m.vh + 1)
  }
  // El cartel no tapa lo resaltado (salvo que sea tan alto que no quede otro lugar)
  const ancho = Math.min(m.cartel.right, m.aro.right) - Math.max(m.cartel.left, m.aro.left)
  const alto = Math.min(m.cartel.bottom, m.aro.bottom) - Math.max(m.cartel.top, m.aro.top)
  if (m.aro.height < m.vh * 0.55) expect(ancho > 0 && alto > 0, `${p.id}: el cartel tapa lo resaltado`).toBe(false)
  // Lo resaltado se toca solo en los pasos de "tocá esto"
  if (p.tipo === 'toque') expect(m.alTocarElCentro.enElElemento, `${p.id}: se puede tocar`).toBe(true)
  else expect(m.alTocarElCentro.enLaCapa || m.alTocarElCentro.enElCartel, `${p.id}: no se toca`).toBe(true)
  void desktop
  return m
}

const seguir = (pg) => pg.click('[data-testid="recorrido-seguir"]')
const tocarElResaltado = async (pg) => {
  const aro = await pg.locator('.recorrido-aro').boundingBox()
  await pg.mouse.click(aro.x + aro.width / 2, aro.y + aro.height / 2)
}

// Recorre todos los pasos. `tocar`: los pasos de "tocá esto" que se hacen tocando de verdad (los otros, con el botón).
async function recorrer(pg, nombre, { tocar, extras = false, captu = null }) {
  for (let n = 0; n < PASOS.length; n++) {
    const p = PASOS[n]
    await esperarPaso(pg, n, nombre)
    await revisar(pg, n)
    if (captu) await captura(pg, `${captu}${String(n).padStart(2, '0')}_${p.id}`, false)

    if (extras && p.id === 'diario-comida') {
      // Si se cierra la app a la mitad, al volver sigue en el mismo paso
      await pg.reload()
      await esperarPaso(pg, n, nombre)
      await revisar(pg, n)
    }
    if (extras && p.id === 'selector-buscar') {
      // Escape no cierra la ventana que se está explicando
      await pg.keyboard.press('Escape')
      await pg.waitForTimeout(300)
      expect(await pg.locator('[role="dialog"]:not([data-recorrido])').count(), 'Escape cerró la ventana').toBe(1)
      expect(await pg.textContent('#rec-titulo')).toBe(p.titulo)
    }
    if (extras && p.id === 'na-macros') {
      // Para atrás y para adelante, con la ventana como estaba
      await pg.click('[aria-label="Paso anterior"]')
      await esperarPaso(pg, n - 1, nombre)
      await revisar(pg, n - 1)
      await seguir(pg)
      await esperarPaso(pg, n, nombre)
      await revisar(pg, n)
    }
    if (extras && p.id === 'reg-plato') {
      // Para atrás desde afuera de la ventana: se vuelve a abrir sola y se resalta lo que había
      await pg.click('[aria-label="Paso anterior"]')
      await esperarPaso(pg, n - 1, nombre)
      await revisar(pg, n - 1)
      await seguir(pg)
      await esperarPaso(pg, n, nombre)
      await revisar(pg, n)
    }

    if (n === PASOS.length - 1) break
    if (p.tipo === 'toque' && tocar.has(p.id)) await tocarElResaltado(pg)
    else await seguir(pg)
  }
}

test('recorrido: una cuenta nueva lo ve entero, paso por paso, y no vuelve a aparecer', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser)
  const pg = await ctx.newPage()
  escuchar(pg, errores)

  await test.step('al armar el perfil empieza el recorrido', async () => {
    await crearCuenta(pg, { email: 'rita@test.com', nombre: 'Rita Gómez', usuario: 'rita.g' })
    await esperarPaso(pg, 0, 'Rita')
    expect(await pg.textContent('#rec-texto')).toContain('no se guarda nada')
    await captura(pg, 'r_bienvenida', false)
    const claves = await pg.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('tupper:recorrido:')))
    expect(claves).toHaveLength(1)
  })

  await test.step('los pasos: cada uno resalta lo que explica (algunos se tocan de verdad, otros siguen con el botón)', async () => {
    await recorrer(pg, 'Rita', { tocar: new Set(['nav-registrar', 'reg-alimento']), extras: true, captu: 'r' })
  })

  await test.step('al terminar desaparece, no queda marca y no vuelve ni recargando', async () => {
    expect(await pg.textContent('[data-testid="recorrido-seguir"]')).toBe('Empezar a usar Tupper')
    await seguir(pg)
    await pg.waitForSelector(CAPA, { state: 'detached' })
    expect(new URL(pg.url()).pathname).toBe('/')
    expect(await pg.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('tupper:recorrido:')))).toEqual([])
    await pg.reload()
    await pg.waitForSelector('text=¡Hola, Rita!')
    await pg.waitForTimeout(500)
    expect(await pg.locator(CAPA).count()).toBe(0)
    await pg.goto(APP + '/perfil')
    await pg.waitForSelector('text=Objetivos por día')
    expect(await pg.locator(CAPA).count()).toBe(0)
  })

  await test.step('recorrerlo no creó nada', async () => {
    expect((await rest(pg, 'foods')).filter((f) => f.owner)).toEqual([])
    expect((await rest(pg, 'recipes')).filter((r) => r.owner)).toEqual([])
    for (const tabla of ['stock', 'log_entries', 'purchases', 'shopping_items', 'prepared'])
      expect(await rest(pg, tabla), tabla).toEqual([])
  })

  sinErrores(errores)
  await ctx.close()
})

test('recorrido: se puede saltar (con confirmación) y las cuentas que ya existían no lo ven', async ({ browser }) => {
  const errores = []

  await test.step('saltarlo pide confirmar, y confirmado desaparece para siempre', async () => {
    const ctx = await contexto(browser)
    const pg = await ctx.newPage()
    escuchar(pg, errores)
    await crearCuenta(pg, { email: 'saltea@test.com', nombre: 'Saltea', usuario: 'saltea.s' })
    await esperarPaso(pg, 0, 'Saltea')
    // lo hago avanzar un par de pasos para que no se cierre desde el primero
    await seguir(pg)
    await esperarPaso(pg, 1, 'Saltea')
    await pg.click('button:has-text("Saltar recorrido")')
    await pg.waitForSelector('text=¿Saltar el recorrido? No vuelve a aparecer.')
    await captura(pg, 'r_saltar', false)
    // "Seguir" vuelve al cartel de antes, en el mismo paso
    await pg.click('button:has-text("Seguir")')
    await pg.waitForSelector('text=¿Saltar el recorrido?', { state: 'detached' })
    expect(await pg.textContent('#rec-titulo')).toBe(PASOS[1].titulo)
    await pg.click('button:has-text("Saltar recorrido")')
    await pg.click('button:has-text("Sí, saltar")')
    await pg.waitForSelector(CAPA, { state: 'detached' })
    expect(await pg.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('tupper:recorrido:')))).toEqual([])
    await pg.reload()
    await pg.waitForSelector('text=¡Hola, Saltea!')
    await pg.waitForTimeout(500)
    expect(await pg.locator(CAPA).count()).toBe(0)
    await ctx.close()
  })

  await test.step('saltarlo estando adentro de una ventana la cierra y vuelve al diario', async () => {
    const ctx = await contexto(browser)
    const pg = await ctx.newPage()
    escuchar(pg, errores)
    await crearCuenta(pg, { email: 'saltea2@test.com', nombre: 'Saltea', usuario: 'saltea.dos' })
    for (let n = 0; n < indice('selector-buscar'); n++) {
      await esperarPaso(pg, n, 'Saltea')
      await seguir(pg)
    }
    await esperarPaso(pg, indice('selector-buscar'), 'Saltea')
    expect(await pg.locator('[role="dialog"]:not([data-recorrido])').count()).toBe(1)
    await pg.click('button:has-text("Saltar recorrido")')
    await pg.click('button:has-text("Sí, saltar")')
    await pg.waitForSelector(CAPA, { state: 'detached' })
    expect(await pg.locator('[role="dialog"]').count()).toBe(0)
    expect(new URL(pg.url()).pathname).toBe('/')
    await ctx.close()
  })

  await test.step('una cuenta que ya existía entra sin recorrido', async () => {
    const ctx = await contexto(browser, { sesion: true })
    const pg = await ctx.newPage()
    escuchar(pg, errores)
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, ')
    await pg.waitForTimeout(800)
    expect(await pg.locator(CAPA).count()).toBe(0)
    expect(await pg.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('tupper:recorrido:')))).toEqual([])
    await ctx.close()
  })

  sinErrores(errores)
})

test('recorrido en la compu: la barra del costado y todo tocando lo resaltado', async ({ browser }) => {
  const errores = []
  const ctx = await contexto(browser, { viewport: { width: 1280, height: 800 } })
  const pg = await ctx.newPage()
  escuchar(pg, errores)
  await crearCuenta(pg, { email: 'rita.pc@test.com', nombre: 'Rita', usuario: 'rita.pc' })
  await recorrer(pg, 'Rita', {
    tocar: new Set(PASOS.filter((p) => p.tipo === 'toque').map((p) => p.id)),
    extras: false,
    captu: 'rc',
  })
  await seguir(pg)
  await pg.waitForSelector(CAPA, { state: 'detached' })
  sinErrores(errores)
  await ctx.close()
})

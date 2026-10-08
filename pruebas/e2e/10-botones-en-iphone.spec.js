// Botones en tamaño iPhone, simulando la franja inferior (34 px): que nada quede tapado ni cortado. Usa la sesión de las pruebas anteriores.
import { expect, test } from '@playwright/test'
import { APP, captura, contexto, IPHONE } from './apoyo.js'

// ¿Algún botón o enlace visible queda tapado por la barra o por el botón flotante, o se sale de la pantalla?
const TAPADOS = () => {
  const malos = []
  const vh = innerHeight,
    vw = innerWidth
  for (const el of document.querySelectorAll('button, a')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0 || r.bottom <= 0 || r.top >= vh) continue
    const nombre = (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30)
    if (r.right > vw + 1 || r.left < -1) {
      if (!el.closest('.sin-scroll')) malos.push('se sale: ' + nombre)
      continue
    }
    const cx = Math.min(Math.max(r.left + r.width / 2, 1), vw - 1),
      cy = Math.min(Math.max(r.top + r.height / 2, 1), vh - 1)
    const arriba = document.elementFromPoint(cx, cy)
    if (arriba && !el.contains(arriba) && !arriba.contains(el)) {
      const quien = arriba.closest('nav')
        ? 'la barra'
        : arriba.closest('header')
          ? 'el encabezado'
          : arriba.closest('.fixed')
            ? 'algo flotante'
            : null
      if (quien) malos.push(nombre + ' tapado por ' + quien)
    }
  }
  return malos
}

test('botones en iPhone: nada tapado ni cortado con la franja inferior', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true, ...IPHONE })
  await ctx.addInitScript(() => {
    addEventListener('DOMContentLoaded', () => document.documentElement.style.setProperty('--seguro', '34px'))
  })
  const pg = await ctx.newPage()
  const reporte = {}
  const fin = async () => {
    await pg.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await pg.waitForTimeout(250)
  }
  const revisar = async (nombre) => {
    await fin()
    await captura(pg, 'b_' + nombre, false)
    reporte[nombre] = await pg.evaluate(TAPADOS)
  }

  await test.step('diario', async () => {
    await pg.goto(APP + '/')
    await pg.waitForSelector('text=¡Hola, Santi!')
    await captura(pg, 'b_diario_arriba', false)
    reporte.diario_arriba = await pg.evaluate(TAPADOS)
    await revisar('diario_fin')
  })

  await test.step('despensa', async () => {
    await pg.goto(APP + '/despensa')
    await pg.waitForSelector('text=Lista de compras')
    await pg.evaluate(() => window.scrollTo(0, 260))
    await captura(pg, 'b_despensa_medio', false)
    reporte.despensa_medio = await pg.evaluate(TAPADOS)
    await revisar('despensa_fin')
    await pg.locator('button[aria-label^="Quitar "]').first().click()
    await pg.waitForSelector('[role=alertdialog]')
    await captura(pg, 'b_despensa_quitar', false)
    await pg.click('[role=alertdialog] button:has-text("Cancelar")')
  })

  await test.step('el resto de las pantallas', async () => {
    const pantallas = [
      ['/recetas', 'para cocinar', 'recetas_fin'],
      ['/plan', 'Esta semana', 'plan_fin'],
      ['/compras', 'Para comprar', 'compras_fin'],
      ['/perfil', 'Apariencia', 'perfil_fin'],
      ['/resumen', 'ANÁLISIS CON IA', 'resumen_fin'],
      ['/alimentos', 'Mis alimentos', 'alimentos_fin'],
    ]
    for (const [ruta, espera, nombre] of pantallas) {
      await pg.goto(APP + ruta)
      await pg.waitForSelector('text=' + espera)
      await captura(pg, 'b_' + nombre.replaceAll('_fin', '_arriba'), false)
      await revisar(nombre)
    }
  })

  await test.step('una receta y la receta nueva', async () => {
    await pg.goto(APP + '/recetas')
    await pg.locator('a.tarjeta').first().click()
    await pg.waitForSelector('text=Ingredientes')
    await revisar('receta_fin')
    await pg.goto(APP + '/recetas/nueva')
    await pg.waitForSelector('text=Ingredientes')
    await revisar('receta_nueva_fin')
  })

  await test.step('registrar, con la hoja de bebidas', async () => {
    await pg.goto(APP + '/registrar?comida=merienda')
    await pg.waitForSelector('text=Tu plato')
    await pg.click('button:has-text("Bebida")')
    await pg.waitForSelector('input[placeholder="Buscar bebida..."]')
    await pg.evaluate(() => document.querySelector('.fixed .overflow-y-auto').scrollTo(0, 99999))
    await captura(pg, 'b_hoja_bebidas_fin', false)
    await pg.fill('input[placeholder="Buscar bebida..."]', 'mate')
    await pg.locator('div.divide-y > button').first().click()
    await pg.waitForSelector('text=Endulzado con')
    await pg.click('button:has-text("Azúcar")')
    await revisar('registrar_fin')
  })

  await test.step('perfil, con la hoja de editar', async () => {
    await pg.goto(APP + '/perfil')
    await pg.waitForSelector('text=Apariencia')
    await pg.click('button:has-text("Editar")')
    await pg.waitForSelector('#pf-altura')
    await pg.evaluate(() => document.querySelector('.fixed .overflow-y-auto').scrollTo(0, 99999))
    await captura(pg, 'b_hoja_perfil_fin', false)
  })

  await ctx.close()
  // Con la pantalla bajada hasta el final, ningún botón puede quedar debajo de la barra, de algo flotante ni salirse.
  // (Que el encabezado tape lo de arriba es lo normal al bajar; a mitad de pantalla la barra también tapa algo.)
  const problemas = Object.entries(reporte)
    .filter(([pantalla]) => pantalla.endsWith('_fin'))
    .flatMap(([pantalla, malos]) => malos.filter((m) => !m.endsWith('tapado por el encabezado')).map((m) => pantalla + ': ' + m))
  expect(problemas).toEqual([])
})

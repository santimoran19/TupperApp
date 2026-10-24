// Revisión de accesibilidad (1.28, D-07): cada pantalla principal pasa por axe (las reglas WCAG 2.1 A y AA) en tema claro
// y oscuro, y con la letra del sistema al 150 % no tiene que aparecer una barra de desplazamiento al costado.
// Usa la sesión de las pruebas anteriores.
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { APP, contexto } from './apoyo.js'

const PANTALLAS = ['/', '/registrar', '/plan', '/despensa', '/recetas', '/compras', '/resumen', '/perfil', '/asistente', '/alimentos']

// Lo que axe marca y no es un problema real de la app:
//  - color-contrast en el lienzo 3D (no es texto) se excluye con el selector.
const EXCLUIR = ['canvas']

async function revisar(pg, ruta) {
  await pg.goto(APP + ruta)
  await pg.waitForTimeout(600)
  let axe = new AxeBuilder({ page: pg }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  for (const s of EXCLUIR) axe = axe.exclude(s)
  const { violations } = await axe.analyze()
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({
      ruta,
      regla: v.id,
      impacto: v.impact,
      donde: v.nodes.slice(0, 4).map((n) => `${n.target.join(' ')} :: ${(n.failureSummary || '').split('\n').slice(1, 2).join('')}`),
    }))
}

for (const tema of ['light', 'dark']) {
  test(`axe en todas las pantallas (tema ${tema === 'light' ? 'claro' : 'oscuro'})`, async ({ browser }) => {
    const ctx = await contexto(browser, { sesion: true, colorScheme: tema })
    const pg = await ctx.newPage()
    // Sin el aviso de la primera vez de la IA, que tapa media pantalla
    await pg.addInitScript(() => {
      try {
        localStorage.setItem('tupper:ia-registro-aviso', '1')
        localStorage.setItem('tupper:asistente-aviso', '1')
      } catch {
        /* nada */
      }
    })
    const problemas = []
    for (const ruta of PANTALLAS) problemas.push(...(await revisar(pg, ruta)))
    if (problemas.length) console.log(JSON.stringify(problemas, null, 2))
    expect(problemas).toEqual([])
    await ctx.close()
  })
}

test('letra del sistema al 150 %: nada se sale de la pantalla', async ({ browser }) => {
  const ctx = await contexto(browser, { sesion: true })
  const pg = await ctx.newPage()
  await pg.addInitScript(() => {
    // Así agranda la letra un teléfono con "tamaño de fuente" grande: todo lo que está en rem crece
    document.addEventListener('DOMContentLoaded', () => (document.documentElement.style.fontSize = '150%'))
  })
  const anchos = []
  for (const ruta of PANTALLAS) {
    await pg.goto(APP + ruta)
    await pg.waitForTimeout(500)
    const { scroll, ancho } = await pg.evaluate(() => ({ scroll: document.documentElement.scrollWidth, ancho: window.innerWidth }))
    if (scroll > ancho + 1) anchos.push({ ruta, scroll, ancho })
  }
  expect(anchos).toEqual([])
  await ctx.close()
})

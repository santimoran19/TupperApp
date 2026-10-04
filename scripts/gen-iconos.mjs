// Copia a src/components/iconos.js solo los íconos de Material Symbols que usa la app.
// Para sumar uno: instalá el paquete (npm i -D @material-symbols/svg-400), agregalo a la lista
// y corré  node scripts/gen-iconos.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const USADOS = `add add_circle add_shopping_cart arrow_back wand_stars bedtime calendar_today cancel check check_circle
chevron_left chevron_right close delete eco edit event_note hourglass_empty inventory_2 kitchen local_cafe
local_fire_department logout menu_book refresh remove restaurant search shopping_basket shopping_cart skillet
swap_horiz takeout_dining trending_down trending_up wb_twilight
glass_cup local_bar no_meals travel_explore undo water_drop
bar_chart description download favorite history lock_reset mark_email_read person_remove replay visibility visibility_off`.split(/\s+/)

const carpeta = new URL('../node_modules/@material-symbols/svg-400/outlined/', import.meta.url)
const trazo = (archivo) => readFileSync(new URL(archivo, carpeta), 'utf8').match(/ d="([^"]+)"/)[1]

let js = '// Generado con scripts/gen-iconos.mjs. Cada ícono: [contorno, relleno].\nexport const ICONOS = {\n'
for (const n of USADOS) js += `  ${n}: ['${trazo(n + '.svg')}', '${trazo(n + '-fill.svg')}'],\n`
js += '}\n'
writeFileSync(new URL('../src/components/iconos.js', import.meta.url), js)
console.log('ok', USADOS.length, 'iconos')

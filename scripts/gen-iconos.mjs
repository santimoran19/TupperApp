// Copia a src/components/iconos.js solo los íconos de Material Symbols que usa la app.
// Para sumar uno: instalá el paquete (npm i -D @material-symbols/svg-400), agregalo a la lista
// y corré  node scripts/gen-iconos.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const USADOS = `add add_circle add_shopping_cart arrow_back wand_stars bedtime calendar_today cancel check check_circle
chevron_left chevron_right close delete eco edit event_note hourglass_empty inventory_2 kitchen local_cafe
local_fire_department logout menu_book refresh remove restaurant search shopping_basket shopping_cart skillet
swap_horiz takeout_dining trending_down trending_up wb_twilight
glass_cup local_bar no_meals travel_explore undo water_drop
bar_chart description download favorite history lock_reset mark_email_read person_remove replay visibility visibility_off
cloud_off sync home group content_copy key share barcode_scanner photo_camera flashlight_on
fitness_center trophy timer directions_run play_arrow keyboard_arrow_down info monitor_heart show_chart tune bolt pause calendar_month
egg set_meal water_full nutrition grocery ramen_dining grain bakery_dining breakfast_dining soup_kitchen cookie ac_unit lunch_dining
local_drink add_a_photo image event event_busy schedule warning lightbulb donut_large checklist 3d_rotation view_in_ar
accessibility_new body_system monitor_weight touch_app straighten`.split(/\s+/)

const carpeta = new URL('../node_modules/@material-symbols/svg-400/outlined/', import.meta.url)
const trazo = (archivo) => readFileSync(new URL(archivo, carpeta), 'utf8').match(/ d="([^"]+)"/)[1]

let js = '// Generado con scripts/gen-iconos.mjs. Cada ícono: [contorno, relleno].\nexport const ICONOS = {\n'
for (const n of USADOS) js += `  ${/^\d/.test(n) ? `'${n}'` : n}: ['${trazo(n + '.svg')}', '${trazo(n + '-fill.svg')}'],\n`
js += '}\n'
writeFileSync(new URL('../src/components/iconos.js', import.meta.url), js)
console.log('ok', USADOS.length, 'iconos')

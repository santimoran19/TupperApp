// La sexta tanda de la base (versión 1.25): más alimentos (datos/alimentos-sexta.mjs) y más de mil recetas armadas con las
// familias de datos/f-*.mjs. Las recetas se generan siempre igual (azar con semilla), así el SQL de supabase/ no cambia de una
// corrida a otra. Cada ingrediente se escribe en gramos por porción y se pasa a las unidades de cada alimento; las calorías y la
// proteína por porción se chequean y lo que se sale de lo razonable se descarta.
//   import { alimentosSexta, recetasSexta, foodsTodos, recipesTodas } from './seed-sexta.mjs'
import { foods, recipes } from './seed-data.mjs'
import { alimentosSexta } from './datos/alimentos-sexta.mjs'
import { azar, crearArmador, crearChequeo } from './datos/motor.mjs'
import * as ensaladas from './datos/f-ensaladas.mjs'
import * as salteados from './datos/f-salteados.mjs'
import * as pastas from './datos/f-pastas.mjs'
import * as tartas from './datos/f-tartas.mjs'
import * as granos from './datos/f-granos.mjs'
import * as sopas from './datos/f-sopas.mjs'
import * as guisos from './datos/f-guisos.mjs'
import * as horno from './datos/f-horno.mjs'
import * as hamburguesas from './datos/f-hamburguesas.mjs'
import * as sandwiches from './datos/f-sandwiches.mjs'
import * as bowls from './datos/f-bowls.mjs'
import * as desayunos from './datos/f-desayunos.mjs'
import * as rellenos from './datos/f-rellenos.mjs'
import * as snacks from './datos/f-snacks.mjs'

// [familia, cuántas como máximo]. El orden no se toca: cambia las recetas que salen.
const FAMILIAS = [
  [ensaladas.generarEnsaladas, 110],
  [salteados.generarSalteados, 110],
  [pastas.generarPastas, 110],
  [tartas.generarTartas, 100],
  [granos.generarGranos, 100],
  [granos.generarRisottos, 30],
  [sopas.generarCremas, 90],
  [sopas.generarSopas, 30],
  [guisos.generarGuisos, 110],
  [guisos.generarEspeciales, 20],
  [horno.generarHorno, 110],
  [hamburguesas.generarHamburguesas, 60],
  [hamburguesas.generarMilanesas, 50],
  [hamburguesas.generarBolitas, 20],
  [sandwiches.generarSandwiches, 90],
  [sandwiches.generarTostadas, 36],
  [bowls.generarBowls, 80],
  [desayunos.generarAvenas, 50],
  [desayunos.generarYogures, 36],
  [desayunos.generarLicuados, 44],
  [desayunos.generarPanqueques, 24],
  [rellenos.generarRellenos, 60],
  [rellenos.generarRollos, 20],
  [snacks.generarSnacks, 30],
  [snacks.generarBudines, 20],
  [snacks.generarPostres, 30],
  [snacks.generarEmpanadas, 20],
]

export const foodsTodos = [...foods, ...alimentosSexta]
export const chequeoSexta = crearChequeo(foodsTodos)

function armar() {
  const armador = crearArmador(
    chequeoSexta,
    recipes.map((r) => r.name),
    recipes.map((r) => r.slug),
  )
  const az = azar(7)
  for (const [familia, cuantas] of FAMILIAS) familia({ az, armador, cuantas })
  return armador.recetas
}

export { alimentosSexta }
export const recetasSexta = armar()
export const recipesTodas = [...recipes, ...recetasSexta]

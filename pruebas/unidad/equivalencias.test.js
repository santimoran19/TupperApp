// Equivalencias: un producto propio vale por un alimento de las recetas (stock sumado, gasto, calorías, plan y sugerencias).
import { baseDe, convertir, equivalentesPorBase, gastar, itemsEnBase, productoEnUso, stockParaRecetas, sugerirBase, sonCompatibles } from '../../src/lib/equivalencias.js'
import { macrosReceta } from '../../src/lib/nutricion.js'
import { disponibilidad, estadoDelPlan } from '../../src/lib/planificador.js'
import { eq } from './apoyo.js'

const f = (id, name, unit, extra = {}) => ({ id, name, unit, unit_grams: null, kcal: 100, protein: 0, carbs: 0, fat: 0, owner: null, same_as: null, ...extra })
const aceite = f('aceite', 'Aceite', 'ml', { kcal: 810, fat: 92 })
const oliva = f('oliva', 'Aceite de oliva', 'ml')
const natura = f('natura', 'Aceite girasol Natura', 'g', { owner: 'u', same_as: 'aceite', kcal: 900, fat: 100 })
const cocinero = f('cocinero', 'Aceite Cocinero', 'ml', { owner: 'u', same_as: 'aceite' })
const atun = f('atun', 'Atún al natural (lata 170 g)', 'u', { unit_grams: 170 })
const campagnola = f('camp', 'Atún al natural La Campagnola', 'g', { owner: 'u', same_as: 'atun' })
const huevo = f('huevo', 'Huevo', 'u', { unit_grams: 50 })
const campo = f('campo', 'Huevo de campo', 'u', { unit_grams: 60, owner: 'u', same_as: 'huevo' })
const cadena = f('cadena', 'Aceite X', 'ml', { owner: 'u', same_as: 'natura' })   // apunta a uno que ya vale por otro
const sinPeso = f('sinpeso', 'Atún raro', 'u', { owner: 'u', same_as: 'aceite' })   // unidad sin gramos contra ml
const arroz = f('arroz', 'Arroz largo fino (crudo)', 'g')
const pure = f('pure', 'Puré de tomate', 'g'); const tomate = f('tomate', 'Tomate', 'u', { unit_grams: 120 })
const leche = f('leche', 'Leche parcialmente descremada', 'ml')
const quesoA = f('qa', 'Queso cremoso', 'g'); const quesoB = f('qb', 'Queso rallado', 'g')
const lista = [aceite, oliva, natura, cocinero, atun, campagnola, huevo, campo, cadena, sinPeso, arroz, pure, tomate, leche, quesoA, quesoB]
const A = new Map(lista.map((a) => [a.id, a]))

eq(baseDe(natura, A).id, 'aceite', 'base de un producto vinculado')
eq(baseDe(aceite, A).id, 'aceite', 'un alimento sin vínculo es su propia base')
eq(baseDe(cadena, A).id, 'cadena', 'no se encadenan equivalencias')
eq(baseDe(sinPeso, A).id, 'sinpeso', 'vínculo incompatible (unidad sin peso) se ignora')
eq(sonCompatibles(atun, campagnola), true, 'unidad con peso y gramos son compatibles')
eq(convertir(campagnola, atun, 340), 2, '340 g de atún = 2 latas')
eq(convertir(atun, campagnola, 0.5), 85, 'media lata = 85 g')
eq(convertir(campo, huevo, 3), 3, 'unidad con unidad va 1 a 1')
eq(convertir(natura, aceite, 900), 900, 'gramos y ml se toman iguales')

const eqv = equivalentesPorBase(lista, A)
eq([...eqv.keys()].sort(), ['aceite', 'atun', 'huevo'], 'bases con productos vinculados')
eq(eqv.get('aceite').map((a) => a.id), ['natura', 'cocinero'], 'productos que valen por aceite')

const stock = new Map([['aceite', 100], ['natura', 900], ['cocinero', 50], ['camp', 340], ['huevo', 2], ['campo', 6], ['arroz', 500]])
const sr = stockParaRecetas(stock, A)
eq([sr.get('aceite'), sr.get('atun'), sr.get('huevo'), sr.get('arroz'), sr.has('natura')], [1050, 2, 8, 500, false], 'stock visto desde las recetas')

const receta = { id: 'r', servings: 2 }
const items = [{ food_id: 'aceite', qty: 30 }, { food_id: 'atun', qty: 1 }, { food_id: 'huevo', qty: 4 }, { food_id: 'natura', qty: 10 }]
const ib = itemsEnBase(items, A)
eq(ib.map((i) => [i.food_id, i.qty]), [['aceite', 40], ['atun', 1], ['huevo', 4]], 'ingredientes llevados a la base (y sumados)')
eq(disponibilidad(receta, ib, sr, 2).ok, true, 'alcanza gracias a los productos vinculados')
eq(disponibilidad(receta, ib, stockParaRecetas(new Map([['aceite', 5]]), A), 1).faltan.map((x) => x.food_id), ['aceite', 'atun', 'huevo'], 'sin vinculados, falta')

const uso = productoEnUso(eqv, A, stock)
eq([uso.has('aceite'), uso.get('atun').id, uso.has('huevo')], [false, 'camp', false], 'producto en uso: solo si del alimento de la receta no hay')
const sinBase = new Map([['natura', 900], ['cocinero', 50]])
eq(productoEnUso(eqv, A, sinBase).get('aceite').id, 'natura', 'producto en uso: el que más hay')
eq(productoEnUso(eqv, A, new Map([['aceite', 100]])).size, 0, 'sin stock de vinculados no hay producto en uso')

// Gasto: primero el vinculado con más stock, después el otro, después la base
let c = new Map(); gastar(c, aceite, 40, eqv.get('aceite'), stock)
eq([...c], [['aceite', -40]], 'gasta primero del alimento que pide la receta')
c = new Map(); gastar(c, aceite, 40, eqv.get('aceite'), sinBase)
eq([...c], [['natura', -40]], 'si de ese no hay, del producto con más stock')
c = new Map(); gastar(c, aceite, 1000, eqv.get('aceite'), stock)
eq([...c], [['aceite', -100], ['natura', -900]], 'si no alcanza sigue con los productos vinculados')
c = new Map(); gastar(c, aceite, 1000, eqv.get('aceite'), sinBase)
eq([...c], [['natura', -900], ['cocinero', -50], ['aceite', -50]], 'lo que no cubre nadie se le anota al alimento de la receta')
c = new Map(); gastar(c, atun, 1.5, eqv.get('atun'), stock)
eq([...c], [['camp', -255]], 'gasta en la unidad del producto (latas -> gramos)')
c = new Map(); gastar(c, atun, 3, eqv.get('atun'), stock)
eq([...c], [['camp', -340], ['atun', -1]], 'lo que no cubre el producto va a la base')
c = new Map(); gastar(c, arroz, 100, [], stock)
eq([...c], [['arroz', -100]], 'sin vinculados gasta de la base, como siempre')
c = new Map(); gastar(c, aceite, 600, eqv.get('aceite'), stock); gastar(c, aceite, 600, eqv.get('aceite'), stock)
eq([...c].sort(), [['aceite', -250], ['cocinero', -50], ['natura', -900]], 'dos gastos seguidos tienen en cuenta lo ya gastado')

// Calorías con el producto real
const uso2 = productoEnUso(eqv, A, new Map([['natura', 900], ['camp', 340]]))
const resolver = (it) => { const a = A.get(it.food_id); const p = uso2.get(baseDe(a, A).id); return p && p.id !== a.id ? { a: p, qty: convertir(a, p, it.qty) } : { a, qty: it.qty } }
eq(Math.round(macrosReceta({ servings: 1 }, [{ food_id: 'aceite', qty: 10 }], A).kcal), 81, 'kcal con el genérico')
eq(Math.round(macrosReceta({ servings: 1 }, [{ food_id: 'aceite', qty: 10 }], resolver).kcal), 90, 'kcal con el producto vinculado')
eq(Math.round(macrosReceta({ servings: 1 }, [{ food_id: 'atun', qty: 1 }], resolver).kcal), 170, 'kcal de una lata con el producto en gramos')

// Plan: los faltantes se calculan con el stock sumado
const plan = estadoDelPlan([{ id: 1, date: '2026-10-05', meal: 'almuerzo', recipe_id: 'r' }, { id: 2, date: '2026-10-06', meal: 'almuerzo', recipe_id: 'r' }],
  { recetas: new Map([['r', { id: 'r', servings: 1 }]]), itemsDe: () => [{ food_id: 'atun', qty: 1.5 }], stock: sr, preparado: new Map() })
eq([plan.estados.get(1).estado, plan.estados.get(2).estado, [...plan.faltantes]], ['listo', 'falta', [['atun', 1]]], 'el plan usa el stock sumado y pide la base')

// Sugerencias
const cand = [aceite, oliva, atun, huevo, arroz, pure, tomate, leche, quesoA, quesoB]
const s = (name, unit = 'g') => sugerirBase({ name, unit, unit_grams: null }, cand)?.id || null
eq(s('Aceite girasol Natura'), 'aceite', 'aceite de marca -> Aceite')
eq(s('Aceite de oliva extra virgen (Zuelo)'), 'oliva', 'el más específico gana')
eq(s('Atún al natural (La Campagnola)'), 'atun', 'atún en gramos -> lata')
eq(s('Arroz Gallo Oro'), 'arroz', 'único alimento que empieza igual')
eq(s('Galletitas de arroz'), null, 'no propone por una palabra del medio')
eq(s('Puré de tomate Arcor'), 'pure', 'puré de tomate -> puré, no tomate')
eq(s('Leche descremada La Serenísima', 'ml'), 'leche', 'leche de marca')
eq(s('Queso crema Casancrem'), null, 'con varios parecidos no adivina')
eq(s('Huevos de campo'), 'huevo', 'gramos contra unidad con peso: se puede')
eq(sugerirBase({ name: 'Arroz yamaní', unit: 'u', unit_grams: null }, cand), null, 'unidad sin peso contra gramos: no se propone')
eq(sugerirBase({ name: 'Huevos de campo', unit: 'u', unit_grams: 60 }, cand)?.id, 'huevo', 'plural y unidad con peso')
eq(s('Alfajor triple'), null, 'nada que ver')

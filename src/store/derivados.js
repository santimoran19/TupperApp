// Datos derivados: lo que las pantallas necesitan y sale de las tablas (mapas por id, stock visto por las recetas, etc.).
// Cada cosa se recalcula solo cuando cambia la tabla de la que sale.
import { useCallback, useMemo } from 'react'
import { hoy, sumarDias } from '../lib/fechas'
import { gastoDeFecha } from '../lib/gastodia'
import { referenciasDeCompra, vencimientoDe, vencimientosPorBase } from '../lib/despensa'
import { macrosReceta } from '../lib/nutricion'
import { conCategorias, listaCategorias, ordenDe } from '../lib/categorias'
import { estadoDelPlan } from '../lib/planificador'
import { baseDe, conFamilia, convertir, equivalentesPorBase, itemsEnBase, productoEnUso, stockParaRecetas } from '../lib/equivalencias'

export function useDerivados(e) {
  // A los alimentos base que valen por otro (cualquier leche cuenta como leche) se les completa el vínculo
  // y a los que la persona movió de categoría (F-13) se les pone la suya
  const elegidas = useMemo(() => new Map((e.categoriaAlimento || []).map((c) => [c.food_id, c.categoria])), [e.categoriaAlimento])
  const alimentos = useMemo(() => conFamilia(conCategorias(e.alimentos, elegidas)), [e.alimentos, elegidas])
  const categorias = useMemo(() => listaCategorias(e.categoriasPropias || []), [e.categoriasPropias])
  const ordenCategoria = useMemo(() => ordenDe(categorias), [categorias])
  const alimentosPorId = useMemo(() => new Map(alimentos.map((a) => [a.id, a])), [alimentos])
  const deLaBase = useMemo(() => alimentos.filter((a) => !a.owner), [alimentos])
  const recetasPorId = useMemo(() => new Map(e.recetas.map((r) => [r.id, r])), [e.recetas])
  // Preferencias sobre recetas: las ocultas no aparecen en listas, plan ni sugerencias; las favoritas tienen prioridad
  const ocultas = useMemo(() => new Set(e.prefs.filter((p) => p.hidden).map((p) => p.recipe_id)), [e.prefs])
  const favoritas = useMemo(() => new Set(e.prefs.filter((p) => p.favorite).map((p) => p.recipe_id)), [e.prefs])
  const recetasVisibles = useMemo(() => e.recetas.filter((r) => !ocultas.has(r.id)), [e.recetas, ocultas])
  const recetasOcultas = useMemo(() => e.recetas.filter((r) => ocultas.has(r.id)), [e.recetas, ocultas])
  const stockMap = useMemo(() => new Map(e.stock.map((s) => [s.food_id, Number(s.qty)])), [e.stock])
  const preparadoMap = useMemo(() => new Map(e.preparado.map((p) => [p.recipe_id, Number(p.portions)])), [e.preparado])
  const itemsPorReceta = useMemo(() => {
    const m = new Map()
    for (const it of e.items) {
      if (!m.has(it.recipe_id)) m.set(it.recipe_id, [])
      m.get(it.recipe_id).push({ ...it, qty: Number(it.qty) })
    }
    return m
  }, [e.items])
  const itemsDe = useCallback((id) => itemsPorReceta.get(id) || [], [itemsPorReceta])

  // Equivalencias: un producto propio puede valer por un alimento de las recetas (ver lib/equivalencias).
  // Para las recetas y el plan, el stock y los ingredientes se miran siempre por el alimento "base".
  const equivalentes = useMemo(() => equivalentesPorBase(alimentos, alimentosPorId), [alimentos, alimentosPorId])
  const stockRecetas = useMemo(() => stockParaRecetas(stockMap, alimentosPorId), [stockMap, alimentosPorId])
  const itemsBasePorReceta = useMemo(() => {
    const m = new Map()
    for (const [id, items] of itemsPorReceta) m.set(id, itemsEnBase(items, alimentosPorId))
    return m
  }, [itemsPorReceta, alimentosPorId])
  const itemsPlan = useCallback((id) => itemsBasePorReceta.get(id) || [], [itemsBasePorReceta])
  // Lo que gasta un alimento suelto del plan, llevado al alimento base (igual que los ingredientes de una receta)
  const alimentoPlan = useCallback(
    (fila) => itemsEnBase([{ food_id: fila.food_id, qty: Number(fila.qty) }], alimentosPorId),
    [alimentosPorId],
  )
  // Alimentos por los que puede valer un producto: los que son ingrediente de alguna receta
  const ingredientes = useMemo(() => {
    const ids = new Set()
    for (const items of itemsBasePorReceta.values()) for (const it of items) ids.add(it.food_id)
    return [...ids]
      .map((id) => alimentosPorId.get(id))
      .filter((a) => a && !a.same_as)
      .sort((x, y) => x.name.localeCompare(y.name, 'es'))
  }, [itemsBasePorReceta, alimentosPorId])
  // El producto vinculado que hay en la despensa para cada alimento base: es el que se usa al cocinar
  const enUso = useMemo(() => productoEnUso(equivalentes, alimentosPorId, stockMap), [equivalentes, alimentosPorId, stockMap])
  const base = useCallback((a) => baseDe(a, alimentosPorId), [alimentosPorId])
  // Vencimientos (F-04): la fecha de lo que vence primero de cada alimento con stock, y la más cercana por alimento base
  // (para avisar en las recetas que lo usan). Cuánto se suele comprar de cada cosa, para la barra de "cuánto queda".
  const vencimientos = useMemo(() => {
    const m = new Map()
    for (const s of e.stock) {
      const f = vencimientoDe(s)
      if (f) m.set(s.food_id, f)
    }
    return m
  }, [e.stock])
  const vencePorBase = useMemo(() => vencimientosPorBase(e.stock, alimentosPorId, base), [e.stock, alimentosPorId, base])
  const referencias = useMemo(() => referenciasDeCompra(e.compras), [e.compras])

  // Las calorías de cada receta se calculan con el producto que realmente hay, si hay uno vinculado
  const macrosPorReceta = useMemo(() => {
    const resolver = (it) => {
      const a = alimentosPorId.get(it.food_id)
      if (!a) return null
      const p = enUso.get(baseDe(a, alimentosPorId).id)
      return p && p.id !== a.id ? { a: p, qty: convertir(a, p, it.qty) } : { a, qty: it.qty }
    }
    const m = new Map()
    for (const r of e.recetas) m.set(r.id, macrosReceta(r, itemsDe(r.id), resolver))
    return m
  }, [e.recetas, itemsDe, alimentosPorId, enUso])

  // Estado del plan de hoy en adelante: qué comidas se pueden hacer y qué falta comprar.
  const planFuturo = useMemo(() => {
    const h = hoy()
    const limite = sumarDias(h, 14)
    const yaComidas = new Set(e.registros.filter((r) => r.date === h).map((r) => r.meal))
    const filas = e.plan.filter((p) => p.date >= h && p.date <= limite && !(p.date === h && yaComidas.has(p.meal)))
    return estadoDelPlan(filas, {
      recetas: recetasPorId,
      itemsDe: itemsPlan,
      stock: stockRecetas,
      preparado: preparadoMap,
      alimentoDe: alimentoPlan,
    })
  }, [e.plan, e.registros, recetasPorId, itemsPlan, stockRecetas, preparadoMap, alimentoPlan])

  // Gasto y ejercicio de un día (F-19). Con el cálculo apagado no hay nada de eso: el objetivo es el fijo de siempre.
  //   { activo, base (el gasto sin entrenar), ejercicio (lo entrenado ese día), gasto (todo junto), objetivo ({ kcal, dinamico, base, extra }) }
  const gastoDe = useCallback(
    (fecha) => gastoDeFecha(e.perfil, e.medidas, e.entrenamientos, fecha),
    [e.perfil, e.medidas, e.entrenamientos],
  )
  // El objetivo de calorías de un día: el fijo, o el del día si la persona eligió el modo dinámico
  const objetivoDe = useCallback((fecha) => gastoDe(fecha).objetivo.kcal, [gastoDe])

  return useMemo(
    () => ({
      gastoDe,
      objetivoDe,
      vencimientos,
      vencePorBase,
      referencias,
      alimentos,
      alimentosPorId,
      categorias,
      ordenCategoria,
      deLaBase,
      recetasPorId,
      ocultas,
      favoritas,
      recetasVisibles,
      recetasOcultas,
      stockMap,
      preparadoMap,
      itemsDe,
      macrosPorReceta,
      planFuturo,
      // Equivalencias: stock e ingredientes vistos por el alimento base, y qué producto cubre cada uno
      stockRecetas,
      itemsPlan,
      alimentoPlan,
      equivalentes,
      enUso,
      base,
      ingredientes,
    }),
    [
      gastoDe,
      objetivoDe,
      vencimientos,
      vencePorBase,
      referencias,
      alimentos,
      alimentosPorId,
      categorias,
      ordenCategoria,
      deLaBase,
      recetasPorId,
      ocultas,
      favoritas,
      recetasVisibles,
      recetasOcultas,
      stockMap,
      preparadoMap,
      itemsDe,
      macrosPorReceta,
      planFuturo,
      stockRecetas,
      itemsPlan,
      alimentoPlan,
      equivalentes,
      enUso,
      base,
      ingredientes,
    ],
  )
}

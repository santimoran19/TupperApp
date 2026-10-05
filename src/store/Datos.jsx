// Estado de la app: carga todo lo del usuario desde Supabase y expone las acciones que lo modifican.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { diaSemana, hoy, sumarDias } from '../lib/fechas'
import { macrosDe, macrosReceta, redondear } from '../lib/nutricion'
import { armarPlan, estadoDelPlan } from '../lib/planificador'
import { baseDe, convertir, descartadas, descartar, equivalentesPorBase, gastar, itemsEnBase, productoEnUso, stockParaRecetas } from '../lib/equivalencias'

const Ctx = createContext(null)
export const useDatos = () => useContext(Ctx)

const VACIO = {
  cargando: true, errorCarga: null, perfil: null, alimentos: [], stock: [], recetas: [], items: [],
  preparado: [], plan: [], reglas: [], registros: [], medidas: [], lista: [], prefs: [], compras: [], analisis: [],
}

// Supabase devuelve como mucho 1000 filas por pedido: las tablas que pueden crecer se traen por páginas.
async function traerTodo(armarConsulta) {
  const filas = []
  for (let desde = 0; ; desde += 1000) {
    const pagina = ok(await armarConsulta().range(desde, desde + 999))
    filas.push(...pagina)
    if (pagina.length < 1000) return filas
  }
}

// Supabase devuelve { data, error }: si hay error lo tiramos para manejarlo en un solo lugar.
function ok({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

export function ProveedorDatos({ usuario, children }) {
  const uid = usuario.id
  const [e, setE] = useState(VACIO)
  const [aviso, setAviso] = useState(null)

  // Pregunta de confirmación: `confirmar({...})` devuelve una promesa que da true o false cuando la persona contesta
  const [pregunta, setPregunta] = useState(null)
  const confirmar = useCallback((opciones) => new Promise((resolver) => setPregunta({ ...opciones, resolver })), [])
  const responder = useCallback((valor) => setPregunta((p) => { p?.resolver(valor); return null }), [])

  // Productos para los que ya se contestó que no valen por el alimento sugerido (se recuerda en el dispositivo)
  const [sinEquivalencia, setSinEquivalencia] = useState(descartadas)
  const noPreguntar = useCallback((id) => setSinEquivalencia(descartar(id)), [])

  const avisar = useCallback((texto, tipo = 'ok') => {
    setAviso({ texto, tipo, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(null), aviso.tipo === 'error' ? 5000 : 2500)
    return () => clearTimeout(t)
  }, [aviso])

  const cargar = useCallback(async () => {
    try {
      const desde = sumarDias(hoy(), -90)
      const [perfiles, alimentos, stock, recetas, items, preparado, plan, reglas, registros, medidas, lista, prefs, compras, analisis] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).then(ok),
        traerTodo(() => supabase.from('foods').select('*').order('id')),
        supabase.from('stock').select('*').eq('user_id', uid).then(ok),
        traerTodo(() => supabase.from('recipes').select('*').order('id')),
        traerTodo(() => supabase.from('recipe_items').select('*').order('recipe_id').order('food_id')),
        supabase.from('prepared').select('*').eq('user_id', uid).then(ok),
        traerTodo(() => supabase.from('plan').select('*').eq('user_id', uid).gte('date', desde).order('id')),
        supabase.from('away_rules').select('*').eq('user_id', uid).then(ok),
        traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).gte('date', desde).order('id')),
        traerTodo(() => supabase.from('measurements').select('*').eq('user_id', uid).order('date')),
        supabase.from('shopping_items').select('*').eq('user_id', uid).then(ok),
        supabase.from('recipe_prefs').select('*').eq('user_id', uid).then(ok),
        traerTodo(() => supabase.from('purchases').select('*').eq('user_id', uid).gte('date', desde).order('id')),
        supabase.from('ai_analyses').select('*').eq('user_id', uid).gte('week_start', sumarDias(desde, -7)).then(ok),
      ])
      setE({
        cargando: false, errorCarga: null, perfil: perfiles[0] || null, alimentos, stock, recetas, items,
        preparado, plan, reglas, registros, medidas, lista, prefs, compras, analisis,
      })
    } catch (err) {
      setE((s) => ({ ...s, cargando: false, errorCarga: err.message }))
    }
  }, [uid])

  useEffect(() => { cargar() }, [cargar])

  // ---------- Datos derivados ----------
  const alimentosPorId = useMemo(() => new Map(e.alimentos.map((a) => [a.id, a])), [e.alimentos])
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
  const equivalentes = useMemo(() => equivalentesPorBase(e.alimentos, alimentosPorId), [e.alimentos, alimentosPorId])
  const stockRecetas = useMemo(() => stockParaRecetas(stockMap, alimentosPorId), [stockMap, alimentosPorId])
  const itemsBasePorReceta = useMemo(() => {
    const m = new Map()
    for (const [id, items] of itemsPorReceta) m.set(id, itemsEnBase(items, alimentosPorId))
    return m
  }, [itemsPorReceta, alimentosPorId])
  const itemsPlan = useCallback((id) => itemsBasePorReceta.get(id) || [], [itemsBasePorReceta])
  // Alimentos por los que puede valer un producto: los que son ingrediente de alguna receta
  const ingredientes = useMemo(() => {
    const ids = new Set()
    for (const items of itemsBasePorReceta.values()) for (const it of items) ids.add(it.food_id)
    return [...ids].map((id) => alimentosPorId.get(id)).filter((a) => a && !a.same_as).sort((x, y) => x.name.localeCompare(y.name, 'es'))
  }, [itemsBasePorReceta, alimentosPorId])
  // El producto vinculado que hay en la despensa para cada alimento base: es el que se usa al cocinar
  const enUso = useMemo(() => productoEnUso(equivalentes, alimentosPorId, stockMap), [equivalentes, alimentosPorId, stockMap])
  const base = useCallback((a) => baseDe(a, alimentosPorId), [alimentosPorId])

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
    return estadoDelPlan(filas, { recetas: recetasPorId, itemsDe: itemsPlan, stock: stockRecetas, preparado: preparadoMap })
  }, [e.plan, e.registros, recetasPorId, itemsPlan, stockRecetas, preparadoMap])

  // ---------- Acciones ----------
  // Envuelve cada acción: si falla muestra el error y devuelve false.
  const accion = (fn) => async (...args) => {
    try {
      const r = await fn(...args)
      return r === undefined ? true : r
    } catch (err) {
      avisar(err.message || 'Algo salió mal', 'error')
      return false
    }
  }

  const reemplazar = (lista, fila, igual) => {
    const i = lista.findIndex(igual)
    return i === -1 ? [...lista, fila] : lista.map((x, j) => (j === i ? fila : x))
  }

  // Aplica varios cambios de stock juntos. cambios: Map food_id -> diferencia (+ suma, - resta)
  async function moverStock(cambios, soloSiExiste = false) {
    const filas = []
    for (const [food_id, delta] of cambios) {
      if (soloSiExiste && !stockMap.has(food_id)) continue
      const qty = Math.min(1000000, Math.max(0, redondear((stockMap.get(food_id) || 0) + delta, 2)))
      filas.push({ user_id: uid, food_id, qty, updated_at: new Date().toISOString() })
    }
    if (filas.length === 0) return
    const guardadas = ok(await supabase.from('stock').upsert(filas, { onConflict: 'user_id,food_id' }).select())
    setE((s) => {
      let stock = s.stock
      for (const f of guardadas) stock = reemplazar(stock, f, (x) => x.food_id === f.food_id)
      return { ...s, stock }
    })
  }

  // Lo que gasta una receta: cada ingrediente sale primero del producto vinculado que haya y después del alimento base
  function gastoDeReceta(cambios, receta, porciones) {
    for (const it of itemsPlan(receta.id)) {
      const b = alimentosPorId.get(it.food_id)
      if (b) gastar(cambios, b, (it.qty / receta.servings) * porciones, equivalentes.get(b.id) || [], stockMap)
    }
  }

  async function fijarPreparado(recipe_id, portions) {
    const fila = { user_id: uid, recipe_id, portions: Math.min(1000, Math.max(0, redondear(portions, 1))) }
    const [g] = ok(await supabase.from('prepared').upsert(fila, { onConflict: 'user_id,recipe_id' }).select())
    setE((s) => ({ ...s, preparado: reemplazar(s.preparado, g, (x) => x.recipe_id === recipe_id) }))
  }

  async function guardarFilasPlan(filas) {
    if (filas.length === 0) return
    const conUsuario = filas.map((f) => ({ user_id: uid, date: f.date, meal: f.meal, recipe_id: f.recipe_id ?? null, away: !!f.away }))
    const guardadas = ok(await supabase.from('plan').upsert(conUsuario, { onConflict: 'user_id,date,meal' }).select())
    setE((s) => {
      let plan = s.plan
      for (const f of guardadas) plan = reemplazar(plan, f, (x) => x.date === f.date && x.meal === f.meal)
      return { ...s, plan }
    })
  }

  // Marca comidas del plan como "afuera" o "en casa". Si pasa a ser afuera y la receta planificada
  // no se puede llevar, se cambia por una que sí. Devuelve cuántas marcó y qué recetas cambió.
  async function ponerAfuera(lugares, away) {
    const futuras = e.plan.filter((p) => p.date >= hoy())
    const porClave = new Map(futuras.map((p) => [`${p.date}|${p.meal}`, p]))
    const filas = []
    const aCambiar = new Set()
    for (const { date, meal } of lugares) {
      const clave = `${date}|${meal}`
      const actual = porClave.get(clave)
      const receta = actual?.recipe_id && recetasPorId.get(actual.recipe_id)
      const hayParaLlevar = recetasVisibles.some((r) => r.portable && r.meal_types.includes(meal) && itemsDe(r.id).length > 0)
      if (away && receta && !receta.portable && hayParaLlevar) aCambiar.add(clave)
      else filas.push({ date, meal, recipe_id: actual?.recipe_id ?? null, away })
    }
    const cambiadas = []
    if (aCambiar.size > 0) {
      const existentes = new Map(porClave)
      for (const clave of aCambiar) existentes.set(clave, { ...porClave.get(clave), recipe_id: null, away: true })
      const fechas = [...new Set(futuras.map((p) => p.date))].sort()
      const nuevas = armarPlan({
        fechas, recetas: recetasPorId, itemsDe: itemsPlan, stock: stockRecetas, preparado: preparadoMap, reglas: new Set(), existentes, soloClaves: aCambiar, ocultas, favoritas,
      })
      for (const n of nuevas) {
        filas.push(n)
        cambiadas.push({ de: recetasPorId.get(porClave.get(`${n.date}|${n.meal}`).recipe_id).name, a: recetasPorId.get(n.recipe_id).name })
      }
    }
    await guardarFilasPlan(filas)
    return { marcadas: lugares.length, cambiadas }
  }

  async function guardarPref(recipe_id, cambios) {
    const actual = e.prefs.find((p) => p.recipe_id === recipe_id)
    const fila = { user_id: uid, recipe_id, hidden: actual?.hidden || false, favorite: actual?.favorite || false, ...cambios }
    const [g] = ok(await supabase.from('recipe_prefs').upsert(fila, { onConflict: 'user_id,recipe_id' }).select())
    setE((s) => ({ ...s, prefs: reemplazar(s.prefs, g, (x) => x.recipe_id === recipe_id) }))
  }

  const acciones = {
    recargar: cargar,
    avisar,
    confirmar,
    responder,

    guardarPerfil: accion(async (datos) => {
      const [p] = ok(await supabase.from('profiles').upsert({ id: uid, ...datos }, { onConflict: 'id' }).select())
      setE((s) => ({ ...s, perfil: p }))
    }),

    // Cambia solo algunos datos del perfil (por ejemplo, el tamaño del termo)
    ajustarPerfil: accion(async (cambios) => {
      const [p] = ok(await supabase.from('profiles').update(cambios).eq('id', uid).select())
      setE((s) => ({ ...s, perfil: p }))
    }),

    crearAlimento: accion(async (datos) => {
      const [a] = ok(await supabase.from('foods').insert({ ...datos, owner: uid }).select())
      setE((s) => ({ ...s, alimentos: [...s.alimentos, a] }))
      return a
    }),

    actualizarAlimento: accion(async (id, datos) => {
      const [a] = ok(await supabase.from('foods').update(datos).eq('id', id).select())
      setE((s) => ({ ...s, alimentos: s.alimentos.map((x) => (x.id === id ? a : x)) }))
      return a
    }),

    borrarAlimento: accion(async (id) => {
      ok(await supabase.from('foods').delete().eq('id', id))
      setE((s) => ({
        ...s,
        alimentos: s.alimentos.filter((a) => a.id !== id),
        stock: s.stock.filter((x) => x.food_id !== id),
        lista: s.lista.filter((x) => x.food_id !== id),
      }))
    }),

    fijarStock: accion(async (food_id, qty) => {
      await moverStock(new Map([[food_id, qty - (stockMap.get(food_id) || 0)]]))
    }),

    quitarDeDespensa: accion(async (food_id) => {
      ok(await supabase.from('stock').delete().eq('user_id', uid).eq('food_id', food_id))
      setE((s) => ({ ...s, stock: s.stock.filter((x) => x.food_id !== food_id) }))
    }),

    // Cocinar descuenta los ingredientes y deja las porciones como "comida lista".
    cocinar: accion(async (recipe_id, porciones) => {
      const receta = recetasPorId.get(recipe_id)
      const cambios = new Map()
      gastoDeReceta(cambios, receta, porciones)
      await moverStock(cambios)
      await fijarPreparado(recipe_id, (preparadoMap.get(recipe_id) || 0) + porciones)
    }),

    fijarPreparado: accion(fijarPreparado),

    // Registra lo que se comió. `platos` mezcla alimentos sueltos y recetas:
    //   { food_id, qty }  o  { recipe_id, porciones }
    registrar: accion(async ({ date, meal, platos, descontar = true }) => {
      if (platos.some((p) => !(Number(p.food_id ? p.qty : p.porciones) > 0))) throw new Error('Hay una cantidad que no es válida.')
      // Si la comida estaba marcada como "no comí", esa marca se saca
      for (const s of e.registros.filter((r) => r.skipped && r.date === date && r.meal === meal)) {
        ok(await supabase.from('log_entries').delete().eq('id', s.id))
      }
      const filas = []
      const cambios = new Map()
      const prepNuevo = new Map()
      for (const p of platos) {
        if (p.food_id) {
          const a = alimentosPorId.get(p.food_id)
          const m = macrosDe(a, p.qty)
          filas.push({ user_id: uid, date, meal, name: a.name, food_id: a.id, qty: p.qty, ...m })
          cambios.set(a.id, (cambios.get(a.id) || 0) - p.qty)
        } else {
          const r = recetasPorId.get(p.recipe_id)
          const m = macrosPorReceta.get(r.id)
          filas.push({
            user_id: uid, date, meal, name: r.name, recipe_id: r.id, qty: p.porciones,
            kcal: m.kcal * p.porciones, protein: m.protein * p.porciones, carbs: m.carbs * p.porciones, fat: m.fat * p.porciones,
          })
          // Primero se usan las porciones ya cocinadas; lo que no alcanza sale de los ingredientes.
          const listas = prepNuevo.has(r.id) ? prepNuevo.get(r.id) : preparadoMap.get(r.id) || 0
          const usadas = Math.min(listas, p.porciones)
          if (usadas > 0) prepNuevo.set(r.id, listas - usadas)
          const resto = p.porciones - usadas
          if (resto > 0) gastoDeReceta(cambios, r, resto)
        }
      }
      const guardadas = ok(await supabase.from('log_entries').insert(filas).select())
      setE((s) => ({ ...s, registros: [...s.registros.filter((r) => !(r.skipped && r.date === date && r.meal === meal)), ...guardadas] }))
      if (descontar) {
        await moverStock(cambios, true)
        for (const [id, n] of prepNuevo) await fijarPreparado(id, n)
      }
    }),

    // "No comí": deja la comida como resuelta sin sumar nada.
    saltear: accion(async (date, meal) => {
      const fila = { user_id: uid, date, meal, name: 'No comí', qty: 0, kcal: 0, protein: 0, carbs: 0, fat: 0, skipped: true }
      const [g] = ok(await supabase.from('log_entries').insert(fila).select())
      setE((s) => ({ ...s, registros: [...s.registros, g] }))
    }),

    borrarRegistro: accion(async (id) => {
      ok(await supabase.from('log_entries').delete().eq('id', id))
      setE((s) => ({ ...s, registros: s.registros.filter((x) => x.id !== id) }))
    }),

    guardarPlan: accion(guardarFilasPlan),

    // Marca una comida puntual del plan como afuera o en casa (ver ponerAfuera)
    marcarAfuera: accion((date, meal, away) => ponerAfuera([{ date, meal }], away)),

    vaciarPlan: accion(async (desde, hasta) => {
      ok(await supabase.from('plan').delete().eq('user_id', uid).gte('date', desde).lte('date', hasta))
      setE((s) => ({ ...s, plan: s.plan.filter((x) => x.date < desde || x.date > hasta) }))
    }),

    // Cambia una regla semanal de "como afuera" y pone al día lo que ya estaba planificado para esos días.
    alternarRegla: accion(async (weekday, meal) => {
      const existe = e.reglas.some((r) => r.weekday === weekday && r.meal === meal)
      if (existe) {
        ok(await supabase.from('away_rules').delete().eq('user_id', uid).eq('weekday', weekday).eq('meal', meal))
        setE((s) => ({ ...s, reglas: s.reglas.filter((r) => !(r.weekday === weekday && r.meal === meal)) }))
      } else {
        const [g] = ok(await supabase.from('away_rules').insert({ user_id: uid, weekday, meal }).select())
        setE((s) => ({ ...s, reglas: [...s.reglas, g] }))
      }
      const h = hoy()
      const resueltasHoy = new Set(e.registros.filter((r) => r.date === h).map((r) => r.meal))
      const lugares = e.plan.filter((p) => p.date >= h && p.meal === meal && diaSemana(p.date) === weekday && p.away === existe && !(p.date === h && resueltasHoy.has(meal)))
      return { afuera: !existe, ...(await ponerAfuera(lugares, !existe)) }
    }),

    guardarMedida: accion(async ({ date, weight_kg, waist_cm }) => {
      const fila = { user_id: uid, date, weight_kg: weight_kg || null, waist_cm: waist_cm || null }
      const [g] = ok(await supabase.from('measurements').upsert(fila, { onConflict: 'user_id,date' }).select())
      setE((s) => ({ ...s, medidas: reemplazar(s.medidas, g, (x) => x.date === date) }))
    }),

    borrarMedida: accion(async (date) => {
      ok(await supabase.from('measurements').delete().eq('user_id', uid).eq('date', date))
      setE((s) => ({ ...s, medidas: s.medidas.filter((x) => x.date !== date) }))
    }),

    agregarALista: accion(async (food_id, qty) => {
      const [g] = ok(await supabase.from('shopping_items').upsert({ user_id: uid, food_id, qty }, { onConflict: 'user_id,food_id' }).select())
      setE((s) => ({ ...s, lista: reemplazar(s.lista, g, (x) => x.food_id === food_id) }))
    }),

    quitarDeLista: accion(async (id) => {
      ok(await supabase.from('shopping_items').delete().eq('id', id))
      setE((s) => ({ ...s, lista: s.lista.filter((x) => x.id !== id) }))
    }),

    // Comprar: guarda el gasto, suma al stock y saca el producto de la lista.
    // `anotado` es el alimento que figuraba en la lista, cuando se compró un producto que vale por ese
    comprar: accion(async ({ food_id, qty, price, anotado = food_id }) => {
      const a = alimentosPorId.get(food_id)
      const [c] = ok(await supabase.from('purchases').insert({ user_id: uid, food_id, name: a.name, qty, price: price || 0, date: hoy() }).select())
      setE((s) => ({ ...s, compras: [...s.compras, c] }))
      await moverStock(new Map([[food_id, qty]]))
      const enLista = e.lista.find((x) => x.food_id === anotado) || e.lista.find((x) => x.food_id === food_id)
      if (enLista) {
        ok(await supabase.from('shopping_items').delete().eq('id', enLista.id))
        setE((s) => ({ ...s, lista: s.lista.filter((x) => x.id !== enLista.id) }))
      }
    }),

    borrarCompra: accion(async (id) => {
      ok(await supabase.from('purchases').delete().eq('id', id))
      setE((s) => ({ ...s, compras: s.compras.filter((x) => x.id !== id) }))
    }),

    crearReceta: accion(async (datos, ingredientes) => {
      const [r] = ok(await supabase.from('recipes').insert({ ...datos, owner: uid }).select())
      const filas = ingredientes.map((i) => ({ recipe_id: r.id, food_id: i.food_id, qty: i.qty }))
      const its = ok(await supabase.from('recipe_items').insert(filas).select())
      setE((s) => ({ ...s, recetas: [...s.recetas, r], items: [...s.items, ...its] }))
      return r
    }),

    // Editar una receta propia: se pisan los datos y se reemplazan los ingredientes.
    actualizarReceta: accion(async (id, datos, ingredientes) => {
      const [r] = ok(await supabase.from('recipes').update(datos).eq('id', id).select())
      ok(await supabase.from('recipe_items').delete().eq('recipe_id', id))
      const filas = ingredientes.map((i) => ({ recipe_id: id, food_id: i.food_id, qty: i.qty }))
      const its = ok(await supabase.from('recipe_items').insert(filas).select())
      setE((s) => ({ ...s, recetas: s.recetas.map((x) => (x.id === id ? r : x)), items: [...s.items.filter((i) => i.recipe_id !== id), ...its] }))
      return r
    }),

    alternarFavorita: accion((id) => guardarPref(id, { favorite: !favoritas.has(id) })),

    // "No me gusta": la receta deja de aparecer y se saca de lo que estaba planificado de hoy en adelante.
    ocultarReceta: accion(async (id) => {
      await guardarPref(id, { hidden: true, favorite: false })
      const h = hoy()
      const filas = e.plan.filter((p) => p.recipe_id === id && p.date >= h).map((p) => ({ ...p, recipe_id: null }))
      await guardarFilasPlan(filas)
      return { vaciadas: filas.length }
    }),

    mostrarReceta: accion((id) => guardarPref(id, { hidden: false })),

    borrarReceta: accion(async (id) => {
      ok(await supabase.from('recipes').delete().eq('id', id))
      setE((s) => ({
        ...s,
        recetas: s.recetas.filter((r) => r.id !== id),
        items: s.items.filter((i) => i.recipe_id !== id),
        preparado: s.preparado.filter((p) => p.recipe_id !== id),
        plan: s.plan.map((p) => (p.recipe_id === id ? { ...p, recipe_id: null } : p)),
      }))
    }),

    // Todo lo del usuario en un solo objeto, para descargarlo.
    exportar: accion(async () => {
      const [registros, plan, compras] = await Promise.all([
        traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).order('id')),
        traerTodo(() => supabase.from('plan').select('*').eq('user_id', uid).order('id')),
        traerTodo(() => supabase.from('purchases').select('*').eq('user_id', uid).order('id')),
      ])
      const nombreAlimento = (id) => alimentosPorId.get(id)?.name || null
      const nombreReceta = (id) => recetasPorId.get(id)?.name || null
      return {
        exportado: new Date().toISOString(), email: usuario.email, perfil: e.perfil,
        medidas: e.medidas,
        registros: registros.map(({ user_id, ...r }) => r),
        plan: plan.map(({ user_id, ...p }) => ({ ...p, receta: nombreReceta(p.recipe_id) })),
        comidas_fuera_de_casa: e.reglas.map((r) => ({ dia: r.weekday, comida: r.meal })),
        despensa: e.stock.map((s) => ({ alimento: nombreAlimento(s.food_id), cantidad: Number(s.qty) })),
        comida_lista: e.preparado.map((p) => ({ receta: nombreReceta(p.recipe_id), porciones: Number(p.portions) })),
        lista_de_compras: e.lista.map((l) => ({ alimento: nombreAlimento(l.food_id), cantidad: Number(l.qty) })),
        compras: compras.map((c) => ({ fecha: c.date, producto: c.name, cantidad: Number(c.qty), precio: Number(c.price) })),
        alimentos_propios: e.alimentos.filter((a) => a.owner).map(({ same_as, ...resto }) => {
          const b = base({ ...resto, same_as })
          return { ...resto, cuenta_como: b.id === resto.id ? null : b.name }
        }),
        recetas_propias: e.recetas.filter((r) => r.owner).map((r) => ({ ...r, ingredientes: itemsDe(r.id).map((i) => ({ alimento: nombreAlimento(i.food_id), cantidad: i.qty })) })),
        recetas_favoritas: [...favoritas].map(nombreReceta),
        recetas_ocultas: [...ocultas].map(nombreReceta),
        analisis_con_ia: e.analisis.map((a) => ({ semana: a.week_start, generado: a.created_at, ...a.content })),
      }
    }),

    // Pide la devolución de la semana a la función de Supabase que consulta a la IA.
    // No usa `accion` porque el error se muestra en la misma tarjeta: devuelve { analisis } o { error }.
    analizarSemana: async (lunes) => {
      try {
        const { data, error } = await supabase.functions.invoke('analizar-semana', { body: { semana: lunes, hoy: hoy() } })
        if (error) {
          // Cuando la función responde con un error, el detalle viene en el cuerpo de la respuesta
          const detalle = await error.context?.json?.().catch(() => null)
          if (detalle?.mensaje) return { error: detalle.mensaje, codigo: detalle.codigo }
          return { error: error.context?.status === 404 ? 'El análisis con IA todavía no está disponible.' : 'No se pudo pedir el análisis. Revisá la conexión y probá de nuevo.' }
        }
        if (!data?.analisis) return { error: 'No se pudo generar el análisis. Probá de nuevo.' }
        setE((s) => ({ ...s, analisis: [...s.analisis, data.analisis] }))
        return { analisis: data.analisis, restantes: data.restantes }
      } catch {
        return { error: 'No se pudo pedir el análisis. Revisá la conexión y probá de nuevo.' }
      }
    },

    // Borra la cuenta y, en cascada, todos los datos. No tiene vuelta atrás.
    borrarCuenta: accion(async () => {
      ok(await supabase.rpc('borrar_mi_cuenta'))
      await supabase.auth.signOut()
    }),

    salir: () => supabase.auth.signOut(),
  }

  const valor = {
    ...e, usuario, aviso, pregunta,
    // `recetas` son las visibles; las ocultas van aparte y recetasPorId las tiene todas (para mostrar nombres viejos)
    recetas: recetasVisibles, recetasOcultas, ocultas, favoritas,
    alimentosPorId, recetasPorId, stockMap, preparadoMap, itemsDe, macrosPorReceta, planFuturo,
    // Equivalencias: stock e ingredientes vistos por el alimento base, y qué producto cubre cada uno
    stockRecetas, itemsPlan, equivalentes, enUso, base, ingredientes, sinEquivalencia, noPreguntar,
    ...acciones,
  }
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

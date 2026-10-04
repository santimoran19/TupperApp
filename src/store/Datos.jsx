// Estado de la app: carga todo lo del usuario desde Supabase y expone las acciones que lo modifican.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { diaSemana, hoy, sumarDias } from '../lib/fechas'
import { macrosDe, macrosReceta, redondear } from '../lib/nutricion'
import { armarPlan, estadoDelPlan } from '../lib/planificador'

const Ctx = createContext(null)
export const useDatos = () => useContext(Ctx)

const VACIO = {
  cargando: true, errorCarga: null, perfil: null, alimentos: [], stock: [], recetas: [], items: [],
  preparado: [], plan: [], reglas: [], registros: [], medidas: [], lista: [], compras: [],
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
      const r = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid),
        supabase.from('foods').select('*'),
        supabase.from('stock').select('*').eq('user_id', uid),
        supabase.from('recipes').select('*'),
        supabase.from('recipe_items').select('*'),
        supabase.from('prepared').select('*').eq('user_id', uid),
        supabase.from('plan').select('*').eq('user_id', uid).gte('date', desde),
        supabase.from('away_rules').select('*').eq('user_id', uid),
        supabase.from('log_entries').select('*').eq('user_id', uid).gte('date', desde),
        supabase.from('measurements').select('*').eq('user_id', uid),
        supabase.from('shopping_items').select('*').eq('user_id', uid),
        supabase.from('purchases').select('*').eq('user_id', uid).gte('date', desde),
      ])
      const [perfiles, alimentos, stock, recetas, items, preparado, plan, reglas, registros, medidas, lista, compras] = r.map(ok)
      setE({
        cargando: false, errorCarga: null, perfil: perfiles[0] || null, alimentos, stock, recetas, items,
        preparado, plan, reglas, registros, medidas, lista, compras,
      })
    } catch (err) {
      setE((s) => ({ ...s, cargando: false, errorCarga: err.message }))
    }
  }, [uid])

  useEffect(() => { cargar() }, [cargar])

  // ---------- Datos derivados ----------
  const alimentosPorId = useMemo(() => new Map(e.alimentos.map((a) => [a.id, a])), [e.alimentos])
  const recetasPorId = useMemo(() => new Map(e.recetas.map((r) => [r.id, r])), [e.recetas])
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
  const macrosPorReceta = useMemo(() => {
    const m = new Map()
    for (const r of e.recetas) m.set(r.id, macrosReceta(r, itemsDe(r.id), alimentosPorId))
    return m
  }, [e.recetas, itemsDe, alimentosPorId])

  // Estado del plan de hoy en adelante: qué comidas se pueden hacer y qué falta comprar.
  const planFuturo = useMemo(() => {
    const h = hoy()
    const limite = sumarDias(h, 14)
    const yaComidas = new Set(e.registros.filter((r) => r.date === h).map((r) => r.meal))
    const filas = e.plan.filter((p) => p.date >= h && p.date <= limite && !(p.date === h && yaComidas.has(p.meal)))
    return estadoDelPlan(filas, { recetas: recetasPorId, itemsDe, stock: stockMap, preparado: preparadoMap })
  }, [e.plan, e.registros, recetasPorId, itemsDe, stockMap, preparadoMap])

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
      const hayParaLlevar = e.recetas.some((r) => r.portable && r.meal_types.includes(meal) && itemsDe(r.id).length > 0)
      if (away && receta && !receta.portable && hayParaLlevar) aCambiar.add(clave)
      else filas.push({ date, meal, recipe_id: actual?.recipe_id ?? null, away })
    }
    const cambiadas = []
    if (aCambiar.size > 0) {
      const existentes = new Map(porClave)
      for (const clave of aCambiar) existentes.set(clave, { ...porClave.get(clave), recipe_id: null, away: true })
      const fechas = [...new Set(futuras.map((p) => p.date))].sort()
      const nuevas = armarPlan({
        fechas, recetas: recetasPorId, itemsDe, stock: stockMap, preparado: preparadoMap, reglas: new Set(), existentes, soloClaves: aCambiar,
      })
      for (const n of nuevas) {
        filas.push(n)
        cambiadas.push({ de: recetasPorId.get(porClave.get(`${n.date}|${n.meal}`).recipe_id).name, a: recetasPorId.get(n.recipe_id).name })
      }
    }
    await guardarFilasPlan(filas)
    return { marcadas: lugares.length, cambiadas }
  }

  const acciones = {
    recargar: cargar,
    avisar,

    guardarPerfil: accion(async (datos) => {
      const [p] = ok(await supabase.from('profiles').upsert({ id: uid, ...datos }, { onConflict: 'id' }).select())
      setE((s) => ({ ...s, perfil: p }))
    }),

    crearAlimento: accion(async (datos) => {
      const [a] = ok(await supabase.from('foods').insert({ ...datos, owner: uid }).select())
      setE((s) => ({ ...s, alimentos: [...s.alimentos, a] }))
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
      for (const it of itemsDe(recipe_id)) cambios.set(it.food_id, (-it.qty / receta.servings) * porciones)
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
          if (resto > 0) {
            for (const it of itemsDe(r.id)) cambios.set(it.food_id, (cambios.get(it.food_id) || 0) - (it.qty / r.servings) * resto)
          }
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
    comprar: accion(async ({ food_id, qty, price, date }) => {
      const a = alimentosPorId.get(food_id)
      const [c] = ok(await supabase.from('purchases').insert({ user_id: uid, food_id, name: a.name, qty, price: price || 0, date: date || hoy() }).select())
      setE((s) => ({ ...s, compras: [...s.compras, c] }))
      await moverStock(new Map([[food_id, qty]]))
      const enLista = e.lista.find((x) => x.food_id === food_id)
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

    salir: () => supabase.auth.signOut(),
  }

  const valor = {
    ...e, usuario, aviso,
    alimentosPorId, recetasPorId, stockMap, preparadoMap, itemsDe, macrosPorReceta, planFuturo,
    ...acciones,
  }
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

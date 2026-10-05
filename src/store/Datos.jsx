// Estado de la app: carga todo lo del usuario desde Supabase y expone las acciones que lo modifican.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { diaSemana, hoy, sumarDias } from '../lib/fechas'
import { macrosDe, macrosReceta, redondear } from '../lib/nutricion'
import { armarPlan, estadoDelPlan } from '../lib/planificador'
import { baseDe, conFamilia, convertir, descartadas, descartar, equivalentesPorBase, gastar, itemsEnBase, productoEnUso, stockParaRecetas } from '../lib/equivalencias'
import { anotarError, anotarEvento } from '../lib/eventos'

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
function ok({ data, error, status }) {
  if (!error) return data
  // Sin respuesta del servidor (status 0): se cortó internet o el pedido tardó demasiado. Por las dudas también se mira
  // el texto, que el navegador pone en inglés y cambia según cuál sea.
  const sinConexion = status === 0 || esDeRed(error)
  throw Object.assign(new Error(mensajeDe(error, sinConexion)), { codigo: error.code || '', sinConexion, esperado: error.code === AVISO_DE_LA_BASE })
}

const esDeRed = (error) => /failed to fetch|networkerror|load failed|network request failed|network connection was lost|connection appears to be offline|timed out|aborterror/i.test(error?.message || '')

// Las funciones de la base avisan cosas a la persona ("La cantidad de porciones no es válida.") con este código:
// el texto ya viene escrito para mostrarse y no es una falla de la app, así que no se anota como error.
const AVISO_DE_LA_BASE = 'P0001'

// Los errores más comunes de la base, dichos de forma que se entiendan
function mensajeDe(error, sinConexion) {
  if (sinConexion) return 'No hay conexión. Revisá internet y probá de nuevo.'
  if (error.code === '23503') return 'Ese alimento o esa receta ya no existe. Cerrá la app, volvé a abrirla y probá de nuevo.'
  if (error.code === '23514') return 'Hay un dato fuera de rango. Revisá las cantidades.'
  if (error.code === 'PGRST301' || /jwt expired/i.test(error.message || '')) return 'Se venció la sesión. Cerrá la app, volvé a abrirla y probá de nuevo.'
  // La app nueva contra una base a la que todavía no se le aplicó la última actualización (supabase/actualizacion-N.sql)
  if (error.code === 'PGRST202') return 'Falta terminar una actualización del servidor. Probá de nuevo en un rato.'
  return error.message || 'Algo salió mal'
}

// Cada cuánto, como mínimo, se vuelven a traer los datos al volver a la app
const REFRESCO_MS = 60 * 1000

// Pone en una lista las filas que devolvió la base, reemplazando las que ya estaban (se comparan por `clave`)
function conFilas(lista, filas, clave) {
  if (!filas || filas.length === 0) return lista
  const nuevas = new Map(filas.map((f) => [f[clave], f]))
  const resto = lista.map((x) => { const n = nuevas.get(x[clave]); if (n) nuevas.delete(x[clave]); return n || x })
  return [...resto, ...nuevas.values()]
}

// Clave para un pedido que no se puede repetir (ver `unaSolaVez`). En teléfonos viejos no está crypto.randomUUID.
const nuevaClave = () => (crypto.randomUUID
  ? crypto.randomUUID()
  : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)))
// Cuánto tiempo un reintento se toma como "el mismo pedido" y no como uno nuevo
const VENTANA_REINTENTO = 5 * 60 * 1000

// Map alimento -> diferencia, como lo esperan las funciones de la base
const comoCambios = (cambios) => [...cambios].filter(([, delta]) => delta).map(([food_id, delta]) => ({ food_id, delta }))

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

  // Trae todo lo del usuario. Devuelve el estado nuevo; no toca la pantalla.
  const traer = useCallback(async () => {
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
      traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).gte('date', desde).order('created_at').order('id')),
      traerTodo(() => supabase.from('measurements').select('*').eq('user_id', uid).order('date')),
      supabase.from('shopping_items').select('*').eq('user_id', uid).then(ok),
      supabase.from('recipe_prefs').select('*').eq('user_id', uid).then(ok),
      traerTodo(() => supabase.from('purchases').select('*').eq('user_id', uid).gte('date', desde).order('id')),
      supabase.from('ai_analyses').select('*').eq('user_id', uid).gte('week_start', sumarDias(desde, -7)).then(ok),
    ])
    return {
      cargando: false, errorCarga: null, perfil: perfiles[0] || null, alimentos, stock, recetas, items,
      preparado, plan, reglas, registros, medidas, lista, prefs, compras, analisis,
    }
  }, [uid])

  // Cuándo se trajeron los datos por última vez, cuántas acciones hay en curso y un contador que sube con cada
  // cambio hecho desde acá: sirve para no pisar un cambio recién hecho con una foto de la base sacada antes.
  const ultimaCarga = useRef(0)
  const enCurso = useRef(0)
  const cambiosLocales = useRef(0)
  const refrescando = useRef(false)
  // Quedó un refresco sin hacer (había un cambio en curso, o un pedido se cortó y no se sabe si llegó). 'ya' = cuanto antes.
  const refrescoPendiente = useRef(false)
  const cargaFallida = useRef(false)

  const cargar = useCallback(async () => {
    try {
      const datos = await traer()
      ultimaCarga.current = Date.now()
      cargaFallida.current = false
      setE(datos)
    } catch (err) {
      cargaFallida.current = true
      if (!err.sinConexion) anotarError('carga', err)
      setE((s) => ({ ...s, cargando: false, errorCarga: err.message }))
    }
  }, [traer])

  useEffect(() => { cargar() }, [cargar])

  // Al volver a la app (o al recuperar la conexión) se vuelven a traer los datos sin mostrar "Cargando":
  // así lo que se cambió desde otro teléfono o desde la compu aparece solo. Si falla, se sigue con lo que hay.
  const refrescar = useCallback(async function otraVez() {
    if (refrescando.current) return
    if (enCurso.current > 0) { refrescoPendiente.current = refrescoPendiente.current || true; return } // lo pide la acción al terminar
    refrescando.current = true
    refrescoPendiente.current = false
    const antes = cambiosLocales.current
    let vieja = false
    try {
      const datos = await traer()
      // Mientras se traía hubo un cambio desde acá: esta foto ya no sirve
      if (antes !== cambiosLocales.current || enCurso.current > 0) { vieja = true; return }
      ultimaCarga.current = Date.now()
      setE((s) => (s.cargando || s.errorCarga ? s : datos))
    } catch {
      // Sin conexión o error pasajero: queda pendiente para cuando se vuelva a la app o vuelva la conexión (no insiste solo)
      refrescoPendiente.current = true
    } finally {
      refrescando.current = false
      if (vieja) {
        if (enCurso.current > 0) refrescoPendiente.current = true
        else setTimeout(otraVez, 2000)
      }
    }
  }, [traer])

  useEffect(() => {
    const alVolver = () => {
      if (document.visibilityState !== 'visible' || ultimaCarga.current === 0) return
      if (refrescoPendiente.current || Date.now() - ultimaCarga.current >= REFRESCO_MS) refrescar()
    }
    // Si la app se abrió sin conexión, cuando vuelve se carga sola (sin esperar a que toquen "Reintentar")
    const alConectar = () => { if (cargaFallida.current) cargar(); else alVolver() }
    document.addEventListener('visibilitychange', alVolver)
    window.addEventListener('focus', alVolver)
    window.addEventListener('online', alConectar)
    return () => {
      document.removeEventListener('visibilitychange', alVolver)
      window.removeEventListener('focus', alVolver)
      window.removeEventListener('online', alConectar)
    }
  }, [refrescar, cargar])

  // ---------- Datos derivados ----------
  // A los alimentos base que valen por otro (cualquier leche cuenta como leche) se les completa el vínculo
  const alimentos = useMemo(() => conFamilia(e.alimentos), [e.alimentos])
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
  // Envuelve cada acción: si falla muestra el error (y lo deja anotado) y devuelve false.
  // Con `unica`, si llega el mismo pedido mientras el anterior sigue en curso (un doble toque con la conexión lenta),
  // no se manda de nuevo: los dos toques reciben el resultado del primero. Sin eso, cocinar o comprar contarían dos veces.
  const enVuelo = useRef(new Map())
  const accion = (nombre, fn, { unica = false } = {}) => (...args) => {
    const clave = unica ? `${nombre}|${JSON.stringify(args)}` : null
    if (clave && enVuelo.current.has(clave)) return enVuelo.current.get(clave)
    const pedido = (async () => {
      enCurso.current++
      cambiosLocales.current++
      try {
        const r = await fn(...args)
        return r === undefined ? true : r
      } catch (err) {
        avisar(err?.message || 'Algo salió mal', 'error')
        if (!err?.sinConexion && !err?.esperado) anotarError('accion', err, { accion: nombre, codigo: err?.codigo || '' })
        // Si se cortó, no se sabe si el cambio llegó a guardarse: en cuanto se pueda se trae todo de nuevo
        if (err?.sinConexion) refrescoPendiente.current = refrescoPendiente.current || true
        return false
      } finally {
        enCurso.current--
        cambiosLocales.current++
        if (enCurso.current === 0 && refrescoPendiente.current) {
          const espera = refrescoPendiente.current === 'ya' ? 0 : 2000
          refrescoPendiente.current = false
          setTimeout(refrescar, espera)
        }
      }
    })()
    if (clave) {
      enVuelo.current.set(clave, pedido)
      pedido.finally(() => enVuelo.current.delete(clave))
    }
    return pedido
  }

  // Cocinar, registrar y comprar suman o restan: repetirlas no es gratis. Cada intento viaja con una clave y, si la
  // conexión se corta sin saber si llegó, el reintento manda la misma: la base no lo aplica dos veces (tabla `operaciones`).
  // `que` identifica lo que se quiso hacer; `pedir(clave)` hace el pedido. Devuelve lo que contestó la base.
  const claves = useRef(new Map()) // qué se quiso hacer -> { clave, hasta } del intento que quedó sin respuesta
  async function unaSolaVez(que, pedir) {
    const guardada = claves.current.get(que)
    const clave = guardada && Date.now() < guardada.hasta ? guardada.clave : nuevaClave()
    try {
      const r = ok(await pedir(clave))
      claves.current.delete(que)
      // Ya estaba hecho (el intento anterior había llegado): lo que hay en pantalla quedó viejo, se trae de nuevo
      if (r.repetida) refrescoPendiente.current = 'ya'
      return r
    } catch (err) {
      if (err.sinConexion) {
        if (claves.current.size >= 50) claves.current.clear()
        claves.current.set(que, { clave, hasta: Date.now() + VENTANA_REINTENTO })
      } else {
        claves.current.delete(que) // la base contestó que no: no se aplicó nada, el próximo intento es otro pedido
      }
      throw err
    }
  }

  // Pedidos en fila: los toques seguidos sobre lo mismo (el + y el - de la despensa) salen de a uno y en orden,
  // así la pantalla siempre termina mostrando el último valor que devolvió la base.
  const filas = useRef(new Map())
  const enFila = (clave, fn) => {
    const anterior = filas.current.get(clave) || Promise.resolve()
    const esta = anterior.catch(() => {}).then(fn)
    filas.current.set(clave, esta)
    esta.catch(() => {}).finally(() => { if (filas.current.get(clave) === esta) filas.current.delete(clave) })
    return esta
  }
  // Errores que son un aviso para la persona y no una falla de la app (no hace falta anotarlos)
  const invalido = (texto) => Object.assign(new Error(texto), { esperado: true })

  const reemplazar = (lista, fila, igual) => {
    const i = lista.findIndex(igual)
    return i === -1 ? [...lista, fila] : lista.map((x, j) => (j === i ? fila : x))
  }

  // Aplica varios cambios de stock juntos. cambios: Map food_id -> diferencia (+ suma, - resta).
  // La cuenta la hace la base ("restá 2"), no la app con lo que tiene en pantalla: así dos teléfonos no se pisan.
  async function moverStock(cambios) {
    const lista = comoCambios(cambios)
    if (lista.length === 0) return
    const guardadas = ok(await supabase.rpc('mover_stock', { p_cambios: lista }))
    setE((s) => ({ ...s, stock: conFilas(s.stock, guardadas, 'food_id') }))
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

    guardarPerfil: accion('guardarPerfil', async (datos) => {
      const [p] = ok(await supabase.from('profiles').upsert({ id: uid, ...datos }, { onConflict: 'id' }).select())
      setE((s) => ({ ...s, perfil: p }))
    }),

    // Cambia solo algunos datos del perfil (por ejemplo, el tamaño del termo)
    ajustarPerfil: accion('ajustarPerfil', async (cambios) => {
      const [p] = ok(await supabase.from('profiles').update(cambios).eq('id', uid).select())
      setE((s) => ({ ...s, perfil: p }))
    }),

    crearAlimento: accion('crearAlimento', async (datos) => {
      const [a] = ok(await supabase.from('foods').insert({ ...datos, owner: uid }).select())
      setE((s) => ({ ...s, alimentos: [...s.alimentos, a] }))
      return a
    }, { unica: true }),

    actualizarAlimento: accion('actualizarAlimento', async (id, datos) => {
      const [a] = ok(await supabase.from('foods').update(datos).eq('id', id).select())
      setE((s) => ({ ...s, alimentos: s.alimentos.map((x) => (x.id === id ? a : x)) }))
      return a
    }),

    borrarAlimento: accion('borrarAlimento', async (id) => {
      ok(await supabase.from('foods').delete().eq('id', id))
      setE((s) => ({
        ...s,
        alimentos: s.alimentos.filter((a) => a.id !== id),
        stock: s.stock.filter((x) => x.food_id !== id),
        lista: s.lista.filter((x) => x.food_id !== id),
      }))
    }),

    // Pone la cantidad exacta que hay (lo que la persona escribe en "¿Cuánto tenés?")
    fijarStock: accion('fijarStock', (food_id, qty) => enFila(`stock|${food_id}`, async () => {
      const fila = { user_id: uid, food_id, qty: Math.min(1000000, Math.max(0, redondear(qty, 2))), updated_at: new Date().toISOString() }
      const guardadas = ok(await supabase.from('stock').upsert(fila, { onConflict: 'user_id,food_id' }).select())
      setE((s) => ({ ...s, stock: conFilas(s.stock, guardadas, 'food_id') }))
    })),

    // Suma o resta al stock (los botones + y -)
    ajustarStock: accion('ajustarStock', (food_id, delta) => enFila(`stock|${food_id}`, () => moverStock(new Map([[food_id, delta]])))),

    quitarDeDespensa: accion('quitarDeDespensa', (food_id) => enFila(`stock|${food_id}`, async () => {
      ok(await supabase.from('stock').delete().eq('user_id', uid).eq('food_id', food_id))
      setE((s) => ({ ...s, stock: s.stock.filter((x) => x.food_id !== food_id) }))
    })),

    // Cocinar descuenta los ingredientes y deja las porciones como "comida lista". Va todo en un solo pedido: o entra todo o nada.
    cocinar: accion('cocinar', async (recipe_id, porciones) => {
      const receta = recetasPorId.get(recipe_id)
      const cambios = new Map()
      gastoDeReceta(cambios, receta, porciones)
      const r = await unaSolaVez(`cocinar|${recipe_id}|${porciones}`, (p_clave) => supabase.rpc('cocinar', { p_receta: recipe_id, p_porciones: porciones, p_stock: comoCambios(cambios), p_clave }))
      if (r.repetida) return
      setE((s) => ({ ...s, stock: conFilas(s.stock, r.stock, 'food_id'), preparado: conFilas(s.preparado, [r.preparado], 'recipe_id') }))
    }, { unica: true }),

    fijarPreparado: accion('fijarPreparado', fijarPreparado),

    // Registra lo que se comió. `platos` mezcla alimentos sueltos y recetas:
    //   { food_id, qty }  o  { recipe_id, porciones }
    registrar: accion('registrar', async ({ date, meal, platos, descontar = true }) => {
      if (platos.some((p) => !(Number(p.food_id ? p.qty : p.porciones) > 0))) throw invalido('Hay una cantidad que no es válida.')
      const filas = []
      const cambios = new Map()
      const usadas = new Map() // receta -> porciones de comida lista que se usan
      for (const p of platos) {
        if (p.food_id) {
          const a = alimentosPorId.get(p.food_id)
          const m = macrosDe(a, p.qty)
          filas.push({ name: a.name, food_id: a.id, qty: p.qty, ...m })
          cambios.set(a.id, (cambios.get(a.id) || 0) - p.qty)
        } else {
          const r = recetasPorId.get(p.recipe_id)
          const m = macrosPorReceta.get(r.id)
          filas.push({
            name: r.name, recipe_id: r.id, qty: p.porciones,
            kcal: m.kcal * p.porciones, protein: m.protein * p.porciones, carbs: m.carbs * p.porciones, fat: m.fat * p.porciones,
          })
          // Primero se usan las porciones ya cocinadas; lo que no alcanza sale de los ingredientes.
          const listas = (preparadoMap.get(r.id) || 0) - (usadas.get(r.id) || 0)
          const usa = Math.min(listas, p.porciones)
          if (usa > 0) usadas.set(r.id, (usadas.get(r.id) || 0) + usa)
          const resto = p.porciones - Math.max(0, usa)
          if (resto > 0) gastoDeReceta(cambios, r, resto)
        }
      }
      // Un solo pedido: saca la marca de "no comí" si estaba, guarda lo que se comió y descuenta de la despensa
      // (solo de lo que hay) y de la comida lista. Si se corta en el medio, no queda nada a medias.
      const r = await unaSolaVez(`registrar|${date}|${meal}|${descontar}|${JSON.stringify(platos)}`, (p_clave) => supabase.rpc('registrar_comida', {
        p_fecha: date, p_comida: meal, p_filas: filas,
        p_stock: descontar ? comoCambios(cambios) : [],
        p_preparado: descontar ? [...usadas].map(([recipe_id, n]) => ({ recipe_id, delta: -n })) : [],
        p_clave,
      }))
      if (r.repetida) return
      setE((s) => ({
        ...s,
        registros: [...s.registros.filter((x) => !(x.skipped && x.date === date && x.meal === meal)), ...r.registros],
        stock: conFilas(s.stock, r.stock, 'food_id'),
        preparado: conFilas(s.preparado, r.preparado, 'recipe_id'),
      }))
    }),

    // "No comí": deja la comida como resuelta sin sumar nada.
    saltear: accion('saltear', async (date, meal) => {
      const fila = { user_id: uid, date, meal, name: 'No comí', qty: 0, kcal: 0, protein: 0, carbs: 0, fat: 0, skipped: true }
      const [g] = ok(await supabase.from('log_entries').insert(fila).select())
      setE((s) => ({ ...s, registros: [...s.registros, g] }))
    }, { unica: true }),

    borrarRegistro: accion('borrarRegistro', async (id) => {
      ok(await supabase.from('log_entries').delete().eq('id', id))
      setE((s) => ({ ...s, registros: s.registros.filter((x) => x.id !== id) }))
    }),

    guardarPlan: accion('guardarPlan', guardarFilasPlan),

    // Marca una comida puntual del plan como afuera o en casa (ver ponerAfuera)
    marcarAfuera: accion('marcarAfuera', (date, meal, away) => ponerAfuera([{ date, meal }], away)),

    vaciarPlan: accion('vaciarPlan', async (desde, hasta) => {
      ok(await supabase.from('plan').delete().eq('user_id', uid).gte('date', desde).lte('date', hasta))
      setE((s) => ({ ...s, plan: s.plan.filter((x) => x.date < desde || x.date > hasta) }))
    }),

    // Cambia una regla semanal de "como afuera" y pone al día lo que ya estaba planificado para esos días.
    alternarRegla: accion('alternarRegla', async (weekday, meal) => {
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

    guardarMedida: accion('guardarMedida', async ({ date, weight_kg, waist_cm }) => {
      const fila = { user_id: uid, date, weight_kg: weight_kg || null, waist_cm: waist_cm || null }
      const [g] = ok(await supabase.from('measurements').upsert(fila, { onConflict: 'user_id,date' }).select())
      setE((s) => ({ ...s, medidas: reemplazar(s.medidas, g, (x) => x.date === date) }))
    }),

    borrarMedida: accion('borrarMedida', async (date) => {
      ok(await supabase.from('measurements').delete().eq('user_id', uid).eq('date', date))
      setE((s) => ({ ...s, medidas: s.medidas.filter((x) => x.date !== date) }))
    }),

    agregarALista: accion('agregarALista', async (food_id, qty) => {
      const [g] = ok(await supabase.from('shopping_items').upsert({ user_id: uid, food_id, qty }, { onConflict: 'user_id,food_id' }).select())
      setE((s) => ({ ...s, lista: reemplazar(s.lista, g, (x) => x.food_id === food_id) }))
    }),

    quitarDeLista: accion('quitarDeLista', async (id) => {
      ok(await supabase.from('shopping_items').delete().eq('id', id))
      setE((s) => ({ ...s, lista: s.lista.filter((x) => x.id !== id) }))
    }),

    // Comprar: guarda el gasto, suma al stock y saca el producto de la lista, todo en un solo pedido.
    // `anotado` es el alimento que figuraba en la lista, cuando se compró un producto que vale por ese
    comprar: accion('comprar', async ({ food_id, qty, price, anotado = food_id }) => {
      const r = await unaSolaVez(`comprar|${food_id}|${qty}|${price || 0}|${anotado}`, (p_clave) => supabase.rpc('comprar', { p_alimento: food_id, p_cantidad: qty, p_precio: price || 0, p_fecha: hoy(), p_anotado: anotado, p_clave }))
      if (r.repetida) return
      setE((s) => ({
        ...s,
        compras: [...s.compras, r.compra],
        stock: conFilas(s.stock, r.stock, 'food_id'),
        lista: r.lista ? s.lista.filter((x) => x.id !== r.lista) : s.lista,
      }))
    }, { unica: true }),

    borrarCompra: accion('borrarCompra', async (id) => {
      ok(await supabase.from('purchases').delete().eq('id', id))
      setE((s) => ({ ...s, compras: s.compras.filter((x) => x.id !== id) }))
    }),

    // La receta y sus ingredientes se guardan juntos: si algo falla, no queda una receta sin ingredientes.
    crearReceta: accion('crearReceta', async (datos, ingredientes) => {
      const r = ok(await supabase.rpc('guardar_receta', { p_id: null, p_datos: datos, p_items: ingredientes.map((i) => ({ food_id: i.food_id, qty: i.qty })) }))
      setE((s) => ({ ...s, recetas: [...s.recetas, r.receta], items: [...s.items, ...r.items] }))
      return r.receta
    }, { unica: true }),

    // Editar una receta propia: se pisan los datos y se reemplazan los ingredientes (si falla, queda como estaba).
    actualizarReceta: accion('actualizarReceta', async (id, datos, ingredientes) => {
      const r = ok(await supabase.rpc('guardar_receta', { p_id: id, p_datos: datos, p_items: ingredientes.map((i) => ({ food_id: i.food_id, qty: i.qty })) }))
      setE((s) => ({ ...s, recetas: s.recetas.map((x) => (x.id === id ? r.receta : x)), items: [...s.items.filter((i) => i.recipe_id !== id), ...r.items] }))
      return r.receta
    }, { unica: true }),

    alternarFavorita: accion('alternarFavorita', (id) => guardarPref(id, { favorite: !favoritas.has(id) })),

    // "No me gusta": la receta deja de aparecer y se saca de lo que estaba planificado de hoy en adelante.
    ocultarReceta: accion('ocultarReceta', async (id) => {
      await guardarPref(id, { hidden: true, favorite: false })
      const h = hoy()
      const filas = e.plan.filter((p) => p.recipe_id === id && p.date >= h).map((p) => ({ ...p, recipe_id: null }))
      await guardarFilasPlan(filas)
      return { vaciadas: filas.length }
    }),

    mostrarReceta: accion('mostrarReceta', (id) => guardarPref(id, { hidden: false })),

    borrarReceta: accion('borrarReceta', async (id) => {
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
    exportar: accion('exportar', async () => {
      const [registros, plan, compras, eventos] = await Promise.all([
        traerTodo(() => supabase.from('log_entries').select('*').eq('user_id', uid).order('id')),
        traerTodo(() => supabase.from('plan').select('*').eq('user_id', uid).order('id')),
        traerTodo(() => supabase.from('purchases').select('*').eq('user_id', uid).order('id')),
        traerTodo(() => supabase.from('eventos').select('created_at,tipo,nombre,detalle,version,ruta,dispositivo').eq('user_id', uid).order('id')),
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
        registro_tecnico: eventos.map((ev) => ({ fecha: ev.created_at, tipo: ev.tipo, que: ev.nombre, detalle: ev.detalle, version: ev.version, pantalla: ev.ruta, dispositivo: ev.dispositivo })),
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
          anotarEvento('ia_analisis', { resultado: 'error', codigo: detalle?.codigo || String(error.context?.status || 'red') })
          if (detalle?.mensaje) return { error: detalle.mensaje, codigo: detalle.codigo }
          return { error: error.context?.status === 404 ? 'El análisis con IA todavía no está disponible.' : 'No se pudo pedir el análisis. Revisá la conexión y probá de nuevo.' }
        }
        if (!data?.analisis) return { error: 'No se pudo generar el análisis. Probá de nuevo.' }
        cambiosLocales.current++
        setE((s) => ({ ...s, analisis: [...s.analisis.filter((a) => a.id !== data.analisis.id), data.analisis] }))
        anotarEvento('ia_analisis', { resultado: 'ok', modelo: data.analisis.model || '' })
        return { analisis: data.analisis, restantes: data.restantes }
      } catch {
        return { error: 'No se pudo pedir el análisis. Revisá la conexión y probá de nuevo.' }
      }
    },

    // Borra la cuenta y, en cascada, todos los datos. No tiene vuelta atrás.
    borrarCuenta: accion('borrarCuenta', async () => {
      ok(await supabase.rpc('borrar_mi_cuenta'))
      await supabase.auth.signOut()
    }, { unica: true }),

    salir: () => supabase.auth.signOut(),
  }

  const valor = {
    ...e, alimentos, usuario, aviso, pregunta,
    // `recetas` son las visibles; las ocultas van aparte y recetasPorId las tiene todas (para mostrar nombres viejos)
    recetas: recetasVisibles, recetasOcultas, ocultas, favoritas,
    alimentosPorId, recetasPorId, stockMap, preparadoMap, itemsDe, macrosPorReceta, planFuturo,
    // Equivalencias: stock e ingredientes vistos por el alimento base, y qué producto cubre cada uno
    stockRecetas, itemsPlan, equivalentes, enUso, base, ingredientes, deLaBase, sinEquivalencia, noPreguntar,
    ...acciones,
  }
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

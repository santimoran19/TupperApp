// Supabase simulado para las pruebas: acceso (auth), tablas (REST), funciones de la base (RPC) y un "modelo" de IA falso.
// Guarda todo en memoria y arranca con los alimentos y recetas de la base. No toca internet ni el proyecto real.
// Si Deno está instalado, además levanta la función `analizar-semana` de verdad para probarla entera.
import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { foods, recipes, conAlcohol } from '../../../scripts/seed-data.mjs'

const PUERTO = 54321
const PUERTO_FUNCION = 8000

const db = {
  profiles: [],
  foods: [],
  stock: [],
  recipes: [],
  recipe_items: [],
  prepared: [],
  plan: [],
  away_rules: [],
  log_entries: [],
  measurements: [],
  shopping_items: [],
  purchases: [],
  recipe_prefs: [],
  ai_analyses: [],
  eventos: [],
}
let numeroDeEvento = 0
// IA simulada: lo que recibió el "modelo" y cómo tiene que responder (ok | texto | error | saturado)
const ia = { pedidos: [], modo: 'ok' }
const RESPUESTA_IA = {
  resumen:
    'Registraste pocos días, así que el promedio dice poco. Los días cargados quedaste por debajo del objetivo de calorías y de proteína.',
  bien: ['Tomaste más de un litro de líquido el sábado.', 'Mantuviste el desayuno.'],
  ajustar: ['La proteína quedó en 66 g contra un objetivo de 120 g.', 'El almuerzo del sábado concentró más de la mitad de las calorías.'],
  acciones: [
    'Sumá una lata de atún o dos huevos al almuerzo.',
    'Dejá cocinado el pollo del plan para no pedir delivery.',
    'Anotá el peso una vez esta semana.',
  ],
}
const SIN_ID = new Set(['stock', 'recipe_items', 'prepared', 'away_rules', 'measurements', 'profiles', 'recipe_prefs'])
const bySlug = new Map()
for (const f of foods) {
  const row = {
    id: randomUUID(),
    owner: null,
    slug: f[0],
    name: f[1],
    unit: f[2],
    unit_grams: f[3],
    unit_label: f[4],
    kcal: f[5],
    protein: f[6],
    carbs: f[7],
    fat: f[8],
    category: f[9],
    alcohol: conAlcohol.includes(f[0]),
  }
  db.foods.push(row)
  bySlug.set(f[0], row.id)
}
for (const r of recipes) {
  const id = randomUUID()
  db.recipes.push({
    id,
    owner: null,
    slug: r.slug,
    name: r.name,
    minutes: r.minutes,
    servings: r.servings,
    meal_types: r.meal_types,
    portable: r.portable,
    steps: r.steps,
  })
  for (const [s, q] of r.items) db.recipe_items.push({ recipe_id: id, food_id: bySlug.get(s), qty: q })
}

// ---------- Funciones de la base (las de supabase/actualizacion-7.sql, hechas a mano) ----------
// Las de verdad se prueban contra un Postgres real en pruebas/unidad/base-de-datos.test.js; acá alcanza con que
// se comporten igual para la app: todo junto o nada (si algo falla, la base vuelve a como estaba).
const errorPg = (code, message) => Object.assign(new Error(message), { pg: code })
const redondo = (n, decimales) => Math.round(n * 10 ** decimales) / 10 ** decimales
const entre = (n, max, decimales) => Math.min(max, Math.max(0, redondo(n, decimales)))
const ahora = () => new Date().toISOString()

function moverStock(uid, cambios, soloSiExiste = false) {
  const juntos = new Map()
  for (const c of Array.isArray(cambios) ? cambios : []) juntos.set(c.food_id, (juntos.get(c.food_id) || 0) + Number(c.delta))
  const tocadas = []
  for (const [food_id, delta] of juntos) {
    let fila = db.stock.find((s) => s.user_id === uid && s.food_id === food_id)
    if (fila) fila.qty = entre(Number(fila.qty) + delta, 1000000, 2)
    else if (soloSiExiste) continue
    else {
      if (!db.foods.some((f) => f.id === food_id))
        throw errorPg('23503', 'insert or update on table "stock" violates foreign key constraint "stock_food_id_fkey"')
      fila = { user_id: uid, food_id, qty: entre(delta, 1000000, 2) }
      db.stock.push(fila)
    }
    fila.updated_at = ahora()
    tocadas.push(fila)
  }
  return tocadas
}

// Claves de los pedidos ya atendidos: el mismo pedido dos veces se aplica una sola
const atendidos = new Set()
function repetido(uid, clave) {
  if (!clave) return false
  const k = uid + '|' + clave
  if (atendidos.has(k)) return true
  atendidos.add(k)
  return false
}

const FUNCIONES = {
  mover_stock: (uid, a) => moverStock(uid, a.p_cambios, a.p_solo_si_existe),

  cocinar(uid, a) {
    if (!(a.p_porciones > 0 && a.p_porciones <= 1000)) throw errorPg('P0001', 'La cantidad de porciones no es válida.')
    if (repetido(uid, a.p_clave)) return { repetida: true }
    const stock = moverStock(uid, a.p_stock)
    if (!db.recipes.some((r) => r.id === a.p_receta))
      throw errorPg('23503', 'insert or update on table "prepared" violates foreign key constraint')
    let fila = db.prepared.find((p) => p.user_id === uid && p.recipe_id === a.p_receta)
    if (fila) fila.portions = Math.min(1000, entre(Number(fila.portions) + a.p_porciones, 1000, 1))
    else {
      fila = { user_id: uid, recipe_id: a.p_receta, portions: entre(a.p_porciones, 1000, 1) }
      db.prepared.push(fila)
    }
    return { stock, preparado: fila }
  },

  registrar_comida(uid, a) {
    if (!Array.isArray(a.p_filas) || a.p_filas.length === 0) throw errorPg('P0001', 'No hay nada para registrar.')
    if (!['desayuno', 'almuerzo', 'merienda', 'cena', 'extra'].includes(a.p_comida))
      throw errorPg('23514', 'new row for relation "log_entries" violates check constraint "log_entries_meal_check"')
    if (repetido(uid, a.p_clave)) return { repetida: true }
    db.log_entries = db.log_entries.filter((l) => !(l.user_id === uid && l.date === a.p_fecha && l.meal === a.p_comida && l.skipped))
    const registros = a.p_filas.map((f) => {
      if (!(f.qty >= 0) || !(Number(f.kcal || 0) <= 20000))
        throw errorPg('23514', 'new row for relation "log_entries" violates check constraint "log_entries_valores_chk"')
      return {
        id: randomUUID(),
        user_id: uid,
        date: a.p_fecha,
        meal: a.p_comida,
        name: f.name,
        food_id: f.food_id ?? null,
        recipe_id: f.recipe_id ?? null,
        qty: f.qty,
        kcal: f.kcal ?? 0,
        protein: f.protein ?? 0,
        carbs: f.carbs ?? 0,
        fat: f.fat ?? 0,
        skipped: false,
        created_at: ahora(),
      }
    })
    db.log_entries.push(...registros)
    const stock = moverStock(uid, a.p_stock, true)
    const preparado = []
    for (const c of Array.isArray(a.p_preparado) ? a.p_preparado : []) {
      const fila = db.prepared.find((p) => p.user_id === uid && p.recipe_id === c.recipe_id)
      if (!fila) continue
      fila.portions = entre(Number(fila.portions) + Number(c.delta), 1000, 1)
      preparado.push(fila)
    }
    return { registros, stock, preparado }
  },

  comprar(uid, a) {
    const alimento = db.foods.find((f) => f.id === a.p_alimento && (f.owner === null || f.owner === uid))
    if (!alimento) throw errorPg('P0001', 'Ese alimento ya no existe.')
    if (!(a.p_cantidad > 0 && a.p_cantidad <= 1000000))
      throw errorPg('23514', 'new row for relation "purchases" violates check constraint "purchases_qty_chk"')
    if (repetido(uid, a.p_clave)) return { repetida: true }
    const compra = {
      id: randomUUID(),
      user_id: uid,
      food_id: alimento.id,
      name: alimento.name,
      qty: a.p_cantidad,
      price: a.p_precio ?? 0,
      date: a.p_fecha || ahora().slice(0, 10),
    }
    db.purchases.push(compra)
    const stock = moverStock(uid, [{ food_id: alimento.id, delta: a.p_cantidad }])
    const mias = db.shopping_items.filter((l) => l.user_id === uid)
    const anotada = mias.find((l) => l.food_id === a.p_anotado) || mias.find((l) => l.food_id === a.p_alimento)
    if (anotada) db.shopping_items = db.shopping_items.filter((l) => l !== anotada)
    return { compra, stock, lista: anotada ? anotada.id : null }
  },

  guardar_receta(uid, a) {
    if (!Array.isArray(a.p_items) || a.p_items.length === 0) throw errorPg('P0001', 'Agregá al menos un ingrediente.')
    const d = a.p_datos || {}
    const datos = {
      name: d.name,
      minutes: d.minutes,
      servings: d.servings,
      meal_types: d.meal_types || [],
      portable: d.portable ?? true,
      steps: d.steps || '',
    }
    let receta
    if (a.p_id) {
      receta = db.recipes.find((r) => r.id === a.p_id && r.owner === uid)
      if (!receta) throw errorPg('P0001', 'Esa receta no se puede editar.')
      Object.assign(receta, datos)
      db.recipe_items = db.recipe_items.filter((i) => i.recipe_id !== receta.id)
    } else {
      receta = { id: randomUUID(), owner: uid, slug: null, ...datos }
      db.recipes.push(receta)
    }
    const items = a.p_items.map((i) => {
      if (!(i.qty > 0)) throw errorPg('23514', 'new row for relation "recipe_items" violates check constraint "recipe_items_qty_check"')
      if (!db.foods.some((f) => f.id === i.food_id))
        throw errorPg('23503', 'insert or update on table "recipe_items" violates foreign key constraint')
      return { recipe_id: receta.id, food_id: i.food_id, qty: i.qty }
    })
    db.recipe_items.push(...items)
    return { receta, items }
  },
}

const users = new Map() // email -> {id, email, password, confirmado}
const mails = [] // mails "enviados"
const verificaciones = []
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
function sesion(u) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const token = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: u.id, email: u.email, role: 'authenticated', exp })}.firma`
  const user = {
    id: u.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: u.email,
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
  }
  return { access_token: token, token_type: 'bearer', expires_in: 3600, expires_at: exp, refresh_token: 'r-' + u.id, user }
}
function uidDe(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '')
  try {
    return JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString()).sub
  } catch {
    return null
  }
}

function filtros(url) {
  const fs = []
  for (const [k, v] of url.searchParams) {
    if (['select', 'on_conflict', 'order', 'limit', 'offset', 'columns'].includes(k)) continue
    const [op, ...resto] = v.split('.')
    fs.push({ k, op, val: resto.join('.') })
  }
  return (row) =>
    fs.every(({ k, op, val }) => {
      const x = row[k] === null || row[k] === undefined ? null : String(row[k])
      if (op === 'eq') return x === val
      if (op === 'gte') return x >= val
      if (op === 'lte') return x <= val
      if (op === 'is') return val === 'null' ? x === null : x !== null
      if (op === 'in')
        return val
          .replace(/^\(|\)$/g, '')
          .split(',')
          .map((t) => t.replace(/^"|"$/g, ''))
          .includes(x)
      throw new Error('op no soportado ' + op)
    })
}

let listo = false
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Expose-Headers': '*',
  }
  const send = (code, body) => {
    res.writeHead(code, { ...cors, 'Content-Type': 'application/json' })
    res.end(body === undefined ? '' : JSON.stringify(body))
  }
  if (req.method === 'OPTIONS') return send(204)
  let raw = ''
  for await (const c of req) raw += c
  const body = raw ? JSON.parse(raw) : null
  try {
    // Para que las pruebas (y Playwright) sepan cuándo está todo listo y si hay función de IA
    if (url.pathname === '/_pruebas/estado') return listo ? send(200, { funcion: funcion.activa }) : send(503, { message: 'arrancando' })
    if (url.pathname === '/auth/v1/signup') {
      // Los mails @codigo.test simulan el proyecto con "Confirm email" activado: sin sesión hasta poner el código 123456
      const conCodigo = body.email.endsWith('@codigo.test')
      if (users.has(body.email)) {
        if (conCodigo) return send(200, { id: randomUUID(), aud: 'authenticated', role: '', email: body.email, identities: [] })
        return send(422, { code: 422, error_code: 'user_already_exists', msg: 'User already registered' })
      }
      const u = { id: randomUUID(), email: body.email, password: body.password, confirmado: !conCodigo }
      users.set(u.email, u)
      mails.push({ tipo: 'signup', email: u.email })
      if (conCodigo)
        return send(200, {
          ...sesion(u).user,
          identities: [{ id: u.id, provider: 'email' }],
          confirmation_sent_at: new Date().toISOString(),
        })
      return send(200, sesion(u))
    }
    if (url.pathname === '/auth/v1/verify') {
      const u = users.get(body.email)
      if (!u || body.token !== '123456') return send(403, { code: 403, error_code: 'otp_expired', msg: 'Token has expired or is invalid' })
      if (body.type === 'email' || body.type === 'signup') u.confirmado = true
      verificaciones.push({ tipo: body.type, email: body.email })
      return send(200, sesion(u))
    }
    if (url.pathname === '/auth/v1/resend' || url.pathname === '/auth/v1/recover') {
      mails.push({ tipo: url.pathname.split('/').pop(), email: body.email })
      return send(200, {})
    }
    if (url.pathname === '/auth/v1/_mock')
      return send(200, {
        mails,
        verificaciones,
        usuarios: [...users.values()].map((u) => ({ email: u.email, password: u.password, confirmado: u.confirmado })),
      })
    if (url.pathname === '/auth/v1/token') {
      if (url.searchParams.get('grant_type') === 'password') {
        const u = users.get(body.email)
        if (!u || u.password !== body.password)
          return send(400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' })
        if (!u.confirmado) return send(400, { code: 400, error_code: 'email_not_confirmed', msg: 'Email not confirmed' })
        return send(200, sesion(u))
      }
      const u = [...users.values()].find((x) => 'r-' + x.id === body.refresh_token)
      return u ? send(200, sesion(u)) : send(400, { msg: 'bad refresh' })
    }
    if (url.pathname === '/auth/v1/user') {
      const u = [...users.values()].find((x) => x.id === uidDe(req))
      if (!u) return send(401, { msg: 'no' })
      if (req.method === 'PUT' && body?.password) {
        if (body.password === u.password)
          return send(422, { code: 422, error_code: 'same_password', msg: 'New password should be different from the old password.' })
        u.password = body.password
      }
      return send(200, sesion(u).user)
    }
    if (url.pathname === '/auth/v1/logout') return send(204)

    // ---- "Modelo" simulado: devuelve una devolución fija con la forma de la API de Anthropic
    if (url.pathname === '/anthropic/_modo') {
      ia.modo = body.modo
      return send(200, { modo: ia.modo })
    }
    if (url.pathname === '/anthropic/_pedidos') return send(200, ia.pedidos)
    if (url.pathname === '/anthropic/v1/messages') {
      ia.pedidos.push({ clave: req.headers['x-api-key'], version: req.headers['anthropic-version'], ...body })
      if (ia.modo === 'error') return send(401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } })
      if (ia.modo === 'saturado') return send(529, { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } })
      const texto =
        ia.modo === 'texto' ? 'Esta semana viniste bien, pero te faltó proteína.' : '```json\n' + JSON.stringify(RESPUESTA_IA) + '\n```'
      return send(200, {
        id: 'msg_1',
        type: 'message',
        role: 'assistant',
        model: body.model,
        content: [{ type: 'text', text: texto }],
        stop_reason: 'end_turn',
        usage: { input_tokens: 900, output_tokens: 250 },
      })
    }
    // ---- Lo mismo con la forma de la API de Groq (formato OpenAI). Se anota el pedido con los mismos nombres que el de Anthropic.
    if (url.pathname === '/groq/openai/v1/chat/completions') {
      ia.pedidos.push({
        proveedor: 'groq',
        clave: (req.headers.authorization || '').replace('Bearer ', ''),
        version: null,
        model: body.model,
        max_tokens: body.max_completion_tokens,
        system: body.messages.find((m) => m.role === 'system')?.content || '',
        messages: body.messages.filter((m) => m.role === 'user'),
        extra: { reasoning_effort: body.reasoning_effort, include_reasoning: body.include_reasoning, temperature: body.temperature },
      })
      if (ia.modo === 'error')
        return send(401, { error: { message: 'Invalid API Key', type: 'invalid_request_error', code: 'invalid_api_key' } })
      if (ia.modo === 'saturado')
        return send(429, {
          error: {
            message: 'Rate limit reached for model in organization on tokens per minute (TPM)',
            type: 'tokens',
            code: 'rate_limit_exceeded',
          },
        })
      if (ia.modo === 'cortado')
        return send(200, {
          id: 'c1',
          object: 'chat.completion',
          model: body.model,
          choices: [{ index: 0, message: { role: 'assistant', content: '{"resumen": "Esta semana viniste' }, finish_reason: 'length' }],
          usage: { prompt_tokens: 900, completion_tokens: 1800, total_tokens: 2700 },
        })
      const texto = ia.modo === 'texto' ? 'Esta semana viniste bien, pero te faltó proteína.' : JSON.stringify(RESPUESTA_IA)
      return send(200, {
        id: 'c1',
        object: 'chat.completion',
        model: body.model,
        choices: [{ index: 0, message: { role: 'assistant', content: texto }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 900, completion_tokens: 250, total_tokens: 1150 },
      })
    }
    // ---- Funciones: se le pasa el pedido a la función real, corriendo en Deno en el puerto 8000
    if (url.pathname.startsWith('/functions/v1/')) {
      try {
        const r = await fetch(`http://localhost:${PUERTO_FUNCION}` + url.pathname, {
          method: req.method,
          body: raw || undefined,
          headers: { 'content-type': 'application/json', authorization: req.headers.authorization || '', apikey: req.headers.apikey || '' },
        })
        res.writeHead(r.status, { ...cors, 'Content-Type': 'application/json' })
        return res.end(await r.text())
      } catch {
        return send(404, { code: 'NOT_FOUND', message: 'Requested function was not found' })
      }
    }
    if (url.pathname === '/rest/v1/rpc/borrar_mi_cuenta') {
      const uid = uidDe(req)
      for (const [email, u] of users) if (u.id === uid) users.delete(email)
      for (const t of Object.keys(db))
        db[t] = db[t].filter((r) => r.user_id !== uid && r.owner !== uid && !(t === 'profiles' && r.id === uid))
      return send(204)
    }
    const funcionPedida = url.pathname.match(/^\/rest\/v1\/rpc\/(\w+)$/)
    if (funcionPedida) {
      const hacer = FUNCIONES[funcionPedida[1]]
      if (!hacer) return send(404, { code: 'PGRST202', message: 'Could not find the function public.' + funcionPedida[1] })
      const uid = uidDe(req)
      if (!uid) return send(401, { message: 'sin sesión' })
      const copia = structuredClone(db)
      const claves = new Set(atendidos)
      try {
        return send(200, hacer(uid, body || {}))
      } catch (e) {
        Object.assign(db, copia) // como en la base: si falla, no queda nada a medias (ni la clave del pedido)
        atendidos.clear()
        for (const k of claves) atendidos.add(k)
        if (e.pg) return send(400, { code: e.pg, message: e.message, details: null, hint: null })
        throw e
      }
    }
    const m = url.pathname.match(/^\/rest\/v1\/(\w+)$/)
    if (!m || !db[m[1]]) return send(404, { message: 'no existe ' + url.pathname })
    const tabla = m[1]
    const uid = uidDe(req)
    if (!uid) return send(401, { message: 'sin sesión' })
    const visible = (row) => {
      if (tabla === 'foods' || tabla === 'recipes') return row.owner === null || row.owner === uid
      if (tabla === 'recipe_items') return true
      if (tabla === 'profiles') return row.id === uid
      return row.user_id === uid
    }
    const pasa = filtros(url)
    // .single() de supabase-js pide un objeto en vez de una lista
    const unico = (req.headers.accept || '').includes('vnd.pgrst.object')
    const lista = (codigo, filas) => {
      if (!unico) return send(codigo, filas)
      return filas.length === 1
        ? send(codigo, filas[0])
        : send(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' })
    }
    if ((tabla === 'ai_analyses' || tabla === 'eventos') && (req.method === 'PATCH' || req.method === 'DELETE'))
      return send(403, { message: 'permission denied for table ' + tabla })
    if (req.method === 'GET') {
      const filas = db[tabla].filter((r) => visible(r) && pasa(r))
      const desde = Number(url.searchParams.get('offset') || 0)
      const limite = url.searchParams.get('limit')
      return lista(200, limite ? filas.slice(desde, desde + Number(limite)) : filas.slice(desde))
    }
    if (req.method === 'POST') {
      const filas = Array.isArray(body) ? body : [body]
      const conflicto = url.searchParams.get('on_conflict')
      const upsert = (req.headers.prefer || '').includes('merge-duplicates')
      const out = []
      for (const f of filas) {
        if ((tabla === 'foods' || tabla === 'recipes') && f.owner !== uid)
          return send(403, { message: 'new row violates row-level security policy' })
        if (f.user_id && f.user_id !== uid) return send(403, { message: 'new row violates row-level security policy' })
        let existente = null
        if (upsert && conflicto) {
          const cols = conflicto.split(',')
          existente = db[tabla].find((r) => cols.every((c) => String(r[c]) === String(f[c])))
        }
        if (existente) {
          Object.assign(existente, f)
          out.push(existente)
        } else {
          const fila = { ...(SIN_ID.has(tabla) ? {} : { id: randomUUID() }), ...f }
          if (['log_entries', 'shopping_items', 'profiles', 'ai_analyses'].includes(tabla)) fila.created_at = new Date().toISOString()
          if (tabla === 'log_entries' && fila.skipped === undefined) fila.skipped = false
          if (tabla === 'profiles') Object.assign(fila, { thermos_ml: 1000, water_target_ml: null, ...f })
          if (tabla === 'foods' && fila.alcohol === undefined) fila.alcohol = false
          if (tabla === 'purchases' && !fila.date) fila.date = new Date().toISOString().slice(0, 10)
          if (tabla === 'eventos')
            Object.assign(fila, {
              id: ++numeroDeEvento,
              user_id: uid,
              created_at: ahora(),
              detalle: fila.detalle || {},
              version: fila.version || '',
              ruta: fila.ruta || '',
              dispositivo: fila.dispositivo || '',
            })
          db[tabla].push(fila)
          out.push(fila)
        }
      }
      return lista(201, out)
    }
    if (req.method === 'PATCH') {
      const out = db[tabla].filter((r) => visible(r) && pasa(r))
      out.forEach((r) => Object.assign(r, body))
      return send(200, out)
    }
    if (req.method === 'DELETE') {
      const borrar = db[tabla].filter((r) => visible(r) && pasa(r))
      db[tabla] = db[tabla].filter((r) => !borrar.includes(r))
      if (tabla === 'recipes') db.recipe_items = db.recipe_items.filter((i) => !borrar.some((r) => r.id === i.recipe_id))
      return send(200, borrar)
    }
    send(405, { message: 'método' })
  } catch (e) {
    console.error('ERROR DEL SIMULADOR', req.method, req.url, e)
    send(500, { message: String(e) })
  }
})

// ---------- La función de IA, corriendo en Deno (si está instalado) ----------
const funcion = { activa: false }
async function levantarFuncion() {
  const carpeta = fileURLToPath(new URL('../../../supabase/functions/analizar-semana/', import.meta.url))
  const base = `http://localhost:${PUERTO}`
  const hijo = spawn(process.env.DENO || 'deno', ['run', '--no-lock', '--allow-net', '--allow-env', 'index.ts'], {
    cwd: carpeta,
    stdio: 'ignore',
    env: {
      ...process.env,
      SUPABASE_URL: base,
      IA_PROVEEDOR: '',
      GROQ_API_KEY: 'clave-de-prueba',
      GROQ_URL: base + '/groq/openai/v1/chat/completions',
      ANTHROPIC_API_KEY: 'clave-de-prueba',
      ANTHROPIC_URL: base + '/anthropic/v1/messages',
    },
  })
  let sinDeno = false
  hijo.on('error', () => {
    sinDeno = true
  })
  hijo.on('exit', () => {
    sinDeno = true
  })
  const matar = () => {
    try {
      hijo.kill()
    } catch {
      /* ya terminó */
    }
  }
  process.on('exit', matar)
  for (const s of ['SIGINT', 'SIGTERM'])
    process.on(s, () => {
      matar()
      process.exit(0)
    })
  // Se espera hasta 20 segundos a que conteste; si Deno no está, se sigue sin la función
  for (let i = 0; i < 80 && !sinDeno; i++) {
    try {
      await fetch(`http://localhost:${PUERTO_FUNCION}/`, { method: 'OPTIONS' })
      funcion.activa = true
      return
    } catch {
      await new Promise((r) => setTimeout(r, 250))
    }
  }
}

server.listen(PUERTO, async () => {
  await levantarFuncion()
  console.log(
    `Supabase simulado en ${PUERTO}` + (funcion.activa ? ' (con la función de IA)' : ' (sin Deno: las pruebas de la IA se saltean)'),
  )
  listo = true
})

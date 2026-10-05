// Análisis semanal con IA: la parte que arma los datos y lee la respuesta, y la elección del proveedor.
// Son los mismos archivos que corren en la función de Supabase (ahí con Deno; acá se simula lo poco que usan de Deno).
import { afterEach, expect, test, vi } from 'vitest'
import { armarDatos, esFecha, interpretar, lunesDe, sumarDias } from '../../supabase/functions/analizar-semana/logica.ts'
import { proveedor } from '../../supabase/functions/analizar-semana/proveedores.ts'

// ---------- Fechas ----------
test('fechas: validar, sumar días y encontrar el lunes', () => {
  expect([esFecha('2026-10-05'), esFecha('2026-13-40'), esFecha('5/10/2026'), esFecha(null)]).toEqual([true, false, false, false])
  expect(sumarDias('2026-09-28', 6)).toBe('2026-10-04')
  expect(sumarDias('2026-03-01', -1)).toBe('2026-02-28')
  // lunes, miércoles y domingo de la misma semana dan el mismo lunes
  expect(['2026-09-28', '2026-09-30', '2026-10-04', '2026-10-05'].map(lunesDe)).toEqual(['2026-09-28', '2026-09-28', '2026-09-28', '2026-10-05'])
})

// ---------- Datos que se le pasan al modelo ----------
const perfil = { name: 'Santi', sex: 'm', birth_date: '2004-09-14', height_cm: 170, weight_kg: 80, goal_weight_kg: 70, activity: 1.55, kcal_target: 2100, protein_target: 120, water_target_ml: null }
const alimentos = [
  { id: 'agua', unit: 'ml', category: 'Bebidas', alcohol: false },
  { id: 'fernet', unit: 'ml', category: 'Bebidas', alcohol: true },
  { id: 'leche', unit: 'ml', category: 'Lácteos', alcohol: false },
  { id: 'aceite', unit: 'ml', category: 'Despensa', alcohol: false },
]
const fila = (date, meal, name, kcal, extra = {}) => ({ date, meal, name, food_id: null, qty: 1, kcal, protein: 20, carbs: 30, fat: 5, skipped: false, ...extra })
const registros = [
  fila('2026-09-28', 'desayuno', 'Avena con leche', 300),
  fila('2026-09-28', 'almuerzo', 'Fideos con atún', 500),
  fila('2026-09-28', 'extra', 'Agua', 0, { food_id: 'agua', qty: 500, protein: 0, carbs: 0, fat: 0 }),
  fila('2026-09-28', 'extra', 'Fernet con coca', 200, { food_id: 'fernet', qty: 250, protein: 0 }),
  fila('2026-09-28', 'extra', 'Aceite', 90, { food_id: 'aceite', qty: 10, protein: 0 }),
  fila('2026-09-29', 'almuerzo', 'Fideos con atún', 500),
  fila('2026-09-29', 'cena', 'No comí', 0, { skipped: true, qty: 0, protein: 0, carbs: 0, fat: 0 }),
  fila('2026-09-30', 'merienda', 'No comí', 0, { skipped: true, qty: 0, protein: 0, carbs: 0, fat: 0 }),
]
const medidas = [{ date: '2026-09-20', weight_kg: 80.5 }, { date: '2026-09-27', weight_kg: null }, { date: '2026-09-28', weight_kg: 79.8 }]

test('arma los datos de la semana sin nombre ni email, y solo hasta hoy', () => {
  const { datos, diasConRegistro } = armarDatos({ perfil, registros, alimentos, medidas, lunes: '2026-09-28', hoy: '2026-10-01' })
  expect(diasConRegistro).toBe(2)
  expect(JSON.stringify(datos)).not.toContain('Santi')
  expect(datos.persona).toEqual({ sexo: 'masculino', edad: 22, altura_cm: 170, peso_kg: 80, peso_objetivo_kg: 70, actividad: 'moderado' })
  // Sin objetivo propio de líquido se calcula por el peso: 35 ml por kilo
  expect(datos.objetivos_por_dia).toEqual({ kcal: 2100, proteina_g: 120, liquido_ml: 2800 })
  expect(datos.semana.dias.map((d) => d.dia)).toEqual(['lunes', 'martes', 'miércoles', 'jueves'])
  const [lunes, martes, miercoles, jueves] = datos.semana.dias
  expect(lunes).toMatchObject({ kcal: 1090, proteina_g: 40, liquido_ml: 500, alcohol_ml: 250, comidas_registradas: ['desayuno', 'almuerzo'], kcal_entre_comidas: 290 })
  expect(martes).toMatchObject({ kcal: 500, comidas_registradas: ['almuerzo'], comidas_salteadas: ['cena'] })
  expect(martes.alcohol_ml).toBeUndefined()
  // Un día en el que solo se marcó "no comí" cuenta como sin registro
  expect(miercoles).toEqual({ dia: 'miércoles', fecha: '2026-09-30', sin_registro: true })
  expect(jueves.sin_registro).toBe(true)
  expect(datos.mas_consumido[0]).toEqual({ nombre: 'Fideos con atún', veces: 2, kcal_total: 1000 })
  expect(datos.mas_consumido.some((g) => g.nombre === 'No comí')).toBe(false)
  expect(datos.peso_registrado).toEqual([{ fecha: '2026-09-20', kg: 80.5 }, { fecha: '2026-09-28', kg: 79.8 }])
})

test('el objetivo de líquido propio le gana al calculado', () => {
  const { datos } = armarDatos({ perfil: { ...perfil, water_target_ml: 3000 }, registros: [], alimentos: [], medidas: [], lunes: '2026-09-28', hoy: '2026-09-28' })
  expect(datos.objetivos_por_dia.liquido_ml).toBe(3000)
})

// ---------- Lectura de la respuesta ----------
test('lee el JSON del modelo aunque venga envuelto, y recorta lo que sobra', () => {
  const json = { resumen: ' Bien. ', bien: ['a', 'b', 'c', 'd', 'e'], ajustar: ['x', 7, ''], acciones: 'no es una lista', otra: 'se ignora' }
  expect(interpretar('```json\n' + JSON.stringify(json) + '\n```')).toEqual({ resumen: 'Bien.', bien: ['a', 'b', 'c', 'd'], ajustar: ['x'], acciones: [] })
})

test('si no vino JSON, el texto queda como resumen; vacío es un error', () => {
  expect(interpretar('Esta semana viniste bien.')).toEqual({ resumen: 'Esta semana viniste bien.', bien: [], ajustar: [], acciones: [] })
  expect(interpretar('{"resumen": "cortado').resumen).toBe('{"resumen": "cortado')
  expect(() => interpretar('   ')).toThrow()
})

// ---------- Proveedor ----------
const conSecretos = (secretos) => vi.stubGlobal('Deno', { env: { get: (k) => secretos[k] } })
afterEach(() => vi.unstubAllGlobals())

test('sin ninguna clave no hay proveedor', () => {
  conSecretos({})
  expect(proveedor()).toBeNull()
})

test('elige por la clave que haya (primero Groq) o por IA_PROVEEDOR', () => {
  conSecretos({ GROQ_API_KEY: 'g', ANTHROPIC_API_KEY: 'a' })
  expect(proveedor()).toMatchObject({ nombre: 'groq', modelo: 'openai/gpt-oss-120b' })
  conSecretos({ ANTHROPIC_API_KEY: 'a' })
  expect(proveedor()).toMatchObject({ nombre: 'anthropic', modelo: 'claude-haiku-4-5-20251001' })
  conSecretos({ GROQ_API_KEY: 'g', ANTHROPIC_API_KEY: 'a', IA_PROVEEDOR: 'Anthropic', ANTHROPIC_MODEL: 'otro-modelo' })
  expect(proveedor()).toMatchObject({ nombre: 'anthropic', modelo: 'otro-modelo' })
  // Se pidió un proveedor que no tiene clave: no se usa el otro por las dudas
  conSecretos({ GROQ_API_KEY: 'g', IA_PROVEEDOR: 'anthropic' })
  expect(proveedor()).toBeNull()
})

test('Groq: arma el pedido, lee la respuesta y avisa si quedó cortada', async () => {
  conSecretos({ GROQ_API_KEY: 'clave' })
  const pedidos = []
  let respuesta = { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'hola' }, finish_reason: 'stop' }] }) }
  vi.stubGlobal('fetch', async (url, opciones) => { pedidos.push({ url, ...opciones, body: JSON.parse(opciones.body) }); return respuesta })
  const ia = proveedor()
  expect(await ia.pedir('instrucciones', 'mensaje', undefined)).toEqual({ ok: true, texto: 'hola', cortado: false })
  expect(pedidos[0].url).toBe('https://api.groq.com/openai/v1/chat/completions')
  expect(pedidos[0].headers.authorization).toBe('Bearer clave')
  expect(pedidos[0].body).toMatchObject({ model: 'openai/gpt-oss-120b', reasoning_effort: 'low', include_reasoning: false, messages: [{ role: 'system', content: 'instrucciones' }, { role: 'user', content: 'mensaje' }] })
  respuesta = { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: '{"resumen": "a med' }, finish_reason: 'length' }] }) }
  expect((await ia.pedir('i', 'm', undefined)).cortado).toBe(true)
  respuesta = { ok: false, status: 429, json: async () => ({ error: { message: 'Rate limit reached', type: 'tokens' } }) }
  expect(await ia.pedir('i', 'm', undefined)).toEqual({ ok: false, estado: 429, tipo: 'tokens', mensaje: 'Rate limit reached' })
})

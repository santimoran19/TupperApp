// Plan de la semana y comidas fuera de casa.
import { diaSemana, hoy } from '../../lib/fechas'
import { armarPlan } from '../../lib/planificador'
import { ok, supabase } from '../base'
import { reemplazar } from '../listas'

export async function guardarFilasPlan(k, filas) {
  if (filas.length === 0) return
  const conUsuario = filas.map((f) => ({ user_id: k.uid, date: f.date, meal: f.meal, recipe_id: f.recipe_id ?? null, away: !!f.away }))
  const guardadas = ok(await supabase.from('plan').upsert(conUsuario, { onConflict: 'user_id,date,meal' }).select())
  k.setE((s) => {
    let plan = s.plan
    for (const f of guardadas) plan = reemplazar(plan, f, (x) => x.date === f.date && x.meal === f.meal)
    return { ...s, plan }
  })
}

// Marca comidas del plan como "afuera" o "en casa". Si pasa a ser afuera y la receta planificada
// no se puede llevar, se cambia por una que sí. Devuelve cuántas marcó y qué recetas cambió.
async function ponerAfuera(k, lugares, away) {
  const v = k.ver()
  const futuras = v.e.plan.filter((p) => p.date >= hoy())
  const porClave = new Map(futuras.map((p) => [`${p.date}|${p.meal}`, p]))
  const filas = []
  const aCambiar = new Set()
  for (const { date, meal } of lugares) {
    const clave = `${date}|${meal}`
    const actual = porClave.get(clave)
    const receta = actual?.recipe_id && v.recetasPorId.get(actual.recipe_id)
    const hayParaLlevar = v.recetasVisibles.some((r) => r.portable && r.meal_types.includes(meal) && v.itemsDe(r.id).length > 0)
    if (away && receta && !receta.portable && hayParaLlevar) aCambiar.add(clave)
    else filas.push({ date, meal, recipe_id: actual?.recipe_id ?? null, away })
  }
  const cambiadas = []
  if (aCambiar.size > 0) {
    const existentes = new Map(porClave)
    for (const clave of aCambiar) existentes.set(clave, { ...porClave.get(clave), recipe_id: null, away: true })
    const fechas = [...new Set(futuras.map((p) => p.date))].sort()
    const nuevas = armarPlan({
      fechas,
      recetas: v.recetasPorId,
      itemsDe: v.itemsPlan,
      stock: v.stockRecetas,
      preparado: v.preparadoMap,
      reglas: new Set(),
      existentes,
      soloClaves: aCambiar,
      ocultas: v.ocultas,
      favoritas: v.favoritas,
    })
    for (const n of nuevas) {
      filas.push(n)
      cambiadas.push({
        de: v.recetasPorId.get(porClave.get(`${n.date}|${n.meal}`).recipe_id).name,
        a: v.recetasPorId.get(n.recipe_id).name,
      })
    }
  }
  await guardarFilasPlan(k, filas)
  return { marcadas: lugares.length, cambiadas }
}

export const accionesDePlan = (k) => ({
  guardarPlan: k.accion('guardarPlan', (filas) => guardarFilasPlan(k, filas)),

  // Marca una comida puntual del plan como afuera o en casa (ver ponerAfuera)
  marcarAfuera: k.accion('marcarAfuera', (date, meal, away) => ponerAfuera(k, [{ date, meal }], away)),

  vaciarPlan: k.accion('vaciarPlan', async (desde, hasta) => {
    ok(await supabase.from('plan').delete().eq('user_id', k.uid).gte('date', desde).lte('date', hasta))
    k.setE((s) => ({ ...s, plan: s.plan.filter((x) => x.date < desde || x.date > hasta) }))
  }),

  // Cambia una regla semanal de "como afuera" y pone al día lo que ya estaba planificado para esos días.
  alternarRegla: k.accion('alternarRegla', async (weekday, meal) => {
    const { e } = k.ver()
    const existe = e.reglas.some((r) => r.weekday === weekday && r.meal === meal)
    if (existe) {
      ok(await supabase.from('away_rules').delete().eq('user_id', k.uid).eq('weekday', weekday).eq('meal', meal))
      k.setE((s) => ({ ...s, reglas: s.reglas.filter((r) => !(r.weekday === weekday && r.meal === meal)) }))
    } else {
      const [g] = ok(await supabase.from('away_rules').insert({ user_id: k.uid, weekday, meal }).select())
      k.setE((s) => ({ ...s, reglas: [...s.reglas, g] }))
    }
    const h = hoy()
    const resueltasHoy = new Set(e.registros.filter((r) => r.date === h).map((r) => r.meal))
    const lugares = e.plan.filter(
      (p) =>
        p.date >= h && p.meal === meal && diaSemana(p.date) === weekday && p.away === existe && !(p.date === h && resueltasHoy.has(meal)),
    )
    return { afuera: !existe, ...(await ponerAfuera(k, lugares, !existe)) }
  }),
})

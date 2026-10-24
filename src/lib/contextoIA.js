// El resumen del día que se le pasa al asistente con IA (1.28, IA-01). Lo justo para responder bien: objetivo, lo comido,
// lo que falta, la despensa (lo que vence primero adelante) y el plan de hoy y mañana. Sin nombre, email ni usuario.
import { edad as edadDe, hoy as hoyDe, sumarDias } from './fechas'
import { COMIDAS, EXTRA, NOMBRE_COMIDA, cantidadTexto, redondear, sumar } from './nutricion'
import { diasParaVencer, vencimientoDe } from './despensa'

export const MAX_DESPENSA = 80
const nombreCorto = (n) => String(n || '').split(' (')[0]

export function armarContexto(d, ahora = new Date()) {
  const fecha = hoyDe()
  const perfil = d.perfil || {}
  const delDia = d.registros.filter((r) => r.date === fecha)
  const total = sumar(delDia)
  const kcal = Number(d.objetivoDe?.(fecha)) || Number(perfil.kcal_target) || 0
  const proteina = Number(perfil.protein_target) || 0
  const pesos = [...(d.medidas || [])].filter((m) => m.weight_kg).sort((a, b) => a.date.localeCompare(b.date))
  const peso = pesos.length ? Number(pesos[pesos.length - 1].weight_kg) : Number(perfil.weight_kg) || null
  const meta = Number(perfil.goal_weight_kg) || null

  const comidas = []
  for (const c of [...COMIDAS, EXTRA]) {
    const filas = delDia.filter((r) => r.meal === c)
    if (!filas.length) continue
    const nombre = c === EXTRA ? 'Entre comidas' : NOMBRE_COMIDA[c]
    if (filas.every((r) => r.skipped)) {
      comidas.push({ comida: nombre, items: ['(no comió)'] })
      continue
    }
    comidas.push({
      comida: nombre,
      items: filas
        .filter((r) => !r.skipped)
        .map((r) => {
          const a = r.food_id && d.alimentosPorId.get(r.food_id)
          const cuanto = a ? cantidadTexto(a, Number(r.qty)) : `${redondear(Number(r.qty), 1)} porc.`
          return `${nombreCorto(r.name)} · ${cuanto} · ${redondear(r.kcal)} kcal`
        }),
    })
  }

  const despensa = d.stock
    .filter((s) => Number(s.qty) > 0 && d.alimentosPorId.has(s.food_id))
    .map((s) => {
      const a = d.alimentosPorId.get(s.food_id)
      const dias = diasParaVencer(vencimientoDe(s), fecha)
      return { texto: `${nombreCorto(a.name)}: ${cantidadTexto(a, Number(s.qty))}${dias != null ? ` (vence en ${dias} días)` : ''}`, dias }
    })
    .sort((x, y) => (x.dias ?? 999) - (y.dias ?? 999) || x.texto.localeCompare(y.texto, 'es'))
    .slice(0, MAX_DESPENSA)
    .map((x) => x.texto)

  const plan = []
  for (const f of [fecha, sumarDias(fecha, 1)]) {
    for (const p of d.plan.filter((x) => x.date === f)) {
      const receta = p.recipe_id && d.recetasPorId.get(p.recipe_id)
      const alimento = p.food_id && d.alimentosPorId.get(p.food_id)
      const que = receta ? receta.name : alimento ? `${nombreCorto(alimento.name)} · ${cantidadTexto(alimento, Number(p.qty))}` : null
      if (que) plan.push(`${f === fecha ? 'Hoy' : 'Mañana'}, ${NOMBRE_COMIDA[p.meal]?.toLowerCase() || p.meal}: ${que}`)
    }
  }

  return {
    fecha,
    hora: `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`,
    perfil: {
      sexo: perfil.sex === 'f' ? 'mujer' : 'hombre',
      edad: perfil.birth_date ? edadDe(perfil.birth_date) : null,
      altura_cm: Number(perfil.height_cm) || null,
      peso_kg: peso,
      meta_kg: meta,
      quiere: meta && peso ? (meta < peso - 0.5 ? 'bajar de peso' : meta > peso + 0.5 ? 'subir de peso' : 'mantener') : 'sin meta de peso',
    },
    objetivo: { kcal, proteina_g: proteina },
    comido: {
      kcal: redondear(total.kcal),
      proteina_g: redondear(total.protein),
      carbohidratos_g: redondear(total.carbs),
      grasas_g: redondear(total.fat),
    },
    falta: { kcal: Math.round(kcal - total.kcal), proteina_g: Math.round(proteina - total.protein) },
    comidas,
    despensa,
    plan,
  }
}

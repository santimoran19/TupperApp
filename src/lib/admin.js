// Cuentas para el panel de administración (1.31, C-07)

// Los pedidos a la IA agrupados por día: [{ dia, total, foto, voz, texto }]
export function iaPorDia(filas = []) {
  const dias = new Map()
  for (const f of filas) {
    const d = dias.get(f.dia) || { dia: f.dia, total: 0 }
    d[f.tipo] = (d[f.tipo] || 0) + f.pedidos
    d.total += f.pedidos
    dias.set(f.dia, d)
  }
  return [...dias.values()].sort((a, b) => (a.dia < b.dia ? 1 : -1))
}

// Cómo anda el reloj de los recordatorios (T-13): { nivel: 'bien' | 'mal' | 'sin', texto }. `reloj` viene de la base
// (estado_del_reloj): null si no hay pg_cron. Se considera parado si la última corrida tiene más de 40 minutos.
export function estadoReloj(reloj, ahora = Date.now()) {
  if (!reloj) return { nivel: 'sin', texto: 'La base no tiene el reloj (pg_cron): los recordatorios con la app cerrada no salen.' }
  if (!reloj.armado) return { nivel: 'mal', texto: 'El reloj de los recordatorios no está armado o está apagado.' }
  const hace = reloj.ultima ? Math.round((ahora - Date.parse(reloj.ultima)) / 60000) : null
  if (hace === null || hace > 40)
    return { nivel: 'mal', texto: `El reloj no corre desde hace ${hace === null ? 'mucho' : `${hace} minutos`}.` }
  const problemas = []
  if (reloj.fallidas > 0) problemas.push(`${reloj.fallidas} ${reloj.fallidas === 1 ? 'corrida falló' : 'corridas fallaron'}`)
  if (reloj.con_error > 0)
    problemas.push(
      `la función contestó con error ${reloj.con_error} ${reloj.con_error === 1 ? 'vez' : 'veces'}${reloj.ultimo_error ? ` (${reloj.ultimo_error})` : ''}`,
    )
  if (problemas.length) return { nivel: 'mal', texto: `En las últimas 24 horas: ${problemas.join(' y ')}.` }
  return { nivel: 'bien', texto: `Anda bien: ${reloj.corridas} corridas en 24 horas, la última hace ${hace} min.` }
}

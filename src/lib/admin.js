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

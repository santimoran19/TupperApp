// De qué está hecha una receta, para el plato 3D (1.24): los gramos de cada categoría de alimento, con un color de comida
// (no los de la marca: tienen que parecer comida). Función pura.
export const COLOR_COMIDA = {
  Verduras: '#6f9f4f',
  Frutas: '#e7a33e',
  'Carnes y huevos': '#b7653a',
  Pescados: '#e9a98a',
  Lácteos: '#f1e6cc',
  'Pastas y arroz': '#efd28c',
  Legumbres: '#a8723f',
  Panadería: '#d49a5f',
  Cereales: '#dfbd76',
  Enlatados: '#c8573f',
  'Salsas y aderezos': '#c0392b',
  Despensa: '#d6c49a',
  'Snacks y dulces': '#8a5a33',
  Congelados: '#9fc6d9',
  'Comidas hechas': '#c48a4e',
  Otros: '#bdb5a1',
}

// Gramos de un ingrediente: los que se miden en unidades usan su peso por unidad (o 100 g si no se sabe)
const gramosDe = (a, qty) => (a.unit === 'u' ? (Number(a.unit_grams) || 100) * qty : qty)

// [{ nombre, gramos, color }], de más a menos; lo que pesa menos del 6 % se junta en "Otros". Sin bebidas ni aceite
// (casi no se ven en el plato).
export function partesDeReceta(items, alimentosPorId) {
  const por = new Map()
  for (const it of items || []) {
    const a = alimentosPorId.get(it.food_id)
    if (!a || a.category === 'Bebidas' || /aceite/i.test(a.name)) continue
    const g = gramosDe(a, Number(it.qty) || 0)
    if (!(g > 0)) continue
    por.set(a.category, (por.get(a.category) || 0) + g)
  }
  const total = [...por.values()].reduce((s, g) => s + g, 0)
  if (!(total > 0)) return []
  const lista = []
  let otros = 0
  for (const [c, g] of [...por].sort((x, y) => y[1] - x[1])) {
    if (g / total < 0.06 || !COLOR_COMIDA[c]) otros += g
    else lista.push({ nombre: c, gramos: Math.round(g), color: COLOR_COMIDA[c] })
  }
  if (otros > 0) lista.push({ nombre: 'Otros', gramos: Math.round(otros), color: COLOR_COMIDA.Otros })
  return lista
}

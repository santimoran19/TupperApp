// Cómo se ve en la app un producto que viene de afuera. Los de Open Food Facts los arma `aAlimento` (openfoodfacts.js);
// acá, los del catálogo compartido. Los dos tienen la misma forma, así la pantalla los trata igual.

// Una fila del catálogo -> el formato de los productos de Open Food Facts (ver aAlimento en openfoodfacts.js)
export function deCatalogo(f) {
  return {
    codigo: f.codigo || f.clave,
    name: String(f.name),
    detalle: f.detalle || '',
    unit: f.unit === 'ml' ? 'ml' : 'g',
    category: f.category,
    kcal: Math.round(Number(f.kcal)),
    protein: Math.round(Number(f.protein) * 10) / 10,
    carbs: Math.round(Number(f.carbs) * 10) / 10,
    fat: Math.round(Number(f.fat) * 10) / 10,
    alcohol: !!f.alcohol,
    argentino: false,
    deCatalogo: true,
  }
}

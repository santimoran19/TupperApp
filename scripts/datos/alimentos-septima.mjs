// Séptima tanda de alimentos (versión 1.32, F-12b): los genéricos que la gente tuvo que cargar a mano porque no estaban
// (mirando los alimentos propios de las cuentas, sin nombres de marca). Mismo formato que alimentos-sexta.mjs:
//   [slug, nombre, unidad, gramos por unidad, etiqueta, kcal, prot, carbs, grasa, categoria]  (valores cada 100 g o 100 ml)
// Valores típicos de las tablas de composición (USDA FoodData Central y ARGENFOODS/INTA) o, en los platos, estimados a
// partir de sus ingredientes; redondeados. Se suben a la base con supabase/seed-9-alimentos.sql.
export const alimentosSeptima = [
  ['torreja-verduras', 'Torreja de verduras (frita)', 'u', 80, 'unidad', 195, 6, 18, 11, 'Comidas hechas'],
  ['torreja-arroz', 'Torreja de arroz con verduras (frita)', 'u', 80, 'unidad', 200, 5.5, 22, 10, 'Comidas hechas'],
  ['empanada-arabe', 'Empanada árabe (de carne)', 'u', 90, 'unidad', 230, 10, 26, 9.5, 'Comidas hechas'],
  ['sandwich-pata', 'Sándwich de pata de cerdo', 'u', 220, 'unidad', 245, 13, 24, 11, 'Comidas hechas'],
  ['pizzeta', 'Pizzeta (prepizza individual)', 'u', 120, 'unidad', 260, 8, 48, 4, 'Panadería'],
  ['pata-cerdo', 'Pata de cerdo al horno (feteada)', 'g', null, null, 250, 24, 0, 17, 'Carnes y huevos'],
  ['zapallo-hervido', 'Zapallo anco hervido', 'g', null, null, 40, 0.9, 10, 0.1, 'Verduras'],
  ['te-infusion', 'Té o infusión (sin azúcar)', 'ml', null, null, 1, 0, 0.2, 0, 'Bebidas'],
  ['yogur-cereales', 'Yogur con cereales (pote)', 'g', null, null, 120, 3.5, 19, 3, 'Lácteos'],
  ['agridulces', 'Galletitas agridulces', 'g', null, null, 470, 7, 64, 20.5, 'Panadería'],
]

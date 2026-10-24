-- Séptima tanda de la base (1.32): alimentos que la gente tuvo que cargar a mano. Generado con scripts/gen-seed.mjs. Se puede correr de nuevo: agrega solo lo que falta.

insert into public.foods (slug, name, unit, unit_grams, unit_label, kcal, protein, carbs, fat, category, alcohol) values
  ('torreja-verduras', 'Torreja de verduras (frita)', 'u', 80, 'unidad', 195, 6, 18, 11, 'Comidas hechas', false),
  ('torreja-arroz', 'Torreja de arroz con verduras (frita)', 'u', 80, 'unidad', 200, 5.5, 22, 10, 'Comidas hechas', false),
  ('empanada-arabe', 'Empanada árabe (de carne)', 'u', 90, 'unidad', 230, 10, 26, 9.5, 'Comidas hechas', false),
  ('sandwich-pata', 'Sándwich de pata de cerdo', 'u', 220, 'unidad', 245, 13, 24, 11, 'Comidas hechas', false),
  ('pizzeta', 'Pizzeta (prepizza individual)', 'u', 120, 'unidad', 260, 8, 48, 4, 'Panadería', false),
  ('pata-cerdo', 'Pata de cerdo al horno (feteada)', 'g', null, null, 250, 24, 0, 17, 'Carnes y huevos', false),
  ('zapallo-hervido', 'Zapallo anco hervido', 'g', null, null, 40, 0.9, 10, 0.1, 'Verduras', false),
  ('te-infusion', 'Té o infusión (sin azúcar)', 'ml', null, null, 1, 0, 0.2, 0, 'Bebidas', false),
  ('yogur-cereales', 'Yogur con cereales (pote)', 'g', null, null, 120, 3.5, 19, 3, 'Lácteos', false),
  ('agridulces', 'Galletitas agridulces', 'g', null, null, 470, 7, 64, 20.5, 'Panadería', false)
on conflict (slug) do nothing;

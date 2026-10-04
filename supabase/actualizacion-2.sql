-- Tupper, actualización 2: validaciones en la base, "no comí" y un quinto momento para bebidas y extras.
-- Ya está aplicada en el proyecto de Supabase. Queda acá para poder recrear la base desde cero:
-- el orden es schema.sql, actualizacion-2.sql y seed.sql.

-- Si había perfiles con datos imposibles, se limpian para poder poner las restricciones.
update public.profiles set birth_date = null where birth_date < date '1900-01-01' or birth_date > current_date;
update public.profiles set height_cm = null where height_cm is not null and (height_cm < 80 or height_cm > 250);
update public.profiles set weight_kg = null where weight_kg is not null and (weight_kg < 25 or weight_kg > 350);
update public.profiles set goal_weight_kg = null where goal_weight_kg is not null and (goal_weight_kg < 25 or goal_weight_kg > 350);
update public.profiles set kcal_target = 2000 where kcal_target < 1000 or kcal_target > 6000;
update public.profiles set protein_target = 120 where protein_target < 20 or protein_target > 400;

alter table public.profiles
  add constraint profiles_nombre_chk check (char_length(name) <= 60),
  add constraint profiles_nacimiento_chk check (birth_date is null or birth_date between date '1900-01-01' and date '2100-01-01'),
  add constraint profiles_altura_chk check (height_cm is null or height_cm between 80 and 250),
  add constraint profiles_peso_chk check (weight_kg is null or weight_kg between 25 and 350),
  add constraint profiles_peso_meta_chk check (goal_weight_kg is null or goal_weight_kg between 25 and 350),
  add constraint profiles_actividad_chk check (activity between 1 and 2.5),
  add constraint profiles_kcal_chk check (kcal_target between 1000 and 6000),
  add constraint profiles_proteina_chk check (protein_target between 20 and 400);

alter table public.foods
  add constraint foods_nombre_chk check (char_length(name) between 1 and 80),
  add constraint foods_kcal_chk check (kcal between 0 and 900),
  add constraint foods_macros_chk check (protein between 0 and 100 and carbs between 0 and 100 and fat between 0 and 100),
  add constraint foods_unidad_chk check (unit <> 'u' or (unit_grams > 0 and unit_grams <= 5000));

alter table public.stock add constraint stock_qty_chk check (qty between 0 and 1000000);
alter table public.prepared add constraint prepared_chk check (portions between 0 and 1000);

alter table public.recipes
  add constraint recipes_nombre_chk check (char_length(name) between 1 and 80),
  add constraint recipes_minutos_chk check (minutes between 0 and 1440),
  add constraint recipes_porciones_chk check (servings <= 100),
  add constraint recipes_pasos_chk check (char_length(steps) <= 5000);
alter table public.recipe_items add constraint recipe_items_qty_chk check (qty <= 100000);

alter table public.measurements
  add constraint measurements_peso_chk check (weight_kg is null or weight_kg between 25 and 350),
  add constraint measurements_cintura_chk check (waist_cm is null or waist_cm between 30 and 300),
  add constraint measurements_fecha_chk check (date between date '2000-01-01' and date '2100-01-01');

alter table public.purchases
  add constraint purchases_qty_chk check (qty > 0 and qty <= 1000000),
  add constraint purchases_precio_chk check (price >= 0 and price <= 1000000000);
alter table public.shopping_items add constraint shopping_qty_chk check (qty > 0 and qty <= 1000000);

-- Registro: comidas salteadas ("no comí") y un quinto momento para bebidas y cosas entre comidas
alter table public.log_entries add column skipped boolean not null default false;
alter table public.log_entries drop constraint log_entries_meal_check;
alter table public.log_entries
  add constraint log_entries_meal_check check (meal in ('desayuno','almuerzo','merienda','cena','extra')),
  add constraint log_entries_valores_chk check (qty >= 0 and kcal >= 0 and kcal <= 20000 and protein >= 0 and carbs >= 0 and fat >= 0);

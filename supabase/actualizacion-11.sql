-- Tupper, actualización 11: alimentos sueltos en el plan (F-15).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
--
-- Hasta ahora cada comida del plan era una receta. Ahora también puede ser un alimento con su cantidad
-- (por ejemplo, mate solo en la merienda). Cada comida sigue teniendo una sola cosa: o una receta o un alimento.
-- No toca ninguna fila que ya exista: las que tienen receta (o están vacías) quedan igual.

alter table public.plan
  add column if not exists food_id uuid references public.foods on delete cascade,
  add column if not exists qty numeric;

-- Si se borra un alimento propio, se va también de lo planificado (sin alimento, la cantidad no dice nada)
create index if not exists plan_food_idx on public.plan (food_id);

alter table public.plan drop constraint if exists plan_alimento_chk;
alter table public.plan drop constraint if exists plan_una_cosa_chk;
alter table public.plan drop constraint if exists plan_qty_chk;
alter table public.plan
  -- alimento y cantidad van juntos
  add constraint plan_alimento_chk check ((food_id is null) = (qty is null)),
  -- una comida es una receta o un alimento, no las dos
  add constraint plan_una_cosa_chk check (food_id is null or recipe_id is null),
  -- mismo tope que lo que se puede registrar en una comida (5 kg o 5 L; las unidades las limita la app a 50)
  add constraint plan_qty_chk check (qty is null or (qty > 0 and qty <= 5000));

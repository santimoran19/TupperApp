-- Tupper, actualización 5: equivalencias entre alimentos.
-- Ya está aplicada en el proyecto de Supabase. Para recrear la base desde cero el orden es:
-- schema.sql, actualizacion-2.sql, actualizacion-3.sql, actualizacion-4.sql, actualizacion-5.sql y seed.sql.

-- Un alimento propio (por ejemplo, un producto de marca traído de Open Food Facts) puede valer por un
-- alimento de las recetas: "Aceite girasol Natura" cuenta como "Aceite". Las recetas no cambian: piden
-- el alimento genérico y lo cubre cualquier producto que valga por él.
-- Es una columna nueva y opcional: no toca nada de lo que ya está cargado.
alter table public.foods add column if not exists same_as uuid references public.foods (id) on delete set null;
alter table public.foods drop constraint if exists foods_same_as_otro;
alter table public.foods add constraint foods_same_as_otro check (same_as is null or same_as <> id);
create index if not exists foods_same_as_idx on public.foods (same_as) where same_as is not null;
-- Solo el dueño puede cambiar sus alimentos (política foods_update), así que cada usuario vincula solo los suyos.

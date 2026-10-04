-- Tupper, actualización 3: objetivo de líquido, bebidas con alcohol, mate en ml,
-- recetas ocultas y favoritas, y borrado de cuenta.
-- Ya está aplicada en el proyecto de Supabase. Para recrear la base desde cero el orden es:
-- schema.sql, actualizacion-2.sql, actualizacion-3.sql y seed.sql.

-- Perfil: cuánto líquido tomar por día y de cuánto es el termo (para "medio termo", "un termo")
alter table public.profiles
  add column water_target_ml integer check (water_target_ml is null or water_target_ml between 500 and 6000),
  add column thermos_ml integer not null default 1000 check (thermos_ml between 250 and 3000);

-- Bebidas con alcohol: no cuentan para el objetivo de líquido
alter table public.foods add column alcohol boolean not null default false;
update public.foods set alcohol = true where owner is null and slug in
  ('cerveza','cerveza-negra','cerveza-ipa','vino','vino-blanco','espumante','sidra','fernet','fernet-coca',
   'bebida-blanca','gin-tonic','ron-cola','campari','aperol-spritz','vermut','trago-dulce','licor');

-- El mate se medía en tazas: pasa a mililitros (lo ya cargado se convierte a 100 ml por taza)
update public.log_entries l set qty = l.qty * 100 from public.foods f where f.id = l.food_id and f.slug = 'mate' and f.unit = 'u';
update public.stock s set qty = s.qty * 100 from public.foods f where f.id = s.food_id and f.slug = 'mate' and f.unit = 'u';
update public.shopping_items s set qty = s.qty * 100 from public.foods f where f.id = s.food_id and f.slug = 'mate' and f.unit = 'u';
update public.foods set name = 'Mate', unit = 'ml', unit_grams = null, unit_label = null where slug = 'mate';

-- Preferencias de cada usuario sobre las recetas: ocultarlas ("no me gusta") o marcarlas como favoritas
create table public.recipe_prefs (
  user_id uuid not null references auth.users on delete cascade,
  recipe_id uuid not null references public.recipes on delete cascade,
  hidden boolean not null default false,
  favorite boolean not null default false,
  primary key (user_id, recipe_id)
);
create index recipe_prefs_recipe_idx on public.recipe_prefs (recipe_id);
alter table public.recipe_prefs enable row level security;
create policy recipe_prefs_own on public.recipe_prefs for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
grant select, insert, update, delete on public.recipe_prefs to authenticated;
revoke all on public.recipe_prefs from anon;

-- Borrar la cuenta propia: al irse el usuario se van en cascada todos sus datos
create function public.borrar_mi_cuenta() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;
revoke all on function public.borrar_mi_cuenta() from public, anon;
grant execute on function public.borrar_mi_cuenta() to authenticated;

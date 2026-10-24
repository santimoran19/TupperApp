-- Tupper, actualización 23: categorías propias (versión 1.30.0).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-22.sql. La versión 1.29 de la app sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-23.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra nada de lo cargado. Agrega:
--   1. categorias: las categorías que crea cada persona ("Para el mate", "Cosas del bebé"), hasta 30 (F-13)
--   2. categoria_alimento: la categoría que eligió una persona para un alimento que no es suyo (los de la base o de
--      alguien de su hogar). Cambia solo para ella; los alimentos propios cambian de verdad (foods.category).
--   3. renombrar_categoria y borrar_categoria: se llevan con ellas los alimentos que tenían.
--   4. strava_conexiones: el permiso de Strava de quien conectó su cuenta (F-22). Solo lo lee la función `strava`.
--   5. profiles.legales_vistos: qué versión de los Términos y la Política vio cada persona, para avisarle cuando cambian (L-05).

-- =====================================================================================
-- 1. Categorías propias
-- =====================================================================================
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null check (char_length(btrim(nombre)) between 1 and 30 and nombre = btrim(nombre)),
  created_at timestamptz not null default now()
);
create unique index if not exists categorias_nombre_idx on public.categorias (user_id, lower(nombre));
alter table public.categorias enable row level security;

drop policy if exists categorias_propias on public.categorias;
create policy categorias_propias on public.categorias for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.categorias from anon, authenticated;
grant select, insert, delete on public.categorias to authenticated;

drop trigger if exists tope_de_filas on public.categorias;
create trigger tope_de_filas after insert on public.categorias referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '30', 'categorias');

-- =====================================================================================
-- 2. La categoría elegida para un alimento ajeno
-- =====================================================================================
create table if not exists public.categoria_alimento (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  food_id uuid not null references public.foods (id) on delete cascade,
  categoria text not null check (char_length(btrim(categoria)) between 1 and 40),
  primary key (user_id, food_id)
);
create index if not exists categoria_alimento_food_idx on public.categoria_alimento (food_id);
alter table public.categoria_alimento enable row level security;

drop policy if exists categoria_alimento_propia on public.categoria_alimento;
create policy categoria_alimento_propia on public.categoria_alimento for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.categoria_alimento from anon, authenticated;
grant select, insert, update, delete on public.categoria_alimento to authenticated;

drop trigger if exists tope_de_filas on public.categoria_alimento;
create trigger tope_de_filas after insert on public.categoria_alimento referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '3000', 'categoria_alimento');

-- =====================================================================================
-- 3. Renombrar y borrar (todo junto o nada)
-- =====================================================================================
create or replace function public.renombrar_categoria(p_viejo text, p_nuevo text) returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); v_nuevo text := btrim(coalesce(p_nuevo, ''));
begin
  if uid is null then raise exception 'Iniciá sesión.' using errcode = 'P0001'; end if;
  if not public.mfa_ok() then raise exception 'Falta el código de verificación.' using errcode = 'P0001'; end if;
  if char_length(v_nuevo) not between 1 and 30 then raise exception 'El nombre tiene que tener entre 1 y 30 letras.' using errcode = 'P0001'; end if;
  if not exists (select 1 from public.categorias where user_id = uid and nombre = p_viejo) then
    raise exception 'Esa categoría no existe.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.categorias where user_id = uid and lower(nombre) = lower(v_nuevo) and nombre <> p_viejo) then
    raise exception 'Ya tenés una categoría con ese nombre.' using errcode = 'P0001';
  end if;
  update public.categorias set nombre = v_nuevo where user_id = uid and nombre = p_viejo;
  update public.foods set category = v_nuevo where owner = uid and category = p_viejo;
  update public.categoria_alimento set categoria = v_nuevo where user_id = uid and categoria = p_viejo;
end $$;

create or replace function public.borrar_categoria(p_nombre text, p_destino text default 'Otros') returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); v_destino text := coalesce(nullif(btrim(p_destino), ''), 'Otros');
begin
  if uid is null then raise exception 'Iniciá sesión.' using errcode = 'P0001'; end if;
  if not public.mfa_ok() then raise exception 'Falta el código de verificación.' using errcode = 'P0001'; end if;
  if char_length(v_destino) > 40 then raise exception 'La categoría no es válida.' using errcode = 'P0001'; end if;
  update public.foods set category = v_destino where owner = uid and category = p_nombre;
  -- Los ajenos vuelven a su categoría de siempre
  delete from public.categoria_alimento where user_id = uid and categoria = p_nombre;
  delete from public.categorias where user_id = uid and nombre = p_nombre;
end $$;

revoke all on function public.renombrar_categoria(text, text) from public, anon;
grant execute on function public.renombrar_categoria(text, text) to authenticated;
revoke all on function public.borrar_categoria(text, text) from public, anon;
grant execute on function public.borrar_categoria(text, text) to authenticated;

-- =====================================================================================
-- 4. Conexión con Strava. La app no la puede leer ni escribir (ni siquiera la propia): los permisos de Strava no salen de
-- la función. Se borra sola con la cuenta.
-- =====================================================================================
create table if not exists public.strava_conexiones (
  user_id uuid primary key references auth.users (id) on delete cascade,
  atleta_id bigint,
  atleta text check (atleta is null or char_length(atleta) <= 40),
  access_token text not null,
  refresh_token text not null,
  expira_en timestamptz not null,
  alcance text check (alcance is null or char_length(alcance) <= 200),
  created_at timestamptz not null default now()
);
alter table public.strava_conexiones enable row level security;
revoke all on public.strava_conexiones from anon, authenticated;

-- =====================================================================================
-- 5. Qué versión de los textos legales vio cada persona (la app muestra una vez qué cambió)
-- =====================================================================================
alter table public.profiles add column if not exists legales_vistos text;
alter table public.profiles drop constraint if exists profiles_legales_vistos_chk;
alter table public.profiles add constraint profiles_legales_vistos_chk check (legales_vistos is null or char_length(legales_vistos) <= 20);

-- =====================================================================================
-- La verificación en dos pasos (actualizacion-22.sql) también en las tablas nuevas
-- =====================================================================================
drop policy if exists dos_pasos on public.categorias;
create policy dos_pasos on public.categorias as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));
drop policy if exists dos_pasos on public.strava_conexiones;
create policy dos_pasos on public.strava_conexiones as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));
drop policy if exists dos_pasos on public.categoria_alimento;
create policy dos_pasos on public.categoria_alimento as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));

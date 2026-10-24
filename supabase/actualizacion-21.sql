-- Tupper, actualización 21: combos, consentimiento de datos de salud, opiniones y el chat con IA (versión 1.28.0).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-20.sql. La versión 1.27 de la app sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-21.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra nada de lo cargado. Agrega:
--   1. combos: "mi desayuno de siempre", varios alimentos o recetas que se anotan juntos (F-09)
--   2. profiles.salud_consentida_at: cuándo la persona aceptó, con una casilla, que la app use sus datos de salud (L-04)
--   3. opiniones: lo que escribe la persona en "Contanos qué te falta" (C-05)
--   4. ai_usos acepta también 'chat', para contar los mensajes al asistente (IA-01)

-- =====================================================================================
-- 1. Combos
-- `items`: [{ "food_id": "...", "qty": 250 }, { "recipe_id": "...", "porciones": 1 }]. Lo valida la app; acá solo se ponen topes.
-- =====================================================================================
create table if not exists public.combos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 15),
  created_at timestamptz not null default now(),
  constraint combos_peso_fila_chk check (pg_column_size(combos.*) <= 3000)
);
create index if not exists combos_user_idx on public.combos (user_id, created_at);
alter table public.combos enable row level security;

drop policy if exists combos_propios on public.combos;
create policy combos_propios on public.combos for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke all on public.combos from anon;
grant select, insert, update, delete on public.combos to authenticated;

-- Hasta 30 combos por persona (usa el mismo tope que las otras tablas: actualizacion-8.sql)
drop trigger if exists tope_de_filas on public.combos;
create trigger tope_de_filas after insert on public.combos referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '30', 'combos');

-- =====================================================================================
-- 2. Consentimiento de los datos de salud (Ley 25.326, art. 7: los datos de salud son sensibles y piden consentimiento
-- expreso). La app lo pide con una casilla al crear el perfil; a quien ya tenía cuenta se lo pide una vez al entrar.
-- =====================================================================================
alter table public.profiles add column if not exists salud_consentida_at timestamptz;

-- =====================================================================================
-- 3. Opiniones
-- Solo se puede escribir (y ver lo propio). Las leés vos desde el panel de Supabase (Table Editor > opiniones).
-- =====================================================================================
create table if not exists public.opiniones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tipo text not null default 'idea' check (tipo in ('idea', 'problema', 'otra')),
  texto text not null check (char_length(texto) between 3 and 2000),
  version text check (version is null or char_length(version) <= 20),
  pantalla text check (pantalla is null or char_length(pantalla) <= 60),
  created_at timestamptz not null default now()
);
create index if not exists opiniones_user_idx on public.opiniones (user_id, created_at);
alter table public.opiniones enable row level security;

drop policy if exists opiniones_leer on public.opiniones;
create policy opiniones_leer on public.opiniones for select to authenticated using (user_id = auth.uid());
drop policy if exists opiniones_escribir on public.opiniones;
create policy opiniones_escribir on public.opiniones for insert to authenticated with check (user_id = auth.uid());
revoke all on public.opiniones from anon;
grant select, insert on public.opiniones to authenticated;

-- Hasta 10 por día por persona, para que nadie llene la tabla
create or replace function public.opiniones_antes() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.user_id is distinct from (select auth.uid()) then return new; end if;
  new.created_at := now();
  if (
    select count(*) from public.opiniones o where o.user_id = new.user_id and o.created_at > now() - interval '1 day'
  ) >= 10 then
    raise exception 'Ya mandaste muchas opiniones hoy. Gracias: probá de nuevo mañana.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke all on function public.opiniones_antes() from public, anon, authenticated;
drop trigger if exists opiniones_antes on public.opiniones;
create trigger opiniones_antes before insert on public.opiniones
  for each row execute function public.opiniones_antes();

-- =====================================================================================
-- 4. El chat con IA cuenta sus mensajes en ai_usos (la tabla de la actualización 20)
-- =====================================================================================
alter table public.ai_usos drop constraint if exists ai_usos_kind_check;
alter table public.ai_usos add constraint ai_usos_kind_check check (kind in ('foto', 'voz', 'texto', 'chat'));

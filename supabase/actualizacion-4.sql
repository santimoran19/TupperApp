-- Tupper, actualización 4: devoluciones semanales hechas con IA.
-- Ya está aplicada en el proyecto de Supabase. Para recrear la base desde cero el orden es:
-- schema.sql, actualizacion-2.sql, actualizacion-3.sql, actualizacion-4.sql y seed.sql.

-- Cada análisis queda guardado: así no hay que pagarlo de nuevo para volver a leerlo
-- y sirve para contar cuántos pidió cada usuario en el día (el tope lo aplica la función).
create table public.ai_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  week_start date not null,
  content jsonb not null check (pg_column_size(content) < 20000),
  model text,
  created_at timestamptz not null default now()
);
create index ai_analyses_user_idx on public.ai_analyses (user_id, created_at);

alter table public.ai_analyses enable row level security;
-- Se pueden leer y agregar los propios, pero no modificarlos ni borrarlos: si se pudieran borrar, el tope diario no serviría.
create policy ai_analyses_read on public.ai_analyses for select to authenticated
  using (user_id = (select auth.uid()));
create policy ai_analyses_insert on public.ai_analyses for insert to authenticated
  with check (user_id = (select auth.uid()));
revoke all on public.ai_analyses from anon, authenticated;
grant select, insert on public.ai_analyses to authenticated;

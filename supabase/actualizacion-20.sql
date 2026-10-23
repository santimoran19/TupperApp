-- Tupper, actualización 20: tope diario de la carga con IA por foto, voz o texto (versión 1.27.0).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-19.sql. La versión 1.26 de la app sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-20.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra nada de lo cargado: agrega una tabla nueva con solo dos datos por fila (quién y cuándo, más si fue
-- foto, voz o texto). No guarda la foto, el audio ni lo que se dijo: sirve únicamente para contar cuántas veces pidió cada cuenta
-- en las últimas 24 horas, así el cupo gratis de la IA no se lo come una sola persona.

create table if not exists public.ai_usos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('foto', 'voz', 'texto')),
  created_at timestamptz not null default now()
);
create index if not exists ai_usos_user_idx on public.ai_usos (user_id, created_at);

alter table public.ai_usos enable row level security;

drop policy if exists ai_usos_read on public.ai_usos;
create policy ai_usos_read on public.ai_usos for select to authenticated using (user_id = auth.uid());
drop policy if exists ai_usos_insert on public.ai_usos;
create policy ai_usos_insert on public.ai_usos for insert to authenticated with check (user_id = auth.uid());
-- Cada cuenta puede borrar solo sus filas de más de 2 días (la función lo hace sola para no acumular)
drop policy if exists ai_usos_delete on public.ai_usos;
create policy ai_usos_delete on public.ai_usos for delete to authenticated
  using (user_id = auth.uid() and created_at < now() - interval '2 days');

revoke all on public.ai_usos from anon;
grant select, insert, delete on public.ai_usos to authenticated;

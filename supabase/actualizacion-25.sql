-- Tupper, actualización 25: códigos de recuperación de la verificación en dos pasos, notificaciones con botones
-- ("En 15 min", "Tomé un vaso"), cómo anda el reloj de los recordatorios y la vuelta semanal en el panel de
-- administración (versión 1.32.0).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-24.sql. La versión 1.31 de la app sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-25.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra nada de lo cargado. Agrega:
--   1. codigos_recuperacion (S-08): los códigos para entrar si se pierde el teléfono con la app autenticadora. Se guarda
--      solo su huella (no se pueden leer), y solo los usa la función `dos-pasos`. codigos_que_quedan() le dice a la app
--      cuántos quedan sin usar.
--   2. recordatorios_pospuestos y recordatorios_acciones (F-06b): los avisos que alguien pidió "En 15 min" y los botones ya
--      tocados (para no anotar dos veces el mismo vaso). anotar_vaso(): el vaso de agua que se anota desde la notificación.
--      Solo los usa la función `recordatorios-push`.
--   3. admin_resumen() suma la vuelta semanal (C-06) y cómo anda el reloj de los recordatorios (T-13).
--   4. hogar_intentos tiene identificador (lo pedía el revisor de Supabase, T-09).

-- =====================================================================================
-- 1. Códigos de recuperación (S-08)
-- =====================================================================================
create table if not exists public.codigos_recuperacion (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  huella text not null check (char_length(huella) = 64), -- sha-256 en hexadecimal; el código no se guarda
  usado_en timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists codigos_recuperacion_user_idx on public.codigos_recuperacion (user_id);
alter table public.codigos_recuperacion enable row level security;
revoke all on public.codigos_recuperacion from anon, authenticated;
drop policy if exists dos_pasos on public.codigos_recuperacion;
create policy dos_pasos on public.codigos_recuperacion as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));

-- Los intentos de usar un código (para cortar a quien prueba muchos)
create table if not exists public.recuperacion_intentos (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists recuperacion_intentos_user_idx on public.recuperacion_intentos (user_id, created_at);
alter table public.recuperacion_intentos enable row level security;
revoke all on public.recuperacion_intentos from anon, authenticated;
drop policy if exists dos_pasos on public.recuperacion_intentos;
create policy dos_pasos on public.recuperacion_intentos as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));

-- Cuántos códigos sin usar le quedan a quien pregunta (para el Perfil)
create or replace function public.codigos_que_quedan() returns int
language sql stable security definer set search_path = '' as $$
  select count(*)::int from public.codigos_recuperacion c where c.user_id = (select auth.uid()) and c.usado_en is null
$$;
revoke all on function public.codigos_que_quedan() from public, anon;
grant execute on function public.codigos_que_quedan() to authenticated;

-- =====================================================================================
-- 2. Notificaciones con botones (F-06b)
-- =====================================================================================
create table if not exists public.recordatorios_pospuestos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  aviso text not null check (char_length(aviso) between 1 and 60),
  titulo text not null check (char_length(titulo) between 1 and 80),
  texto text not null default '' check (char_length(texto) <= 200),
  ruta text not null default '/' check (char_length(ruta) <= 120),
  cuando timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists recordatorios_pospuestos_cuando_idx on public.recordatorios_pospuestos (cuando);
create index if not exists recordatorios_pospuestos_user_idx on public.recordatorios_pospuestos (user_id);
alter table public.recordatorios_pospuestos enable row level security;
revoke all on public.recordatorios_pospuestos from anon, authenticated;
drop policy if exists dos_pasos on public.recordatorios_pospuestos;
create policy dos_pasos on public.recordatorios_pospuestos as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));

-- Cada botón de cada aviso se atiende una sola vez (tocarlo dos veces no anota dos vasos)
create table if not exists public.recordatorios_acciones (
  user_id uuid not null references auth.users (id) on delete cascade,
  fecha date not null,
  aviso text not null check (char_length(aviso) between 1 and 60),
  accion text not null check (accion in ('posponer', 'vaso')),
  created_at timestamptz not null default now(),
  primary key (user_id, fecha, aviso, accion)
);
alter table public.recordatorios_acciones enable row level security;
revoke all on public.recordatorios_acciones from anon, authenticated;
drop policy if exists dos_pasos on public.recordatorios_acciones;
create policy dos_pasos on public.recordatorios_acciones as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));

-- El vaso de agua de "Tomé un vaso": lo mismo que el botón del Diario (250 ml de agua, en "extra", sin tocar la despensa)
create or replace function public.anotar_vaso(p_usuario uuid, p_fecha date) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  insert into public.log_entries (user_id, date, meal, name, food_id, qty, kcal, protein, carbs, fat)
  select p_usuario, p_fecha, 'extra', f.name, f.id, 250, 0, 0, 0, 0
  from public.foods f where f.slug = 'agua' and f.owner is null
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.anotar_vaso(uuid, date) from public, anon, authenticated;
grant execute on function public.anotar_vaso(uuid, date) to service_role;

-- =====================================================================================
-- 3. Panel de administración: vuelta semanal (C-06) y el reloj de los recordatorios (T-13)
-- =====================================================================================
-- Cómo anduvo el reloj en las últimas 24 horas: si está armado, cuándo corrió por última vez, cuántas corridas fallaron y
-- cuántas veces la función contestó con error (pg_net guarda las respuestas unas horas). Sin pg_cron, null.
create or replace function public.estado_del_reloj() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  r jsonb;
  red jsonb := '{}'::jsonb;
begin
  if to_regclass('cron.job_run_details') is null then return null; end if;
  execute $q$
    select jsonb_build_object(
      'armado', exists (select 1 from cron.job where jobname = 'recordatorios-push' and active),
      'ultima', (select max(d.start_time) from cron.job_run_details d join cron.job j on j.jobid = d.jobid where j.jobname = 'recordatorios-push'),
      'corridas', (select count(*) from cron.job_run_details d join cron.job j on j.jobid = d.jobid
                   where j.jobname = 'recordatorios-push' and d.start_time > now() - interval '24 hours'),
      'fallidas', (select count(*) from cron.job_run_details d join cron.job j on j.jobid = d.jobid
                   where j.jobname = 'recordatorios-push' and d.start_time > now() - interval '24 hours' and d.status <> 'succeeded')
    )
  $q$ into r;
  if to_regclass('net._http_response') is not null then
    execute $q$
      select jsonb_build_object(
        'respuestas', count(*),
        'con_error', count(*) filter (where status_code is null or status_code >= 400),
        'ultimo_error', (select left(coalesce(x.error_msg, x.status_code::text || ' ' || coalesce(x.content, '')), 160)
                         from net._http_response x
                         where x.created > now() - interval '24 hours' and (x.status_code is null or x.status_code >= 400)
                         order by x.created desc limit 1)
      )
      from net._http_response where created > now() - interval '24 hours'
    $q$ into red;
  end if;
  return r || red;
end $$;
revoke all on function public.estado_del_reloj() from public, anon, authenticated;

-- La vuelta semanal: de las últimas 8 semanas (lunes a domingo, hora de Argentina), cuántas cuentas anotaron algo, cuántas
-- de esas también habían anotado la semana anterior (volvieron) y cuántas cuentas se crearon.
create or replace function public.vuelta_semanal() returns jsonb
language sql stable security definer set search_path = '' as $$
  with semanas as (
    select generate_series(
      date_trunc('week', (now() at time zone 'America/Argentina/Buenos_Aires')) - interval '7 weeks',
      date_trunc('week', (now() at time zone 'America/Argentina/Buenos_Aires')),
      interval '1 week'
    )::date as semana
  ),
  activos as (
    select distinct l.user_id, date_trunc('week', l.created_at at time zone 'America/Argentina/Buenos_Aires')::date as semana
    from public.log_entries l
    where l.created_at > now() - interval '9 weeks'
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'semana', s.semana,
    'activas', (select count(*) from activos a where a.semana = s.semana),
    'volvieron', (select count(*) from activos a where a.semana = s.semana
                  and exists (select 1 from activos b where b.user_id = a.user_id and b.semana = s.semana - 7)),
    'nuevas', (select count(*) from public.profiles p
               where date_trunc('week', p.created_at at time zone 'America/Argentina/Buenos_Aires')::date = s.semana)
  ) order by s.semana desc), '[]'::jsonb)
  from semanas s
$$;
revoke all on function public.vuelta_semanal() from public, anon, authenticated;

-- El resumen del panel, ahora con la vuelta semanal y el reloj. Lo demás queda igual que en la actualización 24.
create or replace function public.admin_resumen() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare r jsonb;
begin
  if not public.es_admin() then raise exception 'Solo para administradores.' using errcode = '42501'; end if;
  select jsonb_build_object(
    'cuentas', (select count(*) from public.profiles),
    'nuevas_7', (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'nuevas_30', (select count(*) from public.profiles where created_at > now() - interval '30 days'),
    'activas_1', (select count(distinct user_id) from public.log_entries where created_at > now() - interval '1 day'),
    'activas_7', (select count(distinct user_id) from public.log_entries where created_at > now() - interval '7 days'),
    'activas_30', (select count(distinct user_id) from public.log_entries where created_at > now() - interval '30 days'),
    'registros_7', (select count(*) from public.log_entries where created_at > now() - interval '7 days'),
    'hogares', (select count(*) from public.hogares),
    'semanas', public.vuelta_semanal(),
    'reloj', public.estado_del_reloj(),
    'ia_por_dia', coalesce((
      select jsonb_agg(jsonb_build_object('dia', dia, 'tipo', kind, 'pedidos', n) order by dia desc, kind)
      from (
        select (created_at at time zone 'America/Argentina/Buenos_Aires')::date as dia, kind, count(*) as n
        from public.ai_usos where created_at > now() - interval '14 days' group by 1, 2
      ) x
    ), '[]'::jsonb),
    'errores_7', coalesce((
      select jsonb_agg(jsonb_build_object('nombre', nombre, 'veces', n, 'version', version) order by n desc)
      from (
        select nombre, max(version) as version, count(*) as n from public.eventos
        where tipo = 'error' and created_at > now() - interval '7 days' group by nombre order by count(*) desc limit 20
      ) x
    ), '[]'::jsonb),
    'opiniones', coalesce((
      select jsonb_agg(jsonb_build_object('fecha', created_at, 'tipo', tipo, 'texto', texto, 'version', version, 'pantalla', pantalla) order by created_at desc)
      from (select * from public.opiniones order by created_at desc limit 50) x
    ), '[]'::jsonb)
  ) into r;
  return r;
end $$;
revoke all on function public.admin_resumen() from public, anon;
grant execute on function public.admin_resumen() to authenticated;

-- =====================================================================================
-- 4. hogar_intentos con identificador (T-09)
-- =====================================================================================
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'hogar_intentos' and column_name = 'id') then
    alter table public.hogar_intentos add column id bigint generated always as identity primary key;
  end if;
end $$;

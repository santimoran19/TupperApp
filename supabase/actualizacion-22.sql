-- Tupper, actualización 22: verificación en dos pasos y recordatorios con la app cerrada (versión 1.29.0).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-21.sql. La versión 1.28 de la app sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-22.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra nada de lo cargado. Agrega:
--   1. push_suscripciones: los teléfonos que aceptaron recibir avisos con la app cerrada (F-06)
--   2. recordatorios: la configuración de los avisos de cada persona, copia de la que está en el teléfono (F-06)
--   3. recordatorios_enviados: qué avisos ya se mandaron (para no repetirlos). Solo la usa la función.
--   4. La verificación en dos pasos (S-06): quien la activó no puede leer ni cambiar sus datos con una sesión de solo
--      contraseña; hace falta haber puesto el código. Quien no la activó no nota nada.
--   5. Lo que marcó el revisor de Supabase (Advisors): reglas de ai_usos, combos y opiniones que calculaban el usuario fila
--      por fila (ahora una vez por consulta; hacen exactamente lo mismo) y un índice que faltaba en purchases.
-- El reloj que llama a la función cada 15 minutos (pg_cron) NO está acá: lleva una clave secreta y se arma aparte
-- (ver supabase/functions/LEEME.md, "recordatorios-push").

-- =====================================================================================
-- 1. Suscripciones a las notificaciones push
-- `endpoint` es la dirección del servicio de push de ese navegador (Google, Apple, Mozilla); `p256dh` y `auth`, las
-- claves con las que se cifra lo que se le manda. Un mismo navegador es de una sola cuenta: si entra otra, se pasa.
-- =====================================================================================
create table if not exists public.push_suscripciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  endpoint text not null unique check (endpoint ~ '^https://' and char_length(endpoint) <= 1000),
  p256dh text not null check (char_length(p256dh) between 80 and 100),
  auth text not null check (char_length(auth) between 16 and 30),
  created_at timestamptz not null default now()
);
create index if not exists push_suscripciones_user_idx on public.push_suscripciones (user_id);
alter table public.push_suscripciones enable row level security;

drop policy if exists push_propias on public.push_suscripciones;
create policy push_propias on public.push_suscripciones for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.push_suscripciones from anon, authenticated;
grant select, delete on public.push_suscripciones to authenticated;

-- Hasta 10 teléfonos o navegadores por persona
drop trigger if exists tope_de_filas on public.push_suscripciones;
create trigger tope_de_filas after insert on public.push_suscripciones referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '10', 'push_suscripciones');

-- Guardar la suscripción de este navegador. Si era de otra cuenta (se cerró sesión y entró otra persona), pasa a esta.
create or replace function public.guardar_suscripcion(p_endpoint text, p_p256dh text, p_auth text) returns void
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Iniciá sesión.' using errcode = 'P0001'; end if;
  if not public.mfa_ok() then raise exception 'Falta el código de verificación.' using errcode = 'P0001'; end if;
  delete from public.push_suscripciones where endpoint = p_endpoint and user_id <> uid;
  insert into public.push_suscripciones (user_id, endpoint, p256dh, auth) values (uid, p_endpoint, p_p256dh, p_auth)
  on conflict (endpoint) do update set p256dh = excluded.p256dh, auth = excluded.auth;
end $$;

-- =====================================================================================
-- 2. Configuración de los recordatorios (una fila por persona)
-- `config` tiene la misma forma que en la app (src/lib/ayuno.js, RECORDATORIOS_INICIAL). `zona`: la zona horaria del
-- teléfono (America/Argentina/Buenos_Aires...). El ayuno en curso va aparte, para avisar cuando se cumple.
-- No lleva datos de salud: horarios de comidas y si avisa del agua.
-- =====================================================================================
create table if not exists public.recordatorios (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  activo boolean not null default false,
  config jsonb not null default '{}' check (jsonb_typeof(config) = 'object' and pg_column_size(config) <= 2000),
  zona text not null default 'America/Argentina/Buenos_Aires' check (char_length(zona) between 1 and 64),
  ayuno_inicio bigint,
  ayuno_horas int check (ayuno_horas is null or ayuno_horas between 1 and 72),
  updated_at timestamptz not null default now()
);
alter table public.recordatorios enable row level security;

drop policy if exists recordatorios_propios on public.recordatorios;
create policy recordatorios_propios on public.recordatorios for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.recordatorios from anon, authenticated;
grant select, insert, update, delete on public.recordatorios to authenticated;

-- =====================================================================================
-- 3. Avisos ya mandados. Sin permisos para la app: la escribe y la lee solo la función (con la clave de servicio).
-- =====================================================================================
create table if not exists public.recordatorios_enviados (
  user_id uuid not null references auth.users (id) on delete cascade,
  fecha date not null,
  aviso text not null check (char_length(aviso) <= 60),
  primary key (user_id, fecha, aviso)
);
alter table public.recordatorios_enviados enable row level security;
revoke all on public.recordatorios_enviados from anon, authenticated;

-- =====================================================================================
-- 4. Verificación en dos pasos
-- Supabase Auth ya maneja los códigos (TOTP). Acá se agrega que la base los exija: a cada tabla con seguridad por filas
-- se le suma una regla "restrictiva" (se tiene que cumplir además de las otras): o la sesión es con el código (aal2), o
-- la persona no tiene la verificación activada. Las tablas que se creen después tienen que sumarla también (ver abajo).
-- =====================================================================================
create or replace function public.mfa_ok() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
    or not exists (
      select 1 from auth.mfa_factors f where f.user_id = (select auth.uid()) and f.status = 'verified'
    )
$$;
revoke all on function public.mfa_ok() from public, anon;
grant execute on function public.mfa_ok() to authenticated;
revoke all on function public.guardar_suscripcion(text, text, text) from public, anon;
grant execute on function public.guardar_suscripcion(text, text, text) to authenticated;

do $$
declare t record;
begin
  for t in
    select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
  loop
    execute format('drop policy if exists dos_pasos on public.%I', t.relname);
    execute format(
      'create policy dos_pasos on public.%I as restrictive for all to authenticated using ((select public.mfa_ok())) with check ((select public.mfa_ok()))',
      t.relname
    );
  end loop;
end $$;

-- Ojo: las funciones "security definer" (las que llama la app con rpc, como las de los hogares) saltean estas reglas.
-- Leer los datos de la cuenta pasa por las tablas, así que quedan protegidos; que esas funciones también pidan el
-- código queda anotado como pendiente (S-07).

-- =====================================================================================
-- 5. Lo que marcó el revisor de Supabase (Database → Advisors). Las reglas quedan iguales, con `(select auth.uid())`.
-- =====================================================================================
drop policy if exists ai_usos_read on public.ai_usos;
create policy ai_usos_read on public.ai_usos for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists ai_usos_insert on public.ai_usos;
create policy ai_usos_insert on public.ai_usos for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists ai_usos_delete on public.ai_usos;
create policy ai_usos_delete on public.ai_usos for delete to authenticated
  using (user_id = (select auth.uid()) and created_at < now() - interval '2 days');
drop policy if exists combos_propios on public.combos;
create policy combos_propios on public.combos for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists opiniones_leer on public.opiniones;
create policy opiniones_leer on public.opiniones for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists opiniones_escribir on public.opiniones;
create policy opiniones_escribir on public.opiniones for insert to authenticated with check (user_id = (select auth.uid()));
create index if not exists purchases_comprado_por_idx on public.purchases (comprado_por);

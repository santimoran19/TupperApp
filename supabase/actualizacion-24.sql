-- Tupper, actualización 24: lo que se saca de la lista de compras, compartido en el hogar, y el panel de administración (versión 1.31.0).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-23.sql. La versión 1.30 de la app sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-24.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra nada de lo cargado. Agrega:
--   1. compras_quitadas: lo que falta para el plan y alguien sacó de la lista ("ya lo tengo"), con la cantidad que faltaba
--      (si el plan después pide más, vuelve a aparecer). Es de la despensa, como la lista: de la persona o de su hogar (F-25).
--   2. Panel de administración (C-07): la tabla `administradores` (la cargás vos desde el SQL Editor; la app no la puede
--      tocar) y `admin_resumen()`, que le da a quien esté ahí números generales: cuentas, actividad, uso de la IA, errores y
--      las opiniones. No da datos de salud de nadie ni quién escribió cada opinión.
--      Para darte permiso (con tu mail):
--        insert into public.administradores (user_id) select id from auth.users where email = 'TU-MAIL' on conflict do nothing;

create table if not exists public.compras_quitadas (
  user_id uuid not null, -- de quién es la despensa: la persona o su hogar (como shopping_items, actualizacion-13.sql)
  food_id uuid not null references public.foods (id) on delete cascade,
  qty numeric not null check (qty > 0 and qty <= 1000000),
  created_at timestamptz not null default now(),
  primary key (user_id, food_id)
);
create index if not exists compras_quitadas_food_idx on public.compras_quitadas (food_id);
alter table public.compras_quitadas enable row level security;

drop policy if exists compras_quitadas_ambito on public.compras_quitadas;
create policy compras_quitadas_ambito on public.compras_quitadas for all to authenticated
  using (user_id = (select public.despensa_de())) with check (user_id = (select public.despensa_de()));
drop policy if exists dos_pasos on public.compras_quitadas;
create policy dos_pasos on public.compras_quitadas as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));
revoke all on public.compras_quitadas from anon, authenticated;
grant select, insert, update, delete on public.compras_quitadas to authenticated;

drop trigger if exists tope_de_filas on public.compras_quitadas;
create trigger tope_de_filas after insert on public.compras_quitadas referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '500', 'compras_quitadas');

-- Como la despensa no apunta a auth.users (puede ser un hogar), lo que queda se borra a mano: al borrar una cuenta (su
-- perfil) y al borrarse un hogar
create or replace function public.compras_quitadas_limpiar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.compras_quitadas where user_id = old.id;
  return null;
end $$;
revoke all on function public.compras_quitadas_limpiar() from public, anon, authenticated;
drop trigger if exists compras_quitadas_limpiar on public.profiles;
create trigger compras_quitadas_limpiar after delete on public.profiles
  for each row execute function public.compras_quitadas_limpiar();
drop trigger if exists compras_quitadas_limpiar on public.hogares;
create trigger compras_quitadas_limpiar after delete on public.hogares
  for each row execute function public.compras_quitadas_limpiar();

-- =====================================================================================
-- 2. Panel de administración
-- =====================================================================================
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.administradores enable row level security;
revoke all on public.administradores from anon, authenticated;
drop policy if exists dos_pasos on public.administradores;
create policy dos_pasos on public.administradores as restrictive for all to authenticated
  using ((select public.mfa_ok())) with check ((select public.mfa_ok()));

-- ¿Quien llama es administrador? (para mostrar o no el enlace al panel)
create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.administradores a where a.user_id = (select auth.uid())) and public.mfa_ok()
$$;

-- Los números del panel. Solo cuentas, días y tipos: nada de lo que come o pesa cada persona.
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
revoke all on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;
revoke all on function public.admin_resumen() from public, anon;
grant execute on function public.admin_resumen() to authenticated;

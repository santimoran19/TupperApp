-- Tupper, actualización 23b (opcional): la verificación en dos pasos también para las funciones de la base (S-07).
-- Corré este archivo en el SQL Editor DESPUÉS de actualizacion-22.sql y actualizacion-23.sql. Se puede correr más de una vez.
--
-- Qué hace: antes de CADA pedido que la app le hace a la base (tablas y funciones `rpc`), PostgREST corre esta función. Si
-- la persona activó la verificación en dos pasos y entró solo con la contraseña, el pedido se rechaza. Las tablas ya lo
-- exigían (actualizacion-22.sql); esto cubre además las funciones "security definer" (hogares, catálogo, borrar la cuenta),
-- que saltean las reglas de las tablas. Quien no activó la verificación no nota nada. Las funciones de Supabase (Edge
-- Functions) con la clave de servicio no pasan por acá.
--
-- Si algo anda mal (por ejemplo, la app no carga para nadie), se deshace con estas dos líneas:
--   alter role authenticator reset pgrst.db_pre_request;
--   notify pgrst, 'reload config';

create or replace function public.antes_de_cada_pedido() returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if coalesce((select auth.role()), '') = 'authenticated' and not public.mfa_ok() then
    raise exception 'Falta el código de verificación.' using errcode = '42501', hint = 'dos_pasos';
  end if;
end $$;
revoke all on function public.antes_de_cada_pedido() from public;
grant execute on function public.antes_de_cada_pedido() to authenticated, anon;

alter role authenticator set pgrst.db_pre_request = 'public.antes_de_cada_pedido';
notify pgrst, 'reload config';

-- Tupper, actualización 12: nombre de usuario (F-17).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va junto con la función `entrar` (supabase/functions/entrar): ver el LEEME de esa carpeta.
--
-- Cada cuenta puede tener un nombre de usuario para iniciar sesión sin escribir el email. Es opcional en la base: las
-- cuentas que ya existen quedan sin usuario y la app se lo pide la próxima vez que entran. No se toca ningún dato.
--
-- Reglas (son las mismas que valida la app en src/lib/validar.js; si cambiás una lista, cambiala en los dos lugares):
--   * de 3 a 20 caracteres: letras sin tilde, números, punto, guion y guion bajo, sin espacios ni "@";
--   * empieza y termina con letra o número, no tiene dos símbolos seguidos y tiene al menos una letra;
--   * no puede parecer una dirección de internet (nombre.com);
--   * no puede ser una palabra reservada ni llevar adentro el nombre de la app o de quien la maneja;
--   * no se repite, sin importar mayúsculas (se guarda siempre en minúsculas).

alter table public.profiles add column if not exists username text;

-- Formato: lo último que frena un valor raro aunque se salteen la app y el trigger
alter table public.profiles drop constraint if exists profiles_username_chk;
alter table public.profiles add constraint profiles_username_chk check (
  username is null or (
    username ~ '^[a-z0-9][a-z0-9._-]{1,18}[a-z0-9]$' and username !~ '[._-]{2}' and username ~ '[a-z]'
  )
);

create unique index if not exists profiles_username_key on public.profiles (username);

-- Pasa el nombre a minúsculas, lo valida y le da un mensaje claro a la persona (código P0001: ver store/base.js).
-- Solo se juzga un nombre cuando es distinto al que la cuenta ya tenía: así, si algún día se suma una palabra
-- reservada, nadie pierde el que ya tiene.
create or replace function public.profiles_usuario_valido()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  reservados constant text[] := array[
    'admin', 'administrador', 'administrator', 'root', 'superuser', 'sudo', 'tupper', 'tuppers', 'soporte',
    'support', 'ayuda', 'help', 'helpdesk', 'system', 'sistema', 'sys', 'api', 'www', 'web', 'mail', 'email',
    'correo', 'postmaster', 'webmaster', 'hostmaster', 'security', 'seguridad', 'staff', 'moderador',
    'moderator', 'mod', 'owner', 'dueno', 'null', 'undefined', 'none', 'nan', 'true', 'false', 'anonymous',
    'anonimo', 'guest', 'invitado', 'test', 'prueba', 'demo', 'supabase', 'vercel', 'github', 'anthropic',
    'claude', 'postgres', 'service_role', 'authenticated', 'anon', 'public', 'login', 'logout', 'signin',
    'signup', 'register', 'registro', 'auth', 'oauth', 'config', 'configuracion', 'settings', 'perfil',
    'profile', 'cuenta', 'account', 'user', 'users', 'usuario', 'usuarios', 'noreply', 'no-reply', 'info',
    'contacto', 'contact', 'legal', 'terminos', 'privacidad', 'privacy', 'terms', 'billing', 'pagos', 'ventas',
    'sales', 'bot', 'robot', 'official', 'oficial'
  ];
  prohibidos constant text[] := array['tupper', 'admin', 'soporte', 'support', 'staff', 'moderador', 'supabase'];
  u text;
begin
  u := nullif(lower(btrim(new.username)), '');
  new.username := u;
  if u is null then
    return new;
  end if;
  if exists (select 1 from public.profiles p where p.id = new.id and p.username = u) then
    return new;
  end if;
  if length(u) < 3 then
    raise exception 'El usuario tiene que tener al menos 3 caracteres.' using errcode = 'P0001';
  elsif length(u) > 20 then
    raise exception 'El usuario puede tener como mucho 20 caracteres.' using errcode = 'P0001';
  elsif u !~ '^[a-z0-9][a-z0-9._-]*[a-z0-9]$' or u ~ '[._-]{2}' or u !~ '[a-z]' then
    raise exception 'El usuario solo puede llevar letras sin tilde, números, punto, guion y guion bajo, y tiene que empezar y terminar con una letra o un número.' using errcode = 'P0001';
  elsif u ~ '\.(com|net|org|ar|app|io|dev|info|xyz)$' then
    raise exception 'El usuario no puede parecer una dirección de internet.' using errcode = 'P0001';
  elsif u = any (reservados) or exists (select 1 from unnest(prohibidos) as t(parte) where position(t.parte in u) > 0) then
    raise exception 'Ese usuario no está disponible. Probá con otro.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_usuario_valido on public.profiles;
create trigger profiles_usuario_valido
  before insert or update of username on public.profiles
  for each row execute function public.profiles_usuario_valido();

-- ¿Está libre este usuario? La app lo pregunta mientras la persona escribe. Solo contesta sí o no (no dice de quién es) y
-- el usuario que ya es tuyo cuenta como libre. Hace falta una sesión iniciada.
create or replace function public.usuario_disponible(p_usuario text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.profiles
    where username = lower(btrim(p_usuario)) and id is distinct from (select auth.uid())
  );
$$;

revoke all on function public.usuario_disponible(text) from public, anon;
grant execute on function public.usuario_disponible(text) to authenticated;

-- Para mirar (no cambia nada): cuántas cuentas ya eligieron usuario y cuántas faltan.
-- select count(username) as con_usuario, count(*) - count(username) as sin_usuario from public.profiles;

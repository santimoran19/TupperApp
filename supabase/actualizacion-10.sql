-- Tupper, actualización 10: la app es solo para mayores de 18 años (L-01).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
--
-- La app ya no deja poner una fecha de nacimiento que dé menos de 18 años. Acá se cuida lo mismo en la base, para que
-- nadie lo salte hablándole directo a Supabase.
-- No toca ninguna cuenta ni ningún dato que ya exista: solo se mira la fecha cuando se guarda una distinta a la que ya tenía
-- la cuenta. Si una cuenta anterior tuviera menos de 18, sigue funcionando y puede editar el resto de su perfil.

create or replace function public.profiles_mayor_de_edad()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.birth_date is not null
     and new.birth_date > (current_date - interval '18 years')::date
     -- la misma fecha que ya estaba guardada para esa cuenta no se vuelve a juzgar (también cuando llega por un upsert)
     and not exists (select 1 from public.profiles p where p.id = new.id and p.birth_date = new.birth_date)
  then
    raise exception 'Tupper es solo para mayores de 18 años' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_mayor_de_edad on public.profiles;
create trigger profiles_mayor_de_edad
  before insert or update of birth_date on public.profiles
  for each row execute function public.profiles_mayor_de_edad();

-- Para mirar (no cambia nada): cuántas cuentas tienen hoy menos de 18 años según su fecha de nacimiento.
-- select count(*) from public.profiles where birth_date > (current_date - interval '18 years')::date;

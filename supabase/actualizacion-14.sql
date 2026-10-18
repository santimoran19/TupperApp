-- Tupper, actualización 14: código de barras en los alimentos propios y catálogo compartido de productos (F-01 y F-02).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr UNA sola vez.
-- Va ANTES de publicar la versión 1.22 de la app. Las versiones anteriores siguen andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-14.sql y seed.sql.
--
-- NO modifica, mueve ni borra ningún dato que ya esté cargado: agrega una columna vacía (`foods.codigo`), dos tablas
-- y tres funciones.
--
-- Cómo funciona el catálogo compartido:
--   * Cuando alguien guarda un producto (traído de Open Food Facts, escaneado o cargado a mano) la app manda a la base
--     solo los datos del producto: nombre, valores cada 100 g/ml, categoría y código de barras. Nada de la persona.
--   * Eso queda en `catalogo_aportes` (un aporte por persona y producto) y NO lo ve nadie más. Recién cuando DOS
--     personas distintas aportaron valores que coinciden (calorías con 10 % de margen, macros con 2 o 3 g), el producto
--     pasa a `catalogo`, que sí pueden consultar todas. Así un dato mal cargado o inventado por una sola cuenta no le
--     llega a nadie. Cuántas personas hacen falta se cambia en `catalogo_minimo()`.
--   * Nadie toca las tablas directamente (sin permisos ni reglas para la app): todo pasa por las funciones de abajo.
--   * Si una persona borra su cuenta, se van sus aportes; el producto ya publicado se queda (son datos de una etiqueta,
--     no de la persona).
--
-- Para revisar o sacar algo del catálogo, desde el SQL Editor:
--   select * from public.catalogo order by publicado_at desc;
--   delete from public.catalogo where clave = '...';   -- y, si hace falta, delete from public.catalogo_aportes where clave = '...';

-- =====================================================================================
-- 1. Código de barras en los alimentos propios
-- Vacío en todo lo que ya existe. Sirve para que, al escanear un producto que ya cargaste, aparezca el tuyo.
-- =====================================================================================
alter table public.foods add column codigo text;
alter table public.foods add constraint foods_codigo_chk check (codigo is null or codigo ~ '^[0-9]{8,14}$');
create index foods_codigo_idx on public.foods (owner, codigo) where codigo is not null;

-- =====================================================================================
-- 2. Tablas nuevas
-- =====================================================================================
-- Cuántas personas distintas tienen que coincidir para que un producto pase al catálogo
create function public.catalogo_minimo() returns int
language sql immutable set search_path = '' as $$ select 2 $$;

-- Lo que ve todo el mundo: productos confirmados por más de una persona
create table public.catalogo (
  -- El código de barras o, si no tiene, el nombre sin tildes ni mayúsculas con "n:" adelante
  clave text primary key check (char_length(clave) between 3 and 90),
  codigo text check (codigo is null or codigo ~ '^[0-9]{8,14}$'),
  name text not null check (char_length(name) between 1 and 60),
  detalle text check (detalle is null or char_length(detalle) <= 40),
  unit text not null check (unit in ('g', 'ml')),
  kcal numeric not null check (kcal between 0 and 900),
  protein numeric not null default 0 check (protein between 0 and 100),
  carbs numeric not null default 0 check (carbs between 0 and 100),
  fat numeric not null default 0 check (fat between 0 and 100),
  category text not null check (char_length(category) between 1 and 40),
  alcohol boolean not null default false,
  confirmaciones int not null default 2 check (confirmaciones between 1 and 100000),
  publicado_at timestamptz not null default now(),
  constraint catalogo_decimales_chk check (scale(kcal) <= 4 and scale(protein) <= 4 and scale(carbs) <= 4 and scale(fat) <= 4),
  constraint catalogo_peso_fila_chk check (pg_column_size(catalogo.*) <= 700)
);

-- Lo que aportó cada persona (nadie más lo ve)
create table public.catalogo_aportes (
  clave text not null check (char_length(clave) between 3 and 90),
  user_id uuid not null references auth.users on delete cascade,
  codigo text check (codigo is null or codigo ~ '^[0-9]{8,14}$'),
  name text not null check (char_length(name) between 1 and 60),
  detalle text check (detalle is null or char_length(detalle) <= 40),
  unit text not null check (unit in ('g', 'ml')),
  kcal numeric not null check (kcal between 0 and 900),
  protein numeric not null default 0 check (protein between 0 and 100),
  carbs numeric not null default 0 check (carbs between 0 and 100),
  fat numeric not null default 0 check (fat between 0 and 100),
  category text not null check (char_length(category) between 1 and 40),
  alcohol boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (clave, user_id),
  constraint catalogo_aportes_decimales_chk check (scale(kcal) <= 4 and scale(protein) <= 4 and scale(carbs) <= 4 and scale(fat) <= 4),
  constraint catalogo_aportes_peso_fila_chk check (pg_column_size(catalogo_aportes.*) <= 700)
);
create index catalogo_aportes_user_idx on public.catalogo_aportes (user_id, created_at);

alter table public.catalogo enable row level security;
alter table public.catalogo_aportes enable row level security;
revoke all on public.catalogo, public.catalogo_aportes from anon, authenticated;

-- =====================================================================================
-- 3. Funciones
-- =====================================================================================
-- Nombre sin tildes, en minúsculas y con los espacios normalizados: lo que identifica a un producto sin código
create function public.catalogo_norma(p_texto text) returns text
language sql immutable set search_path = '' as $$
  select btrim(regexp_replace(
    lower(translate(coalesce(p_texto, ''), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunaeiouun')),
    '\s+', ' ', 'g'))
$$;

-- Guarda lo que esta persona sabe de un producto y, si ya coinciden `catalogo_minimo()` personas, lo publica.
-- Devuelve true si el producto está publicado. Si la persona ya había aportado ese producto, se actualiza su aporte
-- (mientras el producto no esté publicado: después ya no cambia nada).
create function public.catalogo_aportar(
  p_codigo text, p_name text, p_detalle text, p_unit text, p_kcal numeric, p_protein numeric, p_carbs numeric,
  p_fat numeric, p_category text, p_alcohol boolean
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_codigo text := nullif(btrim(coalesce(p_codigo, '')), '');
  v_name text := btrim(coalesce(p_name, ''));
  v_clave text;
  v_conf int;
  v_total int;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if v_codigo is not null and v_codigo !~ '^[0-9]{8,14}$' then raise exception 'El código de barras no es válido.'; end if;
  if char_length(v_name) not between 1 and 60 then raise exception 'El nombre no es válido.'; end if;
  if p_unit is null or p_unit not in ('g', 'ml') then raise exception 'Solo se comparten productos medidos en gramos o mililitros.'; end if;
  if p_kcal is null or p_kcal < 0 or p_kcal > 900
     or coalesce(p_protein, 0) < 0 or coalesce(p_protein, 0) > 100
     or coalesce(p_carbs, 0) < 0 or coalesce(p_carbs, 0) > 100
     or coalesce(p_fat, 0) < 0 or coalesce(p_fat, 0) > 100
     or coalesce(p_protein, 0) + coalesce(p_carbs, 0) + coalesce(p_fat, 0) > 100.5 then
    raise exception 'Los valores del producto no son válidos.';
  end if;
  if p_category is null or char_length(btrim(p_category)) not between 1 and 40 then raise exception 'La categoría no es válida.'; end if;

  v_clave := coalesce(v_codigo, 'n:' || public.catalogo_norma(v_name));
  if char_length(v_clave) > 90 then raise exception 'El nombre es demasiado largo.'; end if;

  -- Topes por persona: 100 productos nuevos por día y 3000 en total
  if not exists (select 1 from public.catalogo_aportes a where a.clave = v_clave and a.user_id = v_uid) then
    if (select count(*) from public.catalogo_aportes a where a.user_id = v_uid and a.created_at > now() - interval '1 day') >= 100 then
      raise exception 'Hoy ya compartiste muchos productos. Probá mañana.';
    end if;
    select count(*) into v_total from public.catalogo_aportes a where a.user_id = v_uid;
    if v_total >= 3000 then raise exception 'Llegaste al máximo de productos compartidos.'; end if;
  end if;

  -- Si ya está publicado, esta persona lo confirma (una sola vez) cuando sus valores coinciden con los publicados
  if exists (select 1 from public.catalogo c where c.clave = v_clave) then
    if not exists (select 1 from public.catalogo_aportes a where a.clave = v_clave and a.user_id = v_uid) then
      insert into public.catalogo_aportes (clave, user_id, codigo, name, detalle, unit, kcal, protein, carbs, fat, category, alcohol)
      select v_clave, v_uid, c.codigo, c.name, c.detalle, c.unit, c.kcal, c.protein, c.carbs, c.fat, c.category, c.alcohol
      from public.catalogo c
      where c.clave = v_clave
        and c.unit = p_unit
        and abs(c.kcal - p_kcal) <= greatest(15, 0.1 * greatest(c.kcal, p_kcal))
        and abs(c.protein - coalesce(p_protein, 0)) <= 2
        and abs(c.carbs - coalesce(p_carbs, 0)) <= 3
        and abs(c.fat - coalesce(p_fat, 0)) <= 2;
      if found then
        update public.catalogo c set confirmaciones = least(c.confirmaciones + 1, 100000) where c.clave = v_clave;
      end if;
    end if;
    return true;
  end if;

  insert into public.catalogo_aportes (clave, user_id, codigo, name, detalle, unit, kcal, protein, carbs, fat, category, alcohol)
  values (
    v_clave, v_uid, v_codigo, v_name, nullif(left(btrim(coalesce(p_detalle, '')), 40), ''), p_unit,
    round(p_kcal, 2), round(coalesce(p_protein, 0), 2), round(coalesce(p_carbs, 0), 2), round(coalesce(p_fat, 0), 2),
    btrim(p_category), coalesce(p_alcohol, false)
  )
  on conflict (clave, user_id) do update set
    name = excluded.name, detalle = excluded.detalle, unit = excluded.unit, kcal = excluded.kcal, protein = excluded.protein,
    carbs = excluded.carbs, fat = excluded.fat, category = excluded.category, alcohol = excluded.alcohol;

  -- Cuántas personas (con ésta) aportaron valores que coinciden con los de ésta
  select 1 + count(*) into v_conf
  from public.catalogo_aportes o
  join public.catalogo_aportes yo on yo.clave = v_clave and yo.user_id = v_uid
  where o.clave = v_clave and o.user_id <> v_uid
    and o.unit = yo.unit
    and abs(o.kcal - yo.kcal) <= greatest(15, 0.1 * greatest(o.kcal, yo.kcal))
    and abs(o.protein - yo.protein) <= 2
    and abs(o.carbs - yo.carbs) <= 3
    and abs(o.fat - yo.fat) <= 2;

  if v_conf >= public.catalogo_minimo() then
    insert into public.catalogo (clave, codigo, name, detalle, unit, kcal, protein, carbs, fat, category, alcohol, confirmaciones)
    select a.clave, a.codigo, a.name, a.detalle, a.unit, a.kcal, a.protein, a.carbs, a.fat, a.category, a.alcohol, v_conf
    from public.catalogo_aportes a where a.clave = v_clave and a.user_id = v_uid
    on conflict (clave) do nothing;
    return true;
  end if;
  return false;
end $$;
revoke all on function public.catalogo_aportar(text, text, text, text, numeric, numeric, numeric, numeric, text, boolean) from public, anon;
grant execute on function public.catalogo_aportar(text, text, text, text, numeric, numeric, numeric, numeric, text, boolean) to authenticated;

-- El producto confirmado con ese código de barras (si lo hay)
create function public.catalogo_por_codigo(p_codigo text)
returns table (clave text, codigo text, name text, detalle text, unit text, kcal numeric, protein numeric, carbs numeric, fat numeric,
               category text, alcohol boolean, confirmaciones int)
language sql stable security definer set search_path = '' as $$
  select c.clave, c.codigo, c.name, c.detalle, c.unit, c.kcal, c.protein, c.carbs, c.fat, c.category, c.alcohol, c.confirmaciones
  from public.catalogo c
  where (select auth.uid()) is not null and c.clave = btrim(coalesce(p_codigo, '')) and c.codigo is not null
$$;
revoke all on function public.catalogo_por_codigo(text) from public, anon;
grant execute on function public.catalogo_por_codigo(text) to authenticated;

-- Productos confirmados cuyo nombre contiene el texto (desde 3 letras; los más confirmados primero, hasta 20)
create function public.catalogo_buscar(p_texto text)
returns table (clave text, codigo text, name text, detalle text, unit text, kcal numeric, protein numeric, carbs numeric, fat numeric,
               category text, alcohol boolean, confirmaciones int)
language sql stable security definer set search_path = '' as $$
  select c.clave, c.codigo, c.name, c.detalle, c.unit, c.kcal, c.protein, c.carbs, c.fat, c.category, c.alcohol, c.confirmaciones
  from public.catalogo c
  where (select auth.uid()) is not null
    and char_length(public.catalogo_norma(p_texto)) >= 3
    and public.catalogo_norma(c.name) like '%' || replace(replace(replace(public.catalogo_norma(p_texto), '\', '\\'), '%', '\%'), '_', '\_') || '%'
  order by c.confirmaciones desc, c.name
  limit 20
$$;
revoke all on function public.catalogo_buscar(text) from public, anon;
grant execute on function public.catalogo_buscar(text) to authenticated;

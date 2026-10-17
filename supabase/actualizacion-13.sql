-- Tupper, actualización 13: hogares con la despensa compartida (F-03).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr UNA sola vez.
-- Va ANTES de publicar la versión 1.17 de la app. Las versiones anteriores siguen andando igual con esto aplicado
-- (mientras nadie arme un hogar, todo funciona exactamente como hasta ahora).
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-13.sql y seed.sql.
--
-- NO modifica, mueve ni borra ningún dato que ya esté cargado: solo agrega tablas, una columna vacía y funciones, y
-- cambia reglas de acceso de manera que quien no está en un hogar ve y toca exactamente lo mismo que antes.
--
-- Cómo funciona:
--   * Un hogar es un grupo de hasta 6 personas que comparten la despensa, la lista de compras, las comidas listas
--     (los tuppers) y el historial de compras. Cada una sigue con su diario, su plan, su perfil y sus medidas.
--   * Esas cuatro tablas (stock, shopping_items, prepared, purchases) guardan en `user_id` "de quién es la despensa":
--     la persona, si no está en un hogar, o el id del hogar. La función `despensa_de()` dice cuál es.
--     Por eso las funciones de siempre (mover_stock, cocinar, registrar_comida, comprar, editar_registro,
--     borrar_registro) hacen lo mismo de antes, solo que sobre la despensa que corresponde.
--   * Se entra con un código de 6 letras y números que da quien creó el hogar. Se puede renovar y apagar.
--   * Al unirse, lo que la persona tenía se SUMA a lo del hogar y lo suyo queda intacto, guardado (no se ve mientras
--     está en el hogar). Al salir (o si la sacan), se lleva una copia de lo del hogar y antes de reemplazar lo suyo
--     se guarda un respaldo en `hogar_respaldos`, para que nunca se pierda nada.

-- =====================================================================================
-- 1. Tablas nuevas
-- Nadie las toca directamente: no tienen permisos ni reglas para la app. Todo pasa por las funciones de abajo,
-- que corren con permisos de administrador (security definer) y comprueban quién las llama.
-- =====================================================================================

-- Cuántas personas entran en un hogar (se cambia acá, en una sola línea)
create function public.hogar_maximo() returns int
language sql immutable set search_path = '' as $$ select 6 $$;

create table public.hogares (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 40),
  -- Con este código se entra. Sin código (null) nadie puede unirse. Sin I, O, 0 ni 1, que se confunden.
  codigo text unique check (codigo ~ '^[A-HJ-NP-Z2-9]{6}$'),
  created_at timestamptz not null default now()
);

-- Cada persona está en un solo hogar (la clave es user_id)
create table public.hogar_miembros (
  user_id uuid primary key references auth.users on delete cascade,
  hogar_id uuid not null references public.hogares on delete cascade,
  rol text not null default 'miembro' check (rol in ('creador', 'miembro')),
  desde timestamptz not null default now()
);
create index hogar_miembros_hogar_idx on public.hogar_miembros (hogar_id);
-- Un solo creador por hogar
create unique index hogar_un_creador_idx on public.hogar_miembros (hogar_id) where rol = 'creador';

-- Códigos probados (para frenar a quien los pruebe de a uno): 5 errores por hora y por persona
create table public.hogar_intentos (
  user_id uuid not null references auth.users on delete cascade,
  creado timestamptz not null default now()
);
create index hogar_intentos_user_idx on public.hogar_intentos (user_id, creado);

-- Lo que tenía cada persona antes de que el hogar se lo reemplazara al salir. No se borra nunca (salvo las 5 últimas por
-- persona y al borrar la cuenta). Para verlo: select * from public.hogar_respaldos where user_id = '...' order by creado desc;
create table public.hogar_respaldos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  creado timestamptz not null default now(),
  motivo text not null default 'salida',
  stock jsonb not null default '[]'::jsonb,
  lista jsonb not null default '[]'::jsonb,
  preparado jsonb not null default '[]'::jsonb
);
create index hogar_respaldos_user_idx on public.hogar_respaldos (user_id, creado);

alter table public.hogares enable row level security;
alter table public.hogar_miembros enable row level security;
alter table public.hogar_intentos enable row level security;
alter table public.hogar_respaldos enable row level security;
revoke all on public.hogares, public.hogar_miembros, public.hogar_intentos, public.hogar_respaldos from anon, authenticated;

-- Quién compró: solo se llena en lo que se compra estando en un hogar (lo anterior queda en null)
alter table public.purchases add column comprado_por uuid references auth.users on delete set null;

-- =====================================================================================
-- 2. De quién es la despensa
-- Las cuatro tablas compartidas dejan de apuntar a auth.users (ahora `user_id` también puede ser un hogar). Para que al
-- borrar una cuenta no quede nada suelto, lo que hacía el borrado en cascada lo hacen los disparadores de abajo.
-- =====================================================================================
alter table public.stock drop constraint if exists stock_user_id_fkey;
alter table public.prepared drop constraint if exists prepared_user_id_fkey;
alter table public.shopping_items drop constraint if exists shopping_items_user_id_fkey;
alter table public.purchases drop constraint if exists purchases_user_id_fkey;

-- La despensa que le toca a quien llama: la de su hogar o, si no tiene, la suya
create function public.despensa_de() returns uuid
language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select m.hogar_id from public.hogar_miembros m where m.user_id = (select auth.uid())),
    (select auth.uid())
  )
$$;

-- Las otras personas de su hogar (para poder ver los alimentos y recetas propios que cargaron)
create function public.companeros() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select o.user_id
  from public.hogar_miembros yo
  join public.hogar_miembros o on o.hogar_id = yo.hogar_id and o.user_id <> yo.user_id
  where yo.user_id = (select auth.uid())
$$;

revoke all on function public.hogar_maximo() from public, anon;
revoke all on function public.despensa_de() from public, anon;
revoke all on function public.companeros() from public, anon;
grant execute on function public.hogar_maximo() to authenticated;
grant execute on function public.despensa_de() to authenticated;
grant execute on function public.companeros() to authenticated;

-- Reglas por fila: cada uno ve y toca la despensa que le corresponde
drop policy stock_own on public.stock;
drop policy prepared_own on public.prepared;
drop policy shopping_own on public.shopping_items;
drop policy purchases_own on public.purchases;
create policy stock_ambito on public.stock for all to authenticated
  using (user_id = (select public.despensa_de())) with check (user_id = (select public.despensa_de()));
create policy prepared_ambito on public.prepared for all to authenticated
  using (user_id = (select public.despensa_de())) with check (user_id = (select public.despensa_de()));
create policy shopping_ambito on public.shopping_items for all to authenticated
  using (user_id = (select public.despensa_de())) with check (user_id = (select public.despensa_de()));
create policy purchases_ambito on public.purchases for all to authenticated
  using (user_id = (select public.despensa_de())) with check (user_id = (select public.despensa_de()));

-- Los alimentos y recetas propios de las personas de un mismo hogar se ven entre sí (solo se pueden ver: cambiarlos o
-- borrarlos sigue siendo solo de quien los creó). Sin esto, la despensa compartida tendría cosas que alguien no puede ver.
drop policy foods_read on public.foods;
create policy foods_read on public.foods for select to authenticated
  using (owner is null or owner = (select auth.uid()) or owner in (select public.companeros()));
drop policy recipes_read on public.recipes;
create policy recipes_read on public.recipes for select to authenticated
  using (owner is null or owner = (select auth.uid()) or owner in (select public.companeros()));
drop policy recipe_items_read on public.recipe_items;
create policy recipe_items_read on public.recipe_items for select to authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_id
                 and (r.owner is null or r.owner = (select auth.uid()) or r.owner in (select public.companeros()))));

-- Al borrar una cuenta (borra su perfil): se va lo suyo de las cuatro tablas, como antes hacía el borrado en cascada.
-- La despensa del hogar no se toca: es de las demás personas.
create function public.profiles_limpiar_despensa() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.stock where user_id = old.id;
  delete from public.prepared where user_id = old.id;
  delete from public.shopping_items where user_id = old.id;
  delete from public.purchases where user_id = old.id;
  return null;
end $$;
revoke all on function public.profiles_limpiar_despensa() from public, anon, authenticated;
create trigger profiles_limpiar_despensa after delete on public.profiles
  for each row execute function public.profiles_limpiar_despensa();

-- Borrar la cuenta propia (actualizacion-3.sql): ahora también se lleva lo suyo de las cuatro tablas, que ya no se borran
-- solas con el usuario. Si estaba en un hogar, el resto sigue con su despensa (ver abajo).
create or replace function public.borrar_mi_cuenta() returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then return; end if;
  delete from public.stock where user_id = v_uid;
  delete from public.prepared where user_id = v_uid;
  delete from public.shopping_items where user_id = v_uid;
  delete from public.purchases where user_id = v_uid;
  delete from auth.users where id = v_uid;
end $$;

-- Cuando alguien deja de estar en un hogar (se va, la sacan o borra su cuenta):
--   * si era la última persona, el hogar se borra con su despensa;
--   * si era quien lo creó, pasa a ser creadora la persona que lleva más tiempo en él.
create function public.hogar_miembros_despues_de_borrar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.hogar_miembros m where m.hogar_id = old.hogar_id) then
    delete from public.stock where user_id = old.hogar_id;
    delete from public.prepared where user_id = old.hogar_id;
    delete from public.shopping_items where user_id = old.hogar_id;
    delete from public.purchases where user_id = old.hogar_id;
    delete from public.hogares where id = old.hogar_id;
  elsif old.rol = 'creador' then
    update public.hogar_miembros m set rol = 'creador'
    where m.user_id = (
      select m2.user_id from public.hogar_miembros m2 where m2.hogar_id = old.hogar_id order by m2.desde, m2.user_id limit 1
    );
  end if;
  return null;
end $$;
revoke all on function public.hogar_miembros_despues_de_borrar() from public, anon, authenticated;
create trigger hogar_miembros_despues_de_borrar after delete on public.hogar_miembros
  for each row execute function public.hogar_miembros_despues_de_borrar();

-- =====================================================================================
-- 3. Las funciones de siempre, sobre la despensa que corresponde
-- Son las de actualizacion-7.sql y actualizacion-9.sql con un solo cambio: lo que tocaba stock, comidas listas, lista de
-- compras y compras con `user_id = v_uid` ahora usa `v_scope` (la despensa de esa persona o de su hogar). El diario
-- (log_entries) sigue siendo de cada una. Mismos parámetros, mismas respuestas.
-- =====================================================================================
-- Suma o resta cantidades a la despensa. Nunca baja de cero.
create or replace function public.mover_stock(p_cambios jsonb, p_solo_si_existe boolean default false)
returns setof public.stock
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_scope uuid := public.despensa_de(); -- de quién es la despensa: la del hogar o, si no tiene, la propia
  c record;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if p_cambios is null or jsonb_typeof(p_cambios) <> 'array' then return; end if;
  if jsonb_array_length(p_cambios) > 300 then raise exception 'Son demasiados cambios juntos.'; end if;
  for c in
    select (x->>'food_id')::uuid as food_id, sum((x->>'delta')::numeric) as delta
    from jsonb_array_elements(p_cambios) x
    group by 1
    order by 1 -- siempre en el mismo orden: dos pedidos a la vez no se traban entre sí
  loop
    if c.food_id is null or c.delta is null then continue; end if;
    -- "NaN" e "Infinity" también son numeric: sin esto pasarían y dejarían el stock en el tope
    if not (c.delta between -1000000 and 1000000) then raise exception 'Hay una cantidad que no es válida.'; end if;
    if p_solo_si_existe then
      return query
        update public.stock s
        set qty = least(1000000, greatest(0, round(s.qty + c.delta, 2))), updated_at = now()
        where s.user_id = v_scope and s.food_id = c.food_id
        returning s.*;
    else
      return query
        insert into public.stock as s (user_id, food_id, qty, updated_at)
        values (v_scope, c.food_id, least(1000000, greatest(0, round(c.delta, 2))), now())
        on conflict (user_id, food_id) do update
        set qty = least(1000000, greatest(0, round(s.qty + c.delta, 2))), updated_at = now()
        returning s.*;
    end if;
  end loop;
end $$;

-- Cocinar: descuenta los ingredientes y suma las porciones como comida lista.
create or replace function public.cocinar(p_receta uuid, p_porciones numeric, p_stock jsonb, p_clave uuid default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_scope uuid := public.despensa_de(); -- de quién es la despensa: la del hogar o, si no tiene, la propia
  v_stock jsonb;
  v_preparado public.prepared;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if p_porciones is null or not (round(p_porciones, 1) > 0 and p_porciones <= 1000) then
    raise exception 'La cantidad de porciones no es válida.';
  end if;
  if public.pedido_repetido(p_clave) then return jsonb_build_object('repetida', true); end if;
  select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) into v_stock from public.mover_stock(p_stock, false) s;
  insert into public.prepared as p (user_id, recipe_id, portions)
  values (v_scope, p_receta, least(1000, round(p_porciones, 1)))
  on conflict (user_id, recipe_id) do update
  set portions = least(1000, greatest(0, round(p.portions + p_porciones, 1)))
  returning p.* into v_preparado;
  return jsonb_build_object('stock', v_stock, 'preparado', to_jsonb(v_preparado));
end $$;

-- Comprar: guarda el gasto (anotando quién compró, si está en un hogar), suma a la despensa y saca el producto de la lista.
create or replace function public.comprar(p_alimento uuid, p_cantidad numeric, p_precio numeric, p_fecha date, p_anotado uuid default null, p_clave uuid default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_scope uuid := public.despensa_de(); -- de quién es la despensa: la del hogar o, si no tiene, la propia
  v_nombre text;
  v_compra public.purchases;
  v_stock jsonb;
  v_lista uuid;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  select f.name into v_nombre from public.foods f where f.id = p_alimento;
  if v_nombre is null then raise exception 'Ese alimento ya no existe.'; end if;
  if public.pedido_repetido(p_clave) then return jsonb_build_object('repetida', true); end if;

  insert into public.purchases (user_id, food_id, name, qty, price, date, comprado_por)
  values (v_scope, p_alimento, v_nombre, p_cantidad, coalesce(p_precio, 0), coalesce(p_fecha, current_date), nullif(v_uid, v_scope))
  returning * into v_compra;

  select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) into v_stock
  from public.mover_stock(jsonb_build_array(jsonb_build_object('food_id', p_alimento, 'delta', p_cantidad)), false) s;

  delete from public.shopping_items l
  where l.id = (
    select l2.id from public.shopping_items l2
    where l2.user_id = v_scope and l2.food_id in (p_anotado, p_alimento)
    order by (l2.food_id = p_anotado) desc nulls last
    limit 1
  )
  returning l.id into v_lista;

  return jsonb_build_object('compra', to_jsonb(v_compra), 'stock', v_stock, 'lista', v_lista);
end $$;

-- Registrar lo que se comió: el diario es de cada una; la despensa y las comidas listas que se descuentan, las del hogar.
create or replace function public.registrar_comida(p_fecha date, p_comida text, p_filas jsonb, p_stock jsonb default '[]'::jsonb, p_preparado jsonb default '[]'::jsonb, p_clave uuid default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_scope uuid := public.despensa_de(); -- de quién es la despensa: la del hogar o, si no tiene, la propia
  v_registros jsonb;
  v_stock jsonb;
  v_preparado jsonb;
  f record;
  it record;
  v_desc jsonb[] := '{}';
  v_s jsonb;
  v_p numeric;
  v_pn numeric;
  v_hay numeric;
  v_toma numeric;
  v_comidos uuid[] := '{}';
  v_recetas uuid[] := '{}';
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if p_filas is null or jsonb_typeof(p_filas) <> 'array' or jsonb_array_length(p_filas) = 0 then
    raise exception 'No hay nada para registrar.';
  end if;
  if jsonb_array_length(p_filas) > 100 then raise exception 'Son demasiadas cosas juntas.'; end if;
  if public.pedido_repetido(p_clave) then return jsonb_build_object('repetida', true); end if;

  delete from public.log_entries l where l.user_id = v_uid and l.date = p_fecha and l.meal = p_comida and l.skipped;

  -- Se bloquean primero las filas de la despensa que se van a tocar, siempre en el mismo orden:
  -- dos pedidos a la vez de la misma cuenta no se traban entre sí
  perform 1 from public.stock s
  where s.user_id = v_scope
    and s.food_id in (
      select (e ->> 'f')::uuid
      from jsonb_array_elements(p_filas) x, jsonb_array_elements(case when jsonb_typeof(x -> 's') = 'array' then x -> 's' else '[]'::jsonb end) e
    )
  order by s.food_id for update;

  -- Descuento fila por fila
  for f in
    select t.ord, (t.el ->> 'recipe_id')::uuid as recipe_id, t.el -> 's' as s, (t.el ->> 'p')::numeric as p
    from jsonb_array_elements(p_filas) with ordinality as t(el, ord)
    order by t.ord
  loop
    if f.s is null and f.p is null then
      v_desc := v_desc || null::jsonb; -- una versión anterior de la app: no se sabe cuánto descontó
      continue;
    end if;
    if f.s is not null and (jsonb_typeof(f.s) <> 'array' or jsonb_array_length(f.s) > 40) then
      raise exception 'Son demasiados ingredientes juntos.';
    end if;
    v_s := '[]'::jsonb;
    for it in
      select (e ->> 'f')::uuid as food_id, sum((e ->> 'q')::numeric) as q
      from jsonb_array_elements(coalesce(f.s, '[]'::jsonb)) e
      group by 1 order by 1
    loop
      -- "NaN" e "Infinity" también son numeric: con el between no pasan
      if it.food_id is null or not (it.q between 0.005 and 1000000) then continue; end if;
      select s.qty into v_hay from public.stock s where s.user_id = v_scope and s.food_id = it.food_id;
      if not found then continue; end if; -- no está en la despensa: no hay de dónde descontar
      v_toma := round(least(it.q, v_hay), 2);
      if v_toma > 0 then
        update public.stock s set qty = greatest(0, round(s.qty - v_toma, 2)), updated_at = now()
        where s.user_id = v_scope and s.food_id = it.food_id;
        v_comidos := v_comidos || it.food_id;
      end if;
      v_s := v_s || jsonb_build_object('f', it.food_id, 'q', v_toma, 'n', round(it.q, 2));
    end loop;

    v_p := 0;
    v_pn := 0;
    if f.p is not null and f.recipe_id is not null and f.p between 0.05 and 1000 then
      select p.portions into v_hay from public.prepared p where p.user_id = v_scope and p.recipe_id = f.recipe_id for update;
      if found then
        v_p := round(least(f.p, v_hay), 1);
        v_pn := round(f.p, 1);
        if v_p > 0 then
          update public.prepared p set portions = greatest(0, round(p.portions - v_p, 1))
          where p.user_id = v_scope and p.recipe_id = f.recipe_id;
          v_recetas := v_recetas || f.recipe_id;
        end if;
      end if;
    end if;
    v_desc := v_desc || jsonb_build_object('s', v_s, 'p', v_p, 'pn', v_pn);
  end loop;

  with nuevas as (
    insert into public.log_entries (user_id, date, meal, name, food_id, recipe_id, qty, kcal, protein, carbs, fat, descontado)
    select v_uid, p_fecha, p_comida, t.el ->> 'name', (t.el ->> 'food_id')::uuid, (t.el ->> 'recipe_id')::uuid, (t.el ->> 'qty')::numeric,
           coalesce((t.el ->> 'kcal')::numeric, 0), coalesce((t.el ->> 'protein')::numeric, 0),
           coalesce((t.el ->> 'carbs')::numeric, 0), coalesce((t.el ->> 'fat')::numeric, 0), v_desc[t.ord]
    from jsonb_array_elements(p_filas) with ordinality as t(el, ord)
    order by t.ord
    returning *
  )
  select coalesce(jsonb_agg(to_jsonb(n)), '[]'::jsonb) into v_registros from nuevas n;

  -- Lo mismo que antes, para las versiones de la app que mandan el descuento en p_stock y p_preparado
  select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) into v_stock from public.mover_stock(p_stock, true) s;
  v_stock := v_stock || coalesce((select jsonb_agg(to_jsonb(s)) from public.stock s where s.user_id = v_scope and s.food_id = any(v_comidos)), '[]'::jsonb);

  with cambios as (
    select (x->>'recipe_id')::uuid as recipe_id, sum((x->>'delta')::numeric) as delta
    from jsonb_array_elements(case when jsonb_typeof(p_preparado) = 'array' then p_preparado else '[]'::jsonb end) x
    group by 1
  ), tocadas as (
    update public.prepared p
    set portions = least(1000, greatest(0, round(p.portions + c.delta, 1)))
    from cambios c
    where p.user_id = v_scope and p.recipe_id = c.recipe_id and c.delta between -1000 and 1000
    returning p.*
  )
  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) into v_preparado from tocadas t;
  v_preparado := v_preparado || coalesce((select jsonb_agg(to_jsonb(p)) from public.prepared p where p.user_id = v_scope and p.recipe_id = any(v_recetas)), '[]'::jsonb);

  return jsonb_build_object('registros', v_registros, 'stock', v_stock, 'preparado', v_preparado);
end $$;

-- Cambiar la cantidad de un registro, ajustando la despensa.
create or replace function public.editar_registro(p_id uuid, p_qty numeric)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_scope uuid := public.despensa_de(); -- de quién es la despensa: la del hogar o, si no tiene, la propia
  r public.log_entries;
  it record;
  v_q numeric;
  v_razon numeric;
  v_nuevo jsonb := '[]'::jsonb;
  v_faltan jsonb := '[]'::jsonb;
  v_ausentes jsonb := '[]'::jsonb;
  v_tocados uuid[] := '{}';
  v_sin boolean := false;
  v_hay numeric;
  v_dif numeric;
  v_toma numeric;
  v_objetivo numeric;
  v_p0 numeric;
  v_p1 numeric;
  v_pn0 numeric;
  v_pn1 numeric;
  v_hecho numeric;
  v_p_faltan numeric := 0;
  v_p_ausentes boolean := false;
  v_receta uuid[] := '{}';
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if p_qty is null or not (round(p_qty, 2) > 0 and p_qty <= 1000000) then raise exception 'La cantidad no es válida.'; end if;
  v_q := round(p_qty, 2);

  select * into r from public.log_entries l where l.id = p_id and l.user_id = v_uid for update;
  if not found then raise exception 'Ese registro ya no existe.'; end if;
  if r.skipped or r.qty <= 0 then raise exception 'Ese registro no se puede editar.'; end if;

  if r.qty = v_q then
    return jsonb_build_object('registro', to_jsonb(r), 'stock', '[]'::jsonb, 'preparado', '[]'::jsonb, 'avisos', jsonb_build_object('sin_datos', false));
  end if;
  v_razon := v_q / r.qty;
  if r.kcal * v_razon > 20000 then raise exception 'Esa cantidad tiene demasiadas calorías.'; end if;

  if r.descontado is null then
    v_sin := true;
  else
    perform 1 from public.stock s
    where s.user_id = v_scope and s.food_id in (select (e ->> 'f')::uuid from jsonb_array_elements(r.descontado -> 's') e)
    order by s.food_id for update;

    for it in
      select (e ->> 'f')::uuid as food_id, (e ->> 'q')::numeric as q, coalesce((e ->> 'n')::numeric, (e ->> 'q')::numeric) as n
      from jsonb_array_elements(r.descontado -> 's') e order by 1
    loop
      v_objetivo := round(it.n * v_razon, 2); -- lo que hace falta descontar con la cantidad nueva
      v_hecho := it.q;                        -- lo que va a quedar descontado de verdad
      if v_objetivo > it.q then
        v_dif := v_objetivo - it.q;
        select s.qty into v_hay from public.stock s where s.user_id = v_scope and s.food_id = it.food_id;
        if not found then
          v_ausentes := v_ausentes || to_jsonb(it.food_id);
        else
          v_toma := round(least(v_dif, v_hay), 2);
          if v_toma > 0 then
            update public.stock s set qty = greatest(0, round(s.qty - v_toma, 2)), updated_at = now()
            where s.user_id = v_scope and s.food_id = it.food_id;
            v_tocados := v_tocados || it.food_id;
          end if;
          if v_toma < v_dif then v_faltan := v_faltan || jsonb_build_object('f', it.food_id, 'falta', v_dif - v_toma); end if;
          v_hecho := it.q + v_toma;
        end if;
      elsif v_objetivo < it.q then
        update public.stock s set qty = least(1000000, round(s.qty + (it.q - v_objetivo), 2)), updated_at = now()
        where s.user_id = v_scope and s.food_id = it.food_id;
        if found then v_tocados := v_tocados || it.food_id; else v_ausentes := v_ausentes || to_jsonb(it.food_id); end if;
        v_hecho := v_objetivo;
      end if;
      v_nuevo := v_nuevo || jsonb_build_object('f', it.food_id, 'q', v_hecho, 'n', v_objetivo);
    end loop;

    -- Porciones de comida lista (solo en los registros de recetas)
    v_p0 := coalesce((r.descontado ->> 'p')::numeric, 0);
    v_pn0 := coalesce((r.descontado ->> 'pn')::numeric, v_p0);
    v_p1 := v_p0;
    v_pn1 := v_pn0;
    if v_pn0 > 0 and r.recipe_id is not null then
      v_objetivo := round(v_pn0 * v_razon, 1);
      v_pn1 := v_objetivo;
      if v_objetivo > v_p0 then
        v_dif := v_objetivo - v_p0;
        select p.portions into v_hay from public.prepared p where p.user_id = v_scope and p.recipe_id = r.recipe_id for update;
        if not found then
          v_p_ausentes := true;
        else
          v_toma := round(least(v_dif, v_hay), 1);
          if v_toma > 0 then
            update public.prepared p set portions = greatest(0, round(p.portions - v_toma, 1)) where p.user_id = v_scope and p.recipe_id = r.recipe_id;
            v_receta := array[r.recipe_id];
          end if;
          if v_toma < v_dif then v_p_faltan := v_dif - v_toma; end if;
          v_p1 := v_p0 + v_toma;
        end if;
      elsif v_objetivo < v_p0 then
        update public.prepared p set portions = least(1000, round(p.portions + (v_p0 - v_objetivo), 1)) where p.user_id = v_scope and p.recipe_id = r.recipe_id;
        if found then v_receta := array[r.recipe_id]; else v_p_ausentes := true; end if;
        v_p1 := v_objetivo;
      end if;
    end if;
  end if;

  update public.log_entries l
  set qty = v_q,
      kcal = round(l.kcal * v_razon, 4),
      protein = round(l.protein * v_razon, 4),
      carbs = round(l.carbs * v_razon, 4),
      fat = round(l.fat * v_razon, 4),
      descontado = case when v_sin then null else jsonb_build_object('s', v_nuevo, 'p', v_p1, 'pn', v_pn1) end
  where l.id = p_id
  returning * into r;

  return jsonb_build_object(
    'registro', to_jsonb(r),
    'stock', coalesce((select jsonb_agg(to_jsonb(s)) from public.stock s where s.user_id = v_scope and s.food_id = any(v_tocados)), '[]'::jsonb),
    'preparado', coalesce((select jsonb_agg(to_jsonb(p)) from public.prepared p where p.user_id = v_scope and p.recipe_id = any(v_receta)), '[]'::jsonb),
    'avisos', jsonb_build_object('sin_datos', v_sin, 'faltan', v_faltan, 'ausentes', v_ausentes,
                                 'porciones_faltan', v_p_faltan, 'porciones_ausentes', v_p_ausentes)
  );
end $$;

-- Borrar un registro, devolviendo a la despensa lo que había descontado.
create or replace function public.borrar_registro(p_id uuid)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_scope uuid := public.despensa_de(); -- de quién es la despensa: la del hogar o, si no tiene, la propia
  r public.log_entries;
  it record;
  v_ausentes jsonb := '[]'::jsonb;
  v_tocados uuid[] := '{}';
  v_receta uuid[] := '{}';
  v_p numeric;
  v_p_ausentes boolean := false;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  select * into r from public.log_entries l where l.id = p_id and l.user_id = v_uid for update;
  if not found then
    return jsonb_build_object('id', p_id, 'stock', '[]'::jsonb, 'preparado', '[]'::jsonb, 'avisos', jsonb_build_object('ausentes', '[]'::jsonb, 'porciones_ausentes', false));
  end if;

  if r.descontado is not null then
    perform 1 from public.stock s
    where s.user_id = v_scope and s.food_id in (select (e ->> 'f')::uuid from jsonb_array_elements(r.descontado -> 's') e)
    order by s.food_id for update;
    for it in
      select (e ->> 'f')::uuid as food_id, (e ->> 'q')::numeric as q
      from jsonb_array_elements(r.descontado -> 's') e order by 1
    loop
      if not (it.q > 0 and it.q <= 1000000) then continue; end if;
      update public.stock s set qty = least(1000000, round(s.qty + it.q, 2)), updated_at = now()
      where s.user_id = v_scope and s.food_id = it.food_id;
      if found then v_tocados := v_tocados || it.food_id; else v_ausentes := v_ausentes || to_jsonb(it.food_id); end if;
    end loop;
    v_p := coalesce((r.descontado ->> 'p')::numeric, 0);
    if v_p > 0 and v_p <= 1000 and r.recipe_id is not null then
      update public.prepared p set portions = least(1000, round(p.portions + v_p, 1)) where p.user_id = v_scope and p.recipe_id = r.recipe_id;
      if found then v_receta := array[r.recipe_id]; else v_p_ausentes := true; end if;
    end if;
  end if;

  delete from public.log_entries l where l.id = p_id and l.user_id = v_uid;

  return jsonb_build_object(
    'id', p_id,
    'stock', coalesce((select jsonb_agg(to_jsonb(s)) from public.stock s where s.user_id = v_scope and s.food_id = any(v_tocados)), '[]'::jsonb),
    'preparado', coalesce((select jsonb_agg(to_jsonb(p)) from public.prepared p where p.user_id = v_scope and p.recipe_id = any(v_receta)), '[]'::jsonb),
    'avisos', jsonb_build_object('ausentes', v_ausentes, 'porciones_ausentes', v_p_ausentes)
  );
end $$;

-- =====================================================================================
-- 4. Armar y manejar un hogar
-- =====================================================================================

-- Código nuevo de 6 caracteres, que no esté en uso. Sale de números al azar de la base (gen_random_uuid es criptográfico).
create function public.hogar_codigo_nuevo() returns text
language plpgsql volatile set search_path = '' as $$
declare
  v_alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 32 caracteres: cada byte da uno sin sesgo
  v_bytes text;
  v_codigo text;
begin
  loop
    v_bytes := replace(gen_random_uuid()::text, '-', ''); -- los primeros 12 caracteres son 6 bytes al azar
    v_codigo := '';
    for i in 0..5 loop
      v_codigo := v_codigo || substr(v_alfabeto, (('x' || substr(v_bytes, i * 2 + 1, 2))::bit(8)::int % 32) + 1, 1);
    end loop;
    exit when not exists (select 1 from public.hogares h where h.codigo = v_codigo);
  end loop;
  return v_codigo;
end $$;

-- Suma lo que tiene una persona a la despensa de un hogar. Lo de la persona NO se toca: queda guardado donde estaba.
--   despensa: las cantidades se suman (lo agotado también entra, para que siga figurando) · lista de compras: si ya estaba, queda la cantidad mayor
--   comidas listas: las porciones se suman · compras: las de los últimos 90 días (sin repetir las que ya estén)
create function public.hogar_sumar(p_user uuid, p_hogar uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.stock as h (user_id, food_id, qty, updated_at)
  select p_hogar, s.food_id, s.qty, now() from public.stock s where s.user_id = p_user
  on conflict (user_id, food_id) do update
  set qty = least(1000000, round(h.qty + excluded.qty, 2)), updated_at = now();

  insert into public.shopping_items as h (user_id, food_id, qty)
  select p_hogar, l.food_id, l.qty from public.shopping_items l where l.user_id = p_user
  on conflict (user_id, food_id) do update set qty = greatest(h.qty, excluded.qty);

  insert into public.prepared as h (user_id, recipe_id, portions)
  select p_hogar, p.recipe_id, p.portions from public.prepared p where p.user_id = p_user and p.portions > 0
  on conflict (user_id, recipe_id) do update
  set portions = least(1000, round(h.portions + excluded.portions, 1));

  insert into public.purchases (user_id, food_id, name, qty, price, date)
  select p_hogar, c.food_id, c.name, c.qty, c.price, c.date
  from public.purchases c
  where c.user_id = p_user and c.date >= current_date - 90
    and not exists (
      select 1 from public.purchases h
      where h.user_id = p_hogar and h.food_id is not distinct from c.food_id and h.name = c.name
        and h.qty = c.qty and h.price = c.price and h.date = c.date
    );
end $$;

-- Lo que se lleva una persona al irse (o cuando la sacan): una copia de la despensa, la lista y las comidas listas del hogar,
-- y las compras que hizo estando en él. Antes de reemplazar lo suyo se guarda un respaldo.
-- Lo que apunta a alimentos o recetas que cargó otra persona no se lleva (ya no los podría ver), y lo que apunta a los
-- que cargó ella sale del hogar (los demás ya no los podrían ver): se va con ella.
create function public.hogar_llevarse(p_user uuid, p_hogar uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- 1. Respaldo de lo que tenía antes
  insert into public.hogar_respaldos (user_id, motivo, stock, lista, preparado)
  select p_user, 'salida',
    coalesce((select jsonb_agg(to_jsonb(s) - 'user_id') from public.stock s where s.user_id = p_user), '[]'::jsonb),
    coalesce((select jsonb_agg(to_jsonb(l) - 'user_id') from public.shopping_items l where l.user_id = p_user), '[]'::jsonb),
    coalesce((select jsonb_agg(to_jsonb(p) - 'user_id') from public.prepared p where p.user_id = p_user), '[]'::jsonb)
  where exists (select 1 from public.stock s where s.user_id = p_user)
     or exists (select 1 from public.shopping_items l where l.user_id = p_user)
     or exists (select 1 from public.prepared p where p.user_id = p_user);
  -- Se guardan los 5 últimos de cada persona
  delete from public.hogar_respaldos r
  where r.user_id = p_user and r.id not in (
    select r2.id from public.hogar_respaldos r2 where r2.user_id = p_user order by r2.creado desc, r2.id limit 5
  );

  -- 2. Lo suyo pasa a ser una copia de lo del hogar
  delete from public.stock where user_id = p_user;
  delete from public.shopping_items where user_id = p_user;
  delete from public.prepared where user_id = p_user;
  insert into public.stock (user_id, food_id, qty, updated_at)
  select p_user, h.food_id, h.qty, now()
  from public.stock h join public.foods f on f.id = h.food_id
  where h.user_id = p_hogar and (f.owner is null or f.owner = p_user);
  insert into public.shopping_items (user_id, food_id, qty)
  select p_user, h.food_id, h.qty
  from public.shopping_items h join public.foods f on f.id = h.food_id
  where h.user_id = p_hogar and (f.owner is null or f.owner = p_user);
  insert into public.prepared (user_id, recipe_id, portions)
  select p_user, h.recipe_id, h.portions
  from public.prepared h join public.recipes r on r.id = h.recipe_id
  where h.user_id = p_hogar and (r.owner is null or r.owner = p_user);
  insert into public.purchases (user_id, food_id, name, qty, price, date)
  select p_user, case when f.id is not null and (f.owner is null or f.owner = p_user) then c.food_id end, c.name, c.qty, c.price, c.date
  from public.purchases c left join public.foods f on f.id = c.food_id
  where c.user_id = p_hogar and c.comprado_por = p_user;

  -- 3. Lo que es de ella sale del hogar
  delete from public.stock h using public.foods f where h.user_id = p_hogar and f.id = h.food_id and f.owner = p_user;
  delete from public.shopping_items h using public.foods f where h.user_id = p_hogar and f.id = h.food_id and f.owner = p_user;
  delete from public.prepared h using public.recipes r where h.user_id = p_hogar and r.id = h.recipe_id and r.owner = p_user;
  update public.purchases c set food_id = null
  where c.user_id = p_hogar and c.food_id in (select f.id from public.foods f where f.owner = p_user);
end $$;

revoke all on function public.hogar_codigo_nuevo() from public, anon, authenticated;
revoke all on function public.hogar_sumar(uuid, uuid) from public, anon, authenticated;
revoke all on function public.hogar_llevarse(uuid, uuid) from public, anon, authenticated;

-- El hogar de quien llama: null si no tiene. El código solo lo ve quien creó el hogar (null si está apagado).
-- { id, nombre, codigo, soy_creador, maximo, miembros: [{ id, nombre, usuario, creador, desde }] }
create function public.mi_hogar() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  m public.hogar_miembros;
  h public.hogares;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  select * into m from public.hogar_miembros x where x.user_id = v_uid;
  if not found then return null; end if;
  select * into h from public.hogares x where x.id = m.hogar_id;
  return jsonb_build_object(
    'id', h.id,
    'nombre', h.nombre,
    'codigo', case when m.rol = 'creador' then h.codigo end,
    'soy_creador', m.rol = 'creador',
    'maximo', public.hogar_maximo(),
    'miembros', (
      select coalesce(jsonb_agg(
        jsonb_build_object('id', x.user_id, 'nombre', coalesce(p.name, ''), 'usuario', p.username, 'creador', x.rol = 'creador', 'desde', x.desde)
        order by x.desde, x.user_id
      ), '[]'::jsonb)
      from public.hogar_miembros x left join public.profiles p on p.id = x.user_id
      where x.hogar_id = h.id
    )
  );
end $$;

-- Armar un hogar nuevo: quien lo arma queda como creadora y su despensa pasa a ser la del hogar (lo suyo queda guardado).
create function public.crear_hogar(p_nombre text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_nombre text := btrim(coalesce(p_nombre, ''));
  v_id uuid;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if char_length(v_nombre) not between 1 and 40 then raise exception 'El nombre del hogar tiene que tener entre 1 y 40 letras.'; end if;
  -- De a un pedido por persona (dos a la vez no pueden armar dos hogares)
  perform pg_advisory_xact_lock(hashtextextended('hogar:' || v_uid::text, 0));
  if exists (select 1 from public.hogar_miembros m where m.user_id = v_uid) then
    raise exception 'Ya estás en un hogar. Salí de ese antes de armar otro.';
  end if;
  insert into public.hogares (nombre, codigo) values (v_nombre, public.hogar_codigo_nuevo()) returning id into v_id;
  insert into public.hogar_miembros (user_id, hogar_id, rol) values (v_uid, v_id, 'creador');
  perform public.hogar_sumar(v_uid, v_id);
  return public.mi_hogar();
end $$;

-- Unirse con un código. Si el código no sirve contesta { ok: false, error } (y no tira un error, para que el intento
-- quede anotado: después de 5 equivocados en una hora hay que esperar). Si entra, { ok: true }.
create function public.unirse_al_hogar(p_codigo text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_codigo text := upper(btrim(coalesce(p_codigo, '')));
  h public.hogares;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  perform pg_advisory_xact_lock(hashtextextended('hogar:' || v_uid::text, 0));
  if exists (select 1 from public.hogar_miembros m where m.user_id = v_uid) then
    raise exception 'Ya estás en un hogar. Salí de ese antes de unirte a otro.';
  end if;
  delete from public.hogar_intentos i where i.user_id = v_uid and i.creado < now() - interval '1 hour';
  if (select count(*) from public.hogar_intentos i where i.user_id = v_uid) >= 5 then
    raise exception 'Probaste con demasiados códigos. Esperá un rato y probá de nuevo.';
  end if;
  if v_codigo !~ '^[A-HJ-NP-Z2-9]{6}$' then
    insert into public.hogar_intentos (user_id) values (v_uid);
    return jsonb_build_object('ok', false, 'error', 'Ese código no es válido: tiene 6 letras o números.');
  end if;
  select * into h from public.hogares x where x.codigo = v_codigo for update;
  if not found then
    insert into public.hogar_intentos (user_id) values (v_uid);
    return jsonb_build_object('ok', false, 'error', 'No encontramos ese código. Revisalo con quien te invitó: puede que lo hayan cambiado.');
  end if;
  if (select count(*) from public.hogar_miembros m where m.hogar_id = h.id) >= public.hogar_maximo() then
    raise exception 'Ese hogar ya está completo (hasta % personas).', public.hogar_maximo();
  end if;
  insert into public.hogar_miembros (user_id, hogar_id) values (v_uid, h.id);
  perform public.hogar_sumar(v_uid, h.id);
  delete from public.hogar_intentos i where i.user_id = v_uid;
  return jsonb_build_object('ok', true);
end $$;

-- Irse del hogar: se lleva una copia de lo del hogar (ver hogar_llevarse)
create function public.salir_del_hogar() returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_hogar uuid;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  perform pg_advisory_xact_lock(hashtextextended('hogar:' || v_uid::text, 0));
  select m.hogar_id into v_hogar from public.hogar_miembros m where m.user_id = v_uid;
  if not found then raise exception 'No estás en ningún hogar.'; end if;
  perform public.hogar_llevarse(v_uid, v_hogar);
  delete from public.hogar_miembros m where m.user_id = v_uid;
end $$;

-- Sacar a otra persona del hogar (solo quien lo creó). Se lleva lo mismo que si se fuera sola.
create function public.sacar_del_hogar(p_usuario uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_hogar uuid;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  select m.hogar_id into v_hogar from public.hogar_miembros m where m.user_id = v_uid and m.rol = 'creador';
  if not found then raise exception 'Solo quien armó el hogar puede sacar a otras personas.'; end if;
  if p_usuario = v_uid then raise exception 'Para irte del hogar usá "Salir del hogar".'; end if;
  perform pg_advisory_xact_lock(hashtextextended('hogar:' || p_usuario::text, 0));
  if not exists (select 1 from public.hogar_miembros m where m.user_id = p_usuario and m.hogar_id = v_hogar) then
    raise exception 'Esa persona ya no está en tu hogar.';
  end if;
  perform public.hogar_llevarse(p_usuario, v_hogar);
  delete from public.hogar_miembros m where m.user_id = p_usuario;
end $$;

-- Código nuevo (el anterior deja de servir) o, con p_apagar, sin código: nadie puede unirse. Solo quien creó el hogar.
-- Devuelve el código nuevo (null si se apagó).
create function public.renovar_codigo(p_apagar boolean default false) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_hogar uuid;
  v_codigo text;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  select m.hogar_id into v_hogar from public.hogar_miembros m where m.user_id = v_uid and m.rol = 'creador';
  if not found then raise exception 'Solo quien armó el hogar puede cambiar el código.'; end if;
  update public.hogares h set codigo = case when coalesce(p_apagar, false) then null else public.hogar_codigo_nuevo() end
  where h.id = v_hogar returning h.codigo into v_codigo;
  return v_codigo;
end $$;

create function public.renombrar_hogar(p_nombre text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_nombre text := btrim(coalesce(p_nombre, ''));
  v_hogar uuid;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  select m.hogar_id into v_hogar from public.hogar_miembros m where m.user_id = v_uid and m.rol = 'creador';
  if not found then raise exception 'Solo quien armó el hogar puede cambiarle el nombre.'; end if;
  if char_length(v_nombre) not between 1 and 40 then raise exception 'El nombre del hogar tiene que tener entre 1 y 40 letras.'; end if;
  update public.hogares h set nombre = v_nombre where h.id = v_hogar;
end $$;

revoke all on function public.mi_hogar() from public, anon;
revoke all on function public.crear_hogar(text) from public, anon;
revoke all on function public.unirse_al_hogar(text) from public, anon;
revoke all on function public.salir_del_hogar() from public, anon;
revoke all on function public.sacar_del_hogar(uuid) from public, anon;
revoke all on function public.renovar_codigo(boolean) from public, anon;
revoke all on function public.renombrar_hogar(text) from public, anon;
grant execute on function public.mi_hogar() to authenticated;
grant execute on function public.crear_hogar(text) to authenticated;
grant execute on function public.unirse_al_hogar(text) to authenticated;
grant execute on function public.salir_del_hogar() to authenticated;
grant execute on function public.sacar_del_hogar(uuid) to authenticated;
grant execute on function public.renovar_codigo(boolean) to authenticated;
grant execute on function public.renombrar_hogar(text) to authenticated;

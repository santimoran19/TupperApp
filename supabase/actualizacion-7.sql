-- Tupper, actualización 7: operaciones en un solo paso y registro de errores.
-- Solo agrega funciones y dos tablas nuevas: no cambia ni borra nada de lo que ya está cargado.
-- Va ANTES de publicar la versión 1.7 de la app, que usa estas funciones (la versión anterior sigue andando igual
-- con esto aplicado). Se corre una sola vez: Supabase > SQL Editor > pegar el archivo entero > Run.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-7.sql y seed.sql.

-- =====================================================================================
-- 1. Operaciones en un solo paso
-- Cocinar, registrar una comida o comprar tocan varias tablas. Antes la app hacía un pedido por tabla
-- y, si se cortaba en el medio, quedaba a medias. Cada función de acá hace todo junto: o entra todo o nada.
-- Corren con los permisos del usuario (security invoker): las reglas por fila siguen valiendo.
-- El stock se mueve por diferencias ("restá 2") y no pisando el total, así dos teléfonos no se pisan entre sí.
-- Los avisos para la persona ("La cantidad de porciones no es válida.") salen con el código P0001, que es el de
-- los mensajes escritos a mano: así la app los distingue de un error de verdad de la base.
-- =====================================================================================

-- Pedidos ya atendidos. Sumar o restar no se puede repetir sin consecuencias: si la conexión se corta justo después
-- de que la base guardó, la app no se entera y la persona toca de nuevo. Por eso cada operación viaja con una clave;
-- si llega dos veces, la segunda no se aplica. Se guardan una semana.
create table public.operaciones (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  clave uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, clave)
);
alter table public.operaciones enable row level security;
create policy operaciones_propias on public.operaciones for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.operaciones from anon, authenticated;
grant select, insert, delete on public.operaciones to authenticated;

-- Anota la clave del pedido. Devuelve true si ya estaba anotada (o sea, si este pedido ya se había atendido).
create function public.pedido_repetido(p_clave uuid)
returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if p_clave is null or v_uid is null then return false; end if;
  delete from public.operaciones o where o.user_id = v_uid and o.created_at < now() - interval '7 days';
  insert into public.operaciones (user_id, clave) values (v_uid, p_clave) on conflict do nothing;
  return not found;
end $$;

-- Suma o resta cantidades al stock del usuario. Nunca baja de cero.
--   p_cambios: [{ "food_id": "...", "delta": -2 }, ...]
--   p_solo_si_existe: no agrega a la despensa lo que no estaba (se usa al registrar lo que se comió)
create function public.mover_stock(p_cambios jsonb, p_solo_si_existe boolean default false)
returns setof public.stock
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
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
        where s.user_id = v_uid and s.food_id = c.food_id
        returning s.*;
    else
      return query
        insert into public.stock as s (user_id, food_id, qty, updated_at)
        values (v_uid, c.food_id, least(1000000, greatest(0, round(c.delta, 2))), now())
        on conflict (user_id, food_id) do update
        set qty = least(1000000, greatest(0, round(s.qty + c.delta, 2))), updated_at = now()
        returning s.*;
    end if;
  end loop;
end $$;

-- Cocinar: descuenta los ingredientes y suma las porciones como comida lista.
create function public.cocinar(p_receta uuid, p_porciones numeric, p_stock jsonb, p_clave uuid default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
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
  values (v_uid, p_receta, least(1000, round(p_porciones, 1)))
  on conflict (user_id, recipe_id) do update
  set portions = least(1000, greatest(0, round(p.portions + p_porciones, 1)))
  returning p.* into v_preparado;
  return jsonb_build_object('stock', v_stock, 'preparado', to_jsonb(v_preparado));
end $$;

-- Registrar lo que se comió: saca la marca de "no comí" de esa comida, guarda los registros,
-- descuenta el stock y las porciones de comida lista que se usaron.
--   p_filas:     [{ "name", "food_id", "recipe_id", "qty", "kcal", "protein", "carbs", "fat" }, ...]
--   p_stock:     [{ "food_id", "delta" }, ...]      (solo descuenta de lo que hay en la despensa)
--   p_preparado: [{ "recipe_id", "delta" }, ...]
create function public.registrar_comida(p_fecha date, p_comida text, p_filas jsonb, p_stock jsonb default '[]'::jsonb, p_preparado jsonb default '[]'::jsonb, p_clave uuid default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_registros jsonb;
  v_stock jsonb;
  v_preparado jsonb;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if p_filas is null or jsonb_typeof(p_filas) <> 'array' or jsonb_array_length(p_filas) = 0 then
    raise exception 'No hay nada para registrar.';
  end if;
  if jsonb_array_length(p_filas) > 100 then raise exception 'Son demasiadas cosas juntas.'; end if;
  if public.pedido_repetido(p_clave) then return jsonb_build_object('repetida', true); end if;

  delete from public.log_entries l where l.user_id = v_uid and l.date = p_fecha and l.meal = p_comida and l.skipped;

  with nuevas as (
    insert into public.log_entries (user_id, date, meal, name, food_id, recipe_id, qty, kcal, protein, carbs, fat)
    select v_uid, p_fecha, p_comida, f.name, f.food_id, f.recipe_id, f.qty,
           coalesce(f.kcal, 0), coalesce(f.protein, 0), coalesce(f.carbs, 0), coalesce(f.fat, 0)
    from jsonb_to_recordset(p_filas) as f(name text, food_id uuid, recipe_id uuid, qty numeric, kcal numeric, protein numeric, carbs numeric, fat numeric)
    returning *
  )
  select coalesce(jsonb_agg(to_jsonb(n)), '[]'::jsonb) into v_registros from nuevas n;

  select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) into v_stock from public.mover_stock(p_stock, true) s;

  with cambios as (
    select (x->>'recipe_id')::uuid as recipe_id, sum((x->>'delta')::numeric) as delta
    from jsonb_array_elements(case when jsonb_typeof(p_preparado) = 'array' then p_preparado else '[]'::jsonb end) x
    group by 1
  ), tocadas as (
    update public.prepared p
    set portions = least(1000, greatest(0, round(p.portions + c.delta, 1)))
    from cambios c
    where p.user_id = v_uid and p.recipe_id = c.recipe_id and c.delta between -1000 and 1000
    returning p.*
  )
  select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) into v_preparado from tocadas t;

  return jsonb_build_object('registros', v_registros, 'stock', v_stock, 'preparado', v_preparado);
end $$;

-- Comprar: guarda el gasto, suma al stock y saca el producto de la lista de compras.
--   p_anotado: el alimento que figuraba en la lista, cuando se compró un producto que vale por ese
create function public.comprar(p_alimento uuid, p_cantidad numeric, p_precio numeric, p_fecha date, p_anotado uuid default null, p_clave uuid default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_nombre text;
  v_compra public.purchases;
  v_stock jsonb;
  v_lista uuid;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  select f.name into v_nombre from public.foods f where f.id = p_alimento;
  if v_nombre is null then raise exception 'Ese alimento ya no existe.'; end if;
  if public.pedido_repetido(p_clave) then return jsonb_build_object('repetida', true); end if;

  insert into public.purchases (user_id, food_id, name, qty, price, date)
  values (v_uid, p_alimento, v_nombre, p_cantidad, coalesce(p_precio, 0), coalesce(p_fecha, current_date))
  returning * into v_compra;

  select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) into v_stock
  from public.mover_stock(jsonb_build_array(jsonb_build_object('food_id', p_alimento, 'delta', p_cantidad)), false) s;

  delete from public.shopping_items l
  where l.id = (
    select l2.id from public.shopping_items l2
    where l2.user_id = v_uid and l2.food_id in (p_anotado, p_alimento)
    order by (l2.food_id = p_anotado) desc nulls last
    limit 1
  )
  returning l.id into v_lista;

  return jsonb_build_object('compra', to_jsonb(v_compra), 'stock', v_stock, 'lista', v_lista);
end $$;

-- Guardar una receta propia con sus ingredientes. Con p_id la edita (reemplaza los ingredientes); sin p_id la crea.
--   p_datos: { "name", "minutes", "servings", "meal_types": [...], "portable", "steps" }
--   p_items: [{ "food_id", "qty" }, ...]
create function public.guardar_receta(p_id uuid, p_datos jsonb, p_items jsonb)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_receta public.recipes;
  v_items jsonb;
begin
  if v_uid is null then raise exception 'Iniciá sesión para seguir.'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Agregá al menos un ingrediente.';
  end if;
  if jsonb_array_length(p_items) > 60 then raise exception 'Son demasiados ingredientes.'; end if;

  if p_id is null then
    insert into public.recipes (owner, name, minutes, servings, meal_types, portable, steps)
    values (
      v_uid, p_datos->>'name', (p_datos->>'minutes')::int, (p_datos->>'servings')::int,
      array(select jsonb_array_elements_text(p_datos->'meal_types')),
      coalesce((p_datos->>'portable')::boolean, true), coalesce(p_datos->>'steps', '')
    )
    returning * into v_receta;
  else
    update public.recipes r
    set name = p_datos->>'name', minutes = (p_datos->>'minutes')::int, servings = (p_datos->>'servings')::int,
        meal_types = array(select jsonb_array_elements_text(p_datos->'meal_types')),
        portable = coalesce((p_datos->>'portable')::boolean, true), steps = coalesce(p_datos->>'steps', '')
    where r.id = p_id and r.owner = v_uid
    returning r.* into v_receta;
    if not found then raise exception 'Esa receta no se puede editar.'; end if;
    delete from public.recipe_items i where i.recipe_id = p_id;
  end if;

  with nuevos as (
    insert into public.recipe_items (recipe_id, food_id, qty)
    select v_receta.id, (x->>'food_id')::uuid, (x->>'qty')::numeric from jsonb_array_elements(p_items) x
    returning *
  )
  select jsonb_agg(to_jsonb(n)) into v_items from nuevos n;

  return jsonb_build_object('receta', to_jsonb(v_receta), 'items', v_items);
end $$;

revoke all on function public.pedido_repetido(uuid) from public, anon;
revoke all on function public.mover_stock(jsonb, boolean) from public, anon;
revoke all on function public.cocinar(uuid, numeric, jsonb, uuid) from public, anon;
revoke all on function public.registrar_comida(date, text, jsonb, jsonb, jsonb, uuid) from public, anon;
revoke all on function public.comprar(uuid, numeric, numeric, date, uuid, uuid) from public, anon;
revoke all on function public.guardar_receta(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.pedido_repetido(uuid) to authenticated;
grant execute on function public.mover_stock(jsonb, boolean) to authenticated;
grant execute on function public.cocinar(uuid, numeric, jsonb, uuid) to authenticated;
grant execute on function public.registrar_comida(date, text, jsonb, jsonb, jsonb, uuid) to authenticated;
grant execute on function public.comprar(uuid, numeric, numeric, date, uuid, uuid) to authenticated;
grant execute on function public.guardar_receta(uuid, jsonb, jsonb) to authenticated;

-- =====================================================================================
-- 2. Registro de errores y eventos
-- La app anota acá cuando algo falla (o cuando pasa algo que conviene medir, como una búsqueda que no respondió),
-- para enterarse sin depender de que el usuario avise. No guarda nombres de alimentos ni lo que se busca.
-- Cada usuario puede agregar y leer solo lo suyo; nadie puede modificar ni borrar. Se guarda 90 días.
-- Para mirarlo: Supabase > Table Editor > eventos, o
--   select created_at, tipo, nombre, detalle, version, ruta, dispositivo from public.eventos order by created_at desc limit 100;
-- =====================================================================================
create table public.eventos (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  tipo text not null check (tipo in ('error', 'evento')),
  nombre text not null check (char_length(nombre) between 1 and 60),
  detalle jsonb not null default '{}'::jsonb check (octet_length(detalle::text) <= 4000),
  version text not null default '' check (char_length(version) <= 20),
  ruta text not null default '' check (char_length(ruta) <= 120),
  dispositivo text not null default '' check (char_length(dispositivo) <= 200)
);
create index eventos_user_fecha_idx on public.eventos (user_id, created_at);
create index eventos_fecha_idx on public.eventos (created_at);

alter table public.eventos enable row level security;
create policy eventos_insert on public.eventos for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy eventos_read on public.eventos for select to authenticated
  using (user_id = (select auth.uid()));
revoke all on public.eventos from anon, authenticated;
grant select, insert on public.eventos to authenticated;
revoke all on sequence public.eventos_id_seq from anon, authenticated;

-- Antes de guardar cada evento: tope de 300 por usuario por día (lo que sobra se descarta sin error)
-- y limpieza de todo lo que tenga más de 90 días. Los eventos comunes cortan en 200, así siempre
-- queda lugar para anotar errores aunque ese día se hayan hecho muchas búsquedas.
create function public.eventos_antes() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_total int;
  v_comunes int;
begin
  -- Si no es de quien lo manda no hay nada que contar: lo rechaza la regla por fila
  if new.user_id is distinct from (select auth.uid()) then return new; end if;
  -- De a un pedido por usuario, para que varios a la vez no se pasen del tope
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  select count(*), count(*) filter (where e.tipo = 'evento') into v_total, v_comunes
  from public.eventos e
  where e.user_id = new.user_id and e.created_at > now() - interval '1 day';
  if v_total >= 300 or (new.tipo = 'evento' and v_comunes >= 200) then
    return null;
  end if;
  delete from public.eventos e where e.created_at < now() - interval '90 days';
  new.created_at := now();
  return new;
end $$;
revoke all on function public.eventos_antes() from public, anon, authenticated;
create trigger eventos_antes before insert on public.eventos
  for each row execute function public.eventos_antes();

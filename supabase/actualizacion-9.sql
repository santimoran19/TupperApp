-- Tupper, actualización 9: ver y editar lo que anotaste, con la despensa al día.
-- Agrega una columna a los registros (cuánto descontó cada uno de la despensa), cambia `registrar_comida` para que la
-- llene y suma dos funciones: `editar_registro` y `borrar_registro`. No borra ni cambia ningún dato que ya esté cargado.
-- Va ANTES de publicar la versión 1.10 de la app. Las versiones anteriores siguen andando igual con esto aplicado.
-- Se corre una sola vez: Supabase > SQL Editor > pegar el archivo entero > Run.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-9.sql y seed.sql.

-- =====================================================================================
-- 1. Cuánto descontó cada registro
-- Para poder devolver a la despensa lo que se descontó (al borrar o al bajar una cantidad) hay que saber cuánto fue de
-- verdad: si faltaba stock, se descontó menos de lo pedido. Queda anotado en cada registro, por producto:
--   q: lo que se descontó de verdad   n: lo que hacía falta descontar (n >= q; si faltó stock, n > q)
--   { "s": [ { "f": <alimento>, "q": <cantidad>, "n": <cantidad> }, ... ], "p": <porciones de comida lista>, "pn": <idem, lo que hacía falta> }
-- Saber lo que hacía falta permite corregir un error: si se anotan 20 huevos con 8 en la despensa y después se vuelve a 4,
-- los 4 se descuentan completos. Los registros anteriores a esta versión llevan null ("no se sabe"): al editarlos se
-- corrige solo el diario.
-- =====================================================================================
alter table public.log_entries add column descontado jsonb;

alter table public.log_entries
  add constraint log_entries_descontado_chk check (
    descontado is null or (
      jsonb_typeof(descontado) = 'object'
      and descontado ? 's' and jsonb_typeof(descontado -> 's') = 'array' and jsonb_array_length(descontado -> 's') <= 40
      and octet_length(descontado::text) <= 3600
    )
  );

-- El tope de peso por fila (actualizacion-8.sql, 600 bytes) pasa a contar todo menos esta anotación, que tiene su
-- propio tope de arriba (3.600). Una fila común sigue pesando unos 200.
alter table public.log_entries drop constraint log_entries_peso_fila_chk;
alter table public.log_entries
  add constraint log_entries_peso_fila_chk check (pg_column_size(log_entries.*) - coalesce(pg_column_size(log_entries.descontado), 0) <= 600);

-- =====================================================================================
-- 2. Registrar una comida (reemplaza la de actualizacion-7.sql; los parámetros son los mismos)
-- Ahora cada fila puede traer lo que quiere descontar: "s" (alimentos) y "p" (porciones de comida lista).
-- La función descuenta fila por fila, solo de lo que hay en la despensa, y anota en el registro lo que descontó de verdad.
-- Si las filas no traen "s" ni "p" (una versión anterior de la app), se hace como antes con p_stock y p_preparado.
--   p_filas: [{ "name", "food_id", "recipe_id", "qty", "kcal", "protein", "carbs", "fat", "s": [{ "f", "q" }], "p" }, ...]
-- =====================================================================================
create or replace function public.registrar_comida(p_fecha date, p_comida text, p_filas jsonb, p_stock jsonb default '[]'::jsonb, p_preparado jsonb default '[]'::jsonb, p_clave uuid default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
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
  where s.user_id = v_uid
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
      select s.qty into v_hay from public.stock s where s.user_id = v_uid and s.food_id = it.food_id;
      if not found then continue; end if; -- no está en la despensa: no hay de dónde descontar
      v_toma := round(least(it.q, v_hay), 2);
      if v_toma > 0 then
        update public.stock s set qty = greatest(0, round(s.qty - v_toma, 2)), updated_at = now()
        where s.user_id = v_uid and s.food_id = it.food_id;
        v_comidos := v_comidos || it.food_id;
      end if;
      v_s := v_s || jsonb_build_object('f', it.food_id, 'q', v_toma, 'n', round(it.q, 2));
    end loop;

    v_p := 0;
    v_pn := 0;
    if f.p is not null and f.recipe_id is not null and f.p between 0.05 and 1000 then
      select p.portions into v_hay from public.prepared p where p.user_id = v_uid and p.recipe_id = f.recipe_id for update;
      if found then
        v_p := round(least(f.p, v_hay), 1);
        v_pn := round(f.p, 1);
        if v_p > 0 then
          update public.prepared p set portions = greatest(0, round(p.portions - v_p, 1))
          where p.user_id = v_uid and p.recipe_id = f.recipe_id;
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
  v_stock := v_stock || coalesce((select jsonb_agg(to_jsonb(s)) from public.stock s where s.user_id = v_uid and s.food_id = any(v_comidos)), '[]'::jsonb);

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
  v_preparado := v_preparado || coalesce((select jsonb_agg(to_jsonb(p)) from public.prepared p where p.user_id = v_uid and p.recipe_id = any(v_recetas)), '[]'::jsonb);

  return jsonb_build_object('registros', v_registros, 'stock', v_stock, 'preparado', v_preparado);
end $$;

-- =====================================================================================
-- 3. Cambiar la cantidad de un registro
-- Recalcula calorías y macros en proporción y ajusta la despensa por la diferencia:
--   - Si ahora hace falta más de lo que ya se descontó, se descuenta de lo que haya; si no alcanza, queda en cero y se avisa
--     en "faltan".
--   - Si hace falta menos de lo que se descontó, la diferencia vuelve a la despensa.
--   - Si el producto ya no está en la despensa, solo se corrige el diario y se avisa en "ausentes".
--   - Si el registro es anterior a esta versión (descontado null), solo se corrige el diario: "sin_datos".
-- Pedir dos veces la misma cantidad da lo mismo que pedirla una: no necesita clave.
-- Devuelve { registro, stock, preparado, avisos: { sin_datos, faltan: [{ f, falta }], ausentes: [uuid], porciones_faltan, porciones_ausentes } }
-- =====================================================================================
create function public.editar_registro(p_id uuid, p_qty numeric)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
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
    where s.user_id = v_uid and s.food_id in (select (e ->> 'f')::uuid from jsonb_array_elements(r.descontado -> 's') e)
    order by s.food_id for update;

    for it in
      select (e ->> 'f')::uuid as food_id, (e ->> 'q')::numeric as q, coalesce((e ->> 'n')::numeric, (e ->> 'q')::numeric) as n
      from jsonb_array_elements(r.descontado -> 's') e order by 1
    loop
      v_objetivo := round(it.n * v_razon, 2); -- lo que hace falta descontar con la cantidad nueva
      v_hecho := it.q;                        -- lo que va a quedar descontado de verdad
      if v_objetivo > it.q then
        v_dif := v_objetivo - it.q;
        select s.qty into v_hay from public.stock s where s.user_id = v_uid and s.food_id = it.food_id;
        if not found then
          v_ausentes := v_ausentes || to_jsonb(it.food_id);
        else
          v_toma := round(least(v_dif, v_hay), 2);
          if v_toma > 0 then
            update public.stock s set qty = greatest(0, round(s.qty - v_toma, 2)), updated_at = now()
            where s.user_id = v_uid and s.food_id = it.food_id;
            v_tocados := v_tocados || it.food_id;
          end if;
          if v_toma < v_dif then v_faltan := v_faltan || jsonb_build_object('f', it.food_id, 'falta', v_dif - v_toma); end if;
          v_hecho := it.q + v_toma;
        end if;
      elsif v_objetivo < it.q then
        update public.stock s set qty = least(1000000, round(s.qty + (it.q - v_objetivo), 2)), updated_at = now()
        where s.user_id = v_uid and s.food_id = it.food_id;
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
        select p.portions into v_hay from public.prepared p where p.user_id = v_uid and p.recipe_id = r.recipe_id for update;
        if not found then
          v_p_ausentes := true;
        else
          v_toma := round(least(v_dif, v_hay), 1);
          if v_toma > 0 then
            update public.prepared p set portions = greatest(0, round(p.portions - v_toma, 1)) where p.user_id = v_uid and p.recipe_id = r.recipe_id;
            v_receta := array[r.recipe_id];
          end if;
          if v_toma < v_dif then v_p_faltan := v_dif - v_toma; end if;
          v_p1 := v_p0 + v_toma;
        end if;
      elsif v_objetivo < v_p0 then
        update public.prepared p set portions = least(1000, round(p.portions + (v_p0 - v_objetivo), 1)) where p.user_id = v_uid and p.recipe_id = r.recipe_id;
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
    'stock', coalesce((select jsonb_agg(to_jsonb(s)) from public.stock s where s.user_id = v_uid and s.food_id = any(v_tocados)), '[]'::jsonb),
    'preparado', coalesce((select jsonb_agg(to_jsonb(p)) from public.prepared p where p.user_id = v_uid and p.recipe_id = any(v_receta)), '[]'::jsonb),
    'avisos', jsonb_build_object('sin_datos', v_sin, 'faltan', v_faltan, 'ausentes', v_ausentes,
                                 'porciones_faltan', v_p_faltan, 'porciones_ausentes', v_p_ausentes)
  );
end $$;

-- =====================================================================================
-- 4. Borrar un registro
-- Borra la anotación y devuelve a la despensa todo lo que había descontado. Lo que ya no esté en la despensa no se
-- vuelve a agregar: se avisa en "ausentes". Si el registro ya no existe (el pedido llegó dos veces), no hace nada.
-- Devuelve { id, stock, preparado, avisos: { ausentes: [uuid], porciones_ausentes } }
-- =====================================================================================
create function public.borrar_registro(p_id uuid)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
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
    where s.user_id = v_uid and s.food_id in (select (e ->> 'f')::uuid from jsonb_array_elements(r.descontado -> 's') e)
    order by s.food_id for update;
    for it in
      select (e ->> 'f')::uuid as food_id, (e ->> 'q')::numeric as q
      from jsonb_array_elements(r.descontado -> 's') e order by 1
    loop
      if not (it.q > 0 and it.q <= 1000000) then continue; end if;
      update public.stock s set qty = least(1000000, round(s.qty + it.q, 2)), updated_at = now()
      where s.user_id = v_uid and s.food_id = it.food_id;
      if found then v_tocados := v_tocados || it.food_id; else v_ausentes := v_ausentes || to_jsonb(it.food_id); end if;
    end loop;
    v_p := coalesce((r.descontado ->> 'p')::numeric, 0);
    if v_p > 0 and v_p <= 1000 and r.recipe_id is not null then
      update public.prepared p set portions = least(1000, round(p.portions + v_p, 1)) where p.user_id = v_uid and p.recipe_id = r.recipe_id;
      if found then v_receta := array[r.recipe_id]; else v_p_ausentes := true; end if;
    end if;
  end if;

  delete from public.log_entries l where l.id = p_id and l.user_id = v_uid;

  return jsonb_build_object(
    'id', p_id,
    'stock', coalesce((select jsonb_agg(to_jsonb(s)) from public.stock s where s.user_id = v_uid and s.food_id = any(v_tocados)), '[]'::jsonb),
    'preparado', coalesce((select jsonb_agg(to_jsonb(p)) from public.prepared p where p.user_id = v_uid and p.recipe_id = any(v_receta)), '[]'::jsonb),
    'avisos', jsonb_build_object('ausentes', v_ausentes, 'porciones_ausentes', v_p_ausentes)
  );
end $$;

revoke all on function public.editar_registro(uuid, numeric) from public, anon;
revoke all on function public.borrar_registro(uuid) from public, anon;
grant execute on function public.editar_registro(uuid, numeric) to authenticated;
grant execute on function public.borrar_registro(uuid) to authenticated;

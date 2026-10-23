-- Tupper, actualización 19: vencimientos en la despensa (F-04), fotos de alimentos y recetas y músculos de cada
-- entrenamiento (versión 1.24.0).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-18.sql y ANTES de publicar la versión 1.24.0 de la app. La versión 1.23 sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-19.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra ningún dato que ya esté cargado: agrega columnas vacías, reglas, un disparador, el lugar donde
-- se guardan las fotos y repone tres funciones: las dos de los hogares (para que también copien la fecha de vencimiento) y la
-- de guardar un entrenamiento (para que guarde los músculos).
--
-- 1. Vencimientos: cada alimento de la despensa puede tener la fecha en que vence lo que vence primero (`stock.expires_on`).
--    Cuando se agota (cantidad 0) la fecha se borra sola: lo que se compre después trae su propia fecha.
-- 2. Fotos: `foods.image_path` y `recipes.image_path` dicen dónde está la foto, dentro del lugar "fotos" de Supabase Storage:
--      base/<slug>.webp            las de los alimentos y recetas de la base (las genera scripts/fotos-ia.mjs)
--      u/<id de la persona>/...    las que sube cada persona (solo ella puede subirlas o borrarlas)
--    Las fotos se pueden ver con su dirección, que no se puede adivinar (lleva un código al azar). La Política de privacidad lo dice.
-- 3. Músculos: `workouts.muscles` son los grupos musculares que la persona marcó en un entrenamiento (los mismos de
--    gym_exercises.grupo). Sirven para el mapa de músculos de la semana. Las series de gimnasio ya dicen su músculo solas.

-- ---------- 1. Vencimientos ----------
alter table public.stock add column if not exists expires_on date;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'stock_vence_chk') then
    alter table public.stock add constraint stock_vence_chk check (expires_on is null or expires_on between date '2000-01-01' and date '2100-12-31');
  end if;
end $$;

-- Si se agota, no queda nada que venza
create or replace function public.stock_sin_fecha_si_agotado() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.qty <= 0 then
    new.expires_on := null;
  end if;
  return new;
end $$;

drop trigger if exists stock_sin_fecha_si_agotado on public.stock;
create trigger stock_sin_fecha_si_agotado before insert or update on public.stock
for each row execute function public.stock_sin_fecha_si_agotado();

-- Los hogares (actualizacion-13.sql): las mismas funciones, y ahora también llevan la fecha de vencimiento.
-- Al sumar dos despensas queda la fecha que vence antes.
create or replace function public.hogar_sumar(p_user uuid, p_hogar uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.stock as h (user_id, food_id, qty, expires_on, updated_at)
  select p_hogar, s.food_id, s.qty, s.expires_on, now() from public.stock s where s.user_id = p_user
  on conflict (user_id, food_id) do update
  set qty = least(1000000, round(h.qty + excluded.qty, 2)),
      expires_on = case
        when h.expires_on is null then excluded.expires_on
        when excluded.expires_on is null then h.expires_on
        else least(h.expires_on, excluded.expires_on)
      end,
      updated_at = now();

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

create or replace function public.hogar_llevarse(p_user uuid, p_hogar uuid) returns void
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
  insert into public.stock (user_id, food_id, qty, expires_on, updated_at)
  select p_user, h.food_id, h.qty, h.expires_on, now()
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

revoke all on function public.hogar_sumar(uuid, uuid) from public, anon, authenticated;
revoke all on function public.hogar_llevarse(uuid, uuid) from public, anon, authenticated;
revoke all on function public.stock_sin_fecha_si_agotado() from public, anon, authenticated;

-- ---------- 2. Fotos ----------
alter table public.foods add column if not exists image_path text;
alter table public.recipes add column if not exists image_path text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'foods_foto_chk') then
    alter table public.foods add constraint foods_foto_chk check (
      image_path is null or image_path ~ '^(base/[a-z0-9-]{1,80}|u/[0-9a-f-]{36}/[a-z0-9-]{1,80})\.(webp|jpg)$'
    );
  end if;
  if not exists (select 1 from pg_constraint where conname = 'recipes_foto_chk') then
    alter table public.recipes add constraint recipes_foto_chk check (
      image_path is null or image_path ~ '^(base/[a-z0-9-]{1,80}|u/[0-9a-f-]{36}/[a-z0-9-]{1,80})\.(webp|jpg)$'
    );
  end if;
end $$;

-- El lugar de las fotos en Supabase Storage. Solo si existe Storage (en la base de prueba en memoria no está).
--   público para ver (las direcciones llevan un código al azar), hasta 300 KB por foto, solo WebP o JPEG
--   cada persona sube, cambia y borra solo lo que está en u/<su id>/
do $$
begin
  if to_regclass('storage.buckets') is null then
    return;
  end if;
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('fotos', 'fotos', true, 300000, array['image/webp', 'image/jpeg'])
  on conflict (id) do update
  set public = true, file_size_limit = 300000, allowed_mime_types = array['image/webp', 'image/jpeg'];

  execute 'drop policy if exists fotos_ver_propias on storage.objects';
  execute 'drop policy if exists fotos_subir_propias on storage.objects';
  execute 'drop policy if exists fotos_cambiar_propias on storage.objects';
  execute 'drop policy if exists fotos_borrar_propias on storage.objects';
  execute $p$create policy fotos_ver_propias on storage.objects for select to authenticated
    using (bucket_id = 'fotos' and (storage.foldername(name))[1] = 'u' and (storage.foldername(name))[2] = (select auth.uid())::text)$p$;
  execute $p$create policy fotos_subir_propias on storage.objects for insert to authenticated
    with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = 'u' and (storage.foldername(name))[2] = (select auth.uid())::text)$p$;
  execute $p$create policy fotos_cambiar_propias on storage.objects for update to authenticated
    using (bucket_id = 'fotos' and (storage.foldername(name))[1] = 'u' and (storage.foldername(name))[2] = (select auth.uid())::text)$p$;
  execute $p$create policy fotos_borrar_propias on storage.objects for delete to authenticated
    using (bucket_id = 'fotos' and (storage.foldername(name))[1] = 'u' and (storage.foldername(name))[2] = (select auth.uid())::text)$p$;
end $$;

-- ---------- 3. Músculos de cada entrenamiento ----------
alter table public.workouts add column if not exists muscles text[] not null default '{}';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'workouts_musculos_chk') then
    alter table public.workouts add constraint workouts_musculos_chk check (
      cardinality(muscles) <= 12
      and muscles <@ array['pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'antebrazos', 'abdomen', 'cuadriceps', 'isquios',
                           'gluteos', 'pantorrillas', 'cuerpo_completo']::text[]
    );
  end if;
end $$;

-- Guardar una sesión: igual que en actualizacion-18.sql, y además guarda `muscles` (p_datos -> 'muscles', una lista).
-- Si el pedido no trae `muscles` (una versión vieja de la app), al corregir quedan los que había.
create or replace function public.guardar_entrenamiento(p_id uuid, p_datos jsonb, p_series jsonb default '[]'::jsonb)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_tipo uuid := nullif(p_datos ->> 'type_id', '')::uuid;
  v_rutina uuid := nullif(p_datos ->> 'routine_id', '')::uuid;
  v_trae_musculos boolean := p_datos ? 'muscles';
  v_musculos text[] := '{}';
  v_fila public.workouts;
  v_series jsonb;
begin
  if v_uid is null then
    raise exception 'Tenés que iniciar sesión.' using errcode = 'P0001';
  end if;
  if p_id is null or p_datos is null or jsonb_typeof(p_datos) <> 'object' then
    raise exception 'Los datos del entrenamiento no son válidos.' using errcode = 'P0001';
  end if;
  if p_series is null or jsonb_typeof(p_series) <> 'array' or jsonb_array_length(p_series) > 500 then
    raise exception 'Las series no son válidas (hasta 500 por sesión).' using errcode = 'P0001';
  end if;
  if v_trae_musculos then
    if jsonb_typeof(p_datos -> 'muscles') <> 'array' then
      raise exception 'Los músculos no son válidos.' using errcode = 'P0001';
    end if;
    select coalesce(array_agg(distinct x), '{}') into v_musculos from jsonb_array_elements_text(p_datos -> 'muscles') as x;
  end if;
  if not exists (select 1 from public.profiles p where p.id = v_uid and p.gasto_activo) then
    raise exception 'Para anotar ejercicio primero activá el cálculo de gasto en tu perfil.' using errcode = 'P0001';
  end if;
  -- Si la actividad o la rutina ya no existen (borradas desde otro dispositivo), la sesión se guarda igual sin ese vínculo
  if v_tipo is not null and not exists (
    select 1 from public.exercise_types t where t.id = v_tipo and (t.owner is null or t.owner = v_uid)
  ) then
    v_tipo := null;
  end if;
  if v_rutina is not null and not exists (select 1 from public.routines r where r.id = v_rutina and r.user_id = v_uid) then
    v_rutina := null;
  end if;

  insert into public.workouts as w (id, user_id, fecha, type_id, name, duration_min, distance_km, ascent_m, avg_hr, rpe,
                                    kcal_watch, watch_activas, kcal, metodo, peso_kg, notes, routine_id, muscles)
  values (
    p_id, v_uid, (p_datos ->> 'fecha')::date, v_tipo, btrim(p_datos ->> 'name'), (p_datos ->> 'duration_min')::int,
    nullif(p_datos ->> 'distance_km', '')::numeric, nullif(p_datos ->> 'ascent_m', '')::numeric,
    nullif(p_datos ->> 'avg_hr', '')::int, nullif(p_datos ->> 'rpe', '')::int, nullif(p_datos ->> 'kcal_watch', '')::int,
    coalesce(nullif(p_datos ->> 'watch_activas', '')::boolean, false), (p_datos ->> 'kcal')::numeric, coalesce(nullif(p_datos ->> 'metodo', ''), 'mets'),
    nullif(p_datos ->> 'peso_kg', '')::numeric, nullif(btrim(p_datos ->> 'notes'), ''), v_rutina, v_musculos
  )
  on conflict (id) do update set
    fecha = excluded.fecha, type_id = excluded.type_id, name = excluded.name, duration_min = excluded.duration_min,
    distance_km = excluded.distance_km, ascent_m = excluded.ascent_m, avg_hr = excluded.avg_hr, rpe = excluded.rpe,
    kcal_watch = excluded.kcal_watch, watch_activas = excluded.watch_activas, kcal = excluded.kcal, metodo = excluded.metodo, peso_kg = excluded.peso_kg,
    notes = excluded.notes, routine_id = excluded.routine_id,
    muscles = case when v_trae_musculos then excluded.muscles else w.muscles end
  where w.user_id = v_uid
  returning * into v_fila;

  if v_fila.id is null then
    raise exception 'Ese entrenamiento no se puede editar.' using errcode = 'P0001';
  end if;

  -- Las series se reemplazan por las que llegan
  delete from public.workout_sets s where s.workout_id = p_id and s.user_id = v_uid;
  if jsonb_array_length(p_series) > 0 then
    if exists (
      select 1 from jsonb_to_recordset(p_series) as x(exercise_id uuid)
      where not exists (select 1 from public.gym_exercises e where e.id = x.exercise_id and (e.owner is null or e.owner = v_uid))
    ) then
      raise exception 'Hay un ejercicio que ya no existe.' using errcode = 'P0001';
    end if;
    insert into public.workout_sets (user_id, workout_id, fecha, orden, exercise_id, set_no, reps, weight_kg, rpe, warmup)
    select v_uid, p_id, v_fila.fecha, x.orden, x.exercise_id, x.set_no, x.reps, coalesce(x.weight_kg, 0), x.rpe,
           coalesce(x.warmup, false)
    from jsonb_to_recordset(p_series) as x(orden int, exercise_id uuid, set_no int, reps int, weight_kg numeric, rpe numeric, warmup boolean);
  end if;

  select coalesce(jsonb_agg(to_jsonb(s) order by s.orden, s.set_no), '[]'::jsonb) into v_series
  from public.workout_sets s where s.workout_id = p_id;
  return jsonb_build_object('entrenamiento', to_jsonb(v_fila), 'series', v_series);
end $$;

revoke all on function public.guardar_entrenamiento(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.guardar_entrenamiento(uuid, jsonb, jsonb) to authenticated;

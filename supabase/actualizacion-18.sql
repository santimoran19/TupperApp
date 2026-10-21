-- Tupper, actualización 18: calorías del reloj, activas o totales (F-19, ajuste de la versión 1.23.1).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va DESPUÉS de actualizacion-17.sql y ANTES de publicar la versión 1.23.1 de la app. La versión 1.23.0 sigue andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-18.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra ningún dato que ya esté cargado: agrega una columna con un valor por defecto y repone una función.
--
-- Qué hay: los relojes y pulseras muestran dos números distintos, las calorías TOTALES (incluyen lo que el cuerpo gasta en reposo)
-- y las ACTIVAS (solo lo que se gastó moviéndose). La app resta el gasto en reposo de esos minutos para no contarlo dos veces, pero
-- solo a las totales: a las activas no hay que restarles nada. `watch_activas` guarda cuál de las dos cargó la persona. Todo lo que
-- ya estaba cargado quedó como totales (así lo trataba la versión 1.23.0), así que sigue igual.

alter table public.workouts add column if not exists watch_activas boolean not null default false;

-- Guardar una sesión: igual que en actualizacion-17.sql, y además guarda `watch_activas` (p_datos ->> 'watch_activas')
create or replace function public.guardar_entrenamiento(p_id uuid, p_datos jsonb, p_series jsonb default '[]'::jsonb)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_tipo uuid := nullif(p_datos ->> 'type_id', '')::uuid;
  v_rutina uuid := nullif(p_datos ->> 'routine_id', '')::uuid;
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
                                    kcal_watch, watch_activas, kcal, metodo, peso_kg, notes, routine_id)
  values (
    p_id, v_uid, (p_datos ->> 'fecha')::date, v_tipo, btrim(p_datos ->> 'name'), (p_datos ->> 'duration_min')::int,
    nullif(p_datos ->> 'distance_km', '')::numeric, nullif(p_datos ->> 'ascent_m', '')::numeric,
    nullif(p_datos ->> 'avg_hr', '')::int, nullif(p_datos ->> 'rpe', '')::int, nullif(p_datos ->> 'kcal_watch', '')::int,
    coalesce(nullif(p_datos ->> 'watch_activas', '')::boolean, false), (p_datos ->> 'kcal')::numeric, coalesce(nullif(p_datos ->> 'metodo', ''), 'mets'),
    nullif(p_datos ->> 'peso_kg', '')::numeric, nullif(btrim(p_datos ->> 'notes'), ''), v_rutina
  )
  on conflict (id) do update set
    fecha = excluded.fecha, type_id = excluded.type_id, name = excluded.name, duration_min = excluded.duration_min,
    distance_km = excluded.distance_km, ascent_m = excluded.ascent_m, avg_hr = excluded.avg_hr, rpe = excluded.rpe,
    kcal_watch = excluded.kcal_watch, watch_activas = excluded.watch_activas, kcal = excluded.kcal, metodo = excluded.metodo, peso_kg = excluded.peso_kg,
    notes = excluded.notes, routine_id = excluded.routine_id
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

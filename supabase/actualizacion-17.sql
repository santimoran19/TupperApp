-- Tupper, actualización 17: gimnasio (F-19, fase 3).
-- Corré este archivo entero en el SQL Editor de Supabase y después seed-7.sql (el catálogo de ejercicios).
-- Va DESPUÉS de actualizacion-16.sql y ANTES de publicar la versión 1.23 de la app. Las versiones anteriores siguen andando igual.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-18.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra ningún dato que ya esté cargado: agrega cuatro tablas, una columna vacía en `workouts` y
-- reemplaza `guardar_entrenamiento` (de actualizacion-16.sql) por una versión que además guarda las series.
--
-- Qué hay:
--   gym_exercises       el catálogo de ejercicios (sentadilla, press de banca...) con grupo muscular y equipo. Los que no tienen dueño
--                       los ven todas las personas (seed-7.sql); los propios, solo quien los creó.
--   routines            las rutinas de cada persona (Día A, Día B...) y routine_exercises, los ejercicios de cada una.
--   workout_sets        las series de cada sesión: ejercicio, repeticiones, peso, esfuerzo y si fue de calentamiento.
-- Una sesión de gimnasio es un entrenamiento (`workouts`) más sus series. Todo es personal: no se comparte con el hogar.
-- No se puede borrar un ejercicio propio que ya tiene series cargadas (para no perder el historial).

-- =====================================================================================
-- 1. Catálogo de ejercicios
-- =====================================================================================
create table public.gym_exercises (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users on delete cascade,
  slug text unique,
  name text not null,
  grupo text not null,
  equipo text not null default 'otro',
  peso_corporal boolean not null default false,
  created_at timestamptz not null default now(),
  constraint gym_exercises_nombre_chk check (char_length(btrim(name)) between 1 and 60),
  constraint gym_exercises_grupo_chk check (
    grupo in ('pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'antebrazos', 'abdomen', 'cuadriceps', 'isquios', 'gluteos',
              'pantorrillas', 'cuerpo_completo')
  ),
  constraint gym_exercises_equipo_chk check (
    equipo in ('barra', 'mancuernas', 'maquina', 'polea', 'peso_corporal', 'kettlebell', 'banda', 'otro')
  ),
  constraint gym_exercises_slug_chk check (slug is null or (owner is null and char_length(slug) <= 60)),
  constraint gym_exercises_peso_fila_chk check (pg_column_size(gym_exercises.*) <= 400)
);
create index gym_exercises_owner_idx on public.gym_exercises (owner);

alter table public.gym_exercises enable row level security;
create policy gym_exercises_read on public.gym_exercises for select to authenticated
  using (owner is null or owner = (select auth.uid()));
create policy gym_exercises_insert on public.gym_exercises for insert to authenticated
  with check (owner = (select auth.uid()));
create policy gym_exercises_update on public.gym_exercises for update to authenticated
  using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
create policy gym_exercises_delete on public.gym_exercises for delete to authenticated
  using (owner = (select auth.uid()));

create trigger tope_de_filas after insert on public.gym_exercises referencing new table as nuevas
  for each statement execute function public.tope_de_filas('owner', '300', 'ejercicios propios');

-- =====================================================================================
-- 2. Rutinas
-- =====================================================================================
create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint routines_nombre_chk check (char_length(btrim(name)) between 1 and 40),
  constraint routines_notas_chk check (notes is null or char_length(notes) <= 200),
  constraint routines_peso_fila_chk check (pg_column_size(routines.*) <= 500)
);
create index routines_user_idx on public.routines (user_id, created_at);

create table public.routine_exercises (
  routine_id uuid not null references public.routines on delete cascade,
  position int not null,
  exercise_id uuid not null references public.gym_exercises on delete cascade,
  sets_target int not null default 3,
  reps_min int not null default 8,
  reps_max int not null default 12,
  rest_seconds int,
  primary key (routine_id, position),
  constraint routine_exercises_posicion_chk check (position between 0 and 99),
  constraint routine_exercises_series_chk check (sets_target between 1 and 20),
  constraint routine_exercises_reps_chk check (reps_min between 1 and 100 and reps_max between 1 and 100 and reps_min <= reps_max),
  constraint routine_exercises_descanso_chk check (rest_seconds is null or rest_seconds between 0 and 1200),
  constraint routine_exercises_peso_fila_chk check (pg_column_size(routine_exercises.*) <= 200)
);
create index routine_exercises_exercise_idx on public.routine_exercises (exercise_id);

alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
create policy routines_own on public.routines for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy routine_exercises_own on public.routine_exercises for all to authenticated
  using (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = (select auth.uid())))
  with check (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = (select auth.uid())));

create trigger tope_de_filas after insert on public.routines referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '50', 'rutinas');
create trigger tope_de_filas after insert on public.routine_exercises referencing new table as nuevas
  for each statement execute function public.tope_de_filas('routine_id', '40', 'ejercicios por rutina');

-- La sesión puede venir de una rutina (si se borra la rutina, la sesión se queda)
alter table public.workouts add column routine_id uuid references public.routines on delete set null;
create index workouts_routine_idx on public.workouts (routine_id);

-- =====================================================================================
-- 3. Series
-- `fecha` repite la del entrenamiento para poder pedir el historial de un ejercicio sin juntar tablas.
-- `weight_kg` es el peso de la barra o las mancuernas; en los ejercicios con el peso del cuerpo, la carga EXTRA (0 si no hay).
-- `rpe` es el esfuerzo de 1 a 10 (de a medio punto): 10 es no poder hacer ni una repetición más.
-- =====================================================================================
create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  workout_id uuid not null references public.workouts on delete cascade,
  fecha date not null,
  orden int not null,
  exercise_id uuid not null references public.gym_exercises,
  set_no int not null,
  reps int not null,
  weight_kg numeric not null default 0,
  rpe numeric,
  warmup boolean not null default false,
  constraint workout_sets_orden_chk check (orden between 0 and 99 and set_no between 1 and 99),
  constraint workout_sets_reps_chk check (reps between 0 and 1000),
  constraint workout_sets_peso_chk check (weight_kg between 0 and 1000 and scale(weight_kg) <= 3),
  constraint workout_sets_esfuerzo_chk check (rpe is null or (rpe between 1 and 10 and scale(rpe) <= 1)),
  constraint workout_sets_unica_chk unique (workout_id, orden, set_no),
  constraint workout_sets_peso_fila_chk check (pg_column_size(workout_sets.*) <= 300)
);
create index workout_sets_user_ejercicio_idx on public.workout_sets (user_id, exercise_id, fecha);
create index workout_sets_user_fecha_idx on public.workout_sets (user_id, fecha);
create index workout_sets_exercise_idx on public.workout_sets (exercise_id);

alter table public.workout_sets enable row level security;
create policy workout_sets_own on public.workout_sets for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create trigger tope_de_filas after insert on public.workout_sets referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '150000', 'series');

-- =====================================================================================
-- 4. Guardar una sesión (reemplaza la de actualizacion-16.sql: ahora también guarda las series)
-- Todo junto o nada. Si el entrenamiento ya existía, sus series se reemplazan por las que llegan (mandarlo dos veces da lo mismo).
--   p_datos:  igual que antes, más { routine_id }
--   p_series: [{ orden, exercise_id, set_no, reps, weight_kg, rpe, warmup }, ...]  (hasta 500)
-- =====================================================================================
drop function public.guardar_entrenamiento(uuid, jsonb);
create function public.guardar_entrenamiento(p_id uuid, p_datos jsonb, p_series jsonb default '[]'::jsonb)
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
                                    kcal_watch, kcal, metodo, peso_kg, notes, routine_id)
  values (
    p_id, v_uid, (p_datos ->> 'fecha')::date, v_tipo, btrim(p_datos ->> 'name'), (p_datos ->> 'duration_min')::int,
    nullif(p_datos ->> 'distance_km', '')::numeric, nullif(p_datos ->> 'ascent_m', '')::numeric,
    nullif(p_datos ->> 'avg_hr', '')::int, nullif(p_datos ->> 'rpe', '')::int, nullif(p_datos ->> 'kcal_watch', '')::int,
    (p_datos ->> 'kcal')::numeric, coalesce(nullif(p_datos ->> 'metodo', ''), 'mets'),
    nullif(p_datos ->> 'peso_kg', '')::numeric, nullif(btrim(p_datos ->> 'notes'), ''), v_rutina
  )
  on conflict (id) do update set
    fecha = excluded.fecha, type_id = excluded.type_id, name = excluded.name, duration_min = excluded.duration_min,
    distance_km = excluded.distance_km, ascent_m = excluded.ascent_m, avg_hr = excluded.avg_hr, rpe = excluded.rpe,
    kcal_watch = excluded.kcal_watch, kcal = excluded.kcal, metodo = excluded.metodo, peso_kg = excluded.peso_kg,
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

-- =====================================================================================
-- 5. Guardar una rutina
-- Crea la rutina o, si ya existía con ese identificador, la pisa junto con sus ejercicios. Todo junto o nada.
--   p_ejercicios: [{ exercise_id, sets_target, reps_min, reps_max, rest_seconds }, ...]  (en el orden en que se hacen)
-- =====================================================================================
create function public.guardar_rutina(p_id uuid, p_nombre text, p_ejercicios jsonb, p_notas text default null)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_rutina public.routines;
  v_filas jsonb;
begin
  if v_uid is null then
    raise exception 'Tenés que iniciar sesión.' using errcode = 'P0001';
  end if;
  if p_id is null or p_ejercicios is null or jsonb_typeof(p_ejercicios) <> 'array' or jsonb_array_length(p_ejercicios) > 40 then
    raise exception 'La rutina no es válida (hasta 40 ejercicios).' using errcode = 'P0001';
  end if;
  if char_length(btrim(coalesce(p_nombre, ''))) not between 1 and 40 then
    raise exception 'El nombre de la rutina tiene que tener entre 1 y 40 letras.' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from jsonb_to_recordset(p_ejercicios) as x(exercise_id uuid)
    where not exists (select 1 from public.gym_exercises e where e.id = x.exercise_id and (e.owner is null or e.owner = v_uid))
  ) then
    raise exception 'Hay un ejercicio que ya no existe.' using errcode = 'P0001';
  end if;

  insert into public.routines as r (id, user_id, name, notes)
  values (p_id, v_uid, btrim(p_nombre), nullif(btrim(p_notas), ''))
  on conflict (id) do update set name = excluded.name, notes = excluded.notes
  where r.user_id = v_uid
  returning * into v_rutina;
  if v_rutina.id is null then
    raise exception 'Esa rutina no se puede editar.' using errcode = 'P0001';
  end if;

  delete from public.routine_exercises where routine_id = p_id;
  insert into public.routine_exercises (routine_id, position, exercise_id, sets_target, reps_min, reps_max, rest_seconds)
  select p_id, (x.n - 1)::int, (x.obj ->> 'exercise_id')::uuid, coalesce((x.obj ->> 'sets_target')::int, 3),
         coalesce((x.obj ->> 'reps_min')::int, 8), coalesce((x.obj ->> 'reps_max')::int, 12),
         nullif(x.obj ->> 'rest_seconds', '')::int
  from jsonb_array_elements(p_ejercicios) with ordinality as x(obj, n);

  select coalesce(jsonb_agg(to_jsonb(e) order by e.position), '[]'::jsonb) into v_filas
  from public.routine_exercises e where e.routine_id = p_id;
  return jsonb_build_object('rutina', to_jsonb(v_rutina), 'ejercicios', v_filas);
end $$;

revoke all on function public.guardar_rutina(uuid, text, jsonb, text) from public, anon;
grant execute on function public.guardar_rutina(uuid, text, jsonb, text) to authenticated;

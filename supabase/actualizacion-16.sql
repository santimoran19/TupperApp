-- Tupper, actualización 16: registrar ejercicio (F-19, fase 2).
-- Corré este archivo entero en el SQL Editor de Supabase y después seed-6.sql (el catálogo de actividades).
-- Va DESPUÉS de actualizacion-15.sql y ANTES de publicar la versión 1.23 de la app. Las versiones anteriores siguen andando igual.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-17.sql, seed.sql, seed-6.sql y seed-7.sql.
--
-- NO modifica, mueve ni borra ningún dato que ya esté cargado: agrega dos tablas y dos funciones.
--
-- Qué hay:
--   exercise_types  el catálogo de actividades (correr, pádel, yoga...) con sus METs del Compendio de Actividades Físicas.
--                   Las que no tienen dueño las ven todas las personas (se cargan con seed-6.sql); las propias, solo quien las creó.
--   workouts        cada entrenamiento: fecha, actividad, duración, distancia, desnivel, pulso, esfuerzo y las calorías que
--                   se calcularon (netas: sin el metabolismo basal de esos minutos) con el método usado y el peso de ese día.
-- Los entrenamientos son personales: no se comparten con el hogar ni con nadie. Se borran con la cuenta (en cascada).
-- Guardar un entrenamiento exige tener prendido el cálculo de gasto en el perfil (con el consentimiento de actualizacion-15.sql).

-- =====================================================================================
-- 1. Catálogo de actividades
-- =====================================================================================
create table public.exercise_types (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users on delete cascade,
  slug text unique,
  name text not null,
  category text not null default 'otro',
  metrica text not null default 'general',
  mets_suave numeric not null,
  mets_medio numeric not null,
  mets_fuerte numeric not null,
  usa_distancia boolean not null default false,
  usa_desnivel boolean not null default false,
  created_at timestamptz not null default now(),
  constraint exercise_types_nombre_chk check (char_length(btrim(name)) between 1 and 60),
  constraint exercise_types_categoria_chk check (
    category in ('cardio', 'bici', 'agua', 'pelota', 'raqueta', 'baile', 'mente_cuerpo', 'fuerza', 'combate', 'aire_libre', 'otro')
  ),
  constraint exercise_types_metrica_chk check (metrica in ('correr', 'caminar', 'bici', 'general')),
  constraint exercise_types_mets_chk check (
    mets_suave between 1 and 20 and mets_medio between 1 and 20 and mets_fuerte between 1 and 20
    and mets_suave <= mets_medio and mets_medio <= mets_fuerte
  ),
  constraint exercise_types_decimales_chk check (scale(mets_suave) <= 4 and scale(mets_medio) <= 4 and scale(mets_fuerte) <= 4),
  -- El slug identifica a las actividades base; las de cada persona no llevan (igual que los alimentos)
  constraint exercise_types_slug_chk check (slug is null or (owner is null and char_length(slug) <= 60)),
  constraint exercise_types_peso_fila_chk check (pg_column_size(exercise_types.*) <= 500)
);
create index exercise_types_owner_idx on public.exercise_types (owner);

alter table public.exercise_types enable row level security;
create policy exercise_types_read on public.exercise_types for select to authenticated
  using (owner is null or owner = (select auth.uid()));
create policy exercise_types_insert on public.exercise_types for insert to authenticated
  with check (owner = (select auth.uid()));
create policy exercise_types_update on public.exercise_types for update to authenticated
  using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
create policy exercise_types_delete on public.exercise_types for delete to authenticated
  using (owner = (select auth.uid()));

create trigger tope_de_filas after insert on public.exercise_types referencing new table as nuevas
  for each statement execute function public.tope_de_filas('owner', '100', 'actividades propias');

-- =====================================================================================
-- 2. Entrenamientos
-- `name` guarda el nombre de la actividad al momento de cargarlo: si después se borra o renombra la actividad, el
-- historial no cambia. `kcal` son calorías NETAS; `metodo` dice con qué dato se calcularon:
--   reloj (las que marcó el reloj, cargadas a mano) | pulso (fórmula de Keytel) | distancia (ecuaciones del ACSM) | mets
-- `peso_kg` es el peso con el que se hizo la cuenta, para que el historial no se mueva si después cambia el peso.
-- =====================================================================================
create table public.workouts (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade,
  fecha date not null,
  type_id uuid references public.exercise_types on delete set null,
  name text not null,
  duration_min int not null,
  distance_km numeric,
  ascent_m numeric,
  avg_hr int,
  rpe int,
  kcal_watch int,
  kcal numeric not null,
  metodo text not null default 'mets',
  peso_kg numeric,
  notes text,
  created_at timestamptz not null default now(),
  constraint workouts_fecha_chk check (fecha between date '2020-01-01' and date '2100-01-01'),
  constraint workouts_nombre_chk check (char_length(btrim(name)) between 1 and 60),
  constraint workouts_duracion_chk check (duration_min between 1 and 1440),
  constraint workouts_distancia_chk check (distance_km is null or distance_km between 0 and 1000),
  constraint workouts_desnivel_chk check (ascent_m is null or ascent_m between 0 and 20000),
  constraint workouts_pulso_chk check (avg_hr is null or avg_hr between 30 and 230),
  constraint workouts_esfuerzo_chk check (rpe is null or rpe between 1 and 10),
  constraint workouts_reloj_chk check (kcal_watch is null or kcal_watch between 0 and 10000),
  constraint workouts_kcal_chk check (kcal between 0 and 20000),
  constraint workouts_metodo_chk check (metodo in ('reloj', 'pulso', 'distancia', 'mets')),
  constraint workouts_peso_chk check (peso_kg is null or peso_kg between 20 and 400),
  constraint workouts_notas_chk check (notes is null or char_length(notes) <= 300),
  constraint workouts_decimales_chk check (
    (distance_km is null or scale(distance_km) <= 4) and (ascent_m is null or scale(ascent_m) <= 4)
    and scale(kcal) <= 4 and (peso_kg is null or scale(peso_kg) <= 4)
  ),
  constraint workouts_peso_fila_chk check (pg_column_size(workouts.*) <= 900)
);
create index workouts_user_fecha_idx on public.workouts (user_id, fecha);
create index workouts_type_idx on public.workouts (type_id);

alter table public.workouts enable row level security;
create policy workouts_own on public.workouts for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create trigger tope_de_filas after insert on public.workouts referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '20000', 'entrenamientos');

-- =====================================================================================
-- 3. Guardar un entrenamiento
-- Crea el entrenamiento o, si ya existía con ese identificador, lo pisa (así se puede mandar dos veces sin que cuente doble:
-- la app lo hace con un identificador creado en el teléfono, también sin conexión). Solo se puede pisar uno propio.
--   p_datos: { fecha, type_id, name, duration_min, distance_km, ascent_m, avg_hr, rpe, kcal_watch, kcal, metodo, peso_kg, notes }
-- =====================================================================================
create function public.guardar_entrenamiento(p_id uuid, p_datos jsonb)
returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_tipo uuid := nullif(p_datos ->> 'type_id', '')::uuid;
  v_fila public.workouts;
begin
  if v_uid is null then
    raise exception 'Tenés que iniciar sesión.' using errcode = 'P0001';
  end if;
  if p_id is null or p_datos is null or jsonb_typeof(p_datos) <> 'object' then
    raise exception 'Los datos del entrenamiento no son válidos.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.profiles p where p.id = v_uid and p.gasto_activo) then
    raise exception 'Para anotar ejercicio primero activá el cálculo de gasto en tu perfil.' using errcode = 'P0001';
  end if;
  -- Si la actividad ya no existe (por ejemplo, una propia que se borró desde otro dispositivo), el entrenamiento se guarda
  -- igual: el nombre queda anotado en `name`
  if v_tipo is not null and not exists (
    select 1 from public.exercise_types t where t.id = v_tipo and (t.owner is null or t.owner = v_uid)
  ) then
    v_tipo := null;
  end if;

  insert into public.workouts as w (id, user_id, fecha, type_id, name, duration_min, distance_km, ascent_m, avg_hr, rpe,
                                    kcal_watch, kcal, metodo, peso_kg, notes)
  values (
    p_id, v_uid, (p_datos ->> 'fecha')::date, v_tipo, btrim(p_datos ->> 'name'), (p_datos ->> 'duration_min')::int,
    nullif(p_datos ->> 'distance_km', '')::numeric, nullif(p_datos ->> 'ascent_m', '')::numeric,
    nullif(p_datos ->> 'avg_hr', '')::int, nullif(p_datos ->> 'rpe', '')::int, nullif(p_datos ->> 'kcal_watch', '')::int,
    (p_datos ->> 'kcal')::numeric, coalesce(nullif(p_datos ->> 'metodo', ''), 'mets'),
    nullif(p_datos ->> 'peso_kg', '')::numeric, nullif(btrim(p_datos ->> 'notes'), '')
  )
  on conflict (id) do update set
    fecha = excluded.fecha, type_id = excluded.type_id, name = excluded.name, duration_min = excluded.duration_min,
    distance_km = excluded.distance_km, ascent_m = excluded.ascent_m, avg_hr = excluded.avg_hr, rpe = excluded.rpe,
    kcal_watch = excluded.kcal_watch, kcal = excluded.kcal, metodo = excluded.metodo, peso_kg = excluded.peso_kg,
    notes = excluded.notes
  where w.user_id = v_uid
  returning * into v_fila;

  if v_fila.id is null then
    raise exception 'Ese entrenamiento no se puede editar.' using errcode = 'P0001';
  end if;
  return jsonb_build_object('entrenamiento', to_jsonb(v_fila));
end $$;

revoke all on function public.guardar_entrenamiento(uuid, jsonb) from public, anon;
grant execute on function public.guardar_entrenamiento(uuid, jsonb) to authenticated;

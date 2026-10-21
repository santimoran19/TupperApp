-- Tupper, actualización 15: gasto calórico (F-19, fases 1 y 4).
-- Corré este archivo entero en el SQL Editor de Supabase. Se puede correr más de una vez.
-- Va ANTES de publicar la versión 1.23 de la app. Las versiones anteriores siguen andando igual con esto aplicado.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-18.sql, seed.sql y seed-6.sql.
--
-- NO modifica, mueve ni borra ningún dato que ya esté cargado: agrega columnas opcionales (o con un valor por defecto que
-- deja todo como estaba) a `profiles`. El objetivo de calorías de cada persona NO cambia: el cálculo nuevo se prende a mano
-- desde Perfil > Gasto y ejercicio, y quien no lo prende sigue con su objetivo fijo de siempre.
--
-- Datos de salud: el peso, el % de grasa, el pulso y el ejercicio son datos sensibles (Ley 25.326). Por eso el cálculo nuevo
-- solo se prende dejando constancia del consentimiento (`gasto_consentimiento`), y la base no deja prenderlo sin esa fecha.
--
-- Columnas nuevas (todas opcionales):
--   body_fat_pct        % de grasa corporal (3 a 60). Con este dato se usa Katch-McArdle en vez de Mifflin-St Jeor.
--   work_type           'escritorio' | 'de_pie' | 'fisico': cuánto se mueve la persona en el día a día, sin entrenar.
--   steps_per_day       pasos por día, en promedio (0 a 60.000).
--   resting_hr          pulso en reposo (30 a 120), para las cuentas con pulso.
--   gasto_activo        el cálculo nuevo está prendido (por defecto no).
--   gasto_consentimiento  cuándo aceptó que se usen sus datos de salud para esto.
--   gasto_modo          'fijo' (objetivo de siempre) | 'dinamico' (objetivo del día según el ejercicio).
--   gasto_devuelve      de lo que se gasta entrenando, qué parte se suma al objetivo del día (0 a 100 %).
--   gasto_ajuste_pct    recorte (negativo) o superávit (positivo) sobre el gasto, en %. Vacío = automático según el peso meta.
--   gasto_factor        factor propio calculado con los datos de la persona (fase 4): 0,70 a 1,30. Vacío = sin ajustar.
--   gasto_factor_fecha  cuándo se calculó ese factor.

alter table public.profiles
  add column if not exists body_fat_pct numeric,
  add column if not exists work_type text,
  add column if not exists steps_per_day int,
  add column if not exists resting_hr int,
  add column if not exists gasto_activo boolean not null default false,
  add column if not exists gasto_consentimiento timestamptz,
  add column if not exists gasto_modo text not null default 'fijo',
  add column if not exists gasto_devuelve int not null default 50,
  add column if not exists gasto_ajuste_pct numeric,
  add column if not exists gasto_factor numeric,
  add column if not exists gasto_factor_fecha date;

alter table public.profiles drop constraint if exists profiles_gasto_chk;
alter table public.profiles add constraint profiles_gasto_chk check (
  (body_fat_pct is null or body_fat_pct between 3 and 60)
  and (work_type is null or work_type in ('escritorio', 'de_pie', 'fisico'))
  and (steps_per_day is null or steps_per_day between 0 and 60000)
  and (resting_hr is null or resting_hr between 30 and 120)
  and gasto_modo in ('fijo', 'dinamico')
  and gasto_devuelve between 0 and 100
  and (gasto_ajuste_pct is null or gasto_ajuste_pct between -40 and 30)
  and (gasto_factor is null or gasto_factor between 0.7 and 1.3)
  -- Sin consentimiento no se prende
  and (not gasto_activo or gasto_consentimiento is not null)
);

alter table public.profiles drop constraint if exists profiles_gasto_decimales_chk;
alter table public.profiles add constraint profiles_gasto_decimales_chk check (
  (body_fat_pct is null or scale(body_fat_pct) <= 4)
  and (gasto_ajuste_pct is null or scale(gasto_ajuste_pct) <= 4)
  and (gasto_factor is null or scale(gasto_factor) <= 4)
);

-- Con las columnas nuevas la fila pesa un poco más: el tope de actualizacion-8.sql (800 bytes) pasa a 1.200
alter table public.profiles drop constraint if exists profiles_peso_fila_chk;
alter table public.profiles add constraint profiles_peso_fila_chk check (pg_column_size(profiles.*) <= 1200);

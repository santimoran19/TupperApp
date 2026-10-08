-- Tupper, actualización 8: topes en la base.
-- Hasta acá, varios límites los ponía solo la app. Quien tiene una cuenta puede hablarle a la base sin pasar por la app,
-- así que podía guardar textos enormes o millones de filas y llenar la base (que es de todos). Esto lo corta en la base.
-- Solo agrega límites: no cambia ni borra nada de lo que ya está cargado. Si algún dato ya cargado no cumpliera,
-- el archivo entero falla y no se aplica nada (no pasa: los topes están muy por encima de lo que hay).
-- No depende de ninguna versión de la app: las que ya están publicadas siguen andando igual con esto aplicado.
-- Si usás el análisis con IA, después de aplicarlo conviene volver a publicar la función (supabase/functions/LEEME.md):
-- la versión nueva avisa que la cuenta llegó a su máximo de análisis antes de consultar al modelo, y no después.
-- Se corre una sola vez: Supabase > SQL Editor > pegar el archivo entero > Run.
-- Para recrear la base desde cero el orden es: schema.sql, actualizacion-2.sql a actualizacion-8.sql y seed.sql.

-- =====================================================================================
-- 1. Textos con tope
-- Los nombres de alimentos, recetas y perfil ya lo tenían (actualizacion-2.sql). Faltaban estos.
-- =====================================================================================
alter table public.log_entries add constraint log_entries_nombre_chk check (char_length(name) <= 120);
alter table public.purchases add constraint purchases_nombre_chk check (char_length(name) <= 120);
alter table public.foods
  add constraint foods_medida_chk check (unit_label is null or char_length(unit_label) <= 30),
  add constraint foods_categoria_chk check (char_length(category) between 1 and 40),
  -- El slug identifica a los alimentos base (los usa la app para los sinónimos y las familias). Los de cada persona
  -- no llevan: si alguien pudiera ponerlo, podría ocupar el de un alimento base que se agregue más adelante.
  add constraint foods_slug_chk check (slug is null or (owner is null and char_length(slug) <= 60));
alter table public.recipes
  add constraint recipes_slug_chk check (slug is null or (owner is null and char_length(slug) <= 60)),
  add constraint recipes_comidas_chk
    check (cardinality(meal_types) <= 4 and meal_types <@ array['desayuno', 'almuerzo', 'merienda', 'cena']);
alter table public.ai_analyses
  add constraint ai_analyses_modelo_chk check (model is null or char_length(model) <= 80),
  -- El contenido ya tenía tope por lo que ocupa guardado; faltaba por lo que ocupa escrito (ver el punto 2)
  add constraint ai_analyses_texto_chk check (octet_length(content::text) <= 20000);

-- =====================================================================================
-- 2. Números con tope
-- Un número puede ocupar muy poco guardado y muchísimo al leerlo: 1 seguido de cien mil ceros son unos pocos bytes
-- en la base y cien mil letras cuando viaja a la app. Varias columnas ya tenían máximo; faltaban las del registro de
-- comidas y los gramos por unidad. Además, ningún número puede tener más de 40 decimales (los que manda la app, con
-- las cuentas hechas en el teléfono, no pasan de 20).
-- =====================================================================================
alter table public.log_entries
  add constraint log_entries_maximos_chk check (qty <= 1000000 and protein <= 100000 and carbs <= 100000 and fat <= 100000),
  add constraint log_entries_decimales_chk
    check (scale(qty) <= 40 and scale(kcal) <= 40 and scale(protein) <= 40 and scale(carbs) <= 40 and scale(fat) <= 40);
alter table public.foods
  add constraint foods_gramos_chk check (unit_grams is null or (unit_grams >= 0 and unit_grams <= 100000)),
  add constraint foods_decimales_chk check (
    (unit_grams is null or scale(unit_grams) <= 40)
    and scale(kcal) <= 40 and scale(protein) <= 40 and scale(carbs) <= 40 and scale(fat) <= 40
  );
alter table public.stock add constraint stock_decimales_chk check (scale(qty) <= 40);
alter table public.recipe_items add constraint recipe_items_decimales_chk check (scale(qty) <= 40);
alter table public.prepared add constraint prepared_decimales_chk check (scale(portions) <= 40);
alter table public.shopping_items add constraint shopping_decimales_chk check (scale(qty) <= 40);
alter table public.purchases add constraint purchases_decimales_chk check (scale(qty) <= 40 and scale(price) <= 40);
alter table public.measurements add constraint measurements_decimales_chk
  check ((weight_kg is null or scale(weight_kg) <= 40) and (waist_cm is null or scale(waist_cm) <= 40));
alter table public.profiles add constraint profiles_decimales_chk check (
  (height_cm is null or scale(height_cm) <= 40)
  and (weight_kg is null or scale(weight_kg) <= 40)
  and (goal_weight_kg is null or scale(goal_weight_kg) <= 40)
  and scale(activity) <= 40
);

-- =====================================================================================
-- 3. Ninguna fila pesa de más
-- Por si queda algo sin cubrir: un tope por fila, en bytes, con margen de sobra sobre lo que carga la app.
-- =====================================================================================
alter table public.profiles add constraint profiles_peso_fila_chk check (pg_column_size(profiles.*) <= 800);
alter table public.foods add constraint foods_peso_fila_chk check (pg_column_size(foods.*) <= 1000);
alter table public.stock add constraint stock_peso_fila_chk check (pg_column_size(stock.*) <= 200);
alter table public.recipes add constraint recipes_peso_fila_chk check (pg_column_size(recipes.*) <= 24000);
alter table public.recipe_items add constraint recipe_items_peso_fila_chk check (pg_column_size(recipe_items.*) <= 200);
alter table public.prepared add constraint prepared_peso_fila_chk check (pg_column_size(prepared.*) <= 200);
alter table public.plan add constraint plan_peso_fila_chk check (pg_column_size(plan.*) <= 300);
alter table public.log_entries add constraint log_entries_peso_fila_chk check (pg_column_size(log_entries.*) <= 600);
alter table public.measurements add constraint measurements_peso_fila_chk check (pg_column_size(measurements.*) <= 200);
alter table public.shopping_items add constraint shopping_peso_fila_chk check (pg_column_size(shopping_items.*) <= 200);
alter table public.purchases add constraint purchases_peso_fila_chk check (pg_column_size(purchases.*) <= 600);

-- =====================================================================================
-- 4. Tope de filas por usuario
-- Después de cada alta se cuenta cuántas filas tiene esa persona en la tabla; si se pasó, el alta no entra y sale un
-- aviso para mostrar tal cual (código P0001, como los demás avisos escritos a mano).
-- Los topes están pensados para que nadie llegue usando la app: un diario con 20 anotaciones por día tarda 4 años en
-- llegar a 30.000. Para cambiar uno: drop trigger tope_de_filas on public.TABLA; y crearlo de nuevo con otro número.
-- Los alimentos y las recetas base (no tienen dueño) no cuentan.
-- =====================================================================================
create function public.tope_de_filas() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_columna text := tg_argv[0]; -- la columna que dice de quién es la fila
  v_tope int := tg_argv[1]::int;
  v_que text := tg_argv[2]; -- cómo se le dice a la persona
  v_pasado boolean;
begin
  -- De a un pedido por dueño y por tabla, para que varios a la vez no se pasen del tope entre todos
  execute format(
    'select pg_advisory_xact_lock(hashtextextended(%2$L || quien::text, 0))
     from (select distinct %1$I as quien from nuevas where %1$I is not null order by 1) n',
    v_columna, tg_table_name || ':'
  );
  -- Por cada dueño que aparece en las filas nuevas se cuentan las suyas, cortando apenas pasa el tope
  execute format(
    'select exists (
       select 1 from (select distinct %1$I as quien from nuevas where %1$I is not null) n
       where (select count(*) from (select 1 from %2$I.%3$I t where t.%1$I = n.quien limit %4$s) x) > %5$s)',
    v_columna, tg_table_schema, tg_table_name, v_tope + 1, v_tope
  ) into v_pasado;
  if v_pasado then
    raise exception 'Llegaste al máximo de % que se pueden guardar (%).', v_que, v_tope using errcode = 'P0001';
  end if;
  return null;
end $$;
revoke all on function public.tope_de_filas() from public, anon, authenticated;

create trigger tope_de_filas after insert on public.log_entries referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '30000', 'registros');
create trigger tope_de_filas after insert on public.purchases referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '5000', 'compras');
create trigger tope_de_filas after insert on public.plan referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '10000', 'comidas planificadas');
create trigger tope_de_filas after insert on public.measurements referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '5000', 'medidas');
create trigger tope_de_filas after insert on public.foods referencing new table as nuevas
  for each statement execute function public.tope_de_filas('owner', '1000', 'alimentos propios');
create trigger tope_de_filas after insert on public.recipes referencing new table as nuevas
  for each statement execute function public.tope_de_filas('owner', '200', 'recetas propias');
create trigger tope_de_filas after insert on public.stock referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '1000', 'alimentos en la despensa');
create trigger tope_de_filas after insert on public.prepared referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '1000', 'comidas listas');
create trigger tope_de_filas after insert on public.shopping_items referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '1000', 'cosas en la lista de compras');
create trigger tope_de_filas after insert on public.recipe_prefs referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '1000', 'recetas marcadas');
create trigger tope_de_filas after insert on public.ai_analyses referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '500', 'análisis');
-- Las claves de los pedidos se borran solas a la semana; usando la app no se juntan más de unas cientas
create trigger tope_de_filas after insert on public.operaciones referencing new table as nuevas
  for each statement execute function public.tope_de_filas('user_id', '2000', 'pedidos seguidos');
-- Los ingredientes se cuentan por receta (también en las recetas base). Acá además hay que mirar las modificaciones:
-- si no, se podrían cargar de a 60 en otra receta y después pasarlos todos a una sola.
create trigger tope_de_filas after insert on public.recipe_items referencing new table as nuevas
  for each statement execute function public.tope_de_filas('recipe_id', '60', 'ingredientes por receta');
create trigger tope_de_filas_al_modificar after update on public.recipe_items referencing new table as nuevas
  for each statement execute function public.tope_de_filas('recipe_id', '60', 'ingredientes por receta');
-- (away_rules no puede pasar de 28 filas por usuario y profiles es una sola)

-- =====================================================================================
-- 5. Los análisis con IA
-- La función que los pide deja hacer unos pocos por día y lo cuenta mirando la fecha de los guardados. Como cada
-- persona puede guardar en esa tabla, podía cargarlos con fecha vieja y esquivar la cuenta. Ahora la fecha la pone
-- siempre la base, y además no deja guardar más de 10 por día (la función corta antes, en 3: ver
-- supabase/functions/LEEME.md; si se sube ese número por encima de 10, hay que subir este también).
-- =====================================================================================
create function public.ai_analyses_antes() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  -- Si no es de quien lo manda no hay nada que mirar: lo rechaza la regla por fila (y lo que carga el administrador pasa)
  if new.user_id is distinct from (select auth.uid()) then return new; end if;
  new.created_at := now();
  if (
    select count(*) from public.ai_analyses a where a.user_id = new.user_id and a.created_at > now() - interval '1 day'
  ) >= 10 then
    raise exception 'Ya se guardaron muchos análisis hoy. Probá de nuevo mañana.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke all on function public.ai_analyses_antes() from public, anon, authenticated;
create trigger ai_analyses_antes before insert on public.ai_analyses
  for each row execute function public.ai_analyses_antes();

-- =====================================================================================
-- 6. El registro de errores, más ajustado
-- Era lo que más lugar podía ocupar por cuenta: 300 anotaciones por día de hasta 4.000 bytes, guardadas 90 días.
-- La app manda como mucho unos 2.600 bytes por anotación y, en un día normal, unas pocas. Queda en 100 por día
-- (70 para los eventos comunes, así siempre hay lugar para los errores) y 3.000 bytes de detalle.
-- =====================================================================================
alter table public.eventos
  drop constraint eventos_detalle_check,
  add constraint eventos_detalle_check check (octet_length(detalle::text) <= 3000),
  add constraint eventos_peso_fila_chk check (pg_column_size(eventos.*) <= 4500);

create or replace function public.eventos_antes() returns trigger
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
  if v_total >= 100 or (new.tipo = 'evento' and v_comunes >= 70) then
    return null;
  end if;
  delete from public.eventos e where e.created_at < now() - interval '90 days';
  new.created_at := now();
  return new;
end $$;

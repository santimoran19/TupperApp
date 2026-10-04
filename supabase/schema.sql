-- Tupper: esquema de base de datos (Supabase / Postgres)
-- Cada usuario ve y modifica solo lo suyo (RLS). Alimentos y recetas con owner NULL son la base comun.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  sex text check (sex in ('m','f')),
  birth_date date,
  height_cm numeric,
  weight_kg numeric,
  goal_weight_kg numeric,
  activity numeric not null default 1.375,
  kcal_target int not null default 2000,
  protein_target int not null default 120,
  created_at timestamptz not null default now()
);

create table public.foods (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users on delete cascade,
  slug text unique,
  name text not null,
  unit text not null check (unit in ('g','ml','u')),
  unit_grams numeric,
  unit_label text,
  kcal numeric not null,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  category text not null default 'Otros'
);
create index foods_owner_idx on public.foods (owner);

create table public.stock (
  user_id uuid not null references auth.users on delete cascade,
  food_id uuid not null references public.foods on delete cascade,
  qty numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, food_id)
);
create index stock_food_idx on public.stock (food_id);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users on delete cascade,
  slug text unique,
  name text not null,
  minutes int not null default 10,
  servings int not null default 1 check (servings > 0),
  meal_types text[] not null default '{almuerzo,cena}',
  portable boolean not null default true,
  steps text not null default ''
);
create index recipes_owner_idx on public.recipes (owner);

create table public.recipe_items (
  recipe_id uuid not null references public.recipes on delete cascade,
  food_id uuid not null references public.foods on delete cascade,
  qty numeric not null check (qty > 0),
  primary key (recipe_id, food_id)
);
create index recipe_items_food_idx on public.recipe_items (food_id);

create table public.prepared (
  user_id uuid not null references auth.users on delete cascade,
  recipe_id uuid not null references public.recipes on delete cascade,
  portions numeric not null default 0,
  primary key (user_id, recipe_id)
);
create index prepared_recipe_idx on public.prepared (recipe_id);

create table public.plan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  meal text not null check (meal in ('desayuno','almuerzo','merienda','cena')),
  recipe_id uuid references public.recipes on delete set null,
  away boolean not null default false,
  unique (user_id, date, meal)
);
create index plan_recipe_idx on public.plan (recipe_id);

create table public.away_rules (
  user_id uuid not null references auth.users on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  meal text not null check (meal in ('desayuno','almuerzo','merienda','cena')),
  primary key (user_id, weekday, meal)
);

create table public.log_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  meal text not null check (meal in ('desayuno','almuerzo','merienda','cena')),
  name text not null,
  food_id uuid references public.foods on delete set null,
  recipe_id uuid references public.recipes on delete set null,
  qty numeric not null default 1,
  kcal numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz not null default now()
);
create index log_user_date_idx on public.log_entries (user_id, date);
create index log_food_idx on public.log_entries (food_id);
create index log_recipe_idx on public.log_entries (recipe_id);

create table public.measurements (
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  weight_kg numeric,
  waist_cm numeric,
  primary key (user_id, date)
);

create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  food_id uuid not null references public.foods on delete cascade,
  qty numeric not null default 1,
  created_at timestamptz not null default now(),
  unique (user_id, food_id)
);
create index shopping_food_idx on public.shopping_items (food_id);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  food_id uuid references public.foods on delete set null,
  name text not null,
  qty numeric not null default 1,
  price numeric not null default 0,
  date date not null default current_date
);
create index purchases_user_date_idx on public.purchases (user_id, date);
create index purchases_food_idx on public.purchases (food_id);

-- ---------- Seguridad por fila ----------
alter table public.profiles enable row level security;
alter table public.foods enable row level security;
alter table public.stock enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_items enable row level security;
alter table public.prepared enable row level security;
alter table public.plan enable row level security;
alter table public.away_rules enable row level security;
alter table public.log_entries enable row level security;
alter table public.measurements enable row level security;
alter table public.shopping_items enable row level security;
alter table public.purchases enable row level security;

create policy profiles_own on public.profiles for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy foods_read on public.foods for select to authenticated
  using (owner is null or owner = (select auth.uid()));
create policy foods_insert on public.foods for insert to authenticated
  with check (owner = (select auth.uid()));
create policy foods_update on public.foods for update to authenticated
  using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
create policy foods_delete on public.foods for delete to authenticated
  using (owner = (select auth.uid()));

create policy recipes_read on public.recipes for select to authenticated
  using (owner is null or owner = (select auth.uid()));
create policy recipes_insert on public.recipes for insert to authenticated
  with check (owner = (select auth.uid()));
create policy recipes_update on public.recipes for update to authenticated
  using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
create policy recipes_delete on public.recipes for delete to authenticated
  using (owner = (select auth.uid()));

create policy recipe_items_read on public.recipe_items for select to authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_id
                 and (r.owner is null or r.owner = (select auth.uid()))));
create policy recipe_items_insert on public.recipe_items for insert to authenticated
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.owner = (select auth.uid())));
create policy recipe_items_update on public.recipe_items for update to authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.owner = (select auth.uid())))
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.owner = (select auth.uid())));
create policy recipe_items_delete on public.recipe_items for delete to authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.owner = (select auth.uid())));

create policy stock_own on public.stock for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy prepared_own on public.prepared for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy plan_own on public.plan for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy away_rules_own on public.away_rules for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy log_own on public.log_entries for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy measurements_own on public.measurements for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy shopping_own on public.shopping_items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy purchases_own on public.purchases for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on all tables in schema public from anon;

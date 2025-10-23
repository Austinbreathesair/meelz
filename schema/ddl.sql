-- core
create table profile(
  id uuid primary key,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table recipe(
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profile(id) on delete cascade,
  source text not null check (source in ('user','api')),
  source_ref text,
  title text not null,
  description text,
  image_url text,
  base_servings int not null check (base_servings > 0),
  is_public boolean not null default false,
  tsv tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ix_recipe_public on recipe(is_public, updated_at desc);
create index if not exists ix_recipe_tsv on recipe using gin(tsv);

create table ingredient(
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipe(id) on delete cascade,
  name text not null,
  qty numeric,
  unit text,
  unit_family text check (unit_family in ('mass','volume','count')),
  notes text,
  position int not null
);
create unique index ux_ingredient_recipe_pos on ingredient(recipe_id, position);

create table instruction(
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipe(id) on delete cascade,
  step_no int not null,
  text text not null
);
create unique index ux_instruction_recipe_step on instruction(recipe_id, step_no);

create table tag(
  id serial primary key,
  name citext unique not null
);
create table recipe_tag(
  recipe_id uuid references recipe(id) on delete cascade,
  tag_id int references tag(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

create table category(
  id serial primary key,
  name citext unique not null
);
create table recipe_category(
  recipe_id uuid references recipe(id) on delete cascade,
  category_id int references category(id) on delete cascade,
  primary key (recipe_id, category_id)
);

create table favorite(
  user_id uuid references profile(id) on delete cascade,
  recipe_id uuid references recipe(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create table collection(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profile(id) on delete cascade,
  name text not null
);
create table collection_item(
  collection_id uuid references collection(id) on delete cascade,
  recipe_id uuid references recipe(id) on delete cascade,
  position int not null,
  primary key (collection_id, recipe_id)
);

create table pantry_item(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profile(id) on delete cascade,
  name text not null,
  qty numeric,
  unit text,
  unit_family text check (unit_family in ('mass','volume','count')),
  expiry_date date
);
create index ix_pantry_user on pantry_item(user_id);

-- Units & conversions
create table unit(
  code text primary key,
  family text not null check (family in ('mass','volume','count')),
  display text not null
);
create table unit_conversion(
  unit_from text references unit(code),
  unit_to text references unit(code),
  factor numeric not null,
  family text not null check (family in ('mass','volume')),
  primary key (unit_from, unit_to)
);
create table density_map(
  ingredient_name text primary key,
  grams_per_ml numeric not null
);

-- Versioning & social
create table recipe_version(
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipe(id) on delete cascade,
  version_no int not null,
  diff jsonb,
  created_at timestamptz not null default now(),
  unique (recipe_id, version_no)
);
create table share_link(
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipe(id) on delete cascade,
  slug text unique not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);
create table recipe_comment(
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipe(id) on delete cascade,
  author_id uuid not null references profile(id) on delete cascade,
  rating int check (rating between 1 and 5),
  content text not null,
  created_at timestamptz not null default now()
);

-- API cache
create table api_cache(
  id bigserial primary key,
  key_hash text unique not null,
  payload jsonb not null,
  expires_at timestamptz not null
);
create index ix_api_cache_exp on api_cache(expires_at);

-- Ledger for budget dashboard
create table pantry_txn(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profile(id) on delete cascade,
  pantry_item_id uuid references pantry_item(id) on delete set null,
  ingredient_name text not null,
  delta_qty_canonical numeric not null,        -- +in / -out in g/ml/count
  unit_family text not null check (unit_family in ('mass','volume','count')),
  reason text not null check (reason in ('add','cook','adjust','expire','delete')),
  recipe_id uuid references recipe(id) on delete set null,
  unit_price numeric,
  amount numeric,                               -- delta_qty_canonical * unit_price
  created_at timestamptz not null default now()
);
create index ix_txn_user_day on pantry_txn(user_id, created_at);
create index ix_txn_item_day on pantry_txn(pantry_item_id, created_at);
create index ix_txn_recipe_day on pantry_txn(recipe_id, created_at);

create table price_snapshot(
  id bigserial primary key,
  user_id uuid not null references profile(id) on delete cascade,
  ingredient_key text not null,
  unit_family text not null check (unit_family in ('mass','volume','count')),
  unit_price numeric not null,
  source text not null check (source in ('manual','csv','api')),
  captured_at date not null
);
create index ix_price_lookup on price_snapshot(user_id, ingredient_key, captured_at desc);


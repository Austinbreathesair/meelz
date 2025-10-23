-- Demo profile
insert into profile (id, display_name)
values ('00000000-0000-0000-0000-000000000001', 'Demo User')
on conflict (id) do nothing;

-- Density map
insert into density_map (ingredient_name, grams_per_ml) values
  ('milk', 1.03),
  ('oil', 0.92),
  ('flour', 0.53)
on conflict (ingredient_name) do nothing;

-- Units
insert into unit (code, family, display) values
  ('g','mass','g'),('kg','mass','kg'),('ml','volume','ml'),('l','volume','L'),('count','count','pcs')
on conflict (code) do nothing;

insert into unit_conversion (unit_from, unit_to, factor, family) values
  ('kg','g',1000,'mass'),('l','ml',1000,'volume')
on conflict (unit_from, unit_to) do nothing;

-- Pantry items
insert into pantry_item (user_id, name, qty, unit, unit_family, expiry_date)
values
  ('00000000-0000-0000-0000-000000000001','milk', 1000, 'ml', 'volume', now() + interval '2 days'),
  ('00000000-0000-0000-0000-000000000001','flour', 2000, 'g', 'mass', now() + interval '30 days'),
  ('00000000-0000-0000-0000-000000000001','eggs', 12, 'count', 'count', now() + interval '10 days');

-- Recipe: Pancakes
insert into recipe (id, author_id, source, title, description, base_servings, is_public)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'user',
  'Simple Pancakes',
  'Fluffy pancakes with milk and eggs',
  4,
  true
)
on conflict (id) do nothing;

insert into ingredient (recipe_id, name, qty, unit, unit_family, notes, position) values
  ('11111111-1111-1111-1111-111111111111','flour', 250, 'g', 'mass', null, 1),
  ('11111111-1111-1111-1111-111111111111','milk', 300, 'ml', 'volume', null, 2),
  ('11111111-1111-1111-1111-111111111111','eggs', 2, 'count', 'count', null, 3)
on conflict do nothing;

insert into instruction (recipe_id, step_no, text) values
  ('11111111-1111-1111-1111-111111111111',1,'Mix ingredients until smooth.'),
  ('11111111-1111-1111-1111-111111111111',2,'Cook on hot skillet until golden.')
on conflict do nothing;

insert into tag (name) values ('breakfast') on conflict (name) do nothing;
insert into category (name) values ('quick') on conflict (name) do nothing;

insert into recipe_tag (recipe_id, tag_id)
select '11111111-1111-1111-1111-111111111111', id from tag where name = 'breakfast'
on conflict do nothing;

insert into recipe_category (recipe_id, category_id)
select '11111111-1111-1111-1111-111111111111', id from category where name = 'quick'
on conflict do nothing;

-- Price snapshots
insert into price_snapshot (user_id, ingredient_key, unit_family, unit_price, source, captured_at)
values
  ('00000000-0000-0000-0000-000000000001', 'flour', 'mass', 0.002, 'manual', current_date),
  ('00000000-0000-0000-0000-000000000001', 'milk', 'volume', 0.0015, 'manual', current_date);


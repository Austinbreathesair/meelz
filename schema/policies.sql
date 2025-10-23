-- Enable RLS on key tables
alter table recipe enable row level security;
alter table ingredient enable row level security;
alter table instruction enable row level security;
alter table recipe_version enable row level security;
alter table share_link enable row level security;
alter table recipe_comment enable row level security;
alter table favorite enable row level security;
alter table collection enable row level security;
alter table collection_item enable row level security;
alter table pantry_item enable row level security;
alter table pantry_txn enable row level security;
alter table price_snapshot enable row level security;

-- Example policies (pantry_item)
create policy "pantry_item_select_own" on pantry_item
  for select using (auth.uid() = user_id);
create policy "pantry_item_insert_own" on pantry_item
  for insert with check (auth.uid() = user_id);
create policy "pantry_item_update_own" on pantry_item
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pantry_item_delete_own" on pantry_item
  for delete using (auth.uid() = user_id);

-- Example policies (pantry_txn)
create policy "pantry_txn_select_own" on pantry_txn
  for select using (auth.uid() = user_id);
create policy "pantry_txn_insert_own" on pantry_txn
  for insert with check (auth.uid() = user_id);

-- Example policies (recipe)
-- Public recipes readable by anyone, private only by owner
create policy "recipe_public_read" on recipe
  for select using (
    is_public OR (auth.uid() = author_id)
  );
create policy "recipe_owner_write" on recipe
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- For dependent tables (ingredient, instruction, etc.) tie access to owning recipe
create policy "ingredient_by_recipe_owner" on ingredient
  for all using (
    exists (
      select 1 from recipe r where r.id = ingredient.recipe_id and (
        r.is_public = true or r.author_id = auth.uid()
      )
    )
  ) with check (
    exists (
      select 1 from recipe r where r.id = ingredient.recipe_id and r.author_id = auth.uid()
    )
  );

create policy "instruction_by_recipe_owner" on instruction
  for all using (
    exists (
      select 1 from recipe r where r.id = instruction.recipe_id and (
        r.is_public = true or r.author_id = auth.uid()
      )
    )
  ) with check (
    exists (
      select 1 from recipe r where r.id = instruction.recipe_id and r.author_id = auth.uid()
    )
  );


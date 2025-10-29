-- Fix RLS policies for share_link and collection_item tables

-- SHARE_LINK policies
ALTER TABLE share_link ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view share links for their recipes" ON share_link;
DROP POLICY IF EXISTS "Users can create share links for their recipes" ON share_link;
DROP POLICY IF EXISTS "Anyone can view share links" ON share_link;

-- Allow users to create share links for their own recipes
CREATE POLICY "Users can create share links for their recipes"
  ON share_link FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipe
      WHERE recipe.id = share_link.recipe_id
      AND recipe.author_id = auth.uid()
    )
  );

-- Allow users to view their own share links
CREATE POLICY "Users can view their share links"
  ON share_link FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipe
      WHERE recipe.id = share_link.recipe_id
      AND recipe.author_id = auth.uid()
    )
  );

-- COLLECTION_ITEM policies (fixed)
ALTER TABLE collection_item ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage items in their collections" ON collection_item;

-- Allow all operations on collection_item if user owns the collection
CREATE POLICY "Users can view items in their collections"
  ON collection_item FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collection
      WHERE collection.id = collection_item.collection_id
      AND collection.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items in their collections"
  ON collection_item FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collection
      WHERE collection.id = collection_item.collection_id
      AND collection.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their collections"
  ON collection_item FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM collection
      WHERE collection.id = collection_item.collection_id
      AND collection.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collection
      WHERE collection.id = collection_item.collection_id
      AND collection.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their collections"
  ON collection_item FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM collection
      WHERE collection.id = collection_item.collection_id
      AND collection.user_id = auth.uid()
    )
  );

-- RECIPE policies - make sure users can add their saved recipes to collections
-- Users should be able to view their own recipes
CREATE POLICY IF NOT EXISTS "recipe_owner_select" ON recipe
  FOR SELECT USING (auth.uid() = author_id);


-- Fix RLS policy for collection table
-- This adds the missing INSERT policy for authenticated users

-- Enable RLS if not already enabled
ALTER TABLE collection ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own collections" ON collection;
DROP POLICY IF EXISTS "Users can insert their own collections" ON collection;
DROP POLICY IF EXISTS "Users can update their own collections" ON collection;
DROP POLICY IF EXISTS "Users can delete their own collections" ON collection;

-- Create comprehensive policies for collection table
CREATE POLICY "Users can view their own collections"
  ON collection FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collections"
  ON collection FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON collection FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON collection FOR DELETE
  USING (auth.uid() = user_id);

-- Also fix collection_item policies while we're at it
ALTER TABLE collection_item ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage items in their collections" ON collection_item;

CREATE POLICY "Users can manage items in their collections"
  ON collection_item FOR ALL
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


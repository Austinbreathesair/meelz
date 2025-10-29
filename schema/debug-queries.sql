-- Debug Queries for Test User (test@testing.com)
-- Run these in your Supabase SQL Editor to check if data was inserted correctly

-- 1. Find your test user's UUID
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'test@testing.com';

-- 2. Check if profile exists
SELECT * 
FROM profile 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com');

-- 3. Count pantry items for test user
SELECT COUNT(*) as total_pantry_items
FROM pantry_item 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com');

-- 4. View all pantry items for test user
SELECT 
  name, 
  qty, 
  unit, 
  unit_family, 
  expiry_date,
  created_at
FROM pantry_item 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com')
ORDER BY name;

-- 5. Count transactions for test user
SELECT COUNT(*) as total_transactions
FROM pantry_txn 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com');

-- 6. View transaction summary
SELECT 
  ingredient_name,
  delta_qty_canonical,
  unit_family,
  reason,
  amount,
  created_at
FROM pantry_txn 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com')
ORDER BY created_at DESC
LIMIT 20;

-- 7. Calculate total spending
SELECT 
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_spent,
  SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_used,
  COUNT(*) as total_transactions
FROM pantry_txn 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com');

-- 8. View price snapshots
SELECT 
  ingredient_key,
  unit_family,
  unit_price,
  source,
  captured_at
FROM price_snapshot 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com')
ORDER BY ingredient_key;

-- 9. View daily spending breakdown (last 30 days)
SELECT 
  DATE(created_at) as day,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as added,
  SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as used,
  SUM(amount) as net
FROM pantry_txn 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com')
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- 10. Items expiring soon
SELECT 
  name, 
  qty, 
  unit, 
  expiry_date,
  expiry_date - CURRENT_DATE as days_until_expiry
FROM pantry_item 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com')
  AND expiry_date IS NOT NULL
  AND expiry_date >= CURRENT_DATE
ORDER BY expiry_date ASC
LIMIT 10;

-- ========================================
-- TROUBLESHOOTING: If no data appears
-- ========================================

-- A. Check if the user exists in auth.users
-- If this returns no rows, you need to sign up with test@testing.com first
SELECT id, email FROM auth.users WHERE email = 'test@testing.com';

-- B. Check RLS policies - make sure you have policies that allow viewing pantry_item
-- You may need to temporarily disable RLS or check your policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('pantry_item', 'pantry_txn', 'price_snapshot');

-- C. If you want to manually insert a test item (after getting user_id from query A)
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID
/*
INSERT INTO pantry_item (user_id, name, qty, unit, unit_family, expiry_date)
VALUES 
  ('YOUR_USER_ID_HERE', 'Test Chicken', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '5 days');
*/

-- D. Clear all test data if you want to start fresh
-- CAREFUL: This will delete ALL data for the test user
/*
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@testing.com';
  DELETE FROM pantry_txn WHERE user_id = test_user_id;
  DELETE FROM pantry_item WHERE user_id = test_user_id;
  DELETE FROM price_snapshot WHERE user_id = test_user_id;
  DELETE FROM favorite WHERE user_id = test_user_id;
  DELETE FROM collection WHERE user_id = test_user_id;
  RAISE NOTICE 'Cleared all data for test user';
END $$;
*/


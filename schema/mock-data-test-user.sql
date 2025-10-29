-- Mock data for test user: test@testing.com
-- This script generates pantry items with costs and transactions for budget dashboard testing

-- First, get or create the test user profile
-- Note: Replace 'YOUR_TEST_USER_UUID' with the actual UUID from auth.users for test@testing.com
-- You can find it with: SELECT id FROM auth.users WHERE email = 'test@testing.com';

DO $$
DECLARE
  test_user_id uuid;
  pantry_item_id uuid;
BEGIN
  -- Get the test user ID from auth.users (assuming Supabase auth)
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@testing.com';
  
  -- If profile doesn't exist, create it
  INSERT INTO profile (id, display_name, created_at)
  VALUES (test_user_id, 'Test User', now())
  ON CONFLICT (id) DO NOTHING;

  -- Clear existing data for fresh start
  DELETE FROM pantry_txn WHERE user_id = test_user_id;
  DELETE FROM pantry_item WHERE user_id = test_user_id;
  DELETE FROM price_snapshot WHERE user_id = test_user_id;

  -- Insert pantry items with various categories and quantities
  
  -- PROTEINS
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Chicken Breast', 1.5, 'kg', 'mass', CURRENT_DATE + INTERVAL '5 days'),
  (gen_random_uuid(), test_user_id, 'Ground Beef', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '3 days'),
  (gen_random_uuid(), test_user_id, 'Salmon Fillet', 400, 'g', 'mass', CURRENT_DATE + INTERVAL '2 days'),
  (gen_random_uuid(), test_user_id, 'Eggs', 12, 'count', 'count', CURRENT_DATE + INTERVAL '14 days'),
  (gen_random_uuid(), test_user_id, 'Bacon', 300, 'g', 'mass', CURRENT_DATE + INTERVAL '7 days'),
  (gen_random_uuid(), test_user_id, 'Tofu', 400, 'g', 'mass', CURRENT_DATE + INTERVAL '10 days');

  -- DAIRY
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Milk', 2, 'L', 'volume', CURRENT_DATE + INTERVAL '5 days'),
  (gen_random_uuid(), test_user_id, 'Butter', 250, 'g', 'mass', CURRENT_DATE + INTERVAL '30 days'),
  (gen_random_uuid(), test_user_id, 'Cheddar Cheese', 400, 'g', 'mass', CURRENT_DATE + INTERVAL '20 days'),
  (gen_random_uuid(), test_user_id, 'Greek Yogurt', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '7 days'),
  (gen_random_uuid(), test_user_id, 'Heavy Cream', 500, 'ml', 'volume', CURRENT_DATE + INTERVAL '10 days'),
  (gen_random_uuid(), test_user_id, 'Parmesan Cheese', 200, 'g', 'mass', CURRENT_DATE + INTERVAL '45 days');

  -- VEGETABLES
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Tomatoes', 6, 'count', 'count', CURRENT_DATE + INTERVAL '4 days'),
  (gen_random_uuid(), test_user_id, 'Onions', 5, 'count', 'count', CURRENT_DATE + INTERVAL '14 days'),
  (gen_random_uuid(), test_user_id, 'Garlic', 1, 'count', 'count', CURRENT_DATE + INTERVAL '21 days'),
  (gen_random_uuid(), test_user_id, 'Bell Peppers', 4, 'count', 'count', CURRENT_DATE + INTERVAL '6 days'),
  (gen_random_uuid(), test_user_id, 'Carrots', 1, 'kg', 'mass', CURRENT_DATE + INTERVAL '10 days'),
  (gen_random_uuid(), test_user_id, 'Broccoli', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '5 days'),
  (gen_random_uuid(), test_user_id, 'Spinach', 300, 'g', 'mass', CURRENT_DATE + INTERVAL '3 days'),
  (gen_random_uuid(), test_user_id, 'Mushrooms', 250, 'g', 'mass', CURRENT_DATE + INTERVAL '4 days'),
  (gen_random_uuid(), test_user_id, 'Potatoes', 2, 'kg', 'mass', CURRENT_DATE + INTERVAL '30 days'),
  (gen_random_uuid(), test_user_id, 'Lettuce', 1, 'count', 'count', CURRENT_DATE + INTERVAL '5 days');

  -- FRUITS
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Apples', 8, 'count', 'count', CURRENT_DATE + INTERVAL '14 days'),
  (gen_random_uuid(), test_user_id, 'Bananas', 6, 'count', 'count', CURRENT_DATE + INTERVAL '5 days'),
  (gen_random_uuid(), test_user_id, 'Oranges', 5, 'count', 'count', CURRENT_DATE + INTERVAL '10 days'),
  (gen_random_uuid(), test_user_id, 'Lemons', 4, 'count', 'count', CURRENT_DATE + INTERVAL '14 days'),
  (gen_random_uuid(), test_user_id, 'Strawberries', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '3 days');

  -- GRAINS & PASTA
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Rice', 2, 'kg', 'mass', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Pasta', 1, 'kg', 'mass', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Bread', 1, 'count', 'count', CURRENT_DATE + INTERVAL '5 days'),
  (gen_random_uuid(), test_user_id, 'Flour', 2, 'kg', 'mass', CURRENT_DATE + INTERVAL '180 days'),
  (gen_random_uuid(), test_user_id, 'Oats', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '180 days'),
  (gen_random_uuid(), test_user_id, 'Quinoa', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '365 days');

  -- CONDIMENTS & OILS
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Olive Oil', 750, 'ml', 'volume', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Vegetable Oil', 1, 'L', 'volume', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Soy Sauce', 500, 'ml', 'volume', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Ketchup', 400, 'ml', 'volume', CURRENT_DATE + INTERVAL '180 days'),
  (gen_random_uuid(), test_user_id, 'Mayonnaise', 300, 'ml', 'volume', CURRENT_DATE + INTERVAL '90 days'),
  (gen_random_uuid(), test_user_id, 'Honey', 500, 'g', 'mass', CURRENT_DATE + INTERVAL '730 days');

  -- SPICES & SEASONINGS
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Salt', 1, 'kg', 'mass', NULL),
  (gen_random_uuid(), test_user_id, 'Black Pepper', 100, 'g', 'mass', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Paprika', 50, 'g', 'mass', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Cumin', 50, 'g', 'mass', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Oregano', 30, 'g', 'mass', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Basil', 30, 'g', 'mass', CURRENT_DATE + INTERVAL '365 days');

  -- CANNED & PACKAGED
  INSERT INTO pantry_item (id, user_id, name, qty, unit, unit_family, expiry_date) VALUES
  (gen_random_uuid(), test_user_id, 'Canned Tomatoes', 3, 'count', 'count', CURRENT_DATE + INTERVAL '730 days'),
  (gen_random_uuid(), test_user_id, 'Chickpeas', 2, 'count', 'count', CURRENT_DATE + INTERVAL '730 days'),
  (gen_random_uuid(), test_user_id, 'Black Beans', 2, 'count', 'count', CURRENT_DATE + INTERVAL '730 days'),
  (gen_random_uuid(), test_user_id, 'Coconut Milk', 400, 'ml', 'volume', CURRENT_DATE + INTERVAL '365 days'),
  (gen_random_uuid(), test_user_id, 'Chicken Stock', 1, 'L', 'volume', CURRENT_DATE + INTERVAL '365 days');

  -- Insert transaction history for budget tracking (past 30 days)
  
  -- Week 1 - Grocery shopping
  INSERT INTO pantry_txn (user_id, pantry_item_id, ingredient_name, delta_qty_canonical, unit_family, reason, unit_price, amount, created_at) VALUES
  (test_user_id, NULL, 'Chicken Breast', 1500, 'mass', 'add', 0.012, 18.00, CURRENT_TIMESTAMP - INTERVAL '28 days'),
  (test_user_id, NULL, 'Milk', 2000, 'volume', 'add', 0.0025, 5.00, CURRENT_TIMESTAMP - INTERVAL '28 days'),
  (test_user_id, NULL, 'Eggs', 12, 'count', 'add', 0.40, 4.80, CURRENT_TIMESTAMP - INTERVAL '28 days'),
  (test_user_id, NULL, 'Tomatoes', 6, 'count', 'add', 0.80, 4.80, CURRENT_TIMESTAMP - INTERVAL '28 days'),
  (test_user_id, NULL, 'Onions', 5, 'count', 'add', 0.30, 1.50, CURRENT_TIMESTAMP - INTERVAL '28 days'),
  (test_user_id, NULL, 'Rice', 2000, 'mass', 'add', 0.003, 6.00, CURRENT_TIMESTAMP - INTERVAL '28 days'),
  (test_user_id, NULL, 'Pasta', 1000, 'mass', 'add', 0.004, 4.00, CURRENT_TIMESTAMP - INTERVAL '28 days'),
  (test_user_id, NULL, 'Olive Oil', 750, 'volume', 'add', 0.012, 9.00, CURRENT_TIMESTAMP - INTERVAL '28 days');

  -- Week 2 - Cooking and shopping
  INSERT INTO pantry_txn (user_id, pantry_item_id, ingredient_name, delta_qty_canonical, unit_family, reason, unit_price, amount, created_at) VALUES
  (test_user_id, NULL, 'Chicken Breast', -300, 'mass', 'cook', 0.012, -3.60, CURRENT_TIMESTAMP - INTERVAL '21 days'),
  (test_user_id, NULL, 'Tomatoes', -2, 'count', 'cook', 0.80, -1.60, CURRENT_TIMESTAMP - INTERVAL '21 days'),
  (test_user_id, NULL, 'Ground Beef', 500, 'mass', 'add', 0.015, 7.50, CURRENT_TIMESTAMP - INTERVAL '20 days'),
  (test_user_id, NULL, 'Cheddar Cheese', 400, 'mass', 'add', 0.018, 7.20, CURRENT_TIMESTAMP - INTERVAL '20 days'),
  (test_user_id, NULL, 'Bell Peppers', 4, 'count', 'add', 1.20, 4.80, CURRENT_TIMESTAMP - INTERVAL '20 days'),
  (test_user_id, NULL, 'Broccoli', 500, 'mass', 'add', 0.006, 3.00, CURRENT_TIMESTAMP - INTERVAL '20 days');

  -- Week 3 - More cooking
  INSERT INTO pantry_txn (user_id, pantry_item_id, ingredient_name, delta_qty_canonical, unit_family, reason, unit_price, amount, created_at) VALUES
  (test_user_id, NULL, 'Rice', -200, 'mass', 'cook', 0.003, -0.60, CURRENT_TIMESTAMP - INTERVAL '14 days'),
  (test_user_id, NULL, 'Chicken Breast', -400, 'mass', 'cook', 0.012, -4.80, CURRENT_TIMESTAMP - INTERVAL '14 days'),
  (test_user_id, NULL, 'Pasta', -250, 'mass', 'cook', 0.004, -1.00, CURRENT_TIMESTAMP - INTERVAL '13 days'),
  (test_user_id, NULL, 'Salmon Fillet', 400, 'mass', 'add', 0.025, 10.00, CURRENT_TIMESTAMP - INTERVAL '12 days'),
  (test_user_id, NULL, 'Bacon', 300, 'mass', 'add', 0.020, 6.00, CURRENT_TIMESTAMP - INTERVAL '12 days');

  -- Week 4 - Recent shopping and cooking
  INSERT INTO pantry_txn (user_id, pantry_item_id, ingredient_name, delta_qty_canonical, unit_family, reason, unit_price, amount, created_at) VALUES
  (test_user_id, NULL, 'Milk', 2000, 'volume', 'add', 0.0025, 5.00, CURRENT_TIMESTAMP - INTERVAL '7 days'),
  (test_user_id, NULL, 'Butter', 250, 'mass', 'add', 0.016, 4.00, CURRENT_TIMESTAMP - INTERVAL '7 days'),
  (test_user_id, NULL, 'Greek Yogurt', 500, 'mass', 'add', 0.008, 4.00, CURRENT_TIMESTAMP - INTERVAL '7 days'),
  (test_user_id, NULL, 'Spinach', 300, 'mass', 'add', 0.010, 3.00, CURRENT_TIMESTAMP - INTERVAL '7 days'),
  (test_user_id, NULL, 'Ground Beef', -200, 'mass', 'cook', 0.015, -3.00, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  (test_user_id, NULL, 'Onions', -1, 'count', 'cook', 0.30, -0.30, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  (test_user_id, NULL, 'Eggs', -4, 'count', 'cook', 0.40, -1.60, CURRENT_TIMESTAMP - INTERVAL '4 days'),
  (test_user_id, NULL, 'Mushrooms', 250, 'mass', 'add', 0.012, 3.00, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  (test_user_id, NULL, 'Potatoes', 2000, 'mass', 'add', 0.002, 4.00, CURRENT_TIMESTAMP - INTERVAL '3 days');

  -- Insert price snapshots for budget calculations
  INSERT INTO price_snapshot (user_id, ingredient_key, unit_family, unit_price, source, captured_at) VALUES
  (test_user_id, 'chicken breast', 'mass', 0.012, 'manual', CURRENT_DATE),
  (test_user_id, 'ground beef', 'mass', 0.015, 'manual', CURRENT_DATE),
  (test_user_id, 'salmon fillet', 'mass', 0.025, 'manual', CURRENT_DATE),
  (test_user_id, 'eggs', 'count', 0.40, 'manual', CURRENT_DATE),
  (test_user_id, 'milk', 'volume', 0.0025, 'manual', CURRENT_DATE),
  (test_user_id, 'butter', 'mass', 0.016, 'manual', CURRENT_DATE),
  (test_user_id, 'cheese', 'mass', 0.018, 'manual', CURRENT_DATE),
  (test_user_id, 'tomatoes', 'count', 0.80, 'manual', CURRENT_DATE),
  (test_user_id, 'onions', 'count', 0.30, 'manual', CURRENT_DATE),
  (test_user_id, 'bell peppers', 'count', 1.20, 'manual', CURRENT_DATE),
  (test_user_id, 'rice', 'mass', 0.003, 'manual', CURRENT_DATE),
  (test_user_id, 'pasta', 'mass', 0.004, 'manual', CURRENT_DATE),
  (test_user_id, 'olive oil', 'volume', 0.012, 'manual', CURRENT_DATE);

  RAISE NOTICE 'Mock data inserted successfully for test user!';
  RAISE NOTICE 'Total pantry items: %', (SELECT COUNT(*) FROM pantry_item WHERE user_id = test_user_id);
  RAISE NOTICE 'Total transactions: %', (SELECT COUNT(*) FROM pantry_txn WHERE user_id = test_user_id);
  RAISE NOTICE 'Total spent: $%', (SELECT COALESCE(SUM(amount), 0) FROM pantry_txn WHERE user_id = test_user_id AND amount > 0);

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error: %', SQLERRM;
    RAISE NOTICE 'Make sure test@testing.com exists in auth.users first!';
END $$;


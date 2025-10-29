# Mock Data Setup for Testing

## Running the Mock Data Script

To populate your test user (`test@testing.com`) with mock pantry data:

### Option 1: Via Supabase SQL Editor
1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `mock-data-test-user.sql`
4. Run the query

### Option 2: Via psql CLI
```bash
psql "your-connection-string" -f schema/mock-data-test-user.sql
```

### Option 3: Via Node.js script
```javascript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const sql = fs.readFileSync('./schema/mock-data-test-user.sql', 'utf8');

// Execute via RPC or direct SQL connection
```

## What Gets Created

### Pantry Items (50+ items)
The script creates a diverse pantry with:
- **Proteins**: Chicken, beef, salmon, eggs, bacon, tofu (6 items)
- **Dairy**: Milk, butter, cheese, yogurt, cream (6 items)
- **Vegetables**: Tomatoes, onions, garlic, peppers, carrots, broccoli, spinach, etc. (10 items)
- **Fruits**: Apples, bananas, oranges, lemons, strawberries (5 items)
- **Grains & Pasta**: Rice, pasta, bread, flour, oats, quinoa (6 items)
- **Condiments & Oils**: Olive oil, soy sauce, ketchup, mayo, honey (6 items)
- **Spices**: Salt, pepper, paprika, cumin, oregano, basil (6 items)
- **Canned Goods**: Tomatoes, chickpeas, beans, coconut milk, stock (5 items)

### Transaction History (30+ transactions)
- **Week 1**: Initial grocery shopping (~$62 spent)
- **Week 2**: Cooking activities and restocking (~$24 spent)
- **Week 3**: More cooking and fresh items (~$11 spent)
- **Week 4**: Recent shopping and meal prep (~$23 spent)

**Total Budget**: ~$120 spent over 30 days with realistic cooking patterns

### Price Snapshots
Current market prices for common ingredients to enable budget calculations:
- Chicken breast: $12/kg
- Ground beef: $15/kg
- Salmon: $25/kg
- Eggs: $0.40 each
- And more...

## Use Cases

This mock data supports testing:

1. **Recipe Search**: Search for recipes using ingredients like "chicken", "tomato", "pasta", etc.
2. **Budget Dashboard**: View spending over time with realistic transaction history
3. **Pantry Management**: Test filtering, sorting, and expiry date features
4. **Shopping List**: Generate lists based on missing ingredients
5. **Expiry Alerts**: Some items expire in 2-5 days for testing notifications

## Resetting Data

The script automatically clears existing data before inserting, so you can run it multiple times safely:

```sql
DELETE FROM pantry_txn WHERE user_id = test_user_id;
DELETE FROM pantry_item WHERE user_id = test_user_id;
DELETE FROM price_snapshot WHERE user_id = test_user_id;
```

## Notes

- Expiry dates are relative to `CURRENT_DATE` so they remain realistic whenever you run the script
- Transaction timestamps span the last 30 days
- All quantities use appropriate unit families (mass/volume/count)
- Prices are in USD and reflect reasonable market rates


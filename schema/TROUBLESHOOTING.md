# Troubleshooting: Pantry Data Not Showing

## Issue: Mock Data Inserted but Not Visible in App

### Understanding the Data Flow

Your Meelz app uses a **dual-storage architecture**:

1. **IndexedDB** (Browser local storage) - Primary data source for the UI
2. **Supabase** (Cloud database) - Backend sync and persistence

```
User opens app → Loads from IndexedDB → Displays in UI
                      ↕ (syncs)
                   Supabase DB
```

### Why Data Isn't Showing

The mock SQL script inserts data **directly into Supabase**, but the app **reads from IndexedDB first**. When you open the pantry page, it's showing an empty IndexedDB, not your Supabase data.

### Solution: Force a Sync from Supabase

#### Option 1: Clear IndexedDB and Reload (Recommended)

1. Open your browser DevTools (F12)
2. Go to **Application** tab
3. Find **IndexedDB** → **meelz-db**
4. Right-click and **Delete database**
5. Reload the page
6. The app should sync down from Supabase on first load

#### Option 2: Add Manual Sync Button

The app already has sync functionality. Check if there's a sync button or it syncs automatically on page load.

#### Option 3: Use the UI to Add Items

Since the app is designed to work offline-first, you can:
1. Click **"Add sample"** button in the pantry
2. Or manually add items through the form
3. These will auto-sync to Supabase

### Verifying Data in Supabase

Run these queries in **Supabase SQL Editor**:

```sql
-- Check if data was inserted
SELECT COUNT(*) FROM pantry_item 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com');

-- View all items
SELECT name, qty, unit FROM pantry_item 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com');
```

If these return 0 rows, the mock data script didn't run successfully.

### Common Issues

#### 1. User Doesn't Exist

**Error:** `INSERT or UPDATE on table "pantry_item" violates foreign key constraint`

**Fix:** Sign up with `test@testing.com` first through the app, then run the mock data script.

#### 2. RLS Policies Blocking Data

**Check:** Run this query to see if RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'pantry_item';
```

**Fix:** Ensure your RLS policies allow the authenticated user to view their own data.

#### 3. Script Ran But Data Isn't There

**Check:** Did you see the success message?
```
NOTICE:  Mock data inserted successfully for test user!
NOTICE:  Total pantry items: 50
NOTICE:  Total transactions: 30
```

If not, check the error message and make sure the user exists.

### Manual Sync Code (For Developers)

If you need to force a sync from Supabase to IndexedDB, you can add this to your pantry page:

```typescript
// Force sync from Supabase to IndexedDB
const forceSyncDown = async () => {
  const supabase = createClient();
  const { data: items } = await supabase
    .from('pantry_item')
    .select('*')
    .eq('user_id', user.id);
  
  if (items && db) {
    await db.pantry.clear();
    for (const item of items) {
      await db.pantry.add({
        id: item.id,
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        unit_family: item.unit_family,
        expiry_date: item.expiry_date,
        updated_at: Date.now()
      });
    }
    setItems(await db.pantry.toArray());
  }
};
```

### Chart Not Rendering

The chart requires:
1. **Valid transaction data** with amounts
2. **Non-zero values** in the date range

Run this to check:
```sql
SELECT DATE(created_at), COUNT(*), SUM(amount)
FROM pantry_txn 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'test@testing.com')
  AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at);
```

If this returns data but chart doesn't show, check browser console for JavaScript errors.

### Need Help?

1. Check browser console (F12) for errors
2. Verify Supabase connection in Network tab
3. Run the debug queries in `schema/debug-queries.sql`
4. Check RLS policies in `schema/policies.sql`


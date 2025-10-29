"use client";
import { useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useIndexedDb } from './useIndexedDb';

export function usePantrySync() {
  const db = useIndexedDb();

  // Sync UP: IndexedDB → Supabase
  const syncUp = useCallback(async () => {
    if (!db) return;
    const supabase = createClient();
    const local = await db.pantry.toArray();
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return;

    for (const row of local) {
      await supabase.from('pantry_item').upsert({
        id: row.id,
        user_id: uid,
        name: row.name,
        qty: row.qty,
        unit: row.unit,
        unit_family: row.unit_family,
        expiry_date: row.expiry_date
      });
    }
  }, [db]);

  // Sync DOWN: Supabase → IndexedDB
  const syncDown = useCallback(async () => {
    if (!db) return;
    const supabase = createClient();
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return;

    // Fetch all items from Supabase
    const { data: remoteItems } = await supabase
      .from('pantry_item')
      .select('*')
      .eq('user_id', uid);

    if (!remoteItems || remoteItems.length === 0) return;

    // Get existing local items
    const localItems = await db.pantry.toArray();
    const localIds = new Set(localItems.map(item => item.id));

    // Add or update items from Supabase
    for (const remoteItem of remoteItems) {
      const localData = {
        id: remoteItem.id,
        name: remoteItem.name,
        qty: remoteItem.qty ?? undefined,
        unit: remoteItem.unit ?? undefined,
        unit_family: remoteItem.unit_family ?? undefined,
        expiry_date: remoteItem.expiry_date ?? undefined,
        updated_at: Date.now()
      };

      if (localIds.has(remoteItem.id)) {
        // Update existing
        await db.pantry.update(remoteItem.id, localData);
      } else {
        // Add new
        await db.pantry.add(localData);
      }
    }

    console.log(`✅ Synced ${remoteItems.length} items from Supabase to IndexedDB`);
  }, [db]);

  // Full sync: Pull from Supabase first, then push local changes
  const syncNow = useCallback(async () => {
    await syncDown();
    await syncUp();
  }, [syncDown, syncUp]);

  return { syncNow, syncUp, syncDown };
}


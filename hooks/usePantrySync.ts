"use client";
import { useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useIndexedDb } from './useIndexedDb';

export function usePantrySync() {
  const db = useIndexedDb();

  const syncNow = useCallback(async () => {
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
        unit_family: row.unit_family
      });
    }
  }, [db]);

  return { syncNow };
}


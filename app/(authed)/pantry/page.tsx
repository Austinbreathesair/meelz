"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIndexedDb } from '@/hooks/useIndexedDb';
import { usePantrySync } from '@/hooks/usePantrySync';
import { Button } from '@/components/ui/Button';

export default function PantryPage() {
  const { user } = useAuth();
  const db = useIndexedDb();
  const { syncNow } = usePantrySync();
  const [items, setItems] = useState<Array<{ id: string; name: string; qty?: number; unit?: string }>>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    db?.pantry.toArray().then(setItems);
  }, [db]);

  const addItem = async () => {
    if (!db || !name) return;
    const id = crypto.randomUUID();
    await db.pantry.add({ id, name });
    setName('');
    setItems(await db.pantry.toArray());
    syncNow();
  };

  if (!user) return <div>Please sign in.</div>;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Pantry</h1>
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Add item" />
        <Button onClick={addItem}>Add</Button>
      </div>
      <ul className="divide-y rounded border bg-white">
        {items.map((it) => (
          <li key={it.id} className="p-3 flex items-center justify-between">
            <span>{it.name}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}


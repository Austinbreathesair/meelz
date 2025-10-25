"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIndexedDb } from '@/hooks/useIndexedDb';
import { usePantrySync } from '@/hooks/usePantrySync';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabaseClient';
import { ExpiryBanner } from '@/components/pantry/ExpiryBanner';

export default function PantryPage() {
  const { user } = useAuth();
  const db = useIndexedDb();
  const { syncNow } = usePantrySync();
  const [items, setItems] = useState<Array<{ id: string; name: string; qty?: number; unit?: string; unit_family?: 'mass'|'volume'|'count'; expiry_date?: string }>>([]);
  const [name, setName] = useState('');
  const [qty, setQty] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [family, setFamily] = useState<'' | 'mass' | 'volume' | 'count'>('');
  const [expiry, setExpiry] = useState('');
  const [q, setQ] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ qty?: number | ''; unit?: string; unit_family?: 'mass'|'volume'|'count'|''; expiry_date?: string }>({});

  useEffect(() => {
    db?.pantry.toArray().then(setItems);
  }, [db]);

  const addItem = async () => {
    if (!db || !name) return;
    const id = crypto.randomUUID();
    await db.pantry.add({ id, name, qty: qty === '' ? undefined : Number(qty), unit, unit_family: family || undefined, updated_at: Date.now(), expiry_date: expiry || undefined });
    setName('');
    setQty('');
    setUnit('');
    setFamily('');
    setExpiry('');
    setItems(await db.pantry.toArray());
    syncNow();
    // try to write to server + ledger when online
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (uid) {
        await supabase.from('pantry_item').upsert({ id, user_id: uid, name, qty: qty === '' ? null : Number(qty), unit: unit || null, unit_family: (family as any) || null, expiry_date: expiry || null });
        if (qty !== '' && family) {
          await supabase.from('pantry_txn').insert({ user_id: uid, pantry_item_id: id, ingredient_name: name, delta_qty_canonical: Number(qty), unit_family: family, reason: 'add' });
        }
      }
    } catch {}
  };

  const removeItem = async (id: string) => {
    if (!db) return;
    const it = await db.pantry.get(id);
    await db.pantry.delete(id);
    setItems(await db.pantry.toArray());
    syncNow();
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (uid) {
        await supabase.from('pantry_item').delete().eq('id', id);
        if (it?.qty && it.unit_family) {
          await supabase.from('pantry_txn').insert({ user_id: uid, ingredient_name: it.name, pantry_item_id: id, delta_qty_canonical: -Math.abs(it.qty), unit_family: it.unit_family, reason: 'delete' });
        }
      }
    } catch {}
  };

  const startEdit = (it: any) => {
    setEditingId(it.id);
    setEditDraft({ qty: it.qty ?? '', unit: it.unit ?? '', unit_family: (it.unit_family as any) ?? '', expiry_date: it.expiry_date ?? '' });
  };

  const saveEdit = async (it: any) => {
    if (!db) return;
    const old = await db.pantry.get(it.id);
    const newQty = editDraft.qty === '' ? undefined : Number(editDraft.qty as any);
    await db.pantry.update(it.id, {
      qty: newQty,
      unit: editDraft.unit || undefined,
      unit_family: (editDraft.unit_family as any) || undefined,
      expiry_date: editDraft.expiry_date || undefined,
      updated_at: Date.now(),
    });
    setItems(await db.pantry.toArray());
    setEditingId(null);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (uid) {
        await supabase.from('pantry_item').update({
          qty: newQty ?? null,
          unit: editDraft.unit || null,
          unit_family: (editDraft.unit_family as any) || null,
          expiry_date: editDraft.expiry_date || null,
        }).eq('id', it.id);
        const oldQty = (old?.qty ?? 0) as number;
        const delta = (newQty ?? 0) - oldQty;
        if (delta !== 0 && (editDraft.unit_family as any)) {
          await supabase.from('pantry_txn').insert({ user_id: uid, pantry_item_id: it.id, ingredient_name: it.name, delta_qty_canonical: delta, unit_family: editDraft.unit_family, reason: 'adjust' });
        }
      }
    } catch {}
  };

  if (!user) return <div>Please sign in.</div>;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Pantry</h1>
      <ExpiryBanner />
      <div className="flex gap-2 items-center">
        <input className="border rounded px-3 py-2 w-full" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pantry" />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <input className="border rounded px-3 py-2 w-28" value={qty} onChange={(e) => setQty(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Qty" />
        <input className="border rounded px-3 py-2 w-24" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" />
        <select className="border rounded px-3 py-2" value={family} onChange={(e) => setFamily(e.target.value as any)}>
          <option value="">Family</option>
          <option value="mass">mass</option>
          <option value="volume">volume</option>
          <option value="count">count</option>
        </select>
        <input type="date" className="border rounded px-3 py-2" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <Button onClick={addItem}>Add</Button>
      </div>
      <ul className="divide-y rounded border bg-white">
        {items
          .filter((it) => it.name.toLowerCase().includes(q.toLowerCase()))
          .map((it) => (
          <li key={it.id} className="p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>
                <span className="font-medium">{it.name}</span>
                {it.qty != null && <> — {it.qty}{it.unit ? ` ${it.unit}` : ''}</>}
                {it.expiry_date && <span className="ml-2 text-xs text-gray-500">(exp {it.expiry_date})</span>}
              </span>
              <div className="flex gap-3">
                {editingId === it.id ? (
                  <>
                    <button className="text-blue-700" onClick={() => saveEdit(it)}>Save</button>
                    <button className="text-gray-600" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="text-blue-700" onClick={() => startEdit(it)}>Edit</button>
                    <button className="text-red-600" onClick={() => removeItem(it.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
            {editingId === it.id && (
              <div className="flex flex-wrap gap-2">
                <input className="border rounded px-2 py-1 w-24" placeholder="Qty" value={editDraft.qty as any} onChange={(e) => setEditDraft((s) => ({ ...s, qty: e.target.value === '' ? '' : Number(e.target.value) }))} />
                <input className="border rounded px-2 py-1 w-24" placeholder="Unit" value={editDraft.unit || ''} onChange={(e) => setEditDraft((s) => ({ ...s, unit: e.target.value }))} />
                <select className="border rounded px-2 py-1" value={editDraft.unit_family || ''} onChange={(e) => setEditDraft((s) => ({ ...s, unit_family: e.target.value as any }))}>
                  <option value="">Family</option>
                  <option value="mass">mass</option>
                  <option value="volume">volume</option>
                  <option value="count">count</option>
                </select>
                <input type="date" className="border rounded px-2 py-1" value={editDraft.expiry_date || ''} onChange={(e) => setEditDraft((s) => ({ ...s, expiry_date: e.target.value }))} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

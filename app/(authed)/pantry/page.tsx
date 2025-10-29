"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIndexedDb } from '@/hooks/useIndexedDb';
import { usePantrySync } from '@/hooks/usePantrySync';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabaseClient';
import { ExpiryBanner } from '@/components/pantry/ExpiryBanner';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Page, PageHeader } from '@/components/ui/Page';
import EmptyState from '@/components/ui/EmptyState';

export default function PantryPage() {
  const { user } = useAuth();
  const db = useIndexedDb();
  const { syncNow, syncDown } = usePantrySync();
  const [items, setItems] = useState<Array<{ id: string; name: string; qty?: number; unit?: string; unit_family?: 'mass'|'volume'|'count'; expiry_date?: string }>>([]);
  const [name, setName] = useState('');
  const [qty, setQty] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [family, setFamily] = useState<'' | 'mass' | 'volume' | 'count'>('');
  const [expiry, setExpiry] = useState('');
  const [q, setQ] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ qty?: number | ''; unit?: string; unit_family?: 'mass'|'volume'|'count'|''; expiry_date?: string; unit_price?: number | '' }>({});
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [syncing, setSyncing] = useState(false);

  // Initial load: sync from Supabase first, then display
  useEffect(() => {
    const loadData = async () => {
      if (!db) return;
      // First sync down from Supabase
      await syncDown();
      // Then load from IndexedDB
      const allItems = await db.pantry.toArray();
      setItems(allItems);
    };
    loadData();
  }, [db, syncDown]);

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
          const unit_price = unitPrice === '' ? null : Number(unitPrice);
          const amount = unit_price ? Number(qty) * unit_price : null;
          await supabase.from('pantry_txn').insert({ user_id: uid, pantry_item_id: id, ingredient_name: name, delta_qty_canonical: Number(qty), unit_family: family, reason: 'add', unit_price, amount });
          if (unit_price) {
            try {
              await supabase.from('price_snapshot').insert({ user_id: uid, ingredient_key: name.toLowerCase(), unit_family: family, unit_price, source: 'manual', captured_at: new Date().toISOString().slice(0,10) });
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
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
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (it: any) => {
    setEditingId(it.id);
    setEditDraft({ qty: it.qty ?? '', unit: it.unit ?? '', unit_family: (it.unit_family as any) ?? '', expiry_date: it.expiry_date ?? '', unit_price: '' });
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
          const unit_price = editDraft.unit_price === '' ? null : Number(editDraft.unit_price as any);
          const amount = unit_price ? delta * unit_price : null;
          await supabase.from('pantry_txn').insert({ user_id: uid, pantry_item_id: it.id, ingredient_name: it.name, delta_qty_canonical: delta, unit_family: editDraft.unit_family, reason: 'adjust', unit_price, amount });
          if (unit_price) {
            try {
              await supabase.from('price_snapshot').insert({ user_id: uid, ingredient_key: it.name.toLowerCase(), unit_family: editDraft.unit_family, unit_price, source: 'manual', captured_at: new Date().toISOString().slice(0,10) });
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return <div>Please sign in.</div>;

  return (
    <Page>
      <PageHeader title="Pantry" subtitle="Manage ingredients with offline support and sync." />
      <ExpiryBanner />
      <div className="flex gap-2 items-center">
        <Input className="w-full" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pantry" />
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={async () => {
            setSyncing(true);
            await syncDown();
            const allItems = await db?.pantry.toArray();
            if (allItems) setItems(allItems);
            setSyncing(false);
          }}
          disabled={syncing}
        >
          {syncing ? '↻' : '⟳'} Sync
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <Input className="w-28" value={qty} onChange={(e) => setQty(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Qty" />
        <Input className="w-24" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" />
        <Select value={family} onChange={(e) => setFamily(e.target.value as any)}>
          <option value="">Family</option>
          <option value="mass">mass</option>
          <option value="volume">volume</option>
          <option value="count">count</option>
        </Select>
        <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <Input className="w-36" placeholder={`Price/${family || 'unit'}`} value={unitPrice} onChange={(e) => setUnitPrice((e.target as any).value === '' ? '' : Number((e.target as any).value))} />
        <Button onClick={addItem}>Add</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState title="Your pantry is empty" description="Add your first item to get smart recipe suggestions." action={<Button onClick={addItem}>Add sample</Button>} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
        {items
          .filter((it) => it.name.toLowerCase().includes(q.toLowerCase()))
          .map((it) => (
          <Card key={it.id} className="p-0">
            <CardBody className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <span>
                <span className="font-medium mr-2">{it.name}</span>
                {it.qty != null && <Badge>{it.qty}{it.unit ? ` ${it.unit}` : ''}</Badge>}
                {it.unit_family && <Badge tone="gray" className="ml-1 uppercase">{it.unit_family}</Badge>}
                {it.expiry_date && <Badge tone="amber" className="ml-2">exp {it.expiry_date}</Badge>}
                </span>
                <div className="flex gap-2">
                  {editingId === it.id ? (
                    <>
                    <Button variant="primary" size="sm" onClick={() => saveEdit(it)}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(it)}>Edit</Button>
                    <Button variant="secondary" size="sm" onClick={async () => {
                      const priceStr = prompt(`Set price per ${it.unit || 'unit'} for ${it.name}`);
                      if (!priceStr) return;
                      const price = Number(priceStr);
                      if (!Number.isFinite(price) || price <= 0) return alert('Invalid price');
                      const supabase = createClient();
                      const { data: userData } = await supabase.auth.getUser();
                      const uid = userData.user?.id;
                      if (!uid) return;
                      const fam = (it.unit_family as any) || (prompt('Enter unit family (mass|volume|count):') as any);
                      if (!fam || !['mass','volume','count'].includes(fam)) return alert('Invalid family');
                      await supabase.from('price_snapshot').insert({ user_id: uid, ingredient_key: it.name.toLowerCase(), unit_family: fam, unit_price: price, source: 'manual', captured_at: new Date().toISOString().slice(0,10) });
                      alert('Price saved');
                    }}>Price</Button>
                    <Button variant="danger" size="sm" onClick={() => removeItem(it.id)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
              {editingId === it.id && (
                <div className="flex flex-wrap gap-2">
                <Input className="w-24" placeholder="Qty" value={editDraft.qty as any} onChange={(e) => setEditDraft((s) => ({ ...s, qty: (e.target as any).value === '' ? '' : Number((e.target as any).value) }))} />
                <Input className="w-24" placeholder="Unit" value={editDraft.unit || ''} onChange={(e) => setEditDraft((s) => ({ ...s, unit: e.target.value }))} />
                <Select value={editDraft.unit_family || ''} onChange={(e) => setEditDraft((s) => ({ ...s, unit_family: e.target.value as any }))}>
                  <option value="">Family</option>
                  <option value="mass">mass</option>
                  <option value="volume">volume</option>
                  <option value="count">count</option>
                </Select>
                <Input type="date" value={editDraft.expiry_date || ''} onChange={(e) => setEditDraft((s) => ({ ...s, expiry_date: e.target.value }))} />
                <Input className="w-28" placeholder={`Price/${family || 'unit'}`} value={editDraft.unit_price as any} onChange={(e) => setEditDraft((s) => ({ ...s, unit_price: (e.target as any).value === '' ? '' : Number((e.target as any).value) }))} />
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </ul>
      )}
    </Page>
  );
}

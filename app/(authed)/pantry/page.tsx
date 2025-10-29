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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        <ul className="space-y-2">
        {items
          .filter((it) => it.name.toLowerCase().includes(q.toLowerCase()))
          .map((it) => {
            const isExpanded = expandedId === it.id;
            const isEditing = editingId === it.id;
            
            return (
              <Card key={it.id} className="overflow-hidden">
                <CardBody className="p-0">
                  {/* Accordion Header - Always visible */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : it.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{it.name}</span>
                      {it.qty != null && <Badge tone="aquamarine">{it.qty}{it.unit ? ` ${it.unit}` : ''}</Badge>}
                      {it.expiry_date && <Badge tone="amber">Exp: {it.expiry_date}</Badge>}
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Accordion Body - Shows when expanded */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                      {/* Item Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <span className="ml-2 font-medium">{it.qty ?? 'N/A'} {it.unit || ''}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Unit Family:</span>
                          <Badge tone="gray" className="ml-2 uppercase">{it.unit_family || 'N/A'}</Badge>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="ml-2 font-medium">{it.expiry_date || 'Not set'}</span>
                        </div>
                      </div>
                      
                      {/* Edit Form */}
                      {isEditing && (
                        <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900">Edit Item</h4>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <Input 
                              placeholder="Qty" 
                              value={editDraft.qty as any} 
                              onChange={(e) => setEditDraft((s) => ({ ...s, qty: (e.target as any).value === '' ? '' : Number((e.target as any).value) }))} 
                            />
                            <Input 
                              placeholder="Unit" 
                              value={editDraft.unit || ''} 
                              onChange={(e) => setEditDraft((s) => ({ ...s, unit: e.target.value }))} 
                            />
                            <Select 
                              value={editDraft.unit_family || ''} 
                              onChange={(e) => setEditDraft((s) => ({ ...s, unit_family: e.target.value as any }))}
                            >
                              <option value="">Family</option>
                              <option value="mass">mass</option>
                              <option value="volume">volume</option>
                              <option value="count">count</option>
                            </Select>
                            <Input 
                              type="date" 
                              value={editDraft.expiry_date || ''} 
                              onChange={(e) => setEditDraft((s) => ({ ...s, expiry_date: e.target.value }))} 
                            />
                            <Input 
                              placeholder={`Price per ${editDraft.unit || 'unit'}`} 
                              value={editDraft.unit_price as any} 
                              onChange={(e) => setEditDraft((s) => ({ ...s, unit_price: (e.target as any).value === '' ? '' : Number((e.target as any).value) }))} 
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                          <>
                            <Button variant="primary" size="sm" onClick={() => saveEdit(it)}>💾 Save</Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>✕ Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="secondary" size="sm" onClick={() => startEdit(it)}>✏️ Edit</Button>
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
                            }}>💰 Set Price</Button>
                            <Button variant="danger" size="sm" onClick={() => {
                              if (confirm(`Delete ${it.name}?`)) removeItem(it.id);
                            }}>🗑️ Delete</Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
      </ul>
      )}
    </Page>
  );
}

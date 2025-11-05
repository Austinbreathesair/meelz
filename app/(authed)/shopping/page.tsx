"use client";
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Page, PageHeader } from '@/components/ui/Page';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { computeShoppingListMerged } from '@/lib/shopping';

export default function ShoppingPage() {
  const supabase = createClient();
  const [recipes, setRecipes] = useState<Array<{ id: string; title: string }>>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [pantry, setPantry] = useState<any[]>([]);
  const [ings, setIngs] = useState<any[]>([]);
  const [list, setList] = useState<Array<{ name: string; need_qty?: number | null; need_unit?: string | null; note?: string | null }>>([]);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data: r } = await supabase.from('recipe').select('id, title').eq('author_id', uid).order('updated_at', { ascending: false });
      setRecipes(r || []);
      const { data: p } = await supabase.from('pantry_item').select('name, qty, unit, unit_family').eq('user_id', uid);
      setPantry(p || []);
    })();
  }, [supabase]);

  // Load ingredients whenever selected recipes change
  useEffect(() => {
    const loadIngredients = async () => {
      const ids = Object.keys(selected).filter((k) => selected[k]);
      if (!ids.length) { setIngs([]); setList([]); return; }
      const { data } = await supabase.from('ingredient').select('recipe_id, name, qty, unit, unit_family, position').in('recipe_id', ids).order('position');
      setIngs((data || []).map((r: any) => ({ name: r.name, qty: r.qty, unit: r.unit, unit_family: r.unit_family, position: r.position })));
    };
    
    loadIngredients();
  }, [selected, supabase]);

  const generate = () => {
    const diff = computeShoppingListMerged(pantry, ings);
    setList(diff);
  };

  const exportText = useMemo(() => {
    if (!list.length) return '';
    return list.map((l) => `- ${l.name}${l.need_qty != null ? `: ${l.need_qty}${l.need_unit ? ' ' + l.need_unit : ''}` : ''}${l.note ? ` (${l.note})` : ''}`).join('\n');
  }, [list]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(exportText); alert('Copied to clipboard'); } catch (e) { console.error(e); }
  };

  return (
    <Page>
      <PageHeader title="Shopping List" subtitle="Based on selected recipe vs your pantry." />
      <Card>
        <CardBody>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">Select recipes for your plan:</div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {recipes.map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={!!selected[r.id]} onChange={(e) => { const next = { ...selected, [r.id]: e.target.checked }; setSelected(next); }} />
                  <span>{r.title}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button onClick={generate} disabled={!Object.values(selected).some(Boolean)}>Generate List</Button>
              {exportText && <Button variant="secondary" onClick={copy}>Copy</Button>}
            </div>
          </div>
        </CardBody>
      </Card>
      {!list.length ? (
        <EmptyState title="No items yet" description="Choose a recipe and generate the list." />
      ) : (
        <Card>
          <CardBody>
            <ul className="space-y-2">
              {list.map((l, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" />
                  <span className="flex-1">{l.name}</span>
                  <span className="text-sm text-gray-700">{l.need_qty != null ? l.need_qty : ''} {l.need_unit || ''}</span>
                  {l.note && <span className="text-xs text-gray-500">{l.note}</span>}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </Page>
  );
}

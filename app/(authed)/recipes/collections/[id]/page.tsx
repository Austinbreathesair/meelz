"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page, PageHeader } from '@/components/ui/Page';

export default function CollectionEditorPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [items, setItems] = useState<Array<{ recipe_id: string; title: string; image_url?: string | null; position: number }>>([]);
  const [name, setName] = useState('');

  const load = async () => {
    const { data: col } = await supabase.from('collection').select('name').eq('id', params.id).maybeSingle();
    setName(col?.name || '');
    const { data } = await supabase
      .from('collection_item')
      .select('position, recipe:recipe_id(id, title, image_url)')
      .eq('collection_id', params.id)
      .order('position');
    const mapped = (data || []).map((row: any) => ({ recipe_id: row.recipe.id, title: row.recipe.title, image_url: row.recipe.image_url, position: row.position }));
    setItems(mapped);
  };

  useEffect(() => { load(); }, []);

  const onDragStart = (e: React.DragEvent<HTMLLIElement>, idx: number) => {
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const onDrop = async (e: React.DragEvent<HTMLUListElement>, idx: number) => {
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(from)) return;
    const arr = [...items];
    const [moved] = arr.splice(from, 1);
    arr.splice(idx, 0, moved);
    // reassign positions starting at 1
    const updated = arr.map((it, i) => ({ ...it, position: i + 1 }));
    setItems(updated);
    // persist
    for (const it of updated) {
      await supabase.from('collection_item').update({ position: it.position }).eq('collection_id', params.id).eq('recipe_id', it.recipe_id);
    }
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const remove = async (recipeId: string) => {
    await supabase.from('collection_item').delete().eq('collection_id', params.id).eq('recipe_id', recipeId);
    await load();
  };

  return (
    <Page>
      <PageHeader title={`Collection: ${name || '…'}`} subtitle={<Link className="text-blue-700 underline" href="/recipes/collections">Back to collections</Link>} />
      <ul onDragOver={onDragOver} className="space-y-2">
        {items.map((it, i) => (
          <Card key={it.recipe_id}>
            <CardBody>
              <li draggable onDragStart={(e) => onDragStart(e, i)} onDrop={(e) => onDrop(e, i)} className="flex items-center gap-3">
                {it.image_url && <img src={it.image_url} className="w-14 h-14 object-cover rounded" />}
                <span className="flex-1">{it.title}</span>
                <Button variant="danger" size="sm" onClick={() => remove(it.recipe_id)}>Remove</Button>
              </li>
            </CardBody>
          </Card>
        ))}
      </ul>
    </Page>
  );
}

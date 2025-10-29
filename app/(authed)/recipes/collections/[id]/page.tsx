"use client";
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import type React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Page, PageHeader } from '@/components/ui/Page';

export default function CollectionEditorPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [items, setItems] = useState<Array<{ recipe_id: string; title: string; image_url?: string | null; position: number }>>([]);
  const [name, setName] = useState('');

  const load = useCallback(async () => {
    const { data: col } = await supabase.from('collection').select('name').eq('id', params.id).maybeSingle();
    setName(col?.name || '');
    const { data } = await supabase
      .from('collection_item')
      .select('position, recipe:recipe_id(id, title, image_url)')
      .eq('collection_id', params.id)
      .order('position');
    const mapped = (data || []).map((row: any) => ({ recipe_id: row.recipe.id, title: row.recipe.title, image_url: row.recipe.image_url, position: row.position }));
    setItems(mapped);
  }, [supabase, params.id]);

  useEffect(() => { load(); }, [load]);

  const onDragStart = (e: React.DragEvent<HTMLElement>, idx: number) => {
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const onDrop = async (e: React.DragEvent<HTMLElement>, idx: number) => {
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
  const onDragOver = (e: React.DragEvent<HTMLElement>) => e.preventDefault();

  const remove = async (recipeId: string) => {
    await supabase.from('collection_item').delete().eq('collection_id', params.id).eq('recipe_id', recipeId);
    await load();
  };

  return (
    <Page>
      <PageHeader title={`Collection: ${name || '…'}`} subtitle={<Link className="text-blue-700 underline" href="/recipes/collections">Back to collections</Link>} />
      <ul onDragOver={onDragOver} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Card key={it.recipe_id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-0">
              <li draggable onDragStart={(e) => onDragStart(e, i)} onDrop={(e) => onDrop(e, i)} className="cursor-move">
                <Link href={`/recipes/${it.recipe_id}`} className="block">
                  {it.image_url && (
                    <Image 
                      src={it.image_url} 
                      alt={it.title} 
                      width={400} 
                      height={250} 
                      className="w-full h-48 object-cover rounded-t-lg" 
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 hover:text-aquamarine-600 transition-colors">
                      {it.title}
                    </h3>
                  </div>
                </Link>
                <div className="px-4 pb-4 pt-0">
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm(`Remove "${it.title}" from collection?`)) {
                        remove(it.recipe_id);
                      }
                    }}
                    className="w-full"
                  >
                    🗑️ Remove
                  </Button>
                </div>
              </li>
            </CardBody>
          </Card>
        ))}
      </ul>
    </Page>
  );
}

"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useIndexedDb } from '@/hooks/useIndexedDb';
import QuickView from '@/components/recipes/QuickView';
import { Card, CardBody } from '@/components/ui/Card';
import { Page, PageHeader } from '@/components/ui/Page';
import EmptyState from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

export default function RecipesPage() {
  const [querying, setQuerying] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const db = useIndexedDb();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<Record<string, any>>({});

  const search = async () => {
    setQuerying(true);
    try {
      const pantry = await db.pantry.toArray();
      const ings = pantry.map((p) => p.name);
      const res = await fetch('/api/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ingredients: ings }) });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
        // Prefetch details for first 8 results to show category
        const first = (data.results ?? []).slice(0, 8);
        const { fetchMealDetails } = await import('@/lib/mealdb');
        const entries = await Promise.all(first.map(async (r: any) => [r.id || r.source_ref, await fetchMealDetails(r.id || r.source_ref)] as const));
        const m: Record<string, any> = {};
        for (const [id, det] of entries) if (id && det) m[id] = det;
        setMeta(m);
      }
    } finally {
      setQuerying(false);
    }
  };
  const save = async (r: any) => {
    try {
      const supabase = (await import('@/lib/supabaseClient')).createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return alert('Sign in');
      // Hydrate full details from MealDB
      const { fetchMealDetails } = await import('@/lib/mealdb');
      const details = await fetchMealDetails(r.id || r.source_ref);
      const title = details?.title || r.title || 'Untitled';
      const image_url = details?.image_url || r.image_url || null;
      const description = details?.description || null;

      const { data, error } = await supabase
        .from('recipe')
        .insert({ author_id: uid, source: 'api', source_ref: r.id || r.source_ref || null, title, image_url, description, base_servings: 2 })
        .select('id')
        .single();
      if (error) return alert(error.message);
      if (details && data?.id) {
        const recipeId = data.id as string;
        if (details.ingredients.length) {
          await supabase.from('ingredient').insert(details.ingredients.map((ing) => ({
            recipe_id: recipeId,
            name: ing.name,
            qty: ing.qty ?? null,
            unit: ing.unit ?? null,
            unit_family: (ing.unit_family as any) ?? null,
            notes: ing.notes ?? null,
            position: ing.position,
          })));
        }
        if (details.instructions.length) {
          await supabase.from('instruction').insert(details.instructions.map((ins) => ({
            recipe_id: recipeId,
            step_no: ins.step_no,
            text: ins.text,
          })));
        }
        // Tags
        if (details.tags && details.tags.length) {
          for (const t of details.tags) {
            let tagId: number | undefined;
            try {
              const { data: tagRow } = await supabase.from('tag').insert({ name: t }).select('id').single();
              tagId = tagRow?.id;
            } catch (e) {
              const { data: tagRow } = await supabase.from('tag').select('id').eq('name', t).single();
              tagId = tagRow?.id;
            }
            if (tagId) {
              try { await supabase.from('recipe_tag').insert({ recipe_id: recipeId, tag_id: tagId }); } catch (e) { /* ignore dup */ }
            }
          }
        }
        // Category
        if (details.category) {
          let catId: number | undefined;
          try {
            const { data: catRow } = await supabase.from('category').insert({ name: details.category }).select('id').single();
            catId = catRow?.id;
          } catch (e) {
            const { data: catRow } = await supabase.from('category').select('id').eq('name', details.category!).single();
            catId = catRow?.id;
          }
          if (catId) {
            try { await supabase.from('recipe_category').insert({ recipe_id: recipeId, category_id: catId }); } catch (e) { /* ignore dup */ }
          }
        }
      }
      window.location.href = `/recipes/${data.id}`;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Page>
      <PageHeader title="Recipes" subtitle="Search suggestions based on your pantry." actions={<a className="underline text-sm" href="/recipes/saved">View saved</a>} />
      <div className="text-sm text-gray-600"><a className="underline" href="/recipes/saved">View saved recipes</a></div>
      <div className="flex gap-2">
        <Button disabled={querying} onClick={search}>{querying ? 'Searching…' : 'Search From Pantry'}</Button>
      </div>
      {results.length === 0 ? (
        <EmptyState title="No results yet" description="Search from your pantry to discover recipes." />
      ) : (
      <ul className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {results.map((r, i) => (
          <Card key={i}>
            <CardBody>
              <div className="flex gap-3">
                {r.image_url && <Image alt="thumb" src={r.image_url} width={64} height={64} className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <h3 className="font-medium">{r.title ?? 'Recipe'}</h3>
                  <div className="mt-1 flex gap-1">
                    {meta[r.id || r.source_ref]?.category && <Badge tone="green">{meta[r.id || r.source_ref].category}</Badge>}
                    {Array.isArray(meta[r.id || r.source_ref]?.tags) && meta[r.id || r.source_ref].tags.slice(0,2).map((t: string, i: number) => <Badge key={i}>{t}</Badge>)}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button onClick={() => save(r)}>Save</Button>
                <Button variant="secondary" onClick={() => { setPreviewId(r.id || r.source_ref); setOpen(true); }}>Quick View</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </ul>
      )}
      <QuickView mealId={previewId} open={open} onClose={() => setOpen(false)} />
    </Page>
  );
}

"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function RecipesPage() {
  const [querying, setQuerying] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    setQuerying(true);
    try {
      const res = await fetch('/api/share', { method: 'POST', body: JSON.stringify({ action: 'search' }) });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
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
      const { data, error } = await supabase.from('recipe').insert({ author_id: uid, source: 'api', title: r.title || 'Untitled', base_servings: 2 }).select('id').single();
      if (error) return alert(error.message);
      window.location.href = `/recipes/${data.id}`;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Recipes</h1>
      <div className="flex gap-2">
        <Button disabled={querying} onClick={search}>{querying ? 'Searching…' : 'Search From Pantry'}</Button>
      </div>
      <ul className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {results.map((r, i) => (
          <li key={i} className="rounded border bg-white p-3">
            <h3 className="font-medium">{r.title ?? 'Recipe'}</h3>
            <div className="mt-2">
              <Button onClick={() => save(r)}>Save</Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

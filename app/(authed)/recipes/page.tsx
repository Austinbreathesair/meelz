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
          </li>
        ))}
      </ul>
    </main>
  );
}

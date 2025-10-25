"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function AddToCollection({ recipeId }: { recipeId: string }) {
  const supabase = createClient();
  const [collections, setCollections] = useState<Array<{ id: string; name: string }>>([]);
  const [sel, setSel] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data } = await supabase.from('collection').select('id, name').eq('user_id', uid).order('name');
      setCollections(data || []);
    })();
  }, [supabase]);

  const createAndAdd = async () => {
    const name = prompt('New collection name?');
    if (!name) return;
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id!;
    const { data, error } = await supabase.from('collection').insert({ user_id: uid, name }).select('id').single();
    if (error) return alert(error.message);
    setCollections((c) => [...c, { id: data.id, name }]);
    setSel(data.id);
  };

  const add = async () => {
    if (!sel) return;
    // compute next position
    const { data: existing } = await supabase.from('collection_item').select('position').eq('collection_id', sel).order('position', { ascending: false }).limit(1);
    const pos = (existing?.[0]?.position ?? 0) + 1;
    try { await supabase.from('collection_item').insert({ collection_id: sel, recipe_id: recipeId, position: pos }); } catch (e) { /* ignore dup */ }
    alert('Added to collection');
  };

  return (
    <div className="flex items-center gap-2">
      <select className="border rounded px-2 py-1" value={sel} onChange={(e) => setSel(e.target.value)}>
        <option value="">Select collection</option>
        {collections.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button className="px-3 py-1 rounded bg-gray-200" onClick={createAndAdd}>New</button>
      <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={add} disabled={!sel}>Add</button>
    </div>
  );
}

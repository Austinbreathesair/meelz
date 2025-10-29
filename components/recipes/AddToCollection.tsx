"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import Select from '@/components/ui/Select';

export default function AddToCollection({ recipeId }: { recipeId: string }) {
  const supabase = createClient();
  const [collections, setCollections] = useState<Array<{ id: string; name: string }>>([]);
  const [sel, setSel] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id!;
      const { data, error } = await supabase.from('collection').insert({ user_id: uid, name }).select('id').single();
      if (error) {
        console.error('Error creating collection:', error);
        alert(`Failed to create collection: ${error.message}`);
        return;
      }
      setCollections((c) => [...c, { id: data.id, name }]);
      setSel(data.id);
    } finally {
      setLoading(false);
    }
  };

  const add = async () => {
    if (!sel) return;
    setLoading(true);
    try {
      // compute next position
      const { data: existing } = await supabase.from('collection_item').select('position').eq('collection_id', sel).order('position', { ascending: false }).limit(1);
      const pos = (existing?.[0]?.position ?? 0) + 1;
      const { error } = await supabase.from('collection_item').insert({ collection_id: sel, recipe_id: recipeId, position: pos });
      if (error) {
        console.error('Error adding to collection:', error);
        alert(`Failed to add to collection: ${error.message}`);
      } else {
        alert('✓ Added to collection');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select className="flex-1 min-w-[200px]" value={sel} onChange={(e) => setSel(e.target.value)}>
        <option value="">Select collection</option>
        {collections.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>
      <Button variant="secondary" size="sm" onClick={createAndAdd} disabled={loading}>+ New</Button>
      <Button size="sm" onClick={add} disabled={!sel || loading}>Add to Collection</Button>
    </div>
  );
}

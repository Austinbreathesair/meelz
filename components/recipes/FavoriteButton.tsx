"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function FavoriteButton({ recipeId }: { recipeId: string }) {
  const supabase = createClient();
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return setLoading(false);
      const { data } = await supabase.from('favorite').select('recipe_id').eq('user_id', uid).eq('recipe_id', recipeId).maybeSingle();
      if (!ignore) { setFav(!!data); setLoading(false); }
    })();
    return () => { ignore = true; };
  }, [recipeId]);

  const toggle = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return;
    if (fav) {
      await supabase.from('favorite').delete().eq('user_id', uid).eq('recipe_id', recipeId);
      setFav(false);
    } else {
      await supabase.from('favorite').insert({ user_id: uid, recipe_id: recipeId });
      setFav(true);
    }
    setLoading(false);
  };

  return (
    <button disabled={loading} onClick={toggle} className={`px-3 py-1 rounded ${fav ? 'bg-yellow-400' : 'bg-gray-200'}`}>
      {fav ? '★ Favourite' : '☆ Favourite'}
    </button>
  );
}


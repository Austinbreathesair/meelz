"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user };
}


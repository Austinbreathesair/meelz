"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((res: any) => setUser(res?.data?.user ?? null));
    const { data: authSub }: any = supabase.auth.onAuthStateChange((_e: any, session: any) => setUser(session?.user ?? null));
    return () => authSub?.subscription?.unsubscribe?.();
  }, []);

  return { user };
}

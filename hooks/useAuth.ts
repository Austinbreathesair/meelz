"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getUser().then((res: any) => {
      setUser(res?.data?.user ?? null);
      setLoading(false);
    });
    
    // Listen for auth changes
    const { data: authSub }: any = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    return () => authSub?.subscription?.unsubscribe?.();
  }, []);

  return { user, loading };
}

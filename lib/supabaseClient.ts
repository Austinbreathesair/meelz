import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  if (typeof window === 'undefined') {
    // Avoid creating a real client during SSR/prerender; client-only usage will re-create in browser.
    return new Proxy({}, {
      get() {
        throw new Error('Supabase client is only available in the browser context');
      }
    }) as any;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('@supabase/ssr: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createBrowserClient(url, key);
}

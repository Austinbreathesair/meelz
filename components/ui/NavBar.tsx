"use client";
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import Icon from '@/components/ui/Icon';

export function NavBar() {
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-5">
          <Link href="/pantry" className="font-semibold tracking-tight">MEELZ</Link>
          <Link href="/pantry" className="text-sm text-gray-700 inline-flex items-center gap-1"><Icon name="pantry" />Pantry</Link>
          <Link href="/recipes" className="text-sm text-gray-700 inline-flex items-center gap-1"><Icon name="recipes" />Recipes</Link>
          <Link href="/shopping" className="text-sm text-gray-700 inline-flex items-center gap-1"><Icon name="shopping" />Shopping</Link>
          <Link href="/recipes/saved" className="text-sm text-gray-700 inline-flex items-center gap-1"><Icon name="saved" />Saved</Link>
          <Link href="/recipes/collections" className="text-sm text-gray-700 inline-flex items-center gap-1"><Icon name="collections" />Collections</Link>
          <Link href="/dashboard" className="text-sm text-gray-700 inline-flex items-center gap-1"><Icon name="budget" />Budget</Link>
        </nav>
        <button onClick={signOut} className="text-sm rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">Sign out</button>
      </div>
    </header>
  );
}

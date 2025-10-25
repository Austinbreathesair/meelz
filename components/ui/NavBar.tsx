"use client";
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';

export function NavBar() {
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/pantry" className="font-semibold">MEELZ</Link>
          <Link href="/pantry" className="text-sm text-gray-700">Pantry</Link>
          <Link href="/recipes" className="text-sm text-gray-700">Recipes</Link>
          <Link href="/dashboard" className="text-sm text-gray-700">Budget</Link>
        </nav>
        <button onClick={signOut} className="text-sm rounded bg-gray-200 px-3 py-1">Sign out</button>
      </div>
    </header>
  );
}


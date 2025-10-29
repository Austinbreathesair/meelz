"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import Icon from '@/components/ui/Icon';

export function NavBar() {
  const pathname = usePathname();
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };
  
  const isActive = (path: string) => pathname?.startsWith(path);
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-6 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Logo - Left aligned */}
        <Link href="/pantry" className="text-2xl font-bold tracking-tight bg-gradient-aqua bg-clip-text text-transparent">
          MEELZ
        </Link>
        
        {/* Navigation - Center-right */}
        <nav className="flex items-center gap-8 flex-1 justify-center ml-8">
          <Link 
            href="/pantry" 
            className={`text-sm inline-flex items-center gap-2 transition-colors ${isActive('/pantry') ? 'text-aquamarine-600 font-medium' : 'text-gray-600 hover:text-aquamarine-500'}`}
          >
            <Icon name="pantry" />Pantry
          </Link>
          <Link 
            href="/recipes" 
            className={`text-sm inline-flex items-center gap-2 transition-colors ${isActive('/recipes') && !pathname?.includes('/saved') && !pathname?.includes('/collections') ? 'text-aquamarine-600 font-medium' : 'text-gray-600 hover:text-aquamarine-500'}`}
          >
            <Icon name="recipes" />Recipes
          </Link>
          <Link 
            href="/shopping" 
            className={`text-sm inline-flex items-center gap-2 transition-colors ${isActive('/shopping') ? 'text-aquamarine-600 font-medium' : 'text-gray-600 hover:text-aquamarine-500'}`}
          >
            <Icon name="shopping" />Shopping
          </Link>
          <Link 
            href="/recipes/saved" 
            className={`text-sm inline-flex items-center gap-2 transition-colors ${isActive('/recipes/saved') ? 'text-aquamarine-600 font-medium' : 'text-gray-600 hover:text-aquamarine-500'}`}
          >
            <Icon name="saved" />Saved
          </Link>
          <Link 
            href="/recipes/collections" 
            className={`text-sm inline-flex items-center gap-2 transition-colors ${isActive('/recipes/collections') ? 'text-aquamarine-600 font-medium' : 'text-gray-600 hover:text-aquamarine-500'}`}
          >
            <Icon name="collections" />Collections
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-sm inline-flex items-center gap-2 transition-colors ${isActive('/dashboard') ? 'text-aquamarine-600 font-medium' : 'text-gray-600 hover:text-aquamarine-500'}`}
          >
            <Icon name="budget" />Budget
          </Link>
        </nav>
        
        {/* Sign out - Right aligned */}
        <button 
          onClick={signOut} 
          className="text-sm rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all whitespace-nowrap"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

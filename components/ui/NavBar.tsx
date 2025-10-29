"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import Icon from '@/components/ui/Icon';

export function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/signin';
  };
  
  const isActive = (path: string) => pathname?.startsWith(path);
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 md:px-6 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Logo - Left aligned */}
        <Link href="/pantry" className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-aqua bg-clip-text text-transparent">
          MEELZ
        </Link>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center mx-8">
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
        
        {/* Desktop Sign out button - Hidden on mobile */}
        <button 
          onClick={signOut} 
          className="hidden lg:block text-sm rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all whitespace-nowrap"
        >
          Sign out
        </button>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-1">
            <Link 
              href="/pantry" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/pantry') ? 'bg-aquamarine-50 text-aquamarine-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Icon name="pantry" />Pantry
            </Link>
            <Link 
              href="/recipes" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/recipes') && !pathname?.includes('/saved') && !pathname?.includes('/collections') ? 'bg-aquamarine-50 text-aquamarine-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Icon name="recipes" />Recipes
            </Link>
            <Link 
              href="/shopping" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/shopping') ? 'bg-aquamarine-50 text-aquamarine-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Icon name="shopping" />Shopping
            </Link>
            <Link 
              href="/recipes/saved" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/recipes/saved') ? 'bg-aquamarine-50 text-aquamarine-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Icon name="saved" />Saved
            </Link>
            <Link 
              href="/recipes/collections" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/recipes/collections') ? 'bg-aquamarine-50 text-aquamarine-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Icon name="collections" />Collections
            </Link>
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-aquamarine-50 text-aquamarine-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Icon name="budget" />Budget
            </Link>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

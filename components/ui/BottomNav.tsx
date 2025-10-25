"use client";
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/Icon';

const items: ReadonlyArray<{ href: Route; label: string; icon: 'pantry' | 'recipes' | 'shopping' | 'budget' }> = [
  { href: '/pantry', label: 'Pantry', icon: 'pantry' },
  { href: '/recipes', label: 'Recipes', icon: 'recipes' },
  { href: '/shopping', label: 'Shopping', icon: 'shopping' },
  { href: '/dashboard', label: 'Budget', icon: 'budget' },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <ul className="grid grid-cols-4 gap-1 px-2 py-2">
        {items.map((it) => {
          const active = pathname?.startsWith(it.href);
          return (
            <li key={it.href} className="text-center">
              <Link href={it.href} className={`block text-sm px-2 py-1 rounded ${active ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                <div className="flex flex-col items-center gap-0.5">
                  <Icon name={it.icon} filled={active} />
                  <span>{it.label}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

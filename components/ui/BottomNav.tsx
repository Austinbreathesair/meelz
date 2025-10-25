"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/pantry', label: 'Pantry' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/recipes/saved', label: 'Saved' },
  { href: '/dashboard', label: 'Budget' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <ul className="grid grid-cols-4 gap-1 px-2 py-2">
        {items.map((it) => {
          const active = pathname?.startsWith(it.href);
          return (
            <li key={it.href} className="text-center">
              <Link href={it.href} className={`block text-sm px-2 py-1 rounded ${active ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{it.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

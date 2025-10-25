"use client";
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { NavBar } from '@/components/ui/NavBar';
import BottomNav from '@/components/ui/BottomNav';

export default function AuthedLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return (
    <main className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Please sign in</h1>
      <Link className="inline-block rounded bg-blue-600 px-4 py-2 text-white" href="/signin">Go to Sign in</Link>
    </main>
  );
  return (
    <div className="pb-16 space-y-6">
      <NavBar />
      <div className="px-1">{children}</div>
      <BottomNav />
    </div>
  );
}

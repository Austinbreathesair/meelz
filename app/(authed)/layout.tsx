"use client";
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { NavBar } from '@/components/ui/NavBar';
import BottomNav from '@/components/ui/BottomNav';

export default function AuthedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-aquamarine-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, show nothing (useEffect will redirect)
  if (!user) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="pb-20 lg:pb-6">{children}</div>
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </>
  );
}

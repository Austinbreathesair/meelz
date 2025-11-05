"use client";
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to pantry
    if (!loading && user) {
      router.push('/pantry');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
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

  // Don't render landing page if user is authenticated
  if (user) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-3xl font-bold tracking-tight bg-gradient-aqua bg-clip-text text-transparent">
            MEELZ
          </div>
          <div className="flex items-center gap-4">
            <a href="/signin" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Sign In</a>
            <a href="/signin" className="px-6 py-2.5 rounded-lg bg-gradient-aqua text-white font-medium shadow-md hover:shadow-lg transition-all">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-aquamarine-50 border border-aquamarine-200 text-aquamarine-700 text-sm font-medium mb-4">
              🎉 Your Smart Kitchen Companion
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-gray-900">
              Cook smarter with<br />
              <span className="bg-gradient-aqua bg-clip-text text-transparent">your pantry</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Save ingredients, discover recipes instantly, and track your budget — even offline. Your complete kitchen management solution.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <a href="/signin" className="px-8 py-4 rounded-lg bg-gradient-aqua text-white font-semibold shadow-lg hover:shadow-xl transition-all text-lg">
                Get Started Free
              </a>
              <a href="#features" className="px-8 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-lg">
                Learn More
              </a>
            </div>
            <p className="text-sm text-gray-500">No credit card required • Works offline • Free forever</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-xl text-gray-600">Manage your kitchen like a pro</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-aqua mb-6 flex items-center justify-center text-white">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Smart Pantry</h3>
              <p className="text-gray-600 leading-relaxed">Track ingredients offline-first with fast editing, expiry reminders, and automatic sync.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-aqua mb-6 flex items-center justify-center text-white">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Recipe Discovery</h3>
              <p className="text-gray-600 leading-relaxed">Find recipes based on what you have. Save, scale servings, and share with friends.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-aqua mb-6 flex items-center justify-center text-white">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Budget Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Monitor spending with daily, weekly, and monthly insights. Know exactly where your money goes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start cooking smarter today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of home cooks managing their kitchens efficiently
          </p>
          <a href="/signin" className="inline-block px-10 py-4 rounded-lg bg-white text-gray-900 font-bold shadow-2xl hover:shadow-3xl transition-all text-lg">
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-3xl font-bold tracking-tight bg-gradient-aqua bg-clip-text text-transparent mb-4">
            MEELZ
          </div>
          <p className="text-sm">© 2025 Meelz. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

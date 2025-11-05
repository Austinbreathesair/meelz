"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Get the correct site URL for OAuth redirects
  const getSiteUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  };

  // Redirect authenticated users to pantry
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/pantry');
    }
  }, [user, authLoading, router]);

  // Fix hydration error by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const signIn = async () => {
    setLoading(true); 
    setError(null);
    setSuccess(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const uid = data.user?.id;
      if (uid) {
        await supabase.from('profile').upsert({ id: uid, display_name: email.split('@')[0] }, { onConflict: 'id' });
      }
      // Use window.location for a full page refresh to ensure session is set
      window.location.href = '/pantry';
    }
  };

  const signUp = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
        data: {
          display_name: email.split('@')[0],
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Create profile
      const uid = data.user?.id;
      if (uid) {
        await supabase.from('profile').upsert({ id: uid, display_name: email.split('@')[0] }, { onConflict: 'id' });
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccess('Check your email for a confirmation link!');
        setLoading(false);
      } else {
        // Auto sign-in enabled - use window.location for full page refresh
        window.location.href = '/pantry';
      }
    }
  };

  const signInWith = async (provider: 'google') => {
    setLoading(true); 
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider, 
        options: { 
          redirectTo: `${getSiteUrl()}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        } 
      });
      if (error) setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === 'Enter') {
      mode === 'signin' ? signIn() : signUp();
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-aquamarine-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render signin page if user is authenticated
  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-gradient-aqua text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-gradient-aqua text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center bg-gradient-aqua bg-clip-text text-transparent mb-8">
          {mode === 'signin' ? 'LOGIN' : 'CREATE ACCOUNT'}
        </h1>
        
        <div className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-aquamarine-500 focus:bg-white transition-all outline-none text-gray-900"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-aquamarine-500 focus:bg-white transition-all outline-none text-gray-900"
            />
          </div>

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-aquamarine-500 focus:bg-white transition-all outline-none text-gray-900"
              />
            </div>
          )}

          {/* Remember Me (Sign In only) */}
          {mode === 'signin' && (
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-aquamarine-500 focus:ring-aquamarine-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={mode === 'signin' ? signIn : signUp}
            disabled={loading}
            className="w-full bg-gradient-aqua hover:shadow-lg hover:shadow-aquamarine-500/50 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (mode === 'signin' ? 'SIGNING IN...' : 'CREATING ACCOUNT...') : (mode === 'signin' ? 'LOGIN' : 'SIGN UP')}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or {mode === 'signin' ? 'login' : 'sign up'} with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={() => signInWith('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-aquamarine-400 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </div>

        {/* Back to Landing Link */}
        <div className="mt-6 text-center">
          <Link href="/landing" className="text-sm text-gray-600 hover:text-aquamarine-600 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SignInPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

  const signIn = async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      const uid = data.user?.id;
      if (uid) {
        await supabase.from('profile').upsert({ id: uid, display_name: email.split('@')[0] }, { onConflict: 'id' });
      }
      window.location.href = '/pantry';
    }
  };

  const signUp = async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else if (!data.user) {
      setError('Check your email to confirm your account before signing in.');
    } else {
      const uid = data.user.id;
      await supabase.from('profile').upsert({ id: uid, display_name: email.split('@')[0] }, { onConflict: 'id' });
      window.location.href = '/pantry';
    }
  };

  const signInWith = async (provider: 'github' | 'google') => {
    setLoading(true); setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${siteUrl}/pantry` } });
      if (error) setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <div className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" onClick={signIn} disabled={loading}>Sign in</button>
          <button className="px-4 py-2 rounded bg-gray-200" onClick={signUp} disabled={loading}>Sign up</button>
        </div>
        <div className="flex gap-2 pt-2">
          <button className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50" onClick={() => signInWith('github')} disabled={loading}>Continue with GitHub</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50" onClick={() => signInWith('google')} disabled={loading}>Continue with Google</button>
        </div>
      </div>
      <Link className="text-blue-600 underline" href="/landing">Back to landing</Link>
    </main>
  );
}

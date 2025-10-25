"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
    <main className="max-w-md mx-auto">
      <div className="rounded border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-gray-600 text-sm mt-1">Sign in to manage your pantry and recipes.</p>
        <div className="mt-5 space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={signIn} disabled={loading}>Sign in</Button>
            <Button variant="secondary" onClick={signUp} disabled={loading}>Create account</Button>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => signInWith('github')} disabled={loading}>Continue with GitHub</Button>
            <Button variant="danger" onClick={() => signInWith('google')} disabled={loading}>Continue with Google</Button>
          </div>
        </div>
        <div className="mt-4 text-sm">
          <Link className="text-blue-600 underline" href="/landing">Back to landing</Link>
        </div>
      </div>
    </main>
  );
}

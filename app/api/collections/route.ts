import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) return NextResponse.redirect(new URL('/signin', req.url));
  const fd = await req.formData();
  const name = String(fd.get('name') || '').trim();
  if (!name) return NextResponse.redirect(new URL('/recipes/collections', req.url));
  try {
    await supabase.from('collection').insert({ user_id: uid, name }).single();
  } catch (e) {
    // ignore duplicate names or errors; page will re-fetch
  }
  return NextResponse.redirect(new URL('/recipes/collections', req.url));
}

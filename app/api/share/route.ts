import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body?.action === 'search') {
    // Placeholder: this would call the Supabase Edge Function (searchRecipes)
    return NextResponse.json({ results: [{ title: 'Sample Recipe' }] });
  }
  return NextResponse.json({ ok: true });
}


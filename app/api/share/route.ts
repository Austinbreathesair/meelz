import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseAdmin';
import crypto from 'node:crypto';

export async function POST(req: NextRequest) {
  let body: any = {};
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    body = await req.json().catch(() => ({}));
  } else if (ct.includes('application/x-www-form-urlencoded') || ct.includes('form-data')) {
    const fd = await req.formData().catch(() => undefined);
    if (fd) body = Object.fromEntries(fd.entries());
  }
  if (body?.action === 'search') {
    return NextResponse.json({ results: [{ title: 'Sample Recipe' }] });
  }
  if (body?.recipeId) {
    const admin = createAdminClient();
    const slug = crypto.randomBytes(6).toString('hex');
    const { error } = await admin.from('share_link').insert({ recipe_id: body.recipeId, slug }).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ slug });
  }
  return NextResponse.json({ error: 'Bad request' }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  const admin = createAdminClient();
  const { data: link } = await admin.from('share_link').select('recipe_id').eq('slug', slug).maybeSingle();
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { data: recipe } = await admin
    .from('recipe')
    .select('id, title, description, image_url, base_servings')
    .eq('id', link.recipe_id)
    .maybeSingle();
  if (!recipe) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  return NextResponse.json({ recipe });
}

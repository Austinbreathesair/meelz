import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { makeKeyHash, twelveHoursMs } from '@/lib/cache';

type Input = { ingredients: string[] };

export async function POST(req: NextRequest) {
  let body: Input = { ingredients: [] } as any;
  try {
    body = await req.json();
  } catch (e) {
    console.error(e);
  }
  const ingredients = (body?.ingredients || [])
    .map((s) => String(s || '').trim().toLowerCase())
    .filter(Boolean);

  if (!ingredients.length) {
    return NextResponse.json({ results: [] });
  }

  const admin = createAdminClient();
  const keyHash = makeKeyHash(ingredients);

  // Try cache
  const nowIso = new Date().toISOString();
  const { data: cacheHit } = await admin
    .from('api_cache')
    .select('payload')
    .eq('key_hash', keyHash)
    .gt('expires_at', nowIso)
    .maybeSingle();
  if (cacheHit?.payload) {
    return NextResponse.json(cacheHit.payload);
  }

  // Call TheMealDB (free key '1') with filter by ingredient for each term; merge
  const urls = ingredients.map((ing) =>
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ing.replace(/\s+/g, '_'))}`
  );

  const resultsMap = new Map<string, any>();
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 60 * 60 } });
      if (!res.ok) continue;
      const json = await res.json();
      const meals = json?.meals || [];
      for (const m of meals) {
        const id = m.idMeal as string;
        if (!resultsMap.has(id)) {
          resultsMap.set(id, {
            id: id,
            source: 'api',
            source_ref: id,
            title: m.strMeal as string,
            image_url: (m.strMealThumb as string) || null,
            base_servings: 2,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const results = Array.from(resultsMap.values()).slice(0, 30);
  const payload = { results, provider: 'mealdb' };

  // Write cache
  const exp = new Date(Date.now() + twelveHoursMs).toISOString();
  await admin.from('api_cache').upsert({ key_hash: keyHash, payload, expires_at: exp });

  return NextResponse.json(payload);
}

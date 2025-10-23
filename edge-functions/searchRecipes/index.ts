import { makeKeyHash } from '../../lib/cache';

type Input = { ingredients: string[] };

async function externalFetch(ings: string[], apiKey?: string) {
  // Mock external API if no key
  if (!apiKey) {
    return ings.slice(0, 3).map((i, idx) => ({ id: `mock-${idx}`, title: `Use ${i}` }));
  }
  // Real implementation would call external API here
  return ings.map((i, idx) => ({ id: `real-${idx}`, title: `Recipe with ${i}` }));
}

export async function handler(req: Request) {
  const body = (await req.json()) as Input;
  const normalized = body.ingredients.map((s) => s.trim().toLowerCase());
  const keyHash = makeKeyHash(normalized);

  // Pseudo: In Supabase Edge, use the server client to check api_cache table
  // const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  // const { data: cached } = await supabase.from('api_cache').select('*').eq('key_hash', keyHash).gt('expires_at', new Date().toISOString()).maybeSingle();
  // if (cached) return new Response(JSON.stringify(cached.payload), { headers: { 'content-type': 'application/json' }});

  const results = await externalFetch(normalized, process.env.RECIPE_API_KEY);
  const payload = { results, keyHash };

  // await supabase.from('api_cache').upsert({ key_hash: keyHash, payload, expires_at: new Date(Date.now() + twelveHoursMs).toISOString() });

  return new Response(JSON.stringify(payload), { headers: { 'content-type': 'application/json' } });
}

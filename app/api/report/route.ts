import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

type DayBucket = { added: number; used: number; net: number };

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function GET(req: NextRequest) {
  const daysParam = Number(req.nextUrl.searchParams.get('days') || '30');
  const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 90) : 30;

  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const now = new Date();
  const from = new Date(startOfDay(now).getTime() - (days - 1) * 24 * 60 * 60 * 1000);

  // Fetch transactions within range
  const { data: txns } = await supabase
    .from('pantry_txn')
    .select('ingredient_name, delta_qty_canonical, unit_price, amount, created_at')
    .eq('user_id', uid)
    .gte('created_at', from.toISOString());

  const buckets = new Map<string, DayBucket>();
  const labels: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    labels.push(key);
    buckets.set(key, { added: 0, used: 0, net: 0 });
  }

  // If some amounts missing, try fetch latest price snapshots for ingredients used
  const names = Array.from(new Set((txns || []).map((t) => t.ingredient_name).filter(Boolean)));
  let priceMap = new Map<string, number>();
  if (names.length) {
    const { data: prices } = await supabase
      .from('price_snapshot')
      .select('ingredient_key, unit_price, captured_at')
      .eq('user_id', uid)
      .in('ingredient_key', names)
      .order('captured_at', { ascending: false });
    for (const p of prices || []) {
      if (!priceMap.has(p.ingredient_key)) priceMap.set(p.ingredient_key, Number(p.unit_price) || 0);
    }
  }

  for (const t of txns || []) {
    const dayKey = new Date(t.created_at).toISOString().slice(0, 10);
    const b = buckets.get(dayKey);
    if (!b) continue;
    const unitPrice = (t.unit_price as any) ?? priceMap.get(t.ingredient_name) ?? 0;
    const amtSigned = (typeof t.amount === 'number' ? t.amount : Number(t.delta_qty_canonical) * Number(unitPrice)) || 0;
    if (amtSigned >= 0) b.added += amtSigned; else b.used += -amtSigned;
    b.net += amtSigned;
  }

  // Build arrays
  const added = labels.map((d) => Number(buckets.get(d)?.added.toFixed(2) || 0));
  const used = labels.map((d) => Number(buckets.get(d)?.used.toFixed(2) || 0));
  const net = labels.map((d) => Number(buckets.get(d)?.net.toFixed(2) || 0));

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const summary = {
    total_added: Number(sum(added).toFixed(2)),
    total_used: Number(sum(used).toFixed(2)),
    total_net: Number(sum(net).toFixed(2))
  };

  return NextResponse.json({ labels, added, used, net, summary, range: days });
}

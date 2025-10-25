"use client";
import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

type Report = {
  labels: string[];
  added: number[];
  used: number[];
  net: number[];
  summary: { total_added: number; total_used: number; total_net: number };
  range: number;
};

export default function DashboardClient() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const currency = (process.env.NEXT_PUBLIC_CURRENCY as string) || '$';

  const load = async (d: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/report?days=${d}`, { cache: 'no-store' });
      if (!res.ok) return setData(null);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(days); }, [days]);

  const hasData = !!data && (data.added.some((v) => v > 0) || data.used.some((v) => v > 0) || data.net.some((v) => v !== 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Range:</span>
        <Button size="sm" variant={days === 7 ? 'primary' : 'secondary'} onClick={() => { setDays(7); load(7); }}>7</Button>
        <Button size="sm" variant={days === 30 ? 'primary' : 'secondary'} onClick={() => { setDays(30); load(30); }}>30</Button>
        <Button size="sm" variant={days === 90 ? 'primary' : 'secondary'} onClick={() => { setDays(90); load(90); }}>90</Button>
      </div>
      {loading && <p className="text-sm text-gray-600">Loading…</p>}
      {!loading && (!data || !hasData) && (
        <EmptyState
          title="No budget data yet"
          description="Add pantry items with unit prices or create price snapshots to see costs here."
          action={<a className="underline" href="/pantry">Go to Pantry</a>}
        />
      )}
      {!loading && data && hasData && (
        <div className="space-y-6">
          <section className="rounded border bg-white p-4">
            <h2 className="font-medium mb-2">Last {data.range} days</h2>
            <div className="text-sm text-gray-600 mb-2">Added: {currency}{data.summary.total_added.toFixed(2)} • Used: {currency}{data.summary.total_used.toFixed(2)} • Net: {currency}{data.summary.total_net.toFixed(2)}</div>
            <BarChart currency={currency} labels={data.labels} series={[{ name: 'Added', values: data.added, color: '#10b981' }, { name: 'Used', values: data.used, color: '#ef4444' }, { name: 'Net', values: data.net, color: '#3b82f6' }]} />
          </section>
        </div>
      )}
    </div>
  );
}

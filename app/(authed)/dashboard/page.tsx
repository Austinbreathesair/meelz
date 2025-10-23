import { createClient } from '@/lib/supabaseClient';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data } = await supabase.rpc('noop').single().catch(() => ({ data: null }));

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Budget Dashboard</h1>
      <p className="text-gray-600">Daily/weekly/monthly costs will appear here.</p>
      {!data && <div className="rounded border bg-white p-4">Placeholder: connect aggregates</div>}
    </main>
  );
}


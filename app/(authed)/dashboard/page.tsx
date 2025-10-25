export default async function DashboardPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Budget Dashboard</h1>
      {/* Client-side range selector and chart */}
      {/** @ts-expect-error Async Server Component using client child */}
      {(await import('@/components/dashboard/DashboardClient')).default()}
    </main>
  );
}

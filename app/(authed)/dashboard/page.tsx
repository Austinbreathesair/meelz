import DashboardClient from '@/components/dashboard/DashboardClient';

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Budget Dashboard</h1>
      <DashboardClient />
    </main>
  );
}

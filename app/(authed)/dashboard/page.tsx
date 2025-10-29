import DashboardClient from '@/components/dashboard/DashboardClient';
import { Page, PageHeader } from '@/components/ui/Page';

export default function DashboardPage() {
  return (
    <Page>
      <PageHeader 
        title="Budget Dashboard" 
        subtitle="Track your pantry spending and usage over time."
      />
      <DashboardClient />
    </Page>
  );
}

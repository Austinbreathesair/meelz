import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Link from 'next/link';
import { Page, PageHeader } from '@/components/ui/Page';
import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

export default async function CollectionsPage() {
  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) return <div className="p-4">Please sign in.</div>;
  const { data: collections } = await supabase.from('collection').select('id, name').eq('user_id', uid).order('name');

  return (
    <Page>
      <PageHeader title="Collections" subtitle="Group recipes for planning and sharing." />
      <form action="/api/collections" method="post" className="flex gap-2">
        <input type="text" name="name" className="border rounded px-3 py-2" placeholder="New collection name" required />
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
      </form>
      {(collections ?? []).length === 0 ? (
        <EmptyState title="No collections yet" description="Create a collection to start organizing your recipes." />
      ) : (
        <ul className="space-y-2">
          {(collections ?? []).map((c) => (
            <Card key={c.id}>
              <CardBody>
                <Link className="text-blue-700 underline" href={`/recipes/collections/${c.id}`}>{c.name}</Link>
              </CardBody>
            </Card>
          ))}
        </ul>
      )}
    </Page>
  );
}

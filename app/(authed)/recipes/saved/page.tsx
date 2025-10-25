import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Page, PageHeader } from '@/components/ui/Page';
import EmptyState from '@/components/ui/EmptyState';

export default async function SavedRecipesPage({ searchParams }: { searchParams?: { fav?: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) {
    return <div className="p-4">Please sign in.</div>;
  }
  const favOnly = searchParams?.fav === '1';
  let recipes: any[] | null = null;
  let favIds = new Set<string>();
  const { data: favRows } = await supabase.from('favorite').select('recipe_id').eq('user_id', uid);
  if (favRows) favIds = new Set(favRows.map((r: any) => r.recipe_id));
  if (favOnly) {
    const { data } = await supabase.from('favorite').select('recipe:recipe_id(id, title, description, image_url, updated_at)').eq('user_id', uid).order('created_at', { ascending: false });
    recipes = (data || []).map((r: any) => r.recipe);
  } else {
    const { data } = await supabase
      .from('recipe')
      .select('id, title, description, image_url, updated_at')
      .eq('author_id', uid)
      .order('updated_at', { ascending: false });
    recipes = data || [];
  }

  return (
    <Page>
      <PageHeader title="Saved Recipes" subtitle="Your saved and favourite recipes." />
      <div className="text-sm text-gray-600">
        <Link className="underline" href={favOnly ? '/recipes/saved' : '/recipes/saved?fav=1'}>{favOnly ? 'Show all' : 'Show favourites only'}</Link>
      </div>
      {(recipes ?? []).length === 0 ? (
        <EmptyState title="No saved recipes yet" description="Search and save recipes to see them here." />
      ) : (
      <ul className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {(recipes ?? []).map((r) => (
          <Card key={r.id}>
            <CardBody>
              <div className="flex gap-3">
                {r.image_url && <img src={r.image_url} alt="thumb" className="w-20 h-20 object-cover rounded" />}
                <div>
                  <Link className="font-medium text-blue-700" href={`/recipes/${r.id}`}>{r.title}</Link>
                  {favIds.has(r.id) && <span className="ml-2 text-yellow-500">★</span>}
                  {r.description && <p className="text-sm text-gray-600">{r.description}</p>}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </ul>
      )}
    </Page>
  );
}

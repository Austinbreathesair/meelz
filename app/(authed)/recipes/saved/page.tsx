import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Page, PageHeader } from '@/components/ui/Page';
import EmptyState from '@/components/ui/EmptyState';
import Image from 'next/image';

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
      <PageHeader 
        title="Saved Recipes" 
        subtitle="Your saved and favourite recipes."
        actions={
          <Link className="text-sm text-aquamarine-600 hover:text-aquamarine-700 font-medium underline" href={favOnly ? '/recipes/saved' : '/recipes/saved?fav=1'}>
            {favOnly ? '← Show all' : '⭐ Favourites only'}
          </Link>
        }
      />
      {(recipes ?? []).length === 0 ? (
        <EmptyState title="No saved recipes yet" description="Search and save recipes to see them here." />
      ) : (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(recipes ?? []).map((r) => (
          <Link key={r.id} href={`/recipes/${r.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardBody>
                <div className="flex flex-col gap-3">
                  {r.image_url && (
                    <Image src={r.image_url} alt="thumb" width={300} height={200} className="w-full h-40 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{r.title}</h3>
                      {favIds.has(r.id) && <span className="text-xl">⭐</span>}
                    </div>
                    {r.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.description}</p>}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
      )}
    </Page>
  );
}

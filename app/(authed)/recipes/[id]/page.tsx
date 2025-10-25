import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { scaleIngredients } from '@/lib/units';
import Link from 'next/link';
import FavoriteButton from '@/components/recipes/FavoriteButton';
import AddToCollection from '@/components/recipes/AddToCollection';
import { Page, PageHeader } from '@/components/ui/Page';
import { Card, CardBody } from '@/components/ui/Card';

export default async function RecipeDetail({ params, searchParams }: { params: { id: string }, searchParams: { servings?: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: recipe } = await supabase
    .from('recipe')
    .select('id, title, description, image_url, base_servings')
    .eq('id', params.id)
    .maybeSingle();
  const { data: ingredients } = await supabase
    .from('ingredient')
    .select('name, qty, unit, unit_family, position')
    .eq('recipe_id', params.id)
    .order('position');
  const { data: instructions } = await supabase
    .from('instruction')
    .select('step_no, text')
    .eq('recipe_id', params.id)
    .order('step_no');

  if (!recipe) return <div>Not found</div>;
  const servings = Number(searchParams.servings ?? recipe.base_servings);
  const scaled = scaleIngredients(ingredients ?? [], recipe.base_servings, servings);

  return (
    <Page>
      <PageHeader title={recipe.title} subtitle={recipe.description} actions={<FavoriteButton recipeId={recipe.id} />} />
      {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.title} className="w-full max-w-2xl rounded" />
      )}
      <div>
        <span className="font-medium">Servings:</span> {servings}
      </div>
      <div>
        <form action="" method="get" className="flex gap-2 items-center">
          <input type="number" name="servings" defaultValue={servings} className="border rounded px-3 py-1 w-24" />
          <button className="px-3 py-1 rounded bg-gray-200">Scale</button>
        </form>
      </div>
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc pl-6">
            {scaled.map((it, idx) => (
              <li key={idx}>{it.qty != null ? `${it.qty} ` : ''}{it.unit ?? ''} {it.name}</li>
            ))}
          </ul>
        </CardBody>
      </Card>
      {instructions && instructions.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal pl-6 space-y-1">
              {instructions.map((s, i) => (
                <li key={i}>{s.text}</li>
              ))}
            </ol>
          </CardBody>
        </Card>
      )}
      <form action="/api/share" method="post" className="pt-4">
        <input type="hidden" name="recipeId" value={recipe.id} />
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Create Share Link</button>
      </form>
      <div className="pt-2">
        <AddToCollection recipeId={recipe.id} />
      </div>
      <div>
        <Link className="text-blue-700 underline" href="/recipes">Back to search</Link>
      </div>
    </Page>
  );
}

import { createClient } from '@/lib/supabaseClient';
import { scaleIngredients } from '@/lib/units';
import Link from 'next/link';

export default async function RecipeDetail({ params, searchParams }: { params: { id: string }, searchParams: { servings?: string } }) {
  const supabase = createClient();
  const { data: recipe } = await supabase
    .from('recipe')
    .select('id, title, description, base_servings')
    .eq('id', params.id)
    .maybeSingle();
  const { data: ingredients } = await supabase
    .from('ingredient')
    .select('name, qty, unit, unit_family, position')
    .eq('recipe_id', params.id)
    .order('position');

  if (!recipe) return <div>Not found</div>;
  const servings = Number(searchParams.servings ?? recipe.base_servings);
  const scaled = scaleIngredients(ingredients ?? [], recipe.base_servings, servings);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">{recipe.title}</h1>
      <p>{recipe.description}</p>
      <div>
        <span className="font-medium">Servings:</span> {servings}
      </div>
      <div>
        <form action="" method="get" className="flex gap-2 items-center">
          <input type="number" name="servings" defaultValue={servings} className="border rounded px-3 py-1 w-24" />
          <button className="px-3 py-1 rounded bg-gray-200">Scale</button>
        </form>
      </div>
      <ul className="list-disc pl-6">
        {scaled.map((it, idx) => (
          <li key={idx}>{it.qty != null ? `${it.qty} ` : ''}{it.unit ?? ''} {it.name}</li>
        ))}
      </ul>
      <form action="/api/share" method="post" className="pt-4">
        <input type="hidden" name="recipeId" value={recipe.id} />
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Create Share Link</button>
      </form>
      <div>
        <Link className="text-blue-700 underline" href="/recipes">Back to search</Link>
      </div>
    </main>
  );
}

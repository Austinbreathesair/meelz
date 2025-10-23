import { createClient } from '@/lib/supabaseClient';
import { scaleIngredients } from '@/lib/units';

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
      <ul className="list-disc pl-6">
        {scaled.map((it, idx) => (
          <li key={idx}>{it.qty != null ? `${it.qty} ` : ''}{it.unit ?? ''} {it.name}</li>
        ))}
      </ul>
    </main>
  );
}


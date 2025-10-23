import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';

export default async function SharePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: link } = await supabase
    .from('share_link')
    .select('recipe_id, expires_at')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!link) {
    return <div>Link not found or expired.</div>;
  }

  const { data: recipe } = await supabase
    .from('recipe')
    .select('id, title, description, image_url, base_servings')
    .eq('id', link.recipe_id)
    .maybeSingle();

  if (!recipe) return <div>Recipe unavailable.</div>;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">{recipe.title}</h1>
      {recipe.description && <p className="text-gray-700">{recipe.description}</p>}
      <Link className="text-blue-600 underline" href={`/recipes/${recipe.id}`}>Open</Link>
    </main>
  );
}


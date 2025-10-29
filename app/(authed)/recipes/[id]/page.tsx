import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { scaleIngredients } from '@/lib/units';
import Link from 'next/link';
import FavoriteButton from '@/components/recipes/FavoriteButton';
import AddToCollection from '@/components/recipes/AddToCollection';
import ShoppingList from '@/components/recipes/ShoppingList';
import ShareRecipe from '@/components/recipes/ShareRecipe';
import { Page, PageHeader } from '@/components/ui/Page';
import { Card, CardBody } from '@/components/ui/Card';
import Image from 'next/image';

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
      <PageHeader 
        title={recipe.title} 
        subtitle={recipe.description}
        actions={<FavoriteButton recipeId={recipe.id} />}
      />

      {/* Recipe Overview Card with Image and Ingredients */}
      <Card>
        <CardBody>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div className="space-y-4">
              {recipe.image_url && (
                <Image 
                  src={recipe.image_url} 
                  alt={recipe.title} 
                  width={500} 
                  height={400} 
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              )}
              
              {/* Servings Control */}
              <div className="bg-gray-50 rounded-lg p-4">
                <form action="" method="get" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Servings:</label>
                    <span className="text-lg font-semibold text-aquamarine-600">{servings}</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      name="servings" 
                      defaultValue={servings} 
                      min="1"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-center font-medium"
                    />
                    <button className="px-5 py-2 rounded-lg bg-aquamarine-500 text-white hover:bg-aquamarine-600 transition-colors font-medium">
                      Scale
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Ingredients */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🥘</span> Ingredients
              </h2>
              <ul className="space-y-2">
                {scaled.map((it, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <span className="text-aquamarine-500 mt-1">•</span>
                    <span className="flex-1">
                      {it.qty != null && <span className="font-semibold text-gray-900">{it.qty} </span>}
                      {it.unit && <span className="text-gray-600">{it.unit} </span>}
                      <span className="text-gray-800">{it.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Instructions Card */}
      {instructions && instructions.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👨‍🍳</span> Instructions
            </h2>
            <ol className="space-y-4">
              {instructions.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-aqua text-white flex items-center justify-center font-semibold text-sm">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-gray-700 leading-relaxed pt-1">{s.text}</p>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      )}
      
      {/* Shopping List */}
      <ShoppingList recipeIngredients={scaled} />
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <ShareRecipe recipeId={recipe.id} recipeTitle={recipe.title} />
        <AddToCollection recipeId={recipe.id} />
      </div>
      
      {/* Back Link */}
      <div className="pt-4 border-t border-gray-200">
        <Link className="text-aquamarine-600 hover:text-aquamarine-700 font-medium inline-flex items-center gap-2" href="/recipes">
          <span>←</span> Back to search
        </Link>
      </div>
    </Page>
  );
}

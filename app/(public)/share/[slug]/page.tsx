import Link from 'next/link';
import { headers } from 'next/headers';
import { Card, CardBody } from '@/components/ui/Card';

export default async function SharePage({ params }: { params: { slug: string } }) {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/share?slug=${params.slug}`, { cache: 'no-store' });
  if (!res.ok) return <div>Link not found or expired.</div>;
  const { recipe, ingredients, instructions } = await res.json();
  if (!recipe) return <div>Recipe unavailable.</div>;
  return (
    <main className="space-y-4">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
        {recipe.description && <p className="text-gray-700">{recipe.description}</p>}
      </div>
      {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} className="w-full max-w-2xl rounded" />}
      {ingredients && ingredients.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc pl-6">
              {ingredients.map((it: any, idx: number) => (
                <li key={idx}>{it.qty != null ? `${it.qty} ` : ''}{it.unit ?? ''} {it.name}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
      {instructions && instructions.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal pl-6 space-y-1">
              {instructions.map((s: any, idx: number) => (<li key={idx}>{s.text}</li>))}
            </ol>
          </CardBody>
        </Card>
      )}
      <Link className="text-blue-600 underline" href={`/recipes/${recipe.id}`}>Open in app</Link>
    </main>
  );
}

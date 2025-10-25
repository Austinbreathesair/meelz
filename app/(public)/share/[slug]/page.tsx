import Link from 'next/link';
import { headers } from 'next/headers';

export default async function SharePage({ params }: { params: { slug: string } }) {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/share?slug=${params.slug}`, { cache: 'no-store' });
  if (!res.ok) return <div>Link not found or expired.</div>;
  const { recipe } = await res.json();
  if (!recipe) return <div>Recipe unavailable.</div>;
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">{recipe.title}</h1>
      {recipe.description && <p className="text-gray-700">{recipe.description}</p>}
      <Link className="text-blue-600 underline" href={`/recipes/${recipe.id}`}>Open</Link>
    </main>
  );
}

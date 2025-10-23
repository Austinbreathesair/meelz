export default function LandingPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Meelz</h1>
      <p className="text-gray-600">Pantry → Recipe PWA, offline-first.</p>
      <a className="inline-block rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" href="/pantry">
        Open Pantry
      </a>
      <p className="text-gray-700">Sign in to manage your pantry and discover recipes.</p>
    </main>
  );
}

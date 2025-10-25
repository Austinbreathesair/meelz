export default function LandingPage() {
  return (
    <main className="space-y-6">
      <div className="text-center space-y-3 py-10">
        <h1 className="text-4xl font-bold tracking-tight">Meelz</h1>
        <p className="text-gray-600">Pantry → Recipe PWA, offline-first.</p>
        <div className="flex justify-center gap-3">
          <a className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" href="/signin">Get started</a>
          <a className="inline-block rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" href="/pantry">Open Pantry</a>
        </div>
      </div>
    </main>
  );
}

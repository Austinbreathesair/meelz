export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-90" />
        <div className="relative px-6 py-20 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Cook smarter with your pantry</h1>
            <p className="text-white/90">Save ingredients, get instant recipe ideas, and track your budget — even offline.</p>
            <div className="flex justify-center gap-3">
              <a className="inline-block rounded bg-white/90 text-gray-900 px-5 py-2 hover:bg-white" href="/signin">Get started</a>
              <a className="inline-block rounded border border-white/80 px-5 py-2 hover:bg-white/10" href="/pantry">Open Pantry</a>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-10 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded border bg-white p-4">
            <h3 className="font-medium">Pantry</h3>
            <p className="text-sm text-gray-600">Offline-first, fast editing, expiry reminders.</p>
          </div>
          <div className="rounded border bg-white p-4">
            <h3 className="font-medium">Recipes</h3>
            <p className="text-sm text-gray-600">Search via ingredients, save, scale and share.</p>
          </div>
          <div className="rounded border bg-white p-4">
            <h3 className="font-medium">Budget</h3>
            <p className="text-sm text-gray-600">Simple ledger with daily/weekly/monthly totals.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

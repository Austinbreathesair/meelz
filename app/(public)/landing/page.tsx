export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative w-full px-6 py-24 text-white">
          <div className="w-full max-w-screen-2xl mx-auto text-center space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">Cook smarter with your pantry</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">Save ingredients, get instant recipe ideas, and track your budget — even offline.</p>
            <div className="flex justify-center gap-4 pt-4">
              <a className="inline-block rounded-lg bg-white text-gray-900 px-8 py-3 font-medium hover:bg-white/90 shadow-lg hover:shadow-xl transition-all" href="/signin">Get started</a>
              <a className="inline-block rounded-lg border-2 border-white/80 px-8 py-3 font-medium hover:bg-white/10 backdrop-blur-sm transition-all" href="/signin">Sign In</a>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gradient-aqua mb-4 flex items-center justify-center text-white font-bold text-xl">P</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Pantry</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Offline-first, fast editing, expiry reminders.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gradient-aqua mb-4 flex items-center justify-center text-white font-bold text-xl">R</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Recipes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Search via ingredients, save, scale and share.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gradient-aqua mb-4 flex items-center justify-center text-white font-bold text-xl">B</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Budget</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Simple ledger with daily/weekly/monthly totals.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

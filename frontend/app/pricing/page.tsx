// Helper component for the checkmark icon
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function PricingPage() {
  return (
    <main className="min-h-[90vh] w-full backdrop-blur-xl text-white p-8 bg-noise">
      
      {/* Background decorative shapes */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-cyan-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-violet-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

      {/* --- Header --- */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Find the Plan That Ignites You
        </h1>
        <p className="mt-4 text-slate-400">
          Whether you need a single spark or a continuous stream of inspiration, we have a plan that fits your creative workflow.
        </p>
      </div>

      {/* --- Pricing Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

        {/* --- Tier 1: Spark --- */}
        <div className="flex flex-col bg-slate-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold">Spark</h3>
          <p className="mt-2 text-slate-400">For a quick burst of insight.</p>
          <div className="mt-6">
            <span className="text-5xl font-bold">€5</span>
            <span className="text-slate-400"> / one-time</span>
          </div>
          <ul className="space-y-4 mt-8 flex-grow">
            <li className="flex items-center gap-3"><CheckIcon /> 1 Idea Credit</li>
            <li className="flex items-center gap-3"><CheckIcon /> Access to All Categories</li>
            <li className="flex items-center gap-3"><CheckIcon /> Standard Support</li>
          </ul>
          <button className="w-full mt-8 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors font-semibold">
            Get a Spark
          </button>
        </div>

        {/* --- Tier 2: Innovator (Highlighted) --- */}
        <div className="relative flex flex-col bg-slate-800/50 backdrop-blur-lg border border-indigo-500/50 rounded-2xl p-8 shadow-2xl">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold">Innovator</h3>
          <p className="mt-2 text-slate-400">For the consistent creative.</p>
          <div className="mt-6">
            <span className="text-5xl font-bold">€10</span>
            <span className="text-slate-400"> / month</span>
          </div>
          <ul className="space-y-4 mt-8 flex-grow">
            <li className="flex items-center gap-3"><CheckIcon /> 4 Ideas per Month</li>
            <li className="flex items-center gap-3"><CheckIcon /> Access to All Categories</li>
            <li className="flex items-center gap-3"><CheckIcon /> Save & Organize Ideas</li>
            <li className="flex items-center gap-3"><CheckIcon /> Priority Support</li>
          </ul>
          <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg transition-colors font-semibold">
            Choose Innovator
          </button>
        </div>

        {/* --- Tier 3: Visionary --- */}
        <div className="flex flex-col bg-slate-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold">Visionary</h3>
          <p className="mt-2 text-slate-400">For the professional ideator.</p>
          <div className="mt-6">
            <span className="text-5xl font-bold">€50</span>
            <span className="text-slate-400"> / month</span>
          </div>
          <ul className="space-y-4 mt-8 flex-grow">
            <li className="flex items-center gap-3"><CheckIcon /> 20 Ideas per Month</li>
            <li className="flex items-center gap-3"><CheckIcon /> Access to All Categories</li>
            <li className="flex items-center gap-3"><CheckIcon /> Save & Organize Ideas</li>
            <li className="flex items-center gap-3"><CheckIcon /> Early Access to New Features</li>
            <li className="flex items-center gap-3"><CheckIcon /> Dedicated Support</li>
          </ul>
          <button className="w-full mt-8 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors font-semibold">
            Become a Visionary
          </button>
        </div>
      </div>
    </main>
  );
}
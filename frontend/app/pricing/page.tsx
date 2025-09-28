// Helper component for the checkmark icon
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#872524]">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function PricingPage() {
  return (
    <main className="min-h-[90vh] w-full flex items-center justify-center  text-white p-8 bg-noise">

      <div className="w-full">
      {/* --- Header --- */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 py-1">
          Find the Plan That Ignites You
        </h1>
      </div>

      {/* --- Pricing Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

        {/* --- Tier 1: Spark --- */}
        <div className="flex flex-col bg-slate-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:scale-102 duration-300">
          <h3 className="text-2xl font-bold">Spark</h3>
          <p className="mt-2 text-slate-400">For a quick burst of insight.</p>
          <div className="mt-6">
            <span className="text-5xl font-bold">€1</span>
            <span className="text-slate-400"> / one-time</span>
          </div>
          <ul className="space-y-4 mt-8 flex-grow">
            <li className="flex items-center gap-3"><CheckIcon /> 1 Idea Credit</li>
            <li className="flex items-center gap-3"><CheckIcon /> Standard Support</li>
          </ul>
          <a 
            href="/checkout?plan=spark"
            className="block w-full mt-8 bg-[#872524] hover:bg-[#7a2121] p-3 rounded-lg transition-colors font-semibold text-center"
          >
            Get a Spark
          </a>
        </div>

        {/* --- Tier 2: Innovator (Highlighted) --- */}
        <div className="relative flex flex-col bg-slate-800/50 backdrop-blur-lg border border-[#872524] rounded-2xl p-8 hover:scale-102 duration-300">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#872524] text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold">Innovator</h3>
          <p className="mt-2 text-slate-400">For the consistent creative.</p>
          <div className="mt-6">
            <span className="text-5xl font-bold">€3</span>
            <span className="text-slate-400"> / month</span>
          </div>
          <ul className="space-y-4 mt-8 flex-grow">
            <li className="flex items-center gap-3"><CheckIcon /> 4 Idea Credits per Month</li>
            <li className="flex items-center gap-3"><CheckIcon /> E-Book for Ideavalidation</li>
            <li className="flex items-center gap-3"><CheckIcon /> Priority Support</li>
          </ul>
          <a 
            href="/checkout?plan=innovator"
            className="block w-full mt-8 bg-[#872524] hover:bg-[#7a2121] p-3 rounded-lg transition-colors font-semibold text-center"
          >
            Choose Innovator
          </a>
        </div>

        {/* --- Tier 3: Visionary --- */}
        <div className="flex flex-col bg-slate-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:scale-102 duration-300">
          <h3 className="text-2xl font-bold">Visionary</h3>
          <p className="mt-2 text-slate-400">For the professional ideator.</p>
          <div className="mt-6">
            <span className="text-5xl font-bold">€5</span>
            <span className="text-slate-400"> / month</span>
          </div>
          <ul className="space-y-4 mt-8 flex-grow">
            <li className="flex items-center gap-3"><CheckIcon /> 20 Idea Credits per Month</li>
            <li className="flex items-center gap-3"><CheckIcon /> E-Book for Ideavalidation</li>
            <li className="flex items-center gap-3"><CheckIcon /> Early Access to New Features</li>
            <li className="flex items-center gap-3"><CheckIcon /> Priority Support</li>
          </ul>
          <a 
            href="/checkout?plan=visionary"
            className="block w-full mt-8 bg-[#872524] hover:bg-[#7a2121] p-3 rounded-lg transition-colors font-semibold text-center"
          >
            Become a Visionary
          </a>
        </div>
        </div>
      </div>
    </main>
  );
}

// Helper component for icons
const Icon = ({ children }) => (
  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-700/50 border border-slate-600/80 rounded-lg">
    {children}
  </div>
);

export default function Home() {
  return (
    <main className="relative min-h-[90vh] w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center p-8 overflow-hidden text-white">
      
      {/* Left Column: The "Idea" Card */}
      <div
        className="
          relative z-10 flex flex-col text-center 
          max-w-lg w-full h-full justify-center 
          p-8 
          bg-black/20 backdrop-blur-2xl 
          border border-white/10 
          rounded-2xl
          hover:scale-102 duration-300
        "
      >
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
          idea
        </h1>
        <p className="text-gray-300 mt-4 max-w-md mx-auto">
          This is where your new idea will be displayed. It's a space designed for clarity and focus, allowing the concept to speak for itself.
        </p>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-md">
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-102 duration-300">
          <div className="flex items-start gap-4">
            <Icon>
              {/* --- ICON 1: Trending Up --- */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </Icon>
            <div>
              <h3 className="font-semibold text-lg text-gray-200">Beyond the Hype: Uncover Real, Emerging Problems</h3>
              <p className="text-base text-gray-400 mt-2">
                Stop chasing ideas that have already peaked. IdeaFinder moves you from the crowded mainstream to the promising new frontier. Our platform continuously scans real-time data from across the web, to spot arising problems as they happen. We don't just show you what's popular now; we give you the insights to build for where the market is headed. Get ahead of the curve and discover ideas with genuine, untapped potential.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-102 duration-300">
          <div className="flex items-start gap-4">
            <Icon>
              {/* --- ICON 2: Checklist --- */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </Icon>
            <div>
              <h3 className="font-semibold text-lg text-gray-200">From Idea to Actionable First Steps</h3>
              <p className="text-base text-gray-400 mt-2">
                Finding an idea is just the beginning. The real challenge is knowing how to start. IdeaFinder bridges the gap between inspiration and execution. For every promising idea, we provide a mini-blueprint to get you moving immediately. This includes potential business models (e.g., subscription, SaaS, e-commerce), a profile of your ideal first customer, and a curated list of the first three actionable steps to take. We don't just give you the "what," we give you the "how to start.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

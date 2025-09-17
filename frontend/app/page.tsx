// Helper component for icons
const Icon = ({ children }) => (
  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-700/50 border border-slate-600/80 rounded-lg">
    {children}
  </div>
);

export default function Home() {
  return (
    <main className="relative min-h-[90vh] w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center p-8 overflow-hidden text-white">
      
      {/* Background decorative shapes */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
      <div className="absolute top-0 -right-1/4 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>

      {/* Left Column: The "Idea" Card */}
      <div
        className="
          relative z-10 flex flex-col text-center 
          max-w-lg w-full h-full justify-center 
          p-8 
          bg-black/20 backdrop-blur-2xl 
          border border-white/10 
          rounded-2xl shadow-2xl
        "
      >
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
          idea
        </h1>
        <p className="text-gray-300 mt-4 max-w-md mx-auto">
          This is where your new idea will be displayed. It's a space designed for clarity and focus, allowing the concept to speak for itself.
        </p>
      </div>

      {/* Right Column: Updated textboxes */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-md">
        
        {/* Point 1 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10z"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10"/><path d="M12 2v20"/><path d="M22 12a10 10 0 0 1-10 10"/><path d="M2 12a10 10 0 0 0 10 10"/></svg>
            </Icon>
            <div>
              <h3 className="font-semibold text-lg text-gray-200">Beyond the Algorithm</h3>
              <p className="text-base text-gray-400 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>

        {/* Point 2 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M5 3v4"/><path d="M19 3v4"/><path d="M21 8H3"/><path d="M21 14H3"/><path d="M21 20H3"/></svg>
            </Icon>
            <div>
              <h3 className="font-semibold text-lg text-gray-200">Early Access to Insight</h3>
              <p className="text-base text-gray-400 mt-2">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>

        {/* Point 3 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </Icon>
            <div>
              <h3 className="font-semibold text-lg text-gray-200">A Universe of Concepts</h3>
              <p className="text-base text-gray-400 mt-2">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
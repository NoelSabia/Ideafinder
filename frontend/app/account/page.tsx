"use client"; // This page is interactive, so we need to make it a Client Component

import { useState } from 'react';

// --- Mock Data ---
// In a real app, this would come from an API call (e.g., using fetch or SWR)
const mockIdeas = [
  { id: 1, title: 'AI-Powered Personal Garden Assistant', description: 'An app that uses camera input to identify plant diseases, suggest watering schedules, and recommend optimal sunlight exposure. Integrates with weather APIs.' },
  { id: 2, title: 'Sustainable Fashion Swap Marketplace', description: 'A platform for users to trade high-quality clothing items, reducing textile waste. Features a point-based system instead of direct monetary transactions.' },
  { id: 3, title: 'Interactive Historical City Tour App', description: 'An AR-driven mobile app that overlays historical images and facts onto real-world locations as you walk through a city.' },
  { id: 4, title: 'Gamified Language Learning for Niche Languages', description: 'Focuses on underserved languages, using storytelling and community challenges to make learning engaging.' },
  { id: 5, title: 'Smart Waste Bin for Home Recycling', description: 'A bin that automatically sorts recyclables from trash using sensors and machine learning, providing data on household waste habits.' },
  { id: 6, title: 'Virtual Reality Cooking Classes with Chefs', description: 'An immersive experience where users can cook alongside famous chefs in a virtual kitchen, receiving real-time feedback.' },
];

const mockAccountInfo = {
  username: 'CreativeExplorer',
  totalIdeas: 27,
  subscriptionType: 'Pro Tier',
  memberSince: 'Oct 2023',
};
// --- End Mock Data ---


export default function AccountPage() {
  // State to track which idea is currently selected
  const [selectedIdea, setSelectedIdea] = useState(mockIdeas[0]);

  return (
    <main className="min-h-[90vh] w-full text-white p-4 sm:p-8">
      {/* Main 3-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">

        {/* --- Left Column: Ideas List --- */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Your Ideas</h2>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh]">
            {mockIdeas.map((idea) => (
              <button
                key={idea.id}
                onClick={() => setSelectedIdea(idea)}
                className={`
                  w-full text-left p-3 rounded-lg transition-colors text-sm
                  ${selectedIdea.id === idea.id
                    ? 'bg-[#872524] font-semibold shadow-lg'
                    : 'hover:bg-[#872524]'
                  }
                `}
              >
                {idea.title}
              </button>
            ))}
          </div>
        </div>

        {/* --- Middle Column: Selected Idea --- */}
        <div className="lg:col-span-2 flex items-center justify-center">
          <div
            className="
              relative z-10 flex flex-col text-center 
              w-full h-full justify-center 
              p-8 
              bg-black/20 backdrop-blur-2xl 
              border border-white/10 
              rounded-2xl shadow-2xl
            "
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
              {selectedIdea.title}
            </h1>
            <p className="text-gray-300 mt-4 max-w-xl mx-auto">
              {selectedIdea.description}
            </p>
          </div>
        </div>

        {/* --- Right Column: Account Information --- */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Account Details</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Username</span>
              <span className="font-medium text-slate-200">{mockAccountInfo.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Ideas</span>
              <span className="font-medium text-slate-200">{mockAccountInfo.totalIdeas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Plan</span>
              <span className="font-medium text-[#872524]">{mockAccountInfo.subscriptionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Member Since</span>
              <span className="font-medium text-slate-200">{mockAccountInfo.memberSince}</span>
            </div>
          </div>
          <button className="w-full mt-8 bg-[#872524] hover:bg-[#7a2121] p-3 rounded-lg transition-colors text-sm font-semibold">
            Manage Subscription
          </button>
        </div>

      </div>
    </main>
  );
}

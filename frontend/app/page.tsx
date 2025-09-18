"use client";

import { useState, useEffect } from 'react';
import IdeaCard from './components/ideaCard';

export type Idea = {
  id: number;
  problem: string;
  reason: string;
  mission: string;
  competition: string;
  potentialCustomers: string;
  whyPay: string;
  mvp: string;
  finishedProduct: string;
  createdAt: string;
};

const ideas: Idea[] = [
  {
    id: 1,
    problem: 'Recommendation Validator',
    reason: `The comment highlights a specific problem of validating recommendations within the anime community, indicating a potential for a software solution that helps users filter and verify recommendations based on trusted sources or user reviews. The pain of wasted time on poor recommendations suggests measurable user dissatisfaction, and it points to anime fans as a clear target user group, making it a concrete and actionable SaaS opportunity.`,
    mission: `To provide anime fans with a reliable platform for validating recommendations through trusted sources and user reviews, ensuring they spend their time on quality content.`,
    competition: `Existing platforms like MyAnimeList and AniList offer user ratings but lack a focused validation system for recommendations. Competitors include social media groups and forums where opinions may vary widely.`,
    potentialCustomers: `Anime enthusiasts looking for trustworthy recommendations, including casual viewers and dedicated fans. Benefits include saving time on poor content, discovering new favorites based on validated sources, and engaging with a community of like-minded individuals.`,
    whyPay: `Customers would pay for the assurance of quality recommendations, access to a curated list of trusted sources, and additional features like personalized suggestions and in-depth reviews, enhancing their viewing experience.`,
    mvp: `A simple web application that allows users to input anime titles and receive validation scores based on aggregated user reviews and expert ratings, along with a community discussion forum.`,
    finishedProduct: `A comprehensive SaaS platform featuring user profiles, personalized recommendation algorithms, extensive filtering options, integration with social media for sharing opinions, and a robust review system with gamification elements to encourage user engagement.`,
    createdAt: '2025-09-16 19:07:40.207031'
  },
  {
    id: 11,
    problem: 'Automated Time Tracking',
    reason: `The comment describes a concrete and specific problem of tracking billable time which is a common issue for consultants and freelancers, implying measurable pain (revenue leakage) and clearly identifying a target user group.`,
    mission: `To provide consultants, freelancers, and agencies with an intuitive tool that automates time tracking and billing, ensuring they capture every billable minute and maximize their revenue.`,
    competition: `Existing solutions like Toggl, Harvest, and Clockify offer time tracking features, but may lack specific automation for billing tailored to consultants and freelancers.`,
    potentialCustomers: `Consultants, freelancers, and agencies who need to accurately track billable hours and streamline their invoicing process, benefiting from reduced administrative work and increased revenue capture.`,
    whyPay: `Customers would pay for ConsultClock to eliminate revenue leakage, automate time tracking, and simplify billing processes, ultimately saving them time and increasing their profitability.`,
    mvp: `A basic application that tracks time spent on tasks through a simple timer, allows users to categorize time entries, and generates basic invoices based on tracked time.`,
    finishedProduct: `A comprehensive platform with advanced features such as automatic time tracking, integration with project management tools, customizable invoicing, reporting dashboards, and notifications for billable time reminders.`,
    createdAt: '2025-09-18 06:55:11.841268'
  },
  {
    id: 13,
    problem: 'International Onboarding',
    reason: `The comment identifies a clear and actionable problem related to international onboarding and compliance which can be addressed through a software solution. It highlights a frequent issue many companies face (scaling across borders), implies measurable pain (time wasted and complexity), and suggests a target user base (businesses dealing with international clients). Additionally, the problem is specific enough to support a differentiated SaaS product.`,
    mission: `To streamline international onboarding and compliance processes for businesses, making it easier to scale operations across borders while ensuring regulatory adherence.`,
    competition: `Existing solutions include companies like Deel, Remote, and Papaya Global, which offer global payroll and compliance solutions, but often do not focus specifically on the onboarding aspect.`,
    potentialCustomers: `Businesses operating internationally, particularly SaaS companies and e-commerce platforms, who would benefit from reduced onboarding time and improved compliance accuracy.`,
    whyPay: `Companies would pay for this solution to save time, reduce compliance risks, and avoid hidden fees associated with international transactions, leading to cost savings and smoother operations.`,
    mvp: `A basic platform that allows users to input their business location and desired international markets, generating a checklist of required documents and compliance steps for onboarding customers in those regions.`,
    finishedProduct: `A comprehensive SaaS application that integrates with existing CRM systems, providing real-time compliance checks, automated document collection, pricing transparency tools, and a dashboard for tracking onboarding progress across multiple countries.`,
    createdAt: '2025-09-18 06:58:34.683125'
  }
];

const Icon = ({ children }) => (
  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-800/80 border border-slate-700 rounded-lg">
    {children}
  </div>
);

export default function Home() {
  const [randomIdea, setRandomIdea] = useState<Idea | null>(null);

  const generateNewIdea = () => {
    const selectedIdea = ideas[Math.floor(Math.random() * ideas.length)];
    setRandomIdea(selectedIdea);
  };

  useEffect(() => {
    generateNewIdea();
  }, []);

  if (!randomIdea) {
    return (
      <main className="relative min-h-[90vh] w-full flex items-center justify-center p-8 overflow-hidden text-white">
        <p>Finding a brilliant idea...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-[90vh] w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-items-center p-8 overflow-hidden text-white">
      
      {/* --- Left Column: Welcome & USPs --- */}
      <div className="relative z-10 flex flex-col justify-center h-full w-full max-w-lg">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#872524]/20 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10 flex flex-col space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                Stop Searching.
                <br />
                Start Building.
              </h1>
              <p className="text-gray-300 mt-5 max-w-md text-lg">
                IdeaFinder is an AI-powered engine that uncovers validated business ideas from real-world problems, giving you the confidence to build your next venture.
              </p>
            </div>
            
            <ul className="space-y-5 border-t border-slate-800 pt-6">
              <li className="flex items-start gap-4">
                <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#872524]"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></Icon>
                <div>
                  <h3 className="font-semibold text-lg text-gray-200">Data-Driven Validation</h3>
                  <p className="text-base text-gray-400 mt-1">Go beyond hype. We analyze data to find ideas with genuine market demand.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Icon><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#872524]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></Icon>
                <div>
                  <h3 className="font-semibold text-lg text-gray-200">Actionable Blueprints</h3>
                  <p className="text-base text-gray-400 mt-1">Receive a full breakdown, from MVP to target customers, for every single idea.</p>
                </div>
              </li>
            </ul>

            <button 
              onClick={generateNewIdea}
              className="w-full text-lg font-semibold bg-white text-black py-3 rounded-lg hover:bg-gray-200 duration-300"
            >
                Generate New Idea
            </button>
        </div>
      </div>

      {/* --- Right Column: Using the new IdeaCard component --- */}
      <IdeaCard idea={randomIdea} />
      
    </main>
  );
}
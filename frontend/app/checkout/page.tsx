"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/app/components/CheckoutPage";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  
  // Plan pricing mapping
  const planPricing = {
    spark: { amount: 1, name: "Spark" },
    innovator: { amount: 3, name: "Innovator" },
    visionary: { amount: 5, name: "Visionary" }
  };

  const selectedPlan = plan && plan in planPricing ? planPricing[plan as keyof typeof planPricing] : null;

  // Check authentication status
  if (status === "loading") {
    return (
      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-[80vh] flex items-center justify-center text-white">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">You need to be logged in to purchase a subscription.</p>
          <div className="space-y-4">
            <a 
              href="/login" 
              className="block w-full bg-[#872524] hover:bg-[#7a2121] px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="block w-full border border-[#872524] text-[#872524] hover:bg-[#872524] hover:text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Create Account
            </a>
            <a 
              href="/pricing" 
              className="block text-gray-400 hover:text-white transition-colors"
            >
              Back to Pricing
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!selectedPlan) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Plan</h1>
          <p className="text-gray-400 mb-6">The selected plan is not valid.</p>
          <a 
            href="/pricing" 
            className="bg-[#872524] hover:bg-[#7a2121] px-6 py-3 rounded-lg transition-colors"
          >
            Back to Pricing
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center text-white p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-gray-400 mb-4">You're subscribing to the {selectedPlan.name} plan</p>
          <div className="text-2xl font-semibold">€{selectedPlan.amount} {plan === 'spark' ? '/ one-time' : '/ month'}</div>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: selectedPlan.amount * 100, // Convert to cents
            currency: "eur",
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#872524",
              },
            },
          }}
        >
          <CheckoutPage 
            amount={selectedPlan.amount} 
            planType={selectedPlan.name}
            userSession={session}
          />
        </Elements>
      </div>
    </main>
  );
}

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

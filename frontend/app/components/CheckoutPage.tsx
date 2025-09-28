"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

interface CheckoutPageProps {
  amount: number;
  planType?: string;
  userSession?: any;
}

const CheckoutPage = ({ amount, planType, userSession }: CheckoutPageProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const createPaymentIntent = useCallback(async () => {
    setIsInitializing(true);
    setErrorMessage(undefined);
    
    try {
      // Validate amount on client side
      if (amount <= 0 || amount > 999999.99) {
        throw new Error("Invalid payment amount");
      }

      const convertedAmount = convertToSubcurrency(amount);
      
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: convertedAmount,
          planType: planType,
          user_id: userSession?.user?.id,
          user_email: userSession?.user?.email
        }),
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create payment intent`);
      }

      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error("Invalid response: missing client secret");
      }
      
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Payment intent creation failed:", error);
      
      let userFriendlyMessage = "Failed to initialize payment. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          userFriendlyMessage = "Request timed out. Please check your connection and try again.";
        } else if (error.message.includes('Network')) {
          userFriendlyMessage = "Network error. Please check your connection.";
        } else if (error.message.includes('Invalid payment amount')) {
          userFriendlyMessage = "Invalid payment amount.";
        } else {
          userFriendlyMessage = error.message;
        }
      }
      
      setErrorMessage(userFriendlyMessage);
    } finally {
      setIsInitializing(false);
    }
  }, [amount, planType]);

  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, createPaymentIntent]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage("Payment system not ready. Please wait and try again.");
      setLoading(false);
      return;
    }

    try {
      // Submit form data to Stripe
      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw new Error(submitError.message || "Form submission failed");
      }

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?amount=${amount}&plan=${planType}`,
        },
      });

      if (error) {
        // Handle payment confirmation errors
        let userMessage = error.message || "Payment confirmation failed";
        
        // Provide more specific error messages
        if (error.type === 'card_error') {
          userMessage = error.message || "Your card was declined. Please try another payment method.";
        } else if (error.type === 'validation_error') {
          userMessage = "Please check your payment details and try again.";
        }
        
        throw new Error(userMessage);
      }
      
      // Payment succeeded - user will be redirected
    } catch (error) {
      console.error("Payment submission failed:", error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isInitializing || !clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {clientSecret && (
          <PaymentElement />
        )}

        {errorMessage && (
          <div className="text-red-500 bg-red-50 border border-red-200 rounded-md p-3 mb-4 mt-4">
            <p className="mb-2">{errorMessage}</p>
            {!clientSecret && (
              <button
                onClick={createPaymentIntent}
                className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                disabled={isInitializing}
              >
                {isInitializing ? "Retrying..." : "Retry"}
              </button>
            )}
          </div>
        )}

        <button
          disabled={!stripe || loading}
          className="text-white w-full p-4 bg-[#872524] hover:bg-[#7a2121] mt-4 rounded-lg font-bold disabled:opacity-50 disabled:animate-pulse transition-colors"
        >
          {!loading ? `Pay €${amount}` : "Processing..."}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;

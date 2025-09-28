import { Suspense } from 'react';

interface PaymentSuccessProps {
  searchParams: { amount?: string; plan?: string };
}

function PaymentSuccessContent({ amount, plan }: { amount: string | undefined; plan: string | undefined }) {
  // Validate and sanitize the amount parameter
  const sanitizedAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0 
    ? Number(amount).toFixed(2) 
    : null;

  const planName = plan || "Unknown";

  if (!sanitizedAmount) {
    return (
      <main className="max-w-4xl mx-auto p-10 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Invalid Payment Information</h1>
          <p className="text-red-600">
            We couldn't verify your payment details. Please contact support if you believe this is an error.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-10 text-white text-center min-h-[80vh] flex items-center justify-center">
      <div className="border rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 p-10 w-full max-w-2xl">
        <div className="mb-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-extrabold mb-4">Payment Successful!</h1>
          <h2 className="text-xl mb-6">Thank you for choosing {planName}</h2>
          
          <div className="bg-white p-4 rounded-lg text-green-600 mt-6 inline-block">
            <div className="text-sm text-gray-600 mb-1">Amount Paid</div>
            <div className="text-3xl font-bold">€{sanitizedAmount}</div>
          </div>
        </div>
        
        <div className="text-sm opacity-90">
          <p>Your subscription has been activated and you can now access your plan features.</p>
          <p className="mt-2">
            A confirmation email has been sent to your email address.
          </p>
          <p className="mt-2">
            If you have any questions, please contact our support team.
          </p>
        </div>

        <div className="mt-8">
          <a
            href="/account"
            className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Your Account
          </a>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage({ searchParams }: PaymentSuccessProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent amount={searchParams.amount} plan={searchParams.plan} />
    </Suspense>
  );
}

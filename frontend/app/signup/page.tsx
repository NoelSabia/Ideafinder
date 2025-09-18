"use client";

import { useState } from 'react';
// In a real Next.js project, these would be imported from the respective libraries.
// For this environment, we provide mock implementations.
// import { signIn } from "next-auth/react";
// import { useRouter } from 'next/navigation';

const signIn = async (provider: string, options?: any) => {
  console.log(`Attempting to sign up with ${provider}`, options);
  // Simulate an API call
  await new Promise(res => setTimeout(res, 500));
  
  // In a real scenario, the backend would handle user creation.
  // Here, we'll just simulate a successful sign-up and sign-in.
  return { ok: true, error: null };
};

const useRouter = () => ({
  push: (path: string) => {
    console.log(`Navigating to ${path}`);
    alert(`Account created successfully! Redirecting to ${path}...`);
  }
});

// A simple SVG icon component for the Google button
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.466,44,30.866,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCredentialsSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // In a real app, you would likely call a separate 'signup' API endpoint first.
    // Then, on success, you would call signIn.
    // For simplicity, we'll use signIn here to simulate registration and login.
    const result = await signIn('credentials', {
      redirect: false,
      name,
      email,
      password,
    });

    if (result?.error) {
      setError('Could not create account. Please try again.');
    } else if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-red-800/50 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 w-full bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
              Create an Account
            </h1>
            <p className="text-slate-400 mt-2">Get started on your journey.</p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 bg-slate-700/80 hover:bg-slate-700 border border-slate-600 rounded-lg py-3 font-semibold transition-colors duration-300"
          >
            <GoogleIcon />
            <span>Sign up with Google</span>
          </button>

          <div className="flex items-center">
            <hr className="flex-grow border-slate-600" />
            <span className="mx-4 text-xs font-medium text-slate-500">OR</span>
            <hr className="flex-grow border-slate-600" />
          </div>

          <form onSubmit={handleCredentialsSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-800/80"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-800/80"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-800/80"
                placeholder="••••••••"
              />
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-red-800/90 hover:bg-red-800 text-white font-bold py-3 rounded-lg transition-colors duration-300"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-red-500 hover:text-red-400">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-semibold text-black mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-black/60 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-8 py-4 rounded-full font-medium transition-all duration-200 bg-black text-white hover:bg-black/90 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-[0.99]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}



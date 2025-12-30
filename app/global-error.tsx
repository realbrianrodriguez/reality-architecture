'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#FFFFFF', margin: 0, padding: 0 }}>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-4xl font-semibold text-black mb-4">
              Something went wrong
            </h1>
            <p className="text-lg text-black/60 mb-8">
              A critical error occurred. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 rounded-full font-medium transition-all duration-200 bg-black text-white hover:bg-black/90 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-[0.99]"
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}



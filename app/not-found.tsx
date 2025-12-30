import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-semibold text-black mb-4">
          404
        </h1>
        <p className="text-lg text-black/60 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 rounded-full font-medium transition-all duration-200 bg-black text-white hover:bg-black/90 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-[0.99]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}



'use client';

import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#050505]">
            Reality Architecture
          </h1>
          <p className="text-xl md:text-2xl text-[rgba(5,5,5,0.64)]">
            A practical system for alignment and action.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8 text-lg md:text-xl text-[#050505] leading-relaxed">
          <p>
            Your week is shaped by defaults: what you assume, what you delay, what you repeat without noticing.
          </p>
          <p>
            This space makes those defaults visible—then gives you a way to respond with intention.
          </p>
        </div>

        <div className="space-y-4 md:space-y-6 text-base md:text-lg text-[rgba(5,5,5,0.64)] leading-relaxed">
          <p>No performance. No magical thinking.</p>
          <p>Just clearer attention and a deliberate next step.</p>
        </div>

        <div className="flex flex-col items-center space-y-8 pt-8">
          <Link href="/daily">
            <Button>Begin today</Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[rgba(5,5,5,0.55)]">
            <Link href="/weekly" className="hover:text-[#050505] transition-colors">
              Week
            </Link>
            <span>·</span>
            <Link href="/reality-scan" className="hover:text-[#050505] transition-colors">
              Mirror
            </Link>
            <span>·</span>
            <Link href="/identity-designer" className="hover:text-[#050505] transition-colors">
              Reframe
            </Link>
            <span>·</span>
            <Link href="/simulation" className="hover:text-[#050505] transition-colors">
              Paths
            </Link>
            <span>·</span>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('openOnboarding'));
              }}
              className="hover:text-[#050505] transition-colors"
            >
              Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

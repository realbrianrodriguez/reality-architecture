'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 md:px-16 lg:px-24 py-20 md:py-32 lg:py-40">
      {/* Subtle radial highlight behind hero - monochrome only */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(250, 250, 250, 0.6) 0%, transparent 70%)',
        }}
      />

      {/* Main content grid - 4/8px rhythm */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:gap-16">
          
          {/* Glass panel container */}
          <div className="glass-panel p-12 md:p-16 lg:p-20">

            <div className="relative z-10 space-y-10 md:space-y-12 lg:space-y-16">
                
                {/* Hero section */}
                <div className="space-y-8">
                  <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-[#050505]">
                    Reality Architecture
                  </h1>
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)] max-w-2xl">
                    A practical system for alignment and action.
                  </p>
                </div>

                {/* Body text */}
                <div className="space-y-6 max-w-3xl">
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                    Your week is shaped by defaults: what you assume, what you delay, what you repeat without noticing.
                  </p>
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                    This space makes those defaults visible—then gives you a way to respond with intention.
                  </p>
                </div>

                {/* Closing lines */}
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">No performance. No magical thinking.</p>
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">Just clearer attention and a deliberate next step.</p>
                </div>

                {/* CTA section */}
                <div className="flex flex-col items-start gap-8 md:gap-10 pt-4 md:pt-6">
                  {/* Primary CTA - ONLY place with accent color */}
                  <Link href="/daily" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-[20px]">
                    <button
                      className="px-10 md:px-12 py-5 md:py-6 rounded-[20px] font-semibold text-lg transition-all duration-[150ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] relative overflow-hidden group w-full"
                      style={{
                        background: '#2563EB',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25), 0 2px 8px rgba(37, 99, 235, 0.15)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.35), 0 4px 12px rgba(37, 99, 235, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.25), 0 2px 8px rgba(37, 99, 235, 0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span className="relative z-10">Begin today</span>
                      {/* Subtle shine effect */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[150ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                        }}
                      />
                    </button>
                  </Link>

                  {/* Secondary links - subtle, low emphasis */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-normal text-[rgba(5,5,5,0.48)]">
                    <Link 
                      href="/weekly" 
                      className="hover:text-[#050505] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-sm px-1"
                    >
                      Week
                    </Link>
                    <span className="text-[rgba(5,5,5,0.32)]">·</span>
                    <Link 
                      href="/reality-scan" 
                      className="hover:text-[#050505] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-sm px-1"
                    >
                      Mirror
                    </Link>
                    <span className="text-[rgba(5,5,5,0.32)]">·</span>
                    <Link 
                      href="/identity-designer" 
                      className="hover:text-[#050505] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-sm px-1"
                    >
                      Reframe
                    </Link>
                    <span className="text-[rgba(5,5,5,0.32)]">·</span>
                    <Link 
                      href="/simulation" 
                      className="hover:text-[#050505] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-sm px-1"
                    >
                      Paths
                    </Link>
                    <span className="text-[rgba(5,5,5,0.32)]">·</span>
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('openOnboarding'));
                      }}
                      className="hover:text-[#050505] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-sm px-1 text-left"
                    >
                      Guide
                    </button>
                  </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onOpenOnboarding?: () => void;
}

export default function Navbar({ onOpenOnboarding }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full relative z-50">
      <div className="glass-panel rounded-none border-x-0 border-t-0 rounded-b-[20px] backdrop-blur-[14px] bg-[rgba(255,255,255,0.75)] border-b border-[rgba(5,5,5,0.08)]">
        <div className="specular-highlight rounded-b-[20px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-[#050505] tracking-tight hover:opacity-80 transition-opacity"
          >
            Reality Architecture
          </Link>
          <div className="flex items-center flex-nowrap">
            {/* Primary Navigation */}
            <div className="flex items-center space-x-8 md:space-x-10 lg:space-x-12">
              <Link
                href="/"
                className={`text-sm font-normal relative whitespace-nowrap ${
                  isActive('/')
                    ? 'text-[#050505]'
                    : 'text-[rgba(5,5,5,0.48)] hover:text-[rgba(5,5,5,0.72)]'
                }`}
              >
                Home
                {isActive('/') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#050505]" />
                )}
              </Link>
              <Link
                href="/reality-scan"
                className={`text-sm font-normal relative whitespace-nowrap ${
                  isActive('/reality-scan')
                    ? 'text-[#050505]'
                    : 'text-[rgba(5,5,5,0.48)] hover:text-[rgba(5,5,5,0.72)]'
                }`}
              >
                Mirror
                {isActive('/reality-scan') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#050505]" />
                )}
              </Link>
              <Link
                href="/identity-designer"
                className={`text-sm font-normal relative whitespace-nowrap ${
                  isActive('/identity-designer')
                    ? 'text-[#050505]'
                    : 'text-[rgba(5,5,5,0.48)] hover:text-[rgba(5,5,5,0.72)]'
                }`}
              >
                Reframe
                {isActive('/identity-designer') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#050505]" />
                )}
              </Link>
              <Link
                href="/simulation"
                className={`text-sm font-normal relative whitespace-nowrap ${
                  isActive('/simulation')
                    ? 'text-[#050505]'
                    : 'text-[rgba(5,5,5,0.48)] hover:text-[rgba(5,5,5,0.72)]'
                }`}
              >
                Paths
                {isActive('/simulation') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#050505]" />
                )}
              </Link>
              <Link
                href="/daily"
                className={`text-sm font-normal relative whitespace-nowrap ${
                  isActive('/daily')
                    ? 'text-[#050505]'
                    : 'text-[rgba(5,5,5,0.48)] hover:text-[rgba(5,5,5,0.72)]'
                }`}
              >
                Today
                {isActive('/daily') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#050505]" />
                )}
              </Link>
              <Link
                href="/weekly"
                className={`text-sm font-normal relative whitespace-nowrap ${
                  isActive('/weekly')
                    ? 'text-[#050505]'
                    : 'text-[rgba(5,5,5,0.48)] hover:text-[rgba(5,5,5,0.72)]'
                }`}
              >
                Week
                {isActive('/weekly') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#050505]" />
                )}
              </Link>
            </div>

            {/* Secondary Navigation - Guide */}
            {onOpenOnboarding && (
              <>
                <div className="w-px h-4 bg-[rgba(5,5,5,0.12)] mx-6 md:mx-8 lg:mx-10" />
                <button
                  onClick={() => {
                    console.log("[NAVBAR] Open onboarding clicked");
                    onOpenOnboarding();
                  }}
                  className="text-sm font-normal text-[rgba(5,5,5,0.40)] hover:text-[rgba(5,5,5,0.60)] transition-colors whitespace-nowrap"
                >
                  Guide
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

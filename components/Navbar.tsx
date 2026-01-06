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
          <div className="flex space-x-6 md:space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-all relative ${
                isActive('/')
                  ? 'text-[#050505]'
                  : 'text-[rgba(5,5,5,0.55)] hover:text-[#050505]'
              }`}
            >
              Dashboard
              {isActive('/') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#050505] rounded-full" />
              )}
            </Link>
            <Link
              href="/reality-scan"
              className={`text-sm font-medium transition-all relative ${
                isActive('/reality-scan')
                  ? 'text-[#050505]'
                  : 'text-[rgba(5,5,5,0.55)] hover:text-[#050505]'
              }`}
            >
              Reality Scan
              {isActive('/reality-scan') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#050505] rounded-full" />
              )}
            </Link>
            <Link
              href="/identity-designer"
              className={`text-sm font-medium transition-all relative ${
                isActive('/identity-designer')
                  ? 'text-[#050505]'
                  : 'text-[rgba(5,5,5,0.55)] hover:text-[#050505]'
              }`}
            >
              Identity Designer
              {isActive('/identity-designer') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#050505] rounded-full" />
              )}
            </Link>
            <Link
              href="/simulation"
              className={`text-sm font-medium transition-all relative ${
                isActive('/simulation')
                  ? 'text-[#050505]'
                  : 'text-[rgba(5,5,5,0.55)] hover:text-[#050505]'
              }`}
            >
              Simulation
              {isActive('/simulation') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#050505] rounded-full" />
              )}
            </Link>
            <Link
              href="/daily"
              className={`text-sm font-medium transition-all relative ${
                isActive('/daily')
                  ? 'text-[#050505]'
                  : 'text-[rgba(5,5,5,0.55)] hover:text-[#050505]'
              }`}
            >
              Daily Calibration
              {isActive('/daily') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#050505] rounded-full" />
              )}
            </Link>
            <Link
              href="/weekly"
              className={`text-sm font-medium transition-all relative ${
                isActive('/weekly')
                  ? 'text-[#050505]'
                  : 'text-[rgba(5,5,5,0.55)] hover:text-[#050505]'
              }`}
            >
              Weekly review
              {isActive('/weekly') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#050505] rounded-full" />
              )}
            </Link>
            {onOpenOnboarding && (
              <button
                onClick={() => {
                  console.log("[NAVBAR] Open onboarding clicked");
                  onOpenOnboarding();
                }}
                className="text-sm font-medium text-[rgba(5,5,5,0.55)] hover:text-[#050505] transition-colors"
              >
                Onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

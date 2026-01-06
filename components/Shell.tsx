'use client';

import { ReactNode, useEffect, useState, useCallback } from 'react';
import Navbar from './Navbar';
import Onboarding, { isOnboardingCompleted } from './Onboarding';

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<'first-run' | 'manual' | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if onboarding should be shown on first run
    // Only check after client-side mount to avoid hydration mismatch
    if (!isOnboardingCompleted()) {
      setOnboardingMode('first-run');
      setOnboardingOpen(true);
    }

    // Listen for custom event to open onboarding from Home page
    const handleOpenOnboardingEvent = () => {
      setOnboardingMode('manual');
      setOnboardingOpen(true);
    };
    window.addEventListener('openOnboarding', handleOpenOnboardingEvent);
    return () => {
      window.removeEventListener('openOnboarding', handleOpenOnboardingEvent);
    };
  }, []);

  const handleOnboardingClose = useCallback(() => {
    setOnboardingOpen(false);
    // Don't reset mode immediately - let it persist until next open
  }, []);

  const handleOpenOnboarding = useCallback(() => {
    console.log("[NAVBAR] Open onboarding clicked");
    setOnboardingMode('manual');
    setOnboardingOpen(true);
  }, []);

  // Don't render anything until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="liquid-bg">
          <div className="noise-overlay" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar onOpenOnboarding={handleOpenOnboarding} />
          <main className="w-full flex-1">{children}</main>
          <footer className="w-full py-6 text-center">
            <p className="text-xs opacity-45 text-[#050505]">
              reality architecture — v0.1.0
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Liquid Architecture Background */}
      <div className="liquid-bg">
        <div className="noise-overlay" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onOpenOnboarding={handleOpenOnboarding} />
        <main className="w-full flex-1">{children}</main>
        <footer className="w-full py-6 text-center">
          <p className="text-xs opacity-45 text-[#050505]">
            reality architecture — v0.1.0
          </p>
        </footer>
      </div>

      {/* Onboarding Overlay */}
      {onboardingOpen && onboardingMode && (
        <Onboarding 
          onClose={handleOnboardingClose}
          onboardingMode={onboardingMode}
        />
      )}
    </div>
  );
}

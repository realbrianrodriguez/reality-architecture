'use client';

import { useEffect, useState, useCallback } from 'react';
import GlassPanel from './GlassPanel';
import Button from './Button';

interface OnboardingProps {
  onClose: () => void;
  onboardingMode: 'first-run' | 'manual';
}

const ONBOARDING_STORAGE_KEY = 'ra_onboarding_completed';

const screens = [
  {
    title: 'This is an orientation tool for attention and action.',
    body: (
      <>
        It's for people who believe attention, interpretation, and identity shape outcomes —
        without pretending that effort, context, or systems don't exist.
        <br /><br />
        Mindset matters.
        <br />
        Reality still applies.
        <br /><br />
        This app helps you orient before you act.
      </>
    ),
  },
  {
    title: 'No denial. No blame.',
    body: (
      <>
        You won't be told that everything happens for a reason.
        <br />
        You won't be told you "manifested" your struggles.
        <br />
        You won't be promised outcomes or shortcuts.
        <br /><br />
        If something doesn't work, it doesn't mean you failed.
        <br />
        It means something needs to be understood more clearly.
      </>
    ),
  },
  {
    title: 'Clarity before change.',
    body: (
      <>
        Bring real situations here — patterns you repeat, decisions you avoid, tensions you don't quite know how to name.
        <br /><br />
        The tools help you:
        <br />
        - separate circumstance from identity
        <br />
        - notice where attention is going
        <br />
        - choose grounded, testable actions
        <br /><br />
        Nothing here replaces work.
        <br />
        It helps you aim it.
      </>
    ),
  },
  {
    title: 'Calm is intentional.',
    body: (
      <>
        This app is quiet by design.
        <br /><br />
        No urgency.
        <br />
        No performance.
        <br />
        No pressure to transform.
        <br /><br />
        Just a place to think clearly —
        <br />
        again and again.
      </>
    ),
  },
];

export default function Onboarding({ onClose, onboardingMode }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleComplete = useCallback(() => {
    // Mark onboarding as completed in localStorage only on first-run or when user finishes
    // For manual opens, only mark completed if they click Begin/Finish
    if (onboardingMode === 'first-run' || currentStep === screens.length - 1) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
        }
      } catch (e) {
        // Fail open - if localStorage fails, just continue
        console.warn('Failed to save onboarding completion:', e);
      }
    }
    onClose();
  }, [onClose, onboardingMode, currentStep]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < screens.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleSkip = useCallback(() => {
    // Skip should mark completed only on first-run
    // For manual opens, just close without marking completed
    if (onboardingMode === 'first-run') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
        }
      } catch (e) {
        console.warn('Failed to save onboarding completion:', e);
      }
    }
    onClose();
  }, [onClose, onboardingMode]);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Keyboard accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (currentStep < screens.length - 1) {
          handleNext();
        } else {
          handleComplete();
        }
      } else if (e.key === 'Escape') {
        // Esc should NOT close if onboardingMode === 'first-run'
        // Esc SHOULD close if onboardingMode === 'manual'
        if (onboardingMode === 'manual') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, onboardingMode, onClose, handleNext, handleComplete]);

  const currentScreen = screens[currentStep];
  const isLastStep = currentStep === screens.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[rgba(255,255,255,0.85)] backdrop-blur-sm"
        onClick={onboardingMode === 'manual' ? onClose : undefined}
        style={{ cursor: onboardingMode === 'manual' ? 'pointer' : 'default' }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[720px]">
        <GlassPanel variant="stage" className="relative">
          {/* Progress indicator */}
          <div className="mb-8 text-sm font-medium text-[rgba(5,5,5,0.55)] text-center">
            {currentStep + 1}/{screens.length}
          </div>

          {/* Title */}
          <h1 
            key={`title-${currentStep}`}
            className={`text-3xl md:text-4xl font-bold text-[#050505] mb-8 text-center tracking-tight ${!reducedMotion ? 'onboarding-content' : ''}`}
          >
            {currentScreen.title}
          </h1>

          {/* Body */}
          <div 
            key={`body-${currentStep}`}
            className={`text-lg md:text-xl text-[rgba(5,5,5,0.64)] leading-relaxed mb-12 text-center ${!reducedMotion ? 'onboarding-content' : ''}`}
          >
            {currentScreen.body}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {/* Back button */}
            <div className="flex-1">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="text-sm font-medium text-[rgba(5,5,5,0.55)] hover:text-[#050505] transition-colors"
                >
                  Back
                </button>
              )}
            </div>

            {/* Skip button (screens 1-3 only) */}
            <div className="flex-1 text-center">
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  className="text-sm font-medium text-[rgba(5,5,5,0.55)] hover:text-[#050505] transition-colors"
                >
                  Skip
                </button>
              )}
            </div>

            {/* Next/Begin button */}
            <div className="flex-1 flex justify-end">
              {isLastStep ? (
                <Button onClick={handleComplete}>
                  Begin
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

// Utility function to check if onboarding is completed
export function isOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage?.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

// Utility function to reset onboarding (for testing)
export function resetOnboarding(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}


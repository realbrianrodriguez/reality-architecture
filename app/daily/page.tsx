'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import GlassPanel from '@/components/GlassPanel';
import HistorySection from '@/components/HistorySection';
import { DailyCalibrationResponse } from '@/utils/types';
import { saveRun } from '@/utils/history';
import { getTodayKey, markDone, isDone, getStreak } from '@/utils/dailyCompletion';

export default function DailyPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DailyCalibrationResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [todayKey, setTodayKey] = useState<string>(() => getTodayKey());
  const [doneToday, setDoneToday] = useState(false);
  const [streak, setStreak] = useState(0);

  // Initialize completion state on mount and when results change
  useEffect(() => {
    const today = getTodayKey();
    setTodayKey(today);
    setDoneToday(isDone(today));
    setStreak(getStreak());
  }, [results]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('[DAILY PAGE] Before fetch');
      
      const response = await fetch('/api/daily-calibration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      console.log('[DAILY PAGE] After fetch:', { status: response.status, statusText: response.statusText, ok: response.ok });

      let data;
      try {
        data = await response.json();
        console.log('[DAILY PAGE] After JSON parse:', { dataKeys: Object.keys(data), hasResults: !!data });
      } catch (parseError) {
        console.error('[DAILY PAGE] Failed to parse response as JSON:', parseError);
        const text = await response.text().catch(() => 'Unable to read response text');
        console.error('[DAILY PAGE] Response text:', text);
        throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        console.log('[DAILY PAGE] Error response:', data);
        throw new Error(data?.error || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('[DAILY PAGE] Setting results:', data);
      setResults(data);
      
      // Save to history (no input for daily calibration)
      saveRun('daily', '', data);
      setHistoryRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('[DAILY PAGE] Error caught:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = () => {
    if (!results || !todayKey) return;
    
    if (results.identityStatement && results.recommendedAction) {
      markDone(todayKey, {
        identityStatement: results.identityStatement,
        recommendedAction: results.recommendedAction,
      });
      
      setDoneToday(true);
      setStreak(getStreak());
    }
  };

  const hasResults = 
    results?.identityStatement?.trim().length > 0 &&
    results?.recommendedAction?.trim().length > 0;
  const showMarkDone = hasResults && !doneToday;

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-20">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#050505] mb-6">
              Daily Calibration
            </h1>
            <div className="mb-6 space-y-1">
              <p className="text-base text-[rgba(5,5,5,0.48)]">
                Today: {todayLabel}
              </p>
              <p className="text-base text-[rgba(5,5,5,0.48)]">
                Streak: {streak} {streak === 1 ? 'day' : 'days'}
              </p>
            </div>
            <p className="text-xl md:text-2xl text-[rgba(5,5,5,0.64)]">
              Get a 60-second identity and action check-in.
            </p>
          </div>

          <GlassPanel variant="stage">
            {!results ? (
              <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 200ms ease' }}>
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Generating...' : "Generate Today's Calibration"}
                </Button>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Identity Statement
                  </h2>
                  {results.identityStatement ? (
                    <p className="text-[#050505] text-xl leading-relaxed">
                      {results.identityStatement}
                    </p>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No identity statement returned. Please try again.
                    </p>
                  )}
                </div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Recommended Action
                  </h2>
                  {results.recommendedAction ? (
                    <p className="text-[#050505] text-xl leading-relaxed">
                      {results.recommendedAction}
                    </p>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No recommended action returned. Please try again.
                    </p>
                  )}
                </div>

                {showMarkDone && (
                  <div className="pt-4">
                    <Button onClick={handleMarkDone}>
                      Mark Done
                    </Button>
                  </div>
                )}

                {doneToday && (
                  <div className="pt-4">
                    <Button disabled className="opacity-50 cursor-not-allowed">
                      Completed today
                    </Button>
                  </div>
                )}
              </div>
            )}
          </GlassPanel>

          {error && (
            <div className="glass-panel p-6 border-red-300/50">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <HistorySection
            tool="daily"
            refreshKey={historyRefreshKey}
            renderResults={(output: DailyCalibrationResponse) => (
              <div className="space-y-8 md:space-y-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Identity Statement
                  </h2>
                  {output.identityStatement ? (
                    <p className="text-[#050505] text-xl leading-relaxed">
                      {output.identityStatement}
                    </p>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No identity statement returned. Please try again.
                    </p>
                  )}
                </div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Recommended Action
                  </h2>
                  {output.recommendedAction ? (
                    <p className="text-[#050505] text-xl leading-relaxed">
                      {output.recommendedAction}
                    </p>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No recommended action returned. Please try again.
                    </p>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </div>
  );
}

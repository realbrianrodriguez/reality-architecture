'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import GlassPanel from '@/components/GlassPanel';

interface WeeklyReviewResponse {
  weeklyTheme: string;
  observedPatterns: string[];
  nextWeekOrientation: string;
}

export default function WeeklyPage() {
  const [weekSummary, setWeekSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WeeklyReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setResults(null);
    setValidationMessage(null);

    // Validate input: at least 60 characters
    if (!weekSummary || weekSummary.trim().length < 60) {
      setValidationMessage('Give a little more detail (at least 60 characters) so the review can be accurate.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekSummary: weekSummary.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || `Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('[WEEKLY PAGE] Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const hasEmptyResults = results && 
    !results.weeklyTheme && 
    (!results.observedPatterns || results.observedPatterns.length === 0) && 
    !results.nextWeekOrientation;

  return (
    <div className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-16 md:space-y-20">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#050505] mb-6">
            Week
          </h1>
          <p className="text-xl md:text-2xl text-[rgba(5,5,5,0.64)]">
            A 5-minute reflection to set your direction for the week.
          </p>
        </div>

        <GlassPanel variant="stage">
          {!results ? (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-[rgba(5,5,5,0.55)] mb-3">
                  Week summary
                </label>
                <TextArea
                  value={weekSummary}
                  onChange={(e) => setWeekSummary(e.target.value)}
                  placeholder="In 3–6 sentences: What kept coming up this week? What did you avoid? What did you actually do? What felt heavy or clear?"
                />
              </div>
              <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 200ms ease' }}>
                <Button onClick={handleGenerate} disabled={loading || weekSummary.trim().length < 60}>
                  {loading ? 'Generating...' : 'Generate weekly theme'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-10">
              {hasEmptyResults ? (
                <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                  No clear weekly review returned. Try adding a little more detail and run again.
                </p>
              ) : (
                <>
                  {results.weeklyTheme && (
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                        Weekly theme
                      </h2>
                      <p className="text-[#050505] text-xl leading-relaxed">
                        {results.weeklyTheme}
                      </p>
                    </div>
                  )}

                  {results.observedPatterns && results.observedPatterns.length > 0 && (
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                        Observed patterns
                      </h2>
                      <ul className="space-y-4">
                        {results.observedPatterns.map((pattern, idx) => (
                          <li
                            key={idx}
                            className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                          >
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.nextWeekOrientation && (
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                        Next week orientation
                      </h2>
                      <p className="text-[#050505] text-xl leading-relaxed">
                        {results.nextWeekOrientation}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </GlassPanel>

        {validationMessage && (
          <div className="glass-panel p-6 border-[rgba(5,5,5,0.20)]">
            <p className="text-[rgba(5,5,5,0.64)] text-lg leading-relaxed">{validationMessage}</p>
          </div>
        )}

        {error && (
          <div className="glass-panel p-6 border-red-300/50">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}


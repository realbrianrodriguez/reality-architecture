'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import GlassPanel from '@/components/GlassPanel';
import HistorySection from '@/components/HistorySection';
import { RealityScanResponse } from '@/utils/types';
import { validateInput } from '@/utils/validation';
import { saveRun } from '@/utils/history';

function RealityScanContent() {
  const searchParams = useSearchParams();
  const debugMode = searchParams?.get('debug') === '1';
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RealityScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setValidationMessage(null);

    // Validate input before calling API
    const validation = validateInput(text);
    if (!validation.isValid) {
      setValidationMessage(validation.message || 'Please provide more detail.');
      return;
    }

    setLoading(true);

    try {
      const payload = { text };
      console.log('[REALITY-SCAN PAGE] Before fetch:', { text: text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : '', payload });
      
      const response = await fetch('/api/reality-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[REALITY-SCAN PAGE] After fetch:', { status: response.status, statusText: response.statusText, ok: response.ok });
      setHttpStatus(response.status);

      let data;
      try {
        data = await response.json();
        console.log('[REALITY-SCAN PAGE] After JSON parse:', { dataKeys: Object.keys(data), hasResults: !!data });
        if (debugMode) {
          setRawResponse(data);
        }
      } catch (parseError) {
        console.error('[REALITY-SCAN PAGE] Failed to parse response as JSON:', parseError);
        const text = await response.text().catch(() => 'Unable to read response text');
        console.error('[REALITY-SCAN PAGE] Response text:', text);
        throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        console.log('[REALITY-SCAN PAGE] Error response:', data);
        throw new Error(data?.error || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('[REALITY-SCAN PAGE] Setting results:', data);
      setResults(data);
      
      // Save to history
      saveRun('reality-scan', text, data);
      setHistoryRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('[REALITY-SCAN PAGE] Error caught:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-20">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#050505] mb-6">
              Reality Scan
            </h1>
            <p className="text-xl md:text-2xl text-[rgba(5,5,5,0.64)]">
              Describe a recurring situation, pattern, or feeling.
            </p>
          </div>

          <GlassPanel variant="stage">
            <form onSubmit={handleSubmit} className="space-y-8">
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Example: I always feel anxious before meetings, thinking people are judging me..."
                required
              />
              <div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Running Scan...' : 'Run Scan'}
                </Button>
              </div>
            </form>
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

          {results && (
            <div className="space-y-8 md:space-y-12">
              <GlassPanel variant="tight" delay={0} className="reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                  Detected Patterns
                </h2>
                {results.patterns && results.patterns.length > 0 ? (
                  <ul className="space-y-4">
                    {results.patterns.map((pattern, idx) => (
                      <li
                        key={idx}
                        className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                      >
                        {pattern}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                    No items returned. Try adding more detail (who/what/when) and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={100} className="reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                  Underlying Beliefs
                </h2>
                {results.beliefs && results.beliefs.length > 0 ? (
                  <ul className="space-y-4">
                    {results.beliefs.map((belief, idx) => (
                      <li
                        key={idx}
                        className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                      >
                        {belief}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                    No items returned. Try adding more detail (who/what/when) and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={200} className="reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                  Cognitive Distortions
                </h2>
                {results.distortions && results.distortions.length > 0 ? (
                  <ul className="space-y-4">
                    {results.distortions.map((distortion, idx) => (
                      <li
                        key={idx}
                        className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                      >
                        {distortion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                    No items returned. Try adding more detail (who/what/when) and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={300} className="reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                  Identity Narratives
                </h2>
                {results.identityNarratives && results.identityNarratives.length > 0 ? (
                  <ul className="space-y-4">
                    {results.identityNarratives.map((narrative, idx) => (
                      <li
                        key={idx}
                        className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                      >
                        {narrative}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                    No items returned. Try adding more detail (who/what/when) and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={400} className="reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                  Reframes
                </h2>
                {results.reframes && results.reframes.length > 0 ? (
                  <ul className="space-y-4">
                    {results.reframes.map((reframe, idx) => (
                      <li
                        key={idx}
                        className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                      >
                        {reframe}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                    No items returned. Try adding more detail (who/what/when) and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={500} className="reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                  New Assumptions
                </h2>
                {results.newAssumptions && results.newAssumptions.length > 0 ? (
                  <ul className="space-y-4">
                    {results.newAssumptions.map((assumption, idx) => (
                      <li
                        key={idx}
                        className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                      >
                        {assumption}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                    No items returned. Try adding more detail (who/what/when) and run again.
                  </p>
                )}
              </GlassPanel>

              {debugMode && (
                <GlassPanel variant="tight" delay={600} className="reveal border-2 border-blue-300/50">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#050505] mb-4">
                    Debug Info
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-[rgba(5,5,5,0.64)] mb-2">HTTP Status:</p>
                      <p className="text-[#050505] font-mono">{httpStatus ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[rgba(5,5,5,0.64)] mb-2">Raw Response:</p>
                      <pre className="text-xs text-[#050505] bg-[rgba(5,5,5,0.05)] p-4 rounded overflow-auto max-h-96">
                        {JSON.stringify(rawResponse ?? results, null, 2)}
                      </pre>
                    </div>
                  </div>
                </GlassPanel>
              )}
            </div>
          )}

          <HistorySection
            tool="reality-scan"
            refreshKey={historyRefreshKey}
            renderResults={(output: RealityScanResponse) => (
              <div className="space-y-8 md:space-y-12">
                <GlassPanel variant="tight" delay={0} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Detected Patterns
                  </h2>
                  {output.patterns && output.patterns.length > 0 ? (
                    <ul className="space-y-4">
                      {output.patterns.map((pattern, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No items returned. Try adding more detail (who/what/when) and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={100} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Underlying Beliefs
                  </h2>
                  {output.beliefs && output.beliefs.length > 0 ? (
                    <ul className="space-y-4">
                      {output.beliefs.map((belief, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {belief}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No items returned. Try adding more detail (who/what/when) and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={200} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Cognitive Distortions
                  </h2>
                  {output.distortions && output.distortions.length > 0 ? (
                    <ul className="space-y-4">
                      {output.distortions.map((distortion, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {distortion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No items returned. Try adding more detail (who/what/when) and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={300} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Identity Narratives
                  </h2>
                  {output.identityNarratives && output.identityNarratives.length > 0 ? (
                    <ul className="space-y-4">
                      {output.identityNarratives.map((narrative, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {narrative}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No items returned. Try adding more detail (who/what/when) and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={400} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    Reframes
                  </h2>
                  {output.reframes && output.reframes.length > 0 ? (
                    <ul className="space-y-4">
                      {output.reframes.map((reframe, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {reframe}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No items returned. Try adding more detail (who/what/when) and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={500} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
                    New Assumptions
                  </h2>
                  {output.newAssumptions && output.newAssumptions.length > 0 ? (
                    <ul className="space-y-4">
                      {output.newAssumptions.map((assumption, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {assumption}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No items returned. Try adding more detail (who/what/when) and run again.
                    </p>
                  )}
                </GlassPanel>
              </div>
            )}
          />
        </div>
      </div>
  );
}

export default function RealityScanPage() {
  return (
    <Suspense fallback={
      <div className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#050505] mb-6">
            Reality Scan
          </h1>
          <p className="text-xl md:text-2xl text-[rgba(5,5,5,0.64)]">
            Loading...
          </p>
        </div>
      </div>
    }>
      <RealityScanContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import GlassPanel from '@/components/GlassPanel';
import HistorySection from '@/components/HistorySection';
import { SimulationResponse } from '@/utils/types';
import { validateInput } from '@/utils/validation';
import { saveRun } from '@/utils/history';

export default function SimulationPage() {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setValidationMessage(null);

    // Validate input before calling API
    const validation = validateInput(scenario);
    if (!validation.isValid) {
      setValidationMessage(validation.message || 'Please provide more detail.');
      return;
    }

    setLoading(true);

    try {
      const payload = { scenario };
      console.log('[SIMULATION PAGE] Before fetch:', { scenario: scenario ? scenario.substring(0, 50) + (scenario.length > 50 ? '...' : '') : '', payload });
      
      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[SIMULATION PAGE] After fetch:', { status: response.status, statusText: response.statusText, ok: response.ok });

      let data;
      try {
        data = await response.json();
        console.log('[SIMULATION PAGE] After JSON parse:', { dataKeys: Object.keys(data), hasResults: !!data });
      } catch (parseError) {
        console.error('[SIMULATION PAGE] Failed to parse response as JSON:', parseError);
        const text = await response.text().catch(() => 'Unable to read response text');
        console.error('[SIMULATION PAGE] Response text:', text);
        throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        console.log('[SIMULATION PAGE] Error response:', data);
        throw new Error(data?.error || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('[SIMULATION PAGE] Setting results:', data);
      setResults(data);
      
      // Save to history
      saveRun('simulation', scenario, data);
      setHistoryRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('[SIMULATION PAGE] Error caught:', err);
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
              Simulation Paths
            </h1>
            <p className="text-xl md:text-2xl text-[rgba(5,5,5,0.64)]">
              Describe a scenario you care about (career, relationship, etc.).
            </p>
          </div>

          <GlassPanel variant="stage">
            <form onSubmit={handleSubmit} className="space-y-8">
              <TextArea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Example: I'm considering changing careers from marketing to software development..."
                required
              />
              <div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Running Simulation...' : 'Run Simulation'}
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
            <div className="space-y-10 md:space-y-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <GlassPanel variant="stage" delay={0} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-8">
                    Path A
                  </h2>
                  {results.pathA.summary ? (
                    <p className="text-[#050505] text-xl leading-relaxed mb-8">
                      {results.pathA.summary}
                    </p>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic mb-8">
                      No summary returned. Try adding more detail and run again.
                    </p>
                  )}
                  <h3 className="font-bold text-[#050505] mb-5 text-lg">Steps:</h3>
                  {results.pathA.steps && results.pathA.steps.length > 0 ? (
                    <ul className="space-y-4">
                      {results.pathA.steps.map((step, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {step}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No steps returned. Try adding more detail and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="stage" delay={150} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-8">
                    Path B
                  </h2>
                  {results.pathB.summary ? (
                    <p className="text-[#050505] text-xl leading-relaxed mb-8">
                      {results.pathB.summary}
                    </p>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic mb-8">
                      No summary returned. Try adding more detail and run again.
                    </p>
                  )}
                  <h3 className="font-bold text-[#050505] mb-5 text-lg">Steps:</h3>
                  {results.pathB.steps && results.pathB.steps.length > 0 ? (
                    <ul className="space-y-4">
                      {results.pathB.steps.map((step, idx) => (
                        <li
                          key={idx}
                          className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {step}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                      No steps returned. Try adding more detail and run again.
                    </p>
                  )}
                </GlassPanel>
              </div>

              <GlassPanel variant="tight" delay={300} className="reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-8">
                  Delta
                </h2>
                <div className="space-y-10">
                  <div>
                    <h3 className="font-bold text-[#050505] mb-5 text-lg">
                      Behavior Changes
                    </h3>
                    {results.delta.behaviorChanges && results.delta.behaviorChanges.length > 0 ? (
                      <ul className="space-y-4">
                        {results.delta.behaviorChanges.map((change, idx) => (
                          <li
                            key={idx}
                            className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                          >
                            {change}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                        No behavior changes returned. Try adding more detail and run again.
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-[#050505] mb-5 text-lg">
                      Outcome Differences
                    </h3>
                    {results.delta.outcomeDifferences && results.delta.outcomeDifferences.length > 0 ? (
                      <ul className="space-y-4">
                        {results.delta.outcomeDifferences.map((diff, idx) => (
                          <li
                            key={idx}
                            className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                          >
                            {diff}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                        No outcome differences returned. Try adding more detail and run again.
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-[#050505] mb-5 text-lg">
                      Identity Impact
                    </h3>
                    {results.delta.identityImpact && results.delta.identityImpact.length > 0 ? (
                      <ul className="space-y-4">
                        {results.delta.identityImpact.map((impact, idx) => (
                          <li
                            key={idx}
                            className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                          >
                            {impact}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                        No identity impact returned. Try adding more detail and run again.
                      </p>
                    )}
                  </div>
                </div>
              </GlassPanel>
            </div>
          )}

          <HistorySection
            tool="simulation"
            refreshKey={historyRefreshKey}
            renderResults={(output: SimulationResponse) => (
              <div className="space-y-10 md:space-y-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <GlassPanel variant="stage" delay={0} className="reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-8">
                      Path A
                    </h2>
                    {output.pathA.summary ? (
                      <p className="text-[#050505] text-xl leading-relaxed mb-8">
                        {output.pathA.summary}
                      </p>
                    ) : (
                      <p className="text-[rgba(5,5,5,0.48)] text-lg italic mb-8">
                        No summary returned. Try adding more detail and run again.
                      </p>
                    )}
                    <h3 className="font-bold text-[#050505] mb-5 text-lg">Steps:</h3>
                    {output.pathA.steps && output.pathA.steps.length > 0 ? (
                      <ul className="space-y-4">
                        {output.pathA.steps.map((step, idx) => (
                          <li
                            key={idx}
                            className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                          >
                            {step}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                        No steps returned. Try adding more detail and run again.
                      </p>
                    )}
                  </GlassPanel>

                  <GlassPanel variant="stage" delay={150} className="reveal">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-8">
                      Path B
                    </h2>
                    {output.pathB.summary ? (
                      <p className="text-[#050505] text-xl leading-relaxed mb-8">
                        {output.pathB.summary}
                      </p>
                    ) : (
                      <p className="text-[rgba(5,5,5,0.48)] text-lg italic mb-8">
                        No summary returned. Try adding more detail and run again.
                      </p>
                    )}
                    <h3 className="font-bold text-[#050505] mb-5 text-lg">Steps:</h3>
                    {output.pathB.steps && output.pathB.steps.length > 0 ? (
                      <ul className="space-y-4">
                        {output.pathB.steps.map((step, idx) => (
                          <li
                            key={idx}
                            className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                          >
                            {step}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                        No steps returned. Try adding more detail and run again.
                      </p>
                    )}
                  </GlassPanel>
                </div>

                <GlassPanel variant="tight" delay={300} className="reveal">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-8">
                    Delta
                  </h2>
                  <div className="space-y-10">
                    <div>
                      <h3 className="font-bold text-[#050505] mb-5 text-lg">
                        Behavior Changes
                      </h3>
                      {output.delta.behaviorChanges && output.delta.behaviorChanges.length > 0 ? (
                        <ul className="space-y-4">
                          {output.delta.behaviorChanges.map((change, idx) => (
                            <li
                              key={idx}
                              className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                            >
                              {change}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                          No behavior changes returned. Try adding more detail and run again.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-[#050505] mb-5 text-lg">
                        Outcome Differences
                      </h3>
                      {output.delta.outcomeDifferences && output.delta.outcomeDifferences.length > 0 ? (
                        <ul className="space-y-4">
                          {output.delta.outcomeDifferences.map((diff, idx) => (
                            <li
                              key={idx}
                              className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                            >
                              {diff}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                          No outcome differences returned. Try adding more detail and run again.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-[#050505] mb-5 text-lg">
                        Identity Impact
                      </h3>
                      {output.delta.identityImpact && output.delta.identityImpact.length > 0 ? (
                        <ul className="space-y-4">
                          {output.delta.identityImpact.map((impact, idx) => (
                            <li
                              key={idx}
                              className="text-[#050505] text-lg leading-relaxed pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                            >
                              {impact}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
                          No identity impact returned. Try adding more detail and run again.
                        </p>
                      )}
                    </div>
                  </div>
                </GlassPanel>
              </div>
            )}
          />
        </div>
      </div>
  );
}

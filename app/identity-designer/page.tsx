'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';
import GlassPanel from '@/components/GlassPanel';
import HistorySection from '@/components/HistorySection';
import { IdentityDesignerResponse } from '@/utils/types';
import { validateInput } from '@/utils/validation';
import { saveRun } from '@/utils/history';

export default function IdentityDesignerPage() {
  const [oldAssumption, setOldAssumption] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IdentityDesignerResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setValidationMessage(null);

    // Validate input before calling API
    const validation = validateInput(oldAssumption);
    if (!validation.isValid) {
      setValidationMessage(validation.message || 'Please provide more detail.');
      return;
    }

    setLoading(true);

    try {
      const payload = { oldAssumption };
      console.log('[IDENTITY-DESIGNER PAGE] Before fetch:', { oldAssumption: oldAssumption ? oldAssumption.substring(0, 50) + (oldAssumption.length > 50 ? '...' : '') : '', payload });
      
      const response = await fetch('/api/identity-designer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[IDENTITY-DESIGNER PAGE] After fetch:', { status: response.status, statusText: response.statusText, ok: response.ok });

      let data;
      try {
        data = await response.json();
        console.log('[IDENTITY-DESIGNER PAGE] After JSON parse:', { dataKeys: Object.keys(data), hasResults: !!data });
      } catch (parseError) {
        console.error('[IDENTITY-DESIGNER PAGE] Failed to parse response as JSON:', parseError);
        const text = await response.text().catch(() => 'Unable to read response text');
        console.error('[IDENTITY-DESIGNER PAGE] Response text:', text);
        throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      if (!response.ok) {
        console.log('[IDENTITY-DESIGNER PAGE] Error response:', data);
        throw new Error(data?.error || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('[IDENTITY-DESIGNER PAGE] Setting results:', data);
      setResults(data);
      
      // Save to history
      saveRun('identity-designer', oldAssumption, data);
      setHistoryRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('[IDENTITY-DESIGNER PAGE] Error caught:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-20">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-[#050505]">
              Reframe
            </h1>
            <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
              Paste a limiting belief and we&apos;ll help you rewrite it.
            </p>
          </div>

          <GlassPanel variant="stage">
            <form onSubmit={handleSubmit} className="space-y-8">
              <TextArea
                value={oldAssumption}
                onChange={(e) => setOldAssumption(e.target.value)}
                placeholder="Example: I'm not good enough to lead this project..."
                required
              />
              <div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Rewriting Identity...' : 'Rewrite Identity'}
                </Button>
              </div>
            </form>
          </GlassPanel>

          {validationMessage && (
            <div className="glass-panel p-6 border-[rgba(5,5,5,0.20)]">
              <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">{validationMessage}</p>
            </div>
          )}

          {error && (
            <div className="glass-panel p-6 border-red-300/50">
              <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">{error}</p>
            </div>
          )}

          {results && (
            <div className="space-y-8 md:space-y-12">
              <GlassPanel variant="tight" delay={0} className="reveal">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                  Reframed Assumption
                </h2>
                {results.reframedAssumption ? (
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                    {results.reframedAssumption}
                  </p>
                ) : (
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                    No reframed assumption returned. Try adding more detail and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={100} className="reveal">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                  Identity Shift
                </h2>
                {results.identityShift ? (
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                    {results.identityShift}
                  </p>
                ) : (
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                    No identity shift returned. Try adding more detail and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={200} className="reveal">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                  Behavioral Anchors
                </h2>
                {results.anchors && results.anchors.length > 0 ? (
                  <ul className="space-y-4">
                    {results.anchors.map((anchor, idx) => (
                      <li
                        key={idx}
                        className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)] pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                      >
                        {anchor}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                    No behavioral anchors returned. Try adding more detail and run again.
                  </p>
                )}
              </GlassPanel>

              <GlassPanel variant="tight" delay={300} className="reveal">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                  Narrative Upgrade
                </h2>
                {results.narrativeUpgrade ? (
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                    {results.narrativeUpgrade}
                  </p>
                ) : (
                  <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                    No narrative upgrade returned. Try adding more detail and run again.
                  </p>
                )}
              </GlassPanel>
            </div>
          )}

          <HistorySection
            tool="identity-designer"
            refreshKey={historyRefreshKey}
            renderResults={(output: IdentityDesignerResponse) => (
              <div className="space-y-8 md:space-y-12">
                <GlassPanel variant="tight" delay={0} className="reveal">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                    Reframed Assumption
                  </h2>
                  {output.reframedAssumption ? (
                    <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                      {output.reframedAssumption}
                    </p>
                  ) : (
                    <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                      No reframed assumption returned. Try adding more detail and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={100} className="reveal">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                    Identity Shift
                  </h2>
                  {output.identityShift ? (
                    <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                      {output.identityShift}
                    </p>
                  ) : (
                    <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                      No identity shift returned. Try adding more detail and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={200} className="reveal">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                    Behavioral Anchors
                  </h2>
                  {output.anchors && output.anchors.length > 0 ? (
                    <ul className="space-y-4">
                      {output.anchors.map((anchor, idx) => (
                        <li
                          key={idx}
                          className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)] pl-4 border-l-2 border-[rgba(5,5,5,0.10)]"
                        >
                          {anchor}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                      No behavioral anchors returned. Try adding more detail and run again.
                    </p>
                  )}
                </GlassPanel>

                <GlassPanel variant="tight" delay={300} className="reveal">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-6">
                    Narrative Upgrade
                  </h2>
                  {output.narrativeUpgrade ? (
                    <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
                      {output.narrativeUpgrade}
                    </p>
                  ) : (
                    <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.48)]">
                      No narrative upgrade returned. Try adding more detail and run again.
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

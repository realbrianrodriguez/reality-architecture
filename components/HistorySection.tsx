'use client';

import { useState, useEffect } from 'react';
import GlassPanel from '@/components/GlassPanel';
import { getRuns, deleteRun, clearRuns, HistoryRun } from '@/utils/history';

interface HistorySectionProps {
  tool: string;
  renderResults: (output: any) => React.ReactNode;
  maxRuns?: number;
  refreshKey?: number; // Pass a changing number to force refresh
}

export default function HistorySection({ 
  tool, 
  renderResults,
  maxRuns = 5,
  refreshKey = 0
}: HistorySectionProps) {
  const [runs, setRuns] = useState<HistoryRun[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Load runs on mount and when refreshKey changes
    const loadedRuns = getRuns(tool);
    setRuns(loadedRuns.slice(0, maxRuns));
  }, [tool, maxRuns, refreshKey]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRun(tool, id);
    const updatedRuns = getRuns(tool);
    setRuns(updatedRuns.slice(0, maxRuns));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleClearAll = () => {
    if (showClearConfirm) {
      clearRuns(tool);
      setRuns([]);
      setExpandedId(null);
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const truncateInput = (input: string, maxLength: number = 60) => {
    if (!input || input.trim().length === 0) {
      return tool === 'daily' ? 'Daily calibration' : '(No input)';
    }
    if (input.length <= maxLength) return input;
    return input.substring(0, maxLength) + '...';
  };

  if (runs.length === 0) {
    return (
      <GlassPanel variant="tight">
        <h2 className="text-3xl md:text-4xl font-bold text-[#050505] mb-6">
          Recent
        </h2>
        <p className="text-[rgba(5,5,5,0.48)] text-lg italic">
          No recent runs yet.
        </p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel variant="tight">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#050505]">
          Recent
        </h2>
      </div>

      <div className="space-y-4">
        {runs.map((run) => (
          <div key={run.id}>
            <div
              onClick={() => handleToggleExpand(run.id)}
              className="cursor-pointer p-4 rounded-glass-sm border border-[rgba(5,5,5,0.10)] hover:border-[rgba(5,5,5,0.20)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[rgba(5,5,5,0.64)] mb-2">
                    {formatDate(run.createdAt)}
                  </div>
                  <div className="text-[#050505] text-lg leading-relaxed">
                    {truncateInput(run.input)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(run.id, e)}
                  className="flex-shrink-0 text-[rgba(5,5,5,0.48)] hover:text-[#050505] transition-colors p-2"
                  aria-label="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {expandedId === run.id && (
              <div className="mt-4 pt-4 border-t border-[rgba(5,5,5,0.10)]">
                {renderResults(run.output)}
              </div>
            )}
          </div>
        ))}
      </div>

      {runs.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[rgba(5,5,5,0.10)]">
          {showClearConfirm ? (
            <div className="space-y-3">
              <p className="text-[rgba(5,5,5,0.64)] text-sm">
                Clear all history? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-glass-sm border border-[rgba(5,5,5,0.20)] text-[#050505] hover:bg-[rgba(5,5,5,0.05)] transition-colors text-sm font-semibold"
                >
                  Confirm Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-glass-sm border border-[rgba(5,5,5,0.20)] text-[rgba(5,5,5,0.64)] hover:bg-[rgba(5,5,5,0.05)] transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleClearAll}
              className="text-sm text-[rgba(5,5,5,0.64)] hover:text-[#050505] transition-colors font-semibold"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </GlassPanel>
  );
}


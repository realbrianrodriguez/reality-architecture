export interface HistoryRun {
  id: string;
  tool: string;
  createdAt: string;
  input: string;
  output: any;
}

const STORAGE_KEY_PREFIX = 'tool_history_';

function getStorageKey(tool: string): string {
  return `${STORAGE_KEY_PREFIX}${tool}`;
}

/**
 * Save a run to localStorage history
 */
export function saveRun(tool: string, input: string, output: any): void {
  try {
    if (typeof window === 'undefined') return;
    
    const key = getStorageKey(tool);
    const existingRuns = getRuns(tool);
    
    const newRun: HistoryRun = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      tool,
      createdAt: new Date().toISOString(),
      input,
      output,
    };
    
    const updatedRuns = [newRun, ...existingRuns];
    localStorage.setItem(key, JSON.stringify(updatedRuns));
  } catch (error) {
    console.error(`[HISTORY] Failed to save run for ${tool}:`, error);
  }
}

/**
 * Get runs for a tool, sorted newest-first
 */
export function getRuns(tool: string): HistoryRun[] {
  try {
    if (typeof window === 'undefined') return [];
    
    const key = getStorageKey(tool);
    const stored = localStorage.getItem(key);
    
    if (!stored) return [];
    
    const runs: HistoryRun[] = JSON.parse(stored);
    
    // Ensure sorted newest-first (by createdAt ISO string)
    return runs.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error(`[HISTORY] Failed to get runs for ${tool}:`, error);
    return [];
  }
}

/**
 * Delete a specific run by ID
 */
export function deleteRun(tool: string, id: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    const key = getStorageKey(tool);
    const existingRuns = getRuns(tool);
    const updatedRuns = existingRuns.filter(run => run.id !== id);
    
    localStorage.setItem(key, JSON.stringify(updatedRuns));
  } catch (error) {
    console.error(`[HISTORY] Failed to delete run ${id} for ${tool}:`, error);
  }
}

/**
 * Clear all runs for a tool
 */
export function clearRuns(tool: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    const key = getStorageKey(tool);
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[HISTORY] Failed to clear runs for ${tool}:`, error);
  }
}


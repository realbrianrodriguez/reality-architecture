const STORAGE_KEY = 'ra_daily_completions_v1';

export interface DailyCompletion {
  completedAt: string;
  identityStatement: string;
  recommendedAction: string;
}

export interface DailyCompletionsMap {
  [dateKey: string]: DailyCompletion;
}

/**
 * Get today's date key in YYYY-MM-DD format (local time)
 */
export function getTodayKey(): string {
  if (typeof window === 'undefined') return '';
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Get all completions from localStorage
 */
function getCompletions(): DailyCompletionsMap {
  try {
    if (typeof window === 'undefined') return {};
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    return JSON.parse(stored) as DailyCompletionsMap;
  } catch (error) {
    console.error('[DAILY_COMPLETION] Failed to get completions:', error);
    return {};
  }
}

/**
 * Save completions to localStorage
 */
function saveCompletions(completions: DailyCompletionsMap): void {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completions));
  } catch (error) {
    console.error('[DAILY_COMPLETION] Failed to save completions:', error);
  }
}

/**
 * Mark a date as done with the given payload
 */
export function markDone(
  dateKey: string,
  payload: { identityStatement: string; recommendedAction: string }
): void {
  try {
    if (typeof window === 'undefined') return;
    
    const completions = getCompletions();
    completions[dateKey] = {
      completedAt: new Date().toISOString(),
      identityStatement: payload.identityStatement,
      recommendedAction: payload.recommendedAction,
    };
    
    saveCompletions(completions);
  } catch (error) {
    console.error('[DAILY_COMPLETION] Failed to mark done:', error);
  }
}

/**
 * Check if a date is already marked as done
 */
export function isDone(dateKey: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    const completions = getCompletions();
    return !!completions[dateKey];
  } catch (error) {
    console.error('[DAILY_COMPLETION] Failed to check if done:', error);
    return false;
  }
}

/**
 * Get the current streak (consecutive days ending today)
 */
export function getStreak(): number {
  try {
    if (typeof window === 'undefined') return 0;
    
    const completions = getCompletions();
    const today = new Date();
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // Check backwards from today
    while (true) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      if (completions[dateKey]) {
        streak++;
        // Move to previous day
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('[DAILY_COMPLETION] Failed to get streak:', error);
    return 0;
  }
}


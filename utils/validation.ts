// Common vague phrases that indicate insufficient input
const VAGUE_PATTERNS = [
  /^\s*(hi|hello|hey|help|idk|i don't know|dunno|test|testing|what|huh|ok|okay|yes|no|maybe|idk|idk what to say)\s*$/i,
  /^\s*(what|how|why|when|where|who)\s*[?]?\s*$/i,
];

/**
 * Checks if input text is too short or too vague
 * @param text - The input text to validate
 * @returns Object with isValid boolean and optional message
 */
export function validateInput(text: string): { isValid: boolean; message?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, message: 'Please provide some input.' };
  }

  const trimmed = text.trim();

  // Check if too short
  if (trimmed.length < 40) {
    return {
      isValid: false,
      message: 'What situation is this about? What\'s the trigger and what do you do next?',
    };
  }

  // Check if matches vague patterns
  for (const pattern of VAGUE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        message: 'What situation is this about? What\'s the trigger and what do you do next?',
      };
    }
  }

  return { isValid: true };
}


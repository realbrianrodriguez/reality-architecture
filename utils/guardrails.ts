import { NextRequest } from 'next/server';

interface GuardrailOptions {
  windowMs: number;
  maxRequests: number;
  cooldownMs: number;
}

interface GuardrailResult {
  ok: boolean;
  status?: number;
  error?: string;
}

// In-memory store: Map<clientId, Array<timestamp>>
const requestStore = new Map<string, number[]>();

// Cleanup old entries periodically (runs on every check)
function cleanupOldEntries(windowMs: number) {
  const now = Date.now();
  const cutoff = now - windowMs;

  for (const [clientId, timestamps] of requestStore.entries()) {
    const filtered = timestamps.filter(ts => ts > cutoff);
    if (filtered.length === 0) {
      requestStore.delete(clientId);
    } else {
      requestStore.set(clientId, filtered);
    }
  }
}

function getClientId(req: NextRequest): string {
  // Prefer x-forwarded-for (first IP in comma-separated list)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  // Fallback to x-real-ip
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;

  // Fallback to unknown
  return 'unknown';
}

export function enforceGuardrails(
  req: NextRequest,
  options: GuardrailOptions
): GuardrailResult {
  const { windowMs, maxRequests, cooldownMs } = options;
  const clientId = getClientId(req);
  const now = Date.now();

  // Cleanup old entries
  cleanupOldEntries(windowMs);

  // Get existing timestamps for this client
  const timestamps = requestStore.get(clientId) || [];

  // Filter to only recent requests within the window
  const recentRequests = timestamps.filter(ts => ts > now - windowMs);

  // Check if we're in cooldown (last request was too recent)
  if (recentRequests.length > 0) {
    const lastRequest = recentRequests[recentRequests.length - 1];
    const timeSinceLastRequest = now - lastRequest;
    if (timeSinceLastRequest < cooldownMs) {
      const secondsRemaining = Math.ceil((cooldownMs - timeSinceLastRequest) / 1000);
      return {
        ok: false,
        status: 429,
        error: `Too many requests. Try again in ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''}.`,
      };
    }
  }

  // Check if we've exceeded max requests in the window
  if (recentRequests.length >= maxRequests) {
    const oldestRequest = recentRequests[0];
    const timeUntilOldestExpires = windowMs - (now - oldestRequest);
    const secondsRemaining = Math.ceil(timeUntilOldestExpires / 1000);
    return {
      ok: false,
      status: 429,
      error: `Too many requests. Try again in ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''}.`,
    };
  }

  // Allow the request: add current timestamp
  recentRequests.push(now);
  requestStore.set(clientId, recentRequests);

  return { ok: true };
}


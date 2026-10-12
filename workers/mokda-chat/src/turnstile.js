const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const ACTION = 'mokda_chat';
const TIMEOUT_MS = 5000;

export function turnstileConfigured(env) {
  return typeof env.TURNSTILE_SECRET === 'string' && Boolean(env.TURNSTILE_SECRET.trim());
}

// Tokens are redeemed at Cloudflare on every AI request, including requests to
// workers.dev. Origin/CORS and the public sitekey alone do not authenticate bots.
// The fetch dependency supports isolated tests; production always uses fetch.
export async function verifyTurnstile({ token, secret, origin, remoteip }, fetchImpl = fetch, timeoutMs = TIMEOUT_MS) {
  if (typeof secret !== 'string' || !secret.trim()) return { valid: false, unavailable: true };
  if (typeof token !== 'string' || !token.length || token.length > 2048 || /\s/.test(token)) return { valid: false };
  let hostname;
  try { hostname = new URL(origin).hostname; } catch { return { valid: false }; }

  const controller = new AbortController();
  let timer;
  try {
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(new Error('verification_timeout')); }, timeoutMs);
    });
    const validation = (async () => {
      const body = { secret, response: token, ...(remoteip ? { remoteip } : {}) };
      const response = await fetchImpl(SITEVERIFY_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), signal: controller.signal,
      });
      if (!response.ok) return { valid: false, unavailable: true };
      const raw = await response.text();
      if (raw.length > 8192) return { valid: false, unavailable: true };
      const result = JSON.parse(raw);
      if (!result || typeof result !== 'object' || Array.isArray(result) || typeof result.success !== 'boolean') return { valid: false, unavailable: true };
      if (result.success !== true) {
        const errors = Array.isArray(result['error-codes']) ? result['error-codes'] : [];
        const unavailable = errors.some(error => ['missing-input-secret', 'invalid-input-secret', 'internal-error'].includes(error));
        return { valid: false, ...(unavailable ? { unavailable: true } : {}) };
      }
      return { valid: result.action === ACTION && result.hostname === hostname };
    })();
    return await Promise.race([validation, timeout]);
  } catch {
    // Do not log the secret, token, visitor address or upstream response.
    return { valid: false, unavailable: true };
  } finally { clearTimeout(timer); }
}

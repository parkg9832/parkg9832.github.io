import { validateRequest, generateReply } from './chat.js';
import { turnstileConfigured, verifyTurnstile } from './turnstile.js';
export { ChatLimiter } from './limiter.js';

const ORIGINS = new Set(['https://www.mokda.kr', 'https://mokda.kr', 'https://parkg9832.github.io']);
const MAX_BODY_BYTES = 12000;
const HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Vary': 'Origin' };
const reply = (body, status, origin, extra = {}) => Response.json(body, { status, headers: { ...HEADERS, ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}), ...extra } });

export function allowedOrigin(origin, env) {
  if (ORIGINS.has(origin)) return origin;
  if (env.ALLOW_LOCALHOST === 'true' && /^http:\/\/(?:localhost|127\.0\.0\.1):\d{2,5}$/.test(origin || '')) return origin;
  return '';
}

export async function readBody(request) {
  const stated = Number(request.headers.get('content-length'));
  if (stated > MAX_BODY_BYTES) throw new Error('body_too_large');
  if (!request.body) throw new Error('invalid_request');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error('body_too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let position = 0;
  for (const chunk of chunks) { bytes.set(chunk, position); position += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { throw new Error('invalid_request'); }
}

async function visitorKey(request) {
  // Cloudflare sets this header at its edge. Never trust a browser-supplied ID to
  // protect the global inference allocation, and never persist a raw IP address.
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${day}:${ip}`));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createWorker({ siteverifyFetch = fetch, siteverifyTimeoutMs = 5000 } = {}) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const origin = allowedOrigin(request.headers.get('origin'), env);
      if (url.pathname === '/health' && request.method === 'GET') return reply({ ok: true, service: 'mokda-chat', ai: Boolean(env.AI && env.CHAT_LIMITER && turnstileConfigured(env)) }, 200, origin);
      if (url.pathname !== '/chat') return reply({ error: 'not_found' }, 404, origin);
      if (!origin) return reply({ error: 'origin_not_allowed' }, 403, '');
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...HEADERS, 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
      if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405, origin, { Allow: 'POST, OPTIONS' });
      if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) return reply({ error: 'unsupported_content_type' }, 415, origin);
      let input, token;
      try {
        const payload = await readBody(request);
        input = validateRequest(payload);
        token = payload.turnstileToken;
      } catch (error) { return reply({ error: error.message === 'body_too_large' ? 'body_too_large' : 'invalid_request' }, error.message === 'body_too_large' ? 413 : 400, origin); }
      // Missing quota protection is a hard failure, never an unlimited AI fallback.
      if (!env.AI || !env.CHAT_LIMITER) return reply({ error: 'ai_unavailable' }, 503, origin);
      const verification = await verifyTurnstile({ token, secret: env.TURNSTILE_SECRET, origin, remoteip: request.headers.get('cf-connecting-ip') }, siteverifyFetch, siteverifyTimeoutMs);
      if (!verification.valid) return reply({ error: verification.unavailable ? 'bot_verification_unavailable' : 'bot_verification_failed' }, verification.unavailable ? 503 : 403, origin);
      try {
        const id = env.CHAT_LIMITER.idFromName('mokda-chat-global-v1');
        const quotaResponse = await env.CHAT_LIMITER.get(id).fetch('https://limiter.internal/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: await visitorKey(request) }) });
        if (!quotaResponse.ok) return reply({ error: 'ai_unavailable' }, 503, origin);
        const quota = await quotaResponse.json();
        if (!quota.allowed) return reply({ error: 'rate_limited' }, 429, origin, { 'Retry-After': String(quota.retryAfter || 60) });
        const answer = await generateReply(input, env);
        if (new TextEncoder().encode(JSON.stringify(answer)).byteLength > 2500) return reply({ error: 'invalid_ai_response' }, 502, origin);
        return reply(answer, 200, origin);
      } catch (error) {
        // No request content, upstream error text, headers or credentials are logged.
        if (error.message === 'invalid_ai_response') {
          const reasons = ['json_format', 'json_parse', 'interpretation_fields', 'visitor_quantity', 'company_topic', 'text_constraints', 'response_size'];
          return reply({ error: 'invalid_ai_response', ...(reasons.includes(error.reason) ? { reason: error.reason } : {}) }, 502, origin);
        }
        return reply({ error: error.message === 'ai_timeout' ? 'ai_timeout' : 'ai_unavailable' }, error.message === 'ai_timeout' ? 504 : 503, origin);
      }
    },
  };
}

export default createWorker();

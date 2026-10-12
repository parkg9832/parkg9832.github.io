import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorker } from '../src/index.js';
import { verifyTurnstile, turnstileConfigured } from '../src/turnstile.js';

const valid = () => ({ success: true, action: 'mokda_chat', hostname: 'www.mokda.kr', challenge_ts: new Date().toISOString() });
const parameters = () => ({ token: 'fresh-fixture-token', secret: 'fixture-secret', origin: 'https://www.mokda.kr', remoteip: '192.0.2.17' });
const request = (token = 'fresh-fixture-token', origin = 'https://www.mokda.kr') => new Request('https://mokda-chat.mokda-chat-worker.workers.dev/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': '192.0.2.17' },
  body: JSON.stringify({ language: 'EN', messages: [{ role: 'user', content: 'Which sauce goes with tacos?' }], turnstileToken: token }),
});
function countedEnvironment() {
  const calls = { quota: 0, ai: 0 };
  const env = {
    TURNSTILE_SECRET: 'fixture-secret',
    CHAT_LIMITER: { idFromName: name => name, get: () => ({ fetch: async () => { calls.quota++; return Response.json({ allowed: true }); } }) },
    AI: { run: async () => { calls.ai++; return { response: { text: 'K-PEÑO goes well with tacos.', interpretation: { intent: 'pairings', audience: 'b2c', product: 'kpeno', country: '', businessType: '', quantity: '', food: 'tacos', heatPreference: '' } } }; } },
  };
  return { env, calls };
}

test('siteverify uses private secret, opaque token and trusted edge IP; successful reply is minimal', async () => {
  const result = await verifyTurnstile(parameters(), async (url, init) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(init.method, 'POST'); assert.equal(init.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(init.body), { secret: 'fixture-secret', response: 'fresh-fixture-token', remoteip: '192.0.2.17' });
    assert(init.signal instanceof AbortSignal);
    return Response.json(valid());
  });
  assert.deepEqual(result, { valid: true });
  assert.equal(turnstileConfigured({ TURNSTILE_SECRET: 'fixture-secret' }), true);
  for (const secret of [undefined, null, '', ' ', 1, {}]) assert.equal(turnstileConfigured({ TURNSTILE_SECRET: secret }), false);
});

test('missing, malformed and oversized tokens are rejected without contacting siteverify', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; return Response.json(valid()); };
  for (const token of [undefined, null, 1, {}, '', ' ', 'token\n', 'x'.repeat(2049)]) {
    assert.deepEqual(await verifyTurnstile({ ...parameters(), token }, fetchImpl), { valid: false });
  }
  assert.equal(calls, 0);
});

test('forged, expired and reused tokens never reserve quota or run AI even with an allowed Origin', async () => {
  const redeemed = new Set();
  const worker = createWorker({ siteverifyFetch: async (_, init) => {
    const token = JSON.parse(init.body).response;
    if (token !== 'fresh-fixture-token' || redeemed.has(token)) return Response.json({ success: false, 'error-codes': [token === 'forged-token' ? 'invalid-input-response' : 'timeout-or-duplicate'] });
    redeemed.add(token); return Response.json(valid());
  } });
  const { env, calls } = countedEnvironment();
  const missingBody = { language: 'EN', messages: [{ role: 'user', content: 'Which sauce goes with tacos?' }] };
  const missingResponse = await worker.fetch(new Request('https://mokda-chat.mokda-chat-worker.workers.dev/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://www.mokda.kr' }, body: JSON.stringify(missingBody),
  }), env);
  assert.equal(missingResponse.status, 403);
  assert.deepEqual(await missingResponse.json(), { error: 'bot_verification_failed' });
  for (const token of [undefined, null, '', 'forged-token', 'expired-token']) {
    const response = await worker.fetch(request(token === undefined ? null : token), env);
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { error: 'bot_verification_failed' });
  }
  assert.deepEqual(calls, { quota: 0, ai: 0 });
  const accepted = await worker.fetch(request(), env);
  assert.equal(accepted.status, 200);
  assert.deepEqual(calls, { quota: 1, ai: 1 });
  const replay = await worker.fetch(request(), env);
  assert.equal(replay.status, 403);
  assert.deepEqual(calls, { quota: 1, ai: 1 });
});

test('exact action and the request Origin hostname are required before quota', async () => {
  for (const result of [
    { ...valid(), action: 'mokda_inquiry' }, { ...valid(), action: undefined },
    { ...valid(), hostname: 'mokda.kr' }, { ...valid(), hostname: 'www.mokda.kr.evil.example' },
    { ...valid(), hostname: undefined }, { ...valid(), success: 'true' },
  ]) {
    const worker = createWorker({ siteverifyFetch: async () => Response.json(result) });
    const { env, calls } = countedEnvironment();
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, result.success === 'true' ? 503 : 403);
    assert.deepEqual(calls, { quota: 0, ai: 0 });
  }
  for (const hostname of ['mokda.kr', 'parkg9832.github.io']) {
    const worker = createWorker({ siteverifyFetch: async () => Response.json({ ...valid(), hostname }) });
    assert.equal((await worker.fetch(request('fresh-fixture-token', `https://${hostname}`), countedEnvironment().env)).status, 200);
  }
});

test('missing secret cannot enable an unprotected backend or contact siteverify', async () => {
  let verifyCalls = 0;
  const worker = createWorker({ siteverifyFetch: async () => { verifyCalls++; return Response.json(valid()); } });
  for (const secret of [undefined, '', ' ']) {
    const { env, calls } = countedEnvironment(); env.TURNSTILE_SECRET = secret;
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'bot_verification_unavailable' });
    assert.deepEqual(calls, { quota: 0, ai: 0 });
  }
  assert.equal(verifyCalls, 0);
});

test('siteverify errors, malformed output and timeout fail closed without leaking data', async () => {
  const upstreams = [
    async () => { throw new Error('private-secret-token-response'); },
    async () => new Response('upstream-private-details', { status: 500 }),
    async () => new Response('not json'),
    async () => new Response('x'.repeat(8193)),
    async () => Response.json(null),
    async () => Response.json([]),
    async () => Response.json({ success: false, 'error-codes': ['internal-error'] }),
    async () => Response.json({ success: false, 'error-codes': ['invalid-input-secret'] }),
    () => new Promise(() => {}),
  ];
  for (const siteverifyFetch of upstreams) {
    const worker = createWorker({ siteverifyFetch, siteverifyTimeoutMs: 5 });
    const { env, calls } = countedEnvironment();
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'bot_verification_unavailable' });
    assert.deepEqual(calls, { quota: 0, ai: 0 });
  }
});

test('validation timeout aborts the upstream request', async () => {
  let signal;
  assert.deepEqual(await verifyTurnstile(parameters(), async (_, init) => {
    signal = init.signal; return new Promise(() => {});
  }, 5), { valid: false, unavailable: true });
  assert.equal(signal.aborted, true);
});

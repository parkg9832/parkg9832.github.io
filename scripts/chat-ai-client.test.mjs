import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source = readFileSync(new URL('../site-chat-ai.js', import.meta.url), 'utf8');
const endpoint = 'https://mokda-chat.example.workers.dev/chat';
const input = { messages: [{ role: 'user', text: 'How spicy is K-PEÑO?' }], language: 'EN', context: {}, decision: { intent: 'choose', stage: 'resolved' } };
function fixture({ enabled = true, url = endpoint, respond, verify } = {}) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://www.mokda.kr/en/', runScripts: 'outside-only' });
  const w = dom.window, calls = [], verifications = [], timers = new Map(); let id = 0;
  w.MOKDA_CHAT_AI = { enabled, endpoint: url };
  if (verify !== null) w.MOKDA_TURNSTILE = { token: async (action, options) => {
    verifications.push({ action, options });
    return verify ? verify(action, options) : 'verified-test-token';
  } };
  w.setTimeout = (action, delay) => { timers.set(++id, { action, delay }); return id; }; w.clearTimeout = value => timers.delete(value);
  w.fetch = async (url, options) => { calls.push({ url, options }); return respond ? respond(url, options) : { ok: true, text: async () => JSON.stringify({ text: 'K-PEÑO combines gochujang and jalapeño.', interpretation: { intent: 'choose', product: 'kpeno' } }) }; };
  w.eval(source);
  return { dom, w, calls, verifications, timers, client: w.MOKDA_CHAT_AI_CLIENT };
}
const settle = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
let checks = 0;
for (const topic of ['moq', 'samples', 'pricing', 'leadTime', 'packing', 'bulk', 'documents', 'certifications', 'namedCertifications', 'support', 'oem', 'exclusive', 'brand', 'specifications']) {
  const f = fixture({ respond: async () => ({ ok: true, text: async () => JSON.stringify({ text: 'Company guidance.', interpretation: { intent: 'pricing', companyTopic: topic } }) }) });
  assert.equal((await f.client.answer(input)).interpretation.companyTopic, topic); f.dom.window.close(); checks++;
}
for (const topic of ['invented', ['moq'], { topic: 'moq' }, true]) {
  const f = fixture({ respond: async () => ({ ok: true, text: async () => JSON.stringify({ text: 'Company guidance.', interpretation: { intent: 'pricing', companyTopic: topic } }) }) });
  assert.equal((await f.client.answer(input)).interpretation.companyTopic, undefined); f.dom.window.close(); checks++;
}
for (const { enabled, url } of [
  { enabled: false, url: endpoint }, { enabled: 'true', url: endpoint },
  ...['', 'http://mokda.example.workers.dev/chat', 'https://www.mokda.kr/chat', 'https://evilworkers.dev/chat', 'https://mokda.example.workers.dev/other', 'https://user:secret@mokda.example.workers.dev/chat', 'https://mokda.example.workers.dev/chat?token=value', 'https://mokda.example.workers.dev/chat#fragment'].map(url => ({ enabled: true, url })),
]) {
  const f = fixture({ enabled, url }); assert.equal(f.client.isEnabled(), false, url); assert.equal(await f.client.answer(input), null); assert.equal(f.calls.length, 0); assert.equal(f.verifications.length, 0); f.dom.window.close(); checks++;
}
{
  const f = fixture(); assert(f.client.isEnabled());
  const result = await f.client.answer({
    messages: Array.from({ length: 9 }, (_, i) => ({ role: i % 2 ? 'user' : 'bot', text: `message ${i}: ` + 'x'.repeat(600), sources: [{ url: 'private link' }] })),
    language: 'invalid', context: { audience: 'B2C', product: 'kpeno', country: 'Peru', businessType: 'importer', quantity: '100 bottles', privateEmail: 'not sent', lastQuestion: 'not sent', handoffEligible: true },
    decision: { intent: 'choose', stage: 'resolved', handoff: true, privateToken: 'not sent' },
  });
  assert.match(result.text, /K-PEÑO/); assert.equal(result.interpretation.intent, 'choose');
  assert.equal(f.calls.length, 1); const { url, options } = f.calls[0]; assert.equal(url, endpoint);
  assert.equal(options.method, 'POST'); assert.equal(options.credentials, 'omit'); assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.cache, 'no-store'); assert.equal(options.headers['Content-Type'], 'application/json');
  const body = JSON.parse(options.body); assert.equal(body.language, 'ES'); assert.equal(body.messages.length, 6); assert(body.messages[0].content.startsWith('message 3:'));
  assert.equal(body.turnstileToken, 'verified-test-token');
  assert.equal(f.verifications[0].action, 'mokda_chat');
  assert.equal(body.context.audience, 'b2c', 'Worker contract receives its lowercase audience enum');
  assert(body.messages.every(message => ['user', 'assistant'].includes(message.role) && message.content.length <= 500 && Object.keys(message).length === 2));
  assert.deepEqual(Object.keys(body.context).sort(), ['audience', 'businessType', 'country', 'product', 'quantity']);
  assert.deepEqual(body.decision, { intent: 'choose', stage: 'resolved' }); assert.doesNotMatch(options.body, /privateEmail|privateToken|not sent|handoffEligible|private link/);
  assert.equal(f.timers.size, 0, 'Completed requests clear the transport timeout'); f.dom.window.close(); checks++;
}
{
  const f = fixture({ respond: async () => ({ ok: true, text: async () => JSON.stringify({ text: 'Product guidance.', interpretation: { intent: 'pricing', audience: 'b2b', product: 'both', businessType: 'retailer', country: 'South Korea' } }) }) });
  const result = await f.client.answer({ ...input, context: { audience: 'B2B', country: 'Korea', businessType: 'retail' } });
  assert.equal(result.interpretation.audience, 'B2B'); assert.equal(result.interpretation.businessType, 'retail');
  const body = JSON.parse(f.calls[0].options.body); assert.equal(body.context.country, 'South Korea'); assert.equal(body.context.businessType, 'retailer'); assert.equal(body.context.audience, 'b2b'); f.dom.window.close(); checks++;
}
for (const text of ['Go to https://example.com', 'www.example.com', '<script>alert(1)</script>', '<iframe src=x>', 'Contact wa.me/1234', 'x'.repeat(1201)]) {
  const f = fixture({ respond: async () => ({ ok: true, text: async () => JSON.stringify({ text, interpretation: { intent: 'choose', product: 'kpeno' } }) }) });
  const result = await f.client.answer(input); assert.equal(result.text, '', text); assert.equal(result.interpretation.intent, 'choose'); assert.equal(result.interpretation.product, 'kpeno'); f.dom.window.close(); checks++;
}
{
  const f = fixture({ respond: async () => ({ ok: true, text: async () => JSON.stringify({ text: 'Verified guidance.', interpretation: { intent: 'invented', audience: 'B2B', product: 'imaginary', businessType: 'importer', country: '<Peru>\n' + 'a'.repeat(100), quantity: '100 bottles\u0000', food: 'tacos', heatPreference: 'less_spicy', handoff: true, url: 'https://evil.test', sources: ['fake'] } }) }) });
  const result = await f.client.answer(input); assert.equal(result.text, 'Verified guidance.');
  assert.equal(result.interpretation.audience, 'B2B'); assert.equal(result.interpretation.businessType, 'importer'); assert.equal(result.interpretation.food, 'tacos'); assert.equal(result.interpretation.heatPreference, 'less_spicy');
  assert.equal(result.interpretation.country.length, 80); assert.doesNotMatch(result.interpretation.country, /[<>\n]/); assert.equal(result.interpretation.quantity, '100 bottles');
  for (const key of ['intent', 'product', 'handoff', 'url', 'sources']) assert.equal(result.interpretation[key], undefined); f.dom.window.close(); checks++;
}
for (const respond of [
  async () => { throw new Error('Offline'); },
  async () => ({ ok: false, status: 429, text: async () => { throw new Error('Rate limit body should not be read'); } }),
  async () => ({ ok: false, status: 500 }),
  async () => ({ ok: true, text: async () => '{bad json' }),
  async () => ({ ok: true, text: async () => 'null' }),
  async () => ({ ok: true, text: async () => 'x'.repeat(7001) }),
]) {
  const f = fixture({ respond }); assert.equal(await f.client.answer(input), null); assert.equal(f.timers.size, 0); f.dom.window.close(); checks++;
}
for (const via of ['external', 'timeout', 'already_aborted']) {
  const f = fixture({ respond: (url, options) => new Promise((resolve, reject) => { if (options.signal.aborted) reject(new Error('Aborted')); else options.signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true }); }) });
  const caller = new f.w.AbortController(); if (via === 'already_aborted') caller.abort();
  const result = f.client.answer({ ...input, signal: caller.signal });
  await settle();
  if (via === 'external') caller.abort();
  if (via === 'timeout') { const timer = [...f.timers.values()][0]; assert.equal(timer.delay, 12000); timer.action(); }
  assert.equal(await result, null);
  if (via === 'already_aborted') assert.equal(f.calls.length, 0, 'Pre-aborted verification never starts transport');
  else { assert.equal(f.calls.length, 1); assert.equal(f.calls[0].options.signal.aborted, true); }
  assert.equal(f.timers.size, 0); f.dom.window.close(); checks++;
}
for (const verify of [null, async () => { throw new Error('Verification unavailable'); }]) {
  const f = fixture({ verify });
  assert.equal(await f.client.answer(input), null);
  assert.equal(f.calls.length, 0, 'Missing/failed verification cannot start an AI request');
  assert.equal(f.timers.size, 0, 'Transport deadline starts only after verified acquisition');
  f.dom.window.close(); checks++;
}
{
  let resolveToken;
  const f = fixture({ verify: () => new Promise(resolve => { resolveToken = resolve; }) });
  const caller = new f.w.AbortController();
  const result = f.client.answer({ ...input, signal: caller.signal });
  await settle();
  assert.equal(f.timers.size, 0, 'Human verification time does not consume transport timeout');
  assert.equal(f.calls.length, 0);
  assert.equal(f.verifications[0].options.signal, caller.signal);
  assert.equal(f.verifications[0].options.language, 'EN');
  caller.abort(); resolveToken('verified-after-cancellation');
  assert.equal(await result, null);
  assert.equal(f.calls.length, 0, 'Cancelling during verification prevents transport even if a token later arrives');
  f.dom.window.close(); checks++;
}
console.log(`AI client checks passed: ${checks} endpoint, verified-token POST payload, interpretation validation, unsafe response filtering, rate/network fallback and cancellation checks. No external AI requests were made.`);

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../apps-script/b2b-lead-automation.gs', import.meta.url), 'utf8');
const budgetKey = 'PUBLIC_INQUIRY_DAILY_BUDGET';
let assertions = 0;
function check(actual, expected, message) { assert.deepEqual(actual, expected, message); assertions++; }

function setup() {
  const cache = new Map();
  const properties = new Map([['TURNSTILE_SECRET', 'test-secret-not-for-client']]);
  const requests = [];
  const logs = [];
  const used = new Set();
  const state = { status: 200, failFetch: false, failProperty: false, body: null,
    hostname: 'www.mokda.kr', action: 'mokda_inquiry', translations: 0, saves: 0, notifications: 0 };
  const context = vm.createContext({ console: { error: value => logs.push(value), warn: value => logs.push(value) }, Date,
    CacheService: { getScriptCache: () => ({ get: key => cache.get(key),
      put: (key, value) => cache.set(key, value), remove: key => cache.delete(key) }) },
    PropertiesService: { getScriptProperties: () => ({
      getProperty(key) { if (state.failProperty) throw new Error('private-property-error'); return properties.get(key) ?? null; },
      setProperty: (key, value) => properties.set(key, value),
    }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (_, value) => createHash('sha256').update(value).digest(),
      base64EncodeWebSafe: value => value.toString('base64url'),
      formatDate: date => new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
    UrlFetchApp: { fetch(url, options) {
      const request = JSON.parse(options.payload);
      requests.push({ url, options, request });
      if (state.failFetch) throw new Error('private-provider-error test-secret-not-for-client');
      const replay = used.has(request.response);
      used.add(request.response);
      return { getResponseCode: () => state.status,
        getContentText: () => state.body ?? JSON.stringify({ success: !replay,
          hostname: state.hostname, action: state.action, 'error-codes': replay ? ['timeout-or-duplicate'] : [] }) };
    } },
  });
  vm.runInContext(source, context);
  context.jsonResponse = value => value;
  context.translateToSpanish = context.translateToKorean = value => { state.translations++; return value; };
  context.appendLead = () => { state.saves++; };
  context.notifyLead = () => { state.notifications++; return { ok: true }; };
  const lead = overrides => ({ name: 'Test buyer', company: 'Company', country: 'Peru',
    email: 'buyer@example.invalid', message: 'A trade inquiry', language: 'EN',
    turnstileToken: 'unique-test-token', ...overrides });
  const post = payload => context.doPost({ postData: { contents: JSON.stringify(payload) } });
  const rejected = payload => {
    const result = post(payload);
    check(result.ok, false);
    check(result.error, 'Request could not be processed', 'No provider details reach the visitor');
    check([state.translations, state.saves, state.notifications], [0, 0, 0], 'No costly side effects before verification');
    check(properties.has(budgetKey), false, 'Verification rejection does not consume the inquiry budget');
    check(cache.size, 0, 'Verification rejection does not reserve a receipt or contact quota');
    check(logs.some(log => /private-|test-secret|unique-test-token/.test(log)), false, 'No raw provider/token data is logged');
    return result;
  };
  return { cache, properties, requests, logs, state, context, lead, post, rejected };
}

for (const hostname of ['www.mokda.kr', 'mokda.kr', 'parkg9832.github.io']) {
  const f = setup();
  f.state.hostname = hostname;
  check(f.post(f.lead({ ip: 'spoofed-client-ip', remoteip: 'spoofed-client-ip' })).saved, true);
  check([f.state.translations, f.state.saves, f.state.notifications], [4, 1, 1]);
  check(JSON.parse(f.properties.get(budgetKey)).count, 1);
  const { url, options, request } = f.requests[0];
  check(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  check(options.method, 'post');
  check(options.contentType, 'application/json');
  check(options.followRedirects, false, 'Secret cannot be forwarded to a redirected host');
  check(request, { secret: 'test-secret-not-for-client', response: 'unique-test-token' }, 'Payload IP is never trusted');
}

for (const token of [undefined, null, '', '   ', 1, {}, [], 'x'.repeat(2049), 'token\u0000']) {
  const f = setup();
  f.rejected(f.lead({ turnstileToken: token }));
  check(f.requests.length, 0, 'Malformed token is rejected without a provider request');
}

for (const hostname of ['localhost', 'evil.example', 'www.mokda.kr.evil.example', 'www.mokda.kr.', 'WWW.MOKDA.KR', '']) {
  const f = setup();
  f.state.hostname = hostname;
  f.rejected(f.lead());
}
for (const action of ['mokda_chat', '', 'mokda_inquiry_extra']) {
  const f = setup();
  f.state.action = action;
  f.rejected(f.lead());
}
for (const body of ['bad-json', 'null', '[]', '{}',
  JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }),
  JSON.stringify({ success: 'true', hostname: 'www.mokda.kr', action: 'mokda_inquiry' }), 'x'.repeat(8193)]) {
  const f = setup();
  f.state.body = body;
  f.rejected(f.lead());
}
for (const status of [301, 400, 429, 500, 503]) {
  const f = setup();
  f.state.status = status;
  f.rejected(f.lead());
}
for (const failure of ['fetch', 'property', 'missing-secret']) {
  const f = setup();
  if (failure === 'missing-secret') f.properties.delete('TURNSTILE_SECRET');
  else f.state[failure === 'fetch' ? 'failFetch' : 'failProperty'] = true;
  f.rejected(f.lead());
  if (failure !== 'fetch') check(f.requests.length, 0, 'Missing/unreadable secret fails before contacting provider');
}

{
  const f = setup();
  check(f.post(f.lead({ turnstileToken: 'x'.repeat(2048) })).saved, true, 'Maximum permitted token length is accepted');
}
{
  const f = setup();
  check(f.post(f.lead()).saved, true);
  check(f.post(f.lead({ message: 'Changed content' })).ok, false, 'A replayed provider token cannot produce another lead');
  check([f.state.saves, f.state.notifications], [1, 1]);
  check(JSON.parse(f.properties.get(budgetKey)).count, 1);
  check(f.post(f.lead({ turnstileToken: 'fresh-token-for-retry' })).duplicate, true, 'A fresh verified retry keeps receipt deduplication');
  check([f.state.saves, f.state.notifications], [1, 1]);
  check(JSON.parse(f.properties.get(budgetKey)).count, 1);
}
{
  const f = setup();
  f.properties.delete('TURNSTILE_SECRET');
  f.state.failFetch = true;
  check(f.post({ type: 'analytics', events: [{ name: 'page_view' }], verification: true }).saved, 0);
  check(f.post(f.lead({ website: 'honeypot' })).skipped, true);
  check(f.post({ type: 'demand_support', name: 'Test' }).error, 'Endpoint unavailable');
  check(f.requests.length, 0, 'Analytics verification, honeypot and retired support never contact Siteverify');
  check([f.state.translations, f.state.saves, f.state.notifications], [0, 0, 0]);
  check(f.properties.has(budgetKey), false);
  const before = f.requests.length;
  check(f.post(f.lead({ name: '' })).ok, false);
  check(f.requests.length, before, 'Schema validation occurs before provider verification');
}

console.log(`Inquiry Turnstile regressions passed: ${assertions} checks; server validation, exact action/hosts, replay, provider failures, no rejected side effects and analytics isolation.`);

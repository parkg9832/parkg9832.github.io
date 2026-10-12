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
  const properties = new Map();
  const logs = [];
  const state = { time: Date.parse('2026-10-12T14:59:00Z'), locked: false, available: true,
    failRead: false, failWrite: false, failSave: false, translations: 0, saves: 0, notifications: 0, propertyReads: 0 };
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [state.time])); }
    static now() { return state.time; }
  }
  const context = vm.createContext({
    Date: Clock,
    console: { error: value => logs.push(value), warn: value => logs.push(value) },
    CacheService: { getScriptCache: () => ({ get: key => cache.get(key),
      put: (key, value) => cache.set(key, value), remove: key => cache.delete(key) }) },
    PropertiesService: { getScriptProperties: () => ({
      getProperty(key) { assert.equal(state.locked, true); state.propertyReads++;
        if (state.failRead) throw new Error('private-property-value'); return properties.get(key) ?? null; },
      setProperty(key, value) { assert.equal(state.locked, true);
        if (state.failWrite) throw new Error('private-property-value'); properties.set(key, value); },
    }) },
    LockService: { getScriptLock: () => ({
      tryLock() { if (!state.available) return false; assert.equal(state.locked, false); state.locked = true; return true; },
      releaseLock() { state.locked = false; },
    }) },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (_, value) => createHash('sha256').update(value).digest(),
      base64EncodeWebSafe: value => value.toString('base64url'),
      formatDate(date, timeZone, format) { assert.equal(timeZone, 'Asia/Seoul'); assert.equal(format, 'yyyy-MM-dd');
        return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10); },
    },
  });
  vm.runInContext(source, context);
  context.jsonResponse = value => value;
  // This suite isolates reservations; the provider contract has its own suite.
  context.verifyInquiryTurnstile_ = () => {};
  context.translateToSpanish = context.translateToKorean = text => { state.translations++; return text; };
  context.appendLead = () => { if (state.failSave) throw new Error('private-sheet-details'); state.saves++; };
  context.notifyLead = () => { state.notifications++; return { ok: true }; };
  const lead = index => ({ name: 'Test', company: 'Company', country: 'Peru',
    email: `buyer-${index}@example.invalid`, message: `Inquiry ${index}`, language: 'EN' });
  const post = payload => context.doPost({ postData: { contents: JSON.stringify(payload) } });
  const budget = () => JSON.parse(properties.get(budgetKey));
  return { cache, properties, logs, state, context, lead, post, budget };
}

{
  const f = setup();
  for (let index = 0; index < 80; index++) {
    // Simulate cache eviction and entirely different contacts. Neither resets the persisted cap.
    f.cache.clear();
    check(f.post(f.lead(index)).saved, true, 'Within daily budget');
  }
  check(f.budget(), { day: '2026-10-12', count: 80 });
  check([...f.properties.keys()], [budgetKey], 'One bounded property with no per-contact history');
  f.cache.clear();
  const work = [f.state.translations, f.state.saves, f.state.notifications];
  check(f.post(f.lead(80)).error, 'Request could not be processed');
  check([f.state.translations, f.state.saves, f.state.notifications], work, 'Budget rejects before costly work');
  check(f.budget().count, 80);
  check(f.state.locked, false);
  f.state.time += 60 * 1000;
  f.cache.clear();
  check(f.post(f.lead(81)).saved, true, 'Korean midnight starts a new budget');
  check(f.budget(), { day: '2026-10-13', count: 1 });
}

{
  const f = setup();
  check(f.post(f.lead(0)).saved, true);
  const work = [f.state.translations, f.state.saves, f.state.notifications];
  check(f.post(f.lead(0)).duplicate, true);
  check(f.budget().count, 1, 'Successful retry does not consume another reservation');
  check([f.state.translations, f.state.saves, f.state.notifications], work);
  check(f.post({ ...f.lead(1), website: 'trap' }).skipped, true);
  check(f.post({ ...f.lead(2), name: '' }).ok, false);
  check(f.post({ type: 'analytics', events: [], verification: true }).saved, 0);
  check(f.budget().count, 1, 'Honeypot, invalid input and analytics do not consume inquiry budget');
}

{
  const f = setup();
  f.state.failSave = true;
  check(f.post(f.lead(0)).ok, false);
  check(f.budget().count, 1, 'Downstream failure does not refund quota');
  check(f.state.notifications, 0);
  check([...f.cache.keys()].some(key => key.startsWith('inquiry:')), false, 'Failed receipt is retryable');
  f.state.failSave = false;
  check(f.post(f.lead(0)).saved, true);
  check(f.budget().count, 2);
  check(f.logs.some(log => log.includes('private-')), false);
}

for (const malformed of ['bad-json', '{}', 'null', '[]', JSON.stringify({ day: '2026-10-12', count: -1 }),
  JSON.stringify({ day: '2026-10-12', count: 1.5 }), JSON.stringify({ day: '2026-10-12', count: 81 }),
  JSON.stringify({ day: '2026-10-14', count: 1 }), JSON.stringify({ day: 'invalid', count: 1 }),
  JSON.stringify({ day: '2026-10-12', count: 1, contact: 'private' })]) {
  const f = setup();
  f.properties.set(budgetKey, malformed);
  check(f.post(f.lead(0)).ok, false, 'Corrupt state fails closed');
  check([f.state.translations, f.state.saves, f.state.notifications], [0, 0, 0]);
  check(f.properties.get(budgetKey), malformed, 'Failure does not reset budget');
  check(f.state.locked, false);
}

for (const failure of ['failRead', 'failWrite']) {
  const f = setup();
  f.state[failure] = true;
  check(f.post(f.lead(0)).ok, false, 'Property service failure fails closed');
  check([f.state.translations, f.state.saves, f.state.notifications], [0, 0, 0]);
  check(f.state.locked, false);
}

{
  const f = setup();
  f.state.available = false;
  check(f.post(f.lead(0)).ok, false, 'Lock contention is rejected before reservation');
  check(f.state.propertyReads, 0);
  check([f.state.translations, f.state.saves, f.state.notifications], [0, 0, 0]);
}

// Never log raw integration errors: they may contain URLs, translated inquiry text or service details.
assert.doesNotMatch(source, /console\.(?:warn|error)\([^\n]*(?:error\.message|error\})/);
assert.doesNotMatch(source, /console\.(?:warn|error)\([^\n]*(?:getContentText|secret|turnstileToken)/);
console.log(`Inquiry quota regressions passed: ${assertions} checks; persistent cap, cache eviction, rotation, midnight, retries, failures and bounded private state.`);

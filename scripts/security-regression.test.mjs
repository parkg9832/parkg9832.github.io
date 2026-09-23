import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { secureHtml } from './static-security.mjs';

const root = new URL('../', import.meta.url);
const cacheMap = new Map();
const cache = { get: key => cacheMap.get(key), put: (key, value) => cacheMap.set(key, value), remove: key => cacheMap.delete(key) };
const context = vm.createContext({ console: { error() {} }, Date,
  CacheService: { getScriptCache: () => cache },
  LockService: { getScriptLock: () => ({ tryLock: () => true, waitLock() {}, releaseLock() {} }) },
  Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (_, value) => createHash('sha256').update(value).digest(), base64EncodeWebSafe: value => value.toString('base64url') },
});
vm.runInContext(await readFile(new URL('apps-script/b2b-lead-automation.gs', root), 'utf8'), context);
context.jsonResponse = value => value;
const request = payload => ({ postData: { contents: JSON.stringify(payload) } });
const lead = () => ({ name: 'Test', company: 'Test company', country: 'Peru', email: 'test@example.invalid', message: 'Test inquiry', language: 'EN' });
for (const mode of ['update_dashboard', 'demand_support', 'anything']) {
  assert.equal(context.doGet({ parameter: { mode } }).ok, false);
}
assert.deepEqual(Object.keys(context.doGet({})).sort(), ['ok', 'service']);
for (const invalid of [null, [], 'text', { ...lead(), name: {} }, { ...lead(), message: 'a'.repeat(4001) }, { ...lead(), email: 'invalid' }, { ...lead(), language: 'XX' }]) {
  assert.equal(context.doPost(request(invalid)).ok, false);
}
assert.equal(context.doPost({ postData: { contents: ' '.repeat(32769) } }).ok, false);
assert.equal(context.doPost(request({ type: 'analytics', events: Array(21).fill({name:'page_view'}) })).ok, false);
assert.equal(context.doPost(request({ ...lead(), website: 'spam' })).skipped, true);
for (const input of ['=1+1', '+123', '-1', '@SUM(A1)', '\t=IMPORTXML("https://example.invalid", "//a")']) {
  assert.equal(context.safeSheetCell_(input), "'" + input);
}
assert.equal(context.safeSheetCell_('Normal text'), 'Normal text');
assert.equal(context.safeSheetCell_(42), 42);

let stored;
const sheet = { getLastRow: () => 0, appendRow: row => { stored = row; }, setFrozenRows() {} };
context.getRequiredProperty = () => 'mock';
context.SpreadsheetApp = { openById: () => ({ getSheetByName: () => sheet }) };
context.appendLead(['=1+1', 'Normal text', 42]);
assert.equal(stored[0], "'=1+1");
context.translateToSpanish = context.translateToKorean = text => text;
let notifications = 0;
context.notifyLead = () => { notifications++; return { ok: true, private: 'not-for-client' }; };
const first = context.doPost(request(lead()));
assert.equal(first.saved, true);
assert.equal(first.notification, undefined);
assert.equal(context.doPost(request(lead())).duplicate, true);
assert.equal(notifications, 1);
cacheMap.clear();
const consumer = { ...lead(), company: '', purpose: 'General inquiry' };
assert.equal(context.doPost(request(consumer)).saved, true, 'Consumers can submit without a company');
assert.equal(context.doPost(request({ ...consumer, name: '' })).ok, false);
assert.equal(context.doPost(request({ ...consumer, email: '', whatsapp: '' })).ok, false);
assert.equal(context.doPost(request({ ...consumer, company: {} })).ok, false);
cacheMap.clear();
for (let i = 0; i < 5; i++) assert.equal(context.doPost(request({ ...lead(), message: 'Test ' + i })).saved, true);
assert.equal(context.doPost(request({ ...lead(), message: 'Over quota' })).ok, false);
cacheMap.clear();
context.appendLead = () => { throw new Error('private sheet identifier'); };
assert.equal(context.doPost(request(lead())).error, 'Request could not be processed');
assert.equal([...cacheMap.keys()].some(key => key.startsWith('inquiry:')), false);

const html = '<meta charset="utf-8"><script>console.log("ok")</script>';
const secured = secureHtml(html);
assert.match(secured, /script-src-attr 'none'/);
assert.match(secured, /form-action 'none'/);
assert.ok(!secured.match(/script-src [^;]*unsafe-/));
assert.equal(secureHtml(secured), secured);
const retiredPage = await readFile(new URL('coming-soon.html', root), 'utf8');
assert.match(retiredPage, /name="robots" content="noindex,follow"/);
assert.match(retiredPage, /rel="canonical" href="https:\/\/www\.mokda\.kr\/es\/"/);
assert.doesNotMatch(retiredPage, /<script\b|cdn\.tailwindcss\.com/i, 'Retired page must not load an unpinned third-party script');
for (const locale of ['ko', 'es', 'en']) for (const page of ['index', 'about', 'products', 'qna', 'contact']) {
  const built = await readFile(new URL(`${locale}/${page}.html`, root), 'utf8');
  assert.match(built, /Content-Security-Policy/);
  assert.ok(!/<script>([\s\S]*?)<\/script>/.test(built), 'Executable inline scripts must be externalized');
  assert.ok(!/\son(?:load|click)=/.test(built));
  for (const match of built.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const hash = createHash('sha256').update(match[1].replace(/\r\n?/g, '\n')).digest('base64');
    assert.ok(built.includes('sha256-' + hash));
  }
}

const server = spawn(process.execPath, [fileURLToPath(new URL('serve-static.mjs', import.meta.url)), '4191'], { stdio: ['ignore', 'pipe', 'pipe'] });
try {
  await Promise.race([once(server.stdout, 'data'), once(server, 'exit').then(() => { throw new Error('Preview failed to start'); })]);
  for (const path of ['/.git/config', '/.env', '/apps-script/b2b-lead-automation.gs', '/docs/FOUR_PAGE_REFINEMENT.md', '/package-lock.json', '/%ZZ', '/..%5C.env']) {
    assert.equal((await fetch('http://127.0.0.1:4191' + path)).status, 404, path);
  }
  const response = await fetch('http://127.0.0.1:4191/ko/');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal((await fetch('http://127.0.0.1:4191/ko/', { method: 'POST' })).status, 405);
} finally { server.kill(); }
console.log('Security regressions passed: public endpoints, schema/size bounds, formula safety, receipts, quotas, CSP, private paths.');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { JSDOM, VirtualConsole } from 'jsdom';
const root = new URL('../', import.meta.url), read = file => readFileSync(new URL(file, root), 'utf8');
const names = ['site-company-knowledge.js', 'site-help-data.js', 'site-country-data.js', 'site-help-flow.js', 'site-help.js'];
const assets = names.map(name => `/${name}?v=${createHash('sha256').update(readFileSync(new URL(name, root))).digest('hex').slice(0, 12)}`);
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function start({ lang = 'EN', width = 1440, saved, draft, manifest = assets, blocked = false } = {}) {
  const errors = [], vc = new VirtualConsole(); vc.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM('<html><head></head><body><main><textarea id="messageInput"></textarea></main></body></html>', { url: `https://www.mokda.kr/${{ KR: 'ko', ES: 'es', EN: 'en' }[lang]}/`, runScripts: 'outside-only', virtualConsole: vc });
  const w = dom.window, d = w.document, pending = [], loaded = [];
  const timers = new Map(); let now = 0, nextTimer = 0;
  w.setTimeout = (run, delay = 0) => { const id = ++nextTimer; timers.set(id, { run, at: now + delay }); return id; };
  w.clearTimeout = id => timers.delete(id);
  const advance = duration => {
    const end = now + duration;
    for (;;) {
      const due = [...timers].filter(([, item]) => item.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      timers.delete(due[0]); now = due[1].at; due[1].run();
    }
    now = end;
  };
  d.documentElement.dataset.routeLanguage = lang; w.innerWidth = width; w.matchMedia = () => ({ matches: false }); w.scrollTo = () => {};
  Object.assign(w.HTMLDialogElement.prototype, { show() { this.setAttribute('open', ''); }, showModal() { this.setAttribute('open', ''); }, close() { this.removeAttribute('open'); } });
  if (saved !== undefined) w.sessionStorage.setItem('mokdaChatSessionV2', saved);
  if (draft !== undefined) w.sessionStorage.setItem('mokdaChatInquiryDraft', draft);
  if (blocked) Object.defineProperty(w, 'sessionStorage', { get() { throw new Error('blocked'); } });
  const bootstrap = d.createElement('script'); bootstrap.dataset.chatAssets = JSON.stringify(manifest);
  let current = bootstrap;
  Object.defineProperty(d, 'currentScript', { get: () => current });
  const append = d.head.append.bind(d.head);
  d.head.append = node => { append(node); if (node.tagName === 'SCRIPT') { pending.push(node); loaded.push(new URL(node.src).pathname); } };
  w.eval(read('site-contact-config.js'));
  w.eval(read('site-help-loader.js'));
  const finish = async (failAt = -1) => {
    await settle();
    let count = 0;
    while (pending.length) {
      const node = pending.shift();
      if (count++ === failAt) node.onerror();
      else { current = node; w.eval(read(new URL(node.src).pathname.slice(1))); node.onload(); }
      await settle();
    }
  };
  return { dom, w, d, loaded, errors, finish, advance, reload: () => { current = bootstrap; w.eval(read('site-help-loader.js')); } };
}
let checks = 0;
for (const lang of ['KR', 'ES', 'EN']) for (const width of [390, 1440]) {
  const f = start({ lang, width });
  assert.equal(f.loaded.length, 0); assert.equal(f.d.querySelector('dialog'), null);
  const stub = f.d.querySelector('.help-launcher'), launcherMark = stub.innerHTML;
  assert.equal(stub.querySelector('.help-launcher-label'), null);
  stub.click(); stub.click();
  assert.equal(f.loaded.length, 1, 'Double clicking does not start duplicate dependency loads');
  await f.finish();
  assert.deepEqual(f.loaded, names.map(name => `/${name}`));
  assert(f.d.querySelector('dialog').open); assert.equal(f.d.querySelectorAll('#mokda-help').length, 1);
  assert.equal(f.d.querySelector('.help-launcher').innerHTML, launcherMark, 'The same bot mark survives deferred chat loading');
  assert.equal(f.d.querySelector('dialog').getAttribute('aria-modal'), String(width <= 600));
  assert(f.d.querySelector('.help-contact').hidden);
  assert.equal(f.d.querySelectorAll('.help-message').length, 0, 'The first open shows preparation before the greeting');
  assert.equal(f.d.querySelector('.help-processing').hidden, false);
  f.advance(999); assert.equal(f.d.querySelectorAll('.help-choice').length, 0);
  f.advance(1); assert.equal(f.d.querySelectorAll('.help-choice').length, 3);
  assert.equal(f.w.MOKDA_CONTACT.whatsappNumber, '821022127815');
  f.reload(); assert.equal(f.d.querySelectorAll('#mokda-help').length, 1); assert.deepEqual(f.errors, []);
  f.dom.window.close(); checks++;
}
const failure = start(); failure.d.querySelector('.help-launcher').click(); await failure.finish(2);
assert.equal(failure.d.querySelector('dialog'), null); assert.equal(failure.d.querySelector('.help-load-status a').pathname, '/en/contact.html');
failure.d.querySelector('.help-launcher').click(); await failure.finish();
assert(failure.d.querySelector('dialog').open); assert.equal(failure.loaded.filter(path => path === '/site-company-knowledge.js').length, 1, 'Retry reuses already validated dependencies');
failure.dom.window.close(); checks++;
for (const manifest of [null, assets.map((url, i) => i ? url : `https://evil.example${url}`), assets.map((url, i) => i ? url : 'javascript:alert(1)'), [...assets].reverse()]) {
  const f = start({ manifest }); f.d.querySelector('.help-launcher').click(); await settle();
  assert.equal(f.loaded.length, 0); assert(f.d.querySelector('.help-load-status a')); f.dom.window.close(); checks++;
}
const opened = start({ saved: JSON.stringify({ version: 2, at: Date.now(), open: true, transcript: [{ role: 'bot', text: 'Saved guidance' }] }) });
assert.equal(opened.loaded.length, 1); await opened.finish(); assert(opened.d.querySelector('dialog').open); opened.dom.window.close(); checks++;
for (const saved of ['{bad', JSON.stringify({ version: 2, at: Date.now() - 5 * 60 * 60 * 1000, open: true, transcript: [] })]) {
  const f = start({ saved }); assert.equal(f.loaded.length, 0); f.dom.window.close(); checks++;
}
const blocked = start({ blocked: true }); blocked.d.querySelector('.help-launcher').click(); await blocked.finish(); assert(blocked.d.querySelector('dialog').open); blocked.dom.window.close(); checks++;
const draft = start({ draft: '<script>Question from chat</script>' });
assert.equal(draft.d.getElementById('messageInput').value, '<script>Question from chat</script>'); assert.equal(draft.loaded.length, 0); assert.equal(draft.d.querySelectorAll('script').length, 0); draft.dom.window.close(); checks++;
console.log(`Chat loading checks passed: ${checks} scenarios across three languages and mobile/desktop, idle zero dependency requests, ordered loading, duplicate/retry/session handling, failure contact fallback and strict same-origin manifests.`);

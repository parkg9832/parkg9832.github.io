import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
const root = new URL('../', import.meta.url), read = file => readFileSync(new URL(file, root), 'utf8');
const scripts = ['site-contact-config.js', 'site-help-data.js', 'site-chat-intents.js', 'site-chat-engine.js', 'site-help.js'];
const KEY = 'mokdaChatSessionV2';
const settings = { KR: { prefix: 'ko', greeting: '안녕하세요', price: 'K-PEÑO 가격 알려주세요', country: '페루로 100병', correction: '100병 말고 10병이에요', thanks: '고마워요', role: '나' }, ES: { prefix: 'es', greeting: '¡Hola', price: '¿Cuánto cuesta K-PEÑO?', country: 'En Perú, 100 botellas', correction: '10 botellas, no 100', thanks: 'Gracias', role: 'Tú' }, EN: { prefix: 'en', greeting: 'Hi', price: 'What is the price of K-PEÑO?', country: 'In Peru, 100 bottles', correction: '10 bottles instead', thanks: 'Thanks', role: 'You' } };
function start(lang = 'EN', { number, saved, width = 1440, blockedStorage = false, draft, contactValue } = {}) {
  const errors = [], timers = new Map(); let id = 0, requests = 0;
  const console = new VirtualConsole(); console.on('jsdomError', e => errors.push(e));
  const dom = new JSDOM('<!doctype html><html><body><main><button id="outside">Page control</button></main></body></html>', { url: `https://www.mokda.kr/${settings[lang].prefix}/`, runScripts: 'outside-only', virtualConsole: console });
  const w = dom.window, d = w.document; d.documentElement.dataset.routeLanguage = lang;
  w.innerWidth = width; w.matchMedia = () => ({ matches: false }); w.scrollTo = () => {};
  w.setTimeout = action => { timers.set(++id, action); return id; }; w.clearTimeout = value => timers.delete(value);
  w.fetch = () => { requests++; throw new Error('Unexpected network'); }; w.XMLHttpRequest.prototype.send = w.fetch; w.navigator.sendBeacon = w.fetch;
  Object.assign(w.HTMLDialogElement.prototype, { show() { this.setAttribute('open', ''); }, showModal() { this.setAttribute('open', ''); this.dataset.modal = 'true'; }, close() { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); } });
  if (saved !== undefined) w.sessionStorage.setItem(KEY, saved);
  if (draft !== undefined) w.sessionStorage.setItem('mokdaChatInquiryDraft', draft);
  if (contactValue !== undefined) { const f = d.createElement('textarea'); f.id = 'messageInput'; f.value = contactValue; d.querySelector('main').append(f); }
  if (blockedStorage) Object.defineProperty(w, 'sessionStorage', { get() { throw new Error('Storage blocked'); } });
  for (const file of scripts) { w.eval(read(file)); if (file === 'site-contact-config.js' && number !== undefined) w.MOKDA_CONTACT.whatsappNumber = number; }
  const flush = () => { for (const [i, fn] of [...timers]) { timers.delete(i); fn(); } };
  const submit = (query, finish = true) => { const input = d.querySelector('.help-composer textarea'); input.focus(); input.value = query; input.dispatchEvent(new w.Event('input')); d.querySelector('form').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); if (finish) flush(); };
  return { dom, w, d, errors, flush, submit, requests: () => requests };
}
const latest = f => f.d.querySelector('.help-conversation').lastElementChild;
let checks = 0;
for (const [lang, s] of Object.entries(settings)) {
  const f = start(lang); const { w, d, submit, flush } = f;
  const dialog = d.querySelector('dialog'), input = d.querySelector('textarea'), launcher = d.querySelector('.help-launcher');
  assert.equal(dialog.open, false); assert.match(latest(f).textContent, new RegExp(s.greeting));
  assert.equal(d.querySelectorAll('.help-choice').length, 3); assert.equal(input.maxLength, 500);
  launcher.click(); assert(dialog.open); assert.equal(dialog.getAttribute('aria-modal'), 'false'); assert.equal(d.activeElement, d.querySelector('.help-close'));
  submit(s.price, false); assert.equal(d.querySelector('.help-processing').hidden, false);
  assert.equal(d.activeElement, input, 'Submitting keeps focus and keyboard in the composer');
  submit('Duplicate during processing', false); assert.equal(d.querySelectorAll('.help-message-user').length, 1);
  flush(); assert.equal(d.activeElement, input); assert.equal(d.querySelector('.help-processing').hidden, true);
  assert.equal(d.querySelector('.help-message-user').getAttribute('aria-label'), s.role);
  submit(s.country); submit(s.correction); const href = d.querySelector('.help-contact').href;
  const link = new URL(href); const message = link.searchParams.get('text');
  assert.equal(link.origin, 'https://wa.me'); assert.equal(link.pathname, `/${w.MOKDA_CONTACT.whatsappNumber}`);
  assert.match(message, /K-PEÑO/); assert.match(message, /Peru/); assert.match(message, /10/); assert.doesNotMatch(message, /100/);
  assert.equal(d.querySelector('.help-contact').rel, 'noopener noreferrer'); submit(s.thanks);
  assert.equal(d.querySelector('.help-contact').href, href, 'Thanks preserves the substantive inquiry');
  const before = d.querySelector('.help-conversation').textContent;
  const saved = w.sessionStorage.getItem(KEY), navigated = start(lang, { saved });
  assert.equal(navigated.d.querySelector('.help-conversation').textContent, before); assert(navigated.d.querySelector('dialog').open);
  assert.equal(navigated.d.querySelector('.help-contact').href, href); navigated.dom.window.close();
  const ime = new w.KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true }); input.dispatchEvent(ime); assert(ime.defaultPrevented);
  const count = d.querySelectorAll('.help-message').length; submit('   '); assert.equal(d.querySelectorAll('.help-message').length, count);
  submit('<img src=x onerror="window.injected=true"><script>alert(1)</script>');
  assert.equal(d.querySelector('.help-conversation img, .help-conversation script'), null); assert.equal(w.injected, undefined);
  submit('pending then reset', false); d.querySelector('.help-reset').click(); flush();
  assert.equal(d.querySelectorAll('.help-message').length, 1, 'Reset cancels delayed replies');
  assert.equal(JSON.parse(w.sessionStorage.getItem(KEY)).context.product, undefined);
  for (let i = 0; i < 20; i++) submit(`Unrecognized inquiry ${i}`);
  assert.equal(d.querySelectorAll('.help-message').length, 24); assert.equal(JSON.parse(w.sessionStorage.getItem(KEY)).transcript.length, 24);
  d.querySelector('.help-close').click(); flush(); assert(!dialog.open); assert.equal(d.activeElement, launcher);
  launcher.click(); assert(dialog.open); input.focus(); d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })); flush(); assert(!dialog.open);
  launcher.click(); d.getElementById('outside').focus(); d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })); flush(); assert(dialog.open);
  w.eval(read('site-help.js')); assert.equal(d.querySelectorAll('#mokda-help').length, 1);
  assert.equal(f.requests(), 0); assert.deepEqual(f.errors, []); f.dom.window.close(); checks++;
}
const fixture = start('KR'); const e = fixture.w.MOKDA_CHAT_ENGINE;
let c = {};
for (const [query, expected] of [
  ['타코랑 먹어도 되나요?', { product: 'kpeno', topic: 'pairings' }],
  ['가격이랑 개봉 후 보관은요?', { product: 'kpeno', purpose: 'pricing' }],
  ['페루로 100병이요', { country: 'Peru', quantity: '100병' }],
  ['페루가 아니라 멕시코', { country: 'Mexico' }],
  ['100병 말고 10병', { quantity: '10병' }],
  ['그럼 다른 소스', { product: 'para_carnes' }],
  ['스페인어로 답해줘', { language: 'ES', product: 'para_carnes', country: 'Mexico' }],
]) {
  const r = e.reply(query, { language: 'KR', context: c }); c = r.context;
  for (const [key, value] of Object.entries(expected)) assert.equal(c[key], value, `${query}: ${key}`);
  if (/가격이랑/.test(query)) { assert.match(r.text, /냉장/); assert.match(r.text, /가격/); }
  checks++;
}
for (const lang of Object.keys(settings)) {
  const data = fixture.w.MOKDA_HELP_DATA[lang];
  for (const q of data.categories.flatMap(item => item.questions)) {
    const result = e.reply(q.question, { language: lang }); assert(result.text.length > 20); assert.equal(result.language, lang);
    for (const source of result.sources) {
      assert(existsSync(new URL(`${settings[lang].prefix}/${source.path.split(/[?#]/)[0]}`, root)), source.path);
    }
    checks++;
  }
  const unsafe = e.reply('Does K-PEÑO have milk? Is it safe for my allergy?', { language: lang });
  assert(unsafe.handoff); assert.match(unsafe.text, /K-PEÑO/);
}
const corrections = e.reply('Estoy en México, no Perú.', { language: 'ES', context: { country: 'Peru', purpose: 'buy', topic: 'buy', lastQuestion: '¿Dónde comprar?' } });
assert.equal(corrections.context.country, 'Mexico'); assert.doesNotMatch(corrections.handoffSummary, /Peru/);
const oldInquiry = e.reply('Quiero comprar K-PEÑO en Perú, 100 botellas.', { language: 'ES' });
const movedInquiry = e.reply('México, no Perú.', { language: 'ES', context: oldInquiry.context });
const reducedInquiry = e.reply('10 botellas en lugar de 100.', { language: 'ES', context: movedInquiry.context });
assert.match(reducedInquiry.handoffSummary, /Mexico/); assert.match(reducedInquiry.handoffSummary, /10 botellas/);
assert.doesNotMatch(reducedInquiry.handoffSummary, /Per[uú]|100/);
fixture.dom.window.close();
for (const number of ['', 'invalid', '0123456789', '1234567', '12025550100<script>']) {
  const f = start('EN', { number }); f.submit('price'); assert.equal(f.d.querySelector('.help-contact').getAttribute('href'), '/en/contact.html?purpose=distribution'); assert.equal(f.d.querySelector('.help-contact').target, ''); f.dom.window.close();
}
const mobile = start('ES', { width: 390 }); mobile.d.querySelector('.help-launcher').click();
assert.equal(mobile.d.querySelector('dialog').getAttribute('aria-modal'), 'true'); assert.equal(mobile.d.body.style.overflow, 'hidden');
mobile.d.querySelector('.help-close').click(); mobile.flush(); assert.equal(mobile.d.body.style.overflow, ''); mobile.dom.window.close();
const contactNavigation = start('EN'); contactNavigation.d.querySelector('.help-launcher').click(); contactNavigation.submit('price of K-PEÑO');
const contactAnchor = contactNavigation.d.querySelector('.help-form-link'); contactAnchor.addEventListener('click', e => e.preventDefault()); contactAnchor.click();
assert.equal(JSON.parse(contactNavigation.w.sessionStorage.getItem(KEY)).open, false, 'Internal navigation folds the panel so the destination is visible');
assert.match(contactNavigation.w.sessionStorage.getItem('mokdaChatInquiryDraft'), /K-PEÑO/); contactNavigation.dom.window.close();
for (const saved of ['{bad', JSON.stringify({ version: 2, at: Date.now() - 5 * 60 * 60 * 1000, transcript: [] })]) { const f = start('EN', { saved }); assert.equal(f.d.querySelectorAll('.help-message').length, 1); f.dom.window.close(); }
const blocked = start('EN', { blockedStorage: true }); blocked.submit('price'); assert.deepEqual(blocked.errors, []); blocked.dom.window.close();
for (const contactValue of ['', 'Existing inquiry']) { const f = start('EN', { contactValue, draft: 'Question from chat' }); assert.equal(f.d.getElementById('messageInput').value, contactValue || 'Question from chat'); assert.equal(f.w.sessionStorage.getItem('mokdaChatInquiryDraft'), null); f.dom.window.close(); }
const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
assert.equal(urls.length, 48);
for (const url of urls) {
  const path = url.pathname.slice(1) + (url.pathname.endsWith('/') ? 'index.html' : '');
  const dom = new JSDOM(read(path), { url: url.href }); const d = dom.window.document;
  const loaded = [...d.querySelectorAll('script[src]')].map(script => new URL(script.src).pathname);
  const required = scripts.map(file => `/${file}`);
  for (const src of required) assert.equal(loaded.filter(value => value === src).length, 1, `${path}: ${src}`);
  const order = required.map(src => loaded.indexOf(src)); assert.deepEqual(order, [...order].sort((a, b) => a - b));
  assert.equal([...d.querySelectorAll('link[rel="stylesheet"]')].filter(link => new URL(link.href).pathname === '/styles/site-help.css').length, 1); dom.window.close();
}
console.log(`Messenger checks passed: ${checks} localized answer/context checks, 48 page integrations, product/country/quantity corrections, WhatsApp draft encoding, preserved composer focus, session recovery, pending-reset cancellation, input safety, no network calls and modal cleanup. Native layout/keyboard behavior is verified separately in the browser.`);

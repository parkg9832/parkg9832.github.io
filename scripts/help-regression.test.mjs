import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
const root = new URL('../', import.meta.url), read = file => readFileSync(new URL(file, root), 'utf8');
const scripts = ['site-contact-config.js', 'site-help-data.js', 'site-chat-intents.js', 'site-chat-engine.js', 'site-chat-ai.js', 'site-help.js'];
const KEY = 'mokdaChatSessionV2';
const settings = {
  KR: { prefix: 'ko', greeting: '안녕하세요', price: 'K-PEÑO 수입 거래 가격이 궁금해요', country: '페루 수입사입니다, 100병', correction: '100병 말고 10병이에요', thanks: '고마워요', role: '나', human: '담당자와 상담하고 싶어요' },
  ES: { prefix: 'es', greeting: '¡Hola', price: 'Quiero importar K-PEÑO', country: 'Somos una importadora en Perú, 100 botellas', correction: '10 botellas en lugar de 100', thanks: 'Gracias', role: 'Tú', human: 'Quiero hablar con una persona' },
  EN: { prefix: 'en', greeting: 'Hi', price: 'I would like to import K-PEÑO', country: 'We are an importer in Peru, 100 bottles', correction: '10 bottles instead', thanks: 'Thanks', role: 'You', human: 'Please connect me with a human' },
};
function start(lang = 'EN', { number, saved, width = 1440, blockedStorage = false, draft, contactValue, reducedMotion = false, aiClient } = {}) {
  const errors = [], timers = new Map(); let id = 0, requests = 0;
  const console = new VirtualConsole(); console.on('jsdomError', e => errors.push(e));
  const dom = new JSDOM('<!doctype html><html><body><main><button id="outside">Page control</button></main></body></html>', { url: `https://www.mokda.kr/${settings[lang].prefix}/`, runScripts: 'outside-only', virtualConsole: console });
  const w = dom.window, d = w.document; d.documentElement.dataset.routeLanguage = lang;
  w.innerWidth = width; w.matchMedia = () => ({ matches: reducedMotion }); w.scrollTo = () => {};
  w.setTimeout = (action, delay) => { timers.set(++id, { action, delay }); return id; }; w.clearTimeout = value => timers.delete(value);
  w.fetch = () => { requests++; throw new Error('Unexpected network'); }; w.XMLHttpRequest.prototype.send = w.fetch; w.navigator.sendBeacon = w.fetch;
  Object.assign(w.HTMLDialogElement.prototype, { show() { this.setAttribute('open', ''); }, showModal() { this.setAttribute('open', ''); this.dataset.modal = 'true'; }, close() { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); } });
  if (saved !== undefined) w.sessionStorage.setItem(KEY, saved);
  if (draft !== undefined) w.sessionStorage.setItem('mokdaChatInquiryDraft', draft);
  if (contactValue !== undefined) { const f = d.createElement('textarea'); f.id = 'messageInput'; f.value = contactValue; d.querySelector('main').append(f); }
  if (blockedStorage) Object.defineProperty(w, 'sessionStorage', { get() { throw new Error('Storage blocked'); } });
  for (const file of scripts) {
    if (file === 'site-help.js' && aiClient) w.MOKDA_CHAT_AI_CLIENT = aiClient;
    w.eval(read(file));
    if (file === 'site-contact-config.js') { w.MOKDA_CHAT_AI.enabled = false; if (number !== undefined) w.MOKDA_CONTACT.whatsappNumber = number; }
  }
  const flush = () => { for (const [i, value] of [...timers]) { timers.delete(i); value.action(); } };
  const submit = (query, finish = true) => { const input = d.querySelector('.help-composer textarea'); input.focus(); input.value = query; input.dispatchEvent(new w.Event('input')); d.querySelector('form').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); if (finish) flush(); };
  return { dom, w, d, errors, flush, submit, delays: () => [...timers.values()].map(value => value.delay), requests: () => requests };
}
const latest = f => f.d.querySelector('.help-conversation').lastElementChild;
let checks = 0;
for (const [lang, s] of Object.entries(settings)) {
  const f = start(lang); const { w, d, submit, flush } = f;
  const dialog = d.querySelector('dialog'), input = d.querySelector('textarea'), launcher = d.querySelector('.help-launcher');
  assert.equal(dialog.open, false); assert.match(latest(f).textContent, new RegExp(s.greeting));
  assert(d.querySelector('.help-contact').hidden); assert(d.querySelector('.help-form-link').hidden);
  assert.equal(d.querySelectorAll('.help-choice').length, 3); assert.equal(input.maxLength, 500);
  launcher.click(); assert(dialog.open); assert.equal(dialog.getAttribute('aria-modal'), 'false'); assert.equal(d.activeElement, d.querySelector('.help-close'));
  submit(s.price, false); assert.equal(d.querySelector('.help-processing').hidden, false);
  assert(f.delays().some(delay => delay >= 1400 && delay <= 1900), 'Automated reply has a brief visible preparation delay');
  assert(d.querySelector('.help-contact').hidden, 'No contact prompt during preparation or before business qualification');
  assert.equal(d.activeElement, input, 'Submitting keeps focus and keyboard in the composer');
  submit('Duplicate during processing', false); assert.equal(d.querySelectorAll('.help-message-user').length, 1);
  flush(); assert.equal(d.activeElement, input); assert.equal(d.querySelector('.help-processing').hidden, true);
  assert.equal(d.querySelector('.help-message-user').getAttribute('aria-label'), s.role);
  submit(s.country); assert(!d.querySelector('.help-contact').hidden, 'Country, business type and product qualify a business inquiry');
  submit(s.correction); const href = d.querySelector('.help-contact').href;
  const link = new URL(href); const message = link.searchParams.get('text');
  assert.equal(link.origin, 'https://wa.me'); assert.equal(link.pathname, `/${w.MOKDA_CONTACT.whatsappNumber}`);
  assert.match(message, /K-PEÑO/); assert.match(message, /Peru/); assert.match(message, /10/); assert.doesNotMatch(message, /100/);
  assert.equal(d.querySelector('.help-contact').rel, 'noopener noreferrer'); submit(s.thanks);
  assert.equal(d.querySelector('.help-contact').href, href, 'Thanks preserves the substantive inquiry');
  assert(!d.querySelector('.help-contact').hidden, 'Thanks preserves an already qualified handoff');
  const before = d.querySelector('.help-conversation').textContent;
  const saved = w.sessionStorage.getItem(KEY), navigated = start(lang, { saved });
  assert.equal(navigated.d.querySelector('.help-conversation').textContent, before); assert(navigated.d.querySelector('dialog').open);
  assert.equal(navigated.d.querySelector('.help-contact').href, href); assert(!navigated.d.querySelector('.help-contact').hidden, 'Current qualified session restores its eligible handoff'); navigated.dom.window.close();
  const ime = new w.KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true }); input.dispatchEvent(ime); assert(ime.defaultPrevented);
  const count = d.querySelectorAll('.help-message').length; submit('   '); assert.equal(d.querySelectorAll('.help-message').length, count);
  submit('<img src=x onerror="window.injected=true"><script>alert(1)</script>');
  assert.equal(d.querySelector('.help-conversation img, .help-conversation script'), null); assert.equal(w.injected, undefined);
  submit('pending then reset', false); d.querySelector('.help-reset').click(); flush();
  assert.equal(d.querySelectorAll('.help-message').length, 1, 'Reset cancels delayed replies');
  assert.equal(JSON.parse(w.sessionStorage.getItem(KEY)).context.product, undefined);
  assert(d.querySelector('.help-contact').hidden); assert(d.querySelector('.help-form-link').hidden);
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
  if (/가격이랑/.test(query)) { assert.match(r.text, /냉장/); assert.match(r.text, /개인|사업/); assert.equal(r.handoff, false); }
  checks++;
}
for (const lang of Object.keys(settings)) {
  const data = fixture.w.MOKDA_HELP_DATA[lang];
  for (const q of data.categories.flatMap(item => item.questions)) {
    const result = e.reply(q.question, { language: lang }); assert(result.text.length >= 12, `${lang}/${q.id}: ${result.text}`); assert.equal(result.language, lang);
    for (const source of result.sources) {
      if (source.url) { assert.equal(source.url, 'https://www.instagram.com/mokda_official/'); continue; }
      assert(existsSync(new URL(`${settings[lang].prefix}/${source.path.split(/[?#]/)[0]}`, root)), source.path);
    }
    checks++;
  }
  const unsafe = e.reply('Does K-PEÑO have milk? Is it safe for my allergy?', { language: lang });
  assert.equal(unsafe.handoff, false, 'Allergen guidance does not immediately contact the team'); assert.match(unsafe.text, /(?:K-PEÑO|allerg|알레르|al[eé]rgen)/i); assert.equal(unsafe.aiTextAllowed, false);
}
const corrections = e.reply('Estoy en México, no Perú.', { language: 'ES', context: { country: 'Peru', purpose: 'buy', topic: 'buy', lastQuestion: '¿Dónde comprar?' } });
assert.equal(corrections.context.country, 'Mexico'); assert.doesNotMatch(corrections.handoffSummary, /Peru/);
const oldInquiry = e.reply('Quiero comprar K-PEÑO en Perú, 100 botellas.', { language: 'ES' });
const movedInquiry = e.reply('México, no Perú.', { language: 'ES', context: oldInquiry.context });
const reducedInquiry = e.reply('10 botellas en lugar de 100.', { language: 'ES', context: movedInquiry.context });
assert.match(reducedInquiry.handoffSummary, /Mexico/); assert.match(reducedInquiry.handoffSummary, /10 botellas/);
assert.doesNotMatch(reducedInquiry.handoffSummary, /Per[uú]|100/);
const funnelCases = {
  KR: { retail: '개인적으로 K-PEÑO를 구매하고 싶어요', peru: '페루에 있어요', korea: '한국이에요', latam: /중남미.*아직.*직접 판매|중남미에서는 아직 소비자에게 직접 판매/, domestic: /한국.*판매/, business: '사업 거래 가격이 궁금해요', context: '페루 수입사입니다', product: 'K-PEÑO가 관심 있어요', storage: '개봉 후 보관 방법', spice: 'K-PEÑO가 얼마나 매워요?', human: settings.KR.human },
  ES: { retail: 'Quiero comprar K-PEÑO para consumo personal', peru: 'En Perú', korea: 'Corea', latam: /Todav[ií]a no vendemos directamente.*Latinoam[eé]rica/, domestic: /vendemos al consumidor en Corea/, business: 'Quiero consultar precios comerciales', context: 'Somos una importadora en Perú', product: 'Me interesa K-PEÑO', storage: '¿Cómo se conservan después de abrir?', spice: '¿Qué tan picante es K-PEÑO?', human: settings.ES.human },
  EN: { retail: 'I want to buy K-PEÑO for personal use', peru: 'In Peru', korea: 'Korea', latam: /not yet selling directly.*Latin America/, domestic: /sell to consumers in Korea/, business: 'I would like to discuss business pricing', context: 'We are an importer in Peru', product: 'I am interested in K-PEÑO', storage: 'How should I store it after opening?', spice: 'How spicy is K-PEÑO?', human: settings.EN.human },
};
const contextualCases = {
  KR: { buyWhatsApp: '페루에서 개인적으로 한 병을 와츠앱으로 구매할 수 있나요?', productOrigin: '페루 수입사입니다. 한국 소스 두 제품 모두 관심 있고 거래 가격을 문의하고 싶어요.', originOnly: '한국 소스를 개인적으로 구매하고 싶어요', directWhatsApp: '와츠앱으로 연결해주세요' },
  ES: { buyWhatsApp: '¿Puedo comprar por WhatsApp una botella para mí en Perú?', productOrigin: 'Somos una importadora en Perú interesada en las salsas de Corea. Nos interesan ambas salsas y las condiciones comerciales.', originOnly: 'Quiero comprar salsas de Corea para consumo personal', directWhatsApp: 'Quiero hablar por WhatsApp' },
  EN: { buyWhatsApp: 'Can I buy one bottle for personal use in Peru via WhatsApp?', productOrigin: 'We are an importer in Peru interested in sauces from Korea. Both products, please send a quote.', originOnly: 'I want to buy sauces from Korea for personal use', directWhatsApp: 'Please connect me on WhatsApp' },
};
for (const [lang, q] of Object.entries(funnelCases)) {
  let r = e.reply(q.retail, { language: lang });
  assert.equal(r.context.audience, 'B2C'); assert.equal(r.handoff, false); assert.equal(r.decision.stage, 'country');
  r = e.reply(q.peru, { language: lang, context: r.context });
  assert.match(r.text, q.latam); assert.equal(r.handoff, false); assert.equal(r.context.handoffEligible, false);
  assert(r.sources.some(source => source.path === 'kpeno.html')); assert(!r.sources.some(source => /contact/.test(source.path || '')));
  r = e.reply(q.korea, { language: lang, context: r.context });
  assert.match(r.text, q.domestic); assert.equal(r.handoff, false); assert(r.sources.some(source => source.url === 'https://www.instagram.com/mokda_official/'));
  let b = e.reply(q.business, { language: lang }); assert.equal(b.handoff, false); assert.equal(b.context.audience, 'B2B', `${lang}: ${q.business}`);
  b = e.reply(q.context, { language: lang, context: b.context });
  assert.equal(b.context.country, 'Peru'); assert.equal(b.context.businessType, 'importer'); assert.equal(b.decision.stage, 'product'); assert.equal(b.handoff, false);
  b = e.reply(q.product, { language: lang, context: b.context });
  assert.equal(b.handoff, true); assert.equal(b.decision.reason, 'qualified_business'); assert.equal(b.decision.missingFields.length, 0);
  assert.match(b.handoffSummary, /K-PEÑO/); assert.match(b.handoffSummary, /Peru/); assert.match(b.handoffSummary, /수입사|Importadora|Importer/);
  for (const question of [q.storage, q.spice]) { const resolved = e.reply(question, { language: lang, context: b.context }); assert.equal(resolved.handoff, false, question); assert(resolved.sources.some(source => source.path === 'kpeno.html')); }
  const unknown = e.reply('zzzzzz?', { language: lang, context: b.context }); assert.equal(unknown.handoff, false); assert.equal(unknown.decision.reason, 'clarify_unknown');
  const human = e.reply(q.human, { language: lang }); assert.equal(human.handoff, true); assert.equal(human.decision.reason, 'explicit_human');
  const prefilled = e.reply(`${q.business}. ${q.context}. ${q.product}`, { language: lang });
  assert.equal(prefilled.handoff, true, 'Already supplied fields are not asked again'); assert.equal(prefilled.decision.missingFields.length, 0);
  const aiUntrusted = e.reply('zzzzzz?', { language: lang, interpretation: { intent: 'contact', handoff: true, audience: 'fake', product: 'imaginary', country: 'Atlantis' } });
  assert.equal(aiUntrusted.handoff, false, 'AI cannot enable contact by supplying a handoff flag'); assert.equal(aiUntrusted.context.country, undefined);
  const contextual = contextualCases[lang];
  const purchaseByWhatsApp = e.reply(contextual.buyWhatsApp, { language: lang });
  assert.equal(purchaseByWhatsApp.handoff, false, 'Mentioning WhatsApp in a purchase question still answers consumer availability');
  assert.equal(purchaseByWhatsApp.decision.reason, 'consumer_availability'); assert.match(purchaseByWhatsApp.text, q.latam);
  for (const interpretation of [undefined, { intent: 'pricing', audience: 'B2B', country: 'Peru', businessType: 'importer', product: 'both' }]) {
    const origin = e.reply(contextual.productOrigin, { language: lang, interpretation });
    assert.equal(origin.context.country, 'Peru', 'Korean product origin cannot overwrite the buyer country');
    assert.equal(origin.handoff, true); assert.match(origin.handoffSummary, /(?:국가|Pa[ií]s|Country): Peru/);
  }
  const originWithoutCountry = e.reply(contextual.originOnly, { language: lang });
  assert.equal(originWithoutCountry.context.country, undefined, 'Product origin alone does not establish a buying country');
  assert.equal(originWithoutCountry.decision.stage, 'country'); assert.equal(originWithoutCountry.handoff, false);
  assert.equal(e.reply(contextual.directWhatsApp, { language: lang }).decision.reason, 'explicit_human', 'An explicit request to connect on WhatsApp remains available');
  const ui = start(lang); ui.submit(q.retail); ui.submit(q.peru);
  assert(ui.d.querySelector('.help-contact').hidden); assert(ui.d.querySelector('.help-form-link').hidden);
  ui.submit(q.korea); assert.equal(ui.d.querySelector('.help-detail-link[href="https://www.instagram.com/mokda_official/"]').rel, 'noopener noreferrer'); ui.dom.window.close();
  checks += 17;
}
fixture.dom.window.close();
for (const number of ['', 'invalid', '0123456789', '1234567', '12025550100<script>']) {
  const f = start('EN', { number }); f.submit('K-PEÑO business pricing for an importer in Peru'); assert(!f.d.querySelector('.help-contact').hidden); assert.equal(f.d.querySelector('.help-contact').getAttribute('href'), '/en/contact.html?purpose=distribution'); assert.equal(f.d.querySelector('.help-contact').target, ''); f.dom.window.close();
}
const mobile = start('ES', { width: 390 }); mobile.d.querySelector('.help-launcher').click();
assert.equal(mobile.d.querySelector('dialog').getAttribute('aria-modal'), 'true'); assert.equal(mobile.d.body.style.overflow, 'hidden');
mobile.d.querySelector('.help-close').click(); mobile.flush(); assert.equal(mobile.d.body.style.overflow, ''); mobile.dom.window.close();
const contactNavigation = start('EN'); contactNavigation.d.querySelector('.help-launcher').click(); contactNavigation.submit('K-PEÑO business pricing for an importer in Peru');
const contactAnchor = contactNavigation.d.querySelector('.help-form-link'); contactAnchor.addEventListener('click', e => e.preventDefault()); contactAnchor.click();
assert.equal(JSON.parse(contactNavigation.w.sessionStorage.getItem(KEY)).open, false, 'Internal navigation folds the panel so the destination is visible');
assert.match(contactNavigation.w.sessionStorage.getItem('mokdaChatInquiryDraft'), /K-PEÑO/); contactNavigation.dom.window.close();
for (const saved of ['{bad', JSON.stringify({ version: 2, at: Date.now() - 5 * 60 * 60 * 1000, transcript: [] })]) { const f = start('EN', { saved }); assert.equal(f.d.querySelectorAll('.help-message').length, 1); f.dom.window.close(); }
const blocked = start('EN', { blockedStorage: true }); blocked.submit('price'); assert.deepEqual(blocked.errors, []); blocked.dom.window.close();
const oldSession = start('EN', { saved: JSON.stringify({ version: 2, at: Date.now(), context: { lastQuestion: 'retail price', handoffEligible: true }, transcript: [{ role: 'bot', text: 'Old guidance' }], open: true }) });
assert(oldSession.d.querySelector('.help-contact').hidden, 'Older stored handoff flags cannot bypass current qualification'); oldSession.dom.window.close();
const reduced = start('EN', { reducedMotion: true }); reduced.submit('How spicy is K-PEÑO?', false); assert(reduced.delays().some(delay => delay >= 1400 && delay <= 1900)); assert.equal(reduced.d.querySelector('.help-processing').hidden, false); reduced.flush(); reduced.dom.window.close();
// Async responses must finish both the visible delay and the current request.
const settle = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
let firstResolve, secondResolve; const calls = [];
const asyncUi = start('EN', { aiClient: { isEnabled: () => true, answer: args => { calls.push(args); return new Promise(resolve => { if (calls.length === 1) firstResolve = resolve; else secondResolve = resolve; }); } } });
asyncUi.submit('How spicy is K-PEÑO?', false); asyncUi.flush(); assert.equal(asyncUi.d.querySelectorAll('.help-message').length, 2); assert(!asyncUi.d.querySelector('.help-processing').hidden, 'Delay completion waits for AI or its fallback');
asyncUi.d.querySelector('.help-reset').click(); assert(calls[0].signal.aborted); assert.equal(asyncUi.d.querySelectorAll('.help-message').length, 1);
asyncUi.submit('How spicy is Para Carnes?', false); firstResolve({ text: 'Stale reply must never appear', interpretation: { product: 'kpeno', intent: 'choose' } }); await settle(); asyncUi.flush();
assert.doesNotMatch(asyncUi.d.querySelector('.help-conversation').textContent, /Stale reply/); assert.equal(asyncUi.d.querySelectorAll('.help-message').length, 2);
secondResolve({ text: 'The current reply explains Para Carnes.', interpretation: { product: 'para_carnes', intent: 'choose' } }); await settle(); assert.equal(asyncUi.d.querySelectorAll('.help-message').length, 3); assert.match(latest(asyncUi).textContent, /current reply/); assert(asyncUi.d.querySelector('.help-contact').hidden); assert.equal(asyncUi.d.activeElement, asyncUi.d.querySelector('textarea')); asyncUi.dom.window.close();
let earlyResolve; const early = start('EN', { aiClient: { isEnabled: () => true, answer: () => new Promise(resolve => { earlyResolve = resolve; }) } });
early.submit('How spicy is K-PEÑO?', false); earlyResolve(null); await settle(); assert.equal(early.d.querySelectorAll('.help-message').length, 2); assert(!early.d.querySelector('.help-processing').hidden, 'Fast network fallback still observes the minimum preparation delay'); early.flush(); assert.match(latest(early).textContent, /K-PEÑO/); assert.equal(early.d.activeElement, early.d.querySelector('textarea')); early.dom.window.close();
const rejected = start('EN', { aiClient: { isEnabled: () => true, answer: () => Promise.reject(new Error('Network failure')) } }); rejected.submit('How spicy is K-PEÑO?', false); rejected.flush(); await settle(); assert.equal(rejected.d.querySelector('.help-processing').hidden, true); assert.match(latest(rejected).textContent, /K-PEÑO/); rejected.dom.window.close();
let quickCalls = 0; const quickUi = start('EN', { aiClient: { isEnabled: () => true, answer: () => { quickCalls++; return Promise.resolve(null); } } });
quickUi.d.querySelector('.help-choice').click(); quickUi.flush(); await settle(); assert.equal(quickCalls, 0, 'Predefined funnel options do not consume an AI request'); assert.equal(quickUi.d.querySelectorAll('.help-message').length, 3); quickUi.dom.window.close();
const consumerAI = start('EN', { aiClient: { isEnabled: () => true, answer: () => Promise.resolve({ text: 'False retail stock claim must not be shown.', interpretation: { intent: 'buy', audience: 'B2C', product: 'kpeno', country: 'Peru' } }) } });
consumerAI.submit('Can I buy K-PEÑO for personal use in Peru?', false); await settle(); consumerAI.flush(); assert.match(latest(consumerAI).textContent, /not yet selling directly/); assert.doesNotMatch(latest(consumerAI).textContent, /False retail/); assert(consumerAI.d.querySelector('.help-contact').hidden); consumerAI.dom.window.close();
const businessAI = start('EN', { aiClient: { isEnabled: () => true, answer: () => Promise.resolve({ text: 'Invented price must not be shown.', interpretation: { intent: 'pricing', audience: 'B2B', product: 'kpeno', country: 'Peru', businessType: 'importer' } }) } });
businessAI.submit('K-PEÑO business pricing for an importer in Peru', false); await settle(); businessAI.flush(); assert(!businessAI.d.querySelector('.help-contact').hidden); assert.doesNotMatch(latest(businessAI).textContent, /Invented price/); assert.match(new URL(businessAI.d.querySelector('.help-contact').href).searchParams.get('text'), /K-PEÑO.*\n.*Peru/s); businessAI.dom.window.close();
for (const contactValue of ['', 'Existing inquiry']) { const f = start('EN', { contactValue, draft: 'Question from chat' }); assert.equal(f.d.getElementById('messageInput').value, contactValue || 'Question from chat'); assert.equal(f.w.sessionStorage.getItem('mokdaChatInquiryDraft'), null); f.dom.window.close(); }
const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
assert.equal(urls.length, 48);
for (const url of process.env.MOKDA_HELP_SKIP_INTEGRATION === '1' ? [] : urls) {
  const path = url.pathname.slice(1) + (url.pathname.endsWith('/') ? 'index.html' : '');
  const dom = new JSDOM(read(path), { url: url.href }); const d = dom.window.document;
  const loaded = [...d.querySelectorAll('script[src]')].map(script => new URL(script.src).pathname);
  const required = scripts.map(file => `/${file}`);
  for (const src of required) assert.equal(loaded.filter(value => value === src).length, 1, `${path}: ${src}`);
  const order = required.map(src => loaded.indexOf(src)); assert.deepEqual(order, [...order].sort((a, b) => a - b));
  assert.equal([...d.querySelectorAll('link[rel="stylesheet"]')].filter(link => new URL(link.href).pathname === '/styles/site-help.css').length, 1); dom.window.close();
}
console.log(`Messenger checks passed: ${checks} localized answer/context checks, B2C availability and Instagram, B2B qualification, gated contact controls, preparation delays, AI cancellation/fallback, product/country/quantity corrections, WhatsApp encoding, preserved composer focus, session recovery, input safety and modal cleanup. ${process.env.MOKDA_HELP_SKIP_INTEGRATION === '1' ? 'Page integration skipped until regeneration.' : '48 page integrations passed.'} Native layout/keyboard behavior is verified separately in the browser.`);

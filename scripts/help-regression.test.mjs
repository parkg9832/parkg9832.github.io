import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const sources = { config: read('site-contact-config.js'), data: read('site-help-data.js'), intents: read('site-chat-intents.js'), help: read('site-help.js') };
const DRAFT_KEY = 'mokdaChatInquiryDraft';
const languages = {
  KR: { prefix: 'ko', html: 'ko-KR', queries: ['가격이 얼마인가요?', '우유 알레르기가 있어요', '내일 날씨를 알려줘'], message: '안녕하세요, MOKDA. 다음 내용으로 문의합니다:' },
  ES: { prefix: 'es', html: 'es-419', queries: ['¿Cuánto cuestan las salsas?', '¿Contiene leche?', '¿Cuál es el clima mañana?'], message: 'Hola, MOKDA. Quisiera consultar sobre:' },
  EN: { prefix: 'en', html: 'en', queries: ['How much are the sauces?', 'Does this contain milk?', 'What is the weather tomorrow?'], message: 'Hello, MOKDA. I would like to ask about:' },
};
const questionIds = ['choose', 'pairings', 'ingredients', 'storage', 'buy', 'pricing', 'export', 'horeca', 'brand', 'history', 'news', 'creators', 'collaboration', 'contact'];
let answerChecks = 0;
let destinationChecks = 0;
let socialChecks = 0;

function start(language, { number = '', mutate, useLanguageGetter = true, omitData = false, omitIntents = false, nativeDialog = true, contactValue, draft, blockedStorage = false } = {}) {
  const prefix = languages[language]?.prefix || 'es';
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM('<!doctype html><html><head></head><body><main><button id="page-control">Page control</button></main></body></html>', {
    url: `https://www.mokda.kr/${prefix}/index.html?utm_medium=verification`, runScripts: 'outside-only', virtualConsole,
  });
  const w = dom.window;
  const d = w.document;
  d.documentElement.dataset.routeLanguage = language;
  if (useLanguageGetter) w.MOKDA_I18N = { getLanguage: () => language };
  const calls = { open: 0, close: 0, requests: 0 };
  // Fixture has no resource loader. Explicit requests are a regression.
  const forbidden = () => { calls.requests++; throw new Error('Chat must not send network requests'); };
  w.fetch = forbidden; w.XMLHttpRequest.prototype.send = forbidden; w.WebSocket = forbidden; w.navigator.sendBeacon = forbidden;
  Object.defineProperties(w.HTMLDialogElement.prototype, {
    show: { configurable: true, value: nativeDialog ? function () { this.setAttribute('open', ''); calls.open++; } : undefined },
    showModal: { configurable: true, value() { throw new Error('Chat must stay non-modal'); } },
    close: { configurable: true, value() {
      if (!this.open) return;
      this.removeAttribute('open'); calls.close++; this.dispatchEvent(new w.Event('close'));
    } },
  });
  if (contactValue !== undefined) {
    const field = d.createElement('textarea'); field.id = 'messageInput'; field.value = contactValue; d.querySelector('main').appendChild(field);
  }
  if (draft !== undefined) w.sessionStorage.setItem(DRAFT_KEY, draft);
  if (blockedStorage) Object.defineProperty(w, 'sessionStorage', { get() { throw new Error('Storage unavailable'); } });
  w.eval(sources.config);
  // Reserved example number is confined to this isolated window, never public configuration.
  w.MOKDA_CONTACT.whatsappNumber = number;
  if (!omitData) {
    w.eval(sources.data);
    if (mutate) { w.MOKDA_HELP_DATA = JSON.parse(JSON.stringify(w.MOKDA_HELP_DATA)); mutate(w.MOKDA_HELP_DATA); }
  }
  if (!omitIntents) w.eval(sources.intents);
  w.eval(sources.help);
  return { dom, w, d, calls, errors };
}

function open({ d, calls }) {
  const launcher = d.querySelector('.help-launcher'); launcher.focus(); launcher.click();
  assert.equal(d.querySelector('dialog').open, true);
  assert.equal(launcher.getAttribute('aria-expanded'), 'true');
  assert.equal(d.activeElement, d.querySelector('.help-close')); assert(calls.open > 0);
}

function choose(d, selector, label) {
  const button = [...d.querySelectorAll(selector)].find(item => item.textContent === label);
  assert(button, `Choice exists: ${label}`); assert.equal(button.type, 'button'); button.click();
}

function submit({ w, d }, query) {
  d.querySelector('.help-composer input').value = query;
  const event = new w.Event('submit', { bubbles: true, cancelable: true });
  assert.equal(d.querySelector('.help-composer').dispatchEvent(event), false, 'Submit is handled locally');
  assert.equal(event.defaultPrevented, true);
}

function latest(d, role = 'bot') { return [...d.querySelectorAll(`.help-message-${role}`)].at(-1); }

function initialState(d) {
  assert.equal(d.querySelectorAll('.help-message-bot').length, 1);
  assert.equal(d.querySelectorAll('.help-message-user').length, 0);
  assert.equal(d.querySelectorAll('.help-topic').length, 4);
  assert.equal(d.querySelectorAll('.help-quick-question').length, 3);
  assert.equal(d.querySelectorAll('.help-question').length, 0);
  assert.equal(d.querySelector('.help-composer input').value, '');
}

function fallbackHandoff(d, prefix, path = 'contact.html') {
  const link = d.querySelector('.help-contact');
  assert.equal(link.getAttribute('href'), `/${prefix}/${path}`);
  assert.equal(link.hasAttribute('target'), false); assert.equal(link.hasAttribute('rel'), false);
}

function verifyDestination(href, question, prefix) {
  assert.equal(href, `/${prefix}/${question.link.path}`);
  const destination = new URL(href, 'https://www.mokda.kr');
  assert.equal(destination.origin, 'https://www.mokda.kr');
  const destinationFile = new URL(destination.pathname.slice(1), root);
  assert(existsSync(destinationFile), `Destination exists: ${destination.pathname}`);
  const targetDom = new JSDOM(readFileSync(destinationFile, 'utf8'));
  const target = targetDom.window.document;
  assert(target.querySelector('main'), 'Destination is an active content page');
  if (destination.hash) {
    const section = target.getElementById(decodeURIComponent(destination.hash.slice(1)));
    assert(section, `Destination anchor exists: ${destination.hash}`); assert(section.querySelector('h2')?.textContent.trim());
  }
  if (destination.searchParams.has('purpose')) {
    assert.equal(destination.pathname, `/${prefix}/contact.html`); assert(target.getElementById('purposeSelect'));
    assert.equal(destination.searchParams.get('purpose'), question.id === 'collaboration' ? 'collaboration' : 'distribution');
  }
  targetDom.window.close(); destinationChecks++;
}

for (const [language, settings] of Object.entries(languages)) {
  const fixture = start(language);
  const { w, d, calls, errors } = fixture;
  const categories = w.MOKDA_HELP_DATA[language].categories;
  assert.deepEqual(Array.from(categories, category => category.id), ['products', 'trade', 'brand', 'collaboration']);
  assert.deepEqual(Array.from(categories).flatMap(category => Array.from(category.questions, question => question.id)), questionIds);
  assert.equal(d.getElementById('mokda-help').lang, settings.html);
  const dialog = d.querySelector('dialog');
  assert.equal(dialog.open, false, 'Chat does not interrupt page arrival');
  assert.equal(dialog.getAttribute('aria-modal'), 'false'); assert.equal(dialog.getAttribute('aria-labelledby'), 'mokda-help-title');
  assert.equal(d.querySelector('[role="log"]').getAttribute('aria-live'), 'polite');
  for (const node of [d.querySelector('.help-launcher'), d.querySelector('.help-close'), d.querySelector('.help-composer input'), d.querySelector('.help-composer button')]) assert(node.getAttribute('aria-label'));
  assert.equal(d.querySelector('.help-composer input').maxLength, 500);
  initialState(d); fallbackHandoff(d, settings.prefix); open(fixture);

  for (const [index, category] of categories.entries()) {
    d.querySelectorAll('.help-topic')[index].click();
    assert.equal(latest(d, 'user').querySelector('p').textContent, category.label);
    assert.equal(d.querySelectorAll('.help-question').length, category.questions.length);
    for (const question of category.questions) {
      choose(d, '.help-question', question.question);
      assert.equal(latest(d, 'user').querySelector('p').textContent, question.question);
      assert.equal(latest(d).querySelector('p').textContent, question.answer, `${language}/${question.id}: immediate answer`);
      assert.equal(d.activeElement, latest(d));
      assert.equal(d.querySelectorAll('.help-question').length, 0, 'No extra confirmation gate');
      const detail = latest(d).querySelector('a');
      if (question.link.path.startsWith('contact.html')) {
        assert.equal(detail, null, 'Contact is the persistent explicit handoff');
        verifyDestination(d.querySelector('.help-contact').getAttribute('href'), question, settings.prefix);
      } else {
        assert(detail); verifyDestination(detail.getAttribute('href'), question, settings.prefix); fallbackHandoff(d, settings.prefix);
      }
      assert.equal(w.sessionStorage.getItem(DRAFT_KEY), null, 'Answer alone does not store the visitor question');
      answerChecks++;
      d.querySelector('.help-reset').click(); d.querySelectorAll('.help-topic')[index].click();
    }
    d.querySelector('.help-reset').click(); initialState(d);
  }

  // Three common questions skip topic selection entirely.
  for (const [index, id] of ['choose', 'buy', 'export'].entries()) {
    d.querySelectorAll('.help-quick-question')[index].click();
    const question = categories.flatMap(category => category.questions).find(item => item.id === id);
    assert.equal(latest(d).querySelector('p').textContent, question.answer);
    assert.equal(d.querySelectorAll('.help-message').length, 3);
    d.querySelector('.help-other').click(); assert.equal(d.querySelectorAll('.help-topic').length, 4); d.querySelector('.help-reset').click();
  }

  for (const [index, id] of ['pricing', 'ingredients', null].entries()) {
    submit(fixture, settings.queries[index]);
    assert.equal(latest(d, 'user').querySelector('p').textContent, settings.queries[index]);
    if (id) assert.equal(latest(d).querySelector('p').textContent, categories.flatMap(category => category.questions).find(item => item.id === id).answer);
    else { assert.equal(latest(d).querySelector('a'), null); assert.equal(d.querySelectorAll('.help-topic').length, 4); }
    assert.equal(d.querySelector('.help-composer input').value, ''); assert.equal(w.sessionStorage.getItem(DRAFT_KEY), null);
  }
  const transcript = d.querySelector('.help-conversation').textContent;
  const handoff = d.querySelector('.help-contact'); handoff.addEventListener('click', event => event.preventDefault()); handoff.click();
  assert.equal(w.sessionStorage.getItem(DRAFT_KEY), settings.queries[2], 'Explicit contact click stores only the latest question');
  assert.notEqual(w.sessionStorage.getItem(DRAFT_KEY), transcript);

  d.querySelector('.help-close').click();
  assert.equal(dialog.open, false); assert.equal(d.querySelector('.help-launcher').getAttribute('aria-expanded'), 'false');
  assert.equal(d.activeElement, d.querySelector('.help-launcher'));
  open(fixture); assert.equal(d.querySelector('.help-conversation').textContent, transcript, 'Reopening preserves this page conversation');
  d.querySelector('.help-composer input').focus();
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })); assert.equal(dialog.open, false);
  open(fixture); d.getElementById('page-control').focus();
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  assert.equal(dialog.open, true, 'Escape outside a non-modal chat belongs to the page');
  d.querySelector('.help-launcher').click(); assert.equal(dialog.open, false, 'Launcher toggles closed');
  open(fixture); d.querySelector('.help-reset').click(); initialState(d); assert.equal(d.activeElement, d.querySelector('.help-close'));

  const before = d.querySelectorAll('.help-message').length; submit(fixture, '   '); assert.equal(d.querySelectorAll('.help-message').length, before);
  const input = d.querySelector('.help-composer input'); input.focus();
  const composingEnter = new w.KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true });
  input.dispatchEvent(composingEnter); assert.equal(composingEnter.defaultPrevented, true, 'IME completion must not submit early');
  const plainEnter = new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  input.dispatchEvent(plainEnter); assert.equal(plainEnter.defaultPrevented, false);
  submit(fixture, 'x'.repeat(600)); assert.equal(latest(d, 'user').querySelector('p').textContent.length, 500);
  for (let i = 0; i < 20; i++) submit(fixture, `unknown request ${i}`);
  assert.equal(d.querySelectorAll('.help-message').length, 25); assert.equal(latest(d, 'user').querySelector('p').textContent, 'unknown request 19');
  w.eval(sources.help); assert.equal(d.querySelectorAll('#mokda-help').length, 1);
  assert.equal(calls.requests, 0); assert.deepEqual(errors, []); fixture.dom.window.close();
}

for (const number of ['', 'invalid', '0123456789', '1234567', '1234567890123456', '+1 202-555-0100<script>']) {
  const fixture = start('ES', { number }); open(fixture); submit(fixture, 'precio');
  fallbackHandoff(fixture.d, 'es', 'contact.html?purpose=distribution'); fixture.dom.window.close();
}

for (const [language, settings] of Object.entries(languages)) {
  const fixture = start(language, { number: '+1 (202) 555-0100' }); open(fixture);
  const query = 'Consulta & precio + MOQ / ¿sí? #información'; submit(fixture, query);
  const link = fixture.d.querySelector('.help-contact'); const destination = new URL(link.href);
  assert.equal(destination.origin, 'https://wa.me'); assert.equal(destination.pathname, '/12025550100');
  assert.equal(destination.searchParams.get('text'), `${settings.message} ${query}`);
  assert.equal(destination.searchParams.size, 1); assert.equal(destination.hash, '');
  assert.equal(link.target, '_blank'); assert.equal(link.rel, 'noopener noreferrer');
  link.addEventListener('click', event => event.preventDefault()); link.click();
  assert.equal(fixture.w.sessionStorage.getItem(DRAFT_KEY), null, 'WhatsApp opens a draft without storing or sending the transcript');
  assert.equal(fixture.calls.requests, 0); fixture.dom.window.close();
}

const socialExamples = {
  KR: { greetings: ['  안녕하세요!!!  ', '안녕.', '반갑습니다?'], thanks: ['감사합니다!', '고마워요.'], reply: '네, 궁금한 점이 더 있으면 편하게 물어보세요.', buying: '안녕하세요, 어디에서 구매할 수 있나요?' },
  ES: { greetings: ['  ¡HoLa!  ', 'BUENOS DÍAS!!!', 'buenas tardes.'], thanks: ['¡GRACIAS!', 'Muchas gracias.'], reply: '¡Con gusto! Si tienes otra pregunta, aquí estamos.', buying: 'Hola, quiero comprar las salsas.' },
  EN: { greetings: ['  HeLLo!!  ', 'GOOD MORNING.', 'Hi?'], thanks: ['THANK YOU!', 'Thanks.'], reply: 'You’re welcome. Feel free to ask another question.', buying: 'Hello, where can I buy the sauces?' },
};
for (const [language, examples] of Object.entries(socialExamples)) {
  const settings = languages[language];
  const fixture = start(language); open(fixture);
  const welcome = latest(fixture.d).querySelector('p').textContent;
  for (const greeting of examples.greetings) {
    submit(fixture, greeting);
    assert.equal(latest(fixture.d, 'user').querySelector('p').textContent, greeting.trim());
    assert.equal(latest(fixture.d).querySelector('p').textContent, welcome, 'Standalone greeting gets the welcome, not the unknown-question reply');
    assert.equal(fixture.d.querySelectorAll('.help-topic').length, 4);
    fallbackHandoff(fixture.d, settings.prefix);
    assert.equal(fixture.w.sessionStorage.getItem(DRAFT_KEY), null);
    socialChecks++;
  }
  const priceQuestion = settings.queries[0]; submit(fixture, priceQuestion);
  const optionsBeforeThanks = fixture.d.querySelector('.help-options').textContent;
  for (const thanks of examples.thanks) {
    submit(fixture, thanks);
    assert.equal(latest(fixture.d).querySelector('p').textContent, examples.reply);
    assert.equal(fixture.d.querySelector('.help-options').textContent, optionsBeforeThanks, 'Polite response keeps the current choices');
    fallbackHandoff(fixture.d, settings.prefix, 'contact.html?purpose=distribution');
    assert.equal(fixture.w.sessionStorage.getItem(DRAFT_KEY), null);
    socialChecks++;
  }
  const handoff = fixture.d.querySelector('.help-contact');
  handoff.addEventListener('click', event => event.preventDefault()); handoff.click();
  const savedQuestion = fixture.w.sessionStorage.getItem(DRAFT_KEY);
  assert.equal(savedQuestion, priceQuestion, 'Thanks must not replace the actual question sent to the inquiry form');
  const contact = start(language, { contactValue: '', draft: savedQuestion });
  assert.equal(contact.d.getElementById('messageInput').value, priceQuestion);
  assert.equal(contact.w.sessionStorage.getItem(DRAFT_KEY), null); contact.dom.window.close();
  fixture.w.sessionStorage.removeItem(DRAFT_KEY);
  submit(fixture, examples.buying);
  const buyAnswer = fixture.w.MOKDA_HELP_DATA[language].categories.flatMap(category => category.questions).find(question => question.id === 'buy').answer;
  assert.equal(latest(fixture.d).querySelector('p').textContent, buyAnswer, 'Greeting plus a real question still reaches the business matcher');
  handoff.click(); assert.equal(fixture.w.sessionStorage.getItem(DRAFT_KEY), examples.buying);
  assert.equal(fixture.calls.requests, 0); assert.deepEqual(fixture.errors, []); fixture.dom.window.close();

  const whatsapp = start(language, { number: '+1 (202) 555-0100' }); open(whatsapp); submit(whatsapp, priceQuestion);
  const inquiryHref = whatsapp.d.querySelector('.help-contact').href;
  for (const social of [examples.thanks[0], examples.greetings[1]]) {
    submit(whatsapp, social);
    assert.equal(whatsapp.d.querySelector('.help-contact').href, inquiryHref, 'Polite response preserves the WhatsApp question draft');
    assert.equal(new URL(inquiryHref).searchParams.get('text'), `${settings.message} ${priceQuestion}`);
    socialChecks++;
  }
  assert.equal(whatsapp.w.sessionStorage.getItem(DRAFT_KEY), null);
  assert.equal(whatsapp.calls.requests, 0); assert.deepEqual(whatsapp.errors, []); whatsapp.dom.window.close();
}

const malicious = '<img src=x onerror="window.injected=true"> & <script>alert(1)</script>';
const unsafe = start('EN', { mutate(data) {
  const question = data.EN.categories[0].questions[0];
  question.question = malicious; question.answer = malicious; question.link.label = malicious; question.link.path = 'javascript:alert(1)';
} });
open(unsafe); unsafe.d.querySelector('.help-quick-question').click();
assert.equal(latest(unsafe.d, 'user').querySelector('p').textContent, malicious);
assert.equal(latest(unsafe.d).querySelector('p').textContent, malicious);
assert.equal(latest(unsafe.d).querySelector('a').textContent, `${malicious} ↗`);
assert.equal(latest(unsafe.d).querySelector('a').getAttribute('href'), '/en/qna.html');
submit(unsafe, malicious); assert.equal(latest(unsafe.d, 'user').querySelector('p').textContent, malicious);
assert.equal(unsafe.d.querySelector('.help-conversation img, .help-conversation script'), null);
assert.equal(unsafe.w.injected, undefined); assert.equal(unsafe.calls.requests, 0); unsafe.dom.window.close();

for (const contactValue of ['', 'Existing inquiry']) {
  const fixture = start('KR', { contactValue, draft: 'Latest question from chat' });
  assert.equal(fixture.d.getElementById('messageInput').value, contactValue || 'Latest question from chat');
  assert.equal(fixture.w.sessionStorage.getItem(DRAFT_KEY), null, 'Contact consumes the draft once'); fixture.dom.window.close();
}
const boundedDraft = start('EN', { contactValue: '', draft: 'x'.repeat(900) });
assert.equal(boundedDraft.d.getElementById('messageInput').value.length, 500); boundedDraft.dom.window.close();
const blocked = start('EN', { contactValue: '', blockedStorage: true }); open(blocked); submit(blocked, 'price');
blocked.d.querySelector('.help-contact').addEventListener('click', event => event.preventDefault()); blocked.d.querySelector('.help-contact').click();
assert.equal(blocked.d.getElementById('messageInput').value, ''); assert.deepEqual(blocked.errors, []); blocked.dom.window.close();

const noIntents = start('EN', { omitIntents: true }); open(noIntents); submit(noIntents, 'price');
assert.equal(latest(noIntents.d).querySelector('a'), null, 'Missing matcher falls back to contact, not guessed answers');
assert.equal(noIntents.d.querySelectorAll('.help-topic').length, 4); noIntents.dom.window.close();
const datasetLanguage = start('KR', { useLanguageGetter: false }); assert.equal(datasetLanguage.d.getElementById('mokda-help').lang, 'ko-KR'); datasetLanguage.dom.window.close();
const unknownLanguage = start('XX'); assert.equal(unknownLanguage.d.getElementById('mokda-help').lang, 'es-419'); unknownLanguage.dom.window.close();
const missingData = start('EN', { omitData: true }); assert.equal(missingData.d.getElementById('mokda-help'), null); missingData.dom.window.close();
const fallbackDialog = start('EN', { nativeDialog: false }); fallbackDialog.d.querySelector('.help-launcher').click();
assert.equal(fallbackDialog.d.querySelector('dialog').open, false);
assert.equal(fallbackDialog.d.querySelector('.help-launcher').getAttribute('aria-expanded'), 'false');
assert.equal(fallbackDialog.errors.length, 1); assert.match(fallbackDialog.errors[0].message, /Not implemented: navigation/, 'Unsupported dialog takes contact navigation fallback');
assert.equal(fallbackDialog.calls.requests, 0); fallbackDialog.dom.window.close();

const publicUrls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
assert.equal(publicUrls.length, 48, 'All active pages are included');
for (const url of publicUrls) {
  const path = url.pathname.replace(/^\//, '') + (url.pathname.endsWith('/') ? 'index.html' : '');
  const dom = new JSDOM(read(path), { url: url.href });
  const d = dom.window.document;
  const scripts = [...d.querySelectorAll('script[src]')].map(script => new URL(script.src).pathname);
  const dependencies = ['/site-contact-config.js', '/site-help-data.js', '/site-chat-intents.js', '/site-help.js'];
  for (const dependency of dependencies) assert.equal(scripts.filter(src => src === dependency).length, 1, `${path}: ${dependency} is loaded once`);
  assert.deepEqual(dependencies.map(dependency => scripts.indexOf(dependency)), dependencies.map(dependency => scripts.indexOf(dependency)).sort((a, b) => a - b), `${path}: dependencies precede the chat initializer`);
  assert.equal([...d.querySelectorAll('link[rel="stylesheet"]')].filter(link => new URL(link.href).pathname === '/styles/site-help.css').length, 1, `${path}: chat styling is present`);
  dom.window.close();
}

console.log(`Chat regression passed: ${answerChecks} immediate localized answers, ${destinationChecks} destinations, ${publicUrls.length} page integrations, ${socialChecks} polite replies with inquiry context preserved, real question matching, bounded messages/input, non-modal dialog lifecycle, safe text rendering, WhatsApp draft encoding and explicit contact handoff. Native keyboard and layout behavior require browser verification.`);

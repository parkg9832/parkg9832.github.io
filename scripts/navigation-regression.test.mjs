import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const source = readFileSync(new URL('../site-i18n.js', import.meta.url), 'utf8');
for (const [path, targetLanguage, expected] of [
  ['/es/contact.html?purpose=distribution&product=para-carnes', 'KR', '/ko/contact.html?purpose=distribution&product=para-carnes'],
  ['/ko/about.html#history', 'EN', '/en/about.html#history'],
  ['/en/?utm_source=partner#products', 'ES', '/es/?utm_source=partner#products'],
  ['/es/news.html?category=events', 'KR', '/ko/news.html?category=events'],
  ['/ko/news-congreso.html#creators', 'EN', '/en/news-congreso.html#creators'],
]) {
  const { window: dom } = new JSDOM('<button id="langES"></button><button id="langKR"></button><button id="langEN"></button>', { url: `https://www.mokda.kr${path}` });
  let assigned;
  const window = {
    location: { pathname: dom.location.pathname, search: dom.location.search, hash: dom.location.hash, origin: dom.location.origin, assign: value => { assigned = value; } },
    performance: { getEntriesByType: () => [{ type: 'reload' }] },
    history: { scrollRestoration: 'auto' },
    scrollTo: () => { throw new Error('Reload must not reset the reader to the top'); },
  };
  vm.runInNewContext(source, { window, document: dom.document, localStorage: dom.localStorage, URL });
  window.MOKDA_I18N.bindLanguageButtons(() => {});
  dom.document.getElementById(`lang${targetLanguage}`).click();
  assert.equal(assigned, expected);
  assert.equal(window.history.scrollRestoration, 'auto');
  dom.close();
}
// Fresh section links align after page construction, without overriding a reader.
for (const [navigationType, readerMoved, expected] of [['navigate', false, 1], ['navigate', true, 0], ['reload', false, 0], ['back_forward', false, 0]]) {
  const { window: dom } = new JSDOM('<section id="home-news"></section>', { url: 'https://www.mokda.kr/ko/#home-news' });
  const events = new Map();
  let aligned = 0;
  dom.document.getElementById('home-news').scrollIntoView = () => { aligned++; };
  const window = {
    location: dom.location,
    performance: { getEntriesByType: () => [{ type: navigationType }] },
    addEventListener: (name, callback) => events.set(name, callback),
    requestAnimationFrame: callback => callback(),
  };
  vm.runInNewContext(source, { window, document: dom.document, localStorage: dom.localStorage, URL });
  if (readerMoved) events.get('wheel')?.();
  events.get('load')?.();
  assert.equal(aligned, expected, `${navigationType}: preserve reader movement and history`);
  dom.close();
}
console.log('Navigation regressions passed: product context, section links, campaign parameters, fresh deep links and native scroll restoration.');

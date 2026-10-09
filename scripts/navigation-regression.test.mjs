import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
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

// Each public page exposes the same official accounts once, whether its social
// banner is authored in the page or supplied by the shared footer.
const footerSource = readFileSync(new URL('../site-footer.js', import.meta.url), 'utf8');
const officialSocialLinks = [
  ['Instagram', 'https://www.instagram.com/mokda_official/'],
  ['TikTok', 'https://www.tiktok.com/@salsa_coreana'],
  ['Threads', 'https://www.threads.com/@salsa_coreana'],
];
let footerPages = 0;
for (const [locale, language, navigationLabel] of [
  ['es', 'ES', 'Explorar MOKDA'],
  ['en', 'EN', 'Explore MOKDA'],
  ['ko', 'KR', 'MOKDA 둘러보기'],
]) {
  const directory = new URL(`../${locale}/`, import.meta.url);
  for (const page of readdirSync(directory).filter(name => name.endsWith('.html'))) {
    const html = readFileSync(new URL(page, directory), 'utf8');
    const { window: dom } = new JSDOM(html, { url: `https://www.mokda.kr/${locale}/${page}` });
    if (!dom.document.getElementById('footerText')) { dom.close(); continue; }
    vm.runInNewContext(footerSource, { window: dom, document: dom.document });
    dom.MOKDA_FOOTER.render(language);
    dom.MOKDA_FOOTER.render(language);
    const navigation = dom.document.querySelector('#footerText nav');
    assert.equal(navigation.getAttribute('aria-label'), navigationLabel, `${locale}/${page}: localized footer navigation`);
    assert.equal(navigation.querySelectorAll('a').length, 6);
    for (const link of navigation.querySelectorAll('a')) {
      assert.equal(new URL(link.href).pathname.startsWith(`/${locale}/`), true, `${locale}/${page}: footer preserves language`);
    }
    const socialLinks = [...dom.document.querySelectorAll('#socialBanner a, #footerText .mokda-footer-social-links a')];
    assert.equal(socialLinks.length, 3, `${locale}/${page}: official social links must be available without duplicates`);
    for (const [label, href] of officialSocialLinks) {
      const link = socialLinks.find(item => item.getAttribute('aria-label') === label);
      assert.ok(link, `${locale}/${page}: named ${label} icon`);
      assert.equal(link.href, href);
      assert.equal(link.target, '_blank');
      assert.ok(link.relList.contains('noopener'));
      assert.ok(link.relList.contains('noreferrer'));
      assert.ok(link.querySelector('svg[aria-hidden="true"]'));
    }
    footerPages++;
    dom.close();
  }
}
assert.ok(footerPages >= 40, 'Shared footer coverage includes every localized news article and main page');
console.log(`Navigation regressions passed: product context, section links, campaign parameters, fresh deep links, native scroll restoration and official social navigation on ${footerPages} pages.`);

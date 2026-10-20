import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInContext } from 'node:vm';
import { JSDOM, VirtualConsole } from 'jsdom';
import { loadNews } from './news-store.mjs';

const root = new URL('../', import.meta.url), read = name => readFileSync(new URL(name, root), 'utf8');
const news = (await loadNews(fileURLToPath(root))).data;
const pages = ['index', 'about', 'products', 'kpeno', 'para-carnes', 'qna', 'contact', 'news', ...news.stories.map(story => 'news-' + story.id)];
const contentScripts = new Set(['site-i18n.js', 'site-footer.js', 'b2b-config.js', 'site-contact-config.js', 'site-country-data.js', 'site-reviews-data.js', 'site-product-media.js', 'home-experience.js', 'product-detail.js', 'site-news-data.js', 'site-news-model.js', 'site-news.js']);
let documents = 0, retained = 0;
for (const [locale, language] of [['ko', 'KR'], ['es', 'ES'], ['en', 'EN']]) for (const page of pages) {
  const errors = [], console = new VirtualConsole(); console.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM(read(`${locale}/${page}.html`), { url: `https://www.mokda.kr/${locale}/${page}.html`, runScripts: 'outside-only', virtualConsole: console });
  const w = dom.window, d = w.document;
  assert.equal(d.body.dataset.contentLanguage, language, 'Every published page retains its build language');
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.ResizeObserver = class { observe() {} disconnect() {} };
  w.setTimeout = w.setInterval = w.requestAnimationFrame = () => 0;
  w.fetch = () => { throw new Error('Unexpected content-render network request'); };
  w.HTMLElement.prototype.scrollIntoView = function () {};
  const selectors = ['#heroSlides > *', '#productsGrid > *', '#voicesList > *', '#trial-reviews > *', '#timelineList > *', '#storyBody > *', '#ingredientsBody > *', '#qnaList > *', '#productDetailContent > *', '#newsContent > *', '#footerText > *'];
  const nodes = selectors.map(selector => [selector, d.querySelector(selector)]).filter(([, node]) => node);
  const heading = d.querySelector('h1')?.textContent;
  for (const script of [...d.scripts]) {
    if (script.type && script.type !== 'text/javascript') continue;
    if (script.src) {
      const name = new URL(script.src).pathname.slice(1);
      if (contentScripts.has(name) || name.startsWith('assets/generated/')) runInContext(read(name), dom.getInternalVMContext(), { filename: name, timeout: 5000 });
    } else runInContext(script.textContent, dom.getInternalVMContext(), { timeout: 5000 });
  }
  for (const [selector, node] of nodes) { assert.equal(d.querySelector(selector), node, `${locale}/${page}: ${selector} must survive runtime binding`); retained++; }
  assert.equal(d.querySelector('h1')?.textContent, heading, 'Runtime must preserve the generated heading');
  assert.deepEqual(errors, [], `${locale}/${page}: content scripts have no runtime errors`);
  assert.equal(d.querySelectorAll('video[src]').length, 0, 'Content rendering never starts video downloads');
  assert.equal(d.querySelectorAll('script[src*="site-chat-engine.js"],script[src*="site-help-data.js"],script[src*="site-company-knowledge.js"],script[src*="site-chat-ai.js"]:not([data-chat-assets])').length, 0, 'Closed chat does not load the full conversation engine');
  assert.equal(d.querySelectorAll('script[src*="site-help-loader.js"]').length, 1);
  assert.equal(d.querySelectorAll('script[src*="site-help-flow.js"]').length, 0, 'Closed guide does not load the selection controller');
  if (page === 'index') {
    for (const image of d.querySelectorAll('.home-product-image img')) { assert.equal(image.getAttribute('loading'), 'lazy'); assert.notEqual(image.getAttribute('fetchpriority'), 'high'); }
    const portrait = d.querySelector('img[src*="testimonial-no-juhyeong-"]');
    assert(portrait); assert.match(portrait.getAttribute('src'), /160\.webp$/); assert.match(portrait.getAttribute('srcset'), /320\.webp 320w/); assert.equal(portrait.getAttribute('sizes'), '128px');
    for (const image of d.querySelectorAll('.home-news-support img')) assert.match(image.getAttribute('src'), /-640\.webp$/);
    const product = d.querySelector('#productsGrid > *');
    dom.reconfigure({ url: `http://127.0.0.1/${locale}/?review_preview=1` });
    runInContext(read('home-experience.js'), dom.getInternalVMContext(), { timeout: 5000 });
    assert.equal(d.querySelector('#productsGrid > *'), product, 'Local review preview preserves the existing product layout');
    assert.equal(d.querySelectorAll('.home-sample-label').length, 6, 'Local design-only sample reviews still work');
  }
  if (page === 'news') for (const image of d.querySelectorAll('.news-archive-row img')) { assert.match(image.getAttribute('src'), /-640\.webp$/); assert.equal(image.getAttribute('loading'), 'lazy'); }
  for (const image of d.querySelectorAll('.news-photo-thumb img')) { assert.match(image.getAttribute('src'), /-640\.webp$/); assert.equal(image.getAttribute('loading'), 'lazy'); }
  dom.window.close(); documents++;
}
const original = statSync(new URL('assets/images/testimonial-no-juhyeong-upright-v2.png', root)).size;
for (const width of [160, 320]) assert(statSync(new URL(`assets/images/testimonial-no-juhyeong-${width}.webp`, root)).size < original / 100, 'Responsive portraits remain below 1% of the retained original');
for (const path of ['support.html', 'ko/support.html', 'es/support.html', 'en/support.html']) assert.match(read(path), /http-equiv="refresh"/i, 'Retired campaign pages preserve their redirects');
console.log(`Performance regression passed: ${documents} public pages, ${retained} retained content nodes, deferred chat, compact media, original assets and retired redirects.`);

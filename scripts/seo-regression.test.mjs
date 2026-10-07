import { loadNews } from './news-store.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
const languages = { ko: 'ko-KR', es: 'es-419', en: 'en' };
const newsData = (await loadNews(fileURLToPath(new URL('../', import.meta.url)))).data;
const pages = ['index', 'about', 'products', 'kpeno', 'para-carnes', 'qna', 'contact', 'news', ...newsData.stories.map(story => 'news-' + story.id)];
const urlFor = (lang, page) => `https://www.mokda.kr/${lang}/${page === 'index' ? '' : `${page}.html`}`;
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const robots = await readFile(new URL('robots.txt', root), 'utf8');
assert.match(robots, /^Sitemap: https:\/\/www\.mokda\.kr\/sitemap\.xml\s*$/m);
const listedUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(listedUrls.length, pages.length * Object.keys(languages).length);
assert.equal(new Set(listedUrls).size, listedUrls.length);
for (const lang of ['ko', 'es', 'en']) {
  for (const page of pages) {
    const html = await readFile(new URL(`${lang}/${page}.html`, root), 'utf8');
    const { window } = new JSDOM(html);
    const doc = window.document;
    const canonical = urlFor(lang, page);
    assert.equal(doc.documentElement.lang, languages[lang], `${lang}/${page}: html language`);
    assert.equal(doc.querySelector('link[rel="canonical"]')?.href, canonical, `${lang}/${page}: canonical`);
    assert.equal(doc.querySelector('meta[name="robots"]')?.content.includes('noindex'), false, `${lang}/${page}: unexpectedly noindex`);
    assert(doc.querySelector('meta[name="description"]')?.content.trim(), `${lang}/${page}: description`);
    assert(doc.title.trim(), `${lang}/${page}: title`);
    for (const [alternateLang, hreflang] of Object.entries(languages)) {
      assert.equal(doc.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)?.href, urlFor(alternateLang, page), `${lang}/${page}: ${hreflang} alternate`);
    }
    assert.equal(doc.querySelector('link[rel="alternate"][hreflang="x-default"]')?.href, urlFor('es', page));
    assert(listedUrls.includes(canonical), `${lang}/${page}: missing from sitemap`);
    assert.equal(doc.querySelectorAll('h1').length, 1);
    assert(doc.querySelector('h1').textContent.trim(), `${lang}/${page}: empty initial heading`);
    if (page === 'news') {
      // A concise archive needs crawlable stories rather than filler to reach a text quota.
      const cards = [...doc.querySelectorAll('[data-news-card]')];
      assert.equal(cards.length, newsData.stories.length, `${lang}/${page}: complete archive`);
      for (const story of newsData.stories) {
        const card = cards.find(card => card.dataset.newsCard === story.id);
        assert.equal(card?.querySelector('h3')?.textContent, story[{ko:'KR',es:'ES',en:'EN'}[lang]].title);
        assert.equal(card.querySelector('a').getAttribute('href'), `/${lang}/news-${story.id}.html`);
      }
    } else if (page.startsWith('news-')) {
      const story = newsData.stories.find(story => `news-${story.id}` === page);
      const content = story[{ko:'KR',es:'ES',en:'EN'}[lang]];
      assert.equal(doc.querySelector('h1').textContent, content.title);
      if (story.id === 'creators') {
        assert.equal(doc.querySelectorAll('[data-news-video]').length, newsData.creators.length, 'Crawlable video collection');
      } else {
        const paragraphs = [...doc.querySelectorAll('.news-article-body > p')].map(p => p.textContent);
        for (const [, body] of content.sections) assert(paragraphs.includes(body), `${lang}/${page}: factual article content`);
      }
    } else {
      assert(doc.querySelector('main').textContent.trim().length > (page === 'kpeno' || page === 'para-carnes' ? 200 : 300));
    }
    assert(doc.querySelector('#footerText a[href]'), 'Crawlable footer links');
    assert.equal(doc.querySelectorAll('[data-reveal-bound]').length, 0);
    for (const block of doc.querySelectorAll('script[type="application/ld+json"]')) JSON.parse(block.textContent);
    if (page === 'index') {
      assert.equal(doc.querySelectorAll('.home-lineup-lead').length, 1);
      assert.equal(doc.querySelectorAll('#productsGrid .product-photo-card').length, 2);
      assert.equal(doc.querySelectorAll('#voicesList blockquote').length, 2);
    }
    if (page === 'kpeno' || page === 'para-carnes') {
      assert.equal(doc.querySelectorAll('.detail-artwork img').length, 9, `${lang}/${page}: detail artwork missing`);
      assert(doc.querySelector('#productDetailContent h1')?.textContent.trim(), `${lang}/${page}: missing product heading`);
      assert(doc.querySelector('.detail-inquiry a[href*="contact.html"]'), `${lang}/${page}: missing inquiry CTA`);
      assert.equal(doc.querySelectorAll('[data-detail-section="07"]').length, 1, `${lang}/${page}: verified testimonial panel missing`);
      const pictures = [...doc.querySelectorAll('.detail-artwork img')];
      assert(pictures.every(img => img.width === 900 && img.height > 0), 'Detail images must reserve layout space');
      assert(pictures.slice(1).every(img => img.getAttribute('loading') === 'lazy'), 'Below-fold detail artwork must load on demand');
      const inquiry = new URL(doc.querySelector('.detail-inquiry a').getAttribute('href'), 'https://www.mokda.kr');
      assert.equal(inquiry.searchParams.get('product'), page === 'kpeno' ? 'original' : 'para-carnes', 'Inquiry must preserve the product accepted by the contact form');
    }
    if (page === 'qna') assert.equal(doc.querySelectorAll('#qnaList article').length, 5);
    if (page === 'about') {
      assert.equal(doc.querySelectorAll('#journeyHighlights article').length, 3, 'Three verified journey highlights');
      assert.equal(doc.querySelectorAll('#timelineList li').length, 8, 'Full factual history retained in initial HTML');
      assert(doc.querySelector('details.about-history-records summary')?.textContent.trim(), 'Accessible full-history control');
      assert.match(doc.querySelector('#timelineList').textContent, /2026\.08/);
      assert.match(doc.querySelector('#timelineList').textContent, /Expoalimentaria/);
      assert(doc.querySelector('#directionTitle')?.textContent.trim(), 'Food and cultural direction is rendered');
      assert(doc.querySelector('#products-transition a[href*="products.html"]'), 'Story continues to products');
    }
    if (page === 'contact') {
      assert.equal(doc.querySelector('#companyInput').required, false);
      assert.equal(doc.querySelector('#nameInput').required, true);
      assert(doc.querySelector('#countrySelect option[value="Peru"]'));
      assert(doc.querySelector('#messageLabel').textContent.trim());
    }
    window.close();
  }
}
console.log(`SEO regressions passed: ${pages.length * Object.keys(languages).length} complete localized documents, canonical/hreflang/sitemap consistency, content and crawlable links.`);

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const origin = 'https://www.mokda.kr';
const languages = { es: 'es-419', ko: 'ko-KR', en: 'en' };
const pages = ['index', 'about', 'products', 'kpeno', 'para-carnes', 'qna', 'contact'];
const urlFor = (lang, page) => `${origin}/${lang}/${page === 'index' ? '' : `${page}.html`}`;

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
  return response.text();
}

const [robots, sitemap] = await Promise.all([get(`${origin}/robots.txt`), get(`${origin}/sitemap.xml`)]);
assert.match(robots, /Sitemap: https:\/\/www\.mokda\.kr\/sitemap\.xml/);
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
assert.equal(listed.size, pages.length * Object.keys(languages).length, 'Sitemap must contain 21 unique URLs');

for (const page of pages) {
  await Promise.all(Object.entries(languages).map(async ([lang, code]) => {
    const url = urlFor(lang, page);
    assert(listed.has(url), `${url}: missing from sitemap`);
    const dom = new JSDOM(await get(url));
    try {
      const doc = dom.window.document;
      assert.equal(doc.documentElement.lang, code, `${url}: language`);
      assert.equal(doc.querySelector('link[rel="canonical"]')?.href, url, `${url}: canonical`);
      assert(!/noindex/i.test(doc.querySelector('meta[name="robots"]')?.content || ''), `${url}: noindex`);
      assert(doc.querySelector('meta[name="description"]')?.content.trim(), `${url}: description`);
      assert(doc.querySelector('h1')?.textContent.trim(), `${url}: H1`);
      for (const [other, hreflang] of Object.entries(languages)) {
        assert.equal(doc.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)?.href, urlFor(other, page), `${url}: ${hreflang}`);
      }
      assert.equal(doc.querySelector('link[rel="alternate"][hreflang="x-default"]')?.href, urlFor('es', page), `${url}: x-default`);
    } finally {
      dom.window.close();
    }
  }));
}
console.log('Live SEO audit passed: robots.txt, sitemap.xml and 21 HTTP 200 pages with coherent language, canonical, hreflang and HTML content.');

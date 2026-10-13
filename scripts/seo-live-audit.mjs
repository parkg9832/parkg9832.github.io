import { loadNews } from './news-store.mjs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const origin = 'https://www.mokda.kr';
const languages = {
  es: { html: 'es-419', hreflang: 'es' },
  ko: { html: 'ko-KR', hreflang: 'ko-KR' },
  en: { html: 'en', hreflang: 'en' },
};
const supportedSchemaTypes = new Set(['WebPage', 'AboutPage', 'CollectionPage', 'ContactPage', 'Article', 'NewsArticle', 'Organization', 'WebSite', 'BreadcrumbList']);
const newsData = (await loadNews(fileURLToPath(new URL('../', import.meta.url)))).data;
const pages = ['index', 'about', 'products', 'kpeno', 'para-carnes', 'qna', 'contact', 'news', ...newsData.stories.map(story => 'news-' + story.id)];
const urlFor = (lang, page) => `${origin}/${lang}/${page === 'index' ? '' : `${page}.html`}`;

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
  if (/^\/(es|ko|en)\//.test(new URL(url).pathname)) {
    assert(!/noindex|\bnone\b/i.test(response.headers.get('x-robots-tag') || ''), `${url}: response blocks indexing`);
  }
  return response.text();
}

const [robots, sitemap] = await Promise.all([get(`${origin}/robots.txt`), get(`${origin}/sitemap.xml`)]);
assert.match(robots, /Sitemap: https:\/\/www\.mokda\.kr\/sitemap\.xml/);
const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
assert.equal(listed.size, pages.length * Object.keys(languages).length, 'Sitemap must contain all localized URLs');

for (const page of pages) {
  await Promise.all(Object.entries(languages).map(async ([lang, config]) => {
    const url = urlFor(lang, page);
    assert(listed.has(url), `${url}: missing from sitemap`);
    const dom = new JSDOM(await get(url));
    try {
      const doc = dom.window.document;
      assert.equal(doc.documentElement.lang, config.html, `${url}: language`);
      assert.equal(doc.querySelector('link[rel="canonical"]')?.href, url, `${url}: canonical`);
      assert(!/noindex/i.test(doc.querySelector('meta[name="robots"]')?.content || ''), `${url}: noindex`);
      assert(doc.title.trim(), `${url}: title`);
      assert(doc.querySelector('meta[name="description"]')?.content.trim(), `${url}: description`);
      assert(doc.querySelector('h1')?.textContent.trim(), `${url}: H1`);
      for (const [other, { hreflang }] of Object.entries(languages)) {
        assert.equal(doc.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)?.href, urlFor(other, page), `${url}: ${hreflang}`);
      }
      assert.equal(doc.querySelectorAll('link[rel="alternate"][hreflang="es-419"]').length, 0, `${url}: unsupported Google hreflang`);
      assert.equal(doc.querySelector('link[rel="alternate"][hreflang="x-default"]')?.href, urlFor('es', page), `${url}: x-default`);
      const graph = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap(block => {
        const data = JSON.parse(block.textContent);
        return data['@graph'] || [data];
      });
      for (const node of graph) {
        for (const type of [].concat(node['@type'] || [])) {
          assert(supportedSchemaTypes.has(type), `${url}: unsupported Schema.org page type ${type}`);
        }
      }
      if (page === 'kpeno' || page === 'para-carnes') {
        const webPage = graph.find(node => node['@id'] === `${url}#webpage`);
        assert.equal(webPage?.['@type'], 'WebPage', `${url}: standard product detail page type`);
        assert.equal(webPage.inLanguage, config.html, `${url}: structured content language`);
      }
    } finally {
      dom.window.close();
    }
  }));
}
console.log(`Live SEO audit passed: robots.txt, sitemap.xml and ${pages.length * Object.keys(languages).length} HTTP 200 pages with coherent language, canonical, hreflang and HTML content.`);

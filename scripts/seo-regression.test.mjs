import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
for (const lang of ['ko', 'es', 'en']) {
  for (const page of ['index', 'about', 'products', 'kpeno', 'para-carnes', 'qna', 'contact']) {
    const html = await readFile(new URL(`${lang}/${page}.html`, root), 'utf8');
    const { window } = new JSDOM(html);
    const doc = window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1);
    assert(doc.querySelector('h1').textContent.trim(), `${lang}/${page}: empty initial heading`);
    assert(doc.querySelector('main').textContent.trim().length > (page === 'kpeno' || page === 'para-carnes' ? 200 : 300));
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
    }
    if (page === 'qna') assert.equal(doc.querySelectorAll('#qnaList article').length, 5);
    if (page === 'contact') {
      assert.equal(doc.querySelector('#companyInput').required, false);
      assert.equal(doc.querySelector('#nameInput').required, true);
      assert(doc.querySelector('#countrySelect option[value="Peru"]'));
      assert(doc.querySelector('#messageLabel').textContent.trim());
    }
    window.close();
  }
}
console.log('SEO regressions passed: 21 complete initial documents, real content, links, form options, no pre-bound animations.');

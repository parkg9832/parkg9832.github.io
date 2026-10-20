import { JSDOM } from 'jsdom';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runInContext } from 'node:vm';

// Build-only rendering of trusted repository content. No external resources,
// analytics, form submission, timers or motion scripts run during generation.
const renderScripts = new Set(['site-country-data.js', 'site-i18n.js', 'site-footer.js', 'b2b-config.js', 'site-contact-config.js', 'site-reviews-data.js', 'site-product-media.js', 'home-experience.js', 'product-detail.js', 'site-news-data.js', 'site-news-model.js', 'site-news.js']);

export async function prerenderContent(html, root, url) {
  const dom = new JSDOM(html, { url, runScripts: 'outside-only' });
  const { window } = dom;
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.setTimeout = window.setInterval = window.requestAnimationFrame = () => 0;
  window.fetch = () => { throw new Error('Network is forbidden during content generation'); };
  try {
    for (const script of [...window.document.scripts]) {
      if (script.type && script.type !== 'text/javascript') continue;
      if (script.src) {
        const name = new URL(script.src).pathname.slice(1);
        if (renderScripts.has(name)) runInContext(await readFile(join(root, name), 'utf8'), dom.getInternalVMContext(), { filename: name, timeout: 5000 });
      } else {
        runInContext(script.textContent, dom.getInternalVMContext(), { timeout: 5000 });
      }
    }
    window.MOKDA_I18N.localizeInternalLinks(window.MOKDA_I18N.getLanguage());
    const language = window.MOKDA_I18N.getLanguage();
    if (!['KR', 'ES', 'EN'].includes(language)) throw new Error('Invalid prerender language: ' + url);
    // Localize the small fallback menu without serializing runtime header state.
    const menuCopy = {
      KR: { 'about.html': '브랜드 소개', 'products.html': 'Salsa Coreana', 'qna.html': 'Q&A', 'contact.html': '문의' },
      ES: { 'about.html': 'Sobre MOKDA', 'products.html': 'Salsa Coreana', 'qna.html': 'Q&A', 'contact.html': 'Contacto' },
      EN: { 'about.html': 'About MOKDA', 'products.html': 'Salsa Coreana', 'qna.html': 'Q&A', 'contact.html': 'Contact' },
    }[language];
    for (const link of window.document.querySelectorAll('#mobile-menu a')) {
      const label = menuCopy[new URL(link.href).pathname.split('/').pop()];
      if (label) link.textContent = label;
    }
    // Keep animation binding in the browser; never serialize bound observer state.
    window.document.querySelectorAll('[data-reveal-bound]').forEach(e => e.removeAttribute('data-reveal-bound'));
    const body = window.document.body.innerHTML;
    if (!window.document.querySelector('h1')?.textContent.trim()) throw new Error('Prerendered H1 is empty: ' + url);
    // Preserve the original head, metadata, script bytes and CSP hash inputs.
    // Runtime scripts bind controls to this content instead of rebuilding it.
    return html.replace(/(<body\b[^>]*>)[\s\S]*?(<\/body>)/i, (_match, open, close) => open.replace(/>$/, ` data-content-language="${language}">`) + body + close);
  } finally {
    window.close();
  }
}

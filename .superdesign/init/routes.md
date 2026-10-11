# Repository UI context

Analyzed 2026-10-11 from the current working tree. Public production UI is static HTML plus shared vanilla-JavaScript widgets generated into /ko, /es and /en. Next.js/React files coexist but do not render the deployed static chatbot. Read canonical MOKDA_HARNESS.md and the nearest AGENTS.md before implementing.

## Authoritative routes

Generator: `scripts/generate-localized-pages.mjs`; news pages are added by `scripts/generate-news-sources.mjs` from `site-news-data.js`/`site-news-model.js`. These are generators, not a client router configuration. Root HTML is the editable source. All active localized pages include the shared messenger assets. Language mappings: ES→es/es-419, KR→ko/ko-KR, EN→en/en. Default public language is Spanish.

| URL variants | Editable source | Layout and purpose |
|---|---|---|
| `/es/about.html, /ko/about.html, /en/about.html` | `about.html` | Common static header/footer/chat. Founder story, ingredients, identity and history. |
| `/es/contact.html, /ko/contact.html, /en/contact.html` | `contact.html` | Common static header/footer/chat. B2B inquiry form and human consultation. |
| `/es/, /ko/, /en/` | `index.html` | Common static header/footer/chat. Homepage with photographic hero, two products, brand history, creators, news, FAQ and contact. |
| `/es/kpeno.html, /ko/kpeno.html, /en/kpeno.html` | `kpeno.html` | Common static header/footer/chat. K-PEÑO product details. |
| `/es/news-congreso.html, /ko/news-congreso.html, /en/news-congreso.html` | `news-congreso.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |
| `/es/news-creators.html, /ko/news-creators.html, /en/news-creators.html` | `news-creators.html` | Common static header/footer/chat. Creator collaboration videos. |
| `/es/news-expoalimentaria-2026.html, /ko/news-expoalimentaria-2026.html, /en/news-expoalimentaria-2026.html` | `news-expoalimentaria-2026.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |
| `/es/news-gimje-hint.html, /ko/news-gimje-hint.html, /en/news-gimje-hint.html` | `news-gimje-hint.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |
| `/es/news-gimje-youth-day.html, /ko/news-gimje-youth-day.html, /en/news-gimje-youth-day.html` | `news-gimje-youth-day.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |
| `/es/news-kotra-interview.html, /ko/news-kotra-interview.html, /en/news-kotra-interview.html` | `news-kotra-interview.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |
| `/es/news-kotra-lima.html, /ko/news-kotra-lima.html, /en/news-kotra-lima.html` | `news-kotra-lima.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |
| `/es/news-kpop-style.html, /ko/news-kpop-style.html, /en/news-kpop-style.html` | `news-kpop-style.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |
| `/es/news.html, /ko/news.html, /en/news.html` | `news.html` | Common static header/footer/chat. Compact newsroom archive. |
| `/es/para-carnes.html, /ko/para-carnes.html, /en/para-carnes.html` | `para-carnes.html` | Common static header/footer/chat. Para Carnes product details. |
| `/es/products.html, /ko/products.html, /en/products.html` | `products.html` | Common static header/footer/chat. K-PEÑO and Para Carnes comparison and detail links. |
| `/es/qna.html, /ko/qna.html, /en/qna.html` | `qna.html` | Common static header/footer/chat. Public product and partnership FAQ. |
| `/es/support.html, /ko/support.html, /en/support.html` | `support.html` | Common static header/footer/chat. News detail with cover, article and optional gallery. |

## Shared chatbot feature (route-independent)

Target ID suggestion: `shared-mokda-chat`. DOM mount: `#mokda-help`; dialog: `#mokda-help-dialog`. UI runtime: `site-help.js`; CSS: `styles/site-help.css`; knowledge: `site-help-data.js`; typed routing: `site-chat-intents.js`; handoff configuration: `site-contact-config.js`. Current widget is loaded after these prerequisite globals on all 48 active localized pages.

## Legacy routes

`support.html` and `coming-soon.html` are retired redirects. They are not targets for conversational UI redesign.

## Parallel Next.js route

`/about` → `app/about/page.tsx` → `app/layout.tsx`. This development route uses React components independently from the deployed static /es/about.html route.

## Runtime URL/language helpers (full source)

### `site-i18n.js`

```javascript
(() => {
  // Keep native scroll restoration, including reloads and links to a section.

  const STORAGE_KEY = 'mokdaLanguage';
  const LANGUAGES = ['ES', 'KR', 'EN'];
  const LANG_INDEX = { ES: 0, KR: 1, EN: 2 };
  const LANGUAGE_PATHS = { ES: 'es', KR: 'ko', EN: 'en' };
  const PATH_LANGUAGES = { es: 'ES', ko: 'KR', en: 'EN' };
  const LOCALIZED_PAGES = new Set(['index.html', 'about.html', 'products.html', 'kpeno.html', 'para-carnes.html', 'qna.html', 'contact.html', 'support.html', 'news.html', 'news-expoalimentaria-2026.html', 'news-kpop-style.html', 'news-kotra-lima.html', 'news-congreso.html', 'news-creators.html']);
  const ACTIVE_BUTTON_CLASS =
    'lang-btn relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black text-[#321506] transition-colors duration-300';
  const INACTIVE_BUTTON_CLASS =
    'lang-btn relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black text-neutral-600 hover:text-neutral-950 transition-colors duration-300';

  function normalizeLanguage(language) {
    return LANGUAGES.includes(language) ? language : 'ES';
  }

  function getLanguage() {
    const routeLanguage = PATH_LANGUAGES[window.location.pathname.split('/').filter(Boolean)[0]];
    if (routeLanguage) return normalizeLanguage(routeLanguage);
    try { return normalizeLanguage(localStorage.getItem(STORAGE_KEY) || 'ES'); }
    catch { return 'ES'; }
  }

  function setLanguage(language) {
    const normalized = normalizeLanguage(language);
    try { localStorage.setItem(STORAGE_KEY, normalized); } catch { /* Route remains authoritative when storage is unavailable. */ }
    return normalized;
  }

  function getHtmlLang(language) {
    const normalized = normalizeLanguage(language);
    if (normalized === 'KR') return 'ko-KR';
    if (normalized === 'ES') return 'es-419';
    return 'en';
  }

  function getCurrentPageName(pathname = window.location.pathname) {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments.at(-1) || 'index.html';
    return (LOCALIZED_PAGES.has(lastSegment) || /^news-[a-z0-9-]+\.html$/.test(lastSegment)) ? lastSegment : 'index.html';
  }

  function getLocalizedPath(language, pathname = window.location.pathname) {
    const normalized = normalizeLanguage(language);
    const languagePath = LANGUAGE_PATHS[normalized];
    const pageName = getCurrentPageName(pathname);
    return pageName === 'index.html' ? `/${languagePath}/` : `/${languagePath}/${pageName}`;
  }

  function localizeInternalLinks(language) {
    const normalized = normalizeLanguage(language);

    document.querySelectorAll('a[href]').forEach((link) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return;

      let url;
      try {
        url = new URL(rawHref, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      const pageName = getCurrentPageName(url.pathname);
      const linkedPage = url.pathname.split('/').filter(Boolean).at(-1) || 'index.html';
      const isLocalizedPage = LOCALIZED_PAGES.has(linkedPage) || /^news-[a-z0-9-]+\.html$/.test(linkedPage);
      const isHomePath = url.pathname === '/' || /^\/(es|ko|en)\/?$/.test(url.pathname);
      if (!isLocalizedPage && !isHomePath) return;

      const localizedPath = getLocalizedPath(normalized, pageName === 'index.html' ? '/' : `/${pageName}`);
      link.setAttribute('href', `${localizedPath}${url.search}${url.hash}`);
    });
  }

  function syncLanguageButtons(language) {
    const normalized = normalizeLanguage(language);
    const bg = document.getElementById('lang-bg');

    if (bg) {
      bg.style.transform = `translateX(${LANG_INDEX[normalized] * 100}%)`;
    }

    LANGUAGES.forEach((lang) => {
      const button = document.getElementById(`lang${lang}`);
      if (!button) return;

      const isActive = normalized === lang;
      button.textContent = lang;
      button.setAttribute('translate', 'no');
      button.className = isActive ? ACTIVE_BUTTON_CLASS : INACTIVE_BUTTON_CLASS;
      button.setAttribute('aria-pressed', String(isActive));
    });

    window.setTimeout(() => localizeInternalLinks(normalized), 0);
  }

  function bindLanguageButtons(onChange) {
    LANGUAGES.forEach((lang) => {
      const button = document.getElementById(`lang${lang}`);
      if (!button) return;

      button.addEventListener('click', () => {
        const nextLanguage = setLanguage(lang);
        const nextPath = `${getLocalizedPath(nextLanguage)}${window.location.search}${window.location.hash}`;
        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

        if (currentPath !== nextPath) {
          window.location.assign(nextPath);
          return;
        }

        onChange(nextLanguage);
      });
    });
  }

  localizeInternalLinks(getLanguage());

  window.MOKDA_I18N = {
    bindLanguageButtons,
    getHtmlLang,
    getLanguage,
    getLocalizedPath,
    localizeInternalLinks,
    setLanguage,
    syncLanguageButtons,
  };

  // The home renders its food and news sections after the initial HTML is read.
  // Align a fresh deep link after that layout settles; preserve reload/back history.
  const initialHash = window.location.hash;
  const navigationType = window.performance?.getEntriesByType?.('navigation')[0]?.type;
  if (initialHash && navigationType === 'navigate') {
    let readerMoved = false;
    const markReaderMoved = () => { readerMoved = true; };
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(name => window.addEventListener(name, markReaderMoved, { once: true, passive: true }));
    window.addEventListener('load', () => {
      window.requestAnimationFrame(() => {
        if (readerMoved || window.location.hash !== initialHash) return;
        let id;
        try { id = decodeURIComponent(initialHash.slice(1)); } catch { return; }
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    }, { once: true });
  }
})();
```

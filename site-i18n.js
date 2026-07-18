(() => {
  const STORAGE_KEY = 'mokdaLanguage';
  const LANGUAGES = ['ES', 'KR', 'EN'];
  const LANG_INDEX = { ES: 0, KR: 1, EN: 2 };
  const LANGUAGE_PATHS = { ES: 'es', KR: 'ko', EN: 'en' };
  const PATH_LANGUAGES = { es: 'ES', ko: 'KR', en: 'EN' };
  const LOCALIZED_PAGES = new Set(['index.html', 'about.html', 'products.html', 'qna.html', 'contact.html']);
  const ACTIVE_BUTTON_CLASS =
    'lang-btn relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black text-[#321506] transition-colors duration-300';
  const INACTIVE_BUTTON_CLASS =
    'lang-btn relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black text-neutral-600 hover:text-neutral-950 transition-colors duration-300';

  function normalizeLanguage(language) {
    return LANGUAGES.includes(language) ? language : 'ES';
  }

  function getLanguage() {
    const routeLanguage = PATH_LANGUAGES[window.location.pathname.split('/').filter(Boolean)[0]];
    return normalizeLanguage(routeLanguage || localStorage.getItem(STORAGE_KEY) || 'ES');
  }

  function setLanguage(language) {
    const normalized = normalizeLanguage(language);
    localStorage.setItem(STORAGE_KEY, normalized);
    return normalized;
  }

  function getHtmlLang(language) {
    const normalized = normalizeLanguage(language);
    if (normalized === 'KR') return 'ko';
    if (normalized === 'ES') return 'es';
    return 'en';
  }

  function getCurrentPageName(pathname = window.location.pathname) {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments.at(-1) || 'index.html';
    return LOCALIZED_PAGES.has(lastSegment) ? lastSegment : 'index.html';
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
      const isLocalizedPage = LOCALIZED_PAGES.has(url.pathname.split('/').filter(Boolean).at(-1) || 'index.html');
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
        const nextPath = getLocalizedPath(nextLanguage);
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
})();

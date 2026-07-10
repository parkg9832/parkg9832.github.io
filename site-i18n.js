(() => {
  const STORAGE_KEY = 'mokdaLanguage';
  const LANGUAGES = ['ES', 'KR', 'EN'];
  const LANG_INDEX = { ES: 0, KR: 1, EN: 2 };
  const ACTIVE_BUTTON_CLASS =
    'lang-btn relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black text-white transition-colors duration-300';
  const INACTIVE_BUTTON_CLASS =
    'lang-btn relative z-10 w-10 h-8 sm:w-12 sm:h-10 text-center text-xs sm:text-sm font-black text-neutral-500 hover:text-neutral-950 transition-colors duration-300';

  function normalizeLanguage(language) {
    return LANGUAGES.includes(language) ? language : 'ES';
  }

  function getLanguage() {
    return normalizeLanguage(localStorage.getItem(STORAGE_KEY) || 'ES');
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
  }

  function bindLanguageButtons(onChange) {
    LANGUAGES.forEach((lang) => {
      const button = document.getElementById(`lang${lang}`);
      if (!button) return;

      button.addEventListener('click', () => {
        const nextLanguage = setLanguage(lang);
        onChange(nextLanguage);
      });
    });
  }

  window.MOKDA_I18N = {
    bindLanguageButtons,
    getHtmlLang,
    getLanguage,
    setLanguage,
    syncLanguageButtons,
  };
})();

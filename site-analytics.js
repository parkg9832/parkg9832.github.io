(() => {
  'use strict';

  if (window.MOKDA_ANALYTICS) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  const allowedHosts = new Set(['mokda.kr', 'www.mokda.kr', 'parkg9832.github.io']);
  if (!allowedHosts.has(window.location.hostname)) return;

  // Public, write-only Apps Script web endpoint. No secret or API key is stored in the browser.
  const endpoint =
    'https://script.google.com/macros/s/AKfycbwGNHXFv2kU2lidTxpoTtNFYf1RPXph4NwU7swo83UqIyyxKcbyDJNtIUXH22Lho_qb/exec';
  const visitorStorageKey = 'mokda_analytics_visitor_v1';
  const sessionStorageKey = 'mokda_analytics_session_v1';
  const attributionStorageKey = 'mokda_analytics_attribution_v1';
  const sessionDurationMs = 30 * 60 * 1000;
  const queue = [];
  const tracked = new Set();
  let flushTimer = null;

  function randomId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Tracking still works for the current page when storage is unavailable.
    }
  }

  function getVisitorId() {
    const saved = readStorage(visitorStorageKey);
    if (saved) return saved;

    const created = randomId();
    writeStorage(visitorStorageKey, created);
    return created;
  }

  function getSession() {
    const now = Date.now();
    let saved = null;

    try {
      saved = JSON.parse(readStorage(sessionStorageKey) || 'null');
    } catch (error) {
      saved = null;
    }

    if (!saved || !saved.id || Number(saved.expiresAt) <= now) {
      saved = { id: randomId(), expiresAt: now + sessionDurationMs };
    } else {
      saved.expiresAt = now + sessionDurationMs;
    }

    writeStorage(sessionStorageKey, JSON.stringify(saved));
    return saved;
  }

  function getReferrerHost() {
    if (!document.referrer) return '';

    try {
      const referrerUrl = new URL(document.referrer);
      return referrerUrl.hostname === window.location.hostname ? '' : referrerUrl.hostname;
    } catch (error) {
      return '';
    }
  }

  function getAttribution(sessionId) {
    let saved = null;

    try {
      saved = JSON.parse(readStorage(attributionStorageKey) || 'null');
    } catch (error) {
      saved = null;
    }

    if (saved && saved.sessionId === sessionId) return saved;

    const params = new URLSearchParams(window.location.search);
    saved = {
      sessionId,
      referrerHost: getReferrerHost(),
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
    };
    writeStorage(attributionStorageKey, JSON.stringify(saved));
    return saved;
  }

  function getLanguage() {
    if (window.MOKDA_I18N && typeof window.MOKDA_I18N.getLanguage === 'function') {
      return String(window.MOKDA_I18N.getLanguage() || '').toUpperCase();
    }

    const htmlLanguage = String(document.documentElement.lang || '').toLowerCase();
    if (htmlLanguage.startsWith('ko')) return 'KR';
    if (htmlLanguage.startsWith('en')) return 'EN';
    return 'ES';
  }

  function getDevice() {
    const width = Math.max(window.innerWidth || 0, window.screen ? window.screen.width || 0 : 0);
    if (width < 768) return 'mobile';
    if (width < 1100) return 'tablet';
    return 'desktop';
  }

  function clean(value, maxLength = 150) {
    return String(value == null ? '' : value)
      .replace(/[\u0000-\u001F\u007F]/g, ' ')
      .trim()
      .slice(0, maxLength);
  }

  const visitorId = getVisitorId();
  const session = getSession();
  const attribution = getAttribution(session.id);

  function buildEvent(name, details = {}) {
    return {
      name: clean(name, 50),
      eventId: randomId(),
      pagePath: clean(`${window.location.pathname}${window.location.hash}`, 300),
      pageUrl: clean(window.location.href, 500),
      language: getLanguage(),
      device: getDevice(),
      referrerHost: clean(attribution.referrerHost, 150),
      utmSource: clean(attribution.utmSource, 100),
      utmMedium: clean(attribution.utmMedium, 100),
      utmCampaign: clean(attribution.utmCampaign, 150),
      element: clean(details.element, 150),
      product: clean(details.product, 80),
      scrollDepth: clean(details.scrollDepth, 20),
      browserLocale: clean(navigator.language, 30),
      timeZone: clean(Intl.DateTimeFormat().resolvedOptions().timeZone, 80),
    };
  }

  function flush() {
    if (flushTimer) {
      window.clearTimeout(flushTimer);
      flushTimer = null;
    }

    if (!queue.length) return;
    const events = queue.splice(0, 20);
    const body = JSON.stringify({
      type: 'analytics',
      visitorId,
      sessionId: session.id,
      events,
    });

    fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      keepalive: true,
    }).catch(() => {
      // Analytics must never interrupt the website experience.
    });
  }

  function scheduleFlush(immediate) {
    if (immediate) {
      flush();
      return;
    }

    if (flushTimer) return;
    flushTimer = window.setTimeout(flush, 900);
  }

  function track(name, details = {}, options = {}) {
    if (!name) return;
    queue.push(buildEvent(name, details));
    scheduleFlush(Boolean(options.immediate || queue.length >= 10));
  }

  function trackOnce(key, name, details = {}) {
    if (tracked.has(key)) return;
    tracked.add(key);
    track(name, details);
  }

  function inferProduct(element) {
    const productContainer = element.closest(
      '[data-product], .product-feature, article, [id*="original"], [id*="carne"], [id*="soy"]'
    );
    if (!productContainer) return '';

    const explicit = productContainer.getAttribute('data-product');
    if (explicit) return explicit;

    const heading = productContainer.querySelector('h2, h3');
    return heading ? clean(heading.textContent, 80) : '';
  }

  document.addEventListener(
    'click',
    (event) => {
      const element = event.target instanceof Element ? event.target.closest('a, button') : null;
      if (!element) return;

      const href = element instanceof HTMLAnchorElement ? element.getAttribute('href') || '' : '';
      const absoluteHref = element instanceof HTMLAnchorElement ? element.href || '' : '';
      const label =
        element.getAttribute('aria-label') || element.textContent || element.getAttribute('id') || element.tagName;

      if (element.classList.contains('lang-btn') || /^lang(?:ES|KR|EN)$/i.test(element.id || '')) {
        track('language_switch', { element: label }, { immediate: true });
        return;
      }

      if (/instagram\.com|tiktok\.com|threads\.(?:com|net)/i.test(absoluteHref)) {
        track('social_click', { element: label }, { immediate: true });
        return;
      }

      if (/contact\.html|#(?:contact|partnership|b2b)/i.test(href)) {
        track('contact_cta_click', { element: label }, { immediate: true });
        return;
      }

      if (/products?\.html|#products|coming-soon\.html/i.test(href)) {
        track(
          'product_cta_click',
          { element: label, product: inferProduct(element) },
          { immediate: true }
        );
      }
    },
    true
  );

  const form = document.querySelector('#contactForm, #b2bForm');
  if (form) {
    form.addEventListener(
      'focusin',
      () => trackOnce('form_start', 'form_start', { element: form.id || 'contact_form' }),
      { once: true }
    );
  }

  const productSection = document.querySelector('#products, [data-funnel="products"]');
  if (productSection && 'IntersectionObserver' in window) {
    const productObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        trackOnce('product_section_view', 'product_section_view', { element: 'products' });
        productObserver.disconnect();
      },
      { threshold: 0.35 }
    );
    productObserver.observe(productSection);
  }

  [50, 90].forEach((depth) => {
    const onScroll = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const percentage = Math.round((window.scrollY / scrollable) * 100);
      if (percentage < depth) return;

      window.removeEventListener('scroll', onScroll);
      trackOnce(`scroll_${depth}`, 'scroll_depth', { scrollDepth: `${depth}%` });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  window.addEventListener('pagehide', flush);
  window.MOKDA_ANALYTICS = { track, flush };

  track('page_view');
  if (/\/contact(?:\.html|\/)?$/i.test(window.location.pathname)) {
    track('contact_view', { element: 'contact_page' });
  }
})();

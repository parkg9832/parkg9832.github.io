(() => {
  'use strict';

  if (window.MOKDA_ANALYTICS) return;
  const queryParameters = new URLSearchParams(window.location.search);
  const debugMode = queryParameters.get('analytics_debug') === '1';
  const verificationMode = queryParameters.get('utm_medium') === 'verification';
  const internalOptOutKey = 'mokda_analytics_internal_opt_out_v1';
  const internalCommand = queryParameters.get('mokda_internal');
  window.MOKDA_ANALYTICS_STATUS = { loaded: true, enabled: false, reason: 'initializing' };

  function isInternalOptedOut() {
    try {
      return window.localStorage.getItem(internalOptOutKey) === '1';
    } catch (error) {
      return false;
    }
  }

  try {
    if (internalCommand === '1') window.localStorage.setItem(internalOptOutKey, '1');
    if (internalCommand === '0') window.localStorage.removeItem(internalOptOutKey);
  } catch (error) {
    // Continue with the current browser state when storage is unavailable.
  }

  if (internalCommand === '1' || internalCommand === '0') {
    queryParameters.delete('mokda_internal');
    const cleanQuery = queryParameters.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash}`,
    );
  }

  if (isInternalOptedOut()) {
    window.MOKDA_ANALYTICS_STATUS.reason = 'internal_visitor';
    return;
  }

  if (!debugMode && (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true)) {
    window.MOKDA_ANALYTICS_STATUS.reason = 'privacy_preference';
    return;
  }

  const allowedHosts = new Set(['mokda.kr', 'www.mokda.kr']);
  if (!allowedHosts.has(window.location.hostname)) {
    window.MOKDA_ANALYTICS_STATUS.reason = 'unsupported_host';
    return;
  }

  // Public, write-only Apps Script web endpoint. No secret or API key is stored in the browser.
  const endpoint =
    'https://script.google.com/macros/s/AKfycbwGNHXFv2kU2lidTxpoTtNFYf1RPXph4NwU7swo83UqIyyxKcbyDJNtIUXH22Lho_qb/exec';
  const visitorStorageKey = 'mokda_analytics_visitor_v1';
  const sessionStorageKey = 'mokda_analytics_session_v1';
  const attributionStorageKey = 'mokda_analytics_attribution_v1';
  const sessionEventStorageKey = 'mokda_analytics_session_events_v2';
  const debugEventStorageKey = 'mokda_analytics_debug_events_v2';
  const eventSchemaVersion = '2';
  const sessionDurationMs = 30 * 60 * 1000;
  const engagementHeartbeatMs = 15 * 1000;
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
      saved = { id: randomId(), startedAt: new Date(now).toISOString(), sequence: 0, expiresAt: now + sessionDurationMs };
    } else {
      if (!saved.startedAt) saved.startedAt = new Date(now).toISOString();
      if (!Number.isFinite(Number(saved.sequence))) saved.sequence = 0;
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

  function getVisitorDaypart() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
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
  const pageInstanceId = randomId();
  const debugEvents = [];
  let activeStartedAt = document.visibilityState === 'visible' ? performance.now() : null;
  let accumulatedActiveMs = 0;
  let lastReportedActiveSeconds = 0;

  function normalizeProduct(value) {
    const raw = clean(value, 80);
    const normalized = raw.toLowerCase().replace(/ñ/g, 'n');
    if (/k[-\s]?peno/.test(normalized)) return 'K-Peño';
    if (/para\s+carne|carne|ssam/.test(normalized)) return 'Para Carnes';
    return '제품 미지정';
  }

  function nextEventSequence() {
    session.sequence = Math.max(Number(session.sequence) || 0, 0) + 1;
    session.expiresAt = Date.now() + sessionDurationMs;
    writeStorage(sessionStorageKey, JSON.stringify(session));
    return session.sequence;
  }

  function buildEvent(name, details = {}) {
    const sectionName = clean(details.section_name || details.section, 80);
    const scrollPercent = Number.parseInt(details.scroll_percent ?? details.scrollDepth, 10);
    const productName = normalizeProduct(details.product_name || details.product);
    const visitorDaypart = getVisitorDaypart();
    return {
      name: clean(name, 50),
      eventId: randomId(),
      occurredAt: new Date().toISOString(),
      eventSequence: nextEventSequence(),
      eventSchemaVersion,
      pagePath: clean(`${window.location.pathname}${window.location.hash}`, 300),
      pageUrl: clean(window.location.href, 500),
      language: getLanguage(),
      device: getDevice(),
      referrerHost: clean(attribution.referrerHost, 150),
      utmSource: clean(attribution.utmSource, 100),
      utmMedium: verificationMode ? 'verification' : clean(attribution.utmMedium, 100),
      utmCampaign: clean(attribution.utmCampaign, 150),
      element: clean(details.element, 150),
      product: productName,
      product_name: productName,
      section: sectionName,
      section_name: sectionName,
      scrollDepth: Number.isFinite(scrollPercent) ? `${scrollPercent}%` : '',
      scroll_percent: Number.isFinite(scrollPercent) ? scrollPercent : '',
      browserLocale: clean(navigator.language, 30),
      timeZone: clean(Intl.DateTimeFormat().resolvedOptions().timeZone, 80),
      visitorDaypart,
      visitor_daypart: visitorDaypart,
      activeSeconds: details.activeSeconds == null ? '' : Math.max(0, Math.floor(details.activeSeconds)),
      pageInstanceId,
    };
  }

  function rememberDebugEvent(event) {
    if (!debugMode) return;
    debugEvents.push(event);
    console.info('[MOKDA analytics]', JSON.stringify({
      name: event.name,
      sequence: event.eventSequence,
      pagePath: event.pagePath,
      scroll_percent: event.scroll_percent,
      section_name: event.section_name,
      product_name: event.product_name,
    }));
    try {
      const previous = JSON.parse(window.localStorage.getItem(debugEventStorageKey) || '[]');
      const next = (Array.isArray(previous) ? previous : []).concat(event).slice(-200);
      window.localStorage.setItem(debugEventStorageKey, JSON.stringify(next));
    } catch (error) {
      // In-memory debug events remain available when storage is blocked.
    }
  }

  function sendToGa4(event) {
    if (typeof window.gtag !== 'function') return;
    if (event.name === 'page_view' || event.name === 'engagement_update') return;
    window.gtag('event', event.name, {
      section_name: event.section_name || undefined,
      scroll_percent: event.scroll_percent === '' ? undefined : event.scroll_percent,
      visitor_daypart: event.visitor_daypart,
      product_name: event.product_name,
      page_instance_id: event.pageInstanceId,
      event_schema_version: event.eventSchemaVersion,
    });
  }

  function flush() {
    if (flushTimer) {
      window.clearTimeout(flushTimer);
      flushTimer = null;
    }

    if (isInternalOptedOut()) {
      queue.length = 0;
      window.MOKDA_ANALYTICS_STATUS.enabled = false;
      window.MOKDA_ANALYTICS_STATUS.reason = 'internal_visitor';
      return;
    }

    if (!queue.length) return;
    const events = queue.splice(0, 20);
    const body = JSON.stringify({
      type: 'analytics',
      verification: verificationMode,
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
    if (!name || isInternalOptedOut()) return;
    const event = buildEvent(name, details);
    queue.push(event);
    rememberDebugEvent(event);
    sendToGa4(event);
    scheduleFlush(Boolean(options.immediate || queue.length >= 10));
  }

  function trackOnce(key, name, details = {}) {
    if (tracked.has(key)) return;
    tracked.add(key);
    track(name, details);
  }

  function trackOncePerSession(key, name, details = {}, options = {}) {
    let state = { sessionId: session.id, keys: [] };
    try {
      const saved = JSON.parse(readStorage(sessionEventStorageKey) || 'null');
      if (saved && saved.sessionId === session.id && Array.isArray(saved.keys)) state = saved;
    } catch (error) {
      // Fall back to a fresh session-scoped key list.
    }
    if (state.keys.indexOf(key) !== -1) return false;
    state.keys.push(key);
    writeStorage(sessionEventStorageKey, JSON.stringify(state));
    track(name, details, options);
    return true;
  }

  function captureActiveTime() {
    if (activeStartedAt == null) return;

    const now = performance.now();
    accumulatedActiveMs += Math.max(0, now - activeStartedAt);
    activeStartedAt = now;
  }

  function reportActiveTime(force) {
    captureActiveTime();
    const activeSeconds = Math.floor(accumulatedActiveMs / 1000);

    if (activeSeconds <= lastReportedActiveSeconds) return;
    if (!force && activeSeconds - lastReportedActiveSeconds < 10) return;

    lastReportedActiveSeconds = activeSeconds;
    track('engagement_update', { activeSeconds }, { immediate: true });
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

      const explicitEvent = clean(element.getAttribute('data-analytics-event'), 50);
      if (explicitEvent) {
        track(explicitEvent, { element: label, product: inferProduct(element) }, { immediate: true });
        return;
      }

      if (element.classList.contains('lang-btn') || /^lang(?:ES|KR|EN)$/i.test(element.id || '')) {
        track('language_switch', { element: label }, { immediate: true });
        return;
      }

      if (/instagram\.com|tiktok\.com|threads\.(?:com|net)/i.test(absoluteHref)) {
        track('social_click', { element: label }, { immediate: true });
        return;
      }

      if (/contact\.html|#(?:contact|partnership|b2b)/i.test(href)) {
        track('contact_cta_click', { element: label, product: inferProduct(element) }, { immediate: true });
        return;
      }

      if (/support\.html|#support/i.test(href)) {
        track('support_cta_click', { element: label, product: inferProduct(element) }, { immediate: true });
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
    const formStartEvent = form.id === 'b2bForm' ? 'b2b_form_start' : 'form_start';
    form.addEventListener(
      'input',
      (event) => {
        const field = event.target;
        if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
        if (!['name', 'company', 'email', 'whatsapp', 'message'].includes(field.name)) return;
        if (!String(field.value || '').trim()) return;
        trackOncePerSession(formStartEvent, formStartEvent, { element: form.id || 'contact_form' });
      }
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

  if ('IntersectionObserver' in window) {
    const sectionTimers = new Map();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = clean(entry.target.getAttribute('data-analytics-section'), 80);
          if (!section) return;
          const existingTimer = sectionTimers.get(entry.target);
          const viewportHeight = entry.rootBounds?.height || window.innerHeight || 0;
          const viewableHeight = Math.min(entry.boundingClientRect.height, viewportHeight);
          const visibleRatio = viewableHeight > 0 ? entry.intersectionRect.height / viewableHeight : 0;
          if (!entry.isIntersecting || visibleRatio < 0.5) {
            if (existingTimer) window.clearTimeout(existingTimer);
            sectionTimers.delete(entry.target);
            return;
          }
          if (existingTimer) return;
          const timer = window.setTimeout(() => {
            trackOnce(`section_${section}`, 'section_view', {
              element: section,
              section,
              section_name: section,
            });
            sectionTimers.delete(entry.target);
            sectionObserver.unobserve(entry.target);
          }, 1000);
          sectionTimers.set(entry.target, timer);
        });
      },
      { threshold: [0, 0.5, 1] }
    );
    document.querySelectorAll('[data-analytics-section]').forEach((element) => sectionObserver.observe(element));

    const detailObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const product = inferProduct(entry.target);
          if (product) trackOnce(`product_detail_${product}`, 'product_detail_view', { element: entry.target.id || 'product_detail', product });
          detailObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    document.querySelectorAll('.product-feature').forEach((element) => detailObserver.observe(element));
  }

  [25, 50, 75, 90].forEach((depth) => {
    const onScroll = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const percentage = Math.round((window.scrollY / scrollable) * 100);
      if (percentage < depth) return;

      window.removeEventListener('scroll', onScroll);
      trackOnce(`scroll_${depth}`, 'scroll_depth', { scrollDepth: `${depth}%`, scroll_percent: depth });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  window.setInterval(() => {
    if (document.visibilityState === 'visible') reportActiveTime(false);
  }, engagementHeartbeatMs);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      captureActiveTime();
      activeStartedAt = null;
      reportActiveTime(true);
      return;
    }

    if (activeStartedAt == null) activeStartedAt = performance.now();
  });

  window.addEventListener('pageshow', () => {
    if (document.visibilityState === 'visible' && activeStartedAt == null) {
      activeStartedAt = performance.now();
    }
  });

  window.addEventListener('pagehide', () => {
    reportActiveTime(true);
    flush();
  });
  window.MOKDA_ANALYTICS = {
    track,
    trackOncePerSession,
    flush,
    getDebugEvents() {
      if (!debugMode) return [];
      try {
        const stored = JSON.parse(readStorage(debugEventStorageKey) || '[]');
        return Array.isArray(stored) ? stored.slice() : debugEvents.slice();
      } catch (error) {
        return debugEvents.slice();
      }
    },
    clearDebugEvents() {
      if (!debugMode) return;
      debugEvents.splice(0, debugEvents.length);
      writeStorage(debugEventStorageKey, '[]');
    },
  };
  window.MOKDA_ANALYTICS_STATUS = { loaded: true, enabled: true, reason: 'active' };

  track('page_view');
  if (/\/contact(?:\.html|\/)?$/i.test(window.location.pathname)) {
    track('contact_page_view', { element: 'contact_page' });
  }
})();

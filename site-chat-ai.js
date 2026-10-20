(() => {
  const allowedIntents = new Set(['choose', 'pairings', 'spice', 'ingredients', 'storage', 'buy', 'pricing', 'export', 'horeca', 'brand', 'history', 'news', 'creators', 'collaboration', 'contact', 'unknown']);
  const companyTopics = new Set(['moq', 'samples', 'pricing', 'leadTime', 'packing', 'bulk', 'documents', 'certifications', 'namedCertifications', 'support', 'oem', 'exclusive', 'brand', 'specifications']);
  function endpoint() {
    try {
      const c = window.MOKDA_CHAT_AI, u = new URL(c?.endpoint || '');
      return c?.enabled === true && u.protocol === 'https:' && u.hostname.endsWith('.workers.dev') && u.pathname === '/chat' && !u.username && !u.password && !u.search && !u.hash ? u.href : null;
    } catch { return null; }
  }
  function interpretation(value) {
    if (!value || typeof value !== 'object') return {};
    const result = {};
    if (allowedIntents.has(value.intent)) result.intent = value.intent;
    if (companyTopics.has(value.companyTopic)) result.companyTopic = value.companyTopic;
    if (['B2C', 'B2B', 'b2c', 'b2b'].includes(value.audience)) result.audience = value.audience.toUpperCase();
    if (['kpeno', 'para_carnes', 'both'].includes(value.product)) result.product = value.product;
    if (['importer', 'distributor', 'retail', 'retailer', 'restaurant', 'horeca', 'online', 'other'].includes(value.businessType)) result.businessType = value.businessType === 'retailer' ? 'retail' : value.businessType === 'horeca' ? 'restaurant' : value.businessType;
    for (const key of ['country', 'quantity', 'food', 'heatPreference']) if (typeof value[key] === 'string') result[key] = value[key].replace(/[<>\x00-\x1f]/g, '').slice(0, key === 'quantity' ? 40 : 80);
    return result;
  }
  // Non-sensitive DOM diagnostics let operating checks distinguish verified
  // requests from local fallback without exposing tokens or conversation text.
  const status = value => document.getElementById('mokda-help')?.setAttribute('data-ai-status', String(value));
  async function answer({ messages, language, context, decision, signal }) {
    const url = endpoint(); if (!url) return Promise.resolve(null);
    status('verifying');
    let turnstileToken;
    try { turnstileToken = await window.MOKDA_TURNSTILE.token('mokda_chat', { signal, language }); }
    catch { status('verification_unavailable'); return null; }
    if (signal?.aborted) return null;
    const controller = new AbortController(), timer = window.setTimeout(() => controller.abort(), 12000);
    const abort = () => controller.abort(); signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
    const entities = Object.fromEntries(['audience', 'product', 'country', 'businessType', 'quantity', 'food', 'companyTopic'].filter(key => typeof context?.[key] === 'string').map(key => [key, context[key].slice(0, 80)]));
    if (['less_spicy', 'spicy'].includes(context?.heat_preference)) entities.heatPreference = context.heat_preference;
    if (entities.food === 'grilled_meat') entities.food = 'meat';
    if (entities.audience) entities.audience = entities.audience.toLowerCase();
    if (entities.country === 'Korea') entities.country = 'South Korea';
    if (entities.country === 'USA') entities.country = 'United States';
    if (entities.businessType === 'retail') entities.businessType = 'retailer';
    const payload = {
      turnstileToken,
      language: ['KR', 'ES', 'EN'].includes(language) ? language : 'ES',
      messages: messages.slice(-6).map(item => ({ role: item.role === 'user' ? 'user' : 'assistant', content: String(item.text).slice(0, 500) })),
      context: entities,
      decision: { intent: decision?.intent || 'unknown', stage: decision?.stage || '' },
    };
    return fetch(url, { method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal })
      .then(async response => {
        status(response.status);
        if (!response.ok) return null;
        const raw = await response.text(); if (raw.length > 7000) return null;
        const result = JSON.parse(raw);
        const text = typeof result.text === 'string' && result.text.length <= 1200 ? result.text.trim() : '';
        // Links and handoff controls are always rendered from verified local data.
        return { text: /https?:\/\/|www\.|<\/?(?:script|iframe)|wa\.me/i.test(text) ? '' : text, interpretation: interpretation(result.interpretation) };
      }).catch(() => { status('request_unavailable'); return null; }).finally(() => { window.clearTimeout(timer); signal?.removeEventListener('abort', abort); });
  }
  window.MOKDA_CHAT_AI_CLIENT = Object.freeze({ isEnabled: () => !!endpoint(), answer });
})();

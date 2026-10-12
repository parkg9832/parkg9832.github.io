(() => {
  const actions = new Set(['mokda_chat', 'mokda_inquiry']);
  let loading, active = false;
  function load() {
    if (window.turnstile?.render) return Promise.resolve(window.turnstile);
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      const timer = setTimeout(() => done(false), 12000);
      function done(ok) {
        clearTimeout(timer); script.onload = script.onerror = null;
        if (ok && window.turnstile?.render) resolve(window.turnstile);
        else { script.remove(); loading = null; reject(new Error('verification_unavailable')); }
      }
      script.onload = () => done(true); script.onerror = () => done(false);
      document.head.append(script);
    });
    return loading;
  }
  async function token(action, { signal, language = 'ES' } = {}) {
    const sitekey = window.MOKDA_BOT_PROTECTION?.sitekey;
    if (!actions.has(action) || typeof sitekey !== 'string' || !/^0x[a-zA-Z0-9_-]{20,80}$/.test(sitekey) || active || signal?.aborted) throw new Error('verification_unavailable');
    active = true;
    try {
      const api = await new Promise((resolve, reject) => {
        const abort = () => reject(new Error('verification_cancelled'));
        signal?.addEventListener('abort', abort, { once: true });
        load().then(resolve, reject).finally(() => signal?.removeEventListener('abort', abort));
      });
      if (signal?.aborted) throw new Error('verification_cancelled');
      return await new Promise((resolve, reject) => {
        const box = document.createElement('div');
        box.id = 'mokda-visitor-verification';
        // Mobile chat is a native modal dialog. Its children stay interactive in
        // the browser top layer; a body-level widget would be hidden and inert.
        const chat = action === 'mokda_chat' && document.getElementById('mokda-help-dialog');
        const parent = chat?.open ? chat : document.body;
        box.style.cssText = `position:${parent === chat ? 'absolute' : 'fixed'};z-index:10050;bottom:${parent === chat ? '110px' : '20px'};left:50%;transform:translateX(-50%);max-width:calc(100% - 24px);`;
        parent.append(box);
        let widget, ended = false;
        const timer = setTimeout(() => finish(null), 60000);
        const abort = () => finish(null);
        function finish(value) {
          if (ended) return;
          ended = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
          if (widget !== undefined) { try { api.remove(widget); } catch { /* Still settle and remove the local UI. */ } }
          box.remove();
          if (typeof value === 'string' && value.length > 0 && value.length <= 2048) resolve(value);
          else reject(new Error('verification_failed'));
        }
        signal?.addEventListener('abort', abort, { once: true });
        try {
          widget = api.render(box, {
            sitekey, action, language: { KR: 'ko', ES: 'es', EN: 'en' }[language] || 'auto',
            theme: 'light', size: window.innerWidth < 340 ? 'compact' : 'normal', appearance: 'interaction-only', 'response-field': false,
            callback: finish, 'error-callback': () => { finish(null); return true; },
            'expired-callback': () => finish(null), 'timeout-callback': () => finish(null),
          });
          // Test callbacks can settle synchronously; real callbacks are asynchronous.
          if (ended && widget !== undefined) { try { api.remove(widget); } catch { /* Local UI was already removed. */ } }
        } catch { finish(null); }
      });
    } finally { active = false; }
  }
  window.MOKDA_TURNSTILE = Object.freeze({ token });
})();

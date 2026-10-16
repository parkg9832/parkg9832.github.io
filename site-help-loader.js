(() => {
  if (document.getElementById('mokda-help')) return;
  const script = document.currentScript;
  const names = ['site-company-knowledge.js', 'site-help-data.js', 'site-chat-intents.js', 'site-chat-engine.js', 'site-chat-ai.js', 'site-help.js'];
  const globals = ['MOKDA_COMPANY_KNOWLEDGE', 'MOKDA_HELP_DATA', 'MOKDA_CHAT_INTENTS', 'MOKDA_CHAT_ENGINE', 'MOKDA_CHAT_AI_CLIENT', 'MOKDA_HELP_UI'];
  const members = ['answers', 'EN', 'match', 'reply', 'answer', 'open'];
  const hasAsset = index => !!window[globals[index]]?.[members[index]];
  const copy = {
    KR: { open: 'MOKDA 채팅 상담 열기', loading: '상담창 불러오는 중', retry: '상담창 다시 열기', failed: '상담창을 불러오지 못했습니다.', contact: '문의 페이지' },
    ES: { open: 'Abrir chat con MOKDA', loading: 'Cargando el chat', retry: 'Volver a abrir el chat', failed: 'No se pudo cargar el chat.', contact: 'Formulario de contacto' },
    EN: { open: 'Open MOKDA chat', loading: 'Loading chat', retry: 'Retry opening chat', failed: 'The chat could not be loaded.', contact: 'Contact form' },
  };
  const candidate = window.MOKDA_I18N?.getLanguage() || document.documentElement.dataset.routeLanguage;
  const lang = copy[candidate] ? candidate : 'ES', text = copy[lang];
  const contact = `/${{ KR: 'ko', ES: 'es', EN: 'en' }[lang]}/contact.html`;
  // Apply an inquiry carried to the contact form without loading the chat engine.
  try {
    const field = document.getElementById('messageInput');
    if (field) {
      const draft = sessionStorage.getItem('mokdaChatInquiryDraft');
      sessionStorage.removeItem('mokdaChatInquiryDraft');
      if (draft && !field.value) field.value = draft.slice(0, 1200);
    }
  } catch { /* The form remains available when storage is blocked. */ }
  let assets;
  try {
    assets = JSON.parse(script?.dataset.chatAssets || 'null');
    if (!Array.isArray(assets) || assets.length !== names.length) throw new Error('invalid_assets');
    assets = assets.map((value, index) => {
      const url = new URL(value, location.origin);
      if (url.origin !== location.origin || url.pathname !== `/${names[index]}` || !/^\?v=[a-f0-9]{12}$/.test(url.search) || url.hash) throw new Error('invalid_assets');
      return url.href;
    });
  } catch { assets = null; }
  const root = document.createElement('aside'); root.id = 'mokda-help';
  root.lang = { KR: 'ko-KR', ES: 'es-419', EN: 'en' }[lang];
  const launcher = document.createElement('button'); launcher.type = 'button'; launcher.className = 'help-launcher';
  launcher.setAttribute('aria-label', text.open); launcher.setAttribute('aria-haspopup', 'dialog'); launcher.setAttribute('aria-expanded', 'false');
  // Constant SVG; no visitor input is parsed as markup.
  launcher.innerHTML = '<span class="help-launcher-mark" aria-hidden="true"><svg viewBox="0 0 24 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M2 10v5M22 10v5"/><circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/><rect x="4" y="6" width="16" height="14" rx="4"/><circle cx="9" cy="11.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="11.5" r="1.2" fill="currentColor" stroke="none"/><path d="M9 16h6"/></svg></span>';
  const status = document.createElement('div'); status.className = 'help-load-status'; status.hidden = true; status.setAttribute('role', 'status');
  root.append(launcher, status); document.body.append(root);
  let loading = false;
  function loadAsset(index) {
    if (hasAsset(index)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const node = document.createElement('script'); node.src = assets[index]; node.async = false;
      const timer = window.setTimeout(() => fail(), 8000);
      const clean = () => { window.clearTimeout(timer); node.onload = node.onerror = null; };
      const fail = () => { clean(); node.remove(); reject(new Error('chat_load_failed')); };
      node.onload = () => { clean(); if (hasAsset(index)) resolve(); else fail(); };
      node.onerror = fail; document.head.append(node);
    });
  }
  async function open() {
    if (loading) return;
    loading = true; launcher.setAttribute('aria-busy', 'true'); launcher.setAttribute('aria-label', text.loading);
    status.replaceChildren(document.createTextNode(text.loading)); status.hidden = false;
    try {
      if (!assets) throw new Error('invalid_assets');
      for (let index = 0; index < assets.length; index++) {
        if (index === assets.length - 1) root.remove();
        await loadAsset(index);
      }
      window.MOKDA_HELP_UI.open();
    } catch {
      if (!root.isConnected && !document.getElementById('mokda-help')) document.body.append(root);
      status.replaceChildren(document.createTextNode(`${text.failed} `));
      const link = document.createElement('a'); link.href = contact; link.textContent = text.contact; status.append(link);
      launcher.setAttribute('aria-label', text.retry);
    } finally { loading = false; launcher.removeAttribute('aria-busy'); }
  }
  launcher.addEventListener('click', open);
  try {
    const saved = JSON.parse(sessionStorage.getItem('mokdaChatSessionV2') || 'null');
    const age = Date.now() - saved?.at;
    if (saved?.version === 2 && saved.open === true && age >= 0 && age < 4 * 60 * 60 * 1000 && Array.isArray(saved.transcript)) open();
  } catch { /* Corrupt or unavailable storage does not load the chat. */ }
})();

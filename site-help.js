(() => {
  if (!window.MOKDA_HELP_DATA || document.getElementById('mokda-help')) return;
  const copy = {
    KR: { launcher: 'MOKDA 채팅 상담 열기', close: '채팅 닫기', reset: '새 대화', subtitle: '상담 도우미', auto: '자동 안내', input: '궁금한 내용을 입력해주세요', send: '질문 보내기', whatsapp: 'WhatsApp으로 상담', contact: '문의 페이지', disclosure: '자동 안내 · 담당자 상담은 WhatsApp', processing: '자동 안내 준비 중', latest: '새 답변 보기', user: '나', bot: 'MOKDA 자동 안내', quick: ['소스 추천', '구매·수출 문의', '협업 제안'], ids: ['choose', 'export', 'collaboration'], more: ['보관 방법', '구매 문의'], moreIds: ['storage', 'buy'] },
    ES: { launcher: 'Abrir chat con MOKDA', close: 'Cerrar chat', reset: 'Nueva conversación', subtitle: 'Asistente de consultas', auto: 'Orientación automática', input: 'Escribe tu pregunta', send: 'Enviar pregunta', whatsapp: 'Hablar por WhatsApp', contact: 'Formulario de contacto', disclosure: 'Orientación automática · Equipo por WhatsApp', processing: 'Preparando la respuesta automática', latest: 'Ver nueva respuesta', user: 'Tú', bot: 'Asistente MOKDA', quick: ['Elegir una salsa', 'Compra y distribución', 'Colaborar'], ids: ['choose', 'export', 'collaboration'], more: ['Conservación', 'Dónde comprar'], moreIds: ['storage', 'buy'] },
    EN: { launcher: 'Open MOKDA chat', close: 'Close chat', reset: 'New conversation', subtitle: 'Customer support guide', auto: 'Automated guidance', input: 'Type your question', send: 'Send question', whatsapp: 'Chat on WhatsApp', contact: 'Contact form', disclosure: 'Automated guidance · Team on WhatsApp', processing: 'Preparing an automated reply', latest: 'View new reply', user: 'You', bot: 'MOKDA automated guide', quick: ['Choose a sauce', 'Buying and distribution', 'Partner with us'], ids: ['choose', 'export', 'collaboration'], more: ['Storage', 'Where to buy'], moreIds: ['storage', 'buy'] },
  };
  const candidate = window.MOKDA_I18N?.getLanguage() || document.documentElement.dataset.routeLanguage;
  const lang = copy[candidate] ? candidate : 'ES';
  const text = copy[lang], prefix = { KR: 'ko', ES: 'es', EN: 'en' }[lang];
  const KEY = 'mokdaChatSessionV2', DRAFT = 'mokdaChatInquiryDraft', TTL = 4 * 60 * 60 * 1000, MAX_MESSAGES = 24;
  const questions = window.MOKDA_HELP_DATA[lang].categories.flatMap(category => category.questions), engine = window.MOKDA_CHAT_ENGINE;
  const field = document.getElementById('messageInput');
  if (field) { try { const draft = sessionStorage.getItem(DRAFT); sessionStorage.removeItem(DRAFT); if (draft && !field.value) field.value = draft.slice(0, 1200); } catch { /* Form remains available. */ } }
  const icon = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const x = icon('<path d="m6 6 12 12M18 6 6 18"/>');
  const root = document.createElement('aside'); root.id = 'mokda-help'; root.lang = { KR: 'ko-KR', ES: 'es-419', EN: 'en' }[lang];
  root.innerHTML = `
    <button type="button" class="help-launcher" aria-haspopup="dialog" aria-controls="mokda-help-dialog" aria-expanded="false">${icon('<path d="M21 11.5a8 8 0 0 1-8 8H6l-3 2v-10a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z"/><path d="M8 10h8M8 14h5"/>')}</button>
    <dialog id="mokda-help-dialog" class="help-dialog" aria-labelledby="mokda-help-title" aria-modal="false">
      <div class="help-header"><div class="help-brand-frame"><img class="help-brand" src="/assets/images/mokda-logo-main.webp" width="44" height="44" alt="" /></div><div class="help-heading"><h2 id="mokda-help-title">MOKDA</h2><p></p></div><button type="button" class="help-reset">${icon('<path d="M3 11a9 9 0 1 1 2.4 7M3 4v7h7"/>')}</button><button type="button" class="help-close">${x}</button></div>
      <div class="help-content"><p class="help-auto-label"></p><div class="help-conversation" role="log" aria-live="polite" aria-relevant="additions" aria-atomic="false"></div><div class="help-processing" role="status" hidden><span class="help-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="help-sr"></span></div><div class="help-options"></div></div>
      <button type="button" class="help-latest" hidden></button>
      <div class="help-footer"><a class="help-contact"><span class="help-whatsapp-icon">${icon('<path d="M21 11.5a9 9 0 0 1-13.4 8L3 21l1.5-4.6A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-2 3 3 8 6 8l2-2-3-2-1 1-2-2 1-1-2-3-1 1Z"/>')}</span><span class="help-contact-text"></span><span aria-hidden="true">↗</span></a><form class="help-composer"><textarea rows="1" maxlength="500" autocomplete="off"></textarea><button type="submit">${icon('<path d="m5 12 7-7 7 7M12 5v15"/>')}</button></form><p class="help-disclosure"></p><a class="help-form-link"></a></div>
    </dialog>`;
  document.body.appendChild(root);
  const find = selector => root.querySelector(selector);
  const launcher = find('.help-launcher'), dialog = find('dialog'), content = find('.help-content'), conversation = find('.help-conversation'), options = find('.help-options');
  const input = find('textarea'), send = find('[type="submit"]'), closeButton = find('.help-close'), resetButton = find('.help-reset'), handoff = find('.help-contact');
  const processing = find('.help-processing'), latest = find('.help-latest'), formLink = find('.help-form-link');
  launcher.setAttribute('aria-label', text.launcher); closeButton.setAttribute('aria-label', text.close); resetButton.setAttribute('aria-label', text.reset); resetButton.title = text.reset;
  find('.help-heading p').textContent = text.subtitle; find('.help-auto-label').textContent = text.auto; input.placeholder = text.input;
  input.setAttribute('aria-label', text.input); send.setAttribute('aria-label', text.send); find('.help-disclosure').textContent = text.disclosure;
  find('.help-sr').textContent = text.processing; latest.textContent = `${text.latest} ↓`; formLink.textContent = text.contact;
  let transcript = [], context = {}, timer = null, pending = null, epoch = 0, following = true, closing = false, modal = false;
  let previousOverflow = '', scrollY = 0, restoredOpen = false;
  const compact = () => window.innerWidth <= 600 || (window.innerWidth <= 900 && window.innerHeight <= 500);
  const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function internalPath(path) { return /^[a-z0-9-]+\.html(?:[?#][a-zA-Z0-9_=&%#-]*)?$/.test(path || '') ? `/${prefix}/${path}` : `/${prefix}/contact.html`; }
  function persist() { try { sessionStorage.setItem(KEY, JSON.stringify({ version: 2, at: Date.now(), transcript, context, draft: input.value.slice(0, 500), open: dialog.open && !closing })); } catch { /* Private browsing still supports this page's chat. */ } }
  function handoffSummary() { return engine?.summary(context, context.language || lang) || `${context.lastQuestion || 'MOKDA'}`; }
  function updateHandoff() {
    const number = String(window.MOKDA_CONTACT?.whatsappNumber || '').trim().replace(/[+\s().-]/g, ''), valid = /^[1-9]\d{7,14}$/.test(number);
    const path = `contact.html${context.purpose === 'collaboration' ? '?purpose=collaboration' : ['export', 'horeca', 'pricing'].includes(context.purpose) ? '?purpose=distribution' : ''}`;
    formLink.href = internalPath(path); find('.help-contact-text').textContent = valid ? text.whatsapp : text.contact;
    find('.help-whatsapp-icon').hidden = !valid; handoff.href = valid ? `https://wa.me/${number}?text=${encodeURIComponent(handoffSummary())}` : internalPath(path);
    if (valid) { handoff.target = '_blank'; handoff.rel = 'noopener noreferrer'; } else { handoff.removeAttribute('target'); handoff.removeAttribute('rel'); }
  }
  function element(tag, className, value) { const node = document.createElement(tag); node.className = className || ''; if (value) node.textContent = value; return node; }
  function renderMessage(item, animate = true) {
    const bubble = element('div', `help-message help-message-${item.role}${animate ? ' help-arriving' : ''}`);
    bubble.setAttribute('aria-label', item.role === 'user' ? text.user : text.bot); bubble.appendChild(element('p', '', item.text));
    (item.sources || []).slice(0, 2).forEach(link => { const a = element('a', 'help-detail-link', `${link.label} ↗`); a.href = internalPath(link.path); a.addEventListener('click', foldForNavigation); bubble.appendChild(a); });
    conversation.appendChild(bubble); while (conversation.children.length > MAX_MESSAGES) conversation.firstElementChild.remove();
  }
  function add(role, value, sources = []) { const item = { role, text: String(value).slice(0, 2000), sources }; transcript.push(item); transcript = transcript.slice(-MAX_MESSAGES); renderMessage(item); persist(); }
  function scrollBottom() { content.scrollTop = content.scrollHeight; following = true; latest.hidden = true; }
  function showOptions(result) {
    options.replaceChildren(); if (result?.handoff) return;
    const ids = result ? text.moreIds : text.ids, names = result ? text.more : text.quick;
    ids.forEach((id, index) => { const q = questions.find(item => item.id === id); if (!q) return;
      const button = element('button', 'help-choice', names[index]); button.type = 'button'; button.addEventListener('click', () => submit(q.question)); options.appendChild(button);
    });
  }
  function cancelPending() { epoch++; if (timer !== null) window.clearTimeout(timer); timer = null; pending = null; processing.hidden = true; send.disabled = !input.value.trim(); }
  function complete() {
    if (!pending) return;
    const result = pending; pending = null; timer = null; processing.hidden = true; context = result.context || context;
    add('bot', result.text, result.sources); showOptions(result); updateHandoff(); send.disabled = !input.value.trim();
    if (following) scrollBottom(); else latest.hidden = false; persist();
  }
  function submit(value) {
    const question = value.trim().slice(0, 500); if (!question || pending) return;
    following = true; add('user', question); options.replaceChildren();
    const fallback = questions.find(item => item.id === window.MOKDA_CHAT_INTENTS?.match(question, lang));
    pending = engine?.reply(question, { language: lang, context }) || { text: fallback?.answer || questions.find(item => item.id === 'contact').answer, context: { lastQuestion: question, language: lang }, sources: fallback?.link ? [fallback.link] : [], handoff: true };
    context = pending.context || context; updateHandoff();
    input.value = ''; send.disabled = true; processing.hidden = false; scrollBottom(); const turn = epoch;
    timer = window.setTimeout(() => { if (turn === epoch) complete(); }, reduced() ? 0 : 280); persist();
  }
  function restart() { cancelPending(); context = {}; transcript = []; input.value = ''; conversation.replaceChildren(); add('bot', engine?.greeting(lang) || questions[0].answer); showOptions(); updateHandoff(); scrollBottom(); persist(); }
  function viewport() {
    root.classList.toggle('help-mobile', compact()); if (compact() && dialog.open) {
      const v = window.visualViewport;
      dialog.style.setProperty('--help-view-height', `${v?.height || window.innerHeight}px`); dialog.style.setProperty('--help-view-top', `${v?.offsetTop || 0}px`);
      dialog.style.setProperty('--help-view-left', `${v?.offsetLeft || 0}px`); dialog.style.setProperty('--help-view-width', `${v?.width || window.innerWidth}px`);
    }
  }
  function lockPage() { previousOverflow = document.body.style.overflow; scrollY = window.scrollY; document.body.style.overflow = 'hidden'; }
  function unlockPage() { if (modal) { document.body.style.overflow = previousOverflow; window.scrollTo(0, scrollY); } modal = false; }
  function open() {
    if (dialog.open) return; if (typeof dialog.show !== 'function') { window.location.assign(internalPath('contact.html')); return; }
    closing = false; viewport(); modal = compact() && typeof dialog.showModal === 'function';
    if (modal) { lockPage(); dialog.showModal(); } else dialog.show();
    dialog.setAttribute('aria-modal', String(modal)); root.classList.add('help-open'); launcher.setAttribute('aria-expanded', 'true'); launcher.setAttribute('aria-label', text.close);
    viewport(); closeButton.focus({ preventScroll: true }); scrollBottom(); persist();
  }
  function close() {
    if (!dialog.open || closing) return; closing = true; root.classList.add('help-closing'); persist();
    const finish = () => { if (dialog.open) dialog.close(); }; if (reduced()) finish(); else window.setTimeout(finish, 160);
  }
  find('form').addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
  input.addEventListener('input', () => { send.disabled = !!pending || !input.value.trim(); persist(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.isComposing || event.keyCode === 229)) { event.preventDefault(); return; }
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(input.value); }
  });
  content.addEventListener('scroll', () => { following = content.scrollHeight - content.scrollTop - content.clientHeight < 50; if (following) latest.hidden = true; });
  latest.addEventListener('click', scrollBottom);
  const saveDraft = () => { try { sessionStorage.setItem(DRAFT, handoffSummary()); } catch { /* Link remains available. */ } };
  function foldForNavigation(event) { if (event?.ctrlKey || event?.metaKey || event?.shiftKey) return; closing = true; persist(); }
  handoff.addEventListener('click', event => { if (!handoff.target) { saveDraft(); foldForNavigation(event); } });
  formLink.addEventListener('click', event => { saveDraft(); foldForNavigation(event); });
  resetButton.addEventListener('click', () => { restart(); closeButton.focus({ preventScroll: true }); });
  launcher.addEventListener('click', () => dialog.open ? close() : open()); closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => { unlockPage(); closing = false; root.classList.remove('help-open', 'help-closing'); launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-label', text.launcher); launcher.focus({ preventScroll: true }); persist(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && dialog.open && root.contains(document.activeElement)) { event.preventDefault(); close(); } });
  window.addEventListener('resize', () => { viewport(); const needsModal = compact() && typeof dialog.showModal === 'function'; if (dialog.open && needsModal !== modal && !closing) { dialog.addEventListener('close', open, { once: true }); dialog.close(); } });
  window.visualViewport?.addEventListener('resize', viewport); window.visualViewport?.addEventListener('scroll', viewport);
  window.addEventListener('pagehide', () => { if (timer !== null) window.clearTimeout(timer); complete(); persist(); unlockPage(); });
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved?.version === 2 && Date.now() - saved.at < TTL && saved.at <= Date.now() && Array.isArray(saved.transcript)) {
      transcript = saved.transcript.slice(-MAX_MESSAGES).filter(item => ['user', 'bot'].includes(item?.role) && typeof item.text === 'string').map(item => ({ role: item.role, text: item.text.slice(0, 2000), sources: Array.isArray(item.sources) ? item.sources.filter(link => typeof link?.label === 'string' && typeof link?.path === 'string').slice(0, 2) : [] }));
      context = engine?.reply('', { language: lang, context: saved.context }).context || {}; context.language = lang;
      context.lastQuestion = typeof saved.context?.lastQuestion === 'string' ? saved.context.lastQuestion.slice(0, 500) : '';
      input.value = typeof saved.draft === 'string' ? saved.draft.slice(0, 500) : ''; restoredOpen = saved.open === true;
    }
  } catch { /* Corrupt or unavailable storage starts a clean conversation. */ }
  if (transcript.length) { transcript.forEach(item => renderMessage(item, false)); showOptions(transcript.length > 1 ? { handoff: !!context.purpose } : undefined); updateHandoff(); } else restart();
  send.disabled = !input.value.trim(); viewport(); if (restoredOpen) open();
})();

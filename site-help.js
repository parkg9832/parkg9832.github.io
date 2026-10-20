(() => {
  if (!window.MOKDA_HELP_DATA || document.getElementById('mokda-help')) return;
  const copy = {
    KR: { launcher: 'MOKDA 채팅 상담 열기', close: '채팅 닫기', reset: '새 대화', subtitle: '먹다 상담 도우미', auto: '자동 안내', input: '궁금한 내용을 입력해주세요', send: '질문 보내기', whatsapp: 'WhatsApp으로 상담', contact: '문의 페이지', disclosure: '자동 안내 · 담당자 상담은 WhatsApp', processing: '자동 안내 준비 중', latest: '새 답변 보기', user: '나', bot: '먹랑이 자동 안내', quick: ['소스 추천', '구매·수출 문의', '협업 제안'], ids: ['choose', 'export', 'collaboration'], more: ['보관 방법', '구매 문의'], moreIds: ['storage', 'buy'] },
    ES: { launcher: 'Abrir chat con MOKDA', close: 'Cerrar chat', reset: 'Nueva conversación', subtitle: 'Asistente de MOKDA', auto: 'Orientación automática', input: 'Escribe tu pregunta', send: 'Enviar pregunta', whatsapp: 'Hablar por WhatsApp', contact: 'Formulario de contacto', disclosure: 'Orientación automática · Equipo por WhatsApp', processing: 'Preparando la respuesta automática', latest: 'Ver nueva respuesta', user: 'Tú', bot: 'Guía automática de MOK-LANG', quick: ['Elegir una salsa', 'Compra y distribución', 'Colaborar'], ids: ['choose', 'export', 'collaboration'], more: ['Conservación', 'Dónde comprar'], moreIds: ['storage', 'buy'] },
    EN: { launcher: 'Open MOKDA chat', close: 'Close chat', reset: 'New conversation', subtitle: 'MOKDA assistant', auto: 'Automated guidance', input: 'Type your question', send: 'Send question', whatsapp: 'Chat on WhatsApp', contact: 'Contact form', disclosure: 'Automated guidance · Team on WhatsApp', processing: 'Preparing an automated reply', latest: 'View new reply', user: 'You', bot: 'MOK-LANG automated guide', quick: ['Choose a sauce', 'Buying and distribution', 'Partner with us'], ids: ['choose', 'export', 'collaboration'], more: ['Storage', 'Where to buy'], moreIds: ['storage', 'buy'] },
  };
  const businessCopy = {
    KR: { country: '사업 운영 국가', type: '사업 유형', choose: '선택해주세요', next: '다음', other: '다른 국가는 메시지로 알려주세요.', roles: [['수입사','수입사입니다'],['유통사','유통사입니다'],['매장','매장 사업을 운영합니다'],['레스토랑·HORECA','레스토랑 사업을 운영합니다'],['기타 사업','기타 사업입니다']], languageNote: '이전 대화는 그대로 보관하고, 지금부터 한국어로 안내합니다.' },
    ES: { country: 'País de tu negocio', type: 'Tipo de negocio', choose: 'Selecciona', next: 'Continuar', other: 'También puedes escribir otro país en el mensaje.', roles: [['Importadora','Somos una importadora'],['Distribuidora','Somos una distribuidora'],['Tienda','Tengo una tienda'],['Restaurante / HORECA','Tengo un restaurante'],['Otro negocio','Otro negocio']], languageNote: 'Conservamos la conversación anterior. A partir de ahora te atenderemos en español.' },
    EN: { country: 'Country of business', type: 'Business type', choose: 'Select', next: 'Continue', other: 'You can also type another country in your message.', roles: [['Importer','We are an importer'],['Distributor','We are a distributor'],['Shop','I run a shop'],['Restaurant / HORECA','I run a restaurant'],['Other business','Other business']], languageNote: 'Your earlier messages are saved. We’ll continue in English.' },
  };
  const countryCodes = { Peru:'PE', Mexico:'MX', Chile:'CL', Colombia:'CO', Argentina:'AR', Korea:'KR', USA:'US', Brazil:'BR', Ecuador:'EC', Bolivia:'BO', Uruguay:'UY', Paraguay:'PY', Panama:'PA', 'Costa Rica':'CR', Guatemala:'GT', Venezuela:'VE', 'Dominican Republic':'DO', 'El Salvador':'SV', Honduras:'HN', Nicaragua:'NI', Cuba:'CU', 'Puerto Rico':'PR', Spain:'ES', Canada:'CA', Germany:'DE', Japan:'JP', UK:'GB' };
  function pageProduct() {
    const raw = document.body.dataset.productDetail || ({original:'kpeno','para-carnes':'para-carnes',both:'both'}[new URLSearchParams(location.search).get('product')]);
    return raw === 'kpeno' ? 'kpeno' : raw === 'para-carnes' ? 'para_carnes' : raw === 'both' ? 'both' : '';
  }
  const candidate = window.MOKDA_I18N?.getLanguage() || document.documentElement.dataset.routeLanguage;
  const lang = copy[candidate] ? candidate : 'ES';
  const text = copy[lang], prefix = { KR: 'ko', ES: 'es', EN: 'en' }[lang];
  const KEY = 'mokdaChatSessionV2', DRAFT = 'mokdaChatInquiryDraft', TTL = 4 * 60 * 60 * 1000, MAX_MESSAGES = 24;
  const legacyGreetings = new Set([
    '안녕하세요! MOKDA 마스코트 먹랑이입니다. 좋은 하루 보내고 계신가요? 무엇을 도와드릴까요?',
    '¡Hola! Soy MOK-LANG, la mascota de MOKDA. ¿Cómo va tu día? ¿En qué te puedo ayudar?',
    'Hi! I’m MOK-LANG, the MOKDA mascot. How’s your day going? How can I help you?',
    '안녕하세요! 어떤 소스가 궁금하세요? 제품을 살펴보거나 구매·사업 문의를 이어갈 수 있어요.',
    '¡Hola! ¿Qué te gustaría saber de nuestras salsas? Podemos ayudarte con los productos, las compras y las consultas comerciales.',
    'Hi! What would you like to know about our sauces? We can help with products, buying and business inquiries.',
  ]);
  const questions = window.MOKDA_HELP_DATA[lang].categories.flatMap(category => category.questions), engine = window.MOKDA_CHAT_ENGINE, ai = window.MOKDA_CHAT_AI_CLIENT;
  const guidance = { KR: '제품·구매·협업 자동 안내', ES: 'Guía de salsas, compras y colaboración', EN: 'Sauce, buying and partnership guidance' };
  const aiDisclosure = { KR: 'AI 자동 안내 · 대화 내용을 AI가 처리합니다', ES: 'Guía con IA · La IA procesa esta conversación', EN: 'AI guidance · This conversation is processed by AI' };
  const field = document.getElementById('messageInput');
  if (field) { try { const draft = sessionStorage.getItem(DRAFT); sessionStorage.removeItem(DRAFT); if (draft && !field.value) field.value = draft.slice(0, 1200); } catch { /* Form remains available. */ } }
  const icon = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const x = icon('<path d="m6 6 12 12M18 6 6 18"/>');
  const launcherMark = '<span class="help-launcher-mark" aria-hidden="true"><svg viewBox="0 0 24 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M2 10v5M22 10v5"/><circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/><rect x="4" y="6" width="16" height="14" rx="4"/><circle cx="9" cy="11.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="11.5" r="1.2" fill="currentColor" stroke="none"/><path d="M9 16h6"/></svg></span>';
  const root = document.createElement('aside'); root.id = 'mokda-help'; root.lang = { KR: 'ko-KR', ES: 'es-419', EN: 'en' }[lang];
  root.innerHTML = `
    <button type="button" class="help-launcher" aria-haspopup="dialog" aria-controls="mokda-help-dialog" aria-expanded="false">${launcherMark}</button>
    <dialog id="mokda-help-dialog" class="help-dialog" aria-labelledby="mokda-help-title" aria-modal="false">
      <div class="help-header"><div class="help-brand-frame"><img class="help-brand" src="/assets/images/meokrangi-chat-avatar-20261013.webp" width="44" height="44" alt="" /></div><div class="help-heading"><h2 id="mokda-help-title">MOK-LANG</h2><p></p></div><button type="button" class="help-reset">${icon('<path d="M3 11a9 9 0 1 1 2.4 7M3 4v7h7"/>')}</button><button type="button" class="help-close">${x}</button></div>
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
  input.setAttribute('aria-label', text.input); send.setAttribute('aria-label', text.send); find('.help-disclosure').textContent = ai?.isEnabled() ? aiDisclosure[lang] : guidance[lang];
  find('.help-sr').textContent = text.processing; latest.textContent = `${text.latest} ↓`; formLink.textContent = text.contact;
  let transcript = [], context = pageProduct() ? { product: pageProduct(), productOrigin: 'page' } : {}, timer = null, pending = null, epoch = 0, following = true, closing = false, modal = false, request = null, ready = true, delayDone = false;
  let greetingNeeded = true, greetingTimer = null, queuedQuestion = null;
  let previousOverflow = '', scrollY = 0, restoredOpen = false, changedLanguage = false;
  const compact = () => window.innerWidth <= 600 || (window.innerWidth <= 900 && window.innerHeight <= 500);
  const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function internalPath(path) { return /^[a-z0-9-]+\.html(?:[?#][a-zA-Z0-9_=&%#-]*)?$/.test(path || '') ? `/${prefix}/${path}` : `/${prefix}/contact.html`; }
  function persist() { try { sessionStorage.setItem(KEY, JSON.stringify({ version: 2, language: lang, at: Date.now(), transcript, context, draft: input.value.slice(0, 500), open: dialog.open && !closing })); } catch { /* Private browsing still supports this page's chat. */ } }
  function trackChat(name, result) {
    const value = result?.context || context;
    window.MOKDA_ANALYTICS?.track(name, { section: 'chat', element: ['choose','pairings','ingredients','storage','pricing','export','horeca','buy','brand','history','news','collaboration','contact','human','issue'].includes(result?.decision?.intent || value.topic) ? (result?.decision?.intent || value.topic) : 'initial', product: engine?.productName(value.product), audience: value.audience, funnel_stage: result?.decision?.stage || value.funnelStage || 'greeting', market: value.country });
  }
  function handoffSummary() { return engine?.summary(context, context.language || lang) || `${context.lastQuestion || 'MOKDA'}`; }
  function updateHandoff() {
    root.dataset.product = engine?.productName(context.product) || '';
    root.dataset.audience = context.audience || ''; root.dataset.market = context.country || ''; root.dataset.funnelStage = context.funnelStage || '';
    const eligible = context.handoffEligible === true && !pending && !greetingNeeded;
    handoff.hidden = !eligible; formLink.hidden = !eligible; root.classList.toggle('help-handoff', eligible);
    const number = String(window.MOKDA_CONTACT?.whatsappNumber || '').trim().replace(/[+\s().-]/g, ''), valid = /^[1-9]\d{7,14}$/.test(number);
    const path = `contact.html${context.purpose === 'collaboration' ? '?purpose=collaboration' : ['export', 'horeca', 'pricing'].includes(context.purpose) ? '?purpose=distribution' : ''}`;
    const productQuery = context.product === 'kpeno' ? 'original' : context.product === 'para_carnes' ? 'para-carnes' : context.product === 'both' ? 'both' : '';
    formLink.href = internalPath(path + (productQuery ? (path.includes('?') ? '&' : '?') + 'product=' + productQuery : '')); find('.help-contact-text').textContent = valid ? text.whatsapp : text.contact;
    find('.help-whatsapp-icon').hidden = !valid; handoff.href = valid ? `https://wa.me/${number}?text=${encodeURIComponent(handoffSummary())}` : internalPath(path);
    if (valid) { handoff.target = '_blank'; handoff.rel = 'noopener noreferrer'; } else { handoff.removeAttribute('target'); handoff.removeAttribute('rel'); }
  }
  function element(tag, className, value) { const node = document.createElement(tag); node.className = className || ''; if (value) node.textContent = value; return node; }
  function renderMessage(item, animate = true) {
    const bubble = element('div', `help-message help-message-${item.role}${animate ? ' help-arriving' : ''}`);
    bubble.setAttribute('aria-label', item.role === 'user' ? text.user : text.bot); bubble.appendChild(element('p', '', item.text));
    (item.sources || []).slice(0, 2).forEach(link => {
      const a = element('a', 'help-detail-link', `${link.label} ↗`);
      if (link.url === 'https://www.instagram.com/mokda_official/') { a.href = link.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      else { a.href = internalPath(link.path); a.addEventListener('click', foldForNavigation); }
      bubble.appendChild(a);
    });
    conversation.appendChild(bubble); while (conversation.children.length > MAX_MESSAGES) conversation.firstElementChild.remove();
  }
  function add(role, value, sources = []) { const item = { role, text: String(value).slice(0, 2000), sources }; transcript.push(item); transcript = transcript.slice(-MAX_MESSAGES); renderMessage(item); persist(); }
  function scrollBottom() { content.scrollTop = content.scrollHeight; following = true; latest.hidden = true; }
  function showBusinessFields(result) {
    const labels = businessCopy[lang], form = element('form', 'help-business-form');
    const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames([{KR:'ko',ES:'es',EN:'en'}[lang]], {type:'region'}) : null;
    const addSelect = (label, name, entries, selected) => {
      const wrapper = element('label', 'help-business-field'); wrapper.append(element('span', '', label));
      const select = element('select'); select.name = name; select.required = true;
      const blank = element('option', '', labels.choose); blank.value = ''; blank.disabled = true; select.append(blank);
      entries.forEach(([value, title]) => { const option = element('option', '', title); option.value = value; select.append(option); });
      select.value = selected || ''; wrapper.append(select); form.append(wrapper); return select;
    };
    const country = addSelect(labels.country, 'businessCountry', Object.entries(countryCodes).map(([name, code]) => [name, regionNames?.of(code) || name]), context.country);
    const roles = labels.roles, roleKeys = ['importer','distributor','retail','restaurant','other'];
    const type = addSelect(labels.type, 'businessType', roles.map(([label], i) => [roleKeys[i], label]), context.businessType);
    const next = element('button', 'help-choice', labels.next); next.type = 'submit'; next.disabled = !country.value || !type.value;
    const ready = () => { next.disabled = !country.value || !type.value; }; country.addEventListener('change', ready); type.addEventListener('change', ready);
    form.append(next, element('p', 'help-business-hint', labels.other));
    form.addEventListener('submit', event => { event.preventDefault(); if (!form.reportValidity() || next.disabled) return; const index = roleKeys.indexOf(type.value); if (index < 0 || !countryCodes[country.value]) return; submit(roles[index][1] + '. ' + country.value, false, false, 'business_details'); });
    options.append(form);
  }
  function showOptions(result) {
    options.replaceChildren();
    if (result?.decision?.stage === 'business_context' || result?.context?.funnelStage === 'business_context') { showBusinessFields(result); return; }
    if (!result && engine?.initialReplies) result = { quickReplies: engine.initialReplies(lang) };
    if (Array.isArray(result?.quickReplies)) {
      result.quickReplies.slice(0, 3).forEach(item => { if (typeof item?.label !== 'string' || typeof item?.question !== 'string') return;
        const button = element('button', 'help-choice', item.label.slice(0, 60)); button.type = 'button'; button.addEventListener('click', () => submit(item.question, false, false, 'quick_reply')); options.appendChild(button);
      }); return;
    }
    const ids = result ? text.moreIds : text.ids, names = result ? text.more : text.quick;
    ids.forEach((id, index) => { const q = questions.find(item => item.id === id); if (!q) return;
      const button = element('button', 'help-choice', names[index]); button.type = 'button'; button.addEventListener('click', () => submit(q.question, false, false, 'quick_reply')); options.appendChild(button);
    });
  }
  function cancelPending() { epoch++; if (timer !== null) window.clearTimeout(timer); request?.abort(); request = null; timer = null; pending = null; processing.hidden = true; ready = true; delayDone = false; send.disabled = !input.value.trim(); }
  function cancelGreeting() { if (greetingTimer !== null) window.clearTimeout(greetingTimer); greetingTimer = null; queuedQuestion = null; if (!pending) processing.hidden = true; send.disabled = !!pending || !input.value.trim(); }
  function startGreeting() {
    if (!greetingNeeded || greetingTimer !== null || !dialog.open || closing) return;
    processing.hidden = false; options.replaceChildren(); updateHandoff();
    greetingTimer = window.setTimeout(() => {
      greetingTimer = null; if (!dialog.open || closing || !greetingNeeded) return;
      greetingNeeded = false; processing.hidden = true;
      add('bot', engine?.greeting(lang) || questions[0].answer); showOptions(); updateHandoff(); scrollBottom();
      const queued = queuedQuestion; queuedQuestion = null;
      if (queued) submit(queued.question, queued.useAI, input.value.trim().slice(0, 500) !== queued.question, queued.source);
      else send.disabled = !input.value.trim();
    }, 1000);
  }
  function complete() {
    if (!pending) return;
    const result = pending; pending = null; timer = null; request = null; processing.hidden = true; context = result.context || context;
    add('bot', result.text, result.sources);
    if (result.handoff && result.decision?.reason === 'qualified_business') window.MOKDA_ANALYTICS?.trackOncePerSession('chat_qualified:' + [context.product,context.country,context.businessType].join(':'), 'chat_qualified', {section:'chat', element:'business', product:engine?.productName(context.product), audience:'B2B', funnel_stage:'qualified', market:context.country});
    showOptions(result); updateHandoff(); send.disabled = !input.value.trim();
    if (following) scrollBottom(); else latest.hidden = false; persist();
  }
  function submit(value, useAI = true, preserveDraft = false, source = 'typed') {
    const question = value.trim().slice(0, 500); if (!question || pending) return;
    // Keep the welcome first even when a visitor sends a question during preparation.
    if (greetingNeeded) { if (queuedQuestion) return; queuedQuestion = { question, useAI, source }; send.disabled = true; if (!dialog.open) open(); else startGreeting(); return; }
    following = true; add('user', question); options.replaceChildren();
    const fallback = questions.find(item => item.id === window.MOKDA_CHAT_INTENTS?.match(question, lang));
    const previous = { ...context };
    pending = engine?.reply(question, { language: lang, context: previous }) || { text: fallback?.answer || questions.find(item => item.id === 'choose').answer, context: { lastQuestion: question, language: lang, handoffEligible: false }, sources: fallback?.link ? [fallback.link] : [], handoff: false };
    context = pending.context || context; if (source !== 'typed') trackChat('chat_intent_select', pending); updateHandoff();
    if (!preserveDraft) input.value = ''; send.disabled = true; processing.hidden = false; scrollBottom(); const turn = epoch;
    ready = true; delayDone = false;
    // Brief automated preparation, never a claim that a human is typing.
    const delay = 1400 + Math.min(500, Math.round(pending.text.length * 1.2));
    timer = window.setTimeout(() => { delayDone = true; if (turn === epoch && ready) complete(); }, delay);
    if (useAI && ai?.isEnabled() && !['greeting', 'send_status', 'automated_status', 'out_of_scope', 'explicit_human', 'product_issue', 'document_request', 'specific_certification_review'].includes(pending.decision?.reason)) {
      ready = false; request = new AbortController();
      ai.answer({ messages: transcript, language: context.language || lang, context: previous, decision: { ...pending.decision, intent: pending.intent }, signal: request.signal }).then(result => {
        if (turn !== epoch || !pending) return;
        if (result) {
          const decided = engine.reply(question, { language: lang, context: previous, interpretation: result.interpretation });
          if (decided.aiTextAllowed && result.text) decided.text = result.text;
          pending = decided; context = decided.context; updateHandoff();
        }
        ready = true; if (delayDone) complete();
      }).catch(() => { if (turn === epoch && pending) { ready = true; if (delayDone) complete(); } });
    }
    persist();
  }
  function restart() { cancelPending(); cancelGreeting(); greetingNeeded = true; context = pageProduct() ? {product:pageProduct(), productOrigin:'page'} : {}; transcript = []; input.value = ''; send.disabled = true; conversation.replaceChildren(); options.replaceChildren(); updateHandoff(); scrollBottom(); persist(); if (dialog.open) startGreeting(); }
  function viewport() {
    root.classList.toggle('help-mobile', compact()); if (compact() && dialog.open) {
      const v = window.visualViewport;
      dialog.style.setProperty('--help-view-height', `${v?.height || window.innerHeight}px`); dialog.style.setProperty('--help-view-top', `${v?.offsetTop || 0}px`);
      dialog.style.setProperty('--help-view-left', `${v?.offsetLeft || 0}px`); dialog.style.setProperty('--help-view-width', `${v?.width || window.innerWidth}px`);
    }
  }
  function lockPage() { previousOverflow = document.body.style.overflow; scrollY = window.scrollY; document.body.style.overflow = 'hidden'; }
  function unlockPage() { if (modal) { document.body.style.overflow = previousOverflow; window.scrollTo(0, scrollY); } modal = false; }
  function open(requestOptions) {
    if (requestOptions?.intent === 'business') {
      cancelPending();
      const product = ['kpeno','para_carnes','both'].includes(requestOptions.product) ? requestOptions.product : pageProduct();
      if (product) { context.product = product; context.productOrigin = 'page'; }
      context.audience = 'B2B'; context.handoffEligible = false;
      if (!dialog.open) open();
      submit(engine?.initialReplies(lang)?.[2]?.question || questions.find(item => item.id === 'export').question, false, false, 'business_entry'); return;
    }
    if (dialog.open) return; if (typeof dialog.show !== 'function') { window.location.assign(internalPath('contact.html')); return; }
    if (!requestOptions?.restored) trackChat('chat_open');
    closing = false; viewport(); modal = compact() && typeof dialog.showModal === 'function';
    if (modal) { lockPage(); dialog.showModal(); } else dialog.show();
    dialog.setAttribute('aria-modal', String(modal)); root.classList.add('help-open'); launcher.setAttribute('aria-expanded', 'true'); launcher.setAttribute('aria-label', text.close);
    viewport(); closeButton.focus({ preventScroll: true }); startGreeting(); scrollBottom(); persist();
  }
  function close() {
    if (!dialog.open || closing) return; closing = true; cancelGreeting(); root.classList.add('help-closing'); persist();
    const finish = () => { if (dialog.open) dialog.close(); }; if (reduced()) finish(); else window.setTimeout(finish, 160);
  }
  find('.help-composer').addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
  input.addEventListener('input', () => { send.disabled = !!pending || !!queuedQuestion || !input.value.trim(); persist(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.isComposing || event.keyCode === 229)) { event.preventDefault(); return; }
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(input.value); }
  });
  content.addEventListener('scroll', () => { following = content.scrollHeight - content.scrollTop - content.clientHeight < 50; if (following) latest.hidden = true; });
  latest.addEventListener('click', scrollBottom);
  const saveDraft = () => { try { sessionStorage.setItem(DRAFT, handoffSummary()); sessionStorage.setItem('mokdaChatInquiryContext', JSON.stringify({version:1,at:Date.now(),product:context.product,country:context.country,businessType:context.businessType,purpose:context.purpose})); } catch { /* Link remains available. */ } };
  function foldForNavigation(event) { if (event?.ctrlKey || event?.metaKey || event?.shiftKey) return; closing = true; persist(); }
  handoff.addEventListener('click', event => { if (!handoff.target) { saveDraft(); foldForNavigation(event); } });
  formLink.addEventListener('click', event => { saveDraft(); foldForNavigation(event); });
  resetButton.addEventListener('click', () => { restart(); closeButton.focus({ preventScroll: true }); });
  launcher.addEventListener('click', () => dialog.open ? close() : open()); closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => { cancelGreeting(); unlockPage(); closing = false; root.classList.remove('help-open', 'help-closing'); launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-label', text.launcher); launcher.focus({ preventScroll: true }); persist(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && dialog.open && root.contains(document.activeElement)) { event.preventDefault(); close(); } });
  window.addEventListener('resize', () => { viewport(); const needsModal = compact() && typeof dialog.showModal === 'function'; if (dialog.open && needsModal !== modal && !closing) { dialog.addEventListener('close', open, { once: true }); dialog.close(); } });
  window.visualViewport?.addEventListener('resize', viewport); window.visualViewport?.addEventListener('scroll', viewport);
  window.addEventListener('pagehide', () => { cancelGreeting(); if (timer !== null) window.clearTimeout(timer); request?.abort(); complete(); epoch++; persist(); unlockPage(); });
  window.addEventListener('pageshow', () => { if (dialog.open && greetingNeeded) startGreeting(); });
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved?.version === 2 && Date.now() - saved.at < TTL && saved.at <= Date.now() && Array.isArray(saved.transcript)) {
      transcript = saved.transcript.slice(-MAX_MESSAGES).filter(item => ['user', 'bot'].includes(item?.role) && typeof item.text === 'string').map(item => ({ role: item.role, text: item.text.slice(0, 2000), sources: Array.isArray(item.sources) ? item.sources.filter(link => typeof link?.label === 'string' && (typeof link?.path === 'string' || link?.url === 'https://www.instagram.com/mokda_official/')).slice(0, 2) : [] }));
      // Refresh only an untouched old welcome; keep actual conversations and drafts.
      if (saved.transcript.length === 1 && transcript.length === 1 && transcript[0].role === 'bot' && legacyGreetings.has(transcript[0].text)) transcript = [];
      changedLanguage = (saved.language || saved.context?.language) && (saved.language || saved.context?.language) !== lang;
      if (changedLanguage && transcript.length === 1 && transcript[0].role === 'bot' && ['KR','ES','EN'].some(value => engine?.greeting(value) === transcript[0].text)) transcript[0].text = engine.greeting(lang);
      context = engine?.reply('', { language: lang, context: saved.context }).context || {}; context.language = lang;
      if (pageProduct() && (!context.product || context.productOrigin === 'page')) { context.product = pageProduct(); context.productOrigin = 'page'; }
      context.lastQuestion = typeof saved.context?.lastQuestion === 'string' ? saved.context.lastQuestion.slice(0, 500) : '';
      input.value = typeof saved.draft === 'string' ? saved.draft.slice(0, 500) : ''; restoredOpen = saved.open === true;
    }
  } catch { /* Corrupt or unavailable storage starts a clean conversation. */ }
  if (transcript.length) { greetingNeeded = false; transcript.forEach(item => renderMessage(item, false)); if (changedLanguage && transcript.length > 1) conversation.append(element('p','help-language-note',businessCopy[lang].languageNote)); showOptions(transcript.length > 1 ? engine?.reply('', { language: lang, context }) : undefined); updateHandoff(); }
  else { options.replaceChildren(); updateHandoff(); persist(); }
  send.disabled = !input.value.trim(); viewport(); if (restoredOpen) open({restored:true});
  window.MOKDA_HELP_UI = { open };
  document.addEventListener('click', event => { const link = event.target.closest?.('a[data-chat-intent="business"]'); if (!link || event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); const product = {'K-PEÑO':'kpeno','Para Carnes':'para_carnes'}[link.dataset.product]; open({intent:'business',product}); });
})();

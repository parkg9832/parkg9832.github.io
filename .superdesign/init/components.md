# Repository UI context

Analyzed 2026-10-11 from the current working tree. Public production UI is static HTML plus shared vanilla-JavaScript widgets generated into /ko, /es and /en. Next.js/React files coexist but do not render the deployed static chatbot. Read canonical MOKDA_HARNESS.md and the nearest AGENTS.md before implementing.

## Current target: shared MOKDA messenger

The user explicitly asks for an advanced, natural conversational chatbot and designer-quality desktop/mobile UI, references inspected visually, animations, and verified commit/deployment. For this widget only, the user allows a neutral charcoal/white/slate visual system instead of the orange/cream brand palette. Preserve the existing website and the authentic MOKDA logo. Desktop target: approximately 400 × 650 px rounded floating messenger. Mobile target: full-screen app-style chat with a stable composer above the software keyboard. Distinguish automated responses from a human team; no fabricated online/typing-human status. Existing product/availability facts and the single official WhatsApp configuration stay authoritative.

## Framework and primitives

- Production: custom DOM components and native dialog; no installed shadcn/Radix/MUI/component package.
- Package manifest: Next.js 16.2.6, React 19.2.6, Tailwind 3.4.4, lucide-react 1.16.0; jsdom 30.0.1 provides isolated regression fixtures.
- Public styles use generated Tailwind plus role-specific CSS. Shared widget components are created in one script rather than imported React files.

## MokdaMessenger

Source: `site-help.js`. Mounts the circular launcher, header/logo, message log, reply choices, WhatsApp handoff, reset and composer on all active public pages. Runtime inputs: `MOKDA_HELP_DATA`, `MOKDA_CHAT_INTENTS`, `MOKDA_I18N`, `MOKDA_CONTACT`. Component state is local to the closure. This is the audited current baseline, not the final design.

### `site-help.js`

```javascript
(() => {
  if (!window.MOKDA_HELP_DATA || document.getElementById('mokda-help')) return;
  const copy = {
    KR: {
      launcher: 'MOKDA 채팅 상담 열기', close: '채팅 닫기', reset: '새 대화',
      subtitle: '제품·구매·협업 상담', auto: '자동 응답',
      greeting: '안녕하세요, MOKDA입니다. 소스부터 구매·협업까지 무엇이 궁금하세요?',
      thanks: '네, 궁금한 점이 더 있으면 편하게 물어보세요.',
      select: '궁금한 내용을 골라주세요. 아래에 직접 질문하셔도 됩니다.',
      fallback: '아직 이 질문에 맞는 답변을 준비하지 못했습니다. MOKDA 제품이나 구매·협업 문의라면 아래 버튼으로 담당자에게 남겨주세요.',
      input: '궁금한 내용을 입력해주세요', send: '질문 보내기',
      contact: '담당자에게 문의하기', whatsapp: 'WhatsApp으로 상담', other: '다른 질문',
      topics: ['소스와 활용법', '구매·유통·수출', '브랜드와 소식', '협업 제안'],
      quick: { choose: '소스 추천', buy: '구매처', export: '유통 상담' },
      message: '안녕하세요, MOKDA. 다음 내용으로 문의합니다:',
    },
    ES: {
      launcher: 'Abrir chat con MOKDA', close: 'Cerrar chat', reset: 'Nueva conversación',
      subtitle: 'Salsas, compras y colaboraciones', auto: 'Respuestas automáticas',
      greeting: '¡Hola! Somos MOKDA. ¿Qué te gustaría saber sobre nuestras salsas, compras o colaboraciones?',
      thanks: '¡Con gusto! Si tienes otra pregunta, aquí estamos.',
      select: 'Elige una pregunta o escríbenos abajo.',
      fallback: 'Por ahora no tenemos una respuesta preparada para esa pregunta. Si es sobre MOKDA, nuestras salsas, compras o colaboraciones, puedes contactar al equipo con el botón de abajo.',
      input: 'Escribe tu pregunta', send: 'Enviar pregunta',
      contact: 'Contactar al equipo', whatsapp: 'Hablar por WhatsApp', other: 'Otra pregunta',
      topics: ['Salsas y usos', 'Compra y distribución', 'Sobre MOKDA', 'Colaboraciones'],
      quick: { choose: 'Elegir una salsa', buy: 'Dónde comprar', export: 'Distribución' },
      message: 'Hola, MOKDA. Quisiera consultar sobre:',
    },
    EN: {
      launcher: 'Open MOKDA chat', close: 'Close chat', reset: 'New conversation',
      subtitle: 'Sauces, buying and partnerships', auto: 'Automated answers',
      greeting: 'Hello from MOKDA. What would you like to know about our sauces, buying or working with us?',
      thanks: 'You’re welcome. Feel free to ask another question.',
      select: 'Choose a question, or type your own below.',
      fallback: 'We don’t have a prepared answer for that question yet. For questions about MOKDA, our sauces, buying or partnerships, use the contact button below.',
      input: 'Type your question', send: 'Send question',
      contact: 'Contact our team', whatsapp: 'Chat on WhatsApp', other: 'Another question',
      topics: ['Sauces and uses', 'Buying and distribution', 'About MOKDA', 'Collaborations'],
      quick: { choose: 'Choose a sauce', buy: 'Where to buy', export: 'Distribution' },
      message: 'Hello, MOKDA. I would like to ask about:',
    },
  };
  const language = window.MOKDA_I18N?.getLanguage() || document.documentElement.dataset.routeLanguage || 'ES';
  const lang = Object.hasOwn(copy, language) ? language : 'ES';
  const text = copy[lang];
  const categories = window.MOKDA_HELP_DATA[lang].categories;
  const questions = categories.flatMap(category => category.questions);
  const prefix = { KR: 'ko', ES: 'es', EN: 'en' }[lang];
  const DRAFT_KEY = 'mokdaChatInquiryDraft';
  // Only an explicit contact click carries the latest question to the form.
  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    try {
      const draft = sessionStorage.getItem(DRAFT_KEY);
      sessionStorage.removeItem(DRAFT_KEY);
      if (draft && !messageInput.value) messageInput.value = draft.slice(0, 500);
    } catch { /* The contact form remains available without browser storage. */ }
  }
  const root = document.createElement('aside');
  root.id = 'mokda-help';
  root.lang = { KR: 'ko-KR', ES: 'es-419', EN: 'en' }[lang];
  root.innerHTML = `
    <button type="button" class="help-launcher" aria-haspopup="dialog" aria-controls="mokda-help-dialog" aria-expanded="false">
      <svg class="help-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8 8 0 0 1-8 8H6l-3 2v-10a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z"/><path d="M8 10h8M8 14h5"/></svg>
      <svg class="help-dismiss-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
    </button>
    <dialog id="mokda-help-dialog" class="help-dialog" aria-labelledby="mokda-help-title" aria-modal="false">
      <div class="help-header">
        <img class="help-brand" src="/assets/images/mokda-logo-main.webp" width="44" height="44" alt="" />
        <div class="help-heading"><h2 id="mokda-help-title">MOKDA</h2><p></p></div>
        <button type="button" class="help-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </div>
      <div class="help-content"><p class="help-auto-label"></p><div class="help-conversation" role="log" aria-live="polite" aria-relevant="additions"></div><div class="help-options"></div></div>
      <div class="help-footer">
        <div class="help-tools"><button type="button" class="help-reset"></button><a class="help-contact"></a></div>
        <form class="help-composer"><input type="text" maxlength="500" autocomplete="off" /><button type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 7-7 7 7M12 5v15"/></svg></button></form>
      </div>
    </dialog>`;
  document.body.appendChild(root);
  const launcher = root.querySelector('.help-launcher');
  const dialog = root.querySelector('dialog');
  const content = root.querySelector('.help-content');
  const conversation = root.querySelector('.help-conversation');
  const options = root.querySelector('.help-options');
  const handoff = root.querySelector('.help-contact');
  const closeButton = root.querySelector('.help-close');
  const input = root.querySelector('.help-composer input');
  const resetButton = root.querySelector('.help-reset');
  launcher.setAttribute('aria-label', text.launcher);
  closeButton.setAttribute('aria-label', text.close);
  root.querySelector('.help-heading p').textContent = text.subtitle;
  root.querySelector('.help-auto-label').textContent = text.auto;
  resetButton.textContent = text.reset;
  input.setAttribute('aria-label', text.input);
  input.placeholder = text.input;
  root.querySelector('.help-composer button').setAttribute('aria-label', text.send);
  let context = '';
  let contactPath = 'contact.html';

  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value) node.textContent = value;
    return node;
  }
  function internalPath(path) {
    if (!/^[a-z0-9-]+\.html(?:[?#][a-zA-Z0-9_=&%#-]*)?$/.test(path || '')) return `/${prefix}/qna.html`;
    return `/${prefix}/${path}`;
  }
  function updateHandoff() {
    const configured = String(window.MOKDA_CONTACT?.whatsappNumber || '').trim();
    const number = configured.replace(/[+\s().-]/g, '');
    const validNumber = /^[1-9]\d{7,14}$/.test(number);
    handoff.textContent = `${validNumber ? text.whatsapp : text.contact} ↗`;
    handoff.href = validNumber
      ? `https://wa.me/${number}?text=${encodeURIComponent(`${text.message} ${context || 'MOKDA'}`)}`
      : internalPath(contactPath);
    if (validNumber) {
      handoff.target = '_blank'; handoff.rel = 'noopener noreferrer';
    } else {
      handoff.removeAttribute('target'); handoff.removeAttribute('rel');
    }
  }
  function message(role, value, link) {
    const bubble = element('div', `help-message help-message-${role}`);
    bubble.appendChild(element('p', '', value));
    if (link && !link.path.startsWith('contact.html')) {
      const anchor = element('a', 'help-detail-link', `${link.label} ↗`);
      anchor.href = internalPath(link.path);
      bubble.appendChild(anchor);
    }
    conversation.appendChild(bubble);
    // Keep this page's chat bounded; no full transcript is stored or sent.
    while (conversation.children.length > 25) conversation.firstElementChild.remove();
    return bubble;
  }
  function settle(focus) {
    updateHandoff();
    if (focus) {
      const latest = conversation.lastElementChild;
      latest.tabIndex = -1;
      latest.focus({ preventScroll: true });
    }
    content.scrollTop = content.scrollHeight;
  }
  function choice(label, action, className = '') {
    const button = element('button', `help-choice ${className}`, label);
    button.type = 'button';
    button.addEventListener('click', action);
    return button;
  }
  function topicChoices() {
    options.replaceChildren();
    const topics = element('div', 'help-topics');
    categories.forEach((category, i) => topics.appendChild(choice(text.topics[i], () => categoryView(category), 'help-topic')));
    options.appendChild(topics);
    const quick = element('div', 'help-quick');
    ['choose', 'buy', 'export'].forEach(id => quick.appendChild(choice(text.quick[id], () => answer(questions.find(question => question.id === id)), 'help-quick-question')));
    options.appendChild(quick);
  }
  function categoryView(category) {
    context = category.label; contactPath = 'contact.html';
    message('user', category.label);
    message('bot', text.select);
    options.replaceChildren();
    category.questions.forEach(question => options.appendChild(choice(question.question, () => answer(question), 'help-question')));
    options.appendChild(choice(text.other, () => { topicChoices(); settle(false); }, 'help-other'));
    settle(true);
  }
  function answer(question, original = question?.question) {
    if (!question) return;
    context = original.slice(0, 500);
    contactPath = question.link?.path?.startsWith('contact.html') ? question.link.path : 'contact.html';
    message('user', context);
    message('bot', question.answer, question.link);
    options.replaceChildren(choice(text.other, () => { topicChoices(); settle(false); }, 'help-other'));
    settle(true);
  }
  function restart(focus = false) {
    context = ''; contactPath = 'contact.html'; input.value = '';
    conversation.replaceChildren();
    message('bot', text.greeting);
    topicChoices();
    updateHandoff();
    content.scrollTop = 0;
    if (focus) closeButton.focus({ preventScroll: true });
  }
  root.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value.trim().slice(0, 500);
    if (!query) return;
    input.value = '';
    const social = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/^[¡¿\s]+|[!?.,\s]+$/g, '');
    const greeting = /^(?:안녕하세요|안녕|반갑습니다|hola|buenos dias|buenas tardes|buenas noches|hello|hi|hey|good morning|good afternoon|good evening)$/.test(social);
    const thanks = /^(?:감사합니다|고마워요|고마워|gracias|muchas gracias|thank you|thanks)$/.test(social);
    if (greeting || thanks) {
      message('user', query);
      message('bot', greeting ? text.greeting : text.thanks);
      // Polite replies keep the actual inquiry and handoff destination intact.
      settle(true);
      return;
    }
    const id = window.MOKDA_CHAT_INTENTS?.match(query, lang);
    const question = questions.find(item => item.id === id);
    if (question) answer(question, query);
    else {
      context = query; contactPath = 'contact.html';
      message('user', query);
      message('bot', text.fallback);
      topicChoices();
      settle(true);
    }
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.isComposing || event.keyCode === 229)) event.preventDefault();
  });
  handoff.addEventListener('click', () => {
    if (handoff.target || !context) return;
    try { sessionStorage.setItem(DRAFT_KEY, context); } catch { /* Contact still works. */ }
  });
  resetButton.addEventListener('click', () => restart(true));
  function close() { if (dialog.open) dialog.close(); }
  launcher.addEventListener('click', () => {
    if (typeof dialog.show !== 'function') { window.location.assign(`/${prefix}/contact.html`); return; }
    if (dialog.open) { close(); return; }
    dialog.show();
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', text.close);
    closeButton.focus({ preventScroll: true });
  });
  closeButton.addEventListener('click', close);
  dialog.addEventListener('close', () => {
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', text.launcher);
    if (root.contains(document.activeElement) || document.activeElement === document.body) launcher.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open && root.contains(document.activeElement)) { event.preventDefault(); close(); }
  });
  restart();
})();
```

## AccessibleAccordion

Source: `site-accordion.js`. Shared FAQ toggle controller. Public API: `MOKDA_ACCORDION.init(root, options)`; options select items/buttons and single-open behavior.

### `site-accordion.js`

```javascript
(function () {
  function init(root, options) {
    if (!root) return;

    const settings = Object.assign(
      {
        itemSelector: '[data-accordion-item]',
        buttonSelector: '[data-accordion-button]',
        openClass: 'is-open',
        single: true,
      },
      options || {}
    );

    const items = Array.from(root.querySelectorAll(settings.itemSelector));

    function setOpen(item, open) {
      const button = item.querySelector(settings.buttonSelector);
      if (!button) return;
      item.classList.toggle(settings.openClass, open);
      button.setAttribute('aria-expanded', String(open));

      const panelId = button.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.setAttribute('aria-hidden', String(!open));
    }

    items.forEach((item) => {
      const button = item.querySelector(settings.buttonSelector);
      if (!button || button.dataset.accordionBound === 'true') return;

      button.dataset.accordionBound = 'true';
      setOpen(item, item.classList.contains(settings.openClass));
      button.addEventListener('click', () => {
        const willOpen = !item.classList.contains(settings.openClass);
        if (settings.single) items.forEach((otherItem) => setOpen(otherItem, false));
        if (willOpen) setOpen(item, true);
      });
    });
  }

  window.MOKDA_ACCORDION = { init };
})();
```

## ProductCard (parallel Next.js UI)

Source: `components/product/ProductCard.tsx`. Props: product object; rendered by ProductShowcase. This parallel app contains legacy product names and is not the source of truth for public chat product facts. Do not import legacy copy into the new chatbot.

### `components/product/ProductCard.tsx`

```tsx
import type { Product } from './ProductShowcase';
import type { CSSProperties } from 'react';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const shadowByTitle: Record<string, Pick<Product, 'bottleShadow' | 'stageShadow' | 'stageGlow'>> = {
    Original: {
      bottleShadow: 'rgba(126,38,18,0.22)',
      stageShadow: 'rgba(126,38,18,0.24)',
      stageGlow: 'rgba(239,95,24,0.12)',
    },
    'Para Carne': {
      bottleShadow: 'rgba(126,74,24,0.2)',
      stageShadow: 'rgba(126,74,24,0.23)',
      stageGlow: 'rgba(214,143,54,0.12)',
    },
    'Soy Sauce': {
      bottleShadow: 'rgba(50,24,15,0.22)',
      stageShadow: 'rgba(50,24,15,0.24)',
      stageGlow: 'rgba(2,103,79,0.1)',
    },
  };
  const shadow = { ...shadowByTitle[product.title], ...product };
  const stageStyle = {
    '--bottle-shadow': shadow.bottleShadow,
    '--stage-shadow': shadow.stageShadow,
    '--stage-glow': shadow.stageGlow,
  } as CSSProperties;

  return (
    <article className="product-card flex min-w-0 flex-col items-center rounded-[1.25rem] px-4 py-8 text-center transition-all duration-300 sm:px-6">
      <p className="mb-1 break-keep text-sm font-extrabold leading-tight text-slate-700">
        {product.category}
      </p>
      <h3 className={`mb-6 break-keep text-2xl font-extrabold leading-tight ${product.titleColor}`}>
        {product.title}
      </h3>

      <div
        className="product-stage relative flex h-64 w-full items-center justify-center overflow-visible sm:h-72"
        style={stageStyle}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-bottle relative z-10 h-full w-full object-contain transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]"
        />
      </div>

      <p className="mt-6 break-keep text-sm font-medium leading-relaxed text-slate-800">
        {product.descLine1}
      </p>
      <p className="mt-1 break-keep text-base font-extrabold leading-relaxed text-gray-900">
        {product.descLine2}
      </p>
    </article>
  );
}
```

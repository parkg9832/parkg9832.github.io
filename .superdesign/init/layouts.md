# Repository UI context

Analyzed 2026-10-11 from the current working tree. Public production UI is static HTML plus shared vanilla-JavaScript widgets generated into /ko, /es and /en. Next.js/React files coexist but do not render the deployed static chatbot. Read canonical MOKDA_HARNESS.md and the nearest AGENTS.md before implementing.

## Shared production shell

Original static HTML contains `#main-header`, language controls and `#mobile-menu`. Shared scripts enhance them; `#footerText` receives the common footer. The chatbot appends its own `#mokda-help` aside to body. Root page backgrounds are retained during desktop chat, while the intended mobile messenger can become modal.

## SiteHeader

Source: `site-header.js`. Real-logo navigation, desktop panels, accessible responsive menu, scroll appearance and dynamic analytics loading. Menu lock uses `html.mokda-menu-lock`; chat must cooperate with that state.

### `site-header.js`

```javascript
(() => {
  if (!window.MOKDA_ANALYTICS_LOADING) {
    window.MOKDA_ANALYTICS_LOADING = true;
    const analyticsScript = document.createElement('script');
    analyticsScript.src = '/site-analytics.js?v=20260914-2';
    analyticsScript.async = true;
    document.head.appendChild(analyticsScript);
  }
})();

(() => {
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!header) return;

  const headerBar = header.firstElementChild;
  const sourceLinks = mobileMenu ? Array.from(mobileMenu.querySelectorAll('a')) : [];
  const language = document.documentElement.lang.startsWith('ko')
    ? 'ko'
    : document.documentElement.lang.startsWith('en')
      ? 'en'
      : 'es';

  const copy = {
    es: {
      brand: {
        label: 'MOKDA',
        links: [['Nuestra historia', ''], ['Nuestros ingredientes', 'ingredients'], ['Identidad', 'identity'], ['Trayectoria', 'history']]
      },
      products: {
        label: 'SALSA COREANA',
        links: [['Línea completa', ''], ['K-PEÑO', 'original'], ['Para Carnes', 'para-carnes']]
      },
      connect: {
        label: 'CONTACTO',
        links: [['Preguntas frecuentes', 'qna'], ['Enviar consulta', 'contact']]
      },
      news: { label: 'NOVEDADES', links: [['Todas las novedades', '']] },
      navigation: 'Navegación principal',
      menuLabel: 'MENÚ',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú'
    },
    ko: {
      brand: {
        label: 'MOKDA',
        links: [['브랜드 스토리', ''], ['원재료 이야기', 'ingredients'], ['브랜드 아이덴티티', 'identity'], ['브랜드 연혁', 'history']]
      },
      products: {
        label: 'SALSA COREANA',
        links: [['전체 라인업', ''], ['K-PEÑO', 'original'], ['Para Carnes', 'para-carnes']]
      },
      connect: {
        label: '문의',
        links: [['자주 묻는 질문', 'qna'], ['문의 보내기', 'contact']]
      },
      news: { label: 'MOKDA 소식', links: [['모든 소식', '']] },
      navigation: '주요 메뉴',
      menuLabel: 'MENU',
      openMenu: '메뉴 열기',
      closeMenu: '메뉴 닫기'
    },
    en: {
      brand: {
        label: 'MOKDA',
        links: [['Our story', ''], ['Our ingredients', 'ingredients'], ['Brand identity', 'identity'], ['Our history', 'history']]
      },
      products: {
        label: 'SALSA COREANA',
        links: [['Full lineup', ''], ['K-PEÑO', 'original'], ['Para Carnes', 'para-carnes']]
      },
      connect: {
        label: 'CONTACT',
        links: [['Frequently asked questions', 'qna'], ['Send an inquiry', 'contact']]
      },
      news: { label: 'UPDATES', links: [['All updates', '']] },
      navigation: 'Primary navigation',
      menuLabel: 'MENU',
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    }
  }[language];

  const style = document.createElement('style');
  style.textContent = `
    .mokda-site-header {
      height: 80px !important;
      padding: 0 !important;
      background: rgba(255, 248, 239, 0.98) !important;
      border-bottom: 1px solid transparent;
      box-shadow: none;
      transition:
        background-color 240ms ease,
        border-color 240ms ease,
        box-shadow 240ms ease !important;
    }

    .mokda-header-bar {
      height: 80px !important;
      width: 100% !important;
      max-width: 1440px !important;
      margin-inline: auto !important;
      box-sizing: border-box;
      padding: 0 18px !important;
      background: transparent !important;
    }

    .mokda-header-bar a[aria-label="MOKDA home"] img {
      width: auto;
      height: 94px !important;
      display: block;
      filter: saturate(1.06) contrast(1.05);
    }

    .mokda-header-bar #lang-selector {
      background: rgba(50, 21, 6, 0.055) !important;
      box-shadow: inset 0 0 0 1px rgba(50, 21, 6, 0.07);
    }

    .mokda-header-bar #menu-toggle {
      position: relative;
      color: #321506 !important;
      background: rgba(50, 21, 6, 0.055) !important;
      border: 1px solid rgba(50, 21, 6, 0.08);
    }

    .mokda-menu-icon {
      position: relative;
      display: block;
      width: 22px;
      height: 16px;
    }

    .mokda-menu-icon span {
      position: absolute;
      left: 0;
      width: 22px;
      height: 2px;
      border-radius: 999px;
      background: currentColor;
      transform-origin: center;
      transition:
        top 320ms cubic-bezier(0.22, 1, 0.36, 1),
        transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 220ms ease;
    }

    .mokda-menu-icon span:nth-child(1) { top: 0; }
    .mokda-menu-icon span:nth-child(2) { top: 7px; }
    .mokda-menu-icon span:nth-child(3) { top: 14px; }

    .mokda-header-bar #menu-toggle[aria-expanded="true"] .mokda-menu-icon span:nth-child(1) {
      top: 7px;
      transform: rotate(45deg);
    }

    .mokda-header-bar #menu-toggle[aria-expanded="true"] .mokda-menu-icon span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0.45);
    }

    .mokda-header-bar #menu-toggle[aria-expanded="true"] .mokda-menu-icon span:nth-child(3) {
      top: 7px;
      transform: rotate(-45deg);
    }

    .mokda-site-header.is-scrolled {
      background: rgba(255, 248, 239, 0.92) !important;
      border-bottom-color: rgba(50, 21, 6, 0.07);
      box-shadow: 0 4px 14px rgba(50, 21, 6, 0.035);
      backdrop-filter: saturate(1.12) blur(14px);
    }

    .mokda-desktop-nav,
    .mokda-nav-panel {
      display: none;
    }

    .mokda-site-header .mokda-mobile-menu {
      position: fixed !important;
      top: 80px !important;
      right: 0 !important;
      bottom: auto !important;
      height: calc(100dvh - 80px) !important;
      left: 0 !important;
      z-index: 70 !important;
      display: block !important;
      width: 100% !important;
      clip-path: inset(0 0 100% 0);
      overflow-x: hidden !important;
      overflow-y: auto !important;
      border: 0 !important;
      background: #321506 !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      will-change: clip-path, opacity;
      transition:
        clip-path 440ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 280ms ease,
        visibility 0s linear 440ms !important;
    }

    .mokda-site-header.is-mobile-menu-open .mokda-mobile-menu {
      clip-path: inset(0 0 0 0);
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      transition-delay: 0s !important;
    }

    .mokda-mobile-menu-inner {
      display: flex;
      width: min(100%, 980px);
      min-height: calc(100dvh - 80px);
      flex-direction: column;
      margin: 0 auto;
      padding: 30px 22px max(32px, env(safe-area-inset-bottom));
      opacity: 0;
      transform: translateY(18px);
      transition:
        opacity 260ms ease 100ms,
        transform 440ms cubic-bezier(0.22, 1, 0.36, 1) 80ms;
    }

    .mokda-site-header.is-mobile-menu-open .mokda-mobile-menu-inner {
      opacity: 1;
      transform: translateY(0);
    }

    .mokda-mobile-menu-label {
      margin-bottom: 28px;
      color: #ef5f18;
      font-family: 'Bebas Neue', 'Noto Sans KR', sans-serif;
      font-size: 15px;
      font-weight: 400;
      letter-spacing: 0.08em;
      line-height: 1;
    }

    .mokda-mobile-menu-groups {
      display: grid;
      gap: 0;
    }

    .mokda-mobile-nav-group {
      padding: 22px 0 24px;
      border-top: 1px solid rgba(255, 248, 239, 0.18);
      opacity: 0;
      transform: translateY(18px);
      transition:
        opacity 260ms ease,
        transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .mokda-mobile-nav-group:last-child {
      border-bottom: 1px solid rgba(255, 248, 239, 0.18);
    }

    .mokda-site-header.is-mobile-menu-open .mokda-mobile-nav-group {
      opacity: 1;
      transform: translateY(0);
    }

    .mokda-site-header.is-mobile-menu-open .mokda-mobile-nav-group:nth-child(1) { transition-delay: 130ms; }
    .mokda-site-header.is-mobile-menu-open .mokda-mobile-nav-group:nth-child(2) { transition-delay: 180ms; }
    .mokda-site-header.is-mobile-menu-open .mokda-mobile-nav-group:nth-child(3) { transition-delay: 230ms; }
    .mokda-site-header.is-mobile-menu-open .mokda-mobile-nav-group:nth-child(4) { transition-delay: 280ms; }

    .mokda-mobile-nav-heading {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      align-items: baseline;
      gap: 10px;
      margin-bottom: 18px;
    }

    .mokda-mobile-nav-index {
      color: #ef5f18;
      font-family: 'Bebas Neue', 'Noto Sans KR', sans-serif;
      font-size: 15px;
      font-weight: 400;
      letter-spacing: 0.08em;
    }

    .mokda-mobile-nav-title {
      width: fit-content;
      color: #fff8ef;
      font-family: 'Archivo Black', 'Noto Sans KR', sans-serif;
      font-size: clamp(28px, 8vw, 42px);
      font-weight: 400;
      letter-spacing: -0.035em;
      line-height: 1.12;
      text-decoration: none;
      transition: color 220ms ease;
    }

    html:lang(ko) .mokda-mobile-nav-title {
      font-family: 'Noto Sans KR', 'Noto Sans', sans-serif;
      font-weight: 800;
      line-height: 1.18;
      letter-spacing: -0.04em;
    }

    .mokda-mobile-nav-group.is-current .mokda-mobile-nav-title,
    .mokda-mobile-nav-title:hover,
    .mokda-mobile-nav-title:focus-visible {
      color: #ef5f18;
    }

    .mokda-mobile-nav-links {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px 14px;
      padding-left: 44px;
    }

    .mokda-mobile-nav-link {
      display: flex;
      min-height: 40px;
      align-items: center;
      gap: 9px;
      padding: 7px 0;
      color: rgba(255, 248, 239, 0.72);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0;
      line-height: 1.35;
      transition: color 240ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .mokda-mobile-nav-link::after {
      content: '↗';
      color: #ef5f18;
      font-size: 13px;
    }

    .mokda-mobile-nav-link:hover,
    .mokda-mobile-nav-link:focus-visible {
      color: #fff8ef;
      transform: translateX(4px);
    }

    .mokda-mobile-menu-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: auto;
      padding-top: 28px;
    }

    .mokda-mobile-menu-social {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
    }

    .mokda-mobile-menu-social a {
      color: rgba(255, 248, 239, 0.68);
      font-size: 12px;
      font-weight: 800;
      text-decoration: none;
      transition: color 220ms ease;
    }

    .mokda-mobile-menu-social a:hover,
    .mokda-mobile-menu-social a:focus-visible {
      color: #fff8ef;
    }

    .mokda-mobile-menu a:focus-visible,
    .mokda-mobile-menu button:focus-visible {
      outline: 2px solid #ef5f18;
      outline-offset: 4px;
    }

    html.mokda-menu-lock,
    html.mokda-menu-lock body {
      overflow: hidden !important;
    }

    @media (max-width: 479px) {
      .mokda-header-bar {
        padding: 0 12px !important;
      }

      .mokda-header-bar a[aria-label="MOKDA home"] img {
        height: 88px !important;
      }

      .mokda-header-bar > div:last-child {
        gap: 6px !important;
      }

      .mokda-header-bar #lang-selector .lang-btn,
      .mokda-header-bar #lang-bg {
        width: 40px !important;
      }

      .mokda-header-bar #lang-selector .lang-btn {
        height: 44px !important;
        font-size: 12px !important;
      }

      .mokda-header-bar #menu-toggle {
        width: 44px !important;
        height: 44px !important;
      }

      .mokda-mobile-menu-inner {
        padding-right: 18px;
        padding-left: 18px;
      }

      .mokda-mobile-nav-links {
        grid-template-columns: 1fr;
      }

      .mokda-mobile-menu-footer {
        width: 100%;
      }
    }

    @media (max-width: 359px) {
      .mokda-header-bar {
        padding-right: 8px !important;
        padding-left: 8px !important;
      }

      .mokda-header-bar a[aria-label="MOKDA home"] img {
        height: 74px !important;
      }

      .mokda-header-bar > div:last-child {
        gap: 4px !important;
      }

      .mokda-header-bar #lang-selector {
        padding: 2px !important;
      }

      .mokda-header-bar #lang-selector .lang-btn,
      .mokda-header-bar #lang-bg {
        width: 40px !important;
      }

      .mokda-header-bar #menu-toggle {
        width: 44px !important;
        height: 44px !important;
      }

      .mokda-mobile-menu-inner {
        padding-right: 14px;
        padding-left: 14px;
      }

      .mokda-mobile-nav-title {
        font-size: clamp(25px, 9vw, 32px);
      }
    }

    @media (min-width: 640px) and (max-width: 1023px) {
      .mokda-mobile-menu-inner {
        padding-top: 46px;
      }

      .mokda-mobile-menu-groups {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 26px;
      }

      .mokda-mobile-nav-group,
      .mokda-mobile-nav-group:last-child {
        border-top: 1px solid rgba(255, 248, 239, 0.18);
        border-bottom: 0;
      }

      .mokda-mobile-nav-heading {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .mokda-mobile-nav-title {
        font-size: clamp(25px, 4.3vw, 38px);
      }

      .mokda-mobile-nav-links {
        grid-template-columns: 1fr;
        padding-left: 0;
      }
    }

    @media (min-width: 1024px) {
      .mokda-header-bar {
        padding: 0 30px !important;
      }

      .mokda-header-bar a[aria-label="MOKDA home"] img {
        height: 96px !important;
      }

      .mokda-desktop-nav {
        display: flex;
        min-width: 0;
        flex: 1;
        align-self: stretch;
        align-items: center;
        justify-content: center;
        gap: clamp(34px, 4.5vw, 72px);
        margin: 0 34px;
      }

      .mokda-nav-trigger {
        position: relative;
        display: flex;
        height: 100%;
        align-items: center;
        gap: 8px;
        padding: 2px 0 0;
        color: rgba(50, 21, 6, 0.72);
        font-family: var(--mokda-font-body);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
        white-space: nowrap;
        transition: color 260ms ease;
      }

      .mokda-nav-trigger::after {
        content: '+';
        color: #ef5f18;
        font-family: var(--mokda-font-body);
        font-size: 15px;
        font-weight: 800;
        transition: transform 440ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .mokda-nav-trigger:hover,
      .mokda-nav-trigger[aria-expanded="true"],
      .mokda-nav-trigger.is-current {
        color: #321506;
      }

      .mokda-nav-trigger[aria-expanded="true"] {
        color: #ef5f18;
      }

      .mokda-nav-trigger[aria-expanded="true"]::after {
        transform: rotate(45deg);
      }

      .mokda-nav-panel {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        z-index: 60;
        display: none;
        overflow: hidden;
        height: 132px;
        color: #fff8ef;
        background: #321506;
        border-top: 3px solid #ef5f18;
      }

      .mokda-site-header.is-nav-open .mokda-nav-panel {
        display: block;
        animation: mokda-nav-panel-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes mokda-nav-panel-in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .mokda-nav-panel-inner {
        display: grid;
        grid-template-columns: minmax(210px, 0.6fr) minmax(0, 1.8fr);
        align-items: center;
        gap: clamp(36px, 6vw, 90px);
        width: min(calc(100% - 60px), 1220px);
        height: 100%;
        min-height: 106px;
        margin: 0 auto;
        padding: 20px 0;
      }

      .mokda-nav-panel-title {
        color: #ef5f18;
        font-family: 'Archivo Black', 'Noto Sans KR', sans-serif;
        font-size: clamp(22px, 2vw, 30px);
        font-weight: 400;
        letter-spacing: 0;
        line-height: 1.12;
      }

      html:lang(ko) .mokda-nav-panel-title {
        font-family: 'Noto Sans KR', 'Noto Sans', sans-serif;
        font-weight: 800;
        line-height: 1.18;
      }

      .mokda-nav-panel-links {
        display: flex;
        min-width: 0;
        align-items: stretch;
        border-left: 1px solid rgba(255, 248, 239, 0.2);
      }

      .mokda-nav-panel-link {
        position: relative;
        display: flex;
        min-width: 0;
        flex: 1 1 0;
        align-items: center;
        justify-content: center;
        padding: 20px 16px;
        color: rgba(255, 248, 239, 0.78);
        border-right: 1px solid rgba(255, 248, 239, 0.2);
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 1.25;
        text-align: center;
        transition: color 260ms ease, background-color 260ms ease;
      }

      .mokda-nav-panel-link::after {
        content: '';
        position: absolute;
        right: 18px;
        bottom: 12px;
        left: 18px;
        height: 2px;
        background: #ef5f18;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .mokda-nav-panel-link:hover,
      .mokda-nav-panel-link:focus-visible {
        color: #fff8ef;
        background: rgba(255, 248, 239, 0.055);
      }

      .mokda-nav-panel-link:hover::after,
      .mokda-nav-panel-link:focus-visible::after {
        transform: scaleX(1);
      }

      .mokda-header-bar #menu-toggle,
      .mokda-site-header .mokda-mobile-menu {
        display: none !important;
      }
    }

    @media (min-width: 1024px) and (max-width: 1160px) {
      .mokda-desktop-nav {
        gap: 26px;
        margin: 0 22px;
      }

      .mokda-nav-trigger {
        font-size: 11px;
      }

      .mokda-nav-panel-inner {
        grid-template-columns: 180px minmax(0, 1fr);
        gap: 28px;
      }

      .mokda-nav-panel-link {
        padding-right: 10px;
        padding-left: 10px;
        font-size: 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mokda-site-header.is-nav-open .mokda-nav-panel {
        animation: none;
      }

      .mokda-nav-panel,
      .mokda-nav-trigger::after,
      .mokda-nav-panel-link,
      .mokda-mobile-menu,
      .mokda-mobile-menu-inner,
      .mokda-mobile-nav-links,
      .mokda-mobile-nav-link,
      .mokda-menu-icon span {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  header.classList.add('mokda-site-header');
  if (headerBar) headerBar.classList.add('mokda-header-bar');
  if (menuToggle) {
    menuToggle.innerHTML = '<span class="mokda-menu-icon" aria-hidden="true"><span></span><span></span><span></span></span>';
  }

  const hrefs = {
    about: sourceLinks[0]?.getAttribute('href') || 'about.html',
    products: sourceLinks[1]?.getAttribute('href') || 'products.html',
    qna: sourceLinks[2]?.getAttribute('href') || 'qna.html',
    contact: sourceLinks[3]?.getAttribute('href') || 'contact.html'
  };

  function addHash(href, hash) {
    if (!hash) return href;
    return `${href.split('#')[0]}#${hash}`;
  }

  const groups = [
    { key: 'brand', page: 'about', ...copy.brand },
    { key: 'products', page: 'products', ...copy.products },
    { key: 'news', page: 'news', ...copy.news },
    { key: 'connect', page: 'connect', ...copy.connect }
  ];

  function groupHref(group, target) {
    if (group.key === 'news') {
      const href = window.MOKDA_I18N?.getLocalizedPath(window.MOKDA_I18N.getLanguage(), '/news.html') || 'news.html';
      return href;
    }
    if (group.key === 'brand') return addHash(hrefs.about, target);
    if (group.key === 'products') return addHash(hrefs.products, target);
    return target === 'qna' ? hrefs.qna : hrefs.contact;
  }

  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  const currentGroup = pageName === 'news.html' || pageName.startsWith('news-')
    ? 'news'
    : ['products.html', 'kpeno.html', 'para-carnes.html'].includes(pageName)
    ? 'products'
    : pageName === 'qna.html' || pageName === 'contact.html'
      ? 'connect'
      : 'brand';

  if (headerBar && sourceLinks.length) {
    const desktopNav = document.createElement('nav');
    desktopNav.className = 'mokda-desktop-nav';
    desktopNav.setAttribute('aria-label', copy.navigation);

    const panel = document.createElement('div');
    panel.className = 'mokda-nav-panel';
    panel.id = 'mokda-nav-panel';
    panel.setAttribute('aria-hidden', 'true');

    const triggers = groups.map((group) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mokda-nav-trigger';
      button.dataset.navGroup = group.key;
      button.textContent = group.label;
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', panel.id);
      if (group.key === currentGroup) button.classList.add('is-current');
      desktopNav.appendChild(button);
      return button;
    });

    const controls = headerBar.lastElementChild;
    headerBar.insertBefore(desktopNav, controls || null);
    header.appendChild(panel);

    function renderPanel(group) {
      const links = group.links.map(([label, target]) => (
        `<a class="mokda-nav-panel-link" href="${groupHref(group, target)}">${label}</a>`
      )).join('');

      panel.innerHTML = `
        <div class="mokda-nav-panel-inner">
          <p class="mokda-nav-panel-title">${group.label}</p>
          <div class="mokda-nav-panel-links">${links}</div>
        </div>
      `;
    }

    function setDesktopNavOpen(groupKey) {
      const group = groups.find((item) => item.key === groupKey);
      if (group) renderPanel(group);
      const shouldOpen = Boolean(group);
      header.classList.toggle('is-nav-open', shouldOpen);
      panel.setAttribute('aria-hidden', String(!shouldOpen));
      triggers.forEach((trigger) => {
        trigger.setAttribute('aria-expanded', String(trigger.dataset.navGroup === groupKey));
      });
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const groupKey = trigger.dataset.navGroup;
        setDesktopNavOpen(trigger.getAttribute('aria-expanded') === 'true' ? null : groupKey);
      });
    });

    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) setDesktopNavOpen(null);
    });

    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) setDesktopNavOpen(null);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !header.classList.contains('is-nav-open')) return;
      const activeTrigger = triggers.find((trigger) => trigger.getAttribute('aria-expanded') === 'true');
      setDesktopNavOpen(null);
      activeTrigger?.focus();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024) setDesktopNavOpen(null);
    });
  }

  if (menuToggle && mobileMenu) {
    mobileMenu.className = 'mokda-mobile-menu';
    mobileMenu.innerHTML = `
      <nav class="mokda-mobile-menu-inner" aria-label="${copy.navigation}">
        <p class="mokda-mobile-menu-label">${copy.menuLabel}</p>
        <div class="mokda-mobile-menu-groups">
          ${groups.map((group, index) => `
            <section class="mokda-mobile-nav-group${group.key === currentGroup ? ' is-current' : ''}">
              <div class="mokda-mobile-nav-heading">
                <span class="mokda-mobile-nav-index">0${index + 1}</span>
                <a class="mokda-mobile-nav-title" href="${groupHref(group, '')}">${group.label}</a>
              </div>
              <div class="mokda-mobile-nav-links">
                ${group.links.map(([label, target]) => (
                  `<a class="mokda-mobile-nav-link" href="${groupHref(group, target)}">${label}</a>`
                )).join('')}
              </div>
            </section>
          `).join('')}
        </div>
        <div class="mokda-mobile-menu-footer">
          <div class="mokda-mobile-menu-social" aria-label="MOKDA SNS">
            <a href="https://www.instagram.com/mokda_official/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@salsa_coreana" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://www.threads.com/@salsa_coreana" target="_blank" rel="noopener noreferrer">Threads</a>
          </div>
        </div>
      </nav>
    `;

    // The home header lives inside <main>; never make the open menu's ancestor inert.
    const backgroundRegions = [];
    for (let branch = header; branch.parentElement; branch = branch.parentElement) {
      const parent = branch.parentElement;
      backgroundRegions.push(...[...parent.children].filter(element =>
        element !== branch && element instanceof HTMLElement && !element.matches('script,style,link')
      ));
      if (parent === document.body) break;
    }
    const priorInertState = new Map();

    function setMenuOpen(isOpen) {
      header.classList.toggle('is-mobile-menu-open', isOpen);
      document.documentElement.classList.toggle('mokda-menu-lock', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? copy.closeMenu : copy.openMenu);
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      backgroundRegions.forEach(element => {
        if (isOpen) {
          if (!priorInertState.has(element)) priorInertState.set(element, element.inert);
          element.inert = true;
        } else if (priorInertState.has(element)) {
          element.inert = priorInertState.get(element);
          priorInertState.delete(element);
        }
      });
      if (!isOpen) mobileMenu.scrollTop = 0;
    }

    mobileMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    menuToggle.addEventListener('click', () => {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && menuToggle.getAttribute('aria-expanded') === 'true') {
        const focusable = [...header.querySelectorAll('a[href],button:not([disabled])')]
          .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
        const first = focusable[0];
        const last = focusable.at(-1);
        if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }
        return;
      }
      if (event.key !== 'Escape' || menuToggle.getAttribute('aria-expanded') !== 'true') return;
      setMenuOpen(false);
      menuToggle.focus();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    });

    setMenuOpen(false);
  }

  let scrollFramePending = false;

  function updateScrolledState() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    scrollFramePending = false;
  }

  function handleScroll() {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(updateScrolledState);
  }

  updateScrolledState();
  window.addEventListener('scroll', handleScroll, { passive: true });
})();
```

## SiteFooter

Source: `site-footer.js`. Three-language public navigation, social links, company information and legal text. Public API: `MOKDA_FOOTER.render(language)`.

### `site-footer.js`

```javascript
(() => {
  const FOOTER_COPY = {
    ES: {
      businessTitle: 'Información de la empresa',
      companyLabel: 'Empresa',
      company: 'MOKDA',
      ceoLabel: 'Representante',
      ceo: 'Gyeom Park',
      registrationLabel: 'Registro comercial',
      registration: '161-07-03392',
      addressLabel: 'Dirección',
      address: '44 Nambuk 10-gil, 2F, Gimje-si, Jeonbuk State, República de Corea',
      ipTitle: 'Propiedad intelectual',
      ip: 'El nombre de la marca, los nombres de los productos, los diseños de empaque y los materiales relacionados de MOKDA están en proceso de protección mediante marcas y otros derechos de propiedad intelectual.',
      navigationLabel: 'Explorar MOKDA',
      socialLabel: 'Redes sociales',
      navigation: [
        ['Inicio', ''],
        ['Nuestra historia', 'about.html'],
        ['Salsa Coreana', 'products.html'],
        ['Novedades MOKDA', 'news.html'],
        ['Preguntas frecuentes', 'qna.html'],
        ['Contacto', 'contact.html'],
      ],
      copyright: '© 2026 MOKDA. Todos los derechos reservados.',
    },
    EN: {
      businessTitle: 'Business Information',
      companyLabel: 'Company',
      company: 'MOKDA',
      ceoLabel: 'CEO',
      ceo: 'Gyeom Park',
      registrationLabel: 'Business Registration No.',
      registration: '161-07-03392',
      addressLabel: 'Address',
      address: '44 Nambuk 10-gil, 2F, Gimje-si, Jeonbuk State, Republic of Korea',
      ipTitle: 'Intellectual Property',
      ip: 'MOKDA’s brand name, product names, packaging designs, and related materials are undergoing trademark and intellectual property protection procedures.',
      navigationLabel: 'Explore MOKDA',
      socialLabel: 'Follow MOKDA',
      navigation: [
        ['Home', ''],
        ['Our story', 'about.html'],
        ['Salsa Coreana', 'products.html'],
        ['MOKDA Updates', 'news.html'],
        ['Frequently asked questions', 'qna.html'],
        ['Contact', 'contact.html'],
      ],
      copyright: '© 2026 MOKDA. All rights reserved.',
    },
    KR: {
      businessTitle: '회사 정보',
      companyLabel: '상호',
      company: 'MOKDA',
      ceoLabel: '대표',
      ceo: 'Gyeom Park',
      registrationLabel: '사업자등록번호',
      registration: '161-07-03392',
      addressLabel: '주소',
      address: '전북특별자치도 김제시 남북10길 44, 2층',
      ipTitle: '지식재산권',
      ip: 'MOKDA의 브랜드명, 제품명, 패키지 디자인 및 관련 자료는 상표권 및 지식재산권 보호 절차를 진행 중입니다.',
      navigationLabel: 'MOKDA 둘러보기',
      socialLabel: 'MOKDA SNS',
      navigation: [
        ['홈', ''],
        ['브랜드 소개', 'about.html'],
        ['Salsa Coreana', 'products.html'],
        ['MOKDA 소식', 'news.html'],
        ['자주 묻는 질문', 'qna.html'],
        ['문의', 'contact.html'],
      ],
      copyright: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  const SOCIAL_LINKS = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/mokda_official/',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@salsa_coreana',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.55 3c.24 2.08 1.42 3.55 3.45 4.13v3.16a7.45 7.45 0 0 1-3.36-.86v5.91c0 3.48-2.31 5.66-5.63 5.66-3.03 0-5.01-1.88-5.01-4.72 0-3.12 2.42-4.95 5.77-4.62v3.22c-1.49-.27-2.42.29-2.42 1.31 0 .85.66 1.42 1.63 1.42 1.1 0 1.82-.69 1.82-2.17V3h3.75Z"></path></svg>',
    },
    {
      label: 'Threads',
      href: 'https://www.threads.com/@salsa_coreana',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.6 10.8c-.28-3.24-2.18-5.04-5.32-5.04-3.63 0-5.91 2.45-5.91 6.24 0 3.97 2.36 6.24 5.91 6.24 2.84 0 4.73-1.38 5.35-3.54.54-1.9-.64-3.34-2.86-3.51-2.17-.17-3.53.76-3.53 2.18 0 1.04.82 1.72 2.05 1.72 1.33 0 2.13-.72 2.13-1.85 0-2.28-2.21-3.69-5.13-3.24"></path><path d="M19.28 8.08C18.12 4.84 15.72 3 12.2 3 7.22 3 4 6.55 4 12s3.22 9 8.2 9c3.65 0 6.24-1.93 7.3-5.14"></path></svg>',
    },
  ];

  function normalizeLanguage(language) {
    return Object.hasOwn(FOOTER_COPY, language) ? language : 'ES';
  }

  const footerStyle = document.createElement('style');
  footerStyle.textContent = `
    #footerText {
      font-family: var(--mokda-font-body, 'Noto Sans');
    }
    #footerText .mokda-footer-navigation a {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: .01em;
    }
    #footerText .mokda-footer-social {
      margin-bottom: 28px;
      padding-bottom: 28px;
      border-bottom: 1px solid rgba(255, 248, 239, .14);
      text-align: center;
    }
    #footerText .mokda-footer-social p {
      margin: 0 0 16px;
      color: #ef8954;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    #footerText .mokda-footer-social-links { display: flex; justify-content: center; gap: 20px; }
    #footerText .mokda-footer-social-links a {
      display: inline-flex;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      color: #fff8ef;
      transition: color 180ms ease;
    }
    #footerText .mokda-footer-social-links svg { width: 34px; height: 34px; }
    #footerText .mokda-footer-social-links a:hover { color: #ef8954; }
    #footerText :is(.mokda-footer-social-links, .mokda-footer-navigation) a:focus-visible {
      outline: 2px solid #ef8954;
      outline-offset: 4px;
    }
    #footerText .mokda-footer-legal {
      display: grid;
      grid-template-columns: minmax(0, 1.7fr) minmax(240px, 1fr);
      gap: 32px 72px;
      margin-top: 28px;
      padding-top: 28px;
      border-top: 1px solid rgba(255, 248, 239, .22);
      text-align: left;
    }
    #footerText .mokda-footer-legal h2 {
      margin: 0 0 14px;
      color: #ef8954;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: .025em;
      text-transform: uppercase;
    }
    #footerText .mokda-footer-company {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, max-content));
      gap: 8px 24px;
      margin: 0;
    }
    #footerText .mokda-footer-company > div {
      display: flex;
      flex-wrap: wrap;
      gap: 0 7px;
      min-width: 0;
      color: rgba(255, 248, 239, .77);
      font-size: 13px;
      line-height: 1.65;
    }
    #footerText .mokda-footer-company > div:last-child { grid-column: 1 / -1; }
    #footerText .mokda-footer-company dt { color: rgba(255, 248, 239, .5); font-weight: 500; }
    #footerText .mokda-footer-company dd { margin: 0; overflow-wrap: anywhere; }
    #footerText .mokda-footer-ip p {
      max-width: 420px;
      margin: 0;
      color: rgba(255, 248, 239, .67);
      font-size: 13px;
      line-height: 1.65;
      word-break: keep-all;
    }
    #footerText .mokda-footer-copyright {
      margin: 26px 0 0;
      padding-top: 17px;
      border-top: 1px solid rgba(255, 248, 239, .12);
      color: rgba(255, 248, 239, .52);
      font-size: 12px;
      line-height: 1.5;
      text-align: left;
    }
    @media (max-width: 1100px) {
      #footerText .mokda-footer-legal { grid-template-columns: 1fr; gap: 25px; }
    }
    @media (max-width: 767px) {
      #footerText .mokda-footer-legal { grid-template-columns: 1fr; gap: 25px; margin-top: 24px; padding-top: 25px; }
      #footerText .mokda-footer-company { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 14px; }
      #footerText .mokda-footer-company > div:nth-child(n + 3) { grid-column: 1 / -1; }
      #footerText .mokda-footer-copyright { margin-top: 25px; }
    }
  `;
  document.head.appendChild(footerStyle);

  function render(language) {
    const element = document.getElementById('footerText');
    if (!element) return;

    const normalizedLanguage = normalizeLanguage(language);
    const footer = FOOTER_COPY[normalizedLanguage];
    const localizedPrefix = { ES: 'es', EN: 'en', KR: 'ko' }[normalizedLanguage];
    const routePrefix = window.location.pathname.match(/^\/(es|en|ko)(?:\/|$)/)?.[1] || localizedPrefix;
    const socialLinks = document.getElementById('socialBanner') ? '' : `
      <div class="mokda-footer-social">
        <p>${footer.socialLabel}</p>
        <div class="mokda-footer-social-links">
          ${SOCIAL_LINKS.map(({ label, href, icon }) => `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${icon}</a>`).join('')}
        </div>
      </div>
    `;
    const navigationLinks = footer.navigation
      .map(([label, route]) => {
        const href = route ? `/${routePrefix}/${route}` : `/${routePrefix}/`;
        return `<a class="flex min-h-9 items-center justify-center px-1 font-bold leading-5 text-white/76 transition hover:text-white focus:text-white sm:min-h-0 sm:px-0" href="${href}">${label}</a>`;
      })
      .join('');
    element.innerHTML = `
      <div class="text-center">
        ${socialLinks}
        <nav aria-label="${footer.navigationLabel}" class="mokda-footer-navigation grid grid-cols-2 gap-x-3 gap-y-1 py-2 text-[13px] sm:flex sm:flex-wrap sm:justify-center sm:gap-x-7 sm:gap-y-2 sm:py-4 sm:text-sm">
          ${navigationLinks}
        </nav>
        <div class="mokda-footer-legal">
          <section class="mokda-footer-business">
            <h2>${footer.businessTitle}</h2>
            <dl class="mokda-footer-company">
              <div>
                <dt>${footer.companyLabel}</dt>
                <dd>${footer.company}</dd>
              </div>
              <div>
                <dt>${footer.ceoLabel}</dt>
                <dd>${footer.ceo}</dd>
              </div>
              <div>
                <dt>${footer.registrationLabel}</dt>
                <dd>${footer.registration}</dd>
              </div>
              <div>
                <dt>${footer.addressLabel}</dt>
                <dd>${footer.address}</dd>
              </div>
            </dl>
          </section>
          <section class="mokda-footer-ip">
            <h2>${footer.ipTitle}</h2>
            <p>${footer.ip}</p>
          </section>
        </div>
        <p class="mokda-footer-copyright">${footer.copyright}</p>
      </div>
    `;
  }

  window.MOKDA_FOOTER = { render };
})();
```

## NextRootLayout (parallel app only)

Source: `app/layout.tsx`. Imports app/globals.css and wraps the standalone React app; it does not inject the production static widget.

### `app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MOKDA | Korean Sauce for LATAM',
  description: 'MOKDA brings Korean sauce culture to Latin American tables.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

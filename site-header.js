(() => {
  if (!window.MOKDA_ANALYTICS_LOADING) {
    window.MOKDA_ANALYTICS_LOADING = true;
    const analyticsScript = document.createElement('script');
    analyticsScript.src = '/site-analytics.js?v=20260810-3';
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
        links: [['Nuestra historia', 'story'], ['Identidad', 'identity'], ['Trayectoria', 'history']]
      },
      products: {
        label: 'SALSA COREANA',
        links: [['Línea completa', ''], ['Original', 'original'], ['Para Carnes', 'para-carnes'], ['Soy Sauce', 'soy-sauce']]
      },
      connect: {
        label: 'CONTACTO',
        links: [['Preguntas frecuentes', 'qna'], ['Enviar consulta', 'contact'], ['Apoyar lanzamiento', 'support']]
      },
      navigation: 'Navegación principal'
    },
    ko: {
      brand: {
        label: 'MOKDA',
        links: [['브랜드 스토리', 'story'], ['브랜드 아이덴티티', 'identity'], ['브랜드 연혁', 'history']]
      },
      products: {
        label: 'SALSA COREANA',
        links: [['전체 라인업', ''], ['Original', 'original'], ['Para Carnes', 'para-carnes'], ['Soy Sauce', 'soy-sauce']]
      },
      connect: {
        label: '문의',
        links: [['자주 묻는 질문', 'qna'], ['문의 보내기', 'contact'], ['출시 응원하기', 'support']]
      },
      navigation: '주요 메뉴'
    },
    en: {
      brand: {
        label: 'MOKDA',
        links: [['Our story', 'story'], ['Brand identity', 'identity'], ['Our journey', 'history']]
      },
      products: {
        label: 'SALSA COREANA',
        links: [['Full lineup', ''], ['Original', 'original'], ['Para Carnes', 'para-carnes'], ['Soy Sauce', 'soy-sauce']]
      },
      connect: {
        label: 'CONTACT',
        links: [['Frequently asked questions', 'qna'], ['Send an inquiry', 'contact'], ['Support launch', 'support']]
      },
      navigation: 'Primary navigation'
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
      max-width: 1440px !important;
      padding: 0 18px !important;
      background: transparent !important;
    }

    .mokda-header-bar a[aria-label="MOKDA home"] img {
      width: auto;
      height: 68px !important;
    }

    .mokda-header-bar #lang-selector {
      background: rgba(50, 21, 6, 0.055) !important;
      box-shadow: inset 0 0 0 1px rgba(50, 21, 6, 0.07);
    }

    .mokda-header-bar #menu-toggle {
      color: #321506 !important;
      background: rgba(50, 21, 6, 0.055) !important;
      border: 1px solid rgba(50, 21, 6, 0.08);
    }

    .mokda-site-header.is-scrolled {
      background: rgba(255, 255, 255, 0.76) !important;
      border-bottom-color: rgba(50, 21, 6, 0.07);
      box-shadow: 0 4px 14px rgba(50, 21, 6, 0.035);
    }

    .mokda-desktop-nav,
    .mokda-nav-panel {
      display: none;
    }

    .mokda-site-header .mokda-mobile-menu {
      position: fixed !important;
      top: 80px !important;
      right: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      z-index: 70 !important;
      display: block !important;
      width: 100% !important;
      max-height: 0 !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      border: 0 !important;
      background: #321506 !important;
      opacity: 0 !important;
      transform: translateY(-10px);
      visibility: hidden !important;
      transition:
        max-height 520ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 360ms ease,
        transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0s linear 520ms !important;
    }

    .mokda-site-header.is-mobile-menu-open .mokda-mobile-menu {
      max-height: calc(100dvh - 80px) !important;
      opacity: 1 !important;
      transform: translateY(0);
      visibility: visible !important;
      transition-delay: 0s !important;
    }

    .mokda-mobile-menu-inner {
      width: min(100%, 760px);
      margin: 0 auto;
      padding: 18px 20px max(36px, env(safe-area-inset-bottom));
    }

    .mokda-mobile-nav-group {
      border-bottom: 1px solid rgba(255, 248, 239, 0.2);
    }

    .mokda-mobile-nav-trigger {
      display: flex;
      width: 100%;
      min-height: 72px;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      color: #fff8ef;
      font-family: 'Noto Sans', 'Noto Sans KR', sans-serif;
      font-size: clamp(20px, 5.5vw, 26px);
      font-weight: 700;
      letter-spacing: 0;
      line-height: 1;
      text-align: left;
    }

    .mokda-mobile-nav-trigger::after {
      content: '+';
      flex: none;
      color: #ef5f18;
      font-family: 'Noto Sans', 'Noto Sans KR', sans-serif;
      font-size: 24px;
      font-weight: 800;
      transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .mokda-mobile-nav-group.is-open .mokda-mobile-nav-trigger::after {
      transform: rotate(45deg);
    }

    .mokda-mobile-nav-links {
      display: grid;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition:
        max-height 560ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 380ms ease;
    }

    .mokda-mobile-nav-group.is-open .mokda-mobile-nav-links {
      max-height: 320px;
      padding-bottom: 18px;
      opacity: 1;
    }

    .mokda-mobile-nav-link {
      display: flex;
      min-height: 48px;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 0 10px 20px;
      color: rgba(255, 248, 239, 0.76);
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1.35;
      transition: color 240ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .mokda-mobile-nav-link::after {
      content: '→';
      color: #ef5f18;
      font-size: 18px;
    }

    .mokda-mobile-nav-link:hover,
    .mokda-mobile-nav-link:focus-visible {
      color: #fff8ef;
      transform: translateX(4px);
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
        height: 64px !important;
      }

      .mokda-header-bar > div:last-child {
        gap: 6px !important;
      }

      .mokda-header-bar #lang-selector .lang-btn,
      .mokda-header-bar #lang-bg {
        width: 34px !important;
      }

      .mokda-header-bar #lang-selector .lang-btn {
        font-size: 11px !important;
      }
    }

    @media (min-width: 1024px) {
      .mokda-header-bar {
        padding: 0 30px !important;
      }

      .mokda-header-bar a[aria-label="MOKDA home"] img {
        height: 72px !important;
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
        font-family: 'Noto Sans', 'Noto Sans KR', sans-serif;
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
        font-family: 'Noto Sans', 'Noto Sans KR', sans-serif;
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
        top: 80px;
        right: 0;
        left: 0;
        z-index: 60;
        display: block;
        overflow: hidden;
        height: 132px;
        color: #fff8ef;
        background: #321506;
        border-top: 3px solid #ef5f18;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-8px);
        visibility: hidden;
        transition:
          opacity 220ms ease,
          transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
          visibility 0s linear 280ms;
      }

      .mokda-site-header.is-nav-open .mokda-nav-panel {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
        visibility: visible;
        transition-delay: 0s;
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
        font-weight: 900;
        letter-spacing: 0;
        line-height: 0.96;
      }

      html:lang(ko) .mokda-nav-panel-title {
        font-family: 'Noto Sans KR', 'Noto Sans', sans-serif;
        font-weight: 800;
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
      .mokda-nav-panel,
      .mokda-nav-trigger::after,
      .mokda-nav-panel-link,
      .mokda-mobile-menu,
      .mokda-mobile-nav-links,
      .mokda-mobile-nav-trigger::after,
      .mokda-mobile-nav-link {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  header.classList.add('mokda-site-header');
  if (headerBar) headerBar.classList.add('mokda-header-bar');

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
    { key: 'connect', page: 'connect', ...copy.connect }
  ];

  function groupHref(group, target) {
    if (group.key === 'brand') return addHash(hrefs.about, target);
    if (group.key === 'products') return addHash(hrefs.products, target);
    if (target === 'support') return hrefs.contact.replace('contact.html', 'support.html');
    return target === 'qna' ? hrefs.qna : hrefs.contact;
  }

  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  const currentGroup = pageName === 'products.html'
    ? 'products'
    : pageName === 'qna.html' || pageName === 'contact.html' || pageName === 'support.html'
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
        ${groups.map((group) => `
          <section class="mokda-mobile-nav-group" data-mobile-group="${group.key}">
            <button class="mokda-mobile-nav-trigger" type="button" aria-expanded="false">
              ${group.label}
            </button>
            <div class="mokda-mobile-nav-links">
              ${group.links.map(([label, target]) => (
                `<a class="mokda-mobile-nav-link" href="${groupHref(group, target)}">${label}</a>`
              )).join('')}
            </div>
          </section>
        `).join('')}
      </nav>
    `;

    const mobileGroups = Array.from(mobileMenu.querySelectorAll('.mokda-mobile-nav-group'));

    function setMobileGroup(groupKey) {
      mobileGroups.forEach((group) => {
        const isOpen = group.dataset.mobileGroup === groupKey;
        group.classList.toggle('is-open', isOpen);
        group.querySelector('.mokda-mobile-nav-trigger')?.setAttribute('aria-expanded', String(isOpen));
      });
    }

    function setMenuOpen(isOpen) {
      header.classList.toggle('is-mobile-menu-open', isOpen);
      document.documentElement.classList.toggle('mokda-menu-lock', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      if (!isOpen) setMobileGroup(null);
    }

    mobileGroups.forEach((group) => {
      group.querySelector('.mokda-mobile-nav-trigger')?.addEventListener('click', () => {
        setMobileGroup(group.classList.contains('is-open') ? null : group.dataset.mobileGroup);
      });
    });

    mobileMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    menuToggle.addEventListener('click', () => {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (event) => {
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

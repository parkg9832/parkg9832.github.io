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

  const style = document.createElement('style');
  style.textContent = `
    .mokda-site-header {
      height: 80px !important;
      padding: 0 !important;
      background: #fff8ef !important;
      border-bottom: 1px solid rgba(50, 21, 6, 0.13);
    }

    .mokda-header-bar {
      height: 80px !important;
      max-width: 1480px !important;
      padding: 0 18px !important;
      background: transparent !important;
    }

    .mokda-header-bar a[aria-label="MOKDA home"] img {
      height: 29px !important;
      width: auto;
    }

    .mokda-header-bar #lang-selector {
      background: rgba(50, 21, 6, 0.06) !important;
      box-shadow: inset 0 0 0 1px rgba(50, 21, 6, 0.06);
    }

    .mokda-header-bar #menu-toggle {
      color: #321506 !important;
      background: rgba(50, 21, 6, 0.06) !important;
      border: 1px solid rgba(50, 21, 6, 0.08);
    }

    .mokda-desktop-nav,
    .mokda-nav-panel {
      display: none;
    }

    .mokda-site-header #mobile-menu {
      top: 80px !important;
      left: 0 !important;
      width: 100% !important;
      border: 0 !important;
      border-bottom: 1px solid rgba(50, 21, 6, 0.14) !important;
      border-radius: 0;
      background: rgba(255, 248, 239, 0.98) !important;
    }

    .mokda-site-header.is-scrolled {
      box-shadow: 0 12px 34px rgba(50, 21, 6, 0.1);
    }

    @media (max-width: 479px) {
      .mokda-header-bar {
        padding: 0 12px !important;
      }

      .mokda-header-bar a[aria-label="MOKDA home"] img {
        height: 24px !important;
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
        height: 32px !important;
      }

      .mokda-desktop-nav {
        display: flex;
        min-width: 0;
        flex: 1;
        align-self: stretch;
        align-items: center;
        justify-content: center;
        gap: clamp(30px, 4vw, 68px);
        margin: 0 34px;
      }

      .mokda-nav-trigger {
        position: relative;
        display: flex;
        height: 100%;
        align-items: center;
        gap: 9px;
        padding: 2px 0 0;
        color: rgba(50, 21, 6, 0.72);
        font-family: 'Archivo Black', 'Black Han Sans', 'Noto Sans KR', sans-serif;
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 0;
        line-height: 1;
        white-space: nowrap;
        transition: color 260ms ease;
      }

      .mokda-nav-trigger::before {
        content: '';
        position: absolute;
        right: 0;
        bottom: 17px;
        left: 0;
        height: 3px;
        background: #ef5f18;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .mokda-nav-trigger::after {
        content: '+';
        color: #ef5f18;
        font-family: 'Noto Sans', sans-serif;
        font-size: 15px;
        font-weight: 700;
        transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .mokda-nav-trigger:hover,
      .mokda-nav-trigger[aria-expanded="true"],
      .mokda-nav-trigger.is-current {
        color: #321506;
      }

      .mokda-nav-trigger:hover::before,
      .mokda-nav-trigger[aria-expanded="true"]::before,
      .mokda-nav-trigger.is-current::before {
        transform: scaleX(1);
      }

      .mokda-nav-trigger[aria-expanded="true"]::after {
        transform: rotate(45deg);
      }

      .mokda-nav-panel {
        position: absolute;
        top: 80px;
        right: 0;
        left: 0;
        display: block;
        overflow: hidden;
        max-height: 0;
        color: #321506;
        background: #ef5f18;
        border-bottom: 1px solid rgba(50, 21, 6, 0.2);
        opacity: 0;
        transform: translateY(-18px);
        visibility: hidden;
        transition:
          max-height 520ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 320ms ease,
          transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
          visibility 0s linear 520ms;
      }

      .mokda-site-header.is-nav-open .mokda-nav-panel {
        max-height: 230px;
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
        transition-delay: 0s;
      }

      .mokda-nav-panel-inner {
        display: grid;
        grid-template-columns: minmax(250px, 0.75fr) minmax(0, 1.5fr);
        align-items: center;
        gap: 56px;
        width: min(100% - 60px, 1220px);
        min-height: 176px;
        margin: 0 auto;
        padding: 28px 0 30px;
      }

      .mokda-nav-panel-copy {
        align-self: center;
      }

      .mokda-nav-panel-eyebrow {
        margin-bottom: 8px;
        font-family: 'Bebas Neue', 'Noto Sans KR', sans-serif;
        font-size: 15px;
        line-height: 1;
        text-transform: uppercase;
      }

      .mokda-nav-panel-title {
        font-family: 'Archivo Black', 'Black Han Sans', 'Noto Sans KR', sans-serif;
        font-size: clamp(30px, 3vw, 47px);
        font-weight: 400;
        letter-spacing: 0;
        line-height: 0.92;
      }

      .mokda-nav-panel-description {
        margin-top: 11px;
        max-width: 390px;
        font-size: 13px;
        font-weight: 650;
        line-height: 1.55;
      }

      .mokda-nav-panel-links {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        border-top: 1px solid rgba(50, 21, 6, 0.36);
      }

      .mokda-nav-panel-link {
        display: flex;
        min-height: 62px;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 0 18px;
        border-bottom: 1px solid rgba(50, 21, 6, 0.36);
        color: #321506;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
        transition: color 240ms ease, background-color 240ms ease, padding 320ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .mokda-nav-panel-link::after {
        content: '→';
        flex: none;
        font-size: 17px;
      }

      .mokda-nav-panel-link:hover,
      .mokda-nav-panel-link:focus-visible {
        padding-left: 24px;
        color: #fff8ef;
        background: rgba(50, 21, 6, 0.92);
      }

      .mokda-header-bar #menu-toggle,
      .mokda-site-header #mobile-menu {
        display: none !important;
      }
    }

    @media (min-width: 1024px) and (max-width: 1160px) {
      .mokda-desktop-nav {
        gap: 25px;
        margin: 0 22px;
      }

      .mokda-nav-trigger {
        font-size: 11px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mokda-nav-panel,
      .mokda-nav-trigger::before,
      .mokda-nav-trigger::after,
      .mokda-nav-panel-link {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  header.classList.add('mokda-site-header');
  if (headerBar) headerBar.classList.add('mokda-header-bar');

  const copy = {
    es: {
      brand: {
        label: 'MOKDA', eyebrow: 'Marca K-Food', title: 'Conoce MOKDA', description: 'La historia, la identidad y el camino de una marca entre Corea y América Latina.',
        links: [['Nuestra historia', 'story'], ['Identidad', 'identity'], ['Trayectoria', 'history']]
      },
      products: {
        label: 'SALSA COREANA', eyebrow: 'Primera línea', title: 'Salsa Coreana', description: 'Tres sabores coreanos pensados para integrarse en comidas cotidianas.',
        links: [['Línea completa', ''], ['Original', 'original'], ['Para Carnes', 'para-carnes'], ['Soy Sauce', 'soy-sauce']]
      },
      connect: {
        label: 'CONTACTO', eyebrow: 'Conversemos', title: 'Conecta con MOKDA', description: 'Respuestas, consultas y propuestas para consumidores y socios.',
        links: [['Preguntas frecuentes', 'qna'], ['Enviar una consulta', 'contact']]
      }
    },
    ko: {
      brand: {
        label: 'MOKDA', eyebrow: 'K-Food 브랜드', title: 'MOKDA 소개', description: '한국과 라틴아메리카를 잇는 브랜드의 이야기, 정체성, 여정.',
        links: [['브랜드 스토리', 'story'], ['브랜드 아이덴티티', 'identity'], ['브랜드 연혁', 'history']]
      },
      products: {
        label: 'SALSA COREANA', eyebrow: '첫 번째 제품 라인', title: 'Salsa Coreana', description: '일상 음식에 자연스럽게 어울리는 세 가지 한국 소스.',
        links: [['전체 라인업', ''], ['Original', 'original'], ['Para Carnes', 'para-carnes'], ['Soy Sauce', 'soy-sauce']]
      },
      connect: {
        label: '문의', eyebrow: 'MOKDA와 연결', title: 'MOKDA 문의', description: '일반 소비자 문의부터 유통과 협업 제안까지.',
        links: [['자주 묻는 질문', 'qna'], ['문의 보내기', 'contact']]
      }
    },
    en: {
      brand: {
        label: 'MOKDA', eyebrow: 'K-Food brand', title: 'Discover MOKDA', description: 'The story, identity and journey of a brand connecting Korea and Latin America.',
        links: [['Our story', 'story'], ['Brand identity', 'identity'], ['Our journey', 'history']]
      },
      products: {
        label: 'SALSA COREANA', eyebrow: 'First product line', title: 'Salsa Coreana', description: 'Three Korean sauces designed for familiar everyday foods.',
        links: [['Full lineup', ''], ['Original', 'original'], ['Para Carnes', 'para-carnes'], ['Soy Sauce', 'soy-sauce']]
      },
      connect: {
        label: 'CONTACT', eyebrow: 'Talk with MOKDA', title: 'Connect with MOKDA', description: 'Answers, consumer inquiries and partnership proposals.',
        links: [['Frequently asked questions', 'qna'], ['Send an inquiry', 'contact']]
      }
    }
  }[language];

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

  if (headerBar && sourceLinks.length) {
    const desktopNav = document.createElement('nav');
    desktopNav.className = 'mokda-desktop-nav';
    desktopNav.setAttribute('aria-label', language === 'ko' ? '주요 메뉴' : 'Primary navigation');

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
      desktopNav.appendChild(button);
      return button;
    });

    const controls = headerBar.lastElementChild;
    headerBar.insertBefore(desktopNav, controls || null);
    header.appendChild(panel);

    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const currentGroup = pageName === 'products.html'
      ? 'products'
      : pageName === 'qna.html' || pageName === 'contact.html'
        ? 'connect'
        : 'brand';
    triggers.find((trigger) => trigger.dataset.navGroup === currentGroup)?.classList.add('is-current');

    function groupHref(group, target) {
      if (group.key === 'brand') return addHash(hrefs.about, target);
      if (group.key === 'products') return addHash(hrefs.products, target);
      return target === 'qna' ? hrefs.qna : hrefs.contact;
    }

    function renderPanel(group) {
      const links = group.links.map(([label, target]) => (
        `<a class="mokda-nav-panel-link" href="${groupHref(group, target)}">${label}</a>`
      )).join('');
      panel.innerHTML = `
        <div class="mokda-nav-panel-inner">
          <div class="mokda-nav-panel-copy">
            <p class="mokda-nav-panel-eyebrow">${group.eyebrow}</p>
            <p class="mokda-nav-panel-title">${group.title}</p>
            <p class="mokda-nav-panel-description">${group.description}</p>
          </div>
          <div class="mokda-nav-panel-links">${links}</div>
        </div>
      `;
    }

    function setDesktopNavOpen(groupKey) {
      const shouldOpen = Boolean(groupKey);
      const group = groups.find((item) => item.key === groupKey);
      if (group) renderPanel(group);
      header.classList.toggle('is-nav-open', shouldOpen);
      panel.setAttribute('aria-hidden', String(!shouldOpen));
      triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', String(trigger.dataset.navGroup === groupKey)));
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
      if (event.key === 'Escape' && header.classList.contains('is-nav-open')) {
        const activeTrigger = triggers.find((trigger) => trigger.getAttribute('aria-expanded') === 'true');
        setDesktopNavOpen(null);
        activeTrigger?.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024) setDesktopNavOpen(null);
    });
  }

  function setHeaderScrolled(isScrolled) {
    header.classList.toggle('is-scrolled', isScrolled);
  }

  function handleScroll() {
    setHeaderScrolled(window.scrollY > 10);
  }

  if (menuToggle && mobileMenu) {
    function setMenuOpen(isOpen) {
      mobileMenu.classList.toggle('max-h-0', !isOpen);
      mobileMenu.classList.toggle('opacity-0', !isOpen);
      mobileMenu.classList.toggle('invisible', !isOpen);
      mobileMenu.classList.toggle('max-h-64', isOpen);
      mobileMenu.classList.toggle('opacity-100', isOpen);
      mobileMenu.classList.toggle('visible', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    }

    menuToggle.addEventListener('click', () => {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    });

    setMenuOpen(false);
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
})();

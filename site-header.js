(() => {
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!header) return;

  const headerBar = header.firstElementChild;
  const sourceLinks = mobileMenu ? Array.from(mobileMenu.querySelectorAll('a')) : [];

  const style = document.createElement('style');
  style.textContent = `
    .mokda-site-header {
      height: 80px !important;
      padding: 8px 10px;
      background: transparent !important;
    }

    .mokda-header-bar {
      height: 64px !important;
      max-width: 1480px !important;
      padding: 0 14px !important;
      border: 1px solid rgba(248, 223, 196, 0.16);
      border-radius: 8px;
      background: rgba(50, 21, 6, 0.97);
      box-shadow: 0 10px 30px rgba(50, 21, 6, 0.12);
      backdrop-filter: blur(14px);
    }

    .mokda-header-bar a[aria-label="MOKDA home"] img {
      height: 28px !important;
      width: auto;
    }

    .mokda-header-bar #lang-selector {
      background: rgba(255, 248, 239, 0.96) !important;
    }

    .mokda-header-bar #menu-toggle {
      color: #f8dfc4 !important;
      background: rgba(248, 223, 196, 0.08) !important;
      border: 1px solid rgba(248, 223, 196, 0.2);
    }

    .mokda-desktop-nav {
      display: none;
    }

    .mokda-site-header #mobile-menu {
      top: 72px !important;
      left: 10px !important;
      width: calc(100% - 20px) !important;
      border: 1px solid rgba(50, 21, 6, 0.14) !important;
      border-radius: 0 0 8px 8px;
      background: rgba(255, 248, 239, 0.98) !important;
    }

    .mokda-site-header.is-scrolled .mokda-header-bar {
      box-shadow: 0 14px 36px rgba(50, 21, 6, 0.2);
    }

    @media (max-width: 479px) {
      .mokda-header-bar {
        padding: 0 10px !important;
      }

      .mokda-header-bar a[aria-label="MOKDA home"] img {
        height: 23px !important;
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
      .mokda-site-header {
        height: 96px !important;
        padding: 14px 18px;
      }

      .mokda-header-bar {
        height: 68px !important;
        padding: 0 28px !important;
      }

      .mokda-header-bar a[aria-label="MOKDA home"] img {
        height: 32px !important;
      }

      .mokda-desktop-nav {
        display: flex;
        min-width: 0;
        flex: 1;
        align-self: stretch;
        align-items: stretch;
        justify-content: center;
        margin: 0 28px;
        border-left: 1px solid rgba(248, 223, 196, 0.18);
      }

      .mokda-desktop-nav a {
        display: flex;
        min-width: 150px;
        align-items: center;
        justify-content: center;
        padding: 0 24px;
        border-right: 1px solid rgba(248, 223, 196, 0.18);
        color: rgba(255, 241, 223, 0.82);
        font-family: 'Archivo Black', 'Black Han Sans', 'Noto Sans KR', sans-serif;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0;
        line-height: 1.15;
        text-align: center;
        transition: color 240ms ease, background-color 240ms ease;
      }

      .mokda-desktop-nav a:hover,
      .mokda-desktop-nav a[aria-current="page"] {
        color: #ef5f18;
        background: rgba(248, 223, 196, 0.05);
      }

      .mokda-header-bar #menu-toggle,
      .mokda-site-header #mobile-menu {
        display: none !important;
      }
    }

    @media (min-width: 1024px) and (max-width: 1180px) {
      .mokda-desktop-nav {
        margin: 0 18px;
      }

      .mokda-desktop-nav a {
        min-width: 118px;
        padding: 0 14px;
        font-size: 12px;
      }
    }
  `;
  document.head.appendChild(style);

  header.classList.add('mokda-site-header');
  if (headerBar) headerBar.classList.add('mokda-header-bar');

  if (headerBar && sourceLinks.length) {
    const desktopNav = document.createElement('nav');
    desktopNav.className = 'mokda-desktop-nav';
    desktopNav.setAttribute('aria-label', 'Primary navigation');

    const desktopLinks = sourceLinks.map((sourceLink) => {
      const link = document.createElement('a');
      link.href = sourceLink.href;
      link.textContent = sourceLink.textContent.trim();
      desktopNav.appendChild(link);
      return link;
    });

    const controls = headerBar.lastElementChild;
    headerBar.insertBefore(desktopNav, controls || null);

    function syncDesktopLinks() {
      sourceLinks.forEach((sourceLink, index) => {
        const desktopLink = desktopLinks[index];
        if (!desktopLink) return;
        desktopLink.href = sourceLink.href;
        desktopLink.textContent = sourceLink.textContent.trim();
        const linkPath = new URL(desktopLink.href, window.location.href).pathname.replace(/\/index\.html$/, '/');
        const pagePath = window.location.pathname.replace(/\/index\.html$/, '/');
        if (linkPath === pagePath) desktopLink.setAttribute('aria-current', 'page');
        else desktopLink.removeAttribute('aria-current');
      });
    }

    syncDesktopLinks();
    const navObserver = new MutationObserver(syncDesktopLinks);
    sourceLinks.forEach((link) => navObserver.observe(link, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['href'] }));
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

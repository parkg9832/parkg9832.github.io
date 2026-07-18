(() => {
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!header) return;

  const initialTone = header.dataset.menuInitial === 'dark' ? 'dark' : 'light';

  function setMenuTone(tone) {
    if (!menuToggle) return;
    menuToggle.classList.remove('text-white', 'text-gray-800', 'bg-white/10', 'bg-neutral-950/5', 'ring-white/30', 'ring-neutral-950/10');
    if (tone === 'dark') {
      menuToggle.classList.add('text-gray-800', 'bg-neutral-950/5', 'ring-neutral-950/10');
      return;
    }
    menuToggle.classList.add('text-white', 'bg-white/10', 'ring-white/30');
  }

  function setHeaderScrolled(isScrolled) {
    if (isScrolled) {
      header.classList.remove('bg-transparent');
      header.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm');
      setMenuTone('dark');
      return;
    }

    header.classList.remove('bg-white', 'bg-white/90', 'backdrop-blur-md', 'shadow-sm');
    header.classList.add('bg-transparent');
    setMenuTone(initialTone);
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

    setMenuOpen(false);
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
})();

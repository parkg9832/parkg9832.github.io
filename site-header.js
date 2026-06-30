(() => {
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!header) return;

  const initialTone = header.dataset.menuInitial === 'dark' ? 'dark' : 'light';

  function setMenuTone(tone) {
    if (!menuToggle) return;
    menuToggle.classList.remove('text-white', 'text-gray-800');
    menuToggle.classList.add(tone === 'dark' ? 'text-gray-800' : 'text-white');
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
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('max-h-0');
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('invisible');
      mobileMenu.classList.toggle('max-h-40');
      mobileMenu.classList.toggle('opacity-100');
      mobileMenu.classList.toggle('visible');
    });
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
})();

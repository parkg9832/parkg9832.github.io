(() => {
  'use strict';
  const hero = document.getElementById('top');
  const media = hero?.querySelector('[data-hero-photos]');
  const photos = [...(media?.querySelectorAll('[data-hero-photo]') || [])];
  const toggle = hero?.querySelector('[data-hero-photos-toggle]');
  if (photos.length < 2 || !toggle || hero.dataset.heroPhotosBound) return;
  hero.dataset.heroPhotosBound = 'true';

  const reduced = window.MOKDA_MOTION_PREFERENCE || window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const labels = {
    KR: { pause: '사진 전환 일시정지', play: '사진 전환 재생' },
    ES: { pause: 'Pausar fotos', play: 'Reanudar fotos' },
    EN: { pause: 'Pause photos', play: 'Resume photos' },
  };
  const dwell = 4500, fade = 800, loads = new Map();
  let visible = false, pageHidden = false, userPaused = false, failed = false;
  let active = 0, epoch = 0, timer = null, pending = false;

  const staticOnly = () => reduced.matches || connection?.saveData === true;
  const eligible = () => visible && !document.hidden && !pageHidden && !userPaused && !failed && !staticOnly();

  function showPhoto(index) {
    photos.forEach((photo, i) => photo.classList.toggle('is-active', i === index));
    active = index;
  }

  function updateControl() {
    const language = window.MOKDA_I18N?.getLanguage() || 'ES';
    const text = (labels[language] || labels.ES)[userPaused ? 'play' : 'pause'];
    toggle.textContent = text;
    toggle.setAttribute('aria-label', text);
    toggle.hidden = staticOnly() || failed;
    media.dataset.photosRunning = String(eligible());
  }

  function suspend(reset = false) {
    // Invalidate decodes before they can reveal a photo after any pause.
    epoch++;
    window.clearTimeout(timer);
    timer = null;
    pending = false;
    media.dataset.photosRunning = 'false';
    if (reset) showPhoto(0);
    updateControl();
  }

  function loadPhoto(index) {
    if (loads.has(index)) return loads.get(index);
    const photo = photos[index], image = photo.querySelector('img');
    const promise = new Promise((resolve, reject) => {
      let settled = false;
      const finish = error => {
        if (settled) return;
        settled = true;
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', broken);
        if (error) reject(error);
        else resolve();
      };
      const loaded = () => finish();
      const broken = () => finish(new Error('Hero photo could not load'));
      image.addEventListener('error', broken);
      // Older browsers use load; decode() also waits for pixel readiness.
      if (typeof image.decode !== 'function') image.addEventListener('load', loaded);
      photo.querySelectorAll('source[data-srcset]').forEach(source => {
        source.setAttribute('srcset', source.dataset.srcset);
      });
      if (image.dataset.srcset) image.setAttribute('srcset', image.dataset.srcset);
      if (image.dataset.src) image.setAttribute('src', image.dataset.src);
      if (typeof image.decode === 'function') {
        try { Promise.resolve(image.decode()).then(() => finish(), broken); }
        catch { broken(); }
      } else if (image.complete && image.naturalWidth > 0) finish();
    });
    loads.set(index, promise);
    return promise;
  }

  function schedule(delay) {
    timer = window.setTimeout(() => {
      timer = null;
      if (!eligible()) { reconcile(); return; }
      const attempt = ++epoch, next = (active + 1) % photos.length;
      pending = true;
      // Only the upcoming photo is promoted, after the current dwell finishes.
      loadPhoto(next).then(() => {
        if (attempt !== epoch || !eligible()) return;
        pending = false;
        showPhoto(next);
        schedule(dwell + fade);
      }, () => {
        if (attempt !== epoch) return;
        failed = true;
        reconcile();
      });
    }, delay);
  }

  function reconcile() {
    if (!eligible()) { suspend(staticOnly()); return; }
    updateControl();
    if (timer === null && !pending) schedule(dwell);
  }

  toggle.addEventListener('click', () => { userPaused = !userPaused; reconcile(); });
  document.addEventListener('visibilitychange', reconcile);
  window.addEventListener('pagehide', () => { pageHidden = true; suspend(); });
  window.addEventListener('pageshow', () => { pageHidden = false; measureVisibility(); });

  function measureVisibility() {
    const rect = hero.getBoundingClientRect();
    visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    reconcile();
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.target === hero);
      if (!entry) return;
      visible = entry.isIntersecting;
      reconcile();
    }, { threshold: [0, 0.05] });
    observer.observe(hero);
  } else {
    let queued = false;
    const queueVisibility = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => { queued = false; measureVisibility(); });
    };
    window.addEventListener('scroll', queueVisibility, { passive: true });
    window.addEventListener('resize', queueVisibility, { passive: true });
    measureVisibility();
  }
  if (reduced.addEventListener) reduced.addEventListener('change', reconcile);
  else reduced.addListener?.(reconcile);
  connection?.addEventListener?.('change', reconcile);
  updateControl();
})();

(() => {
  'use strict';
  const hero = document.getElementById('top');
  const video = hero?.querySelector('[data-hero-video]');
  const media = hero?.querySelector('[data-hero-media]');
  const toggle = hero?.querySelector('[data-hero-video-toggle]');
  if (!video || !media || !toggle || hero.dataset.heroVideoBound) return;
  hero.dataset.heroVideoBound = 'true';

  const reduced = window.MOKDA_MOTION_PREFERENCE || window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 767px)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const labels = {
    KR: { pause: '영상 일시정지', play: '영상 재생' },
    ES: { pause: 'Pausar video', play: 'Reproducir video' },
    EN: { pause: 'Pause video', play: 'Play video' },
  };
  let visible = false, pageHidden = false, userPaused = false, autoplayBlocked = false, failed = false;
  let playing = false, frameReady = false, source = '', epoch = 0, pending = null;

  const staticOnly = () => reduced.matches || connection?.saveData === true;
  const eligible = () => visible && !document.hidden && !pageHidden && !userPaused && !autoplayBlocked && !failed && !staticOnly();
  const desiredSource = () => compact.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;

  function updateControl() {
    const language = window.MOKDA_I18N?.getLanguage() || 'ES';
    const text = (labels[language] || labels.ES)[playing || pending ? 'pause' : 'play'];
    toggle.textContent = text;
    toggle.setAttribute('aria-label', text);
    toggle.hidden = staticOnly() || failed;
    media.dataset.videoState = frameReady ? (playing ? 'playing' : 'paused') : 'poster';
  }

  function stop(release = false) {
    epoch++;
    pending = null;
    playing = false;
    video.pause();
    if (release) {
      frameReady = false;
      source = '';
      if (video.hasAttribute('src')) {
        video.removeAttribute('src');
        video.load();
      }
    }
    updateControl();
  }

  function playbackFailed(attempt) {
    if (attempt.epoch !== epoch) return;
    pending = null;
    autoplayBlocked = true;
    frameReady = false;
    stop();
  }

  function reconcile() {
    if (staticOnly() || failed) { stop(true); return; }
    if (!eligible()) { stop(); return; }
    const nextSource = desiredSource();
    if (!nextSource) { failed = true; stop(true); return; }
    if (source && source !== nextSource) stop(true);
    if (pending || playing) { updateControl(); return; }
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    if (source !== nextSource) {
      source = nextSource;
      video.setAttribute('src', source);
      video.load();
    }
    const attempt = { epoch: ++epoch };
    pending = attempt;
    updateControl();
    try {
      Promise.resolve(video.play()).then(() => {
        // A late autoplay result must never undo a user pause or page suspension.
        if (attempt.epoch !== epoch) {
          if (!eligible()) video.pause();
          return;
        }
        pending = null;
        if (!eligible()) { stop(); return; }
        frameReady = true;
        playing = true;
        updateControl();
      }, () => playbackFailed(attempt));
    } catch {
      playbackFailed(attempt);
    }
  }

  video.addEventListener('playing', () => {
    if (!eligible()) { stop(); return; }
    frameReady = true;
    playing = true;
    updateControl();
  });
  video.addEventListener('pause', () => { playing = false; updateControl(); });
  video.addEventListener('error', () => { failed = true; stop(true); });
  toggle.addEventListener('click', () => {
    if (userPaused || autoplayBlocked || (!playing && !pending)) {
      userPaused = false;
      autoplayBlocked = false;
    } else userPaused = true;
    reconcile();
  });
  document.addEventListener('visibilitychange', reconcile);
  window.addEventListener('pagehide', () => { pageHidden = true; stop(); });
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
    // Older browsers still pause once the opening leaves the screen.
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
  function watch(query, callback) {
    if (query.addEventListener) query.addEventListener('change', callback);
    else query.addListener?.(callback);
  }
  watch(reduced, reconcile);
  watch(compact, reconcile);
  connection?.addEventListener?.('change', reconcile);
  updateControl();
})();

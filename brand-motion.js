/* Motion enhances already visible HTML; search and keyboard access never depend on it. */
(() => {
  const reduced = window.MOKDA_MOTION_PREFERENCE || (window.MOKDA_MOTION_PREFERENCE = matchMedia('(prefers-reduced-motion: reduce)'));
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const compact = matchMedia('(max-width: 767px)');
  const photoReveal = { crop: 12, duration: 580, stagger: 65 };
  const homeGroups = [
    ['.home-products-heading', { distance:12 }],
    ['.home-product-image', photoReveal],
    ['.home-product-copy', { distance:10, stagger:65 }],
    ['.home-history-heading', { distance:12 }],
    ['.home-history-milestones li', { distance:9, stagger:55 }],
    ['#voicesList .voice-entry', { distance:10, stagger:65 }],
    ['.home-news-heading', { distance:12 }],
    ['.home-news-lead .news-card-image', photoReveal],
    ['.home-news-supporting .news-card', { distance:10 }],
    ['.home-faq-heading, .home-faq-reading', { distance:8, duration:380 }],
    ['#contact [data-reveal]:not(a)', { distance:8, duration:400 }],
    ['#socialTitle', { distance:6, duration:360 }],
  ];
  const groups = {
    'home-page': homeGroups,
    'about-page': [
      ['.about-chapter-heading', {}],
      ['#storyBody, #ingredientsBody, #motiveBody', { distance:14, opacity:.65, delay:80 }],
      ['.about-story-figure, .about-ingredients-figure, #identity figure', { distance:24, opacity:.75, duration:640 }],
      ['.about-history-year', { distance:14, opacity:.65 }],
      ['#products-transition > div', {}],
    ],
    'products-page': [
      ['.product-introduction > #pageKicker', { distance:12, opacity:.6, duration:480 }],
      ['.product-introduction > #pageTitle', { delay:60, duration:640 }],
      ['.product-introduction > #pageSubtitle', { distance:14, opacity:.65, delay:140 }],
      ['.product-introduction > #pageSlogan', { distance:12, opacity:.65, delay:200 }],
      ['.product-feature > .product-food-only', { distance:24, opacity:.75, duration:640 }],
      ['.product-feature > .product-feature-copy', { delay:80 }],
    ],
    'qna-page': [
      ['.qna-opening #pageKicker', { distance:12, opacity:.6, duration:480 }],
      ['.qna-opening #pageTitle', { delay:60, duration:640 }],
      ['.qna-opening #pageDescription', { distance:14, opacity:.65, delay:140 }],
      ['.qna-reading-item', { distance:14, opacity:.65 }],
      ['.qna-reading [data-reveal]:last-child', { distance:12, opacity:.65 }],
    ],
    'product-detail-page': [
      ['.detail-image-sequence .detail-artwork, .detail-localized-photo', { distance:20, opacity:.75, duration:640 }],
      ['.detail-localized-introduction', { delay:80 }],
      ['.detail-localized-features > article', { distance:14, opacity:.65, stagger:80 }],
      ['.detail-localized-information, .detail-localized-story', { distance:14, opacity:.65 }],
      ['.detail-original-brochure > summary', { distance:12, opacity:.7 }],
      ['.detail-inquiry > div', {}],
    ],
    'news-page': [
      ['.news-page-heading', {}],
      ['.news-listing .news-archive-row', { distance:14, opacity:.65 }],
      ['.news-article-heading > .news-kicker', { distance:12, opacity:.6, duration:480 }],
      ['.news-article-heading > h1', { delay:60, duration:640 }],
      ['.news-article-lead', { distance:14, opacity:.65, delay:140 }],
      ['.news-article-cover:not(.is-video-cover)', { distance:20, opacity:.75, duration:640 }],
      ['.news-article-body > p', { distance:12, opacity:.7, duration:500 }],
      ['.news-sources', { distance:8, opacity:.75, duration:480 }],
      ['.news-gallery > header', { distance:12, opacity:.65 }],
      ['.news-gallery-rail', { distance:14, opacity:.75 }],
      ['.news-creators-heading > div:first-child', {}],
    ],
    'contact-page': [
      ['#pageDescription', { distance:8, opacity:1, duration:360 }],
    ],
  };
  const profiles = new Map();
  const isHome = document.body.classList.contains('home-page');
  const pageGroups = Object.entries(groups)
    .filter(([page]) => document.body.classList.contains(page))
    .flatMap(([, targets]) => targets);
  pageGroups.forEach(([target, profile]) => {
    document.querySelectorAll(target).forEach((node, index) => {
      // Keep restoration, deep links and fast first paints from changing content already in view.
      const bounds = node.getBoundingClientRect();
      if (isHome && bounds.top < innerHeight && bounds.bottom > 0) return;
      profiles.set(node, { distance:18, opacity:isHome ? .9 : .45, duration:isHome ? 440 : 560, delay:0,
        ...profile, index });
    });
  });
  if (!profiles.size) return;
  const animations = new Set();
  const activeTargets = new Map();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches || document.body.classList.contains('motion-paused')) continue;
      const focused = document.activeElement;
      if (focused !== document.body && (entry.target.contains(focused) || focused?.contains(entry.target))) continue;
      const profile = profiles.get(entry.target);
      const small = compact.matches;
      const distance = profile.distance * (small ? .65 : 1);
      const duration = profile.duration * (small ? .8 : 1);
      const delay = profile.delay + (small ? 0 : (profile.stagger || 0) * Math.min(profile.index, 2));
      const crop = profile.crop * (small ? .65 : 1);
      const frames = profile.crop
        ? [{ clipPath: `inset(0 0 0 ${crop}%)` }, { clipPath: 'inset(0)' }]
        : [{ opacity: profile.opacity, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'translateY(0)' }];
      const animation = entry.target.animate(frames, {
        duration, delay, fill:'backwards', easing: 'cubic-bezier(.22,1,.36,1)',
      });
      animations.add(animation);
      activeTargets.set(entry.target, animation);
      animation.onfinish = animation.oncancel = () => {
        animations.delete(animation);
        activeTargets.delete(entry.target);
      };
    }
  }, { threshold: .03, rootMargin: isHome ? '0px 0px -6% 0px' : '0px 0px -20px 0px' });
  profiles.forEach((_, node) => observer.observe(node));

  const milestones = document.querySelectorAll('.about-history-year');
  const reading = milestones.length ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-reading', entry.isIntersecting));
  }, { rootMargin: '-25% 0px -40% 0px', threshold: 0 }) : null;
  milestones.forEach(node => reading.observe(node));
  // A focused link settles immediately so keyboard interaction never moves away.
  document.addEventListener('focusin', event => {
    activeTargets.forEach((animation, node) => {
      if (node.contains(event.target) || event.target.contains(node)) animation.cancel();
    });
  });

  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    reading?.disconnect();
    milestones.forEach(node => node.classList.remove('is-reading'));
    animations.forEach(animation => animation.cancel());
    animations.clear();
    activeTargets.clear();
  });
})();

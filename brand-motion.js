/* Motion enhances already visible HTML; search and keyboard access never depend on it. */
(() => {
  const reduced = window.MOKDA_MOTION_PREFERENCE || (window.MOKDA_MOTION_PREFERENCE = matchMedia('(prefers-reduced-motion: reduce)'));
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const compact = matchMedia('(max-width: 767px)');
  const homeGroups = [
    ['[data-hero-kicker]', { distance:12, opacity:.45, duration:480 }],
    ['[data-hero-title]', { distance:20, opacity:.3, duration:640, delay:60 }],
    ['[data-hero-subtitle]', { distance:16, opacity:.45, duration:560, delay:140 }],
    ['[data-hero-link]', { distance:12, opacity:.65, duration:480, delay:220 }],
    ['.home-products-heading', {}],
    ['.home-product-panel', { distance:24, opacity:.7, duration:640, stagger:80 }],
    ['#productsPageCta', { distance:12, duration:480 }],
    ['.home-history-heading', {}],
    ['.home-history-milestones', { delay:80 }],
    ['#proofHistoryCta', { distance:12, duration:480, delay:140 }],
    ['#voicesList', {}],
    ['.home-trial-reviews', { distance:20, opacity:.75, duration:640 }],
    ['.home-news-heading', {}],
    ['#home-news .news-card', { distance:24, opacity:.7, duration:640, stagger:80 }],
    ['#faq > div > div:first-child', {}],
    ['#homeFaqList', { distance:16, opacity:.65, delay:80 }],
    ['#contact [data-reveal]', { stagger:100 }],
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
      ['#pageKicker', { distance:12, opacity:.6, duration:480 }],
      ['#pageTitle', { delay:60, duration:640 }],
      ['#pageDescription', { distance:14, opacity:.65, delay:140 }],
    ],
  };
  const profiles = new Map();
  const pageGroups = Object.entries(groups)
    .filter(([page]) => document.body.classList.contains(page))
    .flatMap(([, targets]) => targets);
  pageGroups.forEach(([target, profile]) => {
    document.querySelectorAll(target).forEach((node, index) => {
      profiles.set(node, { distance:18, opacity:.45, duration:560, delay:0,
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
      if (entry.target.contains(document.activeElement)) continue;
      const profile = profiles.get(entry.target);
      const small = compact.matches;
      const distance = profile.distance * (small ? .65 : 1);
      const duration = profile.duration * (small ? .8 : 1);
      const delay = profile.delay + (small ? 0 : (profile.stagger || 0) * Math.min(profile.index, 2));
      const animation = entry.target.animate(
        [{ opacity: profile.opacity, transform: `translateY(${distance}px)` },
          { opacity: 1, transform: 'translateY(0)' }],
        { duration, delay, fill:'backwards', easing: 'cubic-bezier(.22,1,.36,1)' },
      );
      animations.add(animation);
      activeTargets.set(entry.target, animation);
      animation.onfinish = animation.oncancel = () => {
        animations.delete(animation);
        activeTargets.delete(entry.target);
      };
    }
  }, { threshold: .03, rootMargin: '0px 0px -20px 0px' });
  profiles.forEach((_, node) => observer.observe(node));

  const milestones = document.querySelectorAll('.about-history-year');
  const reading = milestones.length ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-reading', entry.isIntersecting));
  }, { rootMargin: '-25% 0px -40% 0px', threshold: 0 }) : null;
  milestones.forEach(node => reading.observe(node));
  // A focused link settles immediately so keyboard interaction never moves away.
  document.addEventListener('focusin', event => {
    activeTargets.forEach((animation, node) => {
      if (node.contains(event.target)) animation.cancel();
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

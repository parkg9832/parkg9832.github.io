/* Motion enhances already visible HTML; search and keyboard access never depend on it. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const groups = {
    'home-page': [
      '[data-hero-kicker]', '[data-hero-title]', '.hero-copy',
      '.home-products-heading', '.home-product-panel',
      '#proof>div>div:first-child', '#proofCarouselTrack>figure',
      '#voicesTitle', '.voice-entry', '.home-faq-reading', '#contact>div',
    ],
    'about-page': [
      '.about-opening-copy', '.about-opening-photo', '#storyTitle', '#storyBody',
      '.about-story-figure', '#identity figure', '#motiveBody', '#historyTitle',
      '.about-history-photo', '#products-transition>div',
    ],
    'products-page': ['.product-opening>div>div:first-child', '.product-feature>div'],
    'qna-page': ['.qna-opening [data-reveal]', '.qna-reading-item'],
    'product-detail-page': ['.detail-artwork', '.detail-inquiry>div'],
  };
  const selector = Object.entries(groups)
    .filter(([page]) => document.body.classList.contains(page))
    .flatMap(([, targets]) => targets)
    .join(',');
  if (!selector) return;

  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches || document.body.classList.contains('motion-paused')) continue;
      const photo = entry.target.matches('figure,.home-product-panel,.about-opening-photo');
      const animation = entry.target.animate(
        [{ opacity: photo ? .78 : .88, transform: `translateY(${photo ? 14 : 8}px)` },
          { opacity: 1, transform: 'translateY(0)' }],
        { duration: photo ? 580 : 420, easing: 'cubic-bezier(.22,1,.36,1)' },
      );
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
    }
  }, { threshold: .03, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll(selector).forEach(node => observer.observe(node));

  const milestones = document.querySelectorAll('.about-timeline-item');
  const reading = milestones.length ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-reading', entry.isIntersecting));
  }, { rootMargin: '-25% 0px -40% 0px', threshold: 0 }) : null;
  milestones.forEach(node => reading.observe(node));

  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    reading?.disconnect();
    milestones.forEach(node => node.classList.remove('is-reading'));
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();

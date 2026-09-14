/* Visible by default: animation never gates access to a paragraph, picture or link. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const groups = document.body.classList.contains('home-page')
    ? ['.home-products-heading', '.home-product-panel', '#proof>div>div:first-child', '#proofCarouselTrack>figure', '#voicesTitle', '.voice-entry', '.home-faq-reading', '#contact>div']
    : document.body.classList.contains('about-page')
      ? ['.about-opening-copy', '.about-opening-photo', '#storyTitle', '#storyBody', '.about-story-figure', '#identity figure', '#motiveBody', '#historyTitle', '.about-history-photo', '#products-transition>div']
      : document.body.classList.contains('products-page')
        ? ['.product-opening>div>div:first-child', '.product-feature>div']
        : ['.qna-opening [data-reveal]', '.qna-reading-item'];
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches) continue;
      const photo = entry.target.matches('figure,.home-product-panel');
      const animation = entry.target.animate(
        [{opacity:.7,transform:`translateY(${photo ? 16 : 10}px)`},{opacity:1,transform:'translateY(0)'}],
        {duration:photo ? 600 : 450,easing:'cubic-bezier(.22,1,.36,1)'}
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    }
  }, {threshold:.03,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll(groups.join(',')).forEach(node => observer.observe(node));
  // Emphasize the milestone currently being read without moving the timeline.
  const milestones = document.querySelectorAll('.about-timeline-item');
  const reading = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-reading', entry.isIntersecting));
  }, {rootMargin:'-25% 0px -40% 0px', threshold:0});
  milestones.forEach(node => reading.observe(node));
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    reading.disconnect();
    milestones.forEach(node => node.classList.remove('is-reading'));
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();

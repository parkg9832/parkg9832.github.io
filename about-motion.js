/* Only photographs move slightly with reading progress; no autoplay or extra controls. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const frames = [...document.querySelectorAll('#top')];
  let pending = 0;
  function paint() {
    pending = 0;
    if (reducedMotion.matches) return;
    const viewport = window.innerHeight;
    frames.forEach((frame) => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const progress = (viewport / 2 - rect.top - rect.height / 2) / viewport;
      frame.style.setProperty('--photo-shift', `${Math.max(-12, Math.min(12, progress * 24)).toFixed(2)}px`);
    });
  }
  function schedule() {
    if (!pending && !reducedMotion.matches) pending = requestAnimationFrame(paint);
  }
  reducedMotion.addEventListener('change', () => {
    frames.forEach((frame) => frame.style.removeProperty('--photo-shift'));
    schedule();
  });
  window.addEventListener('scroll', schedule, { passive:true });
  window.addEventListener('resize', schedule, { passive:true });
  schedule();
})();

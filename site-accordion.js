(function () {
  function init(root, options) {
    if (!root) return;

    const settings = Object.assign(
      {
        itemSelector: '[data-accordion-item]',
        buttonSelector: '[data-accordion-button]',
        openClass: 'is-open',
        single: true,
      },
      options || {}
    );

    const items = Array.from(root.querySelectorAll(settings.itemSelector));

    function setOpen(item, open) {
      const button = item.querySelector(settings.buttonSelector);
      if (!button) return;
      item.classList.toggle(settings.openClass, open);
      button.setAttribute('aria-expanded', String(open));

      const panelId = button.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.setAttribute('aria-hidden', String(!open));
    }

    items.forEach((item) => {
      const button = item.querySelector(settings.buttonSelector);
      if (!button || button.dataset.accordionBound === 'true') return;

      button.dataset.accordionBound = 'true';
      setOpen(item, item.classList.contains(settings.openClass));
      button.addEventListener('click', () => {
        const willOpen = !item.classList.contains(settings.openClass);
        if (settings.single) items.forEach((otherItem) => setOpen(otherItem, false));
        if (willOpen) setOpen(item, true);
      });
    });
  }

  window.MOKDA_ACCORDION = { init };
})();

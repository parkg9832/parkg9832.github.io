(() => {
  'use strict';

  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const supportStorageKey = 'mokda_demand_support_v1';
  const dismissedStorageKey = 'mokda_support_popup_dismissed_at_v1';
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const params = new URLSearchParams(window.location.search);
  const forcePopup = params.get('support_popup') === '1';
  const copy = {
    KR: {
      action: 'Salsa Coreana 출시 응원하기',
      close: '응원 캠페인 닫기',
      image: 'ko',
    },
    ES: {
      action: 'Apoyar el lanzamiento de Salsa Coreana',
      close: 'Cerrar campaña de apoyo',
      image: 'es',
    },
    EN: {
      action: 'Support the Salsa Coreana launch',
      close: 'Close support campaign',
      image: 'en',
    },
  };
  const t = copy[language] || copy.ES;

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  if (!forcePopup) {
    if (readStorage(supportStorageKey)) return;
    const dismissedAt = Number(readStorage(dismissedStorageKey) || 0);
    if (dismissedAt && Date.now() - dismissedAt < sevenDays) return;
  }

  const languagePath = { ES: 'es', KR: 'ko', EN: 'en' }[language] || 'es';
  const supportQuery = new URLSearchParams(window.location.search);
  supportQuery.delete('support_popup');
  const supportHref = `/${languagePath}/support.html${supportQuery.size ? `?${supportQuery}` : ''}`;
  const desktopImage = `/assets/images/support-popup-${t.image}-2026.webp`;
  const mobileImage = `/assets/images/support-popup-${t.image}-2026-mobile.webp`;

  const dialog = document.createElement('dialog');
  dialog.className = 'mokda-announcement';
  dialog.setAttribute('aria-label', t.action);
  dialog.innerHTML = `
    <article class="mokda-announcement__card">
      <a class="mokda-announcement__poster" href="${supportHref}" aria-label="${t.action}">
        <picture>
          <source media="(max-width: 640px)" srcset="${mobileImage}" />
          <img src="${desktopImage}" alt="" width="1200" height="720" />
        </picture>
      </a>
      <button class="mokda-announcement__close" type="button" aria-label="${t.close}" data-announcement-close>&times;</button>
    </article>
  `;

  function closeDialog() {
    try {
      window.localStorage.setItem(dismissedStorageKey, String(Date.now()));
    } catch (error) {
      // The dialog can still close when storage is unavailable.
    }

    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  dialog.querySelector('[data-announcement-close]')?.addEventListener('click', closeDialog);
  dialog.querySelector('.mokda-announcement__poster')?.addEventListener('click', () => {
    window.MOKDA_ANALYTICS?.track(
      'support_popup_cta',
      { element: 'support_popup_poster' },
      { immediate: true },
    );
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });

  document.body.appendChild(dialog);
  window.setTimeout(() => {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    window.MOKDA_ANALYTICS?.track('support_popup_view', { element: 'support_popup_poster' });
    dialog.querySelector('.mokda-announcement__poster')?.focus();
  }, 520);
})();

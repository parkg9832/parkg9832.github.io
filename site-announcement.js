(() => {
  'use strict';

  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const hiddenUntilKey = 'mokda_support_popup_hidden_until_v3';
  const oneDay = 24 * 60 * 60 * 1000;
  const params = new URLSearchParams(window.location.search);
  const forcePopup = params.get('support_popup') === '1';
  const copy = {
    KR: {
      badge: '첫 출시 응원 프로젝트',
      title: 'Salsa Coreana의 출시를 도와주세요!',
      lead: '라틴아메리카에서 MOKDA를 만나고 싶다면 지금 응원을 남겨주세요.',
      action: '응원하기',
      close: '응원 캠페인 닫기',
      hideToday: '오늘 하루 보지 않기',
    },
    ES: {
      badge: 'Proyecto de primer lanzamiento',
      title: 'Ayúdanos a lanzar Salsa Coreana',
      lead: 'Tu apoyo puede acercar MOKDA a más países de Latinoamérica.',
      action: 'Quiero apoyar',
      close: 'Cerrar campaña de apoyo',
      hideToday: 'No mostrar durante 24 horas',
    },
    EN: {
      badge: 'First launch project',
      title: 'Help us launch Salsa Coreana',
      lead: 'Your support can bring MOKDA closer to more Latin American markets.',
      action: 'Support the launch',
      close: 'Close support campaign',
      hideToday: 'Do not show for 24 hours',
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

  const hiddenUntil = Number(readStorage(hiddenUntilKey) || 0);
  if (!forcePopup && hiddenUntil > Date.now()) return;

  const languagePath = { ES: 'es', KR: 'ko', EN: 'en' }[language] || 'es';
  const supportQuery = new URLSearchParams(window.location.search);
  supportQuery.delete('support_popup');
  const supportHref = `/${languagePath}/support.html${supportQuery.size ? `?${supportQuery}` : ''}`;

  const dialog = document.createElement('dialog');
  dialog.className = 'mokda-announcement';
  dialog.setAttribute('aria-labelledby', 'mokdaAnnouncementTitle');
  dialog.innerHTML = `
    <article class="mokda-announcement__card">
      <button class="mokda-announcement__close" type="button" aria-label="${t.close}" data-announcement-close>&times;</button>
      <div class="mokda-announcement__visual" aria-hidden="true">
        <span class="mokda-announcement__brand">MOKDA</span>
        <div class="mokda-announcement__visual-copy">
          <small>FIRST LAUNCH · 2026</small>
          <strong>Salsa<br />Coreana</strong>
        </div>
      </div>
      <div class="mokda-announcement__content">
        <p class="mokda-announcement__badge">${t.badge}</p>
        <h2 class="mokda-announcement__title" id="mokdaAnnouncementTitle">${t.title}</h2>
        <p class="mokda-announcement__lead">${t.lead}</p>
        <a class="mokda-announcement__button" href="${supportHref}" aria-label="${t.action}">
          <span>${t.action}</span>
          <span aria-hidden="true">→</span>
        </a>
        <div class="mokda-announcement__footer">
          <button class="mokda-announcement__hide-day" type="button" data-announcement-hide-day>
            ${t.hideToday}
          </button>
        </div>
      </div>
    </article>
  `;

  function closeDialog() {
    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  function hideForDay() {
    try {
      window.localStorage.setItem(hiddenUntilKey, String(Date.now() + oneDay));
    } catch (error) {
      // The dialog can still close when storage is unavailable.
    }
    window.MOKDA_ANALYTICS?.track('support_popup_hide_day', { element: 'support_popup_hide_day' });
    closeDialog();
  }

  dialog.querySelector('[data-announcement-close]')?.addEventListener('click', closeDialog);
  dialog.querySelector('[data-announcement-hide-day]')?.addEventListener('click', hideForDay);
  dialog.querySelector('.mokda-announcement__button')?.addEventListener('click', () => {
    window.MOKDA_ANALYTICS?.track(
      'support_popup_cta',
      { element: 'support_popup_primary' },
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
    window.MOKDA_ANALYTICS?.track('support_popup_view', { element: 'support_popup_compact' });
    dialog.querySelector('.mokda-announcement__button')?.focus();
  }, 520);
})();

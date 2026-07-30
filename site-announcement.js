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
      eyebrow: 'MOKDA DREAM PROJECT · 2026',
      title: 'Salsa Coreana의 출시를 도와주세요!',
      lead: '당신의 한 번의 응원이 MOKDA의 첫 라틴아메리카 출시를 현실로 만듭니다.',
      note: '이름과 원하는 출시 국가만 선택하면 끝나요.',
      cta: '응원하기',
      closeLabel: '응원 캠페인 닫기',
      imageAlt: '하트처럼 흐르는 Salsa Coreana 소스',
    },
    ES: {
      eyebrow: 'MOKDA DREAM PROJECT · 2026',
      title: '¡Ayúdanos a lanzar Salsa Coreana!',
      lead: 'Tu apoyo puede convertir el primer lanzamiento de MOKDA en Latinoamérica en una realidad.',
      note: 'Solo elige tu nombre y el país donde quieres encontrarla.',
      cta: 'Apoyar',
      closeLabel: 'Cerrar campaña de apoyo',
      imageAlt: 'Salsa Coreana formando un gesto de corazón',
    },
    EN: {
      eyebrow: 'MOKDA DREAM PROJECT · 2026',
      title: 'Help us launch Salsa Coreana!',
      lead: 'One simple show of support can help make MOKDA’s first Latin American launch real.',
      note: 'Just add your name and choose where you want to find it.',
      cta: 'Support',
      closeLabel: 'Close support campaign',
      imageAlt: 'Salsa Coreana flowing into a heart-like gesture',
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

  const dialog = document.createElement('dialog');
  dialog.className = 'mokda-announcement';
  dialog.setAttribute('aria-labelledby', 'mokdaAnnouncementTitle');
  dialog.innerHTML = `
    <article class="mokda-announcement__card">
      <div class="mokda-announcement__visual">
        <img
          class="mokda-announcement__image"
          src="/assets/images/salsa-coreana-support-campaign-2026.webp"
          alt="${t.imageAlt}"
          width="1122"
          height="1402"
        />
        <span class="mokda-announcement__brand">MOKDA</span>
        <span class="mokda-announcement__badge">THE FIRST SUPPORT</span>
      </div>
      <div class="mokda-announcement__content">
        <button class="mokda-announcement__close" type="button" aria-label="${t.closeLabel}" data-announcement-close>&times;</button>
        <p class="mokda-announcement__eyebrow">${t.eyebrow}</p>
        <h2 class="mokda-announcement__title" id="mokdaAnnouncementTitle">${t.title}</h2>
        <p class="mokda-announcement__lead">${t.lead}</p>
        <div class="mokda-announcement__promise">
          <span aria-hidden="true">01</span>
          <p>${t.note}</p>
        </div>
        <a class="mokda-announcement__button" href="${supportHref}">
          <span>${t.cta}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
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
    window.MOKDA_ANALYTICS?.track('support_popup_view', { element: 'support_popup' });
    dialog.querySelector('.mokda-announcement__button')?.focus();
  }, 520);
})();

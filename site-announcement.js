(() => {
  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const content = {
    KR: {
      eyebrow: 'MOKDA · SEPTEMBER 2026',
      title: '새로운 맛의 시작.',
      lead: '2026년 9월, MOKDA의 시제품을 선보이고 페루에서 직접 인사드립니다.',
      productDate: '2026.09',
      productStatus: '출시 예정',
      productTitle: 'MOKDA 시제품 공개',
      expoDate: '09.23—25',
      expoStatus: '참가 확정 · PERÚ',
      expoTitle: 'Expoalimentaria Perú 2026',
      visualCaption: 'Korean flavor · Made for Latin America',
      close: '소식 확인했어요',
      closeLabel: '공지 닫기',
    },
    ES: {
      eyebrow: 'MOKDA · SEPTIEMBRE 2026',
      title: 'Un nuevo sabor comienza.',
      lead: 'En septiembre presentamos los prototipos de MOKDA y nos vemos en Perú.',
      productDate: '2026.09',
      productStatus: 'PRÓXIMAMENTE',
      productTitle: 'Presentación de prototipos MOKDA',
      expoDate: '23—25 SEP',
      expoStatus: 'PARTICIPACIÓN CONFIRMADA · PERÚ',
      expoTitle: 'Expoalimentaria Perú 2026',
      visualCaption: 'Sabor coreano · Hecho para Latinoamérica',
      close: 'Listo',
      closeLabel: 'Cerrar anuncio',
    },
    EN: {
      eyebrow: 'MOKDA · SEPTEMBER 2026',
      title: 'A new flavor begins.',
      lead: 'This September, we unveil MOKDA prototypes and meet you in Peru.',
      productDate: 'SEP 2026',
      productStatus: 'COMING SOON',
      productTitle: 'MOKDA prototype reveal',
      expoDate: 'SEP 23—25',
      expoStatus: 'PARTICIPATION CONFIRMED · PERU',
      expoTitle: 'Expoalimentaria Perú 2026',
      visualCaption: 'Korean flavor · Made for Latin America',
      close: 'Got it',
      closeLabel: 'Close announcement',
    },
  };
  const t = content[language] || content.ES;

  const dialog = document.createElement('dialog');
  dialog.className = 'mokda-announcement';
  dialog.setAttribute('aria-labelledby', 'mokdaAnnouncementTitle');
  dialog.innerHTML = `
    <div class="mokda-announcement__layout">
      <div class="mokda-announcement__visual" aria-hidden="true">
        <img class="mokda-announcement__image" src="${new URL('./assets/images/announcement-editorial-2026.webp', document.baseURI).href}" alt="" />
        <span class="mokda-announcement__brand">MOKDA</span>
        <p class="mokda-announcement__visual-caption">${t.visualCaption}</p>
      </div>
      <div class="mokda-announcement__content">
        <button class="mokda-announcement__close" type="button" aria-label="${t.closeLabel}" data-announcement-close>&times;</button>
        <p class="mokda-announcement__eyebrow">${t.eyebrow}</p>
        <h2 class="mokda-announcement__title" id="mokdaAnnouncementTitle">${t.title}</h2>
        <p class="mokda-announcement__lead">${t.lead}</p>
        <div class="mokda-announcement__timeline">
          <article class="mokda-announcement__event">
            <time class="mokda-announcement__date" datetime="2026-09">${t.productDate}</time>
            <div class="mokda-announcement__event-copy">
              <span class="mokda-announcement__status">${t.productStatus}</span>
              <h3>${t.productTitle}</h3>
            </div>
          </article>
          <article class="mokda-announcement__event">
            <time class="mokda-announcement__date" datetime="2026-09-23">${t.expoDate}</time>
            <div class="mokda-announcement__event-copy">
              <span class="mokda-announcement__status">${t.expoStatus}</span>
              <h3>${t.expoTitle}</h3>
            </div>
          </article>
        </div>
        <button class="mokda-announcement__button" type="button" data-announcement-close>${t.close}</button>
      </div>
    </div>
  `;

  const closeDialog = () => {
    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
      return;
    }
    dialog.removeAttribute('open');
  };

  dialog.querySelectorAll('[data-announcement-close]').forEach((button) => {
    button.addEventListener('click', closeDialog);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.body.appendChild(dialog);
  window.setTimeout(() => {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    dialog.querySelector('.mokda-announcement__button')?.focus();
  }, 320);
})();

(() => {
  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const content = {
    KR: {
      eyebrow: 'MOKDA UPDATE · 2026',
      title: '곧 만나요.',
      lead: 'MOKDA의 다음 여정을 알려드립니다.',
      productLabel: 'PRODUCT',
      productDate: '2026.09',
      productStatus: '출시 예정',
      productTitle: 'MOKDA 시제품 출시 예정',
      expoLabel: 'PERÚ',
      expoDate: '09.23–25',
      expoStatus: '참가 확정',
      expoTitle: 'Expoalimentaria Perú 2026',
      close: '확인',
      closeLabel: '공지 닫기',
    },
    ES: {
      eyebrow: 'MOKDA UPDATE · 2026',
      title: 'Nos vemos pronto.',
      lead: 'Te compartimos los próximos pasos de MOKDA.',
      productLabel: 'PRODUCTO',
      productDate: '2026.09',
      productStatus: 'PRÓXIMAMENTE',
      productTitle: 'Lanzamiento de prototipos MOKDA',
      expoLabel: 'PERÚ',
      expoDate: '23–25 SEP',
      expoStatus: 'PARTICIPACIÓN CONFIRMADA',
      expoTitle: 'Expoalimentaria Perú 2026',
      close: 'Entendido',
      closeLabel: 'Cerrar anuncio',
    },
    EN: {
      eyebrow: 'MOKDA UPDATE · 2026',
      title: 'See you soon.',
      lead: 'Here are the next milestones for MOKDA.',
      productLabel: 'PRODUCT',
      productDate: '2026.09',
      productStatus: 'COMING SOON',
      productTitle: 'MOKDA prototype launch',
      expoLabel: 'PERU',
      expoDate: 'SEP 23–25',
      expoStatus: 'PARTICIPATION CONFIRMED',
      expoTitle: 'Expoalimentaria Perú 2026',
      close: 'Got it',
      closeLabel: 'Close announcement',
    },
  };
  const t = content[language] || content.ES;

  const dialog = document.createElement('dialog');
  dialog.className = 'mokda-announcement';
  dialog.setAttribute('aria-labelledby', 'mokdaAnnouncementTitle');
  dialog.innerHTML = `
    <div class="mokda-announcement__accent" aria-hidden="true"></div>
    <div class="mokda-announcement__inner">
      <button class="mokda-announcement__close" type="button" aria-label="${t.closeLabel}" data-announcement-close>&times;</button>
      <p class="mokda-announcement__eyebrow">${t.eyebrow}</p>
      <h2 class="mokda-announcement__title" id="mokdaAnnouncementTitle">${t.title}</h2>
      <p class="mokda-announcement__lead">${t.lead}</p>
      <div class="mokda-announcement__list">
        <article class="mokda-announcement__item">
          <div class="mokda-announcement__date">
            <span>${t.productLabel}</span>
            <strong>${t.productDate}</strong>
          </div>
          <div class="mokda-announcement__copy">
            <span class="mokda-announcement__status">${t.productStatus}</span>
            <h3>${t.productTitle}</h3>
          </div>
        </article>
        <article class="mokda-announcement__item">
          <div class="mokda-announcement__date">
            <span>${t.expoLabel}</span>
            <strong>${t.expoDate}</strong>
          </div>
          <div class="mokda-announcement__copy">
            <span class="mokda-announcement__status">${t.expoStatus}</span>
            <h3>${t.expoTitle}</h3>
          </div>
        </article>
      </div>
      <button class="mokda-announcement__button" type="button" data-announcement-close>${t.close}</button>
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

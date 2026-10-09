(() => {
  const FOOTER_COPY = {
    ES: {
      businessTitle: 'Información de la empresa',
      companyLabel: 'Empresa',
      company: 'MOKDA',
      ceoLabel: 'Representante',
      ceo: 'Gyeom Park',
      registrationLabel: 'Registro comercial',
      registration: '161-07-03392',
      addressLabel: 'Dirección',
      address: '44 Nambuk 10-gil, 2F, Gimje-si, Jeonbuk State, República de Corea',
      ipTitle: 'Propiedad intelectual',
      ip: 'El nombre de la marca, los nombres de los productos, los diseños de empaque y los materiales relacionados de MOKDA están en proceso de protección mediante marcas y otros derechos de propiedad intelectual.',
      navigationLabel: 'Explorar MOKDA',
      socialLabel: 'Redes sociales',
      navigation: [
        ['Inicio', ''],
        ['Nuestra historia', 'about.html'],
        ['Salsa Coreana', 'products.html'],
        ['Novedades MOKDA', 'news.html'],
        ['Preguntas frecuentes', 'qna.html'],
        ['Contacto', 'contact.html'],
      ],
      copyright: '© 2026 MOKDA. Todos los derechos reservados.',
    },
    EN: {
      businessTitle: 'Business Information',
      companyLabel: 'Company',
      company: 'MOKDA',
      ceoLabel: 'CEO',
      ceo: 'Gyeom Park',
      registrationLabel: 'Business Registration No.',
      registration: '161-07-03392',
      addressLabel: 'Address',
      address: '44 Nambuk 10-gil, 2F, Gimje-si, Jeonbuk State, Republic of Korea',
      ipTitle: 'Intellectual Property',
      ip: 'MOKDA’s brand name, product names, packaging designs, and related materials are undergoing trademark and intellectual property protection procedures.',
      navigationLabel: 'Explore MOKDA',
      socialLabel: 'Follow MOKDA',
      navigation: [
        ['Home', ''],
        ['Our story', 'about.html'],
        ['Salsa Coreana', 'products.html'],
        ['MOKDA Updates', 'news.html'],
        ['Frequently asked questions', 'qna.html'],
        ['Contact', 'contact.html'],
      ],
      copyright: '© 2026 MOKDA. All rights reserved.',
    },
    KR: {
      businessTitle: '회사 정보',
      companyLabel: '상호',
      company: 'MOKDA',
      ceoLabel: '대표',
      ceo: 'Gyeom Park',
      registrationLabel: '사업자등록번호',
      registration: '161-07-03392',
      addressLabel: '주소',
      address: '전북특별자치도 김제시 남북10길 44, 2층',
      ipTitle: '지식재산권',
      ip: 'MOKDA의 브랜드명, 제품명, 패키지 디자인 및 관련 자료는 상표권 및 지식재산권 보호 절차를 진행 중입니다.',
      navigationLabel: 'MOKDA 둘러보기',
      socialLabel: 'MOKDA SNS',
      navigation: [
        ['홈', ''],
        ['브랜드 소개', 'about.html'],
        ['Salsa Coreana', 'products.html'],
        ['MOKDA 소식', 'news.html'],
        ['자주 묻는 질문', 'qna.html'],
        ['문의', 'contact.html'],
      ],
      copyright: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  const SOCIAL_LINKS = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/mokda_official/',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle></svg>',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@salsa_coreana',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M16.55 3c.24 2.08 1.42 3.55 3.45 4.13v3.16a7.45 7.45 0 0 1-3.36-.86v5.91c0 3.48-2.31 5.66-5.63 5.66-3.03 0-5.01-1.88-5.01-4.72 0-3.12 2.42-4.95 5.77-4.62v3.22c-1.49-.27-2.42.29-2.42 1.31 0 .85.66 1.42 1.63 1.42 1.1 0 1.82-.69 1.82-2.17V3h3.75Z"></path></svg>',
    },
    {
      label: 'Threads',
      href: 'https://www.threads.com/@salsa_coreana',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.6 10.8c-.28-3.24-2.18-5.04-5.32-5.04-3.63 0-5.91 2.45-5.91 6.24 0 3.97 2.36 6.24 5.91 6.24 2.84 0 4.73-1.38 5.35-3.54.54-1.9-.64-3.34-2.86-3.51-2.17-.17-3.53.76-3.53 2.18 0 1.04.82 1.72 2.05 1.72 1.33 0 2.13-.72 2.13-1.85 0-2.28-2.21-3.69-5.13-3.24"></path><path d="M19.28 8.08C18.12 4.84 15.72 3 12.2 3 7.22 3 4 6.55 4 12s3.22 9 8.2 9c3.65 0 6.24-1.93 7.3-5.14"></path></svg>',
    },
  ];

  function normalizeLanguage(language) {
    return Object.hasOwn(FOOTER_COPY, language) ? language : 'ES';
  }

  const footerStyle = document.createElement('style');
  footerStyle.textContent = `
    #footerText .mokda-footer-social {
      margin-bottom: 28px;
      padding-bottom: 28px;
      border-bottom: 1px solid rgba(255, 248, 239, .14);
      text-align: center;
    }
    #footerText .mokda-footer-social p {
      margin: 0 0 16px;
      color: #ef8954;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    #footerText .mokda-footer-social-links { display: flex; justify-content: center; gap: 20px; }
    #footerText .mokda-footer-social-links a {
      display: inline-flex;
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;
      color: #fff8ef;
      transition: color 180ms ease;
    }
    #footerText .mokda-footer-social-links svg { width: 34px; height: 34px; }
    #footerText .mokda-footer-social-links a:hover { color: #ef8954; }
    #footerText :is(.mokda-footer-social-links, .mokda-footer-navigation) a:focus-visible {
      outline: 2px solid #ef8954;
      outline-offset: 4px;
    }
    #footerText .mokda-footer-legal {
      display: grid;
      grid-template-columns: minmax(0, 1.7fr) minmax(240px, 1fr);
      gap: 32px 72px;
      margin-top: 28px;
      padding-top: 28px;
      border-top: 1px solid rgba(255, 248, 239, .22);
      text-align: left;
    }
    #footerText .mokda-footer-legal h2 {
      margin: 0 0 14px;
      color: #ef8954;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.5;
      letter-spacing: .1em;
      text-transform: uppercase;
    }
    #footerText .mokda-footer-company {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, max-content));
      gap: 8px 24px;
      margin: 0;
    }
    #footerText .mokda-footer-company > div {
      display: flex;
      flex-wrap: wrap;
      gap: 0 7px;
      min-width: 0;
      color: rgba(255, 248, 239, .77);
      font-size: 12px;
      line-height: 1.75;
    }
    #footerText .mokda-footer-company > div:last-child { grid-column: 1 / -1; }
    #footerText .mokda-footer-company dt { color: rgba(255, 248, 239, .5); font-weight: 500; }
    #footerText .mokda-footer-company dd { margin: 0; overflow-wrap: anywhere; }
    #footerText .mokda-footer-ip p {
      max-width: 420px;
      margin: 0;
      color: rgba(255, 248, 239, .67);
      font-size: 12px;
      line-height: 1.75;
      word-break: keep-all;
    }
    #footerText .mokda-footer-copyright {
      margin: 26px 0 0;
      padding-top: 17px;
      border-top: 1px solid rgba(255, 248, 239, .12);
      color: rgba(255, 248, 239, .52);
      font-size: 11px;
      line-height: 1.5;
      text-align: left;
    }
    @media (max-width: 1100px) {
      #footerText .mokda-footer-legal { grid-template-columns: 1fr; gap: 25px; }
    }
    @media (max-width: 767px) {
      #footerText .mokda-footer-legal { grid-template-columns: 1fr; gap: 25px; margin-top: 24px; padding-top: 25px; }
      #footerText .mokda-footer-company { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 14px; }
      #footerText .mokda-footer-company > div:nth-child(n + 3) { grid-column: 1 / -1; }
      #footerText .mokda-footer-copyright { margin-top: 25px; }
    }
  `;
  document.head.appendChild(footerStyle);

  function render(language) {
    const element = document.getElementById('footerText');
    if (!element) return;

    const normalizedLanguage = normalizeLanguage(language);
    const footer = FOOTER_COPY[normalizedLanguage];
    const localizedPrefix = { ES: 'es', EN: 'en', KR: 'ko' }[normalizedLanguage];
    const routePrefix = window.location.pathname.match(/^\/(es|en|ko)(?:\/|$)/)?.[1] || localizedPrefix;
    const socialLinks = document.getElementById('socialBanner') ? '' : `
      <div class="mokda-footer-social">
        <p>${footer.socialLabel}</p>
        <div class="mokda-footer-social-links">
          ${SOCIAL_LINKS.map(({ label, href, icon }) => `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${icon}</a>`).join('')}
        </div>
      </div>
    `;
    const navigationLinks = footer.navigation
      .map(([label, route]) => {
        const href = route ? `/${routePrefix}/${route}` : `/${routePrefix}/`;
        return `<a class="flex min-h-9 items-center justify-center px-1 font-bold leading-5 text-white/76 transition hover:text-white focus:text-white sm:min-h-0 sm:px-0" href="${href}">${label}</a>`;
      })
      .join('');
    element.innerHTML = `
      <div class="text-center">
        ${socialLinks}
        <nav aria-label="${footer.navigationLabel}" class="mokda-footer-navigation grid grid-cols-2 gap-x-3 gap-y-1 py-2 text-[13px] sm:flex sm:flex-wrap sm:justify-center sm:gap-x-7 sm:gap-y-2 sm:py-4 sm:text-sm">
          ${navigationLinks}
        </nav>
        <div class="mokda-footer-legal">
          <section class="mokda-footer-business">
            <h2>${footer.businessTitle}</h2>
            <dl class="mokda-footer-company">
              <div>
                <dt>${footer.companyLabel}</dt>
                <dd>${footer.company}</dd>
              </div>
              <div>
                <dt>${footer.ceoLabel}</dt>
                <dd>${footer.ceo}</dd>
              </div>
              <div>
                <dt>${footer.registrationLabel}</dt>
                <dd>${footer.registration}</dd>
              </div>
              <div>
                <dt>${footer.addressLabel}</dt>
                <dd>${footer.address}</dd>
              </div>
            </dl>
          </section>
          <section class="mokda-footer-ip">
            <h2>${footer.ipTitle}</h2>
            <p>${footer.ip}</p>
          </section>
        </div>
        <p class="mokda-footer-copyright">${footer.copyright}</p>
      </div>
    `;
  }

  window.MOKDA_FOOTER = { render };
})();

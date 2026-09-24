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
      ip: 'El nombre de marca, nombres de productos, diseños de empaque y materiales relacionados de MOKDA están en proceso de protección de marca e IP.',
      navigationLabel: 'Explorar MOKDA',
      navigation: [
        ['Inicio', ''],
        ['Nuestra historia', 'about.html'],
        ['Salsa Coreana', 'products.html'],
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
      ip: 'MOKDA brand name, product names, package designs, and related materials are under trademark and IP protection process.',
      navigationLabel: 'Explore MOKDA',
      navigation: [
        ['Home', ''],
        ['Our story', 'about.html'],
        ['Salsa Coreana', 'products.html'],
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
      navigation: [
        ['홈', ''],
        ['브랜드 소개', 'about.html'],
        ['Salsa Coreana', 'products.html'],
        ['자주 묻는 질문', 'qna.html'],
        ['문의', 'contact.html'],
      ],
      copyright: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  function normalizeLanguage(language) {
    return Object.hasOwn(FOOTER_COPY, language) ? language : 'ES';
  }

  const footerStyle = document.createElement('style');
  footerStyle.textContent = `
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
    const navigationLinks = footer.navigation
      .map(([label, route]) => {
        const href = route ? `/${routePrefix}/${route}` : `/${routePrefix}/`;
        return `<a class="flex min-h-9 items-center justify-center px-1 font-bold leading-5 text-white/76 transition hover:text-white focus:text-white sm:min-h-0 sm:px-0" href="${href}">${label}</a>`;
      })
      .join('');
    element.innerHTML = `
      <div class="text-center">
        <nav aria-label="${footer.navigationLabel}" class="grid grid-cols-2 gap-x-3 gap-y-1 rounded-2xl bg-white/[0.035] p-2 text-[13px] sm:flex sm:flex-wrap sm:justify-center sm:gap-x-7 sm:gap-y-2 sm:px-6 sm:py-4 sm:text-sm">
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

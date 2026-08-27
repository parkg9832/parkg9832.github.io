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
        ['Apoyar el lanzamiento', 'support.html'],
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
        ['Support the launch', 'support.html'],
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
        ['출시 응원하기', 'support.html'],
      ],
      copyright: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  function normalizeLanguage(language) {
    return Object.hasOwn(FOOTER_COPY, language) ? language : 'ES';
  }

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
        return `<a class="font-bold text-white/76 transition hover:text-white focus:text-white" href="${href}">${label}</a>`;
      })
      .join('');
    element.innerHTML = `
      <div class="space-y-6">
        <p class="text-2xl font-black tracking-tight text-white">MOKDA</p>
        <nav aria-label="${footer.navigationLabel}" class="flex flex-wrap gap-x-6 gap-y-3 border-y border-white/12 py-5 text-sm">
          ${navigationLinks}
        </nav>
        <div class="grid gap-7 text-sm leading-6 text-white/70 lg:grid-cols-[1.45fr_0.9fr]">
          <section>
            <h2 class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/78">${footer.businessTitle}</h2>
            <dl class="grid gap-x-7 gap-y-3 sm:grid-cols-2">
              <div>
                <dt class="mb-1 font-bold text-white/68">${footer.companyLabel}</dt>
                <dd class="font-semibold text-white/82">${footer.company}</dd>
              </div>
              <div>
                <dt class="mb-1 font-bold text-white/68">${footer.ceoLabel}</dt>
                <dd class="font-semibold text-white/82">${footer.ceo}</dd>
              </div>
              <div>
                <dt class="mb-1 font-bold text-white/68">${footer.registrationLabel}</dt>
                <dd class="font-semibold text-white/82">${footer.registration}</dd>
              </div>
              <div>
                <dt class="mb-1 font-bold text-white/68">${footer.addressLabel}</dt>
                <dd class="text-white/82">${footer.address}</dd>
              </div>
            </dl>
          </section>
          <section class="lg:max-w-md lg:justify-self-end">
            <h2 class="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/78">${footer.ipTitle}</h2>
            <p class="text-white/76">${footer.ip}</p>
          </section>
        </div>
        <div class="text-xs font-semibold text-white/66">${footer.copyright}</div>
      </div>
    `;
  }

  window.MOKDA_FOOTER = { render };
})();

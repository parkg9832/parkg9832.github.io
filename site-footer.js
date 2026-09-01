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
        return `<a class="flex min-h-9 items-center justify-center px-1 font-bold leading-5 text-white/76 transition hover:text-white focus:text-white sm:min-h-0 sm:px-0" href="${href}">${label}</a>`;
      })
      .join('');
    element.innerHTML = `
      <div class="space-y-4 text-center sm:space-y-5">
        <nav aria-label="${footer.navigationLabel}" class="grid grid-cols-2 gap-x-3 gap-y-1 rounded-2xl bg-white/[0.035] p-2 text-[13px] sm:flex sm:flex-wrap sm:justify-center sm:gap-x-7 sm:gap-y-2 sm:px-6 sm:py-4 sm:text-sm">
          ${navigationLinks}
        </nav>
        <div class="grid gap-4 lg:grid-cols-[1.55fr_0.85fr] lg:items-stretch">
          <section class="rounded-2xl bg-white/[0.045] px-4 py-5 text-sm leading-6 text-white/70 sm:px-7 sm:py-6">
            <h2 class="text-xs font-bold uppercase tracking-[0.12em] text-mokdaOrange">${footer.businessTitle}</h2>
            <dl class="mt-4 grid grid-cols-2 items-start gap-x-4 gap-y-4 sm:gap-x-6 lg:grid-cols-4">
              <div>
                <dt class="mb-1 font-bold text-white/68">${footer.companyLabel}</dt>
                <dd class="font-semibold text-white/82">${footer.company}</dd>
              </div>
              <div>
                <dt class="mb-1 font-bold text-white/68">${footer.ceoLabel}</dt>
                <dd class="font-semibold text-white/82">${footer.ceo}</dd>
              </div>
              <div class="col-span-2 lg:col-span-1">
                <dt class="mb-1 font-bold text-white/68">${footer.registrationLabel}</dt>
                <dd class="font-semibold text-white/82">${footer.registration}</dd>
              </div>
              <div class="col-span-2 lg:col-span-1">
                <dt class="mb-1 font-bold text-white/68">${footer.addressLabel}</dt>
                <dd class="text-white/82">${footer.address}</dd>
              </div>
            </dl>
          </section>
          <section class="flex flex-col justify-center rounded-2xl bg-white/[0.035] px-5 py-5 text-sm leading-6 text-white/70 sm:px-7 sm:py-6">
            <h2 class="text-xs font-bold uppercase tracking-[0.12em] text-mokdaOrange">${footer.ipTitle}</h2>
            <p class="mt-3 text-white/76">${footer.ip}</p>
          </section>
        </div>
        <div class="pt-1 text-[11px] font-semibold text-white/66 sm:text-xs">${footer.copyright}</div>
      </div>
    `;
  }

  window.MOKDA_FOOTER = { render };
})();

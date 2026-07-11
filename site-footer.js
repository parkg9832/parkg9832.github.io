(() => {
  const FOOTER_COPY = {
    ES: {
      businessTitle: 'Información de la empresa',
      companyLabel: 'Empresa',
      company: 'MOKDA',
      ceoLabel: 'Representante',
      ceo: 'Park Gyeom (Pablo Park)',
      registrationLabel: 'Registro comercial',
      registration: '161-07-03392',
      addressLabel: 'Dirección',
      address: '44 Nambuk 10-gil, 2F, Gimje-si, Jeonbuk State, República de Corea',
      ipTitle: 'Propiedad intelectual',
      ip: 'El nombre de marca, nombres de productos, diseños de empaque y materiales relacionados de MOKDA están en proceso de protección de marca e IP.',
      copyright: '© 2026 MOKDA. Todos los derechos reservados.',
    },
    EN: {
      businessTitle: 'Business Information',
      companyLabel: 'Company',
      company: 'MOKDA',
      ceoLabel: 'CEO',
      ceo: 'Park Gyeom (Pablo Park)',
      registrationLabel: 'Business Registration No.',
      registration: '161-07-03392',
      addressLabel: 'Address',
      address: '44 Nambuk 10-gil, 2F, Gimje-si, Jeonbuk State, Republic of Korea',
      ipTitle: 'Intellectual Property',
      ip: 'MOKDA brand name, product names, package designs, and related materials are under trademark and IP protection process.',
      copyright: '© 2026 MOKDA. All rights reserved.',
    },
    KR: {
      businessTitle: '회사 정보',
      companyLabel: '상호',
      company: 'MOKDA',
      ceoLabel: '대표',
      ceo: '박겸(Pablo Park)',
      registrationLabel: '사업자등록번호',
      registration: '161-07-03392',
      addressLabel: '주소',
      address: '전북특별자치도 김제시 남북10길 44, 2층',
      ipTitle: '지식재산권',
      ip: 'MOKDA의 브랜드명, 제품명, 패키지 디자인 및 관련 자료는 상표권 및 지식재산권 보호 절차를 진행 중입니다.',
      copyright: '© 2026 MOKDA. 모든 권리 보유.',
    },
  };

  function normalizeLanguage(language) {
    return Object.hasOwn(FOOTER_COPY, language) ? language : 'ES';
  }

  function render(language) {
    const element = document.getElementById('footerText');
    if (!element) return;

    const footer = FOOTER_COPY[normalizeLanguage(language)];
    element.innerHTML = `
      <div class="space-y-6">
        <p class="text-2xl font-black tracking-tight text-white">MOKDA</p>
        <div class="grid gap-7 text-xs leading-5 text-white/60 lg:grid-cols-[1.45fr_0.9fr]">
          <section>
            <h2 class="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">${footer.businessTitle}</h2>
            <dl class="grid gap-x-7 gap-y-3 sm:grid-cols-2">
              <div>
                <dt class="mb-1 font-bold text-white/40">${footer.companyLabel}</dt>
                <dd class="font-semibold text-white/75">${footer.company}</dd>
              </div>
              <div>
                <dt class="mb-1 font-bold text-white/40">${footer.ceoLabel}</dt>
                <dd class="font-semibold text-white/75">${footer.ceo}</dd>
              </div>
              <div>
                <dt class="mb-1 font-bold text-white/40">${footer.registrationLabel}</dt>
                <dd class="font-semibold text-white/75">${footer.registration}</dd>
              </div>
              <div>
                <dt class="mb-1 font-bold text-white/40">${footer.addressLabel}</dt>
                <dd class="text-white/65">${footer.address}</dd>
              </div>
            </dl>
          </section>
          <section class="lg:max-w-md lg:justify-self-end">
            <h2 class="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">${footer.ipTitle}</h2>
            <p class="text-white/55">${footer.ip}</p>
          </section>
        </div>
        <div class="text-[11px] font-semibold text-white/35">${footer.copyright}</div>
      </div>
    `;
  }

  window.MOKDA_FOOTER = { render };
})();

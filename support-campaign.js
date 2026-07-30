(() => {
  'use strict';

  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const endpoint = window.MOKDA_B2B_WEB_APP_URL || '';
  const visitorStorageKey = 'mokda_analytics_visitor_v1';
  const supportStorageKey = 'mokda_demand_support_v1';
  const copy = {
    KR: {
      visual: '당신의 응원으로 시작되는 첫 출시',
      category: '첫 출시 응원 프로젝트',
      title: 'Salsa Coreana의 출시를 도와주세요.',
      lead: 'MOKDA를 라틴아메리카의 마트와 식탁에 선보이기 위해 실제 소비자의 응원을 모으고 있습니다.',
      impactTitle: '당신의 응원이 실제 수요 데이터가 됩니다.',
      impactText: '국가별 결과를 페루와 멕시코의 마트·벤더·유통사에 제안 자료로 활용합니다.',
      nameLabel: '이름 또는 닉네임',
      namePlaceholder: '이름을 입력해주세요',
      countryLabel: '어디에서 Salsa Coreana를 만나고 싶나요?',
      peru: '페루',
      mexico: '멕시코',
      declarationEmpty: '이름과 국가를 선택하면 나의 응원 문장이 완성됩니다.',
      declaration: (name, country) => `${name}님은 ${country}에서 Salsa Coreana를 만나길 원해요!`,
      submit: '출시 응원하기',
      sending: '응원을 전하고 있어요…',
      privacy: '이름은 공개하지 않습니다. 위치 정보와 연락처도 수집하지 않습니다.',
      success: (name, country) => `${name}님의 ${country} 출시 응원이 등록되었습니다. 감사합니다!`,
      duplicate: (country) => `이미 ${country} 출시를 응원해주셨습니다. 감사합니다!`,
      error: '등록하지 못했습니다. 잠시 후 다시 시도해주세요.',
      required: '이름을 입력하고 국가를 선택해주세요.',
      tabStory: '프로젝트 소개',
      tabJoin: '지금 응원하기',
      storyEyebrow: '왜 응원이 필요한가요?',
      storyTitle: '작은 응원이 큰 유통 기회를 만듭니다.',
      storyBody: '생산과 수출을 시작하기 전에, 실제로 Salsa Coreana를 원하는 사람이 있다는 근거가 필요합니다.',
      stepOneTitle: '출시 국가 선택',
      stepOneText: '페루 또는 멕시코를 직접 선택합니다. 추정 국가는 사용하지 않습니다.',
      stepTwoTitle: '국가별 수요 집계',
      stepTwoText: '응원 한 건이 해당 국가의 정량적인 관심 데이터로 쌓입니다.',
      stepThreeTitle: '시장에 결과 제시',
      stepThreeText: '마트, 벤더, 유통사와 상담할 때 실제 수요 근거로 보여줍니다.',
      back: '← MOKDA 홈페이지로 돌아가기',
    },
    ES: {
      visual: 'Un sueño que empieza con tu apoyo',
      category: 'Proyecto de lanzamiento',
      title: 'Ayúdanos a lanzar Salsa Coreana.',
      lead: 'Estamos reuniendo apoyo real para presentar MOKDA a tiendas y distribuidores de Latinoamérica.',
      impactTitle: 'Tu apoyo se convierte en datos reales.',
      impactText: 'Usaremos el resultado para demostrar la demanda en Perú y México.',
      nameLabel: 'Nombre o apodo',
      namePlaceholder: 'Escribe tu nombre',
      countryLabel: '¿Dónde quieres encontrar Salsa Coreana?',
      peru: 'Perú',
      mexico: 'México',
      declarationEmpty: 'Escribe tu nombre y elige un país para completar tu mensaje.',
      declaration: (name, country) => `${name} quiere encontrar Salsa Coreana en ${country}.`,
      submit: 'Apoyar el lanzamiento',
      sending: 'Enviando tu apoyo…',
      privacy: 'Tu nombre no será público. No recopilamos tu ubicación ni datos de contacto.',
      success: (name, country) => `¡Gracias, ${name}! Tu apoyo para el lanzamiento en ${country} ya está registrado.`,
      duplicate: (country) => `Ya registramos tu apoyo para ${country}. ¡Gracias!`,
      error: 'No pudimos registrar tu apoyo. Inténtalo de nuevo en un momento.',
      required: 'Escribe tu nombre y selecciona un país.',
      tabStory: 'Sobre el proyecto',
      tabJoin: 'Apoyar ahora',
      storyEyebrow: 'Por qué necesitamos tu apoyo',
      storyTitle: 'Una señal pequeña puede abrir una puerta grande.',
      storyBody: 'Antes de producir y exportar, necesitamos demostrar que hay personas que realmente quieren encontrar Salsa Coreana en su país.',
      stepOneTitle: 'Elige tu mercado',
      stepOneText: 'Selecciona Perú o México. No usamos ubicación estimada.',
      stepTwoTitle: 'Reunimos la demanda',
      stepTwoText: 'Cada apoyo se suma como una señal cuantitativa por país.',
      stepThreeTitle: 'Lo mostramos al mercado',
      stepThreeText: 'Presentaremos los resultados a tiendas, distribuidores y socios.',
      back: '← Volver a MOKDA',
    },
    EN: {
      visual: 'A dream that starts with your support',
      category: 'First launch project',
      title: 'Help us launch Salsa Coreana.',
      lead: 'We are gathering real support to introduce MOKDA to retailers and distributors across Latin America.',
      impactTitle: 'Your support becomes real demand data.',
      impactText: 'We will use the results to demonstrate demand in Peru and Mexico.',
      nameLabel: 'Name or nickname',
      namePlaceholder: 'Enter your name',
      countryLabel: 'Where do you want to find Salsa Coreana?',
      peru: 'Peru',
      mexico: 'Mexico',
      declarationEmpty: 'Add your name and choose a country to complete your message.',
      declaration: (name, country) => `${name} wants to find Salsa Coreana in ${country}.`,
      submit: 'Support the launch',
      sending: 'Sending your support…',
      privacy: 'Your name will not be public. We do not collect location or contact details.',
      success: (name, country) => `Thanks, ${name}! Your support for a launch in ${country} is registered.`,
      duplicate: (country) => `You already supported a launch in ${country}. Thank you!`,
      error: 'We could not register your support. Please try again in a moment.',
      required: 'Enter your name and choose a country.',
      tabStory: 'About the project',
      tabJoin: 'Support now',
      storyEyebrow: 'Why your support matters',
      storyTitle: 'A small signal can open a big door.',
      storyBody: 'Before we produce and export, we need evidence that people genuinely want to find Salsa Coreana in their country.',
      stepOneTitle: 'Choose your market',
      stepOneText: 'Select Peru or Mexico. We never use an estimated location.',
      stepTwoTitle: 'Build demand data',
      stepTwoText: 'Every response becomes a quantitative signal for that country.',
      stepThreeTitle: 'Show the market',
      stepThreeText: 'We will present the results to retailers, distributors, and partners.',
      back: '← Back to MOKDA',
    },
  };
  const t = copy[language] || copy.ES;

  function randomId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function readJson(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key) || 'null');
    } catch (error) {
      return null;
    }
  }

  function getVisitorId() {
    try {
      const saved = window.localStorage.getItem(visitorStorageKey);
      if (saved) return saved;
      const created = randomId();
      window.localStorage.setItem(visitorStorageKey, created);
      return created;
    } catch (error) {
      return randomId();
    }
  }

  function getAttribution() {
    const params = new URLSearchParams(window.location.search);
    let referrerHost = '';
    try {
      referrerHost = document.referrer ? new URL(document.referrer).hostname : '';
    } catch (error) {
      referrerHost = '';
    }

    return {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      referrerHost,
      verification: params.get('utm_medium') === 'verification',
    };
  }

  function countryName(country) {
    return country === 'PE' ? t.peru : t.mexico;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function render() {
    document.documentElement.lang = window.MOKDA_I18N.getHtmlLang(language);
    const textById = {
      supportVisualText: t.visual,
      supportCategory: t.category,
      supportTitle: t.title,
      supportLead: t.lead,
      supportImpactTitle: t.impactTitle,
      supportImpactText: t.impactText,
      supportNameLabel: t.nameLabel,
      supportCountryLabel: t.countryLabel,
      supportPeru: t.peru,
      supportMexico: t.mexico,
      supportSubmitLabel: t.submit,
      supportPrivacy: t.privacy,
      supportTabStory: t.tabStory,
      supportTabJoin: t.tabJoin,
      supportStoryEyebrow: t.storyEyebrow,
      supportStoryTitle: t.storyTitle,
      supportStoryBody: t.storyBody,
      supportStepOneTitle: t.stepOneTitle,
      supportStepOneText: t.stepOneText,
      supportStepTwoTitle: t.stepTwoTitle,
      supportStepTwoText: t.stepTwoText,
      supportStepThreeTitle: t.stepThreeTitle,
      supportStepThreeText: t.stepThreeText,
      supportBack: t.back,
    };

    Object.entries(textById).forEach(([id, value]) => setText(id, value));
    document.getElementById('supportName').placeholder = t.namePlaceholder;
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.language === language ? 'true' : 'false');
    });
    updateDeclaration();
  }

  function setStatus(state, message) {
    const status = document.getElementById('supportStatus');
    status.dataset.state = state;
    status.textContent = message;
  }

  function updateDeclaration() {
    const name = document.getElementById('supportName').value.trim().slice(0, 40);
    const country = document.querySelector('input[name="country"]:checked')?.value || '';
    const declaration = document.getElementById('supportDeclaration');
    const ready = Boolean(name && ['PE', 'MX'].includes(country));
    declaration.dataset.ready = ready ? 'true' : 'false';
    declaration.textContent = ready ? t.declaration(name, countryName(country)) : t.declarationEmpty;
  }

  function showSavedSupport(saved) {
    if (!saved?.country) return false;
    document.getElementById('supportForm').hidden = true;
    setStatus('success', t.duplicate(countryName(saved.country)));
    return true;
  }

  async function submitSupport(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim().slice(0, 40);
    const country = String(data.get('country') || '').trim().toUpperCase();

    if (!name || !['PE', 'MX'].includes(country)) {
      setStatus('error', t.required);
      return;
    }

    if (!endpoint) {
      setStatus('error', t.error);
      return;
    }

    const attribution = getAttribution();
    const submit = document.getElementById('supportSubmit');
    submit.disabled = true;
    setText('supportSubmitLabel', t.sending);
    setStatus('pending', '');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: 'demand_support',
          eventId: randomId(),
          visitorId: getVisitorId(),
          name,
          country,
          language,
          pageUrl: window.location.href,
          ...attribution,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Support request failed');

      const saved = { name, country, at: new Date().toISOString() };
      if (!attribution.verification) {
        try {
          window.localStorage.setItem(supportStorageKey, JSON.stringify(saved));
        } catch (error) {
          // Server-side deduplication still applies when storage is unavailable.
        }
      }

      form.hidden = true;
      setStatus(
        'success',
        result.duplicate ? t.duplicate(countryName(country)) : t.success(name, countryName(country)),
      );
      window.MOKDA_ANALYTICS?.track(
        'support_submit',
        { element: `country_${country.toLowerCase()}` },
        { immediate: true },
      );
    } catch (error) {
      console.error(error);
      setStatus('error', t.error);
      submit.disabled = false;
      setText('supportSubmitLabel', t.submit);
    }
  }

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextLanguage = button.dataset.language;
      const languagePath = { ES: 'es', KR: 'ko', EN: 'en' }[nextLanguage] || 'es';
      window.location.href = `/${languagePath}/support.html${window.location.search}`;
    });
  });
  document.getElementById('supportName').addEventListener('input', updateDeclaration);
  document.querySelectorAll('input[name="country"]').forEach((input) => {
    input.addEventListener('change', updateDeclaration);
  });
  document.getElementById('supportForm').addEventListener('submit', submitSupport);

  render();
  showSavedSupport(readJson(supportStorageKey));
  window.MOKDA_ANALYTICS?.track('support_page_view', { element: 'demand_support_page' });
})();

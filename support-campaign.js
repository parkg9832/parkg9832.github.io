(() => {
  'use strict';

  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const endpoint = window.MOKDA_B2B_WEB_APP_URL || '';
  const visitorStorageKey = 'mokda_analytics_visitor_v1';
  const supportStorageKey = 'mokda_demand_support_v1';
  const countryCodes = ['PE', 'MX', 'CL', 'CO', 'AR'];
  const copy = {
    KR: {
      visual: '당신의 응원으로 시작되는 첫 출시',
      category: '첫 출시 응원 프로젝트',
      title: 'Salsa Coreana의 출시를 도와주세요.',
      lead: 'MOKDA를 라틴아메리카의 마트와 식탁에 선보이기 위해 실제 소비자의 응원을 모으고 있습니다.',
      impactTitle: '당신의 응원이 실제 수요 데이터가 됩니다.',
      nameLabel: '이름 또는 닉네임',
      namePlaceholder: '이름을 입력해주세요',
      countryLabel: '어디에서 Salsa Coreana를 만나고 싶나요?',
      peru: '페루',
      mexico: '멕시코',
      chile: '칠레',
      colombia: '콜롬비아',
      argentina: '아르헨티나',
      declarationEmpty: '이름과 국가를 선택하면 나의 응원 문장이 완성됩니다.',
      declaration: (name, country) => `${name}님은 ${country}에서 Salsa Coreana를 만나길 원해요!`,
      submit: '출시 응원하기',
      sending: '응원을 전하고 있어요…',
      privacy: '입력한 이름과 선택 국가가 아래 응원 목록에 표시됩니다. 위치 정보와 연락처는 수집하지 않습니다.',
      success: (name, country) => `${name}님의 ${country} 출시 응원이 등록되었습니다. 감사합니다!`,
      duplicate: (country) => `이미 ${country} 출시를 응원해주셨습니다. 감사합니다!`,
      error: '등록하지 못했습니다. 잠시 후 다시 시도해주세요.',
      required: '이름을 입력하고 국가를 선택해주세요.',
      feedEyebrow: '실시간 응원',
      feedTitle: 'Salsa Coreana를 기다리는 사람들',
      feedLoading: '불러오는 중…',
      feedTotal: (count) => `총 ${count}명 응원`,
      feedMessage: (name, country) => `${name}님은 ${country}에서 Salsa Coreana를 만나길 원해요!`,
      feedEmpty: '새 응원 메시지는 아래와 같은 모습으로 표시됩니다. 예시는 응원 수에 포함되지 않습니다.',
      exampleLabel: '표시 예시',
      storyEyebrow: '왜 응원이 필요한가요?',
      storyTitle: '작은 응원이 큰 유통 기회를 만듭니다.',
      storyBody: '원하는 출시 국가를 선택하면 한 건의 응원이 국가별 수요 데이터로 쌓입니다. 이 결과를 마트·벤더·유통사에 실제 시장 근거로 제시합니다.',
      back: '← MOKDA 홈페이지로 돌아가기',
      menuHome: '홈',
      menuAbout: '브랜드 소개',
      menuProducts: 'Salsa Coreana',
      menuQna: 'Q&A',
      menuContact: '문의',
      menuOpen: '메뉴 열기',
      menuClose: '메뉴 닫기',
    },
    ES: {
      visual: 'Un sueño que empieza con tu apoyo',
      category: 'Proyecto de lanzamiento',
      title: 'Ayúdanos a lanzar Salsa Coreana.',
      lead: 'Estamos reuniendo apoyo real para presentar MOKDA a tiendas y distribuidores de Latinoamérica.',
      impactTitle: 'Tu apoyo se convierte en datos reales.',
      nameLabel: 'Nombre o apodo',
      namePlaceholder: 'Escribe tu nombre',
      countryLabel: '¿Dónde quieres encontrar Salsa Coreana?',
      peru: 'Perú',
      mexico: 'México',
      chile: 'Chile',
      colombia: 'Colombia',
      argentina: 'Argentina',
      declarationEmpty: 'Escribe tu nombre y elige un país para completar tu mensaje.',
      declaration: (name, country) => `${name} quiere encontrar Salsa Coreana en ${country}.`,
      submit: 'Apoyar el lanzamiento',
      sending: 'Enviando tu apoyo…',
      privacy: 'Tu nombre y país aparecerán en la lista de apoyos. No recopilamos tu ubicación ni datos de contacto.',
      success: (name, country) => `¡Gracias, ${name}! Tu apoyo para el lanzamiento en ${country} ya está registrado.`,
      duplicate: (country) => `Ya registramos tu apoyo para ${country}. ¡Gracias!`,
      error: 'No pudimos registrar tu apoyo. Inténtalo de nuevo en un momento.',
      required: 'Escribe tu nombre y selecciona un país.',
      feedEyebrow: 'Apoyos reales',
      feedTitle: 'Personas que quieren encontrar Salsa Coreana',
      feedLoading: 'Cargando…',
      feedTotal: (count) => `${count} ${count === 1 ? 'apoyo' : 'apoyos'}`,
      feedMessage: (name, country) => `${name} quiere encontrar Salsa Coreana en ${country}.`,
      feedEmpty: 'Así aparecerán los nuevos mensajes. Estos ejemplos no cuentan en el total.',
      exampleLabel: 'Ejemplo',
      storyEyebrow: 'Por qué necesitamos tu apoyo',
      storyTitle: 'Una señal pequeña puede abrir una puerta grande.',
      storyBody: 'Elige el país donde quieres encontrarla: cada apoyo se suma a la demanda de ese mercado. Presentaremos los resultados a tiendas, distribuidores y socios.',
      back: '← Volver a MOKDA',
      menuHome: 'Inicio',
      menuAbout: 'Sobre nosotros',
      menuProducts: 'Salsa Coreana',
      menuQna: 'Q&A',
      menuContact: 'Contacto',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
    },
    EN: {
      visual: 'A dream that starts with your support',
      category: 'First launch project',
      title: 'Help us launch Salsa Coreana.',
      lead: 'We are gathering real support to introduce MOKDA to retailers and distributors across Latin America.',
      impactTitle: 'Your support becomes real demand data.',
      nameLabel: 'Name or nickname',
      namePlaceholder: 'Enter your name',
      countryLabel: 'Where do you want to find Salsa Coreana?',
      peru: 'Peru',
      mexico: 'Mexico',
      chile: 'Chile',
      colombia: 'Colombia',
      argentina: 'Argentina',
      declarationEmpty: 'Add your name and choose a country to complete your message.',
      declaration: (name, country) => `${name} wants to find Salsa Coreana in ${country}.`,
      submit: 'Support the launch',
      sending: 'Sending your support…',
      privacy: 'Your name and selected country will appear in the support list. We do not collect location or contact details.',
      success: (name, country) => `Thanks, ${name}! Your support for a launch in ${country} is registered.`,
      duplicate: (country) => `You already supported a launch in ${country}. Thank you!`,
      error: 'We could not register your support. Please try again in a moment.',
      required: 'Enter your name and choose a country.',
      feedEyebrow: 'Real support',
      feedTitle: 'People who want to find Salsa Coreana',
      feedLoading: 'Loading…',
      feedTotal: (count) => `${count} ${count === 1 ? 'supporter' : 'supporters'}`,
      feedMessage: (name, country) => `${name} wants to find Salsa Coreana in ${country}.`,
      feedEmpty: 'New support messages will appear like this. Examples are not included in the total.',
      exampleLabel: 'Example',
      storyEyebrow: 'Why your support matters',
      storyTitle: 'A small signal can open a big door.',
      storyBody: 'Choose where you want to find it and each response becomes a demand signal for that market. We will present the results to retailers, distributors, and partners.',
      back: '← Back to MOKDA',
      menuHome: 'Home',
      menuAbout: 'About',
      menuProducts: 'Salsa Coreana',
      menuQna: 'Q&A',
      menuContact: 'Contact',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
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
    return {
      PE: t.peru,
      MX: t.mexico,
      CL: t.chile,
      CO: t.colombia,
      AR: t.argentina,
    }[country] || country;
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
      supportNameLabel: t.nameLabel,
      supportCountryLabel: t.countryLabel,
      supportPeru: t.peru,
      supportMexico: t.mexico,
      supportChile: t.chile,
      supportColombia: t.colombia,
      supportArgentina: t.argentina,
      supportSubmitLabel: t.submit,
      supportPrivacy: t.privacy,
      supportFeedEyebrow: t.feedEyebrow,
      supportFeedTitle: t.feedTitle,
      supportFeedTotal: t.feedLoading,
      supportFeedEmpty: t.feedEmpty,
      supportStoryEyebrow: t.storyEyebrow,
      supportStoryTitle: t.storyTitle,
      supportStoryBody: t.storyBody,
      supportBack: t.back,
      supportMenuHome: t.menuHome,
      supportMenuAbout: t.menuAbout,
      supportMenuProducts: t.menuProducts,
      supportMenuQna: t.menuQna,
      supportMenuContact: t.menuContact,
    };

    Object.entries(textById).forEach(([id, value]) => setText(id, value));
    document.getElementById('supportName').placeholder = t.namePlaceholder;
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.language === language ? 'true' : 'false');
    });
    document.getElementById('supportMenuToggle').setAttribute('aria-label', t.menuOpen);
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
    const ready = Boolean(name && countryCodes.includes(country));
    declaration.dataset.ready = ready ? 'true' : 'false';
    declaration.textContent = ready ? t.declaration(name, countryName(country)) : t.declarationEmpty;
  }

  function renderSupportFeed(result) {
    const total = Number(result?.total || 0);
    const totals = result?.totals || {};
    const supporters = Array.isArray(result?.supporters) ? result.supporters : [];
    const totalElement = document.getElementById('supportFeedTotal');
    const totalsElement = document.getElementById('supportCountryTotals');
    const listElement = document.getElementById('supportFeedList');
    const emptyElement = document.getElementById('supportFeedEmpty');

    totalElement.textContent = t.feedTotal(total);
    totalsElement.replaceChildren();
    countryCodes.forEach((code) => {
      const item = document.createElement('span');
      const label = document.createElement('span');
      const count = document.createElement('strong');
      item.className = 'support-country-total';
      label.textContent = countryName(code);
      count.textContent = String(Number(totals[code] || 0));
      item.append(label, count);
      totalsElement.appendChild(item);
    });

    const validSupporters = supporters
      .map((supporter) => ({
        name: String(supporter?.name || '').trim().slice(0, 40),
        code: String(supporter?.countryCode || '').trim().toUpperCase(),
      }))
      .filter((supporter) => supporter.name && countryCodes.includes(supporter.code));

    function appendSupporter(name, code, example = false) {
      const item = document.createElement('article');
      const avatar = document.createElement('span');
      const message = document.createElement('p');
      const country = document.createElement('span');
      item.className = example ? 'support-feed-item support-feed-item--example' : 'support-feed-item';
      avatar.className = 'support-feed-avatar';
      message.className = 'support-feed-message';
      country.className = 'support-feed-country';
      avatar.textContent = name.slice(0, 1).toUpperCase();
      message.textContent = t.feedMessage(name, countryName(code));
      country.textContent = example ? `${t.exampleLabel} · ${countryName(code)}` : countryName(code);
      item.append(avatar, message, country);
      listElement.appendChild(item);
    }

    listElement.replaceChildren();
    if (validSupporters.length > 0) {
      validSupporters.forEach(({ name, code }) => appendSupporter(name, code));
      emptyElement.hidden = true;
      return;
    }

    [
      { name: 'Ana', code: 'PE' },
      { name: 'Luis', code: 'MX' },
      { name: 'Camila', code: 'CL' },
    ].forEach(({ name, code }) => appendSupporter(name, code, true));
    emptyElement.hidden = false;
  }

  async function loadSupportFeed() {
    if (!endpoint) return;
    try {
      const feedUrl = new URL(endpoint);
      feedUrl.searchParams.set('mode', 'demand_support');
      feedUrl.searchParams.set('limit', '24');
      feedUrl.searchParams.set('_', String(Date.now()));
      const response = await fetch(feedUrl.toString(), { method: 'GET', cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Support feed request failed');
      renderSupportFeed(result);
    } catch (error) {
      console.error(error);
    }
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

    if (!name || !countryCodes.includes(country)) {
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
          publicFeed: true,
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
      await loadSupportFeed();
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
  const menuToggle = document.getElementById('supportMenuToggle');
  const menu = document.getElementById('supportMenu');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    menuToggle.setAttribute('aria-label', expanded ? t.menuOpen : t.menuClose);
    menu.hidden = expanded;
  });

  render();
  showSavedSupport(readJson(supportStorageKey));
  loadSupportFeed();
  window.MOKDA_ANALYTICS?.track('support_page_view', { element: 'demand_support_page' });
})();

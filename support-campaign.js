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
      lead: '당신의 응원은 라틴아메리카 현지 매장과 유통사에 실제 수요를 증명하는 데 큰 도움이 됩니다.',
      impactTitle: 'Cuéntanos dónde quieres encontrar Salsa Coreana.',
      nameLabel: '이름 또는 닉네임',
      namePlaceholder: '이름을 입력해주세요',
      messageLabel: '응원 메시지',
      messageOptional: '(선택, 최대 180자)',
      messagePlaceholder: '출시를 응원하는 한마디를 남겨주세요',
      countryLabel: '어디에서 Salsa Coreana를 만나고 싶나요?',
      peru: '페루',
      mexico: '멕시코',
      chile: '칠레',
      colombia: '콜롬비아',
      argentina: '아르헨티나',
      submit: '출시 응원하기',
      sending: '응원을 전하고 있어요…',
      privacy: '이름, 국가, 응원 메시지가 아래 목록에 표시됩니다. 위치 정보와 연락처는 수집하지 않습니다.',
      success: (name, country) => `${name}님의 ${country} 출시 응원이 등록되었습니다. 감사합니다!`,
      duplicate: () => '이미 참여하셨습니다. 감사합니다!',
      error: '등록하지 못했습니다. 잠시 후 다시 시도해주세요.',
      required: '이름을 입력하고 국가를 선택해주세요.',
      feedEyebrow: '실시간 응원',
      feedTitle: 'Salsa Coreana를 기다리는 사람들',
      feedLoading: '불러오는 중…',
      feedTotal: (count) => `총 ${count}명 응원`,
      feedMessage: (country) => `${country}에서 Salsa Coreana를 만나고 싶어요!`,
      exampleMessages: [
        '페루에서 Salsa Coreana를 꼭 만나보고 싶어요!',
        '타코와 함께 먹어보고 싶습니다. 멕시코 출시를 응원해요!',
        '칠레에서도 쉽게 살 수 있는 날을 기다릴게요.',
      ],
      feedEmpty: '새 응원 메시지는 아래와 같은 모습으로 표시됩니다. 예시는 응원 수에 포함되지 않습니다.',
      exampleLabel: '표시 예시',
      storyEyebrow: '',
      storyTitle: '',
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
      lead: 'Tu apoyo nos ayuda a demostrar una demanda real ante tiendas y distribuidores de Latinoamérica.',
      impactTitle: 'Cuéntanos dónde quieres encontrar Salsa Coreana.',
      nameLabel: 'Nombre o apodo',
      namePlaceholder: 'Escribe tu nombre',
      messageLabel: 'Mensaje de apoyo',
      messageOptional: '(opcional, máximo 180 caracteres)',
      messagePlaceholder: 'Escribe unas palabras para apoyar el lanzamiento',
      countryLabel: '¿Dónde quieres encontrar Salsa Coreana?',
      peru: 'Perú',
      mexico: 'México',
      chile: 'Chile',
      colombia: 'Colombia',
      argentina: 'Argentina',
      submit: 'Apoyar el lanzamiento',
      sending: 'Enviando tu apoyo…',
      privacy: 'Tu nombre, país y mensaje aparecerán en la lista. No recopilamos tu ubicación ni datos de contacto.',
      success: (name, country) => `¡Gracias, ${name}! Tu apoyo para el lanzamiento en ${country} ya está registrado.`,
      duplicate: () => '¡Ya participaste! ¡Gracias!',
      error: 'No pudimos registrar tu apoyo. Inténtalo de nuevo en un momento.',
      required: 'Escribe tu nombre y selecciona un país.',
      feedEyebrow: 'Apoyos reales',
      feedTitle: 'Personas que quieren encontrar Salsa Coreana',
      feedLoading: 'Cargando…',
      feedTotal: (count) => `${count} ${count === 1 ? 'apoyo' : 'apoyos'}`,
      feedMessage: (country) => `¡Quiero encontrar Salsa Coreana en ${country}!`,
      exampleMessages: [
        '¡Quiero encontrar Salsa Coreana en Perú!',
        'Me encantaría probarla con tacos. ¡Que llegue pronto a México!',
        'Espero poder encontrarla muy pronto en Chile.',
      ],
      feedEmpty: 'Así aparecerán los nuevos mensajes. Estos ejemplos no cuentan en el total.',
      exampleLabel: 'Ejemplo',
      storyEyebrow: '',
      storyTitle: '',
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
      lead: 'Your support helps us demonstrate real demand to stores and distributors across Latin America.',
      impactTitle: 'Tell us where you want to find Salsa Coreana.',
      nameLabel: 'Name or nickname',
      namePlaceholder: 'Enter your name',
      messageLabel: 'Support message',
      messageOptional: '(optional, up to 180 characters)',
      messagePlaceholder: 'Leave a few words to support the launch',
      countryLabel: 'Where do you want to find Salsa Coreana?',
      peru: 'Peru',
      mexico: 'Mexico',
      chile: 'Chile',
      colombia: 'Colombia',
      argentina: 'Argentina',
      submit: 'Support the launch',
      sending: 'Sending your support…',
      privacy: 'Your name, country, and message will appear below. We do not collect location or contact details.',
      success: (name, country) => `Thanks, ${name}! Your support for a launch in ${country} is registered.`,
      duplicate: () => 'You already participated! Thank you!',
      error: 'We could not register your support. Please try again in a moment.',
      required: 'Enter your name and choose a country.',
      feedEyebrow: 'Real support',
      feedTitle: 'People who want to find Salsa Coreana',
      feedLoading: 'Loading…',
      feedTotal: (count) => `${count} ${count === 1 ? 'supporter' : 'supporters'}`,
      feedMessage: (country) => `I want to find Salsa Coreana in ${country}!`,
      exampleMessages: [
        'I would love to find Salsa Coreana in Peru!',
        'I want to try it with tacos. Please bring it to Mexico!',
        'I hope I can find it in Chile soon.',
      ],
      feedEmpty: 'New support messages will appear like this. Examples are not included in the total.',
      exampleLabel: 'Example',
      storyEyebrow: '',
      storyTitle: '',
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
    if (element && value) element.textContent = value;
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
      supportBack: t.back,
      supportMenuHome: t.menuHome,
      supportMenuAbout: t.menuAbout,
      supportMenuProducts: t.menuProducts,
      supportMenuQna: t.menuQna,
      supportMenuContact: t.menuContact,
    };

    Object.entries(textById).forEach(([id, value]) => setText(id, value));
    document.getElementById('supportName').placeholder = t.namePlaceholder;
    const messageLabel = document.getElementById('supportMessageLabel');
    messageLabel.replaceChildren(document.createTextNode(`${t.messageLabel} `));
    const optional = document.createElement('span');
    optional.textContent = t.messageOptional;
    messageLabel.appendChild(optional);
    document.getElementById('supportMessage').placeholder = t.messagePlaceholder;
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.language === language ? 'true' : 'false');
    });
    document.getElementById('supportMenuToggle').setAttribute('aria-label', t.menuOpen);
  }

  function setStatus(state, message) {
    const status = document.getElementById('supportStatus');
    status.dataset.state = state;
    status.textContent = message;
  }

  function formatSupportTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const locale = { KR: 'ko-KR', ES: 'es-419', EN: 'en' }[language] || 'es-419';
    const seconds = Math.round((date.getTime() - Date.now()) / 1000);
    const absoluteSeconds = Math.abs(seconds);
    let amount = seconds;
    let unit = 'second';

    if (absoluteSeconds >= 86400) {
      amount = Math.round(seconds / 86400);
      unit = 'day';
    } else if (absoluteSeconds >= 3600) {
      amount = Math.round(seconds / 3600);
      unit = 'hour';
    } else if (absoluteSeconds >= 60) {
      amount = Math.round(seconds / 60);
      unit = 'minute';
    }

    if (Math.abs(amount) <= 7 || unit !== 'day') {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(amount, unit);
    }

    return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date);
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
        message: String(supporter?.message || '').trim().slice(0, 180),
        createdAt: String(supporter?.createdAt || '').trim(),
      }))
      .filter((supporter) => supporter.name && countryCodes.includes(supporter.code));

    function appendSupporter({ name, code, message, createdAt, example = false }) {
      const item = document.createElement('article');
      const avatar = document.createElement('span');
      const content = document.createElement('div');
      const meta = document.createElement('div');
      const supporterName = document.createElement('strong');
      const country = document.createElement('span');
      const time = document.createElement('time');
      const body = document.createElement('p');
      item.className = example ? 'support-feed-item support-feed-item--example' : 'support-feed-item';
      avatar.className = 'support-feed-avatar';
      content.className = 'support-feed-content';
      meta.className = 'support-feed-meta';
      supporterName.className = 'support-feed-name';
      country.className = 'support-feed-country';
      time.className = 'support-feed-time';
      body.className = 'support-feed-message';
      avatar.textContent = name.slice(0, 1).toUpperCase();
      supporterName.textContent = name;
      country.textContent = countryName(code);
      time.textContent = formatSupportTime(createdAt);
      if (createdAt && !Number.isNaN(new Date(createdAt).getTime())) time.dateTime = new Date(createdAt).toISOString();
      body.textContent = message || t.feedMessage(countryName(code));
      meta.append(supporterName, country, time);
      if (example) {
        const exampleTag = document.createElement('span');
        exampleTag.className = 'support-feed-example';
        exampleTag.textContent = t.exampleLabel;
        meta.appendChild(exampleTag);
      }
      content.append(meta, body);
      item.append(avatar, content);
      listElement.appendChild(item);
    }

    listElement.replaceChildren();
    if (validSupporters.length > 0) {
      validSupporters.forEach(appendSupporter);
      emptyElement.hidden = true;
      return;
    }

    const exampleTime = Date.now();
    [
      { name: 'Ana', code: 'PE', minutesAgo: 2 },
      { name: 'Luis', code: 'MX', minutesAgo: 8 },
      { name: 'Camila', code: 'CL', minutesAgo: 15 },
    ].forEach(({ name, code, minutesAgo }, index) =>
      appendSupporter({
        name,
        code,
        message: t.exampleMessages[index],
        createdAt: new Date(exampleTime - minutesAgo * 60000).toISOString(),
        example: true,
      }),
    );
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
    if (getAttribution().verification) return false;
    if (!saved?.country) return false;
    const savedCountry = String(saved.country || '').toUpperCase();
    document.getElementById('supportName').value = String(saved.name || '').slice(0, 40);
    document.getElementById('supportMessage').value = String(saved.message || '').slice(0, 180);
    const countryInput = document.querySelector(`input[name="country"][value="${savedCountry}"]`);
    if (countryInput) countryInput.checked = true;
    return true;
  }

  let isSubmitting = false;

  function showToast(message) {
    const status = document.getElementById('supportStatus');
    status.dataset.state = 'toast';
    status.textContent = message;
    clearTimeout(status._toastTimer);
    status._toastTimer = setTimeout(() => {
      if (status.dataset.state === 'toast') {
        status.textContent = '';
        delete status.dataset.state;
      }
    }, 4000);
  }

  async function submitSupport(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim().slice(0, 40);
    const country = String(data.get('country') || '').trim().toUpperCase();
    const message = String(data.get('message') || '').trim().slice(0, 180);

    if (!name || !countryCodes.includes(country)) {
      setStatus('error', t.required);
      return;
    }

    if (!endpoint) {
      setStatus('error', t.error);
      return;
    }

    const attribution = getAttribution();

    // Pre-check: if localStorage already has a record, show duplicate toast
    if (!attribution.verification) {
      const existing = readJson(supportStorageKey);
      if (existing?.country) {
        showToast(t.duplicate());
        return;
      }
    }

    const submit = document.getElementById('supportSubmit');
    isSubmitting = true;
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
          message,
          language,
          pageUrl: window.location.href,
          publicFeed: true,
          ...attribution,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Support request failed');

      const saved = { name, country, message, at: new Date().toISOString() };
      if (!attribution.verification) {
        try {
          window.localStorage.setItem(supportStorageKey, JSON.stringify(saved));
        } catch (error) {
          // Server-side deduplication still applies when storage is unavailable.
        }
      }

      if (result.duplicate) {
        showToast(t.duplicate());
      } else {
        showToast(t.success(name, countryName(country)));
      }
      submit.disabled = false;
      setText('supportSubmitLabel', t.submit);
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
    } finally {
      isSubmitting = false;
    }
  }

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextLanguage = button.dataset.language;
      const languagePath = { ES: 'es', KR: 'ko', EN: 'en' }[nextLanguage] || 'es';
      window.location.href = `/${languagePath}/support.html${window.location.search}`;
    });
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

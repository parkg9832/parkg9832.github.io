(() => {
  'use strict';

  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const endpoint = window.MOKDA_B2B_WEB_APP_URL || '';
  const visitorStorageKey = 'mokda_analytics_visitor_v1';
  const supportStorageKey = 'mokda_demand_support_v1';
  const countryCodes = ['PE', 'MX', 'CL', 'CO'];
  const feedPageSize = 20;
  const flagMap = {
    PE: './assets/images/flags/peru.jpg',
    MX: './assets/images/flags/mexico.jpg',
    CL: './assets/images/flags/chile.jpg',
    CO: './assets/images/flags/colombia.jpg',
  };
  const copy = {
    KR: {
      visual: '당신의 응원으로 시작되는 첫 출시',
      category: '첫 출시 응원 프로젝트',
      title: 'Salsa Coreana의 출시를 도와주세요.',
      lead: '당신의 응원은 라틴아메리카 현지 매장과 유통사에 실제 수요를 증명하는 데 큰 도움이 됩니다.',
      nameLabel: '이름 또는 닉네임',
      namePlaceholder: '이름을 입력해주세요',
      messageLabel: '응원 메시지',
      messageOptional: '(선택)',
      messagePlaceholder: '출시를 응원하는 한마디를 남겨주세요',
      countryLabel: '어디에서 Salsa Coreana를 만나고 싶나요?',
      peru: '페루',
      mexico: '멕시코',
      chile: '칠레',
      colombia: '콜롬비아',
      submit: '출시 응원하기',
      sending: '응원을 전하고 있어요…',
      privacy: '이름·국가·메시지만 공개하며 연락처는 수집하지 않습니다.',
      success: (name, country) => `${name}님의 ${country} 출시 응원이 접수되었습니다. 감사합니다!`,
      duplicate: () => '이미 참여하셨습니다. 감사합니다!',
      error: '등록하지 못했습니다. 잠시 후 다시 시도해주세요.',
      required: '이름을 입력하고 국가를 선택해주세요.',
      feedEyebrow: '실시간 응원',
      feedTitle: 'Salsa Coreana를 기다리는 사람들',
      feedLoading: '불러오는 중…',
      feedTotal: (count) => `총 ${count}명이 응원했습니다`,
      feedMore: (count) => `응원 ${count}개 더보기`,
      feedMoreLoading: '불러오는 중…',
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
      share: '공유하기',
      shareCopied: '링크를 복사했습니다.',
    },
    ES: {
      visual: 'Un sueño que empieza con tu apoyo',
      category: 'Proyecto de lanzamiento',
      title: 'Ayúdanos a lanzar Salsa Coreana.',
      lead: 'Tu apoyo nos ayuda a demostrar a tiendas y distribuidores de Latinoamérica que existe una demanda real.',
      nameLabel: 'Nombre o apodo',
      namePlaceholder: 'Escribe tu nombre',
      messageLabel: 'Mensaje de apoyo',
      messageOptional: '(opcional)',
      messagePlaceholder: 'Escribe unas palabras para apoyar el lanzamiento',
      countryLabel: '¿Dónde quieres encontrar Salsa Coreana?',
      peru: 'Perú',
      mexico: 'México',
      chile: 'Chile',
      colombia: 'Colombia',
      submit: 'Apoyar el lanzamiento',
      sending: 'Enviando tu apoyo…',
      privacy: 'Solo mostramos tu nombre, país y mensaje. No solicitamos datos de contacto.',
      success: (name, country) => `¡Gracias, ${name}! Tu apoyo para el lanzamiento en ${country} ya está registrado.`,
      duplicate: () => '¡Ya participaste! ¡Gracias!',
      error: 'No pudimos registrar tu apoyo. Inténtalo de nuevo en un momento.',
      required: 'Escribe tu nombre y selecciona un país.',
      feedEyebrow: 'Apoyos reales',
      feedTitle: 'Personas que quieren probar Salsa Coreana',
      feedLoading: 'Cargando…',
      feedTotal: (count) => `${count} ${count === 1 ? 'apoyo' : 'apoyos'}`,
      feedMore: (count) => `Ver ${count} ${count === 1 ? 'apoyo' : 'apoyos'} más`,
      feedMoreLoading: 'Cargando…',
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
      share: 'Compartir',
      shareCopied: 'Enlace copiado.',
    },
    EN: {
      visual: 'A dream that starts with your support',
      category: 'First launch project',
      title: 'Help us launch Salsa Coreana.',
      lead: 'Your support helps us show stores and distributors across Latin America that there is real demand.',
      nameLabel: 'Name or nickname',
      namePlaceholder: 'Enter your name',
      messageLabel: 'Support message',
      messageOptional: '(optional)',
      messagePlaceholder: 'Leave a few words to support the launch',
      countryLabel: 'Where do you want to find Salsa Coreana?',
      peru: 'Peru',
      mexico: 'Mexico',
      chile: 'Chile',
      colombia: 'Colombia',
      submit: 'Support the launch',
      sending: 'Sending your support…',
      privacy: 'Only your name, country, and message are shown; no contact details are collected.',
      success: (name, country) => `Thanks, ${name}! Your support for bringing Salsa Coreana to ${country} has been recorded.`,
      duplicate: () => 'You’ve already submitted your support. Thank you!',
      error: 'We could not register your support. Please try again in a moment.',
      required: 'Enter your name and choose a country.',
      feedEyebrow: 'Real support',
      feedTitle: 'People waiting to try Salsa Coreana',
      feedLoading: 'Loading…',
      feedTotal: (count) => `${count} ${count === 1 ? 'supporter' : 'supporters'}`,
      feedMore: (count) => `Show ${count} more`,
      feedMoreLoading: 'Loading…',
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
      share: 'Share',
      shareCopied: 'Link copied.',
    },
  };
  const t = copy[language] || copy.ES;
  const campaignCopy = {
    KR: {
      category: '출시 응원 프로젝트',
      title: '내 식탁에 한국 소스가 닿도록',
      lead: '어떤 나라에서 Salsa Coreana를 만나고 싶은지 알려주세요. 매장과 유통사에게 실제 수요를 보여줄 수 있습니다.',
      impact: '원하는 국가를 선택하고 첫 출시를 응원해주세요.',
      successLead: '응원해주셔서 감사합니다.',
      productCta: '소스 보기',
    },
    ES: {
      category: 'Lanzamiento de Salsa Coreana',
      title: 'Queremos llevar Salsa Coreana a tu mesa',
      lead: 'Cuéntanos en qué país te gustaría encontrarla. Tu apoyo nos ayuda a conversar con tiendas y distribuidores.',
      impact: 'Elige tu país y sé parte del primer lanzamiento.',
      successLead: 'Gracias por apoyar el lanzamiento.',
      productCta: 'Ver salsas',
    },
    EN: {
      category: 'Salsa Coreana launch',
      title: 'We want Salsa Coreana to reach your table',
      lead: 'Tell us where you would like to find it. Your support helps us start conversations with stores and distributors.',
      impact: 'Choose your country and join the first launch.',
      successLead: 'Thanks for supporting the launch.',
      productCta: 'View sauces',
    },
  };
  const campaign = campaignCopy[language] || campaignCopy.ES;

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
      supportCategory: campaign.category,
      supportTitle: campaign.title,
      supportLead: campaign.lead,
      supportImpactTitle: campaign.impact,
      supportNameLabel: t.nameLabel,
      supportCountryLabel: t.countryLabel,
      supportPeru: t.peru,
      supportMexico: t.mexico,
      supportChile: t.chile,
      supportColombia: t.colombia,
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
      supportSuccessLead: campaign.successLead,
      supportProductCtaLabel: campaign.productCta,
      supportShareCtaLabel: t.share,
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

  function showSuccessActions() {
    const actions = document.getElementById('supportSuccessActions');
    if (actions) actions.hidden = false;
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

  let renderedSupporterCount = 0;
  let supportFeedPublicTotal = 0;
  let supportFeedHasMore = false;
  let supportFeedLoadingMore = false;

  function updateSupportFeedMore() {
    const button = document.getElementById('supportFeedMore');
    if (!button) return;
    const remaining = Math.max(0, supportFeedPublicTotal - renderedSupporterCount);
    button.hidden = !supportFeedHasMore || remaining === 0;
    button.disabled = supportFeedLoadingMore;
    button.textContent = supportFeedLoadingMore
      ? t.feedMoreLoading
      : t.feedMore(Math.min(feedPageSize, remaining));
  }

  function renderSupportFeed(result, { append = false } = {}) {
    const totals = result?.totals || {};
    const hasCountryTotals = countryCodes.some((code) => Object.prototype.hasOwnProperty.call(totals, code));
    const total = hasCountryTotals
      ? countryCodes.reduce((sum, code) => sum + Number(totals[code] || 0), 0)
      : Number(result?.total || 0);
    const supporters = Array.isArray(result?.supporters) ? result.supporters : [];
    const totalElement = document.getElementById('supportFeedTotal');
    const totalsElement = document.getElementById('supportCountryTotals');
    const listElement = document.getElementById('supportFeedList');
    const emptyElement = document.getElementById('supportFeedEmpty');

    totalElement.textContent = t.feedTotal(total);
    supportFeedPublicTotal = Number(result?.publicTotal ?? supporters.length);
    supportFeedHasMore = Boolean(result?.hasMore);
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
      const time = document.createElement('time');
      const body = document.createElement('p');

      item.className = example ? 'support-feed-item support-feed-item--example' : 'support-feed-item';
      avatar.className = 'support-feed-avatar';
      content.className = 'support-feed-content';
      meta.className = 'support-feed-meta';
      supporterName.className = 'support-feed-name';
      time.className = 'support-feed-time';
      body.className = 'support-feed-message';

      const flagSrc = flagMap[code];
      if (flagSrc) {
        const img = document.createElement('img');
        img.src = flagSrc;
        img.alt = countryName(code) || 'Flag';
        img.className = 'support-feed-flag-img';
        img.onerror = () => {
          avatar.replaceChildren(document.createTextNode(name.slice(0, 1).toUpperCase()));
        };
        avatar.replaceChildren(img);
      } else {
        avatar.textContent = name.slice(0, 1).toUpperCase();
      }

      supporterName.textContent = name;
      time.textContent = formatSupportTime(createdAt);
      if (createdAt && !Number.isNaN(new Date(createdAt).getTime())) time.dateTime = new Date(createdAt).toISOString();
      body.textContent = message || t.feedMessage(countryName(code));

      meta.append(supporterName, time);
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

    if (!append) {
      listElement.replaceChildren();
      renderedSupporterCount = 0;
    }
    if (validSupporters.length > 0) {
      validSupporters.forEach(appendSupporter);
      renderedSupporterCount += validSupporters.length;
      emptyElement.hidden = true;
      updateSupportFeedMore();
      return;
    }

    if (append) {
      supportFeedHasMore = false;
      updateSupportFeedMore();
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
    updateSupportFeedMore();
  }

  const feedCacheKey = 'mokda_demand_support_feed_cache_v4';

  function readFeedCache() {
    try {
      const cached = JSON.parse(window.localStorage.getItem(feedCacheKey) || 'null');
      if (cached && cached.data && Array.isArray(cached.data.supporters)) {
        return cached.data;
      }
    } catch (e) {}
    return null;
  }

  function writeFeedCache(data) {
    try {
      if (data && data.ok) {
        window.localStorage.setItem(feedCacheKey, JSON.stringify({
          time: Date.now(),
          data,
        }));
      }
    } catch (e) {}
  }

  function renderSupportFeedSkeletons() {
    const listElement = document.getElementById('supportFeedList');
    const emptyElement = document.getElementById('supportFeedEmpty');
    if (!listElement) return;

    listElement.replaceChildren();
    for (let i = 0; i < 3; i++) {
      const skeleton = document.createElement('article');
      skeleton.className = 'support-feed-item support-feed-skeleton';
      skeleton.setAttribute('aria-hidden', 'true');

      const avatar = document.createElement('span');
      avatar.className = 'support-feed-avatar support-skeleton-block';

      const content = document.createElement('div');
      content.className = 'support-feed-content';

      const meta = document.createElement('div');
      meta.className = 'support-feed-meta';

      const name = document.createElement('span');
      name.className = 'support-skeleton-line support-skeleton-name';

      const time = document.createElement('span');
      time.className = 'support-skeleton-line support-skeleton-time';

      meta.append(name, time);

      const line1 = document.createElement('span');
      line1.className = 'support-skeleton-line support-skeleton-msg1';

      const line2 = document.createElement('span');
      line2.className = 'support-skeleton-line support-skeleton-msg2';

      content.append(meta, line1, line2);
      skeleton.append(avatar, content);
      listElement.appendChild(skeleton);
    }
    if (emptyElement) emptyElement.hidden = true;
  }

  async function loadSupportFeed() {
    const totalElement = document.getElementById('supportFeedTotal');
    const cachedData = readFeedCache();

    if (cachedData) {
      renderSupportFeed(cachedData);
    } else {
      renderSupportFeedSkeletons();
    }

    if (!endpoint) {
      if (!cachedData && totalElement) totalElement.textContent = t.feedTotal(0);
      supportFeedHasMore = false;
      updateSupportFeedMore();
      return;
    }

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 10000) : null;

    try {
      const feedUrl = new URL(endpoint);
      feedUrl.searchParams.set('mode', 'demand_support');
      feedUrl.searchParams.set('limit', String(feedPageSize));
      feedUrl.searchParams.set('offset', '0');
      feedUrl.searchParams.set('_', String(Date.now()));

      const response = await fetch(feedUrl.toString(), {
        method: 'GET',
        cache: 'no-store',
        signal: controller ? controller.signal : undefined,
      });
      if (timeoutId) clearTimeout(timeoutId);

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Support feed request failed');

      writeFeedCache(result);
      renderSupportFeed(result);
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('Support feed background load failure:', error);
      if (!cachedData) {
        if (totalElement) totalElement.textContent = t.feedTotal(0);
        renderSupportFeed({ total: 0, totals: {}, supporters: [] });
      }
    }
  }

  async function loadMoreSupportFeed() {
    if (!endpoint || !supportFeedHasMore || supportFeedLoadingMore) return;

    supportFeedLoadingMore = true;
    updateSupportFeedMore();
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 10000) : null;

    try {
      const feedUrl = new URL(endpoint);
      feedUrl.searchParams.set('mode', 'demand_support');
      feedUrl.searchParams.set('limit', String(feedPageSize));
      feedUrl.searchParams.set('offset', String(renderedSupporterCount));
      feedUrl.searchParams.set('_', String(Date.now()));

      const response = await fetch(feedUrl.toString(), {
        method: 'GET',
        cache: 'no-store',
        signal: controller ? controller.signal : undefined,
      });
      if (timeoutId) clearTimeout(timeoutId);

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Support feed request failed');
      renderSupportFeed(result, { append: true });
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('Support feed pagination failure:', error);
    } finally {
      supportFeedLoadingMore = false;
      updateSupportFeedMore();
    }
  }

  function showSavedSupport(saved) {
    if (getAttribution().verification) return false;
    if (!saved?.country) return false;
    const savedCountry = String(saved.country || '').toUpperCase();
    if (!countryCodes.includes(savedCountry)) return false;
    document.getElementById('supportName').value = String(saved.name || '').slice(0, 24);
    const msg = String(saved.message || '').slice(0, 180);
    document.getElementById('supportMessage').value = msg;
    const countryInput = document.querySelector(`input[name="country"][value="${savedCountry}"]`);
    if (countryInput) countryInput.checked = true;
    showSuccessActions();
    return true;
  }

  let isSubmitting = false;
  let hasTrackedSupportFormStart = false;
  let hasTrackedCountrySelection = false;

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
    const name = String(data.get('name') || '').trim().slice(0, 24);
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
      showSuccessActions();
      try {
        window.localStorage.removeItem(feedCacheKey);
      } catch (e) {}
      submit.disabled = false;
      setText('supportSubmitLabel', t.submit);
      if (result.saved === true) {
        window.MOKDA_ANALYTICS?.track(
          'support_submit',
          { element: `country_${country.toLowerCase()}` },
          { immediate: true },
        );
      }
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
  const supportForm = document.getElementById('supportForm');
  supportForm.addEventListener('submit', submitSupport);
  const trackSupportFormStart = () => {
    if (hasTrackedSupportFormStart) return;
    hasTrackedSupportFormStart = true;
    if (window.MOKDA_ANALYTICS?.trackOncePerSession) {
      window.MOKDA_ANALYTICS.trackOncePerSession(
        'support_form_start',
        'support_form_start',
        { element: 'demand_support_form' },
      );
      return;
    }
    window.MOKDA_ANALYTICS?.track('support_form_start', { element: 'demand_support_form' });
  };
  supportForm.addEventListener('input', (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
    if (!['name', 'message'].includes(field.name)) return;
    if (!String(field.value || '').trim()) return;
    trackSupportFormStart();
  });
  document.querySelectorAll('input[name="country"]').forEach((input) => {
    input.addEventListener('change', () => {
      if (hasTrackedCountrySelection || !input.checked) return;
      trackSupportFormStart();
      hasTrackedCountrySelection = true;
      window.MOKDA_ANALYTICS?.track(
        'support_country_select',
        { element: `country_${String(input.value || '').toLowerCase()}` },
        { immediate: true },
      );
    });
  });
  document.getElementById('supportFeedMore')?.addEventListener('click', loadMoreSupportFeed);
  document.getElementById('supportShareCta')?.addEventListener('click', async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}`;
    const shareData = { title: document.title, text: t.lead, url: shareUrl };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareUrl);
        showToast(t.shareCopied);
      }
      window.MOKDA_ANALYTICS?.track('support_share', { element: 'support_success_share' }, { immediate: true });
    } catch (error) {
      if (error?.name !== 'AbortError') showToast(t.error);
    }
  });
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

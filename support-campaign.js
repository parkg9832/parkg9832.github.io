(() => {
  'use strict';

  const language = window.MOKDA_I18N?.getLanguage?.() || 'ES';
  const endpoint = window.MOKDA_B2B_WEB_APP_URL || '';
  const visitorStorageKey = 'mokda_analytics_visitor_v1';
  const supportStorageKey = 'mokda_demand_support_v1';
  const copy = {
    KR: {
      visual: '당신의 응원이 첫 출시를 현실로 만듭니다',
      eyebrow: 'MOKDA DREAM PROJECT · 2026',
      title: 'Salsa Coreana의 출시를 도와주세요!',
      lead: '작은 응원이 모이면 페루와 멕시코의 마트·벤더에게 실제 수요를 보여줄 수 있습니다. 약 10초면 충분해요.',
      sentenceBefore: '저는',
      namePlaceholder: '이름 또는 닉네임',
      sentenceAfter: '입니다. Salsa Coreana를 이곳에서 만나고 싶어요!',
      countryLabel: '어디에서 만나고 싶나요?',
      peru: '페루',
      mexico: '멕시코',
      submit: '첫 출시 응원하기',
      sending: '응원을 전하고 있어요…',
      privacy: '이름은 공개되지 않으며 국가별 출시 관심도 집계에만 사용합니다.',
      success: (name, country) => `${name}님의 ${country} 출시 응원이 등록되었습니다. 감사합니다!`,
      duplicate: (country) => `이미 ${country} 출시를 응원해주셨습니다. 감사합니다!`,
      error: '등록하지 못했습니다. 잠시 후 다시 시도해주세요.',
      required: '이름과 국가를 모두 입력해주세요.',
      back: '← MOKDA 홈페이지로 돌아가기',
    },
    ES: {
      visual: 'Tu apoyo puede hacer realidad nuestro primer lanzamiento',
      eyebrow: 'MOKDA DREAM PROJECT · 2026',
      title: '¡Ayúdanos a lanzar Salsa Coreana!',
      lead: 'Cada apoyo nos ayuda a demostrar a tiendas y distribuidores que existe una demanda real. Te tomará unos 10 segundos.',
      sentenceBefore: 'Yo,',
      namePlaceholder: 'nombre o apodo',
      sentenceAfter: 'quiero encontrar Salsa Coreana en mi país.',
      countryLabel: '¿Dónde quieres encontrar MOKDA?',
      peru: 'Perú',
      mexico: 'México',
      submit: 'Apoyar el primer lanzamiento',
      sending: 'Enviando tu apoyo…',
      privacy: 'Tu nombre no se publicará. Solo se usará para medir el interés por país.',
      success: (name, country) => `¡Gracias, ${name}! Tu apoyo para el lanzamiento en ${country} ya está registrado.`,
      duplicate: (country) => `Ya registramos tu apoyo para ${country}. ¡Gracias!`,
      error: 'No pudimos registrar tu apoyo. Inténtalo de nuevo en un momento.',
      required: 'Escribe tu nombre y selecciona un país.',
      back: '← Volver a MOKDA',
    },
    EN: {
      visual: 'Your support can make our first launch real',
      eyebrow: 'MOKDA DREAM PROJECT · 2026',
      title: 'Help us launch Salsa Coreana!',
      lead: 'Every show of support helps us demonstrate real demand to retailers and distributors. It takes about 10 seconds.',
      sentenceBefore: 'I’m',
      namePlaceholder: 'name or nickname',
      sentenceAfter: 'and I want to find Salsa Coreana in my country.',
      countryLabel: 'Where should MOKDA launch?',
      peru: 'Peru',
      mexico: 'Mexico',
      submit: 'Support the first launch',
      sending: 'Sending your support…',
      privacy: 'Your name will not be displayed. It is used only to measure interest by country.',
      success: (name, country) => `Thanks, ${name}! Your support for a launch in ${country} is registered.`,
      duplicate: (country) => `You already supported a launch in ${country}. Thank you!`,
      error: 'We could not register your support. Please try again in a moment.',
      required: 'Enter your name and choose a country.',
      back: '← Back to MOKDA',
    },
  };

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

  function countryName(country, t) {
    return country === 'PE' ? t.peru : t.mexico;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function render() {
    const t = copy[language] || copy.ES;
    document.documentElement.lang = window.MOKDA_I18N.getHtmlLang(language);
    setText('supportVisualText', t.visual);
    setText('supportEyebrow', t.eyebrow);
    setText('supportTitle', t.title);
    setText('supportLead', t.lead);
    setText('supportSentenceBefore', t.sentenceBefore);
    setText('supportSentenceAfter', t.sentenceAfter);
    setText('supportNameLabel', t.namePlaceholder);
    setText('supportCountryLabel', t.countryLabel);
    setText('supportPeru', t.peru);
    setText('supportMexico', t.mexico);
    setText('supportSubmitLabel', t.submit);
    setText('supportPrivacy', t.privacy);
    setText('supportBack', t.back);
    document.getElementById('supportName').placeholder = t.namePlaceholder;
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.language === language ? 'true' : 'false');
    });
  }

  function setStatus(state, message) {
    const status = document.getElementById('supportStatus');
    status.dataset.state = state;
    status.textContent = message;
  }

  function showSavedSupport(saved) {
    if (!saved?.country) return false;
    const t = copy[language] || copy.ES;
    const country = countryName(saved.country, t);
    document.getElementById('supportForm').hidden = true;
    setStatus('success', t.duplicate(country));
    return true;
  }

  async function submitSupport(event) {
    event.preventDefault();
    const t = copy[language] || copy.ES;
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
        result.duplicate ? t.duplicate(countryName(country, t)) : t.success(name, countryName(country, t))
      );
      window.MOKDA_ANALYTICS?.track(
        'support_submit',
        { element: `country_${country.toLowerCase()}` },
        { immediate: true }
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
  document.getElementById('supportForm').addEventListener('submit', submitSupport);
  render();
  showSavedSupport(readJson(supportStorageKey));
  window.MOKDA_ANALYTICS?.track('support_page_view', { element: 'demand_support_page' });
})();

(() => {
  const i18n = window.MOKDA_I18N;
  const data = window.MOKDA_HOME_CONTENT;
  const byId = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  function renderHero(copy) {
    const hero = document.querySelector('[data-hero-slide]');
    const title = hero.querySelector('[data-hero-title]');
    const korean = /[가-힣]/.test(copy.titleLines.join(' '));
    hero.dataset.heroLayout = korean ? 'compact' : 'standard';
    title.classList.toggle('display-korean', korean);
    title.classList.toggle('display-latin', !korean);
    title.innerHTML = copy.titleLines.map(line => `<span class="hero-title-line">${escape(line)}</span>`).join(' ');
    hero.querySelector('[data-hero-kicker]').textContent = copy.kicker;
    hero.querySelector('[data-hero-subtitle]').textContent = copy.subtitle;
    const link = hero.querySelector('[data-hero-link]');
    link.textContent = copy.button;
    link.setAttribute('href', `${location.pathname}${location.search}#products`);
  }

  function renderProducts(language) {
    byId('productsGrid').innerHTML = data.products.map((product, index) => {
      const { description, uses } = product.copy[language];
      const name = escape(product.name);
      return `<div class="home-product-panel" id="home-product-panel-${index}">
        <a href="${escape(product.href)}" data-product="${name}" class="product-photo-card group flex min-w-0 flex-col overflow-hidden rounded-[1.2rem] bg-white text-left transition-all duration-300">
          <div class="home-product-image relative overflow-hidden bg-[#f5d9b8]">
            <img src="${escape(product.image)}" alt="${name} · ${escape(uses)}" width="960" height="1280" loading="lazy" decoding="async">
          </div>
          <div class="home-product-copy px-5 py-6 sm:px-7 sm:py-7">
            <div class="home-product-label">
              <p class="condensed-label mb-2 break-keep text-base uppercase leading-tight tracking-[0.04em] text-white/85 sm:text-lg">${escape(product.category)}</p>
              <h3 class="display-latin break-keep text-4xl uppercase leading-[0.88] text-white sm:text-5xl">${name}</h3>
            </div>
            <span class="block break-keep text-sm font-medium leading-6 text-slate-700">${escape(description)}</span>
            <p class="home-product-uses">${escape(uses)}</p>
          </div>
        </a>
      </div>`;
    }).join('\n');
  }

  function renderTestimonials(testimonials) {
    byId('voicesList').innerHTML = testimonials.map(item => {
      const name = escape(item.name);
      const portrait = item.image.endsWith('testimonial-no-juhyeong-160.webp')
        ? 'srcset="/assets/images/testimonial-no-juhyeong-160.webp 160w, /assets/images/testimonial-no-juhyeong-320.webp 320w" sizes="128px"'
        : '';
      return `<article aria-label="${name}" class="voice-entry py-9 sm:py-11 lg:flex lg:h-full lg:flex-col lg:rounded-[1.5rem] lg:border lg:border-[#321506]/10 lg:bg-white lg:p-8 lg:shadow-[0_12px_32px_rgba(50,21,6,0.06)]">
        <div class="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left lg:min-h-32">
          <img src="${escape(item.image)}" ${portrait} alt="${name}" width="128" height="128" class="h-28 w-28 shrink-0 rounded-full object-cover object-center ring-2 ring-white sm:h-32 sm:w-32 lg:h-28 lg:w-28" loading="lazy" decoding="async">
          <div class="min-w-0">
            <div class="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 sm:flex-nowrap sm:justify-start">
              <h3 class="break-keep text-xl font-black leading-7 text-[#321506] sm:text-2xl">${name}</h3>
              <span aria-hidden="true" class="text-sm font-semibold text-[#321506]/35">|</span>
              <p class="break-keep text-sm font-bold leading-6 text-[#321506]/78 sm:text-[15px]">${escape(item.occupation)}</p>
            </div>
            <p class="mt-1 break-keep text-xs font-semibold leading-5 text-[#321506]/55 sm:text-[13px]">${escape(item.profile)}</p>
          </div>
        </div>
        <div class="mt-6 min-w-0 lg:flex lg:flex-1">
          <blockquote class="relative rounded-[1rem] bg-[#fff8ef]/62 px-5 py-5 text-left text-[15px] font-semibold leading-7 text-[#321506]/88 sm:px-7 sm:py-6 sm:text-base sm:leading-8 lg:flex-1">${escape(item.quote)}</blockquote>
        </div>
      </article>`;
    }).join('\n');
  }

  function renderPage(language) {
    i18n.syncLanguageButtons(language);
    if (!data || document.body.dataset.contentLanguage === language) return;

    const { nav, socialTitle, voices, history, products, faq, b2b } = data.copy[language];
    document.documentElement.lang = i18n.getHtmlLang(language);
    const text = {
      'mobile-about-link': nav.about,
      'mobile-products-link': nav.products,
      'mobile-qna-link': nav.qna,
      'mobile-contact-link': nav.contact,
      socialTitle,
      voicesKicker: voices.kicker,
      voicesTitle: voices.title,
      proofKicker: history.kicker,
      proofTitle: history.title,
      proofHistoryCta: history.historyCta,
      storyBody: history.body,
      productsKicker: products.kicker,
      productsTitle: products.title,
      productsDescription: products.description,
      faqTitle: faq.title,
      faqCta: faq.cta,
      b2bKicker: b2b.kicker,
      b2bTitle: b2b.title,
      b2bDescription: b2b.description,
      b2bCtaText: b2b.cta,
    };
    Object.entries(text).forEach(([id, value]) => { byId(id).textContent = value; });
    faq.items.forEach(([question, answer], index) => {
      byId(`faqQuestion${index + 1}`).textContent = question;
      byId(`faqAnswer${index + 1}`).textContent = answer;
    });
    byId('homeHistoryMilestones').innerHTML = history.milestones.map((label, index) =>
      `<li><span class="home-history-year">${2024 + index}</span><span class="home-history-event">${escape(label)}</span></li>`).join('');
    ['proofTitle', 'faqTitle', 'b2bTitle', 'voicesTitle'].forEach(id => {
      const heading = byId(id);
      const korean = /[가-힣]/.test(heading.textContent);
      heading.classList.toggle('display-korean', korean);
      heading.classList.toggle('display-latin', !korean);
    });
    renderHero(data.hero[language]);
    renderProducts(language);
    renderTestimonials(voices.testimonials);
    window.MOKDA_FOOTER.render(language);
  }

  i18n.bindLanguageButtons(renderPage);
  renderPage(i18n.getLanguage());
})();

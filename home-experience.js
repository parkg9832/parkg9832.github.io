(() => {
  'use strict';
  const language = window.MOKDA_I18N.getLanguage();
  const fieldAlts = {
    KR: ['고추 산지를 직접 살펴보는 MOKDA', '식품 제조 현장에서 생산 공정을 확인하는 MOKDA', '한국에서 해외 진출을 준비하는 MOKDA의 업무 미팅'],
    EN: ['MOKDA visiting a chili farm', 'MOKDA reviewing production at a food manufacturing facility', 'MOKDA preparing for international expansion at a meeting in Korea'],
  }[language];
  if (fieldAlts) document.querySelectorAll('#proofCarouselTrack img').forEach(img => {
    const index = ['field-chili', 'field-manufacturing', 'field-meeting'].findIndex(name => img.src.includes(name));
    if (index !== -1) img.alt = fieldAlts[index];
  });
  const copy = {
    KR: {
      tabs: ['치킨 · 나초', '고기 · 바비큐', '밥 · 채소'],
      trials: '먹어본 사람들의 이야기', trialKicker: 'AT YOUR TABLE',
      reviewSummary: '실제 시식 후기',
      preview: '디자인 미리보기 · 실제 후기가 아닙니다', sample: '예시 카드',
      sampleQuote: '이 자리에 실제 체험단의 후기와 음식 사진이 들어갑니다.',
      sampleTitle: ['한 입의 첫인상', '우리 집 식탁에서', '다시 곁들이고 싶은 맛'],
      rating: '5점 만점에',
    },
    ES: {
      tabs: ['Pollo · Nachos', 'Carne · BBQ', 'Arroz · Verduras'],
      trials: 'Historias desde la mesa', trialKicker: 'EN TU MESA',
      reviewSummary: 'RESEÑAS REALES',
      preview: 'Vista previa de diseño · No son reseñas reales', sample: 'Tarjeta de ejemplo',
      sampleQuote: 'Aquí aparecerán una reseña real y la foto compartida por quien probó la salsa.',
      sampleTitle: ['La primera impresión', 'En nuestra mesa', 'Un sabor para repetir'],
      rating: 'de 5 estrellas:',
    },
    EN: {
      tabs: ['Chicken · Nachos', 'Meat · BBQ', 'Rice · Vegetables'],
      trials: 'Stories from the table', trialKicker: 'AT YOUR TABLE',
      reviewSummary: 'REAL TASTING REVIEWS',
      preview: 'Design preview · These are not real reviews', sample: 'Sample card',
      sampleQuote: 'A real tasting review and a photo shared by the reviewer will appear here.',
      sampleTitle: ['A first impression', 'At our table', 'A taste to come back to'],
      rating: 'out of 5 stars:',
    },
  }[language];
  // Editorial content comes from the reviewed homepage source, not a second rewrite.
  const approved = content[language];
  copy.pairKicker = approved.products.lineKicker;
  copy.pairTitle = approved.products.lineTitle;
  copy.pairLead = approved.salsa.description;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const foodPhotos = ['kpeno-pairing-editorial-20260921.jpg', 'para-carnes-pairing-editorial-20260921.jpg'];
  const products = ['K-PEÑO', 'Para Carnes'];
  const anchors = ['original', 'para-carnes'];

  const grid = document.getElementById('productsGrid');
  const productCards = [...grid.children];
  productCards.forEach((card, i) => {
    const frame = card.querySelector('.home-product-image');
    const title = frame.lastElementChild;
    title.className = 'home-product-label';
    const description = card.querySelector('.home-product-copy');
    description.querySelector('.condensed-label')?.remove();
    description.prepend(title);
    frame.querySelector('div')?.remove();
    const food = document.createElement('img');
    food.src = '/assets/images/' + foodPhotos[i];
    food.alt = products[i] + ' · ' + copy.tabs[i];
    food.width = 900; food.height = 900;
    food.loading = 'lazy'; food.decoding = 'async';
    frame.replaceChildren(food);
    const uses = document.createElement('p');
    uses.className = 'home-product-uses';
    uses.textContent = copy.tabs[i];
    description.append(uses);
    const panel = document.createElement('div');
    panel.className = 'home-product-panel'; panel.id = `home-product-panel-${i}`;
    card.before(panel); panel.append(card);
  });
  // Reading first: all food pairings are visible without choosing a tab.
  document.getElementById('productsPageCta')?.parentElement.remove();
  const lead = document.querySelector('.home-lineup-lead') || document.createElement('p');
  lead.className = 'home-lineup-lead';
  lead.textContent = copy.pairLead;
  document.querySelector('.home-products-heading').append(lead);

  const voices = document.getElementById('voices');
  document.getElementById('proof').after(voices);
  voices.after(document.getElementById('institutions'));
  document.querySelectorAll('#voicesList blockquote').forEach(quote => {
    const full = quote.textContent.replace(/^\s*“\s*/, '').trim();
    quote.textContent = full;
  });
  document.getElementById('voicesList').classList.add('home-quotes-reading');

  const isPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && new URLSearchParams(location.search).get('review_preview') === '1';
  const reviewData = window.MOKDA_TRIAL_REVIEWS;
  const localText = value => value && typeof value === 'object' ? value[language] || value.ES || value.KR || value.EN || '' : value;
  const actualReviews = (Array.isArray(reviewData) ? reviewData : []).filter(item => item && item.published === true && String(localText(item.quote) || '').trim() && String(item.name || '').trim() && String(item.source || '').trim());
  const reviews = isPreview ? copy.sampleTitle.map((title, i) => ({ name: `${copy.sample} ${i + 1}`, title, quote: copy.sampleQuote, rating: [5, 4, 5][i], product: products[i % 2], sample: true })) : actualReviews;
  document.getElementById('trial-reviews')?.remove();
  if (reviews.length) {
    const section = document.createElement('div');
    section.id = 'trial-reviews';
    section.className = 'home-trial-reviews';
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', copy.trials);
    section.innerHTML = `<div class="home-trial-summary"><span aria-hidden="true">★★★★★</span><strong>${reviews.length} ${copy.reviewSummary}</strong>${isPreview ? `<em>${copy.preview}</em>` : ''}</div><div class="home-trial-track"></div>`;
    const track = section.querySelector('.home-trial-track');
    const reviewCards = reviews.map(item => {
      const rating = typeof item.rating === 'number' && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5 ? item.rating : null;
      const photo = typeof item.photo === 'string' && /^\/assets\/images\/[a-zA-Z0-9_./-]+$/.test(item.photo) && !item.photo.includes('..') ? item.photo : '';
      return `<article class="home-trial-card">${photo ? `<img src="${escape(photo)}" alt="${escape(localText(item.product))}" loading="lazy">` : ''}<div class="home-trial-card-body">${item.sample ? `<span class="home-sample-label">${copy.sample}</span>` : ''}<p class="home-eyebrow">${escape(localText(item.product))}</p>${rating ? `<p class="home-stars" aria-label="${copy.rating} ${rating}"><span aria-hidden="true">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span></p>` : ''}<blockquote>${escape(localText(item.quote))}</blockquote><p class="home-review-author">${escape(item.name)}</p></div></article>`;
    }).join('');
    track.innerHTML = `<div class="home-trial-group">${reviewCards}</div><div class="home-trial-group" aria-hidden="true">${reviewCards}</div>`;
    document.getElementById('voicesList').after(section);
  }

  document.getElementById(`lang${language}`).disabled = true;

})();

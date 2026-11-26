(() => {
  'use strict';
  const language = window.MOKDA_I18N.getLanguage();
  const isPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) && new URLSearchParams(location.search).get('review_preview') === '1';
  // The generator already applies these editorial transforms. Preserve the
  // rendered images, reviews and card nodes when the page is opened.
  const prerendered = document.body.dataset.contentLanguage === language;
  if (prerendered && !isPreview) return;
  const copy = {
    KR: {
      trials: '먹어본 사람들의 이야기',
      preview: '디자인 미리보기 · 실제 후기가 아닙니다', sample: '예시 카드',
      sampleQuote: '이 자리에 실제 체험단의 후기와 음식 사진이 들어갑니다.',
      sampleTitle: ['한 입의 첫인상', '우리 집 식탁에서', '다시 곁들이고 싶은 맛'],
      rating: '5점 만점에',
    },
    ES: {
      trials: 'Historias desde la mesa',
      preview: 'Vista previa de diseño · No son reseñas reales', sample: 'Tarjeta de ejemplo',
      sampleQuote: 'Aquí aparecerán una reseña real y la foto compartida por quien probó la salsa.',
      sampleTitle: ['La primera impresión', 'En nuestra mesa', 'Un sabor para repetir'],
      rating: 'de 5 estrellas:',
    },
    EN: {
      trials: 'Stories from the table',
      preview: 'Design preview · These are not real reviews', sample: 'Sample card',
      sampleQuote: 'A real tasting review and a photo shared by the reviewer will appear here.',
      sampleTitle: ['A first impression', 'At our table', 'A taste to come back to'],
      rating: 'out of 5 stars:',
    },
  }[language];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const products = [...document.querySelectorAll('#productsGrid [data-product]')].map(card => card.dataset.product);
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
    section.innerHTML = `<div class="home-trial-track"></div>`;
    const track = section.querySelector('.home-trial-track');
    const reviewCards = reviews.map(item => {
      const rating = typeof item.rating === 'number' && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5 ? item.rating : null;
      const photo = typeof item.photo === 'string' && /^\/assets\/images\/[a-zA-Z0-9_./-]+$/.test(item.photo) && !item.photo.includes('..') ? item.photo : '';
      const [reviewerName, ...reviewerMetaParts] = String(item.name || '').split(' · ');
      const reviewerMetaRaw = reviewerMetaParts.join(' · ');
      const reviewCountries = { '🇵🇪':{KR:'페루',EN:'Peru'}, '🇲🇽':{KR:'멕시코',EN:'Mexico'}, '🇨🇴':{KR:'콜롬비아',EN:'Colombia'}, '🇰🇷':{KR:'한국',EN:'Korea'} };
      const countryFlag = Object.keys(reviewCountries).find(flag => reviewerMetaRaw.includes(flag));
      const reviewerMeta = countryFlag && language !== 'ES' ? `${reviewCountries[countryFlag][language]} ${countryFlag}` : reviewerMetaRaw;
      return `<article class="home-trial-card">${photo ? `<img src="${escape(photo)}" alt="${escape(localText(item.product))}" loading="lazy">` : ''}<div class="home-trial-card-body">${item.sample ? `<span class="home-sample-label">${copy.sample}</span>` : ''}${rating ? `<p class="home-stars" aria-label="${copy.rating} ${rating}"><span aria-hidden="true">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span></p>` : ''}<p class="home-review-author"><strong>${escape(reviewerName)}</strong>${reviewerMeta ? `<span>${escape(reviewerMeta)}</span>` : ''}</p><blockquote>${escape(localText(item.quote))}</blockquote></div></article>`;
    }).join('');
    track.innerHTML = `<div class="home-trial-group">${reviewCards}</div><div class="home-trial-group" aria-hidden="true">${reviewCards}</div>`;
    document.getElementById('voicesList').after(section);
  }

  document.getElementById(`lang${language}`).disabled = true;

})();

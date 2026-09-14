(() => {
  'use strict';
  const language = window.MOKDA_I18N.getLanguage();
  const labels = {
    KR: { product: '제품 사진', food: '음식과 함께', choose: '제품 선택' },
    ES: { product: 'Las salsas', food: 'En tu mesa', choose: 'Elegir salsa' },
    EN: { product: 'The sauces', food: 'On your table', choose: 'Choose a sauce' },
  }[language];
  const definitions = {
    original: { name: 'K-PEÑO' },
    'para-carnes': { name: 'Para Carnes' },
  };

  if (!document.body.classList.contains('products-page')) return;
  Object.keys(definitions).forEach(key => {
    const article = document.getElementById(key);
    const food = article.querySelector('img');
    const visual = food.parentElement;
    visual.classList.add('product-food-only');
    food.alt = `${definitions[key].name} · ${labels.food}`;
  });
  const heroAlt = { KR: '타코, 치킨과 함께 소개하는 MOKDA Salsa Coreana', ES: 'Línea Salsa Coreana de MOKDA con tacos, pollo y salsas', EN: 'MOKDA Salsa Coreana with tacos, chicken and sauces' }[language];
  document.querySelector('main img').alt = heroAlt;
})();

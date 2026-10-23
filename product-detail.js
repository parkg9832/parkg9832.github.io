(() => {
  'use strict';
  const id = document.body.dataset.productDetail;
  const language = window.MOKDA_I18N.getLanguage();
  const details = {
    kpeno: {
      slug: 'kpeno', product: 'K-PEÑO', category: 'GOCHUJANG + JALAPEÑO', color: 'kpeno',
      ES: { kicker:'DETALLE DEL PRODUCTO', title:'K-PEÑO', subtitle:'Una salsa coreana de gochujang y jalapeño para acompañar tus comidas favoritas.', back:'Ver la línea Salsa Coreana', inquiryKicker:'MOKDA B2B', inquiryTitle:'Conversemos sobre K-PEÑO.', inquiry:'Enviar consulta' },
      KR: { kicker:'제품 상세', title:'K-PEÑO', subtitle:'고추장과 할라피뇨로 만든 한국 소스입니다. 평소 즐기는 음식에 찍어 드세요.', back:'Salsa Coreana 라인업 보기', inquiryKicker:'MOKDA B2B', inquiryTitle:'K-PEÑO에 관해 문의하세요.', inquiry:'문의 보내기' },
      EN: { kicker:'PRODUCT DETAIL', title:'K-PEÑO', subtitle:'A Korean gochujang and jalapeño sauce for dipping your everyday favorites.', back:'View Salsa Coreana lineup', inquiryKicker:'MOKDA B2B', inquiryTitle:'Let’s talk about K-PEÑO.', inquiry:'Send an inquiry' }
    },
    'para-carnes': {
      slug: 'para-carnes', product: 'Para Carnes', category: 'SSAMJANG', color: 'para-carnes',
      ES: { kicker:'DETALLE DEL PRODUCTO', title:'PARA CARNES', subtitle:'Una salsa coreana a base de ssamjang, de sabor intenso, para carnes y verduras.', back:'Ver la línea Salsa Coreana', inquiryKicker:'MOKDA B2B', inquiryTitle:'Conversemos sobre Para Carnes.', inquiry:'Enviar consulta' },
      KR: { kicker:'제품 상세', title:'PARA CARNES', subtitle:'쌈장으로 만든 고기·채소용 소스입니다. 깊고 진한 감칠맛을 즐겨보세요.', back:'Salsa Coreana 라인업 보기', inquiryKicker:'MOKDA B2B', inquiryTitle:'Para Carnes에 관해 문의하세요.', inquiry:'문의 보내기' },
      EN: { kicker:'PRODUCT DETAIL', title:'PARA CARNES', subtitle:'A rich, savory Korean dipping sauce based on ssamjang, for meat and vegetables.', back:'View Salsa Coreana lineup', inquiryKicker:'MOKDA B2B', inquiryTitle:'Let’s talk about Para Carnes.', inquiry:'Send an inquiry' }
    }
  };
  const detail = details[id];
  if (!detail) return;
  const copy = detail[language] || detail.ES;
  // Translated from the existing public product artwork, not a new specification.
  const localizedPresentation = {
    EN: {
      brochure: 'Original Spanish product brochure',
      informationTitle: 'Product information',
      labels: { content: 'Net content', storage: 'Storage', shelfLife: 'Shelf life', origin: 'Origin', allergens: 'Ingredients and allergens', warning: 'Warning' },
      values: { content: '330 g', storage: 'Store at room temperature; refrigerate after opening.', shelfLife: '12 months from manufacture.', origin: 'South Korea', warning: 'HIGH IN SODIUM' },
      informationNote: 'Information from the product presentation. Check the packaging to confirm the complete current ingredient list, allergens and instructions.',
      storyTitle: 'It started with a question',
      storyBody: 'The idea for Salsa Coreana came from meals our founder shared in Latin America. He saw sauces served with chicken, meat and snacks, and wanted to make a Korean sauce that would go just as well with those familiar foods.',
      kpeno: {
        photo: 'K-PEÑO bottle with tacos, nachos, chicken and dipping sauce',
        tasteTitle: 'Flavor profile', tasteBody: 'Medium heat with umami, jalapeño tang and a creamy texture.',
        recipeTitle: 'Gochujang and jalapeño', recipeBody: 'Gochujang gives the sauce its savory heat, with a tangy kick from jalapeño. Allulose balances the sweetness, and cream made with vegetable fat gives it a smooth texture.',
        pairingsTitle: 'Open, dip and enjoy', pairingsBody: 'A dipping sauce for tacos, nachos, chicken, fries, pizza and other everyday favorites.',
        allergens: 'Contains milk, soy, wheat and tomato.'
      },
      'para-carnes': {
        photo: 'Para Carnes bottle with grilled meat, vegetables and dipping sauce',
        tasteTitle: 'Flavor profile', tasteBody: 'Mild heat with deep umami, doenjang flavor and toasted notes.',
        recipeTitle: 'Doenjang, gochujang, sesame and shiitake', recipeBody: 'Doenjang and gochujang form the fermented base, with toasted sesame, sesame oil and shiitake extract for a rich, savory flavor.',
        pairingsTitle: 'Open, dip and enjoy', pairingsBody: 'Serve it with any kind of meat or vegetables. Just open, squeeze, dip and enjoy.',
        allergens: 'The product presentation lists soy and wheat. The recipe also includes sesame and sesame oil.'
      }
    },
    KR: {
      brochure: '원본 스페인어 제품 소개',
      informationTitle: '제품 정보',
      labels: { content: '내용량', storage: '보관 방법', shelfLife: '소비기한', origin: '원산지', allergens: '원재료 및 알레르기 유발 원료', warning: '주의 표시' },
      values: { content: '330 g', storage: '개봉 전 상온 보관, 개봉 후 냉장 보관.', shelfLife: '제조일부터 12개월.', origin: '대한민국', warning: '나트륨 함량 높음' },
      informationNote: '제품 소개 자료에 기재된 정보입니다. 현재 전체 원재료, 알레르기 유발 원료 및 보관 안내는 제품 포장에서 확인해주세요.',
      storyTitle: '하나의 고민에서 시작됐습니다',
      storyBody: 'Salsa Coreana는 라틴아메리카에서 치킨, 고기, 스낵에 소스를 곁들이는 모습을 보고 구상했습니다. 익숙한 음식에 한국 소스를 더하면 어떨까 하는 고민이 제품 개발로 이어졌습니다.',
      kpeno: {
        photo: '타코, 나초, 치킨과 디핑소스가 함께 놓인 K-PEÑO 병',
        tasteTitle: '맛의 특징', tasteBody: '중간 정도의 매운맛에 감칠맛, 할라피뇨의 산미와 부드러운 질감이 어우러집니다.',
        recipeTitle: '고추장과 할라피뇨', recipeBody: '고추장에 할라피뇨를 더해 감칠맛과 매운맛, 산미를 살렸습니다. 알룰로스로 단맛을 맞추고, 식물성 지방으로 만든 크림으로 부드러운 질감을 냈습니다.',
        pairingsTitle: '열고, 찍고, 즐기세요', pairingsBody: '타코, 나초, 치킨, 감자튀김, 피자 등 평소 즐기는 음식에 잘 어울리는 소스입니다.',
        allergens: '우유, 대두, 밀, 토마토 함유.'
      },
      'para-carnes': {
        photo: '구운 고기, 채소와 디핑소스가 함께 놓인 Para Carnes 병',
        tasteTitle: '맛의 특징', tasteBody: '순한 매운맛에 된장의 깊은 감칠맛과 고소한 풍미가 어우러집니다.',
        recipeTitle: '된장, 고추장, 참깨와 표고버섯', recipeBody: '된장과 고추장에 볶은 참깨, 참기름, 표고버섯 추출물을 더했습니다. 발효장의 감칠맛과 참깨의 고소한 맛을 느낄 수 있습니다.',
        pairingsTitle: '열고, 찍고, 즐기세요', pairingsBody: '모든 고기와 채소에 곁들여보세요. 편하게 열고 짜고 소스에 찍어 즐기면 됩니다.',
        allergens: '제품 소개 자료에는 대두와 밀로 표시돼 있습니다. 레시피에는 참깨와 참기름도 포함돼 있습니다.'
      }
    }
  };
  const base = '/assets/images/detail-pages/' + detail.slug + '-detail-';
  const numbers = ['01','02','03','04','05','06','07','08','09'];
  // Intrinsic sizes reserve the entire sequence before lazy images arrive.
  const imageHeights = id === 'kpeno'
    ? [1355,1090,1042,737,3622,1655,1833,1310,2323]
    : [1419,1090,1042,737,3622,1781,1833,1305,2323];
  const inquiryProduct = id === 'kpeno' ? 'original' : 'para-carnes';
  const content = document.getElementById('productDetailContent');
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
  const renderArtworks = prioritizeFirst => numbers.map((number, index) => {
    const loading = prioritizeFirst && index === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
    return `<figure class="detail-artwork" data-detail-section="${number}"><img src="${base}${number}.jpg" alt="${detail.product} · ${index + 1}" width="900" height="${imageHeights[index]}" ${loading} decoding="async" /></figure>`;
  }).join('');
  const renderInquiry = () => `<section class="detail-inquiry"><div><div><p>${copy.inquiryKicker}</p><h2>${copy.inquiryTitle}</h2></div><a href="contact.html?purpose=distribution&product=${inquiryProduct}">${copy.inquiry} →</a></div></section>`;
  const businessLabel = {KR:'거래·샘플 상담', ES:'Consultar distribución y muestras', EN:'Distribution & sample inquiry'}[language];
  const businessLink = () => `<a class="detail-business-link" data-chat-intent="business" data-product="${escape(detail.product)}" href="contact.html?purpose=distribution&product=${inquiryProduct}">${escape(businessLabel)} <span aria-hidden="true">→</span></a>`;
  // Prerendered markup carries its language, so loaded images remain in place.
  if (content.dataset.detailLanguage !== language) {
    if (language === 'ES') content.innerHTML = `
    <section class="detail-image-sequence detail-page-${detail.color}" aria-label="${detail.product}">
      <div class="detail-sequence-nav">
        <a class="detail-back" href="products.html#${id === 'kpeno' ? 'original' : 'para-carnes'}">← ${copy.back}</a>
        ${businessLink()}
        <div class="detail-visually-hidden">
          <p>${copy.kicker} · ${detail.category}</p>
          <h1>${copy.title}</h1>
          <p>${copy.subtitle}</p>
        </div>
      </div>
      <div class="detail-artworks">${renderArtworks(true)}</div>
      <p class="detail-source-note">Salsa Coreana · ${detail.product}</p>
    </section>
    ${renderInquiry()}`;
    else {
      const presentation = localizedPresentation[language] || localizedPresentation.EN;
      const product = presentation[id];
      const facts = { ...presentation.values, allergens: product.allergens };
      const photo = id === 'kpeno' ? 'kpeno' : 'para-carnes';
      content.innerHTML = `
        <div class="detail-localized-nav"><a class="detail-back" href="products.html#${id === 'kpeno' ? 'original' : 'para-carnes'}">← ${escape(copy.back)}</a>${businessLink()}</div>
        <section class="detail-localized-hero detail-page-${detail.color}" aria-labelledby="detailTitle">
          <div class="detail-localized-photo"><img src="/assets/images/${photo}-food-product-centered-20260922.webp" alt="${escape(product.photo)}" width="960" height="1280" fetchpriority="high" decoding="async" /></div>
          <div class="detail-localized-introduction">
            <p class="detail-localized-kicker">${escape(copy.kicker)} · ${escape(detail.category)}</p>
            <h1 id="detailTitle">${escape(copy.title)}</h1>
            <p class="detail-localized-subtitle">${escape(product.tasteBody)}</p>
            <div class="detail-introduction-features">
              <article><h2>${escape(product.recipeTitle)}</h2><p>${escape(product.recipeBody)}</p></article>
              <article><h2>${escape(product.pairingsTitle)}</h2><p>${escape(product.pairingsBody)}</p></article>
            </div>
          </div>
        </section>
        <section class="detail-localized-reading" aria-label="${escape(detail.product)}">
          <section class="detail-localized-story"><h2>${escape(presentation.storyTitle)}</h2><p>${escape(presentation.storyBody)}</p></section>
          <details class="detail-original-brochure" open><summary>${escape(presentation.brochure)}</summary><div class="detail-artworks" lang="es">${renderArtworks(false)}</div></details>
          <section class="detail-localized-information" aria-labelledby="detailInformationTitle">
            <h2 id="detailInformationTitle">${escape(presentation.informationTitle)}</h2>
            <dl>${['content', 'storage', 'shelfLife', 'origin', 'allergens', 'warning'].map(key => `<div><dt>${escape(presentation.labels[key])}</dt><dd>${escape(facts[key])}</dd></div>`).join('')}</dl>
            <p class="detail-information-note">${escape(presentation.informationNote)}</p>
          </section>
        </section>
        ${renderInquiry()}`;
    }
    content.dataset.detailLanguage = language;
  }
  window.MOKDA_FOOTER?.render(language);
  window.MOKDA_I18N.syncLanguageButtons(language);
  window.MOKDA_I18N.bindLanguageButtons(() => {});
})();

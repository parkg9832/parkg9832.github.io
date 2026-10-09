(() => {
  'use strict';
  const id = document.body.dataset.productDetail;
  const language = window.MOKDA_I18N.getLanguage();
  const details = {
    kpeno: {
      slug: 'kpeno', product: 'K-PEÑO', category: 'GOCHUJANG + JALAPEÑO', color: 'kpeno',
      ES: { kicker:'DETALLE DEL PRODUCTO', title:'K-PEÑO', subtitle:'Una salsa coreana de mesa con gochujang y jalapeño. Ábrela, sírvela y acompaña la comida que ya te gusta.', back:'Ver línea Salsa Coreana', inquiryKicker:'MOKDA B2B', inquiryTitle:'Conversemos sobre K-PEÑO.', inquiry:'Enviar consulta' },
      KR: { kicker:'제품 상세', title:'K-PEÑO', subtitle:'고추장과 할라피뇨를 담은 한국식 테이블 소스입니다. 열고, 담고, 익숙한 음식에 찍어 즐겨보세요.', back:'Salsa Coreana 라인업 보기', inquiryKicker:'MOKDA B2B', inquiryTitle:'K-PEÑO에 관해 문의하세요.', inquiry:'문의 보내기' },
      EN: { kicker:'PRODUCT DETAIL', title:'K-PEÑO', subtitle:'A Korean table sauce with gochujang and jalapeño. Open, serve, and pair it with the food you already love.', back:'View Salsa Coreana lineup', inquiryKicker:'MOKDA B2B', inquiryTitle:'Let’s talk about K-PEÑO.', inquiry:'Send an inquiry' }
    },
    'para-carnes': {
      slug: 'para-carnes', product: 'Para Carnes', category: 'SSAMJANG', color: 'para-carnes',
      ES: { kicker:'DETALLE DEL PRODUCTO', title:'PARA CARNES', subtitle:'Una salsa coreana inspirada en el ssamjang, pensada para acompañar carnes y verduras con un umami profundo.', back:'Ver línea Salsa Coreana', inquiryKicker:'MOKDA B2B', inquiryTitle:'Conversemos sobre Para Carnes.', inquiry:'Enviar consulta' },
      KR: { kicker:'제품 상세', title:'PARA CARNES', subtitle:'쌈장에서 영감을 받은 한국 소스입니다. 고기와 채소에 깊은 감칠맛을 더해보세요.', back:'Salsa Coreana 라인업 보기', inquiryKicker:'MOKDA B2B', inquiryTitle:'Para Carnes에 관해 문의하세요.', inquiry:'문의 보내기' },
      EN: { kicker:'PRODUCT DETAIL', title:'PARA CARNES', subtitle:'A Korean sauce inspired by ssamjang, made to bring deep umami to meat and vegetables.', back:'View Salsa Coreana lineup', inquiryKicker:'MOKDA B2B', inquiryTitle:'Let’s talk about Para Carnes.', inquiry:'Send an inquiry' }
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
      storyTitle: 'It began with a question',
      storyBody: 'Salsa Coreana grew from the everyday Latin American meals its founder experienced firsthand. Seeing sauces served with chicken, meat, snacks and everyday food sparked a question: what if Korean flavors could join these familiar meals?',
      kpeno: {
        photo: 'K-PEÑO bottle with tacos, nachos, chicken and dipping sauce',
        tasteTitle: 'Flavor profile', tasteBody: 'Medium heat with umami, jalapeño tang and a creamy texture.',
        recipeTitle: 'Gochujang and jalapeño', recipeBody: 'Gochujang brings umami and heat, while jalapeño adds a tangy note. Allulose provides balanced sweetness, and cream made with vegetable fat adds a smooth, creamy texture.',
        pairingsTitle: 'Open, serve and pair', pairingsBody: 'Pair it with chicken, fries, nachos, tequeños and other snacks. Try it with tacos and your everyday meals, too.',
        allergens: 'Contains milk, soy, wheat and tomato.'
      },
      'para-carnes': {
        photo: 'Para Carnes bottle with grilled meat, vegetables and dipping sauce',
        tasteTitle: 'Flavor profile', tasteBody: 'Mild heat with deep umami, doenjang flavor and toasted notes.',
        recipeTitle: 'Doenjang, gochujang, sesame and shiitake', recipeBody: 'Doenjang and gochujang create a savory fermented base. Toasted sesame, sesame oil and shiitake extract add umami and toasted notes.',
        pairingsTitle: 'For dipping cooked meat', pairingsBody: 'Pair it with grilled, steamed or boiled meat, chicken and anticuchos. It also goes with vegetables. Cook the meat, dip and enjoy.',
        allergens: 'The product presentation lists soy and wheat. The recipe also includes sesame and sesame oil.'
      }
    },
    KR: {
      brochure: '원본 스페인어 제품 소개',
      informationTitle: '제품 정보',
      labels: { content: '내용량', storage: '보관 방법', shelfLife: '보관 기간', origin: '원산지', allergens: '원재료 및 알레르기 유발 원료', warning: '주의 표시' },
      values: { content: '330 g', storage: '개봉 전 상온 보관, 개봉 후 냉장 보관.', shelfLife: '제조일부터 12개월.', origin: '대한민국', warning: '나트륨 함량 높음' },
      informationNote: '제품 소개 자료에 기재된 정보입니다. 현재 전체 원재료, 알레르기 유발 원료 및 보관 안내는 제품 포장에서 확인해주세요.',
      storyTitle: '하나의 질문에서 시작됐습니다',
      storyBody: 'Salsa Coreana는 대표가 직접 경험한 라틴아메리카의 일상 식탁에서 시작됐습니다. 치킨, 고기, 스낵에 자연스럽게 소스를 곁들이는 모습을 보며, 익숙한 식사에 한국의 맛을 더할 수 있을지 생각했습니다.',
      kpeno: {
        photo: '타코, 나초, 치킨과 디핑소스가 함께 놓인 K-PEÑO 병',
        tasteTitle: '맛의 특징', tasteBody: '중간 정도의 매운맛에 감칠맛, 할라피뇨의 산미와 부드러운 질감이 어우러집니다.',
        recipeTitle: '고추장과 할라피뇨', recipeBody: '고추장의 감칠맛과 매운맛에 할라피뇨의 산미를 더했습니다. 알룰로스로 단맛의 균형을 맞추고, 식물성 지방으로 만든 크림으로 부드러운 질감을 더했습니다.',
        pairingsTitle: '열고, 담고, 곁들이세요', pairingsBody: '치킨, 감자튀김, 나초, 테케뇨 등 스낵에 잘 어울립니다. 타코나 평소 즐기는 음식에도 곁들여보세요.',
        allergens: '우유, 대두, 밀, 토마토 함유.'
      },
      'para-carnes': {
        photo: '구운 고기, 채소와 디핑소스가 함께 놓인 Para Carnes 병',
        tasteTitle: '맛의 특징', tasteBody: '순한 매운맛에 된장의 깊은 감칠맛과 고소한 풍미가 어우러집니다.',
        recipeTitle: '된장, 고추장, 참깨와 표고버섯', recipeBody: '된장과 고추장을 바탕으로 깊은 발효 풍미를 담았습니다. 볶은 참깨, 참기름과 표고버섯 추출물이 감칠맛과 고소한 풍미를 더합니다.',
        pairingsTitle: '익힌 고기에 찍어 즐기세요', pairingsBody: '구운 고기, 찐 고기, 삶은 고기, 치킨과 안티쿠초에 곁들여보세요. 채소와도 잘 어울립니다. 고기를 익힌 뒤 소스에 찍어 즐기면 됩니다.',
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
  // Prerendered markup carries its language, so loaded images remain in place.
  if (content.dataset.detailLanguage !== language) {
    if (language === 'ES') content.innerHTML = `
    <section class="detail-image-sequence detail-page-${detail.color}" aria-label="${detail.product}">
      <div class="detail-sequence-nav">
        <a class="detail-back" href="products.html#${id === 'kpeno' ? 'original' : 'para-carnes'}">← ${copy.back}</a>
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
        <div class="detail-localized-nav"><a class="detail-back" href="products.html#${id === 'kpeno' ? 'original' : 'para-carnes'}">← ${escape(copy.back)}</a></div>
        <section class="detail-localized-hero detail-page-${detail.color}" aria-labelledby="detailTitle">
          <div class="detail-localized-photo"><img src="/assets/images/${photo}-food-product-centered-20260922.webp" alt="${escape(product.photo)}" width="960" height="1280" fetchpriority="high" decoding="async" /></div>
          <div class="detail-localized-introduction">
            <p class="detail-localized-kicker">${escape(copy.kicker)} · ${escape(detail.category)}</p>
            <h1 id="detailTitle">${escape(copy.title)}</h1>
            <p class="detail-localized-subtitle">${escape(copy.subtitle)}</p>
            <div class="detail-localized-taste"><h2>${escape(product.tasteTitle)}</h2><p>${escape(product.tasteBody)}</p></div>
          </div>
        </section>
        <section class="detail-localized-reading" aria-label="${escape(detail.product)}">
          <div class="detail-localized-features">
            <article><h2>${escape(product.recipeTitle)}</h2><p>${escape(product.recipeBody)}</p></article>
            <article><h2>${escape(product.pairingsTitle)}</h2><p>${escape(product.pairingsBody)}</p></article>
          </div>
          <section class="detail-localized-information" aria-labelledby="detailInformationTitle">
            <h2 id="detailInformationTitle">${escape(presentation.informationTitle)}</h2>
            <dl>${['content', 'storage', 'shelfLife', 'origin', 'allergens', 'warning'].map(key => `<div><dt>${escape(presentation.labels[key])}</dt><dd>${escape(facts[key])}</dd></div>`).join('')}</dl>
            <p class="detail-information-note">${escape(presentation.informationNote)}</p>
          </section>
          <section class="detail-localized-story"><h2>${escape(presentation.storyTitle)}</h2><p>${escape(presentation.storyBody)}</p></section>
          <details class="detail-original-brochure"><summary>${escape(presentation.brochure)}</summary><div class="detail-artworks" lang="es">${renderArtworks(false)}</div></details>
        </section>
        ${renderInquiry()}`;
    }
    content.dataset.detailLanguage = language;
  }
  window.MOKDA_FOOTER?.render(language);
  window.MOKDA_I18N.syncLanguageButtons(language);
  window.MOKDA_I18N.bindLanguageButtons(() => {});
})();

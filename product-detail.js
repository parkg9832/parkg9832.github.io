(() => {
  'use strict';
  const id = document.body.dataset.productDetail;
  const language = window.MOKDA_I18N.getLanguage();
  const details = {
    kpeno: {
      slug: 'kpeno', product: 'K-PEÑO', category: 'GOCHUJANG + JALAPEÑO', color: 'kpeno',
      ES: { kicker:'DETALLE DEL PRODUCTO', title:'K-PEÑO', subtitle:'Una salsa coreana de mesa con gochujang y jalapeño. Ábrela, sírvela y acompaña la comida que ya te gusta.', back:'Ver línea Salsa Coreana', inquiryKicker:'MOKDA B2B', inquiryTitle:'Conversemos sobre K-PEÑO.', inquiry:'Enviar consulta' },
      KR: { kicker:'제품 상세', title:'K-PEÑO', subtitle:'고추장과 할라피뇨를 담은 한국식 테이블 소스입니다. 익숙한 음식에 열고, 곁들이고, 즐겨보세요.', back:'Salsa Coreana 라인업 보기', inquiryKicker:'MOKDA B2B', inquiryTitle:'K-PEÑO에 관해 문의하세요.', inquiry:'문의 보내기' },
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
  const base = '/assets/images/detail-pages/' + detail.slug + '-detail-';
  const numbers = ['01','02','03','04','05','06','07','08','09'];
  // Intrinsic sizes reserve the entire sequence before lazy images arrive.
  const imageHeights = id === 'kpeno'
    ? [1355,1090,1042,737,3622,1655,1833,1310,2323]
    : [1419,1090,1042,737,3622,1781,1833,1305,2323];
  const inquiryProduct = id === 'kpeno' ? 'original' : 'para-carnes';
  const content = document.getElementById('productDetailContent');
  // Localized pages already contain this markup; keep loaded images in place.
  if (!content.querySelector('.detail-artworks')) content.innerHTML = `
    <section class="detail-image-sequence detail-page-${detail.color}" aria-label="${detail.product}">
      <div class="detail-sequence-nav">
        <a class="detail-back" href="products.html#${id === 'kpeno' ? 'original' : 'para-carnes'}">← ${copy.back}</a>
        <div class="detail-visually-hidden">
          <p>${copy.kicker} · ${detail.category}</p>
          <h1>${copy.title}</h1>
          <p>${copy.subtitle}</p>
        </div>
      </div>
      <div class="detail-artworks">${numbers.map((number, index) => {
        const loading = index === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
        return `<figure class="detail-artwork" data-detail-section="${number}"><img src="${base}${number}.jpg" alt="${detail.product} · ${index + 1}" width="900" height="${imageHeights[index]}" ${loading} decoding="async" /></figure>`;
      }).join('')}</div>
      <p class="detail-source-note">Salsa Coreana · ${detail.product}</p>
    </section>
    <section class="detail-inquiry"><div><div><p>${copy.inquiryKicker}</p><h2>${copy.inquiryTitle}</h2></div><a href="contact.html?purpose=distribution&product=${inquiryProduct}">${copy.inquiry} →</a></div></section>`;
  window.MOKDA_FOOTER?.render(language);
  window.MOKDA_I18N.syncLanguageButtons(language);
  window.MOKDA_I18N.bindLanguageButtons(() => {});
})();

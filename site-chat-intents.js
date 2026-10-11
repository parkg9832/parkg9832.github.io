/* Match public MOKDA answers locally. Unclear requests stay with the visitor. */
(function () {
  'use strict';

  var MAX_LENGTH = 500;
  var has = function (text, pattern) { return pattern.test(text); };
  var normalize = function (value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC')
      .toLowerCase().replace(/[‐‑–—]/g, '-').replace(/\s+/g, ' ').trim();
  };
  var brandName = /\b(?:mokda|salsa coreana)\b|(?:^|[^가-힣])먹다(?:$|[^가-힣])/;
  var unrelated = /\b(?:bitcoin|ethereum|crypto|iphone|samsung|weather|forecast|horoscope|football|soccer|politics|election|programming|javascript|python|clima|meteorologico|horoscopo|futbol|politica|elecciones|programacion)\b|날씨|환율|비트코인|주식|아이폰|축구|운세|프로그래밍/;

  // These are explicit requests, not guesses based only on a brand or product name.
  var rules = [
    ['ingredients', /\b(?:ingredients?|allergens?|allergies|allergic|gluten|vegan|vegetarian|halal|kosher|certifications?|certified|celiac|celiaco|ingredientes?|alergenos?|alergias?|alergico|vegano|vegetariano|certificacion|certificado|lactose|lactosa|pregnant|pregnancy|embarazada|embarazo)\b|원재료|성분|알레르[겐기]|글루텐|비건|채식|할랄|인증|임산부|임신|먹어도\s*(?:돼|되|괜찮)|(?:우유|대두|참깨|참기름|토마토|밀가루).{0,15}(?:함유|포함|들어|있|없)|(?:^|[^가-힣])밀(?:(?:함유|포함)|(?:은|이|을|가|\s).{0,15}(?:함유|포함|들어|있|없))|\b(?:contains?|contiene|tiene)\s+(?:milk|soy|wheat|sesame|nuts?|peanuts?|dairy|eggs?|leche|soya|soja|trigo|sesamo|mani|lacteos)\b|\b(?:nut[- ]free|dairy[- ]free|safe to eat)\b/],
    ['storage', /보관|냉장|냉동|상온|유통기한|소비기한|개봉|\b(?:stor(?:e|ing|age)|refrigerat(?:e|ion|ed)|refrigerator|fridge|shelf[- ]life|expir(?:y|ation|e)|conserv(?:ar|acion|arlas)|refriger(?:ar|acion|adas|arlas)|almacen(?:ar|o|amiento)|vencimiento|caducidad|abrir|abierta|abierto)\b/],
    ['pricing', /가격|단가|견적|최소\s*주문|최소\s*수량|최소발주|샘플|얼마(?!나|동안|\s+(?:동안|오래|매|맵|보관))|\b(?:prices?|pricing|quotation|quote|moq|samples?|precios?|cotizacion|muestras?)\b|\b(?:minimum|minimo)\s+(?:order|orders|pedido|pedidos|quantity|quantities)\b|\bpedido\s+minimo\b|\bcuanto\s+(?:cuesta|cuestan|vale|valen)\b|\bhow much\s+(?:is|are|does)\b/],
    ['buy', /구매|구입|구매처|판매처|살\s*(?:수|곳)|어디(?:서|에서)\s*(?:사|팔)|재고|\b(?:buy|buying|purchase|comprar|comprarlas|compro|compran|disponibilidad|availability)\b|\b(?:where|donde)\b.{0,45}\b(?:sold|sell|selling|venden|vende|venta)\b|\b(?:in stock|online shop)\b/],
    ['choose', /추천|어떤\s*(?:소스|제품)|제품\s*(?:종류|차이|비교)|소스\s*(?:종류|차이|비교)|맛(?:이|은|을|\s|\?)|매[워운콤]|맵(?:나|니|죠|다|기)|덜\s*매|\b(?:recommend(?:ation|ations|ed)?|choose|spicy|mild|taste|flavo(?:r|ur)|difference|compare|picante|sabor|sabores|recomienda|recomiendan|recomiendas|recomendar|elegir|diferencia|comparar)\b|\b(?:which|what|que|cual)\s+(?:sauce|salsa|products?|productos?)\b/],
    ['pairings', /활용|사용법|곁들|어울리|찍어|뭐(?:랑|에)\s*먹|어떻게\s*(?:먹|쓰|사용)|\b(?:pair(?:ing|ings|s)?|serving ideas?|recipes?|recetas?|acompana|acompanar|dipear)\b|\b(?:what foods?|con que comidas?|how to use|como\s+(?:usar|usarlas|se usa))\b/],
    ['export', /수출|수입|유통\s*(?:협업|제안|문의|파트너)|유통하고|유통할|수입하고|수입할|\b(?:import|importing|export|exporting|distribute|distribuir|importar|exportar|distribution proposal)\b/],
    ['horeca', /매장(?:이나|에서).*?(?:사용|판매|도입)|(?:레스토랑|식당|호텔|카페).*?(?:사용|판매|도입|납품)|납품|\bhoreca\b|\b(?:my|our|mi|nuestro|nuestra)\s+(?:shop|store|restaurant|hotel|cafe|tienda|restaurante)\b|\b(?:offer|serve|usar|ofrecer)\b.{0,40}\b(?:restaurant|shop|store|restaurante|tienda)\b/],
    ['history', /연혁|역사|시작|설립|\b(?:history|began|begin|start(?:ed)?|found(?:ed|ing)|origin|historia|comenzo|comenzar|origen|nacio)\b/],
    ['collaboration', /협업(?:을|에|\s)*(?:제안|문의|하고|할)|콜라보(?:를|에|\s)*(?:제안|문의|하고|할)|\b(?:propos(?:e|al)|proponer|propuesta)\b.{0,45}\b(?:collaboration|colaboracion|partnership|content|contenido)\b|\b(?:want|like|interested|quiero)\b.{0,25}\b(?:collaboration|colaboracion)\b|\b(?:collaborate|colaborar|partnership)\b/],
    ['contact', /상담원|담당자|연락처|상담\s*(?:연결|받|원해|하고)|사람(?:과|이|한테)\s*(?:상담|대화|문의)|(?:찾는\s*답변|답변이)\s*없|\b(?:whatsapp|contact|contacto|contactar|human|agent|representative|representante|asesor|correo|email|e-mail)\b|\b(?:cannot|can't|no puedo|no encuentro)\b.{0,35}\b(?:answer|respuesta)\b/],
  ];

  var shortQueries = {
    choose: ['제품', '소스', 'k-peno', 'kpeno', 'para carnes', 'sauces', 'salsas', 'products', 'productos'],
    pairings: ['타코', '치킨', '피자', '나초', '고기', '채소', 'tacos', 'chicken', 'pizza', 'nachos', 'empanadas', 'pollo'],
    export: ['유통', '유통사', '수입사', '유통업체', 'distributor', 'distributors', 'distribution', 'distribucion', 'distribuidor', 'distribuidora', 'importer', 'importador', 'importadora'],
    horeca: ['식당', '레스토랑', '매장', 'restaurant', 'restaurante', 'tienda', 'retail'],
    brand: ['mokda', '먹다', 'salsa coreana', '브랜드', '브랜드 소개', 'brand', 'marca'],
    history: ['연혁', '역사', '시작', 'history', 'historia', 'origin', 'origen'],
    news: ['뉴스', '소식', '행사', '기사', 'news', 'events', 'press', 'noticias', 'novedades', 'eventos'],
    creators: ['크리에이터', '인플루언서', '협업 영상', 'creator videos', 'creators', 'influencers', 'videos', 'creadores'],
    collaboration: ['협업', '콜라보', 'collaboration', 'colaboracion', 'colaboraciones'],
    contact: ['상담', '문의', '연락', '도움', 'help', 'support', 'ayuda', 'consulta', 'consultas'],
  };

  function match(input, language) {
    // The interface language controls the answer copy; visitors may type any of the three languages.
    if (typeof input !== 'string' || input.length > MAX_LENGTH) return null;
    var text = normalize(input);
    if (!text || /<\/?[a-z][^>]*>/i.test(text) || has(text, unrelated)) return null;
    var ownBrand = has(text, brandName);

    var matches = rules.filter(function (rule) { return has(text, rule[1]); })
      .map(function (rule) { return rule[0]; });
    var explicitPrice = /가격|단가|견적|최소\s*(?:주문|수량)|샘플|\b(?:prices?|pricing|costs?|quotation|quote|moq|samples?|precios?|cotizacion|muestras?|cuesta|cuestan|vale|valen)\b/;
    if (!has(text, explicitPrice) && has(text, /중량|무게|용량|몇\s*(?:그램|그람|밀리리터)|\b(?:weighs?|weight|grams?|gramos?|pesa|pesan|peso|volume|millilit(?:er|re)s?|contenido neto)\b/)) {
      matches = matches.filter(function (id) { return id !== 'pricing'; });
    }
    if (!ownBrand && !has(text, /브랜드|너희|당신|\b(?:your|our|su|sus|marca|brand)\b/)) {
      matches = matches.filter(function (id) { return id !== 'history'; });
    }

    var creatorViewing = /(?:크리에이터|인플루언서|협업|콜라보).{0,25}(?:영상|비디오)|\b(?:videos?|watch|ver|veo)\b.{0,35}\b(?:creators?|creadores|influencers?|collaborations?|colaboraciones)\b|\b(?:creators?|creadores|influencers?)\b.{0,35}\b(?:videos?|watch|ver|veo)\b/;
    var creationProposal = /(?:영상|비디오|콘텐츠).{0,15}(?:만들|제작|촬영).{0,15}(?:싶|제안|협업)|(?:영상|비디오|콘텐츠).{0,20}(?:제안|제작\s*협업)|\b(?:want|like|interested|quiero|quisiera|gustaria)\b.{0,40}\b(?:make|create|produce|film|record|shoot|hacer|crear|producir|grabar)\b.{0,25}\b(?:videos?|content|contenido|reels?)\b/;
    var explicitViewing = /(?:어디|어디서).{0,30}(?:볼|보나요|봐요|재생)|(?:영상|비디오).{0,25}(?:볼\s*수|보려|보고\s*싶|보나요|봐요|재생)|\b(?:where|donde)\b.{0,40}\b(?:watch|see|ver|veo)\b/;
    if (has(text, creationProposal)) matches.push('collaboration');
    if (has(text, creatorViewing) && (matches.indexOf('collaboration') === -1 || has(text, explicitViewing))) matches.push('creators');

    var newsWords = /뉴스|소식|행사|보도|기사|\b(?:news|events?|press|noticias|novedades|eventos?|ferias?)\b/;
    if ((ownBrand && has(text, newsWords)) || has(text, /\b(?:expoalimentaria|kotra|kpop|congreso tv)\b|박람회|김제\s*청년/)
      || has(text, /\b(?:where|donde)\b.{0,40}\b(?:your|sus|their)\b.{0,25}\b(?:events?|news|eventos?|noticias)\b/)) {
      matches.push('news');
    }

    if (!matches.length && ownBrand && has(text, /(?:mokda|salsa coreana|먹다).{0,8}(?:무엇|뭔가|어떤\s*브랜드)|브랜드\s*소개|\b(?:what\s+(?:is|are)|que\s+(?:es|son)|about|conocer)\s+(?:mokda|salsa coreana)\b/)) {
      matches.push('brand');
    }

    // A business role can clarify an otherwise empty request, but does not replace a price question.
    if (!matches.length && has(text, /유통사|수입사|유통업체|\b(?:distributors?|importers?|distribuid(?:or|ora|ores|oras)|importad(?:or|ora|ores|oras)|distribucion|distribution)\b/)) {
      matches.push('export');
    }

    // A distribution collaboration is the trade request, not a separate content partnership.
    if (matches.indexOf('export') !== -1 && matches.indexOf('collaboration') !== -1
      && !has(text, /콘텐츠|브랜드\s*협업|영상|인플루언서|\b(?:content|brand collaboration|contenido|colaboracion de marca)\b/)) {
      matches = matches.filter(function (id) { return id !== 'collaboration'; });
    }

    // Import/export words often describe the terms being quoted, rather than a second question.
    var separateTradeQuestion = /(?:수입|수출|유통).{0,12}(?:방법|절차|어떻게)|(?:방법|절차).{0,12}(?:수입|수출|유통)|\b(?:how|process|procedure|como|proceso|procedimiento)\b.{0,35}\b(?:import|export|distribute|importar|exportar|distribuir)\b|\b(?:import|export|importar|exportar|distribuir)\b.{0,20}\b(?:process|procedure|proceso|procedimiento)\b/;
    if (matches.indexOf('pricing') !== -1 && matches.indexOf('export') !== -1
      && !has(text, separateTradeQuestion)) {
      matches = matches.filter(function (id) { return id !== 'export'; });
    }

    // Two independent requests need clarification rather than choosing one silently.
    matches = matches.filter(function (id, index) { return matches.indexOf(id) === index; });
    if (matches.length > 1) return null;
    if (matches.length === 1) return matches[0];

    var shortText = text.replace(/^[¿¡\s]+|[?!.,\s]+$/g, '');
    var aliases = Object.keys(shortQueries).filter(function (id) {
      return shortQueries[id].indexOf(shortText) !== -1;
    });
    return aliases.length === 1 ? aliases[0] : null;
  }

  window.MOKDA_CHAT_INTENTS = Object.freeze({ match: match });
}());

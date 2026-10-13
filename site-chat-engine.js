/* Verified guidance and inquiry qualification. AI may interpret a question; it cannot decide the handoff. */
(() => {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/[‐‑–—]/g, '-');
  const copy = {
    KR: {
      greeting: '안녕하세요! MOKDA 마스코트 먹랑이입니다. 좋은 하루 보내고 계신가요? 무엇을 도와드릴까요?', thanks: '네! 다른 궁금한 점도 편하게 물어보세요.',
      unknown: '어떤 내용이 궁금하신지 조금만 더 알려주시겠어요? 제품의 맛과 활용법, 구매 가능 국가, 사업 거래를 안내해드릴 수 있어요.',
      outside: '여기서는 MOKDA 제품과 구매·사업 거래를 안내해드려요. 소스나 구매에 관해 궁금한 점이 있으신가요?',
      audience: '개인적으로 드실 제품을 찾으시나요, 아니면 수입·유통이나 매장에서 판매·사용할 제품을 찾으시나요?',
      country: '어느 나라에서 구매하려고 하시나요?', businessCountry: '어느 나라에서 사업을 운영하고 계신가요?',
      businessContext: '어느 나라에서 어떤 사업을 운영하고 계신가요? 예를 들어 “페루 수입사”, “멕시코 레스토랑”처럼 알려주세요.',
      businessType: '수입사·유통사·매장·레스토랑 중 어떤 사업을 운영하고 계신가요?', product: 'K-PEÑO, Para Carnes 중 어떤 제품이 관심 있으세요? 두 제품 모두 선택하셔도 됩니다.',
      domestic: '현재 한국에서는 제품을 판매하고 있습니다. 구매 안내는 MOKDA 공식 인스타그램에서 확인해주세요. 관심 제품의 맛과 활용법은 상세 페이지에서 먼저 볼 수 있어요.',
      latam: '중남미에서는 아직 소비자에게 직접 판매하지 않고, 현지 수입·유통 바이어를 찾고 있습니다. 현재 현지 구매처나 소매 가격을 안내해드리기는 어려워요. 제품의 맛과 활용법은 상세 페이지에서 볼 수 있습니다.',
      otherCountry: '현재 확인된 소비자 판매는 한국에서 진행 중이며, 중남미에서는 수입·유통 바이어를 찾고 있습니다. 말씀하신 국가의 판매처는 이 홈페이지에 등록되어 있지 않아요.',
      commercial: '거래 가격, 최소 주문 수량(MOQ), 샘플과 수출 조건은 제품·판매 국가·거래 방식에 따라 담당자가 확인합니다.',
      qualified: '관심 제품과 사업 정보를 확인했습니다. 거래 가격·샘플·수출 조건처럼 개별 확인이 필요한 내용은 담당자와 이어서 이야기하시면 됩니다. 아래 WhatsApp에 지금까지 알려주신 내용이 함께 준비돼요.',
      human: '아래 WhatsApp에서 담당자에게 문의하실 수 있어요. 지금까지 알려주신 내용을 초안으로 준비했고, 실제 전송은 WhatsApp에서 직접 해주세요.',
      status: '이 창은 자동 안내라 담당자의 접속 상태는 확인할 수 없어요. 제품이나 거래에 관한 질문은 여기서 먼저 안내해드릴 수 있습니다.',
      noSend: '아직 담당자에게 메시지가 전송되지는 않았어요. 상담 연결이 필요한 경우 WhatsApp에서 내용을 확인하고 직접 보내주세요.',
      lessSpicy: 'K-PEÑO는 매콤한 소스예요. 두 제품의 매운맛을 수치로 비교하는 기준은 정하지 않았습니다. Para Carnes가 맵지 않다고 보장하기는 어려우니 각 제품의 맛 설명을 먼저 확인해주세요.',
      safety: '개인별 섭취 안전이나 무함유·인증 여부는 이 안내로 보증할 수 없어요. 실제 제품의 최신 원재료·알레르겐 표시를 확인해주세요.',
      labelReview: '최신 라벨이나 별도 제품 자료 확인이 필요하신 경우 담당자에게 요청하실 수 있어요. 아래 WhatsApp에 확인하려는 내용을 함께 남겨주세요.',
      issue: '제품 상태나 주문 문제는 개별 확인이 필요해요. 아래 WhatsApp으로 제품명과 구매처, 문제가 생긴 내용을 보내주세요. 사진이 있다면 함께 전달해주시면 확인에 도움이 됩니다.',
      collaboration: '어떤 협업을 생각하고 계신가요? 활동하시는 국가와 채널, 콘텐츠·행사·브랜드 협업 중 생각하신 내용을 함께 알려주세요.',
      collaborationReady: '협업 내용을 확인했습니다. 담당자가 구체적인 진행 가능 여부를 검토할 수 있도록 아래 WhatsApp으로 제안을 전달해주세요.',
      guide: '제품 상세 보기', compare: '두 제품 비교하기', shop: '공식 Instagram 구매 안내', countryOptions: ['한국', '페루', '멕시코'],
      initial: [['제품이 궁금해요', '제품의 맛과 사용법이 궁금해요'], ['개인 구매', '개인적으로 구매하고 싶어요'], ['사업 거래', '수입·유통 사업 거래를 문의하고 싶어요']],
      audienceOptions: [['개인 구매', '개인적으로 구매하려고 해요'], ['수입·유통·매장', '사업 거래입니다']],
      roles: [['수입사', '수입사입니다'], ['유통사', '유통사입니다'], ['매장·레스토랑', '매장이나 레스토랑 사업입니다']],
      products: [['K-PEÑO', 'K-PEÑO가 관심 있어요'], ['Para Carnes', 'Para Carnes가 관심 있어요'], ['두 제품 모두', '두 제품 모두 관심 있어요']],
      productFollow: [['맵기가 궁금해요', '소스의 맵기가 궁금해요'], ['보관 방법', '소스 보관 방법이 궁금해요']], quote: ['거래 조건 문의', '거래 가격과 샘플 조건을 문의하고 싶어요'],
      draft: '안녕하세요, MOKDA. 다음 내용으로 문의합니다:', context: ['제품', '국가', '수량', '목적', '사업 유형', '채널', '협업 제안'],
      purpose: { buy: '구매', pricing: '가격·거래 조건', export: '유통·수출', horeca: '매장·식당 납품', collaboration: '협업', issue: '제품·주문 문제', label: '제품 자료 확인' },
      businessNames: { importer: '수입사', distributor: '유통사', retail: '소매 매장', restaurant: '레스토랑·HORECA', other: '기타 사업' },
    },
    ES: {
      greeting: '¡Hola! Soy MOK-LANG, la mascota de MOKDA. ¿Cómo va tu día? ¿En qué te puedo ayudar?', thanks: '¡Con gusto! Puedes hacerme otra pregunta.',
      unknown: '¿Puedes contarme un poco más? Te puedo orientar sobre sabores, formas de usar las salsas, dónde comprarlas o consultas comerciales.',
      outside: 'Aquí te ayudamos con los productos MOKDA, compras y consultas comerciales. ¿Qué te gustaría saber de nuestras salsas?',
      audience: '¿Las buscas para consumo personal o para importar, distribuir, vender o usar en tu negocio?',
      country: '¿En qué país quieres comprarlas?', businessCountry: '¿En qué país opera tu negocio?',
      businessContext: '¿En qué país trabajas y qué tipo de negocio tienes? Por ejemplo, una importadora en Perú o un restaurante en México.',
      businessType: '¿Tu negocio es una importadora, distribuidora, tienda o restaurante?', product: '¿Te interesa K-PEÑO, Para Carnes o ambas salsas?',
      domestic: 'Actualmente vendemos al consumidor en Corea. Consulta la información de compra en el Instagram oficial de MOKDA. También puedes conocer el sabor y los usos de cada salsa en su página de producto.',
      latam: 'Todavía no vendemos directamente al consumidor en Latinoamérica. Estamos buscando importadores y distribuidores locales, por lo que aún no podemos indicar tiendas ni precios de venta al público. Puedes conocer los sabores y usos en las páginas de producto.',
      otherCountry: 'La venta al consumidor confirmada actualmente es en Corea. En Latinoamérica estamos buscando importadores y distribuidores. No tenemos un punto de venta registrado en esta web para el país que mencionas.',
      commercial: 'El equipo confirma precios comerciales, pedido mínimo (MOQ), muestras y condiciones de exportación según el producto, el país y el tipo de operación.',
      qualified: 'Ya tengo las salsas de interés y los datos de tu negocio. Para revisar precios, muestras o condiciones de exportación, puedes continuar con el equipo por WhatsApp. Dejaremos preparada tu consulta con los datos que compartiste.',
      human: 'Puedes contactar al equipo con el botón de WhatsApp. Tu consulta quedará preparada con lo que nos contaste; tú revisas y envías el mensaje.',
      status: 'Este chat ofrece orientación automática y no puede ver si el equipo está conectado. Aquí podemos resolver primero tus dudas sobre productos o negocios.',
      noSend: 'Todavía no se ha enviado ningún mensaje al equipo. Si necesitas continuar con una consulta, revisa y envía el texto en WhatsApp.',
      lessSpicy: 'K-PEÑO es picante. No tenemos una escala que permita comparar el picante de Para Carnes ni confirmar que no pique. Revisa la descripción de cada salsa antes de elegir.',
      safety: 'Esta guía no puede garantizar la seguridad para una persona, la ausencia de un ingrediente ni una certificación. Revisa la lista actual de ingredientes y alérgenos en tu envase.',
      labelReview: 'Si necesitas la etiqueta actual u otra documentación del producto, puedes pedirla al equipo. Indica en WhatsApp qué información necesitas confirmar.',
      issue: 'El equipo debe revisar los problemas del producto o del pedido. Envía por WhatsApp el nombre de la salsa, dónde la compraste y qué ocurrió. Si tienes fotografías, adjúntalas para facilitar la revisión.',
      collaboration: '¿Qué colaboración tienes en mente? Cuéntanos tu país, el canal donde trabajas y tu idea de contenido, evento o colaboración de marca.',
      collaborationReady: 'Ya tengo los detalles de tu propuesta. Puedes compartirlos por WhatsApp para que el equipo revise cómo continuar.',
      guide: 'Ver el producto', compare: 'Comparar las salsas', shop: 'Compra en Corea: Instagram oficial', countryOptions: ['Corea', 'Perú', 'México'],
      initial: [['Conocer las salsas', 'Quiero conocer el sabor y los usos de las salsas'], ['Compra personal', 'Quiero comprar para consumo personal'], ['Consulta comercial', 'Quiero importar o distribuir las salsas']],
      audienceOptions: [['Consumo personal', 'Es para consumo personal'], ['Para mi negocio', 'Es una consulta comercial para mi negocio']],
      roles: [['Importadora', 'Somos una importadora'], ['Distribuidora', 'Somos una distribuidora'], ['Tienda o restaurante', 'Tengo una tienda o restaurante']],
      products: [['K-PEÑO', 'Me interesa K-PEÑO'], ['Para Carnes', 'Me interesa Para Carnes'], ['Ambas salsas', 'Me interesan ambas salsas']],
      productFollow: [['Nivel de picante', '¿Qué tan picantes son las salsas?'], ['Cómo conservarlas', '¿Cómo se conservan las salsas?']], quote: ['Condiciones comerciales', 'Quiero consultar precios comerciales y muestras'],
      draft: 'Hola, MOKDA. Quisiera consultar sobre:', context: ['Producto', 'País', 'Cantidad', 'Motivo', 'Tipo de negocio', 'Canal', 'Propuesta'],
      purpose: { buy: 'Compra', pricing: 'Precios y condiciones', export: 'Distribución e importación', horeca: 'Tienda o restaurante', collaboration: 'Colaboración', issue: 'Problema de producto o pedido', label: 'Documentación del producto' },
      businessNames: { importer: 'Importadora', distributor: 'Distribuidora', retail: 'Tienda', restaurant: 'Restaurante / HORECA', other: 'Otro negocio' },
    },
    EN: {
      greeting: 'Hi! I’m MOK-LANG, the MOKDA mascot. How’s your day going? How can I help you?', thanks: 'You’re welcome! Feel free to ask another question.',
      unknown: 'Could you tell me a little more? I can help with flavors, serving ideas, where to buy, or business inquiries.',
      outside: 'Here we help with MOKDA products, buying and business inquiries. What would you like to know about our sauces?',
      audience: 'Are you looking for personal use, or to import, distribute, sell or use the sauces in your business?',
      country: 'Which country would you like to buy in?', businessCountry: 'Which country does your business operate in?',
      businessContext: 'Which country do you operate in, and what type of business do you have? For example, an importer in Peru or a restaurant in Mexico.',
      businessType: 'Is your business an importer, distributor, shop or restaurant?', product: 'Are you interested in K-PEÑO, Para Carnes, or both sauces?',
      domestic: 'We currently sell to consumers in Korea. Check MOKDA’s official Instagram for purchase information. You can also explore each sauce’s flavor and serving ideas on its product page.',
      latam: 'We are not yet selling directly to consumers in Latin America. We are looking for local importers and distributors, so we cannot currently list local shops or retail prices. You can explore the flavors and serving ideas on the product pages.',
      otherCountry: 'Our confirmed consumer sales are currently in Korea. We are looking for importers and distributors in Latin America. This website does not list a retailer in the country you mentioned.',
      commercial: 'Our team confirms business pricing, minimum order quantities (MOQ), samples and export terms based on the product, country and type of transaction.',
      qualified: 'I have the sauces of interest and your business details. You can continue with our team on WhatsApp to review pricing, samples or export terms. Your inquiry will include the details you shared.',
      human: 'You can contact our team using the WhatsApp button. Your inquiry will be prepared with the details you shared; you review and send it yourself.',
      status: 'This chat provides automated guidance and cannot check whether our team is online. We can first help with product or business questions here.',
      noSend: 'No message has been sent to our team yet. If you need to continue with an inquiry, review and send the text in WhatsApp.',
      lessSpicy: 'K-PEÑO is spicy. We do not have a scale to compare the heat of Para Carnes or confirm that it has no heat. Check each sauce’s flavor description before choosing.',
      safety: 'This guide cannot guarantee personal food safety, the absence of an ingredient or a certification. Check the current ingredients and allergen information on your packaging.',
      labelReview: 'If you need the current label or other product documentation, you can request it from our team. Include the information you need to confirm in your WhatsApp inquiry.',
      issue: 'Our team needs to review product or order problems individually. Send the sauce name, where you bought it and what happened on WhatsApp. Attach photos if available to help us check.',
      collaboration: 'What collaboration do you have in mind? Tell us your country, the channel you work with and your idea for content, an event or a brand collaboration.',
      collaborationReady: 'I have the details of your proposal. You can share them on WhatsApp so our team can review how to proceed.',
      guide: 'View product details', compare: 'Compare the sauces', shop: 'Korea purchases: official Instagram', countryOptions: ['Korea', 'Peru', 'Mexico'],
      initial: [['Explore the sauces', 'I want to know the flavors and uses of the sauces'], ['Personal purchase', 'I want to buy for personal use'], ['Business inquiry', 'I want to import or distribute the sauces']],
      audienceOptions: [['Personal use', 'This is for personal use'], ['For my business', 'This is a business inquiry']],
      roles: [['Importer', 'We are an importer'], ['Distributor', 'We are a distributor'], ['Shop or restaurant', 'I run a shop or restaurant']],
      products: [['K-PEÑO', 'I am interested in K-PEÑO'], ['Para Carnes', 'I am interested in Para Carnes'], ['Both sauces', 'I am interested in both sauces']],
      productFollow: [['Spice level', 'How spicy are the sauces?'], ['Storage', 'How should I store the sauces?']], quote: ['Business terms', 'I would like to discuss business pricing and samples'],
      draft: 'Hello, MOKDA. I would like to ask about:', context: ['Product', 'Country', 'Quantity', 'Purpose', 'Business type', 'Channel', 'Proposal'],
      purpose: { buy: 'Buying', pricing: 'Prices and terms', export: 'Distribution and import', horeca: 'Shop or restaurant supply', collaboration: 'Collaboration', issue: 'Product or order problem', label: 'Product documentation' },
      businessNames: { importer: 'Importer', distributor: 'Distributor', retail: 'Retail shop', restaurant: 'Restaurant / HORECA', other: 'Other business' },
    },
  };
  const countries = [
    ['Peru', /페루|\bperu(?:ano|ana)?\b|\blima\b|리마/], ['Mexico', /멕시코|\bmexico\b|\bmexican[oa]?\b/], ['Chile', /칠레|\bchile\b/], ['Colombia', /콜롬비아|\bcolombia\b/], ['Argentina', /아르헨티나|\bargentina\b/],
    ['Korea', /한국|대한민국|\bkorea\b|\bcorea\b/], ['USA', /미국|\b(?:usa|united states|estados unidos)\b/], ['Brazil', /브라질|\b(?:brazil|brasil)\b/], ['Ecuador', /에콰도르|\becuador\b/], ['Bolivia', /볼리비아|\bbolivia\b/],
    ['Uruguay', /우루과이|\buruguay\b/], ['Paraguay', /파라과이|\bparaguay\b/], ['Panama', /파나마|\bpanama\b/], ['Costa Rica', /코스타리카|\bcosta rica\b/], ['Guatemala', /과테말라|\bguatemala\b/], ['Venezuela', /베네수엘라|\bvenezuela\b/],
    ['Dominican Republic', /도미니카|\b(?:dominican republic|republica dominicana)\b/], ['El Salvador', /엘살바도르|\bel salvador\b/], ['Honduras', /온두라스|\bhonduras\b/], ['Nicaragua', /니카라과|\bnicaragua\b/], ['Cuba', /쿠바|\bcuba\b/],
    ['Spain', /스페인|\b(?:spain|espana)\b/], ['Canada', /캐나다|\bcanada\b/], ['Germany', /독일|\b(?:germany|alemania)\b/], ['Japan', /일본|\b(?:japan|japon)\b/], ['UK', /영국|\b(?:uk|united kingdom|reino unido)\b/],
  ];
  const latam = new Set(countries.slice(0, 5).concat(countries.slice(7, 21)).map(([value]) => value));
  const food = /타코|치킨|나초|피자|고기|채소|찍어|\b(?:tacos?|pollo|chicken|nachos|pizza|empanadas|carne|meat|vegetables?|verduras?|parrilla)\b/;
  const ingredients = /알레르|성분|원재료|글루텐|우유|대두|참깨|비건|할랄|인증|임산부|임신|\b(?:milk|leche|soy|soya|soja|wheat|trigo|sesame|sesamo|allerg\w*|alerg\w*|ingredients?|ingredientes?|gluten|vegan\w*|halal|certific\w*|pregnan\w*|embaraz\w*|safe|segura)\b/;
  const storage = /보관|냉장|개봉|소비기한|유통기한|안\s*열|몇\s*(?:달|일)|\b(?:stor\w*|refriger\w*|fridge|open\w*|abr\w*|guard\w*|conserv\w*|freeze|freezer|fecha|dias|shelf|expir\w*)\b/;
  const price = /가격|단가|견적|최소\s*(?:주문|수량)|샘플|얼마(?!나|동안)|\b(?:price\w*|cost\w*|cuesta\w*|precios?|cotizacion|quote|quotation|moq|minimo|minimum|muestras?|samples?)\b/;
  const buying = /구매|구입|배송|판매처|구매처|어디.*(?:사나요|살|팔)|\b(?:buy\w*|purchase\w*|compr\w*|conseguir|disponibilidad|availability|retail prices?)\b/;
  const business = /수입|유통|수출|납품|도매|사업\s*(?:거래|문의)|바이어|기업\s*구매|\bb2b\b|\b(?:business|commercial|comercial(?:es)?|import\w*|distribut\w*|distribu\w*|export\w*|wholesale|mayorista|horeca|exclusivity|registro sanitario)\b/;
  const personal = /개인(?:적으로|용|\s*구매)|소비자|집에서\s*먹|가정용|혼자\s*먹|\bb2c\b|\b(?:personal|consumer|consumidor|consumo personal|for myself|for (?:my )?home|para mi)\b/;
  const human = /상담원|사람.{0,12}(?:상담|연결|대화)|담당자.{0,12}(?:연결|문의|상담)|질문.*(?:그만|싫)|^담당자[!?\s]*$|(?:와츠앱|왓츠앱).{0,15}(?:연결|상담|연락)|\b(?:talk|speak|connect|contact|chat)\b.{0,25}\b(?:human|someone|agent|person|team|representative|whatsapp)\b|\b(?:hablar|contactar|conectar|chatear)\b.{0,25}\b(?:persona|humano|asesor|equipo|representante|whatsapp)\b|no quiero responder/;
  const issue = /(?:제품|병|소스|배송|주문).{0,20}(?:깨[졌짐]|파손|누수|샌|새요|누락|오배송|변질)|환불|반품|\b(?:damaged|broken|leaking|refund|return my order|producto danado|botella rota|derrame|reembolso|devolucion)\b/;
  const labelRequest = /(?:최신|실제|추가|정확한).{0,15}(?:라벨|알레르|원재료|성분|제품\s*자료).{0,20}(?:확인|보내|받|요청)|(?:라벨|제품\s*자료).{0,20}(?:보내|요청)|\b(?:send|request|need|enviar|solicitar|necesito)\b.{0,45}\b(?:current label|latest label|allergen documents?|product documents?|etiqueta actual|ficha tecnica|documentacion)\b/;
  const outside = /날씨|비트코인|api\s*key|토큰|고객.*삭제|\b(?:weather|clima|bitcoin|delete|password|politics|programming)\b|<\/?[a-z]/;
  const fields = ['product', 'productOrigin', 'country', 'city', 'quantity', 'purpose', 'channel', 'heat_preference', 'food', 'lastQuestion', 'topic', 'language', 'audience', 'businessType', 'funnelStage', 'pendingField', 'proposal', 'issue', 'companyTopic'];
  const allowedIntents = new Set(['choose', 'pairings', 'heat', 'spice', 'storage', 'ingredients', 'allergens', 'buy', 'pricing', 'export', 'horeca', 'brand', 'history', 'news', 'creators', 'collaboration', 'human', 'contact', 'issue', 'unknown']);
  const companyPatterns = [
    ['namedCertifications', /\b(?:haccp|iso(?:\s*\d+)?|halal|kosher|fssc|brc|gmp)\b|할랄|코셔|해썹/],
    ['moq', /\b(?:moq|minimum order|minimum quantity|pedido minimo|cantidad minima|mix(?:ed)? order|mixed carton)\b|최소\s*(?:주문|수량)|혼합\s*(?:주문|가능)|섞어.{0,15}(?:주문|가능)/],
    ['samples', /\b(?:samples?|muestras?)\b|샘플/],
    ['packing', /\b(?:(?:bottles?|units?)\s*(?:per|in)\s*(?:a |each )?(?:case|carton|box)|(?:case|carton|box)\s*(?:size|count|pack)|unidades\s*por\s*caja|botellas\s*(?:por|en)\s*(?:una\s*)?caja)\b|(?:박스|상자).{0,15}(?:몇|수량|구성|단위)|몇\s*개.{0,12}(?:박스|상자)/],
    ['bulk', /\b(?:bulk|foodservice|large formats?|large packs?|granel|formatos? grandes?|gran formato)\b|대용량|벌크/],
    ['documents', /\b(?:catalog\w*|brochure\w*|technical (?:sheet|data)|product (?:documents?|presentation)|nutrition\w* (?:table|information|facts)|test reports?|ficha tecnica|fichas tecnicas|documentacion|analisis|informacion nutricional)\b|카탈로그|소개서|시험\s*성적서|시험\s*자료|성분표|영양\s*정보|제품\s*자료/],
    ['certifications', /\b(?:certificat\w*|certificac\w*|certificad\w*)\b|인증/],
    ['leadTime', /\b(?:lead time|dispatch|ship(?:ping)? time|delivery time|production time|plazo\s*(?:de\s*)?(?:entrega|produccion|envio)|tiempo\s*(?:de\s*)?(?:entrega|produccion|envio))\b|출고|납기|생산\s*기간|배송\s*기간/],
    ['pricing', /\b(?:prices?|pricing|quotation|quote|cotizacion|precios?)\b|가격|단가|견적/],
    ['support', /\b(?:support hours?|business hours?|response time|contact languages?|speak spanish|speak korean|horario|horarios|tiempo de respuesta|idiomas?)\b|상담\s*(?:시간|언어|가능)|답장|응답\s*시간|시차/],
    ['oem', /\b(?:oem|private label|own brand|marca propia)\b|자체\s*(?:상표|브랜드)|프라이빗\s*라벨/],
    ['exclusive', /\b(?:exclusiv\w*|exclusive distribut\w*)\b|독점/],
    ['brand', /\b(?:latin american chefs?|chefs? latinoamerican\w*|sensory (?:evaluation|test)|evaluacion sensorial|only korean sauce|unique korean sauce|salsa coreana unica|target\w* latin america)\b|중남미\s*셰프|관능\s*평가|유일.{0,15}(?:소스|브랜드)|중남미.{0,20}(?:타겟|겨냥|개발)|차별점|제품\s*강점/],
    ['specifications', /\b(?:bottle (?:size|weight)|net weight|grams?|shelf life|expiry|expiration|origin|peso neto|vida util|origen|tamano\s*(?:de\s*)?(?:botella|envase))\b|제품\s*용량|병\s*용량|몇\s*(?:g|그램)|소비기한|유통기한|원산지|제조국/],
  ];
  const companyTopics = new Set(companyPatterns.map(([topic]) => topic));
  function companyAnswers(language) { return window.MOKDA_COMPANY_KNOWLEDGE?.answers?.[language] || null; }
  function companyMatches(question, interpretation, language) {
    const answers = companyAnswers(language);
    if (!answers) return [];
    const n = normalize(question), topics = companyPatterns.filter(([, pattern]) => pattern.test(n)).map(([topic]) => topic);
    if (topics.includes('namedCertifications') && topics.includes('certifications')) topics.splice(topics.indexOf('certifications'), 1);
    if (!topics.length && !ingredients.test(n) && !storage.test(n) && companyTopics.has(interpretation?.companyTopic)) topics.push(interpretation.companyTopic);
    return topics.filter(topic => typeof answers[topic] === 'string' && answers[topic]);
  }
  function commercialRequest(question, topics, context) {
    const n = normalize(question);
    if (context.audience === 'B2C') return false;
    if (!topics.some(topic => ['samples', 'pricing', 'oem', 'exclusive', 'bulk'].includes(topic))) return false;
    if (context.audience === 'B2B' && context.country && ['importer', 'distributor', 'retail', 'restaurant', 'other'].includes(context.businessType) && ['kpeno', 'para_carnes', 'both'].includes(context.product)) return true;
    // Availability and policy questions are answered before collecting business details.
    const informational = /조건|정책|무료|몇\s*개|최대|가능한가|가능하|있나요|어떻게|궁금|알고\s*싶|\b(?:policy|policies|free|limits?|how many|want to know|do you (?:offer|provide|have)|can you (?:offer|provide)|gratis|gratuitas?|condiciones|politica|cuantas|ofrecen|tienen|se puede|quiero saber)\b/.test(n);
    const proposal = /(?:견적|샘플|독점|oem|대용량|가격|자체\s*(?:상표|브랜드)).{0,35}(?:받고\s*싶|요청|진행|논의|제안|문의하고\s*싶)|(?:요청|논의|제안).{0,25}(?:견적|샘플|독점|oem)|\b(?:want|would like|need|request|send|discuss|quiero|quisiera|necesito|solicito|enviame|cotizar)\b/.test(n);
    const directRequest = /받고\s*싶|요청|진행|논의|제안|문의하고\s*싶|\b(?:request|send|discuss|solicito|enviame|cotizar)\b|\b(?:would like|quiero|quisiera)\b.{0,30}\b(?:samples?|muestras?|quote|cotizacion)\b/.test(n) && !/알고\s*싶|\b(?:want to know|quiero saber)\b/.test(n);
    return proposal && (!informational || directRequest) || Boolean(context.audience === 'B2B' && context.businessType && topics.some(topic => ['samples', 'pricing', 'oem', 'exclusive', 'bulk'].includes(topic)) && !informational);
  }
  function actualDocumentRequest(question) {
    return /(?:카탈로그|소개서|성적서|자료|성분표|인증서|영양\s*정보).{0,20}(?:보내|요청|받고\s*싶)|(?:보내|요청).{0,20}(?:카탈로그|소개서|자료|성적서)|\b(?:send|please send|request|enviame|envien|mandame|solicito)\b/.test(normalize(question));
  }
  function interpreted(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const result = {};
    if (companyTopics.has(value.companyTopic)) result.companyTopic = value.companyTopic;
    if (allowedIntents.has(value.intent)) result.intent = ['heat', 'spice'].includes(value.intent) ? 'choose' : value.intent === 'allergens' ? 'ingredients' : value.intent;
    if (['B2C', 'B2B', 'b2c', 'b2b'].includes(value.audience)) result.audience = value.audience.toUpperCase();
    if (['kpeno', 'para_carnes', 'both'].includes(value.product)) result.product = value.product;
    if (['importer', 'distributor', 'retail', 'retailer', 'restaurant', 'horeca', 'online', 'other'].includes(value.businessType)) result.businessType = value.businessType === 'retailer' ? 'retail' : value.businessType === 'horeca' ? 'restaurant' : value.businessType === 'online' ? 'other' : value.businessType;
    if (typeof value.country === 'string' && value.country.length <= 80) {
      const found = countries.find(([country, pattern]) => normalize(country) === normalize(value.country) || pattern.test(normalize(value.country)));
      if (found) result.country = found[0];
    }
    if (typeof value.quantity === 'string' && value.quantity.length <= 40 && /^\d[\d.,\s]*(?:병|개|박스|botellas?|bottles?|cajas?|cases?|boxes?|kg|units?)?$/i.test(value.quantity.trim())) result.quantity = value.quantity.trim();
    if (['tacos', 'chicken', 'meat', 'vegetables', 'snacks', 'other'].includes(value.food)) result.food = value.food;
    if (['less_spicy', 'spicy'].includes(value.heatPreference)) result.heat_preference = value.heatPreference;
    return result;
  }
  function contextFrom(question, previous, language, interpretation) {
    const context = {};
    for (const key of fields) if (typeof previous?.[key] === 'string') context[key] = previous[key].slice(0, ['lastQuestion', 'proposal', 'issue'].includes(key) ? 500 : 80);
    context.handoffEligible = previous?.handoffEligible === true;
    context.language = copy[context.language] ? context.language : language;
    const ai = interpreted(interpretation);
    for (const key of ['audience', 'product', 'country', 'businessType', 'quantity', 'food', 'heat_preference']) if (ai[key]) context[key] = ai[key];
    if (ai.product) context.productOrigin = 'explicit';
    if (interpretation?.businessType === 'online') context.channel = 'Online';
    const n = normalize(question);
    if (/영어로|\b(?:in english|en ingles)\b/.test(n)) context.language = 'EN';
    if (/스페인어로|\b(?:in spanish|en espanol)\b/.test(n)) context.language = 'ES';
    if (/한국어로|\b(?:in korean|en coreano)\b/.test(n)) context.language = 'KR';
    const productText = n.replace(/(?:no|not)\s+(?:k[ -]?peno|para\s*carnes)\b/g, '').replace(/(?:k[ -]?peno|케이\s*페[뇨노]|para\s*carnes|파라\s*카르네스)(?:가|이)?\s*(?:아니라|말고)/g, '');
    const kpeno = /k[ -]?(?:peno|penio)|케이\s*페[뇨노]|할라피뇨|jalapeno/.test(productText), para = /para\s*carnes|파라\s*카르네스|파라카르네스/.test(productText);
    if (/둘\s*다|두\s*제품|두\s*소스|\b(?:both|ambas|ambos)\b/.test(n) || (kpeno && para)) { context.product = 'both'; context.productOrigin = 'explicit'; }
    else if (kpeno) { context.product = 'kpeno'; context.productOrigin = 'explicit'; }
    else if (para) { context.product = 'para_carnes'; context.productOrigin = 'explicit'; }
    else if (/다른\s*(?:거|소스|제품)|\b(?:the other|la otra|el otro)\b/.test(n) && ['kpeno', 'para_carnes'].includes(context.product)) { context.product = context.product === 'kpeno' ? 'para_carnes' : 'kpeno'; context.productOrigin = 'explicit'; }
    if (/덜\s*매|매운.{0,15}(?:못|안)|\b(?:not.*spicy|less spicy|mild|no.*picante|poco picante)\b/.test(n)) context.heat_preference = 'less_spicy';
    else if (/매콤|매운|맵|\b(?:spicy|picante)\b/.test(n)) context.heat_preference = 'spicy';
    if (/타코|\btacos?\b/.test(n)) context.food = 'tacos';
    else if (/치킨|\b(?:chicken|pollo)\b/.test(n)) context.food = 'chicken';
    else if (/\bparrilla|grilled\b|구운\s*고기/.test(n)) context.food = 'grilled_meat';
    else if (food.test(n.replace(/para\s*carnes/g, ''))) context.food = 'meat';
    // A product's Korean origin is not the customer's buying or operating country.
    const locationText = n.replace(/한국어|스페인어|영어/g, '').replace(/\b(?:in|en)\s+(?:english|spanish|korean|ingles|espanol|coreano)\b/g, '')
      .replace(/(?:한국|대한민국)(?:의|산)?\s*(?:소스|제품|브랜드|식품)|(?:한국|대한민국)에서\s*(?:온|만든|생산한|제조한)\s*(?:소스|제품|브랜드|식품)/g, '')
      .replace(/\b(?:sauces?|products?|food|brand)(?:\s+korean)?\s+(?:from|made in)\s+(?:south\s+)?korea\b/g, '')
      .replace(/\b(?:salsas?|productos?|alimentos?|marca)(?:\s+corean[oa]s?)?\s+de\s+corea(?:\s+del\s+sur)?\b/g, '');
    const corrected = locationText.replace(/(?:no|not|instead of|en lugar de)\s+(?:peru|mexico|chile|colombia|argentina|korea)\b/g, '').replace(/(?:페루|멕시코|칠레|콜롬비아|한국)(?:가|이)?\s*(?:아니라|말고)/g, '');
    const found = countries.map(([value, regex]) => ({ value, index: corrected.search(regex) })).filter(item => item.index >= 0).sort((a, b) => a.index - b.index);
    if (found.length) context.country = found.at(-1).value;
    if (/\blima\b|리마/.test(n)) context.city = 'Lima'; else if (context.country !== previous?.country) delete context.city;
    const quantities = [...n.matchAll(/\b(\d{1,7}(?:,\d{3})*)\s*(?:병|개|박스|botellas?|bottles?|cajas?|cases?|boxes?|kg|units?)|([한두세])\s*병|\b(one|two|three|una|un|dos|tres)\s+(botellas?|bottles?)/g)];
    if (quantities.length) { const q = quantities.at(-1); context.quantity = q[1] ? q[0].replace(/,/g, '') : `${({ 한: 1, 두: 2, 세: 3, one: 1, two: 2, three: 3, una: 1, un: 1, dos: 2, tres: 3 })[q[2] || q[3]]} ${q[4] || '병'}`; }
    if (business.test(n)) context.audience = 'B2B';
    if (/수입사|수입업|\b(?:importer|importadora?|import company)\b/.test(n)) context.businessType = 'importer';
    else if (/유통사|유통업|유통업체|\b(?:distributor|distribuidora?|distribution company)\b/.test(n)) context.businessType = 'distributor';
    else if (/레스토랑|식당|치킨집|호텔|카페|\b(?:restaurant|restaurante|horeca|hotel|cafe)\b/.test(n) && (/운영|사업|납품|판매|사용하고|^레스토랑$|^식당$|^restaurant$|^restaurante$|\b(?:my|our|mi|nuestro|nuestra|run|own|tengo|negocio|restaurant business)\b/.test(n) || previous.pendingField === 'businessType')) context.businessType = 'restaurant';
    else if (/마트|매장|소매|\b(?:retail|shop|store|tienda|supermarket)\b/.test(n) && (/운영|사업|납품|판매|^매장$|^retail$|^tienda$|\b(?:my|our|mi|nuestro|nuestra|run|own|tengo|negocio)\b/.test(n) || previous.pendingField === 'businessType')) context.businessType = 'retail';
    else if (/기타\s*사업|다른\s*업종|\b(?:other business|otro negocio)\b/.test(n)) context.businessType = 'other';
    if (context.businessType && context.businessType !== previous.businessType) context.audience = 'B2B';
    if (personal.test(n)) { context.audience = 'B2C'; delete context.businessType; }
    if (/온라인|\bonline\b/.test(n)) context.channel = 'Online';
    else if (context.businessType === 'restaurant') context.channel = 'Restaurant';
    else if (context.businessType === 'retail') context.channel = 'Retail';
    else if (/인스타|\binstagram\b/.test(n)) context.channel = 'Instagram';
    else if (/유튜브|\byoutube\b/.test(n)) context.channel = 'YouTube';
    else if (/틱톡|\btiktok\b/.test(n)) context.channel = 'TikTok';
    if (issue.test(n)) context.issue = question;
    if (/협찬|제품\s*제공|촬영|제작|콘텐츠.{0,20}(?:제안|만들)|행사.{0,20}(?:함께|제품|제공)|\b(?:sponsor\w*|make a video|create content|grabar|crear contenido|patrocin\w*|reel|product review|resena)\b/.test(n) && /협업|콜라보|협찬|\b(?:collab\w*|colabor\w*|sponsor\w*|patrocin\w*)\b/.test(n)) context.proposal = question;
    else if (previous.pendingField === 'proposal' && question.length > 15 && !outside.test(n) && !human.test(n) && !buying.test(n)) context.proposal = question;
    return context;
  }
  function productName(product) { return product === 'kpeno' ? 'K-PEÑO' : product === 'para_carnes' ? 'Para Carnes' : product === 'both' ? 'K-PEÑO + Para Carnes' : ''; }
  function summary(context = {}, language = 'ES') {
    const t = copy[language] || copy.ES;
    const entries = [productName(context.product), context.country, context.quantity, t.purpose[context.purpose], t.businessNames[context.businessType], context.channel, context.proposal];
    const details = entries.flatMap((value, i) => value ? [`${t.context[i]}: ${value}`] : []);
    if (context.lastQuestion && context.lastQuestion !== context.proposal) details.push(context.lastQuestion);
    return `${t.draft}\n${details.join('\n') || 'MOKDA'}`.slice(0, 1200);
  }
  const quick = pairs => pairs.map(([label, question]) => ({ label, question }));
  function productSource(context, t) { return { label: context.product && context.product !== 'both' ? t.guide : t.compare, path: context.product === 'kpeno' ? 'kpeno.html' : context.product === 'para_carnes' ? 'para-carnes.html' : 'products.html' }; }
  function qualify(context, t) {
    const missing = ['country', 'businessType', 'product'].filter(field => !context[field]);
    if (!missing.length) return { text: t.qualified, handoff: true, stage: 'qualified', pending: '', quickReplies: [], missingFields: [] };
    if (missing.includes('country') && missing.includes('businessType')) return { text: `${t.commercial}\n\n${t.businessContext}`, handoff: false, stage: 'business_context', pending: 'businessContext', quickReplies: [], missingFields: missing };
    if (missing.includes('country')) return { text: t.businessCountry, handoff: false, stage: 'country', pending: 'country', quickReplies: quick(t.countryOptions.map(value => [value, value])), missingFields: missing };
    if (missing.includes('businessType')) return { text: t.businessType, handoff: false, stage: 'business_type', pending: 'businessType', quickReplies: quick(t.roles), missingFields: missing };
    return { text: t.product, handoff: false, stage: 'product', pending: 'product', quickReplies: quick(t.products), missingFields: missing };
  }
  function savedState(context, t) {
    const stages = ['audience', 'business_context', 'country', 'business_type', 'product', 'qualified', 'handoff', 'proposal', 'resolved', 'clarify', 'greeting'];
    const stage = stages.includes(context.funnelStage) ? context.funnelStage : 'greeting';
    const commercialPurpose = ['pricing', 'export', 'horeca', 'buy'].includes(context.purpose);
    const hasBusinessDetails = context.audience === 'B2B' && countries.some(([country]) => country === context.country) && ['importer', 'distributor', 'retail', 'restaurant', 'other'].includes(context.businessType) && ['kpeno', 'para_carnes', 'both'].includes(context.product);
    const businessReady = stage === 'qualified' && commercialPurpose && hasBusinessDetails;
    const collaborationReady = stage === 'qualified' && context.purpose === 'collaboration' && Boolean(context.country && context.channel && context.proposal);
    const explicitService = stage === 'handoff' && (context.topic === 'human' || (context.topic === 'issue' && context.purpose === 'issue') || (context.topic === 'ingredients' && context.purpose === 'label'));
    const handoff = context.handoffEligible === true && (businessReady || collaborationReady || explicitService);
    let quickReplies = [], missingFields = [], category = 'general', sources = [];
    if (context.audience === 'B2B' && commercialPurpose) { category = 'B2B'; missingFields = ['country', 'businessType', 'product'].filter(field => !context[field]); }
    else if (context.audience === 'B2C' && commercialPurpose) category = 'B2C';
    else if (stage === 'proposal' || context.purpose === 'collaboration') category = 'collaboration';
    else if (stage === 'handoff') category = 'service';
    else if (['choose', 'pairings', 'storage', 'ingredients'].includes(context.topic)) category = 'product';
    if (stage === 'audience') { quickReplies = quick(t.audienceOptions); missingFields = ['audience']; }
    else if (stage === 'country') { quickReplies = quick(t.countryOptions.map(value => [value, value])); if (!context.country) missingFields = ['country']; }
    else if (stage === 'business_type') quickReplies = quick(t.roles);
    else if (stage === 'product') quickReplies = quick(t.products);
    else if (stage === 'resolved' && ['product', 'B2C'].includes(category)) quickReplies = quick(context.audience === 'B2B' ? [t.quote] : t.productFollow);
    else if (['greeting', 'clarify'].includes(stage)) quickReplies = quick(t.initial);
    if (['product', 'B2C', 'B2B'].includes(category)) sources = [productSource(context, t)];
    if (category === 'B2C' && context.country === 'Korea' && stage === 'resolved') sources.unshift({ label: t.shop, url: 'https://www.instagram.com/mokda_official/' });
    return { stage, handoff, quickReplies, missingFields, category, sources, pending: context.pendingField || '' };
  }
  function correctInquiry(question, context, previous, detailOnly) {
    if (!detailOnly) return question;
    let inquiry = previous.lastQuestion || question;
    if (previous.country && context.country !== previous.country) {
      const old = countries.find(([value]) => value === previous.country)?.[1];
      if (old) inquiry = inquiry.replace(new RegExp(old.source.replaceAll('\\b', '').replace(/peru/g, 'per[uú]').replace(/mexico/g, 'm[eé]xico'), 'gi'), context.country);
    }
    if (previous.quantity && context.quantity !== previous.quantity) inquiry = inquiry.replaceAll(previous.quantity, context.quantity);
    if (previous.product && context.product !== previous.product) {
      const old = previous.product === 'kpeno' ? /k[ -]?pe[nñ]o|케이\s*페[뇨노]/gi : /para\s*carnes|파라\s*카르네스/gi;
      inquiry = inquiry.replace(old, productName(context.product));
    }
    return inquiry;
  }
  function reply(question, { language = 'ES', context: previous = {}, interpretation } = {}) {
    language = copy[language] ? language : 'ES'; question = String(question || '').trim().slice(0, 500);
    const n = normalize(question), context = contextFrom(question, previous, language, interpretation), lang = context.language, t = copy[lang];
    if (!question) {
      const restored = savedState(context, t); context.handoffEligible = restored.handoff; context.funnelStage = restored.stage;
      const intent = context.topic || 'unknown';
      return { text: t.greeting, context, sources: restored.sources, quickReplies: restored.quickReplies, handoff: restored.handoff, handoffSummary: summary(context, lang), language: lang, topic: context.topic || null, intent, category: restored.category, decision: Object.freeze({ audience: context.audience || null, stage: restored.stage, handoff: restored.handoff, reason: 'restored_state', missingFields: restored.missingFields, category: restored.category, intent }), aiTextAllowed: false };
    }
    const questions = window.MOKDA_HELP_DATA?.[lang]?.categories.flatMap(category => category.questions) || [];
    const ai = interpreted(interpretation), ids = [], add = id => { if (!ids.includes(id)) ids.push(id); };
    const company = companyMatches(question, ai, lang);
    const social = /^(?:안녕(?:하세요)?|반갑습니다|감사합니다|고마워요?|hola|buenos dias|buenas tardes|buenas noches|gracias|muchas gracias|hello|hi|hey|thanks|thank you|good morning|good evening)[!?.\s¡¿]*$/.test(n);
    const declinedHandoff = /(?:와츠앱|왓츠앱|whatsapp).{0,15}(?:말고|싫|안\s*할)|\b(?:no quiero|do not want|don't want|not)\b.{0,20}\bwhatsapp\b/.test(n);
    const switched = context.language !== (previous.language || language);
    const foodQuestion = food.test(n.replace(/para\s*carnes/g, ''));
    if (ingredients.test(n)) add('ingredients'); if (storage.test(n)) add('storage'); if (price.test(n)) add('pricing');
    if (foodQuestion && !ingredients.test(n)) add('pairings');
    const matched = window.MOKDA_CHAT_INTENTS?.match(question, lang);
    if (matched && matched !== 'contact' && !(matched === 'ingredients' && foodQuestion && !ingredients.test(n))) add(matched);
    if (buying.test(n) && !ids.includes('pricing')) add('buy');
    if (!ids.length && /맵|매[워운콤]|맛|추천|\b(?:spicy|picante|flavor|flavour|sabor|recommend|recomienda|salsas|sauces)\b/.test(n)) add('choose');
    if (!ids.length && business.test(n)) add(context.businessType === 'restaurant' || context.businessType === 'retail' ? 'horeca' : 'export');
    if (!ids.length && /협업|콜라보|colabor|collab|인플루언서|influencer|creator/.test(n)) add('collaboration');
    if (!ids.length && /브랜드|살사코레아나|\b(?:marca|salsa coreana|mokda)\b/.test(n)) add('brand');
    if (!ids.length && /역사|연혁|시작\s*이야기|historia|how.*start/.test(n)) add('history');
    if (!ids.length && /국회방송|기사|소식|뉴스|congreso|expoalimentaria|noticias|news/.test(n)) add('news');
    if (!ids.length && ai.intent && !['unknown', 'human', 'contact', 'issue'].includes(ai.intent)) add(ai.intent);
    if (!company.length && ids.includes('brand') && companyAnswers(lang)?.brand) company.push('brand');
    const changed = ['product', 'country', 'quantity', 'channel', 'audience', 'businessType'].some(key => context[key] !== previous[key]);
    const companyFollowup = !company.length && previous.pendingField && changed && companyTopics.has(previous.companyTopic) && !ingredients.test(n) && !storage.test(n) && !foodQuestion && !/맵|매[워운콤]|맛|\b(?:spicy|picante|flavor|flavour|sabor)\b/.test(n);
    if (companyFollowup && companyAnswers(lang)?.[previous.companyTopic]) company.push(previous.companyTopic);
    if (!ids.length && changed && !outside.test(n)) add(previous.topic || (context.audience === 'B2B' ? 'export' : context.audience === 'B2C' ? 'buy' : 'choose'));
    if (!ids.length && previous.pendingField === 'proposal' && context.proposal) add('collaboration');
    if (!ids.length && (switched || /그거|그럼|은요|는요|\b(?:esa|eso|that|it|which|otra|other)\b/.test(n)) && previous.topic) add(previous.topic);
    if (previous.pendingField && changed && ['pricing', 'export', 'horeca', 'buy'].includes(previous.topic) && !ingredients.test(n) && !storage.test(n) && !foodQuestion && !/맵|매[워운콤]|맛|\b(?:spicy|picante|flavor|flavour|sabor)\b/.test(n)) {
      ids.splice(0, ids.length, previous.topic);
    }
    let text = '', handoff = false, quickReplies = [], sources = [], reason = 'self_service', stage = 'resolved', pending = '', missingFields = [], intent = ids[0] || 'unknown', category = 'general';
    const commercialIntent = ids.find(id => ['pricing', 'export', 'horeca', 'buy'].includes(id));
    // A consumer asking to buy or for prices/samples receives the current retail policy first.
    if (context.audience === 'B2C' && commercialIntent && company.some(topic => ['pricing', 'moq', 'samples', 'bulk', 'leadTime'].includes(topic))) company.splice(0);
    const detailOnly = previous.lastQuestion && changed && !ingredients.test(n) && !storage.test(n) && !price.test(n) && !foodQuestion && !buying.test(n) && !business.test(n);
    if (!social && !switched && !human.test(n) && !/보냈|전송.*됐|already send|already sent|enviado|enviaste/.test(n)) context.lastQuestion = correctInquiry(question, context, previous, detailOnly || Boolean(previous.pendingField && changed && !price.test(n) && !buying.test(n)));
    if (social) {
      const restored = savedState(context, t); text = /감사|고마|gracias|thank/.test(n) ? t.thanks : t.greeting;
      ({ handoff, quickReplies, missingFields, category, sources } = restored); stage = restored.stage; pending = restored.pending; intent = context.topic || 'unknown'; reason = handoff ? 'preserved_handoff' : 'greeting';
    }
    else if (/보냈|전송.*됐|\b(?:already send|already sent|enviado|enviaste)\b/.test(n)) { text = t.noSend; reason = 'send_status'; }
    else if (/온라인|접속|\b(?:connected|conectado)\b/.test(n) && /담당자|상담원|\b(?:team|equipo|agent)\b/.test(n)) { text = t.status; quickReplies = quick(t.initial); reason = 'automated_status'; }
    else if (human.test(n) && !declinedHandoff) { text = t.human; handoff = true; reason = 'explicit_human'; category = 'service'; intent = 'human'; stage = 'handoff'; }
    else if (outside.test(n)) { text = t.outside; quickReplies = quick(t.initial); reason = 'out_of_scope'; stage = 'clarify'; }
    else if (issue.test(n)) { text = t.issue; handoff = true; context.purpose = 'issue'; reason = 'product_issue'; category = 'service'; intent = 'issue'; stage = 'handoff'; }
    else if (company.length) {
      const answers = companyAnswers(lang), chunks = company.slice(0, 3).map(topic => answers[topic]);
      for (const extra of ids.filter(id => ['storage', 'ingredients'].includes(id))) {
        if (extra === 'ingredients' && company.some(topic => ['documents', 'certifications', 'namedCertifications'].includes(topic))) continue;
        const answer = questions.find(item => item.id === extra)?.answer;
        if (answer) chunks.push(answer);
      }
      context.companyTopic = company[0]; text = chunks.join('\n\n'); category = 'company'; reason = 'company_guidance';
      intent = company.includes('brand') ? 'brand' : company.some(topic => ['documents', 'certifications', 'namedCertifications'].includes(topic)) ? 'ingredients' : company.includes('support') ? 'contact' : 'pricing';
      if (company.includes('namedCertifications') || company.includes('documents') && actualDocumentRequest(question)) {
        text += `\n\n${t.labelReview}`; handoff = true; context.purpose = 'label'; stage = 'handoff'; category = 'service'; reason = company.includes('namedCertifications') ? 'specific_certification_review' : 'document_request'; intent = 'ingredients';
      } else if (companyFollowup || commercialRequest(question, company, context)) {
        context.audience = 'B2B'; context.purpose = 'pricing'; intent = 'pricing';
        const qualified = qualify(context, t);
        ({ handoff, quickReplies, stage, missingFields } = qualified); pending = qualified.pending;
        const prompt = qualified.text.startsWith(`${t.commercial}\n\n`) ? qualified.text.slice(t.commercial.length + 2) : qualified.text;
        text += `\n\n${prompt}`; category = 'B2B'; reason = handoff ? 'qualified_business' : 'qualify_business';
      } else {
        quickReplies = quick(company.includes('brand') || company.includes('specifications') ? t.productFollow : [t.quote]);
        if (company.includes('brand')) sources = [{ label: questions.find(item => item.id === 'brand')?.link?.label || t.guide, path: 'about.html' }];
        else if (company.includes('specifications')) sources = [productSource(context, t)];
      }
    }
    else if (labelRequest.test(n)) { text = t.labelReview; handoff = true; context.purpose = 'label'; reason = 'document_request'; category = 'service'; intent = 'ingredients'; stage = 'handoff'; sources = [productSource(context, t)]; }
    else if (commercialIntent) {
      intent = commercialIntent; context.purpose = commercialIntent; sources = [productSource(context, t)];
      if (['export', 'horeca'].includes(commercialIntent)) context.audience = 'B2B';
      if (!context.audience && commercialIntent === 'buy') context.audience = 'B2C';
      if (!context.audience) { text = t.audience; quickReplies = quick(t.audienceOptions); stage = 'audience'; pending = 'audience'; category = 'qualification'; reason = 'identify_audience'; }
      else if (context.audience === 'B2B') {
        const qualified = qualify(context, t); ({ text, handoff, quickReplies, stage, missingFields } = qualified); pending = qualified.pending; reason = handoff ? 'qualified_business' : 'qualify_business'; category = 'B2B';
      } else {
        category = 'B2C'; reason = 'consumer_availability';
        if (!context.country) { text = t.country; quickReplies = quick(t.countryOptions.map(value => [value, value])); stage = 'country'; pending = 'country'; missingFields = ['country']; }
        else { text = context.country === 'Korea' ? t.domestic : latam.has(context.country) ? t.latam : t.otherCountry; quickReplies = quick(t.productFollow); if (context.country === 'Korea') sources.unshift({ label: t.shop, url: 'https://www.instagram.com/mokda_official/' }); }
      }
      const extra = ids.filter(id => ['storage', 'ingredients'].includes(id)).map(id => questions.find(item => item.id === id)?.answer).filter(Boolean);
      if (extra.length) text = `${extra.join('\n\n')}\n\n${text}`;
    } else if (ids.includes('collaboration')) {
      intent = 'collaboration'; context.purpose = 'collaboration'; category = 'collaboration';
      if (context.proposal && context.country && context.channel) { text = t.collaborationReady; handoff = true; reason = 'qualified_collaboration'; stage = 'qualified'; }
      else { text = t.collaboration; pending = 'proposal'; stage = 'proposal'; reason = 'clarify_collaboration'; sources = [{ label: questions.find(item => item.id === 'creators')?.link?.label || t.guide, path: 'news-creators.html' }]; }
    } else if (ids.length) {
      const chunks = []; category = ids.some(id => ['choose', 'pairings', 'ingredients', 'storage'].includes(id)) ? 'product' : 'general';
      for (const id of ids.slice(0, 3)) {
        if (['pairings', 'choose'].includes(id)) {
          if ((!context.product || context.productOrigin === 'recommended') && foodQuestion) { context.product = /고기|carne|meat|parrilla/.test(n) ? 'para_carnes' : 'kpeno'; context.productOrigin = 'recommended'; }
          const specific = {
            KR: { kpeno: 'K-PEÑO는 고추장과 할라피뇨를 담은 매콤한 소스예요. 타코·치킨·나초·피자에 곁들여보세요.', para_carnes: 'Para Carnes는 쌈장 기반의 감칠맛을 담은 소스예요. 구운 고기나 찐 고기, 삶은 고기와 채소에 찍어 드시면 됩니다.' },
            ES: { kpeno: 'K-PEÑO combina gochujang y jalapeño para un toque picante. Va bien con tacos, pollo, nachos y pizza.', para_carnes: 'Para Carnes es una salsa a base de ssamjang, con un sabor umami profundo. Úsala para dipear carnes asadas, al vapor o hervidas, y verduras.' },
            EN: { kpeno: 'K-PEÑO combines gochujang and jalapeño for a spicy kick. Try it with tacos, chicken, nachos or pizza.', para_carnes: 'Para Carnes is a ssamjang-based sauce with a deep umami flavor. Use it as a dip for grilled, steamed or boiled meat and vegetables.' },
          };
          chunks.push(specific[lang][context.product] || questions.find(item => item.id === id)?.answer || t.unknown);
          if (context.heat_preference === 'less_spicy') chunks.push(t.lessSpicy);
        } else {
          const answer = questions.find(item => item.id === id); if (answer) chunks.push(answer.answer);
          if (id === 'ingredients' && /안전|먹어도|인증|비건|할랄|임신|임산부|safe|segura|vegan|halal|certif|pregnan|embaraz/.test(n)) chunks.push(t.safety);
          if (answer?.link && !answer.link.path.startsWith('contact.html')) sources.push(answer.link);
        }
      }
      text = [...new Set(chunks)].join('\n\n') || t.unknown;
      if (category === 'product') {
        sources = [productSource(context, t)]; quickReplies = quick(context.audience === 'B2B' ? [t.quote] : t.productFollow);
      }
    } else { text = t.unknown; quickReplies = quick(t.initial); reason = 'clarify_unknown'; stage = 'clarify'; category = 'clarify'; }
    if (!company.length && !social && !switched) delete context.companyTopic;
    if (!social && !switched) context.topic = intent;
    context.funnelStage = stage; context.pendingField = pending; context.handoffEligible = handoff;
    const aiTextAllowed = !handoff && ['product', 'general'].includes(category) && !ids.includes('ingredients') && !social && reason === 'self_service';
    const decision = Object.freeze({ audience: context.audience || null, stage, handoff, reason, missingFields, category, intent });
    return { text, context, sources: sources.filter((source, i, all) => all.findIndex(item => (item.path || item.url) === (source.path || source.url)) === i).slice(0, 2), quickReplies, handoff, handoffSummary: summary(context, lang), language: lang, topic: context.topic || null, intent, category, decision, aiTextAllowed };
  }
  window.MOKDA_CHAT_ENGINE = Object.freeze({ reply, summary, productName, greeting: language => copy[language]?.greeting || copy.ES.greeting, initialReplies: language => quick((copy[language] || copy.ES).initial) });
})();

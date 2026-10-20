/* Verified guidance and inquiry qualification. AI may interpret a question; it cannot decide the handoff. */
(() => {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/[‐‑–—]/g, '-');
  const copy = {
    KR: {
      greeting: '안녕하세요! 먹다 상담 도우미 먹랑이입니다. 제품이나 구매·사업 거래에 관해 무엇이 궁금하신가요?', thanks: '네! 다른 궁금한 점도 편하게 물어보세요.',
      unknown: '어떤 내용이 궁금하신지 조금만 더 알려주시겠어요? 제품의 맛과 활용법, 구매 가능 국가, 사업 거래를 안내해드릴 수 있어요.',
      outside: '여기서는 MOKDA 제품과 구매·사업 거래를 안내해드려요. 소스나 구매에 관해 궁금한 점이 있으신가요?',
      audience: '개인적으로 드실 제품을 찾으시나요, 아니면 수입·유통이나 매장에서 판매·사용할 제품을 찾으시나요?',
      country: '어느 나라에서 구매하려고 하시나요?', businessCountry: '어느 나라에서 사업을 운영하고 계신가요?',
      businessContext: '어느 나라에서 어떤 사업을 운영하고 계신가요? 예를 들어 “페루 수입사”, “멕시코 레스토랑”처럼 알려주세요.',
      businessType: '수입사·유통사·매장·레스토랑 중 어떤 사업을 운영하고 계신가요?', product: 'K-PEÑO, Para Carnes 중 어떤 제품에 관심 있으세요? 두 제품 모두 선택하셔도 됩니다.',
      domestic: '현재 한국에서는 제품을 판매하고 있습니다. 구매 안내는 MOKDA 공식 인스타그램에서 확인해주세요. 관심 제품의 맛과 활용법은 상세 페이지에서 먼저 볼 수 있어요.',
      latam: '중남미에서는 아직 소비자에게 직접 판매하지 않고, 현지 수입·유통 바이어를 찾고 있습니다. 현재 현지 구매처나 소매 가격을 안내해드리기는 어려워요. 제품의 맛과 활용법은 상세 페이지에서 볼 수 있습니다.',
      otherCountry: '현재 확인된 소비자 판매는 한국에서 진행 중이며, 중남미에서는 수입·유통 바이어를 찾고 있습니다. 말씀하신 국가의 판매처는 이 홈페이지에 등록되어 있지 않아요.',
      commercial: '거래 가격, 최소 주문 수량(MOQ), 샘플과 수출 조건은 제품·판매 국가·거래 방식에 따라 담당자가 확인합니다.',
      qualified: '관심 제품과 사업 정보를 확인했습니다. 거래 가격·샘플·수출 조건처럼 개별 확인이 필요한 내용은 담당자와 이어서 이야기하시면 됩니다. 아래 WhatsApp에 지금까지 알려주신 내용이 함께 준비돼요.',
      human: '아래 WhatsApp에서 담당자에게 문의하실 수 있어요. 지금까지 알려주신 내용을 초안으로 준비했고, 실제 전송은 WhatsApp에서 직접 해주세요.',
      status: '이 창은 자동 안내라 담당자의 접속 상태는 확인할 수 없어요. 제품이나 거래에 관한 질문은 여기서 먼저 안내해드릴 수 있습니다.',
      noSend: '아직 담당자에게 메시지가 전송되지는 않았어요. 상담 연결이 필요한 경우 WhatsApp에서 내용을 확인하고 직접 보내주세요.',
      lessSpicy: '매운맛에는 개인차가 있습니다. 각 제품의 맛 설명을 확인하고 선택해 주세요. Para Carnes도 매운맛이 전혀 없는 소스는 아닙니다.',
      safety: '개인별 섭취 안전이나 무함유·인증 여부는 이 안내로 보증할 수 없어요. 실제 제품의 최신 원재료·알레르겐 표시를 확인해주세요.',
      labelReview: '최신 라벨이나 별도 제품 자료 확인이 필요하신 경우 담당자에게 요청하실 수 있어요. 아래 WhatsApp에 확인하려는 내용을 함께 남겨주세요.',
      issue: '제품 상태나 주문 문제는 개별 확인이 필요해요. 아래 WhatsApp으로 제품명과 구매처, 문제가 생긴 내용을 보내주세요. 사진이 있다면 함께 전달해주시면 확인에 도움이 됩니다.',
      collaboration: '어떤 협업을 생각하고 계신가요? 활동하시는 국가와 채널, 콘텐츠·행사·브랜드 협업 중 생각하신 내용을 함께 알려주세요.',
      collaborationReady: '협업 내용을 확인했습니다. 담당자가 구체적인 진행 가능 여부를 검토할 수 있도록 아래 WhatsApp으로 제안을 전달해주세요.',
      updates: '판매·출시 소식: 공식 Instagram', guide: '제품 상세 보기', compare: '두 제품 비교하기', shop: '공식 Instagram 구매 안내', countryOptions: ['한국', '페루', '멕시코'],
      initial: [['제품이 궁금해요', '제품의 맛과 사용법이 궁금해요'], ['개인 구매', '개인적으로 구매하고 싶어요'], ['사업 거래', '수입·유통 사업 거래를 문의하고 싶어요']],
      audienceOptions: [['개인 구매', '개인적으로 구매하려고 해요'], ['수입·유통·매장', '사업 거래입니다']],
      roles: [['수입사', '수입사입니다'], ['유통사', '유통사입니다'], ['매장·레스토랑', '매장이나 레스토랑 사업입니다']],
      products: [['K-PEÑO', 'K-PEÑO에 관심 있어요'], ['Para Carnes', 'Para Carnes에 관심 있어요'], ['두 제품 모두', '두 제품 모두 관심 있어요']],
      productFollow: [['맵기가 궁금해요', '소스의 맵기가 궁금해요'], ['보관 방법', '소스 보관 방법이 궁금해요']], quote: ['거래 조건 문의', '거래 가격과 샘플 조건을 문의하고 싶어요'],
      draft: '안녕하세요, MOKDA. 다음 내용으로 문의합니다:', context: ['제품', '국가', '수량', '목적', '사업 유형', '채널', '협업 제안'],
      purpose: { buy: '구매', pricing: '가격·거래 조건', export: '유통·수출', horeca: '매장·식당 납품', collaboration: '협업', issue: '제품·주문 문제', label: '제품 자료 확인' },
      businessNames: { importer: '수입사', distributor: '유통사', retail: '소매 매장', restaurant: '레스토랑·HORECA', other: '기타 사업' },
    },
    ES: {
      greeting: '¡Hola! Soy MOK-LANG, el asistente de MOKDA. ¿En qué puedo ayudarte?', thanks: '¡Con gusto! Puedes hacerme otra pregunta.',
      unknown: '¿Puedes contarme un poco más? Te puedo orientar sobre sabores, formas de usar las salsas, dónde comprarlas o consultas comerciales.',
      outside: 'Aquí te ayudamos con los productos MOKDA, compras y consultas comerciales. ¿Qué te gustaría saber de nuestras salsas?',
      audience: '¿Las buscas para consumo personal o para importar, distribuir, vender o usar en tu negocio?',
      country: '¿En qué país quieres comprarlas?', businessCountry: '¿En qué país opera tu negocio?',
      businessContext: '¿En qué país trabajas y qué tipo de negocio tienes? Por ejemplo, una importadora en Perú o un restaurante en México.',
      businessType: '¿Tu negocio es una importadora, distribuidora, tienda o restaurante?', product: '¿Te interesa K-PEÑO, Para Carnes o ambas salsas?',
      domestic: 'Actualmente vendemos al consumidor en Corea. Consulta la información de compra en el Instagram oficial de MOKDA. También puedes conocer el sabor y los usos de cada salsa en su página de producto.',
      latam: 'Todavía no vendemos directamente al consumidor en Latinoamérica. Estamos buscando importadores y distribuidores locales, por lo que aún no podemos indicar tiendas ni precios de venta al público. Puedes conocer los sabores y usos en las páginas de producto.',
      otherCountry: 'Actualmente vendemos al consumidor en Corea. En Latinoamérica estamos buscando importadores y distribuidores. No tenemos un punto de venta registrado en esta web para el país que mencionas.',
      commercial: 'El equipo confirma precios comerciales, pedido mínimo (MOQ), muestras y condiciones de exportación según el producto, el país y el tipo de operación.',
      qualified: 'Ya sé qué salsas te interesan y tengo los datos de tu negocio. Para revisar precios, muestras o condiciones de exportación, puedes continuar con el equipo por WhatsApp. Dejaremos preparada tu consulta con los datos que compartiste.',
      human: 'Puedes contactar al equipo con el botón de WhatsApp. Tu consulta quedará preparada con lo que nos contaste; tú revisas y envías el mensaje.',
      status: 'Este chat ofrece orientación automática y no puede ver si el equipo está conectado. Aquí podemos resolver primero tus dudas sobre productos o negocios.',
      noSend: 'Todavía no se ha enviado ningún mensaje al equipo. Si necesitas continuar con una consulta, revisa y envía el texto en WhatsApp.',
      lessSpicy: 'La percepción del picante varía de una persona a otra. Revisa la descripción de cada salsa antes de elegir. Para Carnes también tiene un toque picante.',
      safety: 'Esta guía no puede garantizar la seguridad para una persona, la ausencia de un ingrediente ni una certificación. Revisa la lista actual de ingredientes y alérgenos en tu envase.',
      labelReview: 'Si necesitas la etiqueta actual u otra documentación del producto, puedes pedirla al equipo. Indica en WhatsApp qué información necesitas confirmar.',
      issue: 'El equipo debe revisar los problemas del producto o del pedido. Envía por WhatsApp el nombre de la salsa, dónde la compraste y qué ocurrió. Si tienes fotografías, adjúntalas para facilitar la revisión.',
      collaboration: '¿Qué colaboración tienes en mente? Cuéntanos tu país, el canal donde trabajas y tu idea de contenido, evento o colaboración de marca.',
      collaborationReady: 'Ya tengo los detalles de tu propuesta. Puedes compartirlos por WhatsApp para que el equipo revise cómo continuar.',
      updates: 'Novedades: Instagram oficial', guide: 'Ver el producto', compare: 'Comparar las salsas', shop: 'Compra en Corea: Instagram oficial', countryOptions: ['Corea', 'Perú', 'México'],
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
      greeting: 'Hi! I’m MOK-LANG, MOKDA’s assistant. How can I help you with our sauces or business inquiries?', thanks: 'You’re welcome! Feel free to ask another question.',
      unknown: 'Could you tell me a little more? I can help with flavors, serving ideas, where to buy, or business inquiries.',
      outside: 'Here we help with MOKDA products, buying and business inquiries. What would you like to know about our sauces?',
      audience: 'Are you looking for personal use, or to import, distribute, sell or use the sauces in your business?',
      country: 'Which country would you like to buy in?', businessCountry: 'Which country does your business operate in?',
      businessContext: 'Which country do you operate in, and what type of business do you have? For example, an importer in Peru or a restaurant in Mexico.',
      businessType: 'Is your business an importer, distributor, shop or restaurant?', product: 'Are you interested in K-PEÑO, Para Carnes, or both sauces?',
      domestic: 'We currently sell to consumers in Korea. Check MOKDA’s official Instagram for purchase information. You can also explore each sauce’s flavor and serving ideas on its product page.',
      latam: 'We are not yet selling directly to consumers in Latin America. We are looking for local importers and distributors, so we cannot currently list local shops or retail prices. You can explore the flavors and serving ideas on the product pages.',
      otherCountry: 'We currently sell to consumers in Korea. We are looking for importers and distributors in Latin America. This website does not list a retailer in the country you mentioned.',
      commercial: 'Our team confirms business pricing, minimum order quantities (MOQ), samples and export terms based on the product, country and type of transaction.',
      qualified: 'I have the sauces of interest and your business details. You can continue with our team on WhatsApp to review pricing, samples or export terms. Your inquiry will include the details you shared.',
      human: 'You can contact our team using the WhatsApp button. Your inquiry will be prepared with the details you shared; you review and send it yourself.',
      status: 'This chat provides automated guidance and cannot check whether our team is online. We can first help with product or business questions here.',
      noSend: 'No message has been sent to our team yet. If you need to continue with an inquiry, review and send the text in WhatsApp.',
      lessSpicy: 'Heat perception varies by person. Check each sauce’s flavor description before choosing. Para Carnes still has some heat.',
      safety: 'This guide cannot guarantee personal food safety, the absence of an ingredient or a certification. Check the current ingredients and allergen information on your packaging.',
      labelReview: 'If you need the current label or other product documentation, you can request it from our team. Include the information you need to confirm in your WhatsApp inquiry.',
      issue: 'Our team needs to review product or order problems individually. Send the sauce name, where you bought it and what happened on WhatsApp. Attach photos if available to help us check.',
      collaboration: 'What collaboration do you have in mind? Tell us your country, the channel you work with and your idea for content, an event or a brand collaboration.',
      collaborationReady: 'I have the details of your proposal. You can share them on WhatsApp so our team can review how to proceed.',
      updates: 'Sales updates: official Instagram', guide: 'View product details', compare: 'Compare the sauces', shop: 'Korea purchases: official Instagram', countryOptions: ['Korea', 'Peru', 'Mexico'],
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
    ['Puerto Rico', /푸에르토리코|\bpuerto rico\b/], ['Spain', /스페인|\b(?:spain|espana)\b/], ['Canada', /캐나다|\bcanada\b/], ['Germany', /독일|\b(?:germany|alemania)\b/], ['Japan', /일본|\b(?:japan|japon)\b/], ['UK', /영국|\b(?:uk|united kingdom|reino unido)\b/],
  ];
  const latam = new Set(['Peru','Mexico','Chile','Colombia','Argentina','Brazil','Ecuador','Bolivia','Uruguay','Paraguay','Panama','Costa Rica','Guatemala','Venezuela','Dominican Republic','El Salvador','Honduras','Nicaragua','Cuba','Puerto Rico']);
  const food = /타코|치킨|나초|피자|고기|채소|찍어|\b(?:tacos?|pollo|chicken|nachos|pizza|empanadas|carne|meat|vegetables?|verduras?|parrilla)\b/;
  const ingredients = /알레르|성분|원재료|글루텐|우유|대두|참깨|비건|할랄|인증|임산부|임신|\b(?:milk|leche|soy|soya|soja|wheat|trigo|sesame|sesamo|allerg\w*|alerg\w*|ingredients?|ingredientes?|gluten|vegan\w*|halal|certific\w*|pregnan\w*|embaraz\w*|safe|segura)\b/;
  const storage = /보관|냉장|개봉|소비기한|유통기한|안\s*열|몇\s*(?:달|일)|\b(?:stor\w*|refriger\w*|fridge|open\w*|abr\w*|guard\w*|conserv\w*|freeze|freezer|fecha|dias|shelf|expir\w*)\b/;
  const price = /가격|단가|견적|최소\s*(?:주문|수량)|샘플|얼마(?!나|동안)|\b(?:price\w*|cost\w*|cuesta\w*|precios?|cotizacion|quote|quotation|moq|minimo|minimum|muestras?|samples?)\b/;
  const buying = /구매|구입|배송|판매처|구매처|어디.*(?:사나요|살|팔)|\b(?:buy\w*|purchase\w*|compr\w*|conseguir|disponibilidad|availability|retail prices?)\b/;
  const business = /수입|유통|수출|납품|도매|사업\s*(?:거래|문의)|바이어|기업\s*구매|\bb2b\b|\b(?:business|commercial|comercial(?:es)?|import\w*|distribut\w*|distribu\w*|export\w*|wholesale|mayorista|horeca|exclusivity|registro sanitario)\b/;
  const personal = /개인(?:적으로|용|\s*구매)|소비자|집에서\s*먹|가정용|혼자\s*먹|\bb2c\b|\b(?:personal|consumer|consumidor|consumo personal|for myself|for (?:my )?home|para mi)\b/;
  const personalUse = text => personal.test(text.replace(/\b(?:not|no(?: es)?)(?:\s+(?:for|para))?\s+(?:a\s+)?(?:personal(?: use)?|consumo personal|myself)\b/g, '')
    .replace(/개인(?:적으로|용|\s*구매)?(?:이|가)?\s*(?:아니라|아니고|말고)/g, ''));
  const human = /상담원|사람.{0,12}(?:상담|연결|대화)|담당자.{0,12}(?:연결|문의|상담)|질문.*(?:그만|싫)|^담당자[!?\s]*$|(?:와츠앱|왓츠앱).{0,15}(?:연결|상담|연락)|\b(?:talk|speak|connect|contact|chat)\b.{0,25}\b(?:human|someone|agent|person|team|representative|whatsapp)\b|\b(?:hablar|contactar|conectar|chatear)\b.{0,25}\b(?:persona|humano|asesor|equipo|representante|whatsapp)\b|no quiero responder/;
  const issue = /(?:제품|병|소스|배송|주문).{0,20}(?:깨[졌짐]|파손|누수|샌|새요|누락|오배송|변질)|환불|반품|\b(?:damaged|broken|leaking|refund|return my order|producto danado|botella rota|derrame|reembolso|devolucion)\b/;
  const labelRequest = /(?:최신|실제|추가|정확한).{0,15}(?:라벨|알레르|원재료|성분|제품\s*자료).{0,20}(?:확인|보내|받|요청)|(?:라벨|제품\s*자료).{0,20}(?:보내|요청)|\b(?:send|request|need|enviar|solicitar|necesito)\b.{0,45}\b(?:current label|latest label|allergen documents?|product documents?|etiqueta actual|ficha tecnica|documentacion)\b/;
  const outside = /날씨|비트코인|api\s*key|토큰|고객.*삭제|\b(?:weather|clima|bitcoin|delete|password|politics|programming)\b|<\/?[a-z]/;
  const fields = ['product', 'productOrigin', 'country', 'city', 'quantity', 'purpose', 'channel', 'heat_preference', 'food', 'lastQuestion', 'topic', 'language', 'audience', 'businessType', 'funnelStage', 'pendingField', 'proposal', 'issue', 'companyTopic', 'requestPurpose', 'requestQuestion', 'discussedTopics', 'answerFocus'];
  const allowedIntents = new Set(['choose', 'pairings', 'heat', 'spice', 'storage', 'ingredients', 'allergens', 'buy', 'pricing', 'export', 'horeca', 'brand', 'history', 'news', 'creators', 'collaboration', 'human', 'contact', 'issue', 'unknown']);
  const companyPatterns = [
    ['namedCertifications', /\b(?:haccp|iso(?:\s*\d+)?|halal|kosher|fssc|brc|gmp)\b|할랄|코셔|해썹/],
    ['moq', /\b(?:moq|minimum order|minimum quantity|pedido minimo|cantidad minima|mix(?:ed)? order|mixed carton)\b|최소\s*(?:주문|수량)|혼합\s*(?:주문|가능)|섞어.{0,15}(?:주문|가능)/],
    ['samples', /\b(?:samples?|muestras?)\b|샘플/],
    ['packing', /\b(?:(?:bottles?|units?)\s*(?:per|in)\s*(?:a |each )?(?:case|carton|box)|(?:case|carton|box)\s*(?:size|count|pack)|unidades\s*por\s*caja|(?:cuantas?\s+)?botellas\s*(?:hay\s*)?(?:por|en)\s*(?:una\s*)?caja)\b|(?:박스|상자).{0,15}(?:몇|수량|구성|단위)|몇\s*개.{0,12}(?:박스|상자)/],
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
    for (const key of fields) if (typeof previous?.[key] === 'string') context[key] = previous[key].slice(0, ['lastQuestion', 'requestQuestion', 'proposal', 'issue'].includes(key) ? 500 : 80);
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
    const quantityText = n.replace(/\b(?:not|no|instead of|en lugar de)\s+\d{1,7}(?:,\d{3})*\s*(?:botellas?|bottles?|cajas?|cases?|boxes?|kg|units?)?/g, '')
      .replace(/\d{1,7}(?:,\d{3})*\s*(?:병|개|박스)(?:이|가)?\s*(?:아니라|말고)/g, '');
    const quantities = [...quantityText.matchAll(/\b(\d{1,7}(?:,\d{3})*)\s*(?:병|개|박스|botellas?|bottles?|cajas?|cases?|boxes?|kg|units?)|([한두세])\s*병|\b(one|two|three|una|un|dos|tres)\s+(botellas?|bottles?)/g)];
    if (quantities.length) { const q = quantities.at(-1); context.quantity = q[1] ? q[0].replace(/,/g, '') : `${({ 한: 1, 두: 2, 세: 3, one: 1, two: 2, three: 3, una: 1, un: 1, dos: 2, tres: 3 })[q[2] || q[3]]} ${q[4] || '병'}`; }
    if (business.test(n)) context.audience = 'B2B';
    if (/수입사|수입업|\b(?:importer|importadora?|import company)\b/.test(n)) context.businessType = 'importer';
    else if (/유통사|유통업|유통업체|\b(?:distributor|distribuidora?|distribution company)\b/.test(n)) context.businessType = 'distributor';
    else if (/레스토랑|식당|치킨집|호텔|카페|\b(?:restaurant|restaurante|horeca|hotel|cafe)\b/.test(n) && (/운영|사업|납품|판매|사용하고|^레스토랑$|^식당$|^restaurant$|^restaurante$|\b(?:my|our|mi|nuestro|nuestra|run|own|tengo|negocio|restaurant business)\b/.test(n) || previous.pendingField === 'businessType')) context.businessType = 'restaurant';
    else if (/마트|매장|소매|\b(?:retail|shop|store|tienda|supermarket)\b/.test(n) && (/운영|사업|납품|판매|^매장$|^retail$|^tienda$|\b(?:my|our|mi|nuestro|nuestra|run|own|tengo|negocio)\b/.test(n) || previous.pendingField === 'businessType')) context.businessType = 'retail';
    else if (/기타\s*사업|다른\s*업종|\b(?:other business|otro negocio)\b/.test(n)) context.businessType = 'other';
    if (context.businessType && context.businessType !== previous.businessType) context.audience = 'B2B';
    if (personalUse(n)) { context.audience = 'B2C'; delete context.businessType; }
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
    if (context.audience === 'B2B' && context.requestQuestion && context.requestQuestion !== context.lastQuestion) details.push(context.requestQuestion);
    if (context.lastQuestion && context.lastQuestion !== context.proposal) details.push(context.lastQuestion);
    return `${t.draft}\n${details.join('\n') || 'MOKDA'}`.slice(0, 1200);
  }
  const quick = pairs => pairs.map(([label, question]) => ({ label, question }));
  function productSource(context, t) { return { label: context.product && context.product !== 'both' ? t.guide : t.compare, path: context.product === 'kpeno' ? 'kpeno.html' : context.product === 'para_carnes' ? 'para-carnes.html' : 'products.html' }; }
  function qualify(context, t) {
    const missing = ['country', 'businessType', 'product'].filter(field => !context[field]);
    if (!missing.length) return { text: t.qualified, handoff: true, stage: 'qualified', pending: '', quickReplies: [], missingFields: [] };
    if (missing.includes('country') && missing.includes('businessType')) return { text: t.businessContext, handoff: false, stage: 'business_context', pending: 'businessContext', quickReplies: [], missingFields: missing };
    if (missing.includes('country')) return { text: t.businessCountry, handoff: false, stage: 'country', pending: 'country', quickReplies: quick(t.countryOptions.map(value => [value, value])), missingFields: missing };
    if (missing.includes('businessType')) return { text: t.businessType, handoff: false, stage: 'business_type', pending: 'businessType', quickReplies: quick(t.roles), missingFields: missing };
    return { text: t.product, handoff: false, stage: 'product', pending: 'product', quickReplies: quick(t.products), missingFields: missing };
  }
  // Suggestions are questions, not new company facts. Keep them tied to the
  // current answer, and do not offer the same two questions after every turn.
  const followupCopy = {
    KR: {
      spice: ['맵기 알아보기', '이 소스의 맵기가 궁금해요'], pairings: ['어울리는 음식', '이 소스는 어떤 음식에 곁들이면 좋나요?'],
      storage: ['개봉 후 보관', '개봉 후에는 소스를 어떻게 보관하나요?'], ingredients: ['원재료·알레르겐', '이 소스의 원재료와 알레르겐이 궁금해요'],
      buy: ['구매 안내', '개인적으로 구매하려면 어디서 살 수 있나요?'], compare: ['두 소스 비교', 'K-PEÑO와 Para Carnes의 맛 차이가 궁금해요'],
      moq: ['최소 주문·혼합 구성', '최소 주문 수량과 혼합 주문 조건이 궁금해요'], samples: ['샘플 제공 조건', '샘플 제공 조건이 궁금해요'],
      sampleFreight: ['샘플 배송비', '샘플 국제 배송비는 누가 부담하나요?'], packing: ['박스 구성', '330g 소스는 한 박스에 몇 개 들어가나요?'],
      bulk: ['식당용 대용량', 'B2B 대용량 제품도 가능한가요?'], documents: ['바이어용 자료', '카탈로그와 제품 자료는 어떤 언어로 제공하나요?'],
      specifications: ['용량·소비기한', '제품 용량과 소비기한은 어떻게 되나요?'], brand: ['MOKDA의 개발 이야기', '중남미 셰프와 함께 개발한 소스인가요?'],
      quote: ['거래 상담 시작', '거래 가격과 샘플 조건을 문의하고 싶어요'], resume: ['거래 상담 이어가기', '앞서 하던 사업 거래 상담을 이어갈게요'],
      more: ['맛 더 알아보기', '이 소스의 맛 특징을 좀 더 알려주세요'],
    },
    ES: {
      spice: ['Nivel de picante', '¿Qué tan picante es esta salsa?'], pairings: ['Con qué acompañarla', '¿Con qué comidas puedo usar esta salsa?'],
      storage: ['Después de abrir', '¿Cómo conservo la salsa después de abrirla?'], ingredients: ['Ingredientes y alérgenos', '¿Qué ingredientes y alérgenos tiene esta salsa?'],
      buy: ['Dónde comprar', '¿Dónde puedo comprar para consumo personal?'], compare: ['Comparar las salsas', '¿Qué diferencia de sabor hay entre K-PEÑO y Para Carnes?'],
      moq: ['Pedido mínimo y mezcla', '¿Cuál es el pedido mínimo y permiten pedidos mixtos?'], samples: ['Condiciones de muestras', '¿Cuáles son las condiciones para las muestras?'],
      sampleFreight: ['Envío de muestras', '¿Quién paga el envío internacional de las muestras?'], packing: ['Unidades por caja', '¿Cuántas unidades por caja?'],
      bulk: ['Formatos para restaurantes', '¿Ofrecen formatos grandes para clientes B2B?'], documents: ['Documentos para compradores', '¿En qué idiomas tienen el catálogo y los documentos del producto?'],
      specifications: ['Contenido y vida útil', '¿Cuál es el peso neto y la vida útil?'], brand: ['Cómo desarrollamos las salsas', '¿Desarrollaron las salsas con chefs latinoamericanos?'],
      quote: ['Iniciar consulta comercial', 'Quiero consultar precios comerciales y muestras'], resume: ['Retomar mi consulta comercial', 'Quiero retomar mi consulta comercial anterior'],
      more: ['Más sobre el sabor', 'Cuéntame más del sabor de esta salsa'],
    },
    EN: {
      spice: ['Heat level', 'How spicy is this sauce?'], pairings: ['Serving ideas', 'What food can I serve this sauce with?'],
      storage: ['After opening', 'How should I store the sauce after opening?'], ingredients: ['Ingredients and allergens', 'What ingredients and allergens does this sauce contain?'],
      buy: ['Where to buy', 'Where can I buy for personal use?'], compare: ['Compare the sauces', 'How do K-PEÑO and Para Carnes differ in flavor?'],
      moq: ['Minimum and mixed orders', 'What are the minimum order and mixed order conditions?'], samples: ['Sample conditions', 'What are the conditions for samples?'],
      sampleFreight: ['Sample shipping', 'Who pays international shipping for the samples?'], packing: ['Bottles per case', 'How many bottles per carton?'],
      bulk: ['Restaurant formats', 'Are larger formats available for B2B customers?'], documents: ['Buyer documents', 'What languages are the catalog and product documents available in?'],
      specifications: ['Size and shelf life', 'What are the bottle weight and shelf life?'], brand: ['How we developed the sauces', 'Did you develop the sauces with Latin American chefs?'],
      quote: ['Start a business inquiry', 'I would like to discuss business pricing and samples'], resume: ['Continue my business inquiry', 'I would like to resume my earlier business inquiry'],
      more: ['More about the flavor', 'Tell me more about the flavor of this sauce'],
    },
  };
  const requestPurposes = new Set(['pricing', 'export', 'horeca', 'buy']);
  function nextQuestions(context, language, category, handoff, topic) {
    const t = copy[language], choices = followupCopy[language];
    const seen = new Set((context.discussedTopics || '').split('|'));
    const byTopic = {
      moq: ['samples', 'packing', 'quote'], samples: ['sampleFreight', 'moq', 'quote'], sampleFreight: ['moq', 'packing', 'quote'],
      packing: ['bulk', 'specifications', 'quote'], bulk: ['packing', 'samples', 'quote'], pricing: ['moq', 'samples', 'quote'],
      documents: ['moq', 'packing', 'quote'], certifications: ['documents', 'samples', 'quote'], leadTime: ['moq', 'samples', 'quote'],
      specifications: ['packing', 'storage', 'ingredients'], brand: ['compare', 'pairings', 'specifications'],
      spice: ['pairings', 'more', 'buy'], pairings: ['spice', 'storage', 'buy'], storage: ['ingredients', 'buy', 'specifications'],
      ingredients: ['storage', 'pairings', 'buy'], buy: ['compare', 'pairings', 'brand'], choose: ['spice', 'pairings', 'buy'],
    };
    if (category === 'product' && !context.product) return quick([...t.products.slice(0, 2), choices.compare]);
    const keys = [...(byTopic[topic] || ['moq', 'samples', 'packing']), ...(category === 'product' || category === 'B2C' ? ['storage', 'ingredients', 'brand', 'buy'] : ['bulk', 'documents', 'specifications'])];
    const selected = [];
    if (!handoff && context.audience === 'B2B' && requestPurposes.has(context.requestPurpose)) selected.push('resume');
    for (const key of keys) if (!selected.includes(key) && !seen.has(key) && key !== topic && !((handoff || selected.includes('resume')) && key === 'quote') && !(context.audience === 'B2B' && key === 'buy')) selected.push(key);
    return quick(selected.slice(0, 3).map(key => choices[key]));
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
    else if (companyTopics.has(context.companyTopic)) category = 'company';
    else if (['choose', 'pairings', 'storage', 'ingredients'].includes(context.topic)) category = 'product';
    if (stage === 'audience') { quickReplies = quick(t.audienceOptions); missingFields = ['audience']; }
    else if (stage === 'country') { quickReplies = quick(t.countryOptions.map(value => [value, value])); if (!context.country) missingFields = ['country']; }
    else if (stage === 'business_type') quickReplies = quick(t.roles);
    else if (stage === 'product') quickReplies = quick(t.products);
    else if ((stage === 'resolved' && ['product', 'company', 'B2C', 'B2B'].includes(category)) || (stage === 'qualified' && category === 'B2B')) quickReplies = nextQuestions(context, context.language, category, handoff, (context.discussedTopics || '').split('|').filter(Boolean).at(-1) || context.companyTopic || context.topic);
    else if (['greeting', 'clarify'].includes(stage)) quickReplies = quick(t.initial);
    if (['product', 'B2C', 'B2B'].includes(category)) sources = [productSource(context, t)];
    if (category === 'B2C' && context.country && stage === 'resolved') sources.unshift({ label: context.country === 'Korea' ? t.shop : t.updates, url: 'https://www.instagram.com/mokda_official/' });
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
    const otherProduct = context.product !== previous.product && /다른\s*(?:거|소스|제품)|\b(?:the other|la otra|el otro)\b/.test(n) && previous.topic === 'choose';
    const asksHeat = /맵|매[워운콤]|\b(?:spic\w*|picant\w*|heat|pica|picor)\b/.test(n) || ['heat', 'spice'].includes(interpretation?.intent) || otherProduct && previous.answerFocus === 'spice';
    const asksTaste = /맛|달아|단맛|달콤|짠가|짭짤|고소|\b(?:sweet|salty|tangy|creamy|dulce|salad[oa]|acida|cremosa|sabor|flavou?r)\b/.test(n) || otherProduct && previous.answerFocus === 'taste';
    const asksMore = /좀\s*더|자세히|더\s*알려|\b(?:more|mas)\b/.test(n);
    const asksUse = /사용법|활용법|어떻게.{0,12}(?:먹|사용)|\b(?:serve|servir|dipear|use it|usar esta|uso|como se usa)\b/.test(n);
    const resume = requestPurposes.has(context.requestPurpose) && /이어|계속|\b(?:resume|continue|retomar|continuar)\b/.test(n) && /상담|거래|\b(?:inquiry|consulta|business|comercial)\b/.test(n);
    const sampleFreight = previous.companyTopic === 'samples' && /배송비|운임|\b(?:shipping|freight|envio|flete)\b/.test(n) && !/일반\s*주문|\b(?:regular order|pedido normal)\b/.test(n);
    if (sampleFreight && !company.length && companyAnswers(lang)?.samples) company.push('samples');
    if (ingredients.test(n)) add('ingredients'); if (storage.test(n)) add('storage'); if (price.test(n)) add('pricing');
    if ((foodQuestion || asksUse) && !ingredients.test(n)) add('pairings');
    const matched = window.MOKDA_CHAT_INTENTS?.match(question, lang);
    if (matched && matched !== 'contact' && !(matched === 'ingredients' && foodQuestion && !ingredients.test(n))) add(matched);
    if (buying.test(n) && !ids.includes('pricing')) add('buy');
    if (!ids.length && /맵|매[워운콤]|맛|추천|\b(?:spicy|picante|flavor|flavour|sabor|recommend|recomienda|salsas|sauces)\b/.test(n)) add('choose');
    if (!ids.length && (asksTaste || asksHeat)) add('choose');
    if (!ids.length && business.test(n)) add(context.businessType === 'restaurant' || context.businessType === 'retail' ? 'horeca' : 'export');
    if (!ids.length && /협업|콜라보|colabor|collab|인플루언서|influencer|creator/.test(n)) add('collaboration');
    if (!ids.length && /브랜드|살사코레아나|\b(?:marca|salsa coreana|mokda)\b/.test(n)) add('brand');
    if (!ids.length && /역사|연혁|시작\s*이야기|historia|how.*start/.test(n)) add('history');
    if (!ids.length && /국회방송|기사|소식|뉴스|congreso|expoalimentaria|noticias|news/.test(n)) add('news');
    if (!ids.length && ai.intent && !['unknown', 'human', 'contact', 'issue'].includes(ai.intent)) add(ai.intent);
    if (!company.length && ids.includes('brand') && companyAnswers(lang)?.brand) company.push('brand');
    const changed = ['product', 'country', 'quantity', 'channel', 'audience', 'businessType'].some(key => context[key] !== previous[key]);
    // A question about taste may temporarily interrupt qualification. Keep the
    // request separately from the current information topic so details supplied
    // afterwards continue that request rather than starting a new FAQ.
    if (context.audience !== 'B2B') { delete context.requestPurpose; delete context.requestQuestion; }
    const suppliedBusinessDetail = changed && !ingredients.test(n) && !storage.test(n) && !asksTaste && !asksHeat && !foodQuestion && !asksUse && !company.length;
    if (requestPurposes.has(context.requestPurpose) && context.audience === 'B2B' && (resume || suppliedBusinessDetail)) ids.splice(0, ids.length, context.requestPurpose);
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
        context.requestPurpose = 'pricing';
        const qualified = qualify(context, t);
        ({ handoff, quickReplies, stage, missingFields } = qualified); pending = qualified.pending;
        const prompt = qualified.text.startsWith(`${t.commercial}\n\n`) ? qualified.text.slice(t.commercial.length + 2) : qualified.text;
        if (!(handoff && previous.handoffEligible === true && previous.funnelStage === 'qualified')) text += `\n\n${prompt}`;
        category = 'B2B'; reason = handoff ? 'qualified_business' : 'qualify_business';
      } else {
        quickReplies = quick(company.includes('brand') || company.includes('specifications') ? t.productFollow : [t.quote]);
        if (company.includes('brand')) sources = [{ label: questions.find(item => item.id === 'brand')?.link?.label || t.guide, path: 'about.html' }];
        else if (company.includes('specifications')) sources = [productSource(context, t)];
      }
    }
    else if (labelRequest.test(n)) { text = t.labelReview; handoff = true; context.purpose = 'label'; reason = 'document_request'; category = 'service'; intent = 'ingredients'; stage = 'handoff'; sources = [productSource(context, t)]; }
    else if (commercialIntent) {
      intent = commercialIntent; context.purpose = commercialIntent; sources = [productSource(context, t)];
      if (['export', 'horeca'].includes(commercialIntent) && !personalUse(n)) context.audience = 'B2B';
      if (!context.audience && commercialIntent === 'buy') context.audience = 'B2C';
      if (!context.audience) { text = t.audience; quickReplies = quick(t.audienceOptions); stage = 'audience'; pending = 'audience'; category = 'qualification'; reason = 'identify_audience'; }
      else if (context.audience === 'B2B') {
        context.requestPurpose = commercialIntent;
        const qualified = qualify(context, t); ({ text, handoff, quickReplies, stage, missingFields } = qualified); pending = qualified.pending; reason = handoff ? 'qualified_business' : 'qualify_business'; category = 'B2B';
      } else {
        category = 'B2C'; reason = 'consumer_availability';
        if (!context.country) { text = t.country; quickReplies = quick(t.countryOptions.map(value => [value, value])); stage = 'country'; pending = 'country'; missingFields = ['country']; }
        else { text = context.country === 'Korea' ? t.domestic : latam.has(context.country) ? t.latam : t.otherCountry; quickReplies = quick(t.productFollow); sources.unshift({ label: context.country === 'Korea' ? t.shop : t.updates, url: 'https://www.instagram.com/mokda_official/' }); }
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
          if ((!context.product || context.productOrigin === 'recommended') && (foodQuestion || context.heat_preference === 'less_spicy')) { context.product = context.heat_preference === 'less_spicy' || /고기|carne|meat|parrilla/.test(n) ? 'para_carnes' : 'kpeno'; context.productOrigin = 'recommended'; }
          const specific = {
            KR: { kpeno: 'K-PEÑO는 고추장과 할라피뇨를 담은 매콤한 소스예요. 타코·치킨·나초·피자에 곁들여보세요.', para_carnes: 'Para Carnes는 쌈장 기반의 감칠맛을 담은 소스예요. 구운 고기나 찐 고기, 삶은 고기와 채소에 찍어 드시면 됩니다.' },
            ES: { kpeno: 'K-PEÑO combina gochujang y jalapeño para un toque picante. Va bien con tacos, pollo, nachos y pizza.', para_carnes: 'Para Carnes es una salsa a base de ssamjang, con un sabor umami profundo. Úsala para dipear carnes asadas, al vapor o hervidas, y verduras.' },
            EN: { kpeno: 'K-PEÑO combines gochujang and jalapeño for a spicy kick. Try it with tacos, chicken, nachos or pizza.', para_carnes: 'Para Carnes is a ssamjang-based sauce with a deep umami flavor. Use it as a dip for grilled, steamed or boiled meat and vegetables.' },
          };
          const heat = {
            KR: { kpeno: 'K-PEÑO는 중간 정도의 매운맛에 고추장의 감칠맛과 할라피뇨의 산뜻함이 어우러집니다.', para_carnes: 'Para Carnes는 순한 매운맛에 쌈장의 깊은 감칠맛과 고소함이 어우러집니다.', note: '매운맛은 개인차가 있으며, 두 제품을 비교하는 수치 기준은 없습니다.' },
            ES: { kpeno: 'K-PEÑO tiene un picante medio, con el umami del gochujang y el toque fresco del jalapeño.', para_carnes: 'Para Carnes tiene un picante suave, con el umami profundo y las notas tostadas del ssamjang.', note: 'La percepción del picante varía de una persona a otra. No contamos con una escala numérica para comparar las dos salsas.' },
            EN: { kpeno: 'K-PEÑO has medium heat, with gochujang umami and a fresh jalapeño note.', para_carnes: 'Para Carnes has mild heat, with deep ssamjang umami and toasted notes.', note: 'Heat perception varies by person. We do not use a numerical scale to compare the two sauces.' },
          }[lang];
          const taste = {
            KR: { kpeno: 'K-PEÑO는 고추장과 할라피뇨의 매운맛·산미에 알룰로스로 단맛의 균형을 맞춘 소스예요. 부드러운 질감도 함께 느낄 수 있습니다.', para_carnes: 'Para Carnes는 된장과 고추장을 바탕으로, 참깨·참기름·표고버섯의 고소한 풍미와 깊은 감칠맛을 담았어요. 매운맛은 순한 편입니다.' },
            ES: { kpeno: 'K-PEÑO combina el picante del gochujang y el toque ácido del jalapeño con un dulzor equilibrado de la alulosa. Tiene una textura suave y cremosa.', para_carnes: 'Para Carnes tiene una base de doenjang y gochujang, con umami y notas tostadas de sésamo, aceite de sésamo y shiitake. Su picante es suave.' },
            EN: { kpeno: 'K-PEÑO balances gochujang heat and jalapeño tang with sweetness from allulose. It has a smooth, creamy texture.', para_carnes: 'Para Carnes has a doenjang and gochujang base, with deep umami and toasted notes from sesame, sesame oil and shiitake. Its heat is mild.' },
          }[lang];
          if (asksHeat) chunks.push([...(context.product && context.product !== 'both' ? [heat[context.product]] : [heat.kpeno, heat.para_carnes]), heat.note].filter(Boolean).join('\n\n'));
          else if (asksTaste && context.product && context.product !== 'both') chunks.push(taste[context.product]);
          else if (asksTaste && context.product === 'both') chunks.push(taste.kpeno + '\n\n' + taste.para_carnes);
          else { chunks.push(specific[lang][context.product] || questions.find(item => item.id === id)?.answer || t.unknown); if (context.heat_preference === 'less_spicy') chunks.push(t.lessSpicy); }
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
    if (!social && !switched) {
      context.topic = intent;
      if (category === 'product') context.answerFocus = asksHeat ? 'spice' : asksTaste ? 'taste' : intent;
      else delete context.answerFocus;
    }
    if (requestPurposes.has(context.requestPurpose) && context.audience === 'B2B') {
      if (!context.requestQuestion) context.requestQuestion = question;
      else if (changed) context.requestQuestion = correctInquiry(question, context, { ...previous, lastQuestion: context.requestQuestion }, true);
    }
    const currentTopic = sampleFreight ? 'sampleFreight' : company[0] || (asksHeat ? 'spice' : asksMore && asksTaste ? 'more' : intent);
    if (!social && reason !== 'clarify_unknown' && reason !== 'out_of_scope') context.discussedTopics = [...(context.discussedTopics || '').split('|').filter(topic => topic && topic !== currentTopic), currentTopic].slice(-5).join('|');
    if ((stage === 'resolved' && ['product', 'company', 'B2C'].includes(category)) || (stage === 'qualified' && category === 'B2B')) quickReplies = nextQuestions(context, lang, category, handoff, currentTopic);
    context.funnelStage = stage; context.pendingField = pending; context.handoffEligible = handoff;
    const aiTextAllowed = !handoff && ['product', 'general'].includes(category) && !ids.includes('ingredients') && !asksHeat && !asksTaste && !social && reason === 'self_service';
    const decision = Object.freeze({ audience: context.audience || null, stage, handoff, reason, missingFields, category, intent });
    return { text, context, sources: sources.filter((source, i, all) => all.findIndex(item => (item.path || item.url) === (source.path || source.url)) === i).slice(0, 2), quickReplies, handoff, handoffSummary: summary(context, lang), language: lang, topic: context.topic || null, intent, category, decision, aiTextAllowed };
  }
  window.MOKDA_CHAT_ENGINE = Object.freeze({ reply, summary, productName, greeting: language => copy[language]?.greeting || copy.ES.greeting, initialReplies: language => quick((copy[language] || copy.ES).initial) });
})();

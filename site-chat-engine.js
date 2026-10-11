/* Local guidance only: verified public answers, bounded context, no AI/network calls. */
(() => {
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').toLowerCase().replace(/[‐‑–—]/g, '-');
  const labels = {
    KR: { greeting: '안녕하세요! MOKDA의 소스와 구매·협업을 안내해드려요.', thanks: '네! 더 궁금한 점이 있으면 편하게 물어보세요.', unknown: '이 내용은 자동 안내로 확인하기 어렵습니다. 아래 WhatsApp 버튼으로 담당자에게 문의해주세요.', human: '아래 WhatsApp 버튼을 누르면 문의 내용이 담긴 대화창이 열립니다. 전송은 WhatsApp에서 직접 해주세요.', status: '이 창은 자동 안내입니다. 담당자의 접속 상태는 확인할 수 없어요. WhatsApp으로 문의를 남겨주세요.', noSend: '아직 메시지를 보내지 않았습니다. 아래 버튼으로 WhatsApp을 열고 직접 전송해주세요.', received: '말씀하신 내용을 문의 초안에 반영했습니다. 아래 WhatsApp 버튼으로 담당자에게 전달해주세요.', missingCountry: '구매나 거래를 문의하실 국가가 어디인가요?', commercial: '가격·판매처·재고와 거래 조건은 담당자 확인이 필요합니다.', guide: '제품 살펴보기', note: '개인의 섭취 안전이나 무함유·인증 여부는 여기서 보증할 수 없습니다. 최신 패키지 표시를 확인하고 담당자에게 문의해주세요.', draft: '안녕하세요, MOKDA. 다음 내용으로 문의합니다:', context: ['제품', '국가', '수량', '목적', '채널'], purpose: { buy: '구매', pricing: '가격·거래 조건', export: '유통·수출', horeca: '매장·식당 납품', collaboration: '협업' } },
    ES: { greeting: '¡Hola! Te orientamos sobre las salsas MOKDA, compras y colaboraciones.', thanks: '¡Con gusto! Si tienes otra pregunta, escríbela aquí.', unknown: 'No puedo confirmar eso con la información disponible. Puedes consultarlo con el equipo por WhatsApp.', human: 'El botón de WhatsApp abre una conversación con tu consulta preparada. Tú decides cuándo enviarla.', status: 'Este chat ofrece orientación automática. No puedo ver si el equipo está conectado. Puedes dejar tu consulta por WhatsApp.', noSend: 'Todavía no se ha enviado ningún mensaje. Abre WhatsApp con el botón de abajo y envíalo cuando quieras.', received: 'Agregué esos datos al borrador de tu consulta. Puedes compartirlo con el equipo por WhatsApp.', missingCountry: '¿En qué país quieres comprar o distribuir las salsas?', commercial: 'El equipo debe confirmar precios, puntos de venta, disponibilidad y condiciones comerciales.', guide: 'Ver las salsas', note: 'No puedo garantizar que un producto sea seguro para ti, que esté libre de un ingrediente o que tenga una certificación. Revisa la etiqueta actual y consulta al equipo.', draft: 'Hola, MOKDA. Quisiera consultar sobre:', context: ['Producto', 'País', 'Cantidad', 'Motivo', 'Canal'], purpose: { buy: 'Compra', pricing: 'Precios y condiciones', export: 'Distribución e importación', horeca: 'Tienda o restaurante', collaboration: 'Colaboración' } },
    EN: { greeting: 'Hi! We can help with MOKDA sauces, buying and partnerships.', thanks: 'You’re welcome! Feel free to ask another question.', unknown: 'I can’t confirm that from the available information. You can ask our team on WhatsApp.', human: 'The WhatsApp button opens a conversation with your inquiry prepared. You send the message yourself.', status: 'This chat provides automated guidance. I can’t check whether our team is online. You can leave an inquiry on WhatsApp.', noSend: 'No message has been sent yet. Open WhatsApp using the button below and send it when you’re ready.', received: 'I added those details to your inquiry draft. You can share it with our team on WhatsApp.', missingCountry: 'Which country would you like to buy or distribute in?', commercial: 'Our team needs to confirm prices, retailers, stock and commercial terms.', guide: 'Explore the sauces', note: 'I can’t guarantee personal food safety, absence of an ingredient or certification. Check the current label and ask our team.', draft: 'Hello, MOKDA. I would like to ask about:', context: ['Product', 'Country', 'Quantity', 'Purpose', 'Channel'], purpose: { buy: 'Buying', pricing: 'Prices and terms', export: 'Distribution and import', horeca: 'Shop or restaurant supply', collaboration: 'Collaboration' } },
  };
  const countries = [
    ['Peru', /페루|\bperu\b|\blima\b|리마/], ['Mexico', /멕시코|\bmexico\b/], ['Chile', /칠레|\bchile\b/], ['Colombia', /콜롬비아|\bcolombia\b/], ['Argentina', /아르헨티나|\bargentina\b/], ['Korea', /한국|대한민국|\bkorea\b|\bcorea\b/], ['USA', /미국|\b(?:usa|united states|estados unidos)\b/],
  ];
  const trade = new Set(['buy', 'pricing', 'export', 'horeca', 'collaboration']);
  const food = /타코|치킨|나초|피자|고기|채소|찍어|\b(?:tacos?|pollo|chicken|nachos|pizza|empanadas|carne|meat|vegetables?|verduras?|parrilla)\b/;
  const ingredients = /알레르|성분|원재료|글루텐|우유|대두|참깨|비건|할랄|인증|임산부|임신|\b(?:milk|leche|soy|soya|soja|wheat|trigo|sesame|sesamo|allerg\w*|alerg\w*|ingredients?|ingredientes?|gluten|vegan\w*|halal|certific\w*|pregnan\w*|embaraz\w*|safe|segura)\b/;
  const storage = /보관|냉장|개봉|소비기한|유통기한|안\s*열|몇\s*(?:달|일)|\b(?:stor\w*|refriger\w*|fridge|open\w*|abr\w*|guard\w*|conserv\w*|freeze|freezer|fecha|dias|shelf|expir\w*)\b/;
  const price = /가격|단가|견적|최소\s*(?:주문|수량)|샘플|얼마(?!나|동안)|\b(?:price\w*|cost\w*|cuesta\w*|precios?|cotizacion|moq|minimo|minimum|muestras?|samples?)\b/;
  const human = /담당자|상담원|사람.*(?:상담|연결)|질문.*(?:그만|싫)|\b(?:whatsapp|human|person|persona|agent|asesor|contact\w*|equipo|team)\b|no quiero responder/;
  function contextFrom(question, previous, language) {
    const context = {};
    for (const key of ['product', 'productOrigin', 'country', 'city', 'quantity', 'purpose', 'channel', 'heat_preference', 'food', 'lastQuestion', 'topic', 'language']) {
      if (typeof previous?.[key] === 'string') context[key] = previous[key].slice(0, key === 'lastQuestion' ? 500 : 60);
    }
    context.language = labels[context.language] ? context.language : language;
    const n = normalize(question);
    if (/영어로|\b(?:in english|en ingles)\b/.test(n)) context.language = 'EN';
    if (/스페인어로|\b(?:in spanish|en espanol)\b/.test(n)) context.language = 'ES';
    if (/한국어로|\b(?:in korean|en coreano)\b/.test(n)) context.language = 'KR';
    if (/둘\s*다|두\s*제품|\b(?:both|ambas|ambos)\b/.test(n)) context.product = 'both';
    else if (/k[ -]?(?:peno|penio)|케이\s*페[뇨노]|할라피뇨|jalapeno/.test(n)) context.product = 'kpeno';
    else if (/para\s*carnes|파라\s*카르네스|파라카르네스/.test(n)) context.product = 'para_carnes';
    else if (/다른\s*(?:거|소스|제품)|\b(?:the other|la otra|el otro)\b/.test(n) && ['kpeno', 'para_carnes'].includes(context.product)) context.product = context.product === 'kpeno' ? 'para_carnes' : 'kpeno';
    if (/k[ -]?(?:peno|penio)|케이\s*페[뇨노]|할라피뇨|jalapeno|para\s*carnes|파라\s*카르네스|다른\s*(?:거|소스)|\b(?:the other|la otra|el otro)\b/.test(n)) context.productOrigin = 'explicit';
    if (/덜\s*매|매운.{0,15}(?:못|안)|\b(?:not.*spicy|less spicy|mild|no.*picante|poco picante)\b/.test(n)) context.heat_preference = 'less_spicy';
    else if (/매콤|매운|맵|\b(?:spicy|picante)\b/.test(n)) context.heat_preference = 'spicy';
    if (/타코|\btacos?\b/.test(n)) context.food = 'tacos';
    else if (/치킨|\b(?:chicken|pollo)\b/.test(n)) context.food = 'chicken';
    else if (/\bparrilla|grilled\b|구운\s*고기/.test(n)) context.food = 'grilled_meat';
    else if (/고기|\b(?:carne|meat)\b/.test(n)) context.food = 'meat';
    // Remove explicitly rejected values before recognizing a replacement.
    const corrected = n.replace(/(?:no|not)\s+(?:peru|mexico|chile|colombia|argentina|korea)\b/g, '').replace(/(?:페루|멕시코|칠레|콜롬비아|한국)(?:가|이)?\s*(?:아니라|말고)/g, '');
    const found = countries.map(([value, regex]) => ({ value, index: corrected.search(regex) })).filter(item => item.index >= 0).sort((a, b) => a.index - b.index);
    if (found.length) context.country = found.at(-1).value;
    if (/\blima\b|리마/.test(n)) context.city = 'Lima';
    else if (context.country !== previous?.country) delete context.city;
    const quantities = [...n.matchAll(/\b(\d{1,7}(?:,\d{3})*)\s*(?:병|개|박스|botellas?|bottles?|cajas?|cases?|units?)|([한두세])\s*병|\b(one|two|three|una|un|dos|tres)\s+(botellas?|bottles?)/g)];
    if (quantities.length) {
      const q = quantities.at(-1);
      context.quantity = q[1] ? q[0].replace(/,/g, '') : `${({ 한: 1, 두: 2, 세: 3, one: 1, two: 2, three: 3, una: 1, un: 1, dos: 2, tres: 3 })[q[2] || q[3]]} ${q[4] || '병'}`;
    }
    if (/온라인|\bonline\b/.test(n)) context.channel = 'Online';
    else if (/레스토랑|식당|치킨집|\b(?:restaurants?|restaurante)\b/.test(n)) context.channel = 'Restaurant';
    else if (/마트|매장|\b(?:supermarkets?|shops?|stores?|tiendas?)\b/.test(n)) context.channel = 'Retail';
    else if (/인스타|\binstagram\b/.test(n)) context.channel = 'Instagram';
    return context;
  }
  function productName(product) { return product === 'kpeno' ? 'K-PEÑO' : product === 'para_carnes' ? 'Para Carnes' : product === 'both' ? 'K-PEÑO + Para Carnes' : ''; }
  function summary(context, language) {
    const t = labels[language];
    const entries = [productName(context.product), context.country, context.quantity, t.purpose[context.purpose], context.channel];
    const details = entries.flatMap((value, i) => value ? [`${t.context[i]}: ${value}`] : []);
    if (context.lastQuestion) details.push(context.lastQuestion);
    return `${t.draft}\n${details.join('\n') || 'MOKDA'}`.slice(0, 1200);
  }
  function reply(question, { language = 'ES', context: previous = {} } = {}) {
    language = labels[language] ? language : 'ES';
    question = String(question || '').trim().slice(0, 500);
    const n = normalize(question);
    const context = contextFrom(question, previous, language);
    const lang = context.language;
    const t = labels[lang];
    const questions = window.MOKDA_HELP_DATA?.[lang]?.categories.flatMap(category => category.questions) || [];
    const ids = [];
    const add = id => { if (!ids.includes(id)) ids.push(id); };
    const social = /^(?:안녕(?:하세요)?|반갑습니다|감사합니다|고마워요?|hola|buenos dias|buenas tardes|buenas noches|gracias|muchas gracias|hello|hi|hey|thanks|thank you|good morning|good evening)[!?.\s¡¿]*$/.test(n);
    const switched = context.language !== (previous.language || language);
    let answer, handoff = false;
    if (social) answer = /감사|고마|gracias|thank/.test(n) ? t.thanks : t.greeting;
    else if (/보냈|전송.*됐|\b(?:already send|already sent|enviado|enviaste)\b/.test(n)) answer = t.noSend;
    else if (human.test(n)) { answer = /온라인|접속|\bonline|connected|conectado\b/.test(n) ? t.status : t.human; handoff = true; }
    else if (/날씨|비트코인|api\s*key|토큰|고객.*삭제|\b(?:weather|clima|bitcoin|delete|password)\b|<\/?[a-z]/.test(n)) { answer = t.unknown; handoff = true; }
    else {
      if (ingredients.test(n)) add('ingredients');
      if (storage.test(n)) add('storage');
      if (price.test(n)) add('pricing');
      if (food.test(n) && !ingredients.test(n)) add('pairings');
      const matched = window.MOKDA_CHAT_INTENTS?.match(question, lang);
      if (matched && !(matched === 'ingredients' && food.test(n) && !ingredients.test(n))) add(matched);
      if (!ids.length && /comprar|conseguir|comprarlas|comprarla|get .*\b(?:peru|mexico)|구매|구입|배송|오늘.*받|where.*buy/.test(n)) add('buy');
      if (!ids.length && /브랜드|살사코레아나|\b(?:marca|salsa coreana|mokda)\b/.test(n)) add('brand');
      if (!ids.length && /역사|시작\s*이야기|연혁|historia|empezo|como empezo|how.*start/.test(n) && ['brand', 'history'].includes(previous.topic)) add('history');
      if (!ids.length && /국회방송|기사|소식|뉴스|congreso|expoalimentaria|noticias|news/.test(n)) add('news');
      if (!ids.length && /먹다랑|more than two sauces|두.*소스/.test(n)) add('brand');
      if (!ids.length && /협업|colabor|인플루언서|influencer|creator/.test(n)) add('collaboration');
      if (!ids.length && /수입|유통|통관|수출|독점|납품|\b(?:import\w*|distribut\w*|exclusivity|registro sanitario)\b/.test(n)) add('export');
      if (!ids.length && previous.purpose === 'collaboration' && /propuesta|propose|event|행사|제안/.test(n)) add('collaboration');
      if (!ids.length && /포장|용량|envase|packaging|kilo/.test(n) && trade.has(previous.purpose)) add(previous.purpose);
      if (!ids.length && context.product && /k[ -]?(?:peno|penio)|케이\s*페[뇨노]|para\s*carnes|파라\s*카르네스/.test(n)) add(previous.topic || 'choose');
      if (!ids.length && (context.country || context.quantity) && /문의|quiero|want|buy|comprar/.test(n)) add('buy');
      if (!ids.length && (switched || context.product !== previous.product || context.country !== previous.country || context.quantity !== previous.quantity || context.channel !== previous.channel)) add(previous.topic || (trade.has(previous.purpose) ? previous.purpose : 'choose'));
      if (!ids.length && previous.product && /그거|그럼|은요|는요|\b(?:esa|eso|that|it|which|otra|other)\b/.test(n)) add(previous.topic || 'choose');
      if (!ids.length) { answer = t.unknown; handoff = true; }
      else {
        const chunks = [];
        for (const id of ids.slice(0, 3)) {
          context.topic = id;
          if (trade.has(id)) {
            context.purpose = id; handoff = true;
            if (id === 'collaboration') chunks.push(questions.find(item => item.id === id)?.answer || t.received);
            else chunks.push(`${t.commercial}${context.country ? ` ${t.received}` : ` ${t.missingCountry}`}`);
          } else if (['pairings', 'choose'].includes(id)) {
            if ((!context.product || context.productOrigin === 'recommended') && food.test(n)) {
              context.product = /고기|carne|meat|parrilla/.test(n) ? 'para_carnes' : 'kpeno'; context.productOrigin = 'recommended';
            }
            const specific = {
              KR: { kpeno: 'K-PEÑO는 고추장과 할라피뇨를 담은 매콤한 소스예요. 타코·치킨·나초·피자에 곁들여보세요.', para_carnes: 'Para Carnes는 쌈장 기반의 감칠맛을 담은 소스예요. 구운 고기나 찐 고기, 삶은 고기와 채소에 찍어 드시면 됩니다.' },
              ES: { kpeno: 'K-PEÑO combina gochujang y jalapeño para un toque picante. Va bien con tacos, pollo, nachos y pizza.', para_carnes: 'Para Carnes es una salsa a base de ssamjang, con un sabor umami profundo. Úsala para dipear carnes asadas, al vapor o hervidas, y verduras.' },
              EN: { kpeno: 'K-PEÑO combines gochujang and jalapeño for a spicy kick. Try it with tacos, chicken, nachos or pizza.', para_carnes: 'Para Carnes is a ssamjang-based sauce with a deep umami flavor. Use it as a dip for grilled, steamed or boiled meat and vegetables.' },
            };
            chunks.push(specific[lang][context.product] || questions.find(item => item.id === id)?.answer || t.unknown);
            if (context.heat_preference === 'less_spicy') chunks.push({ KR: 'K-PEÑO는 매콤한 제품입니다. Para Carnes도 맵지 않다고 보장할 수 없어, 매운맛에 민감하시면 구매 전 담당자에게 확인해주세요.', ES: 'K-PEÑO es picante. Tampoco podemos garantizar que Para Carnes no pique; si eres sensible al picante, consulta al equipo antes de comprar.', EN: 'K-PEÑO is spicy. We can’t guarantee that Para Carnes has no heat either; if you are sensitive to spice, check with our team before buying.' }[lang]);
          } else if (id === 'ingredients') {
            chunks.push(questions.find(item => item.id === id)?.answer || t.unknown);
            if (/안전|먹어도|인증|비건|할랄|임신|임산부|safe|segura|vegan|halal|certif|pregnan|embaraz/.test(n)) { chunks.push(t.note); handoff = true; }
          } else chunks.push(questions.find(item => item.id === id)?.answer || t.unknown);
        }
        answer = [...new Set(chunks)].join('\n\n');
      }
    }
    const detailsChanged = ['product', 'country', 'quantity', 'channel'].some(key => context[key] !== previous[key]);
    const detailOnly = previous.lastQuestion && detailsChanged && !ingredients.test(n) && !storage.test(n) && !price.test(n) && !food.test(n);
    if (detailOnly) {
      let inquiry = previous.lastQuestion;
      if (previous.country && context.country !== previous.country) {
        const old = countries.find(([value]) => value === previous.country)?.[1];
        if (old) inquiry = inquiry.replace(new RegExp(old.source.replaceAll('\\b', '').replace(/peru/g, 'per[uú]').replace(/mexico/g, 'm[eé]xico'), 'gi'), context.country);
      }
      if (previous.quantity && context.quantity !== previous.quantity) inquiry = inquiry.replaceAll(previous.quantity, context.quantity);
      if (previous.product && context.product !== previous.product) {
        const old = previous.product === 'kpeno' ? /k[ -]?pe[nñ]o|케이\s*페[뇨노]/gi : /para\s*carnes|파라\s*카르네스/gi;
        inquiry = inquiry.replace(old, productName(context.product));
      }
      context.lastQuestion = inquiry;
    }
    if (!social && !switched && !detailOnly && !human.test(n) && !/보냈|전송.*됐|already send|already sent|enviado|enviaste/.test(n)) context.lastQuestion = question;
    const detail = ids.map(id => questions.find(item => item.id === id)?.link).filter(link => link && !link.path.startsWith('contact.html'));
    if (context.product && ids.some(id => ['choose', 'pairings'].includes(id))) {
      detail.splice(0, detail.length, { label: t.guide, path: context.product === 'kpeno' ? 'kpeno.html' : context.product === 'para_carnes' ? 'para-carnes.html' : 'products.html' });
    }
    return { text: answer, context, sources: detail.slice(0, 2), handoff, handoffSummary: summary(context, lang), language: lang, topic: context.topic || null };
  }
  window.MOKDA_CHAT_ENGINE = Object.freeze({ reply, summary, productName, greeting: language => labels[language]?.greeting || labels.ES.greeting });
})();

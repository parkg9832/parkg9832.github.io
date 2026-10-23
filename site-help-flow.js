/* Guided support: deterministic FAQs, followed by a customer-reviewed inquiry. No AI or network calls. */
(() => {
  const countries = window.MOKDA_COUNTRIES;
  const products = ['kpeno', 'para_carnes', 'both'], roles = ['importer', 'distributor', 'retail', 'restaurant', 'other'];
  const copy = {
    KR: {
      home: '안녕하세요! 먹다 상담 도우미 먹랑이입니다. 어떤 안내가 필요하신가요?', initial: ['제품·개인 구매', '사업 거래', '기타 문의'],
      topics: { products: '궁금한 항목을 선택해주세요. 제품 정보와 구매 방법을 안내해드릴게요.', business: '먼저 거래 조건을 확인해보세요. 견적이나 샘플 진행이 필요하면 담당자에게 문의할 수 있습니다.', other: '필요한 안내를 선택해주세요.' },
      details: '사업을 운영하는 국가·지역, 업종과 관심 제품을 알려주세요.', contact: '추가로 확인하고 싶은 내용을 적어주세요. 선택한 정보와 함께 정리해 WhatsApp으로 연결해드릴게요.',
      review: '아래 문의 내용을 확인해주세요. WhatsApp이 열리면 직접 전송해 주세요.', back: '다른 질문 보기', unresolved: '추가 문의하기', homeLabel: '처음으로', quote: '견적·샘플 상담', edit: '문의 내용 수정', editDetails: '기본 정보 수정',
      country: '국가·지역', search: '국가·지역 검색', custom: '목록에 없는 국가·지역', customInput: '국가·지역 직접 입력', choose: '선택해주세요', type: '사업 유형', product: '관심 제품', next: '안내 보기', prepare: '문의 내용 확인',
      extra: '추가 문의 내용', extraOptional: '추가 문의 내용 (선택)', placeholder: '담당자가 확인해야 할 내용을 적어주세요', required: '국가·지역과 문의 내용을 확인해주세요.',
      roleNames: ['수입사', '유통사', '매장·소매', '레스토랑·HORECA', '기타 사업'], both: '두 제품 모두',
      topicLabels: { compare:'두 소스의 차이', heat:'맵기', pairings:'어울리는 음식', storage:'보관 방법', ingredients:'원재료·알레르겐', buy:'개인 구매 방법', terms:'가격·최소 주문', samples:'샘플 조건', packing:'박스·대용량 구성', documents:'바이어용 자료·인증', leadTime:'출고 일정', exclusive:'독점 유통·OEM', brand:'MOKDA 소개', collaboration:'협업 제안', issue:'제품·주문 문제', support:'상담 언어·답변 시간' },
      heat: 'K-PEÑO는 중간 정도의 매운맛에 고추장과 할라피뇨의 풍미를 담았습니다. Para Carnes는 순한 매운맛에 쌈장의 깊은 감칠맛을 담았어요. 매운맛은 개인차가 있으며 수치로 비교하는 기준은 없습니다.',
      issue: '제품이나 주문에 문제가 있다면 담당자가 개별 확인을 도와드립니다. 제품명, 구매처와 발생한 상황을 적어주세요. WhatsApp에서 사진을 함께 보내주시면 확인에 도움이 됩니다.',
      draft: '안녕하세요, MOKDA. 아래 내용으로 문의드립니다.', labels: ['문의 목적','국가·지역','사업 유형','관심 제품','확인한 항목','추가 문의'], productLink:'제품 상세 보기', compareLink:'두 제품 비교하기', instagram:'공식 Instagram 구매·소식 안내',
    },
    ES: {
      home: '¡Hola! Soy MOK-LANG, el asistente de MOKDA. ¿Qué información necesitas?', initial: ['Productos y compra personal', 'Consulta comercial', 'Otras consultas'],
      topics: { products:'Elige lo que quieres saber sobre las salsas o cómo comprarlas.', business:'Revisa las condiciones comerciales. Si necesitas una cotización o coordinar muestras, puedes preparar una consulta para nuestro equipo.', other:'Elige el tema de tu consulta.' },
      details:'Indícanos el país o territorio donde opera tu negocio, el tipo de negocio y las salsas de interés.', contact:'Cuéntanos qué más necesitas confirmar. Prepararemos tu consulta con la información seleccionada para continuar por WhatsApp.',
      review:'Revisa tu consulta y envíala cuando se abra WhatsApp.', back:'Ver otras preguntas', unresolved:'Hacer otra consulta', homeLabel:'Volver al inicio', quote:'Cotización o muestras', edit:'Editar mi consulta',editDetails:'Editar datos',
      country:'País o territorio', search:'Buscar país o territorio', custom:'Mi país o territorio no aparece', customInput:'Escribe el país o territorio', choose:'Selecciona', type:'Tipo de negocio', product:'Salsas de interés', next:'Ver información', prepare:'Revisar mi consulta',
      extra:'Tu consulta adicional', extraOptional:'Tu consulta adicional (opcional)', placeholder:'Escribe lo que nuestro equipo debe confirmar', required:'Revisa el país o territorio y el contenido de tu consulta.',
      roleNames:['Importadora','Distribuidora','Tienda / retail','Restaurante / HORECA','Otro negocio'], both:'Ambas salsas',
      topicLabels:{compare:'Diferencias entre las salsas',heat:'Nivel de picante',pairings:'Con qué acompañarlas',storage:'Conservación',ingredients:'Ingredientes y alérgenos',buy:'Compra personal',terms:'Precios y pedido mínimo',samples:'Condiciones de muestras',packing:'Cajas y formatos grandes',documents:'Documentos y certificaciones',leadTime:'Plazo de despacho',exclusive:'Exclusividad y marca propia',brand:'Sobre MOKDA',collaboration:'Proponer una colaboración',issue:'Problemas con un producto o pedido',support:'Idiomas y tiempo de respuesta'},
      heat:'K-PEÑO tiene un picante medio, con el sabor del gochujang y el jalapeño. Para Carnes tiene un picante suave y el umami intenso del ssamjang. La percepción del picante varía de una persona a otra; no usamos una escala numérica para compararlas.',
      issue:'Si tienes un problema con un producto o pedido, dinos qué producto compraste, dónde y qué ocurrió. Nuestro equipo revisará tu caso. Puedes adjuntar fotos por WhatsApp para ayudarnos a entender el problema.',
      draft:'Hola, MOKDA. Quisiera consultar lo siguiente.', labels:['Motivo','País o territorio','Tipo de negocio','Salsas de interés','Información consultada','Consulta adicional'], productLink:'Ver el producto',compareLink:'Comparar las salsas',instagram:'Compras y novedades: Instagram oficial',
    },
    EN: {
      home:'Hi! I’m MOK-LANG, MOKDA’s assistant. What would you like to know?', initial:['Products and personal purchases','Business inquiry','Other inquiries'],
      topics:{products:'Choose what you would like to know about the sauces or how to buy them.',business:'Check our business terms first. If you need a quote or want to arrange samples, you can prepare an inquiry for our team.',other:'Choose the subject of your inquiry.'},
      details:'Tell us the country or territory where your business operates, your business type and the sauces you are interested in.',contact:'Tell us what else you would like to ask. We’ll put your questions and selected details into a message you can send on WhatsApp.',
      review:'Review your inquiry, then send it when WhatsApp opens.',back:'See other questions',unresolved:'Ask our team',homeLabel:'Back to start',quote:'Quote or sample inquiry',edit:'Edit my inquiry',editDetails:'Edit details',
      country:'Country or territory',search:'Search countries or territories',custom:'My country or territory is not listed',customInput:'Enter the country or territory',choose:'Select',type:'Business type',product:'Sauces of interest',next:'View information',prepare:'Review my inquiry',
      extra:'Your additional question',extraOptional:'Your additional question (optional)',placeholder:'Tell us what our team needs to confirm',required:'Check the country or territory and your inquiry details.',
      roleNames:['Importer','Distributor','Shop / retail','Restaurant / HORECA','Other business'],both:'Both sauces',
      topicLabels:{compare:'How the sauces differ',heat:'Heat level',pairings:'Serving ideas',storage:'Storage',ingredients:'Ingredients and allergens',buy:'Personal purchases',terms:'Prices and minimum orders',samples:'Sample conditions',packing:'Cases and larger formats',documents:'Documents and certifications',leadTime:'Dispatch timing',exclusive:'Exclusivity and private label',brand:'About MOKDA',collaboration:'Propose a collaboration',issue:'Product or order problems',support:'Languages and response times'},
      heat:'K-PEÑO has medium heat, with gochujang and jalapeño flavor. Para Carnes is mildly spicy, with the rich, savory flavor of ssamjang. Heat perception varies by person; we do not use a numerical scale to compare them.',
      issue:'If there is a problem with a product or order, tell us which sauce you bought, where you bought it and what happened. You can attach photos on WhatsApp to help our team look into it.',
      draft:'Hello, MOKDA. I would like to ask about the following.',labels:['Purpose','Country or territory','Business type','Sauces of interest','Information reviewed','Additional question'],productLink:'View product details',compareLink:'Compare the sauces',instagram:'Purchases and updates: official Instagram',
    },
  };
  const topics = {products:['compare','heat','pairings','storage','ingredients','buy'],business:['terms','samples','packing','documents','leadTime','exclusive'],other:['brand','collaboration','issue','support']};
  const plain = (value, max = 500) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max) : '';
  const productName = product => ({kpeno:'K-PEÑO',para_carnes:'Para Carnes',both:'K-PEÑO + Para Carnes'}[product] || '');
  function initial(product = '') { return {stage:'home',branch:'',product:products.includes(product)?product:'',countryCode:'',otherCountry:'',businessType:'',topic:'',extra:''}; }
  function restore(raw) {
    const state=initial(raw?.product);
    if (!raw || typeof raw !== 'object') return state;
    if (topics[raw.branch]) state.branch=raw.branch;
    if (['home','business_context','topics','answer','contact','prepared'].includes(raw.stage) && (state.branch || raw.stage==='home')) state.stage=raw.stage;
    state.countryCode = countries.known(raw.countryCode) || raw.countryCode==='Other' ? raw.countryCode : countries.code(raw.country);
    state.otherCountry=plain(raw.otherCountry,80); state.businessType=roles.includes(raw.businessType)?raw.businessType:'';
    state.topic=topics[state.branch]?.includes(raw.topic)?raw.topic:'';state.extra=plain(raw.extra);
    if (state.stage==='answer'&&!state.topic) state.stage='topics';
    if (state.stage==='prepared'&&!validContact(state)) state.stage='contact';
    return state;
  }
  const validCountry = state => countries.known(state.countryCode) || state.countryCode==='Other' && /\p{L}/u.test(state.otherCountry) && state.otherCountry.length>=2;
  const qualified = state => state.branch==='business' && validCountry(state) && roles.includes(state.businessType) && products.includes(state.product);
  const validContact = state => validCountry(state) && (state.branch==='business'?qualified(state):state.extra.length>=3);
  const countryName = state => countries.name(state.countryCode) || (state.countryCode==='Other'?state.otherCountry:'');
  function transition(previous, type, value) {
    let state=restore(previous);
    if (type==='branch' && topics[value]) { state.branch=value;state.topic='';state.stage=value==='business'&&!qualified(state)?'business_context':'topics'; }
    else if (type==='details' || type==='prepare') {
      const next=restore({...state,...value,stage:state.stage,branch:state.branch});
      if(type==='details'&&!qualified(next) || type==='prepare'&&!validContact(next)) return null;
      state=next;state.stage=type==='details'?'topics':'prepared';
    } else if (type==='faq' && topics[state.branch]?.includes(value)) {state.topic=value;state.stage='answer';}
    else if (type==='topics'&&topics[state.branch]) state.stage='topics';
    else if (type==='contact'&&topics[state.branch]) state.stage=state.branch==='business'&&!qualified(state)?'business_context':'contact';
    else if (type==='edit'&&state.stage==='prepared') state.stage='contact';
    else if (type==='home') state={...state,stage:'home',branch:'',topic:''};
    else return null;
    return state;
  }
  function answer(state, language) {
    const t=copy[language], faq=window.MOKDA_HELP_DATA[language].categories.flatMap(x=>x.questions), company=window.MOKDA_COMPANY_KNOWLEDGE.answers[language];
    const find=id=>faq.find(x=>x.id===id);
    const text=({compare:find('choose')?.answer,heat:t.heat,pairings:find('pairings')?.answer,storage:find('storage')?.answer,ingredients:find('ingredients')?.answer,buy:find('buy')?.answer,terms:company.pricing+'\n\n'+company.moq,samples:company.samples,packing:company.packing+'\n\n'+company.bulk,documents:company.documents+'\n\n'+company.certifications,leadTime:company.leadTime,exclusive:company.exclusive+'\n\n'+company.oem,brand:company.brand,collaboration:find('collaboration')?.answer,issue:t.issue,support:company.support})[state.topic] || '';
    let sources=[];
    if (['compare','heat','pairings','storage','ingredients'].includes(state.topic)) sources=[{label:state.product&&state.product!=='both'?t.productLink:t.compareLink,path:state.product==='kpeno'?'kpeno.html':state.product==='para_carnes'?'para-carnes.html':'products.html'}];
    if(state.topic==='compare') sources=[{label:t.compareLink,path:'products.html'}];
    if(state.topic==='buy') sources=[{label:t.instagram,url:'https://www.instagram.com/mokda_official/'}];
    if(state.topic==='brand') sources=[{label:t.topicLabels.brand,path:'about.html'}];
    return {text,sources};
  }
  function summary(state, language='ES') {
    const t=copy[language],country=countries.label(state.countryCode,language)||countryName(state), role=t.roleNames[roles.indexOf(state.businessType)];
    const values=[t.initial[['products','business','other'].indexOf(state.branch)],country,state.branch==='business'?role:'',productName(state.product),t.topicLabels[state.topic],state.extra];
    return [t.draft,...values.flatMap((v,i)=>v?[`${t.labels[i]}: ${v}`]:[])].join('\n').slice(0,1800);
  }
  function view(state, language='ES') {
    const t=copy[language],choice=(type,value,label)=>({type,value,label});
    let message=t.home,choices=[],sources=[];
    if(state.stage==='home') choices=['products','business','other'].map((x,i)=>choice('branch',x,t.initial[i]));
    if(state.stage==='business_context') message=t.details;
    if(state.stage==='topics') {message=t.topics[state.branch];choices=topics[state.branch].map(x=>choice('faq',x,t.topicLabels[x]));choices.push(choice('contact','',state.branch==='business'?t.quote:t.unresolved),choice('home','',t.homeLabel));}
    if(state.stage==='answer') {const result=answer(state,language);message=result.text;sources=result.sources;choices=[choice('topics','',t.back),choice('contact','',state.branch==='business'?t.quote:t.unresolved),choice('home','',t.homeLabel)];if(state.topic==='buy')choices.splice(1,0,choice('branch','business',t.initial[1]));}
    if(state.stage==='contact') {message=t.contact;choices=[choice('topics','',t.back),choice('home','',t.homeLabel)];}
    if(state.stage==='prepared') {message=t.review+'\n\n'+summary(state,language);choices=[choice('edit','',t.edit),choice('topics','',t.back),choice('home','',t.homeLabel)];}
    return {message,choices,sources,step:state.stage==='home'?1:['contact','prepared'].includes(state.stage)?3:2,qualified:qualified(state),handoff:state.stage==='prepared'&&validContact(state)};
  }
  window.MOKDA_HELP_FLOW=Object.freeze({initial,restore,transition,view,summary,productName,countryName,qualified,validCountry,validContact,copy,roles,products});
})();

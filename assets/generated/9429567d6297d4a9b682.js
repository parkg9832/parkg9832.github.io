const homepageProofConfig = {
        // Latest verified cumulative brand social media views.
        verifiedLatamViews: 1000000,
        // Add only official supplied logo assets. Do not recreate institutional logos.
        institutionalLogos: [],
      };
      const heroSlides = [
        {
          desktopImage: 'assets/images/hero-mokda-sauce-pour-cutout.webp',
          mobileImage: 'assets/images/hero-mokda-sauce-pour-mobile.webp',
          theme: 'soft',
          href: '#products',
          copy: {
            EN: {
              kicker: 'MOKDA · KOREAN FOOD BRAND',
              title: 'Korea, closer to you',
              titleLines: ['Korea,', 'closer', 'to you'],
              subtitle: 'We make Korean flavors easier and more natural to enjoy every day.',
              button: 'Explore our sauces',
            },
            ES: {
              kicker: 'MOKDA · KOREAN FOOD BRAND',
              title: 'Corea, más cerca de ti',
              titleLines: ['Corea,', 'más cerca', 'de ti'],
              subtitle: 'Conectamos los sabores de Corea con tu día a día de una forma fácil y natural.',
              button: 'Conoce nuestras salsas',
            },
            KR: {
              kicker: 'MOKDA · KOREAN FOOD BRAND',
              title: '한국을 더 가까이',
              titleLines: ['한국을', '더 가까이'],
              subtitle: '한국의 맛을 당신의 일상에 더 쉽고 자연스럽게 연결합니다.',
              button: '소스 라인업 보기',
            },
          },
        },
        {
          desktopImage: 'assets/assetshero-2-desktop.webp',
          mobileImage: 'assets/assetshero-2-mobile.webp',
          href: '#map',
          copy: {
            EN: {
              kicker: 'KOREA NEAR ME',
              title: 'MOKDA Across Latin America',
              subtitle: 'Find official retailers and dining spots near you where you can experience the taste of MOKDA.',
              button: 'View Points of Sale',
            },
            ES: {
              kicker: 'PUNTOS OFICIALES',
              title: 'MOKDA en Latinoamérica',
              subtitle: 'Encuentra puntos de venta oficiales y restaurantes aliados donde ya puedes vivir la experiencia MOKDA.',
              button: 'Ver puntos de venta',
            },
            KR: {
              kicker: 'MOKDA SPOT',
              title: '라틴아메리카 전역에서 만나는 MOKDA',
              subtitle: '지금 가까운 공식 판매처에서 한국의 맛을 직접 경험해보세요.',
              button: '판매처 보기',
            },
          },
        },
        {
          desktopImage: 'assets/assetshero-3-desktop.webp',
          mobileImage: 'assets/assetshero-3-mobile.webp',
          href: '#partnership',
          copy: {
            EN: {
              kicker: 'B2B PARTNERSHIP',
              title: 'Partner with MOKDA for Success',
              subtitle: 'K-Culture is a new global trend.\nMOKDA offers tailored B2B partnerships.',
              button: 'Contact B2B',
            },
            ES: {
              kicker: 'ALIANZA B2B',
              title: 'Alianzas para negocios exitosos',
              subtitle: 'K-Culture es una nueva tendencia global.\nMOKDA ofrece alianzas B2B a la medida.',
              button: 'Iniciar Consulta B2B',
            },
            KR: {
              kicker: 'B2B PARTNERSHIP',
              title: '성공적인 비즈니스를 위한 파트너십',
              subtitle: '새로운 글로벌 트렌드 K-컬처,\nMOKDA가 맞춤형 B2B 파트너십을 제안합니다.',
              button: '비즈니스 문의하기',
            },
          },
        },
      ];

      const localizedProducts = [
        {
          category: {
            ES: 'SALSA GOCHUJANG',
            EN: 'SALSA GOCHUJANG',
            KR: 'SALSA GOCHUJANG',
          },
          koreanName: 'Gochujang',
          name: 'K-PEÑO',
          titleClass: 'text-neutral-950',
          desc: {
            ES: { line1: 'El picante del gochujang con la frescura del jalapeño', line2: '' },
            EN: { line1: 'Gochujang heat brightened with fresh jalapeño', line2: '' },
            KR: { line1: '고추장의 매콤함에 할라페뇨의 산뜻함을 더한', line2: '' },
          },
          image: 'assets/images/bottle-original-360.webp',
          foodImage: 'assets/images/original-nachos-chicken-chips-card.webp',
          textureImage: 'assets/images/original-nachos-chicken-chips-card.webp',
          panelTone: '#ef5f18',
          alt: 'MOKDA Salsa Gochujang K-PEÑO',
          shadow: 'rgba(126,38,18,0.22)',
          stageShadow: 'rgba(126,38,18,0.24)',
          stageGlow: 'rgba(239,95,24,0.12)',
        },
        {
          category: {
            ES: 'Salsa Ssamjang',
            EN: 'Ssamjang BBQ sauce',
            KR: '쌈장 바비큐 소스',
          },
          koreanName: 'Ssamjang',
          name: 'Para Carnes',
          titleClass: 'text-neutral-950',
          desc: {
            ES: { line1: 'Una salsa coreana de umami profundo para acompañar todo tipo de carnes: asadas, al vapor o hervidas', line2: '' },
            EN: { line1: 'A deep, umami-rich Korean dipping sauce for every kind of meat—grilled, steamed, or boiled', line2: '' },
            KR: { line1: '구운 고기, 찐 고기, 삶은 고기 등 모든 고기에 찍어 먹는 깊고 진한 감칠맛의 한국식 소스', line2: '' },
          },
          image: 'assets/images/bottle-ssamjang-360.webp',
          foodImage: 'assets/images/para-carnes-grilled-meat-card.webp',
          textureImage: 'assets/images/para-carnes-grilled-meat-card.webp',
          panelTone: '#381607',
          alt: 'MOKDA Salsa Ssamjang Para Carnes',
          imageClass: '-translate-y-1 scale-x-[1.18] scale-y-[1.09] hover:-translate-y-2 hover:scale-x-[1.21] hover:scale-y-[1.12]',
          shadow: 'rgba(126,74,24,0.2)',
          stageShadow: 'rgba(126,74,24,0.23)',
          stageGlow: 'rgba(214,143,54,0.12)',
        },
      ];
      const homepageHeroSlides = heroSlides.slice(0, 1);
      const content = {
        EN: {
          nav: { about: 'About us', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contact' },
          socialTitle: 'SOCIAL',
          community: {
            kicker: 'VOICES',
            title: 'What people who know MOKDA say',
            institutions: 'SUPPORTED BY',
            previous: 'Previous institutions',
            next: 'Next institutions',
            testimonials: [
              {
                name: 'Jinsoo Park',
                occupation: 'CEO, Open Sauce Lab',
                profile: 'Developer of 1,000+ food and restaurant products',
                image: 'assets/images/testimonial-park-jinsoo-v1.webp',
                quote: 'MOKDA has strong potential to reinterpret Korean flavors for local food cultures and expand into global markets. I saw that potential firsthand while co-developing two sauces for Latin America. With its drive to meet consumers directly and validate the products in the market, I look forward to seeing MOKDA’s K-Food grow beyond Latin America and reach the world.',
              },
              {
                name: 'Juhyeong Noh',
                occupation: 'Dietitian',
                profile: 'Food and foodservice specialist company',
                image: 'assets/images/testimonial-no-juhyeong-upright-v2.png',
                quote: 'I was impressed by the product design: plant-based cream replaces dairy cream, and allulose is used instead of sugar to reduce the sugar content. The flavor is highly refined, balancing the sweet-and-spicy profile favored by Korean consumers today with deep umami. It is a versatile Korean sauce that considers both nutrition and taste.',
              },
            ],
          },
          proof: {
            kicker: 'MADE IN KOREA',
            title: 'From ingredients to market',
            expoValue: 'SEP',
            expo: 'Expoalimentaria Peru 2026 · Participation planned',
            programs: 'Selections in Korean institutional startup programs',
            views: 'Social media post views',
            historyCta: 'View our history →',
            photo: 'Preparing for international markets.',
            previous: 'Previous photo',
            next: 'Next photo',
          },
          salsa: {
            title: 'Korea,<br />closer<br />to you',
            description: "Salsa Coreana is MOKDA's first product line: a direct way to bring Korean flavors to everyday food.",
            cta: 'View lineup',
          },
          faq: {
            title: 'Frequently Asked Questions',
            cta: 'View Q&A',
            items: [
              ['What does MOKDA mean?', 'MOKDA comes from the Korean word “먹다,” meaning “to eat.” It is a K-Food brand connecting Korean flavors with everyday tables across Latin America.'],
              ['What is Salsa Coreana?', "It is MOKDA's first product line: K-PEÑO and Para Carnes, each designed for familiar everyday foods."],
              ['Can I contact MOKDA?', 'Yes. We welcome general consumer questions as well as distribution, retail, HORECA, and brand collaboration proposals for Latin America.'],
            ],
          },
          story: {
            kicker: 'IN THE FIELD',
            title: 'Bringing Korean flavor closer to everyday life',
            body: ['From ingredients to production, we capture the essence of Korea.'],
            manufacturing: 'We inspect the production process.',
            ingredient: 'Flavor starts with understanding its ingredients.',
          },
          products: {
            kicker: 'LINEUP',
            title: 'SALSA COREANA',
            pageCta: 'More products',
            lineKicker: 'SALSA COREANA',
            lineTitle: 'PRODUCT LINEUP',
            lineDescription: '',
            items: localizedProducts,
          },
          contact: {
            quickKicker: 'QUICK QUESTION',
            quickTitle: 'Have a question?',
            quickDescription: 'Ask about products, flavor, launch timing, or where to buy.',
            whatsapp: 'Ask us on WhatsApp',
            whatsappMessage: 'Hello, I found MOKDA through your website. I have a question.',
            b2bKicker: 'BUSINESS PARTNERSHIP',
            b2bTitle: 'We are looking for business partners.',
            b2bDescription: 'For distributors, importers, retail, HORECA, and business partnerships.',
          },
          map: {
            kicker: 'MOKDA SPOT',
            title: 'MOKDA SPOT in Latin America',
            description: "Five priority markets for MOKDA's expansion across Latin America.",
            listLabel: 'Open partner markets',
          },
          b2b: {
            kicker: 'CONTACT MOKDA',
            title: 'Business partnerships',
            description: 'Let’s discuss distribution, import, retail, HORECA, and brand collaboration opportunities.',
            cta: 'SEND',
          },
        },
        ES: {
          nav: { about: 'Sobre nosotros', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contacto' },
          socialTitle: 'REDES SOCIALES',
          community: {
            kicker: 'VOCES',
            title: 'Lo que dicen quienes conocen MOKDA',
            institutions: 'CON EL APOYO DE',
            previous: 'Instituciones anteriores',
            next: 'Instituciones siguientes',
            testimonials: [
              {
                name: 'Jinsoo Park',
                occupation: 'CEO de Open Sauce Lab',
                profile: 'Más de 1.000 desarrollos en alimentación y restauración',
                image: 'assets/images/testimonial-park-jinsoo-v1.webp',
                quote: 'MOKDA tiene un gran potencial para reinterpretar los sabores de Corea de acuerdo con la cultura gastronómica local y llevarlos al mercado global. Lo confirmé al desarrollar junto a la marca dos salsas para Latinoamérica. Gracias a su capacidad de encontrarse directamente con los consumidores y validar sus salsas en el mercado, espero que el K-Food de MOKDA crezca más allá de Latinoamérica y llegue al mundo.',
              },
              {
                name: 'Juhyeong Noh',
                occupation: 'Nutricionista',
                profile: 'Especialista en alimentación y foodservice',
                image: 'assets/images/testimonial-no-juhyeong-upright-v2.png',
                quote: 'Me pareció especialmente acertada la formulación de esta salsa: utiliza crema vegetal en lugar de crema de origen animal y alulosa en lugar de azúcar para reducir el contenido de azúcares. El sabor está muy logrado, con un equilibrio entre el perfil picante y dulce que prefieren hoy los consumidores coreanos y un umami profundo. Es una salsa coreana versátil que cuida tanto la nutrición como el sabor.',
              },
            ],
          },
          proof: {
            kicker: 'HECHO EN COREA',
            title: 'Del ingrediente al mercado',
            expoValue: 'SEP',
            expo: 'Expoalimentaria Perú 2026 · Participación prevista',
            programs: 'Selecciones en programas institucionales de emprendimiento de Corea',
            views: 'Visualizaciones en redes sociales',
            historyCta: 'Ver nuestra historia →',
            photo: 'Preparamos la entrada a nuevos mercados.',
            previous: 'Foto anterior',
            next: 'Foto siguiente',
          },
          salsa: {
            title: 'Corea,<br />más cerca<br />de ti',
            description: 'Salsa Coreana es la primera línea de MOKDA: una forma directa de acercar sabores coreanos a comidas cotidianas.',
            cta: 'Ver línea',
          },
          faq: {
            title: 'Preguntas frecuentes',
            cta: 'Ver Q&A',
            items: [
              ['¿Qué significa MOKDA?', 'MOKDA viene de la palabra coreana “먹다”, que significa comer. Es una marca K-Food que conecta sabores coreanos con las mesas cotidianas de Latinoamérica.'],
              ['¿Qué es Salsa Coreana?', 'Es la primera línea de MOKDA: K-PEÑO y Para Carnes, dos salsas pensadas para acompañar comidas cotidianas.'],
              ['¿Puedo contactar a MOKDA?', 'Sí. Recibimos consultas de consumidores y propuestas de distribución, retail, HORECA y colaboración de marca para Latinoamérica.'],
            ],
          },
          story: {
            kicker: 'SOBRE EL TERRENO',
            title: 'Para acercar el sabor de Corea a tu día a día',
            body: ['De los ingredientes a la producción, reunimos la esencia de Corea.'],
            manufacturing: 'Revisamos directamente el proceso de producción.',
            ingredient: 'El sabor empieza por conocer sus ingredientes.',
          },
          products: {
            kicker: 'LINEUP',
            title: 'SALSA COREANA',
            pageCta: 'Conoce nuestras salsas',
            lineKicker: 'SALSA COREANA',
            lineTitle: 'SALSAS MOKDA',
            lineDescription: '',
            items: localizedProducts,
          },
          contact: {
            quickKicker: 'PREGUNTA RÁPIDA',
            quickTitle: '¿Tienes una pregunta?',
            quickDescription: 'Consúltanos sobre salsas, sabores, disponibilidad o puntos de venta.',
            whatsapp: 'Pregúntanos por WhatsApp',
            whatsappMessage: 'Hola, conocí MOKDA a través de su página web. Tengo una pregunta.',
            b2bKicker: 'ALIANZA COMERCIAL',
            b2bTitle: 'Buscamos socios comerciales.',
            b2bDescription: 'Para distribuidores, importadores, retail, HORECA y alianzas comerciales.',
          },
          map: {
            kicker: 'MOKDA SPOT',
            title: 'MOKDA SPOT en Latinoamérica',
            description: 'Cinco mercados prioritarios para la expansión de MOKDA en Latinoamérica.',
            listLabel: 'Mercados abiertos a socios',
          },
          b2b: {
            kicker: 'CONTACTA CON MOKDA',
            title: 'Alianzas comerciales',
            description: 'Conversemos sobre distribución, importación, retail, HORECA y colaboraciones de marca.',
            cta: 'ENVIAR',
          },
        },
        KR: {
          nav: { about: '브랜드 소개', products: 'Salsa Coreana', qna: 'Q&A', contact: '문의' },
          socialTitle: 'MOKDA SNS',
          community: {
            kicker: 'VOICES',
            title: 'MOKDA를 경험한 사람들의 이야기',
            institutions: 'SUPPORTED BY',
            previous: '이전 기관',
            next: '다음 기관',
            testimonials: [
              {
                name: '박진수',
                occupation: '오픈소스랩 대표',
                profile: '식품·외식 제품 1,000개 이상 개발',
                image: 'assets/images/testimonial-park-jinsoo-v1.webp',
                quote: '먹다는 한국의 맛을 현지 식문화에 맞게 재해석해 글로벌 시장으로 확장할 가능성이 큰 브랜드입니다. 남미 진출을 위한 소스 2종을 함께 개발하며 그 가능성을 확인했습니다. 현지 소비자와 직접 만나고 검증해 나가는 실행력을 바탕으로, 먹다만의 K-Food가 남미를 넘어 세계시장으로 성장하기를 기대합니다.',
              },
              {
                name: '노주형',
                occupation: '영양사',
                profile: '식품·푸드서비스 전문기업 소속',
                image: 'assets/images/testimonial-no-juhyeong-upright-v2.png',
                quote: '동물성 크림 대신 식물성 크림을 사용하고, 설탕 대신 알룰로스를 적용해 당류를 낮춘 제품 설계가 인상적이었습니다. 맛의 완성도는 굉장히 높았으며, 최근 한국 소비자들이 선호하는 매콤달콤한 풍미와 깊은 감칠맛을 균형 있게 담아냈습니다. 영양과 맛을 함께 고민한, 활용도 높은 한국식 소스라고 생각합니다.',
              },
            ],
          },
          proof: {
            kicker: 'MADE IN KOREA',
            title: '원료부터 시장까지',
            expoValue: '9월',
            expo: 'Expoalimentaria Perú 2026 참가 예정',
            programs: '대한민국 기관 창업프로그램 선정',
            views: 'SNS 게시글 조회수',
            historyCta: '브랜드 히스토리 보기 →',
            photo: '해외시장 진출을 준비합니다.',
            previous: '이전 사진',
            next: '다음 사진',
          },
          salsa: {
            title: '한국을<br />더<br />가까이',
            description: 'Salsa Coreana는 MOKDA의 첫 번째 제품 라인으로, 익숙한 일상 음식에 한국의 맛을 더 가깝게 전합니다.',
            cta: '라인업 보기',
          },
          faq: {
            title: '자주 묻는 질문',
            cta: 'Q&A 보기',
            items: [
              ['MOKDA는 무슨 뜻인가요?', 'MOKDA는 “먹다”라는 한국어에서 시작된 이름입니다. 한국의 맛을 라틴아메리카의 일상 식탁과 연결하는 K-Food 브랜드입니다.'],
              ['Salsa Coreana는 무엇인가요?', 'K-PEÑO와 Para Carnes로 구성된 MOKDA의 첫 번째 제품 라인입니다.'],
              ['MOKDA에 문의할 수 있나요?', '네. 일반 소비자 문의와 라틴아메리카 유통, 리테일, HORECA 및 브랜드 협업 제안을 모두 받고 있습니다.'],
            ],
          },
          story: {
            kicker: 'IN THE FIELD',
            title: '한국의 맛이<br />낯설지 않도록',
            body: ['원료부터 생산까지, 한국의 정수를 담았습니다.'],
            manufacturing: '제조 과정을 직접 확인합니다.',
            ingredient: '맛의 시작인 원료부터 직접 살핍니다.',
          },
          products: {
            kicker: 'LINEUP',
            title: 'SALSA COREANA',
            pageCta: '제품 더보기',
            lineKicker: 'SALSA COREANA',
            lineTitle: '제품 라인업',
            lineDescription: '',
            items: localizedProducts,
          },
          contact: {
            quickKicker: 'QUICK QUESTION',
            quickTitle: '궁금한 점이 있나요?',
            quickDescription: '제품, 맛, 출시 일정, 판매처에 관해 WhatsApp으로 질문하세요.',
            whatsapp: 'WhatsApp으로 질문하기',
            whatsappMessage: '안녕하세요. MOKDA 웹사이트를 보고 문의드립니다.',
            b2bKicker: 'B2B PARTNERSHIP',
            b2bTitle: '함께할 비즈니스 파트너를 찾습니다.',
            b2bDescription: '유통사, 수입사, 리테일, HORECA 및 사업 협력 문의를 받습니다.',
          },
          map: {
            kicker: 'MOKDA SPOT',
            title: '라틴아메리카 MOKDA SPOT',
            description: 'MOKDA가 라틴아메리카 진출을 준비하는 다섯 개의 우선 시장입니다.',
            listLabel: '파트너 모집 지역',
          },
          b2b: {
            kicker: 'CONTACT MOKDA',
            title: '비즈니스 파트너십',
            description: '유통, 수입, 리테일, HORECA 및 브랜드 협업을 제안해 주세요.',
            cta: '문의 보내기',
          },
        },
      };

      const partnerLabels = {
        name: {
          EN: 'Become a MOKDA Partner',
          ES: 'Sé aliado MOKDA',
          KR: 'MOKDA 파트너 모집',
        },
        tag: 'Open',
      };

      const partnerMarkets = [
        {
          id: 'mexico',
          value: 'Mexico',
          country: { EN: 'Mexico', ES: 'México', KR: '멕시코' },
          address: {
            EN: 'Mexico City Center, Mexico',
            ES: 'Centro de Ciudad de México, México',
            KR: '멕시코시티 중심부, 멕시코',
          },
          mapQuery: 'Centro Histórico, Ciudad de México, México',
        },
        {
          id: 'peru',
          value: 'Peru',
          country: { EN: 'Peru', ES: 'Perú', KR: '페루' },
          address: {
            EN: 'Lima City Center, Peru',
            ES: 'Centro de Lima, Perú',
            KR: '리마 중심부, 페루',
          },
          mapQuery: 'Centro de Lima, Lima, Perú',
        },
        {
          id: 'colombia',
          value: 'Colombia',
          country: { EN: 'Colombia', ES: 'Colombia', KR: '콜롬비아' },
          address: {
            EN: 'Bogotá City Center, Colombia',
            ES: 'Centro de Bogotá, Colombia',
            KR: '보고타 중심부, 콜롬비아',
          },
          mapQuery: 'Plaza de Bolívar, Bogotá, Colombia',
        },
        {
          id: 'chile',
          value: 'Chile',
          country: { EN: 'Chile', ES: 'Chile', KR: '칠레' },
          address: {
            EN: 'Santiago City Center, Chile',
            ES: 'Centro de Santiago, Chile',
            KR: '산티아고 중심부, 칠레',
          },
          mapQuery: 'Plaza de Armas, Santiago, Chile',
        },
        {
          id: 'argentina',
          value: 'Argentina',
          country: { EN: 'Argentina', ES: 'Argentina', KR: '아르헨티나' },
          address: {
            EN: 'Buenos Aires City Center, Argentina',
            ES: 'Centro de Buenos Aires, Argentina',
            KR: '부에노스아이레스 중심부, 아르헨티나',
          },
          mapQuery: 'Plaza de Mayo, Buenos Aires, Argentina',
        },
      ];

      const stores = partnerMarkets.map((market) => ({
        ...market,
        mapUrl: `https://maps.google.com/maps?q=${encodeURIComponent(market.mapQuery)}&t=&z=12&ie=UTF8&iwloc=&output=embed`,
      }));

      let language = window.MOKDA_I18N.getLanguage();
      let currentSlide = 0;
      let heroInterval = null;
      let heroScrollTimer = null;
      let selectedStoreId = null;

      const mapLocales = { ES: 'es', KR: 'ko', EN: 'en' };
      function localizeMapUrl(url) {
        const locale = mapLocales[language] || 'es';
        const separator = url.includes('?') ? '&' : '?';
        return `${url.replace(/([?&])hl=[^&]*/g, '')}${separator}hl=${locale}`;
      }

      function syncMapFrame() {
        const frame = document.getElementById('mapFrame');
        if (!frame) return;
        const store = selectedStoreId ? stores.find((item) => item.id === selectedStoreId) : null;
        const responsiveDefaultUrl =
          window.matchMedia('(max-width: 639px)').matches && frame.dataset.mobileMapSrc
            ? frame.dataset.mobileMapSrc
            : frame.dataset.defaultMapSrc;
        const baseUrl = store?.mapUrl || responsiveDefaultUrl || frame.dataset.mapSrc;
        if (!baseUrl) return;
        frame.src = localizeMapUrl(baseUrl);
        frame.dataset.mapSrc = frame.src;
      }

      const revealObserver =
        'IntersectionObserver' in window
          ? new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                  }
                });
              },
              { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
          )
          : null;

      function bindReveal() {
        document.querySelectorAll('[data-reveal]:not([data-reveal-bound])').forEach((element) => {
          const delay = element.getAttribute('data-reveal-delay');
          if (delay) element.style.setProperty('--reveal-delay', `${delay}ms`);
          element.setAttribute('data-reveal-bound', 'true');
          if (revealObserver) revealObserver.observe(element);
          else element.classList.add('is-visible');
        });
      }

      function setText(id, value) {
        const node = document.getElementById(id);
        if (node) node.textContent = value;
      }

      function renderHomepageProof(t) {
        setText('proofKicker', t.proof.kicker);
        setText('proofTitle', t.proof.title);
        setText('proofExpoValue', t.proof.expoValue);
        setText('proofExpo', t.proof.expo);
        setText('proofPrograms', t.proof.programs);
        setText('proofViews', t.proof.views);
        setText('proofHistoryCta', t.proof.historyCta);
        setText('proofPhotoCaption', t.proof.photo);
        document.getElementById('proofCarouselPrev')?.setAttribute('aria-label', t.proof.previous);
        document.getElementById('proofCarouselNext')?.setAttribute('aria-label', t.proof.next);

        const views = Number(homepageProofConfig.verifiedLatamViews);
        const viewsItem = document.getElementById('proofViewsItem');
        const proofList = document.getElementById('proofList');
        const hasVerifiedViews = Number.isFinite(views) && views > 0;
        viewsItem?.classList.toggle('hidden', !hasVerifiedViews);
        proofList?.classList.toggle('sm:grid-cols-3', hasVerifiedViews);
        proofList?.classList.toggle('sm:grid-cols-2', !hasVerifiedViews);
        if (hasVerifiedViews) {
          setText('proofViewsValue', '1M+');
        }

        const logoContainer = document.getElementById('institutionalLogos');
        const logos = homepageProofConfig.institutionalLogos.filter((item) => item?.src && item?.alt);
        if (!logoContainer) return;
        logoContainer.replaceChildren();
        logoContainer.classList.toggle('hidden', logos.length === 0);
        logos.forEach((item) => {
          const image = document.createElement('img');
          image.src = item.src;
          image.alt = item.alt;
          image.loading = 'lazy';
          image.className = 'h-9 w-auto max-w-[150px] object-contain opacity-70 grayscale';
          logoContainer.appendChild(image);
        });
      }

      function renderHomepageContact(t) {
        setText('quickQuestionKicker', t.contact.quickKicker);
        setText('quickQuestionTitle', t.contact.quickTitle);
        setText('quickQuestionDescription', t.contact.quickDescription);
        setText('whatsappCta', t.contact.whatsapp);
        setText('b2bCardKicker', t.contact.b2bKicker);
        setText('b2bCardTitle', t.contact.b2bTitle);
        setText('b2bCardDescription', t.contact.b2bDescription);

        const number = String(window.MOKDA_CONTACT?.whatsappNumber || '').replace(/\D/g, '');
        const quickCard = document.getElementById('quickQuestionCard');
        const b2bCard = document.getElementById('b2bCard');
        const whatsappCta = document.getElementById('whatsappCta');
        const enabled = number.length >= 8;
        quickCard?.classList.toggle('hidden', !enabled);
        b2bCard?.classList.toggle('md:col-span-2', !enabled);
        if (enabled && whatsappCta) {
          whatsappCta.href = `https://wa.me/${number}?text=${encodeURIComponent(t.contact.whatsappMessage)}`;
        }
      }

      function createHeroCarousel() {
        const heroContainer = document.getElementById('heroSlides');
        if (homepageHeroSlides.length === 1 && heroContainer.querySelector('[data-hero-slide="0"]')) return;

        heroContainer.innerHTML = homepageHeroSlides
          .map(
            (slide, index) => {
              return `
              <div data-hero-slide="${index}" data-hero-theme="${slide.theme || 'soft'}" class="hero-slide relative h-full min-w-full snap-center bg-[#f7ddc2] opacity-100 transition-opacity duration-[1200ms] ease-in-out md:absolute md:inset-0 md:min-w-0 md:opacity-0">
                <div class="absolute inset-0 bg-[#f7ddc2]"></div>
                <div class="hero-sauce-plate absolute bottom-[-2rem] left-1/2 z-10 h-[350px] w-[112%] -translate-x-1/2 sm:h-[470px] md:bottom-[-9rem] md:h-[55vh] md:w-[78vw] md:-translate-x-[56%] lg:bottom-[-9.5rem] lg:h-[58vh] lg:w-[76vw] lg:-translate-x-[54%] xl:w-[72vw]">
                  <picture class="hero-media-motion block h-full w-full">
                    <source media="(min-width: 768px)" srcset="${slide.desktopImage}" />
                    <img src="${slide.mobileImage}" alt="" aria-hidden="true" class="h-full w-full object-contain object-bottom" ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} />
                  </picture>
                </div>
                <div class="hero-content relative z-20 mx-auto flex h-full w-full max-w-[1480px] flex-col px-4 sm:px-6 lg:px-8">
                  <p data-hero-kicker class="hero-motion hero-motion-kicker condensed-label mx-auto mb-4 text-center text-base uppercase text-[#a93600] sm:text-xl md:mb-2"></p>
                  <h1 data-hero-title class="hero-motion hero-motion-title hero-title display-latin mx-auto max-w-[1080px] text-center uppercase text-[#d94d0b]"></h1>
                  <div class="hero-copy flex flex-col items-center text-center">
                    <p data-hero-subtitle class="hero-motion hero-motion-subtitle max-w-xl break-keep text-pretty text-base font-semibold leading-relaxed text-[#321506] sm:text-xl"></p>
                    <a data-hero-link data-analytics-event="hero_product_click" href="#products" class="hero-motion hero-motion-cta inline-flex min-h-12 items-center justify-center rounded-lg bg-[#321506] px-7 py-3 text-sm font-extrabold uppercase text-[#f8dfc4] shadow-[0_8px_24px_rgba(50,21,6,0.16)] transition hover:bg-[#4a200c] focus:outline-none focus:ring-4 focus:ring-orange-500/25"></a>
                  </div>
                </div>
              </div>
            `;
            }
          )
          .join('');

        const indicators = document.getElementById('heroIndicators');
        if (!indicators) return;
        indicators.innerHTML = homepageHeroSlides
          .map(
            (_, index) => `
              <button type="button" data-hero-indicator="${index}" aria-label="Go to slide ${index + 1}" onclick="setHeroSlide(${index})" class="h-2.5 w-2.5 rounded-full bg-white/55 transition-all duration-300 hover:bg-white"></button>
            `
          )
          .join('');
      }

      function bindHeroScroll() {
        if (homepageHeroSlides.length <= 1) return;
        const scroller = document.getElementById('heroSlides');
        scroller.addEventListener(
          'scroll',
          () => {
            if (window.matchMedia('(min-width: 768px)').matches) return;
            clearTimeout(heroScrollTimer);
            heroScrollTimer = setTimeout(() => {
              const nextSlide = Math.round(scroller.scrollLeft / scroller.clientWidth);
              if (nextSlide !== currentSlide && nextSlide >= 0 && nextSlide < homepageHeroSlides.length) {
                currentSlide = nextSlide;
                updateHeroCarousel(false);
                restartHeroCarousel();
              }
            }, 80);
          },
          { passive: true }
        );
      }

      function renderHeroText() {
        document.querySelectorAll('[data-hero-slide]').forEach((slide) => {
          const index = Number(slide.getAttribute('data-hero-slide'));
          const copy = heroSlides[index].copy[language];
          const link = slide.querySelector('[data-hero-link]');
          const title = slide.querySelector('[data-hero-title]');
          slide.querySelector('[data-hero-kicker]').textContent = copy.kicker;
          title.textContent = '';
          const usesKoreanDisplay = /[가-힣]/.test(copy.title);
          slide.setAttribute('data-hero-layout', usesKoreanDisplay ? 'compact' : 'standard');
          title.classList.toggle('display-korean', usesKoreanDisplay);
          title.classList.toggle('display-latin', !usesKoreanDisplay);
          const titleLines = Array.isArray(copy.titleLines) && copy.titleLines.length ? copy.titleLines : [copy.title];
          titleLines.forEach((line) => {
            const titleLine = document.createElement('span');
            titleLine.className = 'hero-title-line';
            titleLine.textContent = line;
            title.appendChild(titleLine);
          });
          if (copy.titleLine2) {
            const titleLine2 = document.createElement('span');
            titleLine2.className = 'mt-3 block text-[0.42em] leading-[0.95] text-[#321506] md:mt-4';
            titleLine2.textContent = copy.titleLine2;
            title.appendChild(titleLine2);
          }
          slide.querySelector('[data-hero-subtitle]').textContent = copy.subtitle;
          link.textContent = copy.button;
          const target = heroSlides[index].href;
          // Localized pages use a root base URL, so retain the current route for section links.
          link.setAttribute('href', target.startsWith('#') ? `${window.location.pathname}${window.location.search}${target}` : target);
        });
      }

      function updateHeroCarousel(syncScroll = true) {
        const scroller = document.getElementById('heroSlides');
        const shouldSyncScroll =
          homepageHeroSlides.length > 1 &&
          syncScroll &&
          !window.matchMedia('(min-width: 768px)').matches &&
          scroller;
        const targetScrollLeft = shouldSyncScroll ? scroller.clientWidth * currentSlide : null;

        document.querySelectorAll('[data-hero-slide]').forEach((slide) => {
          const isActive = Number(slide.getAttribute('data-hero-slide')) === currentSlide;
          slide.className = `hero-slide relative h-full min-w-full snap-center opacity-100 transition-opacity duration-[1200ms] ease-in-out md:absolute md:inset-0 md:min-w-0 ${
            isActive ? 'is-active md:z-10 md:opacity-100' : 'md:z-0 md:opacity-0 md:pointer-events-none'
          }`;
        });
        document.querySelectorAll('[data-hero-indicator]').forEach((indicator) => {
          const isActive = Number(indicator.getAttribute('data-hero-indicator')) === currentSlide;
          indicator.setAttribute('aria-pressed', String(isActive));
          indicator.className = `h-2.5 rounded-full transition-all duration-300 ${
            isActive ? 'w-10 bg-mokdaOrange' : 'w-2.5 bg-white/55 hover:bg-white'
          }`;
        });

        if (targetScrollLeft !== null) {
          scroller.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        }
      }

      function setHeroSlide(index) {
        currentSlide = index;
        updateHeroCarousel();
        restartHeroCarousel();
      }

      function restartHeroCarousel() {
        if (heroInterval) clearInterval(heroInterval);
        if (homepageHeroSlides.length <= 1) return;
        heroInterval = setInterval(() => {
          currentSlide = (currentSlide + 1) % homepageHeroSlides.length;
          updateHeroCarousel();
        }, 5000);
      }

      function renderLanguageButtons() {
        window.MOKDA_I18N.syncLanguageButtons(language);
      }

      function renderProducts(items) {
        const lang = language;
        document.getElementById('productsGrid').innerHTML = items
          .filter((item) => item.featured !== false)
          .map(
            (item, index) => {
              const d = (item.desc && item.desc[lang]) ? item.desc[lang] : (item.desc ? item.desc['ES'] : { line1: '', line2: '' });
              const category = item.category ? (item.category[lang] || item.category['ES']) : item.koreanName;
              const name = typeof item.name === 'object' ? (item.name[lang] || item.name.ES) : item.name;
              return `
              <a href="/es/products.html#${['original', 'para-carnes'][index] || ''}" data-product="${name}" data-reveal data-reveal-delay="${index * 120}" class="product-photo-card group flex min-w-0 flex-col overflow-hidden rounded-[1.2rem] bg-white text-left transition-all duration-300">
                <div class="home-product-image relative overflow-hidden bg-[#f5d9b8]">
                  <img src="${item.foodImage || item.textureImage || item.image}" alt="" aria-hidden="true" class="product-food-image h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/6 to-transparent"></div>
                  <div class="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
                    <p class="condensed-label mb-2 break-keep text-base uppercase leading-tight tracking-[0.04em] text-white/85 sm:text-lg">${category}</p>
                    <h3 class="display-latin break-keep text-4xl uppercase leading-[0.88] text-white sm:text-5xl">${name}</h3>
                  </div>
                </div>
                <div class="home-product-copy px-5 py-6 sm:px-7 sm:py-7">
                  <p class="condensed-label mb-4 text-base uppercase tracking-[0.04em] text-mokdaOrange">Salsa Coreana line</p>
                  ${d.line1 ? `<span class="block break-keep text-sm font-medium leading-6 text-slate-700">${d.line1}</span>` : ''}
                  ${d.line2 ? `<span class="mt-1 block break-keep text-[15px] font-extrabold leading-6 text-gray-950 sm:text-base">${d.line2}</span>` : ''}
                </div>
              </a>
            `;
            }
          )
          .join('');
      }
      function renderStores() {
        document.getElementById('storeList').innerHTML = `
          <div class="flex h-full flex-col justify-center">
            ${stores
              .map((store) => {
                const isSelected = selectedStoreId === store.id;
                const storeName = partnerLabels.name[language] || partnerLabels.name.ES;
                const storeAddress = store.address[language] || store.address.ES;
                const cardClass = isSelected
                  ? 'block w-full cursor-pointer rounded-lg bg-[#f8dfc4] p-4 text-left transition-all duration-300'
                  : 'block w-full cursor-pointer rounded-lg p-4 text-left transition-all duration-300 hover:bg-white/10';
                const nameClass = isSelected ? 'text-[#321506]' : 'text-[#f8dfc4]';
                const addressClass = isSelected ? 'text-[#321506]/65' : 'text-[#f8dfc4]/65';
                const tagClass = 'rounded-full bg-mokdaOrange px-2.5 py-1 text-[10px] font-black uppercase text-white md:text-xs';
                return `
                  <div class="border-b border-[#f8dfc4]/14 py-2 first:pt-0 last:border-b-0 last:pb-0">
                    <button type="button" onclick="selectStore('${store.id}')" aria-pressed="${isSelected}" class="${cardClass}">
                      <span class="flex flex-wrap items-center gap-2 md:gap-3">
                        <span class="break-keep text-base font-bold ${nameClass} md:text-lg">${storeName}</span>
                        <span class="${tagClass}">${partnerLabels.tag}</span>
                      </span>
                      <span class="mt-1 block text-pretty text-xs font-semibold leading-4 ${addressClass} md:mt-1.5 md:text-sm md:leading-6">${storeAddress}</span>
                    </button>
                  </div>
                `;
              })
              .join('')}
          </div>
        `;
      }

      function selectStore(id) {
        selectedStoreId = id;
        renderStores();
        const store = stores.find((item) => item.id === id);
        const frame = document.getElementById('mapFrame');
        if (store?.mapUrl && frame) {
          frame.src = localizeMapUrl(store.mapUrl);
          frame.dataset.mapSrc = frame.src;
          const storeAddress = store.address[language] || store.address.ES;
          frame.title = `${storeAddress} map`;
        }
      }

      function renderTestimonials(testimonials = []) {
        const list = document.getElementById('voicesList');
        if (!list) return;

        const cards = testimonials.map(
          (item) => `
            <article aria-label="${item.name}" class="voice-entry py-9 sm:py-11 lg:flex lg:h-full lg:flex-col lg:rounded-[1.5rem] lg:border lg:border-[#321506]/10 lg:bg-white lg:p-8 lg:shadow-[0_12px_32px_rgba(50,21,6,0.06)]">
              <div class="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left lg:min-h-32">
                <img src="${item.image}" alt="${item.name}" class="h-28 w-28 shrink-0 rounded-full object-cover object-center ring-2 ring-white sm:h-32 sm:w-32 lg:h-28 lg:w-28" loading="lazy" decoding="async" />
                <div class="min-w-0">
                <div class="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 sm:flex-nowrap sm:justify-start">
                  <h3 class="break-keep text-xl font-black leading-7 text-[#321506] sm:text-2xl">${item.name}</h3>
                  <span aria-hidden="true" class="text-sm font-semibold text-[#321506]/35">|</span>
                  <p class="break-keep text-sm font-bold leading-6 text-[#321506]/78 sm:text-[15px]">${item.occupation}</p>
                </div>
                <p class="mt-1 break-keep text-xs font-semibold leading-5 text-[#321506]/55 sm:text-[13px]">${item.profile}</p>
                </div>
              </div>
              <div class="mt-6 min-w-0 lg:flex lg:flex-1">
                <blockquote class="relative rounded-[1rem] bg-[#fff8ef]/62 px-5 py-5 text-left text-[15px] font-semibold leading-7 text-[#321506]/88 sm:px-7 sm:py-6 sm:text-base sm:leading-8 lg:flex-1">
                  <span aria-hidden="true" class="absolute -left-1 -top-3 text-4xl font-black leading-none text-mokdaOrange">“</span>
                  ${item.quote}
                </blockquote>
              </div>
            </article>
          `,
        );

        list.innerHTML = cards.join('');
      }

      function renderPage() {
        const t = content[language];
        document.documentElement.lang = window.MOKDA_I18N.getHtmlLang(language);
        setText('mobile-about-link', t.nav.about);
        setText('mobile-products-link', t.nav.products);
        setText('mobile-qna-link', t.nav.qna);
        setText('mobile-contact-link', t.nav.contact);
        setText('socialTitle', t.socialTitle);
        setText('voicesKicker', t.community.kicker);
        setText('voicesTitle', t.community.title);
        renderTestimonials(t.community.testimonials);
        renderHomepageProof(t);
        setText('faqTitle', t.faq.title);
        setText('faqCta', t.faq.cta);
        t.faq.items.forEach((item, index) => {
          setText(`faqQuestion${index + 1}`, item[0]);
          setText(`faqAnswer${index + 1}`, item[1]);
        });
        renderHeroText();
        const storyBody = document.getElementById('storyBody');
        if (storyBody) storyBody.innerHTML = t.story.body.map((paragraph) => `<p class="break-keep leading-relaxed">${paragraph}</p>`).join('');
        setText('manufacturingCaption', t.story.manufacturing);
        setText('ingredientCaption', t.story.ingredient);
        setText('productsKicker', t.products.kicker);
        setText('productsTitle', t.products.title);
        setText('productsPageCtaText', t.products.pageCta);
        setText('productLineKicker', t.products.lineKicker);
        setText('productLineTitle', t.products.lineTitle);
        setText('productLineDescription', t.products.lineDescription);
        renderProducts(t.products.items);
        renderHomepageContact(t);
        setText('b2bKicker', t.b2b.kicker);
        setText('b2bTitle', t.b2b.title);
        setText('b2bDescription', t.b2b.description);
        setText('b2bCtaText', t.b2b.cta);
        ['proofTitle', 'faqTitle', 'productLineTitle', 'b2bTitle', 'voicesTitle'].forEach((id) => {
          const heading = document.getElementById(id);
          if (!heading) return;
          const usesKoreanDisplay = /[가-힣]/.test(heading.textContent);
          heading.classList.toggle('display-korean', usesKoreanDisplay);
          heading.classList.toggle('display-latin', !usesKoreanDisplay);
        });
        window.MOKDA_FOOTER.render(language);
        renderLanguageButtons();
        bindReveal();
      }

      window.MOKDA_I18N.bindLanguageButtons((nextLanguage) => {
        language = nextLanguage;
        renderPage();
      });

      window.addEventListener('pagehide', () => {
        if (heroInterval) clearInterval(heroInterval);
      });

      createHeroCarousel();
      bindHeroScroll();
      renderPage();
      updateHeroCarousel();
      restartHeroCarousel();

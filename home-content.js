/* Editorial content for the three localized homepages. */
(() => {
  const hero = {
    "EN": {
      "kicker": "MOKDA · KOREAN FOOD BRAND",
      "titleLines": [
        "Korea,",
        "closer",
        "to you"
      ],
      "subtitle": "Bring Korean flavors to the food you love.",
      "button": "Explore our sauces"
    },
    "ES": {
      "kicker": "MOKDA · KOREAN FOOD BRAND",
      "titleLines": [
        "Corea,",
        "más cerca",
        "de ti"
      ],
      "subtitle": "Dale un toque coreano a tus comidas de todos los días.",
      "button": "Conoce nuestras salsas"
    },
    "KR": {
      "kicker": "MOKDA · KOREAN FOOD BRAND",
      "titleLines": [
        "한국을",
        "더 가까이"
      ],
      "subtitle": "평소 즐기는 음식에 한국의 맛을 더합니다.",
      "button": "소스 라인업 보기"
    }
  };
  const products = [
    {
      "name": "K-PEÑO",
      "href": "kpeno.html",
      "image": "/assets/images/kpeno-food-product-centered-20260922.webp",
      "category": "SALSA GOCHUJANG",
      "copy": {
        "ES": {
          "description": "Una salsa de fusión coreana con el picante dulce del gochujang y el toque fresco del jalapeño.",
          "uses": "Nachos · Tacos · Empanadas · Pollo · Pizza · Carne"
        },
        "EN": {
          "description": "A Korean fusion sauce with sweet, spicy gochujang and a fresh jalapeño kick.",
          "uses": "Nachos · Tacos · Empanadas · Chicken · Pizza · Meat"
        },
        "KR": {
          "description": "고추장의 매콤달콤함과 할라피뇨의 산뜻함이 어우러진 K-퓨전 소스",
          "uses": "나초 · 타코 · 엠파나다 · 치킨 · 피자 · 고기"
        }
      }
    },
    {
      "name": "Para Carnes",
      "href": "para-carnes.html",
      "image": "/assets/images/para-carnes-food-product-centered-20260922.webp",
      "category": "SALSA SSAMJANG",
      "copy": {
        "ES": {
          "description": "Una salsa coreana a base de ssamjang, con un intenso sabor umami para disfrutar con carne.",
          "uses": "Carne asada · Carne al vapor · Carne cocida · Vegetales"
        },
        "EN": {
          "description": "A Korean dipping sauce with the rich, savory flavor of ssamjang, made for meat.",
          "uses": "Grilled meat · Steamed meat · Boiled meat · Vegetables"
        },
        "KR": {
          "description": "쌈장의 깊고 진한 감칠맛을 살린, 고기에 찍어 먹는 한국식 소스",
          "uses": "구운 고기 · 찐 고기 · 삶은 고기 · 채소"
        }
      }
    }
  ];
  const copy = {
    "EN": {
      "nav": {
        "about": "About us",
        "products": "Salsa Coreana",
        "qna": "Q&A",
        "contact": "Contact"
      },
      "socialTitle": "SOCIAL",
      "voices": {
        "kicker": "VOICES",
        "title": "What people who know MOKDA say",
        "testimonials": [
          {
            "name": "Jinsoo Park",
            "occupation": "CEO, Open Sauce Lab",
            "profile": "Developer of 1,000+ food and restaurant products",
            "image": "assets/images/testimonial-park-jinsoo-v1.webp",
            "quote": "MOKDA has strong potential to reinterpret Korean flavors for local food cultures and expand into global markets. I saw that potential firsthand while co-developing two sauces for Latin America. With its drive to meet consumers directly and validate the products in the market, I look forward to seeing MOKDA’s K-Food grow beyond Latin America and reach the world."
          },
          {
            "name": "Juhyeong Noh",
            "occupation": "Dietitian",
            "profile": "Affiliated with a food and foodservice specialist company",
            "image": "assets/images/testimonial-no-juhyeong-160.webp",
            "quote": "I was impressed by the product design: plant-based cream replaces dairy cream, and allulose is used instead of sugar to reduce the sugar content. The flavor is highly refined, balancing the sweet-and-spicy profile favored by Korean consumers today with deep umami. It is a versatile Korean sauce that considers both nutrition and taste."
          }
        ]
      },
      "history": {
        "kicker": "BRAND HISTORY",
        "title": "Korean flavors,\nfor everyday tables",
        "body": "We choose ingredients and fine-tune each recipe to suit the food people enjoy in Latin America.",
        "historyCta": "Explore our story →",
        "milestones": [
          "An idea born in Latin America",
          "Sauce development",
          "Entering the Latin American market"
        ]
      },
      "products": {
        "kicker": "LINEUP",
        "title": "SALSA COREANA",
        "description": "Salsa Coreana is MOKDA’s first product line, bringing Korean flavors to familiar Latin American dishes."
      },
      "faq": {
        "title": "Frequently Asked Questions",
        "cta": "See all FAQs",
        "items": [
          [
            "What does MOKDA mean?",
            "MOKDA comes from the Korean word “먹다,” meaning “to eat.” We make Korean sauces for the food people enjoy in Latin America."
          ],
          [
            "What is Salsa Coreana?",
            "It is MOKDA’s first product line: K-PEÑO and Para Carnes, two Korean sauces made for your favorite meals."
          ],
          [
            "How can I get in touch?",
            "Open the MOKDA guide to get answers or prepare a WhatsApp inquiry."
          ]
        ]
      },
      "b2b": {
        "kicker": "CONTACT MOKDA",
        "title": "Business partnerships",
        "description": "Get in touch about distribution, importing, retail, HORECA or a brand collaboration.",
        "cta": "Start a business inquiry"
      }
    },
    "ES": {
      "nav": {
        "about": "Sobre nosotros",
        "products": "Salsa Coreana",
        "qna": "Q&A",
        "contact": "Contacto"
      },
      "socialTitle": "REDES SOCIALES",
      "voices": {
        "kicker": "VOCES",
        "title": "Lo que dicen quienes conocen MOKDA",
        "testimonials": [
          {
            "name": "Jinsoo Park",
            "occupation": "CEO de Open Sauce Lab",
            "profile": "Más de 1.000 desarrollos en alimentación y restauración",
            "image": "assets/images/testimonial-park-jinsoo-v1.webp",
            "quote": "MOKDA tiene un gran potencial para reinterpretar los sabores de Corea de acuerdo con la cultura gastronómica local y llevarlos al mercado global. Lo confirmé al desarrollar junto a la marca dos salsas para Latinoamérica. Gracias a su capacidad de encontrarse directamente con los consumidores y validar sus salsas en el mercado, espero que el K-Food de MOKDA crezca más allá de Latinoamérica y llegue al mundo."
          },
          {
            "name": "Juhyeong Noh",
            "occupation": "Nutricionista",
            "profile": "Profesional de una empresa especializada en alimentación y servicios de alimentos",
            "image": "assets/images/testimonial-no-juhyeong-160.webp",
            "quote": "Me pareció especialmente acertada la formulación de esta salsa: utiliza crema vegetal en lugar de crema de origen animal y alulosa en lugar de azúcar para reducir el contenido de azúcares. El sabor está muy logrado, con un equilibrio entre el perfil picante y dulce que prefieren hoy los consumidores coreanos y un umami profundo. Es una salsa coreana versátil que cuida tanto la nutrición como el sabor."
          }
        ]
      },
      "history": {
        "kicker": "NUESTRA HISTORIA",
        "title": "Sabores de Corea,\npara tu mesa",
        "body": "Elegimos los ingredientes y ajustamos cada receta para acompañar las comidas habituales de Latinoamérica.",
        "historyCta": "Conoce nuestra historia →",
        "milestones": [
          "Una idea nacida en Latinoamérica",
          "Desarrollo de salsas",
          "Entrada al mercado latinoamericano"
        ]
      },
      "products": {
        "kicker": "LINEUP",
        "title": "SALSA COREANA",
        "description": "Salsa Coreana es la primera línea de MOKDA, creada para dar un toque coreano a los platos de siempre en Latinoamérica."
      },
      "faq": {
        "title": "Preguntas frecuentes",
        "cta": "Ver todas las preguntas",
        "items": [
          [
            "¿Qué significa MOKDA?",
            "MOKDA viene de la palabra coreana “먹다”, que significa comer. Elaboramos salsas coreanas para las comidas que se disfrutan en Latinoamérica."
          ],
          [
            "¿Qué es Salsa Coreana?",
            "Es la primera línea de MOKDA: K-PEÑO y Para Carnes, dos salsas coreanas para acompañar tus comidas favoritas."
          ],
          [
            "¿Cómo puedo comunicarme con ustedes?",
            "Abre la guía de MOKDA para resolver dudas o preparar una consulta por WhatsApp."
          ]
        ]
      },
      "b2b": {
        "kicker": "CONTACTA CON MOKDA",
        "title": "Alianzas comerciales",
        "description": "Escríbenos si te interesa distribuir, importar o vender nuestras salsas, usarlas en tu negocio del sector HORECA o colaborar con la marca.",
        "cta": "Iniciar consulta comercial"
      }
    },
    "KR": {
      "nav": {
        "about": "브랜드 소개",
        "products": "Salsa Coreana",
        "qna": "Q&A",
        "contact": "문의"
      },
      "socialTitle": "MOKDA SNS",
      "voices": {
        "kicker": "VOICES",
        "title": "MOKDA를 경험한 사람들의 이야기",
        "testimonials": [
          {
            "name": "박진수",
            "occupation": "오픈소스랩 대표",
            "profile": "식품·외식 제품 1,000개 이상 개발",
            "image": "assets/images/testimonial-park-jinsoo-v1.webp",
            "quote": "먹다는 한국의 맛을 현지 식문화에 맞게 재해석해 글로벌 시장으로 확장할 가능성이 큰 브랜드입니다. 남미 진출을 위한 소스 2종을 함께 개발하며 그 가능성을 확인했습니다. 현지 소비자와 직접 만나고 검증해 나가는 실행력을 바탕으로, 먹다만의 K-Food가 남미를 넘어 세계시장으로 성장하기를 기대합니다."
          },
          {
            "name": "노주형",
            "occupation": "영양사",
            "profile": "식품·푸드서비스 전문기업 소속",
            "image": "assets/images/testimonial-no-juhyeong-160.webp",
            "quote": "동물성 크림 대신 식물성 크림을 사용하고, 설탕 대신 알룰로스를 적용해 당류를 낮춘 제품 설계가 인상적이었습니다. 맛의 완성도는 굉장히 높았으며, 최근 한국 소비자들이 선호하는 매콤달콤한 풍미와 깊은 감칠맛을 균형 있게 담아냈습니다. 영양과 맛을 함께 고민한, 활용도 높은 한국식 소스라고 생각합니다."
          }
        ]
      },
      "history": {
        "kicker": "BRAND HISTORY",
        "title": "한국의 맛을,\n일상의 식탁으로",
        "body": "중남미의 익숙한 음식에 어울리도록 재료를 고르고 소스의 맛을 다듬습니다.",
        "historyCta": "브랜드 히스토리 보기 →",
        "milestones": [
          "중남미에서 시작된 아이디어",
          "소스 개발과 생산 준비",
          "중남미 시장 본격 진출"
        ]
      },
      "products": {
        "kicker": "LINEUP",
        "title": "SALSA COREANA",
        "description": "Salsa Coreana는 MOKDA의 첫 번째 제품 라인으로, 익숙한 중남미의 음식에 한국의 맛을 더 가깝게 전합니다."
      },
      "faq": {
        "title": "자주 묻는 질문",
        "cta": "자주 묻는 질문 전체 보기",
        "items": [
          [
            "MOKDA는 무슨 뜻인가요?",
            "MOKDA는 “먹다”라는 한국어에서 시작된 이름입니다. 중남미에서 즐겨 먹는 음식에 어울리는 한국 소스를 만듭니다."
          ],
          [
            "Salsa Coreana는 무엇인가요?",
            "K-PEÑO와 Para Carnes로 구성된 MOKDA의 첫 번째 제품 라인입니다."
          ],
          [
            "문의는 어떻게 할 수 있나요?",
            "먹랑이 상담에서 궁금한 점을 확인하거나 왓츠앱 문의를 준비할 수 있습니다."
          ]
        ]
      },
      "b2b": {
        "kicker": "CONTACT MOKDA",
        "title": "비즈니스 파트너십",
        "description": "유통, 수입, 리테일, HORECA 및 브랜드 협업을 제안해 주세요.",
        "cta": "유통·수입 상담"
      }
    }
  };

  window.MOKDA_HOME_CONTENT = { hero, products, copy };
})();

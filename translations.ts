export type Locale = 'ko' | 'en' | 'es';

export interface ProductTranslation {
  category: string;
  title: string;
  descLine1: string;
  descLine2: string;
}

export interface Translations {
  nav: {
    about: string;
    products: string;
  };
  hero: {
    title: string;
  };
  products: {
    kicker: string;
    title: string;
    items: {
      original: ProductTranslation;
      ssamjang: ProductTranslation;
      soySauce: ProductTranslation;
    };
  };
  ourStory: {
    kicker: string;
    title: string;
    paragraphs: string[];
  };
  brandStory: {
    kicker: string;
    title: string;
    paragraphs: string[];
  };
  brandLogo: {
    kicker: string;
    title: string;
  };
  partnership: {
    title: string;
    body: string;
    button: string;
  };
}

export const translations: Record<Locale, Translations> = {
  ko: {
    nav: {
      about: 'About Us',
      products: 'Products',
    },
    hero: {
      title: 'Comer Corea<br />한국을 먹다',
    },
    products: {
      kicker: 'LINE UP',
      title: 'KOREA FLAVORS',
      items: {
        original: {
          category: 'Gochujang',
          title: 'Original',
          descLine1: '할라페뇨의 산뜻함을 더한,',
          descLine2: '깔끔하게 올라오는 한국식 매콤함',
        },
        ssamjang: {
          category: 'Ssamjang',
          title: 'Para Carne',
          descLine1: '고기와 그릴 요리에 맞춘,',
          descLine2: '깊고 진한 감칠맛의 바비큐 소스',
        },
        soySauce: {
          category: 'Ganjang',
          title: 'Soy Sauce',
          descLine1: '달콤함과 짭짤함이 균형 잡힌,',
          descLine2: '매일 쓰기 좋은 퓨전 데일리 소스',
        },
      },
    },
    ourStory: {
      kicker: 'OUR STORY',
      title: '소스가 아닌 문화를<br />만듭니다',
      paragraphs: [
        'MOKDA는 한국을 더 쉽고 가깝게 경험하게 하는 브랜드입니다.<br />한국의 맛은 낯설고 특별한 음식 안에만 머물 필요가 없습니다.',
        '타코, 그릴, 밥, 스낵처럼 익숙한 음식과 만날 때<br />한국은 더 자연스럽고 일상적인 문화가 됩니다.',
        'MOKDA는 한 병의 소스에<br />한국 로컬의 재료와 지금의 감각을 담아<br />남미의 식탁 위에 새로운 한국의 경험을 제안합니다.',
        '우리는 단순히 소스를 만드는 것이 아니라,<br />한국을 즐기는 새로운 방식을 만듭니다.',
      ],
    },
    brandStory: {
      kicker: 'Brand Story',
      title: '남미로 떠난 한국인 청년',
      paragraphs: [
        '2024년 봄, 가방 하나메고 남미로 간 청년의 이야기입니다.',
        '남미에 특별한 연고가 있었던 건 아니었습니다. 오래전 다큐멘터리에서 본 지구 반대편의 남미가 계속 마음에 남았고, 한국에서도 타코, 엠빠나다, 살사 같은 남미 음식을 자주 찾아 먹을 만큼 그 문화가 좋았습니다.',
        '그곳에서 살아가며 많은 친구들을 만났습니다. 말도 잘 통하지 않고, 살아온 환경도 달랐지만 이상하게도 음식 앞에서는 금방 가까워졌습니다.',
        '친구들과 집에 모여 서로의 나라 음식을 만들어 먹던 날, 저는 처음으로 분명하게 느꼈습니다. 음식은 단순히 맛을 즐기는 것이 아니라, 한 나라의 문화와 사람을 이해하는 가장 쉬운 방법이라는 것을요.',
        '제가 남미를 좋아하게 된 것도 음식에서 시작됐습니다. 그리고 이제는 제가 한국을 좋아하는 남미의 친구들에게 오늘날의 한국을 전하고 싶었습니다. 그 마음에서 MOKDA가 시작되었습니다.',
        '한국 로컬의 신선한 재료, 한국 청년이 직접 느낀 진심, 그리고 지금의 한국적인 감각을 담아 남미의 식탁 위에 전하고자 합니다.',
        'MOKDA는 소스 한 병으로 한국과 남미가 조금 더 가까워지는 순간을 만들고 싶습니다.',
      ],
    },
    brandLogo: {
      kicker: 'Brand Logo',
      title: '한국의 헤리티지와 라틴의 열정을 담은 디자인',
    },
    partnership: {
      title: '남미 식탁에<br />K-Sauce를 올릴 시간',
      body: '유통, 리테일, 콜라보, 인플루언서 협업까지<br className="hidden md:block" />MOKDA는 라틴 아메리카 시장에 맞춘 파트너십을 준비합니다',
      button: 'START PARTNERSHIP',
    },
  },
  en: {
    nav: {
      about: 'About Us',
      products: 'Products',
    },
    hero: {
      title: 'Comer Corea<br />한국을 먹다',
    },
    products: {
      kicker: 'LINE UP',
      title: 'KOREA FLAVORS',
      items: {
        original: {
          category: 'Gochujang',
          title: 'Original',
          descLine1: 'With a fresh hint of jalapeño,',
          descLine2: 'Clean and authentic Korean heat',
        },
        ssamjang: {
          category: 'Ssamjang',
          title: 'Para Carne',
          descLine1: 'Crafted for meat and grilling,',
          descLine2: 'Rich and savory BBQ sauce',
        },
        soySauce: {
          category: 'Ganjang',
          title: 'Soy Sauce',
          descLine1: 'A perfect balance of sweet and salty,',
          descLine2: 'Your everyday fusion daily sauce',
        },
      },
    },
    ourStory: {
      kicker: 'OUR STORY',
      title: 'We Craft Culture,<br />Not Just Sauce',
      paragraphs: [
        "MOKDA brings Korea closer, making it effortless to experience.<br />The taste of Korea doesn't have to be limited to unfamiliar, exotic dishes.",
        'When paired with your everyday favorites like tacos, grilled meats, rice, and snacks,<br />Korea becomes a natural part of your daily life.',
        'In every bottle of MOKDA, we blend local Korean ingredients with a modern touch,<br />bringing a fresh Korean experience to Latin American tables.',
        'We are not just making sauces;<br />we are creating a new way to enjoy Korea.',
      ],
    },
    brandStory: {
      kicker: 'Brand Story',
      title: 'A Korean Journey to Latin America',
      paragraphs: [
        'It all started in the spring of 2024, with a young man heading to Latin America with just a backpack.',
        "He didn't have any special connections there. But the vibrant Latin culture he saw in documentaries had always stayed with him, and back in Korea, he was already in love with tacos, empanadas, and salsa.",
        'Living there, he met many friends. Despite the language barriers and different backgrounds, they quickly bonded over food.',
        "Gathering at home, sharing dishes from their respective countries, he realized something profound: food isn't just about taste. It's the easiest way to understand a country's culture and its people.",
        "His love for Latin America started with food. Now, he wanted to share today's Korea with his Latin American friends who love Korean culture. That's how MOKDA was born.",
        'With fresh local Korean ingredients, the heartfelt passion of a Korean youth, and a modern sense of Korea, we want to deliver this directly to your table.',
        'Through a single bottle of sauce, MOKDA hopes to bring Korea and Latin America a little bit closer.',
      ],
    },
    brandLogo: {
      kicker: 'Brand Logo',
      title: 'A design capturing Korean heritage and Latin passion',
    },
    partnership: {
      title: 'Time to Bring K-Sauce<br />to Latin Tables',
      body: 'From distribution and retail to collabs and influencer partnerships,<br className="hidden md:block" />MOKDA is ready for the Latin American market',
      button: 'START PARTNERSHIP',
    },
  },
  es: {
    nav: {
      about: 'Sobre Nosotros',
      products: 'Productos',
    },
    hero: {
      title: 'Comer Corea<br />한국을 먹다',
    },
    products: {
      kicker: 'LINE UP',
      title: 'SABORES DE COREA',
      items: {
        original: {
          category: 'Gochujang',
          title: 'Original',
          descLine1: 'Con un toque fresco de jalapeño,',
          descLine2: 'El auténtico y limpio picante coreano',
        },
        ssamjang: {
          category: 'Ssamjang',
          title: 'Para Carne',
          descLine1: 'Hecho para carnes y asados,',
          descLine2: 'Salsa BBQ con un toque profundo y sabroso',
        },
        soySauce: {
          category: 'Ganjang',
          title: 'Soy Sauce',
          descLine1: 'Equilibrio perfecto entre dulce y salado,',
          descLine2: 'Tu salsa fusión ideal para todos los días',
        },
      },
    },
    ourStory: {
      kicker: 'OUR STORY',
      title: 'Creamos Cultura,<br />No Solo Salsas',
      paragraphs: [
        'MOKDA te acerca a Corea para que la vivas de forma sencilla.<br />El sabor coreano no tiene por qué quedarse solo en platos lejanos o desconocidos.',
        'Cuando se mezcla con tus comidas favoritas como tacos, asados, arroz o snacks,<br />Corea se convierte en algo natural en tu día a día.',
        'En cada botella de MOKDA, capturamos ingredientes locales de Corea y un toque moderno,<br />llevando una nueva experiencia coreana directo a las mesas latinas.',
        'No solo hacemos salsas;<br />creamos una forma totalmente nueva de disfrutar Corea.',
      ],
    },
    brandStory: {
      kicker: 'Brand Story',
      title: 'Un Viaje Coreano hacia Latinoamérica',
      paragraphs: [
        'Todo comenzó en la primavera de 2024, con un joven viajando a Sudamérica con solo una mochila.',
        'No tenía conexiones especiales allí. Pero la vibrante cultura que vio en documentales siempre se quedó con él, y en Corea, ya era un fanático de los tacos, empanadas y la salsa.',
        'Viviendo allí, conoció a muchos amigos. A pesar del idioma y de venir de mundos distintos, la comida los unió de inmediato.',
        'Un día, cocinando y compartiendo platos de sus países en casa, lo entendió: la comida no es solo sabor. Es la forma más fácil de entender la cultura y a la gente de un país.',
        'Su amor por Latinoamérica empezó con la comida. Y ahora, quería compartir la Corea de hoy con sus amigos latinos. De ese sentimiento nació MOKDA.',
        'Con ingredientes frescos de Corea, la pasión genuina de un joven coreano y un toque moderno, queremos llevar esta experiencia directo a tu mesa.',
        'A través de una simple botella de salsa, MOKDA espera acercar un poco más a Corea y Latinoamérica.',
      ],
    },
    brandLogo: {
      kicker: 'Brand Logo',
      title: 'Un diseño que une la herencia coreana y la pasión latina',
    },
    partnership: {
      title: 'Es Hora de Llevar K-Sauce<br />a las Mesas Latinas',
      body: 'Desde distribución y retail hasta colaboraciones e influencers,<br className="hidden md:block" />MOKDA está lista para crecer en el mercado latinoamericano',
      button: 'COMENZAR ASOCIACIÓN',
    },
  },
};

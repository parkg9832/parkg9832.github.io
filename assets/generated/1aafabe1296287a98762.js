let language = window.MOKDA_I18N.getLanguage();

      const content = {
        ES: {
          nav: { about: 'Sobre nosotros', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contacto' },
          socialTitle: 'REDES SOCIALES',
          title: "Salsa Coreana | Salsas MOKDA",
          kicker: "La primera línea de MOKDA",
          headline: "SALSA COREANA",
          subtitle: "Salsa Coreana es la primera línea de salsas de MOKDA, creada para disfrutar con los platos de todos los días en Latinoamérica.",
          slogan: "NO PUEDES PARAR DE DIPEAR.",
          p1: {
            kicker: "Gochujang",
            name: "K-PEÑO",
            desc: "El picante del gochujang con el toque fresco del jalapeño.",
            uses: "Para tacos, nachos, frituras, pollo y tus platos favoritos."
          },
          p2: {
            kicker: "Ssamjang",
            name: "Para Carnes",
            desc: "Una salsa coreana de sabor intenso y mucho umami para todo tipo de carnes y verduras.",
            uses: "Disfrútala con tus carnes y verduras favoritas, donde quieras."
          },
          actions: { detail: 'Ver detalle', b2b: 'Consulta B2B' }
        },
        EN: {
          nav: { about: 'About us', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contact' },
          socialTitle: 'SOCIAL',
          title: "Salsa Coreana | MOKDA Sauces",
          kicker: "MOKDA'S FIRST SAUCE LINE",
          headline: "SALSA COREANA",
          subtitle: "Salsa Coreana is MOKDA's first sauce line, made to go with everyday meals across Latin America.",
          slogan: "YOU CAN’T STOP DIPPING.",
          p1: {
            kicker: "Gochujang",
            name: "K-PEÑO",
            desc: "Spicy gochujang with the fresh tang of jalapeño.",
            uses: "For tacos, nachos, fried food, chicken and all your favorites."
          },
          p2: {
            kicker: "Ssamjang",
            name: "Para Carnes",
            desc: "A rich, savory Korean sauce for all kinds of meat and vegetables.",
            uses: "Enjoy it with your favorite meat and vegetables, wherever you are."
          },
          actions: { detail: 'View details', b2b: 'B2B inquiry' }
        },
        KR: {
          nav: { about: '브랜드 소개', products: 'Salsa Coreana', qna: 'Q&A', contact: '문의' },
          socialTitle: 'MOKDA SNS',
          title: "Salsa Coreana | MOKDA 한국 소스 라인업",
          kicker: "MOKDA의 첫 번째 소스 라인",
          headline: "SALSA COREANA",
          subtitle: "MOKDA의 첫 번째 소스 라인으로, 라틴아메리카의 일상 음식에 쉽고 자연스럽게 어울리도록 만든 한국 소스입니다.",
          slogan: "멈출 수 없는 맛",
          p1: {
            kicker: "Gochujang",
            name: "K-PEÑO",
            desc: "고추장의 매콤함과 할라피뇨의 상큼함이 만난 소스",
            uses: "타코, 나초, 튀김, 치킨 등 내가 좋아하는 모든 음식에"
          },
          p2: {
            kicker: "Ssamjang",
            name: "Para Carnes",
            desc: "모든 고기 종류와 채소에 어울리는 깊은 감칠맛의 한국 소스",
            uses: "언제 어디서든 내가 좋아하는 고기와 채소에 편하고 맛있게"
          },
          actions: { detail: '제품 상세 보기', b2b: 'B2B 문의' }
        }
      };

      function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      }

      function renderLanguageButtons() {
        window.MOKDA_I18N.syncLanguageButtons(language);
      }

      function renderPage() {
        if (document.body.dataset.contentLanguage === language) {
          renderLanguageButtons();
          return;
        }
        const t = content[language];
        document.title = t.title;
        document.documentElement.lang = window.MOKDA_I18N.getHtmlLang(language);
        setText('mobile-about-link', t.nav.about);
        setText('mobile-products-link', t.nav.products);
        setText('mobile-qna-link', t.nav.qna);
        setText('mobile-contact-link', t.nav.contact);
        setText('socialTitle', t.socialTitle);

        setText('pageKicker', t.kicker);
        setText('pageTitle', t.headline);
        setText('pageSubtitle', t.subtitle);
        setText('pageSlogan', t.slogan);
        const pageSlogan = document.getElementById('pageSlogan');
        pageSlogan.classList.toggle('display-latin', language !== 'KR');
        pageSlogan.classList.toggle('display-korean', language === 'KR');

        setText('prod1Kicker', t.p1.kicker);
        setText('prod1Title', t.p1.name);
        setText('prod1Desc', t.p1.desc);
        setText('prod1Uses', t.p1.uses);
        setText('prod1DetailLink', t.actions.detail);
        setText('prod1B2bLink', t.actions.b2b);

        setText('prod2Kicker', t.p2.kicker);
        setText('prod2Title', t.p2.name);
        setText('prod2Desc', t.p2.desc);
        setText('prod2Uses', t.p2.uses);
        setText('prod2DetailLink', t.actions.detail);
        setText('prod2B2bLink', t.actions.b2b);


        window.MOKDA_FOOTER.render(language);

        renderLanguageButtons();
      }

      window.MOKDA_I18N.bindLanguageButtons((nextLanguage) => {
        language = nextLanguage;
        renderPage();
      });

      renderPage();

      document.addEventListener('DOMContentLoaded', () => {
        const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('opacity-0', 'translate-x-10', '-translate-x-10');
              entry.target.classList.add('opacity-100', 'translate-x-0');
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);

        document.querySelectorAll('.reveal-target').forEach(el => {
          observer.observe(el);
        });
      });

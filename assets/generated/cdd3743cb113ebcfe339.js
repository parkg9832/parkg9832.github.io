let language = window.MOKDA_I18N.getLanguage();

      const content = {
        ES: {
          nav: { about: 'Sobre nosotros', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contacto' },
          socialTitle: 'REDES SOCIALES',
          summary: 'K-PEÑO · PARA CARNES',
          title: "Salsa Coreana | Salsas MOKDA",
          kicker: "La primera línea de MOKDA",
          headline: "SALSA COREANA",
          subtitle: "La primera expresión de MOKDA: salsas coreanas creadas para acompañar de forma fácil y natural las comidas cotidianas de Latinoamérica.",
          slogan: "NO PUEDES PARAR DE DIPEAR.",
          p1: {
            kicker: "Gochujang",
            name: "K-PEÑO",
            desc: "Una salsa donde el picante del gochujang se encuentra con la frescura del jalapeño.",
            uses: "Ideal para tacos, pollo, frituras y snacks."
          },
          p2: {
            kicker: "Ssamjang",
            name: "Para Carnes",
            desc: "Una salsa coreana de profundo umami que combina con verduras y todo tipo de carnes, asadas, hervidas o al vapor.",
            uses: "Una salsa emblemática de Corea para dipear carnes."
          },
          actions: { b2b: 'Consulta B2B' }
        },
        EN: {
          nav: { about: 'About us', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contact' },
          socialTitle: 'SOCIAL',
          summary: 'K-PEÑO · PARA CARNES',
          title: "Salsa Coreana | MOKDA Sauces",
          kicker: "MOKDA'S FIRST SAUCE LINE",
          headline: "SALSA COREANA",
          subtitle: "MOKDA's first expression: Korean sauces created to fit easily and naturally into everyday meals across Latin America.",
          slogan: "NO PUEDES PARAR DE DIPEAR.",
          p1: {
            kicker: "Gochujang",
            name: "K-PEÑO",
            desc: "A sauce where the spicy kick of gochujang meets the freshness of jalapeño.",
            uses: "Made for tacos, chicken, fried food, and snacks."
          },
          p2: {
            kicker: "Ssamjang",
            name: "Para Carnes",
            desc: "A Korean sauce with deep umami for vegetables and all kinds of meat, whether grilled, boiled or steamed.",
            uses: "A signature Korean dipping sauce for meat."
          },
          actions: { b2b: 'B2B inquiry' }
        },
        KR: {
          nav: { about: '브랜드 소개', products: 'Salsa Coreana', qna: 'Q&A', contact: '문의' },
          socialTitle: 'MOKDA SNS',
          summary: 'K-PEÑO · PARA CARNES',
          title: "Salsa Coreana | MOKDA 한국 소스 라인업",
          kicker: "MOKDA의 첫 번째 소스 라인",
          headline: "SALSA COREANA",
          subtitle: "MOKDA의 첫 번째 표현으로, 라틴아메리카의 일상 음식에 쉽고 자연스럽게 어울리도록 만든 한국 소스입니다.",
          slogan: "NO PUEDES PARAR DE DIPEAR.",
          p1: {
            kicker: "Gochujang",
            name: "K-PEÑO",
            desc: "고추장의 매콤함과 할라피뇨의 상큼함이 만난 소스.",
            uses: "타코, 치킨, 튀김과 스낵에 어울립니다."
          },
          p2: {
            kicker: "Ssamjang",
            name: "Para Carnes",
            desc: "구운 고기, 삶은 고기, 찐 고기 등 모든 고기와 채소에 어울리는 깊은 감칠맛의 한국 소스.",
            uses: "한국의 대표 고기용 디핑소스입니다."
          },
          actions: { b2b: 'B2B 문의' }
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
        setText('productSummary', t.summary);

        setText('prod1Kicker', t.p1.kicker);
        setText('prod1Title', t.p1.name);
        setText('prod1Desc', t.p1.desc);
        setText('prod1Uses', t.p1.uses);
        setText('prod1B2bLink', t.actions.b2b);

        setText('prod2Kicker', t.p2.kicker);
        setText('prod2Title', t.p2.name);
        setText('prod2Desc', t.p2.desc);
        setText('prod2Uses', t.p2.uses);
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

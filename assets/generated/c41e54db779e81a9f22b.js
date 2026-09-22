let language = window.MOKDA_I18N.getLanguage();

      const qnaItems = [
        {
          ES: {
            question: '¿Qué es MOKDA y qué es Salsa Coreana?',
            answer: 'MOKDA es la marca K-Food que conecta sabores de Corea con las mesas cotidianas de Latinoamérica. Salsa Coreana es la primera línea de MOKDA, creada para disfrutar los sabores de Corea con platos cotidianos.',
          },
          EN: {
            question: 'What are MOKDA and Salsa Coreana?',
            answer: 'MOKDA is the K-Food brand connecting Korean flavors with everyday tables across Latin America. Salsa Coreana is MOKDA’s first product line, created to make Korean flavors easy to enjoy with everyday food.',
          },
          KR: {
            question: 'MOKDA와 Salsa Coreana는 무엇인가요?',
            answer: 'MOKDA는 한국의 맛을 라틴아메리카의 일상 식탁과 연결하는 K-Food 브랜드입니다. Salsa Coreana는 익숙한 음식에 한국 소스를 쉽게 더할 수 있도록 만든 MOKDA의 첫 번째 제품 라인입니다.',
          },
        },
        {
          ES: {
            question: '¿Qué salsas incluye Salsa Coreana?',
            answer: 'K-PEÑO combina una base de gochujang con un toque fresco de jalapeño. Para Carnes parte del ssamjang y está pensada para acompañar carnes asadas.',
          },
          EN: {
            question: 'Which products are in the Salsa Coreana line?',
            answer: 'K-PEÑO blends a gochujang base with a fresh jalapeño lift. Para Carnes is ssamjang-based and designed for grilled meats.',
          },
          KR: {
            question: 'Salsa Coreana에는 어떤 제품이 있나요?',
            answer: 'K-PEÑO는 고추장에 할라피뇨의 산뜻함을 더한 소스입니다. Para Carnes는 쌈장 기반의 고기용 소스입니다.',
          },
        },
        {
          ES: {
            question: '¿Con qué comidas se pueden usar las salsas?',
            answer: 'K-PEÑO va bien con nachos, pollo frito, papas y snacks. Para Carnes acompaña pollo a la brasa, res, cerdo, BBQ y carne asada.',
          },
          EN: {
            question: 'What foods can the sauces be used with?',
            answer: 'K-PEÑO pairs with nachos, fried chicken, chips, and snacks. Para Carnes works with roasted chicken, beef, pork, BBQ, and grilled meats.',
          },
          KR: {
            question: '어떤 음식에 활용할 수 있나요?',
            answer: 'K-PEÑO는 나초, 프라이드치킨, 감자칩과 스낵에 잘 어울립니다. Para Carnes는 구운 닭고기, 소고기, 돼지고기와 BBQ에 활용할 수 있습니다.',
          },
        },
        {
          ES: {
            question: '¿Dónde puedo consultar disponibilidad, ingredientes y alérgenos?',
            answer: 'La disponibilidad puede variar según el mercado. Cuando las salsas estén disponibles, la información oficial de ingredientes, alérgenos, conservación y uso estará disponible en esta web, en la información de cada salsa y en su envase. Para una consulta específica, utiliza la página de contacto.',
          },
          EN: {
            question: 'Where can I check availability, ingredients, and allergens?',
            answer: 'Availability may vary by market. When the products go on sale, official ingredient, allergen, storage, and usage information will be published on this website, on each product page, and on the packaging. Use the contact page for market-specific questions.',
          },
          KR: {
            question: '판매 여부, 원재료와 알레르겐 정보는 어디서 확인하나요?',
            answer: '판매 여부는 시장별로 달라질 수 있습니다. 판매 전 원재료, 알레르겐, 보관 및 사용 정보는 홈페이지와 제품 상세 페이지, 패키지에 공식적으로 안내할 예정입니다. 시장별 문의는 문의 페이지를 이용해주세요.',
          },
        },
        {
          ES: {
            question: '¿MOKDA trabaja con distribuidores, retail y HORECA?',
            answer: 'Sí. MOKDA recibe propuestas de distribución, retail, restaurantes, HORECA y colaboración de marca para Latinoamérica. La misma página de contacto también está abierta a preguntas generales de consumidores.',
          },
          EN: {
            question: 'Does MOKDA work with distributors, retail, and HORECA?',
            answer: 'Yes. MOKDA welcomes distribution, retail, restaurant, HORECA, and brand collaboration proposals for Latin America. The same contact page is also open for general consumer questions.',
          },
          KR: {
            question: '유통, 리테일과 HORECA 협업이 가능한가요?',
            answer: '가능합니다. 라틴아메리카 유통, 리테일, 레스토랑, HORECA 및 브랜드 협업 제안을 받고 있습니다. 같은 문의 페이지에서 일반 소비자 질문도 접수합니다.',
          },
        },
      ];

      const content = {
        ES: {
          title: 'Preguntas frecuentes | MOKDA',
          nav: { about: 'Sobre nosotros', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contacto' },
          hero: {
            kicker: 'Q&A MOKDA',
            title: 'Preguntas sobre MOKDA',
            description: 'Consulta las preguntas frecuentes sobre Salsa Coreana, sabores, usos, distribución y colaboración.',
          },
          board: {
            contact: 'Hacer una consulta',
          },
          social: 'REDES SOCIALES',
        },
        EN: {
          title: 'Frequently Asked Questions | MOKDA',
          nav: { about: 'About us', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contact' },
          hero: {
            kicker: 'MOKDA Q&A',
            title: 'Questions about MOKDA',
            description: 'Find answers about Salsa Coreana, products, distribution, export, and collaboration.',
          },
          board: {
            contact: 'Send an inquiry',
          },
          social: 'SOCIAL',
        },
        KR: {
          title: '자주 묻는 질문 | MOKDA',
          nav: { about: '브랜드 소개', products: 'Salsa Coreana', qna: 'Q&A', contact: '문의' },
          hero: {
            kicker: 'MOKDA Q&A',
            title: 'MOKDA에 대해 궁금한 점',
            description: 'Salsa Coreana, 제품, 유통, 수출, 협업과 관련된 자주 묻는 질문을 확인하세요.',
          },
          board: {
            contact: '1:1 문의하기',
          },
          social: 'MOKDA SNS',
        },
      };

      function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      }

      function renderLanguageButtons() {
        window.MOKDA_I18N.syncLanguageButtons(language);
      }

      function renderQnaList() {
        const list = document.getElementById('qnaList');
        list.innerHTML = qnaItems
          .map((item, index) => {
            const localized = item[language] || item.ES;
            const itemId = `qna-${index}`;
            return `
              <article class="qna-reading-item" aria-labelledby="${itemId}-title">
                <span class="qna-reading-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2 id="${itemId}-title">${localized.question}</h2>
                  <p>${localized.answer}</p>
                </div>
              </article>
            `;
          })
          .join('');


        bindReveal();
      }

      function bindReveal() {
        const elements = document.querySelectorAll('[data-reveal]:not([data-reveal-bound])');
        if (!('IntersectionObserver' in window)) {
          elements.forEach((element) => element.classList.add('is-visible'));
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );

        elements.forEach((element) => {
          const delay = element.getAttribute('data-reveal-delay');
          if (delay) element.style.setProperty('--reveal-delay', `${delay}ms`);
          element.setAttribute('data-reveal-bound', 'true');
          observer.observe(element);
        });
      }

      function renderPage() {
        const t = content[language] || content.ES;
        document.title = t.title;
        document.documentElement.lang = window.MOKDA_I18N.getHtmlLang(language);
        setText('nav-about', t.nav.about);
        setText('nav-products', t.nav.products);
        setText('nav-qna', t.nav.qna);
        setText('nav-contact', t.nav.contact);
        setText('pageKicker', t.hero.kicker);
        setText('pageTitle', t.hero.title);
        setText('pageDescription', t.hero.description);
        setText('boardContactLink', `${t.board.contact}  →`);
        setText('socialTitle', t.social);
        const pageTitle = document.getElementById('pageTitle');
        if (language !== 'KR') {
          const titleWords = t.hero.title.trim().split(/\s+/);
          pageTitle.replaceChildren();
          titleWords.forEach((word, index) => {
            if (index > 0) pageTitle.append(document.createTextNode(' '));
            const wordSpan = document.createElement('span');
            wordSpan.className = 'qna-title-word';
            wordSpan.textContent = word;
            pageTitle.append(wordSpan);
          });
        }
        pageTitle.classList.toggle('display-latin', language !== 'KR');
        pageTitle.classList.toggle('display-korean', language === 'KR');
        renderQnaList();
        window.MOKDA_FOOTER.render(language);
        renderLanguageButtons();
        bindReveal();
      }

      window.MOKDA_I18N.bindLanguageButtons((nextLanguage) => {
        language = nextLanguage;
        renderPage();
      });

      renderPage();

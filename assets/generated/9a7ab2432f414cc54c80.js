let language = window.MOKDA_I18N.getLanguage();

      const qnaItems = [
        {
          ES: {
            question: '¿Qué es MOKDA y qué es Salsa Coreana?',
            answer: 'MOKDA es una marca coreana de alimentos. Salsa Coreana es nuestra primera línea de salsas, pensada para acompañar los platos de todos los días en Latinoamérica.',
          },
          EN: {
            question: 'What are MOKDA and Salsa Coreana?',
            answer: 'MOKDA is a Korean food brand making sauces for everyday meals in Latin America. Salsa Coreana is our first sauce line.',
          },
          KR: {
            question: 'MOKDA와 Salsa Coreana는 무엇인가요?',
            answer: 'MOKDA는 라틴아메리카의 일상 음식에 어울리는 한국 소스를 만드는 K-Food 브랜드입니다. Salsa Coreana는 첫 번째 소스 라인입니다.',
          },
        },
        {
          ES: {
            question: '¿Qué salsas incluye Salsa Coreana?',
            answer: 'K-PEÑO combina el picante del gochujang con el toque fresco del jalapeño. Para Carnes es una salsa a base de ssamjang, de sabor intenso, para carnes y verduras.',
          },
          EN: {
            question: 'Which products are in the Salsa Coreana line?',
            answer: 'K-PEÑO combines gochujang with the fresh tang of jalapeño. Para Carnes is a rich, savory dipping sauce based on ssamjang, for meat and vegetables.',
          },
          KR: {
            question: 'Salsa Coreana에는 어떤 제품이 있나요?',
            answer: 'K-PEÑO는 고추장에 할라피뇨의 산뜻함을 더한 소스입니다. Para Carnes는 쌈장으로 만든 고기·채소용 소스로, 깊고 진한 감칠맛이 납니다.',
          },
        },
        {
          ES: {
            question: '¿Con qué comidas se pueden usar las salsas?',
            answer: 'K-PEÑO va bien con pollo, nachos, empanadas, pizza, carne y tacos. Para Carnes acompaña carnes asadas, al vapor o cocidas, además de vegetales.',
          },
          EN: {
            question: 'What foods can the sauces be used with?',
            answer: 'K-PEÑO pairs with chicken, nachos, empanadas, pizza, meat, and tacos. Para Carnes complements grilled, steamed, or boiled meat, as well as vegetables.',
          },
          KR: {
            question: '어떤 음식에 활용할 수 있나요?',
            answer: 'K-PEÑO는 치킨, 나초, 엠파나다, 피자, 고기, 타코 등에 잘 어울립니다. Para Carnes는 구운 고기, 찐 고기, 삶은 고기와 채소에 곁들이기 좋습니다.',
          },
        },
        {
          ES: {
            question: '¿Dónde puedo consultar disponibilidad, ingredientes y alérgenos?',
            answer: 'La disponibilidad depende del país. Encontrarás más información sobre cada salsa en su página de producto. Revisa el envase para consultar los ingredientes, alérgenos y la forma de conservación. Si quieres saber si vendemos en tu país, escríbenos desde la página de contacto.',
          },
          EN: {
            question: 'Where can I check availability, ingredients, and allergens?',
            answer: 'Availability varies by country. Visit each product page for details, and check the packaging for ingredients, allergens and storage instructions. To ask about availability in your country, get in touch through the contact page.',
          },
          KR: {
            question: '판매 여부, 원재료와 알레르겐 정보는 어디서 확인하나요?',
            answer: '판매 여부는 국가에 따라 다릅니다. 제품의 맛과 활용법은 상세 페이지에서, 원재료와 알레르기 유발 원료, 보관 방법은 제품 포장에서 확인해주세요. 해당 국가에서 구매할 수 있는지는 문의 페이지로 연락해주시면 안내해드립니다.',
          },
        },
        {
          ES: {
            question: '¿MOKDA trabaja con distribuidores, retail y HORECA?',
            answer: 'Sí. Recibimos propuestas de distribuidores, comercios, restaurantes y empresas del canal HORECA en Latinoamérica. También puedes escribirnos desde la página de contacto para proponer una colaboración de marca o consultar sobre nuestros productos.',
          },
          EN: {
            question: 'Does MOKDA work with distributors, retailers and HORECA businesses?',
            answer: 'Yes. We welcome proposals from distributors, retailers, restaurants and other HORECA businesses in Latin America. You can also use the contact page for brand partnerships or general product questions.',
          },
          KR: {
            question: '유통, 리테일과 HORECA 협업이 가능한가요?',
            answer: '가능합니다. 라틴아메리카 유통·소매업체와 레스토랑 등 HORECA 사업자의 제안을 받고 있습니다. 브랜드 협업이나 일반적인 제품 문의도 문의 페이지로 보내주세요.',
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
            description: 'Resuelve tus dudas sobre nuestras salsas, cómo disfrutarlas y las opciones de distribución y colaboración.',
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
            description: 'Read about our sauces, serving suggestions, distribution, exports and partnerships.',
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
            description: '소스의 맛과 활용법부터 유통·수출·협업까지, 자주 묻는 질문을 모았습니다.',
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
        if (document.body.dataset.contentLanguage === language) {
          renderLanguageButtons();
          bindReveal();
          return;
        }
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

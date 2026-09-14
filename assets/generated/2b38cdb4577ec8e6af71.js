let language = window.MOKDA_I18N.getLanguage();

      const countries = [
        ['Mexico', { ES: 'México', EN: 'Mexico', KR: '멕시코' }],
        ['Peru', { ES: 'Perú', EN: 'Peru', KR: '페루' }],
        ['Colombia', { ES: 'Colombia', EN: 'Colombia', KR: '콜롬비아' }],
        ['Chile', { ES: 'Chile', EN: 'Chile', KR: '칠레' }],
        ['Argentina', { ES: 'Argentina', EN: 'Argentina', KR: '아르헨티나' }],
        ['Puerto Rico', { ES: 'Puerto Rico', EN: 'Puerto Rico', KR: '푸에르토리코' }],
        ['Korea', { ES: 'Corea', EN: 'Korea', KR: '한국' }],
        ['Other', { ES: 'Otro país', EN: 'Other country', KR: '기타 국가' }],
      ];

      const content = {
        ES: {
          title: 'Alianza B2B | MOKDA',
          nav: { about: 'Sobre nosotros', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contacto' },
          hero: {
            kicker: 'ALIANZA B2B',
            title: 'Buscamos socios comerciales',
            description: 'Consultas para distribución, importación, retail, HORECA y colaboraciones de negocio en Latinoamérica.',
          },
          fields: {
            name: ['Nombre', 'Nombre completo'],
            email: ['Correo electrónico', 'Correo o WhatsApp'],
            whatsapp: ['WhatsApp', 'WhatsApp o correo'],
            country: ['País / Mercado', 'Selecciona un país'],
            purpose: ['Tipo de empresa', 'Opcional', ['Distribuidor', 'Importador', 'Retail', 'HORECA', 'Otro']],
            company: ['Empresa', 'Nombre de la empresa'],
            message: ['Mensaje', 'Cuéntanos brevemente tu propuesta'],
            submit: 'Enviar consulta B2B',
            required: 'Completa este campo.',
            emailError: 'Ingresa un correo válido.',
            contactMethod: 'Introduce al menos un correo electrónico o WhatsApp.',
          },
          messages: {
            sending: 'Enviando consulta...',
            success: 'Consulta enviada. Gracias por contactar a MOKDA.',
            error: 'No se pudo enviar. Inténtalo de nuevo o revisa la conexión.',
          },
          social: 'REDES SOCIALES',
        },
        EN: {
          title: 'B2B Partnership | MOKDA',
          nav: { about: 'About us', products: 'Korean Sauce', qna: 'Q&A', contact: 'Contact' },
          hero: {
            kicker: 'B2B PARTNERSHIP',
            title: 'We are looking for business partners',
            description: 'For distribution, import, retail, HORECA, and business partnerships across Latin America.',
          },
          fields: {
            name: ['Name', 'Full name'],
            email: ['Email', 'Email or WhatsApp'],
            whatsapp: ['WhatsApp', 'WhatsApp or email'],
            country: ['Country / Market', 'Select a country'],
            purpose: ['Business type', 'Optional', ['Distributor', 'Importer', 'Retail', 'HORECA', 'Other']],
            company: ['Company', 'Company name'],
            message: ['Message', 'Tell us briefly about your proposal'],
            submit: 'Send B2B inquiry',
            required: 'Please complete this field.',
            emailError: 'Please enter a valid email.',
            contactMethod: 'Enter at least an email address or WhatsApp number.',
          },
          messages: {
            sending: 'Sending inquiry...',
            success: 'Inquiry sent. Thank you for contacting MOKDA.',
            error: 'Could not send. Please try again or check the connection.',
          },
          social: 'SOCIAL',
        },
        KR: {
          title: 'B2B 문의 | MOKDA',
          nav: { about: '브랜드 소개', products: 'Salsa Coreana', qna: 'Q&A', contact: '문의' },
          hero: {
            kicker: 'B2B PARTNERSHIP',
            title: '함께할 비즈니스 파트너를 찾습니다',
            description: '라틴아메리카 유통, 수입, 리테일, HORECA 및 사업 협력 문의를 받습니다.',
          },
          fields: {
            name: ['이름', '이름을 입력해주세요'],
            email: ['이메일', '이메일 또는 WhatsApp'],
            whatsapp: ['WhatsApp', 'WhatsApp 또는 이메일'],
            country: ['국가 / 시장', '국가 선택'],
            purpose: ['사업 유형', '선택 입력', ['유통사', '수입사', '리테일', 'HORECA', '기타']],
            company: ['회사명', '회사명을 입력해주세요'],
            message: ['문의 내용', '사업 제안을 간단히 적어주세요'],
            submit: 'B2B 문의 보내기',
            required: '필수 항목입니다.',
            emailError: '올바른 이메일을 입력해주세요.',
            contactMethod: '이메일 또는 WhatsApp 중 하나를 입력해주세요.',
          },
          messages: {
            sending: '문의 전송 중...',
            success: '문의가 전송되었습니다. MOKDA에 연락해주셔서 감사합니다.',
            error: '전송하지 못했습니다. 다시 시도하거나 연결 상태를 확인해주세요.',
          },
          social: 'MOKDA SNS',
        },
      };

      function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      }

      function setPlaceholder(id, value) {
        const element = document.getElementById(id);
        if (element) element.setAttribute('placeholder', value);
      }

      function renderLanguageButtons() {
        window.MOKDA_I18N.syncLanguageButtons(language);
      }

      function setFormStatus(type, message) {
        const status = document.getElementById('formStatus');
        if (!status) return;
        status.textContent = message || '';
        status.className = 'mt-4 min-h-6 text-center text-sm font-bold';
        if (type === 'success') status.classList.add('text-emerald-700');
        else if (type === 'error') status.classList.add('text-red-600');
        else if (type === 'pending') status.classList.add('text-neutral-500');
      }

      function setFormSubmitting(isSubmitting) {
        const button = document.getElementById('submitButton');
        if (!button) return;
        button.disabled = isSubmitting;
        button.classList.toggle('cursor-wait', isSubmitting);
        button.classList.toggle('opacity-70', isSubmitting);
      }

      function renderForm(fields) {
        setText('nameLabel', fields.name[0]);
        setPlaceholder('nameInput', fields.name[1]);
        setText('emailLabel', fields.email[0]);
        setPlaceholder('emailInput', fields.email[1]);
        setText('whatsappLabel', fields.whatsapp[0]);
        setPlaceholder('whatsappInput', fields.whatsapp[1]);
        setText('countryLabel', fields.country[0]);
        setText('purposeLabel', fields.purpose[0]);
        setText('companyLabel', fields.company[0]);
        setPlaceholder('companyInput', fields.company[1]);
        setText('contactMethodHint', fields.contactMethod);
        setText('messageLabel', fields.message[0]);
        setPlaceholder('messageInput', fields.message[1]);
        setText('submitButtonText', fields.submit);
        document.getElementById('countrySelect').innerHTML = `
          <option value="" selected disabled>${fields.country[1]}</option>
          ${countries.map(([value, labels]) => `<option value="${value}">${labels[language]}</option>`).join('')}
        `;
        document.getElementById('purposeSelect').innerHTML = `
          <option value="" selected>${fields.purpose[1]}</option>
          ${fields.purpose[2].map((label) => `<option value="${label}">${label}</option>`).join('')}
        `;
        applyInquiryPreset();
        ['nameInput', 'companyInput', 'emailInput', 'whatsappInput', 'countrySelect', 'messageInput'].forEach((id) => {
          const field = document.getElementById(id);
          if (!field) return;
          field.setCustomValidity('');
          field.oninvalid = () => {
            if (field.validity.typeMismatch) {
              field.setCustomValidity(fields.emailError || fields.required);
              return;
            }
            field.setCustomValidity(fields.required);
          };
          field.oninput = () => field.setCustomValidity('');
          field.onchange = () => field.setCustomValidity('');
        });
        ['emailInput', 'whatsappInput'].forEach((id) => {
          document.getElementById(id).addEventListener('input', () => {
            document.getElementById('emailInput').setCustomValidity('');
            document.getElementById('whatsappInput').setCustomValidity('');
          });
        });
      }

      function applyInquiryPreset() {
        const params = new URLSearchParams(window.location.search);
        const purpose = document.getElementById('purposeSelect');
        if (params.get('purpose') === 'distribution' && purpose?.options[1]) purpose.selectedIndex = 1;
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

      let submissionPending = false;
      async function submitContactForm(event) {
        event.preventDefault();
        if (submissionPending) return;
        const endpoint = window.MOKDA_B2B_WEB_APP_URL;
        const messages = (content[language] || content.ES).messages;

        if (!endpoint) {
          setFormStatus('error', messages.error);
          return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = String(formData.get('email') || '').trim();
        const whatsapp = String(formData.get('whatsapp') || '').trim();
        if (!email && !whatsapp) {
          const emailInput = document.getElementById('emailInput');
          emailInput.setCustomValidity((content[language] || content.ES).fields.contactMethod);
          emailInput.reportValidity();
          return;
        }
        const payload = {
          source: 'b2b-contact-page',
          language,
          name: String(formData.get('name') || '').trim(),
          email,
          whatsapp,
          company: String(formData.get('company') || '').trim(),
          role: '',
          product: ['original', 'para-carnes'].includes(new URLSearchParams(location.search).get('product')) ? new URLSearchParams(location.search).get('product') : '',
          country: String(formData.get('country') || '').trim(),
          purpose: String(formData.get('purpose') || '').trim() || 'Business partnership',
          message: String(formData.get('message') || '').trim(),
          website: String(formData.get('website') || '').trim(),
          pageUrl: window.location.origin + window.location.pathname,
          userAgent: navigator.userAgent,
        };

        submissionPending = true;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);
        setFormSubmitting(true);
        setFormStatus('pending', messages.sending);

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            signal: controller.signal,
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          if (!response.ok || !result.ok || result.saved !== true) {
            throw new Error('Inquiry submission failed');
          }

          form.reset();
          renderForm((content[language] || content.ES).fields);
          setFormStatus('success', messages.success);
          if (!result.duplicate) window.MOKDA_ANALYTICS?.track(
            'generate_lead',
             { element: 'b2b_form' },
            { immediate: true }
          );
        } catch (error) {
          console.warn('Inquiry submission unavailable');
          setFormStatus('error', messages.error);
        } finally {
          clearTimeout(timeout);
          submissionPending = false;
          setFormSubmitting(false);
        }
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
        setText('socialTitle', t.social);
        ['pageTitle'].forEach((id) => {
          const heading = document.getElementById(id);
          heading.classList.toggle('display-latin', language !== 'KR');
          heading.classList.toggle('display-korean', language === 'KR');
        });
        renderForm(t.fields);
        window.MOKDA_FOOTER.render(language);
        renderLanguageButtons();
        bindReveal();
      }

      window.MOKDA_I18N.bindLanguageButtons((nextLanguage) => {
        language = nextLanguage;
        renderPage();
        setFormStatus('', '');
      });

      document.getElementById('b2bForm').addEventListener('submit', submitContactForm);
      renderPage();

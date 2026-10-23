let language = window.MOKDA_I18N.getLanguage();

      const countries = window.MOKDA_COUNTRIES.records.map(item => [item.name,item.names]);
      countries.push(['Other',{ES:'Otro país o territorio',EN:'Other country or territory',KR:'기타 국가·지역'}]);
      const content = {
        ES: {
          title: 'Alianza B2B | MOKDA',
          nav: { about: 'Sobre nosotros', products: 'Salsa Coreana', qna: 'Q&A', contact: 'Contacto' },
          hero: {
            kicker: 'ALIANZA B2B',
            title: 'Buscamos socios comerciales',
            description: 'Escríbenos si te interesa distribuir o importar nuestras salsas, venderlas en tu negocio o trabajar con nosotros en el canal HORECA de Latinoamérica. También respondemos preguntas sobre los productos.',
          },
          fields: {
            name: ['Nombre', 'Nombre completo'],
            email: ['Correo electrónico', 'nombre@empresa.com'],
            whatsapp: ['WhatsApp', 'Número con código de país (+...)'],
            country: ['País / Mercado', 'Selecciona un país'],
            purpose: ['Tipo de consulta', 'Opcional', ['Distribuidor', 'Importador', 'Retail', 'HORECA', 'Consulta general', 'Otro', 'Colaboración con MOKDA']],
            company: ['Empresa (opcional)', 'Nombre de la empresa, si corresponde'],
            message: ['Mensaje', 'Cuéntanos qué necesitas o qué te gustaría proponer'],
            submit: 'Enviar consulta',
            required: 'Completa este campo.',
            emailError: 'Ingresa un correo válido.',
            contactMethod: 'Ingresa tu correo electrónico o número de WhatsApp.',
          },
          messages: {
            sending: 'Enviando consulta...',
            success: 'Recibimos tu consulta. Gracias por escribirnos.',
            error: 'No se pudo enviar tu consulta. Revisa la conexión e inténtalo de nuevo.',
          },
          social: 'REDES SOCIALES',
        },
        EN: {
          title: 'B2B Partnership | MOKDA',
          nav: { about: 'About us', products: 'Korean Sauce', qna: 'Q&A', contact: 'Contact' },
          hero: {
            kicker: 'B2B PARTNERSHIP',
            title: 'We are looking for business partners',
            description: 'Get in touch about distributing, importing or selling our sauces, or supplying HORECA businesses in Latin America. We also answer general product questions.',
          },
          fields: {
            name: ['Name', 'Full name'],
            email: ['Email', 'name@company.com'],
            whatsapp: ['WhatsApp', 'Number with country code (+...)'],
            country: ['Country / Market', 'Select a country'],
            purpose: ['Inquiry type', 'Optional', ['Distributor', 'Importer', 'Retail', 'HORECA', 'General inquiry', 'Other', 'Collaboration with MOKDA']],
            company: ['Company (optional)', 'Company name, if applicable'],
            message: ['Message', 'Tell us what you need or what you would like to propose'],
            submit: 'Send inquiry',
            required: 'Please complete this field.',
            emailError: 'Please enter a valid email address.',
            contactMethod: 'Enter an email address or WhatsApp number so we can reply.',
          },
          messages: {
            sending: 'Sending inquiry...',
            success: 'We received your inquiry. Thank you for getting in touch.',
            error: 'Your inquiry could not be sent. Check your connection and try again.',
          },
          social: 'SOCIAL',
        },
        KR: {
          title: 'B2B 문의 | MOKDA',
          nav: { about: '브랜드 소개', products: 'Salsa Coreana', qna: 'Q&A', contact: '문의' },
          hero: {
            kicker: 'B2B PARTNERSHIP',
            title: '함께할 비즈니스 파트너를 찾습니다',
            description: '라틴아메리카 유통·수입·소매 판매와 HORECA 사업 협력을 제안해주세요. 제품에 관한 일반 문의도 받습니다.',
          },
          fields: {
            name: ['이름', '이름을 입력해주세요'],
            email: ['이메일', 'name@company.com'],
            whatsapp: ['WhatsApp', '국가번호를 포함한 전화번호 (+...)'],
            country: ['국가 / 시장', '국가 선택'],
            purpose: ['문의 유형', '선택 입력', ['유통사', '수입사', '리테일', 'HORECA', '일반 문의', '기타', 'MOKDA 협업']],
            company: ['회사명 (선택)', '회사명을 입력해주세요'],
            message: ['문의 내용', '궁금한 점이나 사업 제안을 적어주세요'],
            submit: '문의 보내기',
            required: '필수 항목입니다.',
            emailError: '올바른 이메일을 입력해주세요.',
            contactMethod: '답변받을 이메일이나 WhatsApp 번호를 입력해주세요.',
          },
          messages: {
            sending: '문의를 보내는 중입니다...',
            success: '문의가 접수되었습니다. 연락해주셔서 감사합니다.',
            error: '문의가 전송되지 않았습니다. 인터넷 연결을 확인한 뒤 다시 시도해주세요.',
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
        const productCopy = { KR:['관심 제품 (선택)','아직 결정하지 않았어요','두 제품 모두'], ES:['Salsa de interés (opcional)','Aún no lo he decidido','Ambas salsas'], EN:['Product of interest (optional)','Not decided yet','Both sauces'] }[language];
        setText('productLabel', productCopy[0]);
        document.getElementById('productSelect').replaceChildren(...[['',productCopy[1]],['original','K-PEÑO'],['para-carnes','Para Carnes'],['both',productCopy[2]]].map(([value,label]) => { const option=document.createElement('option'); option.value=value; option.textContent=label; return option; }));
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
        const product = params.get('product');
        if (['original','para-carnes','both'].includes(product)) document.getElementById('productSelect').value = product;
        if (params.get('purpose') === 'distribution' && purpose?.options[1]) purpose.selectedIndex = 1;
        if (params.get('purpose') === 'collaboration' && purpose?.options[7]) purpose.selectedIndex = 7;
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
          product: ['original', 'para-carnes', 'both'].includes(formData.get('product')) ? formData.get('product') : '',
          country: String(formData.get('country') || '').trim(),
          purpose: String(formData.get('purpose') || '').trim() || 'Business partnership',
          message: String(formData.get('message') || '').trim(),
          website: String(formData.get('website') || '').trim(),
          pageUrl: window.location.origin + window.location.pathname,
          userAgent: navigator.userAgent,
        };

        submissionPending = true;
        const controller = new AbortController();
        let timeout;
        setFormSubmitting(true);
        setFormStatus('pending', messages.sending);

        try {
          payload.turnstileToken = await window.MOKDA_TURNSTILE.token('mokda_inquiry', { language, signal: controller.signal });
          timeout = setTimeout(() => controller.abort(), 25000);
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

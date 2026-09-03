(() => {
  'use strict';

  const previewHosts = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '[::1]',
    'mokda.kr',
    'www.mokda.kr',
  ]);
  const previewParameter = 'support_preview';
  const previewValue = '200';
  const campaignCreatedAt = '2026-07-30T16:12:41+09:00';
  const countryPlan = [
    { code: 'PE', total: 120, female: 96 },
    { code: 'MX', total: 60, female: 48 },
    { code: 'CL', total: 10, female: 8 },
    { code: 'CO', total: 10, female: 8 },
  ];

  const firstNames = {
    PE: {
      female: ['María', 'Valeria', 'Luciana', 'Camila', 'Daniela', 'Andrea', 'Fernanda', 'Alejandra', 'Adriana', 'Claudia', 'Fiorella', 'Milagros', 'Ximena', 'Paola', 'Rocío', 'Renata'],
      male: ['José', 'Luis', 'Carlos', 'Diego', 'Jorge', 'Miguel', 'Renzo', 'Sebastián', 'Álvaro', 'Franco', 'Mateo', 'Rodrigo'],
    },
    MX: {
      female: ['Sofía', 'Regina', 'Valentina', 'Mariana', 'Ximena', 'Renata', 'Natalia', 'Fernanda', 'Daniela', 'Camila', 'Alejandra', 'Montserrat', 'Paola', 'Andrea', 'Carolina', 'Fátima'],
      male: ['Santiago', 'Emiliano', 'Mateo', 'Sebastián', 'Leonardo', 'Diego', 'Alejandro', 'Miguel', 'Fernando', 'Javier', 'Ricardo', 'Eduardo'],
    },
    CL: {
      female: ['Antonia', 'Isidora', 'Catalina', 'Josefa', 'Florencia', 'Martina', 'Javiera', 'Constanza'],
      male: ['Benjamín', 'Vicente', 'Tomás', 'Matías', 'Joaquín', 'Felipe'],
    },
    CO: {
      female: ['Salomé', 'Mariana', 'Gabriela', 'Valentina', 'Isabella', 'Laura', 'Manuela', 'Sara'],
      male: ['Samuel', 'Nicolás', 'Santiago', 'Juan', 'Andrés', 'Esteban'],
    },
  };

  const surnames = {
    PE: ['Quispe', 'Flores', 'Huamán', 'Rojas', 'Vargas', 'Mendoza', 'Castillo', 'Chávez', 'Salazar', 'Paredes', 'Cárdenas', 'Espinoza', 'Torres', 'Ramírez', 'Gutiérrez'],
    MX: ['Hernández', 'García', 'Martínez', 'López', 'González', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez', 'Cruz', 'Flores', 'Gómez', 'Morales', 'Vázquez', 'Reyes'],
    CL: ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda'],
    CO: ['Rodríguez', 'Martínez', 'García', 'Gómez', 'López', 'González', 'Hernández', 'Sánchez', 'Ramírez', 'Torres'],
  };

  const countryNames = {
    ES: { PE: 'Perú', MX: 'México', CL: 'Chile', CO: 'Colombia' },
    KR: { PE: '페루', MX: '멕시코', CL: '칠레', CO: '콜롬비아' },
    EN: { PE: 'Peru', MX: 'Mexico', CL: 'Chile', CO: 'Colombia' },
  };

  function isSupportedHost() {
    const hostname = String(window.location.hostname || '').toLowerCase();
    return previewHosts.has(hostname);
  }

  function isTestMode() {
    const params = new URLSearchParams(window.location.search);
    const enabled = isSupportedHost() && params.get(previewParameter) === previewValue;
    if (enabled && typeof document !== 'undefined') {
      let robots = document.querySelector('meta[data-support-preview-robots]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        robots.dataset.supportPreviewRobots = 'true';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow, noarchive';
    }
    return enabled;
  }

  function isEnabled() {
    return isSupportedHost();
  }

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6D2B79F5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(values, random) {
    const result = values.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function localizedMessage(language, code) {
    const normalizedLanguage = Object.prototype.hasOwnProperty.call(countryNames, language) ? language : 'ES';
    const country = countryNames[normalizedLanguage][code];
    if (normalizedLanguage === 'KR') return `${country}에서 Salsa Coreana를 만나고 싶어요!`;
    if (normalizedLanguage === 'EN') return `I want to find Salsa Coreana in ${country}!`;
    return `¡Quiero encontrar Salsa Coreana en ${country}!`;
  }

  function create(language = 'ES') {
    const random = seededRandom(20260730);
    const start = new Date(campaignCreatedAt).getTime();
    const end = Math.max(start, Date.now());
    const entries = [];
    const totals = {};

    countryPlan.forEach(({ code, total, female }) => {
      totals[code] = total;
      const genders = shuffle([
        ...Array.from({ length: female }, () => 'female'),
        ...Array.from({ length: total - female }, () => 'male'),
      ], random);
      const genderIndexes = { female: 0, male: 0 };
      const nameOffsets = {
        female: Math.floor(random() * firstNames[code].female.length),
        male: Math.floor(random() * firstNames[code].male.length),
      };
      const surnameOffsets = {
        female: Math.floor(random() * surnames[code].length),
        male: Math.floor(random() * surnames[code].length),
      };

      genders.forEach((gender) => {
        const names = firstNames[code][gender];
        const familyNames = surnames[code];
        const genderIndex = genderIndexes[gender];
        genderIndexes[gender] += 1;
        const firstName = names[(genderIndex + nameOffsets[gender]) % names.length];
        const firstSurname = familyNames[
          (Math.floor(genderIndex / names.length) + surnameOffsets[gender]) % familyNames.length
        ];
        const createdAt = new Date(start + Math.floor(random() * (end - start + 1))).toISOString();

        entries.push({
          name: `${firstName} ${firstSurname}`,
          countryCode: code,
          gender,
          message: localizedMessage(language, code),
          createdAt,
        });
      });
    });

    entries.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
    return {
      total: entries.length,
      totals,
      entries,
      campaignCreatedAt,
    };
  }

  window.MOKDA_SUPPORT_PREVIEW = Object.freeze({
    isEnabled,
    isTestMode,
    create,
    parameter: previewParameter,
    value: previewValue,
  });
})();

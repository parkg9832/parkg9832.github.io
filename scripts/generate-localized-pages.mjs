import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.mokda.kr';
const LAST_MODIFIED = '2026-08-10';
const SITE_FONT_REQUEST =
  'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Black+Han+Sans&family=Noto+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap';

const languages = {
  ES: { directory: 'es', html: 'es-419', hreflang: 'es-419', og: 'es_419' },
  KR: { directory: 'ko', html: 'ko-KR', hreflang: 'ko-KR', og: 'ko_KR' },
  EN: { directory: 'en', html: 'en', hreflang: 'en', og: 'en_US' },
};

const pages = {
  'index.html': {
    route: '',
    type: 'WebPage',
    ES: {
      title: 'MOKDA | Salsa Coreana para América Latina',
      description: 'MOKDA conecta Corea con América Latina a través de Salsa Coreana, su primera línea de salsas para comidas cotidianas.',
    },
    KR: {
      title: 'MOKDA | 라틴아메리카를 위한 한국 소스 브랜드',
      description: 'MOKDA는 한국의 맛과 문화를 라틴아메리카의 일상 음식에 연결하는 K-Food 브랜드입니다.',
    },
    EN: {
      title: 'MOKDA | Korean Sauce Brand for Latin America',
      description: 'MOKDA connects Korean flavors with everyday food across Latin America through Salsa Coreana, its first product line.',
    },
  },
  'about.html': {
    route: 'about.html',
    type: 'AboutPage',
    ES: {
      title: 'Sobre MOKDA | K-Food entre Corea y América Latina',
      description: 'Conoce la historia, identidad y trayectoria de MOKDA, la marca K-Food que conecta Corea con América Latina.',
    },
    KR: {
      title: 'MOKDA 브랜드 소개 | 한국과 라틴아메리카를 잇는 K-Food',
      description: '한국의 맛과 문화를 라틴아메리카의 일상 식탁에 연결하는 K-Food 브랜드 MOKDA의 이야기와 여정을 소개합니다.',
    },
    EN: {
      title: 'About MOKDA | K-Food between Korea and Latin America',
      description: 'Discover the story, identity, and journey of MOKDA, the K-Food brand connecting Korea and Latin America.',
    },
  },
  'products.html': {
    route: 'products.html',
    type: 'CollectionPage',
    ES: {
      title: 'Salsa Coreana | Línea de productos MOKDA',
      description: 'Original, Para Carnes y Soy Sauce: la primera línea de salsas coreanas de MOKDA para América Latina.',
    },
    KR: {
      title: 'Salsa Coreana | MOKDA 한국 소스 라인업',
      description: 'Original, Para Carnes, Soy Sauce로 구성된 MOKDA의 첫 번째 한국 소스 제품 라인업을 확인하세요.',
    },
    EN: {
      title: 'Salsa Coreana | MOKDA Product Line',
      description: 'Explore Original, Para Carnes, and Soy Sauce, the first Korean sauce product line from MOKDA for Latin America.',
    },
  },
  'qna.html': {
    route: 'qna.html',
    type: 'WebPage',
    ES: {
      title: 'Preguntas frecuentes | MOKDA',
      description: 'Respuestas sobre MOKDA, Salsa Coreana, productos, usos, disponibilidad, distribución y colaboraciones.',
    },
    KR: {
      title: '자주 묻는 질문 | MOKDA',
      description: 'MOKDA와 Salsa Coreana의 제품, 활용법, 판매 정보, 유통 및 협업에 관한 자주 묻는 질문을 확인하세요.',
    },
    EN: {
      title: 'Frequently Asked Questions | MOKDA',
      description: 'Find answers about MOKDA, Salsa Coreana, products, usage, availability, distribution, and partnerships.',
    },
  },
  'contact.html': {
    route: 'contact.html',
    type: 'ContactPage',
    ES: {
      title: 'Alianza B2B | MOKDA',
      description: 'Contacta a MOKDA sobre distribución, importación, retail, HORECA y alianzas comerciales para Latinoamérica.',
    },
    KR: {
      title: 'B2B 문의 | MOKDA',
      description: 'MOKDA의 라틴아메리카 유통, 수입, 리테일, HORECA 및 사업 협력에 관해 문의하세요.',
    },
    EN: {
      title: 'B2B Partnership | MOKDA',
      description: 'Contact MOKDA about distribution, importing, retail, HORECA, and business partnerships across Latin America.',
    },
  },
  'support.html': {
    route: 'support.html',
    type: 'WebPage',
    image: {
      ES: `${SITE}/assets/og-mokda.png`,
      KR: `${SITE}/assets/og-mokda.png`,
      EN: `${SITE}/assets/og-mokda.png`,
    },
    ES: {
      title: 'Apoya el lanzamiento de Salsa Coreana | MOKDA',
      description: 'Apoya el lanzamiento de Salsa Coreana de MOKDA en Perú, México, Chile y Colombia.',
    },
    KR: {
      title: 'Salsa Coreana 출시 응원 | MOKDA',
      description: '페루, 멕시코, 칠레와 콜롬비아에서 만나고 싶은 MOKDA Salsa Coreana의 출시를 응원해주세요.',
    },
    EN: {
      title: 'Support the Salsa Coreana Launch | MOKDA',
      description: 'Support the launch of MOKDA Salsa Coreana in Peru, Mexico, Chile, and Colombia.',
    },
  },
};

function routeUrl(language, page) {
  const prefix = languages[language].directory;
  return page.route ? `${SITE}/${prefix}/${page.route}` : `${SITE}/${prefix}/`;
}

function alternateLinks(page) {
  const links = Object.entries(languages).map(([language, config]) =>
    `    <link rel="alternate" hreflang="${config.hreflang}" href="${routeUrl(language, page)}" />`,
  );
  links.push(`    <link rel="alternate" hreflang="x-default" href="${routeUrl('ES', page)}" />`);
  return links.join('\n');
}

function localizeInternalLinks(html, language) {
  const prefix = languages[language].directory;
  return html.replace(
    /href="(index|about|products|qna|contact|support)\.html([^"#?]*)([?#][^"]*)?"/g,
    (_match, pageName, extraPath, suffix = '') => {
      const route = pageName === 'index' ? '' : `${pageName}.html${extraPath || ''}`;
      return `href="/${prefix}/${route}${suffix}"`;
    },
  );
}

function localizeFontRequests(html, language) {
  return html.replace(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/g, SITE_FONT_REQUEST);
}

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<meta[^>]*${escaped}[^>]*content=")[^"]*("[^>]*>)`, 'i');
  return html.replace(pattern, `$1${value}$2`);
}

function structuredData(language, page, canonical, metadata) {
  const graph = [
    {
      '@type': page.type,
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: metadata.title,
      description: metadata.description,
      inLanguage: languages[language].html,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#organization` },
    },
  ];

  if (!page.route) {
    graph.push(
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'MOKDA',
        alternateName: ['먹다', 'MOKDA Salsa Coreana', 'Mokda 먹다'],
        url: `${SITE}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE}/favicon.png`,
          width: 192,
          height: 192,
        },
        image: `${SITE}/assets/og-mokda.png`,
        slogan: 'Comer Corea · 한국을 먹다',
        description: 'Marca K-Food que conecta sabores de Corea con las mesas cotidianas de América Latina.',
        sameAs: [
          'https://www.instagram.com/salsa_coreana/',
          'https://www.tiktok.com/@salsa_coreana',
          'https://www.threads.com/@salsa_coreana',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'MOKDA',
        alternateName: ['먹다', 'MOKDA Salsa Coreana', 'Mokda 먹다'],
        url: `${SITE}/`,
        inLanguage: ['es-419', 'ko-KR', 'en'],
        publisher: { '@id': `${SITE}/#organization` },
      },
    );
  }

  if (page.route) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'MOKDA', item: `${SITE}/${languages[language].directory}/` },
        { '@type': 'ListItem', position: 2, name: metadata.title.split('|')[0].trim(), item: canonical },
      ],
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function localizeHtml(source, language, page) {
  const config = languages[language];
  const metadata = page[language];
  const canonical = routeUrl(language, page);
  let html = source;

  html = html.replace(/\s*<!-- legacy-route-redirect:start -->[\s\S]*?<!-- legacy-route-redirect:end -->\s*/i, '\n');
  html = html.replace(/<html\s+lang="[^"]+"([^>]*)>/i, (_match, attributes) => {
    const cleanAttributes = attributes.replace(/\s+data-route-language="[^"]*"/gi, '');
    return `<html lang="${config.html}" data-route-language="${language}"${cleanAttributes}>`;
  });
  html = html.replace(/(<meta\s+name="viewport"[^>]*>)/i, `$1\n    <base href="/" />\n    <meta name="mokda-route-language" content="${language}" />`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${metadata.title}</title>`);
  html = html.replace(/<meta(?:\s+id="[^"]+")?\s+name="description"[\s\S]*?\/\s*>/i, `    <meta name="description" content="${metadata.description}" />`);
  html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*>/gi, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />\n${alternateLinks(page)}`);
  html = replaceMeta(html, 'property="og:locale"', config.og);
  html = replaceMeta(html, 'property="og:title"', metadata.title);
  html = replaceMeta(html, 'property="og:description"', metadata.description);
  html = replaceMeta(html, 'property="og:url"', canonical);
  if (page.image?.[language]) {
    html = replaceMeta(html, 'property="og:image"', page.image[language]);
    html = replaceMeta(html, 'name="twitter:image"', page.image[language]);
  }
  html = replaceMeta(html, 'name="twitter:title"', metadata.title);
  html = replaceMeta(html, 'name="twitter:description"', metadata.description);
  html = html.replace(/\s*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  html = html.replace('</head>', `    <script type="application/ld+json">\n${structuredData(language, page, canonical, metadata)}\n    </script>\n  </head>`);
  html = localizeFontRequests(html, language);
  html = localizeInternalLinks(html, language);
  if (!html.includes('site-typography.css')) {
    html = html.replace(
      '</head>',
      '    <link rel="stylesheet" href="./styles/site-typography.css?v=20260810-2" />\n  </head>',
    );
  }
  return html;
}

const sitemapUrls = [];

for (const [fileName, page] of Object.entries(pages)) {
  const source = await readFile(join(ROOT, fileName), 'utf8');

  for (const language of Object.keys(languages)) {
    const outputPath = join(ROOT, languages[language].directory, fileName);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, localizeHtml(source, language, page), 'utf8');
    sitemapUrls.push(routeUrl(language, page));
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${LAST_MODIFIED}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;

await writeFile(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated ${sitemapUrls.length} localized pages and sitemap.xml.`);

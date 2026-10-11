import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { secureHtml, externalizeBlocks } from './static-security.mjs';
import { prerenderContent } from './prerender-content.mjs';
import { generateNewsSources } from './generate-news-sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.mokda.kr';
const LAST_MODIFIED = '2026-10-11';
const BRAND_IMAGE = `${SITE}/assets/images/mokda-logo-main.webp`;
const BRAND_IMAGE_ALT = { ES: 'Logotipo de MOKDA', KR: 'MOKDA 로고', EN: 'MOKDA logo' };
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
    brandImage: true,
    ES: {
      title: 'MOKDA | Salsa Coreana para Latinoamérica',
      description: 'MOKDA conecta Corea con Latinoamérica a través de Salsa Coreana, su primera línea de salsas para comidas cotidianas.',
    },
    KR: {
      title: 'MOKDA | 라틴아메리카를 위한 한국 소스 브랜드',
      description: 'MOKDA는 한국의 맛과 문화를 라틴아메리카의 일상 음식에 연결하는 K-Food 브랜드입니다.',
    },
    EN: {
      title: 'MOKDA | Salsa Coreana for Latin America',
      description: 'MOKDA connects Korean flavors with everyday food across Latin America through Salsa Coreana, its first product line.',
    },
  },
  'about.html': {
    route: 'about.html',
    type: 'AboutPage',
    brandImage: true,
    ES: {
      title: 'Sobre MOKDA | K-Food entre Corea y Latinoamérica',
      description: 'Conoce la historia, identidad y trayectoria de MOKDA, la marca K-Food que conecta Corea con Latinoamérica.',
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
      title: 'Salsa Coreana | Salsas MOKDA',
      description: 'K-PEÑO y Para Carnes: la primera línea de salsas coreanas de MOKDA para Latinoamérica.',
    },
    KR: {
      title: 'Salsa Coreana | MOKDA 한국 소스 라인업',
      description: 'K-PEÑO와 Para Carnes로 구성된 MOKDA의 첫 번째 한국 소스 라인업을 확인하세요.',
    },
    EN: {
      title: 'Salsa Coreana | MOKDA Sauces',
      description: 'Explore K-PEÑO and Para Carnes, MOKDA’s first Korean sauce lineup for Latin America.',
    },
  },
  'kpeno.html': {
    route: 'kpeno.html',
    type: 'ProductPage',
    ES: { title: 'K-PEÑO | Salsa Coreana MOKDA', description: 'Conoce K-PEÑO, la Salsa Coreana de MOKDA con gochujang y jalapeño.' },
    KR: { title: 'K-PEÑO 제품 상세 | MOKDA', description: '고추장과 할라피뇨를 담은 MOKDA K-PEÑO의 제품 상세를 확인하세요.' },
    EN: { title: 'K-PEÑO Product Details | MOKDA', description: 'Discover K-PEÑO, MOKDA’s Korean table sauce with gochujang and jalapeño.' },
  },
  'para-carnes.html': {
    route: 'para-carnes.html',
    type: 'ProductPage',
    ES: { title: 'Para Carnes | Salsa Coreana MOKDA', description: 'Conoce Para Carnes, la Salsa Coreana de MOKDA inspirada en el ssamjang.' },
    KR: { title: 'Para Carnes 제품 상세 | MOKDA', description: '쌈장에서 영감을 받은 MOKDA Para Carnes의 제품 상세를 확인하세요.' },
    EN: { title: 'Para Carnes Product Details | MOKDA', description: 'Discover Para Carnes, MOKDA’s Korean sauce inspired by ssamjang.' },
  },
  'qna.html': {
    route: 'qna.html',
    type: 'WebPage',
    ES: {
      title: 'Preguntas frecuentes | MOKDA',
      description: 'Respuestas sobre MOKDA, Salsa Coreana, sabores, usos, disponibilidad, distribución y colaboraciones.',
    },
    KR: {
      title: '자주 묻는 질문 | MOKDA',
      description: 'MOKDA와 Salsa Coreana의 소스, 활용법, 판매 정보, 유통 및 협업에 관한 자주 묻는 질문을 확인하세요.',
    },
    EN: {
      title: 'Frequently Asked Questions | MOKDA',
      description: 'Find answers about MOKDA, Salsa Coreana, sauces, usage, availability, distribution, and partnerships.',
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
};
Object.assign(pages, await generateNewsSources(ROOT));

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
    /href="(index|about|products|kpeno|para-carnes|qna|contact|support|news(?:-[a-z0-9-]+)?)\.html([^"#?]*)([?#][^"]*)?"/g,
    (_match, pageName, extraPath, suffix = '') => {
      const route = pageName === 'index' ? '' : `${pageName}.html${extraPath || ''}`;
      return `href="/${prefix}/${route}${suffix}"`;
    },
  );
}

function localizeFontRequests(html, language) {
  return html.replace(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/g, SITE_FONT_REQUEST);
}

function addHelpAssets(html) {
  if (!html.includes('styles/site-help.css')) {
    html = html.replace(/<\/head>/i, '    <link rel="stylesheet" href="./styles/site-help.css" />\n</head>');
  }
  // Rebuild this small block in dependency order without growing whitespace on repeated runs.
  html = html.replace(/^[ \t]*<script\b[^>]*\bsrc=["'](?:\.\/)?(?:site-help-data|site-chat-intents|site-help)\.js["'][^>]*><\/script>[ \t]*\r?\n?/gm, '');
  const scripts = html.includes('site-contact-config.js') ? [] : ['site-contact-config.js'];
  scripts.push('site-help-data.js', 'site-chat-intents.js', 'site-help.js');
  return html.replace(/[ \t\r\n]*<\/body>/i, `\n${scripts.map(name => `    <script defer src="./${name}"></script>`).join('\n')}\n</body>`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<meta[^>]*${escaped}[^>]*content=")[^"]*("[^>]*>)`, 'i');
  return html.replace(pattern, (_, before, after) => before + escapeHtml(value) + after);
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
      ...(page.brandImage ? {
        image: BRAND_IMAGE,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: BRAND_IMAGE,
          contentUrl: BRAND_IMAGE,
          width: 500,
          height: 500,
          caption: BRAND_IMAGE_ALT[language],
        },
      } : {}),
      ...(page.publishedDate ? {
        datePublished: page.publishedDate,
        dateModified: page.publishedDate,
        author: { '@type': 'Organization', name: 'MOKDA', url: SITE },
        publisher: { '@id': `${SITE}/#organization` },
        image: page.image[language],
        headline: metadata.title.split('|')[0].trim(),
        mainEntityOfPage: canonical,
      } : {}),
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
          url: BRAND_IMAGE,
          contentUrl: BRAND_IMAGE,
          width: 500,
          height: 500,
        },
        image: BRAND_IMAGE,
        slogan: 'Comer Corea · 한국을 먹다',
        description: 'Marca K-Food que conecta sabores de Corea con las mesas cotidianas de Latinoamérica.',
        sameAs: [
          'https://www.instagram.com/mokda_official/',
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
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);
  html = html.replace(/<meta(?:\s+id="[^"]+")?\s+name="description"[\s\S]*?\/\s*>/i, `    <meta name="description" content="${escapeHtml(metadata.description)}" />`);
  if (!/<meta\s+name="robots"(?:\s|>)/i.test(html)) {
    html = html.replace(/<\/head>/i, '    <meta name="robots" content="index, follow, max-image-preview:large" />\n  </head>');
  }
  html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*>/gi, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />\n${alternateLinks(page)}`);
  html = replaceMeta(html, 'property="og:locale"', config.og);
  html = replaceMeta(html, 'property="og:title"', metadata.title);
  html = replaceMeta(html, 'property="og:description"', metadata.description);
  html = replaceMeta(html, 'property="og:url"', canonical);
  if (page.brandImage) {
    html = replaceMeta(html, 'property="og:image"', BRAND_IMAGE);
    html = replaceMeta(html, 'property="og:image:secure_url"', BRAND_IMAGE);
    html = replaceMeta(html, 'property="og:image:type"', 'image/webp');
    html = replaceMeta(html, 'property="og:image:width"', '500');
    html = replaceMeta(html, 'property="og:image:height"', '500');
    html = replaceMeta(html, 'property="og:image:alt"', BRAND_IMAGE_ALT[language]);
    html = replaceMeta(html, 'name="twitter:card"', 'summary');
    html = replaceMeta(html, 'name="twitter:image"', BRAND_IMAGE);
    html = replaceMeta(html, 'name="twitter:image:alt"', BRAND_IMAGE_ALT[language]);
  }
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
  html = html.replace('</head>', '    <noscript><link rel="stylesheet" href="/styles/no-script.css" /></noscript>\n</head>');
  if (page.route === 'contact.html') {
    const notice = { KR: '문의 전송에는 JavaScript가 필요합니다. 브라우저에서 JavaScript를 켠 뒤 이용해주세요.', ES: 'Para enviar tu consulta, activa JavaScript en el navegador.', EN: 'Enable JavaScript in your browser to send an inquiry.' }[language];
    html = html.replace('</form>', `</form><noscript><p class="no-script-notice">${notice}</p></noscript>`);
  }
  if (!html.includes('site-typography.css')) {
    html = html.replace(
      '</head>',
      '    <link rel="stylesheet" href="./styles/site-typography.css?v=20260914-3" />\n  </head>',
    );
  }
  return html;
}

const sitemapUrls = [];

for (const [fileName, page] of Object.entries(pages)) {
  const source = addHelpAssets(await readFile(join(ROOT, fileName), 'utf8'));
  await writeFile(join(ROOT, fileName), secureHtml(source), 'utf8');

  for (const language of Object.keys(languages)) {
    const outputPath = join(ROOT, languages[language].directory, fileName);
    await mkdir(dirname(outputPath), { recursive: true });
    const localized = localizeHtml(source, language, page);
    const rendered = await prerenderContent(localized, ROOT, routeUrl(language, page));
    await writeFile(outputPath, (await externalizeBlocks(rendered, ROOT)).replace(/^[\t ]+$/gm, ''), 'utf8');
    sitemapUrls.push(routeUrl(language, page));
  }
}


function retiredSupportRedirect(directory, language) {
  const home = '/' + directory + '/';
  return '<!doctype html><html lang="' + language + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=' + home + '"><link rel="canonical" href="' + SITE + home + '"><title>MOKDA</title></head><body><a href="' + home + '">MOKDA</a></body></html>\n';
}
await writeFile(join(ROOT, 'support.html'), retiredSupportRedirect('es', 'es-419'), 'utf8');
for (const config of Object.values(languages)) {
  await writeFile(join(ROOT, config.directory, 'support.html'), retiredSupportRedirect(config.directory, config.html), 'utf8');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${LAST_MODIFIED}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;

await writeFile(join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated ${sitemapUrls.length} localized pages and sitemap.xml.`);

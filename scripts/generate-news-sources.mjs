import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export async function generateNewsSources(root) {
  const context = { window: {} };
  runInNewContext(await readFile(join(root, 'site-news-data.js'), 'utf8'), context, { timeout: 2000 });
  const data = context.window.MOKDA_NEWS;
  const template = await readFile(join(root, 'kpeno.html'), 'utf8');
  const pages = {};
  const entries = [{ id: null, image: 'expo-booth' }, ...data.stories];
  for (const story of entries) {
    const filename = story.id ? `news-${story.id}.html` : 'news.html';
    const metadata = {};
    for (const lang of ['ES', 'KR', 'EN']) {
      const text = story.id ? story[lang] : { title: data.copy[lang].title, summary: data.copy[lang].intro };
      metadata[lang] = { title: text.title + ' | MOKDA', description: text.summary };
    }
    pages[filename] = {
      route: filename, type: story.id ? 'Article' : 'CollectionPage', ...metadata,
      image: Object.fromEntries(['ES', 'KR', 'EN'].map(lang => [lang, `https://www.mokda.kr/assets/images/news/${story.image}.webp`])),
      ...(story.id ? { publishedDate: story.publishedDate || data.publishedDate } : {}),
    };
    const esTitle = escapeHtml(metadata.ES.title);
    const esDescription = escapeHtml(metadata.ES.description);
    let html = template
      .replace(/<title>[^<]+<\/title>/, `<title>${esTitle}</title>`)
      .replace(/<meta name="description"[^>]+>/, `<meta name="description" content="${esDescription}" />`)
      .replace(/<link rel="canonical"[^>]+>/, `<link rel="canonical" href="https://www.mokda.kr/es/${filename}" />`)
      .replace(/<body[^>]+>/, `<body class="news-page antialiased"${story.id ? ` data-news-story="${story.id}"` : ''}>`)
      .replace(/<main id="productDetailContent"><\/main>/, '<main id="newsContent"></main>')
      .replace(/styles\/product-detail-pages\.css[^" ]*/, 'styles/site-news.css?v=20261008-rhythm')
      .replace(/<script src="product-detail\.js[^>]+><\/script>/, '<script src="site-news-data.js?v=20261007-editorial"></script>\n    <script src="site-news-model.js?v=20261007-2"></script>\n    <script src="site-news.js?v=20261008-rhythm"></script>');
    html = html.replace('</head>', `    <meta property="og:type" content="${story.id ? 'article' : 'website'}" />
    <meta property="og:title" content="${esTitle}" />
    <meta property="og:description" content="${esDescription}" />
    <meta property="og:url" content="https://www.mokda.kr/es/${filename}" />
    <meta property="og:locale" content="es_419" />
    <meta property="og:image" content="https://www.mokda.kr/assets/images/news/${story.image}.webp" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esTitle}" />
    <meta name="twitter:description" content="${esDescription}" />
    <meta name="twitter:image" content="https://www.mokda.kr/assets/images/news/${story.image}.webp" />
  </head>`);
    await writeFile(join(root, filename), html, 'utf8');
  }
  return pages;
}

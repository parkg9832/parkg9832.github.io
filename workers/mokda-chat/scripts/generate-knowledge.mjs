import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';

// Only published, local website files are read. No private documents or credentials.
const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = fileURLToPath(new URL('../src/knowledge.json', import.meta.url));
const helpSource = await readFile(resolve(root, 'site-help-data.js'), 'utf8');
const newsSource = await readFile(resolve(root, 'site-news-data.js'), 'utf8');
const sandbox = { window: {} };
runInNewContext(helpSource, sandbox, { timeout: 1000 });
runInNewContext(newsSource, sandbox, { timeout: 1000 });
const data = sandbox.window.MOKDA_HELP_DATA;
const news = sandbox.window.MOKDA_NEWS;
const languages = { KR: 'ko', ES: 'es', EN: 'en' };
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const knowledge = {};
const hashes = {};

for (const [language, locale] of Object.entries(languages)) {
  const faqs = data[language].categories.flatMap(category => category.questions.map(question => ({
    id: question.id,
    topic: category.id,
    question: question.question,
    text: question.answer,
    label: question.link.label,
    path: `/${locale}/${question.link.path}`,
  })));
  const docs = [];
  for (const page of ['about.html', 'products.html', 'kpeno.html', 'para-carnes.html', 'qna.html']) {
    const html = await readFile(resolve(root, locale, page), 'utf8');
    hashes[`${locale}/${page}`] = createHash('sha256').update(html).digest('hex');
    const dom = new JSDOM(html);
    const main = dom.window.document.querySelector('main');
    if (!main) throw new Error(`Missing public main: ${locale}/${page}`);
    main.querySelectorAll('script, style, form, nav, button, [hidden], .image-sr-only').forEach(node => node.remove());
    const title = clean(main.querySelector('h1')?.textContent || dom.window.document.title);
    const text = [...main.querySelectorAll('h1,h2,h3,p,li')].map(node => clean(node.textContent)).filter(Boolean).join('\n');
    // Keep products complete and brand/history bounded; never collect DOM form values.
    docs.push({ id: page.replace('.html', ''), title, text: text.slice(0, 4200), path: `/${locale}/${page}` });
    dom.window.close();
  }
  for (const story of news.stories) {
    if (!/^[a-z0-9-]+$/.test(story.id) || !story[language]) throw new Error('Invalid public story');
    const page = `news-${story.id}.html`;
    await readFile(resolve(root, locale, page), 'utf8');
    const copy = story[language];
    docs.push({
      id: `news-${story.id}`,
      title: clean(copy.title),
      text: clean([copy.title, copy.summary, story.eventDate ? `Event date: ${story.eventDate}${story.eventEndDate ? ` – ${story.eventEndDate}` : ''}` : '', story.publishedDate ? `Published: ${story.publishedDate}` : '', ...(copy.sections || []).flat()].join('\n')).slice(0, 3500),
      path: `/${locale}/${page}`,
    });
  }
  for (const source of [...faqs, ...docs]) {
    if (!new RegExp(`^/${locale}/[a-z0-9-]+\\.html(?:\\?(?:purpose=(?:distribution|collaboration)))?(?:#history)?$`).test(source.path)) throw new Error(`Unsafe public source: ${source.path}`);
    await readFile(resolve(root, source.path.replace(/^\//, '').split(/[?#]/)[0]), 'utf8');
  }
  knowledge[language] = { faqs, docs };
}

const payload = {
  generatedAt: '2026-10-11',
  sourceHashes: {
    'site-help-data.js': createHash('sha256').update(helpSource).digest('hex'),
    'site-news-data.js': createHash('sha256').update(newsSource).digest('hex'),
    ...hashes,
  },
  languages: knowledge,
};
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Generated public chatbot knowledge: ${Object.keys(knowledge).length} languages, ${knowledge.KR.docs.length} public documents, ${knowledge.KR.faqs.length} verified answers.`);

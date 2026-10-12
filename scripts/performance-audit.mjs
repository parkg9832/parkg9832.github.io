import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import { loadNews } from './news-store.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://www.mokda.kr';

// Static payload evidence: local bytes and independently gzipped files. This
// does not claim browser timing, cache behavior or third-party transfer sizes.
export async function auditPerformance() {
  const news = (await loadNews(root)).data;
  const names = ['index', 'about', 'products', 'kpeno', 'para-carnes', 'qna', 'contact', 'news', ...news.stories.map(story => 'news-' + story.id)];
  const bytes = new Map();
  async function file(path) {
    if (!bytes.has(path)) bytes.set(path, await readFile(resolve(root, '.' + path)));
    return bytes.get(path);
  }
  async function total(paths, compressed = false) {
    let value = 0;
    for (const path of new Set(paths)) {
      const buffer = await file(path);
      value += compressed ? gzipSync(buffer).length : buffer.length;
    }
    return value;
  }
  const result = [];
  for (const locale of ['ko', 'es', 'en']) for (const name of names) {
    const path = `${locale}/${name}.html`, html = await readFile(resolve(root, path));
    const dom = new JSDOM(html.toString(), { url: `${origin}/${path}` }), d = dom.window.document;
    const local = value => {
      const url = new URL(value, d.baseURI);
      return url.origin === origin ? url.pathname : null;
    };
    const scripts = [...d.querySelectorAll('script[src]')].map(n => local(n.src)).filter(Boolean);
    const styles = [...d.querySelectorAll('link[rel="stylesheet"]')].map(n => local(n.href)).filter(Boolean);
    const images = [...d.images].map(n => ({ path: local(n.src), lazy: n.getAttribute('loading') === 'lazy' })).filter(n => n.path);
    const manifest = d.querySelector('script[data-chat-assets]')?.dataset.chatAssets || '[]';
    const deferred = JSON.parse(manifest).map(local).filter(Boolean);
    result.push({
      path, htmlBytes: html.length, htmlGzipBytes: gzipSync(html).length,
      scriptCount: scripts.length, scriptBytes: await total(scripts), scriptGzipBytes: await total(scripts, true),
      cssBytes: await total(styles), cssGzipBytes: await total(styles, true), eagerImageBytes: await total(images.filter(n => !n.lazy).map(n => n.path)),
      allImageBytes: await total(images.map(n => n.path)),
      deferredChatBytes: await total(deferred), deferredChatGzipBytes: await total(deferred, true),
    });
    dom.window.close();
  }
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const results = await auditPerformance();
  const directory = resolve(root, 'output/performance');
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'after.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify({ pages: results.length, representative: results.filter(n => n.path.startsWith('ko/')) }, null, 2));
}

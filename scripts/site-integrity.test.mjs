import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://www.mokda.kr';
const documents = new Map();
const assets = new Set();
let links = 0;
function readDocument(path) {
  if (!documents.has(path)) documents.set(path, new JSDOM(readFileSync(resolve(root, `.${path}`), 'utf8'), { url: origin + path }));
  return documents.get(path).window.document;
}
for (const lang of ['es', 'ko', 'en']) {
  for (const page of ['index', 'about', 'products', 'kpeno', 'para-carnes', 'qna', 'contact']) {
    const path = `/${lang}/${page}.html`;
    const doc = readDocument(path);
    const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
    assert.equal(new Set(ids).size, ids.length, `${path}: duplicate element IDs`);
    for (const el of doc.querySelectorAll('img,script[src],link[rel="stylesheet"]')) {
      if (el.tagName === 'IMG') assert(el.hasAttribute('alt'), `${path}: missing image description`);
      const url = new URL(el.getAttribute('src') || el.getAttribute('href'), doc.baseURI);
      if (url.origin !== origin) continue;
      const file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
      assert(existsSync(file) && statSync(file).isFile(), `${path}: missing asset ${url.pathname}`);
      assets.add(url.pathname);
    }
    for (const anchor of doc.querySelectorAll('a[href]')) {
      const url = new URL(anchor.getAttribute('href'), doc.baseURI);
      if (url.origin !== origin) continue;
      const destination = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
      assert(existsSync(resolve(root, `.${destination}`)), `${path}: broken link ${url.pathname}`);
      if (url.hash && destination.endsWith('.html')) assert(readDocument(destination).getElementById(decodeURIComponent(url.hash.slice(1))), `${path}: missing destination ${url.pathname}${url.hash}`);
      links++;
    }
  }
}
for (const dom of documents.values()) dom.window.close();
console.log(`Site integrity passed: 21 pages, ${links} internal links, ${assets.size} unique referenced assets, image descriptions and unique IDs.`);

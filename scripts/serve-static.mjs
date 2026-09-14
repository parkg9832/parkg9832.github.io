import { createReadStream } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.argv[2] || 4177);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const parts = pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    if (parts.some(part => part.startsWith('.') || /[:\u0000]/.test(part))) throw new Error('Private path');
    if (parts.length > 1 && !['assets', 'styles', 'ko', 'es', 'en'].includes(parts[0])) throw new Error('Private directory');
    let filePath = resolve(root, parts.join('/') || 'index.html');
    if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
    filePath = await realpath(filePath);
    const withinRoot = relative(await realpath(root), filePath);
    if (withinRoot.startsWith('..') || !mimeTypes[extname(filePath).toLowerCase()]) throw new Error('Private file');
    if (extname(filePath) === '.txt' && parts.join('/') !== 'robots.txt') throw new Error('Private text');
    const fileStat = await stat(filePath);
    response.writeHead(200, {
      'Content-Length': fileStat.size,
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Cache-Control': pathname.startsWith('/assets/generated/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    if (request.method === 'HEAD') { response.end(); return; }
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`MOKDA preview: http://127.0.0.1:${port}`);
});

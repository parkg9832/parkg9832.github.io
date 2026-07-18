import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
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
};

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = normalize(pathname).replace(/^([/\\])+/, '');
  let filePath = join(root, relativePath || 'index.html');

  try {
    if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
    const fileStat = await stat(filePath);
    response.writeHead(200, {
      'Content-Length': fileStat.size,
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`MOKDA preview: http://127.0.0.1:${port}`);
});

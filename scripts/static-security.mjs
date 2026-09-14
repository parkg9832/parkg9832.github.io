import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const hash = value => createHash('sha256').update(value.replace(/\r\n?/g, '\n')).digest('base64');

export function secureHtml(html) {
  html = html.replace(/\s*<meta (?:http-equiv="Content-Security-Policy"|name="referrer")[^>]*>/gi, '');
  const hashes = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => `'sha256-${hash(match[1])}'`);
  const policy = [
    "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-src 'none'",
    "form-action 'none'", // Contact uses fetch; never submit personal data as a GET fallback.
    "script-src 'self' https://www.googletagmanager.com " + [...new Set(hashes)].join(' '),
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Existing responsive style attributes.
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com",
    "connect-src 'self' https://script.google.com https://script.googleusercontent.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com",
  ].join('; ');
  return html.replace(/(<meta\s+charset=[^>]+>)/i, `$1\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`);
}

// Preserve execution/cascade order. Content-addressed files are shared by all
// locales, can be cached independently, and never require a runtime bundler.
export async function externalizeBlocks(html, root) {
  await mkdir(join(root, 'assets', 'generated'), { recursive: true });
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>|<style\b([^>]*)>([\s\S]*?)<\/style>/gi)];
  for (const match of blocks) {
    const script = match[1] !== undefined;
    if (script && /\bsrc=|application\/ld\+json/.test(match[1])) continue;
    if (!script && match[3].trim()) continue;
    const contents = (script ? match[2] : match[4]).replace(/\r\n?/g, '\n').replace(/^[\t ]+$/gm, '').trim() + '\n';
    if (!contents.trim()) continue;
    const extension = script ? 'js' : 'css';
    const digest = createHash('sha256').update(contents).digest('hex').slice(0, 20);
    const path = `assets/generated/${digest}.${extension}`;
    await writeFile(join(root, path), contents, 'utf8');
    html = html.replace(match[0], script ? `<script src="/${path}"></script>` : `<link rel="stylesheet" href="/${path}" />`);
  }
  for (const match of [...html.matchAll(/(?:src|href)="(\.?\/(?!\/)[^"?]+\.(?:js|css))(?:\?[^" ]*)?"/g)]) {
    const path = match[1].replace(/^\.?\//, '');
    const bytes = await readFile(join(root, path));
    const version = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    html = html.replace(match[0], match[0].replace(/="[^"]+"/, `="/${path}?v=${version}"`));
  }
  return secureHtml(html);
}

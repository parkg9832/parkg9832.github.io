import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://www.mokda.kr';
const DOMAIN = 'mokda.kr';
const REQUEST_TIMEOUT_MS = 8000;
const BODY_LIMIT = 1024 * 1024;
const PRIVATE_PATHS = [
  '/.env', '/.git/config', '/workers/mokda-chat/wrangler.jsonc',
  '/apps-script/b2b-lead-automation.gs', '/output/chat-knowledge/intake.json',
  '/docs/WEBSITE_SECURITY_PLAN.md', '/scripts/verify-edge-security.mjs',
];
const SCANNER_PATHS = ['/wp-login.php', '/wp-admin/', '/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php'];
const DNS_TYPES = { A: 1, NS: 2, CNAME: 5, MX: 15, TXT: 16, AAAA: 28, DS: 43, CAA: 257 };
const RECORD_QUERIES = [
  [DOMAIN, 'A'], [DOMAIN, 'AAAA'], [DOMAIN, 'MX'], [DOMAIN, 'TXT'],
  [DOMAIN, 'CAA'], [DOMAIN, 'DS'], [`www.${DOMAIN}`, 'A'],
  [`www.${DOMAIN}`, 'AAAA'], [`www.${DOMAIN}`, 'CNAME'], [`_dmarc.${DOMAIN}`, 'TXT'],
];

// The audit never sends form data, AI prompts, cookies, authorization headers,
// or mutating HTTP methods. Query records are public; TXT/DS contents stay hashed.
async function request(url, options = {}, fetcher = fetch) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetcher(url, {
        ...options, redirect: 'manual', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { 'User-Agent': 'MOKDA-Edge-Verification/1.0', ...options.headers },
      });
      if (attempt === 0 && [502, 503, 504].includes(response.status)) {
        await response.body?.cancel();
        continue;
      }
      return response;
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
}

async function readBounded(response) {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > BODY_LIMIT) throw new Error('response_limit');
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString('utf8');
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

async function mapBounded(items, run, concurrency = 3) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await run(items[index]);
    }
  }));
  return results;
}

function safeFailure(error) {
  return ['TimeoutError', 'AbortError'].includes(error?.name) ? 'timeout' : 'request_failed';
}

export function summarizeHeaders(headers) {
  const policy = headers.get('content-security-policy') || '';
  const permissions = headers.get('permissions-policy') || '';
  return {
    cloudflareResponse: headers.has('cf-ray'),
    server: (headers.get('server') || '').slice(0, 80),
    frameAncestorsNone: /(?:^|[;,]\s*)frame-ancestors\s+'none'\s*(?:[;,]|$)/i.test(policy),
    frameOptionsDeny: /^DENY$/i.test(headers.get('x-frame-options') || ''),
    nosniff: /^nosniff$/i.test(headers.get('x-content-type-options') || ''),
    referrerPolicy: headers.get('referrer-policy') || null,
    disabledBrowserFeatures: ['camera', 'microphone', 'geolocation', 'payment'].every(feature =>
      new RegExp(`(?:^|,)\\s*${feature}\\s*=\\s*\\(\\s*\\)\\s*(?:,|$)`, 'i').test(permissions)),
  };
}

export function headersProtected(headers) {
  return headers.cloudflareResponse && headers.frameAncestorsNone && headers.frameOptionsDeny &&
    headers.nosniff && headers.referrerPolicy === 'strict-origin-when-cross-origin' && headers.disabledBrowserFeatures;
}

export function cloudflareDelegated(nameservers) {
  return Array.isArray(nameservers) && nameservers.length >= 2 &&
    nameservers.every(value => /^[a-z0-9-]+\.ns\.cloudflare\.com\.?$/i.test(value));
}

export function comparePreservedRecords(before, after) {
  const preserve = record => ['MX', 'TXT', 'CAA'].includes(record.type);
  const index = new Map(after.filter(preserve).map(record => [`${record.name}:${record.type}`, record]));
  return before.filter(preserve).map(record => {
    const current = index.get(`${record.name}:${record.type}`);
    const verified = record.status === 0 && current?.status === 0;
    return {
      name: record.name, type: record.type,
      verified,
      unchanged: verified && JSON.stringify(record.records) === JSON.stringify(current.records),
    };
  });
}

async function dnsQuery(name, type, provider, fetcher) {
  const url = new URL(provider === 'google' ? 'https://dns.google/resolve' : 'https://cloudflare-dns.com/dns-query');
  url.searchParams.set('name', name);
  url.searchParams.set('type', type);
  try {
    const response = await request(url, { headers: { Accept: 'application/dns-json' } }, fetcher);
    if (!response.ok) throw new Error('dns_http_error');
    const data = JSON.parse(await readBounded(response));
    const records = (data.Answer || []).filter(answer => answer.type === DNS_TYPES[type])
      .map(answer => String(answer.data));
    return {
      name, type, provider, status: data.Status,
      records: [...new Set(records.map(value => ['TXT', 'DS'].includes(type)
        ? `sha256:${createHash('sha256').update(value).digest('hex')}`
        : value.replace(/\.$/, '')))].sort(),
    };
  } catch (error) {
    return { name, type, provider, status: null, records: [], error: safeFailure(error) };
  }
}

async function auditPath(path, kind, fetcher) {
  try {
    const method = kind === 'unsupported_method' ? 'OPTIONS' : 'GET';
    const response = await request(new URL(path, ORIGIN), { method }, fetcher);
    const headers = summarizeHeaders(response.headers);
    let metaCspPresent = null;
    if (kind === 'page' && response.status === 200) {
      const html = await readBounded(response);
      metaCspPresent = /<meta\b[^>]*http-equiv=["']Content-Security-Policy["']/i.test(html);
    } else {
      await response.body?.cancel();
    }
    return {
      path, kind, method, status: response.status, headers, metaCspPresent,
      pass: kind === 'page' ? response.status === 200 && headersProtected(headers) && metaCspPresent
        : kind === 'public_asset' ? response.status === 200 && headers.cloudflareResponse
          : response.status === 403 && headers.cloudflareResponse,
      // A 404 is safe origin non-publication, but does not prove the WAF rule ran.
      notPublic: ['private_path', 'scanner_path'].includes(kind) ? [403, 404, 410].includes(response.status) : null,
    };
  } catch (error) {
    return { path, kind, pass: false, error: safeFailure(error) };
  }
}

async function auditHttpsRedirect(fetcher) {
  try {
    const response = await request(`http://www.${DOMAIN}/ko/`, { method: 'HEAD' }, fetcher);
    await response.body?.cancel();
    const location = response.headers.get('location');
    const target = location ? new URL(location, `http://www.${DOMAIN}/ko/`) : null;
    return {
      status: response.status,
      httpsSameHost: target?.protocol === 'https:' && target.hostname === `www.${DOMAIN}`,
      pass: [301, 302, 307, 308].includes(response.status) &&
        target?.protocol === 'https:' && target.hostname === `www.${DOMAIN}`,
    };
  } catch (error) {
    return { pass: false, error: safeFailure(error) };
  }
}

export async function auditEdge({ fetcher = fetch, baseline = null } = {}) {
  const [delegation, records, paths, redirect] = await Promise.all([
    mapBounded(['cloudflare', 'google'], provider => dnsQuery(DOMAIN, 'NS', provider, fetcher)),
    mapBounded(RECORD_QUERIES, ([name, type]) => dnsQuery(name, type, 'cloudflare', fetcher)),
    mapBounded([
      ...['/ko/', '/es/', '/en/'].map(path => [path, 'page']),
      ...['/robots.txt', '/sitemap.xml'].map(path => [path, 'public_asset']),
      ...PRIVATE_PATHS.map(path => [path, 'private_path']),
      ...SCANNER_PATHS.map(path => [path, 'scanner_path']),
      ['/ko/', 'unsupported_method'],
    ], ([path, kind]) => auditPath(path, kind, fetcher)),
    auditHttpsRedirect(fetcher),
  ]);
  const dnsActive = delegation.every(query => query.status === 0 && cloudflareDelegated(query.records));
  const preservation = baseline ? comparePreservedRecords(baseline.dns?.records || [], records) : null;
  const preservationVerified = preservation !== null && preservation.length === 4 &&
    preservation.every(record => record.verified && record.unchanged);
  const failed = paths.filter(result => !result.pass).map(result => `${result.kind}:${result.path}`);
  return {
    checkedAt: new Date().toISOString(), origin: ORIGIN,
    verified: dnsActive && redirect.pass && failed.length === 0 && preservationVerified,
    frontDoorVerified: dnsActive && redirect.pass && failed.length === 0,
    dns: { delegatedToCloudflare: dnsActive, delegation, records, preservation, preservationVerified },
    httpsRedirect: redirect, requests: paths,
    failures: [
      ...(!dnsActive ? ['cloudflare_dns_delegation'] : []),
      ...(!redirect.pass ? ['http_to_https_redirect'] : []), ...failed,
      ...(!preservationVerified ? ['baseline_mail_and_verification_record_comparison'] : []),
    ],
    notVerifiedByThisScript: [
      'Complete registrar DNS inventory, including custom DKIM selectors and service subdomains',
      'Cloudflare dashboard zone status, active rules and Full (strict) origin mode',
      'Origin bypass resistance, server token validation and AI/inquiry anti-abuse flow',
      'GitHub, Google and Cloudflare account MFA enrollment and recovery settings',
      'Browser behavior, CSP console errors, analytics and real form delivery',
    ],
  };
}

async function main() {
  const args = process.argv.slice(2);
  const inspectOnly = args.includes('--baseline');
  const option = name => {
    const index = args.indexOf(name);
    if (index < 0) return null;
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`);
    return value;
  };
  const accepted = new Set(['--baseline', '--compare', '--output']);
  for (let index = 0; index < args.length; index++) {
    if (!accepted.has(args[index])) throw new Error(`Unknown argument: ${args[index]}`);
    if (args[index] !== '--baseline') index++;
  }
  const compare = option('--compare');
  const baseline = compare ? JSON.parse(await readFile(resolve(compare), 'utf8')) : null;
  if (baseline && baseline.origin !== ORIGIN) throw new Error('Baseline origin does not match MOKDA');
  const report = await auditEdge({ baseline });
  const output = option('--output');
  if (output) {
    const destination = resolve(output);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }
  console.log(JSON.stringify({
    mode: inspectOnly ? 'baseline_observation' : 'verification',
    checkedAt: report.checkedAt,
    verified: report.verified, frontDoorVerified: report.frontDoorVerified,
    cloudflareDns: report.dns.delegatedToCloudflare,
    dnsPreservation: report.dns.preservationVerified,
    requests: report.requests.length,
    nonPublicPaths: report.requests.filter(result => result.notPublic === true).length,
    failures: report.failures,
    ...(output ? { report: output } : {}),
  }, null, 2));
  if (!inspectOnly && !report.verified) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    console.error('Edge security verification failed; no credentials or response bodies were logged. Check arguments and network access.');
    process.exitCode = 1;
  });
}

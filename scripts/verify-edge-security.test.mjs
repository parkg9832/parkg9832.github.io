import assert from 'node:assert/strict';
import { auditEdge, cloudflareDelegated, comparePreservedRecords, headersProtected, summarizeHeaders } from './verify-edge-security.mjs';

const secureHeaders = {
  'cf-ray': 'test', server: 'cloudflare',
  'content-security-policy': "frame-ancestors 'none'",
  'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};
assert.equal(headersProtected(summarizeHeaders(new Headers(secureHeaders))), true);
assert.equal(headersProtected(summarizeHeaders(new Headers({ ...secureHeaders, 'content-security-policy': "frame-ancestors 'none' https://example.com" }))), false);
assert.equal(headersProtected(summarizeHeaders(new Headers({ ...secureHeaders, 'content-security-policy': "script-src 'self', frame-ancestors 'none'" }))), true);
assert.equal(headersProtected(summarizeHeaders(new Headers({ ...secureHeaders, 'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(self)' }))), false);
assert.equal(cloudflareDelegated(['one.ns.cloudflare.com', 'two.ns.cloudflare.com']), true);
assert.equal(cloudflareDelegated(['one.ns.cloudflare.com', 'ns1.cafe24.com']), false);
assert.equal(cloudflareDelegated(['one.ns.cloudflare.com.attacker.test', 'two.ns.cloudflare.com']), false);

const before = [{ name: 'mokda.kr', type: 'TXT', status: 0, records: ['sha256:before'] }];
assert.equal(comparePreservedRecords(before, before)[0].unchanged, true);
assert.equal(comparePreservedRecords(before, [{ ...before[0], records: ['sha256:after'] }])[0].unchanged, false);
assert.equal(comparePreservedRecords(before, [{ ...before[0], status: null }])[0].verified, false);

function fixture({ block = true, meta = true, delegation = true, redirect = true, mail = '15 mail.example.com.' } = {}) {
  const calls = [];
  const fetcher = async (raw, options) => {
    const url = new URL(raw);
    calls.push({ url: url.href, method: options.method || 'GET' });
    assert.ok(['GET', 'HEAD', 'OPTIONS'].includes(options.method || 'GET'), 'Audit must remain read-only');
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.body, undefined);
    if (url.hostname === 'dns.google' || url.hostname === 'cloudflare-dns.com') {
      const type = url.searchParams.get('type');
      const name = url.searchParams.get('name');
      const numeric = { NS: 2, MX: 15, TXT: 16, A: 1, AAAA: 28, CNAME: 5, DS: 43, CAA: 257 }[type];
      const records = type === 'NS' ? delegation ? ['one.ns.cloudflare.com.', 'two.ns.cloudflare.com.'] : ['ns1.cafe24.com.', 'ns2.cafe24.com.']
        : type === 'MX' ? [mail] : type === 'TXT' ? [`private-verification-value:${name}`] : [];
      return new Response(JSON.stringify({ Status: 0, Answer: records.map(data => ({ type: numeric, data })) }));
    }
    assert.equal(url.hostname, 'www.mokda.kr');
    if (url.protocol === 'http:') return new Response(null, { status: 301, headers: { location: `${redirect ? 'https://www.mokda.kr' : 'https://attacker.test'}${url.pathname}` } });
    if (options.method === 'OPTIONS' || !['/ko/', '/es/', '/en/', '/robots.txt', '/sitemap.xml'].includes(url.pathname)) {
      return new Response(null, { status: block ? 403 : 404, headers: secureHeaders });
    }
    return new Response(meta ? '<meta http-equiv="Content-Security-Policy" content="script-src &#39;self&#39;">' : '<html></html>', { headers: secureHeaders });
  };
  return { calls, fetcher };
}

const initial = fixture();
const baseline = await auditEdge({ fetcher: initial.fetcher });
assert.equal(baseline.frontDoorVerified, true);
assert.equal(baseline.verified, false, 'No mail baseline comparison must not pass full verification');
assert.ok(!JSON.stringify(baseline).includes('private-verification-value'), 'Do not print TXT tokens');
const verified = await auditEdge({ fetcher: fixture().fetcher, baseline });
assert.equal(verified.verified, true);
assert.equal(verified.dns.preservationVerified, true);
const missingWaf = await auditEdge({ fetcher: fixture({ block: false }).fetcher, baseline });
assert.equal(missingWaf.verified, false, 'Safe origin 404 must not be described as verified WAF blocking');
assert.equal(missingWaf.requests.filter(request => request.notPublic).length, 10);
assert.equal((await auditEdge({ fetcher: fixture({ meta: false }).fetcher, baseline })).verified, false, 'Preserve existing source CSP');
assert.equal((await auditEdge({ fetcher: fixture({ delegation: false }).fetcher, baseline })).verified, false, 'cf-ray alone is not domain delegation');
assert.equal((await auditEdge({ fetcher: fixture({ redirect: false }).fetcher, baseline })).verified, false, 'Reject redirects away from official host');
assert.equal((await auditEdge({ fetcher: fixture({ mail: '15 different-mail.example.com.' }).fetcher, baseline })).verified, false, 'Detect altered mail DNS');
console.log('Edge verification: security headers, DNS preservation, WAF evidence, read-only requests and redaction passed.');

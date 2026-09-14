# MOKDA security and delivery review — 2026-09-14

## Scope and deployment boundary

Reviewed the static website, browser scripts, development preview server, Apps Script inquiry/analytics receiver, and installed dependencies. This is a defensive code review and local browser verification, not a claim that the site cannot be compromised. No attack traffic or test inquiries were sent to the live backend.

The public site uses static HTML; Next.js is a separate development scaffold. GitHub Pages publishing and the Apps Script web-app deployment are independent. **The existing inquiry deployment was updated from version 41 to version 42 on 2026-09-14.** Authenticated clasp access located the existing project. Remote source was compared and backed up locally before updating; the manifest, Script Properties, public URL and access settings were preserved. Deployment listing confirms version 42. Live checks confirmed minimal health output, anonymous management rejection, invalid payload rejection, and analytics verification returning `saved:0`. Formula escaping and quota boundaries were verified with mocked service tests, not by storing malicious live leads or exhausting production limits. No test email was sent.

## Findings and fixes

| ID | Severity | Evidence before change | Fix / status |
| --- | --- | --- | --- |
| SEC-01 | High | `apps-script/b2b-lead-automation.gs`, `doGet`: anonymous `mode=update_dashboard` invoked `updateCompleteWebsiteDashboard_()` | Public GET now only returns minimal health status; management and retired support modes reject requests. Editor/trigger functions and historical data remain. Deployed in version 42. |
| SEC-02 | High | `appendLead`: `sheet.appendRow(row)` stored untrusted inquiry and translated strings verbatim | Every lead cell passes `safeSheetCell_`; leading spreadsheet formula markers, including after whitespace, are escaped. Existing analytics sanitizer retained. Deployed in version 42. |
| SEC-03 | Medium | `parsePayload` / `validatePayload`: no body or field length cap; translation and notification work could be repeatedly triggered | 32KB body cap, scalar string validation, per-field limits, allowed languages, 20-event batch cap, locked cache quota reservations, 10-minute content receipts. Limits: 30 inquiries/minute globally, 5/contact/hour, 120 analytics batches/minute. Cache is best-effort and contact identity is client supplied; this is not bot authentication or DDoS protection. |
| SEC-04 | Medium | Public health exposed integration readiness and sheet dimensions; failed POST returned raw exceptions and notification details | Minimal public response; generic failure; no integration payload returned. Server logs do not print incoming inquiry content in the new error path. |
| SEC-05 | Medium, defense in depth | Static entrypoints lacked a script execution policy | Generated early CSP; no inline script attributes or eval allowed; trusted external scripts and hashes for remaining inline blocks. Object/frame embedding disabled; native form submission disabled so JS failure cannot send personal fields in a GET URL. CSS inline styles remain allowed for existing responsive styles. No demonstrated DOM-XSS exploit was found in the reviewed active paths. |
| SEC-06 | Medium, local development | Preview server could serve development files; malformed URL decoding occurred outside error handling | Public directories/extensions only, dotfile/private directory denial, resolved-path containment, safe error responses, GET/HEAD only. Preview headers include nosniff and frame denial. |
| SEC-07 | Low | Contact/analytics sent full current URL; contact had unlimited request wait and no explicit in-flight guard | Origin/path only, input length bounds, 25-second timeout, in-flight guard, preserve form content on failure; conversion event requires saved:true and is not repeated for a cached duplicate. |
| SEC-08 | Dependency risk | npm audit reported 7 vulnerable packages including Next.js; not evidence of an exposed Next server | Compatible updates in lockfile; Next 16.3.5, PostCSS 8.5.23. npm audit after update: 0 known vulnerabilities at check time. Typecheck and Next production build passed. |

## Lightweight refactor

Executable inline scripts and inline stylesheet blocks are emitted to content-addressed files shared across language routes, preserving execution and cascade order. Existing first-party JS/CSS references receive content hashes for cache invalidation. No browser framework or security SDK was added. Two unused homepage scripts and retired announcement CSS are no longer loaded.

Korean HTML file sizes (uncompressed document bytes; extracted JS/CSS are still fetched on a cold visit):

| Page | Before | After |
| --- | ---: | ---: |
| Home | 95,127 | 28,493 |
| About | 42,662 | 18,136 |
| Products | 25,907 | 18,144 |
| Questions | 26,600 | 13,535 |
| Contact | 32,468 | 17,199 |

About prototype image: original PNG 1,736,127 bytes → 480px WebP 41,950 bytes, about 97.6% smaller. Original artwork is preserved locally. HTML size reduction is not presented as an equivalent total page-load speed improvement.

## Validation

- `npm run generate:i18n`: 15 localized pages plus redirects/sitemap.
- `npm run test:security`: mocked public endpoint, input bounds, spreadsheet formula, duplicate receipt, quota, CSP, private path and malformed URL cases.
- `npm run test:analytics`: 14 existing scenarios, with URL privacy expectation updated.
- `npm run test:support-preview`: passed.
- `npm run typecheck`, `npm run build`: passed after dependency updates.
- Browser verification: 30 combinations (five pages × three languages × 390px/1280px). No horizontal overflow, broken visible images, JavaScript errors, or CSP violations. Mocked form success/failure and double submission passed; injected inline script was blocked. No local analytics submissions occurred.

## Hosting and operational follow-up

- `_config.yml` excludes operational/development files from branch-based GitHub Pages/Jekyll output. This does **not** make files or history in a public GitHub repository private. Do not put credentials or customer exports in Git.
- `.gitignore` excludes environment credentials, private-key files, clasp credentials/mapping and local QA output.
- Production clickjacking protection (`frame-ancestors`) must be an HTTP header at the hosting/CDN layer; HTML meta CSP cannot provide it. Preview headers are not proof of production headers. No DNS/CDN configuration or account permissions were changed.
- For stronger abuse resistance, place inquiry handling behind a server/edge gateway with server-verified bot challenges, IP-aware rate limiting, and credential-protected administrative routes. The current public Apps Script URL must never be treated as a secret. Traffic-based controls can be enabled separately without adding a heavy frontend bundle.
- Keep notification credentials only in Apps Script Script Properties; limit spreadsheet access to intended operators. Account access and incident history were not audited.

References: [Apps Script deployments](https://developers.google.com/apps-script/concepts/deployments), [CSP frame-ancestors limitations](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors), [CSP guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

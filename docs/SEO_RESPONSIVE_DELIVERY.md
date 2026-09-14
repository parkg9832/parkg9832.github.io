# SEO, inquiry and responsive delivery — 2026-09-14

## Behavior

- All 15 language/page routes now contain their existing reviewed headings, product text, FAQ answers, timeline and footer links in the initial HTML. Build-only jsdom runs an explicit set of repository render scripts without fetching resources, running analytics, or submitting forms. The original route head and metadata remain authoritative. Existing browser rendering and motion remain in place.
- The homepage enhancement is safe to rerun over pre-rendered content: the lineup introduction is reused and the reviews section is replaced instead of duplicated.
- Without JavaScript, content remains readable and the inquiry page explains that scripting is required; an unusable submit control is hidden.
- Company is optional in both the form and Apps Script deployment version 43. Existing business fields and hero text remain; the form also offers a general inquiry category and neutral submit copy in all three languages. Contact method, name, country and message validation remain required.
- Q&A groups each question and answer in a softly bordered light card. Wide screens pair question and answer side by side; narrower screens stack them. On phones the answer spans the full card, avoiding a narrow column beside the number. All five answers remain visible while scrolling without accordion buttons.
- Typography prefers complete words and balanced headings. Footer columns reserve more width for the registration number, which stays on one line.
- The single homepage hero uses clipping without an internal scroll container, so bringing the edge artwork into view cannot shift the title off-screen. Changed shared assets use a new cache version.

## Validation

- `test:seo`: 15 initial HTML documents, nonempty H1 and body content, crawlable footer, two active product cards, five FAQ answers, populated form options, no serialized observer-binding flags.
- `test:security`: formula escaping, bounded payloads, request quotas, duplicate receipt, company-optional consumer, missing-contact rejection and existing CSP/private-path regressions.
- `test:analytics` and TypeScript checks pass. Dependency audit reports no known vulnerabilities at verification time.
- The final viewport matrix passes 150 checks: 3 languages, 5 pages, and widths 320, 360, 390, 430, 768, 844 (landscape), 1024, 1280, 1440 and 1920. Checks include text clipping, container bounds, overflow, visible image loading, script errors and CSP. Screenshots were visually reviewed, including Q&A mobile and desktop. Form failure and success checks use mocked responses. JavaScript-disabled checks cover all 15 routes. No actual test lead or notification is created.
- Browser artifacts and the full viewport matrix are kept under ignored local `output/`; no visitor-level or customer data is published.

The browser receives no jsdom or new framework bundle. Korean HTML gzip size increases by about 0.9–2.9 KB per document to include the previously runtime-only copy. This is not a claim of improved real-user Core Web Vitals. Search Console indexing/ranking and GA4 account configuration still require separate account-side verification.

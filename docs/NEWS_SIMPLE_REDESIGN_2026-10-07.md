# MOKDA news simplification — 2026-10-07

The previous home news section was taller than the product section and repeated summaries, metadata and read-more controls. This revision keeps the homepage focused on products and moves the growing archive into its own page.

## Design decisions

- Actual homepage references inspected: https://www.graza.co/ and https://flybyjing.com/. Their product-first hierarchy and compact lower-page photo collections informed the revision. Superdesign's external extraction was attempted twice but returned no design/content files; no generated design is claimed.
- Home order: products, origin/proof, reviews, news, FAQ. News shows three equal 16:9 photo cards with short titles and one archive link. Each entire card is one accessible link. No summaries, dates, card-footer buttons, duplicate creator collection or new animation on home.
- Keep the approved founder/booth Expo photograph and sauce-holding KPOP group photograph. The KPOP detail retains the stage-to-audience photograph. The KOTRA article uses the own-brand booth photograph, explicitly captioned as an archive photograph.
- The archive retains category filtering, search, pagination and full story headlines. Cards have a light paper surface, category/date and headline only.
- Details retain factual paragraphs, sources, natural photograph proportions and inline native video playback. Repeated subsection headings, copy-link controls and generic promotion blocks were removed.
- Mobile home cards use a manually scrollable row. The existing creator conveyor remains in the collaboration detail, with pause and direction controls.

## Verification

All nine actual browser combinations (ES/KO/EN at 320, 768 and 1440 px) had no page overflow, four home-news links and zero home-news video elements. Desktop news height is 508 px; the previous Spanish news section was 1,411 px (64% reduction). Current Spanish product section remains 1,123 px. Mobile news measures 385–404 px at 320 px, with products 1,326–1,422 px.

Actual browser interactions verified: home archive link, category filtering, KOTRA search with two visible results, horizontal home scrolling (scrollLeft 286 px), native creator playback (91.23 s duration, currentTime 26.42 s, readyState 4), and close removing the player. Desktop home/archive/KPOP detail and mobile English home/archive/creators were visually inspected.

Local checks passed: generation of 42 localized pages, news, news-manager, analytics (14 scenarios), typecheck, SEO, integrity (609 internal links / 86 referenced assets), navigation and security. SEO assertions now check complete story links/headlines and every factual paragraph instead of an arbitrary text-length quota for concise news pages.

Browser evidence is in ignored `output/playwright/news-simple-redesign/`, including measurements.json and screenshots. Existing unrelated changes to the project harness and inactive experimental motion files are excluded from this release.

# News archive rows — 2026-10-08

The news archive now presents each story as a horizontal row with a small photo, category/date, full headline and an article arrow. This makes the growing archive easier to scan without changing article content.

## Scope

- `site-news.js`: archive-only renderer; existing search, sorting, pagination and links retained.
- `styles/site-news.css`: row styles scoped to `.news-listing`.
- `scripts/generate-news-sources.mjs`: refreshed news CSS/JS cache versions.
- Generated ES/KR/EN news pages and home cache references.
- The home news cards and article main/header/footer markup remain identical to the previous release (63 regions across 21 localized pages).

## Visual checks

- Actual ES/KR/EN archive pages checked at desktop and 390px mobile widths.
- Thumbnails: 172 × 104px on desktop, 96 × 76px on mobile, 80 × 68px at 320px.
- No horizontal overflow at 320px or 390px; full headlines and accessible link names retained.
- Page introduction stays centered; article rows are left aligned for reading.
- Search for KOTRA returns two rows; clearing search restores six.
- Article link and back navigation checked; no browser console errors.

## Validation

- `npm run generate:i18n`: 42 localized pages generated.
- `npm run test:analytics`: 14 scenarios passed.
- `npm run typecheck`: passed.
- `npm run test:news`: archive growth, search/history, home selections, inline video and controls passed.
- `npm run test:news-manager`: isolated authoring/media/security checks passed.
- `npm run test:seo`, `npm run test:navigation`: passed.
- `npm run test:integrity`: 597 links and 85 assets passed.

Canvas: https://p.superdesign.dev/draft/96f297c0-3188-4252-a4f6-b522d9d05bf4 (v2).
Local screenshots and DOM measurements are saved under ignored `output/playwright/news-archive/`.

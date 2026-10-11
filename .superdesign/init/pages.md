# Repository UI context

Analyzed 2026-10-11 from the current working tree. Public production UI is static HTML plus shared vanilla-JavaScript widgets generated into /ko, /es and /en. Next.js/React files coexist but do not render the deployed static chatbot. Read canonical MOKDA_HARNESS.md and the nearest AGENTS.md before implementing.

## Static dependency semantics

Vanilla scripts communicate through `window.MOKDA_*` globals instead of ES imports. Trees therefore include actual local script/style links and known runtime global dependencies. Navigation hrefs are destinations, not bundled dependencies. Inline root-page rendering/CSS stays in the entry HTML and is externalized by the generator. Images are content dependencies; the authentic logo is explicitly included for the messenger target. The generator and security/prerender modules are build-time dependencies shared by these entries.

## Shared messenger target (all public routes)

Entry: `site-help.js`

- `site-help.js`
  - `site-i18n.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `styles/site-help.css`
  - `assets/images/mokda-logo-main.webp`

Implementation entrypoints and test coverage: `scripts/help-regression.test.mjs`, `scripts/chat-intents.test.mjs`, `scripts/generate-localized-pages.mjs`. Candidate generation bundle: design-system.md + the compact theme token summary + site-help.js + styles/site-help.css + only the relevant localized slice of site-help-data.js. Do not send giant layouts.md or the entire homepage as chatbot context unless reproducing surrounding page chrome.

## `/es/` (also /ko and /en)

Entry: `index.html`

- `index.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/site-news.css`
  - `styles/home-layout.css`
  - `styles/home-experience.css`
  - `styles/product-experience.css`
  - `styles/home-reading.css`
  - `styles/brand-rhythm.css`
  - `styles/home-history.css`
  - `styles/home-motion.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `b2b-config.js`
  - `site-contact-config.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `site-reviews-data.js`
  - `home-experience.js`
    - `site-reviews-data.js`
  - `site-news-data.js`
  - `site-news-model.js`
  - `site-news.js`
    - `site-i18n.js`
    - `site-news-model.js`
    - `site-news-data.js`
  - `brand-motion.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/about.html` (also /ko and /en)

Entry: `about.html`

- `about.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/brand-rhythm.css`
  - `styles/about-experience.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/products.html` (also /ko and /en)

Entry: `products.html`

- `products.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/product-experience.css`
  - `styles/home-reading.css`
  - `styles/brand-rhythm.css`
  - `styles/product-layout.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `site-product-media.js`
    - `site-i18n.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/kpeno.html` (also /ko and /en)

Entry: `kpeno.html`

- `kpeno.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/product-detail-pages.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `product-detail.js`
    - `site-i18n.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/para-carnes.html` (also /ko and /en)

Entry: `para-carnes.html`

- `para-carnes.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/product-detail-pages.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `product-detail.js`
    - `site-i18n.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/qna.html` (also /ko and /en)

Entry: `qna.html`

- `qna.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/brand-rhythm.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/contact.html` (also /ko and /en)

Entry: `contact.html`

- `contact.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `b2b-config.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/news.html` (also /ko and /en)

Entry: `news.html`

- `news.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/site-news.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `site-news-data.js`
  - `site-news-model.js`
  - `site-news.js`
    - `site-i18n.js`
    - `site-news-model.js`
    - `site-news-data.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/es/news-expoalimentaria-2026.html` (also /ko and /en)

Entry: `news-expoalimentaria-2026.html`

- `news-expoalimentaria-2026.html`
  - `assets/mokda-tailwind.css`
  - `styles/site-typography.css`
  - `styles/site-news.css`
  - `styles/site-motion.css`
  - `styles/site-help.css`
  - `site-i18n.js`
  - `site-footer.js`
    - `site-i18n.js`
  - `site-news-data.js`
  - `site-news-model.js`
  - `site-news.js`
    - `site-i18n.js`
    - `site-news-model.js`
    - `site-news-data.js`
  - `site-header.js`
    - `site-i18n.js`
    - `site-analytics.js`
  - `brand-motion.js`
  - `site-contact-config.js`
  - `site-help-data.js`
  - `site-chat-intents.js`
  - `site-help.js`
    - `site-i18n.js`
    - `site-contact-config.js`
    - `site-help-data.js`
    - `site-chat-intents.js`
    - `styles/site-help.css`
    - `assets/images/mokda-logo-main.webp`

## `/about` (parallel React app)

Entry: `app/about/page.tsx`; inherited layout: `app/layout.tsx`.

- `app/layout.tsx`
  - `app/globals.css`
- `app/about/page.tsx`
  - `components/about/AboutContact.tsx`
  - `components/about/AboutFeatures.tsx`
  - `components/about/AboutHero.tsx`
  - `components/about/BrandStory.tsx`
  - `components/product/ProductShowcase.tsx`
    - `components/product/ProductCard.tsx`
      - `components/product/ProductShowcase.tsx` (already listed; type/runtime cycle)

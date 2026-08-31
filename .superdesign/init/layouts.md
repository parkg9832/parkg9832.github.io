# Shared layouts

## Public site shell

- Header source: `site-header.js`
- Footer source: `site-footer.js`
- Locale routing source: `site-i18n.js`
- Page shell: each root HTML template, with localized pages generated into `/es`, `/ko`, and `/en`.

The header injects a sticky global navigation with the real MOKDA logo, desktop and mobile navigation, announcement bar, and language selector. The footer injects social, legal, company, and locale-aware navigation content. The About page source contains the full page shell and all section markup; the design call must receive those real files as source context.

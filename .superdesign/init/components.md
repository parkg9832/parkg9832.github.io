# Shared UI components

MOKDA's public website is a static HTML site generated into localized `/es`, `/ko`, and `/en` routes. Page sections and simple primitives are authored inline with Tailwind utility classes, so there is no separate Button/Card component library for the About page.

The shared runtime UI is provided by:

- `site-header.js` — inserts the global announcement bar, desktop header, mobile menu, locale selector, and skip link.
- `site-footer.js` — renders the localized legal/footer links and company information.
- `site-i18n.js` — locale detection and route navigation.

For design generation, use the real source files above together with `about.html` instead of fabricating component abstractions.

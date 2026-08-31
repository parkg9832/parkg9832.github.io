# Extractable components

## GlobalHeader

- Source: `site-header.js`
- Category: layout
- Description: Sticky MOKDA header with announcement bar, real logo, desktop/mobile navigation, and locale selector.
- Extractable props: active route, current locale.
- Hardcoded: menu structure, logo source, colors, typography, breakpoints.

## GlobalFooter

- Source: `site-footer.js`
- Category: layout
- Description: Locale-aware company, legal, social, and navigation footer.
- Extractable props: current locale.
- Hardcoded: company/legal labels and route structure.

The current About redesign does not need these converted to canvas components; the source context preserves the existing shell while the page body is explored.

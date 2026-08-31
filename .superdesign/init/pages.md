# Page dependency trees

## `/es/about.html` — About MOKDA

Entry: `about.html`

Dependencies:

- `site-header.js`
  - `site-announcement.js`
  - `site-i18n.js`
- `site-footer.js`
- `site-i18n.js`
- `site-analytics.js`
- `assets/mokda-tailwind.css`
- `tailwind.config.ts`
- `assets/images/mokda-logo-main.webp`
- `assets/images/brand-story-seoul-kfood-table.webp`
- `assets/images/field-chili-720.webp`
- `assets/images/field-chili-1080.webp`

Rendered sections: brand hero, founder-led brand story, vision/mission/essence, logo identity, brand colors, company history, shared footer.

## `/es/products.html` — Salsa Coreana

Entry: `products.html`

Dependencies: shared header/footer/i18n/analytics scripts, generated Tailwind CSS, product imagery, testimonial imagery.

## `/es/` — Home

Entry: `index.html`

Dependencies: shared header/footer/i18n/analytics scripts, generated Tailwind CSS, brand and product imagery.

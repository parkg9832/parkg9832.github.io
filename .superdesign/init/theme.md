# Theme context

## Part 1 — Compact actual token summary

Analyzed 2026-10-11. This summary describes current code; the requested chat-only direction follows below.

| Role | Actual value |
|---|---|
| Web orange | #ef5f18 |
| Web brown/text | #321506 |
| Web cream body | #fff8ef |
| Warm sand | #f8dfc4 / #f7ddc2 |
| Tailwind green | #02674f |
| Body font | Noto Sans → Noto Sans KR → ui-sans-serif/system |
| Korean body font | Noto Sans KR → Noto Sans → ui-sans-serif/system |
| Latin display | Archivo Black |
| Label display | Bebas Neue |
| Normal body | 16px, 1.75, 0 tracking |
| Input text | 16px, 1.5, 0 tracking |
| Current chat header | 18px/700/1.4 |
| Current chat choices | 14px/600/1.5, ≥44px touch target |
| Current chat composer | ≥48px, send 48×48 |
| Current launch button | 60×60 desktop / 56×56 mobile |
| Common spacing grid | 4/8/12/16/20/24/32px (Tailwind default + role CSS) |
| Current chat radius | 20px panel, 14px bubbles, 12px composer/chips, circle launcher |
| Current chat shadow | 0 14px 55px #3215062e |
| Tailwind responsive defaults | sm640, md768, lg1024, xl1280, 2xl1536 |
| Current widget compact threshold | 479px; short-height special case 500px |

There is no dark-mode token set or theme provider. Color and typographic role values are explicit in static CSS.

## Current target: shared MOKDA messenger

The user explicitly asks for an advanced, natural conversational chatbot and designer-quality desktop/mobile UI, references inspected visually, animations, and verified commit/deployment. For this widget only, the user allows a neutral charcoal/white/slate visual system instead of the orange/cream brand palette. Preserve the existing website and the authentic MOKDA logo. Desktop target: approximately 400 × 650 px rounded floating messenger. Mobile target: full-screen app-style chat with a stable composer above the software keyboard. Distinguish automated responses from a human team; no fabricated online/typing-human status. Existing product/availability facts and the single official WhatsApp configuration stay authoritative.

## Proposed widget-only palette and sizing

These are design direction targets, not already-implemented tokens: white #ffffff surface; slate #f3f5f8 conversation ground; charcoal #20252d primary/user bubble/launcher; text #1f2937; muted #64748b; borders #e2e8f0. Use 24–28px desktop panel radius and a layered soft neutral shadow. Keep input/body16px and existing Noto fonts; UI chips14px and44px controls. Use small controlled entrance/exit and bubble/typing motion; respect prefers-reduced-motion and never fake a human presence. For mobile, use visual viewport height/top and safe areas, fixed header/composer, scrollable messages and full-screen panel. The existing `.superdesign/design-system.md` governs the rest of the website and is intentionally not overwritten; this target-specific user instruction takes precedence for the chat palette and messenger composition.

## Part 2 — Complete raw theme sources

### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './*.html',
    './site-*.js',
  ],
  theme: {
    extend: {
      colors: {
        mokdaOrange: '#ef5f18',
        mokdaGreen: '#02674f',
        mokdaCream: '#f7ddc2',
        mokdaBrown: '#321506',
      },
    },
  },
  plugins: [],
};

export default config;
```

### `styles/static-tailwind.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `styles/site-typography.css`

```css
:root {
  --mokda-font-body: 'Noto Sans', 'Noto Sans KR', ui-sans-serif, system-ui, sans-serif;
  --mokda-font-display-latin: 'Archivo Black', 'Noto Sans', 'Noto Sans KR', sans-serif;
  --mokda-font-display-korean: 'Noto Sans KR', 'Noto Sans', sans-serif;
  --mokda-type-page-title: clamp(3.25rem, 7vw, 7rem);
  --mokda-type-section-title: clamp(2.75rem, 5vw, 5.25rem);
  --mokda-type-feature-title: clamp(3.25rem, 6.5vw, 6rem);
  --mokda-type-card-title: clamp(2rem, 3.5vw, 3.5rem);
  --mokda-type-label: 0.75rem;
  --mokda-type-body: 1rem;
  --mokda-type-body-small: 0.875rem;
  --mokda-type-meta: 0.8125rem;
  --mokda-leading-display: 1.12;
  --mokda-leading-korean-display: 1.18;
  --mokda-leading-body: 1.75;
  --mokda-tracking-label: 0.08em;
}

html[lang^="ko"] {
  --mokda-font-body: 'Noto Sans KR', 'Noto Sans', ui-sans-serif, system-ui, sans-serif;
}

body:not(.support-page) {
  font-family: var(--mokda-font-body);
  font-size: 1rem;
  line-height: var(--mokda-leading-body);
  letter-spacing: 0;
}

/* Prefer complete Korean words and balanced headings across route widths. */
main :is(h1,h2,h3), #footerText :is(dt,dd) { word-break:keep-all; text-wrap:balance; }
main :is(p,label) { text-wrap:pretty; }
main :is(input,select,textarea), main :is(article,section)>div { min-width:0; }
#b2bForm #submitButton { color:#321506; }
#b2bForm #submitButton:hover { background:#ff9461; }
.footer-registration { white-space:nowrap; font-variant-numeric:tabular-nums; }
@media(max-width:479px) {
  #footerText .footer-company-grid { grid-template-columns:.75fr 1fr 1.25fr; gap:16px 8px; }
  #footerText .footer-company-grid :is(dt,dd) { font-size:clamp(.7rem,2.9vw,.8rem); }
}

main h1.display-latin,
main h2.display-latin,
main h3.display-latin {
  letter-spacing: -0.02em;
}

main .display-korean {
  line-height: var(--mokda-leading-korean-display) !important;
  letter-spacing: -0.025em;
}

main .condensed-label,
footer .condensed-label {
  font-family: var(--mokda-font-body);
  font-size: var(--mokda-type-label);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: var(--mokda-tracking-label);
}

footer .condensed-label {
  font-size: var(--mokda-type-label);
}

.lang-btn {
  font-family: var(--mokda-font-body);
  font-size: 0.75rem;
  font-weight: 700 !important;
  line-height: 1;
  letter-spacing: 0.01em;
}

#pageTitle.display-latin {
  font-size: var(--mokda-type-page-title);
  line-height: 0.88;
}

#pageTitle.display-korean {
  font-size: clamp(2.75rem, 6vw, 5.5rem) !important;
  line-height: var(--mokda-leading-korean-display) !important;
}

#proofTitle,
#supportTitle,
#faqTitle,
#b2bTitle,
#storyTitle,
#logoTitle,
#historyTitle {
  font-size: var(--mokda-type-section-title);
  line-height: var(--mokda-leading-display);
}

#proofTitle.display-korean,
#supportTitle.display-korean,
#faqTitle.display-korean,
#b2bTitle.display-korean,
#storyTitle.display-korean,
#logoTitle.display-korean,
#historyTitle.display-korean {
  font-size: clamp(2.5rem, 4.7vw, 4.75rem) !important;
  line-height: var(--mokda-leading-korean-display) !important;
}

#prod1Title,
#prod2Title,
#prod3Title {
  font-size: var(--mokda-type-feature-title);
  line-height: 0.88;
}

#productLineTitle,
#motiveTitle {
  font-size: var(--mokda-type-card-title);
  line-height: 1.02;
}

#socialBanner #socialTitle {
  font-family: var(--mokda-font-body);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.025em;
}

/* Campaign openings retain their established, compact display line spacing. */
.home-page .hero-title.display-korean {
  line-height: 1.08 !important;
}

#heroBody,
#heroSubtitle,
#pageSubtitle,
#pageDescription,
#storyBody,
#b2bDescription,
#prod1Desc,
#prod2Desc,
#prod3Desc {
  font-size: var(--mokda-type-body);
  line-height: var(--mokda-leading-body);
}

#pageSubtitle,
#pageDescription {
  font-weight: 400 !important;
}

#productLineDescription,
#motiveBody,
.qna-answer-panel p,
.home-faq-answer-panel p,
.product-photo-card span,
#contactMethodHint {
  font-size: var(--mokda-type-body);
  line-height: var(--mokda-leading-body);
}

.home-page #contactMethodHint,
body:has(#b2bForm) #contactMethodHint {
  font-size: var(--mokda-type-body-small);
  line-height: 1.6;
}

.product-photo-card span {
  color: #321506;
  font-weight: 600;
  line-height: var(--mokda-leading-body);
}

.qna-question,
.home-faq-question,
.faq-question {
  font-size: 18px;
  line-height: 1.55;
  letter-spacing: 0;
}

#proofViews,
#proofPrograms,
#proofExpo,
#supportTotalLabel,
#prod1Uses,
#prod2Uses,
#prod3Uses,
figcaption {
  font-size: var(--mokda-type-meta);
  line-height: 1.6;
  letter-spacing: 0;
}

.support-total-number {
  font-family: 'Bebas Neue', 'Archivo Black', 'Noto Sans', sans-serif;
  font-size: clamp(8rem, 22vw, 11rem);
  font-weight: 400;
  line-height: 0.78;
  letter-spacing: 0.015em;
}

.brand-text-link,
main a[class*="min-h-"],
main button[type="submit"] {
  font-family: var(--mokda-font-body);
  font-size: 0.875rem;
  font-weight: 700 !important;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

main label,
main legend {
  font-size: 0.875rem;
  line-height: 1.45;
}

#b2bForm :is(input, select, textarea),
main :is(input, select, textarea) {
  font-family: var(--mokda-font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
}

body.support-page {
  font-size: 1rem;
  line-height: var(--mokda-leading-body);
  letter-spacing: 0;
}

.support-menu a {
  font-size: 0.875rem;
  line-height: 1.2;
}

.support-category,
.support-feed-heading p {
  font-size: 1rem;
  line-height: 1.12;
  letter-spacing: var(--mokda-tracking-label);
  text-transform: uppercase;
}

.support-title {
  font-size: clamp(2.125rem, 4.6vw, 3.25rem);
  line-height: var(--mokda-leading-korean-display);
  letter-spacing: -0.025em;
}

.support-lead {
  font-size: var(--mokda-type-body);
  line-height: 1.65;
  letter-spacing: 0;
}

.support-impact {
  font-size: clamp(1.125rem, 0.6vw + 1rem, 1.375rem);
  line-height: 1.4;
  letter-spacing: -0.015em;
}

.support-country-field legend,
.support-message-wrapper label,
.support-field label {
  font-size: 0.875rem;
  line-height: 1.4;
}

.support-field input,
.support-field textarea {
  font-size: 1rem;
  line-height: 1.5;
}

.support-chip-label,
.support-submit,
.support-success-cta,
.support-feed-more {
  font-size: 0.875rem;
  line-height: 1.15;
  letter-spacing: 0.01em;
}

.support-privacy,
.support-message-wrapper small,
.support-status,
.support-feed-empty,
.support-feed-example,
.support-back,
.support-footer {
  font-size: 0.8125rem;
  line-height: 1.5;
  letter-spacing: 0;
}

.support-feed-heading h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
}

.support-feed-total {
  font-size: 1rem;
  line-height: 1.2;
}

.support-feed-name {
  font-size: 1rem;
  line-height: 1.35;
}

.support-feed-message {
  font-size: var(--mokda-type-body-small);
  line-height: 1.6;
  letter-spacing: 0;
}

.support-feed-meta,
.support-country-total,
.support-country-total strong {
  font-size: 0.75rem;
  line-height: 1.35;
}

@media (min-width: 640px) {
  .lang-btn {
    font-size: 0.8125rem;
  }
}

@media (max-width: 639px) {
  :root {
    --mokda-type-page-title: clamp(3rem, 14vw, 4.5rem);
    --mokda-type-section-title: clamp(2.5rem, 11vw, 3.75rem);
    --mokda-type-feature-title: clamp(3rem, 14vw, 4.75rem);
    --mokda-type-card-title: clamp(2rem, 9vw, 3rem);
  }

  #productsTitle {
    font-size: clamp(3.75rem, 17vw, 6rem);
    line-height: 0.84;
  }

  body:has(#b2bForm) #pageTitle {
    font-size: clamp(3rem, 12vw, 3.75rem);
    line-height: 0.9;
  }

  #proofViews,
  #proofPrograms,
  #proofExpo {
    font-size: 0.75rem;
    line-height: 1.4;
    letter-spacing: 0.025em;
  }

  .support-title {
    font-size: clamp(1.875rem, 8.2vw, 2.4rem);
  }
}
```

### `styles/site-help.css`

```css
/* Floating, non-modal chat. Answers and inputs remain steady while in use. */
#mokda-help, #mokda-help * { box-sizing: border-box; }
#mokda-help { font-family: var(--mokda-font-body, 'Noto Sans', sans-serif); color: #321506; }
#mokda-help :is(button,input,a) { font-family: inherit; -webkit-tap-highlight-color: transparent; }
#mokda-help button { cursor: pointer; }
#mokda-help :is(button,input,a):focus-visible { outline: 3px solid #b5410b; outline-offset: 3px; }
#mokda-help .help-launcher {
  position: fixed; right: max(24px, env(safe-area-inset-right)); bottom: max(24px, env(safe-area-inset-bottom)); z-index: 81;
  display: grid; place-items: center; width: 60px; height: 60px; padding: 16px; border: 0; border-radius: 50%;
  background: #ef5f18; color: #321506; box-shadow: 0 4px 18px #32150630;
}
#mokda-help .help-launcher svg { width: 28px; height: 28px; }
#mokda-help .help-dismiss-icon, #mokda-help .help-launcher[aria-expanded="true"] .help-chat-icon { display: none; }
#mokda-help .help-launcher[aria-expanded="true"] .help-dismiss-icon { display: block; }
html.mokda-menu-lock #mokda-help { visibility: hidden; }
#mokda-help .help-dialog {
  position: fixed; inset: auto 24px 98px auto; margin: 0; padding: 0; z-index: 80;
  width: 390px; height: 610px; max-width: calc(100vw - 32px); max-height: calc(100dvh - 122px);
  overflow: hidden; border: 1px solid #32150618; border-radius: 20px; background: #fff8ef; color: #321506; box-shadow: 0 14px 55px #3215062e;
}
#mokda-help .help-dialog[open] { display: flex; flex-direction: column; }
#mokda-help .help-header { display: flex; align-items: center; gap: 12px; padding: 18px 16px 18px 20px; background: #f8dfc4; flex: none; }
#mokda-help .help-brand { display: block; width: 44px; height: 44px; object-fit: contain; flex: none; }
#mokda-help .help-heading { min-width: 0; flex: 1; }
#mokda-help .help-heading h2 { margin: 0; font-size: 18px; font-weight: 700; line-height: 1.4; letter-spacing: 0; }
#mokda-help .help-heading p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; letter-spacing: 0; color: #6f4b35; }
#mokda-help .help-close { display: grid; place-items: center; width: 44px; height: 44px; padding: 10px; border: 0; border-radius: 50%; background: transparent; color: #321506; flex: none; }
#mokda-help .help-close svg { width: 22px; height: 22px; }
#mokda-help .help-content { flex: 1; min-height: 0; padding: 18px 20px 22px; overflow-y: auto; overscroll-behavior: contain; }
#mokda-help .help-auto-label { margin: 0 0 16px; font-size: 12px; line-height: 1.5; letter-spacing: 0; color: #806450; text-align: center; }
#mokda-help .help-conversation { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
#mokda-help .help-message { max-width: 100%; padding: 14px 16px; border-radius: 14px; overflow-wrap: anywhere; font-size: 16px; font-weight: 400; line-height: 1.75; letter-spacing: 0; }
#mokda-help .help-message p { margin: 0; white-space: pre-wrap; }
#mokda-help .help-message:focus { outline: none; }
#mokda-help .help-message-bot { background: #f1e8de; border-top-left-radius: 4px; }
#mokda-help .help-message-user { align-self: flex-end; background: #f8dfc4; border-top-right-radius: 4px; }
#mokda-help .help-detail-link { display: inline-flex; align-items: center; min-height: 44px; margin-top: 8px; color: #a63a08; font-size: 14px; font-weight: 700; line-height: 1.5; text-decoration: underline; text-underline-offset: 4px; }
#mokda-help .help-options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
#mokda-help .help-topics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; width: 100%; }
#mokda-help .help-choice { min-height: 44px; max-width: 100%; padding: 10px 13px; border: 1px solid #b54a172f; border-radius: 12px; background: #fff8ef; color: #963508; font-size: 14px; font-weight: 600; line-height: 1.5; letter-spacing: 0; text-align: left; overflow-wrap: anywhere; }
#mokda-help .help-topic { display: flex; align-items: center; justify-content: center; text-align: center; }
#mokda-help .help-question { width: 100%; }
#mokda-help .help-quick { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
#mokda-help :is(.help-other,.help-quick-question) { border-radius: 22px; }
#mokda-help .help-footer { flex: none; padding: 12px 16px 16px; background: #fff8ef; border-top: 1px solid #32150614; }
#mokda-help .help-tools { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }
#mokda-help .help-reset { min-height: 44px; padding: 8px 4px; border: 0; background: transparent; color: #745543; font-size: 13px; font-weight: 600; line-height: 1.5; }
#mokda-help .help-contact { display: inline-flex; align-items: center; justify-content: flex-end; min-height: 44px; color: #963508; font-size: 14px; font-weight: 700; line-height: 1.5; text-decoration: none; text-align: right; }
#mokda-help .help-composer { display: flex; align-items: center; gap: 8px; margin: 0; }
#mokda-help .help-composer input { width: 100%; min-width: 0; min-height: 48px; padding: 12px 14px; border: 1px solid #32150626; border-radius: 12px; background: #fffdf9; color: #321506; font-size: 16px; line-height: 1.5; letter-spacing: 0; }
#mokda-help .help-composer input::placeholder { color: #806450; opacity: 1; }
#mokda-help .help-composer button { display: grid; place-items: center; width: 48px; height: 48px; flex: none; padding: 12px; border: 0; border-radius: 12px; background: #ef5f18; color: #321506; }
#mokda-help .help-composer svg { width: 24px; height: 24px; }
@media (hover: hover) and (pointer: fine) {
  #mokda-help :is(.help-launcher,.help-composer button):hover { background: #ff7a32; }
  #mokda-help .help-choice:hover { background: #f8dfc4; border-color: #b54a1770; }
  #mokda-help .help-close:hover { background: #3215060d; }
  #mokda-help :is(.help-contact,.help-reset):hover { color: #321506; text-decoration: underline; text-underline-offset: 4px; }
}
@media (max-width: 479px) {
  #mokda-help .help-launcher { right: max(16px, env(safe-area-inset-right)); bottom: max(16px, env(safe-area-inset-bottom)); width: 56px; height: 56px; padding: 14px; }
  #mokda-help .help-dialog { inset: auto 12px max(86px, calc(env(safe-area-inset-bottom) + 74px)) 12px; width: auto; max-width: none; height: 610px; max-height: calc(100dvh - 110px); border-radius: 18px; }
  #mokda-help .help-header { padding: 14px 12px 14px 16px; gap: 10px; }
  #mokda-help .help-content { padding: 16px 16px 20px; }
  #mokda-help .help-message { padding: 12px 14px; }
  #mokda-help .help-footer { padding: 10px 12px 12px; }
}
@media (max-height: 500px) {
  #mokda-help .help-dialog { top: 12px; bottom: 12px; height: auto; max-height: calc(100dvh - 24px); }
  #mokda-help .help-launcher[aria-expanded="true"] { visibility: hidden; }
}
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.hero-kicker-shadow {
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.32);
}

.hero-title-shadow {
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.hero-title-accent {
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.surface-depth {
  box-shadow:
    0 24px 56px rgba(92, 45, 17, 0.1),
    0 8px 18px rgba(23, 23, 23, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.product-card {
  box-shadow: none;
}

.product-card:hover {
  box-shadow: none;
}

.product-stage {
  isolation: isolate;
}

.product-stage::before {
  position: absolute;
  inset: 8% 10%;
  z-index: 0;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 42%, var(--stage-glow, rgba(239, 95, 24, 0.1)), transparent 62%);
  content: "";
  filter: blur(18px);
}

.product-stage::after {
  position: absolute;
  left: 50%;
  bottom: 7%;
  z-index: 0;
  width: 56%;
  height: 13%;
  border-radius: 999px;
  background: radial-gradient(ellipse, var(--stage-shadow, rgba(92, 45, 17, 0.22)) 0%, rgba(92, 45, 17, 0.08) 48%, transparent 72%);
  content: "";
  filter: blur(12px);
  transform: translateX(-50%);
}

.product-bottle {
  filter:
    drop-shadow(0 22px 18px var(--bottle-shadow, rgba(92, 45, 17, 0.18)))
    drop-shadow(0 4px 3px rgba(2, 103, 79, 0.08));
}
```

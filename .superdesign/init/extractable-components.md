# Extractable components

This is a menu of candidate reusable DraftComponents. Existing production primitives are custom DOM components, not a third-party UI kit. Extract state/navigation props only; fixed logos, icon shapes, copy and styles stay hardcoded to their selected locale/design.

## SiteHeader

- Source: `site-header.js`
- Category: layout
- Description: Global logo, language selector, desktop panels and responsive navigation.
- Extractable props: activeItem (brand/products/news/connect), menuOpen (boolean), currentLanguage (ES/KR/EN), homeHref (string).
- Hardcoded: Real MOKDA logo, menu labels/icons, CSS and navigation structure.

## SiteFooter

- Source: `site-footer.js`
- Category: layout
- Description: Common public navigation, company information and social links.
- Extractable props: currentLanguage (ES/KR/EN), homeHref (string), showSocial (boolean).
- Hardcoded: Company/public legal copy, logo/brand identity, social icons and CSS.

## MokdaMessenger

- Source: `site-help.js`
- Category: layout
- Description: Shared floating chat application with launcher, header, log, reply options and composer.
- Extractable props: isOpen (boolean), isMobile (boolean), isTyping (boolean), hasUnreadReply (boolean), canSend (boolean), currentLanguage (ES/KR/EN).
- Hardcoded: Authentic logo image, assistant identity, automatic-response disclosure, icon shapes and selected neutral theme.

## ChatLauncher

- Source: `site-help.js + styles/site-help.css`
- Category: basic
- Description: Circular chat launcher with open/close icon state.
- Extractable props: isOpen (boolean), hasUnreadReply (boolean).
- Hardcoded: Circle geometry, message/cross icon shape, localized accessible labels.

## ChatMessage

- Source: `site-help.js + styles/site-help.css`
- Category: basic
- Description: Assistant/user message bubble with optional safe destination link.
- Extractable props: isUser (boolean), isPending (boolean), detailHref (string), showDetail (boolean).
- Hardcoded: Selected message typography, avatar asset, bubble geometry and fixed role labels.

## QuickReply

- Source: `site-help.js + styles/site-help.css`
- Category: basic
- Description: Compact accessible button to continue an on-topic conversation.
- Extractable props: isDisabled (boolean), isSelected (boolean).
- Hardcoded: Localized topic/question copy, selected icon and CSS.

## ChatComposer

- Source: `site-help.js + styles/site-help.css`
- Category: basic
- Description: Stable 16px message input and a 48px send control.
- Extractable props: isBusy (boolean), canSend (boolean), hasError (boolean).
- Hardcoded: Localized placeholder and send label, send icon shape, keyboard-visible geometry and CSS.

## HumanHandoff

- Source: `site-help.js + site-contact-config.js`
- Category: basic
- Description: Explicit WhatsApp transfer or safe internal contact fallback.
- Extractable props: contactHref (string), isExternal (boolean).
- Hardcoded: WhatsApp/team-contact labels and icon; actual official number comes only from site-contact-config.js.

## AccessibleAccordion

- Source: `site-accordion.js`
- Category: basic
- Description: Shared expanded/collapsed FAQ controller.
- Extractable props: isOpen (boolean), single (boolean), controlsId (string).
- Hardcoded: Question copy, expansion icon and corresponding page style.

## ProductCard

- Source: `components/product/ProductCard.tsx`
- Category: basic
- Description: Reusable visual product card in parallel Next.js app.
- Extractable props: isActive (boolean), detailHref (string, if a future extraction introduces navigation).
- Hardcoded: Product imagery, copy and typography; current parallel legacy names must not enter public chatbot facts.

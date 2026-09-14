# Four-page refinement — 2026-09-13

Local preview: http://127.0.0.1:4189/ko/?design=refined9

Scope: implement the approved home, About, FAQ and product review, excluding video.
The approved localized copy dictionaries were compared with the pre-edit snapshots and remain unchanged.

- Home: combine sauce descriptions and food pairings into two linked food cards; retain the existing lineup introduction. Remove the repeated pairing section. Group farm and manufacturing images with the original proof copy and metrics. Move the meeting image into the About narrative.
- About: use a complete founder field photograph beside the existing opening statement. Give the story heading a full row; align the landscape meeting image and existing story text. Compact the identity section and timeline. Preserve every milestone and complete portrait framing.
- FAQ: show all five existing answers as semantic heading/paragraph articles. Use the shared paper background, dividers and typography; retain the contact link.
- Products: replace the obsolete three-bottle hero image with the existing food-table photograph. Keep food-only detail panels and the approved taste/use copy; retain B2B inquiry links.
- Motion: short one-time entrances, gentle product-photo hover and reading-state timeline emphasis. Respect reduced-motion preferences. No video, autoplay carousel, extra controls or new dependencies.

Validation:
- Generated 15 localized pages.
- Analytics regression: 14 scenarios passed; TypeScript check passed.
- 24 browser checks: 4 routes × 3 languages × 390/1280px; no page errors, horizontal overflow, broken images, retired support links or old product hero asset.
- Inspected desktop browser views and mobile rendered screenshots. Verified B2B product-link navigation without submitting the form.
- Copy comparison and scoped `git diff --check` passed.

Evidence: `output/playwright/refined9/`, `output/design-refinement-before/`.
No commit, push or production deployment performed.

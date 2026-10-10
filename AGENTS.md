# Project Instructions

Before starting work in this project, read `MOKDA_HARNESS.md`.

## Brand Rule

- Active company/brand name: `MOKDA`.
- B2B project name: `MOKDA B2B`.
- Do not use any previous company name as the active brand name unless explicitly asked for legacy context.

## Project Role

- Current MOKDA website project.
- Contains the public website, static pages, Next.js files, product assets, B2B inquiry configuration, and Apps Script source for B2B lead handling.

## Website Typography

- Read `docs/WEBSITE_TYPOGRAPHY.md` before changing website typography or adding page text styles.
- Apply its role-based font, size, weight, spacing, and responsive verification rules to all three languages.
- Keep this project standard in that document; do not copy the canonical MOKDA harness.

## Important Files

- Website motion follows `docs/WEBSITE_MOTION.md`; use the shared motion scripts and keep form inputs, status messages and active media steady.
- The user has authorized completing website changes through verified commit, push and production deployment (2026-10-10). Follow the canonical harness's website deployment rule unless the latest request limits a change to review or preview.

- `b2b-config.js`: B2B Google Apps Script Web App URL configuration.
- `apps-script/b2b-lead-automation.gs`: B2B lead receiver, Google Sheets save, and email notification logic.
- `B2B_AUTOMATION_SETUP.md`: setup instructions for B2B lead automation.
- `index.html`, `about.html`, `products.html`, `coming-soon.html`: static website pages.
- `app/`, `components/`, `public/`: Next.js app structure.

## Safety Rules

- Do not move or delete `.git`.
- Do not remove B2B inquiry files unless the user explicitly asks.
- Keep website assets and page structure intact unless the requested task requires a change.
- Test website changes with the existing project commands when possible.

# News detail and search-only archive

The detail page previously stacked a heading, media and paragraphs inside one paper panel, with an isolated small related-story card. The user approved replacing this with a title/media opening, readable body and horizontal next-story links, then removing archive category selection.

## Changes

- Detail uses a centered heading and short introduction followed by a wide photograph or native video. The latest explicit alignment preference superseded the initial side-by-side opening.
- Main photographs retain their natural proportions, including the entire seven-person KPOP group. Existing documentary images, footage, factual paragraphs and original source links are preserved.
- Body text uses a narrower centered reading measure without the white enclosure. Source attribution remains below the body.
- Next stories are horizontal photo/headline links, with concise available titles and full accessible names. Single stories span the row; smaller screens keep readable wrapping.
- Archive category tabs and matching category menu links are removed in ES/KO/EN. Search, reset, URL state, history and growing-archive pagination remain.
- Legacy category parameters are removed on archive entry while retaining keyword and attribution parameters. Category metadata remains available for story labels and the existing news manager.
- Home news placement and three-card strip remain; section headings and captions are centered.

## Verification

Actual browser checks covered 36 combinations: ES/KO/EN, 320/768/1440 px, archive and Congress/KPOP/creator details. No page overflow or category selectors were found. A narrow-screen next-title wrapping issue was corrected and checked at 320 px. Actual KOTRA search returned two stories, reset restored six, and language switching worked. Congress native inline playback reached 43.83 s of 258.83 s with no error and closed correctly.

Generation (42 pages), news, news-manager, navigation, SEO, integrity (597 internal links / 86 referenced assets), analytics (14 scenarios) and typecheck passed. Browser screenshots and measurements are in ignored `output/playwright/news-detail-editorial/`.

# Public routes

| Route | Source template | Layout |
| --- | --- | --- |
| `/es/`, `/ko/`, `/en/` | `index.html` | `site-header.js` + inline page + `site-footer.js` |
| `/es/about.html`, `/ko/about.html`, `/en/about.html` | `about.html` | `site-header.js` + inline About sections + `site-footer.js` |
| `/es/products.html`, `/ko/products.html`, `/en/products.html` | `products.html` | shared public shell |
| `/es/qna.html`, `/ko/qna.html`, `/en/qna.html` | `qna.html` | shared public shell |
| `/es/contact.html`, `/ko/contact.html`, `/en/contact.html` | `contact.html` | shared public shell |

`scripts/generate-localized-pages.mjs` generates the language-specific static pages from the root templates.

The active design target is `/es/about.html`, whose authoritative template is `about.html`.

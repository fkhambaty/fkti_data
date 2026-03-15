# Paywall (Pro content gating)

## How it works

- Pages with `data-access="pro"` on `<body>` are gated. If the user is not logged in or not on a Pro subscription, an overlay is shown with an "Upgrade to Pro" CTA.
- Load on every Pro-gated page (after Supabase auth):
  1. Set `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` (same as auth pages).
  2. Load `../js/supabase-auth.js` (path relative to page; from repo root use `js/supabase-auth.js`).
  3. Load `../js/paywall.js` (path relative to page).

## Add to Pro-gated pages

Add to `<body>`:

```html
<body data-access="pro">
```

Add before `</body>` (adjust path if the page is in a subfolder):

```html
<script>window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'; window.SUPABASE_ANON_KEY = 'your-anon-key';</script>
<script src="../js/supabase-auth.js"></script>
<script src="../js/paywall.js"></script>
```

For pages in repo root use `js/supabase-auth.js` and `js/paywall.js`. For pages in `python_course/` use `../js/...`, for `data_science_course/` use `../js/...`, etc.

## Pages that should be Pro-gated (data-access="pro")

- **Python**: s6-functions1.html through s15-web-scraping.html (sessions 6–15), assignments, admin-assignments, complete-course (or leave index free and gate individual sessions).
- **Airflow**: index.html, hub.html, all lesson and certification pages.
- **DBT**: index.html, hub.html, all lessons.
- **Redshift, MSSQL, Metabase, ClickHouse**: index.html, hub.html, all lessons.
- **Data Science**: advanced lessons (e.g. deep-learning, nlp, boosting, k-nearest-neighbors, decision-trees, etc.); keep index, math-foundations, statistics-foundations, python-basics, ml-introduction free.
- **LLM**: index.html and all chapter pages.
- **Pipeline Designer**: export actions (or gate the whole page if you prefer; plan says "view mode, no export" for free — export gating can be done in the app logic instead of body attribute).

You can start by gating only a few key pages (e.g. one lesson per course) and then add `data-access="pro"` and the script snippet to the rest.

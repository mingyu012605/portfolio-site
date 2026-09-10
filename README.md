# Portfolio Site

Static engineering portfolio for Mingyu Song. Plain HTML/CSS/JavaScript — no build step, no framework.

## Structure

```
index.html          all page content and the six project case-study dialogs
css/style.css        all styling
js/main.js           mobile nav, active-nav highlighting, case-study dialogs, lightbox
assets/images/<slug> images for each project, grouped by project folder
assets/videos/<slug> videos for each project, grouped by project folder
```

## Adding real media

Every image/video tag already points at the filename it expects (e.g.
`assets/images/slam/hardware-rig.jpg`). Until that file exists, the page shows
a labeled placeholder instead of a broken image — just drop a file in with the
exact same name and path, and it appears automatically. No HTML edits needed
unless you want to change the caption or add new media slots.

To add a new image/video to a project's gallery, copy an existing
`<figure class="media gallery__item" data-expected="...">` block inside that
project's `<dialog>` in `index.html` and point it at the new file.

## Editing project content

Each project has:
- a card in the `.project-grid` section (image, title, one-line description, tags)
- a full case study in a `<dialog id="dialog-...">` further down the file, following
  the structure: Overview, Problem/Goal, My Role, System/Architecture, Engineering
  Process, Challenges & Debugging, Testing/Validation, Results, Technologies,
  What I Learned, Media Gallery

Both are plain HTML — edit the text directly.

## Updating contact info

Replace the placeholder email/GitHub/LinkedIn values in the `#contact` section
of `index.html` (search for `placeholder`).

## Running locally

Open `index.html` directly in a browser, or serve the folder so relative paths
and `loading="lazy"` behave the same as in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

No build step is required. Point Netlify or Vercel at this folder (or connect
the git repo) and deploy as a static site — the root `index.html` is the
entry point.

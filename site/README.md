# The docs site

The Material Web 3.0 docs at `/3.0/`. This folder holds the docs site and
nothing else. The pages' text is in [`docs/`](../docs). The components, their
styles, the json-render catalog, renderer and HTML converter, and the
appearance preferences are in
[`material-design-expressive/`](../material-design-expressive).

The site is also a test of the library. Its whole UI (header, navigation
rail, search, outline, pager, tools, and each page's content) is a
json-render spec made only of components from the library's catalog,
rendered with the library's renderer and styled only with the library's
styles. The site has no stylesheet of its own, and the build fails when a
page needs something the catalog can't express. When that happens, the fix
belongs in the library.

## Layout

| Folder | What it holds |
| --- | --- |
| [`specs/`](specs) | The JSON specs the site builds: `shell.cjs` (the shell: app bar, rail, outline, pager, tools) and `sections.cjs` (the section pages), with `builder.cjs` to write them. |
| [`client/`](client) | The browser code, bundled to `/js/spec/`. `shell.ts` hydrates the shell spec and handles its actions. The others are the tools (downloads, copy, install, feedback), search, navigation (route progress, prefetch), the service worker and the WebMCP tools. |
| [`eleventy/`](eleventy) | The build that turns `docs/` into pages. `render.cjs` checks, renders and embeds the specs (`shell`). `content.cjs` converts a page's HTML into a spec with the library's `htmlToSpec`. The rest is page metadata and collections (`site.cjs`), demos, shortcodes, the Compatibility section, the shadcn tables and heading permalinks. |
| [`content/`](content) | The Eleventy input: the layout (`_includes/spec.html`), site data, the templates of the generated files (search index, `llms.txt`, sitemap, Markdown pages, all-pages document, test pages), fonts and images. |
| [`scripts/`](scripts) | Build, serve, publish and check scripts. |

## What the build checks

- Every spec (shell and content) against the catalog (`checkSpec`).
- A page's HTML converts with nothing dropped, unwrapped or in a stray slot.
  A demo whose example needs more is rendered as a framed document.
- Every component the shell uses is imported by the client bundle.

## Commands

Run these from the repository root:

```sh
npm run catalog:dev          # build the library and the site, serve it on :8000, rebuild on edits
node site/scripts/wait.mjs   # wait for the next rebuild
npm run catalog:pages        # publish the built site to the gh-pages branch
node site/scripts/check.mjs  # check every page: status, console errors, axe
npm run catalog:walk         # walk the pages with Next, timing them
```

`dev.mjs` copies `docs/` into `content/3.0/`, renders the library's demos,
bundles `client/` and runs Eleventy into `_dev/`. A second server on :8001
serves the library to the demos.

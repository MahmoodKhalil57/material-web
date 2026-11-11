# The docs site

The Material Web 3.0 docs at `/3.0/`. This folder holds the docs site and
nothing else. The pages' text is in [`docs/`](../docs). The components, their
styles and the json-render catalog and renderer are in
[`material-design-expressive/`](../material-design-expressive).

The site is also a demo of the library. Its whole UI (header, navigation
rail, search, outline, pager, tools, and each page's content) is a
json-render spec made only of components from the library's catalog,
rendered with the library's renderer and styled only with the library's
styles. The site has no stylesheet of its own.

## Layout

| Folder | What it holds |
| --- | --- |
| [`spec/`](spec) | The specs, built at build time: `shell.cjs` (the shell), `content.cjs` (a page's HTML as a spec), `render.cjs` (the `gbshell` and `gbstyles` shortcodes, which check the spec, render it to HTML and embed it for hydration). |
| [`client/`](client) | The browser code, bundled to `/js/spec/`. `shell.ts` hydrates the spec and handles its actions. The others are the theme and download tools, search, navigation (route progress, prefetch), the service worker and the WebMCP tools. |
| [`eleventy/`](eleventy) | Page logic: site metadata and collections (`site.cjs`), demos (`demo.cjs`), shortcodes, the Compatibility section, the shadcn tables, shapes and heading permalinks. |
| [`content/`](content) | The Eleventy input: the layout (`_includes/spec.html`), site data, the templates of the generated files (search index, `llms.txt`, sitemap, Markdown pages, all-pages document, test pages), fonts and the favicon. |
| [`scripts/`](scripts) | Build, publish and check scripts. |

## Commands

Run these from the repository root:

```sh
npm run catalog:dev      # build the library and the site, serve it on :8000, rebuild on edits
node site/scripts/wait.mjs   # wait for the next rebuild
npm run catalog:pages    # publish the built site to the gh-pages branch
node site/scripts/check.mjs  # check every page: status, console errors, axe
npm run catalog:walk     # walk the pages with Next, timing them
```

`dev.mjs` copies `docs/` into `content/3.0/`, renders the library's demos,
bundles `client/` and runs Eleventy into `_dev/`. A second server on :8001
serves the library to the demos.

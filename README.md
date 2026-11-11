# Material Web 3.0

Material 3 Expressive web components, with the 3.0 docs site.
This branch keeps only what those components and their docs need. The
Material Web 2.5 components are on `main`.

- Docs: https://mahmoodkhalil57.github.io/material-web/3.0/
- `material-design-expressive/`: the library. Its folders follow the M3 docs
  pillars, one folder per docs page that has code:
  - `foundations/`: `design-tokens/` (the M3 token source, in
    `versions/latest/sass`), `accessibility/` (the headless ARIA primitives
    and ARIA mixins in `aria/`, the axe and ARIA suites, touch targets),
    `interaction/` (`states/` with the focus ring and ripple, `gestures/`,
    `inputs/`, `selection/`) and `layout/` (window size classes, density, RTL).
  - `styles/`: `color/`, `elevation/`, `icons/`, `motion/`, `shape/`,
    `spacing/` and `typography/`, each with its tokens, helpers and tests.
  - `components/`: the `md-gb-*` elements of the M3 components index, one
    folder per component, and `components/shared/` for behavior several of
    them share.
  - `extras/`: the library's own components with no page in the M3
    components index (select, the app and pane scaffolds, pull to refresh),
    each following the spec pages that cover it.
  - `SPEC-MAP.md` maps each spec page to its folder, elements and docs page;
    `scripts/m3/gen-spec-map.mjs` writes it and fails when a folder is in
    the wrong one of `components/` and `extras/`.
  - `internal/`: plumbing with no docs page (form `behaviors/`, Sass `sass/ext`,
    TypeScript declarations in `types/`, controllers, events, directives).
    `testing/` holds the test helpers, and `skill/` is the agent skill for
    the library.
- `docs/`: the docs pages (Markdown).
- `site/`: the docs site (Eleventy). `site/content/` holds the pages.
- `scripts/`: build, site and publishing scripts.

## Develop

```sh
npm install
npm run build          # Sass, CSSResult modules and TypeScript
npm run catalog:dev    # the docs site at http://localhost:8000/3.0/
```

## Publish

```sh
npm run catalog:pages  # the docs site, as a GitHub Pages branch
npm run npm-package    # the components, as the npm package (see scripts/npm-package.mjs)
```

## Tests and checks

```sh
npm run test           # web-test-runner
npm run gb:check       # component checks
```

## License

Apache-2.0. See [LICENSE](LICENSE).

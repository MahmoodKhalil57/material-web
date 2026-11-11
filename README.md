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
  - `API.md` and `custom-elements.json` are the public API: every module,
    element, function, constant, type, global stylesheet and design token a
    user can import, with the spec pages each implements and its JSDoc.
    `scripts/api/gen-api.mjs` writes both; `npm run gb:check -- --all` fails
    when they are stale, and the npm package ships them. Every module ships
    with its `.d.ts`; `scripts/api/check-package-types.mjs` type-checks the
    built package as a user's project would on every package build.
  - `json-render/`: UIs from JSON specs (https://json-render.dev). The
    schema (`schema.ts`), the catalog of the components generated from the
    public API (`catalog.ts`, reviewed in `CATALOG.md`), M3 rules that quote
    the spec (`m3-rules.ts`), `checkSpec()` and `m3Prompt()` (`check.ts`),
    and `renderSpec()` (`renderer.ts`).
  - `internal/`: plumbing with no docs page (form `behaviors/`, Sass `sass/ext`,
    TypeScript declarations in `types/`, controllers, events, directives).
    `testing/` holds the test helpers, and `skill/` is the agent skill for
    the library.
- `docs/`: the docs pages (Markdown).
- `site/`: the docs site (Eleventy). `site/content/` holds the pages.
- `scripts/`: build, site and publishing scripts.

## From the spec to the library and back

The sources of truth go into the code, and everything generated from the
code is checked back against them:

| Step | Made by | Checked by |
| --- | --- | --- |
| M3 spec (`.m3-specs/`, local mirror), Jetpack Compose Material 3 sources (`.m3-specs/compose`), WAI-ARIA 1.3, Baseline, Lighthouse | `scripts/download-m3-specs.mjs`, `scripts/m3/download-compose-sources.mjs`, `scripts/m3/` | |
| The code (`material-design-expressive/`) | by hand, and the token and test generators in `scripts/m3/` | spec, anatomy, measurement and contract tests per component; the central axe and ARIA suites; `gb-baseline.mjs`; Lighthouse in the catalog |
| `SPEC-MAP.md`: spec page -> folder -> elements | `scripts/m3/gen-spec-map.mjs` | fails when a folder or spec page is unmapped, or in the wrong one of `components/` and `extras/` |
| `custom-elements.json`, `API.md`: the public API | `scripts/api/gen-api.mjs` | `gb:check --all` (stale), `check-package-types.mjs` (types), every element reachable from `all.js`, JSDoc coverage |
| `json-render/catalog.ts`: the json-render catalog | `scripts/api/gen-json-render.mjs`, from the public API | `gb:check --all` (stale); each M3 rule's quote must still be on its spec page |
| A spec (from a model, or by hand) | `m3Prompt()` gives the model the catalog and the M3 rules | `checkSpec()`: structure, props, slots, events and M3 rules; `renderSpec()` output passes axe in the tests |

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

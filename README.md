# Material Web 3.0

Material 3 Expressive web components, with the 3.0 docs site.
This branch keeps only what those components and their docs need. The
Material Web 2.5 components are on `main`.

- Docs: https://mahmoodkhalil57.github.io/material-web/3.0/
- `components/`: the `md-gb-*` elements, built on the headless ARIA
  primitives in `aria/` and the behaviors in `behaviors/`.
- `styles/`: the M3 tokens and typography the components use, and `skill/`
  is the agent skill for the library.
- `docs/`: the docs pages (Markdown).
- `site/`: the docs site (Eleventy). `site/content/` holds the pages.
- `tokens/`: the M3 token source (`material-design-expressive/tokens/versions/latest/sass`).
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

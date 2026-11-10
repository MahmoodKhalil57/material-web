# Material Web 3.0

Material 3 Expressive web components (`labs/gb`), with the 3.0 docs site.
This branch keeps only what those components and their docs need. The
Material Web 2.5 components are on `main`.

- Docs: https://mahmoodkhalil57.github.io/material-web/3.0/
- Components: `labs/gb/components/*` (`md-gb-*` elements), built on the
  headless ARIA primitives in `labs/aria` and the behaviors in `labs/behaviors`.
- Docs source: `docs/3.0` (Markdown). The site is built in `catalog/`
  (Eleventy).

## Develop

```sh
npm install
npm run build          # Sass, CSSResult modules and TypeScript for labs/gb
npm run catalog:dev    # the docs site at http://localhost:8000/3.0/
```

## Publish

```sh
npm run catalog:pages  # the docs site, as a GitHub Pages branch
npm run npm-package    # the components, as the npm package (see scripts/npm-package.mjs)
```

## Tests and checks

```sh
npm run test           # web-test-runner (labs/gb)
npm run gb:check       # labs/gb checks
```

## License

Apache-2.0. See [LICENSE](LICENSE).

---
title: Quick Start
section: about
order: 3
description: "For fast prototyping, use a CDN such as esm.run to load @material/web without installing it."
---

## CDN

For fast prototyping, use a CDN such as [esm.run](https://esm.run/)
to load `@material/web` without installing it. The M3 Expressive elements are
under `@material/web/labs/gb/`.

```html
<head>
  <script type="importmap">
    {
      "imports": {
        "@material/web/": "https://esm.run/@material/web/"
      }
    }
  </script>
  <script type="module">
    import '@material/web/labs/gb/components/button/md-gb-button.js';
    import '@material/web/labs/gb/components/checkbox/md-gb-checkbox.js';
    import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
    import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

    // Design tokens (color, typography, shape, motion) for the document.
    adoptStyles(document, [m3Styles]);
  </script>
</head>
<body>
  <label>
    Material 3 Expressive
    <md-gb-checkbox checked></md-gb-checkbox>
  </label>
  <md-gb-button>Next</md-gb-button>
</body>
```

For production, follow the [install](#install) and [build](#building) steps
below.

## Install

Install Material web components using
[npm and node](https://nodejs.org).

```shell
npm install @material/web
```

## Import

Import element definitions from
`@material/web/labs/gb/components/<component>/md-gb-<component>.js`, and load
the design tokens once with `adoptStyles()`.

```js
// index.js
import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/checkbox/md-gb-checkbox.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);
```

## Usage

Use the `<md-gb-component>` tag in HTML markup. Refer to the
[component docs](components/) for more guidance on using each component.

```html
<script type="module" src="./index.js"></script>

<label>
  Material 3 Expressive
  <md-gb-checkbox checked></md-gb-checkbox>
</label>

<md-gb-button variant="outlined">Back</md-gb-button>
<md-gb-button>Next</md-gb-button>
```

## Building

Material web components uses bare module specifiers that must be resolved with
tools until [import maps](https://github.com/WICG/import-maps) are
adopted.

We recommend following
[lit.dev's modern build for production](https://lit.dev/docs/tools/production/#modern-only-build)
for a more in-depth build guide.

### Rollup quick start

For a quick start, we recommend using [Rollup](https://rollupjs.org/)
to resolve bare module specifiers into a bundled file.

Install Rollup and a plugin to resolve bare module specifiers.

```shell
npm install rollup @rollup/plugin-node-resolve
```

Create a bundle from an entrypoint `index.js` file and use it in a `<script>`
`"src"` attribute.

```shell
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```

```html
<script src="./bundle.js"></script>
```

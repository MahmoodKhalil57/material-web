## CDN

For fast prototyping, use a CDN such as [esm.run](https://esm.run/)<!-- {.external} -->
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
[npm and node](https://nodejs.org)<!-- {.external} -->.

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

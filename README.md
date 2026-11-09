# @mahmoodkhalil/material-web-3-demo

A demo build of the Material 3 Expressive web components (labs/gb) from
[material-web](https://github.com/material-components/material-web), as
published on the 3.0 docs site: https://mahmoodkhalil57.github.io/material-web/3.0/

This is an unofficial demo, not a Google release. The components are
unbundled ES modules built on Lit.

```sh
npm install @mahmoodkhalil/material-web-3-demo
```

```js
// Defines every md-gb-* element and adopts the M3 styles into the document.
import '@mahmoodkhalil/material-web-3-demo';
```

```html
<md-gb-button>Hello</md-gb-button>
```

For production, import individual components from
`@mahmoodkhalil/material-web-3-demo/labs/gb/components/<name>/<file>.js` and adopt the styles
yourself.

Built from material-web 2.5.0 at commit 94dde96bd.

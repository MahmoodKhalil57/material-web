## Tokens

Material is expressed in
[design tokens](https://m3.material.io/foundations/design-tokens/overview)<!-- {.external} -->,
which are the building blocks of all UI elements.

In 3.0, the `md-gb-*` elements are themed with **system tokens**, which map
roles to concrete reference values. Load them once for the document with
`adoptStyles()`, then override any token with CSS.

```js
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);
```

System tokens are
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)<!-- {.external} -->
in the `md.sys.*` cascade layers, so unlayered CSS always wins and they can be
scoped with any selector.

```css
.square-corners {
  /* Applies to every md-gb-* element inside the selector */
  --md-sys-shape-corner-full: 0px;
}
```

### System

System tokens define the decisions and roles that give the design system its
character: color, typography, shape, elevation, space, and motion.

#### Color

[`--md-sys-color` tokens](color.md#tokens) define the dynamic color roles. They
use `light-dark()`, so they follow `color-scheme`. See the
[color guide](color.md).

```css
:root {
  color-scheme: light dark;
  --md-sys-color-primary: light-dark(red, pink);
}
```

#### Typography

[`--md-sys-typescale` tokens](typography.md#tokens) define the type scale,
including the emphasized styles. See the [typography guide](typography.md).

```css
:root {
  --md-sys-typescale-body-md-size: 1rem;
  --md-sys-typescale-body-md-line-height: 1.5rem;
}
```

#### Shape

[`--md-sys-shape` tokens](shape.md#tokens) define the corner scale, including
single-corner values. See the [shape guide](shape.md).

```css
:root {
  --md-sys-shape-corner-md: 12px;
  --md-sys-shape-corner-lg: 16px;
}
```

#### Motion

`--md-sys-motion` tokens define the motion scheme: spring tokens
(`--md-sys-motion-spring-<speed>-<spatial|effects>`, each with a matching
`-duration`), easing curves, and durations. Springs are `linear()` easings.
The standard scheme applies to elements inside `.md-motion-standard`.

```css
.panel {
  transition: translate var(--md-sys-motion-spring-default-spatial-duration)
    var(--md-sys-motion-spring-default-spatial);
}
```

### Component

The `md-gb-*` elements do not expose per-component tokens. Change how a
component looks by changing the system tokens it uses (color roles, typescale
styles, shape corners, motion), by scoping them to a selector, or with the
component's attributes such as `variant` and `size`.

```css
md-gb-button.error {
  --md-sys-color-primary: var(--md-sys-color-error);
  --md-sys-color-on-primary: var(--md-sys-color-on-error);
}
```

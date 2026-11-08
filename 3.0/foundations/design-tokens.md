# Theming

Material Design theming creates unique branded products with familiar patterns and accessible interactions.

![collage of views of a mobile UI that show a user's setting and preference for
a green primary color flows through system UI
harmoniously](/material-web/theming/images/theming.webp "A user-generated color scheme can flow through apps that use a custom theme.")

## Tokens

Material is expressed in
[design tokens](https://m3.material.io/foundations/design-tokens/overview),
which are the building blocks of all UI elements.

In 3.0, the `md-gb-*` elements are themed with **system tokens**, which map
roles to concrete reference values. Load them once for the document with
`adoptStyles()`, then override any token with CSS.

**Example: Load the system tokens once for the document**

*HTML*

```html
<md-gb-button color="filled">Save</md-gb-button>
```

*JavaScript*

```js
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);
```

System tokens are
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
in the `md.sys.*` cascade layers, so unlayered CSS always wins and they can be
scoped with any selector.

**Example: A scope where buttons have square corners**

*HTML*

```html
<div class="square-corners">
  <md-gb-button color="filled">Save</md-gb-button>
</div>
```

*CSS*

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

[`--md-sys-color` tokens](/material-web/3.0/foundations/design-tokens/color.md#tokens) define the dynamic color roles. They
use `light-dark()`, so they follow `color-scheme`. See the
[color guide](/material-web/3.0/foundations/design-tokens/color.md).

**Example: A button with a custom primary color for light and dark**

*HTML*

```html
<md-gb-button color="filled">Save</md-gb-button>
```

*CSS*

```css
:root {
  color-scheme: light dark;
  --md-sys-color-primary: light-dark(red, pink);
}
```

#### Typography

[`--md-sys-typescale` tokens](/material-web/3.0/foundations/design-tokens/typography.md#tokens) define the type scale,
including the emphasized styles. See the [typography guide](/material-web/3.0/foundations/design-tokens/typography.md).

**Example: Body text with a larger size and line height**

*HTML*

```html
<p class="body">Your draft was saved to the inbox.</p>
```

*CSS*

```css
:root {
  --md-sys-typescale-body-md-size: 1.25rem;
  --md-sys-typescale-body-md-line-height: 1.75rem;
}

.body {
  margin: 0;
  font-size: var(--md-sys-typescale-body-md-size);
  line-height: var(--md-sys-typescale-body-md-line-height);
}
```

#### Shape

[`--md-sys-shape` tokens](/material-web/3.0/foundations/design-tokens/shape.md#tokens) define the corner scale, including
single-corner values. See the [shape guide](/material-web/3.0/foundations/design-tokens/shape.md).

**Example: A box with custom medium and large corners**

*HTML*

```html
<div class="box">Medium corners</div>
```

*CSS*

```css
:root {
  --md-sys-shape-corner-md: 12px;
  --md-sys-shape-corner-lg: 16px;
}

.box {
  padding: 24px 32px;
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-radius: var(--md-sys-shape-corner-md);
}
```

#### Motion

`--md-sys-motion` tokens define the motion scheme: spring tokens
(`--md-sys-motion-spring-<speed>-<spatial|effects>`, each with a matching
`-duration`), easing curves, and durations. Springs are `linear()` easings.
The standard scheme applies to elements inside `.md-motion-standard`.

**Example: A panel that slides with the default spatial spring**

*HTML*

```html
<md-gb-button id="slide" color="filled">Slide</md-gb-button>
<div id="panel" class="panel">Panel</div>
```

*CSS*

```css
.panel {
  margin-block-start: 16px;
  padding: 12px 16px;
  inline-size: fit-content;
  border-radius: var(--md-sys-shape-corner-md);
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  transition: translate var(--md-sys-motion-spring-default-spatial-duration)
    var(--md-sys-motion-spring-default-spatial);
}

.panel.moved {
  translate: 160px 0;
}
```

*JavaScript*

```js
document.querySelector('#slide').addEventListener('click', () => {
  document.querySelector('#panel').classList.toggle('moved');
});
```

### Component

The `md-gb-*` elements do not expose per-component tokens. Change how a
component looks by changing the system tokens it uses (color roles, typescale
styles, shape corners, motion), by scoping them to a selector, or with the
component's attributes such as `variant` and `size`.

**Example: A button that uses the error colors**

*HTML*

```html
<md-gb-button class="error" color="filled">Delete</md-gb-button>
```

*CSS*

```css
md-gb-button.error {
  --md-sys-color-primary: var(--md-sys-color-error);
  --md-sys-color-on-primary: var(--md-sys-color-on-error);
}
```

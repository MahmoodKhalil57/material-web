# Dynamic color

Dynamic color builds a full color scheme, light and dark, from a seed color.

Dynamic color turns one source color into every color role, in light and dark.
Pick a source and a variant, and apply the result to the document or to one
element.

**Example: A button themed from a source color and the expressive variant**

*HTML*

```html
<md-gb-button color="filled">Save</md-gb-button>
```

*JavaScript*

```js
import {applyTheme} from '@material/web/labs/gb/styles/color/dynamic-color.js';

applyTheme(document, {source: '#6750a4', variant: 'expressive'});
```

## Scheme variants

The `variant` decides how the palettes are derived from the source:
`tonal-spot` (the default), `neutral`, `vibrant`, `expressive`, `fidelity`,
`content`, `monochrome`, `rainbow` and `fruit-salad`.

## Contrast levels

Each scheme has standard, medium and high contrast. Set `contrast` on
`applyTheme()`, or select a level for a subtree of the static tokens with a
class.

**Example: Tonal buttons at standard and high contrast**

```html
<div class="md-contrast-standard">
  <md-gb-button color="tonal">Standard</md-gb-button>
</div>
<div class="md-contrast-high">
  <md-gb-button color="tonal">High</md-gb-button>
</div>
```

See [Color](/material-web/3.0/styles/color/) for roles, custom colors and the full options.

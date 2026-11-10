---
title: Dynamic color
section: styles
order: 2
icon: colorize
description: "Dynamic color builds a full color scheme, light and dark, from a seed color."
---
Dynamic color turns one source color into every color role, in light and dark.
Pick a source and a variant, and apply the result to the document or to one
element.

{% demo "A button themed from a source color and the expressive variant" height=120 %}
```html
<md-gb-button color="filled">Save</md-gb-button>
```
```js
import {applyTheme} from '@material/web/styles/color/dynamic-color.js';

applyTheme(document, {source: '#6750a4', variant: 'expressive'});
```
{% enddemo %}

## Scheme variants

The `variant` decides how the palettes are derived from the source:
`tonal-spot` (the default), `neutral`, `vibrant`, `expressive`, `fidelity`,
`content`, `monochrome`, `rainbow` and `fruit-salad`.

## Contrast levels

Each scheme has standard, medium and high contrast. Set `contrast` on
`applyTheme()`, or select a level for a subtree of the static tokens with a
class.

{% demo "Tonal buttons at standard and high contrast" %}
<div class="md-contrast-standard">
  <md-gb-button color="tonal">Standard</md-gb-button>
</div>
<div class="md-contrast-high">
  <md-gb-button color="tonal">High</md-gb-button>
</div>
{% enddemo %}

See [Color](/3.0/styles/color/) for roles, custom colors and the full options.

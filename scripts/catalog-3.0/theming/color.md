## Color scheme

A
[color scheme](https://m3.material.io/styles/color/the-color-system/color-roles#55d2b7d2-0202-4616-887e-f575a7946aac)<!-- {.external} -->
is the group of
[key color tones](https://m3.material.io/styles/color/the-color-system/key-colors-tones#5fdf196d-1e21-4d03-ae63-e802d61ad5ee)<!-- {.external} -->
assigned to specific roles that get mapped to components. In M3 Expressive,
roles are generated from a source color with dynamic color, and each color has a
paired `on-` role for accessible content.

![Full palette derived from baseline colors](../images/color-scheme-light.webp "From five key colors, roles are automatically assigned that map to light theme components")

![Dark palette derived from baseline colors](../images/color-scheme-dark.webp "From five key colors, roles are automatically assigned that map to dark theme components")

### Tokens

Color roles are
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)<!-- {.external} -->
named `--md-sys-color-<role>`. Every role has a corresponding
`--md-sys-color-on-<role>` for content.

Key color | Tokens
--------- | ------------------------------------------------------------
Primary   | `--md-sys-color-primary`, `-primary-container`, `-primary-fixed`, `-primary-fixed-dim`
Secondary | `--md-sys-color-secondary`, `-secondary-container`, `-secondary-fixed`, `-secondary-fixed-dim`
Tertiary  | `--md-sys-color-tertiary`, `-tertiary-container`, `-tertiary-fixed`, `-tertiary-fixed-dim`
Error     | `--md-sys-color-error`, `-error-container`
Neutral   | `--md-sys-color-surface`, `-surface-dim`, `-surface-bright`, `-surface-container-lowest` through `-surface-container-highest`, `-on-surface`, `-on-surface-variant`
Outline   | `--md-sys-color-outline`, `-outline-variant`
Inverse   | `--md-sys-color-inverse-surface`, `-inverse-on-surface`, `-inverse-primary`

#### Light and dark

The tokens use `light-dark()`, so they follow the standard `color-scheme`
property. Where `light-dark()` is not available, the Baseline fallback keeps
the light values and switches to the dark values with `prefers-color-scheme`.

```css
:root {
  color-scheme: light dark; /* follow the system */
}

.always-dark {
  color-scheme: dark;
}
```

#### Dynamic color

`themeFromSource()` generates every role, for light and dark, from a source
color. Choose a scheme variant (such as `tonal-spot`, `vibrant`, `expressive`,
or `fidelity`) and a contrast level (`standard`, `medium`, `high`, or a number
from -1 to 1). The `fidelity` option keeps chosen roles close to the source
color.

```ts
import {
  themeFromSource,
  themeToStyleSheet,
} from '@material/web/labs/gb/styles/color/dynamic-color.js';

const theme = themeFromSource({
  source: '#006a6a',
  variant: 'tonal-spot',
  contrast: 'medium',
  fidelity: {'primary-container': true},
});
document.adoptedStyleSheets.push(themeToStyleSheet(theme));
```

`applyTheme()` does the same for a document or element, and can follow
`prefers-contrast` with `contrast: 'auto'`.

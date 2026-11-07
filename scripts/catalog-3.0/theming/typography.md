### Classes

The type scale is applied with the `font` shorthand tokens and their `-axes`
and `-tracking` companions, which also work inside shadow roots.

```css
h1 {
  font: var(--md-sys-typescale-display-md);
  font-variation-settings: var(--md-sys-typescale-display-md-axes);
  letter-spacing: var(--md-sys-typescale-display-md-tracking);
}
```

### Tokens

The scale has five roles (display, headline, title, body, label), each in
`sm`, `md`, and `lg`, plus emphasized styles per role. Tokens follow
`--md-sys-typescale-<role>-<size>-<property>` with the properties `font`,
`size`, `line-height`, `weight`, `tracking`, and `axes`; the bare
`--md-sys-typescale-<role>-<size>` is the combined `font` shorthand.

Typescale  | Tokens
---------- | ------------------------------------------------------------
Display    | `--md-sys-typescale-display-md-size`, `-line-height`, `-weight`
Headline   | `--md-sys-typescale-headline-md-size`, `-line-height`, `-weight`
Title      | `--md-sys-typescale-title-md-size`, `-line-height`, `-weight`
Body       | `--md-sys-typescale-body-md-size`, `-line-height`, `-weight`
Label      | `--md-sys-typescale-label-md-size`, `-line-height`, `-weight`
Emphasized | `--md-sys-typescale-emphasized-<role>-<size>`

**Language height.** Line heights adapt to the script. Set
`--md-sys-language-height-scale` (1, 1.07, 1.3, or 2) on `:root` to change the
default; text in languages such as Arabic, Thai, or Urdu picks up its height
from `:lang()`.

```css
:root {
  --md-ref-typeface-brand: 'Open Sans';
  --md-sys-typescale-body-md-size: 1rem;
  --md-sys-typescale-body-md-line-height: 1.5rem;
}
```

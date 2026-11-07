---
title: Typography
section: styles
order: 3
description: Typography helps make writing legible and beautiful.
---
> Tip: "typeface" and "typescale" can be confusing. "face" refers to
> `font-family` and `font-weight`.
>
> "scale" refers to a group of `font-family`, `font-size`, `line-height`, and
> `font-weight` tokens.

## Typeface

A [typeface](https://m3.material.io/styles/typography/fonts) is a
`font-family`. In Material there are plain and brand typefaces.

Each typeface has normal, medium, and bold styles (defaults to `400`, `500`, and
`700`). All three weight styles need to be included for a font.

> Important: the default typeface is Roboto Flex, then Roboto. If you do not
> change it, load one of them. For example, from
> [fonts.google.com](https://fonts.google.com/specimen/Roboto+Flex).

### Tokens

Typefaces can be set using
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*).
Tokens follow the naming convention `--md-ref-typeface-<token>`.

Typeface | Token
-------- | -------------------------
Brand    | `--md-ref-typeface-brand`
Plain    | `--md-ref-typeface-plain`

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-ref-typeface.scss)

```css
@import url('https://fonts.googleapis.com/css2?family=Open%20Sans:wght@400;500;700&display=swap');

:root {
  --md-ref-typeface-brand: 'Open Sans';
  --md-ref-typeface-plain: system-ui;
}
```

## Typescale

A
[typescale](https://m3.material.io/styles/typography/type-scale-tokens)
is a collection of font styles: `font-family`, `font-size`, `line-height`, and
`font-weight`. They are organized into roles that describe their purpose.

Material's
[applying type guidelines](https://m3.material.io/styles/typography/applying-type)
explains when to use each typescale role.

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
  --md-sys-typescale-body-md-size: 1rem;
  --md-sys-typescale-body-md-line-height: 1.5rem;
}
```

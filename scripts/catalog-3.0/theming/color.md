## Color scheme

This page follows the subpages of the
[M3 color guidance](https://m3.material.io/styles/color/overview)<!-- {.external} -->
in order: the color system, color roles, choosing a scheme, static color,
dynamic color, advanced customization, and resources. Each part says what the
spec asks for and how to do it with labs/gb. Where labs/gb does not build a
feature yet, the page says so.

All imports come from `@material/web/labs/gb/styles/color/`.

## Color system

The system turns a few inputs into a complete, accessible set of colors. Dynamic
color starts from a source color, runs it through a scheme algorithm, derives
five key colors (primary, secondary, tertiary, neutral, neutral variant) plus
error, builds a tonal palette for each in HCT (hue, chroma, tone), and assigns
tones to color roles. Roles come with a pairing rule: a color and its `on-`
color are chosen so text and icons stay legible. Each role has three contrast
levels (standard, medium, high), so the same scheme can serve people who need
more contrast.

![Full palette derived from baseline colors](../images/color-scheme-light.webp "From five key colors, roles are automatically assigned that map to light theme components")

![Dark palette derived from baseline colors](../images/color-scheme-dark.webp "From five key colors, roles are automatically assigned that map to dark theme components")

In labs/gb:

*   `md-color-tokens.css` is the static baseline: every role as a
    `--md-sys-color-<role>` custom property, with light and dark values.
*   `md-color-tokens-contrast.css` adds medium and high contrast. High contrast
    follows `prefers-contrast: more`, and `.md-contrast-standard`,
    `.md-contrast-medium` and `.md-contrast-high` select a level for a subtree.
*   `md-color-tokens-full.css` also declares the reference palette
    (`--md-ref-palette-*`), the tonal palettes the roles are picked from.
*   `dynamic-color.ts` runs the generation steps at runtime with Material Color
    Utilities (see Dynamic color below).

The new tone-based surface roles (container levels, dim, and bright) and the
fixed accent roles from the latest spec are all part of the tokens, so nothing
extra is needed to use them. HCT itself is not exposed as an API in labs/gb;
the generator uses it internally.

## Color roles

A role is a named job for a color, not a specific hue. Components read roles
(`primary`, `surface-container`) instead of hex values, so a new scheme
re-themes everything. The spec groups them as accent roles (primary,
secondary, tertiary, error, each with `on-`, `-container` and `on-container`
variants), surface roles with `on-surface` and `on-surface-variant`, outline
roles, inverse roles, and add-on roles: fixed accents and bright and dim
surfaces. Layer from lower to higher emphasis, and always put `on-` content on
its matching background.

Role | Tokens
---- | ------
Primary, secondary, tertiary | `--md-sys-color-<accent>`, `-on-<accent>`, `-<accent>-container`, `-on-<accent>-container`
Fixed accents | `--md-sys-color-<accent>-fixed`, `-<accent>-fixed-dim`, `-on-<accent>-fixed`, `-on-<accent>-fixed-variant`
Error | `--md-sys-color-error`, `-on-error`, `-error-container`, `-on-error-container`
Surface | `--md-sys-color-surface`, `-surface-dim`, `-surface-bright`, `-surface-container-lowest` through `-surface-container-highest`, `-on-surface`, `-on-surface-variant`
Outline | `--md-sys-color-outline`, `-outline-variant`
Inverse | `--md-sys-color-inverse-surface`, `-inverse-on-surface`, `-inverse-primary`
Other | `--md-sys-color-scrim`, `-shadow`

Fixed accents keep the same value in light and dark themes, for content that
should not flip, such as a brand surface. Use `surface-dim` and
`surface-bright` for areas that stay darker or brighter than the main surface
in both themes.

```css
.card {
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
.card .badge {
  background: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
}
```

### Light and dark

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

The deprecated `background` and `surface-tint` roles are not defined; use
`surface` and a surface container instead.

## Choosing a scheme

Pick **static** color when you want a fixed, predictable palette: a brand
identity, a product with a strict visual identity, or a small, controlled UI.
Pick **dynamic** color when the palette should come from the person or the
content: a wallpaper, a profile color, an album cover. You can also mix
both: a dynamic scheme for most of the UI and static colors for brand and
semantic meaning.

In labs/gb that is a choice of which stylesheet or function you load:

*   Static: import `md-color-tokens.css` (and `md-color-tokens-contrast.css`
    if you want contrast levels). No JavaScript.
*   Dynamic: call `themeFromSource()`, `themeFromImage()` or `applyTheme()`,
    which output the same custom properties and override the static ones.

## Static color

The spec has two kinds. **Baseline** is the default purple scheme, ready to use
and a good starting point for prototypes. **Custom brand** keeps the same
roles but replaces the key colors with your brand colors, usually exported from
the Material Theme Builder or a design tool.

Baseline in labs/gb is the default stylesheet:

```html
<link rel="stylesheet" href="@material/web/labs/gb/styles/color/md-color-tokens.css">
```

For a custom brand scheme, generate the roles once and keep the CSS, or
override the tokens by hand. If your brand colors should become the whole
scheme, give them to `palettes` (see Advanced customization).

```css
:root {
  --md-sys-color-primary: light-dark(#006a6a, #4cdada);
  --md-sys-color-on-primary: light-dark(#ffffff, #003737);
  /* ... the rest of the roles you need ... */
}
```

Generating a brand scheme from a source color and exporting a stylesheet is
one call: `themeToCss(themeFromSource({source: '#006a6a'}))`. A Theme Builder
file importer is not built in labs/gb yet.

## Dynamic color

A dynamic scheme is generated from a source. The spec distinguishes
**user-generated** color (a wallpaper or a person's pick, usually with the
`tonal-spot` variant), **content-based** color (taken from an image or content
on screen, with the `content` variant), and **multiple sources** (several
schemes on one screen, each scoped to a region).

```ts
import {
  applyTheme,
  sourceColorFromImage,
  themeFromImage,
  themeFromSource,
  themeToStyleSheet,
} from '@material/web/labs/gb/styles/color/dynamic-color.js';

// User-generated: a hand-picked source for the whole document.
const theme = themeFromSource({
  source: '#006a6a',
  variant: 'tonal-spot',
  contrast: 'medium',
});
document.adoptedStyleSheets.push(themeToStyleSheet(theme));

// Content-based: quantize an image, and scope the result to one element.
applyTheme(card, {source: await sourceColorFromImage(img), variant: 'content'});

// Or generate directly from an image.
const albumTheme = await themeFromImage(img);
```

*   Variants: `tonal-spot`, `neutral`, `vibrant`, `expressive`, `fidelity`,
    `content`, `monochrome`, `rainbow`, and `fruit-salad`. The newest color
    rules (2025) exist for tonal spot, neutral, vibrant and expressive; the
    others use the original rules. `theme.specVersion` reports what was used.
*   Contrast: `standard`, `medium`, `high`, or a number from -1 to 1.
    `applyTheme()` accepts `contrast: 'auto'`, which uses high contrast when
    the user prefers more contrast.
*   Platform: `phone` (also right for the web) or `watch`.
*   `applyTheme(target, ...)` accepts a document, a shadow root, or an element.
    An element gets inline custom properties, so its subtree has its own
    scheme. `clearTheme()` removes it.
*   Android's system-wide wallpaper source and the Material Theme Builder
    preview are not part of labs/gb; the library only generates the scheme.

When using content-based color, keep semantic colors (error, success) stable
and make sure the surrounding UI stays readable if the image is very
saturated or very dark. The scheme already guarantees accessible on-color
pairs.

## Advanced customization

The spec lists three kinds of customization. This table shows what labs/gb
covers.

Spec topic | In labs/gb
---------- | ----------
Combine multiple color schemes | Yes: call `applyTheme(element, ...)` on different elements, each with its own source, variant and contrast.
Map or remap colors on UI elements | Yes: components read roles, so reassign a role in CSS (`--md-sys-color-surface: var(--md-sys-color-surface-container);`) on a subtree.
Define static colors | Yes: `customColors` adds a color with four roles.
Define custom color roles | Not built in labs/gb yet: there is no palette-and-tone role definition.
Define your own baseline scheme | Yes: override the static tokens, or pass `palettes`.
Define your own dynamic scheme | Yes: `palettes` takes your own primary, secondary, tertiary, neutral, neutral variant and error key colors.
Use color fidelity | Yes: `fidelity` per role.
Harmonize colors | Yes: `customColors` harmonize toward the source by default, and `harmonize(color, source)` is exported.

```ts
const theme = themeFromSource({
  source: '#6750a4',
  // A static color gets --md-sys-color-success, -on-success,
  // -success-container and -on-success-container.
  customColors: [
    {name: 'success', value: '#2e7d32'},                   // harmonized
    {name: 'brand', value: '#ff5722', harmonize: false},   // exact
  ],
  // Keep this role's tones close to the source color.
  fidelity: {'primary-container': true},
  // Use your own key color for one palette.
  palettes: {tertiary: '#b3261e'},
});
```

Harmonize colors that carry meaning but should still sit in the theme, such
as success and warning. Do not harmonize brand colors that must stay exact.
Prefer an existing role before adding custom colors, and keep contrast pairs
accessible; `customColors` roles follow the same on-color convention as the
accents.

## Resources

The spec's resources page links to the Material Theme Builder, the Figma
plugin, and tutorials and codelabs. For code:

*   [Material Theme Builder Figma plugin](https://www.figma.com/community/plugin/1034969338659738588/Material-Theme-Builder)<!-- {.external} -->
    to design a scheme and export tokens.
*   [`material-color-utilities`](https://www.npmjs.com/package/@material/material-color-utilities)<!-- {.external} -->,
    the library `dynamic-color.ts` is built on.
*   [Color on m3.material.io](https://m3.material.io/styles/color/overview)<!-- {.external} -->
    for the full guidance.

---
title: Icons
section: styles
order: 6
description: md-gb-icon shows a Material Symbols icon.
---

`md-gb-icon` shows a Material Symbols icon. Its content is the ligature name
of the symbol, such as `home`. Find names and previews at
[fonts.google.com/icons](https://fonts.google.com/icons). Symbols come in three
styles: outlined, rounded and sharp.

The element is a thin wrapper over the font. It reads its size, color and font
variation settings from custom properties.

## Loading the font

The element's default font family is `Material Symbols`. The Google Fonts
family for the outlined style is `Material Symbols Outlined`, so set
`--md-icon-font` to the family you load:

```css
:root {
  --md-icon-font: 'Material Symbols Outlined';
}
```

Load the font once in the page head. Request only the axes you use; add `GRAD`
to use `--md-icon-grad`.

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..200&display=block">
```

## Size and color

- `--md-icon-size` sets the size. The default is `24px`. Symbols support 20dp,
  24dp, 40dp and 48dp; use 20dp for dense layouts and 40dp or 48dp for display
  use.
- `--md-icon-color` sets the color. The default is `currentColor`.
- The optical size follows the icon size automatically, so a larger icon gets a
  matching optical size. Set `--md-icon-opsz` only to override it.

## Variable font axes

Each style has four axes. The element exposes them as custom properties:

| Property | Axis | Default | Range | Notes |
| --- | --- | --- | --- | --- |
| `--md-icon-wght` | Weight | `400` | 100 to 700 | 400 is the 2dp stroke for standard icons. Use at least 200 at 24dp. |
| `--md-icon-fill` | Fill | `0` | 0 to 1 | 1 is filled, 0 is outlined. The change animates. |
| `--md-icon-grad` | Grade | `0` | Negative to positive | Gb sets `-25` when the color scheme is dark, where icons are light on dark. Positive values add emphasis. |
| `--md-icon-opsz` | Optical size | follows size | 20 to 48dp | Not set by default. |

Fill is the usual way to show a selected state. Use the outlined symbol when
the item is unselected and the filled one when it is selected.

## Baseline next to text

Symbols next to text need a baseline shift to line up. The element already
applies `vertical-align: -0.115em` (of its own size), which lowers the icon so
it lines up with the text beside it: about 2.8px at 24dp. Keep that `vertical-align` if you override the
style, or the icon will look too high.

## Targets

A 24dp icon needs a 48dp target by default. A 20dp icon can use a 40dp target
when a mouse and keyboard are the main input. `md-gb-icon-button` keeps a 48dp
minimum target (`--target-size`) even when the icon inside is smaller, so use it
rather than a bare icon in a clickable element.

## Accessibility

- An icon is decorative unless it has a label. `md-gb-icon` sets
  `aria-hidden="true"` by default, so screen readers skip it. That is correct
  when the text beside the icon already says what it means.
- For an icon-only control, put the accessible name on the control with
  `aria-label`, and leave the icon hidden. Only set `aria-hidden="false"` on an
  icon that must be announced on its own.
- Add a text label when the symbol is abstract, complex, or carries a key
  action. A symbol shown below 20dp should have one too.

## Examples

Change an axis or the size with the custom properties.

{% demo "A default icon, a filled icon and a large bold icon" %}
<md-gb-icon>home</md-gb-icon>
<md-gb-icon style="--md-icon-fill: 1">home</md-gb-icon>
<md-gb-icon style="--md-icon-size: 40px; --md-icon-wght: 500">star</md-gb-icon>
{% enddemo %}

Put the accessible name on the control, not on the icon.

{% demo "An icon-only button with an accessible name" %}
<md-gb-icon-button aria-label="Favorite">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

## What to watch out for

- An icon with no font loaded shows the ligature text, such as `favorite`, not
  a symbol. Load the font before the page relies on it.
- Do not mix styles in one icon set. Pick outlined, rounded or sharp for the
  whole product.
- Do not use the lightest weight for standard 24dp icons.
- Keep the icon's content inside the 20dp live area of the 24dp grid. It can
  reach into the 2dp padding for extra weight, but never past the 24dp edge.

---
name: Spacing
title: Spacing
order: 8
expressiveOnly: true
---

# Spacing

Spacing is the distance around and between elements. It shapes components
(the space between an icon and its label) and layouts (the margin between the
content and the window edge). Spacing follows an 8dp scale, and tokens keep that
scale in one place.

## Parts of spacing

There are three kinds:

- **Padding** is the space inside an element, between its edge and its
  content.
- **Gaps** are the spaces between elements in a row, column or grid.
- **Margins** are the space outside an element, between it and its parent or
  the screen edge.

Each one can be vertical, horizontal, or on one edge: top, bottom, leading or
trailing. Leading and trailing swap sides in right-to-left languages, so write
them as logical properties (`padding-inline`, `margin-inline-start`).

Define padding and gaps on the parent container first. Margins on child
elements are harder to keep uniform, so use them only for space beyond the
parent's padding, or in a layout.

## The scale

The unit is `--md-sys-space-unit`, 8px. Each token is a multiple of it. The
token name is the value times 100, so `space200` is 2 units (16px). The
in-between values (2, 4, 6 and 10px) are nested units for small gaps, such as
an icon and its label.

| Token | Value | Token | Value |
| --- | --- | --- | --- |
| `--md-sys-space-0` | 0px | `--md-sys-space-400` | 32px |
| `--md-sys-space-25` | 2px | `--md-sys-space-450` | 36px |
| `--md-sys-space-50` | 4px | `--md-sys-space-500` | 40px |
| `--md-sys-space-75` | 6px | `--md-sys-space-600` | 48px |
| `--md-sys-space-100` | 8px | `--md-sys-space-700` | 56px |
| `--md-sys-space-125` | 10px | `--md-sys-space-800` | 64px |
| `--md-sys-space-150` | 12px | `--md-sys-space-900` | 72px |
| `--md-sys-space-175` | 14px | | |
| `--md-sys-space-200` | 16px | | |
| `--md-sys-space-250` | 20px | | |
| `--md-sys-space-300` | 24px | | |

The tokens are defined in `labs/gb/styles/space/md-space-tokens.scss`. They
are fixed pixel values, so they do not grow with the text size.

A product can add a token that follows the same pattern. For example,
`--md-sys-space-225: calc(var(--md-sys-space-unit) * 2.25)` gives 18px.

## Adaptive spacing

Some spacing should change with the window. Three adaptive tokens do this:

- `--md-sys-space-adaptive-inline`: horizontal padding
- `--md-sys-space-adaptive-block`: vertical padding
- `--md-sys-space-adaptive-gap`: gap between elements

Each one points at a scale token that depends on the window size class. The
classes are the ones in [Adaptive layout](/3.0/foundations/adaptive-layout/).

| Class | Inline | Block | Gap |
| --- | --- | --- | --- |
| compact | 16px | 16px | 8px |
| medium | 24px | 24px | 16px |
| expanded | 24px | 32px | 16px |
| large | 32px | 32px | 24px |
| extra-large | 32px | 40px | 24px |

Direct children of a `.md-window` element follow that element's width, so a
layout can adapt to its pane rather than the screen. Other elements follow the
viewport. The spacing unit does not change with the window.

```css
.item-list {
  display: grid;
  gap: var(--md-sys-space-adaptive-gap);
  padding-inline: var(--md-sys-space-adaptive-inline);
  padding-block: var(--md-sys-space-adaptive-block);
}
```

> The adaptive tokens are defined, but no labs/gb component reads them yet.
> Use them in your own layouts.

## How components use spacing

Components map their padding, margins and gaps to scale tokens in their own
custom properties, so a product can change one mapping and every use follows.
The search bar is an example. Its leading space is `space200` (16px), the gap
between its icon and its input is `space50` (4px), and its glyph margin is
24px, or 12px when focused. Its styles are in `labs/gb/components/search/`.

Density changes components, not the spacing scale. Each density step removes
height from the component, and the component's touch target stays 48dp. See
[Density](/3.0/foundations/density/).

## Accessibility

The spec's accessibility guidance is one point: when text is scaled up to
200%, keep the same spacing. Spacing tokens are fixed in pixels, so the spacing
stays the same while the text grows. For touch targets and focus, see
[Accessibility](/3.0/foundations/accessibility/).

## What to watch out for

- Use the scale tokens, not hardcoded pixel values. A raw `16px` will not
  follow a remapped token.
- Set spacing on the parent, not the children, unless you need space beyond
  the parent's padding.
- Use logical properties (`padding-inline`, `gap`) so right-to-left layouts
  flip correctly.
- Do not adapt spacing to density yourself. Set the `density` attribute on the
  component and let it apply its own steps.
- Keep the spacing the same at 200% text. Do not replace a token with a value
  that grows with the text.

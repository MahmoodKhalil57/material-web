# Spacing

Spacing is the distance around and between elements.

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
classes are the ones in [Adaptive layout](/material-web/3.0/foundations/adaptive-layout/).

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

**Example: A list with adaptive gap and padding**

*HTML*

```html
<div class="item-list">
  <md-gb-button color="tonal">Inbox</md-gb-button>
  <md-gb-button color="tonal">Drafts</md-gb-button>
  <md-gb-button color="tonal">Sent</md-gb-button>
</div>
```

*CSS*

```css
.item-list {
  display: grid;
  gap: var(--md-sys-space-adaptive-gap);
  padding-inline: var(--md-sys-space-adaptive-inline);
  padding-block: var(--md-sys-space-adaptive-block);
  background: var(--md-sys-color-surface-container-low);
}
```

> The adaptive tokens are defined, but no labs/gb component reads them yet:
> component spacing is the same at every window size today. Use them in your
> own layouts, or remap a component's own spacing property to one (see below).

## How components use spacing

Components map their padding, margins and gaps to scale tokens in their own
custom properties (`--leading-space`, `--icon-label-space` and so on), so a
product can change one mapping and every use follows. For example,
`md-gb-button { --leading-space: var(--md-sys-space-adaptive-inline); }` makes a
button's leading padding follow the window class.

| Component | Scale tokens it reads |
| --- | --- |
| Button, icon button, FAB, split button, segmented button | `space50` to `space200` for leading and trailing space and the icon-label gap |
| Search bar | `space0` to `space300`: leading space `space200`, icon and input gap `space50`, glyph margin `space300` (24px), or `space150` (12px) when focused. Styles are in `labs/gb/components/search/` |
| App bar | `space0` to `space300` for icon, leading and trailing space, the title inset and bottom space, and the actions' inline margin |
| Toolbar, navigation drawer | `space50` to `space200` for container padding and item spacing |
| Chip, text field, tooltip, menu, divider, badge, tabs | `space25` to `space200` for padding, label gaps and insets |
| Date picker, time picker, carousel | `space50` to `space900` for header, actions and content padding |
| App scaffold | `space200` for the FAB's distance from the edge and the gap above the bottom bar |
| Pane scaffold | `--md-sys-layout-margin` and `--md-sys-layout-spacer` (the layout tokens), not the scale |

Every value is the same as before, so nothing changes visually. A few values
are still plain pixels: some generated button, list, FAB, button group and
navigation rail values, the dialog and sheet paddings, and the few values a
component reads in code (a carousel's leading padding, a tooltip's viewport
margin, a tab indicator's inset).

Density changes components, not the spacing scale. Each density step removes
height from the component, and the component's touch target stays 48dp. See
[Density](/material-web/3.0/foundations/density/).

## Accessibility

The spec's accessibility guidance is one point: when text is scaled up to
200%, keep the same spacing. Spacing tokens are fixed in pixels, so the spacing
stays the same while the text grows. For touch targets and focus, see
[Accessibility](/material-web/3.0/foundations/accessibility/).

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

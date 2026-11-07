---
title: Migration
section: about
order: 4
description: Version 3.0 renames most elements from md- to md-gb- and moves them to Material 3 Expressive.
---

Version 3.0 renames most elements from `md-*` to `md-gb-*` and moves them to
Material 3 Expressive. Many names stay the same, but some attributes and slots
change, and a few components are no longer recommended. This page lists the
changes. The 2.5.0 docs stay on the root of this site.

## Start with the styles

Load the 3.0 design tokens once per document:

```js
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);
```

Then import each `md-gb-*` element you use from
`@material/web/labs/gb/components/`.

## Element and attribute map

Element names change as listed below. Where the table says "dropped", the 2.5.0
attribute has no 3.0 counterpart and you can remove it.

| 2.5.0 | 3.0 | Changes |
| --- | --- | --- |
| `md-filled-button` | `md-gb-button` | `color="filled"` |
| `md-elevated-button` | `md-gb-button` | `color="elevated"` |
| `md-filled-tonal-button` | `md-gb-button` | `color="tonal"` |
| `md-outlined-button` | `md-gb-button` | `color="outlined"` |
| `md-text-button` | `md-gb-button` | `color="text"` |
| `md-icon-button` | `md-gb-icon-button` | `color="standard"`; `toggle` and `flip-icon-in-rtl` dropped |
| `md-filled-icon-button` | `md-gb-icon-button` | `color="filled"` |
| `md-filled-tonal-icon-button` | `md-gb-icon-button` | `color="tonal"` |
| `md-outlined-icon-button` | `md-gb-icon-button` | `color="outlined"` |
| `md-fab`, `md-branded-fab` | `md-gb-fab` | `variant` becomes `color` (`primary-container`, `secondary-container`, `tertiary-container`); `size="large"` becomes `size="lg"`; `label` becomes text content; `size`, `lowered` and `variant` dropped |
| `md-checkbox` | `md-gb-checkbox` | `touch-target` dropped |
| `md-radio` | `md-gb-radio` | `touch-target` dropped |
| `md-switch` | `md-gb-switch` | none |
| `md-slider` | `md-gb-slider` | `aria-*` label and value text attributes renamed (see below) |
| `md-divider` | `md-gb-divider` | `inset`, `inset-start` and `inset-end` dropped |
| `md-list`, `md-list-item` | `md-gb-list`, `md-gb-list-item` | `start` slot becomes `leading`, `end` becomes `trailing`, `trailing-supporting-text` becomes `trailing-text`; `headline` slot is unwrapped |
| `md-menu`, `md-menu-item` | `md-gb-menu`, `md-gb-menu-item` | `positioning`, `menu-corner` and `anchor-corner` dropped on `md-gb-menu`; the same slot changes as lists |
| `md-linear-progress` | `md-gb-progress` | `indeterminate`, `buffer` and `four-color` dropped |
| `md-circular-progress` | `md-gb-progress circular` | `indeterminate` and `four-color` dropped |
| `md-filled-text-field` | `md-gb-text-field` | none (filled is the default) |
| `md-outlined-text-field` | `md-gb-text-field` | `variant="outlined"` |
| `md-filled-select` | `md-gb-select` | `menu-positioning`, `clamp-menu-width`, `menu-align` and `quick` dropped |
| `md-outlined-select` | `md-gb-select` | `variant="outlined"`, same drops as above |
| `md-select-option` | `md-gb-select-option` | `headline` slot is unwrapped; `start` becomes `leading`, `end` becomes `trailing` |
| `md-dialog` | `md-gb-dialog` | the `content` slot is removed, so the content goes in the default slot |
| `md-tabs` | `md-gb-tabs` | `variant="secondary"` when it holds secondary tabs; `auto-activate` and `active-tab-index` dropped |
| `md-primary-tab`, `md-secondary-tab` | `md-gb-tab` | the label goes in `slot="label"`; `inline-icon`, `has-icon`, `active` and `icon-only` dropped |
| `md-chip-set` | `md-gb-chip-set` | none |
| `md-assist-chip` | `md-gb-chip` | `color="elevated"` if it was `elevated`; `label` becomes text content |
| `md-filter-chip` | `md-gb-chip` | `type="filter"`; same color rule |
| `md-input-chip` | `md-gb-chip` | `type="input"` with `removable` |
| `md-suggestion-chip` | `md-gb-chip` | `type="suggestion"`; same color rule |
| `md-icon` | `md-gb-icon` | inside a button, icon button, FAB or tab, the `slot="icon"` is removed and the icon goes in DOM order |

If the icon is not an `md-icon` (for example an inline SVG), wrap it in
`md-gb-icon`.

## Attributes to rename by hand

Converting the elements does not rename every attribute. Update these by hand:

- `md-gb-slider`: `aria-label-start` becomes `label-start`, `aria-label-end`
  becomes `label-end`, `aria-valuetext-start` becomes `valuetext-start`, and
  `aria-valuetext-end` becomes `valuetext-end`. The `aria-` prefix is reserved
  for ARIA attributes, so the 3.0 names do not use it. `value-label-start` and
  `value-label-end` keep their names.
- `md-gb-dialog`: `full-screen` applies only on compact windows. Above that,
  the dialog is a basic dialog with the same slots. Add `always-full-screen` to
  keep the full-screen layout at every window size. The 2.5.0 `md-dialog` has
  no full-screen attribute, so this is new in 3.0.

## Recommendations that changed

The Expressive spec no longer recommends some 2.5.0 patterns. The components
remain available, but for new work use the replacement below.

- **Segmented buttons** are replaced by a connected button group:
  `md-gb-button-group variant="connected"`.
- **Navigation drawer** is replaced by an expanded navigation rail:
  `md-gb-nav-rail` with `expanded`. Use `modal` when it overlays content.
- **Bottom app bar** is replaced by a docked toolbar: `md-gb-toolbar docked`.
- **Medium and large app bars** are replaced by medium and large flexible app
  bars: `md-gb-app-bar size="md"` and `size="lg"`.
- **Small FABs and surface-colored FABs** are replaced by the default FAB size
  and the container colors (`primary-container`, `secondary-container`,
  `tertiary-container`).

## Watch out for

- Chips and FABs no longer take their text from a `label` attribute. Put the
  text in the element instead, as the table shows.
- An `md-gb-*` element that is not imported is not upgraded, so it renders as
  an unknown element.
- Selectors, queries and tests that use the old `md-*` tag names need the new
  names too.

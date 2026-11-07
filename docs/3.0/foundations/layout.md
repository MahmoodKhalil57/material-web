---
title: Layout
section: foundations
order: 6
description: "Layout adapts an app to the window with window size classes, a column grid, margins and panes."
---
Layout adapts an app to the window. The window size class (see
[Adaptive layout](/3.0/foundations/adaptive-layout/#window-size-classes))
sets the layout tokens
on `:root`:

*   `--md-sys-layout-columns`: 4 at compact, 8 at medium and expanded, 12 from
    large up.
*   `--md-sys-layout-margin`: 16px at compact, 24px above.
*   `--md-sys-layout-spacer`: the gutter between columns, 16px at compact,
    24px above.

## Window size classes and grid

`.md-layout-grid` lays its children out on the column grid, with the margin as
inline padding and the spacer as the gap.

{% demo "A column grid with three buttons" %}
<div class="md-layout-grid">
  <md-gb-button color="tonal">Inbox</md-gb-button>
  <md-gb-button color="tonal">Drafts</md-gb-button>
  <md-gb-button color="tonal">Sent</md-gb-button>
</div>
{% enddemo %}

Add `.md-window` to an element so its direct children follow that element's
width instead of the viewport.

```html
<div class="md-window">
  <div class="md-layout-grid">…</div>
</div>
```

To react in code, observe the class of the window or of an element:

```js
import {observeWindowSizeClass} from '@material/web/labs/gb/styles/layout/window-size-class.js';

observeWindowSizeClass(window, (sizeClass) => {
  console.log(sizeClass);
});
```

## Foldables

On a foldable device, the fold's position and size are available as
`--md-sys-layout-fold-left` and `--md-sys-layout-fold-width` (vertical fold) or
`--md-sys-layout-fold-top` and `--md-sys-layout-fold-height` (horizontal fold).
To react in code, observe the fold. The callback gets `null` when there is none.

```js
import {observeFold} from '@material/web/labs/gb/styles/layout/viewport-segments.js';

observeFold((fold) => {
  console.log(fold?.orientation);
});
```

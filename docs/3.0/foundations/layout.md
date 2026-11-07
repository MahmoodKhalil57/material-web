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

{% demo "A grid that follows the width of its window element" %}
```html
<div class="md-window">
  <div class="md-layout-grid">
    <md-gb-button color="tonal">Inbox</md-gb-button>
    <md-gb-button color="tonal">Drafts</md-gb-button>
  </div>
</div>
```
{% enddemo %}

To react in code, observe the class of the window or of an element:

{% demo "The window size class of the preview" height=120 %}
```html
<output id="size-class" aria-live="polite"></output>
```
```js
import {observeWindowSizeClass} from '@material/web/labs/gb/styles/layout/window-size-class.js';

const output = document.querySelector('#size-class');
observeWindowSizeClass(window, (sizeClass) => {
  output.textContent = sizeClass;
});
```
{% enddemo %}

## Foldables

On a foldable device, the fold's position and size are available as
`--md-sys-layout-fold-left` and `--md-sys-layout-fold-width` (vertical fold) or
`--md-sys-layout-fold-top` and `--md-sys-layout-fold-height` (horizontal fold).
To react in code, observe the fold. The callback gets `null` when there is none.

{% demo "The fold of the device, if there is one" height=120 %}
```html
<output id="fold" aria-live="polite">No fold</output>
```
```js
import {observeFold} from '@material/web/labs/gb/styles/layout/viewport-segments.js';

const output = document.querySelector('#fold');
observeFold((fold) => {
  output.textContent = fold ? `${fold.orientation} fold` : 'No fold';
});
```
{% enddemo %}

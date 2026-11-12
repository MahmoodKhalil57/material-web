---
title: Floating action button (FAB)
section: components
category: buttons
order: 4
summary: Put the primary action of a screen within reach
description: A FAB represents the most important action on a screen, and an extended FAB adds a text label.
---
{% demo "A FAB with an edit icon" %}
<md-gb-fab aria-label="Compose">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
{% enddemo %}

{% shadcn "fab" %}

## Usage guidelines

*   **One main action.** Use a FAB for the most important action on a screen. It floats in front of other content.
*   **Pick a size.** Choose by visual hierarchy: the default FAB, a medium FAB (most recommended) or a [large FAB](#sizes).
*   **Add a label for emphasis.** An [extended FAB](#extended) shows a text label next to its icon. It can [collapse](#collapse-on-scroll) while a page scrolls.
*   **Place it consistently.** A FAB can sit at the start, center or end, above a navigation bar or nested in it.

## Anatomy

A FAB holds an icon in its default slot. Set `label` to make it an extended FAB.

{% demo "A FAB with a share icon" %}
<md-gb-fab aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-fab>
{% enddemo %}

## Examples

### Extended

Set `label` for an extended FAB. The label is its accessible name.

{% demo "An extended FAB with an icon and the label Compose" %}
<md-gb-fab label="Compose">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
{% enddemo %}

### Without an icon

An extended FAB is the only FAB that can leave out its icon.

{% demo "An extended FAB with only a label" %}
<md-gb-fab label="Reroute"></md-gb-fab>
{% enddemo %}

### Colors

Set `color` to `primary`, `primary-container` (default), `secondary`, `secondary-container`, `tertiary` or `tertiary-container`.

{% demo "FABs in primary, secondary and tertiary container colors" %}
<md-gb-fab color="primary-container" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab color="secondary-container" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab color="tertiary-container" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
{% enddemo %}

### Sizes

Set `size` to `md` or `lg`. The default is the standard FAB. `sm` is a 40dp FAB that the spec no longer recommends.

{% demo "A default, a medium and a large FAB" %}
<md-gb-fab aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab size="md" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
<md-gb-fab size="lg" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-fab>
{% enddemo %}

### Collapsed

Set `expanded="false"` to collapse an extended FAB to an icon-only FAB. Set the `expanded` property to change it later.

{% demo "A collapsed extended FAB" %}
<md-gb-fab label="Compose" expanded="false">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
{% enddemo %}

### Collapse on scroll

Set `scroll-target` to the id of a scrolling container, or `window`. The FAB collapses while it scrolls down and expands while it scrolls up. A cancelable `toggle` event fires first.

{% demo "An extended FAB that collapses while its list scrolls down" height=300 %}
```html
<div id="content">
  <p>Message 1</p>
  <p>Message 2</p>
  <p>Message 3</p>
  <p>Message 4</p>
  <p>Message 5</p>
  <p>Message 6</p>
  <p>Message 7</p>
  <p>Message 8</p>
  <md-gb-fab label="Compose" scroll-target="content">
    <md-gb-icon>edit</md-gb-icon>
  </md-gb-fab>
</div>
```
```css
#content {
  inline-size: 100%;
  block-size: 240px;
  overflow: auto;
}

md-gb-fab {
  position: sticky;
  inset-block-end: 16px;
}
```
{% enddemo %}

## Accessibility

*   An icon-only FAB needs an `aria-label` that describes its action, such as "Compose a new message".
*   An extended FAB uses its `label` as its name, also while collapsed. Add `aria-label` only for more context.
*   An icon-only FAB shows a tooltip on hover and focus. Set `tooltip="false"` to turn it off.
*   A FAB fixed over scrolling content shouldn't hide focused elements. Register it with `setupScrollPadding()` from `appbar/scroll-padding.js`.
*   Tab focuses the FAB, and Enter or Space activates it.

## API reference

{% api "fab" %}

---
title: Carousel
section: components
order: 6
description: A carousel is a scrollable list of visual items that change size as they move through the layout.
---
{% demo "A multi-browse carousel of three destinations" %}
<md-gb-carousel aria-label="Destinations" style="--item-width: 186px">
  <md-gb-carousel-item label="Mountains">
    <div style="background: var(--md-sys-color-primary-container)"></div>
    <span slot="label">Mountains</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Coastline">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
    <span slot="label">Coastline</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Desert">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
    <span slot="label">Desert</span>
  </md-gb-carousel-item>
</md-gb-carousel>
{% enddemo %}

## Usage guidelines

*   **Lead with visuals.** Items emphasize an image and can carry a brief label that adapts to the item size.
*   **Choose a layout.** Use `multi-browse` for varied sizes, `hero` to feature an item, `uncontained` for items that run edge to edge, and `full-screen` for one item at a time.
*   **Match scrolling to the layout.** Snap scrolling suits multi-browse, hero and full-screen. Free scrolling suits uncontained.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A carousel holds `md-gb-carousel-item` elements. Each has a visual in its default slot and an optional label.

```html
<md-gb-carousel>
  <md-gb-carousel-item>
    <img>
    <span slot="label"></span>
  </md-gb-carousel-item>
  …
</md-gb-carousel>
```

## Examples

### Hero

Set `layout="hero"` to feature a large item with small items beside it. Add `alignment="center"` to center it.

{% demo "A hero carousel" %}
<md-gb-carousel layout="hero" aria-label="Featured trips" style="--item-width: 186px">
  <md-gb-carousel-item label="Mountains">
    <div style="background: var(--md-sys-color-primary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Coastline">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Desert">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
  </md-gb-carousel-item>
</md-gb-carousel>
{% enddemo %}

### Uncontained

Set `layout="uncontained"` for items of one size that scroll freely. `uncontained-multi-aspect` allows items with different aspect ratios.

{% demo "An uncontained carousel" %}
<md-gb-carousel layout="uncontained" aria-label="Albums" style="--item-width: 186px">
  <md-gb-carousel-item label="Morning">
    <div style="background: var(--md-sys-color-primary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Noon">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Evening">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Night">
    <div style="background: var(--md-sys-color-primary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Dawn">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
  </md-gb-carousel-item>
</md-gb-carousel>
{% enddemo %}

### Linked items

Give an item `href` to make it a link. Without it, the item is a button.

{% demo "Carousel items that link to pages" %}
<md-gb-carousel aria-label="Destinations" style="--item-width: 186px">
  <md-gb-carousel-item label="Mountains" href="/mountains">
    <div style="background: var(--md-sys-color-primary-container)"></div>
    <span slot="label">Mountains</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Coastline" href="/coastline">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
    <span slot="label">Coastline</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Desert" href="/desert">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
    <span slot="label">Desert</span>
  </md-gb-carousel-item>
</md-gb-carousel>
{% enddemo %}

### Scroll mode and orientation

Set `scroll-mode` to `snap` or `free`, and `orientation` to `horizontal` or `vertical`. The full-screen layout scrolls vertically by default.

```html
<md-gb-carousel layout="full-screen" scroll-mode="snap" aria-label="Stories">
  …
</md-gb-carousel>
```

## Accessibility

*   The carousel is a region with the role description "carousel". Name it with `aria-label`.
*   Each item's `label` is its accessible name, read with its position in the set.
*   Tab or the arrow keys move between items, and Enter or Space activates the focused one.
*   Give images a text alternative, or hide decorative ones.

## API reference

{% gbapi "carousel" %}

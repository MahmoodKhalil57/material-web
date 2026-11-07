---
title: Navigation Bar
section: components
order: 18
description: A navigation bar lets people switch between a small number of top-level destinations, and can hide as the page scrolls.
---
{% demo "A navigation bar with four destinations and Home active" %}
<md-gb-nav-bar aria-label="Primary">
  <md-gb-nav-bar-item active href="#home">
    <md-gb-icon slot="icon">home</md-gb-icon>
    Home
  </md-gb-nav-bar-item>
  <md-gb-nav-bar-item href="#explore">
    <md-gb-icon slot="icon">explore</md-gb-icon>
    Explore
  </md-gb-nav-bar-item>
  <md-gb-nav-bar-item href="#library">
    <md-gb-icon slot="icon">library_music</md-gb-icon>
    Library
  </md-gb-nav-bar-item>
  <md-gb-nav-bar-item href="#profile">
    <md-gb-icon slot="icon">person</md-gb-icon>
    Profile
  </md-gb-nav-bar-item>
</md-gb-nav-bar>
{% enddemo %}

## Usage guidelines

*   **Use it in compact and medium windows.** From expanded windows up, switch to a [navigation rail](/3.0/components/navigation-rail/).
*   **Keep three to five destinations.** They should be of equal importance.
*   **Keep destinations consistent.** The same destinations appear on every screen of the app.
*   **Pick the item layout.** Use [vertical](#item-layout) items in compact windows and horizontal items from medium windows.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A navigation bar holds items. Each item has an icon, a label and an optional badge.

```html
<md-gb-nav-bar>
  <md-gb-nav-bar-item>
    <md-gb-icon slot="icon"></md-gb-icon>
    <span slot="badge"></span>
    Label
  </md-gb-nav-bar-item>
  …
</md-gb-nav-bar>
```

## Examples

### Item layout

Set `item-layout` to `vertical` (the default) or `horizontal`. With `auto`, items are vertical in compact windows and horizontal from 600px.

{% demo "A navigation bar with horizontal items" %}
<md-gb-nav-bar item-layout="horizontal" aria-label="Library">
  <md-gb-nav-bar-item active>
    <md-gb-icon slot="icon">auto_awesome</md-gb-icon>
    For you
  </md-gb-nav-bar-item>
  <md-gb-nav-bar-item>
    <md-gb-icon slot="icon">bookmark</md-gb-icon>
    Saved
  </md-gb-nav-bar-item>
  <md-gb-nav-bar-item>
    <md-gb-icon slot="icon">settings</md-gb-icon>
    Settings
  </md-gb-nav-bar-item>
</md-gb-nav-bar>
{% enddemo %}

### Badges

Set `badge` on an item to show a count, or `badge="dot"` for a small dot that signals something new.

{% demo "Navigation bar items with a count badge and a dot badge" %}
<md-gb-nav-bar aria-label="Mail">
  <md-gb-nav-bar-item active badge="4">
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-bar-item>
  <md-gb-nav-bar-item badge="dot">
    <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
    Chat
  </md-gb-nav-bar-item>
  <md-gb-nav-bar-item>
    <md-gb-icon slot="icon">videocam</md-gb-icon>
    Meet
  </md-gb-nav-bar-item>
</md-gb-nav-bar>
{% enddemo %}

### Links

Give an item an `href` (and optionally `target` and `rel`) to make the destination a link, as in the first example. The item then has the `link` role and the selected one is marked `aria-current="page"`. Without `href` an item is a tab that just reports the selection.

### Hide on scroll

Set `scroll-behavior="hide"` to hide the bar when the page scrolls down and show it again on scroll up. By default it follows the window; set `scroll-target` to the id of another scrolling element. Fix the bar to the bottom of the page.

```html
<md-gb-nav-bar scroll-behavior="hide" aria-label="Primary">
  …
</md-gb-nav-bar>
```

### Selection

The `active` item shows the current destination, and `selected-index` selects an item by position. The bar fires `change` when the selection changes.

```js
const bar = document.querySelector('md-gb-nav-bar');
bar.addEventListener('change', () => {
  console.log(bar.selectedIndex);
});
```

## Accessibility

*   Give the bar an `aria-label` such as "Primary navigation".
*   Without links the bar is a tab list and its items are tabs, with exactly one selected. Tab moves focus into the bar, the arrow keys move between items, and Enter and Space select one.
*   When the items have an `href` the bar is a navigation landmark of links and the selected one is `aria-current="page"`. Enter follows a link; Space doesn't.
*   Every item needs a visible label, which is also its accessible name. If the label is ambiguous, add a more descriptive `aria-label` to the item.
*   A hidden bar never hides while focus is inside it or when the page scrolls from a key press, and it reappears when focus moves into it. Leave `scroll-behavior` off if screen reader users rely on the bar.
*   Disabled items leave the tab order.

## API reference

{% gbapi "navbar" %}

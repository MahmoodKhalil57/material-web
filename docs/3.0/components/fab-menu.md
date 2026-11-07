---
title: FAB menu
section: components
order: 12
description: A FAB menu opens from a FAB to show several related actions, and the FAB becomes its close button.
---
{% demo "A FAB menu with three actions" %}
<md-gb-fab-menu aria-label="Message actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Messages
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">archive</md-gb-icon>
    Archive
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">share</md-gb-icon>
    Share
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
{% enddemo %}

## Usage guidelines

*   **Open it from a FAB.** The menu appears where the FAB was, and not from an extended FAB or any other component.
*   **Keep it related.** A menu holds 2 to 6 closely related actions under one purpose, such as sharing.
*   **Align to the trailing edge.** The FAB and menu sit at the trailing edge of the window, mirrored in right-to-left languages.
*   **Always label items.** Every item needs a text label.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A FAB menu holds items and a FAB that toggles it. Both icons can be replaced.

```html
<md-gb-fab-menu>
  <md-gb-icon slot="icon"></md-gb-icon>
  <md-gb-icon slot="close-icon"></md-gb-icon>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon"></md-gb-icon>
  </md-gb-fab-menu-item>
  …
</md-gb-fab-menu>
```

## Examples

### Colors

Set `color` to `primary` (default), `secondary` or `tertiary`.

{% demo "A tertiary FAB menu" %}
<md-gb-fab-menu color="tertiary" aria-label="Photo actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Edit
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Delete
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
{% enddemo %}

### Size

Set `size` to `md` or `lg` for a larger FAB.

{% demo "A large FAB menu" %}
<md-gb-fab-menu size="lg" aria-label="Photo actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Edit
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Delete
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
{% enddemo %}

### Start alignment

Set `align="start"` to align the items to the start edge, as for a FAB at the leading side.

{% demo "A FAB menu aligned to the start" %}
<md-gb-fab-menu align="start" aria-label="Photo actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Edit
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Delete
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
{% enddemo %}

### Open and events

Set `open` to open the menu from code. The `toggle` event fires before it opens or closes and `activate` fires before an item closes it; cancel either to keep the menu as it is.

```js
menu.addEventListener('activate', (event) => {
  // Cancel to keep the menu open.
  event.preventDefault();
});
```

## Accessibility

*   Name the menu with `aria-label`, such as "Message actions". It labels the toggle button.
*   The toggle button exposes whether the menu is expanded or collapsed.
*   Tab moves through the button and the items, and Enter or Space activates the focused one.
*   A menu over scrolling content shouldn't hide focused elements. Register it with `setupScrollPadding()` from `appbar/scroll-padding.js`.

## API reference

{% gbapi "fabmenu" %}

---
title: Navigation Rail
section: components
category: navigation
order: 15
summary: Switch between destinations on mid-sized screens
description: A navigation rail lets people switch between top-level destinations on larger windows, and expands to show full labels.
---
{% demo "A navigation rail with a menu button and four destinations" %}
<md-gb-nav-rail aria-label="Primary" collapsible>
  <md-gb-nav-rail-item selected href="#inbox">
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#chat">
    <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
    Chat
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#spaces">
    <md-gb-icon slot="icon">groups</md-gb-icon>
    Spaces
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#meet">
    <md-gb-icon slot="icon">videocam</md-gb-icon>
    Meet
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

## Usage guidelines

*   **Use it in medium windows and larger.** On compact windows use a [navigation bar](/3.0/components/navigation-bar/) instead.
*   **Keep three to seven destinations.** Add an optional FAB or menu button in the header.
*   **Keep it in the same place.** The rail stays at the leading edge on every screen of the app.
*   **Let it expand.** A [collapsed](#collapsible) rail shows icons and short labels, and an expanded rail shows horizontal items and can replace a navigation drawer.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A rail has an optional header, such as a menu button or a FAB, and items. Each item has an icon, a label and an optional badge.

{% demo "A rail with a menu button, a FAB and items, one with a badge" %}
<md-gb-nav-rail aria-label="Mail">
  <md-gb-icon-button slot="header" aria-label="Open menu"><md-gb-icon>menu</md-gb-icon></md-gb-icon-button>
  <md-gb-fab slot="header" aria-label="Compose"><md-gb-icon>edit</md-gb-icon></md-gb-fab>
  <md-gb-nav-rail-item selected href="#anatomy-inbox">
    <md-gb-icon slot="icon">inbox</md-gb-icon>
    <span slot="badge">3</span>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item href="#anatomy-sent">
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

## Examples

### Links

Give an item an `href` (and optionally `target` and `rel`) to make the destination a link, as in the first example. The item then has the `link` role and the selected one is marked `aria-current="page"`. Without `href` an item is a tab that just reports the selection.

### Collapsible

Add `collapsible` to show a built-in menu button in the header that expands and collapses the rail. To use your own button, put it in the `header` slot and call `toggle()`, `expand()` or `collapse()`. Set `expanded` to start expanded. The rail fires `toggle` when it expands or collapses.

{% demo "A collapsible rail that starts expanded" %}
<md-gb-nav-rail aria-label="Mail" collapsible expanded>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">drafts</md-gb-icon>
    Drafts
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

### Header

Use the `header` slot for a menu button and a FAB above the items.

{% demo "A rail with a menu button and a compose FAB" %}
<md-gb-nav-rail aria-label="Mail">
  <md-gb-icon-button slot="header" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-fab slot="header" label="Compose">
    <md-gb-icon>edit</md-gb-icon>
  </md-gb-fab>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

### Alignment

Set `alignment` to `top` (the default), `center` or `bottom` to place the items along the rail.

{% demo "A rail with its items centered" %}
<md-gb-nav-rail aria-label="Primary" alignment="center">
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">home</md-gb-icon>
    Home
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">search</md-gb-icon>
    Search
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">settings</md-gb-icon>
    Settings
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

### Badges

Set `badge` on an item to show a count, or `badge="dot"` for a small dot.

{% demo "Rail items with a count badge and a dot badge" %}
<md-gb-nav-rail aria-label="Mail">
  <md-gb-nav-rail-item selected badge="4">
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item badge="dot">
    <md-gb-icon slot="icon">chat_bubble</md-gb-icon>
    Chat
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

### Secondary items

Add `secondary` to an item that should show only while the rail is expanded, such as a less important destination.

{% demo "An expanded rail with a secondary destination" %}
<md-gb-nav-rail aria-label="Mail" collapsible expanded>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item secondary>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Trash
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

### Modal

Add `modal` so the expanded rail opens over the content with a scrim. Add `hide-when-collapsed` to take the collapsed rail out of the layout entirely; the app's menu button then calls `toggle()` to show it. On Android, the back gesture collapses a modal rail.

{% demo "A collapsible modal rail" %}
<md-gb-nav-rail aria-label="Mail" modal collapsible>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Inbox
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

### Appearance

Add `divider` to draw a line at the rail's edge, `elevated` to lift it above scrolling content, and `narrow` to use the 80dp collapsed width.

{% demo "A narrow rail with a divider" %}
<md-gb-nav-rail aria-label="Primary" narrow divider>
  <md-gb-nav-rail-item selected>
    <md-gb-icon slot="icon">home</md-gb-icon>
    Home
  </md-gb-nav-rail-item>
  <md-gb-nav-rail-item>
    <md-gb-icon slot="icon">search</md-gb-icon>
    Search
  </md-gb-nav-rail-item>
</md-gb-nav-rail>
{% enddemo %}

## Accessibility

*   Give the rail an `aria-label` such as "Primary navigation".
*   Without links the rail is a tab list and its items are tabs, with exactly one selected. Tab moves focus into the rail, the arrow keys move between items, and Enter and Space select one.
*   When the items have an `href` the rail is a navigation landmark of links and the selected one is `aria-current="page"`. Enter follows a link; Space doesn't.
*   Every item needs a visible label, which is also its accessible name.
*   Give a menu button in the header an `aria-label`, such as "Open menu".
*   A modal rail collapses on Escape and when the scrim is pressed. Keep the menu button available as the single-pointer alternative to swiping it closed.
*   Disabled items leave the tab order.

## API reference

{% gbapi "navrail" %}

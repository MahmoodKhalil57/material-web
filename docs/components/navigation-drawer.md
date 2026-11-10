---
title: Navigation Drawer
section: components
category: navigation
order: 14
summary: Switch between destinations on large screens
description: A Material Design navigation drawer.
hero: navdrawer/standard-drawer
---
{% demo "A standard navigation drawer with Inbox selected" %}
<md-gb-nav-drawer open aria-label="Mail">
  <h2 slot="headline">Mail</h2>
  <md-gb-nav-drawer-item href="#inbox" selected badge="24">
    <md-gb-icon slot="icon">inbox</md-gb-icon>
    Inbox
  </md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#sent">
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-drawer-item>
</md-gb-nav-drawer>
{% enddemo %}

{% gbshadcn "navdrawer" %}

## Usage guidelines

*   **Use it for top-level destinations.** A drawer lists the main sections of an app, with the current one selected.
*   **Choose standard or modal.** A standard drawer (above) sits beside the content on large windows; a [modal drawer](#modal-drawer) opens over a scrim on small ones.
*   **Group with labels.** Use section labels and dividers to organize long lists.
*   **Keep labels short.** Long [labels](#text-labels-only) truncate.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A drawer holds an optional headline, section labels, dividers, and items.

{% demo "A drawer with a headline, section label, items, badge and divider" %}
<md-gb-nav-drawer open aria-label="Mail">
  <h2 slot="headline">Mail</h2>
  <h2 class="nav-drawer-section-label">Folders</h2>
  <md-gb-nav-drawer-item href="#anatomy-inbox" selected>
    <md-gb-icon slot="icon">inbox</md-gb-icon>
    <span slot="badge">24</span>
    Inbox
  </md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#anatomy-drafts">
    <md-gb-icon slot="icon">draft</md-gb-icon>
    Drafts
  </md-gb-nav-drawer-item>
  <md-gb-divider></md-gb-divider>
  <md-gb-nav-drawer-item href="#anatomy-trash">
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Trash
  </md-gb-nav-drawer-item>
</md-gb-nav-drawer>
{% enddemo %}

## Examples

### Modal drawer

Set `modal` to open the drawer over a scrim. Escape, the scrim, or swiping closes it.

{% demo "A button that opens a modal navigation drawer" height=360 %}
```html
<md-gb-button id="open-menu">Menu</md-gb-button>
<md-gb-nav-drawer id="menu" modal aria-label="Mail">
  <md-gb-nav-drawer-item href="#inbox" selected>Inbox</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#sent">Sent</md-gb-nav-drawer-item>
</md-gb-nav-drawer>
```
```js
document.querySelector('#open-menu').addEventListener('click', () => {
  document.querySelector('#menu').show();
});
```
{% enddemo %}

### Modal drawer without swipe

Set `gestures-disabled` on a modal drawer to turn off swipe-to-close. Escape, the scrim, and `close()` still work.

{% demo "A modal navigation drawer that can't be swiped closed" height=360 %}
```html
<md-gb-button id="open-fixed-menu">Menu</md-gb-button>
<md-gb-nav-drawer id="fixed-menu" modal gestures-disabled aria-label="Mail">
  <md-gb-nav-drawer-item href="#inbox" selected>Inbox</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#sent">Sent</md-gb-nav-drawer-item>
</md-gb-nav-drawer>
```
```js
document.querySelector('#open-fixed-menu').addEventListener('click', () => {
  document.querySelector('#fixed-menu').show();
});
```
{% enddemo %}

### Text labels only

Items work without icons. Labels that are too long truncate, and `disabled` items are not interactive.

{% demo "A navigation drawer with text labels only" %}
<md-gb-nav-drawer open aria-label="Settings">
  <md-gb-nav-drawer-item href="#general" selected>General</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#privacy">Privacy</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item disabled>Billing</md-gb-nav-drawer-item>
</md-gb-nav-drawer>
{% enddemo %}

## Accessibility

*   The drawer renders a `<nav>` landmark; give it a name with `aria-label`.
*   The selected item is the current page and is exposed with `aria-current`.
*   A modal drawer is a dialog: it traps focus, closes with Escape, and returns focus to what opened it.
*   Tab moves through the items; Enter activates a link item.

## API reference

{% gbapi "navdrawer" %}

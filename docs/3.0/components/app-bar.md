---
title: App Bar
section: components
order: 1
description: An app bar sits at the top of a screen and shows its title, navigation and actions, and can hide or compress as the page scrolls.
---
{% demo "An app bar with a menu button, a title, a subtitle and a search action" %}
<md-gb-app-bar>
  <md-gb-icon-button slot="leading" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  Inbox
  <span slot="subtitle">24 unread</span>
  <md-gb-icon-button slot="trailing" aria-label="Search">
    <md-gb-icon>search</md-gb-icon>
  </md-gb-icon-button>
</md-gb-app-bar>
{% enddemo %}

## Usage guidelines

*   **Keep it about the page.** An app bar shows the title, navigation and a few actions that belong to the current page.
*   **Limit the actions.** Show one action, two if needed, and put many actions in a toolbar. Avoid an overflow menu when you can.
*   **Pick a size.** Use [medium or large](#sizes) for a more expressive headline, and a [small](#sizes) bar once content scrolls.
*   **Let it respond to scrolling.** It can [hide or compress](#scroll-behavior) while people scroll.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

An app bar holds a leading navigation button, a title with an optional subtitle or image, and trailing actions.

```html
<md-gb-app-bar>
  <md-gb-icon-button slot="leading"></md-gb-icon-button>
  <span slot="subtitle"></span>
  <md-gb-icon-button slot="trailing"></md-gb-icon-button>
  …
  <md-gb-icon-button slot="overflow"></md-gb-icon-button>
</md-gb-app-bar>
```

## Examples

### Sizes

Set `size` to `md` or `lg` for a taller bar. The default is `sm`.

{% demo "A medium app bar with a back button and a title" %}
<md-gb-app-bar size="md">
  <md-gb-icon-button slot="leading" aria-label="Back">
    <md-gb-icon>arrow_back</md-gb-icon>
  </md-gb-icon-button>
  Settings
</md-gb-app-bar>
{% enddemo %}

### Centered text

Add `centered` to center the title and subtitle.

{% demo "An app bar with a centered title" %}
<md-gb-app-bar centered>
  <md-gb-icon-button slot="leading" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  Photos
</md-gb-app-bar>
{% enddemo %}

### Search

Set `variant="search"` and put a text input in the `search` slot.

{% demo "A search app bar" %}
<md-gb-app-bar variant="search">
  <md-gb-icon-button slot="leading" aria-label="Back">
    <md-gb-icon>arrow_back</md-gb-icon>
  </md-gb-icon-button>
  <input slot="search" type="search" aria-label="Search mail">
</md-gb-app-bar>
{% enddemo %}

### Scroll behavior

Set `scroll-behavior` to `hide` to hide the bar while scrolling down, or to `compress` to turn a medium or large bar into a small one. Use `scroll-target` with the id of a scrolling element, or leave it out to follow the window.

```html
<md-gb-app-bar size="lg" scroll-behavior="compress" scroll-target="content">
  …
</md-gb-app-bar>
```

### Overflow actions

On small windows only a few trailing actions show. The rest are listed in the `overflowchange` event, and the `overflow` slot holds a menu button that appears while actions are collapsed.

{% demo "An app bar with trailing actions and an overflow button" %}
<md-gb-app-bar>
  Gallery
  <md-gb-icon-button slot="trailing" aria-label="Search">
    <md-gb-icon>search</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Share">
    <md-gb-icon>share</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Favorite">
    <md-gb-icon>favorite</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="overflow" aria-label="More options">
    <md-gb-icon>more_vert</md-gb-icon>
  </md-gb-icon-button>
</md-gb-app-bar>
{% enddemo %}

## Accessibility

*   The title is the app bar's text, so make it match the page. Add context in an `aria-label` if the title alone is unclear.
*   Label every icon-only button with `aria-label`.
*   Tab moves through the buttons, and Enter or Space activates the focused one.
*   A sticky or fixed app bar can cover focused content. Call `setupScrollPadding()` from `scroll-padding.js` so focused elements scroll clear of it.

## API reference

{% gbapi "appbar" %}

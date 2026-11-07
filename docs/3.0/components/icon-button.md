---
title: Icon Buttons
section: components
order: 14
description: Icon buttons help people take supplementary actions with a single tap.
---
{% demo "A row of icon buttons, one for each color" %}
<md-gb-icon-button color="filled" aria-label="Favorite">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="outlined" aria-label="Settings">
  <md-gb-icon>settings</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button aria-label="More options">
  <md-gb-icon>more_vert</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

## Usage guidelines

*   **Use a clear icon.** Pick a system icon whose meaning people already know, and give the button an accessible name that describes the action.
*   **Describe the action on hover.** On the web, add a [tooltip](#tooltip) so the action is named while hovering or focusing the button.
*   **Pick the color by emphasis.** [Filled](#colors) is the most prominent, [tonal](#colors) and [outlined](#colors) are medium, and the standard color suits the lowest priority.
*   **Show state with a toggle.** A [toggle](#toggle) button uses the outlined icon when unselected and the filled icon when selected.

## Anatomy

An icon button is one element that holds an icon (default slot). It renders a native `<button>` or, with `href`, a link.

```html
<md-gb-icon-button>
  <md-gb-icon></md-gb-icon>
</md-gb-icon-button>
```

## Examples

### Colors

Choose one of four colors with the `color` attribute: filled, tonal, outlined, or standard (the default).

{% demo "Filled, tonal, outlined and standard icon buttons" %}
<md-gb-icon-button color="filled" aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="outlined" aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Sizes

Set `size` to `xs`, `sm` (default), `md`, `lg`, or `xl`.

{% demo "Filled icon buttons from extra small to extra large" %}
<md-gb-icon-button color="filled" size="xs" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" size="md" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" size="lg" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" size="xl" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Widths

Set `width` to `narrow` or `wide`. The default width sits in between.

{% demo "Narrow, default and wide icon buttons" %}
<md-gb-icon-button color="tonal" width="narrow" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" width="wide" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Square shape

Add `square` to change the shape of the button from round to square.

{% demo "A filled icon button with a square shape" %}
<md-gb-icon-button color="filled" square aria-label="Delete">
  <md-gb-icon>delete</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Toggle

Set `type="toggle"` to make a button that stays selected after it is pressed. Add `selected` for the initial state. The selected button shows the filled icon; if an icon has no filled version, add `unfilled-icon` and it gets a heavier weight instead.

{% demo "An unselected and a selected toggle icon button" %}
<md-gb-icon-button type="toggle" color="outlined" aria-label="Favorite">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button type="toggle" color="outlined" selected aria-label="Bookmark">
  <md-gb-icon>bookmark</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Tooltip

Add `tooltip` to show the button's `aria-label` on hover and keyboard focus. Write the label as the action, not the icon's name.

{% demo "An icon button with a tooltip" %}
<md-gb-icon-button tooltip aria-label="Add to favorites">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Links

Set `href` to render the button as a link. Use `target` and `rel` as you would on an anchor.

{% demo "An icon button that links to another page" %}
<md-gb-icon-button href="https://m3.material.io/components/icon-buttons" target="_blank" aria-label="Open the guidelines">
  <md-gb-icon>open_in_new</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Density

Set `density` from `0` (default) down to `-3` to remove 4px of height per step. The touch target stays at least 48px. Keep it off by default and let people opt in.

{% demo "A filled icon button at density -2" %}
<md-gb-icon-button color="filled" density="-2" aria-label="Search">
  <md-gb-icon>search</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

### Disabled and soft-disabled

A disabled button can't be focused with the keyboard. A `soft-disabled` button stays focusable, which helps discoverability in toolbars.

{% demo "A disabled icon button and a soft-disabled icon button" %}
<md-gb-icon-button color="filled" disabled aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" soft-disabled aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
{% enddemo %}

## Accessibility

*   An icon button has no visible text, so always give it an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) that describes the action.
*   Icon buttons activate with Enter and Space and are reachable with Tab.
*   Disabled buttons leave the tab order. Use `soft-disabled` to keep one focusable, as the [ARIA guidance on disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls) allows.
*   Toggle buttons expose their state with `aria-pressed`.

```html
<md-gb-icon-button type="toggle" aria-label="Add to favorites">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
```

## API reference

{% gbapi "iconbutton" %}

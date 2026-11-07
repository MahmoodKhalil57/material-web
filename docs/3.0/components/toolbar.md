---
title: Toolbar
section: components
category: other
order: 35
summary: Collect actions that belong to the current page
description: A toolbar holds actions that relate to the content on the screen, docked to an edge or floating above it.
---
{% demo "A floating toolbar with formatting actions" %}
<md-gb-toolbar aria-label="Text formatting">
  <md-gb-icon-button aria-label="Bold"><md-gb-icon>format_bold</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Italic"><md-gb-icon>format_italic</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Underline"><md-gb-icon>format_underlined</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
{% enddemo %}

## Usage guidelines

*   **Actions for the page.** A toolbar offers actions related to the current page and can show more of them in larger windows.
*   **Docked or floating.** A [docked](#docked) toolbar spans the window and suits global actions that stay the same across pages. A floating toolbar hovers over the content and suits actions for that content.
*   **Vibrant for emphasis.** Use the [vibrant](#colors) color for more emphasis.
*   **Not with a navigation bar.** Don't show a toolbar at the same time as a navigation bar.

## Anatomy

A toolbar holds actions, such as buttons and icon buttons. A floating toolbar can have a FAB.

{% demo "A toolbar with leading and trailing buttons, a button and a FAB" %}
<md-gb-toolbar aria-label="Compose actions">
  <md-gb-icon-button slot="leading" aria-label="Attach"><md-gb-icon>attach_file</md-gb-icon></md-gb-icon-button>
  <md-gb-button>Draft</md-gb-button>
  <md-gb-icon-button slot="trailing" aria-label="Delete"><md-gb-icon>delete</md-gb-icon></md-gb-icon-button>
  <md-gb-fab slot="fab" aria-label="Send"><md-gb-icon>send</md-gb-icon></md-gb-fab>
</md-gb-toolbar>
{% enddemo %}

## Examples

### Colors

Toolbars are `standard` by default. Set `color="vibrant"` for a more prominent toolbar.

{% demo "A vibrant toolbar" %}
<md-gb-toolbar color="vibrant" aria-label="Editing">
  <md-gb-icon-button aria-label="Undo"><md-gb-icon>undo</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Redo"><md-gb-icon>redo</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
{% enddemo %}

### Docked

Add `docked` to stretch the toolbar across the full width of its container.

{% demo "A docked toolbar" %}
<md-gb-toolbar docked aria-label="Editing">
  <md-gb-icon-button aria-label="Undo"><md-gb-icon>undo</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Redo"><md-gb-icon>redo</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
{% enddemo %}

### Buttons with labels

Toolbars can hold buttons with labels as well as icon buttons. Use toggle buttons to show a selected state.

{% demo "A toolbar with toggle buttons" %}
<md-gb-toolbar aria-label="View">
  <md-gb-button type="toggle" selected>
    <md-gb-icon>edit</md-gb-icon>
    Edit
  </md-gb-button>
  <md-gb-button type="toggle">
    <md-gb-icon>palette</md-gb-icon>
    Style
  </md-gb-button>
</md-gb-toolbar>
{% enddemo %}

### Orientation

Set `orientation="vertical"` to stack the actions in a column.

{% demo "A vertical toolbar" %}
<md-gb-toolbar orientation="vertical" aria-label="Tools">
  <md-gb-icon-button aria-label="Draw"><md-gb-icon>brush</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Erase"><md-gb-icon>ink_eraser</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
{% enddemo %}

### With a FAB

A floating toolbar can sit beside a FAB in the `fab` slot. Set `fab-position="start"` to move it to the leading side, or `expanded="false"` to collapse the toolbar to just the FAB.

{% demo "A floating toolbar with a FAB" %}
<md-gb-toolbar aria-label="Compose actions">
  <md-gb-icon-button aria-label="Attach"><md-gb-icon>attach_file</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button aria-label="Insert photo"><md-gb-icon>image</md-gb-icon></md-gb-icon-button>
  <md-gb-fab slot="fab" aria-label="Send"><md-gb-icon>send</md-gb-icon></md-gb-fab>
</md-gb-toolbar>
{% enddemo %}

### Overflow

Add `overflow-menu` to move trailing actions that don't fit into a "More actions" menu.

{% demo "A narrow toolbar with an overflow menu" %}
<md-gb-toolbar overflow-menu aria-label="Document actions" style="max-inline-size: 200px">
  <md-gb-icon-button aria-label="Print"><md-gb-icon>print</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Download"><md-gb-icon>download</md-gb-icon></md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Delete"><md-gb-icon>delete</md-gb-icon></md-gb-icon-button>
</md-gb-toolbar>
{% enddemo %}

### Hide on scroll

Set `scroll-behavior="hide"` to move a docked or floating toolbar off screen when the page scrolls down and bring it back when it scrolls up. `scroll-target` names the element that scrolls; it defaults to the window.

{% demo "A docked toolbar that hides when its page scrolls down" height=240 %}
```html
<div id="page">
  <p>Scroll this page down to hide the toolbar and up to bring it back.</p>
  <p>Bread, milk, eggs, butter, cheese, apples, rice, beans, flour, sugar.</p>
  <p>Coffee, tea, honey, oats, lentils, pasta, tomatoes, onions, garlic.</p>
  <p>Lemons, limes, oranges, bananas, grapes, pears, plums, peaches, figs.</p>
  <md-gb-toolbar docked scroll-behavior="hide" scroll-target="page" aria-label="Page actions">
    <md-gb-icon-button aria-label="Undo"><md-gb-icon>undo</md-gb-icon></md-gb-icon-button>
    <md-gb-icon-button aria-label="Share"><md-gb-icon>share</md-gb-icon></md-gb-icon-button>
  </md-gb-toolbar>
</div>
```
```css
#page {
  block-size: 200px;
  overflow-y: auto;
  padding-inline: 16px;
}
#page md-gb-toolbar {
  position: sticky;
  inset-block-end: 0;
}
#page p {
  margin-block: 56px;
}
```
{% enddemo %}

## Accessibility

*   A toolbar has the `toolbar` role. Label it with [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby).
*   Every action stays in the Tab order, and the arrow keys also move between them (up and down in a vertical toolbar).
*   Icon-only actions need an `aria-label`.
*   A collapsed toolbar makes its hidden actions inert.

## API reference

{% gbapi "toolbar" %}

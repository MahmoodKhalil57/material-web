---
title: Tooltip
section: components
order: 37
description: Tooltips add context to a button or other element, as a short plain label or a richer panel with a subhead and actions.
---
{% demo "A plain tooltip on an icon button" %}
<md-gb-icon-button id="edit" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
<md-gb-tooltip for="edit">Edit</md-gb-tooltip>
{% enddemo %}

## Usage guidelines

*   **Plain to label.** Use a [plain](#placement) tooltip to name an element with no text, such as an icon-only button. Don't add one when the element already has a visible label.
*   **Rich for details.** Use a [rich](#rich) tooltip for longer text, such as a definition or an explanation of a new feature, with an optional subhead and up to two text buttons.
*   **Nothing critical.** Tooltips are easy to miss, so never hide information people must see. Use a dialog for that.

## Anatomy

A tooltip points at an anchor element by its id. A rich tooltip can add a subhead and actions.

{% demo "A rich tooltip with a subhead, text and an action, open on a button" height=240 %}
```html
<button id="anchor">Storage</button>
<md-gb-tooltip for="anchor" variant="rich" persistent>
  <span slot="subhead">Storage</span>
  Photos and files you keep in your account.
  <md-gb-button slot="action" color="text">Manage</md-gb-button>
</md-gb-tooltip>
```
```js
document.querySelector('md-gb-tooltip').show();
```
{% enddemo %}

## Examples

### Placement

A plain tooltip opens above its anchor and a rich one below it. Set `placement` to `above`, `below`, `start` or `end`; it flips when there isn't room. Add `caret` to point at the anchor.

{% demo "A plain tooltip with a caret, placed below its anchor" %}
<md-gb-icon-button id="share" aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
<md-gb-tooltip for="share" placement="below" caret>Share</md-gb-tooltip>
{% enddemo %}

### Rich

Set `variant="rich"` and a `subhead`. Text buttons go in the `action` slot.

{% demo "A rich tooltip with a subhead and an action" %}
<md-gb-button id="grant" color="outlined">Grant value</md-gb-button>
<md-gb-tooltip for="grant" variant="rich" subhead="How it's calculated">
  Uses the closing stock price from the day before the grant date.
  <md-gb-button slot="action" color="text">Learn more</md-gb-button>
</md-gb-tooltip>
{% enddemo %}

### Persistent

A `persistent` rich tooltip opens when the anchor is clicked and stays open until someone interacts with something else, so people can reach its actions.

{% demo "A rich tooltip that opens on click" %}
<md-gb-button id="whats-new" color="tonal">What's new</md-gb-button>
<md-gb-tooltip for="whats-new" variant="rich" persistent subhead="Shared folders">
  Invite others to a folder and work on files together.
  <md-gb-button slot="action" color="text">Got it</md-gb-button>
</md-gb-tooltip>
{% enddemo %}

### Delays

A tooltip opens right away and closes 1.5 seconds after the pointer leaves. Set `show-delay` and `hide-delay` in milliseconds, or add `quick` to skip the motion.

{% demo "A tooltip that closes after half a second" %}
<md-gb-icon-button id="delete" aria-label="Delete">
  <md-gb-icon>delete</md-gb-icon>
</md-gb-icon-button>
<md-gb-tooltip for="delete" hide-delay="500">Delete</md-gb-tooltip>
{% enddemo %}

## Accessibility

*   A plain tooltip is a `tooltip` that describes its anchor, and it opens on hover and on keyboard focus. Keep the anchor's own accessible name, such as an `aria-label` on an icon button.
*   A rich tooltip with actions is a `dialog`, so its buttons can be reached with the keyboard.
*   Escape closes an open tooltip.
*   Don't put information in a tooltip that people can't find another way, since touch users can't hover.

## API reference

{% gbapi "tooltip" %}

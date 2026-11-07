---
title: Buttons
section: components
category: buttons
order: 2
summary: Start most actions in a UI with a tap
description: Buttons help people initiate actions, from sending an email, to sharing a document, to liking a post.
---
{% demo "A filled button and an outlined button" %}
<md-gb-button color="filled">Save</md-gb-button>
<md-gb-button color="outlined">Cancel</md-gb-button>
{% enddemo %}

## Usage guidelines

*   **Label the action.** A button's text describes what happens when it is pressed, such as "Save" or "Join now".
*   **Match emphasis to importance.** Use [filled](#colors) for the final action of a flow, [tonal](#colors) and [outlined](#colors) for medium emphasis, and [text](#colors) for the lowest priority.
*   **Use elevated sparingly.** Elevated buttons add a shadow, so reserve them for buttons that need separation from a patterned background.
*   **Add an icon to draw attention.** An [icon](#with-an-icon) can help communicate the action.

## Anatomy

A button is one element holding a label and an optional icon (default slot). It renders a native `<button>` or, with `href`, a link.

{% demo "A filled button with an icon and a label" %}
<md-gb-button color="filled">
  <md-gb-icon>send</md-gb-icon>
  Send
</md-gb-button>
{% enddemo %}

## Examples

### Colors

Choose one of five colors with the `color` attribute: filled, elevated, tonal, outlined, or text.

{% demo "Elevated, filled, tonal, outlined and text buttons" %}
<md-gb-button color="elevated">Elevated</md-gb-button>
<md-gb-button color="filled">Filled</md-gb-button>
<md-gb-button color="tonal">Tonal</md-gb-button>
<md-gb-button color="outlined">Outlined</md-gb-button>
<md-gb-button color="text">Text</md-gb-button>
{% enddemo %}

### Sizes

Set `size` to `xs`, `sm` (default), `md`, `lg`, or `xl`.

{% demo "Buttons from extra small to extra large" %}
<md-gb-button size="xs">XS</md-gb-button>
<md-gb-button size="sm">Small</md-gb-button>
<md-gb-button size="md">Medium</md-gb-button>
<md-gb-button size="lg">Large</md-gb-button>
<md-gb-button size="xl">XL</md-gb-button>
{% enddemo %}

### With an icon

Put an `md-gb-icon` before the label, or after it for an action that leaves the page.

{% demo "A tonal button with a send icon and a text button with an open-in-new icon" %}
<md-gb-button color="tonal">
  <md-gb-icon>send</md-gb-icon>
  Send
</md-gb-button>
<md-gb-button color="text">
  Open
  <md-gb-icon>open_in_new</md-gb-icon>
</md-gb-button>
{% enddemo %}

### Square shape

Add `square` to change the shape of the button from round to square.

{% demo "A filled button with a square shape" %}
<md-gb-button color="filled" square>Square</md-gb-button>
{% enddemo %}

### Toggle

Set `type="toggle"` to make a button that stays selected after it is pressed. Add `selected` for the initial state.

{% demo "An icon toggle button" %}
<md-gb-button type="toggle" color="outlined" aria-label="Favorite">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-button>
{% enddemo %}

### Disabled and soft-disabled

A disabled button can't be focused with the keyboard. A `soft-disabled` button stays focusable, which helps discoverability in toolbars.

{% demo "A disabled button and a soft-disabled button" %}
<md-gb-button color="filled" disabled>Disabled</md-gb-button>
<md-gb-button color="filled" soft-disabled>Soft-disabled</md-gb-button>
{% enddemo %}

### Opening a popover or menu

Like a native button, an `md-gb-button` (and `md-gb-icon-button`) takes `popovertarget` (with `popovertargetaction`) or `commandfor` (with `command`) naming an element in the same tree. A menu opened this way also opens with the arrow keys.

{% demo "A button that opens a menu" %}
<md-gb-button color="tonal" popovertarget="button-menu">Options</md-gb-button>
<md-gb-menu id="button-menu">
  <md-gb-menu-item>Rename</md-gb-menu-item>
  <md-gb-menu-item>Duplicate</md-gb-menu-item>
</md-gb-menu>
{% enddemo %}

## Accessibility

*   Buttons need a visible label; add an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) to icon-only buttons or when the label needs to be more descriptive.
*   Buttons activate with Enter and Space and are reachable with Tab.
*   Disabled buttons leave the tab order. Use `soft-disabled` to keep one focusable, as the [ARIA guidance on disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls) allows.
*   Toggle buttons expose their state with `aria-pressed`.

{% demo "A button whose aria-label describes the action more fully" %}
<md-gb-button aria-label="Add a new contact" color="elevated">Add</md-gb-button>
{% enddemo %}

## API reference

{% gbapi "button" %}

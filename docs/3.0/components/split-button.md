---
title: Split button
section: components
category: buttons
order: 7
summary: Offer a main action with a menu of alternatives
description: A split button pairs a main action with a trailing button that opens a menu of related actions.
---
{% demo "A split button with a Save action and a menu of save options" %}
<md-gb-split-button>
  <button slot="leading">Save</button>
  <button slot="trailing" aria-label="More save options" popovertarget="save-menu"></button>
  <md-gb-menu id="save-menu">
    <md-gb-menu-item>Save as copy</md-gb-menu-item>
    <md-gb-menu-item>Save as template</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
{% enddemo %}

## Usage guidelines

*   **One main action plus related ones.** The leading button runs the most common action, and the menu holds the alternatives.
*   **Same sizes as buttons.** Split buttons come in the five button sizes, so they can sit next to [buttons](/3.0/components/button/) and icon buttons of the same size.
*   **Trailing menu icon.** The trailing button always shows the menu icon. Its color doesn't change when the menu opens; it only turns.

## Anatomy

A split button holds a leading button, a trailing button and the menu the trailing button opens.

{% demo "A split button with an icon, a label and a menu" height=240 %}
<md-gb-split-button>
  <button slot="leading">
    <md-gb-icon>send</md-gb-icon>
    Send
  </button>
  <button slot="trailing" aria-label="More send options" popovertarget="anatomy-menu"></button>
  <md-gb-menu id="anatomy-menu">
    <md-gb-menu-item>Send later</md-gb-menu-item>
    <md-gb-menu-item>Schedule send</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
{% enddemo %}

## Examples

### Colors

Split buttons are `filled` by default. Set `color` to `elevated`, `tonal` or `outlined`.

{% demo "A tonal split button" %}
<md-gb-split-button color="tonal">
  <button slot="leading">Reply</button>
  <button slot="trailing" aria-label="More reply options" popovertarget="reply-menu"></button>
  <md-gb-menu id="reply-menu">
    <md-gb-menu-item>Reply all</md-gb-menu-item>
    <md-gb-menu-item>Forward</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
{% enddemo %}

### Sizes

Set `size` to `xs`, `sm` (the default), `md`, `lg` or `xl`.

{% demo "A large split button" %}
<md-gb-split-button size="lg">
  <button slot="leading">Send</button>
  <button slot="trailing" aria-label="More send options" popovertarget="send-menu"></button>
  <md-gb-menu id="send-menu">
    <md-gb-menu-item>Send later</md-gb-menu-item>
    <md-gb-menu-item>Schedule send</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
{% enddemo %}

### Leading icon

The leading button can have an icon, a label, or both.

{% demo "A split button with an icon and a label" %}
<md-gb-split-button>
  <button slot="leading">
    <md-gb-icon>download</md-gb-icon>
    Download
  </button>
  <button slot="trailing" aria-label="More download options" popovertarget="download-menu"></button>
  <md-gb-menu id="download-menu">
    <md-gb-menu-item>Download as PDF</md-gb-menu-item>
    <md-gb-menu-item>Download as text</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
{% enddemo %}

## Accessibility

*   Both parts are native `<button>`s you provide, so give the trailing button an `aria-label` that says what the menu holds, such as "More save options". Add one to an icon-only leading button too.
*   The two buttons are separate tab stops. The trailing button toggles the menu with `popovertarget`, and the menu follows the [menu](/3.0/components/menu/) keyboard behavior.

## API reference

{% gbapi "splitbutton" %}

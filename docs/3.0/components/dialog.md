---
title: Dialogs
section: components
order: 10
description: Dialogs provide important prompts in a user flow.
---
{% demo "A button that opens a dialog asking to delete messages" %}
<md-gb-button id="open-delete">Delete</md-gb-button>
<md-gb-dialog id="delete-dialog">
  <span slot="headline">Permanently delete?</span>
  Deleting the selected messages also removes them from your other devices.
  <form id="delete-form" method="dialog"></form>
  <md-gb-button slot="actions" form="delete-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="delete-form" value="delete">Delete</md-gb-button>
</md-gb-dialog>
{% enddemo %}

```js
document.querySelector('#open-delete').addEventListener('click', () => {
  document.querySelector('#delete-dialog').show();
});
```

<script type="module">
  document.querySelector('#open-delete').addEventListener('click', () => {
    document.querySelector('#delete-dialog').show();
  });
</script>

## Usage guidelines

*   **Use them sparingly.** A dialog interrupts people to ask for a decision or to show critical information, so it blocks the rest of the app until it is dismissed.
*   **Pick the right priority.** For low or medium priority information, use a snackbar instead.
*   **Choose basic or full-screen.** Use a basic dialog by default. A [full-screen dialog](#full-screen) suits compact windows with a lot of content.
*   **Order the actions.** Put the dismissive action first and the confirming action last.

## Anatomy

A dialog has an optional icon and headline, supporting content, and actions.

```html
<md-gb-dialog>
  <md-gb-icon slot="icon"></md-gb-icon>
  <span slot="headline"></span>
  …
  <md-gb-button slot="actions"></md-gb-button>
</md-gb-dialog>
```

## Examples

### With an icon

Put an `md-gb-icon` in the `icon` slot to center the headline under a hero icon.

{% demo "A dialog with a hero icon" %}
<md-gb-button id="open-reset">Reset</md-gb-button>
<md-gb-dialog id="reset-dialog">
  <md-gb-icon slot="icon">restart_alt</md-gb-icon>
  <span slot="headline">Reset settings?</span>
  This returns your preferences to their defaults.
  <form id="reset-form" method="dialog"></form>
  <md-gb-button slot="actions" form="reset-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="reset-form" value="reset">Reset</md-gb-button>
</md-gb-dialog>
{% enddemo %}

<script type="module">
  document.querySelector('#open-reset').addEventListener('click', () => {
    document.querySelector('#reset-dialog').show();
  });
</script>

### Full-screen

Set `full-screen` for a dialog that fills a compact window, with a close button and the confirming action in its header. Above compact sizes it falls back to a basic dialog; add `always-full-screen` to keep it.

{% demo "A full-screen dialog for a new event" %}
<md-gb-button id="open-event">New event</md-gb-button>
<md-gb-dialog id="event-dialog" full-screen>
  <span slot="headline">New event</span>
  <md-gb-button slot="actions">Save</md-gb-button>
  <label>
    Event name
    <input type="text">
  </label>
</md-gb-dialog>
{% enddemo %}

<script type="module">
  document.querySelector('#open-event').addEventListener('click', () => {
    document.querySelector('#event-dialog').show();
  });
</script>

### Return value

A button's `value` becomes the dialog's `returnValue` when it closes the dialog through its form. Read it in the `closed` event.

```js
dialog.addEventListener('closed', () => {
  if (dialog.returnValue === 'delete') {
    // …
  }
});
```

### Opening and closing

Open and close a dialog with `show()` and `close()`, or by setting `open`. Both methods return a promise that resolves after the animation. Cancel the `cancel` event to keep the dialog open.

```js
await dialog.show();
await dialog.close();
```

## Accessibility

*   The headline names the dialog. Add `aria-label` to a dialog without a headline.
*   A basic dialog is an alert dialog (`role="alertdialog"`) by default, as M3 asks for on the web. Set `type="dialog"` for a plain dialog.
*   Focus moves into the dialog and Tab cycles inside it. Escape closes it and focus returns to what opened it.
*   Label buttons and fields inside the dialog as you would elsewhere. In a full-screen dialog, set `close-label` to name the close button.

## API reference

{% gbapi "dialog" %}

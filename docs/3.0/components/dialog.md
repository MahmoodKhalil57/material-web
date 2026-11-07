---
title: Dialogs
section: components
category: other
order: 23
summary: Interrupt the flow with an important prompt
description: Dialogs provide important prompts in a user flow.
---
{% demo "A button that opens a dialog asking to delete messages" height=360 %}
```html
<md-gb-button id="open-delete">Delete</md-gb-button>
<md-gb-dialog id="delete-dialog">
  <span slot="headline">Permanently delete?</span>
  Deleting the selected messages also removes them from your other devices.
  <form id="delete-form" method="dialog"></form>
  <md-gb-button slot="actions" form="delete-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="delete-form" value="delete">Delete</md-gb-button>
</md-gb-dialog>
```
```js
document.querySelector('#open-delete').addEventListener('click', () => {
  document.querySelector('#delete-dialog').show();
});
```
{% enddemo %}

## Usage guidelines

*   **Use them sparingly.** A dialog interrupts people to ask for a decision or to show critical information, so it blocks the rest of the app until it is dismissed.
*   **Pick the right priority.** For low or medium priority information, use a snackbar instead.
*   **Choose basic or full-screen.** Use a basic dialog by default. A [full-screen dialog](#full-screen) suits compact windows with a lot of content.
*   **Order the actions.** Put the dismissive action first and the confirming action last.

## Anatomy

A dialog has an optional icon and headline, supporting content, and actions.

{% demo "A dialog with an icon, headline, supporting text and actions" height=360 frame=true %}
<md-gb-dialog open quick>
  <md-gb-icon slot="icon">info</md-gb-icon>
  <span slot="headline">Discard draft?</span>
  Your draft will be deleted.
  <md-gb-button slot="actions">Cancel</md-gb-button>
  <md-gb-button slot="actions">Discard</md-gb-button>
</md-gb-dialog>
{% enddemo %}

## Examples

### With an icon

Put an `md-gb-icon` in the `icon` slot to center the headline under a hero icon.

{% demo "A dialog with a hero icon" height=360 %}
```html
<md-gb-button id="open-reset">Reset</md-gb-button>
<md-gb-dialog id="reset-dialog">
  <md-gb-icon slot="icon">restart_alt</md-gb-icon>
  <span slot="headline">Reset settings?</span>
  This returns your preferences to their defaults.
  <form id="reset-form" method="dialog"></form>
  <md-gb-button slot="actions" form="reset-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="reset-form" value="reset">Reset</md-gb-button>
</md-gb-dialog>
```
```js
document.querySelector('#open-reset').addEventListener('click', () => {
  document.querySelector('#reset-dialog').show();
});
```
{% enddemo %}

### Full-screen

Set `full-screen` for a dialog that fills a compact window, with a close button and the confirming action in its header. Above compact sizes it falls back to a basic dialog; add `always-full-screen` to keep it.

{% demo "A full-screen dialog for a new event" height=420 %}
```html
<md-gb-button id="open-event">New event</md-gb-button>
<md-gb-dialog id="event-dialog" full-screen>
  <span slot="headline">New event</span>
  <md-gb-button slot="actions">Save</md-gb-button>
  <label>
    Event name
    <input type="text">
  </label>
</md-gb-dialog>
```
```js
document.querySelector('#open-event').addEventListener('click', () => {
  document.querySelector('#event-dialog').show();
});
```
{% enddemo %}

### Return value

A button's `value` becomes the dialog's `returnValue` when it closes the dialog through its form. Read it in the `closed` event.

{% demo "A dialog that reports which button closed it" height=360 %}
```html
<md-gb-button id="open-archive">Archive</md-gb-button>
<p id="result" role="status"></p>
<md-gb-dialog id="archive-dialog">
  <span slot="headline">Archive this thread?</span>
  It moves out of your inbox.
  <form id="archive-form" method="dialog"></form>
  <md-gb-button slot="actions" form="archive-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="archive-form" value="archive">Archive</md-gb-button>
</md-gb-dialog>
```
```js
const dialog = document.querySelector('#archive-dialog');
document.querySelector('#open-archive').addEventListener('click', () => {
  dialog.show();
});
dialog.addEventListener('closed', () => {
  document.querySelector('#result').textContent =
    dialog.returnValue === 'archive' ? 'Archived' : 'Canceled';
});
```
{% enddemo %}

### Opening and closing

Open and close a dialog with `show()` and `close()`, or by setting `open`. Both methods return a promise that resolves after the animation. Cancel the `cancel` event to keep the dialog open.

{% demo "Buttons that open and close a dialog from script" height=360 %}
```html
<md-gb-button id="open">Open</md-gb-button>
<md-gb-dialog id="note-dialog">
  <span slot="headline">Reminder</span>
  This dialog closes itself after three seconds.
  <md-gb-button slot="actions" id="close">Close now</md-gb-button>
</md-gb-dialog>
```
```js
const dialog = document.querySelector('#note-dialog');
document.querySelector('#open').addEventListener('click', async () => {
  await dialog.show();
  setTimeout(() => dialog.close(), 3000);
});
document.querySelector('#close').addEventListener('click', () => dialog.close());
```
{% enddemo %}

## Accessibility

*   The headline names the dialog. Add `aria-label` to a dialog without a headline.
*   A basic dialog is an alert dialog (`role="alertdialog"`) by default, as M3 asks for on the web. Set `type="dialog"` for a plain dialog.
*   Focus moves into the dialog and Tab cycles inside it. Escape closes it and focus returns to what opened it.
*   Label buttons and fields inside the dialog as you would elsewhere. In a full-screen dialog, set `close-label` to name the close button.

## API reference

{% gbapi "dialog" %}

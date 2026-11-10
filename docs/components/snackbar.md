---
title: Snackbar
section: components
category: other
order: 31
summary: Confirm an action with a brief message
description: Snackbars tell people about a process an app has performed or will perform, without interrupting them.
---
{% demo "A button that shows a snackbar with an Undo action" height=240 %}
```html
<md-gb-button id="archive">Archive</md-gb-button>
<md-gb-snackbar id="archived" fixed label-text="Email archived" action-label="Undo"></md-gb-snackbar>
```
```ts
document.querySelector('#archive')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```
{% enddemo %}

{% gbshadcn "snackbar" %}

## Usage guidelines

*   **Low priority only.** Use a snackbar for a message that needs no response. For an important one that blocks the task, use a dialog.
*   **One at a time.** Show a single snackbar, and queue [consecutive](#consecutive-snackbars) messages.
*   **At most one action.** Give it a short action such as Undo. A snackbar with an action stays until it is used or dismissed.
*   **Repeat the message nearby.** A snackbar that disappears on its own is easy to miss, so also show the result inline, such as changing "Save" to "Saved".

## Anatomy

A snackbar has a message, an optional action and an optional close button.

{% demo "A snackbar with a message, an action and a close button" %}
<md-gb-snackbar open timeout-ms="-1">
  Photo deleted
  <md-gb-button slot="action">Undo</md-gb-button>
  <md-gb-icon-button slot="dismiss" aria-label="Close">
    <md-gb-icon>close</md-gb-icon>
  </md-gb-icon-button>
</md-gb-snackbar>
{% enddemo %}

## Examples

### Close button

Add `has-close-button` so people can dismiss the snackbar. Without an action it stays for `timeout-ms` (5 seconds by default); use `-1` to keep it open.

{% demo "A snackbar with a close button that stays open" height=240 %}
```html
<md-gb-button id="save">Save</md-gb-button>
<md-gb-snackbar id="saved" fixed has-close-button timeout-ms="-1" label-text="Changes saved"></md-gb-snackbar>
```
```ts
document.querySelector('#save')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```
{% enddemo %}

### Two lines

Put longer text in the default slot for a two-line snackbar.

{% demo "A two-line snackbar" height=240 %}
```html
<md-gb-button id="send">Send</md-gb-button>
<md-gb-snackbar id="sent" fixed action-label="View">
  Message sent to 3 people.<br>Replies appear in your inbox.
</md-gb-snackbar>
```
```ts
document.querySelector('#send')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```
{% enddemo %}

### Consecutive snackbars

`md-gb-snackbar-host` shows messages one after another. Call `showSnackbar()`; it resolves with `action-performed` or `dismissed`. Pass `replace: true` to swap out a message that is out of date.

{% demo "A host that queues two messages and reports the result" height=280 %}
```html
<md-gb-button id="queue">Queue messages</md-gb-button>
<output id="result" role="status"></output>
<md-gb-snackbar-host id="host" fixed></md-gb-snackbar-host>
```
```ts
const host = document.querySelector('md-gb-snackbar-host')!;
const result = document.querySelector('#result')!;
document.querySelector('#queue')!.addEventListener('click', async () => {
  host.showSnackbar('Photo uploaded');
  const outcome = await host.showSnackbar({message: 'Photo deleted', actionLabel: 'Undo'});
  result.textContent = outcome === 'action-performed' ? 'Restored' : 'Deleted';
});
```
{% enddemo %}

### Anchor

Set `anchor` to the id of an element, such as a FAB, so the snackbar appears above it.

{% demo "A snackbar anchored above a FAB" height=280 %}
```html
<md-gb-fab id="compose" aria-label="Compose">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
<md-gb-snackbar id="drafted" fixed anchor="compose" label-text="Draft saved"></md-gb-snackbar>
```
```ts
document.querySelector('#compose')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```
{% enddemo %}

## Accessibility

*   The message is announced politely in a live region, so focus stays where it is.
*   Auto-dismissing snackbars are hard to read for people with low vision or who need more time. Give the same information inline, or add an action so the snackbar stays until it is used.
*   Give a snackbar that has a close button a localized `close-label`.
*   Escape closes the snackbar, and a slotted action is a normal button in the tab order.

## API reference

{% gbapi "snackbar" %}

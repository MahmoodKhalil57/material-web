---
title: Sheets
section: components
category: sheets
order: 16
summary: Show supporting content in a surface that slides in
description: Sheets show supplementary content and actions anchored to the bottom or the side of the window.
---
{% demo "A modal bottom sheet with file actions" height=360 %}
```html
<md-gb-button id="open-actions">Show actions</md-gb-button>
<md-gb-bottom-sheet id="actions" modal label="File actions">
  <md-gb-list>
    <md-gb-list-item>Share</md-gb-list-item>
    <md-gb-list-item>Get link</md-gb-list-item>
    <md-gb-list-item>Make a copy</md-gb-list-item>
  </md-gb-list>
</md-gb-bottom-sheet>
```
```js
document.querySelector('#open-actions').addEventListener('click', () => {
  document.querySelector('#actions').show();
});
```
{% enddemo %}

## Usage guidelines

*   **Secondary content.** Sheets hold extra content and actions, not the main content of the app.
*   **Match the window size.** Use a [bottom sheet](#bottom-sheets) in compact and medium windows and a [side sheet](#side-sheets) in wider ones.
*   **Standard or modal.** A standard sheet sits beside the content so people can keep using it. A modal sheet blocks the page under a scrim until it is closed.

## Anatomy

A bottom sheet has a container and an optional drag handle. A side sheet adds a headline, a close button and actions.

{% demo "A bottom sheet and a side sheet, each opened by a button" height=360 %}
```html
<md-gb-button id="open-bottom">Bottom sheet</md-gb-button>
<md-gb-button id="open-side">Side sheet</md-gb-button>

<md-gb-bottom-sheet id="bottom" modal label="Share">
  <p>Share this photo with friends.</p>
</md-gb-bottom-sheet>

<md-gb-side-sheet id="side" modal>
  <span slot="headline">Filters</span>
  <p>Narrow the results by date or author.</p>
  <md-gb-button slot="actions">Apply</md-gb-button>
</md-gb-side-sheet>
```
```js
document.querySelector('#open-bottom').addEventListener('click', () => {
  document.querySelector('#bottom').show();
});
document.querySelector('#open-side').addEventListener('click', () => {
  document.querySelector('#side').show();
});
```
{% enddemo %}

## Examples

### Bottom sheets

A bottom sheet rests at a partial height and expands when dragged or when its handle is activated. Without `modal` it is a standard sheet with no scrim. Set `state="expanded"` to open it at full height.

{% demo "A bottom sheet that opens expanded" height=360 %}
```html
<md-gb-button id="open-expanded">Show details</md-gb-button>
<md-gb-bottom-sheet id="expanded" modal state="expanded" label="Photo details">
  <p>Taken on June 3 in Lisbon.</p>
</md-gb-bottom-sheet>
```
```js
document.querySelector('#open-expanded').addEventListener('click', () => {
  document.querySelector('#expanded').show();
});
```
{% enddemo %}

### Without a drag handle

Add `hide-drag-handle` to remove the handle and dragging. Add `skip-partially-expanded` for a sheet that has no partial height.

{% demo "A bottom sheet without a drag handle" height=360 %}
```html
<md-gb-button id="open-plain">Show options</md-gb-button>
<md-gb-bottom-sheet id="plain" modal hide-drag-handle label="Sort options">
  <p>Sort by name, date, or size.</p>
</md-gb-bottom-sheet>
```
```js
document.querySelector('#open-plain').addEventListener('click', () => {
  document.querySelector('#plain').show();
});
```
{% enddemo %}

### Side sheets

A side sheet has a `headline`, a close button and an `actions` slot. Add `divider` to separate the actions, and `detached` to float the sheet with margins.

{% demo "A modal side sheet with Save and Cancel actions" height=360 %}
```html
<md-gb-button id="open-filters">Filters</md-gb-button>
<md-gb-side-sheet id="filters" modal headline="Filters">
  <p>Narrow the results by date or author.</p>
  <md-gb-button slot="actions">Save</md-gb-button>
  <md-gb-button slot="actions" color="outlined">Cancel</md-gb-button>
</md-gb-side-sheet>
```
```js
document.querySelector('#open-filters').addEventListener('click', () => {
  document.querySelector('#filters').show();
});
```
{% enddemo %}

### Back button

Set `has-back-button` on a side sheet to let people go back to an earlier region. The sheet fires `back` when it is pressed.

{% demo "A side sheet with a back button" height=360 %}
```html
<md-gb-button id="open-detail">Details</md-gb-button>
<md-gb-side-sheet id="detail" modal has-back-button headline="Details">
  <p>Created by Ada on May 2.</p>
</md-gb-side-sheet>
```
```js
document.querySelector('#open-detail').addEventListener('click', () => {
  document.querySelector('#detail').show();
});
```
{% enddemo %}

## Accessibility

*   A modal sheet is a `<dialog>`: focus moves into it, stays inside, and returns to the opener on close. Escape and a click on the scrim close it.
*   Name a bottom sheet with `label`. A side sheet is named by its `headline`, or by `label` when it has none.
*   The drag handle is a button, so keyboard users can expand and collapse the sheet. Localize `drag-handle-label`, `close-label` and `back-label`.

## API reference

{% gbapi "sheet" %}

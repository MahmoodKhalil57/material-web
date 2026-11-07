---
title: Sheets
section: components
order: 28
description: Sheets show supplementary content and actions anchored to the bottom or the side of the window.
---
{% demo "A modal bottom sheet with file actions" %}
<md-gb-button id="open-actions">Show actions</md-gb-button>
<md-gb-bottom-sheet id="actions" modal label="File actions">
  <md-gb-list>
    <md-gb-list-item>Share</md-gb-list-item>
    <md-gb-list-item>Get link</md-gb-list-item>
    <md-gb-list-item>Make a copy</md-gb-list-item>
  </md-gb-list>
</md-gb-bottom-sheet>
{% enddemo %}

```js
document.querySelector('#open-actions').addEventListener('click', () => {
  document.querySelector('#actions').show();
});
```

<script type="module">
  document.querySelector('#open-actions').addEventListener('click', () => {
    document.querySelector('#actions').show();
  });
</script>

## Usage guidelines

*   **Secondary content.** Sheets hold extra content and actions, not the main content of the app.
*   **Match the window size.** Use a [bottom sheet](#bottom-sheets) in compact and medium windows and a [side sheet](#side-sheets) in wider ones.
*   **Standard or modal.** A standard sheet sits beside the content so people can keep using it. A modal sheet blocks the page under a scrim until it is closed.

## Anatomy

A bottom sheet has a container and an optional drag handle. A side sheet adds a headline, a close button and actions.

```html
<md-gb-bottom-sheet>
  …
</md-gb-bottom-sheet>

<md-gb-side-sheet>
  <span slot="headline"></span>
  …
  <md-gb-button slot="actions"></md-gb-button>
</md-gb-side-sheet>
```

## Examples

### Bottom sheets

A bottom sheet rests at a partial height and expands when dragged or when its handle is activated. Without `modal` it is a standard sheet with no scrim. Set `state="expanded"` to open it at full height.

{% demo "A bottom sheet that opens expanded" %}
<md-gb-button id="open-expanded">Show details</md-gb-button>
<md-gb-bottom-sheet id="expanded" modal state="expanded" label="Photo details">
  <p>Taken on June 3 in Lisbon.</p>
</md-gb-bottom-sheet>
{% enddemo %}

<script type="module">
  document.querySelector('#open-expanded').addEventListener('click', () => {
    document.querySelector('#expanded').show();
  });
</script>

### Without a drag handle

Add `hide-drag-handle` to remove the handle and dragging. Add `skip-partially-expanded` for a sheet that has no partial height.

{% demo "A bottom sheet without a drag handle" %}
<md-gb-button id="open-plain">Show options</md-gb-button>
<md-gb-bottom-sheet id="plain" modal hide-drag-handle label="Sort options">
  <p>Sort by name, date, or size.</p>
</md-gb-bottom-sheet>
{% enddemo %}

<script type="module">
  document.querySelector('#open-plain').addEventListener('click', () => {
    document.querySelector('#plain').show();
  });
</script>

### Side sheets

A side sheet has a `headline`, a close button and an `actions` slot. Add `divider` to separate the actions, and `detached` to float the sheet with margins.

{% demo "A modal side sheet with Save and Cancel actions" %}
<md-gb-button id="open-filters">Filters</md-gb-button>
<md-gb-side-sheet id="filters" modal headline="Filters">
  <p>Narrow the results by date or author.</p>
  <md-gb-button slot="actions">Save</md-gb-button>
  <md-gb-button slot="actions" color="outlined">Cancel</md-gb-button>
</md-gb-side-sheet>
{% enddemo %}

<script type="module">
  document.querySelector('#open-filters').addEventListener('click', () => {
    document.querySelector('#filters').show();
  });
</script>

### Back button

Set `has-back-button` on a side sheet to let people go back to an earlier region. The sheet fires `back` when it is pressed.

{% demo "A side sheet with a back button" %}
<md-gb-button id="open-detail">Details</md-gb-button>
<md-gb-side-sheet id="detail" modal has-back-button headline="Details">
  <p>Created by Ada on May 2.</p>
</md-gb-side-sheet>
{% enddemo %}

<script type="module">
  document.querySelector('#open-detail').addEventListener('click', () => {
    document.querySelector('#detail').show();
  });
</script>

## Accessibility

*   A modal sheet is a `<dialog>`: focus moves into it, stays inside, and returns to the opener on close. Escape and a click on the scrim close it.
*   Name a bottom sheet with `label`. A side sheet is named by its `headline`, or by `label` when it has none.
*   The drag handle is a button, so keyboard users can expand and collapse the sheet. Localize `drag-handle-label`, `close-label` and `back-label`.

## API reference

{% gbapi "sheet" %}

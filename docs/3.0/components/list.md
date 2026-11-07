---
title: Lists
section: components
order: 15
description: Lists are continuous, vertical indexes of text and images, with optional selection, reordering, expanding and swipe actions.
---
{% demo "A segmented list of three items with supporting and trailing text" %}
<md-gb-list segmented>
  <md-gb-list-item>
    <md-gb-icon slot="leading">celebration</md-gb-icon>
    Festivals
    <span slot="supporting-text">Food, music, arts, community</span>
    <span slot="trailing-text">May 8</span>
  </md-gb-list-item>
  <md-gb-list-item>
    <md-gb-icon slot="leading">palette</md-gb-icon>
    Arts
    <span slot="supporting-text">Literature, games, music</span>
    <span slot="trailing-text">May 12</span>
  </md-gb-list-item>
  <md-gb-list-item>
    <md-gb-icon slot="leading">groups</md-gb-icon>
    Family and friends
    <span slot="supporting-text">The relationships that bring and bind</span>
    <span slot="trailing-text">May 20</span>
  </md-gb-list-item>
</md-gb-list>
{% enddemo %}

## Usage guidelines

*   **Make items easy to scan.** Keep labels short, order items in a logical way such as alphabetical or numerical, and show icons, text and actions in a consistent format.
*   **Choose a style.** A standard list is flat; a [segmented](#segmented) list separates each item into its own container.
*   **Match the item to its content.** Add [supporting text](#slots), an overline, an avatar or a leading icon to describe what an item is.
*   **Add behavior when it helps.** Lists can [select](#selection), [reorder](#reordering), [expand](#expandable-items) and reveal [swipe actions](#swipe-actions).

## Anatomy

A list holds list items. Each item has a label and slots around it.

{% demo "A list item with every part filled in" %}
<md-gb-list aria-label="Messages">
  <md-gb-list-item>
    <div slot="avatar">A</div>
    <md-gb-icon slot="leading">mail</md-gb-icon>
    <span slot="overline">Inbox</span>
    Ada Lovelace
    <span slot="supporting-text">Notes on the engine</span>
    <span slot="trailing-text">9:41 AM</span>
    <md-gb-icon slot="trailing">star</md-gb-icon>
  </md-gb-list-item>
</md-gb-list>
{% enddemo %}

## Examples

### Slots

An item's label is its default slot. Put an `md-gb-icon` in `leading`, a circular image or initial in `avatar`, a small line above the label in `overline`, and more detail in `supporting-text`.

{% demo "Items with a leading icon, an overline and trailing text" %}
<md-gb-list>
  <md-gb-list-item>
    <md-gb-icon slot="leading">mail</md-gb-icon>
    <span slot="overline">Inbox</span>
    Weekly digest
    <span slot="supporting-text">Your summary for the last seven days</span>
    <span slot="trailing-text">9:41 AM</span>
  </md-gb-list-item>
  <md-gb-list-item>
    <md-gb-icon slot="leading">mail</md-gb-icon>
    <span slot="overline">Inbox</span>
    Trip itinerary
    <span slot="supporting-text">Flights, hotel and reservations</span>
    <span slot="trailing-text">Yesterday</span>
  </md-gb-list-item>
</md-gb-list>
{% enddemo %}

### Segmented

Add `segmented` to show each item in its own container, separated by a small gap.

{% demo "A segmented list of three items" %}
<md-gb-list segmented>
  <md-gb-list-item>Apples</md-gb-list-item>
  <md-gb-list-item>Bananas</md-gb-list-item>
  <md-gb-list-item>Cucumbers</md-gb-list-item>
</md-gb-list>
{% enddemo %}

### Non-interactive items

Add `static` to an item that only displays information, so it has no hover, focus or press states.

{% demo "A list of static items with dates" %}
<md-gb-list segmented>
  <md-gb-list-item static>
    The first computer (ENIAC)
    <span slot="trailing-text">1946</span>
  </md-gb-list-item>
  <md-gb-list-item static>
    Sputnik launched into space
    <span slot="trailing-text">1957</span>
  </md-gb-list-item>
</md-gb-list>
{% enddemo %}

### Selection

Add `selectable` to let people select several items with a long press, and by tapping while in selection mode. The list fires `itemselectionchange`, and selected items have `checked`. Add `selection-primary` when selecting is the main task, to always show the checkboxes.

{% demo "A selectable list of photos" %}
<md-gb-list selectable segmented>
  <md-gb-list-item>
    <md-gb-icon slot="leading">image</md-gb-icon>
    Beach
  </md-gb-list-item>
  <md-gb-list-item>
    <md-gb-icon slot="leading">image</md-gb-icon>
    Forest
  </md-gb-list-item>
  <md-gb-list-item>
    <md-gb-icon slot="leading">image</md-gb-icon>
    Mountains
  </md-gb-list-item>
</md-gb-list>
{% enddemo %}

### Reordering

Add `reorderable` to show a drag handle on every item. People can drag it, or tap it and use the move up and move down buttons. The list fires a cancelable `reorder` event.

{% demo "A reorderable list of recipe steps" %}
<md-gb-list reorderable segmented>
  <md-gb-list-item>Preheat the oven</md-gb-list-item>
  <md-gb-list-item>Mix the dough</md-gb-list-item>
  <md-gb-list-item>Let it rise</md-gb-list-item>
  <md-gb-list-item>Bake for 40 minutes</md-gb-list-item>
</md-gb-list>
{% enddemo %}

### Expandable items

Add `expandable` to an item and put a nested `md-gb-list` in its `nested` slot. Add `expanded` to start open.

{% demo "An expandable item with three nested items" %}
<md-gb-list segmented>
  <md-gb-list-item expandable expanded>
    <md-gb-icon slot="leading">checklist</md-gb-icon>
    Groceries
    <span slot="supporting-text">3 items</span>
    <md-gb-list slot="nested" segmented>
      <md-gb-list-item>Bread</md-gb-list-item>
      <md-gb-list-item>Milk</md-gb-list-item>
      <md-gb-list-item>Eggs</md-gb-list-item>
    </md-gb-list>
  </md-gb-list-item>
</md-gb-list>
{% enddemo %}

### Swipe actions

Put buttons in the `leading-actions` and `trailing-actions` slots to reveal them when people swipe an item. A "more" button and the arrow keys offer the same actions without swiping.

{% demo "A list item with a pin action and share and archive actions" %}
<md-gb-list segmented>
  <md-gb-list-item>
    <md-gb-icon slot="leading">restaurant</md-gb-icon>
    Fresh baked breads
    <button slot="leading-actions" aria-label="Pin Fresh baked breads">
      <md-gb-icon>keep</md-gb-icon>
    </button>
    <button slot="trailing-actions" aria-label="Share Fresh baked breads">
      <md-gb-icon>share</md-gb-icon>
    </button>
    <button slot="trailing-actions" aria-label="Archive Fresh baked breads">
      <md-gb-icon>archive</md-gb-icon>
    </button>
  </md-gb-list-item>
</md-gb-list>
{% enddemo %}

### Density

Set `density` on the list from `0` (default) down to `-3` to remove 4px of height per step. Keep it off by default and let people opt in.

{% demo "A list at density -2" %}
<md-gb-list density="-2" segmented>
  <md-gb-list-item>Apples</md-gb-list-item>
  <md-gb-list-item>Bananas</md-gb-list-item>
  <md-gb-list-item>Cucumbers</md-gb-list-item>
</md-gb-list>
{% enddemo %}

## Accessibility

*   A list has `role="list"`, and `role="listbox"` when it is `selectable`. Items have `role="listitem"`. Label a list with `aria-label` or `aria-labelledby` when its purpose isn't clear from the page.
*   Arrow keys move between items.
*   In a reorderable list, the drag handle and the move up and move down buttons have labels built from the item's text, and moves are announced to screen readers. Change them with `drag-handle-label`, `move-up-label` and `move-down-label` when you translate the page.
*   Give swipe action buttons an `aria-label` that names the item, such as "Share Fresh baked breads".
*   Selecting and reordering must not need a gesture only: the checkboxes, the move buttons and the "more" button are the single-pointer alternatives.

{% demo "A list labelled Shopping list" %}
<md-gb-list aria-label="Shopping list">
  <md-gb-list-item>Bread</md-gb-list-item>
  <md-gb-list-item>Milk</md-gb-list-item>
</md-gb-list>
{% enddemo %}

## API reference

{% gbapi "list" %}

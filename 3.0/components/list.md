# Lists

Lists are continuous, vertical indexes of text and images, with optional selection, reordering, expanding and swipe actions.

**Example: A segmented list of three items with supporting and trailing text**

```html
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
```

## Usage guidelines

*   **Make items easy to scan.** Keep labels short, order items in a logical way such as alphabetical or numerical, and show icons, text and actions in a consistent format.
*   **Choose a style.** A standard list is flat; a [segmented](#segmented) list separates each item into its own container.
*   **Match the item to its content.** Add [supporting text](#slots), an overline, an avatar or a leading icon to describe what an item is.
*   **Add behavior when it helps.** Lists can [select](#selection), [reorder](#reordering), [expand](#expandable-items) and reveal [swipe actions](#swipe-actions).

## Anatomy

A list holds list items. Each item has a label and slots around it.

**Example: A list item with every part filled in**

```html
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
```

## Examples

### Slots

An item's label is its default slot. Put an `md-gb-icon` in `leading`, a circular image or initial in `avatar`, a small line above the label in `overline`, and more detail in `supporting-text`.

**Example: Items with a leading icon, an overline and trailing text**

```html
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
```

### Segmented

Add `segmented` to show each item in its own container, separated by a small gap.

**Example: A segmented list of three items**

```html
<md-gb-list segmented>
  <md-gb-list-item>Apples</md-gb-list-item>
  <md-gb-list-item>Bananas</md-gb-list-item>
  <md-gb-list-item>Cucumbers</md-gb-list-item>
</md-gb-list>
```

### Non-interactive items

Add `static` to an item that only displays information, so it has no hover, focus or press states.

**Example: A list of static items with dates**

```html
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
```

### Selection

Add `selectable` to let people select several items with a long press, and by tapping while in selection mode. The list fires `itemselectionchange`, and selected items have `checked`. Add `selection-primary` when selecting is the main task, to always show the checkboxes.

**Example: A selectable list of photos**

```html
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
```

### Reordering

Add `reorderable` to show a drag handle on every item. People can drag it, or tap it and use the move up and move down buttons. The list fires a cancelable `reorder` event.

**Example: A reorderable list of recipe steps**

```html
<md-gb-list reorderable segmented>
  <md-gb-list-item>Preheat the oven</md-gb-list-item>
  <md-gb-list-item>Mix the dough</md-gb-list-item>
  <md-gb-list-item>Let it rise</md-gb-list-item>
  <md-gb-list-item>Bake for 40 minutes</md-gb-list-item>
</md-gb-list>
```

### Expandable items

Add `expandable` to an item and put a nested `md-gb-list` in its `nested` slot. Add `expanded` to start open.

**Example: An expandable item with three nested items**

```html
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
```

### Swipe actions

Put buttons in the `leading-actions` and `trailing-actions` slots to reveal them when people swipe an item. A "more" button and the arrow keys offer the same actions without swiping.

**Example: A list item with a pin action and share and archive actions**

```html
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
```

### Density

Set `density` on the list from `0` (default) down to `-3` to remove 4px of height per step. Keep it off by default and let people opt in.

**Example: A list at density -2**

```html
<md-gb-list density="-2" segmented>
  <md-gb-list-item>Apples</md-gb-list-item>
  <md-gb-list-item>Bananas</md-gb-list-item>
  <md-gb-list-item>Cucumbers</md-gb-list-item>
</md-gb-list>
```

## Accessibility

*   A list has `role="list"`, and `role="listbox"` when it is `selectable`. Items have `role="listitem"`. Label a list with `aria-label` or `aria-labelledby` when its purpose isn't clear from the page.
*   Arrow keys move between items.
*   In a reorderable list, the drag handle and the move up and move down buttons have labels built from the item's text, and moves are announced to screen readers. Change them with `drag-handle-label`, `move-up-label` and `move-down-label` when you translate the page.
*   Give swipe action buttons an `aria-label` that names the item, such as "Share Fresh baked breads".
*   Selecting and reordering must not need a gesture only: the checkboxes, the move buttons and the "more" button are the single-pointer alternatives.

**Example: A list labelled Shopping list**

```html
<md-gb-list aria-label="Shopping list">
  <md-gb-list-item>Bread</md-gb-list-item>
  <md-gb-list-item>Milk</md-gb-list-item>
</md-gb-list>
```

## API reference

### &lt;md-gb-list&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the items' height (spec foundations Density: "decreasing the top and bottom padding or overall height by 4dp"). Values are clamped to that range. Like <code>md-gb-segmented-button-set</code>'s <code>density</code>.</span> | <code>density</code> | <code>ListDensity</code> |  |
| <code>reorderable</code><br><span class="gb-desc">Whether the items can be reordered. Shows a drag handle on every item.</span> | <code>reorderable</code> | <code>boolean</code> | <code>false</code> |
| <code>reorderMessages</code><br><span class="gb-desc">The screen reader announcements made while reordering.</span> |  | <code>ListReorderMessages</code> | <code>LIST_REORDER_MESSAGES</code> |
| <code>segmented</code><br><span class="gb-desc">Whether to render the list with segmented items.</span> | <code>segmented</code> | <code>boolean</code> | <code>false</code> |
| <code>selectable</code><br><span class="gb-desc">Whether the user can select several items with a long press (and drag), and by tapping them while in selection mode.</span> | <code>selectable</code> | <code>boolean</code> | <code>false</code> |
| <code>selectionPrimary</code><br><span class="gb-desc">Whether selecting is the list's primary activity: a <code>selectable</code> list then always shows the selection checkboxes (on desktop).</span> | <code>selection-primary</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display list items. |

#### Events

| Event | Description |
| --- | --- |
| <code>itemselectionchange</code><br><span class="gb-desc">Event</span> | When the user changes the selected items of a <code>selectable</code> list (<code>ListSelectionChangeEvent</code> with <code>selected</code>). |
| <code>reorder</code><br><span class="gb-desc">Event</span> | When the user drops an item at a new position (<code>ListReorderEvent</code> with <code>from</code>, <code>to</code> and <code>item</code>). Cancelable. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(drop-zone)</code> | The drop target shown while dragging. |
| <code>::part(list)</code> | The list's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-shape</code> |  |
| <code>--gap</code> |  |

### &lt;md-gb-list-item&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>checked</code><br><span class="gb-desc">Whether the list item is selected.</span> | <code>checked</code> | <code>boolean</code> | <code>false</code> |
| <code>disabled</code><br><span class="gb-desc">Whether the list item is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>dragging</code><br><span class="gb-desc">Whether the item is being dragged. Set by the list while reordering.</span> | <code>dragging</code> | <code>boolean</code> | <code>false</code> |
| <code>dragHandleLabel</code><br><span class="gb-desc">The accessible label prefix of the drag handle; the item's label text is appended (e.g. "Reorder Apples").</span> | <code>drag-handle-label</code> | <code>string</code> | <code>"Reorder"</code> |
| <code>expandable</code><br><span class="gb-desc">Whether the item expands to reveal the content in its <code>nested</code> slot. Expandable items are always interactive.</span> | <code>expandable</code> | <code>boolean</code> | <code>false</code> |
| <code>expanded</code><br><span class="gb-desc">Whether an <code>expandable</code> item is expanded.</span> | <code>expanded</code> | <code>boolean</code> | <code>false</code> |
| <code>grabbed</code><br><span class="gb-desc">Whether the item is grabbed for reordering without dragging (with the keyboard or a tap on the drag handle). Set by the list; shows the move up and move down buttons.</span> | <code>grabbed</code> | <code>boolean</code> | <code>false</code> |
| <code>moveDownLabel</code><br><span class="gb-desc">The accessible label prefix of the move down button; the item's label text is appended.</span> | <code>move-down-label</code> | <code>string</code> | <code>"Move down"</code> |
| <code>moveUpLabel</code><br><span class="gb-desc">The accessible label prefix of the move up button; the item's label text is appended (e.g. "Move up Apples").</span> | <code>move-up-label</code> | <code>string</code> | <code>"Move up"</code> |
| <code>nonInteractive</code><br><span class="gb-desc">Whether the list item is non-interactive.</span> | <code>static</code> | <code>boolean</code> | <code>false</code> |
| <code>noRevealButton</code><br><span class="gb-desc">Hides the "more" button that reveals the swipe actions with a tap. Only set it when the app offers another single-pointer way to reach them (e.g. a menu), as the spec requires one.</span> | <code>no-reveal-button</code> | <code>boolean</code> | <code>false</code> |
| <code>reorderable</code><br><span class="gb-desc">Whether to show a drag handle to reorder the item within its <code>md-gb-list</code>. Set by the list when the list is <code>reorderable</code>.</span> | <code>reorderable</code> | <code>boolean</code> | <code>false</code> |
| <code>revealButtonLabel</code><br><span class="gb-desc">The accessible label prefix of the "more" button; the item's label text is appended (e.g. "More actions Apples").</span> | <code>reveal-button-label</code> | <code>string</code> | <code>"More actions"</code> |
| <code>revealed</code><br><span class="gb-desc">The side whose swipe actions are revealed, or <code>''</code> when closed.</span> | <code>revealed</code> | <code>ListItemRevealed</code> | <code>""</code> |
| <code>rovingTabIndex</code><br><span class="gb-desc">Set by a parent <code>md-gb-list</code> to make the list a single tab stop with arrow-key navigation (roving tabindex, lists.md Keyboard navigation): <code>0</code> on the list's tab stop, <code>-1</code> on the other items, <code>null</code> (default) for an item outside a list. While set, the item's other controls (drag handle, "more" and move buttons, actions) leave the tab order and are reached with Left/Right.</span> |  | <code>number</code> | <code>null</code> |
| <code>selectable</code><br><span class="gb-desc">Whether the item shows a selection checkbox (hover, or whenever <code>selectionVisible</code>). Set by a <code>selectable</code> parent <code>md-gb-list</code>.</span> |  | <code>boolean</code> | <code>false</code> |
| <code>selectionVisible</code><br><span class="gb-desc">Whether the selection checkbox is always shown: the list sets it when selection is the primary activity or once an item is selected (selection.md, "Click"). Otherwise the checkbox shows on hover.</span> | <code>selection-visible</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display the item's primary label. |
| <code>avatar</code> | Used to display a circular avatar before the item's content. |
| <code>leading</code> | Used to display icons and content before the item's main content. |
| <code>leading-actions</code> | Buttons revealed by swiping toward the end. |
| <code>nested</code> | Nested items or content an <code>expandable</code> item reveals. |
| <code>overline</code> | Used to display overline text above the main label. |
| <code>supporting-text</code> | Used to display supporting text below the main label. |
| <code>trailing</code> | Used to display icons and content after the item's main content. |
| <code>trailing-actions</code> | Buttons revealed by swiping toward the start. The last one is the primary action. |
| <code>trailing-text</code> | Used to display metadata or text after the item's main content. |

#### Events

| Event | Description |
| --- | --- |
| <code>reveal-change</code><br><span class="gb-desc">Event</span> | When the user reveals or hides the swipe actions. |
| <code>toggle</code><br><span class="gb-desc">Event</span> | When the user expands or collapses an <code>expandable</code> item (<code>ToggleEvent</code>). |

#### Methods

| Method | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">() =&gt; void</span> | Hides the swipe actions. |
| <code>focusDragHandle</code><br><span class="gb-desc">() =&gt; void</span> | Focuses the item's drag handle, if it has one. |
| <code>focusPrimary</code><br><span class="gb-desc">() =&gt; void</span> | Focuses the item itself (its primary action), or its first control when the item is <code>static</code> or disabled. Used by <code>md-gb-list</code>'s arrow keys. |
| <code>reveal</code><br><span class="gb-desc">(side: "leading" | "trailing") =&gt; void</span> | Reveals the swipe actions on one side. |
| <code>rowElements</code><br><span class="gb-desc">() =&gt; HTMLElement[]</span> | The item's focusable elements in visual order (start to end): leading actions, interactive <code>avatar</code>/<code>leading</code> content, the item, interactive <code>trailing</code> content, the "more" button, the move up / move down buttons, the drag handle and the trailing actions. Left/Right move through them. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(actions)</code> | The container of the revealed actions. |
| <code>::part(drag-handle)</code> | The reorder drag handle. |
| <code>::part(list-item)</code> | The list item's root element. |
| <code>::part(move-down)</code> | The button that moves a grabbed item down. |
| <code>::part(move-up)</code> | The button that moves a grabbed item up. |
| <code>::part(nested)</code> | The expandable region of nested content. |
| <code>::part(reveal-button)</code> | The "more" button that reveals the swipe actions. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--avatar-color</code> |  |
| <code>--avatar-label</code> |  |
| <code>--avatar-label-axes</code> |  |
| <code>--avatar-label-color</code> |  |
| <code>--avatar-label-tracking</code> |  |
| <code>--avatar-shape</code> |  |
| <code>--avatar-size</code> |  |
| <code>--between-space</code> |  |
| <code>--bottom-space</code> |  |
| <code>--container-color</code> |  |
| <code>--container-height</code> |  |
| <code>--container-shape</code> |  |
| <code>--density-step</code> | Height removed per density step (set <code>density</code> on <code>md-gb-list</code>). |
| <code>--label-text</code> |  |
| <code>--label-text-color</code> |  |
| <code>--label-text-tracking</code> |  |
| <code>--leading-icon-color</code> |  |
| <code>--leading-icon-size</code> |  |
| <code>--leading-space</code> |  |
| <code>--overline</code> |  |
| <code>--overline-axes</code> |  |
| <code>--overline-color</code> |  |
| <code>--overline-tracking</code> |  |
| <code>--supporting-text</code> |  |
| <code>--supporting-text-axes</code> |  |
| <code>--supporting-text-color</code> |  |
| <code>--supporting-text-tracking</code> |  |
| <code>--top-space</code> |  |
| <code>--trailing-icon-color</code> |  |
| <code>--trailing-icon-size</code> |  |
| <code>--trailing-space</code> |  |
| <code>--trailing-supporting-text</code> |  |
| <code>--trailing-supporting-text-axes</code> |  |
| <code>--trailing-supporting-text-color</code> |  |
| <code>--trailing-supporting-text-tracking</code> |  |

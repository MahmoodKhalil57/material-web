# list

Elements: `md-gb-list`, `md-gb-list-item`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Lists**
  - One, two and three lines
  - Segmented
  - Selection
  - Expand (`md.comp.list.expand`)
  - Reorder (`md.comp.list.reorder`), pointer and keyboard
  - Reveal / swipe actions (`md.comp.list.reveal`)
  - Long press to select, long press and drag to select a range
  - Gaps: the baseline item shape and icon sizes (gb uses the Expressive ones)

## API

### `<md-gb-list>`

A Material Design component.

Source: `labs/gb/components/list/md-gb-list.ts`  
Import: `import '@material/web/labs/gb/components/list/md-gb-list.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | `density` (reflects) | `ListDensity` |  | The density, from 0 (default) to -3. Each step down removes 4px from the items' height (spec foundations Density: "decreasing the top and bottom padding or overall height by 4dp"). Values are clamped to that range. Like `md-gb-segmented-button-set`'s `density`. |
| `reorderable` | `reorderable` (reflects) | `boolean` | `false` | Whether the items can be reordered. Shows a drag handle on every item. |
| `reorderMessages` | property only | `ListReorderMessages` | `LIST_REORDER_MESSAGES` | The screen reader announcements made while reordering. |
| `segmented` | `segmented` | `boolean` | `false` | Whether to render the list with segmented items. |
| `selectable` | `selectable` (reflects) | `boolean` | `false` | Whether the user can select several items with a long press (and drag), and by tapping them while in selection mode. |
| `selectionPrimary` | `selection-primary` (reflects) | `boolean` | `false` | Whether selecting is the list's primary activity: a `selectable` list then always shows the selection checkboxes (on desktop). |

Slots

- default slot: Used to display list items.

Events

- `itemselectionchange` (`Event`): When the user changes the selected items of a `selectable` list (`ListSelectionChangeEvent` with `selected`).
- `reorder` (`Event`): When the user drops an item at a new position (`ListReorderEvent` with `from`, `to` and `item`). Cancelable.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(drop-zone)`: The drop target shown while dragging.
- `::part(list)`: The list's root element.

CSS custom properties

- `--container-shape`
- `--gap`

### `<md-gb-list-item>`

A Material Design component.

Source: `labs/gb/components/list/md-gb-list-item.ts`  
Import: `import '@material/web/labs/gb/components/list/md-gb-list-item.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `checked` | `checked` | `boolean` | `false` | Whether the list item is selected. |
| `disabled` | `disabled` | `boolean` | `false` | Whether the list item is disabled. |
| `dragging` | `dragging` (reflects) | `boolean` | `false` | Whether the item is being dragged. Set by the list while reordering. |
| `dragHandleLabel` | `drag-handle-label` | `string` | `"Reorder"` | The accessible label prefix of the drag handle; the item's label text is appended (e.g. "Reorder Apples"). |
| `expandable` | `expandable` (reflects) | `boolean` | `false` | Whether the item expands to reveal the content in its `nested` slot. Expandable items are always interactive. |
| `expanded` | `expanded` (reflects) | `boolean` | `false` | Whether an `expandable` item is expanded. |
| `grabbed` | `grabbed` (reflects) | `boolean` | `false` | Whether the item is grabbed for reordering without dragging (with the keyboard or a tap on the drag handle). Set by the list; shows the move up and move down buttons. |
| `moveDownLabel` | `move-down-label` | `string` | `"Move down"` | The accessible label prefix of the move down button; the item's label text is appended. |
| `moveUpLabel` | `move-up-label` | `string` | `"Move up"` | The accessible label prefix of the move up button; the item's label text is appended (e.g. "Move up Apples"). |
| `nonInteractive` | `static` (reflects) | `boolean` | `false` | Whether the list item is non-interactive. |
| `noRevealButton` | `no-reveal-button` | `boolean` | `false` | Hides the "more" button that reveals the swipe actions with a tap. Only set it when the app offers another single-pointer way to reach them (e.g. a menu), as the spec requires one. |
| `reorderable` | `reorderable` (reflects) | `boolean` | `false` | Whether to show a drag handle to reorder the item within its `md-gb-list`. Set by the list when the list is `reorderable`. |
| `revealButtonLabel` | `reveal-button-label` | `string` | `"More actions"` | The accessible label prefix of the "more" button; the item's label text is appended (e.g. "More actions Apples"). |
| `revealed` | `revealed` (reflects) | `ListItemRevealed` | `""` | The side whose swipe actions are revealed, or `''` when closed. |
| `rovingTabIndex` | property only | `number` | `null` | Set by a parent `md-gb-list` to make the list a single tab stop with arrow-key navigation (roving tabindex, lists.md Keyboard navigation): `0` on the list's tab stop, `-1` on the other items, `null` (default) for an item outside a list. While set, the item's other controls (drag handle, "more" and move buttons, actions) leave the tab order and are reached with Left/Right. |
| `selectable` | property only | `boolean` | `false` | Whether the item shows a selection checkbox (hover, or whenever `selectionVisible`). Set by a `selectable` parent `md-gb-list`. |
| `selectionVisible` | `selection-visible` (reflects) | `boolean` | `false` | Whether the selection checkbox is always shown: the list sets it when selection is the primary activity or once an item is selected (selection.md, "Click"). Otherwise the checkbox shows on hover. |

Slots

- default slot: Used to display the item's primary label.
- `avatar`: Used to display a circular avatar before the item's content.
- `leading`: Used to display icons and content before the item's main content.
- `leading-actions`: Buttons revealed by swiping toward the end.
- `nested`: Nested items or content an `expandable` item reveals.
- `overline`: Used to display overline text above the main label.
- `supporting-text`: Used to display supporting text below the main label.
- `trailing`: Used to display icons and content after the item's main content.
- `trailing-actions`: Buttons revealed by swiping toward the start. The last one is the primary action.
- `trailing-text`: Used to display metadata or text after the item's main content.

Events

- `reveal-change` (`Event`): When the user reveals or hides the swipe actions.
- `toggle` (`Event`): When the user expands or collapses an `expandable` item (`ToggleEvent`).

Methods

- `close`: `() => void` Hides the swipe actions.
- `focusDragHandle`: `() => void` Focuses the item's drag handle, if it has one.
- `focusPrimary`: `() => void` Focuses the item itself (its primary action), or its first control when the item is `static` or disabled. Used by `md-gb-list`'s arrow keys.
- `reveal`: `(side: "leading" | "trailing") => void` Reveals the swipe actions on one side.
- `rowElements`: `() => HTMLElement[]` The item's focusable elements in visual order (start to end): leading actions, interactive `avatar`/`leading` content, the item, interactive `trailing` content, the "more" button, the move up / move down buttons, the drag handle and the trailing actions. Left/Right move through them.

CSS parts

- `::part(actions)`: The container of the revealed actions.
- `::part(drag-handle)`: The reorder drag handle.
- `::part(list-item)`: The list item's root element.
- `::part(move-down)`: The button that moves a grabbed item down.
- `::part(move-up)`: The button that moves a grabbed item up.
- `::part(nested)`: The expandable region of nested content.
- `::part(reveal-button)`: The "more" button that reveals the swipe actions.

CSS custom properties

- `--avatar-color`
- `--avatar-label`
- `--avatar-label-axes`
- `--avatar-label-color`
- `--avatar-label-tracking`
- `--avatar-shape`
- `--avatar-size`
- `--between-space`
- `--bottom-space`
- `--container-color`
- `--container-height`
- `--container-shape`
- `--density-step`: Height removed per density step (set `density` on `md-gb-list`).
- `--label-text`
- `--label-text-color`
- `--label-text-tracking`
- `--leading-icon-color`
- `--leading-icon-size`
- `--leading-space`
- `--overline`
- `--overline-axes`
- `--overline-color`
- `--overline-tracking`
- `--supporting-text`
- `--supporting-text-axes`
- `--supporting-text-color`
- `--supporting-text-tracking`
- `--top-space`
- `--trailing-icon-color`
- `--trailing-icon-size`
- `--trailing-space`
- `--trailing-supporting-text`
- `--trailing-supporting-text-axes`
- `--trailing-supporting-text-color`
- `--trailing-supporting-text-tracking`

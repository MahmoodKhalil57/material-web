# snackbar

Elements: `md-gb-snackbar`, `md-gb-snackbar-host`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Snackbar**
  - Single line, two lines, action, close
  - Consecutive snackbars shown one at a time (`md-gb-snackbar-host`), announced in a polite live region

## API

### `<md-gb-snackbar>`

A Material Design snackbar component.

Source: `components/snackbar/md-gb-snackbar.ts`  
Import: `import '@material/web/components/snackbar/md-gb-snackbar.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `actionLabel` | `action-label` | `string` | `''` | Visible text of the built-in action button. Rendered only when non-empty and nothing is slotted into `action`. |
| `align` | `align` (reflects) | `"start" \| "center"` | `'center'` | Where a snackbar sits on wide layouts: `center` (default) or `start` (left-aligned). Use the same value wherever snackbars appear, so they always show in the same spot. Compact layouts span the width. |
| `anchor` | `anchor` | `string` | `''` | The id of an element the snackbar appears above, such as a FAB or a docked toolbar, in the snackbar's root (document or shadow root). See `anchorElement`. |
| `anchorElement` | property only | `HTMLElement` | `null` | An element the snackbar appears above, such as a FAB or a docked toolbar: while open, the snackbar's bottom edge sits `--bottom-offset` above the element's top edge. Takes precedence over `anchor`. |
| `closeLabel` | `close-label` | `string` | `'Close'` | Accessible label for the built-in dismiss button. |
| `fixed` | `fixed` (reflects) | `boolean` | `false` | Whether the snackbar should be positioned relative to the viewport (fixed). |
| `hasCloseButton` | `has-close-button` | `boolean` | `false` | Whether to display a close icon button. |
| `labelText` | `label-text` | `string` | `''` | Supporting message text to display. Rendered before default slot content. |
| `open` | `open` (reflects) | `boolean` |  | Whether the snackbar is currently open. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Whether to skip opening and closing transition delays. |
| `timeoutMs` | `timeout-ms` | `number` | `5000` | Time in milliseconds before the snackbar automatically dismisses. Set to 0 or a negative value (e.g. -1) to disable auto-dismiss. Read when the snackbar opens; changing it while open takes effect on the next open. |

Slots

- default slot: Default slot for rich content (rendered after `label-text`). If both `label-text` and slotted content are provided, both render.
- `action`: Slot for a custom action button; replaces the built-in action rendered from `action-label`. Prefer the `action-label` attribute, which renders a text button matching the spec. A slotted plain `<button>` is styled by the snackbar, with hover, focus and pressed states. A slotted text `<md-gb-button>` gets the `--action-label-text*` colors and typography, but keeps its own 16px padding and pressed shape, because its component tokens can't be set from outside its shadow root.
- `dismiss`: Slot for dismiss button (falls back to close icon button when `has-close-button` is set).

Events

- `close` (`CustomEvent<{reason: string}>`): Fired when the snackbar begins closing.
- `closed` (`CustomEvent<{reason: string}>`): Fired when the snackbar has closed.
- `open` (`Event`): Fired when the snackbar begins opening.
- `opened` (`Event`): Fired when the snackbar has opened and animations finished.

Methods

- `close`: `(reason?: string) => Promise<void>` Closes the snackbar.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `render`: `() => TemplateResult<1>` Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's `ChildPart` - typically a `TemplateResult`. Setting properties inside this method will *not* trigger the element to update.
- `show`: `() => Promise<void>` Opens the snackbar.
- `updateAnchorPosition`: `() => void` Places the snackbar above its anchor. Called while open when the window or the anchor resizes; call it after moving the anchor.

CSS parts

- `::part(actions)`: The container wrapping action and dismiss slots.
- `::part(label)`: The container wrapping the label content.
- `::part(surface)`: The surface container of the snackbar.

CSS custom properties

- `--action-label-text`: Action button label typography.
- `--action-label-text-axes`: Action button label typography font variation settings.
- `--action-label-text-color`: Action button label text color.
- `--action-label-text-tracking`: Action button label letter spacing.
- `--bottom-offset`: Inset block end distance from container bottom, or from the top of the `anchor`.
- `--container-color`: Container background color.
- `--container-elevation`: Container box shadow elevation.
- `--container-shape`: Container border radius.
- `--icon-color`: Close icon color.
- `--icon-size`: Close icon size.
- `--max-width`: Maximum surface width in wide layout.
- `--min-height`: Minimum surface height (the single-line height).
- `--min-width`: Minimum surface width in wide layout.
- `--position`: CSS position property (`absolute` by default).
- `--supporting-text`: Supporting label typography.
- `--supporting-text-axes`: Supporting label typography font variation settings.
- `--supporting-text-color`: Supporting label text color.
- `--supporting-text-tracking`: Supporting label letter spacing.
- `--with-single-line-container-height`: Single-line container height (spec 48dp).
- `--with-two-lines-container-height`: Two-line container height (spec 68dp).
- `--z-index`: Z-index of the snackbar.

### `<md-gb-snackbar-host>`

Shows queued snackbars one at a time.

Source: `components/snackbar/md-gb-snackbar-host.ts`  
Import: `import '@material/web/components/snackbar/md-gb-snackbar-host.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `anchor` | `anchor` | `string` | `''` | The id of the element the built-in snackbar appears above, such as a FAB (see `md-gb-snackbar` `anchor`). |
| `anchorElement` | property only | `HTMLElement` | `null` | The element the built-in snackbar appears above, such as a FAB. |
| `closeLabel` | `close-label` | `string` | `'Close'` | Accessible label of the close icon button. |
| `fixed` | `fixed` (reflects) | `boolean` | `false` | Whether the built-in snackbar is positioned in the viewport (fixed). |
| `quick` | `quick` (reflects) | `boolean` | `false` | Whether to skip the snackbar's opening and closing motion. |

Slots

- default slot: Optional `md-gb-snackbar` to show the messages in.

Events

- `close` (`CustomEvent<{reason: string}>`): Bubbles from the snackbar when it begins closing.
- `closed` (`CustomEvent<{reason: string}>`): Bubbles from the snackbar when it has closed.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `dismissAll`: `() => void` Dismisses the current snackbar and every queued one.
- `render`: `() => TemplateResult<1>` Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's `ChildPart` - typically a `TemplateResult`. Setting properties inside this method will *not* trigger the element to update.
- `showSnackbar`: `(options: string | ShowSnackbarOptions) => Promise<SnackbarResult>` Queues a snackbar and resolves when it ends: `action-performed` when its action is activated, otherwise `dismissed`.

CSS parts

- `::part(snackbar)`: The built-in snackbar, when none is slotted.

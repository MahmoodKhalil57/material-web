# sheet

Elements: `md-gb-bottom-sheet`, `md-gb-side-sheet`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Bottom sheets**
  - Standard, modal
  - Drag handle, swipe to dismiss, partially expanded and expanded
  - Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)
- **Side sheets**
  - Standard, modal; docked, detached
  - Swipe to dismiss the modal side sheet
  - Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)

## API

### `<md-gb-bottom-sheet>`

A Material Design bottom sheet.

Source: `labs/gb/components/sheet/md-gb-bottom-sheet.ts`  
Import: `import '@material/web/labs/gb/components/sheet/md-gb-bottom-sheet.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `closeLabel` | `close-label` | `string` | `'Close'` | Accessible label of the close icon button of a full-screen sheet. |
| `collapseLabel` | `collapse-label` | `string` | `'Collapse'` | Accessible label of the collapse icon button of a full-screen sheet. |
| `dragHandleLabel` | `drag-handle-label` | `string` | `'Drag handle'` | Accessible label of the drag handle button. |
| `hideDragHandle` | `hide-drag-handle` | `boolean` | `false` | Whether to hide the drag handle (which also disables dragging). |
| `label` | `label` | `string` | `'Bottom sheet'` | Accessible label of the sheet dialog. |
| `modal` | `modal` (reflects) | `boolean` | `false` | Whether the sheet is modal: shown above a scrim, blocking the rest of the page, and closed by Escape or a scrim click. |
| `open` | `open` (reflects) | `boolean` |  | Whether the sheet is open. Setting it calls `show()` or `close()`. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Whether to skip the opening and closing motion. |
| `skipPartiallyExpanded` | `skip-partially-expanded` | `boolean` | `false` | Whether the sheet has no partially expanded height: it opens expanded and the drag handle closes it. |
| `state` | `state` (reflects) | `BottomSheetState` | `BOTTOM_SHEET_STATES.partiallyExpanded` | The resting height while open: `partially-expanded` or `expanded`. Updated when the user drags or activates the drag handle. |

Slots

- default slot: The sheet content. It scrolls when taller than the sheet.

Events

- `>}` (`CustomEvent<{reason: string`): closed - Fired after the closing motion.
- `open` (`Event`): Fired when the sheet begins opening. Cancelable.
- `opened` (`Event`): Fired after the opening motion.
- `state-change` (`Event`): Fired when the user moves the sheet to another height (`state`).

Methods

- `close`: `(reason?: string) => Promise<void>` Closes the sheet. Resolves after the closing motion.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `expand`: `() => void` Expands the sheet to its full height.
- `handleBack`: `() => Promise<void>` Handles a back request (the Android back gesture or button, which a modal sheet receives through its dialog): plays the predictive back motion and closes the sheet with reason `back`. If the `close` event is canceled, the sheet settles back. Resolves after the closing motion. Call it for an in-app back control that should behave like the system back.
- `partialExpand`: `() => void` Moves the sheet to its partially expanded height, when it has one.
- `render`: `() => TemplateResult<1>` Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's `ChildPart` - typically a `TemplateResult`. Setting properties inside this method will *not* trigger the element to update.
- `show`: `() => Promise<void>` Opens the sheet. Resolves after the opening motion.

CSS parts

- `::part(container)`: The sheet container.
- `::part(content)`: The container of the default slot.
- `::part(dialog)`: The `<dialog>` holding the sheet; its `::backdrop` is the scrim.
- `::part(drag-handle)`: The drag handle button.

CSS custom properties

- `--container-color`: Container color.
- `--container-elevation`: Container box shadow.
- `--container-shape`: Top corner radius.
- `--drag-handle-color`: Drag handle color.
- `--drag-handle-height`: Drag handle height.
- `--drag-handle-padding-block`: Space above and below the drag handle.
- `--drag-handle-width`: Drag handle width.
- `--max-width`: Maximum container width.
- `--partially-expanded-height`: Maximum visible height of a partially expanded modal sheet.
- `--peek-height`: Visible height of a partially expanded standard sheet.
- `--scrim-color`: Scrim color of a modal sheet.
- `--scrim-opacity`: Scrim opacity of a modal sheet.
- `--top-margin`: Minimum space above the expanded sheet.
- `--wide-margin`: Top and side margins when the sheet is wider than its max width.

### `<md-gb-side-sheet>`

A Material Design side sheet.

Source: `labs/gb/components/sheet/md-gb-side-sheet.ts`  
Import: `import '@material/web/labs/gb/components/sheet/md-gb-side-sheet.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `backLabel` | `back-label` | `string` | `'Back'` | Accessible label of the back icon button. |
| `closeLabel` | `close-label` | `string` | `'Close'` | Accessible label of the close icon button. |
| `detached` | `detached` (reflects) | `boolean` | `false` | Whether the sheet floats inset from the window edges with rounded corners, instead of touching them. |
| `divider` | `divider` (reflects) | `boolean` | `false` | Whether to draw dividers: along the inline start edge of a standard docked sheet, and above the actions. |
| `gesturesDisabled` | `gestures-disabled` | `boolean` | `false` | Whether to turn off swipe to dismiss on a modal sheet. |
| `hasBackButton` | `has-back-button` | `boolean` | `false` | Whether to show the back icon button before the headline. |
| `headline` | `headline` | `string` | `''` | The headline text. |
| `hideCloseButton` | `hide-close-button` | `boolean` | `false` | Whether to hide the close icon button. Material requires a close affordance in every side sheet; provide another one when hiding it. |
| `label` | `label` | `string` | `''` | Accessible label of the sheet dialog, used when it has no headline. |
| `modal` | `modal` (reflects) | `boolean` | `false` | Whether the sheet is modal: shown above a scrim, blocking the rest of the page, and closed by Escape or a scrim click. |
| `open` | `open` (reflects) | `boolean` |  | Whether the sheet is open. Setting it calls `show()` or `close()`. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Whether to skip the opening and closing motion. |

Slots

- default slot: The sheet content. It scrolls vertically when taller than the sheet.
- `actions`: Action buttons at the bottom of the sheet, such as Save and Cancel.
- `headline`: Headline content; replaces the `headline` text.

Events

- `>}` (`CustomEvent<{reason: string`): closed - Fired after the closing motion.
- `back` (`Event`): Fired when the back icon button is activated.
- `open` (`Event`): Fired when the sheet begins opening. Cancelable.
- `opened` (`Event`): Fired after the opening motion.

Methods

- `close`: `(reason?: string) => Promise<void>` Closes the sheet. Resolves after the closing motion.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `handleBack`: `() => Promise<void>` Handles a back request (the Android back gesture or button, which a modal sheet receives through its dialog): plays the predictive back motion and closes the sheet with reason `back`. If the `close` event is canceled, the sheet settles back. Resolves after the closing motion. Call it for an in-app back control that should behave like the system back.
- `render`: `() => TemplateResult<1>` Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's `ChildPart` - typically a `TemplateResult`. Setting properties inside this method will *not* trigger the element to update.
- `show`: `() => Promise<void>` Opens the sheet. Resolves after the opening motion.

CSS parts

- `::part(actions)`: The container of the actions slot.
- `::part(container)`: The sheet container.
- `::part(content)`: The container of the default slot.
- `::part(dialog)`: The `<dialog>` holding the sheet; its `::backdrop` is the scrim.
- `::part(header)`: The header row.
- `::part(headline)`: The headline.

CSS custom properties

- `--actions-height`: Actions row minimum height.
- `--actions-padding-block-end`: Space below the actions.
- `--actions-padding-block-start`: Space above the actions.
- `--container-color`: Container color.
- `--container-elevation`: Container box shadow.
- `--container-height`: Height of a standard sheet.
- `--container-margin`: Inset from the window edges (16px when detached).
- `--container-shape`: Corner radius (the inline start corners of a docked modal sheet; every corner of a detached sheet).
- `--container-width`: Container width (capped at `--max-width`).
- `--divider-color`: Divider color.
- `--header-gap`: Space between header elements.
- `--header-height`: Header minimum height.
- `--headline`: Headline typography.
- `--headline-axes`: Headline font variation settings.
- `--headline-color`: Headline color.
- `--headline-tracking`: Headline letter spacing.
- `--icon-padding-inline`: Header padding next to the back or close icon button.
- `--max-width`: Maximum container width.
- `--padding-inline`: Start and end padding.
- `--scrim-color`: Scrim color of a modal sheet.
- `--scrim-opacity`: Scrim opacity of a modal sheet.

# tooltip

Elements: `md-gb-tooltip`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Tooltips**
  - Plain (with optional caret)
  - Rich (subhead, actions, persistent)

## API

### `<md-gb-tooltip>`

A Material Design plain or rich tooltip.

Source: `components/tooltip/md-gb-tooltip.ts`  
Import: `import '@material/web/components/tooltip/md-gb-tooltip.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `align` | `align` (reflects) | `"" \| "start" \| "center"` | `''` | How the tooltip lines up with its anchor along the placement side: `center` (plain default) or `start` (rich default). A rich tooltip can be `center`ed below its anchor on desktop. |
| `caret` | `caret` (reflects) | `boolean` | `false` | Whether to draw a caret pointing at the anchor. |
| `hideDelay` | `hide-delay` | `number` | `TOOLTIP_HIDE_DELAY_MS` | Delay before hiding after the pointer leaves, in milliseconds. |
| `htmlFor` | `for` (reflects) | `string` | `''` | The id of the anchor element, in the same root as the tooltip. |
| `noBoundary` | `no-boundary` (reflects) | `boolean` | `false` | Plain only: the anchor has no visual boundary, such as a text baseline, so the tooltip sits 8dp from it instead of 4dp. |
| `open` | `open` (reflects) | `boolean` |  | Whether the tooltip is open. |
| `persistent` | `persistent` (reflects) | `boolean` | `false` | Rich only: opens when the anchor is clicked instead of on hover / focus, and stays open until the user interacts with another element. |
| `placement` | `placement` (reflects) | `"" \| TooltipPlacement` | `''` | Preferred side of the anchor. Defaults to `above` for plain tooltips and `below` for rich ones. Flips when there isn't room. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Skips the open / close animation. |
| `showDelay` | `show-delay` | `number` | `TOOLTIP_SHOW_DELAY_MS` | Hover delay before showing, in milliseconds. |
| `subhead` | `subhead` | `string` | `''` | Rich only: subhead text. Replaced by content in the `subhead` slot. |
| `variant` | `variant` (reflects) | `TooltipVariant` | `TOOLTIP_VARIANTS.plain` | Plain or rich. |

Slots

- default slot: The supporting text.
- `action`: Rich tooltip text buttons (up to two), e.g. `<md-gb-button color="text">`.
- `subhead`: Rich tooltip subhead; replaces the `subhead` attribute.

Events

- `close` (`CustomEvent<{reason: string}>`): Fired before the tooltip closes. Cancelable.
- `closed` (`CustomEvent<{reason: string}>`): Fired after the tooltip closes.
- `open` (`Event`): Fired before the tooltip opens. Cancelable.
- `opened` (`Event`): Fired after the tooltip opens.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `hide`: `() => void` Closes the tooltip.
- `reposition`: `() => void` Recomputes the tooltip's position next to its anchor.
- `show`: `() => void` Opens the tooltip, closing any other open tooltip.

CSS parts

- `::part(actions)`: The actions container.
- `::part(caret)`: The caret.
- `::part(subhead)`: The subhead container.
- `::part(supporting-text)`: The supporting text container.
- `::part(tooltip)`: The tooltip surface.

CSS custom properties

- `--action-label-text`: Rich action typography.
- `--action-label-text-axes`: Rich action font variation settings.
- `--action-label-text-color`: Rich action label color.
- `--action-label-text-tracking`: Rich action letter spacing.
- `--actions-gap`: Space between rich actions.
- `--actions-padding-block-end`: Rich container bottom padding below actions.
- `--actions-spacing`: Space above the rich actions.
- `--anchor-spacing`: Distance between the anchor and the tooltip (or its caret).
- `--caret-height`: Caret height.
- `--caret-width`: Caret base width.
- `--container-color`: Container color.
- `--container-elevation`: Container box shadow.
- `--container-shape`: Container corner radius.
- `--max-width`: Maximum container width.
- `--min-height`: Minimum container height.
- `--min-width`: Minimum container width.
- `--padding-block`: Container block padding.
- `--padding-inline`: Container inline padding.
- `--subhead`: Rich subhead typography.
- `--subhead-axes`: Rich subhead font variation settings.
- `--subhead-color`: Rich subhead color.
- `--subhead-spacing`: Space below the rich subhead.
- `--subhead-tracking`: Rich subhead letter spacing.
- `--supporting-text`: Supporting text typography.
- `--supporting-text-axes`: Supporting text font variation settings.
- `--supporting-text-color`: Supporting text color.
- `--supporting-text-tracking`: Supporting text letter spacing.
- `--viewport-margin`: Minimum distance from the viewport edges.

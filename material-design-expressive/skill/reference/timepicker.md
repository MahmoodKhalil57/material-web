# timepicker

Elements: `md-gb-time-picker`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Time pickers**
  - Dial (vertical and horizontal layouts)
  - Time input
  - 12h / 24h, modal

## API

### `<md-gb-time-picker>`

A Material Design time picker component.

Source: `material-design-expressive/components/timepicker/md-gb-time-picker.ts`  
Import: `import '@material/web/components/timepicker/md-gb-time-picker.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `cancelLabel` | `cancel-label` | `string` | `'Cancel'` | Cancel action label. |
| `confirmLabel` | `confirm-label` | `string` | `'OK'` | OK action label. |
| `density` | `density` (reflects) | `0 \| -1 \| -2 \| -3` |  | The density, from 0 (default) to -3 (time-pickers.md "Density", "High-density time picker"). Each step down removes 4px from the time selectors (80px), input fields (72px), the period selector (which follows their height) and the dial (256px); the time selectors, fields and dial labels stay at least 48px. The horizontal layout, used when the viewport is short, keeps the full-size dial ("Don't apply density to the time picker dial when the viewport is constrained. Instead, use an input picker"). Values are clamped to that range. |
| `dialModeLabel` | `dial-mode-label` | `string` | `'Switch to clock mode'` | Accessible label of the mode toggle in input mode. |
| `disabled` | `disabled` | `boolean` |  | Disabled by the attribute or by a disabled fieldset. |
| `headline` | `headline` | `string` | `''` | The headline. Defaults to "Select time" (dial) or "Enter time" (input). |
| `hideActions` | `hide-actions` (reflects) | `boolean` | `false` | Hides the Cancel and OK actions; every change commits the value. |
| `hideModeToggle` | `hide-mode-toggle` (reflects) | `boolean` | `false` | Hides the dial / input mode toggle button. |
| `hourCycle` | `hour-cycle` | `"" \| "12" \| "24"` | `''` | `12` (with an AM/PM period selector), `24`, or `''` (default) to follow the locale's clock (`Intl.DateTimeFormat`). |
| `hourLabel` | `hour-label` | `string` | `'Hour'` | Hour field label (input mode). |
| `inputModeLabel` | `input-mode-label` | `string` | `'Switch to text input mode'` | Accessible label of the mode toggle in dial mode. |
| `locale` | `locale` | `string` | `''` | The locale used for the 12/24-hour default and the AM/PM labels. Defaults to the browser locale. |
| `minuteLabel` | `minute-label` | `string` | `'Minute'` | Minute field label (input mode). |
| `modal` | `modal` (reflects) | `boolean` | `false` | Renders the picker as a modal dialog, shown with `show()` or `open`. |
| `mode` | `mode` (reflects) | `"input" \| "dial"` | `'dial'` | `dial` (clock dial) or `input` (hour and minute text fields). |
| `name` | `name` | `string` |  | The HTML name to use in form submission. |
| `open` | `open` (reflects) | `boolean` |  | Whether a modal picker is open. Setting it opens or closes the picker. |
| `orientation` | `orientation` (reflects) | `"" \| "horizontal" \| "vertical"` | `''` | The dial layout: `vertical`, `horizontal`, or `''` (default) to pick one from the viewport (horizontal in short landscape viewports). |
| `periodLabel` | `period-label` | `string` | `'Select AM or PM'` | Accessible label of the period selector. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Skips transitions. |
| `required` | `required` (reflects) | `boolean` | `false` | Whether a time is required: with no time the picker is invalid (`valueMissing`) and blocks the form's submit. |
| `selectHourLabel` | `select-hour-label` | `string` | `'Select hour'` | Accessible label of the hour selector and the dial in hour mode. |
| `selection` | property only | `"hour" \| "minute"` | `'hour'` | Which part of the time the dial edits. |
| `selectMinuteLabel` | `select-minute-label` | `string` | `'Select minutes'` | Accessible label of the minute selector and the dial in minute mode. |
| `value` | `value` | `string` |  | The committed time as a 24-hour `HH:MM` string (`<input type="time">` format), or `''` when no time is set. |

Events

- `cancel` (`Event`): Fired when picking is canceled (Cancel, Escape, scrim click). Cancelable for a modal picker; canceling keeps it open.
- `change` (`Event`): Fired when a new `value` is committed (OK, or the end of an interaction with `hide-actions`).
- `close` (`Event`): Fired when a modal picker closes.
- `input` (`Event`): Fired whenever the picked time changes (dial drag, key, typed digits, period). Read the pending time from `pendingValue`.
- `open` (`Event`): Fired when a modal picker opens.

Methods

- `cancel`: `(reason?: string) => void` Discards the pending time and fires `cancel`; a modal picker closes unless the event is canceled (canceling keeps the pending time). What the Cancel action does.
- `close`: `(reason?: string) => Promise<void>` Closes a modal picker without committing. Fires a cancelable `close` event with `detail.reason`, then `closed` after the exit transition.
- `confirm`: `() => void` Commits the pending time to `value` (firing `change` when it differs) and closes a modal picker. What the OK action does.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.
- `show`: `() => Promise<void>` Opens a modal picker on the committed time, starting with the hours. Fires `open`.
- `toggleMode`: `() => void` Switches between the dial and input modes.

CSS parts

- `::part(actions)`: The actions row.
- `::part(container)`: The picker container (a `<dialog>` when modal).
- `::part(dial)`: The clock dial.
- `::part(headline)`: The headline.

CSS custom properties

- `--clock-dial-color`: Clock dial color.
- `--clock-dial-container-size`: Clock dial size.
- `--clock-dial-label-text`: Clock dial number typography.
- `--clock-dial-selected-label-text-color`: Clock dial number color under the selector handle.
- `--clock-dial-selector-center-container-color`: Selector center dot color.
- `--clock-dial-selector-center-container-size`: Selector center dot size.
- `--clock-dial-selector-handle-container-color`: Selector handle color.
- `--clock-dial-selector-handle-container-size`: Selector handle size.
- `--clock-dial-selector-track-container-color`: Selector track color.
- `--clock-dial-selector-track-container-width`: Selector track width.
- `--clock-dial-unselected-label-text-color`: Clock dial number color.
- `--container-color`: Container color.
- `--container-elevation`: Container elevation (modal).
- `--container-padding`: Container padding.
- `--container-shape`: Container corner radius.
- `--density-step`: Size removed per density step (time selectors, input fields, period selector, dial).
- `--headline`: Headline typography.
- `--headline-color`: Headline color.
- `--period-selector-container-shape`: Period selector corner radius.
- `--period-selector-horizontal-container-height`: Horizontal period selector height.
- `--period-selector-horizontal-container-width`: Horizontal period selector width.
- `--period-selector-label-text`: Period selector typography.
- `--period-selector-outline-color`: Period selector outline color.
- `--period-selector-outline-width`: Period selector outline width.
- `--period-selector-selected-container-color`: Selected period color.
- `--period-selector-selected-label-text-color`: Selected period text color.
- `--period-selector-unselected-label-text-color`: Unselected period text color.
- `--period-selector-vertical-container-height`: Vertical period selector height.
- `--period-selector-vertical-container-width`: Vertical period selector width.
- `--scrim-color`: Modal scrim color.
- `--scrim-opacity`: Modal scrim opacity.
- `--time-input-field-container-color`: Input mode field color.
- `--time-input-field-container-height`: Input mode field height.
- `--time-input-field-container-width`: Input mode field width.
- `--time-input-field-focus-container-color`: Focused input mode field color.
- `--time-input-field-focus-outline-color`: Focused input mode field outline color.
- `--time-input-field-label-text`: Input mode field typography.
- `--time-input-field-supporting-text`: Input mode field label typography.
- `--time-selector-24h-vertical-container-width`: Hour and minute selector width in the 24-hour vertical layout.
- `--time-selector-container-height`: Hour and minute selector height.
- `--time-selector-container-shape`: Hour and minute selector corner radius.
- `--time-selector-container-width`: Hour and minute selector width.
- `--time-selector-label-text`: Hour and minute selector typography.
- `--time-selector-selected-container-color`: Selected hour or minute selector color.
- `--time-selector-selected-label-text-color`: Selected hour or minute selector text color.
- `--time-selector-separator`: Separator typography.
- `--time-selector-separator-color`: Separator color.
- `--time-selector-unselected-container-color`: Unselected hour or minute selector color.
- `--time-selector-unselected-label-text-color`: Unselected hour or minute selector text color.

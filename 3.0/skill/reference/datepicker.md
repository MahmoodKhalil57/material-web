# datepicker

Elements: `md-gb-date-picker`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Date pickers**
  - Docked date picker
  - Modal date picker (single date, date range)
  - Modal date input
  - Scrolling month list and full-screen layout for modal range selection
  - Swipe between months; tooltips on controls; `required` validation

## API

### `<md-gb-date-picker>`

A Material Design date picker (docked or modal, single date or range).

Source: `labs/gb/components/datepicker/md-gb-date-picker.ts`  
Import: `import '@material/web/labs/gb/components/datepicker/md-gb-date-picker.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `clearable` | `clearable` | `boolean` | `false` | Shows a Clear button that removes the selection. |
| `density` | `density` (reflects) | `Density` |  | The density of the picker's text fields (the docked field and the modal input mode's fields), from 0 (default) to -3, as `md-gb-text-field` `density`. Values are clamped to that range. The calendar itself never gets denser (date-pickers.md, Accessibility: "Interactive targets for all elements meet Material's 48x48dp minimum touch target requirement. Increasing density would negatively impact accessibility by limiting tappable/clickable targets"): its dates, menus and buttons keep their size, including inside a dense container. |
| `error` | `error` (reflects) | `boolean` | `false` | Forces the error state of the docked field. |
| `errorText` | `error-text` | `string` | `''` | The message shown on the docked field while `error` is set. |
| `firstDayOfWeek` | `first-day-of-week` | `number` | `-1` | The first day of the week, 0 (Sunday) to 6 (Saturday). -1 (default) uses the locale's. |
| `fullscreen` | `fullscreen` (reflects) | `boolean` | `false` | Modal: the full-screen layout the spec recommends on compact windows. The dialog covers the window and has a close (x) icon button and a **Save** button in place of Cancel and OK. |
| `hideActions` | `hide-actions` | `boolean` | `false` | Hides the Cancel and OK buttons; a selection is committed right away. |
| `inline` | `inline` (reflects) | `boolean` | `false` | Renders the calendar surface in the page flow, always visible, instead of a docked popup (without the text field) or a modal dialog. |
| `isDateDisabled` | property only | `(date: string) => boolean` | `null` | Returns true for dates that can't be selected (in addition to dates outside `min` / `max`). Receives an ISO date. |
| `label` | `label` | `string` | `''` | Docked: the text field label. Defaults to "Date" (range: "Dates"). |
| `locale` | `locale` | `string` | `''` | A BCP 47 locale. Defaults to the document's `lang`, else the browser's. |
| `max` | `max` | `string` | `''` | The latest selectable date (ISO). |
| `min` | `min` | `string` | `''` | The earliest selectable date (ISO). |
| `mode` | `mode` (reflects) | `DatePickerMode` | `'picker'` | Modal: shows the calendar (`picker`) or the date input (`input`). |
| `open` | `open` (reflects) | `boolean` |  | Whether the popup (docked) or dialog (modal) is open. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Skips animations. |
| `range` | `range` (reflects) | `boolean` | `false` | Selects a start and end date. |
| `required` | `required` (reflects) | `boolean` | `false` | A value is required: with no date (or a range without an end date) the picker is invalid (`valueMissing`). |
| `strings` | property only | `Partial<DatePickerStrings>` | `{}` | Overrides for the user-facing strings. |
| `supportingText` | `supporting-text` | `string` | `''` | Docked: the field's supporting text. Defaults to the date format, e.g. MM/DD/YYYY. |
| `value` | `value` | `string` | `''` | The committed value: an ISO date (`YYYY-MM-DD`), or an ISO interval (`start/end`) when `range` is set. Empty when nothing is selected. |
| `variant` | `variant` (reflects) | `DatePickerVariant` | `'docked'` | `docked` (default) or `modal`. |

Events

- `cancel` (`Event`): The selection was dismissed (Cancel, Escape or a click outside). Cancelable: canceling keeps the picker open.
- `change` (`CustomEvent<DatePickerValueDetail>`): The value was committed (OK, Enter, typing in the docked field, or a pick with `hide-actions`). --bubbles
- `close` (`CustomEvent<{reason: string}>`): The popup or dialog began closing; `reason` is `confirm` or `cancel`.
- `input` (`CustomEvent<DatePickerValueDetail>`): The pending selection changed (a date was picked or a valid date typed). --bubbles --composed
- `open` (`Event`): The popup or dialog opened.

Methods

- `attributeChangedCallback`: `(attribute: string, oldValue: string, newValue: string) => void` Synchronizes property values when attributes change. Specifically, when an attribute is set, the corresponding property is set. You should rarely need to implement this callback. If this method is overridden, `super.attributeChangedCallback(name, _old, value)` must be called. See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) on MDN for more information about the `attributeChangedCallback`.
- `cancel`: `(reason?: string) => boolean` Discards the pending selection: fires a cancelable `cancel` event, then closes the popup or dialog.
- `close`: `(reason?: string) => Promise<void>` Closes the popup or dialog without changing the value (use `confirm()` to commit the pending selection).
- `confirm`: `() => boolean` Commits the pending selection to `value` (firing `change` if it changed) and closes the popup or dialog. In the date input mode, invalid text shows its error and keeps the picker open.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `focus`: `(options?: FocusOptions) => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.
- `show`: `() => Promise<void>` Opens the calendar popup (docked) or dialog (modal). The pending selection starts from `value`, and focus moves to the selected date (or today).
- `showMonth`: `(year: number, month: number) => void` Shows the given month (`year`, `month` 1-12) in the calendar.

CSS parts

- `::part(actions)`: The text buttons row.
- `::part(container)`: The picker surface.
- `::part(field)`: The docked text field.
- `::part(grid)`: The month grid.
- `::part(header)`: The header (modal headline region, or docked menus).

CSS custom properties

- `--anchor-spacing`: Docked: distance between the field and the calendar.
- `--container-color`: Surface color.
- `--container-elevation`: Surface shadow.
- `--container-shape`: Surface corner radius.
- `--container-width`: Surface width.
- `--date-container-height`: Date indicator height.
- `--date-container-shape`: Date indicator shape.
- `--date-container-width`: Date indicator width.
- `--date-disabled-label-text-color`: Disabled date color.
- `--date-label-text`: Date typography.
- `--date-selected-container-color`: Selected date indicator color.
- `--date-selected-label-text-color`: Selected date color.
- `--date-today-container-outline-color`: Today's outline color.
- `--date-today-container-outline-width`: Today's outline width.
- `--date-today-label-text-color`: Today's date color.
- `--date-unselected-label-text-color`: Unselected date color.
- `--date-unselected-outside-month-label-text-color`: Docked: adjacent month date color.
- `--divider-color`: Divider color.
- `--header-headline`: Modal headline typography.
- `--header-headline-color`: Modal headline color.
- `--header-supporting-text`: Modal supporting text typography.
- `--header-supporting-text-color`: Modal supporting text color.
- `--menu-button-label-text-color`: Month / year menu button color.
- `--menu-list-item-selected-container-color`: Docked selected month / year color.
- `--range-selection-active-indicator-container-color`: In-range highlight color.
- `--range-selection-container-elevation`: Full-screen surface shadow.
- `--range-selection-container-shape`: Full-screen surface corner radius.
- `--range-selection-date-in-range-label-text-color`: In-range date color.
- `--range-selection-header-container-height`: Full-screen header height.
- `--range-selection-month-subhead`: Modal range: month subhead typography.
- `--range-selection-month-subhead-color`: Modal range: month subhead color.
- `--scrim-color`: Modal scrim color.
- `--scrim-opacity`: Modal scrim opacity.
- `--weekdays-label-text`: Weekday label typography.
- `--weekdays-label-text-color`: Weekday label color.
- `--year-selection-year-selected-container-color`: Selected year color.
- `--year-selection-year-selected-label-text-color`: Selected year label color.
- `--year-selection-year-unselected-label-text-color`: Unselected year color.

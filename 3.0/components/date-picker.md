# Date picker

A date picker lets people select a date or a range of dates.

**Example: A docked date picker with a text field**

```html
<md-gb-date-picker label="Event date"></md-gb-date-picker>
```

## Usage guidelines

*   **Match the context.** Use the docked picker, a calendar under a text field, on medium and expanded windows. Use a [modal](#modal) picker on compact ones.
*   **Pick or type.** A modal picker has a calendar mode and an input mode for typing a date.
*   **Select a range.** Add [`range`](#range) to choose a start and an end date.
*   **Offer a way to clear.** Add `clearable` so people can remove a selection.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A date picker is one element. A docked picker renders a text field and a calendar popup; a modal picker renders a dialog.

**Example: A date picker with a label**

```html
<md-gb-date-picker label="Due date"></md-gb-date-picker>
```

## Examples

### Modal

Set `variant="modal"` and call `show()` to open the picker in a dialog. Use `mode="input"` to start with the date input.

**Example: A button that opens a modal date picker**

*HTML*

```html
<md-gb-button id="open-picker">Pick a date</md-gb-button>
<md-gb-date-picker id="picker" variant="modal"></md-gb-date-picker>
```

*TypeScript*

```ts
document.querySelector('#open-picker')!.addEventListener('click', () => {
  document.querySelector('md-gb-date-picker')!.show();
});
```

### Range

Add `range` to select a start and an end date. The value is an ISO interval such as `2026-08-17/2026-08-23`.

**Example: A docked date range picker**

```html
<md-gb-date-picker range label="Trip dates"></md-gb-date-picker>
```

### Value, min and max

Set `value` to an ISO date (`YYYY-MM-DD`). Limit the choices with `min` and `max`.

**Example: A date picker with a value and limits**

```html
<md-gb-date-picker label="Check-in" value="2026-08-17" min="2026-08-01" max="2026-12-31"></md-gb-date-picker>
```

### Full screen

Add `fullscreen` to a modal picker for compact windows. It has a close button and a Save button.

**Example: A full-screen modal range picker**

```html
<md-gb-date-picker variant="modal" fullscreen range open></md-gb-date-picker>
```

## Accessibility

*   Name the field with `label`, such as "Event date", and use `supporting-text` to show the expected format.
*   Calendar targets stay 48px, so `density` only affects the text fields.
*   Page Up and Page Down move by month, and Shift with them moves by year.
*   The modal picker closes with Escape, and the docked picker confirms with Enter.

## API reference

### &lt;md-gb-date-picker&gt;

A Material Design date picker (docked or modal, single date or range).

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>clearable</code><br><span class="gb-desc">Shows a Clear button that removes the selection.</span> | <code>clearable</code> | <code>boolean</code> | <code>false</code> |
| <code>density</code><br><span class="gb-desc">The density of the picker's text fields (the docked field and the modal input mode's fields), from 0 (default) to -3, as <code>md-gb-text-field</code> <code>density</code>. Values are clamped to that range. The calendar itself never gets denser (date-pickers.md, Accessibility: "Interactive targets for all elements meet Material's 48x48dp minimum touch target requirement. Increasing density would negatively impact accessibility by limiting tappable/clickable targets"): its dates, menus and buttons keep their size, including inside a dense container.</span> | <code>density</code> | <code>Density</code> |  |
| <code>error</code><br><span class="gb-desc">Forces the error state of the docked field.</span> | <code>error</code> | <code>boolean</code> | <code>false</code> |
| <code>errorText</code><br><span class="gb-desc">The message shown on the docked field while <code>error</code> is set.</span> | <code>error-text</code> | <code>string</code> | <code>''</code> |
| <code>firstDayOfWeek</code><br><span class="gb-desc">The first day of the week, 0 (Sunday) to 6 (Saturday). -1 (default) uses the locale's.</span> | <code>first-day-of-week</code> | <code>number</code> | <code>-1</code> |
| <code>fullscreen</code><br><span class="gb-desc">Modal: the full-screen layout the spec recommends on compact windows. The dialog covers the window and has a close (x) icon button and a **Save** button in place of Cancel and OK.</span> | <code>fullscreen</code> | <code>boolean</code> | <code>false</code> |
| <code>hideActions</code><br><span class="gb-desc">Hides the Cancel and OK buttons; a selection is committed right away.</span> | <code>hide-actions</code> | <code>boolean</code> | <code>false</code> |
| <code>inline</code><br><span class="gb-desc">Renders the calendar surface in the page flow, always visible, instead of a docked popup (without the text field) or a modal dialog.</span> | <code>inline</code> | <code>boolean</code> | <code>false</code> |
| <code>isDateDisabled</code><br><span class="gb-desc">Returns true for dates that can't be selected (in addition to dates outside <code>min</code> / <code>max</code>). Receives an ISO date.</span> |  | <code>(date: string) =&gt; boolean</code> | <code>null</code> |
| <code>label</code><br><span class="gb-desc">Docked: the text field label. Defaults to "Date" (range: "Dates").</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>locale</code><br><span class="gb-desc">A BCP 47 locale. Defaults to the document's <code>lang</code>, else the browser's.</span> | <code>locale</code> | <code>string</code> | <code>''</code> |
| <code>max</code><br><span class="gb-desc">The latest selectable date (ISO).</span> | <code>max</code> | <code>string</code> | <code>''</code> |
| <code>min</code><br><span class="gb-desc">The earliest selectable date (ISO).</span> | <code>min</code> | <code>string</code> | <code>''</code> |
| <code>mode</code><br><span class="gb-desc">Modal: shows the calendar (<code>picker</code>) or the date input (<code>input</code>).</span> | <code>mode</code> | <code>DatePickerMode</code> | <code>'picker'</code> |
| <code>open</code><br><span class="gb-desc">Whether the popup (docked) or dialog (modal) is open.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>quick</code><br><span class="gb-desc">Skips animations.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>range</code><br><span class="gb-desc">Selects a start and end date.</span> | <code>range</code> | <code>boolean</code> | <code>false</code> |
| <code>required</code><br><span class="gb-desc">A value is required: with no date (or a range without an end date) the picker is invalid (<code>valueMissing</code>).</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>strings</code><br><span class="gb-desc">Overrides for the user-facing strings.</span> |  | <code>Partial&lt;DatePickerStrings&gt;</code> | <code>&#123;&#125;</code> |
| <code>supportingText</code><br><span class="gb-desc">Docked: the field's supporting text. Defaults to the date format, e.g. MM/DD/YYYY.</span> | <code>supporting-text</code> | <code>string</code> | <code>''</code> |
| <code>value</code><br><span class="gb-desc">The committed value: an ISO date (<code>YYYY-MM-DD</code>), or an ISO interval (<code>start/end</code>) when <code>range</code> is set. Empty when nothing is selected.</span> | <code>value</code> | <code>string</code> | <code>''</code> |
| <code>variant</code><br><span class="gb-desc"><code>docked</code> (default) or <code>modal</code>.</span> | <code>variant</code> | <code>DatePickerVariant</code> | <code>'docked'</code> |

#### Events

| Event | Description |
| --- | --- |
| <code>cancel</code><br><span class="gb-desc">Event</span> | The selection was dismissed (Cancel, Escape or a click outside). Cancelable: canceling keeps the picker open. |
| <code>change</code><br><span class="gb-desc">CustomEvent&lt;DatePickerValueDetail&gt;</span> | The value was committed (OK, Enter, typing in the docked field, or a pick with <code>hide-actions</code>). |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | The popup or dialog began closing; <code>reason</code> is <code>confirm</code> or <code>cancel</code>. |
| <code>input</code><br><span class="gb-desc">CustomEvent&lt;DatePickerValueDetail&gt;</span> | The pending selection changed (a date was picked or a valid date typed). |
| <code>open</code><br><span class="gb-desc">Event</span> | The popup or dialog opened. |

#### Methods

| Method | Description |
| --- | --- |
| <code>cancel</code><br><span class="gb-desc">(reason?: string) =&gt; boolean</span> | Discards the pending selection: fires a cancelable <code>cancel</code> event, then closes the popup or dialog. |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the popup or dialog without changing the value (use <code>confirm()</code> to commit the pending selection). |
| <code>confirm</code><br><span class="gb-desc">() =&gt; boolean</span> | Commits the pending selection to <code>value</code> (firing <code>change</code> if it changed) and closes the popup or dialog. In the date input mode, invalid text shows its error and keeps the picker open. |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions) =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus) |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the calendar popup (docked) or dialog (modal). The pending selection starts from <code>value</code>, and focus moves to the selected date (or today). |
| <code>showMonth</code><br><span class="gb-desc">(year: number, month: number) =&gt; void</span> | Shows the given month (<code>year</code>, <code>month</code> 1-12) in the calendar. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(actions)</code> | The text buttons row. |
| <code>::part(container)</code> | The picker surface. |
| <code>::part(field)</code> | The docked text field. |
| <code>::part(grid)</code> | The month grid. |
| <code>::part(header)</code> | The header (modal headline region, or docked menus). |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--anchor-spacing</code> | Docked: distance between the field and the calendar. |
| <code>--container-color</code> | Surface color. |
| <code>--container-elevation</code> | Surface shadow. |
| <code>--container-shape</code> | Surface corner radius. |
| <code>--container-width</code> | Surface width. |
| <code>--date-container-height</code> | Date indicator height. |
| <code>--date-container-shape</code> | Date indicator shape. |
| <code>--date-container-width</code> | Date indicator width. |
| <code>--date-disabled-label-text-color</code> | Disabled date color. |
| <code>--date-label-text</code> | Date typography. |
| <code>--date-selected-container-color</code> | Selected date indicator color. |
| <code>--date-selected-label-text-color</code> | Selected date color. |
| <code>--date-today-container-outline-color</code> | Today's outline color. |
| <code>--date-today-container-outline-width</code> | Today's outline width. |
| <code>--date-today-label-text-color</code> | Today's date color. |
| <code>--date-unselected-label-text-color</code> | Unselected date color. |
| <code>--date-unselected-outside-month-label-text-color</code> | Docked: adjacent month date color. |
| <code>--divider-color</code> | Divider color. |
| <code>--header-headline</code> | Modal headline typography. |
| <code>--header-headline-color</code> | Modal headline color. |
| <code>--header-supporting-text</code> | Modal supporting text typography. |
| <code>--header-supporting-text-color</code> | Modal supporting text color. |
| <code>--menu-button-label-text-color</code> | Month / year menu button color. |
| <code>--menu-list-item-selected-container-color</code> | Docked selected month / year color. |
| <code>--range-selection-active-indicator-container-color</code> | In-range highlight color. |
| <code>--range-selection-container-elevation</code> | Full-screen surface shadow. |
| <code>--range-selection-container-shape</code> | Full-screen surface corner radius. |
| <code>--range-selection-date-in-range-label-text-color</code> | In-range date color. |
| <code>--range-selection-header-container-height</code> | Full-screen header height. |
| <code>--range-selection-month-subhead</code> | Modal range: month subhead typography. |
| <code>--range-selection-month-subhead-color</code> | Modal range: month subhead color. |
| <code>--scrim-color</code> | Modal scrim color. |
| <code>--scrim-opacity</code> | Modal scrim opacity. |
| <code>--weekdays-label-text</code> | Weekday label typography. |
| <code>--weekdays-label-text-color</code> | Weekday label color. |
| <code>--year-selection-year-selected-container-color</code> | Selected year color. |
| <code>--year-selection-year-selected-label-text-color</code> | Selected year label color. |
| <code>--year-selection-year-unselected-label-text-color</code> | Unselected year color. |

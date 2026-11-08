# Time picker

Time pickers let people choose an hour and minute on a clock dial, or type them into fields.

**Example: An inline time picker set to 7:00**

```html
<md-gb-time-picker value="07:00"></md-gb-time-picker>
```

## Usage guidelines

*   **Dial or input.** The dial is quick for picking an approximate time, and typing is faster for an exact one. People can [switch](#input-mode) between them unless you hide the toggle.
*   **Inline or modal.** Show the picker [inline](#inline-and-modal) in a form, or as a [modal](#inline-and-modal) when it opens from a field or button.
*   **Match the locale.** The picker follows the 12 or 24 hour clock of its `locale`. Set [`hour-cycle`](#hour-cycle) to force one.

## Anatomy

A time picker has a headline, the hour and minute selectors, an AM or PM toggle in 12 hour mode, a dial, and the actions.

**Example: A time picker with its headline, selectors, dial and actions**

```html
<md-gb-time-picker value="09:30"></md-gb-time-picker>
```

## Examples

### Inline and modal

Add `modal` to show the picker in a dialog with a scrim. Open it with `show()`. It fires `change` when a time is confirmed and `cancel` when it is dismissed.

**Example: A modal time picker opened from a Set alarm button**

*HTML*

```html
<md-gb-button id="set-alarm">Set alarm</md-gb-button>
<md-gb-time-picker id="alarm" modal headline="Set alarm"></md-gb-time-picker>
<output id="time" for="alarm"></output>
```

*JavaScript*

```js
const alarm = document.querySelector('#alarm');
document.querySelector('#set-alarm').addEventListener('click', () => {
  alarm.show();
});
alarm.addEventListener('change', (event) => {
  document.querySelector('#time').textContent = event.target.value;
});
```

### Input mode

Set `mode="input"` to start with hour and minute fields instead of the dial. Add `hide-mode-toggle` to remove the switch between the two.

**Example: A time picker with hour and minute fields**

```html
<md-gb-time-picker mode="input" value="07:00"></md-gb-time-picker>
```

### Hour cycle

Set `hour-cycle` to `12` or `24`. The `value` is always a 24 hour `HH:MM` string.

**Example: A 24 hour time picker set to 20:00**

```html
<md-gb-time-picker hour-cycle="24" value="20:00"></md-gb-time-picker>
```

### Orientation

The dial sits below the time selectors (`vertical`), except in short landscape windows, where it moves beside them (`horizontal`). Set `orientation` to choose one.

**Example: A time picker with a horizontal layout**

```html
<md-gb-time-picker orientation="horizontal" value="07:00"></md-gb-time-picker>
```

### Density

Set `density` from 0 (default) to -3 to make the picker more compact.

**Example: A time picker with a density of -3**

```html
<md-gb-time-picker mode="input" density="-3" value="07:00"></md-gb-time-picker>
```

## Accessibility

*   Input mode is an alternative to the dial, and every control has a label. Localize the labels with attributes such as `select-hour-label`, `hour-label`, `cancel-label` and `confirm-label`.
*   A modal picker is a `<dialog>`: focus moves into it and returns to the opener on close, and Escape cancels.
*   In the dial, the arrow keys change the selected hour or minute.

## API reference

### &lt;md-gb-time-picker&gt;

A Material Design time picker component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>cancelLabel</code><br><span class="gb-desc">Cancel action label.</span> | <code>cancel-label</code> | <code>string</code> | <code>'Cancel'</code> |
| <code>confirmLabel</code><br><span class="gb-desc">OK action label.</span> | <code>confirm-label</code> | <code>string</code> | <code>'OK'</code> |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3 (time-pickers.md "Density", "High-density time picker"). Each step down removes 4px from the time selectors (80px), input fields (72px), the period selector (which follows their height) and the dial (256px); the time selectors, fields and dial labels stay at least 48px. The horizontal layout, used when the viewport is short, keeps the full-size dial ("Don't apply density to the time picker dial when the viewport is constrained. Instead, use an input picker"). Values are clamped to that range.</span> | <code>density</code> | <code>Density</code> |  |
| <code>dialModeLabel</code><br><span class="gb-desc">Accessible label of the mode toggle in input mode.</span> | <code>dial-mode-label</code> | <code>string</code> | <code>'Switch to clock mode'</code> |
| <code>headline</code><br><span class="gb-desc">The headline. Defaults to "Select time" (dial) or "Enter time" (input).</span> | <code>headline</code> | <code>string</code> | <code>''</code> |
| <code>hideActions</code><br><span class="gb-desc">Hides the Cancel and OK actions; every change commits the value.</span> | <code>hide-actions</code> | <code>boolean</code> | <code>false</code> |
| <code>hideModeToggle</code><br><span class="gb-desc">Hides the dial / input mode toggle button.</span> | <code>hide-mode-toggle</code> | <code>boolean</code> | <code>false</code> |
| <code>hourCycle</code><br><span class="gb-desc"><code>12</code> (with an AM/PM period selector), <code>24</code>, or <code>''</code> (default) to follow the locale's clock (<code>Intl.DateTimeFormat</code>).</span> | <code>hour-cycle</code> | <code>TimePickerHourCycle</code> | <code>''</code> |
| <code>hourLabel</code><br><span class="gb-desc">Hour field label (input mode).</span> | <code>hour-label</code> | <code>string</code> | <code>'Hour'</code> |
| <code>inputModeLabel</code><br><span class="gb-desc">Accessible label of the mode toggle in dial mode.</span> | <code>input-mode-label</code> | <code>string</code> | <code>'Switch to text input mode'</code> |
| <code>locale</code><br><span class="gb-desc">The locale used for the 12/24-hour default and the AM/PM labels. Defaults to the browser locale.</span> | <code>locale</code> | <code>string</code> | <code>''</code> |
| <code>minuteLabel</code><br><span class="gb-desc">Minute field label (input mode).</span> | <code>minute-label</code> | <code>string</code> | <code>'Minute'</code> |
| <code>modal</code><br><span class="gb-desc">Renders the picker as a modal dialog, shown with <code>show()</code> or <code>open</code>.</span> | <code>modal</code> | <code>boolean</code> | <code>false</code> |
| <code>mode</code><br><span class="gb-desc"><code>dial</code> (clock dial) or <code>input</code> (hour and minute text fields).</span> | <code>mode</code> | <code>TimePickerMode</code> | <code>'dial'</code> |
| <code>open</code><br><span class="gb-desc">Whether a modal picker is open. Setting it opens or closes the picker.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>orientation</code><br><span class="gb-desc">The dial layout: <code>vertical</code>, <code>horizontal</code>, or <code>''</code> (default) to pick one from the viewport (horizontal in short landscape viewports).</span> | <code>orientation</code> | <code>"" | TimePickerOrientation</code> | <code>''</code> |
| <code>periodLabel</code><br><span class="gb-desc">Accessible label of the period selector.</span> | <code>period-label</code> | <code>string</code> | <code>'Select AM or PM'</code> |
| <code>quick</code><br><span class="gb-desc">Skips transitions.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>required</code><br><span class="gb-desc">Whether a time is required: with no time the picker is invalid (<code>valueMissing</code>) and blocks the form's submit.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>selectHourLabel</code><br><span class="gb-desc">Accessible label of the hour selector and the dial in hour mode.</span> | <code>select-hour-label</code> | <code>string</code> | <code>'Select hour'</code> |
| <code>selection</code><br><span class="gb-desc">Which part of the time the dial edits.</span> |  | <code>TimePickerSelection</code> | <code>'hour'</code> |
| <code>selectMinuteLabel</code><br><span class="gb-desc">Accessible label of the minute selector and the dial in minute mode.</span> | <code>select-minute-label</code> | <code>string</code> | <code>'Select minutes'</code> |
| <code>value</code><br><span class="gb-desc">The committed time as a 24-hour <code>HH:MM</code> string (<code>&lt;input type="time"&gt;</code> format), or <code>''</code> when no time is set.</span> | <code>value</code> | <code>string</code> |  |

#### Events

| Event | Description |
| --- | --- |
| <code>cancel</code><br><span class="gb-desc">Event</span> | Fired when picking is canceled (Cancel, Escape, scrim click). Cancelable for a modal picker; canceling keeps it open. |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when a new <code>value</code> is committed (OK, or the end of an interaction with <code>hide-actions</code>). |
| <code>close</code><br><span class="gb-desc">Event</span> | Fired when a modal picker closes. |
| <code>input</code><br><span class="gb-desc">Event</span> | Fired whenever the picked time changes (dial drag, key, typed digits, period). Read the pending time from <code>pendingValue</code>. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when a modal picker opens. |

#### Methods

| Method | Description |
| --- | --- |
| <code>cancel</code><br><span class="gb-desc">(reason?: string) =&gt; void</span> | Discards the pending time and fires <code>cancel</code>; a modal picker closes unless the event is canceled (canceling keeps the pending time). What the Cancel action does. |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes a modal picker without committing. Fires a cancelable <code>close</code> event with <code>detail.reason</code>, then <code>closed</code> after the exit transition. |
| <code>confirm</code><br><span class="gb-desc">() =&gt; void</span> | Commits the pending time to <code>value</code> (firing <code>change</code> when it differs) and closes a modal picker. What the OK action does. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens a modal picker on the committed time, starting with the hours. Fires <code>open</code>. |
| <code>toggleMode</code><br><span class="gb-desc">() =&gt; void</span> | Switches between the dial and input modes. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(actions)</code> | The actions row. |
| <code>::part(container)</code> | The picker container (a <code>&lt;dialog&gt;</code> when modal). |
| <code>::part(dial)</code> | The clock dial. |
| <code>::part(headline)</code> | The headline. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--clock-dial-color</code> | Clock dial color. |
| <code>--clock-dial-container-size</code> | Clock dial size. |
| <code>--clock-dial-label-text</code> | Clock dial number typography. |
| <code>--clock-dial-selected-label-text-color</code> | Clock dial number color under the selector handle. |
| <code>--clock-dial-selector-center-container-color</code> | Selector center dot color. |
| <code>--clock-dial-selector-center-container-size</code> | Selector center dot size. |
| <code>--clock-dial-selector-handle-container-color</code> | Selector handle color. |
| <code>--clock-dial-selector-handle-container-size</code> | Selector handle size. |
| <code>--clock-dial-selector-track-container-color</code> | Selector track color. |
| <code>--clock-dial-selector-track-container-width</code> | Selector track width. |
| <code>--clock-dial-unselected-label-text-color</code> | Clock dial number color. |
| <code>--container-color</code> | Container color. |
| <code>--container-elevation</code> | Container elevation (modal). |
| <code>--container-padding</code> | Container padding. |
| <code>--container-shape</code> | Container corner radius. |
| <code>--density-step</code> | Size removed per density step (time selectors, input fields, period selector, dial). |
| <code>--headline</code> | Headline typography. |
| <code>--headline-color</code> | Headline color. |
| <code>--period-selector-container-shape</code> | Period selector corner radius. |
| <code>--period-selector-horizontal-container-height</code> | Horizontal period selector height. |
| <code>--period-selector-horizontal-container-width</code> | Horizontal period selector width. |
| <code>--period-selector-label-text</code> | Period selector typography. |
| <code>--period-selector-outline-color</code> | Period selector outline color. |
| <code>--period-selector-outline-width</code> | Period selector outline width. |
| <code>--period-selector-selected-container-color</code> | Selected period color. |
| <code>--period-selector-selected-label-text-color</code> | Selected period text color. |
| <code>--period-selector-unselected-label-text-color</code> | Unselected period text color. |
| <code>--period-selector-vertical-container-height</code> | Vertical period selector height. |
| <code>--period-selector-vertical-container-width</code> | Vertical period selector width. |
| <code>--scrim-color</code> | Modal scrim color. |
| <code>--scrim-opacity</code> | Modal scrim opacity. |
| <code>--time-input-field-container-color</code> | Input mode field color. |
| <code>--time-input-field-container-height</code> | Input mode field height. |
| <code>--time-input-field-container-width</code> | Input mode field width. |
| <code>--time-input-field-focus-container-color</code> | Focused input mode field color. |
| <code>--time-input-field-focus-outline-color</code> | Focused input mode field outline color. |
| <code>--time-input-field-label-text</code> | Input mode field typography. |
| <code>--time-input-field-supporting-text</code> | Input mode field label typography. |
| <code>--time-selector-24h-vertical-container-width</code> | Hour and minute selector width in the 24-hour vertical layout. |
| <code>--time-selector-container-height</code> | Hour and minute selector height. |
| <code>--time-selector-container-shape</code> | Hour and minute selector corner radius. |
| <code>--time-selector-container-width</code> | Hour and minute selector width. |
| <code>--time-selector-label-text</code> | Hour and minute selector typography. |
| <code>--time-selector-selected-container-color</code> | Selected hour or minute selector color. |
| <code>--time-selector-selected-label-text-color</code> | Selected hour or minute selector text color. |
| <code>--time-selector-separator</code> | Separator typography. |
| <code>--time-selector-separator-color</code> | Separator color. |
| <code>--time-selector-unselected-container-color</code> | Unselected hour or minute selector color. |
| <code>--time-selector-unselected-label-text-color</code> | Unselected hour or minute selector text color. |

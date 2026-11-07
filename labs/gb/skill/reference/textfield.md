# textfield

Elements: `md-gb-text-field`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Text fields**
  - Filled, outlined
  - Supporting text, counter, error, prefix and suffix, icons
  - Text area (`type="textarea"`, fixed height, `rows`)
  - Multi-line text field: starts as a single-line field and grows to fit its lines (`text-fields.md`: "Multi-line text fields grow to accommodate multiple lines of text… These fields initially appear as single-line fields"); `field-sizing: content` with a JS fallback (see `ENGINEERING-BACKLOG.md` item 3)
  - Select and autocomplete (`select`: `md-gb-select`, `md-gb-autocomplete`)

## API

### `<md-gb-text-field>`

A Material Design text field (filled or outlined).

Source: `labs/gb/components/textfield/md-gb-text-field.ts`  
Import: `import '@material/web/labs/gb/components/textfield/md-gb-text-field.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `autocomplete` | `autocomplete` (reflects) | `string` | `''` | The input's `autocomplete` hint. |
| `cols` | `cols` | `number` | `20` | The number of columns of a `type="textarea"` field. |
| `density` | `density` (reflects) | `Density` |  | The density, from 0 (default) to -3. Each step down removes 4px from the container height (56px), half above and half below the content; text keeps its size. Values are clamped to that range. text-fields.md "Avoid applying density by default": dense fields are below the 48x48 CSS pixel target, so let people opt in (a denser layout or theme) and keep the controls that change it at 48x48. |
| `error` | `error` (reflects) | `boolean` | `false` | Whether the field is in a visually invalid state. Overrides the error state set by `reportValidity()`. |
| `errorIcon` | `error-icon` | `ErrorIconVisibility` | `'always'` | When the error icon shows in the trailing edge: `always` (default) in the error state, or `focus` only while the field has focus. Its space stays reserved, so focusing the field does not move the text. |
| `errorText` | `error-text` | `string` | `''` | The message that replaces the supporting text while `error` is true. If empty, the supporting text keeps showing. Overrides the message shown by `reportValidity()`. |
| `hasLeadingIcon` | `has-leading-icon` | `boolean` | `false` | Whether a leading icon is slotted. Set it for SSR. |
| `hasTrailingIcon` | `has-trailing-icon` | `boolean` | `false` | Whether a trailing icon is slotted. Set it for SSR. |
| `inputMode` | `inputmode` (reflects) | `string` | `''` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inputMode) |
| `label` | `label` | `string` | `''` | The floating label. It is also the input's accessible name, unless `aria-label` is set. |
| `max` | `max` | `string` | `''` | The greatest permitted value. |
| `maxLength` | `maxlength` | `number` | `-1` | The maximum number of characters; shows a character counter. -1 for none. |
| `min` | `min` | `string` | `''` | The least permitted value. |
| `minLength` | `minlength` | `number` | `-1` | The minimum number of characters. -1 for none. |
| `multiple` | `multiple` (reflects) | `boolean` | `false` | Whether an email field accepts multiple addresses. |
| `noAsterisk` | `no-asterisk` | `boolean` | `false` | Hides the asterisk added to the label of a required field. |
| `noSpinner` | `no-spinner` | `boolean` | `false` | Hides the spinner of `type="number"` fields. |
| `pattern` | `pattern` | `string` | `''` | A regular expression the value must match. |
| `placeholder` | `placeholder` (reflects) | `string` | `''` | Hint text shown in the input while it is empty and the label is floated (or there is no label). |
| `prefixText` | `prefix-text` | `string` | `''` | Text shown before the input value, such as a currency symbol. |
| `readOnly` | `readonly` (reflects) | `boolean` | `false` | Whether the value cannot be edited. |
| `required` | `required` (reflects) | `boolean` | `false` | Whether a value is required for form submission. Adds an asterisk to the label. |
| `rows` | `rows` | `number` | `2` | The number of rows of a `type="textarea"` field. |
| `step` | `step` | `string` | `''` | The step between permitted numeric values. |
| `suffixText` | `suffix-text` | `string` | `''` | Text shown after the input value, such as a unit. |
| `supportingText` | `supporting-text` | `string` | `''` | Additional information shown below the field. |
| `supportingTextVisibility` | `supporting-text-visibility` | `SupportingTextVisibility` | `'always'` | When the supporting text shows: `always` (default), or `focus` only while the field has focus (text-fields-aed1bf). Its space stays reserved so the layout does not move, it stays in the input's accessible description, and an error message always shows. |
| `textDirection` | `text-direction` | `string` | `''` | Overrides the input's CSS `direction`. |
| `type` | `type` (reflects) | `TextFieldType \| UnsupportedTextFieldType` | `'text'` | The input type, `text` by default. `textarea` renders a multi-line `<textarea>`. |
| `value` | `value` | `string` | `''` | The current value. It is always a string. |
| `variant` | `variant` (reflects) | `TextFieldVariant` | `'filled'` | The variant: `filled` (default) or `outlined`. |

Slots

- `leading-icon`: An icon (or icon button) before the input.
- `trailing-icon`: An icon (or icon button) after the input, such as a clear, visibility or error icon.

Events

- `change` (`Event`): The native `change` event. --bubbles
- `input` (`InputEvent`): The native `input` event. --bubbles --composed
- `invalid` (`Event`): Fired when `checkValidity()` or `reportValidity()` finds the field invalid. --bubbles
- `select` (`Event`): The native `select` event. --bubbles

Methods

- `attributeChangedCallback`: `(attribute: string, oldValue: string, newValue: string) => void` Synchronizes property values when attributes change. Specifically, when an attribute is set, the corresponding property is set. You should rarely need to implement this callback. If this method is overridden, `super.attributeChangedCallback(name, _old, value)` must be called. See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) on MDN for more information about the `attributeChangedCallback`.
- `focus`: `(options?: FocusOptions) => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.
- `reset`: `() => void` Resets the value to the `value` attribute and clears native errors.
- `select`: `() => void` Selects all the text.
- `setCustomValidity`: `(error: string) => void` Sets the element's constraint validation error message. When set to a non-empty string, `validity.customError` will be true and `validationMessage` will display the provided error. Use this method to customize error messages reported. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
- `setRangeText`: `{ (replacement: string): void; (replacement: string, start: number, end: number, selectionMode?: SelectionMode): void; }` Replaces a range of text with a new string.
- `setSelectionRange`: `(start: number, end: number, direction?: "none" | "forward" | "backward") => void` Sets the start and end of the text selection.
- `showPicker`: `() => void` Shows the browser picker of a date, time or color field.
- `stepDown`: `(n?: number) => void` Decrements a numeric value by `step`, `n` times.
- `stepUp`: `(n?: number) => void` Increments a numeric value by `step`, `n` times.

CSS parts

- `::part(container)`: The field's container.
- `::part(counter)`: The character counter.
- `::part(input)`: The native `<input>` or `<textarea>`.
- `::part(label)`: The floating label.
- `::part(supporting-text)`: The supporting or error text.

CSS custom properties

- `--active-indicator-color`: Filled active indicator color.
- `--active-indicator-height`: Filled active indicator thickness.
- `--affix-space`: Space between the prefix/suffix and the input.
- `--bottom-space`: Space below the input.
- `--caret-color`: Input caret color.
- `--container-color`: Container background color.
- `--container-height`: Single-line container height.
- `--container-shape`: Container corner radius.
- `--counter-space`: Space between the supporting text and counter.
- `--density-step`: Container height removed per density step.
- `--icon-input-space`: Space between an icon and the input.
- `--icon-leading-space`: Start padding before a leading icon.
- `--icon-trailing-space`: End padding after a trailing icon.
- `--input-text`: Input typography.
- `--input-text-axes`: Input font variation settings.
- `--input-text-color`: Input text color.
- `--input-text-placeholder-color`: Placeholder color.
- `--input-text-prefix-color`: Prefix text color.
- `--input-text-suffix-color`: Suffix text color.
- `--input-text-tracking`: Input letter spacing.
- `--label-text`: Resting label typography.
- `--label-text-axes`: Label font variation settings.
- `--label-text-color`: Label color.
- `--label-text-populated-line-height`: Floated label line height.
- `--label-text-populated-size`: Floated label font size.
- `--label-text-tracking`: Label letter spacing.
- `--leading-icon-color`: Leading icon color.
- `--leading-icon-size`: Leading icon size.
- `--leading-space`: Start padding without a leading icon.
- `--outline-color`: Outlined container outline color.
- `--outline-label-padding`: Space around the floated label in the outline notch.
- `--outline-width`: Outlined container outline width.
- `--state-layer-color`: Hover state layer color (filled).
- `--supporting-text`: Supporting text typography.
- `--supporting-text-axes`: Supporting text font variation settings.
- `--supporting-text-color`: Supporting text color.
- `--supporting-text-top-space`: Space above the supporting text.
- `--supporting-text-tracking`: Supporting text letter spacing.
- `--top-space`: Space above the content (filled: above the floated label).
- `--trailing-icon-color`: Trailing icon color.
- `--trailing-icon-size`: Trailing icon size.
- `--trailing-space`: End padding without a trailing icon.

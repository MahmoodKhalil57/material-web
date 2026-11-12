# select

Elements: `md-gb-autocomplete`, `md-gb-select`, `md-gb-select-option`.

## API

### `<md-gb-autocomplete>`

A Material Design component.

Source: `material-design-expressive/extras/select/md-gb-autocomplete.ts`  
Import: `import '@material/web/extras/select/md-gb-autocomplete.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | `boolean` |  | Disabled by the attribute or by a disabled fieldset. |
| `error` | `error` (reflects) | `boolean` | `false` | Whether the field is in a visually invalid state. Overrides the error state set by `reportValidity()`. |
| `errorText` | `error-text` | `string` | `''` | The message that replaces the supporting text while `error` is true. Overrides the message shown by `reportValidity()`. |
| `filter` | `filter` | `"none" \| "contains" \| "starts-with"` | `'contains'` | How options are filtered by the typed text: `contains` (default), `starts-with`, or `none` (the page updates the options itself, e.g. from a server, on `input`). |
| `hasLeadingIcon` | `has-leading-icon` | `boolean` | `false` | Whether a leading icon is slotted. Set it for SSR. |
| `label` | `label` | `string` | `''` | The floating label; also the field's accessible name. |
| `name` | `name` | `string` |  | The HTML name to use in form submission. |
| `noAsterisk` | `no-asterisk` | `boolean` | `false` | Hides the asterisk added to the label of a required field. |
| `open` | `open` (reflects) | `boolean` | `false` | Whether the menu is open. |
| `placeholder` | `placeholder` (reflects) | `string` | `''` | Hint text shown in the input while it is empty and the label floats. |
| `required` | `required` (reflects) | `boolean` | `false` | Whether a value is required. Adds an asterisk to the label. |
| `supportingText` | `supporting-text` | `string` | `''` | Additional information shown below the field. |
| `value` | `value` | `string` | `''` | The text in the field. |
| `variant` | `variant` (reflects) | `"filled" \| "outlined"` | `'filled'` | The variant: `filled` (default) or `outlined`. |

Slots

- default slot: The `md-gb-select-option` suggestions.
- `leading-icon`: An icon before the input.
- `trailing-icon`: Replaces the dropdown arrow icon.

Events

- `change` (`Event`): The text was committed (picked option or native change). --bubbles
- `closed` (`Event`): The menu closed.
- `closing` (`Event`): The menu is about to close.
- `input` (`InputEvent`): The text changed by typing or picking an option. --bubbles --composed
- `invalid` (`Event`): Fired when `checkValidity()` or `reportValidity()` finds the field invalid. --bubbles
- `opened` (`Event`): The menu opened.
- `opening` (`Event`): The menu is about to open.

Methods

- `attributeChangedCallback`: `(attribute: string, oldValue: string, newValue: string) => void` Synchronizes property values when attributes change. Specifically, when an attribute is set, the corresponding property is set. You should rarely need to implement this callback. If this method is overridden, `super.attributeChangedCallback(name, _old, value)` must be called. See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) on MDN for more information about the `attributeChangedCallback`.
- `blur`: `() => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur)
- `focus`: `(options?: FocusOptions) => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.
- `reset`: `() => void` Restores the `value` attribute and clears native errors.
- `select`: `() => void` Selects all the text.
- `setCustomValidity`: `(error: string) => void` Sets the element's constraint validation error message. When set to a non-empty string, `validity.customError` will be true and `validationMessage` will display the provided error. Use this method to customize error messages reported. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
- `showPicker`: `() => void` Opens the menu.

CSS parts

- `::part(arrow)`: The dropdown arrow.
- `::part(container)`: The field's container.
- `::part(input)`: The native `<input>`.
- `::part(label)`: The floating label.
- `::part(menu)`: The `listbox` menu.
- `::part(supporting-text)`: The supporting or error text.

CSS custom properties

- `--caret-color`: Input caret color.
- `--container-color`: Field container color.
- `--input-text-color`: Input text color.
- `--label-text-color`: Label color.
- `--menu-min-width`: Minimum menu width.
- `--trailing-icon-expanded-rotation`: Dropdown arrow rotation while open.

### `<md-gb-select>`

A Material Design component.

Source: `material-design-expressive/extras/select/md-gb-select.ts`  
Import: `import '@material/web/extras/select/md-gb-select.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | `boolean` |  | Disabled by the attribute or by a disabled fieldset. |
| `displayText` | `display-text` | `string` |  | The text shown in the field. Defaults to the selected option's `displayText`; set it for SSR. |
| `error` | `error` (reflects) | `boolean` | `false` | Whether the field is in a visually invalid state. Overrides the error state set by `reportValidity()`. |
| `errorText` | `error-text` | `string` | `''` | The message that replaces the supporting text while `error` is true. Overrides the message shown by `reportValidity()`. |
| `hasLeadingIcon` | `has-leading-icon` | `boolean` | `false` | Whether a leading icon is slotted. Set it for SSR. |
| `label` | `label` | `string` | `''` | The floating label; also the field's accessible name. |
| `name` | `name` | `string` |  | The HTML name to use in form submission. |
| `noAsterisk` | `no-asterisk` | `boolean` | `false` | Hides the asterisk added to the label of a required field. |
| `open` | `open` (reflects) | `boolean` | `false` | Whether the menu is open. |
| `required` | `required` (reflects) | `boolean` | `false` | Whether a value is required. Adds an asterisk to the label. |
| `selectedIndex` | `selected-index` | `number` |  | The index of the selected option, or -1. |
| `supportingText` | `supporting-text` | `string` | `''` | Additional information shown below the field. |
| `typeaheadDelay` | `typeahead-delay` | `number` | `DEFAULT_TYPEAHEAD_DELAY` | The longest time between typeahead keystrokes, in milliseconds. |
| `value` | `value` | `string` |  | The value of the selected option, or `''`. Setting it selects the first option with that value (or none). |
| `variant` | `variant` (reflects) | `"filled" \| "outlined"` | `'filled'` | The variant: `filled` (default) or `outlined`. |

Slots

- default slot: The `md-gb-select-option`s (and dividers).
- `leading-icon`: An icon before the selected text.
- `trailing-icon`: Replaces the dropdown arrow icon.

Events

- `change` (`Event`): The person selected a different option. --bubbles
- `closed` (`Event`): The menu closed.
- `closing` (`Event`): The menu is about to close.
- `input` (`InputEvent`): The person selected a different option. --bubbles --composed
- `invalid` (`Event`): Fired when `checkValidity()` or `reportValidity()` finds the select invalid. --bubbles
- `opened` (`Event`): The menu opened.
- `opening` (`Event`): The menu is about to open.

Methods

- `blur`: `() => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur)
- `focus`: `(options?: FocusOptions) => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.
- `reset`: `() => void` Restores the default selection (`selected` attributes).
- `select`: `(value: string) => void` Selects the first option with the given value.
- `selectIndex`: `(index: number) => void` Selects the option at the given index.
- `setCustomValidity`: `(error: string) => void` Sets the element's constraint validation error message. When set to a non-empty string, `validity.customError` will be true and `validationMessage` will display the provided error. Use this method to customize error messages reported. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
- `showPicker`: `() => void` Opens the menu.

CSS parts

- `::part(arrow)`: The dropdown arrow.
- `::part(container)`: The field's container.
- `::part(field)`: The `combobox` showing the selected text.
- `::part(label)`: The floating label.
- `::part(menu)`: The `listbox` menu.
- `::part(supporting-text)`: The supporting or error text.

CSS custom properties

- `--active-indicator-color`: Filled active indicator color.
- `--active-indicator-height`: Filled active indicator thickness.
- `--container-color`: Field container color.
- `--container-shape`: Field container corner radius.
- `--input-text`: Selected text typography.
- `--input-text-axes`: Selected text font variation settings.
- `--input-text-color`: Selected text color.
- `--input-text-tracking`: Selected text letter spacing.
- `--label-text`: Label typography.
- `--label-text-axes`: Label font variation settings.
- `--label-text-color`: Label color.
- `--label-text-populated-line-height`: Floated label line height.
- `--label-text-populated-size`: Floated label font size.
- `--label-text-tracking`: Label letter spacing.
- `--leading-icon-color`: Leading icon color.
- `--leading-icon-size`: Leading icon size.
- `--menu-closed-scale`: Scale the menu opens from.
- `--menu-min-width`: Minimum menu width.
- `--menu-window-margin`: Space kept between the menu and the window edge.
- `--outline-color`: Outlined container outline color.
- `--outline-width`: Outlined container outline width.
- `--supporting-text`: Supporting text typography.
- `--supporting-text-axes`: Supporting text font variation settings.
- `--supporting-text-color`: Supporting text color.
- `--supporting-text-tracking`: Supporting text letter spacing.
- `--trailing-icon-color`: Dropdown arrow color.
- `--trailing-icon-expanded-rotation`: Dropdown arrow rotation while open.
- `--trailing-icon-size`: Dropdown arrow size.

### `<md-gb-select-option>`

A Material Design component.

Source: `material-design-expressive/extras/select/md-gb-select-option.ts`  
Import: `import '@material/web/extras/select/md-gb-select-option.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the option cannot be selected. It can still become active. |
| `displayText` | `display-text` | `string` |  | The text shown in the field when the option is selected. Defaults to the option's label text. |
| `selected` | `selected` | `boolean` |  | Whether the option is selected. The `selected` attribute is the default selection restored on form reset. |
| `typeaheadText` | `typeahead-text` | `string` |  | The text matched by typeahead and filtering. Defaults to `displayText`. |
| `value` | `value` | `string` |  | The form value. Defaults to `displayText`, like a native `<option>`. |

Slots

- default slot: The option's label.
- `leading`: An icon before the label. Without one, a selected option shows a checkmark.
- `supporting-text`: Supporting text below the label.
- `trailing`: An icon after the label.
- `trailing-text`: Metadata after the label, such as a keyboard shortcut.

CSS parts

- `::part(menu-item)`: The option's root element.

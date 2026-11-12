# radio

Elements: `md-gb-radio`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Radio buttons**

## API

### `<md-gb-radio>`

A Material Design component.

Source: `material-design-expressive/components/radio/md-gb-radio.ts`  
Import: `import '@material/web/components/radio/md-gb-radio.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `checked` | `checked` | `boolean` |  | Whether or not the radio is selected. |
| `density` | `density` (reflects) | `0 \| -1 \| -2 \| -3` |  | The density, from 0 (default) to -3. Each step down removes 4px from the radio's layout box (48px) and state layer (40px); the touch target stays 48px. Values are clamped to that range. radio-button.md: don't apply density by default; let people opt in to a denser layout. |
| `disabled` | `disabled` | `boolean` |  | Disabled by the attribute or by a disabled fieldset. |
| `name` | `name` | `string` |  | The HTML name to use in form submission. |
| `required` | `required` | `boolean` | `false` | Whether or not the radio is required. If any radio is required in a group, all radios are implicitly required. |
| `value` | `value` | `string` | `'on'` | The element value to use in form submission when checked. |

Events

- `change` (`Event`): Fired when the radio is checked (but not unchecked). --bubbles
- `input` (`InputEvent`): Fired when the radio is checked (but not unchecked). --bubbles --composed

Methods

- `attributeChangedCallback`: `(name: string, oldValue: string, newValue: string) => void` Synchronizes property values when attributes change. Specifically, when an attribute is set, the corresponding property is set. You should rarely need to implement this callback. If this method is overridden, `super.attributeChangedCallback(name, _old, value)` must be called. See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) on MDN for more information about the `attributeChangedCallback`.
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.

CSS parts

- `::part(radio)`: The radio's root element.

CSS custom properties

- `--density-step`: Size removed per density step.
- `--icon-color`
- `--icon-size`
- `--state-layer-color`
- `--state-layer-shape`
- `--state-layer-size`: State layer size at density 0.
- `--target-size`: The minimum touch target size, kept at any density.

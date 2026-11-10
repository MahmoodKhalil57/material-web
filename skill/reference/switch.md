# switch

Elements: `md-gb-switch`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Switch**
  - Icons, selected, disabled
  - Token file generated from the spec: handle sizes, disabled colors and opacities

## API

### `<md-gb-switch>`

A Material Design component.

Source: `components/switch/md-gb-switch.ts`  
Import: `import '@material/web/components/switch/md-gb-switch.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | `density` (reflects) | `Density` |  | The density, from 0 (default) to -3. Each step down removes 4px from the state layer (40px); the track keeps its size and the touch target stays 48px. Values are clamped to that range. switch.md: don't apply density by default; let people opt in to a denser layout. |
| `required` | `required` | `boolean` | `false` | When true, require the switch to be selected when participating in form submission. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation |
| `selected` | `selected` | `boolean` |  | Puts the switch in the selected state and sets the form submission value to the `value` property. |
| `value` | `value` | `string` | `'on'` | The value associated with this switch on form submission. `null` is submitted when `selected` is `false`. |

Slots

- `off-icon`: Used to show an icon when the switch is unselected.
- `on-icon`: Used to show an icon when the switch is selected.

Events

- `change` (`Event`): Fired when the switch is selected or unselected. --bubbles
- `input` (`InputEvent`): Fired when the switch is selected or unselected. --bubbles --composed

Methods

- `attributeChangedCallback`: `(name: string, oldValue: string, newValue: string) => void` Synchronizes property values when attributes change. Specifically, when an attribute is set, the corresponding property is set. You should rarely need to implement this callback. If this method is overridden, `super.attributeChangedCallback(name, _old, value)` must be called. See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) on MDN for more information about the `attributeChangedCallback`.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.

CSS parts

- `::part(switch)`: The switch's root element.

CSS custom properties

- `--density-step`: State layer size removed per density step.
- `--handle-color`
- `--handle-height`
- `--handle-shape`
- `--handle-width`
- `--icon-color`
- `--icon-size`
- `--state-layer-color`
- `--state-layer-shape`
- `--state-layer-size`: State layer size at density 0.
- `--target-size`: The minimum touch target size, kept at any density.
- `--track-color`
- `--track-height`
- `--track-opacity`
- `--track-outline-color`
- `--track-outline-width`
- `--track-shape`
- `--track-width`
- `--with-icon-handle-height`
- `--with-icon-handle-width`

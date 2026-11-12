# slider

Elements: `md-gb-slider`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Sliders**
  - Sizes xs–xl
  - Standard, range, centered
  - Ticks / discrete
  - Value label
  - Vertical
  - Inset icons

## API

### `<md-gb-slider>`

A Material Design slider component.

Source: `material-design-expressive/components/slider/md-gb-slider.ts`  
Import: `import '@material/web/components/slider/md-gb-slider.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `ariaLabelEnd` | `label-end` | `string` | `''` | The accessible name of the upper handle of a `range` slider (default: `aria-label` + " end"). |
| `ariaLabelStart` | `label-start` | `string` | `''` | The accessible name of the lower handle of a `range` slider (default: `aria-label` + " start"). |
| `ariaValueTextEnd` | `valuetext-end` | `string` | `''` | The accessible value text of the upper handle (default: `value-label-end`, then the number). |
| `ariaValueTextStart` | `valuetext-start` | `string` | `''` | The accessible value text of the lower handle (default: `value-label-start`, then the number). |
| `centered` | `centered` (reflects) | `boolean` | `false` | Whether the active track starts at the middle of the range, for values with a neutral point. |
| `disabled` | `disabled` | `boolean` |  | Disabled by the attribute or by a disabled fieldset. |
| `labeled` | `labeled` | `boolean` | `false` | Whether to show the value indicator above the handle while it is hovered, pressed or keyboard-focused. |
| `max` | `max` | `number` | `100` | The largest value. |
| `min` | `min` | `number` | `0` | The smallest value. |
| `name` | `name` | `string` |  | The HTML name to use in form submission. |
| `orientation` | `orientation` (reflects) | `"horizontal" \| "vertical"` | `'horizontal'` | The orientation of the slider. Vertical orientation applies to standard, discrete, and centered variants (range is not supported in vertical orientation). |
| `range` | `range` (reflects) | `boolean` | `false` | Whether the slider selects a range with two handles (`value-start`, `value-end`). |
| `size` | `size` (reflects) | `"sm" \| "md" \| "lg" \| "xs" \| "xl"` | `'xs'` | The size: `xs` (default), `sm`, `md`, `lg` or `xl`. |
| `step` | `step` | `"any" \| number` | `1` | The step between values, or `'any'` for a continuous slider. Arrow keys move by one step; with `ticks`, a stop shows at each step. |
| `ticks` | `ticks` | `boolean` | `false` | Whether to show a stop indicator at each `step`. |
| `value` | `value` | `number` |  | The value of a standard or centered slider (not `range`). |
| `valueEnd` | `value-end` | `number` |  | The upper value of a `range` slider. |
| `valueLabel` | `value-label` | `string` | `''` | The text of the value indicator and the handle's accessible value, when the number alone is unclear (`5 minutes`). The slider does not format numbers itself. |
| `valueLabelEnd` | `value-label-end` | `string` | `''` | `value-label` for the upper handle of a `range` slider. |
| `valueLabelStart` | `value-label-start` | `string` | `''` | `value-label` for the lower handle of a `range` slider. |
| `valueStart` | `value-start` | `number` |  | The lower value of a `range` slider. |

Slots

- `icon`: An optional leading inset icon (`md-gb-icon`): the standard horizontal slider, sizes `md`, `lg` and `xl`.

Events

- `change` (`Event`): Fired when the slider value commit changes from user interaction. --bubbles
- `input` (`InputEvent`): Fired when the slider value changes from user interaction. --bubbles --composed

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `focus`: `() => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: string | [string, string][]) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.

CSS custom properties

- `--active-handle-leading-space`
- `--active-track-color`
- `--active-track-inner-corner-size`
- `--focus-handle-width`
- `--handle-color`
- `--handle-height`
- `--handle-shape`
- `--handle-width`
- `--icon-color`
- `--icon-color-active`
- `--icon-size`
- `--inactive-track-color`
- `--inactive-track-shape-trailing`
- `--state-layer-size`
- `--stop-indicator-color`
- `--stop-indicator-color-selected`
- `--stop-indicator-min-spacing`
- `--stop-indicator-size`
- `--track-height`
- `--track-shape`
- `--value-indicator-bottom-space`
- `--value-indicator-color`
- `--value-indicator-label-text-color`
- `--value-indicator-width`
- `--with-overlap-handle-outline-color`
- `--with-overlap-handle-outline-width`

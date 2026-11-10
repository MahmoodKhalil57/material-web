# segmentedbutton

Elements: `md-gb-segmented-button`, `md-gb-segmented-button-set`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Segmented buttons**
  - Single-select, multi-select; 2–5 segments; label and/or icon
  - Checkmark animation, density 0 to -3, disabled
  - Note: the Expressive spec points to connected button groups instead.

## API

### `<md-gb-segmented-button>`

One segment of a Material Design segmented button set.

Source: `components/segmentedbutton/md-gb-segmented-button.ts`  
Import: `import '@material/web/components/segmentedbutton/md-gb-segmented-button.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the segment is disabled. |
| `focusable` | property only | `boolean` | `true` | Whether the segment is the set's tab stop (roving `tabindex`). Set by `md-gb-segmented-button-set`. |
| `groupDisabled` | property only | `boolean` | `false` | Whether the parent set is disabled. Set by `md-gb-segmented-button-set`. |
| `label` | `label` | `string` | `''` | Label text, rendered before the default slot's content. |
| `mode` | property only | `SegmentedButtonMode` | `'single'` | The selection mode of the parent set: `radio` semantics for `single`, `checkbox` for `multiple`. Set by `md-gb-segmented-button-set`. |
| `noCheckmark` | `no-checkmark` | `boolean` | `false` | Whether to hide the checkmark that shows when selected. |
| `selected` | `selected` (reflects) | `boolean` | `false` | Whether the segment is selected. |
| `value` | `value` | `string` | `''` | The value submitted with the set's form when selected. |

Slots

- default slot: The label text.
- `icon`: An optional leading icon, such as `<md-gb-icon>`.

CSS parts

- `::part(button)`: The segment's `<button>`.

CSS custom properties

- `--container-height`: Segment height at density 0.
- `--container-shape`: Outer corner radius of the first and last segments.
- `--density-step`: Height removed per density step.
- `--icon-label-space`: Space between the icon and the label.
- `--icon-size`: Icon and checkmark size.
- `--label-text`: Label typography.
- `--label-text-axes`: Label font variation settings.
- `--label-text-tracking`: Label letter spacing.
- `--leading-space`: Padding before the content.
- `--min-width`: Minimum segment width.
- `--outline-color`: Outline color.
- `--outline-width`: Outline width.
- `--target-size`: Minimum touch target height.
- `--trailing-space`: Padding after the content.

### `<md-gb-segmented-button-set>`

A Material Design segmented button set.

Source: `components/segmentedbutton/md-gb-segmented-button-set.ts`  
Import: `import '@material/web/components/segmentedbutton/md-gb-segmented-button-set.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | `density` (reflects) | `SegmentedButtonDensity` |  | The density, from 0 (default, 40px) to -3. Each step down removes 4px from the height. Values are clamped to that range. |
| `multiselect` | `multiselect` (reflects) | `boolean` | `false` | Whether more than one segment can be selected. |
| `required` | `required` (reflects) | `boolean` | `false` | In single-select mode, whether a segment must stay selected: the selected segment can't be unselected. |

Slots

- default slot: The `md-gb-segmented-button` segments.

Events

- `change` (`Event`): Fired when the user changes the selection. --bubbles
- `input` (`InputEvent`): Fired when the user changes the selection. --bubbles --composed

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: FormRestoreState) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.

CSS custom properties

- `--container-height`: Segment height at density 0.
- `--container-shape`: Outer corner radius of the first and last segments.
- `--density-step`: Height removed per density step.
- `--icon-label-space`: Space between the icon and the label.
- `--icon-size`: Icon and checkmark size.
- `--label-text`: Label typography.
- `--label-text-axes`: Label font variation settings.
- `--label-text-tracking`: Label letter spacing.
- `--leading-space`: Padding before each segment's content.
- `--min-width`: Minimum segment width.
- `--outline-color`: Outline color.
- `--outline-width`: Outline width.
- `--target-size`: Minimum touch target height.
- `--trailing-space`: Padding after each segment's content.

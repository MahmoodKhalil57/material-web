# chip

Elements: `md-gb-chip`, `md-gb-chip-set`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Chips**
  - Assist, filter, input, suggestion (old type names kept as aliases)
  - Leading icon or avatar, remove button, checkmark when selected
  - Elevated / flat, selected, disabled, dragged
  - Chip set (`md-gb-chip-set`): one tab stop, arrow keys (RTL aware), Home/End, focus after removal

## API

### `<md-gb-chip>`

A Material Design Expressive Chip component.

Source: `components/chip/md-gb-chip.ts`  
Import: `import '@material/web/components/chip/md-gb-chip.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `ChipColor` | `"flat"` |  |
| `density` | `density` (reflects) | `Density` |  | The density, from 0 (default) to -3. Each step down removes 4px from the container height (32px); the label and icons keep their size and the touch target stays 48px (chips.md: "regardless of placement or density"). Values are clamped to that range. Density 0 inherits the density of an enclosing `md-gb-chip-set`. chips.md: don't apply density by default; let people opt in to a denser layout. |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the chip is disabled. |
| `dragged` | `dragged` (reflects) | `boolean` | `false` | Whether the chip is being dragged (spec dragged state elevation). |
| `editable` | `editable` (reflects) | `boolean` | `false` | Whether the text of an input chip can be edited (chips.md "Input chips": "Input chips can support editing to change their contents, such as correcting an email address"). Editing starts by interacting with the chip: a second click, Enter or Space on the selected chip, or a double click. Committing with Enter or by leaving the field changes the chip's text and fires `edit`; Escape (or emptying the text) keeps the old text. |
| `elevated` | `elevated` (reflects) | `boolean` | `false` | Elevated container, for chips on images or complex backgrounds. Input chips have no elevated style. |
| `groupDisabled` | property only | `boolean` | `false` | Whether the chip's set is disabled (a disabled form fieldset). |
| `href` | `href` | `string` | `""` | The URL destination; makes an assist chip a link. |
| `referrerPolicy` | `referrerpolicy` | `string` | `""` | Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when `href` is set. |
| `rel` | `rel` | `string` | `""` | Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is set. |
| `removable` | `removable` (reflects) | `boolean` | `false` | Whether the chip has a remove button (input chips). |
| `removeLabel` | `remove-label` | `string` | `""` | The remove button's accessible label. Defaults to "Remove {chip label}" (spec: the remove action is labeled separately). |
| `selected` | `selected` (reflects) | `boolean` | `false` | Whether the filter (or input) chip is selected. |
| `softDisabled` | `soft-disabled` (reflects) | `boolean` | `false` | Whether the chip is soft-disabled (`aria-disabled="true"` while preserving focusability). |
| `target` | `target` | `"" \| "_blank" \| "_parent" \| "_self" \| "_top"` | `""` | Where to display the linked `href` URL for a link chip. |
| `type` | `type` | `ChipType` | `"assist"` | The chip type: `assist` (default), `filter`, `input` or `suggestion`. |
| `value` | `value` | `string` |  | The value a chip set submits while the chip is selected. Defaults to the label text, like a native `<option>`. |

Slots

- default slot: The chip label text.
- `icon`: An optional leading icon, or an avatar (`class="chip-avatar"` or an `<img>`; input chips).
- `remove-icon`: The remove button icon when `removable` (default: the `close` symbol).
- `trailing-icon`: An optional trailing icon (filter chips, e.g. a drop-down arrow).

Events

- `change` (`Event`): Fired when a filter chip's selection changes. --bubbles
- `edit` (`CustomEvent`): Fired when an `editable` chip's new text is committed; `detail` has `value` and `previousValue`. --bubbles --composed
- `input` (`InputEvent`): Fired when a filter chip's selection changes. --bubbles --composed
- `remove` (`Event`): Fired when the remove button is activated, or Backspace / Delete is pressed on a removable chip. --bubbles --composed
- `update-focus` (`Event`): Fired when `disabled` changes, so a chip set can update its tab stop. --bubbles

Methods

- `cancelEdit`: `() => void` Ends editing and keeps the old text.
- `commitEdit`: `() => void` Ends editing and applies the new text (empty or unchanged text keeps the old).
- `focus`: `(options?: FocusOptions & { trailing?: boolean; }) => void` Focuses the chip's primary action, or its remove button with `{trailing: true}` (chip set navigation backwards into a chip).
- `startEdit`: `() => void` Turns an editable input chip into a text string to edit. Does nothing for other chips.

CSS parts

- `::part(chip)`: The root container element.

CSS custom properties

- `--avatar-opacity`
- `--avatar-shape`
- `--avatar-size`
- `--container-color`
- `--container-elevation`
- `--container-height`: Container height at density 0.
- `--container-shape`
- `--density-step`: Container height removed per density step.
- `--icon-label-space`
- `--label-text`
- `--label-text-color`
- `--leading-icon-color`
- `--leading-icon-size`
- `--leading-space`
- `--outline-color`
- `--outline-width`
- `--target-size`: The minimum touch target size, kept at any density.
- `--trailing-icon-color`
- `--trailing-icon-size`
- `--trailing-space`

### `<md-gb-chip-set>`

A Material Design Expressive chip set.

Source: `components/chip/md-gb-chip-set.ts`  
Import: `import '@material/web/components/chip/md-gb-chip-set.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | `density` (reflects) | `Density` |  | The density of the chips, from 0 (default) to -3: each step down removes 4px from the chips' height. A chip's own non-zero `density` wins. Values are clamped to that range. |
| `required` | `required` (reflects) | `boolean` | `false` | Single-select: the selected chip can't be unselected. |
| `selection` | `selection` (reflects) | `SelectionMode` | `"multiple"` | How many filter chips can be selected: `none`, `single` or `multiple`. |
| `singleLine` | `single-line` (reflects) | `boolean` | `false` | Keep the chips on one line and scroll horizontally instead of wrapping. |

Slots

- default slot: The chips.

Methods

- `formDisabledCallback`: `(disabled: boolean) => void` A callback for when a form component should be disabled or enabled. This can be called in a variety of situations, such as disabled `<fieldset>`s.
- `formResetCallback`: `() => void` An optional callback for when the form requests to reset its value. Typically, the default value that is reset is represented in the attribute of an element. This means the attribute used for the value should not update as the value changes. For example, a checkbox should not change its default `checked` attribute when selected. Ensure form values do not reflect.
- `formStateRestoreCallback`: `(state: FormRestoreState) => void` An optional callback for when the form restores the state of a component. For example, when a page is reloaded or forms are autofilled.

CSS custom properties

- `--chip-set-overflow-inset`: Room kept for touch targets and focus rings when a single-line set clips its overflow.
- `--chip-set-space`: The space between chips and between lines.

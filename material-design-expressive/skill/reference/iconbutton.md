# iconbutton

Elements: `md-gb-icon-button`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Icon buttons**
  - Colors: standard, filled, tonal, outlined
  - Sizes xs–xl
  - Widths: narrow, default, wide
  - Shapes: round, square
  - Toggle
  - Token file generated from the spec; no gaps

## API

### `<md-gb-icon-button>`

A Material Design component.

Source: `material-design-expressive/components/iconbutton/md-gb-icon-button.ts`  
Import: `import '@material/web/components/iconbutton/md-gb-icon-button.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"standard" \| "filled" \| "tonal" \| "outlined"` | `'standard'` | The color of the button. |
| `density` | `density` (reflects) | `0 \| -1 \| -2 \| -3` |  | The density, from 0 (default) to -3. Each step down removes 4px from the container height (and the width of a default-width button); the icon keeps its size and the touch target stays at least 48px. Values are clamped to that range. Density 0 inherits the density of an enclosing `md-gb-button-group`. icon-buttons.md: don't apply density by default; let people opt in to a denser layout. |
| `disabled` | `disabled` | `boolean` |  | Whether or not the element is disabled. |
| `download` | `download` | `string` | `''` | The filename to use when downloading the linked resource. |
| `href` | `href` | `string` | `''` | The URL that the link button points to. |
| `name` | `name` | `string` |  | The HTML name to use in form submission. When combined with a `value`, the submitting button's name/value will be added to the form. Names must reflect to a `name` attribute for form integration. The HTML name to use in form submission. |
| `referrerPolicy` | `referrerpolicy` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when `href` is set. |
| `rel` | `rel` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is set. |
| `selected` | `selected` (reflects) | `boolean` | `false` | Whether or not the button is selected, when `type="toggle"`. TODO: replace reflected `[selected]` with `:state(selected)` |
| `size` | `size` | `"sm" \| "md" \| "lg" \| "xs" \| "xl"` | `'sm'` | The size of the button. |
| `softDisabled` | `soft-disabled` (reflects) | `boolean` | `false` | Whether or not the button is "soft-disabled" (disabled but still focusable). |
| `square` | `square` | `boolean` | `false` | Changes the shape of the button to be square. |
| `target` | `target` | `"" \| "_blank" \| "_parent" \| "_self" \| "_top"` | `''` | Where to display the linked `href` URL for a link button. |
| `tooltip` | `tooltip` (reflects) | `boolean` | `false` | Shows a tooltip with the button's accessibility label (`aria-label`) on hover and keyboard focus. The label should describe the action, not name the icon. |
| `type` | `type` (reflects) | `string` |  | A string indicating the behavior of the button. - "submit" (default): A button that submits its associated form. - "reset": A button that resets its associated form. - "button": A normal button. - "toggle": A toggle button using the `selected` property. - "link": An anchor link (`<a>`). Type is always "link" when `href` is set. |
| `unfilledIcon` | `unfilled-icon` (reflects) | `boolean` | `false` | Set when the icon has no filled version: a selected toggle button then shows the icon in semibold weight instead of filled. |
| `value` | `value` (reflects) | `string` |  | The value of the button. When combined with a `name`, the submitting button's name/value will be added to the form. |
| `width` | `width` | `"" \| "narrow" \| "wide"` | `''` | Changes the width of the button. |

Slots

- default slot: Used to display an icon.

Events

- `change` (`Event`): Fired when a toggle button is selected or unselected. --bubbles
- `input` (`InputEvent`): Fired when a toggle icon button is selected or unselected. --bubbles --composed

CSS parts

- `::part(icon-btn)`: The icon button's root element.

CSS custom properties

- `--container-color`
- `--container-height`: Container height at density 0.
- `--container-shape`: The resolved shape; defaults to the round or square shape.
- `--container-shape-round`
- `--container-shape-square`
- `--density-step`: Container height removed per density step.
- `--icon-color`
- `--icon-size`
- `--leading-space`
- `--md-icon-fill`
- `--outline-color`
- `--outline-width`
- `--target-size`: The minimum touch target size, kept at any density.
- `--trailing-space`

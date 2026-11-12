# button

Elements: `md-gb-button`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Buttons**
  - Colors: elevated, filled, tonal, outlined, text
  - Sizes: xs, sm, md, lg, xl
  - Shapes: round, square
  - Toggle (selected / unselected)
  - Shape morph on press and selection
  - Token file generated from the spec: toggle colors, square/pressed shapes, icon sizes
  - 48dp touch target for xs/sm

## API

### `<md-gb-button>`

A Material Design button.

Source: `material-design-expressive/components/button/md-gb-button.ts`  
Import: `import '@material/web/components/button/md-gb-button.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"filled" \| "elevated" \| "tonal" \| "outlined" \| "text"` | `'text'` | The color of the button. |
| `disabled` | `disabled` | `boolean` |  | Whether or not the element is disabled. |
| `download` | `download` | `string` | `''` | The filename to use when downloading the linked resource. If not specified, the browser will determine a filename. This is only applicable when the button is used as a link (`href` is set). |
| `href` | `href` | `string` | `''` | The URL that the link button points to. |
| `name` | `name` | `string` |  | The HTML name to use in form submission. When combined with a `value`, the submitting button's name/value will be added to the form. Names must reflect to a `name` attribute for form integration. The HTML name to use in form submission. |
| `referrerPolicy` | `referrerpolicy` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `referrerpolicy` attribute when `href` is set. |
| `rel` | `rel` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `rel` attribute when `href` is set. |
| `selected` | `selected` (reflects) | `boolean` | `false` | Whether or not the button is selected, when `type="toggle"`. TODO: replace reflected `[selected]` with `:state(selected)` |
| `size` | `size` | `"sm" \| "md" \| "lg" \| "xs" \| "xl"` | `'sm'` | The size of the button. |
| `softDisabled` | `soft-disabled` (reflects) | `boolean` | `false` | Whether or not the button is "soft-disabled" (disabled but still focusable). Use this when a button needs increased visibility when disabled. See https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls for more guidance on when this is needed. |
| `square` | `square` | `boolean` | `false` | Changes the shape of the button to be square. |
| `target` | `target` | `"" \| "_blank" \| "_parent" \| "_self" \| "_top"` | `''` | Where to display the linked `href` URL for a link button. Common options include `_blank` to open in a new tab. |
| `type` | `type` (reflects) | `string` |  | A string indicating the behavior of the button. - "submit" (default): A button that submits its associated form. - "reset": A button that resets its associated form. - "button": A normal button. - "toggle": A toggle button using the `selected` property. - "link": An anchor link (`<a>`). Type is always "link" when `href` is set. |
| `unfilledIcon` | `unfilled-icon` (reflects) | `boolean` | `false` | Set when the icon has no filled version: a selected toggle button then shows the icon in semibold weight instead of filled. |
| `value` | `value` (reflects) | `string` |  | The value of the button. When combined with a `name`, the submitting button's name/value will be added to the form. |

Slots

- default slot: Used to display a label and optional icon.
- `container`: Used to set a custom background container for the button.

Events

- `change` (`Event`): Fired when a toggle button is selected or unselected. --bubbles
- `input` (`InputEvent`): Fired when a toggle button is selected or unselected. --bubbles --composed

CSS parts

- `::part(btn)`: The button's root element.

CSS custom properties

- `--container-color`
- `--container-elevation`
- `--container-height`
- `--container-shape`: The resolved shape; defaults to the round or square shape.
- `--container-shape-round`
- `--container-shape-square`
- `--icon-color`
- `--icon-label-space`
- `--icon-size`
- `--label-text`
- `--label-text-axes`
- `--label-text-color`
- `--label-text-tracking`
- `--leading-space`
- `--md-icon-fill`
- `--outline-color`
- `--outline-width`
- `--state-layer-color`
- `--trailing-space`

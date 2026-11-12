# splitbutton

Elements: `md-gb-split-button`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Split button**
  - Colors
  - Sizes xs–xl
  - Menu trigger, selected state

## API

### `<md-gb-split-button>`

A Material Design component.

Source: `material-design-expressive/components/splitbutton/md-gb-split-button.ts`  
Import: `import '@material/web/components/splitbutton/md-gb-split-button.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `"filled" \| "elevated" \| "tonal" \| "outlined"` | `'filled'` | The color style: `filled` (default), `elevated`, `tonal` or `outlined`. |
| `selected` | `selected` | `boolean` | `false` | Whether the trailing button shows its selected (open) state. Set while the menu the trailing button opens (its `popovertarget`) is open. |
| `size` | `size` | `"sm" \| "md" \| "lg" \| "xs" \| "xl"` | `'sm'` | The size: `xs`, `sm` (default), `md`, `lg` or `xl`. |

Slots

- default slot: Used to render the trailing button's popover menu.
- `leading`: Requires a `<button>` for the main action.
- `trailing`: Requires a `<button>` for the menu action. Use `popovertarget` to display a menu.

CSS parts

- `::part(leading-btn)`: The split button's main action.
- `::part(split-btn)`: The split button's root element.
- `::part(trailing-btn)`: The split button's menu action.

CSS custom properties

- `--between-space`
- `--icon-size`
- `--inner-corner-size`
- `--leading-space`
- `--outer-corner-size`
- `--trailing-space`

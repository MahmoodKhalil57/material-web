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

Source: `labs/gb/components/splitbutton/md-gb-split-button.ts`  
Import: `import '@material/web/labs/gb/components/splitbutton/md-gb-split-button.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `SplitButtonColor` | `'filled'` |  |
| `selected` | `selected` | `boolean` | `false` |  |
| `size` | `size` | `SplitButtonSize` | `'sm'` |  |

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

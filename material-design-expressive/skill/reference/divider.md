# divider

Elements: `md-gb-divider`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Divider**
  - Horizontal, vertical
  - Inset, inset-start, inset-end

## API

### `<md-gb-divider>`

A Material Design component.

Source: `material-design-expressive/components/divider/md-gb-divider.ts`  
Import: `import '@material/web/components/divider/md-gb-divider.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `inset` | `inset` (reflects) | `boolean` | `false` | Indents both ends 16dp (spec: middle-inset divider). |
| `insetEnd` | `inset-end` (reflects) | `boolean` | `false` | Indents the trailing end 16dp. |
| `insetStart` | `inset-start` (reflects) | `boolean` | `false` | Indents the leading end 16dp (spec: inset divider). |
| `vertical` | `vertical` (reflects) | `boolean` | `false` | Whether or not the divider is vertical. |

CSS parts

- `::part(divider)`: The divider element.

CSS custom properties

- `--color`
- `--inset-leading-space`
- `--inset-trailing-space`
- `--thickness`
